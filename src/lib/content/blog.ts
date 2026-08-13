import type { BlogPost } from "@/types/content";

export const blogCategories = ["Product", "Sales Strategy", "Marketing Ops", "AI & Automation"] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "why-crm-data-goes-stale",
    title: "Why CRM data goes stale — and what actually fixes it",
    excerpt: "Most CRM data isn't wrong because reps are careless. It's wrong because logging it is extra work with no immediate payoff.",
    category: "Sales Strategy",
    tags: ["CRM", "Data Quality", "Sales Ops"],
    authorId: "revops-editorial",
    publishedDate: "2026-07-28",
    featured: true,
    body: [
      { type: "paragraph", text: "Ask any sales leader what they'd fix first about their CRM and \"data quality\" comes up almost every time. But the usual response — more mandatory fields, stricter validation, quarterly \"CRM hygiene\" pushes — treats the symptom, not the cause." },
      { type: "heading", id: "the-real-problem", text: "The real problem: logging is a tax on selling" },
      { type: "paragraph", text: "Every manual CRM update is time a rep isn't spending with a prospect. When updating a deal stage requires opening a separate tab, finding the record, and typing a summary, reps do it inconsistently — not because they don't care, but because the system asks them to context-switch away from the thing they're paid to do." },
      { type: "paragraph", text: "The fix isn't more process. It's removing the manual step entirely." },
      { type: "heading", id: "what-actually-works", text: "What actually works" },
      { type: "list", items: [
        "Automated activity logging from email and calendar, so the record updates itself",
        "AI-drafted call summaries attached to the deal automatically",
        "Deal stage suggestions based on real signals, not a dropdown a rep forgets to change",
      ] },
      { type: "paragraph", text: "Teams that make this shift don't just get cleaner data — they get pipeline visibility that reflects what's actually happening, not what got typed in during a Friday afternoon cleanup." },
    ],
    relatedSlugs: ["ai-crm-vs-spreadsheets", "lead-response-time-benchmark"],
  },
  {
    slug: "ai-crm-vs-spreadsheets",
    title: "AI CRM vs. spreadsheets: what changes when you switch",
    excerpt: "Spreadsheets are flexible until they aren't. Here's what actually breaks first as a sales team scales past them.",
    category: "Sales Strategy",
    tags: ["CRM", "SMB", "Sales Ops"],
    authorId: "revops-editorial",
    publishedDate: "2026-07-15",
    body: [
      { type: "paragraph", text: "Spreadsheets are a genuinely good tool for a two-person sales team. The trouble starts around the fifth or sixth rep, when two people are editing the same tab, formulas break silently, and \"who owns this lead\" becomes a Slack thread instead of a field." },
      { type: "heading", id: "where-it-breaks", text: "Where it breaks first" },
      { type: "paragraph", text: "Ownership conflicts and version drift are usually the first cracks. The second is reporting: a spreadsheet can show you today's pipeline, but reconstructing last month's isn't something most teams bother doing, which makes forecast accuracy nearly impossible to improve." },
      { type: "quote", text: "We didn't switch because the spreadsheet broke. We switched because nobody trusted the numbers in it anymore." },
      { type: "paragraph", text: "That's the real trigger for most teams — not a technical failure, but a trust failure. Once forecast numbers stop matching reality, the spreadsheet stops being useful even if it still technically works." },
    ],
    relatedSlugs: ["why-crm-data-goes-stale", "smb-tooling-checklist"],
  },
  {
    slug: "lead-response-time-benchmark",
    title: "What's a good lead response time in 2026?",
    excerpt: "\"Respond fast\" is common advice. Here's what the actual numbers look like, and why the first five minutes matter more than the next five hours.",
    category: "Marketing Ops",
    tags: ["Lead Generation", "Benchmarks"],
    authorId: "revops-editorial",
    publishedDate: "2026-07-08",
    body: [
      { type: "paragraph", text: "Lead response time gets cited constantly, but the benchmark itself is often misquoted. The consistent finding across response-time research: conversion likelihood drops sharply after the first five minutes, then drops again after the first hour." },
      { type: "heading", id: "why-five-minutes", text: "Why five minutes, specifically" },
      { type: "paragraph", text: "It's not magic — it's attention. A visitor who just filled out a form is still on your site, still thinking about the problem they came to solve. An hour later, they've moved on to three other tabs and two other vendors." },
      { type: "heading", id: "what-slows-teams-down", text: "What actually slows teams down" },
      { type: "list", items: [
        "Manual lead qualification before routing",
        "Leads sitting in a shared inbox instead of being assigned automatically",
        "No clear ownership rule for territory or company size",
      ] },
      { type: "paragraph", text: "None of these are people problems — they're routing problems. Automating qualification and assignment is usually the single highest-leverage fix." },
    ],
    relatedSlugs: ["why-crm-data-goes-stale", "ai-assistants-explained"],
  },
  {
    slug: "smb-tooling-checklist",
    title: "The 5-tool checklist every growing SMB outgrows",
    excerpt: "Spreadsheet CRM, separate email tool, separate forms, separate analytics, separate automation — here's when each one starts costing more than it saves.",
    category: "Sales Strategy",
    tags: ["SMB", "Tool Consolidation"],
    authorId: "product-marketing-team",
    publishedDate: "2026-06-30",
    body: [
      { type: "paragraph", text: "Most SMBs don't set out to run five disconnected tools. It happens gradually: a spreadsheet for leads, an email tool for campaigns, a forms plugin for the website, a separate analytics dashboard, and eventually a Zapier chain trying to hold it all together." },
      { type: "heading", id: "the-tell", text: "The tell that it's time to consolidate" },
      { type: "paragraph", text: "The clearest signal isn't cost — it's the moment someone asks \"how many leads did we get from last week's campaign\" and the honest answer requires checking three different tools and reconciling them by hand." },
      { type: "paragraph", text: "At that point, the integration tax (time spent connecting and reconciling tools) usually exceeds what a unified platform would cost outright." },
    ],
    relatedSlugs: ["ai-crm-vs-spreadsheets", "marketing-attribution-explained"],
  },
  {
    slug: "marketing-attribution-explained",
    title: "Marketing attribution, explained without the jargon",
    excerpt: "First-touch, last-touch, multi-touch — the terminology is confusing, but the underlying question is simple: what actually drove this deal?",
    category: "Marketing Ops",
    tags: ["Attribution", "Analytics"],
    authorId: "product-marketing-team",
    publishedDate: "2026-06-20",
    body: [
      { type: "paragraph", text: "Attribution models exist to answer one question: when a deal closes, which marketing touches deserve credit? The honest answer is usually \"several of them,\" which is why single-touch models (first-touch, last-touch) tend to mislead more than they help." },
      { type: "heading", id: "why-multi-touch", text: "Why multi-touch models tend to win" },
      { type: "paragraph", text: "A prospect might read a blog post, ignore three emails, attend a webinar, and finally convert after a demo. Crediting only the demo (last-touch) makes top-of-funnel content look worthless — even though it's what got the prospect there in the first place." },
      { type: "paragraph", text: "The practical requirement for multi-touch attribution isn't a fancier model — it's a single data model where marketing touches and CRM deal data actually live together, instead of being reconciled after the fact." },
    ],
    relatedSlugs: ["smb-tooling-checklist", "lead-response-time-benchmark"],
  },
  {
    slug: "ai-assistants-explained",
    title: "What \"AI Assistants embedded in your CRM\" actually means",
    excerpt: "Not a chatbot bolted onto the sidebar. Here's what it looks like when AI is grounded in your actual pipeline data.",
    category: "AI & Automation",
    tags: ["AI", "Product"],
    authorId: "engineering-team",
    publishedDate: "2026-06-10",
    featured: true,
    body: [
      { type: "paragraph", text: "\"AI-powered\" has become a label nearly every SaaS product claims, which makes it worth being specific about what it actually means in a CRM context." },
      { type: "heading", id: "grounded-vs-generic", text: "Grounded vs. generic" },
      { type: "paragraph", text: "A generic AI assistant answers questions using general knowledge. A grounded assistant answers using your actual deal history, your actual email threads, and your actual pipeline data — which is the difference between a plausible-sounding follow-up email and one that references the right proposal, the right objection, and the right next step." },
      { type: "heading", id: "where-it-fits", text: "Where it fits in the workflow" },
      { type: "list", items: [
        "Drafting follow-up emails from real call and email context",
        "Summarizing calls automatically into the CRM record",
        "Flagging deals with declining engagement before they go cold",
      ] },
      { type: "paragraph", text: "The common thread: the AI works inside the tools reps already use, on data that's already there — not as a separate destination they have to remember to check." },
    ],
    relatedSlugs: ["why-crm-data-goes-stale", "lead-response-time-benchmark"],
  },
  {
    slug: "no-code-workflow-patterns",
    title: "Five no-code workflow patterns worth stealing",
    excerpt: "Practical automation patterns that connect CRM, marketing, and support without a single engineering ticket.",
    category: "AI & Automation",
    tags: ["Automation", "Workflow"],
    authorId: "engineering-team",
    publishedDate: "2026-05-28",
    body: [
      { type: "paragraph", text: "The best workflow automations aren't clever — they're the boring hand-offs that used to require someone remembering to do them manually." },
      { type: "list", items: [
        "Auto-create an onboarding task list the moment a deal closes",
        "Route a support ticket to sales when a churn-risk keyword appears",
        "Trigger a re-engagement campaign after 30 days of no activity",
        "Escalate a deal for approval when a discount exceeds a threshold",
        "Notify a CSM automatically when usage drops below a baseline",
      ] },
      { type: "paragraph", text: "None of these require custom code — they require a trigger, a condition, and an action, chained together once and left to run." },
    ],
    relatedSlugs: ["ai-assistants-explained", "smb-tooling-checklist"],
  },
  {
    slug: "product-update-ai-assistants-ga",
    title: "Product update: AI Assistants is now generally available",
    excerpt: "AI Assistants moves from early access to general availability, with drafting, summarization, and deal-risk flagging available on the Growth plan.",
    category: "Product",
    tags: ["Product Update", "AI"],
    authorId: "product-marketing-team",
    publishedDate: "2026-05-15",
    body: [
      { type: "paragraph", text: "AI Assistants is now generally available on the Growth and Enterprise plans, following several months of early access with a limited set of customers." },
      { type: "heading", id: "whats-included", text: "What's included at GA" },
      { type: "list", items: [
        "AI-drafted follow-up emails grounded in deal context",
        "Automatic call and meeting summarization",
        "Deal-risk flagging based on engagement signals",
      ] },
      { type: "paragraph", text: "See the full breakdown on the AI Assistants capability page, or check the Changelog for the complete release history." },
    ],
    relatedSlugs: ["ai-assistants-explained"],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

const WORDS_PER_MINUTE = 200;

export function getReadingTimeMinutes(post: BlogPost): number {
  const wordCount = post.body.reduce((count, block) => {
    if (block.type === "paragraph" || block.type === "heading") return count + block.text.split(/\s+/).length;
    if (block.type === "quote") return count + block.text.split(/\s+/).length;
    if (block.type === "list") return count + block.items.join(" ").split(/\s+/).length;
    return count;
  }, 0);
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
