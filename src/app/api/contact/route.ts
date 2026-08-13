import { NextResponse } from "next/server";
import { isNonEmpty, isValidEmail } from "@/lib/validation";
import { routeLead, type LeadSegment } from "@/lib/services/lead-router";
import { isRateLimited, getClientKey } from "@/lib/rate-limit";

interface ContactRequestBody {
  name?: string;
  email?: string;
  reason?: string;
  message?: string;
  company_website?: string; // honeypot
}

const REASON_TO_SEGMENT: Record<string, LeadSegment> = {
  sales: "self-serve",
  support: "support",
  partnerships: "partnerships",
  press: "press",
  other: "support",
};

/** SRS Section 7.15: Contact form — "Reason for contact" routes to the correct internal queue. */
export async function POST(request: Request) {
  if (isRateLimited(`contact:${getClientKey(request)}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let body: ContactRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (isNonEmpty(body.company_website ?? "")) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const reason = body.reason?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  const errors: Record<string, string> = {};
  if (!isNonEmpty(name)) errors.name = "Name is required.";
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!isNonEmpty(reason)) errors.reason = "Select a reason for contact.";
  if (!isNonEmpty(message)) errors.message = "Message is required.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const segment = REASON_TO_SEGMENT[reason] ?? "support";

  const result = await routeLead({
    formId: "contact",
    segment,
    fields: { name, email, reason, message },
  });

  return NextResponse.json(result, { status: 200 });
}
