import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const C = {
  ink: '#10110d', inkSoft: '#1b1d16', charcoal: '#20221b', mossDark: '#2d3b11',
  paper: '#ffffff', offWhite: '#f7f7f1', bone: '#eeefe7', sage: '#e7ebdd',
  lime: '#bff747', limeSoft: '#d9ff87', limePale: '#effbd2', olive: '#7c9e2a', moss: '#445b18',
  muted: '#54574f', mutedSoft: '#9ea093', line: '#d7d9cf',
};

const FONTS = {
  inter: (w) => `node_modules/@fontsource/inter/files/inter-latin-${w}-normal.woff2`,
  mono: (w) => `node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${w}-normal.woff2`,
};

// Subset a font to exactly the glyphs used, so each SVG carries a few KB, not 25.
export function fontFace(family, key, weight, text) {
  const dir = mkdtempSync(join(tmpdir(), 'sub-'));
  const txt = join(dir, 't.txt'), out = join(dir, 'f.woff2');
  writeFileSync(txt, [...new Set(text + ' ')].join(''));
  execFileSync('python3', ['-m', 'fontTools.subset', FONTS[key](weight), `--text-file=${txt}`, '--flavor=woff2', `--output-file=${out}`, '--layout-features=*', '--no-hinting']);
  const b64 = readFileSync(out).toString('base64');
  return `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
}

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
