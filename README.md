# KMUTT Non-Degree 2025

ศูนย์รวมสื่อเรียนและรายงานผลการดำเนินงานหลักสูตร Non-Degree
มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี
ภาควิชาวิศวกรรมระบบควบคุมและเครื่องมือวัด · คณะวิศวกรรมศาสตร์

## Live site

- Hub: https://drsanti.github.io/kmutt-non-degree-2025/
- Results: https://drsanti.github.io/kmutt-non-degree-2025/results/

## Courses

| Code | Focus | Materials | Outcomes |
|------|--------|-----------|----------|
| ND00 | Program overview | `/nd2025/nd00/` | — |
| ND01 | Industrial IoT Devices | `/nd2025/nd01/` | `/ND01-68/presentation/` |
| ND02 | Full-Stack for Industrial Automation | `/nd2025/nd02/` | `/ND02-68/presentation/` |
| ND03 | Digital Twin & OPC-UA | `/nd2025/nd03/` | `/ND03-68/presentation/` |

## Repository structure

```text
index.html                 # Program hub (materials + outcomes entry)
site.css                   # Hub styles
results/                   # Portfolio outcomes landing
ND01-68/presentation/      # ND01 outcome presentation
ND02-68/presentation/      # ND02 outcome presentation
ND03-68/presentation/      # ND03 outcome presentation
nd2025/                    # Interactive course materials
```

## Local preview

```bash
python -m http.server 8765 --directory .
# open http://localhost:8765/
```

## Deploy

Push to `main` on GitHub Pages. Do not replace course materials under `nd2025/` when updating outcomes pages.
