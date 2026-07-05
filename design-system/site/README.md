# Design system — browsable reference bundle

**This is NOT the source of truth.** It's a self-contained, browsable render of the system —
live HTML specimens, the build playbook, the readable charter, and the guidelines — kept intact
so its internal links work. Open any file under `previews/` in a browser to see tokens rendered.

- **Source of truth** is `design-system/tokens/*.tokens.json` (DTCG). The `tokens/*.css` +
  `styles.css` here are a **hand-mirror** of those tokens so the HTML renders — design with the
  JSON; the CSS follows. Do not treat this CSS as authoritative.
- **Contents:** `previews/` (foundations · icons · token-cascade), `playbook/` (Foundations, Atoms
  build prompts), `guidelines/accessibility.html`, `governance/charter.html` (readable copy of the
  canonical PDF), `assets/` (logo + mark).
- **CSS cascade:** reference → system → component-tokens → themes → business-logic → aliases → components.

When the tokens change, this mirror must be regenerated (or hand-updated) to match. Once the build
step exists, this folder becomes generated output.
