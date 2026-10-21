import type { IconType } from 'react-icons';
import {
  FiCode,
  FiSmartphone,
  FiCloud,
  FiTarget,
  FiLayers,
  FiSend,
} from 'react-icons/fi';

// ─── Hero ───────────────────────────────────────────
export const HERO = {
  headline: "I Build Scalable Business Outcomes",
  headlineSuffixes: [
    "scalable business outcomes",
    "production-grade apps",
    "full-stack MVPs",
    "AI-powered solutions",
    "end-to-end product experiences",
  ],
  subheadline:
    "Full-stack mobile & web developer who ships. From the Play Store & App Store to Firebase backends — I take your idea from concept to launch. No fluff, just delivery.",
  ctaPrimary: { label: "Start A Project With Me", href: "mailto:akil@kennedyai.us?subject=Freelance%20Project%20Inquiry" },
  ctaSecondary: { label: "View Case Studies", href: "#case-studies" },
};

// ─── Capabilities ───────────────────────────────────
export interface Capability {
  icon: IconType;
  title: string;
  description: string;
  highlights: string[];
  gradient: string;
}

export const CAPABILITIES: Capability[] = [
  {
    icon: FiSmartphone,
    title: "Mobile App Development",
    description:
      "Full-cycle native & cross-platform app development shipped to both major app stores.",
    highlights: [
      "Flutter & Kotlin Multiplatform",
      "iOS (Swift) & Android native",
      "CI/CD + App Store Connect",
      "Push notifications & real-time sync",
    ],
    gradient: "from-cyan-400/20 to-blue-500/10",
  },
  {
    icon: FiCode,
    title: "Full-Stack Web Apps",
    description:
      "React-powered front-ends backed by scalable cloud infrastructure. Built to handle real traffic from day one.",
    highlights: [
      "React + TypeScript + Tailwind",
      "Firebase (Auth, Firestore, Functions)",
      "REST & GraphQL APIs",
      "Vite / Next.js deployment pipelines",
    ],
    gradient: "from-violet-400/20 to-purple-500/10",
  },
  {
    icon: FiCloud,
    title: "Cloud & Backend Infrastructure",
    description:
      "Firebase-native backend architecture with real-time data, serverless functions, and automated deployment.",
    highlights: [
      "Firebase Auth & Security Rules",
      "Cloud Functions (Firestore triggers)",
      "Cloud Storage & CDN",
      "Firebase Hosting + Custom Domains",
    ],
    gradient: "from-amber-400/20 to-orange-500/10",
  },
];

// ─── Case Studies ───────────────────────────────────
export interface CaseStudy {
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  outcome: string;
  tags: string[];
  storeLinks?: { label: string; url: string }[];
  gradient: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    title: "JokeBook · JokeBook Go",
    tagline: "A comedian's toolbelt, digital.",
    problem:
      "Comedians were juggling notes, set lists, and recordings across a dozen apps. No single tool existed for the stage-to-road workflow.",
    solution:
      "Built a Flutter + Firebase app with real-time set-list reordering, one-tap audio recording per joke, and cloud sync across devices. Shipped to both app stores with automated CI/CD.",
    outcome:
      "Launched on iOS and Android with Firebase Auth + Firestore backend. Active users recording sets within minutes of first launch.",
    tags: ["Flutter", "Firebase", "iOS", "Android", "CI/CD"],
    storeLinks: [
      { label: "App Store", url: "https://apps.apple.com/us/app/jokebook-go/id6746818787" },
      { label: "Play Store", url: "https://play.google.com/store/apps/details?id=com.jokebook.app" },
    ],
    gradient: "from-cyan-500/10 to-blue-600/5",
  },
  {
    title: "Booked Mic",
    tagline: "Open mic nights, streamlined.",
    problem:
      "Open mic hosts relied on paper sign-up sheets and constant distractions from performers.",
    solution:
      "Architected a real-time performer queue with Firebase Realtime Database, automated waitlist management, push notification check-ins, and admin controls for rotation management.",
    outcome:
      "Deployed with Firebase Cloud Functions for rotation logic, Firestore for user data, and FCM for check-in notifications. Hosts can manage spots and performers get real-time queue position updates.",
    tags: ["Flutter", "Firebase", "Cloud Functions", "FCM", "Kotlin"],
    gradient: "from-violet-500/10 to-purple-600/5",
  },
  {
    title: "ArcWriter Studio",
    tagline: "Structural screenwriting analysis tool.",
    problem:
      "Screenwriters have powerful drafting tools, but no dedicated tool for analyzing structural integrity — plot holes, character arc gaps, and logic inconsistencies go unnoticed until feedback rounds.",
    solution:
      "Designed ArcWriter as a web-based structural analysis engine. Built a screenplay parser that extracts narrative structure, tracks character threads, identifies logic gaps, and surfaces plot holes before a writer ever sends their script out for feedback.",
    outcome:
      "Launched at arcwriter.us as a SaaS platform. Writers upload their scripts and receive immediate structural analysis — scene-by-scene breakdowns, character arc tracking, plot hole detection, and narrative continuity scoring. Currently in active development with community-driven feedback shaping v2.5.4.",
    tags: ["Vue.js", "Node.js", "AI/LLM", "Firebase", "OpenAI API"],
    gradient: "from-emerald-500/10 to-teal-600/5",
  },
];

// ─── Tech Stack ─────────────────────────────────────
export interface TechCategory {
  category: string;
  items: string[];
}

export const TECH_CATEGORIES: TechCategory[] = [
  { category: "Mobile", items: ["Flutter", "Swift", "Kotlin", "Jetpack Compose"] },
  { category: "Web", items: ["React", "TypeScript", "Tailwind CSS", "Vite", "Next.js"] },
  { category: "Backend", items: ["Node.js", "Firebase", "Cloud Functions", "Firestore"] },
  { category: "DevOps", items: ["Firebase CLI", "CI/CD Pipelines", "GitHub Actions", "Play Console"] },
  { category: "Design", items: ["Figma", "Pixel Lab", "Framer Motion", "Responsive Design"] },
  { category: "AI", items: ["OpenAI API", "RAG Pipelines", "LangChain", "Prompt Engineering"] },
];

// ─── Engagement Model ───────────────────────────────
export interface Phase {
  icon: IconType;
  phase: string;
  title: string;
  description: string;
  deliverables: string[];
  duration?: string;
}

export const ENGAGEMENT_PHASES: Phase[] = [
  {
    icon: FiTarget,
    phase: "Phase 1",
    title: "Discovery & Architecture",
    description:
      "We align on vision, define scope, and design the technical foundation before a single line of production code is written.",
    deliverables: [
      "Requirements document & user flows",
      "Architecture diagram & tech stack selection",
      "Firebase schema design & security rules spec",
      "Project roadmap & milestone timeline",
    ],
    duration: "3-5 days",
  },
  {
    icon: FiLayers,
    phase: "Phase 2",
    title: "Build & Iterate",
    description:
      "Agile development with weekly deliverables. You see progress every sprint — no black boxes, no surprises.",
    deliverables: [
      "Working MVP in 2-3 weeks",
      "Daily asynchronous updates",
      "Weekly demo of live build",
      "Automated CI/CD pipeline setup",
    ],
    duration: "2-6 weeks",
  },
  {
    icon: FiSend,
    phase: "Phase 3",
    title: "Launch & Support",
    description:
      "Production deployment with App Store/Play Store submission, Firebase hosting configuration, and post-launch support.",
    deliverables: [
      "App Store & Play Store submission",
      "Firebase Hosting + custom domain",
      "Analytics & crash reporting integration",
      "2 weeks post-launch support",
    ],
    duration: "1-2 weeks",
  },
];

// ─── Testimonials ───────────────────────────────────
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "One of the most naturally talented devs I've had the pleasure of watching create. He catches issues early and communicates clearly.",
    author: "Darius J.",
    role: "Technical Co-founder",
  },
  {
    quote:
      "Shipped our MVP in under 3 weeks. The attention to Firebase security rules and real-time architecture was exactly what we needed.",
    author: "Marcus T.",
    role: "Product Lead",
  },
];
