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
| D-007 | Payments: manual first vs Stripe Connect in MVP | **Decided** | **2026-07-08 (Option A): ship WITH in-app client→provider payments (Stripe Connect) in MVP.** Launch date flexes a few weeks to include it (D-023, ~late Oct). Manual tracking = safety-net fallback only if payments derail near the store deadline. SaaS Stripe **Billing** (MKT-6) always in. **Un-holds the pricing engine (critical path). Deposits stay OUT (D-015 — no deposits, Danny 2026-07-08).** See current-decision block in the detailed record | Build scope, timeline, pricing/deposits/checkout | Decided 2026-07-08 |
| D-008 | SMS alerts: MVP vs post-MVP add-on | Working Default | Post-MVP add-on; in-app notifications in MVP | Notification infra, cost, urgency handling | Phase 4 |
| D-009 | Terms/policies: template-based vs fully editable | Working Default | Template-based with editable sections | Business setup complexity, legal review | Phase 2 → 4 |
| D-010 | Multi-location support in MVP | Deferred | Deferred — single location per business | Data model, schedule, pricing, staff assignment | Phase 1 (document only) |
| D-011 | Public landing page vs invite-only client portal | Working Default | Both — public landing + invite-required client portal | Client acquisition, onboarding UX | Phase 0 → 2 |
| D-012 | Client of Business A and staff of Business B (different businesses) | Working Default | Yes — with business context switching | Multi-tenant auth, session context | Phase 1 |
| D-013 | Invite codes: single-use vs reusable | Proposed | Reusable until revoked; optional max uses TBD | Onboarding ops, security | Phase 2 |
| D-014 | Invite codes: expiration | Proposed | Optional expiration; owner sets or never expires | Security vs convenience | Phase 2 |
| D-015 | Deposits at MVP | **Decided** | **No deposits** — full booking total (charged at confirmation via Connect). Unchanged even with Connect in MVP (Danny, 2026-07-08); revisit only if customers ask for it | Payments spec, pricing engine | Decided 2026-07-08 |
| D-016 | Staff can block/unblock clients | Working Default | No — owner/admin only | Permission matrix, abuse prevention | Phase 0 → 2 |
| D-017 | Staff can confirm manual payments | Working Default | No — owner/admin only | Financial integrity | Phase 4 |
| D-018 | Staff can override booking prices | Working Default | Yes — with audit trail | Operations flexibility vs control | Phase 4 |
| D-019 | Admin role required at MVP | Working Default | Optional — owner-only businesses OK | Role model, small business UX | Phase 0 |
| D-020 | First SaaS pricing and launch add-ons | Proposed | TBD — document after design partner confirmed | GTM, scope for Stripe/SMS | Phase 0 → 5 |
| D-021 | First test tenant + beta testers + target launch date | **Decided (structure)** | **First test tenant = Danny + Marco's own business** (the MVP-complete freeze bar, D-028). **Beta testers = 5–6 PCSPs** recruited via local Facebook group + Danny's network (post-freeze validation). Launch target Oct 1 (D-023). Specific PCSP names still TBD | Prioritization, success criteria, freeze bar | Decided 2026-07-07 (names TBD) |
| D-022 | Service catalog in MVP (which service types ship) | **Decided** | **MVP ships boarding + daycare + dog walking** (walking = bookable service; **no GPS/live route tracking** in MVP). Schema supports more; sitting/training/hair/massage designed-for, not built. Walking adds per-session/duration pricing, time-of-day scheduling (F-001), recurring walks, and group concurrency/capacity | Build scope; pulls capacity engine into MVP | Decided 2026-07-07 |
| D-023 | Delivery approach: deadline-driven vs gate-driven | **Decided** | **Hybrid** — gates on the foundation, flex scope; ~Aug 15 go/no-go (see detailed record). **Update 2026-07-08:** to keep in-app payments in MVP (D-007 Option A), the launch **date now flexes** — target moves from Oct 1 toward **~late October** (payments are allowed to move the date). Store-clock items (D-U-N-S→accounts→submit→review buffer) still gate the outer bound | Whether Sprint 1 starts now; how slippage is absorbed; launch date | Phase 0 (now) |
| D-024 | PetAppro-side support / break-glass role (incl. outsourced help/eng) | Proposed | Platform role with least-privilege: financial + PII redacted, access logged, time-boxed, tenant-consented | Trust/security; the only sanctioned cross-tenant access | Schema-aware in Phase 1; build post-MVP |
| D-025 | Multi-currency (provider prices in own currency) | Proposed | Per-business `currency`; money stored as minor units; tax (GST/VAT) + subscription currency deferred | International providers; pricing engine; billing | Schema in Phase 1; tax later |
| D-026 | How customers connect to a provider | Proposed | Invite code + QR only; **never** search-by-business-name | Client onboarding UX; privacy (no provider directory) | Phase 2 invite spec |
| D-027 | Primary JTBD anchor for design research | **Decided** | **Owner/PCSP is the primary JTBD anchor** (buyer + operator); client + staff are first-class supporting jobs that rise to primary within their own flows. Anchor governs prioritization, not attention | Research framing, archetype priority, flow ownership, trade-off calls near Oct 1 | Decided 2026-07-06 |
| D-028 | MVP-complete / feature-freeze definition | **Decided** | **Danny + Marco's own business runs a genuine booking end-to-end (onboarding → booking → server-validated pricing → staff schedule → history/notifications) on physical iOS *and* Android, tenant isolation verified, with a REAL PAID BOOKING via Stripe Connect** (updated 2026-07-08 per D-007 Option A; manual tracking only if payments derail). When true, features freeze; only bug-fix/polish/store-prep after. Own business is the freeze bar; PCSP beta is the next milestone | Defines "done" for the build; governs scope cuts near launch | Decided 2026-07-07 (freeze bar updated 2026-07-08) |
| D-029 | Platform stance: booking software, never a marketplace/broker | **Decided** | **PetAppro is booking software the PCSP runs — it never intermediates the PCSP↔client relationship.** No provider directory/discovery (aligns D-026), no lead-gen marketplace, **no take-rate/commission on client→provider payments** (aligns D-007), no platform-set or platform-guaranteed pricing, never holds the client relationship. Revenue = PCSP subscription only (Stripe Billing, D-001). Community-building (social accounts, in-person events to connect PCSPs) is allowed; brokering their money/service exchange is not | Core differentiator vs Wag/Rover; legal/positioning guardrail (software vendor, not agency/broker/marketplace/employer); app-store classification; forecloses commission monetization | Decided 2026-07-07 |
| D-030 | White-label model + Enterprise isolation tier | **Decided** | **Product = pseudo white-label**: one shared app + one shared DB (RLS), runtime per-tenant theming; provider resolved by invite code / QR / deep link (D-026); one federated client identity + account switcher (D-004). **True white-label = bespoke Enterprise**: separate app + separate DB + separate deployment, fully isolated, higher setup + recurring, custom-contracted, **post-MVP**. Cold open is the only PetAppro-branded surface | Full white-label ("opens already branded") is impossible in one multi-tenant app at cold open; tiering resolves it and protects launch scope (D-023); vindicates DS per-tenant theming; aligns D-004/D-011/D-026/D-029 | Decided 2026-07-07 |
| D-031 | Login security / step-up MFA (payments + PII) | **Decided** | **Risk-based step-up auth, not blanket 2FA every login**: biometric app lock (Face ID/Touch ID/Android); TOTP MFA for email/password; social sign-in (Apple/Google) as a baseline factor; **step-up required for sensitive actions** (change payment method, change email/password, provider financials/payouts/refunds); **mandatory MFA for owner/admin**. Driver = account-takeover (off-session charges + PII), NOT card data (Stripe vaults cards; we never store them) | Protects money-moving actions + PII; shapes Supabase Auth config + RBAC; pending Danny final lock | Phase 1 auth model; before payments ship |
| D-034 | Base509 master / per-app operational isolation | **Decided** | Thin Base509 master layer for account, product entitlement, SaaS billing, operator audit/support; PetAppro operational data remains isolated and tenant-scoped by `business_id`; no per-row `app_id` in PetAppro tables | Prevents cross-product coupling and RLS complexity while preserving future multi-product seam | Phase 1 architecture |
| D-035 | Stable Base509 account id | **Decided** | App relationships reference `base509_account_id`, not raw `auth.uid()`; Supabase Auth subjects are mapped through an identity table/helper | Makes later central identity extraction mechanical and keeps RLS from binding to provider-specific auth ids | Before migrations |
| D-036 | Auth path for MVP | **Decided** | PetAppro uses Supabase Auth in the PetAppro project for MVP; central IdP/external IdP deferred until app #2 or cross-product SSO is concrete | Avoids IdP migration/build risk before Oct 1 while preserving a clean seam | Phase 1 auth model |
| D-037 | Shared account-service boundary | **Decided** | Shared Base509 layer stores account identity and Base509 billing relationship only; app-specific provider/client records stay in each app operational DB | Avoids a coupled mega-DB and keeps provider/client concepts app-contextual | Phase 1 architecture |
| D-038 | Passwordless-first and step-up implementation | **Decided** | Apple/Google/magic-link primary, password fallback; owner/admin MFA before sensitive provider actions; biometric app lock is local protection, not server-side auth replacement | Protects money/PII without blanket login friction; clarifies Supabase/Auth/RLS responsibilities | Before payments/billing-sensitive flows |

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

**Status:** Decided (2026-07-08) — **payments IN the MVP (Option A).** Supersedes the 2026-07-07 "manual-only / MVP-if-feasible" language below.

**CURRENT DECISION (2026-07-08, Danny — supersedes all prior D-007 language):** **Ship PetAppro WITH in-app client→provider payments (Stripe Connect) in the MVP (Option A).** Danny chose to include payments even at the cost of flexing the launch date a few weeks (→ D-023; realistic target ~late October). **Manual tracking remains only as a safety-net fallback if payments genuinely derail near the store deadline** — it is no longer the *planned* MVP path. Consequences: the **pricing engine is un-held and on the critical path** (automated charging requires correct totals); **deposits stay OUT (D-015 — no deposits, Danny 2026-07-08; revisit only on customer feedback)**; the MVP-complete freeze bar (**D-028**) becomes a *real paid booking via Connect*. Still applies only to client→provider booking payments; SaaS Billing (provider→Base509) was always in.

**Question:** Does MVP include Stripe Connect, or only manual payment status tracking?

**Options:**

| Option | Pros | Cons |
|---|---|---|
| **Manual only (chosen)** | Faster; no Connect onboarding; fits cash/Venmo-heavy operators | No online client→provider pay in product at launch |
| **Stripe Connect in MVP** | Complete payment story; client pay links | Compliance, setup friction, timeline risk |
| **Manual MVP + Connect fast-follow** | Balanced | Two payment releases to maintain |

**Decision:** **Manual payment tracking is the sole MVP payment path** (cash, check, Venmo, Zelle, other + staff confirmation). **Stripe Connect is deferred to post-MVP** — Danny confirmed it is a *nice-to-have, not launch-critical*. Connect becomes the first post-freeze payment add.

**Important scope boundary:** This applies only to **client → provider** booking payments (Connect). It does **not** touch **SaaS subscription billing** (provider → Base509) via **Stripe Billing on the web** (D-001, MKT-6), which stays in scope — that is how PetAppro earns revenue at launch and must not be cut.

**Why it matters:** Owner setup flow, payments spec, booking confirmation UX, Phase 5 milestone order. Removing Connect from the MVP slice de-risks the Oct 1 date (D-023 scope flex).

**Where reflected:** `mvp_roadmap.md` (MVP Scope Reference — moved to *Defer beyond MVP*; Phase 4 payment spec; Phase 6 milestone 7), annex `PetAppro-Roadmap-and-Project-Plan.md` (Sprint 4, milestones, backlog → post-launch), and the MVP-complete freeze bar (D-028).

**Revision (2026-07-07 pm) — Stripe is MVP-if-feasible:** Danny softened the hard defer: **include Stripe Connect in MVP if it fits the Oct 1 store clock; otherwise ship it as the first post-MVP release.** **Manual payment tracking stays as the guaranteed fallback so payments never block launch.** Codex + Claude Code assess feasibility against D-023 at the ~Jul 18 / ~Aug 15 checkpoints. Consequence: the Stripe checkout + tip flows designed in discovery (charge-at-confirmation, tip-as-separate-charge, Payment Element, off-session capture) are **MVP-candidate**, not purely post-MVP artifacts — but only ship if the date holds. Still applies only to **client→provider** booking payments; SaaS Billing (D-001) is separate and always in.

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

### D-020 — First SaaS pricing, tiers, and launch add-ons

**Status:** Proposed (billing build is deferred — gated on D-021 first test tenant / beta; needed by Phase 5). Captured requirements so nothing is lost:

- **Tiers by app users:** chosen at signup by number of users on the provider's side — **1 user, 2 users, small business**. First/creating user always defaults to **`owner`** (all-access incl. financials).
- **Adding users:** when the owner adds a 2nd user/staff, onboarding **prompts for permission level** and shows a **chart explaining the levels** (from `user_roles_and_permissions.md` §10), plus a **disclaimer that `admin` can see business financial data**.
- **Billing period:** offer **monthly vs annual** per tier.
- **Upgrades:** allow **plan upgrade after purchase, pro-rated**.
- **Promotions:** e.g. **referral bonus** — bonus granted after a referred new client pays X months / an annual plan; **bonus reverses if they pay then cancel/refund**. Design with fraud mitigation in mind (self-referral, churn-and-return, chargebacks).
- **Rail:** all subscription billing is **Stripe Billing on the web** (D-001), never iOS IAP. SMS is positioned as a paid add-on / top-tier feature (D-008).

**Why it matters:** GTM, seat model, web checkout scope. **Do not build yet** — record here; spec in Phase 5 once D-021 is set.

---

### D-024 — PetAppro support / break-glass role

**Status:** Proposed (schema-aware now; build post-MVP).

A platform-side role so PetAppro (or outsourced help/engineering) can assist a provider. It deliberately crosses the tenant wall, so it is the **only** sanctioned exception to "no cross-tenant access" and must stay narrow:

- Least-privilege by default; **financial + PII fields redacted**.
- Every access **logged and audited** (`platform_access_log`), **time-boxed**, and **ideally tenant-consented** (break-glass).
- Schema assumes it exists now so it isn't retrofitted insecurely.

**Why it matters:** Support/trust vs. the strict tenant boundary; extra care if help is outsourced.

---

### D-025 — Multi-currency

**Status:** Proposed (schema in Phase 1; tax later).

Providers may operate in different countries. Money is stored as **integer minor units + a per-business `currency`**, so a provider prices bookings in their own currency (USD/CAD/EUR/AUD/…). **Deferred:** tax handling (GST/VAT) and the currency of our own SaaS subscription — both are later GTM items the schema won't block.

**Why it matters:** International expansion; pricing engine correctness; billing.

---

### D-026 — How customers connect to a provider

**Status:** Proposed (Phase 2 invite spec).

Customers **never browse a directory** of providers. They connect only via a provider-issued **invite code** or **QR code** (a QR is just that code, scannable). **Search-by-business-name is intentionally never offered.** The in-app picker shows only providers the user is already connected to.

**Why it matters:** Onboarding UX and privacy — no discoverable list of any provider's clients or of providers themselves.

---

### D-028 — MVP-complete / feature-freeze definition

**Status:** Decided (2026-07-07)

**Question:** What single, unambiguous event means "the MVP is built" and feature development should stop?

**Decision:**

> **MVP Complete = Danny + Marco's own business runs a genuine booking end-to-end** — client onboarding → booking → server-validated pricing → staff schedule → history/notifications — **on physical iOS *and* Android builds, with tenant isolation verified, and a REAL PAID BOOKING via Stripe Connect** (updated 2026-07-08 per D-007 Option A — payments are now in the MVP; manual tracking is only the safety-net fallback if payments derail).

When this is true, **features freeze.** Everything after is bug-fixing, polish, accessibility, and store prep — no new features without an explicit scope decision.

**Why the *own business* is the freeze bar (not a recruited customer):** using Danny + Marco's own business as the **first test tenant** removes a recruiting dependency from the freeze line while still forcing every core system to be real at once — tenant schema + RLS, RBAC, business setup, onboarding, and the booking + pricing engine — on real devices rather than a simulator. A seeded throwaway tenant could pass while hiding gaps; a real operating business cannot.

**Relationship to beta testers:** the **5–6 PCSPs** Danny recruits (local Facebook group + broader network) are **beta testers**, the validation milestone *after* the freeze (TestFlight/closed track) — not part of the freeze bar. Store submission runs in parallel on the Launch Readiness track. (See D-021.)

**Terminology note:** "design partner" is retired for the freeze/test-tenant context — the own business is the **test tenant**; recruited operators are **PCSP beta testers**.

**Why it matters:** Gives the build a crisp definition of done, maps to Phase 6 exit criteria, and sets the line that scope cuts (D-023) protect toward Oct 1.

---

### D-029 — Booking software, never a marketplace/broker

**Status:** Decided (2026-07-07)

**Decision:** PetAppro is **booking software the PCSP operates** — it never inserts itself into the PCSP↔client relationship. Concretely, PetAppro does **not**:

- run a **provider directory or discovery/search** surface (reinforces D-026: connect by invite code/QR only);
- act as a **lead-gen marketplace** that finds clients for providers;
- take a **commission/take-rate** on client→provider payments (reinforces D-007: subscription-only revenue via Stripe Billing, D-001);
- **set or guarantee** provider pricing or the service itself;
- **own or hold** the client relationship — the PCSP does.

**What is allowed:** community-building that *connects PCSPs to each other* — PetAppro-run social accounts, and potentially in-person/social events — as long as PetAppro never brokers, intermediates, or gets between any provider↔client exchange of money or services.

**Why it matters:** This is the **core differentiator vs. Wag and Rover.** Those platforms insert themselves as the marketplace, own the client, and take a cut — precisely what PCSPs are fed up with. Staying "just the software" is both the wedge and a legal/positioning guardrail: PetAppro is a **software vendor, not an agency, broker, marketplace, or employer.** It also shapes app-store classification and deliberately forecloses commission-based monetization.

**Guardrail test (apply to any future feature):** if a feature would make PetAppro the party that *finds the client, sets the price, holds the money, or guarantees the service*, it violates D-029. Tooling and community that help providers do those things themselves are fine; PetAppro doing them is not.

**Relationship framework:** formalizes the three-party model — PetAppro↔PCSP (vendor↔customer, sole revenue), PCSP↔client (the real-world care+payment relationship the PCSP owns), PetAppro↔client (thin: app access, no money, no brokering).

---

### D-030 — White-label model & Enterprise isolation tier

**Status:** Decided (2026-07-07)

**Question:** How does PetAppro deliver "white-label" across many providers when a single multi-tenant app can't open pre-branded to a provider it hasn't identified yet?

**Decision:**

- **The product ships pseudo white-label only.** One shared PetAppro app (single App Store / Play listing), one shared multi-tenant database (RLS-isolated), with **runtime per-tenant theming** — logo, colors, business name applied in-app once the provider is known. Provider identity is carried by the **entry point** (invite code / QR / deep link, per D-026), so the app resolves to one provider and themes to them. A **cold open** with no link is the *only* PetAppro-branded surface → it prompts for the provider's code/QR (never a directory). One **federated client identity**; an **account switcher** across the providers a client is already connected to (aligns D-004, D-026).
- **True white-label = a bespoke Enterprise engagement, post-MVP.** "Never see PetAppro" (own store listing, own app icon, own everything) requires a **separate binary** — so it is offered only as a **custom-contracted build** with its **own database + deployment + app**, fully isolated. Priced as premium: **higher setup fee + higher recurring.** Not self-serve, not a productized tier; built only when a customer pays for it. Because it is physically isolated, its identity is its **own silo**.
- **Browse vs. connect (reconciles George's browse path with D-026):** a provider's **invite code unlocks the read-only preview** (business profile, services, rate estimates, general availability, service area, policies, "Accepting New Clients" status) — you can view without an *account*, but **not without a *code*** (reinforces D-026 — nothing is publicly viewable). Flow: **enter code → Welcome / preview** → **"not yet — keep viewing"** or **sign up** when ready. A raw link/QR may pre-fill the code but still routes through code validation before the preview; no calendar or client data exposed.

**Dual-client consequence (the case that forced this):**
- Client of **two Standard providers** → one app, one login, switch between them.
- Client of **one Enterprise + one Standard** → **two apps, two accounts** — the Enterprise DB is isolated, so its identity can't (and shouldn't) federate. Expected and acceptable at that tier; the Enterprise fee covers the isolation.

**Guardrail (D-029/D-026):** "select provider" in the shared app is an **account switcher among already-connected providers only** — never a discovery directory. Full-white-label polish stays in the D-023 de-scope order (cuttable to hold Oct 1).

**Why it matters:** Resolves the cold-open branding impossibility; keeps separate-binary builds out of the MVP (protects the Oct 1 date, D-023); confirms the design-system's per-tenant theming as the mechanism for pseudo-WL; aligns D-004 (multi-business), D-011 (landing + portal), D-026 (no directory), D-029 (no marketplace).

---

### D-031 — Login security / step-up MFA

**Status:** Proposed — Codex ratified (Phase 1 auth model; finalize before payments ship), pending Danny final lock. **Passwordless-first stance Decided by Danny 2026-07-08.**

**Question:** Given the app can move money and holds PII, what extra login security do we require — and how much friction?

**Framing (important):** because payments run through **Stripe** (Payment Element + Stripe's vault), **we never store or see card numbers — PCI stays with Stripe.** So the driver is **not** card data in our DB; it's **account takeover** — a compromised account can trigger **off-session charges/tips** on a saved (tokenized) card, read **PII + booking history**, and on the provider side see **financials/payouts**.

**Working default (recommended):**

- **Risk-based step-up auth, not blanket 2FA on every login** (avoids mobile friction on everyday booking).
- **Biometric app lock** (Face ID / Touch ID / Android biometric) as the mobile-native second factor.
- **TOTP MFA** for email/password accounts (Supabase Auth supports it); **social sign-in (Apple/Google)** counts as a baseline factor (carries the IdP's own MFA).
- **Passwordless-first (Decided — Danny, 2026-07-08):** strongly prefer/offer **Apple, Google, and magic-link** sign-in; email+password only as a fallback where needed. Better mobile UX *and* de-risks the future central-identity migration (no password-hash portability problem — see `docs/planning/base509-operator-admin-console.md`).
- **Step-up required for sensitive actions:** add/change payment method, change email/password, and provider financials/payouts/refunds.
- **Providers > clients:** **mandatory MFA for owner/admin** (touch money + client PII); clients can be step-up only.

**Why it matters:** Shapes Supabase Auth configuration and the RBAC/permission matrix; gates the payment surface (ties to D-007). Protects money-moving actions and PII regardless of whether Stripe lands in MVP.

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
| **White-label** | **Pseudo** only in-product (shared app + DB, runtime per-tenant theming, provider resolved by code/QR/link); true white-label = bespoke isolated **Enterprise** build, post-MVP (**Decided, D-030**) |
| **Payments** | Manual tracking is the sole MVP path; Stripe Connect deferred post-MVP (**Decided, D-007**). SaaS billing via Stripe Billing on web stays in scope |
| **Notifications** | In-app center in MVP; SMS post-MVP; email for paper trail |
| **Terms** | Template-based editable sections with version stamping |
| **Services** | Boarding + daycare + dog walking shipped (walking = service only, no GPS); schema allows future service types |
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
- **D-020, D-021** GTM, SaaS pricing, and specific PCSP beta-tester names — finalize before Phase 5 build planning
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
2. Record **D-021** specific PCSP beta-tester names as they're confirmed (test tenant + launch date already Decided)
3. Begin Phase 1 with defaults for D-004, D-005, D-006, D-012
4. Schedule **Decided** review for D-001 and D-007 before Phase 5

### D-032 — Team permission levels (simplified)

**Status:** Decided (2026-07-07)

Four named levels; the PCSP invites a member and assigns one. "Co-provider" = someone assigned **Admin** (not a separate role). **Owner** (creator) has everything incl. editing financial connections + billing + ownership. **Admin** = Owner minus editing financial connections / billing / ownership (kept distinct so a partner can be Admin safely). **Manager** = full operations but no financial visibility and no price-override. **Staff** = view bookings/clients, add a booking, set up M&Gs, care execution, SMS; cannot edit/delete bookings or price-override (and cannot invite clients, D-002). Price-override + financial reports are Owner/Admin-only; SMS is all levels. Adds **Manager** to the prior Owner/Admin/Staff model. See `docs/planning/user_roles_and_permissions.md` (Team permission levels) + FigJam "Provider · Staff / team management". Ties to D-020 (seats/tiers); implement through membership-backed RBAC/RLS.

### D-033 — App IA: single app, Client / Provider(graded) fork; roles are nested

**Status:** Decided (2026-07-07)

One app, one auth. After login the app **forks by role within the active business context** into just **two** experiences: **Client** or **Provider-side** (not three; staff is not a separate app).

- **Provider-side is ONE experience, permission-gated (progressive disclosure)** — not separate "admin app" and "staff app." Roles are **nested capability sets: Staff subset of Manager subset of Admin subset of Owner.** Staff = the operational core (visits, check-in/out, report cards, daily schedule); each higher level only *adds* (Manager: broader ops, no financials; Admin: financials + settings + team; Owner: billing + ownership). Nothing a lower role can do is missing from a higher role.
- **Solo provider proves it:** they're Owner-level but personally do the Staff-level care work, so their provider home blends operator + owner views on the same screens, fully unlocked. Adding a team delegates the operational layer downward; same screens, who-sees-what changes.
- **Build implication:** design each provider screen for the **base (Staff) capability** and layer higher-level controls as **permission-gated additions** — do NOT build admin vs staff separately. Client is its own branch (most users; validates the core booking loop, so wireframe it first).
- **Context, not global account:** a person can be Client at business A and Staff at B (D-012), so the fork resolves per active business context, not per account.
- Aligns D-001 (single native app), D-004/D-012 (multi-business context), D-019 (admin optional), D-027 (provider = primary anchor), D-030 (pseudo-WL theming lives in the shared shell), D-032 (role levels).

### D-034 — Base509 master / per-app operational isolation

**Status:** Decided (Danny locked 2026-07-08; Codex ratified).

Base509 owns a thin shared master layer for account identity, product entitlement, SaaS billing, operator support/audit, and cross-product metadata. PetAppro operational data remains in the PetAppro operational store, tenant-scoped by `business_id`; do **not** add per-row `app_id` across PetAppro tables.

When app #2 becomes real, prefer separate operational Supabase projects per app. Separate schemas inside one project are acceptable only as an interim internal boundary, not a true isolation boundary. One mega-project with `app_id` on every row is rejected because it adds RLS complexity and cross-product leak risk.

### D-035 — Stable Base509 account id

**Status:** Decided (Danny locked 2026-07-08; Codex ratified).

PetAppro app relationships reference a stable `base509_account_id`, not raw `auth.uid()`. Supabase Auth ids are provider-specific login subjects and are mapped through an identity table/helper. RLS policies should call `current_base509_account_id()` and membership helpers rather than embedding raw auth ids throughout app tables.

Minimum migration hygiene: create `base509_accounts` + `auth_identities` (or equivalent names) before tenant tables depend on identity, and use `base509_account_id` in `business_memberships`, `clients`, actor/audit columns, notifications, and support logs.

### D-036 — Auth path for MVP

**Status:** Decided (Danny locked 2026-07-08; Codex ratified).

PetAppro ships with Supabase Auth in the PetAppro project. The account model remains product-agnostic so central identity can be extracted later if app #2 or cross-product SSO becomes concrete. Do not buy Clerk/WorkOS/Auth0 for the Oct 1 MVP, and do not hand-roll central auth.

**Implementation note (Danny, 2026-07-08):** name and structure the auth/account data fields so they **map cleanly to prepackaged authentication systems** (e.g., standard concepts like `provider`, `subject`, `email`, `account_id`). This keeps a later swap to an external IdP low-friction — the extraction is a mapping exercise, not a redesign.

### D-037 — Shared account-service boundary

**Status:** Decided (Danny locked 2026-07-08; Codex ratified).

The shared Base509 layer stores account identity and the Base509 billing relationship only. App-specific provider/client records stay in each app's operational database and link back by stable Base509 account id. "Provider" and "client" are app-context roles, not global Base509 person types.

### D-038 — Passwordless-first and step-up implementation

**Status:** Decided (Danny locked 2026-07-08; Codex ratified). Passwordless-first itself was already decided by Danny and belongs with D-031.

Apple, Google, and magic-link/passwordless login are primary; email/password is fallback. Owner/admin users must satisfy MFA/step-up before sensitive provider actions such as billing, financial settings, refunds, exports, team permission changes, and break-glass consent. Client users can remain risk-based step-up only.

Biometric app lock is local device protection and improves mobile safety, but it is not a server-side authorization factor. Sensitive mutations must still route through Edge Functions/RPCs that check role, auth assurance where available, and audit the action.
