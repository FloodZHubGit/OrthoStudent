/* ============================================================
   Aide, guide de démarrage et avertissement
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  M.help = {
    id: 'help', title: 'Guide & raccourcis', icon: '❔', group: 'Général',
    desc: 'Comment utiliser l’application, raccourcis clavier, avertissement',
    keywords: 'aide guide raccourci demarrage manuel',
    render: function () {
      return UI.page({
        crumb: 'Général',
        title: 'Guide de démarrage',
        subtitle: 'Trois minutes pour prendre en main l’application.'
      }, [
        UI.card('Réussir ses études, concrètement', [
          UI.note('<b>Commencez par indiquer votre semestre et la date de vos partiels</b> dans « Programme des études ». ' +
            'L’application connaît vos UE : elle estime votre maîtrise de chacune à partir de vos QCM et de vos scores, ' +
            'puis construit un plan de révision semaine par semaine, en attaquant d’abord ce qui pèse lourd en ECTS et que ' +
            'vous maîtrisez mal. Chaque UE a sa fiche : objectifs, noyau dur, pièges classiques, ce qui tombe, méthode de travail.'),
          el('div', { class: 'btn-row' }, [
            UI.btn('🎓 Ouvrir le programme des études', function () { App.go('studies'); }, 'primary'),
            UI.btn('📈 Voir ma progression', function () { App.go('progress'); })
          ])
        ]),

        UI.card('Par où commencer ?', [
          el('div', { class: 'grid g3' }, [
            el('div', { class: 'tool-card', onClick: function () { App.go('acuity'); } }, [
              el('span', { class: 'tc-ic', text: '1️⃣' }),
              el('h4', { text: 'Calibrez votre écran' }),
              el('p', { text: 'Échelles d’acuité → onglet Échelle → calibration avec une carte bancaire. Toutes les tailles d’optotypes en dépendent.' })
            ]),
            el('div', { class: 'tool-card', onClick: function () { App.go('phoropter'); } }, [
              el('span', { class: 'tc-ic', text: '2️⃣' }),
              el('h4', { text: 'Essayez un simulateur' }),
              el('p', { text: 'Le phoroptère et le cover test sont les deux plus riches. Chacun tire un patient au sort et vous note.' })
            ]),
            el('div', { class: 'tool-card', onClick: function () { App.go('patient'); } }, [
              el('span', { class: 'tc-ic', text: '3️⃣' }),
              el('h4', { text: 'Lancez une consultation' }),
              el('p', { text: 'Le mode patient enchaîne anamnèse, examens, diagnostic et conduite à tenir. Chaque examen prescrit se réalise vraiment, dans le simulateur réglé sur ce patient.' })
            ])
          ])
        ]),

        UI.card('Les grandes familles de modules', UI.table(['Famille', 'Contenu'], [
          ['<b>Savoir</b>', 'Cours et fiches de synthèse, anatomie interactive, glossaire, programme des 6 semestres'],
          ['<b>Outils</b>', 'Onze calculatrices cliniques : acuité, prismes, transposition, AC/A, accommodation, sommet, stéréoscopie…'],
          ['<b>Simulateurs</b>', 'Phoroptère, skiascopie, acuité, cover test, prismes, motilité, Lancaster, vision binoculaire, PPC, fond d’œil, couleurs, champ visuel'],
          ['<b>Mise en situation</b>', 'Mode patient (consultation complète) et rééducation suivie séance après séance'],
          ['<b>Révision</b>', 'QCM, fiches en répétition espacée, examen blanc chronométré, suivi de progression']
        ])),

        UI.card('Raccourcis clavier', [
          UI.table(['Raccourci', 'Action'], [
            ['Ctrl / Cmd + K', 'Recherche rapide : modules, cours, glossaire, cas, QCM et fiches mémo'],
            ['Espace · 1 2 3', 'Fiches mémo : retourner, puis oublié / difficile / su'],
            ['A à D · Entrée', 'QCM et examen blanc : répondre, puis question suivante'],
            ['Ctrl / Cmd + 1 à 5', 'Accueil, phoroptère, cover test, mode patient, calculatrices'],
            ['Alt + ← / →', 'Revenir à l’écran précédent, avancer (aussi : boutons latéraux de la souris)'],
            ['Ctrl / Cmd + D', 'Basculer thème clair / sombre'],
            ['Ctrl / Cmd + E', 'Exporter la progression'],
            ['Ctrl / Cmd + I', 'Importer une progression'],
            ['Ctrl / Cmd + + / −', 'Zoom de l’interface'],
            ['Échap', 'Fermer la recherche rapide ou le simulateur en surimpression']
          ]),
          UI.note('<b>Calcul instantané.</b> Tapez directement un calcul dans <kbd>Ctrl</kbd>+<kbd>K</kbd> : ' +
            '<kbd>5/10</kbd>, <kbd>logmar 0,3</kbd>, <kbd>12 delta</kbd>, <kbd>45 ans</kbd>, <kbd>33 cm</kbd>, ' +
            '<kbd>prentice 4 3</kbd>, <kbd>-2,50 -1,00 90</kbd>. Le résultat s’affiche en tête de liste.'),
          UI.note('<b>Tout se pilote au clavier.</b> <kbd>Tab</kbd> parcourt les éléments actifs, ' +
            '<kbd>Entrée</kbd> ou <kbd>Espace</kbd> les active. Dans la barre latérale, les flèches haut et bas ' +
            'passent d’un module à l’autre ; sur une molette de phoroptère, les flèches règlent la valeur ' +
            '(<kbd>Page ↑</kbd> / <kbd>Page ↓</kbd> par pas de dix).')
        ]),

        UI.card('Manipulations dans les simulateurs', el('ul', {
          html: '<li><b>Phoroptère</b> : molette de la souris ou glissement vertical sur les molettes ; boutons ±0,25 pour la précision.</li>' +
            '<li><b>Skiascopie</b> : glissez la souris sur l’œil pour balayer. Reflet dans le sens de la main = ombre directe, il manque du plus. ' +
            'Reflet incliné par rapport à la fente = vous n’êtes pas sur un méridien principal, tournez la fente. ' +
            'N’oubliez pas de retrancher le verre de distance de travail.</li>' +
            '<li><b>Cover test</b> : faites glisser l’écran noir devant l’œil, ou utilisez les boutons de séquence.</li>' +
            '<li><b>Fond d’œil</b> : glissez dans l’oculaire pour explorer, molette pour zoomer.</li>' +
            '<li><b>Prismes</b> : cliquez une valeur de la barre, puis relancez l’écran alterné.</li>' +
            '<li><b>PPC</b> : « rapprocher la cible » avance à la vitesse d’un vrai examen (2,5 cm/s, réglable). ' +
            'Surveillez les yeux, arrêtez au décrochage, affinez au centimètre, puis éloignez pour le recouvrement.</li>' +
            '<li><b>Rééducation</b> : une séance = une semaine. Composez le programme, dosez le travail à domicile — ' +
            'ni zéro ni dix séances par semaine — et re-mesurez régulièrement dans les simulateurs, ' +
            'qui sont réglés sur l’état <b>courant</b> du patient.</li>'
        })),

        UI.card('Comment sont calculés les scores', [
          el('p', {
            html: 'Chaque simulateur produit une note sur 100 fondée sur l’écart entre votre mesure et la valeur réelle du patient simulé ' +
              '(et, pour certains, sur le nombre de manipulations nécessaires). La moyenne et le meilleur score sont conservés par module. ' +
              'Les QCM alimentent un suivi par thème et les fiches un système de répétition espacée à cinq boîtes.'
          }),
          UI.note('<b>Un simulateur ne compte que si vous validez.</b> En mode patient comme à l’examen blanc, ' +
            'un poste ouvert puis refermé sans validation vaut 0 : c’est la validation qui produit la note. ' +
            'En consultation, la moyenne de vos gestes techniques rapporte jusqu’à <b>5 points</b> sur la note du bilan.')
        ]),

        UI.card('Avertissement pédagogique', UI.note(
          '<b>OrthoStudent est un outil d’entraînement, pas un dispositif médical.</b><br><br>' +
          'Les simulations reposent sur des modèles simplifiés destinés à faire comprendre des mécanismes : le flou optique, ' +
          'les mouvements de refixation, les tracés périmétriques et les images de fond d’œil sont des reconstructions schématiques, ' +
          'pas des reproductions cliniques exactes. Les valeurs et normes citées suivent les références usuelles de l’enseignement français, ' +
          'mais elles ne remplacent ni vos cours, ni les protocoles de votre lieu de stage, ni le jugement clinique.<br><br>' +
          'Aucune mesure réalisée dans cette application ne doit servir à évaluer une vraie personne. ' +
          'L’affichage d’optotypes à l’écran, même calibré, ne constitue pas une mesure d’acuité valide.', 'warn'))
      ]);
    }
  };

})();
