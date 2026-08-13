"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface HelpfulWidgetProps {
  docSlug: string;
}

/** SRS 7.17: Documentation "Was this helpful?" feedback widget. */
export function HelpfulWidget({ docSlug }: HelpfulWidgetProps) {
  const t = useTranslations("docsPage.helpful");
  const [submitted, setSubmitted] = useState<"yes" | "no" | null>(null);

  async function submitFeedback(value: "yes" | "no") {
    setSubmitted(value);
    try {
      await fetch("/api/doc-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docSlug, helpful: value === "yes" }),
      });
    } catch {
      // Feedback is best-effort; UI already reflects the user's choice.
    }
  }

  if (submitted) {
    return <p className="text-sm text-neutral-500">{t("thanks")}</p>;
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-neutral-700">{t("question")}</span>
      <button
        type="button"
        onClick={() => submitFeedback("yes")}
        aria-label={t("yes")}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 hover:border-primary-300 hover:text-primary-600"
      >
        <ThumbsUp aria-hidden="true" className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => submitFeedback("no")}
        aria-label={t("no")}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 hover:border-primary-300 hover:text-primary-600"
      >
        <ThumbsDown aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
