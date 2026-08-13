import type { CapabilityPageContent } from "@/types/content";

/**
 * Content for the 6 capability pages (SRS Section 7.3 shared template).
 * H1 / meta title / meta description sourced from SRS Section 26 Content
 * Inventory; feature blocks, how-it-works, and comparison copy expand on
 * the SRS page-purpose statements using the same brand voice as Home.
 */
export const capabilityPages: CapabilityPageContent[] = [
  {
    slug: "ai-assistants",
    navLabel: "AI Assistants",
    meta: {
      h1: "AI that works inside every workflow",
      title: "ZynReach AI Assistants",
      description:
        "Native AI assistants that draft, summarize, and automate across the platform.",
    },
    hero: {
      headline: "AI that works inside every workflow",
      subhead:
        "Not a chatbot bolted onto the side — AI assistants embedded directly in CRM, marketing, and workflow automation, grounded in your data.",
    },
    whoItsFor: [
      { label: "Sales Teams", href: "/solutions/sales" },
      { label: "Marketing Teams", href: "/solutions/marketing" },
      { label: "Enterprise", href: "/solutions/enterprise" },
    ],
    featureBlocks: [
      {
        headline: "Drafts follow-ups and proposals",
        description:
          "AI writes the first draft of every follow-up email, call summary, or proposal — grounded in the actual deal context, not a generic template.",
        proof: { stat: "5+ hrs", label: "saved per rep, per week" },
      },
      {
        headline: "Summarizes calls automatically",
        description:
          "Call and meeting notes are captured, summarized, and logged to the right record without a rep touching a keyboard.",
        proof: { stat: "100%", label: "of calls logged, automatically" },
      },
      {
        headline: "Flags at-risk deals early",
        description:
          "AI monitors deal signals — response time, engagement, sentiment — and surfaces at-risk deals before they stall.",
        proof: { stat: "2x", label: "earlier risk detection vs. manual review" },
      },
      {
        headline: "Automates repetitive data entry",
        description:
          "Contact and deal fields update automatically from email, calendar, and call activity, so CRM data stays accurate without manual upkeep.",
        proof: { stat: "0", label: "manual re-keying required" },
      },
    ],
    howItWorks: [
      {
        headline: "Connect your data",
        description: "Link email, calendar, and CRM records — AI reads context from what's already there.",
      },
      {
        headline: "AI learns your workflows",
        description: "Assistants adapt to how your team actually works, not a fixed script.",
      },
      {
        headline: "AI drafts and suggests",
        description: "Follow-ups, summaries, and next steps appear ready for review inside the workflow.",
      },
      {
        headline: "You approve and send",
        description: "Every AI action stays human-reviewed by default — nothing sends without a rep's approval.",
      },
    ],
    comparison: {
      title: "AI Assistants vs. manual admin work",
      statusQuo:
        "Reps spend hours a week writing follow-ups, logging notes, and re-keying data between calls.",
      withZynReach:
        "AI drafts the follow-up, logs the notes, and updates the record automatically — reps review and send.",
    },
    relatedIntegrations: ["Email & Calendar", "CRM Data", "Call Recording", "Collaboration"],
    seoKeywordCluster: "AI CRM assistant, AI sales assistant software",
  },
  {
    slug: "crm",
    navLabel: "CRM",
    meta: {
      h1: "AI-powered CRM that updates itself",
      title: "ZynReach CRM Software",
      description:
        "An AI CRM that automates data entry and gives sales full pipeline visibility.",
    },
    hero: {
      headline: "A CRM that updates itself",
      subhead:
        "Full pipeline visibility without the manual upkeep — activity, notes, and deal stages update automatically as reps work.",
    },
    whoItsFor: [
      { label: "Sales Teams", href: "/solutions/sales" },
      { label: "Startups & SMBs", href: "/solutions/smb" },
      { label: "Enterprise", href: "/solutions/enterprise" },
    ],
    featureBlocks: [
      {
        headline: "Automated activity logging",
        description:
          "Emails, calls, and meetings log to the right record automatically — no rep has to remember to update the CRM.",
        proof: { stat: "100%", label: "activity capture rate" },
      },
      {
        headline: "Full pipeline visibility",
        description:
          "One live view of every deal's stage, owner, and next step — no exporting spreadsheets to see what's real.",
        proof: { stat: "1", label: "source of pipeline truth" },
      },
      {
        headline: "AI deal scoring",
        description:
          "Deals are scored on engagement and momentum, so reps know where to focus without guessing.",
        proof: { stat: "62%", label: "faster lead response time" },
      },
      {
        headline: "Contact enrichment",
        description:
          "New contacts are enriched automatically with firmographic data as they enter the CRM.",
        proof: { stat: "0 clicks", label: "to enrich a new contact" },
      },
    ],
    howItWorks: [
      { headline: "Connect email & calendar", description: "ZynReach syncs activity in the background from day one." },
      { headline: "CRM auto-logs activity", description: "Calls, emails, and meetings attach to the right deal automatically." },
      { headline: "AI scores and prioritizes", description: "Deals are ranked by real engagement signals, not gut feel." },
      { headline: "Reports update live", description: "Pipeline and forecast views reflect the current state, always." },
    ],
    comparison: {
      title: "CRM vs. spreadsheets",
      statusQuo: "Deals tracked across spreadsheets and inboxes, updated inconsistently by different reps.",
      withZynReach: "One CRM record per deal, updated automatically as reps actually work it.",
    },
    relatedIntegrations: ["Email & Calendar", "Billing & Payments", "Analytics & BI", "Developer & API"],
    seoKeywordCluster: "AI CRM software, CRM for small business",
  },
  {
    slug: "marketing-automation",
    navLabel: "Marketing Automation",
    meta: {
      h1: "Campaigns that run themselves",
      title: "ZynReach Marketing Automation",
      description:
        "Automate campaigns, scoring, and nurture sequences without switching tools.",
    },
    hero: {
      headline: "Campaigns that run themselves",
      subhead:
        "Build a nurture sequence once — automation handles scoring, sending, and hand-off to sales from a single data model.",
    },
    whoItsFor: [
      { label: "Marketing Teams", href: "/solutions/marketing" },
      { label: "Agencies", href: "/solutions/agencies" },
      { label: "Startups & SMBs", href: "/solutions/smb" },
    ],
    featureBlocks: [
      {
        headline: "Automated nurture sequences",
        description:
          "Multi-step email and lifecycle campaigns trigger automatically off real behavior, not a fixed send schedule.",
        proof: { stat: "24/7", label: "always-on nurture" },
      },
      {
        headline: "AI lead scoring",
        description:
          "Leads are scored on engagement across email, site, and CRM activity — the same data sales sees.",
        proof: { stat: "1", label: "shared scoring model, no drift" },
      },
      {
        headline: "Multichannel campaigns",
        description: "Email, in-app, and landing page campaigns share one audience and attribution model.",
        proof: { stat: "3", label: "channels, one dashboard" },
      },
      {
        headline: "Sales hand-off automation",
        description: "Marketing-qualified leads route straight to the right rep — no manual export to CRM.",
        proof: { stat: "0", label: "manual lead hand-offs" },
      },
    ],
    howItWorks: [
      { headline: "Build the campaign", description: "Assemble a nurture sequence from reusable content blocks." },
      { headline: "Set triggers and scoring", description: "Define what behavior moves a lead forward." },
      { headline: "Automation runs the sequence", description: "Sends, scoring, and routing happen without manual work." },
      { headline: "Review performance in one place", description: "Attribution and engagement data live in a single dashboard." },
    ],
    comparison: {
      title: "Marketing automation vs. manual campaigns",
      statusQuo: "Campaign performance tracked across email tool, ad platform, and spreadsheet exports.",
      withZynReach: "Attribution and engagement data live in one dashboard, matching what actually happened.",
    },
    relatedIntegrations: ["Email & Calendar", "Analytics & BI", "Collaboration", "Developer & API"],
    seoKeywordCluster: "marketing automation software, AI lead scoring",
  },
  {
    slug: "lead-generation",
    navLabel: "Lead Generation",
    meta: {
      h1: "Turn traffic into qualified pipeline",
      title: "ZynReach Lead Generation",
      description:
        "AI-assisted lead capture and qualification, built into your CRM.",
    },
    hero: {
      headline: "Turn traffic into qualified pipeline",
      subhead:
        "Capture, qualify, and route leads the moment they arrive — qualification logic lives in the same system as the pipeline it feeds.",
    },
    whoItsFor: [
      { label: "Sales Teams", href: "/solutions/sales" },
      { label: "Marketing Teams", href: "/solutions/marketing" },
      { label: "Agencies", href: "/solutions/agencies" },
    ],
    featureBlocks: [
      {
        headline: "Smart capture forms",
        description: "Forms adapt field requirements by traffic source and progressively profile returning visitors.",
        proof: { stat: "↓", label: "fewer form fields, more completions" },
      },
      {
        headline: "AI qualification",
        description: "Leads are qualified against your ideal customer profile the moment they submit a form.",
        proof: { stat: "< 1 min", label: "from submission to qualification" },
      },
      {
        headline: "Instant routing",
        description: "Qualified leads route to the right rep by territory, size, or product interest — no queue.",
        proof: { stat: "62%", label: "faster lead response time" },
      },
      {
        headline: "Contact enrichment",
        description: "Leads are enriched with firmographic data automatically, so reps aren't researching from scratch.",
        proof: { stat: "0", label: "manual lookups needed" },
      },
    ],
    howItWorks: [
      { headline: "Capture the lead", description: "Forms and chat capture intent across every page." },
      { headline: "AI qualifies instantly", description: "Fit and intent are scored against your ICP in real time." },
      { headline: "Lead routes automatically", description: "The right rep is notified before the lead goes cold." },
      { headline: "Follow-up starts immediately", description: "Automation triggers the first response while intent is highest." },
    ],
    comparison: {
      title: "AI lead qualification vs. manual triage",
      statusQuo: "Leads sit in a shared inbox until someone manually reviews and assigns them.",
      withZynReach: "Leads are qualified and routed within a minute of submission, automatically.",
    },
    relatedIntegrations: ["Email & Calendar", "Support & Helpdesk", "Analytics & BI", "Collaboration"],
    seoKeywordCluster: "AI lead generation software, lead qualification automation",
  },
  {
    slug: "workflow-automation",
    navLabel: "Workflow Automation",
    meta: {
      h1: "Automate the busywork between every team",
      title: "ZynReach Workflow Automation",
      description:
        "Build no-code workflows that connect CRM, marketing, and support.",
    },
    hero: {
      headline: "Automate the busywork between every team",
      subhead:
        "No-code workflows connect CRM, marketing, and support so hand-offs happen automatically instead of falling through the cracks.",
    },
    whoItsFor: [
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Agencies", href: "/solutions/agencies" },
      { label: "Sales Teams", href: "/solutions/sales" },
    ],
    featureBlocks: [
      {
        headline: "No-code workflow builder",
        description: "Build multi-step automations across CRM, marketing, and support with a visual builder — no engineering ticket required.",
        proof: { stat: "0", label: "code required" },
      },
      {
        headline: "Cross-team triggers",
        description: "A support ticket can trigger a CRM update; a closed deal can trigger an onboarding sequence.",
        proof: { stat: "3+", label: "systems, one workflow" },
      },
      {
        headline: "Approval flows",
        description: "Add human approval steps to any automation for discount approvals, contract review, or escalations.",
        proof: { stat: "100%", label: "auditable approval trail" },
      },
      {
        headline: "Error handling & alerts",
        description: "Failed steps notify the right owner automatically instead of silently dropping work.",
        proof: { stat: "0", label: "silent failures" },
      },
    ],
    howItWorks: [
      { headline: "Pick a trigger", description: "Start from a CRM, marketing, or support event." },
      { headline: "Add automated steps", description: "Chain updates, notifications, and hand-offs visually." },
      { headline: "Insert approvals where needed", description: "Keep a human in the loop for high-stakes steps." },
      { headline: "Monitor and refine", description: "See every run, catch failures, and adjust the workflow over time." },
    ],
    comparison: {
      title: "No-code workflows vs. manual hand-offs",
      statusQuo: "Hand-offs between sales, marketing, and support rely on someone remembering to notify the next team.",
      withZynReach: "Hand-offs trigger automatically the moment the underlying event happens.",
    },
    relatedIntegrations: ["Support & Helpdesk", "Billing & Payments", "Collaboration", "Developer & API"],
    seoKeywordCluster: "no-code workflow automation, CRM workflow builder",
  },
  {
    slug: "analytics",
    navLabel: "Analytics",
    meta: {
      h1: "See revenue performance in real time",
      title: "ZynReach Analytics",
      description:
        "Unified reporting across CRM, marketing, and automation data.",
    },
    hero: {
      headline: "See revenue performance in real time",
      subhead:
        "One reporting layer across CRM, marketing, and automation data — no manual reconciliation between four dashboards.",
    },
    whoItsFor: [
      { label: "Marketing Teams", href: "/solutions/marketing" },
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Sales Teams", href: "/solutions/sales" },
    ],
    featureBlocks: [
      {
        headline: "Unified reporting",
        description: "Pipeline, campaign, and automation data live in one model, so reports don't need reconciling by hand.",
        proof: { stat: "1", label: "unified source of attribution truth" },
      },
      {
        headline: "Custom dashboards",
        description: "Build role-specific dashboards for reps, managers, and executives from the same underlying data.",
        proof: { stat: "0", label: "spreadsheet exports needed" },
      },
      {
        headline: "Forecasting",
        description: "AI-assisted forecasts factor in deal engagement signals, not just stage and close date.",
        proof: { stat: "real-time", label: "forecast updates" },
      },
      {
        headline: "Attribution you can trust",
        description: "Multi-touch attribution reflects the actual customer journey across marketing and sales touches.",
        proof: { stat: "1", label: "attribution model, sitewide" },
      },
    ],
    howItWorks: [
      { headline: "Data flows in automatically", description: "CRM, marketing, and automation activity feed one model." },
      { headline: "Build your dashboard", description: "Choose the metrics that matter for your role." },
      { headline: "Track in real time", description: "Numbers update as activity happens — no nightly batch job." },
      { headline: "Share and act", description: "Export, share, or trigger a workflow directly off a report." },
    ],
    comparison: {
      title: "Unified analytics vs. spreadsheet reporting",
      statusQuo: "Reporting means exporting spreadsheets from four dashboards and reconciling them by hand.",
      withZynReach: "One dashboard shows the real, current state of pipeline and campaign performance.",
    },
    relatedIntegrations: ["Analytics & BI", "Billing & Payments", "Developer & API", "Collaboration"],
    seoKeywordCluster: "revenue analytics software, unified CRM marketing reporting",
  },
];

export function getCapabilityPage(slug: string) {
  return capabilityPages.find((page) => page.slug === slug);
}
