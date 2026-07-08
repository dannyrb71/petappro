# PetAppro MVP Roadmap

Phased planning roadmap for PetAppro as a multi-tenant SaaS platform for independent pet care businesses.

Woof Wetreats (`reference/woof-wetreats-reference`) is the behavioral reference for proven booking, staff, and client workflows. PetAppro must rebuild those patterns with tenant separation from day one — not copy single-business architecture.

**Status:** Planning phase transitioning to build, with a **target launch of October 1, 2026**. See "Launch Timeline & Store Clock" below for how the gate-driven phases map onto that calendar.

**Canonical roadmap:** this file. The dated delivery schedule, sprint breakdown, and paste-ready schema/backlog tables live in the annex `docs/roadmap/PetAppro-Roadmap-and-Project-Plan.md`. Business strategy, framework choice, and GTM live in `docs/planning/PetAppro-Strategy-and-Business-Plan.md`.

**Related docs:**

- `docs/prompts/cursor_project_instructions.md`
- `docs/planning/woof-wetreats-to-petappro-rebuild-plan.md`
- `docs/planning/woof-wetreats-reference-review.md`
- `docs/specs/platform_notification_and_activity_plan.md`
- `docs/roadmap/PetAppro-Roadmap-and-Project-Plan.md` (dated schedule + schema starter)
- `docs/planning/PetAppro-AppStore-Setup-Walkthrough-for-Beginners.md` (store setup)

---

## Phase Overview

| Phase | Name | Status |
|---|---|---|
| 0 | Product Definition | In progress |
| 1 | Architecture Planning | Not started |
| 2 | UX Flows | Not started |
| 3 | Design System Foundation | Not started |
| 4 | MVP Specification | Not started |
| 5 | Build Planning | Not started |
| 6 | MVP Build | Future / not started |
| **LR** | **Launch Readiness (parallel track)** | **Not started — runs alongside P1–P6; gates Oct 1** |

Phases 0–6 are the **product-build spine** (sequential, gate-driven). **Launch Readiness (LR)** is a **parallel track**, not a later phase: its items are hard dependencies for the Oct 1 launch (store listings literally cannot be submitted without live legal/support URLs), so they must be worked concurrently with the build — not deferred to post-launch. See the dedicated **Launch Readiness Track** section below.

---

## Launch Timeline & Store Clock (Oct 1 target)

> **The one strategic decision to make here:** the phase gates above are deliberately unhurried ("no build started; don't scaffold `app/` yet"). The Oct 1 target requires compressing Phases 0–1 planning into ~2 weeks and starting the build (`app/` scaffold + shared-package extraction) in **mid-July**. Two honest options:
> - **A — Hit Oct 1 (deadline-driven):** run the phases in fast, overlapping passes on the calendar below. Higher pace, tighter risk.
> - **B — Keep the gate discipline (quality-driven):** finish each phase's exit criteria before the next; Oct 1 likely moves to late Oct / Nov.
>
> This calendar assumes Option A. Whichever you choose, the **app-store clock is the binding constraint, not the code** — accounts and D-U-N-S must start in early August regardless.

**Binding external deadlines:**
- **~Sept 10** — first app-store submission (leaves room for one rejection + resubmit before Oct 1).
- **Early August** — start LLC → D-U-N-S → Apple/Google **Organization** accounts (long lead; see App-Store Walkthrough).
- **Oct 1** — public launch.

**Phase → calendar mapping (Option A):**

| Roadmap phase | Calendar window | Runs as |
|---|---|---|
| P0 Product Definition + P1 Architecture | Jul 7–25 | Compressed; most planning docs already drafted |
| P1→build: monorepo + extract pricing/booking packages (tested) | Jul 7–18 | Sprint 1 |
| Tenant-aware schema + RBAC/RLS | Jul 21 – Aug 15 | Sprints 2–3 |
| P2 UX flows + P3 design system | overlaps Aug | Reuse Woof design tokens |
| P4 specs + P6 build: Expo MVP (auth→onboarding→booking→dashboard; manual payments) | Aug 4 – Sep 5 | Sprints 3–4 |
| Business/app-store track (LLC, D-U-N-S, accounts, listing) | Aug 1 – Sep 8 | Parallel — Danny owns |
| P6 beta + submit | Aug 25 – Sep 12 | Sprint 5 — **submit ~Sep 10** |
| Review buffer + GTM + launch | Sep 12 – Oct 1 | Sprint 6 + launch week |

Full week-by-week sprints, milestones, and the de-scope order (what to cut first if Oct 1 is at risk) are in the annex `PetAppro-Roadmap-and-Project-Plan.md`. **Never cut:** multi-tenancy, RBAC/RLS, the single shared pricing package, or its regression tests.

**Chosen delivery approach — Hybrid (decision D-023):** gate-driven on the foundation (above four items get their exit criteria met properly), deadline-driven on everything else (flex/cut scope to hold Oct 1). Fix time + quality, flex scope.

**Pivot checkpoints — re-decide at each; speed up if ahead, cut scope if behind:**
1. **~Jul 18 (end Sprint 1):** pricing package extracted, tested, CI green? Behind → start cutting scope now.
2. **~Aug 15 — GO/NO-GO for Oct 1:** tenant schema + RBAC/RLS done *and* D-U-N-S in hand? If not both green → cut hard or deliberately move the launch date.
3. **~Sep 1:** beta build working on a real device? Yes → submit ~Sep 10. No → store clock decides.

The **~Sept 10 submission window is the one deadline that cannot flex** — before it, pivoting is a controlled choice; after it, a slip is forced.

---

## Launch Readiness Track (parallel — gates Oct 1)

**Why this is a track, not post-launch work:** the app cannot be *submitted* — let alone launched — without several of these items live. Apple and Google both require a **privacy-policy URL** and a **support URL** in the listing, so those pages must exist **before the ~Sep 10 store submission**, not at launch week. Marketing/company pages and store-account setup have long lead times (D-U-N-S, org enrollment, review cycles) that also front-load into August. Treating any of this as "after we ship" would miss the launch. These items are therefore first-class launch dependencies, tracked here and cross-linked to the MKT/BIZ tracks in `../../TASKS.md`.

**Ownership:** content/legal/site drafts by Cowork → Danny/attorney review; build/deploy by Claude Code; store accounts + listings by Danny. Detailed workstreams and hosting live in `website-and-store-launch-plan.md`; dated targets in the annex `PetAppro-Roadmap-and-Project-Plan.md` §7.5.

| LR item | What it covers | Hard-live by | Blocks | Status |
|---|---|---|---|---|
| **LR-1 — Legal pages** | Privacy Policy + Terms & Conditions on petappro.com (`/privacy`, `/terms`) | **~Sep 5** (pre-submission) | Store submission (Apple + Google) | Not started |
| **LR-2 — Support page** | `/support` — contact route + basic help/FAQ; the store-listing "support URL" | **~Sep 5** (pre-submission) | Store submission | Not started |
| **LR-3 — Contact page** | Reachable contact (form/email) on both petappro.com and base509.com | **~Sep 5** | Store submission (support/contact expected); trust | Not started |
| **LR-4 — App landing page(s)** | PetAppro product/download page (value prop, features, App Store + Play badge links; badges are placeholders until approval) | **~Sep 25** | Launch-day conversion | Not started |
| **LR-5 — Base509 marketing website** | base509.com company hub — what Base509 is + product list linking to PetAppro + contact; structured to grow with future "Appro" apps | **~Sep 25** (before launch) | Brand/company credibility at launch | Not started |
| **LR-6 — Apple App Store preparation** | Apple Developer org account ($99), App Store Connect record + bundle ID, privacy nutrition labels, in-app account-deletion flow, screenshots/icon, TestFlight beta | **Submit ~Sep 10** | Public launch | Blocked on D-U-N-S (BIZ-4/5) |
| **LR-7 — Google Play preparation** | Play Console org account ($25), closed-testing track, Data Safety form, store listing + graphics | **Submit ~Sep 10** | Public launch | Blocked on D-U-N-S (BIZ-4/6) |
| **LR-8 — App Store review buffer** | Explicit calendar buffer between ~Sep 10 submission and Oct 1 launch to absorb one rejection + resubmit on each store; set release date = Oct 1 and hold | **Sep 12 – Oct 1** | The launch date itself | Not started |

**Dependency chain (the binding path):** D-U-N-S (BIZ-4) → Apple/Google org accounts (LR-6/7) → live legal + support + contact URLs (LR-1/2/3) → create store listings → **submit ~Sep 10** → **review buffer (LR-8)** → **launch Oct 1**. Legal/support/contact URLs and the store accounts are on the critical path; the fuller marketing site (LR-4/5) can trail slightly but must be live before launch day.

**Gate — Launch Readiness exit criteria:** legal, support, and contact pages live at stable petappro.com paths; both org accounts active; both listings created with privacy/data-safety forms complete and URLs pasted; account-deletion flow shipped (Apple); builds submitted with release gated to Oct 1; review buffer reserved on the calendar.

---

## Phase 0: Product Definition

### Goal

Define what PetAppro is, who it serves, what the MVP must prove, and what is explicitly out of scope. Align product positioning so the platform is software for pet care businesses — not an employer, marketplace, broker, agency, or service provider.

### Key questions

- Who is the first customer persona (solo sitter, small boarding/daycare, multi-staff shop)?
- What is the minimum set of services for MVP (boarding and daycare only, or more)?
- What does "success" look like for the first subscribed business?
- Which Woof Wetreats workflows are must-have vs. nice-to-have for launch?
- What legal/compliance language must appear in product copy and terms?
- What is deferred beyond MVP (Stripe Connect, SMS add-ons, messaging, multi-location)?
- Web-first, native-first, or web admin plus mobile client/staff experience?

### Deliverables

- Product brief (problem, audience, value proposition, positioning guardrails)
- MVP scope document with in-scope / out-of-scope lists
- User roles and permissions matrix (`owner`, `admin`, `staff`, `client`)
- First-tenant success criteria (what one real business can do on launch)
- Open decisions list with owners and target resolution phase

### Exit criteria

- Stakeholders agree on MVP scope boundaries
- Product positioning guardrails are written and accepted
- Roles, tenant model, and invite-code onboarding concept are defined at a high level
- No unresolved "must decide before architecture" items remain undocumented

### Suggested docs/artifacts

- `docs/planning/product_brief.md` (create)
- `docs/decisions/` entries for launch platform (web vs native) and MVP service scope
- `docs/planning/woof-wetreats-to-petappro-rebuild-plan.md` (existing — refine as needed)
- `docs/roadmap/mvp_roadmap.md` (this file)

### What not to do yet

- Do not scaffold `app/` or choose framework boilerplate
- Do not design database tables or RLS policies
- Do not wire Supabase, Netlify, or Stripe
- Do not copy Woof Wetreats code into a new repo
- Do not design pixel-perfect UI

---

## Phase 1: Architecture Planning

### Goal

Design the multi-tenant foundation: one shared platform, strict `business_id` separation, membership-based permissions, and server-authoritative booking/pricing. Resolve structural decisions that Woof Wetreats leaves single-tenant.

### Key questions

- What is the canonical tenant boundary (`business_id`) and where does it appear?
- How do invite codes create or link `business_memberships` and client profiles?
- Can one auth user be a client of Business A and staff of Business B?
- Are pet profiles scoped per business or shared across businesses for the same user?
- Where does pricing logic live (single shared package, no duplication across UI/server/Edge Functions)?
- What is the notification outbox model (`notifications`, `notification_deliveries`)?
- How are storage paths tenant-prefixed for pet photos and business assets?
- What RPCs, Edge Functions, and triggers need tenant context that Woof Wetreats lacks?
- Web admin vs client/staff app split — one codebase or multiple?

### Deliverables

- Technical architecture overview
- Core data model draft (tables, key relationships, tenant columns)
- Access control model (roles, memberships, invite codes, RLS strategy)
- Pricing architecture decision (shared engine, server authority, stored breakdowns)
- Notification and payment architecture summaries
- Migration/reference strategy (Woof Wetreats stays read-only; new build, optional later import)
- Architecture decision records for unresolved rebuild-plan items

### Exit criteria

- Every business-specific entity has a defined tenant boundary
- Permission checks are defined against memberships, not global emails
- Booking, pricing, terms stamping, and notification flows have tenant-aware sequence diagrams or written flows
- Known Woof Wetreats anti-patterns are explicitly marked "do not copy"
- Architecture review completed (ChatGPT/Codex or equivalent) with no blocking gaps

### Suggested docs/artifacts

- `docs/planning/technical_architecture.md` (create)
- `docs/planning/data_model_draft.md` (create)
- `docs/decisions/` — web vs native, pet profile scope, meet-and-greet configurability
- `docs/planning/woof-wetreats-reference-review.md` (existing — use as gap analysis)
- `reference/woof-wetreats-reference` (read-only — migrations, RPCs, routes)

### What not to do yet

- Do not implement migrations in Supabase
- Do not build UI screens
- Do not set up production infrastructure
- Do not refactor or modify the Woof Wetreats reference repo
- Do not commit secrets or environment files

---

## Phase 2: UX Flows

### Goal

Map end-to-end journeys for each role across tenant onboarding, daily operations, and edge cases. Preserve Woof Wetreats' proven household-centered staff model and client booking patterns while adding business setup and invite-code entry.

### Key questions

- What is the owner/admin business setup flow (services, pricing, availability, branding, terms)?
- How does a client enter an invite code, onboard, and reach their first booking?
- How does staff join via invite code and reach the daily schedule and household directory?
- When is meet-and-greet required — globally, per business, or per service?
- What happens when a client is blocked, a date is blocked, or pricing overrides apply?
- How does activity history (completed/cancelled bookings) appear without duplicating active/upcoming dashboard content?
- What empty, loading, error, and permission-denied states does each flow need?
- Public landing page vs invite-only portal — which does MVP include?

### Deliverables

- Core user flow documents per role (owner/admin, staff, client)
- Business setup flow
- Invite-code onboarding flows (client and staff)
- Booking flow (client self-service and staff-created)
- Staff daily schedule and household detail flow
- Meet-and-greet flow (if in MVP)
- Activity history flow
- Notification center flow (in-app)
- Flow-to-feature traceability matrix (flow step → spec → future build ticket)

### Exit criteria

- Every MVP feature has a documented primary happy path
- Error and permission paths are defined for booking, onboarding, and staff actions
- Flows explicitly note tenant scope at each step
- Product review confirms flows match Phase 0 scope (no scope creep)
- Open UX questions captured in `docs/decisions/` or flow doc appendices

### Suggested docs/artifacts

- `docs/user-flows/business_setup.md` (create)
- `docs/user-flows/client_onboarding_and_booking.md` (create)
- `docs/user-flows/staff_operations.md` (create)
- `docs/user-flows/activity_history.md` (create)
- `docs/user-flows/notifications.md` (create)
- `docs/planning/woof-wetreats-reference-review.md` (route/behavior cross-check)

### What not to do yet

- Do not build high-fidelity mockups before flows are reviewed
- Do not implement navigation or routes in code
- Do not finalize copy for legal pages without legal review checkpoint
- Do not design add-on flows (SMS bridge, in-app messaging) unless marked MVP

---

## Phase 3: Design System Foundation

### Goal

Establish brand-neutral UI foundations that support per-business customization (name, logo, landing content) without rebuilding components per tenant. Define tokens, core components, and layout patterns aligned to pet-care workflows.

### Key questions

- What is platform chrome vs. business-br customizable surface?
- Which components are shared across client and staff experiences?
- How do service tags, status badges, and booking cards behave across service types?
- What accessibility and mobile breakpoints are required for MVP?
- How do pet photos, avatars, and empty states render consistently?
- Which Woof Wetreats UI patterns should be preserved vs. generalized?

### Deliverables

- Design tokens document (color, type, spacing, radius, elevation)
- Component inventory for MVP (buttons, forms, cards, modals, schedule views, date pickers)
- Booking/reservation card spec (service tag, status, pets, dates, totals, fee breakdown)
- Tenant branding rules (logo placement, business name, hero/landing editable zones)
- UI state patterns (loading, empty, error, success, permission denied)
- Reference screenshots or annotated comparisons from Woof Wetreats where helpful

### Exit criteria

- Token file(s) exist and cover MVP needs
- MVP component list is agreed and mapped to user flows
- Booking card and schedule patterns are specified enough for spec writing
- No open blocking questions on layout for business setup, dashboard, or schedule views
- Design system supports boarding/daycare first without blocking future service types

### Suggested docs/artifacts

- `docs/design-system/petappro-color-variables.tokens.json` (existing)
- `docs/design-system/assets/images/` (existing logo assets)
- `docs/design-system/tokens.md` (create)
- `docs/design-system/components.md` (create)
- `docs/design-system/branding_and_theming.md` (create)

### What not to do yet

- Do not build a full component library in code
- Do not create per-business themes in production
- Do not polish marketing site design beyond MVP admin/client needs
- Do not design native-only patterns if launch is web-first (until platform decision is final)

---

## Phase 4: MVP Specification

### Goal

Turn approved flows and architecture into build-ready feature specs with acceptance criteria, tenant scope, permissions, data touchpoints, and verification plans. Each spec should be small enough for Cursor/Claude Code to implement in focused slices.

### Key questions

- What is the exact MVP feature list with priority order?
- For each feature: roles affected, tables touched, RLS impact, UI states, notifications, payment/legal impact?
- Which specs depend on others (e.g., booking requires business setup + client onboarding)?
- What are acceptance criteria and test scenarios per feature?
- What remains deferred: Stripe Connect, SMS add-on, advanced services, analytics?
- How is terms version stamping applied at booking and meet-and-greet time?

### Deliverables

- Prioritized MVP feature backlog
- Feature specs for each MVP slice (using a consistent template)
- Platform spec refinements (notifications, activity history — partial exists)
- Payment spec (manual tracking only for MVP; Stripe Connect deferred post-MVP per D-007)
- Terms/policy spec (business-specific client terms + platform terms)
- Launch checklist draft
- Claude Code / Cursor build prompts per major feature

### Exit criteria

- Every in-scope MVP feature has a spec with acceptance criteria
- Specs include tenant scope and permission sections — no "TBD" on `business_id`
- Dependencies and build order are documented
- Deferred features are explicitly listed with rationale
- Spec review completed; ready for build planning

### Suggested docs/artifacts

- `docs/specs/platform_notification_and_activity_plan.md` (existing — refine)
- `docs/specs/business_setup.md` (create)
- `docs/specs/invite_code_onboarding.md` (create)
- `docs/specs/booking_and_pricing.md` (create)
- `docs/specs/staff_dashboard_and_schedule.md` (create)
- `docs/specs/payments_manual_and_stripe.md` (create)
- `docs/specs/terms_and_policies.md` (create)
- `docs/prompts/claude_code_prompt_pack.md` (existing — extend per feature)

### What not to do yet

- Do not start coding in `app/`
- Do not create GitHub issues until specs are stable (unless used for tracking only)
- Do not deploy to Netlify or provision production Supabase
- Do not combine multiple features into one vague "build the app" prompt

---

## Phase 5: Build Planning

### Goal

Sequence MVP implementation into branches/milestones, define repo structure under `app/`, and establish local dev, testing, migration, and review discipline before any production deploy.

### Key questions

- What repo layout lives under `app/` (web, supabase, packages/pricing, docs mirror)?
- What is the build order by dependency (tenant foundation → auth/memberships → business setup → client onboarding → booking → staff ops → notifications → payments)?
- How are Supabase migrations versioned and reviewed for RLS?
- What local verification is required before each merge (typecheck, tests, manual flows)?
- When is the first deploy preview allowed — and who approves Netlify deploys?
- How is Woof Wetreats used during build (behavior comparison checklist only)?
- What is the first-tenant data import plan, if any?

### Deliverables

- Implementation phase plan (ordered milestones with estimates)
- `app/` repo scaffold plan (folders, tooling, scripts — not necessarily executed yet)
- Supabase migration strategy and RLS review checklist
- Local dev setup guide
- Testing and verification plan per milestone
- Git branching convention and PR review checklist
- Environment variable inventory (no secrets committed)
- Pre-deploy review process (aligned with `docs/prompts/claude_code_prompt_pack.md`)

### Exit criteria

- Build order is documented with clear milestone boundaries
- Each milestone maps to one or more specs and verification steps
- RLS/tenant review gate defined before booking and staff features
- Local-only development agreement documented (no Netlify deploy without approval)
- First implementation prompt ready for Phase 6 milestone 1

### Suggested docs/artifacts

- `docs/planning/implementation_plan.md` (create)
- `docs/planning/local_dev_setup.md` (create)
- `docs/planning/launch_checklist.md` (create)
- `docs/prompts/claude_code_prompt_pack.md` (existing)
- `docs/planning/ai_build_operating_model.md` (existing — workflow alignment)

### What not to do yet

- Do not deploy to production
- Do not onboard paying customers
- Do not import Woof Wetreats production data until tenant model is validated locally
- Do not skip RLS review for "speed"
- Do not begin Phase 6 work until this phase exit criteria are met

---

## Phase 6: MVP Build

**Status: Future / not started**

Listed for roadmap completeness only. No implementation work begins until Phases 0–5 exit criteria are met.

### Goal

Implement the MVP in dependency order inside `app/`, with local testing first, tenant-safe RLS throughout, and Woof Wetreats used only as a behavioral reference.

### Planned milestones (high level)

1. **Tenant foundation** — `businesses`, memberships, invite codes, base RLS
2. **Auth and onboarding** — owner setup, client/staff invite flows
3. **Business configuration** — services, pricing rules, availability, branding, terms
4. **Client experience** — profile, pets, booking (boarding/daycare), pricing preview, confirmation
5. **Staff operations** — household directory, daily schedule, booking management, staff notes
6. **Notifications and activity** — in-app notification center, activity history date picker
7. **Payments** — manual payment tracking only (Stripe Connect deferred post-MVP, D-007)
8. **Launch hardening** — bug fixes, acceptance testing, first-tenant onboarding, deploy when approved

### Key questions (to resolve before starting)

- ~~Final go/no-go on Stripe Connect for MVP~~ → **Resolved: deferred post-MVP (D-007).** Manual tracking is the MVP payment path.
- Final go/no-go on SMS alert add-on for MVP
- Web-only launch or parallel mobile work
- First **test tenant** = Danny + Marco's own business (not a recruited customer); success metrics per the MVP-complete gate below

### Deliverables

- Working MVP in `app/`
- Supabase migrations and RLS policies
- Test coverage for pricing engine and critical tenant boundaries
- Deploy preview (when approved)
- First-tenant onboarding runbook

### MVP Complete — the feature-freeze line (decision D-028, Decided 2026-07-07)

> **MVP Complete = Danny + Marco's own business runs a genuine booking end-to-end** — client onboarding → booking → server-validated pricing → staff schedule → history/notifications — **on physical iOS *and* Android builds, with tenant isolation verified. Payment tracked manually; Stripe Connect deferred.**

When this single event is true, **feature development pauses.** Everything after the freeze is bug-fixing, polish, accessibility, and store prep — not new features. The freeze bar uses the **own business as the first test tenant** (not a recruited customer), because that removes a recruiting dependency from the freeze while still forcing every core system — tenant schema + RLS, RBAC, business setup, onboarding, the booking + pricing engine — to be real at once on-device.

The **5–6 PCSP beta testers** (recruited via the local Facebook group + Danny's network) are the milestone *after* the freeze — real-world validation on TestFlight/closed track — and store submission runs in parallel on the Launch Readiness track. They are not part of the freeze bar.

### Exit criteria

- First business can complete setup, invite clients/staff, take bookings, run daily schedule, view history, and receive in-app notifications
- Tenant isolation verified (no cross-business data leakage)
- Acceptance criteria from Phase 4 specs met
- Launch checklist complete
- Explicit approval for production deploy

### Suggested docs/artifacts

- GitHub repo under `app/`
- `docs/planning/launch_checklist.md`
- `docs/decisions/` — post-build revisions
- Milestone-specific build prompts in `docs/prompts/`

### What not to do yet

- **Entire phase is not started** — do not scaffold, migrate, or ship until Phases 0–5 are complete
- Do not expand scope mid-build without updating specs and roadmap
- Do not modify `reference/woof-wetreats-reference`

---

## MVP Scope Reference (from rebuild plan)

Use this as the default in/out scope anchor during Phases 0 and 4. Adjust only through explicit decision records.

### Include in MVP

- Business setup
- Invite-code onboarding (client and staff)
- Client onboarding and pet profiles
- Boarding, daycare, and dog-walking bookings (walking = service only, **no GPS/live tracking**; schema should allow future service types)
- Staff dashboard and daily schedule
- Pricing engine with server authority and stored breakdowns
- Blocked dates with server enforcement
- Activity history date picker (completed/cancelled only)
- In-app notification center
- Manual payment tracking (the **only** MVP payment path — cash/check/Venmo/Zelle/other + staff confirmation)
- SMS alert add-on or owner/staff SMS alerts (if decided)

### Defer beyond MVP

- **Stripe Connect (client → provider online payments)** — deferred to post-MVP (decision D-007, Decided 2026-07-07). Nice-to-have, not launch-critical; MVP tracks payments manually. *Note: this is distinct from SaaS subscription billing (provider → Base509) via Stripe **Billing** on the web, which stays in scope — see MKT-6 / D-001.*
- Full in-app messaging
- SMS conversation bridge
- Multiple non-pet verticals
- Custom app-store builds per business
- Complex staff permission hierarchies
- Multi-location support
- Advanced service types beyond first MVP set
- Deep analytics and reporting

---

## Suggested Phase Sequence

```text
Phase 0  Product Definition
   ↓
Phase 1  Architecture Planning
   ↓
Phase 2  UX Flows          ← can overlap lightly with Phase 3 once flows are stable
Phase 3  Design System Foundation
   ↓
Phase 4  MVP Specification
   ↓
Phase 5  Build Planning
   ↓
Phase 6  MVP Build         ← future / not started

  ══ Launch Readiness (LR) ═════════════════════════  ← PARALLEL, starts now (Aug front-load)
     D-U-N-S → store org accounts → legal/support/contact URLs →
     store listings → submit ~Sep 10 → review buffer → launch Oct 1
```

Phases 2 and 3 may run with light overlap after Phase 1 exit criteria are met, but specs (Phase 4) should not begin until flows and design foundations are review-ready. **Launch Readiness runs across the whole timeline** — its store-clock items (D-U-N-S, org accounts, review buffer) are the binding external constraint and must not wait on the build phases.

---

## Immediate Next Steps (Phase 0)

1. Create `docs/planning/product_brief.md`
2. Record platform decision (web vs native) in `docs/decisions/`
3. Finalize MVP in-scope / out-of-scope against the list above
4. Resolve open questions from `docs/planning/woof-wetreats-to-petappro-rebuild-plan.md`
5. Mark Phase 0 exit criteria complete before starting architecture work
