const mongoose = require("mongoose");
const { applyTimestamps } = require("./StudentUser");

const questionSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Questions = mongoose.model("Question", questionSchema);

module.exports = Questions;
