# PetAppro Design System — Changelog

System-level changelog. Version bumps are decided at governance review, not ad hoc.
Per-component changes live in each component's record under `records/`.

Format: system version · date · summary. Newest first.

## Unreleased
- **Card system defined (2026-07-11)** from a full scrub of the live Woof client + staff app.
  8 card families on a shared "Record card" base (`docs/naming-conventions.md` §9); new shared pieces
  (Pagination Dots, Carousel, In-Out dual-check, Payment Summary). Locked rules: **payment labeling**
  ("This booking" vs "Total balance · N bookings"; Amount Due / Past Due / Paid / Partial), **client
  booking carousel** (paginated dots, no arrows, one card = one booking), **IN/OUT dual checkbox** for
  same-day (In/Out labels), **info (i) trails the amount**, **cancelled shows cancelled dates**,
  **gender tint + fallback-glyph tint**. Low-fi catalog on Figma page 09 → "10 · Card Catalog".
- **`domain/pet/*` → `domain/gender/*`** semantic tokens (male azure · female **coral `#D95C77`** new
  primitive · unknown taupe); avatar-ring + name-tint. Specs updated. **770 tokens, lint-clean.**
  (Figma variables for `domain/gender/*` still need syncing.)
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

### 2026-07-10 (overnight) — Naming convention, type-scale fix, atoms→organisms build (Design System authority chat)
- **Naming convention** authored (`docs/naming-conventions.md`) + applied: icons `icon/<name>` (renamed from `icon/icon-*`); components = atomic-layer folders + PascalCase; multi-variant = one variant set; pages/§sections; scratch → `99 Sandbox`.
- **Type scale corrected** (was oversized): Display 28 · Headline 24 · Title Large 20 · Title 16 · Body Large 15 · Body 13 · Body Small 11 · Label 12; line-heights set as % from tokens. **All component text now uses the text styles** (theme-aware font via Scheme.font-family; scale in one place) — 36 nodes retrofitted. Tokens lint-clean (767).
- **Icons — 33 `icon/*` components** (token-bound fill, 24×24, proportions locked): 10 service (custom boarding + walking, Phosphor-fill rest) + 23 UI (carets, close, plus, check, calendar, clock, info, bell, search, edit, phone, user, more, trash, settings, camera, map-pin, chat, warning, check-circle).
- **Atoms built:** Button, Status Badge, Service Pill, **Input** (4 states), Textarea, Select, Checkbox, Radio, Switch, Avatar (3 sizes), Money, Link, Divider, Count Badge, Icon Button, Image — all token-bound.
- **Molecules:** Section Header, Field Group, Price Row, List Row, Collapsible Header, Announcement Banner.
- **Organisms:** Booking Card (composes Service Pill + Status Badges + Money + detail rows), Stat Card.
- **Completed same session:** Service Pill icons placed (per-variant); **Date/Time fields**; organisms **Form, Modal, Activity Row, Fee Breakdown**; **component properties** across the library (TEXT / BOOLEAN show-hide / INSTANCE_SWAP icon — prototype-ready, matching Danny's form-field work); icon inner-frames set to Center/Scale constraints; page reorganized into **10 category Sections** (auto-layout grid clusters) stacked in atomic order; **ADA dark-CTA fix** — dark `primary`/`primary-pressed`/`secondary` lightened to the 300/400 band across all 6 themes; **badge text → Label Small (10px)** new style; **code syntax** (`var(--pa-*)` + Android) set on 228 consumed tokens. Naming convention = **functional** (Danny-locked). Tokens lint-clean (769).
- **Still open:** **Code Connect** (needs `packages/ui` RN components to exist); sync Figma size vars to new scale; publish the library (enables INSTANCE_SWAP defaults by key).

### 2026-07-10 — Theme × Scheme matrix (Figma re-architecture) (Design System authority chat)
- **Themes restructured into a two-axis matrix** (Danny "Option B"; supersedes Decision 3 single-collection — hit Figma's 10-mode cap at 6 themes × light/dark). New Figma collections: **`Theme`** (6 modes, one per brand; holds `light/<role>`+`dark/<role>`+`font-family`) × **`Scheme`** (Light/Dark, resolves light↔dark). `Color · Semantic` repointed to alias `Scheme`; text styles' font-family rebound to `Scheme.font-family`; **old single Themes collection deleted.** Default = Brandy Blue + Light. **Verified:** Button reskins across Harbor · Dark and back with no edits; a `Theme Preview` frame flips correctly.
- **All 6 themes now have light + dark** (5 dark theme token files authored on the light-islands model; brand-tinted dark canvas per theme). `tokens` → **766, 0 violations.**
- **Binding rule (important):** page/screen backgrounds must bind **`surface/canvas`** (flips light-grey↔brand-dark); `surface/default` = white holder (stays white both schemes, by design); inner = `surface/container`; page text = `text/on-canvas`. Frames bound to `surface/default` for their bg won't flip in dark.
- **Product/code (for Cowork/George/Codex):** one picker sets both axes; each theme-scheme = a token set (unlimited in code); add-on packs (Holiday/Spring, free-or-paid TBD); tiering Tier1=default·Tier2=3·Top=all. See `docs/theming-decision.md` Decision 4.

### 2026-07-10 — Dark-mode surface model ("light islands") (Design System authority chat)
- **New surface architecture** for proper light+dark. Added three roles: **`surface.canvas`** (page backdrop), kept **`surface.default`** as the white holder card, **`surface.container`** as the nested/inner card; added **`text.on-canvas`** + **`text.on-canvas-variant`** so text stays ADA-compliant on *both* the dark canvas and the light cards (a single on-surface can't). `tokens` → **641, 0 violations.**
- **Model 1 "light islands"** (Danny-approved): dark mode = **brand-tinted dark canvas** (Brandy Blue → dark teal `#002C38`) with **white holder cards in both modes** (holder is its own role, not the light page surface — so it separates on grey *and* on dark). Inner cards one step darker (`maverick.100`). Verified in Figma: Light canvas `#F4F7F8`/holder `#FFFFFF`; Dark canvas `#002C38`/holder `#FFFFFF`/primary `#32A8B5`.
- **Canvas is brand-tinted per theme** (Danny: "same concept for each theme") — each theme's dark canvas = its own darkened brand color.
- **Figma synced:** added `canvas`/`on-canvas`/`on-canvas-variant` theme vars (seeded per mode) + semantic `surface/canvas`, `text/on-canvas`, `text/on-canvas-variant`; rewrote Brandy Blue Light (white holder) + Dark (Model 1) modes.
- **Tags = domain tokens:** confirmed service/status/payment tags get unique backgrounds from the existing `domain.*` layer (Woof-referenced). **Open (to tune in Figma):** type scale is a bit large, pill contrast, drop the left-border-on-rounded treatment, glance-vs-tap disclosure. Dark modes for the other 4 themes: to author on this model. `Your Pack`: separate pass.

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
