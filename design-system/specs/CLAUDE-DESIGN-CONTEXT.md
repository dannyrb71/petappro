# Claude Design — Context Pack (upload this whole file at the start of an authoring task)

Claude Design can't read the PetAppro repo, so this file bundles everything you need to author specs
that pass the gate on first delivery: the **rules**, the **exact token names**, and the **template**.
Deliver your specs as files; Danny downloads them and Claude (Cowork) runs the linters + merges before
Codex reviews. This pack is regenerated from the live tokens, so the names below are current.

---

# Spec Authoring Guide (for Claude Design)

Author-facing companion to `Codex-feedback/REVIEW-RUBRIC.md` (the reviewer's checklist). Follow this and
your specs pass on first delivery. **These are the exact rules `lint-specs.mjs` enforces** — if you
follow them, review is judgment-only, not literal-hunting. Kept in sync with the linter; if it and this
guide ever disagree, the linter wins.

## Before you deliver — run the gate (or ask Claude Cowork to)
```
node design-system/tools/lint-tokens.mjs     # tokens must be 0 violations
node design-system/tools/lint-specs.mjs       # your specs must be 0 errors
```
If you can't run Node, hand your specs to Claude (Cowork) to lint **before** they reach Codex. A spec
with linter errors is not ready for review.

## Hard rules (mechanical — the linter fails on these)
1. **No color literals.** Never a hex (`#1F4E44`), never bare `white`/`black`, never primitive shorthand
   (`green.700`). Use **semantic/domain** tokens only. White text on a solid colored fill →
   `color.semantic.text.on-solid`. (S1/S2/S6)
2. **No dimension literals.** Never raw `44px`, `1px`, `0.14em`, `46×28`. Use a **size/spacing/radius**
   token. If a truly one-off structural value is unavoidable, write it inline as a **named, reasoned
   governed exception** — e.g. "switch track 46×28 (governed exception — component-specific)". (S7)
3. **Reference exact leaf tokens, not groups.** `color.semantic.domain.capacity.available.base` —
   not `…capacity.available`. Every ref must resolve. (S3)
4. **Acceptance wording.** If the spec uses *any* governed exception, its Acceptance Criteria must say
   **"No undeclared literal values; all exceptions are named and reasoned"** — never the absolute
   "No literal values" / "Tokens only". (S4)
5. **Contract sections present:** Objective · Requirements · Acceptance Criteria · Documentation ·
   Version history. Use `specs/_TEMPLATE.md`. (S5)

## Token vocabulary — pull names from `design-system/tokens/` (exact source of truth)
- **Color:** `color.semantic.action.{primary,secondary}.*` · `color.semantic.surface.*` ·
  `color.semantic.text.*` (incl. `text.on-solid`) · `color.semantic.border.*` · `color.semantic.focus-ring` ·
  `color.semantic.status.*` (incl. `status.success-solid`) · `color.semantic.domain.*` (booking, payment,
  service, notification, capacity, risk, role, pet — most have `.base/.container/.on`).
- **Type:** `typography.semantic.*` (display, headline, title, body, label, …).
- **Dimensions:** `size.control.*` · `size.icon.*` · `size.avatar.*` · `size.stroke.{hairline,ring,focus}` ·
  `size.min-touch-target` · `spacing.*` · `radius.semantic.*` · `breakpoint.*`.
- **Motion / elevation:** `motion.semantic.*` · `elevation.semantic.*`.

## Judgment (the linter can't check these — Codex will)
- **Accessibility:** never color-only meaning (pair with icon/text/position); focus ring ≥3:1; touch
  target ≥ `size.min-touch-target`; screen-reader treatment noted; contrast AA called out.
- **Composition:** compose from existing lower layers; no one-off subparts; reusable, not page-specific.
- **RN mapping:** props/variants named and mapped to the React Native implementation.
- **Domain:** name domain components for the concept; use `domain.*` tokens.

## Flow
You author → run both linters (or Claude Cowork does) → Codex reviews judgment against the rubric →
Danny approves. Fewer round-trips because the mechanical checks are done before review.


---

# Token manifest (every valid token — reference these exact names)


**breakpoint.sm.\***  ·  `breakpoint.sm`

**breakpoint.md.\***  ·  `breakpoint.md`

**breakpoint.lg.\***  ·  `breakpoint.lg`

**elevation.primitive.\***  ·  `elevation.primitive.0` · `elevation.primitive.1` · `elevation.primitive.2` · `elevation.primitive.3` · `elevation.primitive.nav`

**elevation.semantic.\***  ·  `elevation.semantic.card` · `elevation.semantic.raised` · `elevation.semantic.modal` · `elevation.semantic.nav`

**motion.primitive.\***  ·  `motion.primitive.duration.short` · `motion.primitive.duration.medium` · `motion.primitive.duration.long` · `motion.primitive.easing.standard` · `motion.primitive.easing.emphasized` · `motion.primitive.scale.press`

**motion.semantic.\***  ·  `motion.semantic.duration-fast` · `motion.semantic.duration-base` · `motion.semantic.duration-slow` · `motion.semantic.easing-standard` · `motion.semantic.easing-emphasized` · `motion.semantic.press-scale`

**color.primitive.pine.\***  ·  `color.primitive.pine.50` · `color.primitive.pine.100` · `color.primitive.pine.500` · `color.primitive.pine.600` · `color.primitive.pine.700` · `color.primitive.pine.800` · `color.primitive.pine.900`

**color.primitive.sage.\***  ·  `color.primitive.sage.100` · `color.primitive.sage.200` · `color.primitive.sage.400` · `color.primitive.sage.500` · `color.primitive.sage.600` · `color.primitive.sage.700` · `color.primitive.sage.800`

**color.primitive.moss.\***  ·  `color.primitive.moss.600`

**color.primitive.sand.\***  ·  `color.primitive.sand.50` · `color.primitive.sand.100` · `color.primitive.sand.200` · `color.primitive.sand.300` · `color.primitive.sand.400`

**color.primitive.taupe.\***  ·  `color.primitive.taupe.400` · `color.primitive.taupe.500` · `color.primitive.taupe.600` · `color.primitive.taupe.700`

**color.primitive.ink.\***  ·  `color.primitive.ink.700` · `color.primitive.ink.900`

**color.primitive.white.\***  ·  `color.primitive.white`

**color.primitive.green.\***  ·  `color.primitive.green.100` · `color.primitive.green.500` · `color.primitive.green.700`

**color.primitive.amber.\***  ·  `color.primitive.amber.100` · `color.primitive.amber.500` · `color.primitive.amber.700`

**color.primitive.red.\***  ·  `color.primitive.red.100` · `color.primitive.red.500` · `color.primitive.red.700`

**color.primitive.teal.\***  ·  `color.primitive.teal.100` · `color.primitive.teal.500` · `color.primitive.teal.700`

**color.primitive.terracotta-brand.\***  ·  `color.primitive.terracotta-brand.50` · `color.primitive.terracotta-brand.200` · `color.primitive.terracotta-brand.400` · `color.primitive.terracotta-brand.700` · `color.primitive.terracotta-brand.900`

**color.primitive.terracotta-accent.\***  ·  `color.primitive.terracotta-accent.50` · `color.primitive.terracotta-accent.200` · `color.primitive.terracotta-accent.400` · `color.primitive.terracotta-accent.700` · `color.primitive.terracotta-accent.900`

**color.primitive.terracotta-neutral.\***  ·  `color.primitive.terracotta-neutral.50` · `color.primitive.terracotta-neutral.100` · `color.primitive.terracotta-neutral.200` · `color.primitive.terracotta-neutral.300` · `color.primitive.terracotta-neutral.400` · `color.primitive.terracotta-neutral.600` · `color.primitive.terracotta-neutral.700` · `color.primitive.terracotta-neutral.800` · `color.primitive.terracotta-neutral.900`

**color.primitive.harbor-brand.\***  ·  `color.primitive.harbor-brand.50` · `color.primitive.harbor-brand.200` · `color.primitive.harbor-brand.400` · `color.primitive.harbor-brand.700` · `color.primitive.harbor-brand.900`

**color.primitive.harbor-accent.\***  ·  `color.primitive.harbor-accent.50` · `color.primitive.harbor-accent.200` · `color.primitive.harbor-accent.400` · `color.primitive.harbor-accent.700` · `color.primitive.harbor-accent.900`

**color.primitive.harbor-neutral.\***  ·  `color.primitive.harbor-neutral.50` · `color.primitive.harbor-neutral.100` · `color.primitive.harbor-neutral.200` · `color.primitive.harbor-neutral.300` · `color.primitive.harbor-neutral.400` · `color.primitive.harbor-neutral.600` · `color.primitive.harbor-neutral.700` · `color.primitive.harbor-neutral.800` · `color.primitive.harbor-neutral.900`

**color.primitive.dusk-brand.\***  ·  `color.primitive.dusk-brand.50` · `color.primitive.dusk-brand.200` · `color.primitive.dusk-brand.400` · `color.primitive.dusk-brand.700` · `color.primitive.dusk-brand.900`

**color.primitive.dusk-accent.\***  ·  `color.primitive.dusk-accent.50` · `color.primitive.dusk-accent.200` · `color.primitive.dusk-accent.400` · `color.primitive.dusk-accent.700` · `color.primitive.dusk-accent.900`

**color.primitive.dusk-neutral.\***  ·  `color.primitive.dusk-neutral.50` · `color.primitive.dusk-neutral.100` · `color.primitive.dusk-neutral.200` · `color.primitive.dusk-neutral.300` · `color.primitive.dusk-neutral.400` · `color.primitive.dusk-neutral.600` · `color.primitive.dusk-neutral.700` · `color.primitive.dusk-neutral.800` · `color.primitive.dusk-neutral.900`

**color.primitive.berry-brand.\***  ·  `color.primitive.berry-brand.50` · `color.primitive.berry-brand.200` · `color.primitive.berry-brand.400` · `color.primitive.berry-brand.700` · `color.primitive.berry-brand.900`

**color.primitive.berry-accent.\***  ·  `color.primitive.berry-accent.50` · `color.primitive.berry-accent.200` · `color.primitive.berry-accent.400` · `color.primitive.berry-accent.700` · `color.primitive.berry-accent.900`

**color.primitive.berry-neutral.\***  ·  `color.primitive.berry-neutral.50` · `color.primitive.berry-neutral.100` · `color.primitive.berry-neutral.200` · `color.primitive.berry-neutral.300` · `color.primitive.berry-neutral.400` · `color.primitive.berry-neutral.600` · `color.primitive.berry-neutral.700` · `color.primitive.berry-neutral.800` · `color.primitive.berry-neutral.900`

**color.primitive.clay.\***  ·  `color.primitive.clay.100` · `color.primitive.clay.500` · `color.primitive.clay.700`

**color.primitive.violet.\***  ·  `color.primitive.violet.100` · `color.primitive.violet.500` · `color.primitive.violet.700`

**color.primitive.gold.\***  ·  `color.primitive.gold.100` · `color.primitive.gold.500` · `color.primitive.gold.700`

**color.primitive.olive.\***  ·  `color.primitive.olive.100` · `color.primitive.olive.500` · `color.primitive.olive.700`

**color.primitive.jade.\***  ·  `color.primitive.jade.100` · `color.primitive.jade.500` · `color.primitive.jade.700`

**color.primitive.azure.\***  ·  `color.primitive.azure.500`

**color.primitive.magenta.\***  ·  `color.primitive.magenta.500`

**color.primitive.slate.\***  ·  `color.primitive.slate.100` · `color.primitive.slate.500` · `color.primitive.slate.700`

**radius.primitive.\***  ·  `radius.primitive.0` · `radius.primitive.1` · `radius.primitive.2` · `radius.primitive.3` · `radius.primitive.4` · `radius.primitive.5` · `radius.primitive.6` · `radius.primitive.full`

**radius.semantic.\***  ·  `radius.semantic.button` · `radius.semantic.chip` · `radius.semantic.badge` · `radius.semantic.switch` · `radius.semantic.input` · `radius.semantic.card` · `radius.semantic.tile` · `radius.semantic.sheet`

**color.semantic.action.\***  ·  `color.semantic.action.primary.default` · `color.semantic.action.primary.hover` · `color.semantic.action.primary.pressed` · `color.semantic.action.primary.on` · `color.semantic.action.primary.container` · `color.semantic.action.primary.on-container` · `color.semantic.action.secondary.default` · `color.semantic.action.secondary.solid` · `color.semantic.action.secondary.hover` · `color.semantic.action.secondary.on` · `color.semantic.action.secondary.container` · `color.semantic.action.secondary.on-container`

**color.semantic.surface.\***  ·  `color.semantic.surface.default` · `color.semantic.surface.container` · `color.semantic.surface.container-high` · `color.semantic.surface.bright`

**color.semantic.text.\***  ·  `color.semantic.text.default` · `color.semantic.text.body` · `color.semantic.text.variant` · `color.semantic.text.faint` · `color.semantic.text.accent` · `color.semantic.text.on-solid`

**color.semantic.border.\***  ·  `color.semantic.border.default` · `color.semantic.border.variant` · `color.semantic.border.strong`

**color.semantic.focus-ring.\***  ·  `color.semantic.focus-ring`

**color.semantic.status.\***  ·  `color.semantic.status.success` · `color.semantic.status.success-container` · `color.semantic.status.warning` · `color.semantic.status.warning-container` · `color.semantic.status.danger` · `color.semantic.status.danger-container` · `color.semantic.status.info` · `color.semantic.status.info-container` · `color.semantic.status.success-solid`

**color.semantic.domain.\***  ·  `color.semantic.domain.booking.upcoming.base` · `color.semantic.domain.booking.upcoming.container` · `color.semantic.domain.booking.upcoming.on` · `color.semantic.domain.booking.in-progress.base` · `color.semantic.domain.booking.in-progress.container` · `color.semantic.domain.booking.in-progress.on` · `color.semantic.domain.booking.completed.base` · `color.semantic.domain.booking.completed.container` · `color.semantic.domain.booking.completed.on` · `color.semantic.domain.booking.cancelled.base` · `color.semantic.domain.booking.cancelled.container` · `color.semantic.domain.booking.cancelled.on` · `color.semantic.domain.payment.paid.base` · `color.semantic.domain.payment.paid.container` · `color.semantic.domain.payment.paid.on` · `color.semantic.domain.payment.unpaid.base` · `color.semantic.domain.payment.unpaid.container` · `color.semantic.domain.payment.unpaid.on` · `color.semantic.domain.payment.partial.base` · `color.semantic.domain.payment.partial.container` · `color.semantic.domain.payment.partial.on` · `color.semantic.domain.payment.overridden.base` · `color.semantic.domain.payment.overridden.container` · `color.semantic.domain.payment.overridden.on` · `color.semantic.domain.service.boarding.base` · `color.semantic.domain.service.boarding.container` · `color.semantic.domain.service.boarding.on` · `color.semantic.domain.service.daycare.base` · `color.semantic.domain.service.daycare.container` · `color.semantic.domain.service.daycare.on` · `color.semantic.domain.service.walk.base` · `color.semantic.domain.service.walk.container` · `color.semantic.domain.service.walk.on` · `color.semantic.domain.service.sitting.base` · `color.semantic.domain.service.sitting.container` · `color.semantic.domain.service.sitting.on` · `color.semantic.domain.service.grooming.base` · `color.semantic.domain.service.grooming.container` · `color.semantic.domain.service.grooming.on` · `color.semantic.domain.service.training.base` · `color.semantic.domain.service.training.container` · `color.semantic.domain.service.training.on` · `color.semantic.domain.service.pickup.base` · `color.semantic.domain.service.pickup.container` · `color.semantic.domain.service.pickup.on` · `color.semantic.domain.service.meet-greet.base` · `color.semantic.domain.service.meet-greet.container` · `color.semantic.domain.service.meet-greet.on` · `color.semantic.domain.notification.info.base` · `color.semantic.domain.notification.info.container` · `color.semantic.domain.notification.info.on` · `color.semantic.domain.notification.success.base` · `color.semantic.domain.notification.success.container` · `color.semantic.domain.notification.success.on` · `color.semantic.domain.notification.warning.base` · `color.semantic.domain.notification.warning.container` · `color.semantic.domain.notification.warning.on` · `color.semantic.domain.notification.urgent.base` · `color.semantic.domain.notification.urgent.container` · `color.semantic.domain.notification.urgent.on` · `color.semantic.domain.capacity.available.base` · `color.semantic.domain.capacity.available.container` · `color.semantic.domain.capacity.limited.base` · `color.semantic.domain.capacity.limited.container` · `color.semantic.domain.capacity.full.base` · `color.semantic.domain.capacity.full.container` · `color.semantic.domain.risk.none.base` · `color.semantic.domain.risk.none.container` · `color.semantic.domain.risk.none.on` · `color.semantic.domain.risk.watch.base` · `color.semantic.domain.risk.watch.container` · `color.semantic.domain.risk.watch.on` · `color.semantic.domain.risk.high.base` · `color.semantic.domain.risk.high.container` · `color.semantic.domain.risk.high.on` · `color.semantic.domain.role.owner` · `color.semantic.domain.role.staff` · `color.semantic.domain.role.client` · `color.semantic.domain.pet.male` · `color.semantic.domain.pet.female` · `color.semantic.domain.pet.unknown`

**size.control.\***  ·  `size.control.xs` · `size.control.sm` · `size.control.md` · `size.control.lg`

**size.icon.\***  ·  `size.icon.xs` · `size.icon.sm` · `size.icon.md` · `size.icon.lg` · `size.icon.xl`

**size.avatar.\***  ·  `size.avatar.xs` · `size.avatar.sm` · `size.avatar.md` · `size.avatar.lg` · `size.avatar.xl`

**size.min-touch-target.\***  ·  `size.min-touch-target`

**size.stroke.\***  ·  `size.stroke.hairline` · `size.stroke.ring` · `size.stroke.focus`

**spacing.primitive.\***  ·  `spacing.primitive.0` · `spacing.primitive.1` · `spacing.primitive.2` · `spacing.primitive.3` · `spacing.primitive.4` · `spacing.primitive.5` · `spacing.primitive.6` · `spacing.primitive.8` · `spacing.primitive.10` · `spacing.primitive.12` · `spacing.primitive.16`

**spacing.semantic.\***  ·  `spacing.semantic.tight` · `spacing.semantic.snug` · `spacing.semantic.gutter` · `spacing.semantic.card-padding` · `spacing.semantic.section-gap` · `spacing.semantic.block-gap`

**color.brand.primary.\***  ·  `color.brand.primary` · `color.brand.primary` · `color.brand.primary` · `color.brand.primary` · `color.brand.primary`

**color.brand.primary-hover.\***  ·  `color.brand.primary-hover` · `color.brand.primary-hover` · `color.brand.primary-hover` · `color.brand.primary-hover` · `color.brand.primary-hover`

**color.brand.primary-pressed.\***  ·  `color.brand.primary-pressed` · `color.brand.primary-pressed` · `color.brand.primary-pressed` · `color.brand.primary-pressed` · `color.brand.primary-pressed`

**color.brand.on-primary.\***  ·  `color.brand.on-primary` · `color.brand.on-primary` · `color.brand.on-primary` · `color.brand.on-primary` · `color.brand.on-primary`

**color.brand.primary-container.\***  ·  `color.brand.primary-container` · `color.brand.primary-container` · `color.brand.primary-container` · `color.brand.primary-container` · `color.brand.primary-container`

**color.brand.on-primary-container.\***  ·  `color.brand.on-primary-container` · `color.brand.on-primary-container` · `color.brand.on-primary-container` · `color.brand.on-primary-container` · `color.brand.on-primary-container`

**color.brand.secondary.\***  ·  `color.brand.secondary` · `color.brand.secondary` · `color.brand.secondary` · `color.brand.secondary` · `color.brand.secondary`

**color.brand.secondary-solid.\***  ·  `color.brand.secondary-solid` · `color.brand.secondary-solid` · `color.brand.secondary-solid` · `color.brand.secondary-solid` · `color.brand.secondary-solid`

**color.brand.secondary-hover.\***  ·  `color.brand.secondary-hover` · `color.brand.secondary-hover` · `color.brand.secondary-hover` · `color.brand.secondary-hover` · `color.brand.secondary-hover`

**color.brand.on-secondary.\***  ·  `color.brand.on-secondary` · `color.brand.on-secondary` · `color.brand.on-secondary` · `color.brand.on-secondary` · `color.brand.on-secondary`

**color.brand.secondary-container.\***  ·  `color.brand.secondary-container` · `color.brand.secondary-container` · `color.brand.secondary-container` · `color.brand.secondary-container` · `color.brand.secondary-container`

**color.brand.on-secondary-container.\***  ·  `color.brand.on-secondary-container` · `color.brand.on-secondary-container` · `color.brand.on-secondary-container` · `color.brand.on-secondary-container` · `color.brand.on-secondary-container`

**color.brand.surface.\***  ·  `color.brand.surface` · `color.brand.surface` · `color.brand.surface` · `color.brand.surface` · `color.brand.surface`

**color.brand.surface-container.\***  ·  `color.brand.surface-container` · `color.brand.surface-container` · `color.brand.surface-container` · `color.brand.surface-container` · `color.brand.surface-container`

**color.brand.surface-container-high.\***  ·  `color.brand.surface-container-high` · `color.brand.surface-container-high` · `color.brand.surface-container-high` · `color.brand.surface-container-high` · `color.brand.surface-container-high`

**color.brand.on-surface.\***  ·  `color.brand.on-surface` · `color.brand.on-surface` · `color.brand.on-surface` · `color.brand.on-surface` · `color.brand.on-surface`

**color.brand.on-surface-body.\***  ·  `color.brand.on-surface-body` · `color.brand.on-surface-body` · `color.brand.on-surface-body` · `color.brand.on-surface-body` · `color.brand.on-surface-body`

**color.brand.on-surface-variant.\***  ·  `color.brand.on-surface-variant` · `color.brand.on-surface-variant` · `color.brand.on-surface-variant` · `color.brand.on-surface-variant` · `color.brand.on-surface-variant`

**color.brand.on-surface-accent.\***  ·  `color.brand.on-surface-accent` · `color.brand.on-surface-accent` · `color.brand.on-surface-accent` · `color.brand.on-surface-accent` · `color.brand.on-surface-accent`

**color.brand.outline.\***  ·  `color.brand.outline` · `color.brand.outline` · `color.brand.outline` · `color.brand.outline` · `color.brand.outline`

**color.brand.outline-variant.\***  ·  `color.brand.outline-variant` · `color.brand.outline-variant` · `color.brand.outline-variant` · `color.brand.outline-variant` · `color.brand.outline-variant`

**color.brand.outline-strong.\***  ·  `color.brand.outline-strong` · `color.brand.outline-strong` · `color.brand.outline-strong` · `color.brand.outline-strong` · `color.brand.outline-strong`

**color.brand.focus-ring.\***  ·  `color.brand.focus-ring` · `color.brand.focus-ring` · `color.brand.focus-ring` · `color.brand.focus-ring` · `color.brand.focus-ring`

**typography.semantic.\***  ·  `typography.semantic.font-family` · `typography.semantic.font-family` · `typography.semantic.font-family` · `typography.semantic.font-family` · `typography.semantic.font-family` · `typography.semantic.display` · `typography.semantic.headline` · `typography.semantic.title-lg` · `typography.semantic.title` · `typography.semantic.body-lg` · `typography.semantic.body` · `typography.semantic.body-sm` · `typography.semantic.label`

**typography.primitive.\***  ·  `typography.primitive.family.sans` · `typography.primitive.family.mono` · `typography.primitive.family.manrope` · `typography.primitive.family.nunito-sans` · `typography.primitive.family.source-serif` · `typography.primitive.family.lexend` · `typography.primitive.size.12` · `typography.primitive.size.13` · `typography.primitive.size.15` · `typography.primitive.size.17` · `typography.primitive.size.18` · `typography.primitive.size.22` · `typography.primitive.size.27` · `typography.primitive.size.34` · `typography.primitive.weight.regular` · `typography.primitive.weight.medium` · `typography.primitive.weight.semibold` · `typography.primitive.weight.bold` · `typography.primitive.weight.black` · `typography.primitive.line.display` · `typography.primitive.line.tight` · `typography.primitive.line.snug` · `typography.primitive.line.title` · `typography.primitive.line.body` · `typography.primitive.line.compact` · `typography.primitive.line.label` · `typography.primitive.tracking.tight` · `typography.primitive.tracking.snug` · `typography.primitive.tracking.normal` · `typography.primitive.tracking.label`


---

# Spec template (copy this shape for every component)

```markdown
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
- **Tokens:** color → `color.semantic.{action,surface,text,border,status,focus-ring}.*` + `color.semantic.domain.*`; radius → `radius.semantic.*`; spacing → `spacing.*`; type → `typography.semantic.*`; elevation → `elevation.semantic.*`; motion → `motion.semantic.*`
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
```
