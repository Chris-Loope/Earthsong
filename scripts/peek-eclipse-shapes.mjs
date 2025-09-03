import * as A from 'astronomy-engine';

const year = 2025;
const start = new A.AstroTime(new Date(Date.UTC(year, 0, 1)));

const sol = A.SearchGlobalSolarEclipse(start);
const lun = A.SearchLunarEclipse(start);

console.log('astronomy-engine version OK');
console.log('SOL RAW KEYS:', sol && Object.keys(sol));
console.log('SOL RAW:', sol);
console.log('LUN RAW KEYS:', lun && Object.keys(lun));
console.log('LUN RAW:', lun);