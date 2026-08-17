/* ============================================================
   Skiascopie — réfraction objective au rétinoscope
   ------------------------------------------------------------
   Physique du reflet pupillaire :
     P(θ)  = sph + cyl · sin²(θ − axe)      puissance dans le méridien θ
     N     = 100 / distance de travail (cm) verre de distance de travail
     res   = (P(θ) + N) − L                 résidu avec le verre L en place
       res > 0 → ombre DIRECTE  (« avec »)   : il manque du +
       res < 0 → ombre INVERSE  (« contre ») : il y a trop de +
       res ≈ 0 → neutralisation : la pupille s'illumine d'un coup
   La largeur, la luminosité et la vitesse du reflet varient comme
   exp(−|res|) : c'est ce qui rend la neutralisation reconnaissable.
   Quand le balayage n'est pas sur un méridien principal, le reflet
   pupillaire s'incline par rapport à la fente projetée sur l'iris :
   c'est le phénomène de rupture, qui sert à trouver l'axe.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  var RAD = Math.PI / 180;
  var UID = 'skia' + Math.floor(Math.random() * 1e6);

  /* ---------- vecteurs de puissance (comparaison des réfractions) ---------- */
  function toVec(r) {
    var a = r.axis * RAD;
    return { M: r.sph + r.cyl / 2, J0: -(r.cyl / 2) * Math.cos(2 * a), J45: -(r.cyl / 2) * Math.sin(2 * a) };
  }
  function vecDist(a, b) {
    var va = toVec(a), vb = toVec(b);
    var dM = va.M - vb.M, d0 = va.J0 - vb.J0, d45 = va.J45 - vb.J45;
    return Math.sqrt(dM * dM + d0 * d0 + d45 * d45);
  }

  function rng(seed) {
    var x = seed || 1;
    return function () { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; };
  }

  function randomRefraction(rand) {
    var kind = rand(), sph;
    if (kind < 0.42) sph = -(0.5 + Math.round(rand() * 20) * 0.25);      // myopie
    else if (kind < 0.8) sph = 0.5 + Math.round(rand() * 16) * 0.25;     // hypermétropie
    else sph = Math.round((rand() * 2 - 1) * 3) * 0.25;                  // faible amétropie
    var cyl = rand() < 0.2 ? 0 : -(0.5 + Math.round(rand() * 9) * 0.25);
    var axis = cyl === 0 ? 0 : [180, 175, 170, 10, 5, 90, 85, 95, 45, 135, 20, 160][Math.floor(rand() * 12)];
    return { sph: Math.round(sph * 4) / 4, cyl: Math.round(cyl * 4) / 4, axis: axis };
  }

  function meridianPower(rx, theta) {
    var t = (theta - rx.axis) * RAD;
    return rx.sph + rx.cyl * Math.pow(Math.sin(t), 2);
  }

  function fmt(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2); }
  function normAxis(a) { a = a % 180; return a < 0 ? a + 180 : a; }

  M.skiascopy = {
    id: 'skiascopy', title: 'Skiascopie', icon: '🔦', group: 'Simulateurs',
    desc: 'Réfraction objective au rétinoscope : ombres directes, inverses, neutralisation',
    keywords: 'skiascopie retinoscopie skiascope retinoscope objective ombre directe inverse neutralisation verre de travail rupture axe',
    render: function (ctx) {
      var pp = (ctx && ctx.params) || {};
      var preset = pp.refraction || (pp.sim && pp.sim.refraction) || null;

      var st = {
        truth: { od: null, os: null },
        eye: 'od',
        lens: { od: 0, os: 0 },
        merid: 0,               // méridien balayé (°)
        workCm: 67,
        notes: { od: [], os: [] },
        answer: { od: null, os: null },
        off: 0,                 // position du reflet dans la pupille (px)
        faceOff: 0,             // position de la fente sur l'iris (px)
        steps: 0,
        revealed: false,
        scored: false
      };

      // arrondi au quart de dioptrie : c'est le verre de travail réellement posé
      // sur la monture (+1,50 à 67 cm, +2,00 à 50 cm), pas la valeur théorique
      function neutralLens() { return Math.round((100 / st.workCm) * 4) / 4; }

      /* résidu dans le méridien courant, verre en place */
      function residual(eye, merid) {
        var t = st.truth[eye];
        if (!t) return 0;
        return (meridianPower(t, merid === undefined ? st.merid : merid) + neutralLens()) - st.lens[eye];
      }

      /* inclinaison du reflet par rapport à la fente (phénomène de rupture) */
      function breakAngle(eye) {
        var t = st.truth[eye];
        if (!t || !t.cyl) return 0;
        var k = 26 * (Math.abs(t.cyl) / (Math.abs(t.cyl) + 1));
        return k * Math.sin(2 * (st.merid - t.axis) * RAD);
      }

      /* ============================================================
         Scène
         ============================================================ */
      var W = 640, H = 380, CX = 320, CY = 186, RP = 46, RI = 80;
      var sceneHolder = el('div', { class: 'stage', style: { minHeight: '380px', touchAction: 'none' } });

      function drawScene() {
        UI.clear(sceneHolder);
        var res = residual(st.eye);
        var a = Math.abs(res);
        var widthFactor = 0.14 + 0.86 * Math.exp(-a * 0.75);
        var glow = 0.22 + 0.78 * Math.exp(-a * 0.45);
        var neutral = a < 0.12;

        var g = s('svg', { viewBox: '0 0 ' + W + ' ' + H, style: 'width:100%;height:auto', 'aria-label': 'Reflet pupillaire' });

        var defs = s('defs');
        var clip = s('clipPath', { id: UID + '-pupil' });
        clip.appendChild(s('circle', { cx: CX, cy: CY, r: RP }));
        defs.appendChild(clip);
        var grad = s('radialGradient', { id: UID + '-reflex', cx: '50%', cy: '50%', r: '60%' });
        grad.appendChild(s('stop', { offset: '0%', 'stop-color': '#ffd9a8' }));
        grad.appendChild(s('stop', { offset: '55%', 'stop-color': '#ff8b3d' }));
        grad.appendChild(s('stop', { offset: '100%', 'stop-color': '#b83a12' }));
        defs.appendChild(grad);
        g.appendChild(defs);

        /* --- visage / œil --- */
        g.appendChild(s('ellipse', { cx: CX, cy: CY, rx: 176, ry: 96, fill: '#f2ede6' }));
        g.appendChild(s('path', {
          d: 'M ' + (CX - 176) + ' ' + CY + ' Q ' + CX + ' ' + (CY - 130) + ' ' + (CX + 176) + ' ' + CY +
             ' Q ' + CX + ' ' + (CY + 128) + ' ' + (CX - 176) + ' ' + CY + ' Z',
          fill: 'none', stroke: '#c9b9a6', 'stroke-width': 3
        }));
        g.appendChild(s('circle', { cx: CX, cy: CY, r: RI, fill: '#5a4632' }));
        g.appendChild(s('circle', { cx: CX, cy: CY, r: RI, fill: 'none', stroke: '#2c2118', 'stroke-width': 3 }));
        for (var i = 0; i < 36; i++) {
          var ang = i * 10 * RAD;
          g.appendChild(s('line', {
            x1: CX + Math.cos(ang) * (RP + 4), y1: CY + Math.sin(ang) * (RP + 4),
            x2: CX + Math.cos(ang) * (RI - 3), y2: CY + Math.sin(ang) * (RI - 3),
            stroke: 'rgba(30,20,10,.28)', 'stroke-width': 1.4
          }));
        }
        g.appendChild(s('circle', { cx: CX, cy: CY, r: RP, fill: '#0a0a0c' }));

        /* --- fente projetée sur le visage (elle suit la main) --- */
        var faceG = s('g', { transform: 'rotate(' + (-st.merid) + ' ' + CX + ' ' + CY + ')', opacity: 0.5 });
        faceG.appendChild(s('rect', {
          x: CX + st.faceOff - 15, y: CY - 150, width: 30, height: 300,
          fill: '#ffe9a8', opacity: 0.3
        }));
        g.appendChild(faceG);

        /* --- reflet dans la pupille --- */
        var clipG = s('g', { 'clip-path': 'url(#' + UID + '-pupil)' });
        var lueur = 0.10 + 0.28 * Math.exp(-a * 0.3);
        clipG.appendChild(s('circle', { cx: CX, cy: CY, r: RP, fill: '#8d2f12', opacity: lueur }));
        var band = s('g', { transform: 'rotate(' + (-(st.merid + breakAngle(st.eye))) + ' ' + CX + ' ' + CY + ')' });
        var bw = Math.max(6, 2 * RP * widthFactor);
        band.appendChild(s('rect', {
          x: CX + st.off - bw / 2, y: CY - RP - 6, width: bw, height: 2 * RP + 12,
          fill: 'url(#' + UID + '-reflex)', opacity: glow, rx: 4
        }));
        clipG.appendChild(band);
        if (neutral) {
          clipG.appendChild(s('circle', { cx: CX, cy: CY, r: RP, fill: '#ffb066', opacity: 0.5 }));
        }
        g.appendChild(clipG);
        g.appendChild(s('circle', {
          cx: CX, cy: CY, r: RP, fill: 'none',
          stroke: neutral ? '#ffcf8a' : 'rgba(255,255,255,.25)', 'stroke-width': neutral ? 3 : 1.5
        }));

        /* --- rétinoscope tenu par l'examinateur --- */
        var hx = 70, hy = H - 78;
        g.appendChild(s('rect', { x: hx, y: hy, width: 58, height: 22, rx: 6, fill: '#2b3743', stroke: '#4a5b6b' }));
        g.appendChild(s('rect', { x: hx + 22, y: hy + 22, width: 15, height: 40, rx: 4, fill: '#3a4854' }));
        g.appendChild(s('line', {
          x1: hx + 58, y1: hy + 11, x2: CX - 40, y2: CY + 40,
          stroke: '#ffe9a8', 'stroke-width': 2, opacity: 0.35, 'stroke-dasharray': '6 5'
        }));

        sceneHolder.appendChild(el('div', { class: 'stage-label', text: 'Skiascopie · œil ' + (st.eye === 'od' ? 'droit' : 'gauche') }));
        sceneHolder.appendChild(g);
        sceneHolder.appendChild(hud(res, neutral));
      }

      function hud(res, neutral) {
        var dir = neutral ? 'NEUTRALISÉ' : res > 0 ? 'Ombre DIRECTE (« avec »)' : 'Ombre INVERSE (« contre »)';
        var brk = Math.abs(breakAngle(st.eye));
        return el('div', { class: 'stage-hud' }, [
          el('span', { class: 'hud-tag', text: 'Méridien balayé ' + st.merid + '°' }),
          el('span', { class: 'hud-tag', text: 'Verre ' + fmt(st.lens[st.eye]) }),
          el('span', {
            class: 'hud-tag',
            style: { color: neutral ? '#8ef0c9' : res > 0 ? '#ffd68a' : '#ff9ea6', fontWeight: '700' },
            text: dir
          }),
          brk > 3 ? el('span', { class: 'hud-tag', style: { color: '#c7b3ff' }, text: 'Rupture ' + Math.round(brk) + '° — vous n’êtes pas sur un méridien principal' }) : null,
          el('span', { class: 'hud-tag', text: 'Distance de travail ' + st.workCm + ' cm (' + fmt(neutralLens()) + ')' })
        ].filter(Boolean));
      }

      /* ---------- balayage ---------- */
      var LIMIT = RP * 1.7;

      function sweepTo(proj) {
        var res = residual(st.eye);
        var a = Math.abs(res);
        var gain = 0.55 + 2.4 * Math.exp(-a * 0.6);
        var dir = res >= 0 ? 1 : -1;                       // direct = même sens que la main
        st.faceOff = Math.max(-LIMIT, Math.min(LIMIT, proj * 0.9));
        st.off = Math.max(-LIMIT * 1.4, Math.min(LIMIT * 1.4, dir * proj * gain));
        drawScene();
      }

      UI.draggable(sceneHolder, function (dx, dy) {
        // projection du geste sur le méridien balayé (y écran vers le bas)
        var u = { x: Math.cos(st.merid * RAD), y: -Math.sin(st.merid * RAD) };
        sweepTo(dx * u.x + dy * u.y);
      }, function () { st.off = 0; st.faceOff = 0; drawScene(); });

      var animId = null;
      function autoSweep() {
        if (animId) cancelAnimationFrame(animId);
        var t0 = performance.now(), dur = 1100;
        (function step(now) {
          if (!document.contains(sceneHolder)) return;
          var p = Math.min(1, (now - t0) / dur);
          sweepTo(Math.sin(p * Math.PI * 2) * LIMIT);
          if (p < 1) animId = requestAnimationFrame(step);
          else { st.off = 0; st.faceOff = 0; animId = null; drawScene(); }
        })(t0);
      }

      /* ============================================================
         Commandes
         ============================================================ */
      var lensKnob, meridKnob;
      var knobBox = el('div', { class: 'flex', style: { justifyContent: 'center', gap: '30px', flexWrap: 'wrap' } });

      function buildKnobs() {
        UI.clear(knobBox);
        lensKnob = UI.knob({
          value: st.lens[st.eye], min: -20, max: 20, step: 0.25, label: 'Verre (D)',
          format: function (v) { return fmt(v); },
          onChange: function (v) { st.lens[st.eye] = v; st.steps++; drawScene(); }
        });
        meridKnob = UI.knob({
          value: st.merid, min: 0, max: 175, step: 5, label: 'Méridien balayé',
          format: function (v) { return v + '°'; },
          onChange: function (v) { st.merid = normAxis(v); st.steps++; drawScene(); }
        });
        knobBox.appendChild(lensKnob);
        knobBox.appendChild(meridKnob);
      }

      function addLens(d) {
        st.lens[st.eye] = Math.round((st.lens[st.eye] + d) * 4) / 4;
        st.steps++;
        buildKnobs();
        drawScene();
      }

      function setMeridian(v) {
        st.merid = normAxis(v);
        st.steps++;
        buildKnobs();
        drawScene();
      }

      /* ============================================================
         Relevés et déduction
         ============================================================ */
      var notesBox = el('div');
      var answerBox = el('div');
      var scoreBox = el('div');

      function noteNeutral() {
        var res = residual(st.eye);
        st.notes[st.eye] = st.notes[st.eye].filter(function (n) { return n.merid !== st.merid; });
        st.notes[st.eye].push({ merid: st.merid, lens: st.lens[st.eye], err: res });
        st.notes[st.eye].sort(function (a, b) { return a.merid - b.merid; });
        UI.toast(Math.abs(res) < 0.3
          ? 'Neutralisation notée dans le méridien ' + st.merid + '°.'
          : 'Relevé noté — mais le reflet bouge encore (' + (res > 0 ? 'ombre directe' : 'ombre inverse') + ').');
        drawNotes();
      }

      function drawNotes() {
        UI.clear(notesBox);
        var list = st.notes[st.eye];
        if (!list.length) {
          notesBox.appendChild(UI.empty('📋', 'Aucun relevé pour cet œil.<br>Neutralisez un méridien puis cliquez <b>Noter la neutralisation</b>.'));
          return;
        }
        notesBox.appendChild(UI.table(['Méridien', 'Verre neutre', 'Puissance de l’œil', ''], list.map(function (n) {
          return [
            n.merid + '°', fmt(n.lens), fmt(Math.round((n.lens - neutralLens()) * 100) / 100),
            UI.btn('✕', function () {
              st.notes[st.eye] = st.notes[st.eye].filter(function (x) { return x !== n; });
              drawNotes();
            }, 'sm ghost')
          ];
        }), { numeric: [1, 2] }));
        notesBox.appendChild(el('p', { class: 'small muted', style: { marginTop: '8px' } ,
          text: 'Puissance de l’œil = verre neutre − verre de distance de travail (' + fmt(neutralLens()) + ').' }));
      }

      function deduce() {
        var list = st.notes[st.eye];
        if (list.length < 2) { UI.toast('Il faut neutraliser deux méridiens (idéalement à 90° l’un de l’autre).'); return; }
        // on garde les deux relevés les plus éloignés angulairement
        var best = null;
        for (var i = 0; i < list.length; i++) {
          for (var j = i + 1; j < list.length; j++) {
            var d = Math.abs(list[i].merid - list[j].merid);
            d = Math.min(d, 180 - d);
            if (!best || d > best.d) best = { a: list[i], b: list[j], d: d };
          }
        }
        if (best.d < 20) { UI.toast('Les deux méridiens sont trop proches : tournez la fente de 90°.'); return; }

        var N = neutralLens();
        var pa = Math.round((best.a.lens - N) * 100) / 100;
        var pb = Math.round((best.b.lens - N) * 100) / 100;
        var hi = pa >= pb ? best.a : best.b;
        var lo = pa >= pb ? best.b : best.a;
        var sph = Math.round(Math.max(pa, pb) * 4) / 4;
        var cyl = Math.round((Math.min(pa, pb) - Math.max(pa, pb)) * 4) / 4;
        var axis = normAxis(hi.merid) || 180;

        st.answer[st.eye] = { sph: sph, cyl: cyl, axis: axis };
        drawAnswer(
          'Méridien ' + hi.merid + '° : ' + fmt(hi.lens) + ' − ' + fmt(N) + ' = <b>' + fmt(sph) + '</b> → sphère, axe du cylindre sur ce méridien.<br>' +
          'Méridien ' + lo.merid + '° : ' + fmt(lo.lens) + ' − ' + fmt(N) + ' = <b>' + fmt(Math.min(pa, pb)) + '</b> → ' +
          fmt(Math.min(pa, pb)) + ' − ' + fmt(sph) + ' = <b>' + fmt(cyl) + '</b> de cylindre.'
        );
      }

      function drawAnswer(explain) {
        UI.clear(answerBox);
        var a = st.answer[st.eye] || { sph: 0, cyl: 0, axis: 180 };
        answerBox.appendChild(el('div', { class: 'grid g3' }, [
          UI.field('Sphère', UI.num(a.sph, function (v) { a.sph = v || 0; st.answer[st.eye] = a; }, { step: 0.25 })),
          UI.field('Cylindre', UI.num(a.cyl, function (v) { a.cyl = Math.min(0, v || 0); st.answer[st.eye] = a; }, { step: 0.25, max: 0 })),
          UI.field('Axe', UI.num(a.axis, function (v) { a.axis = normAxis(v || 0) || 180; st.answer[st.eye] = a; }, { step: 5, min: 0, max: 180 }))
        ]));
        st.answer[st.eye] = a;
        if (explain) answerBox.appendChild(UI.note(explain));
        answerBox.appendChild(el('div', { class: 'btn-row' }, [
          UI.btn('🧮 Déduire des relevés', deduce),
          UI.btn('✓ Valider la réfraction des deux yeux', validate, 'primary')
        ]));
      }

      /* ============================================================
         Validation
         ============================================================ */
      function validate() {
        var lines = [], scores = [];
        ['od', 'os'].forEach(function (eye) {
          var t = st.truth[eye], a = st.answer[eye];
          if (!a) {
            lines.push([eye.toUpperCase(), '— non mesuré —', Optics.formatRx(t.sph, t.cyl, t.axis), '—', '—', '0 %']);
            scores.push(0);
            return;
          }
          var dist = vecDist(t, a);
          var sc = Math.round(Math.max(0, 100 - dist * 85));
          var axErr = t.cyl !== 0 && a.cyl !== 0
            ? Math.min(Math.abs(t.axis - a.axis), 180 - Math.abs(t.axis - a.axis)) : 0;
          scores.push(sc);
          lines.push([
            eye.toUpperCase(),
            Optics.formatRx(a.sph, a.cyl, a.axis),
            Optics.formatRx(t.sph, t.cyl, t.axis),
            Optics.formatDpt(Optics.r2((a.sph + a.cyl / 2) - (t.sph + t.cyl / 2), 2)),
            axErr + '°',
            sc + ' %'
          ]);
        });

        var final = Math.round((scores[0] + scores[1]) / 2);
        if (!st.revealed) { Store.recordScore('skiascopy', final, { steps: st.steps }); st.scored = true; }
        st.revealed = true;

        UI.clear(scoreBox);
        scoreBox.appendChild(UI.card('Résultat de la skiascopie', [
          el('div', { class: 'grid g3' }, [
            UI.stat(final + ' %', 'Précision', final >= 80 ? 'var(--green)' : final >= 55 ? 'var(--amber)' : 'var(--red)'),
            UI.stat(st.steps, 'Manipulations'),
            UI.stat(st.notes.od.length + st.notes.os.length, 'Méridiens relevés')
          ]),
          UI.table(['Œil', 'Votre skiascopie', 'Réfraction réelle', 'Écart d’ES', 'Écart d’axe', 'Score'], lines),
          UI.note(final >= 85
            ? '<b>Très bien.</b> Une skiascopie à moins de 0,50 D près, c’est le niveau attendu en stage. Le phoroptère n’a plus qu’à affiner.'
            : final >= 60
              ? '<b>Correct.</b> Reprenez la recherche des méridiens principaux : tournez la fente jusqu’à faire disparaître la rupture, c’est là que se joue l’axe.'
              : '<b>À retravailler.</b> Méthode : neutraliser un méridien, tourner la fente de 90°, neutraliser le second, puis retrancher le verre de distance de travail à chaque valeur.',
            final >= 60 ? '' : 'warn'),
          st.scored ? null : UI.note('Réfraction révélée avant la validation : cet essai n’est pas enregistré dans vos scores.', 'warn')
        ].filter(Boolean)));
      }

      /* ============================================================
         Patient
         ============================================================ */
      function newPatient(fromCase) {
        var seed = fromCase
          ? Math.abs(Math.round(fromCase.od.sph * 400 + fromCase.os.sph * 137 + (fromCase.od.axis || 0) * 7 + (fromCase.od.cyl || 0) * 61)) + 1
          : Math.floor(Math.random() * 99999) + 1;
        var rand = rng(seed);
        if (fromCase) {
          st.truth.od = { sph: fromCase.od.sph, cyl: fromCase.od.cyl, axis: fromCase.od.axis || 180 };
          st.truth.os = { sph: fromCase.os.sph, cyl: fromCase.os.cyl, axis: fromCase.os.axis || 180 };
        } else {
          st.truth.od = randomRefraction(rand);
          st.truth.os = randomRefraction(rand);
          if (rand() < 0.8) st.truth.os.sph = Math.round((st.truth.od.sph + (rand() * 2 - 1)) * 4) / 4;
        }
        st.lens = { od: 0, os: 0 };
        st.notes = { od: [], os: [] };
        st.answer = { od: null, os: null };
        st.merid = 0; st.eye = 'od'; st.steps = 0;
        st.revealed = false; st.scored = false;
        UI.clear(scoreBox);
        buildKnobs();
        drawNotes();
        drawAnswer();
        drawScene();
      }

      function switchEye(e) {
        st.eye = e;
        buildKnobs();
        drawNotes();
        drawAnswer();
        drawScene();
      }

      /* ============================================================
         Assemblage
         ============================================================ */
      var toolbar = el('div', { class: 'card' }, [
        el('div', { class: 'btn-row' }, [
          preset ? null : UI.btn('🎲 Nouveau patient', function () { newPatient(); }, 'primary'),
          el('span', { class: 'muted small', text: 'Œil examiné :' }),
          UI.btn('OD', function () { switchEye('od'); }),
          UI.btn('OG', function () { switchEye('os'); }),
          el('span', { class: 'spacer' }),
          el('span', { class: 'muted small', text: 'Distance de travail :' }),
          UI.select([{ value: 67, label: '67 cm (+1,50)' }, { value: 50, label: '50 cm (+2,00)' }, { value: 100, label: '1 m (+1,00)' }],
            st.workCm, function (v) { st.workCm = parseFloat(v); drawNotes(); drawScene(); }),
          UI.btn('👁 Révéler', function () {
            st.revealed = true;
            UI.toast('OD ' + Optics.formatRx(st.truth.od.sph, st.truth.od.cyl, st.truth.od.axis) +
                     '  ·  OG ' + Optics.formatRx(st.truth.os.sph, st.truth.os.cyl, st.truth.os.axis), 7000);
          })
        ].filter(Boolean)),
        preset ? UI.note('📁 <b>Dossier patient</b> — la réfraction réelle de ce patient est chargée mais reste cachée. ' +
          'Faites la skiascopie des <b>deux yeux</b>, puis validez.') : null
      ].filter(Boolean));

      var sceneCol = el('div', {}, [
        UI.card('Le patient', [
          sceneHolder,
          el('div', { class: 'btn-row', style: { marginTop: '12px' } }, [
            UI.btn('↔ Balayer', autoSweep, 'primary'),
            UI.btn('Méridien 0°', function () { setMeridian(0); }),
            UI.btn('90°', function () { setMeridian(90); }),
            UI.btn('+5°', function () { setMeridian(st.merid + 5); }),
            UI.btn('−5°', function () { setMeridian(st.merid - 5); }),
            el('span', { class: 'spacer' }),
            UI.btn('📌 Noter la neutralisation', noteNeutral)
          ]),
          UI.note('<b>Glissez la souris sur l’œil</b> pour balayer (ou bouton ↔). Le reflet qui va <b>dans le même sens</b> que votre main ' +
            'est une ombre <b>directe</b> : il manque du plus. En sens contraire, ombre <b>inverse</b> : il y a trop de plus. ' +
            'À la neutralisation la pupille s’illumine d’un coup, sans direction.')
        ]),
        UI.card('Verres d’essai', [
          knobBox,
          el('div', { class: 'btn-row', style: { justifyContent: 'center', marginTop: '14px' } }, [
            UI.btn('−1,00', function () { addLens(-1); }),
            UI.btn('−0,25', function () { addLens(-0.25); }),
            UI.btn('+0,25', function () { addLens(0.25); }),
            UI.btn('+1,00', function () { addLens(1); }),
            UI.btn('Remettre à 0', function () { st.lens[st.eye] = 0; st.steps++; buildKnobs(); drawScene(); })
          ])
        ]),
        scoreBox
      ]);

      var sideCol = el('div', {}, [
        UI.card('Relevés de l’œil examiné', notesBox),
        UI.card('Réfraction déduite', answerBox),
        UI.card('Méthode', UI.accordion([
          { title: '1 · S’installer', body: 'Salle sombre, patient qui fixe une cible de loin (pour ne pas accommoder). On se place à sa distance de travail habituelle : ' +
              '67 cm (+1,50) ou 50 cm (+2,00). <b>Toujours la même</b>, sinon la soustraction finale est fausse.', open: true },
          { title: '2 · Lire l’ombre', body: 'On balaie un méridien et on regarde le reflet pupillaire :<ul>' +
              '<li><b>Direct</b> (« avec ») → il manque du plus : ajouter du +.</li>' +
              '<li><b>Inverse</b> (« contre ») → trop de plus : ajouter du −.</li>' +
              '<li>Plus on approche de la neutralisation, plus le reflet est <b>large, brillant et rapide</b>.</li></ul>' },
          { title: '3 · Trouver les méridiens principaux', body: 'Si le reflet dans la pupille est <b>incliné</b> par rapport à la fente projetée sur l’iris, ' +
              'c’est la <b>rupture</b> : vous n’êtes pas sur un méridien principal. Tournez la fente jusqu’à ce que reflet et fente soient alignés.' },
          { title: '4 · Neutraliser deux méridiens', body: 'Neutraliser le premier méridien, noter le verre, tourner de 90°, neutraliser le second, noter. ' +
              'Deux méridiens suffisent à décrire un astigmatisme régulier.' },
          { title: '5 · Retrancher la distance de travail', body: 'Puissance de l’œil dans un méridien = <b>verre neutre − verre de distance de travail</b>. ' +
              'À 67 cm on retranche +1,50 à chaque valeur. Sphère = la valeur la plus positive, axe du cylindre = son méridien, ' +
              'cylindre (négatif) = autre valeur − sphère.' },
          { title: 'Pièges classiques', body: '<ul><li>Oublier de retrancher le verre de travail : toute la réfraction est fausse de +1,50.</li>' +
              '<li>Patient qui accommode : la skiascopie « bouge » et sous-estime l’hypermétropie. Chez l’enfant → cycloplégie.</li>' +
              '<li>Confondre l’axe du cylindre et le méridien de plus forte puissance : en cylindre négatif, <b>l’axe est le méridien le moins myope</b>.</li></ul>' }
        ]))
      ]);

      newPatient(preset);

      return UI.page({
        crumb: 'Simulateurs',
        title: 'Skiascopie',
        subtitle: 'La réfraction <b>objective</b>, sans rien demander au patient : on éclaire la pupille, on lit le sens du reflet, ' +
                  'on neutralise. Deux méridiens, une soustraction, et la réfraction est là.'
      }, [toolbar, el('div', { class: 'split-wide' }, [sceneCol, sideCol])]);
    }
  };
})();
