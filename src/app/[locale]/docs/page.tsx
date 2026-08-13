import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { docArticles } from "@/lib/content/docs";

export default async function DocsIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  redirect({ href: `/docs/${docArticles[0].slug}`, locale });
}
