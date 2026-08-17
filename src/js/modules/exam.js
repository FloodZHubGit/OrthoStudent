/* ============================================================
   Examen blanc — épreuve chronométrée à postes
   ------------------------------------------------------------
   Trois natures de postes s'enchaînent sous un même chronomètre :
     · QCM        — une question de la banque, sans correction avant la fin
     · Calcul     — un énoncé chiffré tiré au sort, réponse numérique tolérancée
     · Simulation — un poste à réaliser dans le simulateur, noté par lui
   La session vit dans une variable de module : on peut quitter l'écran
   et y revenir, le chronomètre continue de tourner.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;
  var A = Optics.Acuity, P = Optics.Prism, R = Optics.Refraction, B = Optics.Binocular;

  var session = null;

  function rnd(a, b, step) {
    var n = Math.floor(Math.random() * ((b - a) / step + 1));
    return Math.round((a + n * step) * 100) / 100;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }

  /* ---------------- Générateur d'énoncés chiffrés ---------------- */
  var CALC_GENS = [
    function () {
      var t = pick([1, 1.5, 2, 3, 4, 5, 6, 8]);
      return { q: 'Convertissez une acuité de ' + t + '/10 en logMAR.', unit: 'logMAR', tol: 0.03,
        a: A.decToLogMAR(t / 10), exp: 'logMAR = −log₁₀(décimal). ' + t + '/10 = ' + (t / 10) + ' → ' + A.decToLogMAR(t / 10).toFixed(2) + '.' };
    },
    function () {
      var d = rnd(4, 40, 2);
      return { q: 'À combien de degrés correspond une déviation de ' + d + ' Δ ?', unit: '°', tol: 0.25,
        a: P.dptToDeg(d), exp: 'θ = arctan(Δ/100) = arctan(' + (d / 100) + ') = ' + P.dptToDeg(d).toFixed(2) + '°. Repère : 1 Δ ≈ 0,57°.' };
    },
    function () {
      var pw = rnd(1, 8, 0.5), mm = rnd(1, 6, 0.5);
      return { q: 'Loi de Prentice : un verre de +' + pw.toFixed(2) + ' D décentré de ' + mm + ' mm. Effet prismatique ?', unit: 'Δ', tol: 0.15,
        a: P.prentice(pw, mm), exp: 'Δ = puissance × décentrement en cm = ' + pw + ' × ' + (mm / 10) + ' = ' + P.prentice(pw, mm).toFixed(2) + ' Δ.' };
    },
    function () {
      var mm = rnd(0.5, 3, 0.5);
      return { q: 'Test de Hirschberg : le reflet est décentré de ' + mm + ' mm. Angle de déviation en degrés ?', unit: '°', tol: 1.5,
        a: P.hirschbergMmToDeg(mm), exp: '1 mm de décentrement ≈ 7° ≈ 15 Δ, donc ' + mm + ' mm ≈ ' + P.hirschbergMmToDeg(mm) + '°.' };
    },
    function () {
      var sph = rnd(-6, 4, 0.25), cyl = -rnd(0.5, 3, 0.25), ax = pick([0, 10, 45, 90, 135, 170]);
      var t = R.transpose(sph, cyl, ax);
      return { q: 'Transposez ' + Optics.formatRx(sph, cyl, ax) + '. Quelle est la <b>sphère</b> de la forme transposée ?', unit: 'D', tol: 0.01,
        a: t.sph, exp: 'Sphère + cylindre = ' + sph + ' + (' + cyl + ') = ' + t.sph.toFixed(2) + ' ; le cylindre change de signe et l’axe tourne de 90° (→ ' + t.axis + '°).' };
    },
    function () {
      var age = pick([20, 25, 30, 35, 40, 45, 50, 55]);
      return { q: 'Amplitude d’accommodation <b>moyenne</b> attendue à ' + age + ' ans (Hofstetter) ?', unit: 'D', tol: 0.3,
        a: R.hofstetter(age).moy, exp: 'Moyenne = 18,5 − 0,3 × âge = 18,5 − ' + (0.3 * age).toFixed(1) + ' = ' + R.hofstetter(age).moy.toFixed(2) + ' D. (Max 25 − 0,4·âge, min 15 − 0,25·âge.)' };
    },
    function () {
      var sph = rnd(-8, 5, 0.25), cyl = -rnd(0.5, 4, 0.25);
      return { q: 'Équivalent sphérique de ' + Optics.formatDpt(sph) + ' (' + Optics.formatDpt(cyl) + ' cyl) ?', unit: 'D', tol: 0.01,
        a: R.sphericalEquivalent(sph, cyl), exp: 'ES = sphère + cylindre/2 = ' + sph + ' + ' + (cyl / 2) + ' = ' + R.sphericalEquivalent(sph, cyl).toFixed(2) + ' D.' };
    },
    function () {
      var cm = pick([25, 33, 40, 50]);
      return { q: 'Demande de convergence à ' + cm + ' cm pour une distance interpupillaire de 62 mm ?', unit: 'Δ', tol: 0.6,
        a: B.convergenceDemand(62, cm), exp: 'Δ = DIP(cm) × 100/distance(cm) = 6,2 × ' + (100 / cm).toFixed(2) + ' = ' + B.convergenceDemand(62, cm).toFixed(1) + ' Δ.' };
    },
    function () {
      var d = -rnd(1, 8, 0.5);
      return { q: 'Où se situe le punctum remotum d’un myope de ' + d.toFixed(2) + ' D (en cm) ?', unit: 'cm', tol: 1.5,
        a: 100 / Math.abs(d), exp: 'r = 1/|D| = ' + (1 / Math.abs(d)).toFixed(3) + ' m soit ' + (100 / Math.abs(d)).toFixed(1) + ' cm.' };
    },
    function () {
      var ph = rnd(4, 16, 2), lens = pick([1, 2, 3]);
      var withL = ph + lens * 4;
      return { q: 'AC/A par gradient : phorie de ' + ph + ' Δ sans verre, ' + withL + ' Δ avec −' + lens + ',00 D. Rapport AC/A ?', unit: 'Δ/D', tol: 0.2,
        a: B.acaGradient(withL, ph, lens), exp: 'AC/A = (phorie avec verre − phorie sans) / puissance = (' + withL + ' − ' + ph + ') / ' + lens + ' = ' + B.acaGradient(withL, ph, lens).toFixed(2) + ' Δ/D. Normale : 3 à 5.' };
    },
    function () {
      var pw = rnd(-14, -6, 0.5);
      var eff = R.vertexPower(pw, 12, 0);
      return { q: 'Un verre de ' + pw.toFixed(2) + ' D est porté à 12 mm de la cornée. Puissance équivalente en lentille de contact ?', unit: 'D', tol: 0.15,
        a: eff, exp: 'P′ = P / (1 − d·P) avec d = 0,012 m → ' + eff.toFixed(2) + ' D. En myopie forte, la lentille est moins puissante que le verre.' };
    },
    function () {
      var dec = pick([20, 30, 40, 50, 60, 80]);
      return { q: 'Une acuité de 20/' + dec + ' (notation Snellen) vaut combien en décimal ?', unit: '', tol: 0.03,
        a: 20 / dec, exp: '20/' + dec + ' = ' + (20 / dec).toFixed(2) + ' décimal, soit ' + ((20 / dec) * 10).toFixed(1) + '/10.' };
    }
  ];

  /* Chaque poste de simulation est une vraie situation clinique : on tire un
     dossier dans le générateur de cas, en choisissant un tableau qui a du
     sens pour l'examen demandé, et le simulateur est réglé dessus. */
  var SIM_TASKS = [
    { mod: 'phoropter', task: 'Faites la réfraction subjective des deux yeux, puis validez.',
      cases: ['amblyopie', 'presbytie', 'ecran', 'esoaccom'] },
    { mod: 'skiascopy', task: 'Skiascopie des deux yeux : neutralisez deux méridiens par œil, déduisez la réfraction et validez.',
      cases: ['amblyopie', 'esoaccom', 'ecran'] },
    { mod: 'covertest', task: 'Cover test unilatéral puis alterné, de loin et de près : nature et amplitude de la déviation.',
      cases: ['ic', 'esoaccom', 'xt', 'vi'] },
    { mod: 'prism', task: 'Neutralisez la déviation à la barre de prismes et donnez l’angle.',
      cases: ['esoaccom', 'xt', 'vi', 'iv'] },
    { mod: 'motility', task: 'Explorez les 9 positions du regard et identifiez le muscle déficitaire.',
      cases: ['vi', 'iv'] },
    { mod: 'lancaster', task: 'Relevez le schéma des deux yeux et concluez sur le muscle atteint.',
      cases: ['vi', 'iv'] },
    { mod: 'fundus', task: 'Examinez les deux fonds d’œil, estimez le C/D et posez votre diagnostic.',
      cases: ['dmla', 'glaucome'] },
    { mod: 'colorvision', task: 'Faites lire les planches et concluez sur l’axe de la dyschromatopsie.',
      cases: ['dmla', 'ecran'] },
    { mod: 'fields', task: 'Analysez le relevé des deux yeux et concluez.',
      cases: ['glaucome', 'dmla'] },
    { mod: 'ppc', task: 'Approchez la cible : point de rupture, puis de recouvrement.',
      cases: ['ic', 'xt'] },
    { mod: 'binocular', task: 'Bilan sensoriel : Worth, Maddox, amplitudes de fusion, stéréoscopie.',
      cases: ['ic', 'xt', 'esoaccom'] }
  ];

  /* ---------------- Construction de l'épreuve ---------------- */
  function build(cfg) {
    var stations = [];
    var nSim = cfg.sims ? Math.max(1, Math.round(cfg.n * 0.3)) : 0;
    var nCalc = Math.round((cfg.n - nSim) * 0.4);
    var nQcm = cfg.n - nSim - nCalc;

    // épreuve ciblée sur une UE : on restreint la banque à ses thèmes
    var bank = window.QUIZ;
    if (cfg.cats && cfg.cats.length) {
      var scoped = bank.filter(function (q) { return cfg.cats.indexOf(q.cat) >= 0; });
      if (scoped.length) bank = scoped;
    }
    var pool = shuffle(bank).slice(0, nQcm);
    pool.forEach(function (q) { stations.push({ type: 'qcm', q: q }); });
    for (var i = 0; i < nCalc; i++) stations.push({ type: 'calc', gen: pick(CALC_GENS)() });
    shuffle(SIM_TASKS).slice(0, nSim).forEach(function (t) {
      // un dossier complet par poste : le simulateur est réglé dessus,
      // exactement comme en mode patient
      var dossier = window.CaseGen.generate(pick(t.cases));
      stations.push({ type: 'sim', mod: t.mod, task: t.task, dossier: dossier });
    });

    return {
      stations: shuffle(stations),
      i: 0,
      answers: {},
      startedAt: Date.now(),
      endsAt: Date.now() + cfg.minutes * 60000,
      minutes: cfg.minutes,
      label: cfg.label || null,
      finished: false,
      score: null
    };
  }

  function remaining() { return Math.max(0, session.endsAt - Date.now()); }
  function mmss(ms) {
    var s = Math.round(ms / 1000);
    return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
  }

  /* Un poste n'est « traité » que s'il est vraiment renseigné : un poste de
     simulation ouvert sans validation ou un champ de calcul vide ne comptent pas. */
  function answered(idx) {
    var a = session.answers[idx], s = session.stations[idx];
    if (!a) return false;
    if (s.type === 'sim') return !!a.validated;
    if (s.type === 'calc') return a.value !== null && a.value !== undefined && !isNaN(a.value);
    return true;
  }

  /* ---------------- Notation ---------------- */
  function stationScore(idx) {
    var s = session.stations[idx], a = session.answers[idx];
    if (!a) return 0;
    if (s.type === 'qcm') return a.choice === s.q.a ? 100 : 0;
    if (s.type === 'calc') {
      if (a.value === null || a.value === undefined || isNaN(a.value)) return 0;
      var d = Math.abs(a.value - s.gen.a);
      return d <= s.gen.tol ? 100 : d <= s.gen.tol * 2.5 ? 55 : 0;
    }
    return a.score || 0;
  }

  function finish() {
    if (session.finished) return;
    session.finished = true;
    var total = session.stations.reduce(function (acc, _, i) { return acc + stationScore(i); }, 0);
    session.score = Math.round(total / session.stations.length);
    session.usedMs = Date.now() - session.startedAt;
    Store.recordScore('exam', session.score, { n: session.stations.length, minutes: session.minutes });
    App.refreshNav();
    App.go('exam');
  }

  M.exam = {
    id: 'exam', title: 'Examen blanc', icon: '⏱', group: 'Révision',
    desc: 'Épreuve chronométrée : QCM, calculs cliniques et postes de simulation',
    keywords: 'examen blanc partiel epreuve chronometre station poste ecos concours simulation calcul',

    render: function (ctx) {
      var root = el('div');
      var scope = (ctx && ctx.params) || {};

      /* ============ écran de configuration ============ */
      function setup() {
        var cfg = { n: 8, minutes: 20, sims: true, cats: scope.cats || null, label: scope.label || null };
        var sc = Store.score('exam');

        var simChip = el('span', { class: 'chip on', text: '🔦 Avec postes de simulation', onClick: function (e) {
          cfg.sims = !cfg.sims;
          e.currentTarget.classList.toggle('on', cfg.sims);
        } });

        return el('div', {}, [
          cfg.label ? UI.note('🎓 <b>Épreuve ciblée sur ' + cfg.label + '</b> — les QCM seront tirés dans les thèmes de cette UE. ' +
            'Les postes de calcul et de simulation restent transversaux.') : null,
          UI.card('Régler l’épreuve', [
            el('div', { class: 'grid g3' }, [
              UI.field('Nombre de postes', UI.select([
                { value: 6, label: '6 postes (rapide)' },
                { value: 8, label: '8 postes' },
                { value: 12, label: '12 postes' },
                { value: 16, label: '16 postes (long)' }
              ], 8, function (v) { cfg.n = parseInt(v, 10); })),
              UI.field('Durée', UI.select([
                { value: 10, label: '10 minutes' },
                { value: 20, label: '20 minutes' },
                { value: 30, label: '30 minutes' },
                { value: 45, label: '45 minutes' }
              ], 20, function (v) { cfg.minutes = parseInt(v, 10); })),
              UI.field('Contenu', simChip)
            ]),
            el('div', { class: 'btn-row mt16' }, [
              UI.btn('⏱ Commencer l’épreuve', function () {
                session = build(cfg);
                App.go('exam');
              }, 'primary')
            ]),
            UI.note('Le chronomètre tourne <b>en continu</b>, y compris pendant les postes de simulation. ' +
              'Vous pouvez circuler librement entre les postes, revenir en arrière, et terminer avant la fin du temps. ' +
              'Aucune correction n’est affichée avant la fin — comme en épreuve.')
          ]),
          UI.card('Comment sont notés les postes', UI.table(['Nature du poste', 'Notation'], [
            ['<b>QCM</b>', 'Tout ou rien : 100 ou 0'],
            ['<b>Calcul clinique</b>', 'Énoncé chiffré tiré au sort. Réponse dans la tolérance : 100. Approchante : 55. Sinon 0.'],
            ['<b>Poste de simulation</b>', 'Le simulateur donne sa propre note. Un poste ouvert mais <b>non validé</b> compte 0.']
          ])),
          sc ? UI.card('Vos épreuves passées', [
            el('div', { class: 'grid g3' }, [
              UI.stat(sc.best + ' %', 'Meilleure', sc.best >= 70 ? 'var(--green)' : 'var(--amber)'),
              UI.stat(sc.avg + ' %', 'Moyenne'),
              UI.stat(sc.attempts, 'Épreuves passées')
            ])
          ]) : null
        ].filter(Boolean));
      }

      /* ============ écran d'épreuve ============ */
      function running() {
        var wrap = el('div');
        var timerNode = el('span', { class: 'exam-timer mono' });
        var timerBar = el('i');
        var statusNode = el('span', { class: 'muted small' });
        var body = el('div');

        // le premier tick a lieu avant l'insertion dans le document :
        // on n'arrête le chronomètre qu'après avoir vu l'écran affiché
        var mounted = false;
        function tick() {
          if (root.isConnected) mounted = true;
          else if (mounted) { clearInterval(id); return; }
          var left = remaining();
          timerNode.textContent = mmss(left);
          timerNode.classList.toggle('warn', left < 120000);
          timerBar.style.width = Math.max(0, (left / (session.minutes * 60000)) * 100) + '%';
          if (left <= 0) { clearInterval(id); UI.toast('Temps écoulé — l’épreuve est corrigée.'); finish(); }
        }
        var id = setInterval(tick, 250);

        var strip = el('div', { class: 'timeline', style: { marginBottom: '4px' } });
        function drawStrip() {
          UI.clear(strip);
          var nDone = session.stations.filter(function (_, i) { return answered(i); }).length;
          statusNode.textContent = session.stations.length + ' postes · ' +
            nDone + ' traité' + (nDone > 1 ? 's' : '');
          session.stations.forEach(function (s, i) {
            var done = answered(i);
            strip.appendChild(el('span', {
              class: 'tl-step' + (i === session.i ? ' cur' : done ? ' done' : ''),
              title: s.type === 'qcm' ? 'QCM' : s.type === 'calc' ? 'Calcul' : 'Simulation',
              text: (s.type === 'qcm' ? '❓' : s.type === 'calc' ? '🧮' : '🔬') + ' ' + (i + 1),
              onClick: function () { session.i = i; drawStrip(); drawStation(); }
            }));
          });
        }

        function goTo(d) {
          session.i = Math.max(0, Math.min(session.stations.length - 1, session.i + d));
          drawStrip(); drawStation();
        }

        function drawStation() {
          UI.clear(body);
          var s = session.stations[session.i];
          var a = session.answers[session.i];
          var head = el('div', { class: 'flex', style: { marginBottom: '12px' } }, [
            UI.chip('Poste ' + (session.i + 1) + ' / ' + session.stations.length, 'blue'),
            UI.chip(s.type === 'qcm' ? 'QCM' : s.type === 'calc' ? 'Calcul clinique' : 'Simulation',
              s.type === 'sim' ? 'violet' : ''),
            el('span', { class: 'spacer' }),
            answered(session.i) ? UI.chip('Traité ✓', 'green') : UI.chip('Sans réponse', 'amber')
          ]);

          if (s.type === 'qcm') {
            var opts = el('div');
            s.q.opts.forEach(function (o, i) {
              opts.appendChild(el('div', {
                class: 'q-opt' + (a && a.choice === i ? ' sel' : ''),
                onClick: function () {
                  session.answers[session.i] = { choice: i };
                  Store.recordQuiz(s.q.id, i === s.q.a);
                  drawStrip(); drawStation();
                }
              }, [
                el('span', { class: 'mark', text: String.fromCharCode(65 + i) }),
                el('span', { text: o })
              ]));
            });
            body.appendChild(UI.card(null, [head, el('h2', { class: 'selectable', text: s.q.q }), opts,
              UI.keyhint([['A – D', 'répondre'], ['→', 'poste suivant']])]));

          } else if (s.type === 'calc') {
            var input = UI.num(a ? a.value : '', function (v) {
              session.answers[session.i] = { value: v };
              drawStrip();
            }, { step: 0.01, placeholder: 'Votre réponse' });
            body.appendChild(UI.card(null, [
              head,
              el('h2', { class: 'selectable', html: s.gen.q }),
              el('div', { style: { maxWidth: '320px' } },
                UI.field('Réponse' + (s.gen.unit ? ' (' + s.gen.unit + ')' : ''), input)),
              UI.note('Répondez en chiffres. Le séparateur décimal est le point ; une petite tolérance est admise.')
            ]));

          } else {
            var d = s.dossier;
            body.appendChild(UI.card(null, [
              head,
              el('h2', { text: (M[s.mod].icon || '') + '  ' + M[s.mod].title }),
              d ? el('div', { class: 'speech' }, [
                el('span', { class: 'who', text: d.name + ', ' + d.age + ' ans — ' + d.job }),
                el('span', { text: '« ' + d.motif + ' »' })
              ]) : null,
              el('p', { class: 'selectable', text: s.task }),
              a ? UI.note(a.validated
                    ? '<b>Poste réalisé — ' + a.score + ' %.</b> Vous pouvez le refaire : c’est la dernière validation qui compte.'
                    : '<b>Poste ouvert mais non validé.</b> Il compte 0 tant que vous n’avez pas validé dans le simulateur.',
                    a.validated && a.score >= 50 ? '' : 'warn') : null,
              el('div', { class: 'btn-row' }, [
                UI.btn('🔬 Ouvrir le poste', function () {
                  var before = (Store.score(s.mod) || {}).at || 0;
                  App.closeModule._after = function () {
                    var after = Store.score(s.mod);
                    // une validation à 0 % reste une validation : on ne peut pas
                    // se contenter de tester la note pour savoir si le poste a été fait
                    var ok = !!(after && after.at > before);
                    session.answers[session.i] = { validated: ok, score: ok ? after.last : 0 };
                    drawStrip(); drawStation();
                  };
                  App.openModule(s.mod, s.dossier ? { sim: s.dossier.sim, fromCase: s.dossier.id } : {}, {
                    subtitle: 'Poste ' + (session.i + 1) + (s.dossier ? ' — ' + s.dossier.name + ', ' + s.dossier.age + ' ans' : ''),
                    banner: '⏱ <b>Épreuve en cours, le chronomètre tourne.</b> ' +
                            (s.dossier ? '<b>' + s.dossier.name + '</b> — « ' + s.dossier.motif +' » ' : '') +
                            s.task + ' Validez dans le simulateur, puis fermez cette fenêtre.'
                  });
                }, 'primary')
              ])
            ].filter(Boolean)));
          }

          body.appendChild(el('div', { class: 'btn-row' }, [
            UI.btn('← Poste précédent', function () { goTo(-1); }),
            UI.btn('Poste suivant →', function () { goTo(1); }, 'primary'),
            el('span', { class: 'spacer' }),
            UI.btn('Terminer l’épreuve', function () {
              var left = session.stations.filter(function (_, i) { return !answered(i); }).length;
              if (left && !confirm(left + ' poste(s) sans réponse. Terminer quand même ?')) return;
              clearInterval(id);
              finish();
            }),
            UI.btn('Abandonner', function () {
              if (!confirm('Abandonner l’épreuve en cours ?')) return;
              clearInterval(id);
              session = null;
              App.go('exam');
            }, 'danger')
          ]));
        }

        UI.hotkeys(root, {
          'ArrowRight': function () { goTo(1); },
          'ArrowLeft': function () { goTo(-1); },
          'a': function () { qcmPick(0); }, 'b': function () { qcmPick(1); },
          'c': function () { qcmPick(2); }, 'd': function () { qcmPick(3); }
        });

        function qcmPick(i) {
          var s = session.stations[session.i];
          if (!s || s.type !== 'qcm' || i >= s.q.opts.length) return;
          session.answers[session.i] = { choice: i };
          Store.recordQuiz(s.q.id, i === s.q.a);
          drawStrip(); drawStation();
        }

        drawStrip();
        drawStation();
        tick();

        wrap.appendChild(el('div', { class: 'exam-bar' }, [
          el('div', { class: 'flex' }, [
            el('span', { class: 'muted small', text: 'Temps restant' }),
            timerNode,
            el('span', { class: 'spacer' }),
            statusNode
          ]),
          el('div', { class: 'bar', style: { marginTop: '8px' } }, timerBar)
        ]));
        wrap.appendChild(strip);
        wrap.appendChild(body);
        return wrap;
      }

      /* ============ écran de résultats ============ */
      function results() {
        var byType = { qcm: { n: 0, sum: 0 }, calc: { n: 0, sum: 0 }, sim: { n: 0, sum: 0 } };
        var rows = session.stations.map(function (s, i) {
          var sc = stationScore(i);
          byType[s.type].n++; byType[s.type].sum += sc;
          var label = s.type === 'qcm' ? s.q.q
                    : s.type === 'calc' ? s.gen.q.replace(/<[^>]+>/g, '')
                    : M[s.mod].title + (s.dossier ? ' — ' + s.dossier.name + ', ' + s.dossier.age + ' ans' : '');
          var mine = s.type === 'qcm'
            ? (session.answers[i] ? s.q.opts[session.answers[i].choice] : '—')
            : s.type === 'calc'
              ? (session.answers[i] && session.answers[i].value !== null ? String(session.answers[i].value) : '—')
              : (!session.answers[i] ? 'non ouvert'
                 : session.answers[i].validated ? session.answers[i].score + ' %' : 'ouvert, non validé');
          var truth = s.type === 'qcm' ? s.q.opts[s.q.a]
                    : s.type === 'calc' ? s.gen.a.toFixed(2) + (s.gen.unit ? ' ' + s.gen.unit : '')
                    : s.dossier ? s.dossier.diagnosis.options[s.dossier.diagnosis.correct]
                    : '—';
          return [
            (s.type === 'qcm' ? '❓ ' : s.type === 'calc' ? '🧮 ' : '🔬 ') + label.slice(0, 90),
            mine, truth,
            el('span', { style: { color: sc >= 100 ? 'var(--green)' : sc > 0 ? 'var(--amber)' : 'var(--red)', fontWeight: '700' }, text: sc + ' %' })
          ];
        });

        var wrong = session.stations.map(function (s, i) { return { s: s, i: i, sc: stationScore(i) }; })
          .filter(function (x) { return x.sc < 100 && x.s.type !== 'sim'; });

        function part(k, label) {
          return byType[k].n ? UI.stat(Math.round(byType[k].sum / byType[k].n) + ' %', label) : null;
        }

        return el('div', {}, [
          UI.card('Copie corrigée', [
            el('div', { class: 'grid g4' }, [
              UI.stat(session.score + ' %', 'Note globale',
                session.score >= 70 ? 'var(--green)' : session.score >= 50 ? 'var(--amber)' : 'var(--red)'),
              part('qcm', 'QCM'), part('calc', 'Calculs'), part('sim', 'Simulation')
            ].filter(Boolean)),
            el('div', { class: 'grid g3 mt16' }, [
              UI.stat(mmss(session.usedMs || 0), 'Temps utilisé'),
              UI.stat(session.minutes + ' min', 'Temps imparti'),
              UI.stat(session.stations.filter(function (_, i) { return answered(i); }).length + '/' + session.stations.length, 'Postes traités')
            ]),
            UI.note(session.score >= 75
              ? '<b>Épreuve réussie.</b> Le niveau est là, y compris sous chronomètre — c’est ce qui fait la différence le jour J.'
              : session.score >= 50
                ? '<b>Passable.</b> Regardez la répartition : si les calculs plombent la note, ce sont des automatismes à ancrer, pas des connaissances à relire.'
                : '<b>Insuffisant.</b> Reprenez d’abord les postes ratés ci-dessous, puis refaites une épreuve courte de 6 postes pour vérifier.',
              session.score >= 50 ? '' : 'warn')
          ]),

          UI.card('Détail des postes', [
            UI.table(['Poste', 'Votre réponse', 'Attendu / tableau clinique', 'Note'], rows),
            byType.sim.n ? el('p', { class: 'small muted', style: { marginTop: '10px' },
              text: 'Pour les postes de simulation, la colonne « attendu » donne le tableau clinique du patient que vous aviez devant vous.' }) : null
          ].filter(Boolean)),

          wrong.length ? UI.card('Ce qu’il faut retenir', el('div', {}, wrong.map(function (x) {
            return el('div', { class: 'card', style: { marginBottom: '10px', background: 'var(--surface-2)' } }, [
              el('b', { class: 'selectable', html: x.s.type === 'qcm' ? x.s.q.q : x.s.gen.q }),
              el('p', { class: 'small selectable', style: { margin: '6px 0 0' },
                html: x.s.type === 'qcm'
                  ? 'Réponse : <b>' + x.s.q.opts[x.s.q.a] + '</b> — ' + x.s.q.exp
                  : 'Réponse : <b>' + x.s.gen.a.toFixed(2) + (x.s.gen.unit ? ' ' + x.s.gen.unit : '') + '</b> — ' + x.s.gen.exp })
            ]);
          }))) : null,

          el('div', { class: 'btn-row' }, [
            UI.btn('⏱ Nouvelle épreuve', function () { session = null; App.go('exam'); }, 'primary'),
            UI.btn('Voir ma progression', function () { App.go('progress'); })
          ])
        ].filter(Boolean));
      }

      root.appendChild(!session ? setup() : session.finished ? results() : running());

      return UI.page({
        crumb: 'Révision',
        title: session && !session.finished ? 'Examen blanc en cours' : 'Examen blanc',
        subtitle: session && !session.finished
          ? 'Le chronomètre tourne. Circulez entre les postes comme vous le souhaitez.'
          : 'Une épreuve chronométrée qui mélange QCM, calculs cliniques tirés au sort et postes de simulation notés — ' +
            'le format le plus proche d’un partiel ou d’une station d’ECOS.'
      }, [root]);
    }
  };
})();
