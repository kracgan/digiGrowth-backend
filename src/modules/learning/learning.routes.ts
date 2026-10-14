import { Router } from "express";
import {
  getCourses,
  getCourseById,
  enrollCourse,
  getLessonById,
  updateLessonProgress,
  submitQuizAttempt,
} from "./learning.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireTenant } from "../../middleware/tenant.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { updateProgressSchema, submitQuizSchema } from "./learning.schema";

const router = Router();

router.use(requireAuth, requireTenant);

router.get("/courses", getCourses);
router.get("/courses/:id", getCourseById);
router.post("/courses/:id/enroll", enrollCourse);
router.get("/lessons/:id", getLessonById);
router.put(
  "/lessons/:id/progress",
  validateRequest({ body: updateProgressSchema }),
  updateLessonProgress
);
router.post(
  "/lessons/:id/quiz-attempts",
  validateRequest({ body: submitQuizSchema }),
  submitQuizAttempt
);

export const learningRoutes = router;
