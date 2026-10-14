import mongoose, { Document, Schema } from "mongoose";
import { PLANNER_STATUSES } from "../config/constants";

export interface IPlannerItem extends Document {
  organizationId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  lessonId?: mongoose.Types.ObjectId;
  date: Date;
  platform: string;
  type: string;
  description: string;
  status: "planned" | "in_progress" | "completed" | "published";
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PlannerItemSchema = new Schema<IPlannerItem>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      default: null,
    },
    date: { type: Date, required: true },
    platform: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(PLANNER_STATUSES),
      default: PLANNER_STATUSES.PLANNED,
      index: true,
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

PlannerItemSchema.index({ organizationId: 1, date: 1 });
PlannerItemSchema.index({ organizationId: 1, status: 1 });

export const PlannerItem = mongoose.model<IPlannerItem>(
  "PlannerItem",
  PlannerItemSchema
);
