# STATUS — end-of-day reports (all agents)

> One place for every agent/chat to post a brief end-of-day (or end-of-session) report, so Danny has a
> single scannable view of what happened across the whole team. **Newest first.** Folder-connected
> chats (Cowork, Design System, Woof-audit, Claude Code) write here directly; George's report is
> pasted in by Cowork. Keep entries short.
>
> **Format:**
> ```
> ## YYYY-MM-DD — <Agent / chat>
> - Done: …
> - Decisions / open questions: …
> - Ready to push? yes/no (what)
> ```

---

## 2026-07-10 — Claude Code (D-039 revision)

- **Done:** Revised `packages/pricing` to implement D-039 (explicit rates, no % surcharges). Engine bumped to v0.2.0.
  - **`types.ts`:** Added `RateTier` / `RateTierCondition` types. Added `rate_tiers?: RateTier[]` to `ServiceRate`. Replaced `PricingRule` with discriminated union `SurchargeRule | DiscountRule` — TypeScript now enforces at compile time that surcharges can only be `action: "fixed_amount"`. Added `per_unit?: boolean` to `SurchargeRule` (puppy +$X/night). Added `rate_tier` to `AppliedPricingRule.action` union.
  - **`engine.ts`:** Added `resolveRateTier()` helper (priority: holiday > extended > regular; explicit rate lookup, no % at any step). Step 2 now calls `resolveRateTier()` and emits `rate_tier_condition` in `booking_context` and `AppliedPricingRule`. Step 5 (flat surcharges) supports `per_unit` multiplication. Step 7 (% surcharges) **removed entirely** — the engine now has zero code paths for percentage surcharges.
  - **`golden.test.ts`:** B3 rewritten to holiday rate-override test (`$90/night` explicit rate, asserts no % in `applied_rules`). B4 rewritten to flat surcharge stack test (puppy `per_unit=true` + travel flat). W3 rewritten to flat holiday walk fee ($6 flat, not $6 = $30 × 20%). "No floats" invariant now uses `% discount` (not `% surcharge`) to produce fractional intermediates. "Additive not compounding" invariant now tests % discount codes (the only remaining % use).
  - **All 24 tests green, 8 skipped, TypeScript strict + `exactOptionalPropertyTypes` clean.**
- **Decisions / open questions:**
  - **D-039 fully implemented.** `PricingRule` discriminated union means the Supabase caller and any future admin UI will get compile-time errors if they try to create a % surcharge.
  - **`per_unit` on SurchargeRule** is the MVP shape for puppy/extra-dog per-night flat fees. If "extra dog" should also be a `ParticipantRule` instead (per George v2), that's a config choice — both shapes exist and produce the same math.
  - **For Codex:** `rate_tiers` on `ServiceRate` should correspond to a `service_rate_tiers` join table or a JSONB column in the DB; the engine snapshot at booking creation should carry the resolved `rate_tier_condition` in `booking_price_snapshots.booking_context`.
- **Ready to push? NO** — waiting for Danny's "ready to deploy." Bundle with Cowork's ready-to-push docs (open_decisions.md D-041–D-047, provider-settings-ia.md, STATUS.md) when approved.

---

## 2026-07-10 — Design System (dark-mode surface model)
- **Done:** Worked out the light+dark surface architecture with Danny and encoded it. Added **`surface.canvas`** (page backdrop) + **`text.on-canvas`**/`-variant` so text stays ADA on both dark canvas and light cards; kept `surface.default` = white holder, `surface.container` = inner. **Model 1 "light islands"** (Danny-approved): dark = **brand-tinted dark canvas** (Brandy Blue → teal `#002C38`) with **white holder cards in both modes**, inner one step darker. Canvas is brand-tinted per theme. `lint-tokens` → **641, 0 violations.** **Figma synced + verified:** new theme vars (`canvas`/`on-canvas`/`on-canvas-variant`) seeded per mode, semantic `surface/canvas` + `text/on-canvas`(+variant), Brandy Blue Light (white holder) + Dark (Model 1) rewritten; resolves correctly. Confirmed **service/status/payment tags ride the `domain.*` tokens** (unique bg per meaning, Woof-referenced).
- **Decisions / open:** Model 1 + brand-tinted canvas = Danny-approved. **To do in Figma (Danny driving iteration):** author the other 4 themes' `· Dark` modes on this model; build Tag/Pill + Booking Card components; tune type scale down, pill contrast, drop left-border-on-rounded, decide glance-vs-tap disclosure; `Your Pack` separate pass.
- **Ready to push?** **yes** — `tokens/semantic/color.tokens.json`, `tokens/themes/*` (brandy-blue + brandy-blue-dark rewritten; 5 themes +canvas roles), `CHANGELOG.md`. Figma file updated (not git-tracked). Pending Codex governance review.

## 2026-07-10 — Cowork (product management)
- **Done:** Scoped drop-in + in-home-sitting verticals and the provider config/payments model. Wrote `docs/planning/provider-settings-ia.md` (settings IA + web-portal/app surface split). Logged **D-041** (web portal = editor/billing surface; app basic), **D-042** (subscription web-only, no in-app purchase/CTA → B2B-SaaS 0% store fee; client booking payments via Stripe Connect, IAP-exempt physical service), **D-043** (off-hours surcharge + hours-of-operation + snapshot-on-booking; flat travel fee MVP, per-mile deferred), **D-044** (secure access storage), **D-045** (availability conflict-groups), **D-046** (report-card CMS templates + edit-lock). Added **D-047** (OPEN — service content + Woof carryover + report-card review; boarding-first). GPS confirmed as v1.1 fast-follow (manual proof-of-walk in MVP).
- **Decisions / open questions:** D-041–D-046 marked **FINAL** (Danny). Open for Codex: data-model reuse for per-visit/per-night + location, availability/conflict, multi-visit-per-day, snapshot fields (`provider-settings-ia.md` §8). Pricing engine still needs the D-039 revision (below) — separate blocker.
- **Ready to push? YES** — `docs/decisions/open_decisions.md` (D-041–D-047), `docs/planning/provider-settings-ia.md` (new), `STATUS.md`. **Claude Code to push on Danny's go** (clear `.git/*.lock` first). Bundle with the pricing-engine D-039 revision if it lands first.

---

## 2026-07-10 — Claude Code
- **Pushed:** `7e2ec97` → `main` (`a5e0ad6..7e2ec97`). 51 files, 4664 insertions. All of last night's work is on GitHub. DS changes version-controlled only — Codex governance review still pending.

---

## 2026-07-09 — Claude Code

- **Done:**
  - Built `packages/pricing/` from scratch — the full pricing engine per `docs/specs/booking_and_pricing.md`.
  - **Golden tests first:** 24 tests written before implementation, all pass. 8 correctly skipped (B7 deposit per D-015; 7 later-vertical stubs).
  - Tests cover: B1–B6, B8 (boarding); D9–D14 (daycare); W1–W3 (walking per D-022); plus structural invariants (total = sum of lines, no floats, deposit=0, purity, additive-not-compounding %).
  - `src/types.ts` — canonical `PricingModel`, `PricingRuleType`, `PricingBreakdown`, `PricingLineItem`, `AppliedPricingRule`, full config shapes. `src/math.ts` — `halfUp`/`bpsAmount`/`ppmAmount`. `src/engine.ts` — pure `calculateBookingPrice(input, config)`.
  - TypeScript strict + `exactOptionalPropertyTypes` — clean. Vitest 1.6, Node, no deps beyond devDeps.
  - **Addressing other agents:**
    - **Design System (git lane):** `docs/design-system/` has only a stub README (untracked). Ready to `rm` it as part of the commit when Danny approves — does not require a separate step.
    - **Cowork (push backlog):** the pending `3de98e7` / `a5e0ad6` commits are in git history; `STATUS.md`, `packages/pricing/`, and all DS file changes are still untracked/modified. All will be staged in the commit below.
    - **Codex:** noted the governance flag on DS v0.1.2 spec edits (not my lane) and the `ALIGNMENT.md §3/§5` stale-George-language delta (Cowork's lane to reconcile).

- **Decisions / open questions (which lane they touch):**
  - **Ambiguity resolved (pricing lane):** % surcharges apply to base+participant subtotal (pre-all-surcharges), confirmed by George v2 Example 1 ($345×20%=$69). Implemented that way.
  - **Half-day tier (pricing/product lane):** interpreted as a separate `per_session` service at $30, not a volume tier on full-day. If Cowork/Danny want it as a true `tiered` variant on one service config, the `volume_tiers` shape is already in the types — just needs a config + golden test.
  - **`partial_unit_overage` model (pricing lane):** keeping `per_night` as the base service model; `overage_config` on the config triggers the overage line. The `partial_unit_overage` enum value labels the generated line item. Clean; no change needed unless spec disagrees.
  - **Extract vs. rewrite (resolved — Claude Code lane):** **clean build.** The Woof logic's 3 copies lack minor-unit, bps/ppm, and breakdown-snapshot requirements; retrofitting is riskier than the green-field engine with golden tests. Noted in the build session.
  - **CI (infra lane — Cowork/George):** `packages/pricing` is a standalone Vitest package. Needs to be wired into whatever CI pipeline is set up (GitHub Actions `npm test`). No CI config exists yet — flagging for the infrastructure sprint.

- **Ready to push? YES** — stage and commit: `packages/pricing/**` (new engine + tests), `STATUS.md` (new file), `docs/design-system/README.md` (rm stub per DS request), and all DS-modified files (`design-system/CHANGELOG.md`, `design-system/docs/theming-decision.md`, `design-system/docs/README.md`, `design-system/docs/PetAppro-Atomic-Design-System-Inventory.xlsx`, `design-system/specs/atoms/button.md`, `design-system/specs/patterns/list-row.md`, `docs/research/woof-wetreats/**`, `ALIGNMENT.md`, `TASKS.md`). **Awaiting Danny's "ready to deploy."**

---

## 2026-07-09 — Codex
- **Done:** Read the latest Design System and Cowork updates plus `ALIGNMENT.md`; confirmed repository files are the durable shared-memory layer for future project chats. Reviewed the reported changes for Codex-lane impacts and recorded the required governance follow-ups; no code, architecture, data-model, or governed design-system files changed.
- **Decisions / open questions (which lane they touch):** **Design-system governance:** the reported `button.md` and `list-row.md` v0.1.2 changes still need the required lint and independent Codex review before READY-FOR-GOVERNOR; the pressed-state token gap remains a governance decision for Danny. **Alignment:** `ALIGNMENT.md` §0–2 says George can read the repo through the desktop app, while §3 and §5 still say George cannot read it and must use pasted files; Cowork should reconcile those stale statements. The canonical Design System location is `/design-system/` per `ALIGNMENT.md`; `/docs/design-system/` should remain supporting documentation only unless Danny changes that decision.
- **Ready to push?** **no** — this status entry is ready, but Codex has not reviewed or approved the reported Design System changes, and no commit/push was authorized.

## 2026-07-09 — Design System (base brand → Brandy Blue default)
- **Done:** Integrated the **PetAppro base brand** into tokens as the new **default theme, "Brandy Blue"** (Danny's call). Used Danny's **exact brand bands** (he confirmed the raw ramps read best — no OKLCH normalization) + synthesized `50` tints. **Dog-centric palette names** (Danny, favorite dogs): **Brandy Blue** (primary), **Camo Green** (success), **Coco Coral** (danger), **Bella Sky** (info), **Maverick Grey** (neutral, husky-grey); primitive slugs `brandy-blue`, `camo`, `coco`, `bella`, `maverick` with all aliases updated (themes + semantic + `CLAUDE-DESIGN-CONTEXT.md`). Extended Maverick to full 50–900; added Coco + Bella. Added `themes/brandy-blue.tokens.json` (Light·default, primary=`brandy-blue.600` `#006073`) + `brandy-blue-dark.tokens.json` (Dark, Option A); added `Poppins`; re-pointed `semantic.status` success→camo / danger→coco / info→bella (warning=amber). Captured Danny's preferred **5a design language** (Poppins ladder, 22px cards, 999px pill CTA, teal-tinted shadows) into `docs/brandy-blue-preview.html`. `lint-tokens.mjs` → **617 tokens, 0 violations.**
- **Decisions / open (base brand):**
  - **Brandy Blue is now the base/default theme** — **supersedes the locked "Tier 1 = Sage & Sand" default**; Sage & Sand demoted to an alternate. Needs George/ChatGPT + Codex awareness (theming-and-tiers doc, tier lockup text).
  - **Primitive renames + status re-point are theme-invariant** — implement Danny's brand + role guide; flag for Codex.
  - **DONE (Figma):** Variables synced to tokens — primitives renamed (brandy-blue/camo/coco/bella/maverick), Poppins added, status re-pointed, **Themes default mode = Brandy Blue · Light** + Brandy Blue · Dark added; `atom/Button` verified reskinning to Brandy Blue automatically.
  - **Open:** author dark modes for the other 4 themes; propagate Poppins/design-language into the component specs + build remaining atoms on Brandy Blue.
- **Ready to push?** **yes** — repo changes: `tokens/primitives/color.tokens.json`, `tokens/semantic/color.tokens.json`, `tokens/typography.tokens.json`, `tokens/themes/{brandy-blue,brandy-blue-dark,sage-sand}.tokens.json`, `specs/CLAUDE-DESIGN-CONTEXT.md`, `CHANGELOG.md`, `docs/brandy-blue-preview.html`. Lint-clean. Pending Codex review (default-theme + renames + status re-point supersede prior locks).

## 2026-07-09 — Design System
- **Done:** Adopted the shared-repo workflow (Base509 folder connected; working out of the repo, not a scratchpad). Read the full DS foundation (`GOVERNANCE`, `tokens/`, `CHANGELOG`) + all 23 approved `specs/`. In Figma (`05 Components`): built `atom/Button` (variants + Default/Pressed, themed **Button** text style = `body`/bold) conforming toward `button.md`; `atom/Badge` (pill shell); materialized `elevation.semantic.{card,raised,modal,nav}` effect styles from `tokens/elevation`. Bumped `specs/atoms/button.md` + `specs/patterns/list-row.md` → **v0.1.2** (shared `elevation.semantic.raised` press). Logged **Decision 3 — Light/Dark "Option A"** in `design-system/docs/theming-decision.md` + `CHANGELOG`. Consolidated DS docs into **`/design-system/docs/`** — moved the Atomic Inventory there + rewrote the README (single home); `/docs/design-system/` stub removal queued for Claude Code (local rm permission-blocked). Moved Woof reference artifacts (functionality spec/inventory + wireframes) → `docs/research/woof-wetreats/`. Ran `lint-specs.mjs` → **23 specs, 0 errors.**
- **Decisions / open questions:**
  - **Light/Dark = Option A** (10 fixed theme modes, preselected / not-dynamic) — Danny-locked; captured in the **theming lane** (`design-system/docs/theming-decision.md`). Next: author dark tokens per theme (**tokens lane**).
  - **DS folder location — RESOLVED (Danny):** consolidate to **`/design-system/`** (one home). Authored docs/deliverables live in `/design-system/docs/`; `/docs/design-system/` retired (empty-stub removal queued for Claude Code). ALIGNMENT DS lane = `/design-system/`. Codex/George entries independently confirm.
  - **Token gap — DECIDED (Danny):** add explicit `pressed` tokens for `secondary`/`destructive`/`success` (matching `primary`, keyed per theme) — not computed fill-shift (keeps them themeable + auditable per D-030). To author in the **tokens lane** + wire into the Button pressed variants; finalize via Codex governance.
  - Aligned with Cowork's 2026-07-09 locks (D-015 no-deposit, D-022 walking, tips, Connect) — no design conflicts.
  - **Process:** the v0.1.2 spec edits should re-run `lint-specs.mjs` + Codex review to stay formally approved.
- **Ready to push?** **yes** — changed in repo: `design-system/CHANGELOG.md`, `design-system/docs/theming-decision.md`, `design-system/docs/README.md`, `design-system/docs/PetAppro-Atomic-Design-System-Inventory.xlsx` (moved from `docs/design-system/`), `design-system/specs/atoms/button.md`, `design-system/specs/patterns/list-row.md`, `docs/research/woof-wetreats/**` (Woof reference). **Claude Code also:** `git rm -r docs/design-system` (retire the empty stub — local rm was permission-blocked). Specs lint-clean (0 errors). Figma file updated — not git-tracked.

## 2026-07-09 — Cowork (product management)
- **Done:** locked D-007 (Stripe Connect in MVP) · D-015 (no deposits) · D-022 (walking in MVP) · D-028 (freeze bar) · D-029 (no-marketplace) · D-034–D-038 (data/auth architecture) · D-031 passwordless. Reconciled the pricing engine → build-ready `docs/specs/booking_and_pricing.md`. Resynced roadmap + annex to Connect-in / dual-target date (Oct 1 / Oct 21). Added `base509-operator-admin-console.md`, user-flows index (+ deposit-fix flag). Established `ALIGNMENT.md` (roles/sync protocol) and this `STATUS.md`. Drafted the Claude Code pricing-build prompt and the Design-System-chat onboarding prompt.
- **Decisions / open:** tips in MVP + no platform fee (Standard Connect) confirmed. Pricing extract-vs-rewrite left to Claude Code. Confirmed George's ChatGPT can't read the private repo → George uses paste; all other chats sync via the repo folder.
- **Ready to push?** **YES** — commit `3de98e7` + `ALIGNMENT.md` + `STATUS.md` + the day's docs. Claude Code to push at EOD (clear `.git/*.lock` first).
