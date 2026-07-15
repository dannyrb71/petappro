# Elevation-Aware Surfaces (Surface × Scheme × Theme)

Status: adopted 2026-07-12 (Danny). Supersedes hand-picked on-color choices.

## Problem it solves
Foreground colors (text, icons, button fills, outlines) depend on **what surface they sit on**, not just the theme/scheme. A label on the dark app canvas must be light; the *same* label inside a light-island card must be dark. Until now designers/engineers hand-picked the family (`text/on-canvas` vs `text/on-surface`, `on-canvas-accent` vs `on-surface-accent`), which is the root cause of the "illegible on dark" class of bugs (e.g. the Bella card) and the "primary button washes out in a container" issue.

## The model: three axes
Every foreground value resolves on three independent axes:

- **Theme** — Brandy Blue, Sage & Sand, Terracotta, Harbor, Dusk, Berry (brand identity)
- **Scheme** — Light / Dark
- **Surface** — `canvas` · `container` · `card` (elevation the element sits on)

Theme × Scheme already existed. **Surface is the new axis.** The element never chooses its on-color; it inherits the surface level from its parent and resolves automatically.

## Surface levels
- `canvas` — the app background (dark, brand-tinted, in dark scheme; light neutral in light scheme).
- `container` — a holder card / grouping surface (light island in dark scheme). `surface/container-high` = neutral 200 both schemes.
- `card` — a small/inner or non-contained card sitting on the canvas (`surface/default` = white light / neutral 100 dark).

## Adaptive tokens (what components bind to)
Components stop binding to `text/on-canvas` **or** `text/default` directly. They bind to one **adaptive** token that resolves by surface:

| adaptive token | canvas → | container → | card → |
|---|---|---|---|
| `surface/foreground` | `text/on-canvas` | `text/default` | `text/default` |
| `surface/foreground-variant` | `text/on-canvas-variant` | `text/variant` | `text/variant` |
| `surface/foreground-accent` | `text/on-canvas-accent` | `text/accent` | `text/accent` |
| `surface/primary-fill` | `action/primary/default` (bright) | `action/primary/on-surface` (darker) | `action/primary/on-surface` |
| `surface/primary-on` | `action/primary/on` | `action/primary/on-surface-label` | … |
| `surface/outline-stroke` | light stroke | dark stroke | dark stroke |

Each right-hand value is an **existing scheme-aware token**, so aliasing through it means Scheme and Theme keep resolving for free. Surface just picks *which* token. (Text tokens already exist; `action/primary/on-surface*` are the only net-new values — the darker primary step for use on light islands. Phase 2.)

**Rule of thumb:** the on-canvas family = dark scheme makes it light; the on-surface family = dark in both schemes because cards are light islands.

## Figma implementation
A Variables **collection `Surface`** with modes `Canvas` / `Container` / `Card`. The adaptive variables above live in it and **alias** to the semantic tokens.

Each surface container frame declares its level:
```
frame.setExplicitVariableModeForCollection(surfaceCollection, modeId)  // Canvas | Container | Card
```
Children inherit it. Proven in POC `◆ Elevation-Aware POC` — the same button instance resolves bright-fill/dark-label on a `Canvas` frame and dark-fill/white-label on a `Container` frame, no variant swap.

## Code implementation (React Native / Expo)
Figma's mode inheritance does not export; you reproduce it with a Surface **context** (see `reference/surface/Surface.tsx`). Each surface component wraps children in `<Surface level="…">`; foreground picks its value with `useForeground()` reading context + `useColorScheme()`. Token *values* come from the exported token JSON; the *resolution* is the small hook. Code Connect maps the Figma component ↔ the RN component.

## Discipline (the one cost)
**Every surface must declare its level**, in Figma (set mode on the frame) and in code (`<Surface level>`), or children inherit the wrong on-color. Screens default to `canvas`; a Card component sets `card`; a grouping container sets `container`. Lint idea: flag a foreground token used with no ancestor Surface mode.

## Migration plan (staged — do NOT sweep blind)
1. ✅ POC proves the mechanism.
2. Build production `Surface` collection + `foreground` / `foreground-variant` / `foreground-accent` (alias existing tokens). *(text is clean — no new values.)*
3. Add `action/primary/on-surface*` values (darker primary for light islands) — Phase 2, one decision.
4. **Pilot**: migrate one screen (Booking Card) — set surface modes on canvas/card frames, rebind its text to `surface/foreground*`. Review with Danny.
5. Sweep the component library once the pilot holds; retire the hand-split `on-canvas` vs `on-surface` usages in components (tokens stay).
6. Ship the RN `Surface` provider + `useForeground`; wire Code Connect.

See also: `text token model` and `surface layering` design notes.
