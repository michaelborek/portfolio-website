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

Single-page Next.js 15 portfolio (App Router, React 19, Tailwind v4, framer-motion). All UI lives in `app/`:

- `app/page.tsx` composes the page by stacking section components (`Hero`, `About`, `Skills`, `Resume`, `Projects`, `Research`, `Contact`, `Footer`) in order. To add or reorder a section, edit this file and add a component under `app/components/`.
- `app/layout.tsx` sets the Geist font variables consumed by Tailwind's `font-[family-name:var(--font-geist-sans)]`.
- Every section component is a `'use client'` module — framer-motion animations and scroll/`useInView` hooks need the client runtime. Only the `Navbar` is additionally wrapped in `<ClientOnly>` in `page.tsx` to defer mount until after hydration (it relies on `window` for scroll state).

### Static export + basePath (critical)

`next.config.ts` sets `output: 'export'`, `images.unoptimized: true`, and `basePath: '/portfolio-website'` because the site is served from `https://<user>.github.io/portfolio-website/`. Consequences:

- **Never hardcode `/foo.png` paths.** Use `getAssetPath('/foo.png')` from `app/utils/basePath.ts` for any reference to files under `public/` (images, PDFs like `resume.pdf`). It prepends the basePath so assets resolve both locally and on GitHub Pages. Forgetting this produces 404s only on the deployed site.
- `next/image` is used but image optimization is disabled by the export — treat `<Image>` essentially as a styled `<img>`.
- No server features (API routes, server actions, ISR, middleware) — anything added must work as a fully static build.

### Project data lives in the components

Projects, research entries, skills, and resume content are hardcoded as typed arrays at the top of their respective components (e.g. `projects: Project[]` in `Projects.tsx`). There is no CMS or external data layer; to update content, edit the array literal in the relevant component.

### Stale folders

- `portfolio/app/components/` and `portfolio/public/images/` (nested under the repo root) are empty leftovers — ignore them; real code is at the top level.
- `out/` is the build output and is also committed because it's what gets pushed to `gh-pages` via `npm run deploy`. The GitHub Actions workflow rebuilds it, so don't hand-edit files there.
