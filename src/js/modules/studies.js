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
  var EXTRA = window.UE_EXTRA || {};

  /* Le graphe de prérequis se lit dans les deux sens. UE_EXTRA ne
     déclare que « repose sur » ; on inverse une fois pour disposer
     aussi de « prépare ». */
  var OPENS = (function () {
    var out = {};
    Object.keys(EXTRA).forEach(function (code) {
      (EXTRA[code].prereq || []).forEach(function (p) {
        (out[p] = out[p] || []).push(code);
      });
    });
    return out;
  })();

  /* Où trouver une UE dans le référentiel — une UE peut revenir
     dans plusieurs semestres (l'anglais), on garde la première. */
  function locate(code) {
    for (var i = 0; i < C.length; i++) {
      var u = C[i].ues.filter(function (x) { return x.code === code; })[0];
      if (u) return { sem: C[i], ue: u };
    }
    return null;
  }

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

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
    var parts = [], detail = [];
    var key = ueKey(sem, u);

    /* 1 — la récitation : rappel actif, donc le signal le plus fiable */
    var rec = Store.recite(key);
    var items = reciteItems(u).length;
    if (items) {
      parts.push({ w: 1.6, v: rec ? rec.pct / 100 : 0 });
      detail.push({
        k: 'Récitation', pct: rec ? rec.pct : 0, w: 1.6,
        hint: rec ? rec.n + ' items récités, ' + rec.pct + ' % sus' : items + ' items à réciter, jamais fait',
        act: 'recite'
      });
    }

    /* 2 — les QCM : il faut du volume ET de la réussite */
    if (l.cats && l.cats.length) {
      var pool = (window.QUIZ || []).filter(function (q) { return l.cats.indexOf(q.cat) >= 0; });
      var seen = 0, ok = 0;
      pool.forEach(function (q) {
        var r = Store.state.quiz[q.id];
        if (r) { seen += r.seen; ok += r.ok; }
      });
      var cov = Math.min(1, seen / Math.max(1, pool.length));
      var rate = seen ? ok / seen : 0;
      parts.push({ w: 1.2, v: cov * rate });
      detail.push({
        k: 'QCM', pct: Math.round(cov * rate * 100), w: 1.2,
        hint: seen ? seen + ' réponses sur ' + pool.length + ' questions, ' + Math.round(rate * 100) + ' % de réussite'
                   : pool.length + ' questions disponibles, aucune tentée',
        act: 'qcm'
      });
    }

    /* 3 — la pratique dans les simulateurs liés */
    if (l.mod && l.mod.length) {
      var scored = l.mod.map(function (id) {
        var sc = Store.score(id);
        return sc ? Math.min(100, sc.avg) / 100 : 0;
      });
      var v = scored.reduce(function (a, b) { return a + b; }, 0) / scored.length;
      parts.push({ w: 1, v: v });
      detail.push({
        k: 'Pratique', pct: Math.round(v * 100), w: 1,
        hint: l.mod.filter(function (id) { return Store.score(id); }).length + ' module(s) pratiqué(s) sur ' + l.mod.length,
        act: 'mod'
      });
    }

    var revised = Store.ueDone(key);
    if (!parts.length) return { pct: revised ? 100 : null, revised: revised, detail: [], rec: rec };

    var tot = parts.reduce(function (a, p) { return a + p.w; }, 0);
    var val = parts.reduce(function (a, p) { return a + p.w * p.v; }, 0) / tot;
    var pct = Math.round(Math.min(1, val + (revised ? 0.15 : 0)) * 100);
    return { pct: pct, revised: revised, detail: detail, rec: rec };
  }

  /* Ce sur quoi on peut s'interroger : les chiffres à connaître par cœur
     et les questions d'auto-interrogation de l'UE. */
  function reciteItems(u) {
    var g = GUIDE[u.code], e = EXTRA[u.code];
    var out = [];
    if (g && g.chiffres) {
      g.chiffres.forEach(function (c) {
        out.push({ q: c[0], a: c[1], kind: 'chiffre' });
      });
    }
    if (e && e.qr) {
      e.qr.forEach(function (p) {
        out.push({ q: p[0], a: p[1], kind: 'question' });
      });
    }
    return out;
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
  function actionsFor(sem, u, openSheet, recite) {
    var l = u.links || {};
    var acts = [];
    /* la récitation passe devant : c'est le geste au meilleur rapport
       temps / rétention, et il conditionne le reste */
    if (recite && reciteItems(u).length) {
      acts.push({ id: 'recite', label: 'Se faire interroger — ' + reciteItems(u).length + ' items',
        run: function () { recite(u); } });
    }
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

  function buildPlan(sem, weeks, openSheet, recite) {
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
        items: picks.map(function (p) { return { ue: p.u, m: p.m, acts: actionsFor(sem, p.u, openSheet, recite) }; })
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

      /* ============================================================
         Mode Réciter — interrogation active sur une UE
         ------------------------------------------------------------
         Se relire donne le sentiment de savoir ; se faire interroger
         dit ce qu'on sait vraiment. La réponse est masquée, l'étudiant
         s'auto-note, et le résultat pèse plus lourd que tout le reste
         dans le calcul de maîtrise.
         ============================================================ */
      function reciteMode(sem, u, opts) {
        opts = opts || {};
        var all = reciteItems(u);
        if (!all.length) { UI.toast('Rien à réciter pour cette UE.'); return; }

        var pool = all.slice();
        if (opts.only) pool = pool.filter(function (x) { return x.kind === opts.only; });
        if (opts.shuffle !== false) {
          for (var i = pool.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
          }
        }

        var st = { i: 0, shown: false, ok: 0, ko: 0, missed: [] };
        var box = el('div');

        function finish() {
          var total = st.ok + st.ko;
          var pct = total ? Math.round((st.ok / total) * 100) : 0;
          Store.recite(ueKey(sem, u), { pct: pct, n: total });
          Store.logActivity('ue:' + u.code, pct, { n: total });

          UI.clear(box);
          box.appendChild(UI.card('Récitation terminée — ' + u.code, [
            el('div', { class: 'grid g3' }, [
              UI.stat(st.ok, 'Sus', 'var(--green)'),
              UI.stat(st.ko, 'À revoir', 'var(--amber)'),
              UI.stat(pct + ' %', 'Score', masteryColor(pct))
            ]),
            st.missed.length
              ? el('div', {}, [
                  el('h3', { text: 'Ce qui n’est pas acquis' }),
                  el('div', { class: 'ue-figures selectable' }, st.missed.map(function (m) {
                    return el('div', { class: 'ue-figure' }, [
                      el('span', { class: 'k', html: m.q }),
                      el('span', { class: 'v', html: m.a })
                    ]);
                  }))
                ])
              : UI.note('Tout est su. La maîtrise de cette UE vient de monter.'),
            el('div', { class: 'btn-row' }, [
              st.missed.length ? UI.btn('↻ Reprendre les ' + st.missed.length + ' ratés', function () {
                var again = st.missed.slice();
                pool = again; st.i = 0; st.shown = false; st.ok = 0; st.ko = 0; st.missed = [];
                draw();
              }, 'primary') : null,
              UI.btn('Recommencer tout', function () {
                st.i = 0; st.shown = false; st.ok = 0; st.ko = 0; st.missed = [];
                draw();
              }),
              UI.btn('← Retour à la fiche', function () { ueSheet(sem, u); })
            ].filter(Boolean))
          ]));
        }

        function answer(good) {
          var it = pool[st.i];
          if (good) st.ok++; else { st.ko++; st.missed.push(it); }
          st.i++; st.shown = false;
          draw();
        }

        function draw() {
          UI.clear(box);
          if (st.i >= pool.length) { finish(); return; }
          var it = pool[st.i];

          var card = el('div', {
            class: 'recite-card', onClick: function () { st.shown = !st.shown; draw(); }
          }, [
            el('span', { class: 'side-label', text: it.kind === 'chiffre' ? 'Chiffre à connaître' : 'Question' }),
            el('div', { class: 'recite-q selectable', html: it.q }),
            st.shown
              ? el('div', { class: 'recite-a selectable', html: it.a })
              : el('div', { class: 'recite-hidden', text: 'Répondez à voix haute, puis cliquez pour vérifier.' })
          ]);

          box.appendChild(UI.card(null, [
            el('div', { class: 'flex wrap' }, [
              UI.chip(u.code, 'blue'),
              UI.chip(it.kind === 'chiffre' ? '🔢 chiffre' : '💬 question'),
              el('span', { class: 'spacer' }),
              st.ok ? el('span', { class: 'small', style: { color: 'var(--green)' }, text: '✓ ' + st.ok }) : null,
              st.ko ? el('span', { class: 'small', style: { color: 'var(--amber)' }, text: '↻ ' + st.ko }) : null,
              el('span', { class: 'muted small', text: (st.i + 1) + ' / ' + pool.length })
            ].filter(Boolean)),
            UI.bar((st.i / pool.length) * 100),
            el('div', { class: 'mt16' }, card),
            st.shown
              ? el('div', { class: 'btn-row mt16', style: { justifyContent: 'center' } }, [
                  UI.btn('↻ Pas su', function () { answer(false); }, 'danger'),
                  UI.btn('✓ Su', function () { answer(true); }, 'primary')
                ])
              : el('p', { class: 'muted center mt16', text: 'Formulez la réponse avant de la découvrir — c’est tout l’intérêt.' })
          ]));

          box.appendChild(el('div', { class: 'btn-row' }, [
            UI.btn('← Quitter la récitation', function () { ueSheet(sem, u); }),
            UI.btn('Passer', function () { st.i++; st.shown = false; draw(); })
          ]));

          box.appendChild(UI.keyhint([
            ['Espace', 'révéler'], ['1', 'pas su'], ['2', 'su'], ['→', 'passer']
          ]));
        }

        UI.hotkeys(box, {
          ' ': function () { if (st.i < pool.length) { st.shown = !st.shown; draw(); } },
          'Enter': function () { if (st.i < pool.length) { st.shown = !st.shown; draw(); } },
          '1': function () { if (st.shown) answer(false); },
          '2': function () { if (st.shown) answer(true); },
          'ArrowRight': function () { if (st.i < pool.length) { st.i++; st.shown = false; draw(); } }
        });

        draw();
        UI.clear(body);
        body.appendChild(el('div', {}, [
          UI.card(null, [
            el('div', { class: 'flex wrap' }, [
              el('h2', { style: { margin: 0 }, text: '🎤 Réciter — ' + u.code },),
              el('span', { class: 'spacer' }),
              UI.chip(sem.label, 'blue'),
              UI.chip(pool.length + ' items')
            ]),
            el('p', { class: 'muted small', style: { margin: '6px 0 0' },
              text: u.title })
          ]),
          box
        ]));
        document.getElementById('main').scrollTop = 0;
      }

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
            ]),

            /* le détail : ce qui manque exactement pour monter */
            m.detail && m.detail.length ? el('div', { class: 'ue-detail' }, m.detail.map(function (d) {
              return el('div', { class: 'ue-detail-row' }, [
                el('span', { class: 'k', text: d.k }),
                el('span', { class: 'b' }, UI.bar(d.pct, masteryColor(d.pct))),
                el('span', { class: 'p', style: { color: masteryColor(d.pct) }, text: d.pct + ' %' }),
                el('span', { class: 'h', text: d.hint })
              ]);
            })) : null
          ].filter(Boolean)),

          /* --- réciter : mis en tête, c'est le geste le plus rentable --- */
          reciteItems(u).length ? UI.card('Se faire interroger', [
            el('p', { class: 'muted small', style: { marginTop: 0 },
              html: 'Se relire donne le sentiment de savoir ; se faire interroger dit ce qu’on sait vraiment. ' +
                '<b>' + reciteItems(u).length + ' items</b> : les chiffres à connaître par cœur et les questions types de l’UE.' +
                (m.rec ? ' Dernière récitation : <b>' + m.rec.pct + ' %</b> sur ' + m.rec.n + ' items.' : '') }),
            el('div', { class: 'btn-row' }, [
              UI.btn('🎤 Réciter toute l’UE', function () { reciteMode(sem, u); }, 'primary'),
              (GUIDE[u.code] && GUIDE[u.code].chiffres || []).length
                ? UI.btn('🔢 Seulement les chiffres', function () { reciteMode(sem, u, { only: 'chiffre' }); }) : null,
              (EXTRA[u.code] && EXTRA[u.code].qr || []).length
                ? UI.btn('💬 Seulement les questions', function () { reciteMode(sem, u, { only: 'question' }); }) : null
            ].filter(Boolean))
          ]) : null,

          /* --- place dans le cursus --- */
          (function () {
            var e = EXTRA[u.code];
            var before = (e && e.prereq || []).map(function (c) { return locate(c); }).filter(Boolean);
            var after = (OPENS[u.code] || []).map(function (c) { return locate(c); }).filter(Boolean);
            if (!before.length && !after.length) return null;

            function chipsFor(list, cls) {
              return list.map(function (x) {
                var mm = mastery(x.sem, x.ue);
                return el('span', {
                  class: 'chip ' + cls, title: x.sem.label + ' — ' + x.ue.title,
                  onClick: function () { ueSheet(x.sem, x.ue); }
                }, [
                  el('i', { class: 'ue-dot', style: { background: masteryColor(mm.pct) } }),
                  el('span', { text: x.ue.code })
                ]);
              });
            }

            var weak = before.filter(function (x) {
              var mm = mastery(x.sem, x.ue);
              return mm.pct !== null && mm.pct < 40;
            });

            return UI.card('Sa place dans le cursus', [
              before.length ? el('div', { class: 'flex wrap ue-chain' }, [
                el('span', { class: 'ue-chain-k', text: 'Repose sur' })
              ].concat(chipsFor(before, ''))) : null,
              after.length ? el('div', { class: 'flex wrap ue-chain' }, [
                el('span', { class: 'ue-chain-k', text: 'Prépare' })
              ].concat(chipsFor(after, ''))) : null,
              weak.length
                ? UI.note('<b>Attention à l’ordre.</b> ' + weak.map(function (x) { return x.ue.code; }).join(', ') +
                    ' n’est pas encore solide, et cette UE s’appuie dessus. Reprendre le prérequis d’abord coûte ' +
                    'moins cher que de buter dessus à chaque chapitre.', 'warn')
                : null
            ].filter(Boolean));
          })(),

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

          /* --- le vocabulaire, relié au glossaire --- */
          (function () {
            var e = EXTRA[u.code];
            if (!e || !e.mots || !e.mots.length) return null;
            var known = {};
            (window.GLOSSARY || []).forEach(function (x) { known[x.t] = x; });
            var mots = e.mots.filter(function (t) { return known[t]; });
            if (!mots.length) return null;
            return UI.card('Le vocabulaire à maîtriser', [
              el('p', { class: 'muted small', style: { marginTop: 0 },
                text: mots.length + ' termes du glossaire sont indispensables sur cette UE. ' +
                  'Un mot que vous ne savez pas définir est une question que vous ne saurez pas traiter.' }),
              el('div', { class: 'flex wrap', style: { gap: '6px' } }, mots.map(function (t) {
                return el('span', {
                  class: 'chip', text: t, title: known[t].d.slice(0, 120) + '…',
                  onClick: function () { App.go('glossary', { term: t }); }
                });
              }))
            ]);
          })(),

          g ? UI.card('Comment travailler cette UE', UI.note(g.methode)) : null,

          UI.card('Travailler maintenant', [
            chips.length ? el('div', { class: 'flex wrap', style: { gap: '7px', marginBottom: '14px' } }, chips) : null,
            el('div', { class: 'btn-row' }, [
              reciteItems(u).length ? UI.btn('🎤 Réciter cette UE', function () { reciteMode(sem, u); }, 'primary') : null,
              l.cats && l.cats.length ? UI.btn('❓ Série de QCM sur cette UE', function () { App.go('quiz', { cats: l.cats, n: 15 }); }) : null,
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
          var plan = buildPlan(sem, weeks,
            function (u) { ueSheet(sem, u); },
            function (u) { reciteMode(sem, u); });
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

      /* ============================================================
         Vue transversale — les 6 semestres d'un coup
         ------------------------------------------------------------
         « Où est traitée l'amblyopie ? » ne devrait pas obliger à
         ouvrir six onglets. La recherche porte sur le code, le titre,
         le résumé, les objectifs et le vocabulaire de chaque UE.
         ============================================================ */
      function drawAll() {
        var stA = { q: '', sort: 'sem', filter: 'all' };
        var list = el('div');

        var rows = [];
        C.forEach(function (sem) {
          sem.ues.forEach(function (u) {
            var e = EXTRA[u.code], g = GUIDE[u.code];
            rows.push({
              sem: sem, ue: u,
              blob: norm([
                u.code, u.title,
                g ? g.resume : '',
                g ? (g.objectifs || []).join(' ') : '',
                g ? (g.notions || []).join(' ') : '',
                e ? (e.mots || []).join(' ') : '',
                (u.links && u.links.cats || []).join(' ')
              ].join(' ').replace(/<[^>]+>/g, ' '))
            });
          });
        });

        var searchA = el('input', { type: 'text', class: 'inp',
          placeholder: 'Chercher dans les 6 semestres…  (amblyopie, prisme, champ visuel, Panum)' });
        var count = el('span', { class: 'small muted' });

        var sortA = UI.select([
          { value: 'sem', label: 'Ordre du cursus' },
          { value: 'weak', label: 'Les moins maîtrisées d’abord' },
          { value: 'ects', label: 'Les plus lourdes en ECTS' }
        ], 'sem', function (v) { stA.sort = v; draw(); });

        var filters = el('div', { class: 'flex wrap' });
        [
          { id: 'all', label: 'Toutes' },
          { id: 'todo', label: 'Non travaillées' },
          { id: 'wip', label: 'En cours' },
          { id: 'done', label: 'Maîtrisées' }
        ].forEach(function (f) {
          filters.appendChild(el('span', {
            class: 'chip' + (f.id === 'all' ? ' on' : ''), text: f.label, dataset: { f: f.id },
            onClick: function (e) {
              stA.filter = f.id;
              filters.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
              e.currentTarget.classList.add('on');
              draw();
            }
          }));
        });

        function draw() {
          UI.clear(list);
          var q = norm(stA.q);
          var items = rows.filter(function (r) {
            if (q && r.blob.indexOf(q) < 0) return false;
            var m = mastery(r.sem, r.ue);
            var p = m.pct === null ? (m.revised ? 100 : -1) : m.pct;
            if (stA.filter === 'todo' && p > 5) return false;
            if (stA.filter === 'wip' && (p <= 5 || p >= 80)) return false;
            if (stA.filter === 'done' && p < 80) return false;
            return true;
          });

          if (stA.sort === 'weak') {
            items.sort(function (a, b) {
              var pa = mastery(a.sem, a.ue).pct, pb = mastery(b.sem, b.ue).pct;
              return (pa === null ? 999 : pa) - (pb === null ? 999 : pb);
            });
          } else if (stA.sort === 'ects') {
            items.sort(function (a, b) { return b.ue.ects - a.ue.ects; });
          }

          count.textContent = items.length + ' UE sur ' + rows.length;
          if (!items.length) {
            list.appendChild(UI.empty('🔍', 'Aucune UE ne correspond.'));
            return;
          }

          items.forEach(function (r) {
            var m = mastery(r.sem, r.ue);
            var g = GUIDE[r.ue.code];
            list.appendChild(el('div', { class: 'ue-row', onClick: function () { ueSheet(r.sem, r.ue); } }, [
              UI.ring(m.pct === null ? 0 : m.pct, { size: 40, width: 4, color: masteryColor(m.pct),
                text: m.pct === null ? '—' : String(m.pct), fontSize: 11 }),
              el('div', { style: { minWidth: 0, flex: 1 } }, [
                el('div', { class: 'flex', style: { gap: '8px' } }, [
                  el('b', { text: r.ue.code }),
                  el('span', { class: 'ue-ects', text: r.ue.ects + ' ECTS' }),
                  el('span', { class: 'chip static', text: r.sem.id })
                ]),
                el('div', { class: 'ue-title', text: r.ue.title }),
                g ? el('div', { class: 'ue-row-resume', text: g.resume }) : null
              ].filter(Boolean)),
              reciteItems(r.ue).length ? el('span', {
                class: 'chip', text: '🎤', title: 'Se faire interroger sur cette UE',
                onClick: function (e) { e.stopPropagation(); reciteMode(r.sem, r.ue); }
              }) : null,
              el('span', { class: 'arrow', text: '›' })
            ].filter(Boolean)));
          });
        }

        searchA.addEventListener('input', function () { stA.q = searchA.value; draw(); });
        draw();

        UI.clear(body);
        body.appendChild(el('div', {}, [
          UI.card('Toutes les UE du cursus', [
            searchA,
            el('div', { class: 'btn-row', style: { marginTop: '12px' } }, [
              count,
              el('span', { class: 'spacer' }),
              sortA
            ]),
            el('div', { style: { marginTop: '10px' } }, filters)
          ]),
          list
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
      }).concat([{ id: '__all', label: '⌕ Toutes les UE' }]),
        function (id) {
          if (id === '__all') drawAll(); else drawSemester(id);
          return null;
        }, wanted);

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
