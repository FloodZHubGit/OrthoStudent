/* ============================================================
   Constellation du vocabulaire
   ------------------------------------------------------------
   Le glossaire vu comme un réseau : chaque terme est un nœud,
   chaque renvoi « voir aussi » une arête. Placement par simulation
   de forces (Fruchterman-Reingold), rendu sur canvas — à 237 nœuds
   et ~700 arêtes, le SVG ne tiendrait pas les 60 images par seconde.

   Sert à réviser par association : ce qui gravite autour d'un terme,
   et le chemin le plus court entre deux notions.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  /* ------------------------------------------------------------
     Construction du graphe à partir du glossaire
     ------------------------------------------------------------ */
  function buildGraph() {
    var nodes = [], index = {}, edges = [], seen = {};

    GLOSSARY.forEach(function (g, i) {
      index[g.t] = i;
      nodes.push({
        i: i, g: g, t: g.t, c: g.c,
        s: norm(g.t + ' ' + (g.a || '') + ' ' + g.d + ' ' + g.c),
        x: 0, y: 0, vx: 0, vy: 0, deg: 0, adj: [], pinned: false
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

  /* teinte par catégorie : réparties sur la roue, décalées pour que
     deux catégories voisines dans l'ordre alphabétique se distinguent */
  function hues(cats) {
    var h = {};
    var n = cats.length;
    cats.forEach(function (c, i) {
      // pas de 7 sur n : évite les paquets de couleurs proches
      h[c] = Math.round(((i * 7) % n) * (360 / n));
    });
    return h;
  }

  M.constellation = {
    id: 'constellation', title: 'Constellation', icon: '🌌', group: 'Savoir',
    desc: 'Le glossaire en réseau : ce qui gravite autour d’un terme, et le chemin entre deux notions',
    keywords: 'constellation graphe reseau carte mentale liens renvois association vocabulaire glossaire chemin',
    render: function (ctx) {
      var G = buildGraph();
      var nodes = G.nodes, edges = G.edges;

      var cats = [];
      nodes.forEach(function (n) { if (cats.indexOf(n.c) < 0) cats.push(n.c); });
      cats.sort(function (a, b) { return a.localeCompare(b, 'fr'); });
      var HUE = hues(cats);

      var st = {
        sel: null,           // nœud sélectionné
        hover: null,
        from: null, to: null, path: null,
        q: '', hits: null,   // recherche
        hidden: {},          // catégories masquées
        labels: 'smart'      // 'smart' | 'all' | 'none'
      };

      /* ---------- couleurs, relues à chaque changement de thème ---------- */
      var COL = {};
      function readColors() {
        var cs = getComputedStyle(document.documentElement);
        function v(k) { return cs.getPropertyValue(k).trim(); }
        COL.dark = document.documentElement.getAttribute('data-theme') !== 'light';
        COL.bg = v('--surface');
        COL.line = COL.dark ? 'rgba(255,255,255,.10)' : 'rgba(15,35,60,.13)';
        COL.lineHot = v('--accent');
        COL.txt = v('--txt');
        COL.txt3 = v('--txt-3');
        COL.accent = v('--accent');
      }
      readColors();

      function catColor(c, alpha) {
        var h = HUE[c] || 0;
        return COL.dark
          ? 'hsla(' + h + ',68%,63%,' + (alpha === undefined ? 1 : alpha) + ')'
          : 'hsla(' + h + ',62%,42%,' + (alpha === undefined ? 1 : alpha) + ')';
      }

      /* ------------------------------------------------------------
         Placement initial : une couronne par catégorie. La simulation
         part ainsi d'un état déjà groupé et converge bien plus vite.
         ------------------------------------------------------------ */
      (function seed() {
        var byCat = {};
        nodes.forEach(function (n) { (byCat[n.c] = byCat[n.c] || []).push(n); });
        cats.forEach(function (c, ci) {
          var ring = 260 + (ci % 3) * 120;
          var base = (ci / cats.length) * Math.PI * 2;
          byCat[c].forEach(function (n, j) {
            var a = base + (j / Math.max(1, byCat[c].length)) * 0.9 - 0.45;
            n.x = Math.cos(a) * ring + (Math.random() - 0.5) * 40;
            n.y = Math.sin(a) * ring + (Math.random() - 0.5) * 40;
          });
        });
      })();

      /* ------------------------------------------------------------
         Simulation de forces
         ------------------------------------------------------------ */
      var K = Math.sqrt((1100 * 780) / nodes.length);   // distance idéale
      var temp = 70, TEMP_MIN = 0.45, COOL = 0.986;

      function tick() {
        var i, j, a, b, dx, dy, d2, d, f;
        for (i = 0; i < nodes.length; i++) { nodes[i].vx = 0; nodes[i].vy = 0; }

        // répulsion de tous contre tous
        for (i = 0; i < nodes.length; i++) {
          a = nodes[i];
          for (j = i + 1; j < nodes.length; j++) {
            b = nodes[j];
            dx = a.x - b.x; dy = a.y - b.y;
            d2 = dx * dx + dy * dy;
            if (d2 < 0.01) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d2 = 0.01; }
            d = Math.sqrt(d2);
            f = (K * K) / d2;                 // ~ k²/d, normalisé plus bas
            dx /= d; dy /= d;
            a.vx += dx * f; a.vy += dy * f;
            b.vx -= dx * f; b.vy -= dy * f;
          }
        }

        // attraction le long des arêtes
        for (i = 0; i < edges.length; i++) {
          a = nodes[edges[i].a]; b = nodes[edges[i].b];
          dx = a.x - b.x; dy = a.y - b.y;
          d = Math.sqrt(dx * dx + dy * dy) || 0.01;
          f = (d * d) / K;
          dx /= d; dy /= d;
          a.vx -= dx * f; a.vy -= dy * f;
          b.vx += dx * f; b.vy += dy * f;
        }

        // gravité vers le centre : sans elle, les termes isolés partent à l'infini
        for (i = 0; i < nodes.length; i++) {
          a = nodes[i];
          a.vx -= a.x * 0.045;
          a.vy -= a.y * 0.045;
        }

        // déplacement borné par la température
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
         Canvas, caméra
         ------------------------------------------------------------ */
      var cv = el('canvas');
      var wrap = el('div', { class: 'cst-wrap' }, cv);
      var c2d = cv.getContext('2d');
      var W = 900, H = 560, view = { k: 1, x: 450, y: 280 };

      function toScreen(n) { return { x: n.x * view.k + view.x, y: n.y * view.k + view.y }; }
      function toGraph(px, py) { return { x: (px - view.x) / view.k, y: (py - view.y) / view.k }; }

      function resize() {
        var r = wrap.getBoundingClientRect();
        if (!r.width) return;
        var dpr = window.devicePixelRatio || 1;
        W = r.width; H = r.height;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        cv.style.width = W + 'px'; cv.style.height = H + 'px';
        c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function fit(pad) {
        pad = pad === undefined ? 60 : pad;
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        nodes.forEach(function (n) {
          if (st.hidden[n.c]) return;
          if (n.x < minX) minX = n.x; if (n.x > maxX) maxX = n.x;
          if (n.y < minY) minY = n.y; if (n.y > maxY) maxY = n.y;
        });
        if (minX === Infinity) return;
        var w = Math.max(1, maxX - minX), h = Math.max(1, maxY - minY);
        view.k = Math.max(0.12, Math.min(3, Math.min((W - pad * 2) / w, (H - pad * 2) / h)));
        view.x = W / 2 - ((minX + maxX) / 2) * view.k;
        view.y = H / 2 - ((minY + maxY) / 2) * view.k;
      }

      function focusNode(n, k) {
        view.k = k || Math.max(view.k, 1.5);
        view.x = W / 2 - n.x * view.k;
        view.y = H / 2 - n.y * view.k;
      }

      /* ------------------------------------------------------------
         Mise en relief : qui est « actif » à l'écran
         ------------------------------------------------------------ */
      function activeSet() {
        // renvoie null quand tout est actif (aucun filtre en cours)
        if (st.path) {
          var p = {};
          st.path.forEach(function (i) { p[i] = true; });
          return p;
        }
        if (st.sel) {
          var s = {}; s[st.sel.i] = true;
          st.sel.adj.forEach(function (i) { s[i] = true; });
          return s;
        }
        if (st.hits) return st.hits;
        return null;
      }

      function radiusOf(n) {
        return Math.min(15, 3.4 + Math.sqrt(n.deg) * 1.9);
      }

      /* ------------------------------------------------------------
         Rendu
         ------------------------------------------------------------ */
      var labelW = {};
      function labelWidth(t) {
        if (labelW[t] === undefined) labelW[t] = c2d.measureText(t).width;
        return labelW[t];
      }

      function draw() {
        c2d.clearRect(0, 0, W, H);
        var act = activeSet();
        var pathEdges = {};
        if (st.path) {
          for (var pi = 0; pi + 1 < st.path.length; pi++) {
            pathEdges[Math.min(st.path[pi], st.path[pi + 1]) + ':' + Math.max(st.path[pi], st.path[pi + 1])] = true;
          }
        }

        /* --- arêtes --- */
        c2d.lineWidth = 1;
        edges.forEach(function (e) {
          var a = nodes[e.a], b = nodes[e.b];
          if (st.hidden[a.c] || st.hidden[b.c]) return;
          var hot = pathEdges[Math.min(e.a, e.b) + ':' + Math.max(e.a, e.b)];
          var near = act && (act[e.a] && act[e.b]);
          var touch = act && (act[e.a] || act[e.b]);
          if (act && !touch && !hot) return;              // hors sujet : on n'affiche pas

          var A = toScreen(a), B = toScreen(b);
          if (hot) { c2d.strokeStyle = COL.lineHot; c2d.lineWidth = 2.4; }
          else if (near || (act && touch)) { c2d.strokeStyle = catColor(a.c, .55); c2d.lineWidth = 1.4; }
          else { c2d.strokeStyle = COL.line; c2d.lineWidth = 1; }
          c2d.beginPath();
          c2d.moveTo(A.x, A.y); c2d.lineTo(B.x, B.y);
          c2d.stroke();
        });

        /* --- nœuds --- */
        var labels = [];
        nodes.forEach(function (n) {
          if (st.hidden[n.c]) return;
          var P = toScreen(n);
          var r = radiusOf(n) * Math.min(1.6, Math.max(.75, view.k));
          var on = !act || act[n.i];
          var isSel = st.sel === n, isHover = st.hover === n;
          var isEnd = st.from === n || st.to === n;

          c2d.globalAlpha = on ? 1 : 0.13;
          c2d.beginPath();
          c2d.arc(P.x, P.y, r, 0, Math.PI * 2);
          c2d.fillStyle = catColor(n.c, 1);
          c2d.fill();

          if (isSel || isHover || isEnd) {
            c2d.lineWidth = isEnd ? 3 : 2;
            c2d.strokeStyle = isEnd ? COL.accent : COL.txt;
            c2d.stroke();
            c2d.beginPath();
            c2d.arc(P.x, P.y, r + 5, 0, Math.PI * 2);
            c2d.strokeStyle = isEnd ? COL.accent : catColor(n.c, .6);
            c2d.lineWidth = 1.2;
            c2d.stroke();
          }
          c2d.globalAlpha = 1;

          if (!on) return;
          var show = st.labels === 'all'
            || isSel || isHover || isEnd
            || (st.path && act && act[n.i])
            || (act && st.sel && act[n.i])
            || (st.hits && st.hits[n.i])
            || (st.labels === 'smart' && (view.k >= 1.15 ? n.deg >= 3 : view.k >= 0.75 ? n.deg >= 7 : n.deg >= 11));
          if (show && st.labels !== 'none') labels.push({ n: n, P: P, r: r, strong: isSel || isHover || isEnd });
        });

        /* --- étiquettes, en dernier pour rester au-dessus --- */
        c2d.font = '600 12px ' + (COL.dark ? '' : '') + 'system-ui, -apple-system, "Segoe UI", sans-serif';
        c2d.textBaseline = 'middle';
        labels.forEach(function (L) {
          var x = L.P.x + L.r + 5, y = L.P.y;
          if (x + labelWidth(L.n.t) > W - 4) x = L.P.x - L.r - 5 - labelWidth(L.n.t);
          c2d.lineWidth = 3.5;
          c2d.strokeStyle = COL.bg;
          c2d.strokeText(L.n.t, x, y);
          c2d.fillStyle = L.strong ? COL.txt : COL.txt3;
          c2d.fillText(L.n.t, x, y);
        });
      }

      /* ------------------------------------------------------------
         Boucle : la simulation refroidit puis s'arrête, mais le rendu
         doit continuer tant qu'on interagit (zoom, survol, sélection).
         ------------------------------------------------------------ */
      var raf = null, needsDraw = true, settled = false;
      function loop() {
        if (!cv.isConnected) { raf = null; return; }   // module quitté : on libère
        var moving = temp > TEMP_MIN + 0.01;
        if (moving) { tick(); needsDraw = true; }
        else if (!settled) { settled = true; fit(); needsDraw = true; }
        if (needsDraw) { draw(); needsDraw = false; }
        // graphe figé et rien à redessiner : on rend la main au navigateur
        // plutôt que de tourner à 60 images par seconde pour rien
        if (moving) raf = requestAnimationFrame(loop);
        else raf = null;
      }
      function kick(reheat) {
        if (reheat) { temp = reheat; settled = false; }
        needsDraw = true;
        if (!raf) raf = requestAnimationFrame(loop);
      }

      /* ------------------------------------------------------------
         Interactions souris
         ------------------------------------------------------------ */
      function nodeAt(px, py) {
        var g = toGraph(px, py), best = null, bestD = Infinity;
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i];
          if (st.hidden[n.c]) continue;
          var dx = n.x - g.x, dy = n.y - g.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          var r = (radiusOf(n) * Math.min(1.6, Math.max(.75, view.k)) + 6) / view.k;
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
        if (n) { n.pinned = true; }
        wrap.classList.add('dragging');
      });

      cv.addEventListener('pointermove', function (e) {
        var p = localPos(e);
        if (drag) {
          if (Math.abs(p.x - drag.sx) + Math.abs(p.y - drag.sy) > 3) drag.moved = true;
          if (drag.node) {
            var g = toGraph(p.x, p.y);
            drag.node.x = g.x; drag.node.y = g.y;
            kick(Math.max(temp, 6));
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
        } else if (!d.moved) {
          select(null);
        }
        kick();
      }
      cv.addEventListener('pointerup', endDrag);
      cv.addEventListener('pointercancel', endDrag);

      cv.addEventListener('wheel', function (e) {
        e.preventDefault();
        var p = localPos(e);
        var g = toGraph(p.x, p.y);
        var f = e.deltaY < 0 ? 1.14 : 1 / 1.14;
        view.k = Math.max(0.12, Math.min(6, view.k * f));
        view.x = p.x - g.x * view.k;
        view.y = p.y - g.y * view.k;
        kick();
      }, { passive: false });

      cv.addEventListener('dblclick', function (e) {
        var p = localPos(e);
        var n = nodeAt(p.x, p.y);
        if (n) { focusNode(n, 2.2); kick(); }
        else { fit(); kick(); }
      });

      /* ------------------------------------------------------------
         Chemin le plus court (parcours en largeur)
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

      function computePath() {
        UI.clear(pathBox);
        if (!st.from || !st.to) { st.path = null; drawPathHint(); kick(); return; }
        var p = shortestPath(st.from.i, st.to.i);
        st.path = p;
        if (!p) {
          pathBox.appendChild(UI.note('Aucun chemin de renvois ne relie <b>' + st.from.t + '</b> à <b>' + st.to.t +
            '</b> : ces deux termes appartiennent à des îlots séparés du réseau.', 'warn'));
        } else {
          var line = el('div', { class: 'flex wrap', style: { gap: '6px' } }, [
            el('span', { class: 'cst-k', text: p.length - 1 + ' saut' + (p.length > 2 ? 's' : '') })
          ]);
          p.forEach(function (idx, i) {
            if (i) line.appendChild(el('span', { class: 'cst-arrow', text: '→' }));
            line.appendChild(el('span', {
              class: 'chip', text: nodes[idx].t,
              onClick: function () { select(nodes[idx]); }
            }));
          });
          pathBox.appendChild(line);
          // cadrer sur le chemin
          var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          p.forEach(function (idx) {
            var n = nodes[idx];
            if (n.x < minX) minX = n.x; if (n.x > maxX) maxX = n.x;
            if (n.y < minY) minY = n.y; if (n.y > maxY) maxY = n.y;
          });
          var w = Math.max(120, maxX - minX), h = Math.max(120, maxY - minY);
          view.k = Math.max(0.2, Math.min(2.4, Math.min((W - 200) / w, (H - 140) / h)));
          view.x = W / 2 - ((minX + maxX) / 2) * view.k;
          view.y = H / 2 - ((minY + maxY) / 2) * view.k;
        }
        drawPathHint();
        kick();
      }

      var pathBox = el('div', { class: 'cst-path' });
      var endsBox = el('div', { class: 'flex wrap', style: { gap: '6px' } });

      function drawPathHint() {
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
         Panneau du terme sélectionné
         ------------------------------------------------------------ */
      var panel = el('div');

      function select(n) {
        st.sel = n;
        if (n) { st.hits = null; searchInput.value = ''; st.q = ''; }
        drawPanel();
        kick();
      }

      function drawPanel() {
        UI.clear(panel);
        var n = st.sel;
        if (!n) {
          panel.appendChild(UI.empty('🌌',
            'Cliquez une étoile pour ouvrir le terme et n’afficher que ses voisins.<br>' +
            '<span class="small">Molette : zoomer · glisser : déplacer · double-clic : cadrer</span>'));
          panel.appendChild(UI.card('Les mieux reliés', [
            el('div', { class: 'cst-top' }, nodes.slice().sort(function (a, b) { return b.deg - a.deg; })
              .slice(0, 12).map(function (x) {
                return el('div', { class: 'cst-top-row', onClick: function () { select(x); focusNode(x, 1.8); } }, [
                  el('i', { class: 'cst-dot', style: { background: catColor(x.c, 1) } }),
                  el('span', { class: 'cst-top-t', text: x.t }),
                  el('span', { class: 'spacer' }),
                  el('span', { class: 'cst-deg', text: String(x.deg) })
                ]);
              }))
          ]));
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
              onClick: function () { select(nodes[i]); focusNode(nodes[i], Math.max(view.k, 1.4)); }
            });
          }))),
          el('div', { class: 'btn-row' }, [
            UI.btn('① Départ', function () { st.from = n; computePath(); }, 'sm'),
            UI.btn('② Arrivée', function () { st.to = n; computePath(); }, 'sm'),
            el('span', { class: 'spacer' }),
            UI.btn('📖 Ouvrir dans le glossaire', function () { App.go('glossary', { term: g.t }); }, 'sm primary')
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
      searchInput.addEventListener('input', function () {
        st.q = searchInput.value.trim();
        var q = norm(st.q);
        if (!q) { st.hits = null; kick(); return; }
        st.sel = null; st.path = null; st.from = null; st.to = null;
        drawPathHint(); UI.clear(pathBox); drawPanel();
        var hits = {}, n = 0, first = null;
        nodes.forEach(function (x) {
          if (st.hidden[x.c]) return;
          if (x.s.indexOf(q) >= 0) { hits[x.i] = true; n++; if (!first) first = x; }
        });
        st.hits = n ? hits : {};
        hitCount.textContent = n ? n + ' terme(s) illuminé(s)' : 'aucun terme';
        kick();
      });
      var hitCount = el('span', { class: 'small muted' });

      var legend = el('div', { class: 'flex wrap cst-legend' });
      cats.forEach(function (c) {
        var count = nodes.filter(function (n) { return n.c === c; }).length;
        var chip = el('span', {
          class: 'chip on', title: count + ' terme(s)',
          onClick: function () {
            st.hidden[c] = !st.hidden[c];
            chip.classList.toggle('on', !st.hidden[c]);
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

      function randomStar() {
        var pool = nodes.filter(function (n) { return !st.hidden[n.c] && n.deg > 0; });
        if (!pool.length) return;
        var n = pool[Math.floor(Math.random() * pool.length)];
        select(n); focusNode(n, 1.9); kick();
        UI.toast('Au hasard : ' + n.t + ' — ' + n.deg + ' voisin(s)');
      }

      /* statistiques du réseau */
      var isolated = nodes.filter(function (n) { return n.deg === 0; }).length;
      var top = nodes.slice().sort(function (a, b) { return b.deg - a.deg; })[0];
      var avg = (2 * edges.length / nodes.length).toFixed(1);

      /* ------------------------------------------------------------
         Montage
         ------------------------------------------------------------ */
      drawPathHint();
      drawPanel();

      var root = UI.page({
        crumb: 'Savoir',
        wide: true,
        title: 'Constellation du vocabulaire',
        subtitle: nodes.length + ' termes reliés par ' + edges.length + ' renvois « voir aussi ». ' +
          'Chaque étoile est un terme du glossaire, chaque trait un lien de sens — de quoi réviser par association ' +
          'plutôt que par ordre alphabétique.'
      }, [
        UI.card(null, [
          searchInput,
          el('div', { class: 'btn-row', style: { marginTop: '12px' } }, [
            hitCount,
            el('span', { class: 'spacer' }),
            labelSel,
            UI.btn('🎲 Étoile au hasard', randomStar),
            UI.btn('⊹ Recadrer', function () { fit(); kick(); }),
            UI.btn('↻ Relancer', function () { st.path = null; st.sel = null; drawPanel(); kick(70); })
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

        UI.card('Lire le réseau', [
          el('div', { class: 'grid g4' }, [
            UI.stat(nodes.length, 'Termes'),
            UI.stat(edges.length, 'Renvois'),
            UI.stat(avg, 'Voisins en moyenne'),
            UI.stat(isolated, 'Termes isolés', isolated ? 'var(--amber)' : 'var(--green)')
          ]),
          UI.note('Un terme très relié — ici <b>' + top.t + '</b>, ' + top.deg + ' voisins — est un carrefour du raisonnement : ' +
            'le connaître mal coûte cher, parce que beaucoup d’autres notions y mènent. Les termes isolés, à l’inverse, ' +
            'sont ceux dont le glossaire ne cite encore aucun renvoi : ils s’apprennent seuls.'),
          UI.keyhint([
            ['Molette', 'zoomer'], ['Glisser', 'déplacer'], ['Double-clic', 'cadrer'],
            ['R', 'étoile au hasard'], ['F', 'recadrer'], ['Échap', 'tout désélectionner']
          ])
        ])
      ]);

      /* le canvas n'a ses dimensions qu'une fois dans le document */
      requestAnimationFrame(function () {
        resize(); fit(); kick();
      });

      if (window.ResizeObserver) {
        var ro = new ResizeObserver(function () {
          if (!cv.isConnected) { ro.disconnect(); return; }
          resize(); kick();
        });
        ro.observe(wrap);
      } else {
        window.addEventListener('resize', function () { resize(); kick(); });
      }

      /* le thème peut basculer pendant qu'on regarde le graphe */
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
          drawPathHint(); UI.clear(pathBox); drawPanel(); kick();
        }
      });

      /* terme visé depuis la recherche rapide ou le glossaire */
      var wanted = ctx && ctx.params && ctx.params.term;
      if (wanted && G.index[wanted] !== undefined) {
        var target = nodes[G.index[wanted]];
        select(target);
        requestAnimationFrame(function () {
          // on laisse la simulation se placer avant de cadrer
          setTimeout(function () { focusNode(target, 1.9); kick(); }, 900);
        });
      }

      return root;
    }
  };
})();
