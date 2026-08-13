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

export const contactReasonOptions = [
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "partnerships", label: "Partnerships" },
  { value: "press", label: "Press" },
  { value: "other", label: "Other" },
];
