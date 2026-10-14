import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { ENV } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import { ApiResponse } from "./utils/ApiResponse";
import { ApiError } from "./utils/ApiError";

// Import Routes
import { authRoutes } from "./modules/auth/auth.routes";
import { organizationRoutes } from "./modules/organization/org.routes";
import { learningRoutes } from "./modules/learning/learning.routes";
import { plannerRoutes } from "./modules/planner/planner.routes";
import { metricsRoutes } from "./modules/metrics/metrics.routes";
import { recommendationsRoutes } from "./modules/recommendations/recommendations.routes";
import { adminRoutes } from "./modules/admin/admin.routes";

export const createApp = () => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: [
        ENV.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Parsers
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));
  app.use(cookieParser());

  // Logging
  if (ENV.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // Rate Limiting (General)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
      errors: null,
    },
  });
  app.use("/api", limiter);

  // Health Check
  app.get("/api/health", (req, res) => {
    return ApiResponse.success(
      res,
      {
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date(),
        environment: ENV.NODE_ENV,
      },
      "Digital Growth API service is operating normally"
    );
  });

  // Module Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/organizations", organizationRoutes);
  app.use("/api/learning", learningRoutes);
  // Also mount directly under /api for PRD endpoint table compliance
  app.use("/api/courses", learningRoutes);
  app.use("/api/lessons", learningRoutes);
  app.use("/api/planner-items", plannerRoutes);
  app.use("/api/monthly-metrics", metricsRoutes);
  app.use("/api/recommendations", recommendationsRoutes);
  app.use("/api/admin", adminRoutes);

  // 404 Handler
  app.use((req, res, next) => {
    next(ApiError.notFound(`Endpoint ${req.method} ${req.originalUrl} not found`));
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
