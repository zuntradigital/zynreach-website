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
  "/platform/sales-pipeline": "salesPipeline",
  "/platform/campaigns": "campaigns",
  "/platform/contact-360": "contact360",
  "/platform/business-data": "businessData",
  "/platform/ai-workspace": "aiWorkspace",
  "/platform/ai-agents": "aiAgents",
  "/platform/ai-insights": "aiInsights",
  "/platform/automation-center": "automationCenter",
  "/platform/reports": "reports",
  "/platform/business-intelligence": "businessIntelligence",
  "/platform/executive-dashboards": "executiveDashboards",
  "/platform/scheduled-reports": "scheduledReports",
  "/platform/project-management": "projectManagement",
  "/platform/task-management": "taskManagement",
  "/platform/hr-management": "hrManagement",
  "/platform/attendance-leave": "attendanceLeave",
  "/platform/teams-departments": "teamsDepartments",
  "/platform/finance-accounting": "financeAccounting",
  "/platform/document-center": "documentCenter",
  "/platform/customer-portal": "customerPortal",
  "/platform/subscription-billing": "subscriptionBilling",
  "/platform/notifications": "notifications",
  "/platform/marketplace": "marketplace",
  "/platform/plugin-sdk": "pluginSdk",
  "/platform/organization-management": "organizationManagement",
  "/platform/branch-management": "branchManagement",
  "/platform/audit": "audit",
  "/integrations": "viewAllIntegrations",
  "/solutions/sales": "forSalesTeams",
  "/solutions/marketing": "forMarketingTeams",
  "/solutions/agencies": "forAgencies",
  "/solutions/smb": "forStartupsSmbs",
  "/solutions/enterprise": "forEnterprise",
  "/solutions/growing-business": "forGrowingBusinesses",
  "/solutions/mid-market": "forMidMarket",
  "/solutions/operations": "forOperationsTeams",
  "/solutions/hr": "forHrTeams",
  "/solutions/finance": "forFinanceTeams",
  "/solutions/management": "forManagementExecutives",
  "/solutions/customer-success": "forCustomerSuccessTeams",
  "/solutions/growth": "growth",
  "/solutions/automation": "automation",
  "/solutions/customer-management": "customerManagement",
  "/solutions/operations-need": "operationsNeed",
  "/solutions/intelligence": "intelligence",
  "/solutions/enterprise-governance": "enterpriseGovernance",
  "/industries/healthcare": "healthcare",
  "/industries/education": "education",
  "/industries/real-estate": "realEstate",
  "/industries/automotive": "automotive",
  "/industries/manufacturing": "manufacturing",
  "/blog": "blog",
  "/customer-stories": "customerStories",
  "/guides-templates": "guidesTemplates",
  "/webinars": "webinars",
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
  Product: "platform",
  Solutions: "solutions",
  Industries: "industries",
  Pricing: "pricing",
  Enterprise: "enterprise",
  Security: "security",
  "Knowledge Center": "knowledgeCenter",
  Company: "company",
};

export const promoToKey: Record<string, { eyebrow: string; headline: string }> = {
  "Product tour": { eyebrow: "productTour", headline: "seeUnifiedPlatform" },
  "Knowledge Center": { eyebrow: "knowledgeCenterEyebrow", headline: "exploreKnowledgeCenter" },
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
  Education: "education",
  Automotive: "automotive",
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
  "Growth & Revenue": "growthRevenue",
  "AI & Automation": "aiAutomation",
  Operations: "operations",
  Intelligence: "intelligence",
  "Customer & Commerce": "customerCommerce",
  "Enterprise Platform": "enterprisePlatform",
  "By Team": "byTeam",
  "By Business Size": "byBusinessSize",
  "By Business Need": "byBusinessNeed",
  Explore: "explore",
  Product: "nav.platform",
  Solutions: "nav.solutions",
  Industries: "nav.industries",
  "Knowledge Center": "nav.knowledgeCenter",
  Company: "nav.company",
  Legal: "nav.legal",
};
