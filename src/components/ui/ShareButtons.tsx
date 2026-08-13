"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Share2, Link2, Check } from "lucide-react";
import { LinkedInIcon, XIcon } from "@/components/icons/SocialIcons";

interface ShareButtonsProps {
  url: string;
  title: string;
}

/** SRS 7.16: article share (share only, no on-site comments at v1). */
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const t = useTranslations("blogPage.share");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ url, title });
      } catch {
        // User cancelled — no action needed.
      }
    } else {
      handleCopy();
    }
  }

  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const xHref = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{t("label")}</span>
      <a
        href={linkedInHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("linkedin")}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:border-primary-300 hover:text-primary-600"
      >
        <LinkedInIcon className="h-4 w-4" />
      </a>
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("x")}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:border-primary-300 hover:text-primary-600"
      >
        <XIcon className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={t("copyLink")}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:border-primary-300 hover:text-primary-600"
      >
        {copied ? <Check aria-hidden="true" className="h-4 w-4 text-success" /> : <Link2 aria-hidden="true" className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={handleNativeShare}
        aria-label={t("share")}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:border-primary-300 hover:text-primary-600 sm:hidden"
      >
        <Share2 aria-hidden="true" className="h-4 w-4" />
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t("linkCopied") : ""}
      </span>
    </div>
  );
}
