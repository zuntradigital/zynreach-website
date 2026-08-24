import { captureIntegrationCall } from "@/lib/monitoring";

/**
 * Read path into System B's Global Website Settings module (SRS §22).
 * Every component that used to read a hardcoded value out of
 * src/lib/content/site.ts / nav.ts (Footer, Contact page, structured
 * data, the cookie banner, root metadata) should read it from here
 * instead, so a change made in the Dashboard's Settings screen actually
 * reaches the live site — see this module's own settings-groups.ts
 * comment on the admin side for why every field here is safe to expose
 * publicly. Degrades gracefully (returns null) exactly like
 * cms-content.ts/blog-content.ts when the two env vars aren't set, so
 * this app keeps working standalone with its existing hardcoded
 * fallbacks in any environment where System B isn't reachable.
 */

export interface SiteIdentitySettings {
  siteName?: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface ContactSettings {
  supportEmail?: string;
  salesEmail?: string;
  phone?: string;
  mailingAddress?: string;
}

export interface SocialSettings {
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface SeoDefaultSettings {
  titleSuffix?: string;
  defaultMetaDescription?: string;
  defaultOgImageUrl?: string;
  defaultOrgStructuredData?: string;
}

export interface AnalyticsSettings {
  ga4MeasurementId?: string;
  gtmContainerId?: string;
  clarityProjectId?: string;
  metaPixelId?: string;
  linkedinInsightTagId?: string;
}

export interface LegalLinkSettings {
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  cookiePolicyUrl?: string;
  dpaUrl?: string;
}

export interface FooterSettings {
  showPlatformColumn?: boolean;
  showSolutionsColumn?: boolean;
  showIndustriesColumn?: boolean;
  showResourcesColumn?: boolean;
  showCompanyColumn?: boolean;
  showLegalColumn?: boolean;
  trustBadges?: string[];
}

/** Dashboard-managed top-level primary-nav visibility (CMS Navigation
 * Management) — same shape/convention as FooterSettings' column toggles
 * above. Keys match src/lib/content/nav.ts's primaryNav item labels, not
 * arbitrary new identifiers, so a toggle here maps onto an existing,
 * already-structured nav item rather than any new nav concept. */
export interface NavigationSettings {
  showPlatformNav?: boolean;
  showSolutionsNav?: boolean;
  showIndustriesNav?: boolean;
  showPricingNav?: boolean;
  showKnowledgeCenterNav?: boolean;
  showCompanyNav?: boolean;
}

export interface MaintenanceModeSettings {
  enabled?: boolean;
  reason?: string;
}

export interface ConsentSettings {
  essentialDefault?: boolean;
  analyticsDefault?: boolean;
  advertisingDefault?: boolean;
  functionalDefault?: boolean;
  bannerCopy?: string;
}

export interface SiteSettings {
  identity: SiteIdentitySettings;
  contact: ContactSettings;
  social: SocialSettings;
  seo: SeoDefaultSettings;
  analytics: AnalyticsSettings;
  legal: LegalLinkSettings;
  footer: FooterSettings;
  navigation: NavigationSettings;
  maintenanceMode: MaintenanceModeSettings;
  consent: ConsentSettings;
}

export interface AnnouncementBanner {
  id: string;
  message: string;
  link: string | null;
  dismissible: boolean;
  targetZone: string;
}

export interface SiteSettingsPayload {
  settings: SiteSettings;
  banners: AnnouncementBanner[];
}

export async function getSiteSettings(): Promise<SiteSettingsPayload | null> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-settings", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/settings`, {
      headers: { Authorization: `Bearer ${token}` },
      // Unlike blog/cms/pricing (revalidate: 0 — the primary content of a
      // specific page, must be immediately fresh), this is read by shared
      // global chrome — Footer and the root layout render on nearly every
      // page — so revalidate: 0 would force the *entire* site out of
      // static generation into full per-request SSR just to catch a
      // contact-email or social-link edit. A 60s ISR window still
      // satisfies "changes reach the website automatically" (SRS §22)
      // without that blast radius; Settings values change far less often
      // than content does.
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-settings", "failure");
      return null;
    }

    const data = (await res.json()) as SiteSettingsPayload;
    captureIntegrationCall("zynreach-admin-settings", "success");
    return data;
  } catch {
    captureIntegrationCall("zynreach-admin-settings", "failure");
    return null;
  }
}
