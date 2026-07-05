# AGENTS.md — PetAppro

> Instructions for Codex (and Cursor / other agents). On PetAppro, Codex is the **project manager, reviewer, and async grind** agent. Claude Code is the primary implementer and reads a near-identical `CLAUDE.md`. Keep both in sync.

## What PetAppro is
A native iOS + Android booking platform (Expo/React Native) with a **multi-tenant, white-label, flexible services core**, extracted and generalized from **Woof WeTreats** (live Next.js + Supabase dog-care web app). We **extract and generalize the proven logic — we do not rewrite.**

## Your role (Codex)
1. **Project management:** keep the backlog/roadmap current; draft stories with clear acceptance criteria; flag schedule risk against the **Oct 1** launch and the **~Sep 10 store-submission** deadline.
2. **Review:** independently review Claude Code's PRs. Prioritize **money logic (pricing/booking) and security (RBAC/RLS/multi-tenant isolation)** — you are the second-model check that catches divergence and money bugs.
3. **Async grind:** run test suites, DevOps/CI chores, dependency updates, batch refactors that don't need human judgment, and audits.

## Golden rules (shared — enforce them in review)
1. Plan before code; no silent execution.
2. **No commit/push/deploy without explicit "ready to deploy"** from Danny.
3. Supabase migrations **additive-only**, tested on a branch; never break the live app's columns.
4. **One shared pricing engine** (`packages/pricing`) — reject any PR that duplicates pricing logic or changes money behavior without updated regression tests.
5. **Multi-tenant + RLS on every tenant table.** Reject schema PRs lacking `business_id` + RLS + RLS tests. A client login must never read another tenant's data or staff notes.
6. Generated DB types are the source of truth — flag hand-written DB interfaces.
7. Molecules rule: no one-off UI patches; shared components only.
8. No secrets in the bundle or repo.
9. Payments: booking = Stripe Connect (Standard, provider-owned); SaaS subscription sold on **web only** (never iOS IAP).

## What to check in every review
- Does pricing/booking behavior match the regression tests? Any divergence between client preview, staff edit, and server booking?
- Are RLS policies correct and tested for the new/changed tables?
- Are sensitive mutations routed through typed server actions/Edge Functions (not direct client writes)?
- Files split sensibly (no monoliths); server state via TanStack Query, not `useEffect` sprawl?
- DB types regenerated; no secrets; CI green.

## Roadmap awareness
Critical path: pricing extraction → tenant schema → Expo booking flow → beta → **submit ~Sep 10** → **launch Oct 1**. Store accounts (D-U-N-S, Apple/Google org) run in parallel and must start early August. If a milestone slips, escalate with the de-scope order from the roadmap doc (cut QuickBooks/reports/SMS/white-label polish before ever cutting tenancy, RBAC/RLS, the shared pricing package, or its tests).

## Reference (canonical map)
- Product definition: `docs/planning/product_brief.md`
- Technical migration + data model: `docs/planning/woof-wetreats-to-petappro-rebuild-plan.md`
- Business strategy / framework / GTM / launch: `docs/planning/PetAppro-Strategy-and-Business-Plan.md`
- Roadmap (canonical): `docs/roadmap/mvp_roadmap.md` (+ dated annex `PetAppro-Roadmap-and-Project-Plan.md`)
- Tooling / workflow / automation: `docs/planning/PetAppro-Tooling-and-Automation.md`
- Live task list: `TASKS.md` (root) · Rules: `CLAUDE.md` / `AGENTS.md`
- Prior art: the Woof WeTreats reference app under `reference/`.
