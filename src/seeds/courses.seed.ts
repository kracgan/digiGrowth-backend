export interface ISeedCourse {
  title: string;
  slug: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedDuration: string;
  icon: string;
  lessons: {
    order: number;
    title: string;
    durationMinutes: number;
    objectives: string[];
    contentBlocks: {
      type: "text" | "heading" | "list" | "callout" | "tip" | "example";
      heading?: string;
      text?: string;
      items?: string[];
      tip?: string;
      callout?: string;
    }[];
    practicalTask: {
      title: string;
      description: string;
      defaultPlatform: string;
      defaultType: string;
    };
    quizQuestions: {
      question: string;
      options: string[];
      correctOptionIndex: number;
      explanation: string;
    }[];
  }[];
}

export const SEED_COURSES: ISeedCourse[] = [
  {
    title: "1. Digital Marketing Foundations for Small Business",
    slug: "marketing-foundations",
    description:
      "Understand your ideal customer, craft your unique value proposition, and establish a repeatable customer acquisition loop without burning budget.",
    category: "Marketing Basics",
    level: "beginner",
    estimatedDuration: "25 mins",
    icon: "Compass",
    lessons: [
      {
        order: 1,
        title: "Defining Your Ideal Customer Profile",
        durationMinutes: 6,
        objectives: [
          "Identify who truly buys from you rather than trying to appeal to everyone",
          "Pinpoint customer pain points and purchasing triggers",
        ],
        contentBlocks: [
          {
            type: "heading",
            heading: "Why 'Everyone' is Never Your Customer",
          },
          {
            type: "text",
            text: "When a local business tries to target everybody, their message resonates with nobody. The most profitable small businesses focus sharply on a primary customer group who has an urgent problem and money to spend.",
          },
          {
            type: "list",
            items: [
              "What problem keeps them searching for a solution locally?",
              "Why do they choose a local business over a generic e-commerce app?",
              "What is their main hesitation before paying you?",
            ],
          },
          {
            type: "callout",
            callout:
              "A small cafe near offices shouldn't market 'food for all'. They should market 'Fresh 5-minute lunch combos for busy professionals'.",
          },
          {
            type: "tip",
            tip: "Ask your last 3 paying customers one question: 'What made you decide to buy from us today?' Their exact words are your best marketing copy.",
          },
        ],
        practicalTask: {
          title: "Write down 3 specific customer triggers",
          description:
            "Draft a simple social post or WhatsApp status addressing the #1 reason customers visit your shop or book your service.",
          defaultPlatform: "Instagram",
          defaultType: "Educational / Tip",
        },
        quizQuestions: [
          {
            question: "Why should a local business avoid targeting 'everyone'?",
            options: [
              "Marketing becomes too expensive and the message becomes generic",
              "Social media algorithms block accounts that target everyone",
              "It is illegal under local business advertising rules",
              "Customers only buy from global brands",
            ],
            correctOptionIndex: 0,
            explanation:
              "Focusing on a specific customer profile keeps marketing messages sharp and prevents wasting time and budget.",
          },
        ],
      },
      {
        order: 2,
        title: "The 4-Step Local Customer Journey",
        durationMinutes: 8,
        objectives: [
          "Map how a stranger turns into a paying customer",
          "Identify where potential customers are leaking out of your funnel",
        ],
        contentBlocks: [
          {
            type: "heading",
            heading: "Awareness → Consideration → Decision → Retention",
          },
          {
            type: "text",
            text: "Customers do not immediately purchase the first time they see your name. They move through 4 predictable stages:",
          },
          {
            type: "list",
            items: [
              "1. Awareness: Discovering your business on Google, Instagram, or via a friend.",
              "2. Consideration: Checking your reviews, photos, prices, or WhatsApp catalog.",
              "3. Decision: Sending a direct message, visiting your store, or placing an order.",
              "4. Retention: Coming back for repeat orders and referring friends.",
            ],
          },
          {
            type: "tip",
            tip: "If people discover your page but never send enquiries, your contact info or pricing transparency might be the friction point.",
          },
        ],
        practicalTask: {
          title: "Verify your business contact details",
          description:
            "Ensure your WhatsApp link, phone number, and address are visible in under 3 seconds on all social profiles.",
          defaultPlatform: "WhatsApp Business",
          defaultType: "Announcement / Update",
        },
        quizQuestions: [
          {
            question:
              "If many people view your profile but nobody sends an enquiry, where is the friction?",
            options: [
              "Between Awareness and Consideration / Decision",
              "Only in Retention",
              "There is no issue; views automatically equal money",
              "Google has penalised your website",
            ],
            correctOptionIndex: 0,
            explanation:
              "When awareness exists but inquiries don't happen, your profile needs clearer calls-to-action or contact information.",
          },
        ],
      },
    ],
  },
  {
    title: "2. Instagram & Social Media Growth",
    slug: "social-media-growth",
    description:
      "Build a loyal local following, showcase your products visually, and convert post views into actual sales enquiries.",
    category: "Social Media",
    level: "beginner",
    estimatedDuration: "30 mins",
    icon: "Instagram",
    lessons: [
      {
        order: 1,
        title: "Optimizing Your Instagram Bio for Conversions",
        durationMinutes: 7,
        objectives: [
          "Turn profile visitors into direct leads within 5 seconds",
          "Craft a clear 3-line bio that explains what you sell and where",
        ],
        contentBlocks: [
          {
            type: "heading",
            heading: "Your Bio is Your Digital Shopfront",
          },
          {
            type: "text",
            text: "When someone lands on your profile, they decide in 3 seconds whether to follow, message, or leave. Avoid poetic quotes; tell them what you do.",
          },
          {
            type: "list",
            items: [
              "Line 1: Who you help and what you offer (e.g. 'Handcrafted sourdough & artisan pastries')",
              "Line 2: Location & Service area (e.g. 'Downtown Indiranagar • Dine-in & Delivery')",
              "Line 3: Call-to-action with link (e.g. 'Tap below to order on WhatsApp 👇')",
            ],
          },
          {
            type: "tip",
            tip: "Use a direct WhatsApp chat link (wa.me/yourNumber) as your bio link for the fastest enquiry turnaround.",
          },
        ],
        practicalTask: {
          title: "Audit and update your Instagram Bio",
          description:
            "Review your profile picture, bio text, and contact button. Ensure your city/neighborhood is clearly stated.",
          defaultPlatform: "Instagram",
          defaultType: "Announcement / Update",
        },
        quizQuestions: [
          {
            question: "What is the most crucial element in a local business bio?",
            options: [
              "A clear statement of what you sell, your location, and a direct contact link",
              "A collection of 20 inspirational hashtags",
              "Only an artistic quote",
              "Your full personal biography and hobbies",
            ],
            correctOptionIndex: 0,
            explanation:
              "Clear value proposition + location + direct contact method ensures visitors convert immediately into customers.",
          },
        ],
      },
      {
        order: 2,
        title: "Creating High-Converting Reels & Carousels",
        durationMinutes: 9,
        objectives: [
          "Understand the 3 content pillars: Educational, Behind the scenes, and Proof",
          "Hook viewers in the first 2 seconds",
        ],
        contentBlocks: [
          {
            type: "heading",
            heading: "The 3 Pillars of Small Business Content",
          },
          {
            type: "text",
            text: "You don't need to dance or do complex trends. Business content works best when it builds trust and demonstrates craft.",
          },
          {
            type: "list",
            items: [
              "Behind the scenes: Packing an order, selecting raw materials, or cleaning the workstation.",
              "Problem solving: Showing how your product solves a common frustration.",
              "Customer proof: Photos of happy customers, unboxing videos, or text reviews.",
            ],
          },
        ],
        practicalTask: {
          title: "Film a 15-second behind-the-scenes video",
          description:
            "Record a short clip preparing a product or opening your store for the day. Post it to Stories or Reels.",
          defaultPlatform: "Instagram",
          defaultType: "Behind the Scenes",
        },
        quizQuestions: [
          {
            question: "Which type of content builds the fastest trust for a local business?",
            options: [
              "Behind-the-scenes craft and real customer testimonials",
              "Stock photos downloaded from the internet",
              "Posting only promotional discount flyers",
              "Copy-pasting celebrity memes",
            ],
            correctOptionIndex: 0,
            explanation:
              "Authentic behind-the-scenes footage and genuine customer feedback build credibility and emotional connection.",
          },
        ],
      },
    ],
  },
  {
    title: "3. WhatsApp Business Mastery",
    slug: "whatsapp-business-mastery",
    description:
      "Transform WhatsApp into your highest-converting direct sales and customer retention channel.",
    category: "Messaging",
    level: "beginner",
    estimatedDuration: "25 mins",
    icon: "MessageSquare",
    lessons: [
      {
        order: 1,
        title: "Setting Up Your WhatsApp Business Catalog & Quick Replies",
        durationMinutes: 8,
        objectives: [
          "Upload your top products/services with prices to WhatsApp Catalog",
          "Configure Quick Replies (/price, /address, /hours) to reply in 5 seconds",
        ],
        contentBlocks: [
          {
            type: "heading",
            heading: "Speed Wins the Sale",
          },
          {
            type: "text",
            text: "Studies show that businesses responding to WhatsApp inquiries within 15 minutes are 7x more likely to secure the sale than those replying after 2 hours.",
          },
          {
            type: "list",
            items: [
              "/address: Provides full directions, Google Maps pin, and parking info.",
              "/pricing: Sends your top package breakdown and payment modes.",
              "/hours: Informs about operating hours and delivery timings.",
            ],
          },
          {
            type: "tip",
            tip: "Set up an 'Away Message' during off-hours with your catalog link so late-night browsers can still explore your products.",
          },
        ],
        practicalTask: {
          title: "Create 3 Quick Replies in WhatsApp Business",
          description:
            "Set up shortcuts for your store address, standard price list, and bank/UPI payment details.",
          defaultPlatform: "WhatsApp Business",
          defaultType: "Educational / Tip",
        },
        quizQuestions: [
          {
            question: "Why are Quick Replies critical for small business WhatsApp sales?",
            options: [
              "They dramatically reduce customer response time and prevent lost sales",
              "They allow you to spam hundreds of unknown numbers",
              "They replace the need to provide good customer service",
              "WhatsApp gives monetary rewards for using them",
            ],
            correctOptionIndex: 0,
            explanation:
              "Fast, structured responses keep potential buyers engaged before they look at competing alternatives.",
          },
        ],
      },
    ],
  },
  {
    title: "4. Google Business Profile & Local SEO",
    slug: "google-business-profile",
    description:
      "Dominate local searches on Google Maps and search results when nearby customers look for what you sell.",
    category: "Local SEO",
    level: "beginner",
    estimatedDuration: "30 mins",
    icon: "MapPin",
    lessons: [
      {
        order: 1,
        title: "Claiming and Verifying Your Google Profile",
        durationMinutes: 7,
        objectives: [
          "Ensure your profile is verified and displays accurate operating hours",
          "Choose the single most accurate primary business category",
        ],
        contentBlocks: [
          {
            type: "heading",
            heading: "The Power of the Google Local 3-Pack",
          },
          {
            type: "text",
            text: "When anyone searches 'hair salon near me' or 'bakery in bandra', Google shows a map with only 3 businesses. Ranking here costs zero advertising dollars.",
          },
          {
            type: "list",
            items: [
              "Primary category has the largest ranking weight: pick the most specific match.",
              "Name must match your actual signage: avoid keyword stuffing that risks suspension.",
              "Phone number and website URL must be verified.",
            ],
          },
        ],
        practicalTask: {
          title: "Upload 5 high-quality photos to your Google Profile",
          description:
            "Add photos of your storefront exterior, interior, team, and best products to Google Maps.",
          defaultPlatform: "Google Business Profile",
          defaultType: "Product Showcase",
        },
        quizQuestions: [
          {
            question: "What is the single most important ranking signal on Google Business Profile?",
            options: [
              "Choosing the most accurate primary business category",
              "Stuffing 10 keywords into your legal business name",
              "Paying a third-party directory site",
              "Posting once every 6 months",
            ],
            correctOptionIndex: 0,
            explanation:
              "Google's local algorithm relies heavily on having the exact primary category matched to the search query.",
          },
        ],
      },
    ],
  },
  {
    title: "5. Content Creation & Planning Habits",
    slug: "content-planning-habits",
    description:
      "Overcome creator block by establishing a simple weekly 1-hour batching system for all your marketing assets.",
    category: "Content Planning",
    level: "intermediate",
    estimatedDuration: "25 mins",
    icon: "Calendar",
    lessons: [
      {
        order: 1,
        title: "The 1-Hour Weekly Content Batching System",
        durationMinutes: 8,
        objectives: [
          "Plan a full week of posts in 60 minutes instead of stressing daily",
          "Organize content into predictable weekday themes",
        ],
        contentBlocks: [
          {
            type: "heading",
            heading: "Stop Creating in Real Time",
          },
          {
            type: "text",
            text: "Thinking 'what should I post today?' every single morning drains creative energy. Successful owners block Monday mornings to schedule 3 pieces of content.",
          },
          {
            type: "list",
            items: [
              "Tuesday: Tip or Advice related to your craft.",
              "Thursday: Product highlight or new stock arrival.",
              "Saturday: Customer review or behind-the-scenes weekend vibe.",
            ],
          },
        ],
        practicalTask: {
          title: "Add 3 scheduled items to your Marketing Planner",
          description:
            "Open your Digital Growth Planner and schedule 3 activities for the upcoming week.",
          defaultPlatform: "Instagram",
          defaultType: "Product Showcase",
        },
        quizQuestions: [
          {
            question: "What is the primary benefit of batch-planning your content?",
            options: [
              "It removes daily stress and ensures consistent publishing cadence",
              "It makes your posts go viral automatically",
              "It allows you to stop taking customer calls",
              "You never need to take photos of your business",
            ],
            correctOptionIndex: 0,
            explanation:
              "Batching saves hours each week, maintains quality, and guarantees you never miss posting during busy operational days.",
          },
        ],
      },
    ],
  },
  {
    title: "6. Online Advertising on a Small Budget",
    slug: "online-advertising-budget",
    description:
      "Run targeted local ad campaigns starting with as little as $2/day without paying expensive agency retainers.",
    category: "Online Advertising",
    level: "intermediate",
    estimatedDuration: "35 mins",
    icon: "Target",
    lessons: [
      {
        order: 1,
        title: "Boosting Your Proven Organic Winners",
        durationMinutes: 9,
        objectives: [
          "Never boost a post that failed organically",
          "Target a 5km radius around your physical business location",
        ],
        contentBlocks: [
          {
            type: "heading",
            heading: "The Golden Rule of Small Business Ads",
          },
          {
            type: "text",
            text: "Paid advertising is an amplifier. If a post received zero comments or shares from your followers, throwing money at it won't fix the underlying message.",
          },
          {
            type: "list",
            items: [
              "Look at your last 10 posts: find the one with the highest organic saves or shares.",
              "Set a local radius: 3–7 km around your shop or service coverage zone.",
              "Goal: Direct message or WhatsApp clicks rather than generic website traffic.",
            ],
          },
        ],
        practicalTask: {
          title: "Identify your top organic post from last month",
          description:
            "Review your insights and note which post generated the most customer inquiries or saves.",
          defaultPlatform: "Instagram",
          defaultType: "Offer / Promotion",
        },
        quizQuestions: [
          {
            question: "Which post is best suited for paid boosting on a small budget?",
            options: [
              "A post that already demonstrated high organic engagement and interest",
              "A brand new image that nobody has ever seen before",
              "A graphic with 10 paragraphs of text",
              "A post that performed terribly among your existing audience",
            ],
            correctOptionIndex: 0,
            explanation:
              "Amplifying existing organic winners minimizes financial risk and maximizes return on modest budgets.",
          },
        ],
      },
    ],
  },
  {
    title: "7. Customer Reviews & Reputation Management",
    slug: "customer-reviews-reputation",
    description:
      "Systematically collect 5-star reviews, handle negative feedback professionally, and turn reputation into revenue.",
    category: "Reviews",
    level: "beginner",
    estimatedDuration: "20 mins",
    icon: "Star",
    lessons: [
      {
        order: 1,
        title: "The Gentle Review Request Script",
        durationMinutes: 6,
        objectives: [
          "Ask for reviews at the moment of highest customer satisfaction",
          "Provide a direct 1-tap review link rather than general instructions",
        ],
        contentBlocks: [
          {
            type: "heading",
            heading: "Timing is Everything",
          },
          {
            type: "text",
            text: "Customers intend to leave nice reviews, but life gets busy. The secret is asking within 2 hours of a completed purchase or meal with a direct link.",
          },
          {
            type: "example",
            text: "'Hi Sarah! So happy you loved your order today. If you have 30 seconds, leaving us a quick review really helps our small team grow: [direct-link] Thank you!'",
          },
        ],
        practicalTask: {
          title: "Send a review request message to 2 recent customers",
          description:
            "Pick two customers who had a great experience this week and share your direct Google/review link with them.",
          defaultPlatform: "WhatsApp Business",
          defaultType: "Customer Review / Testimonial",
        },
        quizQuestions: [
          {
            question: "When is the optimal time to request a customer review?",
            options: [
              "Right after they express delight with their purchase or service",
              "3 months after the transaction took place",
              "Before they even receive the product",
              "Only when they complain about pricing",
            ],
            correctOptionIndex: 0,
            explanation:
              "Asking at the moment of highest delight captures authentic enthusiasm and achieves the highest review completion rate.",
          },
        ],
      },
    ],
  },
  {
    title: "8. Measurement, KPIs & Continuous Improvement",
    slug: "measurement-and-kpis",
    description:
      "Track the metrics that actually matter (conversion rate, enquiries, orders) and make data-driven growth experiments.",
    category: "Measurement",
    level: "intermediate",
    estimatedDuration: "25 mins",
    icon: "TrendingUp",
    lessons: [
      {
        order: 1,
        title: "Vanity Metrics vs. Growth Metrics",
        durationMinutes: 8,
        objectives: [
          "Differentiate follower count from enquiry and order volume",
          "Calculate your conversion rate: Orders ÷ Enquiries",
        ],
        contentBlocks: [
          {
            type: "heading",
            heading: "Likes Don't Pay the Rent",
          },
          {
            type: "text",
            text: "10,000 followers with zero enquiries is worse than 500 local followers who buy from you every month.",
          },
          {
            type: "list",
            items: [
              "Followers & Likes: General brand signal, useful for social proof.",
              "Enquiries & WhatsApp Messages: Warm prospective buyers asking for availability or prices.",
              "Orders: Actual revenue transactions.",
              "Conversion Rate: (Orders ÷ Enquiries) × 100.",
            ],
          },
        ],
        practicalTask: {
          title: "Calculate your latest monthly conversion rate",
          description:
            "Record your latest monthly results in the Business Results tab and inspect your conversion score.",
          defaultPlatform: "Other",
          defaultType: "Educational / Tip",
        },
        quizQuestions: [
          {
            question: "What is the formula for calculating customer conversion rate?",
            options: [
              "(Orders ÷ Enquiries) × 100",
              "(Followers ÷ Likes) × 100",
              "Total views divided by days in month",
              "Number of hashtags used",
            ],
            correctOptionIndex: 0,
            explanation:
              "Conversion rate measures how many people who inquired about your business actually purchased.",
          },
        ],
      },
    ],
  },
];
