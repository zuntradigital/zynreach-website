import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FaqAccordion } from "./FaqAccordion";

const items = [
  { question: "What is ZynReach?", answer: "An AI-powered revenue platform." },
  { question: "Is there a free trial?", answer: "Yes, 14 days, no credit card." },
];

describe("FaqAccordion", () => {
  it("renders all questions collapsed by default", () => {
    render(<FaqAccordion items={items} />);
    const trigger = screen.getByRole("button", { name: items[0].question });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("expands a panel on click and updates aria-expanded", () => {
    render(<FaqAccordion items={items} />);
    const trigger = screen.getByRole("button", { name: items[0].question });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(items[0].answer)).toBeVisible();
  });

  it("collapses the previous panel when a new one opens (single-open mode)", () => {
    render(<FaqAccordion items={items} />);
    const first = screen.getByRole("button", { name: items[0].question });
    const second = screen.getByRole("button", { name: items[1].question });

    fireEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("allows multiple open panels when allowMultiple is set", () => {
    render(<FaqAccordion items={items} allowMultiple />);
    const first = screen.getByRole("button", { name: items[0].question });
    const second = screen.getByRole("button", { name: items[1].question });

    fireEvent.click(first);
    fireEvent.click(second);

    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });
});
