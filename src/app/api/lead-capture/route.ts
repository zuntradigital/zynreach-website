import { NextResponse } from "next/server";
import { isNonEmpty, isWorkEmail } from "@/lib/validation";
import { routeLead } from "@/lib/services/lead-router";
import { isRateLimited, getClientKey } from "@/lib/rate-limit";

interface LeadCaptureRequestBody {
  name?: string;
  workEmail?: string;
  company?: string;
  jobTitle?: string;
  companySize?: string;
  source?: string;
  consent?: boolean;
  company_website?: string; // honeypot
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
  device?: string;
}

// Same context-string classification LeadCaptureStrip.tsx already uses
// client-side (for its own conversion-tracking event) — replicated here
// so the admin Leads Inbox can actually tell a Newsletter Signup apart
// from a Gated Content Download instead of both landing under the
// identical formId "lead-capture-strip" with no way to filter between
// them (both used to be true before this classification existed).
const DOWNLOAD_SOURCE_PATTERN = /guide|webinar|whitepaper|documentation|security-whitepaper|compliance-documentation/;

/**
 * SRS Section 27: inline lead-capture strip endpoint used on Solutions
 * sub-pages (content-download-style, low-commitment capture), and also
 * the sitewide Newsletter Signup surface (SRS §18/§20.1). §20.1: "consent
 * copy is CMS-editable text tied to a required-boolean field type, never
 * removable... since consent:true is required at the API layer." §32:
 * "Newsletter Signup consent field must be explicitly true; cannot be
 * defaulted or pre-checked" — enforced here, not just client-side, so a
 * stale/bypassed client can't skip it.
 */
export async function POST(request: Request) {
  if (isRateLimited(`lead-capture:${getClientKey(request)}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let body: LeadCaptureRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (isNonEmpty(body.company_website ?? "")) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const name = body.name?.trim() ?? "";
  const workEmail = body.workEmail?.trim() ?? "";

  const errors: Record<string, string> = {};
  if (!isNonEmpty(name)) errors.name = "Name is required.";
  if (!isWorkEmail(workEmail)) errors.workEmail = "Enter a valid work email address.";
  if (body.consent !== true) errors.consent = "Consent is required.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const isDownload = DOWNLOAD_SOURCE_PATTERN.test(body.source ?? "");

  const result = await routeLead({
    formId: isDownload ? "gated-content-download" : "newsletter-signup",
    segment: "self-serve",
    fields: {
      name,
      workEmail,
      consent: "true",
      sourceContext: body.source ?? "",
      ...(body.company?.trim() ? { company: body.company.trim() } : {}),
      ...(body.jobTitle?.trim() ? { jobTitle: body.jobTitle.trim() } : {}),
      ...(body.companySize?.trim() ? { companySize: body.companySize.trim() } : {}),
    },
    utmSource: body.utm_source,
    utmCampaign: body.utm_campaign,
    utmMedium: body.utm_medium,
    utmTerm: body.utm_term,
    utmContent: body.utm_content,
    landingPage: body.landing_page,
    referrer: body.referrer,
    device: body.device,
  });

  return NextResponse.json(result, { status: 200 });
}
