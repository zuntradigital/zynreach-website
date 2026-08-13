import type { CustomerStory } from "@/types/content";

/**
 * Customer story content (SRS Section 7.18). No real customer stories are
 * published yet (SRS 20: "Testimonials... attributed with named,
 * verifiable customers only — no anonymous 'SaaS Company' quotes at
 * launch"), so every entry here is explicitly illustrative — same pattern
 * used for testimonials elsewhere on the site — rather than presenting
 * fabricated customer claims as real.
 */
export const customerStories: CustomerStory[] = [
  {
    slug: "northwind-traders",
    customerName: "Northwind Traders (illustrative)",
    image: "/images/customers/northwind-traders.jpg",
    headlineMetric: { value: "62%", label: "faster lead response time" },
    industry: "Manufacturing",
    productArea: "CRM",
    companySize: "51-200",
    challenge: "Sales reps tracked deals across spreadsheets and a shared inbox, so leads sat unassigned for hours and pipeline reporting required manual reconciliation before every forecast call.",
    solution: "Northwind consolidated onto ZynReach's CRM and Lead Generation capabilities, automating lead routing by territory and letting activity log itself from email and calendar.",
    result: "Lead response time dropped from an average of two days to under two hours, and the sales team stopped spending Friday afternoons reconciling the pipeline spreadsheet.",
    quote: { text: "We replaced five tools with one platform and cut our lead response time from two days to under two hours.", authorName: "Representative customer quote", authorTitle: "VP Revenue Operations" },
    relatedCapabilities: [
      { label: "CRM", href: "/platform/crm" },
      { label: "Lead Generation", href: "/platform/lead-generation" },
    ],
  },
  {
    slug: "cedarline-health",
    customerName: "Cedarline Health (illustrative)",
    image: "/images/customers/cedarline-health.jpg",
    headlineMetric: { value: "3x", label: "referral partner throughput" },
    industry: "Healthcare",
    productArea: "Marketing Automation",
    companySize: "201-1000",
    challenge: "Referral partner follow-up was entirely manual, so intake coordinators couldn't keep pace as referral volume grew, and partner relationships suffered from slow, inconsistent follow-up.",
    solution: "Cedarline automated intake follow-up sequences with ZynReach Marketing Automation, scoped strictly to marketing and CRM contact data, not clinical records.",
    result: "The team tripled the number of referral partners it could actively manage without adding headcount, while follow-up consistency improved across every partner relationship.",
    quote: { text: "Automating intake follow-up let us scale referral partnerships without scaling the team.", authorName: "Representative customer quote", authorTitle: "Director of Growth" },
    relatedCapabilities: [
      { label: "Marketing Automation", href: "/platform/marketing-automation" },
      { label: "Workflow Automation", href: "/platform/workflow-automation" },
    ],
  },
  {
    slug: "fernbridge-realty",
    customerName: "Fernbridge Realty (illustrative)",
    image: "/images/customers/fernbridge-realty.jpg",
    headlineMetric: { value: "40%", label: "more showings booked per agent" },
    industry: "Real Estate",
    productArea: "Lead Generation",
    companySize: "11-50",
    challenge: "Listing inquiries went to a shared inbox and were often claimed by whichever agent saw them first, creating internal friction and inconsistent follow-up speed.",
    solution: "Fernbridge implemented AI-assisted lead routing by territory and listing, with automated follow-up sequences for unclaimed inquiries.",
    result: "Agents booked 40% more showings per rep within the first full quarter, and internal disputes over lead ownership effectively disappeared.",
    quote: { text: "Instant, fair routing solved a problem that was costing us both leads and morale.", authorName: "Representative customer quote", authorTitle: "Managing Broker" },
    relatedCapabilities: [
      { label: "Lead Generation", href: "/platform/lead-generation" },
      { label: "Workflow Automation", href: "/platform/workflow-automation" },
    ],
  },
  {
    slug: "meridian-analytics",
    customerName: "Meridian Analytics (illustrative)",
    image: "/images/customers/meridian-analytics.jpg",
    headlineMetric: { value: "1", label: "unified source of pipeline truth" },
    industry: "Manufacturing",
    productArea: "Analytics",
    companySize: "1000+",
    challenge: "Four business units ran four different reporting stacks, so leadership couldn't get a single trustworthy view of pipeline health without a week of manual reconciliation.",
    solution: "Meridian standardized all four business units on ZynReach's CRM and Analytics, unifying pipeline and campaign data into one reporting layer.",
    result: "Monthly reporting time dropped from a week of manual reconciliation to same-day dashboards, and leadership now reviews one number instead of four conflicting ones.",
    quote: { text: "Standardizing on ZynReach across four business units cut our tool sprawl and gave leadership one real pipeline view.", authorName: "Representative customer quote", authorTitle: "VP Revenue Operations" },
    relatedCapabilities: [
      { label: "Analytics", href: "/platform/analytics" },
      { label: "CRM", href: "/platform/crm" },
    ],
  },
];

export function getCustomerStory(slug: string) {
  return customerStories.find((story) => story.slug === slug);
}
