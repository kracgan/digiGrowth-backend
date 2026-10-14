import { z } from "zod";

export const updateProgressSchema = z.object({
  status: z.enum(["not_started", "in_progress", "completed"]),
});

export const submitQuizSchema = z.object({
  answers: z.array(z.number().int().min(0)).min(1, "Please answer the questions"),
});
