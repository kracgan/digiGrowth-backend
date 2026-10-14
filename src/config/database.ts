import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB connected successfully:", ENV.MONGO_URI.split("@").pop());
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    // Don't exit process in dev if user hasn't configured MongoDB yet, allow app to report health
  }
};
