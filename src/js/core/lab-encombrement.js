/* ============================================================
   Vision Lab — l'encombrement
   ------------------------------------------------------------
   Une lettre isolée en périphérie se lit sans peine. Entourée de
   voisines, elle devient illisible — alors qu'elle n'a pas changé
   de taille, ni de contraste, ni de position. Ce n'est donc pas
   un problème de résolution : c'est que le système visuel n'arrive
   plus à isoler l'objet de ce qui l'entoure.

   Ce qui rend le phénomène mesurable, c'est qu'il obéit à une
   règle simple. L'espacement en dessous duquel les voisines
   gênent — l'espacement critique — vaut environ la MOITIÉ DE
   L'EXCENTRICITÉ, et ne dépend pas de la taille des lettres.
   C'est la loi de Bouma. Deux lettres séparées de 1° se gênent
   à 5° d'excentricité, et pas du tout à 1°.

   Pourquoi cela intéresse une orthoptiste plus qu'un curieux :

     · c'est le phénomène d'entassement. Un optotype isolé donne
       une meilleure acuité qu'une ligne serrée, et l'écart n'est
       pas un artefact de mesure : c'est une propriété de la
       vision. D'où l'importance de dire SUR QUELLE ÉCHELLE une
       acuité a été prise ;

     · l'amblyope s'effondre sur une échelle serrée bien plus que
       sur des optotypes isolés — son espacement critique est
       élargi. C'est un des signes qui séparent une amblyopie
       d'une simple baisse d'acuité ;

     · en fixation excentrique — maculopathie, scotome central —
       la lecture reste lente même quand l'acuité résiduelle
       suffirait. L'encombrement en est la cause principale : les
       lettres voisines empêchent d'isoler celle qu'on lit.

   ------------------------------------------------------------
   Le protocole

   Cible : un anneau de Landolt, l'optotype normalisé. Sa brisure
   regarde en haut, à droite, en bas ou à gauche — quatre choix,
   quatre flèches du clavier. On répond au hasard une fois sur
   quatre, pas une sur deux : le seuil se lit donc plus haut.

   Flanqueurs : deux autres anneaux, alignés RADIALEMENT — l'un
   vers la fixation, l'autre vers l'extérieur. C'est la
   configuration où l'encombrement est le plus fort, et celle sur
   laquelle la constante de 0,5 a été établie.

   Taille : elle SUIT l'excentricité. L'acuité se dégrade en
   périphérie — l'angle minimum de résolution double environ tous
   les 2,5° — et une lettre de taille fixe serait illisible à 10°
   pour une raison qui n'a rien à voir avec l'encombrement. On
   prend donc quatre fois la taille du seuil d'acuité attendu à
   cette excentricité. Des essais SANS flanqueur, glissés dans la
   série, vérifient que ce choix tient : si la cible isolée n'est
   pas lue, la mesure ne vaut rien et le rapport le dit.

   Présentation brève (200 ms) : le temps d'une saccade. Sans
   cela, l'œil va se poser sur la cible, l'excentricité tombe à
   zéro et il n'y a plus rien à mesurer.

   Un escalier par excentricité, entrelacés au hasard : le sujet
   ne peut pas anticiper la difficulté de l'essai suivant.
   ============================================================ */
(function () {
  'use strict';

  /* Blanc cassé sur gris très sombre : on mesure un espacement, pas un
     contraste. Le contraste doit donc être franc et hors de question. */
  var COULEURS = { fond: '#101216', trait: '#e9eff6', fixation: '#8fa3b8' };

  var EXCENTRICITES = [2.5, 5, 10];

  /* L'angle minimum de résolution au centre, en degrés : une minute d'arc,
     soit le fameux 10/10. */
  var MAR0 = 1 / 60;
  /* L'excentricité à laquelle l'acuité a déjà perdu la moitié. La valeur
     usuelle est autour de 2,5° pour la reconnaissance de forme. */
  var E2 = 2.5;
  /* Combien de fois le seuil d'acuité : quatre, pour que la cible isolée
     soit lue sans effort et que ce qu'on mesure soit bien l'encombrement. */
  var FACTEUR = 4;

  /* Le diamètre de l'anneau à une excentricité donnée. */
  function tailleDeg(exc, facteur) {
    return (facteur || FACTEUR) * 5 * MAR0 * (1 + exc / E2);
  }

  /* Un anneau ne peut pas approcher son voisin de plus que sa propre
     taille, sinon ils se touchent : c'est le plancher physique. */
  function bornes(exc, facteur) {
    var t = tailleDeg(exc, facteur);
    return {
      /* Plafond : 0,9 × l'excentricité. Au-delà, le flanqueur interne
         tomberait sur le point de fixation ou de l'autre côté. */
      max: 0.9 * exc,
      min: Math.max(0.15 * exc, 1.15 * t)
    };
  }

  var ORIENTATIONS = [
    { val: 0, touche: 'arrowup', label: 'brisure en haut', angle: -Math.PI / 2 },
    { val: 1, touche: 'arrowright', label: 'brisure à droite', angle: 0 },
    { val: 2, touche: 'arrowdown', label: 'brisure en bas', angle: Math.PI / 2 },
    { val: 3, touche: 'arrowleft', label: 'brisure à gauche', angle: Math.PI }
  ];

  /* ------------------------------------------------------------
     Fabriquer un essai
     ------------------------------------------------------------ */
  function fabriquer(exc, espacement, isole, rnd, p, escalierId, entrainement) {
    var taille = tailleDeg(exc, p.facteurTaille);
    var cible = Math.floor(rnd() * 4);
    var cote = rnd() < 0.5 ? -1 : 1;      /* −1 à gauche, +1 à droite */
    /* Les flanqueurs prennent une orientation au hasard, indépendamment de
       la cible : s'ils l'évitaient, leur seule identité renseignerait. */
    var flancs = [Math.floor(rnd() * 4), Math.floor(rnd() * 4)];
    return {
      excentricite: exc,
      espacement: isole ? null : espacement,
      isole: !!isole,
      cote: cote,
      taille: taille,
      cible: cible,
      flancs: flancs,
      escalier: escalierId,
      entrainement: !!entrainement
    };
  }

  window.Lab.definir({
    id: 'encombrement',
    version: 1,
    nom: 'Encombrement',
    court: 'Pourquoi une lettre isolée se lit, et la même entourée non',
    ue: ['UE05', 'UE04', 'UE13'],
    couleurs: COULEURS,
    excentricites: EXCENTRICITES,

    calibration: { requise: true, pleinEcran: true },
    /* Un œil à la fois : l'encombrement est l'un des rares phénomènes où
       les deux yeux d'une même personne peuvent franchement différer —
       c'est justement ce qui le rend intéressant en amblyopie. */
    monoculaire: true,

    defauts: {
      excentricites: EXCENTRICITES,
      facteurTaille: FACTEUR,
      inversions: 8,          /* par escalier, avant de le déclarer fini */
      maxEssais: 40,          /* garde-fou : un escalier qui n'accroche pas */
      partIsoles: 6,          /* un essai sur six est sans flanqueur */
      entrainement: 8,
      fixationMs: 400,
      stimulusMs: 200,        /* plus court qu'une saccade volontaire */
      pauseMs: 300
    },

    modes: {
      /* La démonstration s’en tient à 5° : elle doit tenir sur tous les
         écrans, quitte à donner une droite moins bien tenue. La mesure,
         elle, va jusqu’à 10° — et prévient quand l’écran ne suit pas. */
      demo: { excentricites: [2.5, 5], inversions: 5, maxEssais: 22, entrainement: 5 },
      mesure: { excentricites: EXCENTRICITES, inversions: 8, maxEssais: 40, entrainement: 8 },
      perso: {}
    },

    reponses: ORIENTATIONS.map(function (o) {
      return { touche: o.touche, val: o.val, label: o.label };
    }),
    orientations: ORIENTATIONS,

    mesures: ['espacement critique', 'excentricité', 'exactitude', 'exactitude sur cible isolée'],

    colonnes: [
      { nom: 'excentricite_deg', val: function (e) { return arrondi(e.excentricite, 2); } },
      { nom: 'espacement_deg', val: function (e) { return e.espacement === null ? '' : arrondi(e.espacement, 3); } },
      { nom: 'isole', val: function (e) { return e.isole; } },
      { nom: 'taille_deg', val: function (e) { return arrondi(e.taille, 3); } },
      { nom: 'cote', val: function (e) { return e.cote < 0 ? 'gauche' : 'droite'; } },
      { nom: 'orientation_cible', val: function (e) { return ORIENTATIONS[e.cible].label; } },
      { nom: 'escalier', val: function (e) { return e.escalier || ''; } }
    ],

    /* ------------------------------------------------------------
       Les escaliers : un par excentricité
       ------------------------------------------------------------ */
    escaliers: function (p, escalier) {
      var out = {};
      (p.excentricites || EXCENTRICITES).forEach(function (exc) {
        var b = bornes(exc, p.facteurTaille);
        out['e' + exc] = escalier({
          id: 'e' + exc,
          /* On part large : la cible doit d'abord être facile, sinon le
             sujet doute de la consigne au lieu de doute de sa vision. */
          depart: Math.log(b.max) / Math.LN10,
          min: Math.log(b.min) / Math.LN10,
          max: Math.log(b.max) / Math.LN10,
          dur: -1,                 /* difficile = espacement plus petit */
          pas: 0.1,                /* un facteur 1,26 */
          pasFin: 0.05,            /* puis 1,12, une fois le seuil approché */
          reduireApres: 2,
          descend: 2, monte: 1,    /* deux bonnes on durcit, une fausse on relâche */
          stop: p.inversions,
          maxEssais: p.maxEssais
        });
      });
      return out;
    },

    /* ------------------------------------------------------------
       L'entraînement, tiré d'avance : cible isolée puis largement
       espacée, pour que la consigne s'installe avant de mesurer.
       ------------------------------------------------------------ */
    essais: function (p, rnd) {
      var excs = p.excentricites || EXCENTRICITES;
      var n = p.entrainement === undefined ? 8 : p.entrainement;
      var out = [];
      for (var i = 0; i < n; i++) {
        var exc = excs[i % excs.length];
        var b = bornes(exc, p.facteurTaille);
        /* La moitié isolés, la moitié à l'espacement le plus large. */
        out.push(fabriquer(exc, b.max, i % 2 === 0, rnd, p, null, true));
      }
      return out;
    },

    /* ------------------------------------------------------------
       La suite, décidée après chaque réponse
       ------------------------------------------------------------ */
    prolonger: function (s, rnd, outils, dernier) {
      var p = s.params;
      /* Le moteur désigne l'essai qui vient d'être passé : on ne le déduit
         pas des réponses, puisque l'entraînement n'en laisse aucune. */
      var e = dernier ? dernier.essai : null;

      /* On fait avancer l'escalier de l'essai qu'on vient de répondre — sauf
         s'il s'agissait d'un entraînement ou d'un essai isolé, qui ne sert
         qu'à vérifier que la cible est lisible seule. */
      if (e && !e.entrainement && !e.isole && e.escalier && s.escaliers[e.escalier]) {
        outils.avancer(s.escaliers[e.escalier], dernier.juste);
      }

      var vivants = Object.keys(s.escaliers).filter(function (k) {
        return !s.escaliers[k].fini;
      });
      if (!vivants.length) return null;      /* tout est mesuré : on s'arrête */

      /* On entrelace : l'escalier suivant est tiré au sort parmi ceux qui
         tournent encore. Les prendre l'un après l'autre laisserait le sujet
         s'installer dans une excentricité, et l'apprentissage se mélangerait
         à la mesure. */
      var esc = s.escaliers[vivants[Math.floor(rnd() * vivants.length)]];
      var exc = Number(esc.id.slice(1));

      /* Un essai sur `partIsoles` se passe de flanqueurs : c'est le contrôle
         qui dit si la taille choisie était lisible. Sans lui, un seuil
         d'encombrement pourrait n'être qu'un seuil d'acuité déguisé. */
      var part = p.partIsoles || 6;
      var isole = rnd() < 1 / part;

      return fabriquer(exc, outils.valeur(esc), isole, rnd, p, esc.id, false);
    },

    juste: function (essai, reponse) { return essai.cible === reponse; },

    /* ------------------------------------------------------------
       L'analyse
       ------------------------------------------------------------ */
    analyser: function (s, st) {
      var reps = s.reponses.filter(function (r) { return !s.essais[r.i].entrainement; });
      if (!reps.length) return null;

      var justes = reps.filter(function (r) { return r.juste; }).length;
      var isoles = reps.filter(function (r) { return s.essais[r.i].isole; });
      var isolesJustes = isoles.filter(function (r) { return r.juste; }).length;

      /* Le seuil de chaque escalier, avec ce qui permet d'en douter. */
      var parExc = [];
      Object.keys(s.escaliers || {}).forEach(function (k) {
        var esc = s.escaliers[k];
        var exc = Number(k.slice(1));
        var sl = st.seuil(esc);
        var b = bornes(exc, s.params.facteurTaille);
        parExc.push({
          excentricite: exc,
          taille: tailleDeg(exc, s.params.facteurTaille),
          espacement: sl.valeur,
          log: sl.log,
          inversions: esc.inversions.length,
          essais: esc.n,
          fini: esc.fini,
          /* Un escalier collé à sa borne n'a pas mesuré un seuil : il a
             mesuré la borne. Le dire vaut mieux qu'un chiffre net et faux.

             On regarde le TEMPS passé sur la borne, et non la moyenne des
             inversions. Un escalier coincé au plafond n'y reste pas : il
             alterne avec des excursions vers le bas, si bien que sa moyenne
             tombe 6 à 18 % sous la borne — c'est ce qui faisait échouer le
             premier critère essayé ici. Sur observateurs simulés, le temps
             passé au plafond sépare franchement les deux cas : 5 à 21 %
             quand la mesure est valable, 32 à 79 % quand le seuil est hors
             d'atteinte. La proximité du seuil sert de second filet. */
          auPlafond: partAuBord(esc, esc.max) >= 0.30 ||
            (sl.valeur !== null && sl.valeur > b.max * 0.90),
          auPlancher: partAuBord(esc, esc.min) >= 0.30 ||
            (sl.valeur !== null && sl.valeur < b.min * 1.10),
          rapport: sl.valeur === null ? null : sl.valeur / exc,
          dispersion: sl.ecartType
        });
      });
      parExc.sort(function (a, b2) { return a.excentricite - b2.excentricite; });

      /* La loi de Bouma : l'espacement critique croît proportionnellement à
         l'excentricité. La pente de cette droite EST la constante de Bouma. */
      var points = parExc.filter(function (c) {
        return c.espacement !== null && !c.auPlafond && !c.auPlancher;
      }).map(function (c) { return { x: c.excentricite, y: c.espacement }; });
      var droite = points.length >= 2 ? st.pente(points) : { pente: null, n: points.length };

      var rapports = parExc.filter(function (c) { return c.rapport !== null; })
        .map(function (c) { return c.rapport; });
      var bouma = rapports.length ? st.moyenne(rapports) : null;

      /* ---- ce qui rend la lecture douteuse ---- */
      var avert = [];
      var exactIsole = isoles.length ? isolesJustes / isoles.length : null;
      if (isoles.length < 4) {
        avert.push('Seulement ' + isoles.length + ' essai(s) sans flanqueur : trop peu pour ' +
          'garantir que la cible était lisible seule.');
      } else if (exactIsole < 0.75) {
        avert.push('Cible isolée reconnue ' + Math.round(exactIsole * 100) + ' % du temps : ' +
          'la taille choisie est trop petite pour vous, et les seuils ci-dessous mesurent alors ' +
          'votre acuité périphérique autant que l’encombrement. Augmentez le facteur de taille.');
      }
      parExc.forEach(function (c) {
        if (c.espacement === null) {
          avert.push('À ' + fr(c.excentricite) + '° : pas assez d’inversions pour un seuil (' +
            c.inversions + ').');
        } else if (c.auPlafond) {
          avert.push('À ' + fr(c.excentricite) + ' °, l’escalier est resté collé au plus grand ' +
            'espacement possible : votre espacement critique dépasse ce que cette excentricité ' +
            'permet d’afficher. Le seuil est un minimum, pas une mesure.');
        } else if (c.auPlancher) {
          avert.push('À ' + fr(c.excentricite) + ' °, l’escalier est descendu jusqu’au contact des ' +
            'anneaux : l’encombrement n’a pas été atteint avant la limite physique.');
        } else if (!c.fini) {
          avert.push('À ' + fr(c.excentricite) + ' ° : escalier interrompu avant la fin (' +
            c.inversions + ' inversions sur ' + s.params.inversions + ').');
        }
      });
      if (droite.pente !== null && droite.pente < 0) {
        avert.push('L’espacement critique DIMINUE avec l’excentricité, ce qui est l’inverse du ' +
          'phénomène. Avec ce nombre d’essais, c’est le plus souvent du bruit.');
      }

      return {
        n: reps.length,
        justes: justes,
        exactitude: justes / reps.length,
        isoles: isoles.length,
        exactitudeIsole: exactIsole,
        parExcentricite: parExc,
        droite: droite,
        bouma: bouma,
        oeil: s.oeil || null,
        avertissements: avert
      };
    },

    /* ------------------------------------------------------------
       L'explication, écrite à partir des chiffres obtenus
       ------------------------------------------------------------ */
    expliquer: function (a) {
      if (!a) return [];
      var out = [];
      var deg = function (x) { return x === null || x === undefined ? '—' : fr(arrondi(x, 2)) + '°'; };

      var mesures = a.parExcentricite.filter(function (c) {
        return c.espacement !== null && !c.auPlafond && !c.auPlancher;
      });

      if (mesures.length) {
        out.push({
          t: 'Votre espacement critique',
          p: mesures.map(function (c) {
            return 'à <b>' + fr(c.excentricite) + '°</b> d’excentricité, <b>' + deg(c.espacement) + '</b>';
          }).join(' ; ') + '. ' +
            'C’est la distance en dessous de laquelle les anneaux voisins vous ont empêché de voir ' +
            'la brisure — alors que la cible, elle, n’avait pas changé.'
        });
      }

      if (a.bouma !== null && mesures.length) {
        var b = a.bouma;
        out.push({
          t: 'La loi de Bouma',
          p: 'Rapporté à l’excentricité, votre espacement critique vaut en moyenne <b>' +
             fr(arrondi(b, 2)) + ' fois</b> celle-ci' +
             (a.droite.pente !== null
               ? ', et la droite ajustée sur vos points a une pente de <b>' +
                 fr(arrondi(a.droite.pente, 2)) + '</b>'
               : '') + '. ' +
             (b > 0.3 && b < 0.75
               ? 'C’est la valeur classique — autour de 0,5. Elle dit quelque chose de fort : ' +
                 'l’encombrement ne dépend pas de la taille des lettres, mais seulement de l’endroit ' +
                 'de la rétine où on les regarde. Deux lettres séparées d’un degré se gênent à 5° ' +
                 'et pas du tout à 1°.'
               : b <= 0.3
                 ? 'C’est plus serré que la valeur classique de 0,5 : vous isolez mieux que la moyenne, ' +
                   'ou la présentation a été assez longue pour qu’un début de saccade ramène la cible ' +
                   'vers le centre.'
                 : 'C’est plus large que la valeur classique de 0,5 : vos voisines gênent de plus loin ' +
                   'que la moyenne. Avec peu d’essais, une fixation instable suffit à produire cela.')
        });
      }

      if (a.exactitudeIsole !== null && a.isoles >= 4) {
        out.push({
          t: 'La cible, seule',
          p: 'Sans flanqueur, vous avez reconnu la brisure <b>' +
             Math.round(a.exactitudeIsole * 100) + ' %</b> du temps' +
             (a.exactitudeIsole >= 0.85
               ? '. La cible était donc parfaitement lisible : ce qui vous a gêné plus haut, ' +
                 'ce n’est pas sa taille, ce sont ses voisines. C’est tout l’argument — ' +
                 'l’encombrement n’est pas un problème de résolution.'
               : '. C’est peu : une partie de la difficulté venait de la cible elle-même, ' +
                 'pas seulement de ses voisines.')
        });
      }

      out.push({
        t: 'Ce que cela change en pratique',
        p: 'C’est le <b>phénomène d’entassement</b> : un optotype isolé donne une meilleure acuité ' +
           'qu’une ligne serrée, et l’écart n’est pas un défaut de mesure — c’est une propriété de la ' +
           'vision. D’où l’importance de préciser sur quelle échelle une acuité a été prise. ' +
           'Chez l’amblyope, cet espacement critique est <b>élargi</b> : il s’effondre sur une ligne ' +
           'serrée bien plus que sur des optotypes isolés, et l’écart entre les deux est un signe ' +
           'en soi. En fixation excentrique — scotome central, maculopathie — c’est encore ' +
           'l’encombrement qui ralentit la lecture, plus que l’acuité résiduelle.' +
           (a.oeil ? ' Mesure faite <b>' + libelleOeil(a.oeil) + '</b> : refaites-la sur l’autre œil, ' +
             'la comparaison est ce qui a le plus de valeur clinique.' : '')
      });

      return out;
    }
  });

  /* La fraction des essais passés collés à une borne. */
  function partAuBord(esc, borne) {
    if (!esc || !esc.niveaux || !esc.niveaux.length) return 0;
    var n = esc.niveaux.filter(function (x) {
      return Math.abs(x.niveau - borne) < 1e-9;
    }).length;
    return n / esc.niveaux.length;
  }

  /* ---- deux commodités d'écriture ---- */
  function arrondi(x, n) { var f = Math.pow(10, n); return Math.round(x * f) / f; }
  function fr(x) { return String(x).replace('.', ','); }
  function libelleOeil(o) {
    return o === 'od' ? 'œil droit' : o === 'og' ? 'œil gauche' : 'les deux yeux ouverts';
  }

  /* ============================================================
     La moitié « écran »
     ------------------------------------------------------------
     Ce qui précède mesure ; ce qui suit montre.
     ============================================================ */
  Object.assign(window.Lab.def('encombrement'), {
    icone: '🎯',
    champNombres: 'excentricites',
    uniteNombres: 'excentricités',

    duree: function (mode) {
      if (mode === 'perso') return 'variable';
      var p = Object.assign({}, this.defauts, this.modes[mode] || {});
      /* Un escalier demande à peu près trois essais par inversion visée. */
      var n = (p.excentricites || EXCENTRICITES).length * p.inversions * 3 + (p.entrainement || 0);
      return '≈ ' + Math.max(1, Math.round(n * 2.4 / 60)) + ' min';
    },

    /* ------------------------------------------------------------
       Ce que l'écran ne peut pas afficher
       ------------------------------------------------------------
       Le flanqueur externe se pose à (excentricité + espacement) du
       centre. Au plus large, cela fait 1,9 fois l'excentricité. Si
       cela sort de l'écran, l'essai serait tronqué sans que rien ne
       le signale — et un stimulus à moitié affiché produit un seuil
       parfaitement net et parfaitement faux.
       ------------------------------------------------------------ */
    obstacles: function (p) {
      var ppd = window.LabCalib.pxParDegre();
      if (!ppd) return [];
      var excs = (p && p.excentricites) || EXCENTRICITES;
      var maxExc = Math.max.apply(null, excs);
      var besoin = (1.9 * maxExc + tailleDeg(maxExc, (p && p.facteurTaille)) / 2) * ppd;
      /* Les flanqueurs sont posés HORIZONTALEMENT de part et d’autre de la
         fixation : c’est la largeur qui contraint, pas la hauteur. */
      var moitie = window.screen.width / 2;
      if (besoin > moitie) {
        /* Se RAPPROCHER, et non s’éloigner : les pixels par degré sont
           proportionnels à la distance — 1° couvre 5,2 mm à 30 cm et 10,5 mm
           à 60 cm. Plus on est près, plus il tient de degrés à l’écran. */
        var possible = Math.floor((moitie / ppd - 1) / 1.95 * 2) / 2;
        return ['À ' + fr(maxExc) + '° d’excentricité, le flanqueur externe sortirait de l’écran : ' +
          'il faudrait ' + Math.round(besoin) + ' px de chaque côté de la fixation, l’écran en offre ' +
          Math.round(moitie) + '. Cet écran tient jusqu’à environ ' + fr(possible) + '°. ' +
          'Rapprochez-vous de l’écran — cela réduit les pixels par degré, donc élargit le champ ' +
          'disponible — puis recalibrez ; ou retirez cette excentricité dans le mode personnalisé.'];
      }
      return [];
    },

    presentation: function (u) {
      return u.el('div', {}, [
        u.el('p', { html:
          'Une lettre isolée en périphérie se lit sans peine. <b>Entourée de voisines, elle devient ' +
          'illisible</b> — alors qu’elle n’a changé ni de taille, ni de contraste, ni de place. Ce n’est ' +
          'donc pas un problème de résolution : c’est que le système visuel n’arrive plus à isoler ' +
          'l’objet de ce qui l’entoure.' }),
        u.el('p', { html:
          'Le phénomène obéit à une règle simple, et c’est elle qu’on mesure ici. L’espacement en ' +
          'dessous duquel les voisines gênent — l’<b>espacement critique</b> — vaut environ la ' +
          '<b>moitié de l’excentricité</b>, et ne dépend pas de la taille des lettres. C’est la loi de ' +
          'Bouma : deux lettres séparées d’un degré se gênent à 5° du point de fixation, et pas du tout ' +
          'à 1°.' }),
        u.el('p', { class: 'hint', html:
          'C’est le <b>phénomène d’entassement</b> : un optotype isolé donne une meilleure acuité qu’une ' +
          'ligne serrée. Chez l’amblyope, l’espacement critique est élargi — d’où un effondrement sur ' +
          'une échelle serrée bien plus marqué que sur des optotypes isolés. Et en fixation excentrique, ' +
          'c’est lui qui ralentit la lecture, plus que l’acuité résiduelle.' })
      ]);
    },

    consigne: function (p, u) {
      var UI2 = u.UI;
      return [
        UI2.card('La tâche', u.el('div', {}, [
          u.el('p', { html:
            'Fixez la croix au centre et <b>n’en bougez pas les yeux</b>. Un anneau apparaît sur le ' +
            'côté, brièvement. Il porte une <b>brisure</b> — en haut, à droite, en bas ou à gauche : ' +
            'dites laquelle avec les flèches.' }),
          u.el('p', { html:
            'La plupart du temps, deux autres anneaux l’encadrent. Ce sont eux qui vont vous gêner, et ' +
            'c’est précisément ce qu’on mesure : à quelle distance ils cessent de le faire.' }),
          u.el('p', { class: 'hint', html:
            'L’affichage dure <b>' + (p.stimulusMs || 200) + ' ms</b>, moins qu’une saccade. Regarder ' +
            'vers l’anneau ne servirait à rien : il aura disparu, et l’excentricité — ce qu’on mesure — ' +
            'serait tombée à zéro. Répondez au jugé quand vous doutez : c’est prévu, l’escalier s’ajuste.' })
        ])),
        UI2.card('Ce que vous allez voir', u.el('div', {}, [
          u.el('div', { class: 'grid g2', style: { gap: '12px' } }, [
            u.el('div', {}, [
              u.el('div', { class: 'hint', style: { marginBottom: '6px' },
                text: 'Seul — facile' }),
              vignette(true)
            ]),
            u.el('div', {}, [
              u.el('div', { class: 'hint', style: { marginBottom: '6px' },
                text: 'Encadré de près — c’est là que ça se joue' }),
              vignette(false)
            ])
          ]),
          u.el('p', { class: 'hint', style: { marginTop: '10px' }, html:
            'Sur ces deux images, l’anneau du milieu est le même. Regardez la croix, pas l’anneau : ' +
            'la différence saute alors aux yeux.' })
        ]))
      ];
    },

    /* ---------------- Le dessin ---------------- */
    dessiner: function (ctx, essai, geo, u) {
      /* Le fond ET la croix : la fixation reste visible pendant l'affichage,
         sinon rien ne retient le regard au centre. */
      u.fixation(ctx);
      var cx = geo.l / 2, cy = geo.h / 2;
      var D = u.degVersPx(essai.taille);
      var poser = function (excDeg, orientation) {
        anneau(ctx, cx + essai.cote * u.degVersPx(excDeg), cy, D, orientation, u.couleurs.trait);
      };
      if (!essai.isole) {
        /* Radialement : un flanqueur vers la fixation, un vers l’extérieur. */
        poser(essai.excentricite - essai.espacement, essai.flancs[0]);
        poser(essai.excentricite + essai.espacement, essai.flancs[1]);
      }
      poser(essai.excentricite, essai.cible);
    },

    rendu: function (geo, p) {
      var excs = (p && p.excentricites) || EXCENTRICITES;
      return {
        excentricitesDeg: excs.join(', '),
        tailleAnneauxDeg: excs.map(function (e) {
          return arrondi(tailleDeg(e, p && p.facteurTaille), 2);
        }).join(', '),
        stimulusMs: (p && p.stimulusMs) || 200
      };
    },

    /* Un escalier ne sait pas d’avance combien d’essais il fera : on montre
       la part d’inversions déjà obtenues plutôt qu’un compte trompeur. */
    avancement: function (s) {
      var ks = Object.keys(s.escaliers || {});
      if (!ks.length) return null;
      var t = 0;
      ks.forEach(function (k) {
        var e = s.escaliers[k];
        t += e.fini ? 1 : Math.min(1, e.inversions.length / e.stop);
      });
      return t / ks.length;
    },

    /* ---------------- Le mode personnalisé ---------------- */
    reglages: function (p, maj, u) {
      var UI2 = u.UI;
      var TOUTES = [1.5, 2.5, 4, 5, 7.5, 10, 14];
      var cases = u.el('div', { class: 'btn-row' }, TOUTES.map(function (x) {
        var actif = p.excentricites.indexOf(x) >= 0;
        var b = UI2.btn(fr(x) + '°', function () {
          var i = p.excentricites.indexOf(x);
          if (i >= 0) {
            if (p.excentricites.length <= 2) {
              UI2.toast('Il faut au moins deux excentricités pour une droite'); return;
            }
            p.excentricites.splice(i, 1);
          } else p.excentricites.push(x);
          p.excentricites.sort(function (m, n) { return m - n; });
          b.classList.toggle('primary');
          maj();
        }, actif ? 'primary' : '');
        return b;
      }));
      return u.el('div', {}, [
        UI2.field('Excentricités', cases,
          'À quelle distance du point de fixation la cible apparaît. Deux au minimum : ' +
          'c’est la pente entre elles qui donne la constante de Bouma.'),
        UI2.field('Taille des anneaux', UI2.num(p.facteurTaille, function (v) {
          p.facteurTaille = Math.max(2, Math.min(10, v || 4)); maj();
        }, { min: 2, max: 10, step: 0.5 }),
          'En multiples du seuil d’acuité attendu à chaque excentricité. Quatre par défaut : ' +
          'assez grand pour que la cible isolée se lise sans effort. Descendre sous trois, c’est ' +
          'risquer de mesurer une acuité au lieu d’un encombrement.'),
        UI2.field('Inversions par escalier', UI2.num(p.inversions, function (v) {
          p.inversions = Math.max(4, Math.min(14, v || 8)); maj();
        }, { min: 4, max: 14, step: 1 }),
          'Plus il y en a, plus le seuil est stable — et plus c’est long. Les deux premières ' +
          'sont écartées du calcul.'),
        UI2.field('Essais d’entraînement', UI2.num(p.entrainement, function (v) {
          p.entrainement = Math.max(2, Math.min(20, v || 8)); maj();
        }, { min: 2, max: 20, step: 1 }), 'Non mesurés.')
      ]);
    },

    apercu: function (p) {
      var n = p.excentricites.length * p.inversions * 3;
      return '<b>≈ ' + n + ' essais mesurés</b> (' + p.excentricites.length + ' escaliers × ' +
        p.inversions + ' inversions), plus ' + p.entrainement + ' d’entraînement. Environ ' +
        Math.max(1, Math.round(n * 2.4 / 60)) + ' minutes. Le compte exact dépend de vos réponses.' +
        (p.excentricites.length < 3
          ? '<br><span style="color:var(--amber)">Avec deux excentricités, la droite passe ' +
            'exactement par les deux points : elle ne peut pas être vérifiée.</span>' : '') +
        (p.facteurTaille < 3
          ? '<br><span style="color:var(--amber)">Des anneaux aussi petits risquent d’être ' +
            'illisibles même isolés : vous mesureriez une acuité.</span>' : '');
    },

    /* ---------------- Le rapport ---------------- */
    resume: function (a, u) {
      if (!a) return '—';
      return a.bouma === null ? Math.round(a.exactitude * 100) + ' %'
        : 'Bouma ' + u.dec(a.bouma, 2);
    },

    rapport: function (a, s, u) {
      if (!a) return [];
      var UI2 = u.UI;
      var lignes = a.parExcentricite.map(function (c) {
        return [
          fr(arrondi(c.excentricite, 2)) + '°',
          fr(arrondi(c.taille, 2)) + '°',
          c.espacement === null ? '—' : fr(arrondi(c.espacement, 2)) + '°' +
            (c.auPlafond ? ' (au plafond)' : c.auPlancher ? ' (au plancher)' : ''),
          c.rapport === null ? '—' : u.dec(c.rapport, 2),
          c.inversions + ' / ' + s.params.inversions,
          String(c.essais)
        ];
      });

      return [
        UI2.card('En bref', u.el('div', { class: 'grid g4' }, [
          UI2.stat(a.bouma === null ? '—' : u.dec(a.bouma, 2), 'constante de Bouma',
            a.bouma !== null && a.bouma > 0.3 && a.bouma < 0.75 ? 'var(--green)' : 'var(--amber)'),
          UI2.stat(Math.round(a.exactitude * 100) + ' %', 'exactitude globale'),
          UI2.stat(a.exactitudeIsole === null ? '—' : Math.round(a.exactitudeIsole * 100) + ' %',
            'cible isolée',
            a.exactitudeIsole !== null && a.exactitudeIsole >= 0.85 ? 'var(--green)' : 'var(--amber)'),
          UI2.stat(a.n, 'essais mesurés')
        ])),

        UI2.card('Votre espacement critique', u.el('div', {}, [
          UI2.table(['Excentricité', 'Anneau', 'Espacement critique', 'Rapport à l’excentricité',
            'Inversions', 'Essais'], lignes),
          graphe(a, u),
          u.el('div', { class: 'hint', style: { marginTop: '8px' }, html:
            'L’<b>espacement critique</b> est la distance de centre à centre en dessous de laquelle ' +
            'les anneaux voisins vous ont empêché de voir la brisure. Le <b>rapport</b> est cet ' +
            'espacement divisé par l’excentricité : c’est lui qui devrait tourner autour de 0,5 quelle ' +
            'que soit la distance au centre.' })
        ]))
      ];
    },

    comparer: function (a, ab, s, b, u) {
      var UI2 = u.UI;
      var memeOeil = (s.oeil || null) === (b.oeil || null);
      var v = function (x, n) { return x === null || x === undefined ? '—' : u.dec(x, n); };
      var lignes = [
        ['Constante de Bouma', v(ab.bouma, 2), v(a.bouma, 2)],
        ['Exactitude', ab.exactitude === null ? '—' : Math.round(ab.exactitude * 100) + ' %',
          a.exactitude === null ? '—' : Math.round(a.exactitude * 100) + ' %'],
        ['Cible isolée', ab.exactitudeIsole === null ? '—' : Math.round(ab.exactitudeIsole * 100) + ' %',
          a.exactitudeIsole === null ? '—' : Math.round(a.exactitudeIsole * 100) + ' %']
      ];
      /* Le seuil, excentricité par excentricité, quand les deux protocoles
         portent sur les mêmes. */
      a.parExcentricite.forEach(function (c) {
        var autre = ab.parExcentricite.filter(function (x) {
          return x.excentricite === c.excentricite;
        })[0];
        if (!autre) return;
        lignes.push(['Seuil à ' + fr(c.excentricite) + '°',
          autre.espacement === null ? '—' : v(autre.espacement, 2) + '°',
          c.espacement === null ? '—' : v(c.espacement, 2) + '°']);
      });
      return u.el('div', {}, [
        UI2.table(['', 'Référence', 'Cette passation'], lignes),
        u.el('div', { class: 'hint', style: { marginTop: '8px' }, html: memeOeil
          ? 'Les deux mesures portent sur le même œil : l’écart entre elles dit surtout la ' +
            'fidélité de la méthode, pas une différence entre vos yeux.'
          : 'Deux yeux comparés. Un espacement critique nettement plus large d’un côté est ' +
            'précisément ce qu’on décrit dans l’amblyopie — mais une seule passation par œil ne ' +
            'suffit pas à l’affirmer : refaites-en une de chaque avant de conclure.' })
      ]);
    }
  });

  /* ------------------------------------------------------------
     Le dessin
     ------------------------------------------------------------ */

  /* Un anneau de Landolt : diamètre D, trait et brisure valant D/5 — les
     proportions normalisées de l'optotype. La brisure sous-tend au centre
     un angle de trait / rayon moyen, soit un demi-radian. */
  function anneau(ctx, cx, cy, D, orientation, couleur) {
    var trait = D / 5;
    var rMoyen = D / 2 - trait / 2;
    var ouverture = trait / rMoyen;
    var theta = ORIENTATIONS[orientation].angle;
    ctx.strokeStyle = couleur;
    ctx.lineWidth = trait;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.arc(cx, cy, rMoyen, theta + ouverture / 2, theta - ouverture / 2 + 2 * Math.PI);
    ctx.stroke();
  }

  /* Une vignette pour la consigne : le même anneau, seul puis encadré. On
     dessine une croix de fixation à gauche pour que la géométrie se comprenne. */
  function vignette(isole) {
    var c = UI.el('canvas', { width: 380, height: 160,
      style: { width: '100%', borderRadius: '10px', display: 'block' } });
    var ctx = c.getContext('2d');
    ctx.fillStyle = COULEURS.fond;
    ctx.fillRect(0, 0, 380, 160);
    var cy = 80, cx = 60;
    ctx.strokeStyle = COULEURS.fixation;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
    ctx.stroke();
    var D = 46, x = 250;
    if (!isole) {
      anneau(ctx, x - 58, cy, D, 3, COULEURS.trait);
      anneau(ctx, x + 58, cy, D, 1, COULEURS.trait);
    }
    anneau(ctx, x, cy, D, 0, COULEURS.trait);
    return c;
  }

  /* L’espacement critique en fonction de l’excentricité. La droite de Bouma
     — la moitié de l’excentricité — est tracée en repère : c’est d’elle que
     l’on s’écarte ou non. */
  function graphe(a, u) {
    var svg = u.svg, el = u.el;
    var pts = a.parExcentricite.filter(function (c) { return c.espacement !== null; });
    if (!pts.length) return u.UI.note('Aucun seuil à tracer.', '');

    var W = 620, H = 300, mg = { g: 56, d: 16, h: 16, b: 46 };
    var maxX = Math.max.apply(null, pts.map(function (c) { return c.excentricite; })) * 1.15;
    var maxY = Math.max(
      Math.max.apply(null, pts.map(function (c) { return c.espacement; })),
      0.5 * maxX) * 1.15;
    var X = function (v) { return mg.g + v / maxX * (W - mg.g - mg.d); };
    var Y = function (v) { return H - mg.b - v / maxY * (H - mg.h - mg.b); };

    var enfants = [];
    var pas = maxY > 8 ? 2 : 1;
    for (var v = 0; v <= maxY; v += pas) {
      enfants.push(svg('line', { x1: mg.g, y1: Y(v), x2: W - mg.d, y2: Y(v),
        stroke: 'var(--line)', 'stroke-width': 1 }));
      enfants.push(svg('text', { x: mg.g - 8, y: Y(v) + 4, 'text-anchor': 'end',
        fill: 'var(--txt-2)', 'font-size': 11 }, fr(v) + '°'));
    }
    pts.forEach(function (c) {
      enfants.push(svg('text', { x: X(c.excentricite), y: H - mg.b + 18,
        'text-anchor': 'middle', fill: 'var(--txt-2)', 'font-size': 11 },
        fr(c.excentricite) + '°'));
    });
    enfants.push(svg('text', { x: (W + mg.g) / 2, y: H - 6, 'text-anchor': 'middle',
      fill: 'var(--txt-2)', 'font-size': 11 }, 'excentricité'));
    enfants.push(svg('text', { x: 14, y: H / 2, 'text-anchor': 'middle',
      fill: 'var(--txt-2)', 'font-size': 11,
      transform: 'rotate(-90 14 ' + (H / 2) + ')' }, 'espacement critique'));

    /* le repère : la moitié de l’excentricité */
    enfants.push(svg('line', { x1: X(0), y1: Y(0), x2: X(maxX), y2: Y(0.5 * maxX),
      stroke: 'var(--txt-3)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }));
    enfants.push(svg('text', { x: X(maxX) - 6, y: Y(0.5 * maxX) - 8, 'text-anchor': 'end',
      fill: 'var(--txt-3)', 'font-size': 11 }, 'la moitié de l’excentricité (Bouma)'));

    /* la droite ajustée sur vos points */
    if (a.droite && a.droite.pente !== null) {
      /* On borne la droite au cadre : une ordonnée à l'origine négative la
         faisait descendre sous l'axe, hors de la zone tracée. */
      var bornee = function (x) {
        return Math.max(0, Math.min(maxY, a.droite.origine + a.droite.pente * x));
      };
      var x1 = 0;
      if (a.droite.pente > 0 && a.droite.origine < 0) {
        x1 = Math.min(maxX, -a.droite.origine / a.droite.pente);
      }
      enfants.push(svg('line', {
        x1: X(x1), y1: Y(bornee(x1)),
        x2: X(maxX), y2: Y(bornee(maxX)),
        stroke: 'var(--accent)', 'stroke-width': 2
      }));
    }

    pts.forEach(function (c) {
      var borne = c.auPlafond || c.auPlancher;
      enfants.push(svg('circle', { cx: X(c.excentricite), cy: Y(c.espacement), r: 5,
        fill: borne ? 'var(--bg)' : 'var(--accent)',
        stroke: borne ? 'var(--amber)' : 'var(--accent)', 'stroke-width': 2 }));
    });

    return el('div', { style: { marginTop: '16px' } }, [
      el('div', { style: { overflowX: 'auto' } },
        svg('svg', { viewBox: '0 0 ' + W + ' ' + H,
          style: 'width:100%;min-width:420px;height:auto;display:block' }, enfants)),
      el('div', { class: 'hint', style: { marginTop: '6px' }, html:
        'Trait plein : la droite ajustée sur vos seuils. Pointillé : la prédiction classique, ' +
        'la moitié de l’excentricité. Un point <b>creux et orangé</b> signale un escalier qui a ' +
        'buté sur une borne — ce n’est pas un seuil, c’est une limite du protocole.' })
    ]);
  }

})();
