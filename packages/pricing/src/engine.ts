/**
 * PetAppro pricing engine — v0.3.0
 *
 * Pure function: calculateBookingPrice(input, config) → PricingBreakdown.
 * No DB reads, no side effects, no payment capture.
 * Returns a deep-frozen snapshot — mutation at the call site is a runtime error.
 *
 * Canonical order of operations (spec §4, D-039):
 *   1  Validate inputs (integer minor units, non-negative, finite)
 *   2  Resolve rate per night (per_night): each calendar date resolves holiday > extended > regular
 *      independently; sum per night. Other models resolve whole-stay. (D-039 clarified.)
 *   3  Base quantity
 *   4  Participant pricing (per-dog, flat per-unit)
 *   5  Flat surcharges only — puppy, travel, etc. (D-039: % surcharges removed)
 *   6  Add-ons
 *   7  Discounts — fixed first, then percentage (% for discount codes only; additive not compounding)
 *   8  Taxable subtotal
 *   9  Tax (ppm; when configured)
 *  10  Deposit — always 0 (D-015)
 *  11  Final total = sum of persisted line items
 *
 * Rounding: half-up per line item; total = sum of rounded lines.
 * Money: integer minor units only. Percentages: bps (discounts). Tax: ppm.
 * D-039: no percentage surcharges.
 * Purity: no module-level mutable state — sort-order counter is local to each call.
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
  SurchargeRule,
  DiscountRule,
  RateTierCondition,
} from "./types.js";

export const PRICING_ENGINE_VERSION = "0.3.0";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Returns a fresh per-call counter closure — no module-level mutable state. */
function makeCounter(): () => number {
  let n = 0;
  return () => ++n;
}

function makeBaseLine(
  amount_minor: number,
  quantity: number,
  unit_amount_minor: number,
  pricing_model: PricingModel,
  serviceRate: PricingConfig["service_rate"],
  nextOrder: () => number,
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

function minutesBetween(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / 60_000;
}

// ─── Runtime validation ───────────────────────────────────────────────────────

function assertMinorUnit(value: number | undefined, label: string): void {
  if (value === undefined) return;
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    throw new Error(`[pricing] ${label} must be a non-negative integer minor unit; got ${value}`);
  }
}

function assertPositiveInt(value: number, label: string): void {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 1) {
    throw new Error(`[pricing] ${label} must be a positive integer; got ${value}`);
  }
}

function validateInputs(input: BookingInput, config: PricingConfig): void {
  assertPositiveInt(input.quantity, "input.quantity");
  if (input.participant_count !== undefined) {
    assertPositiveInt(input.participant_count, "input.participant_count");
  }
  assertMinorUnit(input.manual_discount_minor, "input.manual_discount_minor");

  assertMinorUnit(config.service_rate.rate_minor, "service_rate.rate_minor");
  for (const t of config.service_rate.rate_tiers ?? []) {
    assertMinorUnit(t.rate_minor, `rate_tier[${t.condition}].rate_minor`);
  }
  for (const t of config.service_rate.duration_tiers ?? []) {
    assertMinorUnit(t.rate_minor, `duration_tier[${t.duration_minutes}min].rate_minor`);
  }

  for (const rule of config.pricing_rules ?? []) {
    if (rule.category === "surcharge") {
      assertMinorUnit(rule.amount_minor, `surcharge_rule[${rule.id}].amount_minor`);
    } else if (rule.category === "discount" && rule.action === "fixed_amount") {
      assertMinorUnit(rule.amount_minor, `discount_rule[${rule.id}].amount_minor`);
    }
  }
  for (const r of config.participant_rules ?? []) {
    assertMinorUnit(r.amount_minor_per_unit, `participant_rule[${r.id}].amount_minor_per_unit`);
  }
  for (const a of config.addon_configs ?? []) {
    assertMinorUnit(a.rate_minor, `addon[${a.id}].rate_minor`);
  }
}

// ─── Immutability ─────────────────────────────────────────────────────────────

/** Deep-freeze the returned breakdown — any mutation at the call site is a runtime error. */
function deepFreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  Object.freeze(obj);
  const record = obj as Record<string, unknown>;
  for (const key of Object.getOwnPropertyNames(record)) {
    const val = record[key];
    if (val !== null && typeof val === "object" && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  }
  return obj;
}

// ─── Rate resolution (D-039) ──────────────────────────────────────────────────
// For per_night: each calendar date resolves its own rate tier independently.
// holiday dates get the holiday rate; non-holiday dates get extended (if stay qualifies)
// or regular. This is per-night, not per-stay. Extended remains a stay-level qualifier.
//
// For other models (per_session, flat, per_unit, tiered): whole-stay resolution.

/** Internal shape: a group of units (nights, sessions, days) sharing the same rate condition. */
type UnitGroup = {
  condition: RateTierCondition;
  rate_minor: number;
  label: string;
  count: number; // number of units in this group
  total_minor: number; // count × rate_minor (exact integers — no rounding needed here)
  unitSingular: string; // "night" | "session" | "unit" — for formula labels
};

/**
 * Resolve per-unit (per-date) rates for models that bill one rate per calendar day/unit.
 * Each date in the booking resolves its OWN tier independently:
 *   - Dates in the holiday calendar get the holiday rate.
 *   - Non-holiday dates get the extended rate if the whole booking qualifies the threshold,
 *     otherwise the regular rate.
 *
 * Returns one UnitGroup per condition present (holiday → extended → regular).
 * Returns null if no rate_tiers configured or no booking dates available (caller falls back).
 *
 * Used by: per_night, per_session, per_unit.
 * NOT used by: flat (no per-unit date concept), tiered, duration_tiered.
 */
function resolvePerUnitRates(
  serviceRate: PricingConfig["service_rate"],
  input: BookingInput,
  unitSingular: string
): UnitGroup[] | null {
  const tiers = serviceRate.rate_tiers;
  if (!tiers || tiers.length === 0) return null;

  const dates = getBookingDates(input);
  if (dates.length === 0) return null;

  const holidayTier = tiers.find((t) => t.condition === "holiday");
  const extendedTier = tiers.find((t) => t.condition === "extended");
  const regularTier = tiers.find((t) => t.condition === "regular");

  const regularRate = regularTier?.rate_minor ?? (serviceRate.rate_minor ?? 0);
  const regularLabel = regularTier?.label ?? serviceRate.name;

  // Extended is a STAY-level qualifier: fires when total nights >= threshold.
  // Per-night, non-holiday nights get the extended rate if the whole stay qualifies.
  const isExtendedStay =
    extendedTier?.extended_min_nights !== undefined &&
    dates.length >= extendedTier.extended_min_nights;

  // Accumulate units by condition
  const counts = new Map<RateTierCondition, { rate_minor: number; label: string; count: number }>();

  for (const date of dates) {
    let condition: RateTierCondition;
    let rate_minor: number;
    let label: string;

    if (holidayTier?.holiday_dates?.includes(date)) {
      condition = "holiday";
      rate_minor = holidayTier.rate_minor;
      label = holidayTier.label;
    } else if (isExtendedStay && extendedTier) {
      condition = "extended";
      rate_minor = extendedTier.rate_minor;
      label = extendedTier.label;
    } else {
      condition = "regular";
      rate_minor = regularRate;
      label = regularLabel;
    }

    const existing = counts.get(condition);
    if (existing) {
      counts.set(condition, { ...existing, count: existing.count + 1 });
    } else {
      counts.set(condition, { rate_minor, label, count: 1 });
    }
  }

  // Build result in display priority order: holiday → extended → regular
  const groups: UnitGroup[] = [];
  for (const condition of ["holiday", "extended", "regular"] as RateTierCondition[]) {
    const g = counts.get(condition);
    if (g) {
      groups.push({
        condition,
        rate_minor: g.rate_minor,
        label: g.label,
        count: g.count,
        total_minor: g.rate_minor * g.count,
        unitSingular,
      });
    }
  }

  return groups.length > 0 ? groups : null;
}

/**
 * Whole-stay rate resolution for non-per_night models (per_session, flat, etc.)
 * and as the fallback for per_night when booking dates are not provided.
 * Priority: holiday (any date match) > extended (quantity threshold) > regular.
 */
function resolveRateTier(
  serviceRate: PricingConfig["service_rate"],
  input: BookingInput
): { rate_minor: number; condition: RateTierCondition; label: string } {
  const tiers = serviceRate.rate_tiers;
  if (!tiers || tiers.length === 0) {
    return { rate_minor: serviceRate.rate_minor ?? 0, condition: "regular", label: serviceRate.name };
  }

  if (input.start_at && input.end_at) {
    const bookingDates = getBookingDates(input);
    const holidayTier = tiers.find((t) => t.condition === "holiday");
    if (
      holidayTier?.holiday_dates &&
      bookingDates.some((d) => holidayTier.holiday_dates!.includes(d))
    ) {
      return { rate_minor: holidayTier.rate_minor, condition: "holiday", label: holidayTier.label };
    }
  }

  const extendedTier = tiers.find((t) => t.condition === "extended");
  if (
    extendedTier !== undefined &&
    extendedTier.extended_min_nights !== undefined &&
    input.quantity >= extendedTier.extended_min_nights
  ) {
    return { rate_minor: extendedTier.rate_minor, condition: "extended", label: extendedTier.label };
  }

  const regularTier = tiers.find((t) => t.condition === "regular");
  if (regularTier) {
    return { rate_minor: regularTier.rate_minor, condition: "regular", label: regularTier.label };
  }

  return { rate_minor: serviceRate.rate_minor ?? 0, condition: "regular", label: serviceRate.name };
}

// ─── Main engine ─────────────────────────────────────────────────────────────

export function calculateBookingPrice(
  input: BookingInput,
  config: PricingConfig
): PricingBreakdown {
  // Step 1: Runtime validation — guard against bad data from DB/JSON deserialization
  validateInputs(input, config);

  // Per-call counter — no module-level state; function is a pure computation
  const nextOrder = makeCounter();

  const lines: PricingLineItem[] = [];
  const appliedRules: AppliedPricingRule[] = [];
  const warnings: PricingWarning[] = [];

  const currency = config.currency;
  const participantCount = input.participant_count ?? 1;

  // ── Step 2+3: Base service price ─────────────────────────────────────────────

  let basePriceMinor: number;
  const pricingModel: PricingModel = config.service_rate.pricing_model;
  // Set when ALL nights share the same condition (or for non-per_night models).
  // Undefined for mixed stays where different nights got different rates.
  let rateTierCondition: RateTierCondition | undefined;

  if (pricingModel === "duration_tiered") {
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
          makeBaseLine(tier.rate_minor, input.quantity, tier.rate_minor, pricingModel, config.service_rate, nextOrder, {
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
      lines.push(makeBaseLine(basePriceMinor, qty, matchingTier.rate_minor, pricingModel, config.service_rate, nextOrder));
    }

  } else if (
    (pricingModel === "per_night" || pricingModel === "per_session" || pricingModel === "per_unit") &&
    config.service_rate.rate_tiers &&
    config.service_rate.rate_tiers.length > 0
  ) {
    // ── Per-unit (per-date) rate resolution (D-039 clarified) ───────────────
    // Applies to per_night, per_session, per_unit when rate_tiers are configured.
    // Each calendar date resolves its OWN tier: holiday dates get the holiday rate;
    // non-holiday dates get the extended rate (if the whole booking meets the
    // threshold) or the regular rate. Emit one base line per condition group.
    // This prevents the v0.2 bug: holiday rate × ALL units when ANY date is a holiday.
    const unitSingular = unitLabel(pricingModel); // "night" | "session" | "unit"
    const unitGroups = resolvePerUnitRates(config.service_rate, input, unitSingular);

    if (unitGroups) {
      basePriceMinor = 0;
      rateTierCondition = unitGroups.length === 1 ? unitGroups[0]!.condition : undefined;

      for (const group of unitGroups) {
        basePriceMinor += group.total_minor;
        const lineLabel =
          unitGroups.length === 1
            ? config.service_rate.name
            : `${config.service_rate.name} — ${group.label}`;

        lines.push(
          makeBaseLine(
            group.total_minor,
            group.count,
            group.rate_minor,
            pricingModel,
            config.service_rate,
            nextOrder,
            {
              label: lineLabel,
              calculation: {
                formula: `${group.rate_minor} × ${group.count} ${group.unitSingular}${group.count !== 1 ? "s" : ""}`,
                ...(group.condition !== "regular" && { rate_tier_condition: group.condition }),
              },
            }
          )
        );

        appliedRules.push({
          rule_id: `rate_tier_${group.condition}`,
          rule_type: group.condition === "holiday" ? "holiday" : "base",
          rule_name: group.label,
          action: "rate_tier",
          matched: true,
          match_reason: `${group.count} ${group.unitSingular}(s) with condition=${group.condition}`,
          amount_minor: group.total_minor,
          rate_tier_condition: group.condition,
        });
      }
    } else {
      // No booking dates provided — fall back to whole-booking resolution.
      // resolveRateTier skips the holiday check when dates are absent, so this
      // path never mis-fires the holiday rate without actual date evidence.
      warnings.push({
        code: "no_dates_for_rate_tiers",
        message: `rate_tiers configured for ${pricingModel} but start_at/end_at not provided; using whole-booking fallback`,
        severity: "info",
      });
      const resolved = resolveRateTier(config.service_rate, input);
      const qty = input.quantity;
      basePriceMinor = resolved.rate_minor * qty;
      rateTierCondition = resolved.condition;
      lines.push(
        makeBaseLine(basePriceMinor, qty, resolved.rate_minor, pricingModel, config.service_rate, nextOrder, {
          calculation: {
            formula: `${resolved.rate_minor} × ${qty} (no-dates fallback)`,
            ...(resolved.condition !== "regular" && { rate_tier_condition: resolved.condition }),
          },
        })
      );
      appliedRules.push({
        rule_id: `rate_tier_${resolved.condition}`,
        rule_type: resolved.condition === "holiday" ? "holiday" : "base",
        rule_name: resolved.label,
        action: "rate_tier",
        matched: true,
        match_reason: `whole-booking fallback; condition=${resolved.condition}`,
        amount_minor: resolved.rate_minor,
        rate_tier_condition: resolved.condition,
      });
    }

  } else {
    // flat / per_night (no rate_tiers) / per_session (no rate_tiers) / per_unit (no rate_tiers)
    // — whole-booking resolution; rate_tiers not configured so single rate applies.
    const resolved = resolveRateTier(config.service_rate, input);
    const qty = pricingModel === "flat" ? 1 : input.quantity;
    basePriceMinor = resolved.rate_minor * qty;
    rateTierCondition = resolved.condition;

    lines.push(
      makeBaseLine(basePriceMinor, qty, resolved.rate_minor, pricingModel, config.service_rate, nextOrder, {
        calculation: {
          formula: `${resolved.rate_minor} × ${qty}`,
          ...(resolved.condition !== "regular" && { rate_tier_condition: resolved.condition }),
        },
      })
    );
  }

  // ── Step 4: Participant pricing ──────────────────────────────────────────────

  let participantTotalMinor = 0;
  for (const rule of config.participant_rules ?? []) {
    const extraParticipants = Math.max(0, participantCount - (rule.applies_from_participant - 1));
    if (extraParticipants === 0) continue;
    const qty = input.quantity;
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

  const subtotalBaseMinor = basePriceMinor + participantTotalMinor;

  // ── Step 5: Flat surcharges (D-039: flat amounts only, no % surcharges) ──────

  let surchargeTotal = 0;

  const surchargeRules = (config.pricing_rules ?? []).filter(
    (r): r is SurchargeRule => r.category === "surcharge" && isRuleMatched(r, input)
  );

  for (const rule of surchargeRules) {
    const amount = rule.per_unit ? rule.amount_minor * input.quantity : rule.amount_minor;
    surchargeTotal += amount;
    const category = rule.rule_type === "holiday" ? "holiday" : "surcharge";
    lines.push({
      line_id: newId(),
      code: `surcharge_${rule.id}`,
      label: rule.name,
      category,
      ...(rule.per_unit && { quantity: input.quantity, unit_amount_minor: rule.amount_minor }),
      amount_minor: amount,
      taxable: true,
      source: { config_type: "pricing_rule", config_id: rule.id, config_name: rule.name },
      calculation: {
        formula: rule.per_unit
          ? `${rule.amount_minor} × ${input.quantity} units`
          : `fixed ${amount}`,
      },
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

  // ── Overage surcharge (partial_unit_overage) ────────────────────────────────

  let overageTotal = 0;
  if (config.overage_config && input.scheduled_end_at && input.actual_end_at) {
    const scheduledEnd = new Date(input.scheduled_end_at);
    const actualEnd = new Date(input.actual_end_at);
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

  surchargeTotal += overageTotal;

  // ── Step 6: Add-ons ──────────────────────────────────────────────────────────

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

  const subtotalBeforeDiscounts = subtotalBaseMinor + surchargeTotal + addonTotal;

  // ── Step 7: Discounts — fixed first, then percentage ────────────────────────
  // % discounts apply to the same base (post-fixed-discount); additive, not compounding.

  let discountTotal = 0;

  const fixedDiscountRules = (config.pricing_rules ?? []).filter(
    (r): r is DiscountRule =>
      r.category === "discount" && r.action === "fixed_amount" && isRuleMatched(r, input)
  );
  for (const rule of fixedDiscountRules) {
    const amount = rule.amount_minor ?? 0;
    discountTotal += amount;
    lines.push({
      line_id: newId(),
      code: `discount_${rule.id}`,
      label: rule.name,
      category: "discount",
      amount_minor: -amount,
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

  const pctDiscountBase = subtotalBeforeDiscounts - discountTotal;
  const pctDiscountRules = (config.pricing_rules ?? []).filter(
    (r): r is DiscountRule =>
      r.category === "discount" && r.action === "percentage" && isRuleMatched(r, input)
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

  // ── Step 8+9: Tax ────────────────────────────────────────────────────────────

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
      taxable: false,
      source: { config_type: "tax_config" },
      calculation: {
        formula: `${taxableSubtotal} × ${ppm}ppm / 1000000`,
        tax_rate_ppm: ppm,
        base_amount_minor: taxableSubtotal,
      },
      sort_order: nextOrder(),
    });
  }

  // ── Step 10: Deposit — always 0 (D-015) ─────────────────────────────────────

  // ── Step 11: Final total = sum of persisted line items ───────────────────────

  const totalMinor = lines.reduce((acc, l) => acc + l.amount_minor, 0);

  const result: PricingBreakdown = {
    pricing_engine_version: PRICING_ENGINE_VERSION,
    calculation_id: newId(),
    calculated_at: new Date().toISOString(),

    business_id: input.business_id,
    currency,

    booking_context: {
      service_type: input.service_type,
      pricing_model: pricingModel,
      ...(rateTierCondition !== undefined && { rate_tier_condition: rateTierCondition }),
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
      deposit_due_minor: 0,
      balance_due_minor: totalMinor,
    },

    rounding: {
      mode: "half_up",
      rounded_per_line: true,
      currency_minor_unit: 100,
    },

    lines,
    applied_rules: appliedRules,
    ...(warnings.length > 0 && { warnings }),
  } as PricingBreakdown;

  // Deep-freeze: the returned breakdown is the immutable booking snapshot.
  // Any mutation attempt will throw in strict mode.
  return deepFreeze(result);
}

// ─── Rule matching ────────────────────────────────────────────────────────────

function isRuleMatched(
  rule: { always_apply?: boolean; holiday_dates?: string[] },
  input: BookingInput
): boolean {
  if (rule.always_apply) return true;
  if (rule.holiday_dates && rule.holiday_dates.length > 0) {
    const bookingDates = getBookingDates(input);
    return bookingDates.some((d) => rule.holiday_dates!.includes(d));
  }
  return false;
}

/** Returns ISO date strings ("YYYY-MM-DD") for each night of the booking (UTC). */
function getBookingDates(input: BookingInput): string[] {
  if (!input.start_at || !input.end_at) return [];
  const cursor = new Date(input.start_at);
  cursor.setUTCHours(0, 0, 0, 0);
  const endDay = new Date(input.end_at);
  endDay.setUTCHours(0, 0, 0, 0);
  const dates: string[] = [];
  while (cursor < endDay) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}
