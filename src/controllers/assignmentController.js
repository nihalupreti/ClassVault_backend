const Assignment = require("../models/Assignment");
const File = require("../models/File");
const sendSuccessResponse = require("../utils/response");
// const handleFileUploads = require("../utils/handleFileUploads");

exports.uploadAssignment = async (req, res, next) => {
    const { assignment_title, student_id } = req.body;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded." });
    }

    if (!assignment_title || !student_id) {
        return res.status(400).json({ message: "Assignment title and student ID are required." });
    }

    try {

        const filesData = req.files.map((file) => ({
            fileName: file.originalname,
            filePath: file.path, // check with the multer config once
        }));


        const insertedFiles = await File.insertMany(filesData);
        const fileIdArray = insertedFiles.map((file) => file._id);


        const newAssignment = new Assignment({
            student_id,
            assignment_title,
            files: fileIdArray,
            submitted_at: Date.now(),
        });

        const savedAssignment = await newAssignment.save();

        sendSuccessResponse(res, 200, savedAssignment, "Assignment uploaded successfully.");
    } catch (error) {
        next(error);
    }

    // console.log(req.body);
    // console.log(req.files);
};

exports.getStudentAssignments = async (req, res, next) => {
    const { student_id } = req.params;

    try {
        const assignments = await Assignment.find({ student_id }).populate("files");

        if (assignments.length === 0) {
            return res.status(404).json({ message: "No assignments found for this student." });
        }

        sendSuccessResponse(res, 200, assignments, "Assignments retrieved successfully.");
    } catch (error) {
        next(error);
    }
};

exports.gradeAssignment = async (req, res, next) => {
    const { assignmentId, score, feedback } = req.body;

    if (!assignmentId || score === undefined || feedback === undefined) {
        return res.status(400).json({ message: "Assignment ID, score, and feedback are required." });
    }

    if (score < 0 || score > 100) {
        return res.status(400).json({ message: "Score must be between 0 and 100." });
    }

    try {
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found." });
        }

        if (assignment.grade && assignment.grade.score !== null) {
            return res.status(400).json({ message: "Assignment is already graded." });
        }

        assignment.grade = { score, feedback };
        const updatedAssignment = await assignment.save();

        sendSuccessResponse(res, 200, updatedAssignment, "Assignment graded successfully.");
    } catch (error) {
        next(error);
    }
};

// teacher-view
exports.getAllAssignments = async (req, res, next) => {
    try {
        const assignments = await Assignment.find().populate("files");

        sendSuccessResponse(res, 200, assignments, "All assignments retrieved successfully.");
    } catch (error) {
        next(error);
    }
};
