/* ============================================================
   QCM — entraînement et examen blanc
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  function categories() {
    var set = {};
    QUIZ.forEach(function (q) { set[q.cat] = (set[q.cat] || 0) + 1; });
    return Object.keys(set).sort().map(function (k) { return { cat: k, n: set[k] }; });
  }

  function shuffle(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }

  M.quiz = {
    id: 'quiz', title: 'QCM', icon: '❓', group: 'Révision',
    desc: 'Questions à choix multiple avec correction commentée',
    keywords: 'qcm question quiz examen entrainement revision',
    render: function (ctx) {
      var st = { cats: [], mode: 'train', n: 15, list: [], i: 0, answers: {}, locked: {}, started: false, focused: false };

      var body = el('div');

      /* question ouverte directement depuis la recherche rapide */
      function startOne(qid) {
        var q = QUIZ.filter(function (x) { return x.id === qid; })[0];
        if (!q) return false;
        st.list = [q]; st.i = 0; st.answers = {}; st.locked = {};
        st.started = true; st.focused = true; st.mode = 'train';
        return true;
      }

      function start() {
        var pool = QUIZ.filter(function (q) { return !st.cats.length || st.cats.indexOf(q.cat) >= 0; });
        if (st.mode === 'weak') {
          pool = pool.slice().sort(function (a, b) {
            var sa = Store.state.quiz[a.id], sb = Store.state.quiz[b.id];
            var ra = sa ? sa.ok / Math.max(1, sa.seen) : -1;
            var rb = sb ? sb.ok / Math.max(1, sb.seen) : -1;
            return ra - rb;
          });
        } else pool = shuffle(pool);
        st.list = pool.slice(0, Math.min(st.n, pool.length));
        st.i = 0; st.answers = {}; st.locked = {}; st.started = true; st.focused = false;
        draw();
      }

      function draw() {
        UI.clear(body);
        if (!st.started) { body.appendChild(setup()); return; }
        if (st.i >= st.list.length) { body.appendChild(results()); return; }

        var q = st.list[st.i];
        var opts = el('div');
        q.opts.forEach(function (o, i) {
          var cls = 'q-opt';
          if (st.locked[q.id] !== undefined) {
            cls += ' locked';
            if (i === q.a) cls += ' right';
            else if (i === st.answers[q.id]) cls += ' wrong';
          } else if (st.answers[q.id] === i) cls += ' sel';
          opts.appendChild(el('div', {
            class: cls,
            onClick: function () {
              if (st.locked[q.id] !== undefined) return;
              st.answers[q.id] = i;
              if (st.mode !== 'exam') { lock(q); }
              draw();
            }
          }, [
            el('span', { class: 'mark', text: String.fromCharCode(65 + i) }),
            el('span', { text: o })
          ]));
        });

        function lock(q) {
          st.locked[q.id] = true;
          Store.recordQuiz(q.id, st.answers[q.id] === q.a);
        }

        var stat = Store.state.quiz[q.id];
        body.appendChild(UI.card(null, [
          el('div', { class: 'flex' }, [
            UI.chip(q.cat, 'blue'),
            el('span', { class: 'spacer' }),
            el('span', { class: 'muted small', text: 'Question ' + (st.i + 1) + ' / ' + st.list.length }),
            stat ? UI.chip('Vue ' + stat.seen + '× · ' + Math.round(stat.ok / stat.seen * 100) + ' % de réussite') : null
          ].filter(Boolean)),
          UI.bar(((st.i) / st.list.length) * 100),
          el('h2', { class: 'mt16 selectable', text: q.q }),
          opts,
          st.locked[q.id] !== undefined ? UI.note('<b>' + (st.answers[q.id] === q.a ? '✔ Bonne réponse. ' : '✘ ') + '</b>' + q.exp,
            st.answers[q.id] === q.a ? '' : 'warn') : null,
          el('div', { class: 'btn-row mt16' }, [
            st.i > 0 ? UI.btn('← Précédente', function () { st.i--; draw(); }) : null,
            st.mode === 'exam' && st.locked[q.id] === undefined
              ? UI.btn('Valider', function () { if (st.answers[q.id] === undefined) { UI.toast('Choisissez une réponse.'); return; } lock(q); draw(); })
              : null,
            UI.btn(st.i === st.list.length - 1 ? 'Terminer' : 'Suivante →', function () {
              if (st.locked[q.id] === undefined && st.answers[q.id] !== undefined) lock(q);
              st.i++; draw();
            }, 'primary'),
            UI.btn(st.focused ? 'Configurer une série' : 'Abandonner', function () { st.started = false; st.focused = false; draw(); })
          ].filter(Boolean)),
          UI.keyhint([['A – D', 'répondre'], ['1 – 4', 'répondre'], ['Entrée', 'question suivante'], ['←', 'précédente']])
        ]));
      }

      function results() {
        var right = st.list.filter(function (q) { return st.answers[q.id] === q.a; }).length;
        var pct = Math.round((right / st.list.length) * 100);
        // une question isolée ouverte depuis la recherche ne compte pas comme une série
        if (!st.focused) Store.recordScore('quiz', pct, { n: st.list.length });

        var byCat = {};
        st.list.forEach(function (q) {
          byCat[q.cat] = byCat[q.cat] || { ok: 0, n: 0 };
          byCat[q.cat].n++;
          if (st.answers[q.id] === q.a) byCat[q.cat].ok++;
        });

        return el('div', {}, [
          UI.card('Résultat', [
            el('div', { class: 'grid g3' }, [
              UI.stat(pct + ' %', 'Score', pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)'),
              UI.stat(right + '/' + st.list.length, 'Bonnes réponses'),
              UI.stat(Object.keys(byCat).length, 'Thèmes abordés')
            ]),
            UI.table(['Thème', 'Réussite', ''], Object.keys(byCat).map(function (k) {
              var b = byCat[k];
              return [k, b.ok + '/' + b.n, el('div', { style: { minWidth: '120px' } }, UI.bar((b.ok / b.n) * 100,
                b.ok / b.n >= 0.7 ? 'var(--green)' : b.ok / b.n >= 0.5 ? 'var(--amber)' : 'var(--red)'))];
            }))
          ]),
          UI.card('Revoir les erreurs', el('div', {}, st.list.filter(function (q) { return st.answers[q.id] !== q.a; }).map(function (q) {
            return el('div', { class: 'card', style: { background: 'var(--bg-3)', marginBottom: '10px' } }, [
              el('b', { class: 'selectable', text: q.q }),
              el('p', { class: 'small', html: 'Bonne réponse : <b>' + q.opts[q.a] + '</b>' }),
              el('p', { class: 'small muted selectable', text: q.exp })
            ]);
          }).concat(right === st.list.length ? [el('p', { class: 'muted', text: 'Aucune erreur. Parfait.' })] : []))),
          el('div', { class: 'btn-row' }, [
            UI.btn('Nouvelle série', function () { start(); }, 'primary'),
            UI.btn('Changer les réglages', function () { st.started = false; draw(); })
          ])
        ]);
      }

      function setup() {
        var cats = categories();
        var chips = el('div', { class: 'flex wrap' }, cats.map(function (c) {
          return el('span', {
            class: 'chip', text: c.cat + ' (' + c.n + ')',
            onClick: function (e) {
              var k = st.cats.indexOf(c.cat);
              if (k >= 0) st.cats.splice(k, 1); else st.cats.push(c.cat);
              e.currentTarget.classList.toggle('on');
            }
          });
        }));
        var stats = Store.stats();
        return el('div', {}, [
          UI.card('Configurer la série', [
            el('h3', { text: 'Thèmes (aucun sélectionné = tous)' }),
            chips,
            el('div', { class: 'grid g3 mt16' }, [
              UI.field('Nombre de questions', UI.select([5, 10, 15, 20, 30, QUIZ.length].map(function (n) { return { value: n, label: n + ' questions' }; }), 15, function (v) { st.n = parseInt(v, 10); })),
              UI.field('Mode', UI.select([
                { value: 'train', label: 'Entraînement (correction immédiate)' },
                { value: 'exam', label: 'Examen blanc (correction à la fin)' },
                { value: 'weak', label: 'Mes points faibles d’abord' }
              ], 'train', function (v) { st.mode = v; })),
              UI.field(' ', UI.btn('Commencer', start, 'primary'))
            ])
          ]),
          UI.card('Votre historique', [
            el('div', { class: 'grid g3' }, [
              UI.stat(stats.quizSeen, 'Questions vues'),
              UI.stat(stats.quizRate + ' %', 'Taux de réussite', stats.quizRate >= 70 ? 'var(--green)' : 'var(--amber)'),
              UI.stat(QUIZ.length, 'Questions dans la banque')
            ]),
            (function () {
              var never = QUIZ.filter(function (q) { return !Store.state.quiz[q.id]; }).length;
              return UI.note(never
                ? 'Il vous reste <b>' + never + ' questions jamais vues</b>. Le mode « points faibles » les propose en priorité avec celles que vous ratez le plus.'
                : 'Vous avez vu toutes les questions au moins une fois. Le mode « points faibles » cible désormais vos erreurs.');
            })()
          ])
        ]);
      }

      var pp = (ctx && ctx.params) || {};
      if (pp.qid) startOne(pp.qid);
      else if (pp.cats && pp.cats.length) {
        // série lancée depuis une UE du programme des études
        st.cats = [].concat(pp.cats).filter(function (c) {
          return QUIZ.some(function (q) { return q.cat === c; });
        });
        st.n = pp.n || 15;
        st.mode = pp.mode || 'train';
        if (st.cats.length) start();
      }

      /* réponse au clavier : A à D (ou 1 à 4), Entrée pour enchaîner */
      function pick(i) {
        if (!st.started || st.i >= st.list.length) return;
        var q = st.list[st.i];
        if (st.locked[q.id] !== undefined || i >= q.opts.length) return;
        st.answers[q.id] = i;
        if (st.mode !== 'exam') { st.locked[q.id] = true; Store.recordQuiz(q.id, i === q.a); }
        draw();
      }

      UI.hotkeys(body, {
        'a': function () { pick(0); }, 'b': function () { pick(1); }, 'c': function () { pick(2); }, 'd': function () { pick(3); },
        '1': function () { pick(0); }, '2': function () { pick(1); }, '3': function () { pick(2); }, '4': function () { pick(3); },
        'Enter': function () {
          if (!st.started || st.i >= st.list.length) return;
          var q = st.list[st.i];
          if (st.locked[q.id] === undefined && st.answers[q.id] !== undefined) {
            st.locked[q.id] = true;
            Store.recordQuiz(q.id, st.answers[q.id] === q.a);
          }
          st.i++; draw();
        },
        'ArrowLeft': function () { if (st.started && st.i > 0) { st.i--; draw(); } }
      });

      draw();
      return UI.page({
        crumb: 'Révision',
        title: 'QCM',
        subtitle: QUIZ.length + ' questions réparties en ' + categories().length + ' thèmes, avec correction commentée et suivi de vos points faibles.'
      }, [body]);
    }
  };
})();
