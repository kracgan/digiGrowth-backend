import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";
import { ApiResponse } from "../utils/ApiResponse";

export const validateRequest = (schema: {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        (req as any).query = await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        (req as any).params = await schema.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return ApiResponse.error(
          res,
          error.issues[0]?.message || "Validation failed",
          400,
          errorDetails
        );
      }
      next(error);
    }
  };
};
