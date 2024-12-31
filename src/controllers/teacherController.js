const multer = require("multer");

const Batch = require("../models/Batch");
const StudentUser = require("../models/StudentUser");
const sendSuccessResponse = require("../utils/response");
const File = require("../models/File");

exports.registerCourse = async (req, res, next) => {
  const { courseName, faculties } = req.body;
  //TODO: Input validation here
  const teacherId = req.user.userId;
  const subject = {
    courseName,
    teacher: teacherId,
  };

  try {
    const createBatch = await new Batch({
      faculty: faculties,
      subject,
    });
    createBatch.save();
    sendSuccessResponse(res, 200, "", "Course Created successfully");
  } catch (error) {
    next(error);
  }
};

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const filesData = req.files.map((file) => ({
      fileName: file.originalname,
      filePath: `/uploads/${file.filename}`,
    }));

    const savedFiles = await File.insertMany(filesData);

    // TODO: Use message queue to offload the syncing task to worker thread
    sendSuccessResponse(
      res,
      200,
      "",
      "Upload Sucess",
      "Files uploaded successfully "
    );
  } catch (err) {
    next(err);
  }
};
