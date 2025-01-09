const StudentUser = require("../models/StudentUser");

const processStudent = async (userData) => {
  try {
    const students = await StudentUser.updateMany(
      { studentCodeGeneral: { $in: userData.parsedFaculties } },
      { $addToSet: { batchEnrolled: userData.id } }
    );
    console.log("done");
  } catch (error) {
    console.error("Error during  processing:", error);
  }
};

module.exports = { processStudent };
