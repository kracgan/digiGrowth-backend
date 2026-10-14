export const USER_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  TRAINER: "trainer",
  LEARNER: "learner",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const BUSINESS_CATEGORIES = [
  "Retail & Boutique",
  "Food & Restaurant / Cafe",
  "Beauty, Salon & Wellness",
  "Healthcare & Clinic",
  "Education & Coaching",
  "Handmade & Artisanal",
  "Local Professional Services",
  "Real Estate & Property",
  "Home Services & Repairs",
  "Other Local Business",
] as const;

export const MARKETING_GOALS = [
  "Get more customer enquiries",
  "Increase local brand awareness",
  "Drive more store footfall / visits",
  "Boost repeat orders / retention",
  "Build online reviews & reputation",
  "Grow social media following",
] as const;

export const PLANNER_STATUSES = {
  PLANNED: "planned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  PUBLISHED: "published",
} as const;

export const PLANNER_PLATFORMS = [
  "Instagram",
  "WhatsApp Business",
  "Google Business Profile",
  "Facebook",
  "YouTube / Shorts",
  "Email / Newsletter",
  "Local Event / Flyers",
  "Other",
] as const;

export const PLANNER_TYPES = [
  "Product Showcase",
  "Behind the Scenes",
  "Customer Review / Testimonial",
  "Educational / Tip",
  "Offer / Promotion",
  "Announcement / Update",
  "Poll / Question",
] as const;
