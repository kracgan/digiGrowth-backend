import { Router } from "express";
import {
  getUsers,
  toggleUserStatus,
  getAuditLogs,
  triggerSeed,
} from "./admin.controller";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import { USER_ROLES } from "../../config/constants";

const router = Router();

router.use(requireAuth, requireRole([USER_ROLES.ADMIN, USER_ROLES.OWNER]));

router.get("/users", getUsers);
router.patch("/users/:id/status", toggleUserStatus);
router.get("/audit-events", getAuditLogs);
router.post("/seed", triggerSeed);

export const adminRoutes = router;
