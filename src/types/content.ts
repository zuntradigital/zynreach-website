import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface MegaMenuColumn {
  heading: string;
  links: NavLink[];
}

export interface MegaMenuPromo {
  eyebrow: string;
  headline: string;
  href: string;
  /** Path under /public to this promo's representative photo, rendered behind a dark scrim so the existing text treatment stays unchanged. */
  image: string;
}

export interface NavMegaItem {
  label: string;
  type: "mega";
  columns: MegaMenuColumn[];
  promo?: MegaMenuPromo;
}

export interface NavDropdownItem {
  label: string;
  type: "dropdown";
  links: NavLink[];
}

export interface NavSimpleItem {
  label: string;
  type: "link";
  href: string;
}

export type NavItem = NavMegaItem | NavDropdownItem | NavSimpleItem;

export interface FeatureCardItem {
  icon: LucideIcon;
  headline: string;
  description: string;
  href?: string;
}

export interface TestimonialItem {
  quote: string;
  authorName: string;
  authorTitle: string;
  company: string;
  metric?: { value: string; label: string };
}

export interface LogoItem {
  name: string;
}

export interface PersonaSelectorItem {
  id: string;
  label: string;
  headline: string;
  description: string;
  metric: { value: string; label: string };
  href: string;
}

/** Shared page-type schema for the 6 capability pages (SRS Section 7.3). */
export interface CapabilityPageContent {
  slug: string;
  navLabel: string;
  meta: {
    h1: string;
    title: string;
    description: string;
  };
  hero: {
    headline: string;
    subhead: string;
  };
  whoItsFor: { label: string; href: string }[];
  featureBlocks: {
    headline: string;
    description: string;
    proof: { stat: string; label: string };
  }[];
  howItWorks: {
    headline: string;
    description: string;
  }[];
  comparison: {
    title: string;
    statusQuo: string;
    withZynReach: string;
  };
  relatedIntegrations: string[];
  seoKeywordCluster: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  priceSuffix: string;
  featureList: string[];
  ctaLabel: string;
  ctaHref: string;
  isFeatured?: boolean;
}

export interface ComparisonRow {
  category: string;
  feature: string;
  values: (string | boolean)[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** Shared page-type schema for Solutions sub-pages (SRS Section 7.8). */
export interface SolutionPageContent {
  slug: string;
  navLabel: string;
  meta: {
    h1: string;
    title: string;
    description: string;
  };
  hero: {
    headline: string;
    subhead: string;
  };
  primaryCta: { label: string; href: string };
  before: { label: string; body: string };
  after: { label: string; body: string };
  capabilityCallouts: { label: string; href: string; description: string }[];
  howItWorks: { headline: string; description: string }[];
  storyNote: string;
  relatedIntegrations: string[];
}

/** Shared page-type schema for Industries sub-pages (SRS Section 7.10). */
export interface IndustryPageContent {
  slug: string;
  navLabel: string;
  /** Path under /public to this industry's representative photo — reused for both the Home page card and this page's hero. */
  image: string;
  meta: {
    h1: string;
    title: string;
    description: string;
  };
  hero: {
    headline: string;
    subhead: string;
  };
  workflowSteps: string[];
  capabilityCallouts: { label: string; href: string; description: string }[];
  useCaseNote: string;
  complianceNote: string;
}

/** Shared page-type schema for Legal pages (SRS Section 7.20). Effective date/version are CMS-managed fields. */
export interface LegalPageContent {
  slug: string;
  navLabel: string;
  title: string;
  effectiveDate: string;
  version: string;
  /**
   * `list` is optional per section — most of the site's original 4 legal
   * pages are flowing prose only; the Legal/Security Center policy set
   * added later enumerates obligations clause-by-clause, so a bullet list
   * renders under the section's prose when present rather than forcing
   * every enumerated legal point into a single run-on paragraph.
   */
  sections: { id: string; heading: string; body: string[]; list?: string[] }[];
}

/**
 * A single inline run of text within a block, carrying character-level
 * formatting (bold/italic/link) — the CMS Blog editor's Tiptap toolbar
 * produces these; hand-authored/hardcoded content never does.
 */
export interface InlineSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  href?: string;
}

export type ArticleBlock =
  | { type: "paragraph"; text: string; content?: InlineSpan[] }
  | { type: "heading"; id: string; text: string; level?: 1 | 2 | 3; content?: InlineSpan[] }
  | { type: "quote"; text: string; content?: InlineSpan[] }
  | { type: "list"; items: string[]; ordered?: boolean; itemsContent?: InlineSpan[][] }
  | { type: "image"; url: string; alt: string }
  | { type: "code"; code: string; language?: string };

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  bio: string;
}

/** Blog article content model (SRS Section 7.16). */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  authorId: string;
  publishedDate: string;
  updatedDate?: string;
  body: ArticleBlock[];
  relatedSlugs: string[];
  featured?: boolean;
  /** Cover image — absent for hardcoded/fallback posts and any live post that hasn't set one yet. */
  image?: string;
  imageAlt?: string;
  /** SEO overrides (SRS §19/§28.2 SEORecord) — absent falls back to title/excerpt/site defaults. */
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

/** Customer story content model (SRS Section 7.18). */
export interface CustomerStory {
  slug: string;
  customerName: string;
  /** Path under /public to this story's representative photo — reused for both the Home page card and this story's detail-page hero. */
  image: string;
  headlineMetric: { value: string; label: string };
  industry: string;
  productArea: string;
  companySize: string;
  challenge: string;
  solution: string;
  result: string;
  quote: { text: string; authorName: string; authorTitle: string };
  relatedCapabilities: { label: string; href: string }[];
}

/** Documentation article content model (SRS Section 7.17). */
export interface DocArticle {
  slug: string;
  category: string;
  title: string;
  description: string;
  body: ArticleBlock[];
  order: number;
}

export interface ApiEndpoint {
  slug: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  summary: string;
  authRequired: boolean;
  parameters: { name: string; type: string; required: boolean; description: string }[];
  requestExample?: string;
  responseExample: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  format: "Guide" | "Template" | "Whitepaper" | "Checklist" | "Playbook";
  gated?: boolean;
  downloadUrl?: string;
  /** Knowledge Center §7 Content Page fields. */
  category?: string;
  targetAudience?: string;
  difficultyLevel?: "Beginner" | "Intermediate" | "Advanced";
  relatedSlugs?: string[];
}

export interface Webinar {
  slug: string;
  title: string;
  description: string;
  date: string;
  speaker: string;
  gated: boolean;
  featured?: boolean;
  isOnDemand?: boolean;
  category?: string;
}

export interface Integration {
  slug: string;
  name: string;
  category: string;
  description: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  productArea: string;
  title: string;
  description: string;
}

export interface StatusComponent {
  name: string;
  status: "operational" | "degraded" | "outage";
}

export interface IncidentLogEntry {
  date: string;
  title: string;
  status: "resolved" | "monitoring";
  summary: string;
}
