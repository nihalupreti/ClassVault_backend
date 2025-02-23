const mongoose = require("mongoose");
const calcCurrentSem = require("../utils/calcCurrentSem");
console.log("calcCurrentSem loaded:", calcCurrentSem);
const User = require("./User");

const studentUserSchema = new mongoose.Schema({
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
    //enum: ["BCE", "BCA"], //TODO: More faculty to add
    required: true,
  },

  role: { type: String, default: "student", immutable: true },
});

studentUserSchema.pre("validate", function (next) {
  if (this.enrolledIn && this.enrolledIntake && this.faculty && this.timing) {
    this.semNumber = calcCurrentSem(this.enrolledIn, this.enrolledIntake);
    this.studentCode =
      `${this.faculty}-${this.semNumber}-${this.timing}`.toUpperCase();
    this.studentCodeGeneral = `${this.faculty}-${this.semNumber}`.toUpperCase();
  }
  next();
});

const StudentUser = User.discriminator("StudentUser", studentUserSchema);

module.exports = StudentUser;
