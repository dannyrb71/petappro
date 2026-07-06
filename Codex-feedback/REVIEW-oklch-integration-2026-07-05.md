# OKLCH Primitive Integration Review - 2026-07-05

Reviewer: Codex  
Author of changes: Claude  
Scope: `design-system/tokens/primitives/color.tokens.json`, `design-system/tokens/themes/*.tokens.json`, `design-system/tokens/semantic/color.tokens.json`, and hover-to-pressed edits in `design-system/specs/`.

Verdict: **CHANGES-NEEDED**

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

## Findings

### Blocker - `Introduced-in-revision` - Harbor/Dusk `secondary-solid` does not satisfy the proposed AA rule

Locations:
- `design-system/tokens/themes/harbor.tokens.json:24` sets `color.brand.secondary-solid` to `{color.primitive.harbor-accent.500}`.
- `design-system/tokens/themes/dusk.tokens.json:24` sets `color.brand.secondary-solid` to `{color.primitive.dusk-accent.500}`.
- `design-system/tokens/semantic/color.tokens.json:28` exposes that role as `color.semantic.action.secondary.solid`, paired with `color.semantic.action.secondary.on` at line 31.

The proposed rule is sound in shape: solid accent fill + white text should use `secondary-solid`, while tonal accent should use container + accent/on-container text. But the current Harbor and Dusk aliases do not yet make that true.

Contrast results:

| Theme | Current solid | Pair | Contrast |
|---|---:|---|---:|
| Harbor | `harbor-accent.500` `#22A256` | white / `on-secondary` | **3.30:1 fail** |
| Dusk | `dusk-accent.500` `#B07E22` | white / `on-secondary` | **3.59:1 fail** |

Concrete fix:
- Repoint Harbor `secondary-solid` to at least `harbor-accent.600` (`4.74:1` on white). If Danny wants a more comfortable buffer, use `harbor-accent.700` (`6.94:1`).
- Repoint Dusk `secondary-solid` to `dusk-accent.600` (`5.14:1` on white).
- Do this before codifying the rule in specs or rebuilding Figma variables.

### Blocker - `Introduced-in-revision` - Harbor tonal accent text also misses AA if the rule uses `on-surface-accent`

Location: `design-system/tokens/themes/harbor.tokens.json:30` and `design-system/tokens/themes/harbor.tokens.json:54`

Harbor currently pairs `secondary-container` `{color.primitive.harbor-accent.50}` with `on-surface-accent` `{color.primitive.harbor-accent.600}` under the proposed tonal rule. That pair is **4.33:1**, below the 4.5:1 AA threshold.

Concrete fix:
- Either repoint Harbor `on-surface-accent` to `harbor-accent.700` (`6.34:1` on `harbor-accent.50`), or codify tonal accent text as `color.semantic.action.secondary.on-container`, which already resolves to `harbor-accent.900`.
- I slightly prefer `on-surface-accent -> harbor-accent.700` for Harbor so the "tonal accent -> container + on-surface-accent" rule remains consistent across themes.

### Should-fix - `Follow-on-from-fix` - Codify the light-accent rule, but only after the token aliases are corrected

Relevant locations:
- `design-system/specs/atoms/button.md:13`
- `design-system/specs/atoms/service-pill.md:13`
- `design-system/specs/atoms/status-badge.md:13`

Recommendation:
- Codify the rule now, but after fixing the Harbor/Dusk aliases above.
- Put the general rule in token/theming documentation or `design-system/specs/AUTHORING-GUIDE.md`: a light accent's visible default may be 400/500, but any solid fill with white text must use the AA-safe solid role.
- In `Button`, only add this to the spec if `secondary-solid` becomes an actual supported button variant. The current `secondary` button is an outline/surface variant, so adding an unsupported variant would muddy the API.
- Do not force the brand accent rule into `Service Pill` or `Status Badge` unless those specs start consuming brand/action accent tokens. Today they are domain-token components, and keeping them domain-specific is cleaner.

### Should-fix - `Follow-on-from-fix` - Approved specs need a patch version-history entry for hover-to-pressed

Locations:
- `design-system/specs/atoms/button.md:43`
- `design-system/specs/patterns/list-row.md:33`
- `design-system/specs/domain/booking-card.md:36`
- `design-system/specs/domain/report-card.md:33`
- `design-system/specs/_TEMPLATE.md:43`

The prose swap is directionally correct and does not need the specs to return to full `in-review` if Danny already approved dropping hover. But it does change the approved interaction contract from hover-inclusive to pressed-only, so it should be recorded as a patch, not silently folded into the initial `0.1.0` row.

Concrete fix:
- Add a `0.1.1 | 2026-07-05 | Replace hover state language with pressed-only mobile interaction model.` entry to each approved touched spec.
- For `_TEMPLATE.md`, update the template row or add a template note so future specs inherit pressed-only language.

### Nit - `Nit` - Stale Claude Design context still references deleted hover tokens

Locations:
- `design-system/specs/CLAUDE-DESIGN-CONTEXT.md:147`
- `design-system/specs/CLAUDE-DESIGN-CONTEXT.md:177`
- `design-system/specs/CLAUDE-DESIGN-CONTEXT.md:191`
- `design-system/specs/CLAUDE-DESIGN-CONTEXT.md:249`

This was already flagged as out-of-scope in the review request, so it is not blocking this source review. Keep it blocked from Claude Design upload until it is regenerated from live tokens; otherwise it can reintroduce hover names into the Figma-side workflow.

## Direct Answers To The Four Review Questions

1. Repointed primary/pressed/container/on-container steps are coherent. Primary and pressed are all AA with white text, pressed is consistently deeper, and 50/900 container pairs land around 12.45:1 to 12.91:1.
2. The light-accent rule is good governance, but current Harbor/Dusk aliases do not satisfy it yet. Fix the aliases first, then codify the rule.
3. The edited approved specs do not need a full return to `in-review` if Danny already approved the hover removal, but they do need patch version-history entries.
4. Agree with `domain.role.owner -> pine.800` at `design-system/tokens/semantic/color.tokens.json:476`. Pine 700 is AA but reads less authoritative after the rebuild; pine 900 is unnecessarily heavy. Pine 800 is the right middle.

## Standing Review Questions

- Visually consistent? Mostly yes. The primary ramps now read coherently across themes. Harbor/Dusk accent solids need the AA-safe step corrections.
- Accessible? Not yet. The Harbor and Dusk secondary solid pairings fail AA with white text, and Harbor tonal accent with `on-surface-accent` also fails.
- Avoids unnecessary complexity? Yes. The primitive rebuild and alias repointing preserve the tier model; do not add component variants just to document a token rule.
- Glad in 6 months? Yes after the contrast fixes and version-history entries. The OKLCH ramp model is a better foundation than the old clustered primitives.

## Review Learning

- What did I or the last pass miss, and why? The mechanical gates passed, but they do not evaluate token pair contrast across theme modes. A semantically named alias can resolve cleanly and still fail the intended `fill + on-*` accessibility contract.
- New rule added to lint-specs.mjs or rubric: add a rubric/checklist item for theme-mode contrast pairs after alias repointing: every semantic `*.solid` + `*.on` pair and every `*.container` + intended text pair must be contrast-checked per theme, not just token-resolved.
