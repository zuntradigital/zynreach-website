const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
]);

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/** SRS 11.1 Form (Generic): "domain-based rules (e.g., work-email check)". */
export function isWorkEmail(value: string): boolean {
  if (!isValidEmail(value)) return false;
  const domain = value.trim().toLowerCase().split("@")[1];
  return !FREE_EMAIL_DOMAINS.has(domain);
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

const PHONE_PATTERN = /^[+]?[\d\s()-]{7,20}$/;

/** SRS 18.2: "phone format validation if provided" — phone is optional, so only checked when non-empty. */
export function isValidPhone(value: string): boolean {
  if (!isNonEmpty(value)) return true;
  return PHONE_PATTERN.test(value.trim());
}

/** SRS 18.3: "Password strength requirement." */
export function isStrongPassword(value: string): boolean {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /[0-9]/.test(value);
}

/** SRS 18.2: soft warning (not hard block) for free-mail domains on the Demo form. */
export function isFreeEmailDomain(value: string): boolean {
  if (!isValidEmail(value)) return false;
  return !isWorkEmail(value);
}
