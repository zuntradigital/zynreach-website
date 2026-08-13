"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const DURATION_MS = 1300;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
function readReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
function getServerReducedMotion() {
  return false;
}

interface CountUpStatProps {
  /** Already-resolved display value, e.g. "10+", "98%", or a non-numeric value like "Global". */
  value: string;
}

/**
 * Animates the leading integer of `value` from 0 up to its target once the
 * element scrolls into view, then holds at the final value — plays once per
 * mount, never re-triggers on repeated scroll in/out. Values with no
 * leading digit (e.g. "Global") render as plain static text. Landing on
 * the final value triggers a brief scale "pop" (see .count-up-pop in
 * globals.css) so the count reads as arriving somewhere, not just stopping.
 *
 * The animated digits are aria-hidden; the outer span's aria-label carries
 * the real, final value at all times, so assistive tech and no-JS output
 * are never incorrect — only the decorative animation itself is skipped.
 *
 * prefers-reduced-motion is read via useSyncExternalStore (matching
 * ThemeProvider's own convention for this exact kind of browser-only,
 * SSR-unsafe media query read) and used to derive the displayed value
 * directly rather than as a setState call in an effect — this is a
 * JS-driven rAF loop, not a CSS transition/animation the sitewide
 * prefers-reduced-motion rule in globals.css already covers.
 */
export function CountUpStat({ value }: CountUpStatProps) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : "";

  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    readReducedMotion,
    getServerReducedMotion
  );
  const ref = useRef<HTMLSpanElement>(null);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    if (target === null || prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const finalValue = target;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          const eased = 1 - (1 - progress) ** 3;
          setAnimatedValue(Math.round(eased * finalValue));
          if (progress < 1) requestAnimationFrame(tick);
          else setHasFinished(true);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, prefersReducedMotion]);

  if (target === null) {
    return <span>{value}</span>;
  }

  const display = prefersReducedMotion ? target : animatedValue;

  return (
    <span aria-label={value}>
      <span aria-hidden="true" ref={ref} className={hasFinished ? "count-up-pop" : undefined}>
        {display}
        {suffix}
      </span>
    </span>
  );
}
