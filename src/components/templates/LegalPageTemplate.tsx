import { getTranslations } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { LegalPageContent } from "@/types/content";

interface LegalPageTemplateProps {
  content: LegalPageContent;
}

/** Shared template for the 4 Legal pages (SRS Section 7.20). */
export async function LegalPageTemplate({ content }: LegalPageTemplateProps) {
  const t = await getTranslations(`legalPage.docs.${content.slug}`);
  const tLegal = await getTranslations("legalPage");

  const title = t("title");
  const navLabel = t("navLabel");
  const translatedSections = t.raw("sections") as { heading: string; body: string[] }[];
  const sections = content.sections.map((section, index) => ({
    ...section,
    heading: translatedSections[index].heading,
    body: translatedSections[index].body,
  }));

  return (
    <>
      <NavigationBar />
      <main id="main-content" className="flex-1 bg-white dark:bg-neutral-100">
        <div className="container-content py-16">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: navLabel, href: `/legal/${content.slug}` },
            ]}
            className="text-neutral-500"
          />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-neutral-500">
            {tLegal("effectiveVersion", { date: content.effectiveDate, version: content.version })}
          </p>

          <div className="mt-12 grid gap-12 lg:grid-cols-[240px_1fr]">
            <nav aria-label={tLegal("tocAriaLabel")} className="hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{tLegal("tocHeading")}</p>
              <ul className="mt-3 space-y-2 border-s border-neutral-200 ps-4">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-sm text-neutral-600 hover:text-primary-600">
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="max-w-2xl space-y-10">
              {sections.map((section) => (
                <section key={section.id} id={section.id}>
                  <h2 className="text-xl font-semibold text-neutral-900">{section.heading}</h2>
                  <div className="mt-3 space-y-3">
                    {section.body.map((paragraph, index) => (
                      <p key={index} className="text-sm leading-normal text-neutral-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                <p className="text-sm text-neutral-600">
                  {tLegal("contactNotePrefix")}
                  <a href="mailto:privacy@zynreach.com" className="font-medium text-primary-600 hover:text-primary-700">
                    privacy@zynreach.com
                  </a>
                  {tLegal("contactNoteSuffix")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
