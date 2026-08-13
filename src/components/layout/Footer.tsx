import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import { LinkedInIcon, XIcon, YouTubeIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import { footerNav } from "@/lib/content/nav";
import { hrefToLinkKey, headingToKey } from "@/lib/nav-i18n";
import { site } from "@/lib/content/site";
import { Logo } from "./Logo";
import { FooterAccordionGroup } from "./FooterAccordionGroup";

const linkColumns = [
  { heading: "Company", links: footerNav.Company },
  { heading: "Solutions", links: footerNav.Solutions },
  { heading: "Resources", links: footerNav.Resources },
];

/** Secondary link groups kept accessible but visually minimal (bottom bar), not part of the reference's 5-column layout. Desktop/tablet only — see FooterAccordionGroup for the mobile equivalent. */
const secondaryGroups = [
  { heading: "Platform", links: footerNav.Platform },
  { heading: "Industries", links: footerNav.Industries },
  { heading: "Legal", links: footerNav.Legal },
];

/** All six nav groups, unified for the mobile accordion — the desktop split between the primary grid and the secondary bar is a visual-density choice that doesn't apply once everything collapses to headers. */
const allGroups = [...linkColumns, ...secondaryGroups];

export function Footer() {
  const t = useTranslations("common");
  const tContact = useTranslations("contact");
  const headingLabel = (heading: string) => {
    const key = headingToKey[heading];
    return key.startsWith("nav.") ? t(key) : t(`megaMenu.${key}`);
  };

  return (
    <footer className="bg-footer text-neutral-300 dark:text-white/70">
      {/*
        Bottom padding no longer needs to reserve clearance for
        MobileStickyCta (a fixed full-width bar on <lg viewports): that bar
        now retracts itself via an IntersectionObserver the instant the
        footer enters view (see MobileStickyCta.tsx), rather than relying
        on this padding to keep it clear of the copyright/credit line. A
        normal, uniform bottom padding is safe across every breakpoint.
      */}
      <div className="container-content pt-16 pb-10">
        {/*
          Mobile-only footer: always-visible branding/contact (same content
          as desktop, kept as separate markup rather than reflowed via
          responsive classes so the sm:+ grid below is provably untouched),
          plus all six nav groups collapsed into accordions — expanding
          only what a visitor actually wants, instead of a fully-unrolled
          desktop footer stacked into one long mobile column.
        */}
        <div className="sm:hidden">
          <Logo variant="light" />
          <p className="mt-3 max-w-xs text-sm leading-normal text-neutral-400 dark:text-white/55">{t("footer.poweredBy")}</p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={site.social.linkedin}
              aria-label={t("footer.linkedin", { name: site.name })}
              className="text-neutral-400 hover:text-primary-400 dark:text-white/55 dark:hover:text-primary-600"
            >
              <LinkedInIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href={site.social.x}
              aria-label={t("footer.x", { name: site.name })}
              className="text-neutral-400 hover:text-primary-400 dark:text-white/55 dark:hover:text-primary-600"
            >
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href={site.social.youtube}
              aria-label={t("footer.youtube", { name: site.name })}
              className="text-neutral-400 hover:text-primary-400 dark:text-white/55 dark:hover:text-primary-600"
            >
              <YouTubeIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-8">
            {allGroups.map((group) => (
              <FooterAccordionGroup
                key={group.heading}
                heading={headingLabel(group.heading)}
                links={group.links.map((link) => ({ href: link.href, label: t(`links.${hrefToLinkKey[link.href]}`) }))}
              />
            ))}
          </div>

          <div className="mt-8">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-400">
              {t("footer.contactUs")}
            </p>
            <ul className="space-y-3 text-sm text-neutral-400 dark:text-white/55">
              <li className="flex items-start gap-2">
                <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" strokeWidth={1.75} />
                <a
                  href={`mailto:${site.contact.email}`}
                  aria-label={t("footer.emailAria", { name: site.name, email: site.contact.email })}
                  dir="ltr"
                  className="hover:text-white"
                >
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <WhatsAppIcon aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" />
                <a
                  href={`https://wa.me/${site.contact.whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("footer.whatsappAria", { name: site.name, number: site.contact.whatsapp })}
                  dir="ltr"
                  className="hover:text-white"
                >
                  {site.contact.whatsapp}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" strokeWidth={1.75} />
                <a
                  href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}
                  aria-label={t("footer.callAria", { name: site.name, number: site.contact.phone })}
                  dir="ltr"
                  className="hover:text-white"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" strokeWidth={1.75} />
                <a
                  href={site.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("footer.addressAria", { name: site.name })}
                  className="hover:text-white"
                >
                  {tContact("address")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop/tablet footer — unchanged from before this directive. */}
        <div className="hidden gap-10 sm:grid sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo variant="light" />
            <p className="mt-3 max-w-xs text-sm leading-normal text-neutral-400 dark:text-white/55">{t("footer.poweredBy")}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={site.social.linkedin}
                aria-label={t("footer.linkedin", { name: site.name })}
                className="text-neutral-400 hover:text-primary-400 dark:text-white/55 dark:hover:text-primary-600"
              >
                <LinkedInIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={site.social.x}
                aria-label={t("footer.x", { name: site.name })}
                className="text-neutral-400 hover:text-primary-400 dark:text-white/55 dark:hover:text-primary-600"
              >
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={site.social.youtube}
                aria-label={t("footer.youtube", { name: site.name })}
                className="text-neutral-400 hover:text-primary-400 dark:text-white/55 dark:hover:text-primary-600"
              >
                <YouTubeIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {linkColumns.map((column) => (
            <nav key={column.heading} aria-label={headingLabel(column.heading)}>
              <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-400">
                {headingLabel(column.heading)}
              </p>
              <ul className="space-y-1">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="inline-block py-1 text-sm text-neutral-400 hover:text-white dark:text-white/55">
                      {t(`links.${hrefToLinkKey[link.href]}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-400">
              {t("footer.contactUs")}
            </p>
            <ul className="space-y-3 text-sm text-neutral-400 dark:text-white/55">
              <li className="flex items-start gap-2">
                <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" strokeWidth={1.75} />
                <a
                  href={`mailto:${site.contact.email}`}
                  aria-label={t("footer.emailAria", { name: site.name, email: site.contact.email })}
                  dir="ltr"
                  className="hover:text-white"
                >
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <WhatsAppIcon aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" />
                <a
                  href={`https://wa.me/${site.contact.whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("footer.whatsappAria", { name: site.name, number: site.contact.whatsapp })}
                  dir="ltr"
                  className="hover:text-white"
                >
                  {site.contact.whatsapp}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" strokeWidth={1.75} />
                <a
                  href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}
                  aria-label={t("footer.callAria", { name: site.name, number: site.contact.phone })}
                  dir="ltr"
                  className="hover:text-white"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" strokeWidth={1.75} />
                <a
                  href={site.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("footer.addressAria", { name: site.name })}
                  className="hover:text-white"
                >
                  {tContact("address")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          {/* Desktop/tablet only — mobile gets these same three groups via the accordion above. */}
          <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8 sm:gap-y-3">
            {secondaryGroups.map((group) => (
              <nav key={group.heading} aria-label={headingLabel(group.heading)}>
                <span className="me-2 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-white/55">
                  {headingLabel(group.heading)}:
                </span>
                {group.links.map((link, index) => (
                  <span key={link.href}>
                    <Link href={link.href} className="text-xs text-neutral-400 hover:text-primary-300 dark:text-white/55 dark:hover:text-primary-600">
                      {t(`links.${hrefToLinkKey[link.href]}`)}
                    </Link>
                    {index < group.links.length - 1 ? <span className="mx-1.5 text-neutral-600 dark:text-white/30">&middot;</span> : null}
                  </span>
                ))}
              </nav>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-neutral-400 dark:text-white/55">
            <p>
              &copy; {new Date().getFullYear()} {site.name}. {t("footer.allRightsReserved")}
            </p>
            <p>
              {t.rich("footer.credit", {
                zyntra: (chunks) => (
                  <a
                    href="https://zyntra.ltd/en/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-neutral-300 hover:text-primary-300 dark:text-white/70 dark:hover:text-primary-600"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
