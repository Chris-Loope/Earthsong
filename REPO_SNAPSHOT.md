# Earthsong — Repository Snapshot

> Generated 2026-03-05

---

## 1. Project Overview

**Earthsong** is a public-facing static website sharing teachings from the Earthsong Codex — a nature-based philosophy — along with celestial-cycle calendars, newsletter archives, and stewardship guides.

**Current status:** The core site is fully built and functional. All pages render real content (no placeholder pages). The newsletter subscribe form falls back to localStorage when no backend (Netlify Forms / Formspree) is configured. There is no database, authentication, or membership system yet — those are listed as future plans.

### Tech stack

| Tool | Version | Purpose |
|---|---|---|
| Astro | ^5.13.5 | Static site generator (SSG) |
| TailwindCSS | ^3.4.10 | Utility-first styling |
| @tailwindcss/typography | ^0.5.16 | Prose styling for MDX content |
| @astrojs/mdx | ^4.3.4 | MDX content support |
| @astrojs/tailwind | ^5.1.0 | Astro ↔ Tailwind integration |
| astronomy-engine | ^2.1.0 | Compute lunar phases, eclipses, solstices |
| @vercel/analytics | ^1.5.0 | Vercel web analytics (imported but not visibly wired) |
| PostCSS | ^8.4.41 | CSS processing |
| Autoprefixer | ^10.4.20 | Vendor prefixing |
| Prettier | ^3.3.3 (dev) | Code formatting |
| Node | >=18 | Runtime |

### Deployment

- **Target:** Vercel (static output)
- **Configured site URL:** `https://earthsong.io`
- **Build output:** `astro build && node scripts/build-ics.mjs` (generates static HTML + `.ics` calendar file)

---

## 2. Directory Tree

```
.
├── astro.config.mjs            # Astro config: static output, site URL, MDX + Tailwind integrations, @ alias
├── tailwind.config.cjs         # Custom colors (ink, earth, water, fire, air) + typography plugin
├── postcss.config.cjs          # PostCSS: Tailwind + Autoprefixer
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies and scripts
├── package-lock.json
├── LICENSE                     # MIT license
├── README.md                   # Project overview and vision
│
├── data/
│   └── cycle.json              # Pre-generated celestial events (2025–2030, ~200 events)
│
├── public/
│   ├── earthsong.ics           # Generated iCal feed for calendar subscriptions
│   ├── favicon.svg             # Site favicon
│   └── leaf-texture.jpg        # Background texture for stewardship page hero
│
├── scripts/
│   ├── build-cycles.mjs        # Generates data/cycle.json from astronomy-engine (seasons, moons, eclipses)
│   ├── build-ics.mjs           # Converts data/cycle.json → public/earthsong.ics
│   └── peek-eclipse-shapes.mjs # Dev utility: inspect astronomy-engine eclipse object shapes
│
├── src/
│   ├── env.d.ts                # Astro client type reference
│   ├── assets/
│   │   └── earthsong-hero.jpg  # Hero image for home page
│   │
│   ├── components/
│   │   ├── Layout.astro        # Site-wide shell: head, nav, mobile drawer, footer with subscribe form
│   │   ├── EventList.astro     # Calendar event list with year tabs + tag filters (client-side JS)
│   │   ├── GuideCTA.astro      # Call-to-action linking to ChatGPT custom GPT ("Voice of Earthsong")
│   │   └── SubscribeForm.astro # Email subscribe: Netlify Forms / external endpoint / localStorage fallback
│   │
│   ├── content/
│   │   ├── codex/
│   │   │   ├── 01-origin.mdx       # Chapter I: The Origin Symphony
│   │   │   ├── 02-roots.mdx        # Chapter II: The Ancient Roots
│   │   │   ├── 03-symbols.mdx      # Chapter III: Symbols of the Sacred
│   │   │   ├── 04-spaces.mdx       # Chapter IV: Sacred Spaces
│   │   │   ├── 05-compassion.mdx   # Chapter V: The Path of Compassion
│   │   │   └── 06-cycles.mdx       # Chapter VI: Sacred Cycles
│   │   ├── elders/
│   │   │   └── index.mdx           # "The Wise Elders" teachings
│   │   └── newsletter/
│   │       ├── 001-the-first-note.mdx
│   │       ├── 002-roots-and-rivers.mdx
│   │       ├── 003-the-long-dark.mdx
│   │       └── 004-earths-silent-partner.mdx
│   │
│   └── pages/
│       ├── index.astro                  # Home page
│       ├── calendar.astro               # Sacred Cycles calendar
│       ├── codex.astro                  # Codex (all 6 chapters)
│       ├── elders.astro                 # Elders teachings
│       ├── from-dominion-to-harmony.astro # Stewardship framework
│       ├── guide.astro                  # Earthsong Guide (ChatGPT link)
│       └── newsletter/
│           ├── index.astro              # Newsletter archive + subscribe
│           └── [slug].astro             # Individual newsletter issue (dynamic)
│
└── .astro/                     # Astro build cache (gitignored internals)
```

---

## 3. Route / Page Inventory

All routes are **static pages** (SSG). There are no API routes.

| Route | File | Type | Description |
|---|---|---|---|
| `/` | `src/pages/index.astro` | Page (full-width) | Hero image, tagline, CTA to Codex, Guide CTA section |
| `/codex` | `src/pages/codex.astro` | Page | All 6 Codex chapters rendered as a single long-scroll page with TOC |
| `/calendar` | `src/pages/calendar.astro` | Page | Sacred Cycles calendar with `.ics` download/subscribe + interactive event list |
| `/elders` | `src/pages/elders.astro` | Page | Renders the Elders MDX content in prose styling |
| `/from-dominion-to-harmony` | `src/pages/from-dominion-to-harmony.astro` | Page (full-width) | Stewardship framework: principles, practice, 12-month goals, FAQ |
| `/guide` | `src/pages/guide.astro` | Page | Description + CTA linking to ChatGPT custom GPT |
| `/newsletter` | `src/pages/newsletter/index.astro` | Page | Subscribe form + archive list of all newsletter issues |
| `/newsletter/[slug]` | `src/pages/newsletter/[slug].astro` | Dynamic page (getStaticPaths) | Individual newsletter issue with prev/next nav and subscribe CTA |

**Nav links** (defined in `Layout.astro`): Codex, Calendar, Elders, Newsletter, Stewardship

---

## 4. Auth & Middleware

**There is no authentication or middleware.** The site is entirely public with no protected routes, no login, no session handling. The README mentions future plans for "Membership / gated content" but nothing is implemented.

---

## 5. Environment Variables

**There are no `.env`, `.env.example`, or `.env.local.example` files in the repository.**

The `SubscribeForm.astro` component references a potential `NEWSLETTER_ACTION` env var (mentioned in its JSDoc comment) for pointing to an external form endpoint (Formspree / ConvertKit / Mailchimp), but it is not defined anywhere in the project. When absent, the form falls back to Netlify Forms or localStorage.

`@vercel/analytics` is listed as a dependency but no analytics setup code was found in the source — it may be auto-injected by Vercel at deploy time.

---

## 6. Key Components & Shared Code

### Components (`src/components/`)

| Component | Description |
|---|---|
| `Layout.astro` | Site-wide layout shell. Props: `title`, `description`, `image` (OG), `fullWidth`. Includes `<head>` with OG/Twitter meta, responsive nav with mobile hamburger drawer (vanilla JS), and footer with compact subscribe form. |
| `EventList.astro` | Reads `data/cycle.json`, renders year-tab and tag-chip filters, displays events. Filtering is client-side vanilla JS. Tags: `full-moon`, `new-moon`, `eclipse`, `season`. |
| `GuideCTA.astro` | Card linking to the ChatGPT custom GPT "The Voice of Earthsong". Hardcoded external URL. |
| `SubscribeForm.astro` | Email subscribe form with two modes: `compact` (inline for footer) and full (card with description). Supports Netlify Forms, external endpoint, or localStorage fallback. |

### Scripts (`scripts/`)

| Script | Description |
|---|---|
| `build-cycles.mjs` | Uses `astronomy-engine` to compute seasons, moon phases, and eclipses for 2025–2030. Outputs `data/cycle.json`. Run via `npm run generate:cycles`. |
| `build-ics.mjs` | Converts `data/cycle.json` into `public/earthsong.ics` (iCal format). Run as part of `npm run build` or standalone via `npm run build:ics`. |
| `peek-eclipse-shapes.mjs` | Dev-only diagnostic script to inspect raw astronomy-engine eclipse object shapes. |

### Custom Tailwind Theme

Defined in `tailwind.config.cjs` — custom color palette:

| Token | Value | Usage |
|---|---|---|
| `ink` | `#1F1F1F` | Body text |
| `earth` | `#566B4A` | Primary accent (headings, links, buttons) |
| `water` | `#3E5F73` | Full-moon tag badges |
| `fire` | `#C75B39` | Bold text, eclipse badges |
| `air` | `#E8ECF1` | Page background |

---

## 7. Database Schema

**There is no database.** The site is fully static. The only data source is `data/cycle.json`, a flat JSON array of celestial events with the structure:

```json
{
  "title": "Full Moon",
  "start": "2025-01-13T22:27:32.237Z",
  "tags": ["full-moon"]
}
```

Tags are one of: `full-moon`, `new-moon`, `eclipse`, `season`.

Content is authored as MDX files in `src/content/` (codex chapters, elders, newsletter issues). Newsletter MDX frontmatter includes: `title`, `issue` (number), `date`, `summary`.

---

## 8. External Integrations

| Integration | Status | Details |
|---|---|---|
| **ChatGPT Custom GPT** | Live (external link) | `GuideCTA.astro` links to a custom GPT called "The Voice of Earthsong" hosted on `chatgpt.com`. |
| **Netlify Forms** | Wired but optional | `SubscribeForm.astro` includes `data-netlify="true"` and a hidden `form-name` field. Only active when deployed on Netlify. |
| **Vercel Analytics** | Dependency installed | `@vercel/analytics` is in `package.json` but no explicit setup code found — likely auto-injected by Vercel. |
| **webcal:// subscribe** | Live | Calendar page offers a `webcal://earthsong.io/earthsong.ics` link for native calendar subscription. |

---

## 9. Known Gaps / TODOs

### Not yet implemented (from README "Future directions")
- **Membership / gated content** — mentioned as a future feature for private rituals and extended Codex. No code exists.
- **Time zone–aware calendars** — all events are UTC only.
- **Multilingual support** — not implemented; all content is English.
- **Analytics / community insights dashboard** — `@vercel/analytics` is installed but no dashboard or custom tracking exists.

### Functional gaps
- **Newsletter subscribe backend** — no actual email service is configured. The form falls back to localStorage in non-Netlify environments. No `NEWSLETTER_ACTION` env var is set, and there is no `/newsletter/thank-you` page (the form action target when Netlify is present).
- **No `/newsletter/thank-you` route** — referenced in `SubscribeForm.astro` as the form action but the page does not exist. Would result in a 404 on Netlify if form submission redirects there.
- **Vercel Analytics** — dependency is installed but no `<Analytics />` component or `inject` call was found in source. May be inactive.
- **Guide page is a passthrough** — `/guide` just wraps `GuideCTA` with a short description. The conversational AI is entirely external (ChatGPT).
- **No RSS feed** — newsletter archive exists but no RSS/Atom feed is generated.
- **No sitemap** — `@astrojs/sitemap` is not installed.
- **No search** — no site search functionality.
- **No 404 page** — no custom `404.astro` page exists.

### Code notes
- `peek-eclipse-shapes.mjs` is a one-off dev utility and could be removed.
- The `data/cycle.json` file covers 2025–2030 (~200 events). The range is hardcoded in `build-cycles.mjs` (`START_YEAR = 2025`, `END_YEAR = 2030`).
- There is a commented-out block in `build-cycles.mjs` (lines 125–133) for converting moon phases to all-day events.

---

## 10. Deploy & Run

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Opens at `http://localhost:4321` by default.

### Regenerate celestial data (optional)

```bash
npm run generate:cycles   # rebuilds data/cycle.json from astronomy-engine
npm run build:ics          # rebuilds public/earthsong.ics from cycle.json
```

### Build for production

```bash
npm run build
```

This runs `astro build` (static HTML) followed by `build-ics.mjs` (generates the `.ics` file into the build output).

### Preview production build

```bash
npm run preview
```

### Deploy

The site is configured for **Vercel** (static output). Deploy via:

- Vercel CLI: `vercel` or `vercel --prod`
- Git push to connected Vercel project (auto-deploy)
- Build command: `npm run build`
- Output directory: `dist/`

### Format code

```bash
npm run format
```
