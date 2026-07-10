# Provider Settings — Information Architecture & Surface Strategy

**Status:** Draft for alignment (Cowork, 2026-07-10). Feeds decisions D-041…D-046 (see `docs/decisions/open_decisions.md`).
**Purpose:** Map the full provider configuration surface — what a provider sets up and where — so the team aligns before build. Anchors the "Services Settings / CMS," hours-of-operation, report-card, secure-access, and availability work that came out of the drop-in / in-home-sitting scoping.

---

## 0. Surface strategy — web portal + native app (one backend)

**Recommendation: yes, providers get a web portal** (login tied to their provider record) that is **the configuration/editor surface**. The **native app stays basic** — operational use (bookings, check-in/out, report cards, messaging) plus light device preferences (e.g., notifications). Both are clients over the **same Supabase provider DB** — not two systems. This mirrors how Woof WeTreats already works.

**Danny's call (2026-07-10):** **all provider editing is online**, via their **subscription-management portal** (same login that manages billing). **In-app "settings" is merely app preferences** — notifications and **location sharing** (the latter for future walkers / house sitters, tied to the GPS v1.1 fast-follow). The app is not a config editor at launch — this deliberately shrinks MVP app scope and keeps the store-fee posture clean (§0 fee note, D-042).

Two reasons it's the right call, not just convenience:

1. **Config is content-heavy.** Service cards, report-card templates, body copy, photo uploads, pricing tables, T&C — all painful on a phone, natural on web. The web portal is the setup/admin surface; the app is the operational surface.
2. **Billing must live on web to stay off Apple/Google's cut.** PetAppro's provider subscription is **B2B SaaS**, which Apple has allowed to skip In-App Purchase since its 2022 cloud/B2B expansion; and as of the May 2025 post-Epic order, US apps may also place external purchase links in-app. Selling/managing the subscription on the **web** keeps 100% of it (no 15–30% IAP commission). *(EU caveat: an app can't offer both Apple IAP and external payment in the same binary — handle per-region later; US-first is clean.)*

### Surface split (who edits what, where)

| Setting area | Web portal | Native app | Notes |
|---|---|---|---|
| Subscription / billing | **Primary** | link out only | Stripe Billing on web = off IAP |
| Business & account setup | **Primary** | — | onboarding lives on web |
| Services Settings / CMS (service cards, report-card templates) | **Primary** | — | content-heavy → web-only for MVP |
| Hours of operation + off-hours surcharge | **Primary** | — | powers public services page |
| Pricing (rates, tiers, travel fee, extra-pet) | **Primary** | — | per D-039 |
| Availability rules (conflict groups) | **Primary** | — | |
| T&C / policies | **Primary** | view | template + tokens (D-009) |
| Device preferences (notifications, location sharing) | — | **Primary** | the app's only "settings" for MVP; location sharing → GPS v1.1 |
| Secure access codes (per booking) | — | **entered in app** | at the booking, biometric-gated |
| Day-to-day ops: bookings, check-in/out, report cards, messaging, calendar | link out | **Primary** | app is the operational surface |

**MVP scope (Danny, 2026-07-10):** **all editors are web** — billing, onboarding, Services CMS, hours/pricing/T&C, availability. The app carries **operations + basic device prefs only** (no config editors at launch). In-app editing is post-MVP. Cleaner split, smaller app scope.

---

## 1. Settings structure (top-level map)

```
Provider Portal
├── Account & Business
│   ├── Business profile (name, logo, theme)         → D-040 theming
│   ├── Hours of operation                            → §2
│   └── Subscription & billing (Stripe Billing, web)  → D-020
├── Services Settings (CMS)                            → §3
│   ├── Service catalog (which services offered)
│   ├── Service card editor (per service)
│   └── Report-card template editor (per service)     → §4
├── Pricing                                            → D-039
│   ├── Base rates + rate tiers (holiday/extended)
│   ├── Flat surcharges (extra pet, puppy)
│   ├── Travel fee (flat — MVP)                        → §2
│   └── Off-hours surcharge                            → §2
├── Availability                                       → §5
│   └── Conflict groups (overnight-exclusive vs overlap-ok)
├── Policies / Terms                                   → §2, D-009
│   └── Boilerplate T&C + provider-token clauses
└── Team (staff/roles)                                 → D-032/D-033
```

---

## 2. Hours of operation + off-hours surcharge

**Fields (Account & Business → Hours):**
- `provider_open` / `provider_close` (per weekday; allow closed days)
- `offhours_enabled` (toggle)
- `provider_offhours_surcharge` (flat $ — per D-039, an explicit amount, not a %)

**Why we need hours regardless:** the public services/pricing page displays them, so this isn't off-hours-only overhead.

**Client-facing clause (tightened — agreed *before* service, not billed after):**

> By requesting a service outside **[provider_name]**'s standard hours of **[provider_open]–[provider_close]**, you agree that an additional off-hours service charge of **$[provider_offhours_surcharge]** applies to that booking. This charge is shown and confirmed at booking, before the service is performed.

**Snapshot-on-booking rule (important):** the applicable **hours + off-hours surcharge amount are copied onto the booking at creation** (immutable), the same way we snapshot the pricing breakdown. Editing settings later must never rewrite a past agreement. Applies equally to travel fee and rates.

**Boilerplate T&C:** add a matching off-hours clause to the template terms (D-009), populated from the same tokens.

---

## 3. Services Settings (CMS) — per-service card editor

Provider-facing CMS (like Woof's home-page editor) under a **"Services Settings"** page; each service opens a tab/popup to edit its **service card** and its **report-card template**. Content model per service card (to be finalized — this list determines which editors we build):

- **Body copy editor** — service description shown to clients (rich-ish text).
- **Photo uploader** — hero/gallery image(s) for the card.
- **Pricing display** — pulled from Pricing (§ D-039), not re-entered.
- **Report-card template** — see §4.
- **Household-tasks offered** (house-sitting/in-home) — see §6.

> Open question for the team: exact fields per card. Recommend we spec one service card end-to-end (boarding) as the reference, then clone the shape.

---

## 4. Report cards — templated, per service, edit-locked

- **Templates per service** (drop-in, walk, sitting, boarding) with a **starter checklist**; provider customizes via a **checklist editor** (add/remove items) — not raw open text.
- Always include a **free-text notes** field + **photo** attachment.
- **Edit-lock model:** a booking's report card is a **mutable draft the provider edits up until the booking is marked complete, then it locks into an immutable snapshot** both sides see permanently. Client is **always read-only**. (Provider edits the *template* in settings anytime — separate from a booking's locked instance.)
- Check-in / check-out: arrival & departure buttons produce **timestamps visible on both sides** + notify the client (same pattern as boarding arrival/departure).

---

## 5. Availability — conflict groups

Model each service with an exclusivity property so overlaps are handled correctly:

- **Overnight-exclusive group (mutually exclusive):** in-home sitting, house sitting, boarding — a provider **cannot** hold two of these for overlapping dates (one body, one location overnight). This is **per booking, not per pet**.
- **Non-blocking services (overlap allowed):** dog walking now; training, grooming, others later — these **can** be scheduled *during* a multi-day sit (a sitter can step out to walk another dog).
- **Provider override:** let the provider explicitly check which services block vs. overlap, for edge cases.

Logged as a **build requirement** (D-045). This is the one genuinely new piece of scheduling logic for the drop-in / sitting verticals.

---

## 6. Household tasks — two-sided toggle boilerplate

Standard house-sitting extras (industry norm is "clarify per home," so we ship a boilerplate list, not priced services). **Provider offers → client confirms needed = two-sided agreement**, and confirmed items flow into the report-card checklist.

Boilerplate list (provider toggles "offered"; client toggles "needed"):
- Collect mail / packages
- Water plants (indoor / outdoor)
- Take trash & recycling to curb
- Rotate lights (on/off for occupancy look)
- Basic home security / leak check
- Light tidying (optional)

Not priced individually for MVP — presented as included courtesy tasks; a provider can fold cost into their sitting rate.

---

## 7. Secure access storage (key / codes)

- **Encryption at rest** for access fields (lockbox / alarm / gate codes, entry instructions) — non-negotiable; never stored or logged in plaintext.
- **Biometric reveal gate** (Face ID / re-auth to display a code in the app) — ties into D-031 step-up; not a substitute for encryption.
- **Transparency:** the input form tells **both provider and client** how the data is stored and protected (e.g., "Encrypted and only shown to your assigned provider, unlocked with Face ID"). Logged in D-044.

---

## 8. Open items for Codex (data-model confirmation)

1. Does the booking/data model already carry a **per-visit** and **per-night** service with a **location** attribute (drop-in vs in-home sitting reuse)?
2. Is **availability/conflict** handling already in scope for boarding overlaps (so §5 is an extension, not net-new)?
3. Confirm the **snapshot-on-booking** pattern (hours, off-hours, travel fee, rates) matches the pricing-breakdown snapshot already implemented.
4. Multi-visit-per-day support for drop-ins (N check-in/out + report cards per day).
