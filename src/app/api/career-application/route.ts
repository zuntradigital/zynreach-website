import { NextResponse } from "next/server";
import { isNonEmpty, isValidEmail } from "@/lib/validation";
import { submitCareerApplication } from "@/lib/services/career-application";
import { isRateLimited, getClientKey } from "@/lib/rate-limit";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ACCEPTED_RESUME_TYPES = [".pdf", ".doc", ".docx"];

/** SRS 18.1: Career Application submission — resume upload + optional EEO fields. */
export async function POST(request: Request) {
  if (isRateLimited(`career-application:${getClientKey(request)}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const honeypot = String(formData.get("company_website") ?? "");
  if (isNonEmpty(honeypot)) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const jobId = String(formData.get("jobId") ?? "");
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const portfolioUrl = String(formData.get("portfolioUrl") ?? "").trim();
  const gender = String(formData.get("gender") ?? "").trim();
  const veteranStatus = String(formData.get("veteranStatus") ?? "").trim();
  const resume = formData.get("resume");

  const errors: Record<string, string> = {};
  if (!isNonEmpty(fullName)) errors.fullName = "Full name is required.";
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";

  if (!(resume instanceof File) || resume.size === 0) {
    errors.resume = "Attach a resume.";
  } else if (resume.size > MAX_RESUME_BYTES) {
    errors.resume = "Resume must be smaller than 5MB.";
  } else if (!ACCEPTED_RESUME_TYPES.some((ext) => resume.name.toLowerCase().endsWith(ext))) {
    errors.resume = "Resume must be a PDF, DOC, or DOCX file.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const result = await submitCareerApplication({
    jobId,
    jobTitle,
    fullName,
    email,
    portfolioUrl: portfolioUrl || undefined,
    resume: resume as File,
    eeo: { gender: gender || undefined, veteranStatus: veteranStatus || undefined },
  });

  return NextResponse.json(result, { status: 200 });
}
