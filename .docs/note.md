## Root:

https://drive.google.com/drive/u/1/folders/1IgRoYo7RsVF29eIaBf0fEd-e5rcz15Hy

## Mini-Project:

https://drive.google.com/drive/u/1/folders/1bCSiBU5bCYXvV1-FkQOzDbD6C0zFXhx4

## Github:

https://github.com/drsanti/kmutt-non-degree-2025

https://github.com/drsanti/non-deegree-workshops-2025

https://drsanti.github.io/kmutt-non-degree-2025/

Local full site mirror (TOC + materials + results):

- `d:\temp\downloads\kmutt-non-degree-2025` (git clone, can `git pull`)
- `d:\temp\downloads\nd-68\kmutt-non-degree-2025` (copy ใน workspace)

## Results landing (local / deploy target)

Local: `results/index.html`

GitHub Pages target (do **not** overwrite root course TOC `index.html`):

https://drsanti.github.io/kmutt-non-degree-2025/results/

Deploy into `kmutt-non-degree-2025` as siblings (same relative links as local):

```text
index.html                 ← TOC สื่อเรียนเดิม (ไม่แตะ)
nd2025/...
results/
  index.html               ← หน้าสรุปผล
  styles.css
ND01-68/presentation/
ND02-68/presentation/
ND03-68/presentation/
```

Preview locally:

```bash
python -m http.server 8765 --directory .
# then open http://localhost:8765/results/
```

## PDF exports

https://drsanti.github.io/kmutt-non-degree-2025/exports/

- results.pdf
- ND01-68.pdf / ND02-68.pdf / ND03-68.pdf

## Docs & scripts (in repo)

- `.docs/` — notes + participant workbook
- `scripts/` — PDF export (`npm run export`)
