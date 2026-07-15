# EAS Update — JS hotfix + phased rollout (D-050)

EAS Update pushes a new JS bundle OTA to devices without a full App Store / Play Store
review cycle. Use for JS-only fixes (pricing logic, UI copy, non-native bug fixes).
Requires a full store binary update for: new native modules, permission changes,
major native SDK upgrades.

## Channels

| Channel | Who gets it | When to use |
|---|---|---|
| `development` | Simulator / dev builds only | Local iteration |
| `preview` | Internal test devices (Danny + Marco + team) | Pre-release validation |
| `production` | All production installs | Hotfixes + routine JS releases |

## Phased rollout strategy (D-050 beta ring → staged prod)

```
Phase 1 — internal (own business)
  EAS Build → preview profile → install on Danny + Marco's devices
  Validate: booking create, check-in/out, report card, pricing totals

Phase 2 — beta ring (5–6 PCSPs, TestFlight + Play Internal)
  EAS Submit → ios: TestFlight External (invite-only group)
               android: Play Internal track
  Validate: real provider feedback, crash rate, payment flow

Phase 3 — staged production
  EAS Submit → ios: App Store (phased release — 10% day 1 → 50% → 100% over 7 days)
               android: Play Store (staged rollout %)
  Monitor: Sentry crash rate, pricing error alerts

Phase 4 — hotfix path (JS only, skips review)
  eas update --branch production --message "fix: ..."
  Rolls out instantly to production channel devices
  Use only for verified-safe JS fixes; document in STATUS.md
```

## Commands

```bash
# Push a hotfix to production channel (JS only — no native changes)
cd apps/mobile
eas update --branch production --message "fix(pricing): ..."

# Roll out to preview/beta ring first
eas update --branch preview --message "chore: pre-release validation"

# Check active updates on a channel
eas update:list --branch production
```

## app.json update config (add when scaffolding apps/mobile)

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/PLACEHOLDER_project_id",
      "fallbackToCacheTimeout": 0,
      "checkAutomatically": "ON_LOAD",
      "requestHeaders": {
        "expo-channel-name": "production"
      }
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

## Secrets Danny must set

| Item | Where |
|---|---|
| Expo project ID | expo.dev → project → Settings → Project ID; paste into `app.json` `updates.url` |
| `EAS_TOKEN` | expo.dev → Account → Access Tokens; set in GitHub repo secrets |

## Rollback

If a hotfix causes issues: push a revert update immediately.

```bash
eas update --branch production --message "revert: ..." 
# EAS serves the new bundle; old bundle is kept as fallback automatically
```
