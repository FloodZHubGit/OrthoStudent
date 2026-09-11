import test from 'node:test';
import assert from 'node:assert/strict';
import { academicYear, parseEvent } from '../src/celcat.js';

test('détermine l’année universitaire au changement de rentrée', () => {
  assert.deepEqual(academicYear(new Date(2026, 6, 31)), { start: 2025, end: 2026, label: '2025-2026' });
  assert.deepEqual(academicYear(new Date(2026, 7, 1)), { start: 2026, end: 2027, label: '2026-2027' });
});

test('convertit une séance CELCAT en événement mobile', () => {
  const event = parseEvent({
    id: 'event-1',
    start: '2026-09-09T08:30:00',
    end: '2026-09-09T12:30:00',
    eventCategory: 'CM/TD',
    sites: ['Sciences - Bâtiment des Minimes'],
    description: "CM/TD<br />CAPACITE D&#39;ORTHOPTISTE 1&#200;RE ANNEE (C1OPTI/261)<br />UE2 : Optique g&#233;om&#233;trique<br />STL-M105 [Salle de cours]"
  });
  assert.equal(event.date, '2026-09-09');
  assert.equal(event.start, '08:30');
  assert.equal(event.end, '12:30');
  assert.equal(event.ue, 'UE02');
  assert.equal(event.title, 'Optique géométrique');
  assert.equal(event.room, 'STL-M105 [Salle de cours]');
});
