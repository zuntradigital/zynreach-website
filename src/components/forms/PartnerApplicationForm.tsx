"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TextField } from "./TextField";
import { SelectField } from "./SelectField";
import { TextareaField } from "./TextareaField";
import { Honeypot } from "./Honeypot";
import { isNonEmpty, isValidEmail } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { captureFormOutcome } from "@/lib/monitoring";
import { useUtmParams } from "@/lib/hooks/useUtmParams";

interface FormState {
  companyName: string;
  contactName: string;
  workEmail: string;
  website: string;
  partnershipType: string;
  businessType: string;
  customerType: string;
  customerBase: string;
  message: string;
  collaborationInterest: string;
  consent: boolean;
}

const initialState: FormState = {
  companyName: "",
  contactName: "",
  workEmail: "",
  website: "",
  partnershipType: "",
  businessType: "",
  customerType: "",
  customerBase: "",
  message: "",
  collaborationInterest: "",
  consent: false,
};

/** SRS 4.5/5.3/18.1: Partnership Application form, routed to the partnerships queue. */
export function PartnerApplicationForm() {
  const t = useTranslations("partnerForm");
  const consentId = useId();
  const partnershipTypeOptions = [
    { value: "reseller", label: t("partnershipTypeOptions.reseller") },
    { value: "referral", label: t("partnershipTypeOptions.referral") },
    { value: "technology", label: t("partnershipTypeOptions.technology") },
    { value: "agency", label: t("partnershipTypeOptions.agency") },
    { value: "other", label: t("partnershipTypeOptions.other") },
  ];
  const businessTypeOptions = [
    { value: "software", label: t("businessTypeOptions.software") },
    { value: "it", label: t("businessTypeOptions.it") },
    { value: "agency", label: t("businessTypeOptions.agency") },
    { value: "consulting", label: t("businessTypeOptions.consulting") },
    { value: "professionalServices", label: t("businessTypeOptions.professionalServices") },
    { value: "technologyProvider", label: t("businessTypeOptions.technologyProvider") },
    { value: "consultant", label: t("businessTypeOptions.consultant") },
    { value: "other", label: t("businessTypeOptions.other") },
  ];
  const [form, setForm] = useState<FormState>(initialState);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const utmParams = useUtmParams();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): Partial<Record<keyof FormState, string>> {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!isNonEmpty(form.companyName)) next.companyName = t("errors.companyNameRequired");
    if (!isNonEmpty(form.contactName)) next.contactName = t("errors.contactNameRequired");
    if (!isValidEmail(form.workEmail)) next.workEmail = t("errors.emailInvalid");
    if (!isNonEmpty(form.partnershipType)) next.partnershipType = t("errors.partnershipTypeRequired");
    if (!form.consent) next.consent = t("errors.consentRequired");
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/partnership-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company_website: honeypot, ...utmParams }),
      });
      const data = await response.json();
      if (!response.ok) {
        captureFormOutcome("partnership-application", "server_error");
        setErrorMessage(data.error ?? t("genericError"));
        setStatus("error");
        return;
      }
      captureFormOutcome("partnership-application", "success");
      setStatus("success");
    } catch {
      captureFormOutcome("partnership-application", "server_error");
      setErrorMessage(t("genericError"));
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl border border-success/30 bg-success-bg p-8 text-center">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-10 w-10 text-success" />
        <h3 className="mt-4 text-xl font-semibold text-neutral-900">{t("successTitle")}</h3>
        <p className="mt-2 text-sm text-neutral-600">{t("successBody")}</p>
        <Button href="/" variant="secondary" size="md" className="mt-6">
          {t("successCta")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <TextField label={t("companyName")} name="companyName" value={form.companyName} onChange={(v) => update("companyName", v)} error={errors.companyName} required autoComplete="organization" />
      <TextField label={t("contactName")} name="contactName" value={form.contactName} onChange={(v) => update("contactName", v)} error={errors.contactName} required autoComplete="name" />
      <TextField label={t("workEmail")} name="workEmail" type="email" value={form.workEmail} onChange={(v) => update("workEmail", v)} error={errors.workEmail} required autoComplete="email" />
      <TextField label={t("website")} name="website" value={form.website} onChange={(v) => update("website", v)} placeholder={t("websitePlaceholder")} />
      <SelectField label={t("partnershipType")} name="partnershipType" value={form.partnershipType} onChange={(v) => update("partnershipType", v)} options={partnershipTypeOptions} error={errors.partnershipType} required />
      <SelectField label={t("businessType")} name="businessType" value={form.businessType} onChange={(v) => update("businessType", v)} options={businessTypeOptions} />
      <TextField label={t("customerType")} name="customerType" value={form.customerType} onChange={(v) => update("customerType", v)} placeholder={t("customerTypePlaceholder")} />
      <TextField label={t("customerBase")} name="customerBase" value={form.customerBase} onChange={(v) => update("customerBase", v)} placeholder={t("customerBasePlaceholder")} />
      <TextareaField label={t("message")} name="message" value={form.message} onChange={(v) => update("message", v)} placeholder={t("messagePlaceholder")} />
      <TextareaField label={t("collaborationInterest")} name="collaborationInterest" value={form.collaborationInterest} onChange={(v) => update("collaborationInterest", v)} placeholder={t("collaborationInterestPlaceholder")} />

      <div>
        <div className="flex items-start gap-2.5">
          <input
            id={consentId}
            type="checkbox"
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-neutral-300 text-primary-600 focus-visible:outline-none"
          />
          <label htmlFor={consentId} className="text-sm text-neutral-700">
            {t("consent")}
          </label>
        </div>
        {errors.consent ? (
          <p role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-error">
            <AlertCircle aria-hidden="true" className="h-3.5 w-3.5" />
            {errors.consent}
          </p>
        ) : null}
      </div>

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
