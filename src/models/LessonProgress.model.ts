import mongoose, { Document, Schema } from "mongoose";

export interface ILessonProgress extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  status: "not_started" | "in_progress" | "completed";
  quizScore: number;
  quizAttempts: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LessonProgressSchema = new Schema<ILessonProgress>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },
    quizScore: { type: Number, default: 0 },
    quizAttempts: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

LessonProgressSchema.index(
  { organizationId: 1, userId: 1, lessonId: 1 },
  { unique: true }
);

export const LessonProgress = mongoose.model<ILessonProgress>(
  "LessonProgress",
  LessonProgressSchema
);
