/* ============================================================
   Réviser — les outils de révision sous une seule entrée
   ------------------------------------------------------------
   Fiches mémo, atelier de calcul et cours ne sont pas des sujets
   de révision : ce sont des façons de travailler un sujet. Isolés
   dans la barre latérale, ils obligent l'étudiant à inventer une
   raison de les ouvrir. Regroupés ici, avec ce que chacun apporte
   et un point de départ calé sur son semestre, ils redeviennent
   des moyens — le sujet, lui, reste dans « Mes UE ».

   Les quatre modules restent autonomes : ils gardent leurs liens
   directs (recherche, plan de révision, séance du jour) et sont
   simplement rendus ici dans un onglet.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  var CHILDREN = ['atelier', 'theory'];

  function sem() {
    var id = Store.state.profile.semester;
    return (window.CURRICULUM || []).filter(function (x) { return x.id === id; })[0] || null;
  }

  /* le chapitre de cours qui sert l'UE la plus en retard */
  function prioChapter(s) {
    if (!s || !M.studies || !M.studies.priorities) return null;
    try {
      var p = (M.studies.priorities(s.id, 4) || []).filter(function (x) {
        return (((x.ue.links || {}).chap) || []).length;
      })[0];
      return p ? { chap: p.ue.links.chap[0], ue: p.ue } : null;
    } catch (e) { return null; }
  }

  function chapTitle(id) {
    var c = (window.THEORY || []).filter(function (x) { return x.id === id; })[0];
    return c ? c.title : id;
  }

  /* ---------------- Onglet d'entrée ---------------- */

  function row(o) {
    return el('div', { class: 'sess-step' }, [
      el('div', { class: 'si', text: o.ic }),
      el('div', { style: { minWidth: 0 } }, [
        el('div', { class: 'st', text: o.t }),
        el('div', { class: 'sd', html: o.d })
      ]),
      el('div', { class: 'sa' }, [o.state || null, o.action].filter(Boolean))
    ]);
  }

  function landing(setTab) {
    var s = sem();
    var due = window.UEBank ? UEBank.dues(UEBank.codesDuSemestre()) : 0;
    var goal = Store.goal();
    var stats = Store.stats();
    var chap = prioChapter(s);

    var rows = [

      row({
        ic: '⚡', t: 'Mes cartes Anki',
        d: '<b>Ce que vous avez écrit vous-même</b>, rangé comme vous l’avez rangé. ' +
           'La révision reste dans Anki, qui la fait mieux ; ici on relit une UE, et on retrouve ' +
           'une carte au Ctrl+K.<br>' +
           '<span class="muted">Quand une notion vous échappe et que vous savez l’avoir notée quelque part.</span>',
        state: UI.chip(Cards.anki().length ? Cards.anki().length + ' cartes' : 'aucune carte',
          Cards.anki().length ? 'green' : ''),
        action: UI.btn('Ouvrir', function () { App.go('flashcards'); }, 'sm primary')
      }),

      row({
        ic: '✏️', t: 'Atelier de calcul',
        d: '<b>Poser le calcul soi-même</b> : Prentice, logMAR, transposition, AC/A, distance de sommet. ' +
           'Quand la réponse est fausse, l’application nomme l’erreur plutôt que de la constater.<br>' +
           '<span class="muted">Avant un TP, et dans les jours qui précèdent une épreuve écrite.</span>',
        state: (function () {
          var sc = Store.score('atelier');
          return sc ? UI.chip('dernier ' + sc.last + ' %', sc.last >= 70 ? 'green' : 'amber') : UI.chip('jamais fait');
        })(),
        action: UI.btn('Ouvrir', function () { App.go('atelier'); }, 'sm')
      }),

      row({
        ic: '📚', t: 'Cours & fiches',
        d: '<b>Comprendre, ou relire</b> quand une notion vous manque en plein exercice. ' +
           'Le socle théorique, en chapitres dépliables.<br>' +
           '<span class="muted">En dépannage, pas en boucle : relire donne le sentiment de savoir, seul le rappel actif le prouve.</span>',
        action: UI.btn(chap ? 'Chapitre « ' + chapTitle(chap.chap) + ' »' : 'Parcourir', function () {
          if (chap) App.go('theory', { chapter: chap.chap });
          else setTab('theory');
        }, 'sm')
      })
    ];

    return el('div', {}, [
      UI.card('Quatre façons de travailler — pas quatre sujets', [
        el('p', { class: 'mt0', html:
          'Le sujet d’une révision, c’est une <b>UE</b> : c’est là qu’on décide quoi travailler. ' +
          'Ces outils sont les manières de le faire, et la fiche de chaque UE les enchaîne déjà ' +
          'sur son propre contenu. Ouvrez-les ici quand vous voulez travailler <b>hors d’une UE précise</b> : ' +
          'entretenir la mémoire, ou remettre la main sur un calcul.' }),
        el('div', { class: 'btn-row' }, [
          UI.btn('🎓  Partir d’une UE', function () { App.go('studies'); }, 'primary'),
          UI.btn('⚡  Voir la séance du jour', function () { App.go('session'); })
        ])
      ]),

      UI.card('À quoi sert chacun, et quand l’ouvrir', rows),

      UI.card('L’ordre qui marche', [
        UI.table(['Étape', 'Outil', 'Ce qu’elle produit'], [
          ['1 · Comprendre', 'Cours & fiches, fiche d’UE', 'de quoi parle le sujet, et comment il s’organise'],
          ['2 · Mémoriser', 'Fiches mémo', 'les chiffres et définitions disponibles sans effort'],
          ['3 · Se tester', 'Récitation d’UE, cartes Anki', 'la liste de ce que vous ne savez pas encore'],
          ['4 · Calculer', 'Atelier de calcul', 'les formules posées de tête, sans hésiter sur les unités'],
          ['5 · Appliquer', 'Cas d’application, lecture de bilan, mode patient', 'la capacité à s’en servir sur un patient']
        ]),
        UI.note('<b>La seule erreur coûteuse est de rester à l’étape 1.</b> Relire un cours donne le sentiment ' +
          'de savoir ; se faire interroger dessus dit ce qu’on sait vraiment. Passez au test dès que le sujet ' +
          'vous paraît « à peu près clair » — c’est le moment où le rappel actif rapporte le plus.')
      ])
    ]);
  }

  /* ---------------- Module ---------------- */

  var TABS = [
    { id: 'start', label: '🧭 Par où commencer' },
    { id: 'atelier', label: '✏️ Atelier de calcul' },
    { id: 'theory', label: '📚 Cours & fiches' }
  ];

  M.revise = {
    id: 'revise', title: 'Réviser', icon: '🧠', group: 'Mon travail',
    desc: 'Fiches mémo, atelier de calcul et cours — à quoi sert chacun, et par lequel commencer',
    keywords: 'reviser revision fiches memo flashcards anki atelier calcul cours theorie outils apprendre memoriser se tester',
    children: CHILDREN,

    render: function (ctx) {
      var params = (ctx && ctx.params) || {};
      var start = TABS.filter(function (t) { return t.id === params.tab; }).length ? params.tab : 'start';
      var host = el('div', { class: 'revise-host' });

      var tabs = UI.tabs(TABS, function (id) {
        UI.clear(host);
        if (id === 'start') return landing(function (t) { tabs.setTab(t); });
        var mod = M[id];
        if (!mod) return null;
        try {
          var node = mod.render({ params: {}, embedded: true, go: App.go });
          var head = node.querySelector ? node.querySelector('.page-head') : null;
          if (head) head.style.display = 'none';
          host.appendChild(node);
        } catch (e) {
          console.error(e);
          host.appendChild(UI.card('Erreur dans le module « ' + (mod.title || id) + ' »',
            el('pre', { class: 'mono small selectable', style: { whiteSpace: 'pre-wrap' },
              text: (e && e.stack) || String(e) })));
        }
        return host;
      }, start);

      return UI.page({
        crumb: 'Mon travail',
        title: 'Réviser',
        subtitle: 'Les quatre outils qui font entrer un contenu dans la tête, et le vérifient. ' +
          'Le sujet à travailler, lui, se choisit dans « Mes UE ».'
      }, [tabs]);
    }
  };

})();
