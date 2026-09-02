import Image from "next/image";
import { getTranslations } from "next-intl/server";

/**
 * Home Hero visual: the "growth tiers" illustration (Starter → Professional
 * → Business → Enterprise rising as steps in black + gold, with a climbing
 * growth arrow) — a supplied, pre-rendered artwork rather than a generated
 * mockup, so it is shipped as a single `next/image` asset
 * (`public/images/hero/growth-tiers-v2.png`, pre-trimmed from the original
 * source to its actual visible bounding box — the source canvas carried a
 * large fully-transparent margin down its right side that would otherwise
 * sit as dead space inside this column; every visible artwork pixel is
 * untouched) rather than being recreated in markup. The image carries its
 * own baked-in English tier labels, so it is intentionally not mirrored
 * under RTL (`dir="rtl"`) — flipping it would render that text backwards —
 * while the surrounding grid column order still reflows correctly for
 * Arabic because `Hero.tsx`'s two-column grid has no hardcoded left/right
 * positioning.
 *
 * Motion, all compositor-only (transform/opacity/filter — no layout
 * properties, so nothing here can cause CLS) and covered by the sitewide
 * prefers-reduced-motion rule in globals.css (collapses every animation
 * below to a single instant frame, no per-effect gating needed):
 *  - one-shot entrance: the whole visual fades/scales/rises in on first paint;
 *  - hero-growth-float: a slow, continuous vertical bob once settled;
 *  - hero-growth-glow-a / -b: two independently-phased ambient gold blobs
 *    breathing behind the artwork, reusing the exact same rgba(230,198,122)
 *    / rgba(200,155,60) pair as Hero.tsx's own background wash and the
 *    site's primary-300/primary-500 gold tokens, so the glow reads as an
 *    extension of the artwork's own gold accents rather than an unrelated
 *    added colour;
 *  - hero-growth-shine: a diagonal light sweep masked to the artwork's own
 *    alpha channel (via mask-image), so the "catching the light" pass only
 *    crosses the actual illustration, never the transparent space around it;
 *  - hero-growth-spark-a / -b: two small ambient sparkle points near the
 *    arrow tip and the enterprise tower/shield, reinforcing the "still
 *    climbing toward the top tier" motion.
 */
export async function HeroVisual() {
  const t = await getTranslations("home.hero.visual");
  const imageSrc = "/images/hero/growth-tiers-v2.png";

  return (
    <div className="hero-growth-visual relative mx-auto w-full max-w-md">
      <div
        aria-hidden="true"
        className="hero-growth-glow-a absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(230,198,122,0.4)_0%,rgba(200,155,60,0.16)_45%,transparent_72%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="hero-growth-glow-b absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(200,155,60,0.32)_0%,rgba(230,198,122,0.14)_45%,transparent_72%)] blur-2xl"
      />

      <div className="hero-growth-float relative">
        <span aria-hidden="true" className="hero-growth-spark hero-growth-spark-a" />
        <span aria-hidden="true" className="hero-growth-spark hero-growth-spark-b" />

        <div className="relative">
          <Image
            src={imageSrc}
            alt={t("ariaLabel")}
            width={1114}
            height={1024}
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
