# PetAppro Design System — Changelog

System-level changelog. Version bumps are decided at governance review, not ad hoc.
Per-component changes live in each component's record under `records/`.

Format: system version · date · summary. Newest first.

## Unreleased
- Established governance operating model (`GOVERNANCE.md`), spec/record templates, and the token linter.
- **Foundation tokens imported from Claude Design** (v0.3 deliverable) as DTCG source in `tokens/`:
  color (primitive · semantic · domain), typography, spacing, radius, elevation, motion —
  **247 tokens, lint-clean** (1 declared exception: focus-ring). Domain layer already in JSON.
- Linter upgraded to understand DTCG **composite tokens** (typography/shadow) — fields aliased per-leaf.
- Adopted Claude Design's richer `specs/_TEMPLATE.md` (Figma + RN fields); added `tokens/README.md`
  and `docs/theming-and-tiers.md` (5-theme white-label model).
- Staged the browsable reference bundle under `site/` (CSS mirror + HTML previews) — marked non-source.
- **Themes ported to DTCG modes.** 4 alternate theme modes in `tokens/themes/` (terracotta, harbor,
  dusk, berry; sage-sand = base default), each a color mode + paired font. Interim: role-named
  per-theme primitives, pending hue-scale reconciliation. **435 tokens, lint-clean.**
- **Tier model + Tier 2 pairings locked** (Danny-approved): Tier 1 = Sage & Sand + Hanken Grotesk;
  Tier 2 = 1 of 5 color+font presets — Terracotta/Nunito Sans · Harbor/Lexend · Dusk/Manrope ·
  Berry/Source Serif 4; Top tier = mix/match + own logo. Lockup "[Client] by PetAppro" for Tier 1&2.
- **Still pending:** `--comp-*` component-token layer (CSS-only) → port when building the first atoms.
- **Restructured color into the 4-tier model** (`docs/token-architecture.md`): `tokens/primitives/`
  (raw hue-scales incl. clean per-theme families) → `tokens/themes/*` (brand tier, one file = one mode)
  → `tokens/semantic/` (brand-agnostic: action/surface/text/border/status). Retired the interim
  role-named theme primitives and the monolithic `color.tokens.json`. Linter now recurses tiers and
  treats `brand` as must-alias. **360 tokens, lint-clean.** Chosen to serve the north star (adaptable
  multi-brand; add a brand = one new Themes mode, components untouched). Per-theme primitive
  names/tones proposed — Claude Design to bless (Decision 1).
- **Domain layer restored** (regression from the restructure): `color.semantic.domain.*` (booking,
  payment, service, notification, capacity, risk, role, pet) + its category-color primitives
  (`slate`, `clay`, `violet`, `gold`, `olive`, `jade`, `azure`, `magenta`). **455 tokens, lint-clean.**
- **Component specs v0.4 merged** (Claude Design): 23 contracts in `specs/` (8 atoms · 5 patterns ·
  10 domain) + `specs/README.md` + `docs/theming-decision.md`. Token names reconciled old→4-tier;
  all refs resolve except 2 flagged build-time additions: `color.semantic.success-solid` (=green.700)
  and `comp.button.*` (Tier-4 component layer). Pending: Codex review → Danny approval → templates.

### 2026-07-09 — PetAppro base brand → "Brandy Blue" default theme (Design System authority chat)
- **Base brand adopted as the DEFAULT theme, "Brandy Blue"** (Danny 2026-07-09). Supersedes the earlier "Tier 1 = Sage & Sand" default lock — **Sage & Sand demoted to an alternate theme.** Paired with **Poppins**.
- **Dog-centric palette names** (Danny, named for favorite dogs): the five brand bands are **Brandy Blue** (primary), **Camo Green** (secondary/success), **Coco Coral** (tertiary/danger), **Bella Sky** (accent/info — "Sky" not "Blue", to avoid colliding with Brandy Blue), **Maverick Grey** (neutral — a husky-grey). Primitive slugs: `brandy-blue`, `camo`, `coco`, `bella`, `maverick` (renamed from `core-brand`/`core-accent`/`coral`/`sky`/`slate`); all aliases updated across themes + semantic + `CLAUDE-DESIGN-CONTEXT.md`.
- **Primitives (tokens lane):** used Danny's **exact brand bands** (he confirmed the raw ramps read best for the brand — no OKLCH re-normalization) with a synthesized `50` tint each. `brandy-blue` + `clover` retuned to official values; `brindle` extended to full 50–900 (was 100/500/700); **added** `fawn` + `merle` 50–900.
- **Themes (tokens lane):** added `themes/brandy-blue.tokens.json` (Light · default) + `themes/brandy-blue-dark.tokens.json` (Dark · Option A). Light primary = `brandy-blue.600` (`#006073`, mid-range per Danny); dark primary = `brandy-blue.500`. Surfaces on Brindle Grey.
- **Semantic status re-pointed to brand ramps** (Danny's role guide): `success`→camo, `danger`→coco, `info`→bella; `warning` stays amber. Theme-invariant; affects all themes. `domain.*` categorical colors untouched.
- **Platform identity auto-updates:** `semantic.brand.*` already aliased the platform brand/accent ramps, so the "[Client] by PetAppro" identity now reflects Brandy Blue / Clover with no structural change.
- **Typography:** added `typography.primitive.family.poppins`.
- **Design language captured** from Danny's preferred "5a Petappro" mock: Poppins weight ladder, 22px cards, 999px pill CTA, teal-tinted shadows + 1px inset border. Preview: `docs/brandy-blue-preview.html`.
- **Lint:** `lint-tokens.mjs` → **617 tokens, 0 violations.**
- **Figma Variables synced** (file `F0BqeqhhMcTpJwaNCWfeEH`): renamed primitives `core-brand→brandy-blue`, `core-accent→camo`, `slate→maverick` (IDs preserved → existing aliases intact); added full `coco` + `bella` ramps + missing `maverick` steps; added `family/poppins`; re-pointed semantic `status` success/danger/info → camo/coco/bella. **Themes collection default mode is now `Brandy Blue · Light`** (+ `Brandy Blue · Dark`); existing themes renamed to `· Light`, Sage & Sand preserved as `Sage & Sand · Light`. Verified: `atom/Button` reskins to Brandy Blue automatically (no component edits).
- **For Codex/governance:** status re-point + Brandy-Blue-as-default + primitive renames supersede prior locks — needs review.

### 2026-07-09 — Figma build + light/dark (Design System authority chat)
- **Figma component build started.** Building the approved specs as real, token-bound components in the PetAppro Figma file (`05 Components` page): all color/size/space bound to Variables (no literals), auto-layout + Hug/Fill, variant-driven, states-as-variants. `atom/Button` + `atom/Badge` (pill shell) in progress.
- **Light/Dark presets locked** (Danny — "Option A"; see `docs/theming-decision.md` Decision 3). Each of the 5 themes gains a **Dark** preset → **10 fixed theme modes** (`<Theme> · Light/Dark`), **preselected per provider, not dynamic/OS/time-of-day.** Sage & Sand · Light = base default. Components bind to semantic tokens → auto-adapt (verified: built components reskin on mode switch). **Tokens action:** author a Dark mode per theme in `tokens/themes/*`; verify domain `.container` tints read AA on dark surfaces.
- **Press interaction model → shared `elevation.semantic.raised`.** Pressed state on Button + List Row now adds the same soft raise that Booking Card / Report Card already used (mobile = fill shift + raise, no hover). Specs bumped: `atoms/button.md` **v0.1.2**, `patterns/list-row.md` **v0.1.2**.
- **Elevation materialized in Figma.** `elevation.semantic.{card,raised,modal,nav}` created as Figma effect styles from `tokens/elevation.tokens.json` (warm-ink values). `raised` drives the press treatment.
- **Button label** = `typography.semantic.body` @ **bold**, sentence case, themed `font-family` (Figma "Button" text style, size 15) — conforms to `atoms/button.md`.
- **Open token gap:** no `pressed` tokens for `secondary`/`destructive`/`success` button fills — decide: add `action.*.pressed` / `status.danger-pressed`, or rely on elevation + fill-shift for those. Flagged for governance.

<!--
## 0.1.0 — YYYY-MM-DD
- First foundations set (color, type, spacing) committed and linted clean.
-->
