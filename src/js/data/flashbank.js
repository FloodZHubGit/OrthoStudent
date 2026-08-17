/* ============================================================
   Fiches mémo (répétition espacée)
   ------------------------------------------------------------
   Les identifiants sont STABLES : la progression de l'étudiant
   (les cinq boîtes de Leitner) y est rattachée. On peut renommer
   un paquet ou reformuler une fiche, jamais changer son id.
   Champs : id, deck, f (question), b (réponse), hint (facultatif).
   ============================================================ */
window.FLASHCARDS = [

  /* ============================================================
     Chiffres clés
     ============================================================ */
  { id: 'f01', deck: 'Chiffres clés', f: 'Longueur axiale d’un œil emmétrope ?', b: '≈ 24 mm — et 1 mm ≈ 3 D de réfraction.' },
  { id: 'f02', deck: 'Chiffres clés', f: 'Puissance totale de l’œil ? Répartition ?', b: '≈ +60 D — cornée +43 D, cristallin +20 D (au repos).' },
  { id: 'f03', deck: 'Chiffres clés', f: 'Valeur angulaire de 1 dioptrie prismatique ?', b: '≈ 0,57° (Δ = 100 × tan θ). Donc 2 Δ ≈ 1°.' },
  { id: 'f04', deck: 'Chiffres clés', f: 'Hirschberg : 1 mm de décentrement du reflet = ?', b: '≈ 7° ≈ 15 Δ.' },
  { id: 'f05', deck: 'Chiffres clés', f: 'PIO normale ?', b: '10 à 21 mmHg (moyenne 15). Variation nycthémérale de 3 à 5 mmHg.' },
  { id: 'f06', deck: 'Chiffres clés', f: 'Rapport cup/disc normal ?', b: '≤ 0,3–0,4. Suspect ≥ 0,5 ou asymétrie > 0,2 entre les deux yeux.' },
  { id: 'f07', deck: 'Chiffres clés', f: 'Diamètre de la papille ? Distance papille-macula ?', b: '≈ 1,5 mm ; macula à 2 diamètres papillaires (≈ 4 mm) en temporal.' },
  { id: 'f08', deck: 'Chiffres clés', f: 'Norme du BUT et du test de Schirmer ?', b: 'BUT > 10 s ; Schirmer > 10 mm en 5 min.' },
  { id: 'f09', deck: 'Chiffres clés', f: 'Norme du PPC ?', b: 'Rupture ≤ 6–8 cm, recouvrement ≤ 10 cm. Insuffisance de convergence au-delà.' },
  { id: 'f10', deck: 'Chiffres clés', f: 'Norme du rapport AC/A ?', b: '3 à 5 Δ/D.' },
  { id: 'f11', deck: 'Chiffres clés', f: 'Stéréo-acuité normale de l’adulte ?', b: '≤ 60 secondes d’arc (TNO jusqu’à 15″).' },
  { id: 'f12', deck: 'Chiffres clés', f: 'Hauteur d’un optotype 10/10 à 5 m ?', b: '≈ 7,3 mm (5 minutes d’arc au total, détail de 1 minute).' },
  { id: 'ck13', deck: 'Chiffres clés', f: 'Amplitudes de fusion normales de loin ?', b: 'Convergence 15–20 Δ, divergence 6–8 Δ, vertical 2–3 Δ.' },
  { id: 'ck14', deck: 'Chiffres clés', f: 'Amplitudes de fusion normales de près ?', b: 'Convergence 30–35 Δ, divergence 12–16 Δ.' },
  { id: 'ck15', deck: 'Chiffres clés', f: 'Exophorie physiologique de loin ? de près ?', b: 'Jusqu’à ≈ 2 Δ de loin, jusqu’à ≈ 6 Δ de près.' },
  { id: 'ck16', deck: 'Chiffres clés', f: 'Distance interpupillaire moyenne, de loin et de près ?', b: 'Adulte 60–66 mm de loin, 3 à 4 mm de moins de près. Enfant 50–58 mm.' },
  { id: 'ck17', deck: 'Chiffres clés', f: 'Épaisseur cornéenne centrale ? Diamètre cornéen ?', b: '≈ 540 µm ; Ø ≈ 11,5 mm horizontal.' },
  { id: 'ck18', deck: 'Chiffres clés', f: 'Rayon de courbure cornéen moyen ?', b: '≈ 7,8 mm, soit ≈ 43 D.' },
  { id: 'ck19', deck: 'Chiffres clés', f: 'Étendue du champ visuel monoculaire ?', b: 'Temporal 90–100°, nasal 60–70°, supérieur 60°, inférieur 70–75°.' },
  { id: 'ck20', deck: 'Chiffres clés', f: 'Où se projette la tache aveugle de Mariotte ?', b: 'À ≈ 15° en temporal du point de fixation, sur ≈ 5° de large.' },
  { id: 'ck21', deck: 'Chiffres clés', f: 'Nombre de cônes et de bâtonnets par rétine ?', b: '≈ 6 millions de cônes, ≈ 120 millions de bâtonnets. ≈ 1,2 million de fibres optiques.' },
  { id: 'ck22', deck: 'Chiffres clés', f: 'Diamètre pupillaire normal ? Seuils de myosis et de mydriase ?', b: '2 à 5 mm. Myosis < 2 mm, mydriase > 5 mm. Anisocorie physiologique jusqu’à ≈ 1 mm.' },
  { id: 'ck23', deck: 'Chiffres clés', f: 'Volume et renouvellement de l’humeur aqueuse ?', b: 'Sécrétion 2–3 µl/min, renouvellement complet en ≈ 100 min.' },
  { id: 'ck24', deck: 'Chiffres clés', f: 'Fente palpébrale normale ? Seuil d’exophtalmie ?', b: 'Fente 9–11 mm de hauteur ; exophtalmie si Hertel > 20–21 mm ou asymétrie > 2 mm.' },
  { id: 'ck25', deck: 'Chiffres clés', f: 'Vitesse et latence d’une saccade ?', b: 'Jusqu’à 500–700 °/s, latence ≈ 200 ms. Poursuite fidèle jusqu’à 30–40 °/s.' },
  { id: 'ck26', deck: 'Chiffres clés', f: 'Seuils de la malvoyance (définition OMS) ?', b: 'Acuité < 3/10 au meilleur œil corrigé, ou champ visuel < 20°. Cécité : AV < 1/20.' },
  { id: 'ck27', deck: 'Chiffres clés', f: 'Réfraction moyenne du nouveau-né ?', b: 'Hypermétropie physiologique de +2 à +3 D, qui décroît avec l’emmétropisation jusqu’à 6–8 ans.' },
  { id: 'ck28', deck: 'Chiffres clés', f: 'Acuité visuelle attendue selon l’âge ?', b: '≈ 1/20 à la naissance, 1/10 à 3–4 mois, 4/10 à 1 an, 10/10 vers 5–6 ans.' },
  { id: 'ck29', deck: 'Chiffres clés', f: 'Addition de près habituelle selon l’âge ?', b: '+1,00 à 45 ans, +1,50 à 50, +2,00 à 55, +2,50 à 60 ans.' },
  { id: 'ck30', deck: 'Chiffres clés', f: 'Longueurs des muscles oculomoteurs droits et de l’oblique supérieur ?', b: 'Droits ≈ 40 mm de corps musculaire ; oblique supérieur ≈ 32 mm + 26 mm de tendon (le plus long).' },

  /* ============================================================
     Anatomie
     ============================================================ */
  { id: 'an01', deck: 'Anatomie', f: 'Quelles sont les trois tuniques de l’œil ?', b: 'Fibreuse (cornée + sclère), vasculaire ou uvée (iris, corps ciliaire, choroïde), nerveuse (rétine).' },
  { id: 'an02', deck: 'Anatomie', f: 'Les cinq couches de la cornée, d’avant en arrière ?', b: 'Épithélium, membrane de Bowman, stroma, membrane de Descemet, endothélium.' },
  { id: 'an03', deck: 'Anatomie', f: 'Quelles couches de la cornée se régénèrent ? Lesquelles ne se régénèrent pas ?', b: 'L’épithélium se régénère (cellules souches du limbe) ; l’endothélium non — sa perte est définitive.' },
  { id: 'an04', deck: 'Anatomie', f: 'Quelles sont les dix couches de la rétine, du vitré vers la choroïde ?', b: 'Limitante interne, fibres optiques, cellules ganglionnaires, plexiforme interne, nucléaire interne, plexiforme externe, nucléaire externe, limitante externe, photorécepteurs, épithélium pigmentaire.' },
  { id: 'an05', deck: 'Anatomie', f: 'Quels sont les trois neurones de la voie rétinienne ?', b: 'Photorécepteur → cellule bipolaire → cellule ganglionnaire. Modulés par les cellules horizontales et amacrines.' },
  { id: 'an06', deck: 'Anatomie', f: 'Trajet complet des voies optiques ?', b: 'Rétine → nerf optique → chiasma (croisement des fibres nasales) → bandelette optique → corps genouillé latéral → radiations optiques → cortex occipital V1.' },
  { id: 'an07', deck: 'Anatomie', f: 'Quelles fibres croisent au chiasma ?', b: 'Les fibres nasales, qui portent le champ visuel temporal. Les fibres temporales restent homolatérales.' },
  { id: 'an08', deck: 'Anatomie', f: 'Les quatre segments du nerf optique ?', b: 'Intra-oculaire, intra-orbitaire, intra-canalaire, intracrânien.' },
  { id: 'an09', deck: 'Anatomie', f: 'Double vascularisation de la rétine ?', b: 'Artère centrale de la rétine pour les couches internes ; choriocapillaire pour les photorécepteurs et l’épithélium pigmentaire, par diffusion.' },
  { id: 'an10', deck: 'Anatomie', f: 'Que traverse la fente sphénoïdale (fissure orbitaire supérieure) ?', b: 'III, IV, VI, V1 (nerf nasal, frontal, lacrymal) et la veine ophtalmique supérieure. Le II passe par le canal optique, séparément.' },
  { id: 'an11', deck: 'Anatomie', f: 'Combien de parois a l’orbite, et laquelle est la plus fragile ?', b: 'Quatre parois. Le plancher et la paroi médiale (lame papyracée de l’ethmoïde) sont les plus fines — sièges des fractures blow-out.' },
  { id: 'an12', deck: 'Anatomie', f: 'Quelles sont les trois phases du film lacrymal ?', b: 'Lipidique (Meibomius, limite l’évaporation), aqueuse (glandes lacrymales), mucinique (cellules à mucus).' },
  { id: 'an13', deck: 'Anatomie', f: 'Rôle de la zonule de Zinn ?', b: 'Suspend le cristallin au corps ciliaire. Tendue au repos → cristallin aplati ; relâchée par la contraction ciliaire → accommodation.' },
  { id: 'an14', deck: 'Anatomie', f: 'Deux muscles de l’iris et leur innervation ?', b: 'Sphincter pupillaire (parasympathique, III) → myosis ; dilatateur (sympathique) → mydriase.' },
  { id: 'an15', deck: 'Anatomie', f: 'Trajet d’évacuation de l’humeur aqueuse ?', b: 'Sécrétée par l’épithélium ciliaire → chambre postérieure → pupille → chambre antérieure → trabéculum et canal de Schlemm (voie principale) ; voie uvéo-sclérale accessoire.' },
  { id: 'an16', deck: 'Anatomie', f: 'Deux muscles élévateurs de la paupière supérieure et leur innervation ?', b: 'Releveur de la paupière (III) et muscle de Müller (sympathique). D’où le ptôsis complet du III et le ptôsis modéré de Horner.' },
  { id: 'an17', deck: 'Anatomie', f: 'Dimensions et composition de la fovéa ?', b: 'Fovéa ≈ 1,5 mm, fovéola ≈ 350 µm, zone avasculaire centrale ≈ 500 µm. Uniquement des cônes, aucun vaisseau, aucune fibre en surface.' },
  { id: 'an18', deck: 'Anatomie', f: 'Quel est l’axe d’une orbite, et quelle conséquence sur les muscles droits verticaux ?', b: 'L’axe orbitaire fait ≈ 23° avec l’axe visuel : les droits verticaux ne sont purement élévateur/abaisseur qu’à 23° d’abduction.' },

  /* ============================================================
     Muscles oculomoteurs
     ============================================================ */
  { id: 'f20', deck: 'Muscles oculomoteurs', f: 'Action principale, secondaire, tertiaire du droit supérieur ?', b: 'Élévation → intorsion → adduction. Innervé par la branche supérieure du III.' },
  { id: 'f21', deck: 'Muscles oculomoteurs', f: 'Action principale, secondaire, tertiaire de l’oblique supérieur ?', b: 'Intorsion → abaissement → abduction. Innervé par le IV.' },
  { id: 'f22', deck: 'Muscles oculomoteurs', f: 'Action principale, secondaire, tertiaire de l’oblique inférieur ?', b: 'Extorsion → élévation → abduction. Innervé par la branche inférieure du III.' },
  { id: 'f23', deck: 'Muscles oculomoteurs', f: 'Action principale, secondaire, tertiaire du droit inférieur ?', b: 'Abaissement → extorsion → adduction. Innervé par la branche inférieure du III.' },
  { id: 'f24', deck: 'Muscles oculomoteurs', f: 'Spirale de Tillaux (distances au limbe) ?', b: 'DM 5,5 – DI 6,5 – DL 6,9 – DS 7,7 mm.' },
  { id: 'f25', deck: 'Muscles oculomoteurs', f: 'Angles d’action pure des verticaux ?', b: 'Droits verticaux : 23° d’abduction. Obliques : 51° d’adduction.' },
  { id: 'f26', deck: 'Muscles oculomoteurs', f: 'Couples de Hering en dextro-élévation ?', b: 'Droit supérieur droit + oblique inférieur gauche.' },
  { id: 'f27', deck: 'Muscles oculomoteurs', f: 'Couples de Hering en lévo-abaissement ?', b: 'Oblique supérieur droit + droit inférieur gauche.' },
  { id: 'f28', deck: 'Muscles oculomoteurs', f: 'Quel muscle n’a pas son origine à l’anneau de Zinn ?', b: 'L’oblique inférieur : origine à l’angle inféro-nasal de l’orbite, sur le maxillaire.' },
  { id: 'mu01', deck: 'Muscles oculomoteurs', f: 'Innervation des six muscles oculomoteurs ?', b: '« LR6 SO4, tous les autres 3 » : droit latéral = VI, oblique supérieur = IV, les quatre autres = III.' },
  { id: 'mu02', deck: 'Muscles oculomoteurs', f: 'Que sépare la branche supérieure et la branche inférieure du III ?', b: 'Supérieure : droit supérieur + releveur de la paupière. Inférieure : droit médial, droit inférieur, oblique inférieur + fibres parasympathiques du sphincter pupillaire.' },
  { id: 'mu03', deck: 'Muscles oculomoteurs', f: 'Antagonistes homolatéraux (loi de Sherrington) — les trois couples ?', b: 'DM/DL, DS/DI, OS/OI.' },
  { id: 'mu04', deck: 'Muscles oculomoteurs', f: 'Synergistes de l’élévation ? de l’abaissement ?', b: 'Élévation : droit supérieur + oblique inférieur. Abaissement : droit inférieur + oblique supérieur.' },
  { id: 'mu05', deck: 'Muscles oculomoteurs', f: 'Synergistes de l’intorsion ? de l’extorsion ?', b: 'Intorsion : oblique supérieur + droit supérieur. Extorsion : oblique inférieur + droit inférieur.' },
  { id: 'mu06', deck: 'Muscles oculomoteurs', f: 'Pourquoi l’oblique supérieur abaisse-t-il surtout en adduction ?', b: 'Parce qu’en adduction son axe d’action se rapproche de l’axe visuel : l’action verticale devient prédominante, la torsion s’efface.' },
  { id: 'mu07', deck: 'Muscles oculomoteurs', f: 'Rôle de la trochlée ?', b: 'Poulie qui réfléchit le tendon de l’oblique supérieur à ≈ 51° : c’est elle qui donne au muscle son origine fonctionnelle antéro-nasale.' },
  { id: 'mu08', deck: 'Muscles oculomoteurs', f: 'Que fait un affaiblissement chirurgical de type recul ?', b: 'Il déplace l’insertion en arrière, vers l’origine : le muscle perd de l’efficacité. Le renforcement (résection/plissement) fait l’inverse.' },
  { id: 'mu09', deck: 'Muscles oculomoteurs', f: 'Combien de dioptries prismatiques gagne-t-on par millimètre de chirurgie horizontale ?', b: 'Ordre de grandeur : ≈ 2 à 3 Δ par mm sur un droit horizontal. Toujours un ordre de grandeur, jamais une règle absolue.' },
  { id: 'mu10', deck: 'Muscles oculomoteurs', f: 'Qu’est-ce qu’une hyperaction de l’oblique inférieur ?', b: 'Élévation excessive de l’œil en adduction, avec syndrome V et extorsion. Très fréquente dans l’ésotropie précoce ; à distinguer d’une DVD.' },
  { id: 'mu11', deck: 'Muscles oculomoteurs', f: 'Position primaire du regard : définition ?', b: 'Tête droite, yeux fixant droit devant à l’infini, plan de Listing frontal. C’est la position de référence de toute mesure d’angle.' },
  { id: 'mu12', deck: 'Muscles oculomoteurs', f: 'Combien de positions diagnostiques du regard, et pourquoi ?', b: 'Neuf : la position primaire, les quatre cardinales et les quatre obliques. Chaque position oblique isole un couple de muscles.' },

  /* ============================================================
     Optique & réfraction
     ============================================================ */
  { id: 'op01', deck: 'Optique & réfraction', f: 'Où se trouve le punctum remotum d’un myope de −4 D ?', b: 'À 25 cm (1 / 4). Au-delà, tout est flou sans correction.' },
  { id: 'op02', deck: 'Optique & réfraction', f: 'Pourquoi la réfraction de l’enfant se fait-elle sous cycloplégie ?', b: 'Parce que le tonus accommodatif masque une partie de l’hypermétropie (hypermétropie latente) et simule une myopie à l’autoréfractomètre.' },
  { id: 'op03', deck: 'Optique & réfraction', f: 'Astigmatisme conforme : définition et signe du cylindre ?', b: 'Méridien le plus puissant vertical ; cylindre négatif d’axe proche de 180°. C’est la forme physiologique.' },
  { id: 'op04', deck: 'Optique & réfraction', f: 'Astigmatisme inverse : définition et intérêt clinique ?', b: 'Méridien le plus puissant horizontal, cylindre négatif d’axe proche de 90°. Moins bien toléré ; évoque un kératocône débutant s’il évolue.' },
  { id: 'op05', deck: 'Optique & réfraction', f: 'Que trouve-t-on dans la conoïde de Sturm ?', b: 'Deux focales perpendiculaires, des sections elliptiques entre elles, et le cercle de moindre diffusion au milieu dioptrique (= équivalent sphérique).' },
  { id: 'op06', deck: 'Optique & réfraction', f: 'Duochrome : que faire si le vert est plus net ?', b: 'Ajouter du + — « GAP : Green Add Plus ». L’œil était surcorrigé en myopie (ou sous-corrigé en hypermétropie).' },
  { id: 'op07', deck: 'Optique & réfraction', f: 'À quoi sert le brouillage avant la réfraction subjective ?', b: 'À relâcher l’accommodation par des verres positifs, puis à réduire progressivement : on retient le plus fort plus donnant la meilleure acuité.' },
  { id: 'op08', deck: 'Optique & réfraction', f: 'Verre de travail en skiascopie à 67 cm ? à 50 cm ?', b: '+1,50 D à 67 cm, +2,00 D à 50 cm — l’inverse de la distance en mètres.' },
  { id: 'op09', deck: 'Optique & réfraction', f: 'Skiascopie : ombre directe ou inverse, comment conclure ?', b: 'Ombre directe (reflet dans le sens du balayage) : l’œil est moins convergent que le point neutre → ajouter du +. Ombre inverse : ajouter du −.' },
  { id: 'op10', deck: 'Optique & réfraction', f: 'Réflexe en ciseaux à la skiascopie : à quoi penser ?', b: 'À un astigmatisme irrégulier — kératocône en premier lieu. Confirmation par topographie.' },
  { id: 'op11', deck: 'Optique & réfraction', f: 'Quand la conversion lunettes/lentilles devient-elle nécessaire ?', b: 'Au-delà de ± 4 D environ. Formule : P’ = P / (1 − d × P), d ≈ 0,012 m.' },
  { id: 'op12', deck: 'Optique & réfraction', f: 'Pourquoi un myope voit-il mieux de près sans lunettes ?', b: 'Son punctum remotum est déjà rapproché : il n’a pas ou peu besoin d’accommoder à cette distance. D’où la presbytie mieux tolérée.' },
  { id: 'op13', deck: 'Optique & réfraction', f: 'Aniséiconie : à partir de quelle anisométropie devient-elle gênante en lunettes ?', b: '≈ 2 % de différence de taille par dioptrie ; gêne à partir de 5 %, donc au-delà de 2 à 3 D → passer aux lentilles.' },
  { id: 'op14', deck: 'Optique & réfraction', f: 'Que fait un prisme à l’image et au rayon lumineux ?', b: 'Il dévie le rayon vers la base et l’image vers l’arête. Base externe pour une ésodéviation, base interne pour une exodéviation.' },
  { id: 'op15', deck: 'Optique & réfraction', f: 'Comment répartir un prisme total entre les deux yeux ?', b: 'En le divisant, souvent à parts égales, ce qui réduit l’épaisseur et les aberrations. La somme des puissances est ce qui compte.' },
  { id: 'op16', deck: 'Optique & réfraction', f: 'Que mesure la kératométrie et à quoi sert-elle ?', b: 'Le rayon de courbure de la cornée centrale (≈ 7,8 mm / 43 D) : astigmatisme cornéen, adaptation en lentilles, calcul d’implant.' },
  { id: 'op17', deck: 'Optique & réfraction', f: 'Comment détermine-t-on une addition de près ?', b: 'On part de l’amplitude d’accommodation en n’en utilisant que la moitié, puis on vérifie sur la distance de travail réelle du patient.' },
  { id: 'op18', deck: 'Optique & réfraction', f: 'Intérêt du trou sténopéique ?', b: 'Il réduit les cercles de diffusion : si l’acuité s’améliore, la cause est optique ; sinon elle est rétinienne ou neurologique.' },
  { id: 'op19', deck: 'Optique & réfraction', f: 'Que signifie une acuité de 10/10 en logMAR, en Snellen, en décimal ?', b: 'logMAR 0,0 ; 20/20 ou 6/6 ; décimal 1,0.' },
  { id: 'op20', deck: 'Optique & réfraction', f: 'Pourquoi l’échelle logMAR est-elle préférée en recherche ?', b: 'Progression géométrique régulière, cinq optotypes par ligne, échantillonnage identique aux fortes et aux faibles acuités : les moyennes ont un sens.' },
  { id: 'op21', deck: 'Optique & réfraction', f: 'Que devient la réfraction après implantation d’un monofocal ?', b: 'Stable, mais accommodation nulle : une addition de près est obligatoire (pseudophakie).' },
  { id: 'op22', deck: 'Optique & réfraction', f: 'Quels moyens de freination de la myopie de l’enfant ?', b: 'Verres à défocalisation périphérique, orthokératologie, lentilles multifocales, atropine 0,01–0,05 %, ≈ 2 h d’extérieur par jour.' },

  /* ============================================================
     Formules
     ============================================================ */
  { id: 'f40', deck: 'Formules', f: 'Transposition cylindrique — les 3 étapes ?', b: '1) Nouvelle sphère = sphère + cylindre. 2) Cylindre changé de signe. 3) Axe ± 90°.' },
  { id: 'f41', deck: 'Formules', f: 'Équivalent sphérique ?', b: 'ES = sphère + cylindre / 2.' },
  { id: 'f42', deck: 'Formules', f: 'Loi de Prentice ?', b: 'Δ = puissance (D) × décentrement (cm).' },
  { id: 'f43', deck: 'Formules', f: 'Formules de Hofstetter ?', b: 'Max = 25 − 0,4 × âge ; Moyenne = 18,5 − 0,3 × âge ; Min = 15 − 0,25 × âge.' },
  { id: 'f44', deck: 'Formules', f: 'AC/A par la méthode du gradient ?', b: '(phorie avec verre − phorie sans verre) / puissance du verre.' },
  { id: 'f45', deck: 'Formules', f: 'AC/A par la méthode de l’hétérophorie ?', b: 'DIP(cm) + distance de travail(m) × (phorie VP − phorie VL). Éso = +, exo = −.' },
  { id: 'f46', deck: 'Formules', f: 'Demande de convergence à une distance donnée ?', b: 'Δ = DIP(cm) × 100 / distance(cm) — soit DIP(cm) × angle métrique.' },
  { id: 'f47', deck: 'Formules', f: 'logMAR ↔ décimal ?', b: 'logMAR = −log10(acuité décimale). 10/10 → 0,0 ; 5/10 → 0,3 ; 1/10 → 1,0.' },
  { id: 'f48', deck: 'Formules', f: 'Critère de Sheard ?', b: 'Réserve opposée ≥ 2 × phorie. Prisme = (2 × phorie − réserve) / 3.' },
  { id: 'f49', deck: 'Formules', f: 'Puissance effective au changement de distance de sommet ?', b: 'P’ = P / (1 − d × P), d en mètres (positif si on rapproche du sommet de la cornée).' },
  { id: 'f50', deck: 'Formules', f: 'Grossissement commercial d’une loupe ?', b: 'G = P / 4.' },
  { id: 'fo01', deck: 'Formules', f: 'Amplitude d’accommodation à partir de PP et PR ?', b: 'AA = 1/PP(m) − 1/PR(m), en valeur algébrique. Ex. PP 10 cm, PR ∞ → 10 D.' },
  { id: 'fo02', deck: 'Formules', f: 'Relation dioptrie prismatique ↔ degré ?', b: 'Δ = 100 × tan θ. Approximation utile : 1 Δ ≈ 0,57°, 2 Δ ≈ 1°.' },
  { id: 'fo03', deck: 'Formules', f: 'Critère de Percival ?', b: 'La demande doit rester dans le tiers central de la zone de vision binoculaire nette : la plus petite réserve ≥ la moitié de la plus grande.' },
  { id: 'fo04', deck: 'Formules', f: 'Puissance d’une lentille à partir de sa focale ?', b: 'P (D) = 1 / f (m). Une lentille de +2,50 D focalise à 40 cm.' },
  { id: 'fo05', deck: 'Formules', f: 'Relation de conjugaison de Descartes (en dioptries) ?', b: '1/p’ − 1/p = P, avec p distance objet (négative en amont) et p’ distance image, en mètres.' },
  { id: 'fo06', deck: 'Formules', f: 'Combien de dioptries d’accommodation à 40 cm ? à 25 cm ?', b: '2,50 D à 40 cm et 4,00 D à 25 cm — l’inverse de la distance en mètres.' },
  { id: 'fo07', deck: 'Formules', f: 'Conversion d’une amétropie en longueur axiale ?', b: 'Ordre de grandeur : 1 mm de longueur axiale ≈ 3 D. Un œil de 26 mm est donc ≈ −6 D.' },
  { id: 'fo08', deck: 'Formules', f: 'Grossissement d’un système télescopique de Galilée ?', b: 'G = − f objectif / f oculaire (en valeur absolue, rapport des puissances). Image droite, champ étroit.' },
  { id: 'fo09', deck: 'Formules', f: 'Comment convertir une acuité de Snellen en décimal ?', b: 'On divise : 20/40 = 0,5 = 5/10 ; 6/18 = 0,33 ≈ 3/10.' },
  { id: 'fo10', deck: 'Formules', f: 'Réserve fusionnelle exigée pour une exophorie de 8 Δ de près (Sheard) ?', b: '≥ 16 Δ de convergence. Sinon prisme = (2×8 − réserve)/3.' },

  /* ============================================================
     Lois & tests
     ============================================================ */
  { id: 'f60', deck: 'Lois & tests', f: 'Loi de Sherrington ?', b: 'Innervation réciproque : la contraction d’un muscle s’accompagne du relâchement proportionnel de son antagoniste homolatéral.' },
  { id: 'f61', deck: 'Lois & tests', f: 'Loi de Hering ?', b: 'Égale innervation des muscles synergistes des deux yeux dans les mouvements conjugués. Explique déviation secondaire > primaire.' },
  { id: 'f62', deck: 'Lois & tests', f: 'Loi de Donders ?', b: 'À chaque position du regard correspond une torsion déterminée, indépendante du trajet suivi pour y parvenir.' },
  { id: 'f63', deck: 'Lois & tests', f: 'Test des 3 pas de Parks — les 3 questions ?', b: '1) Quel œil est le plus haut ? 2) Déviation majorée en regard droit ou gauche ? 3) Majorée en inclinaison droite ou gauche ?' },
  { id: 'f64', deck: 'Lois & tests', f: 'Interprétation du test de Worth ?', b: '4 points = fusion ; 5 points = diplopie ; 2 rouges = neutralisation de l’œil au verre vert ; 3 verts = neutralisation de l’œil au verre rouge.' },
  { id: 'f65', deck: 'Lois & tests', f: 'Différence cover test unilatéral / alterné ?', b: 'Unilatéral : dépiste les tropies (mouvement de l’œil découvert). Alterné : rompt la fusion et mesure la déviation totale, phorie comprise.' },
  { id: 'f66', deck: 'Lois & tests', f: 'Que mesure la baguette de Maddox placée horizontalement ?', b: 'Stries horizontales → trait vertical perçu → mesure des déviations horizontales.' },
  { id: 'f67', deck: 'Lois & tests', f: 'Loi de Listing ?', b: 'Tous les axes de rotation depuis la position primaire sont contenus dans un plan frontal passant par le centre de rotation : le plan de Listing.' },
  { id: 'lt01', deck: 'Lois & tests', f: 'Interprétation des verres striés de Bagolini ?', b: 'Croix complète = correspondance harmonieuse ; un trait manquant en tout ou partie = neutralisation ; croix décalée = diplopie.' },
  { id: 'lt02', deck: 'Lois & tests', f: 'Pourquoi le Bagolini est-il dit « le moins dissociant » ?', b: 'Parce que les verres striés laissent voir la scène normalement : on teste la binocularité en conditions quasi naturelles, sans rompre la fusion.' },
  { id: 'lt03', deck: 'Lois & tests', f: 'Ordre de dissociation croissante des tests binoculaires ?', b: 'Bagolini < Worth < prismes/écran alterné < synoptophore < baguette de Maddox (dissociation totale).' },
  { id: 'lt04', deck: 'Lois & tests', f: 'Différence Lang / TNO ?', b: 'Lang : réseau cylindrique, sans lunettes, disparités grossières (1200–200″) → nourrisson. TNO : anaglyphes, disparité pure jusqu’à 15″ → dépiste les microtropies.' },
  { id: 'lt05', deck: 'Lois & tests', f: 'Que teste le test des 4 dioptries prismatiques de Jampolsky ?', b: 'Un prisme de 4 Δ base externe devant chaque œil : l’absence de mouvement de refixation d’un côté signe un scotome central de microtropie.' },
  { id: 'lt06', deck: 'Lois & tests', f: 'Comment le test de Lancaster distingue-t-il paralysie et restriction ?', b: 'Paralysie : schéma agrandi du côté du muscle atteint avec déviation secondaire majorée. Restriction : limitation abrupte, sans majoration secondaire.' },
  { id: 'lt07', deck: 'Lois & tests', f: 'Que recherche le test de duction forcée ?', b: 'Une résistance mécanique à la mobilisation passive du globe : elle signe une restriction et non une paralysie.' },
  { id: 'lt08', deck: 'Lois & tests', f: 'Que met en évidence la double baguette de Maddox ?', b: 'Une cyclodéviation : l’écart d’inclinaison entre les deux traits perçus la mesure en degrés.' },
  { id: 'lt09', deck: 'Lois & tests', f: 'Quels tests pour la vision des couleurs, et quelle différence ?', b: 'Ishihara : dépiste le congénital rouge-vert. Farnsworth 15/100 Hue : quantifie et donne l’axe, y compris bleu-jaune acquis.' },
  { id: 'lt10', deck: 'Lois & tests', f: 'Règle de Köllner ?', b: 'Atteinte rétinienne → dyschromatopsie bleu-jaune ; atteinte du nerf optique → rouge-vert. Utile, avec des exceptions (glaucome, névrite).' },

  /* ============================================================
     Vision binoculaire
     ============================================================ */
  { id: 'vb01', deck: 'Vision binoculaire', f: 'Les trois degrés de Worth ?', b: '1) Perception simultanée. 2) Fusion. 3) Stéréoscopie.' },
  { id: 'vb02', deck: 'Vision binoculaire', f: 'Quelles conditions pour une vision binoculaire normale ?', b: 'Deux images de qualité et de taille comparables, alignement moteur, correspondance rétinienne normale, intégration corticale intacte.' },
  { id: 'vb03', deck: 'Vision binoculaire', f: 'Qu’est-ce que l’horoptère ?', b: 'Le lieu des points de l’espace dont les images tombent sur des points rétiniens correspondants : ils sont vus simples et sans disparité.' },
  { id: 'vb04', deck: 'Vision binoculaire', f: 'À quoi servent les aires de Panum ?', b: 'Elles donnent à l’horoptère une épaisseur : les disparités qui y tombent fusionnent encore et sont interprétées en relief. Étroites au centre, larges en périphérie.' },
  { id: 'vb05', deck: 'Vision binoculaire', f: 'Diplopie croisée ou homonyme : comment conclure ?', b: 'Homonyme (image du côté de l’œil) dans les ésodéviations ; croisée dans les exodéviations.' },
  { id: 'vb06', deck: 'Vision binoculaire', f: 'Quelle différence entre diplopie et confusion ?', b: 'Diplopie : un objet vu deux fois (images sur points non correspondants). Confusion : deux objets vus au même endroit (points correspondants stimulés différemment).' },
  { id: 'vb07', deck: 'Vision binoculaire', f: 'Quatre composantes de la convergence ?', b: 'Tonique, accommodative, fusionnelle, proximale. Seule la fusionnelle se rééduque véritablement.' },
  { id: 'vb08', deck: 'Vision binoculaire', f: 'Comment note-t-on une amplitude de fusion ?', b: 'Flou / rupture / recouvrement, en dioptries prismatiques, séparément en convergence, divergence et vertical.' },
  { id: 'vb09', deck: 'Vision binoculaire', f: 'Que signifie un AC/A élevé ? bas ?', b: 'Élevé : excès de convergence (éso de près ≫ de loin). Bas : insuffisance de convergence (exo de près, PPC éloigné).' },
  { id: 'vb10', deck: 'Vision binoculaire', f: 'Comment reconnaître une correspondance rétinienne anormale harmonieuse ?', b: 'L’angle d’anomalie est égal à l’angle objectif : l’angle subjectif est nul, le patient superpose les mires alors que les yeux sont déviés.' },
  { id: 'vb11', deck: 'Vision binoculaire', f: 'Qu’est-ce que la disparité rétinienne croisée ?', b: 'Celle d’un objet plus proche que le plan de fixation ; homonyme pour un objet plus lointain. C’est le signal du relief.' },
  { id: 'vb12', deck: 'Vision binoculaire', f: 'Pourquoi une microtropie garde-t-elle un peu de relief ?', b: 'Parce que la correspondance anormale harmonieuse permet une union binoculaire périphérique : stéréoscopie fruste, mais présente.' },
  { id: 'vb13', deck: 'Vision binoculaire', f: 'Que teste la perception simultanée au synoptophore ?', b: 'Deux mires différentes et complémentaires (lion / cage) : le patient doit voir les deux à la fois — 1er degré de Worth.' },
  { id: 'vb14', deck: 'Vision binoculaire', f: 'Que signifie un scotome de neutralisation central étendu ?', b: 'Une inhibition profonde, de mauvais pronostic pour la récupération binoculaire, souvent associée à une amblyopie ancienne.' },
  { id: 'vb15', deck: 'Vision binoculaire', f: 'Quand suspecter une hétérophorie décompensée ?', b: 'Asthénopie en fin de journée, diplopie intermittente, fermeture d’un œil, réserves insuffisantes au regard de la phorie (critères de Sheard/Percival).' },
  { id: 'vb16', deck: 'Vision binoculaire', f: 'Que mesure le cover test prismatique alterné ?', b: 'La déviation totale, tropie + phorie, la fusion étant rompue. C’est la valeur de référence pour une indication chirurgicale.' },
  { id: 'vb17', deck: 'Vision binoculaire', f: 'Pourquoi l’acuité binoculaire est-elle meilleure que l’acuité monoculaire ?', b: 'Sommation binoculaire : gain d’environ une ligne, plus une amélioration nette du contraste et du confort.' },
  { id: 'vb18', deck: 'Vision binoculaire', f: 'Qu’est-ce que la diplopie physiologique ?', b: 'La vision double, normale, des objets situés hors des aires de Panum. Sa prise de conscience est un outil central de rééducation.' },

  /* ============================================================
     Strabologie
     ============================================================ */
  { id: 'st01', deck: 'Strabologie', f: 'Phorie ou tropie : comment les distinguer ?', b: 'Phorie : latente, apparaît seulement après dissociation (cover test alterné). Tropie : manifeste en binoculaire non dissocié.' },
  { id: 'st02', deck: 'Strabologie', f: 'Signes du syndrome de strabisme précoce ?', b: 'Ésotropie avant 6 mois, grand angle, fixation croisée en adduction, nystagmus latent, DVD, hyperaction des obliques inférieurs, absence de binocularité normale.' },
  { id: 'st03', deck: 'Strabologie', f: 'Comment reconnaître une ésotropie accommodative ?', b: 'Apparition vers 2–4 ans chez un hypermétrope, angle réduit ou annulé par la correction optique totale, ou angle de près ≫ de loin (AC/A élevé).' },
  { id: 'st04', deck: 'Strabologie', f: 'Premier traitement d’une ésotropie accommodative ?', b: 'La correction optique totale sous cycloplégie, portée en permanence, avant toute autre décision.' },
  { id: 'st05', deck: 'Strabologie', f: 'Qu’est-ce qu’une microtropie et comment la dépister ?', b: 'Tropie < 8–10 Δ avec CRA harmonieuse et scotome central. Dépistage : test des 4 Δ, TNO, visuscope, Bagolini — le cover test peut sembler négatif.' },
  { id: 'st06', deck: 'Strabologie', f: 'Comment distinguer DVD et hyperaction de l’oblique inférieur ?', b: 'DVD : élévation lente de l’œil occlus, sans hypotropie de l’autre, en toutes positions. Hyperaction de l’OI : élévation en adduction, avec syndrome V.' },
  { id: 'st07', deck: 'Strabologie', f: 'Syndrome A ou V : définition ?', b: 'V : plus divergent en haut qu’en bas (obliques inférieurs). A : plus divergent en bas (obliques supérieurs). Écart significatif ≥ 10–15 Δ.' },
  { id: 'st08', deck: 'Strabologie', f: 'Signes du syndrome de Duane ?', b: 'Limitation de l’abduction, rétrécissement de la fente palpébrale et rétraction du globe en adduction : dysinnervation du droit latéral, VI absent.' },
  { id: 'st09', deck: 'Strabologie', f: 'Signes du syndrome de Brown ?', b: 'Limitation de l’élévation en adduction, parfois un clic, sans hyperaction de l’antagoniste : gêne mécanique du tendon de l’oblique supérieur dans la trochlée.' },
  { id: 'st10', deck: 'Strabologie', f: 'Comment différencier paralysie et restriction ?', b: 'Paralysie : déviation secondaire > primaire, duction forcée libre. Restriction : duction forcée résistante, pas de majoration secondaire, PIO élevée dans le regard contraint.' },
  { id: 'st11', deck: 'Strabologie', f: 'Qu’est-ce qu’un strabisme sensoriel ?', b: 'Un strabisme secondaire à une baisse de vision unilatérale profonde. Tout strabisme unilatéral de l’enfant impose donc un fond d’œil.' },
  { id: 'st12', deck: 'Strabologie', f: 'Éléments d’un bilan orthoptique de strabisme, dans l’ordre ?', b: 'Interrogatoire → acuité œil par œil → réfraction sous cycloplégie → reflets/cover test chiffré dans les 9 positions → motilité → sensoriel (Bagolini, Worth, relief) → fond d’œil.' },
  { id: 'st13', deck: 'Strabologie', f: 'Que cherche-t-on avant d’opérer un strabisme ?', b: 'Un angle stable et mesuré à plusieurs reprises, une amblyopie traitée, une correction optique optimale, et l’absence de cause restrictive ou paralytique évolutive.' },
  { id: 'st14', deck: 'Strabologie', f: 'Comment évolue une exotropie intermittente ?', b: 'D’abord de loin, à la fatigue ou en lumière vive, avec bonne fusion de près ; elle se décompense progressivement vers une exotropie constante.' },
  { id: 'st15', deck: 'Strabologie', f: 'Angle kappa positif : quel piège ?', b: 'Reflet dévié en nasal → simule une exotropie. Le cover test reste négatif : c’est un pseudo-strabisme.' },
  { id: 'st16', deck: 'Strabologie', f: 'Causes classiques de pseudo-strabisme convergent du nourrisson ?', b: 'Épicanthus, télécanthus, racine du nez large, angle kappa négatif. Reflets symétriques et cover test négatif font le diagnostic.' },
  { id: 'st17', deck: 'Strabologie', f: 'Que traduit une déviation incomitante ?', b: 'Une paralysie, une restriction mécanique ou une cause orbitaire — jamais un strabisme concomitant simple.' },
  { id: 'st18', deck: 'Strabologie', f: 'Comment nomme-t-on une déviation verticale ?', b: 'D’après l’œil le plus haut : une hypertropie droite est équivalente à une hypotropie gauche.' },
  { id: 'st19', deck: 'Strabologie', f: 'Qu’est-ce qu’une fixation croisée ?', b: 'Dans les grandes ésotropies du nourrisson : l’œil droit fixe à gauche et inversement, en adduction. Elle simule un déficit bilatéral d’abduction.' },
  { id: 'st20', deck: 'Strabologie', f: 'Quel torticolis dans une paralysie du IV droit ?', b: 'Tête inclinée sur l’épaule gauche (côté opposé), menton légèrement abaissé, visage tourné vers la gauche.' },

  /* ============================================================
     Neuro-ophtalmologie
     ============================================================ */
  { id: 'f80', deck: 'Neuro-ophtalmologie', f: 'Signes d’une paralysie du IV ?', b: 'Hypertropie majorée en adduction et en regard vers le bas, Bielschowsky positif du côté atteint, diplopie verticale et torsionnelle, torticolis tête inclinée du côté opposé.' },
  { id: 'f81', deck: 'Neuro-ophtalmologie', f: 'Signes d’une paralysie du III complète ?', b: 'Ptôsis, œil en abduction et abaissement, accommodation abolie, diplopie. Mydriase aréactive = urgence (anévrisme).' },
  { id: 'no03', deck: 'Neuro-ophtalmologie', f: 'Signes d’une paralysie du VI ?', b: 'Déficit d’abduction, ésotropie majorée de loin et du côté atteint, diplopie homonyme, torticolis en rotation vers le côté atteint.' },
  { id: 'no04', deck: 'Neuro-ophtalmologie', f: 'Pourquoi une paralysie du VI peut-elle ne rien localiser ?', b: 'Parce qu’elle peut être un simple signe d’hypertension intracrânienne, le nerf étant étiré sur son long trajet.' },
  { id: 'no05', deck: 'Neuro-ophtalmologie', f: 'Qu’est-ce qu’un DPAR et que signifie-t-il ?', b: 'Dilatation paradoxale à l’éclairement alterné (signe de Marcus Gunn) : neuropathie optique unilatérale ou asymétrique.' },
  { id: 'no06', deck: 'Neuro-ophtalmologie', f: 'Anisocorie majorée à la lumière : quel côté est pathologique ?', b: 'La grande pupille (atteinte parasympathique : III, pupille d’Adie, pharmacologique).' },
  { id: 'no07', deck: 'Neuro-ophtalmologie', f: 'Anisocorie majorée à l’obscurité : quel côté est pathologique ?', b: 'La petite pupille (atteinte sympathique : syndrome de Claude Bernard-Horner).' },
  { id: 'f87', deck: 'Neuro-ophtalmologie', f: 'Triade du syndrome de Claude Bernard-Horner ?', b: 'Myosis, ptôsis modéré, énophtalmie apparente (+ anhidrose). Atteinte sympathique.' },
  { id: 'no09', deck: 'Neuro-ophtalmologie', f: 'Caractéristiques de la pupille d’Adie ?', b: 'Mydriase tonique : peu réactive à la lumière, contraction lente et prolongée en vision de près, mouvements vermiformes, hypersensible à la pilocarpine diluée.' },
  { id: 'no10', deck: 'Neuro-ophtalmologie', f: 'Trajet du réflexe photomoteur ?', b: 'Rétine → nerf optique → chiasma → noyau prétectal → noyaux d’Edinger-Westphal bilatéraux → III → sphincter pupillaire. D’où le réflexe consensuel.' },
  { id: 'no11', deck: 'Neuro-ophtalmologie', f: 'Signes d’une ophtalmoplégie internucléaire ?', b: 'Déficit d’adduction dans le regard latéral, nystagmus de l’œil abducteur, convergence conservée. Bilatérale chez le jeune : sclérose en plaques.' },
  { id: 'no12', deck: 'Neuro-ophtalmologie', f: 'Tableau d’une névrite optique rétrobulbaire ?', b: 'Baisse d’acuité rapide, douleur à la mobilisation, dyschromatopsie rouge-vert, DPAR, scotome central, fond d’œil normal (« le patient ne voit rien, le médecin ne voit rien »).' },
  { id: 'f83', deck: 'Neuro-ophtalmologie', f: 'Quel déficit du champ visuel pour une lésion chiasmatique ?', b: 'Hémianopsie bitemporale — adénome hypophysaire typiquement.' },
  { id: 'no14', deck: 'Neuro-ophtalmologie', f: 'Que signifie une hémianopsie latérale homonyme ?', b: 'Une lésion rétro-chiasmatique controlatérale. Plus la congruence est parfaite, plus la lésion est postérieure (occipitale).' },
  { id: 'no15', deck: 'Neuro-ophtalmologie', f: 'Quadranopsie supérieure homonyme : où est la lésion ?', b: 'Sur les fibres temporales, boucle de Meyer — « pie in the sky ». La quadranopsie inférieure est pariétale.' },
  { id: 'no16', deck: 'Neuro-ophtalmologie', f: 'Quels signes évoquent un trouble neurovisuel chez l’enfant ?', b: 'Œil sain mais exploration désorganisée, gêne dans l’encombrement visuel, maladresse œil-main, difficultés visuo-spatiales. Contexte de prématurité ou de lésion cérébrale.' },

  /* ============================================================
     Pathologies
     ============================================================ */
  { id: 'f82', deck: 'Pathologies', f: 'Champ visuel typique du glaucome ?', b: 'Ressaut nasal, scotome de Bjerrum arciforme, scotome de Seidel, déficit altitudinal ; épargne centrale tardive.' },
  { id: 'f84', deck: 'Pathologies', f: 'Fond d’œil d’une OVCR ?', b: 'Hémorragies en flammèches dans les 4 quadrants, veines dilatées et tortueuses, nodules cotonneux, œdème papillaire.' },
  { id: 'f85', deck: 'Pathologies', f: 'Symptômes d’une DMLA exsudative ?', b: 'Baisse d’acuité rapide, métamorphopsies, scotome central. Amsler et OCT ; traitement anti-VEGF.' },
  { id: 'f86', deck: 'Pathologies', f: 'Ordre d’atteinte musculaire dans l’orbitopathie dysthyroïdienne ?', b: 'Droit inférieur, puis médial, puis supérieur, puis latéral (« I’M SLOw »).' },
  { id: 'pa01', deck: 'Pathologies', f: 'Trois grands facteurs de risque du glaucome primitif à angle ouvert ?', b: 'PIO élevée, âge, antécédents familiaux. Aussi : myopie forte, cornée fine, origine africaine.' },
  { id: 'pa02', deck: 'Pathologies', f: 'Pourquoi la PIO de Goldmann doit-elle être corrigée ?', b: 'Parce qu’elle dépend de l’épaisseur cornéenne centrale : cornée fine → PIO sous-estimée ; cornée épaisse → surestimée.' },
  { id: 'pa03', deck: 'Pathologies', f: 'Signes d’une crise de glaucome aigu par fermeture de l’angle ?', b: 'Œil rouge très douloureux, dur, cornée trouble, mydriase peu réactive, baisse d’acuité, halos, nausées. Urgence absolue.' },
  { id: 'pa04', deck: 'Pathologies', f: 'Deux formes de DMLA et ce qui les distingue ?', b: 'Atrophique : lente, drusen puis plage d’atrophie, pas de traitement curatif. Exsudative : néovaisseaux, baisse rapide, métamorphopsies, anti-VEGF.' },
  { id: 'pa05', deck: 'Pathologies', f: 'Évolution de la rétinopathie diabétique ?', b: 'Microanévrismes → hémorragies et exsudats → ischémie → néovaisseaux (forme proliférante) → hémorragie du vitré, décollement tractionnel. L’œdème maculaire fait la baisse de vision.' },
  { id: 'pa06', deck: 'Pathologies', f: 'Signes d’un décollement de rétine ?', b: 'Myodésopsies, phosphènes, puis voile ou amputation périphérique progressant vers le centre. Urgence chirurgicale.' },
  { id: 'pa07', deck: 'Pathologies', f: 'Tableau d’une rétinopathie pigmentaire ?', b: 'Héméralopie, rétrécissement concentrique du champ visuel, ostéoblastes au fond d’œil, ERG éteint. Accompagnement en basse vision.' },
  { id: 'pa08', deck: 'Pathologies', f: 'Signes d’un kératocône ?', b: 'Astigmatisme irrégulier évolutif souvent inverse, mires de Javal déformées, réflexe en ciseaux, anneau de Fleischer, stries de Vogt. Diagnostic topographique.' },
  { id: 'pa09', deck: 'Pathologies', f: 'Comment reconnaître un œil rouge grave ?', b: 'Douleur profonde, baisse d’acuité, photophobie, cercle périkératique, anomalie pupillaire ou cornéenne. À l’inverse, une conjonctivite ne baisse pas l’acuité.' },
  { id: 'pa10', deck: 'Pathologies', f: 'Tableau d’une uvéite antérieure ?', b: 'Douleur, rougeur périkératique, photophobie, myosis, Tyndall en chambre antérieure, synéchies possibles. PIO variable.' },
  { id: 'pa11', deck: 'Pathologies', f: 'Pourquoi dépister l’uvéite dans l’arthrite juvénile idiopathique ?', b: 'Parce qu’elle est totalement silencieuse chez l’enfant : sans lampe à fente systématique, on la découvre au stade des complications.' },
  { id: 'pa12', deck: 'Pathologies', f: 'Signes d’un syndrome sec évaporatif ?', b: 'Brûlures, sensation de corps étranger, fluctuations d’acuité, BUT court avec Schirmer conservé, dysfonction meibomienne.' },
  { id: 'pa13', deck: 'Pathologies', f: 'Signes d’une myasthénie oculaire ?', b: 'Ptôsis et diplopie variables, fatigables, majorés en fin de journée, sans atteinte pupillaire. Amélioration au repos et au test au glaçon.' },
  { id: 'pa14', deck: 'Pathologies', f: 'Complications visuelles d’une orbitopathie dysthyroïdienne ?', b: 'Diplopie restrictive, kératite d’exposition par rétraction palpébrale, et surtout neuropathie optique compressive à l’apex — à dépister par l’acuité et la vision des couleurs.' },

  /* ============================================================
     Bilan orthoptique
     ============================================================ */
  { id: 'bi01', deck: 'Bilan orthoptique', f: 'Dans quel ordre mener un bilan orthoptique standard ?', b: 'Interrogatoire → acuités de loin et de près → réfraction → équilibre oculomoteur (reflets, cover test, motilité) → vergences et accommodation → sensoriel → synthèse et conclusion.' },
  { id: 'bi02', deck: 'Bilan orthoptique', f: 'Que faut-il toujours noter avec une acuité visuelle ?', b: 'L’échelle utilisée, la distance, l’œil, avec ou sans correction, en isolé ou en ligne, et l’éclairage. Sinon la valeur n’est pas comparable.' },
  { id: 'bi03', deck: 'Bilan orthoptique', f: 'Pourquoi mesurer l’acuité en ligne chez l’amblyope ?', b: 'Parce que l’effet de crowding est majoré : en optotypes isolés, on surestime nettement sa vision.' },
  { id: 'bi04', deck: 'Bilan orthoptique', f: 'Comment mesure-t-on un PPC correctement ?', b: 'Cible accommodative rapprochée lentement dans l’axe, correction portée, mesure de la rupture puis du recouvrement, répétée 3 à 5 fois pour dépister la fatigabilité.' },
  { id: 'bi05', deck: 'Bilan orthoptique', f: 'Que cherche-t-on aux flippers ± 2,00 D ?', b: 'La souplesse accommodative : norme ≈ 11 cycles/min en binoculaire, 8 en monoculaire. Blocage sur le − → insuffisance ; sur le + → excès d’accommodation.' },
  { id: 'bi06', deck: 'Bilan orthoptique', f: 'Comment explore-t-on les saccades et les poursuites ?', b: 'Latence, précision et vitesse pour les saccades ; fidélité et caractère continu pour les poursuites. Toujours interpréter selon l’âge et l’attention.' },
  { id: 'bi07', deck: 'Bilan orthoptique', f: 'À quoi sert le test DEM ?', b: 'À séparer une lenteur de dénomination d’un vrai trouble des saccades de lecture, par comparaison des temps en colonnes et en lignes.' },
  { id: 'bi08', deck: 'Bilan orthoptique', f: 'Quel test pour dépister une fixation excentrique ?', b: 'Le visuscope, œil par œil : on repère la position de la mire étoilée par rapport à la fovéa.' },
  { id: 'bi09', deck: 'Bilan orthoptique', f: 'Comment estimer l’acuité d’un nourrisson ?', b: 'Regard préférentiel (cartes de Teller), nystagmus optocinétique, comportement de fixation et de poursuite, et PEV si nécessaire.' },
  { id: 'bi10', deck: 'Bilan orthoptique', f: 'Quels indices de fiabilité lire sur un champ visuel automatisé ?', b: 'Pertes de fixation, faux positifs, faux négatifs. Sans eux, aucune interprétation n’est valable.' },
  { id: 'bi11', deck: 'Bilan orthoptique', f: 'Périmétrie statique ou cinétique : laquelle choisir ?', b: 'Statique automatisée pour le glaucome et le suivi quantitatif ; cinétique de Goldmann pour les atteintes neurologiques, la périphérie et les patients peu coopérants.' },
  { id: 'bi12', deck: 'Bilan orthoptique', f: 'Que mesure la sensibilité aux contrastes, et quand la demander ?', b: 'L’aptitude à distinguer de faibles différences de luminance. Utile quand la plainte dépasse l’acuité : cataracte débutante, neuropathie optique, amblyopie.' },
  { id: 'bi13', deck: 'Bilan orthoptique', f: 'Comment mesurer un angle chez un enfant qui ne fixe pas des deux yeux ?', b: 'Test de Krimsky : prismes devant l’œil fixateur jusqu’au recentrage du reflet de l’œil dévié.' },
  { id: 'bi14', deck: 'Bilan orthoptique', f: 'Que note-t-on dans l’examen de la motilité ?', b: 'Ductions et versions dans les 9 positions, coté de −4 à +4, avec recherche de comitance, de position de blocage et d’un torticolis.' },
  { id: 'bi15', deck: 'Bilan orthoptique', f: 'À quoi sert le synoptophore dans un bilan ?', b: 'À mesurer angle objectif et subjectif, tester les trois degrés de Worth et chiffrer les amplitudes de fusion — et à servir d’outil de rééducation.' },
  { id: 'bi16', deck: 'Bilan orthoptique', f: 'Que recherche-t-on à la lampe à fente dans un bilan orthoptique ?', b: 'Film lacrymal et BUT, état cornéen, chambre antérieure, cristallin, pupille : autant de causes optiques de plainte visuelle.' },
  { id: 'bi17', deck: 'Bilan orthoptique', f: 'Comment décrire un nystagmus ?', b: 'Type (pendulaire / à ressort), plan, sens de la secousse, amplitude, fréquence, influence de la fixation et de l’occlusion, zone de blocage, torticolis associé.' },
  { id: 'bi18', deck: 'Bilan orthoptique', f: 'Que doit contenir la conclusion d’un bilan orthoptique ?', b: 'La synthèse fonctionnelle, le lien avec la plainte, la proposition (rééducation, correction, prisme, surveillance) et les objectifs mesurables.' },

  /* ============================================================
     Rééducation
     ============================================================ */
  { id: 're01', deck: 'Rééducation', f: 'Signes d’une insuffisance de convergence ?', b: 'PPC > 10 cm, exophorie de près décompensée, convergence fusionnelle faible, AC/A bas ; asthénopie et perte de la ligne à la lecture.' },
  { id: 're02', deck: 'Rééducation', f: 'Grandes étapes d’une rééducation de la convergence ?', b: 'Prise de conscience de la diplopie physiologique → convergence volontaire → amplitudes fusionnelles aux prismes → sauts de vergence → automatisation en situation de lecture.' },
  { id: 're03', deck: 'Rééducation', f: 'Comment utilise-t-on la corde de Brock ?', b: 'Fixation successive des perles, en repérant la diplopie physiologique croisée pour les perles proches et homonyme pour les lointaines : contrôle de la convergence et lutte contre la neutralisation.' },
  { id: 're04', deck: 'Rééducation', f: 'Qu’est-ce qu’un exercice de saut de vergence ?', b: 'Une alternance rapide entre deux distances (ou deux prismes) pour travailler la vitesse de réponse fusionnelle, et non seulement l’amplitude.' },
  { id: 're05', deck: 'Rééducation', f: 'Quel exercice pour la souplesse accommodative ?', b: 'Les flippers ± 2,00 D sur un texte de près, puis en binoculaire ; on chronomètre les cycles par minute.' },
  { id: 're06', deck: 'Rééducation', f: 'Signes d’une insuffisance accommodative ?', b: 'Amplitude inférieure au minimum de Hofstetter pour l’âge, flou de près, lenteur de mise au point, céphalées. À distinguer de l’inertie accommodative.' },
  { id: 're07', deck: 'Rééducation', f: 'Comment travaille-t-on la divergence dans un excès de convergence ?', b: 'Prismes base interne progressifs, relâchement accommodatif (verres positifs), travail de loin et exercices de déconvergence contrôlée.' },
  { id: 're08', deck: 'Rééducation', f: 'Que fait-on quand la neutralisation empêche tout exercice ?', b: 'On commence par un travail antisuppressif : anaglyphes rouge-vert, verres striés, synoptophore, cible en diplopie contrôlée pour rendre l’image supprimée consciente.' },
  { id: 're09', deck: 'Rééducation', f: 'Quel intérêt d’un prisme de repos dans une hétérophorie décompensée ?', b: 'Il diminue la demande fusionnelle et soulage l’asthénopie ; il ne rééduque pas, et peut réduire les réserves s’il est prescrit trop tôt.' },
  { id: 're10', deck: 'Rééducation', f: 'Comment fixe-t-on l’objectif d’une rééducation ?', b: 'Sur le symptôme et une valeur mesurable (PPC, amplitudes, cycles de flippers, vitesse de lecture), avec un nombre de séances défini et une réévaluation.' },
  { id: 're11', deck: 'Rééducation', f: 'Que rééduque-t-on dans un trouble neurovisuel ?', b: 'Les stratégies : balayage visuel organisé, repérage, coordination œil-main, compensation d’un déficit du champ, aménagements de l’environnement et des supports.' },
  { id: 're12', deck: 'Rééducation', f: 'Quels conseils d’ergonomie pour l’asthénopie sur écran ?', b: 'Distance ≥ 50–60 cm, écran légèrement sous les yeux, éclairage sans reflet, règle du 20-20-20 (20 min → 20 s → 6 m), clignements et larmes artificielles si BUT court.' },
  { id: 're13', deck: 'Rééducation', f: 'Peut-on rééduquer la convergence accommodative ou tonique ?', b: 'Non : seule la composante fusionnelle se rééduque réellement. Les autres se modifient par la correction optique ou les prismes.' },
  { id: 're14', deck: 'Rééducation', f: 'Quand une rééducation orthoptique est-elle vouée à l’échec ?', b: 'Sans correction optique adaptée, sur une déviation paralytique ou restrictive évolutive, ou sans adhésion du patient aux exercices intercalaires.' },

  /* ============================================================
     Pédiatrie & dépistage
     ============================================================ */
  { id: 'f88', deck: 'Pédiatrie & dépistage', f: 'Doses actuelles d’occlusion dans l’amblyopie ?', b: '2 h/j si amblyopie modérée, 6 h/j si sévère. Toujours après correction optique totale portée 4 à 6 semaines.' },
  { id: 'f89', deck: 'Pédiatrie & dépistage', f: 'Que faire devant tout strabisme unilatéral de l’enfant ?', b: 'Fond d’œil obligatoire pour éliminer un strabisme sensoriel (rétinoblastome, cataracte, cicatrice maculaire).' },
  { id: 'pe01', deck: 'Pédiatrie & dépistage', f: 'Quand se situe la période sensible du développement visuel ?', b: 'Maximale de 0 à 2 ans, décroissante jusqu’à 8–10 ans. C’est à la fois la période de vulnérabilité et celle où le traitement marche.' },
  { id: 'pe02', deck: 'Pédiatrie & dépistage', f: 'Trois grandes causes d’amblyopie fonctionnelle ?', b: 'Strabique, anisométropique (ou réfractive bilatérale forte), et de privation (cataracte, ptôsis, opacité).' },
  { id: 'pe03', deck: 'Pédiatrie & dépistage', f: 'Que signifie une leucocorie et que faire ?', b: 'Reflet pupillaire blanc : rétinoblastome, cataracte congénitale, persistance du vitré primitif, Coats. Fond d’œil en urgence.' },
  { id: 'pe04', deck: 'Pédiatrie & dépistage', f: 'À quoi sert le test de Brückner ?', b: 'À comparer les deux reflets pupillaires à l’ophtalmoscope, à 1 m dans la pénombre : une asymétrie évoque strabisme, anisométropie ou opacité.' },
  { id: 'pe05', deck: 'Pédiatrie & dépistage', f: 'Quel est l’ordre du traitement de l’amblyopie ?', b: 'Correction optique totale d’abord, portée 4 à 6 semaines, puis pénalisation ou occlusion — jamais l’inverse.' },
  { id: 'pe06', deck: 'Pédiatrie & dépistage', f: 'Quelles alternatives à l’occlusion adhésive ?', b: 'Filtres de Bangerter, pénalisation optique (surcorrection en +), atropine sur le bon œil. Mieux acceptées, indiquées dans les amblyopies légères à modérées.' },
  { id: 'pe07', deck: 'Pédiatrie & dépistage', f: 'Quel risque de l’occlusion, et quelle surveillance ?', b: 'L’amblyopie à bascule de l’œil occlus : contrôle de l’acuité des deux yeux à chaque consultation, et sevrage progressif.' },
  { id: 'pe08', deck: 'Pédiatrie & dépistage', f: 'Signes d’appel d’un trouble visuel chez le nourrisson ?', b: 'Absence de poursuite ou de sourire réponse, errance du regard, nystagmus, strabisme après 4 mois, leucocorie, plafonnement, signe digito-oculaire.' },
  { id: 'pe09', deck: 'Pédiatrie & dépistage', f: 'Quelles amétropies traiter systématiquement chez le jeune enfant ?', b: 'Celles qui sont amblyogènes : hypermétropie forte, astigmatisme ≥ 1,50 D, anisométropie ≥ 1,00–1,50 D, myopie forte — indépendamment de la plainte.' },
  { id: 'pe10', deck: 'Pédiatrie & dépistage', f: 'Un strabisme intermittent avant 4 mois est-il pathologique ?', b: 'Il peut encore être physiologique, mais toute déviation constante, ou persistant après 4 mois, impose un avis. En cas de doute, on adresse.' },
  { id: 'pe11', deck: 'Pédiatrie & dépistage', f: 'Quel est l’intérêt du dépistage visuel de 3–4 ans ?', b: 'Repérer les amblyopies unilatérales silencieuses avant la fin de la période sensible, quand l’enfant peut enfin donner une acuité fiable par œil.' },
  { id: 'pe12', deck: 'Pédiatrie & dépistage', f: 'Quels optotypes utiliser chez le jeune enfant ?', b: 'Images appariées ou dessins, E de Snellen orientable, anneaux de Landolt, test de Cadet. Toujours en ligne, jamais isolés seuls.' },
  { id: 'pe13', deck: 'Pédiatrie & dépistage', f: 'Quand suspecter une cataracte congénitale ?', b: 'Devant une leucocorie, un nystagmus, une absence de fixation, un reflet altéré au Brückner. Chirurgie précoce, car la privation crée une amblyopie profonde.' },
  { id: 'pe14', deck: 'Pédiatrie & dépistage', f: 'Quels enfants sont à risque de troubles neurovisuels ?', b: 'Grands prématurés, encéphalopathies, lésions cérébrales acquises, syndromes génétiques. Bilan orthoptique fonctionnel même si l’œil est sain.' },

  /* ============================================================
     Basse vision & contactologie
     ============================================================ */
  { id: 'bv01', deck: 'Basse vision & contactologie', f: 'Définition OMS de la malvoyance et de la cécité ?', b: 'Malvoyance : AV < 3/10 au meilleur œil corrigé ou champ visuel < 20°. Cécité : AV < 1/20.' },
  { id: 'bv02', deck: 'Basse vision & contactologie', f: 'Que contient un bilan de basse vision ?', b: 'Acuité de loin et de près en échelles adaptées, sensibilité aux contrastes, champ visuel, éblouissement, fixation excentrée, et surtout les besoins fonctionnels réels.' },
  { id: 'bv03', deck: 'Basse vision & contactologie', f: 'Quel compromis impose un fort grossissement ?', b: 'Distance de travail et champ perçu diminuent : on choisit l’aide sur la tâche visée, pas sur l’acuité seule.' },
  { id: 'bv04', deck: 'Basse vision & contactologie', f: 'Qu’est-ce que la fixation excentrée en basse vision ?', b: 'L’utilisation volontaire d’une zone rétinienne saine à côté d’un scotome central : elle s’apprend et se rééduque (repérage du point de meilleure vision).' },
  { id: 'bv05', deck: 'Basse vision & contactologie', f: 'Quels leviers non optiques en basse vision ?', b: 'Éclairage dirigé, renforcement des contrastes, agrandissement des caractères, filtres anti-éblouissement, organisation de l’espace, aides électroniques et vocales.' },
  { id: 'bv06', deck: 'Basse vision & contactologie', f: 'Pourquoi préférer les lentilles dans une forte anisométropie ?', b: 'Parce qu’elles réduisent l’aniséiconie (≈ 2 % par dioptrie en lunettes) et suppriment les effets prismatiques du décentrement.' },
  { id: 'bv07', deck: 'Basse vision & contactologie', f: 'Quand une lentille rigide est-elle supérieure à une souple ?', b: 'Dans les astigmatismes irréguliers — kératocône surtout : le ménisque de larmes régularise la surface optique.' },
  { id: 'bv08', deck: 'Basse vision & contactologie', f: 'Principe de l’orthokératologie ?', b: 'Port nocturne d’une lentille rigide qui remodèle temporairement la cornée : vision nette le jour sans correction, et effet de freination myopique.' },
  { id: 'bv09', deck: 'Basse vision & contactologie', f: 'Quelles complications surveiller chez un porteur de lentilles ?', b: 'Hypoxie et néovascularisation, kératite infectieuse (surtout en port prolongé), allergie, sécheresse, dépôts. Toute douleur avec rougeur → retrait et avis.' },
  { id: 'bv10', deck: 'Basse vision & contactologie', f: 'Pourquoi équiper un enfant aphaque en lentilles plutôt qu’en lunettes ?', b: 'Pour éviter une aniséiconie majeure et l’anneau scotomateux d’un verre très positif, et permettre le développement binoculaire.' },

  /* ============================================================
     Pharmacologie
     ============================================================ */
  { id: 'ph01', deck: 'Pharmacologie', f: 'Cycloplégique de référence pour la réfraction de l’enfant ?', b: 'Le cyclopentolate (Skiacol) : 0,5 % avant 1 an, 1 % ensuite, 3 gouttes à 5 min d’intervalle, réfraction à 45 min.' },
  { id: 'ph02', deck: 'Pharmacologie', f: 'Quand préfère-t-on l’atropine au cyclopentolate ?', b: 'Réfraction difficile, hypermétropie forte, ésotropie accommodative, enfant très pigmenté. 0,3 % avant 1 an, 0,5 % ensuite, 2 gouttes/j pendant 3 à 5 jours.' },
  { id: 'ph03', deck: 'Pharmacologie', f: 'Pourquoi le tropicamide ne suffit-il pas pour réfracter un enfant ?', b: 'Parce que son pouvoir cycloplégique est faible : il dilate bien, mais laisse passer une part de l’hypermétropie latente.' },
  { id: 'ph04', deck: 'Pharmacologie', f: 'Effets indésirables à connaître de l’atropine ?', b: 'Rougeur du visage, fièvre, sécheresse buccale, agitation ou somnolence, tachycardie. Prévenir les parents et respecter les doses.' },
  { id: 'ph05', deck: 'Pharmacologie', f: 'Quel collyre est contre-indiqué en cas de risque de fermeture de l’angle ?', b: 'Tout mydriatique : il peut déclencher une crise aiguë chez un sujet à angle étroit. Évaluer l’angle avant de dilater.' },
  { id: 'ph06', deck: 'Pharmacologie', f: 'Que fait la pilocarpine, et quel usage diagnostique ?', b: 'Myotique parasympathomimétique. Diluée, elle contracte une pupille d’Adie (hypersensibilité de dénervation) mais pas une mydriase du III récente.' },
  { id: 'ph07', deck: 'Pharmacologie', f: 'Quel intérêt de l’atropine faible dose (0,01–0,05 %) ?', b: 'Freiner la progression de la myopie de l’enfant, sans cycloplégie gênante ni photophobie marquée.' },
  { id: 'ph08', deck: 'Pharmacologie', f: 'Que faut-il vérifier avant d’instiller un anesthésique de contact ?', b: 'L’absence de port de lentilles, l’information du patient (pas de frottement, protection cornéenne réduite) et le caractère indispensable du geste.' }
];
