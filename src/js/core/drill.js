/* ============================================================
   Drill — la couche commune aux exercices notés
   ------------------------------------------------------------
   Héritée de l'ancienne couche des simulateurs, dont c'était la
   seule partie qui tenait debout. Elle règle trois travers que
   chaque exercice réinventait :

     1. on pouvait valider plusieurs fois le même sujet, et donc
        empiler les notes sur une seule réponse ;
     2. on pouvait afficher la solution puis valider : 100 % ;
     3. le compte rendu allait d'une phrase à un tableau selon le
        module — l'étudiant ne savait jamais quoi y chercher.

   Une tentative est liée à un sujet : Drill.begin() à chaque
   tirage, Drill.peek() si la solution est dévoilée, Drill.grade()
   une seule fois. Le compte rendu a partout la même forme : ce
   que vous avez répondu, ce qu'il fallait, pourquoi, et le geste
   à corriger.
   ============================================================ */
(function () {
  'use strict';
  var el = UI.el, svg = UI.svg;

  var attempts = {};

  function attempt(id) {
    if (!attempts[id]) attempts[id] = { scored: false, peeked: false };
    return attempts[id];
  }

  /* ---------------- Déroulé d'une tentative ---------------- */

  function begin(id) {
    attempts[id] = { scored: false, peeked: false, at: Date.now() };
    return attempts[id];
  }

  function peek(id) { attempt(id).peeked = true; }

  /* Au plus une note par sujet, aucune si la solution a été affichée avant.
     `key` sépare les tentatives quand un même poste enchaîne plusieurs
     exercices indépendants : la note reste enregistrée sous le poste, mais
     le verrou est propre à l'exercice. */
  function grade(id, score, meta, key) {
    var a = attempt(key || id);
    score = Math.max(0, Math.min(100, Math.round(score)));
    if (a.peeked) return { score: score, recorded: false, why: 'peeked' };
    if (a.scored) return { score: score, recorded: false, why: 'already' };
    a.scored = true;
    Store.recordScore(id, score, meta || null);
    return { score: score, recorded: true, why: null };
  }

  /* ---------------- Compte rendu ---------------- */

  var BANDS = [
    { min: 85, label: 'Lecture juste', kind: 'green' },
    { min: 65, label: 'Correct, à affiner', kind: 'green' },
    { min: 40, label: 'Approximatif', kind: 'amber' },
    { min: 0, label: 'À reprendre', kind: 'red' }
  ];

  function band(score) {
    for (var i = 0; i < BANDS.length; i++) if (score >= BANDS[i].min) return BANDS[i];
    return BANDS[BANDS.length - 1];
  }

  function scoreColor(s) {
    return s >= 70 ? 'var(--green)' : s >= 40 ? 'var(--amber)' : 'var(--red)';
  }

  /* Comparaison votre réponse / la réalité, une ligne par élément.
     Un tableau à trois colonnes devenait illisible dans une colonne
     étroite : les valeurs se cassaient et l'écart — la seule chose à
     lire — disparaissait. */
  function compare(rows) {
    var wrap = el('div', { class: 'sim-cmp' });
    rows.forEach(function (r) {
      var mine = r[1] === undefined || r[1] === null || r[1] === '' ? '—' : String(r[1]);
      var real = r[2] === undefined || r[2] === null || r[2] === '' ? '—' : String(r[2]);
      var ok = r.length > 3 && r[3] !== undefined
        ? !!r[3]
        : mine.trim().toLowerCase() === real.trim().toLowerCase();
      wrap.appendChild(el('div', { class: 'sc-row ' + (ok ? 'ok' : 'ko') }, [
        el('div', { class: 'sc-k', html: r[0] }),
        el('div', { class: 'sc-pair' }, [
          el('div', { class: 'sc-v mine' }, [el('span', { class: 'sc-lab', text: 'vous' }), el('b', { html: mine })]),
          el('div', { class: 'sc-v real' }, [el('span', { class: 'sc-lab', text: 'attendu' }), el('b', { html: real })])
        ]),
        el('span', { class: 'sc-mark', text: ok ? '✔' : '✘' })
      ]));
    });
    return wrap;
  }

  /* o = { score, recorded, why, rows: [[quoi, votre réponse, attendu, ok?]],
           explain: html, tip: html, actions: [boutons] } */
  function debrief(o) {
    o = o || {};
    var s = typeof o.score === 'number' ? Math.round(o.score) : null;
    var b = s === null ? null : band(s);

    var head = el('div', { class: 'sim-verdict' }, [
      s === null ? null : el('div', { class: 'sv-score', style: { color: scoreColor(s) } }, [
        el('span', { class: 'n', text: String(s) }),
        el('span', { class: 'u', text: '%' })
      ]),
      el('div', { style: { minWidth: 0 } }, [
        b ? el('div', { class: 'sv-label', style: { color: scoreColor(s) }, text: b.label }) : null,
        el('div', { class: 'sv-sub', text: o.recorded === false
          ? (o.why === 'peeked'
              ? 'Solution déjà affichée : cette tentative ne compte pas dans vos scores.'
              : 'Ce dossier est déjà noté — tirez-en un nouveau pour une autre note.')
          : 'Note enregistrée dans votre progression.' })
      ].filter(Boolean))
    ].filter(Boolean));

    var rows = (o.rows || []).filter(Boolean);

    return UI.card('Compte rendu', [
      head,
      rows.length ? compare(rows) : null,
      o.explain ? UI.note('<b>Pourquoi.</b> ' + o.explain) : null,
      o.tip ? UI.note('<b>Le réflexe à prendre.</b> ' + o.tip, 'warn') : null,
      o.actions && o.actions.length ? el('div', { class: 'btn-row' }, o.actions.filter(Boolean)) : null
    ].filter(Boolean), { class: 'sim-debrief' });
  }

  /* ---------------- Historique ---------------- */

  function scores(id, n) {
    var out = [];
    (Store.state.log || []).forEach(function (l) {
      if (l.m === id && typeof l.s === 'number') out.push(l.s);
    });
    out.reverse();
    return n ? out.slice(-n) : out;
  }

  function spark(list) {
    var W = 220, H = 40, pad = 4;
    var g = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'sim-spark' });
    if (list.length < 2) return g;
    var pts = list.map(function (v, i) {
      return { x: pad + i * (W - pad * 2) / (list.length - 1), y: pad + (1 - v / 100) * (H - pad * 2) };
    });
    g.appendChild(svg('polyline', {
      points: pts.map(function (p) { return p.x + ',' + p.y; }).join(' '),
      fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2,
      'stroke-linejoin': 'round', 'stroke-linecap': 'round'
    }));
    var last = pts[pts.length - 1];
    g.appendChild(svg('circle', { cx: last.x, cy: last.y, r: 3, fill: 'var(--accent)' }));
    return g;
  }

  /* Le vocabulaire vient de l'appelant : ce composant sert la lecture de
     bilan comme l'atelier de calcul, et « Bilans lus » n'a aucun sens dans
     le second. Les valeurs par défaut restent neutres. */
  function history(id, opts) {
    opts = opts || {};
    var sc = Store.score(id);
    if (!sc) {
      return UI.card(opts.title || 'Votre historique',
        UI.empty('📊', opts.vide || 'Rien de fait pour l’instant.'));
    }
    var list = scores(id, 14);
    var trend = null;
    if (list.length >= 4) {
      var half = Math.floor(list.length / 2);
      var a = list.slice(0, half), b = list.slice(half);
      var avg = function (x) { return x.reduce(function (p, c) { return p + c; }, 0) / x.length; };
      var d = Math.round(avg(b) - avg(a));
      trend = d > 3 ? { t: '↗ en progrès (+' + d + ' pts)', c: 'green' }
            : d < -3 ? { t: '↘ en baisse (' + d + ' pts)', c: 'amber' }
            : { t: '→ stable', c: '' };
    }
    return UI.card(opts.title || 'Votre historique', [
      el('div', { class: 'grid g4' }, [
        UI.stat(sc.attempts, opts.compte || 'Essais'),
        UI.stat(sc.avg + ' %', 'Moyenne', scoreColor(sc.avg)),
        UI.stat(sc.best + ' %', 'Meilleur', 'var(--green)'),
        UI.stat(sc.last + ' %', 'Dernier', scoreColor(sc.last))
      ]),
      list.length >= 2 ? el('div', { class: 'sim-hist' }, [
        spark(list), el('span', { class: 'muted small',
          text: 'Les ' + list.length + ' ' + (opts.recents || 'derniers essais') })
      ]) : null,
      trend ? UI.chip(trend.t, trend.c) : null
    ].filter(Boolean), opts.right ? { right: opts.right } : undefined);
  }

  /* ---------------- Consigne ---------------- */

  function brief(o) {
    o = o || {};
    return el('div', { class: 'sim-brief' }, [
      el('span', { class: 'sb-ic', text: o.icon || '🎯' }),
      el('div', { style: { minWidth: 0 } }, [
        el('div', { class: 'sb-t', text: o.task || 'Lisez, puis concluez.' }),
        o.scoring ? el('div', { class: 'sb-d', html: '<b>Notation.</b> ' + o.scoring }) : null
      ].filter(Boolean))
    ]);
  }

  window.Drill = {
    begin: begin, peek: peek, grade: grade,
    compare: compare,
    debrief: debrief, history: history, brief: brief
  };
})();
