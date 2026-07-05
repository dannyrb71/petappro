# PetAppro — ChatGPT Project-Manager Handoff Kit

Use this to make ChatGPT your ongoing project manager, and to pass work between ChatGPT (planning) and Claude Code / Codex (building). There is no direct connection between the AIs — **the shared documents + these copy-paste prompts are the bridge.**

---

## One-time setup (do this once)

1. In ChatGPT, click **+ New Project** (left sidebar) and name it **PetAppro**.
2. **Upload these files** into the Project so ChatGPT can read them every time:
   - `PetAppro-Strategy-and-Business-Plan.md`
   - `PetAppro-Roadmap-and-Project-Plan.md`
   - `PetAppro-Tooling-and-Automation.md`
   - `PetAppro-AppStore-Setup-Walkthrough-for-Beginners.md`
   - `AGENTS.md` and `CLAUDE.md`
3. Start a chat **inside the Project** and paste the **Master Briefing Prompt** below.
4. From then on, do all PM work inside that Project so the docs stay in context.

> Keeping in sync: whenever a plan changes, ask ChatGPT to "output an updated version of the roadmap doc," download it, and re-upload it to the Project (replacing the old one). That keeps ChatGPT, Claude Code, and Codex all reading the same truth.

---

## 1. MASTER BRIEFING PROMPT (paste once, at the start)

```
You are the Project Manager for PetAppro, a native iOS + Android booking app
being built by a solo, non-technical founder (Danny). I've uploaded the full
strategy, roadmap, tooling plan, and app-store guide to this Project — treat
them as the source of truth and read them before answering.

Key facts:
- We are converting a live web app (Woof WeTreats: Next.js + Supabase) into a
  native app using Expo/React Native, reusing the Supabase backend. We EXTRACT
  and generalize proven logic; we do NOT rewrite from scratch.
- Target public launch: October 1, 2026. Hard app-store submission deadline:
  ~September 10. Store accounts + D-U-N-S must start in early August.
- Business model: providers pay a monthly SaaS subscription; their clients pay
  them via Stripe Connect. Subscriptions are sold on the web, never in-app (iOS).
- The coding is done by Claude Code (primary developer) and Codex (reviewer +
  async tasks). You do NOT write production code — you plan, track, and write
  clear task prompts for those tools.

Your job as PM:
1. Keep the roadmap and backlog current and realistic against the Oct 1 date.
2. Break work into small, well-scoped tasks with clear acceptance criteria.
3. When work is ready to build, write a copy-paste prompt for Claude Code or
   Codex (I'll paste it over myself).
4. Flag schedule risks early and tell me the trade-offs in plain English.
5. Explain things simply — assume I'm new to software projects.

Start by reading the docs and giving me: (a) a 5-line status of where we should
be right now given today's date, and (b) the single most important thing I
should do this week. Then wait for my direction.
```

---

## 2. WEEKLY STATUS / STANDUP PROMPT (paste every Monday)

```
It's the start of a new week. Based on the roadmap in this Project and today's
date, give me:
1. Which phase/sprint we should be in right now.
2. What should already be done (and I'll tell you what actually is).
3. The top 3 things to accomplish this week, in priority order.
4. Any risk to the Oct 1 launch, and what to do about it.
Keep it to one page, plain English.
```

---

## 3. "WRITE A DEV TASK" PROMPT (when something is ready to build)

Use this to turn a roadmap item into a prompt you paste into Claude Code or Codex.

```
I'm ready to build: [name the feature or story, e.g. "extract the pricing engine
into one shared package with tests"].

Write a complete, copy-paste-ready prompt I can give to Claude Code. It should:
- Reference the relevant rules from CLAUDE.md (plan before coding, tests first,
  additive migrations, multi-tenant/RLS, one shared pricing package, etc.).
- State the goal, the acceptance criteria, and what "done" looks like.
- Tell it to propose a plan and wait for my approval before writing code.
- Be specific enough that a developer could act on it without guessing.
Output ONLY the prompt, in a code block, so I can copy it cleanly.
```

---

## 4. "REVIEW / QA TASK" PROMPT (for Codex, the reviewer)

```
Claude Code just finished: [what was built]. Write a copy-paste prompt for Codex
to independently review it. Focus the review on: money logic (pricing/booking
must match the regression tests and never diverge between client preview, staff
edit, and server booking), security (RBAC + RLS + multi-tenant isolation), and
whether sensitive writes go through server actions/Edge Functions rather than
direct client DB writes. Output only the prompt in a code block.
```

---

## 5. BACKLOG GROOMING PROMPT (when priorities shift)

```
Here's what changed: [describe the change — new idea, a delay, feedback, etc.].
Update our plan: tell me what moves, what gets cut or deferred, and whether Oct 1
is still realistic. If something has to give, use the de-scope order from the
roadmap doc (never cut multi-tenancy, RBAC/RLS, the shared pricing package, or
its tests). Then give me a revised Now / Next / Later list.
```

---

## 6. SPRINT PLANNING PROMPT (every 2 weeks)

```
Plan the next 2-week sprint. Based on the roadmap and where we actually are,
give me: the sprint goal, the specific stories to include (with effort S/M/L),
what's explicitly out of scope this sprint, and the one milestone this sprint
must hit to keep Oct 1 on track. Assume I have limited hours and the coding is
done by AI agents that I supervise.
```

---

## 7. "EXPLAIN THIS TO ME" PROMPT (whenever you're lost)

```
Explain [term or decision] to me like I've never built software before. Tell me
what it is, why it matters for PetAppro, and what I actually need to do about it.
Short and plain.
```

---

## 8. RISK / DEADLINE CHECK PROMPT (use anytime you're worried)

```
Given today's date and our roadmap, are we still on track for an Oct 1 launch and
a ~Sept 10 store submission? Be honest. If we're behind, tell me exactly what to
do this week to recover, and what the fallback is if we can't.
```

---

## The full loop, in one picture

```
ChatGPT (PM)  ──writes a task prompt──▶  YOU  ──paste──▶  Claude Code (builds)
     ▲                                                          │
     │                                                          ▼
     └──you report what happened / upload updated docs──  Codex (reviews)
```

- **ChatGPT** = plans, tracks, writes prompts. (Low-effort for you; it does the thinking.)
- **You** = carry prompts between them + do the real-world steps (LLC, store accounts) + final approval.
- **Claude Code** = builds.
- **Codex** = reviews + async grind.
- **The .md docs** = the shared memory all of them rely on. Keep them updated.

---

## Tips to save your effort

- Do PM work **inside the ChatGPT Project** so you never re-explain context.
- When ChatGPT gives you a dev prompt, paste it into Claude Code **as-is** — don't summarize it, or you lose the detail that keeps the build correct.
- About once a week, ask ChatGPT to **regenerate the roadmap doc** and re-upload it, so the plan never drifts from reality.
- If you ever want me (Claude, here) to refresh any of the source docs or add a new one, just ask — then upload the new version to your ChatGPT Project.
```
