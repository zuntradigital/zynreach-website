"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { isNonEmpty, isWorkEmail } from "@/lib/validation";
import { trackConversion } from "@/lib/analytics";
import { captureFormOutcome } from "@/lib/monitoring";

type FormStatus = "idle" | "loading" | "success" | "error";

interface LeadCaptureStripProps {
  headline?: string;
  source?: string;
}

/**
 * SRS 7.8 "inline lead-capture strip above the footer (name/work email)
 * for content-download-style low-commitment capture." Full validation +
 * loading/success/error states per SRS 11.1 Form (Generic).
 */
export function LeadCaptureStrip({ headline, source }: LeadCaptureStripProps) {
  const t = useTranslations("leadCaptureStrip");
  const resolvedHeadline = headline ?? t("defaultHeadline");
  const [name, setName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; workEmail?: string; consent?: string }>({});
  const nameId = useId();
  const emailId = useId();
  const consentId = useId();
  const statusId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors: { name?: string; workEmail?: string; consent?: string } = {};
    if (!isNonEmpty(name)) errors.name = t("nameRequired");
    if (!isWorkEmail(workEmail)) errors.workEmail = t("emailInvalid");
    if (!consent) errors.consent = t("consentRequired");
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, workEmail, source, consent }),
      });
      if (!response.ok) throw new Error("Request failed");
      const isDownload = /guide|webinar|whitepaper|documentation|security-whitepaper|compliance-documentation/.test(
        source ?? ""
      );
      trackConversion(isDownload ? "content_downloaded" : "newsletter_signup", { source });
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
          placeholder={t("emailPlaceholder")}
          aria-invalid={Boolean(fieldErrors.workEmail)}
          aria-describedby={fieldErrors.workEmail ? statusId : undefined}
          className="min-h-11 w-full rounded-md border border-neutral-300 px-3 text-sm focus-visible:border-primary-500"
        />
      </div>
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
        {fieldErrors.name || fieldErrors.workEmail || fieldErrors.consent}
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
