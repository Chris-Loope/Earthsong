# Earthsong

Earthsong is a public thought experiment about nature, community, and possibility. It explores how nature-minded governance might work without a central religion or figure, separating scientific claims from metaphor and revising its language as evidence and understanding change.

The project is earnest about nature and light about itself. It is not an active religion, public membership organization, or finished governance system. Its stories and symbols are offered as creative tools; scientific claims are separated from metaphor and supported by sources.

## Public site

- `/about` — the project's origin, purpose, and working principles
- `/privacy` — the site's data-minimization and hosting policy
- `/accessibility` — the WCAG 2.2 Level AA target, audit scope, and barrier-reporting process
- `/codex` — six chapters of the current Earthsong philosophy
- `/calendar` — UTC lunar phases, solstices, equinoxes, and eclipses from 2025–2030
- `/newsletter` — seasonal letters and field notes
- `/from-dominion-to-harmony` — an individual-scale thought experiment about decision-making and care

The old Guide and Elders routes redirect to relevant Codex material so existing links do not strand readers.

## Development

Earthsong is a static [Astro](https://astro.build/) site styled with Tailwind CSS and deployed through Vercel.

```bash
npm install
npm run generate:cycles
npm run dev
```

Create a production build with:

```bash
npm run build
```

The build generates `public/earthsong.ics` before Astro copies the public files into the static output.

## Calendar data

`scripts/build-cycles.mjs` uses `astronomy-engine` to create `data/cycle.json`. Event times and labels are hemisphere-neutral and displayed in UTC. Eclipse times are global peak moments; local visibility varies.

## Newsletter delivery

The site does not store subscriber data. To connect a newsletter provider, copy `.env.example` to `.env` and set `PUBLIC_NEWSLETTER_ACTION` to an external form endpoint. Without an endpoint, the form directs readers to the public letter archive and does not pretend a subscription was created.

## Visual system

Earthsong's visual language uses:

- Display: Bebas Neue
- Body: Lora
- Labels: JetBrains Mono
- Palette: forest, moss, chalk, ink, ember, and stone

Font files are served locally from `public/fonts`.
