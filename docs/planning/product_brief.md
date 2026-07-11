# PetAppro Product Brief

Planning document for Phase 0 product definition.

> **Reconciled 2026-07-10** to current decisions — D-001 (native/Expo), D-007 (Connect in MVP), D-015 (no deposits), D-022 (walking), D-023 (dual launch), D-028 (testing partner + MVP-complete), D-029 (no marketplace), D-030/D-040 (theming/white-label), D-032/D-033 (roles + app fork), D-034–D-038 (architecture), D-039 (pricing), D-041/D-042 (provider surface), D-043–D-046 (service mechanics), D-048 (vertical scope). Where this brief and the decision log disagree, **the decision log wins.**

> **Canonical for:** product definition, positioning guardrails, roles, and MVP feature scope. For **business strategy, framework choice, GTM, and launch** see `docs/planning/PetAppro-Strategy-and-Business-Plan.md`; for **technical migration + data model** see `woof-wetreats-to-petappro-rebuild-plan.md`. These are complementary, not competing — this brief governs *what/who*, the strategy doc governs *business/launch*, the rebuild plan governs *how technically*.

**Related docs:** `docs/prompts/cursor_project_instructions.md`, `docs/roadmap/mvp_roadmap.md`, `docs/planning/woof-wetreats-to-petappro-rebuild-plan.md`, `docs/planning/PetAppro-Strategy-and-Business-Plan.md`

---

## 1. Product Summary

PetAppro is a multi-tenant SaaS platform that gives independent pet care businesses their own software for bookings, client and pet management, staff operations, notifications, and payments — without PetAppro acting as the service provider.

Each subscribed business configures its own services, pricing, policies, branding, staff, and client access. Clients and staff join through invite codes. PetAppro is a **native iOS/Android app** (Expo/React Native + Supabase); providers configure everything and manage billing via a **web portal** (D-041). Within the PetAppro app, one shared operational database serves all its businesses with strict tenant separation by `business_id`; a thin **Base509 master** handles cross-app identity/billing while each app runs its own isolated operational DB (D-034–D-038).

The MVP targets small pet care operators — starting with **boarding, daycare, and dog walking** (drop-in visits as a stretch; in-home/house sitting as the first fast-follow — D-022, D-048) — who need reliable day-to-day operations software, not a marketplace or agency layer (D-029).

---

## 2. Problem Statement

Independent pet care businesses often run on a mix of texts, spreadsheets, calendars, and ad hoc tools. That creates friction across:

- **Booking and pricing** — manual quotes, inconsistent totals, no authoritative record of what was charged
- **Client and pet information** — care notes, vet details, and photos scattered across messages
- **Staff coordination** — no shared daily schedule or household-centered view of who is coming and what each pet needs
- **Policies and accountability** — terms, cancellations, and meet-and-greet rules hard to enforce consistently
- **Payments and follow-up** — cash/Venmo/check tracked informally; urgent alerts lost in email

Generic booking tools are not built for pet-care workflows (multi-pet households, meet-and-greets, care notes, blocked dates, staff-only notes). Building custom software per business does not scale. PetAppro solves this by productizing proven pet-care workflows into configurable, tenant-scoped software.

---

## 3. Target Customers

**Primary:** Small independent pet care businesses that offer boarding, daycare, and/or dog walking and want to replace manual coordination with dedicated software.

Examples:

- Solo or small-team in-home boarders and daycare providers
- Small facility-based boarding/daycare shops (roughly 1–10 staff)
- Operators who already manage clients directly and need invite-based client onboarding, not a public marketplace

**First testing partner (D-028):** Danny + Marco's own business (**Woof WeTreats**) is the first real testing partner — established client base, recurring boarding/daycare/walking bookings, staff who need a daily schedule, and an owner who configures pricing and policies. Once it runs a genuine booking end-to-end (incl. a real paid booking via Stripe Connect), recruit **5–6 additional PCSPs** as early partners.

**Not primary for MVP:** Large multi-location chains, grooming-only shops, marketplaces aggregating sitters, or businesses needing deep analytics, custom mobile apps per brand, or complex franchise hierarchies.

---

## 4. End Users

| Role | Who they are | Primary jobs |
|---|---|---|
| **Owner** | Business founder or principal | Create business, configure services/pricing/policies, manage staff, oversee operations |
| **Admin** | Trusted manager | Owner's operational access minus ownership/billing actions |
| **Manager** | Shift/team lead (graded tier) | Staff access plus limited management (D-032/D-033 nested roles) |
| **Staff** | Sitters, handlers, front-desk | View daily schedule, manage households, create/edit bookings, add staff notes |
| **Client** | Pet owner using one business | Onboard via invite, manage profile and pets, request bookings, view history and notifications |

The app is **one binary that forks to a Client or a Provider (graded) experience**; provider roles are **nested** Staff ⊂ Manager ⊂ Admin ⊂ Owner — a solo owner simply does the staff work (D-033). Auth is **passwordless-first** (Apple/Google/magic-link) with step-up MFA for sensitive actions (D-031/D-038), keyed to a stable Base509 account id rather than a raw email (D-035). Users may belong to one or more businesses through memberships; permissions come from business membership — not global admin emails.

---

## 5. Core Value Proposition

**For pet care businesses:** Run bookings, clients, pets, staff, and day-to-day operations in one place — configured for your business, your pricing, and your policies — without building custom software.

**For clients:** A simple, business-branded portal to manage pets, book services, and see booking history — tied to the business they already trust.

**For PetAppro as a product:** Prove that Woof Wetreats-grade operational workflows can be delivered as secure, multi-tenant SaaS that many independent businesses can subscribe to — with each business remaining legally and operationally responsible for its own services.

**Differentiators vs. generic tools:**

- Pet-care-specific workflows (households, meet-and-greet, care notes, pet photos, blocked dates)
- Server-authoritative booking and pricing with stored fee breakdowns
- Staff daily schedule grouped by activity
- Tenant-aware notifications and activity history
- Stripe Connect so each business collects its own payments (in MVP — D-007 Option A)

---

## 6. Why Woof Wetreats Is the Reference App

Woof Wetreats (`reference/woof-wetreats-reference`) is a working single-business pet care app with proven workflows — not the architecture to copy.

**Use it to understand:**

- How boarding/daycare booking, pricing preview, and confirmation feel in practice
- Client onboarding, pet profiles, and meet-and-greet gating
- Staff household dashboard and daily schedule patterns
- Care notes, staff-only notes, and pet photo handling
- Terms version stamping and activity-oriented booking cards

**Do not copy blindly:**

- Global admin email checks
- Single global pricing, settings, blocked dates, and notifications
- Storage paths and RPCs without tenant context

Woof Wetreats validates *what* to build. PetAppro defines *how* to build it for many businesses on one platform.

---

## 7. What PetAppro Is Not

PetAppro must not position itself as:

- An **employer** of sitters or staff
- A **marketplace** matching clients to anonymous providers
- A **broker** or intermediary in the care relationship
- An **agency** operating pet care on behalf of businesses
- The **provider** of pet care services

PetAppro provides **software**. Each business remains responsible for its services, clients, staff, taxes, insurance, pricing, legal policies, disputes, and local compliance.

PetAppro is also not, for MVP:

- A separate white-label app-store build per customer (Enterprise isolation is a **post-MVP** tier — D-030)
- An SMS/chat platform (beyond optional alert add-ons)
- A multi-vertical platform beyond pet care
- A replacement for accounting, payroll, or insurance systems

---

## 8. MVP Product Principles

1. **One platform, many businesses** — shared app and database with strict `business_id` separation; no per-customer database for MVP.
2. **Invite-code onboarding** — clients and staff join the correct business explicitly; no accidental cross-tenant access.
3. **Server authority** — booking creation and final pricing are computed server-side; client UI is preview only; totals and breakdowns are stored.
4. **Membership-based permissions** — roles (`owner`, `admin`, `staff`, `client`) scoped to business membership, not global emails.
5. **Preserve proven workflows** — carry forward Woof Wetreats patterns that work (schedule, households, care notes, terms stamping); rebuild what is single-tenant.
6. **Configurable, not hardcoded** — services, pricing, branding, and policies are per business; MVP may ship boarding/daycare first but must not trap the schema there.
7. **Traceability** — payments, notifications, terms acceptance, and booking changes should be auditable.
8. **Email for paper trail, not urgency** — receipts, confirmations, and policy records via email; urgent alerts via in-app (and optional SMS add-on).
9. **Local-first build discipline** — implement and test locally (Expo dev build) before any EAS build/release; backend on Supabase (D-001). No Netlify — that was the Woof WeTreats web app.
10. **Small slices** — ship focused features with clear specs; avoid "build the whole app" prompts.

---

## 9. MVP Feature Pillars

### Pillar A: Business Setup and Configuration

- Business profile, branding, and editable landing content (default theme **Brandy Blue**; custom themes are a higher-tier white-label perk — D-040/D-030)
- Service configuration (boarding, daycare, dog walking for MVP; drop-in visits as a stretch — D-048)
- Pricing rules — explicit rates + rate tiers, flat surcharges, flat travel fee, off-hours surcharge (D-039/D-043); blocked dates
- Business-specific terms/policies (template + provider-token clauses — D-009)
- Staff and client invite codes
- **Provider web portal** hosts all config (Services CMS, report-card templates, hours, pricing, T&C) + subscription/billing; the app is operations + basic device prefs only (D-041/D-042)

### Pillar B: Client Experience

- Invite-code onboarding and business-branded welcome
- Client profile, emergency contact, vet info
- Pet profiles, photos, and care notes
- Meet-and-greet flow (when enabled by business rules)
- Self-service booking with live pricing preview
- Activity history for completed/cancelled bookings

### Pillar C: Staff and Operations

- Household-centered client directory
- Daily schedule grouped by activity
- Booking creation and edits by staff
- Staff-only notes vs. client-visible information
- Meet-and-greet management and client blocked status
- Check-in / check-out (arrival & departure) with timestamps visible both sides + per-service **report cards** (templated, edit-locked on completion — D-046)

### Pillar D: Platform Core

- Multi-tenant auth, memberships, and RLS
- Centralized pricing engine (single source of truth)
- In-app notification center
- **Client→provider payments via Stripe Connect (D-007 Option A — IN MVP)**; manual payment tracking (cash/check/Venmo/Zelle/other) as fallback only
- Provider SaaS subscription billing is **web-only** — no in-app purchase or purchase-link/CTA (D-042); in-app client booking payments via Stripe are exempt (physical service)
- Terms/version stamping at booking time

### Pillar E: Optional at MVP (decide before build)

- SMS alert add-on for owner/staff urgent notifications

### Explicitly deferred

- Full in-app messaging and SMS conversation bridge
- Multi-location support
- Service types beyond the MVP set — **in-home & house sitting are the first fast-follow** (D-048); training, grooming later
- Complex permission hierarchies
- Deep analytics and reporting
- Custom native app per business

---

## 10. Success Criteria for the First Version

The first version succeeds when **Danny + Marco's own business (Woof WeTreats), the first testing partner (D-028),** can:

1. **Set up** its business — services, pricing, availability, branding, terms, invite codes
2. **Onboard staff** via staff invite codes and **onboard clients** via client invite codes
3. **Complete client onboarding** — profile, pets, policies, meet-and-greet if required
4. **Take boarding / daycare / walking bookings** — client self-service and staff-created, with server-calculated totals and stored breakdowns
5. **Run daily operations** — staff daily schedule and household detail with care notes
6. **Enforce business rules** — blocked dates, meet-and-greet gate, terms stamping
7. **Review history** — activity date picker for completed/cancelled bookings
8. **Receive in-app notifications** for operational events
9. **Record payments** — Stripe Connect client→provider payments (D-007 Option A, in MVP); manual payment status as fallback only
10. **Operate without cross-tenant data leakage** — verified tenant isolation

**Product success signals:**

- Owner spends less time on manual booking coordination than before
- Staff can run a day from the schedule view without external spreadsheets
- Clients can book and see their pets/bookings without texting for every step
- PetAppro can onboard a second business without architectural changes

---

## 11. Risks and Assumptions

### Assumptions

- Small pet care businesses will pay for operations software if it replaces manual work
- Boarding and daycare are sufficient to prove the platform for the first customer
- A **native iOS/Android app** (Expo/RN) with a **web provider portal** for config/billing is the right shape for MVP (D-001, D-041)
- One shared Supabase **operational** database with RLS is sufficient for PetAppro-app scale; cross-app identity/billing lives in the thin Base509 master (D-034–D-038)
- Woof WeTreats workflows are representative of the first testing partner's needs
- Invite-code onboarding is acceptable vs. public self-serve signup for clients

### Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Scope creep (payments, SMS, messaging) | Delays MVP | Lock scope in Phase 4 specs; defer add-ons explicitly |
| Copying Woof Wetreats single-tenant patterns | Security and scale failures | Architecture phase + RLS review gate before booking features |
| Pricing logic duplicated across layers | Incorrect charges, hard maintenance | Single shared pricing package; server authority |
| Unclear legal positioning | Business or user confusion | Clear copy: software only; business owns services and policies |
| ~~Platform decision delayed (web vs native)~~ | **RESOLVED: native/Expo + web provider portal (D-001, D-041)** | — |
| First tenant unique needs | MVP too narrow or too wide | Design partner feedback loop; document overrides as decisions |
| Over-reliance on email for alerts | Missed urgent events | In-app notifications in MVP; SMS as optional add-on |

---

## 12. Open Questions

Resolve before or during Phase 1–4 as noted.

| Question | Why it matters | Target phase |
|---|---|---|
| ~~Web-first, native-first, or web + native?~~ | **RESOLVED: native iOS/Android (Expo) + web provider portal (D-001, D-041)** | — |
| Can one user be client of Business A and staff of Business B? | Auth and membership model | Phase 1 |
| Are pet profiles shared across businesses or scoped per business? | Data model and client UX | Phase 1 |
| Is meet-and-greet required for all businesses or configurable? | Onboarding and booking gates | Phase 1–2 |
| Public booking page, invite-only portal, or both? | Client acquisition flow | Phase 0–2 |
| ~~Deposits at MVP or manual/full payment status only?~~ | **RESOLVED: no deposits (D-015)** | — |
| ~~Stripe Connect in MVP or post-MVP?~~ | **RESOLVED: IN MVP (D-007 Option A); subscription billing web-only (D-042)** | — |
| SMS alert add-on in MVP? | Notification infrastructure | Phase 4–5 |
| Terms/policies: fully editable, templates, or upload? | Business setup complexity | Phase 2–4 |
| First SaaS pricing and which add-ons are launch-ready? | GTM and scope (see D-020, D-039) | In progress |
| ~~Which business is the testing partner and what is their launch date?~~ | **RESOLVED: Danny + Marco's Woof WeTreats; launch Oct 1 / Oct 21 (D-028, D-023)** | — |

---

## Next Steps

1. Record answers to blocking open questions in `docs/decisions/`
2. Create user roles and permissions matrix (Phase 0 deliverable)
3. Mark Phase 0 exit criteria in `docs/roadmap/mvp_roadmap.md`
4. Begin Phase 1: `docs/planning/technical_architecture.md` and `docs/planning/data_model_draft.md`
