/* ============================================================
   Constellation du vocabulaire
   ------------------------------------------------------------
   Le glossaire vu comme un ciel : chaque terme est une étoile,
   chaque renvoi « voir aussi » un trait de lumière, et la couleur
   dit la catégorie.

   Placement par simulation de forces (Fruchterman-Reingold),
   rendu sur canvas — à 237 nœuds et ~450 arêtes, le SVG ne
   tiendrait pas les 60 images par seconde.

   Sert à réviser par association : ce qui gravite autour d'un
   terme, et le chemin le plus court entre deux notions.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  /* générateur déterministe : le ciel doit être le même à chaque ouverture */
  function rng(seed) {
    return function () {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  }

  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }

  /* ------------------------------------------------------------
     Teintes par catégorie
     ------------------------------------------------------------
     Répartir les teintes avec un pas fixe ne marche que si ce pas
     est premier avec le nombre de catégories : avec 21 catégories,
     un pas de 7 ne donne que 3 teintes (7 divise 21). On cherche
     donc le premier pas premier avec n autour de 0,38 × n, ce qui
     éloigne au maximum deux catégories voisines dans la liste.
     ------------------------------------------------------------ */
  function hues(cats) {
    var n = cats.length, h = {};
    var step = Math.max(1, Math.round(n * 0.38));
    while (step < n && gcd(step, n) !== 1) step++;
    if (gcd(step, n) !== 1) step = 1;
    cats.forEach(function (c, i) {
      h[c] = { h: ((i * step) % n) * (360 / n), alt: i % 2 };
    });
    return h;
  }

  function buildGraph() {
    var nodes = [], index = {}, edges = [], seen = {};

    GLOSSARY.forEach(function (g, i) {
      index[g.t] = i;
      nodes.push({
        i: i, g: g, t: g.t, c: g.c,
        s: norm(g.t + ' ' + (g.a || '') + ' ' + g.d + ' ' + g.c),
        x: 0, y: 0, vx: 0, vy: 0, deg: 0, adj: [], pinned: false,
        ph: 0        // phase de scintillement
      });
    });

    GLOSSARY.forEach(function (g) {
      var a = index[g.t];
      (g.v || []).forEach(function (ref) {
        var b = index[ref];
        if (b === undefined || b === a) return;
        var key = Math.min(a, b) + ':' + Math.max(a, b);
        if (seen[key]) return;
        seen[key] = true;
        edges.push({ a: a, b: b });
        nodes[a].adj.push(b); nodes[b].adj.push(a);
        nodes[a].deg++; nodes[b].deg++;
      });
    });

    return { nodes: nodes, edges: edges, index: index };
  }

  M.constellation = {
    id: 'constellation', title: 'Constellation', icon: '🌌', group: 'Savoir',
    desc: 'Le glossaire en ciel étoilé : ce qui gravite autour d’un terme, et le chemin entre deux notions',
    keywords: 'constellation graphe reseau carte mentale liens renvois association vocabulaire glossaire chemin etoile',
    render: function (ctx) {
      var G = buildGraph();
      var nodes = G.nodes, edges = G.edges;

      var cats = [];
      nodes.forEach(function (n) { if (cats.indexOf(n.c) < 0) cats.push(n.c); });
      cats.sort(function (a, b) { return a.localeCompare(b, 'fr'); });
      var HUE = hues(cats);

      var rand = rng(20260818);
      nodes.forEach(function (n) { n.ph = rand() * Math.PI * 2; });

      var st = {
        sel: null, hover: null,
        from: null, to: null, path: null,
        q: '', hits: null,
        hidden: {},
        labels: 'smart',
        ambient: true
      };

      /* ---------- couleurs ---------- */
      var COL = {}, dark = true;
      function readColors() {
        var cs = getComputedStyle(document.documentElement);
        function v(k) { return cs.getPropertyValue(k).trim(); }
        dark = document.documentElement.getAttribute('data-theme') !== 'light';
        COL.bg = dark ? '#0c1219' : '#f4f7fb';
        COL.halo = dark ? '#0c1219' : '#ffffff';
        COL.txt = v('--txt');
        COL.txt2 = v('--txt-2');
        COL.txt3 = v('--txt-3');
        COL.accent = v('--accent');
        sprites = {};              // les sprites dépendent du thème
        sky = null;
        vignette = null;
      }

      /* saturations volontairement modérées : à 21 teintes, du fluo donne
         un sapin de Noël où plus rien ne se distingue */
      function catColor(c, a) {
        var d = HUE[c] || { h: 0, alt: 0 };
        var sat = dark ? (d.alt ? 45 : 58) : (d.alt ? 48 : 60);
        var lig = dark ? (d.alt ? 74 : 66) : (d.alt ? 44 : 38);
        return 'hsla(' + d.h.toFixed(0) + ',' + sat + '%,' + lig + '%,' + (a === undefined ? 1 : a) + ')';
      }
      function catHue(c) { return (HUE[c] || { h: 0 }).h; }

      readColors();

      /* teinte moyenne d'une arête : le trait passe d'une couleur à l'autre */
      function midHue(h1, h2) {
        var d = ((h2 - h1 + 540) % 360) - 180;
        return (h1 + d / 2 + 360) % 360;
      }
      edges.forEach(function (e) {
        e.h = midHue(catHue(nodes[e.a].c), catHue(nodes[e.b].c));
      });

      /* ------------------------------------------------------------
         Placement initial : une couronne par catégorie
         ------------------------------------------------------------ */
      (function seed() {
        var byCat = {};
        nodes.forEach(function (n) { (byCat[n.c] = byCat[n.c] || []).push(n); });
        cats.forEach(function (c, ci) {
          var ring = 300 + (ci % 3) * 130;
          var base = (ci / cats.length) * Math.PI * 2;
          byCat[c].forEach(function (n, j) {
            var a = base + (j / Math.max(1, byCat[c].length)) * 0.9 - 0.45;
            n.x = Math.cos(a) * ring * 1.7 + (rand() - 0.5) * 50;
            n.y = Math.sin(a) * ring * 0.8 + (rand() - 0.5) * 50;
          });
        });
      })();

      /* ------------------------------------------------------------
         Simulation
         ------------------------------------------------------------
         La gravité est elliptique : plus faible horizontalement que
         verticalement, dans le rapport du cadre. Sans cela le nuage
         s'équilibre en disque et laisse deux tiers du cadre vides.
         ------------------------------------------------------------ */
      var K = Math.sqrt((1500 * 800) / nodes.length);
      var temp = 80, TEMP_MIN = 0.4, COOL = 0.987;
      var GX = 0.030, GY = 0.085;

      /* Gravité elliptique. À l'équilibre, l'étendue varie comme
         gravité^(-1/3) : pour étaler le nuage dans le rapport a du cadre,
         il faut donc un rapport de gravités de a³, pas de a. */
      function setGravity() {
        var a = Math.max(0.7, Math.min(3.2, W / H));
        var p = Math.pow(a, 1.5);
        GX = 0.052 / p;
        GY = 0.052 * p;
      }

      function tick() {
        var i, j, a, b, dx, dy, d2, d, f;
        for (i = 0; i < nodes.length; i++) { nodes[i].vx = 0; nodes[i].vy = 0; }

        for (i = 0; i < nodes.length; i++) {
          a = nodes[i];
          for (j = i + 1; j < nodes.length; j++) {
            b = nodes[j];
            dx = a.x - b.x; dy = a.y - b.y;
            d2 = dx * dx + dy * dy;
            if (d2 < 0.01) { dx = rand() - 0.5; dy = rand() - 0.5; d2 = 0.01; }
            d = Math.sqrt(d2);
            f = (K * K) / d2;
            dx /= d; dy /= d;
            a.vx += dx * f; a.vy += dy * f;
            b.vx -= dx * f; b.vy -= dy * f;
          }
        }

        for (i = 0; i < edges.length; i++) {
          a = nodes[edges[i].a]; b = nodes[edges[i].b];
          dx = a.x - b.x; dy = a.y - b.y;
          d = Math.sqrt(dx * dx + dy * dy) || 0.01;
          f = (d * d) / K;
          dx /= d; dy /= d;
          a.vx -= dx * f; a.vy -= dy * f;
          b.vx += dx * f; b.vy += dy * f;
        }

        for (i = 0; i < nodes.length; i++) {
          a = nodes[i];
          a.vx -= a.x * GX;
          a.vy -= a.y * GY;
        }

        for (i = 0; i < nodes.length; i++) {
          a = nodes[i];
          if (a.pinned) continue;
          d = Math.sqrt(a.vx * a.vx + a.vy * a.vy) || 1;
          f = Math.min(d, temp) / d;
          a.x += a.vx * f; a.y += a.vy * f;
        }

        temp = Math.max(TEMP_MIN, temp * COOL);
      }

      /* ------------------------------------------------------------
         Canvas et caméra
         ------------------------------------------------------------ */
      var cv = el('canvas');
      var wrap = el('div', { class: 'cst-wrap' }, cv);
      var c2d = cv.getContext('2d');
      var W = 900, H = 460, view = { k: 1, x: 450, y: 230 };

      function toScreen(n) { return { x: n.x * view.k + view.x, y: n.y * view.k + view.y }; }
      function toGraph(px, py) { return { x: (px - view.x) / view.k, y: (py - view.y) / view.k }; }

      function resize() {
        var r = wrap.getBoundingClientRect();
        if (!r.width) return;
        var dpr = Math.min(2, window.devicePixelRatio || 1);
        W = r.width; H = r.height;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        cv.style.width = W + 'px'; cv.style.height = H + 'px';
        c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
        setGravity();
        vignette = null;
      }

      function bbox() {
        var b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity, ok: false };
        nodes.forEach(function (n) {
          if (st.hidden[n.c]) return;
          b.ok = true;
          if (n.x < b.x0) b.x0 = n.x; if (n.x > b.x1) b.x1 = n.x;
          if (n.y < b.y0) b.y0 = n.y; if (n.y > b.y1) b.y1 = n.y;
        });
        return b;
      }

      function fit(pad) {
        pad = pad === undefined ? 46 : pad;
        var b = bbox();
        if (!b.ok) return;
        var w = Math.max(1, b.x1 - b.x0), h = Math.max(1, b.y1 - b.y0);
        view.k = Math.max(0.1, Math.min(3, Math.min((W - pad * 2) / w, (H - pad * 2) / h)));
        view.x = W / 2 - ((b.x0 + b.x1) / 2) * view.k;
        view.y = H / 2 - ((b.y0 + b.y1) / 2) * view.k;
      }

      /* déplacement de caméra amorti — un saut sec fait perdre le fil */
      var glide = null;
      function glideTo(n, k) {
        glide = { x: W / 2 - n.x * (k || view.k), y: H / 2 - n.y * (k || view.k), k: k || view.k, t: 0 };
      }
      function stepGlide() {
        if (!glide) return false;
        glide.t = Math.min(1, glide.t + 0.11);
        var e = 1 - Math.pow(1 - glide.t, 3);
        view.k += (glide.k - view.k) * e * 0.5;
        view.x += (glide.x - view.x) * e * 0.5;
        view.y += (glide.y - view.y) * e * 0.5;
        if (glide.t >= 1) glide = null;
        return true;
      }

      /* ------------------------------------------------------------
         Sprites de halo : un dégradé radial par catégorie, dessiné
         une seule fois. Recréer 237 dégradés par image coûterait
         bien plus cher que 21 recopies d'image.
         ------------------------------------------------------------ */
      var sprites = {};
      var SPR = 64;
      function glowSprite(c) {
        if (sprites[c]) return sprites[c];
        var s = document.createElement('canvas');
        s.width = s.height = SPR;
        var g = s.getContext('2d');
        var grd = g.createRadialGradient(SPR / 2, SPR / 2, 0, SPR / 2, SPR / 2, SPR / 2);
        grd.addColorStop(0, catColor(c, dark ? 0.50 : 0.34));
        grd.addColorStop(0.30, catColor(c, dark ? 0.15 : 0.11));
        grd.addColorStop(1, catColor(c, 0));
        g.fillStyle = grd;
        g.fillRect(0, 0, SPR, SPR);
        sprites[c] = s;
        return s;
      }

      /* ------------------------------------------------------------
         Pas de calque de « nébuleuses » par catégorie : les catégories
         ne sont pas séparées dans l'espace, leurs 21 barycentres
         tombent presque au même point. On empilait donc 21 dégradés
         géants quasi concentriques à opacité 0,04 — aucune information,
         et un tramage que l'agrandissement changeait en pastilles.
         Le fond est maintenant un seul dégradé en coordonnées écran :
         rien à agrandir, donc rien à tramer.
         ------------------------------------------------------------ */
      var sky = null;
      function buildSky() {
        var s = document.createElement('canvas');
        s.width = Math.max(2, Math.round(W)); s.height = Math.max(2, Math.round(H));
        var g = s.getContext('2d');
        g.fillStyle = COL.bg; g.fillRect(0, 0, W, H);
        var grd = g.createRadialGradient(W * 0.42, H * 0.44, 0, W * 0.42, H * 0.44, Math.max(W, H) * 0.62);
        grd.addColorStop(0, dark ? 'rgba(48,66,96,.55)' : 'rgba(255,255,255,.9)');
        grd.addColorStop(0.55, dark ? 'rgba(24,34,52,.35)' : 'rgba(246,249,253,.6)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = grd; g.fillRect(0, 0, W, H);
        return s;
      }

      /* ------------------------------------------------------------
         Poussière d'étoiles, en coordonnées de graphe mais dessinée à
         taille constante à l'écran : pré-rendue puis agrandie, chaque
         étoile d'un pixel deviendrait un disque flou.
         ------------------------------------------------------------ */
      /* Rangées en 5 niveaux d'opacité : sans ce regroupement il faut
         composer et faire analyser 900 chaînes « rgba(…) » par image,
         ce qui coûtait à lui seul près de 10 ms. Là, cinq passes. */
      var STAR_LEVELS = 5;
      var stars = (function () {
        var r2 = rng(4242), out = [];
        for (var b = 0; b < STAR_LEVELS; b++) out.push([]);
        for (var i = 0; i < 900; i++) {
          var a = 0.10 + r2() * 0.36;
          var lvl = Math.min(STAR_LEVELS - 1, Math.floor(((a - 0.10) / 0.36) * STAR_LEVELS));
          out[lvl].push({
            x: (r2() - 0.5) * 5200,
            y: (r2() - 0.5) * 3000,
            r: 0.35 + r2() * 1.15
          });
        }
        return out;
      })();

      function starColor(lvl) {
        var a = (0.12 + (lvl / (STAR_LEVELS - 1)) * 0.32) * (dark ? 1 : 0.45);
        return dark ? 'rgba(226,238,255,' + a.toFixed(3) + ')' : 'rgba(40,60,90,' + a.toFixed(3) + ')';
      }

      function drawStars() {
        c2d.globalCompositeOperation = dark ? 'lighter' : 'source-over';
        for (var lvl = 0; lvl < STAR_LEVELS; lvl++) {
          var bucket = stars[lvl];
          c2d.fillStyle = starColor(lvl);
          c2d.beginPath();
          for (var i = 0; i < bucket.length; i++) {
            var s = bucket[i];
            var x = s.x * view.k + view.x, y = s.y * view.k + view.y;
            if (x < -2 || x > W + 2 || y < -2 || y > H + 2) continue;
            c2d.moveTo(x + s.r, y);
            c2d.arc(x, y, s.r, 0, Math.PI * 2);
          }
          c2d.fill();
        }
        c2d.globalCompositeOperation = 'source-over';
      }

      /* voile sombre sur les bords : concentre le regard au centre */
      var vignette = null;
      function buildVignette() {
        var s = document.createElement('canvas');
        s.width = Math.max(2, Math.round(W)); s.height = Math.max(2, Math.round(H));
        var g = s.getContext('2d');
        var grd = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.30, W / 2, H / 2, Math.max(W, H) * 0.72);
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(1, dark ? 'rgba(6,10,16,.45)' : 'rgba(210,222,236,.38)');
        g.fillStyle = grd; g.fillRect(0, 0, W, H);
        return s;
      }

      /* ------------------------------------------------------------
         Mise en relief
         ------------------------------------------------------------ */
      function activeSet() {
        if (st.path) { var p = {}; st.path.forEach(function (i) { p[i] = true; }); return p; }
        if (st.sel) { var s = {}; s[st.sel.i] = true; st.sel.adj.forEach(function (i) { s[i] = true; }); return s; }
        if (st.hits) return st.hits;
        return null;
      }
      function radiusOf(n) { return Math.min(16, 3.6 + Math.sqrt(n.deg) * 2.05); }

      /* ------------------------------------------------------------
         Rendu
         ------------------------------------------------------------ */
      var labelW = {}, tAmb = 0, simMoving = false;
      function labelWidth(t) {
        if (labelW[t] === undefined) labelW[t] = c2d.measureText(t).width;
        return labelW[t];
      }

      /* les étiquettes toujours visibles : les plus gros carrefours */
      var hubOrder = nodes.slice().sort(function (a, b) { return b.deg - a.deg; });
      var hubRank = {};
      hubOrder.forEach(function (n, i) { hubRank[n.i] = i; });

      function draw() {
        c2d.clearRect(0, 0, W, H);
        if (!sky) sky = buildSky();
        c2d.drawImage(sky, 0, 0, W, H);
        drawStars();

        var act = activeSet();
        var pathEdges = {};
        if (st.path) {
          for (var pi = 0; pi + 1 < st.path.length; pi++) {
            pathEdges[Math.min(st.path[pi], st.path[pi + 1]) + ':' + Math.max(st.path[pi], st.path[pi + 1])] = true;
          }
        }

        /* --- arêtes, en lumière additive : les croisements s'éclairent --- */
        c2d.globalCompositeOperation = dark ? 'lighter' : 'source-over';
        c2d.lineCap = 'round';
        edges.forEach(function (e) {
          var a = nodes[e.a], b = nodes[e.b];
          if (st.hidden[a.c] || st.hidden[b.c]) return;
          var hot = pathEdges[Math.min(e.a, e.b) + ':' + Math.max(e.a, e.b)];
          var touch = !act || (act[e.a] || act[e.b]);
          if (!touch && !hot) return;

          var A = toScreen(a), B = toScreen(b);
          var sat = dark ? 78 : 60, lig = dark ? 62 : 45;
          if (hot) {
            c2d.strokeStyle = COL.accent; c2d.lineWidth = 2.6; c2d.globalAlpha = 1;
          } else if (act) {
            c2d.strokeStyle = 'hsl(' + e.h.toFixed(0) + ',' + sat + '%,' + lig + '%)';
            c2d.lineWidth = 1.5; c2d.globalAlpha = dark ? 0.75 : 0.6;
          } else {
            c2d.strokeStyle = 'hsl(' + e.h.toFixed(0) + ',' + sat + '%,' + lig + '%)';
            c2d.lineWidth = 1.1;
            c2d.globalAlpha = dark ? 0.30 : 0.26;
          }
          /* léger arc : des cordes droites donnent une pelote, des arcs un réseau */
          var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
          var ox = -(B.y - A.y) * 0.075, oy = (B.x - A.x) * 0.075;
          c2d.beginPath();
          c2d.moveTo(A.x, A.y);
          c2d.quadraticCurveTo(mx + ox, my + oy, B.x, B.y);
          c2d.stroke();
        });
        c2d.globalAlpha = 1;

        /* --- halos --- */
        var labels = [];
        nodes.forEach(function (n) {
          if (st.hidden[n.c]) return;
          var P = toScreen(n);
          var r = radiusOf(n) * Math.min(1.7, Math.max(.7, view.k));
          var on = !act || act[n.i];
          var isSel = st.sel === n, isHover = st.hover === n, isEnd = st.from === n || st.to === n;
          var twk = st.ambient ? 0.86 + 0.14 * Math.sin(tAmb * 1.7 + n.ph) : 1;

          /* pas de halo sur les étoiles éteintes : à 0,10 d'opacité elles
             restent de grosses taches floues et brouillent la sélection */
          if (on) {
            var gl = r * (isSel || isHover || isEnd ? 3.6 : 2.2) * twk;
            c2d.globalAlpha = dark ? 0.8 : 0.6;
            c2d.drawImage(glowSprite(n.c), P.x - gl, P.y - gl, gl * 2, gl * 2);
            c2d.globalAlpha = 1;
          } else {
            return;    // éteinte : ni halo, ni étiquette
          }

          /* pendant que le nuage se place, les noms sautent d'une image à
             l'autre : illisibles, et c'est le poste de rendu le plus cher */
          if (simMoving) return;

          var show = st.labels === 'all'
            || isSel || isHover || isEnd
            || (act && act[n.i])
            || (st.labels === 'smart' && (
                  view.k >= 1.6 ? true
                : view.k >= 1.0 ? hubRank[n.i] < 90
                : view.k >= 0.62 ? hubRank[n.i] < 46
                : hubRank[n.i] < 26));
          if (show && st.labels !== 'none') {
            labels.push({ n: n, P: P, r: r, strong: isSel || isHover || isEnd });
          }
        });
        c2d.globalCompositeOperation = 'source-over';

        /* --- cœurs d'étoile --- */
        nodes.forEach(function (n) {
          if (st.hidden[n.c]) return;
          var P = toScreen(n);
          var r = radiusOf(n) * Math.min(1.7, Math.max(.7, view.k));
          var on = !act || act[n.i];
          var isSel = st.sel === n, isHover = st.hover === n, isEnd = st.from === n || st.to === n;
          var twk = st.ambient ? 0.9 + 0.1 * Math.sin(tAmb * 1.7 + n.ph) : 1;

          /* Étoile éteinte : un point FIXE et petit. L'atténuer sans la
             réduire laissait un disque de 34 px à 13 % d'opacité — un
             flou de bokeh qui noyait la sélection. */
          if (!on) {
            c2d.globalAlpha = 0.3;
            c2d.beginPath();
            c2d.arc(P.x, P.y, 1.7, 0, Math.PI * 2);
            c2d.fillStyle = catColor(n.c, 1);
            c2d.fill();
            c2d.globalAlpha = 1;
            return;
          }

          /* cœur teinté, et pointe blanche réservée aux carrefours :
             un cœur blanc sur les 237 nœuds efface le code couleur */
          c2d.beginPath();
          c2d.arc(P.x, P.y, r * 0.62 * twk, 0, Math.PI * 2);
          c2d.fillStyle = catColor(n.c, 1);
          c2d.fill();
          if (hubRank[n.i] < 40 || isSel || isHover) {
            c2d.beginPath();
            c2d.arc(P.x, P.y, r * 0.26 * twk, 0, Math.PI * 2);
            /* sur fond clair, une pointe blanche creuse un anneau : on l'atténue */
            c2d.fillStyle = dark ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.42)';
            c2d.fill();
          }

          if (isSel || isHover || isEnd) {
            c2d.beginPath();
            c2d.arc(P.x, P.y, r + 7 + (st.ambient ? Math.sin(tAmb * 2.6) * 1.6 : 0), 0, Math.PI * 2);
            c2d.strokeStyle = isEnd ? COL.accent : catColor(n.c, 0.85);
            c2d.lineWidth = 1.5;
            c2d.stroke();
          }
          c2d.globalAlpha = 1;
        });

        /* --- impulsions le long du chemin --- */
        if (st.path && st.path.length > 1) {
          var pts = st.path.map(function (i) { return toScreen(nodes[i]); });
          var segs = pts.length - 1;
          for (var q = 0; q < 3; q++) {
            var t = ((tAmb * 0.42) + q / 3) % 1;
            var f = t * segs, si = Math.min(segs - 1, Math.floor(f)), lf = f - si;
            var A2 = pts[si], B2 = pts[si + 1];
            var px = A2.x + (B2.x - A2.x) * lf, py = A2.y + (B2.y - A2.y) * lf;
            c2d.globalCompositeOperation = 'lighter';
            c2d.beginPath();
            c2d.arc(px, py, 4.2, 0, Math.PI * 2);
            c2d.fillStyle = COL.accent;
            c2d.globalAlpha = 0.9;
            c2d.fill();
            c2d.globalAlpha = 1;
            c2d.globalCompositeOperation = 'source-over';
          }
        }

        /* --- voile des bords --- */
        if (!vignette) vignette = buildVignette();
        c2d.drawImage(vignette, 0, 0, W, H);

        /* --- étiquettes, au-dessus de tout --- */
        c2d.font = '600 12.5px system-ui, -apple-system, "Segoe UI", sans-serif';
        c2d.textBaseline = 'middle';

        /* Les plus importantes d'abord, et on écarte celles qui
           tomberaient sur une étiquette déjà posée : sans ce tri-filtre,
           les noms se superposent et deviennent tous illisibles. */
        labels.sort(function (a, b) {
          return (b.strong ? 1 : 0) - (a.strong ? 1 : 0) || hubRank[a.n.i] - hubRank[b.n.i];
        });

        var placed = [];
        function free(x, y, w) {
          for (var i = 0; i < placed.length; i++) {
            var p = placed[i];
            if (x < p.x + p.w + 5 && x + w + 5 > p.x && y < p.y + 15 && y + 15 > p.y) return false;
          }
          return true;
        }

        labels.forEach(function (L) {
          var w = labelWidth(L.n.t), y = L.P.y - 7;
          if (y < 4 || y > H - 18) return;
          var xr = L.P.x + L.r + 7, xl = L.P.x - L.r - 7 - w;
          var x = null;
          if (xr + w < W - 6 && free(xr, y, w)) x = xr;
          else if (xl > 6 && free(xl, y, w)) x = xl;
          if (x === null) return;
          placed.push({ x: x, y: y, w: w });

          c2d.lineWidth = 3.4;
          c2d.strokeStyle = COL.halo;
          c2d.strokeText(L.n.t, x, y + 7);
          c2d.fillStyle = L.strong ? COL.txt : COL.txt2;
          c2d.fillText(L.n.t, x, y + 7);
        });
      }

      /* ------------------------------------------------------------
         Boucle
         ------------------------------------------------------------ */
      var raf = null, needsDraw = true, settled = false, frame = 0;
      function loop() {
        if (!cv.isConnected) { raf = null; return; }
        if (document.hidden) { raf = null; return; }   // relancé par visibilitychange

        frame++;
        var moving = temp > TEMP_MIN + 0.01;
        simMoving = moving;
        /* le fond n'est jamais reconstruit pendant la convergence : ce serait
           quelques centaines de canvas de 1400×900 alloués pour rien, et le
           navigateur finit par refuser de servir — écran noir à la clé. */
        if (moving) { tick(); needsDraw = true; }
        else if (!settled) { settled = true; fit(); needsDraw = true; }
        if (stepGlide()) needsDraw = true;

        /* scintillement : une image sur trois suffit largement, et le
           repos du module ne doit pas coûter plus qu'un curseur qui clignote */
        var ambient = st.ambient && settled && !moving;
        if (ambient && frame % 3 === 0) { tAmb += 0.05; needsDraw = true; }

        if (needsDraw) { draw(); needsDraw = false; }

        if (moving || ambient || glide) raf = requestAnimationFrame(loop);
        else raf = null;
      }
      function kick(reheat) {
        if (reheat) { temp = reheat; settled = false; }
        needsDraw = true;
        if (!raf) raf = requestAnimationFrame(loop);
      }
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && cv.isConnected) kick();
      });

      /* ------------------------------------------------------------
         Interactions
         ------------------------------------------------------------ */
      function nodeAt(px, py) {
        var g = toGraph(px, py), best = null, bestD = Infinity;
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i];
          if (st.hidden[n.c]) continue;
          var dx = n.x - g.x, dy = n.y - g.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          var r = (radiusOf(n) * Math.min(1.7, Math.max(.7, view.k)) + 7) / view.k;
          if (d < r && d < bestD) { best = n; bestD = d; }
        }
        return best;
      }
      function localPos(e) {
        var r = cv.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      }

      var drag = null;
      cv.addEventListener('pointerdown', function (e) {
        var p = localPos(e);
        var n = nodeAt(p.x, p.y);
        cv.setPointerCapture(e.pointerId);
        drag = { node: n, sx: p.x, sy: p.y, vx: view.x, vy: view.y, moved: false };
        if (n) n.pinned = true;
        glide = null;
        wrap.classList.add('dragging');
      });
      cv.addEventListener('pointermove', function (e) {
        var p = localPos(e);
        if (drag) {
          if (Math.abs(p.x - drag.sx) + Math.abs(p.y - drag.sy) > 3) drag.moved = true;
          if (drag.node) {
            var g = toGraph(p.x, p.y);
            drag.node.x = g.x; drag.node.y = g.y;
            kick(Math.max(temp, 5));
          } else {
            view.x = drag.vx + (p.x - drag.sx);
            view.y = drag.vy + (p.y - drag.sy);
            kick();
          }
          return;
        }
        var h = nodeAt(p.x, p.y);
        if (h !== st.hover) {
          st.hover = h;
          cv.style.cursor = h ? 'pointer' : '';
          if (h) wrap.setAttribute('data-tip', h.t + ' — ' + h.c + ' · ' + h.deg + ' voisin(s)');
          else wrap.removeAttribute('data-tip');
          kick();
        }
      });
      function endDrag(e) {
        if (!drag) return;
        var d = drag; drag = null;
        wrap.classList.remove('dragging');
        try { cv.releasePointerCapture(e.pointerId); } catch (err) { /* déjà relâché */ }
        if (d.node) {
          d.node.pinned = false;
          if (!d.moved) select(d.node);
        } else if (!d.moved) select(null);
        kick();
      }
      cv.addEventListener('pointerup', endDrag);
      cv.addEventListener('pointercancel', endDrag);
      cv.addEventListener('pointerleave', function () {
        if (st.hover) { st.hover = null; wrap.removeAttribute('data-tip'); kick(); }
      });

      cv.addEventListener('wheel', function (e) {
        e.preventDefault();
        var p = localPos(e);
        var g = toGraph(p.x, p.y);
        var f = e.deltaY < 0 ? 1.14 : 1 / 1.14;
        glide = null;
        view.k = Math.max(0.1, Math.min(6, view.k * f));
        view.x = p.x - g.x * view.k;
        view.y = p.y - g.y * view.k;
        kick();
      }, { passive: false });

      cv.addEventListener('dblclick', function (e) {
        var p = localPos(e);
        var n = nodeAt(p.x, p.y);
        if (n) glideTo(n, 2.2); else fit();
        kick();
      });

      /* ------------------------------------------------------------
         Chemin le plus court
         ------------------------------------------------------------ */
      function shortestPath(a, b) {
        if (a === b) return [a];
        var prev = {}, q = [a], seen = {};
        seen[a] = true;
        while (q.length) {
          var cur = q.shift();
          for (var i = 0; i < nodes[cur].adj.length; i++) {
            var nx = nodes[cur].adj[i];
            if (seen[nx]) continue;
            seen[nx] = true; prev[nx] = cur;
            if (nx === b) {
              var out = [b], k = b;
              while (k !== a) { k = prev[k]; out.push(k); }
              return out.reverse();
            }
            q.push(nx);
          }
        }
        return null;
      }

      var pathBox = el('div', { class: 'cst-path' });
      var endsBox = el('div', { class: 'flex wrap', style: { gap: '6px' } });

      function computePath() {
        UI.clear(pathBox);
        if (!st.from || !st.to) { st.path = null; drawEnds(); kick(); return; }
        var p = shortestPath(st.from.i, st.to.i);
        st.path = p;
        if (!p) {
          pathBox.appendChild(UI.note('Aucun chemin de renvois ne relie <b>' + st.from.t + '</b> à <b>' + st.to.t +
            '</b> : ces deux termes sont dans des îlots séparés du réseau.', 'warn'));
        } else {
          var line = el('div', { class: 'flex wrap', style: { gap: '6px' } }, [
            el('span', { class: 'cst-k', text: (p.length - 1) + ' saut' + (p.length > 2 ? 's' : '') })
          ]);
          p.forEach(function (idx, i) {
            if (i) line.appendChild(el('span', { class: 'cst-arrow', text: '→' }));
            line.appendChild(el('span', {
              class: 'chip', text: nodes[idx].t,
              onClick: function () { select(nodes[idx]); }
            }));
          });
          pathBox.appendChild(line);

          var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
          p.forEach(function (idx) {
            var n = nodes[idx];
            if (n.x < x0) x0 = n.x; if (n.x > x1) x1 = n.x;
            if (n.y < y0) y0 = n.y; if (n.y > y1) y1 = n.y;
          });
          var w = Math.max(140, x1 - x0), h = Math.max(140, y1 - y0);
          var k = Math.max(0.2, Math.min(2.2, Math.min((W - 190) / w, (H - 130) / h)));
          glide = { k: k, x: W / 2 - ((x0 + x1) / 2) * k, y: H / 2 - ((y0 + y1) / 2) * k, t: 0 };
        }
        drawEnds();
        kick();
      }

      function drawEnds() {
        UI.clear(endsBox);
        endsBox.appendChild(el('span', { class: 'cst-k', text: 'Chemin' }));
        endsBox.appendChild(st.from
          ? el('span', { class: 'chip on', text: '① ' + st.from.t, title: 'Retirer', onClick: function () { st.from = null; computePath(); } })
          : el('span', { class: 'chip', text: '① départ — non défini' }));
        endsBox.appendChild(st.to
          ? el('span', { class: 'chip on', text: '② ' + st.to.t, title: 'Retirer', onClick: function () { st.to = null; computePath(); } })
          : el('span', { class: 'chip', text: '② arrivée — non définie' }));
        if (st.from || st.to) {
          endsBox.appendChild(el('span', {
            class: 'chip', text: '✕ effacer',
            onClick: function () { st.from = null; st.to = null; computePath(); }
          }));
        }
      }

      /* ------------------------------------------------------------
         Panneau latéral
         ------------------------------------------------------------ */
      var panel = el('div');

      function select(n) {
        st.sel = n;
        if (n) { st.hits = null; searchInput.value = ''; st.q = ''; hitCount.textContent = ''; }
        drawPanel();
        kick();
      }

      function drawPanel() {
        UI.clear(panel);
        var n = st.sel;
        if (!n) {
          panel.appendChild(UI.card('Les carrefours du vocabulaire', [
            el('p', { class: 'muted small', style: { margin: '-4px 0 10px' },
              text: 'Les termes les plus reliés : les connaître mal coûte cher, beaucoup d’autres notions y mènent.' }),
            el('div', { class: 'cst-top' }, hubOrder.slice(0, 14).map(function (x) {
              return el('div', { class: 'cst-top-row', onClick: function () { select(x); glideTo(x, 1.7); kick(); } }, [
                el('i', { class: 'cst-dot', style: { background: catColor(x.c, 1) } }),
                el('span', { class: 'cst-top-t', text: x.t }),
                el('span', { class: 'spacer' }),
                el('span', { class: 'cst-deg', text: String(x.deg) })
              ]);
            }))
          ]));
          panel.appendChild(UI.note('Molette pour zoomer, glisser pour déplacer, double-clic pour cadrer. ' +
            'Cliquez une étoile : le ciel ne garde qu’elle et ses voisins.'));
          return;
        }

        var g = n.g;
        panel.appendChild(UI.card(null, [
          el('div', { class: 'flex wrap', style: { gap: '8px' } }, [
            el('i', { class: 'cst-dot', style: { background: catColor(n.c, 1) } }),
            el('b', { class: 'gl-t selectable', text: g.t }),
            el('span', { class: 'spacer' }),
            UI.chip(n.c)
          ]),
          g.a ? el('div', { class: 'gl-syn selectable', text: g.a }) : null,
          el('p', { class: 'gl-d selectable', text: g.d }),
          g.n ? el('div', { class: 'gl-norm' }, [
            el('span', { class: 'gl-norm-k', text: 'À retenir' }),
            el('span', { class: 'gl-norm-v selectable', text: g.n })
          ]) : null,
          el('div', { class: 'flex wrap gl-see' }, [
            el('span', { class: 'gl-see-k', text: n.deg + ' voisin' + (n.deg > 1 ? 's' : '') })
          ].concat(n.adj.map(function (i) {
            return el('span', {
              class: 'chip', text: nodes[i].t,
              onClick: function () { select(nodes[i]); glideTo(nodes[i], Math.max(view.k, 1.4)); kick(); }
            });
          }))),
          el('div', { class: 'btn-row' }, [
            UI.btn('① Départ', function () { st.from = n; computePath(); }, 'sm'),
            UI.btn('② Arrivée', function () { st.to = n; computePath(); }, 'sm'),
            el('span', { class: 'spacer' }),
            UI.btn('📖 Glossaire', function () { App.go('glossary', { term: g.t }); }, 'sm primary')
          ])
        ]));
      }

      /* ------------------------------------------------------------
         Contrôles
         ------------------------------------------------------------ */
      var searchInput = el('input', {
        type: 'text', class: 'inp',
        placeholder: 'Illuminer les termes contenant…  (torsion, prisme, enfant)'
      });
      var hitCount = el('span', { class: 'small muted' });

      searchInput.addEventListener('input', function () {
        st.q = searchInput.value.trim();
        var q = norm(st.q);
        if (!q) { st.hits = null; hitCount.textContent = ''; kick(); return; }
        st.sel = null; st.path = null; st.from = null; st.to = null;
        drawEnds(); UI.clear(pathBox); drawPanel();
        var hits = {}, n = 0, first = null;
        nodes.forEach(function (x) {
          if (st.hidden[x.c]) return;
          if (x.s.indexOf(q) >= 0) { hits[x.i] = true; n++; if (!first) first = x; }
        });
        st.hits = n ? hits : {};
        hitCount.textContent = n ? n + ' terme(s) illuminé(s)' : 'aucun terme';
        kick();
      });

      var legend = el('div', { class: 'flex wrap cst-legend' });
      cats.forEach(function (c) {
        var count = nodes.filter(function (n) { return n.c === c; }).length;
        var chip = el('span', {
          class: 'chip on', title: count + ' terme(s) — cliquez pour masquer',
          onClick: function () {
            st.hidden[c] = !st.hidden[c];
            chip.classList.toggle('on', !st.hidden[c]);
            /* rien à invalider : le fond est en coordonnées écran */
            kick();
          }
        }, [
          el('i', { class: 'cst-dot', style: { background: catColor(c, 1) } }),
          el('span', { text: c })
        ]);
        legend.appendChild(chip);
      });

      var labelSel = UI.select([
        { value: 'smart', label: 'Étiquettes : selon le zoom' },
        { value: 'all', label: 'Étiquettes : toutes' },
        { value: 'none', label: 'Étiquettes : aucune' }
      ], 'smart', function (v) { st.labels = v; kick(); });

      var ambChip = el('span', {
        class: 'chip on', text: '✨ Scintillement',
        title: 'Animation de fond — la couper met la boucle en veille',
        onClick: function (e) {
          st.ambient = !st.ambient;
          e.currentTarget.classList.toggle('on', st.ambient);
          kick();
        }
      });

      function randomStar() {
        var pool = nodes.filter(function (n) { return !st.hidden[n.c] && n.deg > 0; });
        if (!pool.length) return;
        var n = pool[Math.floor(Math.random() * pool.length)];
        select(n); glideTo(n, 1.8); kick();
        UI.toast('Au hasard : ' + n.t + ' — ' + n.deg + ' voisin(s)');
      }

      var isolated = nodes.filter(function (n) { return n.deg === 0; }).length;
      var top = hubOrder[0];
      var avg = (2 * edges.length / nodes.length).toFixed(1);

      drawEnds();
      drawPanel();

      var root = UI.page({
        crumb: 'Savoir',
        wide: true,
        title: 'Constellation du vocabulaire',
        subtitle: nodes.length + ' termes, ' + edges.length + ' renvois « voir aussi », ' + cats.length +
          ' catégories. Une étoile par terme, un trait par lien de sens — de quoi réviser par association ' +
          'plutôt que par ordre alphabétique.'
      }, [
        UI.card(null, [
          searchInput,
          el('div', { class: 'btn-row', style: { marginTop: '12px' } }, [
            hitCount,
            el('span', { class: 'spacer' }),
            ambChip,
            labelSel,
            UI.btn('🎲 Étoile au hasard', randomStar),
            UI.btn('⊹ Recadrer', function () { fit(); kick(); }),
            UI.btn('↻ Relancer', function () {
              st.path = null; st.sel = null; drawPanel(); kick(80);
            })
          ]),
          el('div', { style: { marginTop: '10px' } }, endsBox),
          pathBox
        ]),

        el('div', { class: 'split-wide' }, [
          el('div', {}, [
            wrap,
            el('div', { class: 'flex wrap', style: { marginTop: '10px' } }, legend)
          ]),
          panel
        ]),

        UI.card('Lire le ciel', [
          el('div', { class: 'grid g4' }, [
            UI.stat(nodes.length, 'Termes'),
            UI.stat(edges.length, 'Renvois'),
            UI.stat(avg, 'Voisins en moyenne'),
            UI.stat(isolated, 'Termes isolés', isolated ? 'var(--amber)' : 'var(--green)')
          ]),
          UI.note('Rien n’impose aux couleurs de se regrouper : si les termes d’une même catégorie finissent voisins, ' +
            'c’est que le glossaire les relie réellement entre eux. Les amas que vous voyez sont donc une propriété ' +
            'du vocabulaire, pas un choix de mise en page. Le plus gros carrefour est <b>' + top.t + '</b> (' +
            top.deg + ' voisins).'),
          UI.keyhint([
            ['Molette', 'zoomer'], ['Glisser', 'déplacer'], ['Double-clic', 'cadrer'],
            ['R', 'au hasard'], ['F', 'recadrer'], ['Échap', 'tout désélectionner']
          ])
        ])
      ]);

      requestAnimationFrame(function () { resize(); fit(); kick(); });

      if (window.ResizeObserver) {
        var ro = new ResizeObserver(function () {
          if (!cv.isConnected) { ro.disconnect(); return; }
          resize(); kick();
        });
        ro.observe(wrap);
      } else {
        window.addEventListener('resize', function () { resize(); kick(); });
      }

      var mo = new MutationObserver(function () {
        if (!cv.isConnected) { mo.disconnect(); return; }
        readColors(); kick();
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      UI.hotkeys(root, {
        'r': randomStar,
        'f': function () { fit(); kick(); },
        'Escape': function () {
          st.sel = null; st.path = null; st.from = null; st.to = null;
          st.hits = null; st.q = ''; searchInput.value = ''; hitCount.textContent = '';
          drawEnds(); UI.clear(pathBox); drawPanel(); fit(); kick();
        }
      });

      var wanted = ctx && ctx.params && ctx.params.term;
      if (wanted && G.index[wanted] !== undefined) {
        var target = nodes[G.index[wanted]];
        select(target);
        setTimeout(function () { if (cv.isConnected) { glideTo(target, 1.8); kick(); } }, 950);
      }

      return root;
    }
  };
})();
