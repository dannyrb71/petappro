# Cursor Project Instructions: PetAppro

> **Canonical project rules live in `/CLAUDE.md` and `/AGENTS.md` at the repo root** (auto-read by Claude Code and Codex). This file is **Cursor-specific setup + a session-start prompt** — it must stay consistent with those two. If anything here ever conflicts with `/CLAUDE.md`, `/CLAUDE.md` wins. Reusable task prompts are in `docs/prompts/claude_code_prompt_pack.md`.

## Project Home

PetAppro is a product of **Base509 LLC** and lives here:

`/Users/dannybaker/Documents/Base509/Products/petappro`

This folder (the PetAppro product repo) is the single source of truth for PetAppro local planning and build work. Company-level material (legal, banking, taxes, insurance, contracts) lives one level up under `/Users/dannybaker/Documents/Base509/`.

## Tool Roles

- ChatGPT: product strategy, architecture, roadmap, UX planning, prompt design, review.
- Cursor/Claude: local file editing, implementation, terminal commands, testing, Git operations.
- GitHub: version control once a repo is created.
- Supabase: auth, database, storage, Edge Functions.
- Netlify: web/admin deploys when approved.

## Core Product Direction

PetAppro is a multi-tenant SaaS platform for independent pet care businesses.

It should provide software for booking, staff operations, client management, pet profiles, notifications, payments, and business customization.

PetAppro should not position itself as:

- an employer
- a marketplace operator
- a broker
- an agency
- the provider of pet care services

Each subscribed business remains responsible for its own services, clients, staff, taxes, insurance, pricing, legal policies, and disputes.

## Architecture Rules

- Build as one shared platform with tenant separation.
- Use `business_id` or an equivalent tenant boundary for all business-specific records.
- Do not use global admin emails or single-business assumptions.
- Staff/admin permissions must come from business memberships.
- Clients and staff should join a business through invite codes.
- Server-side booking and pricing must be authoritative.
- Client-side pricing is preview only.
- Store final booking totals and fee breakdowns.
- Keep payment, notification, and terms/audit records traceable.

## Reference App

Woof Wetreats is a reference app, not the architecture to copy blindly.

If present, the reference repo is here:

`/Users/dannybaker/Documents/Base509/Products/petappro/reference/woof-wetreats-reference`

or symlinked to:

`/Users/dannybaker/Desktop/woof-wetreats`

Use it to understand workflows and feature behavior.

Do not modify the Woof Wetreats repo unless explicitly instructed.

## Recommended Folder Structure

Use this structure:

```text
docs/
  planning/
  roadmap/
  specs/
  user-flows/
  design-system/
  decisions/
  prompts/
reference/
app/
```

## Before Coding

Inspect existing patterns first, then summarize:

1. Files likely affected
2. Data model and RLS impact
3. UI states needed (loading, empty, error, success, permission denied)
4. Verification plan

Implement only the requested scope. Prefer small feature slices over broad rewrites.

## Local Development Rules

- Run local tests and builds from `app/` once the app repo exists there.
- Do not deploy to Netlify unless explicitly approved.
- Do not commit secrets or `.env` files.
- Keep product decisions in `docs/`, not only in chat history.

## Useful Docs

- Operating model: `docs/planning/ai_build_operating_model.md`
- Rebuild plan: `docs/planning/woof-wetreats-to-petappro-rebuild-plan.md`
- Reference review: `docs/planning/woof-wetreats-reference-review.md`
- Claude Code prompts: `docs/prompts/claude_code_prompt_pack.md`

## Activate in Cursor

After this file exists, ask Cursor:

```text
Please read docs/prompts/cursor_project_instructions.md and use it as persistent guidance for this PetAppro workspace.
```

## Session Start Prompt

```text
You are helping with PetAppro (a product of Base509 LLC) in /Users/dannybaker/Documents/Base509/Products/petappro.

Read docs/prompts/cursor_project_instructions.md and follow it.
Treat reference/woof-wetreats-reference as read-only.
Before making changes, inspect the relevant docs and summarize impact.
Implement only the requested scope and prefer local verification over deployment.
```
