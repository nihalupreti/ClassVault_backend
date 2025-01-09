const argon2 = require("argon2");

const StudentUser = require("../models/StudentUser");
const ApiError = require("../utils/customError");
const TeacherUser = require("../models/TeacherUser");
const Batch = require("../models/Batch");
const sendSuccessResponse = require("../utils/response");
const setCookie = require("../utils/cookie");
const { signJwt } = require("../utils/jwt");
const sendCourseMessage = require("../producer/courseEnrollerProducer");

const userModels = {
  student: StudentUser,
  teacher: TeacherUser,
};

exports.signinUser = async (req, res, next) => {
  const { email, password } = req.body;
  const UserModel = userModels[req.userType];
  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      throw new ApiError(
        401,
        "Invalid Credentials.",
        "Provided email or password is incorrect."
      );
    }
    const isPasswordValid = await argon2.verify(
      existingUser.password,
      password
    );
    if (!isPasswordValid) {
      throw new ApiError(
        401,
        "Invalid Credentials.",
        "Provided email or password is incorrect."
      );
    }
    const encryptedToken = signJwt({
      userId: existingUser._id,
      role: existingUser.role,
    });
    setCookie(res, encryptedToken);
    sendSuccessResponse(
      res,
      200,
      { role: existingUser.role, fullName: existingUser.fullName },
      "User Loggedin Successfully."
    );
  } catch (error) {
    // Handles invalid hash or invalid password error
    if (error.message && error.message.includes("argon2")) {
      return next(
        new ApiError(
          401,
          "Invalid Credentials.",
          "Provided email or password is incorrect."
        )
      );
    }
    next(error);
  }
};

exports.signupUser = async (req, res, next) => {
  const inputBody = req.body;

  try {
    const hashedPassword = await argon2.hash(inputBody.password);

    let newUser;
    if (req.userType === "student") {
      newUser = new StudentUser({
        fullName: inputBody.fullName,
        enrolledIn: inputBody.enrolledIn,
        faculty: inputBody.faculty,
        email: inputBody.email,
        password: hashedPassword,
        enrolledIntake: inputBody.enrolledIntake,
        timing: inputBody.timing,
      });
    } else if (req.userType === "teacher") {
      newUser = new TeacherUser({
        fullName: inputBody.fullName,
        email: inputBody.email,
        password: hashedPassword,
      });
    } else {
      throw new ApiError(
        400,
        "Invalid user type.",
        "Provide email address provided by NCIT."
      );
    }

    await newUser.save();

    const encryptedToken = signJwt({ userId: newUser._id, role: newUser.role });
    setCookie(res, encryptedToken);

    sendSuccessResponse(
      res,
      201,

      { role: newUser.role, fullName: newUser.fullName },
      "User created successfully."
    );

    const studentCodeGeneral = newUser.studentCodeGeneral;
    const parsedFaculties = await Batch.find();
    console.log("here", parsedFaculties);

    // await sendCourseMessage({ parsedFaculties, id: savedBatch._id });

  } catch (error) {
    next(error);
  }
};

exports.getUserCourses = async (req, res, next) => {
  const { userId, role } = req.user;

  try {
    let responseData = [];

    if (role === "admin") {
      const teacher = await TeacherUser.findById(userId);
      if (teacher) {
        const appropriateBatch = await Batch.find({
          "subject.teacher": userId,
        }).populate({
          path: "files",
          select: "filePath",
        });

        responseData = appropriateBatch.map((batch) => ({
          courseName: batch.subject?.courseName || "No course name available",
          teacherName: teacher.fullName,
          fileUrl:
            batch.files?.map((file) => file.filePath) || "No file available",
        }));
      }
    } else if (role === "student") {
      const student = await StudentUser.findById(userId);
      if (student) {
        const appropriateBatch = await Batch.find({
          _id: { $in: student.batchEnrolled },
        })
          .populate({
            path: "subject.teacher",
            select: "fullName",
          })
          .populate({
            path: "files",
            select: "filePath",
          });

        responseData = appropriateBatch.map((batch) => ({
          courseName: batch.subject?.courseName || "No course name available",
          teacherName:
            batch.subject?.teacher?.fullName || "No teacher name available",
          fileUrl:
            batch.files?.map((file) => file.filePath) || "No file available",
        }));
      }
    }

    if (responseData.length === 0) {
      return sendSuccessResponse(res, 200, [], "No courses found");

    }

    sendSuccessResponse(res, 200, responseData, "Courses found");
  } catch (err) {
    next(err);
  }
};


exports.getUserInfo = async (req, res, next) => {
  if (req.user.role === "admin") {
    const teacher = await TeacherUser.findById(req.user.userId);
    if (teacher)
      sendSuccessResponse(res, 200, {
        fullName: teacher.fullName,
        role: teacher.role,
      });
  } else if (req.user.role === "student") {
    const student = await StudentUser.findById(req.user.userId);
    if (student)
      sendSuccessResponse(res, 200, {
        fullName: student.fullName,
        role: student.role,
      });
  }
};

exports.logoutUser = async (req, res, next) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

