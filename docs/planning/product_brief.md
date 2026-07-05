# PetAppro Product Brief

Planning document for Phase 0 product definition.

> **Canonical for:** product definition, positioning guardrails, roles, and MVP feature scope. For **business strategy, framework choice, GTM, and launch** see `docs/planning/PetAppro-Strategy-and-Business-Plan.md`; for **technical migration + data model** see `woof-wetreats-to-petappro-rebuild-plan.md`. These are complementary, not competing — this brief governs *what/who*, the strategy doc governs *business/launch*, the rebuild plan governs *how technically*.

**Related docs:** `docs/prompts/cursor_project_instructions.md`, `docs/roadmap/mvp_roadmap.md`, `docs/planning/woof-wetreats-to-petappro-rebuild-plan.md`, `docs/planning/PetAppro-Strategy-and-Business-Plan.md`

---

## 1. Product Summary

PetAppro is a multi-tenant SaaS platform that gives independent pet care businesses their own software for bookings, client and pet management, staff operations, notifications, and payments — without PetAppro acting as the service provider.

Each subscribed business configures its own services, pricing, policies, branding, staff, and client access. Clients and staff join through invite codes. One shared platform and database serve all businesses, with strict tenant separation by `business_id`.

The MVP targets small pet care operators — starting with boarding and daycare — who need reliable day-to-day operations software, not a marketplace or agency layer.

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

**Primary:** Small independent pet care businesses that offer boarding and/or daycare and want to replace manual coordination with dedicated software.

Examples:

- Solo or small-team in-home boarders and daycare providers
- Small facility-based boarding/daycare shops (roughly 1–10 staff)
- Operators who already manage clients directly and need invite-based client onboarding, not a public marketplace

**Initial design partner profile:** A business similar to Woof Wetreats — established client base, recurring boarding/daycare bookings, staff who need a daily schedule, and an owner who configures pricing and policies.

**Not primary for MVP:** Large multi-location chains, grooming-only shops, marketplaces aggregating sitters, or businesses needing deep analytics, custom mobile apps per brand, or complex franchise hierarchies.

---

## 4. End Users

| Role | Who they are | Primary jobs |
|---|---|---|
| **Owner** | Business founder or principal | Create business, configure services/pricing/policies, manage staff, oversee operations |
| **Admin** | Trusted manager (optional at MVP) | Same operational access as owner minus ownership actions |
| **Staff** | Sitters, handlers, front-desk | View daily schedule, manage households, create/edit bookings, add staff notes |
| **Client** | Pet owner using one business | Onboard via invite, manage profile and pets, request bookings, view history and notifications |

Users authenticate once and may belong to one or more businesses through memberships or client relationships. Permissions come from business membership — not global admin emails.

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
- Optional Stripe Connect so each business collects its own payments

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

- A separate white-label app store build per customer
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
9. **Local-first build discipline** — implement and test in `app/` locally before any Netlify deploy.
10. **Small slices** — ship focused features with clear specs; avoid "build the whole app" prompts.

---

## 9. MVP Feature Pillars

### Pillar A: Business Setup and Configuration

- Business profile, branding, and editable landing content
- Service configuration (boarding and daycare for MVP)
- Pricing rules and blocked dates
- Business-specific terms/policies
- Staff and client invite codes

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

### Pillar D: Platform Core

- Multi-tenant auth, memberships, and RLS
- Centralized pricing engine (single source of truth)
- In-app notification center
- Manual payment tracking (cash, check, Venmo, Zelle, other)
- Terms/version stamping at booking time

### Pillar E: Optional at MVP (decide before build)

- Stripe Connect (business collects own payments)
- SMS alert add-on for owner/staff urgent notifications

### Explicitly deferred

- Full in-app messaging and SMS conversation bridge
- Multi-location support
- Advanced service types beyond boarding/daycare
- Complex permission hierarchies
- Deep analytics and reporting
- Custom native app per business

---

## 10. Success Criteria for the First Version

The first version succeeds when **one real pet care business** (design partner) can:

1. **Set up** its business — services, pricing, availability, branding, terms, invite codes
2. **Onboard staff** via staff invite codes and **onboard clients** via client invite codes
3. **Complete client onboarding** — profile, pets, policies, meet-and-greet if required
4. **Take boarding/daycare bookings** — client self-service and staff-created, with server-calculated totals and stored breakdowns
5. **Run daily operations** — staff daily schedule and household detail with care notes
6. **Enforce business rules** — blocked dates, meet-and-greet gate, terms stamping
7. **Review history** — activity date picker for completed/cancelled bookings
8. **Receive in-app notifications** for operational events
9. **Record payments** — manual payment status at minimum; Stripe if in scope
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
- Web-first (or web admin + responsive client/staff experience) is acceptable for MVP
- One shared Supabase database with RLS is sufficient for MVP scale
- Woof Wetreats workflows are representative of the first design partner's needs
- Invite-code onboarding is acceptable vs. public self-serve signup for clients

### Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Scope creep (payments, SMS, messaging) | Delays MVP | Lock scope in Phase 4 specs; defer add-ons explicitly |
| Copying Woof Wetreats single-tenant patterns | Security and scale failures | Architecture phase + RLS review gate before booking features |
| Pricing logic duplicated across layers | Incorrect charges, hard maintenance | Single shared pricing package; server authority |
| Unclear legal positioning | Business or user confusion | Clear copy: software only; business owns services and policies |
| Platform decision delayed (web vs native) | Rework in UX and build plan | Record decision in `docs/decisions/` before Phase 2 exit |
| First tenant unique needs | MVP too narrow or too wide | Design partner feedback loop; document overrides as decisions |
| Over-reliance on email for alerts | Missed urgent events | In-app notifications in MVP; SMS as optional add-on |

---

## 12. Open Questions

Resolve before or during Phase 1–4 as noted.

| Question | Why it matters | Target phase |
|---|---|---|
| Web-first, native-first, or web + native? | Affects UX flows, build plan, and deploy strategy | Phase 0 → `docs/decisions/` |
| Can one user be client of Business A and staff of Business B? | Auth and membership model | Phase 1 |
| Are pet profiles shared across businesses or scoped per business? | Data model and client UX | Phase 1 |
| Is meet-and-greet required for all businesses or configurable? | Onboarding and booking gates | Phase 1–2 |
| Public booking page, invite-only portal, or both? | Client acquisition flow | Phase 0–2 |
| Deposits at MVP or manual/full payment status only? | Payments spec scope | Phase 4 |
| Stripe Connect in MVP or post-MVP? | Build timeline and compliance | Phase 4–5 |
| SMS alert add-on in MVP? | Notification infrastructure | Phase 4–5 |
| Terms/policies: fully editable, templates, or upload? | Business setup complexity | Phase 2–4 |
| First SaaS pricing and which add-ons are launch-ready? | GTM and scope | Phase 0–5 |
| Which business is the design partner and what is their launch date? | Success criteria and prioritization | Phase 0 |

---

## Next Steps

1. Record answers to blocking open questions in `docs/decisions/`
2. Create user roles and permissions matrix (Phase 0 deliverable)
3. Mark Phase 0 exit criteria in `docs/roadmap/mvp_roadmap.md`
4. Begin Phase 1: `docs/planning/technical_architecture.md` and `docs/planning/data_model_draft.md`
