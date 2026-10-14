import { z } from "zod";

export const monthlyMetricsSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format"),
  source: z.string().optional().default("Manual Records"),
  followers: z.number().min(0, "Followers cannot be negative").default(0),
  posts: z.number().min(0, "Posts cannot be negative").default(0),
  likes: z.number().min(0, "Likes cannot be negative").default(0),
  comments: z.number().min(0, "Comments cannot be negative").default(0),
  shares: z.number().min(0, "Shares cannot be negative").default(0),
  enquiries: z.number().min(0, "Enquiries cannot be negative").default(0),
  orders: z.number().min(0, "Orders cannot be negative").default(0),
  reviews: z.number().min(0, "Reviews cannot be negative").default(0),
  rating: z
    .number()
    .min(0, "Rating cannot be negative")
    .max(5, "Rating cannot exceed 5")
    .default(0),
  notes: z.string().optional().default(""),
});

export const updateGoalsSchema = z.object({
  followersTarget: z.number().min(0, "Target cannot be negative").optional(),
  enquiriesTarget: z.number().min(0, "Target cannot be negative").optional(),
  reviewsTarget: z.number().min(0, "Target cannot be negative").optional(),
});
