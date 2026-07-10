# ALIGNMENT — cross-agent sync ledger

> **Purpose:** keep the AI team (Cowork · George · Codex · Claude Code) aligned on one source of
> truth, catch drift early, and track the daily push. Any agent can (and should) read this file.
> **Steward:** Cowork maintains this ledger (direct file access) and reconciles discrepancies; Danny
> approves pushes.

## 0. Agent roles at a glance

| Agent | Role | Git / writes to repo? | Reads from |
|---|---|---|---|
| **Danny** | Product owner — decides & **locks** decisions; approves pushes | via approval | anything |
| **Cowork (Claude)** | Product management — captures decisions, writes specs/docs; **ledger steward** | edits **local files**; **does NOT run git** | local files |
| **Claude Code** | Implementation **+ git operator** — `commit`/`push` mirrors local → GitHub | **yes (git)** | GitHub mirror |
| **Codex** | Tech governor — architecture, data model, code review | yes (its connector works) | GitHub mirror |
| **George (ChatGPT — desktop app)** | Project governance — roadmap, prioritization, standups | posts to `STATUS.md`; other writes via Cowork (desktop-write TBD) | **reads the repo via the ChatGPT desktop app** (confirmed 2026-07-09 — paste no longer needed) |
| **Design System chat** ("PetAppro Foundation") | **Design system authority** — tokens, components, atomic structure (atoms→molecules→…), design specs | writes to **`/design-system/`** — the governed DS foundation (CANONICAL). `docs/design-system/` was an earlier mis-pointer; consolidate into `/design-system/` | local files (folder-connected) |

**Sync mechanism (how chats/tools stay aligned):** every Claude chat working on PetAppro **connects the
Base509 folder and writes to its lane** in the repo — the local files ARE the shared layer, so
folder-connected chats sync automatically on disk (no manual sharing). Claude Code pushes local → the
GitHub mirror; Codex reads the mirror. **George** reads the repo via the **ChatGPT *desktop* app**
(confirmed 2026-07-09 — the *web* ChatGPT can't, its private-repo connector 404s). If a chat saved to
its own scratchpad instead of the repo, it wasn't folder-connected — fix that, don't paste.

## 1. Source of truth — precedence (revised 2026-07-09)

1. **Local files** on Danny's Mac (`…/Documents/Base509/Products/petappro/`) — **CANONICAL.**
   Cowork authors/edits here directly.
2. **GitHub** (`dannyrb71/petappro`, private) — a **mirror of local**, kept in sync by **Claude Code**
   (commit + push) on each commit. Version control + the copy Codex / Claude Code read.
3. Conversation context — only if the above don't cover it.

**Who does git:** **Claude Code** is the git operator (runs locally with credentials). **Cowork does
NOT run git** — its sandbox has no GitHub auth and leaves `.git` lock files. Cowork owns *content*
(local files correct); Claude Code owns *sync* (mirror local → GitHub). Danny approves/triggers pushes.

**Read paths:** Cowork = local files. Claude Code / Codex = the GitHub mirror (their connectors work).
**George reads via the ChatGPT *desktop* app** (confirmed 2026-07-09 — returns current repo files). The
*web* ChatGPT GitHub connector CANNOT read the private repo (404); **use the desktop app for George.**

**Hard rule:** never infer or "fill in the blanks." If you can't see the current docs, say so and ask
for the `ALIGNMENT.md` paste.

## 2. Repo facts (read these correctly)

- Repo: `github.com/dannyrb71/petappro` (private) · branch `main`
- **The repo root IS the `petappro` folder.** Canonical paths have **NO `Products/petappro/` prefix**:
  - `TASKS.md`
  - `ALIGNMENT.md` (this file)
  - `docs/decisions/open_decisions.md`
  - `docs/roadmap/mvp_roadmap.md` (+ `PetAppro-Roadmap-and-Project-Plan.md`)
  - `docs/specs/booking_and_pricing.md`
  - `docs/planning/*.md` · `docs/user-flows/README.md`
- The repo is current **only after a push.** If something looks stale, it may be committed-but-unpushed
  on Cowork's side — check the Sync Log below.

## 3. Doc ownership — who WRITES what (read anything; write only your lane)

| Area | Primary writer | Everyone else |
|---|---|---|
| Decisions log (`open_decisions.md`) | **Danny decides / locks; Cowork captures** | read-only |
| Product specs (`docs/specs/`) | **Cowork (product mgmt)** | read |
| Architecture / data model (`technical_architecture.md`, `data_model_draft.md`) | **Codex (tech governor)** | read |
| Roadmap + project planning / prioritization / standups (`mvp_roadmap.md`, TASKS project sections) | **George (project governor)** | Cowork may propose decision-driven changes |
| This ledger (`ALIGNMENT.md`) | **Cowork (steward)** | read; flag deltas |
| Code | **Claude Code** | — |

George reads the repo via the **ChatGPT desktop app** (§1). His governance output posts to `STATUS.md`;
other repo writes go through **Cowork** (scribe model) unless desktop file-write is confirmed — avoids
multi-writer conflicts. (The *web* ChatGPT still can't read the repo — use the desktop app.)

## 4. Daily protocol

1. **Start of day — alignment check.** Each agent reads `ALIGNMENT.md` + `TASKS.md` +
   `open_decisions.md` and reports **"aligned"** or lists deltas. Cowork reconciles deltas into the
   right docs (expect a few read/write rounds if misaligned). Log the check in §6.
2. **During the day.** Each change is captured in its owner's doc as it's made.
3. **End of day — push.** **Claude Code** commits + pushes (mirrors local → GitHub); **Danny approves.**
   Cowork does NOT push. Log the commit hash in §6. **If no push, record why** (the line Danny asked for).

## 5. Alignment-check prompt (fire at any agent)

> Read `ALIGNMENT.md`, `TASKS.md`, and `docs/decisions/open_decisions.md` from `dannyrb71/petappro`
> (repo root = the petappro folder — **no** `Products/petappro/` prefix). Confirm you are fully
> aligned, **or** list every delta as: `area | your understanding | repo says | proposed fix`. If you
> cannot read a file, say so explicitly — do not infer.

*(**George** reads these from the repo via the ChatGPT desktop app; Codex / Claude Code read the GitHub mirror; Cowork reads local files.)*

## 6. Sync log (newest first)

- **2026-07-09** — Alignment ledger + daily protocol established (Cowork). Commit `3de98e7` made
  (all 2026-07-08/09 work: D-007 Connect-in, D-015 no-deposits, D-022 walking, D-028, D-029,
  D-034–D-038, pricing spec, roadmap resync, operator-console doc, user-flows index). **EOD push:
  PENDING** — Cowork's sandbox can't authenticate to GitHub; **Claude Code or Danny to push** (`rm -f
  .git/HEAD.lock .git/index.lock && git add ALIGNMENT.md && git commit && git push origin main`). Issued George a path correction (repo
  root = petappro). Open discrepancies: none once `3de98e7` is pushed.

## 7. Open discrepancies (live — clear as resolved)

- _(none currently — will list here with owner + status whenever an alignment check finds a delta)_
