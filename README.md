# PetAppro Workspace

Single source of truth for PetAppro planning, specs, and build coordination.

**PetAppro is a product of Base509 LLC.** This repo lives at `/Users/dannybaker/Documents/Base509/Products/petappro`. Company-level material (legal, banking, taxes, insurance, contracts, annual compliance) lives one level up in the **Base509** company folder — see `../../README.md`.

## Folder Structure

```text
Base509/                        ← company home (Base509 LLC)
├── Company/ Finance/ Legal/ Marketing/ Archive/   ← company buckets (see ../../README.md)
└── Products/
    └── petappro/               ← THIS repo (own git repo → GitHub)
        ├── README.md
        ├── CLAUDE.md  AGENTS.md  TASKS.md
        ├── docs/
        │   ├── planning/       Product direction, rebuild plans, strategy, LLC guide
        │   ├── roadmap/        Roadmap (canonical) + dated delivery schedule
        │   ├── specs/          Feature specs and platform plans
        │   ├── user-flows/     User journeys and flow diagrams
        │   ├── design-system/  Tokens, brand assets, UI foundations
        │   ├── decisions/      Architecture and product decision records
        │   ├── prompts/        Reusable prompts for AI tools
        │   └── _archive/       Superseded/merged docs (kept for history)
        ├── reference/          Read-only reference material
        └── app/                Application source code once development begins
```

## Workflow

| Tool | Role |
|---|---|
| **Cursor / Claude Code** | Edit local files, implement features, run local tests, debug |
| **ChatGPT** | Planning, architecture, specs, prompts, and review |
| **GitHub** | Version control once the app repo is created under `app/` |
| **Supabase** | Auth, Postgres, storage, Edge Functions, RLS |
| **Netlify** | Hosting and deploy previews when ready |

### How work moves through the workspace

1. Define product direction or a feature in ChatGPT.
2. Save decisions and specs under `docs/`.
3. Turn specs into implementation prompts in `docs/prompts/`.
4. Build in `app/` with Cursor or Claude Code.
5. Run local tests and builds from `app/` before any deployment.
6. Use GitHub for commits, branches, and PRs once the app repo exists.

## Reference Material

`reference/woof-wetreats-reference` is a symlink to the Woof Wetreats app. Use it as a behavioral reference only. Do not modify that repo from this workspace.

## Getting Started in Cursor

1. Confirm `docs/prompts/cursor_project_instructions.md` exists in this workspace.
2. Ask Cursor to load it as persistent guidance:

```text
Please read docs/prompts/cursor_project_instructions.md and use it as persistent guidance for this PetAppro workspace.
```

You can also paste or attach the file at the start of a session, or add its contents to Cursor project rules.

## Canonical source map (one owner per topic)

To avoid competing plans, each topic has one authoritative doc. Others cross-link to it.

| Topic | Canonical doc |
|---|---|
| Project rules for AI agents | `CLAUDE.md` + `AGENTS.md` (repo root) |
| Live task list | `TASKS.md` (repo root) |
| Product definition / positioning / scope | `docs/planning/product_brief.md` |
| Technical migration + data model | `docs/planning/woof-wetreats-to-petappro-rebuild-plan.md` |
| Business strategy / framework / GTM / launch / costs | `docs/planning/PetAppro-Strategy-and-Business-Plan.md` |
| Roadmap (phases/gates) | `docs/roadmap/mvp_roadmap.md` |
| Dated delivery schedule + schema starter | `docs/roadmap/PetAppro-Roadmap-and-Project-Plan.md` |
| Tooling / build workflow / automation | `docs/planning/PetAppro-Tooling-and-Automation.md` |
| App-store setup (beginner walkthrough) | `docs/planning/PetAppro-AppStore-Setup-Walkthrough-for-Beginners.md` |
| ChatGPT PM handoff + prompts | `docs/prompts/PetAppro-ChatGPT-PM-Handoff-Kit.md` |

Superseded (archived pointer stubs in `docs/_archive/`): `ai_build_operating_model.md`, `ai_tools_skills_and_plugins_plan.md` → merged into the tooling doc.

## Current Contents

- **Planning:** product brief, rebuild plan, reference review, **business & strategy plan**, **tooling & automation**, **app-store walkthrough**, **Base509 LLC formation guide**, user roles, notifications
- **Roadmap:** MVP roadmap (canonical, now with the Oct 1 timeline + store clock), Notion roadmap structure, dated delivery-schedule annex
- **Specs:** Platform, notifications, and activity history plan
- **Design system:** Color tokens and logo assets
- **Prompts:** Claude Code prompt pack, Cursor project instructions, **ChatGPT PM handoff kit**
- **Root:** `CLAUDE.md`, `AGENTS.md`, `TASKS.md`
- **App:** Empty placeholder until the application repo is scaffolded here
