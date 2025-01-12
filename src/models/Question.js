const mongoose = require("mongoose");
const { applyTimestamps } = require("./StudentUser");

const questionSchema = mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
    question: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Questions = mongoose.model("Question", questionSchema);

module.exports = Questions;
