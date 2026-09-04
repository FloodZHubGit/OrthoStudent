/* ============================================================
   Audit de complétude du cours, UE par UE
   ------------------------------------------------------------
   `audit-donnees.js` vérifie que les renvois entre banques sont
   cohérents : aucun lien mort, aucun décalage d'index. Il ne dit
   rien de ce qui MANQUE — une UE dont la moitié des parties de
   cours n'ont ni image, ni exemple, ni phrase clé passe son
   contrôle sans un mot, parce que tous ces champs sont
   facultatifs.

   Ce script-ci répond à une autre question, et à une seule :
   les champs sont-ils REMPLIS ? Il parcourt les quatre couches
   d'une fiche —

     ueguide  : le plan, les chiffres, les notions, les pièges…
     uecours  : l'image, l'exemple clinique, l'erreur, la clé
     uexpand  : le vocabulaire et les questions d'oral
     uedeep   : les tableaux, le cas, le plan de réponse, la mnémo

   — et rapporte, par UE, ce qui est absent et ce qui est maigre.

   Ce qu'il NE dit pas, et ne peut pas dire :

     · si le contenu est juste. Il ne connaît aucune référence.
     · s'il est à jour. Les recommandations bougent, pas les fiches.
     · s'il est COMPLET au sens du programme réellement enseigné.
       L'application n'a jamais reçu de syllabus : le découpage de
       chaque UE en parties est une reconstruction à partir de son
       seul intitulé. Un audit ne peut mesurer une couverture
       contre une référence qui n'existe pas dans le dépôt.

   Autrement dit : il vérifie la cohérence interne d'un contenu
   inventé. C'est utile — cela empêche les fiches à moitié vides —
   mais cela ne vaut pas validation.

       node scripts/audit-cours.js            tout le référentiel
       node scripts/audit-cours.js S1 S2      deux semestres

   Il ne rend jamais un code d'erreur : une fiche incomplète est
   un travail à faire, pas une régression à bloquer.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src', 'js', 'data');
const win = {};
['curriculum', 'ueguide', 'ueguide2', 'uecours', 'uexpand', 'uedeep', 'uedeep2']
  .forEach((f) => new Function('window', fs.readFileSync(path.join(SRC, f + '.js'), 'utf8'))(win));

/* ueguide2 et uedeep2 complètent leurs aînés plutôt que de les remplacer */
const GUIDE = win.UE_GUIDE || {};
const COURS = win.UE_COURS || {};
const EXTRA = win.UE_EXTRA || {};
const DEEP = win.UE_DEEP || {};

/* Le glossaire de l'application est un glossaire CLINIQUE. Certaines UE
   n'ont donc aucun mot à y prendre : les statistiques, la méthodologie
   documentaire, l'exercice professionnel, le mémoire, la coordination et
   la pédagogie ne parlent pas d'orthoptie — elles parlent d'un métier.
   Leur vocabulaire vide est une décision, pas un oubli : on l'écrit ici
   plutôt que de laisser l'audit signaler éternellement un faux trou, ou
   de le combler avec des termes hors sujet. */
const SANS_VOCABULAIRE = {
  UE21: 'statistiques et santé publique', UE28: 'méthodologie documentaire',
  UE34: 'exercice professionnel', UE38: 'travail de fin d’études',
  UE39: 'coordination', UE40: 'accompagnement et pédagogie'
};

/* Les UE sans contenu disciplinaire propre n'ont pas de fiche à remplir. */
const HORS = { UE06: 'anglais', 'UE libre': 'UE libre' };

/* Les seuils au-dessous desquels une rubrique est « maigre ». Ils viennent de
   ce que les fiches les mieux fournies contiennent déjà, pas d'une norme. */
const SEUIL = { chiffres: 5, notions: 3, pieges: 3, tombe: 3, qr: 5, mots: 6, tableaux: 2 };

const semestres = process.argv.slice(2).filter((a) => /^S[1-6]$/.test(a));

let totalManques = 0, totalMaigres = 0, fiches = 0;
const sansFig = [];

(win.CURRICULUM || []).forEach((sem) => {
  if (semestres.length && semestres.indexOf(sem.id) < 0) return;

  console.log('\n' + '═'.repeat(78));
  console.log(sem.id + ' — ' + sem.label);
  console.log('═'.repeat(78));

  sem.ues.forEach((u) => {
    const code = u.code;
    if (HORS[code]) { console.log('\n' + code.padEnd(6) + '— ' + HORS[code] + ', pas de fiche attendue'); return; }

    const g = GUIDE[code], c = COURS[code] || [], x = EXTRA[code] || {}, d = DEEP[code] || {};
    fiches++;

    const manque = [], maigre = [], ok = [];

    if (!g) {
      console.log('\n' + code.padEnd(6) + '— AUCUNE FICHE');
      totalManques++;
      return;
    }

    /* --- couche 1 : la fiche elle-même --- */
    [['resume', 'le résumé en une phrase'], ['methode', 'la méthode de travail']].forEach((f) => {
      if (!g[f[0]]) manque.push(f[1]);
    });
    [['objectifs', 'objectifs'], ['plan', 'plan'], ['chiffres', 'chiffres'],
     ['notions', 'notions'], ['pieges', 'pièges'], ['tombe', 'ce qui tombe']].forEach((f) => {
      const n = (g[f[0]] || []).length;
      if (!n) manque.push(f[1]);
      else if (SEUIL[f[0]] && n < SEUIL[f[0]]) maigre.push(f[1] + ' : ' + n + ' (attendu ≥ ' + SEUIL[f[0]] + ')');
      else ok.push(f[1] + ' ' + n);
    });

    /* --- couche 2 : le cours vivant, partie par partie --- */
    const plan = g.plan || [];
    const vides = [], partiels = [], figs = [];
    plan.forEach((p, i) => {
      const e = c[i] || {};
      const champs = ['img', 'ex', 'cle', 'err'].filter((k) => e[k]);
      const titre = String(p.t).replace(/^\s*\d+\s*·\s*/, '');
      if (!champs.length) vides.push(titre);
      else if (champs.length < 3) partiels.push(titre + ' (' + champs.join('/') + ')');
      if (e.fig) figs.push(e.fig); else sansFig.push(code + ' · ' + titre);
      if (!e.cle) manque.push('phrase clé — partie « ' + titre + ' »');
    });
    if (c.length > plan.length) manque.push('uecours a ' + (c.length - plan.length) + ' entrée(s) de trop');
    if (vides.length) manque.push(vides.length + ' partie(s) de cours sans aucun encart : ' + vides.join(' · '));
    if (partiels.length) maigre.push('parties à un ou deux encarts : ' + partiels.join(' · '));

    /* --- couche 3 : vocabulaire et questions d'oral --- */
    if (!x.qr) manque.push('questions d’auto-interrogation');
    else if (x.qr.length < SEUIL.qr) maigre.push('questions d’oral : ' + x.qr.length + ' (attendu ≥ ' + SEUIL.qr + ')');
    else ok.push('questions ' + x.qr.length);
    if (SANS_VOCABULAIRE[code]) ok.push('sans vocabulaire clinique — ' + SANS_VOCABULAIRE[code]);
    else if (!x.mots) manque.push('vocabulaire (mots du glossaire)');
    else if (x.mots.length < SEUIL.mots) maigre.push('vocabulaire : ' + x.mots.length + ' mots');
    else ok.push('mots ' + x.mots.length);
    if (!x.prereq) manque.push('prérequis déclarés');

    /* --- couche 4 : la couche examen --- */
    if (!d.tableaux || !d.tableaux.length) manque.push('tableaux de comparaison');
    else if (d.tableaux.length < SEUIL.tableaux) maigre.push('tableaux : ' + d.tableaux.length);
    else ok.push('tableaux ' + d.tableaux.length);
    if (!d.cas) manque.push('cas d’application');
    if (!d.reponse) manque.push('plan de réponse type');
    if (!d.mnemo || !d.mnemo.length) manque.push('moyens mnémotechniques');

    /* --- rapport --- */
    const etat = manque.length ? '✗' : maigre.length ? '~' : '✓';
    console.log('\n' + etat + ' ' + code.padEnd(6) + u.title);
    console.log('   ' + plan.length + ' parties · ' + figs.length + ' schéma(s) · ' + ok.join(' · '));
    manque.forEach((m) => console.log('   MANQUE  ' + m));
    maigre.forEach((m) => console.log('   maigre  ' + m));
    totalManques += manque.length;
    totalMaigres += maigre.length;
  });
});

console.log('\n' + '═'.repeat(78));
console.log(fiches + ' fiches examinées · ' + totalManques + ' manque(s) · ' + totalMaigres + ' rubrique(s) maigre(s)');
console.log(sansFig.length + ' parties de cours sans schéma');
if (!totalManques) {
  console.log('Toutes les couches sont remplies — présence vérifiée, exactitude non.');
  console.log('Le contenu n’est adossé à aucune source : il se corrige depuis les fiches.');
}
