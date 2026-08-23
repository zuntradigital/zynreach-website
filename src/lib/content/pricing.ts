import type { PricingPlan, ComparisonRow, FaqItem } from "@/types/content";

/**
 * Pricing content (SRS Section 7.4). Prices are illustrative placeholders —
 * final figures are Product Marketing's call and belong in the CMS pricing
 * table once real go-to-market pricing is finalized.
 */
export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams getting off spreadsheets.",
    monthlyPrice: 29,
    annualPrice: 24,
    priceSuffix: "/ user / month",
    featureList: [
      "CRM with automated activity logging",
      "Up to 3 marketing automation workflows",
      "Email & calendar sync",
      "Standard integrations",
      "Community support",
    ],
    ctaLabel: "Start Free Trial",
    ctaHref: "/trial",
  },
  {
    id: "growth",
    name: "Growth",
    description: "For teams ready to unify sales and marketing.",
    monthlyPrice: 79,
    annualPrice: 64,
    priceSuffix: "/ user / month",
    featureList: [
      "Everything in Starter",
      "Unlimited automation workflows",
      "AI Assistants (drafts, summaries, scoring)",
      "Lead routing & qualification",
      "Advanced analytics dashboards",
      "Priority support",
    ],
    ctaLabel: "Start Free Trial",
    ctaHref: "/trial",
    isFeatured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For organizations that need scale, security, and SLAs.",
    monthlyPrice: null,
    annualPrice: null,
    priceSuffix: "custom quote",
    featureList: [
      "Everything in Growth",
      "Two-factor authentication (TOTP) & advanced access controls",
      "Audit logs & data residency controls",
      "Dedicated CSM & onboarding",
      "Custom SLA",
    ],
    ctaLabel: "Talk to Sales",
    ctaHref: "/enterprise",
  },
];

export const comparisonMatrix: ComparisonRow[] = [
  { category: "CRM", feature: "Automated activity logging", values: [true, true, true] },
  { category: "CRM", feature: "AI deal scoring", values: [false, true, true] },
  { category: "CRM", feature: "Custom pipeline stages", values: ["1", "Unlimited", "Unlimited"] },
  { category: "Marketing", feature: "Automation workflows", values: ["3", "Unlimited", "Unlimited"] },
  { category: "Marketing", feature: "AI lead scoring", values: [false, true, true] },
  { category: "AI", feature: "AI Assistants", values: [false, true, true] },
  { category: "AI", feature: "Custom AI grounding", values: [false, false, true] },
  { category: "Security", feature: "Advanced access controls (RBAC/ABAC)", values: [false, false, true] },
  { category: "Security", feature: "Audit logs", values: [false, false, true] },
  { category: "Support", feature: "Support level", values: ["Community", "Priority", "Dedicated CSM"] },
];

export const pricingFaqs: FaqItem[] = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes — you can upgrade or downgrade at any time. Upgrades apply immediately; downgrades apply at the start of your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, Starter and Growth both include a free trial with no credit card required. Enterprise plans start with a guided demo instead.",
  },
  {
    question: "How does annual billing work?",
    answer:
      "Annual billing is invoiced once per year at the discounted per-user rate shown when you toggle 'Annual' above.",
  },
  {
    question: "What happens if I go over my seat count?",
    answer:
      "You can add seats at any time from your account settings; new seats are prorated for the remainder of the billing period.",
  },
  {
    question: "Do you offer nonprofit or startup discounts?",
    answer:
      "Yes — contact sales with proof of eligibility and we'll apply the appropriate discount to your quote.",
  },
];
