/* ============================================================
   Génération de src/js/data/edt.js
   ------------------------------------------------------------
   Fige l'emploi du temps des trois promotions dans un fichier de
   données, pour que l'application soit utilisable dès l'ouverture,
   hors ligne, sans avoir à cliquer sur « Actualiser ».

   Usage :  npm run edt              (année universitaire courante)
            npm run edt -- 2026 2027 (bornes explicites)
            npm run edt -- --promos  (les groupes CELCAT trouvés)

   Toute la logique de dialogue avec CELCAT est dans celcat.js, à
   la racine : le bouton « Actualiser » de l'application appelle
   exactement les mêmes fonctions.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const celcat = require('../celcat');

async function main() {
  const args = process.argv.slice(2);
  const promos = await celcat.decouvrirPromotions();

  if (!promos.length) {
    throw new Error('Aucune promotion d’orthoptie trouvée — l’intitulé a peut-être changé côté université.');
  }

  if (args[0] === '--promos') {
    promos.forEach((p) => console.log(p.id.padEnd(16), p.label));
    return;
  }

  const an = celcat.anneeUniversitaire();
  const debut = Number(args[0]) || an.debut;
  const fin = Number(args[1]) || debut + 1;

  const groupes = {};
  let total = 0;

  for (const promo of promos) {
    const events = await celcat.lireGroupe(promo.id, debut, fin);
    groupes[promo.id] = { annee: promo.annee, label: promo.label, events: events };
    total += events.length;
    console.log(promo.label + ' (' + promo.id + ') : ' + events.length + ' séances');
  }

  const releve = new Date();
  const entete = [
    '/* ============================================================',
    "   Emploi du temps — Certificat de capacité d'orthoptiste, UPJV",
    '   ------------------------------------------------------------',
    '   FICHIER GÉNÉRÉ — ne pas modifier à la main.',
    '   Source : CELCAT (extra.u-picardie.fr/calendar), API publique.',
    '   Régénérer : npm run edt — ou le bouton « Actualiser » du',
    '   module Emploi du temps, qui écrit dans le stockage local.',
    '',
    '   Année universitaire ' + debut + '-' + fin + ', relevé du '
      + releve.toISOString().slice(0, 10) + '.',
    '   Chaque séance porte :',
    '     d, s, e : date (AAAA-MM-JJ), heure de début, heure de fin',
    '     t       : type de séance — CM, TD, CM/TD, TP, examen…',
    '     ue      : code d\'UE, tel qu\'employé par window.CURRICULUM',
    "     titre   : intitulé de l'UE dans l'emploi du temps",
    '     salle, site : localisation',
    '   ============================================================ */',
    ''
  ].join('\n');

  const contenu = entete + 'window.EDT = ' + JSON.stringify({
    source: 'CELCAT / UPJV',
    anneeUniversitaire: debut + '-' + fin,
    genere: releve.toISOString(),
    groupes: groupes
  }, null, 1) + ';\n';

  const cible = path.join(__dirname, '..', 'src', 'js', 'data', 'edt.js');
  fs.writeFileSync(cible, contenu, 'utf8');
  console.log('\n' + total + ' séances écrites dans src/js/data/edt.js');
}

main().catch((e) => { console.error('Échec :', e.message); process.exit(1); });
