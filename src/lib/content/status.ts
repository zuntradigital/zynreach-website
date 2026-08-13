import type { StatusComponent, IncidentLogEntry } from "@/types/content";

/**
 * SRS 7.19 / FR-WEB-011: "Status page content is pulled live from the
 * status provider API." No status provider (Statuspage.io, Better
 * Stack, etc.) is connected in this repo — this is the clean,
 * production-shaped abstraction (see lib/services/status-provider.ts)
 * returning static "operational" data until a real provider is wired in.
 */
export const statusComponents: StatusComponent[] = [
  { name: "Application", status: "operational" },
  { name: "API", status: "operational" },
  { name: "Marketing website", status: "operational" },
  { name: "Email delivery", status: "operational" },
];

export const incidentLog: IncidentLogEntry[] = [
  {
    date: "2026-06-14",
    title: "Elevated API latency",
    status: "resolved",
    summary: "A subset of API requests experienced elevated latency for approximately 40 minutes. Root cause was identified and resolved; no data loss occurred.",
  },
];
