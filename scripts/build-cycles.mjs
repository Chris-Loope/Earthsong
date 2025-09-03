// scripts/build-cycles.mjs
import fs from 'node:fs';
import path from 'node:path';
import * as A from 'astronomy-engine';  // npm i astronomy-engine

const START_YEAR = 2025;
const END_YEAR = 2030;

// format Date -> ISO string (UTC)
const toIso = (d) => d.toISOString();

function seasonEvents(year) {
  const s = A.Seasons(year); // AstroTime fields
  return [
    { title: 'Vernal Equinox',   time: s.mar_equinox.date },
    { title: 'Summer Solstice',  time: s.jun_solstice.date },
    { title: 'Autumnal Equinox', time: s.sep_equinox.date },
    { title: 'Winter Solstice',  time: s.dec_solstice.date },
  ];
}

function moonPhaseEvents(year) {
  const start = new A.AstroTime(new Date(Date.UTC(year, 0, 1)));
  const end   = new A.AstroTime(new Date(Date.UTC(year + 1, 0, 1)));
  let q = A.SearchMoonQuarter(start);
  const events = [];
  while (q.time.ut < end.ut) {
    if (q.quarter === 0) events.push({ title: 'New Moon',  time: q.time.date });
    if (q.quarter === 2) events.push({ title: 'Full Moon', time: q.time.date });
    q = A.NextMoonQuarter(q);
  }
  return events;
}

function eclipseEvents(year) {
  const start = new A.AstroTime(new Date(Date.UTC(year, 0, 1)));
  const end   = new A.AstroTime(new Date(Date.UTC(year + 1, 0, 1)));
  const events = [];

  // ---- Solar eclipses (global) ----
  let sol = A.SearchGlobalSolarEclipse(start);
  // Defensive guard in case the library returns an unexpected value
  while (sol && sol.peak && sol.peak.time && sol.peak.time.ut < end.ut) {
    const kind =
      sol.kind === 'P' ? 'Partial' :
      sol.kind === 'A' ? 'Annular' :
      sol.kind === 'T' ? 'Total'   :
      sol.kind === 'H' ? 'Hybrid'  : 'Solar';
    events.push({ title: `${kind} Solar Eclipse`, time: sol.peak.time.date });
    // Advance to the next one; break if next search misbehaves
    const next = A.NextGlobalSolarEclipse(sol.peak.time);
    if (!next || !next.peak || !next.peak.time) break;
    sol = next;
  }

  // ---- Lunar eclipses (global) ----
  let lun = A.SearchLunarEclipse(start);
  while (lun && lun.peak && lun.peak.time && lun.peak.time.ut < end.ut) {
    const kind =
      lun.kind === 'P' ? 'Penumbral' :
      lun.kind === 'N' ? 'Partial'   :
      lun.kind === 'T' ? 'Total'     : 'Lunar';
    events.push({ title: `${kind} Lunar Eclipse`, time: lun.peak.time.date });
    const next = A.NextLunarEclipse(lun.peak.time);
    if (!next || !next.peak || !next.peak.time) break;
    lun = next;
  }

  return events;
}

function buildAll() {
  const all = [];
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    for (const e of seasonEvents(y)) {
      all.push({ title: e.title, start: toIso(e.time), tags: ['season'] });
    }
    for (const e of moonPhaseEvents(y)) {
      all.push({
        title: e.title,
        start: toIso(e.time),
        tags: [e.title.includes('New') ? 'new-moon' : 'full-moon']
      });
    }
    for (const e of eclipseEvents(y)) {
      all.push({ title: e.title, start: toIso(e.time), tags: ['eclipse'] });
    }
  }
  all.sort((a, b) => new Date(a.start) - new Date(b.start));
  return all;
}

const outPath = path.join('data', 'cycle.json');
fs.mkdirSync('data', { recursive: true });
const events = buildAll();

// OPTIONAL: convert moon phases to all-day entries instead of timed
/*
for (const e of events) {
  if (e.tags?.includes('new-moon') || e.tags?.includes('full-moon')) {
    const d = new Date(e.start);
    const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, day = d.getUTCDate();
    e.start = `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }
}
*/

fs.writeFileSync(outPath, JSON.stringify(events, null, 2));
console.log(`Wrote ${outPath} with ${events.length} events from ${START_YEAR}–${END_YEAR}.`);