const Assignment = require("../models/Assignment");
const StudentUser = require("../models/StudentUser");
const sendSuccessResponse = require("../utils/response");
const AssignmentSubmit = require("../models/AssignmentSubmit");

exports.uploadAssignmentByStudent = async (req, res, next) => {
  const { id: assignment } = req.params;
  const studentId = req.user.userId;
  try {
    const fileIdArr = req.fileIds;

    const studentAssignment = await AssignmentSubmit.findOneAndUpdate(
      { student: studentId, assignment },
      { $set: { files: fileIdArr, status: "submitted" } }
    );

    sendSuccessResponse(
      res,
      200,
      studentAssignment,
      "Assignment uploaded successfully."
    );
  } catch (err) {
    console.log(err);
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
    // Get all assignment submissions for the given assignment ID
    const assignments = await AssignmentSubmit.find({
      assignment: id,
    })
      .populate("assignment", "assignment_title dueDate grading") // Populate assignment fields
      .populate("student", "fullName");

    // Get the assignment details, including the course
    const assignmentDetails = await Assignment.findById(id)
      .select("assignment_title course dueDate mark grading")
      .populate("course", "subject.courseName"); // Populate course with courseName

    // Format the output
    const formattedResponse = {
      id: assignmentDetails._id,
      title: assignmentDetails.assignment_title,
      chapter: assignmentDetails.course.subject.courseName, // Corrected to access courseName
      dueDate: assignmentDetails.dueDate,
      totalPoints: assignmentDetails.mark,
      gradingType: assignmentDetails.grading, // 'manual' or 'auto'
      submissions: assignments.map((submission) => ({
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
    let assignments = [];
    const selectFields =
      "teacher assignment_title files createdAt course dueDate";
    const commonPopulate = [
      { path: "files", select: "fileName" },
      { path: "teacher", select: "fullName -_id" },
      { path: "course", select: "subject.courseName -_id" },
    ];

    if (req.user.role === "admin") {
      assignments = await Assignment.find({ teacher: userId })
        .select(selectFields)
        .populate(commonPopulate);
    } else if (req.user.role === "student") {
      assignments = await AssignmentSubmit.find({ student: userId })
        .select("assignment status")
        .populate("assignment", selectFields)
        .populate({ path: "assignment", populate: commonPopulate });

      assignments = assignments.map((submission) => {
        const { assignment, status } = submission; // Destructure the assignment and status

        // Flatten the assignment object and add the status at the root
        return {
          ...assignment.toObject(),
          status,
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
