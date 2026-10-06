import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import * as si from 'simple-icons';
import { C, fontFace, esc } from './lib.mjs';

const M = JSON.parse(readFileSync('inter-metrics.json', 'utf8'));
const measure = (s, fs, w = 400, ls = 0) => [...s].reduce((a, ch) => a + (M[w][ch] ?? 0.6) * fs, 0) + ls * fs * Math.max(0, s.length - 1);
const wrap = (s, max, fs, w) => {
  const lines = []; let cur = '';
  for (const word of s.split(' ')) {
    const next = cur ? cur + ' ' + word : word;
    if (measure(next, fs, w) > max && cur) { lines.push(cur); cur = word; } else cur = next;
  }
  return [...lines, cur];
};
const lucide = (name) => readFileSync(`node_modules/lucide-static/icons/${name}.svg`, 'utf8').replace(/\n/g, '').replace(/.*?<svg[^>]*>/, '').replace(/<\/svg>.*/, '');

const THEMES = {
  light: {
    bg: C.paper, border: C.line, title: C.ink, kicker: C.olive, body: C.muted, chipBg: C.offWhite, chipBorder: C.line, chipText: C.muted,
    pillBg: C.limePale, pillBorder: '#d6eea0', pillText: C.moss, dot: C.olive, link: C.moss, tileBg: C.offWhite, tileBorder: C.line, icon: C.ink, label: C.muted, eyebrow: C.olive, rule: C.line,
  },
  dark: {
    bg: '#15170f', border: '#2a2d23', title: C.offWhite, kicker: C.lime, body: '#b9bcae', chipBg: C.charcoal, chipBorder: '#2f3228', chipText: C.mutedSoft,
    pillBg: 'rgba(191,247,71,.10)', pillBorder: 'rgba(191,247,71,.25)', pillText: C.limeSoft, dot: C.lime, link: C.lime, tileBg: '#1a1c15', tileBorder: '#2a2d23', icon: C.offWhite, label: C.mutedSoft, eyebrow: C.lime, rule: '#2a2d23',
  },
};

mkdirSync('../assets', { recursive: true });
const MONO = `font-family:JBM,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace`;
const SANS = `font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`;

// ---------- project cards ----------
const PROJECTS = [
  {
    slug: 'gafferly', icon: 'truck', pill: 'LIVE', live: true, title: 'Gafferly', kicker: 'Field-service CRM for UK trades',
    body: 'Quotes, jobs, diary and payments in one place. Stripe invoicing, one-click Xero sync, two-way SMS, signed job sheets and route planning.',
    tags: ['Next.js', 'Turso', 'Stripe', 'Xero'], link: 'gafferly.com',
  },
  {
    slug: 'aeo-auditor', icon: 'scan-search', pill: 'OPEN SOURCE', title: 'AEO Auditor', kicker: 'Lighthouse, but for AI agents',
    body: 'Scores how well AI coding agents can read a site: llms.txt, robots rules for 15 AI crawlers, token budgets and structured data. Then it writes the fix files for you.',
    tags: ['TypeScript', 'CLI', 'llms.txt', 'AEO'], link: 'github.com/JhontyBarreto/aeo-auditor',
  },
  {
    slug: 'linkbuild-blog', icon: 'pen-line', pill: 'OPEN SOURCE', title: 'linkbuild-blog', kicker: 'Claude Code skill for guest posts',
    body: 'Finds real statistics, cites the primary source, places one natural backlink, then edits out the AI tells. Built so every post gets past a host editor.',
    tags: ['Claude Code', 'Agent skill', 'E-E-A-T'], link: 'github.com/JhontyBarreto/linkbuild-blog',
  },
  {
    slug: 'ops-portal', icon: 'layout-dashboard', pill: 'IN PRODUCTION', title: 'Agency Ops Portal', kicker: 'The back office behind SEO Engico',
    body: 'Client portal with Stripe invoicing, time tracking, onboarding guides and monthly SEO reports built from GA4, Search Console and Ahrefs data.',
    tags: ['Next.js', 'Stripe', 'GA4 API', 'GSC API'], link: 'private repo',
  },
];

const CW = 440, CH = 272, PAD = 28;
for (const p of PROJECTS) {
  for (const [mode, t] of Object.entries(THEMES)) {
    const bodyLines = wrap(p.body, CW - PAD * 2, 14, 400);
    
    const pillW = measure(p.pill, 10.5, 700, 0.08) + (p.live ? 30 : 22);
    const chips = []; let cx = PAD;
    for (const tag of p.tags) {
      const w = tag.length * 11 * 0.6 + 18;
      chips.push(`<rect x="${cx}" y="${CH - 52}" width="${w}" height="24" rx="12" fill="${t.chipBg}" stroke="${t.chipBorder}"/><text x="${cx + w / 2}" y="${CH - 36}" text-anchor="middle" class="mono" fill="${t.chipText}">${esc(tag)}</text>`);
      cx += w + 6;
    }
    const monoText = p.tags.join('');
    const linked = p.link !== 'private repo';
    const linkW = measure(p.link, 12, 500);
    const css = [
      fontFace('Inter', 'inter', 400, p.body + p.link + 'View on GitHub private repo'),
      fontFace('Inter', 'inter', 600, p.kicker),
      fontFace('Inter', 'inter', 700, p.pill),
      fontFace('Inter', 'inter', 800, p.title),
      fontFace('JBM', 'mono', 400, monoText),
      `.s{${SANS}}.mono{${MONO};font-size:11px}`,
    ].join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${CH}" viewBox="0 0 ${CW} ${CH}" role="img" aria-labelledby="t d">
<title id="t">${esc(p.title)}: ${esc(p.kicker)}</title><desc id="d">${esc(p.body)}</desc>
<defs><style>${css}</style>
<linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7ffe4"/><stop offset=".28" stop-color="#dfff8e"/><stop offset=".58" stop-color="${C.lime}"/><stop offset="1" stop-color="#8ebb24"/></linearGradient></defs>
<rect x=".5" y=".5" width="${CW - 1}" height="${CH - 1}" rx="28" fill="${t.bg}" stroke="${t.border}"/>
<rect x="${PAD}" y="${PAD}" width="44" height="44" rx="14" fill="url(#lg)"/>
<g transform="translate(${PAD + 10} ${PAD + 10})" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${lucide(p.icon)}</g>
<rect x="${CW - PAD - pillW}" y="${PAD + 9}" width="${pillW}" height="26" rx="13" fill="${t.pillBg}" stroke="${t.pillBorder}"/>
${p.live ? `<circle cx="${CW - PAD - pillW + 14}" cy="${PAD + 22}" r="3.5" fill="${t.dot}"><animate attributeName="opacity" values="1;.25;1" dur="2.4s" repeatCount="indefinite"/></circle>` : ''}
<text x="${CW - PAD - pillW / 2 + (p.live ? 6 : 0)}" y="${PAD + 26}" text-anchor="middle" class="s" font-size="10.5" font-weight="700" letter-spacing=".84" fill="${t.pillText}">${esc(p.pill)}</text>
<text x="${PAD}" y="${PAD + 84}" class="s" font-size="25" font-weight="800" letter-spacing="-.75" fill="${t.title}">${esc(p.title)}</text>
<text x="${PAD}" y="${PAD + 106}" class="s" font-size="13.5" font-weight="600" fill="${t.kicker}">${esc(p.kicker)}</text>
${bodyLines.map((l, i) => `<text x="${PAD}" y="${PAD + 134 + i * 21}" class="s" font-size="14" fill="${t.body}">${esc(l)}</text>`).join('\n')}
${chips.join('\n')}
${linked ? `<text x="${CW - PAD - 16}" y="${CH - 36}" text-anchor="end" class="s" font-size="12" font-weight="400" fill="${t.link}">${esc(p.link.startsWith('github') ? 'View on GitHub' : p.link)}</text><g transform="translate(${CW - PAD - 13} ${CH - 47}) scale(.55)" fill="none" stroke="${t.link}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${lucide('arrow-up-right')}</g>` : `<text x="${CW - PAD}" y="${CH - 36}" text-anchor="end" class="s" font-size="12" fill="${t.chipText}">private repo</text>`}
</svg>`;
    if (bodyLines.length > 3) console.warn('!! body overflow', p.slug, bodyLines.length);
    if (cx > CW - PAD - (linked ? 70 : 80)) console.warn('!! chips crowd link', p.slug, cx);
    writeFileSync(`../assets/card-${p.slug}-${mode}.svg`, svg);
  }
}

// ---------- toolkit ----------
const GROUPS = [
  ['Build', ['TypeScript', 'typescript'], ['Next.js', 'nextdotjs'], ['React', 'react'], ['Tailwind', 'tailwindcss'], ['Node.js', 'nodedotjs'], ['Python', 'python'], ['Turso', 'turso'], ['SQLite', 'sqlite'], ['Stripe', 'stripe'], ['Xero', 'xero']],
  ['Ship', ['Cloudflare', 'cloudflare'], ['Render', 'render'], ['Netlify', 'netlify'], ['Actions', 'githubactions'], ['Claude', 'claude'], ['MCP', 'modelcontextprotocol'], ['Puppeteer', 'puppeteer'], ['Resend', 'resend']],
  ['Measure', ['GA4', 'googleanalytics'], ['GTM', 'googletagmanager'], ['Search Console', 'googlesearchconsole'], ['Google Ads', 'googleads'], ['Meta CAPI', 'meta'], ['WordPress', 'wordpress']],
];
const TW = 900, LBL = 118, TILE = 52, STEP = 76.5, ROW_H = 96, TOP = 22;
const TH = TOP + GROUPS.length * ROW_H + 4;
for (const [mode, t] of Object.entries(THEMES)) {
  let labels = '', eyebrows = '';
  const rows = GROUPS.map(([name, ...items], r) => {
    const y = TOP + r * ROW_H;
    eyebrows += name.toUpperCase();
    const tiles = items.map(([label, slug], i) => {
      const ic = si['si' + slug[0].toUpperCase() + slug.slice(1)];
      const x = LBL + i * STEP;
      labels += label;
      return `<rect x="${x}" y="${y}" width="${TILE}" height="${TILE}" rx="15" fill="${t.tileBg}" stroke="${t.tileBorder}"/>
<g transform="translate(${x + 14} ${y + 14}) scale(${24 / 24})"><path d="${ic.path}" fill="${t.icon}"/></g>
<text x="${x + TILE / 2}" y="${y + TILE + 18}" text-anchor="middle" class="s" font-size="11" fill="${t.label}">${esc(label)}</text>`;
    }).join('\n');
    const sep = r ? `<line x1="0" y1="${y - 14}" x2="${TW}" y2="${y - 14}" stroke="${t.rule}" stroke-dasharray="2 5"/>` : '';
    return `${sep}<text x="0" y="${y + 31}" class="mono" font-size="11.5" letter-spacing="1.4" fill="${t.eyebrow}">${name.toUpperCase()}</text>\n${tiles}`;
  }).join('\n');
  const css = [fontFace('Inter', 'inter', 400, labels), fontFace('JBM', 'mono', 700, eyebrows), `.s{${SANS}}.mono{${MONO};font-weight:700}`].join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="${TH}" viewBox="0 0 ${TW} ${TH}" role="img" aria-labelledby="t">
<title id="t">Toolkit: ${GROUPS.map(([n, ...i]) => n + ': ' + i.map((x) => x[0]).join(', ')).join('. ')}</title>
<defs><style>${css}</style></defs>
${rows}
</svg>`;
  writeFileSync(`../assets/toolkit-${mode}.svg`, svg);
}

// ---------- CTA (dark card, reads on both themes) ----------
{
  const W = 900, H = 284, P = 44;
  const eyebrow = 'WORK WITH SEO ENGICO';
  const h1 = 'Links that stay live.', h2 = 'Search you can put a revenue number on.';
  const body = 'B2B SEO and link building. We install the measurement before we touch anything else.';
  const btn = 'Book a search performance audit';
  const btnW = measure(btn, 15, 700) + 64;
  const css = [
    fontFace('JBM', 'mono', 700, eyebrow),
    fontFace('Inter', 'inter', 900, h1 + h2),
    fontFace('Inter', 'inter', 400, body + 'seoengico.com'),
    fontFace('Inter', 'inter', 700, btn),
    `.s{${SANS}}.mono{${MONO};font-weight:700}`,
  ].join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
<title id="t">${esc(h1 + ' ' + h2 + ' ' + body + ' ' + btn + ' at seoengico.com')}</title>
<defs><style>${css}</style>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.ink}"/><stop offset=".45" stop-color="${C.inkSoft}"/><stop offset="1" stop-color="${C.mossDark}"/></linearGradient>
<linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7ffe4"/><stop offset=".28" stop-color="#dfff8e"/><stop offset=".58" stop-color="${C.lime}"/><stop offset="1" stop-color="#8ebb24"/></linearGradient>
<pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="${C.lime}" stroke-opacity=".05"/></pattern>
</defs>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="32" fill="url(#bg)" stroke="#2a2d23"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="32" fill="url(#grid)"/>
<text x="${P}" y="${P + 12}" class="mono" font-size="11.5" letter-spacing="1.6" fill="${C.lime}">${eyebrow}</text>
<text x="${P}" y="${P + 52}" class="s" font-size="32" font-weight="900" letter-spacing="-1.4" fill="${C.offWhite}">${esc(h1)}</text>
<text x="${P}" y="${P + 90}" class="s" font-size="32" font-weight="900" letter-spacing="-1.4" fill="${C.offWhite}" fill-opacity=".55">${esc(h2)}</text>
<text x="${P}" y="${P + 124}" class="s" font-size="15" fill="#b9bcae">${esc(body)}</text>
<rect x="${P}" y="${H - P - 44}" width="${btnW}" height="44" rx="18" fill="url(#lg)"/>
<text x="${P + 22}" y="${H - P - 17}" class="s" font-size="15" font-weight="700" fill="${C.ink}">${esc(btn)}</text>
<g transform="translate(${P + btnW - 36} ${H - P - 32}) scale(.8)" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${lucide('arrow-up-right')}<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;2 -2;0 0" dur="2.8s" repeatCount="indefinite"/></g>
<text x="${W - P}" y="${H - P - 17}" text-anchor="end" class="s" font-size="13" fill="${C.mutedSoft}">seoengico.com</text>
</svg>`;
  writeFileSync('../assets/cta.svg', svg);
}
console.log('cards, toolkit, cta written');
