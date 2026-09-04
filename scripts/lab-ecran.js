/* ============================================================
   Vision Lab — les expériences passées pour de vrai
   ------------------------------------------------------------
   Le noyau est éprouvé ailleurs (npm run lab) : tirage,
   équilibrage, escaliers, statistiques, exports. Rien de tout
   cela ne dit si l'écran marche.

   Les défauts qui ont coûté le plus cher dans ce projet n'étaient
   visibles qu'à l'affichage : un paquet qui s'ouvrait sans pouvoir
   se refermer, un onglet large de 825 px dans une fenêtre de 365,
   un objectif du jour portant sur des fiches supprimées. Aucun
   n'aurait été pris par un test qui vérifie l'absence d'exception.

   Ce banc-ci passe donc de vraies séances : il calibre, lit la
   consigne, choisit un œil, répond à tous les essais au clavier,
   et lit les rapports obtenus. Il vérifie ensuite ce qu'un humain
   verrait immédiatement et qu'aucune assertion sur des nombres ne
   voit :

     · pendant l'affichage du stimulus, RIEN d'autre n'est à
       l'écran — pas de compteur, pas de panneau ;
     · les rapports ne contiennent ni « undefined », ni « NaN »,
       ni « null » dans leur texte ;
     · le calque plein écran est bien démonté à la sortie.

   Le profil est jetable. Une exécution précédente avait détruit
   la progression réelle : plus jamais.
   ============================================================ */
'use strict';
const { app, BrowserWindow } = require('electron');
const path = require('path');
const os = require('os');

const RACINE = path.join(__dirname, '..');
app.setPath('userData', path.join(os.tmpdir(), 'orthostudent-lab-' + process.pid));

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const dur = [];
function verifier(ok, quoi, detail) {
  console.log('  ' + (ok ? '✔' : '✘') + ' ' + quoi + (ok || !detail ? '' : '  → ' + detail));
  if (!ok) dur.push(quoi + (detail ? ' : ' + detail : ''));
}

setTimeout(() => { console.log('DÉLAI DÉPASSÉ'); process.exit(2); }, 480000);

/* Une étape qui lève arrêtait le banc en silence jusqu'au délai : on perdait
   à la fois le message d'erreur et les vérifications restantes. */
process.on('unhandledRejection', (e) => {
  console.log('\nINTERROMPU : ' + (e && e.message ? e.message : e));
  if (dur.length) {
    console.log(dur.length + ' problème(s) déjà relevé(s) :');
    dur.forEach((d) => console.log('  · ' + d));
  }
  process.exit(3);
});

app.whenReady().then(async () => {
  const w = new BrowserWindow({
    show: true, width: 1500, height: 1000,
    webPreferences: { preload: path.join(RACINE, 'preload.js'), contextIsolation: true }
  });
  const err = [];
  /* Chromium refuse le plein écran quand la demande ne vient pas d'un vrai
     geste : ici les clics sont synthétiques, donc le refus est certain et
     n'apprend rien. On l'écarte NOMMÉMENT plutôt que de relâcher le seuil —
     toute autre erreur de console fait toujours échouer le banc. */
  const ATTENDU = /requestFullscreen.*user gesture/;
  w.webContents.on('console-message', (_e, l, m) => {
    if (l >= 2 && !ATTENDU.test(m)) err.push(m);
  });
  const js = (code) => w.webContents.executeJavaScript(code);

  await w.loadFile(path.join(RACINE, 'src', 'index.html'));
  await pause(900);

  /* ============================================================
     1 · Le branchement
     ============================================================ */
  console.log('BRANCHEMENT');
  const b = await js(`(function () {
    var nav = [].slice.call(document.querySelectorAll('.nav-item')).map(function (n) {
      return n.textContent.trim();
    });
    return {
      module: !!(window.Modules && window.Modules.vision),
      noyau: !!(window.Lab && window.LabCalib),
      exp: window.Lab ? window.Lab.toutes().map(function (d) { return d.id; }) : [],
      escalier: !!(window.Lab && window.Lab.escalier && window.Lab.seuil),
      dansNav: nav.filter(function (t) { return /Vision Lab/i.test(t); }).length
    };
  })()`);
  verifier(b.module, 'le module vision est chargé');
  verifier(b.noyau, 'le noyau et la calibration sont chargés');
  verifier(b.escalier, 'l’escalier adaptatif est exporté');
  verifier(b.exp.indexOf('recherche') >= 0 && b.exp.indexOf('encombrement') >= 0,
    'les deux expériences sont déclarées', b.exp.join(', '));
  verifier(b.dansNav >= 1, 'une entrée « Vision Lab » figure dans la navigation');

  /* Ctrl+K et la commande /lab */
  const cmd = await js(`(function () {
    var out = {};
    ['/lab', '/lab recherche visuelle 4 8 12', '/lab encombrement 2.5 5 10',
     '/lab recherche visuelle 8', 'encombrement']
      .forEach(function (q) {
        App.openSearch();
        var champ = document.getElementById('searchInput');
        champ.value = q;
        champ.dispatchEvent(new Event('input', { bubbles: true }));
        var items = [].slice.call(document.querySelectorAll('#searchRes .search-item'));
        out[q] = { n: items.length,
          premier: items.length ? items[0].textContent.replace(/\\s+/g, ' ').trim() : null };
      });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    return out;
  })()`);
  Object.keys(cmd).forEach((q) => {
    console.log('    « ' + q + ' » → ' + ((cmd[q] || {}).premier || '—'));
  });
  verifier(/Recherche visuelle/.test((cmd['/lab recherche visuelle 4 8 12'] || {}).premier || '') &&
    /4, 8, 12/.test((cmd['/lab recherche visuelle 4 8 12'] || {}).premier || ''),
    '/lab recherche visuelle 4 8 12 vise la bonne expérience et ses tailles');
  verifier(/Encombrement/.test((cmd['/lab encombrement 2.5 5 10'] || {}).premier || ''),
    '/lab encombrement vise l’autre expérience',
    (cmd['/lab encombrement 2.5 5 10'] || {}).premier);
  verifier(/complet/i.test((cmd['/lab recherche visuelle 8'] || {}).premier || ''),
    'une seule valeur ne donne pas de pente : protocole complet à la place');
  verifier(/Vision Lab/i.test((cmd['/lab'] || {}).premier || ''),
    '« /lab » seul ouvre le laboratoire');

  /* ============================================================
     2 · Le laboratoire, écran non calibré
     ============================================================ */
  console.log('\nLABORATOIRE, ÉCRAN NON CALIBRÉ');
  await js("App.go('vision')");
  await pause(500);
  const froid = await js(`(function () {
    var t = document.getElementById('view').textContent;
    return {
      avis: /ne constitue pas un examen clinique/.test(t),
      nonCalibre: /Écran non calibré/.test(t),
      experiences: document.querySelectorAll('#view .mod-tile').length,
      obstacle: /Aucune mesure n’est possible/.test(t)
    };
  })()`);
  verifier(froid.avis, 'l’avertissement « ni examen clinique ni dispositif médical » est affiché');
  verifier(froid.nonCalibre, 'un écran non calibré est annoncé comme tel');
  verifier(froid.experiences === 2, 'les deux expériences sont listées', String(froid.experiences));
  verifier(froid.obstacle, 'et la raison de ne rien pouvoir mesurer est dite');

  /* ============================================================
     3 · La calibration
     ============================================================ */
  console.log('\nCALIBRATION');
  const calib = await js(`(function () {
    [].slice.call(document.querySelectorAll('#view .btn'))
      .filter(function (x) { return /Calibrer/.test(x.textContent); })[0].click();
    var curseur = document.querySelector('#view input[type=range]');
    var champ = document.querySelector('#view input[type=number]');
    if (!curseur || !champ) return { erreur: 'écran de calibration incomplet' };
    /* une carte à 300 px de large : 85,60 / 300 = 0,2853 mm par pixel */
    curseur.value = 300;
    curseur.dispatchEvent(new Event('input', { bubbles: true }));
    champ.value = 60;
    champ.dispatchEvent(new Event('input', { bubbles: true }));
    var mesure = /Un pixel mesure ([0-9.,]+) mm/.exec(document.getElementById('view').textContent);
    [].slice.call(document.querySelectorAll('#view .btn'))
      .filter(function (x) { return /Enregistrer la calibration/.test(x.textContent); })[0].click();
    return { mm: mesure ? mesure[1] : null, etat: window.LabCalib.resume(),
             cles: Object.keys(window.Store.state.labCalib || {}),
             ici: window.LabCalib.ecranId() };
  })()`);
  await pause(400);
  verifier(!calib.erreur, 'l’écran de calibration se rend', calib.erreur);
  verifier(calib.mm === '0,285', 'une carte de 300 px donne 0,285 mm par pixel (virgule française)',
    String(calib.mm));
  const r = calib.etat || {};
  /* 1° à 60 cm = 2·600·tan(0,5°) = 10,472 mm ; divisé par 0,28533 = 36,70 px */
  verifier(Math.abs(r.pxParDegre - 36.7) < 0.2, '1° vaut 36,7 px dans ces conditions',
    String(r.pxParDegre));
  verifier(calib.cles.length === 1 && calib.cles[0] === calib.ici,
    'la calibration est rangée sous l’identifiant de CET écran',
    calib.cles.join(', ') + ' pour ' + calib.ici);
  console.log('    écran ' + r.ecran + ' · ' + r.pouces + '" · ' + r.pxParDegre + ' px/°');

  /* ============================================================
     Une passation menée au clavier, quelle que soit l'expérience
     ------------------------------------------------------------
     On ne peut pas savoir de l'extérieur si un essai attend une
     réponse — c'est délibéré, l'état de la passation est privé.
     On frappe donc régulièrement : les touches envoyées hors
     fenêtre de réponse sont ignorées sans effet, et « Entrée »
     débloque les panneaux d'attente.
     ============================================================ */
  const frappe = `(function (touches) {
    var s = document.querySelector('.lab-scene');
    if (!s) return null;
    var panneau = s.querySelector('.lab-pause');
    var compteur = s.querySelector('.lab-compteur');
    var visible = panneau && !panneau.hidden;
    /* On relève AVANT de frapper : la touche envoyée fait disparaître le
       panneau, et lire ensuite ne raconte plus ce qui était à l'écran. */
    var releve = {
      panneau: visible,
      texte: visible ? panneau.textContent.replace(/\\s+/g, ' ').trim().slice(0, 60) : '',
      compteur: compteur ? compteur.textContent.trim() : ''
    };
    var k = visible ? 'Enter' : touches[Math.floor(Math.random() * touches.length)];
    document.dispatchEvent(new KeyboardEvent('keydown',
      { key: k, bubbles: true, cancelable: true }));
    return releve;
  })(TOUCHES)`;

  async function mener(touches, etiquette) {
    const releves = [];
    let termine = false;
    for (let i = 0; i < 2000; i++) {
      const rel = await js(frappe.replace('TOUCHES', JSON.stringify(touches)));
      if (rel === null) { termine = true; break; }
      releves.push(rel);
      await pause(55);
    }
    console.log('    ' + releves.length + ' relevés' + (etiquette ? ' — ' + etiquette : ''));
    verifier(termine, 'la passation s’est terminée dans le temps imparti',
      'boucle épuisée après ' + releves.length + ' frappes — machine chargée ?');

    /* Ce qu'un humain verrait : pendant un stimulus, l'écran ne porte que lui. */
    const stimuli = releves.filter((x) => !x.panneau && x.compteur === '').length;
    const parasite = releves.filter((x) => !x.panneau && x.compteur !== '' &&
      !/^\d+ \/ \d+$/.test(x.compteur) && !/^\d+ %$/.test(x.compteur) &&
      !/^Entraînement/.test(x.compteur));
    verifier(stimuli > 0, 'des instants sans compteur existent — le stimulus s’affiche seul');
    verifier(parasite.length === 0, 'aucun texte parasite pendant la passation',
      parasite.slice(0, 2).map((x) => x.compteur).join(' | '));
    verifier(releves.some((x) => /Entraînement terminé/.test(x.texte)),
      'le passage entraînement → mesure est annoncé');
    verifier(releves.some((x) => /^(Juste|Faux)/.test(x.texte)),
      'l’entraînement corrige chaque essai');
    await pause(800);
    return releves;
  }

  /* ============================================================
     4 · Recherche visuelle
     ============================================================ */
  console.log('\nRECHERCHE VISUELLE');
  await js(`(function () {
    App.go('vision');
    [].slice.call(document.querySelectorAll('#view .mod-tile'))
      .filter(function (n) { return /Recherche visuelle/.test(n.textContent); })[0].click();
  })()`);
  await pause(400);
  const accRech = await js(`(function () {
    var t = document.getElementById('view').textContent;
    var tuiles = [].slice.call(document.querySelectorAll('#view .mod-tile'));
    return {
      titre: /Recherche visuelle/.test(t),
      modes: tuiles.length,
      armes: tuiles.filter(function (n) { return n.style.cursor !== 'not-allowed'; }).length,
      duree: /≈ \\d+ min/.test(t)
    };
  })()`);
  verifier(accRech.titre, 'l’accueil de l’expérience s’ouvre');
  verifier(accRech.modes === 3, 'les trois modes sont proposés', String(accRech.modes));
  verifier(accRech.armes === 3, 'et ils sont armés une fois l’écran calibré', String(accRech.armes));
  verifier(accRech.duree, 'chaque mode annonce sa durée');

  await js(`(function () {
    [].slice.call(document.querySelectorAll('#view .mod-tile'))
      .filter(function (n) { return /Démonstration/.test(n.textContent); })[0].click();
  })()`);
  await pause(400);
  const consR = await js(`(function () {
    var t = document.getElementById('view').textContent;
    return { vignettes: document.querySelectorAll('#view canvas').length,
             touches: /Cible présente/.test(t) && /Cible absente/.test(t),
             avis: /ne constitue pas un examen clinique/.test(t) };
  })()`);
  verifier(consR.vignettes === 2, 'les deux conditions sont montrées en exemple',
    String(consR.vignettes));
  verifier(consR.touches, 'la consigne nomme les deux réponses');
  verifier(consR.avis, 'l’avertissement est répété avant de commencer');

  await js(`[].slice.call(document.querySelectorAll('#view .btn'))
    .filter(function (x) { return x.textContent === 'Commencer'; })[0].click()`);
  await pause(2200);
  const scene = await js(`(function () {
    var s = document.querySelector('.lab-scene');
    if (!s) return { present: false };
    return { present: true, z: parseInt(getComputedStyle(s).zIndex, 10),
      plein: s.clientWidth === window.innerWidth && s.clientHeight === window.innerHeight,
      toile: s.querySelector('.lab-toile').width > 0 };
  })()`);
  verifier(scene.present && scene.z >= 200 && scene.plein && scene.toile,
    'le calque de passation est monté, au-dessus de tout, plein cadre',
    JSON.stringify(scene));

  await mener(['f', 'j'], 'recherche visuelle, réponses au hasard');

  const rapR = await js(`(function () {
    var vue = document.getElementById('view');
    var t = vue.textContent;
    var s = (window.Store.state.labSessions || [])[0];
    return {
      calqueParti: !document.querySelector('.lab-scene'),
      titre: /Rapport/.test(t),
      essais: s ? s.reponses.length : 0,
      tableaux: vue.querySelectorAll('table').length,
      exports: [].slice.call(vue.querySelectorAll('.btn')).map(function (x) { return x.textContent; })
        .filter(function (x) { return /CSV|JSON|Supprimer/.test(x); }).length,
      conditions: /Graine du tirage/.test(t) && /Champ de recherche/.test(t),
      sales: (t.match(/undefined|NaN|\\[object Object\\]|Infinity/g) || [])
    };
  })()`);
  verifier(rapR.calqueParti, 'le calque plein écran est démonté à la sortie');
  verifier(rapR.titre, 'le rapport s’affiche');
  verifier(rapR.essais === 8, 'les huit essais de la démonstration sont là', String(rapR.essais));
  verifier(rapR.tableaux >= 1, 'le détail par condition est tabulé');
  verifier(rapR.exports === 3, 'CSV, JSON et suppression sont proposés', String(rapR.exports));
  verifier(rapR.conditions, 'les conditions de la mesure sont rappelées');
  verifier(rapR.sales.length === 0, 'aucune salissure dans le texte', rapR.sales.join(', '));

  /* ============================================================
     5 · Encombrement
     ============================================================ */
  console.log('\nENCOMBREMENT');
  await js(`(function () {
    App.go('vision');
    [].slice.call(document.querySelectorAll('#view .mod-tile'))
      .filter(function (n) { return /Encombrement/.test(n.textContent); })[0].click();
  })()`);
  await pause(400);
  const accEnc = await js(`(function () {
    var t = document.getElementById('view').textContent;
    var d = window.Lab.def('encombrement');
    return {
      titre: /Encombrement/.test(t),
      bouma: /loi de Bouma/.test(t),
      clinique: /entassement/.test(t) && /amblyope/.test(t),
      modes: document.querySelectorAll('#view .mod-tile').length,
      obstacles: d.obstacles(d.defauts)
    };
  })()`);
  verifier(accEnc.titre && accEnc.bouma, 'l’expérience se présente et nomme la loi de Bouma');
  verifier(accEnc.clinique, 'et dit à quoi cela sert en orthoptie');
  verifier(accEnc.modes === 3, 'les trois modes sont proposés', String(accEnc.modes));
  console.log('    place à l’écran : ' +
    (accEnc.obstacles.length ? accEnc.obstacles[0].slice(0, 100) : 'les 10° tiennent'));

  /* le choix de l'œil, propre aux expériences monoculaires */
  await js(`(function () {
    [].slice.call(document.querySelectorAll('#view .mod-tile'))
      .filter(function (n) { return /Démonstration/.test(n.textContent); })[0].click();
  })()`);
  await pause(400);
  const oeil = await js(`(function () {
    var t = document.getElementById('view').textContent;
    return { demande: /Quel œil mesurez-vous/.test(t),
             choix: document.querySelectorAll('#view .mod-tile').length };
  })()`);
  verifier(oeil.demande, 'une expérience monoculaire demande quel œil');
  verifier(oeil.choix === 3, 'trois choix : droit, gauche, les deux', String(oeil.choix));

  await js(`(function () {
    /* On vise le TITRE de la tuile : son texte complet contient aussi
       l'aide « Œil gauche occlus. », qui appartient à la tuile de l'œil
       droit — le filtre attrapait donc la mauvaise. */
    [].slice.call(document.querySelectorAll('#view .mod-tile'))
      .filter(function (n) {
        var t = n.querySelector('.mt');
        return t && t.textContent.trim() === 'Œil gauche';
      })[0].click();
  })()`);
  await pause(400);
  const consE = await js(`(function () {
    var t = document.getElementById('view').textContent;
    return { vignettes: document.querySelectorAll('#view canvas').length,
             fleches: /↑/.test(t) && /↓/.test(t) && /←/.test(t) && /→/.test(t),
             brievete: /200 ms/.test(t),
             oeil: /œil gauche/.test(t) };
  })()`);
  verifier(consE.vignettes === 2, 'la consigne montre l’anneau seul puis encadré',
    String(consE.vignettes));
  verifier(consE.fleches, 'et nomme les quatre flèches');
  verifier(consE.brievete, 'elle prévient que l’affichage est bref');
  verifier(consE.oeil, 'et rappelle quel œil est mesuré');

  await js(`[].slice.call(document.querySelectorAll('#view .btn'))
    .filter(function (x) { return x.textContent === 'Commencer'; })[0].click()`);
  await pause(2200);
  await mener(['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'],
    'encombrement, réponses au hasard');

  const rapE = await js(`(function () {
    var vue = document.getElementById('view');
    var t = vue.textContent;
    var s = (window.Store.state.labSessions || [])[0];
    var a = s ? window.Lab.analyser(s) : null;
    return {
      titre: /Rapport/.test(t),
      oeil: /œil gauche/.test(t),
      exp: s ? s.exp : null,
      escaliers: s && s.escaliers ? Object.keys(s.escaliers).length : 0,
      essais: s ? s.reponses.length : 0,
      bouma: /Bouma/.test(t),
      conditions: /Excentricités/.test(t) && /Œil mesuré/.test(t),
      csv: s ? window.Lab.csv(s).split('\\n')[0] : '',
      reserves: a ? a.avertissements.length : 0,
      sales: (t.match(/undefined|NaN|\\[object Object\\]|Infinity/g) || [])
    };
  })()`);
  verifier(rapE.exp === 'encombrement', 'la session enregistrée est bien l’encombrement',
    String(rapE.exp));
  verifier(rapE.titre, 'le rapport s’affiche');
  verifier(rapE.oeil, 'il porte l’œil mesuré');
  verifier(rapE.escaliers === 2, 'deux escaliers en démonstration', String(rapE.escaliers));
  verifier(rapE.essais > 10, 'la passation a duré plus de dix essais', String(rapE.essais));
  verifier(rapE.bouma, 'la constante de Bouma est nommée');
  verifier(rapE.conditions, 'les conditions rappellent excentricités et œil');
  verifier(/excentricite_deg/.test(rapE.csv), 'le CSV porte les colonnes de l’encombrement',
    rapE.csv.slice(0, 90));
  verifier(rapE.reserves > 0,
    'des réponses au hasard déclenchent des réserves — et le rapport les affiche');
  verifier(rapE.sales.length === 0, 'aucune salissure dans le texte', rapE.sales.join(', '));
  console.log('    ' + rapE.essais + ' essais, ' + rapE.reserves + ' réserve(s)');

  /* ============================================================
     6 · Un rapport sur des données plausibles
     ------------------------------------------------------------
     Des réponses au hasard ne montrent que la prudence du rapport.
     Pour voir s'il sait LIRE un résultat, il faut une passation
     qu'un étudiant attentif aurait pu produire.
     ============================================================ */
  console.log('\nRAPPORT SUR DES DONNÉES PLAUSIBLES');
  const plausible = await js(`(function () {
    /* Un observateur dont l'espacement critique vaut la moitié de
       l'excentricité — la loi de Bouma, par construction. */
    var s = Lab.creer('encombrement', 'mesure', {}, 777);
    s.oeil = 'od';
    var rnd = Lab.generateur(0x5bf0);
    var garde = 0;
    for (var i = 0; i < s.essais.length && ++garde < 4000; i++) {
      var e = s.essais[i];
      var p;
      if (e.isole || e.entrainement) p = 0.95;
      else {
        var c = 0.5 * e.excentricite;
        p = 0.25 + 0.75 / (1 + Math.pow((0.863 * c) / e.espacement, 3));
      }
      var juste = rnd() < p;
      Lab.repondre(s, i, juste ? e.cible : (e.cible + 1 + Math.floor(rnd() * 3)) % 4, 700);
    }
    Lab.enregistrer(s);
    App.go('vision');
    [].slice.call(document.querySelectorAll('#view .btn'))
      .filter(function (x) { return x.textContent === 'Ouvrir'; })[0].click();
    var vue = document.getElementById('view');
    var t = vue.textContent;
    return {
      a: Lab.analyser(s),
      points: vue.querySelectorAll('svg circle').length,
      repere: /la moitié de l’excentricité/.test(t),
      tableau: /Espacement critique/.test(t),
      explique: /Votre espacement critique/.test(t) && /loi de Bouma/i.test(t),
      isole: /La cible, seule/.test(t),
      pratique: /entassement/.test(t),
      sales: (t.match(/undefined|NaN|\\[object Object\\]|Infinity/g) || [])
    };
  })()`);
  await pause(300);
  const a = plausible.a;
  verifier(a.bouma !== null && Math.abs(a.bouma - 0.5) < 0.2,
    'la constante de Bouma est retrouvée autour de 0,5',
    a.bouma === null ? '—' : a.bouma.toFixed(2));
  verifier(a.exactitudeIsole > 0.8, 'la cible isolée est bien lisible',
    Math.round(a.exactitudeIsole * 100) + ' %');
  console.log('    ' + a.parExcentricite.map((c) =>
    c.excentricite + '° → ' + (c.espacement === null ? '—' : c.espacement.toFixed(2) + '°')).join(', '));
  verifier(plausible.points === 3, 'les trois seuils sont tracés', String(plausible.points));
  verifier(plausible.repere, 'le repère « moitié de l’excentricité » est tracé');
  verifier(plausible.tableau, 'le tableau des espacements critiques est là');
  verifier(plausible.explique, 'l’explication commente les seuils obtenus et la loi de Bouma');
  verifier(plausible.isole, 'et le contrôle sur cible isolée');
  verifier(plausible.pratique, 'le rapport rattache le résultat à la pratique orthoptique');
  verifier(plausible.sales.length === 0, 'aucune salissure', plausible.sales.join(', '));

  /* ============================================================
     7 · L'historique, la comparaison, la suppression
     ============================================================ */
  console.log('\nHISTORIQUE, COMPARAISON, SUPPRESSION');
  const hist = await js(`(function () {
    App.go('vision');
    var t = document.getElementById('view').textContent;
    return { listee: /Vos passations/.test(t),
      lignes: document.querySelectorAll('#view tbody tr').length,
      colonneOeil: /Œil/.test(t),
      melange: /Recherche visuelle/.test(t) && /Encombrement/.test(t) };
  })()`);
  verifier(hist.listee, 'le laboratoire liste les passations');
  verifier(hist.lignes >= 3, 'toutes les passations y sont', String(hist.lignes));
  verifier(hist.melange, 'et les deux expériences s’y mêlent, chacune nommée');
  verifier(hist.colonneOeil, 'la colonne « Œil » est présente');

  const cmp = await js(`(function () {
    /* un second encombrement, sur l'autre œil */
    var s = Lab.creer('encombrement', 'demo', {}, 313);
    s.oeil = 'og';
    var rnd = Lab.generateur(99);
    var garde = 0;
    for (var i = 0; i < s.essais.length && ++garde < 4000; i++) {
      var e = s.essais[i];
      var p = (e.isole || e.entrainement) ? 0.95
        : 0.25 + 0.75 / (1 + Math.pow((0.863 * 0.8 * e.excentricite) / e.espacement, 3));
      var j = rnd() < p;
      Lab.repondre(s, i, j ? e.cible : (e.cible + 1) % 4, 700);
    }
    Lab.enregistrer(s);
    App.go('vision');
    [].slice.call(document.querySelectorAll('#view .btn'))
      .filter(function (x) { return x.textContent === 'Ouvrir'; })[0].click();
    var sel = document.querySelector('#view select');
    if (!sel) return { erreur: 'pas de sélecteur de comparaison' };
    var opt = [].slice.call(sel.options).filter(function (o) { return o.value; })[0];
    if (!opt) return { erreur: 'aucune autre passation proposée' };
    sel.value = opt.value;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    var t = document.getElementById('view').textContent;
    return { compare: /Constante de Bouma/.test(t),
      deuxYeux: /Deux yeux comparés/.test(t) || /même œil/.test(t),
      sales: (t.match(/undefined|NaN|\\[object Object\\]/g) || []) };
  })()`);
  await pause(300);
  verifier(!cmp.erreur, 'deux passations se comparent', cmp.erreur);
  verifier(cmp.compare, 'le tableau de comparaison porte la constante de Bouma');
  verifier(cmp.deuxYeux, 'et dit si les deux mesures portent sur le même œil');
  verifier((cmp.sales || []).length === 0, 'aucune salissure', (cmp.sales || []).join(', '));

  const suppr = await js(`(function () {
    var avant = (window.Store.state.labSessions || []).length;
    [].slice.call(document.querySelectorAll('#view .btn'))
      .filter(function (x) { return /Supprimer cette session/.test(x.textContent); })[0].click();
    return { avant: avant, apres: (window.Store.state.labSessions || []).length };
  })()`);
  verifier(suppr.apres === suppr.avant - 1, 'une session se supprime',
    suppr.avant + ' → ' + suppr.apres);

  /* ============================================================
     8 · Ce qui doit résister
     ============================================================ */
  console.log('\nSORTIES BRUSQUES');
  await js(`(function () {
    App.go('vision');
    [].slice.call(document.querySelectorAll('#view .mod-tile'))
      .filter(function (n) { return /Recherche visuelle/.test(n.textContent); })[0].click();
    [].slice.call(document.querySelectorAll('#view .mod-tile'))
      .filter(function (n) { return /Démonstration/.test(n.textContent); })[0].click();
    [].slice.call(document.querySelectorAll('#view .btn'))
      .filter(function (x) { return x.textContent === 'Commencer'; })[0].click();
  })()`);
  await pause(700);
  const fuite = await js(`(function () {
    var monte = !!document.querySelector('.lab-scene');
    var n = (window.Store.state.labSessions || []).length;
    App.go('home');
    return { monte: monte, reste: !!document.querySelector('.lab-scene'),
      avant: n, apres: (window.Store.state.labSessions || []).length };
  })()`);
  verifier(fuite.monte, 'une passation démarre');
  verifier(!fuite.reste, 'quitter le module en pleine passation démonte le calque');
  verifier(fuite.apres === fuite.avant, 'une passation abandonnée n’est pas enregistrée');

  const retour = await js(`(function () {
    App.go('vision');
    return /Un laboratoire de psychophysique/.test(document.getElementById('view').textContent);
  })()`);
  verifier(retour, 'revenir au module rouvre le laboratoire, pas le dernier rapport');

  /* Une fenêtre trop petite doit bloquer la mesure plutôt que de la fausser. */
  w.setSize(700, 500);
  await pause(500);
  const petite = await js(`(function () {
    App.go('vision');
    return { obstacles: window.LabCalib.obstacles(),
      dit: /Aucune mesure n’est possible/.test(document.getElementById('view').textContent) };
  })()`);
  verifier(petite.obstacles.some((o) => /trop petite/.test(o)),
    'une fenêtre trop petite est signalée', petite.obstacles.join(' '));
  verifier(petite.dit, 'et l’écran le dit');

  /* ============================================================ */
  console.log('\n' + (err.length ? 'ERREURS CONSOLE : ' + err.join(' | ') : 'Aucune erreur console.'));
  if (dur.length) {
    console.log('\n' + dur.length + ' problème(s) :');
    dur.forEach((d) => console.log('  · ' + d));
  } else {
    console.log('\nLes deux expériences se calibrent, se passent, se lisent et se rangent.');
  }
  setTimeout(() => process.exit(dur.length || err.length ? 1 : 0), 200);
});
