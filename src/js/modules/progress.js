/* ============================================================
   Progression — statistiques et historique
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  function sparkline(values, w, h) {
    var g = s('svg', { viewBox: '0 0 ' + w + ' ' + h, style: 'width:100%;height:' + h + 'px' });
    if (!values.length) return g;
    var max = 100;
    var step = values.length > 1 ? w / (values.length - 1) : w;
    var d = values.map(function (v, i) { return (i ? 'L' : 'M') + (i * step).toFixed(1) + ' ' + (h - (v / max) * (h - 6) - 3).toFixed(1); }).join(' ');
    g.appendChild(s('line', { x1: 0, y1: h - (70 / 100) * (h - 6) - 3, x2: w, y2: h - (70 / 100) * (h - 6) - 3, stroke: '#2a3945', 'stroke-dasharray': '4 4' }));
    g.appendChild(s('path', { d: d, fill: 'none', stroke: '#35c4b5', 'stroke-width': 2.2 }));
    values.forEach(function (v, i) {
      g.appendChild(s('circle', { cx: i * step, cy: h - (v / 100) * (h - 6) - 3, r: 2.6, fill: '#35c4b5' }));
    });
    return g;
  }

  function semYear(id) {
    var sem = (window.CURRICULUM || []).filter(function (x) { return x.id === id; })[0];
    return sem ? sem.year : 1;
  }

  M.progress = {
    id: 'progress', title: 'Ma progression', icon: '📈', group: 'Mon travail',
    desc: 'Scores, historique, points forts et points faibles',
    keywords: 'progression score statistique historique bilan',
    render: function () {
      var st = Store.state;
      var stats = Store.stats();

      /* --- courbe des 30 dernières activités notées --- */
      var series = st.log.filter(function (l) { return typeof l.s === 'number'; }).slice(0, 30).reverse().map(function (l) { return l.s; });

      /* --- exercices notés ---
         `Store.scoredIds()` écarte les notes des modules retirés, et
         `App.scoredLabel` nomme aussi ce qui n'est pas un module (les cas
         d'application d'une UE, qui manquaient jusqu'ici à ce tableau). */
      var rows = Store.scoredIds().filter(function (id) { return App.scoredLabel(id); }).map(function (id) {
        var sc = Store.score(id);
        return [
          App.scoredLabel(id),
          sc.attempts, sc.best + ' %', sc.avg + ' %', sc.last + ' %',
          el('div', { style: { minWidth: '110px' } }, UI.bar(sc.avg, sc.avg >= 70 ? 'var(--green)' : sc.avg >= 45 ? 'var(--amber)' : 'var(--red)'))
        ];
      }).sort(function (a, b) { return parseInt(b[3]) - parseInt(a[3]); });

      /* --- cas cliniques --- */
      var caseRows = CASES.map(function (c) {
        var r = st.cases[c.id];
        return [c.name + ', ' + c.age + ' ans', c.tags.join(', '),
          r ? r.score + ' %' : '—',
          r ? new Date(r.at).toLocaleDateString('fr-FR') : '—'];
      });

      return UI.page({
        crumb: 'Mon travail',
        title: 'Ma progression',
        subtitle: 'Tout est enregistré localement sur cet ordinateur. Menu <b>Fichier</b> pour exporter ou importer.'
      }, [
        el('div', { class: 'grid g3', style: { marginBottom: '16px' } }, [
          UI.stat(stats.simAvg + ' %', 'Moyenne des exercices'),
          UI.stat(stats.cardsMastered + '/' + Cards.all().length, 'Fiches mémorisées'),
          UI.stat(stats.casesDone + '/' + CASES.length, 'Cas rédigés traités')
        ]),

        (function () {
          var streak = Store.streak();
          var act = Store.activity(364);
          var last30 = act.slice(-30);
          var worked30 = last30.filter(function (d) { return d.total > 0; }).length;
          var g = Store.goal();
          var totals = act.reduce(function (a, d) {
            a.cards += d.cards; a.ex += d.sims + d.cases; return a;
          }, { cards: 0, ex: 0 });

          var goalHint = el('p', { class: 'small muted', style: { marginTop: '10px' } });
          function hint() {
            var gg = Store.goal();
            goalHint.textContent = 'Objectif : ' + gg.items + ' items d’UE à réciter par jour — ' +
              'soit environ ' + Math.max(1, Math.round((gg.items * 8) / 60)) + ' minutes de travail.';
          }
          hint();

          return UI.card('Régularité', [
            el('div', { class: 'grid g4', style: { marginBottom: '16px' } }, [
              UI.stat(streak.current + ' j', 'Série en cours', streak.current ? 'var(--accent)' : 'var(--txt-3)'),
              UI.stat(streak.best + ' j', 'Record de série', 'var(--violet)'),
              UI.stat(worked30 + '/30', 'Jours travaillés (30 j)', worked30 >= 20 ? 'var(--green)' : 'var(--amber)'),
              UI.stat(totals.cards + totals.ex, 'Actions sur 1 an')
            ]),
            UI.heatmap(act, { cell: 12 }),
            el('div', { class: 'grid g3', style: { marginTop: '18px' } }, [
              UI.field('Objectif d’items à réciter par jour',
                UI.num(g.items, function (v) { Store.setGoal(v || 0); hint(); }, { min: 0, max: 200, step: 5 })),
              UI.field('Détail sur un an',
                el('div', { class: 'small muted', text: totals.cards + ' items récités · ' + totals.ex + ' exercices notés' }))
            ]),
            goalHint
          ]);
        })(),

        series.length > 1 ? UI.card('Évolution de vos scores (30 dernières activités notées)', [
          sparkline(series, 600, 110),
          el('p', { class: 'small muted', text: 'La ligne pointillée marque le seuil de 70 %.' })
        ]) : null,

        rows.length ? UI.card('Exercices notés', UI.table(['Exercice', 'Essais', 'Meilleur', 'Moyenne', 'Dernier', ''], rows, { numeric: [1, 2, 3, 4] }))
          : UI.card('Exercices notés', el('p', { class: 'muted', text: 'Aucun exercice noté pour l’instant.' })),


        UI.card('Cas cliniques rédigés', UI.table(['Patient', 'Thèmes', 'Score', 'Date'], caseRows, { numeric: [2] })),

        (function () {
          var gen = Object.keys(st.cases).filter(function (k) { return k.indexOf('gen:') === 0; });
          if (!gen.length) return null;
          var labels = {
            ic: 'Insuffisance de convergence', esoaccom: 'Ésotropie accommodative', vi: 'Paralysie du VI',
            iv: 'Paralysie du IV', xt: 'Exotropie intermittente', amblyopie: 'Amblyopie anisométropique',
            presbytie: 'Presbytie', dmla: 'DMLA exsudative', glaucome: 'Glaucome chronique', ecran: 'Asthénopie / réfraction'
          };
          return UI.card('Patients générés (meilleur score par tableau)',
            UI.table(['Tableau clinique', 'Dernier score', 'Date'], gen.map(function (k) {
              var r = st.cases[k], id = k.slice(4);
              return [labels[id] || id, r.score + ' %', new Date(r.at).toLocaleDateString('fr-FR')];
            }), { numeric: [1] }));
        })(),

        UI.card('Journal complet', el('div', { class: 'log', style: { maxHeight: '340px' } },
          st.log.slice(0, 60).map(function (l) {
            var mod = M[l.m.split(':')[0]];
            var d = new Date(l.t);
            return el('div', { class: 'log-line' }, [
              el('span', { class: 't', text: d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }),
              el('b', { text: mod ? mod.title : l.m }),
              el('span', { text: typeof l.s === 'number' ? ' — ' + l.s + ' %' : '' })
            ]);
          }).concat(st.log.length ? [] : [el('p', { class: 'muted', text: 'Journal vide.' })])
        )),

        /* Les réglages vivent avec les données qu'ils pilotent : le semestre
           décide de la préparation affichée juste au-dessus, l'objectif
           quotidien décide de la régularité. Ils étaient au bas de l'accueil,
           où personne ne descendait. */
        UI.card('Votre profil', [
          el('div', { class: 'grid g3' }, [
            UI.field('Prénom',
              (function () {
                var i = el('input', { type: 'text', class: 'inp', value: st.profile.name, placeholder: 'Votre prénom' });
                i.addEventListener('input', function () { st.profile.name = i.value; Store.save(); });
                return i;
              })()),
            UI.field('Semestre en cours',
              UI.select((window.CURRICULUM || []).map(function (sem) { return { value: sem.id, label: sem.label + ' — année ' + sem.year }; })
                .concat([{ value: '', label: 'Non précisé' }]), st.profile.semester || '', function (v) {
                  st.profile.semester = v || null;
                  st.profile.year = v ? 'L' + semYear(v) : st.profile.year;
                  Store.save();
                  App.refreshNav();
                  App.go('progress');
                })),
            UI.field('Distance d’examen par défaut',
              UI.select([{ value: 5, label: '5 mètres' }, { value: 4, label: '4 mètres' }, { value: 6, label: '6 mètres' }, { value: 3, label: '3 mètres' }],
                Store.setting('testDistance'), function (v) { Store.setting('testDistance', parseFloat(v)); }))
          ])
        ]),

        UI.card('Gestion des données', [
          el('p', { class: 'mt0 muted small',
            text: 'Tout est enregistré sur cet ordinateur, sans compte ni envoi sur un serveur. Exportez avant de changer de machine.' }),
          el('div', { class: 'btn-row' }, [
            UI.btn('Exporter ma progression', function () { App.exportData(); }, 'primary'),
            UI.btn('Importer', function () { App.importData(); }),
            UI.btn('Tout réinitialiser', function () {
              if (confirm('Effacer définitivement toute la progression ?')) { Store.reset(); App.go('progress'); UI.toast('Progression réinitialisée.'); }
            }, 'danger')
          ])
        ])
      ].filter(Boolean));
    }
  };
})();
