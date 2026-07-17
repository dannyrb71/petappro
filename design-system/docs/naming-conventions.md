# PetAppro Design System — Naming Conventions

> Standard for tokens **and** components. Follows atomic-design + DTCG token best practice (Simple DS · Material 3 · Figma UI3 references), reconciled with what PetAppro already ships. Figma names are for designers (slash grouping); code names are set separately via code syntax (§7).

## 1. Tokens / Figma variables
Slash hierarchy, **lowercase**, kebab-case within a segment: `category/subcategory/role`.

- **Collections:** `Color · Primitives` · `Theme` (per-brand modes) · `Scheme` (Light/Dark) · `Color · Semantic` · `Dimensions` · `Typography`.
- **Primitives** — `family/step`, e.g. `brandy-blue/600`, `maverick/100`, `camo/500`. Raw values, **scope `[]`** (hidden), never consumed directly.
- **Semantic** — role aliases, e.g. `action/primary/default`, `surface/canvas`, `text/on-canvas`, `border/default`, `status/success`, `domain/service/boarding/base`. **Always alias a primitive**, never a raw hex.
- Themeing resolves Semantic → Scheme → Theme → Primitive (see `theming-decision.md` Decision 4).

## 2. Components — group by atomic layer, PascalCase name
Group with a **slash folder** by atomic layer; the component name is **PascalCase**:

- `atom/Button` · `atom/Icon` · `atom/Service Pill` · `atom/Status Badge` · `atom/Input`
- `molecule/Field Group` · `molecule/List Row` · `molecule/Section Header`
- `organism/Booking Card` · `organism/Modal` · `organism/Stat Card`
- `template/...`

Rules:
- **Multi-variant components = ONE variant set** with `Property=Value` (see §4). e.g. `atom/Service Pill` with `Service=Daycare`. **Never** one component per variant (`pill/service-pill-daycare` ✗).
- **Internal sub-components** use `_` prefix + parent namespace: `_Booking Card/Row`, `_Button/IconSlot` (hidden from Assets).
- **Doc-only** components use `.` prefix: `.Swatch`, `.DemoFrame`.

## 3. Icons — dedicated family (the swappable sprite set)
One component per glyph, grouped under `icon/`:

- **`icon/<name>`** — lowercase kebab, e.g. `icon/boarding`, `icon/walking`, `icon/daycare`, `icon/chevron-right`, `icon/close`.
  *(Prefer `icon/boarding` over the redundant `icon/icon-boarding`.)*
- Each: **24×24**, glyph centered, **proportions locked**, fill **bound to a color token** (default `text/default`; overridden in context, e.g. `text/on-solid` on a solid pill).
- Consumed via **INSTANCE_SWAP** so any icon slot can swap to any `icon/*` from the panel.

## 4. Variants
`Property=Value`; property names match code props (`Size`, `Variant`, `State`, `Service`, `Status`, `Disabled`, `Icon`). Values **Title Case** (`Size=Small`, `Service=Meet & Greet`). Booleans are Figma-native `true`/`false`.

## 5. Styles
- **Text styles:** `Category/Name` — `Display/Large`, `Title/Large`, `Body/Default`, `Body/Small`, `Label/Default`.
- **Effect styles:** `Elevation/<name>` — `Elevation/Card`, `Elevation/Raised`, `Elevation/Modal`, `Elevation/Nav`.

## 6. Pages & on-page organization
- **Pages:** numbered plain pattern (existing) — `00 Cover · 00 Brand · 01 Color · 02 Type · 03 Layout · 04 Themes · 05 Components · 06 Domain · 07 Templates · 08 Prototype · 09 Wireframes · 99 Sandbox`. Foundations before components; scratch/utilities last.
- **Within a page:** group with **Sections** (`§`) by category — `§ Icons`, `§ Tags`, `§ Buttons`, `§ Forms`. Explorations / comparisons / demos live on **`99 Sandbox`**, never mixed into the component sections.
- Display/scratch frames must **hug their content** (auto-layout, both axes hug or fixed-width + hug-height) — never a fixed tiny height.

## 7. Figma name vs code name (parallel identities)
Figma uses `/` + lowercase for panel grouping; code syntax is set independently:
- WEB: `color/semantic/action/primary/default` → `var(--pa-color-action-primary-default)`
- ANDROID: `paColorActionPrimaryDefault` · iOS: `Color.actionPrimaryDefault`
Set via `setVariableCodeSyntax`; never derive code names by string-munging the Figma name if the canonical token name exists.

## 8. Component & layout rules (Danny-set)
- **Service icon color on a background** — a service icon in a tile/container reads as **its pill**: the **tile = `domain/service/<name>/base`** (solid service color) with a **white icon (`text.on-solid`)** — identical to the Service Pill. (If a service icon ever sits inline with no tile on a light surface, color the icon itself `domain/service/<name>/base`.) A service must read as the same color everywhere it appears; when the icon swaps service, the tile color swaps with it.
- **Tables** — all columns are **fixed width** (so they align down the rows) **except the second-to-last, which is Fill**; that Fill absorbs slack and pushes the **last column** (fixed width, right-aligned) to the row edge, keeping the whole row responsive. Applies to fee breakdowns, reports, any tabular data.
- **Direction indicators** — use the **plain-fill** up/down marks (match the larger service-icon style), not the circle-fill: Arrival = down / `status.success`; Departure = up / `status.danger`. Icon sits in front of the label for quick scanning (`molecule/Direction Tag`).
- **Auto-layout containers hug their content** — never leave a fixed tiny height; set `primaryAxisSizingMode = AUTO` *after* any `resize()` (resize forces FIXED).
- **Corner radius (Danny 2026-07-11).** Large containers — **modals, sheets, large holder/section cards** — use **`radius/6` = 28px** (`radius.semantic.modal` / `sheet` / `container`). **Smaller inline components** — booking/activity/stat/list cards and small blocks — use **`radius/4` = 16px** (`radius.semantic.card` / `tile`). Inputs keep `radius/3` = 12px. Bind to the semantic radius token, never a raw px.
- **Reuse bricks, never redraw.** Compose components from existing atoms/molecules (Service Pill, Status Badge, Money, Avatar, Checkbox, Direction Tag, icon/*) via instances/INSTANCE_SWAP. Do not hand-build a parallel pill/badge/money/checkbox — it creates drift.
- **No spacer frames (Danny 2026-07-12).** Never add an empty frame to create space. Use auto-layout **Gap** (`itemSpacing`) for space *between* elements and **Padding** for space at the *edges*. To push items apart (e.g. title left / actions right), use `primaryAxisAlignItems = 'SPACE_BETWEEN'`, not a `FILL` spacer. To pin an element to the bottom, split the frame into a top group + bottom element and use `SPACE_BETWEEN` on the frame.
- **Icon/back buttons on content pages: no frame fill.** The back caret (and similar) sits transparent — no bg, no border. Pages are already full of filled cards; extra boxes make it busy. (Danny 2026-07-12)
- **Text always `FILL` width inside a container.** Any text that could wrap gets `layoutSizingHorizontal = 'FILL'` so it wraps within the container and never bleeds off the page or gets cropped. Only truly fixed inline chips may `HUG`. (Danny 2026-07-12)
- **Name every frame/layer meaningfully (Danny 2026-07-11) — never leave default "Frame".** A component's layer tree should be self-explanatory when opened. Name section frames by their role/content, e.g. a Booking Card reads top-to-bottom: `indicators` (service + status + payment pills) · `pet` (avatar + name) · `schedule` (with inner rows `drop-off` / `pick-up` / `duration`) · `divider` · `financials` (payment) · `actions` (footer). Keep the same named order across every variant in a set. Practice this while building, not as cleanup.
- **All text is an `atom/Text` instance (Danny 2026-07-11).** Pick the `Style` variant (Display · Headline · Title Large · Title · Body Large · Body · Body Small · Label · Label Small) and set `Content`. Each variant is pre-bound to its text style **and** the theme font variable (`Scheme.font-family`), so composing from it guarantees theme mapping. **Never place a raw text box** — a raw box uses static Poppins and won't follow the theme. Color is a per-instance fill override (white on a solid pill, gender-tint on a name, etc.).

## 9. Card system (Danny-set, 2026-07-11)
The scrub of the live Woof app clustered every card onto a shared **base = "Record card"** (leading identity → meta rows → status → trailing value/action). Eight families inherit it; **separate components, shared base/structure**, grouped into variant sets where the layout is identical.

1. **Booking Card** *(variant set)* — `Side` (Client-slim / Staff-full) × `State` (Upcoming · Active · Same-day · Completed · Cancelled) × `Payment` (Paid · Amount Due · Past Due · Partial). Staff adds the payment block (Total / Paid / Due) + Edit / Payments / Cancel. **Completed collapses to minimal.**
2. **Activity Row** *(variant set)* — schedule sibling of Booking Card: leading check + direction tag + time + info + client + care snippet + gender-tinted avatar(s). States Today (full) · In-progress (Day X of Y) · **Completed (minimal: check · tag · name only)**.
3. **Client List Row** · 4. **Stat Tile** · 5. **Info / Section Card** · 6. **Chart Card** · 7. **Form Card** · 8. **Modal** (Fee Breakdown, Rate Card).

**New shared pieces this introduced:** `atom/Pagination Dots`, `organism/Carousel` (swipe), `molecule/In-Out Check` (dual checkbox), `molecule/Payment Summary` (Total/Paid/Due + aggregate footer).

**Card rules:**
- **Payment block — every booking card ALWAYS shows three lines (Danny 2026-07-11):**
  1. **Total** — the booking's total sum. Label constant. Neutral.
  2. **Paid** — amount paid so far. Neutral.
  3. **Outstanding line — label + color by the booking's position in time:**
     - **Upcoming** (before service starts) → **"Total Due"**
     - **Active** (within the service window start→end, i.e. "today") → **"Amount Due"**
     - **Completed + unpaid** (past booking, checked in+out) → **"Past Due"**
  **Color of line 3: amber (`domain/payment/unpaid`) whenever money is owed — Total Due AND Amount Due are both amber; red (`status/danger`) only for Past Due (overdue); neutral when nothing's owed (paid, $0).** `atom/Money` carries each value; the Payment Summary's `Due Label` property drives line 3's label, its color is set per state. Never a hardcoded "Due"/"Balance due".
  - A **Completed** card is a PAST booking (checked in + out on the Daily Schedule) → **cannot be cancelled**: remove/fade the Cancel action, keep **Edit** (an admin can still adjust, e.g. $0 the amount due).
- **Aggregate vs single (multi-booking $ confusion).** A single booking's figure uses the state label above; an aggregate across bookings is labeled **"Total balance · N bookings."** Never show a summed amount next to one booking.
- **Info (i) placement.** The info control that opens the Fee Breakdown **trails the amount** when a dollar figure is present (`Due $195 (i)`); when there's no amount it sits **inline with the booking info**. Always the standard info-icon component, never literal "(i)" text.
- **Client bookings = swipeable carousel.** Multiple upcoming/unpaid bookings surface as a horizontal **paginated carousel** — **pagination dots, no arrows** — where **each card = one booking with its own correct total**; an aggregate balance is labeled explicitly beneath.
- **Check controls.** Single arrival/departure check = **circle**; **same-day services use a dual IN / OUT checkbox pair** (both are checkboxes) — tapping OUT moves the item to Completed. Labels: **In / Out**.
- **Direction tags.** Arrival = down / `status.success`; Departure = up / `status.danger` (see §8).
- **Cancelled card** shows the **cancelled date(s)** and original stay dates (e.g. "Was Jul 11–13 · cancelled Jul 9"), never a struck dog name.
- **Gender tint** (`color.semantic.domain.gender.{male,female,unknown}` → azure / grape / taupe) applies to the **avatar ring / photo outline ONLY** — the **dog name text stays neutral** (`text/default`). (Danny 2026-07-11: originally tinted the name too, but that's too much; the ring carries gender.) **When no photo is present, the fallback dog glyph is tinted to the gender color.**

Low-fi catalog lives on page **09 Wireframes → §ction "10 · Card Catalog"**.

## §10 Theme naming — families (Danny, 2026-07-17)

PetAppro theme names are **styles and personalities — never literal coat colors**. The proof is the default: *Brandy Blue* is named for Danny's late Golden Retriever, Brandy (his soul-mate dog), plus blue — his favorite color. A Golden isn't blue; the name carries feeling, not pigment. Every theme is named for the person/energy it evokes.

**Theme families:**
- **DOGS (breed personalities):** Chessie (Chesapeake Bay Retriever — sedge/deadgrass, duck-hunter/park-ranger energy), Irish Setter (warm chestnut), Husky (icy blue-grey), Poodle (pink/purple, playful, a little fancy — the poodle-*owner* personality). Dusk retains its name pending Danny (may become a City).
- **CITIES:** New York (charcoal/slate + a splash of blue — sharp, understated), Miami (salmon + teal — vacation energy), Hollywood (golden-hour orange + blue, touch of red — cinematic).
- **SEASONAL:** reserved, per D-040.

**Do not confuse the layers:** PRIMITIVES are named after Danny's dogs (`brandy-blue`, `camo`, `coco`, `bella`, `maverick`) — dog *names*. THEMES are breeds + cities. *Brandy Blue* is the deliberate exception living in both layers, because it's the brand.

**Structural rule:** every theme ships Light + Dark via the Theme × Scheme matrix (light-islands: cards/containers stay light in both schemes), built by aliasing existing primitive ramps — new themes must not alter primitive values, and must pass the WCAG contrast matrix on both schemes before shipping.

## Version history
| Version | Date | Change |
|---|---|---|
| 0.1.0 | 2026-07-10 | Initial convention (Danny-requested standard). |
| 0.2.0 | 2026-07-11 | §9 Card system — 8 families on a shared base; payment labeling, booking carousel, IN/OUT dual-check, cancelled dates, gender tint + fallback glyph. `domain/pet/*` → `domain/gender/*` (female = coral). |
| 0.3.0 | 2026-07-17 | §10 Theme naming families (dogs/cities/seasonal); renames Chessie · Irish Setter · Husky · Poodle; City themes New York · Miami · Hollywood. |
