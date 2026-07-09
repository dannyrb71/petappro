# PetAppro Data Model Draft (Phase 1)

First-pass tenant-scoped schema for the shared Supabase (Postgres) database. Extends the core table list in `woof-wetreats-to-petappro-rebuild-plan.md` with columns, relationships, and the tenant/RLS keys. Pairs with `technical_architecture.md`.

> **Status:** Phase 1 draft (2026-07-06). Column-level detail is directional, not a migration — migrations are Phase 5/6. This exists to prove the tenant boundary, permission model, and pricing/notification flows have a coherent schema before build.
>
> **Rules:** every business-specific table has `business_id` and RLS. No global admin email, no hardcoded ids. Working defaults cited by decision ID from `docs/decisions/open_decisions.md`.

---

## 1. Conventions

- **PK:** `id uuid default gen_random_uuid()` on every table.
- **Tenant key:** `business_id uuid references businesses(id)` on every operational table (the security boundary).
- **Audit columns:** `created_at timestamptz default now()`, `updated_at timestamptz`, and where an actor matters `created_by_account_id uuid references base509_accounts(id)`, `updated_by_account_id uuid references base509_accounts(id)`.
- **Soft state:** `status` enums instead of hard deletes where history matters (e.g., pets, bookings).
- **Money:** integer minor units (cents) + `currency`, never floats.
- **RLS:** enabled on all tables below; policies resolve through `current_base509_account_id()` + `current_membership(business_id)` (see architecture §4). Raw `auth.uid()` is used only inside the identity mapping helper.

## 2. Entity map

```
auth.users (Supabase)
    │
    └──< auth_identities >── base509_accounts
                              │
                              ├──< business_memberships >── businesses ──< business_invite_codes
    │                                  │
    │                                  ├──< business_services ──< business_service_pricing
    │                                  ├──< business_availability      (blocked dates)
    │                                  ├──< business_terms_versions
    │                                  ├──< business_assets
    │                                  └──< notifications ──< notification_deliveries
    │
                              └──< clients >── (business_id) ──< pets
             │
             └──< bookings >── booking_pets >── pets
                     │
                     ├── booking_price_breakdowns
                     ├──< payments ──< payment_events
                     └── meet_greets
   staff_notes ── (business_id, client_id / booking_id, author)
```

## 3. Tenant & identity tables

### base509_accounts
Stable product-agnostic account record. `id, primary_email, display_name, created_at, updated_at.`
- This is the durable person/account key for PetAppro app relationships and future Base509 products.
- Do not put PetAppro-specific provider/client fields here.

### auth_identities
Mapping from the current auth provider to the stable account. `id, base509_account_id, provider (supabase|apple|google|future_idp), provider_subject, created_at.`
- For MVP, `provider_subject` maps to Supabase `auth.users.id`.
- RLS helpers use this table to resolve `auth.uid()` to `base509_account_id`.

### businesses
The tenant root. `id, name, slug, owner_account_id, branding (jsonb: logo, colors, hero), landing_content (jsonb), currency (D-025), settings (jsonb: meet_greet_required per D-006, timezone), plan_tier, seat_count, billing_period (monthly|annual), subscription_status, stripe_customer_id (Base509 billing), created_at, updated_at.`
- One implicit location (D-010 Deferred — no `location_id`).
- `currency` sets the provider's booking + display currency (D-025); all money elsewhere is minor units in this currency.
- `plan_tier` / `seat_count` / `billing_period` drive the SaaS subscription (D-020): tier chosen at signup by number of app users (1 user, 2, small business), monthly vs annual, upgradeable with proration.

### business_memberships
Staff/provider-side relationship. `id, business_id, base509_account_id, role (owner|admin|manager|staff), status (active|invited|removed), invited_by_account_id, created_at.`
- Unique `(business_id, base509_account_id)` — an account holds at most one provider-side role per business.
- Client relationship is **not** here — it lives in `clients` (keeps D-003 clean: no dual client+staff on one business).
- **First membership (business creator) = `owner`** — the highest role, includes all admin capability + financials. When the owner adds a second user, onboarding **prompts for role** and shows the permission chart (roles doc §10), with a disclaimer that **`admin` can see business financial data** (D-020 onboarding requirement).

### business_invite_codes
`id, business_id, code (unique), type (staff|client), role_hint, max_uses, uses_count, expires_at, revoked_at, created_by_account_id, created_at.`
- `max_uses` / `expires_at` present now so D-013/D-014 (Proposed) are config, not migration.
- A code is tied to one `business_id` and one type; a staff code can't create a client (roles doc §9).

### clients
Client profile, **scoped per business** (D-004 Yes across businesses via separate rows; D-005 pets per business). `id, business_id, base509_account_id, display_name, emergency_contact (jsonb), vet_info (jsonb), status (active|blocked|ended), ended_at, blocked_reason, blocked_by_account_id, terms_accepted_version, created_at, updated_at.`
- `status = ended` is the relationship lifecycle (a customer leaving this provider): reversible, nothing deleted; the account and other-provider relationships are untouched.
- Unique `(business_id, base509_account_id)` — one client profile per account per business.
- Same `base509_account_id` may appear in many businesses' `clients` rows (D-004) and also in another business's `business_memberships` (D-012).

## 4. Business configuration tables

### business_services
Services as rows, not enum branches (D-022). `id, business_id, service_type (boarding|daycare|... extensible), name, enabled, date_model (overnight|day|slot), capacity_rules (jsonb), required_fields (jsonb), cancellation_policy (jsonb), deposit_required (bool — D-015 default false), visibility, created_at, updated_at.`
- MVP enables boarding + daycare; schema allows walking, drop-in, grooming, training later.

### business_service_pricing
Per-service rates consumed by `packages/pricing`. `id, business_id, business_service_id, pricing_structure (jsonb: base rate, per-night/per-day, per-pet, add-ons, caps), effective_from, effective_to, created_at.`
- No global `pricing_rates.id = 1` (retired). Pricing is per business, per service.

### business_availability
Blocked dates / availability, server-enforced (replaces global blocked dates). `id, business_id, business_service_id (nullable = whole business), date, kind (blocked|limited), capacity_override, note, created_by, created_at.`

### business_terms_versions
Tenant-aware terms (replaces static/global legal pages). `id, business_id, version, body (structured template + editable sections per D-009), published_at, published_by, is_current.`
- Stamped onto bookings and meet-greets by version.

### business_assets
`id, business_id, kind (logo|hero|pet_photo_ref|doc), storage_path (business_id-prefixed), signed_url_ttl, created_by, created_at.`

## 5. Operational tables

### pets
Business-scoped (D-005). `id, business_id, client_id, name, species, breed, dob, care_notes (client-visible), photo_path (business_id-prefixed), status (active|removed — soft remove), created_at, updated_at.`

### bookings
Server-authoritative (architecture §5). `id, business_id, client_id, business_service_id, start_date, end_date, status (requested|confirmed|cancelled|completed), created_by (client self-serve or staff), terms_version_stamped, cancellation_snapshot (jsonb), created_at, updated_at.`
- Blocked-date and meet-greet gates enforced server-side before `confirmed`.

### booking_pets
Join (a booking covers 1+ pets in a household). `id, business_id, booking_id, pet_id.`

### booking_price_breakdowns
Stored authoritative price (never recomputed for display). `id, business_id, booking_id, computed_total, currency, line_items (jsonb), pricing_version, override_total (nullable), override_reason, overridden_by, overridden_at, created_at.`
- Manual override with audit (D-018 Yes): keep both computed and override values + actor + time.

### meet_greets
Gate before first booking when enabled (D-006). `id, business_id, client_id, status (requested|scheduled|completed|waived), scheduled_at, completed_by, terms_version_stamped, created_at, updated_at.`

### staff_notes
Staff-only, never client-visible. `id, business_id, client_id (or booking_id), author_account_id, body, created_at.`
- RLS: readable/writable by owner/admin/staff of the business only (roles matrix).

## 6. Notification & payment tables

### notifications
Tenant-aware outbox (replaces global Pushover). `id, business_id, event_type, audience (base509_account_id or role), payload (jsonb), created_at.`

### notification_deliveries
Per-channel fan-out. `id, business_id, notification_id, channel (in_app|push|sms|email), status (pending|sent|failed), error, delivered_at.`
- MVP channels: in_app + push. SMS deferred (D-008). Email = paper trail only.

### payments
Client↔business money, **manual in MVP** (D-007). `id, business_id, booking_id, client_id, method (cash|check|venmo|zelle|other|stripe_connect), amount, currency, status (unpaid|recorded|confirmed), confirmed_by, reference_note, created_at, updated_at.`
- Stripe Connect fields (`connect_account_id`, `payment_intent_id`) present but unused until post-MVP.
- **Not** the SaaS subscription — that is Stripe Billing on `businesses.stripe_customer_id` (web, D-001).

### payment_events
Audit trail for payment state changes. `id, business_id, payment_id, event_type, actor_account_id, data (jsonb), created_at.`

### platform_access_log (D-024)
Break-glass audit for PetAppro-side support/eng access across the tenant wall. `id, business_id, platform_account_id, reason, granted_by_account_id, tenant_consented (bool), scope (jsonb: which surfaces), fields_redacted (bool default true), started_at, expires_at, ended_at.`
- Financial + PII fields redacted by default; access is time-boxed and fully logged. This is the only sanctioned cross-tenant path.

## 7. RLS-relevant keys (summary)

Every table above: **RLS on**, filtered by `business_id` via `current_membership()`, which resolves through `current_base509_account_id()`. Client-owned rows (`clients`, `pets`, own `bookings`, own `payments`) additionally allow the owning client. Elevated writes (pricing, terms, invites, ownership, Stripe) restricted to owner/admin per the matrix; ownership/teardown owner-only and double-guarded in Edge Functions.

## 8. Decisions reflected in this schema

| Decision | Default | Schema effect |
|---|---|---|
| D-003 client+staff same business | No | `clients` vs `business_memberships` separate; unique per account per business |
| D-004 client at many businesses | Yes | Row per `(business_id, base509_account_id)` in `clients` |
| D-005 pet scope | Business-scoped | `pets.business_id` + `client_id` |
| D-006 meet-and-greet | Configurable | `businesses.settings.meet_greet_required`; `meet_greets` gate |
| D-007 payments | Manual MVP | `payments.method` incl. manual; Connect fields dormant |
| D-008 SMS | Post-MVP | `notification_deliveries.channel` incl. sms, unused at MVP |
| D-009 terms | Template + editable | `business_terms_versions.body` structured |
| D-010 multi-location | Deferred | No `location_id` |
| D-013/D-014 invite codes | Proposed | `max_uses`, `expires_at`, `revoked_at` pre-provisioned |
| D-015 deposits | No | `deposit_required` default false |
| D-018 price override | Yes + audit | Override fields on `booking_price_breakdowns` |
| D-022 services | Multi | `business_services` rows; boarding+daycare enabled |
| D-020 subscription | Proposed | `businesses.plan_tier/seat_count/billing_period`; first user=owner, add-user role prompt |
| D-024 support role | Proposed | `platform_access_log`; redacted, time-boxed, audited |
| D-025 multi-currency | Proposed | `businesses.currency`; minor-unit money throughout |
| D-026 connect method | Proposed | Invite code + QR via `business_invite_codes`; no name search |

## 9. Open items before migration (Phase 5)

- Export Woof Wetreats migrations/RPCs/policies to cross-check field coverage (rebuild plan next steps #1).
- Confirm `capacity_rules` / `pricing_structure` jsonb shapes with `packages/pricing` and `packages/booking` (Sprint 1 output feeds this).
- Decide landing model (D-011) → affects whether `businesses.landing_content` is public-rendered.
- Finalize invite-code mechanics (D-013/D-014) → constraints on `business_invite_codes`.
- RLS policy performance pass on `current_membership()` before Sprint 3 sign-off.

## Next steps

1. Codex review alongside `technical_architecture.md`.
2. Lock jsonb shapes (`pricing_structure`, `capacity_rules`, `line_items`) as Sprint 1 packages stabilize.
3. Carry into Phase 4 specs — each spec cites the tables it touches and their RLS impact (no "TBD" on `business_id`).
