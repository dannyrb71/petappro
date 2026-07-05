# Spec — <Component Name>

> Layer: foundations | atoms | patterns | domain | templates
> Author: Claude Design · Date: YYYY-MM-DD · Status: draft | in-review | approved
> A spec is a **contract**. What gets built is verifiable against the Acceptance Criteria below.

## Objective
<One or two sentences. What this component is and why it earns a place in the system.
For domain components, name the pet-care concept it encapsulates.>

## Requirements
- **Anatomy:** <parts/slots — e.g. leading icon, label, trailing affordance>
- **Variants:** <e.g. status = scheduled | in-progress | complete | cancelled>
- **States:** default · hover · pressed · focus · disabled · loading (as applicable)
- **Tokens used:** <semantic tokens ONLY — e.g. color.semantic.status.success.*, never raw hex>
- **Sizing / spacing:** <token-based — spacing, radius, type scale>
- **Content / props:** <inputs, defaults, required vs optional>
- **Behavior:** <interaction, truncation, empty/error handling>
- **Responsive:** <web + native differences, breakpoints if any>

## Acceptance Criteria
<Checkable statements. Each must be objectively pass/fail — this is what the post-build audit checks against.>
- [ ] Uses only semantic tokens; token linter passes.
- [ ] All variants and states render per Requirements.
- [ ] Meets WCAG 2.1 AA contrast for text and non-text.
- [ ] Touch target ≥ 44px on native.
- [ ] No one-off literals; composes from existing lower layers.
- [ ] <component-specific criterion>
- [ ] <component-specific criterion>

## Notes / open questions
<Anything the Governor should weigh; flagged risks; dependencies on other components.>
