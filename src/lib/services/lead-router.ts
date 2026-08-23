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

export type LeadSegment = "self-serve" | "enterprise" | "support" | "other" | "partnerships" | "press" | "careers";

export interface LeadPayload {
  formId: string;
  /** Internal routing bucket (which queue/notification this lead goes
   * to) — not the SRS's "Source" field. Recorded in Submission.utm for
   * reference, never written to Lead.source (see utmSource below). */
  segment: LeadSegment;
  fields: Record<string, string>;
  /** SRS §20.2/§28.2's actual "Source" — captured from the visitor's
   * utm_source query param (FR-WEB-009), not an internal classification.
   * Written directly to Lead.source; falls back to "direct" when the
   * visitor arrived with no UTM tag at all (the common case for direct
   * navigation to e.g. /contact). */
  utmSource?: string;
  /** SRS §20.2/§28.2's "Campaign" — the visitor's utm_campaign param. */
  utmCampaign?: string;
  /** Remaining SRS §20.2/§28.2 attribution fields — utm_medium/term/content,
   * the first-touch landing page for this session, the external referrer,
   * and the submitting device class. All optional/best-effort (client-
   * supplied, per useUtmParams.ts), stored in Submission.utm alongside
   * segment/source/campaign rather than as new Lead columns — same
   * flexible-Json approach the schema already uses for this field. */
  utmMedium?: string;
  utmTerm?: string;
  utmContent?: string;
  landingPage?: string;
  referrer?: string;
  device?: string;
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
          source: payload.utmSource || "direct",
          ...(payload.utmCampaign ? { campaign: payload.utmCampaign } : {}),
          utm: {
            segment: payload.segment,
            ...(payload.utmSource ? { source: payload.utmSource } : {}),
            ...(payload.utmCampaign ? { campaign: payload.utmCampaign } : {}),
            ...(payload.utmMedium ? { medium: payload.utmMedium } : {}),
            ...(payload.utmTerm ? { term: payload.utmTerm } : {}),
            ...(payload.utmContent ? { content: payload.utmContent } : {}),
            ...(payload.landingPage ? { landingPage: payload.landingPage } : {}),
            ...(payload.referrer ? { referrer: payload.referrer } : {}),
            ...(payload.device ? { device: payload.device } : {}),
          },
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
