import { createApp } from "./app";
import { connectDatabase } from "./config/database";
import { ENV } from "./config/env";
import { runSeeds } from "./seeds/run-seeds";
import { Course } from "./models/Course.model";

const startServer = async () => {
  console.log("🚀 Starting Digital Growth Backend Service...");

  // Connect Database
  await connectDatabase();

  // Auto-seed if courses empty
  try {
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log("Database courses empty. Auto-seeding curriculum...");
      await runSeeds();
    }
  } catch (err) {
    console.warn("Could not check course seeds automatically (MongoDB might be connecting):", err);
  }

  const app = createApp();

  const server = app.listen(ENV.PORT, () => {
    console.log(`===============================================`);
    console.log(`Digital Growth API Server running on port ${ENV.PORT}`);
    console.log(`Environment: ${ENV.NODE_ENV}`);
    console.log(`Frontend URL: ${ENV.FRONTEND_URL}`);
    console.log(`Health Check: http://localhost:${ENV.PORT}/api/health`);
    console.log(`===============================================`);
  });

  // Graceful Shutdown
  const shutdown = () => {
    console.log("Shutting down gracefully...");
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer().catch((error) => {
  console.error("Fatal startup error:", error);
  process.exit(1);
});
