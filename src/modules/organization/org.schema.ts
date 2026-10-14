import { z } from "zod";

export const updateOrgSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters").optional(),
  category: z.string().optional(),
  serviceArea: z.string().optional(),
  primaryGoal: z.string().optional(),
  primaryChannel: z.string().optional(),
  timezone: z.string().optional(),
});
