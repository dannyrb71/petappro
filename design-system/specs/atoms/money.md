# Money

> Layer: `atoms`
> Status: `approved`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
The single way a monetary amount is rendered, so formatting and the cancelled-strike treatment are identical everywhere (cards, lists, fee breakdowns).

## Requirements
Reference **semantic tokens only**.

- **Format:** currency, 2 decimals, locale-aware; USD default. Amount comes from the pricing engine — never re-computed here.
- **States:**
  - default — `color.semantic.text.default`.
  - `cancelled` — strikethrough **and** `color.semantic.text.variant` (both always travel together).
- **Emphasis:** `regular` (`typography.semantic.body`) · `strong` (bold, for totals).
- **RN compatibility:** props `value` (number), `cancelled` (bool), `emphasis` (`regular|strong`), `currency`.

## Acceptance Criteria
- [ ] No literal color; tokens only.
- [ ] Cancelled = strike + mute together, every occurrence.
- [ ] Never re-implement a struck price inline elsewhere.

## Documentation
- **Purpose:** render an amount consistently.
- **Usage:** any price/balance/total; set `cancelled` when the booking is cancelled.
- **When NOT to use:** non-currency numbers (counts, durations).
- **Accessibility:** cancelled state conveyed in text for SR (e.g. "cancelled, $52") — not by strike alone.
- **Dev notes:** shares the format util with the pricing engine (`lib/format`).

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |
