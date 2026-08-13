import { Button } from "@/components/ui/Button";

interface CtaBandProps {
  headline: string;
  body?: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  /** SRS 16 CTA click tracking — the page/section this band appears on, e.g. "home-final-cta". */
  analyticsLocation?: string;
  /** Tighter vertical padding for the Home page's denser section rhythm — every other caller keeps the original py-16. */
  compact?: boolean;
}

export function CtaBand({ headline, body, ctaPrimary, ctaSecondary, analyticsLocation, compact = false }: CtaBandProps) {
  return (
    <section className={`bg-neutral-50 ${compact ? "py-12" : "py-16"}`}>
      <div className="container-content">
        <div className="relative overflow-hidden rounded-xl bg-footer px-8 py-12 sm:px-14">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(230,198,122,0.22),transparent_55%),radial-gradient(circle_at_10%_90%,rgba(200,155,60,0.12),transparent_45%)]"
          />
          <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="max-w-xl text-3xl font-bold text-white sm:text-4xl">{headline}</h2>
              {body ? <p className="mt-3 max-w-lg text-neutral-400 dark:text-white/60">{body}</p> : null}
            </div>
            <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
              <Button
                href={ctaPrimary.href}
                variant="primary"
                size="lg"
                analyticsId={analyticsLocation ? `cta-band-primary` : undefined}
                analyticsLocation={analyticsLocation}
              >
                {ctaPrimary.label}
              </Button>
              {ctaSecondary ? (
                <Button
                  href={ctaSecondary.href}
                  variant="ghost"
                  size="lg"
                  className="border border-white/20 text-white hover:bg-white/10"
                  analyticsId={analyticsLocation ? `cta-band-secondary` : undefined}
                  analyticsLocation={analyticsLocation}
                >
                  {ctaSecondary.label}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
