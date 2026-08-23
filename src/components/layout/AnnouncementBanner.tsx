"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";

const DISMISSED_STORAGE_KEY = "zynreach-dismissed-banners";

export interface AnnouncementBannerData {
  id: string;
  message: string;
  link: string | null;
  dismissible: boolean;
  targetZone: string;
}

interface AnnouncementBannerProps {
  banners: AnnouncementBannerData[];
}

function readDismissedIds(): string[] {
  try {
    const raw = window.localStorage.getItem(DISMISSED_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * SRS §22 Global Banners / Announcement Bars — the admin's Banners tab
 * (AnnouncementBanner model, active-date-range filtered server-side by
 * /api/public/settings) rendered sitewide. `targetZone` isn't an enum the
 * SRS defines beyond its "sitewide" default, so every active banner
 * renders in this single top-of-page slot rather than guessing at
 * per-zone placement that isn't specified anywhere.
 */
export function AnnouncementBanner({ banners }: AnnouncementBannerProps) {
  const t = useTranslations("common.announcementBanner");
  const [dismissedIds, setDismissedIds] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readDismissedIds()
  );

  const visible = banners.filter((b) => !dismissedIds.includes(b.id));
  if (visible.length === 0) return null;

  function dismiss(id: string) {
    const next = [...dismissedIds, id];
    setDismissedIds(next);
    try {
      window.localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable — dismissal just won't persist across reloads.
    }
  }

  return (
    <div>
      {visible.map((banner) => (
        <div
          key={banner.id}
          role="region"
          aria-label={banner.message}
          className="flex items-center justify-center gap-3 bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white"
        >
          {banner.link ? (
            <Link href={banner.link} className="underline underline-offset-2 hover:no-underline">
              {banner.message}
            </Link>
          ) : (
            <span>{banner.message}</span>
          )}
          {banner.dismissible ? (
            <button
              type="button"
              onClick={() => dismiss(banner.id)}
              aria-label={t("dismiss")}
              className="shrink-0 rounded p-0.5 hover:bg-white/20"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
