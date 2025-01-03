const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema({
  subName: {
    type: String,
    required: true,
  },
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
