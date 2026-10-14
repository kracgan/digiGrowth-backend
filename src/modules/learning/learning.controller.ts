import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Course } from "../../models/Course.model";
import { Lesson } from "../../models/Lesson.model";
import { Enrollment } from "../../models/Enrollment.model";
import { LessonProgress } from "../../models/LessonProgress.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { logAuditEvent } from "../../utils/audit";

export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.userId;
    const orgId = req.organizationId;

    const courses = await Course.find({ status: "published" }).sort({
      createdAt: 1,
    });

    // Fetch user's enrollments
    const enrollments = await Enrollment.find({
      userId,
      organizationId: orgId,
    });

    const enrollmentMap = new Map(
      enrollments.map((e) => [e.courseId.toString(), e])
    );

    const enrichedCourses = courses.map((course) => {
      const enrollment = enrollmentMap.get(course._id.toString());
      return {
        ...course.toObject(),
        isEnrolled: !!enrollment,
        enrollmentStatus: enrollment?.status || "not_enrolled",
        progressPercent: enrollment?.progressPercent || 0,
      };
    });

    return ApiResponse.success(res, enrichedCourses, "Courses retrieved");
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.userId;
    const orgId = req.organizationId;

    let course;
    if (mongoose.Types.ObjectId.isValid(id)) {
      course = await Course.findById(id);
    } else {
      course = await Course.findOne({ slug: id });
    }

    if (!course) {
      throw ApiError.notFound("Course not found");
    }

    const lessons = await Lesson.find({ courseId: course._id })
      .select("-quizQuestions.correctOptionIndex")
      .sort({ order: 1 });

    const progressRecords = await LessonProgress.find({
      courseId: course._id,
      userId,
      organizationId: orgId,
    });

    const progressMap = new Map(
      progressRecords.map((p) => [p.lessonId.toString(), p])
    );

    const enrollment = await Enrollment.findOne({
      courseId: course._id,
      userId,
      organizationId: orgId,
    });

    const enrichedLessons = lessons.map((l) => {
      const progress = progressMap.get(l._id.toString());
      return {
        ...l.toObject(),
        status: progress?.status || "not_started",
        quizScore: progress?.quizScore || 0,
        completedAt: progress?.completedAt || null,
      };
    });

    return ApiResponse.success(
      res,
      {
        course,
        lessons: enrichedLessons,
        enrollment: enrollment || null,
        progressPercent: enrollment?.progressPercent || 0,
      },
      "Course details retrieved"
    );
  } catch (error) {
    next(error);
  }
};

export const enrollCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const orgId = req.organizationId;

    const course = await Course.findById(id);
    if (!course) {
      throw ApiError.notFound("Course not found");
    }

    let enrollment = await Enrollment.findOne({
      courseId: course._id,
      userId,
      organizationId: orgId,
    });

    if (!enrollment) {
      enrollment = await Enrollment.create({
        courseId: course._id,
        userId,
        organizationId: orgId,
        status: "enrolled",
        progressPercent: 0,
        startedAt: new Date(),
      });
    }

    return ApiResponse.success(res, enrollment, "Enrolled in course successfully");
  } catch (error) {
    next(error);
  }
};

export const getLessonById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const orgId = req.organizationId;

    const lesson = await Lesson.findById(id).select(
      "-quizQuestions.correctOptionIndex"
    );
    if (!lesson) {
      throw ApiError.notFound("Lesson not found");
    }

    const progress = await LessonProgress.findOne({
      lessonId: lesson._id,
      userId,
      organizationId: orgId,
    });

    // Also get previous and next lesson IDs
    const adjacentLessons = await Lesson.find({ courseId: lesson.courseId })
      .select("_id title order")
      .sort({ order: 1 });

    const currentIndex = adjacentLessons.findIndex(
      (l) => l._id.toString() === lesson._id.toString()
    );

    const prevLesson = currentIndex > 0 ? adjacentLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex < adjacentLessons.length - 1
        ? adjacentLessons[currentIndex + 1]
        : null;

    return ApiResponse.success(
      res,
      {
        lesson,
        progress: progress || { status: "not_started", quizScore: 0 },
        prevLesson,
        nextLesson,
      },
      "Lesson retrieved"
    );
  } catch (error) {
    next(error);
  }
};

export const updateLessonProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;
    const orgId = req.organizationId;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      throw ApiError.notFound("Lesson not found");
    }

    const completedAt = status === "completed" ? new Date() : undefined;

    const progress = await LessonProgress.findOneAndUpdate(
      {
        lessonId: lesson._id,
        userId,
        organizationId: orgId,
      },
      {
        $set: {
          courseId: lesson.courseId,
          status,
          ...(completedAt && { completedAt }),
        },
      },
      { upsert: true, new: true }
    );

    // Recalculate course enrollment progress
    const totalLessons = await Lesson.countDocuments({
      courseId: lesson.courseId,
    });
    const completedLessons = await LessonProgress.countDocuments({
      courseId: lesson.courseId,
      userId,
      organizationId: orgId,
      status: "completed",
    });

    const progressPercent =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const enrollmentStatus =
      progressPercent === 100
        ? "completed"
        : progressPercent > 0
        ? "in_progress"
        : "enrolled";

    await Enrollment.findOneAndUpdate(
      {
        courseId: lesson.courseId,
        userId,
        organizationId: orgId,
      },
      {
        $set: {
          progressPercent,
          status: enrollmentStatus,
          ...(progressPercent === 100 && { completedAt: new Date() }),
        },
      },
      { upsert: true }
    );

    await logAuditEvent({
      organizationId: orgId,
      actorUserId: userId,
      action: "LESSON_PROGRESS_UPDATE",
      targetType: "Lesson",
      targetId: lesson._id.toString(),
      metadata: { status, progressPercent },
    });

    return ApiResponse.success(
      res,
      { progress, progressPercent },
      "Lesson progress updated"
    );
  } catch (error) {
    next(error);
  }
};

export const submitQuizAttempt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const userId = req.user?.userId;
    const orgId = req.organizationId;

    // Load full lesson with correctOptionIndex
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      throw ApiError.notFound("Lesson not found");
    }

    if (!lesson.quizQuestions || lesson.quizQuestions.length === 0) {
      throw ApiError.badRequest("This lesson has no quiz questions.");
    }

    let correctCount = 0;
    const feedback = lesson.quizQuestions.map((q, idx) => {
      const userAnswer = answers[idx];
      const isCorrect = userAnswer === q.correctOptionIndex;
      if (isCorrect) correctCount++;

      return {
        questionIndex: idx,
        question: q.question,
        userAnswer,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const totalQuestions = lesson.quizQuestions.length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercent >= 70;

    // Update progress record
    const progress = await LessonProgress.findOneAndUpdate(
      {
        lessonId: lesson._id,
        userId,
        organizationId: orgId,
      },
      {
        $set: {
          courseId: lesson.courseId,
          quizScore: scorePercent,
          ...(passed && { status: "completed", completedAt: new Date() }),
        },
        $inc: { quizAttempts: 1 },
      },
      { upsert: true, new: true }
    );

    // If passed, recalculate course progress
    if (passed) {
      const totalLessons = await Lesson.countDocuments({
        courseId: lesson.courseId,
      });
      const completedLessons = await LessonProgress.countDocuments({
        courseId: lesson.courseId,
        userId,
        organizationId: orgId,
        status: "completed",
      });
      const progressPercent = Math.round((completedLessons / totalLessons) * 100);

      await Enrollment.findOneAndUpdate(
        {
          courseId: lesson.courseId,
          userId,
          organizationId: orgId,
        },
        {
          $set: {
            progressPercent,
            status: progressPercent === 100 ? "completed" : "in_progress",
          },
        },
        { upsert: true }
      );
    }

    return ApiResponse.success(
      res,
      {
        scorePercent,
        correctCount,
        totalQuestions,
        passed,
        feedback,
      },
      passed ? "Congratulations! You passed the quiz." : "Review and try again."
    );
  } catch (error) {
    next(error);
  }
};
