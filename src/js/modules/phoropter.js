/* ============================================================
   Phoroptère virtuel — réfraction subjective sur patient simulé
   ------------------------------------------------------------
   Le flou rétinien est calculé à partir du résidu de réfraction
   exprimé en vecteurs de puissance (M, J0, J45), puis appliqué
   sous forme de flou gaussien anisotrope orienté sur l'axe.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;
  var R = Optics.Refraction;

  var LETTERS = 'ZUAHNOSCKRVDFLPTEXMGB'.split('');
  var LINES = [0.1, 0.16, 0.25, 0.32, 0.4, 0.5, 0.63, 0.8, 1.0];
  var PX_PER_ARCMIN = 1.7;

  /* ---------- utilitaires vectoriels ---------- */
  function toVec(r) {
    var a = r.axis * Math.PI / 180;
    return {
      M: r.sph + r.cyl / 2,
      J0: -(r.cyl / 2) * Math.cos(2 * a),
      J45: -(r.cyl / 2) * Math.sin(2 * a)
    };
  }
  function fromVec(v) {
    var k = Math.sqrt(v.J0 * v.J0 + v.J45 * v.J45);
    var C = -2 * k;
    var a = 0.5 * Math.atan2(v.J45, v.J0) * 180 / Math.PI;
    while (a < 0) a += 180;
    while (a >= 180) a -= 180;
    return { sph: v.M - C / 2, cyl: C, axis: a };
  }
  function subVec(a, b) { return { M: a.M - b.M, J0: a.J0 - b.J0, J45: a.J45 - b.J45 }; }
  function vecMag(v) { return Math.sqrt(v.M * v.M + v.J0 * v.J0 + v.J45 * v.J45); }

  /* PRNG déterministe (lettres stables pour un patient donné) */
  function rng(seed) {
    var x = seed || 1;
    return function () { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; };
  }

  function randomRefraction(rand) {
    var kind = rand();
    var sph;
    if (kind < 0.4) sph = -(0.5 + Math.round(rand() * 22) * 0.25);        // myopie
    else if (kind < 0.75) sph = 0.5 + Math.round(rand() * 18) * 0.25;      // hypermétropie
    else sph = Math.round((rand() * 2 - 1) * 4) * 0.25;                    // faible
    var cyl = rand() < 0.25 ? 0 : -(0.25 + Math.round(rand() * 11) * 0.25);
    var axis = cyl === 0 ? 0 : [180, 175, 170, 10, 5, 90, 85, 95, 45, 135, 20, 160, 70, 110][Math.floor(rand() * 14)];
    return { sph: Math.round(sph * 4) / 4, cyl: Math.round(cyl * 4) / 4, axis: axis };
  }

  M.phoropter = {
    id: 'phoropter', title: 'Phoroptère virtuel', icon: '🔭', group: 'Simulateurs',
    desc: 'Réfraction subjective complète : sphère, cylindre, axe, duochrome, CCJ',
    keywords: 'phoroptere refraction subjective cylindre croise jackson duochrome bichrome brouillard sphere axe',
    render: function (ctx) {
      var st = {
        seed: Date.now() % 100000,
        truth: { od: null, os: null },
        dial: { od: { sph: 0, cyl: 0, axis: 90 }, os: { sph: 0, cyl: 0, axis: 90 } },
        eye: 'od',
        occl: 'os',
        duochrome: false,
        pupil: Store.setting('pupil') || 4,
        prev: null,
        started: false,
        revealed: false,
        steps: 0
      };

      var pp = (ctx && ctx.params) || {};
      var preset = pp.refraction || (pp.sim && pp.sim.refraction) || null;

      function newPatient(fromCase) {
        // en mode dossier la graine dérive de la réfraction : les optotypes ne changent plus à chaque ouverture
        st.seed = fromCase
          ? Math.abs(Math.round(fromCase.od.sph * 400 + fromCase.os.sph * 137 + (fromCase.od.axis || 0) * 7 + (fromCase.od.cyl || 0) * 61)) + 1
          : Math.floor(Math.random() * 99999) + 1;
        var rand = rng(st.seed);
        if (fromCase) {
          st.truth.od = { sph: fromCase.od.sph, cyl: fromCase.od.cyl, axis: fromCase.od.axis || 180 };
          st.truth.os = { sph: fromCase.os.sph, cyl: fromCase.os.cyl, axis: fromCase.os.axis || 180 };
        } else {
          st.truth.od = randomRefraction(rand);
          st.truth.os = randomRefraction(rand);
          // anisométropie limitée dans 80 % des cas
          if (rand() < 0.8) st.truth.os.sph = Math.round((st.truth.od.sph + (rand() * 2 - 1)) * 4) / 4;
        }
        st.dial = { od: { sph: 0, cyl: 0, axis: 90 }, os: { sph: 0, cyl: 0, axis: 90 } };
        st.prev = null; st.revealed = false; st.started = true; st.steps = 0;
        st.eye = 'od'; st.occl = 'os';
        refreshAll();
        say('Bonjour ! Je vois flou, on m’a dit de venir faire contrôler ma vue.');
      }

      /* ---------- calculs ---------- */
      function residual(eye) {
        var v = subVec(toVec(st.truth[eye]), toVec(st.dial[eye]));
        var r = fromVec(v);
        var p1 = r.sph;                 // puissance résiduelle sur l’axe
        var p2 = r.sph + r.cyl;         // puissance résiduelle à 90° de l’axe
        var b1 = R.blurArcmin(p1, st.pupil);
        var b2 = R.blurArcmin(p2, st.pupil);
        var bAvg = Math.sqrt((b1 * b1 + b2 * b2) / 2);
        var mar = Math.max(1, Math.sqrt(1 + 0.55 * bAvg * bAvg));
        return { r: r, M: v.M, mag: vecMag(v), b1: b1, b2: b2, acuity: 1 / mar };
      }

      function activeEye() {
        if (st.occl === 'os') return 'od';
        if (st.occl === 'od') return 'os';
        // binoculaire : on affiche le meilleur des deux
        return residual('od').mag <= residual('os').mag ? 'od' : 'os';
      }

      /* ---------- machine (SVG) ---------- */
      var machineHolder = el('div');

      function drawMachine() {
        UI.clear(machineHolder);
        var g = s('svg', { viewBox: '0 0 560 300', style: 'width:100%;height:auto' });

        // corps
        g.appendChild(s('rect', { x: 40, y: 40, width: 480, height: 190, rx: 18, fill: '#1c2733', stroke: '#33475a', 'stroke-width': 3 }));
        g.appendChild(s('rect', { x: 60, y: 232, width: 440, height: 16, rx: 8, fill: '#22303d', stroke: '#33475a' }));
        g.appendChild(s('text', { x: 280, y: 262, fill: '#5f7688', 'font-size': '11', 'text-anchor': 'middle' }, 'Appui frontal'));
        g.appendChild(s('text', { x: 280, y: 28, fill: '#6d8296', 'font-size': '11', 'text-anchor': 'middle' }, 'PHOROPTÈRE — vue patient'));

        [['od', 168], ['os', 392]].forEach(function (p) {
          var eye = p[0], cx = p[1];
          var occluded = st.occl === eye;
          var act = st.eye === eye;
          var d = st.dial[eye];

          g.appendChild(s('circle', { cx: cx, cy: 132, r: 66, fill: '#0d151d', stroke: act ? '#35c4b5' : '#3d5266', 'stroke-width': act ? 4 : 3 }));
          g.appendChild(s('circle', { cx: cx, cy: 132, r: 52, fill: occluded ? '#182430' : 'rgba(120,190,230,.09)', stroke: '#2c3f52' }));

          if (occluded) {
            g.appendChild(s('rect', { x: cx - 54, y: 78, width: 108, height: 108, rx: 8, fill: '#26333f', stroke: '#3d5266' }));
            g.appendChild(s('text', { x: cx, y: 138, fill: '#7b93a8', 'font-size': '13', 'text-anchor': 'middle' }, 'OCCLUS'));
          } else {
            // trait d’axe du cylindre
            if (d.cyl !== 0) {
              var a = -d.axis * Math.PI / 180;
              g.appendChild(s('line', {
                x1: cx - 46 * Math.cos(a), y1: 132 - 46 * Math.sin(a),
                x2: cx + 46 * Math.cos(a), y2: 132 + 46 * Math.sin(a),
                stroke: '#f0b23c', 'stroke-width': 3, 'stroke-dasharray': '6 4'
              }));
              g.appendChild(s('text', { x: cx, y: 186, fill: '#f0b23c', 'font-size': '11', 'text-anchor': 'middle' }, 'axe ' + d.axis + '°'));
            }
            g.appendChild(s('text', { x: cx, y: 128, fill: '#e6edf3', 'font-size': '17', 'text-anchor': 'middle', 'font-family': 'monospace' },
              Optics.formatDpt(d.sph)));
            if (d.cyl !== 0) {
              g.appendChild(s('text', { x: cx, y: 150, fill: '#a5b6c5', 'font-size': '14', 'text-anchor': 'middle', 'font-family': 'monospace' },
                '(' + Optics.formatDpt(d.cyl) + ')'));
            }
          }
          g.appendChild(s('text', { x: cx, y: 214, fill: act ? '#35c4b5' : '#6d8296', 'font-size': '12', 'text-anchor': 'middle', 'font-weight': '700' },
            eye === 'od' ? 'ŒIL DROIT' : 'ŒIL GAUCHE'));

          // molettes latérales décoratives
          [-90, 90].forEach(function (dx) {
            g.appendChild(s('circle', { cx: cx + dx, cy: 60, r: 12, fill: '#2b3b4b', stroke: '#3d5266' }));
          });
        });

        machineHolder.appendChild(g);
      }

      /* ---------- écran d’optotypes ---------- */
      var chartInner = el('div', { class: 'optotype-screen' });
      var rotOuter = el('div', {}, el('div', { style: { filter: 'url(#fx-astig)' } }, chartInner));
      var screenBox = el('div', { class: 'stage', style: { minHeight: '380px', padding: '18px' } }, [
        el('div', { class: 'stage-label', text: 'Vue du patient' }),
        rotOuter
      ]);
      var rotInner = chartInner;

      function buildChart() {
        UI.clear(chartInner);
        var rand = rng(st.seed);
        if (st.duochrome) {
          var half = el('div', { style: { display: 'flex', width: '100%', minHeight: '210px' } });
          [['#c8202a', 'ROUGE'], ['#0f8f3d', 'VERT']].forEach(function (side, i) {
            var col = el('div', { style: { flex: '1', background: side[0], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px' } });
            for (var k = 0; k < 3; k++) {
              col.appendChild(el('div', {
                style: { color: '#000', fontSize: (5 / 0.5 * PX_PER_ARCMIN) + 'px', lineHeight: '1.25', fontWeight: '700' },
                text: LETTERS[Math.floor(rand() * LETTERS.length)] + LETTERS[Math.floor(rand() * LETTERS.length)] + LETTERS[Math.floor(rand() * LETTERS.length)]
              }));
            }
            half.appendChild(col);
          });
          chartInner.appendChild(half);
          return;
        }
        LINES.forEach(function (v) {
          var h = (5 / v) * PX_PER_ARCMIN;
          var n = v < 0.3 ? 3 : v < 0.6 ? 5 : 7;
          var word = '';
          for (var i = 0; i < n; i++) word += LETTERS[Math.floor(rand() * LETTERS.length)];
          chartInner.appendChild(el('div', { class: 'opt-row' }, [
            el('span', { class: 'lbl', text: Optics.r2(v * 10, 1) + '/10' }),
            el('span', { style: { fontSize: h + 'px', lineHeight: '1.05' }, text: word })
          ]));
        });
      }

      function applyBlur() {
        var eye = activeEye();
        var res = residual(eye);
        var sx = Math.min(60, res.b1 * PX_PER_ARCMIN / 2.5);
        var sy = Math.min(60, res.b2 * PX_PER_ARCMIN / 2.5);
        var f = document.getElementById('fx-astig-blur');
        if (f) f.setAttribute('stdDeviation', sx.toFixed(2) + ' ' + sy.toFixed(2));
        var ax = res.r.cyl !== 0 ? res.r.axis : 0;
        rotOuter.style.transform = 'rotate(' + (-ax) + 'deg)';
        rotInner.style.transform = 'rotate(' + ax + 'deg)';
        return res;
      }

      /* ---------- retour du patient ---------- */
      var speech = el('div', { class: 'speech' }, [el('span', { class: 'who', text: 'Patient' }), el('span', { class: 'txt', text: '—' })]);
      function say(t) { speech.querySelector('.txt').textContent = t; }

      function patientComment(res) {
        if (!st.prev) { st.prev = res.mag; return; }
        var delta = st.prev - res.mag;
        st.prev = res.mag;
        if (res.mag < 0.2) say('Là c’est vraiment net, je lis tout en bas sans forcer.');
        else if (Math.abs(delta) < 0.12) say('Hmm… c’est à peu près pareil entre les deux.');
        else if (delta > 0) say(delta > 0.6 ? 'Ah oui, beaucoup plus net !' : 'C’est un peu mieux.');
        else say(delta < -0.6 ? 'Non, là c’est nettement plus flou.' : 'C’est un petit peu moins bien.');
      }

      /* ---------- HUD ---------- */
      var hud = el('div', { class: 'stage-hud' });
      function drawHud(res) {
        UI.clear(hud);
        var eye = activeEye();
        hud.appendChild(el('span', { class: 'hud-tag', text: 'Œil testé : ' + eye.toUpperCase() }));
        hud.appendChild(el('span', { class: 'hud-tag', text: 'Acuité atteinte : ' + Optics.r2(res.acuity * 10, 1) + '/10' }));
        hud.appendChild(el('span', { class: 'hud-tag', text: 'Pupille ' + st.pupil + ' mm' }));
        hud.appendChild(el('span', { class: 'hud-tag', text: 'Distance ' + Store.setting('testDistance') + ' m' }));
        if (st.revealed) hud.appendChild(el('span', { class: 'hud-tag', style: { color: '#f0b23c' }, text: 'Résidu ' + Optics.formatRx(Optics.r2(res.r.sph, 2), Optics.r2(res.r.cyl, 2), Math.round(res.r.axis)) }));
      }
      screenBox.appendChild(hud);

      /* ---------- molettes ---------- */
      var knobSph, knobCyl, knobAxis;
      var knobBox = el('div');

      function buildKnobs() {
        UI.clear(knobBox);
        var d = st.dial[st.eye];
        knobSph = UI.knob({
          value: d.sph, min: -15, max: 12, step: 0.25, label: 'Sphère',
          format: function (v) { return Optics.formatDpt(v); },
          onChange: function (v) { st.dial[st.eye].sph = v; st.steps++; refreshAll(true); }
        });
        knobCyl = UI.knob({
          value: d.cyl, min: -6, max: 0, step: 0.25, label: 'Cylindre',
          format: function (v) { return v === 0 ? '0.00' : Optics.formatDpt(v); },
          onChange: function (v) { st.dial[st.eye].cyl = v; st.steps++; refreshAll(true); }
        });
        knobAxis = UI.knob({
          value: d.axis, min: 0, max: 180, step: 5, label: 'Axe',
          format: function (v) { return v + '°'; },
          onChange: function (v) { st.dial[st.eye].axis = v; st.steps++; refreshAll(true); }
        });
        knobBox.appendChild(el('div', { class: 'flex', style: { justifyContent: 'space-around', flexWrap: 'wrap' } }, [knobSph, knobCyl, knobAxis]));

        function stepper(label, delta, key) {
          return UI.btn(label, function () {
            var dd = st.dial[st.eye];
            if (key === 'axis') dd.axis = (dd.axis + delta + 180) % 180;
            else dd[key] = Math.round((dd[key] + delta) * 100) / 100;
            if (key === 'cyl') dd.cyl = Math.min(0, Math.max(-6, dd.cyl));
            st.steps++;
            buildKnobs(); refreshAll(true);
          }, 'sm');
        }
        knobBox.appendChild(el('div', { class: 'flex wrap', style: { justifyContent: 'center', marginTop: '6px' } }, [
          stepper('−0,25 sph', -0.25, 'sph'), stepper('+0,25 sph', 0.25, 'sph'),
          stepper('−0,25 cyl', -0.25, 'cyl'), stepper('+0,25 cyl', 0.25, 'cyl'),
          stepper('axe −5°', -5, 'axis'), stepper('axe +5°', 5, 'axis')
        ]));
      }

      /* ---------- outils (duochrome, CCJ, brouillard) ---------- */
      var toolFeedback = el('div', { class: 'small muted', style: { minHeight: '38px' } });

      function duochromeAnswer() {
        var eye = activeEye();
        var m = residual(eye).M;   // > 0 : il manque du +   ; < 0 : il manque du −
        if (Math.abs(m) < 0.15) return 'Les deux côtés sont aussi nets — l’équilibre est bon, on s’arrête là.';
        if (m < 0) return 'Les lettres sur le fond ROUGE sont plus nettes.';
        return 'Les lettres sur le fond VERT sont plus nettes.';
      }

      function jccAxis() {
        var eye = activeEye();
        var d = st.dial[eye];
        if (d.cyl === 0) return 'Impossible : il n’y a pas encore de cylindre en place. Cherchez d’abord la puissance au cadran horaire.';
        function magWith(rot) {
          var test = { sph: d.sph, cyl: d.cyl, axis: (d.axis + rot + 180) % 180 };
          return vecMag(subVec(toVec(st.truth[eye]), toVec(test)));
        }
        var a = magWith(-5), b = magWith(5);
        if (Math.abs(a - b) < 0.03) return 'Position 1 et position 2 sont identiques — l’axe est trouvé.';
        return a < b ? 'La position 1 est plus nette (tourner l’axe vers −5°).' : 'La position 2 est plus nette (tourner l’axe vers +5°).';
      }

      function jccPower() {
        var eye = activeEye();
        var d = st.dial[eye];
        function magWith(dc) {
          var test = { sph: d.sph - dc / 2, cyl: Math.min(0, d.cyl + dc), axis: d.axis };
          return vecMag(subVec(toVec(st.truth[eye]), toVec(test)));
        }
        var more = magWith(-0.25), less = magWith(0.25);
        if (Math.abs(more - less) < 0.03) return 'Les deux positions se valent — la puissance du cylindre est correcte.';
        return more < less ? 'La position « plus de cylindre » est plus nette (ajouter −0,25 et +0,12 de sphère).'
                           : 'La position « moins de cylindre » est plus nette (retirer −0,25 de cylindre).';
      }

      /* ---------- validation ---------- */
      var scoreBox = el('div');

      function validate() {
        var lines = [];
        var total = 0;
        ['od', 'os'].forEach(function (eye) {
          var t = st.truth[eye], d = st.dial[eye];
          var mag = vecMag(subVec(toVec(t), toVec(d)));
          var pen = Math.min(100, mag * 90);
          var sc = Math.round(Math.max(0, 100 - pen));
          total += sc;
          var axErr = t.cyl !== 0 && d.cyl !== 0 ? Math.min(Math.abs(t.axis - d.axis), 180 - Math.abs(t.axis - d.axis)) : 0;
          lines.push([
            eye.toUpperCase(),
            Optics.formatRx(d.sph, d.cyl, d.axis),
            Optics.formatRx(t.sph, t.cyl, t.axis),
            Optics.formatDpt(Optics.r2(R.sphericalEquivalent(d.sph, d.cyl) - R.sphericalEquivalent(t.sph, t.cyl), 2)),
            axErr + '°',
            sc + ' %'
          ]);
        });
        var final = Math.round(total / 2);
        Store.recordScore('phoropter', final, { steps: st.steps });
        st.revealed = true;

        UI.clear(scoreBox);
        scoreBox.appendChild(UI.card('Résultat de la réfraction', [
          el('div', { class: 'grid g3' }, [
            UI.stat(final + ' %', 'Précision globale', final >= 80 ? 'var(--green)' : final >= 55 ? 'var(--amber)' : 'var(--red)'),
            UI.stat(st.steps, 'Manipulations'),
            UI.stat(Optics.r2(residual('od').acuity * 10, 1) + '/10', 'Acuité OD obtenue')
          ]),
          UI.table(['Œil', 'Votre réfraction', 'Réfraction réelle', 'Écart d’ES', 'Écart d’axe', 'Score'], lines),
          UI.note(final >= 85 ? '<b>Excellent.</b> Réfraction cliniquement superposable à la réalité.'
            : final >= 60 ? '<b>Correct.</b> Reprenez la recherche du cylindre : c’est là que se joue la précision. Pensez au cadran horaire puis au CCJ.'
            : '<b>À retravailler.</b> Méthode : brouillard (+1,50), réduction du + par pas de 0,25 jusqu’à la meilleure acuité, puis axe au CCJ, puis puissance, puis contrôle bichrome.',
            final >= 60 ? '' : 'warn')
        ]));
        refreshAll();
      }

      /* ---------- rafraîchissement global ---------- */
      function refreshAll(comment) {
        drawMachine();
        buildChart();
        var res = applyBlur();
        drawHud(res);
        if (comment) patientComment(res);
      }

      /* ---------- assemblage ---------- */
      var toolbar = el('div', { class: 'card' }, [
        el('div', { class: 'btn-row' }, [
          preset ? null : UI.btn('🎲 Nouveau patient', function () { newPatient(); UI.clear(scoreBox); }, 'primary'),
          el('span', { class: 'muted small', text: 'Œil manipulé :' }),
          UI.btn('OD', function () { st.eye = 'od'; st.occl = 'os'; buildKnobs(); refreshAll(); }),
          UI.btn('OG', function () { st.eye = 'os'; st.occl = 'od'; buildKnobs(); refreshAll(); }),
          UI.btn('Binoculaire', function () { st.occl = null; refreshAll(); }),
          el('span', { class: 'spacer' }),
          UI.btn('Brouillard +1,50', function () {
            st.dial[st.eye].sph = Math.round((st.dial[st.eye].sph + 1.5) * 4) / 4;
            buildKnobs(); refreshAll(true);
            say('Tout est flou maintenant, c’est normal ?');
          }),
          UI.btn('Valider la réfraction', validate),
          UI.btn('Aide méthode', function () { UI.toast('Brouillard → réduire le + par 0,25 → axe au CCJ → puissance au CCJ → bichrome → équilibre binoculaire', 6000); })
        ].filter(Boolean)),
        preset ? UI.note('📁 <b>Dossier patient</b> — la réfraction réelle de ce patient est chargée mais reste cachée. ' +
          'Faites les <b>deux yeux</b> avec les boutons OD / OG, puis validez : votre mesure sera comparée à la sienne.') : null
      ].filter(Boolean));

      var right = el('div', {}, [
        UI.card('Écran de projection', [
          screenBox,
          el('div', { class: 'btn-row', style: { marginTop: '10px' } }, [
            (function () {
              var b = UI.btn('Test bichrome (rouge/vert)', function () {
                st.duochrome = !st.duochrome;
                b.classList.toggle('primary', st.duochrome);
                refreshAll();
                toolFeedback.innerHTML = st.duochrome ? '<b>Patient :</b> ' + duochromeAnswer() : '';
              });
              return b;
            })(),
            UI.btn('CCJ — axe', function () { toolFeedback.innerHTML = '<b>Patient :</b> ' + jccAxis(); }),
            UI.btn('CCJ — puissance', function () { toolFeedback.innerHTML = '<b>Patient :</b> ' + jccPower(); }),
            UI.btn('Interroger le patient', function () {
              var res = residual(activeEye());
              say(res.acuity >= 0.95 ? 'Je lis la dernière ligne sans difficulté.'
                : res.acuity >= 0.6 ? 'Je lis jusqu’à la ligne ' + Optics.r2(res.acuity * 10, 0) + '/10 environ.'
                : res.acuity >= 0.25 ? 'C’est encore flou, je m’arrête vers ' + Optics.r2(res.acuity * 10, 1) + '/10.'
                : 'Je ne distingue que les plus grosses lettres.');
            })
          ]),
          toolFeedback,
          speech
        ]),
        scoreBox
      ]);

      var left = el('div', {}, [
        UI.card('Le phoroptère', [machineHolder]),
        UI.card('Commandes', [
          knobBox,
          UI.note('Tournez les molettes à la <b>molette de la souris</b> ou en <b>glissant verticalement</b>. L’axe du cylindre s’affiche en pointillé jaune dans l’ouverture.')
        ]),
        UI.card('Protocole de réfraction subjective', UI.accordion([
          { title: '1 · Brouillard', body: 'Ajouter +1,00 à +1,50 D pour relâcher l’accommodation. L’acuité doit chuter vers 2 à 4/10.', open: true },
          { title: '2 · Sphère', body: 'Réduire le + par pas de 0,25 D jusqu’à la meilleure acuité. Règle d’or : <b>la sphère la plus convexe (ou la moins concave) donnant la meilleure acuité</b>.' },
          { title: '3 · Axe du cylindre', body: 'Cylindre croisé de Jackson à cheval sur l’axe présumé. On tourne l’axe vers la position préférée, par pas décroissants (10° → 5° → 2°).' },
          { title: '4 · Puissance du cylindre', body: 'Axes du CCJ alignés avec l’axe du cylindre. Pour chaque −0,50 de cylindre ajouté, compenser par +0,25 de sphère afin de garder l’équivalent sphérique.' },
          { title: '5 · Contrôle bichrome', body: 'Rouge plus net → ajouter du − (RAM). Vert plus net → ajouter du + (GAP). Objectif : égalité, ou très légèrement rouge.' },
          { title: '6 · Équilibre binoculaire', body: 'Brouillard alterné ou dissociation prismatique verticale de 3 Δ, puis désembrouillage binoculaire.' }
        ]))
      ]);

      newPatient(preset);
      buildKnobs();

      return UI.page({
        crumb: 'Simulateurs',
        title: 'Phoroptère virtuel',
        subtitle: 'Un patient anonyme s’installe : sa réfraction réelle est tirée au sort et vous est cachée. Manipulez les molettes, ' +
                  'interrogez-le, utilisez le bichrome et le cylindre croisé, puis validez.'
      }, [toolbar, el('div', { class: 'split-wide' }, [right, left])]);
    }
  };
})();
