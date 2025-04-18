const mongoose = require("mongoose");
const User = require("./User");

const teacherUserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
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
  role: { type: String, default: "admin", immutable: true },
});

const TeacherUser = User.discriminator("TeacherUser", teacherUserSchema);

module.exports = TeacherUser;
