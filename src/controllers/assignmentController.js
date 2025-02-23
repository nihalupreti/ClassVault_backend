const Assignment = require("../models/Assignment");
const StudentUser = require("../models/StudentUser");
const sendSuccessResponse = require("../utils/response");
const AssignmentSubmit = require("../models/AssignmentSubmit");
const { sendEmailToMultipleUser } = require("../services/notification");

exports.uploadAssignmentByStudent = async (req, res, next) => {
  const { id } = req.params;
  const studentId = req.user.userId;

  try {
    // Validate if assignment exists
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Prepare update data
    const updateData = {
      files: req.fileIds, // Ensure req.fileIds is populated correctly
      status: assignment.grading === "auto" ? "graded" : "submitted",
      updatedAt: new Date(),
    };

    // Add grade if auto grading
    if (assignment.grading === "auto") {
      updateData.grade = {
        score: assignment.mark, // Use mark from assignment to set score in submission
        feedback: null,
      };
    }

    // Check if submission is after due date and apply late penalty if configured
    if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
      if (assignment.percentCutoff && assignment.grading === "auto") {
        const penaltyAmount =
          (assignment.mark * assignment.percentCutoff) / 100; // Apply penalty to mark
        updateData.grade.score = Math.max(0, assignment.mark - penaltyAmount); // Update score after penalty
        updateData.isLate = true;
      }
    }

    // Update or create assignment submission
    const studentAssignment = await AssignmentSubmit.findOneAndUpdate(
      {
        student: studentId,
        assignment: id,
      },
      { $set: updateData },
      { new: true, upsert: true } // This ensures the document is created if it doesn't exist
    );

    if (!studentAssignment) {
      return res.status(404).json({
        message: "Assignment submission not found or failed to update",
      });
    }

    sendSuccessResponse(
      res,
      200,
      studentAssignment,
      "Assignment uploaded successfully"
    );
  } catch (error) {
    console.error("Error uploading assignment:", error);
    next(error);
  }
};

exports.uploadAssignment = async (req, res, next) => {
  const { id } = req.params;
  const { assignment_title, grading, max_score, late_penalty, dueDate } =
    req.body;
  const teacher = req.user.userId;

  if (!assignment_title) {
    return res.status(400).json({ message: "Assignment title  are required." });
  }

  try {
    const fileIdArr = req.fileIds;
    const newAssignmentData = {
      course: id,
      assignment_title,
      teacher,
      dueDate,
      grading,
      files: fileIdArr,
    };

    if (grading === "auto") {
      if (max_score !== undefined) newAssignmentData.mark = max_score;
      if (late_penalty !== undefined)
        newAssignmentData.percentCutoff = late_penalty;
    }

    const newAssignment = await Assignment.create(newAssignmentData);
    const studentIds = await StudentUser.find({
      batchEnrolled: { $in: [newAssignment.course] },
    }).select("_id");

    // Remove the __t and keep only the _id field
    const plainStudentIds = studentIds.map((student) => student._id);
    const submissions = plainStudentIds.map((studentId) => ({
      student: studentId,
      assignment: newAssignment._id,
      status: "notSubmitted",
    }));

    await AssignmentSubmit.insertMany(submissions);

    sendEmailToMultipleUser({
      BatchId: newAssignment.course,
      emailType: "SEND_COURSE_EMAIL",
      purpose: "assignment",
      extra: {
        assignmentTitle: newAssignment.assignment_title,
        dueDate: newAssignment.dueDate,
      },
    });
    sendSuccessResponse(
      res,
      200,
      newAssignment,
      "Assignment created successfully."
    );
  } catch (error) {
    next(error);
  }
};

exports.getStudentAssignments = async (req, res, next) => {
  const { id } = req.params;

  try {
    const assignments = await AssignmentSubmit.find({
      assignment: id,
    })
      .populate("assignment", "assignment_title dueDate grading files")
      .populate("student", "fullName");

    const assignmentDetails = await Assignment.findById(id)
      .select("assignment_title course dueDate mark grading")
      .populate("course", "subject.courseName");

    const formattedResponse = {
      id: assignmentDetails._id,
      title: assignmentDetails.assignment_title,
      chapter: assignmentDetails.course.subject.courseName,
      dueDate: assignmentDetails.dueDate,
      totalPoints: assignmentDetails.mark,
      gradingType: assignmentDetails.grading,
      submissions: assignments.map((submission) => ({
        fileId: submission.files[0],
        id: submission._id,
        studentName: submission.student.fullName,
        submittedAt: submission.createdAt,
        status: submission.status,
        grade: submission.grade || null,
      })),
    };

    sendSuccessResponse(
      res,
      200,
      formattedResponse,
      "Assignment and submissions retrieved successfully."
    );
  } catch (error) {
    next(error);
  }
};

exports.gradeAssignment = async (req, res, next) => {
  const { assignmentId, score } = req.body;

  if (!assignmentId || score === undefined) {
    return res
      .status(400)
      .json({ message: "Assignment ID, score is required." });
  }

  if (score < 0 || score > 100) {
    return res
      .status(400)
      .json({ message: "Score must be between 0 and 100." });
  }

  try {
    const updatedAssignment = await AssignmentSubmit.findByIdAndUpdate(
      assignmentId,
      {
        $set: {
          status: "graded",
          "grade.score": score,
        },
      },
      { new: true } // This will return the updated document
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    sendSuccessResponse(
      res,
      200,
      updatedAssignment,
      "Assignment graded successfully."
    );
  } catch (error) {
    next(error);
  }
};

exports.getAllAssignments = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    let assignments = [];
    const selectFields =
      "teacher assignment_title files createdAt course dueDate";
    const commonPopulate = [
      { path: "files", select: "fileName" },
      { path: "teacher", select: "fullName -_id" },
      { path: "course", select: "subject.courseName -_id" },
    ];

    if (req.user.role === "admin") {
      assignments = await Assignment.find({ teacher: userId, course: id })
        .select(selectFields)
        .populate(commonPopulate);
    } else if (req.user.role === "student") {
      assignments = await AssignmentSubmit.find({ student: userId })
        .select("assignment status grade")
        .populate({
          path: "assignment",
          match: { course: id }, // Filter by course ID
          select: selectFields,
          populate: commonPopulate,
        });

      assignments = assignments
        .filter((submission) => submission.assignment) // Remove null assignments
        .map((submission) => {
          const { assignment, status, grade } = submission;
          const gradeScore = grade && grade.length > 0 ? grade[0].score : null; // Assuming grade is an array, and we want the score from the first item
          return {
            ...assignment.toObject(), // Safe now
            status,
            grade: grade.score, // Add the grade to the response
          };
        });
    }

    sendSuccessResponse(
      res,
      200,
      assignments,
      "All assignments retrieved successfully."
    );
  } catch (error) {
    next(error);
  }
};
