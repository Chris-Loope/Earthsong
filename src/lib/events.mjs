// Shared calendar/newsletter helpers, importable from both Astro components
// (via the @/lib/events alias) and plain Node scripts (scripts/*.mjs) — kept
// as plain JS specifically so scripts run with `node` directly can use it too.

/**
 * @typedef {{ title: string; start: string; tags: string[] }} CycleEvent
 * @typedef {{ what: string; why: string; thought: string }} EventCopy
 * @typedef {{ slug: string; title: string }} NewsletterRef
 */

/** Deterministic kind key from a cycle.json title, e.g. "Total Solar Eclipse" -> "total-solar-eclipse". */
export function slugifyEventKind(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Solstices, equinoxes, and every eclipse kind are "major"; routine new/full moons are not. */
export function isMajorEvent(tags = []) {
  return tags.includes('season') || tags.includes('eclipse');
}

/** Stable anchor id shared between the calendar list and newsletter deep links. */
export function eventAnchorId(start) {
  return `event-${start.replace(/[:.]/g, '-')}`;
}

/** One entry per possible cycle.json title. Reflective, not prescriptive — consistent with /disclaimer#cycles-not-fate. */
export const EVENT_COPY = {
  'march-equinox': {
    what: "The Sun crosses Earth's equatorial plane heading north, and day and night come close to equal length worldwide.",
    why: "Earth's axis stays tilted about 23.4° as it orbits the Sun; twice a year that tilt favors neither hemisphere, so sunlight briefly divides close to evenly.",
    thought: 'A hinge between two seasons — a fair moment to notice what has actually changed, not just what the calendar says should have.',
  },
  'june-solstice': {
    what: "The Sun reaches its most northerly position in Earth's sky: the longest daylight of the year in the Northern Hemisphere, the shortest in the Southern.",
    why: "Earth's tilted axis keeps pointing the same direction in space through the year, so each hemisphere alternately leans toward or away from direct sunlight.",
    thought: "Wherever the days are longest, it's a natural checkpoint: what has this season's extra light actually gone toward?",
  },
  'september-equinox': {
    what: 'The Sun crosses the equatorial plane heading south, and day and night again come close to equal length worldwide.',
    why: 'The same axial tilt as March, now carrying the opposite hemisphere toward its summer.',
    thought: 'A second yearly hinge — a fair point to compare what has changed since the last one.',
  },
  'december-solstice': {
    what: 'The Sun reaches its most southerly position: the shortest daylight of the year in the Northern Hemisphere, the longest in the Southern.',
    why: 'The Northern Hemisphere is tilted furthest from the Sun at this point in the orbit.',
    thought: 'The turn back toward more light starts here, even before it is easy to notice.',
  },
  'new-moon': {
    what: "The Moon sits near the Sun's direction in the sky with its lit half facing mostly away from Earth, so it is effectively invisible.",
    why: 'The Moon makes no light of its own — only the half facing the Sun is illuminated, and the current geometry hides that half from view.',
    thought: 'The darkest phase of the cycle, and sometimes the easiest night to actually see the stars.',
  },
  'full-moon': {
    what: "Earth sits roughly between the Sun and Moon, so the Moon's near side is fully lit.",
    why: 'The same sunlight-and-geometry mechanism as every other phase — a full moon is the far end of the same cycle as a new moon, not a separate event.',
    thought: 'A reliably bright night, worth noticing for how differently a familiar place looks under it.',
  },
  'partial-solar-eclipse': {
    what: "The Moon passes between Earth and Sun but only partly covers the Sun's disk as seen from here.",
    why: "The Moon's shadow grazes Earth rather than landing directly — this location is outside the narrow path where full coverage occurs.",
    thought: 'Never view any part of a solar eclipse without certified solar filters — see the site disclaimer for exact eye-safety guidance.',
  },
  'annular-solar-eclipse': {
    what: 'The Moon crosses directly in front of the Sun but looks too small to fully cover it, leaving a bright ring visible around the edge.',
    why: 'The Moon is near the far point of its slightly elliptical orbit, so it appears smaller than the Sun from Earth.',
    thought: 'There is no unfiltered-safe moment in an annular eclipse — certified solar filters are required throughout. See the site disclaimer for exact guidance.',
  },
  'total-solar-eclipse': {
    what: "The Moon fully covers the Sun's disk for a few minutes, visible only within a narrow path across Earth's surface.",
    why: "The Moon is close enough in its orbit, and the alignment precise enough, for its disk to match or exceed the Sun's apparent size.",
    thought: 'Direct viewing is safe only during the brief total phase itself, and only from inside the path of totality — see the site disclaimer for exact eye-safety guidance.',
  },
  'hybrid-solar-eclipse': {
    what: 'A rare eclipse that appears total along part of its path and annular along the rest, as the curve of the Earth changes the Moon’s apparent distance.',
    why: "The Moon's shadow barely reaches Earth — small differences in distance across Earth's surface tip the eclipse from total to annular.",
    thought: 'Certified solar filters are required outside any brief total phase — see the site disclaimer for exact eye-safety guidance.',
  },
  'penumbral-lunar-eclipse': {
    what: "The Moon passes through Earth's faint outer shadow, dimming only slightly and often hard to notice without instruments.",
    why: "The Moon misses Earth's darker inner shadow entirely, passing only through the lighter penumbral region.",
    thought: 'Easy to miss entirely — a fair excuse to compare tonight’s Moon carefully against how it looked the night before.',
  },
  'partial-lunar-eclipse': {
    what: "Part of the Moon passes through Earth's dark inner shadow, visibly darkening one edge while the rest stays lit.",
    why: 'The Sun, Earth, and Moon are nearly but not exactly aligned — close enough for the shadow to clip the Moon, not cover it.',
    thought: 'Safe to watch directly with the naked eye — unlike solar eclipses, lunar eclipses need no eye protection.',
  },
  'total-lunar-eclipse': {
    what: "The Moon passes fully into Earth's dark inner shadow and often takes on a reddish color.",
    why: "Sunlight bent through Earth's atmosphere still reaches the Moon, with the atmosphere filtering out shorter wavelengths first — the same reason sunsets are red.",
    thought: 'Safe to watch directly with the naked eye for its full duration — no filters are needed for a lunar eclipse.',
  },
};

const FALLBACK_BY_TAG = {
  season: {
    what: "An equinox or solstice marking the Sun's position relative to Earth's tilted axis.",
    why: 'A fixed astronomical checkpoint in Earth’s yearly orbit.',
    thought: 'A seasonal hinge — a fair moment to notice what has actually changed since the last one.',
  },
  eclipse: {
    what: 'The Sun, Earth, and Moon have lined up closely enough for one to cast a shadow on, or pass in front of, another.',
    why: "The Moon's orbit is tilted relative to Earth's path around the Sun, so this alignment only happens occasionally.",
    thought: 'If this is a solar eclipse, never view it without certified solar filters — see the site disclaimer for exact eye-safety guidance.',
  },
};

/** Looks up copy by exact title first, then falls back to a generic per-tag blurb so nothing ever renders blank. */
export function getEventCopy(title, tags = []) {
  const kind = slugifyEventKind(title);
  if (EVENT_COPY[kind]) return EVENT_COPY[kind];
  const tag = tags.find((t) => FALLBACK_BY_TAG[t]);
  return tag ? FALLBACK_BY_TAG[tag] : FALLBACK_BY_TAG.season;
}

/**
 * Node-only helper (fs-based, for plain scripts that can't use import.meta.glob):
 * reads every newsletter .mdx file's `relatedEvent`/`title` frontmatter fields via
 * a lightweight regex extraction and returns a Map<"YYYY-MM-DD", {slug, title}>.
 * Astro pages should keep using import.meta.glob instead — it parses frontmatter
 * properly rather than by regex, and this helper exists only because plain Node
 * scripts (build-ics.mjs, check-newsletter-coverage.mjs) have no Vite context.
 */
export function readNewsletterEventMap(fs, path, newsletterDir) {
  const map = new Map();
  const files = fs.readdirSync(newsletterDir).filter((f) => f.endsWith('.mdx'));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(newsletterDir, file), 'utf8');
    const relatedMatch = raw.match(/^relatedEvent:\s*"?([\d-]+)"?\s*$/m);
    const titleMatch = raw.match(/^title:\s*"(.*)"\s*$/m);
    if (relatedMatch && titleMatch) {
      map.set(relatedMatch[1], { slug: file.replace(/\.mdx$/, ''), title: titleMatch[1] });
    }
  }
  return map;
}
