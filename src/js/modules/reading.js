/* ============================================================
   Lecture de bilan — l'exercice qui remplace les simulateurs
   ------------------------------------------------------------
   On vous met un bilan orthoptique complet sous les yeux, rédigé
   comme un examinateur l'écrit. Vous l'interprétez ligne par
   ligne, puis vous concluez. C'est exactement ce qui est évalué
   en stage et en examen — et, contrairement au geste mimé à la
   souris, c'est une compétence qui se transfère.

   Deux modes :
     · Bilan complet — tout le dossier d'un coup, toutes les
       questions, une note globale. Le format de l'épreuve.
     · Examen par examen — on découvre un compte rendu à la fois
       et on l'interprète avant de passer au suivant. Le format
       de la consultation.

   Les questions viennent de core/reading.js : elles sont dérivées
   des valeurs cliniques du dossier, jamais écrites à la main.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  var ARCHETYPES = [
    ['', 'Au hasard'],
    ['insuffisance', 'Insuffisance de convergence'],
    ['esotropie', 'Ésotropie de l’enfant'],
    ['paralysie6', 'Paralysie du VI'],
    ['paralysie4', 'Paralysie du IV']
  ];

  M.reading = {
    id: 'reading', title: 'Lecture de bilan', icon: '🩻', group: 'Pratiquer',
    desc: 'Un bilan orthoptique complet à interpréter, puis à conclure',
    keywords: 'bilan lecture interpretation compte rendu cover test ppc worth stereo diagnostic raisonnement clinique',

    render: function (ctx) {
      var p = (ctx && ctx.params) || {};
      var st = {
        caseObj: null,
        mode: p.mode === 'step' ? 'step' : 'full',
        answers: {},
        openTests: {},        // testId -> true quand le compte rendu est découvert
        diagnosis: null,
        graded: false
      };

      function pick(archetype, fromCase) {
        Drill.begin('reading');
        st.caseObj = fromCase || window.CaseGen.generate(archetype || undefined);
        st.answers = {};
        st.openTests = {};
        st.diagnosis = null;
        st.graded = false;
        if (st.mode === 'full') Reading.tests(st.caseObj).forEach(function (t) { st.openTests[t.id] = true; });
        draw();
      }

      var root = el('div');

      /* ---------- le dossier ---------- */

      function dossierCard() {
        var c = st.caseObj;
        return UI.card(null, [
          el('div', { class: 'flex' }, [
            el('div', { style: { fontSize: '34px' } }, '🧑‍⚕️'),
            el('div', { style: { minWidth: 0 } }, [
              el('h2', { style: { margin: 0 }, text: c.name + ', ' + c.age + ' ans' }),
              el('div', { class: 'muted small', text: c.job || '' })
            ]),
            el('span', { class: 'spacer' }),
            UI.chip(st.mode === 'full' ? 'Bilan complet' : 'Examen par examen', 'blue')
          ]),
          el('div', { class: 'speech', style: { marginBottom: 0 } }, [
            el('span', { class: 'who', text: 'Motif de consultation' }),
            el('span', { class: 'selectable', text: c.motif })
          ]),
          c.anamnese && c.anamnese.length
            ? UI.accordion([{ title: 'Anamnèse (' + c.anamnese.length + ' réponses)', body:
                '<table class="tbl">' + c.anamnese.map(function (a) {
                  return '<tr><td class="k">' + a.q + '</td><td>' + a.a + '</td></tr>';
                }).join('') + '</table>' }])
            : null
        ].filter(Boolean));
      }

      /* ---------- un examen : son compte rendu, puis ses questions ---------- */

      function testBlock(t) {
        var c = st.caseObj;
        var info = c.tests[t.id] || {};
        var items = Reading.forTest(c, t.id);
        var open = !!st.openTests[t.id];
        var box = el('div', { class: 'card', style: { marginBottom: '12px' } });

        box.appendChild(el('div', { class: 'flex', style: { marginBottom: '10px' } }, [
          el('b', { style: { fontSize: '14px' }, text: t.ic + '  ' + t.name }),
          el('span', { class: 'spacer' }),
          open ? UI.chip(info.relevant ? 'Contributif' : 'Peu contributif', info.relevant ? 'green' : '') : null,
          items.length ? UI.chip(items.length + ' question' + (items.length > 1 ? 's' : '')) : null
        ].filter(Boolean)));

        if (!open) {
          box.appendChild(el('p', { class: 'muted', style: { marginBottom: '10px' },
            text: 'Compte rendu non encore consulté.' }));
          box.appendChild(UI.btn('Lire le compte rendu', function () {
            st.openTests[t.id] = true;
            draw();
          }, 'sm primary'));
          return box;
        }

        /* le compte rendu, tel qu'il serait écrit au dossier */
        box.appendChild(el('div', { class: 'ue-cas-s selectable', style: { marginBottom: items.length ? '14px' : '0' } },
          info.result || 'Examen sans particularité.'));

        items.forEach(function (it) { box.appendChild(itemField(it)); });
        return box;
      }

      /* ---------- un item : question + saisie + correction ---------- */

      function itemField(it) {
        var wrap = el('div', { class: 'read-item' });
        wrap.appendChild(el('div', { class: 'ri-q', html: it.label }));

        if (it.type === 'choice') {
          var opts = el('div', { class: 'ri-opts' });
          it.options.forEach(function (o, i) {
            var chosen = st.answers[it.id] === i;
            var cls = 'q-opt';
            if (st.graded) {
              if (i === it.answer) cls += ' right';
              else if (chosen) cls += ' wrong';
              cls += ' locked';
            } else if (chosen) cls += ' sel';
            opts.appendChild(el('div', {
              class: cls,
              onClick: st.graded ? null : function () {
                st.answers[it.id] = i;
                opts.querySelectorAll('.q-opt').forEach(function (n, j) { n.classList.toggle('sel', j === i); });
              }
            }, [
              el('span', { class: 'mark', text: String.fromCharCode(65 + i) }),
              el('span', { text: o })
            ]));
          });
          wrap.appendChild(opts);
        } else {
          var input = UI.num(st.answers[it.id] === undefined ? '' : st.answers[it.id],
            function (v) { st.answers[it.id] = v; }, { step: 1, disabled: st.graded || null });
          input.style.maxWidth = '160px';
          wrap.appendChild(el('div', { class: 'flex', style: { gap: '9px' } }, [
            input,
            el('span', { class: 'muted small', text: it.unit || '' }),
            st.graded
              ? el('span', {
                  class: 'chip static ' + (Reading.check(it, st.answers[it.id]).ok ? 'green' : 'red'),
                  text: Reading.check(it, st.answers[it.id]).ok
                    ? '✔ juste'
                    : '✘ ' + it.answer + ' ' + (it.unit || '') + ' (± ' + it.tol + ')'
                })
              : null
          ].filter(Boolean)));
        }

        if (st.graded && it.why) wrap.appendChild(UI.note(it.why));
        return wrap;
      }

      /* ---------- conclusion ---------- */

      function diagnosisCard() {
        var c = st.caseObj;
        if (!c.diagnosis) return null;
        var opts = el('div');
        c.diagnosis.options.forEach(function (o, i) {
          var chosen = st.diagnosis === i;
          var cls = 'q-opt';
          if (st.graded) {
            if (i === c.diagnosis.correct) cls += ' right';
            else if (chosen) cls += ' wrong';
            cls += ' locked';
          } else if (chosen) cls += ' sel';
          opts.appendChild(el('div', {
            class: cls,
            onClick: st.graded ? null : function () {
              st.diagnosis = i;
              opts.querySelectorAll('.q-opt').forEach(function (n, j) { n.classList.toggle('sel', j === i); });
            }
          }, [
            el('span', { class: 'mark', text: String.fromCharCode(65 + i) }),
            el('span', { text: o })
          ]));
        });
        return UI.card('Votre conclusion diagnostique', [
          el('p', { class: 'muted small mt0', text: 'Le diagnostic compte pour la moitié de la note : une lecture juste qui ne conclut pas ne sert à rien.' }),
          opts,
          st.graded && c.diagnosis.exp ? UI.note(c.diagnosis.exp) : null
        ].filter(Boolean));
      }

      /* ---------- notation ---------- */

      function validate() {
        var c = st.caseObj;
        var items = Reading.all(c).filter(function (it) { return st.openTests[it.test]; });
        var s = Reading.score(items, st.answers);
        var dxOk = c.diagnosis ? st.diagnosis === c.diagnosis.correct : true;

        /* moitié lecture, moitié conclusion — sauf si le dossier n'a pas de
           question de diagnostic, auquel cas la lecture fait tout */
        var pct = c.diagnosis
          ? Math.round(s.pct * 0.5 + (dxOk ? 50 : 0))
          : s.pct;

        var res = Drill.grade('reading', pct, { n: s.n, mode: st.mode });
        st.graded = true;

        var rows = items.map(function (it) {
          var chk = Reading.check(it, st.answers[it.id]);
          var mine = it.type === 'choice'
            ? (st.answers[it.id] === undefined ? '—' : it.options[st.answers[it.id]])
            : (st.answers[it.id] === undefined || st.answers[it.id] === null ? '—' : st.answers[it.id] + ' ' + (it.unit || ''));
          return [Reading.testById(it.test).name + ' — ' + it.label, mine, chk.expected, chk.ok];
        });
        if (c.diagnosis) {
          rows.unshift(['Diagnostic',
            st.diagnosis === null ? '—' : c.diagnosis.options[st.diagnosis],
            c.diagnosis.options[c.diagnosis.correct], dxOk]);
        }

        var missed = items.filter(function (it) { return !Reading.check(it, st.answers[it.id]).ok; });
        var tip = !dxOk
          ? 'Reprenez le bilan à l’envers : partez du diagnostic attendu et demandez-vous quelle ligne du compte rendu l’imposait. C’est ce chemin-là qu’on vous demandera de refaire à l’oral.'
          : missed.length
            ? 'Les valeurs se lisent, elles ne s’estiment pas. Relisez les lignes ratées en vous demandant à chaque fois : « quel seuil sépare le normal du pathologique ici ? »'
            : null;

        draw(Drill.debrief({
          score: res.score, recorded: res.recorded, why: res.why,
          rows: rows,
          explain: (c.diagnosis && c.diagnosis.exp ? c.diagnosis.exp + ' ' : '') +
                   'Lecture : ' + s.ok + '/' + s.n + ' items justes.',
          tip: tip,
          actions: [
            UI.btn('🎲  Nouveau dossier', function () { pick(); }, 'primary'),
            UI.btn('Relire ce bilan', function () { draw(); })
          ]
        }));
      }

      /* ---------- assemblage ---------- */

      function draw(debriefNode) {
        UI.clear(root);
        var c = st.caseObj;
        if (!c) { pick(); return; }

        var tests = Reading.tests(c);
        var opened = tests.filter(function (t) { return st.openTests[t.id]; });

        var left = el('div', {}, [dossierCard()].concat(
          tests.map(function (t) { return testBlock(t); })
        ));

        var answered = Reading.all(c)
          .filter(function (it) { return st.openTests[it.test]; })
          .filter(function (it) { return st.answers[it.id] !== undefined && st.answers[it.id] !== null && st.answers[it.id] !== ''; }).length;
        var total = Reading.all(c).filter(function (it) { return st.openTests[it.test]; }).length;

        var right = el('div', {}, [
          UI.card('Où vous en êtes', [
            el('div', { class: 'grid g2' }, [
              UI.stat(opened.length + '/' + tests.length, 'Comptes rendus lus'),
              UI.stat(answered + '/' + total, 'Items renseignés')
            ]),
            UI.bar(total ? (answered / total) * 100 : 0),
            el('div', { class: 'btn-row', style: { marginTop: '12px' } }, [
              st.graded ? null : UI.btn('Valider ma lecture', validate, 'primary'),
              st.graded ? null : UI.btn('Voir les réponses', function () {
                Drill.peek('reading'); validate();
              }),
              UI.btn('🎲  Nouveau dossier', function () { pick(); })
            ].filter(Boolean))
          ]),
          diagnosisCard(),
          debriefNode || null
        ].filter(Boolean));

        root.appendChild(el('div', { class: 'sim-layout' }, [left, right]));
      }

      pick(p.archetype, p.caseObj);

      var modeRow = el('div', { class: 'btn-row', style: { marginBottom: '14px' } }, [
        el('span', { class: 'row-lbl', text: 'Format' }),
        /* changer de format garde le patient : c'est la présentation du même
           dossier qui change, et voir le sien disparaître au moment où l'on
           bascule est la meilleure façon de ne plus jamais toucher au réglage */
        UI.select([
          { value: 'full', label: 'Bilan complet d’un coup' },
          { value: 'step', label: 'Examen par examen' }
        ], st.mode, function (v) { st.mode = v; pick(null, st.caseObj); }),
        el('span', { class: 'row-lbl', text: 'Tableau' }),
        UI.select(ARCHETYPES.map(function (a) { return { value: a[0], label: a[1] }; }), '', function (v) { pick(v); })
      ]);

      return UI.page({
        crumb: 'Pratiquer',
        title: 'Lecture de bilan',
        subtitle: 'Un dossier complet, ses comptes rendus rédigés, et la seule question qui compte : <b>qu’en concluez-vous ?</b>'
      }, [
        Drill.brief({
          icon: '🩻',
          task: 'Lisez chaque compte rendu, répondez aux questions d’interprétation, puis posez votre diagnostic.',
          scoring: 'moitié lecture (chaque item compte pareil), moitié diagnostic. Afficher les réponses annule la note.'
        }),
        modeRow,
        root,
        Drill.history('reading')
      ]);
    }
  };
})();
