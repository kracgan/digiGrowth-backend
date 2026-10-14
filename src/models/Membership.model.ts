import mongoose, { Document, Schema } from "mongoose";
import { USER_ROLES, UserRole } from "../config/constants";

export interface IMembership extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: UserRole;
  status: "active" | "invited";
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema = new Schema<IMembership>(
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
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.OWNER,
    },
    status: {
      type: String,
      enum: ["active", "invited"],
      default: "active",
    },
  },
  { timestamps: true }
);

MembershipSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

export const Membership = mongoose.model<IMembership>(
  "Membership",
  MembershipSchema
);
