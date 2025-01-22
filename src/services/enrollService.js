const StudentUser = require("../models/StudentUser");

const processStudent = async (userData) => {
  try {
    const students = await StudentUser.updateMany(
      { studentCodeGeneral: { $in: userData.facultiesArr } },
      { $addToSet: { batchEnrolled: userData.id } }
    );
    console.log(students);
    console.log(userData);
    console.log("done");
  } catch (error) {
    console.error("Error during  processing:", error);
  }
};

module.exports = processStudent;
