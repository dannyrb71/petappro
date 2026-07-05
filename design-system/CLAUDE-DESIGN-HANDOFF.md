# Handoff to Claude Design — theming locked (2026-07-04)

Give this to Claude Design so its work matches what's now committed in the repo. Source of truth is
`design-system/tokens/` (DTCG JSON); the CSS in `site/` is a preview mirror only.

## 1. Tier model — LOCKED (Danny approved)
- **Tier 1 (lowest):** Sage & Sand palette + **Hanken Grotesk**. Fixed, no customization.
- **Tier 2 (pseudo white-label):** pick **one of 5 presets** — each a fixed **color + font** pairing (below). No mixing.
- **Top tier (full white-label):** mix & match any font + palette, **upload own logo**.
- **Logo lockup:** Tier 1 & 2 use the PetAppro logo as **"[Client name] by PetAppro."** Top tier = client's own logo.

## 2. Tier 2 preset pairings — LOCKED
| Style | Palette | Font |
|---|---|---|
| Sage & Sand | `sage-sand` (base/default) | Hanken Grotesk |
| Terracotta | `terracotta` | Nunito Sans |
| Harbor | `harbor` | **Lexend** |
| Dusk | `dusk` | **Manrope** |
| Berry | `berry` | Source Serif 4 |

All Google Fonts (SIL OFL), bundle-safe for iOS + Android. (Rejected: Work Sans, Questrial — single weight, no bold; Montserrat — too close to Manrope.)

## 3. Please update on your side (CSS mirror + Figma)
- **Fonts:** the JSON now pairs Harbor→Lexend and Dusk→Manrope. Update `themes.css` / `fonts.css` so the
  mirror loads and applies **Nunito Sans, Lexend, Manrope, Source Serif 4** per theme (drop Work Sans/Questrial).
- Each theme mode file (`tokens/themes/*.tokens.json`) already carries its `typography.semantic.font-family`.

## 4. Design decisions we still need from you (authoring)
1. **Reconcile theme color primitives.** The 4 alternate themes currently use **role-named per-theme
   primitives** (`color.primitive.theme.<name>.*`) ported verbatim from your tuned `themes.css`. Your
   incomplete 3-step `clay`/`olive`/`jade`/`gold`/`azure`/`violet`/`magenta` families are unused. Decide the
   intended shape: full tuned **hue-scale** families (like the base uses `pine`/`sage`) vs the role-named
   interim. See `docs/theming-and-tiers.md`.
2. **Component-token layer (`--comp-*`).** Still CSS-only. We'll port it into DTCG **when building the first
   atoms** (Button, Input, Card) so it's authored against real component specs — not before.

## 5. Everything must stay lint-clean
Run `node design-system/tools/lint-tokens.mjs` before handing tokens back. Semantic/domain = aliases only;
primitives = literals; declared exceptions via `$extensions.ds.allowLiteral`.
