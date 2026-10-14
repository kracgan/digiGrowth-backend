import { Router } from "express";
import {
  getPlannerItems,
  createPlannerItem,
  updatePlannerItem,
  deletePlannerItem,
} from "./planner.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireTenant } from "../../middleware/tenant.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import {
  createPlannerItemSchema,
  updatePlannerItemSchema,
} from "./planner.schema";

const router = Router();

router.use(requireAuth, requireTenant);

router.get("/", getPlannerItems);
router.post(
  "/",
  validateRequest({ body: createPlannerItemSchema }),
  createPlannerItem
);
router.patch(
  "/:id",
  validateRequest({ body: updatePlannerItemSchema }),
  updatePlannerItem
);
router.delete("/:id", deletePlannerItem);

export const plannerRoutes = router;
