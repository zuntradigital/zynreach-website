import type { BlogAuthor } from "@/types/content";

/**
 * Blog author profiles (SRS Section 7.16 "Authors"). Role-based bylines,
 * consistent with the placeholder-team pattern used on the About page —
 * not claims about specific named individuals.
 */
export const authors: BlogAuthor[] = [
  {
    id: "product-marketing-team",
    name: "Product Marketing Team",
    role: "ZynReach Product Marketing",
    bio: "Writes about platform capabilities, positioning, and what's shipping next.",
  },
  {
    id: "revops-editorial",
    name: "RevOps Editorial",
    role: "ZynReach Editorial",
    bio: "Covers sales and marketing operations practices for growing revenue teams.",
  },
  {
    id: "engineering-team",
    name: "Engineering Team",
    role: "ZynReach Engineering",
    bio: "Writes about how ZynReach is built, including AI architecture and platform design.",
  },
];

export function getAuthor(id: string) {
  return authors.find((author) => author.id === id);
}
