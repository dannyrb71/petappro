# PetAppro AI Build Operating Model — SUPERSEDED

> **This document has been merged into the canonical tooling doc:**
> **`docs/planning/PetAppro-Tooling-and-Automation.md`** (see §0 "Build workflow & decision gates" and §1 "Who does what").
>
> Everything here — the one-source-of-truth rule, the tool-role table (Claude Code = builder; ChatGPT/Codex = strategy/review), the planning-to-build loop, and the decision gates — now lives there, alongside the current research-backed dev/PM recommendation and the automation plan. Kept as a stub for history; do not edit. Update the canonical doc instead.

## Quick reference (unchanged)
- Planning source of truth: `docs/` (or Notion). Engineering source of truth: the GitHub repo.
- Main builder: **Claude Code.** Strategy / PM / review: **ChatGPT / Codex.**
- Do not let Claude Code implement until the decision gates are clear (role, tenant scope, tables, RLS, UI states, notification/payment/legal impact, verification plan).
- Small feature slices; one branch per feature; local testing before any Netlify deploy; keep decisions in `docs/`, not chat.
