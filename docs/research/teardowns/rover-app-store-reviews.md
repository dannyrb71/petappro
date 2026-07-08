# Review Mining: Rover (App Store, id 547320928)

**Reviewed:** 2026-07-07 · **Reviewer:** Cowork · **Source:** Apple App Store "Ratings & Reviews" (4.9★, 516K ratings)
**Informs:** `feature-ideas-log.md` (F-012, F-013, + new F-014..F-017), design research thread (R-001 archetypes)

> **Scope note:** Rover is a **marketplace** — deliberately *not* one of our 4 discovery competitors (Gingr, Goose, Time To Pet, PetPocketbook). We mine it only for **provider-side (sitter) software pain** that applies to PetAppro as booking software. **Per Danny: marketplace signals are excluded** — fees/commission, sitter–client matching, search/discovery filters, lead volume, and trust & safety disputes are all filtered out below.

---

## The headline find — per-service availability (validates F-012, motivates F-014)

A sitter's review titled *"New Feature Suggestion & Critique from a Star Sitter"* (04/29/2025):

> "I suggest there be a different line on your calendar when you've **restricted some but not all of your services**. Somehow, the entire month was marked as unavailable for house sitting, leading to me earning less than $1k… if I had a mark on the calendar I would've figured it out sooner why I wasn't getting booking requests."

This is exactly your insight — a PCSP running multiple services who wants to cap/close **one** service while keeping others open (hit capacity on walking, still boarding + training). Rover *lets* you restrict per service but gives **no clear calendar visibility**, so a partial restriction silently read as fully unavailable and cost real income.

**Second corroborating review** (*"This app needs so many improvements,"* 05/25/2021):

> "You can book the times you will be unavailable and **adjust the amount of customers per day**. I blocked off a few days and rover recommended someone to me when I had filled out I was unavailable… They only give you three options for times (6am–11am, 11am–3pm, 3pm–10pm). These times are so broad… the app should allow you to add specific times."

Two more signals: **per-service daily capacity caps** ("customers per day"), and **granular availability windows** instead of broad buckets.

### Design takeaways
1. **Per-service availability must be visible and legible** — a provider managing several services needs to see, per service, at a glance: open / capped / blocked. A silent blanket "unavailable" is a revenue bug, not just a UX miss.
2. **Capacity ≠ block-out.** F-012 covers blocking days out. The reviews surface a distinct need: **auto-close a service when it hits a capacity cap** while other services keep taking bookings.

---

## Other non-marketplace provider signals worth capturing

**Vaccination requirements (validates F-013).** *"As a pet sitter…"* (05/27/2025):
> "There is nowhere in the app for a sitter to require vaccinations nor a place for the owner to put the vaccination records in… When I request vaccinations I sometimes get pushback and am **fearful that it will affect my rating** because Rover doesn't make it an option to require."
Confirms demand for a vax-proof gate with owner-side record upload. → F-013.

**Multi-owner households (new → F-015).** *"Great service, terrible app"* (07/22/2022):
> "There is no way to set **more than 1 dog owner**. Only 1 owner's name is shown. When the other owner talks to sitters, they have no idea who is talking… you have to keep signing your name."
Maps straight to PetAppro's household model — a household can have two humans; both should be identifiable.

**Per-service activity/report-card behavior (new → F-017).** Same *"As a pet sitter…"* review:
> "I love the idea of a Rover Card… but if it's boarding you get a new one daily; if I record a walk it **closes the card which ends the stay** even though the owner isn't picking up yet."
Activity logging (a walk) shouldn't terminate a different, still-active service (a boarding). Activity records must be scoped to the right service instance.

**Build-quality lessons (not features, but noted):** profile edits silently not saving; a conditional field value ("Depends") not surfacing on the profile; an unintuitive archive/inbox toggle. Reinforces our server-authoritative + reliable-state principles and simple, single-inbox navigation.

---

## Maps to feature-ideas-log

| Signal | Log entry | Action |
|---|---|---|
| Restrict some-but-not-all services; needs calendar visibility | **F-012** (block-out by service) | Add validation + calendar-visibility requirement |
| Auto-close a service at a capacity cap; per-service daily limits | **F-014** (new) | Per-service capacity caps |
| Vaccination requirement + owner record upload | **F-013** (vax gate) | Add validation |
| Two owners per household, both identifiable | **F-015** (new) | Multi-owner household identity |
| Granular availability windows (not 3 broad buckets) | **F-016** (new) | Fine-grained availability times |
| Activity log scoped to the right service instance | **F-017** (new) | Per-service activity/report-card scoping |

---

## Google Play pass (2026-07-07, ~22 reviews, "Most relevant")

Play corroborates the same provider-software pain and adds detail. Non-marketplace signals:

- **Availability editing is crude and painful (→ F-016, F-012).** *"can't even update more than one day at a time of my calendar beyond available/unavailable"* (callie, Jun 2026); *"Editing/updating availability has to be done day by day… can't switch all Wednesday hours"* (LT, Feb 2026). Providers want **bulk / recurring** availability edits, not day-by-day toggling.
- **Editing recurring bookings is broken (→ new F-018).** *"skipping one day on a recurring walk… the app will let you cancel then it just pops right back up… can't change it until the week of"* (Mary S., 23 helpful). Skip-one-occurrence / add-a-day / change-a-time on a recurring series.
- **Activity logging unreliable & mis-scoped (→ F-017).** Walk tracker deletes records / keeps recording after the walk ends (Skylar); *"+food adds a count to water instead… 1 added then pops back to 0"* (Billy A); drop-ins won't complete (Eva). Activity/counter state must be reliable and tied to the right service instance.
- **Media handling (photos/videos to owners).** Repeated: camera opens an empty gallery (Jasmine); video-to-owner takes minutes and fails (Billy A). Media send is core to the report-card value prop — must be rock-solid.
- **Owner vs. sitter context bleed (relevant to our role model).** *"can't switch between sitter and owner profiles, so everything is together… confusing"* (LT); an owner repeatedly prompted to set up sitter services (Tates1213). Reinforces clean context separation + a clear switcher — pairs with F-011 hub and D-003.
- **Form-field UX.** *"every field acts like a password field… cannot paste or use swipe typing"* (Tim G.). Small, but a real friction lesson for our forms.
- **App/website parity.** Several: features missing on one surface, "use the desktop site." Our native-first stance must not split capability across surfaces.

*(Excluded per scope: sitter search/sort filters, added-fee/commission complaints, request broadcast to extra sitters, refund/CS disputes, an ad-hating review.)*

---

## Reddit scrub — r/RoverPetSitting (2026-07-07)

The subreddit makes one theme unmistakable: **availability & capacity are the #1 provider software pain**, and it's *your* insight at scale. Paraphrased (not verbatim):

- **Binary available/unavailable can't express real capacity.** A single-dog-at-a-time sitter lost "Star Sitter" because declining still hurt her acceptance rate — the system, in her words, is built for *"high-volume, always-available, multi-dog households"* and ignores nuanced, safety-based capacity. Multiple owners echo the mirror image: a sitter's calendar shows open but they decline. **Lesson:** model capacity richly (concurrent limits, per-service caps, fit/energy rules) instead of a crude open/closed flag.
- **Blocked ≠ un-requestable.** Sitters are frustrated that owners can still send requests against a blocked calendar (hurts response rate). **Availability states should actually gate what can be requested.**
- **Booking rules by client type & notice (→ new F-019).** Strong demand for a real **"repeat clients only"** mode and **minimum advance-notice** — last-minute/new requests shouldn't force a penalizing decline. Sitters explicitly ask Rover to *stop new/last-minute requests coming through* when their rules say otherwise.
- **Cancellation attribution.** Sitters cancel on an owner's behalf but must pick a fake "availability changed" reason. **Booking cancellations need honest, attributable reasons** (owner-requested vs. provider), without gaming.
- **Stale calendars are a symptom, not laziness.** Owners complain sitters don't keep calendars current — precisely because editing availability is tedious (see Play). Easy/bulk availability tooling fixes both sides.
- General: the app is widely called clunky ("don't bother with the app; it's awful — clients hate it too"). Reinforces our simplicity / mobile-native north star.

*(Excluded per scope: the dog-death safety tragedy, client-vetting/creepy-client screening stories, ranking-algorithm and fee-avoidance guides, low-request income venting, pricing/profile-optimization threads.)*

---

## Dominant signal (all three sources)

**Per-service availability + capacity is the single most common provider software complaint.** Your intuition — cap one service while others stay open — is the tip of a bigger truth: Rover's biggest structural miss for providers is a **crude, binary, hard-to-edit availability model** that can't express real capacity, fit, client-type, or notice rules, and doesn't reliably gate requests. That's a concrete wedge for PetAppro. Maps to **F-012, F-014, F-016, F-018, F-019** in `feature-ideas-log.md`.

---

## Method / limits

- Three sources: Apple App Store (browser, curated "most helpful"), Google Play ("Most relevant" dialog, ~22 reviews), and r/RoverPetSitting top posts (old.reddit). Apple's JSON/RSS feeds returned empty via fetch, so all reads were through the browser.
- **Qualitative, not quantitative.** These are curated/top slices, not representative samples — directional signal, strong on the availability/capacity theme by sheer repetition, but not frequency-weighted. If we want hard numbers behind any single idea, a scripted full-corpus pull would be the next step.
- Reddit content is paraphrased deliberately (no substantial verbatim reproduction).
