#!/usr/bin/env node
/**
 * PetAppro tonal-ramp generator (dependency-free, OKLCH).
 *
 * For each key color: convert to OKLCH, keep the hue, arc chroma (peak mid, taper at the
 * ends), and step lightness across a Material-style tone scale (0=black … 100=white).
 * Every generated color is gamut-mapped into sRGB by reducing chroma until it fits.
 *
 * Output: <outDir>/petappro-ramps.html (visual chart) + <outDir>/petappro-ramps.json (values).
 * DRAFT tool — nothing here is wired into tokens/ or Figma until approved.
 *
 * Usage: node gen-ramps.mjs <outDir>
 */
import { writeFileSync } from "node:fs";

const outDir = process.argv[2] || ".";
const TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];

// ---- color math (Björn Ottosson OKLab) ----
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const srgbToLin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const linToSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
function rgbToHex(r, g, b) { const f = (x) => Math.round(clamp01(x) * 255).toString(16).padStart(2, "0"); return "#" + f(r) + f(g) + f(b).toUpperCase(); }
function linRgbToOklab(r, g, b) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}
function oklabToLinRgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
function hexToOklch(h) {
  const [r, g, b] = hexToRgb(h).map(srgbToLin);
  const [L, a, bb] = linRgbToOklab(r, g, b);
  return { L, C: Math.hypot(a, bb), H: Math.atan2(bb, a) };
}
function inGamut(r, g, b) { return r >= -0.0005 && r <= 1.0005 && g >= -0.0005 && g <= 1.0005 && b >= -0.0005 && b <= 1.0005; }
function oklchToHex(L, C, H) {
  // reduce chroma until the color is representable in sRGB
  let c = C;
  for (let i = 0; i < 40; i++) {
    const [r, g, b] = oklabToLinRgb(L, c * Math.cos(H), c * Math.sin(H));
    if (inGamut(r, g, b)) return rgbToHex(linToSrgb(r), linToSrgb(g), linToSrgb(b));
    c *= 0.92;
  }
  const [r, g, b] = oklabToLinRgb(L, 0, 0);
  return rgbToHex(linToSrgb(r), linToSrgb(g), linToSrgb(b));
}

// ---- ramp construction ----
const hann = (t) => Math.sin((Math.PI * t) / 100); // 0 at 0/100, 1 at 50
function ramp(keyHex, { neutral = false } = {}) {
  const { H, C: C0 } = hexToOklch(keyHex);
  // preserve the key's own chroma (muted brands stay muted); gentle mid boost, gamut caps the rest
  const peak = neutral ? 0.010 : Math.min(0.15, C0 * 1.15);
  const out = {};
  for (const t of TONES) {
    const L = t / 100;
    const C = peak * hann(t);
    out[t] = oklchToHex(L, C, H);
  }
  return out;
}

// ---- key colors (from tokens/primitives + DECISION-1 bless doc) ----
const THEMES = {
  "Sage & Sand": { primary: "#37695D", secondary: "#7FA05A", neutral: "#B7AC98" },
  "Terracotta":  { primary: "#C08B6E", secondary: "#7E9B6B", neutral: "#BDB3A8" },
  "Harbor":      { primary: "#0E3D42", secondary: "#268A57", neutral: "#AEB9B9" },
  "Dusk":        { primary: "#3E4C7A", secondary: "#A87C30", neutral: "#B4B7C2" },
  "Berry":       { primary: "#6B4A7A", secondary: "#97506A", neutral: "#B9B0BD" },
};
const STATUS = { Error: "#C05A45", Success: "#6E9247", Warning: "#C98A3C", Info: "#4C8A86" };

// suggested semantic anchors (which tone backs which role)
const ANCHORS = "primary 40 · hover 30 · pressed 20 · container 90 · on-container 20 · surface 99 · outline (neutral) 50 · on-surface (neutral) 20";

// ---- build data ----
const data = { tones: TONES, themes: {}, status: {}, anchors: ANCHORS };
for (const [name, roles] of Object.entries(THEMES)) {
  data.themes[name] = {
    Primary: ramp(roles.primary),
    Secondary: ramp(roles.secondary),
    Neutral: ramp(roles.neutral, { neutral: true }),
  };
}
for (const [name, hex] of Object.entries(STATUS)) data.status[name] = ramp(hex);

// ---- HTML render ----
const cell = (hex, t) => {
  const { L } = hexToOklch(hex);
  const fg = L > 0.62 ? "#1a1a1a" : "#ffffff";
  return `<td style="background:${hex};color:${fg}"><b>${t}</b><span>${hex}</span></td>`;
};
const rampRow = (label, r) => `<tr><th>${label}</th>${TONES.map((t) => cell(r[t], t)).join("")}</tr>`;
let body = "";
for (const [name, roles] of Object.entries(data.themes)) {
  body += `<h2>${name}</h2><table><thead><tr><th></th>${TONES.map((t) => `<td class="hd">${t}</td>`).join("")}</tr></thead><tbody>`;
  for (const [role, r] of Object.entries(roles)) body += rampRow(role, r);
  body += `</tbody></table>`;
}
body += `<h2>Status / System <small>(shared across themes)</small></h2><table><thead><tr><th></th>${TONES.map((t) => `<td class="hd">${t}</td>`).join("")}</tr></thead><tbody>`;
for (const [name, r] of Object.entries(data.status)) body += rampRow(name, r);
body += `</tbody></table>`;

const html = `<!doctype html><meta charset="utf-8"><title>PetAppro Tonal Ramps — draft</title>
<style>
body{font:14px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;margin:32px;color:#1a1a1a;background:#fafafa}
h1{margin:0 0 4px} .sub{color:#666;margin:0 0 24px}
h2{margin:28px 0 8px;font-size:17px} h2 small{color:#888;font-weight:400}
table{border-collapse:separate;border-spacing:3px;margin-bottom:8px}
th{width:80px;text-align:right;padding-right:10px;font-weight:600;font-size:12px;color:#333}
td.hd{width:64px;text-align:center;color:#999;font-size:11px;background:none}
td{width:64px;height:52px;border-radius:6px;text-align:center;vertical-align:middle;font-size:10px;line-height:1.3}
td b{display:block;font-size:12px} td span{opacity:.85;font-size:9px}
.legend{background:#fff;border:1px solid #eee;border-radius:8px;padding:12px 16px;margin:8px 0 20px;font-size:13px;color:#444}
.legend code{background:#f2f2f2;padding:1px 5px;border-radius:4px}
</style>
<h1>PetAppro — Tonal Ramps (OKLCH draft)</h1>
<p class="sub">Full 0→100 tonal palettes generated from source key colors. Perceptually even, gamut-safe. Not all tones need be used — semantic roles pull the tones they need.</p>
<div class="legend"><b>Suggested anchors:</b> <code>${ANCHORS}</code></div>
${body}`;

writeFileSync(`${outDir}/petappro-ramps.html`, html);
writeFileSync(`${outDir}/petappro-ramps.json`, JSON.stringify(data, null, 2));
console.log("wrote petappro-ramps.html + .json to", outDir);
