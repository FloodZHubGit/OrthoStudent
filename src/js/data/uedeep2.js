/* ============================================================
   Fiches d'UE — couche « examen », semestres 3 à 6
   Même structure que uedeep.js, qu'il complète.
   ============================================================ */
(function () {
  'use strict';
  var D = (window.UE_DEEP = window.UE_DEEP || {});

  /* ============================ SEMESTRE 3 ============================ */

  D.UE24 = {
    tableaux: [
      { t: 'Les trois amblyopies fonctionnelles',
        c: ['Type', 'Mécanisme', 'Signe d’appel', 'Pronostic'],
        r: [
          ['Strabique', 'Neutralisation de l’œil dévié', 'Strabisme unilatéral constant', 'Bon si précoce'],
          ['Anisométropique', 'Image floue en permanence sur un œil', 'Aucun — dépistage seul', 'Bon, souvent tardif au diagnostic'],
          ['De privation', 'Aucune image formée', 'Cataracte, ptôsis, opacité', 'Le plus sombre, urgence']
        ] },
      { t: 'Ce qui est amblyogène',
        c: ['Amétropie', 'Seuil d’alerte'],
        r: [['Anisométropie', '≥ 1,00 à 1,50 D'], ['Astigmatisme', '≥ 1,50 D'],
            ['Hypermétropie', '≥ 3,50 à 4,00 D'], ['Myopie', '≥ 3,00 D'],
            ['Toute opacité des milieux', 'Quelle qu’elle soit']] }
    ],
    cas: {
      t: 'Dépistage à 4 ans',
      s: 'Enfant de 4 ans, aucun signe, aucune plainte. Au dépistage scolaire : OD 10/10, OG 3/10. Pas de strabisme visible, reflets symétriques, cover test négatif.',
      q: ['Quelle hypothèse en premier ?', 'Quel examen est indispensable ?', 'Que craignez-vous si rien n’est fait ?'],
      r: 'Une amblyopie unilatérale sans strabisme oriente d’abord vers une <b>anisométropie</b> : l’enfant voit bien d’un œil, ne se plaint donc de rien, et le trouble reste invisible pour l’entourage. C’est exactement la population que le dépistage de 3-4 ans existe pour attraper. Une microtropie est aussi possible, avec un cover test faussement rassurant.',
      c: 'Réfraction sous cycloplégie, indispensable, puis fond d’œil pour éliminer une cause organique. Sans traitement avant la fin de la période sensible, la perte devient définitive — et c’est le seul œil de secours en cas d’accident sur l’autre.'
    },
    reponse: {
      q: 'Qu’est-ce que l’amblyopie et comment la dépiste-t-on ?',
      p: [
        'Définir : baisse d’acuité par trouble du développement visuel, sans lésion organique proportionnelle ; mécanisme cortical.',
        'Poser la période sensible : maximale de 0 à 2 ans, décroissante jusqu’à 8-10 ans.',
        'Énoncer les trois mécanismes : strabique, anisométropique, de privation.',
        'Décrire le dépistage selon l’âge : signes d’appel du nourrisson, Brückner, regard préférentiel, puis acuité par œil dès 3-4 ans.',
        'Insister sur la mesure en ligne et l’effet de crowding.',
        'Rappeler les amétropies amblyogènes et leurs seuils.',
        'Conclure sur les deux règles absolues : réfraction sous cycloplégie, et fond d’œil devant tout strabisme unilatéral.'
      ]
    },
    mnemo: [
      ['« L’amblyope ne se plaint jamais »', 'Il voit bien d’un œil : seul le dépistage le trouve'],
      ['Période sensible 0-2-8', 'Maximale à 2 ans, refermée vers 8-10 ans']
    ]
  };

  D.UE25 = {
    tableaux: [
      { t: 'Les moyens de pénalisation',
        c: ['Moyen', 'Dosage', 'Indication', 'Limite'],
        r: [
          ['Occlusion adhésive', '2 h/j modérée, 6 h/j sévère', 'Amblyopie profonde', 'Acceptation, peau, coût social'],
          ['Filtre de Bangerter', 'De 1,0 à < 0,1', 'Légère à modérée, entretien', 'Moins puissant'],
          ['Pénalisation optique', 'Surcorrection en plus', 'Modérée, refus du cache', 'Nécessite le port constant'],
          ['Atropine', '1 goutte, rythme adapté', 'Refus d’occlusion', 'Photophobie, surveillance']
        ] },
      { t: 'Ordre du traitement — jamais l’inverse',
        c: ['Étape', 'Durée', 'Pourquoi'],
        r: [
          ['1. Correction optique totale', '4 à 6 semaines', 'Une part de l’amblyopie se corrige seule'],
          ['2. Pénalisation ou occlusion', 'Selon la sévérité', 'Force l’usage de l’œil amblyope'],
          ['3. Sevrage progressif', 'Sur plusieurs mois', 'Limite la récidive'],
          ['4. Surveillance', 'Jusqu’à la fin de la période sensible', 'La récidive est fréquente']
        ] }
    ],
    cas: {
      t: 'Une bascule',
      s: 'Fillette de 5 ans, amblyopie sévère de l’œil gauche traitée par occlusion 6 h/j depuis trois mois. L’œil gauche est passé de 1/10 à 5/10. Mais l’œil droit, occlus, est descendu de 10/10 à 7/10.',
      q: ['Que s’est-il passé ?', 'Est-ce grave ?', 'Que faites-vous ?'],
      r: 'C’est une <b>amblyopie à bascule</b> : l’œil occlus, privé de stimulation à un âge encore plastique, perd à son tour. C’est la complication attendue de l’occlusion forte, et la raison pour laquelle on contrôle l’acuité <b>des deux yeux</b> à chaque consultation.',
      c: 'Réversible si prise tôt. On réduit immédiatement le temps d’occlusion, on rapproche les contrôles, et on surveille la remontée de l’œil droit. On en profite pour vérifier l’observance réelle : une bascule signe souvent une occlusion mieux suivie que prévu.'
    },
    reponse: {
      q: 'Comment traitez-vous une amblyopie fonctionnelle ?',
      p: [
        'Poser le préalable : correction optique totale sous cycloplégie, portée 4 à 6 semaines avant tout autre geste.',
        'Réévaluer : une part de l’amblyopie se corrige par la seule correction.',
        'Choisir le moyen selon la sévérité, l’âge et l’acceptation : occlusion, filtre, pénalisation, atropine.',
        'Doser : 2 h/j si modérée, 6 h/j si sévère, en tenant compte de la vie de l’enfant.',
        'Surveiller les deux yeux à chaque contrôle — risque de bascule.',
        'Sevrer progressivement et non brutalement, pour limiter la récidive.',
        'Poursuivre la surveillance jusqu’à la fin de la période sensible.',
        'Associer la famille : sans adhésion, aucun protocole ne tient.'
      ]
    },
    mnemo: [
      ['Correction — Pénalisation — Sevrage — Surveillance', 'Les quatre temps, dans cet ordre'],
      ['« Toujours les deux yeux »', 'Contrôler l’œil occlus autant que l’œil traité']
    ]
  };

  D.UE26 = {
    tableaux: [
      { t: 'Les grandes causes et ce qu’elles abîment',
        c: ['Pathologie', 'Ce qui est perdu', 'Ce qui reste', 'Levier principal'],
        r: [
          ['DMLA', 'Vision centrale', 'Périphérie, déplacements', 'Grossissement, fixation excentrée'],
          ['Glaucome évolué', 'Périphérie', 'Acuité centrale longtemps', 'Éclairage, contraste, locomotion'],
          ['Rétinopathie pigmentaire', 'Périphérie puis nuit', 'Centre longtemps', 'Contraste, éclairage, locomotion'],
          ['Rétinopathie diabétique', 'Variable, fluctuant', 'Variable', 'Réévaluations rapprochées']
        ] },
      { t: 'Seuils réglementaires',
        c: ['Situation', 'Seuil'],
        r: [['Malvoyance (OMS)', 'AV < 3/10 ou champ < 20°'], ['Cécité (OMS)', 'AV < 1/20'],
            ['Grossissement d’une loupe', 'G = P / 4'], ['Éclairage utile', '3 à 5 × le standard']] }
    ],
    cas: {
      t: 'Choisir la bonne aide',
      s: 'Homme de 80 ans, DMLA atrophique bilatérale, AV 1/10 aux deux yeux. Il souhaite avant tout continuer à lire son journal et ses factures.',
      q: ['Quel grossissement viser ?', 'Quelle aide proposer ?', 'Quel compromis expliquer ?'],
      r: 'On part de la taille lue et de la taille visée. Avec 1/10, il faut environ un facteur 5 à 6 pour un texte de journal, majoré d’une marge de confort. Une loupe de +24 D donne G = 24/4 = 6 ×.',
      c: 'Plutôt qu’une seule aide : une loupe éclairante à main pour les courtes lectures (factures, étiquettes), et un système sur support ou un agrandisseur électronique pour le journal, qui demande de la durée. Le compromis à expliquer d’emblée : plus le grossissement monte, plus la distance de travail et le champ perçu se réduisent — d’où le choix par tâche.'
    },
    reponse: {
      q: 'Comment conduisez-vous un bilan de basse vision ?',
      p: [
        'Commencer par les besoins : ce que la personne veut refaire, concrètement et par ordre de priorité.',
        'Mesurer l’acuité de loin et de près sur des échelles adaptées aux basses acuités.',
        'Explorer ce que l’acuité ne dit pas : sensibilité aux contrastes, éblouissement, champ visuel.',
        'Rechercher et localiser le scotome, évaluer la fixation et son excentration éventuelle.',
        'Déterminer le grossissement nécessaire à partir de la taille lue et de la taille visée.',
        'Essayer les aides en situation réelle, pas sur une échelle : le journal du patient, ses factures.',
        'Travailler les leviers non optiques : éclairage, contraste, organisation, posture.',
        'Conclure par un projet hiérarchisé et les relais : locomotion, ergothérapie, associations, MDPH.'
      ]
    },
    mnemo: [
      ['G = P / 4', 'Grossissement commercial d’une loupe'],
      ['3/10 et 20°', 'Les deux seuils de la malvoyance : acuité ou champ'],
      ['« Une aide par tâche »', 'Le grossissement se choisit sur l’usage, pas sur l’acuité']
    ]
  };

  D.UE28 = {
    tableaux: [
      { t: 'Niveaux de preuve',
        c: ['Niveau', 'Type d’étude', 'Ce qu’il permet'],
        r: [
          ['1', 'Méta-analyse, essai randomisé de forte puissance', 'Preuve établie'],
          ['2', 'Essai randomisé de faible puissance, cohorte', 'Présomption scientifique'],
          ['3', 'Cas-témoins', 'Faible niveau'],
          ['4', 'Série de cas, avis d’expert', 'Hypothèse seulement']
        ] },
      { t: 'Construire une équation',
        c: ['Opérateur', 'Effet', 'Usage'],
        r: [['ET', 'Restreint', 'Entre deux concepts différents'],
            ['OU', 'Élargit', 'Entre synonymes d’un même concept'],
            ['SAUF', 'Exclut', 'Avec prudence : élimine aussi l’imprévu'],
            ['Troncature *', 'Élargit', 'orthopt* → orthoptie, orthoptiste, orthoptic']] }
    ],
    cas: {
      t: 'Une référence trop belle',
      s: 'Vous préparez votre mémoire. Un outil d’IA vous propose une référence parfaitement adaptée : auteur crédible, revue connue, année récente, titre exactement sur votre sujet. Vous ne la trouvez ni sur PubMed ni chez l’éditeur.',
      q: ['Que concluez-vous ?', 'Que faites-vous ?', 'Quelle règle en tirez-vous ?'],
      r: 'Une référence introuvable à la source n’existe probablement pas. Les modèles génératifs produisent des références <b>plausibles</b> — le format est correct, les noms sont crédibles, l’année est cohérente — sans qu’elles correspondent à un article réel.',
      c: 'On ne la cite pas. On refait la recherche par mots-clés et termes MeSH sur le sujet visé pour trouver une source réelle. Règle générale : une IA peut aider à formuler, reformuler ou traduire, jamais à sourcer. Toute citation se vérifie à la source, sans exception.'
    },
    reponse: {
      q: 'Comment menez-vous une recherche documentaire ?',
      p: [
        'Formuler la question au format PICO : population, intervention, comparateur, critère de jugement.',
        'Extraire les concepts, puis pour chacun les synonymes et le terme MeSH.',
        'Construire l’équation : OU dans un concept, ET entre concepts, SAUF avec parcimonie.',
        'Choisir les bases : PubMed, Cochrane, LiSSa, recommandations HAS et sociétés savantes.',
        'Tracer base, équation, date et nombre de résultats — sans quoi la recherche n’est pas reproductible.',
        'Trier sur titre et résumé, puis lire en entier ce qui reste.',
        'Évaluer chaque source : type d’étude, niveau de preuve, effectif, conflits d’intérêts.',
        'Citer selon une norme constante, et vérifier chaque référence à la source.'
      ]
    },
    mnemo: [
      ['PICO', 'Population, Intervention, Comparateur, Outcome'],
      ['OU élargit, ET restreint', 'Le sens des booléens, jamais l’inverse'],
      ['« Vérifier à la source »', 'Surtout pour ce qu’une IA vous propose']
    ]
  };

  D.UE32 = {
    tableaux: [
      { t: 'Les quatre étapes de l’ETP',
        c: ['Étape', 'Question posée', 'Écueil'],
        r: [
          ['Diagnostic éducatif', 'Que sait, croit et veut le patient ?', 'Le sauter et informer d’emblée'],
          ['Objectifs partagés', 'Que doit-il savoir faire ?', 'Objectifs du soignant, pas du patient'],
          ['Séances', 'Comment le lui faire acquérir ?', 'Cours magistral déguisé'],
          ['Évaluation', 'Sait-il le faire ?', 'Évaluer l’information donnée, pas la compétence']
        ] }
    ],
    cas: {
      t: 'Des consignes qui ne tiennent pas',
      s: 'Vous avez expliqué à une mère l’occlusion de sa fille : 6 h par jour, tous les jours. Trois semaines plus tard, l’observance est quasi nulle. La mère travaille en horaires décalés et la garde est assurée par la grand-mère l’après-midi.',
      q: ['Où est l’erreur ?', 'Que changez-vous ?', 'Comment vérifiez-vous ?'],
      r: 'La consigne était médicalement juste et pratiquement inapplicable : elle n’a pas été construite avec la personne qui l’applique. Le diagnostic éducatif — qui fait quoi, à quel moment de la journée, avec quelles contraintes — a été sauté.',
      c: 'On reprend avec la mère et, si possible, la grand-mère : sur quels créneaux réels l’occlusion est-elle tenable, qui la pose, qui la retire. On remet un écrit simple avec le rythme convenu et un carnet de suivi. On vérifie par la reformulation, et on réévalue sur le carnet plutôt que sur une impression.'
    },
    reponse: {
      q: 'Comment construisez-vous une séance d’éducation thérapeutique ?',
      p: [
        'Commencer par le diagnostic éducatif : ce que la personne sait, croit, craint, et ce qu’elle veut.',
        'Négocier des objectifs partagés, formulés en compétences observables.',
        'Distinguer compétences d’auto-soins et compétences d’adaptation.',
        'Choisir des méthodes actives : manipulation, jeu de rôle, mise en situation — pas un exposé.',
        'Adapter le vocabulaire, et remettre systématiquement un écrit simple.',
        'Vérifier la compréhension par la reformulation, jamais par « vous avez compris ? ».',
        'Évaluer la compétence acquise, et réajuster.',
        'Tracer ce qui a été convenu, et prévoir le suivi.'
      ]
    },
    mnemo: [
      ['Diagnostic — Objectifs — Séances — Évaluation', 'Les quatre temps de l’ETP'],
      ['« Faire reformuler »', 'La seule vérification qui vaille'],
      ['« Ce qui n’est pas écrit n’est pas fait »', 'Toute consigne à domicile part par écrit']
    ]
  };

  D.UE37 = {
    tableaux: [
      { t: 'Les quatre issues d’un raisonnement',
        c: ['Décision', 'Quand', 'Erreur classique'],
        r: [
          ['Rééduquer', 'Trouble fonctionnel, rééducable, gênant', 'Rééduquer sur une correction fausse'],
          ['Corriger d’abord', 'Amétropie ou presbytie non compensée', 'Passer directement à la rééducation'],
          ['Surveiller', 'Trouble infraclinique ou en constitution', 'Traiter par excès'],
          ['Adresser', 'Signe d’alarme ou hors champ', 'Temporiser devant une diplopie récente']
        ] },
      { t: 'Diagnostic orthoptique : ce qui compte',
        c: ['À ne pas écrire', 'À écrire'],
        r: [['« Exophorie de 14 Δ »', '« Insuffisance de convergence avec asthénopie de lecture »'],
            ['« PPC 14 cm »', '« Retentissement sur les révisions, arrêt après 20 minutes »'],
            ['« Rééducation »', '« 10 séances, objectif PPC < 8 cm, réévaluation à S10 »']] }
    ],
    cas: {
      t: 'Écrire la conclusion',
      s: 'Vous venez de terminer le bilan d’un lycéen de 17 ans : exophorie 12 Δ de près, PPC rupture 12 cm, convergence fusionnelle 14 Δ, accommodation normale, réfraction négligeable. Il se plaint de céphalées et abandonne ses devoirs au bout d’une demi-heure.',
      q: ['Rédigez le diagnostic orthoptique.', 'Rédigez le projet.', 'Quels critères d’arrêt ?'],
      r: 'Diagnostic orthoptique : <b>insuffisance de convergence décompensée, avec asthénopie et retentissement sur le travail scolaire</b>. Le critère de Sheard exigerait 24 Δ de convergence pour 12 Δ d’exophorie ; il en a 14.',
      c: 'Projet : 10 séances de rééducation de la convergence fusionnelle, exercices intercalaires quotidiens brefs, objectifs chiffrés — PPC < 8 cm, convergence de près > 24 Δ, disparition des céphalées de lecture. Réévaluation à la 10e séance. Arrêt si les objectifs sont atteints, ou si un plateau est confirmé sur deux réévaluations malgré une observance correcte.'
    },
    reponse: {
      q: 'Comment passez-vous du bilan au projet de soins ?',
      p: [
        'Rappeler le raisonnement : plainte, hypothèses, examens choisis pour les tester, confirmation ou réfutation.',
        'Formuler le diagnostic orthoptique : dysfonctionnement + retentissement, en langage compréhensible.',
        'Vérifier les préalables : correction optique, absence de cause organique évolutive.',
        'Choisir entre les quatre issues, et savoir dire pourquoi les trois autres ont été écartées.',
        'Fixer des objectifs mesurables, avec les valeurs de départ pour pouvoir comparer.',
        'Préciser moyens, rythme, durée prévisionnelle et exercices intercalaires.',
        'Poser dès le départ les critères de réévaluation et surtout d’arrêt.',
        'Rédiger un compte rendu adapté au destinataire, daté et comparable au précédent.'
      ]
    },
    mnemo: [
      ['Rééduquer, Corriger, Surveiller, Adresser', 'Les quatre issues — il faut justifier son choix'],
      ['« Pas de projet sans critère d’arrêt »', 'Sinon la rééducation s’éternise']
    ]
  };

  /* ============================ SEMESTRE 4 ============================ */

  D.UE21 = {
    tableaux: [
      { t: 'Les indicateurs d’un test diagnostique',
        c: ['Indicateur', 'Question à laquelle il répond', 'Dépend de la prévalence ?'],
        r: [
          ['Sensibilité', 'Parmi les malades, combien sont dépistés ?', 'Non'],
          ['Spécificité', 'Parmi les sains, combien sont écartés ?', 'Non'],
          ['Valeur prédictive positive', 'Un test positif, quelle probabilité d’être malade ?', '<b>Oui</b>'],
          ['Valeur prédictive négative', 'Un test négatif, quelle probabilité d’être sain ?', '<b>Oui</b>']
        ] },
      { t: 'Ce qu’un p ne dit pas',
        c: ['On croit que…', 'En réalité'],
        r: [['p < 0,05 prouve l’hypothèse', 'Il quantifie la compatibilité des données avec l’hypothèse nulle'],
            ['p petit = effet important', 'Il dépend surtout de l’effectif'],
            ['p > 0,05 prouve l’absence d’effet', 'Absence de preuve n’est pas preuve d’absence']] }
    ],
    cas: {
      t: 'Un dépistage qui inquiète pour rien',
      s: 'Un test de dépistage a une sensibilité de 95 % et une spécificité de 90 %. On l’applique à une population où la maladie touche 1 personne sur 1 000.',
      q: ['Sur 100 000 personnes, combien de tests positifs ?', 'Combien de vrais malades parmi eux ?', 'Que vaut la VPP ?'],
      r: 'Sur 100 000 : 100 malades, dont 95 dépistés (vrais positifs). 99 900 sains, dont 10 % de faux positifs, soit 9 990. Total des positifs : 10 085.',
      c: 'VPP = 95 / 10 085 ≈ <b>0,9 %</b>. Autrement dit, un test positif signifie moins d’une chance sur cent d’être réellement malade. C’est la démonstration que la VPP dépend massivement de la prévalence : un excellent test appliqué à une maladie rare génère surtout des faux positifs — et de l’angoisse.'
    },
    reponse: {
      q: 'Comment lisez-vous un article scientifique de façon critique ?',
      p: [
        'Identifier la question de recherche et vérifier qu’elle est précise.',
        'Regarder le type d’étude et en déduire le niveau de preuve.',
        'Examiner la population : critères d’inclusion, effectif, perdus de vue.',
        'Vérifier le critère de jugement principal, et qu’il est bien celui des conclusions.',
        'Chercher les biais : sélection, mesure, confusion — et comment ils ont été traités.',
        'Distinguer significativité statistique et pertinence clinique : taille de l’effet, intervalle de confiance.',
        'Lire les conflits d’intérêts et le financement.',
        'Conclure sur la transposabilité : ces résultats s’appliquent-ils à mes patients ?'
      ]
    },
    mnemo: [
      ['VPP dépend de la prévalence', 'Sensibilité et spécificité, non'],
      ['« Significatif ≠ important »', 'Regarder la taille de l’effet, pas seulement le p']
    ]
  };

  D.UE22 = {
    tableaux: [
      { t: 'Localiser une lésion par le champ visuel',
        c: ['Déficit', 'Siège', 'Indice supplémentaire'],
        r: [
          ['Cécité monoculaire', 'Nerf optique', 'DPAR homolatéral'],
          ['Hémianopsie bitemporale', 'Chiasma', 'Adénome hypophysaire'],
          ['Hémianopsie homonyme', 'Rétro-chiasmatique controlatéral', 'Congruence croissante en arrière'],
          ['Quadranopsie supérieure', 'Boucle de Meyer, temporal', '« Pie in the sky »'],
          ['Quadranopsie inférieure', 'Pariétal', 'Souvent négligence associée'],
          ['Hémianopsie avec épargne maculaire', 'Occipital', 'Double vascularisation du pôle']
        ] },
      { t: 'Anisocorie : quel côté est malade ?',
        c: ['Situation', 'Pupille pathologique', 'Causes'],
        r: [['Écart majoré à la lumière', 'La grande', 'III, Adie, pharmacologique'],
            ['Écart majoré à l’obscurité', 'La petite', 'Horner'],
            ['Écart identique', 'Aucune', 'Anisocorie physiologique, jusqu’à 1 mm']] }
    ],
    cas: {
      t: 'Une mydriase du matin',
      s: 'Femme de 30 ans, mydriase unilatérale découverte le matin, sans douleur, sans ptôsis, sans diplopie. La pupille réagit très peu à la lumière mais se contracte lentement en vision de près, avec un retour lent. Mouvements vermiformes de l’iris.',
      q: ['Quel diagnostic évoquez-vous ?', 'Qu’est-ce qui écarte un III ?', 'Quel test confirme ?'],
      r: 'Le tableau est celui d’une <b>pupille d’Adie</b> : mydriase tonique par atteinte du ganglion ciliaire, avec dissociation lumière / proximité, contraction lente et prolongée de près, et mouvements vermiformes.',
      c: 'Un III compressif s’accompagnerait de ptôsis, de déficit oculomoteur et surtout de douleur — leur absence est rassurante mais n’autorise pas à conclure seul. Le test : pilocarpine diluée, qui contracte une pupille d’Adie par hypersensibilité de dénervation et laisse indifférente une mydriase du III récente. Avis médical dans tous les cas.'
    },
    reponse: {
      q: 'Devant une diplopie, quelle démarche diagnostique ?',
      p: [
        'Première question : monoculaire ou binoculaire ? L’occlusion d’un œil tranche immédiatement.',
        'Si monoculaire : cause optique — astigmatisme irrégulier, cataracte, décentrement.',
        'Si binoculaire : préciser le sens — horizontale, verticale, oblique, torsionnelle.',
        'Préciser les circonstances : de loin ou de près, dans quelle direction du regard, variable ou non.',
        'Chiffrer dans les 9 positions et réaliser un Lancaster.',
        'Trancher paralysie / restriction : déviation secondaire, duction forcée, PIO en regard contraint.',
        'Examiner la pupille et la paupière : mydriase, ptôsis, Horner — ce sont les signes d’alarme.',
        'Conclure sur l’urgence : diplopie récente, mydriase, céphalées, signes neurologiques → avis immédiat.'
      ]
    },
    mnemo: [
      ['Lumière → la grande ; obscurité → la petite', 'Le côté pathologique dans une anisocorie'],
      ['III + mydriase + douleur = anévrisme', 'Urgence absolue'],
      ['Adduction limitée + convergence conservée', 'Ophtalmoplégie internucléaire']
    ]
  };

  D.UE23 = {
    tableaux: [
      { t: 'Prendre en charge une diplopie dans le temps',
        c: ['Phase', 'Délai', 'Objectif', 'Moyens'],
        r: [
          ['Aiguë', '0 à 3 mois', 'Confort, éliminer l’urgence', 'Occlusion, prisme de soulagement, bilan étiologique'],
          ['Récupération', '3 à 9 mois', 'Suivre l’évolution', 'Lancaster répétés, prismes adaptés'],
          ['Stabilisation', '6 à 12 mois', 'Décider', 'Prismes définitifs ou chirurgie'],
          ['Séquellaire', '> 12 mois', 'Compenser', 'Chirurgie, prismes, adaptation du poste']
        ] },
      { t: 'Rééducation après atteinte neurologique',
        c: ['Déficit', 'Ce qu’on travaille', 'Ce qu’on n’attend pas'],
        r: [['Hémianopsie', 'Balayage vers le côté aveugle, ancrage', 'Une récupération du champ'],
            ['Négligence', 'Ancrage à gauche, indices, environnement', 'Une correction spontanée'],
            ['Paralysie oculomotrice', 'Confort, compensation, torticolis', 'Une rééducation du muscle paralysé']] }
    ],
    cas: {
      t: 'Trois mois après un AVC',
      s: 'Patient de 58 ans, trois mois après un AVC occipital droit. Hémianopsie latérale homonyme gauche congruente, sans négligence. Il bute contre les obstacles à gauche et perd sa ligne en lecture.',
      q: ['Peut-on récupérer le champ ?', 'Que travaillez-vous ?', 'Quels aménagements ?'],
      r: 'Le champ perdu ne se récupère pas au-delà des premiers mois : la rééducation ne vise pas la restauration mais la <b>compensation</b>. On travaille des stratégies d’exploration : balayage systématique et volontaire vers la gauche, saccades d’ancrage, élargissement du repérage avant déplacement.',
      c: 'Pour la lecture, on ancre le début de ligne — repère coloré, doigt, règle — puisque c’est le retour à la ligne qui échoue dans une hémianopsie gauche. Aménagements : disposition de l’environnement, sécurité des déplacements, information de l’entourage, et rappel du cadre réglementaire pour la conduite.'
    },
    reponse: {
      q: 'Quelle prise en charge orthoptique après une atteinte neuro-ophtalmologique ?',
      p: [
        'Situer la phase : aiguë, récupération, stabilisation ou séquelle — elle commande les objectifs.',
        'En phase aiguë, priorité au confort et à l’élimination de l’urgence.',
        'Documenter l’évolution avec des mesures comparables : Lancaster, cover test chiffré, champ visuel.',
        'Distinguer ce qui peut récupérer de ce qui devra être compensé.',
        'Pour les déficits du champ : rééducation des stratégies d’exploration, pas du champ lui-même.',
        'Pour les paralysies : confort, prismes, gestion du torticolis, préparation d’une éventuelle chirurgie.',
        'Associer l’entourage et adapter l’environnement.',
        'Réévaluer régulièrement, et savoir alerter devant toute modification du tableau.'
      ]
    },
    mnemo: [
      ['6 à 12 mois', 'Le délai de stabilisation avant chirurgie d’une paralysie'],
      ['« On compense, on ne restaure pas »', 'La règle des déficits du champ visuel']
    ]
  };

  D.UE27 = {
    tableaux: [
      { t: 'Les aides selon la distance',
        c: ['Distance', 'Aide', 'Limite'],
        r: [
          ['Près', 'Addition forte, loupe, agrandisseur électronique', 'Distance de travail très courte'],
          ['Intermédiaire', 'Loupe sur support, écran agrandi', 'Encombrement'],
          ['Loin', 'Système télescopique', 'Champ étroit, pas en déplacement'],
          ['Toutes', 'Éclairage, contraste, filtres', 'Souvent le levier le plus efficace']
        ] }
    ],
    cas: {
      t: 'Réapprendre à regarder',
      s: 'Patiente de 74 ans, DMLA exsudative stabilisée, scotome central de l’œil directeur. Elle fixe droit devant et « perd » les mots. Acuité 1,5/10.',
      q: ['Que se passe-t-il quand elle fixe ?', 'Que lui apprend-on ?', 'Comment procède-t-on ?'],
      r: 'En fixant droit devant, elle place l’image sur son scotome : plus elle regarde le mot, moins elle le voit. C’est le paradoxe déroutant du scotome central, et la raison pour laquelle beaucoup de patients concluent qu’ils « ne peuvent plus lire ».',
      c: 'On lui apprend la <b>fixation excentrée</b> : repérer la zone rétinienne saine la plus efficace, apprendre à y amener volontairement l’image, puis automatiser. On commence sur des cibles simples et contrastées, on augmente progressivement la complexité, et on transfère ensuite en lecture avec le grossissement et l’éclairage adaptés.'
    },
    reponse: {
      q: 'Comment construisez-vous un projet de rééducation en basse vision ?',
      p: [
        'Partir des besoins hiérarchisés par la personne, pas de l’acuité.',
        'Évaluer la fonction résiduelle : contrastes, champ, scotome, éblouissement, fixation.',
        'Poser les leviers non optiques en premier : éclairage, contraste, organisation.',
        'Déterminer le grossissement nécessaire par tâche, avec sa marge de confort.',
        'Apprendre la fixation excentrée si un scotome central l’impose.',
        'Essayer les aides en situation réelle et laisser le temps de l’appropriation.',
        'Travailler la lecture : ancrage, balayage, endurance.',
        'Organiser les relais et réévaluer, la pathologie pouvant évoluer.'
      ]
    },
    mnemo: [
      ['« Regarder à côté pour voir »', 'Le principe de la fixation excentrée'],
      ['Besoins avant acuité', 'Un projet se construit sur ce que la personne veut refaire']
    ]
  };

  /* ============================ SEMESTRE 5 ============================ */

  D.UE29 = {
    tableaux: [
      { t: 'Ce qui relève de l’orthoptie et ce qui n’en relève pas',
        c: ['Plainte', 'Piste orthoptique', 'Autre piste'],
        r: [
          ['Perd sa ligne, saute des mots', 'Saccades, vergences', 'Trouble attentionnel'],
          ['Confond les lettres', 'Rien de spécifique', 'Dyslexie — orthophonie'],
          ['Se fatigue vite en lecture', 'Convergence, accommodation', 'Endurance, motivation'],
          ['Copie mal du tableau', 'Saccades loin-près, amétropie', 'Mémoire de travail'],
          ['Écriture désordonnée', 'Coordination œil-main', 'Graphisme — psychomotricité']
        ] }
    ],
    cas: {
      t: 'Un bilan demandé par l’école',
      s: 'Garçon de 9 ans, CM1, adressé par l’enseignante pour « suspicion de dyslexie visuelle ». Bilan : acuités 10/10, réfraction négligeable, PPC 7 cm, amplitudes normales, flippers 10 cycles/min, DEM normal en colonnes comme en lignes.',
      q: ['Que concluez-vous ?', 'Que répondez-vous à l’école ?', 'Quel risque à mal formuler ?'],
      r: 'Le bilan orthoptique est <b>normal</b> : rien dans les vergences, l’accommodation ni les saccades n’explique la difficulté. La « dyslexie visuelle » n’est d’ailleurs pas une entité : la dyslexie est un trouble phonologique du langage écrit.',
      c: 'On écrit clairement que le bilan orthoptique ne retrouve pas de trouble fonctionnel visuel expliquant les difficultés, et on oriente vers un bilan orthophonique. Le risque d’une conclusion floue est majeur : elle enclenche une rééducation inutile et retarde de plusieurs mois la prise en charge réellement nécessaire.'
    },
    reponse: {
      q: 'Quel bilan devant des difficultés de lecture chez un enfant ?',
      p: [
        'Recueillir la plainte réelle : ce que l’enfant, les parents et l’enseignant décrivent, séparément.',
        'Éliminer d’abord l’optique : acuités, réfraction sous cycloplégie si besoin.',
        'Explorer la binocularité : cover test, PPC, amplitudes, AC/A.',
        'Explorer l’accommodation : amplitude, souplesse aux flippers.',
        'Explorer les saccades de lecture : DEM, en comparant colonnes et lignes.',
        'Observer en situation : lecture d’un texte de son niveau, sur la durée.',
        'Conclure sans déborder : dire ce qui est trouvé et ce qui ne l’est pas.',
        'Orienter si nécessaire, et rédiger pour l’école en termes concrets et non chiffrés.'
      ]
    },
    mnemo: [
      ['DEM : colonnes vs lignes', 'Sépare lenteur de dénomination et trouble des saccades'],
      ['« Un bilan normal est un résultat »', 'Le dire clairement évite une rééducation inutile']
    ]
  };

  D.UE30 = {
    tableaux: [
      { t: 'Les deux voies visuelles corticales',
        c: ['Voie', 'Trajet', 'Fonction', 'Atteinte'],
        r: [
          ['Dorsale', 'Occipito-pariétale', 'Le « où », l’action, l’espace', 'Difficultés visuo-spatiales, guidage du geste'],
          ['Ventrale', 'Occipito-temporale', 'Le « quoi », la reconnaissance', 'Agnosie visuelle, prosopagnosie']
        ] },
      { t: 'Les trois entrées de l’équilibre',
        c: ['Entrée', 'Ce qu’elle apporte', 'Si elle est perturbée'],
        r: [['Visuelle', 'Référence spatiale stable', 'Instabilité en environnement mouvant'],
            ['Vestibulaire', 'Accélérations, position de la tête', 'Vertiges, nystagmus'],
            ['Proprioceptive', 'Position du corps', 'Instabilité les yeux fermés']] }
    ],
    cas: {
      t: 'Un enfant né grand prématuré',
      s: 'Enfant de 7 ans né à 27 semaines. Acuités 10/10, réfraction et oculomotricité normales. Il se cogne, peine à retrouver un objet dans un tiroir, ne repère pas sa ligne dans un texte dense, mais lit correctement un texte aéré.',
      q: ['Que suggère la dissociation texte dense / texte aéré ?', 'Quelle voie est en cause ?', 'Que proposez-vous ?'],
      r: 'Un œil sain avec une gêne majorée par l’<b>encombrement visuel</b> oriente vers un trouble neurovisuel d’origine centrale, et non vers un trouble oculomoteur. La difficulté à trouver un objet parmi d’autres et le guidage du geste orientent vers la voie <b>dorsale</b>, occipito-pariétale — profil classique de la prématurité.',
      c: 'Rééducation des stratégies : exploration organisée et systématique, repérage, coordination œil-main. Aménagements : supports épurés, textes aérés, consignes une à une, environnement rangé et stable. Travail conjoint avec ergothérapeute, enseignant et psychomotricien.'
    },
    reponse: {
      q: 'Comment reconnaissez-vous un trouble neurovisuel ?',
      p: [
        'Poser le paradoxe fondateur : l’œil est sain, l’acuité normale, et pourtant la vision ne remplit pas sa fonction.',
        'Chercher le contexte : prématurité, encéphalopathie, lésion cérébrale acquise, syndrome génétique.',
        'Interroger sur des situations concrètes, pas sur la vision : trouver un objet, se déplacer, copier, s’habiller.',
        'Observer l’exploration visuelle : organisée ou anarchique, sensible à l’encombrement.',
        'Évaluer la coordination œil-main et le repérage spatial.',
        'Séparer voie dorsale et voie ventrale d’après le profil des difficultés.',
        'Écarter ce qui relève de l’attention, de la fatigue ou de l’anxiété en variant les conditions.',
        'Conclure en termes fonctionnels, et travailler avec les autres professionnels.'
      ]
    },
    mnemo: [
      ['Dorsale = où ; ventrale = quoi', 'Les deux voies corticales en quatre mots'],
      ['« Œil sain, vision empêchée »', 'La définition du trouble neurovisuel']
    ]
  };

  D.UE31 = {
    tableaux: [
      { t: 'Dépister selon l’âge',
        c: ['Âge', 'Outils', 'Ce qu’on cherche'],
        r: [
          ['0 à 6 mois', 'Poursuite, Brückner, reflets', 'Leucocorie, absence de fixation, nystagmus'],
          ['6 mois à 3 ans', 'Regard préférentiel, Brückner, cover test', 'Strabisme, anisométropie'],
          ['3 à 6 ans', 'Acuité par œil en ligne, relief, couleurs', 'Amblyopie silencieuse'],
          ['Scolaire', 'Acuité loin et près, vergences', 'Amétropie, asthénopie'],
          ['Adulte au travail', 'Acuités, phories, film lacrymal', 'Inconfort sur écran']
        ] },
      { t: 'Ergonomie sur écran',
        c: ['Paramètre', 'Recommandation'],
        r: [['Distance', '50 à 60 cm minimum'], ['Hauteur', 'Haut de l’écran au niveau des yeux ou en dessous'],
            ['Pauses', 'Règle du 20-20-20'], ['Éclairage', 'Latéral, sans reflet sur l’écran'],
            ['Sécheresse', 'Clignements volontaires, larmes artificielles si BUT court']] }
    ],
    cas: {
      t: 'Organiser un dépistage',
      s: 'Une école de 180 élèves de grande section vous sollicite pour un dépistage visuel. On vous propose une demi-journée, une salle de classe vide et l’aide de deux enseignants.',
      q: ['Qu’exigez-vous avant d’accepter ?', 'Quels tests retenez-vous ?', 'Quel est le point critique ?'],
      r: 'Avant tout : un <b>circuit d’aval</b> écrit — qui reçoit les enfants repérés, dans quel délai, et comment les familles sont informées. Ensuite les conditions matérielles : distance d’examen respectée et constante, éclairage suffisant, salle sans passage.',
      c: 'Tests : acuité par œil en ligne avec occlusion fiable, reflets et cover test, test de relief, vision des couleurs. Seuils d’adressage écrits avant de commencer. Le point critique n’est pas technique : dépister 180 enfants sans pouvoir orienter les 20 repérés inquiète les familles sans rien résoudre — c’est pire que ne rien faire.'
    },
    reponse: {
      q: 'Comment organisez-vous un dépistage visuel ?',
      p: [
        'Définir la population, la tranche d’âge et l’objectif du dépistage.',
        'Vérifier les critères d’un bon dépistage : maladie fréquente et grave, phase latente, test acceptable, traitement efficace au stade précoce.',
        'Choisir les tests selon l’âge, en privilégiant sensibilité et faisabilité.',
        'Écrire les seuils d’adressage avant de commencer.',
        'Organiser les conditions : distance, éclairage, calibration, occlusion fiable.',
        'Organiser le circuit d’aval : qui reçoit, dans quel délai.',
        'Informer les familles par écrit, en termes non alarmistes.',
        'Tracer, et évaluer l’action : combien repérés, combien effectivement pris en charge.'
      ]
    },
    mnemo: [
      ['20-20-20', 'Toutes les 20 minutes, 20 secondes, à 6 mètres'],
      ['« Pas de dépistage sans aval »', 'Repérer sans pouvoir orienter est contre-productif']
    ]
  };

  D.UE33 = {
    tableaux: [
      { t: 'Quel examen pour quelle question',
        c: ['Question', 'Examen', 'Ce qu’il apporte'],
        r: [
          ['Épaisseur maculaire, fluide', 'OCT maculaire', 'Coupes, quantification, suivi'],
          ['Progression d’un glaucome', 'OCT RNFL et ganglionnaire', 'Structure avant fonction'],
          ['Kératocône débutant', 'Topographie / tomographie', 'Courbure, élévation, épaisseur'],
          ['Néovaisseaux', 'Angiographie ou OCT-A', 'Flux, diffusion'],
          ['Dépistage diabétique', 'Rétinophotographie grand champ', 'Lecture différée possible']
        ] }
    ],
    cas: {
      t: 'Un cliché à transmettre',
      s: 'Un confrère vous demande par messagerie personnelle une rétinophotographie d’un patient, pour avis. Le fichier porte le nom et la date de naissance du patient.',
      q: ['Que refusez-vous ?', 'Comment procédez-vous ?', 'Quel cadre s’applique ?'],
      r: 'Une image de fond d’œil est une <b>donnée de santé</b> : elle relève du RGPD et du secret professionnel. La transmettre par messagerie personnelle expose la donnée et engage la responsabilité de l’expéditeur.',
      c: 'On passe par une messagerie sécurisée de santé, dans le cadre du secret partagé et donc du soin de ce patient, avec information de l’intéressé. Pour un usage pédagogique ou une publication, il faut une anonymisation réelle — retirer le nom ne suffit pas si la date et le numéro d’examen restent lisibles — et un consentement écrit.'
    },
    reponse: {
      q: 'Quelle imagerie choisir, et sous quelles précautions ?',
      p: [
        'Partir de la question clinique : chaque examen répond à une hypothèse précise.',
        'Connaître ce que chaque technique montre, et surtout ce qu’elle ne montre pas.',
        'Vérifier la qualité avant d’interpréter : signal, segmentation, centrage.',
        'Comparer sur le même appareil et la même carte, sinon la comparaison est fausse.',
        'Situer l’examen dans le suivi : ligne de base, rythme, tendance.',
        'Traiter les images comme des données de santé : conservation, messagerie sécurisée.',
        'Anonymiser réellement pour tout usage pédagogique, et recueillir le consentement.',
        'Conclure : l’imagerie complète l’examen clinique, elle ne le remplace jamais.'
      ]
    },
    mnemo: [
      ['« Une image est une donnée de santé »', 'RGPD, secret, messagerie sécurisée'],
      ['Même appareil, même carte', 'La condition de toute comparaison']
    ]
  };

  D.UE41 = {
    tableaux: [
      { t: 'Les trois urgences oculaires à reconnaître',
        c: ['Situation', 'Geste immédiat', 'À ne surtout pas faire'],
        r: [
          ['Brûlure chimique', 'Rincer ≥ 15 min, immédiatement', 'Retarder pour mesurer l’acuité'],
          ['Traumatisme perforant', 'Coque de protection, à jeun, transfert', 'Rincer, comprimer, retirer un corps étranger'],
          ['Baisse brutale indolore', 'Adresser en urgence', 'Attendre le rendez-vous programmé']
        ] },
      { t: 'Numéros et conduites',
        c: ['Situation', 'Conduite'],
        r: [['Urgence médicale', '15 (SAMU) ou 112'], ['Personne sourde ou malentendante', '114'],
            ['Inconscient qui respire', 'Position latérale de sécurité'],
            ['Arrêt cardiaque', '100 à 120 compressions/min, 5 à 6 cm'],
            ['Hémorragie externe', 'Compression directe, allonger, alerter']] }
    ],
    cas: {
      t: 'Une projection de produit',
      s: 'Un patient arrive au cabinet, un œil fermé, très douloureux : il a reçu un produit d’entretien alcalin il y a dix minutes. Il vous demande ce qu’il doit faire et veut d’abord savoir s’il va perdre son œil.',
      q: ['Quel est votre premier geste ?', 'Combien de temps ?', 'Pourquoi les bases sont-elles pires ?'],
      r: 'Le rinçage, <b>immédiatement</b> et avant tout autre chose : ni acuité, ni interrogatoire, ni dossier. Au moins 15 minutes, à l’eau ou au sérum physiologique, en écartant les paupières et en faisant regarder dans toutes les directions.',
      c: 'Les bases pénètrent en profondeur par saponification des membranes, tandis que les acides coagulent les protéines et forment une barrière relative : à concentration égale, une brûlure alcaline est plus grave. Le temps de rinçage fait le pronostic. On rassure sans promettre, on poursuit le rinçage pendant le transfert, et on transmet le nom du produit.'
    },
    reponse: {
      q: 'Quelle conduite devant une urgence au cabinet ?',
      p: [
        'Évaluer d’abord : conscience, respiration, douleur, contexte — en quelques secondes.',
        'Alerter tôt plutôt que tard : 15 ou 112, et ne pas rester seul.',
        'Pour une brûlure chimique : rincer immédiatement, abondamment, au moins 15 minutes, avant tout.',
        'Pour un traumatisme perforant : ne rien rincer, ne rien retirer, coque sans compression, patient à jeun.',
        'Pour une baisse brutale indolore : adresser en urgence, l’échéance se compte en heures.',
        'Pour un malaise : allonger, jambes surélevées, aérer, surveiller.',
        'Noter l’heure, ce qui a été observé et ce qui a été fait.',
        'Transmettre à l’équipe et au médecin, et déclarer si un événement indésirable est survenu.'
      ]
    },
    mnemo: [
      ['Rincer d’abord, mesurer après', 'La règle absolue de la brûlure chimique'],
      ['Perforant : on ne touche à rien', 'Coque, à jeun, transfert'],
      ['Les bases pénètrent, les acides coagulent', 'Pourquoi l’alcalin est plus grave']
    ]
  };

  /* ============================ SEMESTRE 6 ============================ */

  D.UE34 = {
    tableaux: [
      { t: 'Vérifier qu’un acte est licite',
        c: ['Question', 'Si la réponse est non'],
        r: [
          ['L’acte figure-t-il au décret d’actes ?', 'Exercice illégal, quelle que soit la qualité du geste'],
          ['La condition est-elle remplie (prescription, protocole) ?', 'Hors cadre — responsabilité engagée'],
          ['Suis-je compétent aujourd’hui pour le poser ?', 'On s’abstient et on se forme']
        ] },
      { t: 'Modes d’exercice',
        c: ['Mode', 'Avantages', 'Contraintes'],
        r: [['Libéral', 'Autonomie, organisation', 'Charges, comptabilité, installation'],
            ['Salarié hospitalier', 'Cadre, plateau technique, formation', 'Moins d’autonomie'],
            ['Cabinet d’ophtalmologie', 'Volume, travail aidé, apprentissage rapide', 'Rythme, dépendance au protocole'],
            ['Mixte', 'Diversité', 'Charge d’organisation']] }
    ],
    cas: {
      t: 'Un acte demandé hors cadre',
      s: 'Dans le cabinet où vous exercez, l’ophtalmologiste absent vous demande par téléphone de renouveler la correction d’un patient de 42 ans, dont la dernière ordonnance date de 6 ans, et qui signale une baisse récente à un œil.',
      q: ['Quels éléments vous arrêtent ?', 'Que faites-vous ?', 'Comment le formulez-vous ?'],
      r: 'Deux éléments bloquent. La condition réglementaire d’abord : le renouvellement et l’adaptation sont encadrés par des conditions d’âge et d’ancienneté de l’ordonnance, et six ans dépasse le cadre. Le tableau clinique ensuite : une <b>baisse récente unilatérale</b> est un signe d’alarme qui impose un avis médical, pas un renouvellement.',
      c: 'On ne renouvelle pas. On réalise les mesures utiles, on documente la baisse, et on organise une consultation médicale rapprochée. On le formule sans mise en cause : « la baisse récente à droite sort du cadre du renouvellement, je préfère que tu la voies — voici les mesures ».'
    },
    reponse: {
      q: 'Quel est le cadre d’exercice de l’orthoptiste ?',
      p: [
        'Poser le statut : auxiliaire médical, profession réglementée, actes définis par décret.',
        'Distinguer les régimes : sur prescription, sous protocole, en autonomie encadrée.',
        'Présenter le travail aidé et son apport à l’accès aux soins.',
        'Décrire les extensions récentes : accès direct encadré, renouvellement et adaptation sous conditions.',
        'Énoncer les trois vérifications d’un acte : décret, condition, compétence.',
        'Exposer les trois responsabilités, en insistant sur le caractère personnel de la pénale.',
        'Rappeler les obligations : assurance, DPC, traçabilité, secret, consentement.',
        'Conclure sur les modes d’exercice et leurs contraintes respectives.'
      ]
    },
    mnemo: [
      ['Décret — Condition — Compétence', 'Les trois vérifications avant tout acte'],
      ['La pénale ne s’assure pas', 'Elle reste personnelle, toujours']
    ]
  };

  D.UE35 = {
    tableaux: [
      { t: 'Les critères d’un bon dépistage',
        c: ['Critère', 'Le glaucome le remplit-il ?'],
        r: [['Maladie fréquente et grave', 'Oui'], ['Phase latente détectable', 'Oui, longue'],
            ['Test simple et acceptable', 'Oui — PIO, papille, OCT, champ'],
            ['Traitement efficace au stade précoce', 'Oui, il ralentit l’évolution'],
            ['Bénéfice démontré', 'Oui pour les populations à risque']] },
      { t: 'Signes qui interrompent le circuit',
        c: ['Signe', 'Ce qu’on craint'],
        r: [['Baisse brutale', 'Occlusion vasculaire, décollement'],
            ['Douleur profonde avec œil dur', 'Glaucome aigu'],
            ['Mydriase aréactive', 'Compression du III'],
            ['Amputation du champ récente', 'Atteinte neurologique'],
            ['Métamorphopsies récentes', 'DMLA exsudative']] }
    ],
    cas: {
      t: 'Un examen préalable qui dérape',
      s: 'Vous réalisez les examens préalables d’un patient de 55 ans venu pour un renouvellement. Il mentionne au passage que depuis deux jours, il voit « comme un rideau » en bas à gauche de l’œil droit, avec des éclairs.',
      q: ['Que faites-vous du programme prévu ?', 'Quelle hypothèse ?', 'Quel délai ?'],
      r: 'On interrompt : phosphènes et amputation périphérique progressive évoquent un <b>décollement de rétine</b>, éventuellement précédé d’une déchirure. Poursuivre le circuit d’examens de routine ferait perdre un temps qui compte.',
      c: 'On alerte immédiatement l’ophtalmologiste, sans attendre la fin du programme ni le rendez-vous prévu. L’urgence se compte en heures à jours : un décollement qui n’a pas encore atteint la macula a un pronostic bien meilleur, ce qui rend le délai déterminant.'
    },
    reponse: {
      q: 'Quel est le rôle de l’orthoptiste dans le dépistage et le suivi ?',
      p: [
        'Situer le cadre : travail aidé ou protocole, sous responsabilité médicale.',
        'Décrire l’apport : volume de patients et qualité de mesures constantes donc comparables.',
        'Détailler les examens réalisés : interrogatoire, acuités, réfraction, PIO, imagerie, champ visuel.',
        'Insister sur la standardisation : mêmes conditions, mêmes appareils, traçabilité.',
        'Poser la limite : diagnostic et prescription restent médicaux.',
        'Énumérer les signes qui imposent d’interrompre et d’alerter sans attendre.',
        'Décrire la préparation du dossier pour le médecin : lisible, comparatif, conclusion factuelle.',
        'Conclure sur l’éducation du patient : autosurveillance, observance, rythme de suivi.'
      ]
    },
    mnemo: [
      ['Rideau + éclairs', 'Décollement de rétine jusqu’à preuve du contraire'],
      ['« Mesurer, pas diagnostiquer »', 'La limite du rôle en dépistage']
    ]
  };

  D.UE36 = {
    tableaux: [
      { t: 'Les gestes chirurgicaux',
        c: ['Geste', 'Effet', 'Indication type'],
        r: [
          ['Recul', 'Affaiblit le muscle', 'Muscle hyperactif ou contracturé'],
          ['Résection / plissement', 'Renforce le muscle', 'Muscle hypoactif'],
          ['Myopexie postérieure (Faden)', 'Réduit l’action dans le champ du muscle', 'Ésotropie de près, DVD'],
          ['Transposition', 'Supplée un muscle paralysé', 'Paralysie du VI ancienne'],
          ['Kestenbaum', 'Déplace la zone de blocage', 'Nystagmus avec torticolis']
        ] },
      { t: 'Bilan pré et postopératoire',
        c: ['Temps', 'Ce qu’on mesure', 'Piège'],
        r: [['Préopératoire', 'Angle répété loin et près, motilité, sensoriel, torticolis', 'Un seul angle mesuré'],
            ['J0 à S4', 'Rien de conclusif', 'Conclure sur l’œdème'],
            ['S4 à S6', 'Angle résiduel, motilité, sensoriel', 'Oublier de comparer au préopératoire'],
            ['À distance', 'Stabilité, union binoculaire', 'Se satisfaire de l’esthétique']] }
    ],
    cas: {
      t: 'Après l’opération',
      s: 'Enfant opéré d’une ésotropie de 35 Δ il y a cinq semaines. Angle résiduel : 8 Δ d’ésotropie. Les parents sont déçus, ils espéraient « zéro ».',
      q: ['Le résultat est-il satisfaisant ?', 'Que regardez-vous en plus de l’angle ?', 'Que dites-vous aux parents ?'],
      r: 'Un angle résiduel inférieur à 10 Δ est habituellement considéré comme un <b>succès</b> chirurgical. Viser zéro n’est ni réaliste ni nécessairement souhaitable : une microtropie résiduelle peut s’accompagner d’une union binoculaire fonctionnelle.',
      c: 'On regarde surtout le <b>sensoriel</b> : perception simultanée, fusion, relief, neutralisation. C’est la restauration d’une union binoculaire qui fait le vrai succès, pas l’alignement esthétique. On l’explique aux parents en montrant les tests, et on rappelle que le suivi continue, l’angle pouvant encore évoluer.'
    },
    reponse: {
      q: 'Quel bilan orthoptique autour d’une chirurgie du strabisme ?',
      p: [
        'En préopératoire, poser l’exigence de stabilité : angle mesuré à plusieurs reprises, de loin et de près.',
        'Vérifier les préalables : amblyopie traitée, correction optimale, pas de cause évolutive.',
        'Documenter complètement : motilité cotée, torticolis, sensoriel, acuités.',
        'Expliquer au patient et à la famille l’objectif réel et ses limites.',
        'En postopératoire immédiat, ne rien conclure : œdème et inflammation faussent tout.',
        'À 4-6 semaines, mesurer l’angle résiduel et comparer au préopératoire.',
        'Évaluer le sensoriel : c’est lui qui dit si la chirurgie a rendu une fonction.',
        'Poursuivre le suivi : l’angle peut évoluer, une reprise reste possible.'
      ]
    },
    mnemo: [
      ['Recul affaiblit, résection renforce', 'Les deux gestes de base'],
      ['< 10 Δ = succès', 'Le critère usuel, pas le zéro'],
      ['Le succès est sensoriel', 'L’alignement seul ne dit rien de la fonction']
    ]
  };

  D.UE38 = {
    tableaux: [
      { t: 'La structure IMRaD',
        c: ['Partie', 'Ce qu’elle contient', 'Erreur fréquente'],
        r: [
          ['Introduction', 'Contexte, état des connaissances, question', 'Tout dire, y compris les résultats'],
          ['Méthode', 'Population, recueil, analyse — reproductible', 'Trop vague pour être reproduite'],
          ['Résultats', 'Les faits, sans interprétation', 'Commenter au lieu de présenter'],
          ['Discussion', 'Confrontation, limites, portée', 'Nier les limites'],
          ['Conclusion', 'Réponse à la question posée', 'Conclure au-delà des résultats']
        ] },
      { t: 'Rétroplanning type',
        c: ['Étape', 'À prévoir'],
        r: [['Question et revue de littérature', 'Le plus tôt possible'],
            ['Protocole et autorisations', 'Long, dépend d’autres personnes'],
            ['Recueil', 'Toujours plus long que prévu'],
            ['Analyse et rédaction', 'À commencer pendant le recueil'],
            ['Relecture et dépôt', 'Marge incompressible']] }
    ],
    cas: {
      t: 'Un mémoire mal engagé',
      s: 'À quatre mois de la soutenance, une étudiante a une belle revue de littérature, un questionnaire prêt, mais aucune autorisation déposée et aucun patient inclus.',
      q: ['Où est le risque ?', 'Que peut-elle sauver ?', 'Quelle leçon ?'],
      r: 'Le risque est l’impasse : les autorisations et le recueil dépendent de tiers, et quatre mois ne suffisent probablement pas pour obtenir les unes puis mener l’autre, analyser et rédiger.',
      c: 'Deux options : réduire drastiquement l’ambition du recueil — moins de sujets, un seul centre, un critère unique —, ou transformer le travail en revue de littérature structurée, format parfaitement recevable. La leçon : un rétroplanning se construit à l’envers, depuis la soutenance, et les deux postes à surdimensionner sont les autorisations et le recueil.'
    },
    reponse: {
      q: 'Comment construisez-vous votre travail de fin d’études ?',
      p: [
        'Formuler une question précise, délimitée et réalisable avec les moyens disponibles.',
        'Faire la revue de littérature avant de figer la méthode : elle dit ce qui est déjà su.',
        'Écrire un protocole : population, critères, recueil, analyse prévue.',
        'Anticiper le cadre éthique : information, consentement, anonymisation, déclarations.',
        'Construire le rétroplanning à l’envers, en surdimensionnant autorisations et recueil.',
        'Rédiger la méthode pendant qu’on la conçoit, pas six mois plus tard.',
        'Présenter les résultats sans les commenter, puis discuter avec les limites.',
        'Préparer la soutenance : un propos, pas une lecture de diapositives, et tenir le temps.'
      ]
    },
    mnemo: [
      ['IMRaD', 'Introduction, Méthode, Résultats, Discussion'],
      ['Rétroplanning à l’envers', 'On part de la soutenance et on remonte']
    ]
  };

  D.UE39 = {
    tableaux: [
      { t: 'Adapter la transmission au destinataire',
        c: ['Destinataire', 'Ce qu’il attend', 'Ce qui le perd'],
        r: [
          ['Ophtalmologiste', 'Conclusion, chiffres, proposition', 'Un récit sans conclusion'],
          ['Médecin traitant', 'Retentissement, conduite à tenir', 'Le détail technique'],
          ['Enseignant', 'Conséquences concrètes en classe', 'Les chiffres et le jargon'],
          ['Orthophoniste', 'Ce qui est éliminé, ce qui reste', 'Une conclusion floue'],
          ['Patient ou famille', 'Ce qu’ils doivent faire', 'Le vocabulaire médical']
        ] },
      { t: 'Les limites du secret partagé',
        c: ['Interlocuteur', 'Peut-on partager ?'],
        r: [['Équipe de soins du patient', 'Oui, limité au nécessaire'],
            ['Autre professionnel de santé hors prise en charge', 'Non, sans accord'],
            ['École, employeur', 'Non — passe par le patient'],
            ['Famille d’un majeur', 'Seulement avec son accord']] }
    ],
    cas: {
      t: 'Deux courriers pour un bilan',
      s: 'Vous terminez le bilan d’un enfant de 8 ans : insuffisance de convergence avec PPC à 13 cm, exophorie de près de 12 Δ, retentissement net en lecture. Vous devez écrire à l’ophtalmologiste et à l’enseignante.',
      q: ['Qu’écrivez-vous à chacun ?', 'Qu’est-ce qui change ?', 'Que ne faites-vous pas ?'],
      r: 'À l’ophtalmologiste : les chiffres, le diagnostic orthoptique, la proposition et le nombre de séances envisagées. À l’enseignante : aucun chiffre, aucun terme technique — ce que l’enfant n’arrive pas à faire, dans quelles conditions, et ce qui l’aide en classe.',
      c: 'Ce qui change n’est pas le niveau de langue mais <b>ce que le destinataire va en faire</b>. On n’envoie pas le courrier à l’enseignante directement : il passe par les parents, l’école ne faisant pas partie de l’équipe de soins.'
    },
    reponse: {
      q: 'Comment coopérez-vous avec les autres professionnels ?',
      p: [
        'Identifier les interlocuteurs du parcours et le rôle de chacun.',
        'Poser le cadre du secret partagé : équipe de soins, et limité au nécessaire.',
        'Distinguer ce qui passe par le patient : école, employeur, assurances.',
        'Construire la transmission en trois temps : ce que j’ai trouvé, ce que cela change, ce que j’attends.',
        'Adapter au destinataire, sur ce qu’il va en faire.',
        'Organiser les relais et vérifier qu’ils ont eu lieu.',
        'Prévenir les deux pannes du parcours : rupture et redondance.',
        'Traiter les désaccords entre professionnels, sur le dossier, jamais devant le patient.'
      ]
    },
    mnemo: [
      ['Trouvé — Conséquence — Attente', 'Les trois éléments d’une transmission utile'],
      ['L’école n’est pas l’équipe de soins', 'Le courrier passe par les parents']
    ]
  };

  D.UE40 = {
    tableaux: [
      { t: 'Un objectif de stage utilisable',
        c: ['Composant', 'Exemple'],
        r: [['Comportement observable', 'Réaliser un cover test alterné chiffré aux prismes'],
            ['Contexte', 'Sur un patient adulte coopérant, en autonomie'],
            ['Critère de réussite', 'Écart < 4 Δ avec la mesure du tuteur'],
            ['À bannir', '« Progresser en strabologie » — invérifiable']] },
      { t: 'Trois difficultés, trois réponses',
        c: ['Nature', 'Signe', 'Réponse'],
        r: [['Connaissances', 'Ne sait pas quoi chercher', 'Lectures ciblées, reprise théorique'],
            ['Geste', 'Sait quoi faire, exécute mal', 'Démonstration, répétition guidée'],
            ['Posture ou sécurité', 'Met le patient en difficulté', 'Signalement immédiat, encadrement rapproché']] }
    ],
    cas: {
      t: 'Un stagiaire qui inquiète',
      s: 'À mi-stage, votre stagiaire de deuxième année reste en retrait, laisse passer des erreurs de mesure sans les relever, et répond aux patients de façon évasive quand il ne sait pas. Le stage se termine dans trois semaines.',
      q: ['Attendez-vous le bilan final ?', 'Comment formulez-vous le retour ?', 'Qu’organisez-vous ?'],
      r: 'Non : attendre la fin est le pire service à lui rendre. Un retour utile est <b>descriptif, précis et immédiat</b> — sur des faits observables, pas sur la personne : « ce matin, sur deux mesures de cover test, l’écart n’a pas été relevé », et non « tu n’es pas rigoureux ».',
      c: 'On identifie d’abord la nature de la difficulté : connaissances, geste, ou posture. Le fait de répondre de façon évasive au patient relève de la posture et se traite sans délai. On formalise un plan de progression avec deux ou trois objectifs observables et une échéance à dix jours, on trace, et on prévient l’institut avant que l’échec soit acquis.'
    },
    reponse: {
      q: 'Comment encadrez-vous un stagiaire ?',
      p: [
        'Accueillir : présenter le lieu, l’équipe, les règles, et négocier les objectifs dès le premier jour.',
        'Écrire des objectifs observables, avec contexte et critère de réussite.',
        'Faire progresser par étapes : observation, participation guidée, autonomie supervisée.',
        'Distinguer évaluation formative, qui accompagne, et certificative, qui valide.',
        'Donner des retours immédiats, descriptifs, équilibrés, suivis d’une proposition.',
        'Identifier la nature d’une difficulté avant d’y répondre : connaissances, geste ou posture.',
        'Tracer, et alerter tôt en cas de difficulté — jamais au bilan final.',
        'Pratiquer l’analyse de sa propre pratique et entretenir ses compétences.'
      ]
    },
    mnemo: [
      ['Observable + Contexte + Critère', 'Les trois composants d’un objectif de stage'],
      ['« Tôt et précis »', 'Un retour tardif ou vague ne sert à rien']
    ]
  };

})();
