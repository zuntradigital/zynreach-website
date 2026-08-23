import type { Guide, Webinar } from "@/types/content";

/**
 * Knowledge Center §7 Guides & Templates content catalog — four distinct
 * content types (Guide/Template/Checklist/Playbook), each with the exact
 * titles the spec names. Roughly half are gated (the longer-form Guides
 * and Playbooks) and half are open access (Templates/Checklists), per
 * §7's "do not make all content gated."
 */
export const guides: Guide[] = [
  // Guides
  { slug: "crm-implementation-guide", title: "CRM Implementation Guide", description: "A practical walkthrough for rolling out a new CRM without disrupting the deals already in flight.", format: "Guide", category: "CRM", targetAudience: "Sales Teams", difficultyLevel: "Beginner", gated: true },
  { slug: "sales-process-guide", title: "Sales Process Guide", description: "How to document a repeatable sales process your whole team can actually follow.", format: "Guide", category: "Sales", targetAudience: "Sales Teams", difficultyLevel: "Intermediate", gated: true },
  { slug: "lead-management-guide", title: "Lead Management Guide", description: "A guide to routing, qualifying, and following up on leads before they go cold.", format: "Guide", category: "Sales", targetAudience: "Sales Teams", difficultyLevel: "Beginner", gated: true },
  { slug: "marketing-automation-guide", title: "Marketing Automation Guide", description: "What to automate first in marketing, and what still needs a human touch.", format: "Guide", category: "Marketing", targetAudience: "Marketing Teams", difficultyLevel: "Intermediate", gated: true },
  { slug: "customer-retention-guide", title: "Customer Retention Guide", description: "Practical tactics for spotting at-risk accounts before they churn.", format: "Guide", category: "Customer Success", targetAudience: "Customer Success Teams", difficultyLevel: "Intermediate", gated: true },
  { slug: "team-productivity-guide", title: "Team Productivity Guide", description: "How growing teams cut down on status meetings and manual busywork.", format: "Guide", category: "Operations", targetAudience: "Operations Teams", difficultyLevel: "Beginner", gated: false },
  { slug: "ai-adoption-guide", title: "AI Adoption Guide", description: "A pragmatic starting point for introducing AI into day-to-day revenue operations.", format: "Guide", category: "AI & Automation", targetAudience: "Management & Executives", difficultyLevel: "Beginner", gated: true },

  // Templates
  { slug: "sales-pipeline-template", title: "Sales Pipeline Template", description: "A ready-to-use pipeline structure with stages, exit criteria, and probability weighting.", format: "Template", category: "Sales", targetAudience: "Sales Teams", gated: false },
  { slug: "lead-qualification-template", title: "Lead Qualification Template", description: "A scorecard for qualifying inbound leads consistently across reps.", format: "Template", category: "Sales", targetAudience: "Sales Teams", gated: false },
  { slug: "customer-onboarding-template", title: "Customer Onboarding Template", description: "A milestone-based onboarding plan you can customize per customer.", format: "Template", category: "Customer Success", targetAudience: "Customer Success Teams", gated: false },
  { slug: "marketing-campaign-template", title: "Marketing Campaign Template", description: "A campaign brief template covering audience, channels, timeline, and success metrics.", format: "Template", category: "Marketing", targetAudience: "Marketing Teams", gated: false },
  { slug: "follow-up-template", title: "Follow-up Template", description: "A set of follow-up message templates for the moments deals typically go quiet.", format: "Template", category: "Sales", targetAudience: "Sales Teams", gated: false },
  { slug: "project-management-template", title: "Project Management Template", description: "A lightweight project tracker for teams that don't need a heavyweight PM tool.", format: "Template", category: "Operations", targetAudience: "Operations Teams", gated: false },
  { slug: "kpi-template", title: "KPI Template", description: "A starting set of KPIs for revenue, operations, and customer teams, with target-setting guidance.", format: "Template", category: "Analytics", targetAudience: "Management & Executives", gated: true },
  { slug: "sop-template", title: "SOP Template", description: "A standard operating procedure template for documenting repeatable processes.", format: "Template", category: "Operations", targetAudience: "Operations Teams", gated: false },

  // Checklists
  { slug: "crm-setup-checklist", title: "CRM Setup Checklist", description: "Everything to configure before your team's first day on a new CRM.", format: "Checklist", category: "CRM", targetAudience: "Sales Teams", gated: false },
  { slug: "sales-team-setup-checklist", title: "Sales Team Setup Checklist", description: "A checklist for standing up territories, quotas, and tooling for a new sales team.", format: "Checklist", category: "Sales", targetAudience: "Sales Teams", gated: false },
  { slug: "customer-onboarding-checklist", title: "Customer Onboarding Checklist", description: "The steps to confirm before marking a new customer as fully onboarded.", format: "Checklist", category: "Customer Success", targetAudience: "Customer Success Teams", gated: false },
  { slug: "digital-transformation-checklist", title: "Digital Transformation Checklist", description: "A checklist for sequencing a digital transformation initiative without stalling day-to-day operations.", format: "Checklist", category: "Operations", targetAudience: "Management & Executives", gated: false },

  // Playbooks
  { slug: "sales-playbook", title: "Sales Playbook", description: "A playbook covering prospecting, discovery, and closing plays for a growing sales team.", format: "Playbook", category: "Sales", targetAudience: "Sales Teams", difficultyLevel: "Intermediate", gated: true },
  { slug: "marketing-playbook", title: "Marketing Playbook", description: "Repeatable marketing plays for demand generation and lifecycle campaigns.", format: "Playbook", category: "Marketing", targetAudience: "Marketing Teams", difficultyLevel: "Intermediate", gated: true },
  { slug: "customer-success-playbook", title: "Customer Success Playbook", description: "Playbooks for onboarding, renewal, and save conversations.", format: "Playbook", category: "Customer Success", targetAudience: "Customer Success Teams", difficultyLevel: "Intermediate", gated: true },
  { slug: "lead-conversion-playbook", title: "Lead Conversion Playbook", description: "A step-by-step playbook for converting marketing-qualified leads into closed deals.", format: "Playbook", category: "Sales", targetAudience: "Sales Teams", difficultyLevel: "Intermediate", gated: true },
];

export const webinars: Webinar[] = [
  { slug: "ai-assistants-deep-dive", title: "AI Assistants: A Deep Dive", description: "A walkthrough of how AI Assistants draft, summarize, and score inside your existing CRM workflow.", date: "2026-06-18", speaker: "ZynReach Product Team", gated: true, featured: true, isOnDemand: true, category: "AI & Automation" },
  { slug: "scaling-revops-panel", title: "Scaling RevOps Without Adding Headcount", description: "A panel discussion on automation patterns that let lean RevOps teams support fast-growing sales orgs.", date: "2026-05-22", speaker: "ZynReach & Customer Panel", gated: true, isOnDemand: true, category: "Operations" },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export function getWebinar(slug: string) {
  return webinars.find((webinar) => webinar.slug === slug);
}
