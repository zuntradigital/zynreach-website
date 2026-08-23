"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { isNonEmpty, isWorkEmail } from "@/lib/validation";
import { trackConversion, trackEvent } from "@/lib/analytics";
import { captureFormOutcome } from "@/lib/monitoring";
import { useUtmParams } from "@/lib/hooks/useUtmParams";
import { companySizeOptions } from "@/lib/content/form-options";

type FormStatus = "idle" | "loading" | "success" | "error";

interface LeadCaptureStripProps {
  headline?: string;
  source?: string;
  /**
   * Gated Guides & Templates / Webinars content (SRS §7 Gated Content, §8
   * registration form) needs Company + Job Title + Company Size on top of
   * name/work email — plain newsletter signup elsewhere doesn't, so this
   * defaults to off and is opted into by the gated-content/webinar callers.
   */
  collectBusinessDetails?: boolean;
}

/**
 * SRS 7.8 "inline lead-capture strip above the footer (name/work email)
 * for content-download-style low-commitment capture." Full validation +
 * loading/success/error states per SRS 11.1 Form (Generic).
 */
export function LeadCaptureStrip({ headline, source, collectBusinessDetails = false }: LeadCaptureStripProps) {
  const t = useTranslations("leadCaptureStrip");
  const tDemo = useTranslations("demo.form");
  const resolvedHeadline = headline ?? t("defaultHeadline");
  const [name, setName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; workEmail?: string; company?: string; jobTitle?: string; consent?: string }>({});
  const utmParams = useUtmParams();
  const nameId = useId();
  const emailId = useId();
  const companyId = useId();
  const jobTitleId = useId();
  const companySizeId = useId();
  const consentId = useId();
  const statusId = useId();
  const isWebinar = (source ?? "").startsWith("webinar-");
  const startedRef = useRef(false);

  function handleFirstInteraction() {
    if (!isWebinar || startedRef.current) return;
    startedRef.current = true;
    trackEvent("webinar_registration_started", { source });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors: { name?: string; workEmail?: string; company?: string; jobTitle?: string; consent?: string } = {};
    if (!isNonEmpty(name)) errors.name = t("nameRequired");
    if (!isWorkEmail(workEmail)) errors.workEmail = t("emailInvalid");
    if (collectBusinessDetails && !isNonEmpty(company)) errors.company = t("companyRequired");
    if (collectBusinessDetails && !isNonEmpty(jobTitle)) errors.jobTitle = t("jobTitleRequired");
    if (!consent) errors.consent = t("consentRequired");
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          workEmail,
          source,
          consent,
          ...(collectBusinessDetails ? { company, jobTitle, companySize: companySize || undefined } : {}),
          ...utmParams,
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      const isDownload = /guide|webinar|whitepaper|documentation|security-whitepaper|compliance-documentation/.test(
        source ?? ""
      );
      trackConversion(isDownload ? "content_downloaded" : "newsletter_signup", { source });
      if (isWebinar) trackEvent("webinar_registration_completed", { source });
      captureFormOutcome(source ?? "lead-capture-strip", "success");
      setStatus("success");
    } catch {
      captureFormOutcome(source ?? "lead-capture-strip", "server_error");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex items-center gap-2 text-sm font-medium text-success">
        <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
        {t("success")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <label htmlFor={nameId} className="sr-only">
          {t("nameLabel")}
        </label>
        <input
          id={nameId}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={handleFirstInteraction}
          placeholder={t("namePlaceholder")}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? statusId : undefined}
          className="min-h-11 w-full rounded-md border border-neutral-300 px-3 text-sm focus-visible:border-primary-500"
        />
      </div>
      <div className="flex-1">
        <label htmlFor={emailId} className="sr-only">
          {t("emailLabel")}
        </label>
        <input
          id={emailId}
          type="email"
          value={workEmail}
          onChange={(e) => setWorkEmail(e.target.value)}
          onFocus={handleFirstInteraction}
          placeholder={t("emailPlaceholder")}
          aria-invalid={Boolean(fieldErrors.workEmail)}
          aria-describedby={fieldErrors.workEmail ? statusId : undefined}
          className="min-h-11 w-full rounded-md border border-neutral-300 px-3 text-sm focus-visible:border-primary-500"
        />
      </div>
      {collectBusinessDetails ? (
        <>
          <div className="flex-1">
            <label htmlFor={companyId} className="sr-only">
              {t("companyLabel")}
            </label>
            <input
              id={companyId}
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onFocus={handleFirstInteraction}
              placeholder={t("companyPlaceholder")}
              aria-invalid={Boolean(fieldErrors.company)}
              aria-describedby={fieldErrors.company ? statusId : undefined}
              className="min-h-11 w-full rounded-md border border-neutral-300 px-3 text-sm focus-visible:border-primary-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor={jobTitleId} className="sr-only">
              {t("jobTitleLabel")}
            </label>
            <input
              id={jobTitleId}
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              onFocus={handleFirstInteraction}
              placeholder={t("jobTitlePlaceholder")}
              aria-invalid={Boolean(fieldErrors.jobTitle)}
              aria-describedby={fieldErrors.jobTitle ? statusId : undefined}
              className="min-h-11 w-full rounded-md border border-neutral-300 px-3 text-sm focus-visible:border-primary-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor={companySizeId} className="sr-only">
              {t("companySizeLabel")}
            </label>
            <select
              id={companySizeId}
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              onFocus={handleFirstInteraction}
              className="min-h-11 w-full rounded-md border border-neutral-300 bg-white dark:bg-neutral-100 px-3 text-sm text-neutral-700 focus-visible:border-primary-500"
            >
              <option value="">{t("companySizeLabel")}</option>
              {companySizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {tDemo(`companySizeOptions.${option.value}` as Parameters<typeof tDemo>[0])}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : null}
      <div className="flex items-start gap-2 sm:basis-full">
        <input
          id={consentId}
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          aria-invalid={Boolean(fieldErrors.consent)}
          aria-describedby={fieldErrors.consent ? statusId : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500"
        />
        <label htmlFor={consentId} className="text-xs text-neutral-600 dark:text-neutral-600">
          {t("consentLabel")}
        </label>
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-70 dark:text-neutral-50"
      >
        {status === "loading" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
        {resolvedHeadline ? t("subscribe") : t("submit")}
      </button>

      <p id={statusId} role="alert" aria-live="polite" className="w-full text-xs text-error sm:basis-full">
        {fieldErrors.name || fieldErrors.workEmail || fieldErrors.company || fieldErrors.jobTitle || fieldErrors.consent}
        {status === "error" ? (
          <span className="flex items-center gap-1">
            <AlertCircle aria-hidden="true" className="h-3.5 w-3.5" />
            {t("error")}
          </span>
        ) : null}
      </p>
    </form>
  );
}
