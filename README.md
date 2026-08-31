# OrthoStudent

Application desktop (Windows / macOS / Linux) pour les étudiants en orthoptie : théorie, calculatrices
cliniques, bilans orthoptiques à interpréter et consultations simulées.

---

## Lancer l'application

```bash
npm install
```

```bash
npm start
```

## Créer un exécutable

**Depuis l'application elle-même**, sans terminal : lancez `npm start`, puis
**Guide → 📦 Créer un exécutable** (ou menu *Fichier → Créer un exécutable…*). Deux cibles sur
Windows :

| | |
|---|---|
| **Application portable** (`.exe`) | Un seul fichier. Rien à installer : on le pose sur le Bureau, on double-clique. C'est ce qui se partage le plus simplement — un bouton **« Mettre sur le Bureau »** fait la copie |
| **Installateur** (`.exe`) | Installation classique, avec raccourci et entrée de désinstallation |

La page montre le journal en direct et un chronomètre — l'empaquetage est long et silencieux, et un
écran figé ressemble à un plantage. Comptez trois à cinq minutes, dont un téléchargement d'une
centaine de mégaoctets la première fois (mis en cache ensuite). Le fichier produit pèse environ
70 Mo : il embarque son propre navigateur.

Trois choses à savoir avant de partager le fichier :

- **Windows affichera un avertissement** au premier lancement (« Windows a protégé votre
  ordinateur ») : l'application n'est pas signée par un certificat payant. *Informations
  complémentaires → Exécuter quand même*. Prévenez la personne, sinon elle n'ira pas plus loin.
- **L'exécutable garde l'icône par défaut d'Electron.** La fabrication depuis l'application désactive
  la signature et la retouche du binaire (`-c.win.signAndEditExecutable=false`) : sans cela,
  electron-builder doit extraire une archive contenant des liens symboliques, ce que Windows refuse
  sans droits administrateur ni mode développeur.
- **La progression ne voyage pas avec le fichier.** Chacun démarre sur une application vierge ; pour
  transférer la vôtre, *Fichier → Exporter ma progression*, puis *Importer* sur l'autre poste.

**En ligne de commande**, le même résultat :

```bash
npm run dist:win
```

```bash
npm run dist:mac
```

> Un installateur macOS ne peut être produit que **sur** un Mac (signature et format `.dmg`).
> De même, `dist:win` doit être lancé sur Windows. Les binaires sortent dans `dist/`.

Les icônes ne sont pas fournies : electron-builder utilise l'icône Electron par défaut.
Pour personnaliser, déposez `build/icon.ico` (256×256) et `build/icon.icns`.

---

## Par où commencer

La barre latérale tient en **douze entrées**, précédées de **Mes UE** : le programme de l'étudiant n'est pas
une ligne parmi d'autres, c'est le point de départ, affiché en tête avec son semestre, son nombre d'UE,
les jours restants avant les partiels et la préparation estimée. En dessous, trois groupes courts :
**Mon travail** (accueil, répétiteur, emploi du temps, réviser, progression), **Pratiquer**
(lecture de bilan, mode patient, rééducation) et **Références** (calculatrices, anatomie, glossaire, guide).

**L'accueil répond à une seule question : que faire maintenant ?** Il porte les cours du jour, le **plan de
travail du jour** — étape par étape, avec ce qui est déjà fait — et l'état du semestre. Les statistiques,
elles, vivent dans **Ma progression** : moyennes, régularité, tableau des exercices notés, journal, profil
et export. Aucune des deux pages ne redit ce que dit l'autre.

**« Je fais quoi, là ? »** — le bouton de l'accueil ouvre **Ma routine**, la première page du guide. Elle
ne décrit rien : elle propose des gestes datés, calculés sur vos données, chacun avec sa durée réelle et
le bouton qui l'ouvre.

| | |
|---|---|
| **Combien de temps ai-je devant moi ?** | *5 min* — les items dus du jour, toutes UE mêlées · *20 min* — une UE : lire le cours, puis se faire interroger dessus · *1 h* — un cas, une lecture de bilan, une consultation |
| **Autour de vos cours** | votre prochain cours, lu dans votre emploi du temps, et les trois moments qui le rendent utile : *la veille* (4 min), *juste après* (5 min, deux lignes dans Mes notes), *trois jours plus tard* (10 min, se faire interroger) |
| **Le cycle d'une UE** | découvrir → mémoriser → se tester → appliquer → composer, avec la durée de chaque étape : une UE entière, c'est une heure et demie répartie sur trois semaines, pas une soirée |
| **Trois pièges** | tout lire sans rien retenir · attendre le week-end · vouloir tout maîtriser |

La bonne question n'est jamais « qu'est-ce que je dois réviser » mais « combien de temps ai-je devant
moi » : choisissez la durée, le reste est déjà décidé.

Deux entrées de moins sans rien retirer : la **séance du jour** est rendue sur l'accueil (son module garde
sa page, où il explique comment le plan est tiré), et **Réviser** réunit les quatre façons
de travailler un contenu — fiches mémo, QCM, examen blanc, cours — sous une seule entrée, avec un onglet
d'accueil qui dit à quoi sert chacun, quand l'ouvrir, et propose un point de départ calé sur le semestre
déclaré : les fiches dues du jour, une série de QCM sur le thème le plus faible, une épreuve limitée aux
thèmes du semestre, le chapitre de cours de l'UE la plus en retard. Les quatre modules restent accessibles
directement (recherche, plan de révision, séance du jour) : ils sont simplement rendus dans un onglet.
Le module **Guide** (groupe *Références* — ou menu *Aide → Guide de démarrage*) explique
en cinq onglets par où entrer, ce que fait chaque famille de modules et à quel moment l'ouvrir.

Les dix premières minutes, dans l'ordre :

1. **Mes UE** — ouvrez votre semestre, cliquez « C'est mon semestre », datez vos partiels : l'accueil,
   les priorités et le plan de révision se calent dessus.
2. **Emploi du temps** — choisissez votre promotion : chaque cours de l'année est alors relié à la
   fiche de l'UE qu'il traite, révisable la veille.
3. **Lecture de bilan** — un premier bilan sur un patient tiré au sort, noté avec l'explication de
   chaque écart.
4. **Mode patient** — une consultation complète ; c'est vous qui choisissez les examens, et chacun
   coûte s'il n'apporte rien.

Ensuite : l'objectif du jour (fiches et QCM) affiché sur l'accueil, une consultation par semaine,
un examen blanc avant les partiels. `Ctrl/Cmd + K` cherche dans tout le contenu à tout moment.

---

## Ce que contient l'application

### Savoir
| Module | Contenu |
|---|---|
| **Mes UE** (2ᵉ entrée du menu) | Le référentiel des 6 semestres : chaque UE avec sa fiche, ses volumes CM / TD / TP, ses ECTS, sa maîtrise calculée et **ce que l'application permet d'en travailler** |
| **Cours & fiches** | 7 chapitres : anatomie & physiologie, oculomotricité, vision binoculaire, réfraction & accommodation, strabismes & amblyopie, pathologies, métier & études |
| **Anatomie interactive** | Coupe du globe cliquable, muscles oculomoteurs, innervation, mode entraînement chronométré |
| **Glossaire** | 50 termes définis, filtrables par catégorie |

**Le programme des études, relié au contenu.** Les six semestres du certificat de capacité —
**180 ECTS**, 2 069 heures d'enseignement, 40 ECTS de stage — sont tabulés semestre par semestre :
volume horaire, répartition CM / TD / TP, crédits, part de stage. En face de chaque UE, l'application
indique ce qu'elle permet d'en travailler, sous forme de raccourcis cliquables :

```
UE3 · Réfraction            70 h (30 CM / 40 TD) · 4 ECTS       maîtrise ●●●○○
   🩻 Lecture de bilan   🩺 Mode patient   🧮 Transposition   🧮 Distance de sommet
   📚 Réfraction & accommodation           ❓ Réviser cette UE  → série de QCM sur les thèmes de l'UE
```

#### D’où vient ce contenu, et ce qu’il vaut

**Il faut le dire avant tout le reste : ces fiches ne sont adossées à aucune source.**
L’application a reçu la liste des UE du certificat de capacité — leurs intitulés, leurs volumes
horaires, leurs crédits. Rien d’autre. Ni syllabus, ni plan de cours, ni document de formateur.

Le découpage de chaque UE en six ou sept parties, et le contenu de ces parties, sont donc une
**reconstruction** : ce qu’un cours portant ce titre couvre habituellement dans un cursus français
d’orthoptie. C’est plausible et c’est cohérent ; ce n’est pas le programme de votre école. Les
chiffres qu’on y trouve — 2 à 3 Δ par millimètre de recul, 80 à 90 % de succès sur l’insuffisance
de convergence, cinq minutes d’antisepsie — sont des ordres de grandeur, pas des valeurs vérifiées,
et plusieurs varient selon les équipes et les années.

L’emploi du temps n’aide pas : les séances CELCAT ne portent que l’intitulé de l’UE, jamais le
détail de ce qui y est enseigné. Il n’existe donc, hors ligne, **aucun signal externe** contre
lequel mesurer la couverture.

**`npm run audit:cours` ne dit pas que le cours est juste.** Il vérifie que les champs sont remplis :
qu’aucune partie n’est sans encart, qu’aucune UE n’est sans tableau ni cas d’application. C’est la
cohérence interne d’un contenu inventé — utile pour éviter les fiches à moitié vides, sans valeur
de validation. Le script le dit lui-même dans son en-tête et dans sa conclusion.

**D’où le seul remède honnête : rendre le contenu corrigible.** Sous chaque partie de cours, un
bouton **« ✏️ Mon cours dit autre chose »** ouvre un champ. Ce qu’on y écrit :

- s’affiche **en tête de la partie**, avant le texte de l’application, sous le libellé *Votre cours dit* ;
- **prime dans le répétiteur** : la réponse commence par la correction, marquée *elle prime sur la fiche* ;
- est transmise au modèle local comme *correction de l’étudiant*, en tête du contexte ;
- **s’imprime** avec la fiche, là où les boutons disparaissent ;
- survit à toute mise à jour du contenu, puisqu’elle vit dans votre progression et non dans les données.

En tête du cours, un encadré rappelle la provenance et compte les parties déjà corrigées. Ce n’est
pas une clause de style rangée dans une page d’aide : elle est là où l’on lit.

**Une fiche par UE — 39 fiches, le cours en condensé.** « Mes UE » est la deuxième entrée du menu,
et la liste des unités d'enseignement s'affiche en premier sur la page, en cartes cliquables portant
chacune son anneau de maîtrise. Chaque UE ouvre une fiche construite pour réviser, pas pour relire :

| Section | Contenu |
|---|---|
| **En une phrase** | de quoi parle l'UE, vraiment |
| **Ce qu'elle attend de vous** | les objectifs, en trois lignes |
| **Le cours en condensé** | **236 parties de cours**, ~10 000 mots de matière — et sous chacune, l'image qui la fait tenir, ce qu'elle donne devant un patient, l'erreur qu'on y fait et la phrase à retenir (voir plus bas) |
| **Les chiffres à connaître par cœur** | **207 valeurs** — spirale de Tillaux, normes de Morgan, doses d'occlusion, latence du PEV, seuils OMS de la basse vision… |
| **À retenir absolument** | ce qu'on doit pouvoir réciter |
| **Les pièges** | les erreurs qui coûtent des points chaque année |
| **Ce qui tombe** | les formes de questions les plus fréquentes |
| **Les tableaux à savoir refaire** | les comparaisons qui tombent, sous la forme où on les récite |
| **Cas d'application** | **3 cas par UE**, de natures différentes — clinique, calcul, décision, urgence, question d'oral ou de méthode |
| **Plan de réponse type** | la question classique de l'UE, et l'ordre dans lequel y répondre |
| **Moyens mnémotechniques** | ceux qui tiennent vraiment |
| **Comment travailler cette UE** | la méthode, concrètement |

**Un cours qui ne se lit pas comme un poly.** Un paragraphe juste et dense se lit une fois et ne se
retient pas. Chaque partie de cours porte donc, sous sa matière, trois encarts et une phrase — la même
structure partout, pour que l'œil sache où aller :

| Sous chaque partie | Ce que ça apporte |
|---|---|
| 💡 **L'image qui reste** | l'analogie qui fait tenir le mécanisme — « le photorécepteur est un tapis roulant », « un prisme pousse la lumière vers sa base et tire l'image vers son arête », « l'épithélium pigmentaire est le service d'entretien de la rétine » |
| 🩺 **En consultation** | ce que la notion donne devant un patient : ce qu'il dit, ce qu'on voit, ce que ça change. Une partie de cours qui ne débouche sur rien de visible ne s'ancre pas |
| ⚠️ **L'erreur classique** | celle qu'on fait *exactement là* — pas les pièges généraux de l'UE, qui ont leur propre carte |
| ⚑ **À retenir** | la phrase qu'on écrirait au tableau si l'on n'avait droit qu'à une ligne. Elle ferme la partie, et elle est cherchable depuis « Toutes les UE » |

**653 encarts sur 236 parties de cours**, environ 15 000 mots ajoutés : chaque partie a sa phrase à
retenir, 159 ont leur image, 162 leur scène de consultation, 96 leur erreur classique. Le tout est
tenu à part des fiches (`src/js/data/uecours.js`), aligné partie par partie sur le plan de l'UE —
`npm run audit` refuse tout décalage.

**Et quatre-vingt-quatre schémas, là où les mots ne suffisent pas.** Certaines notions ne se disent
pas, elles se dessinent : on peut décrire la conoïde de Sturm en trois phrases justes sans que
personne ne la voie. **87 parties de cours portent leur schéma**, entre la matière et les encarts —
et **les 39 fiches d’UE en ont désormais au moins un** :

| | |
|---|---|
| **Structure** | les dix couches de la rétine (et le trajet de la lumière à travers son propre câblage) · les cinq couches de la cornée · **les quatre fonctions de l’épithélium pigmentaire** · l’orbite, ses parois fragiles et ses trois orifices · la spirale de Tillaux · **le trajet des deux obliques, trochlée et angle de 51°** · l’œil comme système optique (+43 / +20 / ≈ +60 D) |
| **Optique** | la conoïde de Sturm · le prisme (rayon vers la base, image vers l’arête) · **la vergence qui s’emballe quand la cible approche** · **la loi de Prentice et le prisme caché dans tout verre** · la transposition cylindrique · la distance de sommet · la skiascopie (ombre directe, inverse, neutre) · l’amplitude d’accommodation qui s’épuise avec l’âge |
| **Acuité** | l’optotype de 5 × 5 et sa minute d’arc · Monoyer contre logMAR · le crowding · **le brouillage et la règle de la sphère la plus convexe** · **les quatre acuités et leurs ordres de grandeur** |
| **Physiologie** | la cascade de phototransduction · les champs récepteurs en centre-pourtour · les voies magno et parvocellulaire · la courbe d’adaptation à l’obscurité et sa cassure |
| **Binoculaire** | les neuf positions du regard · **comitance et incomitance, angle par angle** · **les trois degrés de Worth en escalier** · **les vitesses des mouvements oculaires, de la saccade à la vergence** · l’innervation (LR6 SO4) · Hering et la déviation secondaire · l’horoptère et l’aire de Panum · le cover test unilatéral et alterné · l’AC/A entre loin et près |
| **Neuro & pathologie** | les voies visuelles et les trois formes de déficit qui localisent la lésion · les paralysies du VI, du IV et du III · **les syndromes A et V, où la lettre est le schéma** · **les trois torticolis et ce qu’ils signalent** · **les ésotropies de l’enfant par âge d’apparition** · l’arbre de tri de l’œil rouge · l’excavation papillaire du glaucome · DMLA sèche et exsudative, avec la grille d’Amsler · **le test de l’éclairement alterné et le DPAR** · **les trois pas de Parks** · **pourquoi l’enfant ne voit pas double et l’adulte si** |
| **Explorations** | le champ visuel 24-2 et ses indices MD / PSD · les étages de l’électrophysiologie (EOG, ERG, PEV) · **les axes de confusion colorée et la règle de Köllner** · **le délai et la durée des trois cycloplégiques** · **quel examen pour quelle question dans le diabète** · **pourquoi le suivi se resserre au début** · **OCT maculaire et OCT du nerf optique** |
| **Bilan & prise en charge** | l’ordre du bilan orthoptique · le PPC mesuré trois fois · l’ordre thérapeutique en quatre marches · **ce que l’interrogatoire oriente** · **ce que la rééducation sait faire, et ne fait pas** |
| **Amblyopie & basse vision** | la période sensible · les trois mécanismes d’amblyopie · les trois profils fonctionnels |
| **Méthode & apprentissages** | les quatre modes de transmission en arbres généalogiques · le tableau 2 × 2 sensibilité / spécificité · les saccades et régressions de la lecture · **le développement visuel de la naissance à six ans** |
| **Métier, hygiène, éthique** | **le secret professionnel : qui peut savoir quoi** · **les quatre principes de l’éthique et le dilemme** · **l’accident d’exposition au sang, minute par minute** · **la chaîne de transmission de l’adénovirus et ses trois coupures** · **le décret d’actes et ses trois vérifications** · **la chaîne de survie** |
| **Décider, prendre en charge** | **le raisonnement clinique et ses quatre issues** · **les sept signaux qui imposent un avis médical** · **la dose d’occlusion selon la profondeur** · **recul, résection et les autres gestes chirurgicaux** · **le scotome et le locus rétinien préférentiel** · **l’hémianopsie latérale homonyme** · **nystagmus congénital ou acquis** · **le poste de travail sur écran** · **la pyramide des niveaux de preuve** · **reconnaître un examen ininterprétable** |
| **Métier, méthode, transmission** | **les six temps d’une annonce** · **la question PICO et sa faisabilité** · **les deux pannes d’un parcours de soins** · **évaluation formative ou sommative** · **quel test statistique pour quelle situation** |

Ils sont dessinés en SVG dans le thème de l'application (`src/js/core/uefigs.js`) : aucune couleur en
dur, ils vivent en clair comme en sombre, et s'impriment avec la fiche sans jamais être coupés en deux
pages.

**Onze d'entre eux sont vivants.** Un schéma juste s'oublie ; un schéma qu'on a tordu reste. Ceux-là
portent des curseurs, se redessinent à chaque mouvement, et une phrase sous le dessin nomme ce qu'on
vient de voir — sans elle, on manipule sans savoir ce qu'on a appris.

| Schéma | Ce qu'on manipule | Ce qu'on découvre |
|---|---|---|
| **Conoïde de Sturm** | sphère, cylindre | L'intervalle de Sturm vaut *exactement* le cylindre. Ramenez le cylindre à zéro : la conoïde disparaît, les deux méridiens focalisent au même point |
| **Distance de sommet** | puissance du verre, distance à l'œil | L'écart verre/lentille reste invisible sous ± 4 D, puis explose. Le badge passe à l'ambre au quart de dioptrie |
| **Amplitude d'accommodation** | âge, distance de lecture | La courbe croise la demande, et l'addition nécessaire s'affiche. Reculez le livre à 50 cm : la presbytie attend cinq ans de plus |
| **Le prisme** | puissance en Δ | Le rayon s'incline, l'image monte vers l'arête, l'œil suit — et la conversion Δ → degrés se recalcule |
| **Rapport AC/A** | angle de loin, AC/A, distance de près | L'angle de près se calcule sous vos yeux. Passez l'AC/A de 6 à 2 : l'excès de convergence devient une insuffisance |
| **Excavation papillaire** | rapport C/D | L'anneau neuro-rétinien s'amincit ; le verdict passe de *normale* à *fortement suspecte* |
| **Voies visuelles** | le site de la lésion | Déplacez la lésion du nerf au cortex : le déficit suit — monoculaire, bitemporal, homonyme, quadranopsie temporale, puis homonyme à macula épargnée |
| **Vergence et distance** | la distance de la cible | La relation est hyperbolique, et le curseur le fait sentir : de 2 m à 1 m il n'en coûte qu'une demi-dioptrie, de 25 à 20 cm il en coûte une entière |
| **Loi de Prentice** | puissance du verre, décentrement | Un verre n'est neutre qu'en un seul point. Changez le signe : la base bascule, parce qu'un verre convergent est fait de deux prismes accolés par leur base et un divergent par leurs arêtes |
| **Comitance** | angle de base, incomitance | À zéro, le même angle dans les neuf positions et le verdict reste vert. Montez le curseur : la colonne droite vire au rouge, et l'écran demande un avis neurologique |
| **Le brouillage** | l'écart à la sphère juste | Du côté du plus, l'acuité s'effondre — c'est le brouillard de départ. Du côté du moins, elle ne bouge pas : ce n'est plus le verre qui voit, c'est l'accommodation qui paie, et le patient qui fatigue |

Techniquement, une figure déclare ses `reglages` et une fonction `lire()` ; la fiche fabrique les
curseurs, redessine le SVG en place et met la phrase à jour. Les 73 autres schémas ignorent
simplement le paramètre qu'on leur passe — rien à changer chez elles.

Le cours s'ouvre sur un **sommaire numéroté** qui mène directement à la partie voulue, et annonce son
temps de lecture (« 6 parties · 4 min ») : de quoi décider si on l'ouvre maintenant ou après le
prochain cours.

En tête de fiche, **Réviser cette UE** donne le parcours en six étapes — lire le cours, mémoriser les
chiffres, se faire interroger, répondre aux QCM des thèmes de l'UE, traiter ses cas, composer un examen
blanc limité à ces thèmes — chacune avec un bouton et l'état d'avancement (chiffres mémorisés, items
à revoir aujourd'hui, taux de réussite aux QCM).

**Se faire interroger : on écrit sa réponse avant de la voir.** Découvrir la réponse puis se dire
« je le savais » est le biais central de toute révision. L'écran de récitation l'interdit : un champ
de saisie, `Entrée` pour vérifier, et alors seulement la réponse attendue s'affiche **en face de la
vôtre**. L'application compare les deux et **propose** une note — sur un chiffre la comparaison est
objective, sur une phrase elle ne peut pas l'être, donc elle est pré-sélectionnée et validable d'une
touche, jamais imposée. Le champ n'est pas obligatoire : on peut répondre à voix haute et valider à
vide, c'est plus rapide.

Rien d'autre à l'écran : le titre du module et les onglets s'effacent, il reste une barre fine
(rang, progression, UE, boîte de l'item) et la question. Après chaque note, l'écran annonce quand
l'item reviendra — *Su → dans 5 jours · Presque → demain · Oublié → aujourd'hui* : c'est ce qui rend
l'espacement lisible, et ce qui décourage de cliquer « Su » par facilité. Tout se fait au clavier
sans quitter le champ.

**Une fiche donne 1 386 items interrogeables** sur l'ensemble du cursus — les chiffres à connaître,
les questions d'oral, chaque ligne de tableau lue en masquant une colonne, chaque moyen
mnémotechnique, et les **236 phrases à retenir du cours** (« dites-moi l'essentiel sur ce point » est
la question d'oral la plus fréquente).

**Écouter, quand on ne peut pas lire.** Vingt minutes de trajet, la vaisselle, le chemin du stage :
du temps où l'on ne peut pas regarder un écran, mais où l'on peut très bien répondre. Le bouton
**🎧 Écouter** — à côté de la récitation, et à côté de la révision du jour — pose la question à voix
haute, laisse un silence pour répondre, puis donne la réponse. Trois voix françaises du système, la
vitesse et la durée du silence réglables, tout au clavier (`Espace`, `→`, `←`, `Échap`).

L'essentiel du travail est en amont : nos items sont pleins de symboles qui ne se prononcent pas.
`src/js/core/voix.js` traduit avant de faire lire — « 8 Δ » devient *huit dioptries prismatiques*,
« 10/10 » *dix sur dix*, « le IV » *le quatre*, « AC/A » *A C sur A*, « ≈ 540 µm » *environ
540 micromètres*, et « Δ = 100 × tan θ » se dit en entier. Sans cette couche, la voix ânonne
« delta égale cent multiplié par tan thêta » — ou pire, épelle.

Deux décisions y sont assumées :

- **L'écoute ne fait pas monter les boîtes.** Entendre une réponse n'est pas la retrouver ; compter
  cela comme un rappel réussi gonflerait la maîtrise sans rien installer. La séance est journalisée
  et la journée compte comme travaillée, mais la répétition espacée n'avance pas.
- **Un seul geste, et il ne va que dans le sens honnête.** Pendant la réponse, une touche signale
  « je ne savais pas » et l'item redescend en boîte 1. Ne rien faire ne change rien. On ne peut donc
  que se pénaliser, jamais se flatter — c'est la seule notation fiable les yeux fermés.

### Le répétiteur — quand une notion résiste

L'application savait **tester** ce qu'on sait. Elle n'avait rien pour **débloquer** quelqu'un qui n'a
pas compris. C'est ce que fait le répétiteur (`Ctrl + J` depuis n'importe quel écran) : on écrit la
question comme elle vient, il reconnaît ce qu'on demande, et il répond.

| On écrit | Il rend |
|---|---|
| *je comprends pas l'accommodation* | la définition, **l'analogie qui fait tenir**, le schéma, l'erreur classique, et le passage de cours correspondant |
| *c'est quoi le rapport AC/A ?* | l'entrée du glossaire, sa valeur normale, puis le cours de l'UE qui la travaille |
| *différence entre ésotropie et exotropie* | le tableau d'examen s'il existe, sinon les deux définitions mises face à face |
| *montre-moi le schéma de la rétine* | la figure — avec ses curseurs quand elle est vivante |
| *interroge-moi sur l'UE 9* | cinq questions, **dans le fil**, comptées dans les mêmes boîtes que la récitation |
| *l'astigmatisme, c'est dans quelle UE ?* | l'UE, le semestre, le volume, votre maîtrise, et **votre prochain cours dessus**, daté |
| *qu'est-ce qui tombe en UE3 ?* | le plan type de la question classique, dans l'ordre où il faut la dire |
| *prentice 4 3* | le calcul posé, avec sa formule |
| *je fais quoi aujourd'hui ?* | ce qui est dû, les UE les plus en retard, et votre prochain cours |

**Ce n'est pas une intelligence artificielle, et c'est délibéré.** Rien ne sort de la machine, il n'y
a ni clé d'API ni modèle à installer, et la réponse arrive instantanément. Surtout : le répétiteur ne
rédige rien de son cru. Chaque phrase qu'il rend est tirée du corpus de l'application — les fiches
d'UE, leurs parties de cours, les tableaux d'examen, le glossaire, les schémas — et **chaque réponse
porte sa provenance**, cliquable, sous la bulle. Sur du contenu paramédical révisé avant un partiel,
une réponse plausible mais fausse coûte plus cher que pas de réponse : quand il n'a pas, il le dit.

Deux détails qui font la différence entre un moteur de recherche déguisé et un répétiteur :

- **Il relie un mot à son cours par une donnée tenue à la main**, pas en cherchant le mot dans le
  texte. `uexpand.js` déclare, UE par UE, le vocabulaire dont elle a besoin (199 termes du glossaire
  sur 237). Sans cela, « que veut dire DVD » collait sous la définition d'une déviation verticale
  dissociée le cours sur les prismes — parce que la question contenait « veut ».
- **Chaque partie de cours d'une fiche d'UE porte un « 🤔 Je n'ai pas compris cette partie »** qui
  passe la main au répétiteur. C'est le chemin le plus court entre le moment où l'on bloque et
  quelque chose qui débloque.

Le fil n'est pas stocké — les questions le sont. Les rejouer donne les mêmes réponses, puisque les
données ne bougent pas : quelques centaines d'octets au lieu de plusieurs mégaoctets d'HTML figé.

#### Avec un modèle local, en option

Si [Ollama](https://ollama.com) tourne sur la machine, une barre apparaît en tête du répétiteur et un
bouton **✨ Développer avec l'IA** sous chaque réponse. Le modèle reçoit alors **les mêmes extraits**
que ceux qui ont servi à la réponse, et n'a qu'une tâche : les redire autrement, plus longuement,
pour la question exacte qui a été posée. Rien ne quitte l'ordinateur.

**Le modèle n'apporte pas de connaissance, il apporte de la formulation.** Ce n'est pas une posture,
c'est une mesure. Interrogé à froid sur la transparence cornéenne, `qwen3.5:4b` répond « cellules
kératinocytaires » et « trois plans perpendiculaires » — deux inventions, dites avec aplomb, dans une
matière où l'étudiant n'a aucun moyen de les repérer. Nourri des extraits du cours, à la même
température, le même modèle répond juste et sans rien ajouter. D'où la forme retenue :

- **la réponse du répétiteur s'affiche toujours en premier**, et sans attendre ; celle du modèle
  arrive après, dans un cadre à elle. L'inverse ferait de l'approximation la réponse principale ;
- **deux régimes, deux couleurs.** Cadre **violet** : le modèle a développé vos fiches, les faits sont
  vérifiés. Cadre **ambre** : aucune fiche ne couvrait la question, le modèle a répondu seul — rien
  n'est garanti. Sur « la capitale de la Mongolie », il a donné la bonne ville et inventé la
  traduction de son nom : c'est exactement ce que l'ambre annonce ;
- **le texte du modèle n'est jamais injecté comme HTML.** Il va dans un nœud texte.

**Faut-il laisser le modèle réfléchir ?** Non — et le réglage existe quand même, à l'arrêt. Mesuré sur
`qwen3.5:4b`, même question, même machine :

| | Sans réflexion | Avec réflexion |
|---|---|---|
| Délai | **15 s** | 45 s |
| Jetons dépensés | 177, tous en réponse | 600, tous en réflexion |
| Réponse obtenue | complète | **aucune** — le budget est épuisé avant la première phrase |
| Langue de la réflexion | — | anglais |

Raisonner sert à établir des faits. Ici, les faits sont fournis : il ne reste qu'à les rédiger, et la
réflexion ne fait qu'ajouter de l'attente. Sur un 4 B à treize jetons par seconde, cette attente est
le seul obstacle sérieux à l'usage.

**Si les réponses sont lentes, regardez le GPU avant de changer de modèle.** Ollama n’accélère par
défaut que les cartes NVIDIA et AMD. Sur une machine à GPU Intel — Arc dédiée, ou l’iGPU des Core
Ultra —, il calcule sur le processeur, et il le dit dans son journal de démarrage :

```
dropping integrated GPU; to enable, set OLLAMA_IGPU_ENABLE=1
    library=Vulkan  description="Intel(R) Arc(TM) 130V GPU (8GB)"
```

Le moteur Vulkan est pourtant **déjà livré** avec Ollama (`lib/ollama/vulkan`) : il est simplement
désactivé. Deux variables d’environnement utilisateur suffisent, et il en faut bien **deux** — la
première allume Vulkan, la seconde lève le refus des GPU intégrés :

```bash
setx OLLAMA_VULKAN 1
```

```bash
setx OLLAMA_IGPU_ENABLE 1
```

Redémarrez Ollama, puis vérifiez avec `/api/ps` que `size_vram` égale `size` — le modèle
entier en mémoire GPU. Mesuré sur un Core Ultra 5 226V / Arc 130V, avec `qwen3.5:4b` :

| | Processeur | GPU Vulkan |
|---|---|---|
| Génération | 13,3 tok/s | **20,9 tok/s** |
| Modèle en mémoire GPU | 0 % | **100 %** |
| « expliquez-moi la loi de Prentice », dans l’application | 35 s | **12 s** |
| « différence ésotropie / exotropie » | 50 s | **14 s** |

Le gain dépasse largement celui de la génération seule : la lecture du contexte — plusieurs
centaines de jetons d’extraits à chaque question — profite bien davantage encore du GPU
(90 à 460 jetons/s contre une poignée sur le processeur).

Le pont vers Ollama vit dans le **processus principal** (`main.js`), pas dans la page. Deux raisons :
la CSP de `index.html` est `default-src 'self'` et l'ouvrir vers un port affaiblirait la seule
barrière qui protège l'application ; et Ollama n'accepte que certaines origines, dont `file://` ne
fait pas partie — il faudrait sinon demander à l'étudiant de régler `OLLAMA_ORIGINS`. La réponse
arrive **mot à mot** : à treize jetons par seconde, attendre la fin, c'est trente secondes d'écran
figé.

`npm run repet` pose au répétiteur une batterie de trente-six questions écrites comme on les écrit
vraiment, et rapporte pour chacune l'intention reconnue et la provenance de la réponse.

**La révision du jour, toutes UE mêlées.** On ne vient pas réviser « l'UE 9 » : on vient faire ce qui
est dû aujourd'hui. Le compteur d'items dus de l'en-tête de semestre est donc un bouton — il monte
une file transversale, la plus fragile d'abord, brassée pour que les UE ne reviennent pas toujours
dans le même ordre. Chaque item affiche son UE, et la séance terminée écrit une entrée de récitation
par UE touchée, avec son état de mémoire à jour. Ils ne sont plus tirés au
hasard : chacun a sa mémoire propre, dans les mêmes **cinq boîtes** que les fiches mémo. La séance
remonte d'abord ce qui est **dû aujourd'hui**, et parmi ce qui est dû, ce qui tient le moins bien ;
à boîte égale, l'ordre est brassé, sinon on finit par retenir la place de la réponse plutôt que la
réponse. L'auto-notation a **trois niveaux** — *oublié*, *presque*, *su* — parce que « presque »
n'est ni un échec ni un acquis : *su* fait monter d'une boîte et repousse l'échéance (1, 2, 5, 10
puis 25 jours), *oublié* ramène l'item en boîte 1.

Une barre montre la répartition des items dans les boîtes, des jamais-vus aux installés : 30 % avec
tout le monde en boîte 2 se rattrapent en une séance, 30 % avec la moitié des items jamais vus, non.
Le nombre d'items dus remonte partout — sur la carte de l'UE dans le semestre, dans la liste de
toutes les UE, dans le plan de révision, dans la séance du jour — et chacun de ces endroits lance
directement la série du jour, sans passer par la fiche. Les chiffres partagent leur identifiant avec
les fiches mémo qui en sont tirées : **un même fait n'a qu'une mémoire**, qu'on le révise en
récitation ou en paquet de fiches.

**Rien ne se lit passivement.** Trois cartes qui, jusqu'ici, s'offraient à la relecture demandent
maintenant un effort de rappel — c'est le geste qu'on fait avec sa main sur un poly, en plus fiable :

| Carte | Ce qu'on peut faire |
|---|---|
| **Les chiffres à connaître** | **🙈 Masquer les valeurs** cache la colonne de droite ; chaque valeur se révèle seule au clic, pour vérifier ligne à ligne sans tout rouvrir |
| **Les tableaux à savoir refaire** | un clic sur l'en-tête d'une colonne la masque — on la reconstitue de tête, cellule par cellule. La première colonne reste toujours lisible : c'est l'entrée du tableau |
| **Plan de réponse type** | **🔀 Remettre dans l'ordre** mélange les étapes ; on les clique dans l'ordre où on les dirait, puis on vérifie. Chaque étape mal placée indique la place qu'elle aurait dû occuper — c'est l'épreuve de l'oral, où l'on ne relit pas son plan mais où l'on doit le retrouver |

**Chercher dans la fiche.** Une fiche fait plusieurs milliers de mots répartis en cinq volets : le
champ **Chercher dans cette fiche** efface les volets le temps d'une recherche, ne garde que les
cartes qui répondent, surligne les passages et compte les résultats (« 2 cartes · 6 passages »).
`Échap` vide le champ et tout revient en place — y compris un cas ouvert, une colonne masquée ou une
note en cours de frappe, puisque le rendu n'est pas reconstruit.

**Mes notes.** La seule partie de la fiche que l'application n'écrit pas : ce que le formateur a
insisté, une précision de TD, une question à poser au prochain cours. Elle s'enregistre à la frappe,
sans bouton, suit la fiche à l'impression comme à l'export, et se cherche depuis « Toutes les UE »
au même titre que le contenu livré — une note qu'on ne retrouve pas n'existe pas. Un filtre
**📝 Avec mes notes** et un filtre **🎤 À revoir aujourd'hui** complètent la vue transversale, avec
un tri *le plus à revoir d'abord*.

**Cinq volets plutôt qu'un mur.** Les cartes de la fiche ne s'empilent pas : elles sont réparties
en volets qui répondent chacun à une question — **L'essentiel** (l'UE en un écran : une phrase, six
chiffres, ce qu'il ne faut pas oublier, les pièges, un moyen mnémotechnique, et vos notes), **Le cours**
(le cours en condensé et la place de l'UE dans le cursus), **À savoir par cœur** (chiffres, formules,
notions, tableaux, mnémotechniques, vocabulaire), **S'entraîner** (le parcours, la récitation, les cas,
le plan de réponse) et **Pièges & méthode**. On arrive sur **Le cours** tant que l'UE n'a jamais été
travaillée, sur **L'essentiel** dès qu'elle l'a été. Chaque onglet indique combien de cartes il contient,
et un bouton qui renvoie vers une carte d'un autre volet l'ouvre au passage. À l'impression, tous les
volets sortent : une fiche papier reste complète.

Deux raccourcis évitent de sortir de la fiche pour
travailler : **Réviser ces N chiffres** envoie les valeurs de l'UE dans la répétition espacée, et
**S'entraîner sur ces 3 cas** enchaîne les cas de cette seule UE en mode interrogation, avec
auto-notation, avant de revenir à la fiche.

**117 cas d'application au total**, répartis sur les 39 UE. Chacun porte sa nature (cas clinique,
calcul, décision, urgence, question d'oral, méthode), donne un énoncé, des questions, puis le
raisonnement attendu — masqué tant qu'on n'a pas cherché — et la conclusion telle qu'on la
formulerait à l'oral. L'onglet **Cas** les enchaîne tous, ou par semestre, avec un score.

En pied de fiche, deux tuiles mènent à l'**UE précédente** et à l'**UE suivante** du semestre : on
révise rarement une seule fiche, et repasser par la liste entre chaque coûte deux clics et le fil.

Les fiches sont un condensé de révision : elles ne remplacent ni le cours du formateur, ni les
protocoles du lieu de stage. **Imprimer** produit une version papier propre — la feuille de style
masque l'interface (barre latérale, onglets, boutons) et ce qui entoure la fiche dans la page,
révèle les volets masqués et tous les cas, repasse les blocs colorés en noir sur blanc et évite les
coupures de cartes en milieu de page. **Exporter (.md)** écrit la même fiche en Markdown — le cours
avec ses images, ses exemples cliniques et ses phrases à retenir, les chiffres en tableau, les formules,
les tableaux, les questions d'auto-interrogation, les cas, le plan de réponse et vos notes — pour
l'emporter dans un carnet ou la partager avec la promo.

**Une maîtrise calculée, pas déclarée.** Pour chaque UE, l'application estime votre niveau à partir
de ce que vous avez réellement fait : ce que vous tenez en mémoire item par item (le signal le plus
lourd, parce qu'il vient d'un rappel actif), réussite **et** volume de QCM sur ses thèmes, scores
obtenus dans les modules liés. Le compte est honnête : réciter parfaitement 20 items sur 46 ne fait
pas une UE sue, et un item rappelé une fois hier ne vaut pas un item tenu depuis trois semaines —
c'est la boîte de chaque item qui donne sa valeur. Répondre juste à tous les QCM de réfraction fait
passer l'UE3 de *Non travaillée* à *Solide* ; y ajouter deux bonnes lectures de bilan sur la
réfraction la fait passer *Maîtrisée*. Les UE hors du champ de l'application (anglais, statistiques,
TFE) se cochent à la main. La moyenne pondérée par les ECTS donne la **préparation du semestre**.

**Un plan de révision daté.** Vous indiquez la date de vos partiels : l'application découpe le temps
restant en semaines et distribue les UE par priorité — *ce qui pèse lourd en ECTS et qui n'est pas
maîtrisé d'abord*, une UE dont rien n'est dû aujourd'hui passant derrière. Chaque semaine liste deux à trois UE avec des actions concrètes et cliquables
(série de QCM ciblée, séance pratique, chapitre à relire, fiche d'UE), cochables et
mémorisées. La dernière semaine bascule en « dernière ligne droite » avec examen blanc et fiches
mémo. Le plan **se réordonne** au fur et à mesure que votre maîtrise progresse.

Un **examen blanc ciblé sur une UE** se lance depuis sa fiche : les QCM sont alors tirés uniquement
dans ses thèmes, les postes de calcul et de lecture restant transversaux.

On indique **son semestre** une fois : l'accueil affiche alors la préparation du semestre, le
compte à rebours jusqu'aux partiels et les trois UE à travailler en priorité, et un anneau suit les
ECTS acquis sur 180. La recherche rapide connaît les UE — `ue11`, `basse vision`, ou même une notion
d'une fiche comme `Kestenbaum` ou `Bielschowsky` ouvre l'UE correspondante.

**Chaque calcul est démontré, pas seulement affiché.** Sous le résultat, un bloc *« Comment ce
résultat est obtenu »* donne trois choses : la **formule**, son **application à vos chiffres**, et
le **pourquoi** — le raisonnement qui explique que la formule s'écrive ainsi. Exemple pour un verre
de +4,00 D décentré de 5 mm :

```
formule    Δ = puissance du verre (D) × décentrement (cm)
calcul     Δ = 4 D × 5 mm = 4 × 0,5 cm = 2 Δ
pourquoi   Un verre sphérique n'est un simple verre qu'en son centre optique : partout ailleurs,
           ses deux faces ne sont plus parallèles et il se comporte comme un prisme…
repère     Le décentrement se compte en centimètres : 3 mm = 0,3 cm. C'est l'erreur qui donne
           un facteur 10.
```

Les explications viennent d'un **registre de 20 formules** partagé par toute l'application, si bien
que le même calcul est expliqué de la même façon partout : dans les 11 calculatrices (14 blocs de
démonstration), dans le calcul instantané de `Ctrl+K` (formule appliquée sous le résultat), et dans
la section **« Les formules de cette UE »** des fiches — 12 UE en portent, de l'UE2 Optique à l'UE27
Basse vision.

### Outils — 11 calculatrices
Acuité visuelle (Monoyer ↔ décimal ↔ logMAR ↔ Snellen ↔ Parinaud ↔ MAR ↔ cpd) · prismes et degrés ·
loi de Prentice · Hirschberg / Krimsky / angle kappa · transposition cylindrique et conoïde de Sturm ·
vergence et distances · accommodation et addition (Hofstetter) · rapport AC/A (gradient et hétérophorie) ·
demande de convergence, normes de Morgan, critère de Sheard · distance de sommet et basse vision ·
stéréo-acuité.

### Lecture de bilan — l'exercice noté

Les douze postes de simulation demandaient de refaire le **geste** : glisser un occulteur, approcher
une cible, tourner une molette. Trois problèmes tenaces — le geste à l'écran n'a rien à voir avec le
geste réel, tout reposait sur un patient dessiné à la main, et surtout ce n'est pas ce qui est évalué.
En clinique comme en examen, on vous met un bilan sous les yeux et on vous demande ce que vous en
concluez. Le module fait donc l'inverse : **le compte rendu est donné, l'interprétation est notée.**

**Les questions ne sont pas écrites à la main.** Elles sont dérivées des valeurs cliniques chiffrées
que chaque dossier porte déjà (`case.sim` : acuités, réfraction, angles de loin et de près, PPC,
réserves fusionnelles, stéréo-acuité, fond d'œil, champ visuel). Elles sont donc justes par
construction et suivent le patient : un dossier tiré au sort produit son propre questionnaire.

**Onze examens sont lisibles**, dans l'ordre du bilan : acuité visuelle, réfraction, cover test,
mesure au prisme, motilité, Lancaster, PPC et convergence, bilan sensoriel (Worth, fusion, stéréo),
fond d'œil, vision des couleurs, champ visuel.

**Deux formats**, selon ce qu'on travaille :

| Mode | Ce qu'on voit | Ce que ça entraîne |
|---|---|---|
| **Bilan complet** | tout le dossier d'un coup, toutes les questions, une note globale | le format de l'épreuve : lire un bilan entier et le synthétiser |
| **Examen par examen** | un compte rendu à la fois, interprété avant de passer au suivant | le format de la consultation : conclure au fil de l'eau |

**Une tentative, un patient, une note.** Une couche commune (`src/js/core/drill.js`) tient le déroulé :
un patient tiré au sort ouvre une tentative, la validation la ferme. On ne peut donc pas **valider
deux fois** le même dossier pour empiler les notes, ni **afficher la solution puis valider** — la
tentative est alors explicitement marquée « ne compte pas ».

**Un compte rendu de la même forme partout.** Après validation : la note en grand avec son verdict
(*lecture juste*, *correct à affiner*, *approximatif*, *à reprendre*), un tableau **votre réponse /
le dossier** ligne par ligne, le *pourquoi* de l'écart, et la courbe des dernières lectures avec
moyenne, meilleur score et tendance (*en progrès*, *stable*, *en baisse*).


### Mise en situation
**Mode patient** — le patient arrive avec sa plainte, on l'interroge, on prescrit les examens, on
pose un diagnostic puis une conduite à tenir. Notation sur l'anamnèse, la pertinence du bilan, le
diagnostic et la prise en charge, avec débriefing et compte rendu type.

- **10 cas rédigés** + un **générateur de cas inédits** : dix tableaux cliniques paramétrés
  (insuffisance de convergence, ésotropie accommodative, paralysies du VI et du IV, exotropie
  intermittente, amblyopie, presbytie, DMLA, glaucome, asthénopie) dont le nom, l'âge, la
  latéralité, les angles, la réfraction, les acuités, le PPC et les résultats d'examen sont
  retirés au sort à chaque consultation. Les propositions de diagnostic et de conduite à tenir
  sont mélangées à chaque fois.
- **Le compte rendu ne s'affiche qu'une fois l'examen prescrit.** Tant qu'il ne l'est pas, sa carte
  n'affiche que la question à laquelle il doit répondre. Prescrire livre le compte rendu, rédigé comme
  au dossier et **calculé sur ce patient** — ses valeurs sont cohérentes avec tout le reste du bilan.
- **Reste le plus difficile : l'interpréter.** Chaque compte rendu ouvre ses questions
  d'interprétation, dérivées des valeurs du dossier (`src/js/core/reading.js`, la même couche que la
  Lecture de bilan). Ce sont vos réponses qui sont notées, pas le fait d'avoir cliqué.
- **L'interprétation compte dans la note.** Le résultat est repris sur la carte de l'examen
  (*Interprété — 82 %*), listé dans le débriefing sous **Interprétation des examens**, et la moyenne
  rapporte jusqu'à **5 points** sur la note de consultation. Un compte rendu lu puis quitté sans
  conclusion validée est distingué d'un examen conclu.
- **Prescrire coûte.** Un examen non contributif fait baisser la note, un examen pertinent oublié
  aussi : un bilan est une hypothèse qu'on teste, pas une liste qu'on déroule.

Onze examens sont prescriptibles — acuité, réfraction, cover test, prisme, motilité, Lancaster, PPC,
bilan sensoriel, fond d'œil, vision des couleurs, champ visuel — et chacun reprend du dossier ce qui
le concerne : la réfraction réelle de chaque œil, l'angle de loin et de près, l'œil et le muscle
déficitaires, les réserves fusionnelles et la stéréo-acuité, les points de rupture et de recouvrement,
le relevé périmétrique de chaque œil.

### Rééducation — la prise en charge au long cours
Le diagnostic ne suffit pas : il faut traiter. Quatre patients à prendre en rééducation —
**insuffisance de convergence**, **excès de convergence**, **insuffisance accommodative**,
**amblyopie fonctionnelle** — chacun avec son bilan de départ et ses paramètres à normaliser.

Une séance = une semaine. On compose le programme parmi **12 exercices** (push-up, cordon de Brock,
stéréogrammes en convergence et en divergence, prismes en saut, flippers prismatiques et
accommodatifs, cartes de Hart, anti-suppression, occlusion, poursuites et saccades, synoptophore),
on dose le **travail à domicile**, et le patient évolue selon un modèle qui tient compte de :

- la **pertinence** de chaque exercice pour ce tableau — un exercice contre-indiqué (convergence
  chez un excès de convergence) n'apporte rien et **majore la gêne** ;
- l'**observance**, qui s'effondre si l'on ne prescrit rien à domicile comme si l'on en prescrit
  trop (l'optimum est autour de cinq séances par semaine) ;
- les **rendements décroissants** à l'approche des normes, et une part de variabilité individuelle.

Le patient dit à chaque séance ce qu'il ressent, une courbe suit les paramètres surveillés, et
**on refait un contrôle quand on veut** — PPC, amplitudes de fusion, acuité — sur l'état **courant**
du patient, pas sur son bilan initial. Le bilan final note le
résultat clinique, la pertinence du protocole et le nombre de séances qu'il a fallu.

Trois exercices sont **démontrés visuellement** : le cordon de Brock (avec la diplopie physiologique
et le croisement des deux cordons sur la perle fixée), les stéréogrammes (les trois images perçues,
celle du centre en relief) et les cartes de Hart.

### Révision

**Emploi du temps.** Les séances de l'année, importées depuis l'emploi du temps CELCAT de
l'université, chacune reliée à la fiche de l'UE qu'elle traite. Trois vues : les quinze prochains
jours avec le prochain cours mis en avant, la semaine navigable, et un tableau par UE — volume réel
programmé, prochaine séance, maîtrise estimée. L'accueil affiche ce qui tombe dans la journée et
désigne l'UE à survoler avant. Le groupe se déduit du semestre déclaré (S1–S2 → 1ère année, etc.)
et reste forçable pour qui suit les cours d'une autre promotion.

**Deux façons de mettre à jour**, pour deux publics.

*Depuis l'application* — bouton **↻ Actualiser** du module. Il va chercher les séances publiées
depuis, pour la promotion suivie uniquement (une trentaine de requêtes, ~22 Ko, deux à trois
secondes), et les range dans le stockage local, où elles priment sur le fichier livré. C'est le
chemin pour quelqu'un qui a seulement l'installateur : ni dépôt, ni Node, ni ligne de commande. Le
bouton n'apparaît que dans l'application installée — une page ouverte au navigateur ne peut pas
interroger l'extranet (aucun en-tête CORS), c'est le processus principal d'Electron qui s'en charge.

*Depuis le dépôt* — `npm run edt` régénère `src/js/data/edt.js` pour les trois années, ce qui fixe
le point de départ livré avec l'application. `npm run edt -- --promos` affiche les groupes trouvés.

Aucune requête réseau à l'exécution en dehors de ce bouton : tout marche hors ligne.

**Rien n'est codé en dur.** Les identifiants de groupe portent le millésime de l'année
universitaire (`C2OPTI/261` → 2026-2027) et changent à chaque rentrée. Les deux chemins
redécouvrent donc les promotions à chaque fois, et l'application arbitre entre ses sources par
millésime d'abord, par date de relevé ensuite — une application installée il y a deux ans bascule
seule sur la bonne année dès qu'on actualise. La promotion se choisit par année (1, 2 ou 3), jamais
par identifiant.

L'API ne renvoie que ce qui est déjà saisi : à relancer quand la scolarité publie de nouvelles
semaines. En cas de divergence, l'emploi du temps de l'université fait foi.

**Séance du jour.** Un plan de travail quotidien, construit automatiquement et figé pour la journée :
les fiches réellement dues (dans la limite de l'objectif quotidien), une série de QCM sur le thème où le
taux de réussite est le plus bas, une lecture de bilan sur un dossier différent chaque jour,
l'UE prioritaire du semestre déclaré (ECTS × ce qui reste à maîtriser) et une consultation dès que la
dernière remonte à deux jours. Chaque étape s'exécute dans son module habituel, en surimpression, et
l'avancement se lit dans les compteurs du jour : rien n'est à cocher à la main. Le plan se reconstruit
à minuit, ou dès que le semestre ou l'objectif quotidien change.

QCM (**216 questions, 23 thèmes** — en mode entraînement / examen blanc / points faibles) ·
**268 fiches mémo** en répétition espacée (Leitner 5 boîtes) · tableau de progression avec courbe
et analyse des points faibles.

**Les trente-neuf UE peuvent désormais s’entraîner.** Dix d’entre elles n’étaient reliées à aucun
thème de QCM : leur onglet « S’entraîner » était vide, et l’examen blanc ne pouvait pas les couvrir —
l’hygiène, les urgences, la coordination, la méthodologie, la statistique. Huit thèmes ont été
ouverts et quatre-vingt-quatre questions écrites à partir de ce que disent les fiches : chiffres,
notions à retenir, pièges. Un QCM raté renvoie ainsi à un passage précis du cours.

**Et la banque était biaisée.** Mesure faite sur les 216 questions : la bonne réponse était en **B**
dans 150 cas, et **jamais en D**. Un étudiant qui coche toujours B obtenait 69 % sans rien savoir, et
l’examen blanc devenait un exercice de reconnaissance de forme. Les propositions ont été **tournées**
— une rotation, pas un brassage : elle conserve l’ordre relatif, donc la lisibilité d’une liste qui
progresse. Les vingt-six listes de valeurs numériques déjà rangées ont été laissées telles quelles :
les mélanger produirait « 24 mm / 20 mm / 28 mm », plus difficile à lire sans rien apprendre de plus.
Répartition finale : **54 / 54 / 54 / 54**, sans qu’aucune bonne réponse ne change. Deux explications
qui désignaient une proposition par son rang (« la 1re proposition décrit Sherrington ») ont été
réécrites par leur contenu, ce qui les rend insensibles à tout réordonnancement futur.
**Et un second biais, de la même famille.** La bonne réponse était aussi la plus longue dans 45 % des
cas — le hasard en donnerait 25. La raison est toujours la même : la bonne réponse est complète, avec
ses qualificatifs, et les distracteurs sont expédiés en trois mots. Le remède n’est pas de rembourrer,
c’est de rendre les distracteurs **aussi précis** que la bonne réponse : un distracteur spécifique est
plus plausible, donc moins facile à écarter par la forme — et il enseigne, parce qu’il nomme une
erreur réelle. Quarante-neuf questions ont été retravaillées ainsi.

Le chiffre qui compte n’est pas « la plus longue est la bonne » — un écart de deux caractères ne se
voit pas — mais **« la bonne dépasse la deuxième plus longue d’au moins un quart »**, seul indice
qu’un candidat puisse réellement exploiter : il passe de **25 % à 8 %**. Les listes de valeurs
numériques sont exclues du traitement : allonger « 5 minutes » pour l’aligner sur « 15 à 20 minutes »
n’aurait servi à rien.


**Les chiffres des UE deviennent des fiches.** Les 207 valeurs à connaître par cœur des fiches d'UE
sont converties en cartes de révision, rangées en un paquet par semestre (« Chiffres · Semestre 3 »),
avec le rappel de l'UE d'origine au dos. Elles rejoignent la même répétition espacée et le même
export Anki que les fiches livrées et importées — sans rien avoir à saisir.

**Examen blanc chronométré.** Une épreuve à postes, dans le format d'un partiel ou d'une station
d'ECOS : 6 à 16 postes tirés au sort sous un chronomètre unique (10 à 45 minutes), qu'on parcourt
librement, sans aucune correction avant la fin.

| Nature du poste | Ce qu'il demande | Notation |
|---|---|---|
| **QCM** | une question de la banque | tout ou rien |
| **Calcul clinique** | un énoncé chiffré **généré à la volée** (logMAR, Δ ↔ degrés, Prentice, Hirschberg, transposition, Hofstetter, équivalent sphérique, convergence, punctum remotum, AC/A par gradient, distance de sommet, Snellen) | 100 dans la tolérance, 55 si approchant, 0 sinon |
| **Lecture de bilan** | un **vrai dossier** tiré du générateur de cas — identité, âge, plainte — dont un examen est à interpréter | la part d’items justes ; un poste ouvert mais **non validé** compte 0 |

Le tableau clinique choisi pour chaque poste de lecture correspond à l'examen demandé : une
paralysie du VI ou du IV pour la motilité et le Lancaster, une DMLA ou un glaucome pour le fond
d'œil et le champ visuel, une insuffisance de convergence pour le PPC… La copie corrigée rappelle,
en face de chaque poste, **le tableau clinique du patient que vous aviez devant vous**.

Le chronomètre tourne aussi pendant les postes de lecture. La copie corrigée détaille chaque
poste (votre réponse, l'attendu, la note), la moyenne par nature de poste, le temps utilisé, et
reprend les corrections commentées de tout ce qui a été manqué.

**Objectif du jour et régularité.** L'accueil affiche deux anneaux — fiches revues et QCM répondus
sur l'objectif quotidien — la **série de jours consécutifs** travaillés, et une **carte de chaleur**
des dix-sept dernières semaines. « Ma progression » reprend l'année complète avec le record de
série, le nombre de jours travaillés sur trente et le réglage des objectifs. Une journée est
comptée dès la première fiche, le premier QCM ou le premier exercice noté ; la journée en cours ne
casse pas la série tant qu'elle n'est pas finie.

L'écran **Fiches mémo** est organisé en quatre onglets : *Réviser*, *Importer*, *Mes fiches*, *Anki*.

**Importer ses propres fiches** — ouvrir un fichier, le glisser sur la zone de texte ou coller le
contenu : l'application reconnaît seule le format et affiche un aperçu avant l'ajout. Sont acceptés :

- **CSV complet** (virgule, point-virgule ou tabulation) avec guillemets, virgules à l'intérieur des
  champs, guillemets doublés et retours à la ligne dans un champ — c'est le format d'export de
  NotebookLM, Quizlet et Excel ;
- `::`, barre verticale, tiret long, flèche `→` ;
- `Q :` / `R :`, blocs séparés par une ligne vide, JSON ;
- deux-points en dernier recours, uniquement si les questions obtenues restent courtes.

La notation mathématique (`$Pitx2$`, `$90\%$`), les puces et le gras markdown sont nettoyés au
passage. Les doublons sont écartés.
Les fiches importées rejoignent la même répétition espacée et le même export Anki que celles
livrées avec l'application, et se modifient ou se suppriment depuis l'onglet *Mes fiches*.

> **NotebookLM.** Google ne publie aucune API pour NotebookLM et n'expose aucun moyen d'y connecter
> une application tierce. Le transfert se fait donc par son **export CSV**, lu tel quel par l'onglet
> *Coller / fichier*. La même méthode fonctionne avec Gemini, ChatGPT ou n'importe quel cours en texte.

**Importer une arborescence** (onglet *Arborescence*) — vous rangez vos fiches en dossiers,
l'application recrée la hiérarchie en paquets :

```
Orthoptie/ L1/ UE2 — Optique physiologique/ cristallin.csv
      →  paquet « Orthoptie::L1::UE2 — Optique physiologique::cristallin »
      →  dans Anki : sous-paquets imbriqués, sans réglage supplémentaire
```

Deux sources :

- **Un dossier de cet ordinateur** — parcours récursif sur 5 niveaux, fichiers `.csv .tsv .txt
  .json .md` jusqu'à 2 Mo. Si « Drive pour ordinateur » synchronise votre Drive, c'est déjà un
  dossier local : cette voie suffit, sans aucune configuration.
- **Google Drive en direct** — via l'API officielle, OAuth 2.0 en boucle locale avec PKCE. La
  connexion se fait **dans votre navigateur sur la page de Google** : l'application ne voit jamais
  votre mot de passe. Portée demandée : `drive.readonly` (lecture seule). Les **Google Sheets et
  Docs** natifs sont exportés à la volée en CSV / texte. Le jeton de rafraîchissement est stocké
  en clair dans le dossier de données de l'application et supprimé par « Déconnecter ».

  > Cela nécessite un **ID client OAuth créé dans votre propre projet Google Cloud** (gratuit, une
  > fois pour toutes) : Google ne permet pas de distribuer un identifiant générique pour ce type
  > d'accès. La marche à suivre est détaillée dans l'application.

**Export vers Anki** — deux voies, depuis l'onglet *Anki* :

**Sous-paquets** — Anki hiérarchise avec `::`. Trois modes d'organisation, avec aperçu de
l'arborescence avant l'envoi :

| Mode | Résultat pour un parent `L1` |
|---|---|
| Un sous-paquet par thème | `L1::Chiffres clés`, `L1::Muscles`, `L1::UE Neuro`… |
| Un seul sous-paquet, nommé | `L1::UE2 — Optique physiologique` |
| Tout dans le parent | `L1` |

Le champ parent accepte lui-même un chemin (`L1::Semestre 1`), et propose en autocomplétion les
paquets déjà présents dans votre collection. Les paquets manquants sont créés automatiquement, et
le compte rendu détaille le nombre de fiches ajoutées par sous-paquet. L'export de fichier écrit
une colonne `#deck column:4`, si bien que l'import manuel recrée la même arborescence.

- **Envoi direct** : si Anki est ouvert avec l'add-on gratuit **AnkiConnect**
  (code `2055492159`), les fiches partent dans les paquets choisis en un clic. Tout se passe
  en local sur `127.0.0.1`, aucun identifiant AnkiWeb n'est demandé. Les doublons sont ignorés.
  Le **type de note et les deux champs sont lus dans votre collection** puis choisis dans des menus
  (`Basic`/`Front`/`Back`, `Basique`/`Recto`/`Verso`… selon la langue d'Anki) : rien n'est deviné.
  Le port est réglable si vous avez modifié celui d'AnkiConnect.

  > **Note technique.** Le serveur HTTP d'AnkiConnect ferme la socket après chaque réponse sans
  > l'annoncer. Avec le keep-alive par défaut de Node, environ une requête sur trois échoue en
  > `ECONNRESET`. L'application ouvre donc une socket neuve par requête (`agent: false` +
  > `Connection: close`) et retente jusqu'à trois fois sur erreur réseau — jamais sur une erreur
  > applicative d'Anki (type de note absent, doublon…).
- **Export de fichier** : produit un `.txt` au format « notes en texte brut » d'Anki, avec les
  en-têtes `#separator`, `#notetype` et `#tags column` déjà renseignés — il n'y a rien à régler à
  l'import, et ça marche aussi pour AnkiDroid et AnkiMobile.

Seul le contenu des fiches part vers Anki : la progression OrthoStudent (les cinq boîtes) reste
locale, et Anki applique son propre planning.

---

## Raccourcis

| Raccourci | Action |
|---|---|
| `Ctrl/Cmd + K` | Recherche rapide (modules, cours, glossaire, cas cliniques, QCM, fiches mémo) |
| `Ctrl/Cmd + 1…5` | Accueil, lecture de bilan, mode patient, mes UE, calculatrices |
| `Alt + ←` / `Alt + →` | Écran précédent / suivant — aussi sur les boutons latéraux de la souris |
| `Ctrl/Cmd + J` | Le répétiteur : poser une question en français, depuis n'importe quel écran |
| `Ctrl/Cmd + D` | Thème clair / sombre |
| `Ctrl/Cmd + E` / `I` | Exporter / importer la progression |
| `Échap` | Fermer la fenêtre ouverte en surimpression ou la recherche |
| `Tab`, `Entrée`, `Espace` | Parcourir et activer n'importe quel élément de l'interface |
| `Ctrl/Cmd + P` | Imprimer l'écran affiché — feuille de style dédiée (voir ci-dessous) |
| `Espace`, `1` `2` `3` | Fiches mémo : retourner la carte, puis oublié / difficile / su |
| `Entrée`, `1` `2` `3` | Récitation d'une UE : vérifier sa réponse, puis oublié / presque / su — `Entrée` valide la note proposée, `Échap` quitte |
| `A`–`D` ou `1`–`4`, `Entrée` | QCM et examen blanc : répondre, puis question suivante |
| `Espace`, `→` `←`, `N` | Écoute sans écran : lecture / pause, item suivant / précédent, « je ne savais pas » — `Échap` quitte |

**Calcul instantané.** Taper un calcul dans la recherche rapide affiche le résultat en tête de liste,
sans ouvrir la calculatrice : `5/10`, `20/40`, `logmar 0,3`, `p4` (acuité sous toutes ses notations),
`12 delta`, `2,5°`, `hirschberg 2`, `prentice 4 3`, `45 ans` (Hofstetter et addition), `33 cm`
(vergence, accommodation et convergence demandées), `-2,50 -1,00 90` (transposition, équivalent
sphérique, méridiens, intervalle de Sturm). `Entrée` ouvre la calculatrice complète correspondante.

**Recherche rapide.** Les mots saisis sont cherchés dans le désordre et sans accents (`paralysie iv`,
`acuite logmar`) ; un mot trouvé dans un titre pèse plus lourd qu'un mot trouvé dans le corps du
texte, et la portion correspondante est surlignée. Un résultat ouvre directement l'endroit visé :
la **section de cours** dépliée, le **terme du glossaire** mis en évidence, la **question de QCM**
seule avec sa correction, la **fiche mémo** seule — ces deux dernières sans compter comme une série
dans les statistiques. Champ vide, la liste propose les modules récemment consultés.

**Tout au clavier.** Chaque élément cliquable est atteignable par `Tab` et annoncé comme un bouton :
tuiles, onglets (flèches gauche/droite), sections dépliables, planches d'anatomie, options de QCM.
Les flèches haut/bas déplacent la sélection dans la barre latérale. Une fenêtre ouverte en
surimpression retient le focus tant qu'elle est ouverte et le rend à son point de départ à la
fermeture. Le réglage système « réduire les animations » est respecté.

---

## Architecture

```
main.js              processus principal Electron, menus, dialogues fichier
preload.js           pont contextIsolé (export / import / infos app)
celcat.js            client de l'emploi du temps universitaire (Node, hors page)
scripts/
  fetch-edt.js       fige l'emploi du temps dans src/js/data/edt.js — appelle celcat.js
  audit-donnees.js   vérifie les renvois entre les banques de données (npm run audit)
  audit-cours.js     dit ce qui MANQUE, UE par UE (npm run audit:cours) : une partie sans
                     encart, un vocabulaire mince, un tableau absent — tout ce que l’audit
                     des renvois laisse passer, puisque ces champs sont facultatifs
  smoke.js           rend tous les modules dans une fenêtre sans interface (npm run smoke) —
                     profil Electron jetable : le test ne touche pas votre progression
  repet-essai.js     pose au répétiteur 36 questions écrites comme on les écrit (npm run repet)
                     et rapporte, pour chacune, l’intention reconnue et la provenance
  build-cli.js       lanceur d'electron-builder pour la fabrication depuis l'application :
                     rétablit le drapeau que yargs attend sous Electron en mode Node
src/
  index.html         page unique, scripts classiques (aucune étape de build)
  css/styles.css     thème clair et sombre
  js/core/
    store.js         persistance localStorage, notes, répétition espacée
    ui.js            fabrique DOM, composants (cartes, onglets, tableaux, anneaux)
    text.js          comparer et surligner du texte français (accents, ligatures)
    repet.js         le répétiteur : reconnaître l'intention d'une question posée en
                     français, et y répondre avec le corpus — sans jamais rien rédiger
    ia.js            l'option « modèle local » : consignes, réglages, flux mot à mot —
                     le modèle reformule les extraits, il n'apporte aucun fait
    voix.js          la synthèse vocale, et la traduction de nos symboles en français dit
    optics.js        toutes les formules : acuité, prismes, réfraction, binoculaire, motricité
    reading.js       fabrique les questions d'interprétation à partir des valeurs d'un dossier
    drill.js         déroulé d'une tentative notée : verrou, note, compte rendu, historique
    cards.js         fiches mémo — banque livrée, import, fiches dérivées des UE
    uebank.js        items d'oral et cas d'application extraits des fiches d'UE,
                     avec leur identifiant stable et leur état de mémoire
    uefigs.js        les 84 schémas du cours, dessinés en SVG dans le thème — dont onze
                     « vivants », qui déclarent des curseurs et se redessinent à chaud
  js/data/           contenus : théorie, glossaire, QCM, fiches, cas cliniques, référentiel des UE
    uecours.js       la couche « cours vivant » : image, exemple clinique, erreur et phrase clé
                     pour chaque partie de cours — alignée sur le plan, vérifiée par npm run audit ;
                     les phrases clés alimentent aussi la banque d'interrogation (uebank.js)
    casegen.js       générateur de cas inédits (10 archétypes paramétrés)
    edt.js           emploi du temps de l'année — fichier généré, ne pas éditer
  js/modules/        un fichier par module, enregistré dans window.Modules
    chat.js          l'écran du répétiteur : le fil, les blocs de réponse, l'interrogation
                     déroulée dans la bulle, et la provenance sous chacune
  js/app.js          routeur, historique, recherche, thème, IPC
```

Deux conventions utiles pour ajouter du code :

- `UI.el('div', { onClick: … })` suffit à obtenir un contrôle complet : la fabrique ajoute
  d'elle-même `role="button"`, `tabindex` et l'activation par `Entrée` / `Espace`. Passer un `role`
  explicite (`tab`, `option`…) désactive ce comportement par défaut.
- `render(ctx)` reçoit `ctx.params` : c'est par là que la recherche rapide ouvre un endroit précis
  (`{ chapter, section }`, `{ term }`, `{ qid }`, `{ cardId }`). Chaque appel à `App.go` empile une
  entrée d'historique, sauf quand elle est identique à la précédente — un module qui se redessine
  avec `App.go('patient')` ne pollue donc pas les retours arrière.

`Store.save()` écrit au plus une fois toutes les 120 ms ; l'écriture en attente est forcée à la
fermeture de la fenêtre (`pagehide`, `beforeunload`, passage en arrière-plan).

Les notes d'un module retiré survivent dans le stockage local et fausseraient toutes les moyennes.
Rien n'est effacé — on ne jette pas le travail de quelqu'un : `app.js` déclare au démarrage, via
`Store.setScoreScope()`, les exercices qui existent encore, et seules ces notes-là comptent.

Aucun bundler, aucune dépendance runtime : les scripts sont chargés dans l'ordre par `index.html`.
Ajouter un module = créer `src/js/modules/xxx.js`, l'ajouter au `<script>` de `index.html` et à la
table `NAV` de `app.js`.

La progression est stockée dans le `localStorage` du profil Electron (donc par machine et par
utilisateur), exportable en JSON depuis le menu **Fichier**.

---

## Avertissement

OrthoStudent est un **outil pédagogique**, pas un dispositif médical. Les patients sont fictifs et
leurs dossiers reposent sur des modèles simplifiés destinés à faire comprendre des mécanismes : les
valeurs d'un compte rendu généré sont cohérentes entre elles, pas tirées d'un cas réel. Les normes
citées suivent les références usuelles de l'enseignement français mais ne remplacent ni les cours,
ni les protocoles de stage, ni le jugement clinique. Aucun exercice de cette application ne doit
servir à évaluer une personne réelle, et aucune conclusion tirée ici ne vaut pour un patient réel.
