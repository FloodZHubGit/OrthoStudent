/* ============================================================
   Cours & fiches théoriques
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  M.theory = {
    id: 'theory', title: 'Cours & fiches', icon: '📚', group: 'Savoir',
    desc: 'Anatomie, oculomotricité, vision binoculaire, réfraction, pathologies',
    keywords: 'cours theorie anatomie physiologie pathologie strabisme refraction',
    render: function (ctx) {
      var chapters = window.THEORY;
      var params = (ctx && ctx.params) || {};
      var current = params.chapter || chapters[0].id;
      // section visée depuis la recherche rapide : elle s'ouvre seule
      var wanted = params.section || null;

      var body = el('div');

      /* n'ouvrir qu'une section et l'amener à l'écran */
      function openOnly(i, scroll) {
        var items = body.querySelectorAll('.acc-item');
        items.forEach(function (it, j) {
          var on = j === i;
          it.classList.toggle('open', on);
          var head = it.querySelector('.acc-head');
          if (head) head.setAttribute('aria-expanded', on ? 'true' : 'false');
        });
        if (scroll !== false && items[i]) items[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      function draw(chapId) {
        var ch = chapters.filter(function (c) { return c.id === chapId; })[0] || chapters[0];
        var open = 0;
        if (wanted) {
          ch.sections.forEach(function (s, i) { if (s.title === wanted) open = i; });
        }
        UI.clear(body);
        body.appendChild(el('div', { class: 'card' }, [
          el('h2', { text: ch.icon + '  ' + ch.title }),
          el('p', { text: ch.intro }),
          el('div', { class: 'flex wrap', style: { marginTop: '10px' } },
            ch.sections.map(function (s, i) {
              return el('span', {
                class: 'chip', text: s.title,
                onClick: function () { openOnly(i); }
              });
            }))
        ]));
        body.appendChild(el('div', { class: 'card selectable' },
          UI.accordion(ch.sections.map(function (s, i) {
            return { title: s.title, tag: s.tag, body: s.html, open: i === open };
          }))
        ));
        if (wanted && open > 0) setTimeout(function () { openOnly(open); }, 60);
        wanted = null;
      }

      var nav = el('div', { class: 'tabs', role: 'tablist' }, chapters.map(function (c) {
        var on = c.id === current;
        var t = el('div', {
          class: 'tab' + (on ? ' active' : ''), text: c.icon + ' ' + c.title,
          role: 'tab', 'aria-selected': on ? 'true' : 'false',
          onClick: function () {
            nav.querySelectorAll('.tab').forEach(function (x) {
              x.classList.remove('active');
              x.setAttribute('aria-selected', 'false');
            });
            t.classList.add('active');
            t.setAttribute('aria-selected', 'true');
            draw(c.id);
          }
        });
        return t;
      }));

      draw(current);

      return UI.page({
        crumb: 'Savoir',
        title: 'Cours & fiches de synthèse',
        subtitle: 'Le socle théorique organisé par grands chapitres. Cliquez sur un titre pour déplier la fiche ; le texte est sélectionnable et copiable.'
      }, [nav, body]);
    }
  };
})();
