/* ============================================================
   Mode patient — consultation complète simulée
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  /* `task` : ce que l'étudiant doit obtenir dans le simulateur. C'est ce
     texte qui s'affiche en bandeau de la fenêtre — un examen prescrit est
     une question posée, pas un bouton à cliquer. */
  var TESTS = [
    { id: 'acuity', name: 'Acuité visuelle', ic: '🔠', mod: 'acuity',
      task: 'Mesurez l’acuité de l’œil le plus faible, de loin, et notez la ligne atteinte.' },
    { id: 'phoropter', name: 'Réfraction (phoroptère)', ic: '🔭', mod: 'phoropter',
      task: 'Faites la réfraction subjective des deux yeux, puis validez.' },
    { id: 'skiascopy', name: 'Skiascopie (réfraction objective)', ic: '🔦', mod: 'skiascopy',
      task: 'Neutralisez deux méridiens par œil, retranchez le verre de travail, puis validez.' },
    { id: 'covertest', name: 'Cover test', ic: '👁', mod: 'covertest',
      task: 'Cover test unilatéral puis alterné, de loin et de près : nature et amplitude de la déviation.' },
    { id: 'prism', name: 'Mesure au prisme', ic: '🔺', mod: 'prism',
      task: 'Neutralisez la déviation à la barre de prismes et donnez l’angle.' },
    { id: 'motility', name: 'Motilité (9 positions)', ic: '🔄', mod: 'motility',
      task: 'Explorez les 9 positions du regard et identifiez le muscle déficitaire.' },
    { id: 'lancaster', name: 'Test de Lancaster', ic: '🟥', mod: 'lancaster',
      task: 'Relevez le schéma des deux yeux et concluez sur le muscle atteint.' },
    { id: 'binocular', name: 'Vision binoculaire (Worth, fusion, stéréo)', ic: '🔗', mod: 'binocular',
      task: 'Worth, Maddox, amplitudes de fusion et stéréoscopie : faites le bilan sensoriel.' },
    { id: 'ppc', name: 'PPC & convergence', ic: '🎯', mod: 'ppc',
      task: 'Approchez la cible et notez le point de rupture puis de recouvrement.' },
    { id: 'fundus', name: 'Fond d’œil', ic: '🔴', mod: 'fundus',
      task: 'Examinez les deux fonds d’œil, estimez le C/D et concluez.' },
    { id: 'colorvision', name: 'Vision des couleurs', ic: '🎨', mod: 'colorvision',
      task: 'Faites lire les planches et concluez sur l’axe de la dyschromatopsie.' },
    { id: 'fields', name: 'Champ visuel / Amsler', ic: '🗺', mod: 'fields',
      task: 'Analysez le relevé des deux yeux et la grille d’Amsler, puis concluez.' }
  ];

  /* La skiascopie n'est pas prescriptible séparément : elle double la
     réfraction et s'ouvre depuis la carte du phoroptère. */
  var PRESCRIBABLE = TESTS.filter(function (t) { return t.id !== 'skiascopy'; });

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

  /* Moyenne des gestes techniques réellement réalisés (0 si aucun) */
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
    id: 'patient', title: 'Mode patient', icon: '🩺', group: 'Simulateurs',
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
          crumb: 'Simulateurs',
          title: 'Mode patient',
          subtitle: 'Interrogez le patient, choisissez les examens pertinents — ils ouvrent les simulateurs <b>réglés sur son dossier</b> — ' +
                    'puis posez votre diagnostic et votre conduite à tenir.'
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
            UI.note('<b>Les examens se font vraiment.</b> Prescrire ouvre le simulateur réglé sur ce patient, avec la consigne ; ' +
              'le compte rendu n’apparaît qu’ensuite. La moyenne de vos gestes techniques rapporte jusqu’à <b>5 points</b> sur la note finale.')
          ])
        ]);
      }

      /* ---------- consultation en cours ---------- */
      var c = resolveCase();
      if (!c) { session = null; return M.patient.render({}); }

      /* Ouvre le simulateur sur le dossier, avec la consigne, et récupère
         la note obtenue à la fermeture : ce que l'étudiant fait dans le
         simulateur compte dans la consultation. */
      function openSim(t, after) {
        var before = (Store.score(t.mod) || {}).at || 0;
        var rec = session.sims[t.id] || { opened: false, validated: false, score: 0 };
        rec.opened = true;
        session.sims[t.id] = rec;

        App.closeModule._after = function () {
          var sc = Store.score(t.mod);
          if (sc && sc.at > before) { rec.validated = true; rec.score = sc.last; }
          session.revealed[t.id] = true;
          if (after) after();
        };

        App.openModule(t.mod, { sim: c.sim, fromCase: c.id }, {
          subtitle: 'Dossier de ' + c.name + ', ' + c.age + ' ans — ' + t.name,
          banner: '🩺 <b>' + c.name + ', ' + c.age + ' ans</b> — ' + t.task +
                  ' Validez dans le simulateur : votre note est reprise dans le bilan. ' +
                  'Fermez ensuite avec la croix (ou Échap) pour lire le compte rendu.'
        });
      }

      /* Étiquette de l'état d'un examen prescrit */
      function simChip(id) {
        var r = session.sims[id];
        if (!r || !r.opened) return UI.chip('Compte rendu lu', '');
        if (!r.validated) return UI.chip('Ouvert, non validé', 'amber');
        return UI.chip('Réalisé par vous — ' + r.score + ' %', r.score >= 70 ? 'green' : r.score >= 45 ? 'amber' : 'red');
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
            var rec = session.sims[id];

            results.appendChild(el('div', { class: 'card', style: { marginBottom: '10px', background: 'var(--bg-3)' } }, [
              el('div', { class: 'flex' }, [
                el('b', { text: t.ic + '  ' + t.name }),
                el('span', { class: 'spacer' }),
                seen ? simChip(id) : null,
                UI.chip(info && info.relevant ? 'Pertinent' : 'Peu contributif', info && info.relevant ? 'green' : 'amber')
              ].filter(Boolean)),

              // tant que l'examen n'est pas fait, son résultat reste caché :
              // c'est le geste qui donne le compte rendu, pas la prescription
              seen
                ? el('p', { class: 'selectable', style: { marginBottom: '8px' }, text: info ? info.result : 'Examen sans particularité.' })
                : el('p', { class: 'muted', style: { marginBottom: '8px' },
                    text: '⏳ ' + t.task + ' Le compte rendu s’affichera ensuite.' }),

              el('div', { class: 'btn-row' }, [
                UI.btn(rec && rec.opened ? '▶ Refaire ce test' : '▶ Réaliser ce test', function () {
                  openSim(t, function () { redrawResults(); redrawMenu(); });
                }, rec && rec.validated ? 'sm' : 'sm primary'),
                seen ? null : UI.btn('Lire le compte rendu sans manipuler', function () {
                  session.revealed[id] = true;
                  redrawResults();
                }, 'sm ghost'),
                // la réfraction du dossier alimente aussi la skiascopie : même patient, mesure objective
                t.id === 'phoropter' && c.sim && c.sim.refraction
                  ? UI.btn('🔦 Skiascopie sur ce patient', function () {
                      openSim(testById('skiascopy'), function () { redrawResults(); });
                    }, 'sm')
                  : null,
                session.sims.skiascopy && t.id === 'phoropter'
                  ? el('span', { class: 'muted small', text: 'Skiascopie : ' +
                      (session.sims.skiascopy.validated ? session.sims.skiascopy.score + ' %' : 'ouverte, non validée') })
                  : null
              ].filter(Boolean))
            ]));
          });
        }
        redrawResults();

        var menu = el('div');
        function redrawMenu() {
          UI.clear(menu);
          PRESCRIBABLE.forEach(function (t) {
            var already = session.done.indexOf(t.id) >= 0;
            var rec = session.sims[t.id];
            menu.appendChild(el('div', {
              class: 'tool-card', style: Object.assign({ marginBottom: '8px', padding: '11px 13px' }, already ? { borderColor: 'var(--accent)' } : {}),
              onClick: function () {
                if (session.done.indexOf(t.id) < 0) session.done.push(t.id);
                redrawResults(); redrawMenu();
                openSim(t, function () { redrawResults(); redrawMenu(); });
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
            UI.note('Prescrire un examen, c’est le <b>faire</b> : le simulateur s’ouvre réglé sur ce patient, avec la consigne. ' +
              'Le compte rendu n’apparaît qu’une fois l’examen réalisé, et la note du simulateur compte dans le bilan final.')
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
        // les gestes techniques réellement réalisés valent jusqu'à 5 points de bonus
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
              UI.stat('+' + techBonus + '/5', 'Gestes techniques', techBonus >= 4 ? 'var(--green)' : techBonus ? 'var(--amber)' : 'var(--txt-3)'),
              UI.stat(session.done.length, 'Examens prescrits')
            ])
          ]),

          UI.card('Gestes techniques', [
            tech
              ? UI.table(['Examen', 'Réalisé', 'Note'], session.done.concat(session.sims.skiascopy ? ['skiascopy'] : [])
                  .filter(function (id, i, arr) { return arr.indexOf(id) === i; })
                  .map(function (id) {
                    var r = session.sims[id];
                    return [
                      (testById(id) || { name: id }).name,
                      !r || !r.opened ? 'Non — compte rendu lu' : r.validated ? 'Oui, validé' : 'Ouvert sans valider',
                      r && r.validated
                        ? el('span', { style: { color: r.score >= 70 ? 'var(--green)' : r.score >= 45 ? 'var(--amber)' : 'var(--red)', fontWeight: '700' }, text: r.score + ' %' })
                        : '—'
                    ];
                  }))
              : UI.empty('🔬', 'Vous n’avez réalisé aucun examen vous-même sur ce patient.<br>Les comptes rendus lus sans manipuler ne rapportent pas de points de technique.'),
            tech
              ? UI.note('Moyenne technique <b>' + tech.avg + ' %</b> sur <b>' + tech.n + ' examen' + (tech.n > 1 ? 's' : '') +
                  '</b> réellement pratiqué' + (tech.n > 1 ? 's' : '') + ' → <b>+' + techBonus + ' point' + (techBonus > 1 ? 's' : '') + '</b> sur la note de consultation. ' +
                  'Un bilan juste sur le papier ne vaut rien si le geste ne suit pas.')
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
        subtitle: 'Suivez le déroulé d’un vrai bilan. Les simulateurs s’ouvrent par-dessus la consultation, réglés sur ce dossier.'
      }, [timeline, header, body]);
    }
  };
})();
