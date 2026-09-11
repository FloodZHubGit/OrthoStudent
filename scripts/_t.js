'use strict';
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
/* profil jetable : ce relevé écrit un état de test, il ne doit pas
   toucher la progression réelle (voir scripts/smoke.js) */
app.setPath('userData', require('os').tmpdir() + '/orthostudent-smoke');
app.disableHardwareAcceleration();

const SORTIE = process.env.SORTIE || require('os').tmpdir();
const POSTES = [
  ['descartes', 'Descartes — l’angle réfracté'],
  ['angle_limite', 'Angle limite et réflexion totale'],
  ['prisme_exact', 'Prisme — la déviation exacte'],
  ['prisme_ortho', 'Prisme mince — du degré à la dioptrie'],
  ['dioptre_vergence', 'Dioptre sphérique — la vergence'],
  ['miroir_conjug', 'Miroir sphérique — où se forme l’image'],
  ['lentille_conjug', 'Lentille mince — position de l’image']
];

/* La grille de sélection part de « tout coché » : un clic sur une puce
   décoche celle-là. Pour n'en garder qu'une, on décoche donc toutes les
   autres — c'est ce que ferait l'étudiant. */
const ISOLER = `function (garde) {
  App.go('atelier');
  var puces = [].slice.call(document.querySelectorAll('#view .chip, #view button[title]'));
  puces = puces.filter(function (b) { return b.getAttribute('title'); });
  var cible = puces.filter(function (b) { return b.getAttribute('title') === garde; })[0];
  if (!cible) return 'puce introuvable : ' + garde + ' (' + puces.length + ' puces)';
  puces.forEach(function (b) { if (b !== cible) b.click(); });
  var go = [].slice.call(document.querySelectorAll('#view button'))
    .filter(function (x) { return /Commencer la série/.test(x.textContent); })[0];
  if (!go) return 'bouton de départ introuvable';
  go.click();
  return null;
}`;

app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: 1280, height: 1000,
    webPreferences: { contextIsolation: true } });
  await win.loadFile(path.join(__dirname, '..', 'src', 'index.html'));

  for (const [id, nom] of POSTES) {
    /* la partie en cours masque les reglages : on repart d'une page neuve */
    await win.loadFile(path.join(__dirname, '..', 'src', 'index.html'));
    const r = await win.webContents.executeJavaScript(`(function(){
      var isoler = ${ISOLER};
      var err = isoler(${JSON.stringify(nom)});
      if (err) return { err: err };
      var v = document.getElementById('view');
      return {
        titre: (v.querySelector('.card h2') || {}).textContent,
        enonce: (v.querySelector('.q-text') || {}).innerHTML,
        champs: [].slice.call(v.querySelectorAll('.field')).map(function (f) {
          return f.textContent.replace(/\\s+/g, ' ').trim();
        }),
        hauteur: v.scrollHeight
      };
    })()`);
    if (r.err) { console.log('\n' + id + ' : ✘ ' + r.err); continue; }
    console.log('\n───────── ' + id + ' (' + r.hauteur + ' px) ─────────');
    console.log(r.titre + '\n' + r.enonce);
    console.log('champs : ' + JSON.stringify(r.champs));
    fs.writeFileSync(path.join(SORTIE, 'atelier-' + id + '.png'),
      (await win.webContents.capturePage()).toPNG());
  }

  /* une correction fausse, pour voir la faute nommée et le rappel */
  const c = await win.webContents.executeJavaScript(`(function(){
    var v = document.getElementById('view');
    var i = v.querySelector('input');
    i.value = '-1000';
    i.dispatchEvent(new Event('input', { bubbles: true }));
    var b = [].slice.call(v.querySelectorAll('button'))
      .filter(function (x) { return /Valider/.test(x.textContent); })[0];
    if (!b) return 'pas de bouton Valider';
    b.click();
    return document.getElementById('view').textContent.replace(/\\s+/g, ' ').trim().slice(0, 900);
  })()`);
  console.log('\n───────── correction (réponse hors de tout piège) ─────────\n' + c);
  fs.writeFileSync(path.join(SORTIE, 'atelier-correction.png'),
    (await win.webContents.capturePage()).toPNG());

  app.quit();
}).catch(e => { console.error(e); app.exit(1); });
