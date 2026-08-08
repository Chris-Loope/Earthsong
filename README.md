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
- `/disclaimer` — what Earthsong is and isn't: metaphor, cultural sourcing, symbols, cycles, and eclipse safety

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

Each event on `/calendar` has a short "what/why/a thought" note (`src/lib/events.ts`), derived at render time from its title — no changes to `cycle.json` are needed for this. Solstices, equinoxes, and every eclipse kind are "major" events; when a Seasonal Letter sets `relatedEvent: "YYYY-MM-DD"` in its frontmatter matching one, the calendar links to that letter and the letter links back to the calendar. Run `npm run check:newsletters` to see which major events don't have a matching letter yet.

## Content authorship

Seasonal Letters, and the per-event notes on `/calendar`, are researched and drafted with AI assistance rather than hand-written for each new occasion — see `/disclaimer#ai-assisted-content` for the public-facing disclosure.

## Visual system

Earthsong's visual language uses:

- Display: Bebas Neue
- Body: Lora
- Labels: JetBrains Mono
- Palette: forest, moss, chalk, ink, ember, and stone

Font files are served locally from `public/fonts`.
