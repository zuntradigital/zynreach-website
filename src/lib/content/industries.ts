import type { IndustryPageContent } from "@/types/content";

/**
 * Industries sub-page content (SRS Section 7.10). Each industry's compliance
 * note is scoped to marketing/CRM use, not clinical/regulated data, per the
 * SRS's explicit Healthcare-page caveat.
 */
export const industryPages: IndustryPageContent[] = [
  {
    slug: "healthcare",
    navLabel: "Healthcare",
    image: "/images/industries/healthcare.jpg",
    meta: {
      h1: "A CRM built for the healthcare referral pipeline",
      title: "ZynReach for Healthcare",
      description: "AI-powered CRM and marketing automation for healthcare organizations' growth teams.",
    },
    hero: {
      headline: "A CRM built for the healthcare referral pipeline",
      subhead: "Manage referral partners, patient acquisition campaigns, and intake follow-up in one system — scoped to marketing and CRM data, not clinical records.",
    },
    workflowSteps: ["Referral received", "Lead qualified", "Intake scheduled", "Follow-up automated"],
    capabilityCallouts: [
      { label: "CRM", href: "/platform/crm", description: "Track referral partners and patient acquisition in one pipeline." },
      { label: "Marketing Automation", href: "/platform/marketing-automation", description: "Automated intake follow-up sequences." },
      { label: "Analytics", href: "/platform/analytics", description: "Referral source and conversion reporting." },
    ],
    useCaseNote: "Illustrative use case — no Healthcare customer story is published yet; this walks through a representative referral workflow.",
    complianceNote: "ZynReach's CRM and marketing tools handle contact and referral data, not clinical or PHI records. See our Security and Compliance pages for full data-handling scope.",
  },
  {
    slug: "education",
    navLabel: "Education",
    image: "/images/industries/education.jpg",
    meta: {
      h1: "From inquiry to enrollment, without the spreadsheet",
      title: "ZynReach for Education",
      description: "Admissions and enrollment CRM built for schools and education organizations.",
    },
    hero: {
      headline: "From inquiry to enrollment, without the spreadsheet",
      subhead: "Track prospective student inquiries, automate nurture campaigns, and give admissions teams one pipeline view.",
    },
    workflowSteps: ["Inquiry captured", "Nurture sequence starts", "Application submitted", "Enrollment confirmed"],
    capabilityCallouts: [
      { label: "Lead Generation", href: "/platform/lead-generation", description: "Capture and qualify prospective student inquiries." },
      { label: "Marketing Automation", href: "/platform/marketing-automation", description: "Automated nurture through the admissions funnel." },
      { label: "CRM", href: "/platform/crm", description: "One pipeline from inquiry to enrollment." },
    ],
    useCaseNote: "Illustrative use case — no Education customer story is published yet; this walks through a representative admissions workflow.",
    complianceNote: "Data handling for prospective-student contact records follows the practices detailed on our Security and Compliance pages.",
  },
  {
    slug: "real-estate",
    navLabel: "Real Estate",
    image: "/images/industries/real-estate.jpg",
    meta: {
      h1: "Turn listing traffic into a working pipeline",
      title: "ZynReach for Real Estate",
      description: "Listing-to-lead CRM and marketing automation for real estate teams.",
    },
    hero: {
      headline: "Turn listing traffic into a working pipeline",
      subhead: "Route inquiries by listing and territory, automate follow-up, and see every deal stage in one place.",
    },
    workflowSteps: ["Listing inquiry", "Lead routed by territory", "Showing scheduled", "Offer tracked"],
    capabilityCallouts: [
      { label: "Lead Generation", href: "/platform/lead-generation", description: "Route listing inquiries to the right agent instantly." },
      { label: "Workflow Automation", href: "/platform/workflow-automation", description: "Automate showing scheduling and follow-up." },
      { label: "Analytics", href: "/platform/analytics", description: "See conversion by listing and territory." },
    ],
    useCaseNote: "Illustrative use case — no Real Estate customer story is published yet; this walks through a representative listing-to-lead workflow.",
    complianceNote: "Data handling for listing inquiries and buyer/seller contact records follows the practices detailed on our Security and Compliance pages.",
  },
  {
    slug: "automotive",
    navLabel: "Automotive",
    image: "/images/industries/automotive.jpg",
    meta: {
      h1: "One pipeline for sales and service leads",
      title: "ZynReach for Automotive",
      description: "CRM and marketing automation for automotive dealerships and service teams.",
    },
    hero: {
      headline: "One pipeline for sales and service leads",
      subhead: "Unify sales inquiries and service reminders in one system, with automated follow-up that keeps customers coming back.",
    },
    workflowSteps: ["Inquiry captured", "Test drive scheduled", "Financing follow-up", "Service reminders automated"],
    capabilityCallouts: [
      { label: "CRM", href: "/platform/crm", description: "One record per customer, across sales and service." },
      { label: "Marketing Automation", href: "/platform/marketing-automation", description: "Automated service reminders and re-engagement." },
      { label: "Workflow Automation", href: "/platform/workflow-automation", description: "Route leads by location and inventory." },
    ],
    useCaseNote: "Illustrative use case — no Automotive customer story is published yet; this walks through a representative sales-and-service workflow.",
    complianceNote: "Data handling for customer contact and vehicle-interest records follows the practices detailed on our Security and Compliance pages.",
  },
  {
    slug: "manufacturing",
    navLabel: "Manufacturing",
    image: "/images/industries/manufacturing.jpg",
    meta: {
      h1: "Give distributed sales teams one shared pipeline",
      title: "ZynReach for Manufacturing",
      description: "CRM and workflow automation for manufacturing sales and distribution teams.",
    },
    hero: {
      headline: "Give distributed sales teams one shared pipeline",
      subhead: "Track quotes, distributor relationships, and long sales cycles in one system built for B2B manufacturing sales.",
    },
    workflowSteps: ["RFQ received", "Quote generated", "Distributor follow-up", "Order confirmed"],
    capabilityCallouts: [
      { label: "CRM", href: "/platform/crm", description: "Track long B2B sales cycles and distributor relationships." },
      { label: "Workflow Automation", href: "/platform/workflow-automation", description: "Automate RFQ routing and quote follow-up." },
      { label: "Analytics", href: "/platform/analytics", description: "Pipeline visibility across regions and distributors." },
    ],
    useCaseNote: "Illustrative use case — no Manufacturing customer story is published yet; this walks through a representative quote-to-order workflow.",
    complianceNote: "Data handling for distributor and customer contact records follows the practices detailed on our Security and Compliance pages.",
  },
];

export function getIndustryPage(slug: string) {
  return industryPages.find((page) => page.slug === slug);
}
