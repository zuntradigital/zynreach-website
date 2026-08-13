"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const SHOW_AFTER_SCROLL = 320;

export function MobileStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  // The footer renders its own navigation plus legally-required links
  // (Privacy/Terms/Cookies, under "Legal"). This bar is opaque and always
  // pinned to the bottom 76px of the viewport, so once any part of the
  // footer scrolls into that band it's genuinely covered — not just
  // visually, but for hit-testing too, since the bar sits above it in
  // paint order. No amount of footer padding can fix that in general:
  // any element passes through the bar's band transiently as it scrolls
  // into view regardless of what comes after it (the transition point is
  // fixed by the bar's own height, not by surrounding spacing) — the only
  // way to guarantee footer content is never covered is for the bar to
  // step aside once the footer is the thing on screen.
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > SHOW_AFTER_SCROLL);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    // Default threshold (0) + no rootMargin: fires as soon as the footer's
    // first pixel enters the viewport, so the bar has already retracted
    // (translate-y-full, ~200ms) before any footer content reaches the
    // bottom 76px band it would otherwise cover.
    const observer = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !footerInView;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-3 pt-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-200 ease-out-default lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <Button href="/demo" variant="primary" size="lg" className="w-full" tabIndex={visible ? 0 : -1}>
        Book a Demo
      </Button>
    </div>
  );
}
