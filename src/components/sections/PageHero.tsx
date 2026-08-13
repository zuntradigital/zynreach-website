import type { ReactNode } from "react";
import Image from "next/image";

interface PageHeroProps {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  /** Optional background photo (e.g. an Industry page's representative image) — rendered behind a dark scrim so the existing white text/gradient treatment stays unchanged. */
  image?: string;
}

/**
 * Standard interior-page hero (SRS 11.1 Hero Section "standard" variant).
 * Used by pages with a solid-always nav (SRS Section 11.1 Navigation Bar
 * variants) rather than Home's transparent-over-hero treatment.
 */
export function PageHero({ eyebrow, headline, subhead, breadcrumbs, actions, image }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-footer pt-16 pb-16 sm:pt-20 sm:pb-20">
      {image ? (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="absolute inset-0 object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-footer/75" />
        </>
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(230,198,122,0.25),transparent_50%)]"
      />
      <div className="container-content relative">
        {breadcrumbs ? <div className="mb-6 text-white/60">{breadcrumbs}</div> : null}
        {eyebrow ? (
          <p className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {headline}
        </h1>
        {subhead ? <p className="mt-6 max-w-2xl text-lg text-white/80">{subhead}</p> : null}
        {actions ? (
          <div className="mt-8 flex flex-col gap-3 pr-[var(--floating-widget-clear)] sm:flex-row sm:pr-0">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}
