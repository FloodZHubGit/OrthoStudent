/* ============================================================
   Séance du jour — un plan de travail quotidien construit à partir
   de ce qui est dû, de vos points faibles et de votre semestre,
   puis exécuté dans les modules existants.

   Le plan est figé pour la journée (il ne doit pas se réorganiser
   sous les doigts), mais l'avancement se lit toujours dans les
   compteurs du jour : aucune étape n'a besoin d'être « validée ».
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  function todayStart() { var d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }

  /* ---------------- Ce qu'il y a à travailler ---------------- */

  /* Thèmes de QCM classés par besoin : ce qu'on rate passe devant,
     ce qu'on n'a jamais vu compte comme à moitié su. */
  function catStats() {
    var by = {};
    (window.QUIZ || []).forEach(function (q) {
      var c = by[q.cat] || (by[q.cat] = { cat: q.cat, n: 0, seen: 0, ok: 0, never: 0 });
      var s = Store.state.quiz[q.id];
      c.n++;
      if (s) { c.seen += s.seen; c.ok += s.ok; } else c.never++;
    });
    return Object.keys(by).map(function (k) {
      var c = by[k];
      c.rate = c.seen ? Math.round((c.ok / c.seen) * 100) : null;
      c.prio = (c.rate === null ? 45 : 100 - c.rate) + Math.min(25, c.never * 2);
      return c;
    }).sort(function (a, b) { return b.prio - a.prio; });
  }

  /* L'exercice technique du jour. La lecture de bilan a remplacé les douze
     postes de simulation : un seul exercice, mais tiré sur un dossier
     différent chaque jour. */
  function simNeed() {
    var sc = Store.score('reading');
    if (!sc) return { id: 'reading', why: 'jamais essayé' };
    return { id: 'reading', why: 'moyenne actuelle — ' + (sc.avg || 0) + ' %' };
  }

  function daysSinceCase() {
    var days = Store.state.days || {};
    var keys = Object.keys(days).sort().reverse();
    for (var i = 0; i < keys.length; i++) {
      if ((days[keys[i]].cases || 0) > 0) {
        return Math.round((todayStart() - new Date(keys[i] + 'T00:00:00').getTime()) / 86400000);
      }
    }
    return 999;
  }

  function uePriority() {
    var sem = Store.state.profile.semester;
    if (!sem || !M.studies || !M.studies.priorities) return null;
    try {
      var p = (M.studies.priorities(sem, 1) || [])[0];
      return p ? { sem: sem, code: p.ue.code, title: p.ue.title, pct: p.pct,
                   ects: p.ue.ects, due: p.due || 0 } : null;
    } catch (e) { return null; }
  }

  /* ---------------- Le plan ---------------- */

  function buildPlan() {
    var goal = Store.goal();
    var due = Cards.stats(Cards.all()).due;
    var cats = catStats();
    var steps = [];

    if (goal.cards > 0 && due > 0) {
      steps.push({ kind: 'cards', target: Math.min(due, goal.cards), due: due });
    }
    if (goal.quiz > 0 && cats.length) {
      steps.push({
        kind: 'quiz', target: goal.quiz,
        cats: cats.slice(0, 2).map(function (c) { return c.cat; }),
        why: cats[0].rate === null ? 'thème jamais travaillé' : cats[0].rate + ' % de réussite jusqu’ici'
      });
    }
    var s = simNeed();
    if (s.id) steps.push({ kind: 'sim', id: s.id, why: s.why });

    var ue = uePriority();
    if (ue) steps.push({ kind: 'ue', sem: ue.sem, code: ue.code, title: ue.title, pct: ue.pct, ects: ue.ects });

    if (daysSinceCase() >= 2) steps.push({ kind: 'case' });

    return { date: Store.dayKey(), at: Date.now(), sig: signature(), steps: steps, skipped: {} };
  }

  /* Le plan est figé pour la journée, sauf si ce sur quoi il a été construit change :
     déclarer son semestre ou revoir son objectif quotidien doit se voir tout de suite. */
  function signature() {
    var g = Store.goal();
    return (Store.state.profile.semester || '-') + '/' + g.cards + '/' + g.quiz;
  }

  function plan(force) {
    var st = Store.state;
    if (force || !st.daily || !st.daily.steps ||
        st.daily.date !== Store.dayKey() || st.daily.sig !== signature()) {
      st.daily = buildPlan();
      Store.save();
    }
    return st.daily;
  }

  /* ---------------- Avancement ---------------- */

  function progressOf(s) {
    var d = Store.day();
    if (s.kind === 'cards') return { done: Math.min(d.cards, s.target), total: s.target };
    if (s.kind === 'quiz') return { done: Math.min(d.quiz, s.target), total: s.target };
    if (s.kind === 'case') return { done: Math.min(d.cases, 1), total: 1 };
    if (s.kind === 'sim') {
      var sc = Store.score(s.id);
      return { done: sc && sc.at >= todayStart() ? 1 : 0, total: 1, score: sc && sc.at >= todayStart() ? sc.last : null };
    }
    if (s.kind === 'ue') {
      var key = s.sem + ':' + s.code;
      var r = Store.recite(key);
      var read = Store.studies().ueDone[key];
      var ok = (r && r.at >= todayStart()) || (read && read >= todayStart());
      return { done: ok ? 1 : 0, total: 1, score: r && r.at >= todayStart() ? r.pct : null };
    }
    return { done: 0, total: 1 };
  }

  function isDone(s) { var p = progressOf(s); return p.done >= p.total; }
  function isSkipped(p, i) { return !!(p.skipped && p.skipped[i]); }

  function counts() {
    var p = plan();
    var done = 0, active = 0;
    p.steps.forEach(function (s, i) {
      if (isSkipped(p, i)) return;
      active++;
      if (isDone(s)) done++;
    });
    return { done: done, total: active, left: active - done, plan: p };
  }

  /* ---------------- Présentation d'une étape ---------------- */

  function view(s) {
    if (s.kind === 'cards') {
      return {
        ic: '🗂', minutes: Math.max(3, Math.round(s.target * 0.3)),
        t: s.target + ' fiches mémo',
        d: s.due + ' fiche' + (s.due > 1 ? 's sont dues' : ' est due') + ' aujourd’hui en répétition espacée. ' +
           'On en fait ' + s.target + ' — c’est votre objectif quotidien.',
        go: 'Réviser'
      };
    }
    if (s.kind === 'quiz') {
      return {
        ic: '❓', minutes: Math.max(3, Math.round(s.target * 0.6)),
        t: s.target + ' QCM sur « ' + s.cats[0] + ' »',
        d: 'Votre thème le plus fragile : ' + s.why + '.' +
           (s.cats[1] ? ' Complété par « ' + s.cats[1] + ' ».' : ''),
        go: 'Répondre'
      };
    }
    if (s.kind === 'sim') {
      var mod = M[s.id] || { title: s.id, icon: '🔭' };
      return {
        ic: mod.icon || '🔭', minutes: 8,
        t: mod.title,
        d: 'Le raisonnement du jour — ' + s.why + '. Un dossier complet est tiré au sort : vous lisez le bilan et vous concluez.',
        go: 'Ouvrir'
      };
    }
    if (s.kind === 'ue') {
      return {
        ic: '🎓', minutes: 12,
        t: s.code + ' — ' + s.title,
        d: 'L’UE qui pèse le plus lourd dans ce que vous maîtrisez le moins : ' + s.ects + ' ECTS, maîtrise ' + s.pct + ' %. ' +
           (s.due ? s.due + ' item' + (s.due > 1 ? 's sont dus' : ' est dû') +
                    ' aujourd’hui dans sa récitation — commencez par là.'
                  : 'Lisez la fiche, puis faites-vous interroger.'),
        go: 'Travailler l’UE'
      };
    }
    if (s.kind === 'case') {
      return {
        ic: '🩺', minutes: 12,
        t: 'Une consultation complète',
        d: 'Anamnèse, examens à choisir, diagnostic, conduite à tenir. C’est le seul exercice qui remet tout bout à bout.',
        go: 'Consulter'
      };
    }
    return { ic: '•', minutes: 5, t: 'Étape', d: '', go: 'Ouvrir' };
  }

  /* ---------------- Lancement d'une étape ---------------- */

  /* `retour` : l'écran d'où l'on vient. La séance s'affiche sur l'accueil
     comme sur sa propre page, et refermer une étape doit ramener là où on
     l'avait ouverte, pas systématiquement sur la page de la séance. */
  function backHere(retour) {
    App.closeModule._after = function () { App.go(retour || 'session'); };
  }

  function launch(s, retour) {
    if (s.kind === 'cards') { backHere(retour); App.openModule('flashcards', { auto: 'due', limit: s.target }, { subtitle: 'Séance du jour — ' + s.target + ' fiches' }); return; }
    if (s.kind === 'quiz') { backHere(retour); App.openModule('quiz', { cats: s.cats, n: s.target, mode: 'train' }, { subtitle: 'Séance du jour — ' + s.cats.join(' · ') }); return; }
    if (s.kind === 'sim') { backHere(retour); App.openModule(s.id, {}, { subtitle: 'Séance du jour' }); return; }
    if (s.kind === 'ue') { App.go('studies', { sem: s.sem, ue: s.code }); return; }
    if (s.kind === 'case') { M.patient.startRandom(); App.go('patient'); return; }
  }

  /* ---------------- Module ---------------- */

  M.session = {
    id: 'session', title: 'Séance du jour', icon: '⚡', group: 'Mon travail',
    desc: 'Le plan de travail du jour, construit sur ce qui est dû et sur vos points faibles',
    keywords: 'seance jour plan quotidien routine revision adaptatif objectif que faire aujourd hui programme',

    /* thèmes de QCM les plus fragiles — partagé avec le module « Réviser »,
       pour que les deux ne finissent pas par proposer des thèmes différents */
    weakCats: function (n) { return catStats().slice(0, n || 2); },

    /* utilisé par la pastille de la barre latérale */
    remaining: function () {
      try { return counts().left; } catch (e) { return 0; }
    },

    /* Le plan du jour, prêt à poser où l'on veut : sur sa propre page, ou
       sur l'accueil, qui répond exactement à la même question. `opts.how`
       ajoute l'explication du tirage, `opts.retour` dit où revenir quand
       une étape ouverte en surimpression se referme. */
    panel: function (opts) {
      opts = opts || {};
      var wrap = el('div');

      function redraw() {
        UI.clear(wrap);
        wrap.appendChild(content());
        if (App.refreshNav) App.refreshNav();
      }

      function stepRow(s, i, p, current) {
        var v = view(s);
        var pr = progressOf(s);
        var done = pr.done >= pr.total;
        var skipped = isSkipped(p, i);
        var partial = !done && pr.total > 1 && pr.done > 0;

        var state = skipped ? UI.chip('passée')
          : done ? UI.chip(pr.score !== null && pr.score !== undefined ? 'fait · ' + pr.score + ' %' : 'fait ✓', 'green')
          : partial ? UI.chip(pr.done + '/' + pr.total, 'amber')
          : UI.chip('~' + v.minutes + ' min');

        var action = done ? UI.btn('Refaire', function () { launch(s, opts.retour); }, 'sm')
          : skipped ? UI.btn('Remettre', function () { delete p.skipped[i]; Store.save(); redraw(); }, 'sm')
          : UI.btn(v.go, function () { launch(s, opts.retour); }, current ? 'sm primary' : 'sm');

        return el('div', { class: 'sess-step' + (done ? ' done' : '') + (skipped ? ' skip' : '') + (current ? ' cur' : '') }, [
          el('div', { class: 'si', text: v.ic }),
          el('div', { style: { minWidth: 0 } }, [
            el('div', { class: 'st', text: v.t }),
            el('div', { class: 'sd', text: v.d })
          ]),
          el('div', { class: 'sa' }, [
            state,
            action,
            done || skipped ? null : el('span', {
              class: 'sess-skip', text: 'passer', title: 'Retirer cette étape de la séance du jour',
              onClick: function () { p.skipped[i] = true; Store.save(); redraw(); }
            })
          ].filter(Boolean))
        ]);
      }

      function content() {
        var c = counts();
        var p = c.plan;
        var streak = Store.streak();
        var minutes = 0;
        var currentIndex = -1;

        p.steps.forEach(function (s, i) {
          if (isSkipped(p, i)) return;
          if (!isDone(s)) {
            minutes += view(s).minutes;
            if (currentIndex < 0) currentIndex = i;
          }
        });

        var pct = c.total ? Math.round((c.done / c.total) * 100) : 100;
        var finished = c.total > 0 && c.left === 0;

        var head = UI.card('Votre plan pour aujourd’hui', [
          el('div', { class: 'goal-row' }, [
            el('div', { class: 'goal-part' }, [
              UI.ring(pct, {
                size: 58, width: 6, text: c.done + '/' + c.total, fontSize: 12,
                color: finished ? 'var(--green)' : 'var(--accent)'
              }),
              el('div', {}, [
                el('div', { class: 'gl', text: 'Étapes' }),
                el('div', { class: 'gv', html: finished ? '<b>Séance terminée</b>' : '<b>' + c.left + '</b> restante' + (c.left > 1 ? 's' : '') }),
                el('div', { class: 'gs', text: finished ? 'Tout ce que vous ferez de plus est du bonus' : 'Environ ' + minutes + ' min de travail' })
              ])
            ]),
            el('div', { class: 'goal-part' }, [
              el('div', { class: 'streak-mark', text: streak.current >= 7 ? '🔥' : streak.current >= 3 ? '✨' : '🌱' }),
              el('div', {}, [
                el('div', { class: 'gl', text: 'Série en cours' }),
                el('div', { class: 'gv', html: '<b>' + streak.current + ' jour' + (streak.current > 1 ? 's' : '') + '</b> d’affilée' }),
                el('div', { class: 'gs', text: 'Record : ' + streak.best + ' jours' })
              ])
            ]),
            el('div', { class: 'goal-part' }, [
              el('div', { class: 'streak-mark', text: '📊' }),
              el('div', {}, [
                el('div', { class: 'gl', text: 'Déjà fait aujourd’hui' }),
                el('div', { class: 'gv', html: '<b>' + Store.day().cards + '</b> fiches · <b>' + Store.day().quiz + '</b> QCM' }),
                el('div', { class: 'gs', text: Store.day().sims + ' simulation(s) · ' + Store.day().cases + ' patient(s)' })
              ])
            ])
          ])
        ], {
          right: UI.btn('↻ Refaire le plan', function () {
            plan(true); UI.toast('Nouveau plan pour aujourd’hui.'); redraw();
          }, 'sm')
        });

        var rows = p.steps.length
          ? p.steps.map(function (s, i) { return stepRow(s, i, p, i === currentIndex); })
          : [UI.empty('🎉', 'Rien à faire : aucune fiche due et aucun objectif fixé.<br>Réglez votre objectif quotidien dans « Ma progression ».')];

        var list = UI.card(null, rows);

        var end = finished
          ? UI.card('Séance terminée 🎉', [
              el('p', { class: 'mt0', html:
                'Vous avez fait vos <b>' + c.total + ' étapes</b> du jour. La série est assurée pour aujourd’hui : ' +
                '<b>' + streak.current + ' jour' + (streak.current > 1 ? 's' : '') + '</b> d’affilée.' }),
              el('div', { class: 'btn-row' }, [
                UI.btn('🩺  Un patient de plus', function () { M.patient.startRandom(); App.go('patient'); }, 'primary'),
                UI.btn('⏱  Examen blanc', function () { App.go('exam'); }),
                UI.btn('📈  Voir ma progression', function () { App.go('progress'); })
              ])
            ])
          : null;

        /* posé sur l'accueil, le plan n'explique pas comment il a été tiré :
           un lien vers sa propre page suffit, où l'explication est entière */
        var how = !opts.how
          ? UI.card(null, [
              el('div', { class: 'flex' }, [
                el('span', { class: 'muted small', text: 'Les étapes sont choisies sur ce qui est dû, vos thèmes les plus ratés et votre semestre.' }),
                el('span', { class: 'spacer' }),
                UI.btn('Comment cette séance est construite →', function () { App.go('session'); }, 'sm')
              ])
            ])
          : UI.card('Comment cette séance est construite', UI.accordion([
          { title: 'Les fiches dues d’abord', open: true, body:
            '<p>La répétition espacée décide seule de ce qui revient : une fiche ratée revient le lendemain, ' +
            'une fiche sue revient dans 25 jours. La séance en propose autant que votre objectif quotidien ' +
            '(réglable dans « Ma progression »), jamais plus que ce qui est réellement dû.</p>' },
          { title: 'Les QCM sur votre thème le plus fragile', body:
            '<p>Chaque thème est noté sur votre taux de réussite, et les questions jamais vues comptent comme à moitié sues. ' +
            'Le thème le plus faible est proposé en premier, complété par le deuxième pour éviter la lassitude.</p>' },
          { title: 'Une lecture de bilan par jour', body:
            '<p>Un bilan complet à interpréter, tiré sur un dossier différent chaque jour. ' +
            'Un jour = une lecture : c’est la répétition qui installe le réflexe de lire un compte rendu dans le bon ordre.</p>' },
          { title: 'L’UE prioritaire de votre semestre', body:
            '<p>Reprise du plan de révision : l’UE est choisie sur le produit « ECTS × ce qu’il vous reste à maîtriser ». ' +
            'L’étape est cochée dès que vous avez récité l’UE ou marqué sa fiche comme revue. ' +
            'Elle n’apparaît que si vous avez indiqué votre semestre.</p>' },
          { title: 'Une consultation tous les deux jours', body:
            '<p>C’est le seul exercice qui enchaîne anamnèse, examens, diagnostic et conduite à tenir. ' +
            'Elle n’est proposée que si vous n’en avez pas fait depuis deux jours.</p>' },
          { title: 'Rien n’est « validé » à la main', body:
            '<p>L’avancement est lu dans vos compteurs du jour : dès qu’une fiche est revue, un QCM répondu ou une lecture ' +
            'validée, l’étape avance. Vous pouvez donc travailler depuis n’importe quel module — la séance suit.</p>' }
        ]));

        return el('div', {}, [head, end, list, how].filter(Boolean));
      }

      redraw();
      return wrap;
    },

    render: function () {
      return UI.page({
        crumb: 'Mon travail',
        title: 'Séance du jour',
        subtitle: 'Ce qu’il y a à faire aujourd’hui, dans l’ordre : ce qui est dû, ce que vous ratez, ' +
          'ce que vous n’avez jamais ouvert. Chaque étape s’exécute dans son module et revient ici.'
      }, [M.session.panel({ how: true, retour: 'session' })]);
    }
  };

})();
