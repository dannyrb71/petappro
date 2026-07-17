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

## 2026-07-17 — Cowork (theme renames + City themes FINAL: palettes, fonts, neutrals) ⚑ TOKEN-STRUCTURE CHANGE
- **Done (Figma, all live, Danny-approved in session):**
  - **Theme renames:** Sage & Sand → **Chessie**, Terracotta → **Irish Setter**, Harbor → **Husky**, Berry → **Poodle** (Dusk unchanged). Theme collection now 9 modes: Brandy Blue (default) · Chessie · Irish Setter · Husky · Dusk · Poodle · New York · Miami · Hollywood.
  - **City themes** built light+dark by aliasing (existing primitive values untouched): **New York** (charcoal/blue; ink ramp re-hued to cool charcoal — Danny set `ink/900` = `#20282A`, steps 50–800 regenerated on that hue, was olive-brown), **Miami** (Miami Vice: `miami-pink` magenta + `miami-teal` teal/cyan; neutrals moved sand/* → new **`dolphin-gray`** cool-gray ramp, anchor #64748B @500 — Danny: "Miami is perfect"), **Hollywood v3** on Danny's wine/olive palette — new ramps **`hollywood-red`** (#96414C @600, /900 pinned #2C0D0D night canvas) + **`hollywood-olive`** (#99A03D @500); brand=hollywood-red, accent=hollywood-olive, neutral=taupe. All three pass 16-pair WCAG QA both schemes.
  - **City fonts (Danny's picks):** New York → **Oswald** (`family/oswald`), Miami → **Ubuntu** (`family/ubuntu`), Hollywood → keeps Poppins + theme vars `type/heading-case=uppercase`, `type/heading-weight=300` (build-side rules for sleek ALL-CAPS thin headlines).
  - Fixed pet-name Caption fixed-width squeeze in `molecule/Pet Cluster` masters (names were wrapping one per line on hub cards).
- **Codex actions (token repo):** slug/file renames `sage-sand*`→`chessie*`, `terracotta*`→`irish-setter*`, `harbor*`→`husky*`, `berry*`→`poodle*`; add city theme files + primitive ramps `hollywood-red`, `hollywood-olive`, `miami-pink`, `miami-teal`, `dolphin-gray`; update `ink/*` values to the #20282A-hue ladder; **`hollywood-orange`/`hollywood-teal` ramps from v2 are ORPHANED** — keep or drop, Codex's call; Miami no longer references sand/* (sand stays for other uses); update `theming-and-tiers.md`, `CLAUDE-DESIGN-CONTEXT.md`, `CHANGELOG.md`; run linter to zero.
- **Decisions / open questions:** NO tier↔theme mapping (D-020/D-040 — Danny's call). Theme-family rule documented in `naming-conventions.md` §10 (dogs/cities/seasonal; primitives = Danny's dogs; Brandy Blue both-layers exception). Danny to confirm Poodle assignment + Dusk's future.
- **Ready to push?** no — Figma-side complete; repo edits are Codex's lane, Claude Code commits.

---

## 2026-07-16 — Codex (web portal AUTH / IDENTITY architecture ratification)
- **Done:** Ratified and documented the D-041 provider-portal identity/session architecture in `docs/planning/technical_architecture.md`. Expo and `app.petappro.com` use the same PetAppro Supabase Auth issuer and resolve `session issuer+subject -> auth_identities -> base509_account_id -> business_memberships -> business_id`; the two surfaces share identity/RBAC, not session storage. Specified Next.js SSR/PKCE request isolation, CSRF/cache controls, server-only hostname/product resolution, server-enforced themes/seats, Stripe Billing identity mapping, and the Apple 5.1.1(v) master/per-product account-deletion saga.
- **Recommendations / findings:** **(2)** Use a host-only portal cookie (omit `Domain`; `app.petappro.com`, `Secure`, `SameSite=Lax`, `Path=/`)—never `.petappro.com`. Public `petappro.com` must not participate in auth; it only navigates to the portal. **(3)** Use shared account + independent Expo/browser sessions; do not automatically transfer tokens or login state between app and portal. Passwordless sign-in keeps the second authentication low-friction; any future QR/device handoff must exchange a short-lived one-time code server-side.
- **HairAppro rework gate:** identity keys must be `(issuer, provider_subject)`, never raw subject or email; hostname/product, cookie name, OAuth callbacks, Supabase adapter/credentials, Stripe catalogue, theme bundle, and deletion fan-out must be registry/config driven. App #2 triggers production central identity/account-linking (or a packaged IdP) if one cross-product login is promised. Missing the issuer seam now would force an unsafe identity/RLS rewrite later. No PetAppro operational table gets `app_id`.
- **Build blockers / follow-ups:** Before migrations, reconcile `data_model_draft.md` to add identity `issuer` and explicit Base509 `products`/`product_businesses`/billing-account mappings plus deletion-job/tombstone state. Before store submission, obtain counsel/product sign-off on retention/controller responsibilities, export/refund policy, successor rules, and deletion SLA; implement and test in-app whole-account deletion. This is a launch/store-rejection gate, not a fast-follow.
- **Ready to push?** no — documentation-only local edits; no staging, commit, push, or deploy. Claude Code remains sole committer after Danny approval.

---

## 2026-07-11 — Codex (D-050 tier-entitlement architecture ratification)
- **Done:** Ratified D-050 in `docs/planning/technical_architecture.md`. Base509 master is the billing/catalogue authority; PetAppro holds a tenant-scoped, server-written enforcement projection for local API/RPC/Edge Function and RLS checks. Specified event-driven instant propagation/refetch, capability-based gates for payments/seats/themes/GPS/messaging/SMS, atomic Starter ≤5 active-client enforcement, downgrade/over-limit handling without data deletion, and fail-closed Starter defaults on missing/stale/invalid resolution.
- **Decisions / open questions:** No product decision required for the architecture. Implementation gate: additive schema + generated types; signed/idempotent projection sync; shared server helpers; negative endpoint/RLS tests per capability; concurrent cap tests; stale/outage and webhook-ordering tests.
- **Ready to push?** no — design-only local edits; Claude Code is the sole committer/pusher after Danny approval.

## 2026-07-10 — Claude Code (pushed 5319f8c)
- **Pushed:** `5319f8c` → `origin/main`. Bundle: `packages/pricing` per-session/per-unit fix + 39-test suite, `open_decisions.md` D-041–D-048, `product_brief.md`, `ALIGNMENT.md` governance update, `STATUS.md`.
- **Ready to push? DONE**

---

## 2026-07-10 — Codex (single-committer governance alignment)
- **Done:** Adopted locked `ALIGNMENT.md` §1 single-committer model. Codex will edit local files only within its assigned lane and will keep all Git operations read-only (history, diffs, PR/CI inspection). Codex will not stage, commit, branch, merge, push, or otherwise write Git state; Claude Code is the sole committer/pusher and Danny approves every push.
- **Decisions / open questions:** None.
- **Ready to push?** no — status recorded as a local edit for Claude Code to include when authorized.

## 2026-07-10 — Design System (brand, theming, icons, naming — for PM sign-off)
- **Done:**
  - **Brand:** PetAppro base brand = **Brandy Blue** default theme; 5 dog-named bands (Brandy Blue · Camo Green · Coco Coral · Bella Sky · Maverick Grey); Poppins. Tokens lint-clean.
  - **Theming = Theme × Scheme matrix** (all 6 themes × Light/Dark). Dark = "light islands" (brand-tinted dark canvas, white holder cards). Verified in Figma; demo frames on `04 Themes` fixed and flipping across both axes.
  - **Icons:** locked **Phosphor (fill) as the base** icon set + 2 custom marks (Boarding doghouse, Walking dog — Danny's SVGs). Built as swappable `icon/*` components (24×24, proportions locked, fill bound to token). Full service set: boarding/walking/daycare/house-sitting/drop-in/grooming/training/pickup/meet-greet/health.
  - **Naming convention** documented (`design-system/docs/naming-conventions.md`): tokens (slash/lowercase), components (atomic-layer folders + PascalCase, variant sets), icons (`icon/<name>`), pages/§sections. Applying now.
  - Built atoms so far: Button, Status Badge (8), Service Pill (8) — being upgraded to convention + icons.
- **Decisions needing product/PM awareness:**
  - **Rover fully removed** from PetAppro (page + all affordances) — Woof-only. (Flag for George/roadmap.)
  - **Service model = generic timed services** (start/end triggers; future verticals may auto-trigger + a "no-show → fee" toggle). Services: boarding, daycare, walking, house-sitting, drop-in, grooming, training, pickup, meet & greet (+ health/vet). Confirm this taxonomy with product.
  - **Responsive dual-platform** confirmed (mobile app + provider website); components built responsive.
  - **Theming tiers** (for entitlements): Tier 1 = default (Brandy Blue) · Tier 2 = pick 3 · Top = all · **add-on theme packs** (Holiday/Spring; free-or-paid TBD) — needs a product/pricing decision.
- **Tonight (autonomous build):** applying naming + page reorg, then building atoms → molecules → organisms (text inputs, buttons, images, avatars, form elements + forms), all token-bound with code syntax so Claude Code can implement directly.
- **Ready to push?** yes — `design-system/docs/naming-conventions.md`, `tokens/**` (matrix + brand), `CHANGELOG.md`; Figma file updated (not git-tracked). Pending Codex governance review.

---

## 2026-07-10 — Claude Code (Codex hardening v2: per-session/per-unit rate resolution bug)

- **Done:** Fixed the same per-date rate-resolution bug in `per_session` and `per_unit` models that the previous session fixed for `per_night`. The v0.3.0 `resolvePerNightRates` helper was renamed to `resolvePerUnitRates` (same algorithm, adds `unitSingular` label param) and is now invoked for all three dated models when `rate_tiers` are configured:
  - `per_night` ✓ (was already fixed)
  - `per_session` ✓ (new — daycare bug: 5-day stay with 1 holiday day was billing 5 × holiday rate)
  - `per_unit` ✓ (new — same logic extended)
  - `flat` remains whole-booking (no per-date concept)
  - No-dates fallback: `resolveRateTier` skips its holiday check when `start_at`/`end_at` are absent, so the holiday tier is never mis-fired without date evidence.
- **Engine version bumped to v0.3.0** (same version — this is the same release candidate).
- **New golden tests (39 total, 8 skipped — was 35+8):**
  - Daycare 5-day / 1-holiday regression: `4 × $45 + 1 × $60 = $240`, two base lines, `rate_tier_condition` undefined.
  - All-holiday daycare: `1 × $60`, one base line, `rate_tier_condition === "holiday"`.
  - No-holiday daycare: `3 × $45`, one base line, `rate_tier_condition === "regular"`.
  - Line-sum invariant for mixed per_session stays.
- **All 39 tests green, 8 skipped. `tsc --noEmit` clean.**
- **Ready to push? NO — waiting for Danny's "ready to deploy"**

---

## 2026-07-10 — Claude Code (Codex hardening: per-night rates + purity + validation + freeze)

- **Done:** Applied all four Codex `c8b5628` findings to `packages/pricing` (engine bumped to v0.3.0):
  - **BLOCKER fixed — per-night rate resolution:** `resolvePerNightRates()` now iterates each calendar date independently. Only holiday-calendar dates get the holiday rate; all other nights stay at regular (or extended if the whole stay qualifies). Mixed stays emit one base line per condition group (e.g. "3 × $75 regular + 2 × $90 holiday"). The whole-stay `resolveRateTier()` is kept as the fallback for non-per_night models and when booking dates are absent.
  - **Function purity:** Removed module-level `let _sortOrder` and `nextOrder()`. Replaced with a local closure counter via `makeCounter()` inside `calculateBookingPrice`. Each call starts fresh; no cross-call interference.
  - **Runtime validation:** `assertMinorUnit()` + `assertPositiveInt()` called via `validateInputs()` at the top of every calculation. Throws `[pricing] <label> must be a non-negative integer minor unit; got <value>` for non-integer, negative, or non-finite inputs (quantity, rate_minor, amount_minor on all rules, participant rates, addon rates).
  - **Deep freeze:** `deepFreeze<T>()` recursively freezes the returned `PricingBreakdown`. Mutation at the call site throws `TypeError` in strict mode.
- **New golden tests (35 total, 8 skipped — was 24+8):**
  - **(a)** Mixed stay: 5 nights (3 regular $75 + 2 holiday $90) → subtotal 40500, two base lines, `rate_tier_condition` undefined.
  - **(b)** All-holiday stay: 2 holiday nights → 18000, one base line, `rate_tier_condition === "holiday"`.
  - **(c)** No-holiday stay with rate_tiers: 3 regular nights → 22500, one base line, `rate_tier_condition === "regular"`.
  - Line-item sum invariant test for mixed-rate stays.
  - Deep-freeze invariant: `Object.isFrozen(bd)` and `Object.isFrozen(bd.totals)` true; mutation throws.
  - Runtime validation: quantity=0, quantity=1.5, negative rate_minor, NaN, fractional amount_minor all throw `[pricing]` errors.
- **All 35 tests green, 8 skipped. `tsc --noEmit` clean.**
- **Ready to push? NO — waiting for Danny's "ready to deploy"**

---

## 2026-07-10 — Codex (tech-governor: D-039 / D-041–D-046 review)

- **Done:** Freshness gate passed at `c8b5628` (`main == origin/main`, above `7e2ec97`); D-039 revision and D-041–D-047 are present. Reviewed only the requested pricing/data-model/decision scope. Ran `packages/pricing`: **24 passed, 8 skipped**.
- **Pricing findings (CHANGES NEEDED):**
  - **Blocker — mixed holiday stays overcharge:** `packages/pricing/src/engine.ts` `resolveRateTier()` selects holiday when *any* booking date matches, then applies that rate to the entire quantity. This conflicts with `booking_and_pricing.md` §6.2/holiday granularity (boarding per-night, daycare per-day, walking per-session/day). B3 covers only three all-holiday nights, so it does not catch the defect. Split the base into condition-homogeneous lines/units (or otherwise resolve per unit) and add mixed regular+holiday boundary tests.
  - **Should-fix — purity/reentrancy claim is too strong:** `engine.ts` uses module-global mutable `_sortOrder`, plus `Date`, `Math.random`, and UUID generation inside calculation. Inputs/config are not mutated and totals are repeatable, but the function is not referentially transparent and concurrent/reentrant calls can interfere with ordering. Make ordering call-local and inject/provide calculation metadata if strict purity is required; strengthen the test beyond totals/amount arrays.
  - **Should-fix — snapshot immutability is a persistence contract, not implemented here:** the returned `PricingBreakdown` is mutable and does not carry the full `PricingConfig`, despite the type comment saying to carry config verbatim. The draft DB has an authoritative `booking_price_breakdowns` row, but no booking-create persistence exists in reviewed scope. Persist the resolved config/context (including tier/date inputs) server-side and preserve prior snapshots on reprice before calling this implemented.
  - **Should-fix — numeric invariants lack runtime validation:** types document integer minor units and bps/ppm, and percentage math rounds half-up per generated percentage/tax line, but the engine accepts fractional/negative/out-of-range values and can create negative taxable subtotals/totals. Add boundary validation and tests (integer/safe-integer money, valid bps/ppm, discount caps). Remaining percentage discounts are correctly additive/non-compounding for valid inputs; B3/B4 correctly prove explicit-rate and flat-fee behavior in their covered cases.
- **Data-model feasibility (§8):** (1) **Net-new schema work:** `business_services.date_model` has `overnight|day|slot` and pricing supports `per_night`/`per_session`, but there is no explicit `per_visit` model and no booking/service location attribute (`location_id` is expressly deferred). Drop-in/in-home can reuse pricing/date concepts, but location + service semantics are not already carried. (2) **Small-to-moderate extension of an existing availability domain, but net-new conflict logic:** blocked dates/capacity and server enforcement exist; booking-overlap/conflict groups do not. Add tenant-scoped service conflict policy and transactional server-side overlap enforcement/tests. (3) **Net-new:** no visit-instance/check-in/out/report-card tables support N visits per day. Add booking visit occurrences and per-visit report-card lifecycle with `business_id`, RLS, timestamps, assignment, and completion lock. (4) **Small extension in pattern, new fields/persistence:** D-043 follows the immutable pricing-snapshot principle, but hours/off-hours/travel/source-rate settings are not present in the draft booking/breakdown model or current engine output as a complete config snapshot.
- **Architecture/governance:** D-041 fits one shared Supabase/RLS backend, but `technical_architecture.md` still describes web as thin marketing/billing only and must be revised before build. Web and native must share identity mapping and active-tenant semantics; never trust a client-supplied `business_id`; config writes need owner/admin authorization, step-up for financial/security-sensitive actions, server/RPC boundaries, audit, CSRF-safe web sessions, and RLS regression coverage across both clients. D-042 has no implementation violation visible (no product app code in reviewed scope; web-only SaaS billing is the standing architecture), but architecture/data-model docs still incorrectly say Connect is post-MVP/manual-only and must be reconciled; enforce no native subscription purchase/link/CTA. D-044 is compatible with D-034–D-038 only if ciphertext remains tenant-scoped under RLS, plaintext decrypt occurs through a narrowly authorized/audited server path for the assigned provider, keys are separated/rotatable, plaintext is excluded from logs/backups/notifications/analytics, and biometric reveal is only an additional client gate. The decision does not yet specify that implementable design. D-045/D-046 require the schema/RLS additions above. D-047 remains open and was not reviewed.
- **Verdict / open questions:** **CHANGES-NEEDED** for pricing before governor approval. Data-model answers: **(1) net-new schema, (2) existing domain + net-new conflict engine, (3) net-new, (4) reusable pattern + new persisted snapshot fields.** Design-system review remains HELD as requested.
- **Ready to push? NO** — review entry only; no code or governed files changed, committed, pushed, or deployed.

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

## 2026-07-10 — Cowork (pricing fix verification)
- **Independently verified** Claude Code's per_session/per_unit granularity fix: ran the suite in a clean isolated install (not Danny's node_modules) → **39 passed, 8 skipped**, matching CC's report. Confirmed in-code: `resolvePerUnitRates` wired to per_night/per_session/per_unit (per-date resolution), `validateInputs` (integer/finite/non-negative guards), and `deepFreeze` on the returned snapshot. Codex's CHANGES-NEEDED blocker is **closed**. Fix sits uncommitted in the local tree (head still `c8b5628`) per single-committer model. **Bundle is ready for Danny's "ready to deploy."**

---

## 2026-07-10 — Cowork (product management)
- **Done:** Scoped drop-in + in-home-sitting verticals and the provider config/payments model. Wrote `docs/planning/provider-settings-ia.md` (settings IA + web-portal/app surface split). Logged **D-041** (web portal = editor/billing surface; app basic), **D-042** (subscription web-only, no in-app purchase/CTA → B2B-SaaS 0% store fee; client booking payments via Stripe Connect, IAP-exempt physical service), **D-043** (off-hours surcharge + hours-of-operation + snapshot-on-booking; flat travel fee MVP, per-mile deferred), **D-044** (secure access storage), **D-045** (availability conflict-groups), **D-046** (report-card CMS templates + edit-lock). Added **D-047** (OPEN — service content + Woof carryover + report-card review; boarding-first). GPS confirmed as v1.1 fast-follow (manual proof-of-walk in MVP).
- **Decisions / open questions:** D-041–D-046 **FINAL**; added **D-048** (MVP verticals = boarding/daycare/walking + drop-ins stretch; in-home/house sitting = first fast-follow; soft-plan to fold in if gates clear, gut-check at first major check-in). Folded Codex's D-044 crypto reqs (tenant-scoped ciphertext, separated keys, audited decryption).
- **Pricing blocker root-cause (verified by Cowork, reading c8b5628):** the `per_night` path is **correct** (per-night resolution, holiday-marked dates only) — Danny was right. Codex's blocker is real but in the **`per_session`/`per_unit` path** (multi-day daycare package → holiday applied to whole booking). Narrow fix issued to Claude Code (extend per-date resolution to dated per_session/per_unit; + purity/validation/snapshot hardening). Codex-flagged **stale manual-payment/Connect docs** **full reconciliation pass** of `product_brief.md` (payments + web-first→native/Expo, design-partner→testing-partner, boarding/daycare→+walking/drop-ins, roles+app-fork, theming, architecture, Netlify→EAS, resolved open questions); the two **Codex-lane** docs (`technical_architecture.md` L67/178/219, `data_model_draft.md` L134) are pinned in `ALIGNMENT.md` §7 for Codex to fix (still say Connect is post-MVP — wrong vs D-007 Option A / D-042).
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
