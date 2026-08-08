// scripts/check-newsletter-coverage.mjs
// Reports which major calendar events (solstices, equinoxes, and every eclipse
// kind) don't yet have a matching Seasonal Letter, so the ongoing letter-writing
// practice has a quick "what's next" signal instead of scanning the archive by hand.
import fs from 'node:fs';
import path from 'node:path';

const cyclePath = path.join('data', 'cycle.json');
const newsletterDir = path.join('src', 'content', 'newsletter');

const events = JSON.parse(fs.readFileSync(cyclePath, 'utf8'));
const isMajor = (tags) => (tags || []).includes('season') || (tags || []).includes('eclipse');

const files = fs.readdirSync(newsletterDir).filter((f) => f.endsWith('.mdx'));
const covered = new Set();
for (const file of files) {
  const raw = fs.readFileSync(path.join(newsletterDir, file), 'utf8');
  const match = raw.match(/^relatedEvent:\s*"?([\d-]+)"?\s*$/m);
  if (match) covered.add(match[1]);
}

const now = new Date();
const majorEvents = events.filter((e) => isMajor(e.tags));
const missing = majorEvents.filter((e) => !covered.has(e.start.slice(0, 10)));
const upcoming = missing.filter((e) => new Date(e.start) >= now);
const past = missing.filter((e) => new Date(e.start) < now);

console.log(`Major events: ${majorEvents.length} total, ${covered.size} covered by a letter.`);
console.log(`\nMajor events without a letter yet (${missing.length} total, ${upcoming.length} upcoming):`);
for (const e of upcoming.slice(0, 10)) {
  const days = Math.round((new Date(e.start).getTime() - now.getTime()) / 86400000);
  console.log(`  - ${e.start.slice(0, 10)}  ${e.title}  (in ${days} days)`);
}
if (upcoming.length > 10) {
  console.log(`  ...and ${upcoming.length - 10} more upcoming.`);
}
if (past.length) {
  console.log(`\n${past.length} past major event(s) were never covered by a letter — not necessarily a problem, just visibility.`);
}
