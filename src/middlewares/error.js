const errorHandler = (err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: err.status,
    error: {
      message: err.message || "Something went wrong!",
      details: err.error?.details || "No additional information.",
      timestamp: err.timestamp,
    },
  });
};

module.exports = errorHandler;
