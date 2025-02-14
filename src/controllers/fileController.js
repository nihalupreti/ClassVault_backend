const File = require("../models/File");
const Batch = require("../models/Batch");
const sendSuccessResponse = require("../utils/response");
const path = require("path");
const fs = require("fs");

exports.getAllFiles = async (req, res, next) => {
  const { id: batchId } = req.params;
  const batch = await Batch.findById(batchId).populate("files");

  if (!batch) {
    return;
  }

  const filesMetadata = batch.files.map((file) => ({
    fileName: file.fileName,
    createdAt: file.createdAt,
    id: file._id,
  }));

  sendSuccessResponse(res, 200, filesMetadata, "Files metadata");
};

exports.getFile = async (req, res, next) => {
  const { fileId } = req.params;

  const file = await File.findById(fileId);

  if (fs.existsSync(file.filePath)) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileId}.pdf"`);

    // Stream the file to the client
    fs.createReadStream(file.filePath).pipe(res);
  } else {
    res.status(404).json({ error: "File not found" });
  }
};
