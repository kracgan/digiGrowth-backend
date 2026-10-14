import mongoose, { Document, Schema } from "mongoose";

export interface IGoal extends Document {
  organizationId: mongoose.Types.ObjectId;
  period: string; // e.g., "monthly"
  followersTarget: number;
  enquiriesTarget: number;
  reviewsTarget: number;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
      unique: true,
    },
    period: { type: String, default: "monthly" },
    followersTarget: { type: Number, default: 1000, min: 0 },
    enquiriesTarget: { type: Number, default: 50, min: 0 },
    reviewsTarget: { type: Number, default: 20, min: 0 },
  },
  { timestamps: true }
);

export const Goal = mongoose.model<IGoal>("Goal", GoalSchema);
