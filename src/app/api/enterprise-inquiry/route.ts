import { NextResponse } from "next/server";
import { isNonEmpty, isValidEmail } from "@/lib/validation";
import { routeLead } from "@/lib/services/lead-router";
import { isRateLimited, getClientKey } from "@/lib/rate-limit";

interface EnterpriseInquiryBody {
  fullName?: string;
  workEmail?: string;
  companyName?: string;
  companySize?: string;
  country?: string;
  message?: string;
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

/**
 * SRS 7.11 + FR-WEB-009: Enterprise page submissions are always flagged
 * segment "enterprise" and bypass standard lead-scoring thresholds —
 * unlike /api/demo, this route does not branch on company size.
 */
export async function POST(request: Request) {
  if (isRateLimited(`enterprise-inquiry:${getClientKey(request)}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let body: EnterpriseInquiryBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (isNonEmpty(body.company_website ?? "")) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const fullName = body.fullName?.trim() ?? "";
  const workEmail = body.workEmail?.trim() ?? "";
  const companyName = body.companyName?.trim() ?? "";
  const companySize = body.companySize?.trim() ?? "";
  const country = body.country?.trim() ?? "";

  const errors: Record<string, string> = {};
  if (!isNonEmpty(fullName)) errors.fullName = "Full name is required.";
  if (!isValidEmail(workEmail)) errors.workEmail = "Enter a valid email address.";
  if (!isNonEmpty(companyName)) errors.companyName = "Company name is required.";
  if (!isNonEmpty(companySize)) errors.companySize = "Select a company size.";
  if (!isNonEmpty(country)) errors.country = "Select a country.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const result = await routeLead({
    formId: "enterprise-inquiry",
    segment: "enterprise",
    fields: { fullName, workEmail, companyName, companySize, country, message: body.message?.trim() ?? "" },
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
