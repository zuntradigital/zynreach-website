import { NextResponse } from "next/server";
import { isNonEmpty, isValidEmail } from "@/lib/validation";
import { routeLead } from "@/lib/services/lead-router";
import { isRateLimited, getClientKey } from "@/lib/rate-limit";

interface PartnershipRequestBody {
  companyName?: string;
  contactName?: string;
  workEmail?: string;
  website?: string;
  partnershipType?: string;
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

/** SRS 18.1: Partnership Application submission, routed to the partnerships queue. */
export async function POST(request: Request) {
  if (isRateLimited(`partnership-application:${getClientKey(request)}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let body: PartnershipRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (isNonEmpty(body.company_website ?? "")) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const companyName = body.companyName?.trim() ?? "";
  const contactName = body.contactName?.trim() ?? "";
  const workEmail = body.workEmail?.trim() ?? "";
  const partnershipType = body.partnershipType?.trim() ?? "";

  const errors: Record<string, string> = {};
  if (!isNonEmpty(companyName)) errors.companyName = "Company name is required.";
  if (!isNonEmpty(contactName)) errors.contactName = "Contact name is required.";
  if (!isValidEmail(workEmail)) errors.workEmail = "Enter a valid email address.";
  if (!isNonEmpty(partnershipType)) errors.partnershipType = "Select a partnership type.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const result = await routeLead({
    formId: "partnership-application",
    segment: "partnerships",
    fields: { companyName, contactName, workEmail, website: body.website?.trim() ?? "", partnershipType, message: body.message?.trim() ?? "" },
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
