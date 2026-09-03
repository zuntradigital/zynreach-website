import type { SolutionPageContent } from "@/types/content";

/**
 * Solutions sub-page content (SRS Section 7.8). CTA per persona follows
 * SRS 7.8 exactly: Demo for Enterprise/Agencies, Trial for
 * Startups/SMBs/Sales/Marketing, with "Talk to sales" always present
 * as the secondary fallback.
 */
export const solutionPages: SolutionPageContent[] = [
  {
    slug: "sales",
    navLabel: "For Sales Teams",
    meta: {
      h1: "Give your sales team a CRM that updates itself",
      title: "ZynReach for Sales Teams",
      description: "AI-assisted data entry and full pipeline visibility so reps spend time selling, not logging activity.",
    },
    hero: {
      headline: "Give your sales team a CRM that updates itself",
      subhead:
        "Full pipeline visibility without the manual upkeep — activity logs itself, and AI flags what needs attention.",
    },
    primaryCta: { label: "Start Free Trial", href: "/trial" },
    before: {
      label: "Before ZynReach",
      body: "Reps spend hours a week logging calls and emails instead of selling. Pipeline data is stale by the time forecast meetings happen.",
    },
    after: {
      label: "With ZynReach",
      body: "Activity logs itself. AI drafts follow-ups and flags at-risk deals. Forecasts reflect real engagement, not guesswork.",
    },
    capabilityCallouts: [
      { label: "CRM", href: "/platform/crm", description: "A CRM that updates itself as reps work." },
      { label: "AI Assistants", href: "/platform/ai-assistants", description: "AI drafts follow-ups and flags risk." },
      { label: "Analytics", href: "/platform/analytics", description: "Real-time pipeline and forecast visibility." },
    ],
    howItWorks: [
      { headline: "Connect email & calendar", description: "Activity starts logging itself from day one." },
      { headline: "AI scores and flags deals", description: "Reps see what needs attention without digging for it." },
      { headline: "Work one live pipeline", description: "Forecasts reflect real engagement, not stale updates." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Email & Calendar", "Collaboration", "Analytics & BI"],
  },
  {
    slug: "marketing",
    navLabel: "For Marketing Teams",
    meta: {
      h1: "Campaign automation with attribution you can trust",
      title: "ZynReach for Marketing Teams",
      description: "Marketing Automation and Analytics feature proof, with an integration list built for demand gen.",
    },
    hero: {
      headline: "Campaign automation with attribution you can trust",
      subhead: "One data model connects email, forms, and analytics — so attribution reporting matches what actually happened.",
    },
    primaryCta: { label: "Start Free Trial", href: "/trial" },
    before: {
      label: "Before ZynReach",
      body: "Your email tool, ad platform, and CRM don't talk to each other. Attribution means reconciling exports by hand every month.",
    },
    after: {
      label: "With ZynReach",
      body: "One data model connects campaigns to pipeline. Lead scoring and attribution reflect what actually happened.",
    },
    capabilityCallouts: [
      { label: "Marketing Automation", href: "/platform/marketing-automation", description: "Campaigns and nurture that run themselves." },
      { label: "Lead Generation", href: "/platform/lead-generation", description: "AI qualification built into your CRM." },
      { label: "Analytics", href: "/platform/analytics", description: "Attribution across every channel, in one place." },
    ],
    howItWorks: [
      { headline: "Connect campaigns to CRM", description: "Email, forms, and pipeline share one data model." },
      { headline: "Automation scores and nurtures", description: "Leads are scored and nurtured off real behavior." },
      { headline: "Attribution reports itself", description: "Reporting matches what actually happened, not an export." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Email & Calendar", "Analytics & BI", "Developer & API"],
  },
  {
    slug: "agencies",
    navLabel: "For Agencies",
    meta: {
      h1: "Manage every client account from one dashboard",
      title: "ZynReach for Agencies",
      description: "Multi-workspace support and partner terms built for agencies managing multiple client accounts.",
    },
    hero: {
      headline: "Manage every client account from one dashboard",
      subhead: "One workspace per client, white-label reporting, and margin protection built in from day one.",
    },
    primaryCta: { label: "Book a Demo", href: "/demo" },
    before: {
      label: "Before ZynReach",
      body: "Per-client tool costs stack up fast, and client reporting means exporting from five different platforms every month.",
    },
    after: {
      label: "With ZynReach",
      body: "One workspace per client, white-label reporting, and a single bill — reporting overhead drops to near zero.",
    },
    capabilityCallouts: [
      { label: "CRM", href: "/platform/crm", description: "Separate pipelines per client, one login." },
      { label: "Marketing Automation", href: "/platform/marketing-automation", description: "Run client campaigns from one place." },
      { label: "Analytics", href: "/platform/analytics", description: "White-label reporting your clients can see." },
    ],
    howItWorks: [
      { headline: "Spin up a workspace per client", description: "Each account gets its own pipeline and campaigns." },
      { headline: "Run client work from one login", description: "Manage every account without switching platforms." },
      { headline: "Report from one white-label dashboard", description: "Client reporting stops meaning five separate exports." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Billing & Payments", "Collaboration", "Analytics & BI"],
  },
  {
    slug: "operations",
    navLabel: "For Operations Teams",
    meta: {
      h1: "Process visibility across every department, in one place",
      title: "ZynReach for Operations Teams",
      description: "Task and project tracking, workflow automation, and cross-department visibility for the people who keep the business running.",
    },
    hero: {
      headline: "Process visibility across every department, in one place",
      subhead: "See every process, task, and handoff across departments — and automate the ones that shouldn't need a human.",
    },
    primaryCta: { label: "Start Free Trial", href: "/trial" },
    before: {
      label: "Before ZynReach",
      body: "Projects live in one tool, tasks in another, and half of what's actually happening is tracked nowhere — status updates mean chasing five people.",
    },
    after: {
      label: "With ZynReach",
      body: "One view of every project, task, and workflow across departments, with automation handling the repetitive handoffs.",
    },
    capabilityCallouts: [
      { label: "Project Management", href: "/platform/project-management", description: "Every project and its status, in one view." },
      { label: "Task Management", href: "/platform/task-management", description: "Tasks assigned, tracked, and never lost." },
      { label: "Workflow Automation", href: "/platform/workflow-automation", description: "Automate handoffs between departments." },
    ],
    howItWorks: [
      { headline: "Track every project and task", description: "One view replaces status updates chased by hand." },
      { headline: "Automate department handoffs", description: "Work moves between teams without a manual trigger." },
      { headline: "See status without chasing", description: "Progress is visible in real time, for every process." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Collaboration", "Analytics & BI", "Developer & API"],
  },
  {
    slug: "hr",
    navLabel: "For HR Teams",
    meta: {
      h1: "HR functions unified with the rest of your business",
      title: "ZynReach for HR Teams",
      description: "Employee records, attendance, and leave management connected to the same platform as sales, operations, and finance.",
    },
    hero: {
      headline: "HR functions unified with the rest of your business",
      subhead:
        "Not a replacement for a dedicated HR system — HR data unified with the rest of the business, so people decisions use the same source of truth as everything else.",
    },
    primaryCta: { label: "Book a Demo", href: "/demo" },
    before: {
      label: "Before ZynReach",
      body: "Employee records live in one system, attendance in a spreadsheet, and neither connects to the operational data HR decisions actually depend on.",
    },
    after: {
      label: "With ZynReach",
      body: "Employee records, attendance, and leave sit alongside the rest of your business data — one platform, one source of truth.",
    },
    capabilityCallouts: [
      { label: "HR Management", href: "/platform/hr-management", description: "Employee records in the same system as the rest of the business." },
      { label: "Attendance & Leave", href: "/platform/attendance-leave", description: "Attendance and leave tracked without spreadsheets." },
      { label: "Teams & Departments", href: "/platform/teams-departments", description: "Org structure that reflects how you're actually organized." },
    ],
    howItWorks: [
      { headline: "Centralize employee records", description: "Profiles live alongside the rest of your business data." },
      { headline: "Track attendance and leave", description: "No more reconciling a spreadsheet against payroll." },
      { headline: "Connect HR to the business", description: "People decisions use the same source of truth as everything else." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Collaboration", "Support & Helpdesk", "Analytics & BI"],
  },
  {
    slug: "finance",
    navLabel: "For Finance Teams",
    meta: {
      h1: "Finance connected to the operational data that drives it",
      title: "ZynReach for Finance Teams",
      description: "Invoices, payments, expenses, and financial reporting connected to the CRM and operations data that drives them.",
    },
    hero: {
      headline: "Finance connected to the operational data that drives it",
      subhead:
        "Not a replacement for a dedicated accounting product — finance unified with the CRM and operations data that actually drives the numbers.",
    },
    primaryCta: { label: "Book a Demo", href: "/demo" },
    before: {
      label: "Before ZynReach",
      body: "Finance runs in a separate system from sales and operations, so every report starts with reconciling exports and chasing context nobody documented.",
    },
    after: {
      label: "With ZynReach",
      body: "Invoices, payments, and expenses connect directly to the deals and operations that generated them — reporting reflects the business as it actually runs.",
    },
    capabilityCallouts: [
      { label: "Finance & Accounting", href: "/platform/finance-accounting", description: "Invoices, payments, and expenses in one place." },
      { label: "Subscription & Billing", href: "/platform/subscription-billing", description: "Billing connected directly to the customer record." },
      { label: "Business Intelligence", href: "/platform/business-intelligence", description: "Financial reporting tied to operational data." },
    ],
    howItWorks: [
      { headline: "Connect invoices to CRM data", description: "Billing links directly to the deals that generated it." },
      { headline: "Automate reconciliation", description: "Stop rebuilding context every report starts from scratch." },
      { headline: "Report on the real numbers", description: "Financials reflect the business as it actually runs." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Billing & Payments", "Analytics & BI", "CRM Data"],
  },
  {
    slug: "management",
    navLabel: "For Management & Executives",
    meta: {
      h1: "Pipeline, operations, and finance in one view",
      title: "ZynReach for Management & Executives",
      description: "Cross-functional visibility for leadership — pipeline, operations, finance, and team performance without reconciling five systems.",
    },
    hero: {
      headline: "Pipeline, operations, and finance in one view",
      subhead: "Stop reconciling reports from five systems — see pipeline, operations, finance, and team performance in one place.",
    },
    primaryCta: { label: "Book a Demo", href: "/demo" },
    before: {
      label: "Before ZynReach",
      body: "Every leadership meeting starts with reconciling numbers from sales, finance, and ops tools that don't agree with each other.",
    },
    after: {
      label: "With ZynReach",
      body: "Executive dashboards pull from the same data every team works in — one number, everywhere, all the time.",
    },
    capabilityCallouts: [
      { label: "Executive Dashboards", href: "/platform/executive-dashboards", description: "Cross-functional visibility in one dashboard." },
      { label: "Business Intelligence", href: "/platform/business-intelligence", description: "Pipeline, operations, and finance, reconciled." },
      { label: "Reports", href: "/platform/reports", description: "Reporting that doesn't require a spreadsheet." },
    ],
    howItWorks: [
      { headline: "Pull pipeline, ops, and finance together", description: "One data model replaces five disagreeing systems." },
      { headline: "Build role-specific dashboards", description: "Every leader sees the numbers relevant to their function." },
      { headline: "Decide from one trusted number", description: "Meetings start with alignment, not reconciliation." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Analytics & BI", "Collaboration", "CRM Data"],
  },
  {
    slug: "customer-success",
    navLabel: "For Customer Success Teams",
    meta: {
      h1: "The full customer view your post-sale team needs",
      title: "ZynReach for Customer Success Teams",
      description: "CRM history, support tickets, and billing in one customer record — built to reduce churn, not chase it.",
    },
    hero: {
      headline: "The full customer view your post-sale team needs",
      subhead: "CRM history, support tickets, and billing status in one record — so every conversation starts with full context, not a scramble.",
    },
    primaryCta: { label: "Start Free Trial", href: "/trial" },
    before: {
      label: "Before ZynReach",
      body: "CS reps piece together account history from the CRM, support tickets from a helpdesk, and billing status from finance — before every call.",
    },
    after: {
      label: "With ZynReach",
      body: "One customer record holds CRM history, tickets, and billing — reps walk into every conversation with full context already loaded.",
    },
    capabilityCallouts: [
      { label: "Contact 360", href: "/platform/contact-360", description: "Every customer interaction, in one record." },
      { label: "Customer Portal", href: "/platform/customer-portal", description: "A self-serve portal that cuts ticket volume." },
      { label: "Reports", href: "/platform/reports", description: "Health scores and churn signals, always in view." },
    ],
    howItWorks: [
      { headline: "Unify CRM, tickets, and billing", description: "One customer record replaces three separate lookups." },
      { headline: "Give reps full context", description: "Every conversation starts with history already loaded." },
      { headline: "Track health and churn signals", description: "At-risk accounts surface before they escalate." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Support & Helpdesk", "CRM Data", "Billing & Payments"],
  },
  {
    slug: "growth",
    navLabel: "Growth",
    meta: {
      h1: "Everything that turns pipeline into revenue, connected",
      title: "ZynReach for Growth",
      description: "CRM, lead generation, and marketing automation working from the same data — built to acquire and convert more customers.",
    },
    hero: {
      headline: "Everything that turns pipeline into revenue, connected",
      subhead:
        "Acquiring and converting more customers takes more than one tool — CRM, lead generation, and marketing automation working together, not in separate tabs.",
    },
    primaryCta: { label: "Start Free Trial", href: "/trial" },
    before: {
      label: "Before ZynReach",
      body: "Lead generation, marketing, and sales pipeline live in separate tools that don't share data — growth initiatives stall on the handoffs between them.",
    },
    after: {
      label: "With ZynReach",
      body: "One data model connects lead generation, campaigns, and pipeline — every growth motion feeds the same system, and the same forecast.",
    },
    capabilityCallouts: [
      { label: "Lead Generation", href: "/platform/lead-generation", description: "AI-qualified leads feed straight into pipeline." },
      { label: "Marketing Automation", href: "/platform/marketing-automation", description: "Campaigns that hand off to sales automatically." },
      { label: "Sales Pipeline", href: "/platform/sales-pipeline", description: "Pipeline visibility from first touch to close." },
    ],
    howItWorks: [
      { headline: "Connect lead gen, marketing, and pipeline", description: "Every growth motion feeds the same system." },
      { headline: "Qualify and route automatically", description: "Leads reach the right rep before they go cold." },
      { headline: "Forecast from one model", description: "Growth reporting reflects what's actually happening." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Email & Calendar", "Analytics & BI", "CRM Data"],
  },
  {
    slug: "automation",
    navLabel: "Automation",
    meta: {
      h1: "Eliminate the manual work slowing your business down",
      title: "ZynReach for Automation",
      description: "AI and workflow automation that take repetitive work off your team's plate, across every department.",
    },
    hero: {
      headline: "Eliminate the manual work slowing your business down",
      subhead: "Data entry, follow-ups, approvals, and handoffs — automated across the business, not just in one department's tool.",
    },
    primaryCta: { label: "Start Free Trial", href: "/trial" },
    before: {
      label: "Before ZynReach",
      body: "Repetitive work — data entry, follow-up emails, approval routing — eats hours every week, in every department, with no system connecting any of it.",
    },
    after: {
      label: "With ZynReach",
      body: "AI and workflow automation handle the repetitive work across CRM, marketing, and operations — your team spends time on what actually needs a person.",
    },
    capabilityCallouts: [
      { label: "Workflow Automation", href: "/platform/workflow-automation", description: "No-code automation across every department." },
      { label: "AI Assistants", href: "/platform/ai-assistants", description: "AI that drafts, flags, and follows up." },
      { label: "Automation Center", href: "/platform/automation-center", description: "One place to build and manage every workflow." },
    ],
    howItWorks: [
      { headline: "Map the repetitive work", description: "Identify what's eating hours across departments." },
      { headline: "Build no-code workflows", description: "Automate it without an engineering ticket." },
      { headline: "Review and refine", description: "Every run stays visible, so automation improves over time." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Collaboration", "Developer & API", "Analytics & BI"],
  },
  {
    slug: "customer-management",
    navLabel: "Customer Management",
    meta: {
      h1: "One source of truth for every customer relationship",
      title: "ZynReach for Customer Management",
      description: "CRM, Customer Portal, and Contact 360 unified — from first contact through post-sale support.",
    },
    hero: {
      headline: "One source of truth for every customer relationship",
      subhead:
        "From first contact to post-sale support, every customer interaction lives in one record — not scattered across a CRM, a helpdesk, and a spreadsheet.",
    },
    primaryCta: { label: "Start Free Trial", href: "/trial" },
    before: {
      label: "Before ZynReach",
      body: "Sales owns the CRM, support owns the helpdesk, and nobody has the full picture of a customer relationship without opening three tools.",
    },
    after: {
      label: "With ZynReach",
      body: "CRM, support history, and billing sit in one Contact 360 record — the full relationship, visible to whoever needs it.",
    },
    capabilityCallouts: [
      { label: "CRM", href: "/platform/crm", description: "Every deal and contact in one system." },
      { label: "Contact 360", href: "/platform/contact-360", description: "The full relationship history, in one view." },
      { label: "Customer Portal", href: "/platform/customer-portal", description: "A self-serve home for your customers." },
    ],
    howItWorks: [
      { headline: "Bring CRM, support, and billing together", description: "One Contact 360 record replaces three separate tools." },
      { headline: "Give every team the same view", description: "Sales, support, and finance see the same customer history." },
      { headline: "Serve customers without switching tools", description: "Every interaction happens from one connected record." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["CRM Data", "Support & Helpdesk", "Billing & Payments"],
  },
  {
    slug: "operations-need",
    navLabel: "Operations",
    meta: {
      h1: "Run the business without juggling five tools",
      title: "ZynReach for Operations",
      description: "Projects, tasks, HR, finance, and documents in one platform — built for businesses that need better operations, not another point tool.",
    },
    hero: {
      headline: "Run the business without juggling five tools",
      subhead: "Projects, tasks, HR, finance, and documents don't need five separate logins — better operations starts with one connected platform.",
    },
    primaryCta: { label: "Book a Demo", href: "/demo" },
    before: {
      label: "Before ZynReach",
      body: "Every department runs its own tool — project tracking here, HR there, documents somewhere else — and nothing talks to anything else.",
    },
    after: {
      label: "With ZynReach",
      body: "Projects, tasks, HR, finance, and documents run on one platform, so operational data connects instead of living in five silos.",
    },
    capabilityCallouts: [
      { label: "Project Management", href: "/platform/project-management", description: "Projects and tasks tracked in one place." },
      { label: "Document Center", href: "/platform/document-center", description: "Documents stored where the work actually happens." },
      { label: "Finance & Accounting", href: "/platform/finance-accounting", description: "Finance connected to the operations it reports on." },
    ],
    howItWorks: [
      { headline: "Move onto one platform", description: "Projects, HR, finance, and documents share one system." },
      { headline: "Connect data across departments", description: "Operational data stops living in five separate silos." },
      { headline: "Run operations from one system", description: "Not five tools that don't talk to each other." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Collaboration", "Analytics & BI", "Developer & API"],
  },
  {
    slug: "intelligence",
    navLabel: "Intelligence",
    meta: {
      h1: "Turn business data into decisions, not just dashboards",
      title: "ZynReach for Intelligence",
      description: "Analytics, reporting, and business intelligence across every function — not just one team's dashboard.",
    },
    hero: {
      headline: "Turn business data into decisions, not just dashboards",
      subhead:
        "Sales has a dashboard, marketing has a dashboard, finance has a dashboard — none of them agree. One business intelligence layer across every function fixes that.",
    },
    primaryCta: { label: "Book a Demo", href: "/demo" },
    before: {
      label: "Before ZynReach",
      body: "Every department built its own reporting, on its own numbers — nobody trusts a cross-functional report because nobody agrees on the inputs.",
    },
    after: {
      label: "With ZynReach",
      body: "Analytics and business intelligence draw from the same underlying data every team works in — one set of numbers, trusted everywhere.",
    },
    capabilityCallouts: [
      { label: "Business Intelligence", href: "/platform/business-intelligence", description: "Cross-functional reporting from one data model." },
      { label: "Executive Dashboards", href: "/platform/executive-dashboards", description: "Decisions backed by real-time numbers." },
      { label: "Scheduled Reports", href: "/platform/scheduled-reports", description: "Reports that land in the right inbox automatically." },
    ],
    howItWorks: [
      { headline: "Connect every team's data", description: "One data model replaces five conflicting dashboards." },
      { headline: "Build cross-functional dashboards", description: "Sales, marketing, and finance draw from the same numbers." },
      { headline: "Make decisions everyone trusts", description: "No more debating whose report is right." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Analytics & BI", "Collaboration", "CRM Data"],
  },
  {
    slug: "enterprise-governance",
    navLabel: "Enterprise Governance",
    meta: {
      h1: "Prove and enforce how the business runs",
      title: "ZynReach for Enterprise Governance",
      description: "Security, compliance, permissions, audit trails, and multi-branch control for organizations that need to prove how the business runs.",
    },
    hero: {
      headline: "Prove and enforce how the business runs",
      subhead:
        "Security, permissions, audit trails, and multi-branch control — built for organizations that have to prove how the business runs, not just run it.",
    },
    primaryCta: { label: "Book a Demo", href: "/demo" },
    before: {
      label: "Before ZynReach",
      body: "Access control is inconsistent across tools, audit trails are incomplete, and multi-branch operations mean reconciling permissions by hand.",
    },
    after: {
      label: "With ZynReach",
      body: "Centralized permissions, full audit trails, and multi-branch governance — control that scales across every team and location.",
    },
    capabilityCallouts: [
      { label: "Audit", href: "/platform/audit", description: "A complete audit trail across the platform." },
      { label: "Organization Management", href: "/platform/organization-management", description: "Permissions and roles enforced centrally." },
      { label: "Branch Management", href: "/platform/branch-management", description: "Multi-branch and multi-team control, unified." },
    ],
    howItWorks: [
      { headline: "Centralize permissions and roles", description: "Access control is consistent, not tool-by-tool." },
      { headline: "Log every action automatically", description: "Audit trails are complete, not reconstructed after the fact." },
      { headline: "Prove governance across branches", description: "Multi-branch control that scales with the organization." },
    ],
    storyNote: "Illustrative example — real customer stories launch with the Customer Stories page.",
    relatedIntegrations: ["Developer & API", "Analytics & BI", "Collaboration"],
  },
];

export function getSolutionPage(slug: string) {
  return solutionPages.find((page) => page.slug === slug);
}
