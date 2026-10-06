# Profile asset build

Regenerates the SVGs in `../assets`. Fonts are subset and embedded, so the cards render the same everywhere.

```bash
npm ci
python3 ascii2.py '[{"cols":110,"ramp":" .:-=+*#%@","fs":5.4,"usm":[16,260,1],"gamma":1.15,"floor":0.07}]' && cp b0.json portrait.json   # only if the photo changes
node neofetch.mjs && node cards.mjs
```

Copy lives in `neofetch.mjs` (terminal card) and `cards.mjs` (project cards, toolkit, CTA). Needs Python with fontTools and brotli.
