/* ============================================================
   PPC — punctum proximum de convergence & rééducation
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  M.ppc = {
    id: 'ppc', title: 'PPC & convergence', icon: '🎯', group: 'Simulateurs',
    desc: 'Punctum proximum de convergence, rupture, recouvrement, rééducation',
    keywords: 'ppc punctum proximum convergence rupture recouvrement insuffisance reeducation hart',
    render: function (ctx) {
      var preset = ctx && ctx.params && ctx.params.sim && ctx.params.sim.ppc;
      var st = {
        dist: 50,          // cm
        breakAt: 8, recAt: 12,
        broken: false,
        dominant: 'od',
        markedBreak: null, markedRec: null,
        dip: 62, gain: 3.2,
        speed: 2.5,        // cm/s — vitesse d'approche de la cible
        dir: 0,
        running: null
      };

      var face = window.Face.build({ uid: 'ppc' });
      var PXD = window.Face.PX_PER_DELTA;

      var targetLayer = el('div', { style: { position: 'absolute', inset: 0, pointerEvents: 'none' } });
      var stage = el('div', { class: 'stage', style: { position: 'relative', padding: '10px' } }, [
        el('div', { class: 'stage-label', text: 'Approche de la cible — PPC' }),
        face.node, targetLayer
      ]);
      var hud = el('div', { class: 'stage-hud' });
      stage.appendChild(hud);

      function demandPerEye(cm) {
        return (st.dip / 10) * (100 / cm) / 2;   // Δ par œil
      }

      function update() {
        var perEye = demandPerEye(st.dist);
        var px = perEye * PXD * st.gain;
        if (!st.broken && st.dist <= st.breakAt) st.broken = true;
        if (st.broken && st.dist >= st.recAt) st.broken = false;

        var od = { x: px, y: 0 };      // OD converge : vers la droite de l’écran (nasal)
        var os = { x: -px, y: 0 };
        if (st.broken) {
          if (st.dominant === 'od') os = { x: Math.min(0, -px * 0.05), y: 0 };
          else od = { x: Math.max(0, px * 0.05), y: 0 };
        }
        face.setTarget(od, os);

        // cible
        UI.clear(targetLayer);
        var size = Math.max(10, 60 - st.dist * 0.7);
        var y = 30 + Math.min(52, (50 - st.dist) * 1.1);
        targetLayer.appendChild(el('div', {
          style: {
            position: 'absolute', left: '50%', top: y + '%', transform: 'translate(-50%,-50%)',
            width: size + 'px', height: size + 'px', borderRadius: '50%',
            background: 'radial-gradient(circle,#ffd45e,#e08a12)', boxShadow: '0 0 20px rgba(255,190,60,.55)',
            border: '2px solid #fff2c9'
          }
        }));

        UI.clear(hud);
        hud.appendChild(el('span', { class: 'hud-tag', text: 'Distance : ' + st.dist.toFixed(1) + ' cm' }));
        hud.appendChild(el('span', { class: 'hud-tag', text: 'Convergence demandée : ' + Optics.r2(perEye * 2, 1) + ' Δ' }));
        hud.appendChild(el('span', { class: 'hud-tag', text: 'Accommodation : ' + Optics.r2(100 / st.dist, 2) + ' D' }));
        if (st.broken) hud.appendChild(el('span', { class: 'hud-tag', style: { color: '#ef5f6b' }, text: 'Un œil a décroché' }));
      }

      /* L'approche se fait à vitesse clinique : environ 2 à 3 cm par seconde.
         Plus vite, on dépasse le point de rupture sans avoir eu le temps de
         voir l'œil décrocher — c'est d'ailleurs l'erreur classique en TP. */
      var TICK = 60;                       // ms entre deux images
      function animate(dir) {
        clearInterval(st.running);
        st.dir = dir;
        st.running = setInterval(function () {
          st.dist += dir * st.speed * (TICK / 1000);
          if (st.dist <= 2) { st.dist = 2; stop(); }
          if (st.dist >= 50) { st.dist = 50; stop(); }
          update();
        }, TICK);
        updateControls();
      }

      function stop() {
        clearInterval(st.running);
        st.running = null;
        st.dir = 0;
        updateControls();
      }

      /* déplacement au centimètre près, pour affiner autour de la rupture */
      function nudge(d) {
        stop();
        st.dist = Math.max(2, Math.min(50, st.dist + d));
        update();
      }

      function newCase(from) {
        clearInterval(st.running);
        if (from) {
          st.breakAt = from.breakCm;
          st.recAt = from.recoveryCm || from.breakCm + 4;
        } else {
          var profile = Math.random();
          if (profile < 0.45) { st.breakAt = 4 + Math.random() * 4; }            // normal
          else if (profile < 0.8) { st.breakAt = 11 + Math.random() * 12; }      // insuffisance
          else { st.breakAt = 25 + Math.random() * 20; }                          // sévère
          st.recAt = st.breakAt + 2 + Math.random() * 8;
        }
        st.dominant = Math.random() < 0.5 ? 'od' : 'os';
        st.dist = 50; st.broken = false; st.markedBreak = null; st.markedRec = null;
        UI.clear(ans); buildAns();
        update();
      }

      var ans = el('div');
      function buildAns() {
        var b = UI.num(0, function () {}, { step: 1, min: 0, max: 60 });
        var r = UI.num(0, function () {}, { step: 1, min: 0, max: 60 });
        ans.appendChild(el('div', { class: 'grid g2' }, [
          UI.field('Point de rupture (cm)', b),
          UI.field('Point de recouvrement (cm)', r)
        ]));
        ans.appendChild(el('div', { class: 'btn-row' }, [
          UI.btn('Marquer la rupture', function () { st.markedBreak = st.dist; b.value = Math.round(st.dist); UI.toast('Rupture notée à ' + Math.round(st.dist) + ' cm'); }),
          UI.btn('Marquer le recouvrement', function () { st.markedRec = st.dist; r.value = Math.round(st.dist); UI.toast('Recouvrement noté à ' + Math.round(st.dist) + ' cm'); }),
          UI.btn('Valider', function () {
            var eb = Math.abs((parseFloat(b.value) || 0) - st.breakAt);
            var er = Math.abs((parseFloat(r.value) || 0) - st.recAt);
            var score = Math.round(Math.max(0, 100 - eb * 9 - er * 6));
            Store.recordScore('ppc', score);
            var verdict = st.breakAt <= 8 ? 'PPC normal' : st.breakAt <= 12 ? 'PPC limite' : 'Insuffisance de convergence';
            ans.appendChild(UI.note('Valeurs réelles : rupture <b>' + st.breakAt.toFixed(0) + ' cm</b>, recouvrement <b>' +
              st.recAt.toFixed(0) + ' cm</b> → <b>' + verdict + '</b>. Score <b>' + score + ' %</b>. ' +
              'Notation clinique : « PPC ' + st.breakAt.toFixed(0) + '/' + st.recAt.toFixed(0) + ' cm ».',
              score >= 75 ? '' : 'warn'));
          }, 'primary'),
          preset ? null : UI.btn('Nouveau patient', function () { newCase(); })
        ].filter(Boolean)));
      }

      var closeBtn = UI.btn('▶ Rapprocher la cible', function () { animate(-1); }, 'primary');
      var farBtn = UI.btn('◀ Éloigner la cible', function () { animate(1); });
      var stopBtn = UI.btn('⏸ Arrêter', stop);

      function updateControls() {
        closeBtn.classList.toggle('primary', st.dir !== -1);
        farBtn.classList.toggle('primary', st.dir === 1);
        stopBtn.disabled = !st.running;
      }

      var controls = el('div', { class: 'card' }, [
        el('div', { class: 'btn-row' }, [
          closeBtn, farBtn, stopBtn,
          UI.btn('− 1 cm', function () { nudge(-1); }, 'sm'),
          UI.btn('+ 1 cm', function () { nudge(1); }, 'sm'),
          el('span', { class: 'spacer' }),
          el('span', { class: 'muted small', text: 'Vitesse :' }),
          UI.select([
            { value: 1.5, label: 'Lente — 1,5 cm/s' },
            { value: 2.5, label: 'Clinique — 2,5 cm/s' },
            { value: 5, label: 'Rapide — 5 cm/s' }
          ], 2.5, function (v) {
            st.speed = parseFloat(v);
            if (st.running) animate(st.dir);      // prise en compte immédiate
          }),
          el('span', { class: 'muted small', text: 'DIP :' }),
          UI.num(62, function (v) { st.dip = v || 62; update(); }, { step: 1, min: 45, max: 78, style: 'width:80px' })
        ]),
        UI.note('L’approche se fait <b>lentement</b>, 2 à 3 cm par seconde : c’est la vitesse à laquelle on voit ' +
          'réellement l’œil décrocher. Les boutons <b>±1 cm</b> et <b>⏸</b> permettent d’affiner autour de la rupture, ' +
          'puis on repart en arrière pour chercher le recouvrement.')
      ]);
      updateControls();

      newCase(preset);

      return UI.page({
        crumb: 'Simulateurs',
        title: 'PPC & convergence',
        subtitle: 'Rapprochez la cible de la racine du nez et surveillez les yeux : au point de rupture, un œil décroche en divergence. ' +
                  'Éloignez ensuite jusqu’au recouvrement.'
      }, [
        controls,
        el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Examen', stage),
            UI.card('Votre mesure', ans)
          ]),
          el('div', {}, [
            UI.card('Valeurs de référence', [
              UI.table(['Résultat', 'Interprétation'], [
                ['≤ 6–8 cm', 'PPC normal'],
                ['8 à 12 cm', 'Limite, à confronter aux symptômes'],
                ['> 12 cm', 'Insuffisance de convergence'],
                ['Recouvrement > rupture + 5 cm', 'Fusion fragile, fatigabilité'],
                ['« Nez » (jusqu’au nez)', 'Convergence normale, souvent notée PPC = nez']
              ]),
              UI.note('On répète la mesure <b>3 fois de suite</b> : une dégradation nette entre le 1er et le 3e essai signe la <b>fatigabilité</b>, argument majeur en faveur d’une rééducation.')
            ]),
            UI.card('Rééducation de la convergence', UI.accordion([
              { title: 'Objectifs', open: true, body: '<ul><li>Rapprocher le PPC.</li><li>Augmenter les amplitudes de convergence fusionnelle.</li><li>Améliorer la souplesse (flexibilité de vergence).</li><li>Rendre le contrôle automatique et durable.</li></ul>' },
              { title: 'Exercices classiques', body:
                '<ul><li><b>Push-up</b> (crayon, carte de fixation) : approche lente jusqu’à la diplopie, 15 à 20 répétitions.</li>' +
                '<li><b>Jump convergence</b> : alternance loin/près pour travailler la souplesse.</li>' +
                '<li><b>Stéréogrammes</b> (cartes de Bernell, corde de Brock) : travail en convergence libre puis divergence.</li>' +
                '<li><b>Prismes</b> : amplitudes en base externe puis base interne, avec cible accommodative.</li>' +
                '<li><b>Flippers de vergence</b> pour la flexibilité.</li>' +
                '<li><b>Synoptophore</b> : amplitudes objectivées, travail des 3 degrés de Worth.</li></ul>' },
              { title: 'Cadre pratique', body: '<p>En général 10 à 20 séances, une à deux fois par semaine, <b>toujours</b> associées à des exercices quotidiens à domicile de 10 à 15 minutes. Les résultats sont excellents dans l’insuffisance de convergence isolée (80 à 90 % de succès) mais doivent être entretenus.</p>' }
            ]))
          ])
        ])
      ]);
    }
  };
})();
