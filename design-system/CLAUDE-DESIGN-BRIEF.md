# Brief for Claude Design — how we work now

You're the **Author** in a governed pipeline. Your design work is excellent; this just tells you where it goes and the contract it follows so nothing gets lost or reworked.

## The setup in one line
**Git is the source of truth. Your output is committed files, not chat messages.** Everything reconciles to the repo `Products/petappro/design-system/`.

## Roles
- **You (Claude Design):** author token definitions and component specs. The thinking + the visual system.
- **Claude (Cowork/Code):** the single writer — takes your *approved* work and builds it into Figma (via connector) and the app packages, then records it.
- **ChatGPT:** independent reviewer, no write access. A second-model check.
- **Danny:** Director/Governor. Approves specs before build, signs off after. The only human gate.

## What you produce — two artifact types, exact homes

**1. Tokens** → `design-system/tokens/<name>.tokens.json` (DTCG format)
- Split by concern: `color.tokens.json`, `typography.tokens.json`, `spacing.tokens.json`, etc.
- **Two layers, and this is the hard rule:**
  - `primitive` — raw literals (the palette): `"$value": "#006073"`
  - `semantic` — MUST alias a primitive, never a raw value: `"$value": "{color.primitive.trust-teal.600}"`
- A linter enforces this on every commit. Your tokens must pass:
  - **R1** semantic tokens alias primitives (no raw hex in the semantic layer)
  - **R2** every alias resolves to a real token
  - **R3** primitives are literals (no aliases pointing up)
  - **R4** names are kebab-case (`trust-teal`, not `TrustTeal`); numeric scales like `600` are fine
  - **R5** every token has a `$type`
  - *Legit exception* (e.g. an alpha overlay with no primitive equivalent): allowed, but declare it: `"$extensions": { "ds": { "allowLiteral": "reason" } }` — never a silent literal.

**2. Component specs** → `design-system/specs/<layer>/<component>.md`
- Layers: `foundations` · `atoms` · `patterns` · `domain` · `templates`
- Format is a **contract**, not a request: **Objective → Requirements → Acceptance Criteria** (template at `design-system/specs/_TEMPLATE.md`).
- Requirements reference **semantic tokens only** — never raw values.
- Acceptance Criteria must be checkable (that's what the post-build audit tests against).
- Domain components (the pet-care first-class citizens) name the concept they encapsulate.

## What happens after you hand off
Your file lands in the repo → Claude pre-checks it against the charter → Danny approves (or sends back) → Claude builds it into Figma + code and writes a component record → ChatGPT audits the build against your acceptance criteria. Nothing builds before Danny approves.

## Right now — the ask
Deliver the **foundation tokens first** as DTCG files in `design-system/tokens/`: color (primitive scales + semantic roles), typography, spacing, radius, elevation, motion. That's the base everything composes from. Once they're in and lint-clean, we start components — atoms first, then patterns, then the domain layer.

Reference: the full standard is `design-system/GOVERNANCE.md` and the charter PDF; the map is `design-system/README.md`.
