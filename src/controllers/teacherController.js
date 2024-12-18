const Batch = require("../models/Batch");
const User = require("../models/User");

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

      //TODO: sync changes to the user.
    });
  } catch (error) {
    next(error);
  }
};
