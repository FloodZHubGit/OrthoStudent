/* ============================================================
   Base théorique — cours et fiches de synthèse
   ============================================================ */
window.THEORY = [

/* ---------------------------------------------------------- */
{
  id: 'anatomie',
  title: 'Anatomie & physiologie oculaire',
  icon: '👁',
  intro: 'Les bases indispensables : structure du globe, milieux transparents, rétine, voies visuelles et orbite.',
  sections: [
    {
      title: 'Les trois tuniques du globe',
      tag: 'L1',
      html: `
      <p><strong>Le globe oculaire</strong> mesure environ <b>24 mm</b> de diamètre antéro-postérieur chez l'emmétrope adulte (22 mm chez l'hypermétrope fort, 26–30 mm chez le myope fort). Un écart de <b>1 mm</b> de longueur axiale correspond à environ <b>3 dioptries</b> de réfraction.</p>
      <ul>
        <li><strong>Tunique externe (fibreuse)</strong> — la <b>cornée</b> (1/6 antérieur, transparente, avasculaire, 5 couches : épithélium, Bowman, stroma, Descemet, endothélium) et la <b>sclère</b> (5/6 postérieurs, blanche, résistante, insertion des muscles oculomoteurs). Jonction = <b>limbe scléro-cornéen</b>.</li>
        <li><strong>Tunique moyenne (uvée, vasculaire)</strong> — <b>iris</b> (diaphragme, muscles sphincter et dilatateur), <b>corps ciliaire</b> (muscle ciliaire pour l'accommodation + procès ciliaires sécrétant l'humeur aqueuse), <b>choroïde</b> (nutrition de la rétine externe).</li>
        <li><strong>Tunique interne (nerveuse)</strong> — la <b>rétine</b>, prolongement du système nerveux central, 10 couches, s'étendant de la papille à l'<i>ora serrata</i>.</li>
      </ul>
      <p><b>Milieux transparents</b> traversés par la lumière : film lacrymal → cornée → humeur aqueuse → cristallin → vitré → rétine.</p>`
    },
    {
      title: 'Puissance dioptrique de l’œil',
      tag: 'Optique',
      html: `
      <p>L'œil emmétrope a une puissance totale d'environ <b>+60 D</b> :</p>
      <ul>
        <li><strong>Cornée : +42 à +43 D</strong> (soit ~2/3 du pouvoir réfractif). Face antérieure +48 D, face postérieure −6 D. Rayon de courbure ~7,8 mm, indice 1,376.</li>
        <li><strong>Cristallin : +20 à +22 D</strong> au repos, jusqu'à +33 D en accommodation maximale chez l'enfant. Structure : capsule, épithélium, cortex, noyau. Indice variable (gradient).</li>
      </ul>
      <p><b>Points cardinaux</b> de l'œil théorique : point nodal ~7 mm en arrière de la cornée, foyer image sur la rétine à 24 mm, foyer objet à 17 mm en avant.</p>
      <p><b>Astuce de calcul</b> : la formule du dioptre sphérique <code>n'/f' = (n'−n)/R</code> permet de retrouver la puissance cornéenne. Avec R = 7,8 mm, n' = 1,376 : P ≈ 48 D pour la face antérieure.</p>`
    },
    {
      title: 'Rétine et photorécepteurs',
      tag: 'L1',
      html: `
      <ul>
        <li><strong>Cônes</strong> : ~6 millions, concentrés dans la macula, maximum à la <b>fovéola</b> (0,35 mm, exclusivement cônes, pas de vaisseaux, pas de cellules ganglionnaires au-dessus). Vision photopique, des couleurs et des détails fins. Trois types : S (bleu, 420 nm), M (vert, 530 nm), L (rouge, 560 nm).</li>
        <li><strong>Bâtonnets</strong> : ~120 millions, périphériques, absents de la fovéola, pic à 20° d'excentricité. Vision scotopique, sensibilité au mouvement et aux faibles luminances. Pigment : rhodopsine (pic à 500 nm).</li>
      </ul>
      <p><b>Chaîne de transmission</b> : photorécepteur → cellule bipolaire → cellule ganglionnaire → nerf optique. Modulée latéralement par les cellules horizontales et amacrines.</p>
      <p><b>Repères du fond d'œil</b> : la <b>papille</b> mesure ~1,5 mm de diamètre, la macula est située à <b>2 diamètres papillaires (≈4 mm) en temporal</b> et légèrement en dessous du centre papillaire. Rapport artère/veine normal ≈ <b>2/3</b>. Le rapport cup/disc (C/D) normal est ≤ 0,3–0,4.</p>
      <p><b>Effet Purkinje</b> : lors du passage photopique → scotopique, le pic de sensibilité passe de 555 nm à 507 nm : les rouges paraissent plus sombres, les bleus plus clairs.</p>`
    },
    {
      title: 'Voies visuelles',
      tag: 'Neuro',
      html: `
      <p>Rétine → nerf optique → <b>chiasma</b> (décussation des fibres nasales) → bandelettes optiques → corps genouillé latéral (couches 1-2 magnocellulaires, 3-6 parvocellulaires) → radiations optiques → cortex occipital (aire V1, scissure calcarine).</p>
      <p><strong>Corrélations lésionnelles — à connaître par cœur :</strong></p>
      <ul>
        <li><b>Nerf optique</b> → cécité monoculaire homolatérale + DPAR (déficit pupillaire afférent relatif).</li>
        <li><b>Chiasma</b> (adénome hypophysaire) → hémianopsie bitemporale.</li>
        <li><b>Bandelette optique</b> → hémianopsie latérale homonyme controlatérale, incongruente.</li>
        <li><b>Radiations temporales (boucle de Meyer)</b> → quadranopsie supérieure homonyme (« pie in the sky »).</li>
        <li><b>Radiations pariétales</b> → quadranopsie inférieure homonyme.</li>
        <li><b>Cortex occipital</b> → hémianopsie homonyme congruente avec <i>épargne maculaire</i>.</li>
      </ul>`
    },
    {
      title: 'Orbite, annexes et film lacrymal',
      tag: 'L1',
      html: `
      <p>L'<strong>orbite</strong> est une pyramide quadrangulaire de ~30 cm³, formée de 7 os : frontal, zygomatique, maxillaire, lacrymal, ethmoïde, sphénoïde, palatin. Le globe n'occupe que ~1/5 du volume.</p>
      <ul>
        <li><b>Fente sphénoïdale</b> (fissure orbitaire supérieure) : III, IV, VI, V1, veine ophtalmique.</li>
        <li><b>Canal optique</b> : nerf optique (II) + artère ophtalmique.</li>
        <li><b>Anneau de Zinn</b> : origine commune des 4 muscles droits + oblique supérieur.</li>
      </ul>
      <p><strong>Film lacrymal</strong> — 3 couches : lipidique (glandes de Meibomius, limite l'évaporation), aqueuse (glande lacrymale principale + accessoires de Krause et Wolfring), mucinique (cellules caliciformes de la conjonctive). BUT (break-up time) normal &gt; 10 s. Test de Schirmer normal &gt; 10 mm/5 min.</p>`
    }
  ]
},

/* ---------------------------------------------------------- */
{
  id: 'oculomotricite',
  title: 'Oculomotricité',
  icon: '🎯',
  intro: 'Muscles, innervations, lois de la motilité, versions et vergences.',
  sections: [
    {
      title: 'Les six muscles oculomoteurs',
      tag: 'Essentiel',
      html: `
      <table class="tbl">
        <tr><th>Muscle</th><th>Innervation</th><th>Action principale</th><th>Secondaire</th><th>Tertiaire</th></tr>
        <tr><td class="k">Droit latéral</td><td>VI</td><td>Abduction</td><td>—</td><td>—</td></tr>
        <tr><td class="k">Droit médial</td><td>III inf.</td><td>Adduction</td><td>—</td><td>—</td></tr>
        <tr><td class="k">Droit supérieur</td><td>III sup.</td><td>Élévation</td><td>Intorsion</td><td>Adduction</td></tr>
        <tr><td class="k">Droit inférieur</td><td>III inf.</td><td>Abaissement</td><td>Extorsion</td><td>Adduction</td></tr>
        <tr><td class="k">Oblique supérieur</td><td>IV</td><td>Intorsion</td><td>Abaissement</td><td>Abduction</td></tr>
        <tr><td class="k">Oblique inférieur</td><td>III inf.</td><td>Extorsion</td><td>Élévation</td><td>Abduction</td></tr>
      </table>
      <p class="mt16"><strong>Moyen mnémotechnique</strong> : les <b>obliques</b> font l'inverse de ce qu'on croit — l'oblique <i>supérieur</i> ABAISSE, l'oblique <i>inférieur</i> ÉLÈVE. Et « <b>LR6 SO4 tout le reste 3</b> ».</p>
      <p><strong>Spirale de Tillaux</strong> (distance au limbe des insertions des droits) : DM 5,5 mm → DI 6,5 mm → DL 6,9 mm → DS 7,7 mm.</p>
      <p><strong>Angles d'action maximale</strong> : les droits verticaux sont purement élévateurs/abaisseurs en <b>abduction de 23°</b> ; les obliques sont purement élévateur/abaisseur en <b>adduction de 51°</b>.</p>`
    },
    {
      title: 'Les lois de la motilité oculaire',
      tag: 'Essentiel',
      html: `
      <ul>
        <li><strong>Loi de Sherrington (innervation réciproque)</strong> — quand un muscle se contracte, son antagoniste homolatéral se relâche de façon proportionnelle. <i>Ex. : en abduction de l'OD, le droit latéral droit se contracte et le droit médial droit se relâche.</i></li>
        <li><strong>Loi de Hering (égale innervation)</strong> — dans les mouvements conjugués, les muscles synergistes des deux yeux reçoivent une innervation égale et simultanée. C'est cette loi qui explique la <b>déviation secondaire &gt; déviation primaire</b> dans les paralysies.</li>
        <li><strong>Loi de Donders</strong> — à toute position du regard correspond une position de torsion déterminée et invariable, indépendante du chemin parcouru.</li>
        <li><strong>Loi de Listing</strong> — tout mouvement oculaire depuis la position primaire peut être décrit par une rotation unique autour d'un axe situé dans le plan de Listing (plan frontal passant par le centre de rotation).</li>
      </ul>
      <div class="note"><b>Application clinique :</b> la loi de Hering est le fondement du test de Lancaster et de la distinction déviation primaire / déviation secondaire. Faites fixer l'œil parétique : la déviation de l'œil sain (déviation secondaire) sera plus grande.</div>`
    },
    {
      title: 'Ductions, versions, vergences',
      tag: 'Vocabulaire',
      html: `
      <ul>
        <li><strong>Duction</strong> — mouvement monoculaire (adduction, abduction, sursumduction/élévation, deorsumduction/abaissement, incycloduction, excycloduction).</li>
        <li><strong>Version</strong> — mouvement binoculaire conjugué, les deux yeux dans le même sens (dextroversion, lévoversion, sursumversion, deorsumversion, dextro-élévation…).</li>
        <li><strong>Vergence</strong> — mouvement binoculaire disjoint (convergence, divergence, vergence verticale, cyclovergence).</li>
      </ul>
      <p><strong>Cotation des ductions/versions</strong> : hypo-action de −1 à −4, hyper-action de +1 à +4, 0 = normal.</p>
      <p><strong>Les 9 positions du regard</strong> : position primaire, 4 positions secondaires (droite, gauche, haut, bas), 4 positions tertiaires (les diagonales). C'est le tableau classique utilisé pour le bilan de motilité et le test de Lancaster.</p>
      <p><strong>Les 4 systèmes de mouvements oculaires</strong> :</p>
      <ul>
        <li><b>Saccades</b> — 200 à 700°/s, latence 200 ms, amènent une cible sur la fovéa. Générées par le colliculus supérieur / FEF.</li>
        <li><b>Poursuite</b> — jusqu'à 30–50°/s, maintient une cible mobile sur la fovéa, nécessite une cible réelle.</li>
        <li><b>Vestibulo-oculaire (RVO)</b> — compense les mouvements de la tête, latence 10 ms, gain ≈ 1.</li>
        <li><b>Optocinétique</b> — stabilise l'image lors du défilement du champ visuel entier.</li>
      </ul>`
    },
    {
      title: 'Paralysies oculomotrices',
      tag: 'Pathologie',
      html: `
      <p><strong>Paralysie du III (oculomoteur)</strong> — ptôsis, œil en <i>abduction et légère dépression</i> (« divergent et abaissé »), diplopie, mydriase aréactive si atteinte extrinsèque + intrinsèque. <b>Urgence</b> : une atteinte du III avec mydriase évoque un anévrisme de la communicante postérieure.</p>
      <p><strong>Paralysie du IV (trochléaire)</strong> — la plus fréquente des paralysies congénitales. Diplopie verticale et torsionnelle, majorée en regard en bas et en dedans (descente d'escalier, lecture). <b>Torticolis</b> tête inclinée du côté opposé. <b>Signe de Bielschowsky</b> positif : l'inclinaison de la tête du côté atteint majore l'hypertropie.</p>
      <p><strong>Paralysie du VI (abducens)</strong> — la plus fréquente des paralysies acquises. Ésotropie majorée de loin et dans le regard du côté atteint, limitation de l'abduction, torticolis face tournée du côté atteint. Peu localisatrice (long trajet intracrânien, sensible à l'hypertension intracrânienne).</p>
      <p class="mt16"><strong>Test des 3 pas de Parks-Bielschowsky</strong> (diplopie verticale) :</p>
      <ol>
        <li>Quel œil est le plus haut ? → élimine 4 des 8 muscles verticaux.</li>
        <li>Déviation majorée en regard droit ou gauche ? → il ne reste que 2 muscles.</li>
        <li>Déviation majorée en inclinaison de tête droite ou gauche ? → le muscle est identifié.</li>
      </ol>
      <div class="note warn"><b>Piège classique :</b> hypertropie OD majorée en lévoversion et en inclinaison droite → <b>oblique supérieur droit (IV droit)</b>.</div>`
    },
    {
      title: 'Syndromes restrictifs et alphabétiques',
      tag: 'Pathologie',
      html: `
      <ul>
        <li><strong>Syndrome de Duane</strong> — anomalie congénitale de l'innervation (le DL est innervé par le III). Type I : limitation d'abduction ; type II : limitation d'adduction ; type III : les deux. Rétraction du globe et rétrécissement de la fente palpébrale en adduction.</li>
        <li><strong>Syndrome de Brown</strong> — limitation de l'élévation en adduction par restriction de la gaine de l'oblique supérieur. Test de duction forcée positif.</li>
        <li><strong>Orbitopathie dysthyroïdienne</strong> — restriction du droit inférieur (limitation de l'élévation) puis du droit médial. Exophtalmie, rétraction palpébrale. Ordre d'atteinte : <b>I'M SLOw</b> (Inférieur, Médial, Supérieur, Latéral, Obliques).</li>
        <li><strong>Syndromes A et V</strong> — variation de la déviation horizontale entre le regard en haut et en bas. Un écart ≥ 10 Δ (V) ou ≥ 15 Δ (A) est significatif. Souvent liés à une dysfonction des obliques : <i>V</i> = hyperaction des obliques inférieurs, <i>A</i> = hyperaction des obliques supérieurs.</li>
        <li><strong>Fracture du plancher orbitaire (blow-out)</strong> — incarcération du droit inférieur, limitation de l'élévation, énophtalmie, hypoesthésie V2. Test de duction forcée positif.</li>
      </ul>`
    }
  ]
},

/* ---------------------------------------------------------- */
{
  id: 'binoculaire',
  title: 'Vision binoculaire',
  icon: '🔗',
  intro: 'Correspondance rétinienne, fusion, stéréoscopie, phories et amplitudes.',
  sections: [
    {
      title: 'Les bases de la vision binoculaire',
      tag: 'Essentiel',
      html: `
      <p><strong>Correspondance rétinienne normale (CRN)</strong> : les points rétiniens correspondants des deux yeux ont la même direction visuelle subjective. Le lieu géométrique de ces points est l'<b>horoptère</b>.</p>
      <p><strong>Aire de Panum</strong> : zone autour de l'horoptère où deux images légèrement disparates fusionnent encore en une image unique, en donnant la stéréoscopie. Elle est étroite en fovéa (~6') et s'élargit en périphérie.</p>
      <p><strong>Les 3 degrés de Worth</strong> :</p>
      <ol>
        <li><b>Perception simultanée</b> — les deux images sont perçues en même temps.</li>
        <li><b>Fusion</b> — sensorielle (une image unique) et motrice (amplitudes de vergence).</li>
        <li><b>Stéréoscopie</b> — perception du relief à partir de la disparité rétinienne.</li>
      </ol>
      <p><strong>Adaptations sensorielles au strabisme</strong> : neutralisation (suppression), correspondance rétinienne anormale (CRA), amblyopie, fixation excentrique.</p>`
    },
    {
      title: 'Phories, tropies et vocabulaire',
      tag: 'Essentiel',
      html: `
      <table class="tbl">
        <tr><th>Terme</th><th>Signification</th></tr>
        <tr><td class="k">Orthophorie</td><td>Aucune déviation latente</td></tr>
        <tr><td class="k">Hétérophorie</td><td>Déviation latente, compensée par la fusion (révélée à l'occlusion)</td></tr>
        <tr><td class="k">Hétérotropie</td><td>Déviation manifeste, présente en vision binoculaire</td></tr>
        <tr><td class="k">Éso-</td><td>Déviation en dedans (convergence)</td></tr>
        <tr><td class="k">Exo-</td><td>Déviation en dehors (divergence)</td></tr>
        <tr><td class="k">Hyper- / Hypo-</td><td>Déviation vers le haut / vers le bas</td></tr>
        <tr><td class="k">Cyclo-</td><td>Déviation en torsion (incyclo / excyclo)</td></tr>
      </table>
      <p class="mt16"><strong>Valeurs normales des phories</strong> : de loin, orthophorie à 2 Δ d'exophorie. De près, <b>0 à 6 Δ d'exophorie</b> (moyenne 3 Δ). Une ésophorie de près est toujours suspecte.</p>
      <p><strong>Comitance</strong> : la déviation est dite <i>comitante</i> si elle est identique dans toutes les directions du regard (strabismes fonctionnels) et <i>incomitante</i> si elle varie (paralysies, restrictions).</p>`
    },
    {
      title: 'Vergences fusionnelles',
      tag: 'Bilan',
      html: `
      <p>Mesurées avec une barre de prismes ou au synoptophore, on note le <b>flou / rupture / recouvrement</b> (blur / break / recovery).</p>
      <table class="tbl">
        <tr><th>Mesure</th><th>Loin (6 m)</th><th>Près (40 cm)</th></tr>
        <tr><td class="k">Convergence (base externe)</td><td>9 / 19 / 10 Δ</td><td>17 / 21 / 11 Δ</td></tr>
        <tr><td class="k">Divergence (base interne)</td><td>— / 7 / 4 Δ</td><td>13 / 21 / 13 Δ</td></tr>
        <tr><td class="k">Vergence verticale</td><td colspan="2">3 à 4 Δ dans chaque sens</td></tr>
      </table>
      <p class="mt16"><strong>Critère de Sheard</strong> : la réserve fusionnelle opposée à la phorie doit valoir au moins <b>2 fois la phorie</b>. Prisme correcteur = (2 × phorie − réserve) / 3.</p>
      <p><strong>Critère de Percival</strong> : le point de confort doit se situer dans le tiers moyen de la zone de vision binoculaire nette. Prisme = (Réserve max − 2 × Réserve min) / 3.</p>
      <p><strong>PPC (punctum proximum de convergence)</strong> : normal ≤ <b>6–8 cm</b> (point de rupture). Un PPC &gt; 10 cm signe une insuffisance de convergence. On note toujours <i>rupture / recouvrement</i> : ex. « PPC 12/16 cm ».</p>`
    },
    {
      title: 'Rapport AC/A',
      tag: 'Calcul',
      html: `
      <p>Le rapport <strong>AC/A</strong> exprime la quantité de convergence accommodative (en Δ) déclenchée par 1 D d'accommodation. <b>Norme : 3 à 5 Δ/D.</b></p>
      <p><strong>Méthode du gradient</strong> — on mesure la phorie de près sans puis avec un verre (souvent −1 ou +1 D) :</p>
      <p class="mono">AC/A = (phorie avec verre − phorie sans verre) / puissance du verre</p>
      <p><strong>Méthode de l'hétérophorie</strong> :</p>
      <p class="mono">AC/A = DIP(cm) + distance de travail(m) × (phorie VP − phorie VL)</p>
      <p>Convention de signe : ésophorie <b>positive</b>, exophorie <b>négative</b>.</p>
      <div class="note"><b>Interprétation :</b><br>
      • AC/A élevé + ésotropie de près → <i>excès de convergence</i>, indication de verres progressifs / bifocaux.<br>
      • AC/A bas + exophorie de près → <i>insuffisance de convergence</i>, indication de rééducation orthoptique.<br>
      • AC/A élevé + exotropie de loin → <i>excès de divergence</i>.</div>`
    },
    {
      title: 'Tests de vision binoculaire',
      tag: 'Bilan',
      html: `
      <ul>
        <li><strong>Test de Worth</strong> (lunettes rouge-vert, 4 points) — 4 points vus : fusion ; 5 points : diplopie ; 2 points rouges : neutralisation OG ; 3 points verts : neutralisation OD.</li>
        <li><strong>Verre strié de Bagolini</strong> — teste la vision binoculaire dans des conditions quasi naturelles. Croix complète = CRN ou CRA harmonieuse ; branche manquante = scotome de neutralisation.</li>
        <li><strong>Baguette de Maddox</strong> — dissocie complètement : mesure les hétérophories. Maddox horizontal (stries horizontales) → trait vertical → mesure les déviations <i>horizontales</i>.</li>
        <li><strong>Test de Lancaster</strong> — mesure objective de la déviation dans les 9 positions du regard, indispensable au diagnostic des paralysies. Repose sur la loi de Hering.</li>
        <li><strong>Tests stéréoscopiques</strong> — TNO (points aléatoires, 480 → 15"), Titmus/Wirt (mouche 3000", cercles 800 → 40"), Lang (sans lunettes, 1200 → 550"). Norme adulte : ≤ 60".</li>
        <li><strong>Synoptophore</strong> — mesure de l'angle objectif et subjectif, degrés de Worth, amplitudes de fusion, exercices d'orthoptie.</li>
      </ul>`
    }
  ]
},

/* ---------------------------------------------------------- */
{
  id: 'refraction',
  title: 'Réfraction & accommodation',
  icon: '🔬',
  intro: 'Amétropies, examen de réfraction, accommodation et presbytie.',
  sections: [
    {
      title: 'Les amétropies',
      tag: 'Essentiel',
      html: `
      <ul>
        <li><strong>Emmétropie</strong> — le foyer image se forme sur la rétine, œil au repos. Punctum remotum à l'infini.</li>
        <li><strong>Myopie</strong> — œil trop long ou trop convergent : le foyer se forme <i>en avant</i> de la rétine. Corrigée par un verre <b>concave (−)</b>. Punctum remotum à distance finie : PR (m) = 1 / myopie (D). Une myopie de −2 D voit net jusqu'à 50 cm.</li>
        <li><strong>Hypermétropie</strong> — œil trop court : foyer <i>en arrière</i> de la rétine. Corrigée par un verre <b>convexe (+)</b>. Compensée par l'accommodation chez le sujet jeune (hypermétropie latente), d'où l'importance de la <b>cycloplégie</b> chez l'enfant.</li>
        <li><strong>Astigmatisme</strong> — la puissance varie selon les méridiens ; l'image d'un point est une conoïde de Sturm. <i>Conforme (à la règle)</i> : méridien vertical le plus puissant, axe du cylindre négatif proche de 180°. <i>Inverse</i> : axe proche de 90°. <i>Oblique</i> : axe entre 30 et 60° ou 120 et 150°.</li>
        <li><strong>Anisométropie</strong> — différence de réfraction entre les deux yeux. &gt; 1,50 D : risque d'amblyopie chez l'enfant ; &gt; 2 D : aniséiconie gênante en lunettes.</li>
      </ul>`
    },
    {
      title: 'Transposition cylindrique',
      tag: 'Calcul',
      html: `
      <p>Pour passer du cylindre négatif au cylindre positif (ou l'inverse) :</p>
      <ol>
        <li><b>Nouvelle sphère</b> = sphère + cylindre (somme algébrique)</li>
        <li><b>Nouveau cylindre</b> = cylindre changé de signe</li>
        <li><b>Nouvel axe</b> = axe ± 90°</li>
      </ol>
      <p class="mono">Exemple : +2,00 (−1,50 à 180°) → +0,50 (+1,50 à 90°)</p>
      <p><strong>Équivalent sphérique</strong> = sphère + cylindre / 2. Il correspond au cercle de moindre diffusion et sert de repère pour les prescriptions rapides et les lentilles souples sphériques.</p>`
    },
    {
      title: 'Déroulement d’un examen de réfraction subjective',
      tag: 'TP',
      html: `
      <ol>
        <li><strong>Point de départ</strong> — réfraction objective (autoréfractomètre, skiascopie) ou ancienne correction.</li>
        <li><strong>Brouillard</strong> — ajouter +1,00 à +1,50 D pour relâcher l'accommodation, puis réduire par pas de 0,25 D jusqu'à la meilleure acuité (« la sphère la plus convexe donnant la meilleure acuité »).</li>
        <li><strong>Cylindre</strong> — cadran horaire ou cylindres croisés de Jackson (CCJ) : d'abord l'axe (CCJ à cheval sur l'axe), puis la puissance (axes du CCJ alignés avec l'axe du cylindre). Règle : pour +0,50 D de cylindre ajouté, retirer −0,25 D de sphère.</li>
        <li><strong>Contrôle bichrome (duochrome)</strong> — basé sur l'aberration chromatique (~0,5 D entre rouge et vert). Si le <b>rouge est plus net</b> → sous-corrigé en myopie ou surcorrigé en hypermétropie → ajouter du −. « <i>RAM-GAP</i> » : Red Add Minus, Green Add Plus.</li>
        <li><strong>Équilibre binoculaire</strong> — brouillard alterné, test bichrome binoculaire, ou dissociation prismatique verticale (3 Δ).</li>
        <li><strong>Vision de près</strong> — mesure de l'addition chez le presbyte, contrôle sur échelle de Parinaud.</li>
      </ol>
      <div class="note warn"><b>Chez l'enfant</b> : la réfraction sous cycloplégie (cyclopentolate, atropine) est la référence. L'accommodation peut masquer plusieurs dioptries d'hypermétropie et une ésotropie accommodative.</div>`
    },
    {
      title: 'Accommodation et presbytie',
      tag: 'Essentiel',
      html: `
      <p><strong>Mécanisme (théorie de Helmholtz)</strong> : contraction du muscle ciliaire → relâchement de la zonule → le cristallin bombe → la puissance augmente. Innervation parasympathique (III).</p>
      <p><strong>Triade accommodative</strong> : accommodation + convergence + myosis.</p>
      <p><strong>Amplitude d'accommodation — formules de Hofstetter</strong> :</p>
      <ul>
        <li>Maximum = 25 − 0,4 × âge</li>
        <li>Moyenne = 18,5 − 0,3 × âge</li>
        <li>Minimum = 15 − 0,25 × âge</li>
      </ul>
      <p><strong>Presbytie</strong> : apparaît vers 40–45 ans quand l'amplitude devient insuffisante pour la distance de lecture. Addition = besoin (1 / distance en m) − moitié de l'amplitude restante. Repères usuels : 45 ans +1,00 ; 50 ans +1,50 ; 55 ans +2,00 ; 60 ans +2,50 ; 65 ans +3,00.</p>
      <p><strong>Anomalies accommodatives</strong> : insuffisance d'accommodation, excès d'accommodation (spasme), inertie accommodative (flippers ±2,00 : norme 8 à 12 cycles/min en binoculaire, 11 en monoculaire).</p>`
    }
  ]
},

/* ---------------------------------------------------------- */
{
  id: 'strabismes',
  title: 'Strabismes & amblyopie',
  icon: '⚖️',
  intro: 'Classification, sémiologie, traitement des strabismes de l’enfant et de l’adulte.',
  sections: [
    {
      title: 'Classification des strabismes',
      tag: 'Essentiel',
      html: `
      <p><strong>Ésotropie congénitale (précoce)</strong> — avant 6 mois, grand angle (&gt; 30 Δ), stable, fixation croisée, souvent avec nystagmus manifeste-latent, DVD (déviation verticale dissociée), hyperaction des obliques inférieurs. Pas d'anomalie réfractive significative. Traitement chirurgical précoce.</p>
      <p><strong>Ésotropie accommodative</strong> — début 2–4 ans, hypermétropie souvent &gt; +3 D, angle réduit ou annulé par la correction optique totale. Sous-type <i>avec excès de convergence</i> : AC/A élevé, angle de près &gt; angle de loin, indication de double foyer.</p>
      <p><strong>Exotropie intermittente</strong> — la plus fréquente des exotropies. Déviation de loin, en fatigue, à la lumière (fermeture d'un œil au soleil). Classée selon le rapport loin/près : <i>excès de divergence</i>, <i>basique</i>, <i>insuffisance de convergence</i>.</p>
      <p><strong>Microtropie</strong> — angle &lt; 8–10 Δ, souvent avec CRA, fixation excentrique, amblyopie modérée et stéréoscopie fruste. Détectée par le test de l'écran unilatéral avec prisme de 4 Δ.</p>
      <p><strong>Strabismes secondaires</strong> — sensoriels (cataracte, rétinoblastome, cicatrice maculaire : toute strabisme unilatéral impose un examen du fond d'œil !), consécutifs (post-chirurgicaux), paralytiques.</p>`
    },
    {
      title: 'Bilan orthoptique du strabisme',
      tag: 'TP',
      html: `
      <ol>
        <li><strong>Interrogatoire</strong> — âge de début, antécédents familiaux, photos, prématurité, traitement déjà entrepris.</li>
        <li><strong>Acuité visuelle</strong> adaptée à l'âge (regard préférentiel, Cardiff, images de Rossano-Weiss, Pigassou, Sander-Zanlonghi, Monoyer).</li>
        <li><strong>Étude de la fixation</strong> — visuscope, fixation centrale / excentrique.</li>
        <li><strong>Reflets cornéens (Hirschberg / Krimsky)</strong>, angle kappa.</li>
        <li><strong>Cover test</strong> unilatéral (dépiste les tropies) et alterné (mesure la déviation totale), de loin et de près, avec et sans correction.</li>
        <li><strong>Mesure aux prismes</strong> — barre de prismes ou prismes de Berens, jusqu'à neutralisation du mouvement.</li>
        <li><strong>Motilité</strong> — ductions, versions, recherche d'incomitance, syndromes A/V.</li>
        <li><strong>Vision binoculaire</strong> — Worth, Bagolini, TNO/Lang, amplitudes de fusion, PPC.</li>
        <li><strong>Réfraction sous cycloplégie</strong> et fond d'œil.</li>
      </ol>`
    },
    {
      title: 'Amblyopie',
      tag: 'Essentiel',
      html: `
      <p><strong>Définition</strong> : réduction uni- ou bilatérale de l'acuité visuelle sans lésion organique proportionnelle, liée à une perturbation du développement visuel pendant la période sensible (0 à 8–10 ans, maximale de 0 à 2 ans).</p>
      <p><strong>Types</strong> : strabique, anisométropique, de privation (cataracte congénitale, ptôsis — la plus sévère et la plus urgente), amétropique bilatérale, nystagmique.</p>
      <p><strong>Critère</strong> : différence ≥ 2/10 entre les deux yeux, ou AV &lt; 4/10 en bilatéral, avec un test adapté à l'âge.</p>
      <p><strong>Traitement</strong> :</p>
      <ul>
        <li>Correction optique totale portée en permanence (à revoir 4 à 6 semaines après avant d'occlure).</li>
        <li><b>Occlusion</b> de l'œil dominant — le traitement de référence. Doses modernes : 2 h/j pour une amblyopie modérée, 6 h/j pour une amblyopie sévère.</li>
        <li><b>Pénalisation</b> optique (surcorrection) ou pharmacologique (atropine 1 % 1 à 2 fois/semaine) — alternative bien tolérée.</li>
        <li>Surveillance stricte du risque d'amblyopie à bascule.</li>
      </ul>
      <div class="note"><b>Phénomène de crowding</b> (effet d'entassement) : l'œil amblyope lit mieux les optotypes isolés que les optotypes alignés. Toujours mesurer l'acuité avec des lignes entières ou des barres de séparation.</div>`
    },
    {
      title: 'Traitements du strabisme',
      tag: 'Clinique',
      html: `
      <ul>
        <li><strong>Correction optique totale</strong> — première étape, systématique.</li>
        <li><strong>Traitement de l'amblyopie</strong> — avant toute chirurgie.</li>
        <li><strong>Rééducation orthoptique</strong> — surtout pour les insuffisances de convergence, les exotropies intermittentes, les troubles accommodatifs. Peu efficace sur les grands angles constants.</li>
        <li><strong>Prismes</strong> — compensation des petites déviations, prismes de Fresnel en pré-opératoire ou dans les paralysies récentes.</li>
        <li><strong>Toxine botulique</strong> — injection dans le muscle hyperactif, effet transitoire (3 mois), utile dans les paralysies du VI récentes.</li>
        <li><strong>Chirurgie</strong> — reculs (affaiblissement) et résections/plissements (renforcement). Ordre de grandeur : ~3 Δ corrigés par mm de recul du droit médial, ~2,5 Δ par mm sur le droit latéral.</li>
      </ul>`
    }
  ]
},

/* ---------------------------------------------------------- */
{
  id: 'pathologies',
  title: 'Pathologies oculaires',
  icon: '🩺',
  intro: 'Ce qu’un orthoptiste doit reconnaître : segment antérieur, rétine, glaucome, neuro-ophtalmologie.',
  sections: [
    {
      title: 'Glaucome',
      tag: 'Clinique',
      html: `
      <p><strong>Glaucome primitif à angle ouvert</strong> — neuropathie optique chronique, bilatérale, asymétrique, indolore. Facteurs de risque : PIO élevée (norme 10–21 mmHg), âge, antécédents familiaux, myopie forte, cornée fine, origine africaine.</p>
      <p><strong>Triade diagnostique</strong> : PIO, excavation papillaire (C/D ≥ 0,5 ou asymétrie &gt; 0,2), déficit du champ visuel.</p>
      <p><strong>Champ visuel</strong> — les déficits suivent les fibres nerveuses : ressaut nasal, scotome de Bjerrum (arciforme), scotome de Seidel, puis déficit altitudinal. L'<b>épargne centrale</b> est tardive.</p>
      <p><strong>Glaucome aigu par fermeture de l'angle</strong> — urgence : œil rouge et douloureux, baisse d'acuité, halos colorés, cornée trouble, pupille en semi-mydriase aréflexique, nausées. Terrain : hypermétrope, femme, &gt; 50 ans.</p>`
    },
    {
      title: 'Rétine et macula',
      tag: 'Clinique',
      html: `
      <ul>
        <li><strong>DMLA</strong> — forme sèche (drusen, atrophie géographique, évolution lente) et forme humide/exsudative (néovaisseaux choroïdiens, métamorphopsies d'apparition brutale, scotome central). Suivi par grille d'Amsler et OCT ; traitement par anti-VEGF.</li>
        <li><strong>Rétinopathie diabétique</strong> — non proliférante (microanévrismes, hémorragies punctiformes, exsudats secs, nodules cotonneux) puis proliférante (néovaisseaux, hémorragie du vitré, décollement tractionnel). L'œdème maculaire est la première cause de baisse d'acuité.</li>
        <li><strong>Décollement de rétine</strong> — myodésopsies, phosphènes, puis voile/amputation du champ visuel progressive. Urgence chirurgicale.</li>
        <li><strong>Occlusion de la veine centrale de la rétine</strong> — baisse d'acuité brutale unilatérale, fond d'œil « en flammèches » avec hémorragies dans les 4 quadrants, veines dilatées et tortueuses.</li>
        <li><strong>Occlusion de l'artère centrale de la rétine</strong> — cécité monoculaire brutale et indolore, rétine blanche œdémateuse avec macula rouge cerise. Urgence absolue.</li>
        <li><strong>Rétinopathie hypertensive</strong> — signe du croisement, rétrécissement artériolaire, hémorragies, œdème papillaire (stade IV).</li>
      </ul>`
    },
    {
      title: 'Neuro-ophtalmologie',
      tag: 'Clinique',
      html: `
      <p><strong>Névrite optique rétrobulbaire (NORB)</strong> — baisse d'acuité subaiguë unilatérale chez l'adulte jeune, douleur à la mobilisation du globe, dyschromatopsie d'axe rouge-vert, DPAR, scotome central. Fond d'œil normal au début (« le patient ne voit rien et le médecin non plus »). Évoquer la SEP.</p>
      <p><strong>Œdème papillaire</strong> — bilatéral, lié à l'hypertension intracrânienne, avec éclipses visuelles, élargissement de la tache aveugle, acuité longtemps conservée.</p>
      <p><strong>Pupilles</strong> :</p>
      <ul>
        <li><b>DPAR (Marcus Gunn)</b> — atteinte du nerf optique, mis en évidence par le test de l'éclairement alterné.</li>
        <li><b>Syndrome de Claude Bernard-Horner</b> — myosis, ptôsis léger, énophtalmie apparente, anhidrose. Atteinte sympathique.</li>
        <li><b>Pupille d'Adie</b> — mydriase unilatérale, dissociation lumière-accommodation, réaction tonique, hypersensibilité à la pilocarpine diluée.</li>
        <li><b>Argyll Robertson</b> — myosis bilatéral, abolition du réflexe photomoteur avec conservation de l'accommodation-convergence.</li>
      </ul>`
    },
    {
      title: 'Segment antérieur',
      tag: 'Clinique',
      html: `
      <ul>
        <li><strong>Cataracte</strong> — baisse d'acuité progressive, éblouissement, myopisation (cataracte nucléaire), diplopie monoculaire. Formes : nucléaire, corticale, sous-capsulaire postérieure (la plus gênante de près et à la lumière).</li>
        <li><strong>Kératocône</strong> — ectasie cornéenne, astigmatisme irrégulier évolutif, signe de Munson, anneau de Fleischer. Suivi topographique ; cross-linking.</li>
        <li><strong>Œil rouge</strong> : conjonctivite (rouge diffus, pas de douleur, AV normale), kératite (douleur, photophobie, cercle périkératique), uvéite antérieure (douleur, myosis, Tyndall, synéchies), glaucome aigu (voir plus haut).</li>
        <li><strong>Sécheresse oculaire</strong> — BUT, Schirmer, test à la fluorescéine. Très fréquente en pratique orthoptique (travail sur écran).</li>
      </ul>`
    }
  ]
},

/* ---------------------------------------------------------- */
{
  id: 'metier',
  title: 'Le métier & les études',
  icon: '🎓',
  intro: 'Le certificat de capacité, les champs de compétence, la nomenclature.',
  sections: [
    {
      title: 'Les études d’orthoptie',
      tag: 'Repères',
      html: `
      <p>Le <strong>certificat de capacité d'orthoptiste</strong> se prépare en <b>3 ans</b> après le bac (accès via Parcoursup), dans une UFR de médecine. Le diplôme confère le grade de licence.</p>
      <ul>
        <li><b>Année 1</b> — sciences fondamentales (anatomie, physiologie, optique physiologique, biophysique), sémiologie, initiation au bilan.</li>
        <li><b>Année 2</b> — pathologie oculaire, strabologie, neuro-ophtalmologie, basse vision, exploration fonctionnelle, stages cliniques.</li>
        <li><b>Année 3</b> — approfondissement, rééducation, mémoire de fin d'études, stages longs.</li>
      </ul>
      <p>Environ <b>1 200 heures</b> de stage sur les 3 ans : cabinet libéral, hôpital, service de neurologie, centre de basse vision, pédiatrie.</p>`
    },
    {
      title: 'Champs de compétence',
      tag: 'Métier',
      html: `
      <ul>
        <li><strong>Dépistage et bilan</strong> — acuité, réfraction (dans le cadre du protocole organisationnel / travail aidé), motilité, vision binoculaire, champ visuel, vision des couleurs.</li>
        <li><strong>Rééducation</strong> — insuffisance de convergence, troubles accommodatifs, amblyopie, rééducation neurovisuelle après AVC ou traumatisme crânien, rééducation de la basse vision.</li>
        <li><strong>Explorations fonctionnelles</strong> — champ visuel, OCT, rétinographie, topographie, biométrie, électrophysiologie.</li>
        <li><strong>Dépistage précoce</strong> chez l'enfant, bilan des troubles neurovisuels et de l'apprentissage.</li>
        <li><strong>Basse vision</strong> — évaluation fonctionnelle, aides optiques et électroniques, entraînement à la fixation excentrique.</li>
      </ul>
      <p>Modes d'exercice : libéral, salarié en cabinet d'ophtalmologie, hospitalier, centre de santé.</p>`
    },
    {
      title: 'Rédiger un compte rendu de bilan',
      tag: 'TP',
      html: `
      <p>Structure type d'un compte rendu orthoptique :</p>
      <ol>
        <li><strong>Identification</strong> — nom, âge, date, prescripteur, motif de consultation.</li>
        <li><strong>Antécédents</strong> — ophtalmologiques, généraux, familiaux, correction portée.</li>
        <li><strong>Acuité visuelle</strong> — de loin et de près, sans et avec correction, OD / OG / ODG.</li>
        <li><strong>Réfraction</strong> — subjective, éventuellement objective / sous cycloplégie.</li>
        <li><strong>Examen moteur</strong> — reflets, cover test VL/VP, mesures prismatiques, motilité, PPC.</li>
        <li><strong>Examen sensoriel</strong> — Worth, Bagolini, stéréoscopie, amplitudes de fusion.</li>
        <li><strong>Examens complémentaires</strong> — champ visuel, vision des couleurs, accommodation.</li>
        <li><strong>Conclusion et proposition thérapeutique</strong>.</li>
      </ol>
      <div class="note"><b>Notation conventionnelle :</b> « CT VL : ésotropie OG de 25 Δ, CT VP : 30 Δ ; AV OD 10/10 P2, OG 4/10 P4 avec correction ; PPC 10/14 cm ; Worth : 2 points rouges de loin. »</div>`
    }
  ]
}
];
