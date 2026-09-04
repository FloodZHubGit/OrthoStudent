/* ============================================================
   OrthoStudent — noyau applicatif : navigation, recherche, IPC
   ============================================================ */
(function () {
  'use strict';
  var el = UI.el;
  var M = window.Modules;

  /* L'ordre est celui de l'apprentissage, pas celui du code : on révise une UE,
     on récite ce qu'elle contient, on pose ses calculs, et l'on relit le cours
     quand il manque quelque chose. Le reste — mise en situation, simulateurs,
     outils — vient après, et les références se consultent au besoin. */
  /* « Mes UE » n'est pas une entrée parmi d'autres : c'est le programme de
     l'étudiant, donc le point de départ de toute révision. Elle est sortie de
     la liste et affichée en tête, avec l'état du semestre en cours. Le reste
     tient en trois groupes courts : ce qu'on fait chaque jour, la pratique,
     et ce qu'on ouvre pour une question précise. */
  var HERO = 'studies';

  var NAV = [
    /* « Séance du jour » n'a pas d'entrée : son plan est rendu sur l'accueil.
       Deux entrées pour la même question — que faire maintenant ? — obligeaient
       à choisir entre deux écrans qui se répondaient l'un l'autre. Le module
       garde sa page, atteignable depuis l'accueil et depuis la recherche. */
    { group: 'Mon travail', items: ['home', 'chat', 'edt', 'flashcards', 'revise', 'progress'] },
    /* « Lecture de bilan » avant « Mode patient » : c'est le plus court des
       deux, celui par lequel le guide fait entrer, et celui que Ctrl+2
       ouvre. La consultation vient après, elle demande de choisir. */
    { group: 'Pratiquer', items: ['reading', 'patient', 'rehab', 'atelier', 'vision'] },
    { group: 'Références', items: ['converters', 'anatomy', 'glossary', 'help'] }
  ];

  /* certains points d'entrée (menu Aide) visent une section précise d'un module */
  var ALIASES = {
    disclaimer: { id: 'help', params: { tab: 'limits' } },
    muscles: { id: 'anatomy', params: { tab: 'actions' } }
  };

  /* Exercices notés qui ne sont pas des modules : les cas d'application d'une
     UE sont rendus par « Mes UE » mais gardent leur propre note. Les nommer
     ici évite que chaque écran de statistiques les oublie chacun à sa façon. */
  var EXTRA_SCORED = { 'ue-cas': '🎓  Cas d’application d’UE' };

  /* Comment nommer un identifiant noté — null s'il ne correspond plus à rien,
     ce qui arrive avec les notes d'un module retiré. */
  function scoredLabel(id) {
    if (M[id]) return (M[id].icon || '') + '  ' + M[id].title;
    return EXTRA_SCORED[id] || null;
  }

  function resolve(id, params) {
    var a = ALIASES[id];
    if (!a) return { id: id, params: params || {} };
    if (typeof a === 'string') return { id: a, params: params || {} };
    return { id: a.id, params: Object.assign({}, a.params, params || {}) };
  }

  /* Certaines entrées de la barre en hébergent d'autres (« Réviser » contient
     l'atelier de calcul et le cours) : ouvrir un module hébergé
     par un lien direct doit allumer l'entrée qui le contient. */
  function navHolds(navId, id) {
    if (navId === id) return true;
    var mod = M[navId];
    return !!(mod && mod.children && mod.children.indexOf(id) >= 0);
  }

  var current = 'home';
  var view = document.getElementById('view');
  var navRoot = document.getElementById('nav');

  /* ---------------- Navigation ---------------- */

  /* L'entrée de tête : le programme de l'étudiant, avec l'état du semestre.
     Elle n'est pas une ligne de plus dans la liste — c'est le point de départ. */
  function navHero() {
    var mod = M[HERO];
    if (!mod) return null;
    var semId = Store.state.profile.semester;
    var sem = semId ? (window.CURRICULUM || []).filter(function (x) { return x.id === semId; })[0] : null;
    var ready = null, left = null;
    if (sem && M.studies && M.studies.readiness) {
      try { ready = M.studies.readiness(sem.id); left = M.studies.daysToExam(sem.id); } catch (e) { ready = null; }
    }
    var sub = sem
      ? sem.label + ' · ' + sem.ues.length + ' UE' + (left === null || left < 0 ? '' : ' · J−' + left)
      : 'Choisir mon semestre';
    return el('div', {
      class: 'nav-hero' + (navHolds(HERO, current) ? ' active' : ''),
      title: mod.desc || mod.title,
      dataset: { id: HERO, kw: (mod.title + ' ' + (mod.keywords || '')).toLowerCase() },
      onClick: function () { go(HERO); }
    }, [
      el('span', { class: 'nh-ic', text: mod.icon || '🎓', 'aria-hidden': 'true' }),
      el('span', { class: 'nh-txt' }, [
        el('span', { class: 'nh-t', text: mod.title }),
        el('span', { class: 'nh-s', text: sub })
      ]),
      ready === null ? null : el('span', { class: 'nh-pct', text: ready + ' %' })
    ].filter(Boolean));
  }

  function buildNav() {
    UI.clear(navRoot);
    var hero = navHero();
    if (hero) navRoot.appendChild(hero);
    NAV.forEach(function (g) {
      navRoot.appendChild(el('div', { class: 'nav-group-label', text: g.group }));
      g.items.forEach(function (id) {
        var mod = M[id];
        if (!mod) return;
        var badge = null;
        /* Le retard de fiches se compte en centaines dès qu'on importe un
           paquet : une pastille « 341 » n'apprend rien qu'un « 99+ » ne dise
           déjà, et décourage au lieu d'appeler. */
        if (id === 'revise') {
          var due = Store.dueCards(Cards.all().map(function (c) { return c.id; })).length;
          if (due) badge = el('span', {
            class: 'nav-badge', title: due + ' fiche(s) à revoir',
            text: due > 99 ? '99+' : String(due)
          });
        }
        if (id === 'patient') {
          badge = el('span', { class: 'nav-badge', text: Store.stats().casesDone + '/' + CASES.length });
        }
        /* l'emploi du temps ne compte que ce qui reste de la journée :
           un badge qui affiche encore « 3 » à 22 h ne veut plus rien dire */
        if (id === 'edt' && mod.apercu) {
          var ap = mod.apercu();
          if (ap && ap.restant.length) badge = el('span', { class: 'nav-badge', text: String(ap.restant.length) });
        }
        /* la séance du jour se lit sur l'accueil : c'est donc l'accueil
           qui porte le nombre d'étapes restantes */
        if (id === 'home' && M.session && M.session.remaining) {
          var left = M.session.remaining();
          if (left) badge = el('span', { class: 'nav-badge', text: String(left) });
        }
        var active = navHolds(id, current);
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
    document.getElementById('footStat').textContent =
      s.simAvg + ' % · ' + s.cardsMastered + ' item(s) su(s)';
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
    var r = resolve(id, params); id = r.id; params = r.params;
    var mod = M[id];
    if (!mod) { UI.toast('Module introuvable : ' + id); return; }
    if (!replaying) pushHistory({ id: id, params: params || {} });
    /* Un module a pu laisser quelque chose en marche — le répétiteur, une
       génération de texte par le modèle local. On lui rend la main avant de
       remplacer l'écran, sinon elle occupe le processeur pour rien. */
    if (current && M[current] && M[current].leave) {
      try { M[current].leave(); } catch (e) { console.error(e); }
    }
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
    var hero = navRoot.querySelector('.nav-hero');
    if (hero) hero.classList.toggle('active', navHolds(hero.dataset.id, id));
    navRoot.querySelectorAll('.nav-item').forEach(function (n) {
      var on = navHolds(n.dataset.id, id);
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

  /* comparer sans accents ni ligatures, et surligner ce qui a été trouvé :
     core/text.js, partagé avec le glossaire et la récitation d'une UE */
  var norm = Txt.norm, normKeepLength = Txt.keepLength, tokens = Txt.tokens;

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

    /* le schéma des actions se cherche par le nom d'un muscle ou d'une fonction */
    if (window.Optics) {
      var mot = Optics.Motility;
      idx.push(entry('module', 'Références · Anatomie', 'Actions des muscles oculomoteurs',
        'Schéma interactif : chaque muscle et ses actions',
        mot.muscles.map(function (m) { return m.short; }).join(' ') + ' ' +
        mot.actions.map(function (a) { return a.name; }).join(' ') + ' action fonction torsion',
        mot.muscles.map(function (m) { return m.name + ' ' + m.primary + ' ' + m.secondary + ' ' + m.tertiary; }).join(' '),
        function () { go('muscles'); }));
    }

    /* Le Vision Lab : chaque expérience et chaque mode sont atteignables
       directement. Passer par l'accueil du module pour relancer la même
       mesure qu'hier fait trois clics de trop. */
    if (window.Lab && M.vision) {
      Lab.toutes().forEach(function (d) {
        idx.push(entry('module', 'Vision Lab', d.nom, d.court || '',
          'vision lab experience psychophysique mesure ' + (d.ue || []).join(' '),
          (d.mesures || []).join(' '),
          function () { go('vision', { exp: d.id }); }));
        [['demo', 'Démonstration', 'la version courte, pour voir le phénomène'],
         ['mesure', 'Mesure', 'le protocole complet, celui dont le résultat compte']
        ].forEach(function (m) {
          idx.push(entry('module', 'Vision Lab · ' + d.nom, d.nom + ' — ' + m[1], m[2],
            'lancer passation experience ' + m[0], '',
            function () { go('vision', { exp: d.id, mode: m[0] }); }));
        });
      });
      idx.push(entry('module', 'Vision Lab', 'Calibrer l’écran',
        'Taille d’un pixel, distance des yeux, fréquence',
        'calibration ecran carte bancaire degre angle visuel pixel distance hertz',
        '', function () { go('vision', { vue: 'calib' }); }));
    }

    /* les abréviations comptent comme mots-clés : « AC/A », « DVD », « BUT »
       doivent tomber sur l'entrée même quand le titre est en clair */
    GLOSSARY.forEach(function (g) {
      idx.push(entry('glossaire', 'Glossaire · ' + g.c, g.t, g.n || g.d, g.a || '',
        g.d + ' ' + (g.n || '') + ' ' + (g.v || []).join(' '),
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
        if (u.code === 'UE06' || u.code === 'UE libre') return;  // anglais et libre : rien à indexer
        var g = (window.UE_GUIDE || {})[u.code];
        var blob = g ? (g.objectifs.join(' ') + ' ' + g.notions.join(' ') + ' ' + g.pieges.join(' ')).replace(/<[^>]+>/g, ' ') : '';
        idx.push(entry('ue', 'Programme · ' + sem.id, u.code + ' — ' + u.title,
          g ? g.objectifs[0] : u.ects + ' ECTS · ' + u.h + ' h',
          u.code + ' ' + sem.id + ' ' + sem.label, blob,
          function () { go('studies', { sem: sem.id, ue: u.code }); }));
      });
    });

    Cards.all().forEach(function (c) {
      idx.push(entry('fiche', 'Fiche mémo · ' + c.deck, c.f, c.b, c.deck, c.b,
        function () { go('flashcards', { cardId: c.id }); }));
    });

    /* Les cartes d'Anki ne sont plus dans le paquet de révision — elles se
       consultent. Elles restent cherchables : c'est même la seule façon de
       retrouver une carte quand on ne sait plus dans quelle UE on l'a mise. */
    Cards.anki().forEach(function (c) {
      idx.push(entry('anki', 'Anki · ' + c.hint, c.f, c.b, c.chemin, c.b,
        function () { go('flashcards', { carte: c.id }); }));
    });

    return idx;
  }

  var INDEX = null;
  var INDEX_SIG = null;

  function indexSignature() {
    return Cards.custom().length + '/' + Cards.anki().length + '/' + CASES.length +
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
  var highlight = Txt.highlight;

  /* `q` pré-remplit le champ : le répétiteur s'en sert pour passer la main à
     la recherche quand il n'a pas su répondre lui-même. */
  function openSearch(q) {
    ensureIndex();
    searchReturnFocus = document.activeElement;
    overlay.classList.add('on');
    searchInput.value = typeof q === 'string' ? q : '';
    searchInput.focus();
    searchInput.select();
    renderSearch(searchInput.value);
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

  /* « /lab recherche visuelle 4 8 12 » lance une expérience avec les tailles
     d'ensemble données. La palette sert déjà de ligne de commande pour les
     calculs ; refaire la même mesure qu'hier mérite le même raccourci.

     Les nombres deviennent des tailles d'ensemble, le reste sert à retrouver
     l'expérience. En dessous de deux tailles il n'y a pas de pente à tracer :
     on garde alors le protocole complet plutôt que d'en lancer un boiteux. */
  /* Les nombres d'une commande /lab ne veulent pas dire la même chose selon
     l'expérience : des tailles d'ensemble pour une recherche visuelle, des
     excentricités pour un encombrement. C'est l'expérience qui le déclare —
     la barre de recherche ne peut pas le deviner. */
  function parametres(exp, nombres) {
    var champ = exp.champNombres;
    if (!champ) return {};
    var o = {};
    o[champ] = nombres;
    return o;
  }

  function labHit(q) {
    var m = /^\/lab\b\s*(.*)$/i.exec(String(q || '').trim());
    if (!m || !M.vision || !window.Lab) return null;
    var reste = m[1];
    /* Les décimales comptent : une excentricité de 2,5° n’est pas « 2 » et
       « 5 ». On accepte le point comme la virgule. */
    var tailles = (reste.match(/\d+(?:[.,]\d+)?/g) || [])
      .map(function (x) { return Number(String(x).replace(',', '.')); })
      .filter(function (n) { return n >= 1 && n <= 48; })
      .sort(function (a, b) { return a - b; })
      .filter(function (n, i, l) { return l.indexOf(n) === i; });
    var mots = norm(reste.replace(/\d+/g, ' '));

    var exp = null, meilleur = 0;
    Lab.toutes().forEach(function (d) {
      var n = norm(d.nom).split(' ').filter(function (w) { return w.length > 2; });
      var sc = n.filter(function (w) { return mots.indexOf(w) >= 0; }).length;
      if (sc > meilleur) { meilleur = sc; exp = d; }
    });
    /* « /lab » tout court, ou un nom qu'on ne reconnaît pas : on ouvre le
       laboratoire plutôt que de deviner une expérience. */
    if (!exp) {
      return {
        kind: 'module', cat: 'Commande', t: 'Vision Lab',
        d: mots.trim() ? 'Expérience non reconnue — ouvrir le laboratoire' : 'Ouvrir le laboratoire',
        act: function () { go('vision'); }
      };
    }
    var perso = tailles.length >= 2;
    return {
      kind: 'module', cat: 'Commande · Vision Lab',
      /* Le mot qui désigne ces nombres appartient à l'expérience : des
         tailles d'ensemble ici, des excentricités là. */
      t: exp.nom + (perso ? ' — ' + (exp.uniteNombres || 'valeurs') + ' ' +
        tailles.map(function (x) { return String(x).replace('.', ','); }).join(', ')
        : ' — protocole complet'),
      d: perso
        ? tailles.length + ' ' + (exp.uniteNombres || 'valeurs') + ' au protocole'
        : (tailles.length === 1
            ? 'Une seule valeur ne donne pas de pente : protocole complet à la place'
            : 'Mode Mesure'),
      act: function () {
        go('vision', perso
          ? { exp: exp.id, params: parametres(exp, tailles) }
          : { exp: exp.id, mode: 'mesure' });
      }
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
      /* Une commande explicite remplace la liste : mélanger « /lab » avec des
         résultats de glossaire ferait passer la commande pour une suggestion. */
      var l = labHit(q);
      if (l) hits = [l];
      else {
        var c = calcHit(q);
        if (c) hits.unshift(c);
      }
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
    var r = resolve(id, params); id = r.id; params = r.params;
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
    /* Ctrl+J : demander. C'est le geste de quelqu'un qui bloque — il doit partir
       de n'importe quel écran, sans quitter ce qu'on est en train de lire. */
    if (meta && e.key.toLowerCase() === 'j') { e.preventDefault(); go('chat'); return; }
    if (meta && ['1', '2', '3', '4', '5'].indexOf(e.key) >= 0) {
      e.preventDefault();
      go(['home', 'reading', 'patient', 'studies', 'converters'][parseInt(e.key, 10) - 1]);
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
    window.ortho.on('menu:search', function () { openSearch(); });
    /* « module » ou « module:onglet » : le menu peut viser un onglet précis
       sans que main.js ait à connaître la forme des paramètres de chaque page */
    window.ortho.on('menu:goto', function (id) {
      var p = String(id || '').split(':');
      go(p[0], p[1] ? { tab: p[1] } : null);
    });
    window.ortho.on('menu:back', back);
    window.ortho.on('menu:forward', forward);
    window.ortho.on('menu:reset', function () {
      Store.reset(); setTheme('dark'); INDEX = null; buildNav(); go('home'); UI.toast('Progression réinitialisée.');
    });
  }

  /* ---------------- API globale ---------------- */

  window.App = {
    go: go,
    openModule: openModule,
    closeModule: closeModule,
    exportData: exportData,
    importData: importData,
    openSearch: openSearch,
    /* poser une question au répétiteur depuis n'importe quel écran */
    demander: function (q) { go('chat', q ? { q: q } : null); },
    refreshNav: buildNav,
    scoredLabel: scoredLabel
  };

  /* ---------------- Démarrage ---------------- */

  /* Les notes d'un module retiré de l'application dorment encore dans le
     stockage local, et fausseraient tout ce qui se calcule sur une moyenne :
     le compteur de la barre latérale, l'accueil, la maîtrise d'une UE. Rien
     n'est effacé — on déclare simplement ce qui existe aujourd'hui. */
  Store.setScoreScope(Object.keys(M).concat(Object.keys(EXTRA_SCORED)));

  Store.load();
  setTheme(Store.state.theme || 'dark');
  buildNav();
  go('home');
})();
