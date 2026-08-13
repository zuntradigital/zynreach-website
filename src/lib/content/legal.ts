import type { LegalPageContent } from "@/types/content";

/**
 * Legal page content (SRS Section 7.20). Effective date and version are
 * modeled as CMS-managed fields (per SRS: "so Legal & Compliance can
 * publish updates without an engineering release") — hardcoded here until
 * the CMS is wired up, per the static-content-first scope decision.
 * General template structure; final language requires Legal sign-off
 * before production use.
 */
export const legalPages: LegalPageContent[] = [
  {
    slug: "privacy",
    navLabel: "Privacy Policy",
    title: "Privacy Policy",
    effectiveDate: "2026-08-01",
    version: "1.0",
    sections: [
      { id: "introduction", heading: "1. Introduction", body: ["This Privacy Policy explains how ZynReach (\"we,\" \"us\") collects, uses, and protects information collected through this website."] },
      { id: "information-we-collect", heading: "2. Information We Collect", body: ["We collect information you provide directly (name, work email, company details) through forms such as Book a Demo, Free Trial, and Contact.", "We also collect usage data automatically via cookies and similar technologies (see our Cookie Policy)."] },
      { id: "how-we-use-information", heading: "3. How We Use Information", body: ["To respond to inquiries and provide requested demos or trials.", "To route leads to the correct internal team.", "To improve website content and measure marketing effectiveness."] },
      { id: "cookies-tracking", heading: "4. Cookies & Tracking", body: ["We use essential, analytics, and functional cookies. Non-essential cookies only fire after you provide consent via our cookie banner. See our Cookie Policy for details."] },
      { id: "data-sharing", heading: "5. Data Sharing", body: ["We share data with the sub-processors listed on our Security and Compliance pages, solely to operate the service. We do not sell personal information."] },
      { id: "data-retention", heading: "6. Data Retention", body: ["We retain form submission data for as long as necessary to fulfill the purpose it was collected for, and as required by applicable law."] },
      { id: "your-rights", heading: "7. Your Rights", body: ["Depending on your location, you may have rights to access, correct, or delete your personal data. Contact us using the details below to exercise these rights."] },
      { id: "international-transfers", heading: "8. International Transfers", body: ["Data may be processed in the United States. Where required, we rely on appropriate safeguards for international transfers."] },
      { id: "changes", heading: "9. Changes to This Policy", body: ["We may update this policy periodically. The effective date above reflects the latest revision; prior versions are retained and available on request."] },
      { id: "contact", heading: "10. Contact Us", body: ["For privacy questions or data subject requests, contact privacy@zynreach.com."] },
    ],
  },
  {
    slug: "terms",
    navLabel: "Terms of Service",
    title: "Terms of Service",
    effectiveDate: "2026-08-01",
    version: "1.0",
    sections: [
      { id: "acceptance", heading: "1. Acceptance of Terms", body: ["By accessing this website or using ZynReach's services, you agree to these Terms of Service."] },
      { id: "description", heading: "2. Description of Service", body: ["ZynReach provides an AI-powered revenue operations platform, including CRM, marketing automation, and related capabilities, accessed via a separate application."] },
      { id: "accounts", heading: "3. Account Registration", body: ["Trial and paid accounts require accurate registration information. You are responsible for activity under your account."] },
      { id: "acceptable-use", heading: "4. Acceptable Use", body: ["You agree not to misuse the service, including attempting to gain unauthorized access or interfering with normal operation."] },
      { id: "intellectual-property", heading: "5. Intellectual Property", body: ["ZynReach retains all rights to its platform, branding, and website content. You retain rights to your own data."] },
      { id: "fees", heading: "6. Fees & Payment", body: ["Paid plans are billed per the pricing and billing cycle selected at signup. See our Pricing page for current plans."] },
      { id: "termination", heading: "7. Termination", body: ["Either party may terminate service per the terms of the applicable order form or, for self-serve accounts, at any time from account settings."] },
      { id: "disclaimers", heading: "8. Disclaimers", body: ["The service is provided \"as is\" without warranties of any kind, express or implied, except as required by law."] },
      { id: "limitation-of-liability", heading: "9. Limitation of Liability", body: ["To the maximum extent permitted by law, ZynReach's liability is limited as set out in the applicable order form or these terms."] },
      { id: "governing-law", heading: "10. Governing Law", body: ["These terms are governed by the laws of the state of Delaware, without regard to conflict-of-law principles."] },
      { id: "changes", heading: "11. Changes to Terms", body: ["We may update these terms periodically. Material changes will be communicated to active customers."] },
      { id: "contact", heading: "12. Contact Us", body: ["Questions about these terms can be sent to legal@zynreach.com."] },
    ],
  },
  {
    slug: "cookies",
    navLabel: "Cookie Policy",
    title: "Cookie Policy",
    effectiveDate: "2026-08-01",
    version: "1.0",
    sections: [
      { id: "what-are-cookies", heading: "1. What Are Cookies", body: ["Cookies are small text files stored on your device that help websites function and remember preferences."] },
      { id: "types-of-cookies", heading: "2. Types of Cookies We Use", body: ["Essential — required for core site functionality; cannot be disabled.", "Analytics — help us understand site usage; only active with your consent.", "Advertising — support marketing measurement; only active with your consent.", "Functional — remember preferences like language; only active with your consent."] },
      { id: "managing-preferences", heading: "3. Managing Your Preferences", body: ["You can accept, reject, or customize non-essential cookies via the cookie banner shown on your first visit, or by clearing your browser's stored consent to see it again."] },
      { id: "third-party-cookies", heading: "4. Third-Party Cookies", body: ["Some cookies are set by third-party analytics and advertising partners. Their use is governed by their own privacy policies."] },
      { id: "changes", heading: "5. Changes to This Policy", body: ["We may update this policy periodically; the effective date above reflects the latest revision."] },
      { id: "contact", heading: "6. Contact Us", body: ["Questions about cookies can be sent to privacy@zynreach.com."] },
    ],
  },
  {
    slug: "dpa",
    navLabel: "Data Processing Agreement",
    title: "Data Processing Agreement",
    effectiveDate: "2026-08-01",
    version: "1.0",
    sections: [
      { id: "purpose-scope", heading: "1. Purpose & Scope", body: ["This Data Processing Agreement (DPA) applies where ZynReach processes personal data on behalf of a customer as part of the service."] },
      { id: "definitions", heading: "2. Definitions", body: ["Terms such as \"personal data,\" \"processing,\" and \"data subject\" have the meanings given under applicable data protection law (e.g., GDPR)."] },
      { id: "processing", heading: "3. Processing of Personal Data", body: ["ZynReach processes personal data only on documented instructions from the customer, except where required by law."] },
      { id: "sub-processors", heading: "4. Sub-processors", body: ["Current sub-processors are listed on our Compliance page, which is kept in sync with this DPA's sub-processor list."] },
      { id: "security-measures", heading: "5. Security Measures", body: ["ZynReach maintains technical and organizational measures described on our Security page, consistent with SOC 2 Type II controls."] },
      { id: "data-subject-rights", heading: "6. Data Subject Rights", body: ["ZynReach will assist the customer in responding to data subject requests to the extent required by applicable law."] },
      { id: "international-transfers", heading: "7. International Transfers", body: ["Where personal data is transferred internationally, appropriate safeguards are applied consistent with applicable law."] },
      { id: "term-termination", heading: "8. Term & Termination", body: ["This DPA remains in effect for as long as ZynReach processes personal data on the customer's behalf under the underlying agreement."] },
      { id: "contact", heading: "9. Contact Us", body: ["Enterprise customers can request a countersigned copy of this DPA by contacting legal@zynreach.com."] },
    ],
  },
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
