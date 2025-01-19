const express = require("express");
const {
  registerCourse,
  getListOfSubjects,
  getAppropriateSemesters,
  gradeAssignment,
} = require("../controllers/teacherController");
const auth = require("../middlewares/auth");
const upload = require("../config/fileupload");

const router = express.Router();

router.post("/register", auth, upload.any(), registerCourse);
router.get("/subject", getListOfSubjects);
router.post("/semester", getAppropriateSemesters);

router.post("/grade-assignment", auth, gradeAssignment);

module.exports = router;
