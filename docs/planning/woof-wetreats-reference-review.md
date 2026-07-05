# Woof Wetreats Reference App Review

Reference reviewed from `reference/woof-wetreats-reference` as a read-only source. This document summarizes visible behavior and implementation patterns for rebuilding the app as a multi-tenant PetAppro product.

## 1. Tech Stack and Major Dependencies

- **Framework:** Next.js 14 App Router in `web/`, React 18, TypeScript.
- **Auth/data/backend:** Supabase Auth, Supabase Postgres, Supabase Storage, Supabase RPCs, and Supabase Edge Functions.
- **Supabase clients:** `@supabase/ssr` for browser/server session-aware clients and `@supabase/supabase-js` for direct client usage and Edge Functions.
- **Image handling:** `heic2any` plus local image utilities for dog-photo processing before upload.
- **Deployment:** `netlify.toml` is present, suggesting Netlify hosting for the web app.
- **Pricing module:** A dependency-free TypeScript pricing engine exists both as a standalone `pricing/` package and duplicated in `web/lib/pricing-engine.ts`; `update-reservation` also inlines a copy for Edge Function execution.
- **Notifications:** Pushover is used in at least the meet-and-greet request Edge Function. Reservation notifications appear to be triggered by database triggers, but trigger definitions are not checked into the visible files.

## 2. App Structure and Main Routes/Pages

- `web/app/page.tsx`: Public landing page with editable hero image and copy from Supabase settings, login-aware CTAs, and links to house rules/terms.
- `web/app/auth/page.tsx`: Email/password sign in, account creation, password reset, and Google OAuth. Facebook is typed but not rendered in the visible UI.
- `web/app/auth/callback/route.ts`: Exchanges OAuth code and routes users to staff dashboard, onboarding, blocked page, or client dashboard.
- `web/app/onboarding/page.tsx`: Four-step client onboarding for profile, emergency contact, vet info, and optional dog setup/photos.
- `web/app/dashboard/page.tsx`: Client dashboard for profile editing, dog management, meet-and-greet status/request, reservations, cancellation, and booking entry.
- `web/app/booking/page.tsx`: Client new-reservation page guarded by auth and complete client status.
- `web/app/booking/confirmation/page.tsx`: Confirmation/details page for a newly created reservation.
- `web/app/staff/page.tsx`: Staff household dashboard using `get_staff_households`.
- `web/app/staff/schedule/page.tsx`: Staff daily schedule using `get_daily_schedule`, with activity groups and household detail modal.
- `web/app/staff/settings/page.tsx`: Staff settings tabs for availability, pricing, staff, and landing page content.
- `web/app/api/booking/create/route.ts`: Server-side booking creation endpoint for client self-service reservations.
- `web/app/api/profile/update/route.ts`: Server-side profile update endpoint for client-editable profile fields.
- `supabase/functions/*`: Edge Functions for inviting staff, requesting meet-and-greet, toggling client blocked status, and updating reservations.

## 3. Current Booking Flows

- **Client eligibility:** A client must be authenticated, non-staff, unblocked, profile-complete, and have `meet_greet_status = 'completed'` before booking.
- **Service types:** Booking supports `boarding` and `daycare`.
- **Dates/times:** Boarding collects drop-off and pick-up dates/times. Daycare collects one date with drop-off and pick-up times.
- **Dog selection:** Active dogs are loaded from the client-owned `dogs` table. One dog is preselected when only one active dog exists.
- **Availability:** `blocked_dates` are loaded into the date picker. The client form also detects blocked dates inside a boarding range, and the server rechecks blocked dates before insert.
- **Pricing preview:** Client-side live pricing uses `get_pricing_rates` and `calculatePrice`.
- **Server authority:** `/api/booking/create` recomputes price server-side, verifies dogs through RLS, checks blocked status and blocked dates, stamps terms acceptance, inserts `reservations`, then inserts `reservation_dogs`.
- **Terms:** Booking creation stores `terms_accepted_at` and `terms_version`; meet-and-greet request stores separate meet-and-greet terms acceptance fields.
- **Status:** New reservations are created as `upcoming`. Cancellation updates reservation status to `cancelled`.
- **Limits:** Client self-service boarding is capped at 14 nights. Staff repricing can bypass this cap.

## 4. Admin/Staff Flows

- **Staff authorization:** Most staff pages use `is_admin` RPC. Edge Functions often authorize by checking `staff_members`; `toggle-client-blocked` still uses a single `ADMIN_EMAIL` environment variable, which is a single-business/single-admin assumption.
- **Household dashboard:** Staff can view household cards, sort/filter by date/name/status, and open household details.
- **Household detail:** Staff can view client details, care notes, dogs/photos, reservations, staff notes, blocked status, and meet-and-greet status.
- **Meet-and-greet management:** Staff can schedule via `schedule_meet_greet`, complete via `complete_meet_greet`, or directly toggle a client between `needed` and `completed`.
- **Reservation management:** Staff can cancel reservations, edit reservation dates/payment through `update-reservation`, and create reservations from the household detail UI.
- **Schedule:** Staff daily schedule shows arrivals, departures, daycare, meet-and-greets, and in-progress stays without activity that day; rows open the household detail modal.
- **Availability:** Staff can block/unblock dates and set optional staff-only reasons.
- **Pricing:** Staff can edit a single pricing table row, preview Venmo rates, adjust all cash rates in bulk, and save future-facing pricing.
- **Staff management:** Staff can add/invite staff members and remove staff, with a guard preventing removal of the final staff member.
- **Landing page management:** Staff can upload the public hero image and edit landing page copy via `app_settings` and `site-assets`.

## 5. Client-Facing Flows

- **Public visitor:** Landing page, house rules, terms, sign up, log in.
- **Authentication:** Email/password signup and login, Google OAuth, forgot/reset password.
- **Onboarding:** Required profile, emergency contact, and vet data; optional dog creation with up to three dogs during onboarding.
- **Dashboard:** Client profile view/edit, standing care notes, dog cards, dog photo upload, dog edit/remove by setting `active = false`, meet-and-greet status, active/past reservations, and new booking CTA.
- **Meet-and-greet request:** Client accepts terms and requests a meet-and-greet if status is `needed`; request updates client status to `requested` and notifies staff.
- **Booking:** Completed clients can submit boarding/daycare reservations with live price estimates and care notes.
- **Reservation history:** Dashboard separates active and past reservations and allows cancellation.
- **Blocked client:** Blocked users are routed to `/blocked`.

## 6. Supabase/Database Usage Visible in the Code

Visible tables/views/storage/RPCs include:

- **Tables/views:** `clients`, `clients_client_view`, `dogs`, `reservations`, `reservation_dogs`, `blocked_dates`, `pricing_rates`, `meet_greets`, `staff_members`, `staff_notes`, `app_settings`.
- **Storage buckets:** `dog-photos` for dog images and `site-assets` for landing page hero assets.
- **RPCs:** `get_client_auth_status`, `is_admin`, `get_pricing_rates`, `get_staff_households`, `get_client_detail`, `schedule_meet_greet`, `complete_meet_greet`, `update_reservation_with_log`, `get_daily_schedule`, `get_landing_hero`, `get_landing_copy`.
- **Edge Functions:** `invite-staff`, `request-meet-greet`, `toggle-client-blocked`, `update-reservation`.
- **Referenced but missing from visible functions:** The staff new-reservation form calls `staff-create-reservation`, but no matching function file appears under `supabase/functions`.
- **Security model:** Client flows rely heavily on RLS and owner-scoped views. Staff flows use RPCs and service-role Edge Functions. Some comments reference DB triggers for protected fields, reservation notifications, cancellation guards, and reservation status logic, but migrations/DDL are not visible in this reference checkout.

## 7. Features Worth Preserving for PetAppro

- Server-authoritative booking creation and pricing recomputation.
- Live pricing preview with current database rates.
- Clear separation between self-service client booking and staff booking/edit powers.
- Meet-and-greet gate before first booking.
- Blocked-date calendar plus server-side blocked-date enforcement.
- Staff daily schedule grouped by operational activity.
- Household-centered staff workflow with care notes and dog photos prominent.
- Staff notes separate from client-visible care notes.
- Terms version stamping at booking/request time.
- Soft-removal of dogs via `active = false`.
- Staff-managed pricing with future-booking semantics.
- Editable public landing content and hero image.
- Batch signed URLs for private dog photos.

## 8. Single-Business Assumptions That Need to Become Multi-Tenant

- A single global business is assumed everywhere; there is no visible `business_id`, tenant resolver, or business context.
- `pricing_rates` is loaded by `id = 1`, making pricing global.
- `blocked_dates` are global and affect every booking.
- `staff_members` is global and has no role/business scope.
- `is_admin` appears global rather than business-scoped.
- Landing page settings and hero image are global in `app_settings` and `site-assets`.
- Pushover credentials are global environment variables.
- `toggle-client-blocked` authorizes against one `ADMIN_EMAIL`.
- `clients` appear to belong to one business; auth user routing assumes one client status.
- Dog photo paths are keyed by auth UID and dog ID, not business.
- Public routes are a single brand/site rather than subdomain/path/business-specific storefronts.
- RPCs such as `get_staff_households`, `get_daily_schedule`, and `get_pricing_rates` appear to return global data.

## 9. Tables/Data That Will Need `business_id` or `tenant_id`

Likely required tenant-scoped records:

- `clients`
- `dogs`
- `reservations`
- `reservation_dogs` either directly or by joining through tenant-scoped reservations/dogs; direct `business_id` can simplify RLS and analytics.
- `blocked_dates`
- `pricing_rates`
- `meet_greets`
- `staff_members` or a replacement `business_memberships`
- `staff_notes`
- `app_settings`
- Uploaded storage objects in `dog-photos` and `site-assets`, via tenant-prefixed paths and/or metadata.
- Reservation update/audit logs behind `update_reservation_with_log`.
- Notification records/outbox tables if they exist behind DB triggers.
- Terms/house-rules versions if terms can vary by business.

Suggested new or expanded tables:

- `businesses`: canonical tenant record, public slug/domain, brand settings, timezone, contact info, notification settings.
- `business_memberships`: user/business/role relationship for owners, admins, staff, possibly read-only staff later.
- `business_services`: enabled services and service-specific rules.
- `business_terms_versions`: per-business legal copy/version snapshots.

## 10. Recommended Rebuild Roadmap for the Multi-Tenant PetAppro Version

1. **Tenant foundation:** Add `businesses`, tenant resolution by subdomain/path/custom domain, business context helpers, and tenant-aware Supabase client patterns.
2. **Auth and membership model:** Replace global staff/admin checks with business memberships and roles. Decide whether a single auth user can be staff/client for multiple businesses.
3. **Schema and RLS:** Add `business_id` to tenant-scoped tables, backfill policies, and enforce all reads/writes through business-aware RLS.
4. **Core client data:** Rebuild clients, dogs, photos, onboarding, and profile editing with tenant scope first.
5. **Pricing and availability:** Make pricing rates and blocked dates business-specific. Preserve the pricing engine but inject tenant-selected rates and business timezone.
6. **Booking API:** Rebuild `/api/booking/create` around tenant context, server-side eligibility, blocked-date checks, terms stamping, dog ownership, and server pricing.
7. **Meet-and-greet workflow:** Port request/schedule/complete flows with business-scoped notifications and terms.
8. **Staff operations:** Rebuild household dashboard, household detail, reservation edit/cancel/create, staff notes, and daily schedule on tenant-scoped RPCs or server APIs.
9. **Business settings:** Add business-scoped landing content, hero assets, pricing, availability, staff invitations, notification settings, and legal copy.
10. **Notifications/audit:** Replace implicit/global triggers with a tenant-aware notification/audit outbox, including reservation creation, updates, cancellations, and meet-and-greet requests.
11. **Migration/import path:** Create an importer from the single-business Woof Wetreats data model into one PetAppro business tenant.
12. **Hardening:** Add tests for tenant isolation, RLS policy coverage, booking/pricing edge cases, staff authorization, and cross-business access denial.

## 11. Risks, Unknowns, and Questions

- Database migrations/DDL are not visible, so RLS policies, triggers, views, and RPC bodies need separate review.
- The UI references `staff-create-reservation`, but the function is not present in `supabase/functions`; confirm whether it exists only in production.
- Pricing logic is duplicated in multiple places. PetAppro should centralize this to reduce drift, especially if businesses get configurable rules.
- `toggle-client-blocked` uses `ADMIN_EMAIL` while other staff flows use `staff_members`; this should be normalized before multi-tenant launch.
- Auth routing currently assumes one business context and one client status. Multi-tenant users may need a business picker or context-aware login destination.
- Business timezones are not visible. Date comparisons use local/browser/server dates, which could become risky across tenants.
- Notification behavior is partly hidden in database triggers and global Pushover environment variables.
- Staff roles are all-or-nothing. PetAppro may need owner/admin/staff roles and possibly location/service-specific permissions.
- Current model appears single-location. If PetAppro will support multiple locations per business, `location_id` may be needed in addition to `business_id`.
- Legal copy and terms are global static pages plus version constants; multi-tenant legal configuration needs a clear product decision.
- Storage access and paths need tenant-aware conventions to avoid accidental cross-tenant leakage.
- Need product decisions on whether clients are unique globally by auth account, unique per business, or can share pets/reservations across businesses.
