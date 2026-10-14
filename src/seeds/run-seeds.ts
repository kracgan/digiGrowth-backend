import mongoose from "mongoose";
import { Course } from "../models/Course.model";
import { Lesson } from "../models/Lesson.model";
import { User } from "../models/User.model";
import { Organization } from "../models/Organization.model";
import { Membership } from "../models/Membership.model";
import { MonthlyMetrics } from "../models/MonthlyMetrics.model";
import { Goal } from "../models/Goal.model";
import { PlannerItem } from "../models/PlannerItem.model";
import { hashPassword } from "../utils/hash";
import { SEED_COURSES } from "./courses.seed";
import { USER_ROLES } from "../config/constants";
import { connectDatabase } from "../config/database";

export const runSeeds = async () => {
  console.log("🌱 Running database seeds...");

  let coursesCount = 0;
  let lessonsCount = 0;

  // 1. Seed Courses & Lessons
  for (const courseData of SEED_COURSES) {
    const existingCourse = await Course.findOne({ slug: courseData.slug });

    let course = existingCourse;
    if (!existingCourse) {
      course = await Course.create({
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level,
        estimatedDuration: courseData.estimatedDuration,
        icon: courseData.icon,
        lessonsCount: courseData.lessons.length,
        status: "published",
        version: 1,
      });
      coursesCount++;
    } else if (course) {
      course.title = courseData.title;
      course.description = courseData.description;
      course.category = courseData.category;
      course.lessonsCount = courseData.lessons.length;
      await course.save();
    }

    if (course) {
      for (const lessonData of courseData.lessons) {
        const existingLesson = await Lesson.findOne({
          courseId: course._id,
          order: lessonData.order,
        });

        if (!existingLesson) {
          await Lesson.create({
            courseId: course._id,
            order: lessonData.order,
            title: lessonData.title,
            durationMinutes: lessonData.durationMinutes,
            objectives: lessonData.objectives,
            contentBlocks: lessonData.contentBlocks,
            practicalTask: lessonData.practicalTask,
            quizQuestions: lessonData.quizQuestions,
          });
          lessonsCount++;
        } else {
          existingLesson.title = lessonData.title;
          existingLesson.objectives = lessonData.objectives;
          existingLesson.contentBlocks = lessonData.contentBlocks as any;
          existingLesson.practicalTask = lessonData.practicalTask;
          existingLesson.quizQuestions = lessonData.quizQuestions;
          await existingLesson.save();
        }
      }
    }
  }

  // 2. Seed Default Demo Business Account (if not existing)
  const demoEmail = "demo@digigrowth.com";
  let demoUser = await User.findOne({ email: demoEmail });

  if (!demoUser) {
    const passwordHash = await hashPassword("password123");
    demoUser = await User.create({
      name: "Rohan Patel",
      email: demoEmail,
      passwordHash,
      status: "active",
    });

    const demoOrg = await Organization.create({
      name: "Artisan Bakery & Cafe",
      category: "Food & Restaurant / Cafe",
      serviceArea: "Central District & 5km Delivery",
      primaryGoal: "Get more customer enquiries",
      primaryChannel: "Instagram",
      timezone: "UTC",
      ownerUserId: demoUser._id,
      status: "active",
    });

    await Membership.create({
      organizationId: demoOrg._id,
      userId: demoUser._id,
      role: USER_ROLES.OWNER,
      status: "active",
    });

    await Goal.create({
      organizationId: demoOrg._id,
      period: "monthly",
      followersTarget: 1500,
      enquiriesTarget: 60,
      reviewsTarget: 25,
    });

    // Seed 5 historical months of metrics for Artisan Bakery & Cafe
    const sampleMonths = [
      {
        month: "2026-05",
        source: "Manual Records",
        followers: 420,
        posts: 6,
        likes: 180,
        comments: 24,
        shares: 8,
        enquiries: 22,
        orders: 7,
        reviews: 4,
        rating: 4.6,
        notes: "Started active weekly posting on Instagram.",
      },
      {
        month: "2026-06",
        source: "Instagram Insights",
        followers: 550,
        posts: 8,
        likes: 240,
        comments: 36,
        shares: 15,
        enquiries: 31,
        orders: 12,
        reviews: 8,
        rating: 4.7,
        notes: "Launched artisan croissant weekend special.",
      },
      {
        month: "2026-07",
        source: "Instagram Insights",
        followers: 720,
        posts: 10,
        likes: 350,
        comments: 48,
        shares: 22,
        enquiries: 42,
        orders: 19,
        reviews: 14,
        rating: 4.8,
        notes: "Introduced WhatsApp catalog ordering.",
      },
      {
        month: "2026-08",
        source: "Manual Records",
        followers: 890,
        posts: 9,
        likes: 410,
        comments: 52,
        shares: 28,
        enquiries: 48,
        orders: 24,
        reviews: 18,
        rating: 4.8,
        notes: "Added Google Maps review QR code at billing counter.",
      },
      {
        month: "2026-09",
        source: "Manual Records",
        followers: 1120,
        posts: 12,
        likes: 560,
        comments: 65,
        shares: 34,
        enquiries: 58,
        orders: 31,
        reviews: 22,
        rating: 4.9,
        notes: "Best month so far; sourdough workshops brought high retention.",
      },
    ];

    for (const m of sampleMonths) {
      await MonthlyMetrics.create({
        organizationId: demoOrg._id,
        ...m,
      });
    }

    // Seed upcoming planner items for demoOrg
    const now = new Date();
    const plannerItems = [
      {
        organizationId: demoOrg._id,
        createdBy: demoUser._id,
        date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        platform: "Instagram",
        type: "Product Showcase",
        description: "Reel: Fresh batch of almond croissants coming out of the oven at 7 AM.",
        status: "planned",
      },
      {
        organizationId: demoOrg._id,
        createdBy: demoUser._id,
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        platform: "WhatsApp Business",
        type: "Customer Review / Testimonial",
        description: "Status broadcast: Sharing 5-star Google review from Priya about birthday cake order.",
        status: "planned",
      },
      {
        organizationId: demoOrg._id,
        createdBy: demoUser._id,
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        platform: "Google Business Profile",
        type: "Announcement / Update",
        description: "Post: Extended weekend brunch hours from 8 AM to 4 PM with new sourdough toast menu.",
        status: "planned",
      },
      {
        organizationId: demoOrg._id,
        createdBy: demoUser._id,
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        platform: "Instagram",
        type: "Behind the Scenes",
        description: "Story series: How we feed and maintain our 4-year-old sourdough starter.",
        status: "published",
        completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const item of plannerItems) {
      await PlannerItem.create({
        ...item,
        status: item.status as any,
      });
    }

    console.log("✅ Seeded default demo account: demo@digigrowth.com / password123");
  }

  console.log(`✅ Seed complete. ${coursesCount} courses and ${lessonsCount} lessons added.`);
  return { coursesCount, lessonsCount };
};

// Allow running directly via CLI
if (require.main === module) {
  connectDatabase()
    .then(() => runSeeds())
    .then(() => {
      console.log("Seeding finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding error:", err);
      process.exit(1);
    });
}
