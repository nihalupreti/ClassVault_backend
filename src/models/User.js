const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
  groups: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  },
  verified: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
