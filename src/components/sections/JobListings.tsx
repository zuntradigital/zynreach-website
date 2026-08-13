"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, ArrowRight } from "lucide-react";

const ALL = "All";

export interface JobListingSummary {
  id: string;
  title: string;
  team: string;
  location: string;
}

interface JobListingsProps {
  jobs: JobListingSummary[];
}

/**
 * SRS 7.14: filterable job listings, keyboard-operable, result count
 * announced via aria-live. Takes pre-resolved jobs (already localized,
 * either from a live System B fetch or the hardcoded fallback + t() —
 * resolved once by the caller) instead of importing content directly, so
 * this component has no data-source dependency of its own.
 */
export function JobListings({ jobs }: JobListingsProps) {
  const t = useTranslations("jobListingsUi");
  const teams = useMemo(() => [ALL, ...Array.from(new Set(jobs.map((job) => job.team)))], [jobs]);
  const locations = useMemo(() => [ALL, ...Array.from(new Set(jobs.map((job) => job.location)))], [jobs]);

  const [team, setTeam] = useState(ALL);
  const [location, setLocation] = useState(ALL);

  const filtered = jobs.filter((job) => (team === ALL || job.team === team) && (location === ALL || job.location === location));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div>
          <label htmlFor="team-filter" className="block text-sm font-medium text-neutral-700">
            {t("teamLabel")}
          </label>
          <select
            id="team-filter"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="mt-1.5 min-h-11 rounded-md border border-neutral-300 bg-white dark:bg-neutral-100 px-3 text-sm"
          >
            {teams.map((teamOption) => (
              <option key={teamOption} value={teamOption}>
                {teamOption}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location-filter" className="block text-sm font-medium text-neutral-700">
            {t("locationLabel")}
          </label>
          <select
            id="location-filter"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1.5 min-h-11 rounded-md border border-neutral-300 bg-white dark:bg-neutral-100 px-3 text-sm"
          >
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p role="status" aria-live="polite" className="mt-4 text-sm text-neutral-500">
        {filtered.length} {filtered.length === 1 ? t("openRole") : t("openRoles")}
      </p>

      <ul className="mt-4 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100">
        {filtered.map((job) => (
          <li key={job.id}>
            <Link
              href={`/careers/${job.id}`}
              className="flex flex-col gap-2 p-6 hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-semibold text-neutral-900">{job.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                  {job.team}
                  <span aria-hidden="true">·</span>
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                  {job.location}
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-primary-600">
                {t("applyNow")}
                <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
              </span>
            </Link>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="p-6 text-sm text-neutral-500">{t("noRoles")}</li>
        ) : null}
      </ul>
    </div>
  );
}
