/* ============================================================
   Fiches d'UE — années 2 et 3 (semestres 3 à 6)
   Même structure que ueguide.js, qu'il complète.
   ============================================================ */
(function () {
  'use strict';
  var G = (window.UE_GUIDE = window.UE_GUIDE || {});

  /* ============================ SEMESTRE 3 ============================ */

  G.UE24 = {
    resume: 'L’amblyopie : un œil qui n’a pas appris à voir, et une fenêtre de temps pour le lui apprendre.',
    objectifs: [
      'Définir l’amblyopie et ses trois mécanismes',
      'Connaître la période sensible et ce qu’elle implique',
      'Dépister tôt, avec les bons outils selon l’âge'
    ],
    plan: [
      { t: '1 · Définition et physiopathologie',
        p: 'Baisse d’acuité uni ou bilatérale par trouble du développement visuel, sans lésion organique proportionnelle à la baisse. Le mécanisme est cortical : les colonnes de dominance oculaire de l’œil non stimulé régressent au profit de l’œil dominant. C’est un défaut d’<b>apprentissage</b> du cortex visuel, pas une maladie de l’œil — d’où la réversibilité tant que la plasticité persiste.' },
      { t: '2 · Les trois mécanismes',
        p: '<b>Strabique</b> : l’image de l’œil dévié est neutralisée en permanence. <b>Anisométropique</b> : l’œil le plus amétrope reçoit une image floue — la plus sournoise, car l’enfant est asymptomatique et l’œil reste droit ; seul le dépistage la trouve. <b>Par privation</b> (cataracte congénitale, ptosis obstruant, opacité cornéenne) : la plus grave et la plus urgente, car aucune image ne parvient au cortex.' },
      { t: '3 · La période sensible',
        p: 'Plasticité maximale les deux premières années, décroissante ensuite, résiduelle jusqu’à 6–8 ans (et parfois au-delà en cas de perte de l’œil sain). Le pronostic dépend directement de l’âge de début du traitement : une amblyopie par privation non traitée dans les premières semaines de vie est définitive. « Plus tôt, mieux, et plus stable ».' },
      { t: '4 · Reconnaître une amblyopie',
        p: 'Différence d’acuité entre les deux yeux, <b>crowding</b> marqué (écart entre optotypes isolés et alignés), refus de l’occlusion de l’œil sain chez le petit, fixation excentrée dans les formes profondes, mauvaise poursuite d’un œil. Toute mesure d’acuité chez l’enfant se fait donc en isolé <b>et</b> en aligné.' },
      { t: '5 · Le dépistage',
        p: 'Maternité : lueur pupillaire, examen externe. 4 mois : poursuite, reflets cornéens, occlusion alternée. 9 et 24 mois : examens obligatoires du carnet de santé. 3–4 ans : acuité par images ou appariement, stéréotest. Puis dépistage scolaire. Facteurs de risque imposant un examen : prématurité, antécédents familiaux de strabisme ou d’amétropie forte, anomalies neurologiques, trisomie 21.' },
      { t: '6 · Diagnostic différentiel',
        p: 'Avant de conclure à une amblyopie fonctionnelle, éliminer une cause organique : hypoplasie du nerf optique, dystrophie maculaire, cicatrice de toxoplasmose, rétinoblastome. Une amblyopie qui ne progresse pas sous traitement bien conduit doit faire reprendre le fond d’œil et discuter une imagerie.' }
    ],
    chiffres: [
      ['Plasticité maximale', '0 à 2 ans'],
      ['Période sensible', 'jusqu’à 6-8 ans'],
      ['Amblyopie : prévalence', '2 à 4 % des enfants'],
      ['Différence significative', '≥ 2 lignes d’acuité'],
      ['Examens obligatoires', '4 mois, 9 mois, 24 mois'],
      ['Amblyopie par privation', 'urgence des premières semaines']
    ],
    notions: [
      'Trois mécanismes : strabique, anisométropique, par privation.',
      'Le crowding est la signature de l’amblyopie.',
      'Une amblyopie qui ne progresse pas fait rechercher une cause organique.'
    ],
    pieges: [
      'Ne pas tester l’acuité en isolé et en aligné.',
      'Croire l’amblyopie anisométropique visible : l’enfant est asymptomatique et les yeux sont droits.',
      'Oublier d’éliminer une cause organique.'
    ],
    tombe: [
      'Mécanismes comparés et pronostic',
      'Calendrier de dépistage',
      'Diagnostic différentiel d’une amblyopie rebelle'
    ],
    methode: 'Retenez le triptyque mécanisme / âge de début / pronostic, et le calendrier de dépistage : ce sont les deux questions qui reviennent.'
  };

  G.UE25 = {
    resume: 'Traiter l’amblyopie : corriger, occlure, surveiller les deux yeux, sevrer sans récidive.',
    objectifs: [
      'Conduire un traitement d’amblyopie de bout en bout',
      'Adapter la dose d’occlusion et surveiller l’œil sain',
      'Gérer le sevrage et repérer la récidive'
    ],
    plan: [
      { t: '1 · Étape 1 — la correction optique totale',
        p: 'Sous cycloplégie, correction <b>totale</b> de l’amétropie, portée en permanence, réévaluée après 4 à 6 semaines minimum (souvent 12 à 18 semaines pour juger pleinement). À elle seule, elle normalise une part importante des amblyopies anisométropiques : occlure avant, c’est ajouter une contrainte inutile et se priver d’un repère.' },
      { t: '2 · Étape 2 — l’occlusion',
        p: 'Occlusion de l’œil dominant par pansement occlusif sur la peau (pas sur le verre). Dose selon l’âge et la profondeur : de 2 h/jour dans les formes modérées à 6 h dans les formes profondes ; les études montrent qu’au-delà, le gain supplémentaire est faible. Toujours associée à des <b>activités de près</b> pendant l’occlusion (dessin, lecture, jeux fins), qui doublent l’efficacité.' },
      { t: '3 · Alternatives et compléments',
        p: 'Pénalisation optique (surcorrection de l’œil sain, verre dépoli) ou pharmacologique (atropine dans l’œil sain, souvent le week-end) : efficacité comparable à l’occlusion modérée dans les amblyopies légères à modérées, utile en cas de refus, d’allergie au pansement ou de mauvaise observance. Jeux binoculaires et thérapies dichoptiques en complément dans certaines équipes.' },
      { t: '4 · Surveillance',
        p: 'Contrôles rapprochés, d’autant plus que l’enfant est jeune (règle empirique : une semaine de contrôle par année d’âge dans les occlusions fortes du tout-petit). On surveille <b>les deux yeux</b> : l’amblyopie à bascule de l’œil occlus est le risque majeur avant 2 ans. On surveille aussi l’angle, qui peut se modifier sous occlusion.' },
      { t: '5 · Sevrage et entretien',
        p: 'Quand l’acuité est normalisée et stable, on réduit progressivement (jamais d’arrêt brutal) : diminution des heures, puis occlusion d’entretien quelques heures par semaine, puis arrêt avec surveillance prolongée. Le risque de récidive est réel la première année, particulièrement chez les jeunes enfants et les amblyopies profondes.' },
      { t: '6 · Échec : que faire',
        p: 'Vérifier dans l’ordre : la correction est-elle totale et portée ? l’occlusion est-elle réellement faite (carnet de suivi) ? les activités de près sont-elles associées ? la mesure d’acuité est-elle fiable et comparable ? une cause organique a-t-elle été éliminée ? Ce n’est qu’ensuite qu’on parle de plafond thérapeutique.' }
    ],
    chiffres: [
      ['Port de la correction avant occlusion', '4 à 6 semaines minimum'],
      ['Occlusion, forme modérée', '2 h/jour'],
      ['Occlusion, forme profonde', '6 h/jour'],
      ['Contrôle chez le tout-petit', '≈ 1 semaine par année d’âge'],
      ['Atropine en pénalisation', 'souvent 2 jours/semaine'],
      ['Récidive après sevrage', '≈ 25 % la première année']
    ],
    notions: [
      'Correction optique totale d’abord, occlusion ensuite.',
      'Occlusion sans activités de près : moitié moins efficace.',
      'Surveiller l’œil occlus : amblyopie à bascule.'
    ],
    pieges: [
      'Occlure avant d’avoir corrigé.',
      'Arrêter brutalement dès l’acuité normalisée.',
      'Négliger le contrôle de l’œil sain chez le nourrisson.'
    ],
    tombe: [
      'Protocole complet à rédiger avec doses et délais',
      'Conduite devant une amblyopie qui ne progresse plus'
    ],
    methode: 'Le patient « Lucas M. » du module Rééducation reproduit ce protocole : correction déjà portée, puis occlusion et anti-suppression, avec suivi de l’acuité.'
  };

  G.UE26 = {
    resume: 'Quand la correction ne suffit plus : comprendre la basse vision et les moyens de compenser.',
    objectifs: [
      'Définir la basse vision et ses critères',
      'Relier une étiologie à une gêne fonctionnelle',
      'Comprendre et calculer le grossissement'
    ],
    plan: [
      { t: '1 · Définitions',
        p: 'OMS : déficience visuelle modérée si acuité < 3/10, sévère si < 1/10, cécité si < 1/20 ou champ visuel < 10° au meilleur œil avec correction. En France, la basse vision commence en pratique sous 3/10 au meilleur œil corrigé. Retenez que la <b>fonction</b> compte autant que les dixièmes : un champ tubulaire à 5/10 handicape plus qu’un scotome central à 2/10 pour le déplacement.' },
      { t: '2 · Trois profils fonctionnels',
        p: '<b>Atteinte centrale</b> (DMLA, Stargardt) : scotome central, lecture très difficile, reconnaissance des visages perdue, mais déplacement conservé. <b>Atteinte périphérique</b> (glaucome évolué, rétinopathie pigmentaire) : lecture longtemps conservée, déplacement dangereux, héméralopie. <b>Atteinte diffuse ou floue</b> (cataracte évoluée, œdème, opacités) : tout est délavé, l’éblouissement domine.' },
      { t: '3 · Le grossissement',
        p: 'Grossissement nécessaire ≈ acuité souhaitée / acuité actuelle. Règle de <b>Kestenbaum</b> : l’addition nécessaire pour lire un texte standard ≈ inverse de l’acuité décimale (1/10 → +10 D). Le grossissement se paie en champ de lecture : plus on grossit, moins on voit de lettres à la fois, plus la lecture devient laborieuse. On cherche donc le grossissement <b>minimum</b> efficace.' },
      { t: '4 · Éclairage et contraste',
        p: 'Souvent plus rentables que le grossissement, et gratuits : lampe orientable proche du document, 3 à 5 fois l’éclairement usuel, sans reflet ; documents à fort contraste (noir sur blanc), filtres jaunes ou orangés contre l’éblouissement, marqueurs et repères tactiles. C’est le premier réglage à faire, avant toute aide optique.' },
      { t: '5 · Les aides',
        p: 'Optiques : loupes à main, à poser, éclairantes, systèmes microscopiques (fortes additions) et télescopiques (loin). Électroniques : télé-agrandisseurs de table, caméras portables, tablettes avec zoom et synthèse vocale — souvent mieux acceptées par les jeunes et les grands déficits. Non optiques : pupitre, éclairage, filtres, gros caractères, guides d’écriture.' },
      { t: '6 · Le parcours du patient',
        p: 'Ophtalmologiste, orthoptiste, opticien spécialisé, ergothérapeute, instructeur en locomotion, psychologue, associations, MDPH (allocation, aides techniques, reconnaissance). L’orthoptiste est souvent celui qui coordonne et qui explique — c’est un rôle majeur dans cette pathologie chronique.' }
    ],
    chiffres: [
      ['Déficience modérée (OMS)', '< 3/10'],
      ['Déficience sévère', '< 1/10'],
      ['Cécité (OMS)', '< 1/20 ou champ < 10°'],
      ['Kestenbaum', 'addition ≈ 1 / acuité décimale'],
      ['Éclairement recommandé', '3 à 5 × l’usuel'],
      ['Première cause en France', 'DMLA']
    ],
    notions: [
      'On cherche le grossissement minimum efficace, pas le plus fort.',
      'Éclairage et contraste avant toute aide optique.',
      'La basse vision se juge sur la fonction, pas sur les dixièmes.'
    ],
    pieges: [
      'Grossir sans traiter l’éclairage et le contraste.',
      'Proposer un grossissement trop fort : le champ de lecture devient inutilisable.',
      'Oublier le versant déplacement chez les atteintes périphériques.'
    ],
    tombe: [
      'Calcul du grossissement et de l’addition (Kestenbaum)',
      'Choix d’aides selon le profil de déficit'
    ],
    methode: 'Travaillez par profils : pour chaque étiologie, la gêne dominante et les deux aides les plus adaptées. La calculatrice « Distance de sommet & basse vision » fait les calculs.'
  };

  G.UE28 = {
    resume: 'Chercher, trier, citer : la méthode qui rend possible le mémoire de fin d’études.',
    objectifs: [
      'Formuler une question de recherche exploitable',
      'Construire une équation de recherche et trier les sources',
      'Citer correctement dès la première lecture'
    ],
    plan: [
      { t: '1 · La question avant la recherche',
        p: 'Format PICO : population, intervention, comparateur, critère de jugement. « La rééducation orthoptique améliore-t-elle la vitesse de lecture (O) des enfants dyslexiques avec insuffisance de convergence (P) par rapport à l’absence de rééducation (C) ? » Une question floue rend toute recherche bibliographique impossible à conclure.' },
      { t: '2 · Où chercher',
        p: 'PubMed (MeSH), Cochrane Library (revues systématiques), Google Scholar en complément, revues francophones d’orthoptie, thèses et mémoires. Attention aux revues prédatrices et aux sources commerciales déguisées en science.' },
      { t: '3 · Équation et tri',
        p: 'Mots-clés combinés par ET / OU, troncatures, filtres (date, type d’étude, langue). Notez vos équations : elles font partie de la méthode et devront figurer dans le mémoire. Tri en trois passes : titre, résumé, texte intégral, avec critères d’inclusion et d’exclusion écrits à l’avance.' },
      { t: '4 · Niveaux de preuve et citation',
        p: 'Revue systématique et méta-analyse > essai randomisé > cohorte > cas-témoins > série de cas > avis d’expert. Un style de citation unique tenu du début à la fin (Vancouver le plus souvent en santé), avec un gestionnaire de références alimenté dès la première lecture.' }
    ],
    chiffres: [
      ['Format de question', 'PICO'],
      ['Niveau de preuve le plus élevé', 'méta-analyse'],
      ['Passes de tri', '3 (titre / résumé / texte)'],
      ['Style de citation usuel', 'Vancouver']
    ],
    notions: [
      'La question se formule avant de chercher.',
      'Une équation de recherche se note et se justifie.'
    ],
    pieges: [
      'Chercher en vrac et garder ce qui arrange.',
      'Reprendre la bibliographie à la fin de la rédaction.'
    ],
    tombe: ['Construction d’une équation de recherche', 'Classement de sources par niveau de preuve'],
    methode: 'Une dizaine d’heures qui conditionnent 8 ECTS de mémoire : c’est probablement l’UE la plus rentable du cursus.'
  };

  G.UE32 = {
    resume: 'Se faire comprendre, et faire adhérer : l’entretien et l’éducation thérapeutique.',
    objectifs: [
      'Mener un entretien clair avec un patient ou un aidant',
      'Construire une démarche d’éducation thérapeutique',
      'Évaluer la compréhension plutôt que l’information donnée'
    ],
    plan: [
      { t: '1 · Les bases de l’entretien',
        p: 'Questions ouvertes pour explorer, fermées pour préciser. Écoute active, reformulation, silences. Vocabulaire adapté : « votre œil ne travaille pas assez » plutôt que « amblyopie fonctionnelle anisométropique ». On vérifie la compréhension en faisant reformuler, jamais en demandant « vous avez compris ? ».' },
      { t: '2 · L’éducation thérapeutique',
        p: 'Ce n’est pas de l’information, c’est un apprentissage structuré : <b>diagnostic éducatif</b> (que sait le patient, que croit-il, que veut-il ?) → objectifs partagés → séances d’acquisition de compétences → évaluation. Compétences d’auto-soins (poser un cache, faire ses exercices, utiliser sa grille d’Amsler) et d’adaptation (gérer la fatigue, expliquer sa gêne à l’école).' },
      { t: '3 · L’écrit et le suivi',
        p: 'Toute consigne à domicile est remise par écrit, en langage simple, avec le rythme et la durée. Un carnet de suivi (occlusion, exercices) sert autant au patient qu’au thérapeute : il transforme une impression en donnée.' },
      { t: '4 · Situations difficiles',
        p: 'Parent en colère, adolescent qui refuse, patient qui n’adhère pas, annonce mal vécue : ne pas argumenter contre l’émotion, nommer ce qui se passe, revenir aux objectifs concrets et négociables. Savoir reporter une séance vaut mieux qu’une séance forcée.' }
    ],
    chiffres: [
      ['Ce que retient un patient après une consultation', '≈ 20 à 50 %'],
      ['Étapes de l’ETP', '4 (diagnostic éducatif, objectifs, séances, évaluation)']
    ],
    notions: [
      'Vérifier par la reformulation, pas par « vous avez compris ? ».',
      'Ce qui n’est pas écrit n’est pas fait.'
    ],
    pieges: [
      'Donner une consigne irréalisable dans la vie du patient.',
      'Confondre information et éducation thérapeutique.'
    ],
    tombe: ['Construction d’une séance d’ETP', 'Analyse d’un entretien'],
    methode: 'Rédigez les consignes que vous donneriez à un parent pour une occlusion : c’est exactement l’exercice attendu.'
  };

  G.UE37 = {
    resume: 'Passer des chiffres à une décision : le diagnostic orthoptique et le projet de soins.',
    objectifs: [
      'Formuler un diagnostic orthoptique à partir d’un bilan',
      'Construire un projet de soins hiérarchisé et évaluable',
      'Tracer et transmettre'
    ],
    plan: [
      { t: '1 · Le raisonnement clinique',
        p: 'Plainte → hypothèses → examens choisis pour les tester → confirmation ou réfutation → diagnostic orthoptique. Le bilan n’est pas une liste qu’on déroule : chaque test doit répondre à une question. C’est ce qui distingue un professionnel d’un exécutant.' },
      { t: '2 · Le diagnostic orthoptique',
        p: 'Ce n’est pas le diagnostic médical. Il décrit un <b>dysfonctionnement</b> et son <b>retentissement</b> : « insuffisance de convergence avec asthénopie de lecture et retentissement scolaire », et non « exophorie de 14 Δ ». Il doit être compréhensible par le prescripteur et par le patient.' },
      { t: '3 · Le projet de soins',
        p: 'Objectifs mesurables (PPC < 8 cm, disparition des céphalées de lecture), moyens (exercices, prismes, correction), rythme, durée prévisionnelle, critères de réévaluation et surtout critères d’<b>arrêt</b>. Sans critère d’arrêt, une rééducation s’éternise et perd son sens.' },
      { t: '4 · Traçabilité et transmission',
        p: 'Compte rendu daté, chiffré, comparable au précédent, avec conclusion explicite. Adapté au destinataire : le prescripteur veut une conclusion et une proposition ; l’enseignant, des conséquences concrètes en classe ; le patient, ce qu’il doit faire.' }
    ],
    chiffres: [
      ['Structure du projet', 'objectifs / moyens / rythme / réévaluation'],
      ['Réévaluation d’une rééducation', 'toutes les 8 à 10 séances']
    ],
    notions: [
      'Le diagnostic orthoptique décrit un dysfonctionnement et son retentissement.',
      'Pas de projet de soins sans critère d’arrêt.'
    ],
    pieges: [
      'Rédiger un diagnostic orthoptique qui n’est qu’une liste de chiffres.',
      'Oublier de dater et de comparer.'
    ],
    tombe: ['Rédaction d’un diagnostic orthoptique et d’un projet de soins sur dossier'],
    methode: 'À chaque consultation simulée, rédigez les trois lignes : diagnostic orthoptique, retentissement, projet. C’est l’attendu exact de l’examen clinique.'
  };

  /* ============================ SEMESTRE 4 ============================ */

  G.UE21 = {
    resume: 'Lire un article sans se faire avoir, et manier les chiffres dont vous aurez besoin pour le mémoire.',
    objectifs: [
      'Lire un article scientifique avec un œil critique',
      'Comprendre les indicateurs épidémiologiques usuels',
      'Choisir et interpréter un test statistique simple'
    ],
    plan: [
      { t: '1 · Types d’études',
        p: 'Descriptives (transversale, série de cas) et analytiques (cas-témoins rétrospective, cohorte prospective, essai contrôlé randomisé). Le tirage au sort et l’aveugle sont ce qui protège du biais. Retenez les trois grandes familles de biais : sélection, mesure (classement), confusion.' },
      { t: '2 · Mesures épidémiologiques',
        p: 'Prévalence (cas existants / population, une photo) contre incidence (cas nouveaux / temps, un film). Risque relatif dans les cohortes, odds ratio dans les cas-témoins. Un RR de 2 double le risque relatif, pas le risque absolu : toujours regarder le risque de base.' },
      { t: '3 · Tests diagnostiques',
        p: 'Sensibilité = proportion de malades détectés (un test sensible sert à <b>éliminer</b> : « SnNout »). Spécificité = proportion de sains correctement classés (un test spécifique sert à <b>confirmer</b> : « SpPin »). Les valeurs prédictives dépendent de la prévalence : le même test se comporte différemment en dépistage de masse et en consultation spécialisée.' },
      { t: '4 · Statistiques utiles',
        p: 'Décrire avant de tester : moyenne et écart-type si distribution normale, médiane et interquartiles sinon. Comparaison de deux moyennes indépendantes : t de Student (ou Mann-Whitney), appariées : t apparié (ou Wilcoxon) — c’est le cas d’un avant/après rééducation. Variables qualitatives : khi-deux ou Fisher. Corrélation : Pearson ou Spearman.' },
      { t: '5 · Interpréter un p et un intervalle',
        p: 'p < 0,05 signifie « peu probable si l’hypothèse nulle est vraie », pas « important ». Un p non significatif dans un petit échantillon signifie souvent un manque de <b>puissance</b>, pas une absence d’effet. Regardez toujours la taille d’effet et l’intervalle de confiance à 95 %, qui donnent l’amplitude et la précision.' }
    ],
    chiffres: [
      ['Seuil usuel de significativité', 'p < 0,05'],
      ['Intervalle de confiance usuel', '95 %'],
      ['Puissance visée', '80 %'],
      ['SnNout / SpPin', 'sensible → éliminer / spécifique → confirmer'],
      ['Niveau de preuve maximal', 'méta-analyse d’essais randomisés']
    ],
    notions: [
      'Les valeurs prédictives dépendent de la prévalence, pas la sensibilité ni la spécificité.',
      'Un p non significatif ne prouve pas l’absence de différence.'
    ],
    pieges: [
      'Confondre corrélation et causalité.',
      'Confondre prévalence et incidence.',
      'Oublier l’appariement dans une comparaison avant/après.'
    ],
    tombe: ['Lecture critique d’un abstract', 'Calcul et interprétation de sensibilité / spécificité'],
    methode: 'Cette UE se travaille sur des articles, pas sur le cours : prenez trois abstracts d’orthoptie et répondez à cinq questions critiques sur chacun.'
  };

  G.UE22 = {
    resume: 'Quand la lésion est derrière l’œil : localiser à partir du champ, de la motilité et de la pupille.',
    objectifs: [
      'Localiser une lésion à partir d’un déficit campimétrique',
      'Reconnaître une paralysie oculomotrice et juger de son urgence',
      'Identifier les tableaux à ne pas manquer'
    ],
    plan: [
      { t: '1 · Localiser par le champ visuel',
        p: 'Rétine/nerf optique → déficit <b>monoculaire</b> : scotome central (macula, névrite), altitudinal (NOIA), arciforme (glaucome). Chiasma → hémianopsie <b>bitemporale</b> (adénome hypophysaire, craniopharyngiome). Bandelette → hémianopsie latérale homonyme incongruente. Radiations temporales (Meyer) → quadranopsie supérieure homonyme. Radiations pariétales → quadranopsie inférieure. Cortex occipital → hémianopsie très congruente avec épargne maculaire.' },
      { t: '2 · La pupille, examen le plus rentable',
        p: 'Le <b>déficit pupillaire afférent relatif</b> (signe de Marcus Gunn) au test de l’éclairement alterné signe une atteinte asymétrique du nerf optique ou d’une rétine étendue — il est présent même quand le fond d’œil est normal. Une mydriase aréflexique avec ptosis et diplopie évoque une compression du III : imagerie en urgence (anévrisme de la communicante postérieure).' },
      { t: '3 · Paralysie du VI',
        p: 'Ésotropie majorée de loin et dans le regard du côté atteint, limitation de l’abduction, diplopie horizontale homonyme, torticolis tête tournée du côté atteint. Étiologies : microvasculaire (diabète, HTA — régression en 3 à 6 mois), traumatique, tumorale. Attention : c’est aussi un signe d’<b>hypertension intracrânienne</b>, sans valeur localisatrice.' },
      { t: '4 · Paralysie du IV',
        p: 'Hypertropie de l’œil atteint, majorée en adduction et à l’inclinaison de la tête <b>du côté atteint</b> (Bielschowsky positif), diplopie verticale et torsionnelle, torticolis tête inclinée du côté opposé. Souvent congénitale décompensée (photos anciennes : torticolis ancien) ou traumatique. Les trois étapes de Parks permettent de l’identifier.' },
      { t: '5 · Paralysie du III',
        p: 'Ptosis, œil en abduction et légère abaissement, limitation de l’adduction, de l’élévation et de l’abaissement. Forme intrinsèque (mydriase, paralysie de l’accommodation) : compression → urgence. Forme extrinsèque pure (pupille épargnée) : plutôt microvasculaire. La règle « pupille atteinte = imagerie immédiate » est un réflexe à avoir.' },
      { t: '6 · Neuropathies optiques et œdème papillaire',
        p: 'Névrite optique rétrobulbaire : baisse rapide chez le sujet jeune, douleur à la mobilisation, dyschromatopsie rouge-vert, DPAR, fond d’œil normal (« le patient ne voit rien, le médecin non plus ») — penser SEP. NOIA : baisse brutale indolore du sujet âgé, déficit altitudinal, œdème papillaire sectoriel ; éliminer une maladie de Horton (urgence, VS/CRP). Œdème papillaire <b>bilatéral</b> = hypertension intracrânienne jusqu’à preuve du contraire.' }
    ],
    chiffres: [
      ['Fibres croisant au chiasma', 'nasales'],
      ['Quadranopsie supérieure', 'radiations temporales (Meyer)'],
      ['Régression d’une paralysie microvasculaire', '3 à 6 mois'],
      ['Bielschowsky', 'inclinaison du côté atteint majore'],
      ['III avec mydriase', 'imagerie en urgence'],
      ['NORB : latence PEV', 'allongée']
    ],
    notions: [
      'Le DPAR est le signe le plus rentable de l’examen neuro-ophtalmologique.',
      'Œdème papillaire bilatéral = HTIC jusqu’à preuve du contraire.',
      'Une paralysie du VI n’a pas de valeur localisatrice.'
    ],
    pieges: [
      'Oublier de tester la pupille.',
      'Prendre une hémianopsie bitemporale pour un trouble réfractif.',
      'Banaliser une diplopie brutale.'
    ],
    tombe: [
      'Schéma des voies visuelles avec cinq lésions à faire correspondre',
      'Cas de paralysie à identifier (Parks-Bielschowsky)',
      'Signes imposant l’imagerie en urgence'
    ],
    methode: 'Un seul schéma des voies visuelles redessiné jusqu’à l’automatisme couvre l’essentiel. Complétez avec les trois paralysies, leurs torticolis et la règle de la pupille.'
  };

  G.UE23 = {
    resume: 'Rééduquer après une atteinte neurologique : compenser, explorer, retrouver des fonctions.',
    objectifs: [
      'Construire une rééducation adaptée au déficit neurologique',
      'Prendre en charge une diplopie acquise',
      'Accompagner un patient hémianopsique ou héminégligent'
    ],
    plan: [
      { t: '1 · Bilan neuro-orthoptique',
        p: 'Acuités, réfraction, champ visuel, oculomotricité (saccades, poursuites, vergences, nystagmus), vision binoculaire, exploration visuelle et lecture, plus le versant fonctionnel : déplacements, obstacles heurtés, lecture sautée, fatigue. On date toujours l’accident et on cherche la stabilité de l’atteinte.' },
      { t: '2 · Diplopie acquise',
        p: 'Phase aiguë : soulager sans figer — occlusion alternée (jamais permanente du même œil chez l’enfant), secteur occlusif, prisme de Fresnel. On attend la <b>stabilisation</b>, souvent 6 mois, avant tout geste définitif (prisme incorporé, chirurgie). Pendant ce temps : exercices de fusion dans les positions où elle est possible, et surtout information du patient sur l’évolution attendue.' },
      { t: '3 · Hémianopsie latérale homonyme',
        p: 'Le déficit est irréversible : on travaille la <b>compensation</b>. Stratégie de balayage systématique vers l’hémichamp aveugle, agrandissement des saccades d’exploration, entraînement à la lecture (l’HLH droite gêne la progression, la gauche gêne le retour à la ligne). Prismes déviateurs dans certains cas sélectionnés. Objectifs concrets : trottoir, supermarché, lecture d’un texte.' },
      { t: '4 · Héminégligence',
        p: 'Ce n’est <b>pas</b> un déficit sensoriel mais attentionnel : le patient ne regarde pas, alors qu’il pourrait voir. La rééducation vise l’orientation de l’attention (indiçage, ancrage à gauche, tâches bimanuelles, exploration guidée) et non le champ visuel. Un patient négligent nie souvent son trouble : le travail passe par des mises en situation.' },
      { t: '5 · Après traumatisme crânien',
        p: 'Tableau très fréquent et sous-diagnostiqué : fatigue visuelle, insuffisance de convergence, insuffisance ou spasme d’accommodation, gêne aux écrans et aux environnements chargés, photophobie. Ce sont précisément les troubles que la rééducation orthoptique traite bien : le bénéfice fonctionnel peut être majeur.' },
      { t: '6 · Objectifs et coordination',
        p: 'Les objectifs sont fonctionnels : lire, se déplacer, reprendre le travail, la conduite (réglementée selon le champ visuel). Travail en réseau avec neurologue, médecin de rééducation, ergothérapeute, orthophoniste, neuropsychologue.' }
    ],
    chiffres: [
      ['Stabilisation d’une diplopie', '≈ 6 mois'],
      ['Occlusion alternée', 'jamais unilatérale prolongée chez l’enfant'],
      ['HLH : première cause', 'AVC occipital'],
      ['Récupération spontanée d’une HLH', 'surtout les 3 premiers mois']
    ],
    notions: [
      'On ne fige rien avant stabilisation.',
      'L’héminégligence est attentionnelle, pas sensorielle.',
      'Les objectifs sont fonctionnels, pas chiffrés.'
    ],
    pieges: [
      'Rééduquer une diplopie non stabilisée.',
      'Traiter une héminégligence comme une hémianopsie.',
      'Négliger le bilan orthoptique après traumatisme crânien.'
    ],
    tombe: ['Projet de rééducation après AVC occipital', 'Prise en charge d’une diplopie post-traumatique'],
    methode: 'Reliez chaque tableau à un objectif fonctionnel et à un moyen concret : les cas d’examen sont presque toujours AVC, traumatisme crânien ou paralysie oculomotrice.'
  };

  G.UE27 = {
    resume: 'Le bilan et la rééducation basse vision : redonner de la fonction quand l’acuité ne reviendra pas.',
    objectifs: [
      'Réaliser un bilan fonctionnel de basse vision',
      'Rechercher et entraîner une fixation excentrée',
      'Construire un projet avec des objectifs concrets'
    ],
    plan: [
      { t: '1 · Le bilan fonctionnel',
        p: 'Acuités de loin et de près en logMAR (échelles adaptées, à distance réduite si besoin), sensibilité aux contrastes, champ visuel (dont microperimétrie si disponible), éblouissement, vitesse de lecture (mots/minute) et taille de caractère critique. Et surtout : ce que le patient veut refaire. Un bilan basse vision qui ne recense pas les besoins ne sert à rien.' },
      { t: '2 · Le scotome et la fixation excentrée',
        p: 'Dans les atteintes maculaires, le patient adopte spontanément un <b>locus rétinien préférentiel</b>. On le repère (grille d’Amsler, microperimétrie, observation de la fixation) puis on l’entraîne : le placer de préférence en dessous ou à gauche du scotome pour la lecture en français, le stabiliser, l’automatiser. C’est le cœur de la rééducation maculaire.' },
      { t: '3 · La rééducation',
        p: 'Stabilisation de la fixation → balayage et poursuite → repérage → lecture avec aide → mise en situation. Séances courtes et rapprochées, matériel du quotidien (courrier, étiquettes, écran), progression sur la taille puis sur la vitesse. On rééduque une <b>stratégie</b>, pas une acuité.' },
      { t: '4 · Les aides, en pratique',
        p: 'Essai systématique avant prescription, avec l’éclairage définitif et sur un texte réel. Additions fortes et distances de travail très courtes à expliquer, loupes selon la préhension et le tremblement, télé-agrandisseur pour les longues lectures, tablette pour la polyvalence. L’acceptation dépend autant de l’esthétique et du poids que de l’optique.' },
      { t: '5 · Le déplacement et la vie quotidienne',
        p: 'Atteintes périphériques : locomotion, canne, contraste au sol, éclairage des escaliers, adaptation du domicile. On coordonne avec l’instructeur en locomotion et l’ergothérapeute. La sécurité prime sur la lecture chez ces patients.' },
      { t: '6 · Projet et suivi',
        p: 'Objectifs négociés et réévalués : « relire mon courrier », « reconnaître mes petits-enfants », « refaire mes chèques ». Bilan de reprise à distance, adaptation des aides quand la pathologie évolue, veille sur le retentissement thymique — la dépression est fréquente et sous-diagnostiquée dans la basse vision.' }
    ],
    chiffres: [
      ['Vitesse de lecture confortable', '> 80 mots/min'],
      ['Locus rétinien préférentiel', 'plutôt en dessous / à gauche du scotome'],
      ['Séances', 'courtes et rapprochées'],
      ['Essai des aides', 'systématique avant prescription']
    ],
    notions: [
      'On rééduque une stratégie, pas une acuité.',
      'Le bilan part des besoins du patient.',
      'La sécurité du déplacement prime dans les atteintes périphériques.'
    ],
    pieges: [
      'Viser l’acuité au lieu de la fonction.',
      'Prescrire une aide sans essai en conditions réelles.',
      'Négliger la fatigue et le retentissement psychologique.'
    ],
    tombe: ['Bilan de basse vision sur un cas de DMLA', 'Projet de rééducation avec objectifs et aides'],
    methode: 'Prenez trois patients types — DMLA, glaucome évolué, rétinopathie pigmentaire — et rédigez pour chacun bilan, objectifs, aides et déroulé des séances.'
  };

  /* ============================ SEMESTRE 5 ============================ */

  G.UE29 = {
    resume: 'Vision et apprentissages : ce que l’orthoptiste explore, ce qu’il traite, et ce qu’il ne traite pas.',
    objectifs: [
      'Situer la place du bilan orthoptique dans les troubles des apprentissages',
      'Explorer les fonctions visuelles impliquées dans la lecture',
      'Rédiger un compte rendu utile aux autres professionnels'
    ],
    plan: [
      { t: '1 · Comment on lit',
        p: 'La lecture est une succession de saccades de progression (7 à 9 caractères), de fixations d’environ 200 à 250 ms pendant lesquelles l’information est prélevée, et de régressions (10 à 15 % chez le bon lecteur). L’empan visuel — le nombre de caractères utilisables autour du point de fixation — conditionne la vitesse. Un trouble oculomoteur gêne ce mécanisme sans être une dyslexie.' },
      { t: '2 · Ce que l’orthoptiste explore',
        p: 'Acuité et réfraction (une hypermétropie non corrigée fatigue), convergence (PPC répété, amplitudes), accommodation (amplitude, souplesse, accommodation relative), motricité (saccades, poursuites, stabilité de fixation), vision binoculaire, sensibilité aux contrastes. Le tout en conditions de lecture réelles, pas seulement au réfracteur.' },
      { t: '3 · Ce qu’il traite',
        p: 'Insuffisance de convergence, insuffisance ou inertie accommodative, troubles de la fixation et des saccades : ces troubles sont fréquents chez les enfants en difficulté et répondent bien à la rééducation. Le bénéfice porte sur le <b>confort et l’endurance</b> de lecture, parfois sur la vitesse — jamais sur le décodage lui-même.' },
      { t: '4 · Ce qu’il ne traite pas',
        p: 'La dyslexie est un trouble spécifique du langage écrit, d’origine phonologique : elle relève de l’orthophoniste. L’orthoptiste ne pose pas ce diagnostic et ne doit pas laisser croire qu’il le traite. Les méthodes prétendant guérir la dyslexie par des exercices visuels ou des filtres colorés n’ont pas de niveau de preuve suffisant.' },
      { t: '5 · Le compte rendu et le réseau',
        p: 'Chiffres, interprétation, retentissement, proposition, et ce qui relève d’un autre professionnel. Le destinataire est souvent l’orthophoniste, l’enseignant, le médecin scolaire ou le neuropédiatre : le document doit être lisible par eux. Aménagements possibles en classe : place, taille de police, temps, photocopies contrastées.' }
    ],
    chiffres: [
      ['Durée d’une fixation en lecture', '200 à 250 ms'],
      ['Amplitude d’une saccade de lecture', '7 à 9 caractères'],
      ['Régressions du bon lecteur', '10 à 15 %'],
      ['Souplesse accommodative (enfant)', '≥ 5 cycles/min'],
      ['PPC normal', '≤ 6 à 8 cm']
    ],
    notions: [
      'L’orthoptiste traite le confort visuel de lecture, pas le décodage.',
      'La dyslexie est un trouble phonologique : diagnostic orthophonique.'
    ],
    pieges: [
      'Laisser croire qu’une rééducation orthoptique traite la dyslexie.',
      'Conclure sur un seul PPC sans tester la fatigabilité.'
    ],
    tombe: ['Bilan à proposer devant une plainte de lecture', 'Limites du champ orthoptique à expliciter'],
    methode: 'Retenez la frontière : ce que l’orthoptiste explore, ce qu’il traite, ce qu’il transmet. C’est la question centrale de l’UE.'
  };

  G.UE30 = {
    resume: 'La vision comme fonction cérébrale : troubles neurovisuels, exploration, équilibre et posture.',
    objectifs: [
      'Reconnaître un trouble neurovisuel',
      'Comprendre les liens entre vision, vestibule et proprioception',
      'Adapter la rééducation au contexte neurologique'
    ],
    plan: [
      { t: '1 · Les troubles neurovisuels',
        p: 'Agnosie visuelle (voir sans reconnaître), prosopagnosie (visages), simultagnosie et syndrome de Balint (ne percevoir qu’un objet à la fois, ataxie optique, apraxie du regard), alexie sans agraphie, troubles de l’exploration. Ils ne se voient pas sur une échelle d’acuité : c’est la mise en situation qui les révèle.' },
      { t: '2 · Vision et équilibre',
        p: 'L’équilibre repose sur trois entrées — visuelle, vestibulaire, proprioceptive — intégrées en permanence. Un conflit entre elles produit instabilité, vertiges, cinétose. Avec l’âge, la dépendance visuelle augmente : d’où les chutes dans la pénombre, sur sol contrasté ou après un changement de correction (progressifs, forte anisométropie).' },
      { t: '3 · Nystagmus',
        p: 'Congénital : pas d’oscillopsie (le cerveau a appris à compenser), zone neutre avec torticolis, souvent amélioré par la convergence. Acquis : oscillopsies, instabilité, souvent d’origine vestibulaire ou centrale — il impose un bilan neurologique. Le sens de la phase rapide donne son nom au nystagmus.' },
      { t: '4 · Rééducation neurovisuelle',
        p: 'Elle vise des <b>stratégies compensatoires</b> en situation écologique : exploration organisée, ancrage, ralentissement volontaire, double tâche progressive. Séances courtes (fatigabilité majeure), objectifs très concrets, transfert au quotidien travaillé explicitement — un progrès en cabinet qui ne se transfère pas ne sert à rien.' },
      { t: '5 · Personne âgée et chutes',
        p: 'La vision intervient dans la moitié des chutes du sujet âgé. À vérifier : correction adaptée et à jour, cataracte, champ visuel, sensibilité aux contrastes, adaptation aux progressifs, éclairage du domicile, contraste des marches. Un conseil simple peut éviter une fracture.' }
    ],
    chiffres: [
      ['Entrées de l’équilibre', '3 (visuelle, vestibulaire, proprioceptive)'],
      ['Nystagmus congénital', 'pas d’oscillopsie'],
      ['Nystagmus acquis', 'oscillopsies → bilan neurologique'],
      ['Part de la vision dans les chutes', 'importante chez le sujet âgé']
    ],
    notions: [
      'Un trouble neurovisuel n’est pas une baisse d’acuité.',
      'Oscillopsies = nystagmus acquis jusqu’à preuve du contraire.'
    ],
    pieges: [
      'Confondre trouble neurovisuel et déficit sensoriel.',
      'Négliger le risque de chute lors d’un changement de correction chez le sujet âgé.'
    ],
    tombe: ['Analyse d’un tableau post-AVC', 'Rôle de la vision dans l’équilibre'],
    methode: 'Chaque trouble se retient par la scène quotidienne qu’il rend impossible : c’est la meilleure accroche mnésique pour cette UE.'
  };

  G.UE31 = {
    resume: 'Dépister au bon âge, et adapter l’environnement visuel — l’orthoptiste en amont du soin.',
    objectifs: [
      'Conduire un dépistage adapté à l’âge',
      'Analyser un poste de travail sur écran',
      'Donner des conseils d’hygiène visuelle argumentés'
    ],
    plan: [
      { t: '1 · Le calendrier du dépistage',
        p: 'Maternité : lueur pupillaire, dépistage des anomalies évidentes. 4 mois : poursuite, reflets, occlusion alternée. 9 et 24 mois : examens obligatoires. 3–4 ans : acuité par images, stéréotest, réfraction si facteur de risque. Bilan de 6 ans, puis dépistages scolaires. Adulte : après 40 ans, pression et fond d’œil, plus tôt si antécédents familiaux, myopie forte, diabète.' },
      { t: '2 · Comment on dépiste',
        p: 'Standardiser les conditions (distance, éclairage, correction portée), tester œil par œil, savoir orienter plutôt que conclure. Le dépistage ne pose pas de diagnostic : il repère un écart à la norme et déclenche un examen complet.' },
      { t: '3 · Le travail sur écran',
        p: 'Écran à 50–70 cm, bord supérieur à hauteur des yeux ou légèrement en dessous, perpendiculaire aux fenêtres, sans reflet. Texte suffisamment grand, contraste élevé, luminosité de l’écran ajustée à la pièce. Poste et siège adaptés : l’ergonomie visuelle et posturale vont ensemble.' },
      { t: '4 · Hygiène visuelle',
        p: 'Règle 20-20-20 : toutes les 20 minutes, regarder à 20 pieds (6 m) pendant 20 secondes — elle relâche accommodation et convergence. La <b>sécheresse</b> est la première cause de plainte sur écran : la fréquence de clignement chute de moitié en fixation attentive. Le rôle de la lumière bleue dans la fatigue visuelle est très surestimé — cherchez d’abord sécheresse, réfraction et binocularité.' },
      { t: '5 · Myopie de l’enfant : prévention',
        p: 'Progression fortement liée au travail de près prolongé et au manque d’extérieur. Recommandation solide : au moins 2 heures d’extérieur par jour, pauses régulières, distance de lecture supérieure à 30 cm. En freination : atropine faible dose, verres et lentilles à défocalisation périphérique, orthokératologie.' }
    ],
    chiffres: [
      ['Examens obligatoires du nourrisson', '4, 9 et 24 mois'],
      ['Distance écran', '50 à 70 cm'],
      ['Règle', '20 min / 6 m / 20 s'],
      ['Chute du clignement sur écran', '≈ 50 %'],
      ['Extérieur recommandé (enfant)', '≥ 2 h/jour'],
      ['Dépistage adulte', 'à partir de 40 ans']
    ],
    notions: [
      'Le dépistage oriente, il ne conclut pas.',
      'Sur écran, la sécheresse passe avant la lumière bleue.',
      'Deux heures d’extérieur par jour freinent la myopie de l’enfant.'
    ],
    pieges: [
      'Tout attribuer à la lumière bleue.',
      'Dépister sans standardiser les conditions.'
    ],
    tombe: ['Calendrier de dépistage à restituer', 'Analyse d’un poste de travail avec conseils'],
    methode: 'Deux fiches suffisent : le calendrier par âge, et la check-list d’ergonomie du poste.'
  };

  G.UE33 = {
    resume: 'Les machines : ce qu’elles mesurent vraiment, et comment ne pas se tromper en les lisant.',
    objectifs: [
      'Comprendre le principe des imageries ophtalmologiques',
      'Reconnaître les images normales et les artefacts',
      'Utiliser les outils numériques du cabinet'
    ],
    plan: [
      { t: '1 · OCT',
        p: 'Tomographie par cohérence optique : interférométrie en lumière faiblement cohérente, résolution micrométrique, sans contact. Analyse maculaire (épaisseur, logettes, fluide, membrane épirétinienne, trou) et papillaire (RNFL, complexe cellulaire ganglionnaire). Les cartes colorées ne sont qu’une <b>comparaison à une base de données normative</b> : un « rouge » peut n’être qu’une variation anatomique (forte myopie, grande papille).' },
      { t: '2 · Angiographie et angio-OCT',
        p: 'Angiographie à la fluorescéine : dynamique, montre les diffusions et les ischémies, mais injection et effets indésirables possibles. Vert d’indocyanine pour la choroïde. Angio-OCT : cartographie vasculaire couche par couche, sans injection, mais ne montre pas les diffusions — les deux sont complémentaires.' },
      { t: '3 · Cornée et segment antérieur',
        p: 'Topographie et tomographie cornéennes (kératocône, chirurgie réfractive), pachymétrie (l’épaisseur cornéenne module l’interprétation de la PIO), microscopie spéculaire (densité endothéliale), OCT de segment antérieur (angle irido-cornéen).' },
      { t: '4 · Biométrie et rétinophotographie',
        p: 'Biométrie optique pour le calcul d’implant avant cataracte (longueur axiale, kératométrie, profondeur de chambre). Rétinophotographie couleur et grand champ pour le dépistage et la télémédecine, avec lecture différée par un lecteur formé.' },
      { t: '5 · Qualité, artefacts et données',
        p: 'Toujours vérifier : indice de qualité du signal, centrage, mouvements, segmentation automatique parfois fausse en cas d’œdème ou de forte myopie. Ne jamais comparer deux examens d’appareils différents. Côté numérique : dossier patient informatisé, RGPD, sauvegarde, transmission sécurisée des images.' }
    ],
    chiffres: [
      ['Résolution axiale de l’OCT', '≈ 5 µm'],
      ['RNFL moyen normal', '≈ 90 à 100 µm'],
      ['Épaisseur maculaire centrale', '≈ 250 à 280 µm'],
      ['Pachymétrie normale', '≈ 540 µm'],
      ['Densité endothéliale à 20 ans', '≈ 3 000 cell/mm²']
    ],
    notions: [
      'Les cartes OCT comparent à une base normative : le rouge n’est pas un diagnostic.',
      'Angiographie et angio-OCT sont complémentaires, pas interchangeables.'
    ],
    pieges: [
      'Interpréter une carte sans regarder les coupes brutes.',
      'Comparer des examens réalisés sur deux appareils différents.'
    ],
    tombe: ['Reconnaissance d’images OCT typiques', 'Indications comparées des examens d’imagerie'],
    methode: 'Regardez beaucoup d’images normales : c’est le seul moyen de repérer ce qui ne l’est pas.'
  };

  G.UE41 = {
    resume: 'Les gestes qui sauvent, et les trois urgences oculaires où la minute compte.',
    objectifs: [
      'Reconnaître une détresse vitale et alerter',
      'Réaliser les gestes de premiers secours',
      'Réagir devant une urgence au cabinet'
    ],
    plan: [
      { t: '1 · Chaîne de survie',
        p: 'Reconnaître (inconscience, absence de respiration normale) → alerter (15 ou 112) → masser (30 compressions / 2 insufflations, 100 à 120/min, 5 à 6 cm de profondeur) → défibriller dès que le DAE est disponible. Le massage prime sur tout le reste ; les compressions ne doivent presque jamais s’interrompre.' },
      { t: '2 · Situations fréquentes au cabinet',
        p: 'Malaise vagal (fréquent après instillation, mesure prolongée ou émotion) : allonger, jambes surélevées, desserrer, surveiller la conscience. Hypoglycémie, crise convulsive (protéger sans contenir), obstruction des voies aériennes (méthode de Heimlich), réaction allergique à un collyre.' },
      { t: '3 · Les urgences oculaires',
        p: '<b>Brûlure chimique</b> : rinçage abondant immédiat au sérum physiologique ou à l’eau, au moins 15 à 20 minutes, <b>avant</b> tout examen — c’est le seul cas où l’on ne mesure pas l’acuité d’abord ; les bases sont plus graves que les acides. <b>Traumatisme perforant</b> : ne jamais comprimer, protéger par une coque, à jeun, avis immédiat. <b>Occlusion de l’artère centrale</b> et <b>glaucome aigu</b> : orientation en urgence.' },
      { t: '4 · Cadre',
        p: 'L’attestation AFGSU de niveau 2 est requise et se renouvelle tous les 4 ans. Connaître l’emplacement du DAE, la trousse d’urgence et le protocole d’alerte de sa structure fait partie du minimum professionnel.' }
    ],
    chiffres: [
      ['Compressions thoraciques', '100 à 120/min, 5-6 cm'],
      ['Cycle', '30 compressions / 2 insufflations'],
      ['Rinçage d’une brûlure chimique', '≥ 15 à 20 min'],
      ['Numéros', '15 (SAMU) · 112 (Europe)'],
      ['Validité AFGSU', '4 ans']
    ],
    notions: [
      'Brûlure chimique : on rince d’abord, longuement, on examine ensuite.',
      'Traumatisme perforant : jamais de compression.'
    ],
    pieges: [
      'Mesurer l’acuité avant de rincer une brûlure chimique.',
      'Interrompre longuement le massage cardiaque.'
    ],
    tombe: ['Conduite devant une brûlure chimique', 'Chaîne de survie'],
    methode: 'UE validée en présentiel : retenez surtout les trois urgences oculaires où la minute compte, et la conduite du massage.'
  };

  /* ============================ SEMESTRE 6 ============================ */

  G.UE34 = {
    resume: 'Exercer : statuts, cotation, protocoles de coopération et responsabilités.',
    objectifs: [
      'Connaître les modes d’exercice et leurs contraintes',
      'Comprendre la cotation et la relation avec l’assurance maladie',
      'Se situer dans le parcours de soins'
    ],
    plan: [
      { t: '1 · Modes d’exercice',
        p: 'Libéral (installation, contrat, patientèle, cotation, comptabilité), salarié (hôpital, centre de santé, cabinet d’ophtalmologie), ou mixte. Chacun a ses contraintes : autonomie et charges d’un côté, cadre et volume de l’autre. Le travail aidé en cabinet d’ophtalmologie est devenu un débouché majeur.' },
      { t: '2 · Actes et cotation',
        p: 'Les actes sont cotés selon la nomenclature ; bilan orthoptique et séances de rééducation obéissent à des règles de prescription, de nombre et de compte rendu. Le compte rendu au prescripteur n’est pas une politesse : il conditionne la prise en charge et la poursuite du traitement.' },
      { t: '3 · Protocoles de coopération et travail aidé',
        p: 'L’orthoptiste réalise des examens préalables (acuité, réfraction, tonométrie, rétinophotographie, OCT) sous la responsabilité de l’ophtalmologiste, qui pose le diagnostic et prescrit. Ce modèle a considérablement réduit les délais d’accès aux soins. S’y ajoutent les extensions récentes : accès direct encadré, renouvellement et adaptation des corrections sous conditions.' },
      { t: '4 · Responsabilités et obligations',
        p: 'Responsabilité civile professionnelle (assurance obligatoire), pénale, disciplinaire. Obligations : formation continue et développement professionnel continu, traçabilité des actes, mise à jour des connaissances, respect du secret et du consentement.' }
    ],
    chiffres: [
      ['Assurance responsabilité civile', 'obligatoire'],
      ['Compte rendu au prescripteur', 'systématique'],
      ['DPC', 'obligation continue']
    ],
    notions: [
      'Le travail aidé se fait sous la responsabilité de l’ophtalmologiste.',
      'L’accès direct est encadré par des conditions précises.'
    ],
    pieges: ['Confondre accès direct et absence de cadre réglementaire.'],
    tombe: ['Modes d’exercice et cotation', 'Place de l’orthoptiste dans le parcours de soins'],
    methode: 'UE de fin de cursus, très concrète : elle prépare votre installation autant que l’examen.'
  };

  G.UE35 = {
    resume: 'Dépister, prévenir, suivre : l’orthoptiste dans la durée, en réseau avec le médecin.',
    objectifs: [
      'Organiser un dépistage et un suivi de pathologie chronique',
      'Connaître les conditions de renouvellement des corrections',
      'Repérer ce qui impose un avis médical'
    ],
    plan: [
      { t: '1 · Dépistages organisés',
        p: 'Rétinopathie diabétique : fond d’œil ou rétinophotographies annuelles (espacement possible à 2 ans si diabète bien équilibré, sans rétinopathie et sans autre facteur), lecture différée possible en télémédecine. Glaucome : dépistage ciblé après 40 ans si antécédents familiaux, myopie forte, origine africaine, cornée fine. Enfant : calendrier des examens obligatoires et bilan de 6 ans.' },
      { t: '2 · Suivi des pathologies chroniques',
        p: 'Glaucome : couplage OCT et champ visuel, rythme selon le stade et la vitesse de progression. DMLA : OCT et autosurveillance par grille d’Amsler avec consigne écrite. Diabète : coordination avec le diabétologue, l’équilibre glycémique conditionne le pronostic oculaire.' },
      { t: '3 · Renouvellement et adaptation',
        p: 'L’orthoptiste peut, sous conditions, adapter ou renouveler une correction : conditions d’âge, ancienneté de la prescription, absence de pathologie évolutive, obligation de tracer et d’informer le prescripteur, et de renvoyer vers le médecin en cas d’anomalie. Sortir de ces conditions engage la responsabilité.' },
      { t: '4 · Prévention et éducation',
        p: 'Hygiène visuelle sur écran, freination de la myopie chez l’enfant, protection solaire (UV, cataracte, DMLA), sevrage tabagique (facteur de risque majeur de DMLA), équilibre tensionnel et glycémique. La prévention fait partie du soin.' },
      { t: '5 · Les signaux d’alerte',
        p: 'Baisse d’acuité inexpliquée ou brutale, déficit campimétrique nouveau, diplopie récente, métamorphopsies récentes, œil rouge douloureux, mydriase avec ptosis, œdème papillaire. Chacun impose un avis médical, parfois le jour même.' }
    ],
    chiffres: [
      ['Dépistage rétinopathie diabétique', 'annuel (2 ans si conditions réunies)'],
      ['Dépistage glaucome ciblé', 'dès 40 ans si facteurs de risque'],
      ['Amsler', 'autosurveillance quotidienne, œil par œil'],
      ['Tabac et DMLA', 'facteur de risque majeur']
    ],
    notions: [
      'Le renouvellement par l’orthoptiste est possible mais conditionné.',
      'Métamorphopsies récentes : avis rapide.'
    ],
    pieges: [
      'Renouveler une correction hors des conditions prévues.',
      'Rassurer devant une déformation des lignes récente.'
    ],
    tombe: ['Organisation d’un dépistage', 'Conditions de renouvellement des corrections'],
    methode: 'Faites une fiche « quand j’appelle le médecin » : elle vaut pour l’examen comme pour le stage.'
  };

  G.UE36 = {
    resume: 'Le bilan avant et après chirurgie : ce qu’on mesure, ce qu’on opère, ce qu’on promet.',
    objectifs: [
      'Réaliser un bilan pré et post-opératoire de strabisme',
      'Connaître les techniques chirurgicales et leurs suites',
      'Informer sur ce que la chirurgie peut et ne peut pas faire'
    ],
    plan: [
      { t: '1 · Le bilan pré-opératoire',
        p: 'Angle mesuré à plusieurs reprises et <b>stable</b>, de loin et de près, dans les 9 positions, avec et sans correction, avec l’œil droit puis l’œil gauche fixateur. Réfraction sous cycloplégie à jour, état sensoriel (risque de diplopie post-opératoire), test aux prismes pour prévoir la tolérance, photographies. On note aussi les antécédents chirurgicaux : une réintervention modifie la dose.' },
      { t: '2 · Les techniques',
        p: '<b>Affaiblissement</b> : recul (on déplace l’insertion en arrière), myectomie, fils de Cüppers (fil rétro-équatorial pour réduire l’action dans le champ d’action du muscle). <b>Renforcement</b> : résection (on raccourcit), plissement (réversible). <b>Transposition</b> musculaire dans les paralysies (Hummelsheim, Jensen). Chirurgie sur un ou deux yeux, un ou plusieurs muscles, selon l’angle et la comitance.' },
      { t: '3 · Dosages et principes',
        p: 'Ordre de grandeur sur les droits horizontaux : environ 2 à 3 Δ corrigés par millimètre de recul ou de résection, variable selon les équipes, l’âge et l’angle. Un grand angle se répartit sur plusieurs muscles. La chirurgie ajustable (fil temporaire) permet un réglage post-opératoire chez l’adulte coopérant.' },
      { t: '4 · Suites et complications',
        p: 'Rougeur et gêne plusieurs semaines, diplopie transitoire fréquente chez l’adulte, hypo ou hypercorrection, réintervention non exceptionnelle (10 à 30 % selon les séries et les tableaux). Complications rares mais graves : perforation sclérale, muscle perdu, infection. Le bilan post-opératoire précoce puis à distance juge du résultat, qui ne se stabilise qu’après plusieurs semaines.' },
      { t: '5 · Ce qu’on annonce au patient',
        p: 'La chirurgie corrige un <b>angle</b> : elle améliore l’esthétique, parfois le torticolis, parfois la diplopie. Elle ne restaure pas une vision binoculaire absente depuis l’enfance, ni l’acuité d’un œil amblyope. Cette information, donnée avant, évite la déception après.' }
    ],
    chiffres: [
      ['Effet par mm (droits horizontaux)', '≈ 2 à 3 Δ'],
      ['Angle requis', 'stable sur plusieurs mesures'],
      ['Réintervention', '10 à 30 % selon les séries'],
      ['Stabilisation du résultat', 'plusieurs semaines']
    ],
    notions: [
      'On opère un angle stable, avec correction optique optimale.',
      'Recul = affaiblit, résection/plissement = renforce.',
      'La chirurgie ne crée pas de vision binoculaire.'
    ],
    pieges: [
      'Opérer sur un angle non stabilisé.',
      'Promettre une vision binoculaire à un strabisme congénital opéré tardivement.'
    ],
    tombe: ['Bilan pré-opératoire à conduire', 'Principe des techniques et suites'],
    methode: 'Reliez chaque technique au geste (affaiblir / renforcer) et à son indication : c’est ce qui est demandé.'
  };

  G.UE38 = {
    resume: 'Le mémoire : 8 ECTS, le plus gros bloc du cursus — et il se joue sur le calendrier.',
    objectifs: [
      'Construire une question de recherche précise',
      'Conduire une méthode et l’écrire',
      'Rédiger et soutenir'
    ],
    plan: [
      { t: '1 · Le sujet et la question',
        p: 'Un sujet trop large est la cause première d’échec. Format PICO, question à laquelle on peut répondre avec les moyens dont on dispose, en un an, sur une population accessible. Vérifiez d’emblée la faisabilité : combien de patients, où, avec quel accord.' },
      { t: '2 · La méthode',
        p: 'Type d’étude, population, critères d’inclusion et d’exclusion, matériel, protocole de mesure, critère de jugement principal <b>défini à l’avance</b>, analyse statistique prévue. Cadre éthique : information, consentement, anonymisation, RGPD. Une méthode figée avant le recueil évite les résultats « bricolés » ensuite.' },
      { t: '3 · Résultats et discussion',
        p: 'Les résultats se décrivent sans être interprétés : effectifs, caractéristiques, critère principal, secondaires, tableaux et figures lisibles seuls. La discussion reprend le résultat principal, le confronte à la littérature, expose honnêtement les <b>limites</b> (effectif, biais, généralisation) et conclut sur la portée pratique.' },
      { t: '4 · Calendrier réaliste',
        p: 'Semestre 5 : sujet, bibliographie, méthode. Début du semestre 6 : recueil. Puis analyse, rédaction, relectures, dépôt. Écrire au fil de l’eau (introduction et méthode dès le recueil) évite le mur de février. La bibliographie se tient depuis le premier jour, avec un gestionnaire de références.' },
      { t: '5 · La soutenance',
        p: 'Dix minutes, trois messages, un plan clair : pourquoi cette question, comment j’y ai répondu, ce que j’ai trouvé et ce que ça change. Assumer une limite plutôt que la cacher : le jury la verra de toute façon, et l’assumer est un signe de maturité scientifique.' }
    ],
    chiffres: [
      ['Poids du mémoire', '8 ECTS'],
      ['Volume UE38', '132 h dont 120 de travail personnel'],
      ['Soutenance', '≈ 10 min de présentation'],
      ['Début conseillé', 'semestre 5']
    ],
    notions: [
      'Le critère de jugement principal se définit avant le recueil.',
      'Les résultats ne s’interprètent pas dans la partie résultats.'
    ],
    pieges: [
      'Choisir un sujet trop large.',
      'Commencer la rédaction sans méthode figée.',
      'Reprendre la bibliographie à la fin.'
    ],
    tombe: ['Le mémoire lui-même, et sa soutenance'],
    methode: 'Commencez au semestre 5, pas en janvier du semestre 6 : question en octobre, méthode en novembre, écriture au fil de l’eau.'
  };

  G.UE39 = {
    resume: 'Travailler avec les autres : transmettre juste ce qu’il faut, à qui il faut.',
    objectifs: [
      'Travailler avec les autres professionnels du parcours',
      'Transmettre une information utile et proportionnée',
      'Organiser un relais'
    ],
    plan: [
      { t: '1 · Les interlocuteurs',
        p: 'Ophtalmologiste (prescripteur et responsable médical), opticien, orthophoniste, ergothérapeute, psychomotricien, neuropsychologue, enseignant et médecin scolaire, médecin du travail, instructeur en locomotion, MDPH, associations de patients.' },
      { t: '2 · Ce qu’est une bonne transmission',
        p: 'Trois éléments : ce que j’ai trouvé (chiffré), ce que cela change pour le patient, ce que j’attends du destinataire. Adaptée au lecteur : le médecin veut une conclusion et une proposition, l’enseignant veut des conséquences concrètes en classe, la famille veut savoir quoi faire.' },
      { t: '3 · Secret partagé et cadre',
        p: 'Le secret est partagé au sein de l’équipe de soins, limité à ce qui est nécessaire à la prise en charge. En dehors de l’équipe (école, employeur), l’information passe par le patient ou nécessite son accord explicite.' },
      { t: '4 · Organiser un relais',
        p: 'Quand la situation dépasse le champ orthoptique : nommer ce qu’on a observé, indiquer vers qui on oriente et pourquoi, s’assurer que le relais a bien eu lieu. Un patient perdu entre deux professionnels est un échec de parcours.' }
    ],
    chiffres: [
      ['Éléments d’une transmission', '3 : trouvé / conséquence / attente'],
      ['Secret partagé', 'limité à l’équipe de soins']
    ],
    notions: ['La transmission s’adapte au destinataire, pas au rédacteur.'],
    pieges: ['Envoyer un compte rendu illisible pour son destinataire.'],
    tombe: ['Cas de coordination pluriprofessionnelle'],
    methode: 'Rédigez le même bilan pour deux destinataires — l’ophtalmologiste et l’enseignant : c’est l’exercice type.'
  };

  G.UE40 = {
    resume: 'Encadrer, s’auto-évaluer, se former : ce qui fait durer un professionnel.',
    objectifs: [
      'Encadrer un stagiaire ou un pair',
      'Analyser sa propre pratique',
      'Entretenir ses compétences'
    ],
    plan: [
      { t: '1 · Le tutorat',
        p: 'Objectifs de stage explicites et négociés dès le premier jour, progression observation → participation → autonomie supervisée, temps de reprise réguliers. On évalue une compétence observable, pas une personne.' },
      { t: '2 · Évaluation formative et sommative',
        p: 'La formative accompagne et corrige en cours de route ; la sommative valide à la fin. Les confondre transforme chaque remarque en sanction et bloque l’apprentissage. Un retour utile est descriptif, précis, immédiat et suivi d’une proposition.' },
      { t: '3 · Analyse de pratique',
        p: 'Décrire la situation, ce qui a été fait, ce qui a été ressenti, ce qui pourrait être fait autrement — sans jugement de valeur. Pratiquée en groupe, elle est un des meilleurs outils de progression et de prévention de l’épuisement professionnel.' },
      { t: '4 · Formation continue',
        p: 'Développement professionnel continu, congrès, lecture d’articles, formations spécialisées (basse vision, neurovision, pédiatrie). Une pratique qui ne se met pas à jour se dégrade : les recommandations bougent, les techniques aussi.' }
    ],
    chiffres: [
      ['Progression du stagiaire', 'observation → participation → autonomie'],
      ['DPC', 'obligation continue']
    ],
    notions: ['Formative ≠ sommative : ne pas transformer un accompagnement en sanction.'],
    pieges: ['Évaluer la personne au lieu de la compétence.'],
    tombe: ['Situation d’encadrement à analyser'],
    methode: 'Repensez à vos propres stages : ce qui vous a fait progresser, et pourquoi. L’UE se travaille par l’expérience.'
  };
})();
