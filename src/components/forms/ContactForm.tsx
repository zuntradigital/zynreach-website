"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TextField } from "./TextField";
import { SelectField } from "./SelectField";
import { TextareaField } from "./TextareaField";
import { Honeypot } from "./Honeypot";
import { contactReasonOptions } from "@/lib/content/form-options";
import { isNonEmpty, isValidEmail } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { captureFormOutcome } from "@/lib/monitoring";

interface FormState {
  name: string;
  email: string;
  reason: string;
  message: string;
}

const initialState: FormState = { name: "", email: "", reason: "", message: "" };

/** SRS Section 7.15 Contact form: Name*, Email*, Reason for contact*, Message*. */
export function ContactForm() {
  const t = useTranslations("contact.form");
  const localizedReasonOptions = contactReasonOptions.map((option) => ({
    ...option,
    label: t(`reasonOptions.${option.value}` as Parameters<typeof t>[0]),
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
    if (!isNonEmpty(form.name)) next.name = t("errors.nameRequired");
    if (!isValidEmail(form.email)) next.email = t("errors.emailInvalid");
    if (!isNonEmpty(form.reason)) next.reason = t("errors.reasonRequired");
    if (!isNonEmpty(form.message)) next.message = t("errors.messageRequired");
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company_website: honeypot }),
      });
      if (!response.ok) {
        const data = await response.json();
        captureFormOutcome("contact", "server_error");
        setErrorMessage(data.error ?? t("genericError"));
        setStatus("error");
        return;
      }
      captureFormOutcome("contact", "success");
      setStatus("success");
    } catch {
      captureFormOutcome("contact", "server_error");
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
        label={t("name")}
        name="name"
        value={form.name}
        onChange={(v) => update("name", v)}
        error={errors.name}
        required
        autoComplete="name"
      />
      <TextField
        label={t("email")}
        name="email"
        type="email"
        value={form.email}
        onChange={(v) => update("email", v)}
        error={errors.email}
        required
        autoComplete="email"
      />
      <SelectField
        label={t("reason")}
        name="reason"
        value={form.reason}
        onChange={(v) => update("reason", v)}
        options={localizedReasonOptions}
        error={errors.reason}
        required
      />
      <TextareaField
        label={t("message")}
        name="message"
        value={form.message}
        onChange={(v) => update("message", v)}
        error={errors.message}
        required
        rows={5}
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
