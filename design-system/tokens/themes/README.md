# Theme modes

Each `*.tokens.json` here is **one theme = one mode** over the semantic color layer — the
mid-tier white-label options. This is how Figma variables model theming ("one mode per theme"),
so source, Figma, and app agree.

- **Default mode = base.** The `sage-sand` (default) values live in `../color.tokens.json`
  (semantic layer). No separate file — base *is* the default mode.
- **Alternate modes** (this folder): `terracotta` · `harbor` · `dusk` · `berry`. Each overrides only
  the brand + neutral semantic roles; status colors (success/warning/error/info), `surface.bright`,
  and `on-surface.faint` inherit the base mode.
- **Values** are ported verbatim from `site/tokens/themes.css` (the tuned, shipping theme palettes).
- **Top tier** (custom *n* colors + logo) is a runtime tenant mode over the same semantic contract —
  not a static file here.

## Interim representation (flagged for reconciliation)
To stay lint-clean, each mode declares **role-named per-theme primitives**
(`color.primitive.theme.<name>.primary` …) and aliases the semantic roles to them. This is faithful
and reversible but a different shape than the base (which aliases hue-scale primitives like
`pine.700`). The incomplete 3-step `clay`/`olive`/`jade`/`gold`/`azure`/`violet`/`magenta` families in
`color.tokens.json` are **not yet used** by these modes. Reconciling the two (full tuned hue-scales vs
role-named) is a Claude Design authoring decision — see `../../docs/theming-and-tiers.md`.

Lint all: `node design-system/tools/lint-tokens.mjs`.
