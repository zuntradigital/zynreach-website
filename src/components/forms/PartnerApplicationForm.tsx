"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TextField } from "./TextField";
import { SelectField } from "./SelectField";
import { TextareaField } from "./TextareaField";
import { Honeypot } from "./Honeypot";
import { isNonEmpty, isValidEmail } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { captureFormOutcome } from "@/lib/monitoring";

interface FormState {
  companyName: string;
  contactName: string;
  workEmail: string;
  website: string;
  partnershipType: string;
  message: string;
}

const initialState: FormState = { companyName: "", contactName: "", workEmail: "", website: "", partnershipType: "", message: "" };

/** SRS 4.5/5.3/18.1: Partnership Application form, routed to the partnerships queue. */
export function PartnerApplicationForm() {
  const t = useTranslations("partnerForm");
  const partnershipTypeOptions = [
    { value: "reseller", label: t("partnershipTypeOptions.reseller") },
    { value: "referral", label: t("partnershipTypeOptions.referral") },
    { value: "technology", label: t("partnershipTypeOptions.technology") },
    { value: "agency", label: t("partnershipTypeOptions.agency") },
  ];
  const [form, setForm] = useState<FormState>(initialState);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): Partial<Record<keyof FormState, string>> {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!isNonEmpty(form.companyName)) next.companyName = t("errors.companyNameRequired");
    if (!isNonEmpty(form.contactName)) next.contactName = t("errors.contactNameRequired");
    if (!isValidEmail(form.workEmail)) next.workEmail = t("errors.emailInvalid");
    if (!isNonEmpty(form.partnershipType)) next.partnershipType = t("errors.partnershipTypeRequired");
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
        body: JSON.stringify({ ...form, company_website: honeypot }),
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
      <TextareaField label={t("message")} name="message" value={form.message} onChange={(v) => update("message", v)} placeholder={t("messagePlaceholder")} />

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
