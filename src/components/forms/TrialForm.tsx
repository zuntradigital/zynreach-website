"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TextField } from "./TextField";
import { Honeypot } from "./Honeypot";
import { isNonEmpty, isWorkEmail, isStrongPassword } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { trackConversion } from "@/lib/analytics";
import { captureFormOutcome } from "@/lib/monitoring";
import { useUtmParams } from "@/lib/hooks/useUtmParams";

interface FormState {
  fullName: string;
  companyName: string;
  workEmail: string;
  password: string;
}

const initialState: FormState = { fullName: "", companyName: "", workEmail: "", password: "" };

/** SRS Section 18.3: Free Trial form. */
export function TrialForm() {
  const t = useTranslations("trial.form");
  const [form, setForm] = useState<FormState>(initialState);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const utmParams = useUtmParams();

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): Partial<Record<keyof FormState, string>> {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!isNonEmpty(form.fullName)) next.fullName = t("errors.fullNameRequired");
    if (!isNonEmpty(form.companyName)) next.companyName = t("errors.companyNameRequired");
    if (!isWorkEmail(form.workEmail)) next.workEmail = t("errors.workEmailInvalid");
    if (!isStrongPassword(form.password)) {
      next.password = t("errors.passwordWeak");
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
      const response = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company_website: honeypot, ...utmParams }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.errors?.workEmail) {
          setErrors((prev) => ({ ...prev, workEmail: data.errors.workEmail }));
          setStatus("idle");
          captureFormOutcome("free-trial", "validation_error");
          return;
        }
        captureFormOutcome("free-trial", "server_error");
        setErrorMessage(data.error ?? t("genericError"));
        setStatus("error");
        return;
      }
      trackConversion("trial_started");
      captureFormOutcome("free-trial", "success");
      setStatus("success");
    } catch {
      captureFormOutcome("free-trial", "server_error");
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
        label={t("companyName")}
        name="companyName"
        value={form.companyName}
        onChange={(v) => update("companyName", v)}
        error={errors.companyName}
        required
        autoComplete="organization"
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
      <TextField
        label={t("password")}
        name="password"
        type="password"
        value={form.password}
        onChange={(v) => update("password", v)}
        error={errors.password}
        required
        autoComplete="new-password"
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
