const User = require("../models/User");
const ApiError = require("../utils/customError");
const sendSuccessResponse = require("../utils/response");
const setCookie = require("../utils/cookie");
const { signJwt } = require("../utils/jwt");

exports.signinUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const isCredValid = await User.findOne({ email });
    if (!isCredValid || !(isCredValid.password === password)) {
      throw new ApiError(404, "Not found", "Invalid Credentials");
    }
    const encryptedToken = signJwt({ userId: isCredValid._id });
    setCookie(res, encryptedToken);
    sendSuccessResponse(res, 200, "User Loggedin Successfully.");
  } catch (error) {
    next(error);
  }
};

exports.signupUser = async (req, res, next) => {
  const { fullName, enrolledIn, role, faculty, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Bad Request", "Email already in use.");
    }

    let assignedRole = role;
    if (!role) {
      assignedRole = email.endsWith("@ncit.edu.np") ? "admin" : "student";
    }

    const currentYear = new Date().getFullYear();
    if (enrolledIn < 2018 || enrolledIn > currentYear || !Number.isInteger(enrolledIn)) {
      throw new ApiError(400, "Bad Request", "Invalid enrollment year.");
    }
    const newUser = await User.create({
      fullName,
      enrolledIn,
      role: assignedRole,
      faculty,
      email,
      password,
    });

    const encryptedToken = signJwt({ userId: newUser._id });
    setCookie(res, encryptedToken);

    sendSuccessResponse(res, 201, "User signed up successfully!");
  } catch (error) {
    next(error);
  }
};