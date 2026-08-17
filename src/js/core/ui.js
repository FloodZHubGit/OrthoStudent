/* ============================================================
   UI — helpers DOM, composants reutilisables
   ============================================================ */
(function () {
  'use strict';

  /* balises déjà activables au clavier : pas de rôle ARIA à leur ajouter */
  var NATIVE_INTERACTIVE = /^(a|button|input|select|textarea|label|summary)$/i;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    var onClick = null;
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') {
        if (k.toLowerCase() === 'onclick') onClick = v;
        node.addEventListener(k.slice(2).toLowerCase(), v);
      }
      else if (k === 'dataset') Object.keys(v).forEach(function (d) { node.dataset[d] = v[d]; });
      else node.setAttribute(k, v);
    });

    /* un <div>/<span> cliquable devient un vrai contrôle : atteignable à la
       tabulation, activable par Entrée ou Espace, annoncé comme un bouton */
    if (onClick && !NATIVE_INTERACTIVE.test(tag)) {
      if (!node.hasAttribute('role')) node.setAttribute('role', 'button');
      if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '0');
      node.addEventListener('keydown', function (e) {
        if (e.target !== node) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick.call(node, e); }
      });
    }
    (Array.isArray(children) ? children : children != null ? [children] : []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    });
    return node;
  }

  function svg(tag, attrs, children) {
    var node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : children != null ? [children] : []).forEach(function (c) {
      if (c === null || c === undefined || c === false || c === '') return;
      // un nombre est une légende valide (valeur d'un anneau, d'un axe…)
      node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    });
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }

  /* Copie un texte dans le presse-papiers.
     L'API asynchrone n'est pas disponible partout (origine file://) :
     on retombe alors sur la sélection d'un textarea hors écran. */
  function copy(text, okMsg) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      toast(ok ? (okMsg || 'Copié.') : 'Copie impossible — sélectionnez le texte à la main.');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg || 'Copié.'); }, fallback);
    } else fallback();
  }

  /* Propose l'enregistrement d'un texte dans un fichier. */
  function download(filename, text, mime) {
    var blob = new Blob([text], { type: (mime || 'text/plain') + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = el('a', { href: url, download: filename, style: { display: 'none' } });
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
  }

  function toast(msg, ms) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('on'); }, ms || 2400);
  }

  /* ---- Composants ---- */

  function page(opts, blocks) {
    var head = el('div', { class: 'page-head' }, [
      opts.crumb ? el('div', { class: 'crumb', text: opts.crumb }) : null,
      el('h1', { text: opts.title }),
      opts.subtitle ? el('p', { html: opts.subtitle }) : null
    ]);
    return el('div', { class: 'page' + (opts.wide ? ' wide' : '') }, [head].concat(blocks || []));
  }

  function card(title, children, opts) {
    opts = opts || {};
    var kids = [];
    if (title) {
      kids.push(el('div', { class: 'flex', style: { marginBottom: '10px' } }, [
        el('h2', { text: title, style: { margin: 0 } }),
        el('span', { class: 'spacer' }),
        opts.right || null
      ]));
    }
    (Array.isArray(children) ? children : [children]).forEach(function (c) { if (c) kids.push(c); });
    return el('div', { class: 'card' + (opts.class ? ' ' + opts.class : '') }, kids);
  }

  function field(label, input, hint) {
    return el('div', { class: 'field' }, [
      label ? el('label', { text: label }) : null,
      input,
      hint ? el('div', { class: 'hint', html: hint }) : null
    ]);
  }

  function num(value, onInput, attrs) {
    var i = el('input', Object.assign({ type: 'number', class: 'inp', value: value }, attrs || {}));
    i.addEventListener('input', function () { onInput(i.value === '' ? null : parseFloat(i.value), i); });
    return i;
  }

  function select(options, value, onChange) {
    var s = el('select', { class: 'inp' });
    options.forEach(function (o) {
      var v = typeof o === 'object' ? o.value : o;
      var l = typeof o === 'object' ? o.label : o;
      s.appendChild(el('option', { value: v, text: l, selected: String(v) === String(value) }));
    });
    s.addEventListener('change', function () { onChange(s.value, s); });
    return s;
  }

  function range(min, max, step, value, onInput, fmt) {
    var out = el('span', { class: 'mono', style: { minWidth: '58px', textAlign: 'right', color: 'var(--accent)' } });
    var r = el('input', { type: 'range', min: min, max: max, step: step, value: value });
    function upd() { out.textContent = fmt ? fmt(parseFloat(r.value)) : r.value; }
    r.addEventListener('input', function () { upd(); onInput(parseFloat(r.value), r); });
    upd();
    var wrap = el('div', { class: 'flex' }, [r, out]);
    wrap.input = r;
    wrap.refresh = upd;
    return wrap;
  }

  /* Rend un élément non natif utilisable au clavier comme un bouton.
     À utiliser sur toute <div> cliquable : sans cela, elle est invisible
     pour la tabulation et pour les lecteurs d'écran. */
  function clickable(node, onActivate, opts) {
    opts = opts || {};
    node.setAttribute('role', opts.role || 'button');
    node.setAttribute('tabindex', opts.tabindex === undefined ? '0' : String(opts.tabindex));
    node.addEventListener('click', onActivate);
    node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate(e); }
    });
    return node;
  }

  function tabs(items, onSelect, initial) {
    var bar = el('div', { class: 'tabs', role: 'tablist' });
    var body = el('div');
    var cur = initial || items[0].id;

    function activate(t) {
      bar.querySelectorAll('.tab').forEach(function (x) {
        x.classList.remove('active');
        x.setAttribute('aria-selected', 'false');
        x.setAttribute('tabindex', '-1');
      });
      t.classList.add('active');
      t.setAttribute('aria-selected', 'true');
      t.setAttribute('tabindex', '0');
      cur = t.dataset.id;
      clear(body);
      var content = onSelect(cur);
      if (content) body.appendChild(content);
    }

    items.forEach(function (it) {
      var on = it.id === cur;
      var t = el('div', {
        class: 'tab' + (on ? ' active' : ''), text: it.label, dataset: { id: it.id },
        role: 'tab', 'aria-selected': on ? 'true' : 'false', tabindex: on ? '0' : '-1'
      });
      t.addEventListener('click', function () { activate(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(t); return; }
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
        e.preventDefault();
        var all = [].slice.call(bar.querySelectorAll('.tab'));
        var i = all.indexOf(t);
        var next = e.key === 'Home' ? all[0]
                 : e.key === 'End' ? all[all.length - 1]
                 : all[(i + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length];
        activate(next);
        next.focus();
      });
      bar.appendChild(t);
    });

    var first = onSelect(cur);
    if (first) body.appendChild(first);
    var wrap = el('div', {}, [bar, body]);
    wrap.setTab = function (id) {
      var t = bar.querySelector('.tab[data-id="' + id + '"]');
      if (t) t.click();
    };
    return wrap;
  }

  function accordion(items) {
    var wrap = el('div');
    items.forEach(function (it, idx) {
      var body = el('div', { class: 'acc-body' });
      if (typeof it.body === 'string') body.innerHTML = it.body;
      else if (it.body) body.appendChild(it.body);
      var open = !!(it.open || (idx === 0 && it.openFirst));
      var head = el('div', { class: 'acc-head', 'aria-expanded': open ? 'true' : 'false' }, [
        el('span', { class: 'arrow', text: '▶', 'aria-hidden': 'true' }),
        el('span', { text: it.title }),
        it.tag ? el('span', { class: 'chip static', style: { marginLeft: 'auto' }, text: it.tag }) : null
      ]);
      var item = el('div', { class: 'acc-item' + (open ? ' open' : '') }, [head, body]);
      clickable(head, function () {
        var on = item.classList.toggle('open');
        head.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      wrap.appendChild(item);
    });
    return wrap;
  }

  function table(headers, rows, opts) {
    opts = opts || {};
    var t = el('table', { class: 'tbl' }, [
      el('thead', {}, el('tr', {}, headers.map(function (h) { return el('th', { text: h }); }))),
      el('tbody', {}, rows.map(function (r) {
        return el('tr', {}, r.map(function (c, i) {
          var cls = i === 0 ? 'k' : (opts.numeric && opts.numeric.indexOf(i) >= 0 ? 'num' : '');
          return typeof c === 'object' && c instanceof Node
            ? el('td', { class: cls }, c)
            : el('td', { class: cls, html: String(c) });
        }));
      }))
    ]);
    return opts.scroll ? el('div', { style: { maxHeight: opts.scroll, overflowY: 'auto' } }, t) : t;
  }

  function kv(k, v) {
    return el('div', { class: 'kv' }, [el('span', { class: 'k', html: k }), el('span', { class: 'v', html: String(v) })]);
  }

  function note(text, kind) {
    return el('div', { class: 'note' + (kind ? ' ' + kind : ''), html: text });
  }

  function chip(text, kind) {
    return el('span', { class: 'chip static' + (kind ? ' ' + kind : ''), text: text });
  }

  function btn(label, onClick, cls) {
    return el('button', { class: 'btn' + (cls ? ' ' + cls : ''), text: label, onClick: onClick });
  }

  function stat(n, label, color) {
    return el('div', { class: 'pill-stat' }, [
      el('div', { class: 'n', text: n, style: color ? { color: color } : {} }),
      el('div', { class: 'l', text: label })
    ]);
  }

  /* Anneau de progression SVG */
  function ring(pct, opts) {
    opts = opts || {};
    var size = opts.size || 52, w = opts.width || 5;
    var r = (size - w) / 2, c = 2 * Math.PI * r;
    var col = opts.color || 'var(--accent)';
    var g = svg('svg', { class: 'ring', width: size, height: size, viewBox: '0 0 ' + size + ' ' + size });
    g.appendChild(svg('circle', {
      cx: size / 2, cy: size / 2, r: r, fill: 'none',
      stroke: 'var(--surface-4)', 'stroke-width': w
    }));
    g.appendChild(svg('circle', {
      cx: size / 2, cy: size / 2, r: r, fill: 'none', stroke: col, 'stroke-width': w,
      'stroke-linecap': 'round', 'stroke-dasharray': c,
      'stroke-dashoffset': c * (1 - Math.max(0, Math.min(100, pct)) / 100),
      transform: 'rotate(-90 ' + (size / 2) + ' ' + (size / 2) + ')',
      style: 'transition: stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)'
    }));
    if (opts.label !== false) {
      g.appendChild(svg('text', {
        x: size / 2, y: size / 2 + 4, 'text-anchor': 'middle',
        'font-size': opts.fontSize || 13, 'font-weight': '700',
        fill: col, 'font-family': 'var(--mono)'
      }, opts.text !== undefined ? opts.text : Math.round(pct)));
    }
    return g;
  }

  /* Carte métrique avec anneau */
  function metric(value, label, pct, color) {
    return el('div', { class: 'metric' }, [
      ring(pct === undefined ? 0 : pct, { size: 48, width: 5, color: color, label: false }),
      el('div', {}, [
        el('div', { class: 'mv', text: value, style: color ? { color: color } : {} }),
        el('div', { class: 'ml', text: label })
      ])
    ]);
  }

  /* Tuile de module compacte */
  function modTile(icon, title, desc, onClick) {
    return el('div', { class: 'mod-tile', onClick: onClick }, [
      el('div', { class: 'mi', text: icon }),
      el('div', { style: { minWidth: 0 } }, [
        el('div', { class: 'mt', text: title }),
        el('div', { class: 'md', text: desc })
      ]),
      el('span', { class: 'arrow', text: '›' })
    ]);
  }

  function empty(icon, text) {
    return el('div', { class: 'empty' }, [
      el('span', { class: 'ei', text: icon }),
      el('span', { html: text })
    ]);
  }

  /* Carte de chaleur d'activité — une case par jour, semaines en colonnes.
     `days` vient de Store.activity(n) : { key, date, total, level, … } */
  var HEAT_COLORS = [
    'var(--surface-3)',
    'color-mix(in srgb, var(--accent) 30%, var(--surface-3))',
    'color-mix(in srgb, var(--accent) 55%, var(--surface-3))',
    'color-mix(in srgb, var(--accent) 78%, var(--surface-3))',
    'var(--accent)'
  ];
  var MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

  function heatmap(days, opts) {
    opts = opts || {};
    var cell = opts.cell || 13, gap = 3, pitch = cell + gap;
    var padL = 26, padT = 16;
    // lundi en première ligne
    var rowOf = function (d) { return (d.getDay() + 6) % 7; };
    var first = rowOf(days[0].date);
    var cols = Math.ceil((days.length + first) / 7);
    var w = padL + cols * pitch, h = padT + 7 * pitch;

    var g = svg('svg', {
      viewBox: '0 0 ' + w + ' ' + h, width: w, height: h,
      style: 'max-width:100%;height:auto', role: 'img',
      'aria-label': 'Activité des ' + days.length + ' derniers jours'
    });

    ['L', '', 'M', '', 'V', '', 'D'].forEach(function (t, i) {
      if (!t) return;
      g.appendChild(svg('text', {
        x: 0, y: padT + i * pitch + cell - 2, 'font-size': 9, fill: 'var(--txt-3)'
      }, t));
    });

    var lastMonth = -1;
    days.forEach(function (d, i) {
      var idx = i + first;
      var col = Math.floor(idx / 7), row = idx % 7;
      var x = padL + col * pitch, y = padT + row * pitch;

      if (d.date.getMonth() !== lastMonth && d.date.getDate() <= 7) {
        lastMonth = d.date.getMonth();
        g.appendChild(svg('text', { x: x, y: 9, 'font-size': 9, fill: 'var(--txt-3)' }, MONTHS_SHORT[lastMonth]));
      }

      var isToday = i === days.length - 1;
      var rect = svg('rect', {
        x: x, y: y, width: cell, height: cell, rx: 3,
        fill: HEAT_COLORS[d.level],
        stroke: isToday ? 'var(--accent)' : 'var(--line-soft)',
        'stroke-width': isToday ? 1.5 : 1
      });
      var when = d.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      rect.appendChild(svg('title', {}, d.total
        ? when + ' — ' + d.cards + ' fiche' + (d.cards > 1 ? 's' : '') + ', ' + d.quiz + ' QCM, ' +
          (d.sims + d.cases) + ' exercice' + (d.sims + d.cases > 1 ? 's' : '')
        : when + ' — rien'));
      if (opts.onPick) rect.addEventListener('click', function () { opts.onPick(d); });
      g.appendChild(rect);
    });

    var wrap = el('div', { style: { overflowX: 'auto' } }, g);
    if (opts.legend === false) return wrap;

    var legend = el('div', {
      class: 'flex', style: { gap: '6px', marginTop: '8px', fontSize: '11px', color: 'var(--txt-3)' }
    }, [el('span', { text: 'Moins' })]
      .concat(HEAT_COLORS.map(function (c) {
        return el('i', { style: { width: '11px', height: '11px', borderRadius: '3px', background: c, border: '1px solid var(--line-soft)' } });
      }))
      .concat([el('span', { text: 'Plus' })]));
    return el('div', {}, [wrap, legend]);
  }

  function bar(pct, color) {
    return el('div', { class: 'bar' }, el('i', { style: { width: Math.max(0, Math.min(100, pct)) + '%', background: color || 'var(--accent)' } }));
  }

  /* ---- Raccourcis clavier d'un écran ----
     `map` : { 'a': fn, ' ': fn, 'ArrowRight': fn }. Les touches sont ignorées
     quand on saisit du texte ou qu'une modale est ouverte, et l'écouteur se
     retire tout seul dès que `node` quitte le DOM (changement de module). */
  function hotkeys(node, map) {
    function onKey(e) {
      if (!node.isConnected) { document.removeEventListener('keydown', onKey); return; }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      // une modale ouverte a la priorité, sauf si l'écran est justement dedans
      var modal = document.getElementById('modal');
      if (modal && modal.classList.contains('on') && !modal.contains(node)) return;
      var fn = map[e.key] || map[e.key.toLowerCase()];
      if (!fn) return;
      e.preventDefault();
      fn(e);
    }
    document.addEventListener('keydown', onKey);
    return function () { document.removeEventListener('keydown', onKey); };
  }

  /* Bandeau discret listant les raccourcis d'un écran */
  function keyhint(pairs) {
    return el('div', { class: 'keyhint' }, pairs.map(function (p) {
      return el('span', {}, [el('kbd', { text: p[0] }), el('span', { text: ' ' + p[1] })]);
    }));
  }

  /* ---- Drag helper (souris + pointeur) ---- */
  function draggable(node, onMove, onEnd) {
    node.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;   // clic droit / molette : pas un glisser
      e.preventDefault();
      node.setPointerCapture(e.pointerId);
      var start = { x: e.clientX, y: e.clientY };
      function mv(ev) { onMove(ev.clientX - start.x, ev.clientY - start.y, ev); }
      function up(ev) {
        node.removeEventListener('pointermove', mv);
        node.removeEventListener('pointerup', up);
        node.removeEventListener('pointercancel', up);
        try { node.releasePointerCapture(e.pointerId); } catch (err) { /* déjà relâché */ }
        if (onEnd) onEnd(ev);
      }
      node.addEventListener('pointermove', mv);
      node.addEventListener('pointerup', up);
      // le glisser doit s'arrêter proprement si le navigateur reprend le pointeur
      node.addEventListener('pointercancel', up);
    });
  }

  /* ---- Molette / drag vertical pour molettes de phoroptere ---- */
  function knob(opts) {
    // opts: {value, min, max, step, label, format, onChange}
    var value = opts.value;
    var valNode = el('div', { class: 'val' });
    var tick = el('div', { class: 'dial-tick' });
    var dial = el('div', {
      class: 'dial', role: 'slider', tabindex: '0',
      'aria-label': opts.label || 'Molette',
      'aria-valuemin': opts.min, 'aria-valuemax': opts.max
    }, [tick, valNode]);
    var wrap = el('div', { class: 'dial-wrap' }, [
      dial,
      el('div', { class: 'lbl', text: opts.label })
    ]);

    function render() {
      var txt = opts.format ? opts.format(value) : String(value);
      valNode.textContent = txt;
      dial.setAttribute('aria-valuenow', value);
      dial.setAttribute('aria-valuetext', txt);
      var span = (opts.max - opts.min) || 1;
      var ang = ((value - opts.min) / span) * 300 - 150;
      tick.style.transform = 'rotate(' + ang + 'deg)';
      tick.style.transformOrigin = '50% 45px';
    }

    function setValue(v, silent) {
      var nv = Math.min(opts.max, Math.max(opts.min, Math.round(v / opts.step) * opts.step));
      nv = parseFloat(nv.toFixed(4));
      if (nv === value) return;
      value = nv;
      render();
      if (!silent && opts.onChange) opts.onChange(value);
    }

    var acc = 0;
    draggable(dial, function (dx, dy) {
      acc = -dy;
      var steps = Math.round(acc / 8);
      if (steps !== 0) {
        setValue(value + steps * opts.step);
        acc = 0;
      }
    });
    dial.addEventListener('wheel', function (e) {
      e.preventDefault();
      setValue(value + (e.deltaY < 0 ? opts.step : -opts.step));
    }, { passive: false });

    /* la molette se règle aussi au clavier : indispensable pour un réglage fin */
    dial.addEventListener('keydown', function (e) {
      var big = (opts.max - opts.min) / 10;
      var d = 0;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') d = opts.step;
      else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') d = -opts.step;
      else if (e.key === 'PageUp') d = Math.max(opts.step, Math.round(big / opts.step) * opts.step);
      else if (e.key === 'PageDown') d = -Math.max(opts.step, Math.round(big / opts.step) * opts.step);
      else if (e.key === 'Home') { e.preventDefault(); setValue(opts.min); return; }
      else if (e.key === 'End') { e.preventDefault(); setValue(opts.max); return; }
      else return;
      e.preventDefault();
      setValue(value + d);
    });

    render();
    wrap.getValue = function () { return value; };
    wrap.setValue = function (v) { setValue(v, true); render(); };
    wrap.setValueLoud = setValue;
    return wrap;
  }

  window.UI = {
    el: el, svg: svg, clear: clear, toast: toast, copy: copy, download: download,
    page: page, card: card, field: field, num: num, select: select, range: range,
    tabs: tabs, accordion: accordion, table: table, kv: kv, note: note, chip: chip,
    btn: btn, stat: stat, bar: bar, draggable: draggable, knob: knob, clickable: clickable,
    hotkeys: hotkeys, keyhint: keyhint,
    ring: ring, metric: metric, modTile: modTile, empty: empty, heatmap: heatmap
  };
})();
