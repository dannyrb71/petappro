#!/usr/bin/env node
/**
 * PetAppro spec linter — mechanical governance guardrails for design-system/specs/*.md.
 *
 * Purpose: encode every recurring review lesson as an automated rule so the same class of
 * finding cannot reach the reviewer (Codex) or recur. Run this BEFORE handing specs to review.
 *
 * Usage:  node design-system/tools/lint-specs.mjs
 * Exit 0 = clean, exit 1 = violations.
 *
 * Rules (each traces to a real review finding):
 *   S1  No hex color literals in specs (colors must be token references).           [orig: raw literals]
 *   S2  No bare `white`/`black` used as a color value ("white-label" tier term OK,   [orig: raw white labels]
 *       and lines that declare a governed exception are exempt).
 *   S3  Every token reference resolves. WARN if a ref resolves only to a group        [orig: group-vs-leaf]
 *       (a leaf token was expected). Wildcards (`.*`, `{…}`) are skipped.
 *   S4  Acceptance/exception consistency: if a spec's body declares a "governed        [introduced-in-revision]
 *       exception", its Acceptance Criteria must NOT use the absolute forms
 *       "No literal values" / "Tokens only" (use "No undeclared literal values…").
 *   S5  Contract sections present: Objective, Requirements, Acceptance Criteria,       [contract shape]
 *       Documentation, Version history.
 *   S6  No bare primitive shorthand (`green.700`, `red.500`, `terracotta-brand.200`);   [orig: primitive shorthand]
 *       write the full `color.primitive.*` path, a semantic token, or drop the rationale.
 *   S7  No undeclared fixed dimensions (`1px`, `3px`, `11-12px`, `0.14em`, `46×28`);      [orig: fixed dimensions]
 *       use a size/spacing/radius token or a named governed exception. Token value
 *       glosses (`size.control.md` (44)) and WCAG ratios (`4.5:1`) are exempt.
 *
 * S3 group-ref warnings do NOT fail the gate but MUST be acknowledged in review
 * (REVIEW-RUBRIC.md §1) — a group ref is confirmed intentional or converted to a leaf.
 *
 * No dependencies. Node 18+.
 */

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DS = resolve(__dirname, "..");           // design-system/
const TOKENS_DIR = resolve(DS, "tokens");
const SPECS_DIR = resolve(DS, "specs");

// ---- collect valid token paths (leaves + all prefixes) ----
const leafPaths = new Set();
const allPaths = new Set();
function walkJson(dir) {
  let ents = [];
  try { ents = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    const p = resolve(dir, e.name);
    if (e.isDirectory()) walkJson(p);
    else if (e.name.endsWith(".tokens.json")) collect(JSON.parse(readFileSync(p, "utf8")));
  }
}
function collect(root) {
  (function rec(node, path) {
    for (const k of Object.keys(node)) {
      if (k.startsWith("$")) continue;
      const p = [...path, k];
      for (let i = 1; i <= p.length; i++) allPaths.add(p.slice(0, i).join("."));
      const v = node[k];
      if (v && typeof v === "object" && "$value" in v) leafPaths.add(p.join("."));
      else if (v && typeof v === "object") rec(v, p);
    }
  })(root, []);
}
walkJson(TOKENS_DIR);

// ---- gather spec files ----
function specFiles(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = resolve(dir, e.name);
    if (e.isDirectory()) specFiles(p, acc);
    // component specs are lowercase (button.md); ALL-CAPS names are guide docs (README, AUTHORING-GUIDE, CLAUDE-DESIGN-CONTEXT)
    else if (e.name.endsWith(".md") && !e.name.startsWith("_") && !/^[A-Z0-9-]+\.md$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const errors = [];
const warnings = [];
const REQUIRED_SECTIONS = ["## Objective", "## Requirements", "## Acceptance Criteria", "## Documentation", "## Version history"];
const TOKEN_NS = /\b((?:color|radius|spacing|typography|elevation|motion|size|breakpoint|comp)\.[a-zA-Z0-9._*-]+)/g;

// S6 — bare primitive shorthand (e.g. `green.700`, `red.500`, `terracotta-brand.200`) must be written
// as a full token path or removed. Family list derived from the primitive tokens so it stays in sync.
const PRIM_FAMILIES = [...allPaths].filter((p) => /^color\.primitive\.[^.]+$/.test(p)).map((p) => p.split(".")[2]);
const S6_RE = PRIM_FAMILIES.length
  ? new RegExp(`(?<!primitive\\.)\\b(${PRIM_FAMILIES.join("|")})\\.\\d{1,3}\\b`)
  : null;

for (const file of specFiles(SPECS_DIR)) {
  const rel = relative(DS, file);
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  const declaresException = /governed exception/i.test(text);

  // find the Acceptance Criteria block
  const acStart = lines.findIndex((l) => /^##\s+Acceptance Criteria/i.test(l));
  const acEnd = acStart === -1 ? -1 : lines.findIndex((l, i) => i > acStart && /^##\s/.test(l));
  const acBlock = acStart === -1 ? "" : lines.slice(acStart, acEnd === -1 ? undefined : acEnd).join("\n");

  lines.forEach((line, i) => {
    const ln = i + 1;
    // S1 — hex literals
    const hex = line.match(/#[0-9a-fA-F]{3,8}\b/g);
    if (hex) errors.push(["S1", `${rel}:${ln}`, `hex color literal(s) ${hex.join(", ")} — use a token reference`]);
    // S2 — bare white/black as color. Exempt: tier term "white-label", explanatory
    // "white/black text" (contrast prose), and lines that declare a governed exception.
    if (!/governed exception/i.test(line)) {
      const scrub = line.replace(/white-label/gi, "").replace(/\b(white|black)[- ]text\b/gi, "");
      const m = scrub.match(/\b(white|black)\b/i);
      if (m) errors.push(["S2", `${rel}:${ln}`, `bare "${m[1]}" as a color — use a semantic token (e.g. color.semantic.text.on-solid) or declare an exception`]);
    }
    // S6 — bare primitive shorthand (family.step) must be a full token path or removed
    if (S6_RE) { const s6 = line.match(S6_RE); if (s6) errors.push(["S6", `${rel}:${ln}`, `bare primitive shorthand "${s6[0]}" — write the full path "color.primitive.${s6[0]}", use a semantic token, or drop the primitive rationale`]); }
    // S7 — undeclared unit-bearing fixed dimensions (px / em / N×N / range). A dimension is OK only if
    // it's a token, a value gloss right after a size/spacing/radius token (`size.control.md` (44)), or a
    // governed exception that states a REASON ("governed exception — <reason>"). A bare "(governed
    // exception)" with no reason is rejected — the phrase alone is not a license.
    {
      const dimRe = /\b\d+(?:\.\d+)?(?:px|em)\b|\b\d+\s*[×x]\s*\d+\b|\b\d+[–-]\d+px\b/g;
      const hasExc = /governed exceptions?/i.test(line);
      const hasReason = /governed exceptions?\s*[—:-]\s*\S/i.test(line);
      let dm, flaggedNoReason = false;
      while ((dm = dimRe.exec(line))) {
        const before = line.slice(0, dm.index);
        if (/`(?:size|spacing|radius)\.[a-z0-9.\-]+`\s*\([^)]*$/i.test(before)) continue; // token value gloss
        if (hasExc) {
          if (hasReason) continue; // reasoned exception → allowed
          if (!flaggedNoReason) { errors.push(["S7", `${rel}:${ln}`, `governed exception for "${dm[0]}" states no reason — write "governed exception — <reason>" (the phrase alone is not a license)`]); flaggedNoReason = true; }
          continue;
        }
        errors.push(["S7", `${rel}:${ln}`, `undeclared fixed dimension "${dm[0]}" — use a token (size.*/spacing.*/radius.*) or a reasoned governed exception`]);
      }
    }
    // S3 — token refs resolve; warn on group refs (skip template `.{…}` / `.<placeholder>` / `.*`)
    let mt;
    TOKEN_NS.lastIndex = 0;
    while ((mt = TOKEN_NS.exec(line))) {
      const nextChar = line[mt.index + mt[0].length];
      if (mt[1].includes("*") || nextChar === "{" || nextChar === "<") continue; // wildcard / template covers leaves
      const ref = mt[1].replace(/[.`)*,]+$/, "");
      if (ref.includes("{")) continue;
      if (!allPaths.has(ref)) errors.push(["S3", `${rel}:${ln}`, `token ref "${ref}" does not resolve`]);
      else if (!leafPaths.has(ref)) warnings.push(["S3", `${rel}:${ln}`, `token ref "${ref}" is a group, not a leaf — confirm a leaf isn't required`]);
    }
  });

  // S4 — acceptance vs declared exceptions. Catch absolute forms: "no literal(s)",
  // "no literal values", "tokens only", "token-driven … no literals" — but NOT the
  // approved "no undeclared literal…" phrasing.
  if (declaresException && /\bno literal|\btokens only\b/i.test(acBlock) && !/no undeclared literal/i.test(acBlock)) {
    errors.push(["S4", rel, `spec declares governed exceptions but Acceptance Criteria still says "No literal values"/"Tokens only" — use "No undeclared literal values; all exceptions are named and reasoned"`]);
  }

  // S5 — required sections (missing section is an ERROR, per rubric §1)
  for (const s of REQUIRED_SECTIONS) if (!text.includes(s)) errors.push(["S5", rel, `missing required section "${s.replace(/^##\s+/, "")}"`]);
}

const print = (arr, label) => {
  if (!arr.length) return;
  const by = {};
  for (const [rule, loc, msg] of arr) (by[rule] ??= []).push([loc, msg]);
  for (const rule of Object.keys(by).sort()) {
    console.error(`  [${rule}] ${by[rule].length}×`);
    for (const [loc, msg] of by[rule]) console.error(`    ${loc}\n      ${msg}`);
  }
};

console.error(`spec-lint: ${specFiles(SPECS_DIR).length} specs · ${leafPaths.size} tokens`);
const warnNote = "S3 group-ref warnings do NOT block the gate, but per REVIEW-RUBRIC.md §1 each MUST be acknowledged in review (confirmed intentional or converted to a leaf). Unaddressed warnings = incomplete review.";
if (!errors.length) {
  console.log(`✓ specs clean — 0 errors`);
  if (warnings.length) { console.log(`⚠ ${warnings.length} warning(s) — require manual review:`); print(warnings); console.log(`  ${warnNote}`); }
  process.exit(0);
}
console.error(`✗ ${errors.length} error(s):`);
print(errors);
if (warnings.length) { console.error(`\n⚠ ${warnings.length} warning(s) — require manual review:`); print(warnings); console.error(`  ${warnNote}`); }
console.error(`\nRules: S1 no-hex · S2 no-bare-white/black · S6 no-primitive-shorthand · S7 no-undeclared-dims(reason req) · S3 refs-resolve(+leaf, warn) · S4 acceptance-vs-exceptions · S5 sections`);
process.exit(1);
