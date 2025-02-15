const express = require("express");
const {
  uploadAssignment,
  gradeAssignment,
  getStudentAssignments,
  getAllAssignments,
  uploadAssignmentByStudent,
} = require("../controllers/assignmentController");
const auth = require("../middlewares/auth");
const handleFileUpload = require("../middlewares/uploadFile");
const upload = require("../config/fileupload");

const router = express.Router();

router.post(
  "/upload/course/:id",
  auth,
  upload.any(),
  handleFileUpload,
  uploadAssignment
);
router.post("/grade", auth, gradeAssignment);
router.post(
  "/course/:id/submit",
  auth,
  upload.any(),
  handleFileUpload,
  uploadAssignmentByStudent
);
router.get("/course/:id", auth, getStudentAssignments);
router.get("/", auth, getAllAssignments);

module.exports = router;
