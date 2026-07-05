# PetAppro — TASKS.md (single shared to-do list)

> **This is the shared source of truth for what's being worked on.** ChatGPT (PM), Claude Code (dev), and Codex (reviewer) all read this file. Keep it current.
>
> **How to update:** change a task's `Status`, add new tasks at the bottom of the right section, and add a line to the Changelog with today's date. Whoever edits it should keep the format intact so the other tools can parse it.
>
> **Launch target:** Oct 1, 2026 · **Store submission deadline:** ~Sept 10, 2026

---

## Status legend
- `TODO` — not started
- `DOING` — in progress
- `REVIEW` — built, awaiting Codex review + Danny's real-device check
- `BLOCKED` — waiting on something (say what in Notes)
- `DONE` — finished and verified

---

## 🔥 This week's focus (update every Monday)
_Week of: 2026-07-06_
1. Stand up the monorepo and extract the pricing engine into one tested package.
2. Kick off the business formation (LLC) so the D-U-N-S clock can start.
3. Line up 5–10 pet-care operators as design-partner testers.

---

## Current sprint — Sprint 1 (Jul 7–18): Foundations & the crown jewel

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| S1-1 | Set up monorepo (apps/mobile, apps/web, packages/*, supabase/) | Claude Code | TODO | Plan first, wait for approval |
| S1-2 | Extract single `packages/pricing` from the 3 existing copies | Claude Code | TODO | Write regression tests FIRST |
| S1-3 | Fix stale pricing test (15-night cap was removed) | Claude Code | TODO | From Codex audit |
| S1-4 | Extract `packages/booking` (validation + availability) | Claude Code | TODO | |
| S1-5 | Generate Supabase DB types → `packages/data` | Claude Code | TODO | |
| S1-6 | GitHub Actions CI: typecheck + lint + test on every PR | Claude Code | TODO | Do before the refactor |
| S1-R | Codex review of S1-2/S1-3 (money logic) | Codex | TODO | Independent second-model check |

**Sprint 1 exit criteria:** one pricing engine, tests green, CI enforced.

---

## Business / app-store track (runs in parallel — Danny owns)

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| BIZ-1 | Form **Base509 LLC** — sole owner: Danny (single-member). PetAppro = product/IP under it | Danny | REVIEW | **Submitted 2026-07-04** via bizfile (standard processing; approval ~mid-week Jul 8–10). Member-managed. Registered agent: Launch RA (Vista, CA). Operating Agreement drafted → `Company/Formation/` (pending LLC # + signature). Save stamped Articles PDF on approval. |
| BIZ-2 | Get EIN (free, irs.gov) | Danny | TODO | After LLC |
| BIZ-3 | Open business bank account | Danny | TODO | After EIN |
| BIZ-4 | Request D-U-N-S number (free) | Danny | BLOCKED | Needs LLC first; 1–2 wk wait |
| BIZ-5 | Open Apple Developer acct (Organization, $99) | Danny | BLOCKED | Needs D-U-N-S |
| BIZ-6 | Open Google Play acct (Organization, $25) | Danny | BLOCKED | Needs D-U-N-S |
| BIZ-7 | Recruit 5–10 design-partner testers | Danny | TODO | Ready for late-Aug beta |

---

## Marketing & launch track (website + social — runs in parallel)

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| MKT-1 | Register domain(s): petappro.com (+ defensive names) | Danny | TODO | Also BIZ track |
| MKT-2 | Reserve social handles (IG, FB, Threads, TikTok, LinkedIn) @petappro | Danny | TODO | Grab early (~Aug 15). No X/Musk platforms |
| MKT-3 | Brand kit: logo, profile/banner art, palette | Danny | TODO | Adobe Express/Canva + tokens |
| MKT-4 | Website scaffold + core pages (Next.js `apps/web`) | Claude Code | TODO | Marketing + checkout only |
| MKT-5 | **Privacy Policy + Support URLs live** | Danny/Claude Code | TODO | **Store-required by ~Sep 5** |
| MKT-6 | Provider sign-up → Stripe Billing checkout | Claude Code | TODO | Sell SaaS on web (not iOS) |
| MKT-7 | Pre-launch content calendar + posts | Danny | TODO | Ramp from ~Sep 1 |
| MKT-8 | Demo/sizzle video (Adobe Quick Cut) | Danny | TODO | Reuse on site + stores |
| MKT-9 | Launch posts + store links | Danny | TODO | Oct 1 |

---

## Upcoming (next 2–3 sprints — don't start yet)
- Tenant-aware schema: `businesses`, `memberships`, generalized `services`, per-tenant `pricing_rules` (Sprint 2)
- RBAC + RLS + RLS test suite (Sprint 3)
- White-label config + brand resolver (Sprint 3)
- Expo app scaffold + auth (Sprint 3)
- Booking flow + Stripe Connect + staff dashboard (Sprint 4)

---

## Blocked / waiting
- BIZ-4/5/6 blocked until the LLC exists.

---

## Decisions still needed from Danny
- [x] LLC: solo or with Marco? → **Resolved: sole owner, Danny (single-member LLC), filing 2026-07-04**
- [ ] Bring in a contract React Native dev for the September crunch? (biggest factor for hitting Oct 1)
- [ ] Confirm "Appro" brand family after a trademark clearance search
- [ ] Migrate existing Woof clients onto PetAppro as tenant #1, or run in parallel?

---

## Changelog (newest first)
- 2026-07-04 — BIZ-1: Base509 LLC **submitted** to CA SoS (bizfile, standard processing); registered agent = Launch RA; Operating Agreement drafted to `Company/Formation/`. Awaiting approval → then EIN (BIZ-2).
- 2026-07-04 — File created; seeded with Sprint 1 + business track from the roadmap doc.
```
