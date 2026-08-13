import { useTranslations } from "next-intl";
import { logoCloud } from "@/lib/content/home";

/**
 * Trust logo strip. Uses ZynReach's existing fictional customer names
 * (not real companies) — the reference mockup shows real brand names
 * (Microsoft, AWS, Oracle, etc.), but reproducing those here would
 * falsely imply ZynReach has actual partnerships with those companies.
 * The visual treatment (monochrome, equal sizing, opacity fade-in on
 * hover) is reproduced; the specific brand identities are not.
 */
interface LogoCloudProps {
  /** Tighter vertical padding for the Home page's denser section rhythm — every other caller keeps the original py-20. */
  compact?: boolean;
}

export function LogoCloud({ compact = false }: LogoCloudProps) {
  const t = useTranslations("home");
  return (
    <section aria-label={t("trustedBy")} className={`bg-neutral-50 ${compact ? "py-16" : "py-20"}`}>
      <div className="container-content">
        <div className="flex items-center gap-4">
          <span className="hidden h-px flex-1 bg-neutral-200 sm:block" />
          <p className="text-center text-xs font-semibold tracking-[0.15em] text-neutral-500 uppercase">
            {t("trustedBy")}
          </p>
          <span className="hidden h-px flex-1 bg-neutral-200 sm:block" />
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
          {logoCloud.map((logo) => (
            <li
              key={logo.name}
              className="flex items-center justify-center text-center text-sm font-semibold text-neutral-700 opacity-75 grayscale transition-opacity duration-300 hover:opacity-100"
              title={logo.name}
            >
              {logo.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
