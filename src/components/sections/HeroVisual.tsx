import { getTranslations } from "next-intl/server";
import { LayoutDashboard, Users, Sparkles, Workflow, BarChart3, Settings2 } from "lucide-react";

const TILES = [
  { key: "dashboard", Icon: LayoutDashboard },
  { key: "crm", Icon: Users },
  { key: "ai", Icon: Sparkles },
  { key: "automation", Icon: Workflow },
  { key: "analytics", Icon: BarChart3 },
  { key: "operations", Icon: Settings2 },
] as const;

/**
 * Home Hero Product Visualization (SRS "Product Mockup containing:
 * Dashboard, CRM, AI, Automation, Analytics, Operations"). A stylized
 * browser-window mockup rather than a real product screenshot — this repo
 * has no actual ZynReach app screens to capture, so the mockup represents
 * the six pillars as labeled tiles instead of fabricating fake UI detail
 * that would misrepresent the real product.
 *
 * Ambient motion: an outer wrapper floats up/down (CSS,
 * .hero-dashboard-float) and the glow behind it breathes independently
 * (.hero-dashboard-glow). The six tiles fade/rise in with a staggered
 * delay on first paint. The panel itself is never rotated/tilted — no
 * static rotate class, no mouse-driven 3D tilt — so it always reads as
 * perfectly straight. Every animation here is covered by the sitewide
 * prefers-reduced-motion rule in globals.css (collapses to an instant,
 * static resting state).
 */
export async function HeroVisual() {
  const t = await getTranslations("home.hero.visual");

  return (
    <div role="img" aria-label={t("ariaLabel")} className="relative mx-auto w-full max-w-md">
      <div
        aria-hidden="true"
        className="hero-dashboard-glow absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(230,198,122,0.45)_0%,rgba(200,155,60,0.16)_45%,transparent_72%)] blur-2xl"
      />

      <div className="hero-dashboard-float">
        <div className="relative rounded-2xl border border-neutral-200 bg-white dark:bg-neutral-100 shadow-[0_30px_80px_rgba(200,155,60,0.25)]">
          <div className="flex items-center gap-2 rounded-t-2xl border-b border-neutral-100 bg-neutral-50 px-4 py-3">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-error/60" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-warning/60" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-success/60" />
            <span aria-hidden="true" className="ms-2 truncate rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-medium text-neutral-500">
              app.zynreach.com
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-5">
            {TILES.map(({ key, Icon }, index) => (
              <div
                key={key}
                className="hero-dashboard-tile rounded-xl border border-neutral-100 bg-neutral-50 p-3 sm:p-4"
                style={{ animationDelay: `${200 + index * 90}ms` }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                  <Icon aria-hidden="true" className="h-4 w-4 text-primary-600" strokeWidth={1.75} />
                </div>
                <p className="mt-2.5 text-xs font-semibold text-neutral-800 sm:text-sm">{t(`tiles.${key}`)}</p>
                <div className="mt-2 flex items-end gap-0.5" aria-hidden="true">
                  {[40, 65, 50, 80, 60].map((height, i) => (
                    <span key={i} className="w-1.5 rounded-full bg-primary-200" style={{ height: `${height * 0.14}px` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
