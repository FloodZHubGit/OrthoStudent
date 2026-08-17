/* ============================================================
   Vision binoculaire — Worth, Maddox, Bagolini, stéréo, fusion
   ------------------------------------------------------------
   En mode « dossier » (ouvert depuis une consultation), les
   cinq ateliers sont pilotés par les données du patient et ne
   tirent plus rien au sort.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  /* ---------------- Worth ---------------- */
  var WORTH_CASES = [
    { id: 'fusion', label: 'Fusion normale', dots: 4, note: 'Le patient voit 4 points : vision binoculaire simple.' },
    { id: 'dipl-eso', label: 'Diplopie homonyme (ésodéviation)', dots: 5, sep: 40, note: 'Cinq points, les rouges du côté de l’œil qui les voit : diplopie homonyme, donc ésodéviation.' },
    { id: 'dipl-exo', label: 'Diplopie croisée (exodéviation)', dots: 5, sep: -40, note: 'Cinq points croisés : exodéviation.' },
    { id: 'dipl-vert', label: 'Diplopie verticale', dots: 5, sep: 0, vert: 46, note: 'Cinq points décalés verticalement : déviation verticale (paralysie d’un muscle vertical ou oblique).' },
    { id: 'sup-od', label: 'Neutralisation de l’œil droit (verre rouge)', dots: 3, note: 'Trois points verts : l’œil portant le verre rouge est neutralisé.' },
    { id: 'sup-os', label: 'Neutralisation de l’œil gauche (verre vert)', dots: 2, note: 'Deux points rouges : l’œil portant le verre vert est neutralisé.' },
    { id: 'alt', label: 'Neutralisation alternante', dots: 32, note: 'Le patient voit tantôt 2, tantôt 3 points : neutralisation alternante.' }
  ];

  function worthSVG(caseId, phase) {
    var c = WORTH_CASES.filter(function (x) { return x.id === caseId; })[0] || WORTH_CASES[0];
    var g = s('svg', { viewBox: '0 0 360 360', style: 'width:100%;max-width:340px;height:auto;background:#05080b;border-radius:12px' });
    function dot(x, y, col) {
      g.appendChild(s('circle', { cx: x, cy: y, r: 20, fill: col, opacity: 0.95 }));
      g.appendChild(s('circle', { cx: x, cy: y, r: 30, fill: col, opacity: 0.18 }));
    }
    var d = c.dots;
    if (d === 32) d = phase % 2 ? 3 : 2;
    if (d === 4) { dot(180, 70, '#e02030'); dot(105, 180, '#22c25c'); dot(255, 180, '#22c25c'); dot(180, 292, '#d8dde2'); }
    else if (d === 3) { dot(105, 180, '#22c25c'); dot(255, 180, '#22c25c'); dot(180, 292, '#22c25c'); }
    else if (d === 2) { dot(180, 70, '#e02030'); dot(180, 292, '#e02030'); }
    else if (d === 5) {
      var sp = c.sep || 0, vt = c.vert || 0;
      dot(180 + sp, 70 - vt, '#e02030'); dot(180 + sp, 292 - vt, '#e02030');
      dot(105 - sp / 2, 180 + vt, '#22c25c'); dot(255 - sp / 2, 180 + vt, '#22c25c'); dot(180 - sp / 2, 292 + vt, '#22c25c');
    }
    return g;
  }

  /* ---------------- Bagolini ---------------- */
  var BAGOLINI = [
    { id: 'crn', label: 'Croix complète, symétrique', txt: 'Correspondance rétinienne normale si le cover test est normal ; correspondance rétinienne anormale harmonieuse si une tropie est présente.' },
    { id: 'gap', label: 'Une branche interrompue en son centre', txt: 'Scotome de neutralisation central de l’œil correspondant — typique de la microtropie.' },
    { id: 'miss', label: 'Une branche totalement absente', txt: 'Neutralisation complète de l’œil correspondant.' },
    { id: 'cross', label: 'Deux branches décalées (non croisées au centre)', txt: 'Diplopie : correspondance rétinienne normale avec déviation manifeste.' },
    { id: 'alt', label: 'Branches alternantes', txt: 'Neutralisation alternante.' }
  ];

  function bagoliniSVG(kind) {
    var g = s('svg', { viewBox: '0 0 320 320', style: 'width:100%;max-width:300px;height:auto;background:#05080b;border-radius:12px' });
    g.appendChild(s('circle', { cx: 160, cy: 160, r: 12, fill: '#fff8d0' }));
    function branch(x1, y1, x2, y2, col, opts) {
      opts = opts || {};
      if (opts.hidden) return;
      g.appendChild(s('line', {
        x1: x1 + (opts.dx || 0), y1: y1 + (opts.dy || 0), x2: x2 + (opts.dx || 0), y2: y2 + (opts.dy || 0),
        stroke: col, 'stroke-width': 5, opacity: 0.9, 'stroke-dasharray': opts.gap ? '90 46' : null
      }));
    }
    var a = {}, b = {};
    if (kind === 'gap') a.gap = true;
    if (kind === 'miss') a.hidden = true;
    if (kind === 'cross') { a.dx = 34; b.dx = -10; }
    if (kind === 'alt') a.hidden = true;
    branch(30, 290, 290, 30, '#ffd45e', a);
    branch(30, 30, 290, 290, '#ffd45e', b);
    return g;
  }

  /* ---------------- Données dérivées du dossier ---------------- */
  function deriveBino(sim) {
    var ct = (sim && sim.covertest) || {};
    var worth = (sim && sim.worth) || 'fusion';
    var bagolini = (sim && sim.bagolini) ||
      (worth === 'fusion' ? 'crn'
        : worth === 'alt' ? 'alt'
        : (worth === 'sup-od' || worth === 'sup-os') ? 'miss'
        : 'cross');
    var stereo = (sim && sim.stereo !== undefined) ? sim.stereo : (worth === 'fusion' ? 60 : null);
    var exo = Math.max(0, ct.nearH || 0);
    var eso = Math.max(0, -(ct.nearH || 0));
    var f = (sim && sim.fusion) || {};
    var fusion = {
      BE: f.BE || { blur: Math.max(4, 17 - exo), brk: Math.max(6, 21 - exo), rec: Math.max(2, 11 - exo) },
      BI: f.BI || { blur: 0, brk: Math.max(5, 21 - eso), rec: Math.max(3, 13 - eso) }
    };
    // phorie mesurable à la baguette de Maddox
    var maddox = {
      vertical: Math.abs(ct.farV || 0) > Math.abs(ct.farH || 0),
      h: ct.farH || 0, v: ct.farV || 0
    };
    return { worth: worth, bagolini: bagolini, stereo: stereo, fusion: fusion, maddox: maddox };
  }

  /* ============================================================ */
  M.binocular = {
    id: 'binocular', title: 'Vision binoculaire', icon: '🔗', group: 'Simulateurs',
    desc: 'Worth, Maddox, Bagolini, stéréoscopie, amplitudes de fusion',
    keywords: 'worth maddox bagolini stereo tno titmus fusion amplitude vergence neutralisation',
    render: function (ctx) {
      var sim = ctx && ctx.params && ctx.params.sim;
      var D = sim ? deriveBino(sim) : null;

      function fileNote(txt) {
        return UI.note('📁 <b>Dossier patient</b> — ' + txt, '');
      }

      /* ----- Worth ----- */
      function tabWorth() {
        var st = { current: D ? D.worth : 'fusion', phase: 0, quiz: null };
        var view = el('div', { class: 'stage', style: { padding: '18px' } });
        var explain = el('div');

        function draw() {
          UI.clear(view);
          view.appendChild(el('div', { class: 'stage-label', text: 'Vue du patient (lunettes rouge-vert)' }));
          view.appendChild(worthSVG(st.current, st.phase));
        }
        clearInterval(M.binocular._timer);
        M.binocular._timer = setInterval(function () {
          if (!view.isConnected) { clearInterval(M.binocular._timer); return; }
          if (st.current === 'alt') { st.phase++; draw(); }
        }, 900);

        function setCase(id, silent) {
          st.current = id; draw();
          UI.clear(explain);
          if (!silent) {
            var c = WORTH_CASES.filter(function (x) { return x.id === id; })[0];
            explain.appendChild(UI.note('<b>' + c.label + '</b> — ' + c.note));
          }
        }

        var picker = el('div', { class: 'flex wrap' }, WORTH_CASES.map(function (c) {
          return el('span', { class: 'chip', text: c.label, onClick: function () { setCase(c.id); } });
        }));

        var trainBox = el('div');
        function newTrain() {
          var c = WORTH_CASES[Math.floor(Math.random() * WORTH_CASES.length)];
          st.quiz = c.id;
          setCase(c.id, true);
          UI.clear(trainBox);
          var sel = UI.select(WORTH_CASES.map(function (x) { return { value: x.id, label: x.label }; }), 'fusion', function () {});
          trainBox.appendChild(UI.field('Que voit ce patient ?', sel));
          trainBox.appendChild(el('div', { class: 'btn-row' }, [
            UI.btn('Valider', function () {
              var ok = sel.value === st.quiz;
              Store.recordScore('binocular', ok ? 100 : 0);
              var real = WORTH_CASES.filter(function (x) { return x.id === st.quiz; })[0];
              trainBox.appendChild(UI.note((ok ? '✔ Exact. ' : '✘ Réponse : <b>' + real.label + '</b>. ') + real.note, ok ? '' : 'warn'));
            }, 'primary'),
            UI.btn('Autre cas', newTrain)
          ]));
        }

        setCase(st.current);
        if (D) {
          trainBox.appendChild(el('p', { class: 'muted small', text: 'Entraînement libre : un tableau au hasard, à interpréter (sans lien avec ce dossier).' }));
          trainBox.appendChild(UI.btn('Lancer l’entraînement', newTrain));
        } else {
          newTrain();
        }

        return el('div', { class: 'split' }, [
          el('div', {}, [UI.card('Test de Worth', [
            D ? fileNote('c’est ce que décrit ce patient au test de Worth.') : null,
            view, explain
          ].filter(Boolean))]),
          el('div', {}, [
            UI.card('Explorer les autres tableaux', picker),
            UI.card('Entraînement', trainBox),
            UI.card('Mémo', [
              UI.table(['Ce que voit le patient', 'Interprétation'], [
                ['4 points', 'Fusion'],
                ['5 points', 'Diplopie (homonyme si éso, croisée si exo, décalés si verticale)'],
                ['2 points rouges', 'Neutralisation de l’œil au verre vert'],
                ['3 points verts', 'Neutralisation de l’œil au verre rouge'],
                ['Alternance 2 / 3', 'Neutralisation alternante']
              ]),
              UI.note('Le test de Worth est <b>dissociant</b> : à 6 m il n’explore que 1,25° central (très sensible aux scotomes de neutralisation) ; ' +
                'de près il explore un champ plus large et peut être « faussement normal » grâce à la fusion périphérique.')
            ])
          ])
        ]);
      }

      /* ----- Maddox ----- */
      function tabMaddox() {
        var st = { phoria: 0, vertical: false, prism: 0, base: 'BE', locked: !!D };
        var view = el('div', { class: 'stage', style: { padding: '10px', minHeight: '320px' } });

        function residual() {
          var p = st.prism;
          if (st.vertical) return st.phoria - (st.base === 'BInf' ? p : st.base === 'BS' ? -p : 0);
          return st.phoria + (st.base === 'BE' ? p : st.base === 'BI' ? -p : 0);
        }

        function draw() {
          UI.clear(view);
          view.appendChild(el('div', { class: 'stage-label', text: 'Vue du patient — baguette de Maddox' }));
          var g = s('svg', { viewBox: '0 0 520 300', style: 'width:100%;height:auto' });
          g.appendChild(s('rect', { x: 0, y: 0, width: 520, height: 300, fill: '#04070a' }));
          g.appendChild(s('circle', { cx: 260, cy: 150, r: 9, fill: '#fff6cc' }));
          g.appendChild(s('circle', { cx: 260, cy: 150, r: 22, fill: '#fff6cc', opacity: 0.16 }));
          var r = residual(), off = r * 4.2;
          if (st.vertical) g.appendChild(s('line', { x1: 40, y1: 150 - off, x2: 480, y2: 150 - off, stroke: '#ff2f3c', 'stroke-width': 5 }));
          else g.appendChild(s('line', { x1: 260 - off, y1: 20, x2: 260 - off, y2: 280, stroke: '#ff2f3c', 'stroke-width': 5 }));
          view.appendChild(g);
          view.appendChild(el('div', { class: 'stage-hud' }, [
            el('span', { class: 'hud-tag', text: 'Prisme : ' + st.prism + ' Δ ' + Optics.Prism.baseLabel(st.base) }),
            el('span', { class: 'hud-tag', text: Math.abs(r) < 0.6 ? 'Trait sur le point ✔' : 'Trait décalé' })
          ]));
        }

        function loadCase() {
          if (D) {
            st.vertical = D.maddox.vertical;
            st.phoria = st.vertical ? D.maddox.v : D.maddox.h;
          } else {
            st.vertical = Math.random() < 0.3;
            st.phoria = st.vertical
              ? (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 4))
              : (Math.random() < 0.5 ? -1 : 1) * (2 + Math.floor(Math.random() * 7) * 2);
          }
          st.prism = 0; st.base = st.vertical ? 'BInf' : 'BE';
          draw(); UI.clear(ans); buildAns();
        }

        var ans = el('div');
        function buildAns() {
          var val = UI.num(0, function () {}, { step: 1, min: 0, max: 40 });
          var dir = UI.select(st.vertical
            ? [{ value: 'od', label: 'Hyperphorie OD' }, { value: 'os', label: 'Hyperphorie OG' }]
            : [{ value: 'eso', label: 'Ésophorie' }, { value: 'exo', label: 'Exophorie' }], st.vertical ? 'od' : 'eso', function () {});
          ans.appendChild(el('div', { class: 'grid g2' }, [UI.field('Type', dir), UI.field('Amplitude (Δ)', val)]));
          ans.appendChild(el('div', { class: 'btn-row' }, [
            UI.btn('Valider', function () {
              var tv = Math.abs(st.phoria);
              var dirOk = st.vertical
                ? (st.phoria > 0 ? dir.value === 'od' : dir.value === 'os')
                : (st.phoria < 0 ? dir.value === 'eso' : dir.value === 'exo');
              var err = Math.abs((parseFloat(val.value) || 0) - tv);
              var score = Math.round(Math.max(0, 100 - err * 12 - (dirOk ? 0 : 35)));
              Store.recordScore('binocular', score);
              ans.appendChild(UI.note((dirOk && err <= 1 ? '✔ ' : '✘ ') + 'Déviation réelle : <b>' + tv + ' Δ ' +
                (st.vertical ? (st.phoria > 0 ? 'hyper OD' : 'hyper OG') : (st.phoria < 0 ? 'ésodéviation' : 'exodéviation')) +
                '</b>. Score <b>' + score + ' %</b>.', score >= 80 ? '' : 'warn'));
            }, 'primary'),
            UI.btn(D ? 'Autre patient (hors dossier)' : 'Nouveau patient', function () { D = D; st.locked = false; var keep = D; D = null; loadCase(); D = keep; })
          ]));
        }

        var barNode = el('div', { class: 'prism-bar' });
        [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 25, 30].forEach(function (v) {
          var cell = el('div', {
            class: 'prism-cell', text: v ? v + 'Δ' : '0',
            onClick: function () {
              st.prism = v;
              barNode.querySelectorAll('.prism-cell').forEach(function (n) { n.classList.remove('on'); });
              cell.classList.add('on');
              draw();
            }
          });
          barNode.appendChild(cell);
        });

        loadCase();

        return el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Baguette de Maddox', [
              D ? fileNote('la baguette est posée devant l’œil droit de ce patient : mesurez sa ' +
                (D.maddox.vertical ? 'déviation verticale' : 'déviation horizontale') + ' aux prismes.') : null,
              view,
              el('div', { class: 'btn-row', style: { marginTop: '10px' } }, [
                el('span', { class: 'muted small', text: 'Base :' }),
                UI.select([
                  { value: 'BE', label: 'Base externe' }, { value: 'BI', label: 'Base interne' },
                  { value: 'BInf', label: 'Base inférieure' }, { value: 'BS', label: 'Base supérieure' }
                ], st.vertical ? 'BInf' : 'BE', function (v) { st.base = v; draw(); })
              ])
            ].filter(Boolean)),
            UI.card('Votre mesure', ans)
          ]),
          el('div', {}, [
            UI.card('Prismes', barNode),
            UI.card('Méthode', [
              el('p', { html: 'La baguette de Maddox transforme la source ponctuelle en <b>trait lumineux perpendiculaire</b> aux stries. Elle dissocie totalement : elle ne mesure donc que des <b>phories</b>.' }),
              UI.table(['Orientation des stries', 'Trait perçu', 'Mesure'], [
                ['Horizontales', 'Trait vertical', 'Déviations horizontales'],
                ['Verticales', 'Trait horizontal', 'Déviations verticales'],
                ['Obliques (double Maddox)', 'Deux traits', 'Cyclodéviation']
              ]),
              UI.note('Si le trait rouge apparaît <b>du même côté</b> que l’œil qui le voit → déviation <b>homonyme = ésodéviation</b>. Du côté opposé → <b>croisée = exodéviation</b>.')
            ])
          ])
        ]);
      }

      /* ----- Bagolini ----- */
      function tabBagolini() {
        var view = el('div', { class: 'stage', style: { padding: '16px' } });
        var expl = el('div');
        var quizId = null;

        function show(kind, silent) {
          UI.clear(view);
          view.appendChild(el('div', { class: 'stage-label', text: 'Vue du patient — verres striés de Bagolini' }));
          view.appendChild(bagoliniSVG(kind));
          UI.clear(expl);
          if (!silent) {
            var b = BAGOLINI.filter(function (x) { return x.id === kind; })[0];
            expl.appendChild(UI.note('<b>' + b.label + '</b> — ' + b.txt));
          }
        }

        var quizBox = el('div');
        function newQuiz() {
          var b = BAGOLINI[Math.floor(Math.random() * BAGOLINI.length)];
          quizId = b.id; show(b.id, true);
          UI.clear(quizBox);
          var sel = UI.select(BAGOLINI.map(function (x) { return { value: x.id, label: x.label }; }), BAGOLINI[0].id, function () {});
          quizBox.appendChild(UI.field('Quelle image le patient décrit-il ?', sel));
          quizBox.appendChild(el('div', { class: 'btn-row' }, [
            UI.btn('Valider', function () {
              var ok = sel.value === quizId;
              Store.recordScore('binocular', ok ? 100 : 0);
              var real = BAGOLINI.filter(function (x) { return x.id === quizId; })[0];
              quizBox.appendChild(UI.note((ok ? '✔ ' : '✘ ') + '<b>' + real.label + '</b> — ' + real.txt, ok ? '' : 'warn'));
            }, 'primary'),
            UI.btn('Autre cas', newQuiz)
          ]));
        }

        show(D ? D.bagolini : 'crn');
        if (D) {
          quizBox.appendChild(el('p', { class: 'muted small', text: 'Entraînement libre, sans lien avec ce dossier.' }));
          quizBox.appendChild(UI.btn('Lancer l’entraînement', newQuiz));
        } else newQuiz();

        return el('div', { class: 'split' }, [
          el('div', {}, [UI.card('Verres striés de Bagolini', [
            D ? fileNote('image décrite par ce patient.') : null, view, expl
          ].filter(Boolean))]),
          el('div', {}, [
            UI.card('Explorer les tableaux', el('div', { class: 'flex wrap' }, BAGOLINI.map(function (b) {
              return el('span', { class: 'chip', text: b.label, onClick: function () { show(b.id); } });
            }))),
            UI.card('Entraînement', quizBox),
            UI.card('Pourquoi Bagolini ?', el('p', {
              html: 'Les verres striés sont <b>faiblement dissociants</b> : ils laissent la vision quasi naturelle. C’est le test de choix pour dépister ' +
                'une correspondance rétinienne anormale et les scotomes de neutralisation d’une microtropie, là où le Worth, trop dissociant, fait basculer le patient en diplopie ou en neutralisation.'
            }))
          ])
        ]);
      }

      /* ----- Amplitudes de fusion ----- */
      function tabFusion() {
        var st = { blur: 0, brk: 0, rec: 0, cur: 0, dir: 'BE' };
        var logBox = el('div', { class: 'log' });
        var ans = el('div');
        var dirBtns = el('div', { class: 'btn-row' });

        function loadCase(dir, fromFile) {
          st.dir = dir || (Math.random() < 0.5 ? 'BE' : 'BI');
          if (fromFile && D) {
            var f = D.fusion[st.dir];
            st.blur = f.blur; st.brk = f.brk; st.rec = f.rec;
          } else if (st.dir === 'BE') {
            st.blur = 8 + Math.floor(Math.random() * 12); st.brk = st.blur + 4 + Math.floor(Math.random() * 10);
            st.rec = Math.max(2, st.brk - 3 - Math.floor(Math.random() * 8));
          } else {
            st.blur = 0; st.brk = 6 + Math.floor(Math.random() * 12);
            st.rec = Math.max(2, st.brk - 3 - Math.floor(Math.random() * 8));
          }
          st.cur = 0;
          UI.clear(logBox); UI.clear(ans); buildAns();
          add((fromFile ? 'Mesure sur le dossier — ' : 'Nouveau patient — ') + 'barre de prismes ' + Optics.Prism.baseLabel(st.dir) + ', augmentez progressivement.');
        }

        function add(t, b) { logBox.insertBefore(el('div', { class: 'log-line', html: b ? '<b>' + t + '</b>' : t }), logBox.firstChild); }

        function step(delta) {
          st.cur = Math.max(0, st.cur + delta);
          var msg;
          if (delta > 0) {
            if (st.blur && st.cur >= st.blur && st.cur - delta < st.blur) msg = 'Le patient : « ça devient flou mais c’est toujours simple. » → <b>point de flou</b>';
            else if (st.cur >= st.brk && st.cur - delta < st.brk) msg = 'Le patient : « je vois double ! » → <b>point de rupture</b>';
            else msg = 'Le patient voit toujours simple.';
          } else {
            if (st.cur <= st.rec && st.cur - delta > st.rec) msg = 'Le patient : « ça redevient simple. » → <b>point de recouvrement</b>';
            else msg = st.cur > st.brk ? 'Toujours double.' : 'Simple.';
          }
          add(st.cur + ' Δ ' + st.dir + ' — ' + msg, msg.indexOf('<b>') >= 0);
        }

        function buildAns() {
          var b1 = UI.num(0, function () {}, { step: 1 }), b2 = UI.num(0, function () {}, { step: 1 }), b3 = UI.num(0, function () {}, { step: 1 });
          ans.appendChild(el('div', { class: 'grid g3' }, [
            UI.field('Point de flou (Δ)', b1), UI.field('Point de rupture (Δ)', b2), UI.field('Recouvrement (Δ)', b3)
          ]));
          ans.appendChild(el('div', { class: 'btn-row' }, [
            UI.btn('Valider', function () {
              var e = Math.abs((parseFloat(b1.value) || 0) - st.blur) + Math.abs((parseFloat(b2.value) || 0) - st.brk) + Math.abs((parseFloat(b3.value) || 0) - st.rec);
              var score = Math.round(Math.max(0, 100 - e * 8));
              Store.recordScore('binocular', score);
              ans.appendChild(UI.note('Valeurs réelles : <b>' + st.blur + ' / ' + st.brk + ' / ' + st.rec + ' Δ</b> en ' +
                Optics.Prism.baseLabel(st.dir) + '. Score <b>' + score + ' %</b>. ' +
                (st.dir === 'BE' ? 'Norme de près : 17 / 21 / 11 Δ.' : 'Norme de près : 13 / 21 / 13 Δ.'), score >= 75 ? '' : 'warn'));
            }, 'primary'),
            UI.btn(D ? 'Patient au hasard (hors dossier)' : 'Nouveau patient', function () { loadCase(null, false); })
          ]));
        }

        if (D) {
          dirBtns.appendChild(el('span', { class: 'muted small', text: 'Mesurer :' }));
          dirBtns.appendChild(UI.btn('Convergence (base externe)', function () { loadCase('BE', true); }, 'primary'));
          dirBtns.appendChild(UI.btn('Divergence (base interne)', function () { loadCase('BI', true); }));
        }

        loadCase(D ? 'BE' : null, !!D);

        return el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Mesure des amplitudes de fusion', [
              D ? fileNote('réserves fusionnelles de ce patient, en vision de près.') : null,
              dirBtns,
              el('div', { class: 'btn-row' }, [
                UI.btn('+1 Δ', function () { step(1); }),
                UI.btn('+2 Δ', function () { step(2); }),
                UI.btn('−1 Δ', function () { step(-1); }),
                UI.btn('−2 Δ', function () { step(-2); }),
                UI.btn('Retour à 0', function () { st.cur = 0; add('Retour à 0 Δ.'); })
              ]),
              UI.note('Augmentez le prisme jusqu’à ce que le patient signale d’abord un <b>flou</b>, puis une <b>diplopie (rupture)</b>. Redescendez ensuite jusqu’au <b>recouvrement</b>.'),
              logBox
            ].filter(Boolean)),
            UI.card('Vos valeurs', ans)
          ]),
          el('div', {}, [
            UI.card('Normes de Morgan', UI.table(['Mesure', 'Loin', 'Près'], [
              ['Base externe (convergence)', '9 / 19 / 10', '17 / 21 / 11'],
              ['Base interne (divergence)', '— / 7 / 4', '13 / 21 / 13'],
              ['Verticale', '3–4', '3–4']
            ])),
            UI.card('Interprétation', el('ul', {
              html: '<li>Réserves de convergence effondrées + exophorie de près = <b>insuffisance de convergence</b>.</li>' +
                '<li>Réserves de divergence faibles + ésophorie de loin = <b>insuffisance de divergence</b> (éliminer une paralysie du VI).</li>' +
                '<li>Un recouvrement très inférieur à la rupture traduit une fusion instable, fatigable.</li>' +
                '<li>L’absence de flou en base externe évoque une accommodation déjà relâchée ou une neutralisation.</li>'
            }))
          ])
        ]);
      }

      /* ----- Stéréoscopie ----- */
      function tabStereo() {
        var LEVELS = [800, 400, 200, 140, 100, 80, 60, 50, 40];
        var startLevel = 0;
        if (D && D.stereo) {
          for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i] >= D.stereo) startLevel = i;
        }
        var st = { level: startLevel, answer: null, score: 0, tries: 0 };
        var view = el('div', { class: 'stage', style: { padding: '20px' } });
        var fb = el('div');

        function draw() {
          UI.clear(view);
          view.appendChild(el('div', { class: 'stage-label', text: 'Planche stéréoscopique — disparité ' + LEVELS[st.level] + '″' }));
          var target = Math.floor(Math.random() * 4);
          st.answer = target;
          var offset = Math.max(1.2, 26 - st.level * 2.8);
          var g = s('svg', { viewBox: '0 0 460 130', style: 'width:100%;height:auto' });
          for (var i = 0; i < 4; i++) {
            var cx = 70 + i * 110;
            var dd = i === target ? offset : 0;
            g.appendChild(s('circle', { cx: cx - dd / 2, cy: 65, r: 34, fill: 'none', stroke: '#ff3b46', 'stroke-width': 6, opacity: 0.85 }));
            g.appendChild(s('circle', { cx: cx + dd / 2, cy: 65, r: 34, fill: 'none', stroke: '#22d15c', 'stroke-width': 6, opacity: 0.85 }));
            g.appendChild(s('text', { x: cx, y: 122, fill: '#7b93a8', 'font-size': '12', 'text-anchor': 'middle' }, String(i + 1)));
          }
          view.appendChild(g);
        }

        function guess(i) {
          st.tries++;
          var ok = i === st.answer;
          if (ok) { st.score++; if (st.level < LEVELS.length - 1) st.level++; }
          else if (st.level > 0) st.level--;
          UI.clear(fb);
          fb.appendChild(UI.note((ok ? '✔ Exact — ' : '✘ Raté — c’était le cercle ' + (st.answer + 1) + '. ') +
            'Niveau actuel : <b>' + LEVELS[st.level] + '″</b>. Réussites : ' + st.score + '/' + st.tries, ok ? '' : 'warn'));
          if (st.tries >= 8) Store.recordScore('binocular', Math.round(Math.max(0, 100 - LEVELS[st.level] / 10)));
          draw();
        }

        draw();

        return el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Repérer le cercle en relief', [
              D ? fileNote(D.stereo
                ? 'la stéréo-acuité mesurée chez ce patient est de <b>' + D.stereo + '″</b> — la planche démarre à ce niveau.'
                : '<b>stéréoscopie non mesurable</b> chez ce patient (neutralisation ou diplopie). La planche ci-dessous est un simple entraînement.') : null,
              view,
              el('div', { class: 'btn-row', style: { marginTop: '10px' } }, [1, 2, 3, 4].map(function (n) {
                return UI.btn('Cercle ' + n, function () { guess(n - 1); });
              })),
              fb,
              UI.note('Simulation en anaglyphe : l’écart entre le cercle rouge et le cercle vert représente la disparité. ' +
                'Avec des lunettes rouge-vert sur un vrai test, ce décalage est perçu comme une différence de profondeur.')
            ].filter(Boolean))
          ]),
          el('div', {}, [
            UI.card('Les degrés de Worth', UI.table(['Degré', 'Contenu', 'Exploration'],
              Optics.Binocular.worthGrades.map(function (w) { return [w.g, w.label, w.tests]; }))),
            UI.card('Repères de stéréo-acuité', UI.table(['Valeur', 'Signification'], [
              ['≤ 60″', 'Stéréoscopie normale de l’adulte'],
              ['60 à 200″', 'Stéréoscopie fruste — microtropie, amblyopie légère'],
              ['200 à 3000″', 'Stéréoscopie grossière seulement'],
              ['Non mesurable', 'Absence de vision binoculaire (strabisme précoce, amblyopie profonde)']
            ]))
          ])
        ]);
      }

      var tabsNode = UI.tabs([
        { id: 'worth', label: '🔴 Worth' },
        { id: 'maddox', label: '📏 Maddox' },
        { id: 'bagolini', label: '✳️ Bagolini' },
        { id: 'fusion', label: '💪 Amplitudes de fusion' },
        { id: 'stereo', label: '🧊 Stéréoscopie' }
      ], function (id) {
        if (id === 'worth') return tabWorth();
        if (id === 'maddox') return tabMaddox();
        if (id === 'bagolini') return tabBagolini();
        if (id === 'fusion') return tabFusion();
        return tabStereo();
      });

      return UI.page({
        crumb: 'Simulateurs',
        title: 'Vision binoculaire',
        subtitle: sim
          ? 'Les cinq ateliers sont réglés sur le dossier de ce patient.'
          : 'Cinq ateliers : Worth, baguette de Maddox, verres striés de Bagolini, amplitudes de fusion et stéréoscopie. ' +
            'Chacun propose un mode entraînement avec correction commentée.'
      }, [tabsNode]);
    }
  };
})();
