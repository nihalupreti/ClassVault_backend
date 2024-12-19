const StudentUser = require("../models/StudentUser");
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
    sendSuccessResponse(res, 200, "", "User Loggedin Successfully.");
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

    const newUser = await User.create({
      fullName,
      enrolledIn,
      faculty,
      email,
      password,
    });

    const encryptedToken = signJwt({ userId: newUser._id });
    setCookie(res, encryptedToken);

    sendSuccessResponse(res, 201, "", "User created successfully.");
  } catch (error) {
    next(error);
  }
};
