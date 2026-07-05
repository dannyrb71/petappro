# Pricing Row

> Layer: `patterns`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
A single line item pairing a label (and optional sublabel) with a Money amount — the unit of fee breakdowns, rate charts, and the pricing editor.

## Requirements
Reference **semantic tokens**; compose the Money atom.

- **Anatomy:** `label` (+ optional sublabel/annotation) · right-aligned `amount` (Money) · optional secondary amount (e.g. "Venmo: $X").
- **Variants:** `line` (regular), `total` (bold label + `Money emphasis=strong`, top border `color.semantic.border.default`), `adjustment` (from→to preview, muted arrow).
- **Colors:** label `color.semantic.text.body`; sublabel `color.semantic.text.variant`; total label `color.semantic.text.default`.
- **Cancelled:** amount uses Money `cancelled` (strike + mute) — the whole row does not restyle.
- **Layout:** flex row, space-between, `spacing.primitive.3` gap, vertical padding `spacing.primitive.2`.
- **RN compatibility:** props `label`, `sublabel?`, `value`, `secondaryValue?`, `variant` (`line|total|adjustment`), `cancelled?`.

## Acceptance Criteria
- [ ] Tokens only; all amounts render via the Money atom (never inline).
- [ ] Total variant visually distinct (weight + divider), not by color alone.
- [ ] Adjustment preview shows from→to clearly.

## Documentation
- **Purpose:** one priced line.
- **Usage:** fee breakdown modal, rate chart, pricing editor, booking summary.
- **When NOT to use:** non-priced key/values (use a plain row).
- **Accessibility:** label and amount associated in reading order; cancelled conveyed in text.
- **Dev notes:** composes Money; totals derive from the pricing engine, not summed in the view.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |
