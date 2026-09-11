/* ============================================================
   Le cours vivant — la couche qui fait tenir une partie de cours
   ------------------------------------------------------------
   ueguide.js donne la matière : un titre, un paragraphe dense.
   C'est juste, c'est complet, et ça se lit comme un poly — donc
   ça ne se retient pas. Ce fichier ajoute à chaque partie les
   quatre choses qui font la différence entre lire et comprendre :

     img : l'image qui reste. Une analogie, une façon de se
           représenter le mécanisme. C'est ce qu'on se redit six
           mois plus tard quand le détail s'est effacé.
     ex  : ce que ça donne devant un patient. Une partie de cours
           qui ne débouche sur rien de visible ne se retient pas ;
           reliée à une scène de consultation, elle s'ancre.
     cle : la phrase à retenir. Une seule, celle qu'on écrirait au
           tableau si on n'avait droit qu'à une ligne.
     err : l'erreur classique sur ce point précis — pas les pièges
           généraux de l'UE (ils vivent dans `pieges`), celle qui
           se fait exactement ici.

   Structure : un tableau par UE, dans l'ordre exact des parties
   de `UE_GUIDE[code].plan`. `npm run audit` vérifie que les deux
   restent alignés — une partie ajoutée au plan sans son entrée
   ici est signalée.

   Toutes les entrées sont facultatives : une partie sans image ni
   exemple s'affiche simplement sans eux. Mieux vaut trois blocs
   justes qu'un quatrième pour faire nombre.
   ============================================================ */
window.UE_COURS = {

/* ============================ SEMESTRE 1 ============================ */

UE01: [
  { img: 'Le photorécepteur est un tapis roulant : il fabrique des disques à la base de son segment externe et l’épithélium pigmentaire mange les plus vieux au sommet. Le tapis se renouvelle en dix jours environ, à vie.',
    cle: 'Dans l’œil, chaque cellule a sacrifié quelque chose pour une fonction : le photorécepteur sa forme banale, la fibre du cristallin son noyau, l’endothélium sa capacité à se diviser.',
    ex: 'C’est ce sacrifice qui explique qu’aucune des trois ne se remplace : une rétinopathie pigmentaire, une cataracte, une cornea guttata ne se « rattrapent » jamais spontanément.' },

  { fig: 'cornee',
    img: 'Un stroma cornéen sain, c’est un mille-feuille dont les feuilles sont régulièrement espacées : la lumière passe sans diffuser. Laissez l’eau entrer, l’espacement se dérègle — et le verre devient dépoli.',
    cle: 'La transparence tient à deux choses : une organisation régulière et une déshydratation active. Perdre l’une ou l’autre, c’est perdre la transparence.',
    ex: 'Le patient ne dit pas « j’ai un œdème de cornée » : il dit qu’il voit des halos colorés autour des phares, et que c’est pire au réveil.' },

  { fig: 'retine',
    img: 'La lumière traverse toute l’épaisseur de la rétine avant d’atteindre les photorécepteurs : on regarde le monde à travers son propre câblage. La fovéola est le seul endroit où les câbles ont été écartés.',
    cle: 'Dix couches, trois neurones en série (photorécepteur → bipolaire → ganglionnaire), deux modulateurs latéraux (horizontales, amacrines).',
    err: 'Réciter les couches à l’envers. On les nomme toujours dans le sens de la profondeur : de la choroïde vers le vitré.' },

  { fig: 'epithelium', img: 'L’épithélium pigmentaire est le service d’entretien de la rétine : il fait le ménage chaque jour, recycle les pièces, éteint la lumière parasite et tient la porte d’entrée.',
    cle: 'Quatre fonctions, une seule monocouche : phagocyter, recycler le rétinal, absorber, faire barrière.',
    ex: 'Quand le service d’entretien fatigue, les déchets s’entassent sous la rétine : ce sont les drusen, premier signe visible de DMLA au fond d’œil.' },

  { fig: 'transmission',
    img: 'Quatre questions suffisent devant un arbre : les filles sont-elles atteintes ? un père a-t-il transmis à son fils ? y a-t-il un saut de génération ? tous les enfants d’une mère atteinte le sont-ils ?',
    cle: 'Un père donne son X à toutes ses filles et jamais à ses fils : c’est ce seul fait qui signe — ou élimine — une transmission liée à l’X.',
    err: 'Conclure « lié à l’X » devant une fratrie de garçons atteints sans avoir vérifié qu’aucune fille n’est touchée : une récessive autosomique peut très bien ne frapper que des garçons, par hasard.' },

  { cle: 'À chaque mode son exemple emblématique : Leber pour la mitochondriale, daltonisme pour l’X, Stargardt pour la récessive, rétinoblastome familial pour la dominante.',
    ex: 'Un adolescent qui se cogne le soir et raconte qu’il ne voit plus rien dans un cinéma : héméralopie, donc bâtonnets, donc rétinopathie pigmentaire jusqu’à preuve du contraire.',
    err: 'Traiter une leucocorie comme une curiosité photographique. C’est un rétinoblastome tant qu’on n’a pas prouvé le contraire, et le pronostic est vital avant d’être visuel.' }
],

UE02: [
  { fig: 'descartes',
    img: 'Un rayon qui change de milieu est un coureur qui passe du bitume au sable : il ralentit, et sa trajectoire se casse. Plus le milieu est réfringent, plus il ralentit, et plus il se rapproche de la perpendiculaire.',
    cle: 'n₁ sin i₁ = n₂ sin i₂. Tout le reste — angle limite, réflexion totale, fibres optiques, condition d’émergence d’un prisme — n’est que cette égalité poussée à sa borne.',
    ex: 'C’est pourquoi un poisson vu de la berge n’est pas là où on le croit, et pourquoi l’œil, dont la cornée sépare l’air (n = 1) des larmes (n = 1,376), fait à lui seul les deux tiers de la puissance de l’œil.',
    err: 'Oublier que sin i₂ ne peut pas dépasser 1. Quand n₁ sin i₁ > n₂, il n’y a pas de solution : le rayon ne sort pas, il est totalement réfléchi. Ce n’est pas une erreur de calcul, c’est le phénomène.' },

  { fig: 'prismeGeo',
    img: 'Un prisme est un dioptre pris deux fois : la lumière se casse en entrant, se casse encore en sortant, et les deux cassures s’ajoutent au lieu de s’annuler — parce que les deux faces ne sont pas parallèles.',
    cle: 'A = r + r′ et D = i + i′ − A. Aux petits angles, D = (n−1)A : c’est la seule forme dont l’orthoptiste se sert, et elle suffit parce qu’un prisme de correction travaille toujours à incidence quasi nulle.',
    ex: 'Une barre de prismes va de 1 à 40 Δ. Un prisme de 4 Δ dévie l’image de 4 cm à un mètre : c’est ce qu’on met devant un œil pour mesurer une hétérophorie au Maddox ou pour compenser une déviation.',
    err: 'Confondre l’angle du prisme A et la déviation D. Un prisme de 8° en verre n’est pas un prisme de 8 Δ : il dévie de 4°, soit 7 Δ.' },

  { fig: 'vergence', img: 'La vergence est la « courbure » du faisceau. Loin, les rayons arrivent plats (vergence nulle) ; plus l’objet se rapproche, plus ils divergent, et plus il faut de puissance pour les remettre au point.',
    cle: 'V = 1/d en mètres : 1 m → 1 D, 50 cm → 2 D, 33 cm → 3 D, 25 cm → 4 D. Ces quatre couples se sachent par cœur, ils reviennent tout le temps.',
    err: 'Oublier que la distance se compte en mètres. 33 cm donne 3 D, pas 0,03 D — l’erreur d’unité est la première cause de résultat aberrant.' },

  { fig: 'dioptreSpherique',
    img: 'Le dioptre sphérique est la brique élémentaire : une surface courbe entre deux indices. Une lentille, c’est deux dioptres dos à dos ; un œil, c’est quatre à la suite. Tout le reste de l’optique se construit là-dessus.',
    cle: 'n′/SA′ − n/SA = (n′−n)/SC. Deux vérifications qui sauvent : f + f′ = SC, et f/f′ = −n/n′. Si l’une des deux tombe faux, c’est une erreur de signe, jamais de calcul.',
    ex: 'La cornée, c’est ce calcul-là : n = 1 (air), n′ = 1,376 (larmes), rayon 7,8 mm. On trouve environ +48 D pour la face antérieure seule — d’où viennent les deux tiers de la puissance de l’œil.',
    err: 'Prendre SC positif parce que « le rayon est de 8 mm ». SC est une mesure ALGÉBRIQUE depuis le sommet : négative si le centre est en amont, positive s’il est en aval. C’est la première cause de vergence trouvée à l’envers.' },

  { fig: 'lentilleMince',
    img: 'Trois rayons suffisent à construire n’importe quelle image : celui qui arrive parallèle repart par le foyer image, celui qui passe par le centre optique ne dévie pas, celui qui vient du foyer objet repart parallèle.',
    cle: 'Toute la construction d’image tient dans ces trois rayons ; le reste n’est que convention de signe.',
    ex: 'C’est le même schéma qui explique pourquoi un myope fort voit son œil rapetissé derrière ses verres, et pourquoi un aphaque voit tout plus grand.' },

  { fig: 'miroirSpherique',
    img: 'Un miroir sphérique, c’est un dioptre où la lumière fait demi-tour au lieu de traverser. Les constructions sont les mêmes, les foyers aussi — seul le sens du retour change, et avec lui le signe.',
    cle: 'SF = SC/2 et 2/SC = 1/SA + 1/SA′. Le foyer est au MILIEU du rayon, pas au centre : c’est la seule chose à retenir pour ne jamais se tromper de moitié.',
    ex: 'Le miroir de dentiste : concave, objet plus près que le foyer, donc image virtuelle, droite et agrandie. C’est le même raisonnement qui explique le miroir grossissant de salle de bain, et son basculement brutal quand on s’en éloigne trop.',
    err: 'Oublier que le centre C d’un miroir CONVEXE est dans l’espace virtuel, donc derrière le miroir. Le placer devant inverse tous les signes et rend l’image réelle alors qu’elle ne peut jamais l’être.' },

  { fig: 'oeilOptique',
    img: 'L’œil n’est pas une lentille, c’est une paire : une cornée très puissante et fixe (+43 D) et un cristallin plus faible mais réglable (+20 D au repos). Le gros du travail est fait avant même que l’image entre dans l’œil.',
    cle: '+60 D au total, dont les deux tiers pour la cornée : le saut d’indice air/larmes est bien plus grand que le saut humeur aqueuse/cristallin.',
    ex: '1 mm de longueur axiale vaut environ 3 D : c’est pourquoi une myopie forte est presque toujours une affaire de globe trop long, pas de cornée trop bombée.' },

  { fig: 'sturm',
    img: 'Le punctum remotum est le point que l’œil voit net sans accommoder. Le myope l’a devant lui, à distance finie ; l’emmétrope à l’infini ; l’hypermétrope « derrière sa tête », donc virtuel.',
    cle: 'Toute amétropie se raconte en une phrase : où se forme l’image par rapport à la rétine, et où se trouve le punctum remotum.',
    ex: 'Le myope de −2,00 D voit net jusqu’à 50 cm sans rien : il lit sans lunettes et se plaint de loin. C’est ce même calcul qui explique qu’il ôte ses verres pour lire en vieillissant.' },

  { fig: 'prisme',
    img: 'Un prisme pousse la lumière vers sa base et tire l’image vers son arête. L’œil, lui, va chercher l’image : il tourne donc vers l’arête.',
    cle: 'Rayon vers la base, image vers l’arête, œil vers l’arête. Trois mots dans le bon ordre et plus aucune erreur de sens.',
    err: 'Poser la base du mauvais côté. On raisonne toujours sur l’œil qu’on veut faire tourner et dans quel sens, jamais sur « où est la déviation ».' },

  { fig: 'prentice', img: 'Un verre correcteur est un prisme partout sauf en un point : son centre optique. Regarder à côté, c’est se prismer soi-même.',
    cle: 'Δ = puissance (D) × décentrement (cm). Un +4,00 décentré de 5 mm, c’est déjà 2 Δ.',
    ex: 'C’est l’explication de la gêne en lecture d’un anisométrope : en abaissant le regard de 8 mm, deux verres différents n’induisent pas le même prisme, et la fusion doit payer la différence.' },

  { fig: 'sommet',
    img: 'Un verre agit à 12 mm de l’œil, une lentille à 0 mm. Ce n’est pas le même verre vu par la même rétine : la vergence qui arrive n’est pas la même.',
    cle: 'Rapprocher un verre négatif de l’œil oblige à en mettre moins ; rapprocher un verre positif oblige à en mettre plus.',
    err: 'Appliquer la correction de distance de sommet sous ±4 D : l’écart y est inférieur au quart de dioptrie, donc invisible. Au-delà, l’ignorer devient une faute.' }
],

UE03: [
  { fig: 'skiascopie',
    img: 'La skiascopie, c’est lire le sens d’une ombre : la lueur pupillaire se déplace comme votre main (ombre directe, il manque du plus) ou à contresens (ombre inverse, il y a trop de plus). Le neutre, c’est le moment où toute la pupille s’allume d’un coup.',
    cle: 'Ombre directe → ajouter du plus ; ombre inverse → ajouter du moins ; puis retrancher la distance de travail.',
    err: 'Oublier de retrancher la distance de travail. À 50 cm, on a mis 2 D de trop dans la mesure : ne pas les enlever myopise toute la réfraction.' },

  { cle: 'L’autoréfractomètre donne un point de départ, jamais une prescription.',
    ex: 'Chez l’enfant, il myopise presque toujours : l’appareil est proche, l’enfant accommode dessus. C’est exactement la situation où la cycloplégie n’est pas une option.',
    err: 'Prendre au sérieux une mesure automatique sur cornée irrégulière, sur film lacrymal instable ou sur cataracte : l’appareil rend un chiffre, pas une vérité.' },

  { fig: 'brouillage', img: 'Le brouillard, c’est mettre l’œil délibérément en myopie : tant qu’il est brouillé, il n’a plus aucun intérêt à accommoder. On lève ensuite le brouillard par quarts de dioptrie.',
    cle: 'On cherche toujours la meilleure acuité avec le plus de plus (ou le moins de moins) possible.',
    err: 'Descendre trop vite en négatif parce que le patient dit « c’est plus net » : plus petit et plus contrasté n’est pas plus net — c’est de l’accommodation qui s’installe.' },

  { fig: 'transposition',
    img: 'Le cylindre croisé est une balance : on présente deux positions, le patient choisit la moins mauvaise, et on avance d’un pas vers son choix. On s’arrête quand les deux sont également mauvaises.',
    cle: 'L’axe d’abord, la puissance ensuite — et on revérifie la sphère après, puisque changer le cylindre déplace l’équivalent sphérique.',
    err: 'Chercher la puissance avant l’axe. Sur un axe faux, aucune puissance n’est bonne, et le patient répond au hasard.' },

  { img: 'Le bichrome joue sur l’aberration chromatique de l’œil : le rouge focalise un peu en arrière, le vert un peu en avant. Si le rouge est plus net, l’image est trop en arrière — l’œil est sous-corrigé en moins.',
    cle: 'Rouge plus net → ajouter du moins (RAM) ; vert plus net → ajouter du plus (GAP).',
    ex: 'Chez le presbyte débutant, on laisse volontiers le rouge très légèrement dominant : mieux vaut un cheveu de sous-correction qu’une lecture arrachée à l’accommodation.' },

  { cle: 'Devant un strabisme, une hypermétropie suspectée ou une accommodation instable chez l’enfant, la réfraction sans cycloplégie n’a aucune valeur.',
    ex: 'Une ésotropie de l’enfant avec +1,50 sans cycloplégie devient parfois +5,00 sous atropine : c’est la totalité de la prise en charge qui change, du prisme aux lunettes portées en permanence.',
    err: 'Prescrire sur une réfraction sans cycloplégie chez l’enfant strabique, puis s’étonner que l’angle ne bouge pas.' },

  { fig: 'amplitude',
    img: 'L’addition ne « rend » pas l’accommodation perdue : elle en achète juste assez pour lire en gardant la moitié de l’amplitude restante en réserve. Sans réserve, la lecture tient cinq minutes.',
    cle: 'Add ≈ demande (D) − amplitude/2, puis on vérifie à la distance réelle de travail du patient.',
    ex: 'Le patient qui lit à 33 cm et le musicien qui lit sa partition à 70 cm n’ont pas la même addition, même au même âge. On mesure la distance, on ne la suppose pas.' }
],

UE04: [
  { fig: 'phototransduction',
    img: 'Dans le noir, le photorécepteur est bavard : ses canaux sont ouverts, il libère du glutamate en continu. La lumière le fait taire. Le signal visuel, c’est un silence.',
    cle: 'Le photorécepteur s’hyperpolarise à la lumière — c’est le seul neurone qui répond à son stimulus en se taisant.',
    ex: 'Ce cycle a besoin de vitamine A : sa carence donne l’héméralopie, première cause évitable de cécité nocturne dans le monde.' },

  { fig: 'champrecepteur',
    img: 'Un champ récepteur en centre-pourtour, c’est un détecteur de contraste : la cellule ne demande pas « y a-t-il de la lumière ? » mais « y a-t-il une différence ? ».',
    cle: 'La rétine n’envoie pas une image au cerveau, elle envoie des différences : contours, contrastes, variations.',
    ex: 'C’est pourquoi une plainte visuelle peut exister avec 10/10 : l’acuité mesure la résolution en fort contraste, pas la capacité à voir un trottoir gris dans la pénombre.' },

  { fig: 'magnoparvo',
    img: 'Deux voies, deux métiers : la magnocellulaire est l’éclaireur — rapide, en noir et blanc, elle voit que ça bouge ; la parvocellulaire est l’expert — lente, colorée, elle voit ce que c’est.',
    cle: 'Magno : mouvement, basses fréquences spatiales, conduction rapide. Parvo : détail, couleur, haute résolution.',
    ex: 'Les troubles neurovisuels de l’enfant se lisent souvent dans cette dichotomie : voie dorsale (« où ») et voie ventrale (« quoi ») ne sont pas atteintes ensemble.' },

  { fig: 'voies',
    img: 'Au chiasma, seules les fibres nasales croisent. Chaque bandelette porte donc, non pas un œil, mais un demi-monde : l’hémichamp opposé.',
    cle: 'Avant le chiasma, l’atteinte est monoculaire ; au chiasma, elle est bitemporale ; après, elle est homonyme.',
    ex: 'C’est ce seul schéma qui permet de dire, devant un champ visuel, si la lésion est devant, sur ou derrière le chiasma — avant même de savoir laquelle.' },

  { fig: 'adaptation',
    img: 'La courbe d’adaptation à l’obscurité a un coude : les cônes s’adaptent en cinq minutes puis plafonnent, les bâtonnets prennent le relais et descendent bien plus bas, jusqu’à trente minutes.',
    cle: 'Cônes vite mais peu, bâtonnets lentement mais loin : le coude de la courbe est le passage de relais.',
    ex: 'Un patient qui met un quart d’heure à retrouver ses repères en entrant dans un parking décrit exactement cette courbe — et parfois son ralentissement pathologique.' },

  { cle: 'Chaque examen électrophysiologique interroge un étage : ERG global la rétine entière, ERG multifocal la macula, PEV la voie jusqu’au cortex, EOG l’épithélium pigmentaire.',
    ex: 'Devant une baisse d’acuité inexpliquée avec fond d’œil normal, le couple ERG/PEV répond à la question qui compte : est-ce la rétine ou le nerf ?',
    err: 'Attendre d’un PEV qu’il localise une lésion : il dit qu’il y a un retard ou une perte d’amplitude, il ne dit pas où.' }
],

UE05: [
  { fig: 'acuites', img: 'Quatre acuités, quatre questions : je vois qu’il y a quelque chose (visible), je vois que c’est deux choses (séparable), je sais ce que c’est (reconnaissable), je vois que ce n’est pas aligné (Vernier).',
    cle: 'L’acuité mesurée en clinique est le minimum séparable : un pouvoir de résolution, pas une qualité de vision.',
    err: 'Confondre acuité et vision. Un patient à 10/10 peut être très gêné : contraste, éblouissement et champ ne sont pas dans le chiffre.' },

  { fig: 'optotype',
    img: 'L’optotype de 10/10 tient dans 5 minutes d’arc, et son détail critique dans 1 minute. C’est un carré de cinq cases sur cinq : on ne lit pas la lettre, on résout ses barreaux.',
    cle: '10/10 = 1 minute d’arc de pouvoir séparateur. Toute la métrologie de l’acuité découle de cette seule définition angulaire.',
    err: 'Utiliser une échelle à une distance qui n’est pas la sienne sans corriger : la taille physique de l’optotype n’a de sens qu’avec sa distance.' },

  { fig: 'echelles',
    img: 'Monoyer compresse le bas de l’échelle et étale le haut : entre 1/10 et 2/10, il y a un monde ; entre 9/10 et 10/10, presque rien. logMAR fait l’inverse : chaque ligne vaut le même pas.',
    cle: 'Pour suivre une évolution ou comparer deux mesures, seule une échelle logarithmique (logMAR, ETDRS) est honnête.',
    ex: 'C’est pour cela qu’en basse vision et dans toutes les études cliniques on note en logMAR : « il a gagné deux lignes » n’a de sens que si les lignes ont la même valeur.' },

  { fig: 'crowding',
    img: 'Le crowding, c’est la lettre étouffée par ses voisines : isolée elle se lit, en ligne elle disparaît. C’est le signe le plus fidèle de l’amblyopie.',
    cle: 'Une acuité n’existe pas sans ses conditions : éclairage, contraste, distance, correction portée, optotypes isolés ou en ligne.',
    err: 'Mesurer un amblyope en optotypes isolés et annoncer une acuité flatteuse : on mesurera toujours en présentation groupée, sinon on manque le déficit.' },

  { cle: 'En dessous du plus gros optotype, la mesure continue : compte les doigts, mouvements de la main, perception lumineuse, puis absence de perception — et toujours avec la distance.',
    ex: 'Chez l’enfant préverbal, on ne renonce pas à l’acuité : regard préférentiel (cartons de Teller), puis appariement d’images, puis optotypes dirigés selon l’âge.',
    err: 'Noter « compte les doigts » sans la distance : CLD à 3 m et CLD à 30 cm ne décrivent pas le même patient.' },

  {
    img: 'L’acuité mesure la finesse du trait, pas la qualité du papier. Un texte noir sur blanc reste lisible longtemps ; c’est le gris sur gris qui s’efface d’abord — et c’est là que vit la plainte.',
    err: 'Renvoyer un patient à 10/10 en lui disant que tout va bien. L’acuité est souvent le dernier paramètre à céder : quand elle baisse, l’atteinte est déjà installée.', cle: 'Une plainte visuelle avec une acuité normale n’est pas une plainte sans cause : elle oriente vers le contraste, l’éblouissement, le champ ou la couleur.',
    ex: 'Le patient qui ne reconnaît plus les visages dans un couloir sombre, ou qui ne distingue plus la marche blanche sur le carrelage blanc, décrit une perte de sensibilité aux contrastes — Pelli-Robson la mesure, l’échelle d’acuité non.' }
],

UE07: [
  { fig: 'orbite',
    img: 'Une orbite est une pyramide couchée, sommet en arrière : tout ce qui entre ou sort de l’œil passe par ce sommet, dans un espace de la taille d’un ongle.',
    cle: 'Sept os, quatre parois, un sommet où tout se croise — et deux parois fragiles : le plancher et la paroi médiale.',
    ex: 'Un traumatisme du plancher (fracture « blow-out ») incarcère le droit inférieur : diplopie dans le regard vers le haut, énophtalmie, hypoesthésie de la joue.' },

  { img: 'Le sommet de l’orbite est un péage à trois voies : le canal optique (II et artère ophtalmique), la fente sphénoïdale (III, IV, VI, V1, veine ophtalmique) et la fente sphéno-maxillaire (V2).',
    cle: 'Ce qui est atteint ensemble a voyagé ensemble : une ophtalmoplégie complète avec anesthésie du front signe la fente sphénoïdale.',
    err: 'Faire passer le nerf optique par la fente sphénoïdale : il a son propre canal, et c’est ce qui distingue un syndrome de l’apex d’un syndrome de la fente.' },

  { fig: 'tillaux',
    img: 'La spirale de Tillaux : les quatre droits s’insèrent de plus en plus loin du limbe en tournant, du médial (5,5 mm) au supérieur (7,7 mm). Une spirale, pas un cercle.',
    cle: '5,5 — 6,5 — 6,9 — 7,7 : médial, inférieur, latéral, supérieur. Ces quatre nombres tombent presque à chaque examen d’anatomie.',
    ex: 'Le chirurgien les utilise à chaque recul musculaire : il mesure depuis l’insertion d’origine, dont il faut donc connaître la position exacte.' },

  { fig: 'obliques', img: 'L’oblique supérieur fait demi-tour : il part de l’apex vers l’avant, passe dans la trochlée comme dans une poulie, et revient en arrière et en dehors. Son action part donc de la poulie, pas de l’apex.',
    cle: 'C’est la trochlée qui donne à l’oblique supérieur sa direction d’action — et c’est pourquoi son atteinte est si typée.',
    ex: 'Le petit oblique n’a pas de tendon d’origine long : c’est le seul muscle oculomoteur qui naît en avant, près du rebord orbitaire inférieur.' },

  { fig: 'innervation',
    img: '« LR6 SO4, tous les autres 3 » : le droit latéral au VI, l’oblique supérieur au IV, tout le reste au III.',
    cle: 'Le III se divise : branche supérieure pour le droit supérieur et le releveur, branche inférieure pour les droits médial et inférieur, l’oblique inférieur et le parasympathique pupillaire.',
    ex: 'C’est cette division qui explique qu’une atteinte du III puisse épargner la pupille — donnée décisive pour trancher entre compression anévrismale et souffrance microvasculaire.' },

  { img: 'Trois muscles ouvrent ou ferment la fente palpébrale, chacun avec sa commande : orbiculaire (VII) pour fermer, releveur (III) pour ouvrir, muscle de Müller (sympathique) pour les deux derniers millimètres.',
    cle: 'Un ptosis discret avec myosis et fente rétrécie, c’est le muscle de Müller — donc le sympathique : syndrome de Claude Bernard-Horner.',
    err: 'Confondre le ptosis du III (majeur, avec déviation et souvent mydriase) et celui de Horner (léger, avec myosis).' }
],

UE08: [
  { fig: 'positions',
    img: 'Un muscle oculomoteur n’a pas une action, il en a trois — et leur importance dépend de la position du regard. Les obliques et les droits verticaux échangent leurs rôles selon l’abduction ou l’adduction.',
    cle: 'Les droits verticaux sont surtout élévateurs/abaisseurs en abduction ; les obliques le deviennent en adduction. C’est le fondement du test des trois pas.',
    err: 'Réciter les actions musculaires en position primaire et croire qu’elles valent partout : la clinique se joue précisément dans les positions extrêmes.' },

  { fig: 'hering',
    img: 'Sherrington regarde un œil : quand un muscle se contracte, son antagoniste se relâche. Hering regarde les deux : la commande part en double exemplaire, elle ne se partage pas.',
    cle: 'Hering explique toute la déviation secondaire : si l’œil parétique fixe, la commande majorée part aussi vers l’œil sain, dont la déviation devient plus grande que celle du parétique.',
    ex: 'Aux verres striés de Bagolini comme au cover test alterné, mesurer « œil sain fixateur » puis « œil parétique fixateur » et comparer, c’est appliquer Hering.' },

  { fig: 'mouvements', img: 'Une saccade est un saut balistique : une fois lancée, on ne la corrige plus. Une poursuite est un rail : elle a besoin d’une cible qui bouge lentement, sinon elle se décompose en saccades.',
    cle: 'Ductions, versions, vergences : un œil, deux yeux dans le même sens, deux yeux en sens opposés. Toute anomalie se range d’abord dans l’une de ces trois cases.',
    ex: 'Une poursuite « en roue dentée » chez un enfant fatigable n’est pas un signe neurologique en soi : c’est souvent le premier indice d’une attention visuelle qui décroche.' },

  { fig: 'panum',
    img: 'L’horoptère est la ligne des points qui tombent sur des points correspondants ; autour d’elle, une bande étroite — l’aire de Panum — où deux images légèrement disparates fusionnent encore et donnent le relief.',
    cle: 'Trop peu de disparité, pas de relief ; trop de disparité, diplopie. La stéréoscopie vit dans cet intervalle.',
    ex: 'C’est pourquoi la stéréoscopie se mesure en secondes d’arc : 40" au TNO ou au Titmus, c’est une correspondance normale et une fusion solide.' },

  { fig: 'worth', img: 'Worth est un escalier à trois marches : percevoir les deux images, les fondre en une, puis en tirer du relief. On ne saute pas une marche.',
    cle: 'Degré I perception simultanée, degré II fusion (sensorielle et motrice), degré III stéréoscopie. Sans le I, pas de II ; sans le II, pas de III.',
    err: 'Annoncer « pas de vision binoculaire » sur un seul test. Worth, Bagolini et le stéréotest n’explorent ni les mêmes degrés ni les mêmes conditions de dissociation.' },

  { img: 'Accommodation et convergence sont attelées : tirer l’une entraîne l’autre. L’AC/A mesure la longueur de la corde.',
    cle: 'AC/A élevé : la déviation change beaucoup entre loin et près. AC/A bas : elle bouge peu, et c’est la convergence fusionnelle qui doit tout payer.',
    ex: 'Ce seul rapport oriente la prise en charge : excès de convergence par AC/A élevé → addition ; insuffisance de convergence avec AC/A bas → rééducation.' }
],

UE09: [
  { fig: 'covertest',
    img: 'La phorie est une déviation qui attend : la fusion la tient, il suffit de couper la fusion pour la voir apparaître. La tropie, elle, est déjà là.',
    cle: 'Cover test unilatéral : je vois bouger l’œil découvert → tropie. Cover test alterné : ça ne bouge qu’à la dissociation → phorie.',
    err: 'Faire le cover test sans s’assurer que le patient fixe vraiment la cible, et à la bonne distance : un cover test bâclé donne un résultat faux, pas un résultat imprécis.' },

  { fig: 'comitance', img: 'Une déviation comitante garde le même angle partout : c’est un défaut de réglage. Une déviation incomitante change avec la direction du regard : c’est un défaut de matériel.',
    cle: 'Comitant → innervationnel, ancien, sans diplopie chez l’enfant. Incomitant → paralytique ou restrictif, souvent récent, avec diplopie chez l’adulte.',
    ex: 'La question qui tranche au lit du malade : « depuis quand ? ». Une incomitance d’installation brutale chez l’adulte impose un avis, pas une rééducation.' },

  { img: 'L’enfant ne subit pas sa déviation : il s’en défend. Il éteint l’image gênante (neutralisation), ou il redessine sa carte rétinienne (correspondance anormale). Le prix de cette paix est l’amblyopie.',
    cle: 'Neutralisation et correspondance rétinienne anormale sont des adaptations, pas des maladies — mais elles rendent la binocularité normale inaccessible sans traitement.',
    err: 'Voir dans l’absence de diplopie d’un enfant strabique un bon signe. C’est l’inverse : c’est la preuve qu’il a déjà renoncé à une des deux images.' },

  { fig: 'diplopie', img: 'Passé la période sensible, plus de porte de sortie : toute nouvelle déviation se paie en diplopie, immédiatement.',
    cle: 'Une diplopie récente chez l’adulte est un symptôme neurologique jusqu’à preuve du contraire : on la date, on la caractérise, on cherche les signes associés.',
    ex: 'Diplopie verticale, torsion, et tête penchée du côté opposé : on pense au IV. Diplopie horizontale maximale dans le regard latéral : on pense au VI. Diplopie avec ptosis et mydriase : on n’attend pas.' },

  { fig: 'acA',
    cle: 'La comparaison loin/près est l’examen le plus rentable d’un strabisme convergent : c’est elle qui révèle le rôle de l’accommodation.',
    ex: 'Ésotropie franchement plus grande de près chez un enfant hypermétrope : excès de convergence par AC/A élevé — l’addition de près est un vrai traitement, pas un pansement.',
    err: 'Mesurer l’angle uniquement de loin. On passe alors à côté de tout ce que l’accommodation ajoute.' },

  { fig: 'torticolis', img: 'Un torticolis est une ordonnance que le patient s’est écrite : il place les yeux là où il voit simple, ou là où il voit le mieux.',
    cle: 'La position de blocage indique la direction d’action déficitaire — ou, dans un nystagmus, la zone de moindre battement.',
    ex: 'Une vieille photo de classe qui montre déjà la tête penchée date la paralysie mieux que n’importe quel interrogatoire : c’est un argument majeur pour une atteinte congénitale du IV.' }
],

UE12: [
  {
    img: 'Le décret d’actes est une carte, pas une clôture : il dit où l’on va seul, où il faut une prescription, et où commence le territoire d’un autre. Un professionnel qui ne connaît pas ses frontières les franchit sans le savoir.',
    err: 'Croire que l’accès direct vaut pour tout et pour tout le monde. Il est encadré — certains bilans, sous conditions d’âge et d’ancienneté du diplôme ; hors de ce cadre, la prescription reste la règle.', cle: 'L’orthoptiste agit sur prescription médicale, dans un champ d’actes défini par décret — et depuis les évolutions récentes, avec des possibilités d’accès direct encadrées.',
    ex: 'Savoir dire précisément ce que l’on peut faire, et à partir d’où l’on adresse, fait partie de la compétence : c’est la première question posée à l’oral comme au premier jour de stage.' },

  { fig: 'secret', img: 'Le secret n’est pas un coffre dont on aurait la clé : c’est une obligation qui ne dépend ni du patient, ni de la famille, ni de l’employeur.',
    cle: 'Le secret couvre tout ce dont on a connaissance dans l’exercice — le confié, le vu, le compris, le déduit.',
    err: 'Croire qu’un parent a droit à tout sur son adolescent, ou qu’un collègue « qui connaît le dossier » peut tout entendre : le partage n’est licite qu’entre professionnels participant à la prise en charge, et pour ce qui leur est nécessaire.' },

  {
    img: 'L’obligation de moyens est celle du navigateur, pas celle du météorologue : on répond de la route tenue, des instruments consultés et du cap corrigé — pas de la tempête.',
    err: 'Confondre échec thérapeutique et faute. Ce qui engage la responsabilité n’est pas l’absence de résultat, c’est l’absence de moyens : un bilan bâclé, une information non donnée, un dossier non tenu.', cle: 'Obligation de moyens, pas de résultat : on doit des soins conformes aux données actuelles de la science, pas une guérison.',
    ex: 'Une rééducation d’insuffisance de convergence qui échoue n’engage pas la responsabilité ; l’absence d’information sur les alternatives et sur le nombre de séances attendues, si.' },

  { img: 'La profession est née autour d’une question : comment rééduquer un strabisme sans opérer ? Le synoptophore et les travaux de Javal en sont les premiers outils.',
    cle: 'Née dans l’entre-deux-guerres autour du strabisme, la profession s’est élargie à l’exploration, à la basse vision, au neurovisuel et au dépistage.',
    ex: 'Connaître cette trajectoire aide à répondre à la question qui revient toujours : à quoi sert un orthoptiste aujourd’hui, au-delà de la rééducation ?' },

  {
    img: 'Le consentement n’est pas une signature au début, c’est un fil qu’on garde tendu pendant tout l’acte : obtenu avant, vérifié pendant, et que le patient peut lâcher à tout moment sans avoir à s’expliquer.',
    err: 'Traiter l’avis de l’enfant comme une formalité. L’autorité parentale décide, mais son avis se recueille — et pèse d’autant plus qu’il grandit.', cle: 'Trois conditions pour un consentement valable : une information loyale, claire et appropriée ; une capacité à décider ; l’absence de contrainte. Et il se retire à tout moment.',
    ex: 'Chez le mineur, on recueille l’autorisation des titulaires de l’autorité parentale et l’adhésion de l’enfant : une occlusion imposée contre l’enfant échoue dans les deux semaines.' },

  { fig: 'ethique', img: 'Quatre principes, quatre boussoles qui parfois se contredisent : autonomie, bienfaisance, non-malfaisance, justice. L’éthique commence quand deux d’entre eux tirent en sens opposé.',
    cle: 'Un cas d’éthique ne se tranche pas en citant un principe, mais en montrant lequel on choisit de faire primer, et pourquoi.',
    ex: 'Refus d’occlusion par un adolescent alors que l’amblyopie est encore réversible : autonomie contre bienfaisance. La réponse attendue à l’oral n’est pas un camp, c’est un raisonnement.' }
],

UE16: [
  { fig: 'oeilrouge',
    img: 'Devant un œil rouge, une seule question tranche : y a-t-il douleur vraie ou baisse d’acuité ? Sans les deux, c’est bénin ; avec l’un des deux, c’est à voir aujourd’hui.',
    cle: 'Rouge sans douleur ni baisse d’acuité : conjonctivite, hémorragie sous-conjonctivale, épisclérite. Rouge douloureux avec baisse d’acuité : kératite, uvéite, glaucome aigu.',
    err: 'Rassurer sur une « conjonctivite » qui s’accompagne de photophobie et de baisse d’acuité : c’est le tableau qu’on ne rate pas deux fois.' },

  { cle: 'La sécheresse oculaire est la première cause de gêne visuelle fluctuante — et la plus sous-diagnostiquée devant un écran.',
    ex: 'Le patient dit : « ça se brouille en fin de journée, je cligne et ça revient ». C’est un film lacrymal instable, pas une réfraction à refaire.',
    err: 'Reprendre une réfraction sur un film lacrymal instable : la mesure changera d’un quart d’heure à l’autre.' },

  { fig: 'glaucome',
    img: 'Le glaucome chronique ne fait pas mal et ne se voit pas : il grignote le champ par la périphérie et par des déficits arciformes, en épargnant le centre jusqu’au bout.',
    cle: 'La pression peut être normale et le glaucome bien réel : c’est l’excavation papillaire et le champ visuel qui font le diagnostic.',
    ex: 'Un patient qui garde 10/10 avec un champ déjà très amputé est la règle, pas l’exception — d’où l’intérêt du dépistage.' },

  { fig: 'dmla',
    img: 'La DMLA sèche avance à pas comptés ; l’exsudative frappe en quelques jours. Les métamorphopsies récentes sont sa signature.',
    cle: 'Lignes qui ondulent + baisse rapide + scotome central = suspicion de forme exsudative, donc urgence relative : les anti-VEGF ont une fenêtre.',
    ex: 'La grille d’Amsler à la maison n’est pas un gadget : c’est le moyen le plus simple de dater le début d’une métamorphopsie.' },

  { cle: 'Le diabète abîme la rétine longtemps avant de gêner : c’est pourquoi le dépistage est annuel et systématique, symptômes ou pas.',
    ex: 'L’œdème maculaire est la première cause de baisse d’acuité chez le diabétique ; les néovaisseaux, eux, menacent par l’hémorragie et le décollement de traction.',
    err: 'Se rassurer sur une bonne acuité chez un diabétique : elle ne dit rien de la périphérie rétinienne.' },

  { img: 'Une courte liste de signaux qui font sortir du cadre : ils ne demandent pas un diagnostic, seulement un réflexe d’adressage.',
    cle: 'Baisse brutale, diplopie récente, œil rouge douloureux, métamorphopsies récentes, leucocorie de l’enfant, œdème papillaire bilatéral, mydriase aréactive : on adresse.',
    ex: 'Savoir dire « ceci n’est pas de mon ressort, et il faut consulter aujourd’hui » est une compétence à part entière — et elle s’évalue en stage.' }
],

/* ============================ SEMESTRE 2 ============================ */

UE10: [
  { fig: 'champ24',
    img: 'Le champ visuel automatisé ne demande pas « voyez-vous ? » mais « à quelle intensité commencez-vous à voir ? ». Chaque point testé rend un seuil en décibels : plus le chiffre est haut, plus l’œil est sensible.',
    cle: 'MD dit combien on a perdu en moyenne, PSD dit si la perte est localisée. Un MD effondré avec PSD basse évoque une cause diffuse (cataracte, myosis), pas un scotome.',
    err: 'Interpréter un champ visuel sans regarder d’abord ses indices de fiabilité. Un examen avec 30 % de pertes de fixation ne s’interprète pas, il se refait.' },

  { fig: 'voies',
    img: 'Un déficit campimétrique a une géographie : le respect du méridien vertical signe une atteinte rétro-chiasmatique, le respect de l’horizontale signe la rétine ou le nerf.',
    cle: 'La forme du déficit désigne l’étage : central (macula, nerf), arciforme (glaucome), altitudinal (ischémie), bitemporal (chiasma), homonyme (rétro-chiasmatique).',
    ex: 'Une hémianopsie homonyme latérale gauche, c’est une lésion droite. Le patient, lui, ne dit pas « je ne vois pas à gauche » : il dit qu’il se cogne dans les portes et saute des mots en lisant.' },

  { fig: 'couleurs', cle: 'Ishihara dépiste l’axe rouge-vert, et lui seul. Un déficit bleu-jaune acquis lui échappe complètement.',
    ex: 'Congénital : stable, symétrique, bilatéral, axe rouge-vert, l’homme surtout. Acquis : évolutif, souvent asymétrique, volontiers bleu-jaune, avec une baisse d’acuité ou un scotome associés.',
    err: 'Conclure à un daltonisme devant un axe bleu-jaune : celui-ci est presque toujours acquis, et impose de chercher une cause rétinienne ou une neuropathie.' },

  { fig: 'explorations',
    img: 'Chaque examen électrophysiologique est un étage de l’immeuble : l’EOG teste la cave (épithélium pigmentaire), l’ERG le rez-de-chaussée (rétine), le PEV l’ascenseur jusqu’au dernier étage (cortex).',
    cle: 'ERG effondré = rétine diffuse. ERG normal avec PEV retardé = nerf optique. ERG multifocal = topographie maculaire.',
    ex: 'Devant une baisse d’acuité avec fond d’œil normal, c’est ce couple qui oriente : rétine ou voie optique, la conduite n’est pas la même.' },

  { fig: 'octcoupe', img: 'L’OCT est une coupe histologique sans bistouri : on voit les couches, leur épaisseur, et ce qui n’a rien à y faire — du fluide, une membrane, un trou.',
    cle: 'OCT maculaire pour la macula, OCT du nerf pour le RNFL et les cellules ganglionnaires. L’amincissement structurel précède souvent la perte fonctionnelle.',
    err: 'Comparer deux OCT faits sur des appareils différents : les normes et les segmentations ne sont pas superposables, la comparaison n’a pas de sens.' },

  {
    img: 'L’acuité demande « lisez-vous la plus petite lettre ? » ; la sensibilité aux contrastes demande « à partir de quel gris cessez-vous de la voir ? ». Le brouillard ne rétrécit pas les objets, il les efface.',
    err: 'Conclure « rien à signaler » sur la seule acuité devant une plainte d’éblouissement ou de vision brumeuse : les fonctions qui s’altèrent en premier ne sont pas celles qu’on mesure en premier.', cle: 'Une sensibilité aux contrastes effondrée avec 10/10 explique des plaintes que l’acuité ne montre jamais.',
    ex: 'Cataracte débutante, œdème maculaire, neuropathie optique : le patient voit les lettres noires sur blanc, et plus le trottoir gris sur le bitume gris.' }
],

UE11: [
  { fig: 'interrogatoire', img: 'L’interrogatoire n’est pas la formalité avant le bilan : c’est lui qui décide quels tests méritent d’être faits. Un bilan sans plainte claire est un bilan sans conclusion.',
    cle: 'Motif, ancienneté, circonstances, horaire, retentissement : cinq questions qui orientent tout le reste.',
    ex: '« Ça se brouille après vingt minutes de lecture, jamais le matin » n’est pas la même piste que « je vois double depuis mardi » : la première mène aux vergences, la seconde à un avis médical.' },

  { fig: 'bilanordre',
    img: 'L’ordre du bilan suit une logique simple : ne jamais laisser un test perturber le suivant. On dissocie le moins possible, le plus tard possible.',
    cle: 'Acuités → réfraction → sensoriel → cover test → mesures prismatiques → vergences et accommodation. Le sensoriel avant la dissociation, sinon on casse ce qu’on voulait mesurer.',
    err: 'Commencer par le cover test alterné : on rompt la fusion, et le bilan sensoriel qui suit ne mesure plus l’état spontané du patient.' },

  { fig: 'covertest',
    img: 'Cover unilatéral : je cherche ce qui est déjà là (tropie). Cover alterné : je cherche tout ce qu’il y a, latent compris. La différence entre les deux, c’est la part que la fusion tenait.',
    cle: 'On note toujours : nature, sens, amplitude, distance, œil fixateur, comitance. Une mesure sans sa distance et son œil fixateur ne veut rien dire.',
    ex: 'Angle plus grand quand l’œil parétique fixe : déviation secondaire, donc atteinte paralytique. C’est Hering au lit du patient.' },

  { cle: 'Worth, Bagolini et stéréotest n’explorent pas la même chose dans les mêmes conditions : Bagolini dissocie très peu, Worth beaucoup.',
    ex: 'Une fusion normale à Bagolini mais absente à Worth n’est pas contradictoire : c’est une binocularité fragile, qui tient en conditions naturelles et cède dès qu’on la sollicite.',
    err: 'Prendre le TNO et le Titmus pour équivalents : le Titmus laisse des indices monoculaires sur la mouche, le TNO non.' },

  { fig: 'ppc',
    img: 'Le PPC ne se mesure pas une fois mais trois : c’est la dégradation entre le premier et le troisième essai qui signe la fatigabilité — et c’est elle dont le patient se plaint.',
    cle: 'On note rupture ET recouvrement. Un PPC à 8 cm qui ne récupère qu’à 20 cm raconte autre chose qu’un 8/10.',
    ex: 'Insuffisance de convergence typique : PPC qui s’éloigne à la répétition, exophorie plus grande de près, amplitudes de convergence basses — et une plainte de lecture, jamais de loin.' },

  { img: 'Un bilan qui s’arrête aux chiffres n’est pas un bilan : c’est un relevé. La synthèse est le seul endroit où l’orthoptiste apparaît.',
    cle: 'Trois questions à conclure : quel est le dysfonctionnement, la plainte lui correspond-elle, et qu’est-ce qu’on propose ?',
    err: 'Conclure « exophorie de 8 Δ de près » sans dire si elle est compensée. Une phorie n’est un problème que lorsque les réserves ne suivent plus.' }
],

UE13: [
  { img: 'La friction hydro-alcoolique n’est pas une version rapide du lavage : elle est plus efficace, sauf sur mains visiblement souillées. Le lavage, lui, redevient obligatoire face aux spores.',
    cle: 'Une friction avant et après chaque patient, avant et après chaque geste — la règle ne souffre pas d’exception, y compris entre deux tests sur le même patient.',
    err: 'Porter des gants toute la consultation en croyant bien faire : des gants gardés d’un patient à l’autre transportent autant qu’une main non lavée.' },

  { img: 'Tout ce qui touche la peau, les larmes ou la cornée est un vecteur : occluseurs, verres d’essai, mentonnière, barre de prismes. Ce sont les objets qu’on manipule sans y penser qui contaminent.',
    cle: 'Nettoyage entre chaque patient pour tout ce qui touche le patient ; désinfection adaptée pour ce qui approche l’œil.',
    ex: 'La mentonnière et l’appui-front du réfracteur sont les surfaces les plus oubliées — et les plus fréquemment en contact avec la peau du visage.' },

  { fig: 'adenovirus', img: 'L’adénovirus survit des semaines sur une surface sèche et résiste à beaucoup d’antiseptiques usuels. Une kérato-conjonctivite épidémique dans un cabinet, c’est une consultation à réorganiser, pas un patient à traiter.',
    cle: 'Suspicion de KCE : consultation en fin de journée ou isolée, matériel dédié, désinfection renforcée, éviction et information du patient.',
    err: 'Enchaîner un patient suspect au milieu de la journée : le matériel et les surfaces resteront contaminants pour tous les suivants.' },

  { fig: 'aes', cle: 'AES : laver, ne pas faire saigner, antiseptique au moins cinq minutes, avis médical dans l’heure — le délai conditionne la prophylaxie.',
    ex: 'Projection oculaire : rinçage abondant au sérum physiologique ou à l’eau pendant au moins cinq minutes, puis avis en urgence. On ne « voit pas demain ».',
    err: 'Faire saigner la plaie en croyant évacuer : c’est exactement ce qu’il ne faut pas faire.' },

  {
    img: 'Une unidose rouverte, c’est un verre d’eau laissé sur une table : ce qui y est tombé entre-temps ne se voit pas, et pourtant on le boit.',
    err: 'Reposer une unidose entamée « pour le patient suivant, dans cinq minutes ». Elle n’a pas de conservateur — c’est précisément pour cela qu’elle est à usage unique.', cle: 'Une unidose, un patient, une séance — puis à la poubelle. La rouvrir plus tard, c’est réinoculer ce qui y est entré.',
    ex: 'C’est la règle qui protège le plus efficacement du risque adénovirus au cabinet, avant même la désinfection des surfaces.' },

  { img: 'Signaler n’est pas dénoncer : un événement indésirable déclaré est un accident qui n’aura pas lieu la fois suivante.',
    cle: 'Est indésirable tout fait inattendu lié aux soins qui a nui — ou aurait pu nuire — au patient. Les « presque accidents » se déclarent aussi.',
    ex: 'Un collyre confondu, un patient reparti sans consigne après cycloplégie : ce sont ces signalements-là qui font changer les procédures d’un service.' }
],

UE14: [
  { fig: 'esotropies', img: 'L’ésotropie congénitale, c’est un grand angle très tôt et très stable, avec fixation croisée : l’enfant regarde à droite avec l’œil gauche, et personne ne voit d’amblyopie tant qu’il alterne.',
    cle: 'Avant 6 mois, grand angle, peu d’hypermétropie, fixation croisée, alternance — et son cortège : DVD, nystagmus latent, hyperaction des obliques inférieurs.',
    err: 'Rassurer les parents d’un nourrisson de 4 mois qui louche en permanence. L’intermittence des premières semaines est banale ; un strabisme constant après 4 mois ne l’est pas.' },

  { img: 'L’ésotropie accommodative naît d’une hypermétropie non corrigée : l’enfant accommode pour voir net, la convergence suit, et l’œil part.',
    cle: 'Apparition vers 2 à 4 ans, d’abord intermittente, hypermétropie souvent > +3,00 D : la correction optique totale sous cycloplégie est le traitement, pas un adjuvant.',
    ex: 'Quand la correction totale aligne de loin mais pas de près, on est devant un excès de convergence : le rapport AC/A est élevé, et l’addition prend le relais.' },

  { img: 'L’exotropie intermittente se voit quand le contrôle lâche : à la fatigue, au loin, au soleil. L’enfant qui ferme un œil dehors ne fait pas une grimace, il supprime.',
    cle: 'Ce qui compte n’est pas l’angle mais le contrôle : sa fréquence, ses circonstances, et s’il reste une bonne binocularité entre deux décompensations.',
    err: 'Juger une exotropie intermittente sur un seul examen en cabinet, où l’enfant est attentif : l’observation des parents et les photos valent une mesure.' },

  { fig: 'alphabetiques', img: 'A et V se lisent comme des lettres : en V, l’écart est plus ouvert en bas ; en A, plus ouvert en haut. Les obliques en sont presque toujours responsables.',
    cle: 'La DVD n’est pas une hypertropie : c’est une élévation lente, dissociée, qui apparaît sous occlusion et ne suit aucune loi de Hering.',
    ex: 'Une DVD associée à une ésotropie précoce et à un nystagmus latent forme un trio classique : les trois se cherchent dès qu’on en trouve un.' },

  { img: 'Restrictif, ce n’est pas paralytique : le muscle ne pousse pas trop peu, c’est le tissu d’en face qui retient. Le test de duction forcée fait la différence.',
    cle: 'Duane I : abduction limitée, rétraction du globe et rétrécissement de la fente en adduction. Brown : élévation limitée en adduction, libre en abduction.',
    err: 'Rééduquer un syndrome restrictif comme une insuffisance de vergence : aucune séance ne rendra une amplitude qu’un tissu bloque mécaniquement.' },

  {
    img: 'Un strabisme qui alterne est un strabisme qui discute : les deux yeux se disputent la fixation, donc les deux voient. Un strabisme qui refuse d’alterner a déjà tranché — et il faut savoir pourquoi.',
    err: 'Se contenter d’un bilan orthoptique devant un strabisme unilatéral fixe de l’enfant. Le fond d’œil n’est pas facultatif : la leucocorie n’est pas toujours au rendez-vous, et le rétinoblastome n’attend pas.', cle: 'Cinq signes font sortir de la strabologie ordinaire : strabisme unilatéral fixe, leucocorie, apparition brutale avec diplopie, nystagmus acquis, torticolis récent.',
    ex: 'Un strabisme fixe qui ne veut pas alterner cache parfois une lésion organique de l’œil dévié : c’est le fond d’œil qui doit être vérifié, pas l’occlusion qui doit être prolongée.' }
],

UE15: [
  { fig: 'ordretherapeutique',
    img: 'L’ordre thérapeutique n’est pas une habitude, c’est une chaîne de causes : on ne rééduque pas ce qu’une correction optique aurait suffi à régler, et on n’aligne pas un œil qui ne voit pas.',
    cle: 'Correction optique totale portée en permanence → traitement de l’amblyopie → alignement → travail sensoriel. Chaque étape conditionne la suivante.',
    err: 'Débuter la rééducation avant d’avoir vérifié le port effectif de la correction, plusieurs semaines durant. On mesure alors l’absence de lunettes, pas un dysfonctionnement.' },

  { fig: 'reeduc',
    img: 'La rééducation réentraîne une fonction qui existe ; elle n’en crée pas une qui n’a jamais existé. On remet un convalescent à la course, on n’apprend pas à courir à qui n’a jamais marché.',
    err: 'Promettre un alignement à une famille venue pour un strabisme congénital. Ce n’est pas de l’optimisme, c’est une promesse qu’on ne tiendra pas — et elle coûte la confiance de toute la prise en charge.', cle: 'La rééducation est excellente sur l’insuffisance de convergence (80 à 90 % de succès) et les troubles accommodatifs. Elle n’aligne pas un strabisme et ne guérit pas une paralysie.',
    ex: 'Annoncer d’emblée ce que la rééducation peut et ne peut pas faire est ce qui construit l’adhésion : un patient qui attend un alignement abandonnera à la troisième séance.' },

  { img: 'Trois temps, toujours les mêmes : gagner de l’amplitude, puis de la souplesse (passer vite d’une demande à l’autre), puis automatiser en situation réelle — sinon le gain reste au cabinet.',
    cle: 'Amplitude → souplesse → automatisation. Un patient qui a de grandes amplitudes mais aucune souplesse reste gêné en lecture.',
    ex: 'Les flippers et les sauts prismatiques ne servent pas à faire plus, mais à faire vite : c’est la vitesse de réponse qui manque en fin de journée.' },

  { cle: 'Un prisme compense, il ne rééduque pas — et un prisme porté trop longtemps peut être absorbé par une adaptation prismatique.',
    ex: 'Prisme de Fresnel en attendant la stabilisation d’une paralysie récente, prisme incorporé une fois la déviation stable : ce ne sont pas les mêmes indications ni les mêmes délais.',
    err: 'Prismer une déviation encore évolutive avec un verre incorporé : la valeur sera fausse dans un mois.' },

  { img: 'La toxine botulique est une chirurgie réversible : elle affaiblit un muscle trois à quatre mois, ce qui permet de tester une hypothèse avant de la graver.',
    cle: 'Recul = affaiblir, résection ou plissement = renforcer. Une chirurgie corrige un angle, elle ne crée pas de binocularité.',
    ex: 'D’où l’intérêt du bilan pré-opératoire : mesures dans les neuf positions, angle maximal, potentiel de fusion. Ce sont ces chiffres qui dessinent le geste.' },

  {
    img: 'Une prise en charge sans critère d’arrêt écrit ne s’arrête jamais vraiment : elle s’éteint faute de rendez-vous. Le projet de soins est ce qui transforme une série de séances en un traitement qui a un début, un milieu et une fin.',
    err: 'Arrêter net dès que la plainte disparaît. Sans phase d’entretien ni contrôle à distance, la récidive revient au premier mois chargé — et le patient conclut que la rééducation n’a servi à rien.', cle: 'Une prise en charge se termine par une phase d’entretien et un contrôle à distance : les récidives d’insuffisance de convergence sont fréquentes et silencieuses.',
    ex: 'Des objectifs mesurables (PPC, amplitudes, plainte) fixés au départ sont ce qui permet de dire honnêtement quand on arrête — plutôt que de continuer par habitude.' }
],

UE17: [
  { img: 'Dans le glaucome, la structure part avant la fonction : le RNFL s’amincit alors que le champ visuel est encore normal. On surveille donc les deux, et on croit celui qui bouge.',
    cle: 'Le diagnostic se fait sur la concordance : une atteinte structurelle et un déficit fonctionnel qui se correspondent topographiquement.',
    err: 'Conclure à une progression sur un seul examen. Il en faut plusieurs, et la variabilité du champ visuel est grande.' },

  { img: 'En DMLA exsudative, l’OCT est ce qui décide : la présence de fluide relance les injections, son absence permet d’espacer.',
    cle: 'Fluide intra-rétinien, sous-rétinien, décollement de l’épithélium pigmentaire : ce sont ces trois signes qui pilotent le rythme des anti-VEGF.',
    ex: 'La grille d’Amsler à domicile complète l’OCT entre deux visites : elle date une reprise mieux qu’un souvenir de patient.' },

  { fig: 'diabete', cle: 'Le dépistage de la rétinopathie diabétique repose sur les rétinophotographies grand champ, lisibles en différé — c’est ce qui rend la télémédecine possible.',
    ex: 'L’orthoptiste y tient un rôle central : c’est souvent lui qui réalise les clichés et repère ce qui doit être relu en priorité.',
    err: 'Se fier à l’acuité pour juger de la sévérité : une rétinopathie proliférante peut coexister avec 10/10.' },

  { img: 'Un compte rendu n’est pas une capture d’écran commentée : c’est un document qui doit rester interprétable dans deux ans, par quelqu’un d’autre.',
    cle: 'Conditions de l’examen, fiabilité, résultats chiffrés, comparaison à l’examen précédent, conclusion en une ou deux phrases.',
    err: 'Omettre la correction portée et la stratégie utilisée : sans elles, la comparaison ultérieure est impossible.' },

  { img: 'Savoir jeter un examen fait partie du métier. Un mauvais examen ne donne pas une information imprécise : il donne une information fausse.',
    cle: 'Au champ visuel : pertes de fixation > 20 %, faux positifs élevés, aspect en trou de serrure. À l’OCT : signal faible, segmentation erronée, artefacts de mouvement.',
    ex: 'Un « trou de serrure » signe presque toujours un patient mal centré ou une monture qui masque : on recommence, on ne conclut pas à un rétrécissement concentrique.' },

  { fig: 'suivi',
    img: 'Une pente ne se trace pas avec deux points : il en faut trois pour savoir si la droite est fiable. D’où le rythme, contre-intuitif — serré au début, espacé ensuite si la pente est plate.',
    err: 'Espacer d’emblée chez un patient jeune parce que l’atteinte est légère. Ce n’est pas le niveau d’atteinte qui règle le rythme, c’est le temps qu’il reste à perdre : un glaucome débutant à 45 ans a quarante ans devant lui.', cle: 'Le rythme de suivi se règle sur trois choses : la vitesse de progression, l’espérance de vie visuelle et le stade atteint.',
    ex: 'Un glaucome débutant à 45 ans se surveille plus serré qu’un glaucome comparable à 85 ans : ce n’est pas la maladie qui change, c’est le temps qu’elle a devant elle.' }
],

UE18: [
  { fig: 'developpement', img: 'La période sensible n’est pas une porte qui claque : elle se referme progressivement, très vite les deux premières années, puis de plus en plus lentement.',
    cle: 'Poursuite dès les premières semaines, coordination œil-main vers 4–5 mois, acuité proche de l’adulte vers 3–5 ans : c’est cette chronologie qui rend le dépistage précoce décisif.',
    ex: 'C’est pourquoi une amblyopie dépistée à 2 ans se traite presque toujours, et à 9 ans rarement complètement.' },

  { img: 'Une annonce produit une sidération : après les premiers mots, le patient n’entend plus. Tout ce qui suit devra être redit.',
    cle: 'Rythme lent, reformulation, écrit remis, proposition de revoir : une information donnée une fois n’est pas une information reçue.',
    err: 'Répondre à une question douloureuse par des chiffres. « Est-ce que je vais devenir aveugle ? » ne se traite pas par un pronostic statistique.' },

  { cle: 'L’observance ne se décrète pas : elle se construit en expliquant le bénéfice, en vérifiant la faisabilité réelle et en adaptant la contrainte à la vie du patient.',
    ex: 'Six heures d’occlusion par jour prescrites, deux heures réellement faites : mieux vaut prescrire deux heures tenues que six heures abandonnées la première semaine.',
    err: 'Interpréter une mauvaise observance comme un manque de volonté sans avoir demandé ce qui, concrètement, empêche de faire.' },

  { img: 'Trois âges, trois manières : à l’enfant on parle en jouant, à l’adolescent on négocie, à la personne âgée on ralentit et on répète.',
    cle: 'Parler à l’enfant, pas seulement au parent. C’est lui qui portera le cache, pas eux.',
    ex: 'Le refus d’occlusion à l’adolescence est presque toujours une question d’image de soi : les alternatives (pénalisation optique, filtre) existent et méritent d’être proposées avant l’échec.' },

  {
    img: 'Repérer et diagnostiquer sont deux gestes différents, comme entendre un bruit dans le moteur et démonter la boîte de vitesses. Le premier fait partie du métier ; le second est celui d’un autre.',
    err: 'Rassurer une famille en disant que « ce n’est pas visuel, donc ce n’est rien ». Un bilan orthoptique normal devant une plainte réelle est un résultat qui oriente — pas un résultat qui clôt.', cle: 'Repérer et orienter fait partie du métier ; diagnostiquer un trouble psychique n’en fait pas partie.',
    ex: 'Un enfant adressé pour « fatigue visuelle » dont le bilan orthoptique est normal a besoin d’un compte rendu clair disant ce qui a été éliminé — c’est ce document qui oriente vers le bon interlocuteur.' },

  { img: 'L’orthoptiste voit ses patients longtemps, de près, souvent seul avec eux : c’est une position d’observation rare dans le parcours de soins.',
    cle: 'Tristesse persistante, repli, propos inquiétants, signes de maltraitance : on n’interprète pas, on signale et on oriente.',
    err: 'Se taire par crainte de se tromper. Le doute se transmet au médecin ; le silence, lui, ne se rattrape pas.' }
],

UE19: [
  { fig: 'cycloplegiques', img: 'Un cycloplégique fait deux choses d’un coup : il paralyse le muscle ciliaire (donc l’accommodation) et dilate la pupille. C’est la paralysie qu’on cherche, la mydriase n’est qu’un effet visible.',
    cle: 'Tropicamide pour dépister (rapide, cycloplégie incomplète), cyclopentolate pour la réfraction de l’enfant, atropine pour les cas difficiles — délais et durées très différents.',
    err: 'Réfracter sous tropicamide un enfant hypermétrope et croire la mesure : la cycloplégie y est incomplète, l’hypermétropie latente reste cachée.' },

  {
    img: 'Le tropicamide coupe le moteur et ouvre la porte ; la phényléphrine ouvre seulement la porte. On l’ajoute quand on veut voir large sans priver le patient de son accommodation.',
    ex: 'Chez le nourrisson comme chez la personne âgée, on comprime le canthus interne une minute après la goutte : c’est le geste qui empêche le produit de filer dans la circulation par la voie lacrymo-nasale.', cle: 'La phényléphrine dilate sans paralyser : utile quand on veut voir le fond d’œil sans supprimer l’accommodation.',
    err: 'L’oublier chez un patient à angle étroit, hypertendu ou coronarien : la dilatation peut déclencher une fermeture d’angle, et le produit passe dans la circulation générale.' },

  { img: 'Un anesthésique de contact supprime la douleur en quelques secondes — donc supprime aussi le signal qui protège la cornée.',
    cle: 'Usage strictement professionnel, jamais remis au patient : l’usage répété retarde le diagnostic et retarde la cicatrisation épithéliale.',
    ex: 'C’est le produit dont l’abus donne des kératites gravissimes chez des patients qui « avaient juste très mal ».' },

  {
    img: 'Un collyre ne reste pas dans l’œil : le surplus part par les voies lacrymales, arrive au nez, et de là dans le sang comme s’il avait été avalé. C’est ainsi qu’un bêtabloquant en gouttes déclenche une crise d’asthme.',
    err: 'Ne pas demander les antécédents respiratoires et cardiaques avant un bêtabloquant local. « Ce n’est qu’une goutte » est exactement le raisonnement qui mène au bronchospasme.', cle: 'Prostaglandines en première intention, bêtabloquants contre-indiqués en asthme et BPCO : deux notions qui tombent presque à chaque fois.',
    ex: 'Le patient signale des cils plus longs et plus foncés, un creusement de la paupière, une iris qui fonce : ce ne sont pas des effets curieux, ce sont les effets attendus des prostaglandines — et il faut les avoir annoncés.' },

  { img: 'Après une cycloplégie, le patient repart avec une vision de près floue et une photophobie pour plusieurs heures — parfois plusieurs jours sous atropine.',
    cle: 'Aucune goutte ne se donne sans consigne : durée de la gêne, lunettes de soleil, pas de conduite, et à qui téléphoner en cas de douleur.',
    err: 'Laisser repartir un adulte au volant après cycloplégie sans l’avoir dit clairement — ni l’avoir noté.' },

  {
    img: 'La goutte se dépose dans le cul-de-sac inférieur, jamais sur la cornée : la paupière est un réservoir, la cornée un capteur. Et toucher les cils avec l’embout suffit à contaminer le flacon pour tous les patients suivants.',
    err: 'Instiller d’initiative parce que le geste paraît anodin. Sans prescription ni protocole écrit, l’acte n’est pas couvert — et la question ne se pose jamais tant qu’il ne se passe rien.', cle: 'L’instillation se fait sur prescription ou dans le cadre d’un protocole écrit, jamais d’initiative.',
    ex: 'Avant toute goutte : identité, allergies, port de lentilles, antécédent d’angle étroit. Quatre questions, dix secondes, et l’essentiel du risque est écarté.' }
],

/* ============================ SEMESTRE 3 ============================ */

UE24: [
  { img: 'L’amblyopie ne se joue pas dans l’œil mais dans le cortex : les colonnes de dominance oculaire se partagent le territoire, et celle qui reçoit une image nette prend la place de l’autre.',
    cle: 'Baisse d’acuité sans lésion organique qui l’explique : c’est un défaut de développement cortical, pas une maladie de l’œil.',
    err: 'Chercher la cause dans le fond d’œil et s’arrêter là. L’œil amblyope est normal — c’est justement ce qui définit l’amblyopie fonctionnelle.' },

  { fig: 'amblyopie3',
    img: 'Trois façons d’abîmer une image, trois amblyopies : on la déplace (strabique), on la floute (anisométropique), on la supprime (privation).',
    cle: 'La forme anisométropique est la plus sournoise : l’enfant est asymptomatique, il voit bien d’un œil, rien ne se voit de l’extérieur.',
    ex: 'C’est pourquoi une acuité mesurée œil par œil à 4 ans dépiste ce qu’aucun regard parental ne verra jamais.' },

  { fig: 'plasticite',
    img: 'La plasticité n’est pas un interrupteur mais une pente : très forte les deux premières années, décroissante ensuite, résiduelle jusqu’à 6–8 ans.',
    cle: 'Plus le traitement est précoce, meilleur le résultat — et cette phrase se traduit en semaines chez le nourrisson, pas en années.',
    ex: 'La perte de l’œil sain à l’âge adulte peut rouvrir une part de plasticité : des amblyopes anciens récupèrent alors quelques lignes.' },

  { cle: 'Quatre signes : différence d’acuité entre les deux yeux, crowding marqué, refus de l’occlusion de l’œil sain, fixation excentrée.',
    ex: 'Chez le tout-petit qui ne lit pas encore, le test le plus informatif est le plus simple : cachez l’œil sain. S’il proteste, hurle ou repousse la main, c’est qu’il vient de perdre sa vision utile.',
    err: 'Mesurer en optotypes isolés et conclure que tout va bien : c’est en présentation groupée que l’amblyopie se démasque.' },

  {
    img: 'Le calendrier du dépistage n’est pas une liste de rendez-vous : c’est un filet dont les mailles se resserrent à mesure que l’enfant devient examinable. À la maternité on cherche une lueur ; à quatre ans, on mesure.',
    err: 'Attendre l’âge du prochain examen obligatoire chez un enfant à risque. Prématurité, antécédent familial de strabisme ou d’amétropie forte, anomalie neurologique, trisomie 21 imposent un examen — pas une place dans la file.', cle: 'Le calendrier de dépistage est écrit dans le carnet de santé : maternité, 4 mois, 9 mois, 24 mois, puis 3–4 ans avec mesure de l’acuité.',
    ex: 'Lueur pupillaire à la maternité, reflets cornéens et occlusion alternée à 4 mois, acuité par optotypes vers 3 ans : chaque âge a le test qu’il permet.' },

  { img: 'Avant de conclure « fonctionnelle », il faut avoir éliminé l’organique. Une amblyopie qui ne répond pas au traitement est une amblyopie mal étiquetée jusqu’à preuve du contraire.',
    cle: 'Hypoplasie du nerf optique, dystrophie maculaire, cicatrice de toxoplasmose, rétinoblastome : quatre causes organiques qui miment une amblyopie.',
    err: 'Poursuivre l’occlusion pendant des mois sans réévaluer le fond d’œil devant un échec inexpliqué.' }
],

UE25: [
  { img: 'La correction optique totale n’est pas la première étape parce qu’elle est facile, mais parce qu’elle suffit souvent : plusieurs enfants sur dix normalisent leur acuité sans jamais porter de cache.',
    cle: 'Correction totale sous cycloplégie, portée en permanence, réévaluée après 4 à 6 semaines minimum — et jusqu’à 12 à 18 semaines pour juger complètement.',
    err: 'Débuter l’occlusion en même temps que les lunettes : on ne saura jamais laquelle des deux a agi, et on aura imposé un cache peut-être inutile.' },

  { fig: 'occlusion', img: 'L’occlusion se colle sur la peau, pas sur le verre : un cache sur la monture laisse toujours un enfant regarder par-dessus, à côté ou en dessous.',
    cle: 'La dose se règle sur l’âge et la profondeur : de 2 h/jour dans les formes modérées à 6 h dans les plus profondes — le temps total compte plus que la continuité.',
    ex: 'Associer des activités de près pendant l’occlusion (dessin, jeux, lecture) améliore le résultat par rapport à une occlusion passive devant un écran lointain.' },

  { cle: 'Pénalisation optique ou atropine dans l’œil sain : efficacité comparable à l’occlusion dans les amblyopies modérées, et bien mieux acceptée.',
    ex: 'C’est l’alternative à proposer avant l’échec, pas après : un adolescent qui refuse le cache accepte souvent une atropine le week-end.',
    err: 'Pénaliser un œil sain dont l’amétropie ne s’y prête pas : la pénalisation optique ne fonctionne que si elle rend réellement l’œil sain moins performant à la distance travaillée.' },

  { img: 'Chez le tout-petit, l’occlusion forte peut renverser l’amblyopie : l’œil sain occlus devient à son tour amblyope. D’où la règle de contrôle serrée.',
    cle: 'Repère empirique dans les occlusions fortes du très jeune enfant : une semaine de délai de contrôle par année d’âge.',
    ex: 'On surveille l’acuité des deux yeux, jamais du seul œil traité : c’est l’acuité de l’œil occlus qui signale l’amblyopie à bascule.' },

  {
    img: 'On ne coupe pas une occlusion, on la desserre. Comme une attelle retirée trop tôt, un œil laissé seul du jour au lendemain reprend ses mauvaises habitudes — et la première année est celle où il essaie.',
    err: 'Arrêter net dès que l’acuité est normalisée. Le risque de récidive est réel, surtout chez le jeune enfant et sur les amblyopies profondes : occlusion d’entretien, puis surveillance prolongée.', cle: 'Un arrêt brutal expose à la récidive : on réduit progressivement, puis on garde une occlusion d’entretien quelques heures par semaine.',
    ex: 'La récidive est fréquente dans l’année qui suit l’arrêt, et silencieuse : c’est le contrôle programmé, pas la plainte, qui la détecte.' },

  { img: 'Devant un échec, on ne monte pas la dose : on refait la liste dans l’ordre. Neuf fois sur dix, la réponse est dans les quatre premières lignes.',
    cle: 'La correction est-elle totale ? est-elle portée ? l’occlusion est-elle réellement faite ? y a-t-il des activités de près ? — et seulement ensuite : la cause est-elle bien fonctionnelle ?',
    ex: 'Le carnet de suivi tenu par la famille n’est pas un outil de contrôle : c’est le seul moyen de distinguer un traitement inefficace d’un traitement non fait.' }
],

UE26: [
  { img: 'La basse vision ne se mesure pas seulement en dixièmes : un champ tubulaire à 5/10 empêche de traverser une rue, un scotome central à 2/10 empêche de lire mais laisse marcher.',
    cle: 'Deux paramètres, pas un : l’acuité et le champ. C’est leur combinaison qui décrit le handicap réel.',
    err: 'Annoncer un pronostic fonctionnel sur la seule acuité : c’est ce qui fait dire « vous voyez encore 3/10 » à quelqu’un qui ne peut plus sortir seul.' },

  { fig: 'profils',
    img: 'Trois profils, trois plaintes qui ne se ressemblent pas : le central ne lit plus mais se déplace ; le périphérique lit encore mais se cogne ; le flou global perd tout à la fois.',
    cle: 'Atteinte centrale → lecture et visages. Atteinte périphérique → déplacement et vision nocturne. La rééducation part de là.',
    ex: 'Un patient DMLA et un patient glaucomateux au même 2/10 n’ont besoin ni des mêmes aides, ni du même accompagnement.' },

  { cle: 'Grossissement nécessaire ≈ acuité souhaitée / acuité actuelle ; règle de Kestenbaum : addition ≈ inverse de l’acuité décimale.',
    ex: 'Acuité 1/10 → environ +10 D pour lire un texte standard, donc une distance de travail de 10 cm : c’est la contrainte qu’il faut expliquer avant de la prescrire, sinon l’aide finit dans un tiroir.',
    err: 'Sur-grossir : plus on grossit, moins on voit de mots à la fois, et plus la lecture devient laborieuse. On cherche le grossissement minimal efficace.' },

  { img: 'L’éclairage est l’aide la moins chère et la plus rentable : une lampe orientable placée près du document fait souvent gagner plus qu’une loupe.',
    cle: 'Trois à cinq fois l’éclairement usuel, source proche du document, orientée pour éviter le reflet — et un fort contraste sur tout ce qui compte.',
    ex: 'Marquer d’une bande contrastée le bord des marches et le bouton du micro-ondes change plus le quotidien qu’un télé-agrandisseur.' },

  {
    img: 'Une aide visuelle ne rend pas la vue : elle agrandit ce qui reste. C’est une loupe posée sur une carte déchirée — plus on grossit, plus on voit gros, et moins on voit à la fois.',
    err: 'Prescrire le grossissement maximal disponible. Le bon réglage est le plus faible qui permette la tâche : au-delà, le champ utile devient si étroit que la lecture s’arrête.', cle: 'Aucune aide ne se prescrit sans essai, avec l’éclairage réel et sur un texte réel du patient.',
    ex: 'Loupe à main pour le prix en magasin, loupe à poser pour le courrier, télé-agrandisseur pour lire longtemps : une aide par usage, pas une aide pour tout.' },

  { img: 'La basse vision est un travail d’équipe où l’orthoptiste est souvent le pivot : c’est lui qui voit le patient le plus longtemps et le plus régulièrement.',
    cle: 'Ophtalmologiste, orthoptiste, opticien spécialisé, ergothérapeute, instructeur en locomotion, MDPH : connaître le parcours fait partie du soin.',
    ex: 'Savoir orienter vers la MDPH au bon moment (aides techniques, reconnaissance du handicap) fait souvent plus pour l’autonomie qu’une séance de plus.' }
],

UE28: [
  { img: 'Une question de recherche mal posée ne se rattrape pas : on cherchera longtemps et on trouvera tout, c’est-à-dire rien.',
    cle: 'PICO : population, intervention, comparateur, critère de jugement. Les quatre, ou la question n’est pas cherchable.',
    ex: '« La rééducation orthoptique aide-t-elle les dyslexiques ? » n’est pas une question. « Améliore-t-elle la vitesse de lecture d’enfants dyslexiques de 8–12 ans par rapport à l’absence de rééducation ? » en est une.' },

  {
    img: 'PubMed est la bibliothèque ; Cochrane en est le rayon des synthèses déjà faites. Commencer par Cochrane, c’est demander si quelqu’un a déjà lu les cent articles à votre place.',
    ex: 'Une revue qui accepte en quarante-huit heures et facture la publication n’est pas une revue, c’est une imprimerie : le nom sonne scientifique, le texte n’a été relu par personne.', cle: 'PubMed pour la littérature médicale, Cochrane pour les revues systématiques, LiSSa pour le français : chaque base a son usage.',
    err: 'Prendre un moteur académique généraliste pour une base bibliographique : il trouve tout, y compris ce qui n’a jamais été relu par personne.' },

  { img: 'Une équation de recherche est un entonnoir : les synonymes reliés par OU élargissent chaque concept, les concepts reliés par ET resserrent le résultat.',
    cle: 'Notez vos équations et vos dates d’interrogation : elles font partie de la méthode et doivent figurer dans le mémoire.',
    ex: 'Sans équation notée, un mémoire n’est pas reproductible — et c’est précisément ce qu’on vous demandera de justifier en soutenance.' },

  { fig: 'preuve', img: 'La pyramide des preuves se lit de haut en bas : méta-analyse, essai randomisé, cohorte, cas-témoins, série de cas, avis d’expert. Plus on descend, plus la place laissée au hasard et au biais grandit.',
    cle: 'Un avis d’expert reste un niveau de preuve — le plus bas. Ce n’est pas une raison de l’ignorer, c’en est une de ne pas le citer comme une démonstration.',
    err: 'Changer de style de citation en cours de mémoire : un seul style, tenu du début à la fin.' },

  {
    img: 'OU élargit, ET resserre : on remplit un concept avec des OU, puis on serre les concepts entre eux avec des ET. Un entonnoir qu’on charge large et qu’on referme par étages.',
    err: 'Se servir de SAUF pour faire le ménage : il élimine aussi ce qu’on n’avait pas prévu. Et une équation non documentée — base, date d’interrogation — n’est pas reproductible, donc pas défendable.', cle: 'On part de PICO, on extrait les concepts, on cherche pour chacun ses synonymes et son terme MeSH, puis on combine.',
    ex: 'Le MeSH est un vocabulaire contrôlé : chercher « strabismus »[MeSH] rapatrie aussi les articles qui écrivent « squint », ce qu’un mot libre ne fera jamais.' },

  { img: 'Une revue prédatrice publie tout, vite, contre paiement : pas de relecture, pas de garantie. Les repérer fait partie du tri.',
    cle: 'Recommandations de sociétés savantes et revues systématiques d’abord ; le reste se lit avec la grille de lecture, jamais comme une conclusion.',
    err: 'Citer un article parce qu’il conclut dans le sens qu’on espérait, sans regarder son effectif ni son protocole.' }
],

UE32: [
  { img: 'Une question ouverte ouvre le champ, une question fermée le referme. On explore d’abord, on précise ensuite — jamais l’inverse.',
    cle: 'Reformuler n’est pas répéter : c’est renvoyer au patient ce qu’on a compris, pour qu’il puisse corriger.',
    ex: '« Votre œil ne travaille pas assez et on va l’entraîner » se comprend ; « amblyopie fonctionnelle » ne se comprend pas — et ne se retient pas non plus.' },

  { img: 'Informer, c’est parler. Éduquer, c’est vérifier ce qui a été appris. La différence se mesure à la question qu’on pose en fin de séance.',
    cle: 'Diagnostic éducatif → objectifs partagés → séances d’apprentissage → évaluation des acquis. Sans la dernière étape, ce n’est pas de l’ETP.',
    ex: 'Demander à un parent de montrer comment il pose le cache apprend plus que dix minutes d’explications.' },

  {
    img: 'Une consigne dite s’évapore à la porte du cabinet ; une consigne écrite tient jusqu’à la maison. Le carnet de suivi fait mieux encore : il transforme « ça allait à peu près » en une donnée qu’on peut lire.',
    err: 'Se contenter d’un « vous faites ça tous les jours » à l’oral. Sans rythme, sans durée et sans papier, l’observance ne se mesure pas — et ce qui ne se mesure pas ne s’ajuste pas.', cle: 'Toute consigne à domicile est remise par écrit, en langage simple, avec le rythme et la durée.',
    ex: 'Le carnet de suivi sert autant au patient qu’au thérapeute : il transforme un « ça va à peu près » en une donnée qu’on peut discuter.' },

  { img: 'On n’argumente pas contre une émotion : on la nomme. Un parent en colère ne demande pas des explications supplémentaires, il demande d’abord à être entendu.',
    cle: 'Nommer ce qui se passe, laisser passer, puis revenir aux objectifs communs. Dans cet ordre.',
    err: 'Répondre à une contestation par un argument d’autorité : on gagne l’échange et on perd le patient.' },

  { fig: 'annonce', img: 'Annoncer, c’est d’abord se taire : après la phrase, le silence appartient au patient.',
    cle: 'Cadre calme, vérifier ce que la personne sait et ce qu’elle veut savoir, annoncer en mots simples, se taire, puis proposer un revoir.',
    ex: 'Ce qui est retenu d’une annonce tient rarement à ce qui a été dit : cela tient à la façon dont on a laissé la personne réagir.' },

  {
    img: 'On ne parle pas à un âge, on parle à quelqu’un : à l’enfant on donne un rôle, à l’adolescent on négocie le cadre et non le principe, à la personne âgée on ralentit et on écrit gros.',
    err: 'Faire traduire par un proche — et pire, par un enfant de la famille. On lui fait porter des mots qui ne sont pas les siens, et plus rien ne garantit ce qui a été dit.', cle: 'À l’enfant on parle directement avec des mots concrets et un rôle actif ; à l’adolescent on négocie le cadre plutôt que d’imposer.',
    ex: '« C’est ton œil paresseux qui va s’entraîner, et c’est toi qui tiens le carnet » donne à l’enfant une place — et c’est cette place qui fait tenir six mois d’occlusion.' }
],

UE37: [
  { fig: 'raisonnement', img: 'Le bilan n’est pas une liste qu’on déroule : c’est une série d’hypothèses qu’on teste. Chaque examen doit répondre à une question qu’on s’est posée avant de le lancer.',
    cle: 'Plainte → hypothèses → examens choisis → confirmation ou réfutation → diagnostic orthoptique.',
    err: 'Faire tous les tests « pour être complet ». Un bilan exhaustif sans hypothèse produit des chiffres sans conclusion.' },

  { img: 'Le diagnostic orthoptique décrit un dysfonctionnement et ce qu’il coûte au patient. Ce n’est ni un diagnostic médical, ni un simple relevé de mesures.',
    cle: 'Un bon diagnostic orthoptique tient en une phrase et contient toujours le retentissement : « insuffisance de convergence avec asthénopie de lecture et retentissement scolaire ».',
    ex: 'C’est cette phrase que le prescripteur lira. Le reste du compte rendu la justifie.' },

  {
    img: 'Un projet de soins sans critère d’arrêt est un trajet sans terminus : on continue parce qu’on a toujours continué. Les objectifs mesurables sont ce qui permet de dire « c’est fini » — ou « ça ne marche pas ».',
    err: 'Fixer des objectifs qualitatifs (« améliorer le confort ») qu’on ne peut ni chiffrer au départ ni comparer à l’arrivée. Sans chiffre initial, aucun progrès n’est démontrable.', cle: 'Des objectifs mesurables, un rythme, une durée prévisionnelle et un critère d’arrêt : sans critère d’arrêt, une rééducation s’éternise.',
    ex: 'PPC sous 6 cm, amplitudes doublées, disparition de la plainte à la lecture : trois objectifs chiffrés valent mieux qu’un « amélioration de la convergence ».' },

  { img: 'Un compte rendu s’écrit pour son destinataire : le prescripteur veut une conclusion et une proposition, l’enseignant veut des aménagements concrets.',
    cle: 'Daté, chiffré, comparable au précédent, avec une conclusion explicite.',
    err: 'Envoyer le même document à tout le monde : celui qui ne trouve pas ce qu’il cherche ne le lira pas deux fois.' },

  {
    img: 'Quatre issues, une seule sortie : rééduquer, corriger, surveiller, adresser. Le diagnostic orthoptique ne s’arrête pas au constat — il désigne laquelle, et dit pourquoi les trois autres sont écartées.',
    err: 'Rééduquer sur une correction fausse. C’est le scénario le plus fréquent : la plainte venait de l’amétropie non compensée, la rééducation ne prend pas, et l’on conclut à tort à un échec de la méthode.', cle: 'Quatre issues possibles à un bilan : rééduquer, corriger d’abord, surveiller, ou adresser. Le raisonnement doit dire laquelle et pourquoi.',
    ex: 'Un trouble fonctionnel, rééducable et gênant : on rééduque. Une amétropie non corrigée : on corrige et on revoit. Une incomitance récente : on adresse, et on ne rééduque pas.' },

  { img: 'On réévalue avec les mêmes mesures qu’au bilan initial — sinon on ne compare rien, on juxtapose deux examens.',
    cle: 'Trois issues à une réévaluation : objectifs atteints (on arrête et on programme un contrôle), progression insuffisante (on ajuste), absence d’évolution (on remet le diagnostic en cause).',
    err: 'Poursuivre par habitude une rééducation qui ne progresse plus : au bout de quelques séances sans évolution, c’est le diagnostic qu’il faut réinterroger.' }
],

/* ============================ SEMESTRE 4 ============================ */

UE21: [
  { img: 'Une cohorte suit des gens qui vont peut-être tomber malades ; une étude cas-témoins part de malades et remonte le temps. La première coûte cher et convainc, la seconde est rapide et fragile.',
    cle: 'Le tirage au sort supprime les biais de sélection, l’aveugle supprime les biais de mesure. C’est ce couple qui fait la force de l’essai randomisé.',
    err: 'Confondre prospectif et rétrospectif : ce n’est pas la date de l’étude qui compte, c’est le sens dans lequel on suit les patients.' },

  { img: 'La prévalence est une photo : combien de cas maintenant. L’incidence est un film : combien de cas nouveaux par unité de temps.',
    cle: 'Risque relatif dans les cohortes, odds ratio dans les cas-témoins — l’un et l’autre se lisent par rapport à 1.',
    ex: 'Un RR de 1,0 signifie qu’il ne se passe rien. C’est la première chose à regarder avant même le p.' },

  { fig: 'sesp',
    img: 'Un test sensible sert à éliminer, un test spécifique sert à confirmer. « SnNout, SpPin » : sensible + négatif = out, spécifique + positif = in.',
    cle: 'Sensibilité et spécificité ne dépendent pas de la prévalence ; les valeurs prédictives, si.',
    ex: 'C’est pourquoi un test excellent en consultation spécialisée devient décevant en dépistage de masse : la population a changé, pas le test.' },

  { fig: 'stats', cle: 'Décrire avant de tester : moyenne et écart-type si la distribution est normale, médiane et interquartiles sinon.',
    ex: 'Comparer deux moyennes indépendantes : t de Student, ou Mann-Whitney si la normalité n’est pas là. Deux pourcentages : khi-deux, ou Fisher sur petits effectifs.',
    err: 'Appliquer un test paramétrique à des données qui ne s’y prêtent pas : le résultat sortira quand même, et il sera faux.' },

  { img: 'Un p ne mesure pas l’importance d’un effet : il mesure la probabilité d’observer ces données si l’effet n’existait pas. Un p non significatif n’est pas la preuve d’une absence d’effet.',
    cle: 'Regardez toujours la taille d’effet et l’intervalle de confiance à 95 % : le premier dit combien, le second dit avec quelle précision.',
    ex: 'Un intervalle de confiance large qui contient 1 raconte la même chose qu’un p à 0,3 — mais il le raconte mieux.' },

  { cle: 'Trois réflexes devant un tableau de résultats : l’effectif et les perdus de vue, la différence entre significatif et pertinent, et le critère de jugement réellement mesuré.',
    ex: 'Une différence spectaculaire sur douze patients ne vaut rien ; un gain de 0,02 logMAR statistiquement significatif sur mille patients ne change la vie de personne.',
    err: 'Se laisser convaincre par un critère de substitution : « amélioration des amplitudes de fusion » n’est pas « le patient lit sans gêne ».' }
],

UE22: [
  { fig: 'voies',
    img: 'Le champ visuel est une carte routière de la voie optique : la forme du déficit dit à quel carrefour la lésion se trouve.',
    cle: 'Monoculaire → devant le chiasma. Bitemporal → chiasma. Homonyme → derrière. Plus le déficit est congruent, plus la lésion est postérieure.',
    ex: 'Hémianopsie bitemporale chez un patient qui se plaint de se cogner aux montants de porte : on pense adénome hypophysaire, et on ne rééduque pas avant l’IRM.' },

  { fig: 'pupille', img: 'Le test de l’éclairement alterné compare les deux nerfs entre eux : la pupille du côté malade se dilate quand la lumière lui revient, parce qu’elle reçoit moins de signal que sa voisine.',
    cle: 'Un DPAR (Marcus Gunn) signe une atteinte asymétrique du nerf optique ou une atteinte rétinienne étendue — et il ne dépend pas de la coopération du patient.',
    err: 'Chercher un DPAR dans une atteinte bilatérale et symétrique : il sera absent, alors que les deux nerfs sont malades.' },

  { fig: 'paralysies',
    img: 'Le VI est le nerf le plus long et le plus exposé : il souffre pour beaucoup de raisons, dont certaines n’ont rien à voir avec l’orbite.',
    cle: 'Ésotropie majorée de loin et dans le regard du côté atteint, abduction limitée, diplopie horizontale, torticolis tête tournée du côté atteint.',
    ex: 'Une paralysie du VI peut n’être qu’un signe d’hypertension intracrânienne — c’est un « faux signe localisateur » : il ne dit pas où est la lésion.' },

  { fig: 'parks', img: 'Le IV se lit à la tête : le patient penche vers l’épaule opposée, parce que c’est là que la déviation est la plus petite. Bielschowsky ne fait que reproduire l’inverse.',
    cle: 'Hypertropie majorée en adduction et à l’inclinaison du côté atteint : c’est l’association des trois pas qui signe l’oblique supérieur.',
    ex: 'Une vieille photo d’enfance avec la même inclinaison de tête transforme une diplopie « récente » en décompensation d’une paralysie congénitale.' },

  { img: 'Devant un III, tout se joue sur la pupille : l’atteinte de la pupille fait craindre une compression, son respect oriente vers une souffrance microvasculaire.',
    cle: 'Ptosis, œil en abduction et légèrement abaissé, adduction et verticalité limitées. Pupille atteinte = urgence, jusqu’à preuve du contraire.',
    err: 'Se rassurer devant un III douloureux chez un patient diabétique sans regarder la pupille : l’anévrisme de la communicante postérieure ne pardonne pas l’attente.' },

  { img: 'Névrite rétrobulbaire : « le patient ne voit rien, le médecin ne voit rien ». Œdème papillaire bilatéral : c’est l’inverse, on voit tout au fond d’œil et l’acuité est longtemps conservée.',
    cle: 'Baisse rapide chez un sujet jeune, douleur à la mobilisation, dyschromatopsie rouge-vert et DPAR : névrite optique jusqu’à preuve du contraire.',
    ex: 'Un œdème papillaire bilatéral avec céphalées et éclipses visuelles impose un avis en urgence : c’est une hypertension intracrânienne jusqu’à preuve du contraire.' }
],

UE23: [
  { img: 'Un bilan neuro-orthoptique n’est pas un bilan orthoptique plus long : il ajoute le versant fonctionnel — lire, se déplacer, tenir une journée de travail.',
    cle: 'Aux mesures habituelles s’ajoutent l’exploration visuelle, la lecture et le retentissement dans la vie réelle. Sans ce versant, on ne saura pas quoi rééduquer.',
    ex: 'Deux patients avec la même hémianopsie n’ont pas le même handicap selon qu’ils lisent de gauche à droite en explorant bien, ou qu’ils sautent la moitié des mots.' },

  { img: 'En phase aiguë, on soulage sans figer : soulager la diplopie, oui ; installer une occlusion permanente du même œil, non.',
    cle: 'Occlusion alternée, secteur occlusif, prisme de Fresnel — puis on attend la stabilisation, souvent six mois, avant tout geste définitif.',
    err: 'Occlure toujours le même œil chez un enfant : on traite une diplopie et on crée une amblyopie.' },

  { fig: 'hlh', img: 'Une hémianopsie ne se récupère pas : on apprend à aller chercher l’information du côté aveugle, par un balayage volontaire qui devient réflexe.',
    cle: 'La rééducation vise la compensation : agrandir les saccades d’exploration vers l’hémichamp aveugle et systématiser le balayage.',
    ex: 'La lecture demande un travail spécifique : hémianopsie droite → difficulté à trouver le mot suivant ; hémianopsie gauche → difficulté à retrouver le début de ligne.' },

  { img: 'L’héminégligence n’est pas une cécité : le patient pourrait voir, mais il ne regarde pas. Son déficit porte sur l’attention, pas sur l’entrée sensorielle.',
    cle: 'Négligence : le patient ne se plaint de rien (anosognosie). Hémianopsie : il sait qu’il ne voit pas d’un côté. C’est la différence la plus utile en pratique.',
    err: 'Rééduquer une négligence comme une hémianopsie : le balayage volontaire ne suffit pas si l’attention ne se dirige pas de ce côté.' },

  { img: 'Après un traumatisme crânien, la plainte visuelle est immense et les examens sont souvent normaux : c’est le couple convergence/accommodation qui lâche, pas l’œil.',
    cle: 'Fatigue visuelle, insuffisance de convergence, trouble accommodatif, gêne aux écrans et aux environnements chargés : un tableau fréquent et très sous-diagnostiqué.',
    ex: 'Ce sont des patients pour lesquels une rééducation bien conduite change réellement le quotidien — à condition d’avoir cherché la plainte.' },

  {
    img: 'En neuro-ophtalmologie, l’objectif ne se mesure pas en dixièmes mais en gestes : lire, se déplacer, reprendre le travail, conduire. C’est le patient qui nomme la cible, pas le bilan.',
    err: 'Évoquer la reprise de la conduite sans vérifier le champ visuel : elle est réglementée, et ne se juge ni sur le ressenti du patient ni sur l’acuité seule.', cle: 'Les objectifs sont fonctionnels : lire, se déplacer, reprendre le travail, la conduite — cette dernière étant réglementée selon le champ visuel.',
    ex: 'Travail en réseau avec neurologue, médecin de rééducation, ergothérapeute et neuropsychologue : en neurovisuel, l’orthoptiste travaille rarement seul.' }
],

UE27: [
  { img: 'Un bilan de basse vision ne cherche pas ce qui est perdu mais ce qui reste et comment s’en servir : c’est un inventaire de ressources.',
    cle: 'Acuités en logMAR à distance adaptée, sensibilité aux contrastes, champ, éblouissement, vitesse de lecture — et surtout : que veut faire le patient ?',
    err: 'Mesurer à 5 m un patient qui ne voit pas le plus gros optotype : on réduit la distance et on note la distance, c’est tout.' },

  { fig: 'scotome', img: 'Quand la fovéa ne répond plus, le patient se choisit un nouveau point de fixation, un peu à côté du scotome. Il l’a souvent trouvé seul — la rééducation consiste à le rendre stable et conscient.',
    cle: 'Locus rétinien préférentiel : on le repère, on l’entraîne, on l’installe. Regarder « à côté » pour mieux voir est contre-intuitif : il faut l’expliquer.',
    ex: 'Un patient DMLA qui dit « quand je regarde votre nez, votre visage disparaît, mais si je regarde votre épaule je vous vois » décrit exactement son LRP.' },

  {
    img: 'On ne rééduque pas une acuité, on rééduque une stratégie : apprendre où poser l’œil quand le centre ne répond plus, comme on apprend à lire une page en la balayant plutôt qu’en la fixant.',
    err: 'Travailler sur du matériel de rééducation quand le patient veut lire son courrier. Le transfert ne se fait pas tout seul : on rééduque avec les objets de sa vie.', cle: 'Stabilisation de la fixation → balayage et poursuite → repérage → lecture avec aide → mise en situation. Séances courtes et rapprochées.',
    ex: 'On travaille sur le matériel du quotidien — courrier, factures, notice de médicament — pas sur des planches d’exercice : c’est le transfert qui compte.' },

  { img: 'Une aide grossissante rapproche : forte addition, distance de travail très courte, champ de lecture réduit. Ce sont ces contraintes-là, plus que le prix, qui font abandonner une aide.',
    cle: 'Essai systématique avant prescription, avec l’éclairage définitif et sur un texte réel.',
    err: 'Prescrire la plus forte loupe disponible : le grossissement minimal efficace est celui qui laisse encore assez de mots dans le champ.' },

  {
    img: 'Dans les atteintes périphériques, le danger n’est pas de mal lire : c’est de tomber dans l’escalier. Un contraste au sol et un bon éclairage valent des séances.',
    err: 'Concentrer la prise en charge sur la lecture chez un patient au champ tubulaire. Il vous parlera de son journal ; c’est sa marche qu’il faut sécuriser d’abord.', cle: 'Dans les atteintes périphériques, l’enjeu n’est pas la lecture mais le déplacement : locomotion, contraste au sol, éclairage des escaliers, aménagement du domicile.',
    ex: 'La coordination avec l’instructeur en locomotion et l’ergothérapeute fait partie du soin : une canne blanche proposée au bon moment vaut plusieurs séances.' },

  { img: 'Les objectifs se négocient dans les mots du patient : « relire mon courrier », « reconnaître mes petits-enfants », « refaire mes chèques ». Ce sont eux qu’on réévaluera.',
    cle: 'Objectifs négociés, réévalués à distance, aides adaptées quand la pathologie évolue : la basse vision est un suivi, pas un épisode.',
    ex: 'Un objectif formulé par le patient est aussi le meilleur critère d’arrêt : quand il est atteint, on le dit — et on programme un contrôle.' }
],

/* ============================ SEMESTRE 5 ============================ */

UE29: [
  { fig: 'lecture',
    img: 'On croit lire en balayant : on lit en sautant. L’œil saute de 7 à 9 caractères, s’arrête un quart de seconde, prélève, et repart. L’information n’entre que pendant les arrêts.',
    cle: 'Saccades de progression, fixations de 200 à 250 ms, régressions (10 à 15 % chez le lecteur expert). Une lecture lente peut venir de saccades trop courtes ou de régressions trop nombreuses.',
    ex: 'C’est ce qui permet de distinguer un enfant qui décode mal (régressions massives, fixations longues) d’un enfant dont l’oculomotricité est en cause.' },

  { cle: 'On explore la réfraction, la convergence, l’accommodation et la motricité de lecture — chacune peut fatiguer un lecteur par un mécanisme différent.',
    ex: 'Une hypermétropie non corrigée de +1,50 ne baisse pas l’acuité et gâche pourtant une heure de devoirs : c’est l’effort accommodatif soutenu qui coûte, pas la netteté.',
    err: 'Conclure « tout est normal » après une acuité et un cover test : sans PPC répété, ni souplesse accommodative, on n’a pas exploré ce dont l’enfant se plaint.' },

  {
    img: 'L’orthoptie règle le confort de lecture, pas le décodage : elle rend l’outil utilisable plus longtemps, elle n’apprend pas à lire. Un moteur mieux réglé ne remplace pas le permis.',
    err: 'Laisser croire à une famille que la rééducation orthoptique traitera la dyslexie. Le bénéfice porte sur l’endurance et le confort, parfois la vitesse — jamais sur le décodage.', cle: 'L’orthoptiste traite ce qui est fonctionnel et rééducable : insuffisance de convergence, trouble accommodatif, fixation et saccades instables.',
    ex: 'Chez un enfant en difficulté scolaire, corriger une insuffisance de convergence ne guérit pas sa dyslexie — mais lui rend l’endurance qui lui manquait pour travailler.' },

  { img: 'La dyslexie est un trouble du langage écrit d’origine phonologique : le problème n’est pas dans l’œil, il est dans le lien entre le son et la lettre.',
    cle: 'L’orthoptiste ne pose pas ce diagnostic et ne traite pas la dyslexie. Il traite ce qui, en plus, gêne le lecteur.',
    err: 'Laisser croire à une famille qu’une rééducation orthoptique remplacera l’orthophonie : c’est un an de perdu pour l’enfant.' },

  {
    img: 'Le compte rendu ne s’écrit pas pour soi : il s’écrit pour l’orthophoniste, l’enseignant ou le médecin scolaire, qui n’ont pas votre vocabulaire. Un chiffre non interprété n’est pas une information pour eux.',
    err: 'Livrer des chiffres bruts sans retentissement ni proposition. « PPC à 12 cm » ne dit rien à un enseignant ; « se fatigue après dix minutes de lecture, aménagements conseillés » lui dit tout.', cle: 'Un compte rendu utile dit ce qu’on a trouvé, ce que cela change pour l’enfant, et ce qui relève d’un autre professionnel.',
    ex: 'Le destinataire est souvent l’orthophoniste, l’enseignant ou le médecin scolaire : trois lecteurs qui n’attendent pas la même chose du même bilan.' },

  { img: 'Un enseignant ne fera rien d’un « PPC à 15 cm ». Il fera beaucoup de « perd sa ligne en copiant au tableau ».',
    cle: 'Pour l’école : pas de chiffres, pas de jargon — ce que l’élève n’arrive pas à faire, dans quelles conditions, et ce qui l’aide concrètement.',
    ex: 'Trois aménagements précis (photocopie plutôt que copie au tableau, texte agrandi et aéré, place au premier rang) valent mieux que deux pages de mesures.' }
],

UE30: [
  { img: 'En neurovisuel, l’œil va bien et la vision ne marche pas : le patient voit sans reconnaître, ou ne perçoit qu’un objet à la fois dans une scène entière.',
    cle: 'Agnosie visuelle, prosopagnosie, simultagnosie et syndrome de Balint : le déficit porte sur le traitement, pas sur l’entrée.',
    ex: 'Un patient qui ne reconnaît pas un visage mais reconnaît la voix, la démarche et le manteau ne perd pas la vue : il perd un module de traitement.' },

  { img: 'L’équilibre est un vote à trois voix : vision, vestibule, proprioception. Quand deux voix se contredisent, le corps hésite — et c’est le vertige.',
    cle: 'Une dépendance visuelle excessive rend instable dans les environnements chargés : supermarché, escalator, foule.',
    ex: 'Le patient qui va bien chez lui et se sent mal dans un rayon de supermarché décrit exactement ce conflit sensoriel.' },

  { fig: 'nystagmus', img: 'Le nystagmus congénital ne fait pas bouger le monde : le cerveau a appris à annuler l’oscillation. Un nystagmus acquis, lui, fait osciller le monde — et c’est intolérable.',
    cle: 'Oscillopsies = acquis, donc à explorer. Torticolis vers une zone neutre et amélioration par la convergence = congénital.',
    err: 'Passer à côté d’un nystagmus acquis chez l’adulte en le mettant sur le compte d’une « fatigue » : c’est un signe neurologique.' },

  {
    img: 'En neurovisuel, un progrès qui reste au cabinet ne vaut rien. On travaille l’exploration comme on apprend un trajet : dans la rue, pas sur le plan.',
    err: 'Allonger les séances parce que ça progresse. La fatigabilité est majeure : plusieurs séances courtes font davantage qu’une longue, qui finit toujours moins bien qu’elle n’a commencé.', cle: 'La rééducation neurovisuelle vise des stratégies compensatoires en situation réelle : exploration organisée, ancrage, ralentissement volontaire, double tâche progressive.',
    ex: 'Séances courtes, car ces patients fatiguent vite : trente minutes efficaces valent mieux qu’une heure dont la seconde moitié n’apprend rien.' },

  { cle: 'La vision intervient dans environ la moitié des chutes du sujet âgé — et une partie est évitable.',
    ex: 'Correction à jour, cataracte opérée, contraste des marches, éclairage des escaliers : quatre vérifications qui pèsent plus que bien des exercices.',
    err: 'Prescrire des verres progressifs neufs à une personne âgée qui chute déjà : la zone de lecture en bas du verre floute exactement les marches.' },

  { img: 'Le bilan neurovisuel repose sur l’observation, donc sur le jugement : c’est sa richesse et sa fragilité.',
    cle: 'Le risque permanent est d’attribuer à la vision ce qui relève de l’attention, de la fatigue ou de l’humeur. On décrit ce qu’on observe, on ne conclut pas au-delà.',
    err: 'Écrire « trouble neurovisuel » sur la foi d’un seul test raté un jour de fatigue.' }
],

UE31: [
  {
    img: 'Le dépistage suit ce que l’enfant sait faire : une lueur au berceau, une poursuite à quatre mois, une acuité quand il sait nommer. Le calendrier n’est pas administratif, il est développemental.',
    err: 'Croire que le dépistage s’arrête à l’école. Après 40 ans : pression et fond d’œil — et plus tôt en cas d’antécédents familiaux, de myopie forte ou de diabète.', cle: 'Le calendrier est réglementaire : maternité, 4 mois, 9 mois, 24 mois, puis 3–4 ans avec mesure de l’acuité, et de nouveau à 6 ans.',
    ex: 'Chaque âge a le test qu’il permet : lueur pupillaire au berceau, reflets et occlusion alternée à 4 mois, optotypes imagés à 3 ans.' },

  { img: 'Dépister, ce n’est pas diagnostiquer : c’est trier. Un bon dépistage laisse passer peu de malades, quitte à adresser quelques bien-portants.',
    cle: 'Conditions standardisées (distance, éclairage, correction portée), test œil par œil, seuils d’adressage écrits à l’avance.',
    err: 'Rassurer une famille sur la foi d’un test de dépistage : un dépistage négatif ne dit pas « tout va bien », il dit « rien n’a été détecté aujourd’hui ».' },

  { fig: 'ecran',
    img: 'Un écran bien placé se regarde légèrement vers le bas, à bout de bras, perpendiculaire à la fenêtre. Trois réglages qui ne coûtent rien et qui règlent la moitié des plaintes de fatigue visuelle.',
    err: 'Traiter une plainte d’écran par la seule correction optique. L’ergonomie visuelle et posturale vont ensemble : un poste mal réglé refait la plainte dans la semaine.', cle: 'Écran à 50–70 cm, bord supérieur à hauteur des yeux ou en dessous, perpendiculaire aux fenêtres, sans reflet.',
    ex: 'La plainte d’un salarié devant écran se résout plus souvent en déplaçant un bureau qu’en changeant une correction.' },

  { img: 'Devant un écran, le clignement chute de moitié : le film lacrymal s’évapore, et c’est lui, bien plus que la « lumière bleue », qui fait mal aux yeux en fin de journée.',
    cle: 'Règle 20-20-20 : toutes les 20 minutes, regarder à 6 mètres pendant 20 secondes. Elle relâche accommodation et convergence.',
    err: 'Attribuer toute fatigue visuelle sur écran à la lumière bleue : la sécheresse et l’effort accommodatif expliquent l’essentiel des plaintes.' },

  {
    img: 'Deux heures dehors par jour est la mesure la mieux établie — et la seule qui soit gratuite. La myopie de l’enfant se joue autant sur le temps passé au loin que sur ce qu’on lui met devant les yeux.',
    err: 'Réserver la freination aux fortes myopies déjà installées. C’est la vitesse de progression qui décide, et elle se mesure tôt : atropine faible dose, défocalisation périphérique, orthokératologie.', cle: 'La progression de la myopie de l’enfant est liée au travail de près prolongé et au manque d’extérieur : au moins 2 heures dehors par jour.',
    ex: 'C’est un conseil de prévention à donner à toutes les familles d’enfants myopes, au même titre que la correction : la lumière extérieure a un effet propre sur la croissance du globe.' },

  { img: 'Une action de dépistage qui n’a pas prévu où adresser produit de l’inquiétude, pas du soin.',
    cle: 'Population visée, tests choisis pour leur sensibilité et leur faisabilité, seuils d’adressage écrits avant de commencer, circuit d’aval organisé.',
    ex: 'Le taux d’enfants effectivement vus après un adressage est le seul indicateur qui dise si l’action a servi à quelque chose.' }
],

UE33: [
  { img: 'L’OCT fait de l’interférométrie : il mesure le temps que met la lumière à revenir de chaque couche. C’est une coupe histologique obtenue sans toucher l’œil.',
    cle: 'Résolution micrométrique, sans contact : maculaire pour l’épaisseur et le fluide, papillaire pour le RNFL et les cellules ganglionnaires.',
    ex: 'C’est l’examen qui a le plus changé la pratique en vingt ans : il a rendu visible ce qu’on ne pouvait qu’imaginer au fond d’œil.' },

  { img: 'L’angiographie filme la circulation ; l’angio-OCT la photographie sans injection. La première voit les diffusions, la seconde voit la structure des vaisseaux.',
    cle: 'La diffusion ne se voit qu’en angiographie dynamique : l’angio-OCT ne la montre pas, et ne la remplace donc pas partout.',
    err: 'Considérer l’angio-OCT comme une angiographie sans piqûre : ce sont deux informations différentes, pas deux versions de la même.' },

  {
    img: 'La topographie dessine la carte du relief, la pachymétrie en donne l’épaisseur, la microscopie spéculaire compte les cellules qui la maintiennent sèche. Trois questions, trois appareils.',
    err: 'Interpréter une pression intraoculaire sans connaître la pachymétrie. Une cornée épaisse surestime la pression, une cornée fine la sous-estime — et c’est sur ce chiffre qu’on décide.', cle: 'Topographie pour la forme de la cornée, pachymétrie pour son épaisseur, microscopie spéculaire pour ses cellules endothéliales.',
    ex: 'Une cornée fine fait sous-estimer la pression intraoculaire : sans pachymétrie, un glaucome peut passer pour une simple hypertonie — ou l’inverse.' },

  {
    img: 'La biométrie mesure l’œil avant de lui choisir un implant : longueur axiale, kératométrie, profondeur de chambre. C’est la prise de mesures avant la coupe du costume, et l’erreur se voit à vie.',
    err: 'Confondre rétinophotographie et fond d’œil interprété. La photo autorise une lecture différée par un lecteur formé ; elle ne remplace pas l’examen quand la question est urgente.', cle: 'La biométrie optique (longueur axiale, kératométrie, profondeur de chambre) alimente le calcul d’implant avant chirurgie de la cataracte.',
    ex: 'Une erreur de biométrie se paie en dioptries après l’opération : c’est un examen où la rigueur du recueil vaut autant que l’appareil.' },

  { fig: 'artefacts', img: 'Un appareil rend toujours un chiffre. Savoir s’il est vrai est le travail de celui qui tient la sonde.',
    cle: 'Indice de qualité du signal, centrage, mouvements, segmentation automatique fausse en cas d’œdème ou de forte myopie — et jamais de comparaison entre deux appareils différents.',
    err: 'Suivre l’évolution d’un RNFL sur des machines différentes : les normes et les segmentations diffèrent, la courbe ne veut rien dire.' },

  { img: 'Une image de fond d’œil est une donnée de santé : la même règle que pour un compte rendu s’applique, y compris quand elle transite par un téléphone.',
    cle: 'RGPD, conservation dans le dossier, transmission par messagerie sécurisée de santé — jamais par messagerie personnelle ni application grand public.',
    err: 'Photographier un écran d’examen avec son téléphone pour « envoyer vite » : c’est une donnée de santé qui sort du cadre.' }
],

UE41: [
  { fig: 'survie', cle: 'Reconnaître → alerter (15 ou 112) → masser 30/2 à 100–120 par minute sur 5 à 6 cm → défibriller dès que le DAE est là.',
    ex: 'Le seul geste qui fait perdre des chances est l’hésitation : devant une personne inconsciente qui ne respire pas normalement, on masse.',
    err: 'Chercher un pouls avant de commencer : la recherche du pouls n’est plus recommandée pour le secouriste, elle fait perdre du temps.' },

  { img: 'Au cabinet, l’urgence la plus fréquente n’est pas dramatique : c’est le malaise vagal après une instillation, une mesure de pression ou une longue attente.',
    cle: 'Allonger, jambes surélevées, desserrer, aérer, surveiller la conscience — et rester.',
    ex: 'Ce qui doit inquiéter : une perte de connaissance qui se prolonge, une respiration anormale, un déficit neurologique, une douleur thoracique. Là, on alerte.' },

  { img: 'La brûlure chimique est la seule urgence oculaire où l’on ne mesure pas l’acuité : on rince d’abord, on examine ensuite.',
    cle: 'Rinçage immédiat, abondant et prolongé — au moins 15 à 20 minutes — avant tout transfert. Chaque minute perdue compte.',
    err: 'Chercher le produit en cause ou remplir un dossier avant de rincer.' },

  {
    img: 'Savoir où est le défibrillateur compte autant que savoir s’en servir : le jour venu, on n’a pas le temps de le chercher. L’AFGSU de niveau 2 se revérifie tous les quatre ans, comme une lampe de secours.',
    err: 'Tenir l’attestation pour acquise une fois pour toutes. Elle expire — et un protocole d’alerte qu’on n’a jamais lu ne sert à rien le jour où il faut l’appliquer.', cle: 'L’AFGSU de niveau 2 est obligatoire et se renouvelle tous les 4 ans.',
    ex: 'Connaître l’emplacement du DAE et de la trousse d’urgence de sa structure fait partie de l’intégration : c’est à savoir le premier jour, pas le jour de l’urgence.' },

  {
    img: 'Devant une brûlure chimique, c’est le chronomètre qui soigne : quinze minutes de rinçage immédiat valent mieux que le meilleur service atteint plus tard. Devant une plaie perforante, c’est l’inverse — on ne touche à rien.',
    err: 'Rincer un œil perforé, ou retirer un corps étranger fiché. On protège par une coque sans aucune compression et on adresse : toute pression peut vider l’œil.', cle: 'Trois situations font interrompre l’examen : brûlure chimique, traumatisme perforant, baisse d’acuité brutale avec douleur.',
    ex: 'Devant une suspicion de perforation : pas de pression sur le globe, pas de collyre, coque de protection et transfert. On ne rince pas un œil perforé.' },

  {
    img: 'Un malaise vagal se traite par la gravité : allonger, jambes surélevées, desserrer, aérer. Ce qui fait appeler le 15, ce n’est pas le malaise — c’est ce qui ne rentre pas dans l’ordre.',
    err: 'Ne rien noter parce que « ça s’est arrangé ». L’heure, ce qu’on a observé et ce qu’on a fait sont exactement ce qu’on vous demandera si cela se reproduit ailleurs.', cle: 'Un malaise banal se surveille jusqu’à la récupération complète — et se note dans le dossier.',
    ex: 'Le patient qui repart seul juste après un malaise, sans avoir été réévalué, est le scénario dont on se souvient longtemps.' }
],

/* ============================ SEMESTRE 6 ============================ */

UE34: [
  {
    img: 'Libéral et salariat échangent la même monnaie dans les deux sens : autonomie contre charges d’un côté, cadre et volume de l’autre. Le mixte existe précisément parce qu’aucun des deux n’a raison.',
    err: 'Choisir un mode d’exercice sur le seul revenu affiché. En libéral, ce qui reste après charges, cotisations et absence de congés payés n’a rien à voir avec le chiffre d’affaires.', cle: 'Libéral, salarié ou mixte : trois cadres, trois rapports au temps, à l’autonomie et au risque.',
    ex: 'Le libéral choisit ses horaires et porte ses charges ; le salarié échange une part d’autonomie contre une sécurité et un plateau technique. Aucun n’est meilleur : ils ne conviennent pas aux mêmes personnes.' },

  { img: 'La cotation n’est pas de la paperasse : c’est la traduction administrative d’un acte réellement fait, tracé et justifié.',
    cle: 'Le compte rendu conditionne la prise en charge : un acte non tracé est un acte non justifiable.',
    err: 'Coter une série de séances sans compte rendu intermédiaire : c’est le premier point regardé en cas de contrôle.' },

  { img: 'Dans un protocole de coopération, l’orthoptiste mesure et l’ophtalmologiste conclut. La frontière est nette, et c’est elle qui protège les deux.',
    cle: 'Examens préalables (acuité, réfraction, tonométrie, rétinophotographie, OCT) sous la responsabilité du médecin, qui pose le diagnostic et prescrit.',
    ex: 'C’est ce cadre qui a permis de raccourcir les délais d’accès à l’ophtalmologie — et qui a redessiné le métier ces quinze dernières années.' },

  {
    img: 'L’assurance couvre l’argent, pas la personne : la responsabilité pénale ne se délègue ni à un employeur ni à un contrat. C’est la seule qui reste attachée à celui qui a fait le geste.',
    err: 'Croire qu’être salarié met à l’abri. L’employeur répond du civil ; le pénal et le disciplinaire, eux, restent personnels.', cle: 'Responsabilité civile (assurance obligatoire), pénale, disciplinaire — et une obligation de formation continue.',
    ex: 'Une pratique figée sur ses acquis de diplôme devient dangereuse en dix ans : le DPC n’est pas une case à cocher, c’est ce qui maintient la compétence.' },

  { fig: 'decret', img: 'Le décret d’actes est la colonne vertébrale du métier : il dit ce qu’on peut faire, et à quelles conditions.',
    cle: 'Sur prescription médicale pour la rééducation, en autonomie encadrée pour certains dépistages et renouvellements — les conditions comptent autant que la liste.',
    ex: 'Savoir citer ce cadre en entretien d’embauche ou en soutenance montre qu’on connaît son métier, pas seulement ses gestes.' },

  {
    img: 'Un contrat se lit avant de signer, jamais après : les clauses qui posent problème — non-concurrence, rétrocession — ne se voient qu’au moment où l’on veut partir.',
    err: 'Repousser l’assurance en responsabilité civile professionnelle « le temps de démarrer ». Elle est obligatoire, et c’est justement au démarrage qu’on est le plus exposé.', cle: 'S’installer : enregistrement du diplôme et RPPS, statut et structure, conventionnement, assurance en responsabilité civile professionnelle.',
    ex: 'Les démarches prennent des semaines : les anticiper est la différence entre une installation prévue et une installation subie.' }
],

UE35: [
  { cle: 'Rétinopathie diabétique : dépistage annuel, espacement possible à deux ans si le diabète est bien équilibré, sans rétinopathie et sans autre facteur de risque.',
    ex: 'C’est l’un des dépistages où l’orthoptiste est en première ligne : il réalise les clichés et prépare la lecture différée.',
    err: 'Espacer le dépistage chez un diabétique déséquilibré ou hypertendu : les conditions d’espacement sont cumulatives, pas alternatives.' },

  { img: 'Suivre une maladie chronique, c’est comparer : chaque examen ne vaut que par rapport au précédent.',
    cle: 'Glaucome : OCT et champ visuel couplés, rythme selon le stade et la vitesse. DMLA : OCT et autosurveillance par grille d’Amsler, avec consigne écrite.',
    ex: 'La consigne écrite remise au patient DMLA — « si les lignes ondulent ou qu’une tache apparaît, vous appelez » — fait partie du traitement.' },

  {
    img: 'L’adaptation est une porte entrouverte, pas une porte ouverte : elle a un cadre — âge, ancienneté de la prescription, absence de pathologie évolutive — et sortir du cadre, c’est sortir de la couverture.',
    ex: 'On trace ce qu’on a fait, on informe le prescripteur, et devant une anomalie on renvoie au médecin. C’est cette traçabilité qui sépare l’adaptation autorisée de l’exercice illégal.', cle: 'Le renouvellement et l’adaptation par l’orthoptiste sont possibles sous conditions strictes : âge, ancienneté de la prescription, absence de pathologie évolutive, traçabilité.',
    err: 'Renouveler malgré un signe d’alerte parce que « c’est juste des lunettes » : la condition d’absence de pathologie évolutive n’est pas une formalité.' },

  {
    img: 'La prévention n’est pas un supplément de fin de consultation : le sevrage tabagique pèse plus lourd sur une DMLA que bien des traitements, et il ne coûte qu’une phrase dite au bon moment.',
    err: 'Réserver le conseil de prévention aux patients déjà atteints. C’est avant que la protection solaire, l’équilibre glycémique et le sevrage changent quelque chose.', cle: 'Quatre leviers de prévention à connaître : hygiène visuelle sur écran, freination de la myopie, protection UV, sevrage tabagique.',
    ex: 'Le tabac est le principal facteur de risque modifiable de DMLA : le dire au patient fait partie du soin, même si ce n’est pas de l’orthoptie.' },

  { fig: 'alertes',
    img: 'Sept signaux, une seule conduite : l’avis médical, parfois le jour même. Ce ne sont pas des symptômes à interpréter, ce sont des sonnettes — on ne discute pas une sonnette, on ouvre.',
    err: 'Programmer un contrôle « dans trois semaines » devant une diplopie récente ou des métamorphopsies récentes. Le délai fait partie du pronostic.', cle: 'Baisse brutale, déficit campimétrique nouveau, diplopie récente, métamorphopsies, œil rouge douloureux, mydriase avec ptosis, œdème papillaire : on adresse.',
    ex: 'Cette liste est celle qu’on affiche mentalement à chaque consultation : ce ne sont pas des diagnostics à poser, ce sont des portes de sortie.' },

  { img: 'Dans un cabinet à travail aidé, l’orthoptiste ne fait pas que mesurer : il prépare un dossier lisible qui rend la consultation médicale efficace.',
    cle: 'Recueil, mesures, imagerie et présentation ordonnée — c’est le rôle qui structure aujourd’hui une grande partie de l’exercice salarié.',
    ex: 'Un dossier bien préparé fait gagner cinq minutes par patient au médecin : c’est exactement ce qui rend le modèle viable.' }
],

UE36: [
  { img: 'Le bilan pré-opératoire n’est pas un examen de plus : c’est le plan de travail du chirurgien. Chaque chiffre y devient un millimètre.',
    cle: 'Angle stable, mesuré à plusieurs reprises, de loin et de près, dans les neuf positions, avec et sans correction, chaque œil fixateur tour à tour.',
    err: 'Fournir un angle unique mesuré un seul jour : une déviation encore variable ne s’opère pas, et un chiffre isolé ne dit pas si elle l’est.' },

  { fig: 'chirurgie', img: 'Deux familles de gestes seulement : affaiblir (reculer, myectomie, fil de Cüppers) ou renforcer (résection, plissement). Tout le reste est une variante.',
    cle: 'Reculer un muscle, c’est réduire son action ; le raccourcir, c’est l’augmenter. La chirurgie du strabisme est une affaire d’équilibre entre les deux.',
    ex: 'Le fil de Cüppers agit surtout dans le champ d’action du muscle : il réduit la déviation dans le regard latéral en épargnant la position primaire.' },

  {
    img: 'Deux à trois dioptries prismatiques par millimètre : c’est un ordre de grandeur, pas une table. Le chirurgien ajuste selon l’âge, l’angle et son expérience — la chirurgie du strabisme reste une affaire d’équipe et d’habitude.',
    err: 'Réciter un dosage comme une constante. Les chiffres varient selon les équipes et les séries ; ce qui se retient, c’est l’ordre de grandeur et le principe de répartition sur plusieurs muscles.', cle: 'Ordre de grandeur sur les droits horizontaux : environ 2 à 3 Δ par millimètre de recul ou de résection — variable selon les équipes, l’âge et l’angle.',
    ex: 'C’est un ordre de grandeur, pas une table : au-delà d’un certain angle, on opère sur les deux yeux plutôt que de forcer les millimètres sur un seul.' },

  {
    img: 'Une chirurgie du strabisme ne se juge pas sur la photo du lendemain : l’œdème ment, et le résultat ne se stabilise qu’après plusieurs semaines. Ce qu’on voit au réveil n’est pas ce qu’on aura.',
    err: 'Annoncer un résultat définitif au bilan précoce. La réintervention n’est pas exceptionnelle — 10 à 30 % selon les séries — et le dire avant vaut mieux que de l’expliquer après.', cle: 'Suites normales : rougeur et gêne plusieurs semaines, diplopie transitoire fréquente chez l’adulte. Réintervention non exceptionnelle (10 à 30 % selon les séries).',
    ex: 'Prévenir de la diplopie post-opératoire transitoire évite la panique du dixième jour — et un appel en urgence pour une évolution attendue.' },

  { img: 'La chirurgie corrige un angle. Elle ne rend pas une binocularité qui n’a jamais existé, et elle ne remplace pas les lunettes.',
    cle: 'Ce qu’on annonce : bénéfice esthétique, parfois sur le torticolis, parfois sur la diplopie — et la possibilité d’une retouche.',
    err: 'Laisser un patient adulte espérer un relief après quarante ans de neutralisation : c’est la déception assurée, alors que le résultat obtenu est bon.' },

  {
    img: 'Le dossier préopératoire est la photographie de départ : sans angle mesuré plusieurs fois, de loin et de près, motilité cotée et état sensoriel daté, on ne pourra jamais dire ce que l’opération a changé.',
    err: 'Se contenter d’une mesure d’angle unique avant le bloc. Un angle varie ; c’est sa reproductibilité qui fonde le dosage.', cle: 'Avant le bloc : un dossier complet et daté. Après : une réévaluation à distance de l’angle, de la motilité et de l’état sensoriel.',
    ex: 'C’est ce contrôle post-opératoire qui alimente la décision de retouche, et qui documente le résultat réel de l’équipe.' }
],

UE38: [
  { fig: 'pico', img: 'Un sujet trop large est la première cause d’échec : on passe l’année à lire et on n’a rien mesuré.',
    cle: 'Une question PICO à laquelle on peut répondre en un an, avec les moyens dont on dispose, sur une population réellement accessible.',
    err: 'Choisir un sujet parce qu’il est passionnant sans vérifier qu’on aura les patients : le recrutement est ce qui tue les mémoires.' },

  {
    img: 'Une méthode figée avant le recueil est un contrat qu’on signe avec soi-même : elle interdit de choisir après coup le critère qui donne le plus joli résultat.',
    err: 'Définir le critère de jugement principal une fois les données en main. C’est ce qui transforme une étude en illustration d’une opinion — et un jury le repère.', cle: 'Type d’étude, population, critères d’inclusion et d’exclusion, protocole de mesure, critère de jugement principal défini à l’avance, analyse prévue.',
    ex: 'Définir le critère principal avant le recueil est ce qui distingue une étude d’une pêche aux résultats.' },

  { img: 'Les résultats se décrivent, la discussion interprète. Mélanger les deux est l’erreur de rédaction la plus fréquente.',
    cle: 'Tableaux et figures doivent être lisibles seuls ; la discussion reprend le résultat principal, le confronte à la littérature, assume les limites et conclut.',
    err: 'Cacher une limite : un jury la trouvera, et une limite assumée vaut mieux qu’une limite découverte.' },

  {
    img: 'Écrire au fil de l’eau, c’est monter un mur rangée par rangée. L’introduction et la méthode s’écrivent pendant le recueil : sinon février arrive avec un mur entier à monter d’un coup.',
    err: 'Remettre la bibliographie à la rédaction. Elle se tient depuis le premier jour, avec un gestionnaire de références : la reconstituer à la fin coûte des semaines.', cle: 'S5 : sujet, bibliographie, méthode. Début de S6 : recueil. Puis analyse, rédaction, relectures, dépôt.',
    ex: 'Écrire l’introduction et la méthode dès le recueil fait gagner des semaines — et ce sont précisément les parties qui ne dépendent pas des résultats.' },

  {
    ex: 'Dix minutes, trois messages : pourquoi cette question, comment j’y ai répondu, ce que cela change. Le reste est dans le document — la soutenance n’est pas une lecture du mémoire.',
    err: 'Cacher une limite en espérant qu’elle passe. Le jury la verra ; l’assumer et dire ce qu’elle empêche de conclure est un signe de maturité scientifique, pas un aveu de faiblesse.', img: 'Dix minutes, trois messages : pourquoi cette question, comment j’y ai répondu, ce que ça change. Le reste est du décor.',
    cle: 'Assumer une limite plutôt que la cacher : c’est ce que le jury évalue, plus que la beauté du résultat.' },

  {
    img: 'Un rétroplanning se construit à l’envers : on part de la soutenance et on remonte. Ce qui reste à la fin, c’est le temps réellement disponible — souvent la moitié de ce qu’on croyait.',
    err: 'Sous-estimer les autorisations et le recueil. Ce sont les deux seuls postes qui dépendent d’autres personnes, donc les deux seuls qu’on ne rattrape pas en travaillant plus.', cle: 'Un mémoire échoue rarement sur le fond, presque toujours sur le temps.',
    ex: 'Le rétroplanning part de la date de soutenance et remonte : dépôt, relecture, rédaction, analyse, fin du recueil. Chaque étape a une date, sinon aucune n’en a.' }
],

UE39: [
  {
    img: 'Autour d’un patient, chacun tient un fil : l’ophtalmologiste prescrit, l’opticien équipe, l’orthophoniste travaille le langage, l’ergothérapeute adapte. Savoir qui tient quoi évite de tirer sur le fil d’un autre.',
    err: 'Adresser « à un spécialiste » sans nommer lequel ni pourquoi. Une orientation sans destinataire ni question précise se perd, et le patient revient avec le même problème.', cle: 'Ophtalmologiste, opticien, orthophoniste, ergothérapeute, psychomotricien, neuropsychologue, enseignant, médecin scolaire, médecin du travail : chacun attend une information différente.',
    ex: 'Savoir qui fait quoi évite les doublons et les trous : c’est souvent l’orthoptiste, qui voit le patient longtemps, qui repère que personne ne s’occupe d’un aspect.' },

  { img: 'Une bonne transmission tient en trois lignes : ce que j’ai trouvé, ce que ça change pour le patient, ce que j’attends de vous.',
    cle: 'Adaptée au lecteur : le médecin veut une conclusion, l’enseignant veut des aménagements, la famille veut comprendre.',
    err: 'Envoyer un relevé de mesures sans conclusion : le destinataire ne saura pas ce qu’on attend de lui, et n’en fera rien.' },

  {
    img: 'Le secret partagé n’est pas un secret levé : il s’ouvre dans l’équipe de soins, et seulement sur ce qui sert la prise en charge. En dehors, c’est le patient qui ouvre la porte, pas nous.',
    err: 'Répondre directement à une école ou à un employeur parce que la demande paraît légitime. Hors équipe de soins, l’information passe par le patient ou exige son accord explicite.', cle: 'Le secret est partagé au sein de l’équipe de soins, et limité à ce qui est nécessaire à la prise en charge.',
    ex: 'Vers l’école ou l’employeur, l’information passe par le patient ou sa famille — jamais directement, même avec de bonnes intentions.' },

  { img: 'Un relais n’est pas un courrier envoyé : c’est un relais qui a eu lieu. Tant qu’on n’a pas vérifié, on ne sait pas.',
    cle: 'Nommer ce qu’on a observé, dire vers qui on oriente et pourquoi, puis s’assurer que le rendez-vous a bien été pris.',
    ex: 'Un patient adressé mais jamais arrivé est un patient perdu de vue : c’est le contrôle du relais qui l’évite.' },

  { fig: 'parcours',
    img: 'Deux pannes seulement, et toujours les mêmes : la rupture — personne ne reprend la main après un examen — et la redondance — trois professionnels refont le même bilan sans le savoir.',
    err: 'Tenir son acte pour terminé une fois le bilan remis au patient. Sans destinataire identifié ni date, c’est exactement là que le parcours se rompt.', cle: 'Un parcours de soins suppose un référent identifié, des rôles explicites et des points de synchronisation.',
    ex: 'Chez l’enfant, c’est souvent le médecin traitant ou le pédiatre qui tient ce rôle : le désigner clairement évite que chacun croie que l’autre suit le dossier.' },

  { img: 'Un désaccord se règle entre professionnels, sur les données du dossier — jamais devant le patient, qui perdrait confiance dans les deux.',
    cle: 'Devant une suspicion de maltraitance ou de danger, on ne tranche pas seul : on transmet au médecin et on suit la procédure de sa structure.',
    err: 'Critiquer devant la famille la prise en charge d’un confrère : on croit défendre le patient, on le laisse sans repère.' }
],

UE40: [
  { img: 'Un stage se construit comme une rééducation : objectifs négociés au départ, progression, et reprise régulière. Sans objectifs, le stagiaire regarde travailler.',
    cle: 'Observation → participation → autonomie supervisée. On évalue une compétence en situation, pas une récitation.',
    ex: 'Les objectifs posés le premier jour sont ce qui permet, à la fin, de dire précisément ce qui est acquis — et ce qui ne l’est pas.' },

  { fig: 'evaluation', img: 'La formative accompagne, la sommative sanctionne. Les confondre transforme chaque remarque en verdict, et le stagiaire cesse d’apprendre.',
    cle: 'Un retour formatif est descriptif, immédiat et centré sur l’action — pas sur la personne.',
    err: 'Dire « tu n’es pas à l’aise avec les enfants » plutôt que « tu as commencé par le cover test avant d’avoir mis l’enfant en confiance ».' },

  {
    img: 'L’analyse de pratique décrit, elle ne juge pas : ce qui a été fait, ce qui a été ressenti, ce qu’on ferait autrement. C’est un débriefing, pas un tribunal — et c’est pour cela qu’elle protège de l’épuisement.',
    err: 'La transformer en recherche de faute. Dès qu’un groupe cherche un coupable, plus personne n’apporte de situation difficile — et l’outil meurt.', cle: 'Analyse de pratique : décrire la situation, ce qui a été fait, ce qui a été ressenti, ce qui pourrait être fait autrement — sans jugement de valeur.',
    ex: 'C’est un des meilleurs outils de progression, et l’un des rares qui fonctionne aussi bien sur les professionnels expérimentés que sur les étudiants.' },

  {
    img: 'Une pratique qui ne se met pas à jour ne stagne pas : elle recule, parce que les recommandations bougent autour d’elle. Le DPC triennal est le minimum, pas l’objectif.',
    err: 'Compter les congrès comme une formation. Ce qui compte est ce qu’on change dans sa pratique après — le reste est du temps passé assis.', cle: 'Le DPC est obligatoire et triennal : congrès, lecture, formations spécialisées.',
    ex: 'Basse vision, neurovision, pédiatrie : les domaines où la pratique évolue le plus vite sont ceux où l’on se forme, ou l’on décroche.' },

  { img: 'Un objectif utilisable se reconnaît à ce qu’on peut cocher : un comportement observable, un contexte, un critère de réussite.',
    cle: '« Réaliser seul un cover test alterné chiffré aux prismes sur trois patients adultes » est un objectif. « Progresser en strabologie » n’en est pas un.',
    ex: 'Écrire deux ou trois objectifs de ce type par période transforme un stage flou en apprentissage mesurable.' },

  { img: 'Le pire service à rendre à un stagiaire en difficulté est d’attendre la fin du stage pour le lui dire.',
    cle: 'Nommer tôt et précisément le manque constaté, le tracer, proposer un plan avec des échéances — et prévenir l’école.',
    err: 'Valider par gentillesse un stage insuffisant : on protège une personne pendant six semaines et on la met en difficulté pour des années.' }
]

};
