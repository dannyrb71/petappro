# Petappro Pricing Engine Specification

## Status

Build-ready planning specification.

## Purpose

Petappro needs one generalized, configurable pricing engine that can support multiple service verticals without hard-coded vertical-specific pricing logic.

The accepted product decision is:

> Petappro should use one configurable pricing engine. Vertical differences should be handled through tenant-specific configuration, pricing models, rules, add-ons, and policies — not separate pricing engines.

MVP support is focused on:

1. Dog boarding
2. Dog daycare

The model should remain extensible for:

- Dog walking
- Pet sitting / drop-in visits
- Dog training
- Hair stylists / salons
- Massage therapists

---

# 1. Core Constraints

## 1.1 Multi-Tenant

Every pricing object belongs to a business.

There is no global rate table.

All pricing configuration must carry:

```ts
business_id: string
```

The pricing engine must always execute within a tenant context:

```ts
calculatePrice({
  businessId,
  currency,
  bookingInput,
  pricingConfigSnapshot
})
```

The engine must never look up or apply rates outside the provided `business_id`.

---

## 1.2 Currency and Money Storage

All money must be stored as integer minor units.

Examples:

| Currency | Major Unit | Minor Unit Storage |
|---|---:|---:|
| USD | $10.00 | 1000 |
| CAD | $10.00 | 1000 |
| EUR | €10.00 | 1000 |
| JPY | ¥10 | 10 |

Each business has exactly one configured currency for MVP.

```ts
business.currency = "USD"
```

Pricing configs for a business must use that business currency.

Do not mix currencies within one booking calculation.

---

## 1.3 Server-Authoritative Pricing

The pricing engine is a shared package invoked server-side.

The client may display estimated pricing, but the client must never compute authoritative totals.

Authoritative pricing must be calculated on the server immediately before booking creation or booking update.

The server response must include the full itemized price breakdown that will be persisted on the booking.

---

## 1.4 Storable Price Snapshot

The engine must return a storable, itemized breakdown.

That breakdown is stamped onto the booking at booking time.

Later changes to rates, rules, packages, discounts, taxes, or add-ons must not mutate past bookings.

A booking stores:

- Final total
- Currency
- Itemized lines
- Applied rules
- Quantity assumptions
- Rate/config IDs and names used at calculation time
- Engine version
- Calculation timestamp

Historical bookings are financial records, not live recalculations.

---

## 1.5 MVP Payments

MVP payments are tracked manually.

The pricing engine may calculate:

- Total amount due
- Suggested deposit amount
- Remaining balance

But MVP does not auto-charge.

Deposits are recorded, not captured.

Future online payments may use the same pricing breakdown to create Stripe/online payment intents.

---

# 2. Engine Boundary

## 2.1 Pricing Engine Owns

The pricing engine computes deterministic monetary amounts from booking input and pricing configuration.

It owns:

- Base service price
- Quantity multiplication
- Duration-tier pricing
- Participant scaling
- Add-ons
- Surcharges
- Discounts
- Holiday rules
- Peak pricing rules
- Staff/provider rate modifiers
- Manual price overrides when explicitly passed in by authorized server logic
- Tax calculation when tax config is provided
- Deposit amount calculation when deposit config is provided
- Itemized breakdown generation

The pricing engine is pure:

```ts
pricingResult = calculatePrice(input, config)
```

Same input + same config = same output.

No side effects.

No database writes.

No payment capture.

No mutation of booking records.

---

## 2.2 Billing / Policy Layer Owns

The billing and policy layer owns operational payment behavior.

It owns:

- Capturing deposits
- Recording manual payments
- Creating payment intents
- Charging cards
- Refunds
- Cancellation workflows
- No-show workflows
- Credit balances
- Gift cards
- Insurance billing
- Payment disputes
- Sending invoices or receipts
- Applying cancellation fees after cancellation events
- Enforcing whether a booking can be modified or canceled

Important distinction:

The pricing engine may calculate what a cancellation fee would be if given deterministic inputs, but the policy layer decides whether cancellation is allowed and when that calculation is invoked.

---

# 3. Reconciled Pricing Model Enum

This spec reconciles the previously proposed unit list with the current Petappro enum.

Do not create a parallel enum.

Use this canonical enum:

```ts
type PricingModel =
  | "flat"
  | "per_unit"
  | "per_session"
  | "per_hour"
  | "per_head"
  | "per_night"
  | "tiered"
  | "duration_tiered"
  | "partial_unit_overage";
```

## 3.1 Existing Enum Values Preserved

The existing values remain valid:

- `per_night`
- `per_session`
- `per_hour`
- `per_head`
- `per_unit`
- `tiered`
- `flat`

## 3.2 Added Values

Two additional models are needed to avoid incorrect math.

### `duration_tiered`

Used when pricing is fixed by selected duration tier and not linearly derived from an hourly rate.

Examples:

- 30-minute massage = $70
- 60-minute massage = $120
- 90-minute massage = $165

This must not be represented as `per_hour`, because 90 minutes is often not simply 1.5 × the 60-minute rate.

Later verticals:

- Massage
- Dog walking
- Drop-in visits
- Salon time blocks

### `partial_unit_overage`

Used when a base unit has a boundary and a grace threshold, after which extra time triggers a partial or additional charge.

Primary MVP use case:

- Dog boarding charged per night
- Checkout after a 24-hour boundary
- Grace period applies
- Overage can trigger daycare, half-day, hourly, or extra-night fee

Example:

- Boarding includes pickup by 12:00 PM on checkout day
- Grace period: 60 minutes
- Pickup at 3:30 PM
- Apply half-day daycare fee

This model should be configured, not hard-coded.

---

# 4. Pricing Rule Types

Use the existing pricing rule type enum:

```ts
type PricingRuleType =
  | "base"
  | "surcharge"
  | "discount"
  | "holiday"
  | "peak";
```

## 4.1 Rule Type Meaning

| Rule Type | Meaning | MVP? |
|---|---|---|
| `base` | Base service rate or base tier | Yes |
| `surcharge` | Positive adjustment | Yes |
| `discount` | Negative adjustment | Yes |
| `holiday` | Date-based surcharge or rate override | Yes |
| `peak` | Date/season/demand-based surcharge or rate override | Later |

`holiday` and `peak` are specialized date-based rules.

They may behave like surcharges or overrides depending on configuration.

---

# 5. Pricing Primitives

## 5.1 Base Rate

**MVP**

Defines the starting price for a service.

Examples:

- Boarding: $75/night
- Daycare full day: $45/day
- Daycare half day: $30/session

Supported models:

- `flat`
- `per_unit`
- `per_session`
- `per_hour`
- `per_head`
- `per_night`
- `tiered`
- `duration_tiered`
- `partial_unit_overage`

---

## 5.2 Quantity

**MVP**

Multiplies a rate by a deterministic quantity.

Examples:

- 5 boarding nights
- 3 daycare days
- 2 dogs
- 6 training sessions

Quantity must be explicit in the output breakdown.

---

## 5.3 Participant Rules

**MVP for pets, later for people**

Supports pricing based on pets or people.

MVP dog use cases:

- First dog included at base rate
- Additional dog charged at fixed amount
- Additional dog charged at percentage of base
- Multi-dog discount
- Max pets per booking

Later use cases:

- Group class attendees
- Salon clients
- Massage clients
- Family training sessions

---

## 5.4 Add-ons

**MVP**

Optional or staff-selected service additions.

MVP examples:

- Bath
- Medication administration
- Late checkout
- Pickup/drop-off
- Enrichment activity

Later examples:

- Toner
- Hot stones
- Training equipment
- Extra bowls of color

Add-ons may be:

- Flat
- Per pet
- Per day/night
- Per session
- Quantity-based

---

## 5.5 Conditional Modifiers

**MVP**

Rules applied when conditions match.

MVP examples:

- Holiday surcharge
- Weekend surcharge
- Additional dog
- Late pickup
- Extended stay discount
- Manual discount

Later examples:

- Senior stylist surcharge
- Long hair surcharge
- Travel radius fee
- Evening appointment surcharge
- Peak season pricing

Modifiers may be:

- Fixed amount
- Percentage
- Rate override

---

## 5.6 Packages / Bundles / Memberships

**Later**

MVP may support simple manual discounts, but true packages and memberships are not required for boarding/daycare v1.

Later examples:

- 10 daycare pack
- Unlimited monthly daycare membership
- 6-session dog training course
- Monthly massage membership
- Salon maintenance plan

---

## 5.7 Staff / Provider Rate Variation

**Later**

Not required for MVP boarding/daycare.

Later examples:

- Junior stylist
- Senior stylist
- Master trainer
- Premium massage therapist

This should be handled as a conditional modifier or rate override.

---

## 5.8 Deposits

**MVP calculation only**

The pricing engine may calculate deposit amounts.

It must not collect payment.

Deposit config may support:

- Fixed deposit
- Percentage deposit
- Per-night deposit
- Holiday-only deposit
- Minimum deposit
- Maximum deposit

The billing layer records whether the deposit was paid.

---

# 6. Canonical Order of Operations

The engine must apply pricing in this exact order.

## 6.1 Order

1. Resolve business currency and rounding config
2. Resolve base service price
3. Calculate base quantity
4. Apply participant pricing
5. Apply rate overrides
6. Apply fixed surcharges
7. Apply percentage surcharges
8. Apply add-ons
9. Apply discounts
   - fixed discounts first
   - percentage discounts second
10. Calculate taxable subtotal
11. Calculate taxes and platform/pass-through fees if configured
12. Calculate deposit amount if configured
13. Calculate final total
14. Return itemized breakdown

---

## 6.2 Modifier Stacking Rules

### Fixed modifiers

Fixed modifiers add arithmetically.

Example:

```text
Base subtotal: $100
Holiday surcharge: +$20
Late pickup surcharge: +$15

Subtotal = $135
```

### Percentage surcharges

Percentage surcharges are additive, not compounding.

Example:

```text
Base subtotal: $100
Holiday surcharge: +20%
Weekend surcharge: +10%

Combined surcharge percentage = 30%

Surcharge amount = $100 × 30% = $30
Subtotal = $130
```

Do not calculate:

```text
$100 × 1.20 × 1.10 = $132
```

Compounding percentages are not allowed unless a future rule explicitly opts into it. MVP should not support compounding.

### Discounts

Discounts apply after surcharges and add-ons.

Fixed discounts apply before percentage discounts.

Percentage discounts are additive, not compounding.

Example:

```text
Subtotal before discounts: $200
Fixed discount: -$20
Percentage discounts: 10% + 5% = 15%

Discount base = $180
Percentage discount = $27

Subtotal after discounts = $153
```

Do not calculate:

```text
$200 × 0.90 × 0.95 = $171
```

---

## 6.3 Tax Rule

Tax is calculated after discounts.

Default:

```text
Taxable subtotal = subtotal after surcharges, add-ons, and discounts
```

Some line items may be non-taxable depending on business/tax config.

For MVP, tax can be disabled or configured at the business level.

If tax is enabled, tax must be calculated on the post-discount taxable subtotal.

---

## 6.4 Deposit Rule

Deposit is calculated after taxes unless configured otherwise.

Default:

```text
Deposit = percentage of final total including tax
```

For MVP, use this default.

Later, businesses may configure deposit basis:

- Pre-tax subtotal
- Post-tax total
- Specific service lines only
- Holiday-only deposit

---

# 7. Rounding and Currency Rules

## 7.1 Storage

All monetary amounts are integer minor units.

No floats for money.

Use decimal-safe arithmetic internally.

Recommended implementation:

- Store amounts as integer minor units
- Store percentages as basis points

Examples:

```ts
amount_minor = 7500 // $75.00
percentage_bps = 1500 // 15.00%
```

---

## 7.2 Percentage Calculation

Use basis points.

Formula:

```ts
amount_minor * percentage_bps / 10000
```

Example:

```text
$75.00 × 15%
7500 × 1500 / 10000 = 1125 minor units
= $11.25
```

---

## 7.3 Rounding Mode

Use half-up rounding.

That means:

- 1125.4 -> 1125
- 1125.5 -> 1126
- 1125.6 -> 1126

Do not use banker's rounding.

Reason:

Half-up rounding matches common customer-facing financial expectations better than banker's rounding.

---

## 7.4 Where Rounding Happens

Round each calculated line item to minor units when the line item is created.

Then sum rounded line items.

Do not keep hidden fractional cents until the end.

This makes the persisted itemized breakdown auditable:

```text
Final total = sum of persisted line items
```

No invisible math.

---

## 7.5 Tax Rounding

Tax is calculated per taxable subtotal group and rounded once per tax group.

For MVP, one business-level tax rate means one tax line.

Example:

```text
Taxable subtotal: $153.00
Tax rate: 8.625%

15300 × 862.5 bps is not allowed because bps must be integer.
Use rate in hundredths of bps if needed, or decimal library config.

Recommended:
tax_rate_ppm = 86250 // 8.625%
15300 × 86250 / 1,000,000 = 1319.625
Half-up = 1320
Tax = $13.20
```

For percentage rules, use basis points.

For tax rates, support parts-per-million (`ppm`) to handle rates like 8.625%.

---

# 8. Worked Numeric Examples

## Example 1: Dog Boarding with Holiday Surcharge and Multi-Dog Fee

### Inputs

```text
Currency: USD
Base boarding rate: $75/night
Nights: 3
Dogs: 2
Additional dog fee: $40/night
Holiday surcharge: 20%
Bath add-on: $50 flat
Discount: 10%
Tax: disabled
Deposit: 25% of final total
```

### Calculation

Base:

```text
$75 × 3 nights = $225
```

Additional dog:

```text
$40 × 3 nights = $120
```

Subtotal before surcharges:

```text
$225 + $120 = $345
```

Holiday surcharge:

```text
$345 × 20% = $69
```

Add-on:

```text
Bath = $50
```

Subtotal before discounts:

```text
$345 + $69 + $50 = $464
```

Discount:

```text
$464 × 10% = $46.40
```

Final total:

```text
$464 - $46.40 = $417.60
```

Deposit:

```text
$417.60 × 25% = $104.40
```

### Output Totals

```json
{
  "subtotal_before_discounts_minor": 46400,
  "discount_total_minor": -4640,
  "tax_total_minor": 0,
  "total_minor": 41760,
  "deposit_due_minor": 10440,
  "balance_due_minor": 31320
}
```

---

## Example 2: Dog Daycare Full Day with Package-Style Manual Discount

### Inputs

```text
Currency: USD
Full-day daycare: $45/day
Days: 5
Dogs: 1
Manual discount: $25
Tax: disabled
Deposit: none
```

### Calculation

Base:

```text
$45 × 5 = $225
```

Discount:

```text
$25 fixed discount
```

Final total:

```text
$225 - $25 = $200
```

### Output Totals

```json
{
  "subtotal_before_discounts_minor": 22500,
  "discount_total_minor": -2500,
  "tax_total_minor": 0,
  "total_minor": 20000,
  "deposit_due_minor": 0,
  "balance_due_minor": 20000
}
```

---

## Example 3: Percentage Surcharges Are Additive, Not Compounded

### Inputs

```text
Base subtotal: $100
Holiday surcharge: 20%
Weekend surcharge: 10%
Discount: none
Tax: disabled
```

### Correct Calculation

```text
Combined percentage surcharge = 30%
$100 × 30% = $30
Final total = $130
```

### Incorrect Calculation

```text
$100 × 1.2 × 1.1 = $132
```

The engine must return $130.

---

## Example 4: Discounts After Surcharges and Add-ons

### Inputs

```text
Base: $100
Fixed surcharge: $20
Add-on: $30
Discount: 10%
Tax: disabled
```

### Calculation

```text
Subtotal before discount = $100 + $20 + $30 = $150
Discount = $150 × 10% = $15
Final total = $135
```

Discount is not applied only to base price.

---

## Example 5: Tax After Discount

### Inputs

```text
Subtotal before discount: $200
Discount: $20
Tax rate: 8.625%
```

### Calculation

```text
Taxable subtotal = $180
Tax = $180 × 8.625% = $15.525
Half-up rounded = $15.53
Final total = $195.53
```

### Output

```json
{
  "subtotal_before_discounts_minor": 20000,
  "discount_total_minor": -2000,
  "taxable_subtotal_minor": 18000,
  "tax_total_minor": 1553,
  "total_minor": 19553
}
```

---

## Example 6: Boarding Partial-Unit Overage

### Inputs

```text
Boarding rate: $75/night
Nights: 2
Checkout grace period: 60 minutes
Scheduled checkout: 12:00 PM
Actual pickup: 3:30 PM
Overage rule: if more than 60 minutes late, charge half-day daycare
Half-day daycare fee: $30
Tax: disabled
```

### Calculation

Base:

```text
$75 × 2 = $150
```

Late pickup:

```text
3.5 hours late - 1 hour grace = over threshold
Apply half-day daycare fee = $30
```

Final total:

```text
$150 + $30 = $180
```

### Output

```json
{
  "subtotal_before_discounts_minor": 18000,
  "total_minor": 18000,
  "lines": [
    {
      "code": "boarding_base",
      "amount_minor": 15000
    },
    {
      "code": "late_pickup_half_day",
      "amount_minor": 3000
    }
  ]
}
```

---

# 9. Itemized Breakdown Output Object

The engine must return a persistable object.

Recommended TypeScript shape:

```ts
type PricingBreakdown = {
  pricing_engine_version: string;
  calculation_id: string;
  calculated_at: string;

  business_id: string;
  currency: string;

  booking_context: {
    service_type: string;
    pricing_model: PricingModel;
    start_at?: string;
    end_at?: string;
    timezone?: string;
    quantity: number;
    participant_count?: number;
    pet_count?: number;
    staff_id?: string | null;
  };

  totals: {
    subtotal_base_minor: number;
    surcharge_total_minor: number;
    addon_total_minor: number;
    discount_total_minor: number;
    taxable_subtotal_minor: number;
    tax_total_minor: number;
    fee_total_minor: number;
    total_minor: number;
    deposit_due_minor: number;
    balance_due_minor: number;
  };

  rounding: {
    mode: "half_up";
    rounded_per_line: true;
    currency_minor_unit: number;
  };

  lines: PricingLineItem[];

  applied_rules: AppliedPricingRule[];

  warnings?: PricingWarning[];
};
```

## 9.1 Line Item Object

```ts
type PricingLineItem = {
  line_id: string;
  code: string;
  label: string;

  category:
    | "base"
    | "participant"
    | "surcharge"
    | "holiday"
    | "peak"
    | "addon"
    | "discount"
    | "tax"
    | "fee"
    | "deposit";

  pricing_model?: PricingModel;

  quantity?: number;
  unit_label?: string;

  unit_amount_minor?: number;
  amount_minor: number;

  taxable: boolean;

  source: {
    config_type:
      | "service_rate"
      | "pricing_rule"
      | "addon"
      | "manual_override"
      | "tax_config"
      | "deposit_config";
    config_id?: string;
    config_name?: string;
  };

  calculation: {
    formula: string;
    percentage_bps?: number;
    tax_rate_ppm?: number;
    base_amount_minor?: number;
  };

  sort_order: number;
};
```

## 9.2 Applied Rule Object

```ts
type AppliedPricingRule = {
  rule_id: string;
  rule_type: PricingRuleType;
  rule_name: string;
  action:
    | "fixed_amount"
    | "percentage"
    | "rate_override"
    | "duration_tier"
    | "partial_unit_overage";

  matched: boolean;
  match_reason: string;

  amount_minor?: number;
  percentage_bps?: number;
  tax_rate_ppm?: number;
};
```

## 9.3 Warning Object

```ts
type PricingWarning = {
  code: string;
  message: string;
  severity: "info" | "warning" | "error";
};
```

Potential warnings:

- Missing tax config
- Add-on not available for selected service
- Rule matched but exceeded max cap
- Manual override applied
- Booking dates cross holiday boundary

---

# 10. Persistence Recommendation

When a booking is created, persist the full `PricingBreakdown` object on the booking.

Recommended fields on booking:

```ts
booking.price_total_minor
booking.price_currency
booking.price_breakdown_json
booking.pricing_engine_version
booking.priced_at
```

Optional normalized fields for reporting:

```ts
booking.subtotal_minor
booking.discount_total_minor
booking.tax_total_minor
booking.deposit_due_minor
booking.balance_due_minor
```

Do not recalculate historical bookings unless an authorized user explicitly edits/reprices the booking.

When repricing, preserve prior breakdown history.

Recommended:

```ts
booking_price_snapshots
```

Fields:

- id
- booking_id
- business_id
- price_breakdown_json
- total_minor
- currency
- created_at
- created_by
- reason

---

# 11. MVP vs Later Scope

## 11.1 MVP Required

For dog boarding and daycare:

- Multi-tenant business pricing configs
- Integer minor-unit money
- Server-side authoritative calculation
- Storable itemized breakdown
- `flat`
- `per_unit`
- `per_session`
- `per_night`
- Basic `tiered`
- `partial_unit_overage` for boarding late pickup / checkout rules
- Base rates
- Additional pet fees
- Add-ons
- Fixed surcharges
- Percentage surcharges
- Fixed discounts
- Percentage discounts
- Holiday rules
- Manual discount/override support
- Deposit amount calculation only
- Tax disabled or simple business-level tax config
- Golden tests

## 11.2 Later

- `per_hour`
- `per_head`
- `duration_tiered`
- Advanced `tiered`
- Peak pricing
- Packages
- Memberships
- Prepaid credits
- Staff/provider tiers
- Multi-location rate books
- Travel-radius fees
- Insurance billing
- Online payment capture
- Refund workflows
- Cancellation fee workflows
- Gift cards
- Coupons with redemption limits
- Dynamic pricing

---

# 12. Golden Test Set

Golden tests must lock the math.

Each test should assert:

- Line items
- Applied rules
- Subtotals
- Discounts
- Taxes
- Deposits
- Final total
- Rounding behavior
- Order of operations

## 12.1 MVP Dog Boarding Tests

### Test 1: Simple Boarding

```text
$75/night × 3 nights = $225
Expected total: 22500
```

### Test 2: Boarding with Additional Dog

```text
$75/night × 3 nights = $225
Additional dog $40/night × 3 nights = $120
Expected total: 34500
```

### Test 3: Boarding with Holiday Percentage Surcharge

```text
Base subtotal: $225
Holiday: 20%
Expected surcharge: $45
Expected total: $270
```

### Test 4: Boarding with Fixed and Percentage Surcharges

```text
Base subtotal: $225
Fixed holiday fee: $30
Weekend surcharge: 10% of base subtotal
Expected percentage surcharge: $22.50
Expected total: $277.50
```

### Test 5: Boarding with Add-on and Discount

```text
Base: $225
Bath: $50
Discount: 10% after add-ons
Discount: $27.50
Expected total: $247.50
```

### Test 6: Boarding with Late Pickup Overage

```text
2 nights × $75 = $150
Pickup exceeds grace threshold
Half-day daycare overage = $30
Expected total: $180
```

### Test 7: Boarding with Deposit

```text
Total: $417.60
Deposit: 25%
Expected deposit: $104.40
Expected balance: $313.20
```

### Test 8: Boarding with Tax After Discount

```text
Subtotal before discount: $200
Discount: $20
Taxable subtotal: $180
Tax: 8.625%
Expected tax: $15.53
Expected total: $195.53
```

---

## 12.2 MVP Daycare Tests

### Test 9: Simple Full-Day Daycare

```text
$45/day × 1 = $45
Expected total: 4500
```

### Test 10: Multi-Day Daycare

```text
$45/day × 5 = $225
Expected total: 22500
```

### Test 11: Half-Day Daycare Tier

```text
Half-day rate: $30
Expected total: 3000
```

### Test 12: Daycare Additional Dog

```text
Dog 1: $45
Dog 2: $30
Expected total: $75
```

### Test 13: Daycare Manual Discount

```text
5 days × $45 = $225
Manual discount: $25
Expected total: $200
```

### Test 14: Daycare Add-on

```text
Full day: $45
Enrichment add-on: $15
Expected total: $60
```

---

## 12.3 Later Vertical Tests

These are not required for MVP implementation but should remain in the spec as future acceptance tests.

### Dog Walking Duration Tier

```text
30-minute walk: $30
60-minute walk: $50
90-minute walk: $70

90-minute price must be $70, not $30 × 3 or $50 × 1.5.
```

### Massage Duration Tier

```text
60-minute massage: $120
90-minute massage: $165

Expected 90-minute total: $165
```

### Hair Salon Staff Tier

```text
Base haircut: $70
Senior stylist surcharge: $25
Long hair surcharge: $20
Expected total: $115
```

### Dog Training Package

```text
6-session course package: $495 flat
Additional dog: $100
Expected total: $595
```

---

# 13. Open Product Decisions

These should be resolved before full implementation.

## 13.1 Tax in MVP

Decision needed:

- No tax support in MVP
- Simple business-level tax rate
- Full tax configuration later

Recommendation:

Support simple tax configuration but allow disabled tax.

## 13.2 Discount Basis

This spec defines discounts as applying after surcharges and add-ons.

Decision needed:

Should businesses later be allowed to configure discount basis?

Options:

- Apply to base only
- Apply to base + surcharges
- Apply to full pre-tax subtotal

Recommendation:

MVP should use one fixed rule: discounts apply to full pre-tax subtotal after surcharges and add-ons.

## 13.3 Holiday Rule Granularity

Decision needed:

Holiday surcharges may apply:

- Per booking
- Per night/day touched by holiday
- Only if start date is holiday
- Only if majority of booking overlaps holiday

Recommendation:

MVP boarding should support per-night holiday matching.

Daycare should support per-day holiday matching.

## 13.4 Repricing Existing Bookings

Decision needed:

When staff edits dates, dogs, add-ons, or services, should the system:

- Recalculate using current rates
- Recalculate using original rate snapshot
- Ask staff which to use

Recommendation:

For MVP, editing a booking should calculate using current active rates, but preserve old breakdown in `booking_price_snapshots`.

---

# 14. Implementation Notes for Claude

## 14.1 Build the Engine as a Shared Server Package

Suggested location:

```text
/packages/pricing-engine
```

or, if the project is not monorepo:

```text
/src/lib/pricing
```

The engine should expose one primary function:

```ts
calculateBookingPrice(input: PricingInput): PricingBreakdown
```

## 14.2 Keep the Engine Pure

Do not read from Supabase inside the engine.

Instead:

1. Server action / API route loads business pricing config.
2. Server passes config into engine.
3. Engine returns breakdown.
4. Server persists booking + breakdown.

## 14.3 Do Not Let Client Authoritative Price the Booking

Client can request a quote.

Server returns calculated quote.

Booking creation must re-run the engine server-side before persisting.

## 14.4 Use Golden Tests Before UI Work

Before wiring the pricing engine into booking UI, implement golden tests from this spec.

Pricing math must be locked before product UI depends on it.

---

# 15. Final Recommendation

Build one pricing engine.

Do not build vertical-specific pricing calculators.

For MVP, implement the subset needed for dog boarding and daycare, but use the generalized model from this spec so future service verticals can be added through configuration rather than new pricing code.

The most important implementation principle:

> The price shown on a booking must be the exact sum of the stored itemized line items, calculated server-side, using integer minor units, with explicit half-up rounding.


---

# Appendix A — MVP Revision: Dog Walking Added

> **This appendix supersedes earlier MVP scope references.**

## Updated MVP Verticals

The MVP now includes:

1. Dog Boarding
2. Dog Daycare
3. Dog Walking

All pricing primitives and acceptance tests should treat these three service types as first-class MVP functionality.

## MVP Feature Changes

The following capabilities move from **Later** to **MVP** because they are required to support common dog walking pricing.

### Pricing Models

Move to MVP:

- `per_hour`
- `duration_tiered`

**Rationale**

Dog walking is commonly sold as fixed duration tiers rather than a linear hourly rate.

Examples:

| Duration | Price |
|---|---:|
| 15 minutes | $20 |
| 30 minutes | $30 |
| 45 minutes | $40 |
| 60 minutes | $50 |

The engine must select the configured tier rather than deriving price from elapsed time.

### Dog Walking Add-ons (MVP)

Support configurable add-ons such as:

- Feeding
- Medication administration
- Paw wipe
- Towel dry
- Key pickup / lockbox handling
- Photo/report card

These are standard add-ons and should use the existing Add-on primitive.

### Dog Walking Conditional Rules (MVP)

Support rules including:

- Holiday surcharge
- Weekend surcharge
- Evening / after-hours surcharge
- Additional dog fee
- Solo vs. group walk pricing
- Travel radius surcharge (optional in MVP if service area is already enforced elsewhere)

No new pricing primitives are required.

## Additional Golden Tests

### Walking Test 1 — Fixed Duration Tier

30-minute walk = $30

Expected total: **3000** minor units.

### Walking Test 2 — Non-linear Duration Tier

Configured prices:

- 30 min = $30
- 45 min = $40
- 60 min = $50

Selecting 45 minutes must return **$40**, not a derived hourly calculation.

### Walking Test 3 — Additional Dog

30-minute walk:

- Dog 1 = $30
- Dog 2 = +$15

Expected total: **4500** minor units.

### Walking Test 4 — Holiday Surcharge

30-minute walk:

- Base = $30
- Holiday surcharge = 20%

Expected total: **3600** minor units.

### Walking Test 5 — Travel Surcharge

30-minute walk:

- Base = $30
- Travel surcharge = $10

Expected total: **4000** minor units.

### Walking Test 6 — Add-on

30-minute walk:

- Base = $30
- Medication administration = $8

Expected total: **3800** minor units.

## Future Architecture Note

The existing `duration_tiered` model is sufficient for MVP. During future architecture reviews, consider whether it should be generalized into a broader `tiered` configuration capable of representing duration, service level, package size, or other discrete pricing tiers without changing engine behavior.
