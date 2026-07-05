# For Claude Design — bless Decision 1 (primitive naming/tones)

The color tokens are now restructured into the **4-tier model** (`docs/token-architecture.md`) and
lint-clean — Primitives → Themes → Semantic — and the Figma variables are rebuilt to match. **The
architecture is final.** The ONLY thing open is the **labels** on the per-theme primitives.

## What we need from you
Confirm (or refine) the **family names and tone numbers** for the four alternate themes' primitives.
Two things only:
1. **Family names.** We used `‹theme›-brand`, `‹theme›-accent`, `‹theme›-neutral`. If you'd rather
   use hue names (e.g. `clay`, `olive`, `warmstone` for Terracotta), give us the old→new mapping.
2. **Tone numbers.** We auto-assigned tones by **luminance** (50 = lightest → 900 = darkest). This is
   standard (Material/Tailwind), but it means a role can land on an unexpected step — e.g. Harbor's
   `primary-hover` is *lighter* than `primary`, so hover=200 and default=400. If you want role-based
   tones instead (primary always 500, etc.), say so.

**Do NOT change** the locked hex values, the font pairings, the tier architecture, or the base
(Sage & Sand) families (`pine`/`sage`/`sand`/`ink`/`taupe`/`moss`). Values are locked; this is labels only.

## How to respond
Just reply with either "names/tones are good" **or** an old→new mapping table. Claude (Cowork) will
apply any rename across the token source **and** the Figma variables in one pass — you don't edit files.

## Current proposed mapping (tone = hex = which brand role uses it)

### Terracotta
- **terracotta-brand:** 50=#E8CABB (primary-container) · 200=#C08B6E (primary) · 400=#B07C5D (primary-hover) · 700=#8A5E48 (primary-pressed) · 900=#5E3D2B (on-primary-container)
- **terracotta-accent:** 50=#E7EFE0 (secondary-container) · 200=#7E9B6B (secondary) · 400=#5F7A4E (secondary-solid, on-surface-accent) · 700=#506B41 (secondary-hover) · 900=#3C4F2C (on-secondary-container)
- **terracotta-neutral:** 50=#F3F1EC (surface) · 100=#F1ECE6 (surface-container) · 200=#ECE6DF (outline-variant) · 300=#E9E2D9 (surface-container-high) · 400=#E0D8CF (outline) · 600=#CFC4B8 (outline-strong) · 700=#756B62 (on-surface-variant) · 800=#4A443E (on-surface-body) · 900=#2E2A26 (on-surface)

### Harbor
- **harbor-brand:** 50=#CFE3E2 (primary-container) · 200=#14535A (primary-hover) · 400=#0E3D42 (primary) · 700=#0A2E31 (on-primary-container) · 900=#092A2E (primary-pressed)
- **harbor-accent:** 50=#DCEFE5 (secondary-container) · 200=#46B36B (secondary) · 400=#268A57 (secondary-solid, on-surface-accent) · 700=#1F7449 (secondary-hover) · 900=#1B4D33 (on-secondary-container)
- **harbor-neutral:** 50=#F6F9F9 (surface) · 100=#EDF2F2 (surface-container) · 200=#E9EFEF (outline-variant) · 300=#E1E9E9 (surface-container-high) · 400=#DBE3E3 (outline) · 600=#C6D1D1 (outline-strong) · 700=#5A6867 (on-surface-variant) · 800=#33403F (on-surface-body) · 900=#14201F (on-surface)

### Dusk
- **dusk-brand:** 50=#DEE3F1 (primary-container) · 200=#4A5A8F (primary-hover) · 400=#3E4C7A (primary) · 700=#2C375C (primary-pressed) · 900=#29314F (on-primary-container)
- **dusk-accent:** 50=#F3E9D3 (secondary-container) · 200=#C9994A (secondary) · 400=#A87C30 (secondary-solid, on-surface-accent) · 700=#8F6826 (secondary-hover) · 900=#5E4413 (on-secondary-container)
- **dusk-neutral:** 50=#F7F8FB (surface) · 100=#EEF0F5 (surface-container) · 200=#E9ECF3 (outline-variant) · 300=#E2E5EE (surface-container-high) · 400=#DCE0EA (outline) · 600=#C6CBDA (outline-strong) · 700=#656B7D (on-surface-variant) · 800=#3A3F4E (on-surface-body) · 900=#1E2230 (on-surface)

### Berry
- **berry-brand:** 50=#E8DCEF (primary-container) · 200=#7D5890 (primary-hover) · 400=#6B4A7A (primary) · 700=#513860 (primary-pressed) · 900=#402C4C (on-primary-container)
- **berry-accent:** 50=#F3E0E7 (secondary-container) · 200=#B5657F (secondary) · 400=#97506A (secondary-solid, on-surface-accent) · 700=#7F4258 (secondary-hover) · 900=#6A3145 (on-secondary-container)
- **berry-neutral:** 50=#F9F6FA (surface) · 100=#F2ECF4 (surface-container) · 200=#EEE7F0 (outline-variant) · 300=#E8DEEC (surface-container-high) · 400=#E4DAE6 (outline) · 600=#D3C6D6 (outline-strong) · 700=#726879 (on-surface-variant) · 800=#453C4C (on-surface-body) · 900=#2A2230 (on-surface)

## Note
This is essentially your own Decision-1 recommendation ("per-theme hue-named tuned scale families")
already built out. If the names read fine to you, a one-line "blessed" unblocks it. Reviewer: Codex
can sanity-check; final approval is Danny's.
