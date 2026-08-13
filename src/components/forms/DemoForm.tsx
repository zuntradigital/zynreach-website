"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TextField } from "./TextField";
import { SelectField } from "./SelectField";
import { TextareaField } from "./TextareaField";
import { Honeypot } from "./Honeypot";
import { companySizeOptions, countryOptions } from "@/lib/content/form-options";
import { isNonEmpty, isValidPhone, isWorkEmail, isFreeEmailDomain } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { trackConversion } from "@/lib/analytics";
import { captureFormOutcome } from "@/lib/monitoring";

interface FormState {
  fullName: string;
  workEmail: string;
  companyName: string;
  companySize: string;
  phone: string;
  country: string;
  goal: string;
}

const initialState: FormState = {
  fullName: "",
  workEmail: "",
  companyName: "",
  companySize: "",
  phone: "",
  country: "",
  goal: "",
};

/** SRS Section 18.2: Book a Demo form — full field set, soft work-email warning, honeypot. */
export function DemoForm() {
  const t = useTranslations("demo.form");
  const localizedCompanySizeOptions = companySizeOptions.map((option) => ({
    ...option,
    label: t(`companySizeOptions.${option.value}` as Parameters<typeof t>[0]),
  }));
  const localizedCountryOptions = countryOptions.map((option) => ({
    ...option,
    label: t(`countryOptions.${option.value}` as Parameters<typeof t>[0]),
  }));
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
    if (!isNonEmpty(form.fullName)) next.fullName = t("errors.fullNameRequired");
    if (!isNonEmpty(form.workEmail)) {
      next.workEmail = t("errors.workEmailRequired");
    } else if (!isWorkEmail(form.workEmail) && !isFreeEmailDomain(form.workEmail)) {
      next.workEmail = t("errors.workEmailInvalid");
    }
    if (!isNonEmpty(form.companyName)) next.companyName = t("errors.companyNameRequired");
    if (!isNonEmpty(form.companySize)) next.companySize = t("errors.companySizeRequired");
    if (!isNonEmpty(form.country)) next.country = t("errors.countryRequired");
    if (!isValidPhone(form.phone)) next.phone = t("errors.phoneInvalid");
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company_website: honeypot }),
      });
      const data = await response.json();
      if (!response.ok) {
        captureFormOutcome("book-a-demo", "server_error");
        setErrorMessage(data.error ?? t("genericError"));
        setStatus("error");
        return;
      }
      trackConversion("demo_booked", { company_size: form.companySize });
      captureFormOutcome("book-a-demo", "success");
      setStatus("success");
    } catch {
      captureFormOutcome("book-a-demo", "server_error");
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
      <TextField
        label={t("fullName")}
        name="fullName"
        value={form.fullName}
        onChange={(v) => update("fullName", v)}
        error={errors.fullName}
        required
        autoComplete="name"
      />
      <TextField
        label={t("workEmail")}
        name="workEmail"
        type="email"
        value={form.workEmail}
        onChange={(v) => update("workEmail", v)}
        error={errors.workEmail}
        required
        autoComplete="email"
      />
      {!errors.workEmail && form.workEmail && isFreeEmailDomain(form.workEmail) ? (
        <p className="-mt-3 flex items-center gap-1.5 text-xs text-warning">
          <AlertCircle aria-hidden="true" className="h-3.5 w-3.5" />
          {t("personalEmailWarning")}
        </p>
      ) : null}
      <TextField
        label={t("companyName")}
        name="companyName"
        value={form.companyName}
        onChange={(v) => update("companyName", v)}
        error={errors.companyName}
        required
        autoComplete="organization"
      />
      <SelectField
        label={t("companySize")}
        name="companySize"
        value={form.companySize}
        onChange={(v) => update("companySize", v)}
        options={localizedCompanySizeOptions}
        error={errors.companySize}
        required
      />
      <TextField
        label={t("phone")}
        name="phone"
        type="tel"
        value={form.phone}
        onChange={(v) => update("phone", v)}
        error={errors.phone}
        autoComplete="tel"
      />
      <SelectField
        label={t("country")}
        name="country"
        value={form.country}
        onChange={(v) => update("country", v)}
        options={localizedCountryOptions}
        error={errors.country}
        required
      />
      <TextareaField
        label={t("goal")}
        name="goal"
        value={form.goal}
        onChange={(v) => update("goal", v)}
        placeholder={t("goalPlaceholder")}
      />

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
