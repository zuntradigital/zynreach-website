import { NextResponse } from "next/server";
import { isNonEmpty, isWorkEmail, isStrongPassword } from "@/lib/validation";
import { checkEmailAvailable, submitTrialSignup } from "@/lib/services/trial-provisioning";
import { isRateLimited, getClientKey } from "@/lib/rate-limit";

interface TrialRequestBody {
  fullName?: string;
  companyName?: string;
  workEmail?: string;
  password?: string;
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

/** SRS Section 18.3: Free Trial submission — validate, check email uniqueness, submit signup request. */
export async function POST(request: Request) {
  if (isRateLimited(`trial:${getClientKey(request)}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let body: TrialRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (isNonEmpty(body.company_website ?? "")) {
    return NextResponse.json({ accepted: true }, { status: 200 });
  }

  const fullName = body.fullName?.trim() ?? "";
  const companyName = body.companyName?.trim() ?? "";
  const workEmail = body.workEmail?.trim() ?? "";
  const password = body.password ?? "";

  const errors: Record<string, string> = {};
  if (!isNonEmpty(fullName)) errors.fullName = "Full name is required.";
  if (!isNonEmpty(companyName)) errors.companyName = "Company name is required.";
  if (!isWorkEmail(workEmail)) errors.workEmail = "Enter a work email address.";
  if (!isStrongPassword(password)) {
    errors.password = "Password must be at least 8 characters and include a letter and a number.";
  }

  if (Object.keys(errors).length === 0 && !(await checkEmailAvailable(workEmail))) {
    errors.workEmail = "An account with this email already exists.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const result = await submitTrialSignup({
    fullName,
    companyName,
    workEmail,
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
