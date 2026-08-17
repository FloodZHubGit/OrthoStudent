/* ============================================================
   Mesure au prisme — barre de prismes et neutralisation
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  var BAR = [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 25, 30, 35, 40, 45, 50];

  M.prism = {
    id: 'prism', title: 'Mesure au prisme', icon: '🔺', group: 'Simulateurs',
    desc: 'Barre de prismes, choix de la base, neutralisation du mouvement',
    keywords: 'prisme barre base externe interne neutralisation mesure deviation krimsky',
    render: function (ctx) {
      var preset = ctx && ctx.params && ctx.params.sim && ctx.params.sim.covertest;
      var st = {
        h: -20, v: 0,
        prism: 0, base: 'BE', eye: 'od',
        gain: 1.8,
        revealed: false,
        moves: 0
      };

      var face = window.Face.build({ uid: 'pr' });
      var PXD = window.Face.PX_PER_DELTA;

      /* prisme dessiné devant l’œil */
      var prismLayer = el('div', {
        style: { position: 'absolute', pointerEvents: 'none', inset: '0' }
      });

      function drawPrismGlass() {
        UI.clear(prismLayer);
        if (!st.prism) return;
        var left = st.eye === 'od' ? 32.5 : 67.5;
        var rot = { BE: st.eye === 'od' ? 0 : 180, BI: st.eye === 'od' ? 180 : 0, BS: 270, BInf: 90 }[st.base];
        var g = s('svg', { viewBox: '0 0 100 100', style: 'width:100%;height:100%' });
        g.appendChild(s('polygon', {
          points: '20,20 80,50 20,80',
          fill: 'rgba(140,205,240,.28)', stroke: '#9fd8f5', 'stroke-width': 3,
          transform: 'rotate(' + rot + ' 50 50)'
        }));
        g.appendChild(s('text', { x: 50, y: 56, 'text-anchor': 'middle', fill: '#dff1fb', 'font-size': '22', 'font-weight': '700' }, st.prism + 'Δ'));
        prismLayer.appendChild(el('div', {
          style: {
            position: 'absolute', left: left + '%', top: '26%',
            width: '96px', height: '96px', transform: 'translate(-50%,-50%)'
          }
        }, g));
      }

      var stage = el('div', { class: 'stage', style: { position: 'relative', padding: '10px' } }, [
        el('div', { class: 'stage-label', text: 'Patient — mesure prismatique' }),
        face.node, prismLayer
      ]);

      /* ---------- calcul du résidu ---------- */
      function residual() {
        var h = st.h, v = st.v;
        var p = st.prism;
        if (st.base === 'BE') h += p;
        else if (st.base === 'BI') h -= p;
        else if (st.base === 'BInf') v -= (st.eye === 'od' ? p : -p);
        else if (st.base === 'BS') v += (st.eye === 'od' ? p : -p);
        return { h: h, v: v };
      }

      function posFor(dev, fixating) {
        var res = { od: { x: 0, y: 0 }, os: { x: 0, y: 0 } };
        var e = fixating === 'od' ? 'os' : 'od';
        var sign = e === 'od' ? -1 : 1;
        var vv = e === 'od' ? dev.v : -dev.v;
        res[e] = { x: sign * dev.h * PXD * st.gain, y: -vv * PXD * st.gain };
        return res;
      }

      var readout = el('div');
      var logBox = el('div', { class: 'log' });

      function log(t, b) {
        logBox.insertBefore(el('div', { class: 'log-line', html: b ? '<b>' + t + '</b>' : t }, null), logBox.firstChild);
      }

      function alternateCover() {
        st.moves++;
        var r = residual();
        var amp = Math.sqrt(r.h * r.h + r.v * r.v);
        var seq = ['od', 'os', 'od', 'os'];
        var i = 0;
        (function step() {
          if (i >= seq.length) {
            face.setTarget({ x: 0, y: 0 }, { x: 0, y: 0 });
            report(r, amp);
            return;
          }
          var fix = seq[i] === 'od' ? 'os' : 'od';
          var p = posFor(r, fix);
          face.setTarget(p.od, p.os);
          i++;
          setTimeout(step, 620);
        })();
      }

      function report(r, amp) {
        var msg;
        if (amp < 1.2) msg = '✔ <b>Aucun mouvement</b> : la déviation est neutralisée.';
        else {
          var d = [];
          if (Math.abs(r.h) >= 1.2) d.push(r.h > 0 ? 'mouvement de dehors en dedans (il reste de l’exo)' : 'mouvement de dedans en dehors (il reste de l’éso)');
          if (Math.abs(r.v) >= 1.2) d.push(r.v > 0 ? 'mouvement vertical : OD encore plus haut' : 'mouvement vertical : OG encore plus haut');
          msg = 'Mouvement résiduel : ' + d.join(' ; ') + '.';
        }
        log('Écran alterné avec ' + (st.prism ? st.prism + 'Δ ' + Optics.Prism.baseLabel(st.base) + ' devant ' + st.eye.toUpperCase() : 'aucun prisme') + ' → ' + msg, amp < 1.2);
        drawReadout(amp);
      }

      function drawReadout(amp) {
        UI.clear(readout);
        readout.appendChild(el('div', { class: 'flex wrap' }, [
          UI.chip('Prisme : ' + (st.prism || 0) + ' Δ ' + (st.prism ? Optics.Prism.baseLabel(st.base) : ''), st.prism ? 'blue' : ''),
          UI.chip('Devant ' + st.eye.toUpperCase()),
          preset ? UI.chip(st.near ? 'Vision de près' : 'Vision de loin', 'violet') : null,
          amp !== undefined ? UI.chip(amp < 1.2 ? 'Neutralisé' : 'Mouvement résiduel', amp < 1.2 ? 'green' : 'amber') : null,
          UI.chip('Manipulations : ' + st.moves)
        ].filter(Boolean)));
        if (st.revealed) {
          readout.appendChild(UI.note('<b>Déviation réelle :</b> ' +
            (st.h ? Math.abs(st.h) + ' Δ ' + (st.h > 0 ? 'd’exodéviation (base interne)' : 'd’ésodéviation (base externe)') : '') +
            (st.v ? (st.h ? ' + ' : '') + Math.abs(st.v) + ' Δ vertical (' + (st.v > 0 ? 'OD hyper' : 'OG hyper') + ')' : '')));
        }
      }

      /* ---------- barre de prismes ---------- */
      var barNode = el('div', { class: 'prism-bar' });
      function drawBar() {
        UI.clear(barNode);
        barNode.appendChild(el('div', {
          class: 'prism-cell' + (st.prism === 0 ? ' on' : ''), text: '0',
          onClick: function () { st.prism = 0; st.moves++; drawBar(); drawPrismGlass(); drawReadout(); }
        }));
        BAR.forEach(function (v) {
          barNode.appendChild(el('div', {
            class: 'prism-cell' + (st.prism === v ? ' on' : ''), text: v + 'Δ',
            onClick: function () { st.prism = v; st.moves++; drawBar(); drawPrismGlass(); drawReadout(); }
          }));
        });
      }

      /* ---------- nouveau cas ---------- */
      function newCase(fromCase, near) {
        st.h = 0; st.v = 0;
        if (fromCase) {
          st.near = !!near;
          st.h = (near ? fromCase.nearH : fromCase.farH) || 0;
          st.v = (near ? fromCase.nearV : fromCase.farV) || 0;
        } else {
          var kind = Math.random();
          if (kind < 0.42) st.h = -(6 + Math.floor(Math.random() * 18) * 2);
          else if (kind < 0.84) st.h = 6 + Math.floor(Math.random() * 18) * 2;
          if (Math.random() < 0.32 || (!st.h)) st.v = (Math.random() < 0.5 ? 1 : -1) * (2 + Math.floor(Math.random() * 6) * 2);
        }
        st.prism = 0; st.base = 'BE'; st.eye = 'od'; st.revealed = false; st.moves = 0;
        UI.clear(logBox);
        face.snap({ x: 0, y: 0 }, { x: 0, y: 0 });
        drawBar(); drawPrismGlass(); drawReadout();
        log('Nouveau patient. Choisissez la base, placez un prisme et faites l’écran alterné jusqu’à neutralisation.');
        UI.clear(ansBox); buildAns();
      }

      /* ---------- réponse ---------- */
      var ansBox = el('div');
      function buildAns() {
        var hIn = UI.num(0, function () {}, { step: 1, min: 0, max: 80 });
        var hDir = UI.select([{ value: 'eso', label: 'Ésodéviation' }, { value: 'exo', label: 'Exodéviation' }, { value: 'none', label: 'Aucune' }], 'eso', function () {});
        var vIn = UI.num(0, function () {}, { step: 1, min: 0, max: 30 });
        var vDir = UI.select([{ value: 'none', label: 'Aucune' }, { value: 'od', label: 'OD hyper' }, { value: 'os', label: 'OG hyper' }], 'none', function () {});
        ansBox.appendChild(el('div', { class: 'grid g4' }, [
          UI.field('Sens horizontal', hDir),
          UI.field('Amplitude horizontale (Δ)', hIn),
          UI.field('Sens vertical', vDir),
          UI.field('Amplitude verticale (Δ)', vIn)
        ]));
        ansBox.appendChild(el('div', { class: 'btn-row' }, [
          UI.btn('Valider la mesure', function () {
            var trueH = Math.abs(st.h), trueV = Math.abs(st.v);
            var gh = hDir.value === 'none' ? 0 : parseFloat(hIn.value) || 0;
            var gv = vDir.value === 'none' ? 0 : parseFloat(vIn.value) || 0;
            var dirHOk = (st.h === 0 && hDir.value === 'none') || (st.h < 0 && hDir.value === 'eso') || (st.h > 0 && hDir.value === 'exo');
            var dirVOk = (st.v === 0 && vDir.value === 'none') || (st.v > 0 && vDir.value === 'od') || (st.v < 0 && vDir.value === 'os');
            var errH = Math.abs(gh - trueH), errV = Math.abs(gv - trueV);
            var score = Math.round(Math.max(0, 100 - errH * 5 - errV * 8 - (dirHOk ? 0 : 25) - (dirVOk ? 0 : 20) - Math.max(0, st.moves - 12) * 1.5));
            Store.recordScore('prism', score, { moves: st.moves });
            st.revealed = true; drawReadout();
            ansBox.appendChild(UI.note(
              'Déviation réelle : <b>' + (trueH ? trueH + ' Δ ' + (st.h < 0 ? 'éso' : 'exo') : 'pas d’horizontale') +
              (trueV ? ' + ' + trueV + ' Δ vertical (' + (st.v > 0 ? 'OD hyper' : 'OG hyper') + ')' : '') + '</b>. ' +
              'Écart horizontal ' + errH + ' Δ, vertical ' + errV + ' Δ, en ' + st.moves + ' manipulations. Score <b>' + score + ' %</b>.',
              score >= 75 ? '' : 'warn'));
          }, 'primary'),
          UI.btn('Voir la solution', function () { st.revealed = true; drawReadout(); }),
          preset ? null : UI.btn('Nouveau patient', function () { newCase(); })
        ].filter(Boolean)));
      }

      var tools = el('div', { class: 'card' }, [
        el('div', { class: 'btn-row' }, [
          el('span', { class: 'muted small', text: 'Base du prisme :' }),
          UI.select([
            { value: 'BE', label: 'Base externe (temporale)' },
            { value: 'BI', label: 'Base interne (nasale)' },
            { value: 'BInf', label: 'Base inférieure' },
            { value: 'BS', label: 'Base supérieure' }
          ], 'BE', function (v) { st.base = v; st.moves++; drawPrismGlass(); drawReadout(); }),
          el('span', { class: 'muted small', text: 'Devant :' }),
          UI.select([{ value: 'od', label: 'Œil droit' }, { value: 'os', label: 'Œil gauche' }], 'od', function (v) { st.eye = v; drawPrismGlass(); drawReadout(); }),
          el('span', { class: 'spacer' }),
          UI.btn('▶ Écran alterné', alternateCover, 'primary'),
          preset ? null : UI.btn('Nouveau patient', function () { newCase(); })
        ].filter(Boolean)),
        preset ? el('div', { class: 'btn-row', style: { marginTop: '10px' } }, [
          el('span', { class: 'muted small', text: '📁 Dossier patient — distance de mesure :' }),
          UI.btn('De loin (5 m)', function () { newCase(preset, false); UI.toast('Mesure de loin'); }),
          UI.btn('De près (40 cm)', function () { newCase(preset, true); UI.toast('Mesure de près'); })
        ]) : null
      ].filter(Boolean));

      newCase(preset, false);

      return UI.page({
        crumb: 'Simulateurs',
        title: 'Mesure au prisme',
        subtitle: 'Neutralisez la déviation : choisissez la base adaptée, montez dans la barre de prismes et refaites l’écran alterné ' +
                  'jusqu’à disparition complète du mouvement.'
      }, [
        tools,
        el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Salle d’examen', [stage, readout]),
            UI.card('Votre mesure', ansBox)
          ]),
          el('div', {}, [
            UI.card('Barre de prismes', [
              barNode,
              el('p', { class: 'small muted mt8', html: 'Cliquez une valeur pour la placer devant l’œil sélectionné.' })
            ]),
            UI.card('Journal', logBox)
          ])
        ]),
        UI.card('Règles de la mesure prismatique', UI.accordion([
          { title: 'Quelle base pour quelle déviation ?', open: true, body:
            '<ul><li><b>Ésodéviation</b> → prisme <b>base externe</b> (temporale).</li>' +
            '<li><b>Exodéviation</b> → prisme <b>base interne</b> (nasale).</li>' +
            '<li><b>Hypertropie</b> → base <b>inférieure</b> devant l’œil le plus haut (ou base supérieure devant l’autre).</li></ul>' +
            '<p>Moyen mnémotechnique : la base est toujours <b>du côté opposé à la déviation</b> — le prisme dévie les rayons vers sa base et l’image vers son sommet.</p>' },
          { title: 'Barre de prismes ou prismes libres ?', body:
            '<p>La barre est rapide et pratique en dépistage. Pour les grands angles, on peut cumuler un prisme devant chaque œil : <b>les valeurs s’additionnent approximativement</b> lorsqu’elles sont réparties sur les deux yeux, mais <b>jamais</b> deux prismes empilés devant le même œil (l’erreur devient importante au-delà de 20 Δ).</p>' +
            '<p>Le prisme doit être tenu dans le <b>plan frontal (position de Prentice)</b>, sa face postérieure perpendiculaire à l’axe visuel.</p>' },
          { title: 'Séquence complète du bilan', body:
            '<ol><li>Cover test unilatéral : phorie ou tropie ?</li><li>Cover test alterné : déviation totale.</li>' +
            '<li>Mise en place du prisme croissant devant un œil, avec écran alterné après chaque changement.</li>' +
            '<li>Neutralisation = disparition du mouvement. On note la valeur juste avant l’inversion du sens.</li>' +
            '<li>Mesure répétée de loin, de près, avec et sans correction, et dans les positions du regard si incomitance.</li></ol>' },
          { title: 'Cas particuliers', body:
            '<ul><li><b>Krimsky</b> : chez le patient non coopérant ou à œil amblyope, on place les prismes devant l’œil <i>fixateur</i> jusqu’à recentrage du reflet cornéen de l’œil dévié.</li>' +
            '<li><b>Test des 4 Δ base externe</b> : dépistage de la microtropie et du scotome de neutralisation.</li>' +
            '<li>Au-delà de 40–50 Δ, les prismes de la barre sous-estiment la déviation réelle (effet non linéaire).</li></ul>' }
        ]))
      ]);
    }
  };
})();
