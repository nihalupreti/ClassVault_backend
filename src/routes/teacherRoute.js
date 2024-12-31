const express = require("express");
const {
  registerCourse,
  uploadFile,
} = require("../controllers/teacherController");
const auth = require("../middlewares/auth");
const upload = require("../config/fileupload");

const router = express.Router();

router.post("/register", auth, registerCourse);
rotuer.post("/upload", uploadFile.any(), uploadFile);

module.exports = router;
