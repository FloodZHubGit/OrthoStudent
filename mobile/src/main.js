import './style.css';
import { discoverPromotions, fetchPlanning } from './celcat.js';
import { getPlanning, getPromo, setPlanning, setPromo } from './storage.js';

const app = document.querySelector('#app');
const state = { year: null, planning: null, weekStart: monday(new Date()), loading: false };

function monday(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
}

function addDays(value, count) {
  const date = new Date(value);
  date.setDate(date.getDate() + count);
  return date;
}

function iso(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function eventColor(type) {
  if (/examen|partiel/i.test(type)) return 'red';
  if (/stage/i.test(type)) return 'green';
  if (/vacances|férié|ferie/i.test(type)) return 'gray';
  if (/TP/i.test(type)) return 'violet';
  if (/TD/i.test(type)) return 'blue';
  return 'orange';
}

function promoScreen(message = '') {
  app.innerHTML = `
    <main class="onboarding">
      <div class="brand-mark" aria-hidden="true">OP</div>
      <p class="eyebrow">UPJV · ORTHOPTIE</p>
      <h1>Ton planning,<br>toujours sous la main.</h1>
      <p class="intro">Choisis ta promotion. L'emploi du temps restera disponible même sans réseau.</p>
      ${message ? `<p class="alert">${escapeHtml(message)}</p>` : ''}
      <div class="promo-grid" aria-label="Choisir sa promotion">
        ${[1, 2, 3].map((year) => `<button class="promo" data-year="${year}"><small>Promotion</small><strong>L${year}</strong><span>${year === 1 ? '1re' : year + 'e'} année</span></button>`).join('')}
      </div>
      <p class="fineprint">Tu pourras changer de promotion plus tard.</p>
    </main>`;
  app.querySelectorAll('.promo').forEach((button) => button.addEventListener('click', () => choosePromo(Number(button.dataset.year))));
}

async function choosePromo(year) {
  state.year = year;
  await setPromo(year);
  state.planning = await getPlanning(year);
  render();
  if (!state.planning) refresh();
}

function formatUpdate(date) {
  if (!date) return 'Jamais actualisé';
  return `Mis à jour le ${new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(date))}`;
}

function weekLabel() {
  const end = addDays(state.weekStart, 6);
  const first = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(state.weekStart);
  const last = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(end);
  return `${first} — ${last}`;
}

function eventCard(event) {
  const location = [event.room, event.site].filter(Boolean).join(' · ');
  const title = event.title || event.note || event.type || 'Séance';
  return `<article class="event ${eventColor(event.type)}">
    <div class="time"><strong>${escapeHtml(event.start)}</strong><span>${escapeHtml(event.end || '')}</span></div>
    <div class="event-body">
      <div class="tags"><span>${escapeHtml(event.type || 'Cours')}</span>${event.ue ? `<span>${escapeHtml(event.ue)}</span>` : ''}</div>
      <h3>${escapeHtml(title)}</h3>
      ${location ? `<p>${escapeHtml(location)}</p>` : ''}
      ${event.note && event.title ? `<p class="note">${escapeHtml(event.note)}</p>` : ''}
    </div>
  </article>`;
}

function daysHtml() {
  const today = iso(new Date());
  const events = state.planning?.events || [];
  let html = '';
  for (let offset = 0; offset < 7; offset += 1) {
    const date = addDays(state.weekStart, offset);
    const key = iso(date);
    const dayEvents = events.filter((event) => event.date === key);
    const label = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date);
    html += `<section class="day ${key === today ? 'today' : ''}">
      <header><span>${escapeHtml(label)}</span><strong>${date.getDate()}</strong>${key === today ? '<em>Aujourd’hui</em>' : ''}</header>
      <div class="day-events">${dayEvents.length ? dayEvents.map(eventCard).join('') : '<p class="empty">Aucune séance</p>'}</div>
    </section>`;
  }
  return html;
}

function render() {
  if (!state.year) return promoScreen();
  const count = state.planning?.events?.length || 0;
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div><p class="eyebrow">ORTHO PLANNING</p><h1>L${state.year} <span>${state.planning?.academicYear || ''}</span></h1></div>
        <button class="icon-button" id="settings" aria-label="Changer de promotion">L${state.year}</button>
      </header>
      <main>
        <div class="status-row">
          <div><strong>${formatUpdate(state.planning?.updatedAt)}</strong><span>${count ? count + ' séances en mémoire' : 'Connexion nécessaire au premier chargement'}</span></div>
          <button class="refresh" id="refresh" ${state.loading ? 'disabled' : ''}>${state.loading ? '<i></i> Chargement' : '↻ Actualiser'}</button>
        </div>
        <nav class="week-nav" aria-label="Navigation entre les semaines">
          <button id="previous" aria-label="Semaine précédente">‹</button>
          <button id="today"><strong>${weekLabel()}</strong><span>Revenir à aujourd’hui</span></button>
          <button id="next" aria-label="Semaine suivante">›</button>
        </nav>
        <div id="message" aria-live="polite"></div>
        <div class="days">${daysHtml()}</div>
      </main>
    </div>`;
  app.querySelector('#settings').addEventListener('click', () => promoScreen());
  app.querySelector('#refresh').addEventListener('click', refresh);
  app.querySelector('#previous').addEventListener('click', () => moveWeek(-7));
  app.querySelector('#next').addEventListener('click', () => moveWeek(7));
  app.querySelector('#today').addEventListener('click', () => { state.weekStart = monday(new Date()); render(); });
}

function moveWeek(days) {
  state.weekStart = addDays(state.weekStart, days);
  render();
}

function showMessage(text, kind = '') {
  const box = document.querySelector('#message');
  if (box) box.innerHTML = `<p class="message ${kind}">${escapeHtml(text)}</p>`;
}

async function refresh() {
  if (state.loading) return;
  state.loading = true;
  render();
  try {
    showMessage('Recherche de ta promotion sur CELCAT…');
    const promotions = await discoverPromotions();
    const promo = promotions.find((item) => item.year === state.year);
    if (!promo) throw new Error(`La promotion L${state.year} n'a pas été trouvée sur CELCAT.`);
    const planning = await fetchPlanning(promo, (current, total) => showMessage(`Téléchargement de l'emploi du temps… ${current}/${total}`));
    if (!planning.events.length) throw new Error('Aucune séance trouvée pour cette promotion cette année.');
    await setPlanning(state.year, planning);
    state.planning = planning;
    render();
    showMessage(`${planning.events.length} séances enregistrées sur cet appareil.`, 'success');
  } catch (error) {
    render();
    showMessage(error.message || 'Actualisation impossible.', 'error');
  } finally {
    state.loading = false;
    const button = document.querySelector('#refresh');
    if (button) { button.disabled = false; button.textContent = '↻ Actualiser'; }
  }
}

async function start() {
  state.year = await getPromo();
  if (state.year) state.planning = await getPlanning(state.year);
  render();
}

start();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
