import fs from "node:fs";
import path from "node:path";

const events = JSON.parse(fs.readFileSync("data/cycle.json", "utf8"));
const out = path.join("public", "earthsong.ics");

function toIcsDate(v) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    // All-day
    const start = v.replaceAll("-", "");
    const endDate = new Date(v + "T00:00:00Z");
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    const end = endDate.toISOString().slice(0,10).replaceAll("-", "");
    return { allDay: true, DTSTART: start, DTEND: end };
  }
  // Timed with offset -> to UTC
  const d = new Date(v);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const start = fmt(d);
  const end = fmt(new Date(d.getTime() + 60 * 60 * 1000)); // default 1h
  return { allDay: false, DTSTART: start, DTEND: end };
}

const lines = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//earthsong.io//Earthsong Cycles//EN",
  "CALSCALE:GREGORIAN",
  "X-WR-CALNAME:Earthsong Sacred Cycles",
  "X-WR-TIMEZONE:UTC"
];

for (const e of events) {
  const { allDay, DTSTART, DTEND } = toIcsDate(e.start);
  const uid = (e.title + e.start).toLowerCase().replace(/[^a-z0-9]+/g, "-") + "@earthsong.io";
  lines.push(
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `SUMMARY:${e.title}`,
    e.tags?.length ? `CATEGORIES:${e.tags.join(",")}` : "",
    allDay ? `DTSTART;VALUE=DATE:${DTSTART}` : `DTSTART:${DTSTART}`,
    allDay ? `DTEND;VALUE=DATE:${DTEND}` : `DTEND:${DTEND}`,
    "END:VEVENT"
  );
}

lines.push("END:VCALENDAR");
fs.mkdirSync("public", { recursive: true });
fs.writeFileSync(out, lines.filter(Boolean).join("\n"), "utf8");
console.log(`Wrote ${out}`);