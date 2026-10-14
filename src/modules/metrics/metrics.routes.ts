import { Router } from "express";
import {
  getMonthlyMetrics,
  upsertMonthlyMetrics,
  getSingleMonthMetrics,
  getGoals,
  updateGoals,
} from "./metrics.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireTenant } from "../../middleware/tenant.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { monthlyMetricsSchema, updateGoalsSchema } from "./metrics.schema";

const router = Router();

router.use(requireAuth, requireTenant);

router.get("/", getMonthlyMetrics);
router.post(
  "/",
  validateRequest({ body: monthlyMetricsSchema }),
  upsertMonthlyMetrics
);
router.get("/goals", getGoals);
router.patch(
  "/goals",
  validateRequest({ body: updateGoalsSchema }),
  updateGoals
);
router.get("/:month", getSingleMonthMetrics);

export const metricsRoutes = router;
