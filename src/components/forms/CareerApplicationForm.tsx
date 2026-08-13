"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TextField } from "./TextField";
import { SelectField } from "./SelectField";
import { Honeypot } from "./Honeypot";
import { isNonEmpty, isValidEmail } from "@/lib/validation";
import { captureFormOutcome } from "@/lib/monitoring";
import { Button } from "@/components/ui/Button";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ACCEPTED_RESUME_TYPES = [".pdf", ".doc", ".docx"];

interface CareerApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

/** SRS 18.1 Career Application: resume upload + optional EEO self-identification fields. */
export function CareerApplicationForm({ jobId, jobTitle }: CareerApplicationFormProps) {
  const t = useTranslations("careerApplicationForm");
  const eeoOptions = [
    { value: "prefer-not-to-say", label: t("eeoOptions.preferNotToSay") },
    { value: "man", label: t("eeoOptions.man") },
    { value: "woman", label: t("eeoOptions.woman") },
    { value: "non-binary", label: t("eeoOptions.nonBinary") },
  ];
  const veteranOptions = [
    { value: "prefer-not-to-say", label: t("veteranOptions.preferNotToSay") },
    { value: "veteran", label: t("veteranOptions.veteran") },
    { value: "not-veteran", label: t("veteranOptions.notVeteran") },
  ];
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [gender, setGender] = useState("");
  const [veteranStatus, setVeteranStatus] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; resume?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const resumeId = useId();

  function validate() {
    const next: { fullName?: string; email?: string; resume?: string } = {};
    if (!isNonEmpty(fullName)) next.fullName = t("errors.fullNameRequired");
    if (!isValidEmail(email)) next.email = t("errors.emailInvalid");
    if (!resumeFile) {
      next.resume = t("errors.resumeRequired");
    } else if (resumeFile.size > MAX_RESUME_BYTES) {
      next.resume = t("errors.resumeTooLarge");
    } else if (!ACCEPTED_RESUME_TYPES.some((ext) => resumeFile.name.toLowerCase().endsWith(ext))) {
      next.resume = t("errors.resumeInvalidType");
    }
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("loading");
    try {
      const formData = new FormData();
      formData.set("jobId", jobId);
      formData.set("jobTitle", jobTitle);
      formData.set("fullName", fullName);
      formData.set("email", email);
      formData.set("portfolioUrl", portfolioUrl);
      formData.set("gender", gender);
      formData.set("veteranStatus", veteranStatus);
      formData.set("company_website", honeypot);
      if (resumeFile) formData.set("resume", resumeFile);

      const response = await fetch("/api/career-application", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) {
        captureFormOutcome("career-application", "server_error");
        setErrorMessage(data.error ?? t("genericError"));
        setStatus("error");
        return;
      }
      captureFormOutcome("career-application", "success");
      setStatus("success");
    } catch {
      captureFormOutcome("career-application", "server_error");
      setErrorMessage(t("genericError"));
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl border border-success/30 bg-success-bg p-8 text-center">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-10 w-10 text-success" />
        <h3 className="mt-4 text-xl font-semibold text-neutral-900">{t("successTitle")}</h3>
        <p className="mt-2 text-sm text-neutral-600">{t("successBody", { jobTitle })}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <TextField label={t("fullName")} name="fullName" value={fullName} onChange={setFullName} error={errors.fullName} required autoComplete="name" />
      <TextField label={t("email")} name="email" type="email" value={email} onChange={setEmail} error={errors.email} required autoComplete="email" />
      <TextField label={t("portfolioUrl")} name="portfolioUrl" value={portfolioUrl} onChange={setPortfolioUrl} placeholder={t("portfolioPlaceholder")} />

      <div>
        <label htmlFor={resumeId} className="block text-sm font-medium text-neutral-900">
          {t("resume")} <span aria-hidden="true" className="text-error">*</span>
        </label>
        <input
          id={resumeId}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
          aria-invalid={Boolean(errors.resume)}
          aria-describedby={errors.resume ? `${resumeId}-error` : undefined}
          className="mt-1.5 block w-full text-sm text-neutral-700 file:me-3 file:min-h-11 file:rounded-md file:border-0 file:bg-primary-50 file:px-4 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
        />
        {errors.resume ? (
          <p id={`${resumeId}-error`} role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-error">
            <AlertCircle aria-hidden="true" className="h-3.5 w-3.5" />
            {errors.resume}
          </p>
        ) : null}
      </div>

      <fieldset className="rounded-md border border-neutral-200 p-4">
        <legend className="px-1 text-sm font-medium text-neutral-900">{t("eeoLegend")}</legend>
        <div className="mt-3 space-y-4">
          <SelectField label={t("gender")} name="gender" value={gender} onChange={setGender} options={eeoOptions} />
          <SelectField
            label={t("veteranStatus")}
            name="veteranStatus"
            value={veteranStatus}
            onChange={setVeteranStatus}
            options={veteranOptions}
          />
        </div>
      </fieldset>

      {status === "error" ? (
        <p role="alert" className="flex items-center gap-1.5 text-sm text-error">
          <AlertCircle aria-hidden="true" className="h-4 w-4" />
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
        {t("submit")}
      </Button>
    </form>
  );
}
