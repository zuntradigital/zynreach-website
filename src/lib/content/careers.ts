export interface JobListing {
  id: string;
  title: string;
  team: string;
  location: string;
  employmentType: string;
  datePosted: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  preferredSkills: string[];
}

/**
 * Master job description library (SRS Section 7.14). Real listings sync
 * from the ATS every 24h per FR-WEB-020 — no ATS credentials exist yet, so
 * this static list stands in until that integration is connected (see the
 * career-application service for the same pattern used elsewhere), and it's
 * also the content this route falls back to whenever ZynReach Admin's own
 * Careers system (src/lib/services/careers-content.ts) is unreachable.
 * These string values are structural fallbacks only — every field actually
 * shown to a visitor is re-read from messages/{en,ar}.json's
 * careersPage.jobs.<id>, which is the true bilingual source of truth (see
 * the careers list/detail pages). All roles are based out of ZynReach's
 * Giza, Egypt office.
 */
export const jobListings: JobListing[] = [
  {
    id: "b2b-sales-executive",
    title: "B2B Sales Executive",
    team: "Sales",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-01",
    description:
      "Discover prospective customers, build commercial relationships, understand company needs, present ZynReach's solutions, and manage the sales cycle through to signed contracts.",
    responsibilities: [
      "Research prospective customers and target companies",
      "Run outbound sales, cold calling, and email outreach",
      "Reach out to decision-makers and company leadership",
      "Qualify leads and identify real buying opportunities",
      "Deliver product demonstrations",
      "Manage the sales pipeline inside the CRM",
      "Prepare and follow up on commercial proposals",
      "Negotiate with customers and close deals",
    ],
    qualifications: [
      "Strong communication and persuasion skills",
      "Ability to work toward clear goals and KPIs",
      "Comfortable using a CRM",
      "Understanding of B2B sales fundamentals",
      "Relevant university degree",
    ],
    preferredSkills: ["Experience in SaaS, software, or technology sales", "Fluency in Arabic and English"],
  },
  {
    id: "enterprise-account-executive",
    title: "Enterprise Account Executive",
    team: "Sales",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-03",
    description:
      "Manage the full sales cycle for large customers and enterprise accounts, build strategic relationships with C-level executives and decision-makers, and close high-value enterprise deals.",
    responsibilities: [
      "Develop new enterprise accounts",
      "Identify decision-makers inside target organizations",
      "Manage complex, multi-stakeholder sales cycles",
      "Run discovery meetings and enterprise product demonstrations",
      "Prepare solutions, commercial proposals, and account plans",
      "Lead negotiation and contracting",
      "Manage the sales pipeline",
    ],
    qualifications: [
      "Strong experience in B2B enterprise sales",
      "Experience managing complex deals",
      "Strong negotiation and persuasion skills",
      "Comfortable engaging with C-level stakeholders",
      "Relevant university degree",
    ],
    preferredSkills: ["Experience in SaaS, CRM, ERP, or enterprise software", "Experience with MEDDIC, SPIN, or BANT"],
  },
  {
    id: "sales-development-representative",
    title: "Sales Development Representative (SDR)",
    team: "Sales",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-04",
    description:
      "Create and qualify sales opportunities through prospecting and outbound outreach, and turn prospective customers into sales-qualified leads.",
    responsibilities: [
      "Build prospect lists and research decision-makers",
      "Run cold calling, email outreach, and LinkedIn outreach",
      "Qualify leads",
      "Book meetings for the sales team",
      "Keep the CRM up to date",
      "Track prospecting activity",
    ],
    qualifications: [
      "Excellent communication skills",
      "Strong research ability",
      "Persistence and consistent follow-through",
      "Understanding of the sales funnel basics",
      "Relevant university degree",
    ],
    preferredSkills: ["No prior experience required", "Recent graduates welcome"],
  },
  {
    id: "business-development-executive",
    title: "Business Development Executive",
    team: "Sales",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-05",
    description:
      "Discover new commercial opportunities, and develop the markets, partnerships, and growth channels that help ZynReach expand its customer base.",
    responsibilities: [
      "Conduct market research and discover new sectors",
      "Develop business opportunities and strategic leads",
      "Build relationships with companies",
      "Create partnership opportunities",
      "Prepare business proposals",
      "Analyze competitors and support market-expansion plans",
    ],
    qualifications: [
      "Strong understanding of business and market development",
      "Networking and negotiation skills",
      "Analytical ability",
      "Understanding of B2B business models",
      "Degree in Business, Marketing, Management, or a related field",
    ],
    preferredSkills: ["Experience in business development", "Strong English proficiency"],
  },
  {
    id: "digital-marketing-specialist",
    title: "Digital Marketing Specialist",
    team: "Marketing",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-06",
    description:
      "Execute and develop digital marketing strategies that support brand awareness, lead generation, and customer acquisition.",
    responsibilities: [
      "Execute and manage digital marketing campaigns",
      "Develop landing pages",
      "Analyze campaign performance and prepare marketing reports",
      "Manage the marketing funnel",
      "Develop lead-generation campaigns",
      "Improve conversion rates",
    ],
    qualifications: [
      "Strong knowledge of digital marketing principles",
      "Data analysis skills",
      "Understanding of conversion funnels",
      "Degree in Marketing, Business, or a related field",
    ],
    preferredSkills: ["Knowledge of Google Analytics and Search Console", "Hands-on digital marketing experience"],
  },
  {
    id: "seo-specialist",
    title: "SEO Specialist",
    team: "Marketing",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-07",
    description:
      "Develop and execute an SEO strategy that grows ZynReach's organic visibility, organic traffic, and organic lead generation.",
    responsibilities: [
      "Conduct keyword research and competitor SEO analysis",
      "Own technical SEO and on-page SEO",
      "Optimize content, internal linking, and schema markup",
      "Run SEO audits and monitor Search Console and Analytics",
      "Develop an SEO content strategy",
      "Prepare monthly reports",
    ],
    qualifications: [
      "Hands-on SEO experience",
      "Knowledge of technical SEO",
      "Understanding of search intent",
      "Strong analytical ability",
      "Degree in Marketing, IT, Business, or a related field",
    ],
    preferredSkills: ["Experience with SaaS SEO", "SEO certifications"],
  },
  {
    id: "product-marketing-specialist",
    title: "Product Marketing Specialist",
    team: "Marketing",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-08",
    description:
      "Turn ZynReach's technical capabilities into clear marketing messages and stories that help customers understand the product's value and make a buying decision.",
    responsibilities: [
      "Own product positioning and messaging",
      "Support product launches",
      "Write website product content and own product pages",
      "Develop case studies and sales enablement materials",
      "Run competitive analysis and customer research",
    ],
    qualifications: [
      "Understanding of SaaS products",
      "Strong writing skills",
      "Understanding of customer personas",
      "Ability to simplify technical concepts",
      "Degree in Marketing, Business, or Technology",
    ],
    preferredSkills: ["Experience in product marketing"],
  },
  {
    id: "social-media-brand-specialist",
    title: "Social Media & Brand Specialist",
    team: "Marketing",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-09",
    description: "Develop ZynReach's digital presence and brand identity across social media and digital channels.",
    responsibilities: [
      "Own social media strategy, content planning, and content calendar",
      "Manage LinkedIn and other social platforms",
      "Manage community engagement and brand monitoring",
      "Support campaigns",
      "Analyze social performance",
      "Maintain brand guidelines",
    ],
    qualifications: [
      "Strong writing and creative skills",
      "Understanding of social media marketing",
      "Understanding of brand identity",
      "Data analysis skills",
      "Degree in Marketing, Communications, Media, or a related field",
    ],
    preferredSkills: ["A portfolio of prior work"],
  },
  {
    id: "technical-support-specialist",
    title: "Technical Support Specialist",
    team: "Support",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-10",
    description:
      "Provide professional technical support to ZynReach customers, diagnose issues, and follow them through to resolution while maintaining the highest standards of customer experience.",
    responsibilities: [
      "Handle support tickets and analyze customer issues",
      "Provide technical assistance and track SLAs",
      "Document issues and reproduce them when needed",
      "Escalate technical issues",
      "Update the knowledge base",
      "Identify recurring issues",
    ],
    qualifications: [
      "Technical troubleshooting skills",
      "Excellent communication skills",
      "Understanding of web applications",
      "Experience with ticketing systems",
      "Degree in Computer Science, IT, or a related field",
    ],
    preferredSkills: ["Prior technical support experience"],
  },
  {
    id: "customer-support-representative",
    title: "Customer Support Representative",
    team: "Support",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-11",
    description:
      "Deliver an outstanding support experience for customers by handling inquiries and requests and helping users quickly and professionally.",
    responsibilities: [
      "Handle customer inquiries across chat, email, and tickets",
      "Explain platform features and follow up on requests",
      "Document interactions",
      "Escalate issues when needed",
      "Contribute to the knowledge base",
    ],
    qualifications: [
      "Communication and customer service skills",
      "Problem-solving skills and patience",
      "Fast learner",
      "Comfortable using CRM and support systems",
      "Relevant university degree",
    ],
    preferredSkills: ["Prior customer service experience", "Fluency in Arabic and English"],
  },
  {
    id: "customer-success-specialist",
    title: "Customer Success Specialist",
    team: "Customer Success",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-12",
    description:
      "Own customer success after the contract is signed, drive strong platform adoption, and grow retention and customer lifetime value.",
    responsibilities: [
      "Own customer onboarding and product training",
      "Track customer health and monitor adoption",
      "Run customer reviews and address churn risk",
      "Identify upsell opportunities",
      "Build customer success plans",
      "Coordinate with Product, Support, and Sales",
    ],
    qualifications: [
      "Customer relationship management skills",
      "Communication and problem-solving skills",
      "Understanding of the SaaS customer lifecycle",
      "Degree in Business, Marketing, IT, or a related field",
    ],
    preferredSkills: ["Prior customer success experience"],
  },
  {
    id: "hr-specialist",
    title: "HR Specialist",
    team: "People",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-13",
    description:
      "Run day-to-day HR operations and manage the employee lifecycle from hiring through development and performance.",
    responsibilities: [
      "Run recruitment and employee onboarding",
      "Maintain employee records and HR policies",
      "Manage attendance and leave",
      "Support performance management and employee relations",
      "Prepare HR reports and job descriptions",
    ],
    qualifications: [
      "HR knowledge",
      "Communication and organizational skills",
      "Discretion and confidentiality",
      "Comfortable using HR systems",
      "Degree in Human Resources or Business Administration",
    ],
    preferredSkills: ["Prior HR experience"],
  },
  {
    id: "talent-acquisition-specialist",
    title: "Talent Acquisition Specialist",
    team: "People",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-14",
    description:
      "Build a strong talent pipeline and attract the best technical, commercial, and operational talent to join ZynReach.",
    responsibilities: [
      "Prepare recruitment plans and source talent",
      "Recruit via LinkedIn",
      "Screen candidates and coordinate interviews",
      "Evaluate candidates and manage the talent pipeline",
      "Support employer branding",
      "Prepare recruitment reports",
    ],
    qualifications: [
      "Recruitment, sourcing, and interviewing skills",
      "Communication skills",
      "Candidate-assessment skills",
      "Degree in HR, Business, Psychology, or a related field",
    ],
    preferredSkills: ["Prior talent-acquisition experience"],
  },
  {
    id: "hr-people-operations-specialist",
    title: "HR & People Operations Specialist",
    team: "People",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-15",
    description:
      "Develop the employee experience and manage the operations behind the employee lifecycle, internal policies, and procedures.",
    responsibilities: [
      "Own employee onboarding and lifecycle management",
      "Run HR operations and performance cycles",
      "Maintain HR policies and documentation",
      "Track people analytics",
      "Own the employee experience and manage offboarding",
    ],
    qualifications: [
      "HR operations experience",
      "Organizational and data-analysis skills",
      "Communication skills",
      "Discretion and confidentiality",
      "Degree in HR or Business Administration",
    ],
    preferredSkills: ["Prior people-operations experience"],
  },
  {
    id: "operations-specialist",
    title: "Operations Specialist",
    team: "Operations",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-16",
    description:
      "Support day-to-day operations, keep internal procedures running efficiently, and connect different teams to improve workflow across ZynReach.",
    responsibilities: [
      "Track daily operations, tasks, and deadlines",
      "Coordinate across departments",
      "Prepare operational reports and track KPIs",
      "Document procedures and identify bottlenecks",
      "Improve workflows",
    ],
    qualifications: [
      "Organizational and process-management skills",
      "Problem-solving skills",
      "Comfortable with Excel and reporting",
      "Degree in Business Administration, Operations, or Management",
    ],
    preferredSkills: ["Prior operations experience"],
  },
  {
    id: "business-operations-analyst",
    title: "Business Operations Analyst",
    team: "Operations",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-17",
    description:
      "Analyze operational data and turn it into insights that help leadership make better decisions and improve company performance.",
    responsibilities: [
      "Collect and analyze data",
      "Prepare business reports and build dashboards",
      "Analyze KPIs, processes, and performance",
      "Identify trends and causes of underperformance",
      "Present recommendations",
    ],
    qualifications: [
      "Analytical thinking",
      "Comfortable with Excel or BI tools",
      "Data-visualization and business-analysis skills",
      "Degree in Business Analytics, Business, Statistics, or IT",
    ],
    preferredSkills: ["Experience with Power BI or similar analysis tools"],
  },
  {
    id: "project-operations-coordinator",
    title: "Project / Operations Coordinator",
    team: "Operations",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-18",
    description:
      "Coordinate projects and tasks across teams, keep schedules on track, and follow execution through to completion.",
    responsibilities: [
      "Coordinate projects and follow up on task assignments",
      "Track deadlines and dependencies",
      "Coordinate meetings and maintain project documentation",
      "Prepare status reports and track risks",
      "Escalate delays",
    ],
    qualifications: [
      "Organizational and time-management skills",
      "Communication and coordination skills",
      "Documentation and problem-solving skills",
      "Degree in Project Management, Business, or Management",
    ],
    preferredSkills: ["PMP or Scrum certification"],
  },
  {
    id: "public-relations-specialist",
    title: "Public Relations Specialist",
    team: "Marketing",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-19",
    description: "Develop ZynReach's corporate and media relationships and strengthen the brand's public and professional image.",
    responsibilities: [
      "Own corporate communications and media relations",
      "Write press releases and coordinate events",
      "Represent ZynReach at conferences",
      "Support corporate partnerships and build relationships with organizations",
      "Track media coverage and manage brand reputation",
    ],
    qualifications: [
      "Communication and networking skills",
      "Writing and presentation skills",
      "Event-management and relationship-building skills",
      "Degree in Public Relations, Communications, Marketing, or Media",
    ],
    preferredSkills: ["Prior PR experience"],
  },
  {
    id: "strategic-partnerships-manager",
    title: "Strategic Partnerships Manager",
    team: "Business Development",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-20",
    description:
      "Build and manage strategic partnerships that help ZynReach reach new markets, customers, and growth channels.",
    responsibilities: [
      "Identify and prospect strategic partners",
      "Build partnership strategy and negotiate with partners",
      "Prepare partnership proposals and manage partner relationships",
      "Develop referral and technology partnerships",
      "Track partner performance",
    ],
    qualifications: [
      "Strategic thinking and negotiation skills",
      "Business-development experience",
      "Relationship-management skills",
      "B2B experience and understanding of SaaS ecosystems",
      "Degree in Business, Marketing, Management, or Technology",
    ],
    preferredSkills: ["Prior partnerships experience"],
  },
  {
    id: "business-development-manager",
    title: "Business Development Manager",
    team: "Business Development",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-08-21",
    description:
      "Lead business-development and expansion initiatives to grow revenue, enter new markets, and develop strategic relationships with companies and institutions.",
    responsibilities: [
      "Develop business-development strategy and lead market expansion",
      "Develop strategic accounts and identify revenue opportunities",
      "Build corporate relationships and manage the business-development pipeline",
      "Analyze markets and competitors",
      "Lead commercial negotiations and prepare business plans",
    ],
    qualifications: [
      "Strong business-development experience",
      "Strategic thinking and leadership skills",
      "Negotiation skills",
      "B2B sales and market-analysis experience",
      "Degree in Business Administration, Marketing, or Management",
    ],
    preferredSkills: ["Experience in Technology or SaaS"],
  },
];

export const benefits = [
  { headline: "Health coverage", description: "Medical, dental, and vision from day one." },
  { headline: "Flexible time off", description: "Unlimited PTO with a mandatory 15-day minimum." },
  { headline: "Hybrid-friendly", description: "Work from our Giza office or remotely, with regular in-person team days." },
  { headline: "Learning budget", description: "Annual budget for courses, books, and conferences." },
];

export const employeeTestimonial = {
  quote: "I've never worked somewhere that ships this fast without sacrificing quality — the team actually talks to customers every week.",
  authorName: "Representative employee quote",
  authorTitle: "Senior Engineer",
  company: "Illustrative example — real employee stories launch alongside our careers program",
};
