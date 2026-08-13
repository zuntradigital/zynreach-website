import { statusComponents, incidentLog } from "@/lib/content/status";
import type { StatusComponent, IncidentLogEntry } from "@/types/content";
import { captureIntegrationCall } from "@/lib/monitoring";

/**
 * Status provider abstraction (SRS FR-WEB-011: "pulled live from the
 * status provider API"). No status provider (Statuspage.io, Better
 * Stack, etc.) is connected — this returns the static content as the
 * "current" status until a real provider is wired in behind this same
 * async interface. Callers don't need to change when that happens.
 */
export async function getCurrentStatus(): Promise<{ components: StatusComponent[]; overall: StatusComponent["status"] }> {
  const overall = statusComponents.some((c) => c.status === "outage")
    ? "outage"
    : statusComponents.some((c) => c.status === "degraded")
      ? "degraded"
      : "operational";
  captureIntegrationCall("status-provider", "success");
  return { components: statusComponents, overall };
}

export async function getIncidentHistory(): Promise<IncidentLogEntry[]> {
  return incidentLog;
}
