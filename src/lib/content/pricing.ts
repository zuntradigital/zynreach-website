import type { PricingPlan, ComparisonRow, FaqItem } from "@/types/content";

/**
 * Pricing content (Pricing spec v2.0). This is the offline fallback only —
 * the live source of truth is ZynReach Admin's Pricing Management module
 * (see src/lib/services/pricing-content.ts); this array renders only when
 * that service is unreachable. Currency is EGP throughout; monthlyPrice/
 * annualPrice/includedUsers/additionalUserPrice/trialPeriodDays here mirror
 * the admin-configurable defaults so an outage degrades to the same figures
 * Admin currently has configured, not stale USD placeholders.
 */
export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams getting started with ZynReach.",
    monthlyPrice: 1990,
    annualPrice: 1592,
    currency: "EGP",
    priceSuffix: "/ month",
    includedUsers: 3,
    additionalUserPrice: 500,
    trialPeriodDays: 14,
    featureList: [
      "CRM & Contact 360",
      "Lead Generation",
      "Sales Pipeline",
      "Tasks & Activities",
      "Basic Automation",
      "Basic AI Assistants",
      "Basic Reports",
      "Email & Calendar Sync",
      "Standard Support",
    ],
    ctaLabel: "Start 14-Day Free Trial",
    ctaHref: "/trial",
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing teams that need advanced automation and AI.",
    monthlyPrice: 3990,
    annualPrice: 3192,
    currency: "EGP",
    priceSuffix: "/ month",
    includedUsers: 10,
    additionalUserPrice: 400,
    trialPeriodDays: 7,
    recommended: true,
    featureList: [
      "Everything in Starter",
      "Marketing Automation",
      "Campaigns",
      "AI Lead Scoring",
      "AI Deal Scoring",
      "Advanced Automation",
      "Advanced Analytics & Dashboards",
      "Team Collaboration",
      "Advanced Permissions",
      "Email Automation",
      "Priority Support",
    ],
    ctaLabel: "Start 7-Day Free Trial",
    ctaHref: "/trial",
    isFeatured: true,
  },
  {
    id: "business",
    name: "Business",
    description: "For growing and multi-team organizations.",
    monthlyPrice: 7990,
    annualPrice: 6392,
    currency: "EGP",
    priceSuffix: "/ month",
    includedUsers: 25,
    additionalUserPrice: 350,
    trialPeriodDays: 7,
    featureList: [
      "Everything in Professional",
      "Business Data",
      "AI Agents",
      "Advanced Workflow Automation",
      "Multi-Team & Department Management",
      "Advanced Roles & Permissions",
      "Executive Dashboards",
      "API Access & Webhooks",
      "Advanced Integrations",
      "Advanced Audit Logs & Data Export",
      "Advanced Security",
      "Dedicated Onboarding",
    ],
    ctaLabel: "Start 7-Day Free Trial",
    ctaHref: "/trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Built for organizations that require enterprise-grade capabilities.",
    monthlyPrice: null,
    annualPrice: null,
    currency: "EGP",
    priceSuffix: "Custom Pricing",
    includedUsers: null,
    additionalUserPrice: null,
    trialPeriodDays: null,
    featureList: [
      "Custom users & workspaces",
      "Enterprise Security",
      "SSO & SAML",
      "Custom API & Integrations",
      "Custom AI & Workflows",
      "Advanced Governance",
      "SLA",
      "Dedicated Customer Success & Support",
      "Migration & Enterprise Onboarding",
    ],
    ctaLabel: "Talk to Sales",
    ctaHref: "/enterprise",
  },
];

export const comparisonMatrix: ComparisonRow[] = [
  { category: "CRM", feature: "CRM & Contact 360", values: [true, true, true, true] },
  { category: "CRM", feature: "AI deal scoring", values: [false, true, true, true] },
  { category: "Marketing", feature: "Marketing Automation & Campaigns", values: [false, true, true, true] },
  { category: "Marketing", feature: "AI lead scoring", values: [false, true, true, true] },
  { category: "Data", feature: "Business Data", values: [false, false, true, true] },
  { category: "AI", feature: "AI Assistants", values: ["Basic", "Advanced", "Advanced", "Custom"] },
  { category: "AI", feature: "AI Agents", values: [false, false, true, true] },
  { category: "Automation", feature: "Workflow automation", values: ["Basic", "Advanced", "Advanced", "Custom"] },
  { category: "Security", feature: "Advanced roles & permissions", values: [false, false, true, true] },
  { category: "Security", feature: "SSO / SAML", values: [false, false, false, true] },
  { category: "Platform", feature: "API access & webhooks", values: [false, false, true, true] },
  { category: "Platform", feature: "Advanced audit logs", values: [false, false, true, true] },
  { category: "Support", feature: "Support level", values: ["Standard", "Priority", "Dedicated Onboarding", "Dedicated Support & SLA"] },
];

export const pricingFaqs: FaqItem[] = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes — you can upgrade at any time from Upgrade & Subscribe in your account. Downgrades are supported, and if your current usage exceeds the target plan's limits, you'll see exactly what needs to change first.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. Starter includes a 14-day free trial, and Professional and Business each include a 7-day free trial — no automatic charge when the trial ends. Enterprise starts with a guided demo instead of a fixed trial.",
  },
  {
    question: "How does annual billing work?",
    answer:
      "Annual billing is invoiced once per year at a 20% discount off the monthly rate, shown when you toggle 'Annual' above.",
  },
  {
    question: "What happens if my team grows past the included users?",
    answer:
      "Each plan includes a set number of users (Starter: 3, Professional: 10, Business: 25). Beyond that, additional users are billed at your plan's per-user rate, shown in your account and configurable by ZynReach's team for your agreement.",
  },
  {
    question: "What currency are prices shown in?",
    answer: "All ZynReach plans are priced in Egyptian Pounds (EGP).",
  },
];
