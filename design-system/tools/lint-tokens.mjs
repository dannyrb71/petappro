#!/usr/bin/env node
/**
 * PetAppro design-system token linter.
 *
 * The cheap, high-ROI slice of "CI" for the design system. Enforces the
 * charter's #1 Foundations rule — semantic tokens over literals — plus alias
 * integrity and naming conventions, mechanically, on every commit.
 *
 * Usage:
 *   node design-system/tools/lint-tokens.mjs               # lint all design-system/tokens/*.tokens.json
 *   node design-system/tools/lint-tokens.mjs <file...>     # lint specific file(s)
 * Exit 0 = clean, exit 1 = violations found (suitable for a pre-commit / CI gate).
 *
 * Rules enforced:
 *   R1  Semantic-layer tokens MUST alias a primitive ({...}), never a raw literal.
 *   R2  Every alias reference MUST resolve to an existing token (across all linted files).
 *   R3  Primitive-layer tokens MUST hold raw literals, never aliases (no chains up).
 *   R4  Token & group names are kebab-case (letters, digits, hyphen; scales like 100 allowed).
 *   R5  Every token carries a $type (own or inherited from an ancestor group).
 *
 * Governed exception (R1 only): a semantic token may hold a literal IF it carries
 *   "$extensions": { "ds": { "allowLiteral": "<reason>" } }
 * The reason is required and surfaced as a WARNING — exceptions stay visible and
 * reviewable, never silent. This is the escape hatch the Governor signs off on.
 *
 * No dependencies. Node 18+.
 */

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, basename } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = resolve(__dirname, "..", "tokens"); // design-system/tokens (authored source)

function discover() {
  let hits = [];
  try { hits = readdirSync(TOKENS_DIR).filter((f) => f.endsWith(".tokens.json")); } catch { /* dir absent */ }
  if (hits.length === 0) {
    console.error(`✗ No *.tokens.json found in ${TOKENS_DIR}\n  Add authored token files there, or pass a path: node lint-tokens.mjs <file>`);
    process.exit(1);
  }
  return hits.map((f) => resolve(TOKENS_DIR, f));
}

const files = process.argv.length > 2 ? process.argv.slice(2).map((p) => resolve(p)) : discover();

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/; // kebab-case; pure-number scales (100) pass
const ALIAS_RE = /^\{([^}]+)\}$/;

const errors = [];
const warnings = [];
const err = (rule, path, msg) => errors.push({ rule, path, msg });
const warn = (rule, path, msg) => warnings.push({ rule, path, msg });

const isToken = (o) => o && typeof o === "object" && "$value" in o;
const isGroup = (o) => o && typeof o === "object" && !isToken(o);

// Load every file; keep roots for walking, and a global token-path set for cross-file alias resolution.
const roots = [];
const tokenPaths = new Set();
let totalTokens = 0;

for (const file of files) {
  let root;
  try { root = JSON.parse(readFileSync(file, "utf8")); }
  catch (e) { console.error(`✗ Could not read/parse tokens file: ${file}\n  ${e.message}`); process.exit(1); }
  roots.push({ file, root });
  (function collect(node, path) {
    if (isToken(node)) { tokenPaths.add(path.join(".")); totalTokens++; return; }
    if (isGroup(node)) for (const k of Object.keys(node)) { if (!k.startsWith("$")) collect(node[k], [...path, k]); }
  })(root, []);
}

const resolveAlias = (ref) => tokenPaths.has(ref);

for (const { file, root } of roots) {
  const tag = basename(file);
  (function walk(node, path, inheritedType) {
    const type = (node && node.$type) || inheritedType;

    if (isToken(node)) {
      const p = `${tag} :: ${path.join(".")}`;
      const val = node.$value;
      const inSemantic = path.includes("semantic");
      const inPrimitive = path.includes("primitive");
      const aliasMatch = typeof val === "string" && ALIAS_RE.exec(val.trim());

      if (!type) err("R5", p, "token has no $type (own or inherited)");

      if (inSemantic && !aliasMatch) {
        const allow = node.$extensions?.ds?.allowLiteral;
        if (allow) warn("R1", p, `literal allowed by governed exception — reason: ${allow}`);
        else err("R1", p, `semantic token must alias a primitive, found literal ${JSON.stringify(val)}`);
      }
      if (inPrimitive && aliasMatch) err("R3", p, `primitive token must be a raw literal, found alias ${val}`);
      if (aliasMatch && !resolveAlias(aliasMatch[1])) err("R2", p, `alias ${val} does not resolve to an existing token`);
      return;
    }

    if (isGroup(node)) {
      for (const k of Object.keys(node)) {
        if (k.startsWith("$")) continue;
        if (!NAME_RE.test(k)) err("R4", `${tag} :: ${[...path, k].join(".")}`, `name "${k}" is not kebab-case`);
        walk(node[k], [...path, k], type);
      }
    }
  })(root, [], undefined);
}

const printWarnings = () => {
  if (!warnings.length) return;
  console.log(`\n⚠ ${warnings.length} governed exception(s):`);
  for (const w of warnings) console.log(`    [${w.rule}] ${w.path}\n      ${w.msg}`);
};

if (errors.length === 0) {
  console.log(`✓ tokens clean — ${totalTokens} tokens across ${files.length} file(s), 0 violations`);
  for (const { file } of roots) console.log(`  ${basename(file)}`);
  printWarnings();
  process.exit(0);
}

console.error(`✗ ${errors.length} violation(s) across ${files.length} file(s)\n`);
const byRule = {};
for (const e of errors) (byRule[e.rule] ??= []).push(e);
for (const rule of Object.keys(byRule).sort()) {
  console.error(`  [${rule}] ${byRule[rule].length}×`);
  for (const e of byRule[rule]) console.error(`    ${e.path}\n      ${e.msg}`);
}
console.error(`\nRules: R1 semantic-must-alias · R2 alias-must-resolve · R3 primitive-must-be-literal · R4 kebab-case · R5 has-$type`);
printWarnings();
process.exit(1);
