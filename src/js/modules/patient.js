/* ============================================================
   Mode patient — consultation complète simulée
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  /* `task` : la question à laquelle l'examen doit répondre. Un examen prescrit
     est une question posée, pas un bouton à cliquer : on en lit le compte
     rendu, puis on l'interprète — et c'est l'interprétation qui est notée.
     Les identifiants sont ceux de core/reading.js, qui fabrique les items
     d'interprétation à partir des valeurs du dossier. */
  var TESTS = [
    { id: 'acuity', name: 'Acuité visuelle', ic: '🔠',
      task: 'Quelle acuité chaque œil atteint-il, de loin et de près, avec sa correction ?' },
    { id: 'phoropter', name: 'Réfraction', ic: '🔭',
      task: 'Quelle est la réfraction des deux yeux, et que change-t-elle à l’acuité ?' },
    { id: 'covertest', name: 'Cover test', ic: '👁',
      task: 'Nature et amplitude de la déviation, de loin et de près — unilatéral puis alterné.' },
    { id: 'prism', name: 'Mesure au prisme', ic: '🔺',
      task: 'Quel angle neutralise la déviation, et comment se répartit-il ?' },
    { id: 'motility', name: 'Motilité (9 positions)', ic: '🔄',
      task: 'Quelle position du regard est limitée, et quel muscle est en cause ?' },
    { id: 'lancaster', name: 'Test de Lancaster', ic: '🟥',
      task: 'Que disent les deux schémas : quel muscle est déficitaire, lequel est hyperactif ?' },
    { id: 'binocular', name: 'Vision binoculaire (Worth, fusion, stéréo)', ic: '🔗',
      task: 'Worth, amplitudes de fusion et stéréoscopie : où en est la vision binoculaire ?' },
    { id: 'ppc', name: 'PPC & convergence', ic: '🎯',
      task: 'Où se situent la rupture et le recouvrement, et est-ce normal ?' },
    { id: 'fundus', name: 'Fond d’œil', ic: '🔴',
      task: 'Papille, macula, rapport C/D : le fond d’œil est-il normal ?' },
    { id: 'colorvision', name: 'Vision des couleurs', ic: '🎨',
      task: 'Y a-t-il une dyschromatopsie, et selon quel axe ?' },
    { id: 'fields', name: 'Champ visuel / Amsler', ic: '🗺',
      task: 'Quel déficit le relevé montre-t-il, et où le situer sur les voies visuelles ?' }
  ];

  function testById(id) {
    return TESTS.filter(function (t) { return t.id === id; })[0];
  }

  var session = null;   // persiste tant qu'on ne change pas de patient

  function newSession(c) {
    return {
      caseId: c.id,
      caseObj: c.generated ? c : null,
      step: 'anamnese',
      asked: [],
      done: [],
      sims: {},          // testId -> { opened, validated, score }
      revealed: {},      // testId -> true quand le compte rendu est lu
      diagnosis: null,
      management: [],
      finished: false,
      score: null
    };
  }

  /* Moyenne des interprétations réellement validées (null si aucune) */
  function techScore(sess) {
    var ids = Object.keys(sess.sims || {}).filter(function (k) { return sess.sims[k].validated; });
    if (!ids.length) return null;
    var sum = ids.reduce(function (a, k) { return a + sess.sims[k].score; }, 0);
    return { n: ids.length, avg: Math.round(sum / ids.length) };
  }

  function resolveCase() {
    if (!session) return null;
    if (session.caseObj) return session.caseObj;
    return CASES.filter(function (x) { return x.id === session.caseId; })[0];
  }

  M.patient = {
    id: 'patient', title: 'Mode patient', icon: '🩺', group: 'Pratiquer',
    desc: 'Un patient arrive : anamnèse, choix des examens, diagnostic, conduite à tenir',
    keywords: 'patient cas clinique consultation anamnese diagnostic bilan conduite aleatoire',

    startCase: function (id) {
      var c = CASES.filter(function (x) { return x.id === id; })[0];
      if (c) session = newSession(c);
    },
    startRandom: function (archetype) {
      session = newSession(window.CaseGen.generate(archetype));
    },

    render: function (ctx) {
      if (ctx && ctx.params && ctx.params.caseId) M.patient.startCase(ctx.params.caseId);

      /* ---------- écran de sélection ---------- */
      if (!session) {
        var cards = el('div', { class: 'grid g3' }, CASES.map(function (c) {
          var done = Store.state.cases[c.id];
          return el('div', { class: 'tool-card', onClick: function () { session = newSession(c); App.go('patient'); } }, [
            el('div', { class: 'flex', style: { marginBottom: '10px' } }, [
              el('div', { class: 'tc-ic', text: '🧑', style: { marginBottom: 0 } }),
              el('div', { style: { minWidth: 0 } }, [
                el('div', { style: { fontWeight: '650', fontSize: '14.5px' }, text: c.name + ', ' + c.age + ' ans' }),
                el('div', { class: 'small muted', text: '★'.repeat(c.difficulty) + '☆'.repeat(3 - c.difficulty) + ' · ' + c.tags[0] })
              ]),
              el('span', { class: 'spacer' }),
              el('span', { class: 'chip static' + (done ? ' green' : ''), text: done ? done.score + ' %' : 'Nouveau' })
            ]),
            el('p', { style: { fontStyle: 'italic' }, text: '« ' + c.motif + ' »' })
          ]);
        }));

        var genStats = Object.keys(Store.state.cases).filter(function (k) { return k.indexOf('gen:') === 0; }).length;

        return UI.page({
          crumb: 'Pratiquer',
          title: 'Mode patient',
          subtitle: 'Interrogez le patient, choisissez les examens pertinents — leur compte rendu est <b>calculé sur son dossier</b>, ' +
                    'à vous de l’interpréter — puis posez votre diagnostic et votre conduite à tenir.'
        }, [
          UI.card('Patient inédit', [
            el('div', { class: 'flex wrap' }, [
              el('div', { style: { flex: '1 1 320px' } }, [
                el('p', { class: 'mb0', html: 'Un patient <b>généré aléatoirement</b> : nom, âge, plainte, angles, réfraction, acuités et résultats d’examen ' +
                  'sont retirés au sort à chaque fois à partir de dix tableaux cliniques. Vous ne pouvez pas le reconnaître.' }),
                el('p', { class: 'small muted', text: genStats ? genStats + ' type(s) de cas généré(s) déjà traité(s).' : '' })
              ]),
              UI.btn('🎲 Consulter un patient inédit', function () { M.patient.startRandom(); App.go('patient'); }, 'primary')
            ]),
            el('div', { class: 'flex wrap', style: { marginTop: '12px' } }, [
              el('span', { class: 'muted small', text: 'Ou cibler un tableau :' })
            ].concat([
              ['ic', 'Insuffisance de convergence'], ['esoaccom', 'Ésotropie accommodative'],
              ['vi', 'Paralysie du VI'], ['iv', 'Paralysie du IV'], ['xt', 'Exotropie intermittente'],
              ['amblyopie', 'Amblyopie'], ['presbytie', 'Presbytie'], ['dmla', 'DMLA'],
              ['glaucome', 'Glaucome'], ['ecran', 'Asthénopie / réfraction']
            ].map(function (a) {
              return el('span', { class: 'chip', text: a[1], onClick: function () { M.patient.startRandom(a[0]); App.go('patient'); } });
            })))
          ]),

          UI.card('Cas rédigés', cards),

          UI.card('Comment ça marche', [
            el('div', { class: 'timeline' }, [
              el('span', { class: 'tl-step cur', text: '1 · Anamnèse' }),
              el('span', { class: 'tl-step', text: '2 · Examens' }),
              el('span', { class: 'tl-step', text: '3 · Diagnostic' }),
              el('span', { class: 'tl-step', text: '4 · Conduite à tenir' }),
              el('span', { class: 'tl-step', text: '5 · Débriefing' })
            ]),
            UI.note('Chaque examen demandé a un coût : les examens <b>non pertinents</b> font baisser la note, comme en pratique où l’on ne multiplie pas les tests inutiles. ' +
              'Les examens pertinents oubliés pénalisent aussi. Un bilan, c’est une hypothèse que l’on teste, pas une liste que l’on déroule.'),
            UI.note('<b>Prescrire ne suffit pas.</b> Chaque examen prescrit livre son compte rendu, rédigé comme au dossier, ' +
              'puis vous demande de l’interpréter. La moyenne de vos interprétations rapporte jusqu’à <b>5 points</b> sur la note finale.')
          ])
        ]);
      }

      /* ---------- consultation en cours ---------- */
      var c = resolveCase();
      if (!c) { session = null; return M.patient.render({}); }

      /* Découvre le compte rendu d'un examen. Les questions d'interprétation
         qui l'accompagnent sont dérivées des valeurs cliniques du dossier
         (core/reading.js) : elles suivent le patient, elles ne sont pas
         écrites à la main. */
      function revealTest(t, after) {
        var rec = session.sims[t.id] || { opened: false, validated: false, score: 0, answers: {} };
        rec.opened = true;
        if (!rec.answers) rec.answers = {};
        session.sims[t.id] = rec;
        session.revealed[t.id] = true;
        if (after) after();
      }

      /* Étiquette de l'état d'un examen prescrit */
      function simChip(id) {
        var r = session.sims[id];
        if (!r || !r.opened) return UI.chip('Non lu', '');
        if (!Reading.forTest(c, id).length) return UI.chip('Lu', '');
        if (!r.validated) return UI.chip('Lu, pas encore interprété', 'amber');
        return UI.chip('Interprété — ' + r.score + ' %', r.score >= 70 ? 'green' : r.score >= 45 ? 'amber' : 'red');
      }

      /* Une question d'interprétation, avec sa correction une fois validée. */
      function itemField(rec, it) {
        var wrap = el('div', { class: 'read-item' });
        wrap.appendChild(el('div', { class: 'ri-q', html: it.label }));
        var done = rec.validated;
        if (it.type === 'choice') {
          var opts = el('div', { class: 'ri-opts' });
          it.options.forEach(function (o, i) {
            var chosen = rec.answers[it.id] === i;
            var cls = 'q-opt';
            if (done) {
              if (i === it.answer) cls += ' right';
              else if (chosen) cls += ' wrong';
              cls += ' locked';
            } else if (chosen) cls += ' sel';
            opts.appendChild(el('div', {
              class: cls,
              onClick: done ? null : function () {
                rec.answers[it.id] = i;
                opts.querySelectorAll('.q-opt').forEach(function (n, j) { n.classList.toggle('sel', j === i); });
              }
            }, [el('span', { class: 'mark', text: String.fromCharCode(65 + i) }), el('span', { text: o })]));
          });
          wrap.appendChild(opts);
        } else {
          var input = UI.num(rec.answers[it.id] === undefined ? '' : rec.answers[it.id],
            function (v) { rec.answers[it.id] = v; }, { step: 1, disabled: done || null });
          input.style.maxWidth = '150px';
          var chk = Reading.check(it, rec.answers[it.id]);
          wrap.appendChild(el('div', { class: 'flex', style: { gap: '9px' } }, [
            input,
            el('span', { class: 'muted small', text: it.unit || '' }),
            done ? el('span', { class: 'chip static ' + (chk.ok ? 'green' : 'red'),
              text: chk.ok ? '✔ juste' : '✘ ' + it.answer + ' ' + (it.unit || '') }) : null
          ].filter(Boolean)));
        }
        if (done && it.why) wrap.appendChild(UI.note(it.why));
        return wrap;
      }

      var timeline = el('div', { class: 'timeline', style: { marginBottom: '14px' } }, [
        ['anamnese', '1 · Anamnèse'], ['examens', '2 · Examens'], ['diagnostic', '3 · Diagnostic'],
        ['cat', '4 · Conduite à tenir'], ['debrief', '5 · Débriefing']
      ].map(function (p) {
        var order = ['anamnese', 'examens', 'diagnostic', 'cat', 'debrief'];
        var cur = order.indexOf(session.step), me = order.indexOf(p[0]);
        return el('span', { class: 'tl-step' + (me < cur ? ' done' : me === cur ? ' cur' : ''), text: p[1] });
      }));

      var header = UI.card(null, [
        el('div', { class: 'flex' }, [
          el('div', { style: { fontSize: '38px' } }, '🧑‍⚕️'),
          el('div', {}, [
            el('h2', { style: { margin: 0 }, text: c.name + ', ' + c.age + ' ans' }),
            el('div', { class: 'muted small', text: c.job })
          ]),
          el('span', { class: 'spacer' }),
          c.generated ? UI.chip('Cas généré', 'blue') : null,
          UI.btn('Changer de patient', function () { session = null; App.go('patient'); })
        ]),
        el('div', { class: 'speech' }, [
          el('span', { class: 'who', text: 'Motif de consultation' }),
          el('span', { text: '« ' + c.motif + ' »' })
        ])
      ]);

      var body = el('div');

      /* ---- étape 1 : anamnèse ---- */
      function stepAnamnese() {
        var dialogue = el('div');

        function redraw() {
          UI.clear(dialogue);
          if (!session.asked.length) {
            dialogue.appendChild(el('p', { class: 'muted', text: 'Cliquez une question ci-dessus pour la poser au patient.' }));
            return;
          }
          // la dernière question posée s'affiche en haut : pas besoin de faire défiler
          session.asked.slice().reverse().forEach(function (i, rank) {
            var pair = el('div', {
              class: rank === 0 ? 'qa-pair qa-new' : 'qa-pair',
              style: rank === 0 ? {} : { opacity: 0.72 }
            }, [
              el('div', { class: 'speech', style: { background: 'var(--surface-3)' } }, [
                el('span', { class: 'who', text: 'Vous' }), el('span', { text: c.anamnese[i].q })
              ]),
              el('div', { class: 'speech' }, [
                el('span', { class: 'who', text: c.name }), el('span', { text: '« ' + c.anamnese[i].a + ' »' })
              ])
            ]);
            dialogue.appendChild(pair);
          });
        }

        var qs = el('div', { class: 'flex wrap' }, c.anamnese.map(function (q, i) {
          var chip = el('span', {
            class: 'chip' + (session.asked.indexOf(i) >= 0 ? ' on' : ''), text: q.q,
            onClick: function () {
              if (session.asked.indexOf(i) >= 0) return;
              session.asked.push(i);
              chip.classList.add('on');
              redraw();
            }
          });
          return chip;
        }));

        redraw();

        return el('div', {}, [
          UI.card('Questions à poser', [
            qs,
            el('div', { class: 'btn-row mt16' }, [
              UI.btn('Tout demander', function () {
                c.anamnese.forEach(function (_, i) { if (session.asked.indexOf(i) < 0) session.asked.push(i); });
                qs.querySelectorAll('.chip').forEach(function (n) { n.classList.add('on'); });
                redraw();
              }),
              UI.btn('Passer aux examens →', function () {
                if (session.asked.length < 2) { UI.toast('Interrogez d’abord un peu le patient.'); return; }
                session.step = 'examens'; App.go('patient');
              }, 'primary')
            ])
          ]),
          UI.card('Entretien', dialogue)
        ]);
      }

      /* ---- étape 2 : examens ---- */
      function stepExamens() {
        var results = el('div');

        function redrawResults() {
          UI.clear(results);
          if (!session.done.length) {
            results.appendChild(el('p', { class: 'muted', text: 'Aucun examen réalisé pour l’instant. Choisissez-en un dans la colonne de droite.' }));
            return;
          }
          session.done.slice().reverse().forEach(function (id) {
            var t = testById(id);
            var info = c.tests[id];
            var seen = session.revealed[id];
            var rec = session.sims[id] || { opened: false, validated: false, score: 0, answers: {} };
            var items = Reading.forTest(c, id);

            results.appendChild(el('div', { class: 'card', style: { marginBottom: '10px', background: 'var(--bg-3)' } }, [
              el('div', { class: 'flex' }, [
                el('b', { text: t.ic + '  ' + t.name }),
                el('span', { class: 'spacer' }),
                seen ? simChip(id) : null,
                UI.chip(info && info.relevant ? 'Pertinent' : 'Peu contributif', info && info.relevant ? 'green' : 'amber')
              ].filter(Boolean)),

              // tant que l'examen n'est pas prescrit, son résultat reste caché
              seen
                ? el('div', { class: 'ue-cas-s selectable', style: { marginBottom: '10px' } },
                    info ? info.result : 'Examen sans particularité.')
                : el('p', { class: 'muted', style: { marginBottom: '8px' },
                    text: '⏳ ' + t.task + ' Le compte rendu s’affichera ensuite.' }),

              // l'interprétation, dérivée des valeurs cliniques du dossier
              seen && items.length
                ? el('div', {}, items.map(function (it) { return itemField(rec, it); })
                    .concat([el('div', { class: 'btn-row' }, [
                      rec.validated ? null : UI.btn('Valider mon interprétation', function () {
                        var sc = Reading.score(items, rec.answers);
                        rec.validated = true;
                        rec.score = sc.pct;
                        redrawResults(); redrawMenu();
                      }, 'sm primary'),
                      rec.validated ? el('span', { class: 'muted small',
                        text: Reading.score(items, rec.answers).ok + '/' + items.length + ' items justes' }) : null
                    ].filter(Boolean))]))
                : null,

              !seen ? el('div', { class: 'btn-row' }, [
                UI.btn('▶ Réaliser cet examen', function () {
                  revealTest(t, function () { redrawResults(); redrawMenu(); });
                }, 'sm primary')
              ]) : null
            ]));
          });
        }
        redrawResults();

        var menu = el('div');
        function redrawMenu() {
          UI.clear(menu);
          TESTS.forEach(function (t) {
            var already = session.done.indexOf(t.id) >= 0;
            var rec = session.sims[t.id];
            menu.appendChild(el('div', {
              class: 'tool-card', style: Object.assign({ marginBottom: '8px', padding: '11px 13px' }, already ? { borderColor: 'var(--accent)' } : {}),
              onClick: function () {
                if (session.done.indexOf(t.id) < 0) session.done.push(t.id);
                revealTest(t, function () { redrawResults(); redrawMenu(); });
              }
            }, [
              el('div', { class: 'flex' }, [
                el('span', { style: { fontSize: '18px' }, text: t.ic }),
                el('b', { text: t.name }),
                el('span', { class: 'spacer' }),
                rec && rec.validated ? UI.chip(rec.score + ' %', rec.score >= 70 ? 'green' : 'amber')
                  : already ? UI.chip('Prescrit', 'blue') : null
              ].filter(Boolean))
            ]));
          });
        }
        redrawMenu();

        return el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Résultats des examens', results),
            el('div', { class: 'btn-row' }, [
              UI.btn('← Revenir à l’anamnèse', function () { session.step = 'anamnese'; App.go('patient'); }),
              UI.btn('Poser mon diagnostic →', function () {
                if (!session.done.length) { UI.toast('Réalisez au moins un examen.'); return; }
                session.step = 'diagnostic'; App.go('patient');
              }, 'primary')
            ])
          ]),
          UI.card('Prescrire un examen', [
            menu,
            UI.note('Prescrire un examen, c’est le <b>faire</b> : son compte rendu s’ouvre, rédigé comme au dossier. ' +
              'Reste le plus difficile — <b>l’interpréter</b>. Vos réponses comptent dans le bilan final, ' +
              'et prescrire un examen inutile vous coûte des points.')
          ])
        ]);
      }

      /* ---- étape 3 : diagnostic ---- */
      function stepDiagnostic() {
        var opts = el('div');
        c.diagnosis.options.forEach(function (o, i) {
          opts.appendChild(el('div', {
            class: 'q-opt' + (session.diagnosis === i ? ' sel' : ''),
            onClick: function () {
              session.diagnosis = i;
              opts.querySelectorAll('.q-opt').forEach(function (n, j) { n.classList.toggle('sel', j === i); });
            }
          }, [
            el('span', { class: 'mark', text: String.fromCharCode(65 + i) }),
            el('span', { text: o })
          ]));
        });
        return UI.card('Votre diagnostic', [
          opts,
          el('div', { class: 'btn-row mt16' }, [
            UI.btn('← Retour aux examens', function () { session.step = 'examens'; App.go('patient'); }),
            UI.btn('Conduite à tenir →', function () {
              if (session.diagnosis === null) { UI.toast('Choisissez un diagnostic.'); return; }
              session.step = 'cat'; App.go('patient');
            }, 'primary')
          ])
        ]);
      }

      /* ---- étape 4 : conduite à tenir ---- */
      function stepCAT() {
        var opts = el('div');
        c.management.options.forEach(function (o, i) {
          opts.appendChild(el('div', {
            class: 'q-opt' + (session.management.indexOf(i) >= 0 ? ' sel' : ''),
            onClick: function () {
              var k = session.management.indexOf(i);
              if (k >= 0) session.management.splice(k, 1); else session.management.push(i);
              opts.querySelectorAll('.q-opt').forEach(function (n, j) {
                var on = session.management.indexOf(j) >= 0;
                n.classList.toggle('sel', on);
                n.querySelector('.mark').textContent = on ? '✓' : '';
              });
            }
          }, [
            el('span', { class: 'mark', text: session.management.indexOf(i) >= 0 ? '✓' : '' }),
            el('span', { text: o })
          ]));
        });
        return UI.card('Conduite à tenir (plusieurs réponses possibles)', [
          opts,
          el('div', { class: 'btn-row mt16' }, [
            UI.btn('← Retour au diagnostic', function () { session.step = 'diagnostic'; App.go('patient'); }),
            UI.btn('Terminer la consultation', function () {
              session.step = 'debrief'; session.finished = true; App.go('patient');
            }, 'primary')
          ])
        ]);
      }

      /* ---- étape 5 : débriefing ---- */
      function stepDebrief() {
        var relevant = Object.keys(c.tests).filter(function (k) { return c.tests[k].relevant; });
        var chosenRel = session.done.filter(function (k) { return c.tests[k] && c.tests[k].relevant; });
        var chosenIrr = session.done.filter(function (k) { return !c.tests[k] || !c.tests[k].relevant; });
        var missed = relevant.filter(function (k) { return session.done.indexOf(k) < 0; });

        var anamScore = Math.min(10, session.asked.length * 2.5);
        var testScore = Math.max(0, 25 * (chosenRel.length / Math.max(1, relevant.length)) - chosenIrr.length * 4);
        var dxOk = session.diagnosis === c.diagnosis.correct;
        var dxScore = dxOk ? 35 : 0;
        var good = c.management.correct;
        var hit = session.management.filter(function (i) { return good.indexOf(i) >= 0; }).length;
        var bad = session.management.filter(function (i) { return good.indexOf(i) < 0; }).length;
        var catScore = Math.max(0, 30 * (hit / good.length) - bad * 8);
        // les interprétations validées valent jusqu'à 5 points de bonus
        var tech = techScore(session);
        var techBonus = tech ? Math.round((tech.avg / 100) * 5) : 0;
        var total = Math.round(Math.max(0, Math.min(100, anamScore + testScore + dxScore + catScore + techBonus)));

        if (session.score === null) {
          session.score = total;
          Store.recordCase(c.id, total);
        }

        function nameOf(id) {
          var t = TESTS.filter(function (x) { return x.id === id; })[0];
          return t ? t.name : id;
        }

        return el('div', {}, [
          UI.card('Résultat de la consultation', [
            el('div', { class: 'grid g4' }, [
              UI.stat(total + ' %', 'Score global', total >= 75 ? 'var(--green)' : total >= 50 ? 'var(--amber)' : 'var(--red)'),
              UI.stat(Math.round(anamScore) + '/10', 'Anamnèse'),
              UI.stat(Math.round(testScore) + '/25', 'Choix des examens'),
              UI.stat((dxOk ? 35 : 0) + '/35', 'Diagnostic', dxOk ? 'var(--green)' : 'var(--red)')
            ]),
            el('div', { class: 'grid g3 mt16' }, [
              UI.stat(Math.round(catScore) + '/30', 'Conduite à tenir'),
              UI.stat('+' + techBonus + '/5', 'Interprétation', techBonus >= 4 ? 'var(--green)' : techBonus ? 'var(--amber)' : 'var(--txt-3)'),
              UI.stat(session.done.length, 'Examens prescrits')
            ])
          ]),

          UI.card('Interprétation des examens', [
            tech
              ? UI.table(['Examen', 'Interprété', 'Note'], session.done
                  .filter(function (id, i, arr) { return arr.indexOf(id) === i; })
                  .map(function (id) {
                    var r = session.sims[id];
                    return [
                      (testById(id) || { name: id }).name,
                      !r || !r.opened ? 'Non prescrit' : r.validated ? 'Oui, validé' : 'Lu sans conclure',
                      r && r.validated
                        ? el('span', { style: { color: r.score >= 70 ? 'var(--green)' : r.score >= 45 ? 'var(--amber)' : 'var(--red)', fontWeight: '700' }, text: r.score + ' %' })
                        : '—'
                    ];
                  }))
              : UI.empty('🔬', 'Vous n’avez interprété aucun examen de ce patient.<br>Un compte rendu lu sans conclusion validée ne rapporte pas de points.'),
            tech
              ? UI.note('Moyenne d’interprétation <b>' + tech.avg + ' %</b> sur <b>' + tech.n + ' examen' + (tech.n > 1 ? 's' : '') +
                  '</b> conclu' + (tech.n > 1 ? 's' : '') + ' → <b>+' + techBonus + ' point' + (techBonus > 1 ? 's' : '') + '</b> sur la note de consultation. ' +
                  'Prescrire le bon examen ne sert à rien si son compte rendu est mal lu.')
              : null
          ].filter(Boolean)),
          UI.card('Diagnostic', [
            el('p', { html: (dxOk ? '<span style="color:var(--green)">✔ Exact.</span> ' : '<span style="color:var(--red)">✘ Votre réponse : ' +
              c.diagnosis.options[session.diagnosis] + '</span><br>') + '<b>Réponse attendue : ' + c.diagnosis.options[c.diagnosis.correct] + '</b>' }),
            el('p', { class: 'selectable', text: c.diagnosis.exp })
          ]),
          UI.card('Conduite à tenir', [
            el('div', {}, c.management.options.map(function (o, i) {
              var isGood = good.indexOf(i) >= 0;
              var picked = session.management.indexOf(i) >= 0;
              return el('div', {
                class: 'q-opt locked ' + (isGood ? 'right' : picked ? 'wrong' : '')
              }, [
                el('span', { class: 'mark', text: isGood ? '✓' : picked ? '✗' : '' }),
                el('span', { text: o })
              ]);
            })),
            el('p', { class: 'selectable mt16', text: c.management.exp })
          ]),
          UI.card('Choix des examens', [
            el('div', { class: 'grid g3' }, [
              el('div', {}, [
                el('h3', { text: '✔ Pertinents réalisés' }),
                chosenRel.length ? el('ul', {}, chosenRel.map(function (k) { return el('li', { text: nameOf(k) }); }))
                  : el('p', { class: 'muted', text: 'Aucun.' })
              ]),
              el('div', {}, [
                el('h3', { text: '⚠ Pertinents oubliés' }),
                missed.length ? el('ul', {}, missed.map(function (k) {
                  return el('li', {}, [el('b', { text: nameOf(k) }), el('span', { text: ' — ' + c.tests[k].result })]);
                })) : el('p', { class: 'muted', text: 'Aucun. Bilan complet.' })
              ]),
              el('div', {}, [
                el('h3', { text: '✗ Non contributifs' }),
                chosenIrr.length ? el('ul', {}, chosenIrr.map(function (k) { return el('li', { text: nameOf(k) }); }))
                  : el('p', { class: 'muted', text: 'Aucun examen inutile. Bravo.' })
              ])
            ])
          ]),
          UI.card('Compte rendu type', [
            el('pre', { class: 'selectable mono small', style: { whiteSpace: 'pre-wrap', background: 'var(--bg-3)', padding: '14px', borderRadius: '8px' },
              text: buildReport(c, session) }),
            el('div', { class: 'btn-row mt16' }, [
              UI.btn('📋 Copier le compte rendu', function () {
                UI.copy(buildReport(c, session), 'Compte rendu copié — collez-le dans vos notes.');
              }),
              UI.btn('💾 Enregistrer en .txt', function () {
                var slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                UI.download('bilan-' + slug + '-' + new Date().toISOString().slice(0, 10) + '.txt', buildReport(c, session));
              })
            ])
          ], { right: el('span', { class: 'muted small', text: 'À reprendre dans vos comptes rendus de stage' }) }),
          el('div', { class: 'btn-row' }, [
            UI.btn('Refaire ce patient', function () { session = newSession(c); App.go('patient'); }),
            c.generated ? UI.btn('🎲 Un autre patient inédit', function () { M.patient.startRandom(); App.go('patient'); }, 'primary') : null,
            UI.btn('Choisir un autre patient', function () { session = null; App.go('patient'); }, c.generated ? '' : 'primary')
          ].filter(Boolean))
        ]);
      }

      function buildReport(c, sess) {
        var lines = [];
        lines.push('BILAN ORTHOPTIQUE — ' + c.name + ', ' + c.age + ' ans');
        if (c.job) lines.push('Profession / scolarité : ' + c.job);
        lines.push('Date : ' + new Date().toLocaleDateString('fr-FR'));
        lines.push('Motif : ' + c.motif);
        lines.push('');
        if (sess.asked && sess.asked.length) {
          lines.push('ANAMNÈSE');
          sess.asked.forEach(function (i) {
            var a = c.anamnese[i].a;
            // certaines réponses portent déjà leurs guillemets (« Le parent : … »)
            lines.push('  · ' + c.anamnese[i].q + ' — ' + (a.indexOf('«') >= 0 ? a : '« ' + a + ' »'));
          });
          lines.push('');
        }
        lines.push('EXAMENS RÉALISÉS');
        sess.done.forEach(function (id) {
          var t = testById(id);
          var r = sess.sims && sess.sims[id];
          lines.push('  · ' + (t ? t.name : id) + ' : ' + (c.tests[id] ? c.tests[id].result : '—') +
            (r && r.validated ? '   [pratiqué par l’étudiant — ' + r.score + ' %]' : ''));
        });
        lines.push('');
        lines.push('CONCLUSION : ' + c.diagnosis.options[c.diagnosis.correct]);
        lines.push('  ' + c.diagnosis.exp);
        lines.push('');
        lines.push('PROPOSITION :');
        c.management.correct.forEach(function (i) { lines.push('  · ' + c.management.options[i]); });
        if (sess.score !== null && sess.score !== undefined) {
          lines.push('');
          lines.push('— Exercice OrthoStudent, score ' + sess.score + ' %. Document pédagogique, patient simulé. —');
        }
        return lines.join('\n');
      }

      if (session.step === 'anamnese') body.appendChild(stepAnamnese());
      else if (session.step === 'examens') body.appendChild(stepExamens());
      else if (session.step === 'diagnostic') body.appendChild(stepDiagnostic());
      else if (session.step === 'cat') body.appendChild(stepCAT());
      else body.appendChild(stepDebrief());

      return UI.page({
        crumb: 'Mode patient',
        title: 'Consultation — ' + c.name,
        subtitle: 'Suivez le déroulé d’un vrai bilan : chaque examen prescrit livre son compte rendu, calculé sur ce dossier, et vous l’interprétez.'
      }, [timeline, header, body]);
    }
  };
})();
