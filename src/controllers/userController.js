const argon2 = require("argon2");
const StudentUser = require("../models/StudentUser");
const TeacherUser = require("../models/TeacherUser");
const ApiError = require("../utils/customError");
const sendSuccessResponse = require("../utils/response");
const { signJwt } = require("../utils/jwt");

exports.signinUser = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    if (role !== "student" && role !== "teacher") {
      throw new ApiError(400, "Invalid Role", "Role must be 'student' or 'teacher'.");
    }

    // user based on role
    const UserModel = role === "teacher" ? TeacherUser : StudentUser;
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      throw new ApiError(401, "Invalid Credentials", "Provided email or password is incorrect.");
    }

    const isPasswordValid = await argon2.verify(existingUser.password, password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid Credentials", "Provided email or password is incorrect.");
    }


    const token = signJwt({
      _id: existingUser._id,
      role: role,
    });


    sendSuccessResponse(res, 200, token, "User logged in successfully.");
  } catch (error) {
    if (error.message && error.message.includes("argon2")) {
      return next(new ApiError(401, "Invalid Credentials", "Provided email or password is incorrect."));
    }
    next(error);
  }
};

exports.signupUser = async (req, res, next) => {
  const {
    fullName,
    enrolledIn,
    enrolledIntake,
    timing,
    faculty,
    email,
    password,
    role,
  } = req.body;

  try {

    if (role !== "student" && role !== "teacher") {
      throw new ApiError(400, "Invalid Role", "Role must be 'student' or 'teacher'.");
    }

    const UserModel = role === "teacher" ? TeacherUser : StudentUser;
    const existingUser = await UserModel.findOne({ email });  //mail check

    if (existingUser) {
      throw new ApiError(409, "Conflict", "Email already in use.");
    }


    const hashedPassword = await argon2.hash(password);

    const newUser = new UserModel({
      fullName,
      enrolledIn,
      enrolledIntake,
      timing,
      faculty,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    const token = signJwt({
      _id: newUser._id,
      role: role,
    });


    sendSuccessResponse(res, 201, token, "User created successfully.");
  } catch (error) {
    next(error);
  }
};

