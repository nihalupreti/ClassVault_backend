const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  pdf_id: {
    type: String,
    required: true,
  },
  custom_summary: {
    type: String,
  },
  transformer_summary: {
    type: String,
  },
  timestamp: {
    type: Number,
    default: Date.now,
  },
});

// Create and export the model
const Summary = mongoose.model("summaries", summarySchema);

module.exports = Summary;
