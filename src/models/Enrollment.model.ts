import mongoose, { Document, Schema } from "mongoose";

export interface IEnrollment extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  status: "enrolled" | "in_progress" | "completed";
  progressPercent: number;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
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
    status: {
      type: String,
      enum: ["enrolled", "in_progress", "completed"],
      default: "enrolled",
    },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

EnrollmentSchema.index(
  { organizationId: 1, userId: 1, courseId: 1 },
  { unique: true }
);

export const Enrollment = mongoose.model<IEnrollment>(
  "Enrollment",
  EnrollmentSchema
);
