# Website & Store Launch Plan (annex)

> Annex to `mvp_roadmap.md`. Owns: web architecture, hosting, the website workstreams, and the app-store approval sequence/timing. Cross-links to the MKT track in `../../TASKS.md`.
>
> **Launch target:** Oct 1, 2026 · **Fallback:** late October (date-flex is now an accepted safety valve, on top of the D-023 scope-flex approach).

## 1. Web architecture — one deployment, many URLs

One Next.js app (`apps/web`) serves multiple domains/subdomains attached to the same deployment:

- **petappro.com — canonical product site (critical path).** Serves directly (no redirect away). Hosts the app-store-required legal at stable paths: `/privacy`, `/terms`, `/support`.
- **base509.com — light company hub.** One page: what Base509 is + product list linking to PetAppro + contact. Same deployment, different route. Structured to grow as more "Appro" apps ship.
- Subdomains (e.g., a future `nextapp.base509.com`) are for separating *whole apps*; use plain paths for legal/support pages.
- Store consoles just need working HTTPS URLs — you paste the chosen petappro.com URLs into App Store Connect / Play Console.

## 2. Hosting

- **Vercel** (Next.js-native; cleanest multi-domain; git-push deploys with PR previews, same workflow as Netlify). Monorepo: set project root to `apps/web`.
- Netlify remains a valid fallback (Woof WeTreats already there), but Vercel is the pick for the new site. ~$20/mo Pro.
- Backend stays Supabase; provider subscriptions via Stripe Billing on the web (keeps Apple/Google IAP cut off subscription revenue).

## 3. Workstreams

| # | Workstream | Depends on | Owner | Notes |
|---|---|---|---|---|
| A | Content & structure (sitemap + copy) | — | Cowork draft → Danny | Brand-independent; start now |
| B | Legal (Privacy/Terms/Support) | Data model / processor list | Cowork draft → attorney skim | Store-required; host on petappro.com |
| C | Base509 brand (identity/skin) | Danny brand inputs | Danny + Cowork | Gates visual design only, not A/B |
| D | Build `apps/web` + deploy | A, B, C | Claude Code | Scaffold late Aug; live early Sep |

## 4. App-store approval sequence (grounded in 2026 timelines)

Approval timing — not the website — sets the dates:

- **D-U-N-S:** ~up to 5 business days to issue (+2 for Apple to ingest).
- **Apple org enrollment:** manual, **1–2 weeks** (sometimes longer).
- **Apple app review (2026):** new apps 2–7 days; budget a rejection/resubmit loop (submission volume up 60–100% YoY).
- **Google org account:** avoids the 12-tester/14-day rule (Organization choice pays off); **new-account first review 7–14 days**.

Sequence:

1. **Jul (now):** request D-U-N-S; reserve petappro.com / base509.com.
2. **Aug:** Apple ($99) + Google ($25) org enrollment once D-U-N-S lands (~mid-Aug); build site; draft legal.
3. **Late Aug–early Sep:** petappro.com live with `/privacy`, `/terms`, `/support`; base509.com page live.
4. **~Mid-Sep:** create store listings (metadata, screenshots, privacy/support URLs); submit builds; **set release date = Oct 1 and hold** (both stores allow approve-early / gate-release).
5. **Public store links** only exist post-approval → website "Download" buttons run as placeholders until launch week.

**Deadline note:** with late-Oct as a fallback, **mid-September submission** carries enough margin for review + resubmits. (Prior ~Sep 10 target is fine; no longer a hard squeeze.)

## 5. Brand dependency

- **PetAppro** already has a foundation (color tokens + logo assets in the design system) — enough to skin the product site.
- **Base509 corporate identity is the open item** (positioning, wordmark, palette, name story). It blocks only the visual pass (workstream C/D), not content or legal.
