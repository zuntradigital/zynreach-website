import { captureIntegrationCall } from "@/lib/monitoring";
import type { BlogPost, BlogAuthor } from "@/types/content";

/**
 * Read path into System B's Blog module (SRS §16) — the live source for
 * the public Blog hub/detail pages, replacing what used to be hardcoded in
 * src/lib/content/blog.ts + authors.ts. Same shape/contract as
 * pricing-content.ts's getPublishedPricing: service-token authenticated,
 * graceful-degradation to null.
 */

export interface BlogListContent {
  posts: BlogPost[];
  authors: BlogAuthor[];
}

export interface BlogPostContent {
  post: BlogPost;
  author: BlogAuthor | null;
  relatedPosts: BlogPost[];
}

export async function getPublishedBlog(locale: string): Promise<BlogListContent | null> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-blog", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/blog?locale=${encodeURIComponent(locale)}`, {
      headers: { Authorization: `Bearer ${token}` },
      // Blog is direct-save with no publish step (see ZynReach Admin's
      // PATCH /api/admin/blog/posts/[id] docstring) — Draft/Published must
      // take effect on the very next request, not after up to 60s of ISR
      // staleness — see the blog pages' own `revalidate = 0` comment.
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-blog", "failure");
      return null;
    }

    const data = (await res.json()) as BlogListContent;
    captureIntegrationCall("zynreach-admin-blog", "success");
    return data;
  } catch {
    captureIntegrationCall("zynreach-admin-blog", "failure");
    return null;
  }
}

/**
 * Return type distinguishes "System B reachable, this slug just isn't a
 * Published post right now" (the literal string "not-found") from "System
 * B unreachable/misconfigured" (null) — direct-save Blog means a post an
 * admin just switched to Draft gets a clean 404 from System B, and the
 * caller must treat that as the definitive answer, not fall back to
 * src/lib/content/blog.ts's stale hardcoded copy the way it does when the
 * whole integration is down.
 */
export async function getPublishedBlogPost(slug: string, locale: string): Promise<BlogPostContent | null | "not-found"> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-blog", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/blog/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        captureIntegrationCall("zynreach-admin-blog", "success");
        return "not-found";
      }
      captureIntegrationCall("zynreach-admin-blog", "failure");
      return null;
    }

    const data = (await res.json()) as BlogPostContent;
    captureIntegrationCall("zynreach-admin-blog", "success");
    return data;
  } catch {
    captureIntegrationCall("zynreach-admin-blog", "failure");
    return null;
  }
}
