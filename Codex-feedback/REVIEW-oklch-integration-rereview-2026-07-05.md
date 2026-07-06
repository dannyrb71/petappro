# OKLCH Primitive Integration Re-review - 2026-07-05

Reviewer: Codex  
Response reviewed: `Codex-feedback/RESPONSE-oklch-integration-2026-07-05.md`  
Prior review: `Codex-feedback/REVIEW-oklch-integration-2026-07-05.md`

Verdict: **READY-FOR-GOVERNOR**

## Mechanical Gates

Command: `node design-system/tools/lint-tokens.mjs`

```text
✓ tokens clean — 538 tokens across 14 file(s), 0 violations
  breakpoint.tokens.json
  elevation.tokens.json
  motion.tokens.json
  color.tokens.json
  radius.tokens.json
  color.tokens.json
  size.tokens.json
  spacing.tokens.json
  berry.tokens.json
  dusk.tokens.json
  harbor.tokens.json
  sage-sand.tokens.json
  terracotta.tokens.json
  typography.tokens.json

⚠ 5 governed exception(s):
    [R1] berry.tokens.json :: color.brand.focus-ring
      literal allowed by governed exception — reason: translucent focus ring; alpha overlay, no solid primitive equivalent
    [R1] dusk.tokens.json :: color.brand.focus-ring
      literal allowed by governed exception — reason: translucent focus ring; alpha overlay, no solid primitive equivalent
    [R1] harbor.tokens.json :: color.brand.focus-ring
      literal allowed by governed exception — reason: translucent focus ring; alpha overlay, no solid primitive equivalent
    [R1] sage-sand.tokens.json :: color.brand.focus-ring
      literal allowed by governed exception — reason: translucent focus ring; alpha overlay, no solid primitive equivalent
    [R1] terracotta.tokens.json :: color.brand.focus-ring
      literal allowed by governed exception — reason: translucent focus ring; alpha overlay, no solid primitive equivalent
```

Command: `node design-system/tools/lint-specs.mjs`

```text
spec-lint: 23 specs · 450 tokens
✓ specs clean — 0 errors
```

## Confirmations

- **Harbor/Dusk solid accent AA:** confirmed from source. `design-system/tokens/themes/harbor.tokens.json:24` now uses `harbor-accent.600`; `design-system/tokens/themes/dusk.tokens.json:24` now uses `dusk-accent.600`.
- **Harbor tonal accent AA:** confirmed from source. `design-system/tokens/themes/harbor.tokens.json:54` now uses `harbor-accent.700`.
- **Light-accent rule placement:** confirmed. The rule is in `design-system/specs/AUTHORING-GUIDE.md:44`; it was correctly kept out of `button.md`, `service-pill.md`, and `status-badge.md`.
- **Version-history entries:** confirmed in the four approved touched specs:
  - `design-system/specs/atoms/button.md:47`
  - `design-system/specs/patterns/list-row.md:37`
  - `design-system/specs/domain/booking-card.md:40`
  - `design-system/specs/domain/report-card.md:37`
- **Owner role:** confirmed unchanged. `design-system/tokens/semantic/color.tokens.json:476` remains `{color.primitive.pine.800}`.
- **Review learning captured:** confirmed. `Codex-feedback/REVIEW-RUBRIC.md:44` adds the theme-mode contrast-pair checklist, and `Codex-feedback/REVIEW-RUBRIC.md:84` records the lesson.

## Contrast Verification

Computed from `design-system/tokens/primitives/color.tokens.json` and `design-system/tokens/themes/*.tokens.json`.

| Theme | `secondary-solid` + white | `secondary-container` + `on-surface-accent` |
|---|---:|---:|
| Sage & Sand | `#5C7A37` **4.89** | `#EFF6E8` + `#456023` **6.45** |
| Terracotta | `#5D784B` **4.94** | `#EFF6EC` + `#465E36` **6.54** |
| Harbor | `#008541` **4.74** | `#E5FAE9` + `#006831` **6.34** |
| Dusk | `#926500` **5.14** | `#FDF2E2` + `#926500` **4.65** |
| Berry | `#9F536C` **5.35** | `#FFEEF3` + `#803D54` **6.92** |

All checked pairs pass AA.

## Non-blocking Governor Note

The four specs now have `0.1.1` version-history rows, but their top metadata still says `Version: 0.1.0`. I am not blocking on this because the requested governance fix was the version-history entry and the approved interaction contract is now traceable. Danny may still prefer updating those top metadata lines to `0.1.1` before final approval.

## Findings

No blocking findings.

## Review Learning

- What did I or the last pass miss, and why? This pass found no source-level regression. The only nuance is metadata hygiene: adding a version-history row can leave the top `Version` field stale if the rubric does not say whether that field means current version or original approval version.
- New rule added to lint-specs.mjs or rubric: no new mechanical rule required for this pass. Consider adding a rubric note that version-history bumps should keep the top `Version` metadata in sync when that field is intended to represent the current spec version.
