# Project tasks

Status values: `done`, `partial`, `pending`, `blocked`, `declined`.

## User-requested tasks

- [done] Build a Hebrew/English red-text grid-paper preview.
- [done] Export PNG and typing animation.
- [done] Fix RTL cursor placement.
- [done] Add WhatsApp-oriented 512×512 canvas support.
- [done] Add university-grader marks, stamps, notebook margin, binder holes, and ink bleed.
- [done] Make the UI mobile-first and more minimal.
- [done] Add PWA manifest and service worker.
- [done] Add memes and viral-style presets.
- [done] Add image insertion.
- [done] Add multiple text lines.
- [done] Add freehand drawings.
- [partial] Add OpenRouter scene generation: Vercel server proxy and offline fallback exist; deployment configuration and abuse controls remain.
- [done] Let users choose their own OpenRouter key optionally.
- [partial] Add admin OpenRouter settings: demo `admin` / `admin` browser-local configuration exists; production authentication and shared persistence remain.
- [done] Keep the admin UI mobile-first.
- [done] Add React Doctor dependency and command.
- [done] Add and pass the practical strict Oxlint command with React, accessibility, performance, promise, and import plugins. The separate broadest `-D all` profile remains intentionally unused because it enforces opinionated style rules.
- [partial] React Doctor now reports 4 warnings: 1 pnpm-hardening warning and 3 maintainability warnings for large components. Accessibility, service-worker, modal, and transition warnings were fixed.
- [pending] Make cleanup changes in atomic commits.

## Assistant-proposed feature ideas

- [pending] Reference-style letterbox/cinema crop mode.
- [done] Stable seeded rough texture across animation frames.
- [pending] Advanced word spacing and grid fitting.
- [pending] Copy PNG/GIF to clipboard.
- [partial] Multi-line text exists; per-line alignment and justification do not.
- [pending] Configurable cursor blink rate and smooth fade.
- [pending] Optional typewriter sound effects.
- [partial] Thematic presets exist; the full proposed preset set does not.
- [pending] URL-based sharing of sticker state.
- [partial] Notebook overlays exist; margin and binder-hole customization is limited.

## Cleanup and audit proposals

- [done] Remove browser exposure of the shared OpenRouter key.
- [done] Add a server-side Vercel OpenRouter proxy.
- [pending] Add API authentication/rate limiting and usage limits.
- [pending] Export animated WebP for actual WhatsApp sticker compatibility.
- [pending] Guarantee the WhatsApp file-size limit.
- [pending] Delete the duplicate unused `src/lib/openrouter.ts`.
- [pending] Remove the unused legacy AI adapter.
- [pending] Consolidate AI configuration and fallback logic.
- [pending] Update README for PWA, API routes, and deployment behavior.
- [pending] Fix GitHub Pages base-path handling for PWA assets.
- [pending] Replace demo admin authentication for production use.
- [done] Run `pnpm audit`: no known vulnerabilities found.
- [done] Keep Tailwind as the UI styling approach; Mantine/AntD would add unnecessary component weight, and shadcn is unnecessary for this focused tool.
