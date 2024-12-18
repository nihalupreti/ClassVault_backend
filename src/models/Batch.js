const mongoose = require("mongoose");

const batchSchema = mongoose.Schema({
  Semester: { type: String, ref: "Semester" },
  faculty: {
    type: String,
    enum: ["BCE", "BCA"], //TODO: More faculty to add
    require: true,
  },
  timing: { type: String, enum: ["mrng", "day"] },
  subject: {
    courseName: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
});

const Batch = mongoose.model("Batch", batchSchema);

module.exports = Batch;
