import { Router } from "express";
import { getOrganization, updateOrganization } from "./org.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireTenant } from "../../middleware/tenant.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { updateOrgSchema } from "./org.schema";

const router = Router();

router.use(requireAuth, requireTenant);

router.get("/", getOrganization);
router.patch("/", validateRequest({ body: updateOrgSchema }), updateOrganization);

export const organizationRoutes = router;
