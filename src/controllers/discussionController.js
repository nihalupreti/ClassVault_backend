const Answers = require("../models/Answer");
const Questions = require("../models/Question");
const sendSuccessResponse = require("../utils/response");

exports.getAllQuestions = async (req, res, next) => {
  const questions = await Questions.find();
  const questionsArr = questions.map((question) => {
    return { question: question.question, id: question._id };
  });
  //TODO: add pagination
  sendSuccessResponse(res, 200, questionsArr, "All questions");
};

exports.addQuestion = async (req, res, next) => {
  const { question: userQuestion } = req.body;

  const question = new Questions({ question: userQuestion });
  question.save();
  sendSuccessResponse(res, 201, {}, "question created");
};

exports.getAnswer = async (req, res, next) => {
  const { id: questionId } = req.param;
  const answers = await Answers.find({ question: questionId });
  const response = answers.map((answer, user) => ({ answer, user }));
  sendSuccessResponse(res, 200, response, "All questions");
};

exports.postAnswer = async (req, res, next) => {
  const { id: questionId } = req.param;
  const { answer } = req.body;
  const saveAnswer = new Answers({
    question: questionId,
    user: req.user.UserId,
    answer,
  });
  saveAnswer.save();

  sendSuccessResponse(res, 200, saveAnswer, "Answer submitted successfully");
};
