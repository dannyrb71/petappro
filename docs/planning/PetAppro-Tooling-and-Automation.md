# PetAppro — Dev Tooling & Automation Plan

How to split Claude Code, Codex, and (optionally) Cursor across the build, and how to automate the grind so the project moves without you hand-pushing every step.

> **Canonical for:** tool selection (dev vs PM), the build/review workflow, decision gates, and automation. This absorbs the earlier `ai_build_operating_model.md` and `ai_tools_skills_and_plugins_plan.md` (now superseded stubs pointing here). Agent *rules* live in `/CLAUDE.md` and `/AGENTS.md`; reusable prompts live in `docs/prompts/`.

---

## 0a. Tool routing rule (token optimization) — DEFAULT ON

**The core lever:** deterministic *scripting* is cheap; *model reasoning* costs tokens. Optimize by (a) preferring scripts for mechanical work, and (b) doing each task in the cheapest tool that fits.

**Standing habit (Claude in Cowork):** before any non-trivial task, open with a one-line **"best tool" call** — then proceed or recommend a hand-off:
- **Cowork** → files + judgment + connectors + interactive/visual work. Inside Cowork, use the **shell (scripts)** for anything mechanical (bulk renames, moves, `sed`/`git`, running tools) instead of reasoning file-by-file.
- **Claude Code (terminal)** → the app build, tests, migrations, bulk/scripted file ops, git. Script-first, token-efficient. The primary *developer*.
- **ChatGPT** → heavy, ongoing planning/roadmap/PM that shouldn't burn Claude tokens.

**Routing heuristics:**
| Task type | Send to |
|---|---|
| Repetitive / mechanical / bulk (rename many files, run tests, migrate schema) | Claude Code, or script it in Cowork |
| Judgment, writing, org/file structure, connectors, research | Cowork (script the mechanical parts) |
| Big ongoing thinking / roadmap grooming / status | ChatGPT |
| Independent review of money/security code | Codex |

**Caveat:** routing is by *task type*, not a live token meter — it's a smart heuristic, not a cost readout. You can always override ("just script it," "keep it here").

---

## 0. Build workflow & decision gates (folded from the operating model)

**Core rule:** one source of truth for planning (`docs/` or Notion), one implementation lane for code (the repo). Main builder = Claude Code; strategy/PM/review = ChatGPT/Codex.

**The loop:** define a feature in ChatGPT/Codex → save the decision/spec under `docs/` → turn it into a Claude Code prompt → Claude Code implements a small slice in the repo → runs local tests + summarizes → Codex/ChatGPT reviews the diff for product/architecture/money risk → fixes become new prompts → approved changes commit through GitHub.

**Decision gates — do not let Claude Code implement until these are clear** (carry these into every task prompt):
- User role(s) affected · tenant/`business_id` scope · data tables touched · RLS/security impact · primary + empty/loading/error/permission-denied UI states · notification/payment/legal implications · test/verification plan.

**Working agreements:** never ask an AI to "build PetAppro" as one task; small feature slices; one feature branch per feature; local testing before any Netlify deploy; keep decisions in `docs/`, not chat history; GitHub Issues only after a feature is defined enough to build.

**Skills/plugins philosophy (folded):** don't build custom skills or plugins first. Start with Markdown prompt packs (in `docs/prompts/`). Promote a workflow into a real skill only after it has repeated enough to be stable; build plugins only when a skill/prompt pack is genuinely insufficient. Candidate future skills once stable: `petappro-supabase-architect` (RLS/tenant review), `petappro-claude-code-brief` (spec→prompt), `petappro-release-review` (pre-deploy).

---

## 1. Recommendation: who does what

Current developer consensus (2026) is consistent and it maps cleanly onto your two-agent idea. In blind reviews **Claude Code produces the highest-quality, most idiomatic, best-structured code** and has the strongest whole-codebase reasoning — but its usage limits are tighter. **Codex is the cloud-first, async "autonomous grind" agent**: slightly lower peak quality, but higher usage allowance, runs sandboxed in the cloud without your machine, and is strong at batch tasks, DevOps, reviews, and audits (which is exactly what you already used it for). The dominant pattern among senior engineers is **using both**, not standardizing on one.

### The split

| Role | Tool | Why |
|---|---|---|
| **Primary developer / implementer** | **Claude Code** | Best code quality + architecture + whole-repo context. Put it on the money- and security-critical work: the shared pricing/booking packages, multi-tenant schema, RBAC/RLS. This is precisely where "cleaner, more idiomatic" pays for itself. |
| **Project manager + reviewer + async grind** | **Codex** | Cloud-async and higher usage limits let it run without you: keep the backlog moving, run test suites, do DevOps/CI chores, and — critically — **review Claude Code's PRs** (independent second-model check). It already proved its audit/review strength. |

### Why this direction (not the reverse)
- The Codex audit flagged **divergent pricing logic** as a top risk. Having the **model that didn't write the code review the money code** is a genuine safeguard. Claude writes the pricing engine → Codex reviews it (and vice-versa on Codex-built pieces). Two-model cross-review on financial logic is worth the extra step.
- Claude Code's tighter usage limits are less painful on *focused, high-value* implementation bursts than on the continuous, low-stakes grind — so give the always-on grind to Codex.
- Codex running async in the cloud is the closest thing to "a PM that keeps working while I'm asleep."

> Caveat the research is blunt about: ~43% of AI changes need debugging in prod, and the deciding skill is *your* ability to read and verify output. Keep your Woof habit — **manually test each feature in a real browser/device before it's "done."** The two-agent cross-review reduces, but doesn't remove, this.

### Do you need Cursor?
**Optional — add it only if you want a single visual workspace.** Cursor is an AI-native IDE that lets you switch models (including Claude and OpenAI models) in one editor and run background agents. It centralizes things and is great if *you* want to **review diffs and edit code visually** rather than living in the terminal.

- **Skip Cursor if:** you're comfortable letting Claude Code (terminal) + Codex (cloud) do the work and you review via GitHub PRs. This is the leanest, cheapest setup.
- **Add Cursor if:** you want one place to watch both agents, eyeball changes visually, and occasionally hand-edit. Budget the extra subscription + model usage on top.
- **Recommendation:** start **without** Cursor (Claude Code + Codex + GitHub PRs). If after Sprint 1–2 you feel you need a visual cockpit to stay oriented, add Cursor then — you'll know what you actually need.

### Subscriptions to budget
- **Claude Code:** the $20 tier hits limits fast on complex work; for the Sept crunch consider a **higher Max tier** so implementation isn't throttled.
- **Codex:** the $20 ChatGPT tier reportedly runs all day without hitting limits — fine as the always-on PM/reviewer.
- **Cursor (optional):** add later if you want the unified editor.

---

## 2. Instructional files (in the repo root)

Both agents read a project instruction file from the repo root. Create **both** so whichever agent is working has the same rules:

- **`CLAUDE.md`** — read by Claude Code.
- **`AGENTS.md`** — read by Codex (and Cursor, and most other agents).

Keep them nearly identical so the agents can't drift. Starter versions of both are delivered alongside this doc (`CLAUDE.md` and `AGENTS.md`). Core rules baked in (carried from your Woof discipline):
- Propose a plan before coding; no silent execution.
- **Never commit/push/deploy without explicit "ready to deploy."**
- Local-first; Supabase migrations additive-only.
- One shared pricing package — never a second copy; money changes require regression tests.
- Any component used more than once = a shared molecule (fix in one place).
- Generated DB types are the source of truth; no hand-rolled DB interfaces.
- RLS on every tenant table; a client login must never read another tenant's data or staff notes.

---

## 3. Automations — so you're not the one pushing every step

Layered from "set up once" to "runs continuously." Priority marked ⭐ for highest leverage.

### A. Repo & CI/CD (GitHub Actions) ⭐
- **On every PR:** typecheck + lint + **pricing/booking regression tests** + RLS tests. Nothing merges red. This is the single biggest "keeps quality up without you" lever.
- **On merge to `main`:** auto-deploy web (Netlify/Vercel) and trigger **EAS Build** for mobile.
- **EAS Submit** step to push builds to TestFlight / Play closed track automatically.
- **Dependabot/Renovate** for dependency updates (auto-PRs).

### B. Codex async cloud tasks ⭐
- Assign **batches** ("extract booking package," "add business_id + RLS to tables X–Z," "wire CSV export") that run in Codex's cloud sandbox without your machine on. You review the resulting PRs. This is your "PM that works overnight."
- Standing job: **auto-review each of Claude Code's open PRs** and post findings.

### C. Claude Code automation
- **Hooks** to auto-run tests/lint after edits and block on failure.
- Scoped **subagents** for repetitive passes (e.g., "generate DB types after every migration").
- GitHub app integration so Claude Code can be @-mentioned on issues/PRs.

### D. Supabase automation
- **Branch-per-feature** (preview databases) so migrations are tested before prod.
- Auto-generate + commit TypeScript types on schema change.
- Webhooks → Edge Functions for booking/payment events (already your pattern).

### E. Product/ops automations (Cowork scheduled tasks + connectors)
These I can set up for you here (some need a connector authorized first):
- ⭐ **Weekly roadmap check-in** (e.g., Monday 7am): pull GitHub PR/issue status + Notion board and post a one-page "what shipped, what's blocked, what's next, are we still on track for Oct 1" digest. *(Runs automatically once scheduled.)*
- **Daily standup digest** during the Sept crunch.
- **Store-review watcher** in September: daily reminder/status while apps are in review.
- **Beta-feedback triage:** summarize incoming design-partner feedback into the backlog.
- Notion auto-updates (task status from PR merges) — needs the **Notion connector authorized** (currently not connected in this session).

### F. Monitoring (so problems page you, not the reverse)
- **Sentry** alerts on errors; **Stripe webhook** failure alerts; **Supabase** log drains. Route to email/Slack so you hear about breakage without checking.

---

## 4. Suggested end-to-end workflow (one loop)

1. **You + Codex (PM):** groom the backlog in Notion; Codex drafts the next batch of stories with acceptance criteria.
2. **Claude Code (dev):** proposes a plan for the story → you approve → implements on a feature branch with tests.
3. **CI:** runs typecheck/lint/tests/RLS automatically on the PR.
4. **Codex (reviewer):** independent review of the PR (esp. money/security code) → comments.
5. **You:** manual real-device/browser check (keep this habit) → approve.
6. **Merge → CI auto-deploys web + triggers EAS build/submit.**
7. **Scheduled digest:** weekly status tells you if Oct 1 is still on track.

You stay in the loop only at **plan approval** and **final verify** — the rest runs itself.

---

## 5. First automations to turn on (this week)

1. GitHub Actions CI (typecheck + lint + tests) — do this in Sprint 1, before the refactor.
2. Codex standing PR-review job.
3. EAS Build/Submit pipeline (set up by early August so the store clock can start).
4. A weekly Cowork roadmap digest — **say the word and I'll schedule it** (tell me if you want it wired to GitHub/Notion, and authorize those connectors).
