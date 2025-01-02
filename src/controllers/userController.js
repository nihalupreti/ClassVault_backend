const argon2 = require("argon2");

const StudentUser = require("../models/StudentUser");
const ApiError = require("../utils/customError");
const TeacherUser = require("../models/TeacherUser");
const sendSuccessResponse = require("../utils/response");
const setCookie = require("../utils/cookie");
const { signJwt } = require("../utils/jwt");

exports.signinUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await req.userType.findOne({ email });
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
    const encryptedToken = signJwt({ userId: existingUser._id });
    setCookie(res, encryptedToken);
    sendSuccessResponse(
      res,
      200,
      { role: existingUser.role },
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

    if (req.UserType === "student") {
      const newUser = new StudentUser({
        fullName,
        enrolledIn,
        faculty,
        email,
        password: hashedPassword,
        enrolledIntake,
        timing,
      });
      await newUser.save();
    }
    const encryptedToken = signJwt({ userId: newUser._id });
    setCookie(res, encryptedToken);

    sendSuccessResponse(res, 201, "", "User created successfully.");
  } catch (error) {
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

    const encryptedToken = signJwt({ userId: newUser._id });
    setCookie(res, encryptedToken);

    sendSuccessResponse(res, 201, null, "User created successfully.");
  } catch (error) {
    next(error);
  }
};
