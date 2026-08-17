# OrthoStudent

Application desktop (Windows / macOS / Linux) pour les étudiants en orthoptie : théorie, calculatrices
cliniques, simulateurs d'examen interactifs et consultations simulées.

---

## Lancer l'application

```bash
npm install
```

```bash
npm start
```

## Créer les installateurs

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
   🔭 Phoroptère virtuel   🔦 Skiascopie   🧮 Transposition   🧮 Distance de sommet
   📚 Réfraction & accommodation           ❓ Réviser cette UE  → série de QCM sur les thèmes de l'UE
```

**Une fiche par UE — 39 fiches, le cours en condensé.** « Mes UE » est la deuxième entrée du menu,
et la liste des unités d'enseignement s'affiche en premier sur la page, en cartes cliquables portant
chacune son anneau de maîtrise. Chaque UE ouvre une fiche construite pour réviser, pas pour relire :

| Section | Contenu |
|---|---|
| **En une phrase** | de quoi parle l'UE, vraiment |
| **Ce qu'elle attend de vous** | les objectifs, en trois lignes |
| **Le cours en condensé** | **206 parties de cours**, ~10 000 mots : la matière enseignée, ramassée et hiérarchisée |
| **Les chiffres à connaître par cœur** | **207 valeurs** — spirale de Tillaux, normes de Morgan, doses d'occlusion, latence du PEV, seuils OMS de la basse vision… |
| **À retenir absolument** | ce qu'on doit pouvoir réciter |
| **Les pièges** | les erreurs qui coûtent des points chaque année |
| **Ce qui tombe** | les formes de questions les plus fréquentes |
| **Comment travailler cette UE** | la méthode, concrètement |

Les fiches sont un condensé de révision : elles ne remplacent ni le cours du formateur, ni les
protocoles du lieu de stage. Un bouton **Imprimer cette fiche** produit une version papier propre :
une feuille de style d'impression masque l'interface (barre latérale, onglets, boutons), repasse les
blocs colorés en noir sur blanc et évite les coupures de cartes en milieu de page.

**Une maîtrise calculée, pas déclarée.** Pour chaque UE, l'application estime votre niveau à partir
de ce que vous avez réellement fait : réussite **et** volume de QCM sur ses thèmes, scores obtenus
dans les modules liés. Répondre juste à tous les QCM de réfraction fait passer l'UE3 de *Non
travaillée* à *Solide* ; y ajouter deux bons scores au phoroptère et en skiascopie la fait passer
*Maîtrisée*. Les UE hors du champ de l'application (anglais, statistiques, TFE) se cochent à la main.
La moyenne pondérée par les ECTS donne la **préparation du semestre**.

**Un plan de révision daté.** Vous indiquez la date de vos partiels : l'application découpe le temps
restant en semaines et distribue les UE par priorité — *ce qui pèse lourd en ECTS et qui n'est pas
maîtrisé d'abord*. Chaque semaine liste deux à trois UE avec des actions concrètes et cliquables
(série de QCM ciblée, séance dans le simulateur, chapitre à relire, fiche d'UE), cochables et
mémorisées. La dernière semaine bascule en « dernière ligne droite » avec examen blanc et fiches
mémo. Le plan **se réordonne** au fur et à mesure que votre maîtrise progresse.

Un **examen blanc ciblé sur une UE** se lance depuis sa fiche : les QCM sont alors tirés uniquement
dans ses thèmes, les postes de calcul et de simulation restant transversaux.

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

### Simulateurs — 12 postes
| Simulateur | Ce que l'on manipule |
|---|---|
| **Phoroptère virtuel** | Molettes sphère / cylindre / axe, occlusion, brouillard, test bichrome, cylindre croisé de Jackson. Le patient a une réfraction cachée tirée au sort ; l'écran d'optotypes est flouté selon le résidu réel (vecteurs de puissance M / J0 / J45, flou anisotrope orienté sur l'axe). |
| **Skiascopie** | Réfraction **objective** au rétinoscope. On balaie la pupille à la souris : le reflet part dans le même sens que la main (ombre **directe**, il manque du plus) ou en sens contraire (ombre **inverse**), s'élargit et s'illumine à l'approche de la neutralisation. Le reflet s'**incline** par rapport à la fente tant qu'on n'est pas sur un méridien principal — c'est la rupture, qui donne l'axe. Verres d'essai, distance de travail réglable (67 cm / 50 cm / 1 m), relevé des méridiens neutralisés, déduction automatique de la réfraction avec le détail de la soustraction du verre de travail. |
| **Échelles d'acuité** | Monoyer, chiffres, anneaux de Landolt, E de Snellen, Parinaud — affichés à leur **taille physique réelle** après calibration de l'écran à la carte bancaire. Barres de crowding, isolement de ligne, mesure sur patient simulé. |
| **Cover test** | Visage animé, écran opaque déplaçable à la souris, écran unilatéral / alterné, loin et près, journal des mouvements de refixation. Diagnostic et amplitude à donner. |
| **Mesure au prisme** | Barre de prismes, choix de la base et de l'œil, prisme visible devant l'œil, écran alterné jusqu'à neutralisation. |
| **Motilité** | 9 positions du regard, ductions et versions, déficit musculaire tiré au sort à identifier. |
| **Test de Lancaster** | Écran quadrillé, mires rouge et verte, fixation OD/OG, tracé automatique des schémas des deux yeux. |
| **Vision binoculaire** | Worth, baguette de Maddox (mesure aux prismes), verres striés de Bagolini, amplitudes de fusion (flou / rupture / recouvrement), stéréoscopie en anaglyphe. |
| **PPC & convergence** | Cible qui se rapproche **à vitesse clinique** (1,5 / 2,5 / 5 cm/s, réglable) : on a le temps de voir l'œil décrocher au point de rupture. Arrêt, reprise, pas de 1 cm pour affiner, puis éloignement jusqu'au recouvrement. |
| **Fond d'œil** | Ophtalmoscope avec panoramique et zoom, filtre anérythre, 13 tableaux (normal, glaucomes, DMLA, rétinopathies diabétique et hypertensive, OVCR, OACR, œdème papillaire, atrophie optique, décollement), mesure du C/D. |
| **Vision des couleurs** | Planches pseudo-isochromatiques générées à la volée, test de classement type D15 avec diagramme, théorie des dyschromatopsies. |
| **Champ visuel & Amsler** | Périmétrie 24-2 en dB ou en échelle de gris, 11 tableaux, grille d'Amsler telle que la décrit le patient. |

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
- **Prescrire un examen, c'est le faire.** Le simulateur s'ouvre par-dessus la consultation
  (fermeture par la croix ou `Échap`), **réglé sur le dossier du patient** et de façon
  **déterministe** — rouvrir deux fois le même examen donne exactement le même résultat. Son
  bandeau rappelle qui est le patient et **ce qu'il faut obtenir** ; aucun simulateur ne propose de
  changer de patient tant qu'un dossier est chargé.
- **Le compte rendu écrit ne s'affiche qu'après.** Tant que l'examen n'est pas réalisé, sa carte
  n'affiche que la consigne. Un bouton *Lire le compte rendu sans manipuler* reste disponible pour
  aller vite, mais il est tracé comme tel.
- **Ce que vous faites dans le simulateur compte.** La note obtenue est reprise sur la carte de
  l'examen (*Réalisé par vous — 82 %*), listée dans le débriefing sous **Gestes techniques**,
  reportée dans le compte rendu, et la moyenne de vos gestes rapporte jusqu'à **5 points** sur la
  note de consultation. Un examen ouvert puis fermé sans validation est distingué d'un examen validé.

| Simulateur | Ce qu'il reprend du dossier |
|---|---|
| Phoroptère | la réfraction réelle de chaque œil |
| Skiascopie | la même réfraction, en mesure objective — bouton « Skiascopie sur ce patient » sous le résultat de la réfraction |
| Acuité | l'œil le plus faible à mesurer |
| Cover test / Prisme | l'angle de loin et de près, phorie ou tropie, dominance |
| Motilité / Lancaster | l'œil et le muscle déficitaires, la déviation de base |
| Vision binoculaire | Worth, Bagolini, phorie au Maddox, réserves fusionnelles, stéréo-acuité |
| PPC | points de rupture et de recouvrement |
| Fond d'œil | une image par œil, stable d'une ouverture à l'autre |
| Champ visuel / Amsler | le relevé de chaque œil et la grille perçue |
| Vision des couleurs | le patient lit les planches, à vous de conclure sur l'axe |

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
**on re-mesure quand on veut dans les vrais simulateurs** — PPC, amplitudes de fusion, acuité —
réglés sur l'état **courant** du patient, pas sur son bilan initial. Le bilan final note le
résultat clinique, la pertinence du protocole et le nombre de séances qu'il a fallu.

Trois exercices sont **démontrés visuellement** : le cordon de Brock (avec la diplopie physiologique
et le croisement des deux cordons sur la perle fixée), les stéréogrammes (les trois images perçues,
celle du centre en relief) et les cartes de Hart.

### Révision
QCM (**132 questions, 15 thèmes** alignés sur le référentiel — dont neuro-ophtalmologie, basse
vision, amblyopie, explorations fonctionnelles, pharmacologie et rééducation — en mode entraînement
/ examen blanc / points faibles) · **257 fiches mémo** en répétition espacée (Leitner 5 boîtes) ·
tableau de progression avec courbe et analyse des points faibles.

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
| **Simulation** | un **vrai dossier** tiré du générateur de cas — identité, âge, plainte — et le simulateur réglé dessus, avec la consigne | la note du simulateur ; un poste ouvert mais **non validé** compte 0 |

Le tableau clinique choisi pour chaque poste de simulation correspond à l'examen demandé : une
paralysie du VI ou du IV pour la motilité et le Lancaster, une DMLA ou un glaucome pour le fond
d'œil et le champ visuel, une insuffisance de convergence pour le PPC… La copie corrigée rappelle,
en face de chaque poste, **le tableau clinique du patient que vous aviez devant vous**.

Le chronomètre tourne aussi pendant les postes de simulation. La copie corrigée détaille chaque
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
| `Ctrl/Cmd + 1…5` | Accueil, phoroptère, cover test, mode patient, calculatrices |
| `Alt + ←` / `Alt + →` | Écran précédent / suivant — aussi sur les boutons latéraux de la souris |
| `Ctrl/Cmd + D` | Thème clair / sombre |
| `Ctrl/Cmd + E` / `I` | Exporter / importer la progression |
| `Échap` | Fermer le simulateur ouvert en surimpression ou la recherche |
| `Tab`, `Entrée`, `Espace` | Parcourir et activer n'importe quel élément de l'interface |
| `Ctrl/Cmd + P` | Imprimer l'écran affiché — feuille de style dédiée (voir ci-dessous) |
| `Espace`, `1` `2` `3` | Fiches mémo : retourner la carte, puis oublié / difficile / su |
| `A`–`D` ou `1`–`4`, `Entrée` | QCM et examen blanc : répondre, puis question suivante |

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
tuiles, onglets (flèches gauche/droite), sections dépliables, planches d'anatomie, cellules de la
barre de prismes. Les flèches haut/bas déplacent la sélection dans la barre latérale ; sur une
molette de phoroptère, les flèches règlent la valeur et `Page ↑`/`Page ↓` avancent par pas de dix.
La modale d'un simulateur retient le focus tant qu'elle est ouverte et le rend à son point de départ
à la fermeture. Le réglage système « réduire les animations » est respecté.

---

## Architecture

```
main.js              processus principal Electron, menus, dialogues fichier
preload.js           pont contextIsolé (export / import / infos app)
src/
  index.html         page unique, scripts classiques (aucune étape de build)
  css/styles.css     thème clair et sombre
  js/core/
    store.js         persistance localStorage, scores, répétition espacée
    ui.js            fabrique DOM, composants (cartes, onglets, molettes, tableaux)
    optics.js        toutes les formules : acuité, prismes, réfraction, binoculaire, motricité
  js/data/           contenus : théorie, glossaire, QCM, fiches, cas cliniques
    casegen.js       générateur de cas inédits (10 archétypes paramétrés)
  js/modules/        un fichier par module, enregistré dans window.Modules
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
fermeture de la fenêtre (`pagehide`) et par `Store.flush()`.

Aucun bundler, aucune dépendance runtime : les scripts sont chargés dans l'ordre par `index.html`.
Ajouter un module = créer `src/js/modules/xxx.js`, l'ajouter au `<script>` de `index.html` et à la
table `NAV` de `app.js`.

La progression est stockée dans le `localStorage` du profil Electron (donc par machine et par
utilisateur), exportable en JSON depuis le menu **Fichier**.

---

## Avertissement

OrthoStudent est un **outil pédagogique**, pas un dispositif médical. Les simulations reposent sur
des modèles simplifiés destinés à faire comprendre des mécanismes ; les images de fond d'œil, les
tracés périmétriques et les planches colorées sont des reconstructions schématiques. Les normes
citées suivent les références usuelles de l'enseignement français mais ne remplacent ni les cours,
ni les protocoles de stage, ni le jugement clinique. Aucune mesure faite dans cette application ne
doit servir à évaluer une personne réelle.
