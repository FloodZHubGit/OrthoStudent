/* ============================================================
   Accueil — tableau de bord
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  var TIPS = [
    ['Δ = 100 × tan(θ)', 'Une dioptrie prismatique dévie de 1 cm à 1 m, soit environ 0,57°.'],
    ['Loi de Hering', 'La déviation secondaire est toujours plus grande que la déviation primaire.'],
    ['Amblyopie', 'Avant toute occlusion : correction optique totale portée 4 à 6 semaines.'],
    ['Duochrome', 'RAM-GAP — Red Add Minus, Green Add Plus.'],
    ['Strabisme de l’enfant', 'Devant tout strabisme unilatéral : fond d’œil obligatoire.'],
    ['Les obliques', 'L’oblique supérieur abaisse, l’oblique inférieur élève. Toujours l’inverse de ce qu’on croit.'],
    ['Cover test', 'Unilatéral = tropies. Alterné = déviation totale. Jamais l’un sans l’autre.'],
    ['PPC', 'Normal ≤ 6–8 cm, toujours noté rupture / recouvrement.'],
    ['Spirale de Tillaux', 'DM 5,5 — DI 6,5 — DL 6,9 — DS 7,7 mm depuis le limbe.'],
    ['Transposition', 'Sphère + cylindre, cylindre changé de signe, axe ± 90°.'],
    ['AC/A élevé', 'Ésotropie de près supérieure à celle de loin : pensez au double foyer.'],
    ['Glaucome', 'L’acuité centrale reste longtemps normale : c’est le champ visuel qui parle en premier.']
  ];

  var FEATURED = [
    { id: 'phoropter', ic: '🔭', t: 'Phoroptère virtuel', d: 'Réfraction subjective complète sur patient simulé' },
    { id: 'covertest', ic: '👁', t: 'Cover test', d: 'Écran uni/alterné sur visage animé' },
    { id: 'patient', ic: '🩺', t: 'Mode patient', d: 'Consultation complète, cas générés à l’infini' },
    { id: 'fundus', ic: '🔴', t: 'Fond d’œil', d: 'Ophtalmoscope, 13 tableaux pathologiques' }
  ];

  var QUICK = [
    ['rehab', '🧑‍🏫', 'Rééducation', 'Programme et suivi séance après séance'],
    ['exam', '⏱', 'Examen blanc', 'Épreuve chronométrée à postes, notée'],
    ['skiascopy', '🔦', 'Skiascopie', 'Réfraction objective, ombres et neutralisation'],
    ['prism', '🔺', 'Mesure au prisme', 'Barre de prismes, neutralisation'],
    ['acuity', '🔠', 'Échelles d’acuité', 'Monoyer, Landolt, Parinaud calibrés'],
    ['motility', '🔄', 'Motilité', '9 positions, muscle déficitaire'],
    ['lancaster', '🟥', 'Lancaster', 'Relevé et schéma des deux yeux'],
    ['binocular', '🔗', 'Vision binoculaire', 'Worth, Maddox, Bagolini, fusion'],
    ['ppc', '🎯', 'PPC & convergence', 'Rupture, recouvrement, rééducation'],
    ['colorvision', '🎨', 'Vision des couleurs', 'Planches et classement D15'],
    ['fields', '🗺', 'Champ visuel', 'Périmétrie 24-2 et Amsler'],
    ['converters', '🧮', 'Calculatrices', '11 outils de conversion clinique'],
    ['theory', '📚', 'Cours & fiches', '7 chapitres, 30 fiches de synthèse'],
    ['anatomy', '🫀', 'Anatomie', 'Coupe du globe et muscles cliquables'],
    ['glossary', '📖', 'Glossaire', '50 termes du vocabulaire orthoptique']
  ];

  function semYear(id) {
    var sem = (window.CURRICULUM || []).filter(function (x) { return x.id === id; })[0];
    return sem ? sem.year : 1;
  }

  M.home = {
    id: 'home', title: 'Accueil', icon: '🏠', group: 'Général',
    desc: 'Tableau de bord, progression et accès rapide',
    keywords: 'accueil dashboard progression tableau de bord',
    render: function () {
      var st = Store.state;
      var stats = Store.stats();
      var hour = new Date().getHours();
      var hello = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
      var name = st.profile.name ? ', ' + st.profile.name : '';
      var tip = TIPS[new Date().getDate() % TIPS.length];
      var due = Store.dueCards(Cards.all().map(function (c) { return c.id; })).length;
      var simIds = Object.keys(st.scores);
      var isNew = !simIds.length && !stats.quizSeen && !stats.casesDone;

      /* ---------- Hero ---------- */
      var hero = el('div', { class: 'hero' }, [
        el('h1', { text: hello + name + ' 👋' }),
        el('p', {
          html: isNew
            ? 'Bienvenue. <b>' + (Object.keys(M).length - 1) + ' modules</b> vous attendent : simulateurs d’examen, calculatrices cliniques, ' +
              'cours et cas patients. Commencez par calibrer votre écran, puis lancez un simulateur.'
            : 'Vous avez travaillé <b>' + simIds.length + ' simulateur' + (simIds.length > 1 ? 's' : '') + '</b>, répondu à <b>' +
              stats.quizSeen + ' question' + (stats.quizSeen > 1 ? 's' : '') + '</b> et traité <b>' +
              (stats.casesDone + stats.casesGenerated) + ' patient' + ((stats.casesDone + stats.casesGenerated) > 1 ? 's' : '') + '</b>.' +
              (due ? ' <b>' + due + ' fiche' + (due > 1 ? 's' : '') + '</b> à réviser aujourd’hui.' : ' Aucune fiche en retard.')
        }),
        el('div', { class: 'hero-actions' }, [
          UI.btn('🩺  Consulter un patient inédit', function () {
            M.patient.startRandom(); App.go('patient');
          }, 'primary'),
          due ? UI.btn('🗂  Réviser ' + due + ' fiches', function () { App.go('flashcards'); }) : null,
          UI.btn('❓  QCM rapide', function () { App.go('quiz'); }),
          isNew ? null : UI.btn('⏱  Examen blanc', function () { App.go('exam'); }),
          isNew ? UI.btn('📐  Calibrer l’écran', function () { App.go('acuity'); }) : null
        ].filter(Boolean))
      ]);

      /* ---------- Métriques ---------- */
      var metrics = el('div', { class: 'grid g4', style: { marginBottom: '22px' } }, [
        UI.metric(stats.simAvg + ' %', 'Moyenne simulateurs', stats.simAvg,
          stats.simAvg >= 70 ? 'var(--green)' : stats.simAvg >= 40 ? 'var(--amber)' : 'var(--accent)'),
        UI.metric(stats.quizRate + ' %', 'Réussite QCM', stats.quizRate,
          stats.quizRate >= 70 ? 'var(--green)' : 'var(--amber)'),
        UI.metric(stats.cardsMastered + '/' + Cards.all().length, 'Fiches mémorisées',
          Math.round(stats.cardsMastered / Cards.all().length * 100), 'var(--violet)'),
        UI.metric((stats.casesDone + stats.casesGenerated) + '', 'Patients vus',
          Math.min(100, (stats.casesDone / CASES.length) * 100), 'var(--blue)')
      ]);

      /* ---------- Objectif du jour et série ---------- */
      var gp = Store.goalProgress();
      var streak = Store.streak();
      var flame = streak.current >= 7 ? '🔥' : streak.current >= 3 ? '✨' : '🌱';

      function goalPart(label, p, color, action, actionLabel) {
        return el('div', { class: 'goal-part' }, [
          UI.ring(p.pct, { size: 54, width: 6, color: color, text: p.done + '/' + p.target, fontSize: 11 }),
          el('div', { style: { minWidth: 0 } }, [
            el('div', { class: 'gl', text: label }),
            el('div', { class: 'gv', text: p.pct >= 100 ? 'Objectif atteint ✓' : (p.target - p.done) + ' restant' + (p.target - p.done > 1 ? 's' : '') }),
            p.pct >= 100 ? null : UI.btn(actionLabel, action, 'sm')
          ].filter(Boolean))
        ]);
      }

      var goalCard = UI.card('Objectif du jour', [
        el('div', { class: 'goal-row' }, [
          goalPart('Fiches revues', gp.cards, 'var(--violet)', function () { App.go('flashcards'); }, 'Réviser'),
          goalPart('QCM répondus', gp.quiz, 'var(--accent)', function () { App.go('quiz'); }, 'Répondre'),
          el('div', { class: 'goal-part' }, [
            el('div', { class: 'streak-mark', text: flame }),
            el('div', {}, [
              el('div', { class: 'gl', text: 'Série en cours' }),
              el('div', { class: 'gv', html: '<b>' + streak.current + ' jour' + (streak.current > 1 ? 's' : '') + '</b> d’affilée' }),
              el('div', { class: 'gs', text: 'Record : ' + streak.best + ' · ' + streak.activeDays + ' jours travaillés' })
            ])
          ])
        ]),
        UI.heatmap(Store.activity(119), { cell: 12 }),
        gp.done
          ? UI.note('🎉 <b>Objectif du jour atteint.</b> Tout ce que vous ferez de plus est du bonus — et la série continue demain.')
          : null
      ].filter(Boolean), {
        right: el('span', { class: 'muted small', text: 'Réglable dans « Ma progression »' })
      });

      /* ---------- Votre semestre ---------- */
      var semCard = (function () {
        var cur = st.profile.semester;
        var sem = (window.CURRICULUM || []).filter(function (x) { return x.id === cur; })[0];
        if (!sem) {
          return UI.card('Votre semestre', [
            el('p', { class: 'muted', style: { marginTop: 0 },
              text: 'Indiquez où vous en êtes dans le cursus : l’accueil mettra en avant les modules qui correspondent à vos UE du moment.' }),
            UI.btn('🎓 Choisir mon semestre', function () { App.go('studies'); }, 'primary')
          ]);
        }
        // préparation du semestre et UE prioritaires, calculées par le module Programme
        var ready = M.studies.readiness(sem.id);
        var left = M.studies.daysToExam(sem.id);
        var prios = M.studies.priorities(sem.id, 3);
        var col = ready >= 70 ? 'var(--green)' : ready >= 40 ? 'var(--amber)' : 'var(--red)';

        return UI.card(sem.label + ' — année ' + sem.year, [
          el('div', { class: 'goal-row' }, [
            el('div', { class: 'goal-part' }, [
              UI.ring(ready, { size: 54, width: 6, color: col, text: ready + '%', fontSize: 12 }),
              el('div', {}, [
                el('div', { class: 'gl', text: 'Préparation' }),
                el('div', { class: 'gv', text: ready >= 70 ? 'Vous êtes prêt' : ready >= 40 ? 'En bonne voie' : 'À travailler' }),
                el('div', { class: 'gs', text: 'Pondérée par les ECTS' })
              ])
            ]),
            el('div', { class: 'goal-part' }, [
              el('div', { class: 'streak-mark', text: left === null ? '🗓' : left < 14 ? '🔥' : '⏳' }),
              el('div', {}, [
                el('div', { class: 'gl', text: 'Partiels' }),
                el('div', { class: 'gv', html: left === null ? 'Date non renseignée'
                  : left < 0 ? 'Date passée' : '<b>J−' + left + '</b>' }),
                el('div', { class: 'gs', text: left === null ? 'À indiquer dans le programme' : 'Plan de révision calé dessus' })
              ])
            ]),
            el('div', { class: 'goal-part' }, [
              el('div', { class: 'streak-mark', text: '🎯' }),
              el('div', {}, [
                el('div', { class: 'gl', text: 'À travailler en priorité' }),
                el('div', { class: 'gv', text: prios.length ? prios[0].ue.code + ' — ' + prios[0].ue.title.slice(0, 34) : 'Tout est au vert' }),
                el('div', { class: 'gs', text: prios.length ? prios[0].ue.ects + ' ECTS · maîtrise ' + prios[0].pct + ' %' : 'Entretenez avec un examen blanc' })
              ])
            ])
          ]),
          prios.length ? el('div', { class: 'flex wrap', style: { gap: '7px' } }, prios.map(function (p) {
            return el('span', { class: 'chip', text: p.ue.code + ' · ' + p.ue.title + ' — ' + p.pct + ' %',
              onClick: function () { App.go('studies', { sem: sem.id, ue: p.ue.code }); } });
          })) : null,
          el('div', { class: 'btn-row mt16' }, [
            UI.btn('🎓 Mon plan de révision', function () { App.go('studies', { sem: sem.id }); }, 'primary')
          ])
        ].filter(Boolean), { right: UI.chip(sem.ues.length + ' UE · ' + sem.stage.ects + ' ECTS de stage') });
      })();

      /* ---------- Réflexe du jour ---------- */
      var tipCard = el('div', { class: 'card', style: { display: 'flex', gap: '16px', alignItems: 'flex-start' } }, [
        el('div', {
          style: {
            width: '40px', height: '40px', flex: 'none', borderRadius: '11px', display: 'grid',
            placeItems: 'center', fontSize: '19px', background: 'var(--accent-soft)'
          }, text: '💡'
        }),
        el('div', {}, [
          el('div', { style: { fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--accent)', fontWeight: '700' }, text: 'Le réflexe du jour — ' + tip[0] }),
          el('div', { style: { marginTop: '3px', color: 'var(--txt-2)' }, text: tip[1] })
        ])
      ]);

      /* ---------- Simulateurs en vedette ---------- */
      var featured = el('div', { class: 'grid g4' }, FEATURED.map(function (q) {
        var sc = Store.score(q.id);
        return el('div', { class: 'tool-card', onClick: function () { App.go(q.id); } }, [
          el('div', { class: 'tc-ic', text: q.ic }),
          el('h4', { text: q.t }),
          el('p', { text: q.d }),
          sc ? el('div', { style: { marginTop: '11px' } }, [
            el('div', { class: 'flex', style: { fontSize: '11px', color: 'var(--txt-3)', marginBottom: '5px' } }, [
              el('span', { text: 'Meilleur ' + sc.best + ' %' }),
              el('span', { class: 'spacer' }),
              el('span', { text: sc.attempts + ' essai' + (sc.attempts > 1 ? 's' : '') })
            ]),
            UI.bar(sc.best)
          ]) : el('div', { style: { marginTop: '11px', fontSize: '11px', color: 'var(--txt-3)' }, text: 'Jamais essayé' })
        ]);
      }));

      /* ---------- Progression détaillée ---------- */
      var simRows = ['phoropter', 'skiascopy', 'covertest', 'prism', 'acuity', 'fundus', 'lancaster', 'motility', 'colorvision', 'binocular', 'ppc', 'fields']
        .filter(function (id) { return Store.score(id); })
        .map(function (id) {
          var sc = Store.score(id);
          return [
            (M[id].icon || '') + '  ' + M[id].title,
            sc.attempts, sc.best + ' %',
            el('div', { style: { minWidth: '110px' } },
              UI.bar(sc.avg, sc.avg >= 70 ? 'var(--green)' : sc.avg >= 40 ? 'var(--amber)' : 'var(--red)'))
          ];
        })
        .sort(function (a, b) { return parseInt(b[2]) - parseInt(a[2]); });

      var recent = st.log.slice(0, 7).map(function (l) {
        var mod = M[l.m.split(':')[0]];
        var d = new Date(l.t);
        var today = new Date().toDateString() === d.toDateString();
        return el('div', { class: 'log-line' }, [
          el('span', { class: 't', text: today ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) }),
          el('b', { text: mod ? mod.title : (l.m.indexOf('gen:') === 0 || l.m.indexOf('patient') === 0 ? 'Consultation' : l.m) }),
          typeof l.s === 'number'
            ? el('span', { style: { float: 'right', color: l.s >= 70 ? 'var(--green)' : l.s >= 40 ? 'var(--amber)' : 'var(--red)', fontWeight: '650' }, text: l.s + ' %' })
            : null
        ].filter(Boolean));
      });

      /* ---------- Tous les outils ---------- */
      var allTools = el('div', { class: 'grid g3' }, QUICK.map(function (q) {
        return UI.modTile(q[1], q[2], q[3], function () { App.go(q[0]); });
      }));

      return el('div', { class: 'page' }, [
        hero,
        metrics,
        goalCard,
        semCard,
        tipCard,

        el('h2', { style: { fontSize: '15px', margin: '26px 0 14px', letterSpacing: '-.01em' }, text: 'Simulateurs principaux' }),
        featured,

        el('div', { class: 'split', style: { marginTop: '26px' } }, [
          UI.card('Progression par simulateur',
            simRows.length
              ? UI.table(['Module', 'Essais', 'Meilleur', 'Moyenne'], simRows, { numeric: [1, 2] })
              : UI.empty('📊', 'Aucun simulateur encore utilisé.<br>Lancez le <b>phoroptère</b> ou le <b>cover test</b> pour commencer.')
          ),
          UI.card('Activité récente', recent.length ? el('div', { class: 'log' }, recent) : UI.empty('🕑', 'Rien pour l’instant.'))
        ]),

        el('h2', { style: { fontSize: '15px', margin: '26px 0 14px', letterSpacing: '-.01em' }, text: 'Tous les outils' }),
        allTools,

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
                  App.go('home');
                })),
            UI.field('Distance d’examen par défaut',
              UI.select([{ value: 5, label: '5 mètres' }, { value: 4, label: '4 mètres' }, { value: 6, label: '6 mètres' }, { value: 3, label: '3 mètres' }],
                Store.setting('testDistance'), function (v) { Store.setting('testDistance', parseFloat(v)); }))
          ]),
          UI.note('Progression sauvegardée automatiquement sur cet ordinateur. Menu <b>Fichier → Exporter</b> pour la transférer sur une autre machine.')
        ], { class: 'mt16' })
      ]);
    }
  };
})();
