# ZynReach Website

ZynReach is an AI-native CRM and revenue-operations platform — it unifies CRM, marketing automation, lead generation, workflow automation, and analytics, with AI built into the core workflows rather than bolted on.

This repository is **System A**: the public-facing marketing, education, and lead-conversion website (zynreach.com). It's a companion to the separate **System B** project (`zynreach-admin`), which is ZynReach's own admin/CMS dashboard — this site reads live content (Pricing, Blog, Careers, Resources, CMS pages) from System B's API when configured, and falls back to static content otherwise.

## Tech stack

- **Next.js 16** (App Router), **TypeScript** (strict mode), **Tailwind CSS v4**
- **next-intl** — full English/Arabic localization with RTL support (all routes live under `src/app/[locale]/`)
- **Vitest** + Testing Library (unit/component tests), **Playwright** + axe-core (E2E + accessibility), **Lighthouse CI** (performance budget)

## Project structure

```
src/
  app/[locale]/       Routes — every page is localized (en/ar)
  app/api/            Route handlers for forms and integrations
  components/         UI components, organized by layout/sections/forms/ui
  lib/content/         Typed static content (fallback data per content type)
  lib/services/        Business logic + integration boundaries (CRM, trial, careers, etc.)
  i18n/                next-intl routing/navigation config
  types/               Shared TypeScript types
messages/              en.json / ar.json translation dictionaries
e2e/                   Playwright end-to-end + accessibility specs
scripts/                One-off build/asset tooling (icon generation, i18n checks)
```

Content types (pricing, blog, careers, resources, CMS pages, etc.) each have a typed interface in `src/types/content.ts` and a static data file in `src/lib/content/`. Where a System B integration exists, a service in `src/lib/services/` fetches live data and falls back to that static file automatically if System B is unreachable or unconfigured — no page or component needs to know which source it's using.

Several third-party integrations (CRM lead routing, career/resume storage, ATS sync, status page, CAPTCHA, error monitoring) are implemented up to the boundary of a real credential — search the codebase for `BLOCKER:` to find each one's contract and swap-in point.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env` before running anything that touches an external integration. The app runs correctly with everything unset — every integration has a documented fallback — but real behavior (analytics, live System B content, etc.) requires the corresponding variable. **Never commit `.env`** or any file containing real values; only `.env.example` (placeholders only) should be tracked.

Key variables (see `.env.example` for the full list and context):
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager container (analytics)
- `ZYNREACH_ADMIN_API_URL` / `ZYNREACH_ADMIN_SERVICE_TOKEN` — System B (zynreach-admin) content API, for live Pricing/Blog/Careers/Resources/CMS content

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run test` | Unit/component tests (Vitest) |
| `npm run test:watch` | Unit tests, watch mode |
| `npm run test:e2e` | End-to-end + accessibility tests (Playwright) |
| `npm run lighthouse` | Lighthouse CI performance/accessibility/SEO gate |


## Notes for developers

- **Localization is not optional**: every route lives under `src/app/[locale]/`, and every user-facing string should go through `next-intl` (`messages/en.json` / `messages/ar.json`), not be hardcoded. Use logical CSS properties (`ms-`/`me-`/`text-start`, not `ml-`/`mr-`/`text-left`) so components mirror correctly for Arabic/RTL without extra branching.
- **Static-first, CMS-ready**: prefer editing the typed content files in `src/lib/content/` for content changes unless the content type is already wired to System B, in which case it should be managed through the ZynReach Admin dashboard instead.
- Deployment target is platform-agnostic but assumes Next.js's ISR + edge CDN model (Vercel is the reference target). Set the variables from `.env.example` in your platform's secrets manager — never in source control.
