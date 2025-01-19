const express = require("express");
const { uploadAssignment, gradeAssignment, getStudentAssignments, getAllAssignments } = require("../controllers/assignmentController");
const auth = require("../middlewares/auth");
const upload = require("../utils/multerConfig");

const router = express.Router();

// uploading by student
router.post("/upload", auth, upload.array('assignmentFiles'), uploadAssignment);

// grading by teacher
router.post("/grade", auth, gradeAssignment);

//fetching all assignments for student
router.get("/:student_id", auth, getStudentAssignments);

// fetching for teacher
router.get("/", auth, getAllAssignments);

module.exports = router;
