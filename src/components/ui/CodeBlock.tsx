"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface CodeBlockProps {
  code: string;
  language?: string;
}

/** SRS Blog & Resource Platform: "Code Blocks" + "Copy to Clipboard". Knowledge Center §21 "Code Copy" event fires on every use, sitewide, from this one shared component. */
export function CodeBlock({ code, language = "json" }: CodeBlockProps) {
  const t = useTranslations("common.codeBlock");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    trackEvent("code_copy", { language });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative rounded-lg bg-footer">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs font-medium text-neutral-400 dark:text-white/50">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white dark:text-white/50"
        >
          {copied ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
      <pre tabIndex={0} className="overflow-x-auto p-4 text-sm text-neutral-100 dark:text-white/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}
