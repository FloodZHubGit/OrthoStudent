/* ============================================================
   Vision Lab — expérience 1 : la recherche visuelle
   ------------------------------------------------------------
   Le phénomène tient en une phrase : chercher une cible qui se
   distingue par UN attribut ne coûte presque rien quel que soit
   le nombre de distracteurs, alors que chercher une cible définie
   par la CONJONCTION de deux attributs coûte du temps à chaque
   élément ajouté.

   Concrètement :

     · recherche simple — un disque rouge parmi des disques bleus.
       La couleur « saute aux yeux ». Le temps de réaction est à
       peu près plat quand on passe de 4 à 16 éléments : quelques
       millisecondes par élément, souvent moins que le bruit.

     · recherche par conjonction — un disque rouge parmi des
       carrés rouges et des disques bleus. Aucun attribut ne
       suffit : ni « rouge », ni « rond ». Il faut examiner les
       éléments, et la pente monte — typiquement 20 à 40 ms par
       élément quand la cible est là, environ le double quand elle
       est absente, puisqu'il faut alors tout épuiser avant de
       conclure.

   Ce rapport de un à deux entre absence et présence est la
   signature d'une recherche sérielle : on s'arrête en moyenne à
   la moitié de la liste quand on trouve, jamais avant la fin
   quand il n'y a rien.

   Ce qu'on mesure ici n'a rien de clinique : c'est une expérience
   de psychophysique sur un écran grand public, faite pour
   comprendre un mécanisme, pas pour évaluer quelqu'un.
   ============================================================ */
(function () {
  'use strict';

  /* Les couleurs des stimuli ne suivent PAS le thème de l'application.
     Un stimulus qui change avec les préférences d'affichage n'est plus un
     stimulus : la condition « rouge parmi bleus » doit être la même à
     chaque session, en clair comme en sombre. Elles ne sont pas calibrées
     photométriquement pour autant — on ne prétend pas à l'équiluminance. */
  var COULEURS = {
    fond: '#101216',
    rouge: '#e5484d',
    bleu: '#3e63dd',
    fixation: '#e9eff6'
  };

  /* Géométrie, en degrés d'angle visuel — la seule unité qui ait un sens
     pour l'œil. Converties en pixels au moment de l'affichage. */
  var GEO = {
    elementDeg: 1.0,      /* diamètre d'un élément */
    champDeg: 18,         /* côté du carré où ils sont semés */
    espacementMin: 2.0    /* distance minimale entre centres, en diamètres */
  };

  var TAILLES = [4, 8, 12, 16];

  function creerElements(essai, rnd, outils) {
    var n = essai.taille;
    /* distance minimale exprimée dans le carré unité */
    var dmin = (GEO.elementDeg * GEO.espacementMin) / GEO.champDeg;
    var pos = outils.positions(n, dmin, rnd);

    var elements = pos.map(function (p) { return { x: p.x, y: p.y }; });
    var iCible = essai.cible ? Math.floor(rnd() * n) : -1;

    if (essai.condition === 'simple') {
      /* Un disque rouge parmi des disques bleus : seule la couleur distingue. */
      elements.forEach(function (e, i) {
        e.forme = 'rond';
        e.couleur = i === iCible ? 'rouge' : 'bleu';
        e.cible = i === iCible;
      });
    } else {
      /* Conjonction : la cible est le disque ROUGE. Les distracteurs
         partagent chacun un attribut avec elle — carrés rouges et disques
         bleus — de sorte qu'aucun attribut isolé ne permette de trancher.
         On répartit les distracteurs à parts égales : un déséquilibre
         rendrait l'attribut minoritaire informatif, et la conjonction se
         résoudrait comme une recherche simple. */
      var autres = [];
      for (var i = 0; i < n; i++) if (i !== iCible) autres.push(i);
      autres = outils.melanger(autres, rnd);
      var moitie = Math.floor(autres.length / 2);
      elements.forEach(function (e, i) {
        if (i === iCible) { e.forme = 'rond'; e.couleur = 'rouge'; e.cible = true; return; }
        var rang = autres.indexOf(i);
        if (rang < moitie) { e.forme = 'carre'; e.couleur = 'rouge'; }
        else { e.forme = 'rond'; e.couleur = 'bleu'; }
        e.cible = false;
      });
    }
    return elements;
  }

  Lab.definir({
    id: 'recherche',
    version: 1,
    nom: 'Recherche visuelle',
    court: 'Pourquoi une cible « saute aux yeux » — et pourquoi une autre non',
    ue: ['UE04', 'UE05', 'UE18'],
    geometrie: GEO,
    couleurs: COULEURS,
    tailles: TAILLES,

    calibration: { requise: true, pleinEcran: true },

    defauts: {
      tailles: TAILLES,
      repetitions: 3,        /* par cellule : condition × taille × présence */
      entrainement: 8,
      fixationMs: 500,
      pauseMs: 300
    },

    modes: {
      /* Une minute pour voir le phénomène : deux tailles extrêmes suffisent
         à faire sentir la différence de pente, et huit essais d'un coup ne
         fatiguent personne. */
      demo: { tailles: [4, 16], repetitions: 1, entrainement: 4 },
      /* Le protocole complet : 2 conditions × 4 tailles × 2 présences × 3
         répétitions = 48 essais, de quoi estimer une pente par condition. */
      mesure: { tailles: TAILLES, repetitions: 3, entrainement: 8 },
      perso: {}
    },

    reponses: [
      { touche: 'f', val: true, label: 'Cible présente' },
      { touche: 'j', val: false, label: 'Cible absente' }
    ],

    mesures: ['temps de réaction', 'exactitude', 'condition', 'taille d’ensemble', 'position des stimuli'],

    /* Ce que l'export CSV porte en propre, en plus des colonnes communes. */
    colonnes: [
      { nom: 'condition', val: function (e) { return e.condition; } },
      { nom: 'taille_ensemble', val: function (e) { return e.taille; } },
      { nom: 'cible_presente', val: function (e) { return e.cible; } }
    ],

    /* ------------------------------------------------------------
       Les essais : équilibrés d'abord, mélangés ensuite.
       ------------------------------------------------------------ */
    essais: function (p, rnd, outils) {
      var tailles = (p.tailles && p.tailles.length ? p.tailles : TAILLES).slice().sort(function (a, b) { return a - b; });
      var cellules = [];
      ['simple', 'conjonction'].forEach(function (cond) {
        tailles.forEach(function (t) {
          [true, false].forEach(function (cible) {
            for (var r = 0; r < (p.repetitions || 3); r++) {
              cellules.push({ condition: cond, taille: t, cible: cible });
            }
          });
        });
      });

      var ordre = outils.melanger(cellules, rnd);

      /* Les essais d'entraînement précèdent, tirés des mêmes cellules mais
         marqués : ils servent à comprendre la consigne, pas à mesurer. */
      var entr = [];
      var nEntr = p.entrainement === undefined ? 8 : p.entrainement;
      for (var i = 0; i < nEntr; i++) {
        var c = ordre[i % ordre.length];
        entr.push({ condition: c.condition, taille: c.taille, cible: c.cible, entrainement: true });
      }

      return entr.concat(ordre).map(function (e, i) {
        var essai = {
          n: i, condition: e.condition, taille: e.taille, cible: e.cible,
          entrainement: !!e.entrainement,
          attendu: e.cible
        };
        essai.elements = creerElements(essai, rnd, outils);
        return essai;
      });
    },

    juste: function (essai, reponse) { return essai.cible === reponse; },

    /* ------------------------------------------------------------
       L'analyse
       ------------------------------------------------------------
       Les temps ne sont calculés que sur les réponses JUSTES : un
       temps de réaction associé à une erreur ne mesure pas la
       recherche, il mesure autre chose. Les essais faux restent
       dans les données brutes et comptent dans l'exactitude.
       ------------------------------------------------------------ */
    analyser: function (s, st) {
      var reps = s.reponses.filter(function (r) {
        var e = s.essais[r.i];
        return e && !e.entrainement;
      });
      if (!reps.length) return null;

      function tempsDe(filtre) {
        var t = reps.filter(function (r) { return r.juste && filtre(r); })
          .map(function (r) { return r.ms; });
        var net = st.nettoyer(t);
        return { n: net.gardes.length, ecartes: net.ecartes, mediane: st.mediane(net.gardes) };
      }

      var justes = reps.filter(function (r) { return r.juste; }).length;
      /* Faux positif : dire « présente » quand elle ne l'était pas. */
      var fp = reps.filter(function (r) { return !r.juste && r.reponse === true; }).length;
      var fn = reps.filter(function (r) { return !r.juste && r.reponse === false; }).length;

      var parCondition = {};
      var pentes = {};
      ['simple', 'conjonction'].forEach(function (cond) {
        var dansCond = function (r) { return s.essais[r.i].condition === cond; };
        parCondition[cond] = {
          global: tempsDe(dansCond),
          presente: tempsDe(function (r) { return dansCond(r) && s.essais[r.i].cible; }),
          absente: tempsDe(function (r) { return dansCond(r) && !s.essais[r.i].cible; }),
          exactitude: (function () {
            var l = reps.filter(dansCond);
            return l.length ? l.filter(function (r) { return r.juste; }).length / l.length : null;
          })()
        };
        pentes[cond] = {};
        [true, false].forEach(function (cible) {
          var pts = [];
          (s.params.tailles || TAILLES).forEach(function (t) {
            var m = tempsDe(function (r) {
              var e = s.essais[r.i];
              return e.condition === cond && e.taille === t && e.cible === cible;
            });
            if (m.mediane !== null && m.n >= 2) pts.push({ x: t, y: m.mediane, n: m.n });
          });
          pentes[cond][cible ? 'presente' : 'absente'] = pts.length >= 2
            ? Object.assign(st.pente(pts), { points: pts })
            : { pente: null, points: pts, n: pts.length };
        });
      });

      /* le détail par cellule, pour le graphique et le tableau */
      var parTaille = [];
      ['simple', 'conjonction'].forEach(function (cond) {
        (s.params.tailles || TAILLES).forEach(function (t) {
          [true, false].forEach(function (cible) {
            var m = tempsDe(function (r) {
              var e = s.essais[r.i];
              return e.condition === cond && e.taille === t && e.cible === cible;
            });
            parTaille.push({ condition: cond, taille: t, cible: cible, mediane: m.mediane, n: m.n });
          });
        });
      });

      /* ------------------------------------------------------------
         Ce qui rend la lecture douteuse. Mieux vaut une mesure
         accompagnée de ses réserves qu'une pente affichée sans elles.
         ------------------------------------------------------------ */
      var avert = [];
      var exact = justes / reps.length;
      if (reps.length < 24) {
        avert.push('Seulement ' + reps.length + ' essais mesurés : une pente demande plus de matière. ' +
          'Le mode « Mesure » en propose 48.');
      }
      if (exact < 0.8) {
        avert.push('Exactitude de ' + Math.round(exact * 100) + ' % : sous 80 %, les temps de réaction ' +
          'ne décrivent plus une recherche menée à son terme.');
      }
      var tousTemps = reps.filter(function (r) { return r.juste; }).map(function (r) { return r.ms; });
      var sd = st.ecartType(tousTemps), md = st.mediane(tousTemps);
      if (sd && md && sd / md > 0.8) {
        avert.push('Temps très dispersés (écart-type à ' + Math.round((sd / md) * 100) + ' % de la médiane) : ' +
          'attention flottante, interruptions, ou consigne mal comprise.');
      }
      var ecartes = parCondition.simple.global.ecartes + parCondition.conjonction.global.ecartes;
      if (ecartes) {
        avert.push(ecartes + ' essai(s) écarté(s) du calcul des temps : hors de la fenêtre 150–8000 ms. ' +
          'Ils restent dans les données brutes.');
      }
      var cellulesMinces = parTaille.filter(function (c) { return c.n < 2; }).length;
      if (cellulesMinces > parTaille.length / 3) {
        avert.push(cellulesMinces + ' cellules sur ' + parTaille.length + ' comptent moins de deux essais justes : ' +
          'les points du graphique sont fragiles.');
      }

      return {
        n: reps.length, justes: justes, exactitude: exact,
        fauxPositifs: fp, fauxNegatifs: fn,
        medianeGlobale: st.mediane(tousTemps),
        parCondition: parCondition,
        parTaille: parTaille,
        pentes: pentes,
        avertissements: avert
      };
    },

    /* ------------------------------------------------------------
       L'explication, écrite à partir des chiffres obtenus
       ------------------------------------------------------------
       Un rapport qui redirait le cours quels que soient les
       résultats n'apprendrait rien. Celui-ci commente CE QUI
       S'EST PASSÉ, y compris quand c'est l'inverse de l'attendu.
       ------------------------------------------------------------ */
    expliquer: function (a) {
      if (!a) return [];
      var out = [];
      var ps = a.pentes.simple.presente, pc = a.pentes.conjonction.presente;
      var ms = function (x) { return x === null || x === undefined ? '—' : Math.round(x) + ' ms'; };
      /* Virgule décimale : on écrit en français, comme uefigs.js et atelier.js. */
      var fr = function (x) { return String(x).replace('.', ','); };
      var dec = function (x, n) { var f = Math.pow(10, n); return fr(Math.round(x * f) / f); };
      var msE = function (x) { return dec(x, 1) + ' ms/élément'; };

      if (ps && ps.pente !== null && pc && pc.pente !== null) {
        var s = ps.pente, c = pc.pente;
        out.push({
          t: 'Le coût d’un élément de plus',
          p: 'Cible présente, votre temps augmente de <b>' + ms(s) + ' par élément</b> en recherche simple, ' +
             'et de <b>' + ms(c) + ' par élément</b> en conjonction.' +
             (c > s + 8
               ? ' C’est le résultat attendu : la couleur seule se repère sans être cherchée, ' +
                 'tandis qu’une cible définie par deux attributs oblige à examiner les éléments un à un.'
               : c > s
                 ? ' L’écart va dans le bon sens mais reste petit : avec ce nombre d’essais, il peut n’être que du bruit.'
                 : ' L’écart est ici inversé, ce qui n’est pas le résultat classique. Trop peu d’essais, ' +
                   'une stratégie de réponse, ou une fatigue en fin de série suffisent à produire cela.')
        });
      }

      var cp = a.parCondition.conjonction.presente.mediane;
      var ca = a.parCondition.conjonction.absente.mediane;
      var pcp = a.pentes.conjonction.presente, pca = a.pentes.conjonction.absente;
      if (cp && ca) {
        var rapport = ca / cp;
        /* Le facteur deux classique porte sur les PENTES, jamais sur les temps
           médians : ceux-ci portent aussi un coût fixe — percevoir, décider,
           appuyer sur la touche — qui s'ajoute des deux côtés et rapproche
           toujours leur rapport de 1. Écrire « proche du double » sous un
           rapport de 1,35 se contredisait dans la même phrase. */
        var rp = (pcp && pcp.pente > 0 && pca && pca.pente !== null) ? pca.pente / pcp.pente : null;
        out.push({
          t: 'Chercher, et ne rien trouver',
          p: 'En conjonction, vous mettez <b>' + ms(cp) + '</b> quand la cible est là et <b>' + ms(ca) + '</b> ' +
             'quand elle est absente, soit un rapport de <b>' + dec(rapport, 2) + '</b>. ' +
             (rapport > 1.15
               ? 'C’est la marque d’une recherche sérielle : on trouve en moyenne à mi-parcours, alors ' +
                 'que pour conclure à l’absence il faut avoir tout épuisé. '
               : 'Un rapport proche de 1 suggère que vous n’avez pas parcouru les éléments un à un : ' +
                 'peut-être avez-vous répondu sur une impression d’ensemble. ') +
             (rp === null
               ? ''
               : 'Ce rapport-là reste toujours modeste, parce qu’un temps de réaction porte aussi un ' +
                 'coût fixe — percevoir, décider, appuyer — qui s’ajoute des deux côtés. Le rapport qui ' +
                 'compte est celui des <b>pentes</b> : <b>' + dec(rp, 2) + '</b> ici (' + msE(pca.pente) +
                 ' contre ' + msE(pcp.pente) + '). ' +
                 (rp > 1.6 && rp < 2.6
                   ? 'La théorie en prédit environ deux, et c’est ce que vous obtenez : aller au bout de ' +
                     'la liste coûte deux fois plus cher que trouver en chemin.'
                   : rp >= 2.6
                     ? 'C’est plus que le double attendu : peut-être avez-vous vérifié une seconde fois ' +
                       'avant de conclure à l’absence.'
                     : 'C’est moins que le double attendu : la recherche a sans doute été abrégée avant ' +
                       'd’avoir tout examiné — ce que confirmeraient des cibles manquées.'))
        });
      }

      var es = a.parCondition.simple.global.mediane, ec = a.parCondition.conjonction.global.mediane;
      if (es && ec) {
        out.push({
          t: 'Ce que cela dit de l’attention',
          p: 'La recherche simple s’est faite en <b>' + ms(es) + '</b>, la conjonction en <b>' + ms(ec) + '</b>. ' +
             'Un attribut isolé — couleur, orientation, mouvement — est traité en parallèle sur tout le champ, ' +
             'sans que l’attention ait à se déplacer. Une conjonction demande de lier deux attributs sur un même ' +
             'objet, et ce liage se fait objet par objet. C’est le même mécanisme qui explique qu’un patient ' +
             'repère immédiatement un feu rouge, mais mette du temps à retrouver ses clés sur une table encombrée.'
        });
      }

      if (a.exactitude < 0.9) {
        out.push({
          t: 'Vos erreurs',
          p: '<b>' + a.fauxPositifs + '</b> fois vous avez annoncé une cible absente, ' +
             '<b>' + a.fauxNegatifs + '</b> fois vous en avez manqué une. ' +
             (a.fauxNegatifs > a.fauxPositifs * 2
               ? 'Manquer beaucoup plus qu’inventer indique une recherche écourtée : on conclut à l’absence avant d’avoir fini.'
               : a.fauxPositifs > a.fauxNegatifs * 2
                 ? 'Annoncer des cibles absentes indique plutôt une réponse trop rapide, avant la fin de l’examen.'
                 : 'Les deux types d’erreur s’équilibrent, ce qui suggère plutôt une difficulté générale qu’un biais de réponse.')
        });
      }

      return out;
    }
  });

  /* ============================================================
     La moitié « écran »
     ------------------------------------------------------------
     Ce qui précède mesure ; ce qui suit montre. Le module vision.js
     ne connaît aucune expérience en particulier : il demande à
     chacune de dessiner ses stimuli et de rendre ses propres blocs
     de consigne et de rapport. Une recherche visuelle et un
     encombrement ne se racontent pas avec le même tableau.
     ============================================================ */
  Object.assign(Lab.def('recherche'), {
    icone: '🔎',

    /* Ce que veulent dire les nombres d'une commande « /lab … 4 8 12 ». */
    champNombres: 'tailles',
    uniteNombres: 'tailles',

    /* Combien de temps cela prend, mode par mode. */
    duree: function (mode) {
      var p = Object.assign({}, this.defauts, this.modes[mode] || {});
      if (mode === 'perso') return 'variable';
      var n = 2 * (p.tailles || TAILLES).length * 2 * p.repetitions + (p.entrainement || 0);
      return '≈ ' + Math.max(1, Math.round(n * 2.2 / 60)) + ' min';
    },

    presentation: function (u) {
      return u.el('div', {}, [
        u.el('p', { html:
          'Sur un écran, une pastille rouge parmi des pastilles bleues se repère <b>immédiatement</b>, ' +
          'qu’il y en ait quatre ou quarante : la couleur est traitée en parallèle sur tout le champ ' +
          'visuel. Cherchez maintenant la pastille <i>ronde et rouge</i> parmi des carrés rouges et des ' +
          'ronds bleus : aucun attribut pris seul ne suffit, il faut lier la forme et la couleur sur un ' +
          'même objet — et ce liage se fait objet par objet.' }),
        u.el('p', { html:
          'La conséquence se mesure : dans le premier cas, votre temps de réponse ne dépend presque pas ' +
          'du nombre d’éléments ; dans le second, il augmente d’une quantité à peu près fixe par élément ' +
          'ajouté. C’est cette <b>pente, en millisecondes par élément</b>, que l’expérience estime — sur vous.' }),
        u.el('p', { class: 'hint', html:
          'C’est le mécanisme derrière le fait qu’un patient repère un feu rouge sans le chercher, mais ' +
          'mette du temps à retrouver ses clés sur une table encombrée.' })
      ]);
    },

    /* ---------------- La consigne ---------------- */
    consigne: function (p, u) {
      var UI2 = u.UI;
      return [
        UI2.card('La tâche', u.el('div', {}, [
          u.el('p', { html:
            'À chaque essai, un ensemble de formes apparaît. Vous cherchez <b>un disque rouge</b>. ' +
            'Il est là une fois sur deux.' }),
          u.el('p', { html:
            'Répondez <b>le plus vite possible sans vous tromper</b>. La vitesse seule ne vaut rien : ' +
            'une réponse fausse est écartée du calcul des temps, et une exactitude basse rend tout le ' +
            'reste illisible.' })
        ])),
        UI2.card('Les deux conditions', u.el('div', {}, [
          u.el('div', { class: 'grid g2', style: { gap: '12px' } }, [
            u.el('div', {}, [
              u.el('div', { class: 'hint', style: { marginBottom: '6px' },
                text: 'Recherche simple — la cible saute aux yeux' }),
              vignette('simple')
            ]),
            u.el('div', {}, [
              u.el('div', { class: 'hint', style: { marginBottom: '6px' },
                text: 'Conjonction — il faut l’examiner' }),
              vignette('conjonction')
            ])
          ]),
          u.el('p', { class: 'hint', style: { marginTop: '10px' }, html:
            'Les deux conditions sont mélangées : vous ne savez pas à l’avance laquelle arrive. ' +
            'C’est voulu — vous prévenir vous ferait changer de stratégie.' })
        ]))
      ];
    },

    /* ---------------- Le dessin ---------------- */
    dessiner: function (ctx, essai, geo, u) {
      var elementPx = u.degVersPx(GEO.elementDeg);
      var voulu = u.degVersPx(GEO.champDeg);
      /* Si le champ nominal ne tient pas à l’écran, on le réduit plutôt que
         de laisser des stimuli déborder. Le rapport dira ce qui a servi. */
      var champ = Math.min(voulu, Math.min(geo.l, geo.h) - elementPx - 24);
      peindre(ctx, essai, { l: geo.l, h: geo.h, element: elementPx, champ: champ }, u.couleurs);
    },

    /* La géométrie réellement affichée, pour le rapport. */
    rendu: function (geo) {
      var elementPx = geo.pxParDegre * GEO.elementDeg;
      var voulu = geo.pxParDegre * GEO.champDeg;
      var champ = Math.min(voulu, Math.min(geo.l, geo.h) - elementPx - 24);
      return {
        elementDeg: Math.round(GEO.elementDeg * 100) / 100,
        elementPx: Math.round(elementPx * 10) / 10,
        champDeg: Math.round((champ / geo.pxParDegre) * 10) / 10,
        champNominalDeg: GEO.champDeg
      };
    },

    /* ---------------- Le mode personnalisé ---------------- */
    reglages: function (p, maj, u) {
      var UI2 = u.UI;
      var TOUTES = [2, 4, 6, 8, 10, 12, 16, 20, 24];
      var cases = u.el('div', { class: 'btn-row' }, TOUTES.map(function (t) {
        var actif = p.tailles.indexOf(t) >= 0;
        var b = UI2.btn(String(t), function () {
          var i = p.tailles.indexOf(t);
          if (i >= 0) {
            if (p.tailles.length <= 2) { UI2.toast('Il faut au moins deux tailles pour une pente'); return; }
            p.tailles.splice(i, 1);
          } else p.tailles.push(t);
          p.tailles.sort(function (x, y) { return x - y; });
          b.classList.toggle('primary');
          maj();
        }, actif ? 'primary' : '');
        return b;
      }));
      return u.el('div', {}, [
        UI2.field('Tailles d’ensemble', cases,
          'Le nombre d’éléments affichés — l’axe des abscisses du graphique. Deux au minimum.'),
        UI2.field('Répétitions par cellule', UI2.num(p.repetitions, function (v) {
          p.repetitions = Math.max(1, Math.min(10, v || 1)); maj();
        }, { min: 1, max: 10, step: 1 }),
          'Une cellule = une condition × une taille × présence ou absence.'),
        UI2.field('Essais d’entraînement', UI2.num(p.entrainement, function (v) {
          p.entrainement = Math.max(2, Math.min(20, v || 2)); maj();
        }, { min: 2, max: 20, step: 1 }), 'Non mesurés.')
      ]);
    },

    apercu: function (p) {
      var n = 2 * p.tailles.length * 2 * p.repetitions;
      return '<b>' + n + ' essais mesurés</b> (2 conditions × ' + p.tailles.length +
        ' tailles × présence/absence × ' + p.repetitions + ' répétitions), plus ' +
        p.entrainement + ' d’entraînement. Environ ' +
        Math.max(1, Math.round(n * 2.2 / 60)) + ' minutes.' +
        (n < 24 ? '<br><span style="color:var(--amber)">Sous 24 essais, la pente ne repose ' +
          'sur presque rien.</span>' : '');
    },

    /* ---------------- Le rapport ---------------- */
    resume: function (a, u) {
      if (!a) return '—';
      var pc = a.pentes.conjonction.presente.pente;
      return pc === null ? Math.round(a.exactitude * 100) + ' %'
        : 'conjonction ' + u.dec(pc, 1) + ' ms/élém.';
    },

    rapport: function (a, s, u) {
      if (!a) return [];
      var UI2 = u.UI;
      var ps = a.pentes.simple.presente, pc = a.pentes.conjonction.presente;
      return [
        UI2.card('En bref', u.el('div', { class: 'grid g4' }, [
          UI2.stat(Math.round(a.exactitude * 100) + ' %', 'exactitude',
            a.exactitude >= 0.9 ? 'var(--green)' : a.exactitude >= 0.8 ? 'var(--amber)' : 'var(--red)'),
          UI2.stat(u.ms(a.medianeGlobale), 'temps médian'),
          UI2.stat(a.n, 'essais mesurés'),
          UI2.stat(a.fauxPositifs + ' / ' + a.fauxNegatifs, 'faux positifs / négatifs')
        ])),
        UI2.card('La pente — le coût d’un élément de plus', u.el('div', {}, [
          u.el('div', { class: 'grid g2' }, [
            panneauPente('Recherche simple', ps, 'La couleur seule : la pente devrait être proche de zéro.', u),
            panneauPente('Conjonction', pc, 'Forme et couleur : la pente devrait être franchement positive.', u)
          ]),
          graphe(a, u)
        ])),
        UI2.card('Le détail, condition par condition', tableauConditions(a, u))
      ];
    },

    comparer: function (a, ab, s, b, u) {
      var UI2 = u.UI;
      var ligne = function (nom, x, y, fmt) {
        var dx = (x !== null && x !== undefined && y !== null && y !== undefined) ? x - y : null;
        return [nom, fmt(y), fmt(x), dx === null ? '—' : (dx > 0 ? '+' : '') + fmt(dx)];
      };
      return u.el('div', {}, [
        UI2.table(['', 'Référence', 'Cette passation', 'Écart'], [
          ligne('Exactitude', a.exactitude, ab.exactitude,
            function (v) { return v === null ? '—' : Math.round(v * 100) + ' %'; }),
          ligne('Temps médian', a.medianeGlobale, ab.medianeGlobale, u.ms),
          ligne('Pente simple', a.pentes.simple.presente.pente, ab.pentes.simple.presente.pente, msElem2(u)),
          ligne('Pente conjonction', a.pentes.conjonction.presente.pente,
            ab.pentes.conjonction.presente.pente, msElem2(u))
        ]),
        u.el('div', { class: 'hint', style: { marginTop: '8px' }, html:
          'Un temps médian qui baisse d’une passation à l’autre relève surtout de l’<b>habitude de la ' +
          'tâche</b> : la seconde fois, la consigne et les touches ne coûtent plus rien. La ' +
          '<b>différence entre les deux pentes</b>, elle, est bien plus stable — c’est elle qu’il faut ' +
          'regarder.' })
      ]);
    }
  });

  /* ------------------------------------------------------------
     Les fonctions de dessin et de rendu
     ------------------------------------------------------------ */

  function msElem2(u) {
    return function (x) { return x === null || x === undefined ? '—' : u.dec(x, 1) + ' ms/élém.'; };
  }

  /* Le carré est dessiné à SURFACE égale au disque (côté = r√π), et non à
     diamètre égal : sinon il occuperait un tiers de surface en plus et sa
     taille deviendrait elle-même un indice. */
  function peindre(ctx, essai, geo, couleurs) {
    ctx.fillStyle = couleurs.fond;
    ctx.fillRect(0, 0, geo.l, geo.h);
    var champ = geo.champ || Math.min(geo.l, geo.h) - geo.element * 2;
    var x0 = geo.l / 2 - champ / 2;
    var y0 = geo.h / 2 - champ / 2;
    var r = geo.element / 2;
    var cote = r * Math.sqrt(Math.PI);
    essai.elements.forEach(function (e) {
      var cx = x0 + e.x * champ;
      var cy = y0 + e.y * champ;
      ctx.fillStyle = couleurs[e.couleur] || '#fff';
      if (e.forme === 'carre') {
        ctx.fillRect(cx - cote / 2, cy - cote / 2, cote, cote);
      } else {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  /* Une vignette statique, composée par le MÊME code que l’expérience :
     un exemple dessiné à part finirait par montrer autre chose que la tâche. */
  function vignette(condition) {
    var rnd = Lab.generateur(condition === 'simple' ? 7 : 11);
    var dmin = (GEO.elementDeg * GEO.espacementMin) / GEO.champDeg;
    var pos = Lab.positions(9, dmin, rnd);
    var essai = {
      condition: condition, taille: 9, cible: true,
      elements: pos.map(function (p) { return { x: p.x, y: p.y }; })
    };
    var iCible = 4;
    if (condition === 'simple') {
      essai.elements.forEach(function (e, i) {
        e.forme = 'rond'; e.couleur = i === iCible ? 'rouge' : 'bleu'; e.cible = i === iCible;
      });
    } else {
      essai.elements.forEach(function (e, i) {
        e.cible = i === iCible;
        if (i === iCible) { e.forme = 'rond'; e.couleur = 'rouge'; }
        else if (i % 2) { e.forme = 'carre'; e.couleur = 'rouge'; }
        else { e.forme = 'rond'; e.couleur = 'bleu'; }
      });
    }
    /* Le champ est CARRÉ, comme dans l’expérience : un cadre trop large
       laisserait de grandes marges vides de part et d’autre. */
    var c = UI.el('canvas', { width: 380, height: 300,
      style: { width: '100%', borderRadius: '10px', display: 'block' } });
    peindre(c.getContext('2d'), essai, { l: 380, h: 300, element: 26 }, COULEURS);
    return c;
  }

  function panneauPente(titre, p, attendu, u) {
    var valeur = p && p.pente !== null ? u.dec(p.pente, 1) + ' ms/élém.' : '—';
    return u.el('div', { class: 'card', style: { margin: '0' } }, [
      u.el('div', { class: 'hint', text: titre }),
      u.el('div', { style: { fontSize: '26px', fontWeight: '700', color: 'var(--accent)',
        margin: '4px 0' }, text: valeur }),
      u.el('div', { class: 'hint', html: p && p.pente !== null
        ? 'sur ' + p.n + ' points, r² = ' + u.dec(p.r2, 2) +
          (p.r2 < 0.5 ? ' — les points s’alignent mal, la pente est peu fiable' : '')
        : 'pas assez de points pour une droite' }),
      u.el('div', { class: 'hint', style: { marginTop: '6px', opacity: '.75' }, text: attendu })
    ]);
  }

  /* Temps médian en fonction de la taille d’ensemble. Quatre séries — deux
     conditions × présence/absence — parce que c’est l’écart entre elles qui
     porte tout le résultat. */
  function graphe(a, u) {
    var svg = u.svg, el = u.el;
    var W = 640, H = 300, mg = { g: 54, d: 16, h: 16, b: 44 };
    var tailles = [];
    a.parTaille.forEach(function (c) { if (tailles.indexOf(c.taille) < 0) tailles.push(c.taille); });
    tailles.sort(function (x, y) { return x - y; });

    var pts = a.parTaille.filter(function (c) { return c.mediane !== null; });
    if (pts.length < 2) return u.UI.note('Pas assez de points pour tracer une courbe.', '');

    var maxY = Math.max.apply(null, pts.map(function (c) { return c.mediane; })) * 1.12;
    var minX = tailles[0], maxX = tailles[tailles.length - 1];
    var X = function (t) { return mg.g + (t - minX) / Math.max(1, maxX - minX) * (W - mg.g - mg.d); };
    var Y = function (v) { return H - mg.b - v / Math.max(1, maxY) * (H - mg.h - mg.b); };

    var SERIES = [
      { cond: 'simple', cible: true, nom: 'Simple · présente', couleur: '#3e9bdd', trait: null },
      { cond: 'simple', cible: false, nom: 'Simple · absente', couleur: '#3e9bdd', trait: '4 3' },
      { cond: 'conjonction', cible: true, nom: 'Conjonction · présente', couleur: '#e5484d', trait: null },
      { cond: 'conjonction', cible: false, nom: 'Conjonction · absente', couleur: '#e5484d', trait: '4 3' }
    ];

    var enfants = [];
    var pas = maxY > 3000 ? 1000 : maxY > 1200 ? 500 : 200;
    for (var v = 0; v <= maxY; v += pas) {
      enfants.push(svg('line', { x1: mg.g, y1: Y(v), x2: W - mg.d, y2: Y(v),
        stroke: 'var(--line)', 'stroke-width': 1 }));
      enfants.push(svg('text', { x: mg.g - 8, y: Y(v) + 4, 'text-anchor': 'end',
        fill: 'var(--txt-2)', 'font-size': 11 }, String(v)));
    }
    tailles.forEach(function (t) {
      enfants.push(svg('text', { x: X(t), y: H - mg.b + 18, 'text-anchor': 'middle',
        fill: 'var(--txt-2)', 'font-size': 11 }, String(t)));
    });
    enfants.push(svg('text', { x: (W + mg.g) / 2, y: H - 6, 'text-anchor': 'middle',
      fill: 'var(--txt-2)', 'font-size': 11 }, 'nombre d’éléments'));
    enfants.push(svg('text', { x: 14, y: H / 2, 'text-anchor': 'middle',
      fill: 'var(--txt-2)', 'font-size': 11,
      transform: 'rotate(-90 14 ' + (H / 2) + ')' }, 'temps médian (ms)'));

    SERIES.forEach(function (se) {
      var p = a.parTaille.filter(function (c) {
        return c.condition === se.cond && c.cible === se.cible && c.mediane !== null;
      }).sort(function (x, y) { return x.taille - y.taille; });
      if (!p.length) return;
      if (p.length > 1) {
        enfants.push(svg('polyline', {
          points: p.map(function (c) { return X(c.taille) + ',' + Y(c.mediane); }).join(' '),
          fill: 'none', stroke: se.couleur, 'stroke-width': 2,
          'stroke-dasharray': se.trait, 'stroke-linejoin': 'round'
        }));
      }
      p.forEach(function (c) {
        enfants.push(svg('circle', { cx: X(c.taille), cy: Y(c.mediane), r: 4,
          fill: se.cible ? se.couleur : 'var(--bg)', stroke: se.couleur, 'stroke-width': 2 }));
      });
    });

    return el('div', { style: { marginTop: '16px' } }, [
      el('div', { style: { overflowX: 'auto' } },
        svg('svg', { viewBox: '0 0 ' + W + ' ' + H,
          style: 'width:100%;min-width:420px;height:auto;display:block' }, enfants)),
      el('div', { class: 'btn-row', style: { marginTop: '8px', flexWrap: 'wrap' } },
        SERIES.map(function (se) {
          return el('span', { class: 'chip static',
            style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [
            el('span', { style: { width: '14px', height: '0', display: 'inline-block',
              borderTop: (se.trait ? '2px dashed ' : '2px solid ') + se.couleur } }),
            el('span', { text: se.nom })
          ]);
        })),
      el('div', { class: 'hint', style: { marginTop: '6px' }, html:
        'Points pleins : cible présente. Points creux et pointillés : cible absente. ' +
        'Seuls les essais <b>justes</b> comptent dans ces médianes.' })
    ]);
  }

  function tableauConditions(a, u) {
    var lignes = [];
    [['simple', 'Recherche simple'], ['conjonction', 'Conjonction']].forEach(function (c) {
      var pc = a.parCondition[c[0]];
      var pente = function (x) {
        return x.pente !== null ? u.dec(x.pente, 1) + ' ms/élém.' : '—';
      };
      lignes.push([
        c[1],
        pc.exactitude === null ? '—' : Math.round(pc.exactitude * 100) + ' %',
        u.ms(pc.presente.mediane) + (pc.presente.n ? ' (' + pc.presente.n + ')' : ''),
        u.ms(pc.absente.mediane) + (pc.absente.n ? ' (' + pc.absente.n + ')' : ''),
        pente(a.pentes[c[0]].presente),
        pente(a.pentes[c[0]].absente)
      ]);
    });
    return u.el('div', {}, [
      u.UI.table(['Condition', 'Exactitude', 'Cible présente', 'Cible absente',
        'Pente (présente)', 'Pente (absente)'], lignes),
      u.el('div', { class: 'hint', style: { marginTop: '8px' }, html:
        'Entre parenthèses, le nombre d’essais justes qui soutiennent la médiane. La pente ' +
        '« absente » vaut classiquement environ le double de la pente « présente » en conjonction : ' +
        'conclure à l’absence oblige à examiner tous les éléments, alors qu’on trouve en moyenne à ' +
        'mi-parcours.' })
    ]);
  }

})();
