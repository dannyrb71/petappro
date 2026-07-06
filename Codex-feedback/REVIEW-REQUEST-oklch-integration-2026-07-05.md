# Review Request — OKLCH primitive integration + hover→pressed (2026-07-05)

**For:** Codex (review-only). **Author of changes:** Claude (Cowork). **Status:** uncommitted, NOT pushed. Danny approves + pushes.

## What happened (context)
Claude Design rebuilt the color primitives as even OKLCH tonal scales (fixing the old near-black
clustering and the backwards numbering). Delivered as `Color · Primitives · Complete` — a **flat family
map** in the new DTCG object-color format (`{colorSpace, components, hex}`), standard numbering
(**50 = lightest → 900 = darkest**), with `core-brand` + `core-accent` (deep teal + leaf green) added
and all prior families preserved (superset).

Because the fix moves each brand color to its true lightness step, the theme aliases had to be
repointed, and — per Danny — hover was dropped (mobile has no hover; tap/press/mouse-down only).

## Changes by file

**`tokens/primitives/color.tokens.json`** — replaced. Converted the delivered object-format map to our
hex-string DTCG (`"$value":"#hex","$type":"color"`), nested under `color.primitive`. Raw delivery
sidelined as `primitives/Color-Primitives-Complete.source.json` (no `.tokens` suffix → linter skips).
33 families, 201 primitive leaves.

**`tokens/themes/*.tokens.json` (all 5)** — brand/accent aliases repointed to true steps:

| Theme | primary | pressed | secondary | secondary-solid | on-surface-accent |
|---|---|---|---|---|---|
| Sage & Sand | pine 800 | pine 900 | sage 500 | sage 600 | sage 700 |
| Terracotta | t-brand **600** | 700 | t-accent 500 | 600 | 700 |
| Harbor | h-brand 800 | 900 | h-accent 400 | 500 | 600 |
| Dusk | d-brand 700 | 800 | d-accent 400 | 500 | 600 |
| Berry | b-brand 700 | 800 | b-accent 500 | 600 | 700 |

container = 50, on-container = 900 (both brand + accent). Removed `primary-hover` + `secondary-hover`
from every theme. Surface/outline/neutral/focus-ring untouched (Danny: neutrals + semantics stay).

**`tokens/semantic/color.tokens.json`** — removed `action.primary.hover` + `action.secondary.hover`
(aliased the now-deleted brand-hover roles). Kept `action.primary.pressed`. Repointed
`domain.role.owner` pine.700 → **pine.800** (the family rebuild lightened pine.700 #1F4E44→#296155;
bumped to keep the owner identity deep). `domain.role.staff` (sage.600) left as-is (negligible shift).

**Specs (hover→pressed prose pass):** `atoms/button.md` (5 edits), `patterns/list-row.md`,
`domain/booking-card.md`, `domain/report-card.md`, `_TEMPLATE.md`. All "hover" language swapped to
"pressed". No token-ref changes that affect resolution.

## Decisions (Danny-approved)
- **Terracotta primary → 600** (`#946043`), not the natural main 400 — 400 fails AA with white text
  (~2.8:1); 600 passes (~5.2:1). 400 stays the terracotta brand hue for accents/containers.
- **Core = reserved primitives only** (brand/logo use) — no theme file created.
- **Hover dropped** system-wide; pressed is the mobile interaction state.

## Please review
1. **Coherence** of the repointed steps — do primary/pressed/container/on-container read correctly per
   theme against the new ramps?
2. **AA on light accents:** Harbor/Dusk accent mains are 400 (light). A *filled* accent element with
   white text would fail AA. Proposed rule (pending Danny's final ok): **solid accent fill + white text
   → use `secondary-solid`; tonal accent → `container` + `on-surface-accent`.** Should this be codified
   in the button/pill/badge specs now?
3. **Spec version bumps** — the 6 edited specs are v0.1.0/approved. Do they need a version-history entry
   / return to in-review, or is the prose swap a patch?
4. **`domain.role.owner` → pine.800** — agree, or prefer 700/900?

## Verification
```
node design-system/tools/lint-tokens.mjs  → ✓ tokens clean — 538 tokens across 14 files, 0 violations
node design-system/tools/lint-specs.mjs   → ✓ specs clean — 0 errors
```

## Not done yet (out of scope for this review)
- **Figma variables** not yet rebuilt to match (add core + full ramps, renumber, repoint Themes modes,
  drop hover) — starts after this review + the #2 rule is confirmed.
- **`specs/CLAUDE-DESIGN-CONTEXT.md`** (the Claude Design upload pack) is now stale (lists hover tokens,
  lacks core, old numbering) — needs a full regen from live tokens, not a piecemeal patch. Flagged.
