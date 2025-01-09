const mongoose = require("mongoose");
const calcCurrentSem = require("../utils/calcCurrentSem");

const studentUserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  studentCode: { type: String, required: true }, //eg: BCA-1-MRNG
  studentCodeGeneral: { type: String, required: true }, //eg: BCA-1
  enrolledIn: {
    type: Number,
    required: true,
    min: 2018,
    max: new Date().getFullYear(),
    validate: {
      validator: (value) => Number.isInteger(value),
      message: "only integer allowed.",
    },
  },
  enrolledIntake: { type: String, enum: ["fall", "spring"], required: true },
  timing: { type: String, enum: ["mrng", "day"] },
  batchEnrolled: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Batch" }],
  },
  semNumber: { type: Number, min: 1, max: 8, required: true },
  faculty: {
    type: String,
    enum: ["BCE", "BCA"], //TODO: More faculty to add
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  role: {
    type: String,
    default: "student",
    immutable: true,
  },
  groups: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  },
});

studentUserSchema.pre("validate", function (next) {
  if (this.enrolledIn && this.enrolledIntake && this.faculty && this.timing) {
    this.semNumber = 2; //calcCurrentSem(this.enrolledIn, this.enrolledIntake); TODO:calculated sem properly
    this.studentCode =
      `${this.faculty}-${this.semNumber}-${this.timing}`.toUpperCase();
    this.studentCodeGeneral = `${this.faculty}-${this.semNumber}`.toUpperCase();
  }
  next();
});

const StudentUser = mongoose.model("User", studentUserSchema);

module.exports = StudentUser;
