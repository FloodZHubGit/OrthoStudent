/* ============================================================
   Cards — fiches intégrées + fiches importées par l'utilisateur
   ------------------------------------------------------------
   Les fiches livrées avec l'application (window.FLASHCARDS) et
   celles que l'étudiant importe sont fusionnées : même révision
   espacée, même export Anki, même statistiques.
   ============================================================ */
(function () {
  'use strict';

  function uid(i) {
    return 'u' + Date.now().toString(36) + '-' + i.toString(36);
  }

  function clean(s) {
    return String(s == null ? '' : s)
      .replace(/^\s*[-*•]\s+/, '')          // puces
      .replace(/^\s*\d+[.)]\s+/, '')        // numérotation
      .replace(/^#{1,6}\s+/, '')            // titres markdown
      .replace(/\*\*(.+?)\*\*/g, '$1')      // gras markdown
      .replace(/^\s*\*(.+?)\*\s*$/, '$1')   // italique markdown
      // notation mathématique de type LaTeX : $90\%$ → 90 %, $Pitx2$ → Pitx2
      .replace(/\$([^$]{1,120})\$/g, '$1')
      .replace(/\\([%_&#$])/g, '$1')
      .replace(/^\s*(Q|Question|R|A|Réponse|Answer|Recto|Verso|Front|Back)\s*[:.\)]\s*/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ---- CSV complet (RFC 4180 tolérant) ----
     Gère les guillemets, les guillemets doublés à l'intérieur d'un champ
     et les retours à la ligne dans un champ entre guillemets. C'est le
     format qu'exportent NotebookLM, Quizlet, Excel… */
  function csvRows(text, delim) {
    var rows = [], row = [], field = '', inQ = false, i = 0;
    while (i < text.length) {
      var ch = text.charAt(i);
      if (inQ) {
        if (ch === '"') {
          if (text.charAt(i + 1) === '"') { field += '"'; i += 2; continue; }
          inQ = false; i++; continue;
        }
        field += ch; i++; continue;
      }
      // un guillemet n'ouvre un champ que s'il est en tête de ce champ
      if (ch === '"' && field === '') { inQ = true; i++; continue; }
      if (ch === delim) { row.push(field); field = ''; i++; continue; }
      if (ch === '\r') { i++; continue; }
      if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
      field += ch; i++;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  var HEADER_FRONT = /^(front|question|recto|terme|term|q)$/i;
  var HEADER_BACK = /^(back|answer|r[ée]ponse|verso|d[ée]finition|definition|a|r)$/i;

  function csvCards(text, delim) {
    var rows = csvRows(text, delim).filter(function (r) {
      return r.length && r.join('').trim() !== '';
    });
    if (!rows.length) return null;

    // en-tête éventuel
    if (rows.length > 1 && rows[0].length >= 2 && HEADER_FRONT.test(rows[0][0].trim()) && HEADER_BACK.test(rows[0][1].trim())) {
      rows = rows.slice(1);
    }
    if (!rows.length) return null;

    // un fichier d'une seule fiche reste valide, mais on exige alors
    // exactement deux colonnes pour ne pas couper une phrase en deux
    if (rows.length === 1 && rows[0].length !== 2) return null;

    var usable = rows.filter(function (r) { return r.length >= 2 && r[0].trim() && r[1].trim(); });
    if (usable.length / rows.length < 0.75) return null;

    var cards = usable.map(function (r) { return { f: clean(r[0]), b: clean(r[1]) }; })
      .filter(function (c) { return c.f && c.b; });
    return cards.length ? { cards: cards, dropped: rows.length - cards.length } : null;
  }

  function tryCSV(text) {
    var best = null;
    [{ d: ',', id: 'csv,' }, { d: ';', id: 'csv;' }, { d: '\t', id: 'csv\t' }].forEach(function (o) {
      if (text.indexOf(o.d) < 0) return;
      var r = csvCards(text, o.d);
      if (r && (!best || r.cards.length > best.cards.length)) {
        best = { cards: r.cards, format: o.id, dropped: r.dropped };
      }
    });
    return best;
  }

  var SEPARATORS = [
    { id: 'tab', label: 'Tabulation', re: /\t/ },
    { id: 'dblcolon', label: '::', re: /\s::\s/ },
    { id: 'semicolon', label: 'Point-virgule', re: /\s*;\s*/ },
    { id: 'pipe', label: 'Barre verticale |', re: /\s*\|\s*/ },
    { id: 'emdash', label: 'Tiret long —', re: /\s+[—–]\s+/ },
    { id: 'arrow', label: 'Flèche →', re: /\s*(?:→|->|=>)\s*/ },
    { id: 'colon', label: 'Deux-points', re: /\s*:\s+/, ambiguous: true }
  ];

  function splitBy(line, re) {
    var m = line.match(re);
    if (!m) return null;
    var i = line.indexOf(m[0]);
    return [line.slice(0, i), line.slice(i + m[0].length)];
  }

  /* ---- analyseurs ---- */

  function parseJSON(text) {
    var data;
    try { data = JSON.parse(text); } catch (e) { return null; }
    var arr = Array.isArray(data) ? data : (data && Array.isArray(data.cards) ? data.cards : null);
    if (!arr) return null;
    var out = [];
    arr.forEach(function (o) {
      if (!o || typeof o !== 'object') return;
      var f = o.front || o.question || o.recto || o.q || o.term || o.f;
      var b = o.back || o.answer || o.verso || o.a || o.r || o.definition || o.b;
      if (f && b) out.push({ f: clean(f), b: clean(b) });
    });
    return out.length ? out : null;
  }

  function parseQA(text) {
    // « Q : … » puis « R : … » sur des lignes successives
    var lines = text.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
    var out = [], pending = null;
    var qRe = /^(?:\*\*)?\s*(?:Q|Question)\s*(?:\d+)?\s*[:.\)]\s*/i;
    var aRe = /^(?:\*\*)?\s*(?:R|A|Réponse|Rep|Answer)\s*(?:\d+)?\s*[:.\)]\s*/i;
    lines.forEach(function (l) {
      if (qRe.test(l)) { pending = clean(l.replace(qRe, '')); }
      else if (aRe.test(l) && pending) { out.push({ f: pending, b: clean(l.replace(aRe, '')) }); pending = null; }
      else if (pending && out.length === 0 && !qRe.test(l)) { /* ligne de continuation ignorée */ }
    });
    return out.length ? out : null;
  }

  function parseSeparator(text, sep) {
    var lines = text.split(/\r?\n/).filter(function (l) { return l.trim(); });
    var out = [];
    lines.forEach(function (l) {
      var parts = splitBy(l, sep.re);
      if (!parts) return;
      var f = clean(parts[0]), b = clean(parts[1]);
      if (f && b) out.push({ f: f, b: b });
    });
    return out.length ? out : null;
  }

  function parseBlocks(text) {
    // blocs séparés par une ligne vide : 1re ligne = question, suite = réponse
    var blocks = text.split(/\r?\n\s*\r?\n/);
    // sans véritable ligne vide séparatrice, ce format n'a pas de sens :
    // il avalerait une simple liste de deux lignes en une seule fiche
    if (blocks.length < 2) return null;
    var out = [];
    blocks.forEach(function (blk) {
      var lines = blk.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
      if (lines.length < 2) return;
      var f = clean(lines[0]);
      var b = lines.slice(1).map(clean).filter(Boolean).join(' ');
      if (f && b) out.push({ f: f, b: b });
    });
    return out.length ? out : null;
  }

  /* Détection automatique : on essaie les formats du plus explicite au plus souple. */
  function parse(text, forced) {
    text = String(text || '').replace(/ /g, ' ').trim();
    if (!text) return { cards: [], format: null };

    if (forced === 'json') return { cards: parseJSON(text) || [], format: 'json' };
    if (forced === 'qa') return { cards: parseQA(text) || [], format: 'qa' };
    if (forced === 'blocks') return { cards: parseBlocks(text) || [], format: 'blocks' };
    if (forced && forced.indexOf('csv') === 0) {
      var fc = csvCards(text, forced.slice(3) || ',');
      return { cards: fc ? fc.cards : [], format: forced };
    }
    if (forced) {
      var s = SEPARATORS.filter(function (x) { return x.id === forced; })[0];
      if (s) return { cards: parseSeparator(text, s) || [], format: s.id };
    }

    var lines = text.split(/\r?\n/).filter(function (l) { return l.trim(); });
    var j = parseJSON(text);
    if (j) return { cards: j, format: 'json' };

    // CSV avant tout le reste : c'est le format des exports
    // (NotebookLM, Quizlet, Excel) et le seul qui gère les virgules
    // à l'intérieur des réponses.
    var csv = tryCSV(text);
    if (csv) return { cards: csv.cards, format: csv.format, dropped: csv.dropped };

    var qa = parseQA(text);
    if (qa && qa.length >= Math.max(1, Math.floor(lines.length / 4))) return { cards: qa, format: 'qa' };

    // séparateurs non ambigus : celui qui découpe le plus de lignes gagne
    var best = null;
    SEPARATORS.forEach(function (sep) {
      if (sep.ambiguous) return;
      var hits = lines.filter(function (l) { return sep.re.test(l); }).length;
      if (hits >= Math.ceil(lines.length * 0.6) && (!best || hits > best.hits)) {
        best = { sep: sep, hits: hits };
      }
    });
    if (best) {
      var r = parseSeparator(text, best.sep);
      if (r) return { cards: r, format: best.sep.id };
    }

    var blk = parseBlocks(text);
    if (blk) return { cards: blk, format: 'blocks' };

    // dernier recours : le deux-points, uniquement si les questions
    // obtenues restent courtes (sinon on coupe au milieu des phrases)
    var colon = SEPARATORS.filter(function (x) { return x.id === 'colon'; })[0];
    var hitsColon = lines.filter(function (l) { return colon.re.test(l); }).length;
    if (hitsColon >= Math.ceil(lines.length * 0.7)) {
      var rc = parseSeparator(text, colon);
      if (rc && rc.filter(function (c) { return c.f.length > 70; }).length / rc.length < 0.3) {
        return { cards: rc, format: 'colon' };
      }
    }

    return { cards: [], format: null };
  }

  var Cards = {
    separators: SEPARATORS,

    csvFormats: [
      { value: 'csv,', label: 'CSV — séparé par des virgules' },
      { value: 'csv;', label: 'CSV — séparé par des points-virgules' },
      { value: 'csv\t', label: 'CSV / TSV — séparé par des tabulations' }
    ],

    formatLabel: function (id) {
      if (id === 'json') return 'JSON';
      if (id === 'qa') return 'Question / Réponse';
      if (id === 'blocks') return 'Blocs séparés par une ligne vide';
      if (id === 'csv,') return 'CSV (virgules, guillemets gérés)';
      if (id === 'csv;') return 'CSV (points-virgules)';
      if (id === 'csv\t') return 'CSV / TSV (tabulations)';
      var s = SEPARATORS.filter(function (x) { return x.id === id; })[0];
      return s ? s.label : 'inconnu';
    },

    parse: parse,

    custom: function () {
      return Store.state.customCards || [];
    },

    /* ------------------------------------------------------------
       Fiches dérivées des chiffres clés des UE : chaque valeur à
       connaître par cœur devient une carte, rangée dans le paquet
       de son semestre. L'identifiant est stable (code d'UE + rang),
       pour que la répétition espacée survive aux mises à jour.
       ------------------------------------------------------------ */
    generatedCache: null,

    generated: function () {
      if (Cards.generatedCache) return Cards.generatedCache;
      var out = [];
      var G = window.UE_GUIDE || {};
      (window.CURRICULUM || []).forEach(function (sem) {
        sem.ues.forEach(function (u) {
          var g = G[u.code];
          if (!g || !g.chiffres) return;
          g.chiffres.forEach(function (pair, i) {
            var q = String(pair[0]).replace(/\s*\?$/, '');
            out.push({
              id: 'ue-' + sem.id + '-' + u.code.replace(/\s+/g, '') + '-' + i,
              deck: 'Chiffres · ' + sem.label,
              f: q + ' ?',
              b: String(pair[1]),
              hint: u.code + ' — ' + u.title,
              generated: true
            });
          });
        });
      });
      Cards.generatedCache = out;
      return out;
    },

    all: function () {
      return (window.FLASHCARDS || []).concat(Cards.generated()).concat(Cards.custom());
    },

    /* paquets, avec le nombre de fiches et l'origine */
    decks: function () {
      var d = {};
      Cards.all().forEach(function (c) {
        if (!d[c.deck]) d[c.deck] = { n: 0, custom: !!c.custom, generated: !!c.generated };
        d[c.deck].n++;
      });
      return d;
    },

    /* ------------------------------------------------------------
       Statistiques d'un lot de fiches : ce qui est dû aujourd'hui,
       la répartition dans les cinq boîtes et le taux de mémorisation.
       ------------------------------------------------------------ */
    srsOf: function (card) {
      return Store.state.srs[card.id] || null;
    },

    isDue: function (card) {
      var s = Store.state.srs[card.id];
      return !s || s.due <= Date.now();
    },

    stats: function (cards) {
      var boxes = [0, 0, 0, 0, 0, 0], due = 0, started = 0;
      cards.forEach(function (c) {
        var s = Store.state.srs[c.id];
        boxes[s ? s.box : 1]++;
        if (s) started++;
        if (Cards.isDue(c)) due++;
      });
      var mastered = boxes[4] + boxes[5];
      return {
        n: cards.length, due: due, started: started, boxes: boxes,
        mastered: mastered,
        pct: cards.length ? Math.round((mastered / cards.length) * 100) : 0
      };
    },

    /* Paquets rangés par origine — c'est ce que le sélecteur affiche :
       les fiches livrées, les chiffres tirés du référentiel d'UE, puis
       les fiches importées par l'étudiant. */
    groups: function () {
      var by = {};
      Cards.all().forEach(function (c) {
        var k = c.deck || 'Sans paquet';
        (by[k] = by[k] || []).push(c);
      });
      var out = [
        { id: 'core', label: 'Fiches OrthoStudent', icon: '📗', desc: 'Livrées avec l’application', decks: [] },
        { id: 'generated', label: 'Chiffres clés du référentiel', icon: '🔢', desc: 'Extraits automatiquement des fiches d’UE', decks: [] },
        { id: 'custom', label: 'Mes fiches importées', icon: '📥', desc: 'NotebookLM, cours, Quizlet…', decks: [] }
      ];
      Object.keys(by).sort(function (a, b) { return a.localeCompare(b, 'fr'); }).forEach(function (k) {
        var cards = by[k];
        var kind = cards[0].custom ? 'custom' : cards[0].generated ? 'generated' : 'core';
        var g = out.filter(function (o) { return o.id === kind; })[0];
        g.decks.push({ name: k, kind: kind, cards: cards, stats: Cards.stats(cards) });
      });
      return out.filter(function (o) { return o.decks.length; });
    },

    add: function (list, deck, source) {
      if (!Store.state.customCards) Store.state.customCards = [];
      var existing = {};
      Cards.all().forEach(function (c) { existing[(c.f || '').toLowerCase()] = true; });
      var added = 0, dupes = 0;
      list.forEach(function (c, i) {
        var key = (c.f || '').toLowerCase();
        if (!c.f || !c.b) return;
        if (existing[key]) { dupes++; return; }
        existing[key] = true;
        Store.state.customCards.push({
          id: uid(Store.state.customCards.length + i),
          deck: deck || 'Mes fiches',
          f: c.f, b: c.b,
          custom: true,
          source: source || null,
          at: Date.now()
        });
        added++;
      });
      Store.save();
      return { added: added, duplicates: dupes };
    },

    update: function (id, f, b) {
      var c = Cards.custom().filter(function (x) { return x.id === id; })[0];
      if (!c) return false;
      c.f = f; c.b = b;
      Store.save();
      return true;
    },

    remove: function (id) {
      var list = Store.state.customCards || [];
      var i = list.findIndex(function (c) { return c.id === id; });
      if (i < 0) return false;
      list.splice(i, 1);
      delete Store.state.srs[id];
      Store.save();
      return true;
    },

    removeDeck: function (deck) {
      var list = Store.state.customCards || [];
      var kept = [];
      var removed = 0;
      list.forEach(function (c) {
        if (c.deck === deck) { delete Store.state.srs[c.id]; removed++; }
        else kept.push(c);
      });
      Store.state.customCards = kept;
      Store.save();
      return removed;
    },

    renameDeck: function (from, to) {
      (Store.state.customCards || []).forEach(function (c) { if (c.deck === from) c.deck = to; });
      Store.save();
    }
  };

  window.Cards = Cards;
})();
