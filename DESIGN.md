# Design notes

## Positioning
An undergraduate **researcher** in multimodal AI, not a generic full-stack developer. Research leads the page, followed by evaluated systems, then experience. Every number on the page comes from the résumé or a public repository README. Unpublished research is described at résumé level only.

## Two themes, two identities
- **Paper (light)**: cream `#f6f2e9`, navy ink `#121a2b`, one cobalt accent `#2c52bd`. It follows the earlier "portfolio 2" direction.
- **Lab (dark)**: near-black `#07090d`, radar teal `#5fe3c6`, amber status `#f2a93b`, a faint grid, a SAR-speckle hero and a slow radar sweep.
- Tokens live in `app/tokens.css`. The theme follows the system until the visitor picks one, and the choice is stored in `localStorage`.
- Type: Bricolage Grotesque (display/body), IBM Plex Mono (labels, data), Instrument Serif italic (one accent phrase per heading).
- Recurring motif: "figure plates" with corner ticks and `FIG. nn` labels, as in a paper.

## Fun, on purpose
- **`ritwik.ipynb`**: the whole portfolio as a Jupyter-style notebook. Open it from the nav, press <kbd>`</kbd>, or add `?mode=notebook`. `lib/notebook.ts` is a whitelisted interpreter; it never evaluates input. Easter eggs: `!nvidia-smi`, `model.fit(life)`, `import this`, `!sudo hire ritwik`, and more.
- **Training-run HUD**: scrolling "trains" the page, and the loss converges when you reach Contact.
- **Konami code**: "overfit mode". Also a console greeting, robot quips and a CUDA-OOM 404 page.

## Accessibility & performance
Native scrolling, with Lenis only for anchor jumps. Reduced motion disables reveals, the sweep and the robot. The notebook is a modal dialog that makes the site `inert`, closes on Esc and returns focus. The heavy notebook chunk and the Spline runtime load only on demand.
