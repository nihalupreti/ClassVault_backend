const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    filePath: { type: String, required: true },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
