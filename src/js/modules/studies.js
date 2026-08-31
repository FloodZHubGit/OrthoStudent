/* ============================================================
   Programme des études — le tableau de bord du cursus
   ------------------------------------------------------------
   Trois couches :
     1. le référentiel (6 semestres, UE, ECTS, volumes horaires)
     2. une fiche de travail par UE : objectifs, notions clés,
        pièges, ce qui tombe, méthode — reliée aux modules
     3. un suivi de maîtrise calculé sur l'activité réelle, et un
        plan de révision daté à partir de la date des partiels
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  var C = window.CURRICULUM;
  var GUIDE = window.UE_GUIDE || {};
  var EXTRA = window.UE_EXTRA || {};
  var DEEP = window.UE_DEEP || {};
  var CAS = window.UE_CAS || {};
  /* la couche « cours vivant » : image, exemple clinique, erreur, phrase clé,
     une entrée par partie du plan — voir src/js/data/uecours.js */
  var COURS = window.UE_COURS || {};

  /* Les cas d'une UE viennent de deux sources : celui de la couche « examen »
     (uedeep) et ceux d'uecas. Tout le reste du module passe par cette fonction,
     pour n'avoir qu'un seul endroit à changer si une troisième source arrive. */
  function casList(code) {
    var d = DEEP[code];
    return (d && d.cas ? [d.cas] : []).concat(CAS[code] || []);
  }

  var CAS_TAGS = {
    clinique: { l: 'Cas clinique', c: 'blue' },
    calcul:   { l: 'Calcul',       c: '' },
    oral:     { l: 'Question d’oral', c: '' },
    'décision': { l: 'Décision',   c: 'amber' },
    urgence:  { l: 'Urgence',      c: 'red' },
    'méthode': { l: 'Méthode',     c: 'green' }
  };

  /* Le graphe de prérequis se lit dans les deux sens. UE_EXTRA ne
     déclare que « repose sur » ; on inverse une fois pour disposer
     aussi de « prépare ». */
  var OPENS = (function () {
    var out = {};
    Object.keys(EXTRA).forEach(function (code) {
      (EXTRA[code].prereq || []).forEach(function (p) {
        (out[p] = out[p] || []).push(code);
      });
    });
    return out;
  })();

  /* Où trouver une UE dans le référentiel — une UE peut revenir
     dans plusieurs semestres (l'anglais), on garde la première. */
  function locate(code) {
    for (var i = 0; i < C.length; i++) {
      var u = C[i].ues.filter(function (x) { return x.code === code; })[0];
      if (u) return { sem: C[i], ue: u };
    }
    return null;
  }

  /* comparaison sans accents ni ligatures : core/text.js */
  var norm = Txt.norm;

  var CALC_NAMES = {
    acuity: 'Acuité visuelle', prism: 'Prismes & degrés', prentice: 'Loi de Prentice',
    hirschberg: 'Hirschberg & Krimsky', transpose: 'Transposition', vergence: 'Vergence & distances',
    accom: 'Accommodation & addition', aca: 'Rapport AC/A', converg: 'Convergence & vergences',
    vertex: 'Distance de sommet & basse vision', stereo: 'Stéréoscopie'
  };

  function chapName(id) {
    var ch = (window.THEORY || []).filter(function (c) { return c.id === id; })[0];
    return ch ? ch.title : id;
  }
  /* Amener une carte en haut de la zone de lecture, avec un peu d'air au-dessus.
     scrollIntoView collerait son bord au bord du conteneur. */
  function scrollCardIntoView(node) {
    var main = document.getElementById('main');
    if (!main || !node) return;
    var top = node.getBoundingClientRect().top - main.getBoundingClientRect().top
            + main.scrollTop - 16;
    main.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  /* ============================================================
     La fiche d'une UE en quatre volets
     ------------------------------------------------------------
     Empilées, ses dix-huit cartes forment un mur dans lequel on se
     perd. Réparties en quatre volets, chacune répond à une question
     précise : qu'est-ce qu'on m'enseigne, qu'est-ce que je dois
     savoir par cœur, comment je m'entraîne, qu'est-ce qui tombe.
     Le classement se fait sur le titre de la carte ; une carte qui
     n'est pas listée ici tombe dans le dernier volet plutôt que de
     disparaître. Les quatre volets restent dans le document : la
     feuille d'impression les révèle tous.
     ============================================================ */
  var PANES = [
    { id: 'essentiel', label: '⚡ L’essentiel', titles: ['L’essentiel', 'Mes notes'] },
    { id: 'cours', label: '📘 Le cours', titles: [
      'Avant le premier cours',
      'Où vous en êtes dans le cours',
      'Le programme de l’UE a été vu en entier',
      'Ce que cette UE attend de vous',
      'Le cours en condensé',
      'Sa place dans le cursus'
    ] },
    { id: 'savoir', label: '🔢 À savoir par cœur', titles: [
      'Les chiffres à connaître par cœur',
      'Les formules de cette UE',
      'À retenir absolument',
      'Les tableaux à savoir refaire',
      'Moyens mnémotechniques',
      'Le vocabulaire à maîtriser'
    ] },
    { id: 'train', label: '🎯 S’entraîner', titles: [
      'Réviser cette UE',
      'Se faire interroger',
      'Cas d’application',
      'Plan de réponse type'
    ] },
    { id: 'exam', label: '⚠️ Pièges & méthode', titles: [
      'Les pièges',
      'Ce qui tombe',
      'Comment travailler cette UE'
    ] }
  ];

  /* volet courant, conservé d'un redessin à l'autre, et le moyen d'en changer
     depuis l'extérieur (un bouton qui renvoie vers une carte d'un autre volet) */
  var sheetPane = 'cours';
  var showPane = null;

  function cardTitle(node) {
    if (!node || !node.querySelector) return null;
    var h = node.classList && node.classList.contains('card')
      ? node.querySelector(':scope > .flex > h2')
      : node.querySelector('.card > .flex > h2');
    return h ? h.textContent : null;
  }

  function paneOf(node) {
    var t = cardTitle(node);
    if (!t) return PANES[0].id;
    for (var i = 0; i < PANES.length; i++) {
      if (PANES[i].titles.indexOf(t) >= 0) return PANES[i].id;
    }
    return PANES[PANES.length - 1].id;
  }

  /* Réorganise la fiche déjà construite : l'en-tête reste visible, le reste
     part dans son volet. On travaille sur le rendu plutôt que sur la liste des
     cartes pour qu'ajouter une carte à la fiche ne demande rien d'autre que
     de la nommer dans PANES. */
  function layoutSheet(page) {
    var kids = [].slice.call(page.children);
    if (kids.length < 3) return;
    var header = kids.shift();

    var boxes = {}, tabs = {};
    PANES.forEach(function (p) { boxes[p.id] = el('div', { class: 'ue-pane', dataset: { pane: p.id } }); });
    kids.forEach(function (n) { boxes[paneOf(n)].appendChild(n); });

    var used = PANES.filter(function (p) { return boxes[p.id].children.length; });
    if (used.length < 2) return;
    if (!used.filter(function (p) { return p.id === sheetPane; }).length) sheetPane = used[0].id;

    function show(id) {
      sheetPane = id;
      used.forEach(function (p) {
        boxes[p.id].classList.toggle('off', p.id !== id);
        tabs[p.id].classList.toggle('active', p.id === id);
        tabs[p.id].setAttribute('aria-selected', p.id === id ? 'true' : 'false');
      });
    }

    var bar = el('div', { class: 'tabs ue-panes', role: 'tablist' }, used.map(function (p) {
      /* on compte les cartes, pas les blocs : « Les pièges » et « Ce qui tombe »
         voyagent dans une même grille mais font bien deux cartes */
      var n = boxes[p.id].querySelectorAll('.card').length;
      var t = el('div', {
        class: 'tab', role: 'tab', tabindex: '0',
        onClick: function () { show(p.id); }
      }, [
        el('span', { text: p.label }),
        el('span', { class: 'tab-n', text: String(n) })
      ]);
      tabs[p.id] = t;
      return t;
    }));

    showPane = show;
    UI.clear(page);
    page.appendChild(header);
    page.appendChild(bar);
    used.forEach(function (p) { page.appendChild(boxes[p.id]); });
    show(sheetPane);
  }

  function semById(id) { return C.filter(function (x) { return x.id === id; })[0] || C[0]; }
  function ueKey(sem, ue) { return sem.id + ':' + ue.code; }
  function guideOf(ue) { return GUIDE[ue.code] || null; }

  function hours(sem) {
    return sem.ues.reduce(function (a, u) {
      a.h += u.h; a.cm += u.cm; a.td += u.td; a.tp += u.tp; return a;
    }, { h: 0, cm: 0, td: 0, tp: 0 });
  }

  /* Les modules réellement présents parmi ceux que l'UE référence. Sans ce
     filtre, un module retiré de l'application resterait compté dans la
     maîtrise avec une note de 0 : l'UE ne pourrait plus jamais atteindre
     100 %, et le plan de révision la remonterait indéfiniment. */
  function linkedMods(u) {
    return (((u.links || {}).mod) || []).filter(function (id) { return M[id]; });
  }

  function isCovered(u) {
    var l = u.links || {};
    return !!(linkedMods(u).length || (l.calc && l.calc.length) || (l.chap && l.chap.length) || (l.cats && l.cats.length));
  }

  /* ============================================================
     Maîtrise d'une UE — calculée sur ce que l'étudiant a fait
     ============================================================ */
  function mastery(sem, u) {
    var l = u.links || {};
    var parts = [], detail = [];
    var key = ueKey(sem, u);

    /* 1 — la récitation : rappel actif, donc le signal le plus fiable.
       On ne compte plus le score de la dernière séance mais l'état de
       chaque item dans la répétition espacée : réciter parfaitement 20
       items sur 46 ne fait pas une UE sue, et un item rappelé une fois
       hier ne vaut pas un item tenu depuis trois semaines. Tant qu'aucun
       item n'est entré en répétition espacée, on retombe sur l'ancien
       score, pondéré par la part de l'UE qu'il couvrait. */
    var rec = Store.recite(key);
    var mem = memoryOf(u);
    if (mem.total) {
      var v = mem.seen ? mem.value
                       : (rec ? (rec.pct / 100) * Math.min(1, rec.n / mem.total) : 0);
      parts.push({ w: 1.6, v: v });
      detail.push({
        k: 'Récitation', pct: Math.round(v * 100), w: 1.6,
        hint: mem.seen
          ? mem.known + ' item' + (mem.known > 1 ? 's' : '') + ' installé' + (mem.known > 1 ? 's' : '') +
            ' sur ' + mem.total + (mem.due ? ' · ' + mem.due + ' à revoir aujourd’hui' : ' · rien à revoir aujourd’hui')
          : mem.total + ' items à réciter, jamais fait',
        act: 'recite'
      });
    }

    /* 2 — les QCM : il faut du volume ET de la réussite */
    if (l.cats && l.cats.length) {
      var pool = (window.QUIZ || []).filter(function (q) { return l.cats.indexOf(q.cat) >= 0; });
      var seen = 0, ok = 0;
      pool.forEach(function (q) {
        var r = Store.state.quiz[q.id];
        if (r) { seen += r.seen; ok += r.ok; }
      });
      var cov = Math.min(1, seen / Math.max(1, pool.length));
      var rate = seen ? ok / seen : 0;
      parts.push({ w: 1.2, v: cov * rate });
      detail.push({
        k: 'QCM', pct: Math.round(cov * rate * 100), w: 1.2,
        hint: seen ? seen + ' réponses sur ' + pool.length + ' questions, ' + Math.round(rate * 100) + ' % de réussite'
                   : pool.length + ' questions disponibles, aucune tentée',
        act: 'qcm'
      });
    }

    /* 3 — la pratique dans les modules liés */
    var mods = linkedMods(u);
    if (mods.length) {
      var scored = mods.map(function (id) {
        var sc = Store.score(id);
        return sc ? Math.min(100, sc.avg) / 100 : 0;
      });
      var v = scored.reduce(function (a, b) { return a + b; }, 0) / scored.length;
      parts.push({ w: 1, v: v });
      detail.push({
        k: 'Pratique', pct: Math.round(v * 100), w: 1,
        hint: mods.filter(function (id) { return Store.score(id); }).length + ' module(s) pratiqué(s) sur ' + mods.length,
        act: 'mod'
      });
    }

    var revised = Store.ueDone(key);
    if (!parts.length) return { pct: revised ? 100 : null, revised: revised, detail: [], rec: rec };

    var tot = parts.reduce(function (a, p) { return a + p.w; }, 0);
    var val = parts.reduce(function (a, p) { return a + p.w * p.v; }, 0) / tot;
    var pct = Math.round(Math.min(1, val + (revised ? 0.15 : 0)) * 100);
    return { pct: pct, revised: revised, detail: detail, rec: rec };
  }

  var RECITE_LABEL = {
    chiffre: '🔢 chiffre', question: '💬 question',
    tableau: '📊 tableau', mnemo: '🧠 mnémotechnique', cle: '⚑ phrase clé'
  };
  var RECITE_SIDE = {
    chiffre: 'Chiffre à connaître', question: 'Question',
    tableau: 'Ligne de tableau', mnemo: 'Moyen mnémotechnique',
    cle: 'L’essentiel d’une partie de cours'
  };
  /* version courte, pour la barre de l'écran de récitation */
  var RECITE_SHORT = {
    chiffre: 'chiffre', question: 'question',
    tableau: 'tableau', mnemo: 'mnémo', cle: 'phrase clé'
  };

  function puces(box) {
    return new Array(box + 1).join('●') + new Array(6 - box).join('○');
  }

  function joursTexte(n) {
    return n <= 0 ? 'aujourd’hui' : n === 1 ? 'demain' : 'dans ' + n + ' jours';
  }

  /* ------------------------------------------------------------
     Comparer une réponse tapée à la réponse attendue
     ------------------------------------------------------------
     Ce n'est pas une correction, c'est une proposition : sur un
     chiffre elle est fiable, sur une phrase elle ne peut pas l'être.
     D'où la règle : les valeurs chiffrées priment — une réponse dont
     le nombre est faux n'est jamais « sue », quels que soient les
     mots autour — et le reste se juge au recouvrement des termes
     utiles, les mots-outils écartés.
     Renvoie null quand rien n'a été tapé : l'étudiant note seul.
     ------------------------------------------------------------ */
  var MOTS_OUTILS = {
    de: 1, du: 1, des: 1, la: 1, le: 1, les: 1, un: 1, une: 1, et: 1, ou: 1,
    au: 1, aux: 1, en: 1, dans: 1, par: 1, pour: 1, sur: 1, se: 1, sa: 1, son: 1,
    ses: 1, ce: 1, cet: 1, cette: 1, qui: 1, que: 1, est: 1, sont: 1, avec: 1,
    sans: 1, plus: 1, moins: 1, tout: 1, tous: 1, tres: 1, il: 1, elle: 1, on: 1
  };

  function texteSeul(s) {
    return String(s == null ? '' : s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function motsUtiles(s) {
    return Txt.norm(texteSeul(s))
      .replace(/[^a-z0-9µ%°]+/g, ' ')
      .split(' ')
      .filter(function (w) { return w.length > 1 && !MOTS_OUTILS[w]; });
  }

  function nombresDe(s) {
    var m = texteSeul(s).replace(/(\d),(\d)/g, '$1.$2').match(/-?\d+(?:\.\d+)?/g);
    return m ? m.map(parseFloat) : [];
  }

  function autoNote(attendu, tape) {
    if (!String(tape || '').trim()) return null;
    var a = motsUtiles(attendu), t = motsUtiles(tape);
    if (!a.length) return null;

    var trouves = a.filter(function (w) { return t.indexOf(w) >= 0; }).length;
    var part = trouves / a.length;

    var na = nombresDe(attendu), nt = nombresDe(tape);
    if (na.length) {
      var presents = na.filter(function (x) {
        return nt.some(function (y) { return Math.abs(y - x) < 1e-9; });
      }).length;
      if (presents === na.length) {
        return part >= 0.5
          ? { note: 2, pourquoi: 'la valeur et les termes attendus y sont' }
          : { note: 1, pourquoi: 'la valeur est juste, la formulation incomplète' };
      }
      return presents
        ? { note: 1, pourquoi: 'une partie des valeurs seulement' }
        : { note: 0, pourquoi: 'la valeur attendue n’y est pas' };
    }

    if (part >= 0.7) return { note: 2, pourquoi: 'réponse conforme à l’attendu' };
    if (part >= 0.35) return { note: 1, pourquoi: 'l’idée y est, la moitié des termes manque' };
    return { note: 0, pourquoi: 'trop éloigné de l’attendu' };
  }

  function reciteCount(u, kind) {
    return reciteItems(u).filter(function (x) { return !kind || x.kind === kind; }).length;
  }

  /* Ce sur quoi on peut s'interroger. La construction des items vit
     dans UEBank, partagée avec l'examen blanc : deux versions de la
     même question finiraient par diverger. */
  function reciteItems(u) {
    return window.UEBank ? UEBank.items(u.code) : [];
  }

  /* Préfixe des identifiants de fiches mémo tirées d'une UE — la
     convention de core/cards.js, reprise par UEBank pour que le même
     chiffre n'ait qu'une mémoire, qu'on le révise en fiche ou en
     récitation. Écrite une fois : deux versions finiraient par diverger. */
  function cardPrefix(sem, u) {
    return 'ue-' + sem.id + '-' + u.code.replace(/\s+/g, '') + '-';
  }

  /* L'état de mémoire d'une UE, item par item — la même mécanique de
     répétition espacée que les fiches mémo, appliquée aux chiffres,
     questions, lignes de tableau et mnémotechniques de l'UE. */
  var NO_MEM = { total: 0, seen: 0, known: 0, due: 0, boxes: [0, 0, 0, 0, 0, 0], value: 0, pct: 0 };
  function memoryOf(u) {
    return window.UEBank ? UEBank.memory(u.code) : NO_MEM;
  }

  /* Ce qui est réellement « à revoir » — donc déjà vu au moins une fois.
     Sur une UE jamais interrogée, tous les items sont dus par construction :
     annoncer « 36 à revoir » sur les onze UE d'un semestre le premier jour
     ne dit rien à personne. Une UE jamais commencée s'ouvre, elle ne se
     révise pas. */
  function dueNow(u) {
    var m = memoryOf(u);
    return m.seen ? m.due : 0;
  }

  /* Courbe des récitations successives : un score isolé ne dit rien,
     c'est la pente qui renseigne. */
  function sparkline(log) {
    var W = 260, H = 46, pad = 4;
    var g = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'ue-spark' });
    var pts = log.map(function (e, i) {
      return {
        x: pad + (log.length === 1 ? 0 : i * (W - pad * 2) / (log.length - 1)),
        y: pad + (1 - e.pct / 100) * (H - pad * 2),
        e: e
      };
    });
    [25, 50, 75].forEach(function (v) {
      var y = pad + (1 - v / 100) * (H - pad * 2);
      g.appendChild(s('line', { x1: pad, y1: y, x2: W - pad, y2: y, stroke: 'var(--line-soft)' }));
    });
    g.appendChild(s('polyline', {
      fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-linejoin': 'round',
      points: pts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ')
    }));
    pts.forEach(function (p) {
      var c = s('circle', { cx: p.x, cy: p.y, r: 3, fill: masteryColor(p.e.pct) });
      c.appendChild(s('title', {}, p.e.pct + ' % sur ' + p.e.n + ' items'));
      g.appendChild(c);
    });
    var first = log[0].pct, last = log[log.length - 1].pct;
    var delta = last - first;
    return el('div', { class: 'ue-spark-wrap' }, [
      g,
      el('div', { class: 'small muted' }, [
        el('span', { text: log.length + ' récitations · ' }),
        el('b', {
          style: { color: delta > 0 ? 'var(--green)' : delta < 0 ? 'var(--amber)' : 'var(--txt-3)' },
          text: (delta > 0 ? '+' : '') + delta + ' points depuis la première'
        })
      ])
    ]);
  }

  /* ------------------------------------------------------------
     La répartition des items dans les cinq boîtes
     ------------------------------------------------------------
     Un pourcentage seul ne dit pas la même chose que cette barre :
     30 % obtenus avec tout le monde en boîte 2 se rattrapent en une
     séance, 30 % avec la moitié des items jamais vus, non. Les items
     jamais interrogés forment la tranche en creux, à gauche.
     ------------------------------------------------------------ */
  var BOX_SEGS = [
    { k: 'fresh', c: 'var(--surface-4)', l: 'jamais vus' },
    { k: 1, c: 'var(--red)', l: 'boîte 1 — fragiles' },
    { k: 2, c: 'var(--amber)', l: 'boîte 2' },
    { k: 3, c: 'var(--accent)', l: 'boîte 3' },
    { k: 4, c: 'var(--blue)', l: 'boîte 4' },
    { k: 5, c: 'var(--green)', l: 'boîte 5 — installés' }
  ];

  function boxBar(mem) {
    if (!mem.total) return el('div');
    var fresh = mem.total - mem.seen;
    var vals = { fresh: fresh, 1: Math.max(0, mem.boxes[1] - fresh), 2: mem.boxes[2],
                 3: mem.boxes[3], 4: mem.boxes[4], 5: mem.boxes[5] };
    return el('div', { class: 'ue-boxbar' }, [
      el('div', { class: 'stack-bar' }, BOX_SEGS.filter(function (s) { return vals[s.k]; })
        .map(function (s) {
          return el('i', { style: { width: (vals[s.k] / mem.total * 100) + '%', background: s.c },
            title: vals[s.k] + ' item(s) — ' + s.l });
        })),
      el('div', { class: 'legend' }, BOX_SEGS.filter(function (s) { return vals[s.k]; })
        .map(function (s) {
          return el('span', {}, [
            el('i', { style: { background: s.c } }),
            el('span', { text: vals[s.k] + ' ' + s.l })
          ]);
        }))
    ]);
  }

  /* ------------------------------------------------------------
     Chercher dans une fiche
     ------------------------------------------------------------
     Une fiche fait maintenant plusieurs milliers de mots répartis
     en cinq volets : « où est-ce qu'on parlait de Bielschowsky ? »
     ne doit pas obliger à ouvrir les cinq. On surligne dans le rendu
     déjà construit plutôt que de le reconstruire — les états locaux
     (cas ouvert, colonne masquée, notes en cours de frappe) sont
     ainsi préservés.
     ------------------------------------------------------------ */
  function unmark(root) {
    root.querySelectorAll('mark').forEach(function (m) {
      m.parentNode.replaceChild(document.createTextNode(m.textContent), m);
    });
    root.normalize();
  }

  var NO_MARK = /^(script|style|textarea|input|select|mark)$/i;

  function markAll(root, toks) {
    if (!toks.length) return 0;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) {
      var n = walker.currentNode;
      if (!n.nodeValue || !n.nodeValue.trim()) continue;
      if (n.parentNode && NO_MARK.test(n.parentNode.tagName)) continue;
      nodes.push(n);
    }
    var count = 0;
    nodes.forEach(function (node) {
      var frag = Txt.highlight(node.nodeValue, toks);
      var marks = frag.querySelectorAll('mark').length;
      if (!marks) return;
      count += marks;
      node.parentNode.replaceChild(frag, node);
    });
    return count;
  }

  /* ------------------------------------------------------------
     Se cacher la réponse
     ------------------------------------------------------------
     Relire un tableau donne le sentiment de le savoir ; le refaire
     de tête dit si on le sait. Ces deux fonctions rendent masquable
     ce qui, jusqu'ici, se lisait passivement : une colonne de
     tableau, une colonne de valeurs. On révèle d'un clic — cellule
     par cellule, pour vérifier sans tout rouvrir.
     ------------------------------------------------------------ */
  function maskableTable(node) {
    var table = node.tagName === 'TABLE' ? node : node.querySelector('table');
    if (!table) return node;
    var heads = [].slice.call(table.querySelectorAll('thead th'));

    function cells(i) {
      return [].slice.call(table.querySelectorAll('tbody tr')).map(function (tr) {
        return tr.children[i];
      }).filter(Boolean);
    }

    heads.forEach(function (th, i) {
      /* la première colonne est l'entrée de lecture : la masquer rendrait
         les lignes anonymes, et le tableau illisible */
      if (i === 0) return;
      th.classList.add('mask-h');
      th.title = 'Masquer cette colonne pour la refaire de tête';
      th.setAttribute('role', 'button');
      th.setAttribute('tabindex', '0');
      function toggle() {
        var on = !th.classList.contains('on');
        th.classList.toggle('on', on);
        cells(i).forEach(function (td) { td.classList.toggle('hid', on); });
      }
      th.addEventListener('click', toggle);
      th.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });

    /* révéler une cellule seule : on vérifie une ligne sans rouvrir tout */
    table.addEventListener('click', function (e) {
      var td = e.target.closest ? e.target.closest('td.hid') : null;
      if (td) td.classList.remove('hid');
    });
    return node;
  }

  function masteryLabel(pct) {
    if (pct === null) return 'À déclarer';
    if (pct >= 80) return 'Maîtrisée';
    if (pct >= 55) return 'Solide';
    if (pct >= 30) return 'En cours';
    if (pct > 0) return 'Découverte';
    return 'Non travaillée';
  }
  function masteryColor(pct) {
    if (pct === null) return 'var(--txt-3)';
    return pct >= 80 ? 'var(--green)' : pct >= 55 ? 'var(--accent)' : pct >= 30 ? 'var(--amber)' : 'var(--red)';
  }

  /* moyenne pondérée par les ECTS : l'état de préparation du semestre */
  function semesterReadiness(sem) {
    var tot = 0, sum = 0;
    sem.ues.forEach(function (u) {
      var m = mastery(sem, u);
      if (m.pct === null) return;
      tot += u.ects; sum += u.ects * m.pct;
    });
    return tot ? Math.round(sum / tot) : 0;
  }

  /* ------------------------------------------------------------
     Répétition espacée appliquée aux UE
     ------------------------------------------------------------
     L'échéance ne porte plus sur l'UE entière mais sur chacun de ses
     items : une UE dont douze chiffres sont dus aujourd'hui doit
     revenir, même si la dernière séance était bonne. C'est cette
     échéance qui pilote le plan de révision.
     ------------------------------------------------------------ */
  function reciteDue(sem, u) {
    var mem = memoryOf(u);
    if (!mem.total) return null;
    var rec = Store.recite(ueKey(sem, u));
    return {
      due: mem.due > 0,
      n: mem.due,
      days: rec ? Math.floor((Date.now() - rec.at) / 86400000) : null,
      never: mem.seen === 0,
      pct: rec ? rec.pct : null,
      mem: mem
    };
  }

  function currentSemester() { return Store.state.profile.semester || null; }

  function daysUntil(iso) {
    if (!iso) return null;
    var d = new Date(iso + 'T12:00:00');
    if (isNaN(d.getTime())) return null;
    return Math.round((d - Date.now()) / 86400000);
  }

  /* ============================================================
     Petits composants
     ============================================================ */
  function hoursBar(h) {
    if (!h.h) return el('div', { class: 'muted small', text: 'Pas d’heures présentielles.' });
    var parts = [
      { k: 'CM', v: h.cm, c: 'var(--accent)' },
      { k: 'TD', v: h.td, c: 'var(--blue)' },
      { k: 'TP', v: h.tp, c: 'var(--violet)' }
    ].filter(function (p) { return p.v > 0; });
    return el('div', {}, [
      el('div', { class: 'stack-bar' }, parts.map(function (p) {
        return el('i', { style: { width: (p.v / h.h * 100) + '%', background: p.c }, title: p.k + ' — ' + p.v + ' h' });
      })),
      el('div', { class: 'legend', style: { marginTop: '8px' } }, parts.map(function (p) {
        return el('span', {}, [el('i', { style: { background: p.c } }), el('span', { text: p.k + ' ' + p.v + ' h' })]);
      }))
    ]);
  }

  /* ============================================================
     Export d'une fiche en Markdown
     ------------------------------------------------------------
     L'impression sert à emporter la fiche sur papier ; l'export sert
     à l'emporter ailleurs — un carnet de notes, un dépôt partagé avec
     la promo. On exporte la fiche entière, notes personnelles
     comprises : une fiche amputée ne sert à rien.
     ============================================================ */
  function md(s) {
    return String(s == null ? '' : s)
      .replace(/<\s*(b|strong)\s*>/gi, '**').replace(/<\s*\/\s*(b|strong)\s*>/gi, '**')
      .replace(/<\s*(i|em)\s*>/gi, '*').replace(/<\s*\/\s*(i|em)\s*>/gi, '*')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  function sheetMarkdown(sem, u) {
    var g = guideOf(u) || {};
    var d = DEEP[u.code] || {};
    var e = EXTRA[u.code] || {};
    var key = ueKey(sem, u);
    var L = [];
    function h(n, t) { L.push('', new Array(n + 1).join('#') + ' ' + t, ''); }
    function bullets(list, fn) { (list || []).forEach(function (x) { L.push('- ' + md(fn ? fn(x) : x)); }); }

    L.push('# ' + u.code + ' — ' + u.title);
    L.push('');
    L.push('*' + sem.label + ' · ' + u.ects + ' ECTS' +
      (u.h ? ' · ' + u.h + ' h (' + u.cm + ' CM / ' + u.td + ' TD' + (u.tp ? ' / ' + u.tp + ' TP' : '') + ')' : '') + '*');
    if (g.resume) { L.push(''); L.push('> ' + md(g.resume)); }

    if (g.objectifs) { h(2, 'Ce que cette UE attend de vous'); bullets(g.objectifs); }

    if (g.plan) {
      h(2, 'Le cours en condensé');
      var cours = COURS[u.code] || [];
      g.plan.forEach(function (p, i) {
        var c = cours[i] || {};
        L.push('', '### ' + md(p.t), '', md(p.p));
        if (c.img) L.push('', '> 💡 **L’image qui reste.** ' + md(c.img));
        if (c.ex) L.push('', '> 🩺 **En consultation.** ' + md(c.ex));
        if (c.err) L.push('', '> ⚠️ **L’erreur classique.** ' + md(c.err));
        if (c.cle) L.push('', '**À retenir —** ' + md(c.cle));
      });
    }

    if (g.chiffres && g.chiffres.length) {
      h(2, 'Les chiffres à connaître par cœur');
      L.push('| Ce qu’on demande | Valeur |', '| --- | --- |');
      g.chiffres.forEach(function (c) { L.push('| ' + md(c[0]) + ' | ' + md(c[1]) + ' |'); });
    }

    if ((u.links || {}).formulas) {
      var fs = (u.links.formulas || []).map(function (id) { return (window.FORMULAS || {})[id]; }).filter(Boolean);
      if (fs.length) {
        h(2, 'Les formules de cette UE');
        fs.forEach(function (f) {
          L.push('- **' + md(f.t) + '** — `' + md(f.f) + '` · ' + md(f.w) + (f.r ? ' *(' + md(f.r) + ')*' : ''));
        });
      }
    }

    if (g.notions) { h(2, 'À retenir absolument'); bullets(g.notions); }
    if (g.pieges) { h(2, 'Les pièges'); bullets(g.pieges); }
    if (g.tombe) { h(2, 'Ce qui tombe'); bullets(g.tombe); }

    if (d.tableaux && d.tableaux.length) {
      h(2, 'Les tableaux à savoir refaire');
      d.tableaux.forEach(function (tb) {
        L.push('', '### ' + md(tb.t), '');
        L.push('| ' + tb.c.map(md).join(' | ') + ' |');
        L.push('| ' + tb.c.map(function () { return '---'; }).join(' | ') + ' |');
        tb.r.forEach(function (r) { L.push('| ' + r.map(md).join(' | ') + ' |'); });
      });
    }

    if (e.qr && e.qr.length) {
      h(2, 'Questions d’auto-interrogation');
      e.qr.forEach(function (q) { L.push('- **' + md(q[0]) + '**', '  ' + md(q[1])); });
    }

    if (d.mnemo && d.mnemo.length) {
      h(2, 'Moyens mnémotechniques');
      d.mnemo.forEach(function (x) { L.push('- **' + md(x[0]) + '** — ' + md(x[1])); });
    }

    if (d.reponse) {
      h(2, 'Plan de réponse type');
      L.push('*« ' + md(d.reponse.q) + ' »*', '');
      d.reponse.p.forEach(function (p, i) { L.push((i + 1) + '. ' + md(p)); });
    }

    var cas = casList(u.code);
    if (cas.length) {
      h(2, 'Cas d’application');
      cas.forEach(function (c, i) {
        L.push('', '### Cas ' + (i + 1) + ' · ' + md(c.t) + (c.tag ? ' *(' + c.tag + ')*' : ''), '');
        L.push(md(c.s), '');
        (c.q || []).forEach(function (q, k) { L.push((k + 1) + '. ' + md(q)); });
        L.push('', '**Raisonnement.** ' + md(c.r), '', '**Conclusion.** ' + md(c.c));
      });
    }

    if (e.mots && e.mots.length) {
      h(2, 'Le vocabulaire à maîtriser');
      L.push(e.mots.map(md).join(' · '));
    }

    if (g.methode) { h(2, 'Comment travailler cette UE'); L.push(md(g.methode)); }

    var note = Store.ueNote(key);
    if (note) { h(2, 'Mes notes'); L.push(note); }

    L.push('', '---', '', '*Fiche OrthoStudent — ' + new Date().toLocaleDateString('fr-FR') +
      '. Condensé de révision : ne remplace ni le cours du formateur, ni les protocoles du lieu de stage.*');
    /* les titres posent leur ligne vide, les sections aussi : on ne laisse
       jamais plus d'une ligne vide de suite */
    return L.join('\n').replace(/\n{3,}/g, '\n\n');
  }

  function exportSheet(sem, u) {
    UI.download(sem.id + '-' + u.code.replace(/\s+/g, '') + '.md', sheetMarkdown(sem, u), 'text/markdown');
    UI.toast('Fiche exportée en Markdown.');
  }

  function overview() {
    var W = 680, H = 230, padL = 38, padB = 40, padT = 14;
    var g = s('svg', { viewBox: '0 0 ' + W + ' ' + H, style: 'width:100%;height:auto' });
    var maxH = Math.max.apply(null, C.map(function (sem) { return hours(sem).h; }));
    var bw = (W - padL - 12) / C.length;
    var cur = currentSemester();

    C.forEach(function (sem, i) {
      var h = hours(sem);
      var x = padL + i * bw, full = H - padB - padT;
      var y = padT + full * (1 - h.h / maxH), hh = full * (h.h / maxH), off = 0;
      [{ v: h.cm, c: 'var(--accent)' }, { v: h.td, c: 'var(--blue)' }, { v: h.tp, c: 'var(--violet)' }].forEach(function (sg) {
        if (!sg.v) return;
        var sh = hh * (sg.v / h.h);
        g.appendChild(s('rect', { x: x + 12, y: y + off, width: bw - 26, height: sh, fill: sg.c, opacity: cur && cur !== sem.id ? 0.45 : 1 }));
        off += sh;
      });
      g.appendChild(s('rect', { x: x + 12, y: y, width: bw - 26, height: hh, fill: 'none',
        stroke: cur === sem.id ? 'var(--accent)' : 'transparent', 'stroke-width': 2, rx: 3 }));
      g.appendChild(s('text', { x: x + bw / 2, y: y - 6, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--txt-2)' }, h.h + ' h'));
      g.appendChild(s('text', { x: x + bw / 2, y: H - 22, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': '700',
        fill: cur === sem.id ? 'var(--accent)' : 'var(--txt)' }, sem.id));
      g.appendChild(s('text', { x: x + bw / 2, y: H - 8, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--txt-3)' },
        sem.ects + ' ECTS · ' + sem.stage.ects + ' de stage'));
    });
    g.appendChild(s('line', { x1: padL, y1: H - padB, x2: W - 10, y2: H - padB, stroke: 'var(--line)' }));
    return g;
  }

  /* ============================================================
     Plan de révision
     ============================================================ */
  function actionsFor(sem, u, openSheet, recite) {
    var l = u.links || {};
    var acts = [];
    /* la récitation passe devant : c'est le geste au meilleur rapport
       temps / rétention, et il conditionne le reste */
    if (recite && reciteItems(u).length) {
      var mem = memoryOf(u);
      var due = dueNow(u);
      acts.push({ id: 'recite',
        label: !mem.seen ? 'Se faire interroger — ' + mem.total + ' items, jamais fait'
             : due ? 'Se faire interroger — ' + due + ' item' + (due > 1 ? 's' : '') + ' à revoir'
             : 'Se faire interroger — ' + mem.total + ' items, tous à jour',
        run: function () { recite(u); } });
    }
    if (l.cats && l.cats.length) {
      acts.push({ id: 'qcm', label: 'Série de 15 QCM — ' + l.cats.join(', '),
        run: function () { App.go('quiz', { cats: l.cats, n: 15 }); } });
    }
    var mid = linkedMods(u)[0];
    if (mid) {
      acts.push({ id: 'mod', label: 'Séance pratique — ' + M[mid].title,
        run: function () { App.go(mid); } });
    }
    if (l.chap && l.chap.length) {
      acts.push({ id: 'chap', label: 'Relire le chapitre « ' + chapName(l.chap[0]) + ' »',
        run: function () { App.go('theory', { chapter: l.chap[0] }); } });
    }
    if (guideOf(u)) {
      acts.push({ id: 'fiche', label: 'Fiche d’UE : notions clés, pièges, ce qui tombe',
        run: function () { openSheet(u); } });
    }
    if (l.calc && l.calc.length) {
      acts.push({ id: 'calc', label: 'Exercices de calcul — ' + (CALC_NAMES[l.calc[0]] || l.calc[0]),
        run: function () { App.go('converters', { calc: l.calc[0] }); } });
    }
    return acts.slice(0, 3);
  }

  function buildPlan(sem, weeks, openSheet, recite) {
    // priorité : ce qui pèse lourd en ECTS et qui n'est pas maîtrisé
    var ranked = sem.ues.map(function (u) {
      var m = mastery(sem, u);
      var pct = m.pct === null ? (m.revised ? 100 : 0) : m.pct;
      var d = reciteDue(sem, u);
      /* une UE encore "fraîche" est déprioritisée : la revoir trop tôt
         coûte du temps sans rien consolider */
      var freshness = (d && !d.due && !d.never) ? 0.25 : 1;
      return {
        u: u, m: m, due: d,
        prio: (u.ects * (1 - pct / 100) + (isCovered(u) ? 0.4 : 0)) * freshness
      };
    }).filter(function (x) { return x.prio > 0.05 || x.m.pct === null; })
      .sort(function (a, b) { return b.prio - a.prio; });

    if (!ranked.length) return [];

    var plan = [];
    var k = 0;
    for (var w = 1; w <= weeks; w++) {
      var last = w === weeks;
      var picks = [];
      var n = last ? 2 : 3;
      for (var j = 0; j < n && ranked.length; j++) { picks.push(ranked[k % ranked.length]); k++; }
      plan.push({
        week: w, last: last,
        items: picks.map(function (p) {
          return { ue: p.u, m: p.m, due: p.due, acts: actionsFor(sem, p.u, openSheet, recite) };
        })
      });
    }
    return plan;
  }

  /* ============================================================
     Module
     ============================================================ */
  M.studies = {
    id: 'studies', title: 'Mes UE', icon: '🎓', group: 'Mon programme',
    desc: 'Les 6 semestres, une fiche par UE, votre maîtrise et un plan de révision daté',

    /* --- API utilisée par l'accueil --- */
    readiness: function (semId) { return semesterReadiness(semById(semId)); },
    daysToExam: function (semId) { return daysUntil(Store.examDate(semId)); },
    /* maîtrise d'une UE isolée — l'emploi du temps s'en sert pour dire,
       en face d'un cours, où en est l'étudiant sur ce qui va être traité */
    ueMastery: function (semId, code) {
      var sem = semById(semId);
      var u = sem ? sem.ues.filter(function (x) { return x.code === code; })[0] : null;
      if (!u) return null;
      var m = mastery(sem, u);
      return { pct: m.pct, label: masteryLabel(m.pct), color: masteryColor(m.pct), ue: u };
    },
    /* les UE à travailler en priorité : lourdes et mal maîtrisées */
    priorities: function (semId, n) {
      var sem = semById(semId);
      return sem.ues.map(function (u) {
        var m = mastery(sem, u);
        var pct = m.pct === null ? (m.revised ? 100 : 0) : m.pct;
        /* `due` : les items de l'UE à revoir aujourd'hui. La séance du jour
           s'en sert pour dire quoi faire de l'UE, pas seulement laquelle. */
        return { ue: u, pct: pct, unknown: m.pct === null, due: dueNow(u),
                 prio: u.ects * (1 - pct / 100) };
      }).filter(function (x) { return x.prio > 0.05; })
        .sort(function (a, b) { return b.prio - a.prio; })
        .slice(0, n || 3);
    },

    keywords: 'programme etudes semestre ue ects referentiel formation cursus stage volume horaire cm td tp certificat capacite fiche revision partiel plan objectif piege methode',

    render: function (ctx) {
      var params = (ctx && ctx.params) || {};
      var wanted = params.sem || currentSemester() || 'S1';
      var totalH = C.reduce(function (a, sem) { return a + hours(sem).h; }, 0);
      var stageEcts = C.reduce(function (a, sem) { return a + sem.stage.ects; }, 0);

      var body = el('div');

      /* ============================================================
         Réciter — l'interrogation active
         ------------------------------------------------------------
         Se relire donne le sentiment de savoir ; se faire interroger
         dit ce qu'on sait vraiment. Trois choix structurent cet écran :

         1. On écrit sa réponse avant de la voir. Découvrir la réponse
            puis se dire « je le savais » est le biais central de toute
            révision : taper d'abord l'interdit. Le champ n'est jamais
            obligatoire — on peut répondre à voix haute et valider à
            vide, c'est plus rapide — mais il est là, et il change tout.

         2. L'application propose la note, l'étudiant tranche. Sur un
            chiffre, la comparaison est objective ; sur une phrase, elle
            ne l'est pas. La proposition est donc pré-sélectionnée et
            validable d'une touche, jamais imposée.

         3. Rien d'autre à l'écran : une barre fine en haut, la question
            au centre, les trois notes en bas. Tout se fait au clavier
            sans quitter le champ — Entrée vérifie, Entrée note.

         Chaque item garde sa mémoire propre (répétition espacée, cinq
         boîtes) : la file remonte ce qui est dû et ce qui tient le
         moins bien, et l'écran annonce, après chaque note, quand l'item
         reviendra — c'est ce qui rend l'espacement lisible.
         ============================================================ */

      /* Pendant une récitation, le décor de la page — titre du module, onglets
         de semestre, bandeaux de bas de page — n'a plus rien à dire. On
         l'efface pour ne laisser que la question ; chaque vue le rétablit en
         s'affichant, si bien qu'aucun chemin de retour ne peut l'oublier. */
      function decor(on) {
        var p = body.closest ? body.closest('.page') : null;
        if (p) p.classList.toggle('reciting', !on);
      }

      /* Les items d'une UE, prêts pour la file : chacun sait d'où il vient,
         ce dont une file transversale a besoin pour se noter. */
      function poolFor(sem, u, opts) {
        return (window.UEBank ? UEBank.queue(u.code, opts) : []).map(function (it) {
          it.sem = sem; it.ue = u;
          return it;
        });
      }

      /* Réciter une UE. */
      function reciteMode(sem, u, opts) {
        opts = opts || {};
        if (!reciteItems(u).length) { UI.toast('Rien à réciter pour cette UE.'); return; }
        var pool = poolFor(sem, u, opts);
        if (!pool.length) {
          UI.toast(opts.dueOnly ? 'Rien à revoir aujourd’hui sur cette UE.'
                                : 'Rien à réciter dans cette catégorie.');
          return;
        }
        runRecite({
          pool: pool,
          titre: u.code + ' — ' + u.title,
          retour: function () { ueSheet(sem, u); },
          relance: function (o) { reciteMode(sem, u, o); },
          reste: function () { return dueNow(u); },
          limit: opts.limit
        });
      }

      /* Réciter tout ce qui est dû dans un semestre, UE mêlées. C'est le
         geste quotidien : on ne vient pas réviser « l'UE 9 », on vient
         faire ce qui est dû aujourd'hui. */
      function reciteSemestre(sem, opts) {
        opts = opts || {};
        var pool = [];
        sem.ues.forEach(function (u) {
          if (!reciteItems(u).length) return;
          pool = pool.concat(poolFor(sem, u, { dueOnly: opts.dueOnly !== false }));
        });
        if (!pool.length) { UI.toast('Rien à revoir aujourd’hui sur ce semestre.'); return; }
        /* le plus fragile d'abord, puis au hasard : sans brassage, on
           réciterait les UE dans l'ordre du semestre à chaque séance */
        pool.sort(function (a, b) { return a.box - b.box || a._r - b._r; });
        runRecite({
          pool: pool,
          titre: 'Révision du jour — ' + sem.label,
          multi: true,
          retour: function () { drawSemester(sem.id); },
          relance: function (o) { reciteSemestre(sem, o); },
          reste: function () {
            return sem.ues.reduce(function (a, u) { return a + dueNow(u); }, 0);
          },
          limit: opts.limit || 25
        });
      }

      /* ============================================================
         Écouter — la récitation sans les yeux
         ------------------------------------------------------------
         Vingt minutes de trajet, la vaisselle, le chemin du stage : du
         temps où l'on ne peut pas lire, mais où l'on peut très bien
         répondre. L'application pose la question à voix haute, laisse
         un silence pour répondre, puis donne la réponse.

         Deux décisions valent d'être expliquées.

         1. L'écoute ne fait pas monter les boîtes. Entendre une réponse
            n'est pas la retrouver : compter cela comme un rappel réussi
            gonflerait la maîtrise sans rien installer. La séance est
            journalisée — la journée compte comme travaillée — mais la
            répétition espacée n'avance pas.

         2. Un seul geste, et il ne va que dans le sens honnête : pendant
            la réponse, une touche quelconque signale « je ne savais
            pas », et l'item redescend en boîte 1. Ne rien faire ne
            change rien. On ne peut donc que se pénaliser, jamais se
            flatter — c'est la seule notation fiable les yeux fermés.
         ============================================================ */
      function ecouteMode(cfg) {
        var pool = cfg.pool.slice();
        if (cfg.limit && pool.length > cfg.limit) pool = pool.slice(0, cfg.limit);

        var reglages = Store.setting('ecoute') || {};
        var st = {
          i: 0, phase: 'attente', lecture: false, rates: 0, vus: 0,
          vitesse: reglages.vitesse || 1, silence: reglages.silence || 5,
          voix: reglages.voix || null
        };
        var debut = Date.now();
        var box = el('div', { class: 'ec' });
        var vivant = true;              // faux dès qu'on quitte l'écran
        var attente = null;             // le minuteur du silence, annulable

        function dodo(ms) {
          return new Promise(function (res) {
            clearTimeout(attente);
            attente = setTimeout(res, ms);
          });
        }
        function reveiller() { clearTimeout(attente); attente = null; }

        function quitter() {
          vivant = false;
          st.lecture = false;
          reveiller();
          if (window.Voix) Voix.stop();
          enregistrer();
          cfg.retour();
        }

        /* appelée à la fin ET en quittant : on n'enregistre que ce qui ne
           l'a pas déjà été, sinon une séance compterait deux fois */
        var dejaVus = 0;
        function enregistrer() {
          var neufs = st.vus - dejaVus;
          if (neufs <= 0) return;
          dejaVus = st.vus;
          var minutes = Math.max(1, Math.round((Date.now() - debut) / 60000));
          Store.logActivity('ue:ecoute', null, { n: neufs, min: minutes });
          Store.bump('ecoute', neufs);
        }

        /* --- la boucle : question, silence, réponse --- */
        function jouer() {
          if (!vivant || !st.lecture) return;
          if (st.i >= pool.length) { fin(); return; }
          var it = pool[st.i];
          var opts = { vitesse: st.vitesse, voix: st.voix };

          st.phase = 'question'; draw();
          Voix.parler(it.q, opts).then(function () {
            if (!vivant || !st.lecture) return;
            st.phase = 'silence'; draw();
            return dodo(st.silence * 1000).then(function () {
              if (!vivant || !st.lecture) return;
              st.phase = 'reponse'; draw();
              return Voix.parler(it.a, opts).then(function () {
                if (!vivant || !st.lecture) return;
                st.vus++;
                return dodo(900).then(function () {
                  if (!vivant || !st.lecture) return;
                  st.i++; st.phase = 'attente';
                  jouer();
                });
              });
            });
          });
        }

        function basculer() {
          st.lecture = !st.lecture;
          if (st.lecture) jouer();
          else { Voix.stop(); reveiller(); st.phase = 'attente'; draw(); }
        }

        function sauter(n) {
          Voix.stop(); reveiller();
          st.i = Math.max(0, Math.min(pool.length, st.i + n));
          st.phase = 'attente';
          if (st.lecture) jouer(); else draw();
        }

        /* le seul geste possible les yeux ailleurs : « je ne savais pas » */
        function pasSu() {
          if (st.i >= pool.length) return;
          var it = pool[st.i];
          Store.reviewCard(it.id, 0);
          st.rates++;
          UI.toast('« ' + (it.ue ? it.ue.code : '') + ' » redescend en boîte 1.');
          draw();
        }

        function fin() {
          st.lecture = false;
          enregistrer();
          var minutes = Math.max(1, Math.round((Date.now() - debut) / 60000));
          UI.clear(box);
          box.appendChild(UI.card('Écoute terminée', [
            el('div', { class: 'grid g3' }, [
              UI.stat(st.vus, 'Items écoutés'),
              UI.stat(st.rates, 'Signalés « pas su »', 'var(--amber)'),
              UI.stat(minutes + ' min', 'Durée')
            ]),
            UI.note('L’écoute expose, elle ne teste pas : les boîtes n’ont pas bougé, sauf pour ' +
              'les items que vous avez signalés. Pour faire avancer la mémoire, il faut produire ' +
              'la réponse — c’est la récitation à l’écran.'),
            el('div', { class: 'btn-row' }, [
              UI.btn('🎤 Passer à la récitation', function () {
                vivant = false;
                if (cfg.reciter) cfg.reciter();
              }, 'primary'),
              UI.btn('↻ Réécouter', function () {
                st.i = 0; st.vus = 0; st.rates = 0; debut = Date.now();
                st.lecture = true; jouer();
              }),
              UI.btn('← Retour', quitter)
            ])
          ]));
          document.getElementById('main').scrollTop = 0;
        }

        function draw() {
          UI.clear(box);
          if (st.i >= pool.length) return;
          var it = pool[st.i];
          var PHASES = {
            attente: ['⏸', 'En pause', 'var(--txt-3)'],
            question: ['🔊', 'La question', 'var(--accent)'],
            silence: ['…', 'À vous — répondez à voix haute', 'var(--amber)'],
            reponse: ['💬', 'La réponse', 'var(--green)']
          };
          var ph = PHASES[st.phase];

          box.appendChild(el('div', { class: 'rc-top' }, [
            el('span', { class: 'rc-count mono', text: (st.i + 1) + ' / ' + pool.length }),
            el('span', { class: 'rc-bar' }, el('i', { style: { width: (st.i / pool.length * 100) + '%' } })),
            cfg.multi ? el('span', { class: 'rc-ue', text: it.ue.code }) : null,
            el('span', { class: 'rc-kind', text: RECITE_SHORT[it.kind] || 'question' }),
            UI.btn('✕', quitter, 'sm rc-quit')
          ].filter(Boolean)));

          box.appendChild(el('div', { class: 'ec-scene' }, [
            el('div', { class: 'ec-phase', style: { color: ph[2] } }, [
              el('span', { class: 'ec-ic', text: ph[0] }),
              el('span', { text: ph[1] })
            ]),
            el('div', { class: 'ec-q selectable', html: it.q }),
            /* la réponse ne s'affiche qu'une fois dite : sinon l'œil la lit
               avant l'oreille, et le silence ne sert plus à rien */
            st.phase === 'reponse'
              ? el('div', { class: 'ec-a selectable', html: it.a })
              : el('div', { class: 'ec-a vide', text: '· · ·' })
          ]));

          box.appendChild(el('div', { class: 'ec-cmd' }, [
            UI.btn('⏮', function () { sauter(-1); }, 'sm'),
            UI.btn(st.lecture ? '⏸  Pause' : '▶  Lecture', basculer, 'primary'),
            UI.btn('⏭', function () { sauter(1); }, 'sm'),
            el('span', { class: 'spacer' }),
            UI.btn('Je ne savais pas', pasSu, 'danger sm')
          ]));

          box.appendChild(el('div', { class: 'ec-reglages' }, [
            el('div', { class: 'fig-reglage' }, [
              el('label', { text: 'Voix' }),
              UI.select((window.Voix ? Voix.voix() : []).map(function (v) {
                return { value: v.name, label: v.name.replace(/^Microsoft /, '').replace(/ - French.*/, '') };
              }), st.voix, function (v) { st.voix = v; memoriser(); })
            ]),
            el('div', { class: 'fig-reglage' }, [
              el('label', { text: 'Vitesse' }),
              (function () {
                var s2 = el('span', { class: 'fig-val mono', text: st.vitesse.toFixed(2).replace('.', ',') + ' ×' });
                var r = el('input', { type: 'range', min: 0.7, max: 1.6, step: 0.05, value: st.vitesse,
                  'aria-label': 'Vitesse de lecture' });
                r.addEventListener('input', function () {
                  st.vitesse = parseFloat(r.value);
                  s2.textContent = st.vitesse.toFixed(2).replace('.', ',') + ' ×';
                  memoriser();
                });
                return el('span', { class: 'flex', style: { flex: 1, gap: '10px' } }, [r, s2]);
              })()
            ]),
            el('div', { class: 'fig-reglage' }, [
              el('label', { text: 'Silence' }),
              (function () {
                var s3 = el('span', { class: 'fig-val mono', text: st.silence + ' s' });
                var r = el('input', { type: 'range', min: 2, max: 12, step: 1, value: st.silence,
                  'aria-label': 'Durée du silence' });
                r.addEventListener('input', function () {
                  st.silence = parseInt(r.value, 10);
                  s3.textContent = st.silence + ' s';
                  memoriser();
                });
                return el('span', { class: 'flex', style: { flex: 1, gap: '10px' } }, [r, s3]);
              })()
            ])
          ]));

          box.appendChild(UI.keyhint([['Espace', 'lecture / pause'], ['→', 'suivant'], ['←', 'précédent'],
            ['N', 'je ne savais pas'], ['Échap', 'quitter']]));
        }

        function memoriser() {
          Store.setting('ecoute', { vitesse: st.vitesse, silence: st.silence, voix: st.voix });
        }

        UI.hotkeys(box, {
          ' ': basculer,
          'ArrowRight': function () { sauter(1); },
          'ArrowLeft': function () { sauter(-1); },
          'n': pasSu,
          'Escape': quitter
        });

        /* les voix arrivent de façon asynchrone : on attend avant de dessiner,
           sinon le sélecteur est vide au premier affichage */
        Voix.pret().then(function () {
          if (!st.voix) {
            var v = Voix.voix()[0];
            st.voix = v ? v.name : null;
          }
          draw();
          st.lecture = true;
          jouer();
        });

        decor(false);
        UI.clear(body);
        body.appendChild(el('div', {}, [
          el('div', { class: 'rc-head' }, [
            el('h2', { text: '🎧 ' + cfg.titre }),
            el('p', { class: 'muted small', text:
              pool.length + ' item' + (pool.length > 1 ? 's' : '') +
              ' · l’écran n’est plus nécessaire : écoutez, répondez à voix haute, vérifiez' })
          ]),
          box
        ]));
        document.getElementById('main').scrollTop = 0;
      }

      /* --- les deux entrées de l'écoute, calquées sur celles de la récitation --- */
      function voixPrete() {
        if (window.Voix && Voix.dispo()) return true;
        UI.toast('La synthèse vocale n’est pas disponible sur ce poste.');
        return false;
      }

      function ecouterUE(sem, u, opts) {
        opts = opts || {};
        if (!voixPrete()) return;
        var pool = poolFor(sem, u, opts);
        if (!pool.length) { UI.toast('Rien à écouter pour cette UE.'); return; }
        ecouteMode({
          pool: pool, titre: u.code + ' — ' + u.title, limit: opts.limit,
          retour: function () { ueSheet(sem, u); },
          reciter: function () { reciteMode(sem, u, opts); }
        });
      }

      function ecouterSemestre(sem, opts) {
        opts = opts || {};
        if (!voixPrete()) return;
        var pool = [];
        sem.ues.forEach(function (u) {
          if (!reciteItems(u).length) return;
          pool = pool.concat(poolFor(sem, u, { dueOnly: opts.dueOnly !== false }));
        });
        if (!pool.length) { UI.toast('Rien à revoir aujourd’hui sur ce semestre.'); return; }
        pool.sort(function (a, b) { return a.box - b.box || a._r - b._r; });
        ecouteMode({
          pool: pool, titre: 'Révision du jour — ' + sem.label, multi: true, limit: opts.limit || 25,
          retour: function () { drawSemester(sem.id); },
          reciter: function () { reciteSemestre(sem, opts); }
        });
      }

      /* ------------------------------------------------------------
         Le déroulé, commun aux deux entrées
         ------------------------------------------------------------ */
      function runRecite(cfg) {
        var pool = cfg.pool.slice();
        if (cfg.limit && pool.length > cfg.limit) pool = pool.slice(0, cfg.limit);

        var st = { i: 0, montre: false, ok: 0, moitie: 0, ko: 0, rates: [], montes: 0, tape: '' };
        var notes = {};           // index dans la file -> note donnée
        var debut = Date.now();
        var box = el('div', { class: 'rc' });
        var champ = null;         // champ de saisie de l'item courant
        var propose = null;       // note proposée par la comparaison

        /* une séance transversale touche plusieurs UE : chacune reçoit son
           entrée de récitation, calculée sur ses seuls items */
        function enregistrer() {
          var parUE = {};
          pool.forEach(function (it, k) {
            if (notes[k] === undefined) return;      // passé : ne compte pas
            var key = ueKey(it.sem, it.ue);
            var e = parUE[key] || (parUE[key] = { n: 0, pts: 0, ue: it.ue });
            e.n++;
            e.pts += notes[k] === 2 ? 1 : notes[k] === 1 ? 0.5 : 0;
          });
          Object.keys(parUE).forEach(function (k) {
            var e = parUE[k];
            var pct = Math.round((e.pts / e.n) * 100);
            Store.recite(k, { pct: pct, n: e.n });
            Store.logActivity('ue:' + e.ue.code, pct, { n: e.n });
          });
          return parUE;
        }

        function fin() {
          var total = st.ok + st.moitie + st.ko;
          var pct = total ? Math.round(((st.ok + st.moitie * 0.5) / total) * 100) : 0;
          var parUE = enregistrer();
          var minutes = Math.max(1, Math.round((Date.now() - debut) / 60000));
          var reste = cfg.reste ? cfg.reste() : 0;

          UI.clear(box);
          box.appendChild(UI.card('Séance terminée', [
            el('div', { class: 'grid g4' }, [
              UI.stat(st.ok, 'Sus', 'var(--green)'),
              UI.stat(st.moitie, 'Presque', 'var(--amber)'),
              UI.stat(st.ko, 'Oubliés', 'var(--red)'),
              UI.stat(pct + ' %', 'Score', masteryColor(pct))
            ]),
            el('p', { class: 'muted small', text:
              total + ' item' + (total > 1 ? 's' : '') + ' en ' + minutes + ' min · ' +
              st.montes + ' item' + (st.montes > 1 ? 's ont' : ' a') + ' monté d’une boîte.' }),

            el('div', {}, Object.keys(parUE).map(function (k) {
              var e = parUE[k];
              var mem = memoryOf(e.ue);
              var d = dueNow(e.ue);
              return el('div', { class: 'rc-ue-row' }, [
                el('b', { text: e.ue.code }),
                el('span', { class: 'muted small', text: e.n + ' item' + (e.n > 1 ? 's' : '') }),
                el('span', { class: 'spacer' }),
                el('span', { class: 'small', style: { color: masteryColor(mem.pct) },
                  text: 'mémoire ' + mem.pct + ' %' }),
                UI.chip(d ? d + ' encore dus' : 'à jour', d ? '' : 'green')
              ]);
            })),

            st.rates.length
              ? el('div', {}, [
                  el('h3', { text: 'À reprendre' }),
                  el('div', { class: 'ue-figures selectable' }, st.rates.map(function (m) {
                    return el('div', { class: 'ue-figure' }, [
                      el('span', { class: 'k', html: m.q }),
                      el('span', { class: 'v', html: m.a })
                    ]);
                  }))
                ])
              : UI.note('Tout est su. Ces items reviendront plus tard — c’est l’espacement qui installe.'),

            el('div', { class: 'btn-row' }, [
              st.rates.length ? UI.btn('↻ Reprendre les ' + st.rates.length + ' ratés', function () {
                runRecite({ pool: st.rates.slice(), titre: cfg.titre, multi: cfg.multi,
                  retour: cfg.retour, relance: cfg.relance, reste: cfg.reste });
              }, 'primary') : null,
              (reste && cfg.relance) ? UI.btn('Continuer — ' + reste + ' encore dus', function () {
                cfg.relance({ dueOnly: true, limit: cfg.limit });
              }) : null,
              UI.btn('← Retour', cfg.retour)
            ].filter(Boolean))
          ]));
          document.getElementById('main').scrollTop = 0;
        }

        function noter(q) {
          var it = pool[st.i];
          var avant = UEBank.boxOf(it.id);
          Store.reviewCard(it.id, q);
          notes[st.i] = q;
          if (UEBank.boxOf(it.id) > avant) st.montes++;
          if (q === 2) st.ok++;
          else if (q === 1) { st.moitie++; st.rates.push(it); }
          else { st.ko++; st.rates.push(it); }
          st.i++; st.montre = false; st.tape = ''; propose = null;
          draw();
        }

        function reveler() {
          st.tape = champ ? champ.value : '';
          propose = autoNote(pool[st.i].a, st.tape);
          st.montre = true;
          draw();
        }

        function passer() {
          st.i++; st.montre = false; st.tape = ''; propose = null;
          draw();
        }

        function draw() {
          UI.clear(box);
          if (st.i >= pool.length) { fin(); return; }
          var it = pool[st.i];
          var bx = UEBank.boxOf(it.id);

          /* --- barre fine : où j'en suis, et rien d'autre --- */
          box.appendChild(el('div', { class: 'rc-top' }, [
            el('span', { class: 'rc-count mono', text: (st.i + 1) + ' / ' + pool.length }),
            el('span', { class: 'rc-bar' }, el('i', { style: { width: (st.i / pool.length * 100) + '%' } })),
            cfg.multi ? el('span', { class: 'rc-ue', text: it.ue.code }) : null,
            el('span', { class: 'rc-kind', text: RECITE_SHORT[it.kind] || 'question' }),
            el('span', { class: 'rc-box' + (bx >= 4 ? ' ok' : ''), title: 'Boîte ' + bx + ' sur 5',
              text: puces(bx) }),
            UI.btn('✕', function () { cfg.retour(); }, 'sm rc-quit')
          ].filter(Boolean)));

          /* --- la scène --- */
          var scene = el('div', { class: 'rc-stage' }, [
            el('div', { class: 'rc-q selectable', html: it.q })
          ]);

          if (!st.montre) {
            champ = el('input', {
              type: 'text', class: 'inp rc-in', autocomplete: 'off', spellcheck: 'false',
              placeholder: 'Votre réponse…', 'aria-label': 'Votre réponse'
            });
            champ.value = st.tape;
            champ.addEventListener('keydown', function (e) {
              if (e.key === 'Enter') { e.preventDefault(); reveler(); }
              else if (e.key === 'Escape') { e.preventDefault(); cfg.retour(); }
            });
            scene.appendChild(champ);
            scene.appendChild(el('div', { class: 'rc-hint', text:
              'Écrivez-la, ou dites-la à voix haute — puis Entrée pour vérifier.' }));
          } else {
            champ = null;
            if (st.tape.trim()) {
              scene.appendChild(el('div', { class: 'rc-yours' }, [
                el('span', { class: 'k', text: 'Vous' }),
                el('span', { class: 'v', text: st.tape })
              ]));
            }
            scene.appendChild(el('div', { class: 'rc-ans selectable' }, [
              el('span', { class: 'k', text: 'Attendu' }),
              el('span', { class: 'v', html: it.a })
            ]));
            if (propose) {
              scene.appendChild(el('div', { class: 'rc-auto ' + ['ko', 'mid', 'ok'][propose.note],
                text: propose.pourquoi + ' — vous gardez la main.' }));
            }
          }
          box.appendChild(scene);

          /* --- noter, ou vérifier --- */
          if (st.montre) {
            box.appendChild(el('div', { class: 'rc-grade' }, [
              { q: 0, l: 'Oublié', c: 'danger' },
              { q: 1, l: 'Presque', c: '' },
              { q: 2, l: 'Su', c: 'primary' }
            ].map(function (n) {
              return UI.btn((n.q + 1) + ' · ' + n.l, function () { noter(n.q); },
                n.c + (propose && propose.note === n.q ? ' suggere' : ''));
            })));
            /* annoncer l'échéance de chaque note : c'est ce qui rend la
               répétition espacée compréhensible, et ce qui décourage de
               cliquer « Su » par facilité */
            box.appendChild(el('div', { class: 'rc-next muted small', text:
              'Entrée valide « ' + ['Oublié', 'Presque', 'Su'][propose ? propose.note : 2] + ' ». ' +
              'Su → revient ' + joursTexte(Store.boxIntervals[Math.min(5, bx + 1)]) +
              ' · Presque → ' + joursTexte(Store.boxIntervals[bx]) +
              ' · Oublié → aujourd’hui' }));
          } else {
            box.appendChild(el('div', { class: 'rc-grade' }, [
              UI.btn('Vérifier', reveler, 'primary'),
              UI.btn('Passer', passer, 'sm')
            ]));
          }

          /* le champ prend le focus : on enchaîne sans jamais toucher la souris */
          if (champ) setTimeout(function () { if (champ && champ.isConnected) champ.focus(); }, 20);
        }

        UI.hotkeys(box, {
          'Enter': function () {
            if (st.i >= pool.length) return;
            if (!st.montre) reveler();
            else noter(propose ? propose.note : 2);
          },
          ' ': function () { if (st.i < pool.length && !st.montre) reveler(); },
          '1': function () { if (st.montre) noter(0); },
          '2': function () { if (st.montre) noter(1); },
          '3': function () { if (st.montre) noter(2); },
          'ArrowRight': function () { if (st.i < pool.length) passer(); },
          'Escape': function () { cfg.retour(); }
        });

        draw();
        decor(false);
        UI.clear(body);
        body.appendChild(el('div', {}, [
          el('div', { class: 'rc-head' }, [
            el('h2', { text: '🎤 ' + cfg.titre }),
            el('p', { class: 'muted small', text:
              pool.length + ' item' + (pool.length > 1 ? 's' : '') +
              ' · répondez avant de vérifier, c’est tout l’intérêt' })
          ]),
          box,
          UI.keyhint([['Entrée', 'vérifier, puis noter'], ['1 2 3', 'oublié / presque / su'],
                      ['→', 'passer'], ['Échap', 'quitter']])
        ]));
        document.getElementById('main').scrollTop = 0;
      }

      /* ---------------- fiche d'UE ---------------- */
      /* keep : redessiner la fiche sans bouger la page. Marquer une partie de
         cours comme vue change l'en-tête, le parcours et la progression : on
         redessine tout, mais l'étudiant doit rester où il lisait. */
      function ueSheet(sem, u, keep) {
        decor(true);
        var g = guideOf(u);
        var m = mastery(sem, u);
        /* À l'ouverture d'une fiche : le cours tant qu'on ne l'a pas travaillée,
           l'essentiel dès qu'on y est revenu. Un changement d'onglet fait par
           l'étudiant, lui, survit aux redessins. */
        if (!keep) {
          sheetPane = (memoryOf(u).seen || Store.ueNote(ueKey(sem, u))) ? 'essentiel' : 'cours';
        }
        var key = ueKey(sem, u);
        var l = u.links || {};

        function list(title, items, cls) {
          if (!items || !items.length) return null;
          return el('div', {}, [
            el('h3', { text: title }),
            el('ul', { class: cls || '' }, items.map(function (t) { return el('li', { html: t }); }))
          ]);
        }

        var chips = [];
        linkedMods(u).forEach(function (id) {
          chips.push(el('span', { class: 'chip', text: (M[id].icon || '') + ' ' + M[id].title, onClick: function () { App.go(id); } }));
        });
        (l.calc || []).forEach(function (id) {
          chips.push(el('span', { class: 'chip', text: '🧮 ' + (CALC_NAMES[id] || id), onClick: function () { App.go('converters', { calc: id }); } }));
        });
        (l.chap || []).forEach(function (id) {
          chips.push(el('span', { class: 'chip', text: '📚 ' + chapName(id), onClick: function () { App.go('theory', { chapter: id }); } }));
        });

        /* aller directement à une carte de la fiche, depuis le parcours */
        /* aller à une carte, y compris dans un volet qui n'est pas affiché */
        function gotoSection(title) {
          var cards = body.querySelectorAll('.card');
          for (var i = 0; i < cards.length; i++) {
            var h = cards[i].querySelector(':scope > .flex > h2');
            if (!h || h.textContent !== title) continue;
            var pane = cards[i].closest ? cards[i].closest('.ue-pane') : null;
            if (pane && showPane) showPane(pane.dataset.pane);
            scrollCardIntoView(cards[i]);
            return;
          }
        }

        /* la recherche interne à la fiche : construite ici, branchée plus bas,
           une fois que `page` existe et que les volets sont en place */
        var findIn = el('input', {
          type: 'search', class: 'inp ue-find',
          placeholder: 'Chercher dans cette fiche…',
          'aria-label': 'Chercher dans cette fiche'
        });
        var findOut = el('span', { class: 'small muted ue-find-out' });

        UI.clear(body);
        var page = el('div', {}, [
          UI.card(null, [
            el('div', { class: 'flex wrap' }, [
              UI.btn('← Retour au semestre', function () { drawSemester(sem.id); }),
              UI.btn('🖨 Imprimer', function () { window.print(); }, 'sm'),
              UI.btn('⬇ Exporter (.md)', function () { exportSheet(sem, u); }, 'sm'),
              findIn,
              findOut,
              el('span', { class: 'spacer' }),
              UI.chip(sem.label, 'blue'),
              UI.chip(u.ects + ' ECTS'),
              u.h ? UI.chip(u.h + ' h — ' + u.cm + ' CM / ' + u.td + ' TD' + (u.tp ? ' / ' + u.tp + ' TP' : '')) : null
            ].filter(Boolean)),
            el('h2', { style: { marginBottom: '2px' }, text: u.code + ' — ' + u.title }),
            el('div', { class: 'flex wrap mt16', style: { gap: '18px' } }, [
              UI.ring(m.pct === null ? 0 : m.pct, { size: 76, width: 8, color: masteryColor(m.pct),
                text: m.pct === null ? '—' : m.pct + '%', fontSize: 13 }),
              el('div', {}, [
                el('div', { class: 'muted small', text: 'Votre maîtrise estimée' }),
                el('div', { style: { fontSize: '17px', fontWeight: '650', color: masteryColor(m.pct) }, text: masteryLabel(m.pct) }),
                el('div', { class: 'small muted', text: m.pct === null
                  ? 'Cette UE n’a pas d’équivalent dans l’application : cochez-la quand vous l’avez révisée.'
                  : 'Calculée sur ce que vous tenez en mémoire, vos QCM et vos scores dans les modules liés.' })
              ]),
              el('span', { class: 'spacer' }),
              (function () {
                var b = UI.btn(m.revised ? '✓ Révisée' : 'Marquer comme révisée', function () {
                  Store.ueDone(key, !Store.ueDone(key));
                  ueSheet(sem, u);
                }, m.revised ? 'primary' : '');
                return b;
              })()
            ]),

            /* le détail : ce qui manque exactement pour monter */
            m.detail && m.detail.length ? el('div', { class: 'ue-detail' }, m.detail.map(function (d) {
              return el('div', { class: 'ue-detail-row' }, [
                el('span', { class: 'k', text: d.k }),
                el('span', { class: 'b' }, UI.bar(d.pct, masteryColor(d.pct))),
                el('span', { class: 'p', style: { color: masteryColor(d.pct) }, text: d.pct + ' %' }),
                el('span', { class: 'h', text: d.hint })
              ]);
            })) : null
          ].filter(Boolean), { class: 'ue-head-card' }),

          /* --- l'essentiel : toute l'UE en un écran ---
             Ce qu'on relit la veille au soir : une phrase, les chiffres, ce qu'il
             ne faut pas oublier, les pièges. Rien d'inédit — une sélection, pour
             que la révision de dernière minute ne consiste pas à parcourir
             dix-huit cartes. */
          (function () {
            if (!g) return null;
            var chiffres = (g.chiffres || []).slice(0, 6);
            var notions = (g.notions || []).slice(0, 3);
            var pieges = (g.pieges || []).slice(0, 3);
            var deep = DEEP[u.code] || {};
            var mnemo = (deep.mnemo || [])[0];
            if (!chiffres.length && !notions.length && !pieges.length) return null;

            function bloc(titre, node) {
              return el('div', { class: 'ue-ess-bloc' }, [
                el('div', { class: 'ue-ess-h', text: titre }),
                node
              ]);
            }

            return UI.card('L’essentiel', [
              g.resume ? el('p', { class: 'ue-ess-lead selectable', html: g.resume }) : null,
              el('div', { class: 'ue-ess' }, [
                chiffres.length ? bloc('Les chiffres', el('div', { class: 'ue-figures selectable' },
                  chiffres.map(function (c) {
                    return el('div', { class: 'ue-figure' }, [
                      el('span', { class: 'k', html: c[0] }),
                      el('span', { class: 'v', html: c[1] })
                    ]);
                  }))) : null,
                el('div', {}, [
                  notions.length ? bloc('À ne pas oublier', el('ul', { class: 'ue-notions selectable' },
                    notions.map(function (t) { return el('li', { html: t }); }))) : null,
                  pieges.length ? bloc('Les pièges', el('ul', { class: 'ue-ess-trap selectable' },
                    pieges.map(function (t) { return el('li', { html: t }); }))) : null
                ].filter(Boolean))
              ].filter(Boolean)),
              mnemo ? el('div', { class: 'ue-ess-mnemo selectable' }, [
                el('span', { class: 'm', html: mnemo[0] }),
                el('span', { class: 'd', html: mnemo[1] })
              ]) : null,
              el('div', { class: 'flex wrap ue-ess-foot' }, [
                el('span', { class: 'muted small', text: 'Vue condensée — le détail est dans les autres onglets.' }),
                el('span', { class: 'spacer' }),
                (function () {
                  /* le bouton dit ce qu'il y a à faire maintenant : réviser
                     l'échéance du jour, ou lancer une première série */
                  if (!memoryOf(u).total) return null;
                  var due = dueNow(u);
                  return due
                    ? UI.btn('🎤 Revoir les ' + due + ' items dus',
                        function () { reciteMode(sem, u, { dueOnly: true, limit: 20 }); }, 'sm primary')
                    : UI.btn('🎤 Se faire interroger',
                        function () { reciteMode(sem, u, { limit: 20 }); }, 'sm primary');
                })()
              ].filter(Boolean))
            ].filter(Boolean));
          })(),

          /* --- mes notes ---
             La seule partie de la fiche que l'application n'écrit pas : ce que le
             formateur a insisté, une précision de TD, un point à reprendre. Elle
             suit la fiche partout — impression et export compris — et se cherche
             depuis « Toutes les UE » : une note qu'on ne retrouve pas n'existe pas.
             L'enregistrement se fait à la frappe, sans bouton : personne ne pense
             à sauvegarder une note qu'il est en train d'écrire. */
          (function () {
            var saved = Store.ueNote(key);
            var at = Store.ueNoteAt(key);
            var ta = el('textarea', {
              class: 'inp ue-note', rows: '5', text: saved,
              placeholder: 'Ce que le formateur a insisté, une formule dite en cours, ' +
                'un point à reprendre, une question à poser au prochain TD…'
            });
            /* le double imprimable : un textarea sort tronqué à sa hauteur
               visible, la note serait amputée sur le papier */
            var printed = el('div', { class: 'ue-note-print', text: saved });
            var state = el('span', { class: 'small muted',
              text: at ? 'Enregistré le ' + new Date(at).toLocaleDateString('fr-FR') : 'Rien pour l’instant' });
            var timer = null;
            function flush() {
              clearTimeout(timer); timer = null;
              Store.ueNote(key, ta.value);
              printed.textContent = ta.value;
              state.textContent = ta.value.trim() ? 'Enregistré' : 'Rien pour l’instant';
            }
            ta.addEventListener('input', function () {
              state.textContent = 'Modification…';
              clearTimeout(timer);
              timer = setTimeout(flush, 500);
            });
            ta.addEventListener('blur', function () { if (timer) flush(); });

            return UI.card('Mes notes', [
              ta,
              printed,
              el('div', { class: 'flex wrap', style: { marginTop: '8px', gap: '10px' } }, [
                state,
                el('span', { class: 'spacer' }),
                el('span', { class: 'muted small', text: 'Imprimée et exportée avec la fiche' })
              ])
            ], { right: saved ? UI.chip('📝 notée', 'green') : null });
          })(),

          /* --- par où commencer : le parcours de révision de cette UE ---
             La même question revient à chaque fois : « je fais quoi, dans quel
             ordre ? ». Les étapes suivent l'ordre d'apprentissage — comprendre,
             mémoriser, se tester, appliquer, composer — et affichent où l'on en est. */
          (function () {
            var prefix = cardPrefix(sem, u);
            var chiffreIds = Cards.all().filter(function (c) { return c.id.indexOf(prefix) === 0; })
              .map(function (c) { return c.id; });
            var items = reciteItems(u).length;
            var cases = casList(u.code).length;
            var qcmPool = (l.cats && l.cats.length)
              ? (window.QUIZ || []).filter(function (q) { return l.cats.indexOf(q.cat) >= 0; }).length : 0;
            var det = {};
            (m.detail || []).forEach(function (d) { det[d.act] = d; });
            var steps = [];

            if (g && g.plan) {
              var nCle = (COURS[u.code] || []).filter(function (c) { return c && c.cle; }).length;
              steps.push({
                ic: '📖', t: 'Lire le cours en condensé',
                d: g.plan.length + ' parties' +
                   (nCle ? ', chacune avec son image, son exemple clinique et sa phrase à retenir.'
                         : ', puis les chiffres, les pièges et ce qui tombe.'),
                state: m.revised ? UI.chip('marquée révisée', 'green') : null,
                btn: 'Lire', run: function () { gotoSection('Le cours en condensé'); }
              });
            }
            if (chiffreIds.length) {
              var known = chiffreIds.filter(function (id) {
                var c = Store.state.srs[id]; return c && c.box >= 4;
              }).length;
              steps.push({
                ic: '🔢', t: 'Mémoriser les chiffres',
                d: chiffreIds.length + ' valeurs à connaître par cœur, en répétition espacée.',
                state: UI.chip(known + '/' + chiffreIds.length + ' mémorisés',
                  known === chiffreIds.length ? 'green' : known ? 'amber' : ''),
                btn: 'Réviser', run: function () {
                  App.closeModule._after = function () { ueSheet(sem, u); };
                  App.openModule('flashcards', { ids: chiffreIds }, { subtitle: u.code + ' — les chiffres' });
                }
              });
            }
            if (items) {
              var mem = memoryOf(u);
              var dueItems = dueNow(u);
              steps.push({
                ic: '🎤', t: 'Se faire interroger',
                d: items + ' items : chiffres, questions, lignes de tableau, mnémotechniques. ' +
                   (mem.seen ? mem.known + ' installé' + (mem.known > 1 ? 's' : '') + ' en mémoire.'
                             : 'Chacun entre ensuite en répétition espacée.'),
                state: !mem.seen ? UI.chip('jamais fait')
                     : dueItems ? UI.chip(dueItems + ' à revoir', 'violet')
                     : UI.chip('à jour', 'green'),
                btn: dueItems ? 'Réviser' : 'Réciter',
                run: function () { reciteMode(sem, u, dueItems ? { dueOnly: true, limit: 20 } : { limit: 20 }); }
              });
            }
            if (qcmPool) steps.push({
              ic: '❓', t: 'Répondre aux QCM de ses thèmes',
              d: qcmPool + ' questions sur ' + l.cats.join(', ') + '.',
              state: det.qcm ? UI.chip(det.qcm.pct + ' %', det.qcm.pct >= 70 ? 'green' : det.qcm.pct ? 'amber' : '') : null,
              btn: 'Répondre', run: function () { App.go('quiz', { cats: l.cats, n: 15 }); }
            });
            if (cases) steps.push({
              ic: '🩺', t: 'Traiter les cas d’application',
              d: cases + ' cas : énoncé, questions, puis le raisonnement attendu.',
              btn: 'S’entraîner', run: function () { casMode(sem.id, u.code, function () { ueSheet(sem, u); }); }
            });
            if (qcmPool) steps.push({
              ic: '⏱', t: 'Passer l’épreuve',
              d: 'Un examen blanc chronométré, limité aux thèmes de cette UE.',
              btn: 'Composer', run: function () { App.go('exam', { cats: l.cats, label: u.code + ' — ' + u.title }); }
            });
            /* UE sans contenu dans l'application (anglais, UE libre) : le dire,
               plutôt que de laisser une fiche muette. */
            if (!steps.length) {
              return UI.card('Réviser cette UE', UI.note('Cette UE relève de vos cours et de vos stages : ' +
                'l’application ne la couvre pas. Rien à réviser ici — servez-vous de vos supports de formation.', 'warn'));
            }

            return UI.card('Réviser cette UE', [
              el('p', { class: 'muted small mt0',
                text: 'Comprendre, mémoriser, se tester, appliquer, composer. Chaque étape dit où vous en êtes.' }),
              el('div', {}, steps.map(function (st, i) {
                return el('div', { class: 'sess-step' }, [
                  el('div', { class: 'si', text: st.ic }),
                  el('div', { style: { minWidth: 0 } }, [
                    el('div', { class: 'st', text: (i + 1) + ' · ' + st.t }),
                    el('div', { class: 'sd', text: st.d })
                  ]),
                  el('div', { class: 'sa' }, [st.state || null, UI.btn(st.btn, st.run, 'sm')].filter(Boolean))
                ]);
              })),
              chips.length ? el('div', { style: { marginTop: '16px' } }, [
                el('div', { class: 'muted small mb8', text: 'Ce que l’application couvre de cette UE' }),
                el('div', { class: 'flex wrap', style: { gap: '7px' } }, chips)
              ]) : null
            ].filter(Boolean));
          })(),

          /* --- réciter : mis en tête, c'est le geste le plus rentable --- */
          reciteItems(u).length ? (function () {
            var total = reciteCount(u);
            var mem = memoryOf(u);
            var due = dueNow(u);
            var history = Store.reciteHistory(key);
            var lenSel = UI.select([
              { value: '20', label: '20 items — session courte' },
              { value: '40', label: '40 items' },
              { value: '0', label: 'Tout (' + total + ')' }
            ], '20', null);
            function go(opts) {
              opts = opts || {};
              opts.limit = parseInt(lenSel.value, 10) || 0;
              reciteMode(sem, u, opts);
            }
            /* `n` porte le nom au pluriel : on ne le déduit pas du libellé, une
               émoji ne fait pas toujours le même nombre de caractères */
            var kinds = [
              { k: 'chiffre', label: '🔢 Chiffres', n: 'chiffres' },
              { k: 'question', label: '💬 Questions', n: 'questions' },
              { k: 'tableau', label: '📊 Tableaux', n: 'lignes de tableau' },
              { k: 'mnemo', label: '🧠 Mnémo', n: 'mnémotechniques' },
              { k: 'cle', label: '⚑ Phrases clés', n: 'phrases clés du cours' }
            ].filter(function (x) { return reciteCount(u, x.k); });
            return UI.card('Se faire interroger', [
              el('p', { class: 'muted small', style: { marginTop: 0 },
                html: 'Se relire donne le sentiment de savoir ; se faire interroger dit ce qu’on sait vraiment. ' +
                  '<b>' + total + ' items</b> — ' +
                  kinds.map(function (x) { return reciteCount(u, x.k) + ' ' + x.n; }).join(', ') +
                  '. Chacun a sa propre échéance : répondre juste le repousse, se tromper le ramène.' }),
              el('div', { class: 'flex wrap', style: { gap: '18px', alignItems: 'center' } }, [
                UI.ring(mem.pct, { size: 64, width: 7, color: masteryColor(mem.pct),
                  text: mem.pct + '%', fontSize: 12 }),
                el('div', { style: { flex: 1, minWidth: '240px' } }, [
                  el('div', { class: 'muted small', text: 'Ce qui est installé en mémoire' }),
                  boxBar(mem)
                ])
              ]),
              !mem.seen
                ? UI.note('Cette UE n’a jamais été récitée. La première série ne mesure rien — ' +
                    'elle installe : chaque item entre alors dans le cycle et vous revient au bon moment.')
                : due
                  ? UI.note('<b>' + due + ' item' + (due > 1 ? 's sont dus' : ' est dû') + ' aujourd’hui.</b> ' +
                      'C’est exactement le moment où les revoir coûte le moins et rapporte le plus.')
                  : UI.note('Rien à revoir aujourd’hui sur cette UE — l’espacement fait son travail. ' +
                      'Vous pouvez tout de même reprendre la série entière avant une épreuve.'),
              history.length > 1 ? sparkline(history) : null,
              el('div', { class: 'btn-row' }, [
                due
                  ? UI.btn('🎤 Réviser les ' + due + ' items dus', function () { go({ dueOnly: true }); }, 'primary')
                  : UI.btn('🎤 Réciter', function () { go(); }, 'primary'),
                due ? UI.btn('Tout reprendre', function () { go(); }) : null,
                UI.btn('🎧 Écouter', function () {
                  ecouterUE(sem, u, { dueOnly: !!due, limit: parseInt(lenSel.value, 10) || 0 });
                }),
                lenSel,
                el('span', { class: 'spacer' })
              ].filter(Boolean).concat(kinds.map(function (x) {
                return UI.btn(x.label, function () { go({ only: x.k }); }, 'sm');
              })))
            ].filter(Boolean));
          })() : null,

          g && g.resume ? UI.note('<b>En une phrase.</b> ' + g.resume) : null,

          g ? UI.card('Ce que cette UE attend de vous', el('ul', {}, g.objectifs.map(function (t) { return el('li', { text: t }); }))) : null,

          /* ============================================================
             Le cours en condensé
             ------------------------------------------------------------
             Un paragraphe juste et dense se lit comme un poly — donc ne se
             retient pas. Chaque partie porte donc, sous sa matière, les
             couches d'uecours.js : l'image qui reste, ce que ça donne en
             consultation, l'erreur qu'on fait exactement là, et la phrase
             à retenir. L'ordre est toujours le même — comprendre, voir,
             éviter, retenir — pour que l'œil sache où aller.
             Un sommaire numéroté ouvre la partie voulue sans faire défiler.
             ============================================================ */
          g && g.plan ? (function () {
            var cours = COURS[u.code] || [];
            var nodes = [];

            function shortTitle(t) { return String(t).replace(/^\s*\d+\s*·\s*/, ''); }
            function words(s) {
              return String(s || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
            }

            /* ~200 mots par minute : de quoi décider si on ouvre cette partie
               maintenant ou après le prochain cours. */
            var total = 0;
            g.plan.forEach(function (p, i) {
              var c = cours[i] || {};
              total += words(p.p) + words(c.img) + words(c.ex) + words(c.err) + words(c.cle);
            });
            var minutes = Math.max(1, Math.round(total / 200));

            var BLOCS = [
              { k: 'img', ic: '💡', t: 'L’image qui reste', cls: 'img' },
              { k: 'ex', ic: '🩺', t: 'En consultation', cls: 'ex' },
              { k: 'err', ic: '⚠️', t: 'L’erreur classique', cls: 'err' }
            ];

            /* le schéma, quand la partie en porte un : après la matière, avant
               les encarts — on lit, on voit, puis on retient.

               Certains schémas sont « vivants » : ils déclarent des réglages,
               et se redessinent à chaque mouvement. Un schéma juste s'oublie ;
               un schéma qu'on a tordu reste. L'assemblage — dessin, curseurs,
               phrase, légende — vit dans uefigs.js, qui le sert aussi au
               répétiteur : deux copies, c'est une seule des deux corrigée. */
            function figure(c) {
              return c.fig && window.UEFigs ? UEFigs.bloc(c.fig) : null;
            }

            /* ------------------------------------------------------------
               « Mon cours dit autre chose »
               ------------------------------------------------------------
               Le contenu de ces fiches n'est adossé à aucune source citée :
               il vient de ce que l'application sait, pas d'un référentiel
               qu'on pourrait aller vérifier. Quand le formateur dit autre
               chose, c'est lui qui a raison.

               Une fiche qu'on ne peut pas amender oblige alors l'étudiant à
               se rappeler, à chaque révision, quels passages sont faux pour
               lui. Écrite une fois, la correction prime partout : ici, dans
               le répétiteur, et à l'impression.
               ------------------------------------------------------------ */
            function correction(code, i, titre) {
              var zone = el('div', { class: 'uc-corr-zone' });

              function peindre() {
                UI.clear(zone);
                var t = Store.correction(code, i);
                if (!t) {
                  zone.appendChild(el('div', { class: 'uc-demander' }, [
                    el('button', {
                      class: 'ch-puce', text: '✏️  Mon cours dit autre chose',
                      onClick: editer
                    })
                  ]));
                  return;
                }
                var at = Store.correctionAt(code, i);
                zone.appendChild(el('div', { class: 'uc-corr' }, [
                  el('div', { class: 'uc-corr-h' }, [
                    el('span', { class: 'i', text: '✏️' }),
                    el('span', { text: 'Votre correction' }),
                    el('span', { class: 'spacer' }),
                    el('span', { class: 'uc-corr-d',
                      text: at ? new Date(at).toLocaleDateString('fr-FR') : '' })
                  ]),
                  el('p', { text: t }),
                  el('div', { class: 'btn-row' }, [
                    UI.btn('Modifier', editer, 'sm'),
                    UI.btn('Retirer', function () {
                      Store.correction(code, i, '');
                      peindre();
                      UI.toast('Correction retirée.');
                    }, 'sm')
                  ])
                ]));
              }

              function editer() {
                UI.clear(zone);
                var ta = el('textarea', {
                  class: 'uc-corr-ta', rows: 4,
                  placeholder: 'Ce que dit votre cours sur « ' + titre + ' »…'
                });
                ta.value = Store.correction(code, i);
                zone.appendChild(el('div', { class: 'uc-corr edit' }, [
                  el('div', { class: 'uc-corr-h' }, [
                    el('span', { class: 'i', text: '✏️' }),
                    el('span', { text: 'Ce que dit votre cours' })
                  ]),
                  ta,
                  el('p', { class: 'muted small',
                    text: 'Elle s’affichera en tête de cette partie, et le répétiteur la citera avant la fiche.' }),
                  el('div', { class: 'btn-row' }, [
                    UI.btn('Enregistrer', function () {
                      Store.correction(code, i, ta.value);
                      peindre();
                      UI.toast(ta.value.trim() ? 'Correction enregistrée.' : 'Correction retirée.');
                    }, 'sm primary'),
                    UI.btn('Annuler', peindre, 'sm')
                  ])
                ]));
                ta.focus();
              }

              peindre();
              return zone;
            }

            var box = el('div', { class: 'selectable' }, g.plan.map(function (p, i) {
              var c = cours[i] || {};
              var node = el('div', { class: 'ue-chapter' }, [
                el('div', { class: 'uc-head' }, [
                  el('span', { class: 'uc-n', text: String(i + 1) }),
                  el('h4', { text: shortTitle(p.t) })
                ]),
                /* en tête : si l'étudiant a corrigé, sa version se lit avant la nôtre */
                Store.correction(u.code, i)
                  ? el('div', { class: 'uc-corr lu' }, [
                      el('div', { class: 'uc-corr-h' }, [
                        el('span', { class: 'i', text: '✏️' }),
                        el('span', { text: 'Votre cours dit' })
                      ]),
                      el('p', { text: Store.correction(u.code, i) })
                    ])
                  : null,
                el('p', { html: p.p }),
                figure(c)
              ].filter(Boolean).concat(BLOCS.filter(function (b) { return c[b.k]; }).map(function (b) {
                return el('div', { class: 'uc-bloc ' + b.cls }, [
                  el('div', { class: 'uc-bloc-h' }, [
                    el('span', { class: 'i', text: b.ic }),
                    el('span', { text: b.t })
                  ]),
                  el('p', { html: c[b.k] })
                ]);
              })).concat([
                c.cle ? el('div', { class: 'uc-cle' }, [
                  el('span', { class: 'k', text: 'À retenir' }),
                  el('p', { html: c.cle })
                ]) : null,
                /* Le geste qui manquait : la fiche dit ce qu'il faut savoir, elle ne
                   sait pas débloquer quelqu'un. Cette ligne passe la partie au
                   répétiteur, qui la reprend par son analogie, son schéma et son
                   piège — et qui accepte ensuite les questions de suite. */
                el('div', { class: 'uc-demander' }, [
                  el('button', {
                    class: 'ch-puce', text: '🤔  Je n’ai pas compris cette partie',
                    onClick: function () {
                      /* le titre de partie devient un complément d’objet : il perd sa
                         majuscule, sinon la phrase se lit « compris Les amétropies » */
                      var t = shortTitle(p.t);
                      App.demander('Je n’ai pas compris ' + t.charAt(0).toLowerCase() + t.slice(1));
                    }
                  })
                ]),
                correction(u.code, i, shortTitle(p.t))
              ].filter(Boolean)));
              nodes.push(node);
              return node;
            }));

            /* le sommaire : on ouvre la partie qu'on cherche, on ne la
               cherche pas en faisant défiler six écrans */
            var som = el('div', { class: 'uc-som' }, g.plan.map(function (p, i) {
              return el('span', {
                class: 'uc-som-i', title: shortTitle(p.t),
                onClick: function () { scrollCardIntoView(nodes[i]); }
              }, [
                el('b', { text: String(i + 1) }),
                el('span', { text: shortTitle(p.t) })
              ]);
            }));

            var enrichies = cours.filter(function (c) { return c && Object.keys(c).length; }).length;

            /* D'où vient ce plan, dit à l'endroit où on le lit — pas dans une
               page d'aide que personne n'ouvre. L'application n'a reçu que
               l'intitulé de l'UE, ses heures et ses crédits : le découpage en
               parties est une reconstruction de ce qu'un cours portant ce nom
               couvre d'ordinaire. Le taire serait laisser croire à un
               programme officiel. */
            var corriges = Store.correctionsDe(u.code);
            var provenance = el('div', { class: 'ue-source' }, [
              el('div', { html:
                '<b>D’où vient ce plan.</b> L’application connaît l’intitulé de cette UE, son volume et ses ' +
                'crédits — rien de plus. Le découpage en ' + g.plan.length + ' parties et leur contenu sont une ' +
                '<b>reconstruction</b> de ce qu’un cours portant ce nom couvre habituellement, et non le ' +
                'programme de votre formateur. Aucune source n’est citée parce qu’il n’y en a pas.' }),
              el('div', { style: { marginTop: '6px' }, html: corriges
                ? '<b>' + corriges + ' partie' + (corriges > 1 ? 's' : '') + ' corrigée' + (corriges > 1 ? 's' : '') +
                  '</b> par vos soins. Vos corrections priment ici, dans le répétiteur et à l’impression.'
                : 'Quand votre cours dit autre chose, écrivez-le : le bouton <b>« Mon cours dit autre chose »</b> ' +
                  'sous chaque partie remplace définitivement la nôtre.' })
            ]);

            return UI.card('Le cours en condensé', [
              el('p', { class: 'muted small mt0', html:
                '<b>' + g.plan.length + ' parties</b>, environ <b>' + minutes + ' min</b> de lecture. ' +
                (enrichies
                  ? 'Sous chaque partie : l’image qui la fait tenir, ce qu’elle donne devant un patient, ' +
                    'l’erreur qu’on y fait, et la phrase à retenir.'
                  : '') }),
              provenance,
              som,
              box
            ], { right: UI.chip(g.plan.length + ' parties · ' + minutes + ' min') });
          })() : null,

          /* --- place dans le cursus --- */
          (function () {
            var e = EXTRA[u.code];
            var before = (e && e.prereq || []).map(function (c) { return locate(c); }).filter(Boolean);
            var after = (OPENS[u.code] || []).map(function (c) { return locate(c); }).filter(Boolean);
            if (!before.length && !after.length) return null;

            function chipsFor(list, cls) {
              return list.map(function (x) {
                var mm = mastery(x.sem, x.ue);
                return el('span', {
                  class: 'chip ' + cls, title: x.sem.label + ' — ' + x.ue.title,
                  onClick: function () { ueSheet(x.sem, x.ue); }
                }, [
                  el('i', { class: 'ue-dot', style: { background: masteryColor(mm.pct) } }),
                  el('span', { text: x.ue.code })
                ]);
              });
            }

            var weak = before.filter(function (x) {
              var mm = mastery(x.sem, x.ue);
              return mm.pct !== null && mm.pct < 40;
            });

            return UI.card('Sa place dans le cursus', [
              before.length ? el('div', { class: 'flex wrap ue-chain' }, [
                el('span', { class: 'ue-chain-k', text: 'Repose sur' })
              ].concat(chipsFor(before, ''))) : null,
              after.length ? el('div', { class: 'flex wrap ue-chain' }, [
                el('span', { class: 'ue-chain-k', text: 'Prépare' })
              ].concat(chipsFor(after, ''))) : null,
              weak.length
                ? UI.note('<b>Attention à l’ordre.</b> ' + weak.map(function (x) { return x.ue.code; }).join(', ') +
                    ' n’est pas encore solide, et cette UE s’appuie dessus. Reprendre le prérequis d’abord coûte ' +
                    'moins cher que de buter dessus à chaque chapitre.', 'warn')
                : null
            ].filter(Boolean));
          })(),

          g && g.chiffres ? (function () {
            /* Ces mêmes chiffres existent déjà en fiches mémo (Cards.generated) :
               les réviser ici, c'est les faire entrer dans la répétition espacée. */
            var prefix = cardPrefix(sem, u);
            var ids = Cards.all().filter(function (c) { return c.id.indexOf(prefix) === 0; })
              .map(function (c) { return c.id; });

            /* Une colonne de valeurs affichée en clair se relit sans effort et
               ne se retient pas. On la masque d'un clic — puis chaque valeur se
               révèle seule, pour vérifier ligne à ligne sans tout rouvrir. */
            var box = el('div', { class: 'ue-figures selectable' }, g.chiffres.map(function (c) {
              return el('div', { class: 'ue-figure' }, [
                el('span', { class: 'k', html: c[0] }),
                el('span', { class: 'v', html: c[1] })
              ]);
            }));
            box.addEventListener('click', function (e) {
              var v = e.target.closest ? e.target.closest('.v.hid') : null;
              if (v) v.classList.remove('hid');
            });

            var masked = false;
            function flip() {
              masked = !masked;
              toggle.classList.toggle('on', masked);
              toggle.textContent = masked ? '👁 Tout révéler' : '🙈 Masquer les valeurs';
              box.querySelectorAll('.v').forEach(function (v) { v.classList.toggle('hid', masked); });
            }
            /* passer par onClick : la fabrique en fait un vrai contrôle,
               atteignable à la tabulation et activable au clavier */
            var toggle = el('span', { class: 'chip', text: '🙈 Masquer les valeurs', onClick: flip });

            return UI.card('Les chiffres à connaître par cœur', [
              el('div', { class: 'flex wrap mb8' }, [toggle]),
              box
            ], ids.length ? { right: UI.btn('🗂 Réviser ces ' + ids.length + ' chiffres', function () {
              App.closeModule._after = function () { ueSheet(sem, u); };
              App.openModule('flashcards', { ids: ids }, { subtitle: u.code + ' — les chiffres à connaître' });
            }, 'sm') } : null);
          })() : null,

          /* les formules de l'UE, avec leur raison d'être */
          l.formulas && l.formulas.length ? UI.card('Les formules de cette UE', el('div', { class: 'selectable' },
            l.formulas.map(function (fid) {
              var f = (window.FORMULAS || {})[fid];
              if (!f) return null;
              return el('div', { class: 'ue-formula' }, [
                el('div', { class: 'uf-title', text: f.t }),
                el('div', { class: 'uf-f mono', html: f.f }),
                el('div', { class: 'uf-w', html: '<b>Pourquoi ?</b> ' + f.w }),
                f.r ? el('div', { class: 'uf-r', html: '<b>Repère.</b> ' + f.r }) : null
              ].filter(Boolean));
            }).filter(Boolean)),
            { right: UI.btn('🧮 Les appliquer', function () {
              App.go('converters', { calc: (l.calc && l.calc[0]) || 'acuity' });
            }, 'sm') }) : null,

          g && g.notions ? UI.card('À retenir absolument', el('ul', { class: 'ue-notions selectable' },
            g.notions.map(function (t) { return el('li', { html: t }); }))) : null,

          g ? el('div', { class: 'grid g2' }, [
            UI.card('Les pièges', el('ul', {}, g.pieges.map(function (t) { return el('li', { html: t }); })), { class: 'ue-trap' }),
            UI.card('Ce qui tombe', el('ul', {}, g.tombe.map(function (t) { return el('li', { html: t }); })))
          ]) : null,

          /* --- le vocabulaire, relié au glossaire --- */
          (function () {
            var e = EXTRA[u.code];
            if (!e || !e.mots || !e.mots.length) return null;
            var known = {};
            (window.GLOSSARY || []).forEach(function (x) { known[x.t] = x; });
            var mots = e.mots.filter(function (t) { return known[t]; });
            if (!mots.length) return null;
            return UI.card('Le vocabulaire à maîtriser', [
              el('p', { class: 'muted small', style: { marginTop: 0 },
                text: mots.length + ' termes du glossaire sont indispensables sur cette UE. ' +
                  'Un mot que vous ne savez pas définir est une question que vous ne saurez pas traiter.' }),
              el('div', { class: 'flex wrap', style: { gap: '6px' } }, mots.map(function (t) {
                return el('span', {
                  class: 'chip', text: t, title: known[t].d.slice(0, 120) + '…',
                  onClick: function () { App.go('glossary', { term: t }); }
                });
              }))
            ]);
          })(),

          /* --- les tableaux à savoir refaire ---
             « Savoir refaire » ne se vérifie pas en relisant : on masque une
             colonne d'un clic sur son en-tête, on la reconstitue de tête, puis
             on la rouvre. C'est le geste qu'on fait avec sa main sur le poly,
             en plus fiable — et la colonne masquée le reste pendant qu'on
             réfléchit à la ligne suivante. */
          (function () {
            var d = DEEP[u.code];
            if (!d || !d.tableaux || !d.tableaux.length) return null;
            return UI.card('Les tableaux à savoir refaire', [
              el('p', { class: 'muted small mt0',
                text: 'Cliquez l’en-tête d’une colonne pour la masquer, et reconstituez-la de tête. ' +
                      'Une cellule masquée se révèle seule au clic.' })
            ].concat(d.tableaux.map(function (tb) {
              var t = UI.table(tb.c, tb.r);
              return el('div', { class: 'ue-tab selectable' }, [
                el('h4', { text: tb.t }),
                maskableTable(t)
              ]);
            })), { right: UI.chip(d.tableaux.length + ' tableau' + (d.tableaux.length > 1 ? 'x' : '')) });
          })(),

          /* --- cas d'application : plusieurs par UE ---
             Tous les cas sont construits dans le DOM et masqués par une classe :
             la feuille d'impression les rend tous visibles, une fiche imprimée
             ne doit pas perdre deux cas sur trois. */
          (function () {
            var list = casList(u.code);
            if (!list.length) return null;

            var picks = el('div', { class: 'flex wrap ue-cas-pick' });
            var stack = el('div');
            var idx = 0;

            function caseNode(c, i) {
              var open = false;
              var inner = el('div', { class: 'ue-cas-r selectable collapsed' }, [
                el('div', { class: 'k', text: 'Raisonnement' }),
                el('p', { html: c.r }),
                el('div', { class: 'k', text: 'Conclusion' }),
                el('p', { html: c.c })
              ]);
              var btn = UI.btn('Voir le raisonnement attendu', function () {
                open = !open;
                btn.textContent = open ? 'Masquer le raisonnement' : 'Voir le raisonnement attendu';
                inner.classList.toggle('collapsed', !open);
              }, 'primary');
              var tag = c.tag && CAS_TAGS[c.tag];
              return el('div', { class: 'ue-cas-one' + (i ? ' off' : '') }, [
                el('div', { class: 'flex wrap', style: { gap: '9px', marginBottom: '4px' } }, [
                  el('h4', { class: 'ue-cas-t', text: c.t }),
                  tag ? UI.chip(tag.l, tag.c) : null,
                  el('span', { class: 'spacer' }),
                  el('span', { class: 'muted small', text: 'Cas ' + (i + 1) + ' / ' + list.length })
                ].filter(Boolean)),
                el('p', { class: 'ue-cas-s selectable', html: c.s }),
                (c.q && c.q.length) ? el('ol', { class: 'ue-cas-q selectable' },
                  c.q.map(function (x) { return el('li', { html: x }); })) : null,
                el('div', { class: 'btn-row' }, [
                  btn,
                  el('span', { class: 'spacer' }),
                  list.length > 1 ? UI.btn('Cas suivant →', function () { show((i + 1) % list.length); }, 'sm') : null
                ].filter(Boolean)),
                inner
              ].filter(Boolean));
            }

            var nodes = list.map(caseNode);
            nodes.forEach(function (n) { stack.appendChild(n); });

            function show(i) {
              idx = i;
              nodes.forEach(function (n, k) { n.classList.toggle('off', k !== i); });
              picks.querySelectorAll('.chip').forEach(function (ch, k) { ch.classList.toggle('on', k === i); });
              nodes[i].scrollIntoView({ block: 'nearest' });
            }

            if (list.length > 1) {
              list.forEach(function (c, i) {
                var tag = c.tag && CAS_TAGS[c.tag];
                picks.appendChild(el('span', {
                  class: 'chip' + (i ? '' : ' on'),
                  text: (i + 1) + ' · ' + (tag ? tag.l : 'Cas'),
                  title: c.t,
                  onClick: function () { show(i); }
                }));
              });
            }

            return UI.card('Cas d’application', [
              list.length > 1 ? picks : null,
              stack
            ].filter(Boolean), {
              right: UI.btn('🩺 S’entraîner sur ces ' + list.length + ' cas', function () {
                casMode(sem.id, u.code, function () { ueSheet(sem, u); });
              }, 'sm')
            });
          })(),

          /* --- plan de réponse type ---
             Lire un plan dans l'ordre ne prouve rien : l'ordre est déjà donné.
             Le second mode mélange les étapes et demande de les remettre en
             place — c'est exactement l'épreuve de l'oral, où l'on ne relit pas
             son plan mais où l'on doit le retrouver. */
          (function () {
            var d = DEEP[u.code];
            if (!d || !d.reponse) return null;
            var steps = d.reponse.p;
            var box = el('div');
            var mode = 'lire';
            var ordre = [];      // indices d'étapes, dans l'ordre choisi
            var melange = [];    // ordre d'affichage en mode exercice
            var verifie = false;

            function shuffle(n) {
              var a = [];
              for (var i = 0; i < n; i++) a.push(i);
              for (var j = a.length - 1; j > 0; j--) {
                var k = Math.floor(Math.random() * (j + 1));
                var t = a[j]; a[j] = a[k]; a[k] = t;
              }
              return a;
            }

            function lecture() {
              return [
                el('ol', { class: 'ue-rep selectable' }, steps.map(function (x) {
                  return el('li', { html: x });
                })),
                UI.note('Savoir quoi dire ne suffit pas : c’est l’ordre qui fait la différence entre une réponse ' +
                  'complète et un catalogue. Récitez ce plan à voix haute, puis vérifiez-le en le remettant dans l’ordre.')
              ];
            }

            function exercice() {
              var out = [];
              var juste = 0;
              ordre.forEach(function (idx, k) { if (idx === k) juste++; });

              out.push(el('p', { class: 'muted small mt0',
                text: verifie
                  ? juste + ' étape' + (juste > 1 ? 's' : '') + ' sur ' + steps.length + ' à la bonne place.'
                  : 'Cliquez les étapes dans l’ordre où vous les diriez. Un second clic retire la dernière posée.' }));

              out.push(el('div', {}, melange.map(function (idx) {
                var rang = ordre.indexOf(idx);
                var pose = rang >= 0;
                var cls = 'rep-step' + (pose ? ' on' : '');
                if (verifie && pose) cls += (rang === idx) ? ' ok' : ' ko';
                return el('div', {
                  class: cls,
                  onClick: verifie ? null : function () {
                    if (pose) ordre.splice(rang, 1); else ordre.push(idx);
                    draw();
                  }
                }, [
                  el('span', { class: 'n', text: pose ? String(rang + 1) : '·' }),
                  el('span', { class: 't', html: steps[idx] }),
                  verifie && pose && rang !== idx
                    ? el('span', { class: 'r', text: 'place ' + (idx + 1) }) : null
                ].filter(Boolean));
              })));

              out.push(el('div', { class: 'btn-row' }, [
                verifie
                  ? UI.btn('↻ Recommencer', function () {
                      ordre = []; verifie = false; melange = shuffle(steps.length); draw();
                    }, 'primary')
                  : UI.btn('Vérifier l’ordre', function () {
                      if (ordre.length < steps.length) { UI.toast('Placez d’abord toutes les étapes.'); return; }
                      verifie = true; draw();
                    }, ordre.length === steps.length ? 'primary' : ''),
                UI.btn('Voir le plan', function () { mode = 'lire'; draw(); })
              ]));
              return out;
            }

            function draw() {
              UI.clear(box);
              (mode === 'lire' ? lecture() : exercice()).forEach(function (n) { box.appendChild(n); });
            }
            draw();

            var bascule = UI.btn('🔀 Remettre dans l’ordre', function () {
              mode = 'exercice'; ordre = []; verifie = false; melange = shuffle(steps.length);
              draw();
            }, 'sm');

            return UI.card('Plan de réponse type', [
              el('p', { class: 'ue-rep-q selectable', html: '« ' + d.reponse.q + ' »' }),
              box
            ], { right: bascule });
          })(),

          /* --- moyens mnémotechniques --- */
          (function () {
            var d = DEEP[u.code];
            if (!d || !d.mnemo || !d.mnemo.length) return null;
            return UI.card('Moyens mnémotechniques', el('div', { class: 'ue-mnemo selectable' },
              d.mnemo.map(function (m) {
                return el('div', { class: 'ue-mnemo-row' }, [
                  el('span', { class: 'm', html: m[0] }),
                  el('span', { class: 'd', html: m[1] })
                ]);
              })));
          })(),

          g ? UI.card('Comment travailler cette UE', UI.note(g.methode)) : null,
        ].filter(Boolean));
        body.appendChild(page);
        layoutSheet(page);

        /* --- brancher la recherche interne ---
           Une recherche ne doit pas dépendre du volet ouvert : tant qu'il y a
           une requête, les volets s'effacent, on ne montre que les cartes qui
           répondent, et l'on surligne. Requête vide, tout revient en place. */
        (function () {
          /* les cartes, plus les encarts posés directement dans un volet
             (« En une phrase ») : sans eux, un bloc sans titre resterait
             affiché au milieu des résultats sans y répondre */
          var cards = [].slice.call(page.querySelectorAll('.card:not(.ue-head-card), .ue-pane > .note'));
          /* la classe se pose sur la page entière, pas sur la seule fiche :
             c'est ce qui permet d'effacer aussi ce qui l'entoure (bandeau du
             cursus, graphique des semestres) le temps d'une recherche */
          var root = (page.closest && page.closest('.page')) || page;
          var t = null;

          function run() {
            var toks = Txt.tokens(findIn.value);
            unmark(page);
            if (!toks.length) {
              root.classList.remove('finding');
              cards.forEach(function (c) { c.classList.remove('off'); });
              findOut.textContent = '';
              if (showPane) showPane(sheetPane);   // rendre la main aux volets
              return;
            }
            root.classList.add('finding');
            var found = 0, hits = 0;
            cards.forEach(function (c) {
              var blob = Txt.norm(c.textContent);
              var ok = toks.every(function (x) { return blob.indexOf(x) >= 0; });
              c.classList.toggle('off', !ok);
              if (ok) { found++; hits += markAll(c, toks); }
            });
            findOut.textContent = found
              ? found + ' carte' + (found > 1 ? 's' : '') + ' · ' + hits + ' passage' + (hits > 1 ? 's' : '')
              : 'rien dans cette fiche';
          }

          findIn.addEventListener('input', function () {
            clearTimeout(t);
            t = setTimeout(run, 120);
          });
          findIn.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { findIn.value = ''; run(); }
          });
        })();

        /* --- d'une fiche à la suivante ---
           On révise rarement une seule UE : repasser par la liste du semestre
           entre chaque fiche coûte deux clics et fait perdre le fil. Ajouté
           après la mise en volets pour rester visible quel que soit l'onglet. */
        (function () {
          var sibs = sem.ues;
          var pos = sibs.indexOf(u);
          if (pos < 0) return;
          function jump(v, label) {
            return el('div', { class: 'ue-nav-side', onClick: function () { ueSheet(sem, v); } }, [
              el('div', { class: 'k', text: label }),
              el('div', { class: 'v', text: v.code + ' — ' + v.title })
            ]);
          }
          var prev = pos > 0 ? sibs[pos - 1] : null;
          var next = pos < sibs.length - 1 ? sibs[pos + 1] : null;
          if (!prev && !next) return;
          page.appendChild(el('div', { class: 'ue-nav' }, [
            prev ? jump(prev, '← UE précédente') : el('span'),
            el('span', { class: 'ue-nav-pos muted small', text: (pos + 1) + ' / ' + sibs.length + ' · ' + sem.label }),
            next ? jump(next, 'UE suivante →') : el('span')
          ]));
        })();

        if (keep) {
          var main = document.getElementById('main');
          if (main && typeof keep === 'number') main.scrollTop = keep;
        } else if (body.isConnected) {
          // la fiche s'affiche sous les onglets : on l'amène à l'écran
          body.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      }

      /* ---------------- vue semestre ---------------- */
      function drawSemester(id) {
        decor(true);
        var sem = semById(id);
        var h = hours(sem);
        var ready = semesterReadiness(sem);
        var isMine = currentSemester() === sem.id;
        var examISO = Store.examDate(sem.id);
        var left = daysUntil(examISO);

        /* --- plan de révision --- */
        var planBox = el('div');
        function drawPlan() {
          UI.clear(planBox);
          var weeks = left === null ? 6 : Math.max(1, Math.min(12, Math.ceil(left / 7)));
          if (left !== null && left < 0) {
            planBox.appendChild(UI.note('La date indiquée est passée. Mettez-la à jour pour régénérer un plan.', 'warn'));
            return;
          }
          var plan = buildPlan(sem, weeks,
            function (u) { ueSheet(sem, u); },
            function (u) { reciteMode(sem, u); });
          if (!plan.length) {
            planBox.appendChild(UI.empty('🎉', 'Toutes les UE de ce semestre sont au vert.<br>Entretenez avec un examen blanc de temps en temps.'));
            return;
          }
          planBox.appendChild(el('p', { class: 'small muted', style: { marginTop: 0 },
            text: left === null
              ? 'Plan générique sur 6 semaines. Indiquez la date de vos partiels pour l’ajuster.'
              : 'Plan sur ' + weeks + ' semaine' + (weeks > 1 ? 's' : '') + ', priorité aux UE lourdes et mal maîtrisées.' }));

          plan.forEach(function (w) {
            var items = el('div');
            w.items.forEach(function (it) {
              var acts = el('div', { class: 'plan-acts' });
              it.acts.forEach(function (a) {
                var pkey = sem.id + ':w' + w.week + ':' + it.ue.code + ':' + a.id;
                var done = Store.planDone(pkey);
                var line = el('div', { class: 'plan-act' + (done ? ' done' : '') }, [
                  el('span', {
                    class: 'plan-check', text: done ? '✓' : '',
                    title: 'Marquer comme fait',
                    onClick: function () { Store.planDone(pkey, !Store.planDone(pkey)); drawPlan(); }
                  }),
                  el('span', { class: 'plan-label', text: a.label, onClick: a.run })
                ]);
                acts.appendChild(line);
              });
              items.appendChild(el('div', { class: 'plan-ue' }, [
                el('div', { class: 'flex' }, [
                  el('b', { text: it.ue.code + ' — ' + it.ue.title }),
                  el('span', { class: 'spacer' }),
                  it.due && it.due.due
                    ? UI.chip(it.due.never ? 'jamais récitée' : it.due.n + ' items dus', 'violet') : null,
                  it.due && !it.due.due
                    ? UI.chip(it.due.days === null ? 'à jour' : 'revue il y a ' + it.due.days + ' j', 'green') : null,
                  UI.chip((it.m.pct === null ? '—' : it.m.pct + ' %'), it.m.pct >= 55 ? 'green' : it.m.pct >= 30 ? 'amber' : 'red')
                ]),
                acts
              ]));
            });
            planBox.appendChild(el('div', { class: 'plan-week' }, [
              el('div', { class: 'plan-week-head' }, [
                el('b', { text: 'Semaine ' + w.week }),
                w.last ? UI.chip('Dernière ligne droite', 'violet') : null
              ].filter(Boolean)),
              items,
              w.last ? el('div', { class: 'btn-row', style: { marginTop: '10px' } }, [
                UI.btn('⏱ Examen blanc de révision', function () { App.go('exam'); }, 'primary'),
                UI.btn('🗂 Réviser les fiches mémo', function () { App.go('flashcards'); })
              ]) : null
            ].filter(Boolean)));
          });
        }
        drawPlan();

        var dateInput = el('input', { type: 'date', class: 'inp', value: examISO || '' });
        dateInput.addEventListener('change', function () {
          Store.examDate(sem.id, dateInput.value || null);
          drawSemester(sem.id);
        });

        /* --- une UE, en carte cliquable --- */
        function ueCard(u) {
          var m = mastery(sem, u);
          var l = u.links || {};
          var g = guideOf(u);
          var mini = [];
          /* ce qui est dû aujourd'hui passe en tête : c'est l'action qui a le
             meilleur rendement, et elle doit être atteignable sans ouvrir la fiche */
          var due = dueNow(u);
          if (due) {
            mini.push(el('span', { class: 'chip on', title: 'Se faire interroger sur ce qui est dû',
              text: '🎤 ' + due + ' à revoir',
              onClick: function (e) { e.stopPropagation(); reciteMode(sem, u, { dueOnly: true, limit: 20 }); } }));
          }
          linkedMods(u).slice(0, 2).forEach(function (id) {
            mini.push(el('span', { class: 'chip', text: (M[id].icon || '') + ' ' + M[id].title, onClick: function (e) { e.stopPropagation(); App.go(id); } }));
          });
          if (l.cats && l.cats.length) {
            mini.push(el('span', { class: 'chip on', text: '❓ QCM', onClick: function (e) { e.stopPropagation(); App.go('quiz', { cats: l.cats, n: 15 }); } }));
          }
          if (Store.ueNote(ueKey(sem, u))) {
            mini.push(el('span', { class: 'chip', text: '📝 mes notes', title: 'Vous avez pris des notes sur cette UE' }));
          }

          return el('div', { class: 'ue-card', onClick: function () { ueSheet(sem, u); } }, [
            el('div', { class: 'ue-card-head' }, [
              UI.ring(m.pct === null ? 0 : m.pct, { size: 46, width: 5, color: masteryColor(m.pct),
                text: m.pct === null ? '—' : String(m.pct), fontSize: 12 }),
              el('div', { style: { minWidth: 0, flex: 1 } }, [
                el('div', { class: 'flex', style: { gap: '8px' } }, [
                  el('b', { class: 'ue-code', text: u.code }),
                  el('span', { class: 'ue-ects', text: u.ects + ' ECTS' }),
                  u.h ? el('span', { class: 'ue-h', text: u.h + ' h · ' + u.cm + ' CM / ' + u.td + ' TD' + (u.tp ? ' / ' + u.tp + ' TP' : '') }) : null
                ].filter(Boolean)),
                el('div', { class: 'ue-title', text: u.title }),
                el('div', { class: 'ue-state', style: { color: masteryColor(m.pct) }, text: masteryLabel(m.pct) })
              ])
            ]),
            g ? el('p', { class: 'ue-resume', text: g.resume || g.objectifs[0] }) : null,
            el('div', { class: 'flex wrap', style: { gap: '6px', marginTop: '10px' } },
              mini.concat([el('span', { class: 'ue-open', text: g ? 'Ouvrir la fiche →' : 'Suivi manuel →' })]))
          ].filter(Boolean));
        }

        UI.clear(body);
        body.appendChild(el('div', {}, [
          /* 1 — les UE, tout de suite */
          UI.card(sem.label + ' — ' + sem.ues.length + ' unités d’enseignement', [
            el('div', { class: 'flex wrap', style: { marginBottom: '14px' } }, [
              UI.chip(sem.ects + ' ECTS dont ' + sem.stage.ects + ' de stage', 'blue'),
              UI.chip(h.h + ' heures'),
              UI.chip('Préparation ' + ready + ' %', ready >= 70 ? 'green' : ready >= 40 ? 'amber' : 'red'),
              (function () {
                /* Ce qui reste à revoir aujourd'hui sur tout le semestre. On ne
                   vient pas réviser « l'UE 9 » : on vient faire ce qui est dû.
                   Le chiffre est donc un bouton, et la file mêle les UE. */
                var due = sem.ues.reduce(function (a, x) { return a + dueNow(x); }, 0);
                if (!due) return null;
                return el('span', { class: 'flex', style: { gap: '8px' } }, [
                  UI.btn('🎤 Révision du jour — ' + due + ' item' + (due > 1 ? 's' : ''),
                    function () { reciteSemestre(sem); }, 'sm primary'),
                  (function () {
                    /* un bouton sans mot doit quand même se nommer pour qui écoute la page */
                    var b = UI.btn('🎧', function () { ecouterSemestre(sem); }, 'sm');
                    b.title = 'Écouter la révision du jour';
                    b.setAttribute('aria-label', 'Écouter la révision du jour');
                    return b;
                  })()
                ]);
              })(),
              left !== null ? UI.chip('Partiels dans ' + left + ' j', left < 14 ? 'red' : left < 30 ? 'amber' : '') : null,
              el('span', { class: 'spacer' }),
              isMine ? UI.chip('Votre semestre', 'green') : UI.btn('C’est mon semestre', function () {
                Store.state.profile.semester = sem.id; Store.save(); App.refreshNav(); drawSemester(sem.id);
              }, 'sm')
            ].filter(Boolean)),
            el('div', { class: 'ue-grid' }, sem.ues.map(ueCard)),
            el('div', { class: 'ue-stage' }, [
              el('b', { text: '🏥 ' + sem.stage.label }),
              el('span', { text: ' — ' + sem.stage.ects + ' ECTS. Le terrain : rien ne le remplace, et il compte autant que les UE.' })
            ])
          ]),

          /* 2 — le plan de révision */
          UI.card('Plan de révision', [
            el('div', { class: 'flex wrap', style: { gap: '14px', marginBottom: '14px' } }, [
              UI.field('Date de vos partiels', dateInput),
              el('div', { style: { alignSelf: 'end', paddingBottom: '13px' } },
                el('span', { class: 'muted small', text: left === null ? 'Sans date, le plan couvre 6 semaines.'
                  : left + ' jour' + (left > 1 ? 's' : '') + ' — soit ' + Math.max(1, Math.ceil(left / 7)) + ' semaine(s) de travail.' }))
            ]),
            planBox
          ]),

          /* 3 — le semestre en volumes, pour le contexte */
          UI.card('Le semestre en volumes horaires', [
            hoursBar(h),
            el('div', { class: 'grid g4 mt16' }, [
              UI.metric(ready + ' %', 'Préparation', ready,
                ready >= 70 ? 'var(--green)' : ready >= 40 ? 'var(--amber)' : 'var(--red)'),
              UI.stat(sem.ects, 'ECTS'),
              UI.stat(h.h + ' h', 'Enseignement'),
              UI.stat(left === null ? '—' : left + ' j', 'Avant les partiels',
                left === null ? 'var(--txt-3)' : left < 14 ? 'var(--red)' : left < 30 ? 'var(--amber)' : 'var(--accent)')
            ])
          ])
        ]));
        document.getElementById('main').scrollTop = 0;
      }

      /* ============================================================
         Entraînement aux cas d'application
         ------------------------------------------------------------
         Les 39 cas dorment un par un dans les fiches. Enchaînés, ils
         deviennent un vrai entraînement : on lit l'énoncé, on répond
         avant de découvrir le raisonnement, on s'auto-note.
         ============================================================ */
      function casMode(filterSem, filterUe, back) {
        back = back || drawCas;
        var pool = [];
        C.forEach(function (sem) {
          if (filterSem && sem.id !== filterSem) return;
          sem.ues.forEach(function (u) {
            if (filterUe && u.code !== filterUe) return;
            casList(u.code).forEach(function (c) {
              pool.push({ sem: sem, ue: u, cas: c });
            });
          });
        });
        if (!pool.length) { UI.toast('Aucun cas pour ce semestre.'); return; }

        for (var i = pool.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
        }

        var st = { i: 0, shown: false, ok: 0, ko: 0, missed: [] };
        var box = el('div');

        function finish() {
          var total = st.ok + st.ko;
          var pct = total ? Math.round((st.ok / total) * 100) : 0;
          if (total) Store.recordScore('ue-cas', pct, { n: total });
          UI.clear(box);
          box.appendChild(UI.card('Entraînement terminé', [
            el('div', { class: 'grid g3' }, [
              UI.stat(st.ok, 'Traités', 'var(--green)'),
              UI.stat(st.ko, 'À reprendre', 'var(--amber)'),
              UI.stat(pct + ' %', 'Score', masteryColor(pct))
            ]),
            st.missed.length
              ? el('div', {}, [
                  el('h3', { text: 'Les cas à reprendre' }),
                  el('div', {}, st.missed.map(function (x) {
                    return el('div', { class: 'mod-tile', onClick: function () { ueSheet(x.sem, x.ue); } }, [
                      el('div', { class: 'mi', text: '🩺' }),
                      el('div', {}, [
                        el('div', { class: 'mt', text: x.ue.code + ' — ' + x.cas.t }),
                        el('div', { class: 'md', text: x.sem.label + ' · ' + x.ue.title })
                      ]),
                      el('span', { class: 'arrow', text: '›' })
                    ]);
                  }))
                ])
              : UI.note('Tous les cas ont été traités correctement.'),
            el('div', { class: 'btn-row' }, [
              st.missed.length ? UI.btn('↻ Reprendre les ' + st.missed.length + ' cas ratés', function () {
                pool = st.missed.slice(); st.i = 0; st.shown = false;
                st.ok = 0; st.ko = 0; st.missed = []; draw();
              }, 'primary') : null,
              UI.btn('Recommencer', function () {
                st.i = 0; st.shown = false; st.ok = 0; st.ko = 0; st.missed = []; draw();
              }),
              UI.btn('← Retour', function () { back(); })
            ].filter(Boolean))
          ]));
        }

        function answer(good) {
          var it = pool[st.i];
          if (good) st.ok++; else { st.ko++; st.missed.push(it); }
          st.i++; st.shown = false;
          draw();
        }

        function draw() {
          UI.clear(box);
          if (st.i >= pool.length) { finish(); return; }
          var x = pool[st.i], c = x.cas;

          box.appendChild(UI.card(null, [
            el('div', { class: 'flex wrap' }, [
              UI.chip(x.ue.code, 'blue'),
              UI.chip(x.sem.id),
              c.tag && CAS_TAGS[c.tag] ? UI.chip(CAS_TAGS[c.tag].l, CAS_TAGS[c.tag].c) : null,
              el('span', { class: 'spacer' }),
              st.ok ? el('span', { class: 'small', style: { color: 'var(--green)' }, text: '✓ ' + st.ok }) : null,
              st.ko ? el('span', { class: 'small', style: { color: 'var(--amber)' }, text: '↻ ' + st.ko }) : null,
              el('span', { class: 'muted small', text: (st.i + 1) + ' / ' + pool.length })
            ].filter(Boolean)),
            UI.bar((st.i / pool.length) * 100),
            el('h3', { style: { marginTop: '14px' }, text: c.t }),
            el('p', { class: 'ue-cas-s selectable', html: c.s }),
            (c.q && c.q.length) ? el('ol', { class: 'ue-cas-q selectable' },
              c.q.map(function (q) { return el('li', { html: q }); })) : null,
            st.shown
              ? el('div', { class: 'ue-cas-r selectable' }, [
                  el('div', { class: 'k', text: 'Raisonnement' }),
                  el('p', { html: c.r }),
                  el('div', { class: 'k', text: 'Conclusion' }),
                  el('p', { html: c.c })
                ])
              : el('p', { class: 'muted center', style: { marginTop: '14px' },
                  text: 'Répondez aux questions avant de découvrir le raisonnement.' }),
            st.shown
              ? el('div', { class: 'btn-row', style: { justifyContent: 'center' } }, [
                  UI.btn('↻ À reprendre', function () { answer(false); }, 'danger'),
                  UI.btn('✓ Je l’avais', function () { answer(true); }, 'primary')
                ])
              : el('div', { class: 'btn-row', style: { justifyContent: 'center' } }, [
                  UI.btn('Voir le raisonnement attendu', function () { st.shown = true; draw(); }, 'primary')
                ])
          ].filter(Boolean)));

          box.appendChild(el('div', { class: 'btn-row' }, [
            UI.btn('← Quitter', function () { back(); }),
            UI.btn('📖 Ouvrir la fiche', function () { ueSheet(x.sem, x.ue); }),
            UI.btn('Passer', function () { st.i++; st.shown = false; draw(); })
          ]));

          box.appendChild(UI.keyhint([['Espace', 'révéler'], ['1', 'à reprendre'], ['2', 'je l’avais']]));
        }

        UI.hotkeys(box, {
          ' ': function () { if (st.i < pool.length && !st.shown) { st.shown = true; draw(); } },
          '1': function () { if (st.shown) answer(false); },
          '2': function () { if (st.shown) answer(true); }
        });

        draw();
        UI.clear(body);
        body.appendChild(el('div', {}, [
          UI.card(null, [
            el('div', { class: 'flex wrap' }, [
              el('h2', { style: { margin: 0 }, text: '🩺 Cas d’application' }),
              el('span', { class: 'spacer' }),
              UI.chip(pool.length + ' cas', 'blue')
            ])
          ]),
          box
        ]));
        document.getElementById('main').scrollTop = 0;
      }

      /* écran d'accueil des cas */
      function drawCas() {
        decor(true);
        var byS = C.map(function (sem) {
          var n = sem.ues.reduce(function (a, u) { return a + casList(u.code).length; }, 0);
          var nUe = sem.ues.filter(function (u) { return casList(u.code).length; }).length;
          return { sem: sem, n: n, nUe: nUe };
        }).filter(function (x) { return x.n; });
        var total = byS.reduce(function (a, x) { return a + x.n; }, 0);
        var ueCount = byS.reduce(function (a, x) { return a + x.nUe; }, 0);
        var sc = Store.score('ue-cas');

        UI.clear(body);
        body.appendChild(el('div', {}, [
          UI.card('S’entraîner sur les cas', [
            el('p', { class: 'muted', style: { marginTop: 0 },
              html: '<b>' + total + ' cas d’application</b> répartis sur ' + ueCount + ' UE — cliniques, calculs, ' +
                'décisions, urgences et questions de méthode. Énoncé, questions, puis raisonnement attendu — ' +
                'masqué tant que vous n’avez pas cherché. C’est la forme sous laquelle l’examen clinique vous ' +
                'interrogera : pas « récitez », mais « que faites-vous ? ».' }),
            sc ? el('div', { class: 'grid g3' }, [
              UI.stat(sc.attempts, 'Séries faites'),
              UI.stat(sc.last + ' %', 'Dernier score', masteryColor(sc.last)),
              UI.stat(sc.best + ' %', 'Meilleur', 'var(--green)')
            ]) : null,
            el('div', { class: 'btn-row' }, [
              UI.btn('🩺 Enchaîner les ' + total + ' cas', function () { casMode(null); }, 'primary')
            ])
          ].filter(Boolean)),
          UI.card('Par semestre', el('div', { class: 'grid g3' }, byS.map(function (x) {
            return el('div', { class: 'tool-card', onClick: function () { casMode(x.sem.id); } }, [
              el('div', { class: 'flex', style: { marginBottom: '6px' } }, [
                el('h4', { style: { margin: 0 }, text: x.sem.label }),
                el('span', { class: 'spacer' }),
                UI.chip(x.n + ' cas', 'blue')
              ]),
              el('p', { text: x.sem.ues.filter(function (u) { return casList(u.code).length; })
                .map(function (u) { return u.code; }).join(', ') })
            ]);
          })))
        ]));
        document.getElementById('main').scrollTop = 0;
      }

      /* ============================================================
         Vue transversale — les 6 semestres d'un coup
         ------------------------------------------------------------
         « Où est traitée l'amblyopie ? » ne devrait pas obliger à
         ouvrir six onglets. La recherche porte sur le code, le titre,
         le résumé, les objectifs et le vocabulaire de chaque UE.
         ============================================================ */
      function drawAll() {
        decor(true);
        var stA = { q: '', sort: 'sem', filter: 'all' };
        var list = el('div');

        var rows = [];
        C.forEach(function (sem) {
          sem.ues.forEach(function (u) {
            var e = EXTRA[u.code], g = GUIDE[u.code];
            rows.push({
              sem: sem, ue: u,
              blob: norm([
                u.code, u.title,
                g ? g.resume : '',
                g ? (g.objectifs || []).join(' ') : '',
                g ? (g.notions || []).join(' ') : '',
                g ? (g.plan || []).map(function (p) { return p.t; }).join(' ') : '',
                /* les phrases à retenir du cours : c'est souvent par elles
                   qu'on se souvient d'une UE, bien avant son intitulé */
                (COURS[u.code] || []).map(function (c) { return c.cle || ''; }).join(' '),
                e ? (e.mots || []).join(' ') : '',
                /* ses propres notes se cherchent comme le reste : c'est
                   souvent par elles qu'on se souvient d'une UE */
                Store.ueNote(ueKey(sem, u)),
                (u.links && u.links.cats || []).join(' ')
              ].join(' ').replace(/<[^>]+>/g, ' '))
            });
          });
        });

        var searchA = el('input', { type: 'text', class: 'inp',
          placeholder: 'Chercher dans les 6 semestres…  (amblyopie, prisme, champ visuel, Panum)' });
        var count = el('span', { class: 'small muted' });

        var sortA = UI.select([
          { value: 'sem', label: 'Ordre du cursus' },
          { value: 'weak', label: 'Les moins maîtrisées d’abord' },
          { value: 'due', label: 'Le plus à revoir d’abord' },
          { value: 'ects', label: 'Les plus lourdes en ECTS' }
        ], 'sem', function (v) { stA.sort = v; draw(); });

        var filters = el('div', { class: 'flex wrap' });
        [
          { id: 'all', label: 'Toutes' },
          { id: 'due', label: '🎤 À revoir aujourd’hui' },
          { id: 'notes', label: '📝 Avec mes notes' },
          { id: 'todo', label: 'Non travaillées' },
          { id: 'wip', label: 'En cours' },
          { id: 'done', label: 'Maîtrisées' }
        ].forEach(function (f) {
          filters.appendChild(el('span', {
            class: 'chip' + (f.id === 'all' ? ' on' : ''), text: f.label, dataset: { f: f.id },
            onClick: function (e) {
              stA.filter = f.id;
              filters.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
              e.currentTarget.classList.add('on');
              draw();
            }
          }));
        });

        function draw() {
          UI.clear(list);
          var q = norm(stA.q);
          var items = rows.filter(function (r) {
            if (q && r.blob.indexOf(q) < 0) return false;
            if (stA.filter === 'due' && !dueNow(r.ue)) return false;
            if (stA.filter === 'notes' && !Store.ueNote(ueKey(r.sem, r.ue))) return false;
            var m = mastery(r.sem, r.ue);
            var p = m.pct === null ? (m.revised ? 100 : -1) : m.pct;
            if (stA.filter === 'todo' && p > 5) return false;
            if (stA.filter === 'wip' && (p <= 5 || p >= 80)) return false;
            if (stA.filter === 'done' && p < 80) return false;
            return true;
          });

          if (stA.sort === 'weak') {
            items.sort(function (a, b) {
              var pa = mastery(a.sem, a.ue).pct, pb = mastery(b.sem, b.ue).pct;
              return (pa === null ? 999 : pa) - (pb === null ? 999 : pb);
            });
          } else if (stA.sort === 'due') {
            items.sort(function (a, b) { return dueNow(b.ue) - dueNow(a.ue); });
          } else if (stA.sort === 'ects') {
            items.sort(function (a, b) { return b.ue.ects - a.ue.ects; });
          }

          count.textContent = items.length + ' UE sur ' + rows.length;
          if (!items.length) {
            list.appendChild(UI.empty('🔍', 'Aucune UE ne correspond.'));
            return;
          }

          items.forEach(function (r) {
            var m = mastery(r.sem, r.ue);
            var g = GUIDE[r.ue.code];
            list.appendChild(el('div', { class: 'ue-row', onClick: function () { ueSheet(r.sem, r.ue); } }, [
              UI.ring(m.pct === null ? 0 : m.pct, { size: 40, width: 4, color: masteryColor(m.pct),
                text: m.pct === null ? '—' : String(m.pct), fontSize: 11 }),
              el('div', { style: { minWidth: 0, flex: 1 } }, [
                el('div', { class: 'flex', style: { gap: '8px' } }, [
                  el('b', { text: r.ue.code }),
                  el('span', { class: 'ue-ects', text: r.ue.ects + ' ECTS' }),
                  el('span', { class: 'chip static', text: r.sem.id })
                ]),
                el('div', { class: 'ue-title', text: r.ue.title }),
                g ? el('div', { class: 'ue-row-resume', text: g.resume }) : null
              ].filter(Boolean)),
              Store.ueNote(ueKey(r.sem, r.ue))
                ? el('span', { class: 'chip static', text: '📝', title: 'Vous avez pris des notes sur cette UE' })
                : null,
              (function () {
                if (!memoryOf(r.ue).total) return null;
                var d = dueNow(r.ue);
                return el('span', {
                  class: 'chip' + (d ? ' on' : ''),
                  text: d ? '🎤 ' + d : '🎤',
                  title: d ? d + ' item(s) à revoir aujourd’hui' : 'Se faire interroger sur cette UE',
                  onClick: function (e) {
                    e.stopPropagation();
                    reciteMode(r.sem, r.ue, d ? { dueOnly: true, limit: 20 } : { limit: 20 });
                  }
                });
              })(),
              el('span', { class: 'arrow', text: '›' })
            ].filter(Boolean)));
          });
        }

        searchA.addEventListener('input', function () { stA.q = searchA.value; draw(); });
        draw();

        UI.clear(body);
        body.appendChild(el('div', {}, [
          UI.card('Toutes les UE du cursus', [
            searchA,
            el('div', { class: 'btn-row', style: { marginTop: '12px' } }, [
              count,
              el('span', { class: 'spacer' }),
              sortA
            ]),
            el('div', { style: { marginTop: '10px' } }, filters)
          ]),
          list
        ]));
        document.getElementById('main').scrollTop = 0;
      }

      /* ---------------- bandeau « où en êtes-vous » ---------------- */
      var mineBox = el('div');
      function drawMine() {
        UI.clear(mineBox);
        var cur = currentSemester();
        var acquired = 0;
        if (cur) {
          var idx = C.map(function (x) { return x.id; }).indexOf(cur);
          acquired = C.slice(0, idx).reduce(function (a, sem) { return a + sem.ects; }, 0);
        }
        mineBox.appendChild(el('div', { class: 'flex wrap', style: { gap: '18px' } }, [
          UI.ring(cur ? (acquired / 180) * 100 : 0, { size: 84, width: 8, text: acquired + '/180', fontSize: 13 }),
          el('div', { style: { minWidth: '230px' } }, [
            el('div', { class: 'muted small', text: 'Votre semestre' }),
            UI.select(C.map(function (sem) { return { value: sem.id, label: sem.label + ' — année ' + sem.year }; })
              .concat([{ value: '', label: 'Non précisé' }]), cur || '', function (v) {
                Store.state.profile.semester = v || null;
                Store.save(); App.refreshNav(); drawMine();
                if (v) { tabs.setTab(v); }
              }),
            el('div', { class: 'small muted', style: { marginTop: '6px' },
              text: cur ? 'ECTS des semestres précédents, considérés acquis.' : 'Choisissez votre semestre : tout s’y adapte.' })
          ]),
          cur ? el('div', { style: { minWidth: '200px' } }, [
            el('div', { class: 'muted small', text: 'Préparation du semestre en cours' }),
            (function () {
              var r = semesterReadiness(semById(cur));
              return el('div', {}, [
                el('div', { style: { fontSize: '26px', fontWeight: '700', fontFamily: 'var(--mono)', color: masteryColor(r) }, text: r + ' %' }),
                UI.bar(r, masteryColor(r))
              ]);
            })(),
            el('div', { class: 'small muted', style: { marginTop: '6px' }, text: 'Moyenne pondérée par les ECTS de vos UE.' })
          ]) : null
        ].filter(Boolean)));
      }
      drawMine();

      var tabs = UI.tabs(C.map(function (sem) {
        return { id: sem.id, label: sem.id + (currentSemester() === sem.id ? ' ★' : '') };
      }).concat([
        { id: '__all', label: '⌕ Toutes les UE' },
        { id: '__cas', label: '🩺 Cas' }
      ]),
        function (id) {
          if (id === '__all') drawAll();
          else if (id === '__cas') drawCas();
          else drawSemester(id);
          return null;
        }, wanted);

      var page = UI.page({
        crumb: 'Mes études',
        title: 'Unités d’enseignement',
        subtitle: 'Vos UE, semestre par semestre : le cours en condensé, les chiffres à connaître, les pièges, ' +
          'ce qui tombe — et un plan de révision calé sur la date de vos partiels.'
      }, [
        tabs,
        body,
        UI.card('Où en êtes-vous dans le cursus ?', mineBox, { class: 'no-print' }),
        UI.card('Les six semestres', [
          overview(),
          el('div', { class: 'legend', style: { marginTop: '10px' } }, [
            el('span', {}, [el('i', { style: { background: 'var(--accent)' } }), el('span', { text: 'Cours magistraux' })]),
            el('span', {}, [el('i', { style: { background: 'var(--blue)' } }), el('span', { text: 'Travaux dirigés' })]),
            el('span', {}, [el('i', { style: { background: 'var(--violet)' } }), el('span', { text: 'Travaux pratiques' })])
          ]),
          UI.note('Cursus complet : <b>180 ECTS</b>, <b>' + totalH + ' heures</b> d’enseignement et <b>' + stageEcts +
            ' ECTS</b> de stage. Le volume présentiel décroît d’année en année pendant que la part de stage grimpe de 1 à 10 : ' +
            'la formation bascule progressivement de l’amphi vers le terrain.')
        ], { class: 'no-print' })
      ]);

      if (params.ue) {
        var sem0 = semById(wanted);
        var u0 = sem0.ues.filter(function (x) { return x.code === params.ue; })[0];
        if (u0) ueSheet(sem0, u0);      // rendu immédiat : pas de course avec l'affichage
      }
      return page;
    }
  };
})();
