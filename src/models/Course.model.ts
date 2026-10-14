import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedDuration: string;
  icon: string;
  lessonsCount: number;
  status: "published" | "draft";
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, default: "Marketing Basics" },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    estimatedDuration: { type: String, default: "30 mins" },
    icon: { type: String, default: "BookOpen" },
    lessonsCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>("Course", CourseSchema);
