const express = require("express");
const { uploadAssignment, gradeAssignment, getStudentAssignments, getAllAssignments } = require("../controllers/assignmentController");
const auth = require("../middlewares/auth");
const upload = require("../utils/multerConfig");

const router = express.Router();

// router.get("/no-pain", (req, res) => {
//     res.status(200).send("no-gain");
// });

router.post("/upload", auth, upload.array("assignmentFiles"), uploadAssignment);
router.post("/grade", auth, gradeAssignment);
router.get("/student/:student_id", auth, getStudentAssignments);
router.get("/", auth, getAllAssignments);



module.exports = router;
