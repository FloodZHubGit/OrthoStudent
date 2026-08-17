/* ============================================================
   Motilité — ductions, versions, 9 positions du regard
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  // Grille affichée du point de vue de l'examinateur :
  // la droite du patient est à GAUCHE de l'écran.
  var CELLS = [
    { id: 'dx-up', label: 'Dextro-élévation', gx: -1, gy: -1, od: ['DS'], os: ['OI'] },
    { id: 'up',    label: 'Élévation',        gx: 0,  gy: -1, od: ['DS', 'OI'], os: ['DS', 'OI'] },
    { id: 'lv-up', label: 'Lévo-élévation',   gx: 1,  gy: -1, od: ['OI'], os: ['DS'] },
    { id: 'dx',    label: 'Dextroversion',    gx: -1, gy: 0,  od: ['DL'], os: ['DM'] },
    { id: 'pp',    label: 'Position primaire', gx: 0, gy: 0,  od: [], os: [] },
    { id: 'lv',    label: 'Lévoversion',      gx: 1,  gy: 0,  od: ['DM'], os: ['DL'] },
    { id: 'dx-dn', label: 'Dextro-abaissement', gx: -1, gy: 1, od: ['DI'], os: ['OS'] },
    { id: 'dn',    label: 'Abaissement',      gx: 0,  gy: 1,  od: ['DI', 'OS'], os: ['DI', 'OS'] },
    { id: 'lv-dn', label: 'Lévo-abaissement', gx: 1,  gy: 1,  od: ['OS'], os: ['DI'] }
  ];

  var AMP_X = 22, AMP_Y = 15;

  function muscleName(id) {
    var m = Optics.Motility.muscles.filter(function (x) { return x.id === id; })[0];
    return m ? m.name : id;
  }

  M.motility = {
    id: 'motility', title: 'Motilité oculaire', icon: '🔄', group: 'Simulateurs',
    desc: '9 positions du regard, hypo-actions, identification du muscle déficitaire',
    keywords: 'motilite duction version position regard paralysie hypoaction hyperaction hering muscle',
    render: function (ctx) {
      var pp = (ctx && ctx.params) || {};
      var preset = pp.sim ? (pp.sim.motility || 'none') : null;   // 'none' = cas sans déficit imposé
      var st = { cell: 'pp', paretic: null, severity: 0.6, mono: null, revealed: false };

      var face = window.Face.build({ uid: 'mot' });
      var stage = el('div', { class: 'stage', style: { position: 'relative', padding: '10px' } }, [
        el('div', { class: 'stage-label', text: 'Examen de la motilité' }),
        face.node
      ]);

      var hud = el('div', { class: 'stage-hud' });
      stage.appendChild(hud);

      function cellById(id) { return CELLS.filter(function (c) { return c.id === id; })[0]; }

      function positionsFor(cellId) {
        var c = cellById(cellId);
        var base = { x: c.gx * AMP_X, y: c.gy * AMP_Y };
        var out = { od: { x: base.x, y: base.y }, os: { x: base.x, y: base.y } };
        if (st.paretic) {
          var eye = st.paretic.eye, mus = st.paretic.muscle;
          if (c[eye].indexOf(mus) >= 0) {
            var f = 1 - st.severity;
            // le déficit porte surtout sur la composante d'action du muscle
            out[eye] = { x: base.x * f, y: base.y * f };
          }
        }
        if (st.mono) {
          // en duction, l'œil occlus reste en position de repos
          var covered = st.mono === 'od' ? 'os' : 'od';
          out[covered] = { x: 0, y: 0 };
        }
        return out;
      }

      function goto(cellId) {
        st.cell = cellId;
        var p = positionsFor(cellId);
        face.setTarget(p.od, p.os);
        drawGrid();
        drawHud();
      }

      var gridNode = el('div', { class: 'gaze-grid' });
      function drawGrid() {
        UI.clear(gridNode);
        CELLS.forEach(function (c) {
          gridNode.appendChild(el('div', {
            class: 'gaze-cell' + (c.id === st.cell ? ' on' : ''),
            onClick: function () { goto(c.id); }
          }, [
            el('div', { style: { fontSize: '17px' }, text: arrowFor(c) }),
            el('div', { text: c.label })
          ]));
        });
      }

      function arrowFor(c) {
        if (c.gx === 0 && c.gy === 0) return '⦿';
        if (c.gx === 0) return c.gy < 0 ? '↑' : '↓';
        if (c.gy === 0) return c.gx < 0 ? '←' : '→';
        if (c.gy < 0) return c.gx < 0 ? '↖' : '↗';
        return c.gx < 0 ? '↙' : '↘';
      }

      function drawHud() {
        UI.clear(hud);
        var c = cellById(st.cell);
        hud.appendChild(el('span', { class: 'hud-tag', text: c.label }));
        hud.appendChild(el('span', { class: 'hud-tag', text: 'OD : ' + (c.od.length ? c.od.join(' + ') : '—') + '  |  OG : ' + (c.os.length ? c.os.join(' + ') : '—') }));
        if (st.mono) hud.appendChild(el('span', { class: 'hud-tag', text: 'Duction ' + st.mono.toUpperCase() + ' (autre œil occlus)' }));
        if (st.revealed && st.paretic) {
          hud.appendChild(el('span', { class: 'hud-tag', style: { color: '#f0b23c' }, text: 'Déficit : ' + muscleName(st.paretic.muscle) + ' ' + st.paretic.eye.toUpperCase() }));
        }
      }

      /* ---- génération d’un cas ---- */
      function newCase(from) {
        if (from === 'none') {
          st.paretic = null;
        } else if (from) {
          st.paretic = { eye: from.eye, muscle: from.muscle };
          st.severity = from.severity || 0.5;
        } else {
          var all = ['DL', 'DM', 'DS', 'DI', 'OS', 'OI'];
          st.paretic = { eye: Math.random() < 0.5 ? 'od' : 'os', muscle: all[Math.floor(Math.random() * all.length)] };
          st.severity = 0.4 + Math.random() * 0.45;
        }
        st.revealed = false;
        st.mono = null;
        goto('pp');
        UI.clear(ansBox); buildAns();
        if (!from) UI.toast('Nouveau patient : explorez les 9 positions du regard.');
      }

      function noParesis() {
        st.paretic = null; st.revealed = false; goto('pp');
        UI.clear(ansBox); buildAns();
      }

      /* ---- réponse ---- */
      var ansBox = el('div');
      function buildAns() {
        var eyeSel = UI.select([{ value: 'od', label: 'Œil droit' }, { value: 'os', label: 'Œil gauche' }, { value: 'none', label: 'Aucun déficit' }], 'od', function () {});
        var musSel = UI.select(Optics.Motility.muscles.map(function (m) { return { value: m.id, label: m.name }; }), 'DL', function () {});
        ansBox.appendChild(el('div', { class: 'grid g2' }, [
          UI.field('Œil atteint', eyeSel),
          UI.field('Muscle déficitaire', musSel)
        ]));
        ansBox.appendChild(el('div', { class: 'btn-row' }, [
          UI.btn('Valider', function () {
            var ok, score;
            if (!st.paretic) {
              ok = eyeSel.value === 'none';
              score = ok ? 100 : 0;
            } else {
              var eyeOk = eyeSel.value === st.paretic.eye;
              var musOk = musSel.value === st.paretic.muscle;
              ok = eyeOk && musOk;
              score = (eyeOk ? 40 : 0) + (musOk ? 60 : 0);
            }
            Store.recordScore('motility', score);
            st.revealed = true; drawHud();
            var expl = st.paretic
              ? 'Déficit du <b>' + muscleName(st.paretic.muscle) + '</b> de l’œil <b>' + st.paretic.eye.toUpperCase() + '</b>. ' +
                'Le déficit se démasque dans le champ d’action de ce muscle, et son <b>synergiste controlatéral</b> apparaît en hyperaction (loi de Hering). ' +
                'L’antagoniste homolatéral est le ' + muscleName(Optics.Motility.antagonist[st.paretic.muscle]) + '.'
              : 'Motilité normale dans les 9 positions.';
            ansBox.appendChild(UI.note((ok ? '✔ ' : '✘ ') + expl + ' Score <b>' + score + ' %</b>.', ok ? '' : 'warn'));
          }, 'primary'),
          UI.btn('Voir la solution', function () { st.revealed = true; drawHud(); }),
          preset ? null : UI.btn('Nouveau patient', function () { newCase(); }),
          preset ? null : UI.btn('Patient sans déficit', noParesis)
        ].filter(Boolean)));
      }

      var tools = el('div', { class: 'card' }, [
        el('div', { class: 'btn-row' }, [
          UI.btn('Versions (binoculaire)', function () { st.mono = null; goto(st.cell); }),
          UI.btn('Duction OD', function () { st.mono = 'od'; goto(st.cell); }),
          UI.btn('Duction OG', function () { st.mono = 'os'; goto(st.cell); }),
          el('span', { class: 'spacer' }),
          UI.btn('Balayer les 9 positions', function () {
            var i = 0;
            (function step() {
              if (i >= CELLS.length) { goto('pp'); return; }
              goto(CELLS[i].id); i++;
              setTimeout(step, 800);
            })();
          }, 'primary')
        ])
      ]);

      newCase(preset);
      drawGrid();

      return UI.page({
        crumb: 'Simulateurs',
        title: 'Motilité oculaire',
        subtitle: 'Explorez les 9 positions du regard sur un patient présentant (ou non) un déficit musculaire, puis identifiez ' +
                  'l’œil et le muscle en cause. <b>Rappel : la droite du patient est à gauche de l’écran.</b>'
      }, [
        tools,
        el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Patient', stage),
            UI.card('Votre conclusion', ansBox)
          ]),
          el('div', {}, [
            UI.card('Positions du regard', [
              gridNode,
              el('p', { class: 'small muted mt8', html: 'Cliquez une case pour y amener le regard. Le muscle prime mover de chaque œil est rappelé sous l’image.' })
            ]),
            UI.card('Cotation des ductions/versions', [
              UI.table(['Cotation', 'Signification'], [
                ['0', 'Motilité normale'],
                ['−1 à −4', 'Hypo-action, de discrète à majeure (−4 = l’œil ne dépasse pas la ligne médiane)'],
                ['+1 à +4', 'Hyperaction (fréquente sur l’antagoniste controlatéral ou l’oblique associé)']
              ]),
              UI.note('Notez toujours <b>ductions</b> (monoculaires) et <b>versions</b> (binoculaires) : une limitation présente en version mais pas en duction oriente vers un trouble supranucléaire.')
            ])
          ])
        ]),
        UI.card('Raisonnement devant une incomitance', UI.accordion([
          { title: 'Les 3 pas de Parks-Bielschowsky (diplopie verticale)', open: true, body:
            '<ol>' + Optics.Motility.parksSteps.map(function (p) { return '<li>' + p.replace(/^\d\.\s*/, '') + '</li>'; }).join('') + '</ol>' +
            '<p><b>Exemple :</b> hypertropie OD, majorée en lévoversion, majorée en inclinaison droite → <b>oblique supérieur droit</b>.</p>' },
          { title: 'Paralysie ou restriction ?', body:
            '<ul><li><b>Test de duction forcée</b> : positif (résistance mécanique) = restriction (Brown, orbitopathie, fracture du plancher).</li>' +
            '<li><b>Test de génération de force</b> : évalue la contraction active du muscle.</li>' +
            '<li>Une <b>déviation secondaire supérieure à la primaire</b> signe une paralysie (loi de Hering) ; dans une restriction, la déviation secondaire n’augmente pas.</li></ul>' },
          { title: 'Signes d’ancienneté', body:
            '<ul><li>Torticolis ancien visible sur des photos d’enfance.</li><li>Grandes amplitudes de fusion verticale (> 4 Δ) : en faveur d’une paralysie congénitale décompensée.</li>' +
            '<li>Absence de diplopie malgré une grande déviation : neutralisation, donc trouble ancien.</li>' +
            '<li>Une paralysie ancienne devient <b>comitante</b> avec le temps (« spread of comitance »).</li></ul>' },
          { title: 'Rappel des couples de Hering', body:
            '<table class="tbl"><tr><th>Regard</th><th>OD</th><th>OG</th></tr>' +
            Optics.Motility.yokePairs.map(function (y) {
              return '<tr><td class="k">' + y.gaze + '</td><td>' + muscleName(y.od) + '</td><td>' + muscleName(y.os) + '</td></tr>';
            }).join('') + '</table>' }
        ]))
      ]);
    }
  };
})();
