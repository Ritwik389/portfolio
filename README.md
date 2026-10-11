# Ritwik Jain — portfolio

Next.js 16, TypeScript, Tailwind CSS, and Framer Motion. The original color palette and section layout are preserved. The default build includes a cached ratings API for Vercel/Netlify; a static export remains available for GitHub Pages.

## Develop and verify

Use Node.js 22 (`.nvmrc`), then:

```sh
npm ci
npm run dev
```

Before hosting:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Preview the default production build with `npm start` at http://localhost:3000. For a static export, use `npm run build:static` followed by `npm run start:static`.

Content and links live in `lib/data.ts`. The public resume is `public/Ritwik_Jain_Resume.pdf`, based on the supplied general resume with the Deloitte internship. Its CGPA, school percentages, and GreenTag user count have been corrected in the public copy; the source PDFs are untouched.

## Hosting

### Vercel (recommended)

Import this folder's repository into Vercel, select the Next.js framework, and use Node.js 22. `vercel.json` sets `npm run build`; let Vercel use its default Next.js output rather than an `out` override. Set `NEXT_PUBLIC_SITE_URL` to the final public URL and leave `NEXT_PUBLIC_BASE_PATH` empty and `PORTFOLIO_STATIC_EXPORT` unset or `0`. Redeploy whenever these build-time variables change.

### Netlify

Import the repository. The supplied `netlify.toml` sets Node.js 22, `npm run build`, and `.next`. Allow Netlify's Next.js adapter to run so the ratings endpoint can revalidate. Set `NEXT_PUBLIC_SITE_URL` to the final public URL, leave the base path empty, and keep `PORTFOLIO_STATIC_EXPORT` unset or `0`.

### GitHub Pages

Push the source to your own repository, choose **Settings → Pages → Source → GitHub Actions**, and manually run **Deploy portfolio to GitHub Pages** in Actions. The supplied workflow reads the site's base path and public URL from GitHub, builds the static export, and publishes it. It does not run on push by default.

For a manual project-site build, set `NEXT_PUBLIC_BASE_PATH=/your-repository` and `NEXT_PUBLIC_SITE_URL=https://your-user.github.io/your-repository` before `npm run build:static`. For a user site or custom domain at the URL root, leave the base path empty. Upload the contents of `out`, including `_next` and `.nojekyll`. Do not upload `node_modules` or `.next`. GitHub Pages has no server runtime, so ratings are a snapshot refreshed with each build rather than a live API.

## Coding ratings

`GET /api/ratings/` returns current and peak contest ratings for the three handles in `lib/ratings.ts`, plus LeetCode's solved count. No API keys are needed. Codeforces uses its official `user.info` API. LeetCode uses its public-facing GraphQL endpoint; peak rating is the maximum of attended contest history and the current rating. CodeChef parses the contest rating block on its public profile, excluding the separate DSA rating. LeetCode and CodeChef are unofficial integrations and may change or reject requests.

Each platform has a one-hour cache, an eight-second timeout, and five-minute failure backoff. Concurrent requests share in-flight work. Successful values remain available during partial outages; cold starts fall back to the verified snapshot in `lib/ratings-fallback.json`. The endpoint revalidates every five minutes on a Next.js host, while the upstream cache refreshes hourly. The portfolio fetches from its own origin, avoiding browser CORS restrictions. Peak ratings remain the large numbers; current ratings appear beneath them. Tests cover parsing, partial failures, caching, and request deduplication.

## Configuration

Copy `.env.example` to `.env.local` for local overrides. All `NEXT_PUBLIC_` variables are compiled into browser files; do not place secrets in them.

- `NEXT_PUBLIC_SITE_URL`: full public URL, including a project subdirectory when applicable. Defaults to the existing Vercel URL from the resume. Used in canonical URLs, social metadata, sitemap, and robots metadata.
- `NEXT_PUBLIC_BASE_PATH`: empty at the domain root; `/repository` for a GitHub Pages project site.
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`: the public Web3Forms identifier for the intended receiving inbox. The existing identifier is retained as a fallback.

The contact form includes a honeypot, repeat-submit prevention, a timeout, accessible status messages, and a direct email fallback. Confirm the receiving inbox in Web3Forms and perform one real submission yourself after publishing. Domain restrictions, if enabled in your Web3Forms account, must include the chosen domain. Automated checks should mock requests rather than send real mail.

Spline scenes are bundled in `public/scenes`. Two original assets referenced deleted/wrong animation states, which caused the runtime's “Missing property” console error. The hero's invalid transition was removed while retaining its LookAt event, and the About hand transition now targets that hand's existing state. Colors, geometry, materials, other animations, and the Spline attribution remain intact. `source-manifest.json` records the changes and original URLs. `npm run scenes:repair` regenerates these assets from their sources and verifies the binary round trip.

Spline loads near the viewport on devices with a fine pointer and disposes when offscreen. Touch devices, reduced-motion users, and failed scene loads receive a lightweight monogram in the existing palette. Fraunces and Manrope are bundled locally so builds do not require Google Fonts network access; font licenses are in `public/fonts`.

Hero waves and the faint Projects grid live in `components/effects`. The D3 globe lives in `components/ui/wireframe-dotted-globe.tsx`, following the existing shadcn alias in `components.json`; styles remain in `app/globals.css` with Tailwind 3. The globe stays beside the Hackathons heading and above the cards on small screens. Its coastlines and dense land dots are bundled locally; run `node scripts/prepare-globe-land.mjs` to regenerate them from the public Natural Earth source, or pass a downloaded GeoJSON path. Drag to rotate; click/focus the globe then scroll to zoom. Keyboard controls: arrow keys rotate, plus/minus zoom, Home resets. Wheel scrolling elsewhere still scrolls the page. Canvases pause offscreen and in hidden tabs; reduced motion stops automatic rotation. The gold cursor has seven trailing dots on desktop only. The existing palette and section order are preserved; no Tailwind 4 imports or replacement theme variables are needed. See `THIRD_PARTY_NOTICES.md` for design and map credits.

Coding profile handles live in `lib/ratings.ts`; rating values and the solved count update automatically through the endpoint. No membership section or profile photograph is included.
