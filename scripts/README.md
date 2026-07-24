# PDF Export

Export `ND01-68` / `ND02-68` / `ND03-68` presentations and `results/` to **A4 landscape** PDFs.

## Setup (once)

```bash
cd scripts
npm install
```

## Run

```bash
# all four PDFs → ../exports/
npm run export

# selected targets
node export-pdf.mjs --only ND01,results
node export-pdf.mjs --only ND02,ND03

# custom output folder / animation settle wait
node export-pdf.mjs --out ../exports --wait 900
```

## Output

| Target | File |
|--------|------|
| ND01 presentation | `exports/ND01-68.pdf` |
| ND02 presentation | `exports/ND02-68.pdf` |
| ND03 presentation | `exports/ND03-68.pdf` |
| results landing | `exports/results.pdf` |

Presentations are captured slide-by-slide (16:9 deck fitted onto A4 landscape).  
`results` uses Chromium print-to-PDF (A4 landscape, multi-page).
