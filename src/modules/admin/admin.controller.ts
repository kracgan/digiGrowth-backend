import { Request, Response, NextFunction } from "express";
import { User } from "../../models/User.model";
import { Membership } from "../../models/Membership.model";
import { AuditEvent } from "../../models/AuditEvent.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { runSeeds } from "../../seeds/run-seeds";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { page = "1", limit = "20", search = "" } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-passwordHash")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    // Fetch memberships to attach roles
    const memberships = await Membership.find({
      userId: { $in: users.map((u) => u._id) },
    }).populate("organizationId", "name category");

    const membershipMap = new Map(
      memberships.map((m) => [m.userId.toString(), m])
    );

    const enrichedUsers = users.map((u) => {
      const mem = membershipMap.get(u._id.toString());
      return {
        ...u.toObject(),
        role: mem?.role || "learner",
        organization: mem?.organizationId || null,
      };
    });

    return ApiResponse.success(
      res,
      {
        users: enrichedUsers,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
      "Users retrieved"
    );
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "suspended"].includes(status)) {
      throw ApiError.badRequest("Invalid status");
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).select("-passwordHash");

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return ApiResponse.success(res, user, `User status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { limit = "50" } = req.query;
    const logs = await AuditEvent.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string, 10) || 50);

    return ApiResponse.success(res, logs, "Audit logs retrieved");
  } catch (error) {
    next(error);
  }
};

export const triggerSeed = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result = await runSeeds();
    return ApiResponse.success(res, result, "Seeds populated successfully");
  } catch (error) {
    next(error);
  }
};
