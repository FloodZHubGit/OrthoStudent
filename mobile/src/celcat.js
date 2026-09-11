import { Capacitor, CapacitorHttp } from '@capacitor/core';

const ORIGIN = 'https://extra.u-picardie.fr/calendar';
const TYPE_GROUPE = '103';
const HEADERS = { 'X-Requested-With': 'XMLHttpRequest' };

function endpoint(path) {
  return Capacitor.isNativePlatform() ? ORIGIN + path : '/api/celcat' + path;
}

async function request(path, body) {
  const options = {
    url: endpoint(path),
    method: body ? 'POST' : 'GET',
    headers: body
      ? { ...HEADERS, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      : HEADERS,
    connectTimeout: 20000,
    readTimeout: 20000,
    responseType: 'json'
  };
  if (body) options.data = body;

  let response;
  try {
    response = await CapacitorHttp.request(options);
  } catch {
    throw new Error('Connexion impossible à CELCAT. Vérifie ta connexion internet.');
  }
  if (response.status >= 400) {
    throw new Error(`CELCAT a répondu ${response.status}. Réessaie dans quelques minutes.`);
  }
  if (typeof response.data === 'string') {
    try { return JSON.parse(response.data); }
    catch { throw new Error('CELCAT a renvoyé une réponse illisible.'); }
  }
  return response.data;
}

function decodeHtml(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return String(value || '')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, n) => named[n]);
}

const IS_UE = /^UE\s?\d+/i;
// Les nouveaux bâtiments utilisent aussi des codes comme STL-M105.
const IS_ROOM = /^[A-Z][A-Z0-9-]*\d{2,3}\b/;

export function parseEvent(event) {
  const lines = decodeHtml(event.description)
    .split(/<br\s*\/?>/i)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(1)
    .filter((line) => !/\([A-Z0-9]+\/\d+\)$/.test(line));
  const ues = lines.filter((line) => IS_UE.test(line));
  const rest = lines.filter((line) => !IS_UE.test(line));
  const code = (line) => `UE${String(line.match(/^UE\s?(\d+)/i)[1]).padStart(2, '0')}`;
  const notes = rest.filter((line) => !IS_ROOM.test(line));

  return {
    id: event.id,
    date: event.start.slice(0, 10),
    start: event.start.slice(11, 16),
    end: (event.end || '').slice(11, 16),
    type: event.eventCategory || '',
    ue: ues.length ? code(ues[0]) : null,
    title: ues.length ? ues[0].replace(/^UE\s?\d+\s*:?\s*/i, '').trim() : '',
    room: rest.filter((line) => IS_ROOM.test(line)).join(' / '),
    site: (event.sites || [])[0] || '',
    also: ues.length > 1 ? ues.slice(1).map(code) : undefined,
    note: notes.length ? notes.join(' · ') : undefined
  };
}

function yearFromLabel(text) {
  if (/1\s*(?:È|E|RE)/i.test(text)) return 1;
  if (/2\s*(?:È|E|EME)/i.test(text)) return 2;
  if (/3\s*(?:È|E|EME)/i.test(text)) return 3;
  return null;
}

function vintage(id) {
  return Number(String(id).match(/\/(\d+)$/)?.[1] || 0);
}

export async function discoverPromotions() {
  const data = await request('/Home/ReadResourceListItems?myResources=false&searchTerm=capacite&pageSize=50&pageNumber=1&resType=' + TYPE_GROUPE);
  const latest = {};
  for (const item of data.results || []) {
    if (!/ORTHOPTIST/i.test(item.text) || /^PROMO/i.test(item.id)) continue;
    const year = yearFromLabel(item.text);
    if (!year) continue;
    const promo = { id: item.id, year, label: `L${year} · Capacité d'orthoptiste` };
    if (!latest[year] || vintage(promo.id) > vintage(latest[year].id)) latest[year] = promo;
  }
  return Object.values(latest).sort((a, b) => a.year - b.year);
}

export function academicYear(date = new Date()) {
  const start = date.getMonth() >= 7 ? date.getFullYear() : date.getFullYear() - 1;
  return { start, end: start + 1, label: `${start}-${start + 1}` };
}

function windows(startYear, endYear) {
  const result = [];
  let year = startYear;
  let month = 9;
  while (year < endYear || (year === endYear && month <= 8)) {
    const pad = (n) => String(n).padStart(2, '0');
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    result.push([`${year}-${pad(month)}-01`, `${year}-${pad(month)}-${lastDay}`]);
    month += 1;
    if (month > 12) { month = 1; year += 1; }
  }
  return result;
}

export async function fetchPlanning(promo, onProgress = () => {}) {
  const academic = academicYear();
  const periods = windows(academic.start, academic.end);
  const seen = new Set();
  const events = [];
  for (let index = 0; index < periods.length; index += 1) {
    const [start, end] = periods[index];
    onProgress(index + 1, periods.length);
    const body = `start=${start}&end=${end}&resType=${TYPE_GROUPE}&calView=month&colourScheme=3&federationIds%5B%5D=${encodeURIComponent(promo.id)}`;
    const raw = await request('/Home/GetCalendarData', body);
    for (const event of raw || []) {
      if (seen.has(event.id)) continue;
      seen.add(event.id);
      events.push(parseEvent(event));
    }
  }
  events.sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
  return {
    promo,
    academicYear: academic.label,
    updatedAt: new Date().toISOString(),
    events
  };
}
