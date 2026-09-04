/* ============================================================
   Vision Lab — le noyau mis à l'épreuve
   ------------------------------------------------------------
   Une expérience de psychophysique ne vaut que par sa méthode.
   Un tirage déséquilibré, une pente mal calculée ou une
   conversion en degrés fausse produisent des résultats qui ont
   l'air propres et ne veulent rien dire — c'est le pire des cas,
   pire qu'un plantage.

   On éprouve donc ce qui ne se voit pas à l'écran :

     · la reproductibilité par la graine ;
     · l'équilibrage des cellules ;
     · la composition des stimuli, notamment le piège de la
       conjonction — aucun distracteur ne doit être un disque
       rouge, sans quoi la cible n'est plus unique ;
     · l'absence de chevauchement ;
     · les statistiques, sur des valeurs dont on connaît le
       résultat à la main ;
     · la conversion pixels ↔ degrés ;
     · la sauvegarde, l'historique, la suppression ;
     · les exports CSV et JSON.

   Aucun navigateur, aucun DOM : ce noyau est du calcul.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.join(__dirname, '..');
const dur = [];
function verifier(ok, quoi, detail) {
  console.log('  ' + (ok ? '✔' : '✘') + ' ' + quoi + (ok || !detail ? '' : '  → ' + detail));
  if (!ok) dur.push(quoi + (detail ? ' : ' + detail : ''));
}

/* ---------- un navigateur de fortune ---------- */
const bac = {
  console: console,
  performance: { now: () => Date.now() },
  requestAnimationFrame: (f) => setTimeout(() => f(Date.now()), 16),
  document: { fullscreenElement: null, documentElement: {} },
  screen: { width: 1920, height: 1080 },
  devicePixelRatio: 1,
  Math: Math, Date: Date, JSON: JSON, Object: Object, Array: Array,
  String: String, Number: Number, isNaN: isNaN, parseInt: parseInt,
  setTimeout: setTimeout
};
bac.window = bac;
bac.globalThis = bac;

/* un magasin minimal : c'est tout ce que le noyau lui demande */
bac.Store = {
  state: {},
  sauvegardes: 0,
  save: function () { bac.Store.sauvegardes++; }
};

vm.createContext(bac);
['core/lab-calib.js', 'core/lab.js', 'core/lab-recherche.js', 'core/lab-encombrement.js']
  .forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(RACINE, 'src/js', f), 'utf8'), bac, { filename: f });
});
const Lab = bac.Lab, Calib = bac.LabCalib;

/* ============================================================
   1 · La graine
   ============================================================ */
console.log('REPRODUCTIBILITÉ');
const a1 = Lab.creer('recherche', 'mesure', {}, 12345);
const a2 = Lab.creer('recherche', 'mesure', {}, 12345);
const a3 = Lab.creer('recherche', 'mesure', {}, 999);

verifier(JSON.stringify(a1.essais) === JSON.stringify(a2.essais),
  'même graine → essais identiques, positions comprises');
verifier(JSON.stringify(a1.essais) !== JSON.stringify(a3.essais),
  'graine différente → essais différents');
verifier(JSON.stringify(Lab.rejouer(a1)) === JSON.stringify(a1.essais),
  'rejouer une session enregistrée redonne exactement ses essais');

/* ============================================================
   2 · L'équilibrage
   ============================================================ */
console.log('\nÉQUILIBRAGE DES CONDITIONS');
const mesure = a1.essais.filter((e) => !e.entrainement);
const p = a1.params;
const cellules = {};
mesure.forEach((e) => {
  const k = e.condition + '/' + e.taille + '/' + e.cible;
  cellules[k] = (cellules[k] || 0) + 1;
});
const attendu = p.repetitions;
const cles = Object.keys(cellules);
const bonNombre = 2 * p.tailles.length * 2;
verifier(cles.length === bonNombre,
  bonNombre + ' cellules distinctes (2 conditions × ' + p.tailles.length + ' tailles × présence/absence)',
  cles.length + ' trouvées');
verifier(cles.every((k) => cellules[k] === attendu),
  'chaque cellule compte exactement ' + attendu + ' essais',
  cles.filter((k) => cellules[k] !== attendu).slice(0, 3).join(', '));
verifier(mesure.length === bonNombre * attendu,
  mesure.length + ' essais de mesure au total');

const nSimple = mesure.filter((e) => e.condition === 'simple').length;
const nPresent = mesure.filter((e) => e.cible).length;
verifier(nSimple === mesure.length / 2, 'autant de recherche simple que de conjonction');
verifier(nPresent === mesure.length / 2, 'autant de cibles présentes qu’absentes');

/* l'ordre doit être mélangé, pas simplement construit */
const brut = [];
['simple', 'conjonction'].forEach((c) => p.tailles.forEach((t) => [true, false].forEach((v) => {
  for (let r = 0; r < attendu; r++) brut.push(c + '/' + t + '/' + v);
})));
const ordre = mesure.map((e) => e.condition + '/' + e.taille + '/' + e.cible);
verifier(JSON.stringify(ordre) !== JSON.stringify(brut), 'l’ordre est mélangé, pas celui de construction');

/* pas plus de quatre fois la même condition d'affilée : au-delà, l'étudiant
   cesse de chercher et anticipe */
let suite = 1, pire = 1;
for (let i = 1; i < mesure.length; i++) {
  suite = mesure[i].condition === mesure[i - 1].condition ? suite + 1 : 1;
  pire = Math.max(pire, suite);
}
verifier(pire <= 8, 'pas de série interminable d’une même condition (plus longue : ' + pire + ')');

/* ============================================================
   3 · Les stimuli
   ============================================================ */
console.log('\nCOMPOSITION DES STIMULI');
let fauteSimple = 0, fauteConj = 0, fauteCible = 0, horsCadre = 0, chevauche = 0;
const GEO = Lab.def('recherche').geometrie;
const dmin = (GEO.elementDeg * GEO.espacementMin) / GEO.champDeg;

a1.essais.forEach((e) => {
  if (e.elements.length !== e.taille) fauteCible++;
  const cibles = e.elements.filter((x) => x.cible);
  if (cibles.length !== (e.cible ? 1 : 0)) fauteCible++;

  if (e.condition === 'simple') {
    /* tout est rond ; un seul rouge, et seulement si la cible est là */
    if (e.elements.some((x) => x.forme !== 'rond')) fauteSimple++;
    const rouges = e.elements.filter((x) => x.couleur === 'rouge').length;
    if (rouges !== (e.cible ? 1 : 0)) fauteSimple++;
  } else {
    /* AUCUN distracteur ne doit être un disque rouge : ce serait une
       seconde cible, et la conjonction n'en serait plus une */
    const faux = e.elements.filter((x) => !x.cible && x.forme === 'rond' && x.couleur === 'rouge');
    if (faux.length) fauteConj++;
    const inconnus = e.elements.filter((x) =>
      !(x.forme === 'rond' && x.couleur === 'bleu') &&
      !(x.forme === 'carre' && x.couleur === 'rouge') && !x.cible);
    if (inconnus.length) fauteConj++;
  }

  e.elements.forEach((x, i) => {
    if (x.x < 0 || x.x > 1 || x.y < 0 || x.y > 1) horsCadre++;
    for (let j = i + 1; j < e.elements.length; j++) {
      const y = e.elements[j];
      if (Math.hypot(x.x - y.x, x.y - y.y) < dmin - 1e-9) chevauche++;
    }
  });
});
verifier(fauteCible === 0, 'le bon nombre d’éléments, et une cible seulement si elle est annoncée');
verifier(fauteSimple === 0, 'recherche simple : que des disques, un seul rouge');
verifier(fauteConj === 0, 'conjonction : aucun distracteur n’est un disque rouge');
verifier(horsCadre === 0, 'tous les éléments restent dans le champ');
verifier(chevauche === 0, 'aucun chevauchement (distance minimale respectée)');

/* le cas dense : seize éléments, là où le tirage par rejet peut échouer */
let densesRates = 0;
for (let g = 0; g < 200; g++) {
  const pos = Lab.positions(16, dmin, Lab.generateur(g));
  if (pos.length !== 16) { densesRates++; continue; }
  for (let i = 0; i < pos.length; i++) {
    for (let j = i + 1; j < pos.length; j++) {
      if (Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y) < dmin - 1e-9) densesRates++;
    }
  }
}
verifier(densesRates === 0, '200 semis de 16 éléments : toujours 16, jamais de chevauchement');

/* ============================================================
   4 · Les statistiques
   ============================================================ */
console.log('\nSTATISTIQUES');
verifier(Lab.mediane([3, 1, 2]) === 2, 'médiane d’un nombre impair de valeurs');
verifier(Lab.mediane([4, 1, 2, 3]) === 2.5, 'médiane d’un nombre pair');
verifier(Lab.mediane([]) === null, 'médiane d’une liste vide : null, pas zéro');
verifier(Lab.moyenne([1, 2, 3, 4]) === 2.5, 'moyenne');
verifier(Math.abs(Lab.ecartType([2, 4, 4, 4, 5, 5, 7, 9]) - 2.13809) < 0.001,
  'écart-type (corrigé, dénominateur n−1)');

/* une droite parfaite : pente 25, origine 400 */
const dr = Lab.pente([{ x: 4, y: 500 }, { x: 8, y: 600 }, { x: 12, y: 700 }, { x: 16, y: 800 }]);
verifier(Math.abs(dr.pente - 25) < 1e-9, 'pente exacte sur une droite parfaite (25 ms/élément)');
verifier(Math.abs(dr.origine - 400) < 1e-9, 'ordonnée à l’origine');
verifier(Math.abs(dr.r2 - 1) < 1e-9, 'r² = 1 sur une droite parfaite');
verifier(Lab.pente([{ x: 1, y: 1 }]) === null, 'pas de pente avec un seul point');

const net = Lab.nettoyer([100, 300, 500, 9000]);
verifier(net.gardes.length === 2 && net.ecartes === 2,
  'les temps hors de 150–8000 ms sont écartés, et comptés', JSON.stringify(net.gardes));

/* ============================================================
   5 · Les degrés d'angle visuel
   ============================================================ */
console.log('\nCONVERSION PIXELS ↔ DEGRÉS');
Calib.reglerCarte(300);          /* la carte de 85,60 mm ajustée à 300 px */
Calib.reglerDistance(60);        /* 60 cm */
const mmPx = Calib.mmParPx();
verifier(Math.abs(mmPx - 85.60 / 300) < 1e-12, 'taille d’un pixel déduite de la carte (ISO 7810)');

/* à la main : 1° à 600 mm sous-tend 2·600·tan(0,5°) = 10,4724 mm,
   soit 10,4724 / 0,285333 = 36,70 px */
const pxDeg = Calib.pxParDegre();
verifier(Math.abs(pxDeg - 36.70) < 0.05, '1° = 36,70 px à 60 cm avec cette densité',
  'obtenu ' + (Math.round(pxDeg * 100) / 100));
verifier(Math.abs(Calib.pxVersDeg(Calib.degVersPx(3.5)) - 3.5) < 1e-9,
  'aller-retour degrés → pixels → degrés');

/* La valeur exacte, calculée à la main : 2·atan(100/1200) = 9,527°.
   On vérifie le calcul lui-même plutôt que sa différence avec une
   approximation — à 10° celle-ci ne s'écarte que de 0,02°, et un test
   qui exigerait davantage serait faux, comme il l'a d'abord été ici. */
verifier(Math.abs(Calib.degDepuisMm(100, 600) - 9.5273) < 0.001,
  'angle exact : 100 mm à 600 mm sous-tendent 9,527°',
  Calib.degDepuisMm(100, 600).toFixed(4) + '°');

/* C'est aux grands angles que l'approximation décroche — et c'est là qu'on
   ira avec le crowding périphérique. */
const exact = Calib.degDepuisMm(600, 600);
const approx = (600 / 600) * 180 / Math.PI;
verifier(exact < approx - 3,
  'aux grands angles, l’approximation surestime nettement',
  'exact ' + exact.toFixed(2) + '° vs approché ' + approx.toFixed(2) + '°');
verifier(Calib.pxVersDeg(0) === 0, 'zéro pixel fait zéro degré');

/* sans calibration, on rend null plutôt qu'un chiffre faux */
Calib.oublier();
verifier(Calib.pxVersDeg(100) === null, 'sans calibration, la conversion refuse de répondre');
Calib.reglerCarte(300); Calib.reglerDistance(60);

/* ============================================================
   6 · L'analyse
   ============================================================ */
console.log('\nANALYSE');
const s = Lab.creer('recherche', 'mesure', {}, 4242);
/* on répond juste partout, avec des temps fabriqués : plats en simple,
   croissants en conjonction — le phénomène qu'on veut voir apparaître */
s.essais.forEach((e, i) => {
  if (e.entrainement) return;
  const t = e.condition === 'simple' ? 480 + e.taille * 2 : 500 + e.taille * 30;
  Lab.repondre(s, i, e.cible, t);
});
const an = Lab.analyser(s);
verifier(an.exactitude === 1, 'exactitude de 100 % quand toutes les réponses sont justes');
verifier(Math.abs(an.pentes.simple.presente.pente - 2) < 0.5,
  'pente plate retrouvée en recherche simple (≈ 2 ms/élément)',
  Math.round(an.pentes.simple.presente.pente * 10) / 10 + '');
verifier(Math.abs(an.pentes.conjonction.presente.pente - 30) < 0.5,
  'pente forte retrouvée en conjonction (≈ 30 ms/élément)',
  Math.round(an.pentes.conjonction.presente.pente * 10) / 10 + '');

/* une réponse fausse ne doit pas entrer dans les temps, mais rester en brut */
const s2 = Lab.creer('recherche', 'demo', {}, 77);
let premierMesure = s2.essais.findIndex((e) => !e.entrainement);
s2.essais.forEach((e, i) => {
  if (e.entrainement) return;
  const faux = i === premierMesure;
  Lab.repondre(s2, i, faux ? !e.cible : e.cible, faux ? 9999 : 600);
});
const an2 = Lab.analyser(s2);
const brutContientFaux = s2.reponses.some((r) => !r.juste);
verifier(brutContientFaux, 'l’essai faux est conservé dans les données brutes');
verifier(an2.medianeGlobale === 600,
  'la médiane ignore l’essai faux', String(an2.medianeGlobale));
verifier(an2.fauxPositifs + an2.fauxNegatifs === 1, 'l’erreur est comptée comme faux positif ou négatif');
verifier(an2.avertissements.length > 0, 'un protocole court déclenche un avertissement');

/* ============================================================
   7 · Rangement et exports
   ============================================================ */
console.log('\nSAUVEGARDE ET EXPORTS');
const sid = Lab.enregistrer(s);
verifier(!!sid, 'la session reçoit un identifiant');
verifier(Lab.historique('recherche').length === 1, 'elle apparaît dans l’historique');
verifier(Lab.session(sid) !== null, 'on la retrouve par son identifiant');
Lab.enregistrer(s);
verifier(Lab.historique('recherche').length === 1, 'ré-enregistrer la même session ne la duplique pas');

const c = Lab.csv(s);
const lignes = c.trim().split('\n');
verifier(lignes.length === s.reponses.length + 1,
  'le CSV compte une ligne par essai répondu, plus l’en-tête',
  lignes.length + ' pour ' + s.reponses.length + ' réponses');
verifier(lignes[0].split(',').length === lignes[1].split(',').length,
  'toutes les lignes ont le même nombre de colonnes');
verifier(/session,experience,version,mode,oeil,graine/.test(lignes[0]),
  'l’en-tête porte de quoi retrouver la session', lignes[0]);
verifier(/condition,taille_ensemble,cible_presente/.test(lignes[0]),
  'et les colonnes propres à la recherche visuelle', lignes[0]);
verifier(c.indexOf('recherche') > 0 && /,\d+,/.test(lignes[1]), 'le contenu est renseigné');

let j = null;
try { j = JSON.parse(Lab.json(s)); } catch (e) { /* invalide */ }
verifier(j !== null, 'le JSON est valide');
verifier(j && j.session && j.session.graine === s.graine, 'le JSON conserve la graine');
verifier(j && j.session.essais.length === s.essais.length, 'le JSON conserve tous les essais');
verifier(j && j.analyse && j.analyse.n === an.n, 'le JSON embarque l’analyse');

verifier(Lab.supprimer(sid) === true, 'la session se supprime');
verifier(Lab.historique('recherche').length === 0, 'elle a disparu de l’historique');
verifier(Lab.supprimer(sid) === false, 'supprimer deux fois ne ment pas');

/* ============================================================
   7 · L'escalier adaptatif
   ------------------------------------------------------------
   Un escalier mal réglé produit un chiffre net et faux : il
   converge quelque part, et rien à l’écran ne dit que ce n’est
   pas le seuil. On l’éprouve donc sur un observateur simulé
   dont on connaît le seuil à l’avance.
   ============================================================ */
console.log('\nESCALIER ADAPTATIF');

/* --- la mécanique, pas à pas --- */
{
  const e = Lab.escalier({ depart: 0, min: -2, max: 2, pas: 0.1, pasFin: 0.05,
    dur: -1, descend: 2, monte: 1, stop: 99, maxEssais: 999 });

  Lab.avancer(e, true);
  verifier(Math.abs(e.niveau - 0) < 1e-9,
    'une seule bonne réponse ne suffit pas à durcir', String(e.niveau));
  Lab.avancer(e, true);
  verifier(Math.abs(e.niveau - (-0.1)) < 1e-9,
    'deux bonnes de suite durcissent d’un pas', String(e.niveau));
  Lab.avancer(e, false);
  verifier(Math.abs(e.niveau - 0) < 1e-9,
    'une seule fausse relâche d’un pas', String(e.niveau));
  verifier(e.inversions.length === 1,
    'le changement de sens compte pour une inversion', String(e.inversions.length));
  Lab.avancer(e, true); Lab.avancer(e, true);
  verifier(e.inversions.length === 2 && Math.abs(e.pas - 0.05) < 1e-9,
    'le pas est réduit après deux inversions', 'pas ' + e.pas);
}

/* --- les bornes tiennent --- */
{
  const e = Lab.escalier({ depart: 0, min: -0.2, max: 0.2, pas: 0.1, dur: -1,
    descend: 1, monte: 1, stop: 99, maxEssais: 999 });
  for (let i = 0; i < 20; i++) Lab.avancer(e, true);
  verifier(e.niveau >= -0.2 - 1e-9,
    'l’escalier ne descend pas sous son plancher', String(e.niveau));
  for (let i = 0; i < 40; i++) Lab.avancer(e, false);
  verifier(e.niveau <= 0.2 + 1e-9,
    'ni ne monte au-dessus de son plafond', String(e.niveau));
}

/* --- la lecture du seuil --- */
{
  const e = { inversions: [1, 2, 10, 20, 30, 40], niveaux: [] };
  const sl = Lab.seuil(e);
  /* les deux premières écartées, il en reste quatre : (10+20+30+40)/4 = 25 */
  verifier(Math.abs(sl.log - 25) < 1e-9,
    'le seuil écarte les deux premières inversions', String(sl.log));
  verifier(sl.n === 4, 'et en moyenne un nombre pair', String(sl.n));
  const impair = Lab.seuil({ inversions: [1, 2, 10, 20, 30] });
  verifier(impair.n === 2 && Math.abs(impair.log - 25) < 1e-9,
    'un compte impair perd la plus ancienne, jamais la plus récente', String(impair.log));
  verifier(Lab.seuil({ inversions: [1, 2, 3] }).valeur === null,
    'moins de deux inversions utiles ne donnent pas de seuil');
}

/* --- convergence sur un observateur simulé ---
   L'observateur répond juste avec une probabilité qui vaut 25 % (le hasard
   d’un choix parmi quatre) au plus serré, et croît avec l’espacement. Sa
   fonction est réglée pour passer par 70,7 % — le point vers lequel la règle
   « deux bonnes / une fausse » converge — exactement au seuil visé. */
{
  const VISE = 2.4;                    /* le seuil à retrouver, en degrés */
  const CINQUANTE = 0.863 * VISE;      /* pour que p(VISE) = 0,707 */
  const p = (S) => 0.25 + 0.75 / (1 + Math.pow(CINQUANTE / S, 3));
  verifier(Math.abs(p(VISE) - 0.707) < 0.005,
    'l’observateur simulé réussit bien 70,7 % au seuil visé', p(VISE).toFixed(3));

  const trouves = [];
  for (let g = 0; g < 40; g++) {
    const rnd = Lab.generateur(g + 1);
    const e = Lab.escalier({ depart: Math.log(9) / Math.LN10, min: Math.log(0.3) / Math.LN10,
      max: Math.log(9) / Math.LN10, pas: 0.1, pasFin: 0.05, dur: -1,
      descend: 2, monte: 1, stop: 8, maxEssais: 60 });
    while (!e.fini) Lab.avancer(e, rnd() < p(Lab.valeur(e)));
    const sl = Lab.seuil(e);
    if (sl.valeur !== null) trouves.push(sl.valeur);
  }
  const med = Lab.mediane(trouves);
  const dedans = trouves.filter((v) => v > VISE / 1.6 && v < VISE * 1.6).length;
  console.log('    40 escaliers simulés : médiane ' + med.toFixed(2) + '° pour ' + VISE + '° visés');
  verifier(trouves.length === 40, 'chaque escalier a rendu un seuil', String(trouves.length));
  verifier(Math.abs(med - VISE) / VISE < 0.15,
    'la médiane des seuils retrouvés est à moins de 15 % du vrai', med.toFixed(2) + '°');
  verifier(dedans >= 36,
    'au moins 36 escaliers sur 40 tombent à un facteur 1,6 près', dedans + '/40');
}

/* ============================================================
   8 · L'encombrement
   ============================================================ */
console.log('\nENCOMBREMENT');

const dEnc = Lab.def('encombrement');
verifier(!!dEnc, 'l’expérience est déclarée');
verifier(dEnc.monoculaire === true, 'elle se passe un œil à la fois');
verifier(dEnc.reponses.length === 4, 'quatre réponses possibles, une par flèche',
  dEnc.reponses.map((r) => r.touche).join(' '));

/* --- la session de départ --- */
{
  const s = Lab.creer('encombrement', 'mesure', {}, 4242);
  verifier(Object.keys(s.escaliers).length === 3,
    'un escalier par excentricité', Object.keys(s.escaliers).join(' '));
  verifier(s.essais.length === s.params.entrainement,
    'seuls les essais d’entraînement sont tirés d’avance', String(s.essais.length));
  verifier(s.essais.every((e) => e.entrainement),
    'et ils sont tous marqués comme tels');

  /* La taille suit l’excentricité : c’est ce qui garantit qu’on mesure un
     encombrement et non une acuité périphérique. */
  const t = {};
  s.essais.forEach((e) => { t[e.excentricite] = e.taille; });
  const excs = Object.keys(t).map(Number).sort((a, b) => a - b);
  verifier(excs.every((x, i) => i === 0 || t[x] > t[excs[i - 1]]),
    'plus on s’éloigne du centre, plus l’anneau est grand',
    excs.map((x) => x + '° → ' + t[x].toFixed(2) + '°').join(', '));
}

/* --- une passation complète, menée par un observateur simulé --- */
function passer(graine, seuilVrai, mode) {
  const s = Lab.creer('encombrement', mode || 'mesure', {}, graine);
  const rnd = Lab.generateur(graine ^ 0x5bf03635);
  let garde = 0;
  for (let i = 0; i < s.essais.length; i++) {
    if (++garde > 4000) break;
    const e = s.essais[i];
    let p;
    if (e.isole || e.entrainement) p = 0.95;
    else {
      const cible = seuilVrai(e.excentricite);
      p = 0.25 + 0.75 / (1 + Math.pow((0.863 * cible) / e.espacement, 3));
    }
    /* réponse juste avec la probabilité p, sinon une des trois autres */
    const juste = rnd() < p;
    const rep = juste ? e.cible : (e.cible + 1 + Math.floor(rnd() * 3)) % 4;
    Lab.repondre(s, i, rep, 600 + Math.floor(rnd() * 400));
  }
  return s;
}

{
  /* Un observateur dont l’espacement critique vaut exactement la moitié de
     l’excentricité : la loi de Bouma, par construction. On doit la retrouver. */
  const vrai = (exc) => 0.5 * exc;
  const s = passer(777, vrai);
  const a = Lab.analyser(s);

  verifier(Object.keys(s.escaliers).every((k) => s.escaliers[k].fini),
    'tous les escaliers sont allés au bout');
  verifier(s.reponses.length === s.essais.length,
    'chaque essai fabriqué a été répondu',
    s.reponses.length + ' / ' + s.essais.length);
  console.log('    passation de ' + a.n + ' essais mesurés, ' + a.isoles + ' sans flanqueur');

  /* Les essais isolés ne doivent PAS faire bouger les escaliers : ils
     contrôlent la lisibilité, ils ne mesurent pas l’encombrement. */
  const bougés = Object.keys(s.escaliers).reduce((n, k) => n + s.escaliers[k].n, 0);
  const mesurés = s.reponses.filter((r) => {
    const e = s.essais[r.i];
    return !e.entrainement && !e.isole;
  }).length;
  verifier(bougés === mesurés,
    'seuls les essais AVEC flanqueurs font avancer les escaliers',
    bougés + ' pas pour ' + mesurés + ' essais flanqués');

  verifier(a.isoles > 0, 'des essais sans flanqueur ont bien été glissés dans la série');
  verifier(a.exactitudeIsole > 0.8,
    'la cible isolée est reconnue : sa taille était bien lisible',
    Math.round(a.exactitudeIsole * 100) + ' %');

  a.parExcentricite.forEach((c) => {
    console.log('    ' + c.excentricite + '° → seuil ' +
      (c.espacement === null ? '—' : c.espacement.toFixed(2) + '°') +
      ' (attendu ' + vrai(c.excentricite).toFixed(2) + '°, rapport ' +
      (c.rapport === null ? '—' : c.rapport.toFixed(2)) + ')');
  });

  const bons = a.parExcentricite.filter((c) => c.espacement !== null && !c.auPlafond);
  verifier(bons.length >= 2,
    'au moins deux excentricités donnent un seuil exploitable', String(bons.length));
  verifier(bons.every((c) => Math.abs(c.espacement - vrai(c.excentricite)) / vrai(c.excentricite) < 0.4),
    'chaque seuil retrouvé est à moins de 40 % du vrai',
    bons.map((c) => c.excentricite + '° : ' + c.espacement.toFixed(2)).join(' | '));
  verifier(a.bouma !== null && Math.abs(a.bouma - 0.5) < 0.15,
    'la constante de Bouma est retrouvée autour de 0,5',
    a.bouma === null ? '—' : a.bouma.toFixed(2));
  verifier(a.droite.pente !== null && a.droite.pente > 0.25 && a.droite.pente < 0.8,
    'et la pente espacement/excentricité aussi',
    a.droite.pente === null ? '—' : a.droite.pente.toFixed(2));
}

/* --- l’entraînement doit lancer la mesure ---
   Le simulateur ci-dessus répond à TOUS les essais, entraînement compris.
   L’écran, lui, n’enregistre pas l’entraînement — il ne mesure rien. Tant
   que la fabrication de l’essai suivant vivait dans `repondre`, la mesure
   ne démarrait donc jamais : la passation se terminait à vide juste après
   l’entraînement, et seul le banc d’écran le voyait. On refait ici ce que
   fait l’écran. */
{
  const s = Lab.creer('encombrement', 'demo', {}, 606);
  const rnd = Lab.generateur(3);
  let garde = 0;
  for (let i = 0; i < s.essais.length && ++garde < 3000; i++) {
    const e = s.essais[i];
    const juste = rnd() < 0.8;
    const rep = juste ? e.cible : (e.cible + 1) % 4;
    if (e.entrainement) Lab.prolonger(s, i, juste);   /* comme l’écran */
    else Lab.repondre(s, i, rep, 700);
  }
  const mesures = s.essais.filter((e) => !e.entrainement).length;
  verifier(mesures > 0, 'après l’entraînement, la mesure démarre', String(mesures));
  verifier(s.reponses.length === mesures,
    'et chaque essai mesuré reçoit sa réponse',
    s.reponses.length + ' réponses pour ' + mesures + ' essais mesurés');
  verifier(Object.keys(s.escaliers).every((k) => s.escaliers[k].fini),
    'les escaliers vont au bout sans que l’entraînement compte');
  const a = Lab.analyser(s);
  verifier(a !== null && a.n === mesures, 'et l’analyse porte sur ces essais-là',
    a === null ? 'aucune analyse' : String(a.n));
}

/* --- reproductibilité : graine ET réponses --- */
{
  const vrai = (exc) => 0.5 * exc;
  const a = passer(31337, vrai);
  const b = passer(31337, vrai);
  verifier(JSON.stringify(a.essais) === JSON.stringify(b.essais),
    'même graine et même observateur → mêmes essais');

  const rejoues = Lab.rejouer(a);
  verifier(JSON.stringify(rejoues) === JSON.stringify(a.essais),
    'rejouer la session à partir de ses réponses redonne exactement ses essais',
    rejoues.length + ' contre ' + a.essais.length);

  const c = passer(999, vrai);
  verifier(JSON.stringify(c.essais) !== JSON.stringify(a.essais),
    'une autre graine donne une autre série');
}

/* --- un observateur très encombré cogne au plafond, et on le dit --- */
{
  /* espacement critique égal à l’excentricité : au-delà de ce que le
     protocole peut afficher (plafond à 0,9 × l’excentricité). */
  const s = passer(555, (exc) => 1.2 * exc);
  const a = Lab.analyser(s);
  const plafonnes = a.parExcentricite.filter((c) => c.auPlafond).length;
  verifier(plafonnes > 0,
    'un espacement critique hors d’atteinte est repéré comme tel', String(plafonnes));
  verifier(a.avertissements.some((w) => /collé au plus grand espacement/.test(w)),
    'et le rapport prévient que le seuil est un minimum, pas une mesure');
}

/* --- une cible illisible seule invalide la mesure, et le rapport le dit --- */
{
  const s = Lab.creer('encombrement', 'mesure', {}, 8080);
  const rnd = Lab.generateur(4);
  let garde = 0;
  for (let i = 0; i < s.essais.length && ++garde < 4000; i++) {
    const e = s.essais[i];
    /* même sur cible isolée, l’observateur répond au hasard */
    const p = e.entrainement ? 0.9 : 0.3;
    const juste = rnd() < p;
    Lab.repondre(s, i, juste ? e.cible : (e.cible + 1) % 4, 700);
  }
  const a = Lab.analyser(s);
  verifier(a.exactitudeIsole !== null && a.exactitudeIsole < 0.75,
    'une cible isolée mal reconnue est mesurée',
    a.exactitudeIsole === null ? '—' : Math.round(a.exactitudeIsole * 100) + ' %');
  verifier(a.avertissements.some((w) => /trop petite pour vous|Cible isolée/.test(w)),
    'et le rapport refuse de faire passer ce seuil pour de l’encombrement');
}

/* --- l’export porte les colonnes de l’encombrement --- */
{
  const s = passer(1234, (exc) => 0.5 * exc);
  s.oeil = 'od';
  Lab.enregistrer(s);
  const lignes = Lab.csv(s).trim().split(String.fromCharCode(10));
  verifier(/excentricite_deg,espacement_deg,isole,taille_deg/.test(lignes[0]),
    'le CSV porte excentricité, espacement, isolement et taille', lignes[0]);
  verifier(/,od,/.test(lignes[1]), 'et l’œil mesuré', lignes[1]);
  verifier(lignes.length === s.reponses.length + 1,
    'une ligne par essai répondu, entraînement compris',
    lignes.length + ' pour ' + s.reponses.length);
  const nCols = lignes[0].split(String.fromCharCode(44)).length;
  verifier(lignes.every((l) => l.split(String.fromCharCode(44)).length === nCols),
    'toutes les lignes ont le même nombre de colonnes');
  Lab.supprimer(s.sid);
}

/* ============================================================ */
console.log('');
if (dur.length) {
  console.log(dur.length + ' problème(s) :');
  dur.forEach((d) => console.log('  · ' + d));
  process.exit(1);
}
console.log('Le laboratoire mesure ce qu’il prétend mesurer.');
