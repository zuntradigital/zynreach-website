interface HoneypotProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * SRS Section 19: "Honeypot fields plus CAPTCHA layered defense." Real
 * bot-detection CAPTCHA (reCAPTCHA/Turnstile) needs a provider site key
 * that doesn't exist yet — this honeypot is the part of the layered
 * defense that needs no third-party credentials, so it ships now.
 *
 * No left/top offset: a 1x1px clipped box is already visually
 * imperceptible without one, and a large negative `left` genuinely
 * extends the page's scrollable area under dir="rtl" (confirmed: this
 * exact div inflated document.scrollWidth to 11279px on an RTL page,
 * a real cross-browser RTL scroll-origin quirk with large negative
 * offsets, not just an LTR-vs-RTL cosmetic difference).
 */
export function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <div aria-hidden="true" className="absolute h-px w-px overflow-hidden">
      <label htmlFor="company_website">Leave this field empty</label>
      <input
        id="company_website"
        name="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
