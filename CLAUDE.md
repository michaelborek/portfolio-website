# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next.js dev server at http://localhost:3000
- `npm run build` — static export to `out/` (no `next start` for prod; this site is statically exported)
- `npm run lint` — ESLint via `eslint-config-next`
- `npm run clean` — remove `out/` and `.next/`
- `npm run deploy` — clean, build, then push `out/` to the `gh-pages` branch via `git subtree`. The GitHub Actions workflow in `.github/workflows/` does the same on push to `main`, so manual `deploy` is rarely needed.

There is no test runner configured.

## Architecture

Single-page Next.js 15 portfolio (App Router, React 19), styled as a plain academic/research-engineer homepage: one ~860px column, system Helvetica, one link-blue accent, no web fonts, no animation, no Tailwind. All UI lives in `app/`:

- `app/page.tsx` is a server component that renders every section (bio, News, Publications, Posters, Selected work, Experience, Education, Skills, Older projects). No client JS is needed.
- `app/content.tsx` holds all content as typed arrays (`news`, `publications`, `posters`, `work`, `experience`, `skills`, `older`). To update the site, edit this file; the bio paragraphs live directly in `page.tsx`.
- `app/globals.css` is the only stylesheet (plain CSS, mobile breakpoint at 640px).
- Thumbnails live in `public/images/` at 480x320 (3:2). The `.jpg` files are crops of the real posters in `public/*.pdf`; the `.svg` files are hand-written schematics. Only show real numbers in them.
- Tone: plain first-person copy that names concrete artifacts. Avoid marketing phrasing, metric cards, and chip clouds.

### Static export + basePath (critical)

`next.config.ts` sets `output: 'export'`, `images.unoptimized: true`, and `basePath: '/portfolio-website'` because the site is served from `https://<user>.github.io/portfolio-website/`. Consequences:

- **Never hardcode `/foo.png` paths.** Use `getAssetPath('/foo.png')` from `app/utils/basePath.ts` for any reference to files under `public/` (images, PDFs like `resume.pdf`). It prepends the basePath so assets resolve both locally and on GitHub Pages. Forgetting this produces 404s only on the deployed site.
- `next/image` is used but image optimization is disabled by the export — treat `<Image>` essentially as a styled `<img>`.
- No server features (API routes, server actions, ISR, middleware) — anything added must work as a fully static build.

### Stale folders

- `portfolio/` (nested under the repo root) is an empty leftover — ignore it; real code is at the top level.
- Earlier designs (framer-motion sections, pixel-art NYC, terminal) were removed; they remain in git history (`pixel-version` branch, `main` before the redesign).
- `out/` is the build output and is also committed because it's what gets pushed to `gh-pages` via `npm run deploy`. The GitHub Actions workflow rebuilds it, so don't hand-edit files there.
