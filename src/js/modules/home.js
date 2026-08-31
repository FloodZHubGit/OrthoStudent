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

  /* Les quatre exercices qui produisent une note sur 100 : ce sont les seuls
     dont un « meilleur score » veut dire quelque chose. `d` remplace la
     description du module par ce qu'on y gagne, plus utile en vedette. */
  var FEATURED = [
    { id: 'reading', d: 'Un bilan complet à interpréter, tiré au sort' },
    { id: 'patient', d: 'Consultation entière, cas générés à l’infini' },
    { id: 'exam', d: 'Épreuve chronométrée à postes, notée' },
    { id: 'rehab', d: 'Programme de rééducation, séance après séance' }
  ];

  /* La grille « Tous les outils » est lue dans le registre des modules :
     elle ne peut donc plus proposer un module retiré de l'application. */
  /* La grille « Tous les outils » double exactement la barre latérale : elle
     n'a d'intérêt que tant qu'on ne la connaît pas encore, avec la phrase qui
     dit à quoi sert chaque entrée. Elle disparaît dès la première note. */
  var QUICK_ORDER = ['studies', 'edt', 'revise', 'progress',
    'reading', 'patient', 'rehab', 'converters', 'anatomy', 'glossary', 'help'];

  /* Coupe au dernier mot entier avant la limite, plutôt qu'en plein milieu. */
  function shorten(s, max) {
    s = String(s || '');
    if (s.length <= max) return s;
    var cut = s.slice(0, max);
    var space = cut.lastIndexOf(' ');
    return (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:’']+$/, '') + '…';
  }

  M.home = {
    id: 'home', title: 'Accueil', icon: '🏠', group: 'Mon travail',
    desc: 'Ce qu’il y a à faire aujourd’hui : cours, séance du jour, semestre',
    keywords: 'accueil dashboard seance du jour plan quotidien tableau de bord aujourd hui',
    /* la séance du jour est rendue ici : ouvrir sa page doit allumer Accueil */
    children: ['session'],
    render: function () {
      var st = Store.state;
      var stats = Store.stats();
      var hour = new Date().getHours();
      var hello = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
      var name = st.profile.name ? ', ' + st.profile.name : '';
      var tip = TIPS[new Date().getDate() % TIPS.length];
      var due = Store.dueCards(Cards.all().map(function (c) { return c.id; })).length;
      var left = M.session && M.session.remaining ? M.session.remaining() : 0;
      /* seuls les exercices encore présents comptent : le périmètre est
         déclaré au démarrage par app.js */
      var scoredIds = Store.scoredIds();
      var isNew = !scoredIds.length && !stats.quizSeen && !stats.casesDone;

      /* ---------- Hero ---------- */
      var hero = el('div', { class: 'hero' }, [
        el('h1', { text: hello + name + ' 👋' }),
        el('p', {
          html: isNew
            ? 'Bienvenue. <b>' + (Object.keys(M).length - 1) + ' modules</b> vous attendent : bilans à interpréter, consultations, ' +
              'calculatrices cliniques, cours et fiches. Le guide ci-dessous montre par où entrer.'
            : 'Vous avez travaillé <b>' + scoredIds.length + ' exercice' + (scoredIds.length > 1 ? 's' : '') + '</b>, répondu à <b>' +
              stats.quizSeen + ' question' + (stats.quizSeen > 1 ? 's' : '') + '</b> et traité <b>' +
              (stats.casesDone + stats.casesGenerated) + ' patient' + ((stats.casesDone + stats.casesGenerated) > 1 ? 's' : '') + '</b>.' +
              (due ? ' <b>' + due + ' fiche' + (due > 1 ? 's' : '') + '</b> à réviser aujourd’hui.' : ' Aucune fiche en retard.')
        }),
        /* Le plan du jour est juste en dessous : ces boutons servent à en
           sortir, pas à y entrer. On y met donc ce qui n'est pas dans la
           séance — un patient de plus, un examen blanc, une question. */
        el('div', { class: 'hero-actions' }, [
          isNew ? UI.btn('🧭  Découvrir l’application', function () { App.go('help'); }, 'primary') : null,
          isNew ? UI.btn('🩻  Lire un bilan', function () { App.go('reading'); }) : null,
          /* « Je fais quoi, là ? » est la question la plus fréquente, et elle
             se pose depuis l'accueil : le raccourci y reste en permanence. */
          UI.btn('🎯  Je fais quoi, là ?', function () { App.go('help', { tab: 'routine' }); }),
          UI.btn('🩺  Consulter un patient inédit', function () {
            M.patient.startRandom(); App.go('patient');
          }, isNew || left ? null : 'primary'),
          UI.btn('❓  QCM rapide', function () { App.go('quiz'); }),
          isNew ? null : UI.btn('⏱  Examen blanc', function () { App.go('exam'); })
        ].filter(Boolean))
      ]);

      /* ---------- Première visite : la logique de l'application ---------- */
      var welcome = !isNew ? null : el('div', { class: 'card', style: { display: 'flex', gap: '16px', alignItems: 'flex-start' } }, [
        el('div', {
          style: {
            width: '40px', height: '40px', flex: 'none', borderRadius: '11px', display: 'grid',
            placeItems: 'center', fontSize: '19px', background: 'var(--accent-soft)'
          }, text: '🧭'
        }),
        el('div', { style: { minWidth: 0 } }, [
          el('div', { style: { fontWeight: '650' }, text: 'Première visite ? Trois minutes suffisent' }),
          el('p', {
            class: 'muted small', style: { margin: '4px 0 0' },
            html: 'L’application réunit trois choses : des <b>bilans à interpréter</b> sur des patients tirés au sort, ' +
              'le <b>cours</b> qui va avec, et un <b>carnet de révision</b> calé sur vos UE. ' +
              'Le guide explique par où entrer, ce que fait chaque famille de modules et à quel moment l’ouvrir.'
          }),
          el('div', { class: 'btn-row mt16' }, [
            UI.btn('🧭  Lire le guide', function () { App.go('help'); }, 'primary'),
            UI.btn('🩻  Lire un bilan', function () { App.go('reading'); }),
            UI.btn('🎓  Choisir mon semestre', function () { App.go('studies'); })
          ])
        ])
      ]);

      /* ---------- La séance du jour, rendue ici ---------- */
      /* « Que dois-je faire maintenant ? » n'a qu'une réponse : elle est
         donc à un seul endroit. Le module « Séance du jour » garde sa page,
         où il explique comment le plan est tiré, mais le plan lui-même vit
         ici, sur la première page qu'on ouvre. */
      var sessionPanel = M.session && M.session.panel
        ? M.session.panel({ retour: 'home' })
        : null;

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
                /* `title` complet en infobulle : la coupe se fait au mot, et
                   plus au 34ᵉ caractère — « l'amblyopie fon » n'aide personne */
                el('div', { class: 'gv', title: prios.length ? prios[0].ue.title : '',
                  text: prios.length ? prios[0].ue.code + ' — ' + shorten(prios[0].ue.title, 34) : 'Tout est au vert' }),
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

      /* ---------- Ce qui tombe aujourd'hui ---------- */
      /* La seule information de l'accueil qui périme dans la journée : ce qu'on
         a cours tout à l'heure, et l'UE qu'il faudrait avoir survolée avant.
         Elle passe donc devant tout ce qui peut attendre demain. */
      var edtCard = (function () {
        var ap = M.edt && M.edt.apercu ? M.edt.apercu() : null;
        if (!ap || !ap.next) return null;

        var liste = ap.restant.length ? ap.restant : ap.demain.length ? ap.demain : [ap.next];
        var quand = ap.restant.length ? 'Aujourd’hui'
          : ap.demain.length ? 'Demain'
          : ap.next.jour.nom.charAt(0).toUpperCase() + ap.next.jour.nom.slice(1);

        var rows = liste.slice(0, 4).map(function (s) {
          var m = s.maitrise;
          return el('div', { class: 'edt-row' }, [
            el('span', { class: 'edt-bar', style: { background: 'var(--accent)' } }),
            el('div', { class: 'edt-when' }, [
              el('div', { class: 'edt-h', text: s.event.s }),
              el('div', { class: 'edt-e', text: s.event.e })
            ]),
            el('div', { class: 'edt-what' }, [
              el('div', { class: 'edt-t' }, [
                el('span', { class: 'edt-type', text: s.event.t }),
                s.event.ue ? el('b', { text: ' · ' + s.event.ue }) : null
              ].filter(Boolean)),
              el('div', { class: 'edt-ti', text: s.titre }),
              s.event.salle ? el('div', { class: 'edt-m', text: s.event.salle }) : null
            ].filter(Boolean)),
            el('div', { class: 'edt-act' }, [
              m && m.pct !== null ? el('span', { class: 'chip static', style: { color: m.color, borderColor: m.color }, text: m.pct + ' %' }) : null,
              s.ouvrir ? UI.btn('Fiche', s.ouvrir, 'sm') : null
            ].filter(Boolean))
          ]);
        });

        /* Le conseil n'a de sens que s'il y a de quoi préparer : une UE
           identifiée, et une maîtrise qui laisse à désirer. */
        var faible = liste.filter(function (s) { return s.ue && s.maitrise && s.maitrise.pct !== null && s.maitrise.pct < 55; })[0]
          || liste.filter(function (s) { return s.ue && (!s.maitrise || s.maitrise.pct === null); })[0];

        return UI.card(quand + ' — ' + liste.length + ' séance' + (liste.length > 1 ? 's' : ''), [
          el('div', {}, rows),
          faible ? UI.note('À survoler avant : <b>' + faible.ue.code + ' — ' + faible.ue.title + '</b>' +
            (faible.maitrise && faible.maitrise.pct !== null
              ? ', que vous maîtrisez à ' + faible.maitrise.pct + ' %.'
              : ', que vous n’avez jamais travaillée.') +
            ' Trois minutes sur la fiche valent une heure de cours suivie.') : null,
          el('div', { class: 'btn-row mt16' }, [
            UI.btn('📅  Voir mon emploi du temps', function () { App.go('edt'); },
              ap.restant.length ? 'primary' : null),
            faible ? UI.btn('🎓  Ouvrir ' + faible.ue.code, faible.ouvrir) : null
          ].filter(Boolean))
        ].filter(Boolean), {
          right: UI.chip(liste === ap.demain ? 'demain' : ap.restant.length ? 'à venir' : ap.next.jour.quand)
        });
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

      /* ---------- Les exercices notés, en vedette ---------- */
      var featured = el('div', { class: 'grid g4' }, FEATURED.filter(function (q) { return M[q.id]; }).map(function (q) {
        var mod = M[q.id];
        /* le mode patient ne passe pas par `scores` : ses consultations sont
           comptées à part, on affiche donc leur nombre plutôt qu'une note */
        var done = q.id === 'patient' ? stats.casesDone + stats.casesGenerated : 0;
        var sc = q.id === 'patient' ? null : Store.score(q.id);
        return el('div', { class: 'tool-card', onClick: function () { App.go(q.id); } }, [
          el('div', { class: 'tc-ic', text: mod.icon || '•' }),
          el('h4', { text: mod.title }),
          el('p', { text: q.d }),
          sc ? el('div', { style: { marginTop: '11px' } }, [
            el('div', { class: 'flex', style: { fontSize: '11px', color: 'var(--txt-3)', marginBottom: '5px' } }, [
              el('span', { text: 'Meilleur ' + sc.best + ' %' }),
              el('span', { class: 'spacer' }),
              el('span', { text: sc.attempts + ' essai' + (sc.attempts > 1 ? 's' : '') })
            ]),
            UI.bar(sc.best)
          ]) : el('div', { style: { marginTop: '11px', fontSize: '11px', color: 'var(--txt-3)' },
            text: done ? done + ' consultation' + (done > 1 ? 's' : '') + ' menée' + (done > 1 ? 's' : '') : 'Jamais essayé' })
        ]);
      }));

      /* ---------- Tous les outils ---------- */
      var allTools = el('div', { class: 'grid g3' }, QUICK_ORDER.filter(function (id) { return M[id]; })
        .map(function (id) {
          var mod = M[id];
          return UI.modTile(mod.icon || '•', mod.title, mod.desc || '', function () { App.go(id); });
        }));

      return el('div', { class: 'page' }, [
        hero,
        welcome,
        /* Ce qui a lieu tout à l'heure passe avant : c'est la seule chose de
           la page qui périme dans la journée. */
        edtCard,
        /* Puis le plan du jour : la raison d'ouvrir l'application. */
        sessionPanel,
        /* Puis le semestre : c'est là que se décide ce qu'on révise ensuite. */
        semCard,
        tipCard,

        el('h2', { style: { fontSize: '15px', margin: '26px 0 14px', letterSpacing: '-.01em' }, text: 'Se mettre en situation' }),
        featured,

        /* le catalogue des modules ne sert qu'avant de connaître la barre latérale */
        isNew ? el('h2', { style: { fontSize: '15px', margin: '26px 0 14px', letterSpacing: '-.01em' }, text: 'Tous les outils' }) : null,
        isNew ? allTools : null
      ].filter(Boolean));
    }
  };
})();
