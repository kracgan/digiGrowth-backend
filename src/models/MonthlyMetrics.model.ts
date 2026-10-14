import mongoose, { Document, Schema } from "mongoose";

export interface IMonthlyMetrics extends Document {
  organizationId: mongoose.Types.ObjectId;
  month: string; // YYYY-MM
  source: string;
  followers: number;
  posts: number;
  likes: number;
  comments: number;
  shares: number;
  enquiries: number;
  orders: number;
  reviews: number;
  rating: number; // 0 - 5
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MonthlyMetricsSchema = new Schema<IMonthlyMetrics>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/,
    },
    source: { type: String, default: "Manual Records" },
    followers: { type: Number, default: 0, min: 0 },
    posts: { type: Number, default: 0, min: 0 },
    likes: { type: Number, default: 0, min: 0 },
    comments: { type: Number, default: 0, min: 0 },
    shares: { type: Number, default: 0, min: 0 },
    enquiries: { type: Number, default: 0, min: 0 },
    orders: { type: Number, default: 0, min: 0 },
    reviews: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

MonthlyMetricsSchema.index({ organizationId: 1, month: 1 }, { unique: true });

export const MonthlyMetrics = mongoose.model<IMonthlyMetrics>(
  "MonthlyMetrics",
  MonthlyMetricsSchema
);
