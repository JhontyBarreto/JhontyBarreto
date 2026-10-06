import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { C, fontFace, esc } from './lib.mjs';

const art = JSON.parse(readFileSync(process.env.INJ || 'portrait.json', 'utf8'));
const TONES = (process.env.TONES || '#2f3d12,#445b18,#7c9e2a,#a6d63c,#bff747,#e4ffb0').split(',');

const W = 900;
const ART_FS = +(process.env.ART_FS || 5.4), ART_LH = ART_FS * 1.2, ART_X = 28, ART_Y = 66;
const INFO_X = 396, INFO_Y = 76, INFO_FS = 13, INFO_LH = 17.4;
const KEY_W = 17;

const info = [
  ['head'],
  ['rule'],
  ['Name', 'Jhonty Barreto'],
  ['Role', 'Co-founder, SEO Engico'],
  ['Trained.As', 'Mechanical engineer'],
  ['Work', 'B2B SEO and link building'],
  ['Measured.On', 'Revenue, not rankings'],
  ['Uptime', '7+ years in link building'],
  [],
  ['section', 'Proof'],
  ['Links.Placed', '65,904, every one by hand'],
  ['Clients', '190+, plus 20+ agency partners'],
  ['Still.Live', '94% at twelve months'],
  [],
  ['section', 'Stack'],
  ['Languages', 'TypeScript, Python, SQL'],
  ['Web', 'Next.js, React, Tailwind, Node'],
  ['Data', 'Turso, libSQL, SQLite, R2'],
  ['Infra', 'Render, Cloudflare, Netlify'],
  ['Payments', 'Stripe, Xero, NMI, Square'],
  ['Tracking', 'GA4, GTM, Search Console, CAPI'],
  ['AI', 'Claude API, MCP, agent skills'],
  [],
  ['section', 'Contact'],
  ['Agency', 'seoengico.com'],
  ['Product', 'gafferly.com'],
];

const RULE_LEN = 46;
let monoText = 'jhonty@seoengico: ~ %-_█';
const rows = [];
info.forEach((r, i) => {
  const y = INFO_Y + i * INFO_LH;
  if (!r.length) return;
  if (r[0] === 'head') {
    rows.push(`<text x="${INFO_X}" y="${y}" class="m b"><tspan fill="${C.lime}">jhonty</tspan><tspan fill="${C.mutedSoft}">@</tspan><tspan fill="${C.offWhite}">seoengico</tspan></text>`);
  } else if (r[0] === 'rule') {
    rows.push(`<text x="${INFO_X}" y="${y}" class="m" fill="${C.muted}">${'-'.repeat(16)}</text>`);
  } else if (r[0] === 'section') {
    const s = `- ${r[1]} `;
    monoText += s;
    rows.push(`<text x="${INFO_X}" y="${y}" class="m" fill="${C.mutedSoft}">${esc(s)}<tspan fill="${C.muted}">${'-'.repeat(RULE_LEN - s.length)}</tspan></text>`);
  } else {
    const [k, v] = r;
    const dots = ' ' + '.'.repeat(KEY_W - k.length - 1) + ' ';
    monoText += k + dots + v;
    rows.push(`<text x="${INFO_X}" y="${y}" class="m" xml:space="preserve"><tspan fill="${C.lime}">${esc(k)}</tspan><tspan fill="${C.moss}">${dots}</tspan><tspan fill="${C.offWhite}">${esc(v)}</tspan></text>`);
  }
});

// ASCII portrait: one <text> per row, runs of the same tone collapsed into a tspan.
const artRows = art.lines.map((chars, y) => {
  const tones = art.tones[y];
  let out = '', run = '', tone = -1;
  const flush = () => { if (run) out += tone < 0 || run.trim() === '' ? esc(run) : `<tspan fill="${TONES[tone]}">${esc(run)}</tspan>`; run = ''; };
  chars.forEach((ch, x) => {
    const t = ch === ' ' ? -1 : tones[x];
    if (t !== tone && !(ch === ' ' && run.trim() === '')) { flush(); tone = t; }
    if (ch === ' ' && tone !== -1) { flush(); tone = -1; }
    run += ch;
  });
  flush();
  monoText += chars.join('');
  const len = (art.cols * ART_FS * 0.6).toFixed(2);
  return `<text x="${ART_X}" y="${(ART_Y + (y + 1) * ART_LH).toFixed(2)}" class="a" xml:space="preserve" textLength="${len}" lengthAdjust="spacingAndGlyphs">${out}</text>`;
});

const artBottom = ART_Y + art.rows * ART_LH;
const infoBottom = INFO_Y + (info.length - 1) * INFO_LH;
const SW_Y = Math.max(artBottom, infoBottom) + 26;
const PROMPT_Y = SW_Y + 44;
const H = PROMPT_Y + 28;

const swatches = [C.ink, C.charcoal, C.moss, C.olive, C.lime, C.limeSoft, C.sage, C.bone, C.offWhite]
  .map((c, i) => `<rect x="${INFO_X + i * 28}" y="${SW_Y - 14}" width="24" height="16" rx="3" fill="${c}" stroke="#2c2f25" stroke-width="1"/>`).join('');

const prompt = 'jhonty@seoengico ~ % ';
const promptW = prompt.length * INFO_FS * 0.6;

const css = [
  fontFace('JBM', 'mono', 400, monoText),
  fontFace('JBM', 'mono', 700, 'jhonty@seoengico'),
  `.m{font-family:JBM,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:${INFO_FS}px;}`,
  `.b{font-weight:700;}`,
  `.a{font-family:JBM,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:${ART_FS}px;fill:${TONES[0]};}`,
  `.t{font-family:JBM,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;fill:${C.mutedSoft};}`,
].join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">
<title id="title">jhonty@seoengico</title>
<desc id="desc">ASCII portrait of Jhonty Barreto beside a terminal-style profile. Co-founder of SEO Engico, mechanical engineer, B2B SEO and link building measured on revenue. 65,904 links placed by hand, 190+ clients, 94% of links still live at twelve months. Stack: TypeScript, Next.js, Turso, Stripe, Cloudflare, Claude API.</desc>
<defs>
<style>${css}</style>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${C.ink}"/><stop offset=".55" stop-color="${C.inkSoft}"/><stop offset="1" stop-color="#1f2a0c"/>
</linearGradient>
<radialGradient id="glow" cx=".2" cy=".45" r=".45">
<stop offset="0" stop-color="${C.lime}" stop-opacity=".07"/><stop offset="1" stop-color="${C.lime}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="22" fill="url(#bg)" stroke="#2a2d23"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="22" fill="url(#glow)"/>
<circle cx="26" cy="22" r="5.5" fill="#3a3d33"/><circle cx="44" cy="22" r="5.5" fill="#3a3d33"/><circle cx="62" cy="22" r="5.5" fill="#3a3d33"/>
<text x="${W / 2}" y="26" text-anchor="middle" class="t">jhonty@seoengico: ~</text>
<line x1="0" y1="44" x2="${W}" y2="44" stroke="#24271e"/>
<g>${artRows.join('\n')}</g>
<g>${rows.join('\n')}</g>
${swatches}
<text x="${ART_X}" y="${PROMPT_Y}" class="m"><tspan fill="${C.lime}">jhonty@seoengico</tspan><tspan fill="${C.mutedSoft}"> ~ %</tspan></text>
<rect x="${ART_X + promptW}" y="${PROMPT_Y - 12}" width="8" height="15" fill="${C.lime}"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="1.1s" repeatCount="indefinite"/></rect>
</svg>
`;
mkdirSync('../assets', { recursive: true });
writeFileSync(process.env.OUT || '../assets/neofetch.svg', svg);
console.log('neofetch', W, 'x', H, (svg.length / 1024).toFixed(1) + 'KB');
