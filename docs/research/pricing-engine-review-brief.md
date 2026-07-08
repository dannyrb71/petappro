# Pricing Engine — Reconciliation & Architecture-Review Brief

> Governing brief for turning George's v2 spec (`petappro_pricing_engine_spec.md`) into a
> build-ready spec + implementation. Source: **ChatGPT (Project Manager), 2026-07-07.** Applied by
> Cowork when reconciling against the decided docs, then handed to Codex/Claude Code for build.
> Part of the DR-5 thread. Related: `pricing_engine_research.md` (v1), `petappro_pricing_engine_spec.md` (v2),
> `pricing-engine-round2-prompt.md`.

## The directive (from ChatGPT)

Treat George's document as the **product specification, not the implementation.** Before writing
production code, perform an **architecture review from a Staff/Principal Software Engineer
perspective.** Preserve the business behavior and pricing math, but improve the technical design
where appropriate:

- Eliminate redundancy or ambiguity.
- Simplify the pricing model if a more generic abstraction exists.
- Ensure the engine is **deterministic, pure, and easily unit-tested.**
- Recommend any **database/schema improvements** needed to support the engine.
- Verify the **itemized breakdown** is sufficient for **auditing, reporting, future Stripe
  integration, and historical booking snapshots.**
- Keep the design **extensible for future verticals** without adding MVP complexity.
- **Do not change** the accepted pricing math, order of operations, rounding rules, or
  server-authoritative architecture **unless you identify a correctness issue and explain why.**

## Cowork notes (alignment + precision)

- Aligns with the v1 review (determinism/purity/testability, pinned order-of-ops, rounding,
  storable immutable breakdown, MVP-vs-later split, multi-tenancy).
- **Precision on "accepted":** the pricing **math** and **server-authoritative** architecture are
  accepted. The **order-of-operations and rounding rules are NOT yet locked** — round-two asked
  George to *define* them in v2, so they are "proposed, under review" this pass and get ratified
  (then locked) after review. Don't rubber-stamp un-checked numbers.
- Apply against the **decided context** George lacks: multi-tenant (per-business rates/rules),
  money as integer minor units + per-business currency (D-025), store total + breakdown at booking
  time (immutable history), manual payments in MVP (deposits recorded, not captured — D-007),
  MVP verticals = **boarding + daycare + dog walking, no GPS** (D-022).

## Output shape

1. **Product spec** (behavior/math preserved) → `docs/specs/booking_and_pricing.md`.
2. **Architecture-review notes** (Staff/Principal lens): technical-design + schema improvements,
   and any correctness issues found — each explained. Math changes only on an identified bug.
3. **Golden-test set** — worked scenarios per MVP vertical locking the math.
