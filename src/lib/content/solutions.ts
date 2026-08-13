import type { SolutionPageContent } from "@/types/content";

/**
 * Solutions sub-page content (SRS Section 7.8). CTA per persona follows
 * SRS 7.8 exactly: Demo for Enterprise/Agencies, Trial for
 * Startups/SMBs/Sales/Marketing, with "Talk to sales" always present
 * as the secondary fallback.
 */
export const solutionPages: SolutionPageContent[] = [
  {
    slug: "sales",
    navLabel: "For Sales Teams",
    meta: {
      h1: "Give your sales team a CRM that updates itself",
      title: "ZynReach for Sales Teams",
      description: "AI-assisted data entry and full pipeline visibility so reps spend time selling, not logging activity.",
    },
    hero: {
      headline: "Give your sales team a CRM that updates itself",
      subhead:
        "Full pipeline visibility without the manual upkeep — activity logs itself, and AI flags what needs attention.",
    },
    primaryCta: { label: "Start Free Trial", href: "/trial" },
    before: {
      label: "Before ZynReach",
      body: "Reps spend hours a week logging calls and emails instead of selling. Pipeline data is stale by the time forecast meetings happen.",
    },
    after: {
      label: "With ZynReach",
      body: "Activity logs itself. AI drafts follow-ups and flags at-risk deals. Forecasts reflect real engagement, not guesswork.",
    },
    capabilityCallouts: [
      { label: "CRM", href: "/platform/crm", description: "A CRM that updates itself as reps work." },
      { label: "AI Assistants", href: "/platform/ai-assistants", description: "AI drafts follow-ups and flags risk." },
      { label: "Analytics", href: "/platform/analytics", description: "Real-time pipeline and forecast visibility." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Email & Calendar", "Collaboration", "Analytics & BI"],
  },
  {
    slug: "marketing",
    navLabel: "For Marketing Teams",
    meta: {
      h1: "Campaign automation with attribution you can trust",
      title: "ZynReach for Marketing Teams",
      description: "Marketing Automation and Analytics feature proof, with an integration list built for demand gen.",
    },
    hero: {
      headline: "Campaign automation with attribution you can trust",
      subhead: "One data model connects email, forms, and analytics — so attribution reporting matches what actually happened.",
    },
    primaryCta: { label: "Start Free Trial", href: "/trial" },
    before: {
      label: "Before ZynReach",
      body: "Your email tool, ad platform, and CRM don't talk to each other. Attribution means reconciling exports by hand every month.",
    },
    after: {
      label: "With ZynReach",
      body: "One data model connects campaigns to pipeline. Lead scoring and attribution reflect what actually happened.",
    },
    capabilityCallouts: [
      { label: "Marketing Automation", href: "/platform/marketing-automation", description: "Campaigns and nurture that run themselves." },
      { label: "Lead Generation", href: "/platform/lead-generation", description: "AI qualification built into your CRM." },
      { label: "Analytics", href: "/platform/analytics", description: "Attribution across every channel, in one place." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Email & Calendar", "Analytics & BI", "Developer & API"],
  },
  {
    slug: "agencies",
    navLabel: "For Agencies",
    meta: {
      h1: "Manage every client account from one dashboard",
      title: "ZynReach for Agencies",
      description: "Multi-workspace support and partner terms built for agencies managing multiple client accounts.",
    },
    hero: {
      headline: "Manage every client account from one dashboard",
      subhead: "One workspace per client, white-label reporting, and margin protection built in from day one.",
    },
    primaryCta: { label: "Book a Demo", href: "/demo" },
    before: {
      label: "Before ZynReach",
      body: "Per-client tool costs stack up fast, and client reporting means exporting from five different platforms every month.",
    },
    after: {
      label: "With ZynReach",
      body: "One workspace per client, white-label reporting, and a single bill — reporting overhead drops to near zero.",
    },
    capabilityCallouts: [
      { label: "CRM", href: "/platform/crm", description: "Separate pipelines per client, one login." },
      { label: "Marketing Automation", href: "/platform/marketing-automation", description: "Run client campaigns from one place." },
      { label: "Analytics", href: "/platform/analytics", description: "White-label reporting your clients can see." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Billing & Payments", "Collaboration", "Analytics & BI"],
  },
  {
    slug: "smb",
    navLabel: "For Startups & SMBs",
    meta: {
      h1: "Look bigger than your team, without the overhead",
      title: "ZynReach for Startups & SMBs",
      description: "Fast setup, transparent pricing, and templates instead of configuration.",
    },
    hero: {
      headline: "Look bigger than your team, without the overhead",
      subhead: "Fast setup, transparent pricing, and templates instead of configuration — built for teams without a dedicated ops function.",
    },
    primaryCta: { label: "Start Free Trial", href: "/trial" },
    before: {
      label: "Before ZynReach",
      body: "No dedicated ops or IT staff. Manual admin between five disconnected tools eats hours you don't have.",
    },
    after: {
      label: "With ZynReach",
      body: "One platform, guided onboarding measured in days, and templates that replace configuration.",
    },
    capabilityCallouts: [
      { label: "CRM", href: "/platform/crm", description: "Set up in minutes, not weeks." },
      { label: "Marketing Automation", href: "/platform/marketing-automation", description: "Templates instead of a blank canvas." },
      { label: "Workflow Automation", href: "/platform/workflow-automation", description: "No-code automation, no engineer required." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Email & Calendar", "Billing & Payments", "Support & Helpdesk"],
  },
  {
    slug: "enterprise",
    navLabel: "For Enterprise",
    meta: {
      h1: "Standardize revenue tooling without the legacy overhead",
      title: "ZynReach for Enterprise",
      description: "Enterprise-grade security and compliance with mid-market speed of deployment.",
    },
    hero: {
      headline: "Standardize revenue tooling without the legacy overhead",
      subhead: "Enterprise-grade security and compliance, deployed with mid-market speed across regions and business units.",
    },
    primaryCta: { label: "Book a Demo", href: "/demo" },
    before: {
      label: "Before ZynReach",
      body: "Procurement complexity, integration with legacy systems, and internal stakeholder buy-in slow every rollout.",
    },
    after: {
      label: "With ZynReach",
      body: "Enterprise-grade security and compliance, deployed with mid-market speed — see the full case on our Enterprise page.",
    },
    capabilityCallouts: [
      { label: "CRM", href: "/platform/crm", description: "One system of record across regions." },
      { label: "Workflow Automation", href: "/platform/workflow-automation", description: "Approval flows and audit trails built in." },
      { label: "Analytics", href: "/platform/analytics", description: "Executive-level reporting across business units." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Developer & API", "Analytics & BI", "Collaboration"],
  },
];

export function getSolutionPage(slug: string) {
  return solutionPages.find((page) => page.slug === slug);
}
