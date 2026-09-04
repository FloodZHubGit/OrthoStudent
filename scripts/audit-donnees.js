/* Audit des renvois entre les données : tout identifiant cité quelque part
   doit exister ailleurs. Rien n'est modifié, on ne fait que lister. */
global.window = {};
['glossary', 'theory', 'cases', 'formulas',
  'curriculum', 'ueguide', 'ueguide2', 'uecours', 'uexpand', 'uedeep', 'uedeep2', 'uecas', 'uecas2']
  .forEach(n => require(require('path').join(__dirname, '../src/js/data/' + n + '.js')));

const W = window;
const out = [];
const has = (o, k) => Object.prototype.hasOwnProperty.call(o || {}, k);

const chaps = {};
(W.THEORY || []).forEach(c => { chaps[c.id] = true; });

const seenChaps = {};
(W.CURRICULUM || []).forEach(sem => sem.ues.forEach(u => {
  const l = u.links || {};
  (l.chap || []).forEach(c => {
    seenChaps[c] = true;
    if (!chaps[c]) out.push(sem.id + '/' + u.code + ' : chapitre de cours inconnu « ' + c + ' »');
  });
  (l.formulas || []).forEach(f => {
    if (!has(W.FORMULAS, f)) out.push(sem.id + '/' + u.code + ' : formule inconnue « ' + f + ' »');
  });
  if (u.code !== 'UE06' && u.code !== 'UE libre' && !has(W.UE_GUIDE, u.code)) {
    out.push(sem.id + '/' + u.code + ' : aucune fiche d’UE');
  }

  /* La couche « cours vivant » est positionnelle : une partie ajoutée au plan
     sans son entrée dans uecours.js décalerait toutes les suivantes, et
     l'image d'une partie se retrouverait sous une autre. */
  const plan = (W.UE_GUIDE[u.code] || {}).plan;
  if (plan) {
    const cours = (W.UE_COURS || {})[u.code];
    if (!cours) out.push(sem.id + '/' + u.code + ' : aucune couche de cours (uecours.js)');
    else if (cours.length !== plan.length) {
      out.push(sem.id + '/' + u.code + ' : uecours.js a ' + cours.length +
               ' entrée(s) pour ' + plan.length + ' partie(s) de plan');
    } else {
      cours.forEach((c, i) => {
        const inconnus = Object.keys(c).filter(k => ['img', 'ex', 'cle', 'err', 'fig'].indexOf(k) < 0);
        if (inconnus.length) out.push(sem.id + '/' + u.code + ' partie ' + (i + 1) + ' : champ inconnu « ' + inconnus[0] + ' »');
        if (!Object.keys(c).length) out.push(sem.id + '/' + u.code + ' partie ' + (i + 1) + ' : entrée de cours vide');
      });
    }
  }
}));

Object.keys(chaps).forEach(c => { if (!seenChaps[c]) out.push('chapitre de cours « ' + c + ' » rattaché à aucune UE'); });

// fiches d'UE : codes qui ne sont dans aucun semestre
const codes = {};
(W.CURRICULUM || []).forEach(s => s.ues.forEach(u => { codes[u.code] = true; }));
[['UE_GUIDE', W.UE_GUIDE], ['UE_DEEP', W.UE_DEEP], ['UE_CAS', W.UE_CAS], ['UE_EXTRA', W.UE_EXTRA]]
  .forEach(([name, bank]) => {
    Object.keys(bank || {}).forEach(c => { if (!codes[c]) out.push(name + ' : « ' + c +' » n’est dans aucun semestre'); });
  });

// Cas cliniques : cohérence interne
const TESTS = ['acuity', 'phoropter', 'covertest', 'prism', 'motility', 'lancaster',
  'ppc', 'binocular', 'fundus', 'colorvision', 'fields'];
(W.CASES || []).forEach(c => {
  Object.keys(c.tests || {}).forEach(k => {
    if (TESTS.indexOf(k) < 0) out.push('Cas ' + c.id + ' : examen inconnu « ' + k + ' »');
  });
  if (!c.diagnosis || c.diagnosis.correct == null || !c.diagnosis.options[c.diagnosis.correct]) {
    out.push('Cas ' + c.id + ' : diagnostic attendu hors bornes');
  }
  (c.management ? c.management.correct : []).forEach(i => {
    if (!c.management.options[i]) out.push('Cas ' + c.id + ' : conduite attendue hors bornes (' + i + ')');
  });
  if (!Object.keys(c.tests || {}).some(k => c.tests[k].relevant)) {
    out.push('Cas ' + c.id + ' : aucun examen marqué pertinent');
  }
});

// Glossaire : doublons de titre
const titles = {};
(W.GLOSSARY || []).forEach(g => {
  if (titles[g.t]) out.push('Glossaire : entrée en double « ' + g.t + ' »');
  titles[g.t] = true;
});

// Une UE qui répète son propre chiffre, ou sa propre question d'oral.
// Deux fois le même fait dans une seule fiche, c'est toujours une erreur :
// l'étudiant le révise deux fois, et rien ne garantit que les deux valeurs
// concordent — c'est ainsi qu'UE41 a longtemps donné « ≥ 15 à 20 min » puis
// « ≥ 15 min » pour le même rinçage.
const nq = (t) => String(t).toLowerCase().replace(/[^a-z0-9àâäéèêëïîôöùûüç]+/g, ' ').trim();
const jumeaux = (code, liste, quoi) => {
  const vu = {};
  (liste || []).forEach((e, i) => {
    const k = nq(e[0]);
    if (vu[k] === undefined) { vu[k] = i; return; }
    const meme = liste[vu[k]][1] === e[1];
    out.push(code + ' : ' + quoi + ' « ' + e[0] + ' » deux fois (rangs ' + vu[k] + ' et ' + i + ')'
      + (meme ? '' : ' — ET DEUX VALEURS DIFFÉRENTES : « ' + liste[vu[k]][1] + ' » / « ' + e[1] + ' »'));
  });
};
Object.keys(W.UE_GUIDE || {}).forEach(c => jumeaux(c, W.UE_GUIDE[c].chiffres, 'chiffre'));
Object.keys(W.UE_EXTRA || {}).forEach(c => jumeaux(c, W.UE_EXTRA[c].qr, 'question d’oral'));

/* ------------------------------------------------------------
   Ce que le paquet livré embarque
   ------------------------------------------------------------
   Un fichier chargé par le processus principal mais absent de la
   liste `build.files` ne part pas dans l'installateur : l'appli
   installée s'arrête au démarrage sur « Cannot find module ».

   C'est arrivé avec anki.js, et aucun banc d'essai ne pouvait le
   voir : ils partent tous des sources, jamais du paquet. Le seul
   moment où le défaut apparaît, c'est chez l'utilisateur.
   ------------------------------------------------------------ */
const fsx = require('fs');
const pth = require('path');
const racine = pth.join(__dirname, '..');
const livres = ((require(pth.join(racine, 'package.json')).build || {}).files) || [];
['main.js', 'preload.js'].forEach((f) => {
  let src;
  try { src = fsx.readFileSync(pth.join(racine, f), 'utf8'); } catch (e) { return; }
  const locaux = (src.match(/require\((["'])\.\/[^"']+\1\)/g) || [])
    .map((m) => m.replace(/^require\(['"]\.\//, '').replace(/['"]\)$/, ''))
    .map((m) => (/\.[cm]?js$/.test(m) ? m : m + '.js'));
  locaux.forEach((dep) => {
    if (livres.indexOf(dep) < 0) {
      out.push('Paquet : ' + f + ' charge « ./' + dep + ' », absent de build.files — ' +
        'l’application installée ne démarrerait pas');
    }
  });
});

console.log(out.length ? out.length + ' anomalie(s) :' : 'Aucune anomalie.');
out.forEach(o => console.log('  · ' + o));
