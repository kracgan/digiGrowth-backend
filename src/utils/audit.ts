import mongoose from "mongoose";
import { AuditEvent } from "../models/AuditEvent.model";

export interface IAuditLogOptions {
  organizationId?: string | mongoose.Types.ObjectId;
  actorUserId?: string | mongoose.Types.ObjectId;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, any>;
}

export const logAuditEvent = async (options: IAuditLogOptions) => {
  try {
    await AuditEvent.create({
      organizationId: options.organizationId,
      actorUserId: options.actorUserId,
      action: options.action,
      targetType: options.targetType,
      targetId: options.targetId,
      metadata: options.metadata || {},
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to log audit event:", error);
  }
};
