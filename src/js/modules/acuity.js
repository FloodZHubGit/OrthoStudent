/* ============================================================
   Échelles d'acuité — Monoyer, Snellen, Landolt, Parinaud
   Les optotypes sont dimensionnés en millimètres réels après
   calibration de l'écran, puis convertis en pixels.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;
  var A = Optics.Acuity;

  var MONOYER_LETTERS = ['ZUAHN', 'OSCKR', 'VDFLP', 'TEXMG', 'BHNZU', 'ACORS', 'KDVLP'];
  var LINES = [0.05, 0.1, 0.16, 0.2, 0.25, 0.32, 0.4, 0.5, 0.63, 0.8, 1.0, 1.25];

  var PARINAUD = [
    { p: 28, txt: 'Le chat dort.' },
    { p: 20, txt: 'Il pleut sur la ville depuis ce matin.' },
    { p: 14, txt: 'La lumière du jour éclaire doucement la pièce et le jardin.' },
    { p: 10, txt: 'Les enfants jouent dans la cour de récréation pendant que les oiseaux chantent dans les grands arbres.' },
    { p: 8, txt: 'Le médecin observe attentivement le fond de l’œil de son patient afin de repérer la moindre anomalie du nerf optique.' },
    { p: 6, txt: 'La vision binoculaire repose sur la correspondance rétinienne normale, la fusion sensorielle et motrice, puis la stéréoscopie qui naît de la disparité rétinienne.' },
    { p: 4, txt: 'L’orthoptiste évalue l’acuité visuelle de loin et de près, la réfraction, la motilité oculaire, l’équilibre binoculaire et la vision des couleurs avant de rédiger son compte rendu.' },
    { p: 3, txt: 'Le rapport entre la convergence accommodative et l’accommodation, appelé AC/A, s’exprime en dioptries prismatiques par dioptrie et vaut normalement de trois à cinq.' },
    { p: 2, txt: 'La transposition cylindrique consiste à additionner la sphère et le cylindre, à changer le signe du cylindre puis à faire varier l’axe de quatre-vingt-dix degrés.' },
    { p: 1.5, txt: 'Les insertions musculaires suivent la spirale de Tillaux : droit médial cinq virgule cinq, droit inférieur six virgule cinq, droit latéral six virgule neuf et droit supérieur sept virgule sept millimètres du limbe.' }
  ];

  function pick(arr, i) { return arr[i % arr.length]; }

  M.acuity = {
    id: 'acuity', title: 'Échelles d’acuité', icon: '🔠', group: 'Simulateurs',
    desc: 'Monoyer, Landolt, E de Snellen, chiffres, Parinaud — calibrés en taille réelle',
    keywords: 'acuite monoyer snellen landolt parinaud optotype echelle calibration crowding',
    render: function (ctx) {
      var presetAcuity = ctx && ctx.params && ctx.params.sim && ctx.params.sim.acuity;
      var st = {
        dist: 0.6,   // par défaut : lisible depuis la chaise ; 5 m disponible pour la taille réelle
        type: 'letters',
        pxmm: Store.setting('pxPerMm') || 3.78,
        isolate: null,
        crowd: false,
        mask: false,
        eye: 'od',
        trueVA: null,
        presented: {},
        seed: 7
      };

      var chart = el('div');
      var calBox = el('div');

      /* ---------- optotypes ---------- */
      function landolt(sizePx, dir) {
        var g = s('svg', { viewBox: '0 0 100 100', width: sizePx, height: sizePx, style: 'display:inline-block;vertical-align:middle' });
        var r = 40, sw = 20;
        var grp = s('g', { transform: 'rotate(' + dir * 45 + ' 50 50)' });
        // anneau avec ouverture à droite
        grp.appendChild(s('path', {
          d: 'M 50 10 A 40 40 0 1 1 61.5 13.6',
          fill: 'none', stroke: '#111', 'stroke-width': sw
        }));
        g.appendChild(grp);
        return g;
      }

      function snellenE(sizePx, dir) {
        var g = s('svg', { viewBox: '0 0 100 100', width: sizePx, height: sizePx, style: 'display:inline-block;vertical-align:middle' });
        var grp = s('g', { transform: 'rotate(' + dir * 90 + ' 50 50)' });
        grp.appendChild(s('rect', { x: 10, y: 10, width: 20, height: 80, fill: '#111' }));
        grp.appendChild(s('rect', { x: 10, y: 10, width: 80, height: 20, fill: '#111' }));
        grp.appendChild(s('rect', { x: 10, y: 40, width: 80, height: 20, fill: '#111' }));
        grp.appendChild(s('rect', { x: 10, y: 70, width: 80, height: 20, fill: '#111' }));
        g.appendChild(grp);
        return g;
      }

      function rowContent(v, idx, hPx) {
        var wrap = el('span', { style: { display: 'inline-flex', alignItems: 'center', gap: (hPx * 0.5) + 'px' } });
        var n = v < 0.2 ? 3 : v < 0.5 ? 5 : 5;
        var r = (st.seed * 31 + idx * 17);
        for (var i = 0; i < n; i++) {
          r = (r * 1103515245 + 12345) % 2147483648;
          var k = Math.abs(r) % 8;
          if (st.type === 'landolt') wrap.appendChild(landolt(hPx, k));
          else if (st.type === 'e') wrap.appendChild(snellenE(hPx, k % 4));
          else if (st.type === 'digits') wrap.appendChild(el('span', { style: { fontSize: hPx * 1.36 + 'px', lineHeight: 1 }, text: String(Math.abs(r) % 10) }));
          else wrap.appendChild(el('span', { style: { fontSize: hPx * 1.36 + 'px', lineHeight: 1 }, text: pick(MONOYER_LETTERS, idx)[i] }));
        }
        if (st.crowd) {
          return el('span', { style: { display: 'inline-flex', alignItems: 'center' } }, [
            el('span', { style: { width: hPx * 0.4 + 'px', height: hPx + 'px', background: '#111', marginRight: hPx * 0.3 + 'px' } }),
            wrap,
            el('span', { style: { width: hPx * 0.4 + 'px', height: hPx + 'px', background: '#111', marginLeft: hPx * 0.3 + 'px' } })
          ]);
        }
        return wrap;
      }

      function drawChart() {
        UI.clear(chart);
        if (st.type === 'parinaud') {
          var box = el('div', { class: 'optotype-screen', style: { alignItems: 'flex-start', fontFamily: 'Georgia, serif', letterSpacing: 'normal', fontWeight: '400', padding: '26px' } });
          PARINAUD.forEach(function (p) {
            // P2 ≈ 10/10 à 40 cm. Hauteur x d'un caractère P(n) ~ n × 0,25 mm environ
            var hMm = p.p * 0.26;
            var px = hMm * st.pxmm;
            box.appendChild(el('div', { style: { display: 'flex', gap: '14px', alignItems: 'baseline', marginBottom: '10px', maxWidth: '100%' } }, [
              el('span', { class: 'mono', style: { fontSize: '10px', color: '#777', minWidth: '30px' }, text: 'P' + p.p }),
              el('span', { style: { fontSize: px + 'px', lineHeight: '1.25' }, text: p.txt })
            ]));
          });
          chart.appendChild(box);
          chart.appendChild(UI.note('Échelle de Parinaud à lire à <b>33–40 cm</b>. P2 correspond approximativement à 10/10 de près. ' +
            'Le rendu dépend de la calibration de l’écran ci-dessous : mesurez votre distance réelle de lecture avant de conclure.'));
          return;
        }

        chart.appendChild(UI.note(st.dist >= 3
          ? 'Affichage à l’échelle réelle pour <b>' + st.dist + ' m</b> : à cette distance les grosses lignes sont énormes, c’est normal — un panneau de Monoyer mesure près d’un mètre de haut. ' +
            'Pour lire l’échelle depuis votre chaise, choisissez la distance <b>40 ou 60 cm</b>.'
          : 'Échelle recalculée pour une lecture à <b>' + Math.round(st.dist * 100) + ' cm</b> de l’écran. Placez-vous exactement à cette distance : ' +
            'la ligne 10/10 mesure alors ' + Optics.r2(A.optotypeHeightMm(1, st.dist), 2) + ' mm.'));
        var box = el('div', { class: 'optotype-screen', style: { padding: '24px 18px' } });
        LINES.forEach(function (v, idx) {
          if (st.isolate !== null && st.isolate !== idx) {
            if (st.mask) return;
          }
          var hMm = A.optotypeHeightMm(v, st.dist);
          var hPx = hMm * st.pxmm;
          if (hPx > 420) return;
          var row = el('div', { class: 'opt-row', style: { opacity: (st.isolate !== null && st.isolate !== idx) ? 0.18 : 1 } }, [
            el('span', { class: 'lbl', text: Optics.r2(v * 10, 2) + '/10' }),
            rowContent(v, idx, hPx),
            el('span', { class: 'lbl', style: { textAlign: 'left', width: '56px' }, text: 'logMAR ' + A.decToLogMAR(v).toFixed(1) })
          ]);
          row.style.cursor = 'pointer';
          row.addEventListener('click', function () { st.isolate = st.isolate === idx ? null : idx; drawChart(); });
          box.appendChild(row);
        });
        chart.appendChild(box);
      }

      /* ---------- calibration ---------- */
      function drawCal() {
        UI.clear(calBox);
        var cardW = 85.6, cardH = 53.98;
        var card = el('div', {
          style: {
            width: (cardW * st.pxmm) + 'px', height: (cardH * st.pxmm) + 'px',
            border: '2px solid var(--accent)', borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(53,196,181,.18), rgba(79,157,253,.12))',
            display: 'grid', placeItems: 'center', color: 'var(--accent)', fontSize: '12px'
          }, text: 'Carte bancaire (85,6 × 54 mm)'
        });
        var sl = UI.range(2.0, 8.0, 0.01, st.pxmm, function (v) {
          st.pxmm = v; Store.setting('pxPerMm', v); drawCal(); drawChart();
        }, function (v) { return v.toFixed(2) + ' px/mm'; });
        calBox.appendChild(el('p', { class: 'muted small', html: 'Posez une carte bancaire (ou une carte Vitale, mêmes dimensions) sur l’écran et ajustez le curseur jusqu’à ce que le rectangle corresponde exactement. Toutes les tailles d’optotypes en dépendent.' }));
        calBox.appendChild(sl);
        calBox.appendChild(card);
        calBox.appendChild(el('p', { class: 'small muted mt8', html: 'Résolution estimée : <b>' + Optics.r2(st.pxmm * 25.4, 0) + ' dpi</b>. ' +
          'À ' + st.dist + ' m, la ligne 10/10 mesure <b>' + Optics.r2(A.optotypeHeightMm(1, st.dist), 2) + ' mm</b> soit ' +
          Optics.r2(A.optotypeHeightMm(1, st.dist) * st.pxmm, 1) + ' px.' }));
      }

      /* ---------- mode entraînement ---------- */
      var trainBox = el('div');

      function newTrainee(from) {
        if (from) {
          st.fromCase = from;
          st.eye = st.eye || 'od';
          st.trueVA = st.eye === 'od'
            ? (from.odFar !== undefined ? from.odFar : 1)
            : (from.osFar !== undefined ? from.osFar : 1);
        } else {
          st.trueVA = LINES[2 + Math.floor(Math.random() * 8)];
          st.fromCase = null;
        }
        st.presented = {};
        drawTrain();
      }

      function drawTrain() {
        UI.clear(trainBox);
        if (st.trueVA === null) { trainBox.appendChild(el('p', { class: 'muted', text: 'Lancez une mesure pour commencer.' })); return; }

        if (st.fromCase) {
          trainBox.appendChild(el('div', { class: 'btn-row', style: { marginBottom: '12px' } }, [
            el('span', { class: 'muted small', text: '📁 Dossier patient — œil occlus, on mesure :' }),
            UI.btn('Œil droit', function () { st.eye = 'od'; newTrainee(st.fromCase); }, st.eye === 'od' ? 'primary' : ''),
            UI.btn('Œil gauche', function () { st.eye = 'os'; newTrainee(st.fromCase); }, st.eye === 'os' ? 'primary' : '')
          ]));
          trainBox.appendChild(UI.note('Vous mesurez l’acuité de l’<b>œil ' + (st.eye === 'od' ? 'droit' : 'gauche') +
            '</b> de ce patient. Sa valeur est cachée : présentez les lignes, notez ses réponses, puis concluez. ' +
            'Recommencez ensuite sur l’autre œil.'));
        }
        var log = el('div', { class: 'log' });
        var rows = LINES.map(function (v, i) {
          return el('span', {
            class: 'chip' + (st.presented[i] ? ' on' : ''),
            text: Optics.r2(v * 10, 2) + '/10',
            onClick: function () {
              var readable = v <= st.trueVA * 1.02;
              var partial = !readable && v <= st.trueVA * 1.3;
              var msg = readable ? 'lit la ligne entière sans hésiter'
                : partial ? 'hésite, lit 2 lettres sur 5 et se trompe sur les autres'
                : 'ne distingue rien de cette ligne';
              st.presented[i] = true;
              log.insertBefore(el('div', { class: 'log-line', html: '<b>' + Optics.r2(v * 10, 2) + '/10</b> — le patient ' + msg + '.' }), log.firstChild);
              drawTrainChips();
            }
          });
        });
        var chipRow = el('div', { class: 'flex wrap' }, rows);
        function drawTrainChips() {
          rows.forEach(function (r, i) { r.classList.toggle('on', !!st.presented[i]); });
        }

        var answer = UI.select(LINES.map(function (v) { return { value: v, label: Optics.r2(v * 10, 2) + '/10' }; }), 0.5, function () {});
        trainBox.appendChild(el('div', { class: 'grid g2' }, [
          el('div', {}, [
            el('h3', { text: 'Présentez les lignes' }),
            chipRow,
            el('div', { class: 'mt16' }, log)
          ]),
          el('div', {}, [
            el('h3', { text: 'Votre conclusion' }),
            UI.field('Acuité mesurée', answer),
            el('div', { class: 'btn-row' }, [
              UI.btn('Valider', function () {
                var given = parseFloat(answer.value);
                var errLog = Math.abs(A.decToLogMAR(given) - A.decToLogMAR(st.trueVA));
                var score = Math.round(Math.max(0, 100 - errLog * 250));
                var nb = Object.keys(st.presented).length;
                Store.recordScore('acuity', score, { lines: nb });
                trainBox.appendChild(UI.note(
                  (score >= 85 ? '✔ ' : '✘ ') + (st.fromCase ? 'Œil ' + (st.eye === 'od' ? 'droit' : 'gauche') + ' — a' : 'A') +
                  'cuité réelle : <b>' + Optics.r2(st.trueVA * 10, 2) + '/10</b> (logMAR ' +
                  A.decToLogMAR(st.trueVA).toFixed(2) + '). Votre réponse : ' + Optics.r2(given * 10, 2) + '/10. ' +
                  'Score <b>' + score + ' %</b> en ' + nb + ' lignes présentées.',
                  score >= 85 ? '' : 'warn'));
              }, 'primary'),
              st.fromCase ? null : UI.btn('Nouveau patient', function () { newTrainee(); })
            ].filter(Boolean)),
            UI.note('<b>Méthode :</b> commencez au-dessus de l’acuité supposée, descendez ligne par ligne. L’acuité retenue est la <b>dernière ligne lue en entier</b> (ou avec au plus une erreur selon les conventions du service). Notez toujours la distance et la correction portée.')
          ])
        ]));
      }

      /* ---------- assemblage ---------- */
      var controls = el('div', { class: 'card' }, [
        el('div', { class: 'btn-row' }, [
          el('span', { class: 'muted small', text: 'Optotype :' }),
          (function () {
            var sel = UI.select([
              { value: 'letters', label: 'Lettres (Monoyer)' },
              { value: 'digits', label: 'Chiffres' },
              { value: 'landolt', label: 'Anneaux de Landolt' },
              { value: 'e', label: 'E de Snellen' },
              { value: 'parinaud', label: 'Parinaud (vision de près)' }
            ], 'letters', function (v) { st.type = v; drawChart(); });
            sel.style.width = 'auto'; sel.style.minWidth = '190px';
            return sel;
          })(),
          el('span', { class: 'muted small', text: 'Distance :' }),
          (function () {
            var sel = UI.select([
              { value: 0.4, label: '40 cm — depuis votre chaise' },
              { value: 0.6, label: '60 cm — depuis votre chaise' },
              { value: 1, label: '1 m' }, { value: 2, label: '2 m' }, { value: 3, label: '3 m' },
              { value: 4, label: '4 m' }, { value: 5, label: '5 m — taille réelle (France)' }, { value: 6, label: '6 m — taille réelle (anglo-saxon)' }
            ], st.dist, function (v) {
              st.dist = parseFloat(v);
              if (st.dist >= 3) Store.setting('testDistance', st.dist);
              drawChart(); drawCal();
            });
            sel.style.width = 'auto'; sel.style.minWidth = '210px';
            return sel;
          })(),
          UI.btn('Barres de crowding', function () { st.crowd = !st.crowd; drawChart(); }),
          UI.btn('Masquer les autres lignes', function () { st.mask = !st.mask; drawChart(); }),
          UI.btn('Mélanger', function () { st.seed = Math.floor(Math.random() * 9999); drawChart(); }),
          UI.btn('Tout afficher', function () { st.isolate = null; st.mask = false; drawChart(); })
        ])
      ]);

      drawChart(); drawCal();

      var tabsNode = UI.tabs([
        { id: 'chart', label: '📋 Échelle' },
        { id: 'train', label: '🎯 Mesurer un patient' },
        { id: 'theory', label: '📖 Méthode & normes' }
      ], function (id) { return tabContent(id); }, presetAcuity ? 'train' : 'chart');

      function tabContent(id) {
        if (id === 'chart') return el('div', {}, [controls, chart, UI.card('Calibration de l’écran', calBox)]);
        if (id === 'train') {
          if (st.trueVA === null) newTrainee(presetAcuity); else drawTrain();
          return UI.card('Mesure d’acuité sur patient simulé', trainBox);
        }
        return el('div', {}, [
          UI.card('Conduite de la mesure', UI.accordion([
            { title: 'Conditions', open: true, body: '<ul><li>Éclairage de la salle et de l’échelle standardisés (85 à 320 cd/m²).</li><li>Distance respectée : 5 m en France, 6 m (20 pieds) dans les pays anglo-saxons, 4 m pour l’ETDRS.</li><li>Occlusion complète et non compressive de l’œil non testé (le patient ne doit pas appuyer sur le globe).</li><li>Toujours noter : sans correction / avec correction / avec trou sténopéique.</li></ul>' },
            { title: 'Ordre de mesure', body: '<ol><li>Œil droit, puis œil gauche, puis les deux yeux.</li><li>De loin, puis de près à la distance habituelle du patient.</li><li>Le trou sténopéique améliore une baisse d’origine réfractive, pas une baisse organique : c’est un test de débrouillage précieux.</li></ol>' },
            { title: 'Chez l’enfant', body: '<ul><li>0–6 mois : réflexe de fixation-poursuite, regard préférentiel (cartes de Teller).</li><li>6 mois–2 ans : bébé-vision, cartes de Cardiff.</li><li>2–4 ans : images de Rossano-Weiss, Pigassou.</li><li>4–6 ans : Sander-Zanlonghi, E de Snellen directionnel, Landolt.</li><li>&gt; 6 ans : Monoyer.</li></ul>' },
            { title: 'Pièges', body: '<ul><li>Le <b>crowding</b> majore l’écart chez l’amblyope : privilégier les lignes entières.</li><li>Un patient qui plisse les yeux réalise un sténopé naturel.</li><li>Vérifier que le patient ne mémorise pas la ligne : changer d’optotypes entre les deux yeux.</li><li>Une acuité qui ne s’améliore ni avec la correction ni au sténopé impose un examen organique.</li></ul>' }
          ])),
          UI.card('Normes et repères', UI.table(['Situation', 'Repère'], [
            ['Acuité normale de l’adulte', '10/10 ou mieux, souvent 12/10 à 16/10 chez le sujet jeune'],
            ['Acuité à 1 mois', '≈ 1/20 · à 1 an ≈ 3/10 · à 3 ans ≈ 6/10 · à 6 ans 10/10'],
            ['Malvoyance (OMS)', 'AV du meilleur œil corrigé < 3/10'],
            ['Cécité légale (France)', 'AV < 1/20 au meilleur œil ou champ visuel < 20°'],
            ['Permis de conduire B', 'AV binoculaire ≥ 5/10 (avec au moins 1/10 sur l’œil le plus faible)'],
            ['Différence significative entre 2 yeux', '≥ 2/10 ou 2 lignes → suspicion d’amblyopie']
          ]))
        ]);
      }

      return UI.page({
        crumb: 'Simulateurs',
        title: 'Échelles d’acuité visuelle',
        subtitle: 'Échelles affichées à leur <b>taille physique réelle</b> après calibration de l’écran. Cliquez une ligne pour l’isoler, ' +
                  'activez les barres de crowding, puis entraînez-vous à mesurer un patient simulé.'
      }, [tabsNode]);
    }
  };
})();
