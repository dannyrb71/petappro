/**
 * Half-up rounding for integer minor units.
 * Spec: booking_and_pricing.md §4 / George v2 §7.3
 * "Half-up" = Math.round semantics. Never banker's rounding.
 * Input is a float result of integer arithmetic; output is integer.
 */
export function halfUp(n: number): number {
  return Math.floor(n + 0.5);
}

/**
 * Apply a basis-point percentage to a minor-unit amount.
 * Formula: amount_minor * bps / 10_000, then half-up.
 * e.g. bpsAmount(22500, 2000) = 4500  ($225 × 20% = $45)
 */
export function bpsAmount(base_minor: number, bps: number): number {
  return halfUp((base_minor * bps) / 10_000);
}

/**
 * Apply a parts-per-million tax rate to a minor-unit amount.
 * Formula: amount_minor * ppm / 1_000_000, then half-up.
 * e.g. ppmAmount(18000, 86250) = 1553  ($180 × 8.625% = $15.53)
 */
export function ppmAmount(base_minor: number, ppm: number): number {
  return halfUp((base_minor * ppm) / 1_000_000);
}
