/* ============================================================
   L'atelier de calcul, mis à l'épreuve
   ------------------------------------------------------------
   Trois choses à garantir, et une seule est évidente.

   1. Les réponses sont finies et les énoncés complets.
   2. Aucun piège ne tombe SUR la bonne réponse. C'est le point
      dangereux : un piège trop proche du résultat ferait dire à
      l'application « vous avez gardé les millimètres » à un
      étudiant qui a juste. On vérifie l'écart à chaque tirage.
   3. Chaque piège est effectivement reconnu quand on lui donne
      la valeur fausse correspondante — sinon le diagnostic ne
      sert à rien.
   4. Pour les postes d'optique, la réponse annoncée vérifie la
      loi — relue dans l'énoncé, pas dans le code qui l'a écrit.
      Une mesure algébrique prise à l'envers ne casse rien : elle
      enseigne juste le contraire de ce qu'il faut.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..');
global.window = {};
['core/optics.js', 'core/atelier.js'].forEach(function (f) {
  new Function('window', fs.readFileSync(path.join(RACINE, 'src/js', f), 'utf8'))(global.window);
});
const Atelier = global.window.Atelier;

/* hasard reproductible : un test qui échoue doit échouer pareil demain */
function graine(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TIRAGES = 400;
const NIVEAUX = ['initie', 'rode'];
const dur = [];
let sujets = 0;

console.log(Atelier.postes.length + ' postes · ' + TIRAGES + ' tirages par niveau\n');

Atelier.postes.forEach(function (p) {
  const enonces = new Set();
  let masques = 0, pieges = 0, reconnus = 0, attendus = 0;

  NIVEAUX.forEach(function (niv) {
    const rnd = graine(1234);
    for (let i = 0; i < TIRAGES; i++) {
      const s = Atelier.tirer(p.id, niv, rnd);
      sujets++;
      enonces.add(s.enonce);

      /* 1 · l'énoncé et les réponses tiennent debout */
      if (/undefined|NaN|Infinity/.test(s.enonce)) dur.push(p.id + ' : énoncé abîmé — ' + s.enonce.slice(0, 70));
      if (/undefined|NaN|Infinity/.test(s.rappel || '')) dur.push(p.id + ' : rappel abîmé — ' + (s.rappel || '').slice(0, 70));
      s.champs.forEach(function (c) {
        attendus++;
        if (!isFinite(c.attendu)) dur.push(p.id + ' : réponse non finie sur « ' + c.label + ' »');
        if (!(c.tol > 0)) dur.push(p.id + ' : tolérance absente sur « ' + c.label + ' »');
      });

      /* 2 · aucun piège ne doit se confondre avec la bonne réponse */
      (s.pieges || []).forEach(function (pg) {
        const c = s.champs.filter(function (x) { return x.k === pg.k; })[0];
        if (!c) { dur.push(p.id + ' : piège sur un champ inexistant (' + pg.k + ')'); return; }
        pieges++;
        if (Math.abs(pg.v - c.attendu) <= c.tol) { masques++; return; }

        /* 3 · et il doit être reconnu quand l'étudiant tombe dedans */
        const rep = {};
        s.champs.forEach(function (x) { rep[x.k] = x.attendu; });
        rep[pg.k] = pg.v;
        const r = Atelier.corriger(s, rep);
        const trouve = r.champs.filter(function (x) { return x.k === pg.k; })[0];
        if (trouve.ok) dur.push(p.id + ' : le piège « ' + pg.v + ' » est accepté comme juste');
        else if (!trouve.piege) dur.push(p.id + ' : piège non reconnu (' + pg.v + ' sur ' + pg.k + ')');
        else reconnus++;
      });

      /* la bonne réponse est acceptée, et l'à-peu-près ne l'est pas */
      const juste = {}; s.champs.forEach(function (c) { juste[c.k] = c.attendu; });
      if (!Atelier.corriger(s, juste).ok) dur.push(p.id + ' : la bonne réponse est refusée');

      const limite = {}; s.champs.forEach(function (c) { limite[c.k] = c.attendu + c.tol * 0.9; });
      if (!Atelier.corriger(s, limite).ok) dur.push(p.id + ' : une réponse dans la tolérance est refusée');

      const dehors = {}; s.champs.forEach(function (c) { dehors[c.k] = c.attendu + c.tol * 3; });
      if (Atelier.corriger(s, dehors).ok) dur.push(p.id + ' : une réponse hors tolérance est acceptée');

      const rien = Atelier.corriger(s, {});
      if (rien.ok) dur.push(p.id + ' : une copie blanche est comptée juste');
    }
  });

  const pc = pieges ? Math.round(masques * 100 / pieges) : 0;
  console.log('  ' + p.ic + ' ' + p.nom);
  console.log('     ' + enonces.size + ' énoncés distincts · ' + (pieges - masques) + ' pièges utilisables sur ' +
    pieges + (masques ? '  (' + pc + ' % masqués par la tolérance)' : ''));
  if (pc > 40) dur.push(p.id + ' : ' + pc + ' % des pièges tombent sur la bonne réponse — énoncés à revoir');
  if (enonces.size < 6) dur.push(p.id + ' : seulement ' + enonces.size + ' énoncés distincts, la série tournera en rond');
});

/* une série complète : couverture et pas de répétition consécutive */
const s = Atelier.serie({ n: 20, niveau: 'initie', rnd: graine(7) });
const vus = new Set(s.map(function (x) { return x.poste; }));
let colles = 0;
for (let i = 1; i < s.length; i++) if (s[i].enonce === s[i - 1].enonce) colles++;
console.log('\nsérie de 20 : ' + vus.size + ' postes différents · ' + colles + ' répétition(s) consécutive(s)');
if (colles) dur.push('la série répète un énoncé deux fois de suite');
if (vus.size < 10) dur.push('la série ne couvre que ' + vus.size + ' postes sur ' + Atelier.postes.length);

/* les postes renvoient-ils vers une calculatrice et une formule qui existent ? */
new Function('window', fs.readFileSync(path.join(RACINE, 'src/js/data/formulas.js'), 'utf8'))(global.window);
Atelier.postes.forEach(function (p) {
  if (!global.window.FORMULAS[p.formule]) dur.push(p.id + ' : formule inconnue « ' + p.formule + ' »');
});

/* ---------------- La physique des postes d'optique ----------------
   Le reste de ce banc vérifie que les pièges se distinguent ; il ne dit
   rien de la justesse. Or une inversion de signe dans une mesure
   algébrique ne casse rien : elle donne juste une fausse réponse à
   l'étudiant, sans qu'aucun test ne bronche.

   On relit donc les nombres DANS L'ÉNONCÉ — pas dans le code qui l'a
   produit — et l'on vérifie que la réponse annoncée satisfait bien la
   loi. Ce détour par le texte fait d'une pierre deux coups : un énoncé
   qui cesserait d'annoncer les valeurs réellement utilisées se voit
   aussi. */
var RAD = Math.PI / 180;
function sin(a) { return Math.sin(a * RAD); }

/* les valeurs en gras de l'énoncé, dans l'ordre, celles qui sont des nombres */
function chiffres(enonce) {
  var out = [];
  (enonce.match(/<b>[^<]*<\/b>/g) || []).forEach(function (m) {
    var t = m.replace(/<\/?b>/g, '').replace(/−/g, '-').replace(/,/g, '.');
    var n = t.match(/-?\d+(?:\.\d+)?/);
    if (n) out.push(parseFloat(n[0]));
  });
  return out;
}

var LOIS = {
  /* n₁ sin i₁ = n₂ sin i₂ */
  descartes: function (c, a) { return c[0] * sin(c[2]) - c[1] * sin(a); },
  /* sin λ = n₂/n₁ */
  angle_limite: function (c, a) { return c[0] * sin(a) - c[1]; },
  /* D = i + i′ − A, avec A = r + r′ */
  prisme_exact: function (c, a) {
    var r = Math.asin(sin(c[2]) / c[1]) / RAD;
    var ip = Math.asin(c[1] * sin(c[0] - r)) / RAD;
    return a - (c[2] + ip - c[0]);
  },
  /* Δ = 100 tan((n−1)A) */
  prisme_ortho: function (c, a) { return a - 100 * Math.tan((c[1] - 1) * c[0] * RAD); },
  /* V = (n′−n)/SC, le rayon en mètres */
  dioptre_vergence: function (c, a) { return a - (c[2] - c[1]) / (c[0] / 100); },
  /* 2/SC = 1/SA + 1/SA′, miroir concave : SC = −R, objet réel : SA = −d */
  miroir_conjug: function (c, a) { return a - 1 / (2 / -c[0] - 1 / -c[1]); },
  /* 1/OA′ − 1/OA = 1/f′ */
  lentille_conjug: function (c, a) { return a - 1 / (1 / c[0] + 1 / -c[1]); }
};

var lois = 0;
Object.keys(LOIS).forEach(function (id) {
  if (!Atelier.poste(id)) { dur.push('poste d’optique absent : ' + id); return; }
  ['initie', 'rode'].forEach(function (niv) {
    for (var k = 0; k < 300; k++) {
      var s = Atelier.tirer(id, niv, graine(k * 31 + (niv === 'rode' ? 7 : 0)));
      var c = chiffres(s.enonce);
      var a = s.champs[0].attendu;
      var ecart = Math.abs(LOIS[id](c, a));
      lois++;
      if (!isFinite(ecart) || ecart > 0.02) {
        dur.push(id + ' : la réponse ne vérifie pas la loi (écart ' +
          (isFinite(ecart) ? ecart.toFixed(4) : ecart) + ', énoncé ' + JSON.stringify(c) +
          ', attendu ' + a + ')');
        return;
      }
    }
  });
});
console.log('\nphysique : ' + lois + ' réponses relues dans l’énoncé et confrontées à leur loi');

console.log('\n' + sujets + ' sujets tirés, ' + Atelier.postes.length + ' postes.');
if (dur.length) {
  console.log('\n' + dur.length + ' problème(s) :');
  [...new Set(dur)].forEach(function (d) { console.log('  · ' + d); });
  process.exit(1);
}
console.log('Aucun problème.');
