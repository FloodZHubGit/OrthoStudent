/* Audit des renvois entre les données : tout identifiant cité quelque part
   doit exister ailleurs. Rien n'est modifié, on ne fait que lister. */
global.window = {};
['glossary', 'theory', 'quizbank', 'quizbank2', 'quizbank3', 'flashbank', 'cases', 'formulas',
  'curriculum', 'ueguide', 'ueguide2', 'uecours', 'uexpand', 'uedeep', 'uedeep2', 'uecas', 'uecas2']
  .forEach(n => require(require('path').join(__dirname, '../src/js/data/' + n + '.js')));

const W = window;
const out = [];
const has = (o, k) => Object.prototype.hasOwnProperty.call(o || {}, k);

// thèmes de QCM cités par le référentiel
const cats = {};
(W.QUIZ || []).forEach(q => { cats[q.cat] = (cats[q.cat] || 0) + 1; });
const chaps = {};
(W.THEORY || []).forEach(c => { chaps[c.id] = true; });

const seenCats = {}, seenChaps = {};
(W.CURRICULUM || []).forEach(sem => sem.ues.forEach(u => {
  const l = u.links || {};
  (l.cats || []).forEach(c => {
    seenCats[c] = true;
    if (!cats[c]) out.push(sem.id + '/' + u.code + ' : thème de QCM inconnu « ' + c + ' »');
  });
  (l.chap || []).forEach(c => {
    seenChaps[c] = true;
    if (!chaps[c]) out.push(sem.id + '/' + u.code + ' : chapitre de cours inconnu « ' + c + ' »');
  });
  (l.formulas || []).forEach(f => {
    if (!has(W.FORMULAS, f)) out.push(sem.id + '/' + u.code + ' : formule inconnue « ' + f + ' »');
  });
  if (u.code !== 'UE6' && u.code !== 'UE libre' && !has(W.UE_GUIDE, u.code)) {
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

Object.keys(cats).forEach(c => { if (!seenCats[c]) out.push('thème de QCM « ' + c + ' » (' + cats[c] + ' questions) rattaché à aucune UE'); });
Object.keys(chaps).forEach(c => { if (!seenChaps[c]) out.push('chapitre de cours « ' + c + ' » rattaché à aucune UE'); });

// fiches d'UE : codes qui ne sont dans aucun semestre
const codes = {};
(W.CURRICULUM || []).forEach(s => s.ues.forEach(u => { codes[u.code] = true; }));
[['UE_GUIDE', W.UE_GUIDE], ['UE_DEEP', W.UE_DEEP], ['UE_CAS', W.UE_CAS], ['UE_EXTRA', W.UE_EXTRA]]
  .forEach(([name, bank]) => {
    Object.keys(bank || {}).forEach(c => { if (!codes[c]) out.push(name + ' : « ' + c +' » n’est dans aucun semestre'); });
  });

// QCM : réponse dans les bornes, identifiants uniques
const qids = {};
(W.QUIZ || []).forEach(q => {
  if (qids[q.id]) out.push('QCM : identifiant en double « ' + q.id + ' »');
  qids[q.id] = true;
  if (!q.opts || q.a == null || q.a < 0 || q.a >= q.opts.length) out.push('QCM ' + q.id + ' : réponse hors bornes');
  if (!q.exp) out.push('QCM ' + q.id + ' : sans explication');
});

// Fiches mémo : identifiants uniques
const cids = {};
(W.FLASHCARDS || []).forEach(c => {
  if (cids[c.id]) out.push('Fiche : identifiant en double « ' + c.id + ' »');
  cids[c.id] = true;
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

console.log(out.length ? out.length + ' anomalie(s) :' : 'Aucune anomalie.');
out.forEach(o => console.log('  · ' + o));
