class ApiError extends Error {
  constructor(
    statusCode,
    massage = "Something went wrong",
    errors = [],
    stake = ""
  ) {
    super(massage);
    this.statusCode = statusCode;
    this.data = null;
    this.message = massage;
    this.success = false;
    this.errors = errors;
    if (stake) {
      this.stack = stake;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
