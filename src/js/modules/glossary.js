/* ============================================================
   Glossaire
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  function norm(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  M.glossary = {
    id: 'glossary', title: 'Glossaire', icon: '📖', group: 'Savoir',
    desc: 'Tous les termes du vocabulaire orthoptique',
    keywords: 'glossaire definition vocabulaire terme lexique',
    render: function (ctx) {
      // terme visé depuis la recherche rapide (Ctrl+K)
      var target = (ctx && ctx.params && ctx.params.term) || null;
      var st = { q: '', cat: null };
      var list = el('div');

      var cats = {};
      GLOSSARY.forEach(function (g) { cats[g.c] = (cats[g.c] || 0) + 1; });

      function draw() {
        UI.clear(list);
        // le terme visé n'est mis en avant qu'au premier affichage
        var focusTerm = target; target = null;
        var q = norm(st.q);
        var items = GLOSSARY.filter(function (g) {
          if (st.cat && g.c !== st.cat) return false;
          if (!q) return true;
          return norm(g.t).indexOf(q) >= 0 || norm(g.d).indexOf(q) >= 0;
        }).sort(function (a, b) { return a.t.localeCompare(b.t, 'fr'); });

        if (!items.length) { list.appendChild(el('p', { class: 'muted', text: 'Aucun terme ne correspond.' })); return; }

        var letter = '';
        items.forEach(function (g) {
          var L = g.t[0].toUpperCase();
          if (L !== letter) {
            letter = L;
            list.appendChild(el('h3', { text: letter, style: { color: 'var(--accent)', marginTop: '18px' } }));
          }
          var hit = focusTerm && g.t === focusTerm;
          var card = el('div', { class: 'card' + (hit ? ' flash' : ''), style: { marginBottom: '8px', padding: '13px 16px' } }, [
            el('div', { class: 'flex' }, [
              el('b', { class: 'selectable', text: g.t }),
              el('span', { class: 'spacer' }),
              UI.chip(g.c)
            ]),
            el('p', { class: 'selectable', style: { margin: '5px 0 0' }, text: g.d })
          ]);
          list.appendChild(card);
          if (hit) setTimeout(function () { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
        });
      }

      var search = el('input', { type: 'text', class: 'inp', placeholder: 'Rechercher un terme ou une définition…' });
      search.addEventListener('input', function () { st.q = search.value; draw(); });

      var catChips = el('div', { class: 'flex wrap' }, [
        el('span', { class: 'chip on', text: 'Tout', onClick: function (e) {
          st.cat = null; catChips.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
          e.currentTarget.classList.add('on'); draw();
        } })
      ].concat(Object.keys(cats).sort().map(function (k) {
        return el('span', { class: 'chip', text: k + ' (' + cats[k] + ')', onClick: function (e) {
          st.cat = k; catChips.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
          e.currentTarget.classList.add('on'); draw();
        } });
      })));

      draw();

      return UI.page({
        crumb: 'Savoir',
        title: 'Glossaire orthoptique',
        subtitle: GLOSSARY.length + ' termes définis, du vocabulaire de base aux tests spécialisés.'
      }, [
        UI.card(null, [search, el('div', { class: 'mt16' }, catChips)]),
        list
      ]);
    }
  };
})();
