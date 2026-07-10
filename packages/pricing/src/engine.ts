/**
 * PetAppro pricing engine — v0.1.0
 *
 * Pure function: calculateBookingPrice(input, config) → PricingBreakdown.
 * No DB reads, no side effects, no payment capture.
 *
 * Canonical order of operations (spec §4):
 *   1  Resolve currency + rounding config
 *   2  Resolve base service price
 *   3  Base quantity
 *   4  Participant pricing (per-dog)
 *   5  Rate overrides  (reserved; not yet implemented)
 *   6  Fixed surcharges
 *   7  Percentage surcharges — ADDITIVE, applied to pre-surcharge subtotal
 *   8  Add-ons
 *   9  Discounts — fixed first, then percentage
 *  10  Taxable subtotal
 *  11  Tax (when configured)
 *  12  Deposit — always 0 (D-015)
 *  13  Final total
 *  14  Return PricingBreakdown
 *
 * Rounding: half-up per line item; total = sum of rounded lines.
 * Money: integer minor units only. Percentages: bps. Tax: ppm.
 */

import { halfUp, bpsAmount, ppmAmount } from "./math.js";
import type {
  BookingInput,
  PricingConfig,
  PricingBreakdown,
  PricingLineItem,
  AppliedPricingRule,
  PricingWarning,
  PricingModel,
} from "./types.js";

export const PRICING_ENGINE_VERSION = "0.1.0";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function newId(): string {
  // Prefer crypto.randomUUID() where available (Node 19+, all modern runtimes)
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

let _sortOrder = 0;
function nextOrder(): number {
  return ++_sortOrder;
}

function makeBaseLine(
  amount_minor: number,
  quantity: number,
  unit_amount_minor: number,
  pricing_model: PricingModel,
  serviceRate: PricingConfig["service_rate"],
  extra?: Partial<PricingLineItem>
): PricingLineItem {
  return {
    line_id: newId(),
    code: "base_service",
    label: serviceRate.name,
    category: "base",
    pricing_model,
    quantity,
    unit_label: unitLabel(pricing_model),
    unit_amount_minor,
    amount_minor,
    taxable: true,
    source: {
      config_type: "service_rate",
      config_id: serviceRate.id,
      config_name: serviceRate.name,
    },
    calculation: {
      formula: `${unit_amount_minor} × ${quantity}`,
    },
    sort_order: nextOrder(),
    ...extra,
  };
}

function unitLabel(model: PricingModel): string {
  switch (model) {
    case "per_night": return "night";
    case "per_session": return "session";
    case "per_unit": return "unit";
    case "flat": return "booking";
    case "duration_tiered": return "session";
    case "per_hour": return "hour";
    case "per_head": return "head";
    case "tiered": return "unit";
    case "partial_unit_overage": return "unit";
  }
}

// ISO datetime string → Date (handles timezone offsets)
function parseDate(iso: string): Date {
  return new Date(iso);
}

function minutesBetween(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / 60_000;
}

// ─── Main engine ─────────────────────────────────────────────────────────────

export function calculateBookingPrice(
  input: BookingInput,
  config: PricingConfig
): PricingBreakdown {
  // Reset sort order for this calculation (engine is called sequentially server-side)
  _sortOrder = 0;

  const lines: PricingLineItem[] = [];
  const appliedRules: AppliedPricingRule[] = [];
  const warnings: PricingWarning[] = [];

  const currency = config.currency;
  const participantCount = input.participant_count ?? 1;

  // ── Step 2+3: Base service price ────────────────────────────────────────────

  let basePriceMinor: number;
  let pricingModel: PricingModel = config.service_rate.pricing_model;

  if (pricingModel === "duration_tiered") {
    // Look up the matching duration tier (exact match required)
    const tiers = config.service_rate.duration_tiers ?? [];
    if (input.duration_minutes === undefined) {
      warnings.push({
        code: "missing_duration",
        message: "duration_minutes required for duration_tiered pricing",
        severity: "error",
      });
      basePriceMinor = 0;
    } else {
      const tier = tiers.find((t) => t.duration_minutes === input.duration_minutes);
      if (!tier) {
        warnings.push({
          code: "unknown_duration_tier",
          message: `No tier for ${input.duration_minutes} min`,
          severity: "error",
        });
        basePriceMinor = 0;
      } else {
        basePriceMinor = tier.rate_minor;
        lines.push(
          makeBaseLine(tier.rate_minor, input.quantity, tier.rate_minor, pricingModel, config.service_rate, {
            label: `${config.service_rate.name} — ${tier.label}`,
            calculation: { formula: `duration_tier[${input.duration_minutes}min]` },
          })
        );
        appliedRules.push({
          rule_id: `duration_tier_${input.duration_minutes}`,
          rule_type: "base",
          rule_name: tier.label,
          action: "duration_tier",
          matched: true,
          match_reason: `duration_minutes=${input.duration_minutes}`,
          amount_minor: tier.rate_minor,
        });
      }
    }
  } else if (pricingModel === "tiered") {
    const tiers = config.service_rate.volume_tiers ?? [];
    const qty = input.quantity;
    const matchingTier = tiers.find(
      (t) => qty >= t.min_quantity && (t.max_quantity === null || qty <= t.max_quantity)
    );
    if (!matchingTier) {
      warnings.push({
        code: "no_volume_tier_match",
        message: `No volume tier for quantity ${qty}`,
        severity: "error",
      });
      basePriceMinor = 0;
    } else {
      basePriceMinor = matchingTier.rate_minor * qty;
      lines.push(makeBaseLine(basePriceMinor, qty, matchingTier.rate_minor, pricingModel, config.service_rate));
    }
  } else {
    // flat / per_unit / per_session / per_night
    const rateMinor = config.service_rate.rate_minor ?? 0;
    const qty = pricingModel === "flat" ? 1 : input.quantity;
    basePriceMinor = rateMinor * qty;
    lines.push(makeBaseLine(basePriceMinor, qty, rateMinor, pricingModel, config.service_rate));
  }

  // ── Step 4: Participant pricing ──────────────────────────────────────────────

  let participantTotalMinor = 0;
  for (const rule of config.participant_rules ?? []) {
    const extraParticipants = Math.max(0, participantCount - (rule.applies_from_participant - 1));
    if (extraParticipants === 0) continue;
    // action: "fixed_amount_per_unit" → fee × extra participants × quantity
    const qty = pricingModel === "duration_tiered" ? input.quantity : input.quantity;
    const amount = rule.amount_minor_per_unit * extraParticipants * qty;
    participantTotalMinor += amount;
    lines.push({
      line_id: newId(),
      code: `participant_${rule.id}`,
      label: rule.name,
      category: "participant",
      quantity: extraParticipants * qty,
      unit_amount_minor: rule.amount_minor_per_unit,
      amount_minor: amount,
      taxable: true,
      source: {
        config_type: "participant_rule",
        config_id: rule.id,
        config_name: rule.name,
      },
      calculation: {
        formula: `${rule.amount_minor_per_unit} × ${extraParticipants} extra × ${qty} units`,
      },
      sort_order: nextOrder(),
    });
    appliedRules.push({
      rule_id: rule.id,
      rule_type: "surcharge",
      rule_name: rule.name,
      action: "fixed_amount",
      matched: true,
      match_reason: `participant_count=${participantCount} >= ${rule.applies_from_participant}`,
      amount_minor: amount,
    });
  }

  // pre-surcharge subtotal = base + participant (this is the base for % surcharges)
  const preSurchargeSubtotal = basePriceMinor + participantTotalMinor;
  const subtotalBaseMinor = preSurchargeSubtotal;

  // ── Step 5: Rate overrides (reserved) ───────────────────────────────────────
  // Not yet implemented; always_apply rate overrides would go here.

  // ── Step 6: Fixed surcharges; Step 7: Percentage surcharges ────────────────

  let fixedSurchargeTotal = 0;
  let pctSurchargeTotal = 0;

  // Separate fixed and percentage surcharges; collect eligible rules
  const surchargeRules = (config.pricing_rules ?? []).filter(
    (r) => r.category === "surcharge" && isRuleMatched(r, input)
  );

  // Step 6: fixed surcharges
  for (const rule of surchargeRules.filter((r) => r.action === "fixed_amount")) {
    const amount = rule.amount_minor ?? 0;
    fixedSurchargeTotal += amount;
    const category = rule.rule_type === "holiday" ? "holiday" : "surcharge";
    lines.push({
      line_id: newId(),
      code: `surcharge_${rule.id}`,
      label: rule.name,
      category,
      amount_minor: amount,
      taxable: true,
      source: { config_type: "pricing_rule", config_id: rule.id, config_name: rule.name },
      calculation: { formula: `fixed ${amount}` },
      sort_order: nextOrder(),
    });
    appliedRules.push({
      rule_id: rule.id,
      rule_type: rule.rule_type,
      rule_name: rule.name,
      action: "fixed_amount",
      matched: true,
      match_reason: rule.always_apply ? "always_apply" : "date_match",
      amount_minor: amount,
    });
  }

  // Step 7: percentage surcharges — each applies to preSurchargeSubtotal (additive)
  for (const rule of surchargeRules.filter((r) => r.action === "percentage")) {
    const bps = rule.percentage_bps ?? 0;
    const amount = bpsAmount(preSurchargeSubtotal, bps); // halfUp inside
    pctSurchargeTotal += amount;
    const category = rule.rule_type === "holiday" ? "holiday" : "surcharge";
    lines.push({
      line_id: newId(),
      code: `surcharge_pct_${rule.id}`,
      label: rule.name,
      category,
      amount_minor: amount,
      taxable: true,
      source: { config_type: "pricing_rule", config_id: rule.id, config_name: rule.name },
      calculation: {
        formula: `${preSurchargeSubtotal} × ${bps}bps / 10000`,
        percentage_bps: bps,
        base_amount_minor: preSurchargeSubtotal,
      },
      sort_order: nextOrder(),
    });
    appliedRules.push({
      rule_id: rule.id,
      rule_type: rule.rule_type,
      rule_name: rule.name,
      action: "percentage",
      matched: true,
      match_reason: rule.always_apply ? "always_apply" : "date_match",
      percentage_bps: bps,
      amount_minor: amount,
    });
  }

  // ── Overage surcharge (partial_unit_overage) ────────────────────────────────
  // Treated as a special surcharge in the fixed-surcharge slot (§4 step 6)

  let overageTotal = 0;
  if (config.overage_config && input.scheduled_end_at && input.actual_end_at) {
    const scheduledEnd = parseDate(input.scheduled_end_at);
    const actualEnd = parseDate(input.actual_end_at);
    const lateMinutes = minutesBetween(scheduledEnd, actualEnd);
    const grace = config.overage_config.grace_period_minutes;
    if (lateMinutes > grace) {
      const charge = config.overage_config.overage_charge_minor;
      overageTotal = charge;
      lines.push({
        line_id: newId(),
        code: config.overage_config.overage_code,
        label: config.overage_config.overage_label,
        category: "overage",
        pricing_model: "partial_unit_overage",
        amount_minor: charge,
        taxable: true,
        source: { config_type: "overage_config" },
        calculation: {
          formula: `${lateMinutes.toFixed(0)}min late - ${grace}min grace > 0 → flat charge`,
        },
        sort_order: nextOrder(),
      });
      appliedRules.push({
        rule_id: "overage",
        rule_type: "surcharge",
        rule_name: config.overage_config.overage_label,
        action: "partial_unit_overage",
        matched: true,
        match_reason: `${lateMinutes.toFixed(0)} min late > ${grace} min grace`,
        amount_minor: charge,
      });
    }
  }

  const surchargeTotal = fixedSurchargeTotal + pctSurchargeTotal + overageTotal;

  // ── Step 8: Add-ons ──────────────────────────────────────────────────────────

  let addonTotal = 0;
  for (const addonId of input.selected_addon_ids ?? []) {
    const addon = (config.addon_configs ?? []).find((a) => a.id === addonId);
    if (!addon) {
      warnings.push({
        code: "addon_not_found",
        message: `Add-on ${addonId} not found in config`,
        severity: "warning",
      });
      continue;
    }
    const qty = addon.pricing_model === "flat" ? 1 : input.quantity;
    const amount = addon.rate_minor * qty;
    addonTotal += amount;
    lines.push({
      line_id: newId(),
      code: `addon_${addon.code}`,
      label: addon.name,
      category: "addon",
      quantity: qty,
      unit_amount_minor: addon.rate_minor,
      amount_minor: amount,
      taxable: addon.taxable ?? true,
      source: { config_type: "addon", config_id: addon.id, config_name: addon.name },
      calculation: { formula: `${addon.rate_minor} × ${qty}` },
      sort_order: nextOrder(),
    });
  }

  const subtotalBeforeDiscounts = preSurchargeSubtotal + surchargeTotal + addonTotal;

  // ── Step 9: Discounts — fixed first, then percentage ────────────────────────

  let discountTotal = 0;

  // 9a: Fixed discounts (from rules)
  const fixedDiscountRules = (config.pricing_rules ?? []).filter(
    (r) => r.category === "discount" && r.action === "fixed_amount" && isRuleMatched(r, input)
  );
  for (const rule of fixedDiscountRules) {
    const amount = rule.amount_minor ?? 0;
    discountTotal += amount;
    lines.push({
      line_id: newId(),
      code: `discount_${rule.id}`,
      label: rule.name,
      category: "discount",
      amount_minor: -amount, // stored negative
      taxable: false,
      source: { config_type: "pricing_rule", config_id: rule.id, config_name: rule.name },
      calculation: { formula: `fixed -${amount}` },
      sort_order: nextOrder(),
    });
    appliedRules.push({
      rule_id: rule.id,
      rule_type: rule.rule_type,
      rule_name: rule.name,
      action: "fixed_amount",
      matched: true,
      match_reason: rule.always_apply ? "always_apply" : "date_match",
      amount_minor: amount,
    });
  }

  // 9b: Manual discount (authorized override — billing layer verifies auth, D-018)
  if (input.manual_discount_minor && input.manual_discount_minor > 0) {
    const amount = input.manual_discount_minor;
    discountTotal += amount;
    lines.push({
      line_id: newId(),
      code: "manual_discount",
      label: input.manual_discount_label ?? "Manual discount",
      category: "discount",
      amount_minor: -amount,
      taxable: false,
      source: { config_type: "manual_override" },
      calculation: { formula: `manual override -${amount}` },
      sort_order: nextOrder(),
    });
  }

  // 9c: Percentage discounts — applied to (subtotalBeforeDiscounts - fixedDiscounts)
  // per George v2 §6.2: "Discount base = subtotal - fixed discounts"
  const pctDiscountBase = subtotalBeforeDiscounts - discountTotal;
  const pctDiscountRules = (config.pricing_rules ?? []).filter(
    (r) => r.category === "discount" && r.action === "percentage" && isRuleMatched(r, input)
  );
  for (const rule of pctDiscountRules) {
    const bps = rule.percentage_bps ?? 0;
    const amount = bpsAmount(pctDiscountBase, bps);
    discountTotal += amount;
    lines.push({
      line_id: newId(),
      code: `discount_pct_${rule.id}`,
      label: rule.name,
      category: "discount",
      amount_minor: -amount,
      taxable: false,
      source: { config_type: "pricing_rule", config_id: rule.id, config_name: rule.name },
      calculation: {
        formula: `${pctDiscountBase} × ${bps}bps / 10000`,
        percentage_bps: bps,
        base_amount_minor: pctDiscountBase,
      },
      sort_order: nextOrder(),
    });
    appliedRules.push({
      rule_id: rule.id,
      rule_type: rule.rule_type,
      rule_name: rule.name,
      action: "percentage",
      matched: true,
      match_reason: rule.always_apply ? "always_apply" : "date_match",
      percentage_bps: bps,
      amount_minor: amount,
    });
  }

  // ── Step 10+11: Tax ──────────────────────────────────────────────────────────

  const taxableSubtotal = subtotalBeforeDiscounts - discountTotal;
  let taxTotal = 0;

  if (config.tax_config?.enabled) {
    const ppm = config.tax_config.rate_ppm;
    taxTotal = ppmAmount(taxableSubtotal, ppm);
    lines.push({
      line_id: newId(),
      code: "tax",
      label: config.tax_config.name,
      category: "tax",
      amount_minor: taxTotal,
      taxable: false, // tax line itself is not taxed
      source: { config_type: "tax_config" },
      calculation: {
        formula: `${taxableSubtotal} × ${ppm}ppm / 1000000`,
        tax_rate_ppm: ppm,
        base_amount_minor: taxableSubtotal,
      },
      sort_order: nextOrder(),
    });
  }

  // ── Step 12: Deposit ─────────────────────────────────────────────────────────
  // Always 0 (D-015). No calculation, no line item.

  // ── Step 13: Final total ─────────────────────────────────────────────────────
  // total = sum of persisted line items (no hidden math)

  const totalMinor = lines.reduce((acc, l) => acc + l.amount_minor, 0);

  // Verify: totalMinor = taxableSubtotal + taxTotal
  // (Both paths must agree; this is an internal sanity check)

  return {
    pricing_engine_version: PRICING_ENGINE_VERSION,
    calculation_id: newId(),
    calculated_at: new Date().toISOString(),

    business_id: input.business_id,
    currency,

    booking_context: {
      service_type: input.service_type,
      pricing_model: pricingModel,
      ...(input.start_at !== undefined && { start_at: input.start_at }),
      ...(input.end_at !== undefined && { end_at: input.end_at }),
      ...(input.timezone !== undefined && { timezone: input.timezone }),
      quantity: input.quantity,
      ...(participantCount > 1 && { participant_count: participantCount }),
      ...(input.duration_minutes !== undefined && { duration_minutes: input.duration_minutes }),
      ...(input.staff_id !== undefined && { staff_id: input.staff_id }),
    },

    totals: {
      subtotal_base_minor: subtotalBaseMinor,
      surcharge_total_minor: surchargeTotal,
      addon_total_minor: addonTotal,
      subtotal_before_discounts_minor: subtotalBeforeDiscounts,
      discount_total_minor: discountTotal,
      taxable_subtotal_minor: taxableSubtotal,
      tax_total_minor: taxTotal,
      fee_total_minor: 0,
      total_minor: totalMinor,
      deposit_due_minor: 0, // D-015
      balance_due_minor: totalMinor, // D-015: no deposit split
    },

    rounding: {
      mode: "half_up",
      rounded_per_line: true,
      currency_minor_unit: 100, // USD cents
    },

    lines,
    applied_rules: appliedRules,
    ...(warnings.length > 0 && { warnings }),
  } as PricingBreakdown;
}

// ─── Rule matching ────────────────────────────────────────────────────────────

function isRuleMatched(rule: PricingConfig["pricing_rules"] extends (infer R)[] | undefined ? R : never, input: BookingInput): boolean {
  if (rule.always_apply) return true;

  // Holiday date matching: rule fires if any booking date overlaps configured holiday dates
  if (rule.holiday_dates && rule.holiday_dates.length > 0) {
    const bookingDates = getBookingDates(input);
    return bookingDates.some((d) => rule.holiday_dates!.includes(d));
  }

  return false;
}

/** Returns ISO date strings ("YYYY-MM-DD") for each night/day in the booking. */
function getBookingDates(input: BookingInput): string[] {
  if (!input.start_at || !input.end_at) return [];
  const start = parseDate(input.start_at);
  const end = parseDate(input.end_at);
  const dates: string[] = [];
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);
  while (cursor < endDay) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}
