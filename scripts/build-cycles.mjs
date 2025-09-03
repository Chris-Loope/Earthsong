// scripts/build-cycles.mjs
import fs from 'node:fs';
import path from 'node:path';
import * as A from 'astronomy-engine';

const START_YEAR = 2025;
const END_YEAR   = 2030;

// Date -> ISO string (UTC)
const toIso = (d) => d.toISOString();

/** Seasons (equinoxes/solstices) */
function seasonEvents(year) {
  const s = A.Seasons(year); // fields are AstroTime
  return [
    { title: 'Vernal Equinox',   time: s.mar_equinox.date },
    { title: 'Summer Solstice',  time: s.jun_solstice.date },
    { title: 'Autumnal Equinox', time: s.sep_equinox.date },
    { title: 'Winter Solstice',  time: s.dec_solstice.date }
  ];
}

/** New + Full moons via quarter search */
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

/** Eclipses (global peak instants) */
function eclipseEvents(year) {
  const start = new A.AstroTime(new Date(Date.UTC(year, 0, 1)));
  const end   = new A.AstroTime(new Date(Date.UTC(year + 1, 0, 1)));
  const events = [];

  // Helpers for reading AstroTime regardless of shape
  const getUt   = (x) => (x && x.ut !== undefined) ? x.ut : (x && x.time && x.time.ut);
  const getDate = (x) => (x && x.date) || (x && x.time && x.time.date);

  // ----- SOLAR -----
  let sol  = A.SearchGlobalSolarEclipse(start);
  let guard = 0;
  while (sol && guard++ < 50) {
    const peakUt   = getUt(sol.peak);
    const peakDate = getDate(sol.peak);
    if (peakUt == null || !peakDate) break;

    if (peakUt >= end.ut) break;           // past this year → stop
    if (peakUt >= start.ut) {
      const kind =
        sol.kind === 'partial' ? 'Partial' :
        sol.kind === 'annular' ? 'Annular' :
        sol.kind === 'total'   ? 'Total'   :
        sol.kind === 'hybrid'  ? 'Hybrid'  : 'Solar';
      events.push({ title: `${kind} Solar Eclipse`, time: peakDate });
    }
    const next = A.NextGlobalSolarEclipse(sol.peak);
    if (!next) break;
    sol = next;
  }

  // ----- LUNAR -----
  let lun = A.SearchLunarEclipse(start);
  guard = 0;
  while (lun && guard++ < 50) {
    const peakUt   = getUt(lun.peak);
    const peakDate = getDate(lun.peak);
    if (peakUt == null || !peakDate) break;

    if (peakUt >= end.ut) break;
    if (peakUt >= start.ut) {
      const kind =
        lun.kind === 'penumbral' ? 'Penumbral' :
        lun.kind === 'partial'   ? 'Partial'   :
        lun.kind === 'total'     ? 'Total'     : 'Lunar';
      events.push({ title: `${kind} Lunar Eclipse`, time: peakDate });
    }
    const next = A.NextLunarEclipse(lun.peak);
    if (!next) break;
    lun = next;
  }

  return events;
}

function buildAll() {
  const all = [];
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    const seasons = seasonEvents(y);
    const moons   = moonPhaseEvents(y);
    const eclips  = eclipseEvents(y);

    console.log(`Year ${y}: seasons=${seasons.length}, moons=${moons.length}, eclipses=${eclips.length}`);

    for (const e of seasons) {
      all.push({ title: e.title, start: toIso(e.time), tags: ['season'] });
    }
    for (const e of moons) {
      all.push({
        title: e.title,
        start: toIso(e.time),
        tags: [e.title.includes('New') ? 'new-moon' : 'full-moon']
      });
    }
    for (const e of eclips) {
      all.push({ title: e.title, start: toIso(e.time), tags: ['eclipse'] });
    }
  }
  all.sort((a, b) => new Date(a.start) - new Date(b.start));
  return all;
}

const outPath = path.join('data', 'cycle.json');
fs.mkdirSync('data', { recursive: true });
const events = buildAll();

// OPTIONAL: convert moon phases to all-day entries
/*
for (const e of events) {
  if (e.tags?.includes('new-moon') || e.tags?.includes('full-moon')) {
    const d = new Date(e.start);
    const y = d.getUTCFullYear(), m = d.getUTCMonth()+1, day = d.getUTCDate();
    e.start = `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }
}
*/

fs.writeFileSync(outPath, JSON.stringify(events, null, 2));
console.log(`Wrote ${outPath} with ${events.length} events from ${START_YEAR}–${END_YEAR}.`);