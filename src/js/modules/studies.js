/* ============================================================
   Programme des études — le tableau de bord du cursus
   ------------------------------------------------------------
   Trois couches :
     1. le référentiel (6 semestres, UE, ECTS, volumes horaires)
     2. une fiche de travail par UE : objectifs, notions clés,
        pièges, ce qui tombe, méthode — reliée aux modules
     3. un suivi de maîtrise calculé sur l'activité réelle, et un
        plan de révision daté à partir de la date des partiels
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  var C = window.CURRICULUM;
  var GUIDE = window.UE_GUIDE || {};

  var CALC_NAMES = {
    acuity: 'Acuité visuelle', prism: 'Prismes & degrés', prentice: 'Loi de Prentice',
    hirschberg: 'Hirschberg & Krimsky', transpose: 'Transposition', vergence: 'Vergence & distances',
    accom: 'Accommodation & addition', aca: 'Rapport AC/A', converg: 'Convergence & vergences',
    vertex: 'Distance de sommet & basse vision', stereo: 'Stéréoscopie'
  };

  function chapName(id) {
    var ch = (window.THEORY || []).filter(function (c) { return c.id === id; })[0];
    return ch ? ch.title : id;
  }
  function semById(id) { return C.filter(function (x) { return x.id === id; })[0] || C[0]; }
  function ueKey(sem, ue) { return sem.id + ':' + ue.code; }
  function guideOf(ue) { return GUIDE[ue.code] || null; }

  function hours(sem) {
    return sem.ues.reduce(function (a, u) {
      a.h += u.h; a.cm += u.cm; a.td += u.td; a.tp += u.tp; return a;
    }, { h: 0, cm: 0, td: 0, tp: 0 });
  }

  function isCovered(u) {
    var l = u.links || {};
    return !!((l.mod && l.mod.length) || (l.calc && l.calc.length) || (l.chap && l.chap.length) || (l.cats && l.cats.length));
  }

  /* ============================================================
     Maîtrise d'une UE — calculée sur ce que l'étudiant a fait
     ============================================================ */
  function mastery(sem, u) {
    var l = u.links || {};
    var parts = [];

    if (l.cats && l.cats.length) {
      var pool = (window.QUIZ || []).filter(function (q) { return l.cats.indexOf(q.cat) >= 0; });
      var seen = 0, ok = 0;
      pool.forEach(function (q) {
        var r = Store.state.quiz[q.id];
        if (r) { seen += r.seen; ok += r.ok; }
      });
      // il faut du volume ET de la réussite : voir chaque question une fois vaut couverture 1
      var cov = Math.min(1, seen / Math.max(1, pool.length));
      var rate = seen ? ok / seen : 0;
      parts.push({ w: 1.2, v: cov * rate });
    }

    if (l.mod && l.mod.length) {
      var scored = l.mod.map(function (id) {
        var sc = Store.score(id);
        return sc ? Math.min(100, sc.avg) / 100 : 0;
      });
      parts.push({ w: 1, v: scored.reduce(function (a, b) { return a + b; }, 0) / scored.length });
    }

    var revised = Store.ueDone(ueKey(sem, u));
    if (!parts.length) return { pct: revised ? 100 : null, revised: revised };

    var tot = parts.reduce(function (a, p) { return a + p.w; }, 0);
    var val = parts.reduce(function (a, p) { return a + p.w * p.v; }, 0) / tot;
    var pct = Math.round(Math.min(1, val + (revised ? 0.18 : 0)) * 100);
    return { pct: pct, revised: revised };
  }

  function masteryLabel(pct) {
    if (pct === null) return 'À déclarer';
    if (pct >= 80) return 'Maîtrisée';
    if (pct >= 55) return 'Solide';
    if (pct >= 30) return 'En cours';
    if (pct > 0) return 'Découverte';
    return 'Non travaillée';
  }
  function masteryColor(pct) {
    if (pct === null) return 'var(--txt-3)';
    return pct >= 80 ? 'var(--green)' : pct >= 55 ? 'var(--accent)' : pct >= 30 ? 'var(--amber)' : 'var(--red)';
  }

  /* moyenne pondérée par les ECTS : l'état de préparation du semestre */
  function semesterReadiness(sem) {
    var tot = 0, sum = 0;
    sem.ues.forEach(function (u) {
      var m = mastery(sem, u);
      if (m.pct === null) return;
      tot += u.ects; sum += u.ects * m.pct;
    });
    return tot ? Math.round(sum / tot) : 0;
  }

  function currentSemester() { return Store.state.profile.semester || null; }

  function daysUntil(iso) {
    if (!iso) return null;
    var d = new Date(iso + 'T12:00:00');
    if (isNaN(d.getTime())) return null;
    return Math.round((d - Date.now()) / 86400000);
  }

  /* ============================================================
     Petits composants
     ============================================================ */
  function hoursBar(h) {
    if (!h.h) return el('div', { class: 'muted small', text: 'Pas d’heures présentielles.' });
    var parts = [
      { k: 'CM', v: h.cm, c: 'var(--accent)' },
      { k: 'TD', v: h.td, c: 'var(--blue)' },
      { k: 'TP', v: h.tp, c: 'var(--violet)' }
    ].filter(function (p) { return p.v > 0; });
    return el('div', {}, [
      el('div', { class: 'stack-bar' }, parts.map(function (p) {
        return el('i', { style: { width: (p.v / h.h * 100) + '%', background: p.c }, title: p.k + ' — ' + p.v + ' h' });
      })),
      el('div', { class: 'legend', style: { marginTop: '8px' } }, parts.map(function (p) {
        return el('span', {}, [el('i', { style: { background: p.c } }), el('span', { text: p.k + ' ' + p.v + ' h' })]);
      }))
    ]);
  }

  function overview() {
    var W = 680, H = 230, padL = 38, padB = 40, padT = 14;
    var g = s('svg', { viewBox: '0 0 ' + W + ' ' + H, style: 'width:100%;height:auto' });
    var maxH = Math.max.apply(null, C.map(function (sem) { return hours(sem).h; }));
    var bw = (W - padL - 12) / C.length;
    var cur = currentSemester();

    C.forEach(function (sem, i) {
      var h = hours(sem);
      var x = padL + i * bw, full = H - padB - padT;
      var y = padT + full * (1 - h.h / maxH), hh = full * (h.h / maxH), off = 0;
      [{ v: h.cm, c: 'var(--accent)' }, { v: h.td, c: 'var(--blue)' }, { v: h.tp, c: 'var(--violet)' }].forEach(function (sg) {
        if (!sg.v) return;
        var sh = hh * (sg.v / h.h);
        g.appendChild(s('rect', { x: x + 12, y: y + off, width: bw - 26, height: sh, fill: sg.c, opacity: cur && cur !== sem.id ? 0.45 : 1 }));
        off += sh;
      });
      g.appendChild(s('rect', { x: x + 12, y: y, width: bw - 26, height: hh, fill: 'none',
        stroke: cur === sem.id ? 'var(--accent)' : 'transparent', 'stroke-width': 2, rx: 3 }));
      g.appendChild(s('text', { x: x + bw / 2, y: y - 6, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--txt-2)' }, h.h + ' h'));
      g.appendChild(s('text', { x: x + bw / 2, y: H - 22, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': '700',
        fill: cur === sem.id ? 'var(--accent)' : 'var(--txt)' }, sem.id));
      g.appendChild(s('text', { x: x + bw / 2, y: H - 8, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--txt-3)' },
        sem.ects + ' ECTS · ' + sem.stage.ects + ' de stage'));
    });
    g.appendChild(s('line', { x1: padL, y1: H - padB, x2: W - 10, y2: H - padB, stroke: 'var(--line)' }));
    return g;
  }

  /* ============================================================
     Plan de révision
     ============================================================ */
  function actionsFor(sem, u, openSheet) {
    var l = u.links || {};
    var acts = [];
    if (l.cats && l.cats.length) {
      acts.push({ id: 'qcm', label: 'Série de 15 QCM — ' + l.cats.join(', '),
        run: function () { App.go('quiz', { cats: l.cats, n: 15 }); } });
    }
    if (l.mod && l.mod.length) {
      var mid = l.mod[0];
      if (M[mid]) acts.push({ id: 'mod', label: 'Séance pratique — ' + M[mid].title,
        run: function () { App.go(mid); } });
    }
    if (l.chap && l.chap.length) {
      acts.push({ id: 'chap', label: 'Relire le chapitre « ' + chapName(l.chap[0]) + ' »',
        run: function () { App.go('theory', { chapter: l.chap[0] }); } });
    }
    if (guideOf(u)) {
      acts.push({ id: 'fiche', label: 'Fiche d’UE : notions clés, pièges, ce qui tombe',
        run: function () { openSheet(u); } });
    }
    if (l.calc && l.calc.length) {
      acts.push({ id: 'calc', label: 'Exercices de calcul — ' + (CALC_NAMES[l.calc[0]] || l.calc[0]),
        run: function () { App.go('converters', { calc: l.calc[0] }); } });
    }
    return acts.slice(0, 3);
  }

  function buildPlan(sem, weeks, openSheet) {
    // priorité : ce qui pèse lourd en ECTS et qui n'est pas maîtrisé
    var ranked = sem.ues.map(function (u) {
      var m = mastery(sem, u);
      var pct = m.pct === null ? (m.revised ? 100 : 0) : m.pct;
      return { u: u, m: m, prio: u.ects * (1 - pct / 100) + (isCovered(u) ? 0.4 : 0) };
    }).filter(function (x) { return x.prio > 0.05 || x.m.pct === null; })
      .sort(function (a, b) { return b.prio - a.prio; });

    if (!ranked.length) return [];

    var plan = [];
    var k = 0;
    for (var w = 1; w <= weeks; w++) {
      var last = w === weeks;
      var picks = [];
      var n = last ? 2 : 3;
      for (var j = 0; j < n && ranked.length; j++) { picks.push(ranked[k % ranked.length]); k++; }
      plan.push({
        week: w, last: last,
        items: picks.map(function (p) { return { ue: p.u, m: p.m, acts: actionsFor(sem, p.u, openSheet) }; })
      });
    }
    return plan;
  }

  /* ============================================================
     Module
     ============================================================ */
  M.studies = {
    id: 'studies', title: 'Mes UE', icon: '🎓', group: 'Général',
    desc: 'Les 6 semestres, une fiche par UE, votre maîtrise et un plan de révision daté',

    /* --- API utilisée par l'accueil --- */
    readiness: function (semId) { return semesterReadiness(semById(semId)); },
    daysToExam: function (semId) { return daysUntil(Store.examDate(semId)); },
    /* les UE à travailler en priorité : lourdes et mal maîtrisées */
    priorities: function (semId, n) {
      var sem = semById(semId);
      return sem.ues.map(function (u) {
        var m = mastery(sem, u);
        var pct = m.pct === null ? (m.revised ? 100 : 0) : m.pct;
        return { ue: u, pct: pct, unknown: m.pct === null, prio: u.ects * (1 - pct / 100) };
      }).filter(function (x) { return x.prio > 0.05; })
        .sort(function (a, b) { return b.prio - a.prio; })
        .slice(0, n || 3);
    },

    keywords: 'programme etudes semestre ue ects referentiel formation cursus stage volume horaire cm td tp certificat capacite fiche revision partiel plan objectif piege methode',

    render: function (ctx) {
      var params = (ctx && ctx.params) || {};
      var wanted = params.sem || currentSemester() || 'S1';
      var totalH = C.reduce(function (a, sem) { return a + hours(sem).h; }, 0);
      var stageEcts = C.reduce(function (a, sem) { return a + sem.stage.ects; }, 0);

      var body = el('div');

      /* ---------------- fiche d'UE ---------------- */
      function ueSheet(sem, u) {
        var g = guideOf(u);
        var m = mastery(sem, u);
        var key = ueKey(sem, u);
        var l = u.links || {};

        function list(title, items, cls) {
          if (!items || !items.length) return null;
          return el('div', {}, [
            el('h3', { text: title }),
            el('ul', { class: cls || '' }, items.map(function (t) { return el('li', { html: t }); }))
          ]);
        }

        var chips = [];
        (l.mod || []).forEach(function (id) {
          if (M[id]) chips.push(el('span', { class: 'chip', text: (M[id].icon || '') + ' ' + M[id].title, onClick: function () { App.go(id); } }));
        });
        (l.calc || []).forEach(function (id) {
          chips.push(el('span', { class: 'chip', text: '🧮 ' + (CALC_NAMES[id] || id), onClick: function () { App.go('converters', { calc: id }); } }));
        });
        (l.chap || []).forEach(function (id) {
          chips.push(el('span', { class: 'chip', text: '📚 ' + chapName(id), onClick: function () { App.go('theory', { chapter: id }); } }));
        });

        UI.clear(body);
        body.appendChild(el('div', {}, [
          UI.card(null, [
            el('div', { class: 'flex wrap' }, [
              UI.btn('← Retour au semestre', function () { drawSemester(sem.id); }),
              UI.btn('🖨 Imprimer cette fiche', function () { window.print(); }, 'sm'),
              el('span', { class: 'spacer' }),
              UI.chip(sem.label, 'blue'),
              UI.chip(u.ects + ' ECTS'),
              u.h ? UI.chip(u.h + ' h — ' + u.cm + ' CM / ' + u.td + ' TD' + (u.tp ? ' / ' + u.tp + ' TP' : '')) : null
            ].filter(Boolean)),
            el('h2', { style: { marginBottom: '2px' }, text: u.code + ' — ' + u.title }),
            el('div', { class: 'flex wrap mt16', style: { gap: '18px' } }, [
              UI.ring(m.pct === null ? 0 : m.pct, { size: 76, width: 8, color: masteryColor(m.pct),
                text: m.pct === null ? '—' : m.pct + '%', fontSize: 13 }),
              el('div', {}, [
                el('div', { class: 'muted small', text: 'Votre maîtrise estimée' }),
                el('div', { style: { fontSize: '17px', fontWeight: '650', color: masteryColor(m.pct) }, text: masteryLabel(m.pct) }),
                el('div', { class: 'small muted', text: m.pct === null
                  ? 'Cette UE n’a pas d’équivalent dans l’application : cochez-la quand vous l’avez révisée.'
                  : 'Calculée sur vos QCM et vos scores dans les modules liés.' })
              ]),
              el('span', { class: 'spacer' }),
              (function () {
                var b = UI.btn(m.revised ? '✓ Révisée' : 'Marquer comme révisée', function () {
                  Store.ueDone(key, !Store.ueDone(key));
                  ueSheet(sem, u);
                }, m.revised ? 'primary' : '');
                return b;
              })()
            ])
          ]),

          g && g.resume ? UI.note('<b>En une phrase.</b> ' + g.resume) : null,

          g ? UI.card('Ce que cette UE attend de vous', el('ul', {}, g.objectifs.map(function (t) { return el('li', { text: t }); }))) : null,

          /* le cours en condensé : la partie qui remplace la relecture du poly */
          g && g.plan ? UI.card('Le cours en condensé', el('div', { class: 'selectable' },
            g.plan.map(function (p) {
              return el('div', { class: 'ue-chapter' }, [
                el('h4', { text: p.t }),
                el('p', { html: p.p })
              ]);
            })), { right: UI.chip(g.plan.length + ' parties') }) : null,

          g && g.chiffres ? UI.card('Les chiffres à connaître par cœur', el('div', { class: 'ue-figures selectable' },
            g.chiffres.map(function (c) {
              return el('div', { class: 'ue-figure' }, [
                el('span', { class: 'k', html: c[0] }),
                el('span', { class: 'v', html: c[1] })
              ]);
            }))) : null,

          /* les formules de l'UE, avec leur raison d'être */
          l.formulas && l.formulas.length ? UI.card('Les formules de cette UE', el('div', { class: 'selectable' },
            l.formulas.map(function (fid) {
              var f = (window.FORMULAS || {})[fid];
              if (!f) return null;
              return el('div', { class: 'ue-formula' }, [
                el('div', { class: 'uf-title', text: f.t }),
                el('div', { class: 'uf-f mono', html: f.f }),
                el('div', { class: 'uf-w', html: '<b>Pourquoi ?</b> ' + f.w }),
                f.r ? el('div', { class: 'uf-r', html: '<b>Repère.</b> ' + f.r }) : null
              ].filter(Boolean));
            }).filter(Boolean)),
            { right: UI.btn('🧮 Les appliquer', function () {
              App.go('converters', { calc: (l.calc && l.calc[0]) || 'acuity' });
            }, 'sm') }) : null,

          g && g.notions ? UI.card('À retenir absolument', el('ul', { class: 'ue-notions selectable' },
            g.notions.map(function (t) { return el('li', { html: t }); }))) : null,

          g ? el('div', { class: 'grid g2' }, [
            UI.card('Les pièges', el('ul', {}, g.pieges.map(function (t) { return el('li', { html: t }); })), { class: 'ue-trap' }),
            UI.card('Ce qui tombe', el('ul', {}, g.tombe.map(function (t) { return el('li', { html: t }); })))
          ]) : null,

          g ? UI.card('Comment travailler cette UE', UI.note(g.methode)) : null,

          UI.card('Travailler maintenant', [
            chips.length ? el('div', { class: 'flex wrap', style: { gap: '7px', marginBottom: '14px' } }, chips) : null,
            el('div', { class: 'btn-row' }, [
              l.cats && l.cats.length ? UI.btn('❓ Série de QCM sur cette UE', function () { App.go('quiz', { cats: l.cats, n: 15 }); }, 'primary') : null,
              l.cats && l.cats.length ? UI.btn('⏱ Examen blanc de cette UE', function () {
                App.go('exam', { cats: l.cats, label: u.code + ' — ' + u.title });
              }) : null,
              UI.btn('Voir tout le semestre', function () { drawSemester(sem.id); })
            ].filter(Boolean)),
            !chips.length ? UI.note('Cette UE relève surtout de vos cours et de vos stages : l’application ne la couvre pas. ' +
              'Servez-vous de la fiche ci-dessus comme trame de révision.', 'warn') : null
          ].filter(Boolean))
        ].filter(Boolean)));
        // la fiche s'affiche sous les onglets : on l'amène à l'écran
        if (body.isConnected) body.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }

      /* ---------------- vue semestre ---------------- */
      function drawSemester(id) {
        var sem = semById(id);
        var h = hours(sem);
        var ready = semesterReadiness(sem);
        var isMine = currentSemester() === sem.id;
        var examISO = Store.examDate(sem.id);
        var left = daysUntil(examISO);

        /* --- plan de révision --- */
        var planBox = el('div');
        function drawPlan() {
          UI.clear(planBox);
          var weeks = left === null ? 6 : Math.max(1, Math.min(12, Math.ceil(left / 7)));
          if (left !== null && left < 0) {
            planBox.appendChild(UI.note('La date indiquée est passée. Mettez-la à jour pour régénérer un plan.', 'warn'));
            return;
          }
          var plan = buildPlan(sem, weeks, function (u) { ueSheet(sem, u); });
          if (!plan.length) {
            planBox.appendChild(UI.empty('🎉', 'Toutes les UE de ce semestre sont au vert.<br>Entretenez avec un examen blanc de temps en temps.'));
            return;
          }
          planBox.appendChild(el('p', { class: 'small muted', style: { marginTop: 0 },
            text: left === null
              ? 'Plan générique sur 6 semaines. Indiquez la date de vos partiels pour l’ajuster.'
              : 'Plan sur ' + weeks + ' semaine' + (weeks > 1 ? 's' : '') + ', priorité aux UE lourdes et mal maîtrisées.' }));

          plan.forEach(function (w) {
            var items = el('div');
            w.items.forEach(function (it) {
              var acts = el('div', { class: 'plan-acts' });
              it.acts.forEach(function (a) {
                var pkey = sem.id + ':w' + w.week + ':' + it.ue.code + ':' + a.id;
                var done = Store.planDone(pkey);
                var line = el('div', { class: 'plan-act' + (done ? ' done' : '') }, [
                  el('span', {
                    class: 'plan-check', text: done ? '✓' : '',
                    title: 'Marquer comme fait',
                    onClick: function () { Store.planDone(pkey, !Store.planDone(pkey)); drawPlan(); }
                  }),
                  el('span', { class: 'plan-label', text: a.label, onClick: a.run })
                ]);
                acts.appendChild(line);
              });
              items.appendChild(el('div', { class: 'plan-ue' }, [
                el('div', { class: 'flex' }, [
                  el('b', { text: it.ue.code + ' — ' + it.ue.title }),
                  el('span', { class: 'spacer' }),
                  UI.chip((it.m.pct === null ? '—' : it.m.pct + ' %'), it.m.pct >= 55 ? 'green' : it.m.pct >= 30 ? 'amber' : 'red')
                ]),
                acts
              ]));
            });
            planBox.appendChild(el('div', { class: 'plan-week' }, [
              el('div', { class: 'plan-week-head' }, [
                el('b', { text: 'Semaine ' + w.week }),
                w.last ? UI.chip('Dernière ligne droite', 'violet') : null
              ].filter(Boolean)),
              items,
              w.last ? el('div', { class: 'btn-row', style: { marginTop: '10px' } }, [
                UI.btn('⏱ Examen blanc de révision', function () { App.go('exam'); }, 'primary'),
                UI.btn('🗂 Réviser les fiches mémo', function () { App.go('flashcards'); })
              ]) : null
            ].filter(Boolean)));
          });
        }
        drawPlan();

        var dateInput = el('input', { type: 'date', class: 'inp', value: examISO || '' });
        dateInput.addEventListener('change', function () {
          Store.examDate(sem.id, dateInput.value || null);
          drawSemester(sem.id);
        });

        /* --- une UE, en carte cliquable --- */
        function ueCard(u) {
          var m = mastery(sem, u);
          var l = u.links || {};
          var g = guideOf(u);
          var mini = [];
          (l.mod || []).slice(0, 2).forEach(function (id) {
            if (M[id]) mini.push(el('span', { class: 'chip', text: (M[id].icon || '') + ' ' + M[id].title, onClick: function (e) { e.stopPropagation(); App.go(id); } }));
          });
          if (l.cats && l.cats.length) {
            mini.push(el('span', { class: 'chip on', text: '❓ QCM', onClick: function (e) { e.stopPropagation(); App.go('quiz', { cats: l.cats, n: 15 }); } }));
          }

          return el('div', { class: 'ue-card', onClick: function () { ueSheet(sem, u); } }, [
            el('div', { class: 'ue-card-head' }, [
              UI.ring(m.pct === null ? 0 : m.pct, { size: 46, width: 5, color: masteryColor(m.pct),
                text: m.pct === null ? '—' : String(m.pct), fontSize: 12 }),
              el('div', { style: { minWidth: 0, flex: 1 } }, [
                el('div', { class: 'flex', style: { gap: '8px' } }, [
                  el('b', { class: 'ue-code', text: u.code }),
                  el('span', { class: 'ue-ects', text: u.ects + ' ECTS' }),
                  u.h ? el('span', { class: 'ue-h', text: u.h + ' h · ' + u.cm + ' CM / ' + u.td + ' TD' + (u.tp ? ' / ' + u.tp + ' TP' : '') }) : null
                ].filter(Boolean)),
                el('div', { class: 'ue-title', text: u.title }),
                el('div', { class: 'ue-state', style: { color: masteryColor(m.pct) }, text: masteryLabel(m.pct) })
              ])
            ]),
            g ? el('p', { class: 'ue-resume', text: g.resume || g.objectifs[0] }) : null,
            el('div', { class: 'flex wrap', style: { gap: '6px', marginTop: '10px' } },
              mini.concat([el('span', { class: 'ue-open', text: g ? 'Ouvrir la fiche →' : 'Suivi manuel →' })]))
          ].filter(Boolean));
        }

        UI.clear(body);
        body.appendChild(el('div', {}, [
          /* 1 — les UE, tout de suite */
          UI.card(sem.label + ' — ' + sem.ues.length + ' unités d’enseignement', [
            el('div', { class: 'flex wrap', style: { marginBottom: '14px' } }, [
              UI.chip(sem.ects + ' ECTS dont ' + sem.stage.ects + ' de stage', 'blue'),
              UI.chip(h.h + ' heures'),
              UI.chip('Préparation ' + ready + ' %', ready >= 70 ? 'green' : ready >= 40 ? 'amber' : 'red'),
              left !== null ? UI.chip('Partiels dans ' + left + ' j', left < 14 ? 'red' : left < 30 ? 'amber' : '') : null,
              el('span', { class: 'spacer' }),
              isMine ? UI.chip('Votre semestre', 'green') : UI.btn('C’est mon semestre', function () {
                Store.state.profile.semester = sem.id; Store.save(); App.refreshNav(); drawSemester(sem.id);
              }, 'sm')
            ].filter(Boolean)),
            el('div', { class: 'ue-grid' }, sem.ues.map(ueCard)),
            el('div', { class: 'ue-stage' }, [
              el('b', { text: '🏥 ' + sem.stage.label }),
              el('span', { text: ' — ' + sem.stage.ects + ' ECTS. Le terrain : rien ne le remplace, et il compte autant que les UE.' })
            ])
          ]),

          /* 2 — le plan de révision */
          UI.card('Plan de révision', [
            el('div', { class: 'flex wrap', style: { gap: '14px', marginBottom: '14px' } }, [
              UI.field('Date de vos partiels', dateInput),
              el('div', { style: { alignSelf: 'end', paddingBottom: '13px' } },
                el('span', { class: 'muted small', text: left === null ? 'Sans date, le plan couvre 6 semaines.'
                  : left + ' jour' + (left > 1 ? 's' : '') + ' — soit ' + Math.max(1, Math.ceil(left / 7)) + ' semaine(s) de travail.' }))
            ]),
            planBox
          ]),

          /* 3 — le semestre en volumes, pour le contexte */
          UI.card('Le semestre en volumes horaires', [
            hoursBar(h),
            el('div', { class: 'grid g4 mt16' }, [
              UI.metric(ready + ' %', 'Préparation', ready,
                ready >= 70 ? 'var(--green)' : ready >= 40 ? 'var(--amber)' : 'var(--red)'),
              UI.stat(sem.ects, 'ECTS'),
              UI.stat(h.h + ' h', 'Enseignement'),
              UI.stat(left === null ? '—' : left + ' j', 'Avant les partiels',
                left === null ? 'var(--txt-3)' : left < 14 ? 'var(--red)' : left < 30 ? 'var(--amber)' : 'var(--accent)')
            ])
          ])
        ]));
        document.getElementById('main').scrollTop = 0;
      }

      /* ---------------- bandeau « où en êtes-vous » ---------------- */
      var mineBox = el('div');
      function drawMine() {
        UI.clear(mineBox);
        var cur = currentSemester();
        var acquired = 0;
        if (cur) {
          var idx = C.map(function (x) { return x.id; }).indexOf(cur);
          acquired = C.slice(0, idx).reduce(function (a, sem) { return a + sem.ects; }, 0);
        }
        mineBox.appendChild(el('div', { class: 'flex wrap', style: { gap: '18px' } }, [
          UI.ring(cur ? (acquired / 180) * 100 : 0, { size: 84, width: 8, text: acquired + '/180', fontSize: 13 }),
          el('div', { style: { minWidth: '230px' } }, [
            el('div', { class: 'muted small', text: 'Votre semestre' }),
            UI.select(C.map(function (sem) { return { value: sem.id, label: sem.label + ' — année ' + sem.year }; })
              .concat([{ value: '', label: 'Non précisé' }]), cur || '', function (v) {
                Store.state.profile.semester = v || null;
                Store.save(); App.refreshNav(); drawMine();
                if (v) { tabs.setTab(v); }
              }),
            el('div', { class: 'small muted', style: { marginTop: '6px' },
              text: cur ? 'ECTS des semestres précédents, considérés acquis.' : 'Choisissez votre semestre : tout s’y adapte.' })
          ]),
          cur ? el('div', { style: { minWidth: '200px' } }, [
            el('div', { class: 'muted small', text: 'Préparation du semestre en cours' }),
            (function () {
              var r = semesterReadiness(semById(cur));
              return el('div', {}, [
                el('div', { style: { fontSize: '26px', fontWeight: '700', fontFamily: 'var(--mono)', color: masteryColor(r) }, text: r + ' %' }),
                UI.bar(r, masteryColor(r))
              ]);
            })(),
            el('div', { class: 'small muted', style: { marginTop: '6px' }, text: 'Moyenne pondérée par les ECTS de vos UE.' })
          ]) : null
        ].filter(Boolean)));
      }
      drawMine();

      var tabs = UI.tabs(C.map(function (sem) {
        return { id: sem.id, label: sem.id + (currentSemester() === sem.id ? ' ★' : '') };
      }), function (id) { drawSemester(id); return null; }, wanted);

      var page = UI.page({
        crumb: 'Mes études',
        title: 'Unités d’enseignement',
        subtitle: 'Vos UE, semestre par semestre : le cours en condensé, les chiffres à connaître, les pièges, ' +
          'ce qui tombe — et un plan de révision calé sur la date de vos partiels.'
      }, [
        tabs,
        body,
        UI.card('Où en êtes-vous dans le cursus ?', mineBox),
        UI.card('Les six semestres', [
          overview(),
          el('div', { class: 'legend', style: { marginTop: '10px' } }, [
            el('span', {}, [el('i', { style: { background: 'var(--accent)' } }), el('span', { text: 'Cours magistraux' })]),
            el('span', {}, [el('i', { style: { background: 'var(--blue)' } }), el('span', { text: 'Travaux dirigés' })]),
            el('span', {}, [el('i', { style: { background: 'var(--violet)' } }), el('span', { text: 'Travaux pratiques' })])
          ]),
          UI.note('Cursus complet : <b>180 ECTS</b>, <b>' + totalH + ' heures</b> d’enseignement et <b>' + stageEcts +
            ' ECTS</b> de stage. Le volume présentiel décroît d’année en année pendant que la part de stage grimpe de 1 à 10 : ' +
            'la formation bascule progressivement de l’amphi vers le terrain.')
        ])
      ]);

      if (params.ue) {
        var sem0 = semById(wanted);
        var u0 = sem0.ues.filter(function (x) { return x.code === params.ue; })[0];
        if (u0) ueSheet(sem0, u0);      // rendu immédiat : pas de course avec l'affichage
      }
      return page;
    }
  };
})();
