import { z } from "zod";
import { PLANNER_STATUSES } from "../../config/constants";

export const createPlannerItemSchema = z.object({
  date: z.string().or(z.date()),
  platform: z.string().min(1, "Platform is required"),
  type: z.string().min(1, "Activity type is required"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  status: z
    .enum([
      PLANNER_STATUSES.PLANNED,
      PLANNER_STATUSES.IN_PROGRESS,
      PLANNER_STATUSES.COMPLETED,
      PLANNER_STATUSES.PUBLISHED,
    ])
    .optional(),
  lessonId: z.string().optional().nullable(),
});

export const updatePlannerItemSchema = createPlannerItemSchema.partial();
