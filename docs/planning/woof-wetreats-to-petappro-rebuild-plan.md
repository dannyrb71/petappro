# Woof Wetreats to PetAppro Rebuild Plan

> **Canonical for:** technical migration strategy and the tenant-aware data model. For **product definition/scope** see `product_brief.md`; for **business/framework/GTM/launch** see `PetAppro-Strategy-and-Business-Plan.md`; for the **dated build schedule** see `docs/roadmap/PetAppro-Roadmap-and-Project-Plan.md`. The generalized services/capacity engine and per-tenant pricing tables in the strategy/roadmap docs extend the data model started here.

## Purpose

Use the existing Woof Wetreats web app as the behavioral reference for PetAppro, but rebuild the product as a configurable multi-tenant SaaS platform.

Woof Wetreats should be treated as:

- A proof of workflow
- A source for proven booking/staff/client patterns
- A reference for what the first pet-care tenant should feel like

It should not be copied as-is into the white-label product because the current architecture assumes one business, one brand, one pricing model, one staff group, and one global operating context.

## Direction

Build PetAppro as one shared platform with tenant-scoped data and configurable business setup.

Recommended product shape:

- Web admin for business setup and management
- Shared client/staff app experience driven by invite codes
- One shared database with strict `business_id` separation
- Business-specific services, pricing, availability, terms, branding, staff, and notification settings
- Stripe Connect as optional online payment add-on
- SMS/in-app messaging as optional paid add-ons

## What to Preserve From Woof Wetreats

These are strong patterns worth carrying forward:

- Server-authoritative booking creation
- Server-side price recomputation
- Live client-side pricing preview
- Meet-and-greet gate before first booking
- Blocked-date calendar with server-side enforcement
- Household-centered staff dashboard
- Staff daily schedule grouped by activity
- Staff notes separated from client-visible notes
- Care notes and pet photos as first-class information
- Terms version stamping at booking/request time
- Soft-removal of pets instead of deletion
- Staff-created bookings and staff reservation edits
- Editable public landing content and hero image
- Private pet photo storage with signed URLs

## What Must Be Rebuilt, Not Copied

The following pieces are too single-business-specific and should be rethought:

- Global admin/staff checks
- Single `ADMIN_EMAIL` authorization
- Global pricing row such as `pricing_rates.id = 1`
- Global blocked dates
- Global landing page settings
- Global Pushover notification settings
- Client status that assumes one business context
- Storage paths keyed only by auth user and dog ID
- RPCs that return all staff/household/schedule data without tenant context
- Static/global legal pages and terms versions

## Recommended Core Data Model

Use one shared Supabase database with tenant-scoped rows.

Core tables:

- `businesses`
- `business_memberships`
- `business_invite_codes`
- `business_services`
- `business_service_pricing`
- `business_availability`
- `business_terms_versions`
- `clients`
- `pets`
- `bookings`
- `booking_pets`
- `booking_price_breakdowns`
- `meet_greets`
- `staff_notes`
- `notifications`
- `notification_deliveries`
- `payments`
- `payment_events`
- `business_assets`

Most operational tables should include:

- `business_id`
- `created_at`
- `updated_at`
- Where applicable: `created_by`, `updated_by`, `status`

## Tenant and Access Model

Every user should authenticate once, then gain access to one or more businesses through memberships or client relationships.

Recommended roles:

- `owner`
- `admin`
- `staff`
- `client`

Invite codes should determine the initial relationship:

- Client invite code creates or links a client profile for that business.
- Staff invite code creates or links a staff membership for that business.
- Owner/admin setup creates the business and first owner membership.

Do not assume an email address is globally admin. All permissions should be checked against the current `business_id`.

## Client Experience

The client experience should be business-specific after invite code entry.

Client onboarding should include:

- Invite code
- Account creation/login
- Business-specific welcome/branding
- Client profile
- Emergency contact
- Vet info
- Pet setup
- Terms/policy acceptance

Client dashboard should include:

- Active/upcoming bookings
- Booking CTA based on business-enabled services
- Pet profiles and photos
- Care notes
- Meet-and-greet status when enabled by business rules
- Activity history date picker for completed/cancelled bookings
- Payment status and payment links where enabled
- In-app notifications

## Staff/Admin Experience

Keep the household-centered staff model, but make every view tenant-scoped.

Staff/admin dashboard should include:

- Daily schedule
- Household/client directory
- Booking management
- Pet/care notes
- Staff-only notes
- Meet-and-greet management
- Blocked dates/availability
- Service/pricing setup
- Business branding/content
- Staff invite codes
- Client invite codes
- Notification settings
- Payment settings

## Services Model

Do not hardcode only `boarding` and `daycare` in the PetAppro foundation.

Start with pet-care services, but model services as configurable:

- Boarding
- Daycare
- Dog walking
- Drop-in visits
- In-home sitting
- Grooming
- Training

Each service should define its own:

- Duration/date rules
- Capacity rules
- Pricing structure
- Required fields
- Cancellation policy
- Staff/client visibility
- Payment/deposit requirement

MVP can implement only boarding and daycare first, but the schema should not trap the product there.

## Pricing Model

Keep the pricing-engine idea, but centralize it.

Avoid duplicating pricing logic across:

- Client UI
- Server booking endpoint
- Edge Functions
- Staff edit flows

Recommended approach:

- One shared pricing package
- Server remains the source of truth
- Client gets a preview only
- Store final price and breakdown on booking
- Support manual staff overrides with audit trail

## Notifications

Replace global Pushover-style alerts with a tenant-aware notification outbox.

Recommended flow:

1. Business event occurs.
2. Write to `notifications`.
3. Create `notification_deliveries` for enabled channels.
4. Deliver through in-app, push, SMS, or email depending on settings.
5. Store delivery status and errors.

Email should be used for paper trail only. Urgent alerts should use native push and/or SMS.

## Payments

Payments should remain between the client and the subscribed pet care business.

PetAppro should provide payment software, not act as employer, broker, service provider, or merchant for the pet care work.

Recommended approach:

- Stripe Connect optional add-on
- Business connects its own Stripe account
- Stripe collects business, identity, tax, and bank info
- Stripe fees pass directly to the business account
- PetAppro does not add a processing markup at launch
- PetAppro charges SaaS subscription/add-on fees separately

Manual payment tracking should support:

- Cash
- Check
- Venmo
- Zelle
- Other external payment

Manual payments should require staff/admin confirmation and optional reference notes.

## Legal and Terms

Woof Wetreats has terms stamping already. Keep that concept, but make it tenant-aware.

PetAppro should support:

- Platform terms for businesses using PetAppro
- Business-specific client terms/policies
- Per-booking terms version stamping
- Meet-and-greet terms version stamping if needed
- Cancellation/no-show policy snapshots

The app should make clear that each business is responsible for its services, staff, clients, taxes, insurance, and local compliance.

## Migration/Reference Strategy

Do not directly mutate Woof Wetreats into PetAppro.

Recommended path:

1. Keep Woof Wetreats as reference/prototype.
2. Create PetAppro as a new architecture.
3. Rebuild core flows with tenant context from day one.
4. Import Woof Wetreats-like data into one initial tenant only after the model is stable.
5. Use the current app to compare behavior and UI coverage.

## October MVP Scope

A realistic October MVP should be disciplined.

Include:

- Business setup
- Invite-code onboarding
- Client onboarding
- Pet profiles
- Boarding/daycare bookings
- Staff dashboard
- Daily schedule
- Pricing and blocked dates
- Activity history date picker
- In-app notification center
- SMS alert add-on or owner/staff SMS alerts
- Manual payment tracking
- Stripe Connect setup if feasible

Defer:

- Full in-app messaging
- SMS conversation bridge
- Multiple non-pet verticals
- Custom app-store builds per business
- Complex staff permissions
- Multi-location support
- Advanced service types beyond first MVP
- Deep analytics/reporting

## Open Decisions

- Should PetAppro launch web-first, React Native/Expo-first, or web admin plus native client/staff app?
- Can a single user be a client of one business and staff of another?
- Should pet profiles be shared across businesses or scoped per business?
- Is meet-and-greet required for all businesses or configurable by business/service?
- Should services support deposits at MVP or only full/manual payment status?
- Will each business have a public booking page, a private invite-only client portal, or both?
- Should terms/policies be fully editable, template-based, or uploaded as custom text?
- What is the first paid plan structure and which add-ons are launch-ready?

## Immediate Next Steps

1. Ask Claude/Codex to export visible Supabase migrations, RPC definitions, triggers, and policies from Woof Wetreats if available.
2. Create a first-pass PetAppro schema with `business_id` tenant scoping.
3. Decide web vs native launch architecture.
4. Define MVP service types and booking rules.
5. Create a business setup flow spec.
6. Create invite-code onboarding spec.
7. Create notification and payment implementation specs.
8. Turn this plan into implementation phases.

