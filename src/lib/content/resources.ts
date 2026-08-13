import type { Guide, Webinar } from "@/types/content";

export const guides: Guide[] = [
  { slug: "crm-migration-checklist", title: "CRM Migration Checklist", description: "A step-by-step checklist for migrating off spreadsheets or a legacy CRM without losing data.", format: "Template" },
  { slug: "lead-scoring-playbook", title: "Lead Scoring Playbook", description: "A practical framework for building a lead scoring model your sales team will actually trust.", format: "Guide" },
  { slug: "revops-maturity-whitepaper", title: "The RevOps Maturity Model", description: "A whitepaper on the four stages of revenue operations maturity, and how to know which one you're in.", format: "Whitepaper" },
  { slug: "onboarding-email-templates", title: "Onboarding Email Templates", description: "Five ready-to-use email templates for customer onboarding sequences.", format: "Template" },
];

export const webinars: Webinar[] = [
  { slug: "ai-assistants-deep-dive", title: "AI Assistants: A Deep Dive", description: "A walkthrough of how AI Assistants draft, summarize, and score inside your existing CRM workflow.", date: "2026-06-18", speaker: "ZynReach Product Team", gated: true },
  { slug: "scaling-revops-panel", title: "Scaling RevOps Without Adding Headcount", description: "A panel discussion on automation patterns that let lean RevOps teams support fast-growing sales orgs.", date: "2026-05-22", speaker: "ZynReach & Customer Panel", gated: true },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export function getWebinar(slug: string) {
  return webinars.find((webinar) => webinar.slug === slug);
}
