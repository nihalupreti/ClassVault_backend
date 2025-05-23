const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
  _id: { type: String },
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
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], // Array of subject ids
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to set the `id` automatically
semesterSchema.pre("save", function (next) {
  this._id = `${this.faculty}-${this.semesterNumber}`; //BCA-1, BCE-2....
  next();
});

const Semester = mongoose.model("Semester", semesterSchema);

module.exports = Semester;
