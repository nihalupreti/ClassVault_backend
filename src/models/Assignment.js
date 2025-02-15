const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "TeacherUser" },
    assignment_title: { type: String, required: true },
    files: [
      { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    ],
    grading: {
      type: String,
      enum: ["auto", "manual"],
      required: true,
    },
    dueDate: { type: Date, required: true },
    mark: {
      type: Number,
      required: function () {
        return this.grade === "auto"; // Required only if grade is "auto"
      },
      min: 0,
    },
    percentCutoff: {
      type: Number,
      required: function () {
        return this.grade === "auto";
      },
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
