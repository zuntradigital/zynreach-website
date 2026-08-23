"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface CountdownTimerProps {
  targetDate: string;
}

function getRemaining(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

/** Upcoming Webinar countdown (Knowledge Center §8 "Countdown when needed") — client-only, no layout shift risk since it renders inside an already-hydrated detail page. */
export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const t = useTranslations("resourcesLibraryPage.webinarDetail");
  const [remaining, setRemaining] = useState<{ days: number; hours: number; minutes: number } | null>(() => getRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining(targetDate)), 60_000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!remaining) return null;

  return (
    <div className="mt-4 flex items-center gap-4" role="timer" aria-label={t("countdownLabel")}>
      {[
        { value: remaining.days, label: t("countdownDays") },
        { value: remaining.hours, label: t("countdownHours") },
        { value: remaining.minutes, label: t("countdownMinutes") },
      ].map((unit) => (
        <div key={unit.label} className="text-center">
          <p className="text-2xl font-bold tabular-nums text-primary-600">{unit.value}</p>
          <p className="text-xs text-neutral-500">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}
