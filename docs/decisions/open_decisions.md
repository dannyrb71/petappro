# PetAppro Open Decisions Log

Unresolved Phase 0 product and architecture decisions for PetAppro.

**Related docs:** `docs/prompts/cursor_project_instructions.md`, `docs/planning/product_brief.md`, `docs/planning/user_roles_and_permissions.md`, `docs/roadmap/mvp_roadmap.md`

**How to use:** Spec writers and architects may proceed using **Working Default** values until a decision moves to **Decided**. Any change from a working default requires updating this log and affected specs.

---

## 1. Purpose

PetAppro has intentional unresolved questions that affect architecture, UX flows, permissions, and MVP scope. This log:

- Lists all known open decisions in one place
- Assigns a **working default** so planning can continue without blocking
- Records **when** each decision must be finalized
- Provides detailed context for the highest-impact decisions
- Defines Phase 0 exit criteria tied to decision readiness

When a decision is resolved, update its status to **Decided**, add the outcome and date, and create a short entry in a future `docs/decisions/decision_log.md` if needed for permanent audit.

---

## 2. Decision Status Definitions

| Status | Meaning |
|---|---|
| **Proposed** | Options identified; no working default adopted yet |
| **Working Default** | Temporary answer for specs and architecture drafts; not final stakeholder sign-off |
| **Decided** | Stakeholder-approved; specs and build must follow the recorded outcome |
| **Deferred** | Explicitly out of MVP scope; revisit after pilot or later phase |

---

## 3. Decision Table

| ID | Decision | Status | Working default | Why it matters | Phase needed by |
|---|---|---|---|---|---|
| D-001 | Launch platform: web-first vs native/Expo vs hybrid | **Decided** | **Native (Expo/React Native)** for client + staff. Thin Next.js web for marketing + provider subscription checkout. No consumer/staff web app at launch; internal web tools optional anytime on same backend, just not a launch priority | Repo structure, UX flows, deploy strategy, notification approach | Decided 2026-07-04 |
| D-002 | Can staff invite clients? | Working Default | No — owner/admin only | Permission model, invite-code UX, staff training | Phase 0 → 2 |
| D-003 | Same user as client **and** staff in one business? | Working Default | No — block dual assignment | Auth, booking conflicts, permission checks | Phase 0 → 1 |
| D-004 | Can clients belong to multiple businesses? | Working Default | Yes — separate client profile per business | Auth, business picker, onboarding | Phase 1 |
| D-005 | Pet profiles: business-scoped vs shared across businesses | Working Default | Business-scoped per client profile | Data model, storage paths, client UX | Phase 1 |
| D-006 | Meet-and-greet: global rule vs business/service configurable | Working Default | Configurable per business (on/off); required when enabled | Onboarding gates, booking eligibility | Phase 1 → 2 |
| D-007 | Payments: manual first vs Stripe Connect in MVP | Working Default | Manual payment tracking in MVP; Stripe Connect post-MVP unless design partner requires it | Build scope, compliance, owner setup flow | Phase 4 → 5 |
| D-008 | SMS alerts: MVP vs post-MVP add-on | Working Default | Post-MVP add-on; in-app notifications in MVP | Notification infra, cost, urgency handling | Phase 4 |
| D-009 | Terms/policies: template-based vs fully editable | Working Default | Template-based with editable sections | Business setup complexity, legal review | Phase 2 → 4 |
| D-010 | Multi-location support in MVP | Deferred | Deferred — single location per business | Data model, schedule, pricing, staff assignment | Phase 1 (document only) |
| D-011 | Public landing page vs invite-only client portal | Working Default | Both — public landing + invite-required client portal | Client acquisition, onboarding UX | Phase 0 → 2 |
| D-012 | Client of Business A and staff of Business B (different businesses) | Working Default | Yes — with business context switching | Multi-tenant auth, session context | Phase 1 |
| D-013 | Invite codes: single-use vs reusable | Proposed | Reusable until revoked; optional max uses TBD | Onboarding ops, security | Phase 2 |
| D-014 | Invite codes: expiration | Proposed | Optional expiration; owner sets or never expires | Security vs convenience | Phase 2 |
| D-015 | Deposits at MVP | Working Default | No deposits — full booking total + manual paid status | Payments spec, pricing engine | Phase 4 |
| D-016 | Staff can block/unblock clients | Working Default | No — owner/admin only | Permission matrix, abuse prevention | Phase 0 → 2 |
| D-017 | Staff can confirm manual payments | Working Default | No — owner/admin only | Financial integrity | Phase 4 |
| D-018 | Staff can override booking prices | Working Default | Yes — with audit trail | Operations flexibility vs control | Phase 4 |
| D-019 | Admin role required at MVP | Working Default | Optional — owner-only businesses OK | Role model, small business UX | Phase 0 |
| D-020 | First SaaS pricing and launch add-ons | Proposed | TBD — document after design partner confirmed | GTM, scope for Stripe/SMS | Phase 0 → 5 |
| D-021 | Design partner business and target launch date | Proposed | TBD | Prioritization, success criteria | Phase 0 |
| D-022 | Service catalog beyond boarding/daycare in MVP | Working Default | Schema supports multiple services; MVP ships boarding + daycare only | Data model vs build scope | Phase 1 → 4 |
| D-023 | Delivery approach: deadline-driven vs gate-driven | **Decided** | **Hybrid** — gates on the foundation, flex scope to hold Oct 1; ~Aug 15 go/no-go (see detailed record) | Whether Sprint 1 starts now; how slippage is absorbed | Phase 0 (now) |

---

## 4. Detailed Decision Records

### D-001 — Web-first vs native/Expo launch

**Status:** Decided (2026-07-04)

**Question:** Should PetAppro MVP launch as a web app, a native (Expo/React Native) app, or a hybrid (web admin + native client/staff)?

**Options:**

| Option | Pros | Cons |
|---|---|---|
| **Web-first (responsive)** | Fastest path; one codebase; matches Woof Wetreats reference; easier iteration | Push notifications on mobile web are limited; app-store presence absent |
| **Native/Expo-first (chosen)** | Better mobile UX and push; staff/clients often on phones; app-store presence | More deploy complexity; must set up EAS + store accounts |
| **Hybrid** | Optimized per audience | Highest cost; coordination across codebases |

**Decision:** **Native (Expo/React Native)** for both the client and staff experiences — this is the core project goal ("deployed as native apps for iOS and Android"). **All staff functionality lives in the native staff side; there is no separate web client or web staff app at MVP.**

**Web scope (deliberately minimal):** a thin **Next.js** site remains for (1) the **marketing site** and (2) **selling the provider SaaS subscription** via Stripe Billing — the latter is required because Apple's rules bar selling that subscription inside the iOS app. This is a marketing + checkout surface, **not** a product web app.

**Not a launch priority (but not blocked):** internal/admin **web tools that read from / write to the Supabase database** (reporting, bulk ops) can be built **anytime** on the same backend and RBAC — they extend the **staff side**, not a separate product. Simply not scheduled ahead of the Oct 1 native launch; build when useful.

**Why it matters:** Drives repo layout (`apps/mobile` Expo + `apps/web` Next.js marketing/billing), notification strategy (native push, D-008), EAS/store setup, and Phase 2 UX assumptions (design mobile-native, not responsive-web).

**Consistency:** aligns the decision log with the strategy, roadmap, tooling, and `CLAUDE.md`/`AGENTS.md`, which already assume native/Expo. Resolves the dependency flag noted in D-023.

**Entity note (Decided 2026-07-04):** the legal entity is **Base509 LLC** (sole owner: Danny); **PetAppro is a product/brand + IP owned by Base509 LLC**, not its own company. All accounts (D-U-N-S, Apple/Google developer, bank, Stripe) are under Base509 LLC; the app publishes as "PetAppro." Optional DBA "Base509 LLC dba PetAppro" if publicly transacting as PetAppro. See `docs/planning/Base509-LLC-Formation-Guide-CA.md`.

---

### D-002 — Whether staff can invite clients

**Status:** Working Default

**Question:** Can staff role generate or share client invite codes, or is that owner/admin only?

**Options:**

- **Owner/admin only** — tighter access control; owner controls client roster growth
- **Staff allowed** — faster onboarding in the field; needs audit trail

**Working default:** **Owner/admin only.** Staff can ask owner/admin to generate codes.

**Why it matters:** Permission matrix, invite-code spec, and potential abuse if staff can add clients without oversight.

**Phase needed by:** Phase 0 → **Decided** before invite-code UX spec (Phase 2).

**Aligns with:** `user_roles_and_permissions.md` matrix footnote.

---

### D-003 — Same user as client and staff in one business

**Status:** Working Default

**Question:** Can one authenticated user hold both a staff membership and a client profile for the **same** `business_id`?

**Options:**

- **Block dual assignment** — simpler permissions; no self-booking confusion
- **Allow with context switching** — flexible for owner-operators who also use services
- **Allow staff only, no client self-booking** — hybrid compromise

**Working default:** **Block dual assignment at MVP.** Owner-operators use staff/owner tools, not client self-booking, for their own household.

**Why it matters:** Booking eligibility, meet-and-greet gates, and permission checks on every request.

**Phase needed by:** Phase 0 → **Decided** before Phase 1 auth/membership model.

---

### D-004 — Whether clients can belong to multiple businesses

**Status:** Working Default

**Question:** Can one auth user be a client of Business A and Business B (different businesses)?

**Options:**

- **Yes, separate client profiles** — realistic for pet owners using multiple sitters
- **No, one business per user** — simpler; poor fit for multi-business clients

**Working default:** **Yes.** One auth account, **separate client profile per business**, with business context picker after login.

**Why it matters:** Auth model, dashboard routing, notifications, and activity history scoping.

**Phase needed by:** Phase 1 architecture.

**Note:** Distinct from D-003 (same business). D-012 covers client-at-A + staff-at-B.

---

### D-005 — Pet profiles: business-scoped vs shared

**Status:** Working Default

**Question:** If the same person is a client at two businesses, do pet records sync or stay separate?

**Options:**

- **Business-scoped** — each business has its own pet record (photos, notes, vet info)
- **Shared pet identity** — user maintains pets once; businesses see linked copy or shared record
- **Shared with business overlays** — shared base + business-specific care notes

**Working default:** **Business-scoped.** Each client profile owns pets for that business only. Re-entry required at second business.

**Why it matters:** Data model (`pets.business_id`), storage paths, RLS, and client onboarding UX.

**Phase needed by:** Phase 1 data model draft.

**Revisit after pilot:** Shared pet identity reduces friction for multi-business clients (Section 6).

---

### D-006 — Meet-and-greet: global vs configurable

**Status:** Working Default

**Question:** Is meet-and-greet required for all businesses, or configurable per business (and optionally per service)?

**Options:**

- **Always required** — matches many boarding operators; simple gate
- **Configurable per business** — off for trusted repeat-only shops
- **Configurable per service** — e.g., required for boarding, optional for daycare

**Working default:** **Configurable per business (on/off).** When enabled, client must complete meet-and-greet before first booking. Per-service rules deferred.

**Why it matters:** Onboarding steps, booking eligibility, staff meet-and-greet management.

**Phase needed by:** Phase 1 → 2 flows.

**Reference:** Woof Wetreats uses meet-and-greet heavily; design partner may want it on by default.

---

### D-007 — Manual payments first vs Stripe Connect in MVP

**Status:** Working Default

**Question:** Does MVP include Stripe Connect, or only manual payment status tracking?

**Options:**

| Option | Pros | Cons |
|---|---|---|
| **Manual only** | Faster; no Connect onboarding; fits cash/Venmo-heavy operators | No online pay in product |
| **Stripe Connect in MVP** | Complete payment story; client pay links | Compliance, setup friction, timeline risk |
| **Manual MVP + Connect fast-follow** | Balanced | Two payment releases to maintain |

**Working default:** **Manual payment tracking in MVP** (cash, check, Venmo, Zelle, other + staff confirmation). **Stripe Connect post-MVP** unless design partner is blocked without online pay.

**Why it matters:** Owner setup flow, payments spec, booking confirmation UX, Phase 5 milestone order.

**Phase needed by:** **Decided** before Phase 4 payments spec and Phase 5 build plan.

---

### D-008 — SMS alerts in MVP vs post-MVP add-on

**Status:** Working Default

**Question:** Should SMS urgent alerts ship in MVP or as a paid add-on after in-app notifications work?

**Options:**

- **In-app only at MVP** — aligns with notification plan; email for paper trail
- **SMS for owner/staff in MVP** — matches Woof Wetreats urgency patterns via Pushover equivalent
- **SMS as optional add-on at launch** — revenue line; more infra

**Working default:** **In-app notification center in MVP.** **SMS deferred** to post-MVP add-on. Email for receipts, confirmations, and policy records only.

**Why it matters:** Notification architecture, cost, Twilio/provider integration, web push limitations (ties to D-001).

**Phase needed by:** Phase 4 notifications spec.

---

### D-009 — Terms/policies: template-based vs fully editable

**Status:** Working Default

**Question:** How do businesses define client-facing terms, cancellation policy, and house rules?

**Options:**

- **Fully editable free text** — maximum flexibility; legal risk; harder to render consistently
- **Template-based with editable sections** — structured fields + optional custom paragraphs
- **Upload PDF/HTML** — business supplies document; harder to stamp versions at booking

**Working default:** **Template-based with editable sections** (cancellation, hours, liability acknowledgment, etc.) plus business name/branding. Version published by owner/admin; stamped on booking.

**Why it matters:** Business setup UX, legal review, booking/meet-and-greet acceptance flows.

**Phase needed by:** Phase 2 → 4 specs.

---

### D-023 — Delivery approach: deadline-driven vs gate-driven

**Status:** Decided (2026-07-04)

**Question:** Do we run to the Oct 1 launch date (deadline-driven) or finish each roadmap phase's exit criteria before the next (gate-driven)?

**Options:**

| Option | Pros | Cons |
|---|---|---|
| **A — Deadline-driven** | Hits Oct 1; market timing | Tempts corner-cutting on money/security code |
| **B — Gate-driven** | Highest quality; clean phase exits | Oct 1 likely slips to late Oct/Nov; planning can expand indefinitely |
| **C — Hybrid (chosen)** | Fixed quality floor + flexible scope; protects both the foundation and the date | Requires discipline to actually cut scope when behind |

**Decision:** **Hybrid.** Fix *time and quality*, flex *scope*.
- **Gate-driven on the foundation (non-negotiable exit criteria):** multi-tenant boundary + `business_id`, RBAC/RLS, the single shared pricing package, and its regression tests. No shortcuts here to save time.
- **Deadline-driven on everything above the foundation:** features are the shock absorber. If behind, cut from the de-scope order (QuickBooks → advanced reports → SMS → white-label polish → 2nd industry template). Never cut the foundation to hit the date.

**Pivot rule & checkpoints (re-decide at each; speed up if ahead, cut scope if behind):**
1. **~Jul 18 (end Sprint 1):** pricing package extracted, tested, CI green? Behind → start cutting scope now, don't wait.
2. **~Aug 15 — GO/NO-GO for Oct 1:** tenant schema + RBAC/RLS done *and* D-U-N-S in hand? If not both green, either cut hard or consciously move the launch date (deliberately, not in panic).
3. **~Sep 1:** beta build working on a real device? Yes → submit by ~Sep 10. No → store clock forces the decision.

**Hard constraint:** the **~Sept 10 app-store submission window** is the one point that cannot flex. Before it, pivoting is a controlled choice; after it, a slip is forced. See `docs/roadmap/mvp_roadmap.md` → "Launch Timeline & Store Clock."

**Dependency flag — reconcile D-001:** this decision assumes the **native (Expo/React Native)** direction from the strategy and tooling docs and the original project goal ("deployed as native apps for iOS and Android"). The current **D-001 working default is "web-first, defer native," which now conflicts.** D-001 should be re-confirmed as **Decided: native/Expo (with Next.js retained for the marketing + provider billing portal)** before Phase 1 architecture, or this delivery plan's store-clock/timeline assumptions change.

---

### D-010 — Multi-location support in MVP

**Status:** Deferred

**Question:** Should one business support multiple physical locations in MVP?

**Options:**

- **Single location per business** — matches small operators and Woof Wetreats scale
- **Multi-location** — locations table, schedule by site, staff assignment by site

**Working default:** **Deferred.** MVP assumes **one implicit location per business**. No location picker in UI or schema requirement beyond optional future field.

**Why it matters:** Data model complexity, schedule views, pricing, and staff permissions.

**Phase needed by:** Document as deferred in Phase 1; revisit after first pilot (Section 6).

---

## 5. Recommended Working Defaults for MVP

Use this summary when writing specs before items are **Decided**:

| Area | Working default |
|---|---|
| **Platform** | **Native (Expo/React Native)** for client + staff; thin Next.js web for marketing + subscription checkout; internal web tools optional anytime on same backend (staff side), not a launch priority |
| **Tenant model** | One shared DB; strict `business_id`; no global admin email |
| **Roles** | Owner, admin (optional), staff, client |
| **Invites** | Owner/admin generate staff and client codes; staff cannot invite clients |
| **Multi-business users** | Yes across businesses with context picker; no client+staff same business |
| **Pets** | Business-scoped pet records per client profile |
| **Meet-and-greet** | Business-configurable on/off; required when enabled |
| **Client portal** | Public landing + invite-required portal access |
| **Payments** | Manual tracking in MVP; Stripe Connect post-MVP |
| **Notifications** | In-app center in MVP; SMS post-MVP; email for paper trail |
| **Terms** | Template-based editable sections with version stamping |
| **Services** | Boarding + daycare shipped; schema allows future service types |
| **Locations** | Single location per business |
| **Staff ops** | Staff: schedule, households, bookings, staff notes, price override with audit; not config/payments/invites |

---

## 6. Decisions to Revisit After First Pilot / Business User

After the design partner runs on MVP (or a narrow pilot), revisit:

| ID | Topic | Trigger to revisit |
|---|---|---|
| D-001 | Web vs native | Staff/clients struggle on mobile web; push alerts inadequate |
| D-005 | Shared pet profiles | Same clients use multiple businesses and re-entry is painful |
| D-007 | Stripe Connect | Business loses bookings without online pay |
| D-008 | SMS alerts | Missed urgent bookings with in-app only |
| D-009 | Terms format | Templates too restrictive; legal counsel wants upload |
| D-010 | Multi-location | Business opens second site or distinct schedules |
| D-002 | Staff client invites | Owner bottleneck on invite generation |
| D-003 | Client+staff same business | Owner-operator wants to book own pet through client UI |
| D-020 | SaaS pricing | Real usage data on add-ons and plan tiers |
| D-022 | Additional services | Partner needs walking, grooming, or drop-ins |

Capture pilot feedback in `docs/decisions/` as new **Decided** or **Proposed** entries — do not silently change working defaults.

---

## 7. Phase 0 Exit Criteria Related to Decisions

Phase 0 (Product Definition) can close when:

### Must have Working Default or Decided

- [ ] **D-001** Launch platform has Working Default or Decided outcome
- [ ] **D-002, D-003, D-016, D-017** Permission-related defaults documented and reflected in `user_roles_and_permissions.md`
- [ ] **D-004, D-005, D-012** Multi-business and pet-scope defaults documented for Phase 1 handoff
- [ ] **D-006** Meet-and-greet configurability default documented
- [ ] **D-007, D-008, D-015** Payments and notifications scope defaults documented
- [ ] **D-009** Terms approach default documented
- [ ] **D-010** Multi-location explicitly **Deferred**
- [ ] **D-011** Client acquisition model (landing + invite portal) has Working Default

### Can remain Proposed until later phase

- **D-013, D-014** Invite code mechanics — finalize in Phase 2 invite spec
- **D-020, D-021** GTM and design partner — finalize before Phase 5 build planning
- **D-022** Additional services beyond boarding/daycare — finalize in Phase 4 MVP spec

### Process criteria

- [ ] This log exists and is linked from `product_brief.md` and `user_roles_and_permissions.md`
- [ ] No spec writer is blocked: every open question has a Working Default or Deferred status
- [ ] Stakeholder acknowledges Working Defaults are provisional until marked **Decided**
- [ ] Phase 1 owners know which decisions must become **Decided** before architecture sign-off (D-001, D-003, D-004, D-005, D-006 minimum)

**Phase 1 gate:** Architecture doc must cite decision IDs and flag any Working Default that changes table design or RLS shape.

---

## Next Steps

1. Stakeholder review: confirm or override Working Defaults → update status to **Decided**
2. Record **D-021** design partner name and target date when known
3. Begin Phase 1 with defaults for D-004, D-005, D-006, D-012
4. Schedule **Decided** review for D-001 and D-007 before Phase 5
