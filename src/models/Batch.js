const mongoose = require("mongoose");

const batchSchema = mongoose.Schema(
  {
    faculty: {
      type: [{ type: String, ref: "Semester" }], //eg: BCA-1-MRG, BCE-6-DAY. TODO: regex validation
      require: true,
    },
    imageUrl: { type: String },
    description: { type: String },
    subject: {
      courseName: { type: String, ref: "Subject" },
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: "TeacherUser" },
    },
    files: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    },
  },
  { timestamps: true }
);

const Batch = mongoose.model("Batch", batchSchema);

module.exports = Batch;
