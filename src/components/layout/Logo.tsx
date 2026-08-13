import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/content/site";

type LogoType = "full" | "icon";
type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  variant?: "dark" | "light";
  /** "full" (default) pairs the mark with the ZynReach wordmark; "icon" renders the mark alone for compact contexts. */
  type?: LogoType;
  /** Controls the mark's rendered height — the wordmark (in "full") scales to match. Defaults to "md", the header's existing size. */
  size?: LogoSize;
  /** Passed through to next/image; true by default since the header instance is typically above the fold. */
  priority?: boolean;
  /**
   * Opts into the premium entrance/hover/shine/float treatment — kept
   * off by default so contexts like the Footer stay static, matching
   * how reference sites (Stripe, Linear, Vercel) treat a footer
   * logo differently from the interactive header mark.
   */
  animated?: boolean;
  className?: string;
}

const markSizeClasses: Record<LogoSize, string> = {
  sm: "h-7",
  md: "h-9",
  lg: "h-12",
};

const wordmarkSizeClasses: Record<LogoSize, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
};

/**
 * Official ZR mark (public/logo-mark.png) is a background-keyed derivative
 * of the delivered public/logo.png: the source asset ships on a flat opaque
 * #F7F7F7 canvas, so a flood-fill pass made only that flat background
 * transparent (see scripts/process-logo.js) — the mark's artwork itself
 * (shape, color, gradients) is pixel-identical to the source, not redrawn
 * or recolored. Because the mark carries its own navy/gold coloring, one
 * asset works unaltered on both light and dark surfaces.
 */
export function Logo({ variant = "dark", type = "full", size = "md", priority = true, animated = false, className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className ?? ""}`} aria-label={site.name}>
      <span className={`relative inline-block shrink-0 ${animated ? "logo-animated logo-shine overflow-hidden" : ""}`}>
        <Image
          src="/logo-mark.png"
          alt=""
          aria-hidden="true"
          width={471}
          height={312}
          priority={priority}
          className={`w-auto ${markSizeClasses[size]}`}
        />
      </span>
      {type === "full" ? (
        <span
          className={`font-serif font-bold tracking-tight ${wordmarkSizeClasses[size]} ${
            variant === "light" ? "text-white" : "text-neutral-900"
          }`}
        >
          {site.name}
        </span>
      ) : null}
    </Link>
  );
}
