/* ============================================================
   Banc d'essai du répétiteur
   ------------------------------------------------------------
   Le répétiteur promet deux choses : reconnaître ce qu'on lui
   demande, et ne jamais répondre autre chose que le contenu de
   l'application. Aucune des deux ne se vérifie en lisant le
   code — il faut lui poser de vraies questions, telles qu'un
   étudiant les écrit, et regarder ce qui sort.

   Ce script charge l'application dans une vraie fenêtre, pose la
   batterie ci-dessous, et rapporte pour chacune : l'intention
   reconnue, le titre de la réponse, la provenance, le nombre de
   blocs, et si un schéma est sorti. Il rend aussi la réponse
   complète pour quelques questions témoins, afin qu'on puisse la
   lire plutôt que de la supposer.

       npm run repet
   ============================================================ */
'use strict';

const { app, BrowserWindow } = require('electron');
const path = require('path');
const os = require('os');

/* Profil jetable : ce banc lance des interrogations, qui écrivent dans les
   boîtes. Sans cette ligne, il abîmerait la progression réelle. */
app.setPath('userData', path.join(os.tmpdir(), 'orthostudent-repet'));
app.disableHardwareAcceleration();

/* Les questions telles qu'on les écrit vraiment : minuscules, fautes de
   frappe, apostrophes droites ou courbes, phrases sans verbe. */
const QUESTIONS = [
  // ne pas comprendre — le cas d'usage central
  ['expl', 'je comprends pas l’accommodation'],
  ['expl', "j'ai pas compris la conoide de sturm"],
  ['expl', 'explique moi les voies visuelles'],
  ['expl', 'pourquoi la cornée est transparente ?'],
  ['expl', 'je bloque sur la loi de prentice'],
  ['expl', 'approfondir la vision binoculaire'],

  // définitions
  ['defi', "qu'est-ce que l'amblyopie ?"],
  ['defi', 'c est quoi le rapport AC/A'],
  ['defi', 'définition de la fusion'],
  ['defi', 'que veut dire DVD'],

  // comparaisons
  ['diff', 'différence entre ésotropie et exotropie'],
  ['diff', 'difference entre myopie et hypermetropie'],
  ['diff', 'ne pas confondre phorie et tropie'],

  // schémas
  ['schema', 'montre moi le schéma de la rétine'],
  ['schema', 'le schéma de la spirale de tillaux'],
  ['schema', 'dessine moi la conoïde de sturm'],

  // programme, examen, pièges
  ['ou', "l'astigmatisme c'est dans quelle UE ?"],
  ['ou', 'où en suis-je sur UE9 ?'],
  ['plan', "qu'est-ce qui tombe en UE3 ?"],
  ['plan', 'comment répondre à la question classique de UE1'],
  ['piege', 'les pièges de UE8'],
  ['piege', 'quelle erreur on fait sur le cover test'],

  // chiffres et calculs
  ['chiffre', "valeur normale de l'amplitude de fusion"],
  ['calcul', '12 delta'],
  ['calcul', 'prentice 4 3'],
  ['calcul', '5/10'],
  ['calcul', 'transposition -2,50 -1,00 90'],

  // interrogation et conduite de la révision
  ['interro', 'interroge-moi sur UE9'],
  ['interro', 'teste moi sur les prismes'],
  ['faire', 'je fais quoi aujourd’hui ?'],
  ['faire', 'par où commencer ?'],

  // cas, conversation, et le cas honnête
  ['cas', 'un cas clinique sur UE1'],
  ['aide', 'que sais-tu faire ?'],
  ['bonjour', 'bonjour'],
  ['vide', 'quelle est la capitale de la mongolie'],
  ['vide', 'zzzz qwerty']
];

/* Les réponses qu'on veut lire en entier, pas seulement compter. */
const TEMOINS = [
  'que veut dire DVD',
  'c est quoi le rapport AC/A',
  'définition de la fusion',
  'je comprends pas l’accommodation',
  'différence entre ésotropie et exotropie',
  "l'astigmatisme c'est dans quelle UE ?",
  'quelle est la capitale de la mongolie'
];

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false, width: 1440, height: 940,
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });

  const erreurs = [];
  win.webContents.on('console-message', (_e, level, message) => {
    if (level >= 2) erreurs.push(message);
  });

  await win.loadFile(path.join(__dirname, '..', 'src', 'index.html'));

  const rapport = await win.webContents.executeJavaScript(`(function () {
    var Q = ${JSON.stringify(QUESTIONS)};
    var T = ${JSON.stringify(TEMOINS)};
    var out = { lignes: [], temoins: [], erreurs: [], corpus: 0, rendu: [] };

    try { out.corpus = Repet.corpus().length; } catch (e) { out.erreurs.push('corpus → ' + e.message); }

    function decrire(r) {
      return {
        intent: r.intent,
        titre: r.titre,
        chapo: r.chapo || '',
        blocs: (r.blocs || []).map(function (b) { return b.k; }),
        fig: (r.blocs || []).some(function (b) { return b.k === 'fig'; }),
        source: r.source ? (r.source.code || r.source.libelle) : null,
        quiz: r.quiz || null,
        actions: (r.actions || []).length,
        suites: (r.suites || []).length
      };
    }

    Q.forEach(function (paire) {
      var attendu = paire[0], q = paire[1];
      try {
        var r = Repet.repondre(q);
        var d = decrire(r);
        d.q = q; d.attendu = attendu;
        d.ok = (attendu === 'vide') ? !!r.vide : (d.intent === attendu);
        out.lignes.push(d);
      } catch (e) {
        out.erreurs.push(q + ' → ' + (e && e.message));
      }
    });

    T.forEach(function (q) {
      try {
        var r = Repet.repondre(q);
        var lignes = [r.titre, r.chapo ? '  ' + r.chapo.replace(/<[^>]+>/g, '') : ''];
        (r.blocs || []).forEach(function (b) {
          if (b.html) lignes.push('  [' + b.k + '] ' + b.html.replace(/<[^>]+>/g, ''));
          else if (b.k === 'fig') lignes.push('  [fig] ' + b.fig);
          else if (b.k === 'tab') lignes.push('  [tab] ' + b.tab.t + ' — ' + b.tab.r.length + ' lignes × ' + b.tab.c.length + ' colonnes');
          else if (b.k === 'kv') lignes.push('  [kv] ' + b.rows.map(function (x) { return x[0] + ' = ' + x[1]; }).join(' | '));
          else if (b.k === 'liste') lignes.push('  [liste] ' + b.items.map(function (x) { return String(x).replace(/<[^>]+>/g, ''); }).join(' · '));
          else if (b.k === 'face') lignes.push('  [face] ' + b.gauche.t + ' || ' + b.droite.t);
          else lignes.push('  [' + b.k + ']');
        });
        if (r.source) lignes.push('  ← ' + (r.source.code
          ? r.source.code + ' · ' + r.source.sem + ' · ' + r.source.titre
          : r.source.libelle));
        lignes.push('  ⇢ ' + (r.suites || []).join(' / '));
        out.temoins.push({ q: q, texte: lignes.filter(Boolean).join('\\n') });
      } catch (e) { out.erreurs.push('témoin ' + q + ' → ' + e.message); }
    });

    /* Le rendu réel de l'écran : une réponse qui se construit bien peut très
       bien exploser au moment de se dessiner. */
    [
      ['fil vide', {}],
      ['une notion', { q: 'je comprends pas l’accommodation' }],
      ['un schéma', { q: 'montre moi le schéma de la rétine' }],
      ['une comparaison', { q: 'différence entre ésotropie et exotropie' }],
      ['un calcul', { q: '12 delta' }],
      ['une interrogation', { q: 'interroge-moi sur UE9' }]
    ].forEach(function (cas) {
      try {
        var n = window.Modules.chat.render({ params: cas[1], go: function () {} });
        document.getElementById('view').innerHTML = '';
        document.getElementById('view').appendChild(n);
        out.rendu.push(cas[0] + ' : ' + n.querySelectorAll('*').length + ' nœuds');
      } catch (e) { out.erreurs.push('rendu ' + cas[0] + ' → ' + (e && e.message)); }
    });

    return out;
  })()`);

  /* --- Sortie --- */
  console.log('\nCorpus indexé : ' + rapport.corpus + ' entrées\n');

  let bons = 0;
  console.log('Intention reconnue                                                         attendu   obtenu');
  console.log('─'.repeat(100));
  rapport.lignes.forEach((l) => {
    if (l.ok) bons++;
    const marque = l.ok ? '  ' : '✗ ';
    console.log(
      marque + l.q.slice(0, 68).padEnd(70) +
      l.attendu.padEnd(10) + l.intent +
      (l.fig ? '  🖼' : '') + (l.source ? '  ←' + l.source : '')
    );
  });
  console.log('─'.repeat(100));
  console.log(bons + ' / ' + rapport.lignes.length + ' intentions reconnues\n');

  const sansSource = rapport.lignes.filter((l) => !l.source && !l.quiz &&
    ['calcul', 'faire', 'aide', 'bonjour', 'merci', 'vide'].indexOf(l.intent) < 0);
  if (sansSource.length) {
    console.log('Réponses sans provenance affichée :');
    sansSource.forEach((l) => console.log('  · ' + l.q + ' → ' + l.intent));
    console.log('');
  }

  console.log('Réponses témoins');
  console.log('═'.repeat(100));
  rapport.temoins.forEach((t) => {
    console.log('« ' + t.q + ' »');
    console.log(t.texte);
    console.log('');
  });

  console.log('Rendu de l’écran');
  rapport.rendu.forEach((r) => console.log('  · ' + r));

  const tous = rapport.erreurs.concat(erreurs);
  console.log('');
  console.log(tous.length ? 'ERREURS :\n  ' + tous.join('\n  ') : 'Aucune erreur.');

  app.exit(tous.length ? 1 : 0);
});
