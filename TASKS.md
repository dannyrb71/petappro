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
_Week of: 2026-07-06 (revised 2026-07-07)_
1. **Finish business setup loose ends:** clear the D&B case (#34660335) → clean/active D-U-N-S; create business Apple ID on `developer@base509.com` once Apple's new-account throttle clears; finish the bank account (BIZ-3).
2. **Design System foundation** (Priority 2): tokens, component standards, variants, spacing, type, icons, motion, a11y — in concert with the Base509 brand (MKT-3) and the DS north star.
3. **Design research:** Danny to red-pen the JTBD + archetypes draft (DR-1); keep the thread moving toward flows.

**Pricing extraction — HELD (decided 2026-07-07).** Not starting the `packages/pricing` extraction (S1-2/S1-3) yet. Reason: the pricing engine still has to become tenant-aware, and — more fundamentally — we first need to know whether target verticals share a **common pricing backbone** or each needs a unique model. Extracting the old Woof dog-boarding logic before that's answered would bake in assumptions we'd rip out. Study first (**DR-5**), then un-hold. All other Sprint 1 dev also waits until design + architecture lock.

> Removed from focus (2026-07-07): "form LLC → start D-U-N-S clock" (**done** — LLC approved, D-U-N-S 11-314-3683 in hand) and "line up 5–6 PCSP beta testers" (**too early** — that's post-freeze, ~late Aug; see BIZ-7).

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
| BIZ-1 | Form **Base509 LLC** — sole owner: Danny (single-member). PetAppro = product/IP under it | Danny | DONE | **Approved 2026-07-06.** Entity No. **B20260309172**, file date 2026-07-04. Member-managed. Registered agent: Launch RA (Vista, CA). Operating Agreement finalized → `Company/Formation/` (needs signature). Save stamped Articles PDF here. |
| BIZ-2 | Get EIN (free, irs.gov) | Danny | DONE | **Obtained 2026-07-06.** EIN stored in `Company/Formation/` (confidential). Download CP 575 letter → save there. Unblocks bank acct + D-U-N-S |
| BIZ-3 | Open business bank account | Danny | DOING | **Application submitted online 2026-07-06; bank calls in 1–2 days to finalize.** Then **fund $10,000** (self-fund 6 mo; personal-cash bridge, ~$10k AMZN sale replenishes). Record as owner capital contribution. Ask on the call if $400 code YT2FB2 still applies (opened online, not branch). Details in `Finance/Banking/Wells-Fargo-Business-Checking.md` |
| BIZ-4 | Request D-U-N-S number (free) | Danny | DONE | **Obtained 2026-07-07 (same day) via myD&B free flow — D-U-N-S 11-314-3683.** Stored in `Company/Formation/Base509-LLC-Key-Identifiers.md`. May take a few days to propagate/verify in D&B before Apple/Google can validate it |
| BIZ-5 | Open Apple Developer acct (Organization, $99) | Danny | TODO | **Unblocked (D-U-N-S in hand).** First create business Apple ID on `developer@base509.com` — blocked today by Apple's new-account throttle/lockout (retry tomorrow, use Google Voice #). Then enroll Organization |
| BIZ-6 | Open Google Play acct (Organization, $25) | Danny | TODO | **Unblocked (D-U-N-S in hand).** Enroll as Organization; paste D-U-N-S 11-314-3683 |
| BIZ-7 | Recruit 5–6 PCSP beta testers | Danny | TODO | Via local Facebook PCSP group + Danny's network. Post-freeze beta (late-Aug, TestFlight/closed track) — **not** the MVP-complete freeze bar (that's Danny+Marco's own business as first test tenant, D-028) |
| BIZ-8 | **Elect S-corp tax status** — file IRS Form 2553, effective **2027-01-01** | Danny | TODO | **File Jan 2027** (hard deadline ~Mar 15, 2027 for a 1/1/27 effective date). LLC stays default disregarded-entity for 2026. Once active: reasonable-salary payroll + EDD reg, Form 1120-S / CA Form 100S, CPA. **Confirm with a CPA before filing.** |
| BIZ-9 | **Bind business insurance (E&O + GL + cyber) just before launch** | Danny | TODO | Get quotes early Sept (Vouch/Embroker or Next/Hiscox/Thimble). Bind ~late Sept so it's **active before the first real provider/client uses the app** (~Oct 1). Budget models it starting Sept. |

---

## Marketing & launch track (website + social — runs in parallel)

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| MKT-1 | Register domain(s): petappro.com (+ defensive names) | Danny | DONE | **petappro.com + base509.com registered 2026-07-07, both under one Cloudflare account.** Defensive vertical names (hairappro/cleanappro) optional/later |
| MKT-2 | Reserve social handles (IG, FB, Threads, TikTok, LinkedIn) @petappro | Danny | TODO | Grab early (~Aug 15). No X/Musk platforms |
| MKT-3 | Brand kit: logo, profile/banner art, palette | Danny | TODO | PetAppro has tokens+logo; **Base509 corporate identity is the open item** (positioning, wordmark, palette, name story). Gates site visual pass only |
| MKT-4 | Website scaffold + core pages (Next.js `apps/web`, **Vercel**) | Claude Code | TODO | One deployment, multi-domain: petappro.com (product) + base509.com (hub). Spec: `docs/specs/website-content-and-structure.md`; plan: `docs/roadmap/website-and-store-launch-plan.md` |
| MKT-5 | **Privacy Policy + Terms + Support URLs live** | Danny/Claude Code | TODO | Host on petappro.com/privacy, /terms, /support. **Store-required — live before submission (~Sep 5).** = Roadmap LR-1/LR-2 |
| MKT-5b | **Contact page** (petappro.com + base509.com) | Danny/Claude Code | TODO | Form/email reachable; expected alongside support for store trust. = Roadmap LR-3 |
| MKT-5c | **PetAppro app landing/download page** | Claude Code | TODO | Value prop + features + App Store/Play badges (placeholders until approval). Live before launch (~Sep 25). = Roadmap LR-4 |
| MKT-6 | Provider sign-up → Stripe Billing checkout | Claude Code | TODO | Sell SaaS on web (not iOS) |
| MKT-7 | Pre-launch content calendar + posts | Danny | TODO | Ramp from ~Sep 1 |
| MKT-8 | Demo/sizzle video (Adobe Quick Cut) | Danny | TODO | Reuse on site + stores |
| MKT-9 | Launch posts + store links | Danny | TODO | Oct 1 (fallback: late Oct) |
| MKT-10 | Base509.com company/marketing hub page | Claude Code | TODO | Company site: what Base509 is + product list linking to PetAppro + contact; grows with future apps. = Roadmap LR-5 |
| MKT-11 | Create + submit app-store listings (App Store Connect + Play Console) | Danny/Claude Code | TODO | **Submit ~mid-Sep**; set release date = Oct 1 and hold, then keep a **review buffer to Oct 1** (= Roadmap LR-8). Needs org accounts (BIZ-5/6 = LR-6/7) + live legal URLs (MKT-5 = LR-1/2). = Roadmap LR-6/7 prep |

---

## Design & Research track (runs in parallel — feeds DS + flows)

> Home: `docs/research/`. Working rule: every item names the decision it informs; findings hand off to `open_decisions.md` and `docs/design-system/`. Keep in concert with the **Base509 brand (MKT-3)** and **PetAppro Design System** — research → archetypes → flows → DS.

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| DR-1 | Red-pen JTBD + archetypes draft (`docs/research/jobs-to-be-done.md`, R-001) | Danny | REVIEW | Cowork drafted; PCSP job story + 6 archetype starters await Danny's edits. Anchor decided (**D-027**) |
| DR-2 | Experience-first competitive teardowns (Time To Pet, Gingr, Precise Petcare + Rover/Wag contrast) | Cowork | DOING | Charter/rubric/scorecards in `teardowns/README.md`; Rover review-mining done; feeds archetypes |
| DR-3 | Map archetypes → jobs → user-flows | Cowork | TODO | After DR-1 sign-off; feeds `docs/user-flows/` |
| DR-4 | Hand JTBD/archetype signals into DS decisions (mobile-native, glanceable, one-handed) | Cowork | TODO | Interlock with PetAppro Design System |
| DR-5 | Pricing study — capture each competitor's pricing *model* as a scorecard column | Cowork | TODO | Runs with DR-2 (two birds); see `teardowns/_scorecards.md` |
| DR-6 | Migrate Notion Discovery content → repo SSOT; slim Notion to PM + pointers | Cowork | TODO | Notion = project management, repo = content (Danny 2026-07-07). Migrate JTBD, archetypes, competitive first-pass, Flow Inventory into repo *before* slimming; journeys/flows stay in FigJam. Don't delete Notion content until safely in repo |
| DR-5 | **Pricing-model study across target verticals** (dog boarding/daycare/walking/sitting/training, + hair stylists, massage therapists) → common pricing primitives vs per-service unique | Cowork | IN PROGRESS (George v1+v2 drafted) | **MVP verticals = boarding + daycare + walking (no GPS), D-022.** Study covers others as design-for-later. Validates/corrects the generalized `services.pricing_model` + `pricing_config` bet (annex §5) before the pricing engine is built. Feeds a new pricing-generalization decision + `packages/pricing` design. Gates un-holding the pricing extraction |

**Interlocks:** DR work stays synced with **MKT-3** (Base509 brand identity — the open dependency) and the **Design System**; the bank account (**BIZ-3**) remains the live business-track item to finish. Standup should surface all three together.

---

## Upcoming (next 2–3 sprints — don't start yet)
- Tenant-aware schema: `businesses`, `memberships`, generalized `services`, per-tenant `pricing_rules` (Sprint 2)
- RBAC + RLS + RLS test suite (Sprint 3)
- White-label config + brand resolver (Sprint 3)
- Expo app scaffold + auth (Sprint 3)
- Booking flow + **manual payment tracking** + staff dashboard (Sprint 4). *Stripe Connect deferred post-MVP — D-007.*
- **Stripe Connect (client→provider online pay)** — post-launch add (D-007). Not the same as SaaS Stripe Billing (MKT-6), which stays in.

---

## Blocked / waiting
- BIZ-5 (Apple): D-U-N-S no longer the blocker — now waiting on Apple's new-account throttle to clear (create business Apple ID on `developer@base509.com` tomorrow, use Google Voice #). BIZ-4 DONE, BIZ-6 unblocked.

---

## Decisions still needed from Danny
- [x] LLC: solo or with Marco? → **Resolved: sole owner, Danny (single-member LLC), filing 2026-07-04**
- [ ] Bring in a contract React Native dev for the September crunch? (biggest factor for hitting Oct 1)
- [ ] Confirm "Appro" brand family after a trademark clearance search
- [ ] Migrate existing Woof clients onto PetAppro as tenant #1, or run in parallel?

---

## Changelog (newest first)
- 2026-07-07 (pm) — **Store-clock progress.** Registered `petappro.com` + `base509.com` (Cloudflare, one account) → **MKT-1 DONE**. Stood up free Cloudflare Email Routing: `developer@`, `support@`, `danny@base509.com` all forward to Gmail (verified). Note: Cloudflare won't forward senders that fail SPF/DKIM — surfaced that `dannyraydesign.com`'s own email auth is broken (separate fix). **D-U-N-S obtained same-day (free, myD&B): 11-314-3683 → BIZ-4 DONE**, unblocks BIZ-5/6. Business phone = Google Voice #. Business Apple ID deferred to tomorrow (Apple new-account throttle/lockout). D-U-N-S cheat sheet added in `Company/Formation/`. (Cowork)
- 2026-07-07 — **Two scope decisions locked (from Danny).** (1) **D-007 Decided — Stripe Connect deferred post-MVP**: manual payment tracking is the sole MVP client→provider payment path (Connect is a nice-to-have, not launch-critical). SaaS Stripe **Billing** (MKT-6, provider→Base509) stays in. Reflected in `mvp_roadmap.md` (scope lists, Phase 4/6, calendar), annex (Sprint 4, milestones, backlog→post-launch). (2) **D-028 Decided — MVP-complete / feature-freeze definition**: *Danny + Marco's own business runs a genuine booking end-to-end on physical iOS+Android, tenant isolation verified, payment manual* → then features freeze. Own business = first **test tenant** (freeze bar); the **5–6 PCSPs** = **beta testers** after the freeze. Retired "design partner" for this context; **renamed BIZ-7** → "Recruit 5–6 PCSP beta testers". Reframed D-021. (Cowork/PM)
- 2026-07-07 — **Roadmap: Launch Readiness promoted to a first-class parallel track.** Added an **LR track (LR-1…LR-8)** to `docs/roadmap/mvp_roadmap.md` (phase overview + dedicated section + parallel-track note in the phase diagram): legal pages, support, contact, app landing page(s), Base509 marketing site, Apple prep, Google prep, and the store-review buffer — all framed as **launch dependencies, not post-launch**, with the binding D-U-N-S→accounts→URLs→submit→buffer→Oct 1 chain. Synced MKT track: MKT-5 now covers Terms explicitly; added **MKT-5b (Contact page)** and **MKT-5c (app landing/download page)**; cross-tagged MKT-10/11 + BIZ-5/6 to their LR ids. (Cowork/PM)
- 2026-07-06 — **Design research thread** started: `docs/research/` scaffolded (README, research-log, teardown template, synthesis). Drafted `jobs-to-be-done.md` (PCSP-anchored JTBD + client/staff supporting jobs + 6 archetype starters, archetypes-over-personas). Logged **D-027** (JTBD anchor: owner/PCSP; supporting jobs rise to primary in their own flows). Added **Design & Research track** (DR-1..4) + focus item 4; DR-1 awaiting Danny's red-pen. Keep synced w/ MKT-3 (Base509 brand) + Design System + BIZ-3 (bank). (Cowork)
- 2026-07-06 — Danny review of Phase 1 arch → folded in: glossary, scaling seam (future tablet/web on same backend), client relationship lifecycle (leave/switch provider), connect via code/QR only. Logged new decisions **D-024** (support/break-glass role, redacted+audited), **D-025** (multi-currency), **D-026** (connect method), and captured **D-020** subscription requirements (seat-based tiers, first user=owner + add-user role prompt w/ financial disclaimer, monthly/annual, prorated upgrades, referral promo + reversal/fraud). (Cowork/PM)
- 2026-07-06 — Phase 1 planning: drafted `docs/planning/technical_architecture.md` (stack, tenancy, RLS, pricing authority, notif outbox, repo shape) + `docs/planning/data_model_draft.md` (19 tenant-scoped tables). Also `docs/roadmap/planning-doc-sequencing.md` (dependency-ranked doc backlog; billing deferred per D-020/D-021). Awaiting Codex review. (Cowork/PM)
- 2026-07-06 — Website + store plan drafted: `docs/roadmap/website-and-store-launch-plan.md` (one-deployment/multi-domain, **Vercel** hosting, store-approval sequence, **mid-Sep submit / late-Oct fallback**) + `docs/specs/website-content-and-structure.md` (sitemap + draft copy). Added MKT-10/11; updated MKT-3/4/5. Launch date-flex to late-Oct accepted. Base509 corporate brand flagged as the open dependency. (Cowork)
- 2026-07-06 — BIZ-3 **DOING**: WF business checking opens 2026-07-07 (branch, $400 bonus code YT2FB2). Funding **$10,000** (self-fund 6 mo) via personal-cash bridge; ~$10k AMZN sale (41 sh) freed the cash. Budget model in `Finance/Accounting/`; account details in `Finance/Banking/`. (Cowork)
- 2026-07-06 — BIZ-2 **DONE**: Federal EIN obtained for Base509 LLC (stored in `Company/Formation/Base509-LLC-Key-Identifiers.md`, confidential). Unblocks bank account (BIZ-3) + D-U-N-S (BIZ-4). (Cowork)
- 2026-07-06 — Tax decision: keep **default LLC (disregarded entity) for 2026**; **elect S-corp effective 2027-01-01** via Form 2553 (file Jan 2027; deadline ~Mar 15, 2027). Added **BIZ-8**. EIN still filed as an LLC. (Cowork)
- 2026-07-06 — BIZ-1 **DONE**: Base509 LLC **approved** (Entity No. B20260309172). Operating Agreement finalized in `Company/Formation/`. Unblocks EIN (BIZ-2, next) + D-U-N-S (BIZ-4). Deadlines: Statement of Info (LLC-12) by ~2026-10-02; $800 franchise tax by ~2026-11-15. (Cowork)
- 2026-07-04 — BIZ-1: Base509 LLC **submitted** to CA SoS (bizfile, standard processing); registered agent = Launch RA; Operating Agreement drafted to `Company/Formation/`. Awaiting approval → then EIN (BIZ-2).
- 2026-07-04 — File created; seeded with Sprint 1 + business track from the roadmap doc.
```
