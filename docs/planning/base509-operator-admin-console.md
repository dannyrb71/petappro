# Base509 Operator Back-Office / Admin Console — Discovery (v0)

> **Status:** v0 discovery (captured 2026-07-08 from Danny). First-pass component inventory from
> knowledge; **expand with web research** on SaaS operator/back-office best practices ("what we don't
> know we don't know"). Not yet a spec.
>
> **The "2-sided" framing:** the Base509 web presence is two things — (a) the **customer-facing**
> marketing site + provider subscription checkout (already planned: `website-and-store-launch-plan.md`),
> and (b) this **internal operator back-office** where Base509 manages its SaaS customers (the PCSPs).

## → Codex ratification (2026-07-08)

The architecture items below were Cowork **proposals** and have now been reviewed by Codex (Technical Governor). Codex ratifies the direction with the modifications noted here; Danny still owns final **Decided** status in `docs/decisions/open_decisions.md`. Nothing here expands the Oct 1 build — this is "design the seam now, build when app #2 is real."

1. **Master / per-app data hierarchy** — Base509 master layer (shared account/identity + billing) → per-app **isolated** operational DBs; **no per-row `app_id`** across PetAppro's tables. (See "Multi-app / Base509 master data hierarchy" below.)
2. **Shared account-service boundary** — the stand-alone shared DB holds the **account only** (identity + Base509 billing relationship), **not** app-specific provider/client records (those stay per-app, linked by a stable Base509 id).
3. **Auth/identity path** — **Ratified:** path 1. Use PetAppro's Supabase Auth now + product-agnostic Base509 account model; extract to a central IdP later only when app #2 or cross-product SSO is real.
4. **Two migration-hygiene constraints — non-negotiable:** (a) a **stable Base509 account id** (`base509_accounts.id`) referenced in app tables + RLS, with `auth.uid()` isolated behind an identity mapping/helper; (b) **passwordless-first** (Apple/Google/magic-link; password fallback) — Danny Decided 2026-07-08, folded into **D-031**.
5. **Auth infra location + D-031:** **Modified/rule:** auth infra lives in the PetAppro Supabase project for MVP. Biometric app lock is local device protection, not a replacement for server-side MFA/step-up on sensitive mutations.

**Codex implementation constraints:** Do not add `app_id` to PetAppro operational rows. If/when app #2 exists, prefer separate operational Supabase projects per app over one mega-project. A schema-within-one-project boundary is acceptable only as an interim internal boundary, not a true isolation boundary.

## Decision links (this is mostly already anchored)

- **D-001** — internal web tools can be built on the same Supabase backend + RBAC, "optional anytime,
  not a launch priority." → this console is largely **post-launch**, same backend; only a minimal slice
  is needed at launch.
- **D-020** — subscription tiers, prorated upgrades, seat model, referral + fraud mitigation → the plan
  upgrade/downgrade/cancel management surface.
- **D-024** — support / break-glass role (least-privilege, PII + financials redacted, time-boxed,
  audited, tenant-consented) → the "database-level management" to help PCSPs with user-side issues.
- **D-007** — Stripe **Billing** (subscriptions, provider→Base509) in scope; Stripe **Connect**
  (client→provider) deferred. → console helps with Billing setup now; Connect help later.

## Component inventory (to research + right-size)

1. **Account & subscription management** — customer (tenant) directory + status
   (trial/active/past-due/canceled), plan **upgrade/downgrade/cancel** with proration preview,
   trials/comps/coupons, seat management, **dunning** (failed-payment retry/notify/grace/suspend),
   refunds & credits.
2. **Billing & finance ops** — invoices, payment status, MRR/ARR/churn, tax/receipts, Stripe sync.
3. **Support & success tooling** — break-glass "view-as" into a tenant (D-024), customer health
   signals (usage, last login, adoption, at-risk flags), issue/ticket tracking or integration.
4. **Tenant & staff administration** — view/manage a PCSP's staff/memberships (roles, invites),
   reset access, unlock accounts, resend invites, fix data (audited).
5. **Provisioning & lifecycle** — create/suspend/delete tenants, seed industry-template defaults,
   offboarding on cancel (retention/grace/export), **data export + in-app account deletion**
   (GDPR/CCPA + Apple requirement).
6. **Communications** — announcements, billing notices, product updates (ties notification system).
7. **Security / compliance / audit** — full **audit log** of admin actions (esp. break-glass,
   refunds, cancels), Base509-staff RBAC, consent capture.
8. **SaaS metrics** — MRR, churn, LTV, activation/retention cohorts, per-customer usage.
9. **Fraud / abuse** — referral-fraud mitigation (D-020), chargeback handling, suspicious activity.

## Multi-level verification (Danny's explicit ask)

Applies to **destructive/financial actions**: cancel, downgrade, refund, break-glass access.
- Minimum: confirmation + **reason capture** + **audit-log entry** + effective-date/proration preview.
- Highest-risk (refunds, account deletion, break-glass): add a **second approval** step.

## Timing — right-size vs launch

- **Launch-minimum (~Oct, when first PCSPs pay):** a way to see customers + status, handle a
  cancel/downgrade, and break-glass support into a tenant (D-024). Small, on the same backend.
- **Post-launch (grow into it):** full metrics, dunning automation, comms, fraud tooling, richer
  success tooling. Per D-001, not a launch blocker.

## Open questions / to research ("unknown unknowns")

- Build vs. buy: how much can Stripe's dashboard + a lightweight admin cover before a custom console
  is justified? (Stripe Billing portal handles some plan self-service.)
- Should PCSPs self-serve plan changes (customer-side) vs. all changes via operator console? (Likely
  self-serve upgrade, gated cancel/downgrade.)
- Retention/export policy on cancel (how long, what format) — legal + Apple/GDPR.
- Break-glass consent UX (D-024): how a PCSP grants/revokes time-boxed support access.
- Which SaaS admin patterns/tools to model (e.g., standard back-office feature sets) — the web-research pass.

## Multi-app / Base509 master data hierarchy (raised 2026-07-08, Danny — NEEDS CODEX REVIEW)

Danny: the operator console + customer records must be **tagged by which app** a customer uses once
Base509 owns more than one product — implying a **Base509 master → per-app → per-tenant (business)**
hierarchy ("our entire database needs a Base509 master level then a per-app id").

**Cowork recommendation (proposed — Codex, the tech governor, ratifies before locking):**
- **Yes to a thin Base509 *master* layer** spanning products: accounts/customer identity,
  subscriptions/billing, operator/support console, auth. **This layer carries the `app_id` / product
  dimension** (which app[s] a customer subscribes to). Correct home for the tag.
- **No to putting `app_id` across the entire operational database.** Each app's operational data
  (PetAppro bookings/pets/pricing_rules/schedules vs. a future app's different domain) stays
  **isolated** — preferably its own Supabase project when app #2 is real; a separate schema inside
  one project is acceptable only as an interim internal boundary. Each app remains self-contained
  and multi-tenant by `business_id`.
  Every row in PetAppro's project is *implicitly* PetAppro; per-row app_id is redundant coupling.
- **Timing:** design the **seam** now (model the master/billing/operator schema with a product
  dimension from day one — cheap, forward-compatible); build multi-app plumbing only when app #2
  exists. PetAppro ships as its own clean tenant DB — do **not** retrofit app_id across it now
  (over-engineering + Oct-1 risk).
- Consistent with **D-030** (pseudo-white-label shared app vs. bespoke isolated Enterprise builds).
- **Auth/identity across apps — Codex-ratified recommendation (2026-07-08):**
  *Per-app Supabase auth now, but model identity as a Base509-level, product-agnostic account.*
  - Shared-identity payoff (cross-product SSO, one account/bill) mainly benefits **PCSPs** who adopt a
    2nd product + **Base509 staff**; **end clients rarely span apps**, and no app #2 exists yet — so the
    benefit is narrow and post-launch.
  - Ship PetAppro on **standard Supabase auth in the PetAppro project** (fast, existing stack, no new
    vendor, no launch risk), but give each person a **stable, product-agnostic Base509 account id**
    (email-keyed, no PetAppro-specific fields in the account record); memberships + tenant links live
    in a **separate layer** referencing it. Same "design the seam, don't build the plumbing" call as
    the `app_id` decision.
  - **Do not** add an external IdP (Clerk/WorkOS/Auth0) now — revisit when app #2 is concrete or the
    multi-product roadmap accelerates. A later extraction to shared identity is still a migration, but
    manageable if identity stays clean.
  - **The "central auth app" idea (Danny, 2026-07-08):** a behind-the-scenes auth service all Base509
    apps trust = a **central identity provider** (the shared-identity option, concretely). Key point:
    it yields **one shared identity DB + N isolated per-app operational DBs** — NOT one database for
    everything — so it's *consistent* with keeping app data isolated. Feasible and correct as a design
    target. Caveats: **don't hand-roll auth** (security + build risk); the productized version already
    exists (external IdP, or one Supabase project as the shared identity home). Building a custom one
    for Oct 1 = out of scope; **buying** an IdP now = a legitimate option *if* committing to the
    multi-product path early. Decision: path 1 (clean model, extract later) vs path 2 (adopt IdP now)
    — **Codex ratifies.**
  - **Boundary clarification (Danny, 2026-07-08 — "a stand-alone clients/providers DB each app calls"):**
    the shared stand-alone service holds the **Base509-level ACCOUNT only** — identity (name, email,
    login, contact) + the subscription/billing relationship — for both providers and clients, resolved
    by a stable Base509 id. It does **NOT** hold **app-specific** provider/client records (PetAppro
    pricing_rules, services, pets, bookings, house rules); those stay in each app's own DB, linked by
    id. Share the *account*, not the *app records* — sharing the full records recreates the coupled
    mega-DB we're avoiding. (A future app's "provider" has an entirely different schema.)
  - **Migration cost of path 1 (extract-to-central-later) — and how to keep it cheap:** pain ranges
    from a mechanical few-days–2-week job to a risky multi-week project, driven by (1) **user count at
    migration** (extract while small; waiting hurts), (2) **identity hygiene** — referencing a
    **stable app-owned Base509 account id** (`base509_accounts` table or equivalent) in tables + RLS vs. raw
    `auth.uid()` everywhere (the latter = FK remap + RLS rewrite), and (3) **auth method** —
    **passwordless** (Apple/Google/magic-link) migrates cleanly; email+password means forced resets /
    re-hashing. **Two cheap steps now make the future migration mechanical, and must be Codex-ratified
    design constraints (not hopes):** (a) put a stable Base509 account id between data and Supabase
    auth; (b) lean passwordless (also better mobile UX at launch). If these can't be enforced, or
    app #2 is imminent, path 2 (buy an IdP now) becomes the better call — it removes the migration.

**Status:** Codex ratified with modifications; proposed decision entries D-034 through D-038 are now
in `open_decisions.md` for Danny's final lock.
