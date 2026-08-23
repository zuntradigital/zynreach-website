import { NextResponse } from "next/server";
import { isNonEmpty, isValidEmail, isValidPhone } from "@/lib/validation";
import { routeLead, type LeadSegment } from "@/lib/services/lead-router";
import { isRateLimited, getClientKey } from "@/lib/rate-limit";

interface DemoRequestBody {
  fullName?: string;
  workEmail?: string;
  companyName?: string;
  companySize?: string;
  phone?: string;
  country?: string;
  industry?: string;
  role?: string;
  primaryNeed?: string;
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

const ENTERPRISE_SIZES = new Set(["201-1000", "1000+"]);

/** SRS Section 18.2: Book a Demo submission — validate, then route to CRM by company size/country. */
export async function POST(request: Request) {
  if (isRateLimited(`demo:${getClientKey(request)}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let body: DemoRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill every field, humans never see this one (SRS 19 spam protection).
  if (isNonEmpty(body.company_website ?? "")) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const fullName = body.fullName?.trim() ?? "";
  const workEmail = body.workEmail?.trim() ?? "";
  const companyName = body.companyName?.trim() ?? "";
  const companySize = body.companySize?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const country = body.country?.trim() ?? "";
  const industry = body.industry?.trim() ?? "";
  const role = body.role?.trim() ?? "";
  const primaryNeed = body.primaryNeed?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  const errors: Record<string, string> = {};
  if (!isNonEmpty(fullName)) errors.fullName = "Full name is required.";
  if (!isValidEmail(workEmail)) errors.workEmail = "Enter a valid email address.";
  if (!isNonEmpty(companyName)) errors.companyName = "Company name is required.";
  if (!isNonEmpty(companySize)) errors.companySize = "Select a company size.";
  if (!isNonEmpty(country)) errors.country = "Select a country.";
  if (!isValidPhone(phone)) errors.phone = "Enter a valid phone number.";
  if (!isNonEmpty(industry)) errors.industry = "Select an industry.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const segment: LeadSegment = ENTERPRISE_SIZES.has(companySize) ? "enterprise" : "self-serve";

  const result = await routeLead({
    formId: "book-a-demo",
    segment,
    fields: { fullName, workEmail, companyName, companySize, phone, country, industry, role, primaryNeed, message },
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
