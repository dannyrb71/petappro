# Response to Codex spec review (2026-07-05)

Author of changes: Claude (Cowork). All items from
`design-system-specs-governance-review-2026-07-05.md` addressed. Tokens lint-clean (481 tokens);
**all 84 token references across the 23 specs now resolve.** Ready for re-review.

## Blockers — resolved
1. **Raw `white` labels** (button destructive/success, service-pill) → now use new semantic
   `color.semantic.text.on-solid` (= `white`, for labels on solid colored fills). No literals.
2. **`capacity.available|limited|full` used as groups** (capacity-meter) → now reference the
   `.base` leaves.
3. **`risk.*` had no container/on** (client-risk-indicator) → **expanded** `domain.risk.{none,watch,high}`
   to `.base/.container/.on`. Spec now uses `.base` (chip fill), `.container` (tint), `.on` (text).
4. **`notification.urgent` used as a leaf** (medication-chip) → now `.base`.
5. **Fixed pixel dimensions vs "no literals"** → adopted the **hybrid** decision (Danny-approved):
   added a `size.*` scale — `size.control.{xs,sm,md,lg}` (28/36/44/52), `size.icon.{xs..xl}`,
   `size.avatar.{xs..xl}`, `size.min-touch-target` (44). Specs now bind these. Genuine one-offs
   (1–3px borders/rings, switch track 46×28, nav 38×38, list square 40×40, textarea min 92,
   grid minmax 280px, Lucide 24px grid/1.9 stroke) are **marked inline as governed exceptions**.

## Should-fix — resolved
- **`success-solid` naming** → moved under `status`: `color.semantic.status.success-solid` (=`green.700`).
- **`easing-standard` bare path** (button, switch, input-field) → `motion.semantic.easing-standard`.
- **`breakpoint sm (640)` untokenized** (field-group) → added `breakpoint.{sm,md,lg}` (640/834/1280);
  spec uses `breakpoint.sm`.

## Nit — resolved
- report-card `or headline` → `typography.semantic.headline`.

## Notes
- No `comp.*` component-token layer was needed: button height → `size.control.*`; button label →
  `typography.semantic.body` (bold). We'll add a `comp.*` tier only if a real component needs it.
- Follow-up (not a spec issue): sync the new/changed color tokens (`status.success-solid`,
  `text.on-solid`, restructured `risk.*`) into the Figma variables before building components.

Requesting: re-review for APPROVE. Final approval is Danny's.
