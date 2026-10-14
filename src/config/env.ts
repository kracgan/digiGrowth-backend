import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/digigrowth",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "digigrowth_access_secret_super_secure_key_12345",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "digigrowth_refresh_secret_super_secure_key_67890",
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "1d",
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};
