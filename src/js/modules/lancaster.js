/* ============================================================
   Test de Lancaster — relevé dans les 9 positions
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  var CELLS = [
    { id: 'dx-up', label: 'Dextro-élévation', gx: -1, gy: -1, od: ['DS'], os: ['OI'] },
    { id: 'up', label: 'Élévation', gx: 0, gy: -1, od: ['DS', 'OI'], os: ['DS', 'OI'] },
    { id: 'lv-up', label: 'Lévo-élévation', gx: 1, gy: -1, od: ['OI'], os: ['DS'] },
    { id: 'dx', label: 'Dextroversion', gx: -1, gy: 0, od: ['DL'], os: ['DM'] },
    { id: 'pp', label: 'Position primaire', gx: 0, gy: 0, od: [], os: [] },
    { id: 'lv', label: 'Lévoversion', gx: 1, gy: 0, od: ['DM'], os: ['DL'] },
    { id: 'dx-dn', label: 'Dextro-abaissement', gx: -1, gy: 1, od: ['DI'], os: ['OS'] },
    { id: 'dn', label: 'Abaissement', gx: 0, gy: 1, od: ['DI', 'OS'], os: ['DI', 'OS'] },
    { id: 'lv-dn', label: 'Lévo-abaissement', gx: 1, gy: 1, od: ['OS'], os: ['DI'] }
  ];

  // vecteur du déficit dans le plan du schéma (dx > 0 : éso ; dy > 0 : œil plus bas)
  var DEFICIT = {
    DL: { dx: 1, dy: 0 }, DM: { dx: -1, dy: 0 },
    DS: { dx: 0, dy: 1 }, DI: { dx: 0, dy: -1 },
    OS: { dx: 0, dy: -1 }, OI: { dx: 0, dy: 1 }
  };

  var STEP = 92, PXD = 3.4;

  function muscleName(id) {
    var m = Optics.Motility.muscles.filter(function (x) { return x.id === id; })[0];
    return m ? m.name : id;
  }

  M.lancaster = {
    id: 'lancaster', title: 'Test de Lancaster', icon: '🟥', group: 'Simulateurs',
    desc: 'Dissociation rouge-vert, relevé des 9 positions, schéma des deux yeux',
    keywords: 'lancaster hess paralysie schema rouge vert incomitance hering',
    render: function (ctx) {
      var pp = (ctx && ctx.params) || {};
      var simP = pp.sim || null;
      var preset = simP ? (simP.motility || 'none') : null;
      var st = {
        paretic: null, sev: 25, base: { h: 0, v: 0 },
        fix: 'od', cell: 'pp', revealed: false,
        record: {}   // cellId -> {od:{dx,dy}, os:{...}}
      };

      /* --- déviation perçue --- */
      function deviationFor(cell, projectedEye) {
        // projectedEye = œil qui place la mire verte (l’œil non fixateur)
        var c = CELLS.filter(function (x) { return x.id === cell; })[0];
        var d = { dx: st.base.h, dy: st.base.v };
        if (st.paretic) {
          var pe = st.paretic.eye, mus = st.paretic.muscle;
          var involved = c[pe].indexOf(mus) >= 0;
          var partial = c[pe].length > 1 ? 0.7 : 1;
          if (involved) {
            var v = DEFICIT[mus];
            var amt = st.sev * partial;
            // si l’œil parétique fixe, la déviation de l’autre œil est majorée (loi de Hering)
            var factor = (projectedEye !== pe) ? 1.5 : 1;
            d.dx += v.dx * amt * factor * (pe === 'od' ? 1 : 1);
            d.dy += v.dy * amt * factor * (pe === 'od' ? 1 : -1);
          }
        }
        return d;
      }

      /* --- écran de Lancaster --- */
      var screenHolder = el('div');
      function drawScreen() {
        UI.clear(screenHolder);
        var g = s('svg', { viewBox: '0 0 620 420', style: 'width:100%;height:auto;background:#05080b;border-radius:8px' });
        for (var i = -3; i <= 3; i++) {
          g.appendChild(s('line', { x1: 310 + i * STEP / 2, y1: 20, x2: 310 + i * STEP / 2, y2: 400, stroke: '#1b2a36', 'stroke-width': 1 }));
          g.appendChild(s('line', { x1: 20, y1: 210 + i * STEP / 2, x2: 600, y2: 210 + i * STEP / 2, stroke: '#1b2a36', 'stroke-width': 1 }));
        }
        CELLS.forEach(function (c) {
          var x = 310 + c.gx * STEP, y = 210 + c.gy * STEP;
          g.appendChild(s('circle', { cx: x, cy: y, r: 3, fill: '#2f4658' }));
        });

        var cur = CELLS.filter(function (x) { return x.id === st.cell; })[0];
        var rx = 310 + cur.gx * STEP, ry = 210 + cur.gy * STEP;
        // mire rouge (examinateur, vue par l’œil fixateur)
        g.appendChild(s('line', { x1: rx - 34, y1: ry, x2: rx + 34, y2: ry, stroke: '#ff3b46', 'stroke-width': 7, 'stroke-linecap': 'round' }));
        g.appendChild(s('text', { x: rx, y: ry - 16, fill: '#ff6d76', 'font-size': '11', 'text-anchor': 'middle' }, 'ROUGE — ' + st.fix.toUpperCase()));

        // mire verte placée par l’autre œil
        var other = st.fix === 'od' ? 'os' : 'od';
        var d = deviationFor(st.cell, other);
        var gx = rx + d.dx * PXD * (other === 'od' ? -1 : 1) * -1;
        var gy = ry + d.dy * PXD;
        g.appendChild(s('line', { x1: gx, y1: gy - 34, x2: gx, y2: gy + 34, stroke: '#22d15c', 'stroke-width': 7, 'stroke-linecap': 'round' }));
        g.appendChild(s('text', { x: gx, y: gy + 50, fill: '#4ee283', 'font-size': '11', 'text-anchor': 'middle' }, 'VERT — ' + other.toUpperCase()));

        if (Math.abs(gx - rx) > 3 || Math.abs(gy - ry) > 3) {
          g.appendChild(s('line', { x1: rx, y1: ry, x2: gx, y2: gy, stroke: '#f0b23c', 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }));
          g.appendChild(s('text', { x: (rx + gx) / 2 + 8, y: (ry + gy) / 2 - 8, fill: '#f0b23c', 'font-size': '11' },
            Optics.r2(Math.sqrt(d.dx * d.dx + d.dy * d.dy), 0) + ' Δ'));
        }
        g.appendChild(s('text', { x: 20, y: 412, fill: '#48606f', 'font-size': '11' }, 'Écran de Lancaster — 1 carreau = 5°'));
        screenHolder.appendChild(g);
      }

      /* --- schéma final --- */
      var chartHolder = el('div');
      function drawCharts() {
        UI.clear(chartHolder);
        var wrap = el('div', { class: 'grid g2' });
        ['od', 'os'].forEach(function (eye) {
          var g = s('svg', { viewBox: '0 0 300 300', style: 'width:100%;height:auto;background:#05080b;border-radius:8px' });
          for (var i = 0; i <= 4; i++) {
            g.appendChild(s('line', { x1: 30 + i * 60, y1: 30, x2: 30 + i * 60, y2: 270, stroke: '#16232e' }));
            g.appendChild(s('line', { x1: 30, y1: 30 + i * 60, x2: 270, y2: 30 + i * 60, stroke: '#16232e' }));
          }
          var pts = [];
          [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]].forEach(function (p) {
            var c = CELLS.filter(function (x) { return x.gx === p[0] && x.gy === p[1]; })[0];
            var d = deviationFor(c.id, eye);
            var x = 150 + p[0] * 70 + d.dx * 1.9 * (eye === 'od' ? -1 : 1) * -1;
            var y = 150 + p[1] * 70 + d.dy * 1.9;
            pts.push(x + ',' + y);
          });
          g.appendChild(s('polygon', {
            points: pts.join(' '),
            fill: eye === 'od' ? 'rgba(255,59,70,.12)' : 'rgba(34,209,92,.12)',
            stroke: eye === 'od' ? '#ff3b46' : '#22d15c', 'stroke-width': 2.4
          }));
          // repère théorique
          g.appendChild(s('polygon', { points: '80,80 150,80 220,80 220,150 220,220 150,220 80,220 80,150', fill: 'none', stroke: '#33475a', 'stroke-dasharray': '4 4' }));
          g.appendChild(s('text', { x: 150, y: 20, fill: '#8ba3b6', 'font-size': '13', 'text-anchor': 'middle', 'font-weight': '700' },
            'Schéma ' + eye.toUpperCase() + (st.paretic && st.paretic.eye === eye ? ' (œil parétique)' : '')));
          wrap.appendChild(el('div', {}, g));
        });
        chartHolder.appendChild(wrap);
        chartHolder.appendChild(UI.note('Le schéma <b>rétréci</b> correspond à l’œil parétique (limitation dans le champ d’action du muscle déficitaire) ; ' +
          'le schéma <b>élargi</b> correspond à l’œil sain, dont le synergiste est surinnervé (loi de Hering). Le pointillé représente le tracé théorique normal.'));
      }

      /* --- cas --- */
      function newCase(from) {
        var all = ['DL', 'DM', 'DS', 'DI', 'OS', 'OI'];
        if (from && from !== 'none') {
          st.paretic = { eye: from.eye, muscle: from.muscle };
          st.sev = Math.round((from.severity || 0.5) * 40);
        } else if (from === 'none') {
          st.paretic = null;   // déviation comitante : les deux schémas sont parallèles
          st.sev = 0;
        } else {
          st.paretic = { eye: Math.random() < 0.5 ? 'od' : 'os', muscle: all[Math.floor(Math.random() * all.length)] };
          st.sev = 12 + Math.floor(Math.random() * 5) * 5;
        }
        // en mode dossier la déviation de base vient du cover test, sinon elle est tirée au sort
        st.base = from
          ? { h: -((simP && simP.covertest && simP.covertest.farH) || 0), v: 0 }
          : { h: Math.round((Math.random() * 8 - 4)), v: 0 };
        st.revealed = false; st.cell = 'pp'; st.fix = 'od';
        drawScreen(); drawCharts(); drawGrid();
        UI.clear(ansBox); buildAns();
      }

      var gridNode = el('div', { class: 'gaze-grid' });
      function drawGrid() {
        UI.clear(gridNode);
        CELLS.forEach(function (c) {
          gridNode.appendChild(el('div', {
            class: 'gaze-cell' + (c.id === st.cell ? ' on' : ''),
            onClick: function () { st.cell = c.id; drawScreen(); drawGrid(); },
            text: c.label
          }));
        });
      }

      var ansBox = el('div');
      function buildAns() {
        var eyeSel = UI.select([
          { value: 'od', label: 'Œil droit' }, { value: 'os', label: 'Œil gauche' },
          { value: 'none', label: 'Aucune paralysie (déviation comitante)' }
        ], 'od', function () {});
        var musSel = UI.select(Optics.Motility.muscles.map(function (m) { return { value: m.id, label: m.name }; }), 'DL', function () {});
        ansBox.appendChild(el('div', { class: 'grid g2' }, [
          UI.field('Œil parétique', eyeSel), UI.field('Muscle atteint', musSel)
        ]));
        ansBox.appendChild(el('div', { class: 'btn-row' }, [
          UI.btn('Valider', function () {
            var score, msg;
            if (!st.paretic) {
              score = eyeSel.value === 'none' ? 100 : 0;
              msg = 'Les deux tracés sont parallèles et simplement décalés : <b>déviation comitante</b>, pas de paralysie.';
            } else {
              var eyeOk = eyeSel.value === st.paretic.eye, musOk = musSel.value === st.paretic.muscle;
              score = (eyeOk ? 40 : 0) + (musOk ? 60 : 0);
              msg = 'Atteinte du <b>' + muscleName(st.paretic.muscle) + '</b> de l’œil <b>' +
                st.paretic.eye.toUpperCase() + '</b> (' + st.sev + ' Δ dans le champ d’action).';
            }
            Store.recordScore('lancaster', score);
            st.revealed = true;
            ansBox.appendChild(UI.note((score === 100 ? '✔ ' : '✘ ') + msg + ' Score <b>' + score + ' %</b>.',
              score === 100 ? '' : 'warn'));
          }, 'primary'),
          preset ? null : UI.btn('Nouveau patient', function () { newCase(); })
        ].filter(Boolean)));
      }

      var tools = el('div', { class: 'card' }, [
        el('div', { class: 'btn-row' }, [
          el('span', { class: 'muted small', text: 'Verre rouge (œil fixateur) devant :' }),
          UI.btn('OD', function () { st.fix = 'od'; drawScreen(); }),
          UI.btn('OG', function () { st.fix = 'os'; drawScreen(); }),
          el('span', { class: 'spacer' }),
          UI.btn('Balayer les 9 positions', function () {
            var i = 0;
            (function step() {
              if (i >= CELLS.length) return;
              st.cell = CELLS[i].id; drawScreen(); drawGrid(); i++;
              setTimeout(step, 750);
            })();
          }),
          preset ? null : UI.btn('Nouveau patient', function () { newCase(); }, 'primary')
        ].filter(Boolean))
      ]);

      newCase(preset);

      return UI.page({
        crumb: 'Simulateurs',
        title: 'Test de Lancaster',
        subtitle: 'Le patient porte des lunettes rouge-vert. Vous projetez la mire rouge, il superpose la mire verte : ' +
                  'l’écart entre les deux traduit la déviation dans cette position du regard.'
      }, [
        tools,
        el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Écran de projection', screenHolder),
            UI.card('Schéma obtenu', chartHolder),
            UI.card('Votre conclusion', ansBox)
          ]),
          el('div', {}, [
            UI.card('Position à explorer', gridNode),
            UI.card('Lire un Lancaster', UI.accordion([
              { title: 'Principe', open: true, body:
                '<p>Le patient porte un verre rouge devant un œil et vert devant l’autre : la dissociation est complète. Il ne voit que la mire rouge avec un œil et la verte avec l’autre. L’écart entre les deux positions donne directement la déviation, position du regard par position du regard.</p>' },
              { title: 'Interprétation du schéma', body:
                '<ul><li>Le tracé <b>le plus petit</b> = œil parétique.</li><li>Le tracé <b>le plus grand</b> = œil sain (surinnervation par la loi de Hering).</li>' +
                '<li>Le <b>rétrécissement maximal</b> pointe le champ d’action du muscle déficitaire.</li>' +
                '<li>Les deux tracés <b>parallèles et décalés</b> = déviation comitante (strabisme fonctionnel), pas de paralysie.</li></ul>' },
              { title: 'Intérêt et limites', body:
                '<ul><li>Nécessite une <b>vision binoculaire</b> et l’absence de neutralisation : inutilisable chez la plupart des strabiques précoces.</li>' +
                '<li>Excellent pour le <b>suivi évolutif</b> d’une paralysie et la décision opératoire.</li>' +
                '<li>Permet aussi de quantifier la <b>cyclodéviation</b> avec les mires à deux traits.</li>' +
                '<li>Alternative : écran de Hess-Weiss, même principe, tracé sur écran quadrillé noir.</li></ul>' }
            ]))
          ])
        ])
      ]);
    }
  };
})();
