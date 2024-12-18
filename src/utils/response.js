const sendSuccessResponse = (
  res,
  statusCode,
  data = {},
  message = "",
  status = "success"
) => {
  res.status(statusCode).json({ status, message, data });
};

module.exports = sendSuccessResponse;
