# Switch

> Layer: `atoms`
> Status: `approved`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
A binary on/off toggle for immediate settings — state changes apply at once, no submit.

## Requirements
Reference **semantic tokens only**.

- **States:** off, on, disabled-off, disabled-on, focus-visible.
- **Colors:** on track = `color.semantic.action.secondary.solid`; off track = `color.semantic.border.strong`; thumb = `color.semantic.surface.bright` with `elevation.semantic.card`; focus ring `color.semantic.focus-ring`.
- **Shape:** radius `radius.semantic.switch` (fully rounded).
- **Motion:** thumb slides `motion.semantic.duration-base` + `motion.semantic.easing-standard`; honor reduced-motion.
- **Size:** track 46×28, thumb 22 (governed exceptions — native switch control geometry); effective hit area ≥ `size.min-touch-target` (44) via padding.
- **RN compatibility:** props `checked` (bool), `disabled` (bool), `onChange`, `label?`.

## Acceptance Criteria
- [ ] Token-driven colors; no undeclared literals (exceptions named and reasoned).
- [ ] ≥ `size.min-touch-target` (44) effective target; visible focus ring ≥3:1.
- [ ] On/off distinguishable beyond color (thumb position).

## Documentation
- **Purpose:** immediate binary setting.
- **Usage:** settings, service availability toggles, opt-ins.
- **When NOT to use:** actions that need confirmation/submit (use Button); one-of-many (use radio/segmented).
- **Accessibility:** role switch with on/off state; label associated; keyboard operable.
- **Dev notes:** maps to RN `Switch`; color the track/thumb via tokens.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |
