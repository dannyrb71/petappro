# Theming — authoring decisions (Claude Design → Codex/Danny)

Response to `CLAUDE-DESIGN-HANDOFF.md` §4. Source of truth is `tokens/` DTCG JSON.

## Decision 1 — theme color primitive shape

**Decision: per-theme, HUE-NAMED tuned scale families as primitives — not role-named.**
Semantic roles are then tuned *per theme* and alias the appropriate step.

### Why
- **Primitives must stay "palette," not "role."** `color.primitive.theme.terracotta.primary` bakes a role into a primitive — the exact smell the primitive/semantic split exists to prevent. Hue names (`camel`, `clay`, `greige`) keep primitives raw and reusable.
- **Consistency with the base.** The base already ships hue-scale families (`pine`, `sage`, `sand`). Every theme should mirror that shape so the mental model — and the linter — is identical everywhere.
- **White-label needs derivable scales.** Top-tier providers upload a brand color; tooling can ramp a full hue scale from it and drop it in. Role-named interim tokens give no intermediate steps to derive `hover`/`pressed`/`container` from — a tuned scale does.

### The rule that makes it robust
Brand hues differ in lightness (base `pine` is a *dark* primary at step 700; `camel` is a *mid* primary). So **do not force an identical step-number contract across themes.** Instead:
- Each theme provides a tuned scale per brand hue (≈ steps 50/100/500/600/700/800/900).
- Each theme's **semantic roles alias whichever step reads correctly for that hue** — e.g. `primary.default` = `pine.700` in base but `camel.700` may be tuned so 700 *is* the intended default; `primary.hover`/`pressed` step toward the darker end.
- Semantic **role names and structure stay identical** across all themes; only the primitive values + which step each role picks are theme-specific.

### Structure (one file per theme)
```
tokens/themes/terracotta.tokens.json
{
  "color": {
    "primitive": {                     // theme's own hue families (raw literals)
      "camel":  { "50": …, "100": …, "500": …, "600": …, "700": "#C08B6E", "800": …, "900": "#8A5E48" },
      "clay":   { … },                 // secondary/accent hue
      "greige": { "50": "#F3F1EC", "100": "#F1ECE6", "200": "#E9E2D9", "300": "#E0D8CF", "400": "#CFC4B8" }
    },
    "semantic": {                      // SAME role names as base; alias THIS theme's hues
      "primary":   { "default": "{color.primitive.camel.700}", "hover": "{color.primitive.camel.800}", … },
      "surface":   { "default": "{color.primitive.greige.50}", … },
      "on-surface":{ "default": "{color.primitive.greige.900}", … }
    }
  },
  "typography": { "semantic": { "font-family": "Nunito Sans" } }
}
```
- `color.domain.*` (booking/payment/service/…) stays theme-independent in base `color.tokens.json` — themes never touch it.
- Retire the interim `color.primitive.theme.<name>.*` and the unused loose `clay/olive/jade/gold/azure/violet/magenta` (those were *domain* hues and already live under base primitives feeding `color.domain.*` — keep them there; don't duplicate into themes).

## Decision 2 — component-token layer (`--comp-*`)
**Agreed: defer.** Do NOT port `--comp-*` into DTCG yet. Author it alongside the first atoms
(Button, Input, Card) so each component hook is created against a real spec, not speculatively.

## What I've done now (CSS mirror)
- `fonts.css` loads Nunito Sans, Lexend, Manrope, Source Serif 4 (+ base Hanken Grotesk, Space Mono).
- `themes.css` sets `--sys-type-family-brand` per theme: Terracotta→Nunito Sans, Harbor→Lexend, Dusk→Manrope, Berry→Source Serif 4, Sage & Sand→Hanken Grotesk.

## Next on confirmation
On a thumbs-up to Decision 1, I'll author all 5 `tokens/themes/*.tokens.json` in the hue-scale
shape above (tuned scales + tuned semantic step mapping + paired `font-family`), lint-clean,
replacing the interim role-named primitives.
