import { pdrnArticle } from "./pdrn-article";
import { clinicQuoteArticle } from "./clinic-quote-article";
import { seoulKbeautyShoppingArticle } from "./seoul-kbeauty-shopping-article";
import { seoulClinicShortTripArticle } from "./seoul-clinic-short-trip-article";
import { niznotNumberedAmpoulesArticle } from "./niznot-numbered-ampoules-article";
import { seoulPersonalColorAnalysisArticle } from "./seoul-personal-color-analysis-article";

export type ArticleBlock =
  | { kind: "p" | "h2" | "cta" | "note"; text: string; refs?: string[] }
  | { kind: "table"; rows: string[][] }
  | { kind: "list"; items: string[] };

export type Category = {
  slug: string;
  name: string;
  kicker: string;
  description: string;
};

export type Article = {
  slug: string;
  title: string;
  dek: string;
  category: string;
  categorySlug: string;
  image: string;
  imageAlt: string;
  readTime: string;
  updated: string;
  reviewed: boolean;
  featured?: boolean;
  seoKeywords: string[];
  takeaways: string[];
  body: string[];
  checklist: string[];
  contentBlocks?: ArticleBlock[];
  sources?: { id: string; title: string; url: string }[];
  showSources?: boolean;
  relatedLinks?: { title: string; href: string }[];
  imageCredit?: string;
  reviewNote?: string;
};

export const categories: Category[] = [
  {
    slug: "start-here",
    name: "Start Here",
    kicker: "First-time guide",
    description: "Clear starting points for planning a Seoul beauty trip without rushing into a booking."
  },
  {
    slug: "treatments",
    name: "Treatments Dictionary",
    kicker: "Terms explained",
    description: "Plain-English explainers for K-beauty treatment terms global readers keep seeing online."
  },
  {
    slug: "seoul-clinic-guide",
    name: "Seoul Clinic Guide",
    kicker: "Before booking",
    description: "Questions, timing, language, and itinerary checks to consider before choosing a clinic."
  },
  {
    slug: "k-beauty-products",
    name: "K Beauty Products",
    kicker: "Beauty shelf",
    description: "Korean skincare products, ingredients, brand stories, and travel-friendly product notes."
  },
  {
    slug: "beauty-trip-seoul",
    name: "Beauty Trip Seoul",
    kicker: "Travel routes",
    description: "Beauty-aware Seoul routes across clinics, cafes, hotels, shopping, and calm recovery days."
  }
];

export const articles: Article[] = [
  clinicQuoteArticle,
  seoulPersonalColorAnalysisArticle,
  niznotNumberedAmpoulesArticle,
  seoulClinicShortTripArticle,
  seoulKbeautyShoppingArticle,
  pdrnArticle,
  {
    slug: "what-is-rejuran-in-korea",
    title: "What Is Rejuran in Korea?",
    dek: "A calm guide to the K-beauty treatment term many travelers see before planning a Seoul clinic visit.",
    category: "Treatments Dictionary",
    categorySlug: "treatments",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Minimal skincare bottles and soft towels on a bright vanity",
    readTime: "5 min read",
    updated: "2026-09-11",
    reviewed: true,
    featured: true,
    seoKeywords: ["Rejuran Korea", "Korean skin booster", "Seoul skin clinic"],
    takeaways: [
      "Rejuran is usually discussed as a skin-quality treatment category, not a one-size-fits-all glow promise.",
      "Travelers should ask about suitability, downtime, aftercare, and who performs the procedure.",
      "A good pre-booking conversation is more useful than choosing by viral treatment names alone."
    ],
    body: [
      "If you have searched Korean skin booster or glass skin clinic in Seoul, you have probably seen Rejuran mentioned. The name appears often in K-beauty conversations because travelers are curious about skin texture, hydration, and recovery-aware beauty planning.",
      "This article is not medical advice and does not promise a result. Think of it as a translation layer: what the term means, what to ask before booking, and how to avoid making a decision from a short viral post.",
      "Before you consider any clinic visit, ask whether the treatment is appropriate for your skin condition, travel schedule, pain tolerance, and aftercare window. The most useful question is not whether a treatment is famous. It is whether it fits your situation."
    ],
    checklist: [
      "Ask what the treatment is intended to address.",
      "Ask who evaluates suitability before the procedure.",
      "Ask about downtime, redness, swelling, and aftercare.",
      "Ask whether your travel schedule leaves enough recovery time.",
      "Avoid deciding only from celebrity-inspired wording or before-and-after images."
    ]
  },
  {
    slug: "how-to-book-a-skin-clinic-in-seoul-as-a-foreigner",
    title: "How to Book a Skin Clinic in Seoul as a Foreigner",
    dek: "The practical questions to ask before you choose a clinic, send a deposit, or build your beauty trip itinerary.",
    category: "Seoul Clinic Guide",
    categorySlug: "seoul-clinic-guide",
    image: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Quiet Seoul street with modern storefronts and warm evening light",
    readTime: "6 min read",
    updated: "2026-09-11",
    reviewed: true,
    featured: true,
    seoKeywords: ["Seoul skin clinic foreigner", "book skin clinic Seoul", "Korea beauty trip"],
    takeaways: [
      "A clinic booking is easier when you prepare your timing, language needs, and aftercare questions first.",
      "Foreign travelers should clarify consultation flow, payment, cancellation, and post-visit support.",
      "The best itinerary leaves space for recovery, not just sightseeing."
    ],
    body: [
      "Seoul has many beauty clinics, but foreign travelers often need a different planning process from local clients. You may be balancing flights, hotel location, language support, recovery time, and follow-up questions.",
      "Start by writing down your travel dates, skin concern, previous treatments, allergies, and whether you need English support. Then ask the clinic or concierge what can be confirmed before arrival and what requires an in-person consultation.",
      "Try not to book the most intense part of your itinerary immediately before an important event, long flight, or packed sightseeing day. A polished beauty trip still needs unglamorous details: timing, aftercare, and realistic expectations."
    ],
    checklist: [
      "Confirm whether English support is available.",
      "Ask what information is needed before booking.",
      "Clarify consultation, payment, deposit, and cancellation terms.",
      "Leave flexible time after the appointment.",
      "Keep all medical decisions for qualified professionals."
    ]
  },
  {
    slug: "korea-beauty-trip-checklist-before-visiting-a-clinic",
    title: "Korea Beauty Trip Checklist Before Visiting a Clinic",
    dek: "A traveler-friendly checklist for planning skincare, shopping, cafes, and quiet recovery time in Seoul.",
    category: "Beauty Trip Seoul",
    categorySlug: "beauty-trip-seoul",
    image: "/images/seoul-editorial-street.webp",
    imageAlt: "A quiet contemporary Seoul street in late-afternoon light",
    readTime: "4 min read",
    updated: "2026-09-11",
    reviewed: false,
    featured: true,
    seoKeywords: ["Korea beauty trip checklist", "Seoul beauty trip", "K-beauty travel"],
    takeaways: [
      "A beauty trip works best when clinic timing and travel plans are designed together.",
      "Product shopping, cafes, and hotel location can support a calmer schedule.",
      "Public content can inspire the trip, but private planning should handle sensitive details."
    ],
    body: [
      "A Seoul beauty trip can be more than a clinic appointment. Many travelers want a full route: skincare shopping, a calm cafe, hotel convenience, food that does not complicate recovery, and enough breathing room between plans.",
      "Build your schedule around comfort first. If a clinic visit is part of the trip, avoid cramming the same day with photoshoots, nightlife, or activities that may conflict with aftercare guidance.",
      "Use this checklist as a soft planning tool. For medical or procedure-specific decisions, ask the clinic directly and follow professional guidance."
    ],
    checklist: [
      "Choose a hotel area that reduces travel stress.",
      "Keep the day after a clinic visit flexible.",
      "Save product shopping for low-pressure time slots.",
      "Prepare translation notes for your skin concern.",
      "Ask before booking if your schedule feels too tight."
    ]
  }
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getArticlesByCategory(slug: string) {
  return articles.filter((article) => article.categorySlug === slug);
}
