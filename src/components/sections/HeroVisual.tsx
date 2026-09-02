import Image from "next/image";
import { getTranslations } from "next-intl/server";

/**
 * Home Hero visual: the "growth tiers" illustration (Starter → Professional
 * → Business → Enterprise rising as steps, with a climbing growth arrow) —
 * a supplied, pre-rendered artwork rather than a generated mockup, so it is
 * shipped as a single `next/image` asset (`public/images/hero/growth-tiers.png`)
 * rather than being recreated in markup. The image carries its own baked-in
 * English tier labels, so it is intentionally not mirrored under RTL
 * (`dir="rtl"`) — flipping it would render that text backwards — while the
 * surrounding grid column order still reflows correctly for Arabic because
 * `Hero.tsx`'s two-column grid has no hardcoded left/right positioning.
 *
 * Motion, all compositor-only (transform/opacity/filter — no layout
 * properties, so nothing here can cause CLS) and covered by the sitewide
 * prefers-reduced-motion rule in globals.css (collapses every animation
 * below to a single instant frame, no per-effect gating needed):
 *  - one-shot entrance: the whole visual fades/scales/rises in on first paint;
 *  - hero-growth-float: a slow, continuous vertical bob once settled;
 *  - hero-growth-glow-a / -b: two independently-phased ambient colour blobs
 *    breathing behind the artwork (cool blue/teal + warm gold/violet),
 *    echoing the Starter→Enterprise colour progression in the image itself;
 *  - hero-growth-shine: a diagonal light sweep masked to the artwork's own
 *    alpha channel (via mask-image), so the "catching the light" pass only
 *    crosses the actual illustration, never the transparent space around it;
 *  - hero-growth-spark-a / -b: two small ambient sparkle points drifting
 *    near the ascending arrow, reinforcing the "still climbing" motion.
 */
export async function HeroVisual() {
  const t = await getTranslations("home.hero.visual");
  const imageSrc = "/images/hero/growth-tiers.png";

  return (
    <div className="hero-growth-visual relative mx-auto w-full max-w-md">
      <div
        aria-hidden="true"
        className="hero-growth-glow-a absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(37,150,190,0.35)_0%,rgba(16,163,127,0.18)_45%,transparent_72%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="hero-growth-glow-b absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(230,198,122,0.4)_0%,rgba(124,77,199,0.16)_45%,transparent_72%)] blur-2xl"
      />

      <div className="hero-growth-float relative">
        <span aria-hidden="true" className="hero-growth-spark hero-growth-spark-a" />
        <span aria-hidden="true" className="hero-growth-spark hero-growth-spark-b" />

        <div className="relative">
          <Image
            src={imageSrc}
            alt={t("ariaLabel")}
            width={1312}
            height={1199}
            priority
            sizes="(min-width: 1024px) 28rem, (min-width: 640px) 26rem, 85vw"
            className="relative z-10 h-auto w-full select-none"
          />
          <div
            aria-hidden="true"
            className="hero-growth-shine absolute inset-0 z-20"
            style={{
              WebkitMaskImage: `url(${imageSrc})`,
              maskImage: `url(${imageSrc})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
}
