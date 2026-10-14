import { Router } from "express";
import {
  getRecommendations,
  updateRecommendationStatus,
} from "./recommendations.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireTenant } from "../../middleware/tenant.middleware";

const router = Router();

router.use(requireAuth, requireTenant);

router.get("/", getRecommendations);
router.post("/:ruleId/status", updateRecommendationStatus);

export const recommendationsRoutes = router;
