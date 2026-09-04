/* ============================================================
   Ctrl+K doit mener à l'élément, pas seulement à son module
   ------------------------------------------------------------
   Le défaut : cliquer un terme dans la recherche rapide ouvrait
   le glossaire tout en haut. Le module plaçait bien le terme,
   mais 60 ms après le rendu — pendant que go() remettait le
   défilement à zéro, que l'animation d'entrée courait encore et
   que 40 000 px de fiches se mettaient en page. Selon la
   machine, on arrivait au bon endroit, à mi-chemin, ou nulle
   part.

   On refait donc le geste complet — ouvrir la palette, taper,
   cliquer le résultat — et on vérifie que l'élément est
   RÉELLEMENT à l'écran. Plusieurs fois, parce qu'un défaut de
   synchronisation qui ne se montre qu'une fois sur trois n'est
   pas corrigé tant qu'on ne l'a pas vu échouer.
   ============================================================ */
'use strict';
const { app, BrowserWindow } = require('electron');
const path = require('path');
const os = require('os');

const RACINE = path.join(__dirname, '..');
app.setPath('userData', path.join(os.tmpdir(), 'orthostudent-saut'));   /* profil jetable */
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

/* terme du glossaire, section de cours */
const CIBLES = [
  { quoi: 'glossaire', tape: 'Amblyopie', attendu: 'Amblyopie' },
  { quoi: 'glossaire', tape: 'Panum', attendu: 'Panum' },
  { quoi: 'glossaire', tape: 'Correspondance rétinienne', attendu: null },
  { quoi: 'cours', tape: 'accommodation', attendu: null }
];

app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: true, width: 1400, height: 1000,
    webPreferences: { contextIsolation: true, nodeIntegration: false } });
  const erreurs = [];
  win.webContents.on('console-message', (_e, l, m) => { if (l >= 2) erreurs.push(m); });
  await win.loadFile(path.join(RACINE, 'src', 'index.html'));
  await pause(700);

  const rates = [];

  for (const c of CIBLES) {
    for (let essai = 1; essai <= 3; essai++) {
      await win.webContents.executeJavaScript("App.go('home')");
      await pause(250);

      const ouvert = await win.webContents.executeJavaScript(`(function () {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
        var inp = document.getElementById('searchInput');
        if (!inp) return null;
        inp.value = ${JSON.stringify(c.tape)};
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        var r = document.querySelectorAll('#searchRes .search-item');
        return { champ: true, resultats: r.length,
          premier: r[0] ? r[0].textContent.replace(/\\s+/g, ' ').trim().slice(0, 60) : null };
      })()`);

      if (!ouvert || !ouvert.champ) { rates.push(c.tape + ' : palette introuvable'); break; }
      if (!ouvert.resultats) { rates.push(c.tape + ' : aucun résultat'); break; }

      await pause(120);
      const arrivee = await win.webContents.executeJavaScript(`(function () {
        var r = document.querySelectorAll('#searchRes .search-item');
        r[0].click();
        return true;
      })()`);
      if (!arrivee) { rates.push(c.tape + ' : clic impossible'); break; }

      await pause(900);
      const ou = await win.webContents.executeJavaScript(`(function () {
        var main = document.getElementById('main');
        var cible = document.querySelector('#view .gl-item.flash')
          || document.querySelector('#view .acc-item.open');
        if (!cible) return { module: App.current ? App.current() : '?', vise: null };
        var b = cible.getBoundingClientRect();
        return {
          defilement: Math.round(main.scrollTop),
          haut: Math.round(b.top),
          hauteurVue: main.clientHeight,
          /* « visible » ne suffit pas : un terme situé par hasard en bas de
             l'écran passerait alors qu'aucun défilement n'a eu lieu. On exige
             qu'il soit posé dans le tiers médian de la vue. */
          visible: b.top > -4 && b.bottom < main.clientHeight + 4 &&
            b.top < main.clientHeight * 0.66,
          titre: cible.textContent.replace(/\\s+/g, ' ').trim().slice(0, 42)
        };
      })()`);

      if (!ou || ou.vise === null) { rates.push(c.tape + ' : rien de visé sur la page'); continue; }
      const ok = ou.visible;
      if (essai === 1 || !ok) {
        console.log('  ' + (ok ? '✔' : '✘') + ' « ' + c.tape + ' » essai ' + essai +
          ' → ' + ou.titre + '  · défilement ' + ou.defilement +
          ' · bord haut à ' + ou.haut + ' px (vue de ' + ou.hauteurVue + ')');
      }
      if (!ok) rates.push(c.tape + ' (essai ' + essai + ') : hors de l’écran, ' + ou.haut + ' px');
    }
  }

  console.log('\n' + (erreurs.length ? 'ERREURS CONSOLE : ' + erreurs.join(' | ') : 'Aucune erreur console.'));
  if (rates.length) {
    console.log('\n' + rates.length + ' échec(s) :');
    rates.forEach((r) => console.log('  · ' + r));
    app.exit(1);
  } else {
    console.log('Chaque élément cliqué dans Ctrl+K arrive bien à l’écran.');
    app.exit(0);
  }
});
