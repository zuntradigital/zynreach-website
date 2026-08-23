export const companySizeOptions = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-1000", label: "201–1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
];

export const countryOptions = [
  "United States", "Canada", "United Kingdom", "Ireland", "Australia", "New Zealand",
  "Germany", "France", "Netherlands", "Belgium", "Spain", "Italy", "Portugal",
  "Sweden", "Norway", "Denmark", "Finland", "Switzerland", "Austria", "Poland",
  "India", "Singapore", "Japan", "South Korea", "Philippines", "Malaysia",
  "United Arab Emirates", "Saudi Arabia", "South Africa", "Brazil", "Mexico",
  "Argentina", "Colombia", "Other",
].map((name) => ({ value: name, label: name }));

export const industryOptions = [
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "real-estate", label: "Real Estate" },
  { value: "automotive", label: "Automotive" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "technology", label: "Technology & Software" },
  { value: "financial-services", label: "Financial Services" },
  { value: "retail-ecommerce", label: "Retail & E-commerce" },
  { value: "professional-services", label: "Professional Services" },
  { value: "hospitality-travel", label: "Hospitality & Travel" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "other", label: "Other" },
];

export const roleOptions = [
  { value: "founder-executive", label: "Founder / Executive (CEO, COO, etc.)" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "hr", label: "HR" },
  { value: "finance", label: "Finance" },
  { value: "it-engineering", label: "IT / Engineering" },
  { value: "customer-success-support", label: "Customer Success / Support" },
  { value: "other", label: "Other" },
];

export const primaryNeedOptions = [
  { value: "growth-revenue", label: "Growth & Revenue (CRM, marketing, sales)" },
  { value: "ai-automation", label: "AI & Automation" },
  { value: "operations", label: "Operations (projects, tasks, HR, finance)" },
  { value: "intelligence", label: "Analytics & Business Intelligence" },
  { value: "enterprise", label: "Enterprise (security, compliance, scale)" },
  { value: "other", label: "Other" },
];

export const contactReasonOptions = [
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "partnerships", label: "Partnerships" },
  { value: "press", label: "Press" },
  { value: "other", label: "Other" },
];
