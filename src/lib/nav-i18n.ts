/**
 * Maps the stable hrefs/headings already in src/lib/content/nav.ts to
 * messages/{locale}.json keys under common.links / common.megaMenu, so the
 * nav/footer content data doesn't need restructuring — English label text
 * in nav.ts is now a dev-reference fallback only, the rendered text always
 * comes from the translation dictionary via these lookups.
 */
export const hrefToLinkKey: Record<string, string> = {
  "/platform/ai-assistants": "aiAssistants",
  "/platform/crm": "crm",
  "/platform/marketing-automation": "marketingAutomation",
  "/platform/lead-generation": "leadGeneration",
  "/platform/workflow-automation": "workflowAutomation",
  "/platform/analytics": "analytics",
  "/integrations": "viewAllIntegrations",
  "/solutions/sales": "forSalesTeams",
  "/solutions/marketing": "forMarketingTeams",
  "/solutions/agencies": "forAgencies",
  "/solutions/smb": "forStartupsSmbs",
  "/solutions/enterprise": "forEnterprise",
  "/industries/healthcare": "healthcare",
  "/industries/education": "education",
  "/industries/real-estate": "realEstate",
  "/industries/automotive": "automotive",
  "/industries/manufacturing": "manufacturing",
  "/blog": "blog",
  "/customers": "customerStories",
  "/docs": "documentation",
  "/docs/api": "apiReference",
  "/resources/guides": "guidesTemplates",
  "/resources/webinars": "webinars",
  "/faq": "faq",
  "/changelog": "changelog",
  "/status": "status",
  "/about": "about",
  "/careers": "careers",
  "/contact": "contact",
  "/security": "security",
  "/compliance": "compliance",
  "/partners": "partners",
  "/legal/privacy": "privacyPolicy",
  "/legal/terms": "termsOfService",
  "/legal/cookies": "cookiePolicy",
  "/legal/dpa": "dpa",
};

export const topNavKey: Record<string, string> = {
  Platform: "platform",
  Solutions: "solutions",
  Industries: "industries",
  Pricing: "pricing",
  Resources: "resources",
};

export const promoToKey: Record<string, { eyebrow: string; headline: string }> = {
  "Product tour": { eyebrow: "productTour", headline: "seeUnifiedPlatform" },
  "Resources hub": { eyebrow: "resourcesHub", headline: "browseEverything" },
};

/** Maps the raw English integration-category strings stored in content-data files (solutions.ts, capabilities.ts) to common.integrationCategories keys. */
export const categoryToKey: Record<string, string> = {
  "Email & Calendar": "emailCalendar",
  "Billing & Payments": "billingPayments",
  "Support & Helpdesk": "supportHelpdesk",
  "Analytics & BI": "analyticsBi",
  Collaboration: "collaboration",
  "Developer & API": "developerApi",
  "CRM Data": "crmData",
  "Call Recording": "callRecording",
};

/** Maps raw English industry strings stored in customer-stories.ts to common.links keys. */
export const industryToLinkKey: Record<string, string> = {
  Manufacturing: "manufacturing",
  Healthcare: "healthcare",
  "Real Estate": "realEstate",
};

/** Maps raw English product-area strings stored in customer-stories.ts to common.links keys. */
export const productAreaToLinkKey: Record<string, string> = {
  CRM: "crm",
  "Marketing Automation": "marketingAutomation",
  "Lead Generation": "leadGeneration",
  Analytics: "analytics",
};

export const headingToKey: Record<string, string> = {
  Capabilities: "capabilities",
  Integrations: "integrations",
  "By team": "byTeam",
  "By company size": "byCompanySize",
  Learn: "learn",
  Build: "build",
  Platform: "nav.platform",
  Solutions: "nav.solutions",
  Industries: "nav.industries",
  Resources: "nav.resources",
  Company: "nav.company",
  Legal: "nav.legal",
};
