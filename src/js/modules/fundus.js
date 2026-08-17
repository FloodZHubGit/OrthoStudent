/* ============================================================
   Fond d'œil — ophtalmoscope virtuel
   Rétines générées procéduralement en SVG, 12 tableaux.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  var W = 1200, H = 1000;
  var DISC = { x: 760, y: 480, r: 78 };     // œil droit : papille en nasal (à droite de l'image)
  var MAC = { x: 470, y: 505 };

  var PATHO = {
    normal: { name: 'Fond d’œil normal', cd: 0.3, txt: 'Papille de coloration normale, contours nets, excavation physiologique ≤ 0,3. Rapport artère/veine 2/3. Macula avec reflet fovéolaire net. Rétine périphérique appliquée.' },
    glaucome: { name: 'Glaucome — excavation modérée', cd: 0.65, txt: 'Excavation papillaire agrandie (C/D 0,6–0,7), amincissement du bord neuro-rétinien, respect relatif de la règle ISNT. À confronter à la PIO et au champ visuel.' },
    glaucome_avance: { name: 'Glaucome avancé', cd: 0.9, txt: 'Excavation quasi totale (C/D 0,9), encoche du bord inférieur, vaisseaux en « baïonnette », atrophie péripapillaire. Déficit périmétrique majeur attendu.' },
    drusen: { name: 'DMLA atrophique (drusen)', cd: 0.3, txt: 'Drusen séreux confluents du pôle postérieur, remaniements de l’épithélium pigmentaire. Évolution lente vers l’atrophie géographique.' },
    dmla: { name: 'DMLA exsudative', cd: 0.3, txt: 'Soulèvement maculaire avec hémorragie sous-rétinienne et exsudats : néovascularisation choroïdienne. Urgence thérapeutique (anti-VEGF).' },
    diabetique: { name: 'Rétinopathie diabétique non proliférante', cd: 0.3, txt: 'Microanévrismes, hémorragies punctiformes, exsudats secs en couronne, quelques nodules cotonneux. Surveiller l’œdème maculaire.' },
    diabetique_prolif: { name: 'Rétinopathie diabétique proliférante', cd: 0.3, txt: 'Néovaisseaux prépapillaires et prérétiniens, hémorragies étendues. Risque d’hémorragie du vitré et de décollement tractionnel : photocoagulation panrétinienne.' },
    ovcr: { name: 'Occlusion de la veine centrale', cd: 0.3, txt: 'Hémorragies en flammèches dans les 4 quadrants, veines dilatées et tortueuses, nodules cotonneux, œdème papillaire. Baisse d’acuité brutale unilatérale.' },
    oacr: { name: 'Occlusion de l’artère centrale', cd: 0.3, txt: 'Rétine blanche œdémateuse contrastant avec une macula « rouge cerise », artères filiformes. Cécité monoculaire brutale et indolore : urgence absolue.' },
    oedeme: { name: 'Œdème papillaire', cd: 0.1, txt: 'Papille surélevée à contours flous, hyperhémiée, veines dilatées, hémorragies péripapillaires. Bilatéral : évoquer une hypertension intracrânienne.' },
    atrophie: { name: 'Atrophie optique', cd: 0.4, txt: 'Papille pâle, blanc-crayeux, contours nets, raréfaction des capillaires papillaires. Séquelle d’une neuropathie optique.' },
    decollement: { name: 'Décollement de rétine', cd: 0.3, txt: 'Rétine soulevée, grisâtre, mobile, avec plis. Rechercher la déchirure. Urgence chirurgicale, surtout si la macula est encore appliquée.' },
    hta: { name: 'Rétinopathie hypertensive', cd: 0.3, txt: 'Rétrécissement artériolaire diffus, signe du croisement (Salus-Gunn), hémorragies en flammèches, exsudats, étoile maculaire.' }
  };

  function rng(seed) {
    var x = seed || 1;
    return function () { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; };
  }

  function buildFundus(key, seed, redFree) {
    var p = PATHO[key] || PATHO.normal;
    var rand = rng(seed);
    var g = s('g');

    var bg = redFree ? '#0e2a14' : '#b0431f';
    var bg2 = redFree ? '#04140a' : '#6d1f0d';

    g.appendChild(s('rect', { x: 0, y: 0, width: W, height: H, fill: bg }));
    g.appendChild(s('ellipse', { cx: 600, cy: 500, rx: 640, ry: 560, fill: bg2, opacity: 0.55 }));
    // texture choroïdienne
    for (var t = 0; t < 90; t++) {
      g.appendChild(s('ellipse', {
        cx: rand() * W, cy: rand() * H, rx: 40 + rand() * 120, ry: 22 + rand() * 60,
        fill: redFree ? '#123a1c' : '#c25a2c', opacity: 0.10 + rand() * 0.10
      }));
    }

    /* --- vaisseaux --- */
    var vesselGroup = s('g');
    function vessel(x1, y1, cx, cy, x2, y2, w, vein, depth) {
      var col = redFree ? (vein ? '#0b1f10' : '#123a20') : (vein ? '#7d1b12' : '#c23a24');
      vesselGroup.appendChild(s('path', {
        d: 'M ' + x1 + ' ' + y1 + ' Q ' + cx + ' ' + cy + ' ' + x2 + ' ' + y2,
        fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', opacity: 0.95
      }));
      if (depth > 0) {
        for (var b = 0; b < 2; b++) {
          var tt = 0.35 + rand() * 0.45;
          var bx = (1 - tt) * (1 - tt) * x1 + 2 * (1 - tt) * tt * cx + tt * tt * x2;
          var by = (1 - tt) * (1 - tt) * y1 + 2 * (1 - tt) * tt * cy + tt * tt * y2;
          var ex = bx + (rand() - 0.5) * 320, ey = by + (rand() - 0.5) * 300;
          vessel(bx, by, (bx + ex) / 2 + (rand() - 0.5) * 90, (by + ey) / 2 + (rand() - 0.5) * 90, ex, ey, Math.max(1.4, w * 0.55), vein, depth - 1);
        }
      }
    }
    var arcades = [
      [DISC.x - 34, DISC.y - 26, 560, 90, 40, 150],     // temporale supérieure
      [DISC.x - 34, DISC.y + 26, 560, 910, 40, 850],    // temporale inférieure
      [DISC.x + 44, DISC.y - 34, 980, 120, 1170, 210],  // nasale supérieure
      [DISC.x + 44, DISC.y + 34, 980, 880, 1170, 790],  // nasale inférieure
      [DISC.x - 10, DISC.y - 62, 700, 40, 940, 30],
      [DISC.x - 10, DISC.y + 62, 700, 960, 940, 970]
    ];
    arcades.forEach(function (a, i) {
      vessel(a[0], a[1], a[2], a[3], a[4], a[5], i > 3 ? 7 : 11, true, 3);
      vessel(a[0], a[1], a[2] + 40, a[3] + (i % 2 ? 55 : -55), a[4], a[5] + (i % 2 ? 80 : -80), i > 3 ? 4 : 7, false, 3);
    });
    // capillaires péri-maculaires
    for (var cm = 0; cm < 10; cm++) {
      var ca = (cm / 10) * Math.PI * 2;
      vessel(MAC.x + Math.cos(ca) * 230, MAC.y + Math.sin(ca) * 200,
             MAC.x + Math.cos(ca) * 190, MAC.y + Math.sin(ca) * 170,
             MAC.x + Math.cos(ca) * 165, MAC.y + Math.sin(ca) * 145, 2, cm % 2 === 0, 0);
    }
    if (key === 'oacr') vesselGroup.setAttribute('opacity', '0.45');
    g.appendChild(vesselGroup);

    /* --- pathologies de fond --- */
    if (key === 'oacr') {
      g.appendChild(s('ellipse', { cx: 560, cy: 500, rx: 430, ry: 350, fill: '#f0ece0', opacity: 0.78 }));
      g.appendChild(s('circle', { cx: MAC.x, cy: MAC.y, r: 42, fill: '#c2202a' }));
    }
    if (key === 'decollement') {
      g.appendChild(s('path', { d: 'M 0 0 L 520 0 Q 420 320 250 520 Q 120 700 0 760 Z', fill: '#9fb4bd', opacity: 0.72 }));
      for (var f = 0; f < 6; f++) {
        g.appendChild(s('path', {
          d: 'M ' + (40 + f * 70) + ' 0 Q ' + (180 + f * 60) + ' 300 ' + (60 + f * 60) + ' 700',
          fill: 'none', stroke: '#7f97a2', 'stroke-width': 8, opacity: 0.5
        }));
      }
      g.appendChild(s('path', { d: 'M 300 60 L 380 40 L 420 110 Z', fill: '#8c1f14', stroke: '#f0c9b8', 'stroke-width': 3 }));
    }

    /* --- macula --- */
    if (key !== 'oacr') {
      var mdefs = s('defs');
      var mg = s('radialGradient', { id: 'mac-' + seed, cx: '50%', cy: '50%', r: '50%' });
      mg.appendChild(s('stop', { offset: '0%', 'stop-color': redFree ? '#000804' : '#3a0e05', 'stop-opacity': '0.9' }));
      mg.appendChild(s('stop', { offset: '45%', 'stop-color': redFree ? '#01130a' : '#5c1a09', 'stop-opacity': '0.6' }));
      mg.appendChild(s('stop', { offset: '100%', 'stop-color': redFree ? '#01130a' : '#6d200c', 'stop-opacity': '0' }));
      mdefs.appendChild(mg);
      g.appendChild(mdefs);
      g.appendChild(s('ellipse', { cx: MAC.x, cy: MAC.y, rx: 185, ry: 158, fill: 'url(#mac-' + seed + ')' }));
      g.appendChild(s('circle', { cx: MAC.x - 6, cy: MAC.y - 6, r: 8, fill: '#ffe3c0', opacity: 0.8 }));
      g.appendChild(s('circle', { cx: MAC.x - 6, cy: MAC.y - 6, r: 16, fill: '#ffe3c0', opacity: 0.16 }));
    }

    if (key === 'drusen' || key === 'dmla') {
      for (var d = 0; d < 60; d++) {
        var a = rand() * Math.PI * 2, rr = rand() * 190;
        g.appendChild(s('circle', {
          cx: MAC.x + Math.cos(a) * rr, cy: MAC.y + Math.sin(a) * rr * 0.85,
          r: 5 + rand() * 12, fill: '#f2dd9a', opacity: 0.55 + rand() * 0.3
        }));
      }
    }
    if (key === 'dmla') {
      g.appendChild(s('ellipse', { cx: MAC.x + 12, cy: MAC.y + 8, rx: 130, ry: 105, fill: '#8a8f6d', opacity: 0.55 }));
      g.appendChild(s('path', { d: 'M ' + (MAC.x - 90) + ' ' + (MAC.y + 40) + ' q 90 -80 180 -10 q -40 90 -180 10 Z', fill: '#5e0f0c', opacity: 0.85 }));
      for (var x2 = 0; x2 < 18; x2++) {
        g.appendChild(s('circle', { cx: MAC.x + (rand() - 0.5) * 260, cy: MAC.y + (rand() - 0.5) * 220, r: 6 + rand() * 9, fill: '#ffe9a8', opacity: 0.8 }));
      }
    }
    if (key === 'diabetique' || key === 'diabetique_prolif') {
      for (var i2 = 0; i2 < 70; i2++) {
        var px = 120 + rand() * 900, py = 120 + rand() * 760;
        g.appendChild(s('circle', { cx: px, cy: py, r: 4 + rand() * 5, fill: '#8c1410', opacity: 0.9 }));
      }
      for (var j = 0; j < 28; j++) {
        g.appendChild(s('circle', { cx: MAC.x + (rand() - 0.5) * 420, cy: MAC.y + (rand() - 0.5) * 360, r: 6 + rand() * 12, fill: '#f3dc8c', opacity: 0.9 }));
      }
      for (var c2 = 0; c2 < 6; c2++) {
        g.appendChild(s('ellipse', { cx: 200 + rand() * 800, cy: 150 + rand() * 700, rx: 26 + rand() * 20, ry: 18 + rand() * 12, fill: '#f4f6ee', opacity: 0.75 }));
      }
      if (key === 'diabetique_prolif') {
        for (var n = 0; n < 5; n++) {
          var nx = DISC.x + (rand() - 0.5) * 420, ny = DISC.y + (rand() - 0.5) * 420;
          for (var k = 0; k < 10; k++) {
            g.appendChild(s('path', {
              d: 'M ' + nx + ' ' + ny + ' q ' + (rand() - 0.5) * 70 + ' ' + (rand() - 0.5) * 70 + ' ' + (rand() - 0.5) * 110 + ' ' + (rand() - 0.5) * 110,
              fill: 'none', stroke: '#d9401f', 'stroke-width': 2.4, opacity: 0.9
            }));
          }
        }
        g.appendChild(s('ellipse', { cx: 300, cy: 780, rx: 190, ry: 90, fill: '#4a0a06', opacity: 0.85 }));
      }
    }
    if (key === 'ovcr' || key === 'hta') {
      var count = key === 'ovcr' ? 46 : 16;
      for (var h = 0; h < count; h++) {
        var hx = 90 + rand() * 1000, hy = 90 + rand() * 800;
        var ang = rand() * 180;
        g.appendChild(s('ellipse', {
          cx: hx, cy: hy, rx: 34 + rand() * 44, ry: 7 + rand() * 7,
          fill: '#6d0f0b', opacity: 0.9, transform: 'rotate(' + ang + ' ' + hx + ' ' + hy + ')'
        }));
      }
      if (key === 'ovcr') {
        vesselGroup.setAttribute('stroke-width', '3');
        for (var v2 = 0; v2 < 5; v2++) {
          g.appendChild(s('ellipse', { cx: 200 + rand() * 800, cy: 150 + rand() * 700, rx: 30, ry: 20, fill: '#f4f6ee', opacity: 0.7 }));
        }
      }
      if (key === 'hta') {
        for (var st2 = 0; st2 < 14; st2++) {
          var aa = (st2 / 14) * Math.PI * 2;
          g.appendChild(s('ellipse', {
            cx: MAC.x + Math.cos(aa) * 70, cy: MAC.y + Math.sin(aa) * 60,
            rx: 34, ry: 6, fill: '#f3dc8c', opacity: 0.9,
            transform: 'rotate(' + (aa * 180 / Math.PI) + ' ' + (MAC.x + Math.cos(aa) * 70) + ' ' + (MAC.y + Math.sin(aa) * 60) + ')'
          }));
        }
      }
    }

    /* --- papille --- */
    var discFill = key === 'atrophie' ? '#f2f4ee' : key === 'oedeme' ? '#f0b58a' : '#f0c88c';
    var discEdge = key === 'oedeme' ? 'none' : '#c98b4b';
    g.appendChild(s('circle', { cx: DISC.x, cy: DISC.y, r: DISC.r + (key === 'oedeme' ? 16 : 0), fill: discFill, opacity: key === 'oedeme' ? 0.85 : 1 }));
    if (key === 'oedeme') {
      g.appendChild(s('circle', { cx: DISC.x, cy: DISC.y, r: DISC.r + 30, fill: '#f0b58a', opacity: 0.35 }));
      for (var ph = 0; ph < 8; ph++) {
        var pa = rand() * Math.PI * 2;
        g.appendChild(s('ellipse', {
          cx: DISC.x + Math.cos(pa) * 105, cy: DISC.y + Math.sin(pa) * 105, rx: 30, ry: 7, fill: '#6d0f0b', opacity: 0.9,
          transform: 'rotate(' + (pa * 180 / Math.PI) + ' ' + (DISC.x + Math.cos(pa) * 105) + ' ' + (DISC.y + Math.sin(pa) * 105) + ')'
        }));
      }
    } else {
      g.appendChild(s('circle', { cx: DISC.x, cy: DISC.y, r: DISC.r, fill: 'none', stroke: discEdge, 'stroke-width': 3 }));
    }
    // excavation
    var cd = p.cd;
    if (cd > 0.15) {
      g.appendChild(s('ellipse', {
        cx: DISC.x + (key === 'glaucome_avance' ? 4 : 0), cy: DISC.y + (key.indexOf('glaucome') === 0 ? 8 : 0),
        rx: DISC.r * cd, ry: DISC.r * cd * (key.indexOf('glaucome') === 0 ? 1.05 : 0.9),
        fill: '#fdfaf2', opacity: 0.92
      }));
    }
    if (key === 'glaucome_avance') {
      g.appendChild(s('path', { d: 'M ' + (DISC.x - 20) + ' ' + (DISC.y + 60) + ' q 24 22 52 -4 l -8 24 q -30 18 -52 -6 Z', fill: '#fdfaf2' }));
      g.appendChild(s('ellipse', { cx: DISC.x + 96, cy: DISC.y, rx: 46, ry: 84, fill: '#e8c9a2', opacity: 0.55 }));
    }

    // émergence des vaisseaux centraux : un tronc central qui se divise
    // en branches supérieure et inférieure rejoignant les arcades
    if (key !== 'atrophie') {
      var ox = DISC.x + (key.indexOf('glaucome') === 0 ? 16 : 4);   // vaisseaux repoussés en nasal si excavation
      var yTop = DISC.y - 34, yBot = DISC.y + 34;
      // tronc central vertical, puis division supérieure et inférieure
      g.appendChild(s('path', {
        d: 'M ' + ox + ' ' + yTop + ' L ' + ox + ' ' + yBot,
        fill: 'none', stroke: '#82231a', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.9
      }));
      [[yTop, -1], [yBot, 1]].forEach(function (p) {
        var y = p[0], dir = p[1];
        // branche temporale (vers la macula)
        g.appendChild(s('path', {
          d: 'M ' + ox + ' ' + y + ' C ' + (ox - 22) + ' ' + (y + dir * 8) + ' ' + (DISC.x - 24) + ' ' + (y + dir * 4) +
             ' ' + (DISC.x - 34) + ' ' + (DISC.y + dir * 26),
          fill: 'none', stroke: '#82231a', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.9
        }));
        // branche nasale
        g.appendChild(s('path', {
          d: 'M ' + ox + ' ' + y + ' C ' + (ox + 18) + ' ' + (y + dir * 6) + ' ' + (DISC.x + 32) + ' ' + (DISC.y + dir * 22) +
             ' ' + (DISC.x + 44) + ' ' + (DISC.y + dir * 34),
          fill: 'none', stroke: '#b8351f', 'stroke-width': 4.5, 'stroke-linecap': 'round', opacity: 0.9
        }));
      });
    }

    // vignettage de l'oculaire
    var defs = s('defs');
    var vg = s('radialGradient', { id: 'vig-' + seed, cx: '50%', cy: '50%', r: '62%' });
    vg.appendChild(s('stop', { offset: '52%', 'stop-color': '#000', 'stop-opacity': '0' }));
    vg.appendChild(s('stop', { offset: '100%', 'stop-color': '#000', 'stop-opacity': '0.55' }));
    defs.appendChild(vg);
    g.appendChild(defs);
    g.appendChild(s('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#vig-' + seed + ')' }));

    return g;
  }

  M.fundus = {
    id: 'fundus', title: 'Fond d’œil', icon: '🔴', group: 'Simulateurs',
    desc: 'Ophtalmoscope virtuel, 13 tableaux pathologiques, mesure du C/D',
    keywords: 'fond oeil retine papille macula glaucome dmla diabete ovcr oacr excavation ophtalmoscope',
    render: function (ctx) {
      var pp = (ctx && ctx.params) || {};
      var byEye = (pp.sim && pp.sim.fundus) || null;   // { od: 'clé', os: 'clé' }
      var st = {
        key: 'normal', seed: 12345, zoom: 1, tx: 0, ty: 0,
        redFree: false, eye: 'od', quiz: null, cdGuess: 0.3
      };

      function hash(str) {
        var h = 2166136261;
        for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 16777619) >>> 0; }
        return h % 99991;
      }

      function setEye(e) {
        st.eye = e;
        // en mode dossier, l'image d'un œil donné est toujours la même
        if (byEye && PATHO[byEye[e]]) { setKey(byEye[e], false, hash((pp.fromCase || 'x') + e + byEye[e])); return; }
        draw();
      }

      var holder = el('div');
      var caption = el('div');

      function draw() {
        UI.clear(holder);
        var box = s('svg', { viewBox: '0 0 700 560', style: 'width:100%;height:auto;background:#05080b;border-radius:12px' });
        var defs = s('defs');
        var cp = s('clipPath', { id: 'fundus-view' });
        cp.appendChild(s('circle', { cx: 350, cy: 275, r: 250 }));
        defs.appendChild(cp);
        box.appendChild(defs);

        var inner = s('g', { 'clip-path': 'url(#fundus-view)' });
        var scale = 0.55 * st.zoom;
        var g = buildFundus(st.key, st.seed, st.redFree);
        g.setAttribute('transform',
          'translate(' + (350 + st.tx) + ',' + (275 + st.ty) + ') scale(' + scale * (st.eye === 'os' ? -1 : 1) + ',' + scale + ') translate(' + (-W / 2) + ',' + (-H / 2) + ')');
        inner.appendChild(g);
        box.appendChild(inner);

        box.appendChild(s('circle', { cx: 350, cy: 275, r: 250, fill: 'none', stroke: '#22303d', 'stroke-width': 14 }));
        box.appendChild(s('circle', { cx: 350, cy: 275, r: 258, fill: 'none', stroke: '#0d1218', 'stroke-width': 10 }));
        box.appendChild(s('text', { x: 24, y: 534, fill: '#5f7688', 'font-size': '12' },
          'Œil ' + (st.eye === 'od' ? 'DROIT' : 'GAUCHE') + ' · ×' + st.zoom.toFixed(1) + (st.redFree ? ' · filtre anérythre' : '')));
        holder.appendChild(box);

        // pan
        var dragging = false, sx = 0, sy = 0, bx = 0, by = 0;
        box.addEventListener('pointerdown', function (e) {
          dragging = true; sx = e.clientX; sy = e.clientY; bx = st.tx; by = st.ty;
          box.setPointerCapture(e.pointerId);
        });
        box.addEventListener('pointermove', function (e) {
          if (!dragging) return;
          st.tx = bx + (e.clientX - sx); st.ty = by + (e.clientY - sy);
          var gg = inner.firstChild;
          gg.setAttribute('transform',
            'translate(' + (350 + st.tx) + ',' + (275 + st.ty) + ') scale(' + scale * (st.eye === 'os' ? -1 : 1) + ',' + scale + ') translate(' + (-W / 2) + ',' + (-H / 2) + ')');
        });
        box.addEventListener('pointerup', function () { dragging = false; });
        box.addEventListener('wheel', function (e) {
          e.preventDefault();
          st.zoom = Math.max(0.7, Math.min(3.2, st.zoom + (e.deltaY < 0 ? 0.15 : -0.15)));
          draw();
        }, { passive: false });
      }

      function setKey(k, silent, seed) {
        st.key = k;
        st.seed = seed !== undefined ? seed : Math.floor(Math.random() * 99999);
        st.tx = 0; st.ty = 0;
        draw();
        UI.clear(caption);
        if (!silent) {
          var p = PATHO[k];
          caption.appendChild(el('h3', { text: p.name }));
          caption.appendChild(el('p', { class: 'selectable', text: p.txt }));
          caption.appendChild(UI.kv('Rapport C/D', p.cd.toFixed(2)));
        }
      }

      /* --- quiz --- */
      var quizBox = el('div');
      function newQuiz() {
        var keys = Object.keys(PATHO);
        st.quiz = keys[Math.floor(Math.random() * keys.length)];
        setKey(st.quiz, true);
        UI.clear(quizBox);
        var sel = UI.select(keys.map(function (k) { return { value: k, label: PATHO[k].name }; }), 'normal', function () {});
        var cd = UI.range(0.1, 0.95, 0.05, 0.3, function (v) { st.cdGuess = v; }, function (v) { return v.toFixed(2); });
        quizBox.appendChild(UI.field('Votre diagnostic', sel));
        quizBox.appendChild(UI.field('Rapport C/D estimé', cd));
        quizBox.appendChild(el('div', { class: 'btn-row' }, [
          UI.btn('Valider', function () {
            var p = PATHO[st.quiz];
            var ok = sel.value === st.quiz;
            var cdErr = Math.abs(st.cdGuess - p.cd);
            var score = Math.round((ok ? 70 : 0) + Math.max(0, 30 - cdErr * 150));
            Store.recordScore('fundus', score);
            quizBox.appendChild(UI.note((ok ? '✔ ' : '✘ ') + '<b>' + p.name + '</b> — ' + p.txt +
              '<br>C/D réel : <b>' + p.cd.toFixed(2) + '</b> (votre estimation : ' + st.cdGuess.toFixed(2) + '). Score <b>' + score + ' %</b>.',
              ok ? '' : 'warn'));
          }, 'primary'),
          UI.btn('Autre fond d’œil', newQuiz)
        ]));
      }

      // en mode dossier, la liste des tableaux donnerait la réponse et
      // remplacerait le fond d'œil du patient : on ne la propose pas
      var picker = byEye
        ? UI.note('📁 Vous examinez le fond d’œil de ce patient. La bibliothèque des tableaux reste disponible ' +
            'hors dossier, dans le module « Fond d’œil » ouvert depuis le menu.')
        : el('div', { class: 'flex wrap' }, Object.keys(PATHO).map(function (k) {
            return el('span', { class: 'chip', text: PATHO[k].name, onClick: function () { setKey(k); } });
          }));

      var tools = el('div', { class: 'card' }, [
        el('div', { class: 'btn-row' }, [
          UI.btn('Œil droit', function () { setEye('od'); }),
          UI.btn('Œil gauche', function () { setEye('os'); }),
          UI.btn('Filtre anérythre (vert)', function () { st.redFree = !st.redFree; draw(); }),
          UI.btn('Zoom +', function () { st.zoom = Math.min(3.2, st.zoom + 0.3); draw(); }),
          UI.btn('Zoom −', function () { st.zoom = Math.max(0.7, st.zoom - 0.3); draw(); }),
          UI.btn('Recentrer', function () { st.tx = 0; st.ty = 0; st.zoom = 1; draw(); }),
          el('span', { class: 'spacer' }),
          byEye
            ? UI.btn('🎯 Entraînement libre (hors dossier)', newQuiz)
            : UI.btn('🎯 Mode diagnostic', newQuiz, 'primary')
        ]),
        byEye ? UI.note('📁 <b>Dossier patient</b> — comparez les <b>deux yeux</b> avec les boutons OD / OG : ' +
          'chez ce patient les deux fonds d’œil ne sont pas identiques.') : null
      ].filter(Boolean));

      var preset = pp.fundus;
      if (byEye) setEye('od');
      else setKey(preset && PATHO[preset] ? preset : 'normal');

      return UI.page({
        crumb: 'Simulateurs',
        title: 'Fond d’œil',
        subtitle: 'Faites glisser dans l’oculaire pour explorer la périphérie, molette pour zoomer. Le filtre anérythre fait ressortir ' +
                  'les vaisseaux et la couche des fibres nerveuses.'
      }, [
        tools,
        el('div', { class: 'split' }, [
          el('div', {}, [
            UI.card('Ophtalmoscope', holder),
            UI.card('Mode diagnostic', quizBox)
          ]),
          el('div', {}, [
            UI.card('Tableaux disponibles', picker),
            UI.card('Description', caption),
            UI.card('Lecture méthodique d’un fond d’œil', UI.accordion([
              { title: '1 · La papille', open: true, body: '<ul><li>Couleur (rosée / pâle / hyperhémiée)</li><li>Contours (nets / flous)</li><li>Excavation : rapport C/D, règle <b>ISNT</b> (le bord neuro-rétinien est le plus épais en Inférieur, puis Supérieur, Nasal, Temporal)</li><li>Atrophie péripapillaire, hémorragies en flammèches du bord</li></ul>' },
              { title: '2 · Les vaisseaux', body: '<ul><li>Rapport artère/veine (normal 2/3)</li><li>Croisements artério-veineux (signe de Salus-Gunn)</li><li>Tortuosité, dilatation, engainement</li><li>Néovaisseaux prépapillaires ou prérétiniens</li></ul>' },
              { title: '3 · La macula', body: '<ul><li>Reflet fovéolaire présent ?</li><li>Drusen, remaniements pigmentaires, hémorragie, exsudats</li><li>Étoile maculaire (HTA), aspect « rouge cerise » (OACR)</li></ul>' },
              { title: '4 · La périphérie', body: '<ul><li>Quadrant par quadrant</li><li>Déchirures, palissades, dégénérescences (à rechercher chez le myope fort)</li><li>Décollement, hémorragies, plages de photocoagulation</li></ul>' }
            ])),
            UI.card('Repères métriques', UI.table(['Repère', 'Valeur'], [
              ['Diamètre papillaire', '≈ 1,5 mm — sert d’unité de mesure des lésions'],
              ['Distance papille-macula', '≈ 2 diamètres papillaires en temporal'],
              ['C/D normal', '≤ 0,3–0,4 · asymétrie > 0,2 suspecte'],
              ['Rapport A/V', '2/3'],
              ['Champ d’un ophtalmoscope direct', '≈ 5° (×15) — le trépied indirect voit beaucoup plus large']
            ]))
          ])
        ])
      ]);
    }
  };
})();
