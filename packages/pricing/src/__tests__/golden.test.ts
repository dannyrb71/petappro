/**
 * Golden test suite for the PetAppro pricing engine.
 *
 * Source of truth: docs/specs/booking_and_pricing.md §8
 * Reference: docs/research/petappro_pricing_engine_spec.md §12
 *
 * Test IDs match the spec:
 *   B1–B6, B8     boarding (B7 = deposit — SKIPPED per D-015)
 *   D9–D14        daycare
 *   W1–W3         walking (D-022 — MVP vertical)
 *   LATER-*       skipped future verticals
 *
 * All money in integer minor units (USD cents).
 * No floats. Percentages = bps. Tax = ppm.
 * Order of operations per §4; rounding half-up per line.
 */

import { describe, it, expect } from "vitest";
import { calculateBookingPrice } from "../engine.js";
import type { BookingInput, PricingConfig } from "../types.js";

// ─── Boarding ────────────────────────────────────────────────────────────────

describe("Boarding golden tests", () => {
  // B1 ── Simple boarding
  // $75/night × 3 nights = $225 → 22500
  it("B1: simple boarding — per_night × quantity", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: {
        id: "rate-boarding",
        business_id: "biz-1",
        name: "Boarding",
        pricing_model: "per_night",
        currency: "USD",
        rate_minor: 7500,
      },
    };
    const input: BookingInput = {
      business_id: "biz-1",
      service_type: "boarding",
      quantity: 3,
    };
    const bd = calculateBookingPrice(input, config);
    expect(bd.totals.subtotal_base_minor).toBe(22500);
    expect(bd.totals.surcharge_total_minor).toBe(0);
    expect(bd.totals.addon_total_minor).toBe(0);
    expect(bd.totals.discount_total_minor).toBe(0);
    expect(bd.totals.tax_total_minor).toBe(0);
    expect(bd.totals.total_minor).toBe(22500);
    expect(bd.totals.deposit_due_minor).toBe(0); // D-015
    expect(bd.totals.balance_due_minor).toBe(22500);
    // Line: one base line
    const baseLine = bd.lines.find((l) => l.category === "base");
    expect(baseLine).toBeDefined();
    expect(baseLine!.amount_minor).toBe(22500);
    expect(baseLine!.quantity).toBe(3);
    expect(baseLine!.unit_amount_minor).toBe(7500);
    // No floats in the output
    for (const line of bd.lines) {
      expect(Number.isInteger(line.amount_minor)).toBe(true);
    }
  });

  // B2 ── Boarding + additional dog
  // $75/night × 3 = $225; additional dog $40/night × 3 = $120 → 34500
  it("B2: boarding with additional dog — participant fee per unit", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: {
        id: "rate-boarding",
        business_id: "biz-1",
        name: "Boarding",
        pricing_model: "per_night",
        currency: "USD",
        rate_minor: 7500,
      },
      participant_rules: [
        {
          id: "rule-extra-dog",
          business_id: "biz-1",
          name: "Additional dog",
          applies_from_participant: 2,
          action: "fixed_amount_per_unit",
          amount_minor_per_unit: 4000,
        },
      ],
    };
    const input: BookingInput = {
      business_id: "biz-1",
      service_type: "boarding",
      quantity: 3,
      participant_count: 2,
    };
    const bd = calculateBookingPrice(input, config);
    expect(bd.totals.subtotal_base_minor).toBe(34500); // 22500 + 12000
    expect(bd.totals.total_minor).toBe(34500);
    // Two sub-lines: base (22500) + participant (12000)
    const baseLine = bd.lines.find((l) => l.category === "base");
    const participantLine = bd.lines.find((l) => l.category === "participant");
    expect(baseLine!.amount_minor).toBe(22500);
    expect(participantLine!.amount_minor).toBe(12000); // $40 × 3 nights
  });

  // B3 ── Holiday rate override (D-039)
  // Provider sets Regular=$75/night, Holiday=$90/night as explicit rate tiers.
  // Engine selects $90 because the booking dates overlap the holiday calendar.
  // No percentage involved — the rate IS $90, not $75 × 1.something.
  // $90/night × 3 holiday nights = $270 → 27000
  it("B3: holiday rate override — engine selects explicit holiday rate, not base×% (D-039)", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: {
        id: "rate-boarding",
        business_id: "biz-1",
        name: "Boarding",
        pricing_model: "per_night",
        currency: "USD",
        rate_tiers: [
          {
            condition: "regular",
            rate_minor: 7500, // $75/night — provider's standard rate
            label: "Regular boarding",
          },
          {
            condition: "holiday",
            rate_minor: 9000, // $90/night — provider's explicit holiday rate
            label: "Holiday boarding",
            holiday_dates: ["2025-12-25", "2025-12-26", "2025-12-27"],
          },
        ],
      },
    };
    // Christmas stay: check-in Dec 25, check-out Dec 28 → 3 holiday nights
    const input: BookingInput = {
      business_id: "biz-1",
      service_type: "boarding",
      quantity: 3,
      start_at: "2025-12-25T15:00:00Z",
      end_at: "2025-12-28T12:00:00Z",
    };
    const bd = calculateBookingPrice(input, config);
    expect(bd.totals.subtotal_base_minor).toBe(27000); // $90 × 3 = $270
    expect(bd.totals.surcharge_total_minor).toBe(0); // no surcharge — rate IS $90
    expect(bd.totals.total_minor).toBe(27000);
    // Base line must show $90 unit rate, not $75
    const baseLine = bd.lines.find((l) => l.category === "base");
    expect(baseLine!.unit_amount_minor).toBe(9000); // $90 holiday rate was selected
    expect(baseLine!.quantity).toBe(3);
    expect(baseLine!.amount_minor).toBe(27000);
    // booking_context records which tier was in effect
    expect(bd.booking_context.rate_tier_condition).toBe("holiday");
    // applied_rules shows rate_tier action (not a % surcharge)
    const rateTierRule = bd.applied_rules.find((r) => r.action === "rate_tier");
    expect(rateTierRule).toBeDefined();
    expect(rateTierRule!.rate_tier_condition).toBe("holiday");
    // Crucially: no applied_rules with action "percentage"
    expect(bd.applied_rules.every((r) => r.action !== "percentage")).toBe(true);
  });

  // B4 ── Flat surcharges stack (D-039: all surcharges are flat amounts, never %)
  // Provider has a puppy fee (+$10/night, per_unit) and a one-time travel fee ($25 flat).
  // Base $75/night × 3 = $225; puppy $10/night × 3 = $30; travel $25 flat → 28000
  it("B4: flat surcharges stack arithmetically — per_unit and flat amounts, no % (D-039)", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: {
        id: "rate-boarding",
        business_id: "biz-1",
        name: "Boarding",
        pricing_model: "per_night",
        currency: "USD",
        rate_minor: 7500, // $75/night
      },
      pricing_rules: [
        {
          id: "rule-puppy",
          business_id: "biz-1",
          rule_type: "surcharge",
          name: "Puppy fee",
          category: "surcharge",
          action: "fixed_amount",
          amount_minor: 1000, // $10/night
          per_unit: true, // multiplied by booking quantity (3 nights → $30)
          always_apply: true,
        },
        {
          id: "rule-travel",
          business_id: "biz-1",
          rule_type: "surcharge",
          name: "Travel fee",
          category: "surcharge",
          action: "fixed_amount",
          amount_minor: 2500, // $25 one-time flat
          always_apply: true,
        },
      ],
    };
    const input: BookingInput = {
      business_id: "biz-1",
      service_type: "boarding",
      quantity: 3,
    };
    const bd = calculateBookingPrice(input, config);
    expect(bd.totals.subtotal_base_minor).toBe(22500); // $75 × 3
    expect(bd.totals.surcharge_total_minor).toBe(5500); // 3000 + 2500
    expect(bd.totals.total_minor).toBe(28000); // 22500 + 3000 + 2500
    // Puppy line: per_unit=true → quantity=3, unit_amount=1000, total=3000
    const puppyLine = bd.lines.find((l) => l.code === "surcharge_rule-puppy");
    expect(puppyLine!.amount_minor).toBe(3000);
    expect(puppyLine!.quantity).toBe(3);
    expect(puppyLine!.unit_amount_minor).toBe(1000);
    // Travel line: flat amount
    const travelLine = bd.lines.find((l) => l.code === "surcharge_rule-travel");
    expect(travelLine!.amount_minor).toBe(2500);
    // No percentage lines anywhere
    expect(bd.applied_rules.every((r) => r.action !== "percentage")).toBe(true);
  });

  // B5 ── Add-on + percentage discount
  // Base $225 + bath $50 = $275; 10% discount of $275 = $27.50 → 24750
  it("B5: add-on plus percentage discount — discount applies to full pre-tax subtotal", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: {
        id: "rate-boarding",
        business_id: "biz-1",
        name: "Boarding",
        pricing_model: "per_night",
        currency: "USD",
        rate_minor: 7500,
      },
      addon_configs: [
        {
          id: "addon-bath",
          business_id: "biz-1",
          name: "Bath",
          code: "bath",
          pricing_model: "flat",
          rate_minor: 5000, // $50
          taxable: true,
        },
      ],
      pricing_rules: [
        {
          id: "rule-discount-10",
          business_id: "biz-1",
          rule_type: "discount",
          name: "10% discount",
          category: "discount",
          action: "percentage",
          percentage_bps: 1000, // 10%
          always_apply: true,
        },
      ],
    };
    const input: BookingInput = {
      business_id: "biz-1",
      service_type: "boarding",
      quantity: 3,
      selected_addon_ids: ["addon-bath"],
    };
    const bd = calculateBookingPrice(input, config);
    expect(bd.totals.subtotal_base_minor).toBe(22500);
    expect(bd.totals.addon_total_minor).toBe(5000);
    expect(bd.totals.subtotal_before_discounts_minor).toBe(27500);
    expect(bd.totals.discount_total_minor).toBe(2750); // 27500 × 10% = 2750
    expect(bd.totals.total_minor).toBe(24750);
    const discountLine = bd.lines.find((l) => l.category === "discount");
    expect(discountLine!.amount_minor).toBe(-2750); // stored as negative
    expect(discountLine!.calculation.base_amount_minor).toBe(27500);
  });

  // B6 ── Late pickup overage (partial_unit_overage)
  // 2 nights × $75 = $150; pickup 3.5h late, 1h grace → half-day fee $30 → 18000
  it("B6: boarding late-pickup overage — grace threshold exceeded adds overage line", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: {
        id: "rate-boarding",
        business_id: "biz-1",
        name: "Boarding",
        pricing_model: "per_night",
        currency: "USD",
        rate_minor: 7500,
      },
      overage_config: {
        grace_period_minutes: 60,
        overage_charge_minor: 3000, // $30 half-day daycare
        overage_label: "Late pickup — half-day daycare",
        overage_code: "late_pickup_half_day",
      },
    };
    // Scheduled checkout 12:00 PM, actual pickup 3:30 PM → 210 min late, 60 grace → over
    const input: BookingInput = {
      business_id: "biz-1",
      service_type: "boarding",
      quantity: 2,
      scheduled_end_at: "2025-07-04T12:00:00-07:00",
      actual_end_at: "2025-07-04T15:30:00-07:00",
    };
    const bd = calculateBookingPrice(input, config);
    expect(bd.totals.subtotal_base_minor).toBe(15000); // $75 × 2
    expect(bd.totals.surcharge_total_minor).toBe(3000); // overage treated as surcharge
    expect(bd.totals.total_minor).toBe(18000);
    const overageLine = bd.lines.find((l) => l.category === "overage");
    expect(overageLine).toBeDefined();
    expect(overageLine!.amount_minor).toBe(3000);
    expect(overageLine!.code).toBe("late_pickup_half_day");
  });

  // B7 ── SKIPPED: deposit (D-015 — no deposits in MVP)
  // "Total: $417.60, Deposit: 25%, Expected deposit: $104.40"
  it.skip("B7: boarding deposit — SKIPPED: deposits removed from MVP (D-015)", () => {
    // Revisit only on customer feedback per D-015.
  });

  // B8 ── Tax after discount
  // Base $200, discount $20, taxable $180, tax 8.625% (86250 ppm) = $15.53 → 19553
  it("B8: tax after discount — tax calculated on post-discount taxable subtotal", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: {
        id: "rate-boarding",
        business_id: "biz-1",
        name: "Boarding",
        pricing_model: "per_night",
        currency: "USD",
        rate_minor: 10000, // $100/night × 2 = $200
      },
      pricing_rules: [
        {
          id: "rule-disc-fixed",
          business_id: "biz-1",
          rule_type: "discount",
          name: "Fixed discount",
          category: "discount",
          action: "fixed_amount",
          amount_minor: 2000, // $20
          always_apply: true,
        },
      ],
      tax_config: {
        enabled: true,
        rate_ppm: 86250, // 8.625%
        name: "Sales tax",
      },
    };
    const input: BookingInput = {
      business_id: "biz-1",
      service_type: "boarding",
      quantity: 2, // $100 × 2 = $200
    };
    const bd = calculateBookingPrice(input, config);
    expect(bd.totals.subtotal_base_minor).toBe(20000);
    expect(bd.totals.discount_total_minor).toBe(2000);
    expect(bd.totals.taxable_subtotal_minor).toBe(18000);
    expect(bd.totals.tax_total_minor).toBe(1553); // 18000 × 86250 / 1_000_000 = 1552.5 → 1553
    expect(bd.totals.total_minor).toBe(19553); // 18000 + 1553
    const taxLine = bd.lines.find((l) => l.category === "tax");
    expect(taxLine!.amount_minor).toBe(1553);
    expect(taxLine!.calculation.tax_rate_ppm).toBe(86250);
    expect(taxLine!.calculation.base_amount_minor).toBe(18000);
  });
});

// ─── Daycare ─────────────────────────────────────────────────────────────────

describe("Daycare golden tests", () => {
  const boardingRate = (rate_minor: number): PricingConfig["service_rate"] => ({
    id: "rate-daycare",
    business_id: "biz-1",
    name: "Daycare",
    pricing_model: "per_session",
    currency: "USD",
    rate_minor,
  });

  // D9 ── Simple full-day daycare
  // $45/day × 1 = $45 → 4500
  it("D9: simple full-day daycare — per_session × 1", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: boardingRate(4500),
    };
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "daycare", quantity: 1 },
      config
    );
    expect(bd.totals.total_minor).toBe(4500);
  });

  // D10 ── Multi-day daycare
  // $45/day × 5 = $225 → 22500
  it("D10: multi-day daycare — per_session × 5", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: boardingRate(4500),
    };
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "daycare", quantity: 5 },
      config
    );
    expect(bd.totals.total_minor).toBe(22500);
  });

  // D11 ── Half-day tier
  // Half-day daycare: $30 × 1 → 3000
  // Provider sets up a separate half-day service at $30/session
  it("D11: half-day daycare tier — per_session at $30", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: {
        id: "rate-daycare-half",
        business_id: "biz-1",
        name: "Daycare half-day",
        pricing_model: "per_session",
        currency: "USD",
        rate_minor: 3000,
      },
    };
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "daycare", quantity: 1 },
      config
    );
    expect(bd.totals.total_minor).toBe(3000);
  });

  // D12 ── Daycare additional dog
  // Dog 1: $45, Dog 2: $30 → 7500
  it("D12: daycare with additional dog — participant fee per session", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: boardingRate(4500),
      participant_rules: [
        {
          id: "rule-extra-dog-daycare",
          business_id: "biz-1",
          name: "Additional dog",
          applies_from_participant: 2,
          action: "fixed_amount_per_unit",
          amount_minor_per_unit: 3000, // $30/day
        },
      ],
    };
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "daycare", quantity: 1, participant_count: 2 },
      config
    );
    expect(bd.totals.subtotal_base_minor).toBe(7500); // 4500 + 3000
    expect(bd.totals.total_minor).toBe(7500);
  });

  // D13 ── Manual discount
  // 5 days × $45 = $225; manual discount $25 → 20000
  it("D13: daycare manual discount — authorized override reduces total", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: boardingRate(4500),
    };
    const bd = calculateBookingPrice(
      {
        business_id: "biz-1",
        service_type: "daycare",
        quantity: 5,
        manual_discount_minor: 2500,
        manual_discount_label: "Loyalty discount",
      },
      config
    );
    expect(bd.totals.subtotal_base_minor).toBe(22500);
    expect(bd.totals.discount_total_minor).toBe(2500);
    expect(bd.totals.total_minor).toBe(20000);
    const discountLine = bd.lines.find((l) => l.category === "discount");
    expect(discountLine).toBeDefined();
    expect(discountLine!.amount_minor).toBe(-2500);
    expect(discountLine!.source.config_type).toBe("manual_override");
  });

  // D14 ── Add-on
  // Full day $45 + enrichment $15 → 6000
  it("D14: daycare with add-on — addon line item appears in breakdown", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: boardingRate(4500),
      addon_configs: [
        {
          id: "addon-enrichment",
          business_id: "biz-1",
          name: "Enrichment activity",
          code: "enrichment",
          pricing_model: "flat",
          rate_minor: 1500,
          taxable: true,
        },
      ],
    };
    const bd = calculateBookingPrice(
      {
        business_id: "biz-1",
        service_type: "daycare",
        quantity: 1,
        selected_addon_ids: ["addon-enrichment"],
      },
      config
    );
    expect(bd.totals.subtotal_base_minor).toBe(4500);
    expect(bd.totals.addon_total_minor).toBe(1500);
    expect(bd.totals.total_minor).toBe(6000);
    const addonLine = bd.lines.find((l) => l.category === "addon");
    expect(addonLine!.amount_minor).toBe(1500);
    expect(addonLine!.source.config_id).toBe("addon-enrichment");
  });
});

// ─── Dog Walking (D-022 — MVP vertical) ──────────────────────────────────────

describe("Walking golden tests (D-022 MVP)", () => {
  // W1 ── Duration tier: 90-min walk must be $70, not $30×3 or $50×1.5
  // Spec §8: "90-min booking must total 7000, not $30×3 and not $50×1.5"
  it("W1: duration_tiered walk — 90-min price is the tier rate, not linear", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: {
        id: "rate-walk",
        business_id: "biz-1",
        name: "Dog walk",
        pricing_model: "duration_tiered",
        currency: "USD",
        duration_tiers: [
          { duration_minutes: 30, rate_minor: 3000, label: "30-min walk" },
          { duration_minutes: 60, rate_minor: 5000, label: "60-min walk" },
          { duration_minutes: 90, rate_minor: 7000, label: "90-min walk" },
        ],
      },
    };

    const bd30 = calculateBookingPrice(
      { business_id: "biz-1", service_type: "walking", quantity: 1, duration_minutes: 30 },
      config
    );
    expect(bd30.totals.total_minor).toBe(3000);

    const bd60 = calculateBookingPrice(
      { business_id: "biz-1", service_type: "walking", quantity: 1, duration_minutes: 60 },
      config
    );
    expect(bd60.totals.total_minor).toBe(5000);

    const bd90 = calculateBookingPrice(
      { business_id: "biz-1", service_type: "walking", quantity: 1, duration_minutes: 90 },
      config
    );
    expect(bd90.totals.total_minor).toBe(7000); // NOT 9000 (30×3) or 7500 (50×1.5)
    const baseLine = bd90.lines.find((l) => l.category === "base");
    expect(baseLine!.unit_amount_minor).toBe(7000);
  });

  // W2 ── Group / multi-dog walk
  // 60-min $50 + 2nd dog $20 → 7000
  // Note: capacity cap of 6 dogs is a scheduling concern, not priced here (spec §8)
  it("W2: group walk — per-dog participant fee stacks on duration tier base", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: {
        id: "rate-walk",
        business_id: "biz-1",
        name: "Dog walk",
        pricing_model: "duration_tiered",
        currency: "USD",
        duration_tiers: [
          { duration_minutes: 30, rate_minor: 3000, label: "30-min walk" },
          { duration_minutes: 60, rate_minor: 5000, label: "60-min walk" },
          { duration_minutes: 90, rate_minor: 7000, label: "90-min walk" },
        ],
      },
      participant_rules: [
        {
          id: "rule-extra-dog-walk",
          business_id: "biz-1",
          name: "Additional dog",
          applies_from_participant: 2,
          action: "fixed_amount_per_unit",
          amount_minor_per_unit: 2000, // $20/session
        },
      ],
    };
    const bd = calculateBookingPrice(
      {
        business_id: "biz-1",
        service_type: "walking",
        quantity: 1,
        duration_minutes: 60,
        participant_count: 2,
      },
      config
    );
    expect(bd.totals.subtotal_base_minor).toBe(7000); // 5000 + 2000
    expect(bd.totals.total_minor).toBe(7000);
    const baseLine = bd.lines.find((l) => l.category === "base");
    const participantLine = bd.lines.find((l) => l.category === "participant");
    expect(baseLine!.amount_minor).toBe(5000); // 60-min tier
    expect(participantLine!.amount_minor).toBe(2000); // 2nd dog
  });

  // W3 ── Walk with holiday flat surcharge (D-039)
  // Provider sets a flat $6 holiday walk fee (not 20% — D-039 removes % surcharges).
  // 30-min walk $30 + holiday flat $6 → 3600
  it("W3: walk on holiday — flat dollar holiday surcharge, not % (D-039)", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: {
        id: "rate-walk",
        business_id: "biz-1",
        name: "Dog walk",
        pricing_model: "duration_tiered",
        currency: "USD",
        duration_tiers: [
          { duration_minutes: 30, rate_minor: 3000, label: "30-min walk" },
          { duration_minutes: 60, rate_minor: 5000, label: "60-min walk" },
          { duration_minutes: 90, rate_minor: 7000, label: "90-min walk" },
        ],
      },
      pricing_rules: [
        {
          id: "rule-holiday-walk",
          business_id: "biz-1",
          rule_type: "holiday",
          name: "Holiday walk fee",
          category: "surcharge",
          action: "fixed_amount", // D-039: flat dollar, not %
          amount_minor: 600, // $6 flat — provider-set explicit amount
          always_apply: true,
        },
      ],
    };
    const bd = calculateBookingPrice(
      {
        business_id: "biz-1",
        service_type: "walking",
        quantity: 1,
        duration_minutes: 30,
      },
      config
    );
    expect(bd.totals.subtotal_base_minor).toBe(3000); // $30 walk
    expect(bd.totals.surcharge_total_minor).toBe(600); // $6 flat holiday fee
    expect(bd.totals.total_minor).toBe(3600);
    const holidayLine = bd.lines.find((l) => l.category === "holiday");
    expect(holidayLine!.amount_minor).toBe(600);
    // No percentage calculation
    expect(holidayLine!.calculation.percentage_bps).toBeUndefined();
    expect(bd.applied_rules.every((r) => r.action !== "percentage")).toBe(true);
  });
});

// ─── Structural invariants ───────────────────────────────────────────────────

describe("Engine structural invariants", () => {
  const simpleConfig = (): PricingConfig => ({
    business_id: "biz-1",
    currency: "USD",
    service_rate: {
      id: "rate-1",
      business_id: "biz-1",
      name: "Boarding",
      pricing_model: "per_night",
      currency: "USD",
      rate_minor: 7500,
    },
  });

  it("total_minor equals sum of persisted line item amounts (no hidden math)", () => {
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "boarding", quantity: 3 },
      simpleConfig()
    );
    const sumOfLines = bd.lines.reduce((acc, l) => acc + l.amount_minor, 0);
    expect(sumOfLines).toBe(bd.totals.total_minor);
  });

  it("deposit_due_minor is always 0 (D-015)", () => {
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "boarding", quantity: 3 },
      simpleConfig()
    );
    expect(bd.totals.deposit_due_minor).toBe(0);
  });

  it("balance_due_minor equals total_minor (D-015: no deposit split)", () => {
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "boarding", quantity: 3 },
      simpleConfig()
    );
    expect(bd.totals.balance_due_minor).toBe(bd.totals.total_minor);
  });

  it("all line item amounts are integers — no floats (fractional bps/ppm rounded half-up)", () => {
    // Use a 13.33% discount code + 8.625% tax to force fractional intermediate values.
    // halfUp must produce integers at every line even when bps/ppm don't divide evenly.
    const config: PricingConfig = {
      ...simpleConfig(),
      pricing_rules: [
        {
          id: "r1",
          business_id: "biz-1",
          rule_type: "discount",
          name: "Odd % discount",
          category: "discount",
          action: "percentage",
          percentage_bps: 1333, // 13.33% — 7500 × 1333 / 10000 = 999.75 → halfUp = 1000
          always_apply: true,
        },
      ],
      tax_config: { enabled: true, rate_ppm: 86250, name: "Tax" }, // 6500 × 86250 / 1e6 = 560.625 → 561
    };
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "boarding", quantity: 1 },
      config
    );
    for (const line of bd.lines) {
      expect(Number.isInteger(line.amount_minor)).toBe(true);
    }
    expect(Number.isInteger(bd.totals.total_minor)).toBe(true);
  });

  it("business_id is carried through from input — tenant isolation", () => {
    const bd = calculateBookingPrice(
      { business_id: "tenant-abc", service_type: "boarding", quantity: 1 },
      { ...simpleConfig(), business_id: "tenant-abc" }
    );
    expect(bd.business_id).toBe("tenant-abc");
  });

  it("pricing_engine_version is present in output", () => {
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "boarding", quantity: 1 },
      simpleConfig()
    );
    expect(typeof bd.pricing_engine_version).toBe("string");
    expect(bd.pricing_engine_version.length).toBeGreaterThan(0);
  });

  it("same input + same config always produces same totals (pure function)", () => {
    const input: BookingInput = {
      business_id: "biz-1",
      service_type: "boarding",
      quantity: 3,
    };
    const config = simpleConfig();
    const bd1 = calculateBookingPrice(input, config);
    const bd2 = calculateBookingPrice(input, config);
    expect(bd1.totals).toEqual(bd2.totals);
    expect(bd1.lines.map((l) => l.amount_minor)).toEqual(
      bd2.lines.map((l) => l.amount_minor)
    );
  });

  // Additive-not-compounding percentage discounts (D-039: % only for discount codes)
  // $100 base; 20% + 10% discount codes → $30 off ($70), NOT $100 × 0.8 × 0.9 = $72
  // The engine applies each % to the same pctDiscountBase, not to the running balance.
  it("percentage discount codes are additive not compounding — 20%+10%=$30 off, not $28 off (D-039)", () => {
    const config: PricingConfig = {
      business_id: "biz-1",
      currency: "USD",
      service_rate: {
        id: "rate-1",
        business_id: "biz-1",
        name: "Service",
        pricing_model: "flat",
        currency: "USD",
        rate_minor: 10000, // $100 flat
      },
      pricing_rules: [
        {
          id: "r-code-20",
          business_id: "biz-1",
          rule_type: "discount",
          name: "20% loyalty code",
          category: "discount",
          action: "percentage",
          percentage_bps: 2000, // 20% of $100 = $20
          always_apply: true,
        },
        {
          id: "r-code-10",
          business_id: "biz-1",
          rule_type: "discount",
          name: "10% referral code",
          category: "discount",
          action: "percentage",
          percentage_bps: 1000, // 10% of $100 = $10 (additive, NOT 10% of $80)
          always_apply: true,
        },
      ],
    };
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "service", quantity: 1 },
      config
    );
    // Additive: $20 + $10 = $30 off → total $70
    // Compounding (wrong): $100 × 0.8 × 0.9 = $72 → total $72
    expect(bd.totals.discount_total_minor).toBe(3000); // $30 off, not $28
    expect(bd.totals.total_minor).toBe(7000); // $70, NOT $72
  });
});

// ─── Per-session rate resolution (Codex hardening — D-039 / per_session bug) ─
// Same per-date resolution that fixed per_night now applies to per_session / per_unit.
// Bug (v0.2): a 5-day daycare with 1 holiday day billed all 5 days at the holiday rate.
// Fix (v0.3): only the calendar-matched dates get the holiday rate; others get regular.

describe("Per-session (daycare) per-date rate resolution (D-039)", () => {
  const daycareConfig = (): PricingConfig => ({
    business_id: "biz-1",
    currency: "USD",
    service_rate: {
      id: "rate-daycare",
      business_id: "biz-1",
      name: "Daycare",
      pricing_model: "per_session",
      currency: "USD",
      rate_tiers: [
        { condition: "regular", rate_minor: 4500, label: "Regular daycare" },
        {
          condition: "holiday",
          rate_minor: 6000,
          label: "Holiday daycare",
          holiday_dates: ["2025-12-25"],
        },
      ],
    },
  });

  // Key regression test: 5-day package, only Dec 25 is a holiday.
  // Expected: 4 × $45 + 1 × $60 = $240 → 24000
  // Bug behaviour: 5 × $60 = $300 → 30000
  it("5-day daycare, 1 holiday day — only that day bills at holiday rate (regression)", () => {
    const bd = calculateBookingPrice(
      {
        business_id: "biz-1",
        service_type: "daycare",
        quantity: 5,
        start_at: "2025-12-23T07:00:00Z",
        end_at: "2025-12-28T18:00:00Z",
      },
      daycareConfig()
    );
    // 4 regular days × $45 = $180; 1 holiday day × $60 = $60; total = $240
    expect(bd.totals.subtotal_base_minor).toBe(24000);
    expect(bd.totals.surcharge_total_minor).toBe(0);
    expect(bd.totals.total_minor).toBe(24000);
    // Two base lines — one per condition group
    const baseLines = bd.lines.filter((l) => l.category === "base");
    expect(baseLines).toHaveLength(2);
    const regularLine = baseLines.find((l) => l.unit_amount_minor === 4500);
    const holidayLine = baseLines.find((l) => l.unit_amount_minor === 6000);
    expect(regularLine).toBeDefined();
    expect(holidayLine).toBeDefined();
    expect(regularLine!.quantity).toBe(4); // 4 regular days
    expect(regularLine!.amount_minor).toBe(18000);
    expect(holidayLine!.quantity).toBe(1); // 1 holiday day
    expect(holidayLine!.amount_minor).toBe(6000);
    // Mixed stay → no single rate_tier_condition on booking context
    expect(bd.booking_context.rate_tier_condition).toBeUndefined();
  });

  it("all-holiday daycare stay — one base line at holiday rate", () => {
    const bd = calculateBookingPrice(
      {
        business_id: "biz-1",
        service_type: "daycare",
        quantity: 1,
        start_at: "2025-12-25T07:00:00Z",
        end_at: "2025-12-26T18:00:00Z",
      },
      daycareConfig()
    );
    expect(bd.totals.subtotal_base_minor).toBe(6000); // 1 × $60
    expect(bd.totals.total_minor).toBe(6000);
    const baseLines = bd.lines.filter((l) => l.category === "base");
    expect(baseLines).toHaveLength(1);
    expect(baseLines[0]!.unit_amount_minor).toBe(6000);
    expect(bd.booking_context.rate_tier_condition).toBe("holiday");
  });

  it("no-holiday daycare stay — all days at regular rate", () => {
    const bd = calculateBookingPrice(
      {
        business_id: "biz-1",
        service_type: "daycare",
        quantity: 3,
        start_at: "2025-12-22T07:00:00Z",
        end_at: "2025-12-25T18:00:00Z",
      },
      daycareConfig()
    );
    expect(bd.totals.subtotal_base_minor).toBe(13500); // 3 × $45
    expect(bd.totals.total_minor).toBe(13500);
    const baseLines = bd.lines.filter((l) => l.category === "base");
    expect(baseLines).toHaveLength(1);
    expect(baseLines[0]!.unit_amount_minor).toBe(4500);
    expect(bd.booking_context.rate_tier_condition).toBe("regular");
  });

  it("line-item sum invariant holds for mixed per_session stays", () => {
    const bd = calculateBookingPrice(
      {
        business_id: "biz-1",
        service_type: "daycare",
        quantity: 5,
        start_at: "2025-12-23T07:00:00Z",
        end_at: "2025-12-28T18:00:00Z",
      },
      daycareConfig()
    );
    const sumOfLines = bd.lines.reduce((acc, l) => acc + l.amount_minor, 0);
    expect(sumOfLines).toBe(bd.totals.total_minor);
  });
});

// ─── Per-night rate resolution (Codex hardening — D-039 clarified) ──────────
// Each calendar night resolves its OWN applicable tier independently.
// Holiday dates → holiday rate; non-holiday → regular (or extended if whole stay qualifies).
// The BLOCKER in v0.2.0 applied the holiday rate to every night if ANY night was a holiday.

describe("Per-night rate resolution (D-039 clarified)", () => {
  const boardingConfig = (extra?: Partial<PricingConfig>): PricingConfig => ({
    business_id: "biz-1",
    currency: "USD",
    service_rate: {
      id: "rate-boarding",
      business_id: "biz-1",
      name: "Boarding",
      pricing_model: "per_night",
      currency: "USD",
      rate_tiers: [
        { condition: "regular", rate_minor: 7500, label: "Regular boarding" },
        {
          condition: "holiday",
          rate_minor: 9000,
          label: "Holiday boarding",
          holiday_dates: ["2025-12-25", "2025-12-26"],
        },
      ],
    },
    ...extra,
  });

  // (a) Mixed stay: 5 nights, 2 holiday + 3 regular → blended total
  // Dates: Dec 24 (reg $75), Dec 25 (holiday $90), Dec 26 (holiday $90), Dec 27 (reg $75), Dec 28 (reg $75)
  // 3 × 7500 = 22500; 2 × 9000 = 18000; total = 40500
  it("(a) mixed stay — holiday nights get holiday rate, regular nights get regular rate", () => {
    const bd = calculateBookingPrice(
      {
        business_id: "biz-1",
        service_type: "boarding",
        quantity: 5,
        start_at: "2025-12-24T15:00:00Z",
        end_at: "2025-12-29T12:00:00Z",
      },
      boardingConfig()
    );
    // Blended total: 3 × $75 + 2 × $90
    expect(bd.totals.subtotal_base_minor).toBe(40500); // 22500 + 18000
    expect(bd.totals.surcharge_total_minor).toBe(0); // rates, not surcharges
    expect(bd.totals.total_minor).toBe(40500);
    // Two base lines (one per condition group)
    const baseLines = bd.lines.filter((l) => l.category === "base");
    expect(baseLines).toHaveLength(2);
    const regularLine = baseLines.find((l) => l.unit_amount_minor === 7500);
    const holidayLine = baseLines.find((l) => l.unit_amount_minor === 9000);
    expect(regularLine).toBeDefined();
    expect(holidayLine).toBeDefined();
    expect(regularLine!.quantity).toBe(3);
    expect(regularLine!.amount_minor).toBe(22500);
    expect(holidayLine!.quantity).toBe(2);
    expect(holidayLine!.amount_minor).toBe(18000);
    // booking_context.rate_tier_condition is undefined for mixed stays
    expect(bd.booking_context.rate_tier_condition).toBeUndefined();
  });

  // (b) All-holiday stay: 3 nights all on holiday calendar
  // Same as B3 — should produce ONE base line with holiday rate for all nights
  it("(b) all-holiday stay — single holiday group, one base line", () => {
    const bd = calculateBookingPrice(
      {
        business_id: "biz-1",
        service_type: "boarding",
        quantity: 2,
        start_at: "2025-12-25T15:00:00Z",
        end_at: "2025-12-27T12:00:00Z",
      },
      boardingConfig()
    );
    expect(bd.totals.subtotal_base_minor).toBe(18000); // 2 × $90
    expect(bd.totals.total_minor).toBe(18000);
    const baseLines = bd.lines.filter((l) => l.category === "base");
    expect(baseLines).toHaveLength(1); // single group — all holiday
    expect(baseLines[0]!.unit_amount_minor).toBe(9000);
    expect(baseLines[0]!.quantity).toBe(2);
    expect(bd.booking_context.rate_tier_condition).toBe("holiday");
  });

  // (c) No-holiday stay: dates don't overlap the holiday calendar → regular rate throughout
  it("(c) no-holiday stay — all nights at regular rate when no dates overlap holiday calendar", () => {
    const bd = calculateBookingPrice(
      {
        business_id: "biz-1",
        service_type: "boarding",
        quantity: 3,
        start_at: "2025-12-20T15:00:00Z",
        end_at: "2025-12-23T12:00:00Z",
      },
      boardingConfig()
    );
    expect(bd.totals.subtotal_base_minor).toBe(22500); // 3 × $75
    expect(bd.totals.total_minor).toBe(22500);
    const baseLines = bd.lines.filter((l) => l.category === "base");
    expect(baseLines).toHaveLength(1); // single group — all regular
    expect(baseLines[0]!.unit_amount_minor).toBe(7500);
    expect(baseLines[0]!.quantity).toBe(3);
    expect(bd.booking_context.rate_tier_condition).toBe("regular");
  });

  // sum of per-night lines must still equal total_minor
  it("line-item sum invariant holds for mixed-rate stays", () => {
    const bd = calculateBookingPrice(
      {
        business_id: "biz-1",
        service_type: "boarding",
        quantity: 5,
        start_at: "2025-12-24T15:00:00Z",
        end_at: "2025-12-29T12:00:00Z",
      },
      boardingConfig()
    );
    const sumOfLines = bd.lines.reduce((acc, l) => acc + l.amount_minor, 0);
    expect(sumOfLines).toBe(bd.totals.total_minor);
  });
});

// ─── Immutability (Codex hardening) ──────────────────────────────────────────

describe("PricingBreakdown is deeply frozen (Codex hardening)", () => {
  const simpleConfig = (): PricingConfig => ({
    business_id: "biz-1",
    currency: "USD",
    service_rate: {
      id: "rate-1",
      business_id: "biz-1",
      name: "Boarding",
      pricing_model: "per_night",
      currency: "USD",
      rate_minor: 7500,
    },
  });

  it("returned PricingBreakdown is frozen — mutation throws in strict mode", () => {
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "boarding", quantity: 3 },
      simpleConfig()
    );
    expect(Object.isFrozen(bd)).toBe(true);
    expect(Object.isFrozen(bd.totals)).toBe(true);
    expect(Object.isFrozen(bd.lines)).toBe(true);
    expect(Object.isFrozen(bd.applied_rules)).toBe(true);
  });

  it("mutating a frozen breakdown throws TypeError", () => {
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "boarding", quantity: 3 },
      simpleConfig()
    );
    expect(() => {
      "use strict";
      (bd.totals as Record<string, unknown>)["total_minor"] = 0;
    }).toThrow(TypeError);
  });
});

// ─── Runtime validation (Codex hardening) ────────────────────────────────────

describe("Runtime numeric validation (Codex hardening)", () => {
  const simpleConfig = (): PricingConfig => ({
    business_id: "biz-1",
    currency: "USD",
    service_rate: {
      id: "rate-1",
      business_id: "biz-1",
      name: "Boarding",
      pricing_model: "per_night",
      currency: "USD",
      rate_minor: 7500,
    },
  });

  it("rejects quantity=0 with a descriptive error", () => {
    expect(() =>
      calculateBookingPrice({ business_id: "biz-1", service_type: "boarding", quantity: 0 }, simpleConfig())
    ).toThrow("[pricing]");
  });

  it("rejects quantity=1.5 (non-integer) with a descriptive error", () => {
    expect(() =>
      calculateBookingPrice({ business_id: "biz-1", service_type: "boarding", quantity: 1.5 }, simpleConfig())
    ).toThrow("[pricing]");
  });

  it("rejects negative rate_minor on service_rate", () => {
    const config = simpleConfig();
    config.service_rate.rate_minor = -100;
    expect(() =>
      calculateBookingPrice({ business_id: "biz-1", service_type: "boarding", quantity: 1 }, config)
    ).toThrow("[pricing]");
  });

  it("rejects NaN on rate_minor", () => {
    const config = simpleConfig();
    config.service_rate.rate_minor = NaN;
    expect(() =>
      calculateBookingPrice({ business_id: "biz-1", service_type: "boarding", quantity: 1 }, config)
    ).toThrow("[pricing]");
  });

  it("rejects fractional amount_minor on surcharge rule", () => {
    const config: PricingConfig = {
      ...simpleConfig(),
      pricing_rules: [
        {
          id: "r1",
          business_id: "biz-1",
          rule_type: "surcharge",
          name: "Fractional surcharge",
          category: "surcharge",
          action: "fixed_amount",
          amount_minor: 10.5, // invalid — must be integer
          always_apply: true,
        },
      ],
    };
    expect(() =>
      calculateBookingPrice({ business_id: "biz-1", service_type: "boarding", quantity: 1 }, config)
    ).toThrow("[pricing]");
  });
});

// ─── Later vertical tests (skipped — not MVP) ────────────────────────────────

describe("Later vertical tests (skipped — not MVP scope)", () => {
  it.skip("LATER: massage duration tier — 90-min $165, not 1.5 × 60-min", () => {});
  it.skip("LATER: hair salon staff tier — base + senior surcharge + long hair", () => {});
  it.skip("LATER: dog training package — 6-session flat $495 + additional dog $100", () => {});
  it.skip("LATER: peak pricing rules", () => {});
  it.skip("LATER: packages / memberships / prepaid credits", () => {});
  it.skip("LATER: deposits (D-015 — revisit on customer feedback only)", () => {});
  it.skip("LATER: per_hour model (grooming, massage, training)", () => {});
});
