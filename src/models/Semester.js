const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  semesterNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  faculty: {
    type: String,
    required: true,
    enum: ["BCA", "BCE"],
  },
  subjectList: {
    type: [String], // Array of subject names
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to set the `key` automatically
semesterSchema.pre("save", function (next) {
  this.key = `${this.faculty}${this.semesterNumber}`; //BCA1, BCE2....
  next();
});

const Semester = mongoose.model("Semester", semesterSchema);

module.exports = Semester;
