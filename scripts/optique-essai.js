/* ============================================================
   Les cinq schémas d'optique géométrique, éprouvés
   ------------------------------------------------------------
   Un schéma de cours faux est pire qu'aucun schéma : l'étudiant
   le croit, et il le révise. On vérifie donc deux choses.

   D'abord que chaque figure SE DESSINE, à toutes les positions
   de ses curseurs — bornes comprises, puisque c'est là que les
   divisions par zéro et les racines de négatif attendent.

   Ensuite que la PHYSIQUE est juste, sur des valeurs dont on
   connaît la réponse : l'angle limite verre/air, le minimum de
   déviation d'un prisme, le foyer d'un miroir à R/2, la vergence
   d'un dioptre, et le point où l'image d'une lentille bascule du
   réel au virtuel.

   Profil Electron jetable : ce banc ne touche pas la progression.
   ============================================================ */
'use strict';
const { app, BrowserWindow } = require('electron');
const path = require('path');
const os = require('os');

const RACINE = path.join(__dirname, '..');
app.setPath('userData', path.join(os.tmpdir(), 'ortho-optique-' + process.pid));
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const dur = [];
function verifier(ok, quoi, detail) {
  console.log('  ' + (ok ? '✔' : '✘') + ' ' + quoi + (ok || !detail ? '' : '  → ' + detail));
  if (!ok) dur.push(quoi + (detail ? ' : ' + detail : ''));
}
setTimeout(() => { console.log('DÉLAI DÉPASSÉ'); process.exit(2); }, 120000);

app.whenReady().then(async () => {
  const w = new BrowserWindow({ show: true, width: 1400, height: 900,
    webPreferences: { preload: path.join(RACINE, 'preload.js'), contextIsolation: true } });
  const err = [];
  w.webContents.on('console-message', (_e, l, m) => { if (l >= 2) err.push(m); });
  const js = (c) => w.webContents.executeJavaScript(c, true);
  await w.loadFile(path.join(RACINE, 'src', 'index.html'));
  await pause(800);

  const CLES = ['descartes', 'prismeGeo', 'miroirSpherique', 'dioptreSpherique', 'lentilleMince'];

  /* ============================================================
     1 · Elles existent, et elles sont vivantes
     ============================================================ */
  console.log('DÉCLARATION');
  const dec = await js(`(function () {
    return ${JSON.stringify(CLES)}.map(function (k) {
      return { k: k, existe: UEFigs.has(k), vivant: UEFigs.vivant(k),
        legende: UEFigs.legende(k) };
    });
  })()`);
  dec.forEach((d) => {
    verifier(d.existe && d.vivant, d.k + ' : déclarée et vivante',
      JSON.stringify(d));
  });
  verifier(dec.every((d) => d.legende && d.legende.length > 20),
    'chacune porte une légende qui dit quoi regarder');

  /* ============================================================
     2 · Elles se dessinent partout, bornes comprises
     ============================================================ */
  console.log('\nTRACÉ SUR TOUTE L’ÉTENDUE DES CURSEURS');
  const trace = await js(`(function () {
    var out = [];
    ${JSON.stringify(CLES)}.forEach(function (k) {
      var regs = UEFigs.reglages ? UEFigs.reglages(k) : null;
      out.push({ k: k, n: 0, rates: [] });
      var cur = out[out.length - 1];
      /* on balaie chaque curseur sur ses bornes et quelques points internes,
         les autres restant à leur valeur par défaut */
      var base = {};
      (regs || []).forEach(function (r) { base[r.id] = r.val; });
      (regs || []).forEach(function (r) {
        var vals;
        if (r.options) vals = r.options.map(function (o) { return o.id; });
        else {
          vals = [];
          for (var i = 0; i <= 12; i++) vals.push(r.min + (r.max - r.min) * i / 12);
        }
        vals.forEach(function (v) {
          var p = Object.assign({}, base);
          p[r.id] = v;
          cur.n++;
          try {
            var n = UEFigs.draw(k, p);
            if (!n || !n.querySelector) { cur.rates.push(r.id + '=' + v + ' : rien'); return; }
            var t = n.textContent || '';
            if (/NaN|Infinity|undefined/.test(t)) {
              cur.rates.push(r.id + '=' + v + ' : ' + (t.match(/NaN|Infinity|undefined/) || [])[0]);
            }
          } catch (e) { cur.rates.push(r.id + '=' + v + ' : ' + e.message); }
        });
      });
    });
    return out;
  })()`);
  trace.forEach((t) => {
    verifier(t.rates.length === 0, t.k + ' : ' + t.n + ' positions tracées sans faute',
      t.rates.slice(0, 3).join(' | '));
  });

  /* Et les commentaires vivants, sur les mêmes positions. */
  const lus = await js(`(function () {
    var out = [];
    ${JSON.stringify(CLES)}.forEach(function (k) {
      var regs = UEFigs.reglages(k), base = {}, rates = [], n = 0;
      regs.forEach(function (r) { base[r.id] = r.val; });
      regs.forEach(function (r) {
        var vals = r.options ? r.options.map(function (o) { return o.id; })
          : [r.min, (r.min + r.max) / 2, r.max];
        vals.forEach(function (v) {
          var p = Object.assign({}, base); p[r.id] = v; n++;
          try {
            var t = UEFigs.commentaire(k, p);
            if (t === null || t === undefined) return;
            if (/NaN|Infinity|undefined/.test(t)) rates.push(r.id + '=' + v);
            if (t.length < 40) rates.push(r.id + '=' + v + ' : commentaire trop court');
          } catch (e) { rates.push(r.id + '=' + v + ' : ' + e.message); }
        });
      });
      out.push({ k: k, n: n, rates: rates });
    });
    return out;
  })()`);
  lus.forEach((t) => {
    verifier(t.rates.length === 0, t.k + ' : commentaire écrit sur ' + t.n + ' positions',
      t.rates.slice(0, 3).join(' | '));
  });

  /* ============================================================
     3 · La physique, sur des valeurs qu'on connaît
     ============================================================ */
  console.log('\nPHYSIQUE');

  /* Descartes : verre (1,5) vers air (1), angle limite à 41,8° — la valeur
     que le cours calcule lui-même pour le plexi. */
  const d1 = await js(`UEFigs.commentaire('descartes', { i1: 41, n1: 1.5, n2: 1 })`);
  const d2 = await js(`UEFigs.commentaire('descartes', { i1: 43, n1: 1.5, n2: 1 })`);
  verifier(/41,8/.test(d1), 'angle limite verre/air à 41,8°', d1.slice(0, 80));
  verifier(!/réflexion totale/i.test(d1) && /réflexion\s+totale/i.test(d2),
    'à 41° le rayon passe, à 43° il ne passe plus');

  /* Prisme : au minimum de déviation, D est minimal et r = r′ = A/2.
     Pour n = 1,5 et A = 60° : Dm = 2·asin(1,5·sin30°) − 60 = 37,2°. */
  const prisme = await js(`(function () {
    var best = null;
    for (var i = 20; i <= 85; i += 0.25) {
      var r = Math.asin(Math.sin(i * Math.PI / 180) / 1.5) * 180 / Math.PI;
      var rp = 60 - r, s = 1.5 * Math.sin(rp * Math.PI / 180);
      if (Math.abs(s) > 1) continue;
      var D = i + Math.asin(s) * 180 / Math.PI - 60;
      if (!best || D < best.D) best = { i: i, D: D, r: r, rp: rp };
    }
    return best;
  })()`);
  const Dm = 2 * Math.asin(1.5 * Math.sin(30 * Math.PI / 180)) * 180 / Math.PI - 60;
  verifier(Math.abs(prisme.D - Dm) < 0.1,
    'le minimum de déviation vaut bien 2·asin(n·sin(A/2)) − A',
    prisme.D.toFixed(2) + '° pour ' + Dm.toFixed(2) + '° attendus');
  verifier(Math.abs(prisme.r - prisme.rp) < 0.3,
    'et au minimum, r = r′ — le trajet est symétrique',
    prisme.r.toFixed(1) + '° et ' + prisme.rp.toFixed(1) + '°');

  /* Le petit angle de l’orthoptiste : un prisme de 2° en n = 1,5 dévie de 1°,
     soit 1,7 Δ. C’est le régime où D = (n−1)A remplace tout le reste. */
  const petit = await js(`UEFigs.commentaire('prismeGeo', { A: 2, n: 1.5, i: 0 })`);
  verifier(petit.indexOf('(n−1)A = 1,0°, soit 1,7') >= 0,
    'D = (n−1)A : 2° à n = 1,5 donnent 1°, soit 1,7 Δ', petit.slice(-90));

  /* Condition d'émergence : A doit rester sous 2λ. Pour n = 1,5, λ = 41,8°
     donc A < 83,6° — un prisme de 75° attaqué à faible incidence ne laisse
     rien sortir. */
  const bloque = await js(`UEFigs.commentaire('prismeGeo', { A: 75, n: 1.5, i: 5 })`);
  verifier(/réflexion totale/i.test(bloque),
    'un prisme trop ouvert attaqué de face ne laisse rien sortir');

  /* Miroir : objet au centre C, image en C, grandissement −1. */
  const mc = await js(`UEFigs.commentaire('miroirSpherique', { type: 'concave', R: 60, d: 60 })`);
  verifier(/SA′ = -60,0 cm/.test(mc) && /γ = -1,00|renversée/.test(mc),
    'objet au centre : image au centre, renversée, même taille', mc.slice(0, 90));
  /* Objet plus près que le foyer : image virtuelle, droite, agrandie —
     le miroir de dentiste du cours. */
  const md = await js(`UEFigs.commentaire('miroirSpherique', { type: 'concave', R: 60, d: 10 })`);
  verifier(/VIRTUELLE/.test(md) && /droite/.test(md) && /dentiste/.test(md),
    'objet en deçà du foyer : le miroir de dentiste');

  /* Dioptre : air → verre 1,5, R = +30 cm ⇒ V = 0,5/0,30 = 1,67 D. */
  const dio = await js(`UEFigs.commentaire('dioptreSpherique', { n: 1, np: 1.5, sens: 'convexe', Rm: 30, d: 60 })`);
  verifier(/V = \(n′−n\)\/SC = 1,67 D/.test(dio) && /CONVERGENT/.test(dio),
    'dioptre air→verre convexe R = 30 cm : V = 1,67 D, convergent', dio.slice(0, 80));
  /* Sans saut d'indice, pas de dioptre. */
  const plat = await js(`UEFigs.commentaire('dioptreSpherique', { n: 1.5, np: 1.5, sens: 'convexe', Rm: 30, d: 60 })`);
  verifier(/invisible|pas de dioptre/.test(plat),
    'sans saut d’indice, la lumière n’est pas déviée');

  /* Lentille : f′ = 20, objet à 60 ⇒ OA′ = 30 cm, γ = −0,5. */
  const l1 = await js(`UEFigs.commentaire('lentilleMince', { type: 'convergente', fm: 20, d: 60 })`);
  verifier(/OA′ = 30,0 cm/.test(l1) && /RÉELLE/.test(l1) && /-0,50/.test(l1),
    'f′ = 20, objet à 60 : image réelle à 30 cm, γ = −0,5', l1.slice(0, 90));
  /* Objet dans la distance focale : la loupe. */
  const l2 = await js(`UEFigs.commentaire('lentilleMince', { type: 'convergente', fm: 20, d: 10 })`);
  verifier(/VIRTUELLE/.test(l2) && /loupe/.test(l2),
    'objet en deçà du foyer : c’est la loupe');
  /* Divergente : toujours virtuelle, droite, rétrécie. */
  const l3 = await js(`UEFigs.commentaire('lentilleMince', { type: 'divergente', fm: 20, d: 60 })`);
  verifier(/virtuelle/.test(l3) && /-5,00 D|-5 D/.test(l3),
    'une divergente de 20 cm fait −5 D et donne toujours du virtuel', l3.slice(0, 80));

  /* ============================================================
     4 · Elles sont rattachées à l'UE02
     ============================================================ */
  console.log('\nRATTACHEMENT À L’UE02');
  const ue = await js(`(function () {
    var parts = (window.UE_COURS && window.UE_COURS.UE02) || [];
    var figs = parts.map(function (p) { return p.fig; }).filter(Boolean);
    var plan = ((window.UE_GUIDE || {}).UE02 || {}).plan || [];
    return { parties: parts.length, plan: plan.length, figs: figs,
      manquantes: ${JSON.stringify(CLES)}.filter(function (k) { return figs.indexOf(k) < 0; }) };
  })()`);
  console.log('    UE02 : ' + ue.parties + ' parties de cours, ' + ue.plan + ' au plan');
  verifier(ue.parties === ue.plan,
    'le plan et le cours vivant restent alignés', ue.parties + ' vs ' + ue.plan);
  verifier(ue.manquantes.length === 0,
    'les cinq schémas sont rattachés à des parties de l’UE02',
    'manquantes : ' + ue.manquantes.join(', '));

  console.log('\n' + (err.length ? 'ERREURS CONSOLE : ' + err.join(' | ') : 'Aucune erreur console.'));
  if (dur.length) {
    console.log('\n' + dur.length + ' problème(s) :');
    dur.forEach((d) => console.log('  · ' + d));
  } else {
    console.log('\nLes cinq schémas se dessinent, et ce qu’ils disent est juste.');
  }
  setTimeout(() => process.exit(dur.length || err.length ? 1 : 0), 200);
});
