const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
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
  role: { type: String, enum: ["admin", "student"] }, //TODO: automatically choose default value based on email.
  faculty: {
    type: String,
    enum: ["BCE", "BCA"], //TODO: More faculty to add
    require: true,
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
});

const User = mongoose.model("User", userSchema);

module.exports = User;
