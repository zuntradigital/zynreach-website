import type { DocArticle } from "@/types/content";

export const docArticles: DocArticle[] = [
  {
    slug: "getting-started",
    category: "Getting Started",
    title: "Getting started with ZynReach",
    description: "Set up your workspace and connect your first tool.",
    order: 1,
    body: [
      { type: "paragraph", text: "This guide walks through the first steps after signing up: creating your workspace, inviting teammates, and connecting your first integration." },
      { type: "heading", id: "create-workspace", text: "1. Create your workspace" },
      { type: "paragraph", text: "After signup, you'll be prompted to name your workspace and choose your primary use case (Sales, Marketing, or both). This determines which capabilities are surfaced first in your navigation." },
      { type: "heading", id: "invite-team", text: "2. Invite your team" },
      { type: "paragraph", text: "From Settings → Team, invite teammates by email. Each invited user is prompted to set a password and complete their profile on first login." },
      { type: "heading", id: "connect-tool", text: "3. Connect your first tool" },
      { type: "paragraph", text: "Go to Settings → Integrations to connect email, calendar, or another supported tool. Most integrations complete in under two minutes via OAuth." },
    ],
  },
  {
    slug: "connecting-email",
    category: "Getting Started",
    title: "Connecting your email and calendar",
    description: "Sync email and calendar activity so the CRM logs itself.",
    order: 2,
    body: [
      { type: "paragraph", text: "Connecting email and calendar is what powers ZynReach's automated activity logging — without it, CRM records won't update themselves." },
      { type: "heading", id: "supported-providers", text: "Supported providers" },
      { type: "list", items: ["Google Workspace", "Microsoft 365 / Outlook", "Any IMAP-compatible provider"] },
      { type: "paragraph", text: "Connect via Settings → Integrations → Email & Calendar. You'll be redirected to your provider's OAuth consent screen — ZynReach never asks for your email password directly." },
    ],
  },
  {
    slug: "crm-pipeline-setup",
    category: "CRM",
    title: "Setting up your sales pipeline",
    description: "Customize deal stages to match how your team actually sells.",
    order: 1,
    body: [
      { type: "paragraph", text: "Every workspace starts with a default pipeline (New → Qualified → Proposal → Closed Won/Lost), but most teams customize stages to match their actual sales process." },
      { type: "heading", id: "editing-stages", text: "Editing pipeline stages" },
      { type: "paragraph", text: "Go to Settings → CRM → Pipeline to add, remove, or reorder stages. Each stage can have required fields that must be filled before a deal advances." },
      { type: "paragraph", text: "Example: enforcing a required field via the API —" },
      {
        type: "code",
        language: "json",
        code: `{
  "stage": "proposal",
  "requiredFields": ["amount", "closeDate"]
}`,
      },
    ],
  },
  {
    slug: "ai-assistant-setup",
    category: "AI Assistants",
    title: "Configuring AI Assistants",
    description: "Control what AI drafts automatically vs. what requires review.",
    order: 1,
    body: [
      { type: "paragraph", text: "AI Assistants can be configured per-workspace to control how much they automate versus how much stays human-reviewed." },
      { type: "heading", id: "draft-modes", text: "Draft modes" },
      { type: "list", items: [
        "Suggest only — AI drafts appear as suggestions a rep must actively accept",
        "Draft and notify — AI creates a draft and notifies the rep to review before sending",
        "Auto-send (Enterprise only) — AI sends low-risk follow-ups automatically, with full audit logging",
      ] },
      { type: "paragraph", text: "Configure this under Settings → AI Assistants → Draft Mode." },
    ],
  },
  {
    slug: "webhooks",
    category: "Developer",
    title: "Using webhooks",
    description: "Subscribe to workspace events like deal-closed or contact-created.",
    order: 1,
    body: [
      { type: "paragraph", text: "Webhooks let external systems react to events in your ZynReach workspace in real time, such as a deal closing or a new contact being created." },
      { type: "heading", id: "creating-webhook", text: "Creating a webhook" },
      { type: "paragraph", text: "Go to Settings → Developer → Webhooks and provide a target URL and the events you want to subscribe to. See the API Reference for the full event payload schema." },
    ],
  },
];

export function getDocArticle(slug: string) {
  return docArticles.find((doc) => doc.slug === slug);
}

export function getDocCategories() {
  return Array.from(new Set(docArticles.map((doc) => doc.category)));
}
