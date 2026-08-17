/* ============================================================
   Champ visuel — périmétrie automatisée & grille d'Amsler
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  var XS = [-27, -21, -15, -9, -3, 3, 9, 15, 21, 27];
  var YS = [-21, -15, -9, -3, 3, 9, 15, 21];

  var PATTERNS = {
    normal: { name: 'Champ visuel normal', txt: 'Sensibilités homogènes autour de 28–32 dB, décroissant en périphérie. Seule la tache aveugle est absolue, à 15° en temporal.' },
    nasal_step: { name: 'Ressaut nasal (glaucome débutant)', txt: 'Marche nasale supérieure respectant le méridien horizontal : le déficit glaucomateux le plus précoce, souvent asymptomatique.' },
    bjerrum: { name: 'Scotome arciforme de Bjerrum', txt: 'Déficit arciforme partant de la tache aveugle et contournant la fixation jusqu’au raphé nasal. Typique du glaucome évolué.' },
    altitudinal: { name: 'Déficit altitudinal', txt: 'Perte d’un hémichamp horizontal respectant strictement le méridien horizontal : neuropathie optique ischémique antérieure, glaucome très évolué.' },
    bitemporal: { name: 'Hémianopsie bitemporale', txt: 'Perte des deux hémichamps temporaux respectant le méridien vertical : atteinte chiasmatique (adénome hypophysaire).' },
    hlh_droite: { name: 'Hémianopsie latérale homonyme droite', txt: 'Perte des hémichamps droits des deux yeux : lésion rétro-chiasmatique gauche. Congruence d’autant plus grande que la lésion est postérieure.' },
    quadranopsie: { name: 'Quadranopsie supérieure homonyme droite', txt: 'Atteinte de la boucle de Meyer (radiations temporales gauches) — « pie in the sky ».' },
    central: { name: 'Scotome central', txt: 'Déficit central profond avec périphérie conservée : maculopathie ou neuropathie optique (NORB, toxique, Leber).' },
    coecocentral: { name: 'Scotome cœco-central', txt: 'Déficit reliant la tache aveugle à la fixation : neuropathies optiques toxiques et nutritionnelles.' },
    concentrique: { name: 'Rétrécissement concentrique', txt: 'Périphérie effondrée avec îlot central conservé : rétinopathie pigmentaire, glaucome terminal, atteinte fonctionnelle.' },
    tache: { name: 'Élargissement de la tache aveugle', txt: 'Signe d’œdème papillaire (hypertension intracrânienne) ou de papillite.' }
  };

  // bruit reproductible : un même relevé donne toujours les mêmes valeurs
  function noise(x, y, eye, pattern) {
    var n = Math.sin(x * 12.9898 + y * 78.233 + (eye === 'od' ? 0 : 37.7) + pattern.length * 3.1) * 43758.5453;
    return (n - Math.floor(n)) * 2 - 1;
  }

  function sensitivity(pattern, x, y, eye) {
    var base = 32 - Math.sqrt(x * x + y * y) * 0.17;
    var bsX = eye === 'od' ? 15 : -15;
    if (Math.abs(x - bsX) <= 3 && Math.abs(y + 3) <= 3) return 0;   // tache aveugle
    var v = base + noise(x, y, eye, pattern);
    switch (pattern) {
      case 'nasal_step':
        if (((eye === 'od' && x < 0) || (eye === 'os' && x > 0)) && y > 0 && Math.abs(x) > 6) v -= 14;
        break;
      case 'bjerrum':
        var d = Math.abs(Math.sqrt(x * x + (y - 8) * (y - 8)) - 14);
        if (y > 0 && d < 6) v -= 22;
        if (((eye === 'od' && x < -6) || (eye === 'os' && x > 6)) && y > 2) v -= 12;
        break;
      case 'altitudinal':
        if (y > 0) v -= 26;
        break;
      case 'bitemporal':
        if ((eye === 'od' && x > 0) || (eye === 'os' && x < 0)) v -= 27;
        break;
      case 'hlh_droite':
        if (x > 0) v -= 28;
        break;
      case 'quadranopsie':
        if (x > 0 && y > 0) v -= 28;
        break;
      case 'central':
        if (Math.sqrt(x * x + y * y) < 10) v -= 28;
        break;
      case 'coecocentral':
        if (y > -8 && y < 4 && x > Math.min(0, bsX) - 4 && x < Math.max(0, bsX) + 4) v -= 24;
        break;
      case 'concentrique':
        if (Math.sqrt(x * x + y * y) > 12) v -= 26;
        break;
      case 'tache':
        if (Math.abs(x - bsX) <= 9 && Math.abs(y + 3) <= 9) v -= 24;
        break;
    }
    return Math.max(0, Math.round(v));
  }

  function fieldSVG(pattern, eye, mode) {
    var g = s('svg', { viewBox: '0 0 420 380', style: 'width:100%;max-width:420px;height:auto;background:#0b1117;border-radius:10px' });
    var cx = 210, cy = 185, k = 6.4;
    g.appendChild(s('line', { x1: cx, y1: 20, x2: cx, y2: 350, stroke: '#22303d' }));
    g.appendChild(s('line', { x1: 20, y1: cy, x2: 400, y2: cy, stroke: '#22303d' }));
    XS.forEach(function (x) {
      YS.forEach(function (y) {
        if (Math.abs(x) === 27 && Math.abs(y) > 9) return;
        var v = sensitivity(pattern, x, y, eye);
        var px = cx + x * k, py = cy - y * k;
        if (mode === 'grey') {
          var lum = Math.max(0, Math.min(1, v / 32));
          var c = Math.round(lum * 235);
          g.appendChild(s('rect', { x: px - 10, y: py - 10, width: 20, height: 20, fill: 'rgb(' + c + ',' + c + ',' + c + ')' }));
        } else {
          g.appendChild(s('text', {
            x: px, y: py + 4, 'text-anchor': 'middle', 'font-size': '11', 'font-family': 'monospace',
            fill: v === 0 ? '#ef5f6b' : v < 15 ? '#f0b23c' : '#cfe0ec'
          }, v === 0 ? '<0' : String(v)));
        }
      });
    });
    g.appendChild(s('circle', { cx: cx, cy: cy, r: 4, fill: '#35c4b5' }));
    g.appendChild(s('text', { x: 16, y: 370, fill: '#5f7688', 'font-size': '11' }, 'Œil ' + (eye === 'od' ? 'DROIT' : 'GAUCHE') + ' · grille type 24-2 · valeurs en dB'));
    return g;
  }

  /* ---------------- Amsler ---------------- */
  var AMSLER = {
    normal: 'Grille perçue régulière, lignes droites, carré central visible : normal.',
    central: 'Tache sombre centrale masquant le point de fixation : scotome central (maculopathie, NORB).',
    meta: 'Lignes ondulées, carreaux de tailles inégales : métamorphopsies — soulèvement maculaire (DMLA exsudative, CRSC, membrane épirétinienne).',
    para: 'Tache paracentrale à distance du point de fixation : scotome paracentral.',
    hemi: 'Moitié de la grille manquante respectant le méridien vertical : atteinte rétro-chiasmatique.'
  };

  function amslerSVG(kind) {
    var S = 340, N = 20, step = S / N;
    var g = s('svg', { viewBox: '0 0 ' + S + ' ' + S, style: 'width:100%;max-width:340px;height:auto;background:#000;border-radius:8px' });
    function warp(x, y) {
      if (kind !== 'meta') return { x: x, y: y };
      var dx = x - S / 2, dy = y - S / 2, d = Math.sqrt(dx * dx + dy * dy);
      var amp = Math.exp(-(d * d) / (2 * 62 * 62)) * 16;
      return { x: x + Math.sin(y / 26) * amp, y: y + Math.cos(x / 26) * amp };
    }
    for (var i = 0; i <= N; i++) {
      var d1 = '', d2 = '';
      for (var j = 0; j <= N * 4; j++) {
        var t = (j / (N * 4)) * S;
        var p1 = warp(t, i * step), p2 = warp(i * step, t);
        d1 += (j ? 'L' : 'M') + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1) + ' ';
        d2 += (j ? 'L' : 'M') + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1) + ' ';
      }
      g.appendChild(s('path', { d: d1, fill: 'none', stroke: '#ffffff', 'stroke-width': 1 }));
      g.appendChild(s('path', { d: d2, fill: 'none', stroke: '#ffffff', 'stroke-width': 1 }));
    }
    if (kind === 'central') g.appendChild(s('circle', { cx: S / 2, cy: S / 2, r: 46, fill: '#000' }));
    if (kind === 'para') g.appendChild(s('ellipse', { cx: S / 2 + 62, cy: S / 2 - 40, rx: 38, ry: 30, fill: '#000' }));
    if (kind === 'hemi') g.appendChild(s('rect', { x: S / 2, y: 0, width: S / 2, height: S, fill: '#000' }));
    g.appendChild(s('circle', { cx: S / 2, cy: S / 2, r: 3.4, fill: kind === 'central' ? '#333' : '#ffffff' }));
    return g;
  }

  M.fields = {
    id: 'fields', title: 'Champ visuel & Amsler', icon: '🗺', group: 'Simulateurs',
    desc: 'Périmétrie 24-2, reconnaissance des déficits, grille d’Amsler',
    keywords: 'champ visuel perimetrie amsler scotome hemianopsie quadranopsie bjerrum glaucome',
    render: function (ctx) {
      var pp = (ctx && ctx.params) || {};
      var presetFields = (pp.sim && pp.sim.fields) || null;
      var presetAmsler = (pp.sim && pp.sim.amsler) || null;

      function tabPerim() {
        var st = { pattern: presetFields ? (presetFields.od || 'normal') : 'normal', mode: 'db', quiz: null, byEye: presetFields };
        var holder = el('div', { class: 'grid g2' });
        var caption = el('div');

        function draw(silent) {
          UI.clear(holder);
          var pOD = st.byEye ? (st.byEye.od || 'normal') : st.pattern;
          var pOS = st.byEye ? (st.byEye.os || 'normal') : st.pattern;
          holder.appendChild(el('div', {}, fieldSVG(pOD, 'od', st.mode)));
          holder.appendChild(el('div', {}, fieldSVG(pOS, 'os', st.mode)));
          UI.clear(caption);
          if (!silent) {
            if (st.byEye) {
              caption.appendChild(el('h3', { text: 'Relevé du dossier' }));
              caption.appendChild(el('p', { class: 'selectable', html:
                '<b>OD — ' + PATTERNS[pOD].name + '.</b> ' + PATTERNS[pOD].txt + '<br><br>' +
                '<b>OG — ' + PATTERNS[pOS].name + '.</b> ' + PATTERNS[pOS].txt }));
            } else {
              var p = PATTERNS[st.pattern];
              caption.appendChild(el('h3', { text: p.name }));
              caption.appendChild(el('p', { class: 'selectable', text: p.txt }));
            }
          }
        }

        var quizBox = el('div');
        function newQuiz() {
          var keys = Object.keys(PATTERNS);
          st.quiz = keys[Math.floor(Math.random() * keys.length)];
          st.pattern = st.quiz;
          st.byEye = null;
          draw(true);
          UI.clear(quizBox);
          var sel = UI.select(keys.map(function (k) { return { value: k, label: PATTERNS[k].name }; }), 'normal', function () {});
          quizBox.appendChild(UI.field('Quel déficit reconnaissez-vous ?', sel));
          quizBox.appendChild(el('div', { class: 'btn-row' }, [
            UI.btn('Valider', function () {
              var ok = sel.value === st.quiz;
              Store.recordScore('fields', ok ? 100 : 0);
              quizBox.appendChild(UI.note((ok ? '✔ ' : '✘ ') + '<b>' + PATTERNS[st.quiz].name + '</b> — ' + PATTERNS[st.quiz].txt, ok ? '' : 'warn'));
            }, 'primary'),
            UI.btn('Autre champ visuel', newQuiz)
          ]));
        }

        draw();
        quizBox.appendChild(el('p', { class: 'muted', text: 'Un relevé est tiré au sort, à vous de nommer le déficit.' }));
        quizBox.appendChild(UI.btn('Lancer le mode reconnaissance', newQuiz, 'primary'));

        return el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Périmétrie automatisée (24-2)', [
              el('div', { class: 'btn-row', style: { marginBottom: '10px' } }, [
                UI.btn('Valeurs en dB', function () { st.mode = 'db'; draw(true); }),
                UI.btn('Échelle de gris', function () { st.mode = 'grey'; draw(true); }),
                UI.btn('Régénérer', function () { draw(true); })
              ]),
              holder,
              caption
            ]),
            UI.card('Mode reconnaissance', quizBox)
          ]),
          el('div', {}, [
            UI.card(presetFields ? 'Comparer avec d’autres tableaux (hors dossier)' : 'Choisir un tableau',
              el('div', { class: 'flex wrap' }, Object.keys(PATTERNS).map(function (k) {
              return el('span', { class: 'chip', text: PATTERNS[k].name, onClick: function () { st.pattern = k; st.byEye = null; draw(); } });
            }))),
            UI.card('Lire un relevé', UI.accordion([
              { title: 'Indices de fiabilité', open: true, body: '<ul><li><b>Pertes de fixation</b> < 20 %</li><li><b>Faux positifs</b> < 15 % (patient « gâchette facile »)</li><li><b>Faux négatifs</b> < 15 %</li></ul><p>Un relevé non fiable ne s’interprète pas : on le refait.</p>' },
              { title: 'Les indices globaux', body: '<ul><li><b>MD (Mean Deviation)</b> : déficit moyen — sensible aux atteintes diffuses (cataracte).</li><li><b>PSD</b> : déficit localisé — plus spécifique du glaucome.</li><li><b>VFI</b> : pourcentage de champ résiduel, utile au suivi.</li><li><b>GHT</b> : comparaison de zones miroirs supérieure/inférieure.</li></ul>' },
              { title: 'Règles d’or', body: '<ul><li>Un déficit respectant le <b>méridien vertical</b> = lésion chiasmatique ou rétro-chiasmatique.</li><li>Un déficit respectant le <b>méridien horizontal</b> = atteinte du nerf optique ou de la rétine (glaucome, NOIA).</li><li>Plus la lésion est postérieure, plus l’hémianopsie est <b>congruente</b>.</li><li>Toujours confronter au fond d’œil et à l’acuité.</li></ul>' },
              { title: 'Rôle de l’orthoptiste', body: '<p>Réalisation, contrôle de la fiabilité, choix de la stratégie (SITA standard/fast, 24-2, 10-2, 30-2, cinétique de Goldmann), installation du patient (correction de près adaptée, occlusion, position), et suivi longitudinal.</p>' }
            ]))
          ])
        ]);
      }

      function tabAmsler() {
        var st = { kind: presetAmsler && AMSLER[presetAmsler] ? presetAmsler : 'normal', quiz: null };
        var view = el('div', { class: 'stage', style: { padding: '18px' } });
        var cap = el('div');

        function draw(silent) {
          UI.clear(view);
          view.appendChild(el('div', { class: 'stage-label', text: 'Ce que décrit le patient' }));
          view.appendChild(amslerSVG(st.kind));
          UI.clear(cap);
          if (!silent) cap.appendChild(UI.note(AMSLER[st.kind]));
        }

        var quizBox = el('div');
        function newQuiz() {
          var keys = Object.keys(AMSLER);
          st.quiz = keys[Math.floor(Math.random() * keys.length)];
          st.kind = st.quiz; draw(true);
          UI.clear(quizBox);
          var sel = UI.select([
            { value: 'normal', label: 'Grille normale' },
            { value: 'central', label: 'Scotome central' },
            { value: 'meta', label: 'Métamorphopsies' },
            { value: 'para', label: 'Scotome paracentral' },
            { value: 'hemi', label: 'Hémianopsie' }
          ], 'normal', function () {});
          quizBox.appendChild(UI.field('Interprétation', sel));
          quizBox.appendChild(el('div', { class: 'btn-row' }, [
            UI.btn('Valider', function () {
              var ok = sel.value === st.quiz;
              Store.recordScore('fields', ok ? 100 : 0);
              quizBox.appendChild(UI.note((ok ? '✔ ' : '✘ ') + AMSLER[st.quiz], ok ? '' : 'warn'));
            }, 'primary'),
            UI.btn('Autre cas', newQuiz)
          ]));
        }

        draw();

        return el('div', { class: 'split' }, [
          el('div', {}, [UI.card('Grille d’Amsler', [view, cap]), UI.card('Entraînement', quizBox)]),
          el('div', {}, [
            UI.card('Tableaux', el('div', { class: 'flex wrap' }, Object.keys(AMSLER).map(function (k) {
              return el('span', { class: 'chip', text: k, onClick: function () { st.kind = k; draw(); } });
            }))),
            UI.card('Mode d’emploi', el('ul', {
              html: '<li>À <b>30 cm</b>, avec la <b>correction de près</b>, un œil à la fois.</li>' +
                '<li>Fixer le point central sans le quitter des yeux.</li>' +
                '<li>Questions : « Voyez-vous les 4 coins ? Le carré central ? Des lignes ondulées ? Une zone manquante ou floue ? »</li>' +
                '<li>La grille couvre les <b>10° centraux</b>.</li>' +
                '<li>À remettre au patient pour l’<b>autosurveillance</b> hebdomadaire dans la DMLA.</li>'
            })),
            UI.card('Attention', UI.note('Un patient avec un scotome central peut « compléter » mentalement la grille (phénomène de <b>complétion perceptive</b>) et déclarer la voir normale. Toujours interroger précisément, œil par œil.', 'warn'))
          ])
        ]);
      }

      var tabsNode = UI.tabs([
        { id: 'perim', label: '🗺 Périmétrie' },
        { id: 'amsler', label: '▦ Grille d’Amsler' }
      ], function (id) { return id === 'perim' ? tabPerim() : tabAmsler(); });

      return UI.page({
        crumb: 'Simulateurs',
        title: 'Champ visuel & grille d’Amsler',
        subtitle: 'Onze tableaux périmétriques générés, affichables en dB ou en échelle de gris, plus la grille d’Amsler ' +
                  'telle que la décrit le patient.'
      }, [tabsNode]);
    }
  };
})();
