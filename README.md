# Ritwik Jain — portfolio

**Live:** https://ritwik389.github.io/portfolio/

Personal site of Ritwik Jain, an undergraduate researcher at Delhi Technological University working on vision-language reasoning for SAR remote sensing, speech separation and evidence-grounded LLM systems.

It has two themes, *paper* (light) and *lab* (dark), and a second interface: press <kbd>`</kbd> or open **`ritwik.ipynb`** to browse the same portfolio as a runnable notebook.

```text
In [1]: ritwik.projects()
In [2]: ritwik.eval("digital-twin")
In [3]: !nvidia-smi
```

## Stack
Next.js 16 (static export) · React 18 · TypeScript · Motion 14 · Lenis · Spline runtime · hand-written CSS with design tokens.

## Develop
Requires Node.js 22+.

```sh
npm install
npm run dev            # http://localhost:3000
```

Check before pushing:

```sh
npm run lint && npm run typecheck && npm test
PORTFOLIO_STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/portfolio npm run build
PORT=4319 NEXT_PUBLIC_BASE_PATH=/portfolio npm run start:static   # serves out/ at /portfolio
```

## Where things live
| Path | What |
|---|---|
| `lib/data.ts` | **All content.** Profile, research, projects, experience, awards. Edit this to update the site *and* the notebook. |
| `lib/notebook.ts` | Notebook kernel: a whitelisted command interpreter (no `eval`), unit-tested in `tests/notebook.test.mjs`. |
| `components/sections/` | Page sections (Hero, Research, Work, Experience, About). |
| `components/notebook/` | Notebook UI, lazy-loaded on first open. |
| `components/fun/` | Training-run HUD, Konami code, toasts. |
| `components/fx/` | Procedural visuals: SAR speckle, sea-ice schematic, VoiceSep waveforms. |
| `app/tokens.css`, `app/globals.css` | Design tokens for both themes, plus all styles. |
| `public/Ritwik_Jain_Resume.pdf` | Published résumé (phone redacted). |

## Deploy
Every push to `main` builds and deploys to GitHub Pages through `.github/workflows/deploy-pages.yml`, after lint, typecheck and tests pass. A weekly scheduled run refreshes the coding-ratings snapshot. In the repository settings, Pages → Source must be set to **GitHub Actions**.

The contact form posts to Web3Forms from the browser. The access key is a public identifier and can be overridden with the `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` repository variable.

See `DESIGN.md` for design decisions and `THIRD_PARTY_NOTICES.md` for asset sources and licenses.
