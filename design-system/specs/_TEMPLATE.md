# Spec — <Component Name>

> Layer: `foundations | atoms | patterns | domain | templates`
> Status: `draft → in-review → approved → built`
> Version: `0.1.0` · Author: Claude Design · Reviewer: Codex · Governor/Approver: Danny
>
> A spec is a **contract**. What gets built is verifiable against the Acceptance Criteria below.

## Objective
One or two sentences: what this component is and the single job it does.
For domain components, name the pet-care concept it encapsulates.

## Requirements
Reference **semantic / domain tokens only** — never raw values.

- **Anatomy / slots:** …
- **Variants:** …
- **Sizes:** …
- **States:** default, hover, pressed, focus-visible, disabled, loading/empty (as relevant)
- **Tokens:** color → `color.semantic.*` / `color.domain.*`; radius → `radius.semantic.*`; spacing → `spacing.*`; type → `typography.semantic.*`; elevation → `elevation.semantic.*`; motion → `motion.semantic.*`
- **Auto Layout:** direction, hug/fill, gap (space token), padding (space tokens)
- **React Native compatibility:** prop + variant names that map onto the RN implementation

## Acceptance Criteria
Each must be objectively checkable (the post-build audit tests against these).

- [ ] No literal values; all colors/spacing/radii come from semantic or domain tokens (linter passes).
- [ ] No detached instances.
- [ ] All variants use shared tokens.
- [ ] Meets WCAG 2.1 AA (contrast, focus ring ≥ 3:1, touch target ≥ 44px).
- [ ] Component properties are minimal and well-named.
- [ ] Reusable, not page-specific; composition over duplication.
- [ ] (Domain only) Named for the concept it encapsulates.

## Documentation
- **Purpose:** …
- **Usage:** …
- **When NOT to use:** …
- **Variant descriptions:** …
- **Accessibility notes:** …
- **Developer implementation notes:** …

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   |      | Initial spec. |
