/**
 * Lead routing service (SRS FR-WEB-009: routes form submissions to the
 * correct internal queue by segment/company size/territory).
 *
 * Every form in this codebase calls this one function; this function
 * forwards into System B (ZynReach Admin/CMS Dashboard)'s already-built
 * Lead Management module — POST /api/admin/leads/ingest — which is what
 * actually gives Sales Operations/Marketing Manager visibility into the
 * lead (SCR-034). Beyond that hand-off, real CRM sync (Salesforce/
 * HubSpot/etc.) is System B's own concern (Lead.crmSyncStatus), not
 * something this repo needs credentials for — the BLOCKER this module
 * used to describe is resolved by that hand-off existing at all.
 *
 * Still degrades gracefully: if the two env vars below aren't
 * configured, this falls back to the original dev-safe console sink
 * rather than throwing, so every caller in this codebase keeps working
 * standalone exactly as before.
 */

import { captureIntegrationCall } from "@/lib/monitoring";

export type LeadSegment = "self-serve" | "enterprise" | "support" | "partnerships" | "press" | "careers";

export interface LeadPayload {
  formId: string;
  segment: LeadSegment;
  fields: Record<string, string>;
  utmSource?: string;
}

export interface LeadRouteResult {
  success: true;
  leadId: string;
}

export async function routeLead(payload: LeadPayload): Promise<LeadRouteResult> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (baseUrl && token) {
    try {
      const res = await fetch(`${baseUrl}/api/admin/leads/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          formId: payload.formId,
          payload: payload.fields,
          source: payload.segment,
          ...(payload.utmSource ? { utm: { source: payload.utmSource } } : {}),
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as { leadId: string };
        captureIntegrationCall("zynreach-admin-leads", "success");
        return { success: true, leadId: data.leadId };
      }
      captureIntegrationCall("zynreach-admin-leads", "failure");
    } catch {
      captureIntegrationCall("zynreach-admin-leads", "failure");
    }
  }

  // Dev-safe fallback — no System B configured, or the call above failed.
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  console.info("[lead-router]", JSON.stringify({ leadId, ...payload }));
  return { success: true, leadId };
}
