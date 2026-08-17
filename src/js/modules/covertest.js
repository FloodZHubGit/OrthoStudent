/* ============================================================
   Cover test — visage animé, écran manipulable
   ------------------------------------------------------------
   Le composant « Face » est réutilisé par les modules prisme
   et motilité. Échelle physiologique : rayon d'iris = 6 mm,
   Hirschberg 1 mm ≈ 15 Δ.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  var IRIS_R = 26;                 // px pour un iris de 12 mm
  var PX_PER_MM = IRIS_R / 6;
  var PX_PER_DELTA = PX_PER_MM / 15;

  /* ============================================================
     Composant visage
     ============================================================ */
  function buildFace(opts) {
    opts = opts || {};
    var gain = opts.gain || 1;
    var W = 640, H = 392;
    var EYE = { od: { cx: 208, cy: 158 }, os: { cx: 432, cy: 158 } };

    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, style: 'width:100%;height:auto;display:block' });

    var defs = s('defs');
    ['od', 'os'].forEach(function (e) {
      var c = EYE[e];
      var cp = s('clipPath', { id: 'clip-' + e + '-' + (opts.uid || 'a') });
      cp.appendChild(s('path', {
        d: 'M ' + (c.cx - 60) + ' ' + c.cy +
           ' C ' + (c.cx - 40) + ' ' + (c.cy - 36) + ' ' + (c.cx + 40) + ' ' + (c.cy - 36) + ' ' + (c.cx + 60) + ' ' + c.cy +
           ' C ' + (c.cx + 40) + ' ' + (c.cy + 32) + ' ' + (c.cx - 40) + ' ' + (c.cy + 32) + ' ' + (c.cx - 60) + ' ' + c.cy + ' Z'
      }));
      defs.appendChild(cp);
    });
    svg.appendChild(defs);

    // visage
    svg.appendChild(s('ellipse', { cx: 320, cy: 180, rx: 216, ry: 168, fill: '#e3b394' }));
    svg.appendChild(s('ellipse', { cx: 320, cy: 180, rx: 216, ry: 168, fill: 'none', stroke: '#c99676', 'stroke-width': 2 }));
    // oreilles
    svg.appendChild(s('ellipse', { cx: 102, cy: 190, rx: 16, ry: 26, fill: '#d9a98b' }));
    svg.appendChild(s('ellipse', { cx: 538, cy: 190, rx: 16, ry: 26, fill: '#d9a98b' }));
    // cheveux
    svg.appendChild(s('path', { d: 'M 106 130 Q 150 4 320 8 Q 490 4 534 130 Q 480 60 320 62 Q 160 60 106 130 Z', fill: '#4a3629' }));
    // sourcils
    svg.appendChild(s('path', { d: 'M 152 108 Q 208 88 264 108', fill: 'none', stroke: '#4a3629', 'stroke-width': 9, 'stroke-linecap': 'round' }));
    svg.appendChild(s('path', { d: 'M 376 108 Q 432 88 488 108', fill: 'none', stroke: '#4a3629', 'stroke-width': 9, 'stroke-linecap': 'round' }));
    // nez et bouche
    svg.appendChild(s('path', { d: 'M 320 178 L 306 244 Q 320 254 334 244', fill: 'none', stroke: '#c99676', 'stroke-width': 3, 'stroke-linecap': 'round' }));
    svg.appendChild(s('path', { d: 'M 276 292 Q 320 314 364 292', fill: 'none', stroke: '#b9705f', 'stroke-width': 5, 'stroke-linecap': 'round' }));

    var refs = {};
    ['od', 'os'].forEach(function (e) {
      var c = EYE[e];
      var clip = 'url(#clip-' + e + '-' + (opts.uid || 'a') + ')';
      var g = s('g', { 'clip-path': clip });
      g.appendChild(s('rect', { x: c.cx - 62, y: c.cy - 40, width: 124, height: 80, fill: '#fbfcfd' }));
      // léger relief conjonctival
      g.appendChild(s('path', { d: 'M ' + (c.cx - 60) + ' ' + (c.cy + 4) + ' Q ' + c.cx + ' ' + (c.cy + 20) + ' ' + (c.cx + 60) + ' ' + (c.cy + 4), fill: 'none', stroke: '#f0d6d2', 'stroke-width': 3 }));
      var globe = s('g');
      globe.appendChild(s('circle', { cx: c.cx, cy: c.cy, r: IRIS_R, fill: '#5c8fa8' }));
      globe.appendChild(s('circle', { cx: c.cx, cy: c.cy, r: IRIS_R, fill: 'none', stroke: '#33586b', 'stroke-width': 2.5 }));
      for (var i = 0; i < 18; i++) {
        var a = (i / 18) * Math.PI * 2;
        globe.appendChild(s('line', {
          x1: c.cx + Math.cos(a) * 11, y1: c.cy + Math.sin(a) * 11,
          x2: c.cx + Math.cos(a) * 24, y2: c.cy + Math.sin(a) * 24,
          stroke: '#7fb0c6', 'stroke-width': 1.2, opacity: 0.6
        }));
      }
      globe.appendChild(s('circle', { cx: c.cx, cy: c.cy, r: 11, fill: '#10161c' }));
      g.appendChild(globe);
      // reflet cornéen fixe (source lumineuse)
      var reflex = s('circle', { cx: c.cx + 1, cy: c.cy - 7, r: 4.2, fill: '#ffffff', opacity: 0.96 });
      g.appendChild(reflex);
      svg.appendChild(g);

      // contour palpébral
      svg.appendChild(s('path', {
        d: 'M ' + (c.cx - 60) + ' ' + c.cy +
           ' C ' + (c.cx - 40) + ' ' + (c.cy - 36) + ' ' + (c.cx + 40) + ' ' + (c.cy - 36) + ' ' + (c.cx + 60) + ' ' + c.cy +
           ' C ' + (c.cx + 40) + ' ' + (c.cy + 32) + ' ' + (c.cx - 40) + ' ' + (c.cy + 32) + ' ' + (c.cx - 60) + ' ' + c.cy + ' Z',
        fill: 'none', stroke: '#a8785d', 'stroke-width': 3.5
      }));
      // cils
      svg.appendChild(s('path', {
        d: 'M ' + (c.cx - 60) + ' ' + c.cy + ' C ' + (c.cx - 40) + ' ' + (c.cy - 36) + ' ' + (c.cx + 40) + ' ' + (c.cy - 36) + ' ' + (c.cx + 60) + ' ' + c.cy,
        fill: 'none', stroke: '#3b2a20', 'stroke-width': 5, 'stroke-linecap': 'round'
      }));

      refs[e] = { globe: globe, reflex: reflex, center: c };
    });

    // étiquettes sous le visage, avec trait de rappel vers chaque œil
    [[208, 'ŒIL DROIT'], [432, 'ŒIL GAUCHE']].forEach(function (l) {
      svg.appendChild(s('line', {
        x1: l[0], y1: 358, x2: l[0], y2: 370,
        stroke: '#5b7183', 'stroke-width': 1, 'stroke-dasharray': '2 3'
      }));
      svg.appendChild(s('text', {
        x: l[0], y: 384, fill: '#8ba1b3', 'font-size': '12.5',
        'text-anchor': 'middle', 'font-weight': '700', 'letter-spacing': '1.2'
      }, l[1]));
    });

    /* --- animation --- */
    var cur = { od: { x: 0, y: 0 }, os: { x: 0, y: 0 } };
    var tgt = { od: { x: 0, y: 0 }, os: { x: 0, y: 0 } };
    var raf = null, onSettle = null;

    function apply() {
      ['od', 'os'].forEach(function (e) {
        refs[e].globe.setAttribute('transform', 'translate(' + cur[e].x.toFixed(2) + ',' + cur[e].y.toFixed(2) + ')');
      });
    }

    function tick() {
      var moving = false;
      ['od', 'os'].forEach(function (e) {
        ['x', 'y'].forEach(function (k) {
          var d = tgt[e][k] - cur[e][k];
          if (Math.abs(d) > 0.05) { cur[e][k] += d * 0.22; moving = true; }
          else cur[e][k] = tgt[e][k];
        });
      });
      apply();
      if (moving) raf = requestAnimationFrame(tick);
      else { raf = null; if (onSettle) { var f = onSettle; onSettle = null; f(); } }
    }

    function setTarget(od, os, cb) {
      tgt.od.x = od.x; tgt.od.y = od.y;
      tgt.os.x = os.x; tgt.os.y = os.y;
      onSettle = cb || null;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    return {
      node: svg,
      eyePos: EYE,
      setTarget: setTarget,
      snap: function (od, os) { cur.od = { x: od.x, y: od.y }; cur.os = { x: os.x, y: os.y }; tgt.od = { x: od.x, y: od.y }; tgt.os = { x: os.x, y: os.y }; apply(); },
      setGain: function (g) { gain = g; },
      getGain: function () { return gain; },
      refs: refs
    };
  }

  window.Face = { build: buildFace, PX_PER_DELTA: PX_PER_DELTA, PX_PER_MM: PX_PER_MM };

  /* ============================================================
     Moteur de cover test
     ============================================================ */
  function deviationVector(eye, h, v, gain) {
    // h > 0 : exo (œil dévié en dehors) ; v > 0 : OD hyper
    var sign = eye === 'od' ? -1 : 1;              // dehors = gauche pour l’OD à l’écran
    var vy = eye === 'od' ? -v : v;                // OD hyper => OD monte, OS descend
    return { x: sign * h * PX_PER_DELTA * gain, y: vy * PX_PER_DELTA * gain };
  }

  function computePositions(cfg, covered, fixating, gain) {
    var h = cfg.h, v = cfg.v;
    var res = { od: { x: 0, y: 0 }, os: { x: 0, y: 0 } };
    if (covered) {
      // l’œil découvert fixe, l’œil couvert prend sa position de déviation
      var open = covered === 'od' ? 'os' : 'od';
      res[open] = { x: 0, y: 0 };
      res[covered] = deviationVector(covered, h, covered === 'od' ? v : -v, gain);
    } else if (cfg.manifest) {
      var fix = fixating || cfg.dominant || 'od';
      var dev = fix === 'od' ? 'os' : 'od';
      res[fix] = { x: 0, y: 0 };
      res[dev] = deviationVector(dev, h, dev === 'od' ? v : -v, gain);
    }
    return res;
  }

  /* ============================================================
     Module
     ============================================================ */
  M.covertest = {
    id: 'covertest', title: 'Cover test', icon: '👁', group: 'Simulateurs',
    desc: 'Écran unilatéral et alterné sur visage animé, cas générés aléatoirement',
    keywords: 'cover test ecran unilateral alterne phorie tropie esotropie exotropie hypertropie',
    render: function (ctx) {
      var cp = (ctx && ctx.params) || {};
      var st = {
        cfg: { h: 0, v: 0, manifest: false, dominant: 'od', intermittent: false, alternating: true, near: false },
        cfgFar: null, cfgNear: null,
        covered: null,
        fixating: 'od',
        gain: 1.6,
        mode: 'train',
        revealed: false,
        log: []
      };

      var face = buildFace({ uid: 'ct' });
      var logBox = el('div', { class: 'log' });
      var readout = el('div');

      function addLog(txt, strong) {
        st.log.unshift(txt);
        logBox.insertBefore(el('div', { class: 'log-line', html: (strong ? '<b>' : '') + txt + (strong ? '</b>' : '') }), logBox.firstChild);
      }

      /* --- occluder --- */
      var occ = el('div', { class: 'occluder handheld', style: { left: '4%', top: '18%' } }, 'ÉCRAN');
      var stage = el('div', { class: 'stage', style: { position: 'relative', padding: '10px' } }, [
        el('div', { class: 'stage-label', text: 'Patient — cover test' }),
        face.node, occ
      ]);

      var occPct = 4;
      function occZone() {
        if (occPct < 22) return 'od';
        if (occPct > 52) return 'os';
        return null;
      }
      function updateOccluder() {
        occ.style.left = occPct + '%';
        var z = occZone();
        if (z !== st.covered) {
          setCover(z);
        }
      }
      occ.addEventListener('pointerdown', function () { occ._base = occPct; });
      UI.draggable(occ, function (dx) {
        var w = stage.getBoundingClientRect().width;
        occPct = Math.max(-4, Math.min(80, (occ._base || 0) + (dx / w) * 100));
        updateOccluder();
      });

      function setCover(zone, silent) {
        var prev = st.covered;
        st.covered = zone;
        // qui fixe après le mouvement ?
        if (zone) st.fixating = zone === 'od' ? 'os' : 'od';
        else if (st.cfg.manifest && !st.cfg.alternating) st.fixating = st.cfg.dominant;
        else if (st.cfg.manifest && prev) st.fixating = prev === 'od' ? 'os' : 'od';

        var before = computePositions(st.cfg, prev, prev ? (prev === 'od' ? 'os' : 'od') : st.fixating, st.gain);
        var after = computePositions(st.cfg, zone, st.fixating, st.gain);
        face.setTarget(after.od, after.os);

        if (!silent) {
          var moved = [];
          ['od', 'os'].forEach(function (e) {
            if (zone === e) return; // caché
            var dx = after[e].x - before[e].x, dy = after[e].y - before[e].y;
            if (Math.abs(dx) > 0.6 || Math.abs(dy) > 0.6) {
              var dir = [];
              if (Math.abs(dx) > 0.6) dir.push(((e === 'od') === (dx > 0)) ? 'de dehors en dedans' : 'de dedans en dehors');
              if (Math.abs(dy) > 0.6) dir.push(dy < 0 ? 'de bas en haut' : 'de haut en bas');
              moved.push((e === 'od' ? 'OD' : 'OG') + ' se déplace ' + dir.join(' et '));
            }
          });
          var label = zone ? ('Écran sur ' + (zone === 'od' ? 'l’œil droit' : 'l’œil gauche')) : 'Écran retiré';
          addLog(label + ' → ' + (moved.length ? moved.join(' ; ') : 'aucun mouvement visible'), moved.length > 0);
        }
        drawReadout();
      }

      function drawReadout() {
        UI.clear(readout);
        var c = st.cfg;
        readout.appendChild(el('div', { class: 'flex wrap' }, [
          UI.chip(st.covered ? 'Occlusion : ' + st.covered.toUpperCase() : 'Aucune occlusion', st.covered ? 'amber' : ''),
          UI.chip('Œil fixateur : ' + st.fixating.toUpperCase(), 'blue'),
          UI.chip('Distance : ' + (c.near ? 'près (40 cm)' : 'loin (5 m)'))
        ]));
        if (st.revealed) {
          readout.appendChild(UI.note('<b>Solution :</b> ' + describe(c) + '.'));
        }
      }

      function describe(c) {
        if (Math.abs(c.h) < 1 && Math.abs(c.v) < 1) return 'orthophorie';
        var parts = [];
        if (Math.abs(c.h) >= 1) {
          parts.push((c.h > 0 ? 'exo' : 'éso') + (c.manifest ? 'tropie' : 'phorie') + ' de ' + Math.abs(c.h) + ' Δ');
        }
        if (Math.abs(c.v) >= 1) {
          parts.push('hyper' + (c.manifest ? 'tropie' : 'phorie') + ' ' + (c.v > 0 ? 'OD' : 'OG') + ' de ' + Math.abs(c.v) + ' Δ');
        }
        var extra = [];
        if (c.manifest && c.alternating) extra.push('alternante');
        if (c.manifest && !c.alternating) extra.push('unilatérale, dominance ' + c.dominant.toUpperCase());
        if (c.intermittent) extra.push('intermittente');
        return parts.join(' + ') + (extra.length ? ' (' + extra.join(', ') + ')' : '');
      }

      /* --- séquences automatiques --- */
      function seqAlternate() {
        var steps = ['od', 'os', 'od', 'os', null];
        var i = 0;
        addLog('— Écran alterné —');
        (function next() {
          if (i >= steps.length) return;
          setCover(steps[i]);
          occPct = steps[i] === 'od' ? 18 : steps[i] === 'os' ? 62 : 4;
          occ.style.left = occPct + '%';
          i++;
          setTimeout(next, 900);
        })();
      }

      function seqUnilateral(eye) {
        addLog('— Écran unilatéral ' + eye.toUpperCase() + ' —');
        setCover(eye);
        occPct = eye === 'od' ? 18 : 62; occ.style.left = occPct + '%';
        setTimeout(function () {
          setCover(null);
          occPct = 4; occ.style.left = '4%';
        }, 1100);
      }

      /* --- génération de cas --- */
      function newCase(preset) {
        UI.clear(logBox);
        st.log = [];
        st.revealed = false;
        if (preset) {
          st.cfgFar = { h: preset.farH, v: preset.farV, manifest: !!preset.manifest, dominant: preset.dominant || 'od', alternating: !!preset.alternating, intermittent: !!preset.intermittent, near: false };
          st.cfgNear = { h: preset.nearH, v: preset.nearV, manifest: !!preset.manifest, dominant: preset.dominant || 'od', alternating: !!preset.alternating, intermittent: !!preset.intermittent, near: true };
        } else {
          var r = Math.random();
          var manifest = r < 0.45;
          var h = 0, v = 0;
          var kind = Math.random();
          if (kind < 0.4) h = -(2 + Math.floor(Math.random() * 12) * 2);       // éso
          else if (kind < 0.8) h = 2 + Math.floor(Math.random() * 12) * 2;     // exo
          if (Math.random() < 0.35) v = (Math.random() < 0.5 ? 1 : -1) * (2 + Math.floor(Math.random() * 5) * 2);
          if (Math.abs(h) < 2 && Math.abs(v) < 2) h = 4;
          var near = h + (h < 0 ? -Math.floor(Math.random() * 12) : Math.floor(Math.random() * 12));
          st.cfgFar = { h: h, v: v, manifest: manifest, dominant: Math.random() < 0.5 ? 'od' : 'os', alternating: Math.random() < 0.5, intermittent: manifest && Math.random() < 0.3, near: false };
          st.cfgNear = Object.assign({}, st.cfgFar, { h: near, near: true });
        }
        st.cfg = st.cfgFar;
        st.covered = null;
        st.fixating = st.cfg.dominant;
        occPct = 4; occ.style.left = '4%';
        var p = computePositions(st.cfg, null, st.fixating, st.gain);
        face.snap(p.od, p.os);
        addLog('Nouveau patient. Observez d’abord en vision binoculaire, puis faites votre cover test.');
        drawReadout();
        UI.clear(answerBox);
        buildAnswer();
      }

      /* --- réponse de l’étudiant --- */
      var answerBox = el('div');
      function buildAnswer() {
        UI.clear(answerBox);
        var typeSel = UI.select([
          'Orthophorie', 'Exophorie', 'Ésophorie', 'Exotropie', 'Ésotropie',
          'Hyperphorie OD', 'Hyperphorie OG', 'Hypertropie OD', 'Hypertropie OG'
        ], 'Orthophorie', function () {});
        var magIn = UI.num(0, function () {}, { step: 1, min: 0, max: 80 });
        var distSel = UI.select([{ value: 'far', label: 'De loin' }, { value: 'near', label: 'De près' }], 'far', function (v) {
          st.cfg = v === 'far' ? st.cfgFar : st.cfgNear;
          var p = computePositions(st.cfg, st.covered, st.fixating, st.gain);
          face.snap(p.od, p.os);
          addLog('Passage en vision ' + (v === 'far' ? 'de loin (5 m)' : 'de près (40 cm)') + '.');
          drawReadout();
        });

        answerBox.appendChild(el('div', { class: 'grid g3' }, [
          UI.field('Distance testée', distSel),
          UI.field('Diagnostic', typeSel),
          UI.field('Amplitude estimée (Δ)', magIn)
        ]));
        answerBox.appendChild(el('div', { class: 'btn-row' }, [
          UI.btn('Valider ma réponse', function () {
            var c = st.cfg;
            var expectedType = (function () {
              if (Math.abs(c.h) < 2 && Math.abs(c.v) < 2) return 'Orthophorie';
              if (Math.abs(c.h) >= Math.abs(c.v)) {
                return (c.h > 0 ? 'Exo' : 'Éso') + (c.manifest ? 'tropie' : 'phorie');
              }
              return 'Hyper' + (c.manifest ? 'tropie ' : 'phorie ') + (c.v > 0 ? 'OD' : 'OG');
            })();
            var mainMag = Math.abs(c.h) >= Math.abs(c.v) ? Math.abs(c.h) : Math.abs(c.v);
            var typeOk = typeSel.value === expectedType;
            var given = parseFloat(magIn.value) || 0;
            var magErr = Math.abs(given - mainMag);
            var magScore = Math.max(0, 100 - magErr * 8);
            var score = Math.round(typeOk ? (50 + magScore / 2) : magScore / 4);
            Store.recordScore('covertest', score);
            st.revealed = true;
            drawReadout();
            answerBox.appendChild(UI.note(
              (typeOk ? '✔ Type correct' : '✘ Type attendu : <b>' + expectedType + '</b>') +
              ' — amplitude réelle <b>' + mainMag + ' Δ</b> (écart de ' + Optics.r2(magErr, 0) + ' Δ). Score : <b>' + score + ' %</b>.<br>' +
              'Tableau complet : ' + describe(c) + '.',
              typeOk && magErr <= 4 ? '' : 'warn'));
          }, 'primary'),
          UI.btn('Voir la solution', function () { st.revealed = true; drawReadout(); }),
          cp.sim ? null : UI.btn('Nouveau patient', function () { newCase(); })
        ].filter(Boolean)));
      }

      var controls = el('div', { class: 'card' }, [
        el('div', { class: 'btn-row' }, [
          UI.btn('Écran sur OD', function () { seqUnilateral('od'); }),
          UI.btn('Écran sur OG', function () { seqUnilateral('os'); }),
          UI.btn('Écran alterné', seqAlternate),
          UI.btn('Retirer l’écran', function () { setCover(null); occPct = 4; occ.style.left = '4%'; }),
          el('span', { class: 'spacer' }),
          el('span', { class: 'muted small', text: 'Amplification visuelle :' }),
          (function () {
            var r = UI.range(1, 4, 0.2, st.gain, function (v) {
              st.gain = v;
              var p = computePositions(st.cfg, st.covered, st.fixating, st.gain);
              face.snap(p.od, p.os);
            }, function (v) { return '×' + v.toFixed(1); });
            r.style.width = '200px';
            return r;
          })()
        ])
      ]);

      newCase(cp.covertest || (cp.sim && cp.sim.covertest) || null);
      if (cp.sim) {
        controls.appendChild(UI.note('📁 <b>Dossier patient</b> — mesurez <b>de loin puis de près</b> avec le sélecteur ci-dessous : ' +
          'chez ce patient les deux valeurs ne sont pas les mêmes.'));
      }

      var theory = UI.card('Méthode du cover test', UI.accordion([
        { title: 'Cover test unilatéral (écran-découvre) — dépiste les TROPIES', open: true, body:
          '<ol><li>Le patient fixe une cible <b>accommodative</b> adaptée à son acuité (jamais une lumière seule chez l’enfant : elle ne contrôle pas l’accommodation).</li>' +
          '<li>On occlut un œil et on observe <b>l’œil découvert</b> : s’il se déplace pour prendre la fixation, il était dévié → <b>tropie</b>.</li>' +
          '<li>Le sens du mouvement donne le sens de la déviation : de dehors en dedans = exotropie ; de dedans en dehors = ésotropie ; de bas en haut = hypotropie de cet œil.</li>' +
          '<li>On retire l’écran et on observe le comportement : refixation immédiate (dominance forte) ou maintien (alternance).</li></ol>' },
        { title: 'Cover test alterné — mesure la déviation TOTALE', body:
          '<p>On passe l’écran d’un œil à l’autre sans jamais laisser les deux yeux découverts, pour rompre complètement la fusion. Le mouvement observé à chaque passage correspond à la déviation totale (phorie + tropie). C’est cette valeur que l’on neutralise aux prismes.</p>' +
          '<p><b>Attention :</b> l’écran alterné ne permet pas de distinguer une phorie d’une tropie. Il faut toujours commencer par le cover test unilatéral.</p>' },
        { title: 'Cover-uncover et recouvrement', body:
          '<p>Après l’occlusion, on observe l’œil qui vient d’être découvert : le mouvement de retour est le <b>recouvrement</b>. On le qualifie de rapide, lent, ou absent. Un recouvrement lent ou incomplet traduit une fusion fragile — argument majeur dans les exophories décompensées.</p>' },
        { title: 'Conditions à respecter', body:
          '<ul><li>Toujours de loin (5 m) <b>et</b> de près (33–40 cm).</li><li>Avec et sans correction optique.</li><li>Dans les 9 positions du regard si l’on suspecte une incomitance.</li>' +
          '<li>Éclairage suffisant pour bien voir les reflets et les mouvements.</li><li>Écran opaque, tenu près de l’œil mais sans le toucher.</li></ul>' },
        { title: 'Pièges classiques', body:
          '<ul><li>Un <b>angle kappa</b> important simule une déviation aux reflets : seul le cover test tranche.</li>' +
          '<li>Une <b>déviation verticale dissociée</b> donne une élévation lente de l’œil occlus, sans hypotropie de l’autre œil — elle ne suit pas la loi de Hering.</li>' +
          '<li>Dans une <b>microtropie</b>, le mouvement est minuscule : utiliser le test des 4 Δ base externe.</li>' +
          '<li>Chez l’enfant, une cible non accommodative sous-estime toujours une ésotropie accommodative.</li></ul>' }
      ]));

      return UI.page({
        crumb: 'Simulateurs',
        title: 'Cover test',
        subtitle: 'Un patient est tiré au sort. <b>Faites glisser l’écran</b> devant l’un ou l’autre œil, observez les mouvements de refixation, ' +
                  'puis concluez sur le type et l’amplitude de la déviation.'
      }, [
        controls,
        el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Salle d’examen', [stage, readout]),
            UI.card('Votre conclusion', answerBox)
          ]),
          el('div', {}, [
            UI.card('Journal d’observation', logBox),
            theory
          ])
        ])
      ]);
    }
  };
})();
