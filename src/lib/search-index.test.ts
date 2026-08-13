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
  it("includes every content category the SRS requires", () => {
    const categories = new Set(getSearchIndex().map((entry) => entry.category));
    expect(categories.has("Platform")).toBe(true);
    expect(categories.has("Documentation")).toBe(true);
    expect(categories.has("Blog")).toBe(true);
    expect(categories.has("Customer Stories")).toBe(true);
  });

  it("ranks Documentation/API results before Blog for the same query term", () => {
    const index = getSearchIndex();
    const firstDocIndex = index.findIndex((e) => e.category === "Documentation");
    const firstBlogIndex = index.findIndex((e) => e.category === "Blog");
    expect(firstDocIndex).toBeLessThan(firstBlogIndex);
  });
});
