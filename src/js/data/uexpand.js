/* ============================================================
   Compléments aux fiches d'UE
   ------------------------------------------------------------
   Données transversales, tenues à part des fiches elles-mêmes
   (ueguide.js / ueguide2.js) parce qu'elles décrivent les liens
   entre UE plutôt que le contenu d'une UE :

     prereq : les UE sur lesquelles celle-ci repose. Le graphe
              est acyclique et se lit dans les deux sens :
              « repose sur » et, par inversion, « prépare ».
     mots   : le vocabulaire indispensable, en titres exacts du
              glossaire — vérifiable par UE_EXTRA_CHECK().
     qr     : questions d'auto-interrogation. Formulées comme à
              l'oral : une question, une réponse en une phrase.

   Les UE sans contenu disciplinaire propre (anglais, UE libre)
   ne figurent pas ici.
   ============================================================ */
window.UE_EXTRA = {

  /* ---------------- Semestre 1 ---------------- */

  UE1: {
    prereq: [],
    mots: ['Cône', 'Bâtonnet', 'Fovéa', 'Macula', 'Cornée', 'Cristallin', 'Cellules ganglionnaires', 'Rétinopathie pigmentaire', 'Rétinoblastome'],
    qr: [
      ['Citez les 10 couches de la rétine, de la choroïde vers le vitré.', 'Épithélium pigmentaire, photorécepteurs, limitante externe, nucléaire externe, plexiforme externe, nucléaire interne, plexiforme interne, cellules ganglionnaires, fibres optiques, limitante interne.'],
      ['Pourquoi la cornée est-elle transparente ?', 'Stroma en lamelles de collagène régulièrement espacées, avasculaire, maintenu déshydraté par les pompes de l’endothélium. Toute rupture de cet équilibre donne un œdème.'],
      ['Qu’y a-t-il exactement à la fovéola ?', 'Uniquement des cônes : ni bâtonnets, ni vaisseaux, et les couches internes sont écartées.'],
      ['Quel mode de transmission ne passe jamais par le père ?', 'La transmission mitochondriale — la neuropathie optique de Leber en est l’exemple.'],
      ['Quelles fonctions assure l’épithélium pigmentaire ?', 'Phagocytose quotidienne des articles externes, cycle des rétinoïdes, absorption de la lumière parasite, barrière hémato-rétinienne externe.'],
      ['Quelle couche de la cornée ne se régénère pas ?', 'L’endothélium : sa densité ne fait que décroître à partir de la naissance.']
    ]
  },

  UE2: {
    prereq: [],
    mots: ['Dioptrie', 'Dioptrie prismatique', 'Prisme', 'Prentice (loi de)', 'Sturm (conoïde de)', 'Équivalent sphérique', 'Transposition cylindrique', 'Punctum remotum', 'Punctum proximum', 'Distance de sommet', 'Puissance effective', 'Axe visuel'],
    qr: [
      ['Que vaut 1 dioptrie prismatique en degrés ?', '≈ 0,57°. Δ = 100 × tan θ, donc 2 Δ ≈ 1°.'],
      ['Énoncez la loi de Prentice.', 'Δ = puissance du verre en dioptries × décentrement en centimètres.'],
      ['Qu’est-ce que le cercle de moindre diffusion ?', 'La section circulaire de la conoïde de Sturm, au milieu dioptrique des deux focales : c’est là que se place l’équivalent sphérique.'],
      ['Comment transpose-t-on un cylindre ?', 'Nouvelle sphère = sphère + cylindre ; le cylindre change de signe ; l’axe tourne de 90°.'],
      ['Vers où un prisme dévie-t-il le rayon, et vers où l’image ?', 'Le rayon vers la base, l’image vers l’arête.'],
      ['Quand la distance de sommet devient-elle un problème ?', 'Au-delà de ± 4 D environ : P’ = P / (1 − d × P), d en mètres.']
    ]
  },

  UE3: {
    prereq: ['UE2'],
    mots: ['Réfraction', 'Réfraction subjective', 'Skiascopie', 'Autoréfractomètre', 'Cycloplégie', 'Cyclopentolate', 'Hypermétropie latente', 'Myopie', 'Hypermétropie', 'Astigmatisme', 'Duochrome', 'Brouillage', 'Phoroptère', 'Addition', 'Presbytie'],
    qr: [
      ['Pourquoi réfracte-t-on un enfant sous cycloplégie ?', 'Parce que le tonus accommodatif masque une part de l’hypermétropie et simule une myopie : seule la cycloplégie donne la réfraction vraie.'],
      ['Au duochrome, le vert est plus net : que faites-vous ?', 'J’ajoute du plus — « Green Add Plus ». L’œil était surcorrigé en myopie.'],
      ['Quel verre de travail en skiascopie à 67 cm ?', '+1,50 D, soit l’inverse de la distance en mètres. +2,00 D à 50 cm.'],
      ['Ombre directe en skiascopie : que conclure ?', 'L’œil est moins convergent que le point neutre : j’ajoute du plus.'],
      ['À quoi sert le brouillage ?', 'À relâcher l’accommodation par des verres positifs, puis à réduire progressivement : on retient le plus fort plus qui donne la meilleure acuité.'],
      ['Un réflexe en ciseaux à la skiascopie évoque quoi ?', 'Un astigmatisme irrégulier, kératocône en premier lieu.']
    ]
  },

  UE4: {
    prereq: ['UE1'],
    mots: ['Cône', 'Bâtonnet', 'Vision photopique', 'Vision scotopique', 'Vision mésopique', 'Adaptation à l’obscurité', 'Dyschromatopsie', 'Voies optiques', 'Chiasma optique', 'Champ visuel', 'Cellules ganglionnaires', 'Réflexe photomoteur'],
    qr: [
      ['Quelles fibres croisent au chiasma ?', 'Les fibres nasales, qui portent le champ visuel temporal.'],
      ['Décrivez le trajet du réflexe photomoteur.', 'Rétine → nerf optique → chiasma → noyau prétectal → noyaux d’Edinger-Westphal des deux côtés → III → sphincter. D’où le réflexe consensuel.'],
      ['Combien de temps pour une adaptation à l’obscurité complète ?', 'Plateau des cônes en 5 à 7 min, des bâtonnets en 30 min environ, séparés par la cassure photochromatique.'],
      ['Quels sont les maxima de sensibilité photopique et scotopique ?', '555 nm en photopique, 507 nm en scotopique — le décalage est l’effet Purkinje.'],
      ['Énoncez la règle de Köllner.', 'Atteinte rétinienne → dyschromatopsie bleu-jaune ; atteinte du nerf optique → rouge-vert.'],
      ['Pourquoi existe-t-il un scotome central physiologique la nuit ?', 'Parce que la fovéola ne contient aucun bâtonnet.']
    ]
  },

  UE5: {
    prereq: ['UE2', 'UE4'],
    mots: ['Acuité visuelle', 'logMAR', 'Optotype', 'Landolt (anneaux de)', 'Monoyer (échelle de)', 'Parinaud (échelle de)', 'Snellen', 'Crowding', 'Trou sténopéique', 'Sensibilité aux contrastes', 'Regard préférentiel'],
    qr: [
      ['Que mesure-t-on exactement quand on mesure l’acuité ?', 'Le pouvoir séparateur : le plus petit angle sous lequel deux points sont vus distincts. 10/10 = un détail sous 1 minute d’arc.'],
      ['Convertissez 5/10 en logMAR.', '0,3. logMAR = −log10(acuité décimale).'],
      ['Pourquoi mesurer l’acuité en ligne chez un amblyope ?', 'Parce que l’effet de crowding est majoré : en optotypes isolés on surestime nettement sa vision.'],
      ['Pourquoi le logMAR est-il préféré en recherche ?', 'Progression géométrique régulière, cinq optotypes par ligne, échantillonnage identique aux fortes et aux faibles acuités : les moyennes ont un sens.'],
      ['L’acuité s’améliore au trou sténopéique : que concluez-vous ?', 'La cause est optique — amétropie non corrigée, astigmatisme irrégulier, cataracte débutante — et non rétinienne ou neurologique.'],
      ['Quelle acuité attendez-vous à 1 an ? à 5 ans ?', '≈ 4/10 à 1 an, 10/10 vers 5-6 ans.']
    ]
  },

  UE7: {
    prereq: ['UE1'],
    mots: ['Anneau de Zinn', 'Tillaux (spirale de)', 'Oblique supérieur', 'Oblique inférieur', 'Limbe', 'Cornée', 'Cristallin', 'Zonule', 'Iris', 'Papille', 'Nerf optique'],
    qr: [
      ['Donnez la spirale de Tillaux.', 'Droit médial 5,5 – droit inférieur 6,5 – droit latéral 6,9 – droit supérieur 7,7 mm du limbe.'],
      ['Quel muscle oculomoteur ne naît pas de l’anneau de Zinn ?', 'L’oblique inférieur : il naît à l’angle inféro-nasal de l’orbite, sur le maxillaire.'],
      ['Innervation des six muscles oculomoteurs ?', 'Droit latéral par le VI, oblique supérieur par le IV, les quatre autres par le III.'],
      ['Que sépare les deux branches du III ?', 'La supérieure : droit supérieur et releveur de la paupière. L’inférieure : droit médial, droit inférieur, oblique inférieur et le contingent parasympathique du sphincter pupillaire.'],
      ['Quel est le rôle de la trochlée ?', 'Elle réfléchit le tendon de l’oblique supérieur à 51°, lui donnant son origine fonctionnelle antéro-nasale.'],
      ['Que traverse la fente sphénoïdale ?', 'III, IV, VI, V1 et la veine ophtalmique supérieure. Le nerf optique passe à part, par le canal optique.']
    ]
  },

  UE8: {
    prereq: ['UE4', 'UE7'],
    mots: ['Duction', 'Version', 'Vergence', 'Convergence', 'Convergence accommodative', 'Convergence fusionnelle', 'Fusion', 'Stéréoscopie', 'Aire de Panum', 'Horoptère', 'Disparité rétinienne', 'Correspondance rétinienne normale', 'Rapport AC/A', 'Hering (loi de)', 'Sherrington (loi de)', 'Donders (loi de)', 'Listing (plan de)', 'Accommodation', 'Hofstetter (formules de)'],
    qr: [
      ['Énoncez la loi de Hering, puis celle de Sherrington.', 'Hering : égale innervation des synergistes des deux yeux dans les mouvements conjugués. Sherrington : innervation réciproque, la contraction d’un muscle s’accompagne du relâchement de son antagoniste homolatéral.'],
      ['Quels sont les trois degrés de Worth ?', 'Perception simultanée, fusion, stéréoscopie.'],
      ['À quoi servent les aires de Panum ?', 'Elles donnent son épaisseur à l’horoptère : les disparités qui y tombent fusionnent encore et sont interprétées en relief.'],
      ['Citez les quatre composantes de la convergence.', 'Tonique, accommodative, fusionnelle, proximale. Seule la fusionnelle se rééduque vraiment.'],
      ['Norme du rapport AC/A ?', '3 à 5 Δ par dioptrie d’accommodation.'],
      ['Amplitude d’accommodation attendue à 20 ans, selon Hofstetter ?', 'Maximum 25 − 0,4 × 20 = 17 D ; minimum 15 − 0,25 × 20 = 10 D.'],
      ['Actions de l’oblique supérieur, dans l’ordre ?', 'Intorsion, puis abaissement, puis abduction. L’abaissement est maximal en adduction.']
    ]
  },

  UE9: {
    prereq: ['UE8'],
    mots: ['Hétérophorie', 'Hétérotropie', 'Ésotropie', 'Exotropie', 'Microtropie', 'Comitance', 'Déviation primaire / secondaire', 'Correspondance rétinienne anormale', 'Neutralisation', 'Diplopie', 'Confusion', 'Angle kappa', 'Cover test', 'Hirschberg (test de)', 'Krimsky (test de)', 'DVD', 'Nystagmus latent', 'Syndrome alphabétique'],
    qr: [
      ['Comment distinguez-vous une phorie d’une tropie ?', 'La phorie n’apparaît qu’après dissociation, au cover test alterné. La tropie est manifeste en binoculaire non dissocié.'],
      ['Pourquoi la déviation secondaire dépasse-t-elle la primaire ?', 'Par la loi de Hering : en fixant de l’œil parétique, l’effort d’innervation est transmis en excès à l’œil sain.'],
      ['Qu’est-ce qu’une correspondance rétinienne anormale harmonieuse ?', 'L’angle d’anomalie égale l’angle objectif : l’angle subjectif est nul, le patient superpose les mires alors que les yeux sont déviés.'],
      ['Quelle différence entre diplopie et confusion ?', 'Diplopie : un objet vu deux fois, images sur des points non correspondants. Confusion : deux objets vus au même endroit, points correspondants stimulés différemment.'],
      ['1 mm de décentrement du reflet cornéen vaut combien ?', '≈ 7°, soit ≈ 15 dioptries prismatiques.'],
      ['Qu’est-ce qu’un syndrome V ?', 'Une déviation plus divergente en haut qu’en bas, liée à une hyperaction des obliques inférieurs. Significatif au-delà de 10 à 15 Δ d’écart.']
    ]
  },

  UE12: {
    prereq: [],
    mots: ['Rééducation orthoptique'],
    qr: [
      ['Qu’est-ce que le secret professionnel couvre exactement ?', 'Tout ce dont le professionnel a connaissance dans l’exercice : ce qu’on lui a dit, ce qu’il a vu, ce qu’il a compris ou déduit.'],
      ['Un orthoptiste peut-il agir sans prescription ?', 'Oui dans les cas prévus par le décret d’actes — dépistage, bilan visuel dans certaines conditions — mais la rééducation reste sur prescription médicale.'],
      ['Que doit contenir un consentement valable ?', 'Une information loyale, claire et appropriée, une capacité à décider, et l’absence de contrainte. Il est révocable à tout moment.'],
      ['À qui appartient le dossier du patient ?', 'Les informations appartiennent au patient, qui a un droit d’accès ; le support appartient au professionnel ou à l’établissement.'],
      ['Que faire si un parent demande le compte rendu d’un adolescent ?', 'Vérifier le droit d’accès du titulaire de l’autorité parentale, et respecter l’opposition éventuelle du mineur pour certains actes.']
    ]
  },

  UE16: {
    prereq: ['UE1', 'UE4'],
    mots: ['Cataracte', 'Glaucome', 'Pression intraoculaire', 'Rapport cup/disc', 'DMLA', 'Rétinopathie diabétique', 'Œdème maculaire', 'Uvéite', 'Kératocône', 'Fond d’œil', 'Métamorphopsies', 'Amsler (grille d’)', 'Leucocorie'],
    qr: [
      ['Comment reconnaît-on un œil rouge grave ?', 'Douleur profonde, baisse d’acuité, photophobie, cercle périkératique, anomalie pupillaire ou cornéenne. Une conjonctivite ne baisse pas l’acuité.'],
      ['Tableau d’une crise de fermeture de l’angle ?', 'Œil rouge très douloureux et dur, cornée trouble, mydriase peu réactive, halos, baisse d’acuité, nausées. Urgence.'],
      ['Qu’est-ce qui distingue les deux formes de DMLA ?', 'Atrophique : lente, drusen puis atrophie, pas de traitement curatif. Exsudative : néovaisseaux, baisse rapide, métamorphopsies, anti-VEGF.'],
      ['Évolution de la rétinopathie diabétique ?', 'Microanévrismes, hémorragies et exsudats, ischémie, néovaisseaux, puis hémorragie du vitré ou décollement tractionnel. L’œdème maculaire fait la baisse de vision.'],
      ['Signes d’un décollement de rétine ?', 'Myodésopsies, phosphènes, puis voile périphérique progressant vers le centre. Urgence chirurgicale.'],
      ['Pourquoi dépister l’uvéite dans l’arthrite juvénile idiopathique ?', 'Parce qu’elle est totalement silencieuse chez l’enfant : sans lampe à fente systématique, on la découvre au stade des complications.']
    ]
  },

  /* ---------------- Semestre 2 ---------------- */

  UE10: {
    prereq: ['UE4', 'UE5'],
    mots: ['Champ visuel', 'Périmétrie', 'Goldmann (périmètre de)', 'Isoptère', 'Scotome', 'OCT', 'Électrorétinogramme', 'PEV', 'Ishihara (test d’)', 'Farnsworth (test de)', 'Dyschromatopsie', 'Sensibilité aux contrastes'],
    qr: [
      ['Périmétrie statique ou cinétique : laquelle et quand ?', 'Statique automatisée pour le glaucome et le suivi quantitatif ; cinétique de Goldmann pour le neurologique, la périphérie et les patients peu coopérants.'],
      ['Quels indices de fiabilité lisez-vous avant d’interpréter un champ visuel ?', 'Pertes de fixation, faux positifs, faux négatifs. Sans eux, aucune interprétation n’est valable.'],
      ['Que mesure l’onde a et l’onde b de l’ERG ?', 'L’onde a les photorécepteurs, l’onde b les cellules bipolaires et de Müller.'],
      ['Qu’indique un allongement de la P100 aux PEV ?', 'Une atteinte démyélinisante ; une amplitude réduite oriente plutôt vers une atteinte axonale.'],
      ['Ishihara ou Farnsworth ?', 'Ishihara dépiste le congénital rouge-vert ; Farnsworth quantifie et donne l’axe, y compris bleu-jaune acquis.'],
      ['Étendue normale du champ visuel monoculaire ?', 'Temporal 90-100°, nasal 60-70°, supérieur 60°, inférieur 70-75°.']
    ]
  },

  UE11: {
    prereq: ['UE3', 'UE5', 'UE8', 'UE9'],
    mots: ['Cover test', 'Hétérophorie', 'PPC', 'Amplitudes de fusion', 'Réserves fusionnelles', 'Rapport AC/A', 'Sheard (critère de)', 'Percival (critère de)', 'Maddox (baguette de)', 'Worth (test de)', 'Bagolini (verres striés)', 'Lang (test de)', 'TNO (test)', 'Stéréoscopie', 'Synoptophore', 'Asthénopie', 'Flippers'],
    qr: [
      ['Dans quel ordre menez-vous un bilan orthoptique ?', 'Interrogatoire, acuités de loin et de près, réfraction, équilibre oculomoteur, vergences et accommodation, sensoriel, puis synthèse et conclusion.'],
      ['Norme du PPC et comment le mesure-t-on ?', 'Rupture ≤ 6-8 cm, recouvrement ≤ 10 cm. Cible accommodative approchée lentement, mesure répétée 3 à 5 fois pour dépister la fatigabilité.'],
      ['Amplitudes de fusion normales de près ?', 'Convergence 30-35 Δ, divergence 12-16 Δ.'],
      ['Énoncez le critère de Sheard.', 'La réserve opposée à la phorie doit valoir au moins le double de celle-ci. Sinon prisme = (2 × phorie − réserve) / 3.'],
      ['Comment interprétez-vous un test de Worth à 2 points rouges ?', 'Neutralisation de l’œil portant le verre vert.'],
      ['Que faut-il toujours noter avec une acuité ?', 'L’échelle, la distance, l’œil, avec ou sans correction, en isolé ou en ligne, et l’éclairage.'],
      ['Norme aux flippers ± 2,00 D ?', '≈ 11 cycles par minute en binoculaire, 8 en monoculaire.']
    ]
  },

  UE13: {
    prereq: [],
    mots: ['Film lacrymal', 'Fluorescéine', 'Uvéite'],
    qr: [
      ['Quel est le premier geste de prévention de la transmission croisée ?', 'La friction hydro-alcoolique des mains, avant et après chaque patient.'],
      ['Comment traite-t-on un verre d’examen entre deux patients ?', 'Nettoyage puis désinfection selon le protocole du service ; le matériel au contact de la cornée relève d’une désinfection de niveau intermédiaire au minimum.'],
      ['Que faire en cas d’accident d’exposition au sang ?', 'Laver, antiseptique, déclarer immédiatement, consulter dans l’heure pour évaluer une prophylaxie.'],
      ['Un collyre unidose entamé : pour combien de patients ?', 'Un seul, et pour une seule séance. Les flacons multidoses ne se partagent jamais entre patients.'],
      ['Qu’est-ce qu’un événement indésirable grave associé aux soins ?', 'Un événement inattendu, en lien avec les soins, entraînant un décès, une mise en jeu du pronostic vital, un déficit ou une prolongation d’hospitalisation. Il se déclare.']
    ]
  },

  UE14: {
    prereq: ['UE9'],
    mots: ['Paralysie du III', 'Paralysie du IV', 'Paralysie du VI', 'Bielschowsky (manœuvre de)', 'Parks (test des 3 pas de)', 'Lancaster (test de)', 'Duction forcée (test de)', 'Syndrome restrictif', 'Brown (syndrome de)', 'Duane (syndrome de)', 'Orbitopathie dysthyroïdienne', 'Torticolis oculaire', 'Comitance'],
    qr: [
      ['Les trois pas de Parks ?', 'Quel œil est le plus haut ; la déviation est-elle majorée en regard droit ou gauche ; est-elle majorée à l’inclinaison droite ou gauche.'],
      ['Torticolis d’une paralysie du IV droit ?', 'Tête inclinée sur l’épaule gauche, menton légèrement abaissé, visage tourné à gauche.'],
      ['Comment distinguez-vous une paralysie d’une restriction ?', 'Paralysie : déviation secondaire supérieure à la primaire, duction forcée libre. Restriction : duction forcée résistante, pas de majoration secondaire, PIO qui monte dans le regard contraint.'],
      ['Signes du syndrome de Duane ?', 'Limitation de l’abduction, rétrécissement de la fente palpébrale et rétraction du globe en adduction.'],
      ['Ordre d’atteinte musculaire dans l’orbitopathie dysthyroïdienne ?', 'Droit inférieur, puis médial, puis supérieur, puis latéral.'],
      ['Une paralysie du VI localise-t-elle la lésion ?', 'Non : elle peut n’être qu’un signe d’hypertension intracrânienne, le nerf étant étiré sur son long trajet.']
    ]
  },

  UE15: {
    prereq: ['UE11', 'UE14'],
    mots: ['Rééducation orthoptique', 'Insuffisance de convergence', 'Excès de convergence', 'Amplitudes de fusion', 'Brock (corde de)', 'Flippers', 'Diplopie physiologique', 'Neutralisation', 'Prisme', 'Asthénopie', 'Insuffisance accommodative'],
    qr: [
      ['Signes d’une insuffisance de convergence ?', 'PPC au-delà de 10 cm, exophorie de près décompensée, convergence fusionnelle faible, AC/A bas, asthénopie et perte de la ligne à la lecture.'],
      ['Étapes d’une rééducation de la convergence ?', 'Prise de conscience de la diplopie physiologique, convergence volontaire, amplitudes aux prismes, sauts de vergence, automatisation en lecture.'],
      ['Que faire quand la neutralisation bloque tout exercice ?', 'Commencer par un travail antisuppressif : anaglyphes, verres striés, synoptophore, diplopie contrôlée pour rendre l’image supprimée consciente.'],
      ['Quelle composante de la convergence se rééduque réellement ?', 'La composante fusionnelle. Les autres se modifient par la correction optique ou les prismes.'],
      ['Quand une rééducation est-elle vouée à l’échec ?', 'Sans correction optique adaptée, sur une déviation paralytique ou restrictive évolutive, ou sans adhésion du patient aux exercices intercalaires.'],
      ['Quel est le risque d’un prisme de repos prescrit trop tôt ?', 'Il soulage sans rééduquer, et peut réduire les réserves fusionnelles.']
    ]
  },

  UE17: {
    prereq: ['UE10', 'UE16'],
    mots: ['OCT', 'Fond d’œil', 'Champ visuel', 'Glaucome', 'Rapport cup/disc', 'Bjerrum (scotome de)', 'Ressaut nasal', 'DMLA', 'Œdème maculaire', 'Rétinopathie diabétique', 'Tonométrie', 'Goldmann (tonomètre de)'],
    qr: [
      ['Déficits caractéristiques du champ visuel glaucomateux ?', 'Ressaut nasal, scotome arciforme de Bjerrum, scotome de Seidel, déficit altitudinal ; l’épargne centrale est tardive.'],
      ['Pourquoi corriger la PIO de Goldmann ?', 'Parce qu’elle dépend de l’épaisseur cornéenne centrale : une cornée fine sous-estime la pression, une cornée épaisse la surestime.'],
      ['Que mesure l’OCT dans le suivi du glaucome ?', 'L’épaisseur des fibres optiques péripapillaires et le complexe ganglionnaire maculaire.'],
      ['Comment interprétez-vous un rapport cup/disc de 0,6 ?', 'Suspect, mais à rapporter à la taille de la papille et à l’aspect de l’anneau neurorétinien selon la règle ISNT — jamais isolément.'],
      ['Quel examen devant des métamorphopsies ?', 'Grille d’Amsler puis OCT maculaire : on cherche une DMLA exsudative, une membrane épirétinienne ou un œdème.'],
      ['Rythme de dépistage de la rétinopathie diabétique ?', 'Annuel par rétinophotographie, plus rapproché selon le stade et l’équilibre glycémique.']
    ]
  },

  UE18: {
    prereq: [],
    mots: ['Troubles neurovisuels', 'Basse vision', 'Amblyopie'],
    qr: [
      ['Quelles sont les grandes étapes du développement de l’enfant utiles au bilan ?', 'Poursuite et sourire réponse vers 2-3 mois, préhension vers 5-6 mois, marche vers 12-18 mois, langage structuré vers 3 ans : elles conditionnent les tests utilisables.'],
      ['Qu’est-ce que le travail de deuil dans l’annonce d’une déficience visuelle ?', 'Une succession non linéaire : sidération, déni, colère, marchandage, dépression, acceptation. On ne saute pas les étapes du patient.'],
      ['Pourquoi un adolescent refuse-t-il une occlusion ?', 'Parce que le coût social immédiat dépasse un bénéfice différé et abstrait : la négociation porte sur le rythme et le contexte, pas sur le principe.'],
      ['Qu’est-ce qu’un trouble neurodéveloppemental ?', 'Un trouble durable des acquisitions apparaissant au cours du développement — TDAH, troubles des apprentissages, TSA — souvent associés entre eux.'],
      ['Quelle attitude devant un patient dont la plainte dépasse les signes ?', 'Ne pas conclure à la simulation : documenter objectivement, chercher une cause fonctionnelle, et adresser sans juger.']
    ]
  },

  UE19: {
    prereq: ['UE16'],
    mots: ['Cyclopentolate', 'Atropine', 'Tropicamide', 'Cycloplégie', 'Mydriase', 'Myosis', 'Adie (pupille d’)', 'Pression intraoculaire'],
    qr: [
      ['Quel cycloplégique pour réfracter un enfant, et selon quel protocole ?', 'Cyclopentolate : 0,5 % avant 1 an, 1 % ensuite, 3 gouttes à 5 min d’intervalle, réfraction à 45 min.'],
      ['Quand préférer l’atropine ?', 'Réfraction difficile, hypermétropie forte, ésotropie accommodative, enfant très pigmenté. 0,3 % avant 1 an, 0,5 % ensuite, 2 gouttes par jour pendant 3 à 5 jours.'],
      ['Pourquoi le tropicamide ne suffit-il pas pour une réfraction d’enfant ?', 'Son pouvoir cycloplégique est faible : il dilate bien mais laisse passer une part de l’hypermétropie latente.'],
      ['Effets indésirables de l’atropine à surveiller ?', 'Rougeur du visage, fièvre, sécheresse buccale, agitation ou somnolence, tachycardie.'],
      ['Chez qui un mydriatique est-il dangereux ?', 'Chez un sujet à angle irido-cornéen étroit : risque de crise aiguë par fermeture de l’angle.'],
      ['Quel usage diagnostique de la pilocarpine diluée ?', 'Elle contracte une pupille d’Adie par hypersensibilité de dénervation, mais pas une mydriase du III récente.']
    ]
  },

  /* ---------------- Semestre 3 ---------------- */

  UE24: {
    prereq: ['UE5', 'UE9'],
    mots: ['Amblyopie', 'Période sensible', 'Anisométropie', 'Crowding', 'Fixation excentrique', 'Visuscope', 'Strabisme sensoriel', 'Leucocorie', 'Brückner (test de)', 'Regard préférentiel', 'Emmétropisation'],
    qr: [
      ['Définissez l’amblyopie.', 'Une baisse d’acuité par trouble du développement visuel, sans lésion organique proportionnelle à la baisse. Le mécanisme est cortical.'],
      ['Les trois mécanismes de l’amblyopie fonctionnelle ?', 'Strabique, anisométropique ou réfractive bilatérale forte, et de privation.'],
      ['Quand se situe la période sensible ?', 'Maximale de 0 à 2 ans, décroissante jusqu’à 8-10 ans.'],
      ['Quelles amétropies sont amblyogènes ?', 'Hypermétropie forte, astigmatisme ≥ 1,50 D, anisométropie ≥ 1,00-1,50 D, myopie forte.'],
      ['Que faire devant tout strabisme unilatéral de l’enfant ?', 'Un fond d’œil, pour éliminer un strabisme sensoriel — rétinoblastome, cataracte, cicatrice maculaire.'],
      ['Comment cherche-t-on une fixation excentrique ?', 'Au visuscope, œil par œil : on repère la mire étoilée par rapport à la fovéa.']
    ]
  },

  UE25: {
    prereq: ['UE11', 'UE24'],
    mots: ['Occlusion', 'Filtres de Bangerter', 'Pénalisation optique', 'Atropine', 'Amblyopie', 'Période sensible'],
    qr: [
      ['Quel est l’ordre du traitement de l’amblyopie ?', 'Correction optique totale d’abord, portée 4 à 6 semaines, puis pénalisation ou occlusion. Jamais l’inverse.'],
      ['Doses d’occlusion actuelles ?', '2 h par jour si amblyopie modérée, 6 h par jour si sévère.'],
      ['Quelles alternatives à l’occlusion adhésive ?', 'Filtres de Bangerter, pénalisation optique par surcorrection en plus, atropine sur le bon œil.'],
      ['Quel risque de l’occlusion, et quelle surveillance ?', 'L’amblyopie à bascule de l’œil occlus : contrôle de l’acuité des deux yeux à chaque consultation et sevrage progressif.'],
      ['Que faire si l’acuité stagne malgré une occlusion bien conduite ?', 'Vérifier l’observance réelle, la correction optique, puis rechercher une cause organique passée inaperçue.'],
      ['Peut-on traiter une amblyopie après 10 ans ?', 'Une récupération partielle reste possible, moindre et plus lente : l’âge n’est pas une contre-indication absolue.']
    ]
  },

  UE26: {
    prereq: ['UE5', 'UE16'],
    mots: ['Basse vision', 'Grossissement', 'Loupe', 'DMLA', 'Rétinopathie pigmentaire', 'Glaucome', 'Sensibilité aux contrastes', 'Champ visuel', 'Scotome'],
    qr: [
      ['Définitions OMS de la malvoyance et de la cécité ?', 'Malvoyance : acuité < 3/10 au meilleur œil corrigé, ou champ visuel < 20°. Cécité : acuité < 1/20.'],
      ['Grossissement commercial d’une loupe de +12 D ?', 'G = P / 4 = 3 ×.'],
      ['Quel compromis impose un fort grossissement ?', 'La distance de travail et le champ perçu diminuent : on choisit l’aide sur la tâche visée, pas sur l’acuité seule.'],
      ['Qu’est-ce que la fixation excentrée en basse vision ?', 'L’usage volontaire d’une zone rétinienne saine à côté d’un scotome central. Elle s’apprend.'],
      ['Quels leviers non optiques ?', 'Éclairage dirigé, renforcement des contrastes, agrandissement des caractères, filtres anti-éblouissement, organisation de l’espace, aides électroniques et vocales.'],
      ['Pourquoi la sensibilité aux contrastes compte-t-elle plus que l’acuité en basse vision ?', 'Parce qu’elle prédit mieux la gêne réelle en vie quotidienne : déplacements, visages, marches d’escalier.']
    ]
  },

  UE28: {
    prereq: [],
    mots: [],
    qr: [
      ['Qu’est-ce qu’une question de recherche au format PICO ?', 'Population, Intervention, Comparateur, Outcome — le critère de jugement. Elle guide l’équation de recherche.'],
      ['Quel niveau de preuve pour un essai randomisé contrôlé ?', 'Le plus élevé pour une question thérapeutique, au-dessus des études de cohorte, cas-témoins et séries de cas.'],
      ['Que vérifie-t-on avant de citer un article ?', 'La revue et sa relecture par les pairs, la date, le conflit d’intérêts, l’effectif, la méthode, et si les conclusions dépassent les résultats.'],
      ['Comment cite-t-on correctement ?', 'Norme constante sur tout le document — Vancouver ou APA — avec appel dans le texte et référence complète en bibliographie.'],
      ['Qu’est-ce que le plagiat, exactement ?', 'Reprendre le texte ou l’idée d’autrui sans l’attribuer. Une traduction non citée en est aussi.']
    ]
  },

  UE32: {
    prereq: ['UE18'],
    mots: ['Rééducation orthoptique', 'Occlusion', 'Amsler (grille d’)'],
    qr: [
      ['Quelles sont les quatre étapes de l’éducation thérapeutique ?', 'Diagnostic éducatif, objectifs partagés, séances d’acquisition de compétences, évaluation.'],
      ['Comment vérifie-t-on qu’un patient a compris ?', 'En lui faisant reformuler. Jamais en demandant « vous avez compris ? ».'],
      ['Quelle différence entre information et éducation thérapeutique ?', 'L’information transmet ; l’éducation thérapeutique fait acquérir des compétences d’auto-soins et d’adaptation, et les évalue.'],
      ['Quelle proportion d’une consultation un patient retient-il ?', 'Environ 20 à 50 % — d’où la remise systématique d’un écrit simple.'],
      ['Que faire face à un parent en colère ?', 'Ne pas argumenter contre l’émotion : nommer ce qui se passe, puis revenir à des objectifs concrets et négociables.']
    ]
  },

  UE37: {
    prereq: ['UE11', 'UE15'],
    mots: ['Rééducation orthoptique', 'Asthénopie', 'Insuffisance de convergence', 'PPC'],
    qr: [
      ['Qu’est-ce qu’un diagnostic orthoptique ?', 'La description d’un dysfonctionnement et de son retentissement — pas un diagnostic médical, et pas une liste de chiffres.'],
      ['Que doit contenir un projet de soins ?', 'Objectifs mesurables, moyens, rythme, durée prévisionnelle, critères de réévaluation et critères d’arrêt.'],
      ['À quel rythme réévalue-t-on une rééducation ?', 'Toutes les 8 à 10 séances.'],
      ['Comment adapte-t-on un compte rendu à son destinataire ?', 'Le prescripteur veut une conclusion et une proposition ; l’enseignant, des conséquences concrètes en classe ; le patient, ce qu’il doit faire.'],
      ['Pourquoi un bilan n’est-il pas une liste qu’on déroule ?', 'Parce que chaque test doit répondre à une hypothèse née de la plainte : c’est ce qui distingue un professionnel d’un exécutant.']
    ]
  },

  /* ---------------- Semestre 4 ---------------- */

  UE21: {
    prereq: [],
    mots: [],
    qr: [
      ['Que signifie un p < 0,05 ?', 'Que sous l’hypothèse nulle, une différence au moins aussi grande aurait moins de 5 % de chances d’être observée. Ce n’est ni la probabilité que l’hypothèse soit fausse, ni une mesure de l’ampleur de l’effet.'],
      ['Différence entre sensibilité et spécificité ?', 'La sensibilité est la proportion de malades correctement dépistés ; la spécificité, la proportion de non-malades correctement écartés.'],
      ['Qu’est-ce que la valeur prédictive positive dépend-elle ?', 'De la prévalence : à test identique, elle chute quand la maladie est rare.'],
      ['Moyenne ou médiane ?', 'La médiane dès que la distribution est asymétrique ou comporte des valeurs extrêmes.'],
      ['Qu’est-ce qu’un facteur de confusion ?', 'Une variable liée à la fois à l’exposition et au résultat, qui crée une association trompeuse si on ne l’ajuste pas.']
    ]
  },

  UE22: {
    prereq: ['UE4', 'UE7', 'UE16'],
    mots: ['Voies optiques', 'Chiasma optique', 'Hémianopsie', 'Quadranopsie', 'Nerf optique', 'Névrite optique', 'DPAR', 'Papille', 'Anisocorie', 'Mydriase', 'Myosis', 'Horner (syndrome de Claude Bernard-)', 'Adie (pupille d’)', 'Paralysie du III', 'Ophtalmoplégie internucléaire', 'Nystagmus'],
    qr: [
      ['Que signifie une hémianopsie bitemporale ?', 'Une compression chiasmatique médiane — adénome hypophysaire typiquement.'],
      ['Quadranopsie supérieure homonyme : où est la lésion ?', 'Sur la boucle de Meyer, dans le lobe temporal.'],
      ['Qu’est-ce qu’un DPAR et que traduit-il ?', 'Une dilatation paradoxale à l’éclairement alterné, signant une neuropathie optique unilatérale ou asymétrique.'],
      ['Anisocorie majorée à l’obscurité : quel côté est pathologique ?', 'La petite pupille — atteinte sympathique, syndrome de Claude Bernard-Horner.'],
      ['Quand une mydriase est-elle une urgence ?', 'Mydriase aréactive avec ptôsis et douleur : compression du III par un anévrisme.'],
      ['Signes d’une ophtalmoplégie internucléaire ?', 'Déficit d’adduction dans le regard latéral, nystagmus de l’œil abducteur, convergence conservée. Bilatérale chez le sujet jeune : sclérose en plaques.'],
      ['Tableau d’une névrite optique rétrobulbaire ?', 'Baisse rapide, douleur à la mobilisation, dyschromatopsie rouge-vert, DPAR, scotome central, fond d’œil normal.']
    ]
  },

  UE23: {
    prereq: ['UE15', 'UE22'],
    mots: ['Prisme', 'Lancaster (test de)', 'Diplopie', 'Hémianopsie', 'Troubles neurovisuels', 'Rééducation orthoptique', 'Saccade', 'Poursuite oculaire', 'Torticolis oculaire'],
    qr: [
      ['Quel est le premier objectif devant une diplopie récente ?', 'Le confort : occlusion ou prisme de soulagement, en attendant la récupération spontanée, qui s’évalue sur 6 à 12 mois.'],
      ['Comment rééduque-t-on une hémianopsie latérale homonyme ?', 'Par des stratégies d’exploration : balayage systématique vers le côté aveugle, ancrage du regard, adaptation des supports de lecture.'],
      ['Quand envisage-t-on la chirurgie après une paralysie oculomotrice ?', 'Après stabilisation de l’angle, généralement au-delà de 6 à 12 mois.'],
      ['Que suit-on au Lancaster dans une paralysie ?', 'L’évolution du schéma dans les 9 positions : la récupération se lit sur la réduction de l’écart entre les deux tracés.'],
      ['Quel signe fait craindre une aggravation neurologique ?', 'Une déviation qui change de nature ou s’accompagne de nouveaux signes : c’est un motif de réadresser en urgence.']
    ]
  },

  UE27: {
    prereq: ['UE11', 'UE26'],
    mots: ['Basse vision', 'Grossissement', 'Loupe', 'Sensibilité aux contrastes', 'Champ visuel', 'Scotome', 'DMLA', 'Addition'],
    qr: [
      ['Que contient un bilan de basse vision ?', 'Acuités de loin et de près en échelles adaptées, sensibilité aux contrastes, champ visuel, éblouissement, fixation excentrée — et surtout les besoins fonctionnels réels.'],
      ['Comment détermine-t-on le grossissement nécessaire ?', 'À partir de l’acuité de près mesurée et de la taille de caractère visée : rapport entre les deux, majoré d’une marge de confort.'],
      ['Pourquoi commencer par l’éclairage ?', 'Parce que c’est le levier le moins coûteux et souvent le plus efficace : beaucoup de patients gagnent une ligne avec un éclairage dirigé.'],
      ['Comment apprend-on la fixation excentrée ?', 'On repère la zone de meilleure vision, on l’entraîne sur des cibles simples, puis on l’automatise en lecture.'],
      ['Quels relais proposer ?', 'Ophtalmologiste, instructeur en locomotion, ergothérapeute, associations, MDPH selon le retentissement.']
    ]
  },

  /* ---------------- Semestre 5 ---------------- */

  UE29: {
    prereq: ['UE8', 'UE11'],
    mots: ['DEM (test)', 'Saccade', 'Insuffisance de convergence', 'Asthénopie', 'Flippers', 'Insuffisance accommodative', 'Rééducation orthoptique'],
    qr: [
      ['Quelles plaintes évoquent un trouble visuel dans les apprentissages ?', 'Perte de la ligne, saut de mots, fatigue en lecture, céphalées de fin de journée, refus de la lecture — pas une baisse d’acuité.'],
      ['Que sépare le test DEM ?', 'Une lenteur de dénomination d’un vrai trouble des saccades de lecture, par comparaison des temps en colonnes et en lignes.'],
      ['Un trouble visuel explique-t-il une dyslexie ?', 'Non. La dyslexie est un trouble phonologique du langage écrit ; un trouble visuel peut l’aggraver mais ne la cause pas.'],
      ['Que rééduque-t-on dans ce cadre ?', 'Les vergences, la souplesse accommodative, les saccades de lecture, et les stratégies d’exploration — pas la lecture elle-même.'],
      ['Avec qui travaille-t-on ?', 'Orthophoniste, enseignant, médecin scolaire, psychologue : le bilan orthoptique est une pièce d’un dossier, pas un diagnostic global.']
    ]
  },

  UE30: {
    prereq: ['UE22', 'UE29'],
    mots: ['Troubles neurovisuels', 'Agnosie visuelle', 'Saccade', 'Poursuite oculaire', 'Nystagmus', 'Champ visuel', 'Hémianopsie'],
    qr: [
      ['Qu’est-ce qu’un trouble neurovisuel ?', 'Une atteinte des fonctions visuelles d’origine cérébrale, à œil sain : exploration désorganisée, coordination œil-main, difficultés visuo-spatiales, agnosie.'],
      ['Quels enfants sont à risque ?', 'Grands prématurés, encéphalopathies, lésions cérébrales acquises, syndromes génétiques.'],
      ['Que sépare la voie dorsale de la voie ventrale ?', 'La dorsale, occipito-pariétale, traite le « où » et l’action ; la ventrale, occipito-temporale, le « quoi » et la reconnaissance.'],
      ['Quel lien entre vision et équilibre ?', 'La vision est l’une des trois entrées de la posture avec le vestibule et la proprioception : un conflit entre elles donne instabilité et vertiges.'],
      ['Que teste-t-on devant une plainte d’instabilité ?', 'Le réflexe vestibulo-oculaire, les poursuites et saccades, la stabilité de la fixation, et la tolérance aux stimulations visuelles dynamiques.']
    ]
  },

  UE31: {
    prereq: ['UE5', 'UE11'],
    mots: ['Regard préférentiel', 'Brückner (test de)', 'Épicanthus', 'Pseudo-strabisme', 'Amblyopie', 'Asthénopie', 'BUT', 'Emmétropisation'],
    qr: [
      ['Signes d’appel visuels chez le nourrisson ?', 'Absence de poursuite ou de sourire réponse, errance du regard, nystagmus, strabisme après 4 mois, leucocorie, signe digito-oculaire.'],
      ['Quel est l’intérêt du dépistage de 3-4 ans ?', 'Repérer les amblyopies unilatérales silencieuses avant la fin de la période sensible, quand l’enfant peut enfin donner une acuité fiable par œil.'],
      ['Comment reconnaît-on un pseudo-strabisme ?', 'Reflets cornéens symétriques et cover test négatif, malgré l’apparence — épicanthus, télécanthus, angle kappa.'],
      ['Quels conseils d’ergonomie sur écran ?', 'Distance de 50 à 60 cm, écran légèrement sous les yeux, éclairage sans reflet, règle du 20-20-20, clignements et larmes artificielles si le BUT est court.'],
      ['Que dépiste-t-on en médecine du travail sur poste écran ?', 'Amétropie non corrigée, presbytie débutante mal compensée, hétérophorie décompensée, sécheresse oculaire.']
    ]
  },

  UE33: {
    prereq: ['UE10', 'UE17'],
    mots: ['OCT', 'Topographie cornéenne', 'Fond d’œil', 'Champ visuel', 'Kératométrie'],
    qr: [
      ['Que montre une OCT-angiographie de plus qu’une OCT classique ?', 'Les flux vasculaires rétiniens et choroïdiens, sans injection de colorant.'],
      ['Quel examen pour dépister un kératocône débutant ?', 'La topographie, et mieux la tomographie qui donne les deux faces et la carte d’épaisseur.'],
      ['Que compare-t-on dans un suivi OCT ?', 'Toujours la même carte, le même appareil et la même zone : un changement d’appareil interdit la comparaison directe.'],
      ['Quelles précautions pour la transmission d’images de patients ?', 'Anonymisation, messagerie sécurisée de santé, consentement pour toute utilisation pédagogique ou publication.'],
      ['Qu’est-ce que la télé-expertise ?', 'L’avis d’un professionnel sollicité à distance sur un dossier — elle engage sa responsabilité comme une consultation.']
    ]
  },

  UE41: {
    prereq: [],
    mots: [],
    qr: [
      ['Quel est le premier geste devant une personne inconsciente qui respire ?', 'La position latérale de sécurité, après avoir libéré les voies aériennes et alerté.'],
      ['Numéros d’urgence utiles ?', '15 SAMU, 18 pompiers, 112 numéro européen, 114 pour les personnes sourdes ou malentendantes.'],
      ['Que faire devant une projection de produit chimique dans l’œil ?', 'Rinçage abondant immédiat et prolongé, au moins 15 minutes, avant tout transfert — le temps de rinçage fait le pronostic.'],
      ['Fréquence et profondeur du massage cardiaque chez l’adulte ?', '100 à 120 compressions par minute, 5 à 6 cm de profondeur.'],
      ['Que faire devant une hémorragie externe ?', 'Compression directe, allongement de la victime, alerte, et maintien de la compression jusqu’aux secours.']
    ]
  },

  /* ---------------- Semestre 6 ---------------- */

  UE34: {
    prereq: ['UE12'],
    mots: [],
    qr: [
      ['Quels modes d’exercice sont possibles pour un orthoptiste ?', 'Salarié hospitalier, salarié en cabinet d’ophtalmologie, libéral conventionné, mixte, ou exercice en centre de santé.'],
      ['Qu’est-ce qu’un protocole organisationnel ?', 'Un cadre permettant la délégation d’actes entre ophtalmologiste et orthoptiste, formalisé, avec critères d’inclusion et de recours au médecin.'],
      ['Que doit contenir une feuille de soins d’acte orthoptique ?', 'L’identification du patient et du praticien, la date, la cotation de l’acte et la référence à la prescription.'],
      ['Quelle obligation de formation continue ?', 'Le développement professionnel continu, obligatoire et triennal.'],
      ['Qu’est-ce que la responsabilité civile professionnelle couvre ?', 'Les dommages causés au patient dans l’exercice ; elle est obligatoire et distincte de la responsabilité pénale, qui reste personnelle.']
    ]
  },

  UE35: {
    prereq: ['UE16', 'UE17'],
    mots: ['Glaucome', 'Pression intraoculaire', 'Rétinopathie diabétique', 'DMLA', 'Fond d’œil', 'Champ visuel', 'OCT', 'Amsler (grille d’)', 'Cataracte'],
    qr: [
      ['Quels critères font un bon programme de dépistage ?', 'Maladie fréquente et grave, phase latente détectable, test simple et acceptable, traitement efficace au stade précoce, bénéfice démontré.'],
      ['Pourquoi le glaucome se prête-t-il au dépistage ?', 'Parce qu’il est longtemps asymptomatique, que la perte est irréversible et que le traitement précoce ralentit l’évolution.'],
      ['Quel rôle de l’orthoptiste dans le dépistage en cabinet ?', 'Réfraction, acuités, PIO, champ visuel, rétinophotographie, OCT — la synthèse et le diagnostic restent médicaux.'],
      ['Rythme de suivi d’un diabétique sans rétinopathie ?', 'Une rétinophotographie par an ; plus rapproché dès l’apparition de lésions ou en cas de déséquilibre.'],
      ['Que surveille-t-on après chirurgie de la cataracte ?', 'Acuité, inflammation, PIO, et à distance l’opacification capsulaire postérieure et l’œdème maculaire.']
    ]
  },

  UE36: {
    prereq: ['UE9', 'UE11', 'UE14'],
    mots: ['Cover test', 'Prisme', 'Hirschberg (test de)', 'Krimsky (test de)', 'Tillaux (spirale de)', 'Comitance', 'Syndrome alphabétique', 'Kestenbaum (opération de)', 'DVD'],
    qr: [
      ['Que vérifie-t-on avant d’opérer un strabisme ?', 'Un angle stable mesuré à plusieurs reprises, une amblyopie traitée, une correction optique optimale, et l’absence de cause restrictive ou paralytique évolutive.'],
      ['Quelle mesure sert de référence pour l’indication chirurgicale ?', 'Le cover test prismatique alterné : la déviation totale, fusion rompue.'],
      ['Que fait un recul musculaire ?', 'Il déplace l’insertion vers l’origine et affaiblit le muscle ; la résection ou le plissement le renforcent.'],
      ['Combien de dioptries par millimètre sur un droit horizontal ?', 'Ordre de grandeur : 2 à 3 Δ par mm — un ordre de grandeur, jamais une règle absolue.'],
      ['Principe de l’opération de Kestenbaum ?', 'Déplacer les yeux vers le côté du torticolis pour ramener la zone de blocage du nystagmus en position primaire.'],
      ['Quel bilan orthoptique après chirurgie ?', 'Angle résiduel, motilité, sensoriel et torticolis, comparés au préopératoire, à distance de l’œdème.']
    ]
  },

  UE38: {
    prereq: ['UE21', 'UE28'],
    mots: [],
    qr: [
      ['Comment formule-t-on une problématique de mémoire ?', 'Une question précise, délimitée, à laquelle on peut répondre avec les moyens disponibles — pas un thème.'],
      ['Quelles parties structurent un mémoire ?', 'Introduction, revue de littérature, méthode, résultats, discussion, conclusion — la structure IMRaD.'],
      ['Que met-on dans la discussion ?', 'La confrontation aux données de la littérature, les limites de l’étude, et ce que les résultats permettent — ou non — de conclure.'],
      ['Faut-il un avis éthique ?', 'Dès que des données de patients sont recueillies : information, consentement, anonymisation, et déclaration selon le cadre applicable.'],
      ['Quelle erreur de soutenance revient le plus ?', 'Dépasser le temps et lire ses diapositives : on prépare un propos, pas une lecture.']
    ]
  },

  UE39: {
    prereq: ['UE34'],
    mots: [],
    qr: [
      ['Avec quels professionnels l’orthoptiste coopère-t-il le plus ?', 'Ophtalmologiste, opticien, orthophoniste, ergothérapeute, psychomotricien, enseignant, médecin scolaire et du travail.'],
      ['Qu’est-ce que le secret partagé ?', 'L’échange d’informations strictement nécessaires à la prise en charge, entre professionnels y participant, avec information du patient.'],
      ['Que contient une transmission utile ?', 'Ce qui change quelque chose pour le destinataire : conclusion, retentissement, proposition — pas la totalité du bilan.'],
      ['Qu’est-ce qu’un parcours de soins coordonné ?', 'L’organisation des interventions autour du patient, avec un référent identifié, pour éviter ruptures et redondances.'],
      ['Comment gère-t-on un désaccord entre professionnels ?', 'En le traitant entre professionnels, jamais devant le patient, et en revenant aux données objectives du dossier.']
    ]
  },

  UE40: {
    prereq: ['UE34', 'UE39'],
    mots: [],
    qr: [
      ['Quelles sont les étapes de l’encadrement d’un stagiaire ?', 'Accueil et objectifs, observation, participation guidée, autonomie supervisée, évaluation formative puis certificative.'],
      ['Quelle différence entre évaluation formative et certificative ?', 'La formative accompagne et corrige en cours de route ; la certificative valide un niveau atteint à un moment donné.'],
      ['Comment formule-t-on un retour utile ?', 'Sur des faits observables et non sur la personne, précis, en équilibrant ce qui fonctionne et ce qui doit changer, avec une piste concrète.'],
      ['Qu’est-ce qu’un objectif de stage bien écrit ?', 'Un comportement observable, dans un contexte donné, avec un critère de réussite.'],
      ['Quelle posture face à un stagiaire en difficulté ?', 'Nommer tôt et précisément, tracer, proposer un plan de progression, et alerter l’institut avant l’échec.']
    ]
  }
};

/* Contrôle d'intégrité, appelé à la main depuis la console :
   renvoie les renvois de vocabulaire et les prérequis qui ne
   pointent sur rien. */
window.UE_EXTRA_CHECK = function () {
  var out = { motsInconnus: [], prereqInconnus: [], ueSansExtra: [] };
  var terms = {};
  (window.GLOSSARY || []).forEach(function (g) { terms[g.t] = true; });
  var codes = {};
  (window.CURRICULUM || []).forEach(function (s) {
    s.ues.forEach(function (u) { codes[u.code] = true; });
  });
  Object.keys(window.UE_EXTRA).forEach(function (k) {
    var e = window.UE_EXTRA[k];
    (e.mots || []).forEach(function (m) { if (!terms[m]) out.motsInconnus.push(k + ' → ' + m); });
    (e.prereq || []).forEach(function (p) { if (!codes[p]) out.prereqInconnus.push(k + ' → ' + p); });
  });
  Object.keys(codes).forEach(function (c) {
    if (c === 'UE6' || c === 'UE libre') return;
    if (!window.UE_EXTRA[c]) out.ueSansExtra.push(c);
  });
  return out;
};
