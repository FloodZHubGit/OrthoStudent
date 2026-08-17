/* ============================================================
   Fiches mémo — révision espacée, import, export Anki
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  var BASIC_NAMES = /^(basic|basique|b[aá]sico|basis|einfach|básico|基本|기본)$/i;

  function guessModelName(names) {
    var exact = names.filter(function (n) { return BASIC_NAMES.test(n.trim()); });
    if (exact.length) return exact[0];
    var loose = names.filter(function (n) { return /^basi/i.test(n.trim()); });
    return loose.length ? loose[0] : names[0];
  }

  function guessBackField(fields, frontIdx) {
    var re = /verso|back|answer|r[ée]ponse|arri[èe]re|dos|d[ée]finition/i;
    for (var i = 0; i < fields.length; i++) {
      if (i !== frontIdx && re.test(fields[i])) return fields[i];
    }
    return fields[frontIdx === 0 ? 1 : 0];
  }

  M.flashcards = {
    id: 'flashcards', title: 'Fiches mémo', icon: '🗂', group: 'Révision',
    desc: 'Répétition espacée, import de fiches (NotebookLM, cours…), export Anki',
    keywords: 'fiches flashcards revision memoire repetition espacee leitner import notebooklm anki export',
    render: function (ctx) {
      var st = { deck: null, queue: [], i: 0, flipped: false, session: { ok: 0, ko: 0 }, focused: false };

      // fiche ouverte directement depuis la recherche rapide (Ctrl+K)
      var wantedCard = (ctx && ctx.params && ctx.params.cardId) || null;

      /* ============================================================
         Onglet 1 — révision
         ============================================================ */
      function tabReview() {
        var body = el('div');

        function buildQueue() {
          var pool = Cards.all().filter(function (c) { return !st.deck || c.deck === st.deck; });
          var due = Store.dueCards(pool.map(function (c) { return c.id; }));
          var list = pool.filter(function (c) { return due.indexOf(c.id) >= 0; });
          if (!list.length) list = pool.slice();
          st.queue = list.sort(function (a, b) {
            return (Store.state.srs[a.id] || { box: 1 }).box - (Store.state.srs[b.id] || { box: 1 }).box;
          });
          st.i = 0; st.flipped = false; st.session = { ok: 0, ko: 0 }; st.focused = false;
        }

        /* file d'une seule fiche : révision ciblée, sans score de session */
        function focusCard(id) {
          var c = Cards.all().filter(function (x) { return x.id === id; })[0];
          if (!c) return false;
          st.queue = [c]; st.i = 0; st.flipped = false; st.session = { ok: 0, ko: 0 }; st.focused = true;
          return true;
        }

        function answer(q) {
          Store.reviewCard(st.queue[st.i].id, q);
          if (q === 2) st.session.ok++; else st.session.ko++;
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
            el('div', { class: 'flex' }, [
              UI.chip(c.deck, 'blue'),
              c.custom ? UI.chip('importée', 'violet') : null,
              c.hint ? UI.chip(c.hint.length > 42 ? c.hint.slice(0, 40) + '…' : c.hint) : null,
              UI.chip('Boîte ' + srs.box + '/5', srs.box >= 4 ? 'green' : srs.box >= 2 ? 'amber' : ''),
              el('span', { class: 'spacer' }),
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
            UI.btn('Changer de paquet', function () { st.queue = []; draw(); }),
            UI.btn('Passer', function () { st.i++; st.flipped = false; draw(); })
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

        function done() {
          var total = st.session.ok + st.session.ko;
          var pct = total ? Math.round((st.session.ok / total) * 100) : 0;
          // une fiche isolée ouverte depuis la recherche ne fait pas une session
          if (!st.focused) Store.recordScore('flashcards', pct, { n: total });
          return UI.card('Session terminée', [
            el('div', { class: 'grid g3' }, [
              UI.stat(st.session.ok, 'Sues', 'var(--green)'),
              UI.stat(st.session.ko, 'À revoir', 'var(--amber)'),
              UI.stat(pct + ' %', 'Taux')
            ]),
            UI.note('Les cartes ratées reviennent demain, les cartes sues sont reprogrammées de plus en plus loin (1, 2, 5, 10 puis 25 jours).'),
            el('div', { class: 'btn-row' }, [
              UI.btn('Nouvelle session', function () { buildQueue(); draw(); }, 'primary'),
              UI.btn('Changer de paquet', function () { st.queue = []; draw(); })
            ])
          ]);
        }

        function picker() {
          var d = Cards.decks();
          var all = Cards.all();
          var due = Store.dueCards(all.map(function (c) { return c.id; })).length;
          var boxes = [0, 0, 0, 0, 0, 0];
          all.forEach(function (c) { boxes[(Store.state.srs[c.id] || { box: 1 }).box]++; });

          return el('div', {}, [
            UI.card('Choisir un paquet', [
              el('div', { class: 'grid g3' },
                [{ k: null, n: all.length, label: 'Toutes les fiches', custom: false }]
                  .concat(Object.keys(d).map(function (k) { return { k: k, n: d[k].n, label: k, custom: d[k].custom, generated: d[k].generated }; }))
                  .map(function (o) {
                    var pool = all.filter(function (c) { return !o.k || c.deck === o.k; });
                    var dueN = Store.dueCards(pool.map(function (c) { return c.id; })).length;
                    return el('div', { class: 'tool-card', onClick: function () { st.deck = o.k; buildQueue(); draw(); } }, [
                      el('div', { class: 'flex', style: { marginBottom: '6px' } }, [
                        el('h4', { style: { margin: 0 }, text: o.label }),
                        el('span', { class: 'spacer' }),
                        o.custom ? UI.chip('importé', 'violet') : null,
                        o.generated ? UI.chip('chiffres clés', 'blue') : null,
                        dueN ? UI.chip(dueN + ' à revoir', 'amber') : null
                      ].filter(Boolean)),
                      el('p', { text: o.n + ' fiche' + (o.n > 1 ? 's' : '') })
                    ]);
                  }))
            ]),
            UI.card('Progression de la mémorisation', [
              el('div', { class: 'grid g3' }, [
                UI.stat(due, 'À réviser aujourd’hui', due ? 'var(--amber)' : 'var(--green)'),
                UI.stat(boxes[4] + boxes[5], 'Bien mémorisées', 'var(--green)'),
                UI.stat(all.length, 'Fiches au total')
              ]),
              UI.table(['Boîte', 'Fiches', 'Prochain rappel'], [1, 2, 3, 4, 5].map(function (b) {
                return ['Boîte ' + b, boxes[b], Store.boxIntervals[b] + ' jour' + (Store.boxIntervals[b] > 1 ? 's' : '')];
              })),
              UI.note('Système de Leitner : une carte sue monte d’une boîte, une carte oubliée retombe en boîte 1. ' +
                'Réviser 10 minutes par jour vaut mieux que deux heures la veille de l’examen.')
            ])
          ]);
        }

        if (wantedCard) { focusCard(wantedCard); wantedCard = null; }
        draw();
        return body;
      }

      /* ============================================================
         Onglet 2 — import
         ============================================================ */
      function tabImport() {
        var parsed = { cards: [], format: null };
        var preview = el('div');
        var deckInput = el('input', { type: 'text', class: 'inp', value: 'NotebookLM', placeholder: 'Nom du paquet' });
        var area = el('textarea', {
          class: 'inp selectable',
          rows: 12,
          placeholder: 'Collez ici vos fiches.\n\nExemples de formats reconnus :\n' +
            'Quelle est la longueur axiale d’un œil emmétrope ?\t24 mm\n' +
            'Loi de Hering :: égale innervation des synergistes\n' +
            'Q : Norme du PPC ?\nR : rupture ≤ 6–8 cm\n\n' +
            'Ou un bloc par fiche, séparé par une ligne vide.',
          style: 'font-family:var(--mono);font-size:12.5px;line-height:1.5;resize:vertical'
        });

        var formatSel = UI.select(
          [{ value: '', label: 'Détection automatique' }]
            .concat(Cards.csvFormats)
            .concat([{ value: 'qa', label: 'Q : … / R : …' },
                     { value: 'blocks', label: 'Blocs séparés par une ligne vide' },
                     { value: 'json', label: 'JSON' }])
            .concat(Cards.separators.map(function (s) { return { value: s.id, label: 'Séparateur : ' + s.label }; })),
          '', function () { refresh(); });

        function refresh() {
          parsed = Cards.parse(area.value, formatSel.value || null);
          UI.clear(preview);
          if (!area.value.trim()) {
            preview.appendChild(UI.empty('📋', 'Collez du texte ci-dessus pour voir l’aperçu.'));
            return;
          }
          if (!parsed.cards.length) {
            preview.appendChild(UI.note('Aucune fiche reconnue dans ce texte. Essayez de forcer un format dans le menu, ' +
              'ou mettez une fiche par ligne sous la forme <code>question :: réponse</code>.', 'warn'));
            return;
          }
          preview.appendChild(el('div', { class: 'flex wrap', style: { marginBottom: '10px' } }, [
            UI.chip(parsed.cards.length + ' fiche' + (parsed.cards.length > 1 ? 's' : '') + ' reconnue' + (parsed.cards.length > 1 ? 's' : ''), 'green'),
            UI.chip('Format : ' + Cards.formatLabel(parsed.format), 'blue'),
            parsed.dropped ? UI.chip(parsed.dropped + ' ligne(s) incomplète(s) écartée(s)', 'amber') : null
          ].filter(Boolean)));
          preview.appendChild(UI.table(['Question', 'Réponse'],
            parsed.cards.slice(0, 40).map(function (c) { return [c.f, c.b]; }), { scroll: '340px' }));
          if (parsed.cards.length > 40) {
            preview.appendChild(el('p', { class: 'small muted', text: '… et ' + (parsed.cards.length - 40) + ' autres.' }));
          }
        }

        area.addEventListener('input', refresh);

        /* ouverture directe d'un fichier exporté (.csv, .tsv, .txt, .json) */
        var filePicker = el('input', {
          type: 'file', accept: '.csv,.tsv,.txt,.json,.md', class: 'hidden'
        });
        filePicker.addEventListener('change', function () {
          var f = filePicker.files && filePicker.files[0];
          if (!f) return;
          var reader = new FileReader();
          reader.onload = function () {
            area.value = String(reader.result || '');
            if (/\.(csv|tsv)$/i.test(f.name) && !deckInput.value.trim()) deckInput.value = f.name.replace(/\.[^.]+$/, '');
            refresh();
            UI.toast('Fichier « ' + f.name + ' » chargé.');
          };
          reader.onerror = function () { UI.toast('Lecture du fichier impossible.'); };
          reader.readAsText(f, 'utf-8');
          filePicker.value = '';
        });

        /* glisser-déposer sur la zone de texte */
        area.addEventListener('dragover', function (e) { e.preventDefault(); area.style.borderColor = 'var(--accent)'; });
        area.addEventListener('dragleave', function () { area.style.borderColor = ''; });
        area.addEventListener('drop', function (e) {
          e.preventDefault();
          area.style.borderColor = '';
          var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
          if (!f) return;
          var reader = new FileReader();
          reader.onload = function () { area.value = String(reader.result || ''); refresh(); UI.toast('Fichier « ' + f.name + ' » chargé.'); };
          reader.readAsText(f, 'utf-8');
        });

        refresh();

        function doImport() {
          if (!parsed.cards.length) { UI.toast('Rien à importer.'); return; }
          var deck = (deckInput.value || 'Mes fiches').trim();
          var r = Cards.add(parsed.cards, deck, 'import');
          UI.clear(preview);
          preview.appendChild(UI.note('✔ <b>' + r.added + ' fiche(s)</b> ajoutée(s) au paquet « ' + deck + ' »' +
            (r.duplicates ? ' — ' + r.duplicates + ' doublon(s) ignoré(s).' : '.') +
            ' Elles entrent dans la révision espacée et partiront aussi vers Anki.'));
          area.value = '';
          App.refreshNav();
        }

        return el('div', {}, [
          UI.card('Récupérer des fiches depuis NotebookLM', [
            UI.note('<b>NotebookLM n’a pas d’API publique</b> et Google ne propose aucune connexion applicative pour ce produit : ' +
              'je ne peux pas — et ne dois pas — faire saisir vos identifiants Google dans cette application, ni piloter votre session ' +
              'à votre place. Le passage se fait donc par un copier-coller, qui prend dix secondes.', 'warn'),
            el('ol', { style: { color: 'var(--txt-2)', lineHeight: '1.8' }, html:
              '<li>Ouvrez votre notebook sur <b>notebooklm.google.com</b>.</li>' +
              '<li>Dans le panneau <b>Studio</b>, générez les <b>fiches (flashcards)</b> à partir de vos sources.</li>' +
              '<li><b>Exportez</b> les fiches (NotebookLM produit un fichier <b>CSV</b>) — ou copiez simplement la liste.</li>' +
              '<li>Ci-dessous : <b>Ouvrir un fichier…</b>, ou glissez le fichier sur la zone de texte, ou collez le contenu.</li>' +
              '<li>Vérifiez l’aperçu, puis importez.</li>' }),
            UI.note('Le CSV de NotebookLM est lu tel quel : virgules et guillemets à l’intérieur des réponses, guillemets doublés, ' +
              'et notation mathématique (<code>$Pitx2$</code>, <code>$90\\%$</code>) nettoyée automatiquement. ' +
              'La même chose fonctionne avec Quizlet, Gemini, ChatGPT ou un cours en texte.')
          ]),

          el('div', { class: 'split' }, [
            UI.card('Texte à importer', [
              area,
              el('div', { class: 'grid g2 mt16' }, [
                UI.field('Format', formatSel),
                UI.field('Paquet de destination', deckInput)
              ]),
              el('div', { class: 'btn-row' }, [
                UI.btn('📥 Importer les fiches', doImport, 'primary'),
                UI.btn('📄 Ouvrir un fichier…', function () { filePicker.click(); }),
                UI.btn('Vider', function () { area.value = ''; refresh(); })
              ]),
              filePicker
            ]),
            UI.card('Aperçu', preview)
          ]),

          UI.card('Formats reconnus', UI.table(['Format', 'Exemple'], [
            ['Tabulation', '<code>Longueur axiale ?⇥24 mm</code>'],
            ['Double deux-points', '<code>Loi de Hering :: égale innervation</code>'],
            ['Point-virgule, barre, flèche', '<code>PPC normal ; ≤ 6–8 cm</code>'],
            ['Tiret long', '<code>Spirale de Tillaux — 5,5 / 6,5 / 6,9 / 7,7 mm</code>'],
            ['Q / R', '<code>Q : Norme du AC/A ?</code><br><code>R : 3 à 5 Δ/D</code>'],
            ['Blocs', 'Une ligne de question, la réponse dessous, une ligne vide entre chaque fiche'],
            ['JSON', '<code>[{"front":"…","back":"…"}]</code>']
          ]))
        ]);
      }

      /* ============================================================
         Onglet 3 — arborescence (dossier local ou Google Drive)
         ============================================================ */
      function tabTree() {
        var found = [];          // fichiers récupérés
        var rootName = '';
        var listBox = el('div');
        var statusBox = el('div');
        var prefixInput = el('input', { type: 'text', class: 'inp', value: '', placeholder: 'Préfixe optionnel, ex. L1' });
        var useRoot = el('input', { type: 'checkbox', checked: true });
        var useFile = el('input', { type: 'checkbox', checked: true });

        function deckNameFor(f) {
          var segs = [];
          if (prefixInput.value.trim()) segs.push(prefixInput.value.trim());
          if (useRoot.checked && rootName) segs.push(rootName);
          segs = segs.concat(f.path);
          if (useFile.checked) segs.push(f.name);
          return segs.filter(Boolean).join('::') || 'Import';
        }

        function drawList() {
          UI.clear(listBox);
          if (!found.length) {
            listBox.appendChild(UI.empty('📂', 'Aucun fichier chargé pour l’instant.'));
            return;
          }
          var total = 0, rows = [];
          found.forEach(function (f) {
            var p = Cards.parse(f.content);
            f.parsed = p.cards;
            f.format = p.format;
            total += p.cards.length;
            rows.push([
              (f.path.length ? f.path.join(' › ') + ' › ' : '') + f.file,
              p.cards.length ? p.cards.length + ' fiches' : '—',
              p.cards.length ? Cards.formatLabel(p.format) : 'non reconnu',
              deckNameFor(f)
            ]);
          });
          listBox.appendChild(el('div', { class: 'flex wrap', style: { marginBottom: '10px' } }, [
            UI.chip(found.length + ' fichier(s)', 'blue'),
            UI.chip(total + ' fiche(s) au total', total ? 'green' : 'amber'),
            rootName ? UI.chip('Racine : ' + rootName) : null
          ].filter(Boolean)));
          listBox.appendChild(UI.table(['Fichier', 'Fiches', 'Format', 'Paquet créé'], rows, { scroll: '360px' }));
          listBox.appendChild(el('div', { class: 'btn-row mt16' }, [
            UI.btn('📥 Tout importer (' + total + ' fiches)', function () {
              var added = 0, dup = 0, decks = 0;
              found.forEach(function (f) {
                if (!f.parsed || !f.parsed.length) return;
                var r = Cards.add(f.parsed, deckNameFor(f), 'arborescence');
                added += r.added; dup += r.duplicates;
                if (r.added) decks++;
              });
              UI.clear(statusBox);
              statusBox.appendChild(UI.note('✔ <b>' + added + ' fiche(s)</b> importée(s) dans <b>' + decks + ' paquet(s)</b>' +
                (dup ? ' — ' + dup + ' doublon(s) ignoré(s).' : '.') +
                ' La hiérarchie est conservée : dans l’onglet Anki, choisissez « un sous-paquet par thème » pour la retrouver telle quelle.'));
              App.refreshNav();
            }, 'primary')
          ]));
        }

        [prefixInput].forEach(function (n) { n.addEventListener('input', drawList); });
        [useRoot, useFile].forEach(function (n) { n.addEventListener('change', drawList); });

        /* ---- source 1 : dossier local ---- */
        function pickLocal() {
          if (!window.ortho || !window.ortho.pickFolder) { UI.toast('Disponible uniquement dans l’application desktop.'); return; }
          UI.clear(statusBox);
          statusBox.appendChild(el('div', { class: 'small muted', text: 'Lecture du dossier…' }));
          window.ortho.pickFolder().then(function (r) {
            UI.clear(statusBox);
            if (!r.ok) return;
            found = r.files; rootName = r.rootName;
            if (!found.length) {
              statusBox.appendChild(UI.note('Aucun fichier importable trouvé dans « ' + r.rootName + ' ». ' +
                'L’application cherche des .csv, .tsv, .txt, .json et .md, jusqu’à 5 niveaux de sous-dossiers.', 'warn'));
            }
            drawList();
          }).catch(function (e) {
            UI.clear(statusBox);
            statusBox.appendChild(UI.note('Lecture impossible : ' + (e && e.message ? e.message : e), 'red'));
          });
        }

        /* ---- source 2 : Google Drive ---- */
        var driveBox = el('div');
        var cfg = Store.state.settings.gdrive || {};
        var clientId = el('input', { type: 'text', class: 'inp', value: cfg.clientId || '', placeholder: '…apps.googleusercontent.com' });
        var clientSecret = el('input', { type: 'password', class: 'inp', value: cfg.clientSecret || '', placeholder: 'GOCSPX-…' });
        var browsePath = [];

        function saveDriveCfg() {
          Store.state.settings.gdrive = { clientId: clientId.value.trim(), clientSecret: clientSecret.value.trim() };
          Store.save();
        }

        function driveStatus() {
          if (!window.ortho || !window.ortho.driveStatus) { return Promise.resolve({ connected: false }); }
          return window.ortho.driveStatus();
        }

        function drawDrive() {
          UI.clear(driveBox);
          driveStatus().catch(function () { return { connected: false }; }).then(function (s) {
            UI.clear(driveBox);
            if (!s.connected) {
              driveBox.appendChild(UI.note('Pour lire directement votre Drive, il faut un <b>identifiant OAuth</b> créé dans votre propre ' +
                'projet Google Cloud — Google n’en fournit pas de générique. C’est gratuit et ça se fait une fois. ' +
                'La connexion se fait ensuite <b>dans votre navigateur, sur la page de Google</b> : l’application ne voit jamais votre mot de passe.', 'warn'));
              driveBox.appendChild(UI.accordion([{
                title: 'Créer l’identifiant OAuth (5 minutes, une seule fois)',
                body: '<ol style="line-height:1.9">' +
                  '<li>Ouvrez <b>console.cloud.google.com</b> et créez un projet (n’importe quel nom).</li>' +
                  '<li><b>API et services → Bibliothèque</b> : cherchez <b>Google Drive API</b> et activez-la.</li>' +
                  '<li><b>API et services → Écran de consentement OAuth</b> : type <b>Externe</b>, renseignez le nom et votre e-mail, ' +
                  'puis ajoutez-vous comme <b>utilisateur test</b>.</li>' +
                  '<li><b>Identifiants → Créer des identifiants → ID client OAuth</b>, type <b>Application de bureau</b>.</li>' +
                  '<li>Copiez l’<b>ID client</b> et le <b>code secret</b> ci-dessous.</li></ol>' +
                  '<p>L’application demande la portée <code>drive.readonly</code> : lecture seule, elle ne peut rien modifier ni supprimer ' +
                  'dans votre Drive. Le jeton est stocké en clair dans le dossier de données de l’application et s’efface avec « Déconnecter ».</p>'
              }]));
              driveBox.appendChild(el('div', { class: 'grid g2' }, [
                UI.field('ID client OAuth', clientId),
                UI.field('Code secret du client', clientSecret)
              ]));
              driveBox.appendChild(el('div', { class: 'btn-row' }, [
                UI.btn('🔗 Se connecter à Google Drive', function () {
                  saveDriveCfg();
                  if (!clientId.value.trim()) { UI.toast('Renseignez d’abord l’ID client.'); return; }
                  UI.clear(statusBox);
                  statusBox.appendChild(el('div', { class: 'small muted', text: 'Votre navigateur s’ouvre sur la page de connexion Google…' }));
                  window.ortho.driveConnect({ clientId: clientId.value.trim(), clientSecret: clientSecret.value.trim() })
                    .then(function (r) {
                      UI.clear(statusBox);
                      if (!r.ok) { statusBox.appendChild(UI.note('Connexion échouée : ' + r.error, 'red')); return; }
                      statusBox.appendChild(UI.note('✔ Connecté' + (r.account ? ' avec <b>' + r.account + '</b>' : '') + '.'));
                      drawDrive();
                    })
                    .catch(function (e) {
                      UI.clear(statusBox);
                      statusBox.appendChild(UI.note('Connexion impossible : ' + (e && e.message ? e.message : e), 'red'));
                    });
                }, 'primary')
              ]));
              return;
            }

            driveBox.appendChild(el('div', { class: 'flex wrap', style: { marginBottom: '10px' } }, [
              UI.chip('Connecté' + (s.account ? ' — ' + s.account : ''), 'green'),
              UI.btn('Déconnecter', function () {
                window.ortho.driveDisconnect().then(function () { drawDrive(); UI.toast('Déconnecté de Google Drive.'); });
              }, 'sm danger')
            ]));

            var crumbs = el('div', { class: 'flex wrap', style: { marginBottom: '8px' } });
            var items = el('div');
            driveBox.appendChild(crumbs);
            driveBox.appendChild(items);

            function open(id, name) {
              if (id === 'root') browsePath = [];
              else browsePath.push({ id: id, name: name });
              list();
            }

            function list() {
              UI.clear(crumbs);
              crumbs.appendChild(el('span', { class: 'chip', text: '🏠 Mon Drive', onClick: function () { browsePath = []; list(); } }));
              browsePath.forEach(function (p, i) {
                crumbs.appendChild(el('span', { class: 'chip' + (i === browsePath.length - 1 ? ' on' : ''), text: p.name, onClick: function () {
                  browsePath = browsePath.slice(0, i + 1); list();
                } }));
              });
              var currentId = browsePath.length ? browsePath[browsePath.length - 1].id : 'root';
              UI.clear(items);
              items.appendChild(el('div', { class: 'small muted', text: 'Chargement…' }));
              window.ortho.driveChildren(currentId).then(function (r) {
                UI.clear(items);
                if (!r.ok) { items.appendChild(UI.note('Lecture impossible : ' + r.error, 'red')); return; }
                var folders = r.files.filter(function (f) { return f.mimeType === 'application/vnd.google-apps.folder'; });
                var files = r.files.filter(function (f) { return f.mimeType !== 'application/vnd.google-apps.folder'; });
                if (!folders.length && !files.length) items.appendChild(el('p', { class: 'muted', text: 'Dossier vide.' }));
                folders.forEach(function (f) {
                  items.appendChild(el('div', { class: 'mod-tile', onClick: function () { open(f.id, f.name); } }, [
                    el('div', { class: 'mi', text: '📁' }),
                    el('div', {}, [el('div', { class: 'mt', text: f.name }), el('div', { class: 'md', text: 'Dossier' })]),
                    el('span', { class: 'arrow', text: '›' })
                  ]));
                });
                files.slice(0, 40).forEach(function (f) {
                  items.appendChild(el('div', { class: 'mod-tile', style: { cursor: 'default' } }, [
                    el('div', { class: 'mi', text: '📄' }),
                    el('div', {}, [el('div', { class: 'mt', text: f.name }), el('div', { class: 'md', text: f.mimeType })])
                  ]));
                });
                if (browsePath.length) {
                  items.appendChild(el('div', { class: 'btn-row mt16' }, [
                    UI.btn('📥 Récupérer ce dossier et ses sous-dossiers', function () {
                      UI.clear(statusBox);
                      statusBox.appendChild(el('div', { class: 'small muted', text: 'Téléchargement depuis Google Drive…' }));
                      window.ortho.driveTree(currentId).then(function (t) {
                        UI.clear(statusBox);
                        if (!t.ok) { statusBox.appendChild(UI.note('Échec : ' + t.error, 'red')); return; }
                        found = t.files;
                        rootName = browsePath[browsePath.length - 1].name;
                        if (!found.length) statusBox.appendChild(UI.note('Aucun fichier importable dans ce dossier.', 'warn'));
                        drawList();
                      }).catch(function (e) {
                        UI.clear(statusBox);
                        statusBox.appendChild(UI.note('Téléchargement impossible : ' + (e && e.message ? e.message : e), 'red'));
                      });
                    }, 'primary')
                  ]));
                }
              }).catch(function (e) {
                UI.clear(items);
                items.appendChild(UI.note('Lecture impossible : ' + (e && e.message ? e.message : e), 'red'));
              });
            }

            list();
          });
        }

        drawDrive();
        drawList();

        return el('div', {}, [
          UI.card('Importer une arborescence de paquets', [
            el('p', { class: 'muted', html:
              'Vous rangez vos fiches en dossiers — <code>Orthoptie / L1 / UE2 — Optique / cristallin.csv</code> — et l’application ' +
              'recrée cette hiérarchie en paquets. Le chemin devient le nom du paquet, séparé par « :: », donc l’onglet Anki le ' +
              'transforme directement en <b>sous-paquets</b>.' }),
            el('div', { class: 'btn-row' }, [
              UI.btn('📂 Choisir un dossier sur cet ordinateur', pickLocal, 'primary')
            ]),
            UI.note('<b>Vous utilisez Google Drive ?</b> Si « Drive pour ordinateur » est installé, votre Drive <i>est</i> un dossier ' +
              'local : choisissez-le ici et vous avez le même résultat sans aucune configuration. La connexion Drive ci-dessous ' +
              'ne sert que si vous voulez lire le cloud directement, sans synchronisation.')
          ]),

          UI.card('Nommage des paquets', [
            el('div', { class: 'grid g3' }, [
              UI.field('Préfixe', prefixInput, 'Ajouté devant chaque paquet'),
              UI.field('Inclure le dossier racine', el('label', { class: 'flex' }, [useRoot, el('span', { class: 'small', text: 'ex. « Orthoptie:: »' })])),
              UI.field('Inclure le nom du fichier', el('label', { class: 'flex' }, [useFile, el('span', { class: 'small', text: 'ex. « ::cristallin »' })]))
            ])
          ]),

          UI.card('Fichiers trouvés', [statusBox, listBox]),

          UI.card('Connexion Google Drive (optionnelle)', driveBox)
        ]);
      }

      /* ============================================================
         Onglet 4 — mes fiches importées
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
            'Elles suivent la même révision espacée que les fiches livrées avec l’application et partent aussi vers Anki.'));
        }

        draw();
        return body;
      }

      /* ============================================================
         Onglet 4 — Anki
         ============================================================ */
      function ankiCard(c, deckName) {
        return {
          front: c.f, back: c.b,
          deck: deckName,
          tags: ['OrthoStudent', String(c.deck).replace(/\s+/g, '_').replace(/[^\wÀ-ÿ_-]/g, '')]
        };
      }

      /* Anki hiérarchise avec « :: » : « L1::UE2 Optique ».
         Chaque argument peut lui-même être un chemin — on découpe,
         on nettoie chaque niveau, puis on recompose. */
      function deckSegments(s) {
        return String(s || '').split('::')
          .map(function (x) { return x.replace(/\s+/g, ' ').trim(); })
          .filter(Boolean);
      }
      function deckPath() {
        var parts = [];
        for (var i = 0; i < arguments.length; i++) {
          parts = parts.concat(deckSegments(arguments[i]));
        }
        return parts.join('::') || 'OrthoStudent';
      }

      function tabAnki() {
        var cfg = Store.state.settings.anki || {};
        var status = el('div', { style: { minHeight: '20px' } });
        var diag = el('div');
        var mapping = el('div');
        var fieldsBox = el('div');
        var detected = null;
        var modelSel = null, frontSel = null, backSel = null;
        var scopeDeck = null;

        var deckList = el('datalist', { id: 'anki-deck-list' });
        var deckName = el('input', {
          type: 'text', class: 'inp', value: cfg.deck || 'OrthoStudent',
          list: 'anki-deck-list', placeholder: 'L1', style: 'max-width:260px'
        });
        var subInput = el('input', {
          type: 'text', class: 'inp', value: cfg.sub || '',
          placeholder: 'UE2 — Optique physiologique', style: 'max-width:260px'
        });
        var portInput = el('input', { type: 'number', class: 'inp', value: cfg.port || 8765, min: 1, max: 65535, style: 'max-width:120px' });
        var treeBox = el('div');

        var d = Cards.decks();
        var scopeSel = UI.select(
          [{ value: '', label: 'Toutes les fiches (' + Cards.all().length + ')' }]
            .concat(Object.keys(d).map(function (k) { return { value: k, label: k + ' (' + d[k].n + ')' }; })),
          '', function (v) { scopeDeck = v || null; drawTree(); }
        );

        var modeSel = UI.select([
          { value: 'bydeck', label: 'Un sous-paquet par thème OrthoStudent' },
          { value: 'sub', label: 'Un seul sous-paquet, que je nomme' },
          { value: 'single', label: 'Tout dans le paquet parent' }
        ], cfg.mode || 'bydeck', function () { drawTree(); saveCfg(); });

        deckName.addEventListener('input', function () { drawTree(); saveCfg(); });
        subInput.addEventListener('input', function () { drawTree(); saveCfg(); });

        function selectedCards() {
          return Cards.all().filter(function (c) { return !scopeDeck || c.deck === scopeDeck; });
        }

        /* Chemin Anki attribué à une fiche donnée */
        function deckFor(card) {
          var parent = deckName.value || 'OrthoStudent';
          if (modeSel.value === 'single') return deckPath(parent);
          if (modeSel.value === 'sub') return deckPath(parent, subInput.value);
          return deckPath(parent, card.deck);
        }

        /* Aperçu de l'arborescence qui sera créée dans Anki */
        function drawTree() {
          UI.clear(treeBox);
          subInput.parentNode && (subInput.parentNode.style.display = modeSel.value === 'sub' ? '' : 'none');
          var cards = selectedCards();
          var counts = {};
          cards.forEach(function (c) {
            var p = deckFor(c);
            counts[p] = (counts[p] || 0) + 1;
          });
          var names = Object.keys(counts).sort();
          treeBox.appendChild(el('div', { class: 'small muted', style: { marginBottom: '6px' },
            text: names.length + ' paquet(s) dans Anki pour ' + cards.length + ' fiche(s) :' }));
          var tree = el('div', { class: 'deck-tree' });
          names.forEach(function (n) {
            var parts = n.split('::');
            tree.appendChild(el('div', { class: 'deck-line' }, [
              el('span', { class: 'deck-indent', text: parts.length > 1 ? '└─' : '' }),
              el('span', { class: 'deck-parent', text: parts.slice(0, -1).join('::') + (parts.length > 1 ? '::' : '') }),
              el('span', { class: 'deck-leaf', text: parts[parts.length - 1] }),
              el('span', { class: 'deck-count', text: counts[n] })
            ]));
          });
          treeBox.appendChild(tree);
        }

        function buildAnkiText(cards, model) {
          var byDeck = modeSel.value !== 'single' || true;   // on écrit toujours la colonne paquet
          var head = [
            '#separator:tab', '#html:true',
            model ? '#notetype:' + model : null,
            '#tags column:3',
            '#deck column:4', ''
          ].filter(function (x) { return x !== null; }).join('\n');
          var rows = cards.map(function (c) {
            var n = ankiCard(c, deckFor(c));
            return [n.front, n.back, n.tags.join(' '), n.deck]
              .map(function (f) { return String(f).replace(/\t/g, ' ').replace(/\r?\n/g, '<br>'); })
              .join('\t');
          });
          return head + rows.join('\n') + '\n';
        }

        function saveCfg() {
          Store.state.settings.anki = {
            deck: deckName.value,
            sub: subInput.value,
            mode: modeSel.value,
            port: parseInt(portInput.value, 10) || 8765,
            model: modelSel ? modelSel.value : null,
            front: frontSel ? frontSel.value : null,
            back: backSel ? backSel.value : null
          };
          Store.save();
        }

        function drawFields(modelName) {
          UI.clear(fieldsBox);
          frontSel = null; backSel = null;
          fieldsBox.appendChild(el('div', { class: 'small muted', text: 'Lecture des champs de « ' + modelName + ' »…' }));
          window.ortho.ankiFields(modelName).then(function (r) {
            UI.clear(fieldsBox);
            if (!r.ok || !r.fields || r.fields.length < 2) {
              fieldsBox.appendChild(UI.note('Ce type de note n’a pas au moins deux champs' +
                (r.error ? ' (' + r.error + ')' : '') + '. Choisissez-en un autre, par exemple « Basique » ou « Basic ».', 'warn'));
              return;
            }
            var f = r.fields;
            var frontDefault = cfg.front && f.indexOf(cfg.front) >= 0 ? cfg.front : f[0];
            var backDefault = cfg.back && f.indexOf(cfg.back) >= 0 && cfg.back !== frontDefault
              ? cfg.back : guessBackField(f, f.indexOf(frontDefault));
            frontSel = UI.select(f, frontDefault, saveCfg);
            backSel = UI.select(f, backDefault, saveCfg);
            fieldsBox.appendChild(el('div', { class: 'grid g2' }, [
              UI.field('Champ « question »', frontSel),
              UI.field('Champ « réponse »', backSel)
            ]));
            saveCfg();
          }).catch(function (e) {
            UI.clear(fieldsBox);
            fieldsBox.appendChild(UI.note('Lecture des champs impossible : ' + (e && e.message ? e.message : e), 'red'));
          });
        }

        function drawMapping() {
          UI.clear(mapping);
          if (!detected) return;
          var names = detected.modelNames || [];
          if (!names.length) { mapping.appendChild(UI.note('Aucun type de note trouvé dans votre collection.', 'warn')); return; }
          var chosen = names.indexOf(cfg.model) >= 0 ? cfg.model : guessModelName(names);
          modelSel = UI.select(names, chosen, function () {
            cfg.model = modelSel.value; cfg.front = null; cfg.back = null;
            drawFields(modelSel.value);
          });
          mapping.appendChild(el('div', {}, [UI.field('Type de note Anki', modelSel), fieldsBox]));
          drawFields(chosen);
        }

        drawTree();

        function fail(msg, kind, r) {
          UI.clear(status);
          status.appendChild(UI.note(msg, kind || 'warn'));
          UI.clear(diag);
          if (r && (r.steps || r.error)) {
            diag.appendChild(UI.accordion([{
              title: 'Détail technique',
              body: '<pre class="mono small selectable" style="white-space:pre-wrap;margin:0">' +
                (r.steps && r.steps.length ? r.steps.join('\n') + '\n' : '') +
                (r.error ? '\nErreur AnkiConnect : ' + r.error : '') + '</pre>'
            }]));
          }
        }

        function detect(then) {
          if (!window.ortho || !window.ortho.ankiInspect) { UI.toast('Disponible uniquement dans l’application desktop.'); return; }
          UI.clear(status);
          status.appendChild(el('div', { class: 'small muted', text: 'Recherche d’Anki sur cet ordinateur…' }));
          window.ortho.ankiInspect({ port: parseInt(portInput.value, 10) || 8765 }).then(function (r) {
            if (!r.ok) {
              fail('<b>Anki n’a pas répondu sur 127.0.0.1:' + (r.port || 8765) + '.</b><br>' +
                'Vérifiez que : 1) Anki est <b>ouvert</b> et qu’un profil est chargé (pas l’écran de choix de profil), ' +
                '2) l’add-on <b>AnkiConnect</b> (code 2055492159) est installé et Anki redémarré, ' +
                '3) aucune fenêtre de dialogue n’est ouverte dans Anki.<br>' +
                'L’export de fichier fonctionne dans tous les cas.', 'warn', r);
              return;
            }
            detected = r;
            UI.clear(status);
            status.appendChild(UI.note('✔ Anki détecté — AnkiConnect v' + r.version + ' sur le port ' + r.port + ', ' +
              r.decks.length + ' paquet(s), ' + (r.modelNames || []).length + ' type(s) de note. ' +
              'Vérifiez la correspondance des champs ci-dessous avant d’envoyer.'));
            UI.clear(diag);
            // les paquets existants alimentent l'autocomplétion du champ parent
            UI.clear(deckList);
            (r.decks || []).forEach(function (name) {
              deckList.appendChild(el('option', { value: name }));
            });
            drawMapping();
            if (then) then();
          }).catch(function (e) { fail('Anki injoignable : ' + (e && e.message ? e.message : e), 'red'); });
        }

        function send() {
          if (!detected) { detect(send); return; }
          if (!modelSel || !frontSel || !backSel) { UI.toast('Choisissez d’abord le type de note.'); return; }
          if (frontSel.value === backSel.value) {
            fail('Le champ « question » et le champ « réponse » doivent être différents.', 'warn');
            return;
          }
          var cards = selectedCards();
          var notes = cards.map(function (c) { return ankiCard(c, deckFor(c)); });
          var targets = [];
          notes.forEach(function (n) { if (targets.indexOf(n.deck) < 0) targets.push(n.deck); });
          targets.sort();

          var listTxt = targets.slice(0, 12).map(function (t) {
            var n = notes.filter(function (x) { return x.deck === t; }).length;
            return '   • ' + t + '  (' + n + ')' + (detected.decks.indexOf(t) >= 0 ? '' : '  [nouveau]');
          }).join('\n') + (targets.length > 12 ? '\n   … et ' + (targets.length - 12) + ' autres' : '');

          if (!confirm('Envoyer ' + cards.length + ' fiche(s) dans Anki ?\n\n' +
            'Paquet(s) de destination :\n' + listTxt + '\n\n' +
            'Type de note : ' + modelSel.value + '\n' +
            'Champs : ' + frontSel.value + ' → ' + backSel.value + '\n\n' +
            'Les fiches déjà présentes seront ignorées.')) return;

          UI.clear(status);
          status.appendChild(el('div', { class: 'small muted', text: 'Envoi en cours…' }));
          window.ortho.ankiSend({
            deck: deckPath(deckName.value), model: modelSel.value,
            frontField: frontSel.value, backField: backSel.value,
            notes: notes
          }).then(function (r) {
            if (!r.ok) {
              var hint = '';
              if (/model was not found/i.test(r.error)) hint = '<br>→ Le type de note choisi n’existe pas : re-détectez Anki.';
              else if (/duplicate/i.test(r.error)) hint = '<br>→ Toutes les fiches sont déjà dans ce paquet.';
              else if (/collection is not available|profile/i.test(r.error)) hint = '<br>→ Anki est ouvert mais aucun profil n’est chargé.';
              fail('Échec de l’envoi : ' + r.error + hint, 'red', r);
              return;
            }
            UI.clear(status); UI.clear(diag);
            if (r.added === 0) {
              status.appendChild(UI.note('Aucune fiche ajoutée : les <b>' + r.skipped + '</b> fiches sont déjà présentes. ' +
                'Changez le nom du paquet parent pour en créer un second jeu.', 'warn'));
            } else {
              var detail = '';
              if (r.perDeck && Object.keys(r.perDeck).length > 1) {
                detail = '<br>' + Object.keys(r.perDeck).sort().map(function (k) {
                  return '&nbsp;&nbsp;• <b>' + k + '</b> : ' + r.perDeck[k].added + ' ajoutée(s)' +
                    (r.perDeck[k].skipped ? ', ' + r.perDeck[k].skipped + ' ignorée(s)' : '');
                }).join('<br>');
              }
              status.appendChild(UI.note('✔ <b>' + r.added + ' fiche(s) ajoutée(s)</b> dans ' +
                (r.decks && r.decks.length > 1 ? '<b>' + r.decks.length + ' sous-paquets</b>' : '« ' + r.deck + ' »') +
                (r.skipped ? ' — ' + r.skipped + ' déjà présente(s), ignorée(s).' : '.') + detail +
                '<br>Pensez à synchroniser Anki pour les retrouver sur votre téléphone.'));
            }
          }).catch(function (e) { fail('Envoi impossible : ' + (e && e.message ? e.message : e), 'red'); });
        }

        return el('div', {}, [
          UI.card('Organisation dans Anki', [
            el('div', { class: 'grid g3' }, [
              UI.field('Fiches à envoyer', scopeSel),
              UI.field('Paquet parent', el('div', {}, [deckName, deckList]), 'Ex. <b>L1</b>. Tapez pour choisir un paquet existant.'),
              UI.field('Organisation', modeSel)
            ]),
            el('div', { class: 'grid g3' }, [
              UI.field('Nom du sous-paquet', subInput, 'Utilisé par le mode « un seul sous-paquet »'),
              UI.field('Port AnkiConnect', portInput, 'Par défaut 8765')
            ]),
            treeBox,
            UI.note('Anki hiérarchise avec « <b>::</b> » : le paquet <b>L1::UE2 — Optique</b> apparaît comme un sous-paquet de <b>L1</b>, ' +
              'qui se crée automatiquement. Vous pouvez aussi taper directement <code>L1::UE2</code> dans le paquet parent pour descendre ' +
              'de plusieurs niveaux.')
          ]),
          UI.card('Envoyer les fiches dans Anki', [
            mapping,
            el('div', { class: 'btn-row' }, [
              UI.btn('🔌 Détecter Anki', function () { detect(); }),
              UI.btn('⚡ Envoyer dans Anki', send, 'primary'),
              UI.btn('💾 Exporter un fichier', function () {
                if (!window.ortho || !window.ortho.ankiExportFile) { UI.toast('Disponible uniquement dans l’application desktop.'); return; }
                var cards = selectedCards();
                window.ortho.ankiExportFile({
                  fileName: 'orthostudent-' + (scopeDeck ? scopeDeck.toLowerCase().replace(/\s+/g, '-') : 'toutes-les-fiches'),
                  content: buildAnkiText(cards, modelSel ? modelSel.value : null)
                }).then(function (r) {
                  if (!r.ok) return;
                  UI.clear(status); UI.clear(diag);
                  status.appendChild(UI.note('✔ <b>' + cards.length + ' fiches</b> exportées.<br>' +
                    'Dans Anki : <b>Fichier → Importer…</b>, sélectionnez le fichier. Le séparateur, le type de note, les tags ' +
                    'et le <b>paquet de destination de chaque fiche</b> sont indiqués dans l’en-tête : les sous-paquets sont ' +
                    'recréés à l’identique, il n’y a rien à régler.'));
                }).catch(function (e) { UI.toast('Export impossible : ' + (e && e.message ? e.message : e)); });
              })
            ]),
            status,
            diag,
            UI.note('<b>Envoi direct</b> : passe par AnkiConnect, un add-on gratuit qui ouvre une passerelle locale. ' +
              'Rien ne sort de votre ordinateur, aucun identifiant AnkiWeb n’est demandé. Anki doit être <b>ouvert</b>, ' +
              'avec un profil chargé et sans fenêtre de dialogue en cours.<br>' +
              '<b>Export de fichier</b> : ne demande aucune installation et marche partout, y compris AnkiDroid et AnkiMobile.<br><br>' +
              'Dans les deux cas, seul le <i>contenu</i> des fiches part vers Anki : votre progression OrthoStudent ' +
              '(les cinq boîtes) reste ici, et Anki repart avec son propre planning.')
          ])
        ]);
      }

      /* ============================================================ */
      var tabsNode = UI.tabs([
        { id: 'review', label: '🎴 Réviser' },
        { id: 'import', label: '📥 Coller / fichier' },
        { id: 'tree', label: '🗂 Arborescence' },
        { id: 'mine', label: '✏️ Mes fiches' },
        { id: 'anki', label: '⚡ Anki' }
      ], function (id) {
        if (id === 'review') return tabReview();
        if (id === 'import') return tabImport();
        if (id === 'tree') return tabTree();
        if (id === 'mine') return tabMine();
        return tabAnki();
      });

      var total = Cards.all().length;
      var mine = Cards.custom().length;

      return UI.page({
        crumb: 'Révision',
        title: 'Fiches mémo',
        subtitle: total + ' fiches en répétition espacée' +
          (mine ? ' dont <b>' + mine + ' importée' + (mine > 1 ? 's' : '') + '</b>' : '') +
          ' — importez vos propres fiches et envoyez le tout dans Anki.'
      }, [tabsNode]);
    }
  };
})();
