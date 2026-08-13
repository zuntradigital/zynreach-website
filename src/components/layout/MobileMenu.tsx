"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
import { primaryNav } from "@/lib/content/nav";
import { site } from "@/lib/content/site";
import { hrefToLinkKey, topNavKey } from "@/lib/nav-i18n";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations("common");
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div
      id="mobile-menu"
      className={`fixed inset-x-0 top-[var(--nav-height)] bottom-0 z-40 overflow-y-auto bg-white dark:bg-neutral-50 lg:hidden ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="container-content flex flex-col gap-1 py-4">
        {primaryNav.map((item) => {
          if (item.type === "link") {
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="rounded-md px-3 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-50"
              >
                {t(`nav.${topNavKey[item.label]}`)}
              </Link>
            );
          }

          const isExpanded = expanded === item.label;
          const panelId = `mobile-panel-${item.label.toLowerCase()}`;
          const links = item.type === "mega" ? item.columns.flatMap((c) => c.links) : item.links;

          return (
            <div key={item.label} className="border-b border-neutral-100">
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => setExpanded(isExpanded ? null : item.label)}
                className="flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-50"
              >
                {t(`nav.${topNavKey[item.label]}`)}
                <ChevronDown
                  aria-hidden="true"
                  className={`h-5 w-5 transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
              <div id={panelId} hidden={!isExpanded} className="flex flex-col gap-1 px-3 pb-3">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-primary-600"
                  >
                    {t(`links.${hrefToLinkKey[link.href]}`)}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        <Link
          href={site.loginUrl}
          onClick={onClose}
          className="rounded-md px-3 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-50"
        >
          {t("nav.login")}
        </Link>

        <div className="mt-2 flex items-center justify-between rounded-md px-3 py-2">
          <LanguageSwitcher variant="dark" />
          <ThemeToggle variant="dark" />
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <Button href="/demo" variant="primary" size="lg" onClick={onClose}>
            {t("cta.bookDemo")}
          </Button>
          <Button href="/trial" variant="secondary" size="lg" onClick={onClose}>
            {t("cta.startFreeTrial")}
          </Button>
        </div>
      </div>
    </div>
  );
}
