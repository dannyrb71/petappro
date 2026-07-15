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

## Decision 3 — Light/Dark presets per theme (locked by Danny 2026-07-09: "Option A")

**Decision: each of the 5 themes ships a Light and a Dark preset — 10 fixed theme modes total.**
These are **preselected, set 24/7 per provider** — NOT dynamic, OS-, or time-of-day-driven.

### Model
- The `Themes` layer goes from 5 modes to **10**: `<Theme> · Light` / `<Theme> · Dark` (Sage & Sand · Light = Tier-1 base default).
- A provider is assigned exactly one mode; there is **no runtime light/dark toggle.** Chose the single-collection 10-mode approach over a Theme×Scheme matrix because it matches "pick one preset" and keeps components bound to one semantic layer.
- **Semantic role names/structure stay identical** (per Decision 1); each theme's **Dark** mode aliases that theme's *dark* neutral + tuned brand steps (dark `surface`, light `on-surface`, `primary` tuned for contrast on dark).
- **Components need zero changes** — they bind to `color.semantic.*`, which resolves through the active mode. Verified in Figma: the built Button/Badge reskin purely by switching the frame's Themes mode.
- **PetAppro platform brand** (`color.brand.*` / core-brand) stays theme- and tone-invariant — it identifies the platform, not the provider.
- **Domain tokens** (`color.semantic.domain.*`) stay theme-independent. **Open sub-question:** verify each `.container` tint reads AA on the *dark* surfaces (the Pixies dark mockups keep light-tint status pills — confirm contrast per dark mode).

### Reference
Danny's "Pixies Pet Care" mockups (Sage / Harbor / Berry × playful-light / dark) — representative sections: header, section headers, inner cards, status pills, book-a-service CTA, pet-pack cards, bottom nav.

### Next
Author the Dark mode for each theme in `tokens/themes/*` (dark neutrals + tuned brand steps + same paired font), lint-clean; then materialize the 10 modes in the Figma `Themes` variable collection. Prove on **Sage & Sand · Dark** first.

## Decision 4 — Theme × Scheme matrix (supersedes Decision 3 "Option A", Danny 2026-07-10)

**Decision: split theming into two independent Figma variable-collection axes — `Theme` (one mode per brand) × `Scheme` (Light / Dark).** Option A's single 10-mode collection was outgrown: 6 themes × light/dark = 12 > Figma's 10-mode cap, and the catalog is meant to grow (see add-on packs).

### Structure (Figma)
- **`Theme` collection** — one mode per theme (Brandy Blue · Sage & Sand · Terracotta · Harbor · Dusk · Berry). Holds every brand role twice: `light/<role>` and `dark/<role>`, aliasing primitives. Also `font-family` (per theme).
- **`Scheme` collection** — modes `Light` / `Dark`. One var per role that resolves `Light → Theme.light/<role>`, `Dark → Theme.dark/<role>`. `font-family` passes through.
- **`Color · Semantic`** aliases the `Scheme` vars → components bind to Semantic and resolve through **Scheme → Theme → primitive**. A frame sets **both** a Theme mode and a Scheme mode; defaults = **Brandy Blue + Light**. Verified: `atom/Button` reskins across Harbor · Dark and back with no component edits.
- Dark model = **Model 1 "light islands"** (Decision, 2026-07-10): brand-tinted dark canvas per theme, white/near-white holder cards kept from light, one-step-darker inner, brightened primary. New roles `surface.canvas` + `text.on-canvas`/`-variant` carry it (ADA on both surfaces).

### Product / code implications (for Cowork · George · Codex)
- **One picker, two axes:** the app shows a single theme picker; selecting an option sets both the Theme and the Scheme (e.g. "Brandy Blue · Dark"). Danny: "the picker is which mode then chooses which theme."
- **Code scales without the Figma cap:** each theme-scheme is a **token set** (`tokens/themes/<theme>[-dark].tokens.json`) — unlimited. **Add-on theme packs** (e.g. Holiday, Spring) are just new token sets; monetization (free vs paid) **TBD**. Figma only needs the core catalog (≤10 theme modes).
- **Tiering (product):** Tier 1 = Default (Brandy Blue) only · Tier 2 = choose from 3 themes (each light/dark) · Top tier = all · packs layer on top. This is a product/entitlement decision to formalize with Cowork.

## What I've done now (CSS mirror)
- `fonts.css` loads Nunito Sans, Lexend, Manrope, Source Serif 4 (+ base Hanken Grotesk, Space Mono).
- `themes.css` sets `--sys-type-family-brand` per theme: Terracotta→Nunito Sans, Harbor→Lexend, Dusk→Manrope, Berry→Source Serif 4, Sage & Sand→Hanken Grotesk.

## Next on confirmation
On a thumbs-up to Decision 1, I'll author all 5 `tokens/themes/*.tokens.json` in the hue-scale
shape above (tuned scales + tuned semantic step mapping + paired `font-family`), lint-clean,
replacing the interim role-named primitives.
