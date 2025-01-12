const express = require("express");
const {
  getAllQuestions,
  addQuestion,
  getAnswer,
  postAnswer,
} = require("../controllers/discussionController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/question", getAllQuestions);
router.post("/question/:id", addQuestion);
router.get("/answer", getAnswer); ///answer?course=123&question=456
router.post("/answer", auth, postAnswer);

module.exports = router;
