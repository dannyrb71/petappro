# PetAppro Design Research

Home for design research — the divergent, exploratory work that produces **evidence** for design and product decisions. This thread feeds the design system and `docs/decisions/open_decisions.md`; it does not make binding decisions itself.

**Workspace home:** `/Users/dannybaker/Documents/Base509/Products/petappro/docs/research`

**Status:** Phase 0 — Discovery (in progress).

**Related docs:** `docs/planning/product_brief.md`, `docs/roadmap/mvp_roadmap.md`, `docs/decisions/open_decisions.md`, `docs/design-system/`

---

## What belongs here

- **Competitor & reference teardowns** — UX and interaction pattern reviews of comparable pet-care and booking apps (`teardowns/`).
- **User & market research** — needs, pains, and behaviors of the two audiences: **providers** (paying subscribers) and their **clients** (booking + paying via Stripe Connect).
- **Pattern exploration** — interaction/flow investigations tied to a specific open question.
- **Synthesis** — findings distilled into themes and recommendations that hand off to the DS or a spec.

## What does not belong here

- Design-system tokens, components, or governance → `docs/design-system/`
- Finalized product/architecture decisions → `docs/decisions/open_decisions.md`
- Feature specs → `docs/specs/`

---

## How to work this thread

1. **Every research item names the decision it informs.** No open-ended studies — each question is time-boxed to something it's meant to unblock, so research stays tied to the **Oct 1, 2026** launch.
2. **Log it.** Add a row to `research-log.md` when a question opens; update status as it moves.
3. **Hand off.** When a finding is ready to act on, link it into `open_decisions.md` (as evidence for a decision) or the relevant DS/spec doc.
4. **Single source of truth — no mirroring (Danny, 2026-07-07).** This repo folder is the one home for research/competitive content. Notion, decks, and any other surface **reference or are generated from** here — they never hold a second copy. One home per artifact, going forward and retroactively.

---

## Contents

| File / folder | Purpose |
|---|---|
| `research-log.md` | Running index of every research question, its status, and the decision it informs |
| `teardowns/` | Competitor and reference-app teardowns |
| `teardowns/_template.md` | Copy this to start a new teardown |
| `synthesis/` | Cross-study themes and recommendations |
