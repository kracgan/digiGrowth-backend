export class ApiError extends Error {
  public statusCode: number;
  public errors: any;

  constructor(statusCode: number, message: string, errors: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request", errors: any = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized access", errors: any = null) {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = "Forbidden resource", errors: any = null) {
    return new ApiError(403, message, errors);
  }

  static notFound(message = "Resource not found", errors: any = null) {
    return new ApiError(404, message, errors);
  }

  static conflict(message = "Resource conflict", errors: any = null) {
    return new ApiError(409, message, errors);
  }

  static internal(message = "Internal server error", errors: any = null) {
    return new ApiError(500, message, errors);
  }
}
