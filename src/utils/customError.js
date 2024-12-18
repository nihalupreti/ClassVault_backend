class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.status = "error";
    this.statusCode = statusCode;
    this.error = {
      message,
      details,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = ApiError;
