import type { NavItem } from "@/types/content";

/**
 * Primary navigation structure per SRS Section 6.
 * Destination routes outside "/" are placeholders for pages not yet built
 * in this delivery pass (see project README for build status).
 */
export const primaryNav: NavItem[] = [
  {
    label: "Platform",
    type: "mega",
    columns: [
      {
        heading: "Capabilities",
        links: [
          { label: "AI Assistants", href: "/platform/ai-assistants" },
          { label: "CRM", href: "/platform/crm" },
          { label: "Marketing Automation", href: "/platform/marketing-automation" },
          { label: "Lead Generation", href: "/platform/lead-generation" },
          { label: "Workflow Automation", href: "/platform/workflow-automation" },
          { label: "Analytics", href: "/platform/analytics" },
        ],
      },
      {
        heading: "Integrations",
        links: [
          { label: "View all integrations", href: "/integrations" },
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
        heading: "By team",
        links: [
          { label: "For Sales Teams", href: "/solutions/sales" },
          { label: "For Marketing Teams", href: "/solutions/marketing" },
          { label: "For Agencies", href: "/solutions/agencies" },
        ],
      },
      {
        heading: "By company size",
        links: [
          { label: "For Startups & SMBs", href: "/solutions/smb" },
          { label: "For Enterprise", href: "/solutions/enterprise" },
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
    label: "Resources",
    type: "mega",
    columns: [
      {
        heading: "Learn",
        links: [
          { label: "Blog", href: "/blog" },
          { label: "Customer Stories", href: "/customers" },
        ],
      },
      {
        heading: "Build",
        links: [
          { label: "Documentation", href: "/docs" },
          { label: "API Reference", href: "/docs/api" },
          { label: "Guides & Templates", href: "/resources/guides" },
          { label: "Webinars", href: "/resources/webinars" },
        ],
      },
    ],
    promo: {
      eyebrow: "Resources hub",
      headline: "Browse everything in one place",
      href: "/resources",
      image: "/images/mega-menu/resource-center.jpg",
    },
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
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "Customer Stories", href: "/customers" },
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
    { label: "FAQ", href: "/faq" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
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
