const mongoose = require("mongoose");
const StudentUser = require("./StudentUser");

const answerSchema = mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentUser",
    },
    answer: {
      type: String,
    },
  },
  { timestamps: true }
);

const Answers = mongoose.model("Answer", answerSchema);

module.exports = Answers;
