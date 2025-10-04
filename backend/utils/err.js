export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.details = details;
    this.name = "AppError";

    Error.captureStackTrace(this, this.constructor);
  }
}
