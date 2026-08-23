/**
 * Trial account provisioning (SRS Section 18.3).
 *
 * BLOCKER: real account *provisioning* happens in the ZynReach
 * *application* backend (System C), which SRS Section 4 explicitly places
 * out of System B's scope — "beyond the point where System B hands off a
 * qualified/created lead or account-request record, actual account
 * provisioning is a System C concern." This repo has no access to that
 * system, so the account-creation half stays a dev-safe stub.
 *
 * What IS in scope, and now real: the lead hand-off itself. Every other
 * form in this codebase (Contact, Demo, Enterprise Inquiry, Partnership,
 * lead-capture) already routes through routeLead() into System B's Lead
 * Management module (SCR-034) — Free Trial was the one form still using a
 * console-only stub. Same pattern, same pipe, just wired here too.
 */

import { captureIntegrationCall } from "@/lib/monitoring";
import { routeLead } from "@/lib/services/lead-router";

export interface TrialSignupInput {
  fullName: string;
  companyName: string;
  workEmail: string;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  utmTerm?: string;
  utmContent?: string;
  landingPage?: string;
  referrer?: string;
  device?: string;
}

export interface TrialSignupResult {
  accepted: true;
  requestId: string;
}

const seenEmails = new Set<string>();

export async function checkEmailAvailable(workEmail: string): Promise<boolean> {
  return !seenEmails.has(workEmail.toLowerCase());
}

export async function submitTrialSignup(input: TrialSignupInput): Promise<TrialSignupResult> {
  seenEmails.add(input.workEmail.toLowerCase());
  const requestId = `trial_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Dev-safe sink until the app backend's real signup API is available (see module doc above).
  console.info("[trial-provisioning]", JSON.stringify({ requestId, ...input }));
  captureIntegrationCall("app-backend-signup", "success");

  await routeLead({
    formId: "trial",
    segment: "self-serve",
    fields: { fullName: input.fullName, companyName: input.companyName, workEmail: input.workEmail },
    utmSource: input.utmSource,
    utmCampaign: input.utmCampaign,
    utmMedium: input.utmMedium,
    utmTerm: input.utmTerm,
    utmContent: input.utmContent,
    landingPage: input.landingPage,
    referrer: input.referrer,
    device: input.device,
  });

  return { accepted: true, requestId };
}
