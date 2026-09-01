/**
 * Career application submissions (SRS Section 18.1: "Career Application
 * includes resume upload and EEO-compliant optional fields").
 *
 * Forwards to System B's career-application ingest endpoint
 * (/api/admin/leads/career-application), which stores the resume for real
 * (reusing the Media Library's local-disk storage helper) and creates a
 * Submission+Lead — same service-token contract as lead-router.ts's
 * routeLead(), with the same graceful degradation: if the two env vars
 * aren't configured or the call fails, this falls back to the original
 * console.info dev-safe sink rather than losing the application.
 */

import { captureIntegrationCall } from "@/lib/monitoring";

export interface CareerApplicationInput {
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  portfolioUrl?: string;
  resume: File;
  eeo?: {
    gender?: string;
    // Sent under the historical "veteranStatus" wire name — the receiving
    // Prisma column (CareerApplication.veteranStatus) is kept as-is to
    // avoid a migration + existing-row backfill, matching this codebase's
    // documented convention for CareerApplication.resumeUrl. The field is
    // Egypt's Military Service status, not the US EEO veteran concept —
    // see the website's militaryService options for the real values.
    militaryService?: string;
  };
}

export interface CareerApplicationResult {
  success: true;
  applicationId: string;
}

export async function submitCareerApplication(input: CareerApplicationInput): Promise<CareerApplicationResult> {
  const applicationId = `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (baseUrl && token) {
    try {
      const formData = new FormData();
      formData.set("jobId", input.jobId);
      formData.set("jobTitle", input.jobTitle);
      formData.set("fullName", input.fullName);
      formData.set("email", input.email);
      if (input.portfolioUrl) formData.set("portfolioUrl", input.portfolioUrl);
      if (input.eeo?.gender) formData.set("gender", input.eeo.gender);
      if (input.eeo?.militaryService) formData.set("veteranStatus", input.eeo.militaryService);
      formData.set("resume", input.resume, input.resume.name);

      const res = await fetch(`${baseUrl}/api/admin/leads/career-application`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        // Fail fast rather than hanging the request if System B is
        // unreachable — the catch block below already falls back to the
        // dev-safe console sink.
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        captureIntegrationCall("resume-storage", "success");
        return { success: true, applicationId };
      }
      captureIntegrationCall("resume-storage", "failure");
    } catch {
      captureIntegrationCall("resume-storage", "failure");
    }
  } else {
    captureIntegrationCall("resume-storage", "failure");
  }

  // Dev-safe sink — System B unreachable/unconfigured, or the ingest call
  // failed. The application isn't silently lost: it's logged, matching
  // this project's disclosed-degradation pattern used everywhere else
  // (lead-router.ts, trial-provisioning.ts).
  console.info(
    "[career-application]",
    JSON.stringify({ applicationId, jobId: input.jobId, fullName: input.fullName, email: input.email, resumeFileName: input.resume.name, resumeFileSize: input.resume.size })
  );

  return { success: true, applicationId };
}
