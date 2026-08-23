import { describe, it, expect } from "vitest";
import { searchContent, getSearchIndex } from "./search-index";

describe("searchContent", () => {
  it("returns an empty array for an empty query", () => {
    expect(searchContent("")).toEqual([]);
    expect(searchContent("   ")).toEqual([]);
  });

  it("finds matches by title", () => {
    const results = searchContent("CRM");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.title.toLowerCase().includes("crm"))).toBe(true);
  });

  it("returns no results for a nonsense query", () => {
    expect(searchContent("zzzznonexistentqueryzzzz")).toEqual([]);
  });

  it("is case-insensitive", () => {
    const lower = searchContent("pricing");
    const upper = searchContent("PRICING");
    expect(lower.length).toBe(upper.length);
  });
});

describe("getSearchIndex", () => {
  it("includes every content category the site's search scope requires", () => {
    const categories = new Set(getSearchIndex().map((entry) => entry.category));
    expect(categories.has("Platform")).toBe(true);
    expect(categories.has("Blog")).toBe(true);
    expect(categories.has("Customer Stories")).toBe(true);
  });
});
