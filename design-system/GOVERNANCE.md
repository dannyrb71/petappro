# PetAppro Design System — Operating Playbook

> The [Governance Charter](./Petappro%20—%20Design%20System%20Governance.pdf) is the *standard* (what "good" means).
> This playbook is the *operating model* (how work actually moves, who does what, where truth lives).
> If the two ever disagree, the charter wins on standards; this file wins on process.

Status: **v0.1 — lean playbook.** Automated acceptance-check CI is deliberately deferred until the first component has flowed through end-to-end (see §7). Grow the process to fit reality, not ahead of it.

---

## 1. The one rule everything else depends on

**Git is the single source of truth.** Tokens, specs, component records, and the changelog all live as files in `docs/design-system/`. Figma is a *render target* synced from tokens — never a parallel truth to reconcile. Every handoff between people or tools is **a committed file, not a chat message.** That is what lets multiple parties operate on one truth without stepping on each other.

If it isn't in the repo, it doesn't exist. No record → not in the library.

---

## 2. Roles — many advisors, one writer, one human gate

| Party | Role | Writes to repo? |
|---|---|---|
| **Danny (Director)** | **Governor.** Approves specs before build; signs off after audit. Final gate, always human. | Approves; rarely edits |
| **ChatGPT** | **Assists the Governor.** Independent, adversarial review of specs (pre-build) and built output (post-build). A second-model check — different blind spots from Claude. | ❌ No write access |
| **Claude Design** | **Author.** Produces component specs and token definitions in the contract format (§4). The thinking. | Via files it outputs (§3) |
| **Claude (Cowork/Code)** | **Single writer.** Takes *approved* specs → writes Figma via MCP **and** commits the same truth to Git. One writer = no drift, no merge chaos. | ✅ Yes — the only writer |

This mirrors the existing repo convention (`AGENTS.md`): Codex/ChatGPT = independent reviewer and second-model check; Claude = primary implementer. The design system inherits that split rather than inventing a new one.

**Why an AI is not the Governor:** governance is a *gate*, not a second opinion. Where it can be mechanical, it's a script (§6). Where it needs judgment, it's Danny — assisted by ChatGPT, but never replaced by it.

---

## 3. How Claude Design output enters the system

Claude Design runs in its own session; nothing connects into it directly. The bridge is a file on disk:

1. Claude Design produces a spec (or token block) in the §4 format.
2. It's saved into `docs/design-system/specs/<layer>/<component>.md` — either Claude Design writes there, or Danny pastes/saves it.
3. From that moment it's a governed artifact: reviewable, versionable, and readable by Claude *and* ChatGPT from the identical source.

Chat output is a draft. A committed file is a spec. Only files move through the gates below.

---

## 4. Specs are contracts, not requests

Every component spec follows **Objective → Requirements → Acceptance Criteria** (charter §04). Template: [`specs/_TEMPLATE.md`](./specs/_TEMPLATE.md). A spec that can't be checked against its acceptance criteria isn't done.

---

## 5. The operational flow

For every new atom, pattern, or domain component:

```
  Claude Design ──spec file──▶ specs/<layer>/<name>.md
        │
        ▼
  ① Governance pre-check   (Claude reads spec vs charter checklist + 4 standing questions)
        │                   → writes specs/<layer>/<name>.review.md ; ChatGPT sanity-checks
        ▼
  ② APPROVE  ◀── Danny (Governor), assisted by ChatGPT     ◀═══ nothing builds before this
        │
        ▼
  ③ Build   (Claude = single writer)
        │    → Figma component + variables via MCP
        │    → same truth committed to Git (tokens / code)
        ▼
  ④ Record + version   (Claude)
        │    → records/<name>.md  (purpose · criteria · review date · spec · changelog)
        │    → bump version per §7 ; update CHANGELOG.md
        ▼
  ⑤ Post-build audit   (ChatGPT, independent, no write access)
        │    → built output vs original acceptance criteria ; discrepancies → Danny
        ▼
   In the library ✔  (only once it has a record)
```

**Gate discipline:** step ② is the hard gate. Also honor the repo golden rule — no commit/push/deploy without Danny's explicit "ready to deploy." Building into Figma and staging files locally is fine; committing to the shared repo waits for the word.

Worked example — adding **Boarding Status Badge** (Domain layer):
1. Claude Design writes `specs/domain/boarding-status-badge.md`.
2. Claude flags: "no semantic token for the `checked-out` state — spec uses a literal." → `boarding-status-badge.review.md`.
3. Danny + ChatGPT review; Danny approves (or sends back).
4. Claude adds the missing semantic token, builds the Figma component, stages the token commit.
5. Claude writes `records/boarding-status-badge.md`, bumps the component to `1.0.0`, updates `CHANGELOG.md`.
6. ChatGPT audits the built badge against the spec's acceptance criteria.

---

## 6. Governance-as-a-gate: what's mechanical vs. human

**Mechanical (a script says yes/no — no opinion):**
- **Token linter** — [`tools/lint-tokens.mjs`](./tools/lint-tokens.mjs). Enforces semantic-over-literal, alias integrity, naming, `$type` presence. Run: `node docs/design-system/tools/lint-tokens.mjs`. Exceptions must be *declared and reasoned* (`$extensions.ds.allowLiteral`), never silent.
- *(Later)* Every spec has an acceptance section; every shipped component has a record. Cheap to check with a script once volume justifies it.

**Human (judgment — Danny, assisted by ChatGPT):** the charter's four standing questions —
1. Is this visually consistent?
2. Is this accessible?
3. Does this add unnecessary engineering complexity?
4. Six months from now, will we be glad we built it this way?

If any answer is "no," refine before it enters the system.

---

## 7. Versioning & records

Semantic-style versions per component and for the system (charter §07):
- **MAJOR** — breaking change to a component's contract/API.
- **MINOR** — additive: new variant, new prop, backward-compatible.
- **PATCH** — fix or refinement, no interface change.

Every component carries a record ([`records/_TEMPLATE.md`](./records/_TEMPLATE.md)): purpose · acceptance criteria · review date · link to spec · changelog. The system keeps a top-level [`CHANGELOG.md`](./CHANGELOG.md). Version bumps are decided at governance review, not ad hoc.

**When to add the acceptance-check CI (the deferred "phase 2"):** once ~3 components have shipped through this flow and the spec/record shape has stopped changing. Then wire the linter + a record/spec presence check into a pre-commit hook or CI so the mechanical gates run automatically. Not before — you'd be maintaining CI for a pipeline you haven't pressure-tested.

---

## 8. File map

See [`README.md`](./README.md) for the full authored-source → generated-package model. In short:

```
design-system/                          ← AUTHORED · governed (source of truth)
├── README.md                           ← the map + authored-vs-generated principle
├── GOVERNANCE.md                       ← this file (operating model)
├── Petappro — Design System Governance.pdf   ← the charter (standard)
├── CHANGELOG.md                        ← system-level changelog
├── tokens/                             ← authored DTCG token source (*.tokens.json)
├── tools/lint-tokens.mjs               ← mechanical gate (semantic-over-literal etc.)
├── specs/                              ← contracts (Objective→Requirements→Acceptance)
│   ├── _TEMPLATE.md · foundations/ atoms/ patterns/ domain/ templates/
└── records/_TEMPLATE.md                ← per-component records (no record → not in library)

packages/                               ← GENERATED / implemented · consumed by app (Claude Code)
├── tokens/   ← generated from design-system/tokens (never hand-edited)
└── ui/       ← component library implementing approved specs
app/                                    ← Expo app; imports @petappro/tokens + @petappro/ui
```
