/* ============================================================
   L'écran des cartes Anki : ce qui s'ouvre doit se refermer
   ------------------------------------------------------------
   Un paquet se dépliait mais ne se repliait pas. La cause était
   en CSS : la règle par défaut du navigateur, [hidden] {
   display: none }, perd contre n'importe quelle règle d'auteur
   qui pose un display — et le conteneur des cartes était en
   « display: flex ». L'attribut hidden était bien posé, il
   n'avait simplement aucun effet.

   Rien ne le voyait, parce que le banc d'essai précédent
   cliquait UNE fois et vérifiait que les cartes apparaissaient.
   Il n'a jamais vérifié qu'elles disparaissaient. D'où ce test,
   qui mesure la VISIBILITÉ RÉELLE — offsetParent, pas
   l'attribut, qui est précisément ce qui mentait.

   Un faux AnkiConnect sert des cartes de démonstration : le test
   ne touche ni au vrai Anki ni à la collection de personne.
   ============================================================ */
'use strict';
const { app, BrowserWindow, ipcMain } = require('electron');
process.env.ORTHO_ANKI_PORT = '8796';

const path = require('path');
const os = require('os');
const http = require('http');
const anki = require('../anki');

const RACINE = path.join(__dirname, '..');
/* Profil neuf à chaque lancement : un test qui hérite de l'état du précédent
   ne teste plus ce qu'il croit. C'est ce qui l'a fait échouer une fois — le
   bouton disait « Actualiser » au lieu de « Récupérer ». */
app.setPath('userData', path.join(os.tmpdir(), 'orthostudent-ecran-' + process.pid));
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

/* deux cours dans deux UE : de quoi éprouver l'arbre et le repli */
const PAQUETS = [
  'Orthoptie', 'Orthoptie::L1', 'Orthoptie::L1::S1',
  'Orthoptie::L1::S1::UE04_Physiologie_visuelle',
  'Orthoptie::L1::S1::UE04_Physiologie_visuelle::CM01_Voir_ne_suffit_pas',
  'Orthoptie::L1::S1::UE02_Optique',
  'Orthoptie::L1::S1::UE02_Optique::CM01_Les_lentilles'
];
const CARTES = [];
[['Orthoptie::L1::S1::UE04_Physiologie_visuelle::CM01_Voir_ne_suffit_pas', 3],
 ['Orthoptie::L1::S1::UE02_Optique::CM01_Les_lentilles', 2]].forEach(function (p, k) {
  for (let i = 0; i < p[1]; i++) {
    CARTES.push({
      cardId: 1000 * (k + 1) + i, deckName: p[0], modelName: 'Basique',
      fields: { Recto: { value: 'Question ' + (k + 1) + '.' + (i + 1), order: 0 },
                Verso: { value: 'Réponse ' + (k + 1) + '.' + (i + 1), order: 1 } }
    });
  }
});

ipcMain.handle('anki:etat', async () => anki.etat());
ipcMain.handle('anki:cartes', async (evt, d) => anki.cartes((d && d.requete) || 'deck:*',
  (pr) => evt.sender.send('anki:progres', pr)));

const serveur = http.createServer((req, res) => {
  let b = '';
  req.on('data', (c) => { b += c; });
  req.on('end', () => {
    let d = {};
    try { d = JSON.parse(b); } catch (e) { /* vide */ }
    let result = null;
    if (d.action === 'version') result = 6;
    else if (d.action === 'deckNames') result = PAQUETS;
    else if (d.action === 'findCards') result = CARTES.map((c) => c.cardId);
    else if (d.action === 'cardsInfo') {
      const veut = (d.params && d.params.cards) || [];
      result = CARTES.filter((c) => veut.indexOf(c.cardId) >= 0);
    }
    res.end(JSON.stringify({ result, error: null }));
  });
});

setTimeout(() => { console.log('DÉLAI DÉPASSÉ'); process.exit(2); }, 60000);

const dur = [];

/* Le port peut rester tenu quelques secondes par l'exécution précédente. On
   en essaie plusieurs plutôt que d'attendre : un test qui échoue parce qu'on
   vient de le lancer n'apprend rien. */
async function ecouter() {
  for (let port = 8796; port < 8806; port++) {
    const ok = await new Promise((r) => {
      const fin = (v) => { serveur.removeAllListeners('error'); r(v); };
      serveur.once('error', () => fin(false));
      serveur.listen(port, '127.0.0.1', () => fin(true));
    });
    if (ok) { process.env.ORTHO_ANKI_PORT = String(port); return port; }
  }
  return null;
}

app.whenReady().then(async () => {
  const port = await ecouter();
  if (!port) { console.log('Aucun port libre entre 8796 et 8805.'); process.exit(2); }
  /* anki.js a lu le port à son chargement : on le recharge sur le bon */
  delete require.cache[require.resolve('../anki')];
  const ankiPort = require('../anki');
  ipcMain.removeHandler('anki:etat');
  ipcMain.removeHandler('anki:cartes');
  ipcMain.handle('anki:etat', async () => ankiPort.etat());
  ipcMain.handle('anki:cartes', async (evt, d) => ankiPort.cartes((d && d.requete) || 'deck:*',
    (pr) => evt.sender.send('anki:progres', pr)));
  const w = new BrowserWindow({ show: true, width: 1400, height: 1000,
    webPreferences: { preload: path.join(RACINE, 'preload.js'), contextIsolation: true } });
  const err = [];
  w.webContents.on('console-message', (_e, l, m) => { if (l >= 2) err.push(m); });
  await w.loadFile(path.join(RACINE, 'src', 'index.html'));
  await pause(700);

  try { await w.webContents.executeJavaScript("App.go('flashcards')"); }
  catch (e) { console.log('ÉCHEC App.go : ' + e.message); process.exit(3); }
  await pause(2000);
  await w.webContents.executeJavaScript(
    "(function(){var b=[].slice.call(document.querySelectorAll('#view .btn'))" +
    ".filter(function(x){return /Récupérer|Actualiser/.test(x.textContent);})[0];" +
    "if(!b) throw new Error('aucun bouton de récupération'); b.click();})()");
  await pause(2000);

  /* Combien de cartes sont RÉELLEMENT visibles ? offsetParent vaut null pour
     un élément non rendu : c'est la seule mesure que le défaut ne trompait
     pas — l'attribut hidden, lui, était bien posé. */
  const compter = `(function () {
    var vues = [].slice.call(document.querySelectorAll('#view .ak-carte'))
      .filter(function (n) { return n.offsetParent !== null; });
    var tetes = [].slice.call(document.querySelectorAll('#view .ak-noeud'));
    return {
      visibles: vues.length,
      total: document.querySelectorAll('#view .ak-carte').length,
      ouverts: tetes.filter(function (t) { return t.classList.contains('ouvert'); }).length,
      noeuds: tetes.map(function (t) { return t.textContent.replace(/\\s+/g, ' ').trim(); })
    };
  })()`;

  let depart;
  try { depart = await w.webContents.executeJavaScript(compter); }
  catch (e) { console.log('ÉCHEC compter : ' + e.message); process.exit(3); }
  console.log('arbre : ' + depart.noeuds.join('  |  '));
  console.log('au départ : ' + depart.visibles + ' carte(s) visible(s) sur ' + depart.total +
    ' · ' + depart.ouverts + ' paquet(s) ouvert(s)');
  if (depart.visibles !== 0) dur.push('les cartes sont visibles alors qu’aucun paquet n’est ouvert');

  function cliquer(motif) {
    return w.webContents.executeJavaScript(
      "(function(){var t=[].slice.call(document.querySelectorAll('#view .ak-noeud'))" +
      ".filter(function(x){return /" + motif + "/.test(x.textContent);})[0];" +
      "if(!t) return false; t.click(); return true;})()");
  }

  /* 1er clic : ça s'ouvre */
  const ok1 = await cliquer('CM01');
  await pause(250);
  const ouvert = await w.webContents.executeJavaScript(compter);
  console.log('après 1 clic  : ' + ouvert.visibles + ' visible(s) · ' + ouvert.ouverts + ' ouvert(s)');
  if (!ok1) dur.push('aucun paquet CM01 à cliquer');
  else if (ouvert.visibles === 0) dur.push('le paquet ne s’ouvre pas');

  /* 2e clic sur le MÊME paquet : ça doit se refermer */
  await cliquer('CM01');
  await pause(250);
  const referme = await w.webContents.executeJavaScript(compter);
  console.log('après 2 clics : ' + referme.visibles + ' visible(s) · ' + referme.ouverts + ' ouvert(s)');
  if (referme.visibles !== depart.visibles) {
    dur.push('le paquet ne se referme pas : ' + referme.visibles +
      ' carte(s) encore visible(s) au lieu de ' + depart.visibles);
  }
  if (referme.ouverts !== 0) dur.push('la tête du paquet reste marquée « ouvert »');

  /* et deux paquets s'ouvrent indépendamment */
  await cliquer('Voir ne suffit pas');
  await pause(150);
  await cliquer('Les lentilles');
  await pause(250);
  const deux = await w.webContents.executeJavaScript(compter);
  console.log('deux paquets ouverts : ' + deux.visibles + ' visible(s) sur ' + deux.total);
  if (deux.visibles !== deux.total) dur.push('deux paquets ouverts ne montrent pas toutes les cartes');

  console.log('\n' + (err.length ? 'ERREURS CONSOLE : ' + err.join(' | ') : 'Aucune erreur console.'));
  serveur.close();
  if (dur.length) {
    console.log('\n' + dur.length + ' problème(s) :');
    dur.forEach((d) => console.log('  · ' + d));
  } else {
    console.log('Un paquet s’ouvre, se referme, et n’entraîne pas les autres.');
  }
  setTimeout(() => process.exit(dur.length || err.length ? 1 : 0), 200);
});
