/**
 * Security / Trust Center + Compliance content (SRS Sections 7.5, 7.12).
 * The sub-processor list is one shared source consumed by both pages
 * (SRS 7.12: "shares its data source with Section 7.5's Security page to
 * avoid drift between the two pages").
 */

export const certifications = [
  { name: "SOC 2 Type II", description: "Independently audited controls for security, availability, and confidentiality." },
  { name: "ISO 27001 aligned", description: "Information security management practices aligned to the ISO 27001 framework." },
  { name: "GDPR-ready", description: "Data processing practices designed around GDPR's lawful-basis and data-subject-rights requirements." },
];

export interface SubProcessor {
  name: string;
  purpose: string;
  location: string;
}

export const subProcessors: SubProcessor[] = [
  { name: "Cloud infrastructure provider", purpose: "Application hosting and data storage", location: "United States" },
  { name: "Email delivery provider", purpose: "Transactional and marketing email delivery", location: "United States" },
  { name: "Analytics provider", purpose: "Product and website analytics", location: "United States" },
  { name: "Customer support platform", purpose: "Support ticketing and communication", location: "United States" },
];

export const subProcessorsLastUpdated = "2026-07-15";

export const accessControl = {
  headline: "Enterprise-grade access control",
  description: "SSO and SAML-based authentication for enterprise accounts, with role-based permissions and full audit logging of access to customer data.",
};

export const incidentResponseSummary =
  "ZynReach maintains a documented incident response plan with defined severity levels, on-call escalation, and customer notification timelines consistent with applicable regulatory requirements. Full details are available in the security whitepaper below.";

export interface ComplianceFramework {
  name: string;
  scope: string;
}

export const complianceFrameworks: ComplianceFramework[] = [
  { name: "SOC 2 Type II", scope: "Security, availability, and confidentiality controls, independently audited annually." },
  { name: "ISO 27001", scope: "Information security management system, aligned to ISO 27001 controls." },
  { name: "GDPR", scope: "Lawful basis documentation, data subject rights process, and DPA availability for EU personal data." },
  { name: "CCPA", scope: "California Consumer Privacy Act rights and disclosure practices for California residents." },
];

export const dataResidency =
  "Customer data is hosted in United States-based data centers by default. Region-specific data residency options are available on Enterprise plans — contact your account team for details.";
