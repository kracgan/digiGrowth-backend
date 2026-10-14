import { Request, Response, NextFunction } from "express";
import { Organization } from "../../models/Organization.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { logAuditEvent } from "../../utils/audit";

export const getOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const org = await Organization.findById(req.organizationId);
    if (!org) {
      throw ApiError.notFound("Organization not found");
    }
    return ApiResponse.success(res, org, "Organization details");
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const orgId = req.organizationId;
    const updateData = req.body;

    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedOrg) {
      throw ApiError.notFound("Organization not found");
    }

    await logAuditEvent({
      organizationId: updatedOrg._id,
      actorUserId: req.user?.userId,
      action: "UPDATE_ORGANIZATION",
      targetType: "Organization",
      targetId: updatedOrg._id.toString(),
      metadata: updateData,
    });

    return ApiResponse.success(
      res,
      updatedOrg,
      "Business details updated successfully"
    );
  } catch (error) {
    next(error);
  }
};
