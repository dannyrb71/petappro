# PetAppro — Team Roles & Operating Model

> **Canonical source of truth for who does what.** Read this alongside `AGENTS.md` (Codex/agents),
> `CLAUDE.md` (Claude Code), and `TASKS.md` (live work). If any of those disagree with this file on
> *roles*, this file wins — update the others to match.
>
> Last updated: 2026-07-05.

## The team (clear lanes, minimal overlap)

| Who | Lane | Owns | Does NOT |
|---|---|---|---|
| **Danny** | **Product Owner** | Vision, final product decisions, feature priority, scope + UX approval, the **go/deploy button** | Day-to-day PM bookkeeping; deep code review |
| **Claude Cowork** | **Product Manager** (+ design/research) | Product discovery, research, UX, competitive analysis, feature shaping, design-system tokens/Figma, docs, **Notion writer**, connectors, integration | App feature code (Claude Code); scheduling/tracking (ChatGPT); merging without Danny's go |
| **ChatGPT** | **Project Manager** | Roadmap, milestones, dependencies, sequencing, risk/scope-creep watch, project-status source of truth in Notion | Product/UX definition; writing code; approving technical direction; touching the repo |
| **Codex** | **Technical Governor + Reviewer** | Architecture review, engineering standards, code quality, tech-debt/scalability, **approving technical direction before build**, design-system review | Product priority; PM; **authoring or merging** (review-only) |
| **Claude Code** | **App implementation** | Build features, tests, migrations, CI, bulk refactors, scripts; update `CLAUDE.md` / code docs | Product/roadmap decisions; merging without Danny's go |
| **Claude Design** | **Design authoring** | Authors design specs + token/design proposals (delivered as files) | Cannot access the repo; never writes/merges — Cowork integrates its output |

> **Product Manager ≠ Project Manager (they collide on "PM", so be explicit).**
> **Claude Cowork = Product Manager** — the *what & why*: discovery, research, UX, design system, feature
> shaping; works with Danny on the product itself. **ChatGPT = Project Manager** — the *when & in what
> order*: roadmap, milestones, dependencies, sequencing, status. **Danny (Product Owner)** makes the final calls.
>
> **"Claude" is three lanes.** Work routes to the right one: **Claude Code** = app build; **Claude Cowork**
> = product management / design system / Figma / files / research / Notion; **Claude Design** = design
> authoring (no repo access).

## Standard workflow (so nothing falls through the cracks)

1. **Danny (Product Owner) + Claude Cowork (Product Manager)** shape the feature — Cowork runs discovery / research / UX to inform the *what & why*; Danny decides.
2. **ChatGPT (Project Manager)** updates the roadmap, dependencies, priority, and status in **Notion**; sequences it against the plan.
3. **Codex** reviews the technical approach *if* it's a significant architectural change (schema, money logic, tenancy/RLS, new package). Approves direction or sends it back.
4. **Claude** (Code or Cowork, per lane) implements it — plan first, no silent execution.
5. **Claude** updates implementation notes (code docs / `TASKS.md` / design-system records).
6. **ChatGPT (PM)** marks the milestone, updates progress, adjusts the roadmap.

AIs don't talk to each other directly — **Notion + `TASKS.md` are the hub.** Everyone reads/writes the shared files, not each other.

## Governance guardrails (non-negotiable)

- **Danny holds go/deploy.** Codex gates *quality* and approves *technical direction*; Danny approves the *launch*. No commit / push / deploy without Danny's explicit "ready to deploy."
- **Codex is review-only everywhere** (app code *and* design system): Blocker / Should-fix / Nit, ending in **CHANGES-NEEDED** or **READY-FOR-GOVERNOR** — never authors or merges.
- **Never cut:** multi-tenancy, RBAC/RLS, the single shared pricing package, or its regression tests.
- **Design-system lane:** Claude Design authors specs/tokens → Claude Cowork integrates + runs the linters → Codex reviews → Danny approves. (See `design-system/GOVERNANCE.md`.)

## Sources of truth (kept in sync)

- **Notion** — the **PM/roadmap layer**: big-picture phases, milestones, discovery, status. Owned by ChatGPT (PM) + Danny.
- **`TASKS.md`** (repo root) — the **execution layer**: current sprint tasks that Codex + Claude Code read.
- These are **mirrored** (Claude Cowork reconciles them on a schedule) so the roadmap and the sprint never drift. TASKS.md is the execution truth; Notion is the roadmap truth; conflicts are surfaced to Danny.

## Binding constraints (everyone plans against these)

Launch **Oct 1, 2026** · first store submission **~Sep 10** · LLC → D-U-N-S → Apple/Google org accounts must start **early August** (long lead). Delivery = **Hybrid (D-023):** gate-driven on the foundation (tenancy, RLS, pricing package + tests), deadline-driven elsewhere — fix time + quality, flex scope.
