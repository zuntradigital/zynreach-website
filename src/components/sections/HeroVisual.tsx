import Image from "next/image";
import { site } from "@/lib/content/site";

/**
 * Hero illustration: the ZR gold logo mark (public/logo-mark.png, the same
 * background-keyed asset used by the header — see Logo.tsx) floating inside
 * a glowing sphere with light rays. The city-skyline layer from the
 * reference design still has no asset in this repo, so that part remains
 * an abstract gold glow/podium composition rather than a redrawn skyline.
 */
export function HeroVisual() {
  return (
    <div
      role="img"
      aria-label={`${site.name} logo mark inside a glowing gold sphere illustration`}
      className="relative mx-auto aspect-square w-full max-w-sm"
    >
      {/* Ambient bloom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(230,198,122,0.55)_0%,rgba(200,155,60,0.22)_45%,transparent_72%)] blur-2xl"
      />

      {/* Glass sphere */}
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full border border-white/60 bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.9),rgba(255,255,255,0.15)_38%,rgba(230,198,122,0.12)_70%)] shadow-[0_30px_80px_rgba(200,155,60,0.25)] backdrop-blur-sm"
      />

      {/* Light rays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg_at_50%_45%,transparent_0deg,rgba(230,198,122,0.25)_15deg,transparent_35deg,transparent_180deg,rgba(230,198,122,0.18)_200deg,transparent_230deg)] mix-blend-plus-lighter"
      />

      {/* Floating gold logo mark */}
      <Image
        src="/logo-mark.png"
        alt=""
        aria-hidden="true"
        width={471}
        height={312}
        priority
        className="absolute top-1/2 left-1/2 h-56 w-auto -translate-x-1/2 -translate-y-[50%] drop-shadow-[0_20px_40px_rgba(168,120,30,0.4)] sm:h-64"
      />

      {/* Podium */}
      <div
        aria-hidden="true"
        className="absolute bottom-[6%] left-1/2 h-4 w-2/3 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(168,120,30,0.35),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[8%] left-1/2 h-2 w-1/2 -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,var(--color-gold-grad-top),var(--color-gold-grad-bottom))] opacity-80"
      />
    </div>
  );
}
