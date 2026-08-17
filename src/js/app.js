/* ============================================================
   OrthoStudent — noyau applicatif : navigation, recherche, IPC
   ============================================================ */
(function () {
  'use strict';
  var el = UI.el;
  var M = window.Modules;

  var NAV = [
    { group: 'Général', items: ['home', 'studies', 'help'] },
    { group: 'Révision', items: ['flashcards', 'quiz', 'exam', 'progress'] },
    { group: 'Mise en situation', items: ['patient', 'rehab'] },
    { group: 'Simulateurs', items: ['phoropter', 'skiascopy', 'acuity', 'covertest', 'prism', 'motility', 'lancaster', 'binocular', 'ppc', 'fundus', 'colorvision', 'fields'] },
    { group: 'Outils', items: ['converters'] },
    { group: 'Savoir', items: ['theory', 'anatomy', 'glossary'] }
  ];

  var ALIASES = { disclaimer: 'help' };

  var current = 'home';
  var view = document.getElementById('view');
  var navRoot = document.getElementById('nav');

  /* ---------------- Navigation ---------------- */

  function buildNav() {
    UI.clear(navRoot);
    NAV.forEach(function (g) {
      navRoot.appendChild(el('div', { class: 'nav-group-label', text: g.group }));
      g.items.forEach(function (id) {
        var mod = M[id];
        if (!mod) return;
        var badge = null;
        if (id === 'flashcards') {
          var due = Store.dueCards(Cards.all().map(function (c) { return c.id; })).length;
          if (due) badge = el('span', { class: 'nav-badge', text: String(due) });
        }
        if (id === 'patient') {
          badge = el('span', { class: 'nav-badge', text: Store.stats().casesDone + '/' + CASES.length });
        }
        var active = id === current;
        navRoot.appendChild(el('div', {
          class: 'nav-item' + (active ? ' active' : ''),
          role: 'button',
          tabindex: '0',
          'aria-current': active ? 'page' : null,
          title: mod.desc || mod.title,
          dataset: { id: id, kw: (mod.title + ' ' + (mod.keywords || '')).toLowerCase() },
          onClick: function () { go(id); },
          onKeydown: function (e) {
            // Entrée / Espace sont pris en charge par UI.el
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); moveNavFocus(e.currentTarget, e.key === 'ArrowDown' ? 1 : -1); }
          }
        }, [
          el('span', { class: 'ic', text: mod.icon || '•', 'aria-hidden': 'true' }),
          el('span', { text: mod.title }),
          badge
        ]));
      });
    });
    updateFoot();
  }

  /* déplacement au clavier entre les entrées visibles de la barre latérale */
  function moveNavFocus(from, dir) {
    var items = [].slice.call(navRoot.querySelectorAll('.nav-item')).filter(function (n) {
      return n.style.display !== 'none';
    });
    var i = items.indexOf(from);
    if (i < 0) return;
    var next = items[(i + dir + items.length) % items.length];
    next.focus();
    next.scrollIntoView({ block: 'nearest' });
  }

  function updateFoot() {
    var s = Store.stats();
    document.getElementById('footStat').textContent = s.simAvg + ' % · ' + s.quizSeen + ' QCM';
  }

  /* ---------------- Historique de navigation ---------------- */

  var hist = [];        // { id, params }
  var hIndex = -1;      // position courante dans hist
  var replaying = false; // vrai pendant un retour / une avance
  var backBtn = document.getElementById('backBtn');
  var fwdBtn = document.getElementById('fwdBtn');

  function sameEntry(a, b) {
    if (!a || !b || a.id !== b.id) return false;
    try { return JSON.stringify(a.params || {}) === JSON.stringify(b.params || {}); }
    catch (e) { return false; }
  }

  function pushHistory(entry) {
    if (sameEntry(entry, hist[hIndex])) { hist[hIndex] = entry; return; }
    hist = hist.slice(0, hIndex + 1);
    hist.push(entry);
    if (hist.length > 60) hist.shift();
    hIndex = hist.length - 1;
  }

  function updateHistoryButtons() {
    if (backBtn) backBtn.disabled = hIndex <= 0;
    if (fwdBtn) fwdBtn.disabled = hIndex >= hist.length - 1;
  }

  function back() {
    if (hIndex <= 0) return;
    hIndex--;
    replay();
  }

  function forward() {
    if (hIndex >= hist.length - 1) return;
    hIndex++;
    replay();
  }

  function replay() {
    var e = hist[hIndex];
    replaying = true;
    try { go(e.id, e.params); } finally { replaying = false; }
    updateHistoryButtons();
  }

  /* modules récemment consultés, du plus récent au plus ancien */
  function recentModules(limit) {
    var seen = {}, out = [];
    for (var i = hIndex; i >= 0 && out.length < (limit || 6); i--) {
      var id = hist[i].id;
      if (seen[id] || id === current) continue;
      seen[id] = true;
      out.push(id);
    }
    return out;
  }

  function go(id, params) {
    id = ALIASES[id] || id;
    var mod = M[id];
    if (!mod) { UI.toast('Module introuvable : ' + id); return; }
    if (!replaying) pushHistory({ id: id, params: params || {} });
    current = id;
    UI.clear(view);
    try {
      view.appendChild(mod.render({ params: params || {}, go: go }));
    } catch (e) {
      console.error(e);
      view.appendChild(UI.page({ title: 'Erreur dans le module « ' + mod.title + ' »' }, [
        UI.card('Détail technique', [
          el('pre', { class: 'mono small selectable', style: { whiteSpace: 'pre-wrap' }, text: (e && e.stack) || String(e) }),
          UI.btn('Retour à l’accueil', function () { go('home'); }, 'primary')
        ])
      ]));
    }
    document.getElementById('main').scrollTop = 0;
    navRoot.querySelectorAll('.nav-item').forEach(function (n) {
      var on = n.dataset.id === id;
      n.classList.toggle('active', on);
      if (on) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current');
    });
    updateFoot();
    updateHistoryButtons();
  }

  /* ---------------- Filtre latéral ---------------- */

  var navFilter = document.getElementById('navFilter');

  function applyNavFilter() {
    var q = navFilter.value.toLowerCase().trim();
    navRoot.querySelectorAll('.nav-item').forEach(function (n) {
      n.style.display = !q || n.dataset.kw.indexOf(q) >= 0 ? '' : 'none';
    });
    navRoot.querySelectorAll('.nav-group-label').forEach(function (label) {
      var next = label.nextElementSibling, any = false;
      while (next && next.classList.contains('nav-item')) {
        if (next.style.display !== 'none') any = true;
        next = next.nextElementSibling;
      }
      label.style.display = any ? '' : 'none';
    });
  }

  navFilter.addEventListener('input', applyNavFilter);
  navFilter.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navFilter.value) {
      e.preventDefault(); e.stopPropagation();
      navFilter.value = '';
      applyNavFilter();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      var first = [].slice.call(navRoot.querySelectorAll('.nav-item')).filter(function (n) { return n.style.display !== 'none'; })[0];
      if (!first) return;
      e.preventDefault();
      if (e.key === 'Enter') go(first.dataset.id); else first.focus();
    }
  });

  /* ---------------- Recherche rapide ---------------- */

  var overlay = document.getElementById('overlay');
  var searchInput = document.getElementById('searchInput');
  var searchRes = document.getElementById('searchRes');
  var hlIndex = 0, hits = [];
  var searchReturnFocus = null;

  /* normalisation 1 caractère → 1 caractère : les indices restent valables
     pour surligner la correspondance dans le texte d'origine */
  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function normKeepLength(s) {
    s = String(s || '');
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = norm(s.charAt(i));
      out += c.length === 1 ? c : (c.charAt(0) || ' ');
    }
    return out;
  }

  function tokens(q) {
    return norm(String(q || '').trim()).split(/\s+/).filter(Boolean);
  }

  /* poids par nature de résultat : les outils passent devant le contenu */
  var CAT_BOOST = { module: 55, cas: 24, ue: 22, cours: 16, glossaire: 12, fiche: 4, qcm: 0 };

  function entry(kind, cat, title, desc, keywords, blob, act) {
    return {
      kind: kind, cat: cat, t: title, d: desc, act: act,
      nt: normKeepLength(title),
      nk: norm(keywords || ''),
      s: norm(title + ' ' + (keywords || '') + ' ' + (blob || ''))
    };
  }

  function buildIndex() {
    var idx = [];

    Object.keys(M).forEach(function (id) {
      idx.push(entry('module', M[id].group || 'Module', M[id].title, M[id].desc || '',
        M[id].keywords || '', M[id].desc || '', function () { go(id); }));
    });

    GLOSSARY.forEach(function (g) {
      idx.push(entry('glossaire', 'Glossaire · ' + g.c, g.t, g.d, '', g.d,
        function () { go('glossary', { term: g.t }); }));
    });

    THEORY.forEach(function (ch) {
      ch.sections.forEach(function (sec) {
        var plain = sec.html.replace(/<[^>]+>/g, ' ');
        idx.push(entry('cours', 'Cours · ' + ch.title, sec.title, ch.intro, ch.title, plain,
          function () { go('theory', { chapter: ch.id, section: sec.title }); }));
      });
    });

    CASES.forEach(function (c) {
      idx.push(entry('cas', 'Cas clinique', c.name + ', ' + c.age + ' ans', c.motif, c.tags.join(' '), c.motif,
        function () { M.patient.startCase(c.id); go('patient'); }));
    });

    /* les UE du référentiel : on cherche « UE11 », « bilan orthoptique »
       ou même une notion de la fiche (« Kestenbaum ») */
    (window.CURRICULUM || []).forEach(function (sem) {
      sem.ues.forEach(function (u) {
        if (u.code === 'UE6' || u.code === 'UE libre') return;   // anglais et libre : rien à indexer
        var g = (window.UE_GUIDE || {})[u.code];
        var blob = g ? (g.objectifs.join(' ') + ' ' + g.notions.join(' ') + ' ' + g.pieges.join(' ')).replace(/<[^>]+>/g, ' ') : '';
        idx.push(entry('ue', 'Programme · ' + sem.id, u.code + ' — ' + u.title,
          g ? g.objectifs[0] : u.ects + ' ECTS · ' + u.h + ' h',
          u.code + ' ' + sem.id + ' ' + sem.label, blob,
          function () { go('studies', { sem: sem.id, ue: u.code }); }));
      });
    });

    (window.QUIZ || []).forEach(function (q) {
      idx.push(entry('qcm', 'QCM · ' + q.cat, q.q, q.exp || '', q.cat, (q.opts || []).join(' ') + ' ' + (q.exp || ''),
        function () { go('quiz', { qid: q.id }); }));
    });

    Cards.all().forEach(function (c) {
      idx.push(entry('fiche', 'Fiche mémo · ' + c.deck, c.f, c.b, c.deck, c.b,
        function () { go('flashcards', { cardId: c.id }); }));
    });

    return idx;
  }

  var INDEX = null;
  var INDEX_SIG = null;

  function indexSignature() {
    return Cards.custom().length + '/' + (window.QUIZ || []).length + '/' + CASES.length +
           '/' + (window.CURRICULUM || []).length;
  }

  function ensureIndex() {
    var sig = indexSignature();
    if (!INDEX || sig !== INDEX_SIG) { INDEX = buildIndex(); INDEX_SIG = sig; }
    return INDEX;
  }

  /* score d'une entrée : tous les mots doivent correspondre, un mot trouvé
     dans le titre pèse plus lourd que dans le corps du texte */
  function score(item, toks) {
    var total = 0;
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i], s = 0;
      var ti = item.nt.indexOf(t);
      if (ti === 0) s = 120;
      else if (ti > 0) s = item.nt.charAt(ti - 1) === ' ' ? 80 : 50;
      else if (item.nk.indexOf(t) >= 0) s = 34;
      else if (item.s.indexOf(t) >= 0) s = 14;
      else return -1;
      total += s;
    }
    return total + (CAT_BOOST[item.kind] || 0) - Math.min(20, item.t.length / 8);
  }

  /* surligne dans le titre les portions correspondant à la requête */
  function highlight(text, toks) {
    var frag = document.createDocumentFragment();
    if (!toks.length) { frag.appendChild(document.createTextNode(text)); return frag; }
    var n = normKeepLength(text);
    var marks = new Array(text.length);
    toks.forEach(function (t) {
      var from = 0, i;
      while ((i = n.indexOf(t, from)) >= 0) {
        for (var k = i; k < i + t.length; k++) marks[k] = true;
        from = i + t.length;
      }
    });
    var buf = '', on = false;
    function flush() {
      if (!buf) return;
      frag.appendChild(on ? el('mark', { text: buf }) : document.createTextNode(buf));
      buf = '';
    }
    for (var i = 0; i < text.length; i++) {
      var m = !!marks[i];
      if (m !== on) { flush(); on = m; }
      buf += text.charAt(i);
    }
    flush();
    return frag;
  }

  function openSearch() {
    ensureIndex();
    searchReturnFocus = document.activeElement;
    overlay.classList.add('on');
    searchInput.value = '';
    searchInput.focus();
    renderSearch('');
  }

  function closeSearch() {
    if (!overlay.classList.contains('on')) return;
    overlay.classList.remove('on');
    if (searchReturnFocus && document.contains(searchReturnFocus)) searchReturnFocus.focus();
    searchReturnFocus = null;
  }

  function defaultHits() {
    var recents = recentModules(5).map(function (id) {
      return { kind: 'module', cat: 'Récent', t: M[id].title, d: M[id].desc || '', act: function () { go(id); } };
    });
    var rest = INDEX.filter(function (i) {
      return i.kind === 'module' && recents.every(function (r) { return r.t !== i.t; });
    }).slice(0, 12 - recents.length);
    return recents.concat(rest);
  }

  /* Une saisie qui « ressemble à un calcul » (5/10, 12 delta, 45 ans…)
     donne son résultat directement en tête de liste. */
  function calcHit(q) {
    var c = M.converters && M.converters.quickCalc ? M.converters.quickCalc(q) : null;
    if (!c) return null;
    return {
      kind: 'calc', cat: 'Calcul instantané', t: c.title, d: '', calc: c,
      act: function () { go('converters', { calc: c.calc }); }
    };
  }

  function renderSearch(q) {
    UI.clear(searchRes);
    var toks = tokens(q);
    if (!toks.length) {
      hits = defaultHits();
    } else {
      hits = INDEX.map(function (i) { return { i: i, sc: score(i, toks) }; })
        .filter(function (x) { return x.sc >= 0; })
        .sort(function (a, b) { return b.sc - a.sc; })
        .slice(0, 40)
        .map(function (x) { return x.i; });
      var c = calcHit(q);
      if (c) hits.unshift(c);
    }
    hlIndex = 0;
    hits.forEach(function (h, i) {
      var title = el('div', { class: 't' });
      title.appendChild(highlight(h.t, toks));
      searchRes.appendChild(el('div', {
        class: 'search-item' + (i === 0 ? ' hl' : '') + (h.calc ? ' calc' : ''),
        role: 'option',
        tabindex: '-1',            // la sélection reste pilotée depuis le champ
        id: 'search-opt-' + i,
        'aria-selected': i === 0 ? 'true' : 'false',
        onClick: function () { closeSearch(); h.act(); }
      }, [
        el('div', { class: 'cat', text: h.cat }),
        title,
        h.calc
          ? el('div', {}, [
              el('div', { class: 'calc-rows' }, h.calc.rows.map(function (r) {
                return el('div', { class: 'calc-row' }, [
                  el('span', { class: 'k', text: r[0] }),
                  el('span', { class: 'v mono', text: r[1] })
                ]);
              })),
              // le détail du calcul : formule appliquée aux valeurs saisies
              h.calc.steps && h.calc.steps.length
                ? el('div', { class: 'calc-steps' }, h.calc.steps.map(function (st) {
                    var f = (window.FORMULAS || {})[st[0]] || {};
                    return el('div', { class: 'calc-step-mini' }, [
                      el('span', { class: 'n mono', html: st[1] }),
                      f.t ? el('span', { class: 'w', text: f.t }) : null
                    ].filter(Boolean));
                  }))
                : null,
              el('div', { class: 'calc-more', text: '↩ ouvrir la calculatrice pour le raisonnement complet' })
            ].filter(Boolean))
          : el('div', { class: 'd', text: h.d })
      ]));
    });
    if (!hits.length) {
      searchRes.appendChild(el('div', { class: 'search-item' }, el('div', { class: 'd', text: 'Aucun résultat.' })));
    }
    searchInput.setAttribute('aria-activedescendant', hits.length ? 'search-opt-0' : '');
  }

  function moveSearchHl(dir) {
    var items = searchRes.querySelectorAll('.search-item');
    if (!items.length || !hits.length) return;
    items[hlIndex].classList.remove('hl');
    items[hlIndex].setAttribute('aria-selected', 'false');
    hlIndex = (hlIndex + dir + items.length) % items.length;
    items[hlIndex].classList.add('hl');
    items[hlIndex].setAttribute('aria-selected', 'true');
    items[hlIndex].scrollIntoView({ block: 'nearest' });
    searchInput.setAttribute('aria-activedescendant', 'search-opt-' + hlIndex);
  }

  searchInput.addEventListener('input', function () { renderSearch(searchInput.value); });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSearch(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); moveSearchHl(e.key === 'ArrowDown' ? 1 : -1); return; }
    if (e.key === 'Home' && hits.length) { e.preventDefault(); moveSearchHl(-hlIndex); return; }
    if (e.key === 'Enter' && hits[hlIndex]) { closeSearch(); hits[hlIndex].act(); }
  });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });

  /* ---------------- Modale simulateur ---------------- */

  var modal = document.getElementById('modal');
  var modalBody = document.getElementById('modalBody');
  var modalPanel = modal.querySelector('.modal-panel');
  var modalReturnFocus = null;

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
                  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function focusables(root) {
    return [].slice.call(root.querySelectorAll(FOCUSABLE)).filter(function (n) {
      return n.offsetParent !== null || n === document.activeElement;
    });
  }

  function openModule(id, params, opts) {
    id = ALIASES[id] || id;
    var mod = M[id];
    if (!mod) { UI.toast('Module introuvable : ' + id); return; }
    opts = opts || {};
    modalReturnFocus = document.activeElement;
    document.getElementById('modalTitle').textContent = (mod.icon || '') + '  ' + mod.title;
    document.getElementById('modalSub').textContent = opts.subtitle || mod.desc || '';
    UI.clear(modalBody);
    if (opts.banner) modalBody.appendChild(el('div', { class: 'modal-banner', html: opts.banner }));
    try {
      var node = mod.render({ params: params || {}, embedded: true, go: go });
      // le titre est déjà dans l'en-tête de la modale
      var head = node.querySelector ? node.querySelector('.page-head') : null;
      if (head) head.style.display = 'none';
      modalBody.appendChild(node);
    } catch (e) {
      console.error(e);
      modalBody.appendChild(el('div', { class: 'page' }, [
        el('h2', { text: 'Erreur dans le module' }),
        el('pre', { class: 'mono small selectable', style: { whiteSpace: 'pre-wrap' }, text: (e && e.stack) || String(e) })
      ]));
    }
    modal.classList.add('on');
    modalBody.scrollTop = 0;
    modalPanel.focus();
  }

  function closeModule() {
    if (!modal.classList.contains('on')) return;
    modal.classList.remove('on');
    UI.clear(modalBody);
    if (modalReturnFocus && document.contains(modalReturnFocus)) modalReturnFocus.focus();
    modalReturnFocus = null;
    if (typeof closeModule._after === 'function') { var f = closeModule._after; closeModule._after = null; f(); }
  }

  /* le clavier ne doit pas sortir de la modale tant qu'elle est ouverte */
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = focusables(modalPanel);
    if (!f.length) { e.preventDefault(); modalPanel.focus(); return; }
    var first = f[0], last = f[f.length - 1];
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && (document.activeElement === first || document.activeElement === modalPanel)) { e.preventDefault(); last.focus(); }
  });

  document.getElementById('modalClose').addEventListener('click', closeModule);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModule(); });

  /* ---------------- Thème ---------------- */

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    Store.state.theme = t;
    Store.save();
  }
  function toggleTheme() {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  /* ---------------- Import / export ---------------- */

  function exportData() {
    if (!window.ortho) { UI.toast('Export disponible uniquement dans l’application desktop.'); return; }
    window.ortho.exportData(Store.serialize()).then(function (r) {
      if (r && r.ok) UI.toast('Progression exportée.');
    });
  }

  function importData() {
    if (!window.ortho) { UI.toast('Import disponible uniquement dans l’application desktop.'); return; }
    window.ortho.importData().then(function (r) {
      if (!r || !r.ok) return;
      try {
        var parsed = JSON.parse(r.data);
        Store.replace(parsed.data || parsed);
        setTheme(Store.state.theme || 'dark');
        INDEX = null;
        buildNav();
        go('progress');
        UI.toast('Progression importée.');
      } catch (e) {
        UI.toast('Fichier illisible.');
      }
    });
  }

  /* ---------------- Raccourcis globaux ---------------- */

  document.addEventListener('keydown', function (e) {
    var meta = e.ctrlKey || e.metaKey;
    if (meta && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); return; }
    if (e.key === 'Escape' && overlay.classList.contains('on')) { closeSearch(); return; }
    if (e.key === 'Escape' && modal.classList.contains('on')) { closeModule(); return; }
    if (modal.classList.contains('on') || overlay.classList.contains('on')) return;
    if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); back(); return; }
    if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); forward(); return; }
    if (meta && e.key.toLowerCase() === 'd') { e.preventDefault(); toggleTheme(); return; }
    if (meta && ['1', '2', '3', '4', '5'].indexOf(e.key) >= 0) {
      e.preventDefault();
      go(['home', 'phoropter', 'covertest', 'patient', 'converters'][parseInt(e.key, 10) - 1]);
    }
  });

  /* boutons latéraux de la souris (précédent / suivant) */
  document.addEventListener('mouseup', function (e) {
    if (e.button === 3) { e.preventDefault(); back(); }
    else if (e.button === 4) { e.preventDefault(); forward(); }
  });

  if (backBtn) backBtn.addEventListener('click', back);
  if (fwdBtn) fwdBtn.addEventListener('click', forward);

  /* ---------------- Menu Electron ---------------- */

  if (window.ortho) {
    window.ortho.on('menu:export', exportData);
    window.ortho.on('menu:import', importData);
    window.ortho.on('menu:theme', toggleTheme);
    window.ortho.on('menu:search', openSearch);
    window.ortho.on('menu:goto', function (id) { go(id); });
    window.ortho.on('menu:back', back);
    window.ortho.on('menu:forward', forward);
    window.ortho.on('menu:reset', function () {
      Store.reset(); setTheme('dark'); INDEX = null; buildNav(); go('home'); UI.toast('Progression réinitialisée.');
    });
  }

  /* ---------------- API globale ---------------- */

  window.App = {
    go: go,
    back: back,
    forward: forward,
    openModule: openModule,
    closeModule: closeModule,
    exportData: exportData,
    importData: importData,
    openSearch: openSearch,
    toggleTheme: toggleTheme,
    refreshNav: buildNav,
    refreshSearchIndex: function () { INDEX = null; }
  };

  /* ---------------- Démarrage ---------------- */

  Store.load();
  setTheme(Store.state.theme || 'dark');
  buildNav();
  go('home');
})();
