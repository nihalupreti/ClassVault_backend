const express = require("express");
const { registerCourse } = require("../controllers/teacherController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", registerCourse);

module.exports = router;
