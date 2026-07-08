# PetAppro Technical Architecture (Phase 1)

Multi-tenant foundation for PetAppro. This doc defines the tenant boundary, auth/membership model, RLS strategy, pricing authority, notification outbox, storage scoping, and the code/repo shape. It is the architecture half of Phase 1; the table-level detail lives in `data_model_draft.md`.

> **Status:** Phase 1 draft (2026-07-06). Working defaults from `docs/decisions/open_decisions.md` are cited by ID; any change from a default requires updating that log and this doc.
>
> **Canonical inputs:** `docs/planning/product_brief.md` (what/who), `docs/planning/user_roles_and_permissions.md` (permission matrix), `docs/planning/woof-wetreats-to-petappro-rebuild-plan.md` (data model + anti-patterns), `docs/roadmap/mvp_roadmap.md` (phase gates), `docs/decisions/open_decisions.md` (decisions).
>
> **Never cut (D-023):** multi-tenant boundary + `business_id`, RBAC/RLS, the single shared pricing package, and its regression tests.

---

## 0. Glossary

- **RLS (Row-Level Security)** — a Postgres feature that filters table rows per user at the database layer, so the DB only returns rows the caller is allowed to see. It is the wall between tenants; a bug in app code cannot leak another provider's data.
- **Tenant** — one provider business (`businesses.id`). All their data is scoped by `business_id`.
- **Membership** — a row saying "user X has role Y in business Z." Permissions come from these rows, never a hardcoded email.
- **Edge Function** — server-side code (runs on Supabase) used for the authoritative booking/pricing paths the client cannot be trusted with.
- **JWT** — the signed token proving who the logged-in user is on each request.
- **IAP** — Apple/Google in-app purchase (their ~30% billing rail). We avoid it by selling the provider subscription on the web.
- **PCSP** — Pet Care Service Provider (our customer: the boarding/daycare/walking business).

---

## 1. Architecture at a glance

PetAppro is one shared application and one shared Supabase (Postgres) database. Every business-specific row carries a `business_id`; isolation is enforced in the database with Row-Level Security (RLS), not just in application code. Permissions resolve from **membership in the active business** — never a global admin email (retires the Woof Wetreats `ADMIN_EMAIL` pattern).

```
                       ┌─────────────────────────────────────────┐
   Native (Expo/RN)    │  apps/mobile   — client + staff app      │  D-001
   ── auth, booking ──▶│                  (single codebase)       │
                       └───────────────┬──────────────────────────┘
                                       │  Supabase JS (anon key + user JWT)
   Web (Next.js)       ┌───────────────▼──────────────────────────┐
   ── marketing + ────▶│  apps/web      — marketing site +         │  D-001
      subscription     │                  provider subscription    │  (web checkout,
      checkout         │                  checkout (Stripe Billing) │   not iOS IAP)
                       └───────────────┬──────────────────────────┘
                                       │
          ┌────────────────────────────▼────────────────────────────┐
          │                     Supabase                              │
          │  Postgres + RLS   ·   Auth   ·   Storage   ·   Edge Fns   │
          │  packages/pricing (server authority)                      │
          └───────────────────────────────────────────────────────────┘
```

The native app is the product (client + staff). The web app is a thin marketing + billing surface only — there is no web product app at MVP (D-001).

## 1a. Technology stack

The concrete "what we build on." Choices follow D-001 (native/Expo) and the existing Woof Wetreats Supabase foundation (reuse the backend paradigm, rebuild tenant-aware).

| Layer | Choice | Notes |
|---|---|---|
| **Language** | TypeScript end-to-end | App, web, packages, Edge Functions — one language, shared types |
| **Client + staff app** | **Expo / React Native** | The product; iOS + Android from one codebase (D-001) |
| **App build/release** | **EAS Build + EAS Submit** | Store binaries; ties to Apple/Google Org accounts (store clock) |
| **Marketing + billing web** | **Next.js** | `apps/web`; marketing pages + provider subscription checkout only |
| **Web hosting** | Vercel or Netlify (TBD) | Marketing/checkout surface; low complexity |
| **Backend / DB** | **Supabase — Postgres 15** | One shared DB, RLS-enforced tenancy |
| **Auth** | **Supabase Auth** | One account per person; membership rows grant business access |
| **Server logic** | **Supabase Edge Functions** (Deno/TS) | Server-authoritative booking + pricing paths |
| **File storage** | **Supabase Storage** | Tenant-prefixed paths, signed URLs |
| **Shared pricing** | `packages/pricing` (TS) | Single source of truth, server authority |
| **Subscription billing** | **Stripe Billing** (web) | Business → Base509 SaaS fee; not iOS IAP (D-001) |
| **Client↔business payments** | Manual MVP; **Stripe Connect** post-MVP | D-007 |
| **Push / notifications** | Expo push (in-app + native); SMS deferred | D-008 |
| **Monorepo tooling** | npm/pnpm workspaces + Turborepo (TBD) | `apps/*`, `packages/*`, `supabase/` |
| **CI** | **GitHub Actions** | Typecheck + lint + test per PR (S1-6) |
| **Types** | `supabase gen types` → `packages/data` | Generated DB types shared app-wide (S1-5) |

Items marked TBD are non-blocking infrastructure choices (hosting, workspace tool) — decide at Sprint 1 setup; they don't affect the tenant model or schema.

## 2. Tenant model

**One shared database, strict `business_id` separation** (product principle 1; rebuild plan "Tenant and Access Model").

- **Tenant = `businesses.id`.** Every operational entity references exactly one business.
- **No per-customer database, no per-customer schema** at MVP — a single shared Postgres with RLS.
- **Single location per business** (D-010, Deferred): no `location_id` in MVP; leave room for an optional field later, do not model multi-location now.
- **The tenant boundary is the security boundary.** Cross-tenant reads are impossible at the database layer, not merely hidden in the UI.
- **Scales up to larger operators without redesign.** The shared Supabase backend, generated types, and shared packages mean additional client surfaces — a **tablet or web app for bigger multi-staff businesses** — can be added later on the *same* backend and RBAC (D-001 already allows internal/web tools anytime). Growth path is "add a surface," not "re-architect." Multi-location (D-010) is the one deferred piece; keep the seam.

### 2.1 Identity vs. tenancy

One `auth.users` row per person. A person's *relationship* to a business is expressed by rows, not by their account:

- **Staff/owner/admin** → a `business_memberships` row (`user_id`, `business_id`, `role`).
- **Client** → a `clients` row (`user_id`, `business_id`, profile fields).

This supports the multi-business scenarios in `user_roles_and_permissions.md` §8:
- Client at A **and** staff at B → allowed; two rows, two contexts (D-012, default Yes).
- Client at A **and** client at B → allowed; separate client profile per business (D-004, default Yes; pets re-entered per D-005).
- Client **and** staff at the **same** business → blocked at MVP (D-003, default No; enforce at invite time). *A person who is staff at a provider and also wants to be that provider's customer must use a separate email/account for the client side — document in the website FAQ.*

**Relationship lifecycle.** A client's tie to a provider is a **row with a state** (`active → ended`), not the account itself. Leaving a provider sets the relationship inactive (reversible, nothing deleted); joining a new provider adds a fresh relationship via connect (§3). One person, many provider relationships that come and go over time.

### 2.2 Active business context

Because a user may belong to multiple businesses, every authenticated session operates in **one active `business_id`**:

1. After login, resolve the user's memberships + client profiles.
2. If more than one business, show a business picker (or default to last-used).
3. All queries, permission checks, and views are scoped to the active `business_id`.
4. No view ever mixes rows from two businesses.

The active business is passed to the server on every request (JWT claim or explicit parameter validated against the user's memberships) so the server — not the client — decides what the user may see.

## 3. Auth & membership

- **Auth:** Supabase Auth (email/password + provider logins as needed). One account per person across all businesses.
- **Onboarding via invite codes** (`user_roles_and_permissions.md` §9): a code is tied to exactly one `business_id` and a type (staff vs client). Redeeming a code creates the membership or client profile. Owner is created by the business-bootstrap flow (no code).
- **Roles:** `owner`, `admin`, `staff`, `client` (rebuild plan; roles doc §2). Hierarchy owner → admin → staff; client is outside the staff hierarchy.
- **Code mechanics** (single-use vs reusable, expiration) are D-013/D-014 (Proposed) — build the `business_invite_codes` table to carry `max_uses`, `uses_count`, and `expires_at` now so the decision is a config change, not a migration.
- **Connecting to a provider (customer-initiated).** Customers never browse a directory. They connect only via a provider-issued **invite code** or **QR code** (a QR is just that code, scannable). **Search-by-business-name is intentionally never offered** (D-026). The picker shows only providers the user is already connected to.
- **PetAppro support / break-glass role (D-024).** A platform-side role for us (or outsourced help/eng) to assist a provider. It deliberately crosses the tenant wall, so: least-privilege, **financial + PII fields redacted by default**, every access **logged, audited, time-boxed, and ideally tenant-consented**. Not MVP-blocking, but the schema assumes it exists (audit table + field redaction) so it isn't retrofitted insecurely. This is the *only* sanctioned exception to "no cross-tenant access," and it must stay narrow.

## 4. Access control & RLS strategy

RLS is the enforcement layer for the permission matrix in `user_roles_and_permissions.md` §10. UI hiding is convenience; the database is authority (product principle 3).

**Core helper (security-definer function):** `current_membership(business_id)` returns the caller's role for a business (or null). RLS policies call it rather than embedding email checks.

**Policy shape per operational table:**
- **Read:** row visible only if the caller has a membership (owner/admin/staff) in `row.business_id`, or — for client-owned rows — is the owning client in that business.
- **Write:** allowed only if the caller's role in `row.business_id` permits the action per the matrix (e.g., pricing edits → owner/admin; staff notes → owner/admin/staff; own pets → owning client).
- **Elevated actions** (ownership transfer, business delete, Stripe connect, admin promotion) are owner-only and additionally guarded in Edge Functions/RPCs, not just RLS (roles doc §12).

**Non-negotiables (D-023 foundation):**
- Every business-specific table has RLS enabled and a `business_id` column.
- No policy relies on a global email or a hardcoded id (`pricing_rates.id = 1`, `ADMIN_EMAIL` — explicitly retired, rebuild plan "What Must Be Rebuilt").
- A dedicated **RLS regression test suite** proves no cross-tenant read/write (Sprint 3 exit; Aug 15 go/no-go).

## 5. Booking & pricing authority

The single shared pricing package is the crown jewel (Sprint 1; never cut).

- **`packages/pricing`** — one source of truth for price computation, consumed by the native app (preview), the server booking path (authority), and any Edge Function. No pricing logic is duplicated across layers (rebuild plan "Pricing Model").
- **Client UI = preview only.** The client sees an estimate; the **server recomputes and is authoritative** on booking create/edit (product principle 3).
- **Stored breakdowns.** Final total + line-item breakdown are persisted on the booking (`booking_price_breakdowns`) so a charge is always auditable and reproducible.
- **Manual overrides** by staff/owner are allowed with an audit trail (D-018, default Yes): store original computed price, override value, actor, timestamp.
- **Server-authoritative booking creation** and **server-side blocked-date enforcement** carry forward from Woof Wetreats (rebuild plan "What to Preserve").
- **Regression tests first** (S1-2/S1-3): the extraction is test-driven; the stale 15-night-cap test is fixed as part of this (from Codex audit).
- **What "single shared" means.** One pricing *engine* (`packages/pricing`) reused everywhere — **not** one universal price. Each provider's own rates live in `business_service_pricing`, tethered by `business_id`. This engine computes what a provider's customer pays the provider; it is **not** our SaaS subscription price (that's Stripe Billing, D-020).
- **Multi-currency (D-025).** Money is stored as integer minor units + a per-business `currency`, so providers in the US / Canada / EU / AU price in their own currency. Tax (GST/VAT) and our subscription currency are later GTM items; the schema won't block them.

## 6. Services & pricing configurability

Do not hardcode boarding/daycare into the foundation (D-022, default: schema supports many services; MVP ships boarding + daycare).

- Services are **rows**, not enum branches: `business_services` defines what a business offers; `business_service_pricing` defines its rates.
- Each service can carry its own duration/date rules, capacity, pricing structure, required fields, cancellation policy, visibility, and deposit requirement (rebuild plan "Services Model").
- MVP implements boarding + daycare only, but the schema must not trap the product there (product principle 6).
- **Providers control what their customers see.** Each provider toggles which services/options are enabled and visible, plus their landing content; customers only see what that provider exposes.
- **North-star (not MVP): a service-builder.** Services-as-rows + JSON rules is deliberately the foundation for a future "service builder" that could adapt the app to other industries (stylists, cleaners) with variances like travel fees, recurring cadence, and add-ons tethered to a service. **We do not build the builder now** — ship PCSP-specific (boarding/daycare), then explore the builder ~60–90 days post-launch. Recurring cadence (e.g. weekly walks) is the variance most likely to surface first; keep `pricing_structure` and an add-ons concept from trapping it.

## 7. Notifications (tenant-aware outbox)

Replaces global Pushover-style alerts (rebuild plan "Notifications"; `docs/specs/platform_notification_and_activity_plan.md`).

1. A business event occurs → write one row to `notifications` (scoped by `business_id`, addressed to a user/role).
2. Fan out to `notification_deliveries` per enabled channel.
3. Deliver via **in-app** (MVP), **native push** (MVP-capable via Expo), and **SMS/email** where enabled.
4. Store delivery status + errors.

**MVP scope (D-008):** in-app notification center is in; **SMS is deferred** to a post-MVP add-on; email is for paper trail (receipts, confirmations, terms records), not urgency. Notifications reach only users with a relationship to the relevant `business_id`.

**SMS positioning (D-008).** When added, SMS is a **paid add-on / top-tier subscription feature** (revenue, tied to D-020 tiers), pulled forward only if we're ahead of schedule. **SMS/MMS media (images) are never persisted on our servers/DB** — handled by the messaging provider (e.g. Twilio) or served as short-TTL signed links only.

## 8. Payments

Payments stay **between the client and the business**; PetAppro is software, not merchant/broker/employer (product brief §7).

- **Two independent money flows — do not conflate:**
  1. **Client → Business** for pet care: **manual tracking is the sole MVP path** (cash/check/Venmo/Zelle/other + staff confirmation) (D-007 **Decided 2026-07-07**, D-015, no deposits). **Stripe Connect is deferred post-MVP** (nice-to-have, not launch-critical — first post-freeze payment add) — when it ships, each business connects its own Stripe account; fees pass to the business; no PetAppro markup.
  2. **Business → Base509** for the SaaS subscription: **Stripe Billing on the web** (`apps/web`), because Apple's rules bar selling that subscription inside the iOS app (D-001, Decided). This is the settled reason the subscription is web-only, not in-app.
- **Manual payment confirmation** defaults to owner/admin (roles doc §12; staff optional, open).

## 9. Storage

- Pet photos and business assets are **tenant-prefixed** (`business_id/...`), replacing Woof Wetreats paths keyed only by auth user + dog id (rebuild plan "What Must Be Rebuilt").
- Private files served via **signed URLs** (preserve from Woof Wetreats).
- Storage RLS mirrors table RLS: access requires a relationship to the owning `business_id`.

## 10. Repo & deploy shape

Monorepo (Sprint 1, S1-1). Matches D-001 and the roadmap's Phase→calendar mapping.

```
apps/
  mobile/      Expo / React Native — client + staff product
  web/         Next.js — marketing site + provider subscription checkout
packages/
  pricing/     single source of truth (server-authoritative)   ← Sprint 1 crown jewel
  booking/     validation + availability rules                 ← S1-4
  data/        generated Supabase types + shared query helpers  ← S1-5
supabase/
  migrations/  tenant-scoped schema + RLS policies
  functions/   Edge Functions (server-authoritative paths)
```

- **CI (S1-6):** typecheck + lint + test on every PR, enforced before the pricing refactor lands.
- **Local-first (product principle 9):** implement and test locally; no production deploy without Danny's approval.
- **Woof Wetreats stays read-only reference** — never mutated into PetAppro; data imported into one initial tenant only after the model is stable (rebuild plan "Migration/Reference Strategy").

## 11. Decisions this architecture depends on

| Decision | Status | Architectural effect |
|---|---|---|
| D-001 platform | **Decided** | Native/Expo product + thin Next.js billing; subscription sold on web, not iOS IAP |
| D-023 delivery | **Decided** | Foundation is gate-driven (tenant boundary, RBAC/RLS, pricing pkg + tests never cut) |
| D-003 client+staff same business | Default No | Enforce at invite; no dual membership one business |
| D-004 client at multiple businesses | Default Yes | Separate client profile per business |
| D-005 pet scope | Default Business-scoped | `pets.business_id`; re-entry at second business |
| D-006 meet-and-greet | Default Configurable | Per-business on/off gate before first booking |
| D-007 payments | Default Manual MVP | Manual tracking; Stripe Connect post-MVP |
| D-008 SMS | Default post-MVP | In-app + push in MVP; SMS deferred |
| D-010 multi-location | Deferred | Single location; no `location_id` in MVP |
| D-013/D-014 invite codes | Proposed | Carry `max_uses`/`expires_at` columns now |
| D-018 price override | Default Yes | Override allowed with audit trail |
| D-022 services | Default multi | Services as rows; ship boarding+daycare |
| D-024 support/break-glass role | **New — Proposed** | Platform-side assist; redacted, audited, time-boxed; schema assumes it |
| D-025 multi-currency | **New — Proposed** | Per-business currency; minor-unit money; tax deferred |
| D-026 connect method | **New — Proposed** | Invite code + QR only; never search-by-name |

## 12. Phase 1 exit criteria (from mvp_roadmap)

- [ ] Every business-specific entity has a defined tenant boundary (`business_id`).
- [ ] Permission checks are defined against memberships, not global emails.
- [ ] Booking, pricing, terms stamping, and notification flows are tenant-aware (written flows / sequence).
- [ ] Known Woof Wetreats anti-patterns explicitly marked "do not copy" (see §4, §7, §9).
- [ ] Architecture review completed (Codex) with no blocking gaps.
- [ ] Any Working Default that changes table design or RLS shape is flagged with its decision ID (§11).

## 13. Open items to resolve before / during build

- **D-011 / landing model** (public landing + invite portal vs invite-only) — affects `apps/web` routes and client acquisition; does not change the tenant model.
- **D-013/D-014 invite code mechanics** — finalize before the invite-code spec (Phase 2); columns pre-provisioned.
- **RLS helper performance** — validate `current_membership()` in policies against realistic row counts before Sprint 3 sign-off.
- **Context-switch transport** — confirm active `business_id` is delivered as a validated JWT claim vs. per-request param before auth build.

## Next steps

1. Codex architecture review of this doc against the never-cut foundation.
2. Pair with `data_model_draft.md` for table-level detail and RLS column keys.
3. Feed §5–§6 into the Sprint 1 `packages/pricing` extraction (already in flight).
