# Pricing Engine — Round-2 Prompt for George

> Companion to `docs/planning/pricing_engine_research.md` (George's v1). This is the follow-up
> prompt to close the gaps Cowork flagged in review (2026-07-07). George's v1 lacked our decided
> context (tenancy, money-as-minor-units, store-total-at-booking, manual-payments MVP, existing
> enum), so this prompt feeds those in and aims at the specific gaps. After George returns, Cowork
> reconciles the result against the decided docs (annex §5, D-025, D-007, D-022) and folds it into
> the architecture. Feeds **DR-5**; gates un-holding the `packages/pricing` extraction.

---

## Prompt (paste to George as-is)

```
Thanks — your single-configurable-engine conclusion is accepted. Now tighten it
into a build-ready spec. Below are constraints from our architecture you didn't
have; incorporate them, then close the specific gaps listed.

CONSTRAINTS TO INCORPORATE (previously not shared with you)
- Multi-tenant: every rate, rule, and add-on is per-business. The engine takes a
  tenant (business) context; there is no global rate table. Config objects carry
  a business_id.
- Money is stored as integer minor units (e.g., cents). Support multiple
  currencies, one per business. Rounding must be explicit.
- Server-authoritative: the engine is ONE shared package invoked server-side;
  the client never computes authoritative prices.
- The engine must return a STORABLE, itemized breakdown that gets stamped on the
  booking at booking time and never changes when rates later change.
- MVP payments are tracked manually (no auto-charge); deposits are recorded, not
  captured. Design for online capture later.
- MVP verticals = dog boarding + daycare + dog walking (walking as a bookable
  SERVICE — no GPS / live route tracking in MVP). Design the model to support the
  other verticals too, but don't require them for v1.
- Our current enum to reconcile with (don't invent a parallel one):
  pricing_model = per_night · per_session · per_hour · per_head · per_unit ·
  tiered · flat ; pricing_rule types = base · surcharge · discount · holiday · peak.

GAPS TO CLOSE
1. Canonical order of operations, stated unambiguously with WORKED NUMERIC
   EXAMPLES: are % discounts applied before or after surcharges? Is tax on the
   pre- or post-discount subtotal? Do stacked modifiers add or compound, and in
   what priority order?
2. Rounding & currency: where rounding happens (per line item vs final total),
   which rule (half-up vs banker's), and how minor units are handled.
3. ONE reconciled pricing-model/unit enum merging your list with ours above.
   Explicitly keep: fixed-price-per-duration-tier (e.g., 30/60/90-min massage is
   NOT linear per-hour) and partial-unit / overage (dog boarding charged past a
   24h boundary + a grace threshold).
4. Define the itemized breakdown object the engine outputs and that we persist.
5. Draw the boundary: what the PRICING engine computes (deterministic amounts)
   vs what the BILLING/policy layer owns (deposit capture, cancellation, refunds,
   insurance). Keep the engine pure.
6. Tag each primitive as MVP (dog boarding + daycare + dog walking) vs later.
7. Propose a golden-test set: worked scenarios per vertical that lock the math.

Keep it decision-ready and precise on the money math — that's the part that
must be exactly right.
```

---

## Review gaps this prompt targets (from Cowork's 2026-07-07 review of v1)

- Money-correctness: canonical order of operations + rounding/currency + stored immutable breakdown.
- Architecture alignment: tenancy (missing in v1), reconcile enum, keep `tiered`/fixed-per-duration + partial-unit overage.
- Keep engine pure (deposits/cancellation/refunds/insurance = billing layer).
- Scope: MVP subset (dog boarding + daycare + dog walking — no GPS, D-022) vs later; golden regression tests per vertical.
