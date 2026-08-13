import { describe, it, expect } from "vitest";
import { isRateLimited } from "./rate-limit";

describe("isRateLimited", () => {
  it("allows requests under the limit", () => {
    const key = `test-key-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key)).toBe(false);
    }
  });

  it("blocks the request once the limit is exceeded", () => {
    const key = `test-key-exceed-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      isRateLimited(key);
    }
    expect(isRateLimited(key)).toBe(true);
  });

  it("tracks different keys independently", () => {
    const keyA = `test-key-a-${Date.now()}`;
    const keyB = `test-key-b-${Date.now()}`;
    for (let i = 0; i < 5; i++) isRateLimited(keyA);
    expect(isRateLimited(keyA)).toBe(true);
    expect(isRateLimited(keyB)).toBe(false);
  });
});
