import { useTranslations } from "next-intl";
import { homeHero } from "@/lib/content/home";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  const t = useTranslations("home.hero");
  const tc = useTranslations("common.cta");
  return (
    <section className="relative overflow-hidden bg-neutral-50 pt-12 pb-12 sm:pt-14 sm:pb-14">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(230,198,122,0.35),transparent_55%),radial-gradient(circle_at_10%_80%,rgba(200,155,60,0.12),transparent_45%)]"
      />
      <div className="container-content relative grid items-center gap-12 lg:grid-cols-[55%_45%]">
        <div>
          <p className="mb-3 text-sm font-semibold tracking-[0.15em] text-primary-600 uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            {t("headlinePrefix")} <span className="text-primary-600">{t("headlineHighlight")}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-neutral-600">{t("subhead")}</p>
          <div className="mt-6 flex flex-col gap-3 pr-[var(--floating-widget-clear)] sm:flex-row sm:pr-0">
            <Button
              href={homeHero.ctaPrimary.href}
              variant="primary"
              size="lg"
              className="rounded-[14px]"
              analyticsId="book-a-demo"
              analyticsLocation="home-hero"
            >
              {tc("bookDemo")}
            </Button>
            <Button
              href={homeHero.ctaSecondary.href}
              variant="secondary"
              size="lg"
              className="rounded-[14px]"
              analyticsId="start-free-trial"
              analyticsLocation="home-hero"
            >
              {tc("startFreeTrial")}
            </Button>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
