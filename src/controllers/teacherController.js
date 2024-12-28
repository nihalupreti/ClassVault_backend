const Batch = require("../models/Batch");
const StudentUser = require("../models/StudentUser");
const sendSuccessResponse = require("../utils/response");

exports.registerCourse = async (req, res, next) => {
  const { courseName, timing, semester, faculty } = req.body; //timing refers to mrng or day and semester will be number(1-8)
  //TODO: Input validation here
  const teacherId = req.user.userId;
  const subject = {
    courseName,
    teacher: teacherId,
  };
  try {
    const createBatch = await new Batch({
      semester: `${faculty}${semester}`,
      faculty,
      timing,
      subject,
    });
    await createBatch.save();

    //enroll every student that matches this semester,faculty and timing field
    const semNumber = `${faculty}-${semester}-${timing}`.toUpperCase();
    // TODO: Use message queue to offload the syncing task to worker thread
    const allAppropriateStudentUser = await StudentUser.updateMany(
      { semNumber },
      { batchEnrolled: createBatch._id }
    );

    sendSuccessResponse(res, 200, "", "Course Created successfully");
  } catch (error) {
    next(error);
  }
};
