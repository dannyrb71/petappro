# Sentry integration — PetAppro (D-050)

Crash/error monitoring from day one. The Sentry Expo plugin handles JS + native
crash capture and source-map upload automatically at build time.

## Status

**STUB — wired in config, not yet active.** Becomes active when:
1. Danny creates a Sentry project at sentry.io (free tier is sufficient for beta)
2. The four secrets below are set in GitHub repo settings
3. `apps/mobile` is scaffolded and the plugin config below is added to `app.json`

## Secrets Danny must create

| Secret name | Where to get it | Set in |
|---|---|---|
| `SENTRY_DSN` | sentry.io → Project → Settings → Client Keys | `apps/mobile/.env` + EAS env |
| `SENTRY_AUTH_TOKEN` | sentry.io → Settings → Auth Tokens | GitHub repo secrets |
| `SENTRY_ORG` | sentry.io org slug (e.g. `base509`) | GitHub repo secrets |
| `SENTRY_PROJECT` | sentry.io project slug (e.g. `petappro-mobile`) | GitHub repo secrets |

## app.json plugin config (add when scaffolding apps/mobile)

```json
{
  "expo": {
    "plugins": [
      [
        "@sentry/react-native/expo",
        {
          "organization": "base509",
          "project": "petappro-mobile",
          "url": "https://sentry.io/"
        }
      ]
    ]
  }
}
```

## Package to install

```bash
cd apps/mobile
npx expo install @sentry/react-native
```

## Initialization (add to apps/mobile/src/app/_layout.tsx or entry point)

```ts
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Capture 10% of sessions for performance monitoring in prod; 100% in dev/preview
  tracesSampleRate: process.env.APP_ENV === "production" ? 0.1 : 1.0,
  // Tag every event with the release build number (set by EAS autoIncrement)
  release: process.env.EXPO_PUBLIC_APP_VERSION,
  environment: process.env.APP_ENV ?? "development",
  // Attach the tenant ID so crashes are triageable per provider
  // (set after login — see src/lib/sentry.ts)
  enabled: process.env.APP_ENV !== "development",
});
```

## Tenant tagging helper (create at apps/mobile/src/lib/sentry.ts)

```ts
import * as Sentry from "@sentry/react-native";

/** Call after the user logs in and the active business is resolved. */
export function identifySentryUser(params: {
  userId: string;
  businessId: string | null;
  role: string;
}): void {
  Sentry.setUser({ id: params.userId });
  Sentry.setTag("business_id", params.businessId ?? "none");
  Sentry.setTag("role", params.role);
}

/** Call on logout. */
export function clearSentryUser(): void {
  Sentry.setUser(null);
}
```

## Source-map upload

The `@sentry/react-native/expo` plugin handles source-map upload automatically
during `eas build`. No extra CLI step is needed beyond setting `SENTRY_AUTH_TOKEN`
in the EAS build environment.

For local development, source maps are not uploaded (only prod + preview builds use EAS).

## What it catches

- **JS crashes:** unhandled promise rejections, thrown errors, React render errors
- **Native crashes:** iOS + Android native crashes (symbolicated via dSYMs + ProGuard)
- **Pricing edge cases:** if `calculateBookingPrice` throws (validation errors, type
  mismatches from DB data), Sentry captures the full context including the sanitized
  input shape (do NOT log raw `amount_minor` values — use tag-based metadata only)

## What NOT to log

- PII: client names, pet names, addresses, phone numbers
- Financial values: `amount_minor`, card last4, Connect account IDs
- Supabase JWTs or service-role keys
- Booking details that identify a specific transaction

Use `Sentry.setTag()` for triageable context (tenant ID, role, screen name).
Use `Sentry.addBreadcrumb()` for navigation/flow events, not data values.
