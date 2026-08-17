/* ============================================================
   Fiches d'UE — année 1 (semestres 1 et 2)
   ------------------------------------------------------------
   Une entrée par UE, clé = code de l'UE :
     resume    : l'UE en une phrase
     objectifs : ce qu'elle attend de vous
     plan      : le cours en condensé, partie par partie
     chiffres  : les valeurs à connaître par cœur
     notions   : ce qu'on doit pouvoir réciter
     pieges    : les erreurs qui coûtent des points
     tombe     : les formes de questions les plus fréquentes
     methode   : comment travailler cette UE
   Ces fiches sont un condensé de révision : elles ne remplacent
   ni le cours du formateur, ni les protocoles du lieu de stage.
   ============================================================ */
window.UE_GUIDE = {

/* ============================ SEMESTRE 1 ============================ */

UE1: {
  resume: 'De la cellule au tissu : ce qui fait qu’un œil est transparent, sensible à la lumière, et transmissible.',
  objectifs: [
    'Relier la structure d’un tissu oculaire à sa fonction',
    'Décrire les couches de la rétine et de la cornée dans l’ordre',
    'Interpréter un arbre généalogique et nommer le mode de transmission'
  ],
  plan: [
    { t: '1 · La cellule et ses spécialisations oculaires',
      p: 'Membrane, noyau, mitochondries, réticulum. Les cellules de l’œil poussent la spécialisation à l’extrême : le photorécepteur est un neurone dont le segment externe est un empilement de disques membranaires renouvelé en permanence ; la fibre cristallinienne perd son noyau et ses organites pour devenir transparente ; l’endothélium cornéen est une monocouche de pompes qui ne se divise plus après la naissance.' },
    { t: '2 · Les épithéliums et la transparence',
      p: 'La transparence n’est jamais un hasard : elle se paie. La cornée est transparente parce que son stroma est fait de lamelles de collagène régulièrement espacées, avascularisées, et maintenues déshydratées par les pompes endothéliales — toute rupture de cet équilibre donne un œdème. Le cristallin est transparent parce que ses fibres sont anucléées, riches en cristallines, sans vaisseaux ; leur agrégation avec l’âge donne la cataracte.' },
    { t: '3 · Les 10 couches de la rétine',
      p: 'De l’extérieur vers l’intérieur : épithélium pigmentaire, photorécepteurs (segments externes/internes), limitante externe, nucléaire externe, plexiforme externe, nucléaire interne, plexiforme interne, cellules ganglionnaires, fibres optiques, limitante interne. La lumière traverse donc <b>toute</b> la rétine avant d’atteindre les photorécepteurs — sauf à la fovéola, où les couches internes sont écartées, ce qui explique sa finesse et sa vulnérabilité.' },
    { t: '4 · L’épithélium pigmentaire, cellule clé',
      p: 'Monocouche entre choriocapillaire et photorécepteurs. Il phagocyte chaque jour les articles externes usés, recycle le rétinal (cycle des rétinoïdes), absorbe la lumière parasite et forme la barrière hémato-rétinienne externe. Son vieillissement produit les drusen et la lipofuscine : c’est le point de départ de la DMLA. Son atteinte génétique donne les dystrophies rétiniennes.' },
    { t: '5 · Génétique : les quatre modes de transmission',
      p: '<b>Autosomique dominante</b> : un parent atteint, 50 % à chaque grossesse, les deux sexes, transmission verticale sur plusieurs générations. <b>Autosomique récessive</b> : parents sains conducteurs, 25 %, fratrie touchée, consanguinité fréquente. <b>Liée à l’X</b> : garçons atteints, filles conductrices, jamais de transmission père-fils (daltonisme, rétinoschisis juvénile, choroïdérémie). <b>Mitochondriale</b> : transmission <b>exclusivement maternelle</b>, tous les enfants d’une femme atteinte peuvent l’être (neuropathie optique de Leber).' },
    { t: '6 · Les grandes maladies génétiques oculaires',
      p: 'Rétinopathie pigmentaire (héréditaire, héméralopie puis rétrécissement du champ), maladie de Stargardt (dystrophie maculaire du sujet jeune), achromatopsie, albinisme (hypoplasie fovéale, nystagmus, décussation anormale), rétinoblastome (gène RB1, leucocorie, urgence vitale). Le conseil génétique repose sur l’arbre généalogique avant toute analyse moléculaire.' }
  ],
  chiffres: [
    ['Couches de la rétine', '10'],
    ['Couches de la cornée', '5'],
    ['Cônes / bâtonnets', '≈ 6 M / 120 M'],
    ['Épaisseur cornéenne centrale', '≈ 540 µm'],
    ['Part du stroma dans la cornée', '90 %'],
    ['Renouvellement des articles externes', 'quotidien'],
    ['Risque en autosomique dominante', '50 %'],
    ['Risque en autosomique récessive', '25 %']
  ],
  notions: [
    'La fovéola ne contient <b>que</b> des cônes : ni bâtonnets, ni vaisseaux, ni couches internes sus-jacentes.',
    'L’endothélium cornéen ne se régénère pas : sa densité (≈ 3 000 cell/mm² à 20 ans) ne fait que décroître.',
    'La transmission mitochondriale ne passe jamais par le père.'
  ],
  pieges: [
    'Énumérer les couches rétiniennes dans le désordre : on les nomme de l’extérieur (choroïde) vers l’intérieur (vitré).',
    'Dire « surtout des cônes » à la fovéola : il n’y a <b>que</b> des cônes.',
    'Confondre récessif autosomique et lié à l’X devant une fratrie de garçons atteints — regardez si les filles peuvent être atteintes.'
  ],
  tombe: [
    'Schéma des couches de la rétine à légender',
    'Arbre généalogique à interpréter',
    'QCM sur la répartition cônes / bâtonnets et ses conséquences'
  ],
  methode: 'Dessinez la coupe de rétine de mémoire tous les deux jours jusqu’à ce qu’elle sorte sans effort, et associez un exemple emblématique à chaque mode de transmission.'
},

UE2: {
  resume: 'L’optique dont vous vous servirez tous les jours : vergences, prismes, astigmatisme, et l’œil comme système optique.',
  objectifs: [
    'Manipuler vergences, dioptries et distances sans hésitation',
    'Calculer un effet prismatique et une transposition',
    'Expliquer une amétropie en termes optiques'
  ],
  plan: [
    { t: '1 · Vergence et dioptrie',
      p: 'La vergence d’un faisceau vaut V = n/distance ; dans l’air, V = 1/d avec d en mètres. Une cible à 33 cm émet une vergence de −3 D et demande donc 3 D d’accommodation. La puissance d’une lentille est la vergence qu’elle ajoute. Conventions : distances comptées depuis la lentille, positives dans le sens de propagation ; une lentille convergente est positive.' },
    { t: '2 · Dioptres et lentilles minces',
      p: 'Relation de conjugaison d’un dioptre sphérique : n′/p′ − n/p = (n′ − n)/R. Pour une lentille mince dans l’air : 1/p′ − 1/p = P. Grandissement γ = p′/p. On construit une image avec trois rayons : parallèle → foyer image, centre optique → non dévié, foyer objet → parallèle. Les foyers, plans principaux et points nodaux servent ensuite à modéliser l’œil.' },
    { t: '3 · L’œil comme système optique',
      p: 'Environ +60 D au total : la cornée en apporte +43 (les deux tiers, car c’est là que le saut d’indice air/tissu est le plus grand) et le cristallin +20 au repos. Longueur axiale ≈ 24 mm ; 1 mm d’écart ≈ 3 D d’amétropie. L’œil réduit (modèle de Listing) ramène tout à un dioptre unique de 60 D et un indice de 1,336 — suffisant pour la plupart des calculs cliniques.' },
    { t: '4 · Les amétropies en optique',
      p: 'Myopie : image en avant de la rétine, punctum remotum à distance finie (r = 1/D), corrigée par une lentille divergente. Hypermétropie : image virtuelle en arrière, punctum remotum virtuel, corrigée par une convergente, partiellement compensée par l’accommodation. Astigmatisme : la puissance varie selon le méridien ; deux focales séparées par l’intervalle de Sturm, avec le cercle de moindre diffusion à l’équivalent sphérique.' },
    { t: '5 · Le prisme',
      p: 'Un prisme dévie la lumière <b>vers sa base</b> et déplace l’image <b>vers son apex</b> ; l’œil tourne donc vers l’apex pour fixer. Δ = 100 × tan θ : 1 Δ dévie de 1 cm à 1 m, soit 0,57°. Les prismes ne s’additionnent rigoureusement que s’ils sont de même orientation ; deux prismes perpendiculaires se composent vectoriellement (résultante et axe).' },
    { t: '6 · Loi de Prentice et décentrement',
      p: 'Tout verre correcteur est un prisme dès qu’on regarde à côté de son centre optique : Δ = puissance (D) × décentrement (cm). D’où l’effet prismatique induit en anisométropie, en particulier dans le regard vers le bas en lecture, et l’intérêt du décentrement volontaire pour prismer sans prisme.' },
    { t: '7 · Distance de sommet, aberrations, diffraction',
      p: 'Puissance effective à une autre distance : P′ = P/(1 − d·P). Au-delà de ±4 D, un verre et une lentille de contact n’ont pas la même valeur. Les aberrations (sphérique, chromatique, coma) et la diffraction limitent la qualité optique : c’est pourquoi une pupille très petite (< 2 mm) dégrade l’image autant qu’une pupille large.' }
  ],
  chiffres: [
    ['Puissance totale de l’œil', '≈ +60 D'],
    ['Cornée / cristallin', '+43 D / +20 D'],
    ['Longueur axiale emmétrope', '≈ 24 mm'],
    ['1 mm de longueur axiale', '≈ 3 D'],
    ['1 Δ', '1 cm à 1 m ≈ 0,57°'],
    ['Prentice', 'Δ = D × cm'],
    ['Indice de l’œil réduit', '1,336'],
    ['Distance de sommet usuelle', '12 mm']
  ],
  notions: [
    'Le prisme dévie vers la base, l’image se déplace vers l’apex.',
    'Transposition : sphère + cylindre, cylindre changé de signe, axe ± 90°.',
    'Cercle de moindre diffusion = équivalent sphérique = sphère + cylindre/2.'
  ],
  pieges: [
    'Mélanger les conventions de signe : en cylindre négatif, l’<b>axe</b> est le méridien le moins puissant.',
    'Oublier de convertir les millimètres en centimètres dans Prentice — facteur 10.',
    'Appliquer la distance de sommet à l’envers : la lentille est <b>moins</b> puissante que le verre en myopie forte.'
  ],
  tombe: [
    'Série de transpositions à la chaîne',
    'Effet prismatique en anisométropie',
    'Conversion verre ↔ lentille de contact'
  ],
  methode: 'UE d’entraînement, pas de mémorisation : vingt exercices valent mieux que dix pages relues. Vérifiez-vous avec le calcul instantané (Ctrl+K puis « prentice 4 3 » ou « -2,50 -1,00 90 »).'
},

UE3: {
  resume: 'Trouver la correction d’un œil, objectivement puis subjectivement, et savoir la prescrire.',
  objectifs: [
    'Conduire une skiascopie et une réfraction subjective complètes',
    'Choisir et interpréter une cycloplégie',
    'Prescrire une correction adaptée à l’âge et à la plainte'
  ],
  plan: [
    { t: '1 · Réfraction objective : la skiascopie',
      p: 'On éclaire la pupille et on balaie un méridien. Le reflet qui se déplace <b>dans le sens</b> de la main est une ombre directe : il manque du plus. En sens contraire, ombre inverse : il y a trop de plus. À la neutralisation, la pupille s’illumine d’un coup, sans direction. On neutralise deux méridiens principaux, puis on retranche le verre de distance de travail : +1,50 à 67 cm, +2,00 à 50 cm. Le reflet incliné par rapport à la fente (rupture) signale qu’on n’est pas sur un méridien principal.' },
    { t: '2 · Réfractomètres et kératométrie',
      p: 'L’autoréfractomètre donne une base de départ, souvent myopisante chez l’enfant (accommodation instrumentale) et peu fiable sur cornée irrégulière ou cataracte. La kératométrie mesure l’astigmatisme cornéen antérieur ; l’astigmatisme total peut en différer (astigmatisme interne, cristallinien).' },
    { t: '3 · Réfraction subjective : la sphère',
      p: 'Brouillard de +1,00 à +1,50 D pour relâcher l’accommodation (l’acuité doit chuter à 2–4/10), puis réduction du plus par pas de 0,25 jusqu’à la meilleure acuité. Règle d’or : <b>la sphère la plus convexe (ou la moins concave) donnant la meilleure acuité</b>. Sur-corriger en moins fait accommoder et donne un patient qui « voit bien » mais qui fatigue.' },
    { t: '4 · Le cylindre : axe puis puissance',
      p: 'Cadran horaire ou cylindre croisé de Jackson. On cherche d’abord l’<b>axe</b> (CCJ à cheval sur l’axe présumé, on tourne vers la position préférée par pas décroissants 10° → 5° → 2°), puis la <b>puissance</b> (axes du CCJ alignés sur l’axe trouvé). Pour chaque −0,50 de cylindre ajouté, compenser par +0,25 de sphère afin de garder l’équivalent sphérique.' },
    { t: '5 · Contrôles et équilibre binoculaire',
      p: 'Test bichrome (duochrome) : rouge plus net → ajouter du moins (RAM) ; vert plus net → ajouter du plus (GAP) ; objectif l’égalité, ou très légèrement rouge. Puis équilibre binoculaire : brouillard alterné ou dissociation prismatique verticale de 3 Δ, et désembrouillage binoculaire — la correction finale se donne <b>les deux yeux ouverts</b>.' },
    { t: '6 · La cycloplégie',
      p: 'Indispensable chez l’enfant, devant tout strabisme, toute suspicion d’hypermétropie latente ou de spasme accommodatif. Tropicamide (bref, dépistage), cyclopentolate 1 % (référence en pratique courante), atropine (le plus puissant, chez le petit et le strabisme accommodatif, sur plusieurs jours). On informe toujours : photophobie et flou de près pendant quelques heures à quelques jours.' },
    { t: '7 · Presbytie et prescription',
      p: 'L’addition compense l’amplitude perdue en gardant la moitié en réserve : add ≈ demande (D) − amplitude/2. On vérifie toujours l’addition à la distance de travail réelle du patient. La prescription mentionne sphère, cylindre, axe, addition, écart pupillaire, et le port conseillé. En pratique : ≈ +1,00 à 45 ans, +1,50 à 50, +2,00 à 55, +2,50 au-delà.' }
  ],
  chiffres: [
    ['Verre de travail à 67 cm', '+1,50 D'],
    ['Verre de travail à 50 cm', '+2,00 D'],
    ['Brouillard initial', '+1,00 à +1,50 D'],
    ['Pas de la réfraction', '0,25 D'],
    ['Compensation cylindre → sphère', '−0,50 cyl → +0,25 sph'],
    ['Cyclopentolate : délai / durée', '30 min / 24 h'],
    ['Atropine : durée', '7 à 10 jours'],
    ['Addition à 45 / 55 / 65 ans', '+1,00 / +2,00 / +3,00']
  ],
  notions: [
    'Ombre directe = il manque du plus. Ombre inverse = trop de plus.',
    'Sphère la plus convexe donnant la meilleure acuité.',
    'RAM-GAP : Red Add Minus, Green Add Plus.'
  ],
  pieges: [
    'Oublier de retrancher le verre de distance de travail : toute la skiascopie est fausse de +1,50.',
    'Sous-corriger une hypermétropie d’enfant faute de cycloplégie.',
    'Donner la plus forte addition « pour être tranquille » : on rétrécit la profondeur de champ.'
  ],
  tombe: [
    'Cas de skiascopie à convertir en réfraction',
    'Ordonnance à rédiger et à transposer',
    'Indications comparées des cycloplégiques'
  ],
  methode: 'Alternez le simulateur de skiascopie et le phoroptère jusqu’à dépasser 80 % de façon régulière, et notez l’erreur systématique qui revient : c’est toujours la même.'
},

UE4: {
  resume: 'Du photon au cortex : comment le signal naît, se transforme et se transmet — et ce que mesurent les explorations.',
  objectifs: [
    'Décrire le trajet du signal visuel étage par étage',
    'Expliquer ce que mesurent ERG, PEV et sensibilité aux contrastes',
    'Relier une plainte à un étage du système visuel'
  ],
  plan: [
    { t: '1 · Photorécepteurs et phototransduction',
      p: 'Le photon isomérise le 11-cis-rétinal en tout-trans, active la rhodopsine puis la transducine, qui active une phosphodiestérase : le GMPc chute, les canaux sodiques se ferment et le photorécepteur <b>s’hyperpolarise</b>. C’est le seul récepteur sensoriel qui répond à son stimulus par une hyperpolarisation. Bâtonnets : très sensibles, saturés en photopique, un seul type de pigment (pas de couleur). Cônes S/M/L : rapides, peu sensibles, à la base de la vision des couleurs et de l’acuité.' },
    { t: '2 · Traitement rétinien et champs récepteurs',
      p: 'Photorécepteur → bipolaire → ganglionnaire, avec modulation latérale par les horizontales et les amacrines. Les champs récepteurs sont organisés en centre-pourtour antagonistes : la rétine code le <b>contraste local</b> et non la luminance absolue. Convergence très faible à la fovéa (une ganglionnaire par cône) et très forte en périphérie : d’où l’acuité centrale et la sensibilité périphérique.' },
    { t: '3 · Les voies parallèles',
      p: 'Voie magnocellulaire : grandes cellules, achromatique, sensible au mouvement et aux basses fréquences spatiales, conduction rapide. Voie parvocellulaire : petites cellules, chromatique rouge-vert, détail et hautes fréquences spatiales. Voie koniocellulaire : bleu-jaune. Elles restent séparées jusqu’au corps genouillé latéral (6 couches : 1-2 magno, 3-6 parvo).' },
    { t: '4 · Du chiasma au cortex',
      p: 'Au chiasma, seules les fibres <b>nasales</b> croisent : chaque bandelette porte donc l’hémichamp controlatéral. Bandelette → corps genouillé latéral → radiations optiques (faisceau temporal de Meyer pour le champ supérieur) → cortex occipital V1 (scissure calcarine), avec une très large représentation maculaire. Puis voie ventrale (« quoi » : formes, visages) et voie dorsale (« où » : mouvement, espace, action).' },
    { t: '5 · Adaptation, contraste, couleur',
      p: 'Adaptation à l’obscurité en deux temps : cônes en 5–7 minutes, puis cassure et bâtonnets jusqu’à un plateau vers 30 minutes. La sensibilité aux contrastes suit une courbe en cloche, maximale vers 3–5 cycles/degré ; elle peut être effondrée avec 10/10. La couleur est codée par opposition (rouge-vert, bleu-jaune, noir-blanc) après un codage trichromatique au niveau des cônes.' },
    { t: '6 · Les explorations électrophysiologiques',
      p: 'ERG global : onde a (photorécepteurs) puis onde b (bipolaires et Müller) — atteinte rétinienne étendue. ERG multifocal : réponse maculaire topographique. PEV : intégrité de la voie jusqu’au cortex, allongement de la latence P100 dans les démyélinisations. EOG : fonction de l’épithélium pigmentaire. Règle de lecture : ERG normal + PEV altéré = atteinte rétro-rétinienne.' }
  ],
  chiffres: [
    ['Hyperpolarisation à la lumière', 'photorécepteurs'],
    ['Couches du corps genouillé', '6 (1-2 magno, 3-6 parvo)'],
    ['Fibres croisant au chiasma', 'nasales (≈ 53 %)'],
    ['Adaptation complète à l’obscurité', '≈ 30 min'],
    ['Pic de sensibilité au contraste', '3 à 5 cycles/degré'],
    ['10/10 en fréquence spatiale', '≈ 30 cycles/degré'],
    ['Latence P100 du PEV', '≈ 100 ms']
  ],
  notions: [
    'Seules les fibres nasales croisent au chiasma.',
    'La rétine code le contraste, pas la luminance.',
    'ERG normal + PEV altéré = lésion en arrière de la rétine.'
  ],
  pieges: [
    'Dire que le photorécepteur se dépolarise à la lumière.',
    'Faire croiser les fibres temporales au chiasma.',
    'Croire qu’une acuité à 10/10 exclut une atteinte fonctionnelle : la sensibilité aux contrastes peut être effondrée.'
  ],
  tombe: [
    'Schéma des voies visuelles avec lésions à localiser',
    'Interprétation d’un couple ERG / PEV',
    'Question sur les voies magno et parvocellulaires'
  ],
  methode: 'Tout tient dans un schéma : les voies visuelles avec les cinq sites de lésion classiques et leurs déficits. Le maîtriser ici, c’est aussi gagner l’UE22.'
},

UE5: {
  resume: 'Mesurer ce que l’œil voit : les acuités, leurs échelles, leurs limites — et ce qu’une baisse veut dire.',
  objectifs: [
    'Mesurer et convertir une acuité dans toutes les notations',
    'Choisir l’échelle adaptée à l’âge et à la pathologie',
    'Interpréter une baisse d’acuité selon le contexte'
  ],
  plan: [
    { t: '1 · Les quatre acuités',
      p: 'Minimum visible (détection d’un point), minimum séparable (résolution — c’est ce qu’on mesure), minimum reconnaissable (identification d’un optotype), et hyperacuité (vernier, alignement, jusqu’à 5 secondes d’arc, bien meilleure que la résolution). Confondre ces notions fait dire des absurdités sur les limites physiologiques de l’œil.' },
    { t: '2 · Bases angulaires',
      p: '10/10 correspond à un pouvoir séparateur de 1 minute d’arc ; l’optotype entier sous-tend 5 minutes d’arc (le fameux « E » de 5×5). La taille physique dépend donc de la distance : un optotype 10/10 mesure environ 7,3 mm de haut à 5 m. Le facteur limitant est la mosaïque des cônes fovéolaires et la diffraction.' },
    { t: '3 · Les échelles et leurs pièges',
      p: 'Monoyer (dixièmes, progression linéaire) : surévalue les basses acuités et compare mal deux mesures. logMAR / ETDRS (progression logarithmique, même nombre de lettres par ligne) : c’est la référence scientifique — chaque ligne vaut 0,1 logMAR, chaque lettre 0,02. Snellen (20/x ou 6/x) dans les pays anglo-saxons. De près : Parinaud, à sa distance de lecture, ou échelles logMAR de près.' },
    { t: '4 · Ce qui fait varier une acuité',
      p: 'Éclairage, contraste, temps de présentation, correction portée, distance réelle, coopération. Le <b>crowding</b> (effet d’entassement) fait chuter l’acuité quand les optotypes sont alignés : cet écart isolé/aligné est majeur dans l’amblyopie, d’où l’obligation de tester les deux. Le trou sténopéique améliore une baisse d’origine optique, pas une atteinte organique.' },
    { t: '5 · Vision de près, basse vision, enfant',
      p: 'De près, on note l’échelle, la distance et la correction. Quand les optotypes ne sont plus lisibles : compte les doigts, mouvements de la main, perception lumineuse avec ou sans projection. Chez l’enfant : regard préférentiel (cartes de Teller) avant 1 an, images (Rossano, Pigassou) vers 2–3 ans, E de Snellen ou Landolt vers 4 ans, lettres ensuite.' },
    { t: '6 · Autres fonctions monoculaires',
      p: 'Sensibilité aux contrastes (Pelli-Robson), vision des couleurs, éblouissement, temps de récupération après éblouissement, champ visuel. Une plainte avec 10/10 doit faire explorer ces fonctions : la cataracte débutante, la neuropathie optique et l’œdème maculaire s’y révèlent souvent avant l’acuité.' }
  ],
  chiffres: [
    ['10/10', '1 minute d’arc'],
    ['Optotype entier', '5 minutes d’arc'],
    ['Hauteur d’un 10/10 à 5 m', '≈ 7,3 mm'],
    ['1 ligne ETDRS', '0,1 logMAR'],
    ['1 lettre ETDRS', '0,02 logMAR'],
    ['5/10 en logMAR', '0,3'],
    ['1/10 en logMAR', '1,0'],
    ['Acuité du nourrisson à 1 mois', '≈ 1/20']
  ],
  notions: [
    'logMAR = −log₁₀(acuité décimale).',
    'Le crowding : écart entre acuité isolée et alignée, signature de l’amblyopie.',
    'Le trou sténopéique améliore l’optique, pas l’organique.'
  ],
  pieges: [
    'Convertir 5/10 en « 0,5 logMAR » : c’est 0,3.',
    'Mesurer de près sans respecter la distance de l’échelle.',
    'Omettre de noter la correction portée et la distance : la mesure n’est plus comparable.'
  ],
  tombe: [
    'Tableau de conversions à compléter',
    'Cas d’amblyopie avec crowding',
    'Choix d’une échelle selon l’âge'
  ],
  methode: 'Les conversions doivent être automatiques : entraînez-vous avec Ctrl+K (« 5/10 », « logmar 0,3 »), puis refaites-les à froid sans l’application.'
},

UE7: {
  resume: 'L’anatomie qui explique la clinique : six muscles, trois nerfs, une orbite — et ce qui se passe quand l’un lâche.',
  objectifs: [
    'Situer origine, trajet, insertion et innervation de chaque muscle',
    'Décrire l’orbite, ses parois et ses orifices',
    'Déduire un tableau clinique d’une donnée anatomique'
  ],
  plan: [
    { t: '1 · L’orbite',
      p: 'Pyramide quadrangulaire à sommet postérieur, formée de 7 os, contenant globe, muscles, graisse, nerfs et vaisseaux. Parois : supérieure (frontal), latérale (la plus solide : grande aile du sphénoïde + zygomatique), inférieure (plancher, mince), médiale (lame papyracée de l’ethmoïde, très fine). D’où les fractures « blow-out » du plancher avec incarcération du droit inférieur, et la propagation des sinusites ethmoïdales.' },
    { t: '2 · Orifices et contenus',
      p: 'Canal optique : nerf optique (II) et artère ophtalmique. Fente sphénoïdale (fissure orbitaire supérieure) : III, IV, VI, branches du V1, veine ophtalmique supérieure — un syndrome de la fente associe donc ophtalmoplégie complète et anesthésie cornéenne. Fissure orbitaire inférieure : V2. Anneau de Zinn : origine commune des quatre droits, autour du canal optique.' },
    { t: '3 · Les quatre muscles droits',
      p: 'Tous naissent de l’anneau de Zinn et s’insèrent sur la sclère à distance croissante du limbe — spirale de Tillaux : médial 5,5 mm, inférieur 6,5, latéral 6,9, supérieur 7,7. Le droit médial est le plus puissant en adduction ; il n’a aucune action secondaire, ce qui en fait la cible privilégiée de la chirurgie. Les droits verticaux font un angle de 23° avec l’axe visuel : ils ne sont élévateur/abaisseur purs qu’en abduction de 23°.' },
    { t: '4 · Les deux obliques',
      p: 'Oblique supérieur : naît à l’apex, se dirige en avant, passe par la <b>trochlée</b> (poulie antéro-nasale) puis se réfléchit en arrière et en dehors pour s’insérer dans le quadrant supéro-temporal postérieur — son tendon réfléchi fait un angle de 51° avec l’axe visuel. Oblique inférieur : le seul à naître en avant, à l’angle inféro-nasal de l’orbite, insertion postérieure près de la macula.' },
    { t: '5 · Innervation',
      p: 'Tout par le III <b>sauf</b> le droit latéral (VI) et l’oblique supérieur (IV) — « LR6 SO4, tous les autres 3 ». Le III se divise en branche supérieure (droit supérieur + releveur de la paupière) et branche inférieure (droit médial, droit inférieur, oblique inférieur + fibres parasympathiques du sphincter irien et du muscle ciliaire). Cette division explique les paralysies partielles du III.' },
    { t: '6 · Annexes et vascularisation',
      p: 'Paupières : muscle orbiculaire (VII), releveur (III) et muscle de Müller (sympathique — d’où le ptosis discret du syndrome de Claude Bernard-Horner). Appareil lacrymal : glande lacrymale (sécrétion réflexe), points, canalicules, sac, canal lacrymo-nasal. Vascularisation par l’artère ophtalmique, première branche de la carotide interne ; l’artère centrale de la rétine en est une branche terminale, sans suppléance.' }
  ],
  chiffres: [
    ['Spirale de Tillaux (DM/DI/DL/DS)', '5,5 / 6,5 / 6,9 / 7,7 mm'],
    ['Os de l’orbite', '7'],
    ['Angle des droits verticaux', '23°'],
    ['Angle du tendon de l’oblique supérieur', '51°'],
    ['Volume orbitaire', '≈ 30 mL'],
    ['Muscles innervés par le III', '4 sur 6 + releveur'],
    ['Sclère la plus fine', '0,3 mm sous les insertions']
  ],
  notions: [
    'Le nerf optique passe par le canal optique, pas par la fente sphénoïdale.',
    'LR6 SO4, tous les autres 3.',
    'L’oblique inférieur est le seul muscle à origine antérieure.'
  ],
  pieges: [
    'Inverser l’ordre de la spirale de Tillaux — on part du droit médial, le plus proche du limbe.',
    'Oublier que le III est double : une branche peut être atteinte isolément.',
    'Confondre fente sphénoïdale et canal optique.'
  ],
  tombe: [
    'Schéma d’orbite ou de muscles à légender',
    'Tableau muscle / nerf / actions à compléter',
    'Fracture du plancher avec limitation de l’élévation'
  ],
  methode: 'Le module Anatomie interactive sert exactement à ça : cliquez chaque structure jusqu’à ce que le nom vienne avant l’étiquette, puis refaites le schéma sur papier.'
},

UE8: {
  resume: 'Comment les deux yeux bougent ensemble et fabriquent une seule vision en relief.',
  objectifs: [
    'Énoncer et appliquer les lois de la motilité oculaire',
    'Décrire les mécanismes de la vision binoculaire normale',
    'Situer un patient dans les trois degrés de Worth'
  ],
  plan: [
    { t: '1 · Actions musculaires',
      p: 'Chaque muscle a une action principale, secondaire et tertiaire, variables avec la position du regard. Droits horizontaux : action unique. Droit supérieur : élévation → intorsion → adduction. Droit inférieur : abaissement → extorsion → adduction. Oblique supérieur : <b>intorsion</b> → abaissement → abduction. Oblique inférieur : extorsion → élévation → abduction. Les obliques sont abaisseur/élévateur purs en adduction de 51°, les droits verticaux en abduction de 23°.' },
    { t: '2 · Les lois fondamentales',
      p: '<b>Sherrington</b> (innervation réciproque) : la contraction d’un muscle s’accompagne du relâchement de son antagoniste homolatéral. <b>Hering</b> : les muscles synergistes des deux yeux reçoivent une innervation <b>égale et simultanée</b> — c’est la loi qui explique que la déviation secondaire (œil sain fixateur) soit plus grande que la déviation primaire dans une paralysie. <b>Listing</b> : tout mouvement se ramène à une rotation autour d’un axe du plan de Listing, sans torsion en position primaire.' },
    { t: '3 · Les types de mouvements',
      p: 'Ductions (monoculaires), versions (binoculaires, même sens), vergences (sens opposés). Les saccades atteignent 200 à 700°/s (déclenchées par le colliculus supérieur et le champ oculomoteur frontal), la poursuite plafonne à 30–50°/s et nécessite une cible mobile, les vergences sont lentes (≈ 20°/s). S’y ajoutent le réflexe vestibulo-oculaire et le nystagmus optocinétique.' },
    { t: '4 · Vision binoculaire : les bases sensorielles',
      p: 'Correspondance rétinienne normale : à chaque point d’une rétine correspond un point de l’autre, donnant une direction visuelle commune. La fovéa est le point zéro. L’<b>horoptère</b> est le lieu géométrique des points vus simples ; autour de lui, l’<b>aire de Panum</b> tolère une disparité — c’est dans cette zone que naît la stéréoscopie. Au-delà : diplopie physiologique (celle du cordon de Brock).' },
    { t: '5 · Les trois degrés de Worth',
      p: 'Degré I perception simultanée (les deux images sont perçues ensemble), degré II fusion — sensorielle (une seule image) et motrice (amplitudes de vergence) —, degré III stéréoscopie (relief par disparité). On ne travaille jamais le degré III avant d’avoir le II. Tests : synoptophore, Worth, Bagolini, TNO, Titmus, Lang.' },
    { t: '6 · Accommodation et vergence',
      p: 'Accommoder déclenche de la convergence (convergence accommodative) et converger déclenche de l’accommodation. Le rapport AC/A quantifie le premier lien : normal 3 à 5 Δ/D. La vergence fusionnelle mesurée en flou / rupture / recouvrement dispose d’une réserve : on l’exige au moins double de la phorie (critère de Sheard).' }
  ],
  chiffres: [
    ['Vitesse des saccades', '200 à 700°/s'],
    ['Vitesse de poursuite', '≤ 30 à 50°/s'],
    ['AC/A normal', '3 à 5 Δ/D'],
    ['Convergence fusionnelle VP (Morgan)', '17 / 21 / 11 Δ'],
    ['Divergence fusionnelle VP (Morgan)', '13 / 21 / 13 Δ'],
    ['Stéréo-acuité normale', '≤ 60 secondes d’arc'],
    ['Aire de Panum (fovéa)', '≈ 6 à 10 minutes d’arc'],
    ['Angle des obliques', '51°']
  ],
  notions: [
    'Hering concerne les deux yeux, Sherrington un seul.',
    'L’oblique supérieur est avant tout un <b>intorteur</b>.',
    'Pas de stéréoscopie sans fusion.'
  ],
  pieges: [
    'Attribuer à Hering ce qui relève de Sherrington.',
    'Confondre horoptère (points vus simples) et aire de Panum (tolérance de disparité).',
    'Croire qu’une bonne acuité binoculaire prouve une vision binoculaire normale.'
  ],
  tombe: [
    'Application de la loi de Hering à une paralysie',
    'Degrés de Worth et tests correspondants',
    'Interprétation d’amplitudes de fusion'
  ],
  methode: 'Reliez chaque loi à un test : Hering → cover test alterné dans une paralysie, Worth → verres rouge-vert, Panum → stéréotests.'
},

UE9: {
  resume: 'Quand la binocularité se déséquilibre : phories, tropies, incomitances, et les adaptations que l’enfant met en place.',
  objectifs: [
    'Distinguer phorie, tropie, comitance et incomitance',
    'Reconnaître les adaptations sensorielles et leurs conséquences',
    'Construire un raisonnement diagnostique devant une déviation'
  ],
  plan: [
    { t: '1 · Phorie, tropie, et comment on les révèle',
      p: 'La <b>phorie</b> est une déviation latente, compensée par la fusion : elle n’apparaît qu’à la dissociation (cover test alterné, Maddox). La <b>tropie</b> est manifeste : le cover test unilatéral montre un mouvement de refixation de l’œil découvert. On mesure toujours de loin et de près, avec et sans correction, et l’on note l’œil fixateur. Une phorie « décompensée » donne les mêmes symptômes qu’une tropie sans en être une.' },
    { t: '2 · Comitance et incomitance',
      p: 'Une déviation comitante garde le même angle dans toutes les directions et quel que soit l’œil fixateur : elle est typiquement d’origine « innervationnelle », ancienne, de l’enfance. Une déviation incomitante varie avec la direction du regard (paralysie, restriction, syndrome) : c’est le signe qui impose l’examen des 9 positions, le Lancaster et, souvent, un avis neurologique.' },
    { t: '3 · Les adaptations sensorielles de l’enfant',
      p: 'Face à la diplopie et à la confusion, un système visuel immature s’adapte : <b>neutralisation</b> (suppression active de l’image de l’œil dévié), <b>correspondance rétinienne anormale</b> (nouvelle relation entre fovéa fixatrice et point rétinien de l’œil dévié) et <b>amblyopie</b>. Ces adaptations évitent l’inconfort mais coûtent la vision binoculaire — et rendent le pronostic sensoriel d’autant plus mauvais qu’elles sont anciennes.' },
    { t: '4 · L’adulte : pas d’adaptation possible',
      p: 'Après la période sensible, plus de neutralisation possible : toute déviation nouvelle donne une <b>diplopie</b>. C’est un signal d’alerte qui impose de dater précisément l’apparition, de rechercher une incomitance, une atteinte pupillaire, un ptosis, un signe neurologique. Une diplopie récente n’est jamais banale.' },
    { t: '5 · Rôle de l’accommodation et de l’AC/A',
      p: 'Un AC/A élevé donne une ésotropie plus grande de près (excès de convergence) ; un AC/A bas avec exophorie de près oriente vers l’insuffisance de convergence. L’hypermétropie non corrigée fait converger : c’est le mécanisme de l’ésotropie accommodative, réversible sous correction totale. Toute évaluation d’angle se fait donc <b>avec la correction optique portée</b>.' },
    { t: '6 · Torticolis et positions de blocage',
      p: 'Un torticolis se lit comme un traitement que le patient s’est donné : il place les yeux dans la position de moindre déviation ou de meilleure acuité. Tête tournée → paralysie d’un droit horizontal ; tête inclinée → paralysie du IV (inclinaison du côté opposé à l’œil atteint) ; menton relevé ou abaissé → syndrome alphabétique ou nystagmus à zone neutre.' }
  ],
  chiffres: [
    ['Cover test : mesure', 'VL et VP, avec et sans correction'],
    ['Exophorie VP physiologique', '≈ 3 à 6 Δ'],
    ['AC/A normal', '3 à 5 Δ/D'],
    ['Période sensible', 'jusqu’à 6-8 ans'],
    ['Angle kappa positif', 'simule une exotropie'],
    ['Déviation secondaire', '> déviation primaire (Hering)']
  ],
  notions: [
    'Cover unilatéral = tropies ; cover alterné = déviation totale. Jamais l’un sans l’autre.',
    'Toute diplopie récente chez l’adulte est un signe d’alerte.',
    'La déviation secondaire est toujours plus grande que la primaire.'
  ],
  pieges: [
    'Conclure « strabisme » sans avoir fait le cover alterné.',
    'Négliger la mesure de près, qui seule révèle l’AC/A.',
    'Prendre un angle kappa positif pour une exotropie.'
  ],
  tombe: [
    'Cas clinique avec cover test à interpréter et à noter',
    'Différencier ésotropie congénitale et accommodative',
    'Question sur la correspondance rétinienne anormale'
  ],
  methode: 'Entraînez-vous au cover test simulé jusqu’à lire le mouvement instantanément, puis notez chaque cas dans la notation clinique complète.'
},

UE12: {
  resume: 'Le cadre : ce que l’orthoptiste a le droit de faire, ce qu’il doit taire, et d’où vient la profession.',
  objectifs: [
    'Connaître le cadre légal de l’exercice',
    'Appliquer le secret professionnel et la traçabilité',
    'Situer la profession dans son histoire'
  ],
  plan: [
    { t: '1 · Une profession de santé réglementée',
      p: 'L’orthoptiste est un auxiliaire médical inscrit au code de la santé publique, dont les actes sont définis par décret. Exercice sur prescription médicale, avec des exceptions désormais notables : accès direct encadré pour certains bilans, renouvellement et adaptation des corrections optiques sous conditions d’âge et d’ancienneté, dépistage. Diplôme d’État (certificat de capacité) en 3 ans, 180 ECTS.' },
    { t: '2 · Le secret professionnel',
      p: 'Il couvre tout ce dont on a connaissance dans l’exercice, y compris ce qui est confié par l’entourage ou déduit. Il n’est pas levé par la demande d’un proche, ni par le fait que l’information soit « déjà connue ». Le secret est <b>partagé</b> dans l’équipe de soins, mais seulement pour ce qui est nécessaire à la prise en charge. Sa violation est un délit.' },
    { t: '3 · Devoirs et responsabilité',
      p: 'Consentement éclairé, information loyale et adaptée, non-discrimination, continuité des soins, obligation de moyens. Responsabilité civile (assurance obligatoire), pénale et disciplinaire. Le dossier patient doit être tenu, conservé et accessible au patient sur demande.' },
    { t: '4 · Histoire de la profession',
      p: 'Née dans l’entre-deux-guerres autour du traitement du strabisme et de la rééducation de la vision binoculaire (travaux de Javal, développement du synoptophore), la profession est reconnue par le certificat de capacité en 1956. Le champ s’élargit ensuite à l’exploration fonctionnelle, la basse vision, la neurovision, puis au travail aidé en cabinet d’ophtalmologie, qui a transformé l’accès aux soins.' }
  ],
  chiffres: [
    ['Durée des études', '3 ans, 180 ECTS'],
    ['Certificat de capacité', 'créé en 1956'],
    ['Assurance responsabilité civile', 'obligatoire'],
    ['Accès au dossier par le patient', 'de droit']
  ],
  notions: [
    'Les actes sont définis par décret ; l’accès direct est encadré, pas illimité.',
    'Le secret professionnel n’est pas levé par la demande d’un proche.'
  ],
  pieges: [
    'Croire que l’accès direct dispense de tout cadre.',
    'Confondre secret professionnel (obligation légale) et discrétion.'
  ],
  tombe: [
    'Question sur le champ des actes et la prescription',
    'Cas pratique de secret professionnel',
    'Repères historiques'
  ],
  methode: 'UE courte à points faciles : une relecture ciblée du décret d’actes et deux fiches suffisent. Ne la négligez pas, elle se rattrape mal.'
},

UE16: {
  resume: 'Les pathologies que vous croiserez chaque jour, et celles qu’il ne faut jamais laisser passer.',
  objectifs: [
    'Reconnaître les grandes pathologies ophtalmologiques',
    'Trier ce qui est urgent de ce qui ne l’est pas',
    'Relier une maladie générale à ses signes oculaires'
  ],
  plan: [
    { t: '1 · L’œil rouge : le tri fondamental',
      p: 'Rouge <b>sans</b> douleur ni baisse d’acuité : conjonctivite, hémorragie sous-conjonctivale, épisclérite — bénin. Rouge <b>avec</b> douleur et/ou baisse d’acuité : kératite, uvéite antérieure, glaucome aigu par fermeture de l’angle, sclérite — urgence. Les trois signes à chercher systématiquement : acuité, douleur profonde, aspect de la pupille.' },
    { t: '2 · Segment antérieur',
      p: 'Sécheresse oculaire (la plainte la plus fréquente : BUT < 10 s, Schirmer < 10 mm/5 min), blépharites et dysfonctionnement meibomien, kératocône (astigmatisme irrégulier évolutif du sujet jeune), cataracte (baisse progressive, éblouissement, myopisation d’indice), glaucome aigu (œil rouge très douloureux, pupille en semi-mydriase aréflexique, cornée trouble, nausées).' },
    { t: '3 · Le glaucome chronique',
      p: 'Neuropathie optique progressive : excavation papillaire croissante (C/D), déficit périmétrique arciforme puis en marche d’escalier nasale, PIO souvent mais pas toujours élevée (glaucome à pression normale). L’acuité centrale reste longtemps normale : c’est le champ visuel et l’OCT des fibres qui parlent. Facteurs de risque : âge, antécédents familiaux, myopie forte, origine africaine, cornée fine.' },
    { t: '4 · Rétine et macula',
      p: 'DMLA sèche (drusen, atrophie géographique, évolution lente) et exsudative (néovaisseaux, métamorphopsies brutales — urgence thérapeutique, anti-VEGF). Occlusions vasculaires : OACR (baisse brutale indolore, rétine pâle, macula rouge cerise — urgence absolue) et OVCR (hémorragies en flammèches diffuses). Décollement de rétine : myodésopsies, phosphènes, voile périphérique progressif.' },
    { t: '5 · Maladies générales',
      p: 'Diabète : rétinopathie évoluant des microanévrismes aux néovaisseaux, œdème maculaire première cause de baisse d’acuité, dépistage annuel. HTA : rétrécissement artériolaire, signe de Salus-Gunn au croisement, hémorragies en flammèches, étoile maculaire et œdème papillaire dans les formes malignes. Autres : Basedow (exophtalmie, rétraction palpébrale, atteinte des droits inférieurs), sclérose en plaques, maladies inflammatoires (uvéites).' },
    { t: '6 · Ce qu’on ne laisse pas passer',
      p: 'Baisse d’acuité brutale, diplopie récente, œil rouge douloureux, métamorphopsies récentes, leucocorie de l’enfant, œdème papillaire bilatéral, mydriase avec ptosis. Chacune impose un avis médical rapide — dans certains cas le jour même.' }
  ],
  chiffres: [
    ['PIO normale', '10 à 21 mmHg'],
    ['C/D normal', '≤ 0,3 – 0,4'],
    ['Asymétrie C/D suspecte', '> 0,2'],
    ['BUT normal', '> 10 s'],
    ['Schirmer normal', '> 10 mm / 5 min'],
    ['Rapport artère/veine', '2/3'],
    ['Dépistage rétinopathie diabétique', 'annuel'],
    ['Délai de l’OACR', 'urgence immédiate']
  ],
  notions: [
    'Œil rouge douloureux avec baisse d’acuité = urgence.',
    'Une PIO normale n’élimine pas un glaucome.',
    'Métamorphopsies récentes = DMLA exsudative jusqu’à preuve du contraire.'
  ],
  pieges: [
    'Rassurer devant un œil rouge douloureux.',
    'Attendre la baisse d’acuité pour s’inquiéter d’un glaucome.',
    'Confondre métamorphopsies (macula) et scotome (nerf optique).'
  ],
  tombe: [
    'Tri urgence / non urgence devant un œil rouge',
    'Reconnaissance de fond d’œil pathologique',
    'Signes oculaires du diabète et de l’HTA'
  ],
  methode: 'Le simulateur de fond d’œil contient les treize tableaux classiques : entraînez-vous en mode diagnostic jusqu’à reconnaître chaque image en moins de cinq secondes.'
},

/* ============================ SEMESTRE 2 ============================ */

UE10: {
  resume: 'Les examens complémentaires : lequel demander, comment le lire, et ce qu’il prouve vraiment.',
  objectifs: [
    'Choisir l’exploration adaptée à une question clinique',
    'Lire un champ visuel, un test coloré, un ERG, un PEV, un OCT',
    'Relier un résultat à une localisation lésionnelle'
  ],
  plan: [
    { t: '1 · Le champ visuel',
      p: 'Périmétrie automatisée statique (24-2, 30-2, 10-2 pour la macula) : on cherche le seuil de sensibilité en dB, point par point. Indices : <b>MD</b> (déficit moyen, atteinte globale), <b>PSD</b> (déficit localisé), GHT. Périmétrie cinétique de Goldmann pour les grands déficits, les patients fatigables et le neurologique. On vérifie toujours la fiabilité : pertes de fixation, faux positifs, faux négatifs.' },
    { t: '2 · Lire un déficit campimétrique',
      p: 'Scotome central → macula ou nerf optique. Déficit arciforme, ressaut nasal → glaucome. Déficit altitudinal → neuropathie optique ischémique. Élargissement de la tache aveugle → œdème papillaire. Hémianopsie bitemporale → chiasma. Hémianopsie latérale homonyme → rétro-chiasmatique, d’autant plus congruente que la lésion est postérieure. Quadranopsie supérieure → radiations temporales (Meyer).' },
    { t: '3 · Vision des couleurs',
      p: 'Ishihara : dépistage rapide de l’axe rouge-vert, congénital surtout — insensible à l’axe bleu-jaune. Farnsworth D15 et 100-Hue : classement, mise en évidence de l’axe et de sa sévérité. <b>Règle de Köllner</b> : atteinte des couches externes de la rétine → dyschromatopsie bleu-jaune ; atteinte du nerf optique → rouge-vert. Toujours en éclairage normalisé, œil par œil.' },
    { t: '4 · Électrophysiologie',
      p: 'ERG global (rétine entière : onde a photorécepteurs, onde b bipolaires) — effondré dans la rétinopathie pigmentaire. ERG multifocal : topographie maculaire. PEV : voie jusqu’au cortex, latence P100 allongée dans les démyélinisations, utile aussi pour estimer l’acuité chez le non-communicant. EOG : rapport d’Arden, épithélium pigmentaire (maladie de Best).' },
    { t: '5 · OCT et imagerie',
      p: 'OCT maculaire : épaisseur, logettes, fluide sous-rétinien, membrane épirétinienne, trou maculaire. OCT du nerf optique : RNFL et complexe cellulaire ganglionnaire, souvent altérés <b>avant</b> le champ visuel dans le glaucome. Angiographie et angio-OCT pour la vascularisation. Toujours vérifier la qualité du signal et la segmentation avant d’interpréter.' },
    { t: '6 · Sensibilité aux contrastes et autres',
      p: 'Pelli-Robson, réseaux sinusoïdaux : une sensibilité effondrée avec 10/10 explique bien des plaintes (cataracte débutante, neuropathie optique, œdème). Complètent le bilan : test d’éblouissement, temps de récupération photostress, biomicroscopie et pachymétrie pour l’interprétation de la PIO.' }
  ],
  chiffres: [
    ['Stratégie standard', '24-2 ou 30-2'],
    ['Stratégie maculaire', '10-2'],
    ['MD normal', '≈ 0 dB'],
    ['Fiabilité : pertes de fixation', '< 20 %'],
    ['Latence P100', '≈ 100 ms'],
    ['RNFL moyen normal', '≈ 90 à 100 µm'],
    ['Épaisseur maculaire centrale', '≈ 250 à 280 µm']
  ],
  notions: [
    'Köllner : rétine externe → bleu-jaune ; nerf optique → rouge-vert.',
    'Dans le glaucome, l’OCT se dégrade souvent avant le champ visuel.',
    'Un examen non fiable ne s’interprète pas.'
  ],
  pieges: [
    'Interpréter un champ visuel sans regarder les indices de fiabilité.',
    'Confondre déficit altitudinal et hémianopsie.',
    'Croire qu’un Ishihara normal élimine toute dyschromatopsie.'
  ],
  tombe: [
    'Champ visuel à interpréter avec localisation',
    'Choix de l’examen devant une plainte donnée',
    'Question sur la règle de Köllner'
  ],
  methode: 'Travaillez par paires « un examen, une pathologie type ». Les modules Champ visuel et Vision des couleurs contiennent les tableaux les plus fréquents.'
},

UE11: {
  resume: 'L’UE la plus lourde de l’année et le cœur du métier : conduire un bilan complet, dans l’ordre, et le conclure.',
  objectifs: [
    'Dérouler un bilan orthoptique complet sans rien oublier',
    'Noter les résultats dans la notation conventionnelle',
    'Adapter le bilan à la plainte plutôt que dérouler une liste'
  ],
  plan: [
    { t: '1 · L’interrogatoire, qui oriente tout le reste',
      p: 'Motif, ancienneté, circonstances de survenue (lecture, fatigue, écran), horaire, latéralité, retentissement (scolaire, professionnel, conduite). Antécédents personnels et familiaux, corrections portées et depuis quand, traitements, port d’écran. Une plainte de fin de journée en lecture oriente déjà vers la binocularité ; une baisse permanente, vers l’organique.' },
    { t: '2 · L’ordre du bilan — et pourquoi il n’est pas négociable',
      p: 'Acuités (VL et VP, sans puis avec correction, œil par œil puis binoculaire) → réfraction → <b>examen sensoriel</b> (Worth, Bagolini, stéréo) → cover test → mesures prismatiques → motilité → PPC → amplitudes de fusion → accommodation. Les tests <b>dissociants</b> (Maddox, écran alterné prolongé) viennent après le sensoriel : les faire avant, c’est provoquer soi-même la rupture de fusion qu’on croira observer.' },
    { t: '3 · Cover test et mesures',
      p: 'Cover unilatéral (tropies) puis alterné (déviation totale), de loin et de près, avec correction. On note nature, sens, amplitude, distance, œil fixateur, comitance. La mesure se fait aux prismes jusqu’à neutralisation, ou au Krimsky/Hirschberg chez le non-coopérant (1 mm de décentrement ≈ 7° ≈ 15 Δ).' },
    { t: '4 · Le bilan sensoriel',
      p: 'Worth (fusion, neutralisation, diplopie), Bagolini (correspondance rétinienne en conditions quasi naturelles), stéréotests (TNO le plus rigoureux car sans indice monoculaire). Le résultat s’interprète avec l’angle : une fusion en présence d’une tropie évoque une correspondance rétinienne anormale.' },
    { t: '5 · Vergences et accommodation',
      p: 'PPC noté rupture/recouvrement, répété <b>trois fois</b> pour dépister la fatigabilité. Amplitudes de fusion en flou/rupture/recouvrement, en convergence et divergence, de loin et de près. Accommodation : amplitude (méthode de Donders), souplesse aux flippers ±2,00 D, accommodation relative. AC/A par gradient ou par hétérophorie.' },
    { t: '6 · La synthèse',
      p: 'Un bilan se conclut : diagnostic orthoptique (le dysfonctionnement et son retentissement), cohérence entre plainte et mesures, proposition (rééducation, correction, avis médical), et critères de réévaluation. Une suite de chiffres n’est pas un bilan.' }
  ],
  chiffres: [
    ['PPC normal (rupture)', '≤ 6 à 8 cm'],
    ['Recouvrement', '≤ rupture + 5 cm'],
    ['Convergence fusionnelle VP', '17 / 21 / 11 Δ'],
    ['Divergence fusionnelle VP', '13 / 21 / 13 Δ'],
    ['Amplitude d’accommodation', 'Hofstetter : 18,5 − 0,3 × âge'],
    ['Souplesse accommodative (adulte)', '≥ 8 cycles/min'],
    ['AC/A normal', '3 à 5 Δ/D'],
    ['Hirschberg : 1 mm', '≈ 7° ≈ 15 Δ']
  ],
  notions: [
    'Sensoriel avant dissociant : toujours.',
    'PPC répété trois fois pour la fatigabilité.',
    'Critère de Sheard : réserve opposée ≥ 2 × phorie.'
  ],
  pieges: [
    'Faire le Maddox avant le Worth.',
    'Mesurer le PPC une seule fois.',
    'Rendre un bilan sans conclusion.'
  ],
  tombe: [
    'Bilan complet à ordonner ou à critiquer',
    'Notation clinique à rédiger à partir de résultats bruts',
    'Calcul d’AC/A par les deux méthodes'
  ],
  methode: '6 ECTS et la base de tous vos stages : enchaînez les consultations du mode patient jusqu’à ce que l’ordre devienne un réflexe, et rédigez le compte rendu à chaque fois.'
},

UE13: {
  resume: 'Ne pas transmettre ce qu’on soigne : hygiène des mains, du matériel, et conduite devant un accident.',
  objectifs: [
    'Appliquer les précautions standard en consultation',
    'Assurer l’entretien du matériel au contact de l’œil',
    'Réagir devant un accident d’exposition'
  ],
  plan: [
    { t: '1 · Précautions standard',
      p: 'Friction hydro-alcoolique avant et après chaque patient, avant et après chaque geste — elle prime sur le lavage à l’eau sauf mains visiblement souillées. Gants si contact avec un liquide biologique, jamais en remplacement de l’hygiène des mains. Tenue propre, ongles courts, pas de bijoux aux mains.' },
    { t: '2 · Le matériel orthoptique',
      p: 'Tout ce qui touche la cornée, les larmes ou la peau péri-oculaire : occluseurs, prismes, verres d’essai, montures, mentonnière et appui-front du réfracteur, barre de prismes. Nettoyage puis désinfection selon protocole écrit ; privilégier l’usage unique quand c’est possible. La mentonnière et l’appui-front sont les surfaces les plus oubliées et les plus touchées.' },
    { t: '3 · Le risque adénovirus',
      p: 'La kérato-conjonctivite épidémique est extrêmement contagieuse, survit longtemps sur les surfaces et résiste à beaucoup d’antiseptiques usuels. Conduite : consultation en fin de programme si possible, désinfection renforcée du poste, matériel dédié, éviction, information du patient (durée de contagiosité, lavage des mains, linge personnel).' },
    { t: '4 · Accident d’exposition au sang',
      p: 'Lavage immédiat à l’eau et au savon (ne pas faire saigner), antisepsie au dérivé chloré ou à l’alcool 70° pendant au moins 5 minutes ; pour une projection oculaire, rinçage abondant au sérum physiologique. Puis avis médical <b>dans les 4 heures</b> pour évaluer l’indication d’un traitement post-exposition, et déclaration d’accident du travail dans les 24 à 48 heures.' }
  ],
  chiffres: [
    ['Friction hydro-alcoolique', '20 à 30 s'],
    ['Antisepsie après AES', '≥ 5 min'],
    ['Avis médical après AES', '< 4 h'],
    ['Déclaration d’accident du travail', '24 à 48 h'],
    ['Survie de l’adénovirus sur surface', 'plusieurs semaines']
  ],
  notions: [
    'Les gants ne remplacent jamais l’hygiène des mains.',
    'Mentonnière et appui-front font partie du matériel à désinfecter.'
  ],
  pieges: [
    'Oublier la désinfection entre deux patients sur les surfaces de contact.',
    'Retarder l’avis médical après une exposition.'
  ],
  tombe: [
    'Conduite devant une conjonctivite épidémique au cabinet',
    'Protocole de désinfection du matériel',
    'Étapes de la conduite à tenir après AES'
  ],
  methode: 'Retenez la chaîne « avant patient / avant geste / après geste / après patient » et les trois temps du traitement du matériel. UE courte, questions simples, points faciles.'
},

UE14: {
  resume: 'Les grands tableaux strabiques : les reconnaître, les différencier, repérer ce qui doit alerter.',
  objectifs: [
    'Reconnaître les formes cliniques des strabismes',
    'Différencier congénital, accommodatif, intermittent et paralytique',
    'Repérer les signes imposant un avis rapide'
  ],
  plan: [
    { t: '1 · Ésotropie congénitale (précoce)',
      p: 'Avant 6 mois, grand angle stable (souvent > 30 Δ), peu ou pas d’hypermétropie significative, fixation croisée, alternance fréquente. S’y associent volontiers une DVD, un nystagmus manifeste-latent et une hyperaction des obliques inférieurs. Le pronostic sensoriel est médiocre : l’objectif est un alignement précoce pour obtenir au mieux une union binoculaire, rarement une stéréoscopie fine.' },
    { t: '2 · Ésotropie accommodative',
      p: 'Apparition vers 2–4 ans, souvent progressive et d’abord intermittente, avec hypermétropie fréquemment > +3,00 D. La correction optique totale sous cycloplégie réduit ou annule l’angle. Forme à AC/A élevé : angle de près nettement supérieur à celui de loin, relevant d’un double foyer. Forme partiellement accommodative : une part d’angle résiduel persiste sous correction.' },
    { t: '3 · Exotropies',
      p: 'L’exotropie intermittente est la plus fréquente chez l’enfant : contrôle variable, aggravation à la fatigue, à la distance et au soleil (fermeture d’un œil), souvent bonne vision binoculaire pendant les phases de contrôle. On distingue les formes à excès de divergence (angle de loin > de près), à insuffisance de convergence (l’inverse) et basiques. La surveillance porte sur la fréquence et la durée des phases de décompensation.' },
    { t: '4 · Syndromes alphabétiques et verticaux',
      p: 'Syndrome A : la déviation en ésotropie augmente en haut ; syndrome V : elle augmente en bas — souvent liés aux obliques. DVD : élévation lente et dissociée d’un œil sous occlusion, sans hypotropie controlatérale (ne respecte pas la loi de Hering), à ne pas confondre avec une hyperaction de l’oblique inférieur, qui est comitante et conforme à Hering.' },
    { t: '5 · Syndromes restrictifs et paralytiques',
      p: 'Duane type I (limitation d’abduction, rétraction du globe et rétrécissement de la fente en adduction), syndrome de Brown (limitation de l’élévation en adduction), fibrose congénitale. Paralysies acquises : III, IV, VI, avec diplopie, incomitance et torticolis. Toute incomitance récente relève d’un avis médical.' },
    { t: '6 · Les signes d’alerte',
      p: 'Strabisme unilatéral fixe (amblyopie profonde, lésion organique), leucocorie (rétinoblastome, cataracte congénitale), apparition brutale avec diplopie, nystagmus acquis, torticolis récent, anomalie pupillaire. Devant tout strabisme unilatéral de l’enfant : <b>fond d’œil obligatoire</b>.' }
  ],
  chiffres: [
    ['Ésotropie congénitale : âge', '< 6 mois'],
    ['Ésotropie accommodative : âge', '2 à 4 ans'],
    ['Hypermétropie associée', 'souvent > +3,00 D'],
    ['Grand angle congénital', '> 30 Δ'],
    ['Période sensible', 'jusqu’à 6-8 ans'],
    ['Exotropie intermittente', 'la plus fréquente des exotropies']
  ],
  notions: [
    'Devant tout strabisme unilatéral : fond d’œil.',
    'La DVD ne respecte pas la loi de Hering.',
    'La correction totale sous cycloplégie fait le diagnostic d’ésotropie accommodative.'
  ],
  pieges: [
    'Attribuer une ésotropie à l’hypermétropie sans cycloplégie.',
    'Confondre DVD et hyperaction de l’oblique inférieur.',
    'Oublier le fond d’œil devant un strabisme unilatéral.'
  ],
  tombe: [
    'Diagnostic différentiel congénital / accommodatif',
    'Reconnaissance d’un syndrome alphabétique sur un tableau de mesures',
    'Signes d’alerte à citer'
  ],
  methode: 'Construisez un tableau à cinq colonnes — âge, angle, réfraction, vision binoculaire, signes associés : la plupart des questions se répondent en le lisant.'
},

UE15: {
  resume: 'Traiter : dans quel ordre, avec quels moyens, et jusqu’où la rééducation peut aller.',
  objectifs: [
    'Hiérarchiser les moyens thérapeutiques',
    'Construire un projet de soins évaluable',
    'Connaître indications, limites et échecs de la rééducation'
  ],
  plan: [
    { t: '1 · L’ordre thérapeutique',
      p: 'Toujours le même : <b>correction optique totale</b> portée en permanence plusieurs semaines, puis traitement de l’amblyopie, puis alignement (prismes, chirurgie), enfin travail sensoriel et rééducation. Inverser cet ordre, c’est perdre des mois. Beaucoup d’angles fondent sous la seule correction.' },
    { t: '2 · Ce que la rééducation sait faire',
      p: 'Résultats excellents dans l’<b>insuffisance de convergence</b> (80 à 90 % de succès), bons dans les troubles accommodatifs et les insuffisances de fusion. Elle n’aligne pas un strabisme congénital, ne recrée pas une vision binoculaire absente depuis l’enfance, et n’a pas d’intérêt sur une presbytie installée. Savoir ce qu’elle ne fait pas est aussi important que savoir ce qu’elle fait.' },
    { t: '3 · Les exercices et leur logique',
      p: 'Amplitude (stéréogrammes, prismes croissants, synoptophore) puis <b>souplesse</b> (flippers, sauts prismatiques) puis automatisation en situation. Anti-suppression quand une neutralisation gêne le travail (filtres rouge-vert, barre de lecture, cordon de Brock). Le travail à domicile quotidien conditionne le résultat : 10 à 15 minutes par jour valent mieux qu’une longue séance hebdomadaire.' },
    { t: '4 · Prismes',
      p: 'Compensation d’une diplopie en attendant la stabilisation, aide à la fusion dans une phorie décompensée, test avant chirurgie. Répartition possible sur les deux yeux ; prismes de Fresnel pour les fortes puissances ou les situations transitoires. Un prisme soulage un symptôme, il ne rééduque pas — sauf usage dynamique encadré.' },
    { t: '5 · Toxine et chirurgie',
      p: 'Toxine botulique : affaiblissement transitoire (3 à 4 mois), utile en test ou dans les paralysies récentes. Chirurgie : recul (affaiblit), résection ou plissement (renforce), transposition dans les paralysies ; environ 2 à 3 Δ corrigés par millimètre sur les droits horizontaux. On opère un angle stable, correction optique optimale, après information sur les suites (rougeur, diplopie transitoire, réintervention possible).' },
    { t: '6 · Projet de soins et fin de prise en charge',
      p: 'Objectifs mesurables, rythme, durée prévisionnelle, critères de réévaluation et d’arrêt. On termine par une phase d’<b>entretien</b> et un contrôle à distance : les récidives existent, surtout en période d’examens ou de surcharge de travail de près.' }
  ],
  chiffres: [
    ['Succès de la rééducation d’IC', '80 à 90 %'],
    ['Durée d’une rééducation', '10 à 15 séances'],
    ['Travail à domicile', '10 à 15 min/jour'],
    ['Port de la correction avant réévaluation', '4 à 6 semaines'],
    ['Effet de la toxine botulique', '3 à 4 mois'],
    ['Chirurgie : effet par mm', '≈ 2 à 3 Δ']
  ],
  notions: [
    'Correction optique totale d’abord, toujours.',
    'La rééducation excelle dans l’insuffisance de convergence, pas dans le strabisme congénital.',
    'Toute prise en charge se termine par un entretien et un contrôle à distance.'
  ],
  pieges: [
    'Rééduquer avant d’avoir corrigé optiquement.',
    'Prescrire de la convergence dans un excès de convergence.',
    'Ne pas fixer de critère d’arrêt.'
  ],
  tombe: [
    'Projet de soins à rédiger devant un cas',
    'Indications comparées rééducation / prismes / chirurgie',
    'Rythme et durée d’une rééducation'
  ],
  methode: 'Le module Rééducation reproduit exactement ces arbitrages : faites les quatre patients, y compris en vous trompant volontairement, pour voir ce que produit un mauvais protocole.'
},

UE17: {
  resume: 'Suivre une pathologie dans le temps : les mêmes examens, les mêmes conditions, et une conclusion utile au médecin.',
  objectifs: [
    'Corréler exploration fonctionnelle et pathologie',
    'Suivre une maladie chronique sur des examens répétés',
    'Rédiger un compte rendu exploitable'
  ],
  plan: [
    { t: '1 · Glaucome : structure et fonction',
      p: 'Couplage OCT (RNFL, cellules ganglionnaires maculaires) et champ visuel. L’atteinte structurelle précède souvent la fonctionnelle : un RNFL qui s’amincit sur des examens successifs impose de resserrer le suivi même si le champ est stable. On compare toujours à <b>même stratégie et même appareil</b>, courbes de progression à l’appui.' },
    { t: '2 · DMLA et macula',
      p: 'OCT maculaire pour les logettes, le fluide sous-rétinien, le décollement de l’épithélium pigmentaire : c’est lui qui décide de la reprise des injections d’anti-VEGF. La grille d’Amsler sert à l’autosurveillance à domicile, avec consigne écrite : toute déformation nouvelle = consultation rapide.' },
    { t: '3 · Diabète',
      p: 'Rétinophotographies grand champ pour le dépistage (lecture différée possible, télémédecine), OCT maculaire devant toute baisse d’acuité, angiographie si suspicion de néovaisseaux. Le rythme de suivi dépend du stade et de l’équilibre glycémique ; la grossesse et l’équilibration rapide de l’HbA1c aggravent transitoirement la rétinopathie.' },
    { t: '4 · Le compte rendu',
      p: 'Conditions de l’examen (appareil, stratégie, correction, fiabilité), résultats chiffrés, comparaison à l’examen précédent, et une conclusion en une ou deux phrases. Ce que le médecin lit d’abord : « stable » ou « aggravation », et sur quel critère.' }
  ],
  chiffres: [
    ['Suivi glaucome débutant', '2 à 4 examens/an'],
    ['Dépistage rétinopathie diabétique', 'annuel (ou 2 ans si conditions réunies)'],
    ['Perte physiologique du RNFL', '≈ 1 µm/an'],
    ['Autosurveillance Amsler', 'quotidienne, œil par œil']
  ],
  notions: [
    'Comparer deux examens exige les mêmes conditions.',
    'Dans le glaucome, la structure bouge souvent avant la fonction.'
  ],
  pieges: [
    'Comparer deux champs visuels de stratégies différentes.',
    'Conclure sur un OCT sans vérifier la segmentation et la qualité du signal.'
  ],
  tombe: [
    'Dossier de suivi à interpréter dans le temps',
    'Rédaction d’un compte rendu'
  ],
  methode: 'Travaillez sur des séries : le même patient à trois dates. C’est ce qu’on vous demandera en stage comme en examen clinique.'
},

UE18: {
  resume: 'Le patient n’est pas un œil : développement, vécu du handicap, adhésion au traitement.',
  objectifs: [
    'Adapter sa communication à l’âge et au contexte',
    'Comprendre le vécu du handicap visuel et de l’annonce',
    'Repérer ce qui relève d’un autre professionnel'
  ],
  plan: [
    { t: '1 · Développement visuel et psychomoteur',
      p: 'Maturation très rapide les premiers mois : poursuite dès quelques semaines, coordination œil-main vers 4–5 mois, acuité proche de l’adulte vers 3–5 ans. La période sensible de l’amblyopie (jusqu’à 6–8 ans) donne son urgence relative à toute prise en charge de l’enfant. Le développement visuel conditionne la motricité, l’exploration et les apprentissages.' },
    { t: '2 · L’annonce et le vécu',
      p: 'Une annonce de déficience visuelle produit une sidération : le patient n’entend souvent que les premiers mots. D’où la reformulation, le rythme lent, l’écrit remis, la proposition de revenir. Les étapes classiques (sidération, déni, colère, dépression, acceptation) ne sont pas linéaires et n’ont pas de calendrier.' },
    { t: '3 · Adhésion et observance',
      p: 'L’occlusion d’un enfant, les exercices quotidiens d’un adulte : ce sont des contraintes réelles. L’adhésion se construit en expliquant le bénéfice attendu, en vérifiant la faisabilité concrète (qui pose le cache ? à quel moment de la journée ?) et en assurant un suivi. Devant une non-observance, cherchez d’abord l’obstacle matériel, jamais la mauvaise volonté.' },
    { t: '4 · Enfant, adolescent, personne âgée',
      p: 'Avec l’enfant : parler à lui, pas seulement au parent, jeu et durée courte. Avec l’adolescent : négocier, expliquer l’intérêt, respecter l’image de soi (rejet de l’occlusion ou des lunettes). Avec la personne âgée : rythme, fatigue, audition, troubles cognitifs éventuels, présence de l’aidant.' },
    { t: '5 · Savoir passer la main',
      p: 'Troubles des apprentissages, souffrance psychique, suspicion de maltraitance, troubles du comportement : l’orthoptiste repère et oriente. Connaître ses limites fait partie de la compétence.' }
  ],
  chiffres: [
    ['Poursuite oculaire', 'dès quelques semaines'],
    ['Coordination œil-main', '4 à 5 mois'],
    ['Acuité proche de l’adulte', '3 à 5 ans'],
    ['Période sensible de l’amblyopie', 'jusqu’à 6-8 ans']
  ],
  notions: [
    'Après une annonce, le patient retient peu : reformuler et écrire.',
    'La non-observance a presque toujours une cause concrète.'
  ],
  pieges: [
    'Parler au parent en ignorant l’enfant.',
    'Confondre non-observance et mauvaise volonté.'
  ],
  tombe: [
    'Analyse d’une situation de communication difficile',
    'Périodes sensibles du développement visuel'
  ],
  methode: 'Retenez trois situations types — annonce, enfant non coopérant, non-observance — et ce que vous feriez concrètement dans chacune.'
},

UE19: {
  resume: 'Les collyres que vous verrez et instillerez : effets, durées, contre-indications, information au patient.',
  objectifs: [
    'Connaître les collyres utilisés au cabinet',
    'Anticiper contre-indications et effets indésirables',
    'Informer correctement après instillation'
  ],
  plan: [
    { t: '1 · Cycloplégiques',
      p: 'Ils bloquent le muscle ciliaire (et le sphincter irien) : ils suppriment l’accommodation et dilatent. <b>Tropicamide 0,5–1 %</b> : action en 20–30 min, cycloplégie incomplète, retour en 4–6 h — dépistage et fond d’œil. <b>Cyclopentolate 1 %</b> : référence de la réfraction de l’enfant, 2 gouttes à 5 min d’intervalle, examen à 30–45 min, effet 24 h. <b>Atropine 0,3–1 %</b> : la plus puissante, plusieurs jours d’effet, réservée au strabisme accommodatif, au petit enfant et à la pénalisation.' },
    { t: '2 · Mydriatiques non cycloplégiques',
      p: 'Phényléphrine (sympathomimétique) : dilate sans paralyser l’accommodation, souvent associée au tropicamide. Prudence en cas d’angle étroit (risque de fermeture aiguë), d’hypertension artérielle, chez le nourrisson et le sujet âgé. Chez l’enfant, l’occlusion des points lacrymaux après instillation limite le passage systémique.' },
    { t: '3 · Anesthésiques de contact',
      p: 'Oxybuprocaïne, tétracaïne : effet en quelques secondes, durée 15–20 min. Usage strictement professionnel — jamais délivrés au patient : ils masquent la douleur (retard diagnostique) et sont toxiques pour l’épithélium cornéen en usage répété.' },
    { t: '4 · Traitements du glaucome',
      p: 'Analogues des prostaglandines (première intention : hyperhémie, allongement et pigmentation des cils, creusement palpébral), bêtabloquants (contre-indiqués en asthme, BPCO, bradycardie et bloc), inhibiteurs de l’anhydrase carbonique, alpha-2 agonistes. Beaucoup d’effets généraux passent par la voie lacrymo-nasale : l’occlusion des points en réduit l’absorption.' },
    { t: '5 · Autres et information au patient',
      p: 'Colorants (fluorescéine pour le BUT et les lésions épithéliales), lubrifiants, anti-inflammatoires, toxine botulique en injection. Après cycloplégie ou mydriase : photophobie, flou de près pendant plusieurs heures (plusieurs jours pour l’atropine), <b>pas de conduite automobile</b>, lunettes de soleil. L’information doit être donnée avant l’instillation, pas après.' }
  ],
  chiffres: [
    ['Tropicamide : délai / durée', '20-30 min / 4-6 h'],
    ['Cyclopentolate : délai / durée', '30-45 min / 24 h'],
    ['Atropine : durée', '7 à 10 jours'],
    ['Anesthésique de contact : durée', '15 à 20 min'],
    ['Occlusion des points lacrymaux', '1 à 2 min'],
    ['Volume d’une goutte / cul-de-sac', '≈ 30 µL / 10 µL']
  ],
  notions: [
    'Jamais d’anesthésique de contact délivré au patient.',
    'Bêtabloquants : contre-indication respiratoire et cardiaque.',
    'Pas de conduite après cycloplégie.'
  ],
  pieges: [
    'Instiller un mydriatique sans avoir vérifié la profondeur de chambre antérieure.',
    'Oublier l’occlusion des points lacrymaux chez l’enfant.'
  ],
  tombe: [
    'Choix du cycloplégique selon l’âge et l’indication',
    'Effets indésirables des collyres du glaucome'
  ],
  methode: 'Une fiche par famille : molécule, indication, délai, durée, contre-indication, information au patient. Quatre fiches suffisent pour l’UE entière.'
}

};
