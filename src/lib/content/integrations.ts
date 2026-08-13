import type { Integration } from "@/types/content";

export const integrations: Integration[] = [
  { slug: "google-workspace", name: "Google Workspace", category: "Email & Calendar", description: "Sync Gmail and Google Calendar activity automatically into CRM records." },
  { slug: "microsoft-365", name: "Microsoft 365", category: "Email & Calendar", description: "Connect Outlook email and calendar for automated activity logging." },
  { slug: "stripe", name: "Stripe", category: "Billing & Payments", description: "Sync billing and subscription data into customer records." },
  { slug: "quickbooks", name: "QuickBooks", category: "Billing & Payments", description: "Keep invoicing and revenue data in sync with your CRM." },
  { slug: "zendesk", name: "Zendesk", category: "Support & Helpdesk", description: "Surface support ticket history directly on the customer timeline." },
  { slug: "intercom", name: "Intercom", category: "Support & Helpdesk", description: "Sync conversations and support data into unified customer records." },
  { slug: "looker", name: "Looker", category: "Analytics & BI", description: "Export pipeline and campaign data for custom BI dashboards." },
  { slug: "google-analytics", name: "Google Analytics", category: "Analytics & BI", description: "Connect web analytics to marketing attribution reporting." },
  { slug: "slack", name: "Slack", category: "Collaboration", description: "Get deal and lead notifications directly in Slack channels." },
  { slug: "microsoft-teams", name: "Microsoft Teams", category: "Collaboration", description: "Route notifications and approvals into Teams channels." },
  { slug: "rest-api", name: "REST API", category: "Developer & API", description: "Build custom integrations against the full ZynReach data model." },
  { slug: "webhooks", name: "Webhooks", category: "Developer & API", description: "Subscribe to real-time workspace events like deal-closed or contact-created." },
];

export const integrationCategories = Array.from(new Set(integrations.map((i) => i.category)));

export function getIntegration(slug: string) {
  return integrations.find((integration) => integration.slug === slug);
}
