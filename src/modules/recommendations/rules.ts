import { IMonthlyMetrics } from "../../models/MonthlyMetrics.model";
import { IGoal } from "../../models/Goal.model";
import { IPlannerItem } from "../../models/PlannerItem.model";
import { IEnrollment } from "../../models/Enrollment.model";

export interface IRecommendationRuleResult {
  ruleId: string;
  title: string;
  reason: string;
  suggestedAction: string;
  actionRoute: string;
  effort: "low" | "medium" | "high";
  priority: number; // lower number = higher priority
}

export interface IRuleContext {
  latestMetrics: IMonthlyMetrics | null;
  previousMetrics: IMonthlyMetrics | null;
  goals: IGoal | null;
  upcomingPlannerCount: number;
  completedLessonsCount: number;
  enrolledCoursesCount: number;
}

export const evaluateRules = (ctx: IRuleContext): IRecommendationRuleResult[] => {
  const recommendations: IRecommendationRuleResult[] = [];

  // Rule 1: No metrics recorded
  if (!ctx.latestMetrics) {
    recommendations.push({
      ruleId: "REC_NO_METRICS",
      title: "Record your first month of business results",
      reason:
        "We noticed no business performance data has been recorded yet. Recording metrics unlocks personalized growth insights.",
      suggestedAction: "Enter your follower count, enquiries, and orders for this month.",
      actionRoute: "/business-results",
      effort: "low",
      priority: 1,
    });
  }

  // Rule 2: No learning started
  if (ctx.completedLessonsCount === 0) {
    recommendations.push({
      ruleId: "REC_START_LEARNING",
      title: "Complete your first practical marketing lesson",
      reason:
        "Building digital marketing habits starts with foundational knowledge. Short 5-minute lessons yield immediate action items.",
      suggestedAction: "Start with 'Marketing Basics' or 'Google Business Profile'.",
      actionRoute: "/learn",
      effort: "low",
      priority: 2,
    });
  }

  // Rule 3: Planner is empty or running low on upcoming content
  if (ctx.upcomingPlannerCount < 2) {
    recommendations.push({
      ruleId: "REC_SCHEDULE_CONTENT",
      title: "Plan next week's marketing activities",
      reason:
        `You currently have only ${ctx.upcomingPlannerCount} planned activities scheduled. Consistent businesses plan at least 2–3 posts weekly.`,
      suggestedAction: "Add upcoming promotional, educational, or behind-the-scenes posts to your planner.",
      actionRoute: "/planner",
      effort: "low",
      priority: 3,
    });
  }

  // Rule 4: Posting frequency is low in latest month
  if (ctx.latestMetrics && ctx.latestMetrics.posts < 4) {
    recommendations.push({
      ruleId: "REC_INCREASE_POSTING",
      title: "Increase your publishing cadence",
      reason:
        `You recorded ${ctx.latestMetrics.posts} posts last month. Small businesses with steady reach typically publish at least 2 times per week.`,
      suggestedAction: "Schedule a batch of 4 posts for the next two weeks.",
      actionRoute: "/planner",
      effort: "medium",
      priority: 4,
    });
  }

  // Rule 5: Low conversion rate (enquiries exist, but few convert to orders)
  if (
    ctx.latestMetrics &&
    ctx.latestMetrics.enquiries >= 10 &&
    ctx.latestMetrics.orders / ctx.latestMetrics.enquiries < 0.15
  ) {
    const rate = Math.round(
      (ctx.latestMetrics.orders / ctx.latestMetrics.enquiries) * 100
    );
    recommendations.push({
      ruleId: "REC_IMPROVE_CONVERSION",
      title: "Accelerate your enquiry-to-order conversion",
      reason:
        `Your conversion rate is currently ${rate}%. You are generating interest, but potential buyers may need faster WhatsApp replies or a clear price list.`,
      suggestedAction: "Set up automated WhatsApp Business greeting messages and quick replies.",
      actionRoute: "/learn",
      effort: "medium",
      priority: 5,
    });
  }

  // Rule 6: Customer reviews below monthly target
  if (
    ctx.latestMetrics &&
    ctx.goals &&
    ctx.latestMetrics.reviews < ctx.goals.reviewsTarget
  ) {
    recommendations.push({
      ruleId: "REC_BOOST_REVIEWS",
      title: "Collect more authentic customer reviews",
      reason:
        `You recorded ${ctx.latestMetrics.reviews} reviews vs your target of ${ctx.goals.reviewsTarget}. Local reviews significantly increase store footfall and search rankings.`,
      suggestedAction: "Send a friendly review link via WhatsApp to your last 5 buyers.",
      actionRoute: "/planner",
      effort: "low",
      priority: 6,
    });
  }

  // Rule 7: High engagement rate celebration & expansion
  if (
    ctx.latestMetrics &&
    ctx.latestMetrics.followers > 0 &&
    (ctx.latestMetrics.likes + ctx.latestMetrics.comments + ctx.latestMetrics.shares) /
      ctx.latestMetrics.followers >
      0.05
  ) {
    recommendations.push({
      ruleId: "REC_LEVERAGE_ENGAGEMENT",
      title: "Capitalize on high audience engagement",
      reason:
        "Your content engagement rate exceeds 5%, which is well above average! Your audience is paying close attention.",
      suggestedAction: "Pin your top-performing post and include a direct call-to-action link.",
      actionRoute: "/planner",
      effort: "low",
      priority: 7,
    });
  }

  return recommendations.sort((a, b) => a.priority - b.priority);
};
