# grid-paper

Client-side **Grid Paper Text & Typing GIF Generator**. Type Hebrew or English in red on graph paper, preview a typing animation, then download a PNG or animated GIF.

## Features

- Live canvas preview with RTL Hebrew / LTR English
- Grid paper styling (cell size, line weight, colors, rough/scanned texture)
- Typing playback with speed, end pause, and cursor styles
- PNG snapshot and frame-by-frame GIF export (`gifshot`)

## Stack

Vite + React + TypeScript + Tailwind CSS. Pure canvas draw/export modules; no backend.

## Develop

```bash
pnpm install
pnpm dev
```

```bash
pnpm build    # output in dist/
pnpm preview  # serve the production build
```

## Deploy

One static build (`vite` `base: './'`) serves both hosts:

| Host | URL |
|------|-----|
| GitHub Pages | https://jon44ai-svg.github.io/grid-paper/ |
| Vercel | Import `jon44ai-svg/grid-paper` in Vercel (framework Vite, output `dist`), or `pnpm dlx vercel` |

Pages deploys from [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) on `main`. In the repo settings, set Pages source to **GitHub Actions** if it is not already.

## Scripts

| Command | What it does |
|---------|----------------|
| `pnpm dev` | Dev server |
| `pnpm build` | Typecheck + production build |
| `pnpm preview` | Preview `dist/` |
| `pnpm lint` | Oxlint |
