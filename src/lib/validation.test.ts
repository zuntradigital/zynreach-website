import { describe, it, expect } from "vitest";
import { isValidEmail, isWorkEmail, isNonEmpty, isValidPhone, isStrongPassword, isFreeEmailDomain } from "./validation";

describe("isValidEmail", () => {
  it("accepts a well-formed email", () => {
    expect(isValidEmail("jane@example.com")).toBe(true);
  });

  it("rejects a missing @", () => {
    expect(isValidEmail("jane.example.com")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });
});

describe("isWorkEmail", () => {
  it("accepts a company domain", () => {
    expect(isWorkEmail("jane@acmecorp.com")).toBe(true);
  });

  it("rejects a free email domain", () => {
    expect(isWorkEmail("jane@gmail.com")).toBe(false);
  });

  it("rejects an invalid email entirely", () => {
    expect(isWorkEmail("not-an-email")).toBe(false);
  });
});

describe("isFreeEmailDomain", () => {
  it("flags gmail as a free domain", () => {
    expect(isFreeEmailDomain("jane@gmail.com")).toBe(true);
  });

  it("does not flag a company domain", () => {
    expect(isFreeEmailDomain("jane@acmecorp.com")).toBe(false);
  });
});

describe("isNonEmpty", () => {
  it("rejects whitespace-only strings", () => {
    expect(isNonEmpty("   ")).toBe(false);
  });

  it("accepts a non-empty string", () => {
    expect(isNonEmpty("Jane")).toBe(true);
  });
});

describe("isValidPhone", () => {
  it("treats an empty phone as valid (optional field)", () => {
    expect(isValidPhone("")).toBe(true);
  });

  it("accepts a formatted phone number", () => {
    expect(isValidPhone("+1 (555) 123-4567")).toBe(true);
  });

  it("rejects a too-short value", () => {
    expect(isValidPhone("123")).toBe(false);
  });
});

describe("isStrongPassword", () => {
  it("rejects a password under 8 characters", () => {
    expect(isStrongPassword("Ab1")).toBe(false);
  });

  it("rejects a password with no digit", () => {
    expect(isStrongPassword("password")).toBe(false);
  });

  it("accepts a password with letters and a digit, 8+ chars", () => {
    expect(isStrongPassword("Str0ngPass")).toBe(true);
  });
});
