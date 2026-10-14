import { Request, Response, NextFunction } from "express";
import { PlannerItem } from "../../models/PlannerItem.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { logAuditEvent } from "../../utils/audit";

export const getPlannerItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const orgId = req.organizationId;
    const { status, platform, startDate, endDate, limit = "50", page = "1" } =
      req.query;

    const query: any = { organizationId: orgId };

    if (status && status !== "all") {
      query.status = status;
    }

    if (platform && platform !== "all") {
      query.platform = platform;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      PlannerItem.find(query)
        .populate("lessonId", "title courseId")
        .sort({ date: 1 })
        .skip(skip)
        .limit(limitNum),
      PlannerItem.countDocuments(query),
    ]);

    return ApiResponse.success(
      res,
      {
        items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
      "Planner items retrieved"
    );
  } catch (error) {
    next(error);
  }
};

export const createPlannerItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const orgId = req.organizationId;
    const userId = req.user?.userId;
    const { date, platform, type, description, status, lessonId } = req.body;

    const item = await PlannerItem.create({
      organizationId: orgId,
      createdBy: userId,
      lessonId: lessonId || null,
      date: new Date(date),
      platform,
      type,
      description,
      status: status || "planned",
    });

    await logAuditEvent({
      organizationId: orgId,
      actorUserId: userId,
      action: "CREATE_PLANNER_ITEM",
      targetType: "PlannerItem",
      targetId: item._id.toString(),
      metadata: { platform, type, date },
    });

    return ApiResponse.success(res, item, "Planner activity created", 201);
  } catch (error) {
    next(error);
  }
};

export const updatePlannerItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const orgId = req.organizationId;
    const updateData = req.body;

    if (updateData.status === "completed" || updateData.status === "published") {
      updateData.completedAt = new Date();
    }

    const item = await PlannerItem.findOneAndUpdate(
      { _id: id, organizationId: orgId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!item) {
      throw ApiError.notFound("Planner item not found");
    }

    return ApiResponse.success(res, item, "Planner activity updated");
  } catch (error) {
    next(error);
  }
};

export const deletePlannerItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const id = req.params.id as string;
    const orgId = req.organizationId;

    const item = await PlannerItem.findOneAndDelete({
      _id: id,
      organizationId: orgId,
    });

    if (!item) {
      throw ApiError.notFound("Planner item not found");
    }

    await logAuditEvent({
      organizationId: orgId,
      actorUserId: req.user?.userId,
      action: "DELETE_PLANNER_ITEM",
      targetType: "PlannerItem",
      targetId: id,
    });

    return ApiResponse.success(res, null, "Planner activity deleted successfully");
  } catch (error) {
    next(error);
  }
};
