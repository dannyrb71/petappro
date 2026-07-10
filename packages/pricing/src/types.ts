// ─── Canonical enums ────────────────────────────────────────────────────────
// Source of truth: docs/specs/booking_and_pricing.md §3

export type PricingModel =
  | "flat"
  | "per_unit"
  | "per_session"
  | "per_hour" // later
  | "per_head" // later
  | "per_night"
  | "tiered"
  | "duration_tiered" // MVP: walk 30/60/90 fixed tiers (D-022)
  | "partial_unit_overage"; // MVP: boarding late-pickup boundary (§9 arch note 1)

export type PricingRuleType = "base" | "surcharge" | "discount" | "holiday" | "peak";

// ─── Config shapes (tenant snapshot, loaded server-side before engine call) ──

/** One duration tier for duration_tiered pricing (e.g. 30-min walk = $30). */
export type DurationTier = {
  duration_minutes: number;
  rate_minor: number; // integer minor units
  label: string;
};

/** One volume tier for tiered pricing (e.g. nights 1-3 @ $80, 4+ @ $70). */
export type VolumeTier = {
  min_quantity: number;
  max_quantity: number | null; // null = unlimited
  rate_minor: number; // rate per unit in this tier
  label?: string;
};

/** Base rate configuration for a service. */
export type ServiceRate = {
  id: string;
  business_id: string;
  name: string;
  pricing_model: PricingModel;
  currency: string;
  rate_minor?: number; // for flat/per_unit/per_session/per_night
  duration_tiers?: DurationTier[]; // for duration_tiered
  volume_tiers?: VolumeTier[]; // for tiered
};

/**
 * A pricing rule: surcharge, discount, or holiday modifier.
 * Rules with always_apply=true fire unconditionally (used in tests and
 * simple configs). Rules with holiday_dates fire when any booking date
 * overlaps. Per spec §7, holiday granularity: boarding=per-night,
 * daycare=per-day, walking=per-session/day.
 */
export type PricingRule = {
  id: string;
  business_id: string;
  rule_type: PricingRuleType;
  name: string;
  // surcharge/discount → positive amounts reduce/increase
  category: "surcharge" | "discount";
  action: "fixed_amount" | "percentage";
  amount_minor?: number; // for fixed_amount (positive = surcharge, negative OK for discount)
  percentage_bps?: number; // for percentage, in basis points (100 bps = 1%)
  always_apply?: boolean; // true → fires unconditionally; used for standing surcharges
  holiday_dates?: string[]; // ISO "YYYY-MM-DD" dates; fires if booking overlaps any
};

/**
 * Additional-participant fee: fires for participants beyond the base.
 * Per-unit = the fee multiplies by quantity (nights, sessions).
 * e.g. "extra dog: $40/night" → amount_minor=4000, per_unit=true
 */
export type ParticipantRule = {
  id: string;
  business_id: string;
  name: string;
  applies_from_participant: number; // 2 = starts with 2nd participant
  action: "fixed_amount_per_unit"; // MVP
  amount_minor_per_unit: number; // integer minor units per additional participant per unit
};

/** An add-on service that can be attached to a booking. */
export type AddonConfig = {
  id: string;
  business_id: string;
  name: string;
  code: string;
  pricing_model: "flat" | "per_unit" | "per_night" | "per_session";
  rate_minor: number; // integer minor units
  taxable?: boolean;
};

/**
 * Overage config for partial_unit_overage: fires when actual pickup
 * exceeds scheduled end + grace. MVP: one flat overage charge.
 */
export type OverageConfig = {
  grace_period_minutes: number;
  overage_charge_minor: number;
  overage_label: string;
  overage_code: string;
};

/** Tax config — MVP: one business-level rate, can be disabled. */
export type TaxConfig = {
  enabled: boolean;
  rate_ppm: number; // parts-per-million; 8.625% = 86250
  name: string;
};

/**
 * Full tenant pricing config snapshot.
 * The server loads this once and passes it into the engine; the engine
 * never reads the DB. Carry this verbatim into booking_price_snapshots.
 */
export type PricingConfig = {
  business_id: string;
  currency: string;
  service_rate: ServiceRate;
  pricing_rules?: PricingRule[];
  participant_rules?: ParticipantRule[];
  addon_configs?: AddonConfig[];
  overage_config?: OverageConfig; // for partial_unit_overage
  tax_config?: TaxConfig;
};

// ─── Engine input ────────────────────────────────────────────────────────────

export type BookingInput = {
  business_id: string;
  service_type: string;
  quantity: number; // nights | days | sessions | units
  participant_count?: number; // e.g. number of dogs (default 1)
  duration_minutes?: number; // for duration_tiered (e.g. walk length)
  // ISO 8601 datetimes; used for holiday matching and overage
  start_at?: string;
  end_at?: string;
  timezone?: string; // IANA tz; business timezone is source of truth (arch note 1)
  // Overage (partial_unit_overage)
  scheduled_end_at?: string; // ISO datetime
  actual_end_at?: string; // ISO datetime
  // Selected add-ons (IDs must exist in config.addon_configs)
  selected_addon_ids?: string[];
  // Authorized manual override (staff/admin only — billing layer verifies authorization)
  manual_discount_minor?: number; // positive integer
  manual_discount_label?: string;
  // Actor — base509_account_id, not auth.uid() (D-035)
  created_by?: string;
  staff_id?: string | null;
};

// ─── Output shapes ───────────────────────────────────────────────────────────
// Verbatim from George v2 §9; adopted by booking_and_pricing.md §5.

export type PricingLineItem = {
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
    | "overage"
    | "tip"; // billing layer adds tip; here for completeness (§5A)
  pricing_model?: PricingModel;
  quantity?: number;
  unit_label?: string;
  unit_amount_minor?: number;
  amount_minor: number; // rounded half-up when created; can be negative (discounts)
  taxable: boolean;
  source: {
    config_type:
      | "service_rate"
      | "pricing_rule"
      | "addon"
      | "participant_rule"
      | "manual_override"
      | "tax_config"
      | "overage_config";
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

export type AppliedPricingRule = {
  rule_id: string;
  rule_type: PricingRuleType;
  rule_name: string;
  action: "fixed_amount" | "percentage" | "rate_override" | "duration_tier" | "partial_unit_overage";
  matched: boolean;
  match_reason: string;
  amount_minor?: number;
  percentage_bps?: number;
  tax_rate_ppm?: number;
};

export type PricingWarning = {
  code: string;
  message: string;
  severity: "info" | "warning" | "error";
};

export type PricingBreakdown = {
  pricing_engine_version: string;
  calculation_id: string;
  calculated_at: string; // ISO 8601

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
    duration_minutes?: number;
    staff_id?: string | null;
  };

  totals: {
    subtotal_base_minor: number; // base + participant
    surcharge_total_minor: number;
    addon_total_minor: number;
    subtotal_before_discounts_minor: number;
    discount_total_minor: number; // positive = amount deducted
    taxable_subtotal_minor: number;
    tax_total_minor: number;
    fee_total_minor: number;
    total_minor: number;
    deposit_due_minor: 0; // always 0 (D-015)
    balance_due_minor: number; // == total_minor (D-015)
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
