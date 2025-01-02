const TeacherUser = require("../models/TeacherUser");
const StudentUser = require("../models/StudentUser");

const isEmailNcits = (req, res, next) => {
  const { email } = req.body;
  const ncitMailAddressPattern = /^[a-zA-Z0-9._%+-]+@ncit\.edu\.np$/;
  const studentMailAddressPattern = /^[a-z]+\.[0-9]{6}@ncit\.edu\.np$/;

  if (!ncitMailAddressPattern.test(email)) {
    return res.status(400).json({ message: "Invalid NCIT email address" });
  }
  req.userType = studentMailAddressPattern.test(email) ? "student" : "teacher";
  next();
};

const accountExists = async (req, res, next) => {
  const { email } = req.body;

  try {
    let user = null;
    user =
      req.userType === "student"
        ? StudentUser.findOne(email)
        : TeacherUser.findOne(email);

    if (user) {
      return next();
    } else {
      return res.status(404).json({ message: "Account does not exist" });
    }
  } catch (err) {
    console.error("Error checking account existence:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { accountExists, isEmailNcits };

//TODO: throw confilict error if the user exists
