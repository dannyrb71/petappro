# PetAppro Design System

The design system as a product in its own right (charter §Principle). This directory is the **authored, governed source**. The app never imports from here directly — it imports the **generated packages** built from this source.

## The one principle that keeps it clean

**Authored source → build → consumed artifacts. One direction. Never hand-edit generated output.**

```
  design-system/          (AUTHORED · governed · human + AI facing)
     tokens/  specs/  records/            ← source of truth, reviewed via GOVERNANCE.md
        │
        │  build step (tokens → platform outputs; specs → components)
        ▼
  packages/               (GENERATED / IMPLEMENTED · consumed by the app · Claude Code territory)
     tokens/   ← generated from design-system/tokens  (do not hand-edit)
     ui/       ← component library implementing design-system/specs
        │
        ▼
  app/                    (Expo/React Native — imports @petappro/tokens + @petappro/ui)
```

Figma is a **third consumer**, synced from `design-system/tokens` — not a parallel source of truth.

## Who touches what

| Directory | Owner | Written how |
|---|---|---|
| `design-system/tokens/` | Claude Design (authors) → governed | DTCG `*.tokens.json`, linted |
| `design-system/specs/` | Claude Design (authors) → governed | contracts, Objective→Requirements→Acceptance |
| `design-system/records/` | Claude (writer) | one per shipped component; no record → not in library |
| `packages/tokens/` | Claude Code | **generated** from tokens source; never edited by hand |
| `packages/ui/` | Claude Code | component code implementing an **approved** spec |
| `app/` | Claude Code | consumes the packages |

## Layout

```
design-system/
├── README.md                    ← this map
├── GOVERNANCE.md                ← operating model: roles, flow, gates, versioning
├── Petappro — Design System Governance.pdf   ← the charter (the standard)
├── CHANGELOG.md                 ← system-level changelog
├── tokens/                      ← AUTHORED DTCG source (color, type, space, radius, elevation, motion…)
│   └── *.tokens.json
├── tools/
│   └── lint-tokens.mjs          ← mechanical gate (semantic-over-literal, alias integrity, naming)
├── specs/                       ← contracts, one file per component
│   ├── _TEMPLATE.md
│   ├── foundations/  atoms/  patterns/  domain/  templates/
├── records/                     ← per-component records
│   └── _TEMPLATE.md
└── assets/                      ← source logos / art
```

## Start here
1. Read `GOVERNANCE.md` — how work moves and who signs off.
2. Author tokens into `tokens/`, lint: `node design-system/tools/lint-tokens.mjs`.
3. Author component specs into `specs/<layer>/` using `specs/_TEMPLATE.md`.
4. On the Governor's approval, Claude builds → Figma + `packages/`, then writes a record.
