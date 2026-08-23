import type { FaqItem } from "@/types/content";

export const faqCategories = ["Product", "Pricing", "Security", "Support"] as const;

export const faqByCategory: Record<(typeof faqCategories)[number], FaqItem[]> = {
  Product: [
    { question: "What's included in the free trial?", answer: "The free trial includes full access to Starter-plan features for 14 days, no credit card required." },
    { question: "Can I import data from my current CRM?", answer: "Yes — CSV import is available on every plan, and guided migration assistance is included with Enterprise." },
    { question: "Does ZynReach work on mobile?", answer: "Yes, the ZynReach application is fully responsive and works in any modern mobile browser." },
  ],
  Pricing: [
    { question: "Can I switch plans later?", answer: "Yes — you can upgrade or downgrade at any time from account settings." },
    { question: "Is there a discount for annual billing?", answer: "Yes, annual billing saves approximately 20% compared to monthly billing." },
    { question: "Do you offer nonprofit or startup discounts?", answer: "Yes — contact sales with proof of eligibility and we'll apply the appropriate discount." },
  ],
  Security: [
    { question: "Is ZynReach SOC 2 certified?", answer: "Yes, ZynReach maintains SOC 2 Type II certification. See our Security page for details." },
    { question: "Where is my data hosted?", answer: "Customer data is hosted in United States-based data centers by default; region-specific residency is available on Enterprise." },
    { question: "Do you support SSO?", answer: "ZynReach uses email and password authentication with two-factor authentication (TOTP) required for administrator and Enterprise accounts, plus role-based and attribute-based access controls — see our Security page for details." },
  ],
  Support: [
    { question: "What support is included on each plan?", answer: "Starter includes community support, Growth includes priority support, and Enterprise includes a dedicated CSM." },
    { question: "What are your support hours?", answer: "Priority and Enterprise support is available Monday–Friday, 6am–8pm ET, with 24/7 coverage for critical incidents." },
  ],
};
