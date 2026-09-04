/* ============================================================
   Guide — prise en main, organisation de l'application,
   raccourcis, notation et limites
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  function goTo(id, params) { return function () { App.go(id, params); }; }

  /* ---------------- Catalogue des modules ----------------
     On n'écrit ici que le « quand l'ouvrir » : l'icône et le titre sont lus
     dans le module lui-même, le catalogue ne peut donc pas se désynchroniser
     de la barre latérale. L'ordre des familles suit celui de la barre. */

  var CATALOG = [
    ['Le point de départ', 'Votre programme : c’est là que se décide ce qu’il faut travailler.', [
      ['studies', 'Vos UE, semestre par semestre. Chaque fiche ouvre sur un parcours en six étapes qui enchaîne tous les outils sur son contenu.']
    ]],
    ['Mon travail', 'Ce qu’on ouvre chaque jour, et ce qui dit où l’on en est.', [
      ['home', 'La première page qu’on ouvre : les cours du jour, le plan de travail du jour, l’état du semestre.'],
      ['chat', 'Quand une notion résiste : on écrit la question, il répond avec le cours, son schéma et son piège — et dit d’où ça sort. Avec un modèle local installé, il peut aussi redire tout cela autrement.'],
      ['session', 'La même séance que sur l’accueil, avec le détail de la façon dont chaque étape est choisie.'],
      ['edt', 'Vos cours de la semaine, chacun relié à la fiche de l’UE qu’il traite.'],
      ['revise', 'Les quatre façons de travailler un contenu — fiches mémo, QCM, examen blanc, cours — réunies, avec ce que chacune apporte.'],
      ['progress', 'Une fois par semaine : ce qui monte, ce qui bloque, le réglage de l’objectif quotidien.']
    ]],
    ['Pratiquer', 'Le moment où l’on arrête de réviser pour faire de l’orthoptie.', [
      ['reading', 'Un bilan orthoptique rédigé comme au dossier : vous l’interprétez ligne à ligne, puis vous concluez.'],
      ['patient', 'Un bilan entier : anamnèse, examens à choisir, diagnostic, conduite à tenir.'],
      ['rehab', 'L’après-bilan : un programme de rééducation suivi séance après séance.']
    ]],
    ['Références', 'Ce qu’on ouvre pour une question précise, puis qu’on referme.', [
      ['converters', 'Onze calculatrices cliniques qui détaillent le raisonnement, pas seulement le résultat.'],
      ['anatomy', 'Réviser le globe, les muscles et l’innervation en cliquant sur les structures, puis se tester.'],
      ['glossary', 'Un terme, une norme, une abréviation : la réponse en trois secondes.'],
      ['help', 'Cette page. Gardez-la en tête pour les raccourcis.']
    ]]
  ];

  /* ---------------- Briques d'affichage ---------------- */

  function tile(id, when) {
    var mod = M[id];
    if (!mod) return null;
    var node = UI.modTile(mod.icon || '•', mod.title, when, goTo(id));
    /* Une entrée qui en héberge d'autres (« Réviser ») affiche ce qu'elle
       contient : regrouper ne doit pas rendre les modules introuvables. */
    if (!mod.children || !mod.children.length) return node;
    return el('div', {}, [node, el('div', { class: 'flex wrap', style: { gap: '6px', margin: '8px 0 4px 52px' } },
      mod.children.map(function (cid) {
        var c = M[cid];
        if (!c) return null;
        return el('span', { class: 'chip', text: (c.icon || '') + ' ' + c.title,
          title: c.desc || '', onClick: goTo(cid) });
      }).filter(Boolean))]);
  }

  function step(mark, title, body, action) {
    return el('div', { class: 'tool-card', onClick: action }, [
      el('span', { class: 'tc-ic', text: mark }),
      el('h4', { text: title }),
      el('p', { html: body })
    ]);
  }

  /* ============================================================
     0 · Ma routine — répondre à « je fais quoi, là, maintenant ? »
     ------------------------------------------------------------
     Le guide expliquait ce que l'application contient. Il ne disait
     nulle part comment elle s'insère dans une vraie semaine, entre
     un CM du mardi et un partiel dans trois semaines — et c'est
     précisément ce qui empêche de s'en servir.

     Cette page ne décrit donc rien : elle propose des gestes datés,
     calculés sur les données de l'étudiant (son prochain cours, ce
     qui est dû aujourd'hui, la date de ses partiels), chacun avec
     sa durée réelle et le bouton qui l'ouvre. Sans ces données, les
     mêmes gestes restent affichés — mais en générique, avec ce
     qu'il faut renseigner pour qu'ils deviennent personnels.
     ============================================================ */

  function semestreCourant() { return Store.state.profile.semester || null; }

  function itemsDus() {
    var sem = semestreCourant();
    if (!sem || !window.UEBank || !window.CURRICULUM) return 0;
    var s = window.CURRICULUM.filter(function (x) { return x.id === sem; })[0];
    if (!s) return 0;
    return s.ues.reduce(function (a, u) {
      var m = UEBank.memory(u.code);
      return a + (m.seen ? m.due : 0);
    }, 0);
  }

  function joursAvantPartiels() {
    var sem = semestreCourant();
    if (!sem || !M.studies || !M.studies.daysToExam) return null;
    try { return M.studies.daysToExam(sem); } catch (e) { return null; }
  }

  /* une carte « moment » : un titre, ce qu'on fait, combien ça coûte */
  function moment(o) {
    return el('div', { class: 'rout-card' }, [
      el('div', { class: 'rout-head' }, [
        el('span', { class: 'rout-ic', text: o.ic }),
        el('div', {}, [
          el('div', { class: 'rout-t', text: o.t }),
          el('div', { class: 'rout-when', text: o.quand })
        ]),
        el('span', { class: 'spacer' }),
        el('span', { class: 'rout-min', text: o.duree })
      ]),
      el('p', { class: 'rout-d', html: o.d }),
      o.btn ? el('div', { class: 'btn-row' }, o.btn) : null
    ].filter(Boolean));
  }

  function tabRoutine() {
    var sem = semestreCourant();
    var dus = itemsDus();
    var jours = joursAvantPartiels();
    var suivant = (M.edt && M.edt.next) ? M.edt.next() : null;

    /* --- 1 · combien de temps j'ai devant moi --- */
    var temps = [
      moment({
        ic: '⏱', t: 'Cinq minutes', quand: 'dans le bus, entre deux cours', duree: '5 min',
        d: dus
          ? 'Vous avez <b>' + dus + ' item' + (dus > 1 ? 's' : '') + ' à revoir</b> aujourd’hui, toutes UE mêlées. ' +
            'C’est le geste au meilleur rendement de toute l’application : la répétition espacée choisit ' +
            'pour vous ce qui allait s’effacer. Et si vous marchez, le <b>mode écoute</b> pose les questions ' +
            'à voix haute — l’écran devient inutile.'
          : 'La <b>révision du jour</b> : l’application choisit les items qui allaient s’effacer et vous interroge dessus. ' +
            'Aujourd’hui il n’y a rien de dû — c’est qu’aucune UE n’a encore été récitée, ou que tout est à jour.',
        btn: [UI.btn(dus ? '🎤 Réviser les ' + dus + ' items dus' : '🎤 Ouvrir une UE et réciter',
          goTo('studies', sem ? { sem: sem } : {}), 'primary'),
          UI.btn('🎧 Ou écouter', goTo('studies', sem ? { sem: sem } : {}))]
      }),
      moment({
        ic: '📖', t: 'Vingt minutes', quand: 'le soir, après les cours', duree: '20 min',
        d: 'Une UE, une seule : on lit <b>Le cours en condensé</b> — les schémas, l’image qui reste, ' +
           'l’erreur classique — puis on se fait interroger dessus. Lire sans se tester ne laisse rien ; ' +
           'se tester sans avoir lu décourage.',
        btn: [UI.btn('🎓 Choisir une UE', goTo('studies', sem ? { sem: sem } : {}), 'primary'),
              UI.btn('🗂 Ou réviser des fiches mémo', goTo('flashcards'))]
      }),
      moment({
        ic: '🩺', t: 'Une heure', quand: 'le week-end', duree: '1 h',
        d: 'Le moment où l’on arrête de réviser pour <b>faire de l’orthoptie</b> : un cas d’application, ' +
           'une lecture de bilan, une consultation complète. C’est là qu’on découvre ce qu’on croyait savoir.',
        btn: [UI.btn('🩺 Un cas d’application', goTo('studies', { sem: sem || 'S1' })),
              UI.btn('🩻 Une lecture de bilan', goTo('reading')),
              UI.btn('🧑‍⚕️ Une consultation', goTo('patient'))]
      })
    ];

    /* --- 2 · autour d'un cours --- */
    var autour;
    if (suivant && suivant.ue) {
      autour = [
        /* `jour` est un couple { nom, quand } : « mardi 3 septembre » et
           « dans 2 jours » — les deux servent, la seconde situe. */
        el('p', { class: 'mt0', html:
          'Votre prochain cours : <b>' + suivant.ue.code + ' — ' + suivant.titre + '</b>, ' +
          (suivant.jour ? suivant.jour.nom + ' (' + suivant.jour.quand + ')' : '') +
          '. Voici les trois moments qui le rendent utile.' }),
        el('div', { class: 'grid g3' }, [
          moment({ ic: '🌙', t: 'La veille', quand: 'avant d’y aller', duree: '4 min',
            d: 'Ouvrez la fiche et lisez <b>le sommaire du cours</b> et <b>L’essentiel</b>. On n’apprend rien en ' +
               'quatre minutes — mais on sait où chaque chose va se ranger, et la prise de notes change de nature.',
            btn: [UI.btn('📘 Ouvrir la fiche', suivant.ouvrir, 'primary')] }),
          moment({ ic: '✍️', t: 'Juste après', quand: 'le soir même', duree: '5 min',
            d: 'Écrivez deux lignes dans <b>Mes notes</b> : ce que le formateur a insisté, ce que vous n’avez pas ' +
               'compris. C’est la seule partie de la fiche que l’application n’écrit pas, et celle qui vaudra le ' +
               'plus en mai.',
            btn: [UI.btn('📝 Ouvrir la fiche', suivant.ouvrir)] }),
          moment({ ic: '🎤', t: 'Trois jours plus tard', quand: 'quand ça commence à s’effacer', duree: '10 min',
            d: 'Faites-vous interroger sur cette UE. L’oubli n’est pas un accident : il est prévu, et c’est ' +
               'exactement à ce moment-là que le rappel coûte le moins et rapporte le plus.',
            btn: [UI.btn('🎤 Se faire interroger', suivant.ouvrir)] })
        ])
      ];
    } else {
      autour = [
        UI.note('Chargez votre <b>emploi du temps</b> et déclarez votre semestre : cette page dira alors, ' +
          'devant chaque cours de votre semaine, quoi faire la veille, le soir même et trois jours après.'),
        el('div', { class: 'btn-row' }, [
          UI.btn('📅 Charger mon emploi du temps', goTo('edt'), 'primary'),
          UI.btn('🎓 Déclarer mon semestre', goTo('studies'))
        ])
      ];
    }

    /* --- 3 · le cycle d'une UE --- */
    var cycle = [
      ['1', 'Découvrir', 'Lire le cours en condensé : les schémas, l’image, l’exemple clinique.', '10 min', 'var(--accent)'],
      ['2', 'Mémoriser', 'Se faire interroger. Trois fois, espacées — pas trois fois le même jour.', '3 × 10 min', 'var(--blue)'],
      ['3', 'Se tester', 'Les QCM des thèmes de l’UE : on découvre ce qu’on croyait savoir.', '15 min', 'var(--violet)'],
      ['4', 'Appliquer', 'Les cas d’application : « que faites-vous ? », pas « récitez ».', '20 min', 'var(--amber)'],
      ['5', 'Composer', 'Un examen blanc limité aux thèmes de l’UE, chronométré.', '30 min', 'var(--green)']
    ];

    return el('div', {}, [
      UI.card('Je fais quoi, là, maintenant ?', [
        el('p', { class: 'mt0', html:
          'La bonne question n’est jamais « qu’est-ce que je dois réviser » mais <b>« combien de temps ai-je devant moi »</b>. ' +
          'Choisissez la durée, le reste est déjà décidé.' }),
        el('div', { class: 'grid g3' }, temps),
        jours !== null && jours >= 0
          ? UI.note('<b>Partiels dans ' + jours + ' jours.</b> À partir d’ici, c’est le <b>plan de révision</b> de votre ' +
              'semestre qui décide de l’ordre : il classe vos UE par ECTS et par ce qui vous manque, semaine par semaine.')
          : UI.note('Renseignez la <b>date de vos partiels</b> dans votre semestre : le plan de révision se découpe ' +
              'alors en semaines et vous dit quoi travailler, dans quel ordre.')
      ]),

      UI.card('Autour de vos cours', autour),

      UI.card('Le cycle d’une UE, du premier cours à l’épreuve', [
        el('p', { class: 'muted small mt0',
          text: 'Cinq étapes, toujours les mêmes, et dans cet ordre : chacune prépare la suivante. ' +
                'Une UE entière représente une heure et demie de travail réparti sur trois semaines — pas une soirée.' }),
        el('div', {}, cycle.map(function (c) {
          return el('div', { class: 'rout-step' }, [
            el('span', { class: 'n', style: { background: c[4] }, text: c[0] }),
            el('div', { style: { minWidth: 0 } }, [
              el('div', { class: 't', text: c[1] }),
              el('div', { class: 'd', text: c[2] })
            ]),
            el('span', { class: 'spacer' }),
            el('span', { class: 'rout-min', text: c[3] })
          ]);
        })),
        UI.note('Ce cycle est déjà écrit dans chaque fiche, sous le titre <b>Réviser cette UE</b> : ' +
          'il affiche votre avancement à chaque étape et se lance d’un bouton.'),
        el('div', { class: 'btn-row' }, [
          UI.btn('🎓 Ouvrir mes UE', goTo('studies', sem ? { sem: sem } : {}), 'primary')
        ])
      ]),

      UI.card('Trois pièges qui font abandonner', [
        el('div', { class: 'grid g3' }, [
          step('📚', 'Tout lire, ne rien retenir',
            'Relire donne le sentiment de savoir. Le seul signe fiable est de <b>produire</b> la réponse ' +
            'avant de la voir — c’est tout le principe de l’écran de récitation.'),
          step('🌊', 'Attendre le week-end',
            'Trois séances de dix minutes espacées valent bien mieux qu’une heure d’un coup. ' +
            'L’application est faite pour les petites sessions : c’est elle qui garde le fil.'),
          step('🎯', 'Vouloir tout maîtriser',
            'Une maîtrise à 100 % sur onze UE n’existe pas. Le plan de révision trie par ECTS et par écart : ' +
            'suivez-le plutôt que votre inquiétude.')
        ])
      ])
    ]);
  }

  /* ============================================================
     Créer un exécutable
     ------------------------------------------------------------
     « npm run dist:win » existe, mais suppose un terminal. Cet onglet
     fait la même chose d'un bouton, avec le journal en direct : c'est
     long (plusieurs minutes), et un écran qui ne dit rien pendant ce
     temps-là donne l'impression d'avoir planté.

     Il ne promet rien qu'il ne puisse tenir : hors du dépôt (dans
     l'application installée), electron-builder n'existe pas — la page
     l'explique au lieu d'échouer, et donne la marche à suivre.
     ============================================================ */

  function poids(o) {
    return o > 1048576 ? (o / 1048576).toFixed(0) + ' Mo'
         : o > 1024 ? (o / 1024).toFixed(0) + ' Ko' : o + ' o';
  }

  function tabBuild() {
    var box = el('div');
    var journal = el('pre', { class: 'build-log' });
    var lignes = 0;
    var enCours = false;

    /* Le journal peut cracher des milliers de lignes : on garde les
       dernières, sinon la page grossit sans fin et rame. */
    function log(l) {
      journal.appendChild(el('div', { text: l }));
      if (++lignes > 400) { journal.removeChild(journal.firstChild); lignes--; }
      journal.scrollTop = journal.scrollHeight;
    }
    if (window.ortho && ortho.on) ortho.on('build:log', log);

    function dessiner(etat) {
      UI.clear(box);

      if (!etat.possible) {
        box.appendChild(UI.card('Créer un exécutable', [
          UI.note(etat.empaquetee
            ? '<b>Vous utilisez déjà l’application installée.</b> Elle ne peut pas se reconstruire elle-même : ' +
              'la fabrication a besoin du code source et des outils de développement, qui ne sont pas embarqués ' +
              'dans un exécutable. Ouvrez le dépôt et lancez l’application avec <code>npm start</code> : ' +
              'le bouton apparaîtra ici.'
            : '<b>electron-builder est introuvable.</b> Lancez <code>npm install</code> à la racine du projet, ' +
              'puis relancez l’application.', 'warn'),
          el('p', { html: 'En ligne de commande, la même chose s’écrit :' }),
          el('pre', { class: 'build-log', style: { maxHeight: 'none' } },
            el('div', { text: 'npm install\nnpm run dist:win' }))
        ]));
        return;
      }

      box.appendChild(UI.card('Créer un exécutable', [
        el('p', { class: 'mt0', html:
          'Cette page fabrique un vrai exécutable de l’application, dans <code>' + etat.dossier + '</code>. ' +
          'Il contient tout — l’application, vos schémas, vos fiches — et fonctionne sur une machine où ' +
          'ni Node ni Electron ne sont installés.' }),
        el('div', { class: 'grid g2' }, etat.cibles.map(function (c) {
          return el('div', { class: 'rout-card' }, [
            el('div', { class: 'rout-head' }, [
              el('span', { class: 'rout-ic', text: c.id === 'portable' || c.id === 'AppImage' ? '🎒' : '💿' }),
              el('div', {}, [
                el('div', { class: 'rout-t', text: c.label }),
                el('div', { class: 'rout-when', text: c.ext })
              ])
            ]),
            el('p', { class: 'rout-d', text: c.quoi }),
            el('div', { class: 'btn-row' }, [
              UI.btn('Fabriquer', function () { lancer(c, etat); },
                c.id === 'portable' || c.id === 'AppImage' ? 'primary' : '')
            ])
          ]);
        })),
        UI.note('<b>Comptez quelques minutes.</b> La première fois, electron-builder télécharge Electron et ' +
          'ses outils d’empaquetage — une centaine de mégaoctets, mis en cache pour les fois suivantes. ' +
          'Le fichier produit pèse environ 70 Mo : c’est le prix d’une application qui embarque son propre navigateur.'),
        etat.plateforme === 'win32'
          ? el('p', { class: 'small muted', html:
              '<b>Une précision.</b> La fabrication se fait sans signature de code : l’exécutable garde donc ' +
              'l’icône par défaut d’Electron. C’est ce qui permet de le produire sans droits administrateur — ' +
              'signer et retoucher l’icône demanderait le mode développeur de Windows, et un certificat payant.' })
          : null,
        etat.dejaProduits && etat.dejaProduits.length
          ? el('div', {}, [
              el('div', { class: 'muted small mb8', text: 'Déjà dans le dossier de sortie' }),
              el('div', {}, etat.dejaProduits.map(function (f) { return ligneFichier(f); }))
            ])
          : null
      ].filter(Boolean)));

      box.appendChild(UI.card('Partager le fichier', [
        el('ul', { class: 'ue-notions' }, [
          el('li', { html: '<b>Sur votre Bureau</b> — le bouton « Mettre sur le Bureau » copie le fichier au bon endroit. ' +
            'Un exécutable portable se lance de n’importe où, y compris depuis une clé USB.' }),
          el('li', { html: '<b>À quelqu’un d’autre</b> — envoyez le fichier tel quel (clé, WeTransfer, Drive). ' +
            'Rien à installer, aucune dépendance.' }),
          el('li', { html: '<b>Au premier lancement, Windows affichera un avertissement</b> « Windows a protégé votre ordinateur » : ' +
            'l’application n’est pas signée par un certificat payant. On clique sur <i>Informations complémentaires</i> ' +
            'puis <i>Exécuter quand même</i>. Prévenez la personne — sinon elle n’ira pas plus loin.' }),
          el('li', { html: '<b>La progression ne voyage pas avec le fichier.</b> Chacun repart d’une application vierge ; ' +
            'pour transférer la vôtre, passez par <i>Fichier → Exporter ma progression</i>, puis <i>Importer</i> sur l’autre poste.' })
        ])
      ]));
    }

    function ligneFichier(f, neuf) {
      return el('div', { class: 'build-file' }, [
        el('span', { class: 'i', text: '📦' }),
        el('div', { style: { minWidth: 0 } }, [
          el('div', { class: 'n', text: f.nom }),
          el('div', { class: 'd', text: poids(f.octets) + (neuf ? ' · fabriqué à l’instant' : '') })
        ]),
        el('span', { class: 'spacer' }),
        UI.btn('🖥 Mettre sur le Bureau', function () {
          ortho.buildBureau(f.chemin).then(function (r) {
            UI.toast(r && r.ok ? 'Copié sur le Bureau.' : 'Copie impossible : ' + ((r && r.error) || ''));
          });
        }, 'sm'),
        UI.btn('Ouvrir le dossier', function () { ortho.buildOuvrir(f.chemin); }, 'sm')
      ]);
    }

    function lancer(cible, etat) {
      if (enCours) return;
      enCours = true;
      UI.clear(journal); lignes = 0;

      var titre = el('h2', { style: { margin: 0 }, text: 'Fabrication en cours — ' + cible.label });
      var etape = el('p', { class: 'muted small', text:
        'electron-builder travaille. L’empaquetage est long et silencieux : le journal peut ne rien afficher ' +
        'pendant deux ou trois minutes sans que rien ne soit bloqué. Vous pouvez continuer à utiliser ' +
        'l’application pendant ce temps.' });
      var boutonAnnuler = UI.btn('Annuler', function () { ortho.buildAnnuler(); }, 'danger');

      /* Un journal qui n'écrit rien pendant trois minutes ressemble à un
         plantage. Le chronomètre, lui, avance : c'est le seul signe de vie
         dont on dispose pendant l'empaquetage. */
      var chrono = el('span', { class: 'build-chrono mono', text: '0:00' });
      var t0 = Date.now();
      var tic = setInterval(function () {
        if (!chrono.isConnected) { clearInterval(tic); return; }
        var s = Math.round((Date.now() - t0) / 1000);
        chrono.textContent = Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
      }, 1000);

      UI.clear(box);
      box.appendChild(UI.card(null, [
        el('div', { class: 'flex wrap' }, [titre, chrono, el('span', { class: 'spacer' }), boutonAnnuler]),
        etape,
        el('div', { class: 'build-wait' }, el('i')),
        journal
      ]));

      ortho.buildLancer(cible.id).then(function (r) {
        enCours = false;
        clearInterval(tic);
        UI.clear(box);
        if (r && r.ok) {
          box.appendChild(UI.card('C’est prêt', [
            el('p', { class: 'mt0', html: 'Fabriqué en <b>' + r.secondes + ' secondes</b>. ' +
              (r.fichiers.length ? '' : 'Aucun fichier neuf détecté — regardez le journal ci-dessous.') }),
            el('div', {}, r.fichiers.map(function (f) { return ligneFichier(f, true); })),
            el('div', { class: 'btn-row' }, [
              UI.btn('↺ Fabriquer autre chose', function () { recharger(); }),
              UI.btn('Ouvrir le dossier', function () { ortho.buildOuvrir(null); }, 'sm')
            ])
          ]));
        } else if (r && r.annule) {
          box.appendChild(UI.card('Fabrication interrompue', [
            UI.note('Rien n’a été produit. Le dossier de sortie peut contenir des fichiers incomplets : ' +
              'la fabrication suivante les remplacera.'),
            el('div', { class: 'btn-row' }, [UI.btn('← Revenir', function () { recharger(); }, 'primary')])
          ]));
        } else {
          box.appendChild(UI.card('La fabrication a échoué', [
            UI.note('<b>' + ((r && r.error) || 'Erreur inconnue.') + '</b>', 'warn'),
            el('p', { class: 'small muted', html:
              'Les causes les plus fréquentes : pas de connexion au moment du premier téléchargement, ' +
              'ou un antivirus qui bloque l’écriture dans <code>dist/</code>. ' +
              'Le journal complet est ci-dessous.' }),
            el('div', { class: 'btn-row' }, [UI.btn('← Revenir', function () { recharger(); }, 'primary')])
          ]));
        }
        box.appendChild(UI.card('Journal', journal));
      });
    }

    function recharger() {
      if (!window.ortho || !ortho.buildEtat) {
        UI.clear(box);
        box.appendChild(UI.card('Créer un exécutable',
          UI.note('Cette page n’est disponible que dans l’application de bureau.', 'warn')));
        return;
      }
      ortho.buildEtat().then(dessiner);
    }
    recharger();

    return box;
  }

  /* ---------------- 1 · Démarrer ---------------- */

  function tabStart() {
    return el('div', {}, [

      UI.card('OrthoStudent en deux phrases', [
        el('p', { class: 'mt0', html:
          'Un <b>cabinet</b>, un <b>cours</b> et un <b>carnet de révision</b> dans la même fenêtre. ' +
          'Vous interprétez des bilans de patients tirés au sort comme au cabinet, vous relisez la théorie qui va avec, ' +
          'et l’application retient ce que vous savez faire pour vous dire quoi travailler ensuite.' }),
        el('div', { class: 'grid g4' }, [
          step('📚', 'Apprendre', 'Cours et fiches de synthèse, anatomie cliquable, glossaire, et une fiche par UE de votre programme.', goTo('theory')),
          step('🩻', 'Lire un bilan', 'Un bilan complet, tiré au sort et rédigé comme au dossier. Vous l’interprétez, vous êtes noté.', goTo('reading')),
          step('🩺', 'Se mettre en situation', 'Une consultation complète, du motif à la conduite à tenir. Puis la rééducation, séance après séance.', goTo('patient')),
          step('🗂', 'Réviser et se mesurer', 'Fiches en répétition espacée, QCM commentés, examen blanc chronométré, suivi de progression.', goTo('flashcards'))
        ])
      ]),

      UI.card('Vos dix premières minutes', [
        el('div', { class: 'timeline mb8' }, [
          el('span', { class: 'tl-step cur', text: '1 · Votre semestre' }),
          el('span', { class: 'tl-step', text: '2 · Votre emploi du temps' }),
          el('span', { class: 'tl-step', text: '3 · Un premier bilan' }),
          el('span', { class: 'tl-step', text: '4 · Une consultation' })
        ]),
        el('div', { class: 'grid g4' }, [
          step('1️⃣', 'Dites où vous en êtes',
            'Dans <b>Mes UE</b>, ouvrez votre semestre et cliquez « C’est mon semestre », puis renseignez la date de vos partiels. ' +
            'L’accueil, les priorités et le plan de révision se calent dessus.', goTo('studies')),
          step('2️⃣', 'Chargez votre emploi du temps',
            'Dans <b>Emploi du temps</b>, choisissez votre promotion : chaque cours de l’année est alors relié à la fiche ' +
            'de l’UE qu’il traite, révisable la veille.', goTo('edt')),
          step('3️⃣', 'Lisez un premier bilan',
            'Ouvrez <b>Lecture de bilan</b> : un patient est tiré au sort. Vous interprétez chaque ligne du dossier, ' +
            'vous concluez, et l’application vous note en expliquant l’écart.', goTo('reading')),
          step('4️⃣', 'Enchaînez une consultation',
            'Le <b>mode patient</b> déroule un bilan entier : c’est vous qui choisissez les examens, ' +
            'et chacun coûte s’il n’apporte rien.', goTo('patient'))
        ]),
        UI.note('Rien n’est verrouillé : aucun module n’attend qu’un autre soit terminé. ' +
          'Ces quatre étapes servent seulement à comprendre comment l’application fonctionne avant de vous y promener librement.')
      ]),

      UI.card('Puis installez une routine', [
        UI.table(['Quand', 'Quoi', 'Durée'], [
          ['<b>Chaque jour</b>', 'L’objectif du jour affiché sur l’accueil : quelques fiches mémo et quelques QCM', '10 à 15 min'],
          ['<b>Chaque semaine</b>', 'Une consultation en mode patient, une UE travaillée dans « Mes UE », un coup d’œil à la progression', '1 h'],
          ['<b>Avant les partiels</b>', 'Le plan de révision daté de votre semestre, puis un examen blanc chronométré', 'variable']
        ]),
        el('div', { class: 'btn-row mt16' }, [
          UI.btn('🎓  Ouvrir Mes UE', goTo('studies'), 'primary'),
          UI.btn('🗂  Réviser des fiches', goTo('flashcards')),
          UI.btn('🩺  Lancer une consultation', goTo('patient')),
          UI.btn('📈  Voir ma progression', goTo('progress'))
        ]),
        UI.note('<b>Perdu à un moment ?</b> <kbd>Ctrl</kbd>+<kbd>K</kbd> ouvre la recherche et retrouve n’importe quoi : ' +
          'un module, un chapitre de cours, un terme du glossaire, une UE, un cas, un QCM — et même un calcul.')
      ])
    ]);
  }

  /* ---------------- 2 · Se repérer ---------------- */

  function tabScreen() {
    return el('div', {}, [

      UI.card('L’écran, en deux zones', [
        el('p', { class: 'mt0', html:
          'À gauche, la <b>barre latérale</b> : en tête, <b>Mes UE</b> — votre programme, et le point de départ de ' +
          'toute révision, avec l’état du semestre en cours. En dessous, trois groupes courts : ce qu’on ouvre chaque ' +
          'jour, la pratique, les références. ' +
          'À droite, la <b>page en cours</b>. C’est tout — il n’y a ni menu caché ni sous-niveau à explorer.' }),
        UI.table(['Élément de la barre', 'À quoi il sert'], [
          ['<b>Filtrer les outils…</b>', 'Réduit la liste à mesure que vous tapez : « bilan », « calcul », « UE ». <kbd>↓</kbd> descend dans la liste, <kbd>Entrée</kbd> ouvre le premier résultat.'],
          ['<b>Mes UE</b>, en tête', 'Votre semestre, le nombre d’UE, les jours restants avant les partiels et votre préparation estimée. Tout part de là.'],
          ['<b>Trois groupes</b>', 'Mon travail (accueil, emploi du temps, réviser, progression), Pratiquer (lecture de bilan, mode patient, rééducation), Références. Les quatre outils de révision sont regroupés sous « Réviser », et la séance du jour est rendue sur l’accueil — rien n’est supprimé.'],
          ['<b>Pastille sur « Accueil »</b>', 'Les étapes qu’il vous reste dans la séance du jour. Elle disparaît quand la séance est finie.'],
          ['<b>Pastille sur « Réviser »</b>', 'Le nombre de fiches mémo à revoir aujourd’hui, plafonné à « 99+ ». Elle disparaît quand vous êtes à jour.'],
          ['<b>Pastille sur « Mode patient »</b>', 'Les cas du catalogue déjà traités, sur le total. Les patients générés aléatoirement, eux, sont sans fin.'],
          ['<b>Pastille sur « Emploi du temps »</b>', 'Les cours qu’il vous reste aujourd’hui — elle ne compte que ce qui n’a pas encore eu lieu.'],
          ['<b>← →</b> en bas', 'Historique de navigation, comme dans un navigateur (<kbd>Alt</kbd>+<kbd>←</kbd>, ou les boutons latéraux de la souris).'],
          ['<b>« 62 % · 148 QCM »</b>', 'Votre moyenne sur les exercices notés et le nombre de QCM déjà vus : un rappel permanent de là où vous en êtes.'],
          ['<b>◐</b>', 'Bascule le thème clair / sombre (<kbd>Ctrl</kbd>+<kbd>D</kbd>).']
        ])
      ]),

      UI.card('La recherche rapide — le seul raccourci vraiment indispensable', [
        el('p', { class: 'mt0', html:
          '<kbd>Ctrl</kbd>+<kbd>K</kbd> ouvre un champ unique qui cherche <b>dans tout le contenu</b> : modules, chapitres de cours, ' +
          'termes du glossaire, UE du référentiel, cas cliniques, questions de QCM et fiches mémo. ' +
          '<kbd>↑</kbd> <kbd>↓</kbd> choisissent, <kbd>Entrée</kbd> ouvre, <kbd>Échap</kbd> referme. ' +
          'Ouvert à vide, il propose vos derniers modules consultés.' }),
        UI.note('<b>Calcul instantané.</b> Tapez directement une valeur dans la recherche : le résultat s’affiche en tête de liste ' +
          'sans même ouvrir la calculatrice — <kbd>5/10</kbd>, <kbd>logmar 0,3</kbd>, <kbd>12 delta</kbd>, <kbd>45 ans</kbd>, ' +
          '<kbd>33 cm</kbd>, <kbd>prentice 4 3</kbd>, <kbd>-2,50 -1,00 90</kbd>. ' +
          '<kbd>Entrée</kbd> ouvre alors la calculatrice avec le raisonnement complet.'),
        el('div', { class: 'btn-row' }, [UI.btn('🔎  Essayer la recherche', function () { App.openSearch(); }, 'primary')])
      ]),

      UI.card('Prescrire un examen, c’est l’interpréter', [
        el('p', { class: 'mt0', html:
          'En <b>mode patient</b>, en <b>lecture de bilan</b> et à l’<b>examen blanc</b>, un examen n’est pas raconté : son ' +
          '<b>compte rendu</b> s’affiche, rédigé comme au dossier et calculé sur ce patient-là. Reste le plus difficile — le lire. ' +
          'Chaque examen ouvre alors ses questions d’interprétation, dérivées des valeurs du dossier : c’est ce que vous ' +
          'répondez là qui est noté, pas le fait d’avoir cliqué.' }),
        UI.note('<b>Un compte rendu lu sans interprétation validée vaut 0.</b> C’est la validation qui produit la note — ' +
          'et la solution affichée avant de répondre annule la tentative.', 'warn')
      ]),

      UI.card('Où vont vos données', [
        el('p', { class: 'mt0', html:
          'Tout est enregistré <b>sur cet ordinateur</b>, automatiquement : aucun compte, aucune inscription, aucun envoi ' +
          'sur un serveur. Rien ne se perd si vous fermez la fenêtre en plein exercice.' }),
        UI.table(['Menu', 'Effet'], [
          ['<b>Fichier → Exporter ma progression</b>', 'Écrit un fichier contenant toute votre progression (<kbd>Ctrl</kbd>+<kbd>E</kbd>). À faire avant de changer d’ordinateur.'],
          ['<b>Fichier → Importer une progression</b>', 'Relit ce fichier et remplace la progression locale (<kbd>Ctrl</kbd>+<kbd>I</kbd>).'],
          ['<b>Fichier → Réinitialiser</b>', 'Efface scores, fiches, historique et réglages. Sans retour possible.']
        ]),
        el('div', { class: 'btn-row mt16' }, [
          UI.btn('⬇  Exporter maintenant', function () { App.exportData(); }),
          UI.btn('⬆  Importer un fichier', function () { App.importData(); })
        ])
      ])
    ]);
  }

  /* ---------------- 3 · Les modules ---------------- */

  function tabModules() {
    var blocks = [
      UI.note('Beaucoup de modules, une seule question utile : <b>à quel moment</b> ouvrir lequel. ' +
        'Cliquez une ligne pour y aller directement.')
    ];
    CATALOG.forEach(function (fam) {
      var tiles = fam[2].map(function (r) { return tile(r[0], r[1]); }).filter(Boolean);
      if (!tiles.length) return;
      blocks.push(UI.card(fam[0], [
        el('p', { class: 'muted small mt0', text: fam[1] }),
        el('div', { class: 'grid g2' }, tiles)
      ], { right: UI.chip(tiles.length + (tiles.length > 1 ? ' modules' : ' module')) }));
    });
    return el('div', {}, blocks);
  }

  /* ---------------- 4 · Raccourcis et gestes ---------------- */

  function tabKeys() {
    return el('div', {}, [

      UI.card('Partout dans l’application', UI.table(['Raccourci', 'Action'], [
        ['<kbd>Ctrl</kbd>+<kbd>K</kbd>', 'Recherche rapide : modules, cours, glossaire, UE, cas, QCM, fiches — et calculs'],
        ['<kbd>Ctrl</kbd>+<kbd>J</kbd>', 'Le répétiteur : poser une question en français, depuis n’importe quel écran'],
        ['<kbd>Alt</kbd>+<kbd>←</kbd> / <kbd>→</kbd>', 'Écran précédent, écran suivant (les boutons latéraux de la souris font la même chose)'],
        ['<kbd>Ctrl</kbd>+<kbd>1</kbd> à <kbd>5</kbd>', 'Accueil, lecture de bilan, mode patient, mes UE, calculatrices'],
        ['<kbd>Ctrl</kbd>+<kbd>D</kbd>', 'Thème clair / sombre'],
        ['<kbd>Ctrl</kbd>+<kbd>E</kbd> / <kbd>Ctrl</kbd>+<kbd>I</kbd>', 'Exporter / importer la progression'],
        ['<kbd>Ctrl</kbd>+<kbd>+</kbd> / <kbd>−</kbd>', 'Agrandir ou réduire toute l’interface'],
        ['<kbd>Ctrl</kbd>+<kbd>P</kbd>', 'Imprimer la page affichée : fiche d’UE, plan de révision, compte rendu de consultation (mise en page dédiée)'],
        ['<kbd>Échap</kbd>', 'Ferme la recherche, ou la fenêtre ouverte en surimpression']
      ])),

      UI.card('Dans les exercices', [
        UI.table(['Où', 'Raccourci', 'Action'], [
          ['Fiches mémo', '<kbd>Espace</kbd> puis <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>', 'Retourner la fiche, puis oublié / difficile / su. <kbd>→</kbd> passe sans répondre'],
          ['QCM', '<kbd>A</kbd> à <kbd>D</kbd> (ou <kbd>1</kbd> à <kbd>4</kbd>)', 'Répondre. <kbd>Entrée</kbd> valide et enchaîne, <kbd>←</kbd> revient en arrière'],
          ['Examen blanc', '<kbd>A</kbd> à <kbd>D</kbd>, <kbd>←</kbd> <kbd>→</kbd>', 'Répondre, poste précédent, poste suivant'],
          ['Récitation d’une UE', '<kbd>Entrée</kbd> puis <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>', 'Vérifier sa réponse, puis oublié / presque / su. <kbd>Entrée</kbd> valide la note proposée, <kbd>Échap</kbd> quitte'],
          ['Écoute sans écran', '<kbd>Espace</kbd>, <kbd>→</kbd> <kbd>←</kbd>, <kbd>N</kbd>', 'Lecture / pause, item suivant / précédent, « je ne savais pas ». <kbd>Échap</kbd> quitte'],
          ['Répétiteur', '<kbd>Entrée</kbd>', 'Poser la question. Les pastilles proposées s’activent aussi au clavier'],
          ['Glossaire', '<kbd>R</kbd>', 'Afficher un terme au hasard']
        ]),
        UI.note('<b>Tout se pilote au clavier.</b> <kbd>Tab</kbd> parcourt les éléments actifs, <kbd>Entrée</kbd> ou <kbd>Espace</kbd> ' +
          'les active. Dans la barre latérale, <kbd>↑</kbd> <kbd>↓</kbd> passent d’un module à l’autre.')
      ]),

      UI.card('Les habitudes qui paient', el('ul', {
        html: '<li><b>Lecture de bilan</b> : lisez le dossier en entier avant de répondre à la première question. ' +
          'Les items s’enchaînent dans l’ordre d’un vrai compte rendu, et le dernier dépend souvent des précédents.</li>' +
          '<li><b>Mode patient</b> : prescrire un examen inutile coûte des points, en oublier un utile aussi. ' +
          'Choisissez à partir de l’anamnèse, pas en déroulant la liste.</li>' +
          '<li><b>Examen blanc</b> : ne revenez pas sur un poste tant que vous n’avez pas atteint le dernier — ' +
          'le chronomètre est unique, et c’est la gestion du temps qui se travaille ici.</li>' +
          '<li><b>Rééducation</b> : une séance = une semaine. Composez le programme, dosez le travail à domicile — ' +
          'ni zéro ni dix séances par semaine — et refaites un contrôle régulièrement : ' +
          'les valeurs affichées suivent l’état <b>courant</b> du patient.</li>' +
          '<li><b>Fiches mémo</b> : répondez avant de retourner la carte, même en doutant. ' +
          'Une réponse tentée puis corrigée se retient ; une réponse lue ne se retient pas.</li>'
      }))
    ]);
  }

  /* ---------------- 5 · Notation et limites ---------------- */

  function tabLimits() {
    return el('div', {}, [

      UI.card('Le répétiteur, et l’IA locale', [
        el('p', { class: 'mt0', html:
          'Le <b>répétiteur</b> ne rédige rien : il retrouve, dans les fiches de l’application, le passage qui ' +
          'répond à votre question, et vous dit d’où il vient. Il ne peut donc pas se tromper au-delà de ce que ' +
          'contiennent les fiches — et quand il n’a pas, il le dit.' }),
        el('p', { html:
          'Si <b>Ollama</b> tourne sur votre machine, un bouton apparaît sous chaque réponse : ' +
          '<b>✨ Développer avec l’IA</b>. Le modèle reçoit alors les <b>mêmes extraits</b> et n’a qu’une ' +
          'tâche — les redire autrement, plus longuement, pour la question que vous avez posée. ' +
          'Rien ne sort de l’ordinateur.' }),
        UI.table(['Le cadre est…', 'Ce que ça veut dire'], [
          ['<b>violet</b>', 'Le modèle a développé des extraits de vos fiches. Les faits viennent du contenu vérifié ; c’est la formulation qui est de lui.'],
          ['<b>ambre</b>', 'Aucune fiche ne couvrait la question. Le modèle a répondu seul : <b>rien n’est vérifié</b>, à recouper avant d’en faire une révision.']
        ]),
        UI.note('<b>Un petit modèle invente, et il le fait bien.</b> Interrogé sans extraits sur la transparence ' +
          'de la cornée, qwen3.5:4b a répondu « cellules kératinocytaires » et « trois plans perpendiculaires » : ' +
          'deux inventions dites avec aplomb. Nourri des extraits du cours, le même modèle répond juste. ' +
          'C’est pourquoi la réponse du répétiteur s’affiche <b>toujours en premier</b>, et celle du modèle ' +
          'dans un cadre à part.', 'warn'),
        el('p', { class: 'muted small', html:
          'La case <b>Réflexion</b> laisse le modèle raisonner avant de répondre. Mesuré sur qwen3.5:4b : ' +
          '<b>45 s au lieu de 15 s</b>, la réflexion en anglais, et le budget épuisé avant la première phrase de ' +
          'réponse. Pour une reformulation dont les faits sont déjà fournis, elle n’apporte rien — elle est à ' +
          'l’arrêt par défaut.' })
      ]),

      UI.card('Comment vous êtes noté', [
        UI.table(['Ce que vous faites', 'Ce qui est retenu'], [
          ['<b>Une lecture de bilan</b>', 'Une note sur 100 : la part d’items du compte rendu correctement interprétés. Moyenne et meilleur score conservés.'],
          ['<b>Un QCM</b>', 'Vu / juste / faux pour chaque question, agrégé par thème : c’est ce qui fait apparaître vos points faibles.'],
          ['<b>Une fiche mémo</b>', 'Une répétition espacée à cinq boîtes : mieux vous savez une fiche, plus tard elle revient.'],
          ['<b>Une consultation</b>', 'Une note de bilan : examens pertinents, diagnostic, conduite à tenir. La moyenne de vos interprétations ajoute jusqu’à 5 points.'],
          ['<b>Une UE de votre semestre</b>', 'Un pourcentage de maîtrise, alimenté par vos QCM, vos récitations et vos scores. C’est lui qui pilote le plan de révision.']
        ]),
        UI.note('<b>Un exercice ne compte que si vous validez.</b> En mode patient comme à l’examen blanc, ' +
          'un compte rendu lu puis quitté sans interprétation validée vaut 0 : c’est la validation qui produit la note, ' +
          'et afficher la solution avant de répondre annule la tentative.'),
        el('div', { class: 'btn-row' }, [UI.btn('📈  Voir tous mes scores', goTo('progress'))])
      ]),

      UI.card('Ce que l’application n’est pas', UI.note(
        '<b>OrthoStudent est un outil d’entraînement, pas un dispositif médical.</b><br><br>' +
        'Les patients sont fictifs et leurs dossiers reposent sur des modèles simplifiés, destinés à faire comprendre ' +
        'des mécanismes : les valeurs d’un compte rendu généré sont cohérentes entre elles, pas tirées d’un cas réel. ' +
        'Les normes citées suivent les références usuelles de l’enseignement français, ' +
        'mais elles ne remplacent ni vos cours, ni les protocoles de votre lieu de stage, ni le jugement clinique.<br><br>' +
        'Aucun exercice de cette application ne doit servir à évaluer une vraie personne, ' +
        'et aucune conclusion tirée ici ne vaut pour un patient réel.', 'warn'))
    ]);
  }

  /* ---------------- Module ---------------- */

  var TABS = [
    { id: 'routine', label: '🎯 Ma routine', render: tabRoutine },
    { id: 'start', label: '🚀 Démarrer', render: tabStart },
    { id: 'screen', label: '🧭 Se repérer', render: tabScreen },
    { id: 'modules', label: '🧩 Les modules', render: tabModules },
    { id: 'keys', label: '⌨️ Raccourcis', render: tabKeys },
    { id: 'build', label: '📦 Créer un exécutable', render: tabBuild },
    { id: 'limits', label: '⚖️ Notation & limites', render: tabLimits }
  ];

  M.help = {
    id: 'help', title: 'Guide', icon: '❔', group: 'Références',
    desc: 'Comment s’en servir dans une vraie semaine : 5 minutes dans le bus, un cours à préparer, des partiels',
    keywords: 'aide guide raccourci demarrage manuel prise en main debuter commencer perdu sommaire tutoriel avertissement ' +
      'routine methode organisation planning quoi faire comment reviser habitude quotidien me projeter',
    render: function (ctx) {
      var wanted = (ctx && ctx.params && ctx.params.tab) || 'routine';
      var start = TABS.filter(function (t) { return t.id === wanted; }).length ? wanted : 'routine';

      return UI.page({
        crumb: 'Références',
        title: 'Guide de l’application',
        subtitle: 'Comment cette application s’insère dans une vraie semaine — cinq minutes dans le bus, ' +
          'un cours à préparer, des partiels dans trois semaines.'
      }, [
        UI.tabs(TABS.map(function (t) { return { id: t.id, label: t.label }; }), function (id) {
          var t = TABS.filter(function (x) { return x.id === id; })[0];
          return t ? t.render() : null;
        }, start)
      ]);
    }
  };

})();
