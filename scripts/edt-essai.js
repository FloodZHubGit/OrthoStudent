/* ============================================================
   Lecture d'une séance CELCAT
   ------------------------------------------------------------
   La description d'une séance est une pile de lignes, et rien
   ne dit ce qu'est chacune. Le code d'origine prenait la ligne
   en UEnn pour l'UE et versait TOUT LE RESTE dans « salle ».
   Une remarque d'enseignant s'affichait donc comme un lieu, et
   une seconde UE aussi.

   Les cas ci-dessous reprennent les formes réellement observées
   sur les 584 séances de l'année — dix-sept libellés de salle,
   trois séances à deux UE — plus la remarque signalée par
   l'utilisateur. Aucun accès au réseau : un test ne doit pas
   dépendre du serveur de l'université.
   ============================================================ */
'use strict';
const celcat = require('../celcat');

/* CELCAT échappe le HTML : on garde les entités telles qu'elles arrivent,
   pour éprouver aussi le décodage. */
const CAS = [
  { nom: 'séance ordinaire',
    lignes: ['CM', 'CAPACITE D&#39;ORTHOPTISTE 1&#200;RE ANNEE (C1OPTI/261)',
      'UE12: D&#233;ontologie et &#233;thique : histoire de la profession',
      'D101 - Salle de cours - 41 Max'],
    attendu: { ue: 'UE12', salle: 'D101 - Salle de cours - 41 Max', note: undefined, aussi: undefined } },

  { nom: 'remarque de l’enseignant',
    lignes: ['CM', 'CAPACITE D&#39;ORTHOPTISTE 1&#200;RE ANNEE (C1OPTI/261)',
      'UE12: D&#233;ontologie et &#233;thique : histoire de la profession',
      'M&#233;thodologie de travail 1&#232;re partie',
      'D101 - Salle de cours - 41 Max'],
    attendu: { ue: 'UE12', salle: 'D101 - Salle de cours - 41 Max',
      note: 'Méthodologie de travail 1ère partie', aussi: undefined } },

  { nom: 'remarque sans salle',
    lignes: ['CM en distanciel', 'CAPACITE D&#39;ORTHOPTISTE 1&#200;RE ANNEE (C1OPTI/261)',
      'UE16 : Pathologies ophtalmologiques', 'Cours en ligne, lien envoy&#233; par mail'],
    attendu: { ue: 'UE16', salle: '', note: 'Cours en ligne, lien envoyé par mail', aussi: undefined } },

  { nom: 'deux UE sur la même séance',
    lignes: ['CM', 'CAPACITE D&#39;ORTHOPTISTE 1&#200;RE ANNEE (C1OPTI/261)',
      'UE12: D&#233;ontologie et &#233;thique : histoire de la profession',
      'UE08 : Physiologie appareil oculomoteur et vision binoculaire',
      'D101 - Salle de cours - 41 Max'],
    attendu: { ue: 'UE12', salle: 'D101 - Salle de cours - 41 Max', note: undefined, aussi: ['UE08'] } },

  { nom: 'salle entre crochets',
    lignes: ['TD', 'CAPACITE D&#39;ORTHOPTISTE 2&#200;ME ANNEE (C2OPTI/261)',
      'UE27 : Bilan et prise en charge orthoptique', 'M002 [Salle de cours]'],
    attendu: { ue: 'UE27', salle: 'M002 [Salle de cours]', note: undefined, aussi: undefined } },

  { nom: 'salle sans libellé',
    lignes: ['TD', 'CAPACITE D&#39;ORTHOPTISTE 3&#200;ME ANNEE (C3OPTI/261)',
      'UE33 : Explorations', 'G103'],
    attendu: { ue: 'UE33', salle: 'G103', note: undefined, aussi: undefined } },

  { nom: 'deux salles',
    lignes: ['TP', 'CAPACITE D&#39;ORTHOPTISTE 1&#200;RE ANNEE (C1OPTI/261)',
      'UE11 : Bilan orthoptique', 'D008 Salle TP', 'D203 - Salle de cours - 41 Max'],
    attendu: { ue: 'UE11', salle: 'D008 Salle TP / D203 - Salle de cours - 41 Max',
      note: undefined, aussi: undefined } },

  { nom: 'stage, sans UE ni salle',
    lignes: ['Stage', 'CAPACITE D&#39;ORTHOPTISTE 2&#200;ME ANNEE (C2OPTI/261)'],
    attendu: { ue: null, salle: '', note: undefined, aussi: undefined } }
];

function evenement(lignes) {
  return {
    start: '2026-09-08T14:00:00', end: '2026-09-08T16:00:00',
    eventCategory: lignes[0], sites: ['Campus - BAT D'],
    description: lignes.join('<br />')
  };
}

const dur = [];
console.log(CAS.length + ' formes de séance\n');

CAS.forEach(function (c) {
  const r = celcat.parseEvenement(evenement(c.lignes));
  const ecarts = [];
  Object.keys(c.attendu).forEach(function (k) {
    const a = c.attendu[k], v = r[k];
    const meme = Array.isArray(a) ? JSON.stringify(a) === JSON.stringify(v) : a === v;
    if (!meme) ecarts.push(k + ' : « ' + JSON.stringify(v) + ' » au lieu de « ' + JSON.stringify(a) + ' »');
  });
  console.log('  ' + (ecarts.length ? '✘' : '✔') + ' ' + c.nom);
  if (r.note) console.log('       remarque retenue : « ' + r.note + ' »');
  if (r.aussi) console.log('       UE supplémentaire : ' + r.aussi.join(', '));
  ecarts.forEach(function (e) { console.log('       ' + e); dur.push(c.nom + ' → ' + e); });
});

/* Le fichier de données livré doit être lisible avec les nouveaux champs. */
const fs = require('fs');
const path = require('path');
const w = {};
new Function('window', fs.readFileSync(path.join(__dirname, '..', 'src/js/data/edt.js'), 'utf8'))(w);
let seances = 0, notes = 0, doubles = 0, sallesLouches = 0;
Object.values((w.EDT || {}).groupes || {}).forEach(function (g) {
  (g.events || []).forEach(function (e) {
    seances++;
    if (e.note) notes++;
    if (e.aussi) doubles++;
    /* plus aucune « salle » ne doit ressembler à une UE ou à une phrase */
    if (e.salle && /^UE\s?\d/i.test(e.salle)) sallesLouches++;
  });
});
console.log('\ndonnées livrées : ' + seances + ' séances · ' + notes + ' remarque(s) · ' +
  doubles + ' séance(s) à deux UE · ' + sallesLouches + ' salle(s) qui sont en fait une UE');
if (sallesLouches) dur.push(sallesLouches + ' UE encore affichées comme des salles dans src/js/data/edt.js');

if (dur.length) {
  console.log('\n' + dur.length + ' problème(s) :');
  dur.forEach(function (d) { console.log('  · ' + d); });
  process.exit(1);
}
console.log('Chaque ligne de description est rangée là où elle doit l’être.');
