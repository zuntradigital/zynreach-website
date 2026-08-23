import type { NavItem } from "@/types/content";

/**
 * Primary navigation structure per SRS Section 6.
 * Destination routes outside "/" are placeholders for pages not yet built
 * in this delivery pass (see project README for build status).
 */
export const primaryNav: NavItem[] = [
  {
    label: "Product",
    type: "mega",
    columns: [
      {
        heading: "Growth & Revenue",
        links: [
          { label: "CRM", href: "/platform/crm" },
          { label: "Lead Generation", href: "/platform/lead-generation" },
          { label: "Sales Pipeline", href: "/platform/sales-pipeline" },
          { label: "Marketing Automation", href: "/platform/marketing-automation" },
          { label: "Campaigns", href: "/platform/campaigns" },
          { label: "Contact 360", href: "/platform/contact-360" },
          { label: "Business Data", href: "/platform/business-data" },
        ],
      },
      {
        heading: "AI & Automation",
        links: [
          { label: "AI Workspace", href: "/platform/ai-workspace" },
          { label: "AI Assistants", href: "/platform/ai-assistants" },
          { label: "AI Agents", href: "/platform/ai-agents" },
          { label: "AI Insights", href: "/platform/ai-insights" },
          { label: "Automation Center", href: "/platform/automation-center" },
          { label: "Workflow Automation", href: "/platform/workflow-automation" },
        ],
      },
      {
        heading: "Operations",
        links: [
          { label: "Project Management", href: "/platform/project-management" },
          { label: "Task Management", href: "/platform/task-management" },
          { label: "HR Management", href: "/platform/hr-management" },
          { label: "Attendance & Leave", href: "/platform/attendance-leave" },
          { label: "Teams & Departments", href: "/platform/teams-departments" },
          { label: "Finance & Accounting", href: "/platform/finance-accounting" },
          { label: "Document Center", href: "/platform/document-center" },
        ],
      },
      {
        heading: "Intelligence",
        links: [
          { label: "Analytics", href: "/platform/analytics" },
          { label: "Reports", href: "/platform/reports" },
          { label: "Business Intelligence", href: "/platform/business-intelligence" },
          { label: "Executive Dashboards", href: "/platform/executive-dashboards" },
          { label: "Scheduled Reports", href: "/platform/scheduled-reports" },
        ],
      },
      {
        heading: "Customer & Commerce",
        links: [
          { label: "Customer Portal", href: "/platform/customer-portal" },
          { label: "Subscription & Billing", href: "/platform/subscription-billing" },
          { label: "Notifications", href: "/platform/notifications" },
        ],
      },
      {
        heading: "Enterprise Platform",
        links: [
          { label: "Integrations", href: "/integrations" },
          { label: "Marketplace", href: "/platform/marketplace" },
          { label: "Plugin SDK", href: "/platform/plugin-sdk" },
          { label: "Organization Management", href: "/platform/organization-management" },
          { label: "Branch Management", href: "/platform/branch-management" },
          { label: "Security", href: "/security" },
          { label: "Compliance", href: "/compliance" },
          { label: "Audit", href: "/platform/audit" },
        ],
      },
    ],
    promo: {
      eyebrow: "Product tour",
      headline: "See the unified platform in 90 seconds",
      href: "/platform",
      image: "/images/mega-menu/product-tour.jpg",
    },
  },
  {
    label: "Solutions",
    type: "mega",
    columns: [
      {
        heading: "By Business Size",
        links: [
          { label: "For Startups & SMBs", href: "/solutions/smb" },
          { label: "For Growing Businesses", href: "/solutions/growing-business" },
          { label: "For Mid-Market", href: "/solutions/mid-market" },
          { label: "For Enterprise", href: "/solutions/enterprise" },
        ],
      },
      {
        heading: "By Team",
        links: [
          { label: "For Sales Teams", href: "/solutions/sales" },
          { label: "For Marketing Teams", href: "/solutions/marketing" },
          { label: "For Operations Teams", href: "/solutions/operations" },
          { label: "For HR Teams", href: "/solutions/hr" },
          { label: "For Finance Teams", href: "/solutions/finance" },
          { label: "For Management & Executives", href: "/solutions/management" },
          { label: "For Customer Success Teams", href: "/solutions/customer-success" },
        ],
      },
      {
        heading: "By Business Need",
        links: [
          { label: "Growth", href: "/solutions/growth" },
          { label: "Automation", href: "/solutions/automation" },
          { label: "Customer Management", href: "/solutions/customer-management" },
          { label: "Operations", href: "/solutions/operations-need" },
          { label: "Intelligence", href: "/solutions/intelligence" },
          { label: "Enterprise Governance", href: "/solutions/enterprise-governance" },
        ],
      },
    ],
  },
  {
    label: "Industries",
    type: "dropdown",
    links: [
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "Education", href: "/industries/education" },
      { label: "Real Estate", href: "/industries/real-estate" },
      { label: "Automotive", href: "/industries/automotive" },
      { label: "Manufacturing", href: "/industries/manufacturing" },
    ],
  },
  {
    label: "Pricing",
    type: "link",
    href: "/pricing",
  },
  {
    label: "Knowledge Center",
    type: "mega",
    columns: [
      {
        heading: "Explore",
        links: [
          { label: "Blog", href: "/blog" },
          { label: "Customer Stories", href: "/customer-stories" },
          { label: "Guides & Templates", href: "/guides-templates" },
          { label: "Webinars", href: "/webinars" },
        ],
      },
    ],
    promo: {
      eyebrow: "Knowledge Center",
      headline: "Explore insights, guides, and webinars",
      href: "/knowledge-center",
      image: "/images/mega-menu/resource-center.jpg",
    },
  },
  {
    label: "Company",
    type: "dropdown",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Security", href: "/security" },
      { label: "Compliance", href: "/compliance" },
      { label: "Partners", href: "/partners" },
    ],
  },
];

export const footerNav = {
  Platform: [
    { label: "AI Assistants", href: "/platform/ai-assistants" },
    { label: "CRM", href: "/platform/crm" },
    { label: "Marketing Automation", href: "/platform/marketing-automation" },
    { label: "Lead Generation", href: "/platform/lead-generation" },
    { label: "Workflow Automation", href: "/platform/workflow-automation" },
    { label: "Analytics", href: "/platform/analytics" },
  ],
  Solutions: [
    { label: "For Sales Teams", href: "/solutions/sales" },
    { label: "For Marketing Teams", href: "/solutions/marketing" },
    { label: "For Agencies", href: "/solutions/agencies" },
    { label: "For Startups & SMBs", href: "/solutions/smb" },
    { label: "For Enterprise", href: "/solutions/enterprise" },
  ],
  Industries: [
    { label: "Healthcare", href: "/industries/healthcare" },
    { label: "Education", href: "/industries/education" },
    { label: "Real Estate", href: "/industries/real-estate" },
    { label: "Automotive", href: "/industries/automotive" },
    { label: "Manufacturing", href: "/industries/manufacturing" },
  ],
  "Knowledge Center": [
    { label: "Blog", href: "/blog" },
    { label: "Guides & Templates", href: "/guides-templates" },
    { label: "Webinars", href: "/webinars" },
    { label: "FAQ", href: "/faq" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Customer Stories", href: "/customer-stories" },
    { label: "Security", href: "/security" },
    { label: "Compliance", href: "/compliance" },
    { label: "Partners", href: "/partners" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Cookie Policy", href: "/legal/cookies" },
    { label: "DPA", href: "/legal/dpa" },
  ],
} satisfies Record<string, { label: string; href: string }[]>;
