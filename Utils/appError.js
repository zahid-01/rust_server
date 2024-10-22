module.exports = class AppError extends Error {
  constructor(statusCode, errorMessage) {
    super(errorMessage);

    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};
