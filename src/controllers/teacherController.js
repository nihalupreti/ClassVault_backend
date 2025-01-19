const Batch = require("../models/Batch");
const StudentUser = require("../models/StudentUser");
const Subject = require("../models/Subject");
const Semester = require("../models/Semester");
const sendSuccessResponse = require("../utils/response");
const File = require("../models/File");
const sendCourseMessage = require("../producer/courseEnrollerProducer");

exports.registerCourse = async (req, res, next) => {
  const { courseName, faculties } = req.body;
  const facultiesArr = JSON.parse(faculties);

  // TODO: Input validation here
  const teacherId = req.user.userId;

  try {
    if (!courseName || !faculties) {
      return res
        .status(400)
        .json({ message: "Course name and faculties are required." });
    }

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const filesData = req.files.map((file) => ({
        fileName: file.originalname,
        filePath: `/uploads/${file.filename}`,
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
      await sendCourseMessage({ facultiesArr, id: savedBatch._id });
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

exports.gradeAssignment = async (req, res, next) => {
  const { assignmentId, score, feedback } = req.body;

  if (!assignmentId || score === undefined || feedback === undefined) {
    return res.status(400).json({ message: "Assignment ID, score, and feedback are required." });
  }

  try {
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    assignment.grade = { score, feedback };
    const updatedAssignment = await assignment.save();

    sendSuccessResponse(res, 200, updatedAssignment, "Assignment graded successfully.");
  } catch (error) {
    next(error);
  }
};

// exports.uploadFile = async (req, res, next) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "No files uploaded." });
//     }

//     const filesData = req.files.map((file) => ({
//       fileName: file.originalname,
//       filePath: `/uploads/${file.filename}`,
//     }));

//     const savedFiles = await File.insertMany(filesData);

//     // TODO: Use message queue to offload the syncing task to worker process
//     sendSuccessResponse(
//       res,
//       200,
//       "",
//       "Upload Sucess",
//       "Files uploaded successfully "
//     );
//   } catch (err) {
//     next(err);
//   }
// };
