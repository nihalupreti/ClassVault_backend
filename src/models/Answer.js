const mongoose = require("mongoose");

const answerSchema = mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answer: {
      type: String,
    },
  },
  { timestamps: true }
);

const Answers = mongoose.model("Answer", answerSchema);

module.exports = Answers;
