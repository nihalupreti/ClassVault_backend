const Answers = require("../models/Answer");
const Questions = require("../models/Question");
const sendSuccessResponse = require("../utils/response");

exports.getAllQuestions = async (req, res, next) => {
  const { course: courseId } = req.query;
  const questions = await Questions.find({ course: courseId });
  const questionsArr = questions.map((question) => {
    return { question: question.question, id: question._id };
  });
  //TODO: add pagination
  sendSuccessResponse(res, 200, questionsArr, "All questions");
};

exports.addQuestion = async (req, res, next) => {
  const { question: userQuestion } = req.body;
  const { id: batchId } = req.params;

  const question = new Questions({ question: userQuestion, course: batchId });
  question.save();
  sendSuccessResponse(res, 201, {}, "question created");
};

exports.getAnswer = async (req, res, next) => {
  try {
    const { question: questionId } = req.query;

    const answers = await Answers.find({ question: questionId })
      .populate("user")
      .populate("question");

    const response = answers.map((answer) => ({
      id: answer._id,
      author: {
        name: answer.user.fullName,
      },
      content: answer.answer,
      created_at: answer.createdAt,
      // replies: (answer.replies || []).map((reply) => ({
      //   id: reply._id,
      //   author: {
      //     name: reply.user.name,
      //   },
      //   content: reply.answer,
      //   created_at: reply.createdAt,
      // })),
    }));

    sendSuccessResponse(
      res,
      200,
      response,
      "All answers retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

exports.postAnswer = async (req, res, next) => {
  const { question: questionId } = req.query;
  const { answer } = req.body;

  const saveAnswer = new Answers({
    question: questionId,
    user: req.user.userId,
    answer,
  });
  saveAnswer.save();

  sendSuccessResponse(res, 200, saveAnswer, "Answer submitted successfully");
};
