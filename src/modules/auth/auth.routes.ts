import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword,
} from "./auth.controller";
import { validateRequest } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "./auth.schema";

const router = Router();

router.post("/register", validateRequest({ body: registerSchema }), register);
router.post("/login", validateRequest({ body: loginSchema }), login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post(
  "/forgot-password",
  validateRequest({ body: forgotPasswordSchema }),
  forgotPassword
);
router.post(
  "/reset-password",
  validateRequest({ body: resetPasswordSchema }),
  resetPassword
);

// Protected routes
router.get("/me", requireAuth, getMe);
router.patch(
  "/me",
  requireAuth,
  validateRequest({ body: updateProfileSchema }),
  updateMe
);

export const authRoutes = router;
