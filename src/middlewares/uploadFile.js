const path = require("path");
const File = require("../models/File");
const mqConnection = require("../config/rabbitmq");

const handleFileUpload = async (req, res, next) => {
  try {
    if (req.files && req.files.length > 0) {
      const filesData = req.files.map((file) => ({
        fileName: file.originalname,
        filePath: path.resolve(__dirname, `../../uploads/${file.filename}`),
      }));

      const insertedFiles = await File.insertMany(filesData);

      req.fileIds = insertedFiles.map((doc) => doc._id);

      insertedFiles.forEach((file) => {
        mqConnection.sendToQueue("pdf", {
          pdfPath: file.filePath,
          pdfId: file._id,
        });
      });

      next();
    } else {
      req.fileIds = [];
      next();
    }
  } catch (error) {
    console.error("Error handling file upload:", error);
    next(error);
  }
};

module.exports = handleFileUpload;
