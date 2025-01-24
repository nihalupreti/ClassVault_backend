const express = require("express");
const {
  registerCourse,
  getListOfSubjects,
  getAppropriateSemesters,
  updateBatch,
} = require("../controllers/teacherController");
const auth = require("../middlewares/auth");
const handleFileUpload = require("../middlewares/uploadFile");
const upload = require("../config/fileupload");

const router = express.Router();

router.post("/register", auth, upload.any(), handleFileUpload, registerCourse);
router.get("/subject", getListOfSubjects);
router.post("/semester", getAppropriateSemesters);
router.post("/upload/:id", upload.any(), handleFileUpload, updateBatch);

module.exports = router;
