import {
  Bot,
  Users,
  Megaphone,
  Target,
  Workflow,
  BarChart3,
  ShieldCheck,
  Lock,
  FileCheck2,
  Sparkles,
  Layers,
  BadgeCheck,
  TrendingUp,
  Award,
  Briefcase,
  Percent,
  Globe2,
  Building2,
} from "lucide-react";
import type {
  FeatureCardItem,
  TestimonialItem,
  LogoItem,
  PersonaSelectorItem,
} from "@/types/content";

export const homeHero = {
  eyebrow: "AI-powered enterprise growth & operations",
  headline: "One Platform to Grow, Automate, and Run Your Business.",
  subhead:
    "ZynReach brings AI-powered growth, customer management, automation, operations, and business intelligence together in one unified enterprise platform.",
  ctaPrimary: { label: "Book a Demo", href: "/demo" },
  ctaSecondary: { label: "Start Free Trial", href: "/trial" },
};

export const trustFeatures = [
  {
    icon: Sparkles,
    headline: "AI-Powered Intelligence",
    description: "Smart automation and data-driven decisions in every workflow.",
  },
  {
    icon: Layers,
    headline: "Scalable Solutions",
    description: "Built to grow with your business, from first hire to enterprise.",
  },
  {
    icon: BadgeCheck,
    headline: "Secure & Reliable",
    description: "Enterprise-grade security and compliance, by design.",
  },
  {
    icon: TrendingUp,
    headline: "Measurable Growth",
    description: "Real insights that connect directly to pipeline performance.",
  },
];

export const companyStats = [
  { icon: Award, value: "10+", label: "Years of Excellence" },
  { icon: Briefcase, value: "250+", label: "Projects Delivered" },
  { icon: Percent, value: "98%", label: "Client Satisfaction" },
  { icon: Globe2, value: "25+", label: "Industries Served" },
  { icon: Building2, value: "Global", label: "Presence" },
];

export const logoCloud: LogoItem[] = [
  { name: "Northwind Traders" },
  { name: "Blueharbor Logistics" },
  { name: "Cedarline Health" },
  { name: "Ashford & Vale" },
  { name: "Fernbridge Realty" },
  { name: "Kestrel Manufacturing" },
  { name: "Solano Digital" },
  { name: "Meridian Analytics" },
];

export const problemSolution = {
  eyebrow: "Why teams switch",
  headline: "Your revenue stack shouldn't be five disconnected tools",
  problem: {
    label: "The status quo",
    body: "CRM data drifts out of sync with your marketing platform. Reps re-key the same lead into three systems. Reporting means exporting spreadsheets from four dashboards and reconciling them by hand.",
  },
  solution: {
    label: "With ZynReach",
    body: "One data model across CRM, marketing, and automation. AI assistants draft, score, and route work automatically. One dashboard shows the real, current state of your pipeline — because there's only one source of truth.",
  },
};

export const capabilityGrid: FeatureCardItem[] = [
  {
    icon: Bot,
    headline: "AI Assistants",
    description:
      "Native AI that drafts follow-ups, summarizes calls, and automates busywork inside every workflow.",
    href: "/platform/ai-assistants",
  },
  {
    icon: Users,
    headline: "CRM",
    description:
      "A CRM that updates itself — automated data entry with full pipeline visibility for every rep.",
    href: "/platform/crm",
  },
  {
    icon: Megaphone,
    headline: "Marketing Automation",
    description:
      "Campaigns, lead scoring, and nurture sequences that run themselves, without switching tools.",
    href: "/platform/marketing-automation",
  },
  {
    icon: Target,
    headline: "Lead Generation",
    description:
      "AI-assisted capture and qualification built directly into your CRM, not bolted on top.",
    href: "/platform/lead-generation",
  },
  {
    icon: Workflow,
    headline: "Workflow Automation",
    description:
      "No-code workflows that connect CRM, marketing, and support so nothing falls through the cracks.",
    href: "/platform/workflow-automation",
  },
  {
    icon: BarChart3,
    headline: "Analytics",
    description:
      "Real-time, unified reporting across CRM, marketing, and automation data — no manual reconciliation.",
    href: "/platform/analytics",
  },
];

export const aiModule = {
  eyebrow: "AI, by design",
  headline: "AI embedded in every workflow — not a chatbot bolted on top",
  points: [
    {
      headline: "Drafts, not just suggestions",
      description:
        "AI assistants write follow-up emails, call summaries, and proposal drafts inside the workflow reps already use.",
    },
    {
      headline: "Scores and routes automatically",
      description:
        "Leads are qualified and routed to the right rep the moment they arrive, based on real-time data, not static rules alone.",
    },
    {
      headline: "Learns your data, not the open internet",
      description:
        "Models are grounded in your CRM and marketing data, so recommendations reflect your pipeline, not generic best practices.",
    },
  ],
};

export const customerProof: TestimonialItem = {
  quote:
    "We replaced five tools with one platform and cut our lead response time from two days to under two hours.",
  authorName: "Representative customer quote",
  authorTitle: "VP Revenue Operations",
  company: "Illustrative example — real customer stories launch with the Customer Stories page",
  metric: { value: "62%", label: "faster lead response time" },
};

export const personaSelector: PersonaSelectorItem[] = [
  {
    id: "smb",
    label: "Startups & SMBs",
    headline: "Look bigger than your team, without the overhead",
    description:
      "Fast setup, transparent pricing, and templates instead of configuration — built for teams without a dedicated ops function.",
    metric: { value: "< 1 week", label: "typical time to first value" },
    href: "/solutions/smb",
  },
  {
    id: "sales",
    label: "Sales Teams",
    headline: "Give reps a CRM that updates itself",
    description:
      "AI-assisted data entry and full pipeline visibility mean reps spend time selling, not logging activity.",
    metric: { value: "5+ hrs", label: "saved per rep, per week" },
    href: "/solutions/sales",
  },
  {
    id: "marketing",
    label: "Marketing Teams",
    headline: "Campaign automation with attribution you can trust",
    description:
      "One data model connects email, forms, and analytics — so attribution reporting matches what actually happened.",
    metric: { value: "1", label: "unified source of attribution truth" },
    href: "/solutions/marketing",
  },
  {
    id: "enterprise",
    label: "Enterprise",
    headline: "Standardize revenue tooling, without the legacy overhead",
    description:
      "Enterprise-grade security and compliance with mid-market speed of deployment across regions and business units.",
    metric: { value: "SOC 2", label: "Type II, ISO 27001 aligned" },
    href: "/solutions/enterprise",
  },
];

export const integrationHighlight = {
  eyebrow: "Integrations",
  headline: "Connects to the tools your team already runs on",
  body: "ZynReach syncs natively with the email, calendar, billing, and support tools your team depends on — so adopting ZynReach doesn't mean ripping out what already works.",
  cta: { label: "View all integrations", href: "/integrations" },
  categories: [
    "Email & Calendar",
    "Billing & Payments",
    "Support & Helpdesk",
    "Analytics & BI",
    "Collaboration",
    "Developer & API",
  ],
};

export const trustStrip = {
  eyebrow: "Security & trust",
  headline: "Enterprise-grade security, by design",
  points: [
    { icon: ShieldCheck, label: "SOC 2 Type II" },
    { icon: FileCheck2, label: "ISO 27001 aligned" },
    { icon: Lock, label: "GDPR-ready data controls" },
  ],
  cta: { label: "Visit the Trust Center", href: "/security" },
};

export const finalCta = {
  headline: "See ZynReach on your own data",
  body: "Book a guided demo, or start a free trial and connect your first tool in minutes.",
  ctaPrimary: { label: "Book a Demo", href: "/demo" },
  ctaSecondary: { label: "Start Free Trial", href: "/trial" },
};
