/* ============================================================
   Glossaire
   ------------------------------------------------------------
   Recherche sur le terme, ses synonymes et sa définition,
   index alphabétique, filtres par catégorie, renvois cliquables.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  /* même chaîne normalisée, mais de longueur identique à l'originale :
     indispensable pour reporter les positions trouvées sur le texte affiché */
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
    return norm(q).split(/\s+/).filter(Boolean);
  }

  /* surligne les portions correspondant à la requête */
  function highlight(text, toks) {
    var frag = document.createDocumentFragment();
    text = String(text || '');
    if (!toks || !toks.length) { frag.appendChild(document.createTextNode(text)); return frag; }
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
    for (var j = 0; j < text.length; j++) {
      var m = !!marks[j];
      if (m !== on) { flush(); on = m; }
      buf += text.charAt(j);
    }
    flush();
    return frag;
  }

  /* lettre de classement : É et E vont ensemble */
  function letterOf(g) {
    return normKeepLength(g.t).charAt(0).toUpperCase();
  }

  function blob(g) {
    return norm(g.t + ' ' + (g.a || '') + ' ' + (g.n || '') + ' ' + g.d + ' ' + g.c);
  }

  M.glossary = {
    id: 'glossary', title: 'Glossaire', icon: '📖', group: 'Savoir',
    desc: 'Tous les termes du vocabulaire orthoptique, avec normes et renvois',
    keywords: 'glossaire definition vocabulaire terme lexique norme synonyme abreviation',
    render: function (ctx) {
      /* terme visé depuis la recherche rapide (Ctrl+K) */
      var target = (ctx && ctx.params && ctx.params.term) || null;
      var st = { q: '', cat: null, letter: null, sort: 'alpha', normsOnly: false };

      /* index préparés une fois pour toutes */
      var cats = {}, byTitle = {}, letters = {};
      GLOSSARY.forEach(function (g) {
        cats[g.c] = (cats[g.c] || 0) + 1;
        byTitle[g.t] = g;
        letters[letterOf(g)] = (letters[letterOf(g)] || 0) + 1;
        g._s = blob(g);
      });
      var nNorms = GLOSSARY.filter(function (g) { return g.n; }).length;

      var list = el('div');
      var countLine = el('div', { class: 'small muted', style: { margin: '2px 0 10px' } });
      var search = el('input', {
        type: 'text', class: 'inp',
        placeholder: 'Rechercher un terme, une abréviation, une définition…  (AC/A, Panum, scotome…)'
      });

      /* ---------- filtrage ---------- */
      function selection() {
        var toks = tokens(st.q);
        return GLOSSARY.filter(function (g) {
          if (st.cat && g.c !== st.cat) return false;
          if (st.letter && letterOf(g) !== st.letter) return false;
          if (st.normsOnly && !g.n) return false;
          for (var i = 0; i < toks.length; i++) if (g._s.indexOf(toks[i]) < 0) return false;
          return true;
        }).sort(function (a, b) {
          if (st.sort === 'cat' && a.c !== b.c) return a.c.localeCompare(b.c, 'fr');
          return a.t.localeCompare(b.t, 'fr');
        });
      }

      /* ---------- une entrée ---------- */
      function entryCard(g, toks, hit) {
        var title = el('b', { class: 'gl-t selectable' });
        title.appendChild(highlight(g.t, toks));

        var head = el('div', { class: 'flex wrap gl-head' }, [
          title,
          g.a ? el('span', { class: 'gl-syn selectable', text: g.a }) : null,
          el('span', { class: 'spacer' }),
          el('span', {
            class: 'chip gl-copy', text: '⧉', title: 'Copier la définition',
            onClick: function (e) {
              e.stopPropagation();
              UI.copy(g.t + (g.a ? ' (' + g.a + ')' : '') + ' — ' + g.d + (g.n ? '\nÀ retenir : ' + g.n : ''),
                '« ' + g.t + ' » copié.');
            }
          }),
          el('span', {
            class: 'chip', text: g.c,
            title: 'Ne garder que cette catégorie',
            onClick: function (e) { e.stopPropagation(); st.cat = g.c; syncChips(); draw(); }
          })
        ].filter(Boolean));

        var def = el('p', { class: 'gl-d selectable' });
        def.appendChild(highlight(g.d, toks));

        var kids = [head, def];

        if (g.n) {
          kids.push(el('div', { class: 'gl-norm' }, [
            el('span', { class: 'gl-norm-k', text: 'À retenir' }),
            el('span', { class: 'gl-norm-v selectable', text: g.n })
          ]));
        }

        if (g.v && g.v.length) {
          kids.push(el('div', { class: 'flex wrap gl-see' }, [
            el('span', { class: 'gl-see-k', text: 'Voir aussi' })
          ].concat(g.v.filter(function (t) { return byTitle[t]; }).map(function (t) {
            return el('span', {
              class: 'chip', text: t,
              onClick: function () { jumpTo(t); }
            });
          }))));
        }

        return el('div', { class: 'card gl-item' + (hit ? ' flash' : ''), id: 'gl-' + encodeURIComponent(g.t) }, kids);
      }

      /* ---------- rendu ---------- */
      function draw(focus) {
        UI.clear(list);
        var focusTerm = focus || target; target = null;
        var toks = tokens(st.q);
        var items = selection();

        var filters = [];
        if (st.cat) filters.push(st.cat);
        if (st.letter) filters.push('lettre ' + st.letter);
        if (st.normsOnly) filters.push('avec un chiffre à retenir');
        UI.clear(countLine);
        countLine.appendChild(el('span', {
          html: '<b style="color:var(--accent)">' + items.length + '</b> terme' + (items.length > 1 ? 's' : '') +
            ' sur ' + GLOSSARY.length + (filters.length ? ' — ' + filters.join(', ') : '')
        }));

        if (!items.length) {
          list.appendChild(UI.empty('🔍', 'Aucun terme ne correspond.<br>Essayez une abréviation (AC/A, DVD, BUT) ou un mot de la définition.'));
          return;
        }

        var group = '';
        items.forEach(function (g) {
          var key = st.sort === 'cat' ? g.c : letterOf(g);
          if (key !== group) {
            group = key;
            list.appendChild(el('h3', {
              class: 'gl-group', text: key,
              // ancre de l'index alphabétique
              id: st.sort === 'alpha' ? 'gl-letter-' + key : null
            }));
          }
          var hit = focusTerm && g.t === focusTerm;
          var card = entryCard(g, toks, hit);
          list.appendChild(card);
          if (hit) setTimeout(function () { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
        });
      }

      /* met en avant un terme, filtres remis à zéro */
      function jumpTo(term) {
        if (!byTitle[term]) { UI.toast('Terme inconnu : ' + term); return; }
        st.q = ''; st.cat = null; st.letter = null; st.normsOnly = false;
        search.value = '';
        syncChips();
        draw(term);
      }

      /* ---------- barres de filtres ---------- */
      var catChips = el('div', { class: 'flex wrap' });
      var alphaBar = el('div', { class: 'flex wrap gl-alpha' });
      var normChip = el('span', {
        class: 'chip', text: '⭐ Chiffres à retenir (' + nNorms + ')',
        onClick: function () { st.normsOnly = !st.normsOnly; syncChips(); draw(); }
      });

      function syncChips() {
        catChips.querySelectorAll('.chip').forEach(function (c) {
          c.classList.toggle('on', c.dataset.cat === (st.cat || ''));
        });
        alphaBar.querySelectorAll('.chip').forEach(function (c) {
          c.classList.toggle('on', c.dataset.letter === (st.letter || ''));
        });
        normChip.classList.toggle('on', st.normsOnly);
      }

      catChips.appendChild(el('span', {
        class: 'chip on', text: 'Tout (' + GLOSSARY.length + ')', dataset: { cat: '' },
        onClick: function () { st.cat = null; syncChips(); draw(); }
      }));
      Object.keys(cats).sort(function (a, b) { return a.localeCompare(b, 'fr'); }).forEach(function (k) {
        catChips.appendChild(el('span', {
          class: 'chip', text: k + ' (' + cats[k] + ')', dataset: { cat: k },
          onClick: function () { st.cat = st.cat === k ? null : k; syncChips(); draw(); }
        }));
      });

      alphaBar.appendChild(el('span', {
        class: 'chip on', text: 'A → Z', dataset: { letter: '' },
        onClick: function () { st.letter = null; syncChips(); draw(); }
      }));
      Object.keys(letters).sort().forEach(function (L) {
        alphaBar.appendChild(el('span', {
          class: 'chip', text: L, dataset: { letter: L }, title: letters[L] + ' terme(s)',
          onClick: function () { st.letter = st.letter === L ? null : L; syncChips(); draw(); }
        }));
      });

      search.addEventListener('input', function () {
        st.q = search.value;
        // une recherche annule le filtre de lettre, sinon on cherche dans le vide
        if (st.q && st.letter) { st.letter = null; syncChips(); }
        draw();
      });

      var sortSel = UI.select([
        { value: 'alpha', label: 'Ordre alphabétique' },
        { value: 'cat', label: 'Par catégorie' }
      ], 'alpha', function (v) { st.sort = v; draw(); });

      function randomTerm() {
        var pool = selection();
        if (!pool.length) pool = GLOSSARY;
        var g = pool[Math.floor(Math.random() * pool.length)];
        draw(g.t);
        UI.toast('Au hasard : ' + g.t);
      }

      draw();

      var root = UI.page({
        crumb: 'Savoir',
        title: 'Glossaire orthoptique',
        subtitle: GLOSSARY.length + ' termes définis dans ' + Object.keys(cats).length + ' catégories, ' +
          nNorms + ' avec la valeur normale à connaître. Les renvois <i>« voir aussi »</i> sont cliquables.'
      }, [
        UI.card(null, [
          search,
          el('div', { class: 'mt16' }, catChips),
          el('div', { style: { marginTop: '10px' } }, alphaBar),
          el('div', { class: 'btn-row', style: { marginTop: '12px' } }, [
            normChip,
            el('span', { class: 'spacer' }),
            sortSel,
            UI.btn('🎲 Terme au hasard', randomTerm),
            UI.btn('Réinitialiser', function () {
              st = { q: '', cat: null, letter: null, sort: st.sort, normsOnly: false };
              search.value = ''; syncChips(); draw();
            })
          ])
        ]),
        countLine,
        list,
        UI.keyhint([['R', 'terme au hasard'], ['Ctrl+K', 'recherche globale']])
      ]);

      /* révision éclair : on tire un terme au hasard sans quitter la page */
      UI.hotkeys(root, { 'r': randomTerm });

      return root;
    }
  };
})();
