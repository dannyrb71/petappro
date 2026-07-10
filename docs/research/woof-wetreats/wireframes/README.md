# Woof WeTreats — Mobile Wireframes (for Petappro)

Low-fidelity, grayscale wireframes of the mobile (web / add-to-home-screen) experience.
13 screens across the client and staff sides. Start with `00-overview-contact-sheet.png`.

Fidelity is intentionally low: boxes and labels to lock **layout and flow**, not visual
design. Where color carries meaning in the real app, it's noted in the label
(e.g. "Boarding (blue)", "Meet & Greet (orange)") rather than drawn — so those semantics
survive the grayscale handoff.

## Client experience
- **c01-signin** — Google / Facebook / email auth. Login-gated.
- **c02-onboarding-info** — Step 1 of 4: name, phone, email, address (all required).
- **c03-onboarding-vet** — Step 3 of 4: emergency contact + vet info.
- **c04-add-dogs** — Step 4 of 4: dog cards, live "Puppy" badge, dashed +Add Dog (max 3).
- **c05-client-dashboard** — Welcome, notification banner, current booking, M&G location, past bookings.
- **c06-booking-form** — Boarding/Daycare toggle, dates+times, dog checkboxes, payment toggle.
- **c07-price-review** — Live price w/ per-night holiday + puppy breakdown, care notes, doc attach.
- **c08-blocked-states** — Blocked-client static page + the >14-night "text us" guard.

## Staff experience (Danny / Marco)
- **s01-staff-dashboard** — Metrics row, revenue panel, "currently here" grid, +New Booking.
- **s02-clients-list** — Search (owner or dog), filter pills, household cards with service/status.
- **s03-client-detail** — Current booking cascade, editable contact/vet, dog cards, private staff notes, Mark Paid / Block.
- **s04-daily-schedule** — Date navigator + Arrivals / Departures / Staying-over with completion checkboxes.
- **s05-calendar-blocking** — Month grid with booking/blocked/holiday markers, tap-a-day block/unblock.

## Notes for build
- Every screen is a scrollable single column at ~390px logical width.
- Toggles (service type, payment) validate against the selected dates before submit (see brief §3).
- Staff notes are private — enforce at the DB (RLS), not just hidden in UI (brief §6.5).
- A day can be both booked and staff-blocked at once — independent states (brief §9.3).

Source is reproducible: `wf.py` (primitives) + `screens.py` (screens) → PNG via cairosvg.
SVGs are alongside each PNG if you want to tweak.
