/* ============================================================
   Fiches mémo — révision espacée, import, lecture d’Anki
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  var BASIC_NAMES = /^(basic|basique|b[aá]sico|basis|einfach|básico|基本|기본)$/i;



  M.flashcards = {
    id: 'flashcards', title: 'Mes cartes Anki', icon: '⚡', group: 'Mon travail',
    desc: 'Les cartes de votre collection Anki, rangées comme vous les avez rangées',
    keywords: 'anki cartes collection paquet deck fiches memo revision cours ue chercher relire',
    render: function (ctx) {
      var st = {
        deck: null, queue: [], i: 0, flipped: false, focused: false,
        session: { ok: 0, ko: 0, missed: [] },
        /* réglages de session, conservés d'une session à l'autre */
        opts: Object.assign({ limit: 20, order: 'due', dueOnly: false },
          (Store.state.settings.review || {}))
      };

      function saveOpts() {
        Store.state.settings.review = st.opts;
        Store.save();
      }

      // fiche ouverte directement depuis la recherche rapide (Ctrl+K)
      var wantedCard = (ctx && ctx.params && ctx.params.cardId) || null;
      // file lancée depuis la séance du jour : { auto: 'due', limit: n }
      var autoRun = (ctx && ctx.params && ctx.params.auto) || null;
      var autoLimit = (ctx && ctx.params && ctx.params.limit) || 0;
      // lot de fiches précis, lancé depuis une fiche d'UE : { ids: [...] }
      var autoIds = (ctx && ctx.params && ctx.params.ids) || null;
      // carte Anki ouverte depuis la recherche rapide : { carte: 'anki-…' }
      var carteVisee = (ctx && ctx.params && ctx.params.carte) || null;
      // écran filtré sur une UE, depuis sa fiche : { ue: 'UE04' }
      var ueVisee = (ctx && ctx.params && ctx.params.ue) || null;

      /* ============================================================
         Onglet 1 — révision
         ============================================================ */
      function tabReview() {
        var body = el('div');

        function box(c) { return (Store.state.srs[c.id] || { box: 1 }).box; }
        function seen(c) { return (Store.state.srs[c.id] || { seen: 0 }).seen; }

        function shuffle(a) {
          for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
          }
          return a;
        }

        /* La file dépend des réglages : périmètre (un paquet ou tout),
           filtre « seulement ce qui est dû », ordre, puis longueur. */
        function buildQueue(cards) {
          var list = cards || Cards.all().filter(function (c) { return !st.deck || c.deck === st.deck; });
          list = list.slice();

          if (!cards) {
            if (st.opts.dueOnly) list = list.filter(Cards.isDue);

            if (st.opts.order === 'random') shuffle(list);
            else if (st.opts.order === 'weak') {
              list.sort(function (a, b) { return box(a) - box(b) || seen(b) - seen(a); });
            } else if (st.opts.order === 'due') {
              // ce qui est dû d'abord, et parmi eux les fiches les moins solides
              list.sort(function (a, b) {
                return (Cards.isDue(a) ? 0 : 1) - (Cards.isDue(b) ? 0 : 1) || box(a) - box(b);
              });
            }
            // 'deck' : on garde l'ordre du paquet, utile pour un chapitre suivi

            if (st.opts.limit && list.length > st.opts.limit) list = list.slice(0, st.opts.limit);
          }

          st.queue = list;
          st.i = 0; st.flipped = false; st.session = { ok: 0, ko: 0, missed: [] }; st.focused = false;
        }

        /* file d'une seule fiche : révision ciblée, sans score de session */
        function focusCard(id) {
          var c = Cards.all().filter(function (x) { return x.id === id; })[0];
          if (!c) return false;
          st.queue = [c]; st.i = 0; st.flipped = false; st.session = { ok: 0, ko: 0, missed: [] }; st.focused = true;
          return true;
        }

        function answer(q) {
          var c = st.queue[st.i];
          Store.reviewCard(c.id, q);
          if (q === 2) st.session.ok++;
          else { st.session.ko++; st.session.missed.push(c); }
          st.i++; st.flipped = false;
          draw();
        }

        function draw() {
          UI.clear(body);
          if (!st.queue.length) { body.appendChild(picker()); return; }
          if (st.i >= st.queue.length) { body.appendChild(done()); return; }

          var c = st.queue[st.i];
          var srs = Store.state.srs[c.id] || { box: 1, seen: 0 };

          var card = el('div', {
            class: 'flashcard', onClick: function () { st.flipped = !st.flipped; draw(); }
          }, [
            el('span', { class: 'side-label', text: st.flipped ? 'Réponse' : 'Question' }),
            el('div', { class: 'selectable', html: st.flipped ? '<b>' + c.b + '</b>' : c.f })
          ]);

          body.appendChild(UI.card(null, [
            el('div', { class: 'flex wrap' }, [
              UI.chip(c.deck, 'blue'),
              c.custom ? UI.chip('importée', 'violet') : null,
              c.hint ? UI.chip(c.hint.length > 42 ? c.hint.slice(0, 40) + '…' : c.hint) : null,
              UI.chip('Boîte ' + srs.box + '/5', srs.box >= 4 ? 'green' : srs.box >= 2 ? 'amber' : ''),
              el('span', { class: 'spacer' }),
              st.session.ok ? el('span', { class: 'small', style: { color: 'var(--green)' }, text: '✓ ' + st.session.ok }) : null,
              st.session.ko ? el('span', { class: 'small', style: { color: 'var(--amber)' }, text: '↻ ' + st.session.ko }) : null,
              el('span', { class: 'muted small', text: (st.i + 1) + ' / ' + st.queue.length })
            ].filter(Boolean)),
            UI.bar((st.i / st.queue.length) * 100),
            el('div', { class: 'mt16' }, card),
            st.flipped
              ? el('div', { class: 'btn-row mt16', style: { justifyContent: 'center' } }, [
                  UI.btn('😖 Oublié', function () { answer(0); }, 'danger'),
                  UI.btn('🤔 Difficile', function () { answer(1); }),
                  UI.btn('😀 Su', function () { answer(2); }, 'primary')
                ])
              : el('p', { class: 'muted center mt16', text: 'Cliquez la carte pour la retourner.' })
          ]));

          body.appendChild(el('div', { class: 'btn-row' }, [
            UI.btn('← Changer de paquet', function () { st.queue = []; draw(); }),
            UI.btn('Passer', function () { st.i++; st.flipped = false; draw(); }),
            el('span', { class: 'spacer' }),
            el('span', { class: 'muted small', text: st.focused ? 'Fiche isolée — hors session' : 'Reste ' + (st.queue.length - st.i) + ' fiche(s)' })
          ]));

          body.appendChild(UI.keyhint([
            ['Espace', 'retourner'], ['1', 'oublié'], ['2', 'difficile'], ['3', 'su'], ['→', 'passer']
          ]));
        }

        /* révision au clavier : on garde les mains sur les chiffres */
        UI.hotkeys(body, {
          ' ': function () { if (st.queue.length && st.i < st.queue.length) { st.flipped = !st.flipped; draw(); } },
          'Enter': function () { if (st.queue.length && st.i < st.queue.length) { st.flipped = !st.flipped; draw(); } },
          '1': function () { if (st.flipped) answer(0); },
          '2': function () { if (st.flipped) answer(1); },
          '3': function () { if (st.flipped) answer(2); },
          'ArrowRight': function () {
            if (st.queue.length && st.i < st.queue.length) { st.i++; st.flipped = false; draw(); }
          }
        });

        var scored = false;   // une session ne compte qu'une fois, même si on la ré-affiche

        function done() {
          var total = st.session.ok + st.session.ko;
          var pct = total ? Math.round((st.session.ok / total) * 100) : 0;
          // une fiche isolée ouverte depuis la recherche ne fait pas une session
          if (!st.focused && total && !scored) { Store.recordScore('flashcards', pct, { n: total }); scored = true; }
          var missed = st.session.missed.slice();

          return UI.card('Session terminée', [
            el('div', { class: 'grid g3' }, [
              UI.stat(st.session.ok, 'Sues', 'var(--green)'),
              UI.stat(st.session.ko, 'À revoir', 'var(--amber)'),
              UI.stat(pct + ' %', 'Taux')
            ]),
            missed.length
              ? el('div', {}, [
                  el('h3', { text: 'Les ' + missed.length + ' fiche(s) à retravailler' }),
                  UI.table(['Question', 'Réponse'], missed.slice(0, 12).map(function (c) { return [c.f, c.b]; }), { scroll: '260px' })
                ])
              : UI.note('Tout est passé du premier coup — la file suivante sera plus espacée.'),
            UI.note('Les cartes ratées reviennent demain, les cartes sues sont reprogrammées de plus en plus loin (1, 2, 5, 10 puis 25 jours).'),
            el('div', { class: 'btn-row' }, [
              missed.length
                ? UI.btn('↻ Revoir les ' + missed.length + ' ratées', function () {
                    scored = true; buildQueue(missed); st.focused = true; draw();
                  }, 'primary')
                : null,
              UI.btn('Nouvelle session', function () { scored = false; buildQueue(); draw(); }, missed.length ? '' : 'primary'),
              UI.btn('← Changer de paquet', function () { scored = false; st.queue = []; draw(); })
            ].filter(Boolean))
          ]);
        }

        /* ---- sélecteur de paquets ---- */
        function start(deck) {
          st.deck = deck;
          buildQueue();
          if (!st.queue.length) {
            UI.toast(st.opts.dueOnly
              ? 'Rien à revoir dans ce paquet aujourd’hui — décochez « seulement les fiches dues ».'
              : 'Ce paquet est vide.');
            return;
          }
          draw();
        }

        function deckCard(name, label, stats, tags) {
          var pct = stats.pct;
          return el('div', { class: 'tool-card deck-pick', onClick: function () { start(name); } }, [
            el('div', { class: 'flex', style: { marginBottom: '6px' } }, [
              el('h4', { style: { margin: 0 }, text: label }),
              el('span', { class: 'spacer' })
            ].concat(tags || [])),
            el('p', { style: { margin: '0 0 8px' } , text:
              stats.n + ' fiche' + (stats.n > 1 ? 's' : '') +
              ' · ' + stats.mastered + ' mémorisée' + (stats.mastered > 1 ? 's' : '') +
              (stats.due ? ' · ' + stats.due + ' à revoir' : '') }),
            UI.bar(pct, pct >= 70 ? 'var(--green)' : pct >= 30 ? 'var(--accent)' : 'var(--amber)'),
            el('div', { class: 'small muted', style: { marginTop: '5px' }, text: pct + ' % en boîte 4 ou 5' })
          ]);
        }

        function picker() {
          var all = Cards.all();
          var global = Cards.stats(all);
          var groups = Cards.groups();
          var streak = Store.streak();

          /* réglages de session */
          var limitSel = UI.select([
            { value: '10', label: '10 fiches — révision éclair' },
            { value: '20', label: '20 fiches — session courte' },
            { value: '30', label: '30 fiches' },
            { value: '50', label: '50 fiches' },
            { value: '0', label: 'Tout le paquet' }
          ], String(st.opts.limit), function (v) { st.opts.limit = parseInt(v, 10) || 0; saveOpts(); });

          var orderSel = UI.select([
            { value: 'due', label: 'Ce qui est dû en premier' },
            { value: 'weak', label: 'Les plus fragiles d’abord' },
            { value: 'random', label: 'Ordre aléatoire' },
            { value: 'deck', label: 'Ordre du paquet' }
          ], st.opts.order, function (v) { st.opts.order = v; saveOpts(); });

          var dueChip = el('span', {
            class: 'chip' + (st.opts.dueOnly ? ' on' : ''),
            text: '⏳ Seulement les fiches dues',
            onClick: function (e) {
              st.opts.dueOnly = !st.opts.dueOnly;
              e.currentTarget.classList.toggle('on', st.opts.dueOnly);
              saveOpts();
            }
          });

          var wrap = el('div', {}, [
            /* 1. où en est-on */
            UI.card('Où en êtes-vous', [
              el('div', { class: 'grid g4' }, [
                UI.stat(global.due, 'À réviser aujourd’hui', global.due ? 'var(--amber)' : 'var(--green)'),
                UI.stat(global.mastered, 'Bien mémorisées', 'var(--green)'),
                UI.stat(global.n, 'Fiches au total'),
                UI.stat(streak.current + ' j', 'Série en cours', streak.current ? 'var(--accent)' : null)
              ]),
              UI.bar(global.pct, 'var(--green)'),
              el('div', { class: 'small muted', style: { marginTop: '6px' },
                text: global.pct + ' % du fonds est en boîte 4 ou 5 — ' + global.started + ' fiche(s) déjà vue(s) au moins une fois.' })
            ]),

            /* 2. comment réviser */
            UI.card('Régler la session', [
              el('div', { class: 'grid g2' }, [
                UI.field('Longueur', limitSel, 'Mieux vaut une file courte tous les jours qu’une longue une fois par semaine.'),
                UI.field('Ordre de passage', orderSel, '« Les plus fragiles » remonte les fiches restées en boîte 1.')
              ]),
              el('div', { class: 'btn-row' }, [
                dueChip,
                el('span', { class: 'spacer' }),
                UI.btn('🎴 Réviser tout le fonds (' + global.n + ')', function () { start(null); }, 'primary'),
                global.due
                  ? UI.btn('⏳ Réviser les ' + global.due + ' fiches dues', function () {
                      st.opts.dueOnly = true; saveOpts(); start(null);
                    })
                  : null
              ].filter(Boolean))
            ])
          ]);

          /* 3. les paquets, groupés par origine */
          groups.forEach(function (g) {
            var gStats = Cards.stats(g.decks.reduce(function (a, d) { return a.concat(d.cards); }, []));
            wrap.appendChild(UI.card(g.icon + '  ' + g.label, [
              el('p', { class: 'muted small', style: { margin: '-4px 0 12px' },
                text: g.desc + ' — ' + g.decks.length + ' paquet(s), ' + gStats.n + ' fiche(s)' +
                  (gStats.due ? ', ' + gStats.due + ' à revoir' : '') }),
              el('div', { class: 'grid g3' }, g.decks.map(function (d) {
                return deckCard(d.name, d.name, d.stats, [
                  d.stats.due ? UI.chip(d.stats.due + ' à revoir', 'amber') : null,
                  d.kind === 'custom' ? UI.chip('importé', 'violet') : null
                ].filter(Boolean));
              }))
            ]));
          });

          /* 4. le détail du système de boîtes */
          wrap.appendChild(UI.card('Répartition dans les boîtes de Leitner', [
            UI.table(['Boîte', 'Fiches', 'Prochain rappel'], [1, 2, 3, 4, 5].map(function (b) {
              return [
                'Boîte ' + b,
                global.boxes[b],
                Store.boxIntervals[b] + ' jour' + (Store.boxIntervals[b] > 1 ? 's' : '')
              ];
            }), { numeric: [1] }),
            UI.note('Une carte sue monte d’une boîte, une carte oubliée retombe en boîte 1. ' +
              'Réviser 10 minutes par jour vaut mieux que deux heures la veille de l’examen.')
          ]));

          return wrap;
        }

        if (wantedCard) { focusCard(wantedCard); wantedCard = null; }
        else if (autoIds && autoIds.length) {
          var byId = {};
          Cards.all().forEach(function (c) { byId[c.id] = c; });
          var lot = autoIds.map(function (id) { return byId[id]; }).filter(Boolean);
          autoIds = null;
          if (lot.length) { buildQueue(lot); draw(); return body; }
        }
        else if (autoRun === 'due') {
          st.opts.dueOnly = true;
          if (autoLimit) st.opts.limit = autoLimit;
          st.opts.order = 'due';
          autoRun = null;
          start(null);
          return body;
        }
        draw();
        return body;
      }

      /* ============================================================
         Onglet 2 — mes fiches
         ============================================================ */
      function tabMine() {
        var body = el('div');

        function draw() {
          UI.clear(body);
          var mine = Cards.custom();
          if (!mine.length) {
            body.appendChild(UI.card('Mes fiches', UI.empty('🗃',
              'Aucune fiche importée pour l’instant.<br>Passez par l’onglet <b>Importer</b>.')));
            return;
          }

          var byDeck = {};
          mine.forEach(function (c) { (byDeck[c.deck] = byDeck[c.deck] || []).push(c); });

          Object.keys(byDeck).forEach(function (deck) {
            var list = byDeck[deck];
            var rows = list.map(function (c) {
              var fIn = el('input', { type: 'text', class: 'inp', value: c.f });
              var bIn = el('input', { type: 'text', class: 'inp', value: c.b });
              fIn.addEventListener('change', function () { Cards.update(c.id, fIn.value, bIn.value); });
              bIn.addEventListener('change', function () { Cards.update(c.id, fIn.value, bIn.value); });
              return [
                fIn, bIn,
                UI.btn('Supprimer', function () {
                  if (confirm('Supprimer cette fiche ?')) { Cards.remove(c.id); draw(); App.refreshNav(); }
                }, 'sm danger')
              ];
            });

            body.appendChild(UI.card(deck + ' — ' + list.length + ' fiche' + (list.length > 1 ? 's' : ''), [
              UI.table(['Question', 'Réponse', ''], rows, { scroll: '420px' }),
              el('div', { class: 'btn-row mt16' }, [
                UI.btn('Renommer le paquet', function () {
                  var n = prompt('Nouveau nom du paquet :', deck);
                  if (n && n.trim() && n !== deck) { Cards.renameDeck(deck, n.trim()); draw(); }
                }),
                UI.btn('Supprimer le paquet', function () {
                  if (confirm('Supprimer les ' + list.length + ' fiches du paquet « ' + deck + ' » ?')) {
                    Cards.removeDeck(deck); draw(); App.refreshNav();
                  }
                }, 'danger')
              ])
            ]));
          });

          body.appendChild(UI.note('Les fiches importées se modifient directement dans les champs ci-dessus. ' +
            'Elles suivent la même révision espacée que les fiches livrées avec l’application.'));
        }

        draw();
        return body;
      }

      /* ============================================================
         Onglet 3 — Anki, en lecture seule
         ------------------------------------------------------------
         L'application lisait Anki à l'envers : elle y ENVOYAIT ses
         propres fiches. Ce chemin a été retiré — createDeck, addNotes
         et tout ce qui allait avec. Elle ne fait plus que recevoir.

         Ce que l'étudiant écrit dans Anki fait autorité : c'est son
         cours, pris par lui. L'application vient s'y adosser, pas
         l'inverse. Sa progression à elle reste la sienne : réviser
         ici ne déplace aucune carte dans Anki, et Anki reste seul
         maître de son planning.
         ============================================================ */

      /* Anki porte son arborescence dans le NOM du paquet, séparée par
         « :: ». On la reconstruit pour l'afficher telle que l'étudiant
         l'a rangée — Orthoptie › L1 › S1 › UE › cours — et pour qu'un
         clic sur une UE révise aussi tout ce qu'elle contient. */
      function arbreAnki(cartes) {
        var racine = { nom: '', enfants: {}, ordre: [], cartes: [] };
        cartes.forEach(function (c) {
          var n = racine;
          String(c.chemin || '').split('::').filter(Boolean).forEach(function (seg) {
            if (!n.enfants[seg]) { n.enfants[seg] = { nom: seg, enfants: {}, ordre: [], cartes: [] }; n.ordre.push(seg); }
            n = n.enfants[seg];
          });
          n.cartes.push(c);
        });
        return racine;
      }

      /* toutes les cartes d'un nœud, sous-paquets compris */
      function cartesDe(n) {
        var out = n.cartes.slice();
        n.ordre.forEach(function (k) { out = out.concat(cartesDe(n.enfants[k])); });
        return out;
      }

      function tabAnki() {
        var body = el('div');

        /* Carte visée depuis Ctrl+K : on déplie le paquet qui la contient,
           puis on l'amène sous les yeux. UI.bring attend que le nœud soit
           dans le document — l'onglet se rend en deux temps. */
        function viser() {
          if (!carteVisee) return;
          var n = document.getElementById('ak-' + carteVisee);
          if (!n) return;
          var pere = n.parentNode;
          if (pere && pere.hidden) {
            pere.hidden = false;
            var f = pere.previousSibling && pere.previousSibling.querySelector('.muted');
            if (f) f.textContent = '▾';
          }
          n.classList.add('flash');
          UI.bring(n);
          carteVisee = null;
        }

        /* Un seul écouteur pour toute la vie de la page : on vise le nœud
           par son identifiant plutôt que par une fermeture, sinon chaque
           passage sur l'onglet en empilerait un de plus. */
        if (!window.__ankiProgres && window.ortho && window.ortho.on) {
          window.__ankiProgres = true;
          window.ortho.on('anki:progres', function (pr) {
            var n = document.getElementById('anki-progres');
            if (n) n.textContent = pr.fait + ' / ' + pr.total + ' cartes lues…';
          });
        }

        /* Redessiner sans réinterroger : après un import, on sait déjà
           qu'Anki répond. */
        function redessiner() { UI.clear(body); body.appendChild(contenu()); }

        /* Sonder : c'est ce que fait « Réessayer ». Il interroge vraiment
           Anki — sans quoi le bouton ne ferait que masquer le message. */
        function sonder() {
          UI.clear(body);
          body.appendChild(el('div', { class: 'small muted', text: 'Recherche d’Anki sur cet ordinateur…' }));
          window.ortho.ankiEtat().then(function (e) {
            UI.clear(body);
            if (!e || !e.dispo) {
              body.appendChild(modeEmploi(e && e.erreur ? e.erreur : 'Anki injoignable.'));
              return;
            }
            /* Pas de bandeau « AnkiConnect répond » : la liste qui s'affiche
               le dit mieux. On ne parle d'Anki que lorsqu'il manque. */
            body.appendChild(contenu());
            viser();
          });
        }

        function modeEmploi(raison) {
          return UI.card('Anki n’a pas répondu', [
            UI.note('<b>' + raison + '</b>', 'warn'),
            el('p', { html:
              'La lecture passe par <b>AnkiConnect</b>, une extension d’Anki qui ouvre une petite ' +
              'porte locale sur votre collection. Elle ne s’installe qu’une fois :' }),
            el('ol', { class: 'small' }, [
              el('li', { html: 'Dans Anki : <b>Outils → Extensions → Télécharger des extensions…</b>' }),
              el('li', { html: 'Coller le code <b class="mono">2055492159</b>, valider.' }),
              el('li', { html: '<b>Redémarrer Anki</b>, et le laisser ouvert.' }),
              el('li', { html: 'Revenir ici et cliquer sur <b>Réessayer</b>.' })
            ]),
            UI.note('L’application n’appelle que quatre actions, toutes en lecture : ' +
              '<span class="mono">version</span>, <span class="mono">deckNames</span>, ' +
              '<span class="mono">findCards</span>, <span class="mono">cardsInfo</span>. ' +
              'Toute autre action est refusée par le processus principal avant d’atteindre Anki : ' +
              'aucun paquet ne peut être créé, modifié ni supprimé.'),
            el('div', { class: 'btn-row' }, [UI.btn('Réessayer', sonder, 'primary')])
          ]);
        }

        function importer() {
          var zone = document.getElementById('anki-progres');
          if (zone) zone.textContent = 'Lecture de la collection…';
          window.ortho.ankiCartes({ requete: 'deck:*' }).then(function (r) {
            if (!r || !r.ok) { UI.toast('Échec : ' + ((r && r.erreur) || 'inconnu')); redessiner(); return; }
            Store.anki(r.cartes);
            Cards.ankiCache = null;
            UI.toast(r.cartes.length + ' carte(s) récupérée(s).');
            redessiner();
          });
        }

        /* Une carte, telle qu'elle est dans Anki : question puis réponse,
           lisibles d'un coup. Pas de retournement — on consulte, on ne se
           teste pas ici. */
        /* Anki nomme ses paquets avec des soulignés — « UE04_Physiologie_visuelle ».
           C'est commode à taper, illisible à lire en colonne. On rend les espaces,
           et on détache le code du reste : l'œil accroche le code, la suite se lit
           comme une phrase. */
        function joliPaquet(nom) {
          var t = String(nom || '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
          var m = /^((?:UE|CM|TD|TP|S)\s?\d+)\s+(.+)$/i.exec(t);
          return m ? { code: m[1].replace(/\s+/g, ''), reste: m[2] } : { code: null, reste: t };
        }

        function carteVue(c) {
          return el('div', { class: 'ak-carte', id: 'ak-' + c.id }, [
            el('div', { class: 'ak-q selectable', text: c.f }),
            c.b ? el('div', { class: 'ak-r selectable', text: c.b }) : null
          ].filter(Boolean));
        }

        function noeud(n, prof) {
          var toutes = cartesDe(n);
          if (!toutes.length) return null;

          var corps = el('div', { class: 'ak-cartes',
            style: { marginLeft: (10 + prof * 16) + 'px' } });
          n.cartes.forEach(function (c) { corps.appendChild(carteVue(c)); });
          /* Filtré sur une UE, il n'y a qu'un cours ou deux : les replier
             obligerait à un clic pour rien. */
          corps.hidden = !ueVisee;

          var jp = joliPaquet(n.nom);
          var tete = el('div', {
            class: 'ak-noeud' + (n.cartes.length ? ' cliquable' : '') + (corps.hidden ? '' : ' ouvert'),
            style: { paddingLeft: (10 + prof * 16) + 'px' },
            onClick: n.cartes.length ? function () {
              corps.hidden = !corps.hidden;
              tete.classList.toggle('ouvert', !corps.hidden);
            } : null
          }, [
            el('span', { class: 'fl', text: n.cartes.length ? '▸' : '' }),
            el('span', { class: 'nom' }, [
              jp.code ? el('span', { class: 'code', text: jp.code }) : null,
              el('span', { text: (jp.code ? '  ' : '') + jp.reste })
            ].filter(Boolean)),
            el('span', { class: 'n', text: String(toutes.length) })
          ]);

          var lignes = [tete, corps];
          n.ordre.forEach(function (k) {
            var e = noeud(n.enfants[k], prof + 1);
            if (e) lignes.push(e);
          });
          return el('div', {}, lignes);
        }

        /* On saute les niveaux qui ne portent rien : « Orthoptie › L1 › S1 »,
           trois lignes annonçant chacune le même total, n'apprend rien. On
           descend tant qu'un niveau n'a qu'un enfant et aucune carte à lui,
           et on garde le chemin parcouru en fil d'Ariane. Dès qu'une deuxième
           UE existe, la descente s'arrête d'elle-même au bon endroit. */
        function racineUtile(arbre) {
          var chemin = [], n = arbre;
          while (n.ordre.length === 1 && !n.cartes.length) {
            n = n.enfants[n.ordre[0]];
            chemin.push(joliPaquet(n.nom));
          }
          /* le dernier niveau parcouru redevient le contenu, pas le fil */
          if (chemin.length) chemin.pop();
          return { noeud: n, chemin: chemin };
        }

        function contenu() {
          var vue = el('div');
          var toutes = Cards.anki();
          var cartes = ueVisee ? Cards.ankiDeUE(ueVisee) : toutes;
          var info = Store.ankiInfo();

          if (!toutes.length) {
            vue.appendChild(el('div', { class: 'ak-vide' },
              UI.empty('⚡', 'Aucune carte récupérée pour l’instant.<br>' +
                'Anki répond : cliquez ci-dessous pour lire votre collection.')));
            vue.appendChild(el('div', { class: 'btn-row' }, [
              UI.btn('Récupérer mes cartes', importer, 'primary'),
              el('span', { id: 'anki-progres', class: 'muted small' })
            ]));
            return vue;
          }

          /* Une seule ligne pour tout ce qui n'est pas une carte. */
          var paquets = new Set(cartes.map(function (c) { return c.chemin; })).size;
          var barre = el('div', { class: 'ak-bar' }, [
            el('span', {}, [
              el('span', { class: 'n', text: String(cartes.length) }),
              el('span', { text: cartes.length > 1 ? ' cartes' : ' carte' })
            ]),
            el('span', { class: 'sep', text: '·' }),
            el('span', { text: paquets + (paquets > 1 ? ' paquets' : ' paquet') }),
            info ? el('span', { class: 'sep', text: '·' }) : null,
            info ? el('span', { class: 'muted', text: 'lues le ' +
              new Date(info.at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) }) : null,
            el('span', { class: 'grow' }),
            el('span', { id: 'anki-progres', class: 'muted small' }),
            UI.btn('↻ Actualiser', importer, 'sm')
          ].filter(Boolean));
          vue.appendChild(barre);

          if (ueVisee) {
            vue.appendChild(el('div', { class: 'btn-row', style: { margin: '-8px 0 16px' } }, [
              UI.chip(cartes.length ? 'Filtré sur ' + ueVisee : 'Aucune carte pour ' + ueVisee,
                cartes.length ? 'green' : 'amber'),
              UI.btn('Voir tout', function () { ueVisee = null; redessiner(); }, 'sm')
            ]));
          }

          if (!cartes.length) {
            vue.appendChild(el('div', { class: 'ak-vide' }, UI.empty('🔍',
              'Aucune carte rangée sous ' + ueVisee + ' dans votre collection.')));
            return vue;
          }

          var r = racineUtile(arbreAnki(cartes));
          if (r.chemin.length) {
            vue.appendChild(el('div', { class: 'ak-fil',
              text: r.chemin.map(function (x) { return x.code ? x.code + ' ' + x.reste : x.reste; }).join('  ›  ') }));
          }

          var arbre = el('div', { class: 'ak-arbre' });
          if (r.noeud.nom) {
            var seul = noeud(r.noeud, 0);
            if (seul) arbre.appendChild(seul);
          } else {
            r.noeud.ordre.forEach(function (k) {
              var e = noeud(r.noeud.enfants[k], 0);
              if (e) arbre.appendChild(e);
            });
          }
          vue.appendChild(arbre);
          return vue;
        }

        if (!window.ortho || !window.ortho.ankiEtat) {
          body.appendChild(UI.card('Anki', UI.note(
            'La lecture d’Anki n’existe que dans l’application installée : une page ouverte au ' +
            'navigateur ne peut pas joindre un port local.', 'warn')));
          return body;
        }

        sonder();
        return body;
      }

      /* ============================================================ */
      /* L'onglet Anki d'abord : c'est le contenu de l'étudiant, et c'est
         ce qu'il vient chercher. Les deux autres ne s'affichent que s'il
         reste des fiches créées dans l'application — sinon ils montrent
         un écran vide, ce qui n'apprend rien à personne. */
      var onglets = [{ id: 'anki', label: '⚡ Mes cartes' }];
      if (Cards.custom().length) {
        onglets.push({ id: 'review', label: '🎴 Réviser mes fiches' });
        onglets.push({ id: 'mine', label: '✏️ Mes fiches' });
      }
      /* Une barre d'onglets qui n'en contient qu'un n'est pas une barre :
         c'est une ligne de plus à traverser avant le contenu. */
      var tabsNode = onglets.length > 1
        ? UI.tabs(onglets, function (id) {
            if (id === 'review') return tabReview();
            if (id === 'mine') return tabMine();
            return tabAnki();
          })
        : tabAnki();

      var mine = Cards.custom().length;

      return UI.page({
        crumb: 'Mon travail',
        title: 'Mes cartes Anki',
        subtitle: 'Rangées comme vous les avez rangées dans Anki. ' +
          '<b>La révision reste dans Anki</b>, qui la fait mieux : ici on relit une UE, ' +
          'et on retrouve une carte au <b>Ctrl+K</b>.' +
          (mine ? ' Plus <b>' + mine + ' fiche' + (mine > 1 ? 's' : '') + '</b> créée' + (mine > 1 ? 's' : '') + ' ici.' : '')
      }, [tabsNode]);
    }
  };
})();
