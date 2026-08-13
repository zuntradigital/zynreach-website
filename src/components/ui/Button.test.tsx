import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { Button } from "./Button";

vi.mock("@/lib/analytics", () => ({
  trackCtaClick: vi.fn(),
}));

// Button's href form renders next-intl's locale-aware Link, which reads
// the active locale via useLocale() — that throws outside a
// NextIntlClientProvider, so every render needs one regardless of
// whether the test cares about locale behavior itself.
function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={{}}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("Button", () => {
  it("renders as an anchor when href is provided", () => {
    // /demo resolves to /en/demo: Button's href form renders next-intl's
    // locale-aware Link, which prefixes internal paths with the active
    // locale (set to "en" by renderWithIntl) — the entire point of using
    // that Link over a plain next/link one.
    renderWithIntl(<Button href="/demo">Book a Demo</Button>);
    const link = screen.getByRole("link", { name: "Book a Demo" });
    expect(link).toHaveAttribute("href", "/en/demo");
  });

  it("renders as a native button when no href is provided", () => {
    renderWithIntl(<Button type="submit">Submit</Button>);
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("fires a tracked CTA click when analyticsId is set", async () => {
    const analytics = await import("@/lib/analytics");
    renderWithIntl(
      <Button href="/demo" analyticsId="book-a-demo" analyticsLocation="test">
        Book a Demo
      </Button>
    );
    fireEvent.click(screen.getByRole("link", { name: "Book a Demo" }));
    expect(analytics.trackCtaClick).toHaveBeenCalledWith("book-a-demo", "test");
  });

  it("does not track when analyticsId is omitted", async () => {
    const analytics = await import("@/lib/analytics");
    vi.mocked(analytics.trackCtaClick).mockClear();
    renderWithIntl(<Button href="/trial">Start Free Trial</Button>);
    fireEvent.click(screen.getByRole("link", { name: "Start Free Trial" }));
    expect(analytics.trackCtaClick).not.toHaveBeenCalled();
  });

  it("respects the disabled state on a native button", () => {
    renderWithIntl(<Button disabled>Loading</Button>);
    expect(screen.getByRole("button", { name: "Loading" })).toBeDisabled();
  });
});
