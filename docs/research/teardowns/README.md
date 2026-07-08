# Competitive Analysis & Intelligence

Home for PetAppro's competitive work. **Experience-first, not feature checklists.** We tear down how competitors *feel* to use across the moments that matter, and turn that into a strategy tool: why someone switches to PetAppro.

**Status:** Active · Owner: Cowork (PM) · Informs: DR-2 (archetypes), DR-5 (pricing), flows, DS, investor materials
**Related:** `../research-log.md`, `../../planning/feature-ideas-log.md`, `../../decisions/open_decisions.md`

---

## 1. Goal — experience-first teardowns

Evaluate each competitor across the **experience dimensions**, not a feature grid:

1. **Onboarding** — signup → first value; friction, forced steps, "show value before asking for commitment."
2. **Trust & safety** — how they earn confidence (profiles, verification, records, transparency).
3. **Scheduling & availability** — calendar, capacity, per-service control (our wedge — see F-012/F-014/F-016/F-018/F-019).
4. **Payments** — how money moves; payout/charge clarity; deposits/tips.
5. **Communication** — messaging, updates, notifications, sender clarity.
6. **Pricing transparency** — what the user sees vs. hidden fees (feeds **DR-5 pricing study** — capture each competitor's pricing *model* as a column).
7. **Cancellation & changes** — editing/canceling bookings, recurring changes, penalties.
8. **Ops workflow** — daily run-the-business flow for the provider (schedule, records, care notes).

**Rubric (adopted from Danny's Fall-2024 class analysis — see `prior-class-analysis-2024.md`):** for each app, score **Easy to Understand · Easy to Navigate · Consistency · Helpful Feedback**, with concrete friction notes.

---

## 2. Competitor set

**Core — provider-software (who we actually compete with):**

| Competitor | Angle |
|---|---|
| **Time To Pet** | In-home leader; transparent self-serve pricing |
| **Gingr** | Facility/enterprise; feature-heavy |
| **Precise Petcare** | Established provider ops tool |

**Anti-marketplace contrast (sharpen why we're *not* them):**

| Competitor | Angle |
|---|---|
| **Rover** | Marketplace; provider software pain already mined (`rover-app-store-reviews.md`) |
| **Wag** | Marketplace; higher commission than Rover |

> **Set change (2026-07-07):** earlier discovery set was Gingr / Goose / Time To Pet / PetPocketbook. Now **Time To Pet / Gingr / Precise Petcare + Rover/Wag contrast** (Danny). Goose & PetPocketbook dropped from the core; revisit if relevant.
>
> **Prior class analysis (archived reference):** Danny's Fall-2024 Rover-anchored study covered **Wag, Care.com, PetBacker, PetSmart, Wag Hotels** — kept as reference in `prior-class-analysis-2024.md` + `assets/`, not the current core set.

---

## 3. Guardrails to test against

Every teardown should **sharpen our differentiation**, not just describe theirs:

- **D-029 — never a marketplace.** We're booking software; they broker/match. Note where their model creates the pain we avoid (commissions, take-rate, race-to-bottom, provider-as-commodity). *Evidence from the class PDF: PetBacker 25–30% commission; Wag ~2× Rover fees; Care.com marketplace confusion.*
- **D-026 — invite/QR only, no directory.** We have no public provider search. Note where their discovery/search model works against providers (undercutting, "update your calendar" spam, being one of N results).

---

## 4. Two scorecards (per the ChatGPT/PM proposal)

1. **Current State** — how each competitor performs *today* across the 8 dimensions + rubric. (`_scorecards.md`)
2. **PetAppro Target** — how we intend to outperform them over 12–24 months. This is a **product-strategy tool**: it answers "what makes someone switch?" and is downstream of the JTBD wedge + `feature-ideas-log.md`.

---

## 5. Competitive Intelligence — living, not one-time

Treat this as an ongoing repository, refreshed quarterly (or before investor meetings). Track over time: new feature releases · pricing changes · AI announcements · funding/acquisitions · App Store rating trends · customer complaints & praise · UX shifts · strategic pivots.

**Single source of truth — no mirroring (Danny, 2026-07-07).**

- **Repo `docs/research/teardowns/` is the one source of truth.** Content lives here only. This is version-controlled and feeds specs/DS/flows.
- **Notion "Competitive Analysis"** does **not** duplicate this — it holds a **link/pointer** to the repo (and, where a readable investor view is needed, that view is *generated from* here, not separately maintained).
- **Deck (PPTX)** = generated, versioned artifact (v1, v2…) produced from this master at milestones/investor moments. Not a second source.
- **Rule:** never copy content into two places. One home per artifact; everywhere else references it — going forward and retroactively.

---

## 6. Contents

| File | Purpose |
|---|---|
| `_template.md` | Copy to start a competitor teardown (experience-first) |
| `_scorecards.md` | Current-State + PetAppro-Target scorecard templates |
| `prior-class-analysis-2024.md` | Danny's Fall-2024 Rover competitive analysis — methodology + carry-over insights |
| `rover-app-store-reviews.md` | Rover review mining (App Store + Play + Reddit) — provider software pain |
| `assets/` | Source PDFs, screenshots |
