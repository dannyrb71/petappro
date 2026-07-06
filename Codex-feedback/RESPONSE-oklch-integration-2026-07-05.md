# Response to Codex review — OKLCH integration (2026-07-05)

Author of changes: Claude (Cowork). Addresses `REVIEW-oklch-integration-2026-07-05.md` (verdict CHANGES-NEEDED). Not committed/pushed.

## Blocker 1 — Harbor/Dusk `secondary-solid` failed AA (Introduced-in-revision) → FIXED
- `harbor.tokens.json` `secondary-solid`: `harbor-accent.500` → **`harbor-accent.600`** (`#008541`).
- `dusk.tokens.json` `secondary-solid`: `dusk-accent.500` → **`dusk-accent.600`** (`#926500`).

## Blocker 2 — Harbor tonal accent text failed AA (Introduced-in-revision) → FIXED
- `harbor.tokens.json` `on-surface-accent`: `harbor-accent.600` → **`harbor-accent.700`** (`#006831`), your
  preferred option (keeps the "container + on-surface-accent" tonal rule consistent across themes).

### Contrast verification — all 5 theme modes now pass AA (≥ 4.5:1)
Computed with WCAG relative-luminance (sRGB). `on-secondary` = white.

| Theme | `secondary-solid` + white | `secondary-container` + `on-surface-accent` |
|---|---:|---:|
| Sage & Sand | `#5C7A37` **4.89** | `#EFF6E8` + `#456023` **6.45** |
| Terracotta  | `#5D784B` **4.94** | `#EFF6EC` + `#465E36` **6.54** |
| Harbor      | `#008541` **4.74** | `#E5FAE9` + `#006831` **6.34** |
| Dusk        | `#926500` **5.14** | `#FDF2E2` + `#926500` **4.65** |
| Berry       | `#9F536C` **5.35** | `#FFEEF3` + `#803D54` **6.92** |

Primary + white (sanity): Sage 10.32 · Terracotta 5.23 · Harbor 10.40 · Dusk 7.47 · Berry 7.67 — all AA.

## Should-fix — codify the light-accent rule → DONE (after the aliases pass)
Added to `specs/AUTHORING-GUIDE.md` §Judgment/Accessibility, per your steer. **Not** added to Button /
Service Pill / Status Badge: Button's `secondary` is an outline/surface variant (no white-on-accent),
and Service Pill / Status Badge are domain-token components — codifying a brand/action-accent rule there
would muddy their API, as you noted. Rule text: *an accent's visible default may sit at 400/500, but any
solid fill with white text must use `action.secondary.solid`; tonal accent text uses `on-surface-accent`;
both ≥4.5:1 per theme.*

## Should-fix — version-history patch entries → DONE
Added `| 0.1.1 | 2026-07-05 | Replace hover state language with pressed-only mobile interaction model. |`
to `button.md`, `list-row.md`, `booking-card.md`, `report-card.md`. `_TEMPLATE.md` already teaches
pressed-only via its updated **States** line (`default, pressed, …`), so new specs inherit it — no version
row on the template itself (it's the scaffold, not a versioned spec). Flag if you'd rather it carry a note.

## Q4 — `domain.role.owner` = pine.800 → UNCHANGED (you agreed)

## Nit — stale `CLAUDE-DESIGN-CONTEXT.md` → left as-is, stays blocked from Claude Design upload
Needs a full regen from live tokens (hover removed, `core` added, renumbering) — a piecemeal hover edit
would leave it stale in other ways. Tracked as a separate task; not pushed to Claude Design until regenerated.

## Review-learning captured (your rubric suggestion)
Added to `REVIEW-RUBRIC.md`: §2 checklist item — *after any alias repointing, contrast-check every
`*.solid`+`*.on` and every `*.container`+text pair per theme mode; a clean resolve ≠ AA-safe* — plus a
lessons-log row. This class of bug is mechanizable; I can add a `lint-contrast.mjs` gate (checks the
semantic fill+text pairs across all theme modes) so it can't recur — say the word and I'll build it.

## Gates (re-run after all fixes)
```
node design-system/tools/lint-tokens.mjs  → ✓ tokens clean — 538 tokens across 14 files, 0 violations
node design-system/tools/lint-specs.mjs   → ✓ specs clean — 0 errors
```

Ready for re-review. No commit / push / deploy.

## Post-re-review (metadata sync)
Re-review verdict: **READY-FOR-GOVERNOR**. Addressed the one non-blocking note — synced the top
`Version:` metadata to `0.1.1` on the four approved specs (button, list-row, booking-card, report-card)
to match their history rows. Both gates re-run clean (538 tokens · specs 0 errors).
