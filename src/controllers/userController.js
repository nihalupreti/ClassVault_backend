const argon2 = require("argon2");
const path = require("path");

const StudentUser = require("../models/StudentUser");
const ApiError = require("../utils/customError");
const TeacherUser = require("../models/TeacherUser");
const Batch = require("../models/Batch");
const sendSuccessResponse = require("../utils/response");
const setCookie = require("../utils/cookie");
const { signJwt } = require("../utils/jwt");
const User = require("../models/User");
const formatDate = require("../utils/formatDate");
const elasticClient = require("../config/elasticSearch");
const highlightExcerpt = require("../utils/highlightDescription");
const { sendEmail } = require("../services/notification");
const { verifyJwt } = require("../utils/jwt");

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

    if (req.userType === "student") {
      const studentCodeGeneral = newUser.studentCodeGeneral;
      const batches = await Batch.find({
        faculty: { $in: studentCodeGeneral },
      });

      const batchIds = batches.map((batch) => batch._id);

      newUser.batchEnrolled = batchIds;
      await newUser.save();
    }

    sendSuccessResponse(
      res,
      201,

      { role: newUser.role, fullName: newUser.fullName },
      "User created successfully."
    );
    sendEmail({
      emailType: "SEND_CONFIRMATION_EMAIL",
      emailData: {
        recipientName: newUser.fullName,
        recipientEmail: newUser.email,
        confirmationLink: `http://localhost:5173/user/confirm?token=${signJwt(
          { userId: newUser._id },
          "15m"
        )}`,
      },
    });
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
        });

        responseData = appropriateBatch.map((batch) => ({
          courseName: batch.subject?.courseName || "No course name available",
          description: batch.description,
          teacherName: teacher.fullName,
          id: batch?._id || "No id found",
          updatedAt: formatDate(batch.updatedAt),
          imageUrl: batch.imageUrl,
        }));
      }
    } else if (role === "student") {
      const student = await StudentUser.findById(userId);
      if (student) {
        const appropriateBatch = await Batch.find({
          _id: { $in: student.batchEnrolled },
        }).populate({
          path: "subject.teacher",
          select: "fullName",
        });

        responseData = appropriateBatch.map((batch) => ({
          courseName: batch.subject?.courseName || "No course name available",
          description: batch.description,
          teacherName:
            batch.subject?.teacher?.fullName || "No teacher name available",
          id: batch?._id || "No id found",
          updatedAt: formatDate(batch.updatedAt),
          imageUrl: batch.imageUrl,
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
  const user = await User.findById(req.user.userId);
  sendSuccessResponse(res, 200, {
    fullName: user.fullName,
    role: user.role,
    groups: user.groups,
    verified: user.verified,
  });
};

exports.logoutUser = async (req, res, next) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

exports.search = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const userId = req.user.userId;
    const student = await StudentUser.findById(userId);
    if (!student || !student.batchEnrolled?.length) {
      return res.status(404).json({ error: "No enrolled batches found" });
    }

    // Get all batches in a single query
    const batches = await Batch.find(
      { _id: { $in: student.batchEnrolled } },
      { files: 1 }
    ).populate("files", "filePath");

    const flattenedFilePaths = batches
      .flatMap((batch) => batch.files?.map((file) => file.filePath) || [])
      .filter(Boolean);

    if (!flattenedFilePaths.length) {
      return res
        .status(404)
        .json({ error: "No files found in enrolled batches" });
    }
    const response = await elasticClient.search({
      index: "pdf",
      body: {
        query: {
          bool: {
            must: [
              {
                terms: {
                  pdfPath: flattenedFilePaths,
                },
              },
              {
                match_phrase: {
                  content: query,
                },
              },
            ],
          },
        },
      },
    });
    httpResponse = response.hits.hits.map((doc) => ({
      fileId: doc._source.pdfId,
      page: doc._source.page,
      fileName: path.basename(doc._source.pdfPath),
      description: highlightExcerpt(doc._source.content, query),
    }));
    res.status(200).json(httpResponse);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({
      error: "An error occurred while processing the search request.",
    });
  }
};

exports.confirm = async (req, res, next) => {
  const { token } = req.query;
  try {
    const decoded = verifyJwt(token);

    // Using Mongoose to update the user
    await User.findByIdAndUpdate(decoded.userId, { verified: true });

    res.json({ message: "Email confirmed successfully!" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
