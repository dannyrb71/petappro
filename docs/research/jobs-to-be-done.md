# PetAppro — Jobs To Be Done & Archetypes

Foundation doc for the design research thread. **Everything here is a working draft — edit freely.** JTBD statements feed archetypes; archetypes feed flows, specs, and DS decisions.

**Status:** Draft v0.1 · 2026-07-06 · Informs: `open_decisions.md`, `docs/design-system/`, user-flows
**Related:** `docs/planning/product_brief.md`, `research-log.md` (R-001)

---

## 0. Why JTBD (not features) first

We design for the *progress a person is trying to make*, not for the app's screens. A job is stable even when features change. PetAppro is **two-sided**: the **PCSP** (Pet Care Service Provider — the owner/buyer) is the reason the product exists, but clients and staff each "hire" the product for a different job. The product fails if any of the three breaks — so we anchor one **primary** job and treat the other two as **first-class supporting** jobs, not afterthoughts.

> **Decided — D-027 (2026-07-06):** Primary JTBD anchors on the **owner/PCSP** (buyer + operator). Client + staff are first-class supporting jobs.
>
> **The anchor governs prioritization, not attention.** Each supporting archetype **rises to primary within its own flows** — the client owns the booking/onboarding flow; staff own the daily-schedule flow. Anchor ≠ neglect. When a trade-off hits the Oct 1 date, the PCSP job breaks the tie.

---

## 1. Primary JTBD — Owner / PCSP (buyer + operator)

**Job story:**
> When I'm running my pet-care business day to day, I want one place that handles bookings, pricing, client and pet info, and my daily schedule the way my business actually works — so I can stop coordinating everything by text and spreadsheet and run a professional operation clients trust.

**The job has three layers:**

| Layer | What they're really after |
|---|---|
| **Functional** | Coordinate bookings, pricing, clients, pets, staff, and payments with one authoritative record — no double-entry, no lost details. |
| **Emotional** | Feel in control and unscattered; stop the low-grade anxiety of "did I miss a booking / a note / a payment?" |
| **Social** | Look legitimate and professional to clients; be trusted with their pet and their money. |

**Higher-level job (why this matters):** *Sustain and grow the business while spending my time on animals, not admin.*

---

## 2. 5 W's stress test (primary job)

| | Answer | Design signal it produces |
|---|---|---|
| **Who** | The owner — buyer *and* daily operator. Often also a hands-on sitter. | Setup + daily ops must both live on one person's phone. |
| **What** | Run daily operations authoritatively — not narrowly "book a pet." | Don't reduce the product to a booking form; the schedule + records are the job. |
| **When** | Recurring & interrupt-driven: booking comes in, client onboards, planning the day, enforcing a policy, chasing a payment. | Fast capture; resumable tasks; notifications that respect urgency vs. paper-trail. |
| **Where** | On a phone, in-home or on the facility floor, hands often full of animal. | Native-mobile, glanceable, one-handed, few-taps. Not a desktop admin panel shrunk down. |
| **Why** | Save time, avoid errors/disputes, look professional, keep client trust. | Errors and ambiguity are the enemy — server-authoritative totals, stored breakdowns, clear records. |

*(5 W's + How: **How** = configured to their own pricing/policies, so the product bends to the business, not vice versa.)*

---

## 3. Supporting JTBDs

**Client (pet owner):**
> When I need care for my pet from someone I trust, I want to book and keep everything about my pet in one simple place — so I don't have to text back and forth, and I know my pet's needs are on record.
> *Emotional:* reassurance my pet will be looked after. *Social:* being seen as a responsible owner.

**Staff (sitter / handler / front desk):**
> When I start a shift, I want to see exactly who's coming and what each pet needs — so I can run the day without chasing the owner for answers.
> *Emotional:* confidence I won't drop a detail. *Social:* being reliable to the owner and clients.

---

## 4. Archetypes — approach

**We use archetypes, not personas.** Personas encode a "typical" individual (name, age, stock photo), which quietly designs out anyone off-center — edge cases and non-majority users included. Archetypes are defined by **context + behavior + the job they're hiring us for**, so each one is a *spectrum*. Non-majority and edge behaviors are logged **against** an archetype as variations, not excluded.

**Every archetype captures:** context · primary job · what they need · failure mode (anti-goal) · **range** (the spectrum this archetype spans) · **edge behaviors** (known variations we must not design out).

### Provider-side (by operating style, not demographics)

**A. Solo Sitter** — one person, in-home, does everything themselves.
- *Job:* run the whole business from a phone with near-zero setup overhead.
- *Needs:* dead-simple onboarding, fast booking capture, low config burden.
- *Failure mode:* setup that assumes an office/desktop or a team.
- *Range:* pure solo → solo with an informal helper (spouse/friend).
- *Edge behaviors:* very low tech comfort; runs it as a side hustle around a day job.

**B. Growing Shop** — owner + a few staff, delegation starting to matter.
- *Job:* hand off the day to staff without losing oversight.
- *Needs:* shared schedule, staff vs. client-visible info, role scoping.
- *Failure mode:* everything routes through the owner as a bottleneck.
- *Range:* owner-still-hands-on → owner stepping back into management.
- *Edge behaviors:* seasonal/part-time staff; staff who share one device.

**C. Established Facility** — ~5–10 staff, front desk, higher volume.
- *Job:* enforce policy and run volume without chaos.
- *Needs:* reliable policy/terms enforcement, blocked dates, activity history, auditability.
- *Failure mode:* tools that don't scale past a handful of bookings/day.
- *Range:* single busy location → near multi-location (explicitly deferred at MVP).
- *Edge behaviors:* mixed service types; front-desk staff who never sit pets.

### Client-side (by need pattern)

**D. The Regular** — recurring boarder, knows the drill.
- *Job:* rebook fast without re-entering everything.
- *Needs:* saved pets/info, one-tap rebooking, clear history.
- *Edge behaviors:* books for multiple households (e.g. helps a parent).

**E. Anxious First-Timer** — new to boarding, needs reassurance.
- *Job:* trust a stranger with their pet.
- *Needs:* transparency, clear policies up front, meet-and-greet, confirmation.
- *Edge behaviors:* wants heavy reassurance; may abandon at friction.

**F. Multi-Pet Household** — several pets, complex needs.
- *Job:* get every pet's needs on record correctly.
- *Needs:* rich per-pet care notes, household grouping, medical/vet info.
- *Edge behaviors:* pets with meds/special diets; pets that can't co-board.

---

## 5. Open questions / next

- Confirm the anchor decision in §0 and record it in `open_decisions.md`.
- Replace archetype starters with evidence once competitor teardowns + any provider interviews land.
- Map each archetype to the jobs in §1–3, then to user-flows.
- Decide whether staff archetypes need their own set or fold into provider operating styles.
