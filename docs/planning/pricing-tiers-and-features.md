# Pricing Tiers × Features — draft matrix (for decision, not yet landed)

**Status:** DRAFT for Danny to react to (Cowork, 2026-07-11). Feeds **D-020** (SaaS pricing/tiers). Nothing here is locked.
**Purpose:** visualize the feature ladder before committing a tier structure. Ties D-020 (seats), D-030 (white-label), D-040 (theming tiers), D-048 (verticals/GPS), D-007 (payments/tips), D-008 (SMS).

---

## Axis — RESOLVED: one ladder, by seats (Danny, 2026-07-11)

Tiers are **seat bands**, with features bundled per band (collapses the earlier two-axis tension; supersedes D-020's 1/2/small-business framing):

| Tier | Name | Seats | Cost |
|---|---|---|---|
| **T0** | **Starter** | 1 user · ≤5 clients | Free (capped; "Powered by PetAppro") |
| **T1** | **Solo** | 1 user | Paid — lowest |
| **T2** | **Duo** | 1–2 users | Paid |
| **T3** | **Crew** | 1–5 users | Paid |
| **T4** | **Team** | 5–20 users | Paid |
| **Enterprise** | **Enterprise** | 20+ | Contact us (ties D-030 white-label isolation) |

Because the ladder is seat-based, **it launches cleanly**: seats, payments, and themes all exist at MVP, so all bands are sellable day-one. GPS (v1.1) and in-app messaging (post-MVP) simply *enrich* the upper bands as they ship — they don't gate launch.

---

## Revised feature matrix (seat bands, 2026-07-11)

Legend: ✅ included · — not · **[v1.1]** post-launch (D-048 GPS) · **[post-MVP]** later · **[add-on]** metered extra at any tier.

| Feature | T0 Starter | T1 Solo | T2 Duo | T3 Crew | T4 Team | Ent |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Core booking (boarding, daycare, walking; drop-in stretch) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Clients, pets, households, staff schedule | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Explicit-rate pricing + holiday tiers (D-039) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Report cards + check-in/out (D-046) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manual payment tracking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **In-app payments — Stripe Connect + tips** (D-007) | — | — | ✅ | ✅ | ✅ | ✅ |
| Default theme — Brandy Blue (D-040) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pick 1 of 3 themes | — | — | ✅ | ✅ | ✅ | ✅ |
| Expanded theme set | — | — | — | ✅ | ✅ | ✅ |
| Full library + seasonal packs | — | — | — | — | ✅ | ✅ |
| **GPS walk tracking** (D-048) | — | — | — | ✅ [v1.1] | ✅ [v1.1] | ✅ [v1.1] |
| **In-app messaging** | — | — | — | — | ✅ [post-MVP] | ✅ [post-MVP] |
| SMS alerts (D-008) — top tier only, opt-in | — | — | — | — | opt-in | opt-in |
| White-label / tenant isolation (D-030) | — | — | — | — | — | ✅ [post-MVP] |
| Own branding (no "Powered by PetAppro") | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| Client cap | 5 | ∞ | ∞ | ∞ | ∞ | ∞ |
| Seats | 1 | 1 | up to 2 | up to 5 | up to 20 | 20+ |

**Feature moves from the first draft:** payments **T3 → T2** (Danny); GPS **T2 → T3** (Danny); Enterprise band added (20+ seats, white-label isolation, contact-us).

**Notifications vs SMS (Danny, 2026-07-11 — see D-049):** **push + email are the built-in notification stack, free at every tier.** They cover MVP because providers run their business in the app (they'll have push on). **SMS is top-tier only (T4/Enterprise), opt-in, off by default** — real per-message cost (~1.1¢ + A2P setup ~$44 + $1.50–10/mo), so it's not a mass channel. **Onboarding priming** strongly encourages notification permissions (framed around operational value — "track your pets / your clients"), with a **deep-link to settings** to re-enable. Compliance guardrails in D-049.

---

## Free access — trial, not a free tier (Danny, 2026-07-11)

**There is no permanent free T1.** "Non-payment level" meant the tier *without in-app payment processing* (manual tracking only), NOT a no-cost tier. Corrected:

- **Free trial** — ~1 week to 1 month across the board (recommend the longer end so a provider runs a real booking cycle before deciding). Converts to a paid tier at the end.
- **T1 = lowest *paid* tier** — 1 user, manual payment tracking (no in-app payments), default theme.
- **T0 = free-forever, hard-capped (DECIDED, Danny 2026-07-11)** — 1 user, **≤5 clients**, no support, no in-app payments, default theme, and **"Powered by PetAppro"–branded** (visible to their clients). Purpose: top-of-funnel on-ramp, install base + App Store presence/ratings, land-and-expand as hobbyists grow, and two-sided word-of-mouth (their clients discover the app). The **5-client cap is the conversion trigger** (upgrade prompt at the ceiling); **removing PetAppro branding + a higher client cap are upgrade drivers** (branding perk stacks with D-040 themes). Watch: multi-account gaming to dodge the cap (mitigate post-launch, not a blocker).

## Resolved / still-live tiering notes

- ✅ **Axis resolved:** one ladder, by seats (supersedes D-020's framing).
- ✅ **Payments at T2** (moved down from the first draft) — the strongest upgrade hook anchors the first payment-bearing paid tier; a 2nd seat is the parallel structural trigger.
- **Launch vs roadmap (still live):** GPS (v1.1) and messaging (post-MVP) aren't live day-one, so at launch T3/T4 beat T2 mainly on *more seats + more themes*. Fine — launch the seat ladder; GPS/messaging enrich (and may re-price) the upper bands as they ship.
- **Themes aren't a standalone driver** — each paid band still needs a functional reason to climb (payments, seats, GPS, messaging); themes ride along.

---

## Monetization stance & draft pricing (Danny, 2026-07-11)

**No client caps on paid tiers (DECIDED).** Only **Starter** is capped (5 clients — the free limiter). All paid tiers are **unlimited clients**. We monetize on **seats + features + being best-in-class (features & UX)** — not metered usage. Rationale: reads "flat and fair" vs per-staff models (Time To Pet, Scout) and meets the flat-unlimited expectation set by PetPocketbook/Paw Partner, while we win on product.

**Draft pricing — PLACEHOLDER, validate at the D-021 beta (not final):**

| Tier | Monthly | Annual (~2 mo free) |
|---|---|---|
| Starter | Free | — |
| Solo | $19 | $190 |
| Duo | $39 | $390 |
| Crew | $79 | $790 |
| Team | $149 | $1,490 |
| Enterprise | Custom | Custom |

**Market context (2026), two camps:** *per-staff* — Time To Pet ($25–50 base + $16/active staff; ~$120 for 5), Scout (~$33 + $15/staff); *flat-unlimited* — PetPocketbook ($25), Paw Partner ($99.99, facility). Facility/boarding all-in-ones (Gingr/PetExec/ProPet) run ~$100–300.

**Competitive position:**
- **vs per-staff:** flat-per-band beats per-seat surcharges at scale (5 staff ≈ $120 on TTP vs $79 Crew).
- **vs flat-unlimited discounters:** we don't out-cheap PetPocketbook's $25 — we win on the **free Starter tier**, **native mobile app** (many rivals are web-first), **themes/white-label**, **in-app payments + tips included from Duo up**, **sitting/drop-in verticals**, **no-marketplace trust** (D-029), and **modern UX**.

## Competitive-analysis (parallel thread)

Next pass: map the top user complaints about Rover/Wag/Time To Pet/Scout to concrete PetAppro features, and firm the differentiators — **free funnel tier, best-in-class UX, themes/branding, flat predictable pricing, provider-set explicit rates with holiday control (D-039, more control than Rover), booking-software-not-a-marketplace (D-029)**. (Owner: Cowork discovery lane — DR items.)
