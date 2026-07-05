# Claude Design — regenerate the 23 component specs (v0.4)

Your previous conversation was lost before the specs made it into the repo. Please **re-author all
23 component specs**. Good news: the token layer was restructured into a 4-tier model since you last
saw it, so this pass also fixes token names. Everything you need is in the repo.

## Read first (all in the repo)
- `design-system/GOVERNANCE.md` — how work moves.
- `design-system/specs/_TEMPLATE.md` — the contract format to follow exactly.
- `design-system/docs/token-architecture.md` — the 4-tier model.
- `design-system/tokens/` — the real tokens (source of truth). Reference these names, not old ones.

## Deliver
One markdown file per component, following `_TEMPLATE.md`
(Objective → Requirements → Acceptance Criteria → Documentation, with RN-mapped props), into:
- `specs/atoms/` (8): button, input-field, avatar, icon, money, status-badge, service-pill, switch
- `specs/patterns/` (5): section-header, date-navigator, field-group, list-row, pricing-row
- `specs/domain/` (10): booking-card, pet-avatar, multi-pet-avatar-stack, vaccination-badge,
  temperament-tag, medication-chip, booking-timeline, capacity-meter, client-risk-indicator, report-card

## CRITICAL — reference the CURRENT token names only
The old `color.semantic.primary.*`, `color.domain.*`, etc. are gone. Use these (color):

**action** — `color.semantic.action.primary.{default,hover,pressed,on,container,on-container}` ·
`color.semantic.action.secondary.{default,solid,hover,on,container,on-container}`
**surface** — `color.semantic.surface.{default,container,container-high,bright}`
**text** — `color.semantic.text.{default,body,variant,faint,accent}`
**border** — `color.semantic.border.{default,variant,strong}`
**focus** — `color.semantic.focus-ring`
**status** — `color.semantic.status.{success,warning,danger,info}` (+ `-container` for each)
**domain** — `color.semantic.domain.<group>.<state>.{base,container,on}`:
- booking: upcoming · in-progress · completed · cancelled
- payment: paid · unpaid · partial · overridden
- service: boarding · daycare · walk · sitting · grooming · training · pickup · meet-greet
- notification: info · success · warning · urgent
- capacity: available · limited · full (base + container only)
- risk: none · watch · high (single value)
- role: owner · staff · client (single value)
- pet: male · female · unknown (single value)

Type/space/radius/elevation/motion tokens are unchanged at `tokens/typography|spacing|radius|elevation|motion`.

Quick old→new map: `primary → action.primary` · `secondary → action.secondary` ·
`on-surface → text` · `outline → border` · `surface → surface` (same) · `domain.* → semantic.domain.*`.

## Two token additions you flagged — keep flagging them (do NOT invent silently)
1. `success-solid` (a solid green for the AA-contrast booking button) — note it as a **required token
   addition** in the spec + `specs/README.md`; we'll add it to the source before build.
2. `comp.*` component hooks (the Tier-4 component layer) — reference where needed and list them in
   `specs/README.md` as pending token additions.

## Rules
- Semantic/domain tokens only — never raw values. Every referenced token must exist in `tokens/`
  (or be one of the two flagged additions above).
- Include `specs/README.md` summarizing the set + the flagged token additions.

## After you deliver
Hand the folder to Danny → Claude (Cowork) merges into the repo and lint-checks → **Codex reviews** →
**Danny approves**. Templates (Dashboard, Booking, Profile, Schedule, Reports) stay parked until specs
are approved.
