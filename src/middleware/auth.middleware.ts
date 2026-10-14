import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/User.model";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw ApiError.unauthorized("Authentication required. Please log in.");
    }

    try {
      const decoded = verifyAccessToken(token);
      
      // Verify user is still active in database
      const user = await User.findById(decoded.userId).select("status");
      if (!user) {
        throw ApiError.unauthorized("User account no longer exists.");
      }
      if (user.status === "suspended") {
        throw ApiError.forbidden("Your account has been suspended. Please contact support.");
      }

      req.user = decoded;
      req.organizationId = decoded.organizationId;
      next();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw ApiError.unauthorized("Session expired or invalid token. Please log in again.");
    }
  } catch (error) {
    next(error);
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required."));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden("You do not have permission to perform this action.")
      );
    }
    next();
  };
};
