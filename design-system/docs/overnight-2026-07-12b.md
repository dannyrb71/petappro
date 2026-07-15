# Overnight notes — 2026-07-12 (b): onboarding restructure + two new flows

Handled the items from Danny's end-of-day list. Summary + decisions for morning review.

## 1. Onboarding flow — restructured ✅
New flow is **4 steps** (was 5), Invite removed:
1. Create your profile — your info (1 of 4, 25%)
2. Create your profile — vet (2 of 4, 50%)
3. **Add your pets** (3 of 4, 75%) — now a **hub** (`557:2`) with an **"Add a pet"** dashed CTA + "add as many as you need" copy → leads to the **Pet details form** (`460:1161`, also 3/4). Pre-filled "Bella" removed (no more jumping ahead). Form's buttons are now **"+ Add another pet"** + **"Continue ›"** (no forced 2nd-pet loop).
4. **Standing care notes** (4 of 4, 100%) — moved to step 4 so it sits *on top of the basics*. **Quick Add removed** (it conflicted with the medical/allergies/temperament/feeding fields, which now live in the pet form; Allergies is a field there). Intro reworded to "…for each pet… sits on top of the basics you entered."
- **Invite a Partner screen deleted** — deferred to a Settings "Invite a partner" popup later, per Danny.
- Progress bars + step counters updated to /4. Screens repositioned in order at y=-2324: profile1 `454:1073`, profile2 `458:1106`, hub `557:2`, pet form `460:1161`, care notes `459:1133`, dashboard `462:1236`.
- Note: a stray "3 of 6" care-notes copy (`445:3249`, far left) was left untouched in case it's your WIP.

## 2. Care-notes document upload — DECISION: deferred
Danny asked whether to let owners upload their written care-notes docs in-app. **Decision: leave it OUT of onboarding** (you're intentionally shortening the flow, and only a small portion have docs). Better home: an **optional "Attach care document" affordance on the Pet Profile** later (attach anytime, not a signup gate). Keeps onboarding short; still serves the few who have docs. Easy to revisit.

## 3. Two new flows — built (styled from onboarding) ✅
**Flow 2 · Request a Meet & Greet** (launched from the dashboard CTA):
- `558:1507` Request — provider row, **Info Callout** explainer, "who's coming" pet chips, preferred-time chips, "Request meet & greet".
- `558:1595` Request sent — confirmation + **Success Callout** "what happens next" + Back to home.

**Flow 3 · New Booking** (unlocks after meet & greet):
- `559:1576` Service — **Service Selector** (Count=4) + rate card.
- `559:1654` Dates & pets — **customer Calendar** + pet chips.
- `559:1959` Review & confirm — summary card (dates/duration/pets + price breakdown + total) + Info Callout ("no charge until Pixie's accepts"), "Confirm & request".
All on the no-nav template, Surface-aware cards, theme tokens. Positioned to the right of the onboarding row (x≥4200, y=-2324).

## 4. Component cleanup — PLAN (not blind-executed) ⚠️
Deliberately did **not** auto-reflow the library — too risky without visual confirmation, and the reference kits are binary `.fig`. Proposed Atomic-Design organization to do together (or I can execute on your ok):
- **Foundations** — color/type/spacing/elevation variable docs (reference frames).
- **Atoms** — Text, Button, Input, Textarea, Avatar, Tag/Pill, Icon set, Segment.
- **Molecules** — Field, Chip, Search, Segmented/Selector, Callout, Day Cell, Stat Tile, Toast, Skeleton, Client List Row, Payment/InOut pieces.
- **Organisms** — Booking Card, Activity Row, Calendar (client/staff), Rates Card, Pet Profile Card, Notes Editor, Location Card, Chart Cards, Empty State, Confirm Dialog, App Bar, Bottom Tab Bar, Gender Select, Service Selector.
- **Patterns/Templates** — the 402×874 screen templates, Surface POC.
Each in a labeled Figma **Section**, one component (+ its variant set) per cell, laid out in a consistent grid, alphabetical within tier. Recommend we do this live so you can confirm nothing gets mis-sorted.

## Open for morning
- Confirm the hub → form → "Continue" wiring matches your mental model (hub is the "Add a pet" entry; form has add-another/continue).
- Meet & Greet time selection is chip-based (Weekday AM/PM/Weekend) — swap for a real time-slot picker if you want more precision.
- Give the go-ahead on the component reorg and I'll execute it.
