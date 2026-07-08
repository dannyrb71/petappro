# Website Content & Structure (draft)

> Sitemap + page-by-page content and draft copy for `apps/web`. Copy is a first draft to react to — refine in `Marketing/Messaging/` before build. Audience for petappro.com = **pet-care providers** (the paying SaaS customers); their clients use the app to book.

## Sitemap

```
petappro.com  (canonical product site)
├── /               Home / marketing
├── /pricing        Plans & tiers
├── /providers      For providers (deep features + signup CTA)
├── /signup         Provider sign-up → Stripe Billing
├── /support        Help / contact (store-required)
├── /privacy        Privacy Policy (store-required)
├── /terms          Terms of Service (store-required)
└── /download       App links (placeholder until stores live)

base509.com  (company hub — same deployment, one page for now)
└── /               Company + products list → links to petappro.com
```

## petappro.com

### / (Home)
- **Hero:** *"Booking, scheduling, and payments built for pet-care pros."* Sub: "PetAppro gives boarders, sitters, groomers, and walkers a booking app their clients love — and the scheduling, capacity, and pricing tools their business actually needs." CTA: **Start free** / **See pricing**.
- **Problem → solution:** Facility software (Gingr) is powerful but pricey and dated; generic tools (Fresha/Booksy/Square) don't handle the operational realities of pet care (capacity, per-night/per-unit pricing, add-ons, multi-participant). PetAppro is purpose-built for it.
- **Feature highlights (3–4 cards):** Smart booking + availability · Capacity & scheduling · Flexible pricing (per-night, add-ons, holiday/peak) · Client app + push reminders.
- **Payments line:** "Your clients pay you directly through Stripe — money lands in your account, not ours."
- **Social proof placeholder** (design-partner quotes post-beta).
- **Closing CTA:** Start free → /signup.

### /pricing
Tiers (from strategy plan — confirm final numbers):

| Plan | Price | For | Includes |
|---|---|---|---|
| Starter | $0 or $19/mo | Solo, low volume | Core booking, 1 staff seat, Stripe Connect, CSV export, push |
| Pro | $39–$49/mo | Established solo / small | + reports, holiday/peak pricing, care docs, priority push |
| Business | $79–$99/mo | Multi-staff facility | + multi-seat, capacity/resource scheduling, QuickBooks sync, roles |

- Add-ons line: SMS reminders, QuickBooks sync, advanced reports.
- Note: "Billed on the web. Cancel anytime."

### /providers
Deeper feature walkthrough by job-to-be-done (booking, capacity, pricing engine, client management, notifications, payouts), each with a short blurb + visual. Ends with signup CTA.

### /signup
Provider account creation → Stripe Billing checkout (Starter/Pro/Business). First user = owner (per D-020).

### /support
Contact form + email, FAQ, links to /privacy and /terms. This is the store "Support URL."

### /privacy, /terms
Legal (workstream B — drafted once data flows pinned). Store-required URLs.

### /download
"Coming to the App Store and Google Play." Placeholder badges → swap real links at launch.

## base509.com

Single page:
- **Hero:** "Base509 builds software for small service businesses." One line on the company.
- **Products:** PetAppro card → links to petappro.com. Room for future "Appro" products.
- **Contact:** email. Minimal footer (© Base509 LLC).

## Open copy decisions
- Final tier prices (ranges above).
- Primary tagline for PetAppro (hero options to A/B).
- Whether the home page addresses clients at all, or providers only (recommended: providers only; clients meet the brand in the app).
