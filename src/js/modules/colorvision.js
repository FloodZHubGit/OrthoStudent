/* ============================================================
   Vision des couleurs — planches pseudo-isochromatiques & D15
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  /* palettes de confusion rouge-vert */
  var PAL = {
    figRG: ['#d8763a', '#c9612e', '#e08c4a', '#c96f45', '#d98a55'],
    bgRG: ['#9aa757', '#8f9c4f', '#adb767', '#94a35c', '#a4ae62', '#7f8f4a'],
    figBY: ['#7f8bd0', '#6f7cc6', '#8e99da'],
    bgBY: ['#c9c07a', '#bdb46f', '#d4cb88'],
    figDemo: ['#c94f4f', '#d96060', '#b84444'],
    bgDemo: ['#8d97a1', '#7d8790', '#9aa4ae']
  };

  function makeMask(text, size) {
    var c = document.createElement('canvas');
    c.width = size; c.height = size;
    var g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, size, size);
    g.fillStyle = '#fff';
    g.font = 'bold ' + Math.round(size * 0.62) + 'px Arial';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, size / 2, size / 2 + size * 0.02);
    return g.getImageData(0, 0, size, size).data;
  }

  function plateSVG(text, kind, seed) {
    var SIZE = 300;
    var mask = makeMask(text, SIZE);
    var rand = (function (x) { return function () { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; }; })(seed || 42);
    var fig = kind === 'by' ? PAL.figBY : kind === 'demo' ? PAL.figDemo : PAL.figRG;
    var bg = kind === 'by' ? PAL.bgBY : kind === 'demo' ? PAL.bgDemo : PAL.bgRG;

    var g = s('svg', { viewBox: '0 0 ' + SIZE + ' ' + SIZE, style: 'width:100%;max-width:300px;height:auto' });
    g.appendChild(s('circle', { cx: SIZE / 2, cy: SIZE / 2, r: SIZE / 2, fill: '#efe9dd' }));

    // Grille spatiale : la recherche de collision ne teste que les cases voisines
    // (sinon le remplissage devient quadratique et fige l'interface).
    var CELL = 16, GW = Math.ceil(SIZE / CELL);
    var grid = new Array(GW * GW);
    for (var gi = 0; gi < grid.length; gi++) grid[gi] = [];

    function collides(x, y, r) {
      var cx0 = Math.max(0, Math.floor((x - r - 8) / CELL));
      var cx1 = Math.min(GW - 1, Math.floor((x + r + 8) / CELL));
      var cy0 = Math.max(0, Math.floor((y - r - 8) / CELL));
      var cy1 = Math.min(GW - 1, Math.floor((y + r + 8) / CELL));
      for (var gx = cx0; gx <= cx1; gx++) {
        for (var gy = cy0; gy <= cy1; gy++) {
          var cell = grid[gy * GW + gx];
          for (var i = 0; i < cell.length; i++) {
            var c = cell[i], ddx = c.x - x, ddy = c.y - y;
            if (ddx * ddx + ddy * ddy < (c.r + r + 0.9) * (c.r + r + 0.9)) return true;
          }
        }
      }
      return false;
    }

    var circles = [], attempts = 0;
    while (circles.length < 1500 && attempts < 22000) {
      attempts++;
      var r = 2.4 + rand() * 5.4;
      var x = rand() * SIZE, y = rand() * SIZE;
      var dx = x - SIZE / 2, dy = y - SIZE / 2;
      if (Math.sqrt(dx * dx + dy * dy) > SIZE / 2 - r - 1) continue;
      if (collides(x, y, r)) continue;
      var mx = Math.max(0, Math.min(SIZE - 1, Math.round(x)));
      var my = Math.max(0, Math.min(SIZE - 1, Math.round(y)));
      var circle = { x: x, y: y, r: r, f: mask[(my * SIZE + mx) * 4] > 128 };
      circles.push(circle);
      grid[Math.floor(y / CELL) * GW + Math.floor(x / CELL)].push(circle);
    }

    circles.forEach(function (c) {
      var pal = c.f ? fig : bg;
      g.appendChild(s('circle', { cx: c.x, cy: c.y, r: c.r, fill: pal[Math.floor(rand() * pal.length)] }));
    });
    return g;
  }

  /* ---- D15 : 15 pastilles réparties sur le cercle des teintes ---- */
  function d15Colors() {
    var arr = [];
    for (var i = 0; i < 15; i++) {
      var h = (i / 15) * 300 + 20;
      arr.push({ i: i + 1, css: 'hsl(' + h + ',42%,58%)', h: h });
    }
    return arr;
  }

  M.colorvision = {
    id: 'colorvision', title: 'Vision des couleurs', icon: '🎨', group: 'Simulateurs',
    desc: 'Planches pseudo-isochromatiques, test de classement D15, dyschromatopsies',
    keywords: 'couleur ishihara dyschromatopsie protan deutan tritan farnsworth d15 daltonisme',
    render: function (ctx) {
      var sim = ctx && ctx.params && ctx.params.sim;
      var patientType = sim ? (sim.colorvision || 'normal') : null;   // 'normal' | 'rg' | 'by'

      /* ---- onglet planches ---- */
      function tabPlates() {
        var seq = [
          { t: '12', k: 'demo', rg: '12', by: '12', note: 'Planche de démonstration : lue par tous, y compris les dyschromates. Sert à vérifier la compréhension de la consigne.' },
          { t: '8', k: 'rg', rg: '3', by: '8', note: 'Planche de disparition : lue 8 par le sujet normal, non lue ou lue 3 par le dyschromate rouge-vert.' },
          { t: '29', k: 'rg', rg: '70', by: '29', note: 'Planche de transformation : 29 pour le normal, 70 pour le dyschromate rouge-vert.' },
          { t: '5', k: 'rg', rg: '2', by: '5', note: 'Planche de transformation rouge-vert.' },
          { t: '74', k: 'rg', rg: '21', by: '74', note: 'Planche classique : 74 pour le normal, 21 pour le dyschromate rouge-vert.' },
          { t: '6', k: 'by', rg: '6', by: '—', note: 'Planche d’axe bleu-jaune : les dyschromatopsies tritan sont presque toujours acquises (maculopathies, glaucome, toxiques).' },
          { t: '45', k: 'rg', rg: '—', by: '45', note: 'Planche de disparition rouge-vert.' },
          { t: '97', k: 'rg', rg: '—', by: '97', note: 'Planche de disparition rouge-vert.' }
        ];
        var idx = 0, right = 0, answered = 0;
        var holder = el('div', { class: 'stage', style: { padding: '20px' } });
        var fb = el('div');
        var inp = el('input', { type: 'text', class: 'inp', placeholder: 'Chiffre lu…', style: 'max-width:180px' });

        function reading(p) {
          if (patientType === 'rg') return p.rg;
          if (patientType === 'by') return p.by;
          return p.t;
        }

        function draw() {
          UI.clear(holder); UI.clear(fb);
          holder.appendChild(el('div', { class: 'stage-label', text: 'Planche ' + (idx + 1) + ' / ' + seq.length }));
          holder.appendChild(plateSVG(seq[idx].t, seq[idx].k, 1000 + idx * 37));
          inp.value = '';
          if (patientType) {
            var r = reading(seq[idx]);
            fb.appendChild(el('div', { class: 'speech' }, [
              el('span', { class: 'who', text: 'Le patient' }),
              el('span', { text: r === '—' ? '« Je ne vois aucun chiffre. »' : '« Je lis ' + r + '. »' })
            ]));
          }
        }

        function check() {
          answered++;
          var ok = inp.value.trim() === seq[idx].t;
          if (ok) right++;
          UI.clear(fb);
          fb.appendChild(UI.note((ok ? '✔ ' : '✘ Réponse : <b>' + seq[idx].t + '</b>. ') + seq[idx].note, ok ? '' : 'warn'));
          if (answered >= seq.length) {
            var sc = Math.round((right / seq.length) * 100);
            Store.recordScore('colorvision', sc);
            fb.appendChild(UI.note('Série terminée : <b>' + right + '/' + seq.length + '</b> planches lues (' + sc + ' %).'));
          }
        }

        /* conclusion en mode dossier */
        var concl = el('div');
        if (patientType) {
          var sel = UI.select([
            { value: 'normal', label: 'Vision des couleurs normale' },
            { value: 'rg', label: 'Dyschromatopsie d’axe rouge-vert' },
            { value: 'by', label: 'Dyschromatopsie d’axe bleu-jaune' }
          ], 'normal', function () {});
          concl.appendChild(UI.field('Votre conclusion après avoir passé les 8 planches', sel));
          concl.appendChild(el('div', { class: 'btn-row' }, [
            UI.btn('Valider', function () {
              var ok = sel.value === patientType;
              Store.recordScore('colorvision', ok ? 100 : 0);
              var lbl = { normal: 'vision des couleurs normale', rg: 'dyschromatopsie d’axe rouge-vert', by: 'dyschromatopsie d’axe bleu-jaune' };
              concl.appendChild(UI.note((ok ? '✔ Exact — ' : '✘ Il s’agit d’une ') + '<b>' + lbl[patientType] + '</b>. ' +
                (patientType === 'by' ? 'Un axe bleu-jaune est presque toujours <b>acquis</b> : maculopathie, glaucome, cause toxique.'
                  : patientType === 'rg' ? 'Un axe rouge-vert est le plus souvent <b>congénital</b> (8 % des hommes) mais peut aussi révéler une neuropathie optique s’il est unilatéral ou récent.'
                  : 'Toutes les planches sont lues correctement.'), ok ? '' : 'warn'));
            }, 'primary')
          ]));
        }

        draw();

        return el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Planches pseudo-isochromatiques', [
              patientType ? UI.note('📁 <b>Dossier patient</b> — présentez les 8 planches et notez ce que le patient répond, puis concluez.') : null,
              holder,
              el('div', { class: 'btn-row', style: { marginTop: '12px' } }, [
                patientType ? null : inp,
                patientType ? null : UI.btn('Valider', check, 'primary'),
                UI.btn('◀ Planche précédente', function () { idx = (idx + seq.length - 1) % seq.length; draw(); }),
                UI.btn('Planche suivante ▶', function () { idx = (idx + 1) % seq.length; draw(); }, patientType ? 'primary' : ''),
                UI.btn('Régénérer', function () { draw(); })
              ].filter(Boolean)),
              fb,
              UI.note('Les planches sont <b>générées procéduralement</b> à partir des couples de confusion classiques. ' +
                'Elles servent à comprendre le principe : un dépistage réel exige des planches imprimées calibrées, sous éclairant D65 (lumière du jour), à 75 cm, 3 secondes par planche.', 'warn')
            ].filter(Boolean)),
            patientType ? UI.card('Conclusion', concl) : null
          ].filter(Boolean)),
          el('div', {}, [
            UI.card('Comment fonctionne une planche ?', el('ul', {
              html: '<li><b>Planche de démonstration</b> : lue par tous.</li>' +
                '<li><b>Planche de disparition</b> : lue par le normal, non lue par le dyschromate.</li>' +
                '<li><b>Planche de transformation</b> : le normal lit un chiffre, le dyschromate en lit un autre.</li>' +
                '<li><b>Planche cachée</b> : seul le dyschromate lit le chiffre.</li>' +
                '<li><b>Planche de classification</b> : distingue protan de deutan.</li>'
            })),
            UI.card('Limites de l’Ishihara', el('ul', {
              html: '<li>Ne dépiste que l’axe <b>rouge-vert</b> : il faut le Farnsworth pour l’axe bleu-jaune.</li>' +
                '<li>Ne quantifie pas la sévérité — utiliser l’anomaloscope de Nagel pour cela.</li>' +
                '<li>Inutilisable si l’acuité est trop basse (< 2/10) ou chez le très jeune enfant (préférer les planches à symboles).</li>'
            }))
          ])
        ]);
      }

      /* ---- onglet D15 ---- */

      // Classements types : le sujet normal suit le cercle des teintes,
      // le dyschromate saute d'une teinte à sa confondue, ce qui trace
      // des cordes parallèles en travers du cercle.
      var D15_PATIENT = {
        normal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        rg: [1, 2, 3, 4, 5, 14, 15, 6, 13, 7, 12, 8, 11, 9, 10],
        by: [1, 2, 10, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15, 8, 9]
      };

      function tabD15Patient() {
        var colors = d15Colors();
        var order = D15_PATIENT[patientType] || D15_PATIENT.normal;
        var plot = el('div');
        var caps = el('div', { class: 'flex wrap' });
        var fb = el('div');

        order.forEach(function (n, i) {
          caps.appendChild(el('div', {
            style: {
              width: '44px', height: '44px', borderRadius: '50%', background: colors[n - 1].css,
              border: '2px solid var(--line)', display: 'grid', placeItems: 'center',
              color: 'rgba(0,0,0,.55)', fontSize: '11px', fontWeight: '700'
            }, text: String(i + 1)
          }));
        });

        // diagramme du classement du patient
        var g = s('svg', { viewBox: '0 0 320 320', style: 'width:100%;max-width:320px;height:auto' });
        var pts = [];
        for (var k = 0; k < 15; k++) {
          var ang = (k / 15) * Math.PI * 2 - Math.PI / 2;
          var x = 160 + Math.cos(ang) * 120, y = 160 + Math.sin(ang) * 120;
          g.appendChild(s('circle', { cx: x, cy: y, r: 12, fill: colors[k].css, stroke: '#2a3945' }));
          g.appendChild(s('text', { x: x, y: y + 4, 'font-size': '9', 'text-anchor': 'middle', fill: '#111' }, String(k + 1)));
          pts[k] = { x: x, y: y };
        }
        var dpath = 'M ' + pts[order[0] - 1].x + ' ' + pts[order[0] - 1].y;
        for (var j = 1; j < order.length; j++) dpath += ' L ' + pts[order[j] - 1].x + ' ' + pts[order[j] - 1].y;
        g.appendChild(s('path', { d: dpath, fill: 'none', stroke: '#35c4b5', 'stroke-width': 2.4 }));
        plot.appendChild(g);

        var sel = UI.select([
          { value: 'normal', label: 'Classement normal — pas de croisement' },
          { value: 'rg', label: 'Axe rouge-vert (protan ou deutan)' },
          { value: 'by', label: 'Axe bleu-jaune (tritan)' }
        ], 'normal', function () {});

        return el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Classement rendu par le patient', [
              UI.note('📁 <b>Dossier patient</b> — voici l’ordre dans lequel ce patient a rangé les 15 pastilles. À vous de lire le tracé.'),
              caps
            ]),
            UI.card('Votre interprétation', [
              UI.field('Type de classement', sel),
              el('div', { class: 'btn-row' }, [
                UI.btn('Valider', function () {
                  var ok = sel.value === patientType;
                  Store.recordScore('colorvision', ok ? 100 : 0);
                  UI.clear(fb);
                  var lbl = { normal: 'classement normal', rg: 'axe rouge-vert', by: 'axe bleu-jaune' };
                  fb.appendChild(UI.note((ok ? '✔ Exact — ' : '✘ Il s’agit d’un ') + '<b>' + lbl[patientType] + '</b>. ' +
                    (patientType === 'normal'
                      ? 'Le tracé suit le cercle des teintes sans le traverser.'
                      : 'Les lignes qui traversent le cercle sont <b>parallèles entre elles</b> : leur orientation donne l’axe de confusion. ' +
                        (patientType === 'by' ? 'Un axe bleu-jaune est presque toujours acquis.' : 'Un axe rouge-vert est le plus souvent congénital.')),
                    ok ? '' : 'warn'));
                }, 'primary')
              ]),
              fb
            ])
          ]),
          el('div', {}, [
            UI.card('Diagramme de son classement', plot),
            UI.card('Lecture d’un D15', el('ul', {
              html: '<li><b>Aucun croisement</b> : classement normal ou dyschromatopsie très légère.</li>' +
                '<li><b>Croisements parallèles</b> : dyschromatopsie moyenne à sévère ; l’axe des lignes donne le type.</li>' +
                '<li><b>Axe protan</b> : confusion rouge-vert avec perte de luminosité du rouge.</li>' +
                '<li><b>Axe deutan</b> : confusion rouge-vert sans perte de luminosité.</li>' +
                '<li><b>Axe tritan</b> : confusion bleu-jaune — presque toujours <b>acquise</b>.</li>'
            }))
          ])
        ]);
      }

      function tabD15() {
        if (patientType) return tabD15Patient();
        var colors = d15Colors();
        var pool = colors.slice().sort(function () { return Math.random() - 0.5; });
        var chosen = [];
        var poolNode = el('div', { class: 'flex wrap' });
        var chainNode = el('div', { class: 'flex wrap' });
        var plotNode = el('div');
        var fb = el('div');

        function cap(c, onClick, n) {
          return el('div', {
            style: {
              width: '46px', height: '46px', borderRadius: '50%', background: c.css,
              border: '2px solid var(--line)', cursor: onClick ? 'pointer' : 'default',
              display: 'grid', placeItems: 'center', color: 'rgba(0,0,0,.5)', fontSize: '11px', fontWeight: '700'
            },
            text: n !== undefined ? String(n) : '',
            onClick: onClick
          });
        }

        function redraw() {
          UI.clear(poolNode); UI.clear(chainNode);
          pool.forEach(function (c) {
            if (chosen.indexOf(c) >= 0) return;
            poolNode.appendChild(cap(c, function () { chosen.push(c); redraw(); }));
          });
          chainNode.appendChild(cap({ css: 'hsl(20,42%,58%)' }, null, 'P'));
          chosen.forEach(function (c, i) {
            chainNode.appendChild(cap(c, function () { chosen.splice(i, 1); redraw(); }, i + 1));
          });
        }

        function analyse() {
          if (chosen.length < 15) { UI.toast('Classez d’abord les 15 pastilles.'); return; }
          var errors = 0, crossings = 0;
          for (var i = 0; i < chosen.length; i++) {
            var expected = i + 1;
            errors += Math.abs(chosen[i].i - expected);
            if (i > 0 && Math.abs(chosen[i].i - chosen[i - 1].i) > 2) crossings++;
          }
          var score = Math.round(Math.max(0, 100 - errors * 3));
          Store.recordScore('colorvision', score);

          UI.clear(plotNode);
          var g = s('svg', { viewBox: '0 0 320 320', style: 'width:100%;max-width:320px;height:auto' });
          var pts = [];
          for (var k = 0; k < 15; k++) {
            var ang = (k / 15) * Math.PI * 2 - Math.PI / 2;
            var x = 160 + Math.cos(ang) * 120, y = 160 + Math.sin(ang) * 120;
            g.appendChild(s('circle', { cx: x, cy: y, r: 12, fill: colors[k].css, stroke: '#2a3945' }));
            g.appendChild(s('text', { x: x, y: y + 4, 'font-size': '9', 'text-anchor': 'middle', fill: '#111' }, String(k + 1)));
            pts[k] = { x: x, y: y };
          }
          var d = 'M ' + pts[chosen[0].i - 1].x + ' ' + pts[chosen[0].i - 1].y;
          for (var j = 1; j < chosen.length; j++) d += ' L ' + pts[chosen[j].i - 1].x + ' ' + pts[chosen[j].i - 1].y;
          g.appendChild(s('path', { d: d, fill: 'none', stroke: '#35c4b5', 'stroke-width': 2.4 }));
          plotNode.appendChild(g);

          UI.clear(fb);
          fb.appendChild(UI.note('Erreurs cumulées : <b>' + errors + '</b> · croisements du cercle : <b>' + crossings + '</b> · score <b>' + score + ' %</b>.<br>' +
            (crossings === 0 ? 'Tracé régulier : classement normal.'
              : 'Des lignes traversent le cercle : dans un vrai D15, l’<b>orientation de ces axes de confusion</b> désigne le type — protan, deutan ou tritan.'),
            crossings === 0 ? '' : 'warn'));
        }

        redraw();

        return el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Test de classement (type Farnsworth D15)', [
              el('p', { class: 'muted', html: 'Classez les 15 pastilles <b>par ordre de teinte la plus proche</b>, en partant de la pastille de référence P. Cliquez pour ajouter, recliquez dans la chaîne pour retirer.' }),
              el('h3', { text: 'Pastilles mélangées' }), poolNode,
              el('h3', { text: 'Votre classement' }), chainNode,
              el('div', { class: 'btn-row mt16' }, [
                UI.btn('Analyser', analyse, 'primary'),
                UI.btn('Recommencer', function () { chosen = []; redraw(); UI.clear(plotNode); UI.clear(fb); })
              ]),
              fb
            ])
          ]),
          el('div', {}, [
            UI.card('Diagramme de classement', plotNode),
            UI.card('Lecture d’un D15', el('ul', {
              html: '<li><b>Aucun croisement</b> : classement normal ou dyschromatopsie très légère.</li>' +
                '<li><b>Croisements parallèles</b> : dyschromatopsie moyenne à sévère ; l’axe des lignes donne le type.</li>' +
                '<li><b>Axe protan</b> : confusion rouge-vert avec perte de luminosité du rouge.</li>' +
                '<li><b>Axe deutan</b> : confusion rouge-vert sans perte de luminosité.</li>' +
                '<li><b>Axe tritan</b> : confusion bleu-jaune — presque toujours <b>acquise</b>.</li>'
            }))
          ])
        ]);
      }

      /* ---- onglet théorie ---- */
      function tabTheory() {
        return el('div', {}, [
          UI.card('Dyschromatopsies congénitales', [
            UI.table(['Type', 'Cône concerné', 'Fréquence (hommes)', 'Particularités'], [
              ['Protanomalie', 'L (rouge) anormal', '≈ 1 %', 'Rouge assombri, confusion rouge-vert'],
              ['Protanopie', 'L absent', '≈ 1 %', 'Dichromate, rouge très sombre'],
              ['Deutéranomalie', 'M (vert) anormal', '≈ 5 %', 'La plus fréquente, souvent méconnue'],
              ['Deutéranopie', 'M absent', '≈ 1 %', 'Dichromate rouge-vert'],
              ['Tritanomalie / tritanopie', 'S (bleu)', '< 0,01 %', 'Très rare, autosomique'],
              ['Achromatopsie', 'Tous', '1/30 000', 'Acuité basse, nystagmus, photophobie majeure']
            ]),
            UI.note('Les dyschromatopsies rouge-vert congénitales sont <b>liées à l’X</b> : 8 % des hommes, 0,4 % des femmes. Elles sont <b>stables, bilatérales et symétriques</b> — c’est ce qui les distingue des formes acquises.')
          ]),
          UI.card('Dyschromatopsies acquises', [
            el('p', { html: 'Règle de Köllner (avec des exceptions) : les atteintes des <b>milieux et de la rétine externe</b> donnent plutôt un axe <b>bleu-jaune</b>, les atteintes du <b>nerf optique</b> un axe <b>rouge-vert</b>.' }),
            UI.table(['Contexte', 'Axe', 'Exemples'], [
              ['Neuropathie optique', 'Rouge-vert', 'NORB, neuropathie toxique (éthambutol), Leber'],
              ['Maculopathie', 'Bleu-jaune', 'DMLA, œdème maculaire, rétinopathie centrale séreuse'],
              ['Glaucome', 'Bleu-jaune', 'Précoce, avant les déficits périmétriques classiques'],
              ['Cataracte nucléaire', 'Bleu-jaune', 'Jaunissement du cristallin'],
              ['Diabète', 'Bleu-jaune', 'Même avant la rétinopathie visible']
            ]),
            UI.note('Toujours suspecter une dyschromatopsie <b>acquise</b> devant un déficit <b>unilatéral, asymétrique, d’apparition récente</b> ou associé à une baisse d’acuité.', 'warn')
          ]),
          UI.card('Les tests', UI.table(['Test', 'Ce qu’il fait', 'Indication'], [
            ['Ishihara (38 planches)', 'Dépistage rouge-vert', 'Dépistage rapide, médecine du travail'],
            ['Farnsworth D15 / D15 désaturé', 'Classement de 15 teintes', 'Dépiste les formes moyennes à sévères, donne l’axe'],
            ['Farnsworth-Munsell 100 Hue', '85 pastilles en 4 séries', 'Quantification fine, suivi des formes acquises'],
            ['Anomaloscope de Nagel', 'Égalisation de Rayleigh', 'Diagnostic de certitude et classification'],
            ['Lanthony (planches et tritan album)', 'Adapté à l’enfant', 'Pédiatrie']
          ]))
        ]);
      }

      var tabsNode = UI.tabs([
        { id: 'plates', label: '🔵 Planches' },
        { id: 'd15', label: '🎨 Classement D15' },
        { id: 'theory', label: '📖 Théorie' }
      ], function (id) {
        if (id === 'plates') return tabPlates();
        if (id === 'd15') return tabD15();
        return tabTheory();
      });

      return UI.page({
        crumb: 'Simulateurs',
        title: 'Vision des couleurs',
        subtitle: 'Planches pseudo-isochromatiques générées à la volée, test de classement type D15 avec tracé du diagramme, ' +
                  'et la théorie des dyschromatopsies congénitales et acquises.'
      }, [tabsNode]);
    }
  };
})();
