/* ============================================================
   Test de fumée — rend chaque module dans une vraie fenêtre
   ------------------------------------------------------------
   Charge src/index.html sans interface, demande à la page de
   rendre tous les modules l'un après l'autre, et rapporte la
   moindre exception ou erreur de console. Sert de garde-fou après
   un remaniement : `npm run smoke`.
   ============================================================ */
'use strict';

const { app, BrowserWindow } = require('electron');
const path = require('path');
const os = require('os');

/* Profil jetable : le test remplit des QCM, termine une consultation et
   enregistre des notes. Sans cette ligne, tout cela s'écrit dans le
   stockage local de l'application installée et vient polluer la
   progression réelle de l'étudiant. */
app.setPath('userData', path.join(os.tmpdir(), 'orthostudent-smoke'));

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    width: 1440,
    height: 940,
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });

  const consoleErrors = [];
  win.webContents.on('console-message', (_e, level, message) => {
    if (level >= 2) consoleErrors.push(message);
  });

  await win.loadFile(path.join(__dirname, '..', 'src', 'index.html'));

  const report = await win.webContents.executeJavaScript(`(function () {
    var out = { modules: [], errors: [] };
    var ids = Object.keys(window.Modules);
    ids.forEach(function (id) {
      try {
        var node = window.Modules[id].render({ params: {}, go: function () {} });
        out.modules.push(id + ' : ' + (node && node.querySelectorAll ? node.querySelectorAll('*').length : 0) + ' nœuds');
      } catch (e) {
        out.errors.push(id + ' → ' + (e && e.message));
      }
    });

    /* Les écrans qui ne s'affichent qu'après une action : un module qui rend
       son écran d'accueil peut très bien casser au deuxième clic. */
    function step(label, fn) {
      try { fn(); out.modules.push(label); }
      catch (e) { out.errors.push(label + ' → ' + (e && e.message)); }
    }

    step('consultation complète', function () {
      window.Modules.patient.startRandom('ic');
      window.App.go('patient');
      document.querySelectorAll('#view .chip').forEach(function (n) { n.click(); });
      var suite = [].slice.call(document.querySelectorAll('#view .btn'))
        .filter(function (b) { return /Passer aux examens/.test(b.textContent); })[0];
      if (suite) suite.click();
      // prescrire tous les examens, puis dérouler jusqu'au débriefing
      [].slice.call(document.querySelectorAll('#view .tool-card')).forEach(function (n) { n.click(); });
      ['Poser mon diagnostic', 'Conduite à tenir', 'Terminer la consultation'].forEach(function (label) {
        var b = [].slice.call(document.querySelectorAll('#view .btn'))
          .filter(function (x) { return x.textContent.indexOf(label) >= 0; })[0];
        if (!b) return;
        var opt = document.querySelector('#view .q-opt');
        if (opt) opt.click();
        b.click();
      });
    });

    step('onglets du guide', function () {
      window.App.go('help');
      document.querySelectorAll('#view .tab').forEach(function (t) { t.click(); });
    });

    step('onglets de « Réviser »', function () {
      window.App.go('revise');
      document.querySelectorAll('#view .tab').forEach(function (t) { t.click(); });
    });

    step('fiche d’UE', function () {
      var sem = window.CURRICULUM[2];
      window.App.go('studies', { sem: sem.id, ue: sem.ues[0].code });
      document.querySelectorAll('#view .tab').forEach(function (t) { t.click(); });
    });

    step('épreuve blanche', function () {
      window.App.go('exam');
      var go = [].slice.call(document.querySelectorAll('#view .btn'))
        .filter(function (b) { return /Commencer|Lancer/.test(b.textContent); })[0];
      if (go) go.click();
    });

    /* la recherche construit son index sur toutes les banques de données :
       c'est le meilleur test de cohérence qu'on puisse faire sans cliquer */
    try {
      window.App.openSearch();
      var n = document.querySelectorAll('#searchRes .search-item').length;
      out.recherche = n + ' résultats par défaut';
    } catch (e) {
      out.errors.push('recherche → ' + (e && e.message));
    }
    return out;
  })()`);

  console.log(report.modules.length + ' modules rendus');
  report.modules.forEach((m) => console.log('  · ' + m));
  console.log('Recherche : ' + (report.recherche || '—'));

  const errors = report.errors.concat(consoleErrors);
  if (errors.length) {
    console.log('\n' + errors.length + ' erreur(s) :');
    errors.forEach((e) => console.log('  ✗ ' + e));
  } else {
    console.log('\nAucune erreur.');
  }
  app.exit(errors.length ? 1 : 0);
});
