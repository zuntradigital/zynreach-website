import { captureIntegrationCall } from "@/lib/monitoring";

/**
 * Read path into System B (ZynReach Admin/CMS Dashboard)'s Content
 * Management module — the one place this codebase fetches a page that a
 * ZynReach staff member authored and published through System B's
 * governed Draft → Review → Approve → Publish workflow, rather than
 * shipping as static content in this repo. Unlike the CRM/ATS/status
 * integrations elsewhere in src/lib/services/, System B is a real,
 * already-running system, not a future credential to wire in — so this
 * makes a real HTTP call, not a dev-safe stub. It still degrades
 * gracefully (returns null) when the two env vars aren't configured, so
 * this app keeps running standalone in any environment where System B
 * isn't reachable, matching every other service module's contract.
 */

export interface CmsContentBlock {
  id: string;
  type: string;
  order: number;
  props: Record<string, string>;
}

/** Keyed by MediaAsset id — resolves any `type: "media"` block prop
 * (which only ever holds an id, per System B's block-types.ts) to a
 * renderable, already-absolute {url, altText}. */
export type CmsMediaMap = Record<string, { url: string; altText: string }>;

export interface CmsPage {
  slug: string;
  title: string;
  templateType: string;
  componentBlocks: CmsContentBlock[];
  media: CmsMediaMap;
  publishedAt: string | null;
}

export async function getPublishedCmsPage(slug: string): Promise<CmsPage | null> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-cms", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/pages/${encodeURIComponent(slug)}`, {
      headers: { Authorization: `Bearer ${token}` },
      // A content edit in the Dashboard must be visible immediately —
      // staleness — see the cms page's own `revalidate = 0` comment.
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-cms", res.status === 404 ? "success" : "failure");
      return null;
    }

    const data = (await res.json()) as CmsPage;
    captureIntegrationCall("zynreach-admin-cms", "success");
    return data;
  } catch {
    captureIntegrationCall("zynreach-admin-cms", "failure");
    return null;
  }
}
