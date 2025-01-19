const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        student_id: { type: String, required: true },
        assignment_title: { type: String, required: true },
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "File",
            required: true,
        },
        submitted_at: { type: Date, required: true },
        grade: {
            score: { type: Number, default: null },
            feedback: { type: String, default: null },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
