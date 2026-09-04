/* ============================================================
   Client CELCAT — l'emploi du temps de l'université
   ------------------------------------------------------------
   L'extranet https://extra.u-picardie.fr/calendar/ tourne sous
   CELCAT v8 et expose une API JSON publique, sans compte. Ce
   fichier en est le seul point d'accès ; il tourne dans Node,
   donc côté processus principal d'Electron ou en ligne de
   commande — jamais dans la page, qui se ferait refuser par le
   navigateur (le serveur n'envoie aucun en-tête CORS).

   Deux usages, une seule logique :
     - `npm run edt` fige l'emploi du temps dans src/js/data/edt.js,
       ce qui donne une application utilisable dès l'installation ;
     - le bouton « Actualiser » du module Emploi du temps rappelle
       les mêmes fonctions par IPC, pour ceux qui n'ont ni le dépôt
       ni Node installé.

   Rien n'est codé en dur : les identifiants de groupe portent le
   millésime de l'année universitaire (C2OPTI/261 → 2026-2027) et
   changent donc à chaque rentrée. On les redécouvre à chaque fois.
   ============================================================ */

'use strict';

const https = require('https');

const HOTE = 'extra.u-picardie.fr';
const BASE = '/calendar';
const TYPE_GROUPE = '103';        // le seul type de ressource ouvert au public

/* ------------------------------------------------------------
   Transport
   ------------------------------------------------------------ */

function requete(chemin, corps) {
  return new Promise((resolve, reject) => {
    const entetes = { 'X-Requested-With': 'XMLHttpRequest' };
    if (corps) {
      entetes['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      entetes['Content-Length'] = Buffer.byteLength(corps);
    }
    const req = https.request({
      host: HOTE, path: BASE + chemin, method: corps ? 'POST' : 'GET',
      headers: entetes, agent: false
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error('L’extranet a répondu ' + res.statusCode + ' — réessayez plus tard.'));
          return;
        }
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Réponse illisible de l’extranet (format inattendu).')); }
      });
    });
    req.setTimeout(20000, () => req.destroy(new Error('L’extranet ne répond pas (délai dépassé).')));
    req.on('error', (e) => reject(new Error(e.message === 'socket hang up'
      ? 'Connexion interrompue par l’extranet.' : 'Pas de connexion : ' + e.message)));
    if (corps) req.write(corps);
    req.end();
  });
}

/* ------------------------------------------------------------
   Décodage des séances
   ------------------------------------------------------------ */

/* CELCAT renvoie du HTML échappé dans `description`, et Node n'a pas de DOM :
   on décode les entités qui apparaissent réellement — numériques, et la
   poignée de nommées usuelles. */
function decode(s) {
  const nommees = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return String(s)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, n) => nommees[n]);
}

const EST_UE = /^UE\s?\d+/i;

/* Une salle commence toujours par son code : D101, M002, G103, E113, H22…
   Relevé sur les 584 séances de l'année, les dix-sept libellés de salle
   suivent tous cette forme, sans exception.

   La distinction compte, parce que le code précédent versait dans « salle »
   TOUT ce qui n'était pas l'UE. Une remarque d'enseignant — « Méthodologie de
   travail, 1ère partie » — s'affichait donc comme un lieu, et une seconde UE
   aussi : trois séances de l'année portent deux UE, et la deuxième était
   présentée à l'étudiant comme une salle. */
const EST_SALLE = /^[A-Z]{1,2}\s?\d{2,3}\b/;

/* La description est une pile de lignes séparées par <br /> : la catégorie,
   puis un ou plusieurs groupes — un cours mutualisé en cite plusieurs, un
   examen commun aux trois années aussi —, puis les intitulés d'UE, les salles,
   et le cas échéant une remarque. On écarte la catégorie et les groupes, qu'on
   reconnaît à leur code entre parenthèses ; le reste se départage en trois :
   les lignes en UEnn, les salles à leur code, et ce qui n'est ni l'un ni
   l'autre — la remarque. */
function parseEvenement(ev) {
  const lignes = decode(ev.description || '')
    .split(/<br\s*\/?>/i)
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(1)
    .filter((l) => !/\([A-Z0-9]+\/\d+\)$/.test(l));

  const ues = lignes.filter((l) => EST_UE.test(l));
  const reste = lignes.filter((l) => !EST_UE.test(l));
  /* CELCAT écrit « UE4 », le référentiel « UE04 » : on complète à deux
     chiffres pour que les deux se rejoignent sans table de correspondance. */
  const code = (l) => 'UE' + String(l.match(/^UE\s?(\d+)/i)[1]).padStart(2, '0');

  const notes = reste.filter((l) => !EST_SALLE.test(l));

  return {
    d: ev.start.slice(0, 10),
    s: ev.start.slice(11, 16),
    e: (ev.end || '').slice(11, 16),
    t: ev.eventCategory || '',
    ue: ues.length ? code(ues[0]) : null,
    titre: ues.length ? ues[0].replace(/^UE\s?\d+\s*:?\s*/i, '').trim() : '',
    salle: reste.filter((l) => EST_SALLE.test(l)).join(' / '),
    site: (ev.sites || [])[0] || '',
    /* Émis seulement quand ils existent : JSON.stringify laisse tomber les
       undefined, le fichier de données ne s'alourdit donc pas d'un champ vide
       répété six cents fois. */
    aussi: ues.length > 1 ? ues.slice(1).map(code) : undefined,
    note: notes.length ? notes.join(' · ') : undefined
  };
}

/* ------------------------------------------------------------
   Découverte des promotions
   ------------------------------------------------------------ */

const ANNEES = [[/1\s*[ÈE]RE/i, 1], [/2\s*[ÈE]ME/i, 2], [/3\s*[ÈE]ME/i, 3]];

function anneeDuLibelle(txt) {
  for (const [re, n] of ANNEES) if (re.test(txt)) return n;
  return null;
}

/* Le millésime est le nombre après la barre : 261 pour 2026-2027. Il sert à
   départager deux groupes de même année — celui de l'an dernier traîne dans
   le référentiel, vide, à côté de celui de cette année. */
function millesime(id) {
  const m = String(id).match(/\/(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
}

/* Les promotions d'orthoptie, la plus récente d'abord pour chaque année.
   Rien n'est codé en dur : si l'université renomme ou renumérote, la
   recherche suit — c'est la seule façon qu'une application distribuée à
   d'autres tienne au-delà de la rentrée suivante. */
async function decouvrirPromotions() {
  const j = await requete('/Home/ReadResourceListItems?myResources=false'
    + '&searchTerm=capacite&pageSize=50&pageNumber=1&resType=' + TYPE_GROUPE);

  const brutes = (j.results || [])
    .filter((x) => /ORTHOPTIST/i.test(x.text) && !/^PROMO/i.test(x.id))
    .map((x) => ({
      id: x.id,
      annee: anneeDuLibelle(x.text),
      millesime: millesime(x.id),
      label: 'Capacité d’orthoptiste — ' + (anneeDuLibelle(x.text) === 1 ? '1ère' : anneeDuLibelle(x.text) + 'ème') + ' année'
    }))
    .filter((x) => x.annee);

  /* une seule entrée par année : le millésime le plus haut */
  const par = {};
  brutes.forEach((g) => {
    if (!par[g.annee] || g.millesime > par[g.annee].millesime) par[g.annee] = g;
  });
  return Object.keys(par).map((k) => par[k]).sort((a, b) => a.annee - b.annee);
}

/* ------------------------------------------------------------
   Récupération d'un emploi du temps
   ------------------------------------------------------------ */

/* Découpage mois par mois : CELCAT tronque les fenêtres trop larges — une
   requête sur l'année entière s'arrête au bout de deux mois. */
function fenetres(anneeDebut, anneeFin) {
  const out = [];
  const p = (n) => String(n).padStart(2, '0');
  let a = anneeDebut, m = 9;
  while (a < anneeFin || (a === anneeFin && m <= 8)) {
    const dernier = new Date(Date.UTC(a, m, 0)).getUTCDate();
    out.push([a + '-' + p(m) + '-01', a + '-' + p(m) + '-' + dernier]);
    m++;
    if (m > 12) { m = 1; a++; }
  }
  return out;
}

/* L'année universitaire en cours : elle bascule en août, pas en janvier. */
function anneeUniversitaire(ref) {
  const d = ref || new Date();
  const debut = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1;
  return { debut: debut, fin: debut + 1, label: debut + '-' + (debut + 1) };
}

async function lireGroupe(federationId, debut, fin) {
  const vus = new Set();
  const events = [];

  for (const [d, f] of fenetres(debut, fin)) {
    const corps = 'start=' + d + '&end=' + f + '&resType=' + TYPE_GROUPE
      + '&calView=month&colourScheme=3'
      + '&federationIds%5B%5D=' + encodeURIComponent(federationId);
    const bruts = await requete('/Home/GetCalendarData', corps);
    (bruts || []).forEach((ev) => {
      if (vus.has(ev.id)) return;        // un cours à cheval sur deux mois sort deux fois
      vus.add(ev.id);
      events.push(parseEvenement(ev));
    });
  }

  events.sort((a, b) => (a.d + a.s).localeCompare(b.d + b.s));
  return events;
}

/* Un groupe complet, prêt à être stocké. `promo` vient de decouvrirPromotions.
   Une promotion sans la moindre séance est signalée comme telle : c'est le
   symptôme d'un millésime périmé, pas d'une erreur réseau. */
async function recupererPromotion(promo, ref) {
  const an = anneeUniversitaire(ref);
  const events = await lireGroupe(promo.id, an.debut, an.fin);
  return {
    id: promo.id,
    annee: promo.annee,
    label: promo.label,
    anneeUniversitaire: an.label,
    genere: new Date().toISOString(),
    events: events
  };
}

module.exports = {
  decouvrirPromotions,
  recupererPromotion,
  lireGroupe,
  anneeUniversitaire,
  parseEvenement,
  fenetres
};
