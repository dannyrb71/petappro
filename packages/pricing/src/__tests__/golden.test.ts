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

  // B3 ── Holiday percentage surcharge
  // Base $225 + 20% holiday = $45 surcharge → 27000
  it("B3: boarding with holiday percentage surcharge — additive on base subtotal", () => {
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
      pricing_rules: [
        {
          id: "rule-holiday-20",
          business_id: "biz-1",
          rule_type: "holiday",
          name: "Holiday surcharge",
          category: "surcharge",
          action: "percentage",
          percentage_bps: 2000, // 20%
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
    expect(bd.totals.subtotal_base_minor).toBe(22500);
    expect(bd.totals.surcharge_total_minor).toBe(4500); // 22500 × 20%
    expect(bd.totals.total_minor).toBe(27000);
    const surchargeLine = bd.lines.find((l) => l.category === "holiday");
    expect(surchargeLine!.amount_minor).toBe(4500);
    expect(surchargeLine!.calculation.percentage_bps).toBe(2000);
  });

  // B4 ── Fixed + percentage surcharges (additive, not compounding)
  // Base $225 + fixed $30 + 10% of $225 = $22.50 → 27750
  // Spec §4: % surcharges are additive and apply to pre-surcharge subtotal
  it("B4: fixed and percentage surcharges — % applies to pre-surcharge base, not accumulated", () => {
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
      pricing_rules: [
        {
          id: "rule-holiday-fixed",
          business_id: "biz-1",
          rule_type: "holiday",
          name: "Holiday fixed fee",
          category: "surcharge",
          action: "fixed_amount",
          amount_minor: 3000, // $30
          always_apply: true,
        },
        {
          id: "rule-weekend-pct",
          business_id: "biz-1",
          rule_type: "surcharge",
          name: "Weekend surcharge",
          category: "surcharge",
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
    };
    const bd = calculateBookingPrice(input, config);
    // $22.50 = 22500 × 10% = 2250
    expect(bd.totals.surcharge_total_minor).toBe(5250); // 3000 + 2250
    expect(bd.totals.total_minor).toBe(27750); // 22500 + 3000 + 2250
    const fixedLine = bd.lines.find(
      (l) => l.category === "holiday" && l.calculation.formula.includes("fixed")
    );
    const pctLine = bd.lines.find(
      (l) => l.category === "surcharge"
    );
    expect(fixedLine!.amount_minor).toBe(3000);
    expect(pctLine!.amount_minor).toBe(2250);
    expect(pctLine!.calculation.base_amount_minor).toBe(22500); // applied to pre-surcharge base
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

  // W3 ── Walk with holiday surcharge
  // 30-min $30 + 20% holiday = $6 → 3600
  it("W3: walk with holiday surcharge — percentage applies to walk tier base", () => {
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
          name: "Holiday surcharge",
          category: "surcharge",
          action: "percentage",
          percentage_bps: 2000, // 20%
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
    expect(bd.totals.subtotal_base_minor).toBe(3000);
    expect(bd.totals.surcharge_total_minor).toBe(600); // 3000 × 20%
    expect(bd.totals.total_minor).toBe(3600);
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

  it("all line item amounts are integers — no floats", () => {
    const config: PricingConfig = {
      ...simpleConfig(),
      pricing_rules: [
        {
          id: "r1",
          business_id: "biz-1",
          rule_type: "holiday",
          name: "Holiday",
          category: "surcharge",
          action: "percentage",
          percentage_bps: 1333, // 13.33% — produces fractional cents
          always_apply: true,
        },
      ],
      tax_config: { enabled: true, rate_ppm: 86250, name: "Tax" },
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

  // Additive-not-compounding percentage surcharges (spec §4, example 3)
  // $100 × (20% + 10%) = $130, NOT $100 × 1.2 × 1.1 = $132
  it("percentage surcharges are additive not compounding (spec §4)", () => {
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
          id: "r-holiday",
          business_id: "biz-1",
          rule_type: "holiday",
          name: "Holiday 20%",
          category: "surcharge",
          action: "percentage",
          percentage_bps: 2000,
          always_apply: true,
        },
        {
          id: "r-weekend",
          business_id: "biz-1",
          rule_type: "surcharge",
          name: "Weekend 10%",
          category: "surcharge",
          action: "percentage",
          percentage_bps: 1000,
          always_apply: true,
        },
      ],
    };
    const bd = calculateBookingPrice(
      { business_id: "biz-1", service_type: "service", quantity: 1 },
      config
    );
    expect(bd.totals.total_minor).toBe(13000); // $130, NOT $132
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
