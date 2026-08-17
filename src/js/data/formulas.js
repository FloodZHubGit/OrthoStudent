/* ============================================================
   Formules cliniques — énoncé, raison d'être, repère
   ------------------------------------------------------------
   Un même calcul est expliqué au même endroit, qu'on le
   rencontre dans une calculatrice, dans la recherche rapide
   ou dans la fiche d'une UE.
     t : nom de la formule
     f : l'énoncé
     w : pourquoi elle s'écrit comme ça (le raisonnement)
     r : le repère à retenir, ou le piège
   ============================================================ */
window.FORMULAS = {

  logmar: {
    t: 'Acuité décimale → logMAR',
    f: 'logMAR = −log₁₀(acuité décimale)',
    w: 'L’acuité décimale est l’inverse de l’angle minimum de résolution exprimé en minutes d’arc (MAR). ' +
       'On prend le logarithme pour que l’échelle devienne <b>régulière</b> : chaque ligne vaut alors le même écart (0,1 logMAR), ' +
       'ce qui permet de faire des moyennes, de comparer deux mesures et de suivre une évolution — impossible avec les dixièmes, ' +
       'où l’écart entre 1/10 et 2/10 n’a rien à voir avec celui entre 9/10 et 10/10.',
    r: '10/10 → 0 · 5/10 → 0,3 · 1/10 → 1,0. Le signe moins vient de l’inversion : plus on voit, plus le logMAR est petit.'
  },

  mar: {
    t: 'Angle minimum de résolution',
    f: 'MAR (minutes d’arc) = 1 / acuité décimale',
    w: 'C’est la définition même de l’acuité : voir 10/10, c’est séparer deux points vus sous 1 minute d’arc. ' +
       'L’optotype entier sous-tend 5 minutes d’arc, soit cinq fois le détail à résoudre — c’est la construction du « E » de 5 × 5.',
    r: 'Une acuité de 2/10 correspond à un MAR de 5′ : il faut un détail cinq fois plus gros.'
  },

  optotype: {
    t: 'Taille physique d’un optotype',
    f: 'hauteur = 2 × distance × tan(angle / 2), avec angle = 5′ / acuité décimale',
    w: 'On part de la taille <b>angulaire</b> (5 minutes d’arc pour 10/10) et on la convertit en taille réelle à la distance d’examen. ' +
       'C’est pourquoi une échelle n’est valable qu’à sa distance : la même lettre vue à 3 m au lieu de 5 m ne mesure plus la même acuité.',
    r: 'Un optotype 10/10 mesure ≈ 7,3 mm de haut à 5 m, et son détail (largeur de trait) ≈ 1,5 mm.'
  },

  prisme: {
    t: 'Dioptrie prismatique → degrés',
    f: 'θ = arctan(Δ / 100)',
    w: 'La dioptrie prismatique est définie par un <b>déplacement</b>, pas par un angle : 1 Δ dévie le rayon de 1 cm à 1 mètre. ' +
       'Passer en degrés revient donc à lire la tangente de l’angle du triangle rectangle formé par ces 1 cm sur 100 cm.',
    r: '1 Δ ≈ 0,57°. La relation n’est linéaire que pour les petits angles : à 45°, on est à 100 Δ, pas à 79.'
  },

  prentice: {
    t: 'Loi de Prentice',
    f: 'Δ = puissance du verre (D) × décentrement (cm)',
    w: 'Un verre sphérique n’est un simple verre qu’en son centre optique : partout ailleurs, ses deux faces ne sont plus parallèles ' +
       'et il se comporte comme un <b>prisme</b>. Plus le verre est puissant et plus on regarde loin du centre, plus l’effet prismatique est fort. ' +
       'C’est ce qui explique la gêne en lecture d’un anisométrope, et ce qui permet de prismer volontairement en décentrant.',
    r: 'Le décentrement se compte en <b>centimètres</b> : 3 mm = 0,3 cm. C’est l’erreur qui donne un facteur 10.'
  },

  hirschberg: {
    t: 'Test de Hirschberg',
    f: '1 mm de décentrement du reflet ≈ 7° ≈ 15 Δ',
    w: 'Le reflet cornéen se déplace quand l’œil tourne. Le rapport vient de la géométrie de la cornée : environ 7° de rotation ' +
       'oculaire décalent le reflet de 1 mm. C’est une <b>estimation</b>, utilisée quand la coopération ne permet pas la mesure aux prismes ' +
       '(nourrisson, handicap, acuité effondrée).',
    r: 'Reflet au bord pupillaire ≈ 15° ≈ 30 Δ · au milieu de l’iris ≈ 30° ≈ 60 Δ · au limbe ≈ 45° ≈ 90 Δ.'
  },

  krimsky: {
    t: 'Test de Krimsky',
    f: 'angle (Δ) = puissance du prisme qui recentre le reflet',
    w: 'Plutôt que d’estimer le décalage du reflet, on interpose devant l’œil fixateur des prismes croissants jusqu’à ce que ' +
       'le reflet de l’œil dévié revienne au centre de sa pupille. On <b>mesure</b> alors au lieu d’estimer : c’est plus fiable que le Hirschberg seul.',
    r: 'Utile chez le patient qui ne fixe pas des deux yeux — donc quand le cover test est impossible.'
  },

  transposition: {
    t: 'Transposition cylindrique',
    f: 'nouvelle sphère = sphère + cylindre · nouveau cylindre = −cylindre · nouvel axe = axe ± 90°',
    w: 'Un astigmatisme a deux méridiens principaux perpendiculaires. Écrire la formule en cylindre négatif ou positif, ' +
       'c’est décrire <b>la même surface</b> en partant de l’un ou de l’autre méridien. On additionne donc la puissance du méridien ' +
       'de départ, on inverse le signe du cylindre, et on tourne l’axe de 90° pour désigner l’autre méridien.',
    r: 'La transposée décrit exactement le même verre : l’équivalent sphérique ne change pas.'
  },

  equivalent: {
    t: 'Équivalent sphérique',
    f: 'ES = sphère + cylindre / 2',
    w: 'C’est la puissance du <b>cercle de moindre diffusion</b>, à mi-chemin entre les deux focales de l’astigmatisme. ' +
       'C’est la meilleure approximation sphérique d’une correction astigmate — celle qu’on utilise pour comparer deux réfractions ' +
       'ou pour dépanner avec une seule valeur.',
    r: 'Diviser par 2 et non par 1 : l’intervalle de Sturm est traversé en son milieu.'
  },

  vergence: {
    t: 'Vergence et distance',
    f: 'V (dioptries) = 1 / distance (mètres)',
    w: 'La dioptrie mesure la courbure des fronts d’onde. Plus l’objet est proche, plus les rayons divergent, plus il faut de puissance ' +
       'pour les refocaliser : la demande accommodative est donc l’inverse de la distance. C’est le calcul le plus utilisé de toute la formation.',
    r: '1 m → 1 D · 50 cm → 2 D · 33 cm → 3 D · 25 cm → 4 D.'
  },

  hofstetter: {
    t: 'Amplitude d’accommodation (Hofstetter)',
    f: 'maximale = 25 − 0,4 × âge · moyenne = 18,5 − 0,3 × âge · minimale = 15 − 0,25 × âge',
    w: 'Formules empiriques, tirées de mesures de population : l’amplitude d’accommodation décroît linéairement avec l’âge ' +
       'parce que le cristallin durcit progressivement. Elles donnent une <b>norme attendue</b> à confronter à la mesure du patient : ' +
       'une amplitude nettement sous la valeur minimale signe une insuffisance accommodative.',
    r: 'À 40 ans : minimale 5 D. À 50 ans : 2,5 D. Vers 55-60 ans, l’amplitude résiduelle est quasi nulle.'
  },

  addition: {
    t: 'Addition de près',
    f: 'addition = demande à la distance de travail − amplitude d’accommodation / 2',
    w: 'On ne demande jamais au patient d’utiliser <b>toute</b> son amplitude : un effort maximal soutenu est inconfortable et intenable. ' +
       'La règle consiste à ne lui en faire dépenser que la moitié et à compenser le reste par le verre — d’où la division par 2.',
    r: 'Toujours vérifier l’addition à la distance de travail <b>réelle</b> du patient, pas à 40 cm par principe.'
  },

  aca_gradient: {
    t: 'AC/A par gradient',
    f: 'AC/A = (phorie avec verre − phorie sans verre) / puissance du verre',
    w: 'On force une variation d’accommodation connue en interposant un verre (souvent −1,00 D), à distance constante, ' +
       'et on mesure la variation de phorie qui en résulte. Le rapport donne le nombre de dioptries prismatiques de convergence ' +
       'déclenchées par dioptrie d’accommodation.',
    r: 'Normal 3 à 5 Δ/D. Élevé → ésotropie plus grande de près. Bas → insuffisance de convergence.'
  },

  aca_hetero: {
    t: 'AC/A par hétérophorie',
    f: 'AC/A = DIP (cm) + distance de travail (m) × (phorie de près − phorie de loin)',
    w: 'Ici on ne change pas de verre : on compare les phories de loin et de près. La distance interpupillaire intervient parce que ' +
       'la convergence nécessaire pour fixer de près dépend directement de l’écart entre les deux yeux. ' +
       'Méthode plus physiologique que le gradient, mais qui suppose des phories mesurées avec rigueur.',
    r: 'Les phories en exo se comptent négativement, en éso positivement : une erreur de signe fausse tout.'
  },

  convergence: {
    t: 'Demande de convergence',
    f: 'Δ = DIP (cm) × 100 / distance (cm)',
    w: 'Chaque œil doit tourner vers l’intérieur d’un angle qui dépend de la moitié de l’écart interpupillaire et de la distance. ' +
       'En dioptries prismatiques, la demande totale des deux yeux se ramène à cette expression simple. ' +
       'On la compare aux réserves fusionnelles pour savoir si le patient tient l’effort.',
    r: 'DIP 62 mm à 40 cm → 15,5 Δ. C’est la valeur à confronter à la convergence fusionnelle disponible.'
  },

  sheard: {
    t: 'Critère de Sheard',
    f: 'réserve opposée ≥ 2 × phorie · prisme = (2 × phorie − réserve) / 3',
    w: 'Sheard a observé qu’un patient reste confortable tant que sa réserve fusionnelle vaut au moins le double de sa phorie : ' +
       'il ne doit consommer qu’un tiers de sa capacité. Quand ce n’est pas le cas, le prisme à prescrire comble l’écart, ' +
       'réparti sur la marge disponible — d’où la division par 3.',
    r: 'Critère surtout valable pour les exophories. Pour les ésophories, on lui préfère le critère de Percival.'
  },

  vertex: {
    t: 'Distance de sommet',
    f: 'P′ = P / (1 − d × P), d en mètres',
    w: 'Un verre agit à 12 mm de la cornée, une lentille de contact à 0 mm : la <b>vergence arrivant sur l’œil</b> n’est donc pas la même. ' +
       'Rapprocher un verre convergent le rend moins efficace, un verre divergent plus efficace. La formule corrige exactement cet écart.',
    r: 'Négligeable sous ±4 D, indispensable au-delà : un −10,00 verre vaut ≈ −8,90 en lentille.'
  },

  kestenbaum: {
    t: 'Règle de Kestenbaum',
    f: 'addition nécessaire (D) ≈ 1 / acuité décimale',
    w: 'Pour lire un texte standard, il faut grossir dans le rapport de l’acuité manquante. La règle donne directement ' +
       'l’addition de départ d’un patient malvoyant : elle raccourcit la distance de lecture d’autant, ce qui grossit l’image rétinienne. ' +
       'C’est un <b>point de départ</b> à ajuster à l’essai, jamais une prescription automatique.',
    r: '1/10 → +10 D, soit une lecture à 10 cm. Plus on grossit, plus le champ de lecture rétrécit.'
  },

  stereo: {
    t: 'Disparité stéréoscopique',
    f: 'η = DIP × (1/d₁ − 1/d₂), converti en secondes d’arc',
    w: 'Deux objets à des distances différentes ne se projettent pas au même endroit sur les deux rétines : cette différence de projection ' +
       'est la <b>disparité</b>, et c’est elle que le cerveau interprète comme du relief. Elle dépend de l’écart entre les yeux ' +
       'et de la différence des inverses des distances — donc elle s’effondre avec l’éloignement.',
    r: 'Stéréo-acuité normale ≤ 60″. Au-delà de quelques dizaines de mètres, la stéréoscopie ne sert plus à rien.'
  },

  skiascopie: {
    t: 'Skiascopie : verre trouvé → réfraction',
    f: 'puissance de l’œil = verre neutralisant − verre de distance de travail',
    w: 'À la neutralisation, l’œil et son verre ont leur punctum remotum <b>sur le rétinoscope</b>, pas à l’infini. ' +
       'Il faut donc retirer la vergence correspondant à cette distance de travail pour obtenir la correction de loin.',
    r: '+1,50 à 67 cm, +2,00 à 50 cm, +1,00 à 1 m. L’oublier fausse toute la réfraction de +1,50.'
  }
};
