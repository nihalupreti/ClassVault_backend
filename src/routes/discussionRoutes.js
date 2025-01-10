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
router.post("/question", addQuestion);
router.get("/answer/:id", getAnswer);
router.post("/answer/:id", auth, postAnswer);

module.exports = router;
