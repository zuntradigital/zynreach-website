import { NextResponse } from "next/server";
import { isRateLimited, getClientKey } from "@/lib/rate-limit";

interface DocFeedbackBody {
  docSlug?: string;
  helpful?: boolean;
}

/** SRS 7.17: "Was this helpful?" feedback capture. */
export async function POST(request: Request) {
  if (isRateLimited(`doc-feedback:${getClientKey(request)}`)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let body: DocFeedbackBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.docSlug || typeof body.helpful !== "boolean") {
    return NextResponse.json({ error: "docSlug and helpful are required." }, { status: 400 });
  }

  console.info("[doc-feedback]", JSON.stringify({ docSlug: body.docSlug, helpful: body.helpful, at: new Date().toISOString() }));

  return NextResponse.json({ success: true }, { status: 200 });
}
