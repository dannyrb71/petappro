# Booking & Pricing — Build-Ready Spec (Pricing Engine)

> **Status:** Build-ready spec (Cowork reconciliation, 2026-07-08). This is the **source of truth** for the pricing engine.
>
> **Lineage:** George drafted the research + engine model (`docs/research/pricing_engine_research.md` v1, `docs/research/petappro_pricing_engine_spec.md` v2). Codex ratified the identity/tenant architecture (D-034–D-038) and the review brief (`docs/research/pricing-engine-review-brief.md`). **This doc reconciles George v2 against the decisions made after it was written** and is what Codex/Claude Code build from. Where this doc and George v2 differ, **this doc wins**; for full worked examples and TypeScript shapes, George v2 remains the detailed reference.

---

## 0. Reconciliation deltas from George v2 — READ FIRST

George v2 is adopted wholesale **except** these four changes, which reflect decisions made after he wrote it:

1. **Dog walking is IN the MVP (D-022).** George scoped MVP to boarding + daycare and put walking under "later." **Walking is now an MVP vertical** (service only — *no GPS / live route tracking*). Consequence: pull **`per_session`** (already MVP) and **`duration_tiered`** (walk lengths are **provider-defined** — the provider builds their walk service with **≥1 duration tier**, sets each tier's label + duration + price, and can add more; PetAppro presets no tiers) **into MVP**. Group/multi-dog walks price via **participant scaling** (per-dog) and/or per-session; **group concurrency/capacity** (e.g., "up to 6 dogs on one walk") is a **scheduling/capacity concern, not pricing** — the pricing engine just prices the session + per-dog; the capacity engine (annex §5 `capacity_model`) governs how many share a slot. They interact but stay separate. **Walk type is provider-configured:** the provider chooses which they offer — **Group**, **Individual**, or **Both** (a single generic walk if they don't differentiate). Group → per-dog pricing + concurrency cap; Individual → per-session/duration for one household. When both are offered, the client selects the type at booking (flow's "solo or group"). This is a walk-service config field feeding provider setup + the booking flow.

2. **No deposits in the MVP (D-015, Decided 2026-07-08).** George kept "deposit amount calculation" in MVP. **Remove deposits from MVP entirely.** The engine *may retain* deposit **config support** for later, but **MVP config never sets a deposit**, `deposit_due_minor` is always `0`, and `balance_due_minor == total_minor`. Drop the deposit worked example (George Example 1's deposit lines, Golden Test 7) from the MVP set — keep them only as "later" references. Revisit deposits only on customer feedback.

3. **Payments are Stripe Connect, not manual (D-007 Option A).** George's §1.5 says "MVP payments are tracked manually." **Reverse it:** in-app **client→provider payments via Stripe Connect are IN the MVP.** The engine's `total_minor` becomes the **exact amount the billing layer charges via Connect.** This makes pricing correctness **launch-critical** (a wrong total auto-charges a wrong amount). Manual tracking remains only as a **fallback** if payments derail near the store deadline. The engine boundary is unchanged — engine computes amounts; the billing/Connect layer captures them (see §2.2).

4. **Actor references use `base509_account_id` (D-035).** Anywhere the pricing/booking records reference a person (`booking_price_snapshots.created_by`, any `staff_id`/actor), use the stable **`base509_account_id`**, not raw `auth.uid()`. RLS on pricing config + snapshots keys off the tenant helper (`current_base509_account_id()` / `role_for_business()`), never raw auth ids.

Everything below restates the **agreed core** (from George v2) that these deltas sit on top of.

---

## 1. Core constraints (adopted from George v2 §1)

- **Multi-tenant.** Every pricing object carries `business_id`. No global rate table. The engine executes only within the provided tenant context and never reads rates outside that `business_id`.
- **Money = integer minor units.** No floats. Percentages as **basis points** (`bps`); tax rates as **parts-per-million** (`ppm`) to express rates like 8.625%. One configured `currency` per business for MVP; never mix currencies in one calculation. (Aligns D-025.)
- **Server-authoritative.** The engine is one **shared package invoked server-side**. The client may show an *estimate*; the server re-runs the engine immediately before booking create/update and persists the authoritative breakdown. Client never computes the authoritative total.
- **Storable, immutable snapshot.** The engine returns a full itemized breakdown that is **stamped on the booking at booking time** and never mutated by later rate/rule changes. Historical bookings are financial records, not live recalculations. **Critical with Connect:** the amount charged must equal the stored breakdown's `total_minor`.

---

## 2. Engine boundary (adopted from George v2 §2)

**The pricing engine owns** (pure, deterministic, no side effects, no DB, no payment capture): base rate, quantity, duration-tier pricing, participant scaling, add-ons, surcharges, discounts, holiday/peak rules, rate overrides, authorized manual overrides, tax (when configured), itemized breakdown generation. `calculatePrice(input, config)` → same input + config = same output.

**The billing / policy / Connect layer owns:** creating the **Stripe Connect charge** from the engine's `total_minor`, recording payments, refunds, cancellation/no-show workflows, invoices/receipts, and deciding *whether/when* an action (cancel, reprice) is allowed. The engine may *calculate* an amount (e.g., a hypothetical cancellation fee) but never decides policy or moves money.

> **Tips (in MVP):** client-chosen, 100% to the provider (no platform fee), not taxable, not part of the pricing subtotal — the billing layer records them and adds them to the Connect charge. The engine may *optionally* surface suggested tip amounts, but the authoritative tip is client input. See §5A.

---

## 3. Canonical pricing model enum (adopted; do not fork)

```ts
type PricingModel =
  | "flat" | "per_unit" | "per_session" | "per_hour"
  | "per_head" | "per_night" | "tiered"
  | "duration_tiered"        // fixed price per duration tier (walk 30/60/90; massage) — NOT linear per_hour
  | "partial_unit_overage";  // boundary + grace threshold → partial/extra charge (boarding late pickup)
```

```ts
type PricingRuleType = "base" | "surcharge" | "discount" | "holiday" | "peak";
```

`holiday`/`peak` are date-based; may act as surcharge or override per config. `peak` is later.

---

## 4. Canonical order of operations (adopted from George v2 §6 — authoritative)

Apply in **exactly** this order; round **each line item** to minor units as it's created, then sum. `Final total = sum of persisted line items` (no hidden fractional cents).

1. Resolve business currency + rounding config
2. Resolve base service price
3. Base quantity
4. Participant pricing (per-dog / per-person)
5. Rate overrides
6. Fixed surcharges
7. Percentage surcharges
8. Add-ons
9. Discounts — **fixed first, then percentage**
10. Taxable subtotal
11. Taxes + pass-through fees (if configured)
12. ~~Deposit~~ **(MVP: skipped — D-015; `deposit_due_minor = 0`)**
13. Final total
14. Return itemized breakdown

**Stacking rules (critical, adopted):**
- Fixed modifiers **add arithmetically**.
- Percentage surcharges are **additive, not compounding** (holiday 20% + weekend 10% = 30% of base, i.e. `$100 → $130`, **not** `×1.2×1.1 = $132`). MVP does not support compounding.
- Discounts apply **after** surcharges + add-ons, to the **full pre-tax subtotal**; fixed before percentage; percentage discounts additive not compounding.
- **Tax after discounts**, on the post-discount taxable subtotal; rounded once per tax group (one business-level tax line for MVP).

**Rounding:** **half-up**, per line item (not banker's). `amount_minor * bps / 10000` for percentages; `amount_minor * ppm / 1_000_000` for tax.

---

## 5. Itemized breakdown object (adopt George v2 §9 verbatim)

Use George v2's `PricingBreakdown` / `PricingLineItem` / `AppliedPricingRule` / `PricingWarning` shapes. It satisfies the review-brief acceptance bar (audit + reporting + Stripe-ready + historical snapshot): it carries `pricing_engine_version`, `calculation_id`, `calculated_at`, `business_id`, `currency`, per-line `source`/`calculation`/`taxable`, applied rules, and totals. **MVP note:** `deposit_due_minor` is always `0` and `balance_due_minor == total_minor` (D-015).

**Persistence (George v2 §10):** stamp `price_breakdown_json` + `price_total_minor` + `price_currency` + `pricing_engine_version` + `priced_at` on the booking; keep a `booking_price_snapshots` history table on reprice (with `created_by = base509_account_id`, D-035). Do not recalculate historical bookings unless an authorized user explicitly reprices.

---

## 5A. Tips (MVP — Danny, 2026-07-08)

Provider tips are **in the MVP**.

- **Who gets it:** **100% to the provider; Base509 takes no cut** (D-029). With **Standard** Connect accounts the tip rides the provider's charge; the provider bears Stripe's processing fee on it.
- **Not priced by the engine:** a tip is client-chosen, not derived from config. It is **not taxable**, **not** in the pricing subtotal, and **not** subject to discounts. It sits *outside* the §4 order-of-operations total.
- **Engine's optional role:** the engine or UI may present **suggested tip amounts** — e.g. 15% / 18% / 20% of the **post-tax service total**, plus custom and no-tip options. Suggestions are convenience only; the **authoritative tip is the client's input**.
- **Charged by the billing layer** via Connect, recorded as its own line (`category: "tip"`), added at/after checkout. **The Connect charge = service `total_minor` + `tip_total_minor`.** Persist `tip_total_minor` **separately** from the service total on the booking/payment record so reporting cleanly separates service revenue from tips.
- **Breakdown:** if tips are surfaced in the breakdown object, add `"tip"` to the line-item `category` union and keep `tip_total_minor` distinct from the engine's `total_minor` (which remains service-only).

---

## 6. MVP scope (reconciled)

**MVP required** — for **boarding, daycare, AND dog walking** (D-022):
- Multi-tenant configs; integer minor-unit money; server-authoritative calc; storable itemized breakdown
- Models: `flat`, `per_unit`, `per_session`, `per_night`, basic `tiered`, **`duration_tiered`** (walk 30/60/90), `partial_unit_overage` (boarding late-pickup/checkout)
- Base rates; additional-pet (participant) fees; add-ons; fixed + percentage surcharges; fixed + percentage discounts; holiday rules; authorized manual discount/override
- Tax disabled or simple business-level rate
- **No deposits** (D-015)
- **Golden tests** locking all of the above
- **Provider tips** — client-chosen, 100% to provider, not taxed/discounted (§5A)
- Output feeds the **Stripe Connect** charge (D-007); Connect charge = service total + tip

**Later:** `per_hour`, `per_head`, advanced `tiered`, peak pricing, packages/memberships/prepaid credits, staff/provider rate tiers, multi-location rate books, travel-radius fees, insurance billing, refund/cancellation-fee workflows, gift cards, coupons w/ redemption limits, dynamic pricing, **deposits** (unless customers ask — D-015).

---

## 7. Open product decisions — RESOLVED for MVP

George v2 §13 flagged four; resolving them here so the build isn't blocked:

- **Tax (13.1):** support a **simple business-level tax rate that can be disabled.** (Adopt George's recommendation.)
- **Discount basis (13.2):** **one fixed rule — discounts apply to the full pre-tax subtotal after surcharges + add-ons.** Configurable basis is later.
- **Holiday granularity (13.3):** **boarding = per-night** holiday matching; **daycare = per-day**; **walking = per-session/day**.
- **Repricing (13.4):** editing a booking recalculates at **current active rates** but **preserves the prior breakdown** in `booking_price_snapshots`.

---

## 8. Golden tests (reconciled)

Keep George v2 §12 boarding + daycare tests, **with two changes**: (a) **drop Test 7 (deposit)** from MVP — deposits are out (D-015); (b) **add walking tests**. Each test asserts line items, applied rules, subtotals, discounts, tax, final total, rounding, and order-of-operations. Money in minor units.

Retained MVP boarding/daycare tests: simple boarding; +additional dog; holiday % surcharge; fixed + % surcharge; add-on + discount; late-pickup overage; tax-after-discount. Daycare: simple full-day; multi-day; half-day tier; additional dog; manual discount; add-on.

**New MVP walking tests (add):**
- *W1 — duration tier:* 30-min `$30` / 60-min `$50` / 90-min `$70`. The 90-min booking must total **`7000`**, not `$30×3` and not `$50×1.5`.
- *W2 — group / multi-dog walk:* 60-min walk `$50`, second dog `+$20` (participant fee) → total **`7000`**. (Capacity cap of 6 dogs is enforced by the scheduling layer, not asserted here.)
- *W3 — walk with holiday surcharge:* 30-min `$30` + 20% holiday = **`3600`**.

---

## 9. Architecture-review notes (Staff/Principal lens)

George v2's design is sound and build-ready. Flags for implementation:

1. **`partial_unit_overage` is the riskiest primitive** (boarding late-pickup past a 24h boundary + grace). It depends on **timezone / day-boundary** correctness — pin the business timezone as the source of truth and cover it heavily in golden tests (grace-edge cases, multi-rollover long stays, holiday-boundary interaction from feature-idea F-003).
2. **Connect makes the snapshot contract load-bearing.** The amount charged **must equal** `total_minor` from the stored breakdown, and `pricing_engine_version` must be recorded so a later engine change can't silently alter what a customer was charged. Add a test that the charge amount is read from the persisted snapshot, never recomputed at charge time.
3. **Walking pricing vs. capacity are separate but interacting.** Keep group-walk *pricing* (per-session + per-dog) in the engine; keep *concurrency* (max dogs per slot) in the capacity/scheduling engine. Don't let one leak into the other.
4. **No floats, ever** — enforce integer-minor + bps + ppm in code and assert it in tests (a float in money math is the classic silent bug).
5. **Purity is testable** — engine takes a `pricingConfigSnapshot` in, returns a breakdown; no Supabase reads inside the engine (server loads config → passes in → persists result). This is what lets the golden tests exist.

---

## 10. Build sequence

1. Stand up `packages/pricing` (or `src/lib/pricing` pre-monorepo).
2. **Golden tests first** (§8) — lock the math before any UI depends on it.
3. Implement `calculateBookingPrice(input): PricingBreakdown` to pass the golden set.
4. Wire server-side: load tenant config → run engine → persist booking + breakdown snapshot.
5. Billing layer creates the **Stripe Connect** charge from the persisted `total_minor`.

**Guiding principle (George v2 §15):** *the price shown on a booking must be the exact sum of the stored itemized line items, calculated server-side, in integer minor units, with explicit half-up rounding.*

---

## 11. Still open / follow-ups

- ~~Tips in MVP?~~ **Resolved (Danny 2026-07-08): YES, tips are in MVP** — see §5A (billing-layer Connect line, 100% to provider, not engine-priced).
- ~~Connect fee model?~~ **Resolved (Danny 2026-07-08): no platform fee; Standard Connect accounts.** Base509 pays Stripe **nothing per transaction** (Stripe bills the provider directly for ~2.9%+30¢); Base509 revenue is subscription (Billing) only (D-029). *Future:* if PetAppro ever moves to Express/Custom accounts ($2/active acct/mo + 0.25%+25¢/payout), roll that platform cost into flat/tiered subscription pricing — not needed for MVP.
- **Extract vs rewrite (still open):** decide whether to extract/refactor the existing Woof pricing logic into this model or build fresh to this spec (the tenant-aware + minor-unit + breakdown requirements may make a clean build faster than retrofitting the 3 old copies).
- **Walk pricing shape (verify via research, DR-5):** the engine supports both **linear per-time** (`per_hour`) and **fixed duration blocks** (`duration_tiered`, where a 60-min walk is priced independently of the 30-min, often < 2×). Confirm via competitor walking apps (Rover / Wag / Time To Pet) **which shape + which standard blocks are the norm**, to pick the sensible *default* to offer providers. No engine change — a config/UX default only.
