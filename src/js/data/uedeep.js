/* ============================================================
   Fiches d'UE — la couche « examen »
   ------------------------------------------------------------
   Les fiches d'ueguide disent ce qu'il faut savoir. Ce fichier
   ajoute ce qui manque pour s'en servir le jour de l'épreuve :

     tableaux : les comparaisons à savoir refaire de tête. C'est
                la forme sous laquelle les questions tombent le
                plus souvent, et celle qui se récite le mieux.
     cas      : un cas d'application, avec l'énoncé, les questions
                posées et le raisonnement attendu — pas seulement
                la réponse.
     reponse  : le plan type de la question classique de l'UE.
                Savoir quoi dire ne suffit pas : il faut savoir
                dans quel ordre.
     mnemo    : les moyens mnémotechniques qui tiennent vraiment.

   Semestres 1 et 2 ici, 3 à 6 dans uedeep2.js.
   ============================================================ */
window.UE_DEEP = {

/* ============================ SEMESTRE 1 ============================ */

UE1: {
  tableaux: [
    { t: 'Les quatre modes de transmission',
      c: ['Mode', 'Qui est atteint', 'Risque', 'Indice qui fait mouche'],
      r: [
        ['Autosomique dominante', 'Les deux sexes, à chaque génération', '50 %', 'Transmission verticale, père → fils possible'],
        ['Autosomique récessive', 'Fratrie, parents sains', '25 %', 'Consanguinité, saut de génération'],
        ['Liée à l’X', 'Garçons ; filles conductrices', '50 % des garçons', 'Jamais de transmission père → fils'],
        ['Mitochondriale', 'Tous les enfants d’une femme atteinte', 'Variable', 'Jamais transmise par le père']
      ] },
    { t: 'Cornée et cristallin : deux transparences, deux mécanismes',
      c: ['', 'Cornée', 'Cristallin'],
      r: [
        ['Ce qui la fait', 'Lamelles de collagène régulières, avasculaire', 'Fibres anucléées riches en cristallines'],
        ['Ce qui la maintient', 'Pompes endothéliales, déshydratation', 'Absence d’organites et de vaisseaux'],
        ['Ce qui la perd', 'Œdème par défaut de pompe', 'Agrégation des protéines : cataracte'],
        ['Régénération', 'Épithélium oui, endothélium non', 'Apposition continue de fibres']
      ] }
  ],
  cas: {
    t: 'Un père inquiet pour son fils',
    s: 'Un homme de 34 ans, daltonien, consulte pour son fils de 5 ans. Il veut savoir si son garçon sera daltonien comme lui, et si sa fille de 8 ans risque quelque chose.',
    q: ['Quel est le mode de transmission du daltonisme ?',
        'Quel est le risque pour le fils ? pour la fille ?',
        'Quel test proposez-vous, et à partir de quel âge ?'],
    r: 'Le daltonisme est lié à l’X récessif. Un homme atteint transmet son X à toutes ses filles et son Y à tous ses fils : <b>aucun de ses fils</b> ne peut être atteint par lui, et <b>toutes ses filles</b> seront conductrices. Le fils ne peut être daltonien que si la mère est conductrice ou atteinte. La fille sera conductrice obligatoire, et ne sera atteinte que si sa mère l’était aussi.',
    c: 'On rassure sur le fils, on explique le statut de conductrice de la fille, et on propose un Ishihara dès que l’enfant nomme ou apparie de façon fiable, vers 5-6 ans, avec des planches adaptées.'
  },
  reponse: {
    q: 'Décrivez les couches de la rétine et expliquez la particularité de la fovéola.',
    p: [
      'Annoncer le sens de lecture : de la choroïde vers le vitré, dix couches.',
      'Les énumérer sans hésiter : épithélium pigmentaire, photorécepteurs, limitante externe, nucléaire externe, plexiforme externe, nucléaire interne, plexiforme interne, cellules ganglionnaires, fibres optiques, limitante interne.',
      'Placer les trois neurones : photorécepteur, bipolaire, ganglionnaire — et les modulateurs, horizontales et amacrines.',
      'Souligner le paradoxe : la lumière traverse toute la rétine avant d’atteindre les photorécepteurs.',
      'Conclure sur la fovéola : couches internes écartées, uniquement des cônes, aucun vaisseau — d’où l’acuité maximale et la vulnérabilité.',
      'Terminer par la conséquence clinique : scotome central physiologique en vision scotopique, puisqu’il n’y a aucun bâtonnet.'
    ]
  },
  mnemo: [
    ['« Le père donne son X à ses filles »', 'Résume à lui seul toute la transmission liée à l’X'],
    ['Fovéola = « que des cônes »', 'Jamais « surtout des cônes » : c’est la faute qui coûte le point']
  ]
},

UE2: {
  tableaux: [
    { t: 'Les unités à ne pas confondre',
      c: ['Unité', 'Définition', 'Repère'],
      r: [
        ['Dioptrie (D)', 'Inverse de la focale en mètres', '+2 D → foyer à 50 cm'],
        ['Dioptrie prismatique (Δ)', 'Déviation de 1 cm à 1 m', '1 Δ ≈ 0,57° ; 2 Δ ≈ 1°'],
        ['Angle métrique (AM)', 'Inverse de la distance en mètres', 'À 33 cm : 3 AM'],
        ['Minute d’arc', 'Angle du détail résolu', '10/10 = détail de 1′']
      ] },
    { t: 'Les trois formules qui reviennent toujours',
      c: ['Situation', 'Formule', 'Piège'],
      r: [
        ['Verre décentré', 'Δ = P × décentrement (cm)', 'Le décentrement est en cm, pas en mm'],
        ['Changement de distance verre-œil', 'P’ = P / (1 − d × P)', 'd en mètres, signé'],
        ['Astigmatisme à comparer', 'ES = sphère + cyl / 2', 'Ne remplace jamais la correction réelle']
      ] }
  ],
  cas: {
    t: 'Un verre mal centré',
    s: 'Une patiente porte −6,00 D aux deux yeux. Ses lunettes neuves lui donnent une gêne et une impression de « tirage ». Vous mesurez un décentrement de 4 mm en dedans sur l’œil droit.',
    q: ['Quel effet prismatique subit-elle ?', 'Dans quel sens ?', 'Que proposez-vous ?'],
    r: 'Loi de Prentice : Δ = P × décentrement en centimètres = 6 × 0,4 = <b>2,4 Δ</b>. Un verre concave décentré en dedans se comporte comme un prisme base externe pour cet œil, imposant un effort de convergence supplémentaire non compensé de l’autre côté.',
    c: 'Recentrage des verres sur l’écart pupillaire réel. On vérifie ensuite l’équilibre oculomoteur : une phorie jusque-là compensée peut s’être décompensée sous cet effet prismatique permanent.'
  },
  reponse: {
    q: 'Expliquez la conoïde de Sturm et ce qu’est l’équivalent sphérique.',
    p: [
      'Poser le cadre : un système astigmate régulier n’a pas un foyer mais deux focales perpendiculaires.',
      'Décrire la succession des sections entre les deux : ellipse, puis cercle, puis ellipse perpendiculaire.',
      'Nommer le cercle de moindre diffusion et le situer au milieu dioptrique — pas au milieu géométrique.',
      'En déduire l’équivalent sphérique : ES = sphère + cylindre / 2, qui place ce cercle sur la rétine.',
      'Préciser l’usage : comparer deux réfractions, dépanner — jamais corriger durablement à sa place.',
      'Illustrer par un exemple chiffré simple, par exemple −2,00 (−1,00) 180° → ES = −2,50.'
    ]
  },
  mnemo: [
    ['« Prentice : Puissance × Position »', 'Δ = P × décentrement, et le décentrement est en centimètres'],
    ['Base et arête', 'Le rayon va vers la base, l’image va vers l’arête']
  ]
},

UE3: {
  tableaux: [
    { t: 'Les trois cycloplégiques',
      c: ['Produit', 'Concentration', 'Protocole', 'Quand'],
      r: [
        ['Tropicamide', '0,5 %', 'Effet 20-30 min, retour 4-6 h', 'Fond d’œil — insuffisant pour réfracter'],
        ['Cyclopentolate', '0,5 % < 1 an, 1 % ensuite', '3 gouttes / 5 min, réfraction à 45 min', 'Réfraction de l’enfant, référence'],
        ['Atropine', '0,3 % < 1 an, 0,5 % ensuite', '2 gouttes/j, 3 à 5 jours', 'Hypermétropie forte, ésotropie accommodative']
      ] },
    { t: 'Lire une skiascopie',
      c: ['Ce que vous voyez', 'Ce que cela veut dire', 'Ce que vous faites'],
      r: [
        ['Ombre directe', 'Moins convergent que le point neutre', 'Ajouter du plus'],
        ['Ombre inverse', 'Plus convergent que le point neutre', 'Ajouter du moins'],
        ['Point neutre', 'Conjugué de la distance de travail', 'Retrancher le verre de travail'],
        ['Réflexe en ciseaux', 'Astigmatisme irrégulier', 'Penser kératocône, topographie']
      ] }
  ],
  cas: {
    t: 'Un enfant qui « voit très bien »',
    s: 'Garçon de 6 ans adressé pour céphalées de fin de journée et difficultés de copie au tableau. Acuité 10/10 de loin aux deux yeux sans correction. Cover test : orthophorie de loin, ésophorie de 8 Δ de près. Skiascopie sans cycloplégie : +0,50 D.',
    q: ['Pourquoi l’acuité normale n’élimine-t-elle rien ?',
        'Quel examen manque-t-il ?',
        'Qu’attendez-vous du résultat ?'],
    r: 'Un enfant compense une hypermétropie par l’accommodation : l’acuité reste à 10/10 au prix d’un effort permanent, qui explique les céphalées. Cette accommodation entraîne de la convergence accommodative, d’où l’ésophorie de près. La skiascopie sans cycloplégie ne mesure que la part manifeste : elle sous-estime l’hypermétropie.',
    c: 'Réfraction sous cyclopentolate. On s’attend à démasquer une hypermétropie nettement supérieure à +0,50 D. La correction optique totale traite à la fois les céphalées et l’ésophorie de près, et prévient une ésotropie accommodative.'
  },
  reponse: {
    q: 'Comment conduisez-vous une réfraction subjective ?',
    p: [
      'Partir de la réfraction objective : skiascopie ou autoréfractomètre, avec réserve chez l’enfant.',
      'Brouiller pour relâcher l’accommodation, puis réduire le plus progressivement.',
      'Rechercher l’axe du cylindre au cylindre croisé de Jackson, puis sa puissance, en recontrôlant la sphère après.',
      'Appliquer la règle du plus fort plus qui donne la meilleure acuité.',
      'Contrôler au duochrome, œil par œil, en éclairage réduit — vert plus net : ajouter du plus.',
      'Équilibrer les deux yeux (équilibre bioculaire), puis vérifier en binoculaire.',
      'Terminer par la vision de près et l’addition si l’âge le justifie, sur la distance de travail réelle.'
    ]
  },
  mnemo: [
    ['GAP — Green Add Plus', 'Vert plus net au duochrome → ajouter du plus'],
    ['« Le plus fort plus »', 'Toujours retenir la correction la plus positive donnant la meilleure acuité'],
    ['Verre de travail = 1 / distance', '+1,50 D à 67 cm, +2,00 D à 50 cm']
  ]
},

UE4: {
  tableaux: [
    { t: 'Photopique, mésopique, scotopique',
      c: ['Régime', 'Récepteurs', 'Maximum', 'Ce qui change'],
      r: [
        ['Photopique', 'Cônes', '555 nm', 'Acuité maximale, couleurs'],
        ['Mésopique', 'Les deux', 'Intermédiaire', 'Contraste dégradé, éblouissement'],
        ['Scotopique', 'Bâtonnets', '507 nm', 'Pas de couleur, scotome central']
      ] },
    { t: 'Les grandes voies et ce qu’elles portent',
      c: ['Voie', 'Cellules', 'Ce qu’elle traite'],
      r: [
        ['Magnocellulaire', 'Ganglionnaires M', 'Mouvement, contrastes grossiers, basse résolution'],
        ['Parvocellulaire', 'Ganglionnaires P', 'Détail fin, opposition rouge-vert'],
        ['Koniocellulaire', 'Ganglionnaires K', 'Opposition bleu-jaune']
      ] }
  ],
  cas: {
    t: 'Ne plus conduire la nuit',
    s: 'Un homme de 62 ans se plaint de ne plus supporter la conduite nocturne : éblouissement par les phares, récupération lente, impression de « trou noir ». Son acuité de loin est à 10/10 en photopique.',
    q: ['Pourquoi l’acuité mesurée ne reflète-t-elle pas sa gêne ?',
        'Quels examens complètent le bilan ?',
        'Quelles hypothèses ?'],
    r: 'L’acuité se mesure en photopique, à fort contraste : elle explore le meilleur des conditions. La conduite nocturne est un régime mésopique à faible contraste avec sources éblouissantes, où interviennent la sensibilité aux contrastes, la diffusion des milieux et la vitesse de récupération après éblouissement.',
    c: 'Sensibilité aux contrastes, test d’éblouissement, examen du cristallin. Une cataracte débutante donne exactement ce tableau avec une acuité conservée. Penser aussi à la sécheresse oculaire et à une correction sous-évaluée en mésopique, la pupille se dilatant.'
  },
  reponse: {
    q: 'Décrivez le trajet des voies optiques et les déficits correspondants.',
    p: [
      'Suivre le trajet dans l’ordre : rétine, nerf optique, chiasma, bandelette, corps genouillé latéral, radiations, cortex occipital.',
      'Poser la règle du chiasma : les fibres nasales croisent, elles portent le champ temporal.',
      'Associer chaque étage à sa signature : nerf optique → cécité monoculaire ; chiasma → hémianopsie bitemporale ; rétro-chiasmatique → hémianopsie homonyme controlatérale.',
      'Détailler les radiations : boucle de Meyer temporale → quadranopsie supérieure ; pariétal → quadranopsie inférieure.',
      'Énoncer la règle de congruence : plus la lésion est postérieure, plus le déficit est congruent.',
      'Conclure par l’épargne maculaire, en faveur d’une atteinte occipitale.'
    ]
  },
  mnemo: [
    ['« Pie in the sky »', 'Quadranopsie supérieure = boucle de Meyer, lobe temporal'],
    ['Nasal croise, temporal reste', 'La règle du chiasma en trois mots'],
    ['Köllner', 'Rétine → bleu-jaune ; nerf optique → rouge-vert']
  ]
},

UE5: {
  tableaux: [
    { t: 'Les échelles et ce qu’elles mesurent',
      c: ['Échelle', 'Notation', 'Ce qu’elle vaut'],
      r: [
        ['Monoyer', '10e, à 5 m', 'Usage courant, progression arithmétique irrégulière'],
        ['logMAR / ETDRS', '0,0 = 10/10', 'Référence en recherche, 5 optotypes par ligne'],
        ['Snellen', '20/20, 6/6', 'Fraction distance / distance de reconnaissance'],
        ['Parinaud', 'P2 ≈ 10/10 de près', 'Performance de lecture, pas résolution pure'],
        ['Landolt', 'Anneau, 8 orientations', 'Normalisée, indépendante de la lecture']
      ] },
    { t: 'Conversions à connaître de tête',
      c: ['Décimal', 'logMAR', 'Snellen'],
      r: [['10/10', '0,0', '20/20'], ['5/10', '0,3', '20/40'], ['2/10', '0,7', '20/100'], ['1/10', '1,0', '20/200']] }
  ],
  cas: {
    t: 'Deux acuités qui ne concordent pas',
    s: 'Enfant de 7 ans. En optotypes isolés, l’œil gauche est à 7/10. En ligne, le même œil chute à 3/10. L’œil droit est à 10/10 dans les deux conditions.',
    q: ['Comment s’appelle ce phénomène ?', 'Quelle acuité retenez-vous ?', 'Que cherchez-vous ensuite ?'],
    r: 'C’est l’effet de crowding, ou entassement : la performance chute quand les optotypes sont entourés. Il est physiologique mais très majoré dans l’amblyopie, où il constitue un signe à part entière.',
    c: 'On retient l’acuité <b>en ligne</b>, 3/10, la seule comparable et la seule représentative. On complète par la réfraction sous cycloplégie, le cover test, le visuscope à la recherche d’une fixation excentrique, et un fond d’œil pour éliminer une cause organique.'
  },
  reponse: {
    q: 'Comment mesure-t-on l’acuité visuelle et quelles précautions prendre ?',
    p: [
      'Définir : plus petit angle sous lequel deux points sont vus distincts ; 10/10 correspond à un détail de 1 minute d’arc.',
      'Préciser les conditions : distance normalisée, luminance de l’échelle, correction portée, œil par œil puis binoculaire.',
      'Choisir l’optotype selon l’âge et la lecture : images, E de Snellen, Landolt, lettres.',
      'Mesurer en ligne, pas en isolé, surtout devant une suspicion d’amblyopie.',
      'Noter systématiquement : échelle, distance, œil, avec ou sans correction, isolé ou en ligne.',
      'Compléter par le trou sténopéique si l’acuité est basse, pour trancher entre cause optique et autre.',
      'Terminer par la vision de près et, si la plainte dépasse l’acuité, la sensibilité aux contrastes.'
    ]
  },
  mnemo: [
    ['logMAR = 0 pour 10/10', 'Et chaque ligne vaut 0,1 — 5/10 → 0,3'],
    ['Crowding : « seul il triche »', 'Un amblyope réussit en isolé ce qu’il rate en ligne']
  ]
},

UE7: {
  tableaux: [
    { t: 'Les six muscles : actions et innervation',
      c: ['Muscle', 'Principale', 'Secondaire', 'Tertiaire', 'Nerf'],
      r: [
        ['Droit latéral', 'Abduction', '—', '—', 'VI'],
        ['Droit médial', 'Adduction', '—', '—', 'III inf.'],
        ['Droit supérieur', 'Élévation', 'Intorsion', 'Adduction', 'III sup.'],
        ['Droit inférieur', 'Abaissement', 'Extorsion', 'Adduction', 'III inf.'],
        ['Oblique supérieur', 'Intorsion', 'Abaissement', 'Abduction', 'IV'],
        ['Oblique inférieur', 'Extorsion', 'Élévation', 'Abduction', 'III inf.']
      ] },
    { t: 'Spirale de Tillaux et angles',
      c: ['Repère', 'Valeur'],
      r: [['Droit médial', '5,5 mm du limbe'], ['Droit inférieur', '6,5 mm'], ['Droit latéral', '6,9 mm'],
          ['Droit supérieur', '7,7 mm'], ['Action pure des droits verticaux', '23° d’abduction'],
          ['Action pure des obliques', '51° d’adduction']] }
  ],
  cas: {
    t: 'Une plaie de l’orbite',
    s: 'Un patient arrive après un traumatisme de l’orbite gauche. On note un ptôsis complet, un œil en abduction et légère abaissement, une mydriase aréactive, et une accommodation abolie.',
    q: ['Quel nerf est atteint ?', 'Pourquoi cette position de l’œil ?', 'Quel élément fait la gravité ?'],
    r: 'Atteinte complète du III gauche. Le ptôsis vient du releveur de la paupière, la mydriase et la perte d’accommodation du contingent parasympathique. L’œil part en abduction et abaissement parce que les seuls muscles encore innervés sont le droit latéral (VI) et l’oblique supérieur (IV).',
    c: 'La mydriase aréactive est le signe d’alarme : le contingent parasympathique chemine en périphérie du nerf, il est donc touché d’abord par une compression. Devant un III avec mydriase, on élimine un anévrisme en urgence.'
  },
  reponse: {
    q: 'Décrivez l’anatomie fonctionnelle des muscles oculomoteurs.',
    p: [
      'Poser l’origine commune : anneau de Zinn pour cinq muscles ; l’oblique inférieur naît en avant, à l’angle inféro-nasal.',
      'Donner les insertions : spirale de Tillaux pour les droits, en arrière de l’équateur pour les obliques.',
      'Expliquer le rôle de la trochlée : elle donne à l’oblique supérieur son origine fonctionnelle antéro-nasale.',
      'Poser l’angle orbitaire de 23° : il explique que les droits verticaux ne soient purs qu’en abduction.',
      'Poser l’angle de 51° des obliques : ils sont purs en adduction.',
      'Énoncer les trois actions de chaque muscle, dans l’ordre.',
      'Terminer par l’innervation, et par les couples de Hering dans les positions diagnostiques.'
    ]
  },
  mnemo: [
    ['LR6 SO4, le reste 3', 'Droit latéral au VI, oblique supérieur au IV, tous les autres au III'],
    ['5,5 – 6,5 – 6,9 – 7,7', 'Tillaux : médial, inférieur, latéral, supérieur'],
    ['« Les obliques font le contraire de leur nom »', 'Oblique supérieur abaisse, oblique inférieur élève']
  ]
},

UE8: {
  tableaux: [
    { t: 'Les trois degrés de Worth',
      c: ['Degré', 'Ce qui est testé', 'Comment'],
      r: [
        ['1 — Perception simultanée', 'Les deux images arrivent au cortex', 'Mires complémentaires au synoptophore (lion / cage)'],
        ['2 — Fusion', 'Elles sont unifiées, et l’alignement tenu', 'Mires à contrôle, amplitudes de vergence'],
        ['3 — Stéréoscopie', 'La disparité est interprétée en relief', 'TNO, Lang, Titmus, mires stéréo']
      ] },
    { t: 'Les quatre convergences',
      c: ['Composante', 'Déclenchée par', 'Rééducable ?'],
      r: [
        ['Tonique', 'Tonus de base au repos', 'Non'],
        ['Accommodative', 'L’accommodation, via AC/A', 'Non — passe par la correction'],
        ['Fusionnelle', 'La disparité rétinienne', '<b>Oui</b> — c’est la cible de la rééducation'],
        ['Proximale', 'La conscience de la proximité', 'Partiellement']
      ] },
    { t: 'Amplitudes de fusion normales',
      c: ['', 'Convergence', 'Divergence', 'Vertical'],
      r: [['De loin', '15 à 20 Δ', '6 à 8 Δ', '2 à 3 Δ'], ['De près', '30 à 35 Δ', '12 à 16 Δ', '2 à 3 Δ']] }
  ],
  cas: {
    t: 'Calculer un AC/A',
    s: 'Patiente de 22 ans. Phorie de loin : 2 Δ d’exophorie. Phorie de près à 33 cm : 10 Δ d’exophorie. Écart pupillaire 62 mm. Avec +1,00 D devant les deux yeux de près, la phorie passe à 14 Δ d’exophorie.',
    q: ['Calculez l’AC/A par le gradient.', 'Que vaut-il ?', 'Qu’en concluez-vous ?'],
    r: 'Méthode du gradient : (phorie avec verre − phorie sans verre) / puissance. En comptant l’exophorie négativement : (−14 − (−10)) / +1,00 = <b>−4</b>, soit 4 Δ/D en valeur absolue. Le verre positif relâche l’accommodation, donc la convergence accommodative, donc l’exophorie augmente : le sens est cohérent.',
    c: 'AC/A à 4 Δ/D : dans la norme de 3 à 5. Le déséquilibre de près ne vient donc pas d’un AC/A anormal — on cherche du côté des réserves fusionnelles et du PPC, vers une insuffisance de convergence.'
  },
  reponse: {
    q: 'Qu’est-ce que la vision binoculaire normale et à quelles conditions existe-t-elle ?',
    p: [
      'Définir : perception unique et en relief à partir de deux images rétiniennes disparates.',
      'Poser les conditions sensorielles : deux images de qualité et de taille comparables, correspondance rétinienne normale.',
      'Poser la condition motrice : alignement maintenu par les vergences, donc des amplitudes suffisantes.',
      'Poser la condition corticale : intégration intacte, pas de neutralisation.',
      'Décrire l’horoptère et les aires de Panum : ce qui est vu simple, et l’épaisseur autour.',
      'Décrire la disparité : croisée en avant du plan de fixation, homonyme en arrière — c’est le signal du relief.',
      'Conclure par les trois degrés de Worth, qui structurent aussi les objectifs de rééducation.'
    ]
  },
  mnemo: [
    ['Worth : Simultané, Fusion, Relief', 'Les trois degrés dans l’ordre'],
    ['AC/A = 3 à 5', 'Élevé → excès de convergence ; bas → insuffisance de convergence'],
    ['Croisée = proche', 'Disparité croisée pour ce qui est en avant du point fixé']
  ]
},

UE9: {
  tableaux: [
    { t: 'Paralysie ou restriction : le tableau qui départage',
      c: ['Critère', 'Paralysie', 'Restriction'],
      r: [
        ['Déviation secondaire', 'Supérieure à la primaire', 'Non majorée'],
        ['Duction forcée', 'Libre', 'Résistante'],
        ['PIO dans le regard contraint', 'Inchangée', 'Augmentée'],
        ['Lancaster', 'Tracé agrandi du côté atteint', 'Limitation abrupte'],
        ['Évolution', 'Souvent récupération partielle', 'Fixe ou mécanique']
      ] },
    { t: 'Les principales ésotropies de l’enfant',
      c: ['', 'Congénitale', 'Accommodative'],
      r: [
        ['Début', 'Avant 6 mois', '2 à 4 ans'],
        ['Angle', 'Grand, > 30 Δ, stable', 'Variable, réduit par la correction'],
        ['Réfraction', 'Peu contributive', 'Hypermétropie, ou AC/A élevé'],
        ['Signes associés', 'DVD, nystagmus latent, hyperaction des obliques inférieurs', 'Peu ou pas'],
        ['Premier traitement', 'Correction puis chirurgie', 'Correction optique totale sous cycloplégie']
      ] }
  ],
  cas: {
    t: 'Une déviation verticale',
    s: 'Patient de 40 ans, diplopie verticale et torsionnelle depuis une chute. L’œil droit est le plus haut. La déviation augmente dans le regard à gauche, et augmente à l’inclinaison de la tête sur l’épaule droite.',
    q: ['Déroulez les trois pas de Parks.', 'Quel muscle est atteint ?', 'Quel torticolis attendez-vous ?'],
    r: 'Pas 1 : l’œil droit est le plus haut → soit les abaisseurs droits (oblique supérieur droit, droit inférieur droit), soit les élévateurs gauches. Pas 2 : majorée en regard à gauche, donc en adduction de l’œil droit → oblique supérieur droit ou droit inférieur gauche. Pas 3 : majorée à l’inclinaison droite → <b>oblique supérieur droit</b>, seul muscle commun aux trois réponses.',
    c: 'Paralysie du IV droit, la plus fréquente des paralysies verticales. Torticolis attendu : tête inclinée sur l’épaule gauche, menton légèrement abaissé, visage tourné à gauche. Bielschowsky positif du côté droit.'
  },
  reponse: {
    q: 'Comment conduisez-vous le bilan d’un strabisme ?',
    p: [
      'Interrogatoire : âge de début, photographies, antécédents familiaux, prématurité, traitement déjà entrepris.',
      'Acuité œil par œil, en ligne, adaptée à l’âge — avant tout le reste.',
      'Réfraction sous cycloplégie : elle conditionne l’interprétation de tout ce qui suit.',
      'Reflets cornéens et angle kappa, puis cover test unilatéral puis alterné, chiffré aux prismes, de loin et de près.',
      'Motilité dans les 9 positions, recherche de comitance, de syndrome alphabétique et de torticolis.',
      'Bilan sensoriel : Bagolini, Worth, relief, et test des 4 Δ si microtropie suspectée.',
      'Fond d’œil obligatoire devant tout strabisme unilatéral, pour éliminer une cause sensorielle.',
      'Conclure par une synthèse : type, angle, comitance, état sensoriel, amblyopie, proposition.'
    ]
  },
  mnemo: [
    ['Parks : Haut — Côté — Inclinaison', 'Les trois pas dans l’ordre'],
    ['Secondaire > primaire = paralysie', 'La restriction, elle, ne majore pas'],
    ['Tout strabisme unilatéral → fond d’œil', 'La règle qui sauve du rétinoblastome']
  ]
},

UE12: {
  tableaux: [
    { t: 'Les trois responsabilités',
      c: ['Type', 'Ce qu’elle sanctionne', 'Assurable ?'],
      r: [
        ['Civile', 'Le dommage causé au patient', 'Oui — assurance obligatoire'],
        ['Pénale', 'L’infraction à la loi', '<b>Non</b> — strictement personnelle'],
        ['Disciplinaire', 'Le manquement aux règles professionnelles', 'Non']
      ] },
    { t: 'Les quatre principes de l’éthique',
      c: ['Principe', 'Ce qu’il impose', 'Conflit typique'],
      r: [
        ['Autonomie', 'Respecter la décision du patient', 'Enfant qui refuse l’occlusion'],
        ['Bienfaisance', 'Agir pour son bien', 'Contre son refus'],
        ['Non-malfaisance', 'D’abord ne pas nuire', 'Examen invasif au bénéfice incertain'],
        ['Justice', 'Équité d’accès et de traitement', 'Priorisation en cas de délais longs']
      ] }
  ],
  cas: {
    t: 'La mère qui demande le dossier',
    s: 'La mère d’une patiente de 16 ans vous demande le compte rendu du bilan. L’adolescente, présente, vous dit qu’elle ne veut pas que sa mère le lise.',
    q: ['Qui a le droit d’accès ?', 'Que faites-vous ?', 'Sur quoi vous appuyez-vous ?'],
    r: 'Le titulaire de l’autorité parentale a un droit d’accès au dossier de son enfant mineur. Mais le mineur peut s’opposer à ce que certaines informations soient communiquées, et cette opposition doit être respectée et tracée. Les deux règles coexistent : ce n’est pas un tout ou rien.',
    c: 'On ne remet rien dans l’instant. On explique la règle aux deux, on trace l’opposition de la patiente, et on renvoie vers le médecin prescripteur qui statue sur la communication. On évite absolument de trancher seul devant les deux parties.'
  },
  reponse: {
    q: 'Quelles sont les obligations déontologiques de l’orthoptiste ?',
    p: [
      'Poser le cadre : auxiliaire médical, actes définis par décret, exercice sur prescription avec des exceptions encadrées.',
      'Le secret professionnel : ce qu’il couvre, qu’il n’est pas levé par un proche, et ce qu’est le secret partagé.',
      'Le consentement : information loyale claire et appropriée, capacité, liberté — et révocabilité à tout moment.',
      'Le dossier : tenue, conservation, droit d’accès du patient, distinction entre l’information et son support.',
      'Les trois responsabilités, en soulignant que la pénale est personnelle et non assurable.',
      'La formation continue et le développement professionnel continu.',
      'Conclure sur les quatre principes éthiques et la manière de traiter un conflit entre eux.'
    ]
  },
  mnemo: [
    ['ABNJ', 'Autonomie, Bienfaisance, Non-malfaisance, Justice'],
    ['« L’info au patient, le support au professionnel »', 'La règle de propriété du dossier']
  ]
},

UE16: {
  tableaux: [
    { t: 'Œil rouge : ce qui rassure, ce qui alarme',
      c: ['Signe', 'Bénin', 'Grave'],
      r: [
        ['Acuité', 'Conservée', 'Baissée'],
        ['Douleur', 'Gêne, picotement', 'Profonde, intense'],
        ['Rougeur', 'Diffuse, conjonctivale', 'Cercle périkératique'],
        ['Pupille', 'Normale', 'Myosis ou mydriase aréactive'],
        ['Cornée', 'Claire', 'Trouble, ulcère']
      ] },
    { t: 'DMLA : les deux formes',
      c: ['', 'Atrophique (sèche)', 'Exsudative (humide)'],
      r: [
        ['Évolution', 'Lente, années', 'Rapide, semaines'],
        ['Signes', 'Baisse progressive, scotome', 'Métamorphopsies, scotome central brutal'],
        ['Fond d’œil', 'Drusen puis plage d’atrophie', 'Hémorragie, exsudats, décollement'],
        ['Traitement', 'Pas de curatif, supplémentation, basse vision', 'Anti-VEGF en urgence relative']
      ] }
  ],
  cas: {
    t: 'Une baisse de vision brutale',
    s: 'Femme de 78 ans, baisse de vision de l’œil droit installée en quatre jours, avec déformation des lignes du carrelage. Pas de douleur, pas de rougeur. Acuité OD 2/10, OG 8/10.',
    q: ['Quel signe est le plus évocateur ?', 'Quel test immédiat ?', 'Quelle conduite ?'],
    r: 'Les métamorphopsies signent une atteinte maculaire par déplacement des photorécepteurs. Associées à une baisse rapide et indolore chez une patiente de cet âge, elles orientent d’abord vers une DMLA exsudative.',
    c: 'Grille d’Amsler immédiatement, œil par œil, puis OCT maculaire. Adressage rapide : la forme exsudative se traite par anti-VEGF, et le pronostic dépend du délai. On explique l’autosurveillance à domicile à l’œil controlatéral.'
  },
  reponse: {
    q: 'Devant un œil rouge, quelle démarche ?',
    p: [
      'Poser d’emblée la question qui tranche : l’acuité est-elle baissée ?',
      'Chercher les signes de gravité : douleur profonde, photophobie, cercle périkératique, anomalie pupillaire ou cornéenne.',
      'Séparer les tableaux sans baisse d’acuité : conjonctivite, hémorragie sous-conjonctivale, épisclérite.',
      'Séparer les tableaux avec baisse : kératite, uvéite antérieure, glaucome aigu, traumatisme.',
      'Détailler le glaucome aigu, à ne jamais manquer : œil dur, cornée trouble, mydriase peu réactive, nausées.',
      'Préciser ce que l’orthoptiste fait et ne fait pas : il repère, il ne traite pas, il adresse.',
      'Conclure sur les gestes contre-indiqués : pas de mydriatique sans avoir évalué l’angle, pas de corticoïde.'
    ]
  },
  mnemo: [
    ['« Acuité baissée = avis médical »', 'Le tri le plus simple et le plus fiable devant un œil rouge'],
    ['Sèche lente, humide rapide', 'Les deux DMLA en trois mots']
  ]
},

/* ============================ SEMESTRE 2 ============================ */

UE10: {
  tableaux: [
    { t: 'Périmétrie cinétique ou statique',
      c: ['', 'Goldmann (cinétique)', 'Automatisée (statique)'],
      r: [
        ['Principe', 'Test mobile, périphérie vers centre', 'Test fixe, intensité variable'],
        ['Résultat', 'Isoptères', 'Seuil point par point'],
        ['Points forts', 'Périphérie, patients difficiles, neuro', 'Quantitatif, reproductible, suivi'],
        ['Indication type', 'Hémianopsie, aptitude, enfant', 'Glaucome']
      ] },
    { t: 'Électrophysiologie : qui explore quoi',
      c: ['Examen', 'Ce qu’il explore', 'Anomalie typique'],
      r: [
        ['ERG flash', 'Rétine périphérique globale', 'Éteint dans la rétinopathie pigmentaire'],
        ['ERG multifocal', 'Macula, point par point', 'Dystrophie maculaire'],
        ['PEV damier', 'Voies optiques jusqu’au cortex', 'P100 allongée : démyélinisation'],
        ['EOG', 'Épithélium pigmentaire', 'Maladie de Best']
      ] }
  ],
  cas: {
    t: 'Un champ visuel douteux',
    s: 'Champ visuel automatisé d’un patient suivi pour hypertonie. Le relevé montre un déficit diffus important. Indices : 32 % de pertes de fixation, 18 % de faux positifs.',
    q: ['Que faites-vous de ce résultat ?', 'Quelles causes d’un déficit diffus artefactuel ?', 'Comment procédez-vous ?'],
    r: 'Avec 32 % de pertes de fixation et 18 % de faux positifs, l’examen n’est pas fiable : il ne s’interprète pas. Un déficit diffus artefactuel peut aussi venir d’une correction mal centrée ou absente, d’un myosis, d’une cataracte, d’un ptôsis ou d’une monture qui masque la périphérie.',
    c: 'On refait l’examen après avoir corrigé les causes évitables : correction adaptée et bien centrée, paupière relevée, patient réinstallé et réexpliqué. Interpréter un examen non fiable pollue toute la série de suivi pour des années.'
  },
  reponse: {
    q: 'Quels examens pour explorer une baisse d’acuité inexpliquée ?',
    p: [
      'Commencer par éliminer l’optique : réfraction, trou sténopéique, film lacrymal, milieux.',
      'Documenter la fonction : acuité de loin et de près, sensibilité aux contrastes, vision des couleurs.',
      'Explorer le champ visuel, en choisissant la stratégie selon l’hypothèse.',
      'Examiner la pupille : un DPAR oriente d’emblée vers le nerf optique.',
      'Imager : OCT maculaire et fibres optiques, fond d’œil, rétinophotographie.',
      'Recourir à l’électrophysiologie quand la clinique et l’imagerie ne concordent pas, ou chez l’enfant.',
      'Conclure : la démarche va du plus simple au plus spécialisé, et chaque examen répond à une hypothèse.'
    ]
  },
  mnemo: [
    ['« Fiabilité avant tout »', 'Pertes de fixation, faux positifs, faux négatifs — avant toute interprétation'],
    ['P100 = 100 ms', 'L’onde des PEV dont on surveille la latence']
  ]
},

UE11: {
  tableaux: [
    { t: 'Les tests sensoriels, du moins au plus dissociant',
      c: ['Test', 'Dissociation', 'Ce qu’il montre'],
      r: [
        ['Bagolini', 'Minime', 'Binocularité en conditions quasi naturelles'],
        ['Worth', 'Modérée', 'Fusion, diplopie, neutralisation et son côté'],
        ['Écran alterné aux prismes', 'Forte', 'Déviation totale, phorie comprise'],
        ['Synoptophore', 'Forte', 'Angles objectif et subjectif, degrés de Worth'],
        ['Maddox', 'Totale', 'Déviation latente maximale']
      ] },
    { t: 'Valeurs de référence du bilan',
      c: ['Mesure', 'Norme'],
      r: [['PPC — rupture', '≤ 6 à 8 cm'], ['PPC — recouvrement', '≤ 10 cm'],
          ['Convergence de près', '30 à 35 Δ'], ['Divergence de près', '12 à 16 Δ'],
          ['AC/A', '3 à 5 Δ/D'], ['Stéréoacuité', '≤ 60″ d’arc'],
          ['Flippers ± 2,00 D binoculaire', '≈ 11 cycles/min']] },
    { t: 'Interpréter le test de Worth',
      c: ['Ce que voit le patient', 'Conclusion'],
      r: [['4 points', 'Fusion'], ['5 points', 'Diplopie'],
          ['2 points rouges', 'Neutralisation de l’œil au verre vert'],
          ['3 points verts', 'Neutralisation de l’œil au verre rouge']] }
  ],
  cas: {
    t: 'Asthénopie chez une étudiante',
    s: 'Étudiante de 20 ans, céphalées frontales en fin de journée, mots qui se dédoublent après vingt minutes de lecture, ferme un œil pour finir ses révisions. Acuités 10/10 sans correction. Exophorie 4 Δ de loin, 14 Δ de près. PPC rupture à 14 cm. Convergence fusionnelle de près : 12 Δ.',
    q: ['Le critère de Sheard est-il rempli ?', 'Quel est votre diagnostic orthoptique ?', 'Que proposez-vous ?'],
    r: 'Sheard exige une réserve opposée d’au moins deux fois la phorie, soit 2 × 14 = <b>28 Δ</b> de convergence. Elle en a 12 : le critère n’est pas rempli, et de loin. Le PPC à 14 cm est très éloigné de la norme de 6 à 8 cm.',
    c: 'Diagnostic orthoptique : insuffisance de convergence avec asthénopie de lecture et retentissement sur les études. Projet : rééducation de la convergence fusionnelle, objectif PPC < 8 cm et convergence de près > 28 Δ, réévaluation à 10 séances. Prisme de repos non indiqué en première intention : il soulagerait sans rééduquer.'
  },
  reponse: {
    q: 'Décrivez le déroulement d’un bilan orthoptique complet.',
    p: [
      'Interrogatoire : plainte précise, circonstances, ancienneté, retentissement, antécédents et traitements.',
      'Acuités de loin et de près, œil par œil puis binoculaire, avec la correction portée.',
      'Réfraction, et sous cycloplégie si l’âge ou le tableau l’imposent.',
      'Équilibre oculomoteur : reflets, cover test unilatéral puis alterné chiffré, de loin et de près.',
      'Motilité dans les 9 positions, comitance, torticolis.',
      'Vergences et accommodation : PPC, amplitudes de fusion, AC/A, flippers, amplitude d’accommodation.',
      'Bilan sensoriel : Bagolini, Worth, stéréoscopie, recherche de neutralisation.',
      'Synthèse : diagnostic orthoptique, retentissement, projet chiffré avec critères de réévaluation et d’arrêt.'
    ]
  },
  mnemo: [
    ['Sheard : réserve ≥ 2 × phorie', 'Et si non : prisme = (2 × phorie − réserve) / 3'],
    ['Worth : « 2 rouges, l’œil vert dort »', 'Le côté neutralisé est celui du verre opposé aux points vus'],
    ['PPC 6-8-10', 'Rupture 6 à 8 cm, recouvrement jusqu’à 10 cm']
  ]
},

UE13: {
  tableaux: [
    { t: 'Conduite devant un accident d’exposition',
      c: ['Étape', 'Peau / piqûre', 'Projection oculaire'],
      r: [
        ['Immédiat', 'Laver à l’eau et au savon, ne pas faire saigner', 'Rincer abondamment au sérum physiologique'],
        ['Antisepsie', 'Dérivé chloré ou alcool 70°, ≥ 5 min', 'Poursuivre le rinçage'],
        ['Délai médical', 'Avis dans les 4 heures', 'Avis dans les 4 heures'],
        ['Administratif', 'Déclaration sous 24 à 48 h', 'Déclaration sous 24 à 48 h']
      ] }
  ],
  cas: {
    t: 'Un œil rouge en salle d’attente',
    s: 'Un patient se présente avec un œil très rouge, larmoiement important, adénopathie prétragienne et sensation de corps étranger apparue il y a trois jours. Un membre de sa famille a eu la même chose la semaine dernière.',
    q: ['Quelle est votre hypothèse ?', 'Quelles mesures immédiates ?', 'Que dites-vous au patient ?'],
    r: 'Kérato-conjonctivite épidémique à adénovirus : contexte de contage, adénopathie prétragienne, atteinte bilatéralisable. Le virus est extrêmement contagieux, survit longtemps sur les surfaces et résiste à beaucoup d’antiseptiques usuels.',
    c: 'Consultation en fin de programme si possible, matériel dédié, désinfection renforcée du poste, mentonnière et appui-front compris. On informe le patient de la durée de contagiosité, du lavage des mains, du linge personnel, et de l’éviction des collectivités.'
  },
  reponse: {
    q: 'Quelles précautions d’hygiène en consultation d’orthoptie ?',
    p: [
      'Poser les précautions standard : friction hydro-alcoolique avant et après chaque patient et chaque geste.',
      'Préciser que les gants ne remplacent jamais l’hygiène des mains.',
      'Lister le matériel au contact : occluseurs, prismes, verres d’essai, montures, barre de prismes, mentonnière et appui-front.',
      'Décrire le traitement : nettoyage puis désinfection selon protocole écrit, usage unique privilégié.',
      'Traiter le cas de l’adénovirus : contagiosité, résistance, organisation de la consultation.',
      'Rappeler la règle des collyres : unidose pour un patient et une séance, flacons jamais partagés.',
      'Conclure par la conduite devant un accident d’exposition et la culture de déclaration.'
    ]
  },
  mnemo: [
    ['Laver – Antiseptiser – Avis 4 h – Déclarer 48 h', 'La chaîne de l’accident d’exposition'],
    ['« Mentonnière et appui-front »', 'Les deux surfaces les plus touchées et les plus oubliées']
  ]
},

UE14: {
  tableaux: [
    { t: 'Les trois paralysies oculomotrices',
      c: ['', 'III', 'IV', 'VI'],
      r: [
        ['Déficit', 'Élévation, abaissement, adduction', 'Abaissement en adduction, intorsion', 'Abduction'],
        ['Position de repos', 'Abduction et abaissement', 'Hypertropie du côté atteint', 'Ésotropie'],
        ['Diplopie', 'Variable, souvent masquée par le ptôsis', 'Verticale et torsionnelle', 'Homonyme, majorée de loin'],
        ['Torticolis', 'Peu net', 'Tête inclinée du côté opposé', 'Visage tourné du côté atteint'],
        ['Signe d’alarme', 'Mydriase aréactive', 'Bielschowsky positif', 'Peut n’être qu’un signe d’HTIC']
      ] },
    { t: 'Syndromes de restriction',
      c: ['Syndrome', 'Signe clé', 'Mécanisme'],
      r: [
        ['Brown', 'Élévation limitée en adduction, clic possible', 'Tendon de l’oblique supérieur bloqué dans la trochlée'],
        ['Duane', 'Abduction limitée, rétraction du globe en adduction', 'Dysinnervation, VI absent'],
        ['Orbitopathie dysthyroïdienne', 'Duction forcée résistante, exophtalmie', 'Fibrose musculaire — DI, DM, DS, DL'],
        ['Fracture du plancher', 'Élévation limitée, énophtalmie, hypoesthésie V2', 'Incarcération du droit inférieur']
      ] }
  ],
  cas: {
    t: 'Une diplopie qui varie dans la journée',
    s: 'Femme de 45 ans, diplopie verticale intermittente et ptôsis, absents le matin, marqués le soir. Les mesures varient d’un examen à l’autre. Pupilles normales et réactives.',
    q: ['Qu’est-ce qui doit vous alerter ?', 'Quelle hypothèse ?', 'Quel test simple ?'],
    r: 'La <b>variabilité et la fatigabilité</b> sont le signe : une paralysie oculomotrice classique ne fluctue pas ainsi dans la journée. L’absence d’atteinte pupillaire écarte un III compressif. Le tableau évoque une myasthénie oculaire.',
    c: 'Test du glaçon sur la paupière ptôsée, amélioration après repos de quelques minutes les yeux fermés, mesures répétées documentant la fluctuation. Adressage pour bilan : la myasthénie peut se généraliser, et une atteinte respiratoire est possible.'
  },
  reponse: {
    q: 'Comment analysez-vous une paralysie oculomotrice ?',
    p: [
      'Interrogatoire : mode d’installation, ancienneté, caractère variable ou non, traumatisme, contexte général.',
      'Décrire la déviation en position primaire, puis dans les 9 positions.',
      'Chiffrer : cover test aux prismes dans les positions clés, en fixant de chaque œil.',
      'Comparer déviation primaire et secondaire — c’est ce qui sépare paralysie et restriction.',
      'Réaliser le Lancaster et lire le schéma : quel tracé est agrandi, quel muscle est déficitaire.',
      'Appliquer les trois pas de Parks devant toute déviation verticale.',
      'Éliminer une restriction : duction forcée, PIO dans le regard contraint, contexte orbitaire.',
      'Conclure sur le torticolis, le retentissement, et les signes qui imposent un avis neurologique urgent.'
    ]
  },
  mnemo: [
    ['III mydriase = urgence', 'Anévrisme jusqu’à preuve du contraire'],
    ['I’M SLOw', 'Ordre d’atteinte dans l’orbitopathie : Inférieur, Médial, Supérieur, Latéral'],
    ['« Ça varie ? pense myasthénie »', 'La fluctuation dans la journée n’est jamais une paralysie simple']
  ]
},

UE15: {
  tableaux: [
    { t: 'Les grands déséquilibres et leur traitement',
      c: ['Tableau', 'Signes', 'AC/A', 'Traitement'],
      r: [
        ['Insuffisance de convergence', 'Exophorie de près, PPC éloigné', 'Bas', 'Rééducation de la convergence fusionnelle'],
        ['Excès de convergence', 'Ésophorie de près ≫ de loin', 'Élevé', 'Correction, addition, travail de la divergence'],
        ['Insuffisance de divergence', 'Ésophorie de loin ≫ de près', 'Bas', 'Éliminer un VI, prismes, avis médical'],
        ['Insuffisance accommodative', 'Amplitude < minimum de Hofstetter', 'Variable', 'Souplesse accommodative, flippers']
      ] },
    { t: 'Progression d’une rééducation de convergence',
      c: ['Étape', 'Objectif', 'Outil'],
      r: [
        ['1', 'Prendre conscience de la diplopie physiologique', 'Corde de Brock'],
        ['2', 'Convergence volontaire tenue', 'Cible rapprochée, PPC répété'],
        ['3', 'Amplitudes fusionnelles', 'Prismes progressifs, synoptophore'],
        ['4', 'Vitesse de réponse', 'Sauts de vergence, alternance de distances'],
        ['5', 'Automatisation', 'Lecture, transfert en situation réelle']
      ] }
  ],
  cas: {
    t: 'Rééducation qui n’avance pas',
    s: 'Après huit séances de rééducation d’une insuffisance de convergence, le PPC est passé de 15 à 13 cm et la patiente dit ne pas voir de différence. Elle reconnaît ne pas faire les exercices entre les séances.',
    q: ['Que faites-vous à ce stade ?', 'Quelles causes envisagez-vous ?', 'Quelle décision ?'],
    r: 'On est au point de réévaluation des 8 à 10 séances, et la progression est insuffisante. Trois causes à examiner dans l’ordre : l’<b>observance</b> — ici avouée et probablement principale ; la <b>correction optique</b>, à revérifier, une amétropie non compensée bloquant toute progression ; le <b>diagnostic</b> lui-même, à reprendre si les deux premiers sont en ordre.',
    c: 'On reprend le contrat : objectifs réexpliqués, exercices simplifiés et raccourcis pour qu’ils tiennent dans sa journée, support écrit. On revérifie la réfraction. On fixe une nouvelle échéance courte avec un critère chiffré, et on annonce que sans progression on arrêtera plutôt que de prolonger indéfiniment.'
  },
  reponse: {
    q: 'Comment construisez-vous une rééducation orthoptique ?',
    p: [
      'Partir du bilan : diagnostic orthoptique et retentissement, pas d’une liste de chiffres.',
      'Vérifier les prérequis : correction optique adaptée et portée, absence de cause organique évolutive.',
      'Fixer des objectifs mesurables : PPC, amplitudes, cycles de flippers, disparition du symptôme.',
      'Choisir la progression : prise de conscience, amplitude, vitesse, automatisation en situation.',
      'Prévoir les exercices intercalaires : courts, écrits, réalistes dans la vie du patient.',
      'Fixer le rythme, la durée prévisionnelle et la date de réévaluation, à 8 à 10 séances.',
      'Poser dès le départ les critères d’arrêt — objectifs atteints, ou plateau confirmé.',
      'Tracer et transmettre : compte rendu comparatif au prescripteur.'
    ]
  },
  mnemo: [
    ['Seule la fusionnelle se rééduque', 'Tonique, accommodative et proximale passent par autre chose'],
    ['8 à 10 séances', 'Le rythme de réévaluation à ne pas dépasser'],
    ['Correction d’abord', 'Rééduquer sur une réfraction fausse ne mène nulle part']
  ]
},

UE17: {
  tableaux: [
    { t: 'Glaucome : structure et fonction dans le temps',
      c: ['Outil', 'Ce qu’il montre', 'Quand il bouge'],
      r: [
        ['OCT RNFL', 'Épaisseur des fibres péripapillaires', 'Tôt, avant le champ'],
        ['OCT ganglionnaire', 'Complexe maculaire', 'Tôt, utile si RNFL au plancher'],
        ['Champ visuel', 'Retentissement fonctionnel', 'Plus tard'],
        ['Papille', 'Excavation, anneau, hémorragie', 'Signe d’alerte ponctuel']
      ] },
    { t: 'Ce qui rend un examen ininterprétable',
      c: ['Examen', 'Signal d’alerte', 'Conduite'],
      r: [
        ['Champ visuel', 'Pertes de fixation > 20 %, faux positifs élevés', 'Refaire, ne pas commenter'],
        ['Champ visuel', 'Aspect « trou de serrure »', 'Vérifier centrage et monture'],
        ['OCT', 'Signal faible, erreur de segmentation', 'Refaire, corriger la segmentation'],
        ['Série de suivi', 'Appareils ou stratégies différents', 'Ne pas comparer directement']
      ] }
  ],
  cas: {
    t: 'Faut-il s’inquiéter ?',
    s: 'Patiente de 61 ans suivie pour glaucome débutant. Trois champs visuels sur deux ans, tous fiables, stables. Le RNFL est passé de 92 à 84 µm sur la même période. PIO à 19 mmHg sous monothérapie.',
    q: ['Comment interprétez-vous cette discordance ?', 'Est-ce rassurant ?', 'Que proposez-vous ?'],
    r: 'La perte physiologique du RNFL est d’environ 1 µm par an : 8 µm en deux ans, c’est <b>quatre fois</b> le vieillissement attendu. Or dans le glaucome, la structure bouge souvent avant la fonction. Un champ stable ne rassure donc pas ici : il est simplement en retard sur la structure.',
    c: 'Ce n’est pas rassurant. On resserre le suivi et on transmet clairement au médecin : progression structurelle significative malgré une fonction stable, PIO possiblement insuffisamment abaissée. On veille à comparer sur le même appareil et la même stratégie.'
  },
  reponse: {
    q: 'Comment suivez-vous une pathologie chronique sur des examens répétés ?',
    p: [
      'Poser la règle de comparabilité : même appareil, même stratégie, mêmes conditions, même correction.',
      'Vérifier la fiabilité de chaque examen avant toute interprétation.',
      'Établir une ligne de base solide : plusieurs examens rapprochés au début pour une pente fiable.',
      'Distinguer variation aléatoire et tendance : une pente se lit sur une série, jamais sur deux points.',
      'Croiser structure et fonction, et savoir que la structure précède souvent dans le glaucome.',
      'Adapter le rythme : vitesse de progression, âge, marge fonctionnelle restante.',
      'Rédiger une conclusion utile : « stable » ou « aggravation », et sur quel critère chiffré.'
    ]
  },
  mnemo: [
    ['RNFL ≈ 1 µm/an', 'Au-delà, la perte n’est plus physiologique'],
    ['« Structure avant fonction »', 'Dans le glaucome, l’OCT bouge avant le champ visuel']
  ]
},

UE18: {
  tableaux: [
    { t: 'Adapter la communication à l’âge',
      c: ['Âge', 'Ce qui marche', 'Ce qui échoue'],
      r: [
        ['Enfant', 'Mots concrets, rôle actif, jeu', 'Explications abstraites, menaces'],
        ['Adolescent', 'Négocier le cadre, respecter l’image sociale', 'Imposer le principe'],
        ['Adulte', 'Objectifs et bénéfice concret', 'Jargon, culpabilisation'],
        ['Personne âgée', 'Rythme lent, écrit gros, vérifier l’audition', 'Parler à l’accompagnant plutôt qu’à elle']
      ] }
  ],
  cas: {
    t: 'Un refus d’occlusion',
    s: 'Garçon de 9 ans, amblyopie modérée. Sa mère explique qu’il arrache son cache dès l’école et qu’elle « n’en peut plus ». L’enfant, tête baissée, finit par dire que les autres se moquent de lui.',
    q: ['Quel est le vrai obstacle ?', 'Que proposez-vous ?', 'Que dites-vous à la mère ?'],
    r: 'L’obstacle n’est ni la compréhension ni la motivation : c’est le <b>coût social</b> immédiat, très supérieur pour l’enfant à un bénéfice différé et abstrait. Argumenter sur l’importance médicale ne peut pas fonctionner contre cela.',
    c: 'On négocie le contexte plutôt que le principe : occlusion sur des créneaux hors école, ou passage à un filtre de Bangerter, moins visible. On associe l’enfant à la décision et on lui donne un moyen de suivi qui lui appartient. À la mère, on reformule que le refus n’est pas de l’opposition et on la décharge du rôle de gendarme.'
  },
  reponse: {
    q: 'Comment annoncez-vous une mauvaise nouvelle à un patient ?',
    p: [
      'Préparer le cadre : lieu calme, temps suffisant, sans interruption, accompagnant si le patient le souhaite.',
      'Chercher d’abord ce que la personne sait, et ce qu’elle veut savoir.',
      'Annoncer en mots simples, sans détour ni euphémisme, une information à la fois.',
      'Se taire : laisser la place au choc, accepter le silence et l’émotion.',
      'Reformuler, vérifier ce qui a été compris, répondre aux questions posées et pas aux autres.',
      'Donner une suite concrète : ce qui va se passer, ce qu’on peut faire, un rendez-vous.',
      'Tracer ce qui a été dit, et prévenir l’équipe : la répétition d’une annonce mal reçue aggrave tout.'
    ]
  },
  mnemo: [
    ['« Le silence fait partie du soin »', 'Combler le silence sert le soignant, pas le patient'],
    ['Négocier le cadre, pas le principe', 'La clé de l’adhésion chez l’adolescent']
  ]
},

UE19: {
  tableaux: [
    { t: 'Les collyres du bilan orthoptique',
      c: ['Classe', 'Exemple', 'Effet', 'Précaution'],
      r: [
        ['Mydriatique', 'Tropicamide', 'Dilatation, cycloplégie faible', 'Angle étroit'],
        ['Cycloplégique', 'Cyclopentolate, atropine', 'Paralysie de l’accommodation', 'Effets systémiques chez l’enfant'],
        ['Myotique', 'Pilocarpine', 'Myosis', 'Test de la pupille d’Adie'],
        ['Anesthésique', 'Oxybuprocaïne', 'Anesthésie de contact', 'Protection cornéenne abolie'],
        ['Colorant', 'Fluorescéine', 'BUT, ulcère, adaptation', 'Vecteur de contamination croisée']
      ] }
  ],
  cas: {
    t: 'Une réaction après instillation',
    s: 'Une heure après l’instillation d’atropine 0,5 % chez un enfant de 3 ans, les parents rappellent : il est rouge, chaud, agité et se plaint d’avoir soif.',
    q: ['Que se passe-t-il ?', 'Est-ce grave ?', 'Quels conseils auraient dû être donnés ?'],
    r: 'C’est le tableau classique d’imprégnation atropinique : rougeur du visage, fièvre, sécheresse buccale, agitation, tachycardie. Il traduit un passage systémique, favorisé chez le jeune enfant par le rapport dose / poids et par l’absorption via les voies lacrymales.',
    c: 'Le plus souvent bénin et résolutif, mais il impose un avis médical et l’arrêt des instillations suivantes. Ce qu’il fallait dire d’emblée : comprimer le canthus interne une minute après la goutte, respecter strictement la posologie, et prévenir les parents de ces signes et de la conduite à tenir.'
  },
  reponse: {
    q: 'Quel cycloplégique choisissez-vous, et pourquoi ?',
    p: [
      'Poser la question préalable : à quoi sert la dilatation — fond d’œil ou réfraction ?',
      'Pour un fond d’œil : tropicamide, action brève, cycloplégie faible mais suffisante.',
      'Pour une réfraction d’enfant : cyclopentolate, en adaptant la concentration à l’âge.',
      'Pour une hypermétropie forte, une ésotropie accommodative ou un iris très pigmenté : atropine.',
      'Vérifier avant : allergie, lentilles, antécédent d’angle étroit, antécédents neurologiques.',
      'Expliquer la technique : cul-de-sac inférieur, compression du canthus interne une minute.',
      'Informer des effets attendus, de leur durée, et des signes qui doivent faire reconsulter.'
    ]
  },
  mnemo: [
    ['Tropicamide voit, cyclopentolate mesure', 'Le premier pour le fond d’œil, le second pour réfracter'],
    ['Comprimer le canthus 1 minute', 'Le geste qui divise le passage systémique']
  ]
}

};
