import type { CapabilityPageContent } from "@/types/content";

/**
 * Content for the 6 capability pages (SRS Section 7.3 shared template).
 * H1 / meta title / meta description sourced from SRS Section 26 Content
 * Inventory; feature blocks, how-it-works, and comparison copy expand on
 * the SRS page-purpose statements using the same brand voice as Home.
 */
export const capabilityPages: CapabilityPageContent[] = [
  {
    slug: "ai-assistants",
    navLabel: "AI Assistants",
    meta: {
      h1: "AI that works inside every workflow",
      title: "ZynReach AI Assistants",
      description:
        "Native AI assistants that draft, summarize, and automate across the platform.",
    },
    hero: {
      headline: "AI that works inside every workflow",
      subhead:
        "Not a chatbot bolted onto the side — AI assistants embedded directly in CRM, marketing, and workflow automation, grounded in your data.",
    },
    whoItsFor: [
      { label: "Sales Teams", href: "/solutions/sales" },
      { label: "Marketing Teams", href: "/solutions/marketing" },
      { label: "Enterprise", href: "/solutions/enterprise" },
    ],
    featureBlocks: [
      {
        headline: "Drafts follow-ups and proposals",
        description:
          "AI writes the first draft of every follow-up email, call summary, or proposal — grounded in the actual deal context, not a generic template.",
        proof: { stat: "5+ hrs", label: "saved per rep, per week" },
      },
      {
        headline: "Summarizes calls automatically",
        description:
          "Call and meeting notes are captured, summarized, and logged to the right record without a rep touching a keyboard.",
        proof: { stat: "100%", label: "of calls logged, automatically" },
      },
      {
        headline: "Flags at-risk deals early",
        description:
          "AI monitors deal signals — response time, engagement, sentiment — and surfaces at-risk deals before they stall.",
        proof: { stat: "2x", label: "earlier risk detection vs. manual review" },
      },
      {
        headline: "Automates repetitive data entry",
        description:
          "Contact and deal fields update automatically from email, calendar, and call activity, so CRM data stays accurate without manual upkeep.",
        proof: { stat: "0", label: "manual re-keying required" },
      },
    ],
    howItWorks: [
      {
        headline: "Connect your data",
        description: "Link email, calendar, and CRM records — AI reads context from what's already there.",
      },
      {
        headline: "AI learns your workflows",
        description: "Assistants adapt to how your team actually works, not a fixed script.",
      },
      {
        headline: "AI drafts and suggests",
        description: "Follow-ups, summaries, and next steps appear ready for review inside the workflow.",
      },
      {
        headline: "You approve and send",
        description: "Every AI action stays human-reviewed by default — nothing sends without a rep's approval.",
      },
    ],
    comparison: {
      title: "AI Assistants vs. manual admin work",
      statusQuo:
        "Reps spend hours a week writing follow-ups, logging notes, and re-keying data between calls.",
      withZynReach:
        "AI drafts the follow-up, logs the notes, and updates the record automatically — reps review and send.",
    },
    relatedIntegrations: ["Email & Calendar", "CRM Data", "Call Recording", "Collaboration"],
    seoKeywordCluster: "AI CRM assistant, AI sales assistant software",
  },
  {
    slug: "workflow-automation",
    navLabel: "Workflow Automation",
    meta: {
      h1: "Automate the busywork between every team",
      title: "ZynReach Workflow Automation",
      description:
        "Build no-code workflows that connect CRM, marketing, and support.",
    },
    hero: {
      headline: "Automate the busywork between every team",
      subhead:
        "No-code workflows connect CRM, marketing, and support so hand-offs happen automatically instead of falling through the cracks.",
    },
    whoItsFor: [
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Agencies", href: "/solutions/agencies" },
      { label: "Sales Teams", href: "/solutions/sales" },
    ],
    featureBlocks: [
      {
        headline: "No-code workflow builder",
        description: "Build multi-step automations across CRM, marketing, and support with a visual builder — no engineering ticket required.",
        proof: { stat: "0", label: "code required" },
      },
      {
        headline: "Cross-team triggers",
        description: "A support ticket can trigger a CRM update; a closed deal can trigger an onboarding sequence.",
        proof: { stat: "3+", label: "systems, one workflow" },
      },
      {
        headline: "Approval flows",
        description: "Add human approval steps to any automation for discount approvals, contract review, or escalations.",
        proof: { stat: "100%", label: "auditable approval trail" },
      },
      {
        headline: "Error handling & alerts",
        description: "Failed steps notify the right owner automatically instead of silently dropping work.",
        proof: { stat: "0", label: "silent failures" },
      },
    ],
    howItWorks: [
      { headline: "Pick a trigger", description: "Start from a CRM, marketing, or support event." },
      { headline: "Add automated steps", description: "Chain updates, notifications, and hand-offs visually." },
      { headline: "Insert approvals where needed", description: "Keep a human in the loop for high-stakes steps." },
      { headline: "Monitor and refine", description: "See every run, catch failures, and adjust the workflow over time." },
    ],
    comparison: {
      title: "No-code workflows vs. manual hand-offs",
      statusQuo: "Hand-offs between sales, marketing, and support rely on someone remembering to notify the next team.",
      withZynReach: "Hand-offs trigger automatically the moment the underlying event happens.",
    },
    relatedIntegrations: ["Support & Helpdesk", "Billing & Payments", "Collaboration", "Developer & API"],
    seoKeywordCluster: "no-code workflow automation, CRM workflow builder",
  },
  {
    slug: "analytics",
    navLabel: "Analytics",
    meta: {
      h1: "See revenue performance in real time",
      title: "ZynReach Analytics",
      description:
        "Unified reporting across CRM, marketing, and automation data.",
    },
    hero: {
      headline: "See revenue performance in real time",
      subhead:
        "One reporting layer across CRM, marketing, and automation data — no manual reconciliation between four dashboards.",
    },
    whoItsFor: [
      { label: "Marketing Teams", href: "/solutions/marketing" },
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Sales Teams", href: "/solutions/sales" },
    ],
    featureBlocks: [
      {
        headline: "Unified reporting",
        description: "Pipeline, campaign, and automation data live in one model, so reports don't need reconciling by hand.",
        proof: { stat: "1", label: "unified source of attribution truth" },
      },
      {
        headline: "Custom dashboards",
        description: "Build role-specific dashboards for reps, managers, and executives from the same underlying data.",
        proof: { stat: "0", label: "spreadsheet exports needed" },
      },
      {
        headline: "Forecasting",
        description: "AI-assisted forecasts factor in deal engagement signals, not just stage and close date.",
        proof: { stat: "real-time", label: "forecast updates" },
      },
      {
        headline: "Attribution you can trust",
        description: "Multi-touch attribution reflects the actual customer journey across marketing and sales touches.",
        proof: { stat: "1", label: "attribution model, sitewide" },
      },
    ],
    howItWorks: [
      { headline: "Data flows in automatically", description: "CRM, marketing, and automation activity feed one model." },
      { headline: "Build your dashboard", description: "Choose the metrics that matter for your role." },
      { headline: "Track in real time", description: "Numbers update as activity happens — no nightly batch job." },
      { headline: "Share and act", description: "Export, share, or trigger a workflow directly off a report." },
    ],
    comparison: {
      title: "Unified analytics vs. spreadsheet reporting",
      statusQuo: "Reporting means exporting spreadsheets from four dashboards and reconciling them by hand.",
      withZynReach: "One dashboard shows the real, current state of pipeline and campaign performance.",
    },
    relatedIntegrations: ["Analytics & BI", "Billing & Payments", "Developer & API", "Collaboration"],
    seoKeywordCluster: "revenue analytics software, unified CRM marketing reporting",
  },
  {
    slug: "ai-workspace",
    navLabel: "AI Workspace",
    meta: {
      h1: "One home base for every AI tool your team uses",
      title: "ZynReach AI Workspace",
      description:
        "AI Assistant, prompt library, knowledge base, and AI insights in one workspace, grounded in your data.",
    },
    hero: {
      headline: "One home base for every AI tool your team uses",
      subhead:
        "AI Assistant, prompt library, knowledge base, and AI insights live in one workspace — grounded in your data, not scattered across a separate app your team has to remember to open.",
    },
    whoItsFor: [
      { label: "Sales Teams", href: "/solutions/sales" },
      { label: "Marketing Teams", href: "/solutions/marketing" },
      { label: "Enterprise", href: "/solutions/enterprise" },
    ],
    featureBlocks: [
      {
        headline: "One AI Assistant, always available",
        description:
          "A single assistant grounded in your company's data sits inside every workflow, instead of a separate chatbot per tool.",
        proof: { stat: "1 assistant", label: "across every workflow" },
      },
      {
        headline: "Shared prompt library",
        description:
          "Save prompts that work and share them across the team, so no one starts from a blank box every time.",
        proof: { stat: "0", label: "prompts rewritten from scratch" },
      },
      {
        headline: "Knowledge base grounding",
        description:
          "AI answers pull from your actual documents and data, not the open internet, so responses reflect how your business really works.",
        proof: { stat: "100%", label: "grounded in your data" },
      },
      {
        headline: "A running feed of AI insights",
        description:
          "Insights worth acting on surface automatically in the workspace as your data changes, instead of waiting to be asked.",
        proof: { stat: "Daily", label: "insights surfaced automatically" },
      },
    ],
    howItWorks: [
      { headline: "Connect your knowledge sources", description: "Link documents, CRM data, and past conversations." },
      { headline: "Save prompts your team reuses", description: "Build a shared library instead of starting cold each time." },
      { headline: "Ask the assistant anything", description: "Every answer is grounded in your connected data." },
      { headline: "Insights surface as data changes", description: "The workspace flags what's worth your attention, automatically." },
    ],
    comparison: {
      title: "AI Workspace vs. scattered AI tools",
      statusQuo:
        "Teams juggle multiple disconnected AI tools, with useful prompts lost in chat history and no shared grounding in company data.",
      withZynReach:
        "One workspace holds the assistant, the prompt library, and the knowledge it's grounded in, together.",
    },
    relatedIntegrations: ["Collaboration", "Developer & API", "CRM Data", "Analytics & BI"],
    seoKeywordCluster: "AI workspace software, team AI assistant and knowledge base",
  },
  {
    slug: "ai-agents",
    navLabel: "AI Agents",
    meta: {
      h1: "AI that takes action, not just answers",
      title: "ZynReach AI Agents",
      description:
        "AI Agents execute multi-step processes end to end, not just generate text or chat.",
    },
    hero: {
      headline: "AI that takes action, not just answers",
      subhead:
        "AI Agents don't just draft a reply — they execute multi-step processes end to end: updating records, sending follow-ups, and moving work forward without waiting on a rep to do it manually.",
    },
    whoItsFor: [
      { label: "Sales Teams", href: "/solutions/sales" },
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Agencies", href: "/solutions/agencies" },
    ],
    featureBlocks: [
      {
        headline: "Multi-step process execution",
        description:
          "Agents complete entire processes — not a single reply — chaining together the steps a task actually requires from start to finish.",
        proof: { stat: "Multi-step", label: "processes run end-to-end" },
      },
      {
        headline: "Action-taking, not just chat",
        description:
          "Agents update records, send messages, and trigger the next step in a workflow directly — real actions, not just a suggestion to review.",
        proof: { stat: "Real actions", label: "not just suggestions" },
      },
      {
        headline: "Human checkpoints where it matters",
        description:
          "Approval steps insert at the points that need a human sign-off, so autonomy and oversight coexist by design.",
        proof: { stat: "100%", label: "auditable agent actions" },
      },
      {
        headline: "Works across the whole platform",
        description:
          "The same agent framework plugs into pipeline, campaigns, and automation steps — one capability, many workflows.",
        proof: { stat: "1 agent", label: "many workflows automated" },
      },
    ],
    howItWorks: [
      { headline: "Define the process an agent should run", description: "Describe the multi-step outcome you want handled." },
      { headline: "Set guardrails and approval checkpoints", description: "Choose where a human needs to sign off." },
      { headline: "The agent executes the steps automatically", description: "Records update, messages send, workflows advance." },
      { headline: "Review the audit trail of every action", description: "Every step an agent takes is logged and reviewable." },
    ],
    comparison: {
      title: "AI Agents vs. AI that only drafts",
      statusQuo:
        "AI assistants that only draft text still leave the actual work — updating records, sending it, moving the process forward — for someone to finish.",
      withZynReach:
        "AI Agents execute the process end to end, with approvals where you need them and a full audit trail after.",
    },
    relatedIntegrations: ["CRM Data", "Developer & API", "Collaboration"],
    seoKeywordCluster: "AI agents software, agentic AI automation",
  },
  {
    slug: "ai-insights",
    navLabel: "AI Insights",
    meta: {
      h1: "Know which deal, lead, or message to work next",
      title: "ZynReach AI Insights",
      description:
        "AI lead scoring, message generation, and context-aware recommendations across the platform.",
    },
    hero: {
      headline: "Know which deal, lead, or message to work next",
      subhead:
        "AI lead scoring, generated messaging, and context-aware recommendations point your team at what matters most — the analytical layer that tells you where to focus.",
    },
    whoItsFor: [
      { label: "Sales Teams", href: "/solutions/sales" },
      { label: "Marketing Teams", href: "/solutions/marketing" },
      { label: "Enterprise", href: "/solutions/enterprise" },
    ],
    featureBlocks: [
      {
        headline: "AI lead and deal scoring",
        description:
          "Leads and deals are ranked continuously by real engagement signals, so effort goes where it's most likely to convert.",
        proof: { stat: "Real-time", label: "score updates as data changes" },
      },
      {
        headline: "AI message generation",
        description:
          "Outreach and follow-up messages draft automatically, grounded in the actual contact and deal context.",
        proof: { stat: "Seconds", label: "to a first message draft" },
      },
      {
        headline: "Intelligent recommendations",
        description:
          "A next-best-action surfaces on every deal and contact, so reps always know what to do next without guessing.",
        proof: { stat: "1", label: "recommended next step, always visible" },
      },
      {
        headline: "Context-aware assistance",
        description:
          "Insights adapt to whatever record you're viewing, pulling in the relevant history automatically instead of making you look it up.",
        proof: { stat: "0", label: "manual digging for context" },
      },
    ],
    howItWorks: [
      { headline: "Data flows in from every module", description: "CRM, marketing, and activity data feed one model." },
      { headline: "AI scores leads and deals continuously", description: "Scores update as new engagement signals arrive." },
      { headline: "Recommendations surface in context", description: "Next-best-actions appear right on the record." },
      { headline: "Act directly from the insight", description: "Send the drafted message or move the deal forward in one click." },
    ],
    comparison: {
      title: "AI Insights vs. gut-feel prioritization",
      statusQuo:
        "Reps guess which leads and deals to prioritize based on memory and instinct, with no consistent signal to go on.",
      withZynReach:
        "Scores and recommendations tell every rep exactly where to focus, updated automatically as data changes.",
    },
    relatedIntegrations: ["CRM Data", "Analytics & BI", "Email & Calendar"],
    seoKeywordCluster: "AI lead scoring software, AI sales recommendations",
  },
  {
    slug: "automation-center",
    navLabel: "Automation Center",
    meta: {
      h1: "The visual builder behind every automation",
      title: "ZynReach Automation Center",
      description:
        "A no-code builder for triggers, conditions, actions, and AI Agent steps, with live run monitoring.",
    },
    hero: {
      headline: "The visual builder behind every automation",
      subhead:
        "Triggers, conditions, actions, and AI Agent steps — assembled visually, monitored in real time, and extendable to any process across the platform.",
    },
    whoItsFor: [
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Agencies", href: "/solutions/agencies" },
      { label: "Sales Teams", href: "/solutions/sales" },
    ],
    featureBlocks: [
      {
        headline: "Visual workflow builder",
        description:
          "Assemble triggers, conditions, and actions on a visual canvas — no engineering ticket required to build or edit an automation.",
        proof: { stat: "0 code", label: "to build an automation" },
      },
      {
        headline: "Conditional branching logic",
        description:
          "Branch automations by any field, event, or outcome, so one workflow can handle every path a process actually takes.",
        proof: { stat: "Unlimited", label: "branching paths per workflow" },
      },
      {
        headline: "AI Agent steps built in",
        description:
          "Drop an AI Agent into any step of an automation, so multi-step actions run alongside standard triggers and updates.",
        proof: { stat: "1 click", label: "to add an AI Agent step" },
      },
      {
        headline: "Live execution monitoring",
        description:
          "Watch every run as it happens and catch a failed step immediately, instead of finding out a process silently broke weeks later.",
        proof: { stat: "Real-time", label: "run monitoring" },
      },
    ],
    howItWorks: [
      { headline: "Pick a trigger event", description: "Start from any event across CRM, marketing, or support." },
      { headline: "Add conditions and branches", description: "Build the logic that routes the workflow correctly." },
      { headline: "Add actions, including AI Agent steps", description: "Chain updates, notifications, and agent-run steps together." },
      { headline: "Monitor every run and refine", description: "See execution history and adjust the workflow as needed." },
    ],
    comparison: {
      title: "Automation Center vs. one-off scripts",
      statusQuo:
        "Automations get built ad hoc by whoever has spare dev time, break silently, and are hard for anyone else to edit.",
      withZynReach:
        "Anyone can build, branch, and monitor an automation visually — including steps an AI Agent runs on its own.",
    },
    relatedIntegrations: ["Developer & API", "Collaboration", "Support & Helpdesk", "Billing & Payments"],
    seoKeywordCluster: "workflow automation builder, visual automation software",
  },
  {
    slug: "reports",
    navLabel: "Reports",
    meta: {
      h1: "Operational reports, ready when you need them",
      title: "ZynReach Reports",
      description:
        "Build, run, and export operational reports across pipeline, activity, and campaign data.",
    },
    hero: {
      headline: "Operational reports, ready when you need them",
      subhead:
        "Build, run, and export the reports your team actually needs — pipeline detail, campaign performance, activity logs — without waiting on a dashboard rebuild.",
    },
    whoItsFor: [
      { label: "Sales Teams", href: "/solutions/sales" },
      { label: "Marketing Teams", href: "/solutions/marketing" },
      { label: "Enterprise", href: "/solutions/enterprise" },
    ],
    featureBlocks: [
      {
        headline: "Prebuilt operational templates",
        description:
          "Common reports — pipeline detail, activity logs, campaign performance — are ready to run without building them from scratch.",
        proof: { stat: "Prebuilt", label: "report templates ready to run" },
      },
      {
        headline: "Custom report builder",
        description:
          "Filter and group any underlying dataset into a report tailored to exactly what a team or a request needs.",
        proof: { stat: "0", label: "SQL or engineering required" },
      },
      {
        headline: "Exportable, shareable formats",
        description:
          "Export to CSV, PDF, or spreadsheet-ready formats so a report can go anywhere it's needed — inbox, deck, or drive.",
        proof: { stat: "3 formats", label: "export ready" },
      },
      {
        headline: "One click into scheduled delivery",
        description:
          "Any report can be handed off to Scheduled Reports for automatic recurring delivery, with no rebuilding required.",
        proof: { stat: "1 click", label: "to schedule delivery" },
      },
    ],
    howItWorks: [
      { headline: "Pick a template or build your own", description: "Start from a prebuilt report or a custom filter set." },
      { headline: "Filter and group the data you need", description: "Narrow to the exact slice a request calls for." },
      { headline: "Run it on demand", description: "Reports generate immediately against live data." },
      { headline: "Export or schedule delivery", description: "Send it once, or hand it off for automatic recurring delivery." },
    ],
    comparison: {
      title: "Reports vs. ad hoc spreadsheet pulls",
      statusQuo:
        "Every report request means someone manually pulling and pivoting data into a spreadsheet on request.",
      withZynReach:
        "Operational reports run on demand from live data, ready to export or schedule in a few clicks.",
    },
    relatedIntegrations: ["Analytics & BI", "Developer & API", "Billing & Payments"],
    seoKeywordCluster: "operational reporting software, exportable business reports",
  },
  {
    slug: "business-intelligence",
    navLabel: "Business Intelligence",
    meta: {
      h1: "Cross-suite intelligence for leadership",
      title: "ZynReach Business Intelligence",
      description:
        "Executive-level, cross-suite analytics and white-label reporting across the whole business.",
    },
    hero: {
      headline: "Cross-suite intelligence for leadership",
      subhead:
        "Business Intelligence rolls up CRM, marketing, and automation data into executive-level insight — cross-functional, white-label-ready, and built for decisions above any single team's metrics.",
    },
    whoItsFor: [
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Agencies", href: "/solutions/agencies" },
    ],
    featureBlocks: [
      {
        headline: "Cross-suite analytics",
        description:
          "Data from CRM, marketing, and automation blends into one model, instead of remaining siloed per-team dashboards.",
        proof: { stat: "1 model", label: "every module, one view" },
      },
      {
        headline: "Executive-level insights",
        description:
          "Trends, anomalies, and shifts across the business surface automatically, framed for leadership decisions, not team-level detail.",
        proof: { stat: "Auto-surfaced", label: "trends & anomalies" },
      },
      {
        headline: "White-label reporting",
        description:
          "Brand BI reports for client or board delivery, so agencies and enterprises can present insight as their own polished output.",
        proof: { stat: "White-label", label: "ready for client delivery" },
      },
      {
        headline: "Whole-business rollups",
        description:
          "Revenue, pipeline, and marketing performance roll up into one view built for decisions that span every team.",
        proof: { stat: "1 rollup", label: "whole business" },
      },
    ],
    howItWorks: [
      { headline: "Connect every module's data", description: "CRM, marketing, and automation activity feed one model." },
      { headline: "BI blends it into one cross-suite model", description: "Data unifies without manual reconciliation." },
      { headline: "Insights and anomalies surface automatically", description: "Leadership sees what changed and why." },
      { headline: "Share white-label reports with stakeholders", description: "Present branded, board- or client-ready output." },
    ],
    comparison: {
      title: "Business Intelligence vs. siloed team dashboards",
      statusQuo:
        "Each team has its own dashboard, and no one has a shared, cross-functional picture of the whole business.",
      withZynReach:
        "One BI layer sits above every team's data, surfacing the insight leadership actually needs to decide.",
    },
    relatedIntegrations: ["Analytics & BI", "Collaboration", "Developer & API"],
    seoKeywordCluster: "business intelligence software, cross-functional analytics platform",
  },
  {
    slug: "executive-dashboards",
    navLabel: "Executive Dashboards",
    meta: {
      h1: "Dashboards built for the view from the top",
      title: "ZynReach Executive Dashboards",
      description:
        "Purpose-built CEO, COO, CRO, and CFO-level rollups across the whole business.",
    },
    hero: {
      headline: "Dashboards built for the view from the top",
      subhead:
        "Purpose-built rollups for CEO, COO, CRO, and CFO-level visibility — the whole business on one screen, not one team's numbers dressed up.",
    },
    whoItsFor: [
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Agencies", href: "/solutions/agencies" },
    ],
    featureBlocks: [
      {
        headline: "Role-specific executive views",
        description:
          "CEO, COO, CRO, and CFO dashboards come pre-built with the rollups each role actually needs, out of the box.",
        proof: { stat: "4 roles", label: "dashboards ready out of the box" },
      },
      {
        headline: "Whole-business rollups",
        description:
          "Revenue, pipeline, marketing, and support performance sit on one screen, instead of one team's metrics dressed up as the whole picture.",
        proof: { stat: "1 screen", label: "the whole business" },
      },
      {
        headline: "Board-ready presentation",
        description:
          "Dashboards export as polished, board- and investor-ready visuals without a separate deck-building step.",
        proof: { stat: "Board-ready", label: "in one export" },
      },
      {
        headline: "Live, not static",
        description:
          "Numbers update as the underlying data changes, so leadership is never presenting last month's snapshot as current.",
        proof: { stat: "Real-time", label: "always current" },
      },
    ],
    howItWorks: [
      { headline: "Choose a leadership role or rollup", description: "Start from a CEO, COO, CRO, or CFO view." },
      { headline: "Dashboard assembles from live data", description: "Cross-suite data populates the rollup automatically." },
      { headline: "Review whole-business performance", description: "See revenue, pipeline, and marketing in one view." },
      { headline: "Export or present board-ready", description: "Share a polished view without a separate deck." },
    ],
    comparison: {
      title: "Executive Dashboards vs. the monthly deck",
      statusQuo:
        "Leadership waits on a manually built monthly slide deck that's already stale by the time it's presented.",
      withZynReach:
        "A live dashboard stays current at all times and exports board-ready whenever leadership needs it.",
    },
    relatedIntegrations: ["Analytics & BI", "Collaboration"],
    seoKeywordCluster: "executive dashboard software, CEO CFO business dashboards",
  },
  {
    slug: "scheduled-reports",
    navLabel: "Scheduled Reports",
    meta: {
      h1: "Reports that show up before you ask",
      title: "ZynReach Scheduled Reports",
      description:
        "Automated report generation and delivery on a daily, weekly, or monthly schedule.",
    },
    hero: {
      headline: "Reports that show up before you ask",
      subhead:
        "Set it once — daily, weekly, or monthly digests land in the right inbox automatically, so stakeholders never have to chase a number down.",
    },
    whoItsFor: [
      { label: "Sales Teams", href: "/solutions/sales" },
      { label: "Marketing Teams", href: "/solutions/marketing" },
      { label: "Enterprise", href: "/solutions/enterprise" },
    ],
    featureBlocks: [
      {
        headline: "Flexible scheduling",
        description:
          "Set any report to run daily, weekly, or monthly, matching the cadence each stakeholder actually needs.",
        proof: { stat: "3 cadences", label: "daily, weekly, monthly" },
      },
      {
        headline: "Automatic generation",
        description:
          "Reports build themselves on schedule against live data, with no one needing to remember to run them.",
        proof: { stat: "0", label: "manual runs required" },
      },
      {
        headline: "Direct inbox delivery",
        description:
          "Reports land straight in a stakeholder's inbox on schedule, with no dashboard login required to see them.",
        proof: { stat: "0", label: "logins required to receive a report" },
      },
      {
        headline: "Recipient management",
        description:
          "Route different reports to different stakeholder lists, so each person gets exactly what's relevant to them.",
        proof: { stat: "Unlimited", label: "recipient lists per report" },
      },
    ],
    howItWorks: [
      { headline: "Pick a report to schedule", description: "Choose from any operational or BI report." },
      { headline: "Set the cadence and recipients", description: "Define daily, weekly, or monthly delivery and who receives it." },
      { headline: "The report generates automatically", description: "Live data populates the report on schedule." },
      { headline: "It's delivered every time", description: "Recipients get it in their inbox without asking." },
    ],
    comparison: {
      title: "Scheduled Reports vs. someone remembering to send it",
      statusQuo:
        "Reports go out only when someone remembers to pull the data, build it, and email it around.",
      withZynReach:
        "Reports generate and deliver automatically on schedule, every time, with no one having to remember.",
    },
    relatedIntegrations: ["Email & Calendar", "Analytics & BI"],
    seoKeywordCluster: "scheduled report automation, automated report delivery software",
  },
  {
    slug: "project-management",
    navLabel: "Project Management",
    meta: {
      h1: "Projects, timelines, and budgets in one view",
      title: "ZynReach Project Management",
      description: "Boards, milestones, budgets, and risk tracking connected to the same data as the rest of your business.",
    },
    hero: {
      headline: "Projects, timelines, and budgets in one view",
      subhead: "Boards, milestones, and resource plans stay connected to the same data as the rest of your business — no separate project tool to reconcile.",
    },
    whoItsFor: [
      { label: "Operations Teams", href: "/solutions/operations" },
      { label: "Management", href: "/solutions/management" },
      { label: "Enterprise", href: "/solutions/enterprise" },
    ],
    featureBlocks: [
      { headline: "Visual boards & timelines", description: "Plan and track work on boards and timelines that reflect real project status, not a snapshot from last week's update meeting.", proof: { stat: "1", label: "shared timeline across every project" } },
      { headline: "Milestone tracking", description: "Milestones stay visible to the whole team, so a slipping date gets caught before it becomes a missed launch.", proof: { stat: "0", label: "missed milestones from lost visibility" } },
      { headline: "Budget & resource tracking", description: "See budget burn and resource load next to the timeline, so overruns get caught while there's still time to act.", proof: { stat: "15%", label: "fewer budget overruns caught too late" } },
      { headline: "Early risk flagging", description: "Risks are logged against the project and surfaced to the right owner, instead of surfacing for the first time in a status meeting.", proof: { stat: "3x", label: "earlier risk visibility" } },
    ],
    howItWorks: [
      { headline: "Set up the project", description: "Define scope, timeline, and budget in one place." },
      { headline: "Plan milestones & resources", description: "Assign work and track capacity against the plan." },
      { headline: "Track progress on boards", description: "Boards and timelines reflect real status as work happens." },
      { headline: "Catch risks & drift early", description: "Budget and schedule risks surface before they become the plan's next crisis." },
    ],
    comparison: {
      title: "Project management vs. spreadsheet trackers",
      statusQuo: "Timelines, budgets, and resourcing live in separate spreadsheets that go stale the moment a plan changes.",
      withZynReach: "One live view of milestones, budget, and resourcing updates as the project actually moves.",
    },
    relatedIntegrations: ["Collaboration", "Email & Calendar"],
    seoKeywordCluster: "project management platform, enterprise project tracking software",
  },
  {
    slug: "task-management",
    navLabel: "Task Management",
    meta: {
      h1: "Where daily work actually gets tracked",
      title: "ZynReach Task Management",
      description: "Personal and team task lists, recurring work, reminders, and automatic escalations.",
    },
    hero: {
      headline: "Where daily work actually gets tracked",
      subhead: "Personal and team task lists, recurring work, and reminders — the day-to-day layer underneath your projects, not another project tool.",
    },
    whoItsFor: [
      { label: "Operations Teams", href: "/solutions/operations" },
      { label: "Management", href: "/solutions/management" },
      { label: "Growing Business", href: "/solutions/growing-business" },
    ],
    featureBlocks: [
      { headline: "Personal & team task lists", description: "Track your own work or your team's in the same place, without forcing every task into a formal project structure.", proof: { stat: "1", label: "task list, whether it's just you or the whole team" } },
      { headline: "Recurring tasks", description: "Weekly reports, monthly reviews, and other repeating work get scheduled once and recur automatically.", proof: { stat: "0", label: "recurring tasks recreated from scratch" } },
      { headline: "Smart reminders", description: "Reminders nudge the right person before a deadline, not after it's already been missed.", proof: { stat: "↓", label: "fewer tasks falling through the cracks" } },
      { headline: "Automatic escalations", description: "Overdue tasks escalate to a manager automatically, so nothing important quietly slips.", proof: { stat: "100%", label: "overdue tasks routed to a manager, automatically" } },
    ],
    howItWorks: [
      { headline: "Create a task", description: "Add personal or team tasks in seconds, one-off or recurring." },
      { headline: "Assign & schedule it", description: "Set an owner, due date, and recurrence if it repeats." },
      { headline: "Reminders keep it on track", description: "The right person is nudged before the deadline arrives." },
      { headline: "Escalations catch what's overdue", description: "Missed deadlines route to a manager automatically." },
    ],
    comparison: {
      title: "Task management vs. scattered to-do lists",
      statusQuo: "Tasks live in personal notebooks, chat threads, and sticky notes — nobody has one view of what's actually due.",
      withZynReach: "Every task — personal or team, one-off or recurring — lives in one list with reminders and escalation built in.",
    },
    relatedIntegrations: ["Collaboration", "Email & Calendar"],
    seoKeywordCluster: "team task management software, business task tracking tool",
  },
  {
    slug: "hr-management",
    navLabel: "HR Management",
    meta: {
      h1: "Employee records, without a separate system to maintain",
      title: "ZynReach HR Management",
      description: "Employee records, HR documents, and approval workflows inside the same operations platform.",
    },
    hero: {
      headline: "Employee records, without a separate system to maintain",
      subhead: "HR Management keeps employee records, documents, and approval workflows inside the same operations platform as the rest of your business — one more capability, not a dedicated HR suite to bolt on.",
    },
    whoItsFor: [
      { label: "HR & Administration", href: "/solutions/hr" },
      { label: "Management", href: "/solutions/management" },
      { label: "Mid-Market", href: "/solutions/mid-market" },
    ],
    featureBlocks: [
      { headline: "Centralized employee records", description: "Employee details stay in one record that the rest of the platform can reference, instead of a standalone HR database.", proof: { stat: "1", label: "employee record, shared across every workflow" } },
      { headline: "HR document management", description: "Contracts, policies, and employee documents are stored and organized alongside the rest of your business documents.", proof: { stat: "0", label: "documents chased down over email" } },
      { headline: "Configurable HR workflows", description: "Onboarding, changes, and requests move through approval workflows built the same way as any other operational process.", proof: { stat: "100%", label: "auditable approval trail on HR requests" } },
      { headline: "Part of business operations", description: "HR sits alongside finance, tasks, and teams in one operations platform — not a separate HR product with its own login.", proof: { stat: "1", label: "platform, no separate HR login" } },
    ],
    howItWorks: [
      { headline: "Add employees & records", description: "Employee details live in the same platform as the rest of operations." },
      { headline: "Store HR documents securely", description: "Contracts and policies stay organized and access-controlled." },
      { headline: "Route requests through workflows", description: "Onboarding and change requests move through approvals automatically." },
      { headline: "See it inside one operations view", description: "HR data connects to the same teams, departments, and permissions as everything else." },
    ],
    comparison: {
      title: "HR records vs. a separate HR system",
      statusQuo: "Employee records live in a dedicated HR tool that doesn't talk to the rest of the business.",
      withZynReach: "Employee records, documents, and HR workflows live inside the same operations platform as everything else your team runs.",
    },
    relatedIntegrations: ["Collaboration"],
    seoKeywordCluster: "HR management software, employee records platform",
  },
  {
    slug: "attendance-leave",
    navLabel: "Attendance & Leave",
    meta: {
      h1: "Attendance and leave, without the spreadsheet",
      title: "ZynReach Attendance & Leave",
      description: "Attendance tracking, leave requests, and automated approvals with configurable policy.",
    },
    hero: {
      headline: "Attendance and leave, without the spreadsheet",
      subhead: "Track attendance, manage leave requests, and enforce policy automatically — approvals route to the right manager without a chase.",
    },
    whoItsFor: [
      { label: "HR & Administration", href: "/solutions/hr" },
      { label: "Operations Teams", href: "/solutions/operations" },
    ],
    featureBlocks: [
      { headline: "Attendance tracking", description: "Attendance is logged against each employee automatically, giving managers a current view without a manual roll call.", proof: { stat: "1", label: "attendance record per employee, always current" } },
      { headline: "Leave requests & balances", description: "Employees request leave and see their balance in the same place — no separate calculation to double-check.", proof: { stat: "0", label: "manual leave-balance math" } },
      { headline: "Automated approvals", description: "Leave requests route to the right manager automatically, based on your organization's structure.", proof: { stat: "< 1 day", label: "average approval turnaround" } },
      { headline: "Configurable policies", description: "Leave and attendance policies are enforced consistently, so exceptions are visible instead of silent.", proof: { stat: "100%", label: "policy-consistent approvals" } },
    ],
    howItWorks: [
      { headline: "Set attendance & leave policies", description: "Define the rules once for the whole organization." },
      { headline: "Employees log time & request leave", description: "Requests and attendance are captured directly in the platform." },
      { headline: "Approvals route automatically", description: "Requests reach the right manager without a manual forward." },
      { headline: "Balances & records update live", description: "Attendance and leave balances stay current with every request." },
    ],
    comparison: {
      title: "Attendance & leave vs. manual tracking",
      statusQuo: "Leave requests move through email and spreadsheets, and balances get out of sync.",
      withZynReach: "Requests, approvals, and balances update automatically and stay consistent with policy.",
    },
    relatedIntegrations: ["Collaboration"],
    seoKeywordCluster: "attendance tracking software, employee leave management system",
  },
  {
    slug: "teams-departments",
    navLabel: "Teams & Departments",
    meta: {
      h1: "Structure that mirrors how your business actually works",
      title: "ZynReach Teams & Departments",
      description: "Departments, teams, manager hierarchies, and role-based permissions in sync with your org chart.",
    },
    hero: {
      headline: "Structure that mirrors how your business actually works",
      subhead: "Departments, teams, managers, and permissions stay in sync with your real org chart — access follows structure automatically.",
    },
    whoItsFor: [
      { label: "Management", href: "/solutions/management" },
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "HR & Administration", href: "/solutions/hr" },
    ],
    featureBlocks: [
      { headline: "Departments & teams", description: "Model your actual org structure once, and every module — from tasks to reporting — reflects it.", proof: { stat: "1", label: "structure, shared across every module" } },
      { headline: "Manager hierarchies", description: "Reporting lines update in one place, and approvals and visibility follow automatically.", proof: { stat: "0", label: "manual re-assignment when reporting lines change" } },
      { headline: "Role-based permissions", description: "Access is granted by role and team, so permissions match what someone actually does.", proof: { stat: "100%", label: "access mapped to actual role" } },
      { headline: "Structure-aware reporting", description: "Reports roll up by department or team automatically, without a manual filter every time.", proof: { stat: "1", label: "view per department, automatically" } },
    ],
    howItWorks: [
      { headline: "Define departments & teams", description: "Set up the structure that mirrors your business." },
      { headline: "Assign managers & reporting lines", description: "Hierarchies determine approvals and visibility." },
      { headline: "Set role-based permissions", description: "Access follows role and team automatically." },
      { headline: "Structure updates flow through", description: "Changes to teams or managers propagate everywhere at once." },
    ],
    comparison: {
      title: "Org structure vs. a static chart",
      statusQuo: "The org chart lives in a slide deck that's out of date the moment someone changes teams.",
      withZynReach: "Departments, managers, and permissions stay live and consistent as your structure evolves.",
    },
    relatedIntegrations: ["Collaboration"],
    seoKeywordCluster: "organizational structure software, team and department management platform",
  },
  {
    slug: "finance-accounting",
    navLabel: "Finance & Accounting",
    meta: {
      h1: "Financial workflows, without a separate accounting system",
      title: "ZynReach Finance & Accounting",
      description: "Invoices, payments, expenses, tax-ready records, and financial reporting inside one operations platform.",
    },
    hero: {
      headline: "Financial workflows, without a separate accounting system",
      subhead: "Invoices, payments, expenses, and tax handling live inside the same operations platform as the rest of your business — one more capability, not a dedicated accounting suite to reconcile.",
    },
    whoItsFor: [
      { label: "Finance Teams", href: "/solutions/finance" },
      { label: "Management", href: "/solutions/management" },
      { label: "Mid-Market", href: "/solutions/mid-market" },
    ],
    featureBlocks: [
      { headline: "Invoicing & payments", description: "Invoices move from issue to paid in one record, without exporting to a separate accounting tool to track status.", proof: { stat: "1", label: "invoice record, from issue to payment" } },
      { headline: "Expense tracking", description: "Expenses are logged and categorized as they happen, instead of arriving in an inbox at month-end.", proof: { stat: "0", label: "expense reports lost in email" } },
      { headline: "Tax-ready records", description: "Transactions are categorized consistently as they're recorded, so tax reporting isn't a reconstruction project.", proof: { stat: "100%", label: "of transactions categorized automatically" } },
      { headline: "Financial reporting & workflows", description: "Approvals and reporting run on the same live data, so the numbers on a report match what's actually happened.", proof: { stat: "real-time", label: "financial reporting, no month-end scramble" } },
    ],
    howItWorks: [
      { headline: "Issue invoices & record payments", description: "Track every invoice from issue through payment." },
      { headline: "Track expenses as they happen", description: "Expenses are categorized and logged in real time." },
      { headline: "Route financial approvals", description: "Spending and payments move through configurable approval workflows." },
      { headline: "Report on the current state, anytime", description: "Financial reports reflect live data, not a month-end export." },
    ],
    comparison: {
      title: "Financial workflows vs. a separate accounting tool",
      statusQuo: "Invoices, expenses, and reports live in a standalone accounting system disconnected from operations.",
      withZynReach: "Invoicing, expenses, and financial reporting live inside the same platform running the rest of the business.",
    },
    relatedIntegrations: ["Billing & Payments"],
    seoKeywordCluster: "business finance management software, integrated accounting platform",
  },
  {
    slug: "document-center",
    navLabel: "Document Center",
    meta: {
      h1: "Every document, one secure home",
      title: "ZynReach Document Center",
      description: "Centralized document storage, version control, permission-based sharing, and retention policy.",
    },
    hero: {
      headline: "Every document, one secure home",
      subhead: "Centralized storage, version control, and permission-based sharing — with approvals and retention policy built in, not bolted on.",
    },
    whoItsFor: [
      { label: "Operations Teams", href: "/solutions/operations" },
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Management", href: "/solutions/management" },
    ],
    featureBlocks: [
      { headline: "Centralized secure storage", description: "Every document lives in one organized library instead of scattered across email attachments and personal drives.", proof: { stat: "1", label: "document library, company-wide" } },
      { headline: "Version control", description: "Every edit is tracked automatically, so there's never a question of which file is the real 'final' version.", proof: { stat: "0", label: "lost versions or 'final_final' files" } },
      { headline: "Sharing & permissions", description: "Documents are shared with exactly the right people, and access can be revoked as easily as it was granted.", proof: { stat: "100%", label: "permission-controlled sharing" } },
      { headline: "Approvals & retention policy", description: "Sensitive or regulated documents route through approval, and retention rules apply automatically over time.", proof: { stat: "auto", label: "retention enforcement, no manual cleanup" } },
    ],
    howItWorks: [
      { headline: "Upload & organize documents", description: "Files are structured into a library your whole team can navigate." },
      { headline: "Control access by permission", description: "Sharing is scoped to exactly who needs it." },
      { headline: "Track every version automatically", description: "Edits are versioned without anyone renaming a file." },
      { headline: "Apply approval & retention policy", description: "Documents follow the rules your business sets, automatically." },
    ],
    comparison: {
      title: "Document Center vs. scattered file storage",
      statusQuo: "Documents are scattered across email attachments, personal drives, and shared folders with no version history.",
      withZynReach: "Every document lives in one secure library with version history, permissions, and retention policy built in.",
    },
    relatedIntegrations: ["Collaboration"],
    seoKeywordCluster: "document management system, secure business file storage",
  },
  {
    slug: "customer-portal",
    navLabel: "Customer Portal",
    meta: {
      h1: "Give your customers a portal of their own",
      title: "ZynReach Customer Portal",
      description: "A branded, self-service space for account information, documents, billing, and requests.",
    },
    hero: {
      headline: "Give your customers a portal of their own",
      subhead: "A branded, self-service space where your customers view account information, documents, and billing, and submit requests — without emailing your team.",
    },
    whoItsFor: [
      { label: "Customer Success", href: "/solutions/customer-success" },
      { label: "Enterprise", href: "/solutions/enterprise" },
    ],
    featureBlocks: [
      { headline: "Self-service account access", description: "Your customers check account status and information whenever they need to, without waiting on a reply.", proof: { stat: "24/7", label: "customer self-service, no ticket required" } },
      { headline: "Documents & billing in one place", description: "Invoices, statements, and shared documents live in one portal your customers can access anytime.", proof: { stat: "1", label: "portal for account info, documents, and billing" } },
      { headline: "Request submission & tracking", description: "Customers submit requests directly and can see status, instead of following up by email to check.", proof: { stat: "↓", label: "fewer 'what's the status' emails" } },
      { headline: "Branded to your business", description: "The portal reflects your business's identity, so it feels like an extension of your service, not a third-party tool.", proof: { stat: "100%", label: "on-brand customer experience" } },
    ],
    howItWorks: [
      { headline: "Turn on the customer portal", description: "Give customers a self-service space under your brand." },
      { headline: "Customers see account, documents & billing", description: "Information is available on demand, without a request." },
      { headline: "Customers submit requests directly", description: "Requests come in through the portal, with status visible to both sides." },
      { headline: "Your team responds in the same platform", description: "No separate tool to check for incoming customer requests." },
    ],
    comparison: {
      title: "Customer portal vs. email-based support",
      statusQuo: "Customers email your team for account status, invoices, and documents — and wait for a reply.",
      withZynReach: "Customers log into their own portal and get account info, documents, and billing on demand.",
    },
    relatedIntegrations: ["Support & Helpdesk", "Billing & Payments"],
    seoKeywordCluster: "customer self-service portal, branded client portal software",
  },
  {
    slug: "subscription-billing",
    navLabel: "Subscription & Billing",
    meta: {
      h1: "The engine behind every plan, invoice, and entitlement",
      title: "ZynReach Subscription & Billing",
      description: "Plan management, automated billing and invoicing, and usage-based entitlements.",
    },
    hero: {
      headline: "The engine behind every plan, invoice, and entitlement",
      subhead: "Subscription & Billing is the capability that governs plans, payment methods, usage, and which suites and features are available — the infrastructure your billing runs on, not a pricing page.",
    },
    whoItsFor: [
      { label: "Finance Teams", href: "/solutions/finance" },
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Small Business", href: "/solutions/smb" },
    ],
    featureBlocks: [
      { headline: "Plan & subscription management", description: "Every account's plan, add-ons, and subscription status live in one record that stays current automatically.", proof: { stat: "1", label: "subscription record per account, always current" } },
      { headline: "Automated billing & invoicing", description: "Invoices generate and payment methods charge on schedule, without a manual billing run.", proof: { stat: "0", label: "manually generated invoices" } },
      { headline: "Usage-based entitlements", description: "Access to features and usage limits are checked against the live plan, not a cached snapshot.", proof: { stat: "real-time", label: "entitlement checks against plan and usage" } },
      { headline: "Suite & feature availability", description: "Which suites and features an account can see is governed by plan, applied consistently everywhere.", proof: { stat: "100%", label: "of access mapped to plan, automatically" } },
    ],
    howItWorks: [
      { headline: "Define plans & entitlements", description: "Set what each plan includes, from suites to usage limits." },
      { headline: "Attach payment methods", description: "Billing details are stored securely against the account." },
      { headline: "Usage & billing run automatically", description: "Invoices, charges, and usage tracking happen on schedule." },
      { headline: "Access adjusts in real time", description: "Upgrades, downgrades, and usage changes update entitlements immediately." },
    ],
    comparison: {
      title: "Built-in billing vs. bolted-on payment tools",
      statusQuo: "Plans, invoices, and access are tracked manually across a payment processor and a spreadsheet of who's entitled to what.",
      withZynReach: "Plans, billing, and entitlements are one system — access updates automatically as subscriptions change.",
    },
    relatedIntegrations: ["Billing & Payments"],
    seoKeywordCluster: "subscription billing software, usage-based entitlement management",
  },
  {
    slug: "notifications",
    navLabel: "Notifications",
    meta: {
      h1: "One notification center, every channel",
      title: "ZynReach Notifications",
      description: "Event-based in-app, email, and push notifications with preferences and full history.",
    },
    hero: {
      headline: "One notification center, every channel",
      subhead: "In-app, email, and push notifications trigger off real platform events — with preferences and history in one place, so nothing important gets missed or duplicated.",
    },
    whoItsFor: [
      { label: "Operations Teams", href: "/solutions/operations" },
      { label: "Sales Teams", href: "/solutions/sales" },
      { label: "Customer Success", href: "/solutions/customer-success" },
    ],
    featureBlocks: [
      { headline: "Event-based notifications", description: "Notifications trigger off real platform events — a status change, an approval, a new request — not a manual send.", proof: { stat: "1", label: "trigger, every channel updates" } },
      { headline: "In-app, email & push", description: "Every notification can reach the channel a user actually checks, without building three separate systems.", proof: { stat: "3", label: "channels, one notification system" } },
      { headline: "User preferences", description: "Each user controls what they're notified about and where, so alerts stay relevant instead of ignored.", proof: { stat: "0", label: "notification fatigue from irrelevant alerts" } },
      { headline: "Full notification history", description: "Every notification sent is logged and searchable, so 'did anyone see this' has a real answer.", proof: { stat: "100%", label: "of notifications logged & searchable" } },
    ],
    howItWorks: [
      { headline: "Define the triggering event", description: "Choose what platform activity should notify someone." },
      { headline: "Route to in-app, email, or push", description: "Delivery follows the channel that fits the notification." },
      { headline: "Respect user preferences", description: "Each recipient controls what reaches them and how." },
      { headline: "Keep a full history for reference", description: "Every notification is logged and searchable after the fact." },
    ],
    comparison: {
      title: "Unified notifications vs. channel-by-channel alerts",
      statusQuo: "Alerts come from different tools on different channels, with no shared history or preference control.",
      withZynReach: "One notification system triggers across every channel, respecting preferences and keeping full history.",
    },
    relatedIntegrations: ["Email & Calendar", "Collaboration"],
    seoKeywordCluster: "unified notification system, business event notification platform",
  },
  {
    slug: "marketplace",
    navLabel: "Marketplace",
    meta: {
      h1: "Extend ZynReach with the tools you need next",
      title: "ZynReach Marketplace",
      description: "Browse, install, and configure suites and tools, filtered to your plan's entitlements.",
    },
    hero: {
      headline: "Extend ZynReach with the tools you need next",
      subhead: "Browse and install suites and tools from the ZynReach Marketplace — filtered to what your plan allows, configured without leaving the platform.",
    },
    whoItsFor: [
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Growing Business", href: "/solutions/growing-business" },
    ],
    featureBlocks: [
      { headline: "Suite & tool catalog", description: "Browse available suites and tools in one catalog, organized so it's easy to find what's relevant to your business.", proof: { stat: "1", label: "catalog for every suite and tool" } },
      { headline: "Search & filtering", description: "Filter by category or need to find a relevant tool quickly, instead of scrolling an unsorted list.", proof: { stat: "< 1 min", label: "to find a relevant tool" } },
      { headline: "One-click installation", description: "Installing a suite or tool doesn't require a separate setup process or a new login to manage.", proof: { stat: "0", label: "separate setup process per tool" } },
      { headline: "Plan-aware entitlements", description: "The Marketplace only surfaces what your plan allows, so installation never runs into a billing surprise.", proof: { stat: "100%", label: "of installs checked against your plan" } },
    ],
    howItWorks: [
      { headline: "Browse the catalog", description: "See every available suite and tool in one place." },
      { headline: "Filter by suite or need", description: "Narrow the catalog down to what's actually relevant." },
      { headline: "Install with entitlement checked", description: "The Marketplace verifies your plan automatically before install." },
      { headline: "Configure permissions & go live", description: "Set access and start using the new capability immediately." },
    ],
    comparison: {
      title: "Marketplace vs. requesting a new tool from IT",
      statusQuo: "Extending the platform means a request to IT, a new vendor contract, and a separate login.",
      withZynReach: "Browse, install, and configure new capabilities directly inside ZynReach, within your plan's entitlements.",
    },
    relatedIntegrations: ["Developer & API"],
    seoKeywordCluster: "SaaS marketplace platform, in-app app marketplace for business software",
  },
  {
    slug: "plugin-sdk",
    navLabel: "Plugin SDK",
    meta: {
      h1: "Build for ZynReach",
      title: "ZynReach Plugin SDK",
      description: "A developer platform and SDK for building, testing, and publishing plugins to the Marketplace.",
    },
    hero: {
      headline: "Build for ZynReach",
      subhead: "A developer platform and SDK for building, testing, and publishing plugins — ship a tool once, and every ZynReach customer on the Marketplace can install it.",
    },
    whoItsFor: [
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Agencies", href: "/solutions/agencies" },
    ],
    featureBlocks: [
      { headline: "A full plugin SDK", description: "Build against a documented SDK that covers the whole plugin lifecycle, from first commit to publishing.", proof: { stat: "1", label: "SDK for the whole plugin lifecycle" } },
      { headline: "Built-in testing tools", description: "Test plugins against a sandbox environment before submitting, instead of guessing how review will go.", proof: { stat: "0", label: "guesswork before submission" } },
      { headline: "Guided submission & review", description: "Submission follows a clear review and approval process, so developers know exactly what's expected before publishing.", proof: { stat: "clear", label: "path from build to published" } },
      { headline: "Versioning & deprecation tools", description: "Ship updates with proper versioning, and deprecate old versions with a defined migration path.", proof: { stat: "0", label: "breaking changes without a migration path" } },
    ],
    howItWorks: [
      { headline: "Build with the SDK", description: "Develop your plugin against a documented, versioned SDK." },
      { headline: "Test in a sandbox environment", description: "Validate behavior before it ever reaches review." },
      { headline: "Submit for review & approval", description: "Submissions follow a clear, predictable review process." },
      { headline: "Publish, version, and maintain", description: "Ship updates and manage deprecation over the plugin's lifecycle." },
    ],
    comparison: {
      title: "Plugin SDK vs. building a one-off integration",
      statusQuo: "Extending ZynReach for a client or internal use means a custom, one-off integration nobody else can reuse.",
      withZynReach: "Build once with the SDK, publish to the Marketplace, and reach every ZynReach customer on your plan tier.",
    },
    relatedIntegrations: ["Developer & API"],
    seoKeywordCluster: "plugin SDK for SaaS platforms, developer platform for business software",
  },
  {
    slug: "organization-management",
    navLabel: "Organization Management",
    meta: {
      h1: "Make the platform look like your business",
      title: "ZynReach Organization Management",
      description: "Branding, timezone and locale settings, custom domains, and white-label options.",
    },
    hero: {
      headline: "Make the platform look like your business",
      subhead: "Set your organization's identity — logo, colors, timezone, locale, and even a custom domain — so ZynReach feels like part of your business, not a third-party tool.",
    },
    whoItsFor: [
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Agencies", href: "/solutions/agencies" },
    ],
    featureBlocks: [
      { headline: "Branding & identity", description: "Set a logo and brand colors once, and they apply consistently across every page your team and customers see.", proof: { stat: "1", label: "brand identity, applied platform-wide" } },
      { headline: "Timezone & locale settings", description: "Dates, times, and language display correctly for every user and every region your business operates in.", proof: { stat: "100%", label: "of timestamps shown in the right timezone" } },
      { headline: "Custom domain", description: "Run the platform on your own domain, so customer-facing links point to your business, not a third-party one.", proof: { stat: "0", label: "third-party domain in customer-facing links" } },
      { headline: "White-label options", description: "Combine branding, domain, and locale settings for an experience that reads as fully your own, end to end.", proof: { stat: "1", label: "consistent brand experience end-to-end" } },
    ],
    howItWorks: [
      { headline: "Set your organization identity", description: "Establish the name and identity your business operates under." },
      { headline: "Apply logo & brand colors", description: "Branding carries across every screen automatically." },
      { headline: "Configure timezone & locale", description: "Set defaults that match where your business operates." },
      { headline: "Connect a custom domain", description: "Complete a fully white-labeled experience for your users." },
    ],
    comparison: {
      title: "White-labeled platform vs. an obviously third-party tool",
      statusQuo: "Customers and employees see a generic, unbranded tool that clearly isn't part of your business.",
      withZynReach: "Your logo, colors, and domain make the platform feel like it was built for your business.",
    },
    relatedIntegrations: ["Developer & API"],
    seoKeywordCluster: "white label SaaS platform, custom domain business software",
  },
  {
    slug: "branch-management",
    navLabel: "Branch Management",
    meta: {
      h1: "Run every branch from one platform",
      title: "ZynReach Branch Management",
      description: "Multi-branch structure, territory assignment, branch-level permissions, and reporting.",
    },
    hero: {
      headline: "Run every branch from one platform",
      subhead: "Manage branches, territories, and branch managers with permissions and reporting scoped to each location — one platform, many locations.",
    },
    whoItsFor: [
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Mid-Market", href: "/solutions/mid-market" },
    ],
    featureBlocks: [
      { headline: "Multi-branch structure", description: "Model every branch or location in one platform, instead of running a separate system per site.", proof: { stat: "1", label: "platform, every branch or location" } },
      { headline: "Territory & assignment", description: "Leads, accounts, and work route to the right branch by territory, automatically.", proof: { stat: "0", label: "manual routing between branch teams" } },
      { headline: "Branch-level permissions", description: "Branch managers and staff see and act on what belongs to their branch, and nothing outside it.", proof: { stat: "100%", label: "of access scoped to the right branch" } },
      { headline: "Branch-level reporting", description: "Headquarters sees performance across every branch, while each manager sees their own branch clearly.", proof: { stat: "1", label: "company view for HQ, one clear view per branch" } },
    ],
    howItWorks: [
      { headline: "Set up branches & territories", description: "Define your locations and how work is divided between them." },
      { headline: "Assign branch managers & permissions", description: "Each branch gets the right owners and access scope." },
      { headline: "Route work by territory", description: "New leads and requests reach the correct branch automatically." },
      { headline: "Report at branch or company level", description: "See performance rolled up or broken out, as needed." },
    ],
    comparison: {
      title: "Branch management vs. a separate system per location",
      statusQuo: "Each branch or location runs its own spreadsheet, with no unified view for headquarters.",
      withZynReach: "Every branch operates in the same platform, with permissions, routing, and reporting scoped correctly.",
    },
    relatedIntegrations: ["CRM Data", "Analytics & BI"],
    seoKeywordCluster: "multi-branch management software, multi-location business platform",
  },
  {
    slug: "audit",
    navLabel: "Audit",
    meta: {
      h1: "A complete record of who did what, when",
      title: "ZynReach Audit",
      description: "Platform-wide activity logging, a searchable audit trail, and governance-ready exports.",
    },
    hero: {
      headline: "A complete record of who did what, when",
      subhead: "Every action across every module — record changes, approvals, logins, and configuration — is logged automatically to one searchable audit trail, supporting your broader compliance and security posture.",
    },
    whoItsFor: [
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Management", href: "/solutions/management" },
    ],
    featureBlocks: [
      { headline: "Platform-wide activity logging", description: "Actions across every module are logged automatically, so there's no module left out of the picture.", proof: { stat: "100%", label: "of tracked actions logged automatically" } },
      { headline: "Searchable audit trail", description: "One audit trail covers the whole platform, instead of a separate log per module to piece together.", proof: { stat: "1", label: "audit log, every module" } },
      { headline: "Change history on every record", description: "Any record's history is visible directly on the record — who changed what, and when.", proof: { stat: "0", label: "unexplained changes to a record" } },
      { headline: "Governance-ready exports", description: "Export the relevant history whenever governance, compliance, or a review process needs it.", proof: { stat: "audit-ready", label: "history, exportable anytime" } },
    ],
    howItWorks: [
      { headline: "Every action is logged automatically", description: "No configuration required — logging runs by default." },
      { headline: "Logs attach to the record & the user", description: "History stays tied to exactly what changed and who changed it." },
      { headline: "Search and filter the audit trail", description: "Find the relevant activity quickly, across any module." },
      { headline: "Export for governance or compliance", description: "Pull the history needed for a review, whenever it's needed." },
    ],
    comparison: {
      title: "Built-in audit trail vs. piecing together history",
      statusQuo: "Reconstructing who changed what means digging through emails, memory, and hope.",
      withZynReach: "Every action is logged automatically to one searchable trail, ready when governance or compliance asks.",
    },
    relatedIntegrations: ["Analytics & BI", "Developer & API"],
    seoKeywordCluster: "audit trail software, enterprise activity logging platform",
  },
];

export function getCapabilityPage(slug: string) {
  return capabilityPages.find((page) => page.slug === slug);
}
