const StudentUser = require("../models/StudentUser");
const sendEmailToMultipleUser = require("../services/notification");

const processStudent = async (userData) => {
  try {
    const students = await StudentUser.updateMany(
      { studentCodeGeneral: { $in: userData.facultiesArr } },
      { $addToSet: { batchEnrolled: userData.id } }
    );
    console.log("done");
    sendEmailToMultipleUser({
      BatchId: userData.id,
      emailType: "SEND_COURSE_EMAIL",
      purpose: "enroll",
    });
  } catch (error) {
    console.error("Error during  processing:", error);
  }
};

module.exports = processStudent;
