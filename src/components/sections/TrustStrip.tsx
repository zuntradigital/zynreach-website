import { trustStrip } from "@/lib/content/home";
import { Button } from "@/components/ui/Button";

export function TrustStrip() {
  return (
    <section className="border-y border-neutral-200 bg-neutral-50 py-14">
      <div className="container-content flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            {trustStrip.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-900">{trustStrip.headline}</h2>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-6">
          {trustStrip.points.map((point) => {
            const Icon = point.icon;
            return (
              <li key={point.label} className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                <Icon className="h-5 w-5 text-primary-600" aria-hidden="true" strokeWidth={1.75} />
                {point.label}
              </li>
            );
          })}
        </ul>

        <Button href={trustStrip.cta.href} variant="secondary">
          {trustStrip.cta.label}
        </Button>
      </div>
    </section>
  );
}
