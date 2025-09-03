// scripts/build-cycles.mjs
import fs from 'node:fs';
import path from 'node:path';
import * as A from 'astronomy-engine';  // npm i astronomy-engine

const START_YEAR = 2025;
const END_YEAR = 2030;

function toIsoLocal(dt) {
  // Keep as UTC ISO; front-end will format for the visitor’s locale
  return dt.toISOString();
}

function seasonEvents(year) {
  const s = A.Seasons(year); // { mar_equinox, jun_solstice, sep_equinox, dec_solstice } as AstroTime
  return [
    { title: 'Vernal Equinox',   time: s.mar_equinox.toDate() },
    { title: 'Summer Solstice',  time: s.jun_solstice.toDate() },
    { title: 'Autumnal Equinox', time: s.sep_equinox.toDate() },
    { title: 'Winter Solstice',  time: s.dec_solstice.toDate() },
  ];
}

function moonPhaseEvents(year) {
  // Use quarter search: 0=new, 2=full. We’ll iterate through the whole year.
  const start = new A.AstroTime(new Date(Date.UTC(year, 0, 1, 0, 0, 0)));
  const end   = new A.AstroTime(new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0)));
  let q = A.SearchMoonQuarter(start); // returns { time, quarter }
  const events = [];
  while (q.time.ut < end.ut) {
    if (q.quarter === 0) {
      events.push({ title: 'New Moon', time: q.time.toDate() });
    } else if (q.quarter === 2) {
      events.push({ title: 'Full Moon', time: q.time.toDate() });
    }
    q = A.NextMoonQuarter(q);
  }
  return events;
}

function eclipseEvents(year) {
  // Scan for eclipses within the year (global circumstances, not visibility-culled).
  const start = new A.AstroTime(new Date(Date.UTC(year, 0, 1, 0, 0, 0)));
  const end   = new A.AstroTime(new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0)));

  const events = [];

  // Solar eclipses
  let sol = A.SearchGlobalSolarEclipse(start);
  while (sol.peak.time.ut < end.ut) {
    const kind =
      sol.kind === 'P' ? 'Partial' :
      sol.kind === 'A' ? 'Annular' :
      sol.kind === 'T' ? 'Total'   :
      sol.kind === 'H' ? 'Hybrid'  : 'Solar';
    events.push({ title: `${kind} Solar Eclipse`, time: sol.peak.time.toDate() });
    sol = A.NextGlobalSolarEclipse(sol.peak.time);
  }

  // Lunar eclipses
  let lun = A.SearchLunarEclipse(start);
  while (lun.peak.time.ut < end.ut) {
    const kind =
      lun.kind === 'P' ? 'Penumbral' :
      lun.kind === 'N' ? 'Partial'   :
      lun.kind === 'T' ? 'Total'     : 'Lunar';
    events.push({ title: `${kind} Lunar Eclipse`, time: lun.peak.time.toDate() });
    lun = A.NextLunarEclipse(lun.peak.time);
  }

  return events;
}

function buildAll() {
  const all = [];
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    // Seasons
    for (const e of seasonEvents(y)) {
      all.push({ title: e.title, start: toIsoLocal(e.time), tags: ['season'] });
    }
    // Moons
    for (const e of moonPhaseEvents(y)) {
      const tag = e.title.includes('New') ? 'new-moon' : 'full-moon';
      all.push({ title: `${e.title}`, start: toIsoLocal(e.time), tags: [tag] });
    }
    // Eclipses
    for (const e of eclipseEvents(y)) {
      all.push({ title: e.title, start: toIsoLocal(e.time), tags: ['eclipse'] });
    }
  }

  // Sort by time
  all.sort((a,b) => new Date(a.start) - new Date(b.start));
  return all;
}

const outPath = path.join('data', 'cycle.json');
const events = buildAll();

// OPTIONAL: make moon phases "all-day" instead of timed — set to midnight date.
// If you prefer that, uncomment the block below.
/*
for (const e of events) {
  if (e.tags?.includes('new-moon') || e.tags?.includes('full-moon')) {
    const d = new Date(e.start);
    const y = d.getUTCFullYear(), m = d.getUTCMonth()+1, day = d.getUTCDate();
    e.start = `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`; // YYYY-MM-DD
  }
}
*/

fs.mkdirSync('data', { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(events, null, 2));
console.log(`Wrote ${outPath} with ${events.length} events from ${START_YEAR}–${END_YEAR}.`);