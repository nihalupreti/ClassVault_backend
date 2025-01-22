const Batch = require("../models/Batch");
const path = require("path");
const Subject = require("../models/Subject");
const Semester = require("../models/Semester");
const sendSuccessResponse = require("../utils/response");
const File = require("../models/File");
const mqConnection = require("../config/rabbitmq");
const courseDescription = require("../utils/huggingFace");

exports.registerCourse = async (req, res, next) => {
  const { courseName, faculties } = req.body;
  const facultiesArr = JSON.parse(faculties);
  //description = await courseDescription(courseName);

  // TODO: Input validation here
  const teacherId = req.user.userId;

  try {
    if (!courseName || !faculties) {
      return res
        .status(400)
        .json({ message: "Course name and faculties are required." });
    }

    if (req.files && req.files.length > 0) {
      const filesData = req.files.map((file) => ({
        fileName: file.originalname,
        filePath: path.resolve(__dirname, `../../uploads/${file.filename}`),
      }));

      const insertedFile = await File.insertMany(filesData);
      const fileIdArray = insertedFile.map((doc) => doc._id);

      const subject = {
        courseName,
        teacher: teacherId,
      };
      const createBatch = new Batch({
        faculty: facultiesArr,
        subject,
        files: fileIdArray,
      });
      const savedBatch = await createBatch.save();
      await mqConnection.sendToQueue("course", {
        facultiesArr,
        id: savedBatch._id,
      });
      insertedFile.forEach((file) => {
        mqConnection.sendToQueue("pdf", {
          pdfPath: file.filePath,
          pdfId: file._id,
        });
      });
    }

    sendSuccessResponse(
      res,
      200,
      "",
      "Course registered and files uploaded successfully"
    );
  } catch (error) {
    next(error);
  }
};

exports.getListOfSubjects = async (req, res, next) => {
  try {
    const subNames = await Subject.find({}, { subName: 1, _id: 0 });
    const subjectArray = subNames.map((subject) => subject.subName);
    sendSuccessResponse(res, 200, subjectArray, "All available subjects");
  } catch (err) {
    next(err);
  }
};

exports.getAppropriateSemesters = async (req, res, next) => {
  const { subjectName } = req.body;
  try {
    const subject = await Subject.findOne({ subName: subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    //Find all Semesters where the subject's _id is in the subjectList array
    const semesters = await Semester.find({
      subjectList: subject._id,
    });

    const semArr = semesters.map((doc) => doc._id);

    //error handle here if the semesters is empty.
    sendSuccessResponse(res, 200, semArr, "all semesters for that sub");
  } catch (err) {
    next(err);
  }
};
