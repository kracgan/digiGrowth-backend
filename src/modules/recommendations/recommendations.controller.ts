import { Request, Response, NextFunction } from "express";
import { MonthlyMetrics } from "../../models/MonthlyMetrics.model";
import { Goal } from "../../models/Goal.model";
import { PlannerItem } from "../../models/PlannerItem.model";
import { LessonProgress } from "../../models/LessonProgress.model";
import { Enrollment } from "../../models/Enrollment.model";
import { RecommendationEvent } from "../../models/RecommendationEvent.model";
import { evaluateRules } from "./rules";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";

export const getRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const orgId = req.organizationId;
    const userId = req.user?.userId;

    // Gather contextual signals for deterministic evaluation
    const [metricsRecords, goals, upcomingPlannerCount, completedLessonsCount, enrollments] =
      await Promise.all([
        MonthlyMetrics.find({ organizationId: orgId }).sort({ month: -1 }).limit(2),
        Goal.findOne({ organizationId: orgId }),
        PlannerItem.countDocuments({
          organizationId: orgId,
          status: { $in: ["planned", "in_progress"] },
        }),
        LessonProgress.countDocuments({
          organizationId: orgId,
          userId,
          status: "completed",
        }),
        Enrollment.find({ organizationId: orgId, userId }),
      ]);

    const latestMetrics = metricsRecords.length > 0 ? metricsRecords[0] : null;
    const previousMetrics = metricsRecords.length > 1 ? metricsRecords[1] : null;

    // Evaluate rules
    const generatedRules = evaluateRules({
      latestMetrics,
      previousMetrics,
      goals,
      upcomingPlannerCount,
      completedLessonsCount,
      enrolledCoursesCount: enrollments.length,
    });

    // Check existing stored recommendation events (e.g. dismissed or completed ones)
    const existingEvents = await RecommendationEvent.find({
      organizationId: orgId,
      ruleId: { $in: generatedRules.map((r) => r.ruleId) },
    });

    const eventsByRule = new Map(existingEvents.map((e) => [e.ruleId, e]));

    // Format output with state
    const output = generatedRules.map((rule) => {
      const event = eventsByRule.get(rule.ruleId);
      return {
        id: event?._id || null,
        ruleId: rule.ruleId,
        title: rule.title,
        reason: rule.reason,
        suggestedAction: rule.suggestedAction,
        actionRoute: rule.actionRoute,
        effort: rule.effort,
        status: event?.status || "active",
      };
    });

    // Filter out dismissed recommendations unless requested
    const activeRecommendations = output.filter((r) => r.status === "active");

    return ApiResponse.success(
      res,
      {
        recommendations: activeRecommendations,
        primary: activeRecommendations[0] || null,
        total: activeRecommendations.length,
      },
      "Recommendations generated"
    );
  } catch (error) {
    next(error);
  }
};

export const updateRecommendationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const orgId = req.organizationId;
    const { ruleId } = req.params;
    const { status } = req.body; // "dismissed" | "completed" | "active"

    if (!["active", "dismissed", "completed"].includes(status)) {
      throw ApiError.badRequest("Invalid status provided");
    }

    const event = await RecommendationEvent.findOneAndUpdate(
      { organizationId: orgId, ruleId },
      {
        $set: {
          organizationId: orgId,
          ruleId,
          status,
          generatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return ApiResponse.success(res, event, `Recommendation marked as ${status}`);
  } catch (error) {
    next(error);
  }
};
