import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const requireTenant = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.organizationId) {
    return next(
      ApiError.forbidden(
        "Organization context is missing. Please select an active business workspace."
      )
    );
  }
  next();
};
