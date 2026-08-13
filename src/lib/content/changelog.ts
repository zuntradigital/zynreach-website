import type { ChangelogEntry } from "@/types/content";

/**
 * SRS 7.19: "Changelog is fed from the product release data feed
 * (FR-WEB-012) with manual override capability for marketing framing."
 * No product release feed exists in this repo — this is a structurally
 * real, static stand-in until that feed is connected.
 */
export const changelogEntries: ChangelogEntry[] = [
  { version: "2026.7.2", date: "2026-07-25", productArea: "AI Assistants", title: "AI Assistants reaches general availability", description: "Drafting, call summarization, and deal-risk flagging are now available to all Growth and Enterprise workspaces." },
  { version: "2026.7.1", date: "2026-07-10", productArea: "Analytics", title: "Custom dashboard builder", description: "Build role-specific dashboards from any combination of CRM, marketing, and automation metrics." },
  { version: "2026.6.3", date: "2026-06-22", productArea: "Workflow Automation", title: "Approval steps for workflows", description: "Add a human approval step to any automated workflow, with a full audit trail of decisions." },
  { version: "2026.6.2", date: "2026-06-08", productArea: "CRM", title: "Contact enrichment on create", description: "New contacts are automatically enriched with firmographic data as they're created." },
  { version: "2026.6.1", date: "2026-06-01", productArea: "Marketing Automation", title: "Multi-touch attribution model", description: "Marketing touches are now attributed across the full customer journey, not just first or last touch." },
  { version: "2026.5.2", date: "2026-05-18", productArea: "Integrations", title: "Slack notifications", description: "Get deal and lead notifications delivered directly to Slack channels." },
];

export function getProductAreas() {
  return Array.from(new Set(changelogEntries.map((entry) => entry.productArea)));
}
