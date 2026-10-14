import mongoose, { Document, Schema } from "mongoose";

export interface IAuditEvent extends Document {
  organizationId?: mongoose.Types.ObjectId;
  actorUserId?: mongoose.Types.ObjectId;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const AuditEventSchema = new Schema<IAuditEvent>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
      default: null,
    },
    actorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const AuditEvent = mongoose.model<IAuditEvent>(
  "AuditEvent",
  AuditEventSchema
);
