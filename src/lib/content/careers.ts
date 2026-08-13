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
 * Representative job listings (SRS Section 7.14). Real listings sync from
 * the ATS every 24h per FR-WEB-020 — no ATS credentials exist yet, so this
 * static list stands in until that integration is connected (see the
 * career-application service for the same pattern used elsewhere). All
 * roles are based out of ZynReach's Giza, Egypt office.
 */
export const jobListings: JobListing[] = [
  {
    id: "senior-frontend-engineer",
    title: "Senior Frontend Engineer",
    team: "Engineering",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-07-20",
    description:
      "Build the design system, page templates, and performance-critical UI that power the ZynReach marketing site and in-app product experience, working closely with Product Design and the AI Assistants team to ship interfaces that feel fast, accessible, and unmistakably premium.",
    responsibilities: [
      "Design, build, and maintain reusable React and Next.js components used across the marketing site and product application",
      "Partner with Product Design to translate Figma specs into pixel-accurate, accessible, responsive UI",
      "Own frontend performance budgets (Core Web Vitals, bundle size) and drive measurable improvements",
      "Collaborate with backend engineers to define clean API contracts for new features",
      "Write automated tests (unit, integration, and visual regression) to keep the codebase reliable as it scales",
      "Mentor mid-level engineers through code review and pairing",
      "Contribute to our internal component library and frontend engineering standards",
    ],
    qualifications: [
      "5+ years of professional experience building production web applications with React and TypeScript",
      "Deep knowledge of modern CSS (Tailwind or an equivalent utility-first framework) and responsive, accessible UI patterns",
      "Experience with Next.js or a comparable React meta-framework in a production setting",
      "Track record of shipping performant, SEO-friendly marketing or product surfaces at scale",
      "Strong communication skills and comfort working directly with Product and Design stakeholders",
      "Bachelor's degree in Computer Science, a related field, or equivalent practical experience",
    ],
    preferredSkills: [
      "Experience building or maintaining a component design system",
      "Familiarity with internationalization (i18n) and RTL layout support",
      "Exposure to AI-assisted product features such as chat interfaces or streaming UI",
    ],
  },
  {
    id: "product-marketing-manager",
    title: "Product Marketing Manager",
    team: "Marketing",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-07-18",
    description:
      "Own positioning, messaging, and go-to-market strategy for ZynReach's AI Assistants and CRM capabilities, translating product capabilities into compelling narratives that resonate with revenue leaders and drive pipeline.",
    responsibilities: [
      "Develop and maintain positioning and messaging for core product capabilities, including AI Assistants, CRM, and Marketing Automation",
      "Lead go-to-market planning and execution for new feature and product launches",
      "Partner with Product Management to understand roadmap priorities and translate them into customer-facing narratives",
      "Create sales enablement content, including battlecards, one-pagers, and demo scripts",
      "Conduct win/loss analysis and competitive research to sharpen differentiation",
      "Collaborate with Content and Demand Generation on campaigns, case studies, and website copy",
      "Present product updates and market insights to sales and leadership teams",
    ],
    qualifications: [
      "4+ years of product marketing experience at a B2B SaaS company, ideally in CRM, marketing automation, or sales technology",
      "Proven ability to translate complex technical capabilities into clear, benefit-driven messaging",
      "Experience partnering cross-functionally with Product, Sales, and Content teams",
      "Strong writing and presentation skills",
      "Bachelor's degree in Marketing, Business, Communications, or a related field",
    ],
    preferredSkills: [
      "Experience marketing AI-powered or automation products",
      "Familiarity with sales enablement tools and CRM platforms",
      "Background in competitive intelligence or analyst relations",
    ],
  },
  {
    id: "enterprise-account-executive",
    title: "Enterprise Account Executive",
    team: "Sales",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-07-10",
    description:
      "Own the full sales cycle for enterprise accounts, from first discovery call to signed contract, partnering with Solutions Engineering and Customer Success to build long-term relationships with revenue leaders at growing and enterprise organizations.",
    responsibilities: [
      "Manage the end-to-end enterprise sales cycle: prospecting, discovery, demo, proposal, negotiation, and close",
      "Build and maintain a pipeline of qualified enterprise opportunities in partnership with Marketing and SDR teams",
      "Deliver tailored product demonstrations that connect ZynReach's capabilities to each prospect's revenue goals",
      "Negotiate contract terms and pricing in collaboration with Sales Leadership and Legal",
      "Partner with Solutions Engineering on technical evaluations and proof-of-concept engagements",
      "Maintain accurate forecasting and pipeline data in the CRM",
      "Hand off closed accounts to Customer Success with a clear onboarding plan",
    ],
    qualifications: [
      "5+ years of quota-carrying sales experience, including at least 2 years selling to enterprise accounts",
      "Track record of consistently meeting or exceeding sales targets in a B2B SaaS environment",
      "Experience running consultative, multi-stakeholder sales cycles",
      "Strong negotiation and contract-management skills",
      "Excellent verbal and written communication skills in English",
    ],
    preferredSkills: [
      "Experience selling CRM, marketing automation, or revenue operations software",
      "Familiarity with MEDDIC, Challenger, or a similar sales methodology",
      "Existing relationships with revenue leaders in target verticals such as healthcare, real estate, or manufacturing",
    ],
  },
  {
    id: "customer-success-manager",
    title: "Customer Success Manager",
    team: "Customer Success",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-07-05",
    description:
      "Own onboarding, adoption, and expansion for a portfolio of mid-market and enterprise accounts, acting as the primary relationship owner helping customers realize measurable value from ZynReach.",
    responsibilities: [
      "Guide new customers through onboarding and implementation to a successful first value milestone",
      "Build and execute account success plans tied to each customer's business goals",
      "Monitor product usage and health scores to proactively identify risk and expansion opportunities",
      "Run regular business reviews with customer stakeholders to demonstrate ROI",
      "Partner with Support and Product on escalations and customer feedback",
      "Identify and support upsell and cross-sell opportunities in partnership with Sales",
      "Maintain accurate account records and renewal forecasts",
    ],
    qualifications: [
      "3+ years of experience in customer success, account management, or a related role at a B2B SaaS company",
      "Proven ability to manage a portfolio of mid-market and enterprise accounts",
      "Strong project management and organizational skills",
      "Comfortable presenting to and building relationships with senior stakeholders",
      "Excellent written and verbal communication skills",
    ],
    preferredSkills: [
      "Experience with CRM or marketing automation platforms, either as a user or an implementer",
      "Familiarity with customer health scoring and renewal forecasting tools",
      "Background in a consultative or solutions-oriented customer-facing role",
    ],
  },
  {
    id: "ai-ml-engineer",
    title: "AI/Machine Learning Engineer",
    team: "Engineering",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-07-22",
    description:
      "Design and ship the AI systems behind ZynReach's AI Assistants — drafting, summarization, and deal-risk scoring that run inside every customer's CRM workflow — working at the intersection of applied ML, product, and platform engineering to build AI that's grounded in real customer data, not generic responses.",
    responsibilities: [
      "Design, build, and evaluate LLM-powered features such as email drafting, call summarization, and deal-risk scoring",
      "Develop and maintain retrieval and grounding pipelines that connect AI outputs to real CRM and pipeline data",
      "Partner with Product to define evaluation metrics and run structured experiments to improve model quality",
      "Build monitoring and guardrails to catch hallucinations, bias, and quality regressions before they reach customers",
      "Collaborate with Platform Engineering to ship AI features that scale reliably in production",
      "Stay current with the LLM and applied-AI landscape and evaluate new models, tools, and techniques",
      "Document system design decisions and share findings with the broader engineering team",
    ],
    qualifications: [
      "3+ years of experience building and shipping machine learning or applied AI systems in production",
      "Strong Python skills and experience with modern ML/LLM tooling, including vector databases, embedding models, and evaluation frameworks",
      "Solid understanding of retrieval-augmented generation (RAG) and prompt engineering techniques",
      "Experience working with large-scale structured data such as CRM or pipeline data",
      "Bachelor's or Master's degree in Computer Science, Machine Learning, or a related field, or equivalent practical experience",
    ],
    preferredSkills: [
      "Experience shipping AI features inside a B2B SaaS product",
      "Familiarity with fine-tuning or evaluating open-source LLMs",
      "Background in information retrieval, natural language processing, or applied statistics",
    ],
  },
  {
    id: "solutions-engineer",
    title: "Solutions Engineer",
    team: "Sales",
    location: "Giza, Egypt",
    employmentType: "Full-time",
    datePosted: "2026-07-12",
    description:
      "Serve as the technical partner to our Enterprise Account Executives, running deep-dive product demos, technical evaluations, and proof-of-concept engagements that help prospects see exactly how ZynReach fits their workflow.",
    responsibilities: [
      "Partner with Account Executives on technical discovery calls to understand prospects' existing tools and workflows",
      "Design and deliver tailored product demonstrations and proof-of-concept environments",
      "Own technical responses to security questionnaires and RFPs in partnership with Security and Legal",
      "Translate prospect requirements into integration and implementation plans",
      "Provide technical objection handling during the evaluation and negotiation stages",
      "Partner with Product and Engineering to relay prospect feedback on missing capabilities",
      "Support post-sale handoff to Customer Success with a clear technical implementation plan",
    ],
    qualifications: [
      "3+ years of experience in a solutions engineering, sales engineering, or technical pre-sales role at a B2B SaaS company",
      "Strong understanding of CRM, marketing automation, or workflow automation concepts",
      "Comfortable presenting technical concepts to both technical and non-technical stakeholders",
      "Experience with API-based integrations and basic scripting (e.g., Python or JavaScript) for demo customization",
      "Excellent communication and problem-solving skills",
    ],
    preferredSkills: [
      "Experience selling or supporting AI-powered or automation products",
      "Familiarity with SOC 2, GDPR, or other enterprise security and compliance frameworks",
      "Background in a customer-facing technical role such as implementation, support engineering, or consulting",
    ],
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
