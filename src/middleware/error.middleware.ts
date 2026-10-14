import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  // If it's our custom ApiError
  if (err instanceof ApiError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  // Handle Mongoose duplicate key error (e.g. unique email or unique month)
  if (err.code === 11000) {
    const keys = Object.keys(err.keyPattern || {});
    const field = keys[0] || "field";
    const message = `A record with this ${field} already exists.`;
    return ApiResponse.error(res, message, 409);
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return ApiResponse.error(res, `Invalid ID format for ${err.path}.`, 400);
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return ApiResponse.error(
      res,
      messages[0] || "Validation error",
      400,
      messages
    );
  }

  // Default server error
  console.error("Unhandled error:", err);
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "An unexpected error occurred.";

  return ApiResponse.error(res, message, 500);
};
