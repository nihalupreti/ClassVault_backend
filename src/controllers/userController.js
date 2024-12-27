const User = require("../models/User");
const ApiError = require("../utils/customError");
const sendSuccessResponse = require("../utils/response");
const setCookie = require("../utils/cookie");
const { signJwt } = require("../utils/jwt");


exports.signinUser = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    const isCredValid = await User.findOne({
        email,
        role: role === "student" || role === "teacher" ? role : null, 
    });

    if (!isCredValid || isCredValid.password !== password) {
        throw new ApiError(404, "Not found", "Invalid Credentials");
    }

    const encryptedToken = signJwt({ userId: isCredValid._id });
    setCookie(res, encryptedToken);
    sendSuccessResponse(res, 200, role=== "teacher" ? "Teacher logged in!" : "User Loggedin Successfully.");
  } catch (error) {
    next(error);
  }
};

exports.signupUser = async (req, res, next) => {
  const { fullName, enrolledIn, faculty, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "conflict", "Email already in use.");
    }

    const role = /[0-9]{6}/.test(email) ? "student" : "teacher"; //if roll is present then the user is student

    const newUser = await User.create({
      fullName,
      enrolledIn: role === "student" ? enrolledIn : undefined,
      faculty,
      email,
      password,
      role,
      syllabus: role === "teacher" ? syllabus : undefined,
      course: role === "teacher" ? course : undefined,
    });

    const encryptedToken = signJwt({ userId: newUser._id });
    setCookie(res, encryptedToken);

    sendSuccessResponse(res, 201, "User created successfully.");
  } catch (error) {
    next(error);
  }
};
