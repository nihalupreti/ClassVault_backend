const Summary = require("../models/Summeries");
const Batch = require("../models/Batch");

module.exports = (io, socket) => {
  console.log("Socket connection established: ", socket.id); // Log socket connection

  // Emit an event when a new summary is added to the database
  Summary.watch().on("change", async function (change) {
    console.log("Change stream triggered:", change); // Log change stream events

    if (change.operationType === "insert") {
      const newSummary = change.fullDocument;
      console.log("New summary document:", newSummary);

      const existingSummary = await Summary.findOne({
        pdf_id: newSummary.pdf_id,
      });
      if (existingSummary) {
        console.log(
          "Summary already exists in the database, notifying clients."
        );
        io.emit("summary_ready", {
          pdf_id: existingSummary.pdf_id,
          custom_summary: existingSummary.custom_summary,
          transformer_summary: existingSummary.transformer_summary,
        });
      } else {
        console.log("Summary still being generated, no need to emit.");
      }
    }
  });

  socket.on("request_summary_status_for_course", async ({ courseId }) => {
    try {
      const course = await Batch.findById(courseId);
      if (!course) {
        console.log("Course not found");
        return socket.emit("summary_error", { error: "Course not found" });
      }

      if (!course.files || course.files.length === 0) {
        console.log("No files found in the course");
        return socket.emit("summary_error", {
          error: "No files found in this course",
        });
      }

      console.log("Course and files found. Checking status...");

      // Fetch summaries for the course files
      const fileStatuses = await Promise.all(
        course.files.map(async (file) => {
          const fileId = file._id ? file._id.toString() : null;

          if (!fileId) {
            console.log("File ID missing for a file in course:", file);
            return {
              fileId: "unknown",
              status: "error",
              error: "File ID missing",
            };
          }

          console.log(`Checking summary for file ${fileId}`);

          // Use a string-based query to match pdf_id
          console.log("🔍 Searching summary with:", { pdf_id: fileId });
          const summary = await Summary.findOne({
            pdf_id: fileId,
          });

          if (summary) {
            console.log(`✅ Summary found for file ${fileId}`);
            return {
              fileId,
              status: "ready",
              custom_summary: summary.custom_summary,
              transformer_summary: summary.transformer_summary,
            };
          } else {
            console.log(`⏳ Summary still processing for file ${fileId}`);
            return { fileId, status: "processing" };
          }
        })
      );

      // Send the status back to the frontend
      console.log("Emitting summary status to frontend:", fileStatuses);
      socket.emit("summary_status_for_course", {
        courseId,
        filesStatus: fileStatuses,
      });
    } catch (error) {
      console.error("Error checking summary status:", error);
      socket.emit("summary_error", {
        error: "Error retrieving summary status.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};
