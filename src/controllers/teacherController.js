const Batch = require("../models/Batch");
const Subject = require("../models/Subject");
const Semester = require("../models/Semester");
const sendSuccessResponse = require("../utils/response");
const mqConnection = require("../config/rabbitmq");
const fetchImageUrl = require("../utils/unsplash");

exports.registerCourse = async (req, res, next) => {
  const { courseName, faculties } = req.body;
  const facultiesArr = JSON.parse(faculties);
  const teacherId = req.user.userId;
  let imageUrl;

  try {
    imageUrl = await fetchImageUrl(courseName);

    // Input validation
    if (!courseName || !faculties) {
      return res
        .status(400)
        .json({ message: "Course name and faculties are required." });
    }

    const fileIdArr = req.fileIds;

    const subject = {
      courseName,
      teacher: teacherId,
    };

    const createBatch = new Batch({
      faculty: facultiesArr,
      subject,
      files: fileIdArr,
      imageUrl,
    });

    const savedBatch = await createBatch.save();

    await mqConnection.sendToQueue("course", {
      facultiesArr,
      id: savedBatch._id,
    });

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

exports.updateBatch = async (req, res, next) => {
  const { id: courseId } = req.params;
  const fileIdArr = req.fileIds;
  try {
    const updatedBatch = await Batch.findByIdAndUpdate(
      courseId,
      {
        $push: { files: { $each: fileIdArr } },
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({
      message: "Batch updated successfully",
      batch: updatedBatch,
    });
  } catch (error) {
    console.error("Error updating batch:", error);
    next(error);
  }
};
