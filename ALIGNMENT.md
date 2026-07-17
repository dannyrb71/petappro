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
| **Codex** | Tech governor — architecture, data model, code review | **edits local files (its lane)**; **reads git** (history/diffs/CI); **does NOT commit/push** — Claude Code is sole committer; **design-system files = review-only** | **local files (folder-connected)** |
| **George (ChatGPT — new desktop app)** | Project governance — roadmap, prioritization, standups | posts to `STATUS.md`; local write via desktop app | **reads canonical directly — local folder + git repo — via the new ChatGPT desktop app** (Danny moved to it 2026-07-14). Relay is fallback only; each standup's provenance stamp shows the actual source. |
| **Design System chat** ("PetAppro Foundation") | **Design system authority** — tokens, components, atomic structure (atoms→molecules→…), design specs | writes to **`/design-system/`** — the governed DS foundation (CANONICAL). `docs/design-system/` was an earlier mis-pointer; consolidate into `/design-system/` | local files (folder-connected) |

**Sync mechanism (how chats/tools stay aligned):** every Claude chat working on PetAppro **connects the
Base509 folder and writes to its lane** in the repo — the local files ARE the shared layer, so
folder-connected chats sync automatically on disk (no manual sharing). **Codex is also folder-connected**
(local read/write + git inspection); Claude Code pushes local → the GitHub mirror; **George reads the
GitHub mirror directly** via its connector (confirmed 2026-07-10 — paste + desktop-only workaround retired).
If a chat saved to its own scratchpad instead of the repo, it wasn't folder-connected — fix that, don't paste.

## 1. Source of truth — precedence (revised 2026-07-09)

1. **Local files** on Danny's Mac (`…/Documents/Base509/Products/petappro/`) — **CANONICAL.**
   Cowork authors/edits here directly.
2. **GitHub** (`dannyrb71/petappro`, private) — a **mirror of local**, kept in sync by **Claude Code**
   (commit + push) on each commit. Version control + the copy George reads.
3. Conversation context — only if the above don't cover it.

**Who does git — ONE WRITE SURFACE, ONE COMMITTER (locked 2026-07-10, Danny):**
- **Every agent writes to LOCAL files only. Nobody writes directly to GitHub.** GitHub is a mirror.
- **Claude Code is the SINGLE git operator** — it runs ALL `add`/`commit`/`push`. **No other agent runs
  git writes, not even a local commit** (two committers on one `.git` = `index.lock` races — the bug we hit).
- **Codex** edits **local files in its lane** and may **READ git** (history, diffs, CI/checks) — but does
  **not** commit/push. Its "I can make local commits" capability is intentionally **not used** under this rule.
- **Cowork** edits local files, **no git** (sandbox has no auth, leaves lock files).
- **Danny approves every push.** Rationale: one source of truth (local disk), one push path — no divergence.
- **Exception — George** (not folder-connected): reads the GitHub *mirror*, cannot write local. George's repo
  writes go through **Cowork (scribe)** or are posted to `STATUS.md` for Claude Code to commit, until George
  is folder-connected.

**Read paths:** Cowork, Claude Code, and Codex read local files (all folder-connected). **George reads
canonical directly via the new ChatGPT desktop app — local folder + git repo** (Danny moved to it
2026-07-14); the old web-ChatGPT-connector 404 is moot on the new app. Cowork-relay remains a fallback;
each standup's provenance stamp (§4) shows which source was used.

**Hard rule:** never infer or "fill in the blanks." If you can't see the current docs, say so — don't guess.

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

George reads canonical per §1 (the mirror when its connector is attached in that chat, else Cowork's
relayed canonical — labeled as relayed). His governance output posts to `STATUS.md`; other repo writes go
through **Cowork** (scribe model) unless George's own commit path is confirmed — avoids multi-writer conflicts.

## 4. Daily protocol

1. **Start of day — alignment check.** Each agent reads `ALIGNMENT.md` + `TASKS.md` +
   `open_decisions.md` and reports **"aligned"** or lists deltas. Cowork reconciles deltas into the
   right docs (expect a few read/write rounds if misaligned). Log the check in §6.
   - **Read-before-report (rule, 2026-07-11).** No standup or status report is written from memory. Any
     report — especially George's daily standup — must be generated **from a fresh canonical read first**
     (the repo at current HEAD if the connector is live, else Cowork's relayed canonical, labeled as
     relayed). If canonical can't be obtained, **say so and defer** — never present a memory-based report
     as current. The read is a precondition of the report, not a follow-up correction.
   - **Provenance header (rule, 2026-07-14, proposed by George).** Every standup/status report
     opens with a source stamp so its basis is never ambiguous:
     `Source: ✓ Canonical repo · Commit: <hash> · Read: <timestamp>` when read from the repo, or
     `Source: ⚠ Cowork-relayed canonical · Commit: <hash> · Reason: <why>` when relayed.
2. **During the day.** Each change is captured in its owner's doc as it's made.
3. **End of day — push.** **Claude Code** commits + pushes (mirrors local → GitHub); **Danny approves.**
   Cowork does NOT push. Log the commit hash in §6. **If no push, record why** (the line Danny asked for).

## 5. Alignment-check prompt (fire at any agent)

> Read `ALIGNMENT.md`, `TASKS.md`, and `docs/decisions/open_decisions.md` from `dannyrb71/petappro`
> (repo root = the petappro folder — **no** `Products/petappro/` prefix). Confirm you are fully
> aligned, **or** list every delta as: `area | your understanding | repo says | proposed fix`. If you
> cannot read a file, say so explicitly — do not infer.

*(**George, Codex, and Claude Code** all read these from the GitHub mirror directly; Cowork reads local files.)*

## 6. Sync log (newest first)

- **2026-07-10** — Pushed **`5319f8c`** (`c8b5628 → 5319f8c`) by Claude Code, on Danny's "ready to deploy."
  Bundle: pricing per_session/per_unit per-date fix (closes Codex blocker; 39 tests green, Cowork-verified in
  isolated install), decisions **D-041–D-048**, `provider-settings-ia.md` (new; on main since `c8b5628`),
  `product_brief.md` full reconciliation, `ALIGNMENT.md` single-committer governance + §7 punch-list, `STATUS.md`.
  **Not in this push (separate, by owners):** Codex's §7 architecture-doc fixes (`technical_architecture.md`,
  `data_model_draft.md`); newer Design-System files (CHANGELOG, theming-decision, naming-conventions, dark
  tokens) — pending Codex DS review. This §6 entry + this note will ride the next push.

- **2026-07-09** — Alignment ledger + daily protocol established (Cowork). Commit `3de98e7` made
  (all 2026-07-08/09 work: D-007 Connect-in, D-015 no-deposits, D-022 walking, D-028, D-029,
  D-034–D-038, pricing spec, roadmap resync, operator-console doc, user-flows index). **EOD push:
  PENDING** — Cowork's sandbox can't authenticate to GitHub; **Claude Code or Danny to push** (`rm -f
  .git/HEAD.lock .git/index.lock && git add ALIGNMENT.md && git commit && git push origin main`). Issued George a path correction (repo
  root = petappro). Open discrepancies: none once `3de98e7` is pushed.

## 7. Open discrepancies (live — clear as resolved)

- **2026-07-10 — Stale payments docs vs D-007 Option A / D-042 (owner: Codex — architecture/data-model lane). RESOLVED 2026-07-14.** `docs/planning/technical_architecture.md` and `docs/planning/data_model_draft.md` now specify Stripe Connect Standard in MVP with manual payment tracking as fallback only, and D-042 SaaS subscription billing on web only with no native purchase/link/CTA. The data model now treats Connect PaymentIntent/webhook fields as active launch scope. Resolution recorded in `STATUS.md`; local documentation edits await the single-committer flow and Danny's push approval.
