# E2E tests — PetAppro (D-050)

Critical-path flows using [Maestro](https://maestro.mobile.dev/).

## Status

**STUB — flows written, not yet runnable.** Becomes runnable when:
1. `apps/mobile` is scaffolded and builds on simulator
2. `testID` / `accessibilityLabel` props are added to app components (see naming below)
3. Test tenant seed data is set up (see below)

## Flows

| File | Critical path | What it proves |
|---|---|---|
| `flows/booking-create.yaml` | Booking create → server-priced total | Server (not client) owns the total; pricing engine round-trip works end-to-end |
| `flows/checkin-checkout-reportcard.yaml` | Check-in → check-out → report card | Booking lifecycle state machine; report card reaches client |

## Running locally

```bash
# Install Maestro CLI (macOS / Linux)
curl -Ls "https://get.maestro.mobile.dev" | bash

# Build + launch the iOS simulator (from apps/mobile)
npx expo run:ios

# Run a single flow
~/.maestro/bin/maestro test e2e/flows/booking-create.yaml

# Run all flows
~/.maestro/bin/maestro test e2e/flows/
```

## testID naming convention

Follow `design-system/docs/naming-conventions.md`. For E2E:

- Screens: `screen-<name>` — e.g. `screen-booking-create`
- Buttons: `btn-<action>` — e.g. `btn-confirm-booking`
- Inputs: `input-<field>` — e.g. `input-start-date`
- Tabs: `tab-<name>` — e.g. `tab-schedule`
- Modals: `modal-<name>` — e.g. `modal-confirm-checkin`

Add `testID="..."` (React Native) or `accessibilityLabel="..."` to interactive
components. Prefer `testID` — it's stripped from production builds by the Metro
bundler when `__DEV__ === false`.

## Test tenant seed

When the Supabase schema exists, add a seed script at `supabase/seed.ts` with:
- Provider business: `id = "biz-test-1"`, boarding service, rate = $7500 (75.00)
- Client: `id = "client-test-1"`, 1 dog "Fido"
- Test credentials: `provider@test.petappro.dev` / `client@test.petappro.dev`

Do NOT commit real credentials. Use Supabase local dev (`supabase start`) for E2E.

## CI integration

The CI workflow (`.github/workflows/ci.yml`) has an E2E job stubbed out and commented.
Uncomment once the app builds on the macOS runner. macOS runner is required for iOS sim.
Android flows can run on ubuntu with an emulator — add a separate job when needed.
