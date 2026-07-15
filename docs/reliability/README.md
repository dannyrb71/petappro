# Reliability infrastructure — PetAppro (D-050)

Single source of truth for crash monitoring, test coverage, CI gates, and release safety.
The "best-in-class UX" differentiator (competitive-analysis §4) requires this floor, not just
good design. Native ≠ automatically stable: Rover and Precise are native and still crash.

## What's wired vs stubbed

| Piece | Status | Becomes active when |
|---|---|---|
| **CI: lint + tsc** | ✅ **Wired** — runs on every PR to `main` | Already running (no app needed) |
| **CI: pricing unit + golden** | ✅ **Wired** — 39 tests, blocks merge on failure | Already running |
| **CI: E2E (Maestro)** | 🟡 **Stubbed** — flows written, job commented out in ci.yml | `apps/mobile` scaffolded + testIDs added |
| **Sentry crash monitoring** | 🟡 **Stubbed** — plugin config + init code documented | Danny creates Sentry project + 4 secrets |
| **EAS Build workflow** | 🟡 **Stubbed** — workflow wired, `apps/mobile` missing | `apps/mobile` scaffolded + EAS secrets set |
| **EAS Update (JS hotfix)** | 🟡 **Stubbed** — `eas.json` + docs written | `apps/mobile` scaffolded + Expo project ID set |
| **Phased rollout (beta ring)** | 🟡 **Stubbed** — process documented | EAS Submit secrets + Apple/Google credentials |

## Files created

```
.github/workflows/ci.yml              ← CI gate: lint + tsc + pricing tests (LIVE)
.github/workflows/eas-build.yml       ← EAS Build + Sentry upload + submit (stubbed)
apps/mobile/eas.json                  ← EAS build/submit/update config (stubbed)
e2e/flows/booking-create.yaml         ← Critical path: booking create → server total
e2e/flows/checkin-checkout-reportcard.yaml  ← Critical path: check-in/out + report card
e2e/README.md                         ← How to run Maestro locally + testID conventions
docs/reliability/sentry.md            ← Sentry setup guide + init code
docs/reliability/eas-update.md        ← EAS Update hotfix + phased rollout process
docs/reliability/README.md            ← This file
```

## Secrets Danny must create

### GitHub repo secrets (Settings → Secrets and variables → Actions)

| Secret | Purpose | Where to get it |
|---|---|---|
| `EAS_TOKEN` | EAS Build + Submit + Update | expo.dev → Account → Access Tokens |
| `SENTRY_AUTH_TOKEN` | Source map upload at build time | sentry.io → Settings → Auth Tokens |
| `SENTRY_ORG` | Sentry org slug | sentry.io org settings (e.g. `base509`) |
| `SENTRY_PROJECT` | Sentry project slug | sentry.io project settings (e.g. `petappro-mobile`) |

### App environment variable

| Variable | Where to set |
|---|---|
| `SENTRY_DSN` | sentry.io → Project → Settings → Client Keys; add to `apps/mobile/.env` and EAS build env |

### EAS Submit credentials (when ready to submit to stores)

- **iOS:** App Store Connect API key (Danny's Apple Developer account)
- **Android:** Google Play service account JSON (Danny's Google Play Console)
- Update placeholder values in `apps/mobile/eas.json` submit section

## Test pyramid

```
Layer                 Tool              Count     Status
──────────────────────────────────────────────────────
Unit + golden         Vitest            39 tests  ✅ Green, CI-gated
E2E — critical paths  Maestro           2 flows   🟡 Written, not yet runnable
Crash monitoring      Sentry            —         🟡 Config written, awaiting DSN
```

The 39 pricing tests are the most critical: they prove the engine (the billing backbone)
is correct for every pricing model, holiday/extended rate scenario, surcharge, tax,
discount, and overage. They run in <200ms. Never skip them.

## Activation checklist (in order)

- [ ] Danny creates sentry.io account + project, adds 4 GitHub secrets + SENTRY_DSN to env
- [ ] `apps/mobile` scaffolded (`npx create-expo-app apps/mobile --template`)
- [ ] `@sentry/react-native` installed, plugin added to `app.json`, init added to entry point
- [ ] `testID` props added to booking-create and check-in/out screens
- [ ] Seed data added to `supabase/seed.ts`
- [ ] E2E job in ci.yml uncommented
- [ ] Danny creates expo.dev project, sets `EAS_TOKEN` + project ID in `app.json`
- [ ] EAS Build tested locally: `eas build --profile preview --platform ios`
- [ ] Apple + Google credentials added to EAS; `eas.json` PLACEHOLDERs updated
- [ ] Phase 1 internal install validated (Danny + Marco's devices)
- [ ] Phase 2 beta ring: TestFlight external group + Play Internal (5–6 PCSPs)
- [ ] Phase 3 staged production submit
