# Input / Field

> Layer: `atoms`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
The single text-entry control. One visual shell serves every input type so forms stay consistent and validation reads the same everywhere.

## Requirements
Reference **semantic tokens only**.

- **Anatomy / slots:** `label` · optional `leading icon` · `input` · optional `trailing icon/affix` (e.g. "$") · optional `hint` · `error message`.
- **Types (share one shell):** text, number, date, textarea (multi-line), select.
- **States:**
  - default — fill `color.semantic.surface.bright`, 1px `color.semantic.border.default`, text `color.semantic.text.default`, placeholder `color.semantic.text.faint`.
  - focus — border `color.semantic.action.primary.default` + 3px `color.semantic.focus-ring`.
  - filled, read-only, disabled (`color.semantic.surface.container` fill, `color.semantic.text.faint` text).
  - error — border + message `color.semantic.domain.notification.urgent.base`/`.on`; NEVER color alone (pair with icon + message).
- **Labels & hints:** label `typography.semantic.body-sm` weight semibold, `color.semantic.text.body`; hint `typography.semantic.label`-size, `color.semantic.text.variant`.
- **Shape:** radius `radius.semantic.input`. Min height `size.control.md` (44); textarea min 92 (governed exception). Padding from `spacing.primitive.3`/`4`.
- **Motion:** border/ring transition `motion.semantic.duration-fast` + `motion.semantic.easing-standard`.
- **RN compatibility:** props `label`, `type` (`text|number|date|textarea|select`), `value`, `placeholder`, `leadingIcon`, `trailingAffix`, `state` (`default|focus|error|disabled|readonly`), `hint`, `error`.

## Acceptance Criteria
- [ ] No undeclared literal values; all exceptions are named and reasoned.
- [ ] Error never signals by color alone (icon + message present).
- [ ] Label always associated (or documented aria-label); focus ring ≥3:1; ≥44px target.
- [ ] One shell; type is a property, not a fork.

## Documentation
- **Purpose:** all single-value text entry.
- **Usage:** always paired with a visible label; hint for guidance, error for validation.
- **When NOT to use:** binary on/off (Switch); one-of-many selection where chips read better (Service Pill).
- **Accessibility:** label association, error announced via `aria-describedby`, 44px target.
- **Dev notes:** maps to RN `TextInput` (+ platform date/select); `select` may swap to a native picker on device.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |
