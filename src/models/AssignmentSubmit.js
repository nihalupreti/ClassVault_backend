const mongoose = require("mongoose");

const assignmentSubmitSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "StudentUser" },
    files: [
      { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    ],
    grade: {
      score: { type: Number, default: null },
      feedback: { type: String, default: null },
    },
    status: {
      type: String,
      enum: ["graded", "submitted", "notSubmitted", "dueDate", "pastDue"],
      default: "notSubmitted",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignmentSubmit", assignmentSubmitSchema);
