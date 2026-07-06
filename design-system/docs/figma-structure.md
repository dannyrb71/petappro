# PetAppro Design System — Figma File Structure

How the Figma master file (`F0BqeqhhMcTpJwaNCWfeEH`, "PetAppro — Design System") is
organized: pages, the wrapper-frame convention, and what lives where. This mirrors the
`specs/` taxonomy so humans and AI navigate the same map in Figma, in the repo, and in code
— the north star (a scalable DS that works for designers *and* engineers, human or AI).

Reference bar: the Material 3 pages Danny reviewed (2026-07-05). We match their **fidelity**
(full tonal palettes, real semantic tables, mobile+desktop type ramps, elevation specimens)
without matching their **scale** — no Material-sized inventory.

## Two structural units

- **Page** = one major branch of the map. Numeric prefix for ordering; **no icon/emoji glyphs
  in page names** (Danny, 2026-07-05 — distracting).
- **Wrapper frame** ("spec card") = one documented topic on a page. Auto-layout, consistent
  header + one-line "See design guideline" reference + a specimen area. This is the reusable
  building block, taken from the Material reference (the Typography / Color Guidance / Elevation
  cards). Every documented topic is one wrapper.

## Page map

```
00 Cover          Title, version, how-to-use, changelog pointer
01 Color          Tonal palettes + semantic tables (light; dark structured-for-later)
02 Type           Type ramp (mobile live · tablet/desktop documented) + text styles
03 Layout         Spacing · radius · size (control/icon/avatar) · stroke · elevation · motion
04 Themes         The 5 packaged theme sets (Tier-2 white-label picks) shown side by side
05 Components      Atoms + patterns (mirrors specs/atoms + specs/patterns)
06 Domain          Pet-care first-class components (mirrors specs/domain)
07 Templates       Full screens (Dashboard · Booking · Onboarding · Schedule · Settings…)
08 Prototype       Wired flows (future)
99 Sandbox / WIP   Scratch; nothing here is source of truth
Brand              Master logo + lockups (asset page)
```

`04 Themes` is distinct from `01 Color`: Color documents the *system* (palettes + roles);
Themes shows the *packaged sets* a Tier-2 client chooses from — each set = its color mode +
paired font, previewed as a real card. The five: Sage & Sand · Terracotta · Harbor · Dusk · Berry.

## Foundation decisions (Danny, 2026-07-05)

1. **Full tonal ramps.** Each theme expands to full 0→100 tonal palettes (~11 steps) across
   roles, Material-style — *not* the tuned 5–9-step partial scales. **This changes the token
   *source*, not just Figma**, and supersedes the tuned-scale approach in
   `CLAUDE-DESIGN-BLESS-DECISION-1.md`. Regeneration is a governed source step (see Sequencing).
2. **Dark: structure now, build later.** Build light semantic tables now; design the semantic
   layer so dark drops in as a future mode axis. No dark swatches built pre-launch.
3. **Rich, responsive type.** Expand roles (display→label + Body Sm/Md/Lg with emphasis/semibold
   variants); lay out Mobile / Tablet / Desktop columns. **Bind the mobile ramp as live text
   styles** (that's the app); Tablet/Desktop are documented as the brand/web ramp and tokenized
   when website/deck work starts — avoids adding a viewport mode axis six months early.

## Per-page contents (wrapper frames)

- **01 Color** — `Tonal Palettes` (all theme primitive ramps, 0→100) · `Semantic — themed`
  (one board bound to semantic vars; flip Theme mode to preview each of 5) · `Status / System`
  (success · warning · info · error · neutral — the alert set).
- **02 Type** — `Type Ramp` (Mobile / Tablet / Desktop columns) · `Text Styles` (named styles,
  mobile bound live) · `Emphasis` (regular / link / semibold body).
- **03 Layout** — `Spacing` · `Radius` · `Size` (control/icon/avatar) · `Stroke` · `Elevation`
  · `Motion`. All bound to the Dimensions collection. Built for real now (no color dependency).
- **04 Themes** — one card per theme set (swatch row + font specimen + sample component), five total.
- **05 / 06 / 07** — one wrapper per component/template: variants matrix + a "themed across 5"
  row. Filled as components are built.

## Woof WeTreats → component map

Mapping the old app's surfaces to the new system exposes the real gaps to spec *before*
building screens (source: `docs/planning/woof-wetreats-reference-review.md`).

| WWT surface | New component | Status |
|---|---|---|
| Header / nav (client + staff) | App Bar; Bottom Tab Bar | **gap** |
| Dog card | Pet Card (pet-avatar + card shell) | shell **gap** |
| Reservation | booking-card | ✅ spec'd |
| Household card (staff) | Client Card | **gap** |
| Horizontal card rows ("your pets", "upcoming stays") | Carousel | **gap** |
| Staff pricing table / staff list | Table (from list-row / pricing-row) | rows ✅, table **gap** |
| Daily schedule (grouped by activity) | Grouped list (section-header + list-row) | ✅ composable |
| Household detail / meet-greet modal | Sheet / Modal; Tabs | **gap** |
| Blocked-date picker | Calendar (bigger than date-navigator) | **gap** |
| Onboarding (4-step) | Onboarding Stepper | **gap** |
| Booking form, pricing preview | field-group, pricing-row, money | ✅ spec'd |
| Status (meet-greet, reservation, blocked) | status-badge | ✅ spec'd |

**Gap list to spec next** (the "don't over-simplify and regret it" set): App Bar · Bottom Tab
Bar · Card shell · Carousel · Table · Sheet/Modal · Tabs · Calendar · Onboarding Stepper.
Stop there — that plus the existing 23 specs covers the WWT rebuild without Material bloat.

## Build sequencing

1. **Scaffold** (this pass): rename/number pages, wrapper frames on 01–04, real Layout specimens.
2. **Governed source step**: regenerate full tonal ramps (OKLCH-based generation, ~11 steps
   per role/theme) + expand type ramp sizes/weights → run both linters → Codex review → Danny
   approval. Only then rebuild the Color and Type specimens at full fidelity + Themes cards.
3. **Gap specs**: author the 9 missing component specs (Claude Design) → review → approve.
4. **Components**: build Button first (pipeline proof), then batch.
5. **Code Connect + token build** (Figma↔RN, DTCG→Expo): later.

## Version history

- v0.1 (2026-07-05) — initial structure; page map, wrapper convention, foundation decisions,
  WWT→component map + gap list. Authored by Claude (Cowork) from Danny's reference review.
