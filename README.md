# grid-paper

Mobile-first **Grid Paper WhatsApp Sticker Generator**. Create Hebrew or English grader notes, memes, doodles, and typing animations on graph paper.

## Features

- Live canvas preview with RTL Hebrew / LTR English
- Grid paper styling (cell size, line weight, colors, rough/scanned texture)
- Typing playback with speed, end pause, and cursor styles
- PNG snapshot and frame-by-frame GIF export (`gifshot`)
- Image insertion, freehand red-pen drawings, meme presets, and AI scene generation
- Installable PWA with offline scene fallbacks

## Stack

Vite + React + TypeScript + Tailwind CSS. Canvas rendering is client-side; Vercel optionally supplies the secure OpenRouter proxy in `api/generate-scene.ts`.

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

| Host | Behavior |
|------|----------|
| GitHub Pages | Static PWA and offline AI fallbacks. A user may provide their own OpenRouter key. |
| Vercel | Static app plus `/api/generate-scene`; set `OPENROUTER_API_KEY` in project environment variables. |

Pages deploys from [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) on `main`. In the repo settings, set Pages source to **GitHub Actions** if it is not already.

## Scripts

| Command | What it does |
|---------|----------------|
| `pnpm dev` | Dev server |
| `pnpm build` | Typecheck + production build |
| `pnpm preview` | Preview `dist/` |
| `pnpm lint` | Oxlint |
| `pnpm lint:strict` | Oxlint with all stable categories and React plugins |
| `pnpm doctor` | React Doctor health scan |

## OpenRouter configuration

The normal Vercel path keeps `OPENROUTER_API_KEY` server-side. Do not use `VITE_OPENROUTER_API_KEY`.
GitHub Pages cannot protect a shared server key, so it uses offline scenes unless a user intentionally supplies a personal key.
The demo admin panel (`admin` / `admin`) stores model and prompt preferences in the current browser only; it is not production authentication.
