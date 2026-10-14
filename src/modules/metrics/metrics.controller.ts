import { Request, Response, NextFunction } from "express";
import { MonthlyMetrics } from "../../models/MonthlyMetrics.model";
import { Goal } from "../../models/Goal.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import {
  calculateConversionRate,
  calculateEngagementRate,
  calculatePercentageChange,
} from "./formulas";
import { logAuditEvent } from "../../utils/audit";

export const getMonthlyMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const orgId = req.organizationId;

    const records = await MonthlyMetrics.find({ organizationId: orgId }).sort({
      month: 1,
    });

    // Calculate rates and MoM changes
    const enrichedRecords = records.map((record, index) => {
      const conversionRate = calculateConversionRate(
        record.orders,
        record.enquiries
      );
      const engagementRate = calculateEngagementRate(
        record.likes,
        record.comments,
        record.shares,
        record.followers
      );

      const prev = index > 0 ? records[index - 1] : null;

      const followersChange = prev
        ? calculatePercentageChange(record.followers, prev.followers)
        : null;
      const enquiriesChange = prev
        ? calculatePercentageChange(record.enquiries, prev.enquiries)
        : null;
      const ordersChange = prev
        ? calculatePercentageChange(record.orders, prev.orders)
        : null;

      return {
        ...record.toObject(),
        conversionRate, // null when enquiries is 0
        engagementRate, // null when followers is 0
        changes: {
          followers: followersChange,
          enquiries: enquiriesChange,
          orders: ordersChange,
        },
      };
    });

    const goals = await Goal.findOne({ organizationId: orgId });

    return ApiResponse.success(
      res,
      {
        records: enrichedRecords,
        latest: enrichedRecords.length > 0 ? enrichedRecords[enrichedRecords.length - 1] : null,
        goals: goals || null,
      },
      "Monthly metrics retrieved"
    );
  } catch (error) {
    next(error);
  }
};

export const upsertMonthlyMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const orgId = req.organizationId;
    const data = req.body;

    const record = await MonthlyMetrics.findOneAndUpdate(
      { organizationId: orgId, month: data.month },
      { $set: data },
      { upsert: true, new: true, runValidators: true }
    );

    await logAuditEvent({
      organizationId: orgId,
      actorUserId: req.user?.userId,
      action: "UPSERT_MONTHLY_METRICS",
      targetType: "MonthlyMetrics",
      targetId: record._id.toString(),
      metadata: { month: data.month },
    });

    const conversionRate = calculateConversionRate(
      record.orders,
      record.enquiries
    );
    const engagementRate = calculateEngagementRate(
      record.likes,
      record.comments,
      record.shares,
      record.followers
    );

    return ApiResponse.success(
      res,
      {
        ...record.toObject(),
        conversionRate,
        engagementRate,
      },
      "Monthly metrics saved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getSingleMonthMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { month } = req.params;
    const orgId = req.organizationId;

    const record = await MonthlyMetrics.findOne({
      organizationId: orgId,
      month,
    });

    if (!record) {
      throw ApiError.notFound(`No record found for month ${month}`);
    }

    const conversionRate = calculateConversionRate(
      record.orders,
      record.enquiries
    );
    const engagementRate = calculateEngagementRate(
      record.likes,
      record.comments,
      record.shares,
      record.followers
    );

    return ApiResponse.success(
      res,
      {
        ...record.toObject(),
        conversionRate,
        engagementRate,
      },
      "Month metrics retrieved"
    );
  } catch (error) {
    next(error);
  }
};

export const getGoals = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const orgId = req.organizationId;
    let goals = await Goal.findOne({ organizationId: orgId });

    if (!goals) {
      goals = await Goal.create({
        organizationId: orgId,
        period: "monthly",
        followersTarget: 1000,
        enquiriesTarget: 40,
        reviewsTarget: 15,
      });
    }

    return ApiResponse.success(res, goals, "Goals retrieved");
  } catch (error) {
    next(error);
  }
};

export const updateGoals = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const orgId = req.organizationId;
    const updateData = req.body;

    const goals = await Goal.findOneAndUpdate(
      { organizationId: orgId },
      { $set: updateData },
      { upsert: true, new: true, runValidators: true }
    );

    await logAuditEvent({
      organizationId: orgId,
      actorUserId: req.user?.userId,
      action: "UPDATE_GOALS",
      targetType: "Goal",
      targetId: goals._id.toString(),
      metadata: updateData,
    });

    return ApiResponse.success(res, goals, "Goals updated successfully");
  } catch (error) {
    next(error);
  }
};
