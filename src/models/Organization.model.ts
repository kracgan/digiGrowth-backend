import mongoose, { Document, Schema } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  category: string;
  serviceArea?: string;
  primaryGoal?: string;
  primaryChannel?: string;
  timezone: string;
  ownerUserId: mongoose.Types.ObjectId;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, default: "Retail & Boutique" },
    serviceArea: { type: String, default: "" },
    primaryGoal: { type: String, default: "Get more customer enquiries" },
    primaryChannel: { type: String, default: "Instagram" },
    timezone: { type: String, default: "UTC" },
    ownerUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>(
  "Organization",
  OrganizationSchema
);
