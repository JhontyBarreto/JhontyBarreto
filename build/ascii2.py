import json, sys, os
from PIL import Image, ImageOps, ImageFilter, ImageEnhance
import numpy as np

SRC = '/Users/admin/seoengico-redesign/public/team/jhonty-cutout.webp'
def make(cols, ramp, gamma=1.0, floor=0.1, usm=(10, 220, 2), crop=(130, 40, 690, 760), lo=2, hi=98, ntones=6):
    im = Image.open(SRC).convert('RGBA').crop(crop)
    w, h = im.size
    rows = round(cols * (h / w) * 0.6 / 1.2)
    alpha = im.split()[-1]
    lum = im.convert('RGB').convert('L')
    lum = lum.filter(ImageFilter.UnsharpMask(radius=usm[0], percent=usm[1], threshold=usm[2]))  # local contrast: features survive
    L = np.asarray(lum.resize((cols, rows), Image.LANCZOS), dtype=float)
    A = np.asarray(alpha.resize((cols, rows), Image.BOX), dtype=float) / 255
    m = A > 0.35
    a, b = np.percentile(L[m], lo), np.percentile(L[m], hi)
    N = np.clip((L - a) / (b - a), 0, 1) ** gamma
    lines, tones = [], []
    for y in range(rows):
        lc, lt = [], []
        for x in range(cols):
            if not m[y, x]: lc.append(' '); lt.append(-1); continue
            v = floor + (1 - floor) * N[y, x]
            lc.append(ramp[min(len(ramp) - 1, int(v * len(ramp)))])
            lt.append(min(ntones - 1, int(v * ntones)))
        lines.append(lc); tones.append(lt)
    return {'cols': cols, 'rows': rows, 'lines': lines, 'tones': tones}

if __name__ == '__main__':
    cfgs = json.loads(sys.argv[1])
    TONE = ['#2f3d12', '#445b18', '#7c9e2a', '#a6d63c', '#bff747', '#e4ffb0']
    html = ['<html><head><style>@font-face{font-family:J;src:url(node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2)}body{margin:0;background:#10110d;display:flex;gap:30px;padding:20px}pre{font-family:J;line-height:1.2;margin:0}</style></head><body>']
    for i, c in enumerate(cfgs):
        fs = c.pop('fs')
        r = make(**c)
        json.dump(r, open(f'b{i}.json', 'w'))
        out = []
        for lc, lt in zip(r['lines'], r['tones']):
            out.append(''.join(f'<span style="color:{TONE[t]}">{ch.replace("&","&amp;").replace("<","&lt;")}</span>' if t >= 0 else ' ' for ch, t in zip(lc, lt)))
        html.append(f'<pre style="font-size:{fs}px">' + '\n'.join(out) + '</pre>')
    open('art.html', 'w').write(''.join(html) + '</body></html>')
