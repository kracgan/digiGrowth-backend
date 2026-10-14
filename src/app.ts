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

  // Fully Permissive CORS (Permits any origin unconditionally)
  const corsOptions: cors.CorsOptions = {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["*"],
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

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
  const healthHandler = (req: express.Request, res: express.Response) => {
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
  };
  app.get("/api/health", healthHandler);
  app.get("/health", healthHandler);

  // Module Routes (mounted under /api and root alias for flexible client integration)
  const mountRoutes = (prefix: string) => {
    app.use(`${prefix}/auth`, authRoutes);
    app.use(`${prefix}/organizations`, organizationRoutes);
    app.use(`${prefix}/learning`, learningRoutes);
    app.use(`${prefix}/courses`, learningRoutes);
    app.use(`${prefix}/lessons`, learningRoutes);
    app.use(`${prefix}/planner-items`, plannerRoutes);
    app.use(`${prefix}/monthly-metrics`, metricsRoutes);
    app.use(`${prefix}/recommendations`, recommendationsRoutes);
    app.use(`${prefix}/admin`, adminRoutes);
  };

  mountRoutes("/api");
  mountRoutes("");

  // 404 Handler
  app.use((req, res, next) => {
    next(ApiError.notFound(`Endpoint ${req.method} ${req.originalUrl} not found`));
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
