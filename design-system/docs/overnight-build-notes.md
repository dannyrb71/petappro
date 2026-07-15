# Overnight build notes — 2026-07-11 → 07-12

Autonomous build of the post-Calendar roadmap while Danny sleeps. Conventions held: every frame named, horizontal `FILL` on responsive sections, token-bound, composed from existing bricks, dark-elevation surfaces (cards on `surface/container` + `Elevation/Card`).

## Roadmap (build order)
1. App shell & navigation (Top App Bar, Bottom Tab Bar, web nav)
2. New Booking flow (assembly; Calendar slot = placeholder until #27 built)
3. Rates & pricing (display card/modal + staff Rates editor)
4. Clients list + search (Client List Row component + screen)
5. Client Profile (assembly of existing cards)
6. Reports & charts (KPI tiles + line/donut — charts as placeholders where Figma can't draw live)
7. Pet profile + care/staff notes (add/edit dog form)
8. Feedback & states (toast, empty state, skeleton, alert dialog)

## Build log — components landed (all page 05, section "§ App Building Blocks (overnight)" 390:581)
All token-bound, named frames, `FILL` on responsive rows, cards on `surface/container` + `Elevation/Card`.
- `organism/App Bar` (385:525) — back · title · spacer(FILL) · search+bell actions.
- `organism/Bottom Tab Bar` (385:540) — 4 tabs (Home active / Schedule / Clients / More), FILL tabs, active tint = action/primary.
- `molecule/Client List Row` (386:544) — avatar · name+summary · spacer(FILL) · balance(Money) · caret.
- `molecule/Toast` (387:551) — icon · message · spacer(FILL) · Undo.
- `organism/Empty State` (387:562) — icon · title · body(FILL, centered) · Button.
- `molecule/Skeleton` (387:574) — 3 shimmer bars (1 FILL).
- `molecule/Segmented Control` (388:560) — 2 FILL segments, selected filled.
- `molecule/Search Field` (388:569) — icon · placeholder(FILL).
- `organism/Confirm Dialog` (388:576) — title · body(FILL) · Keep it / Yes-cancel, modal radius + Elevation/Modal.
- `organism/Rates Card` (389:569) — header · tiered rate rows (label · spacer(FILL) · Money) · note.
- `molecule/Filter Chip` (391:581) — label + count badge (unselected default; selected/close = variants TODO).
- `molecule/Tabs` (391:589) — 3 tabs, active label + underline (FILL tabs).
- `molecule/Day Cell` (392:622) — variant set: Open / Booked / Busy 1-3 / Blocked / Holiday / Today / Selected. Density = one amber token at 0.22/0.5/0.8 opacity (amber ramp only has /100 as a var — see Q10).
- `organism/Calendar` (394:595) ✅ **task #27** — header (‹ month ›) · weekday row · 5×7 grid of Day Cells (mixed states shown) · one calendar covers client (booked/blocked/holiday) + staff (density/blocked/holiday) via cell states. FILL weekday + week rows.
- `organism/Pet Profile Card` (396:677) — photo · name · meta · Edit/Remove.
- `organism/Notes Editor` (396:697) — header+Edit · atom/Textarea (Care/Staff notes).
- `organism/Location Card` (396:707) — header · **map = grey placeholder + pin (Q11)** · address · Get directions.
- `organism/Chart Card · Bar` (397:692) — label · bar row (boarding-color rects) — static demo data.
- `organism/Chart Card · Donut` (397:707) — real arc segments (98/2) via ellipse arcData + legend — static demo data.
- `molecule/Stat Tile` (397:726) — label · Display value · delta (▲ +254%).

Roadmap after full night: **Calendar #27 ✅**, App shell mobile ✅, Feedback ✅, Rates display ✅, Clients blocks ✅, Reports blocks ✅ (charts static), Pet-profile + Notes ✅. Remaining = the four **screen ASSEMBLIES** (New Booking, Client Profile, Reports page, Pet/Clients screens) — all the parts now exist to compose them — plus web nav + staff Rates editor + real map/chart data.

## Prototype starter screens (page 08)
Two top-level sections, each a horizontal row of flow groups (header + mobile 390×844 screen: App Bar → content(FILL) → Bottom Tab Bar, all component instances).
- **CUSTOMER** (401:2): `Dashboard` (Booking Card + Location Card) · `New Booking` (Segmented Control + Calendar).
- **OWNER / STAFF** (403:506): `Daily Schedule` (Day Picker + Calendar + Activity Row) · `Client Profile` (Booking Card + Pet Profile + Notes Editor).
- New: `molecule/Day Picker` (402:707) — ‹ date + Today chip › for schedule pages (Danny request).

⚑ **FIGJAM RECONCILE (important):** I could NOT access the FigJam user-flow diagrams (no file key; FigJam content can't be copied into a design file via API). Flow names are **inferred from the Woof app** and each header is tagged "⚑ rename to FigJam flow." AM: give me the FigJam link/flow names and I'll rename the flow groups + add the missing flows (onboarding, booking-manage, profile/dogs, house-rules; staff reports, settings/rates, clients-list, etc.) and can paste diagram images alongside for reference.

## THEMING — dark-mode "light-in-dark" text/icon colors (Danny 2026-07-12)
`text/accent` (and other mid-tone semantic colors used as **text/icons**: accent links, status text, service labels) lose contrast on dark surfaces. Fix = keep the single semantic token but bind its **dark-scheme value to a lighter step** (e.g. `text/accent` → brandy-blue.600 light / brandy-blue.300 dark) via the Theme×Scheme matrix — stays semantic + theme-adaptive, no custom/primitive in components. Danny: not all need per-theme tuning; several can point dark → one shared light step. **Finalize exact steps during Danny's design-testing pass.**

**RESOLVED in tokens (2026-07-12): split accent by surface context.** `text/accent` → `brand.on-surface-accent` = dark end of band (`.600`/`.700`) in BOTH schemes (on-card; cards are light islands). NEW `text/on-canvas-accent` → `brand.on-canvas-accent` = scheme-adaptive (`.600`/`.700` on light canvas, `.300` on dark canvas). Added `on-canvas-accent` to all 12 theme files + semantic `text/on-canvas-accent`; lint 785 clean. **Rule: use `text/accent` on cards/surfaces, `text/on-canvas-accent` for links/labels on the app background.**
✅ FIGMA SYNC DONE (2026-07-12): created `light/on-canvas-accent` (436:2) + `dark/on-canvas-accent` (436:3) in Theme, `on-canvas-accent` (436:4) in Scheme, and semantic `text/on-canvas-accent` (436:5, scope TEXT_FILL, code syntax set) — mirrors the on-surface-accent chain; usable in components now. Screen bgs currently use `surface/default` (light island) so screen-level links correctly use `text/accent`; switch a link to `text/on-canvas-accent` only where it sits on `surface/canvas` (dark app bg).
Remaining audit: other text/icon semantics that can land on dark canvas (status text, service labels) — same split if needed.

## More questions (AM)
10. ~~Amber ramp opacity density~~ **RESOLVED (Danny): calendar density now uses Woof-style thick diagonal stripes** — Busy 1 (1–3) = gray/white stripes, Busy 2 (4–8) = amber/white stripes, Busy 3 (9+) = solid amber; Blocked = solid gray. Stripes = rotated bars clipped inside each Day Cell (base = `surface/default`, bars = `maverick/300` gray / `status/warning` amber).
11. **Location map** is a grey placeholder box + pin — real map is a runtime integration (Google Maps), not a Figma asset. Left as placeholder intentionally.
12. **Charts** use static demo data (bar heights, 98/2 donut). Real charts render from data in code — these are the visual spec.
13. Calendar cell is 44×44 fixed; the grid rows are `FILL` with space-between so it's responsive. If you want cells to grow with width, say so and I'll switch cells to FILL.

Roadmap status after tonight: #28 App shell = App Bar + Tab Bar done (web nav TODO); #35 Feedback = Toast/Empty/Skeleton/Dialog done; #30 Rates = display card done (staff editor TODO); #31 Clients = Client List Row done (screen assembly TODO). Also built Segmented Control + Search Field (feed New Booking + Clients). NOT started (need Calendar #27 first and/or more time): #29 New Booking assembly, #32 Client Profile assembly, #33 Reports/charts, #34 Pet profile. Calendar #27 not built.

## ⚠️ Questions / placeholders to resolve with Danny (AM)
1. **Icon gaps** — the icon set has no **home**, **reports/chart**, or **dog/paw** glyph. Tab Bar used stand-ins (Home = check-circle, Schedule = calendar, Clients = user). Need real icons added, then swap.
2. **Tab sets per side** — I built a staff-leaning set (Home / Schedule / Clients / More). Client side is different (Home / Bookings / Dogs / Profile). Confirm the tab lists for each side (and whether it's 4 or 5 tabs).
3. **Active-nav color** — active tab uses `action/primary` (renders green). Confirm that's the intended selected-tab color vs a different accent.
4. **Segmented Control vs Service Pill** — the New Booking service select currently used Service Pills; I also built a generic Segmented Control. Decide which is canonical for service select (pills = colorful/branded; segmented = neutral toggle).
5. **Rates Card note uses an emoji** (🐶) — against the DS no-emoji rule (placeholder). Replace with an icon or drop it.
6. **Toast style** — built on a light surface. Confirm vs an inverse/dark toast (common convention).
7. **Confirm Dialog** is the dialog card only — the scrim/overlay + centering is a screen-level wrapper (like the Modal). Fine as a component; note for assembly.
8. **Web nav** for the provider portal not built yet (mobile shell only).
9. Assemblies (New Booking, Client Profile, Reports, Pet profile) and the **Calendar** are the remaining big pieces — Calendar should come first since New Booking depends on it.
