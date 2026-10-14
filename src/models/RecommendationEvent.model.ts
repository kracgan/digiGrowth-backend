import mongoose, { Document, Schema } from "mongoose";

export interface IRecommendationEvent extends Document {
  organizationId: mongoose.Types.ObjectId;
  ruleId: string;
  inputPeriod: string;
  title: string;
  reason: string;
  suggestedAction: string;
  actionRoute: string;
  effort: "low" | "medium" | "high";
  status: "active" | "dismissed" | "completed";
  actionReference?: string;
  generatedAt: Date;
  updatedAt: Date;
}

const RecommendationEventSchema = new Schema<IRecommendationEvent>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    ruleId: { type: String, required: true },
    inputPeriod: { type: String, default: "" },
    title: { type: String, required: true },
    reason: { type: String, required: true },
    suggestedAction: { type: String, required: true },
    actionRoute: { type: String, default: "/planner" },
    effort: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["active", "dismissed", "completed"],
      default: "active",
      index: true,
    },
    actionReference: { type: String, default: "" },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

RecommendationEventSchema.index({ organizationId: 1, ruleId: 1 });

export const RecommendationEvent = mongoose.model<IRecommendationEvent>(
  "RecommendationEvent",
  RecommendationEventSchema
);
