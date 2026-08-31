/* ============================================================
   Cas d'application supplémentaires — années 2 et 3 (S3 à S6)
   ------------------------------------------------------------
   Même structure que uecas.js, dont ce fichier complète l'objet
   window.UE_CAS. Les deux fichiers sont séparés pour la même
   raison qu'ueguide / ueguide2 : garder des fichiers lisibles.
   ============================================================ */
(function () {
  var C = (window.UE_CAS = window.UE_CAS || {});

/* ============================ SEMESTRE 3 ============================ */

C.UE24 = [
  { t: 'Une amblyopie découverte à 5 ans',
    tag: 'clinique',
    s: 'Un garçon de 5 ans, jamais examiné, présente une ésotropie droite constante de 20 Δ. Acuité : 10/10 OG, 2/10 OD, non améliorée au sténopé. Réfraction sous cycloplégie : +1,50 OG, +4,50 OD.',
    q: ['De quel type d’amblyopie s’agit-il ?',
        'L’âge de découverte compromet-il le traitement ?',
        'Par quoi commencez-vous ?'],
    r: 'Deux mécanismes s’additionnent ici : une amblyopie <b>strabique</b>, par neutralisation permanente de l’œil dévié, et une amblyopie <b>anisométropique</b>, l’œil droit recevant en permanence une image plus floue (2,50 D d’écart, au-delà du seuil de 1,50 D habituellement retenu). C’est une amblyopie fonctionnelle, donc <b>réversible</b> tant que la plasticité corticale persiste : classiquement jusqu’à 6-8 ans, avec des résultats encore possibles au-delà, plus lents et moins complets. Cinq ans n’est pas tardif, mais il n’y a pas de temps à perdre. La règle d’or est de ne jamais commencer par l’occlusion : on porte d’abord la <b>correction optique totale</b> issue de la cycloplégie, en permanence, pendant 4 à 6 semaines. Une part importante de l’amblyopie anisométropique se corrige par ce seul port — et occlure d’emblée reviendrait à traiter à travers un flou non corrigé.',
    c: 'Amblyopie mixte, strabique et anisométropique. Correction optique totale portée 4 à 6 semaines, réévaluation de l’acuité, puis occlusion selon le gain obtenu.' },

  { t: 'Une cataracte à la naissance',
    tag: 'oral',
    s: 'Un nouveau-né présente une cataracte congénitale unilatérale dense de l’œil gauche, diagnostiquée à la maternité.',
    q: ['Quel type d’amblyopie menace cet enfant ?',
        'Pourquoi le délai opératoire est-il si contraint ?',
        'Le pronostic est-il le même si la cataracte est bilatérale ?'],
    r: 'C’est une amblyopie par <b>privation</b> ou déprivation : aucune image formée n’atteint la rétine, ce qui est la forme la plus sévère et la plus rapidement irréversible. La <b>période critique</b> de développement du système visuel est maximale dans les premiers mois : le développement des colonnes de dominance oculaire et la maturation fovéolaire exigent une stimulation formée précoce. Une cataracte congénitale unilatérale dense doit être opérée très tôt — classiquement avant 6 semaines à 2 mois — puis suivie immédiatement d’une correction optique (lentille de contact, aphakie) et d’un traitement d’occlusion prolongé de l’œil sain, sans lequel l’œil opéré ne sera jamais utilisé. Une cataracte <b>bilatérale</b> est paradoxalement de meilleur pronostic visuel, parce qu’il n’y a pas de compétition interoculaire ni de suppression d’un œil par l’autre ; le délai reste néanmoins court (avant 8 à 10 semaines).',
    c: 'Amblyopie de privation : urgence chirurgicale néonatale, correction optique immédiate et occlusion prolongée. Le facteur pronostique majeur n’est pas la chirurgie, c’est la précocité et l’observance de la rééducation.' }
];

C.UE25 = [
  { t: 'Doser une occlusion',
    tag: 'décision',
    s: 'Amblyopie profonde de l’œil droit (2/10) chez un enfant de 4 ans, correction portée depuis six semaines, acuité passée de 1/10 à 2/10.',
    q: ['Combien d’heures d’occlusion par jour prescrivez-vous ?',
        'À quel rythme surveillez-vous, et quoi ?',
        'Qu’est-ce que l’amblyopie à bascule et comment l’évite-t-on ?'],
    r: 'Les grandes études (PEDIG) ont montré qu’une occlusion de <b>2 heures par jour</b> pour une amblyopie modérée et de <b>6 heures</b> pour une amblyopie profonde donne des résultats comparables à des occlusions plus longues, avec une observance et un vécu bien meilleurs. Le temps d’occlusion se prescrit en heures par jour, à adapter selon la réponse, et se combine à un travail visuel de près pendant l’occlusion. La surveillance porte sur l’acuité <b>des deux yeux</b> à un rythme d’autant plus rapproché que l’enfant est jeune : classiquement une semaine de contrôle par année d’âge (un enfant de 4 ans est revu vers 4 semaines). L’<b>amblyopie à bascule</b> est l’amblyopie iatrogène de l’œil sain occlus trop longtemps sans contrôle : elle survient surtout chez le petit, se dépiste en mesurant systématiquement l’acuité de l’œil traité <b>et</b> de l’œil occlus.',
    c: '6 heures par jour avec activités de près, contrôle à 4 semaines des deux yeux. Une fois l’acuité égalisée, décroissance progressive et traitement d’entretien : l’amblyopie récidive dans environ 25 % des cas.' },

  { t: 'Un enfant qui arrache son pansement',
    tag: 'décision',
    s: 'Même enfant, revu à un mois : l’acuité n’a pas progressé. Les parents avouent que l’occlusion n’est portée que le week-end, l’enfant l’arrachant à l’école.',
    q: ['Comment analysez-vous cet échec ?',
        'Quelle alternative thérapeutique existe-t-il ?',
        'Que dites-vous aux parents ?'],
    r: 'Une amblyopie qui ne progresse pas pose trois questions dans cet ordre : la correction est-elle exacte et <b>réellement portée</b> ? l’occlusion est-elle <b>réellement faite</b> ? existe-t-il une cause <b>organique</b> méconnue (fond d’œil, nerf optique, fixation excentrique) ? Ici, l’observance est en cause. La <b>pénalisation optique</b> est l’alternative de référence : atropine 1 % dans l’œil sain (souvent 1 goutte le week-end, ou selon protocole), qui rend la vision de près floue de ce côté et force l’usage de l’œil amblyope, avec une efficacité comparable à l’occlusion dans les amblyopies modérées. On peut aussi pénaliser optiquement par surcorrection ou filtre Bangerter. Le discours aux parents évite la culpabilisation : on explique le mécanisme — un cerveau qui ignore un œil — et l’enjeu de la fenêtre de plasticité, et l’on cherche avec eux le format tenable dans leur quotidien.',
    c: 'Échec d’observance, non d’indication. Pénalisation atropinique ou filtre, objectifs expliqués à l’enfant lui-même, et contrôle rapproché. Le meilleur traitement est celui qui sera fait.' }
];

C.UE26 = [
  { t: 'Est-il « malvoyant » ?',
    tag: 'méthode',
    s: 'Un patient de 68 ans a une acuité corrigée de 2/10 au meilleur œil. Un autre a 6/10 mais un champ visuel réduit à 15° de rayon. Tous deux vous demandent ce à quoi ils ont droit.',
    q: ['Sur quels critères la déficience visuelle est-elle classée ?',
        'Ces deux patients relèvent-ils de la même catégorie ?',
        'Quelles démarches leur proposez-vous ?'],
    r: 'La classification internationale repose sur deux critères : l’<b>acuité corrigée du meilleur œil</b> et le <b>champ visuel</b>. On parle de <b>malvoyance</b> en dessous de 3/10, de <b>cécité</b> en dessous de 1/20 ou pour un champ visuel inférieur à 10°. Point essentiel : un champ très réduit classe le patient <b>quelle que soit son acuité</b> — c’est pourquoi le second, qui lit encore 6/10, relève bien d’une déficience visuelle sévère alors qu’il ne « paraît » pas malvoyant. Le premier, à 2/10, est malvoyant au sens de la classification. Les démarches passent par la <b>MDPH</b> : reconnaissance du handicap, prestation de compensation, carte mobilité inclusion, aides techniques et humaines, et pour les actifs la reconnaissance de la qualité de travailleur handicapé. La conduite automobile obéit à ses propres seuils réglementaires, distincts de ces catégories, portant à la fois sur l’acuité et sur le champ.',
    c: 'Deux profils différents, une même filière : orientation MDPH avec un certificat détaillant acuité <b>et</b> champ visuel. Le champ est la donnée qu’on oublie, et c’est souvent celle qui ouvre les droits.' },

  { t: 'Un champ visuel de 10 degrés',
    tag: 'clinique',
    s: 'Homme de 46 ans, rétinopathie pigmentaire. Acuité 8/10 aux deux yeux, champ visuel tubulaire à 10°, héméralopie majeure, gêne importante aux déplacements.',
    q: ['Pourquoi une bonne acuité n’exclut-elle pas le handicap ?',
        'Le grossissement est-il ici une bonne réponse ?',
        'Que proposez-vous ?'],
    r: 'Acuité et champ mesurent deux fonctions distinctes : l’acuité dit la <b>résolution fovéolaire</b>, le champ dit l’<b>étendue explorable</b>. Ce patient lit encore et ne se déplace plus : c’est un handicap de mobilité, pas de lecture. Le grossissement serait ici <b>contre-productif</b> : agrandir une image réduit encore la portion de scène contenue dans un champ déjà tubulaire. On raisonne à l’inverse, en champ : systèmes <b>minifiants</b> (télescope inversé, prismes de déplacement de champ), apprentissage de stratégies d’<b>exploration systématique</b> par saccades, entraînement au balayage, et adaptations d’environnement. L’héméralopie impose d’anticiper l’éclairage, de préparer les transitions lumineuses et d’utiliser des filtres. Il faut aussi aborder la <b>locomotion</b> (canne blanche, instructeur en locomotion) sans attendre que la situation devienne dangereuse, et informer sur les droits (MDPH, aptitude à la conduite).',
    c: 'Handicap de champ, non de résolution : rééducation de l’exploration visuelle, gestion de l’éclairage et des filtres, orientation vers un instructeur en locomotion et vers la MDPH.' }
];

C.UE28 = [
  { t: 'Lire un article avant de le croire',
    tag: 'méthode',
    s: 'Un article conclut qu’une nouvelle méthode de rééducation « améliore significativement la convergence ». Étude sur 18 patients, sans groupe contrôle, mesures faites par le thérapeute lui-même, p = 0,04.',
    q: ['Quelles faiblesses méthodologiques relevez-vous ?',
        'Que signifie exactement p = 0,04 ?',
        'La conclusion est-elle recevable ?'],
    r: 'Trois failles majeures. L’absence de <b>groupe contrôle</b> ne permet pas de distinguer l’effet du traitement de l’évolution naturelle, de l’effet placebo et de l’effet d’apprentissage aux tests répétés — décisif en orthoptie, où la seule répétition d’une mesure de convergence l’améliore. L’absence d’<b>insu</b> : le thérapeute qui mesure ce qu’il a lui-même traité introduit un biais d’évaluation majeur ; il fallait un évaluateur indépendant. Le faible <b>effectif</b> (18) donne une puissance insuffisante et rend le résultat instable. Enfin p = 0,04 signifie seulement : « s’il n’y avait aucun effet, on observerait un résultat au moins aussi extrême dans 4 % des cas ». Ce n’est ni la probabilité que l’hypothèse soit vraie, ni une mesure de l’<b>ampleur</b> de l’effet — laquelle exige la taille d’effet et son intervalle de confiance.',
    c: 'Résultat non concluant : preuve de niveau faible. On lit la méthode avant les résultats, et les résultats avant la conclusion des auteurs.' },

  { t: 'Construire une équation de recherche',
    tag: 'méthode',
    s: 'Vous préparez une revue de la littérature sur l’efficacité de l’occlusion dans l’amblyopie de l’enfant.',
    q: ['Comment formalisez-vous la question ?',
        'Comment construisez-vous l’équation de recherche ?',
        'Comment hiérarchisez-vous ce que vous trouvez ?'],
    r: 'On formalise avec <b>PICO</b> : Population (enfants amblyopes de 3 à 7 ans), Intervention (occlusion), Comparateur (pénalisation atropinique, absence de traitement), Outcome (gain d’acuité visuelle de l’œil amblyope). L’équation se construit ensuite en combinant les termes contrôlés (MeSH : « Amblyopia », « Sensory Deprivation ») et les termes libres, reliés par les opérateurs booléens : synonymes en <b>OR</b> à l’intérieur de chaque bloc, blocs reliés en <b>AND</b>, exclusions en <b>NOT</b> — usage prudent. On y ajoute la troncature (occlus*) et les filtres (langue, date, type d’étude, âge). La hiérarchie des preuves guide la lecture : méta-analyses et revues systématiques d’abord, puis essais contrôlés randomisés, études de cohorte, cas-témoins, séries de cas, avis d’experts en dernier. On note enfin sa stratégie de recherche pour qu’elle soit reproductible.',
    c: 'Question PICO, équation booléenne documentée, tri par niveau de preuve. Une revue se juge d’abord sur sa stratégie de recherche : si elle n’est pas reproductible, elle n’est pas une revue.' }
];

C.UE32 = [
  { t: '« Est-ce que je vais devenir aveugle ? »',
    tag: 'décision',
    s: 'Pendant un champ visuel, une patiente de 63 ans suivie pour glaucome vous demande, en voyant le tracé apparaître : « c’est mauvais, non ? Est-ce que je vais devenir aveugle ? ». Le relevé montre effectivement une aggravation.',
    q: ['Que pouvez-vous dire, que ne pouvez-vous pas dire ?',
        'Comment répondre sans mentir ni annoncer à la place du médecin ?',
        'Que faites-vous ensuite ?'],
    r: 'L’annonce d’un pronostic relève du <b>médecin</b> : ce n’est pas une question de prudence personnelle, c’est une question de rôle. Mais se dérober — « je n’ai pas le droit de vous répondre » — laisse la patiente seule avec son angoisse et lui confirme le pire. La voie praticable tient en trois temps. <b>Accueillir</b> la question plutôt que la contourner : « je vois que ce tracé vous inquiète, qu’est-ce qui vous fait peur exactement ? » — on découvre souvent la vraie question, très concrète (pourrai-je conduire, garder mon travail). <b>Dire le vrai dans son champ</b> : expliquer ce que l’examen mesure, rappeler que le traitement ralentit l’évolution et que le suivi sert précisément à l’ajuster — sans interpréter le tracé ni annoncer un pronostic. <b>Organiser la suite</b> : s’assurer que la patiente verra le médecin, et lui transmettre la question posée pour qu’elle ne se perde pas. Rassurer faussement — « ne vous inquiétez pas, ce n’est rien » — est aussi fautif qu’annoncer à la place du médecin.',
    c: 'Accueillir la question, répondre dans son champ de compétence, ne pas interpréter le résultat, transmettre au médecin l’inquiétude et la question. Ce qu’on transmet fait partie du soin autant que ce qu’on mesure.' },

  { t: 'Des exercices jamais faits à la maison',
    tag: 'clinique',
    s: 'À la sixième séance de rééducation d’une insuffisance de convergence chez un lycéen, aucun progrès. Il reconnaît ne pas faire les exercices quotidiens.',
    q: ['Quelles causes explorez-vous avant de conclure à un manque de motivation ?',
        'Quels leviers d’éducation thérapeutique mobilisez-vous ?',
        'Faut-il poursuivre la rééducation ?'],
    r: 'Le « manque de motivation » est un diagnostic paresseux. On explore d’abord : l’exercice est-il <b>compris</b> (savoir-faire, pas seulement savoir) ? est-il <b>faisable</b> dans son quotidien, en durée et en matériel ? provoque-t-il un inconfort — céphalées, nausée — qui le fait éviter ? l’objectif a-t-il du <b>sens</b> pour lui, en lien avec sa plainte réelle (lire deux heures sans mal de tête avant le bac) ? L’éducation thérapeutique mobilise ensuite des leviers concrets : objectif co-construit et écrit, exercices réduits à deux, très courts, ancrés dans une routine existante, auto-mesure simple (PPC mesuré par lui-même avec une règle), retour visuel sur la courbe de progression, et alliance avec l’entourage. Poursuivre à l’identique n’a pas de sens : soit on ajuste le programme, soit on interrompt en expliquant pourquoi, quitte à reprendre quand le contexte le permettra.',
    c: 'Analyse des obstacles avant de juger l’observance, programme simplifié et objectif reformulé avec le patient. La rééducation ne se poursuit pas à l’identique après six séances sans effet.' }
];

C.UE37 = [
  { t: 'Deux troubles, lequel d’abord ?',
    tag: 'décision',
    s: 'Étudiant de 19 ans, céphalées et flou de près. Sous cycloplégie : hypermétropie +2,25 D non corrigée. Par ailleurs exophorie de près 10 Δ, PPC 14 cm, flexibilité accommodative 4 cycles/minute. Le prescripteur demande une rééducation.',
    q: ['Par quoi commencez-vous, et pourquoi ?',
        'Que risquez-vous en commençant par la rééducation ?',
        'Comment formulez-vous le projet de soins ?'],
    r: 'On ne rééduque jamais à travers une amétropie non corrigée. Une hypermétropie de +2,25 D impose un effort accommodatif permanent qui, par la <b>convergence accommodative</b>, modifie l’équilibre oculomoteur et explique à lui seul une partie des chiffres mesurés : la fatigue, le flou de près et l’inflexibilité accommodative peuvent être secondaires. Commencer par la rééducation, c’est travailler contre une cause qu’on laisse en place — au mieux on plafonne, au pire on entretient un effort supplémentaire et l’on conclut à tort à un échec. La séquence est donc : <b>correction optique portée en permanence</b>, délai d’adaptation de quatre à six semaines, puis <b>réévaluation complète</b> — beaucoup de bilans se normalisent à ce stade —, et rééducation seulement sur ce qui persiste. Le projet de soins s’écrit avec cette logique : ce qui est corrigé optiquement, ce qui est réévalué et quand, ce qui sera rééduqué le cas échéant, avec des critères chiffrés.',
    c: 'Correction optique d’abord, réévaluation à six semaines, rééducation ensuite sur le trouble résiduel. On informe le prescripteur de ce décalage plutôt que d’enchaîner des séances à contretemps.' },

  { t: 'Un projet de soins qui n’avance plus',
    tag: 'décision',
    s: 'Rééducation d’une hétérophorie décompensée : après huit séances, les mesures se sont normalisées mais la patiente décrit toujours les mêmes céphalées.',
    q: ['Comment interprétez-vous cette dissociation ?',
        'Que vérifiez-vous ?',
        'Comment concluez-vous le projet de soins ?'],
    r: 'Des chiffres normalisés sans amélioration de la plainte doivent faire remettre en cause le <b>lien de causalité</b> initial : le trouble mesuré n’était peut-être pas — ou pas seul — responsable du symptôme. On reprend alors l’ensemble : la <b>correction optique</b> est-elle exacte et portée (une hypermétropie latente se démasque avec la fatigue) ? existe-t-il une composante <b>accommodative</b> non explorée (flexibilité, retard accommodatif) ? les conditions de travail ont-elles changé ? et surtout, existe-t-il une <b>autre cause</b> aux céphalées — migraine, tension, bruxisme, trouble du sommeil — qui n’est pas de notre ressort. La conclusion d’un projet de soins fait partie du soin : on rédige un compte rendu final au prescripteur exposant les résultats obtenus, la persistance de la plainte, et l’on propose une réorientation plutôt que de prolonger indéfiniment.',
    c: 'Objectifs orthoptiques atteints, plainte persistante : compte rendu au prescripteur et réorientation. Savoir arrêter une rééducation est une compétence, pas un échec.' }
];

/* ============================ SEMESTRE 4 ============================ */

C.UE21 = [
  { t: 'Cohorte ou cas-témoins ?',
    tag: 'méthode',
    s: 'Vous voulez savoir si le temps passé sur écran augmente le risque de myopie chez l’enfant. Deux protocoles sont possibles : suivre 800 enfants non myopes pendant cinq ans, ou comparer 200 enfants myopes à 200 non myopes en reconstituant leur exposition passée.',
    q: ['Nommez les deux schémas d’étude.',
        'Quelle mesure d’association donne chacun ?',
        'Quel biais menace surtout le second ?'],
    r: 'Le premier est une <b>étude de cohorte</b> prospective : on part de l’<b>exposition</b> et l’on observe la survenue de la maladie. Elle permet de calculer une <b>incidence</b> dans chaque groupe, donc un <b>risque relatif</b> ; elle respecte la chronologie, ce qui renforce l’argument causal, mais elle est longue et coûteuse. Le second est une étude <b>cas-témoins</b> : on part de la <b>maladie</b> et l’on remonte l’exposition. Rapide, adaptée aux maladies rares, elle ne donne pas d’incidence : la mesure d’association est l’<b>odds ratio</b>, bonne approximation du risque relatif quand la maladie est rare. Son biais majeur est le <b>biais de mémorisation</b> : les parents d’enfants myopes surestiment rétrospectivement le temps d’écran, parce qu’ils cherchent une explication. S’y ajoute le biais de sélection des témoins, qui doivent être issus de la même population que les cas. On distingue enfin <b>incidence</b> (nouveaux cas sur une période) et <b>prévalence</b> (cas existants à un instant) : elles ne répondent pas à la même question.',
    c: 'Cohorte pour la causalité et l’incidence, cas-témoins pour la rapidité au prix du biais de mémorisation. Le schéma d’étude se choisit sur la question posée, pas sur les moyens disponibles.' },

  { t: 'Significatif ne veut pas dire important',
    tag: 'méthode',
    s: 'Un essai sur 2 400 patients montre qu’une aide optique augmente la vitesse de lecture de 3 mots par minute, p = 0,001, IC 95 % [1,2 ; 4,8].',
    q: ['Que dit ce p ?',
        'Que dit l’intervalle de confiance ?',
        'Ce résultat change-t-il votre pratique ?'],
    r: 'Le p très petit dit que ce résultat serait rare si l’aide n’avait aucun effet : l’effet existe probablement. Mais la <b>significativité statistique</b> dépend de l’effectif — avec 2 400 patients, un effet minuscule devient significatif. L’<b>intervalle de confiance</b> est plus informatif : à 95 %, le vrai gain se situe entre 1,2 et 4,8 mots par minute. Il ne contient pas zéro (cohérent avec le p), mais sa borne haute reste modeste. La question devient clinique et non statistique : ce gain atteint-il la <b>différence minimale cliniquement importante</b> pour un patient ? Trois mots par minute sur une vitesse normale de 200 ne changent pas une vie de lecteur. On distingue donc systématiquement <b>significatif</b> (l’effet existe) et <b>pertinent</b> (l’effet compte).',
    c: 'Effet réel mais cliniquement négligeable. On lit toujours l’intervalle de confiance et la taille d’effet avant le p, et l’on rapporte le résultat à ce qui compte pour le patient.' }
];

C.UE22 = [
  { t: 'Deux baisses d’acuité unilatérales, deux âges',
    tag: 'clinique',
    s: 'A : femme de 28 ans, baisse d’acuité progressive en trois jours, douleur à la mobilisation du globe, dyschromatopsie rouge-vert, fond d’œil normal. B : homme de 68 ans, hypertendu, baisse d’acuité brutale au réveil, indolore, œdème papillaire sectoriel et hémorragies en flammèches.',
    q: ['Quel diagnostic pour chacun ?',
        'Quel signe commun cherchez-vous ?',
        'Quel examen complémentaire pour chacun ?'],
    r: 'A est une <b>névrite optique rétrobulbaire</b> : femme jeune, installation en quelques jours, <b>douleur à la mobilisation</b> très évocatrice, dyschromatopsie d’axe rouge-vert, et fond d’œil normal — « le patient ne voit rien et le médecin ne voit rien ». Elle est fréquemment inaugurale d’une sclérose en plaques. B est une <b>neuropathie optique ischémique antérieure</b> : sujet de plus de 50 ans, facteurs de risque vasculaires, installation <b>brutale, indolore, souvent au réveil</b>, avec œdème papillaire et déficit altitudinal respectant le méridien horizontal. Dans les deux cas on cherche un <b>déficit pupillaire afférent relatif</b>, quasi constant dans une atteinte unilatérale du nerf optique. Explorations : IRM cérébrale et médullaire avec injection pour A, à la recherche de lésions démyélinisantes ; VS et CRP en <b>urgence</b> pour B, pour ne pas manquer une maladie de Horton, qui menace l’œil controlatéral en quelques jours.',
    c: 'A : NORB, IRM et avis neurologique. B : NOIA, VS-CRP immédiates. Deux tableaux, deux urgences, mais un même réflexe : chercher le déficit pupillaire afférent relatif.' },

  { t: 'Une paralysie du III qui fait peur',
    tag: 'urgence',
    s: 'Homme de 44 ans, céphalée brutale « en coup de tonnerre » il y a deux heures, ptosis droit, diplopie, mydriase droite peu réactive.',
    q: ['Que craignez-vous ?',
        'Pourquoi la pupille est-elle déterminante ?',
        'Quelle est la conduite immédiate ?'],
    r: 'L’association céphalée brutale et paralysie du III avec <b>atteinte pupillaire</b> évoque un <b>anévrisme de l’artère communicante postérieure</b>, comprimant le nerf, éventuellement fissuré ou rompu — risque de rupture massive à très court terme. Les fibres parasympathiques pupillomotrices cheminent en <b>périphérie</b> du III : elles sont les premières touchées par une compression extrinsèque et, à l’inverse, épargnées dans les atteintes <b>ischémiques microvasculaires</b> (diabète, HTA), qui donnent une paralysie douloureuse mais à pupille normale et régressent en trois mois. La « règle de la pupille » n’est pas absolue mais oriente puissamment : une mydriase dans ce contexte est une urgence neurochirurgicale, pas un motif de bilan orthoptique.',
    c: 'Suspicion d’anévrisme de la communicante postérieure : appel du 15, imagerie vasculaire en urgence. Le bilan orthoptique de la diplopie viendra après, quand la vie ne sera plus en jeu.' }
];

C.UE23 = [
  { t: 'Après un traumatisme crânien léger',
    tag: 'clinique',
    s: 'Homme de 31 ans, quatre mois après une commotion cérébrale sans lésion à l’imagerie. Fatigue visuelle, flou intermittent de près, gêne dans les environnements chargés. Acuités 10/10, réfraction nulle, PPC 16 cm, flexibilité accommodative 3 cycles/minute, amplitudes de fusion réduites.',
    q: ['Ces plaintes sont-elles compatibles avec un examen « normal » ?',
        'Quels troubles retrouve-t-on classiquement après une commotion ?',
        'Que proposez-vous, et avec quelle précaution ?'],
    r: 'Oui : l’acuité et la réfraction ne mesurent qu’une petite part de la fonction visuelle. Après une commotion, les troubles décrits sont <b>oculomoteurs et vergentiels</b>, non sensoriels : insuffisance de convergence — la plus fréquente —, inflexibilité ou insuffisance accommodative, anomalies des saccades et des poursuites, et intolérance au mouvement visuel, d’où la gêne dans les foules et les rayons de supermarché. Les chiffres de ce patient sont tous anormaux et cohérents avec la plainte. La rééducation orthoptique a ici une place reconnue : convergence, souplesse accommodative, stabilité oculomotrice, par séances <b>courtes et progressives</b>. La précaution majeure est le respect du seuil de symptômes : un exercice qui déclenche céphalées ou nausées doit être allégé, sous peine d’entretenir l’évitement. La prise en charge est souvent pluridisciplinaire — médecin, kinésithérapeute vestibulaire, parfois neuropsychologue.',
    c: 'Syndrome oculomoteur post-commotionnel : rééducation indiquée, dosée sous le seuil de symptômes, avec objectifs mesurés (PPC, flexibilité, amplitudes) et coordination pluridisciplinaire.' },

  { t: 'Une diplopie qu’il faut soulager tout de suite',
    tag: 'décision',
    s: 'Patiente de 39 ans, paralysie du VI gauche post-traumatique datant de trois semaines, diplopie horizontale invalidante en position primaire, déviation 25 Δ.',
    q: ['Faut-il opérer ?',
        'Quelles solutions immédiates proposez-vous ?',
        'Quel suivi organisez-vous ?'],
    r: 'On n’opère jamais une paralysie récente : la récupération spontanée d’une paralysie du VI post-traumatique se poursuit jusqu’à <b>six à douze mois</b>, et toute chirurgie précoce se ferait sur un angle instable. La priorité est le <b>confort immédiat</b> et la prévention de la neutralisation. Les options : <b>prismes de Fresnel</b>, souples, collés sur le verre, qui compensent des angles importants au prix d’une baisse d’acuité et d’un flou — parfaits pour une situation évolutive puisqu’ils se changent à chaque contrôle ; l’<b>occlusion</b> d’un œil (secteur, pansement, verre dépoli), efficace mais qui supprime la binocularité, à réserver aux fortes déviations ou en alternance ; la <b>toxine botulique</b> dans l’antagoniste (droit médial), qui limite la contracture et peut faciliter la récupération. Le suivi mesure la déviation dans les neuf positions à intervalles réguliers pour objectiver l’évolution.',
    c: 'Prismes de Fresnel réajustés à chaque contrôle, mesures répétées jusqu’à stabilité. La chirurgie ne se discute qu’après six mois d’angle stable.' }
];

C.UE27 = [
  { t: 'Mesurer autrement en basse vision',
    tag: 'méthode',
    s: 'Vous recevez pour bilan une patiente de 76 ans, DMLA exsudative bilatérale traitée, qui ne lit plus. Elle ne voit aucune lettre du Monoyer à 5 mètres.',
    q: ['Comment mesurez-vous son acuité ?',
        'Que mesurez-vous en plus de l’acuité ?',
        'Comment repérez-vous sa zone de fixation ?'],
    r: 'Les échelles classiques sont inadaptées : le Monoyer à 5 m n’a pas de niveaux bas exploitables. On utilise des échelles à <b>progression logarithmique</b> (ETDRS) et l’on <b>rapproche</b> le patient (à 1 m, la valeur lue est divisée par 5), ce qui autorise des mesures fines dans les acuités basses. La mesure ne s’arrête pas là : on évalue la <b>vision de près</b> avec des textes calibrés, la <b>vitesse de lecture</b> et la taille critique de caractères, la <b>sensibilité aux contrastes</b> (Pelli-Robson) — souvent bien mieux corrélée à la gêne quotidienne que l’acuité —, l’éblouissement, et le <b>champ visuel central</b> (grille d’Amsler, microperimétrie) pour cartographier le scotome. La zone de fixation excentrée préférentielle se repère par microperimétrie ou, plus simplement, en demandant au patient où l’image est la plus nette lorsqu’il regarde à côté de la cible : l’identifier permet ensuite de l’entraîner.',
    c: 'Acuité logarithmique à distance rapprochée, contrastes, vitesse de lecture, cartographie du scotome. En basse vision, l’acuité seule ne décrit ni le handicap ni le potentiel.' },

  { t: 'Une loupe qui reste dans le tiroir',
    tag: 'clinique',
    s: 'Vous revoyez à un mois un patient équipé d’une loupe-lunette ×6 : il ne s’en sert pas, « ça bouge tout le temps et ça fatigue ».',
    q: ['Quelles causes techniques explorez-vous ?',
        'Quel apprentissage a peut-être manqué ?',
        'Comment reprenez-vous l’équipement ?'],
    r: 'Une aide optique forte impose des contraintes que le patient découvre seul s’il n’a pas été entraîné. Un système ×6 se travaille à une <b>distance de travail très courte</b> (quelques centimètres), avec une <b>profondeur de champ minime</b> : le moindre mouvement fait perdre la netteté, d’où l’impression que « ça bouge ». Le <b>champ de vision</b> est réduit à quelques mots, ce qui oblige à déplacer le support et non la tête. L’apprentissage porte donc sur la stabilisation (pupitre, support, coudes appuyés), le maintien de la distance, le déplacement régulier du texte, l’<b>éclairage</b> rasant et suffisant, et la fixation excentrée si le scotome est central. Il se fait par séances courtes et progressives, sur du matériel qui intéresse le patient — pas sur un texte standard. Si malgré cela l’aide reste inutilisable, on révise le grossissement, ou l’on passe à un système électronique qui restaure une distance de lecture normale.',
    c: 'Défaut d’apprentissage plus que défaut d’équipement. Séances de rééducation dédiées, réglage de l’éclairage et du poste, réévaluation du grossissement si nécessaire.' }
];

/* ============================ SEMESTRE 5 ============================ */

C.UE29 = [
  { t: 'Un enfant qui saute des lignes',
    tag: 'clinique',
    s: 'CE2 de 8 ans : il saute des lignes, perd le fil, revient en arrière, se fatigue vite. Acuités 10/10, réfraction +0,75, PPC 9 cm, amplitudes de fusion normales, stéréoscopie normale. Il déchiffre correctement les mots isolés.',
    q: ['Que mesure-t-on quand on parle d’oculomotricité de lecture ?',
        'Ce tableau est-il forcément orthoptique ?',
        'Que concluez-vous, et à qui l’adressez-vous ?'],
    r: 'La lecture met en jeu une alternance de <b>saccades</b> (une dizaine de caractères en moyenne), de <b>fixations</b> (200 à 250 ms — c’est là que l’information est prise) et de <b>régressions</b> (10 à 15 % des mouvements chez un lecteur expert), plus le <b>retour à la ligne</b>, grande saccade vers la gauche qui exige un repérage spatial. On explore la précision des saccades, la stabilité de fixation, la coordination avec la convergence. Mais il faut savoir que la <b>désorganisation des mouvements oculaires est le plus souvent la conséquence d’une lecture difficile, non sa cause</b> : un enfant qui déchiffre mal multiplie régressions et fixations longues. Ici tous les indicateurs orthoptiques sont normaux et l’enfant déchiffre bien les mots isolés : la difficulté porte sur le <b>traitement du texte</b>, pas sur l’appareil oculomoteur. Un défaut de repérage spatial ou d’attention visuelle peut néanmoins bénéficier d’un travail ciblé, à condition de l’annoncer pour ce qu’il est.',
    c: 'Bilan orthoptique normal : aucun argument pour une cause visuelle. Compte rendu explicite au médecin, orientation vers un bilan orthophonique et, selon le contexte, neuropsychologique.' },

  { t: 'Un lycéen qui ne tient pas trente minutes de lecture',
    tag: 'clinique',
    s: 'Élève de terminale, se plaint de picotements, de lignes qui « sautent » et de somnolence après vingt minutes de lecture. PPC 13 cm, convergence fusionnelle de près 12 Δ, flexibilité accommodative 4 cycles/minute avec flipper ± 2,00.',
    q: ['Le bilan est-il ici contributif ?',
        'Quel trouble retenez-vous ?',
        'Que proposez-vous, et avec quelle réserve ?'],
    r: 'Contrairement au cas précédent, les chiffres sont franchement anormaux : PPC éloigné, réserves fusionnelles insuffisantes et surtout <b>flexibilité accommodative effondrée</b> (norme de l’ordre de 8 à 11 cycles/minute en binoculaire avec ± 2,00). Le tableau associe une insuffisance de convergence à une <b>inflexibilité accommodative</b> : c’est exactement le profil qui produit une gêne <b>dépendante de la durée</b>, avec plainte croissante et récupération au repos. La rééducation a ici une indication solide : convergence, souplesse de vergence et d’accommodation (flippers, tableau de Hart, alternance loin-près), avec travail quotidien. La réserve à énoncer : on traite une fatigue visuelle, pas des résultats scolaires — on ne promet jamais un gain de performance, seulement la disparition d’une gêne.',
    c: 'Insuffisance de convergence avec inflexibilité accommodative : rééducation indiquée, objectifs mesurables. Le bénéfice attendu porte sur le confort et l’endurance de lecture.' }
];

C.UE30 = [
  { t: 'Il ne voit pas à gauche, ou il ne regarde pas à gauche ?',
    tag: 'clinique',
    s: 'Patient de 63 ans après AVC pariétal droit. Il ne mange que la moitié droite de son assiette, ne se rase que la moitié droite du visage, et se dit « en pleine forme ». Le champ visuel par confrontation semble complet.',
    q: ['Hémianopsie ou négligence ?',
        'Quels tests permettent de trancher ?',
        'En quoi la conséquence pratique diffère-t-elle ?'],
    r: 'La <b>négligence spatiale unilatérale</b> n’est pas un déficit sensoriel mais un défaut d’<b>orientation de l’attention</b> vers l’hémi-espace controlésionnel, typiquement après lésion pariétale droite. Trois éléments l’opposent à l’hémianopsie : l’<b>anosognosie</b> — le patient ignore son trouble, alors que l’hémianope s’en plaint et le compense ; l’absence de mouvements de recherche vers la gauche ; et l’atteinte de <b>toutes les modalités</b>, pas seulement visuelle. Les tests classiques : barrage de lignes ou de cloches, bissection de lignes (déviée vers la droite), copie de dessin et dessin de mémoire (moitié gauche omise), lecture (négligence des débuts de mots ou de lignes). Conséquence pratique : l’hémianope apprend à explorer et progresse vite ; le négligent doit d’abord <b>prendre conscience</b> de son trouble, ce qui conditionne toute la rééducation et engage plus largement l’équipe (ergothérapie, neuropsychologie).',
    c: 'Négligence spatiale unilatérale gauche. Tests papier-crayon pour l’objectiver, rééducation multidisciplinaire, et pronostic fonctionnel plus réservé que celui d’une hémianopsie isolée.' },

  { t: 'Des vertiges qui viennent des yeux ?',
    tag: 'décision',
    s: 'Une femme de 52 ans se plaint d’instabilité et d’une sensation de tangage, majorées dans les supermarchés et les escalators. Examen neurologique et ORL sans anomalie franche.',
    q: ['Quel rôle joue la vision dans l’équilibre ?',
        'Qu’explorez-vous en orthoptie ?',
        'Quelle est votre place dans la prise en charge ?'],
    r: 'L’équilibre repose sur trois entrées — <b>vestibulaire, proprioceptive et visuelle</b> — intégrées et pondérées par le système nerveux central. Certains sujets sont <b>dépendants du champ visuel</b> : ils s’appuient prioritairement sur la vision, et se déstabilisent dans les environnements visuellement conflictuels (rayons de supermarché, foules, escalators, défilement) — c’est le tableau du vertige postural perceptuel persistant. On explore la stabilité de fixation, les saccades et les poursuites, la <b>convergence</b> et la fusion, le réflexe vestibulo-oculaire par le head impulse test, la réfraction et le mode de correction — des progressifs neufs ou une anisométropie récente déstabilisent réellement. La prise en charge est <b>partagée</b> : ORL et kinésithérapie vestibulaire au premier plan, l’orthoptiste traitant ce qui relève de lui, notamment la stabilité oculomotrice et une insuffisance de convergence associée, fréquente et aggravante.',
    c: 'Probable dépendance visuelle : bilan oculomoteur complet, correction optique revue, et travail en réseau avec l’ORL et le kinésithérapeute. L’orthoptiste ne traite pas le vertige, il traite ce qui, dans la vision, l’entretient.' }
];

C.UE31 = [
  { t: 'Un dépistage positif sans suite',
    tag: 'méthode',
    s: 'Six mois après une action de dépistage en école maternelle, vous apprenez que sur 34 enfants orientés, 11 seulement ont consulté.',
    q: ['Ce dépistage a-t-il rempli son objectif ?',
        'À quelles conditions un dépistage est-il justifié ?',
        'Comment corrigez-vous l’organisation ?'],
    r: 'Non : un dépistage ne se juge pas sur le nombre d’enfants testés, mais sur le nombre d’enfants <b>effectivement pris en charge</b>. Ici, deux tiers des positifs sont perdus de vue : le bénéfice de l’action est largement théorique. Les critères de <b>Wilson et Jungner</b> rappellent qu’un dépistage n’est légitime que si la maladie est fréquente et grave, si elle a une <b>phase latente détectable</b>, s’il existe un <b>traitement d’autant plus efficace qu’il est précoce</b>, si le test est acceptable et fiable — et surtout s’il existe une filière de diagnostic et de traitement <b>accessible</b>. L’amblyopie remplit tous ces critères, sauf le dernier quand rien n’est organisé en aval. Corriger l’organisation, c’est prévoir avant l’action : courrier explicite remis aux familles, information du médecin traitant, délais de rendez-vous négociés avec les correspondants, rappel systématique à trois mois, et suivi du <b>taux de consultation</b> comme indicateur du programme.',
    c: 'Dépistage incomplet faute de circuit d’aval. L’indicateur à suivre n’est pas le nombre de tests, c’est la part d’enfants réellement pris en charge : sans filière accessible, un dépistage crée de l’inquiétude sans bénéfice.' },

  { t: 'Huit heures devant un écran',
    tag: 'clinique',
    s: 'Un salarié de 41 ans se plaint de sécheresse, de picotements et de céphalées en fin de journée. Deux écrans à 50 cm, en contre-jour d’une baie vitrée, éclairage plafonnier direct, pas de pause.',
    q: ['Quels mécanismes expliquent ces plaintes ?',
        'Quelles corrections ergonomiques proposez-vous ?',
        'Quelle correction optique envisagez-vous ?'],
    r: 'Le syndrome de fatigue visuelle numérique combine trois mécanismes. La <b>réduction du clignement</b> — divisé par trois à cinq lors du travail sur écran — associée à un écran placé trop haut, qui augmente la surface cornéenne exposée : d’où sécheresse et picotements. La <b>sollicitation accommodative et vergentielle soutenue</b> à distance fixe, qui produit céphalées et flou en fin de journée. Enfin l’<b>éblouissement</b> et les reflets, ici majeurs entre contre-jour et plafonnier direct. Les corrections ergonomiques sont concrètes : écran perpendiculaire à la fenêtre et non face ou dos, sommet de l’écran au niveau des yeux ou légèrement en dessous (regard abaissé de 15 à 20°), distance de 50 à 70 cm, éclairage indirect de 300 à 500 lux, luminance de l’écran ajustée à l’ambiance, et surtout la règle <b>20-20-20</b> : toutes les 20 minutes, regarder à 20 pieds (6 m) pendant 20 secondes. Optiquement, on vérifie la correction à la <b>distance réelle de l’écran</b>, souvent intermédiaire et mal couverte par des progressifs classiques, pour lesquels un verre de proximité dédié est parfois la meilleure réponse.',
    c: 'Fatigue visuelle numérique multifactorielle : ergonomie du poste d’abord, larmes artificielles si besoin, correction adaptée à la distance de travail. Un verre bien choisi ne compensera jamais un poste mal installé.' }
];

C.UE33 = [
  { t: 'Lire une OCT maculaire',
    tag: 'méthode',
    s: 'Deux coupes OCT maculaires : sur la première, épaississement rétinien avec logettes hyporéflectives intrarétiniennes ; sur la seconde, amincissement, perte de la ligne ellipsoïde et hyperréflectivité choroïdienne sous-jacente.',
    q: ['Que montre chaque coupe ?',
        'Quelle information l’OCT ajoute-t-elle à l’acuité ?',
        'Quelles sont ses limites ?'],
    r: 'La première coupe montre un <b>œdème maculaire</b> : les logettes hyporéflectives correspondent à des cavités liquidiennes intrarétiniennes, l’épaisseur centrale est augmentée. C’est un tableau potentiellement <b>réversible</b>, qui relève d’un traitement (anti-VEGF, laser, traitement de la cause). La seconde montre une <b>atrophie</b> : perte des couches externes, disparition de la ligne ellipsoïde (segments internes/externes des photorécepteurs) et hypertransmission du signal vers la choroïde — lésion <b>définitive</b>. L’OCT apporte ce que l’acuité ne dit pas : le <b>mécanisme</b> et le <b>pronostic</b>, deux patients à 3/10 pouvant relever de conduites opposées. Ses limites : elle mesure une structure, pas une fonction ; elle est sensible aux artefacts de segmentation automatique et aux milieux troubles ; et un suivi n’est interprétable que si les acquisitions sont <b>comparables</b> — même appareil, même protocole, bonne fixation.',
    c: 'Œdème réversible d’un côté, atrophie définitive de l’autre. On rapporte toujours l’image à la fonction, et l’on compare des examens réalisés dans les mêmes conditions.' },

  { t: 'Quelle imagerie pour quelle question ?',
    tag: 'méthode',
    s: 'Quatre situations le même jour : un dépistage de rétinopathie diabétique, un œdème maculaire à surveiller sous anti-VEGF, une suspicion de néovaisseaux choroïdiens, et une hémorragie du vitré qui empêche toute visualisation du fond d’œil.',
    q: ['Quel examen d’imagerie pour chacune ?',
        'Qu’apporte l’angiographie que l’OCT ne donne pas, et l’inverse ?',
        'Quelle question précède toujours le choix de l’examen ?'],
    r: 'Dépistage de rétinopathie : <b>rétinographie</b>, éventuellement non mydriatique et télé-lue — rapide, reproductible, adaptée au volume. Suivi d’un œdème maculaire : <b>OCT</b>, qui quantifie épaisseur centrale et volume en coupes comparables d’une visite à l’autre. Suspicion de néovaisseaux : <b>angiographie à la fluorescéine</b>, qui montre la <b>dynamique</b> de la circulation et les diffusions, ou <b>OCT-angiographie</b>, non invasive, qui cartographie les flux sans injection mais ne montre pas de diffusion. Milieux opaques : l’<b>échographie B</b>, seule capable de traverser une hémorragie du vitré pour rechercher un décollement de rétine sous-jacent. En résumé : l’OCT donne la <b>structure en coupe</b>, l’angiographie la <b>circulation dans le temps</b>, la rétinographie la <b>vue d’ensemble reproductible</b>, l’échographie voit <b>malgré l’opacité</b>. Et la question qui précède le choix est toujours la même : qu’est-ce que je cherche à voir, et que changera le résultat ?',
    c: 'Un examen d’imagerie répond à une question, il ne remplace pas l’examen clinique. Un examen dont le résultat ne changera rien à la conduite n’a pas d’indication.' }
];

C.UE41 = [
  { t: 'Un malaise dans la salle d’examen',
    tag: 'urgence',
    s: 'Pendant un champ visuel, un patient de 68 ans glisse de sa chaise. Il ne répond pas quand vous l’appelez et ne réagit pas quand vous lui prenez la main.',
    q: ['Quelle est la séquence des gestes ?',
        'Comment vérifiez-vous la respiration ?',
        'Que faites-vous si elle est absente ?'],
    r: 'La séquence est invariable et se déroule en quelques dizaines de secondes. <b>Sécurité</b> de la zone, puis évaluation de la <b>conscience</b> : on parle fort, on serre les épaules. Inconscient, on <b>libère les voies aériennes</b> — desserrer col et cravate, bascule prudente de la tête en arrière et élévation du menton — puis on apprécie la <b>respiration</b> pendant <b>10 secondes au plus</b>, en regardant le thorax, en écoutant et en sentant le souffle sur sa joue. Si le patient respire, on l’installe en <b>position latérale de sécurité</b> et l’on alerte le 15 en surveillant en continu. S’il ne respire pas ou seulement par gasps, c’est un <b>arrêt cardiaque</b> : on alerte immédiatement (15 ou 112), on demande le <b>défibrillateur automatisé externe</b>, et l’on commence sans délai les compressions thoraciques — 30 compressions pour 2 insufflations, 100 à 120 par minute, 5 à 6 cm de profondeur, en laissant la poitrine se relever complètement. Le DAE s’utilise dès son arrivée, en suivant ses consignes vocales.',
    c: 'Conscience, voies aériennes, respiration ; PLS et alerte si le patient respire, RCP et DAE sinon. Chaque minute sans massage fait perdre environ 10 % de chances de survie.' },

  { t: 'Un œil qui a reçu un éclat',
    tag: 'urgence',
    s: 'Un homme de 28 ans se présente après avoir reçu un éclat métallique en meulant sans lunettes de protection. Œil douloureux, larmoyant, acuité 3/10. La pupille est déformée en goutte et la chambre antérieure paraît aplatie.',
    q: ['Que redoutez-vous devant ces signes ?',
        'Quels gestes sont formellement proscrits ?',
        'Que faites-vous concrètement ?'],
    r: 'Une <b>pupille déformée en goutte</b>, attirée vers un point de la périphérie, et une <b>chambre antérieure athalamique</b> sont des signes de <b>plaie perforante du globe</b> : l’iris vient s’engager dans la brèche. Le contexte — meulage sans protection — impose en outre de suspecter un <b>corps étranger intraoculaire</b>, dont la méconnaissance expose à l’endophtalmie et, s’il est ferreux, à la sidérose. Sont formellement proscrits : toute <b>pression sur le globe</b> (pas de tonométrie, pas d’écartement forcé des paupières, pas de palpation), l’instillation de collyres, le retrait de tout élément apparent, et l’<b>IRM</b> tant qu’un corps étranger métallique n’est pas exclu — c’est le scanner orbitaire qui fait le bilan. Concrètement : protection par une <b>coque rigide sans compression</b>, jamais un pansement appuyé ; patient laissé <b>à jeun</b> en vue d’une chirurgie, heure du dernier repas notée ; acuité initiale et circonstances consignées ; vaccination antitétanique vérifiée ; transfert immédiat vers un centre chirurgical.',
    c: 'Suspicion de plaie perforante avec corps étranger intraoculaire : coque de protection, patient à jeun, aucun collyre, aucune pression, transfert en urgence. Scanner orbitaire, jamais d’IRM avant d’avoir exclu le métal.' }
];

/* ============================ SEMESTRE 6 ============================ */

C.UE34 = [
  { t: 'S’installer en libéral',
    tag: 'méthode',
    s: 'Vous envisagez une installation en libéral à la fin de vos études, seul dans un cabinet de ville.',
    q: ['Quelles démarches préalables sont indispensables ?',
        'Comment vos actes sont-ils pris en charge ?',
        'Quelles obligations pèsent sur vous une fois installé ?'],
    r: 'Trois blocs de démarches. <b>Administratif</b> : enregistrement du diplôme et obtention du numéro RPPS, inscription auprès de l’Assurance maladie (conventionnement), déclaration d’activité et choix du statut, affiliation à la caisse de retraite des professions libérales, et souscription d’une <b>assurance en responsabilité civile professionnelle</b>, obligatoire. <b>Économique</b> : local accessible aux personnes handicapées, équipement, financement. <b>Réglementaire</b> : les actes s’exercent sur <b>prescription médicale</b>, hors cas prévus par les textes, et sont cotés selon la nomenclature (NGAP) — la lettre-clé de l’orthoptiste avec ses coefficients, les règles d’association d’actes et le respect de l’entente préalable pour certains actes. Une fois installé : tenue et conservation du dossier patient, secret professionnel, information et consentement, formation continue (DPC), affichage des honoraires, et déclaration des traitements de données de santé.',
    c: 'RPPS, conventionnement, RCP et local accessible avant l’ouverture ; exercice sur prescription et cotation selon la nomenclature ensuite. L’installation est un projet réglementaire autant qu’économique.' },

  { t: 'Une plainte, et un dossier vide',
    tag: 'décision',
    s: 'Un patient conteste la qualité d’une rééducation menée l’an dernier et évoque une plainte. Vous retrouvez son dossier : quelques mesures sur une feuille volante, aucun compte rendu, pas de date pour la moitié des séances.',
    q: ['Sur quoi votre responsabilité peut-elle être engagée ?',
        'Quel rôle joue le dossier dans ce contexte ?',
        'Quelles obligations pratiques en tirez-vous ?'],
    r: 'La responsabilité d’un professionnel de santé suppose trois éléments réunis : une <b>faute</b>, un <b>dommage</b> et un <b>lien de causalité</b>. L’orthoptiste est tenu à une <b>obligation de moyens</b>, non de résultat : on ne lui reproche pas l’échec d’une rééducation, on peut lui reprocher de ne pas avoir mis en œuvre des moyens conformes aux données acquises de la science — bilan initial, objectifs, technique adaptée, réévaluation, orientation en cas d’anomalie. Le <b>dossier</b> devient alors décisif : il est le seul moyen de démontrer ce qui a été fait, quand, et pourquoi. Un dossier lacunaire ne prouve pas la faute, mais il prive de toute défense : en pratique, ce qui n’est pas écrit n’a pas eu lieu. D’où les obligations concrètes — dossier tenu, daté, conservé selon la réglementation, comptes rendus adressés au prescripteur, traçabilité de l’information donnée au patient, et <b>assurance en responsabilité civile professionnelle</b>, obligatoire, à saisir dès qu’un litige se dessine.',
    c: 'Obligation de moyens, dossier comme preuve, assureur prévenu sans attendre. Tenir son dossier n’est pas une formalité administrative : c’est un acte de soin, et une protection.' }
];

C.UE35 = [
  { t: 'Un glaucome qui ne se sent pas',
    tag: 'clinique',
    s: 'Patient de 61 ans, glaucome chronique à angle ouvert traité depuis quatre ans. Il vient pour son champ visuel annuel et vous confie oublier « souvent » son collyre du soir, puisqu’il « voit toujours bien ».',
    q: ['Pourquoi cette maladie expose-t-elle particulièrement à la mauvaise observance ?',
        'Que peut-on lui montrer pour rendre l’enjeu tangible ?',
        'Quels leviers d’observance proposez-vous ?'],
    r: 'Le glaucome réunit tous les facteurs de mauvaise observance : maladie <b>asymptomatique</b> pendant des années, atteinte périphérique d’abord — la vision centrale reste longtemps à 10/10 —, traitement à vie, quotidien, sans bénéfice ressenti, et parfois mal toléré localement. Le patient n’a aucun retour d’expérience qui l’encourage. Le rendre tangible passe par la <b>visualisation</b> : montrer son propre champ visuel et l’évolution du déficit sur plusieurs années, montrer l’amincissement des fibres à l’OCT, expliquer que ce qui est perdu ne revient jamais parce que les cellules ganglionnaires ne se régénèrent pas. Les leviers pratiques : simplifier le schéma (associations fixes, une seule instillation), ancrer l’instillation dans une routine existante (brossage des dents), apprendre la <b>technique</b> — une goutte suffit, occlusion des points lacrymaux une minute, ce qui améliore l’efficacité et réduit les effets généraux —, traiter l’irritation qui fait abandonner (formes sans conservateur), et impliquer l’entourage.',
    c: 'Observance à travailler comme un objectif de soin à part entière : visualisation de son propre suivi, simplification du schéma, technique d’instillation revue. Le meilleur collyre est celui qui est instillé.' },

  { t: 'Organiser le suivi d’une cohorte de diabétiques',
    tag: 'méthode',
    s: 'Un centre de santé vous confie l’organisation du dépistage de la rétinopathie diabétique par rétinographie non mydriatique avec télé-lecture.',
    q: ['Quel est le rythme de dépistage recommandé ?',
        'Quel est votre rôle exact dans ce circuit ?',
        'Quels pièges organisationnels anticipez-vous ?'],
    r: 'Le rythme est <b>annuel</b> en règle générale, pouvant être porté à deux ans chez un patient de type 2 bien équilibré, sans rétinopathie et sans autre facteur de risque. Il se resserre en cas de <b>grossesse</b> (avant, puis trimestriel), de puberté, d’équilibration rapide de la glycémie, d’HTA ou de néphropathie associées. Le rôle de l’orthoptiste est central mais délimité : réalisation des <b>rétinographies</b> selon un protocole de champs standardisé, vérification de la <b>qualité des clichés</b> — un cliché ininterprétable est un dépistage non fait —, recueil des données cliniques utiles au lecteur (ancienneté du diabète, HbA1c, traitement, acuité), transmission sécurisée ; l’<b>interprétation</b> et le diagnostic reviennent à l’ophtalmologiste télé-lecteur. Les pièges sont organisationnels plus que techniques : perte de vue des patients positifs faute de circuit de rappel, délais de lecture, clichés de mauvaise qualité chez les patients à pupille étroite ou à média troubles (prévoir un adressage direct), et traçabilité des résultats rendus.',
    c: 'Dépistage annuel, clichés standardisés et contrôlés, télé-lecture par l’ophtalmologiste, et surtout circuit de rappel des positifs. Un dépistage se juge sur le taux de patients effectivement pris en charge après un examen anormal.' }
];

C.UE36 = [
  { t: 'Le bilan qui précède le bloc',
    tag: 'méthode',
    s: 'Un patient de 26 ans, exotropie de 30 Δ, est adressé pour bilan préopératoire.',
    q: ['Que mesurez-vous, et pourquoi chacune de ces mesures ?',
        'Quelles mesures conditionnent directement le geste ?',
        'Que faut-il documenter avant l’intervention ?'],
    r: 'Le bilan préopératoire est celui sur lequel le chirurgien calculera ses millimètres : il doit être <b>complet, reproductible et chiffré</b>. Acuité et réfraction, pour éliminer une amblyopie et une part accommodative. <b>Angle de loin et de près</b> au cover test alterné avec prismes, œil fixateur alterné, et si possible après occlusion prolongée pour démasquer l’angle total — c’est cette valeur qui détermine les doses opératoires. Mesure dans les <b>neuf positions</b> pour dépister une incomitance ou une hyperaction des obliques, qui changerait le geste. <b>Duction et version</b>, pour distinguer une restriction d’une paralysie. Bilan <b>sensoriel</b> : vision binoculaire, neutralisation, correspondance rétinienne, stéréoscopie, et surtout <b>test aux prismes</b> de l’angle prévu pour dépister le risque de <b>diplopie post-opératoire</b> chez un adulte à correspondance anormale. Tout doit être documenté et daté : les mesures préopératoires servent de référence pour juger du résultat.',
    c: 'Angle total loin et près, neuf positions, bilan sensoriel et test prismatique préalable. Un dossier préopératoire incomplet fait un résultat impossible à interpréter.' },

  { t: 'Le lendemain de l’opération',
    tag: 'clinique',
    s: 'Contrôle à J1 d’un recul-résection pour ésotropie de 35 Δ : le patient présente maintenant une exotropie de 12 Δ et se plaint d’une diplopie croisée.',
    q: ['Cette surcorrection est-elle inquiétante ?',
        'Que faites-vous à ce stade ?',
        'Quand une reprise se discute-t-elle ?'],
    r: 'Une <b>surcorrection précoce modérée</b> après chirurgie d’ésotropie est fréquente et souvent recherchée : l’œdème, la contracture musculaire et l’effet des sutures évoluent pendant plusieurs semaines, et l’angle tend à se réduire spontanément. Une exotropie de 12 Δ à J1 après une correction de 35 Δ n’est donc pas alarmante en soi. La conduite est l’<b>attente active</b> : mesures répétées à J1, J8, un mois, trois mois, sur le même protocole ; vérification de la correction optique — chez un ancien ésotrope hypermétrope, une surcorrection optique excessive peut entretenir l’exodéviation ; prismes temporaires de Fresnel pour le confort et pour maintenir la fusion si la diplopie gêne. On surveille aussi le risque de <b>neutralisation</b> ou d’amblyopie chez l’enfant. Une reprise chirurgicale ne se discute qu’après <b>stabilisation</b> de l’angle, généralement au-delà de trois à six mois, et seulement si la déviation résiduelle est fonctionnellement ou esthétiquement significative.',
    c: 'Surcorrection précoce attendue : surveillance rapprochée, prismes de confort, réévaluation de la correction optique. Aucune décision de reprise avant plusieurs mois d’angle stable.' }
];

C.UE38 = [
  { t: 'Trouver une question de recherche',
    tag: 'méthode',
    s: 'Vous devez choisir le sujet de votre mémoire. Votre première idée : « la rééducation orthoptique chez l’enfant ».',
    q: ['Pourquoi ce sujet n’est-il pas une question de recherche ?',
        'Comment le transformer en question exploitable ?',
        'Quels critères de faisabilité vérifiez-vous ?'],
    r: '« La rééducation orthoptique chez l’enfant » est un <b>thème</b>, pas une question : il n’a ni population définie, ni intervention précise, ni critère de jugement, donc aucune réponse possible. On le resserre avec <b>PICO</b> : par exemple « chez les enfants de 8 à 12 ans présentant une insuffisance de convergence isolée (P), un programme de rééducation en cabinet associé à des exercices à domicile (I) comparé aux exercices à domicile seuls (C) améliore-t-il la convergence fusionnelle de près à trois mois (O) ? ». La question devient alors mesurable, et le protocole s’en déduit. La faisabilité se vérifie <b>avant</b> de s’engager : accès réel à la population et effectif atteignable dans le temps imparti, disponibilité du matériel de mesure, durée de suivi compatible avec le calendrier, critère de jugement objectif et reproductible, autorisations et <b>consentement</b> — information claire, non-opposition ou consentement écrit pour les mineurs par les titulaires de l’autorité parentale —, anonymisation des données et cadre réglementaire de la recherche.',
    c: 'Question PICO précise, critère de jugement unique et mesurable, faisabilité vérifiée sur le terrain avant de commencer. Un mémoire échoue rarement sur l’analyse, souvent sur une question mal posée.' },

  { t: 'Des résultats qui ne disent pas ce qu’on espérait',
    tag: 'méthode',
    s: 'Votre étude sur 24 patients ne montre pas de différence significative entre les deux groupes. Vous êtes tenté d’ajouter un critère de jugement analysé après coup, qui, lui, est significatif.',
    q: ['Quel est le problème de cette démarche ?',
        'Comment interpréter honnêtement un résultat non significatif ?',
        'Que devez-vous écrire dans la discussion ?'],
    r: 'Changer de critère de jugement après avoir vu les données, ou multiplier les analyses jusqu’à en trouver une significative, c’est du <b>p-hacking</b> : à force de tests, on finit par obtenir un p < 0,05 par hasard seul. Le critère de jugement principal se fixe <b>avant</b> le recueil, et toute analyse ultérieure doit être présentée comme <b>exploratoire</b>, génératrice d’hypothèses, jamais confirmatoire. Un résultat non significatif ne signifie pas « pas de différence » : avec 24 patients, la <b>puissance</b> est faible, et l’absence de preuve n’est pas la preuve de l’absence. On l’interprète en regardant l’<b>intervalle de confiance</b> : s’il est large et inclut des valeurs cliniquement importantes, l’étude n’a simplement pas tranché. La discussion doit exposer honnêtement les limites — effectif, absence d’insu, biais de sélection, durée de suivi —, ce que le résultat autorise à conclure, et ce qu’il n’autorise pas.',
    c: 'On garde le critère de jugement prévu, on rapporte le résultat non significatif tel quel avec son intervalle de confiance, et l’on discute la puissance. La rigueur méthodologique se juge sur ce qu’on publie quand le résultat déçoit.' }
];

C.UE39 = [
  { t: 'Travailler ensemble sans se substituer',
    tag: 'décision',
    s: 'Vous exercez dans un cabinet d’ophtalmologie où le médecin vous propose de réaliser seul les bilans visuels de patients sans pathologie, avec relecture différée du dossier.',
    q: ['Ce mode d’organisation est-il possible ?',
        'Qu’est-ce qui le distingue d’un exercice illégal ?',
        'Quelles garanties exigez-vous ?'],
    r: 'Oui, à condition d’être formalisé. Le travail aidé et les <b>protocoles organisationnels</b> permettent à l’orthoptiste de réaliser des actes préalables — interrogatoire, acuité, réfraction, tonométrie, imagerie, champ visuel — dont le médecin assure ensuite l’analyse et le diagnostic. Certains <b>protocoles de coopération</b>, validés par l’autorité compétente, vont plus loin en organisant un transfert d’actes encadré, avec formation, critères d’inclusion et d’exclusion écrits, traçabilité et évaluation. Ce qui distingue cette organisation de l’exercice illégal de la médecine, c’est l’existence d’un <b>protocole écrit</b>, l’absence de diagnostic et de prescription posés par l’orthoptiste, la définition claire des situations imposant un recours immédiat au médecin, et la présence ou l’accessibilité effective de celui-ci. Les garanties à exiger : protocole signé, critères d’exclusion explicites, délai de relecture borné, circuit d’alerte pour les anomalies, formation et assurance adaptées.',
    c: 'Organisation possible dans un cadre écrit, avec critères d’exclusion et relecture médicale garantie. Sans protocole formalisé, c’est le professionnel qui porte seul le risque.' },

  { t: 'Un enfant déficient visuel entre au CP',
    tag: 'décision',
    s: 'Un enfant de 6 ans atteint d’une dystrophie rétinienne (acuité 2/10, photophobie majeure) entre au CP. Les parents vous demandent comment faire pour l’école.',
    q: ['Quels acteurs interviennent autour de cet enfant ?',
        'Quels dispositifs scolaires existent, et qui les déclenche ?',
        'Quel est votre rôle propre dans ce réseau ?'],
    r: 'Autour de l’enfant : l’<b>ophtalmologiste</b>, qui suit la pathologie et rédige les certificats ; l’<b>orthoptiste</b>, pour le bilan fonctionnel et la rééducation ; l’<b>ergothérapeute</b> et l’instructeur en locomotion pour l’autonomie ; l’enseignant et le <b>médecin scolaire</b> ; un service spécialisé en déficience visuelle le cas échéant ; et la <b>MDPH</b>, qui instruit les droits. Côté école, deux dispositifs à ne pas confondre : le <b>PAP</b>, décidé au sein de l’établissement avec le médecin scolaire, qui organise des aménagements pédagogiques sans passer par la MDPH ; et le <b>PPS</b>, qui relève d’une décision de la MDPH et peut ouvrir du matériel adapté, un accompagnant et un suivi par un service spécialisé. Ce sont les parents qui saisissent la MDPH, avec un dossier appuyé sur les certificats et les bilans. Le rôle propre de l’orthoptiste est d’apporter le <b>bilan fonctionnel</b> — ce que l’enfant voit vraiment, à quelle distance, avec quel éclairage, quelle taille de caractères, quelle endurance — et de le traduire en préconisations concrètes : place dans la classe, taille et contraste des documents, éclairage, temps majoré, aides optiques.',
    c: 'Réseau à activer sans attendre la rentrée : bilan fonctionnel écrit, préconisations concrètes pour l’enseignant, accompagnement des parents dans la saisine MDPH. Un aménagement scolaire se prépare l’année d’avant.' }
];

C.UE40 = [
  { t: 'Encadrer un stagiaire de deuxième année',
    tag: 'méthode',
    s: 'Vous accueillez pour six semaines une étudiante de deuxième année, qui observe beaucoup mais n’ose pas pratiquer.',
    q: ['Comment construisez-vous le stage ?',
        'Comment la faites-vous passer de l’observation à la pratique ?',
        'Comment l’évaluez-vous ?'],
    r: 'Un stage se construit sur des <b>objectifs d’apprentissage explicites</b>, définis avec l’étudiante dès le premier jour à partir de son portfolio et du référentiel de compétences, et hiérarchisés dans le temps. La progression suit une gradation classique : observer, puis faire <b>avec</b> (le tuteur guide geste par geste), puis faire <b>sous supervision directe</b>, puis faire seul avec débriefing. On sécurise le passage à l’acte en commençant par les gestes techniques les moins anxiogènes, sur des patients coopérants et prévenus, en annonçant à l’étudiante ce qu’on attend précisément d’elle et en la prévenant qu’on peut reprendre la main à tout moment. Le <b>débriefing</b> immédiat, court et régulier, vaut mieux qu’un bilan en fin de stage : on demande d’abord son auto-analyse, on renforce ce qui a été juste, puis on cible <b>un</b> axe d’amélioration. L’évaluation est double : <b>formative</b> tout au long, et <b>certificative</b> en fin de stage, sur des critères connus d’avance et référés aux compétences, jamais sur la sympathie.',
    c: 'Objectifs écrits au premier jour, gradation observer-faire avec-faire seul, débriefings courts et fréquents, évaluation sur critères annoncés. Un stagiaire progresse à la vitesse de la sécurité qu’on lui donne.' },

  { t: 'Une erreur commise par un stagiaire',
    tag: 'décision',
    s: 'Votre stagiaire a noté une acuité à l’envers dans le dossier (OD et OG inversés). L’erreur est découverte le lendemain, sans conséquence pour la patiente.',
    q: ['Comment réagissez-vous vis-à-vis de la patiente et du dossier ?',
        'Comment abordez-vous l’erreur avec l’étudiante ?',
        'Qu’en faites-vous au niveau de l’équipe ?'],
    r: 'D’abord le patient et la trace : on corrige le dossier de façon <b>traçable</b> — on n’efface pas, on ajoute une correction datée et signée —, on vérifie qu’aucune décision n’a été prise sur la donnée fausse, et l’on informe si nécessaire. Ensuite l’étudiante : on distingue l’<b>erreur</b> de la <b>faute</b>. Une inversion de notation est une erreur de routine, favorisée par l’organisation (ordre de saisie, interruption, fatigue). L’aborder sur le mode de la sanction produit exactement l’inverse de ce qu’on veut : la dissimulation des erreurs suivantes. On analyse donc <b>ce qui a rendu l’erreur possible</b>, on formalise une barrière simple (vérifier systématiquement le côté à voix haute, saisir immédiatement après la mesure), et l’on valorise le fait qu’elle ait été signalée. Au niveau de l’équipe, ce type d’événement relève de la <b>culture de sécurité</b> : signalement des événements indésirables, analyse collective sans recherche de coupable, et amélioration du processus.',
    c: 'Correction tracée du dossier, analyse de l’erreur avec l’étudiante sans la culpabiliser, barrière de vérification instaurée. Une équipe qui punit les erreurs cesse d’en entendre parler — pas d’en avoir.' }
];

})();
