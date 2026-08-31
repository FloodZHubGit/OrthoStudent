/* ============================================================
   Cas d'application supplémentaires — années 1 (S1, S2)
   ------------------------------------------------------------
   uedeep.js porte un cas par UE. Ce fichier en ajoute deux
   autres, de nature différente, pour que la même notion soit
   vue sous plusieurs angles :

     t   : le titre du cas, tel qu'un énoncé le nommerait
     tag : la nature du cas — clinique, calcul, oral, décision,
           urgence, méthode. Elle dit ce qu'on attend de vous.
     s   : l'énoncé, avec juste ce qu'il faut de contexte
     q   : les questions posées, dans l'ordre
     r   : le raisonnement attendu — le chemin, pas la réponse
     c   : la conclusion, telle qu'on la formulerait à l'oral

   Semestres 3 à 6 dans uecas2.js.
   ============================================================ */
window.UE_CAS = {

/* ============================ SEMESTRE 1 ============================ */

UE1: [
  { t: 'Une leucocorie sur une photo de famille',
    tag: 'urgence',
    s: 'Des parents apportent une photo de leur fille de 14 mois : la pupille gauche apparaît blanche au flash, la droite est rouge. L’enfant va bien par ailleurs et fixe des deux yeux.',
    q: ['Que doit évoquer une leucocorie chez un nourrisson ?',
        'Quel est le degré d’urgence, et pourquoi ?',
        'Quelle est la part génétique de cette pathologie ?'],
    r: 'Une leucocorie est un <b>rétinoblastome jusqu’à preuve du contraire</b> : c’est la tumeur intraoculaire maligne la plus fréquente de l’enfant. Les autres causes (cataracte congénitale, maladie de Coats, persistance du vitré primitif, colobome) ne se discutent qu’après avoir éliminé la tumeur, par un fond d’œil sous anesthésie générale. Le pronostic est <b>vital</b> avant d’être visuel : le retard diagnostique se compte en semaines, pas en mois. Le gène en cause est <b>RB1</b>, suppresseur de tumeur : les formes héréditaires suivent une transmission autosomique dominante à forte pénétrance, sont volontiers <b>bilatérales et précoces</b>, et exposent à d’autres cancers secondaires ; les formes sporadiques sont unilatérales et plus tardives.',
    c: 'Adressage en urgence à l’ophtalmologiste, avec la photo : elle est un élément diagnostique. Une forme bilatérale impose un conseil génétique familial et le dépistage de la fratrie.' },

  { t: 'Une cornée trouble au lendemain d’une cataracte',
    tag: 'clinique',
    s: 'Une patiente de 78 ans, opérée de la cataracte la veille, se plaint d’un brouillard important le matin qui s’améliore un peu dans la journée. La cornée est dépolie, l’acuité à 2/10.',
    q: ['Quelle structure cornéenne est en cause ?',
        'Pourquoi le brouillard est-il maximal au réveil ?',
        'Pourquoi cette structure ne récupère-t-elle pas ?'],
    r: 'La transparence cornéenne tient à un stroma <b>déshydraté</b> : ce sont les pompes de l’<b>endothélium</b> (Na⁺/K⁺ ATPase) qui évacuent en permanence l’eau attirée par les protéoglycanes. Toute perte de cellules endothéliales — usure liée à l’âge, cornea guttata, traumatisme chirurgical — fait basculer l’équilibre vers l’œdème. La nuit, paupières fermées, l’évaporation qui aidait à déshydrater la cornée s’arrête : l’œdème est maximal au réveil et s’améliore ensuite. L’endothélium ne se divise plus après la naissance : sa densité (≈ 3 000 cell/mm² à 20 ans) ne fait que décroître, les cellules restantes s’étalent pour couvrir la surface. En dessous d’environ 500 cell/mm², la décompensation est irréversible.',
    c: 'Œdème cornéen par souffrance endothéliale post-opératoire. Surveillance de la densité endothéliale ; en cas de décompensation, seule une greffe endothéliale rendra la transparence.' }
],

UE2: [
  { t: 'Du verre de lunettes à la lentille de contact',
    tag: 'calcul',
    s: 'Un patient myope porte des lunettes de −8,00 D, à 12 mm de la cornée. Il souhaite passer aux lentilles de contact.',
    q: ['Quelle puissance faut-il en lentille ?',
        'Le patient verra-t-il les objets plus grands ou plus petits qu’avant ?',
        'À partir de quelle puissance cette correction devient-elle indispensable ?'],
    r: 'La puissance efficace dépend de la position du verre : P’ = P / (1 − d × P), avec d en mètres. Ici d = 0,012 m et P = −8,00 : 1 − (0,012 × −8) = 1 + 0,096 = 1,096, donc P’ = −8 / 1,096 ≈ <b>−7,30 D</b>. On retient le sens : <b>rapprocher un verre négatif de l’œil oblige à en mettre moins</b> (et rapprocher un verre positif oblige à en mettre plus). Le verre divergent de lunettes minifiait l’image ; en lentille, cette minification disparaît : le myope fort trouve les objets <b>plus grands</b> et le champ de vision élargi, sans anneau de scotome périphérique.',
    c: '−7,25 ou −7,50 D selon la boîte d’essai, à contrôler sur l’œil. La correction de distance de sommet devient significative au-delà de ± 4 D environ, où l’écart dépasse 0,25 D.' },

  { t: 'Un prisme prescrit, deux façons de le porter',
    tag: 'calcul',
    s: 'Un patient présente une diplopie verticale nécessitant 6 Δ. Il porte déjà une correction de +4,00 D sur chaque œil.',
    q: ['Comment répartir ce prisme entre les deux yeux ?',
        'Peut-on l’obtenir sans prisme incorporé ?',
        'Vers où l’image est-elle déplacée par un prisme ?'],
    r: 'Un prisme se répartit volontiers <b>moitié-moitié</b> — 3 Δ base supérieure devant un œil, 3 Δ base inférieure devant l’autre — afin de limiter l’épaisseur, le poids et les aberrations chromatiques de chaque verre. La loi de <b>Prentice</b> permet d’obtenir l’effet sans prisme taillé : Δ = P × d(cm). Avec P = 4,00 D, il faut d = 6 / 4 = 1,5 cm de décentrement, ce qui est ici irréaliste sur une monture ; mais un décentrement de 5 mm donnerait déjà 2 Δ. Un prisme dévie le <b>rayon vers sa base</b> et donc l’<b>image vers son arête</b> : c’est l’arête qu’on oriente vers la déviation à compenser.',
    c: '3 Δ base supérieure OD + 3 Δ base inférieure OG. Au-delà de 8 à 10 Δ, on privilégie les prismes souples de Fresnel, moins lourds mais qui dégradent l’acuité.' }
],

UE3: [
  { t: 'Une myope de 48 ans qui retire ses lunettes pour lire',
    tag: 'clinique',
    s: 'Une patiente myope de −2,50 D aux deux yeux, 48 ans, lit sans ses lunettes en tenant le texte à 40 cm. Elle demande des progressifs parce que ce geste l’agace.',
    q: ['Pourquoi lit-elle mieux sans correction ?',
        'Quelle addition théorique lui faut-il ?',
        'Quelle est sa réfraction finale en vision de près ?'],
    r: 'Le myope non corrigé a son <b>punctum remotum</b> à 1 / 2,50 = 40 cm : sans lunettes, le texte tenu à 40 cm est net <b>sans aucun effort accommodatif</b>. Retirer ses verres est donc une addition naturelle de +2,50. À 48 ans, l’amplitude accommodative résiduelle est d’environ 4 D (Hofstetter : 15 − 0,25 × âge ≈ 3 D minimum, 18,5 − 0,3 × âge ≈ 4 D moyenne). Pour lire à 40 cm il faut 2,50 D de vergence ; on n’utilise que la moitié de l’amplitude disponible, soit un besoin d’addition d’environ +1,00 D à cet âge. En vision de près : −2,50 + 1,00 = <b>−1,50 D</b>.',
    c: 'Progressifs de −2,50 loin et −1,50 près, en la prévenant que retirer ses lunettes restera plus confortable pour la lecture prolongée — l’addition n’est pas une obligation, c’est un confort.' },

  { t: 'Un astigmate qui « voit double d’un seul œil »',
    tag: 'clinique',
    s: 'Un étudiant de 22 ans décrit un dédoublement des lettres qui persiste œil gauche caché comme œil droit caché. Skiascopie : −1,00 (−2,00 à 175°) OD.',
    q: ['Une diplopie monoculaire oriente-t-elle vers un problème binoculaire ?',
        'Transposez cette réfraction en cylindre positif.',
        'Que vérifiez-vous avant de conclure ?'],
    r: 'Une diplopie <b>monoculaire</b> n’est jamais d’origine binoculaire : elle est optique, donc dioptrique. Elle relève d’un astigmatisme non corrigé, d’une opacité (cataracte débutante), d’une irrégularité cornéenne (kératocône) ou d’une décentration de correction. Transposition : nouvelle sphère = −1,00 + (−2,00) = −3,00 ; le cylindre change de signe : +2,00 ; l’axe tourne de 90° : 175 − 90 = 85. Soit <b>−3,00 (+2,00 à 85°)</b>. Un astigmatisme fort et oblique chez un sujet jeune, surtout s’il évolue vite ou s’accompagne d’un reflet skiascopique « en ciseaux », impose d’éliminer un kératocône par une topographie cornéenne.',
    c: 'Diplopie monoculaire par astigmatisme non corrigé. Correction complète, contrôle de l’acuité obtenue, et topographie si l’astigmatisme progresse d’un contrôle à l’autre.' }
],

UE4: [
  { t: 'Un adolescent qui ne voit plus rien au cinéma',
    tag: 'clinique',
    s: 'Un garçon de 16 ans se cogne dans les salles sombres et met « très longtemps » à s’habituer. Son acuité diurne est de 10/10 aux deux yeux et son champ visuel central est normal.',
    q: ['Quel système photorécepteur est en cause ?',
        'Comment se déroule normalement l’adaptation à l’obscurité ?',
        'Quels examens confirment l’atteinte ?'],
    r: 'La vision en faible luminance est assurée par les <b>bâtonnets</b> (≈ 120 millions, absents de la fovéola, sensibles vers 500 nm, non discriminants pour la couleur). L’adaptation à l’obscurité se fait en deux temps : la branche des cônes en 5 à 7 minutes, puis, après la <b>cassure photopique-scotopique</b> (rupture de Kohlrausch), la branche des bâtonnets qui gagne encore 3 log d’unités et se termine vers 30 minutes, le temps de régénérer la rhodopsine. Une héméralopie isolée avec acuité centrale conservée signe une atteinte des bâtonnets — au premier rang la <b>rétinopathie pigmentaire</b>, où le champ visuel se rétrécit en anneau avant d’être tubulaire.',
    c: 'Héméralopie par dysfonction des bâtonnets. Champ visuel périphérique (Goldmann), ERG scotopique et fond d’œil à la recherche d’ostéoblastes ; le déficit central viendra bien plus tard.' },

  { t: 'Un champ visuel qui s’arrête net sur la verticale',
    tag: 'oral',
    s: 'Une périmétrie automatique montre un déficit temporal des deux côtés, respectant exactement le méridien vertical.',
    q: ['Où se situe la lésion ?',
        'Pourquoi ce respect du méridien vertical ?',
        'Quel signe clinique associé cherchez-vous ?'],
    r: 'Un déficit qui respecte le <b>méridien vertical</b> est post-rétinien : la rétine ignore cette frontière, seules les voies optiques la connaissent, à partir du chiasma. Une <b>hémianopsie bitemporale</b> traduit l’atteinte des fibres nasales des deux rétines, qui décussent au chiasma — donc une compression chiasmatique médiane, adénome hypophysaire en tête, craniopharyngiome ou méningiome du tubercule sellaire. On oppose ce respect du méridien vertical au respect du méridien <b>horizontal</b>, qui signe au contraire une atteinte du nerf optique ou de la rétine (glaucome, NOIA). Plus la lésion est postérieure, plus l’hémianopsie est <b>congruente</b> — une bitemporale, elle, est par construction non congruente.',
    c: 'Hémianopsie bitemporale d’origine chiasmatique : IRM hypophysaire sans délai. On recherche une dyschromatopsie d’axe rouge-vert, une baisse d’acuité et une pâleur papillaire en « nœud papillon ».' }
],

UE5: [
  { t: 'Mesurer l’acuité d’un enfant de 3 ans',
    tag: 'clinique',
    s: 'Une petite fille de 3 ans est adressée pour suspicion de strabisme intermittent. Elle parle peu et se lasse vite.',
    q: ['Quels optotypes proposez-vous à cet âge ?',
        'Comment vous assurez-vous d’une mesure fiable ?',
        'Que faites-vous si l’œil gauche est nettement moins bon ?'],
    r: 'À 3 ans on n’utilise ni Monoyer ni Landolt : on passe par la <b>dénomination ou l’appariement d’images</b> (Rossano-Weiss, Pigassou), avec un carton de désignation posé sur les genoux de l’enfant pour éviter la parole. Une mesure fiable suppose une <b>occlusion réelle</b> et non compressive — un pansement adhésif vaut mieux qu’une main —, un ordre constant (OD, OG, puis les deux), des optotypes changés entre les deux yeux pour éviter la mémorisation, et des <b>lignes entières</b> plutôt que des optotypes isolés : le <b>crowding</b> majore l’écart chez l’amblyope et c’est précisément ce qu’on cherche à voir. Une différence de deux lignes ou plus entre les deux yeux définit l’amblyopie et impose la cycloplégie.',
    c: 'Acuité par images en lignes, occlusion collée, résultat noté avec le test utilisé et la distance. Différence interoculaire ≥ 2 lignes : réfraction sous cycloplégique et avis ophtalmologique.' },

  { t: 'Le trou sténopéique qui tranche',
    tag: 'décision',
    s: 'Un homme de 62 ans a 4/10 à l’œil droit avec sa correction habituelle. Au trou sténopéique, il lit 8/10.',
    q: ['Que signifie cette amélioration ?',
        'Qu’auriez-vous conclu sans amélioration ?',
        'Quelle est la limite de ce test ?'],
    r: 'Le trou sténopéique ne laisse passer qu’un fin pinceau de rayons paraxiaux : il supprime l’essentiel du flou dioptrique sans rien changer à la rétine ni au nerf optique. Une acuité qui <b>remonte</b> signe donc une cause <b>réfractive</b> — correction inadaptée, astigmatisme non corrigé, cataracte débutante — et invite d’abord à refaire la réfraction. Une acuité qui <b>ne bouge pas</b> oriente vers une cause organique : maculopathie, neuropathie optique, amblyopie ancienne. La limite tient à la luminance : le sténopé réduit fortement la lumière reçue, ce qui peut faire chuter l’acuité d’un patient à média troubles ou en éclairage insuffisant, et donne des faux négatifs.',
    c: 'Baisse d’acuité d’origine réfractive : on refait la réfraction avant tout autre examen. Le sténopé est un test de débrouillage, jamais une preuve à lui seul.' }
],

UE7: [
  { t: 'Où le chirurgien coupe-t-il ?',
    tag: 'oral',
    s: 'Vous assistez à un recul du droit médial gauche pour ésotropie. Le chirurgien mesure une distance au limbe avant de désinsérer le muscle.',
    q: ['Quelles sont les insertions des quatre droits par rapport au limbe ?',
        'Que change un recul par rapport à une résection ?',
        'Quelle structure faut-il ménager en opérant l’oblique inférieur ?'],
    r: 'La <b>spirale de Tillaux</b> donne les distances des insertions au limbe : droit médial 5,5 mm, droit inférieur 6,5 mm, droit latéral 6,9 mm, droit supérieur 7,7 mm — le muscle le plus proche du limbe est aussi le plus puissant en adduction. Un <b>recul</b> déplace l’insertion en arrière et <b>affaiblit</b> le muscle ; une <b>résection</b> raccourcit le muscle et le <b>renforce</b>. Une ésotropie se corrige donc par recul du droit médial, éventuellement associé à une résection du droit latéral homolatéral. L’oblique inférieur naît en avant et en dedans de l’orbite, passe sous le droit inférieur et s’insère en arrière : il est en rapport étroit avec la <b>macula</b> et surtout avec les <b>vaisseaux vortiqueux</b> et le nerf ciliaire, qu’il faut respecter.',
    c: 'Recul du droit médial gauche, en repartant de son insertion à 5,5 mm du limbe. Le sens de l’effet ne s’apprend pas par cœur : reculer éloigne le muscle de son action, réséquer le rapproche.' },

  { t: 'Une paupière tombante et une pupille dilatée',
    tag: 'urgence',
    s: 'Un homme de 55 ans présente depuis le matin un ptosis droit, un œil dévié en dehors et en bas, une pupille droite dilatée peu réactive, et des céphalées.',
    q: ['Quel nerf est atteint et quels muscles sont paralysés ?',
        'Que signifie l’atteinte pupillaire ?',
        'Quelle est la conduite immédiate ?'],
    r: 'L’association ptosis + œil en <b>abduction et abaissement</b> signe une paralysie du <b>III</b> : il innerve le droit supérieur, le droit médial, le droit inférieur, l’oblique inférieur, le releveur de la paupière et, par son contingent parasympathique, le sphincter irien et le muscle ciliaire. Ne restent actifs que le droit latéral (VI) et l’oblique supérieur (IV) — d’où la position. Les fibres pupillomotrices cheminent en <b>périphérie</b> du tronc nerveux : elles sont épargnées par l’ischémie (III diabétique, typiquement douloureux mais à pupille intacte) et touchées les premières par une <b>compression</b>. Une mydriase aréactive dans ce contexte fait donc craindre un <b>anévrisme de la communicante postérieure</b>, dont la rupture est mortelle.',
    c: 'Paralysie du III <b>extrinsèque et intrinsèque</b> : urgence neurochirurgicale, imagerie vasculaire immédiate. Le bilan orthoptique attendra ; ici c’est l’orientation qui sauve.' }
],

UE8: [
  { t: 'Deux doigts au lieu d’un, et c’est normal',
    tag: 'oral',
    s: 'Vous demandez à un patient de fixer votre doigt à 40 cm en gardant conscience de votre stylo tenu à 1 m derrière. Il déclare voir deux stylos.',
    q: ['Comment s’appelle ce phénomène et pourquoi survient-il ?',
        'Qu’est-ce que l’aire de Panum ?',
        'Que prouve la présence de ce phénomène ?'],
    r: 'C’est la <b>diplopie physiologique</b> : le stylo, situé en dehors de l’horoptère, stimule des points rétiniens <b>non correspondants</b> trop éloignés pour être fusionnés, donc perçus double. L’<b>horoptère</b> est le lieu des points vus simples ; autour de lui, l’<b>aire de Panum</b> est la zone de tolérance dans laquelle deux images légèrement disparates sont encore fusionnées — et cette légère disparité est justement ce qui fonde la <b>stéréoscopie</b>. Elle est étroite au centre (quelques minutes d’arc) et s’élargit en périphérie. Percevoir la diplopie physiologique prouve que le patient <b>ne neutralise pas</b> : c’est un argument de vision binoculaire normale, et un outil précieux en rééducation pour faire prendre conscience de l’espace.',
    c: 'Diplopie physiologique, signe de bonne binocularité. Son absence chez un strabique traduit une neutralisation ; sa (re)découverte est souvent le premier objectif d’une rééducation.' },

  { t: 'Un enfant qui louche seulement en lisant',
    tag: 'calcul',
    s: 'Un enfant de 7 ans, hypermétrope +3,00 D corrigé, présente une orthophorie de loin et une ésophorie-tropie de 18 Δ de près. Avec une addition de +3,00, la déviation de près tombe à 6 Δ.',
    q: ['Que calcule-t-on ici, et comment ?',
        'Comment interprétez-vous le résultat ?',
        'Quelle prise en charge en découle ?'],
    r: 'On mesure le rapport <b>AC/A par gradient</b> : variation de la déviation divisée par la variation de la stimulation accommodative, ici (18 − 6) / 3 = <b>4 Δ/D</b> ; la norme se situe autour de 3 à 5 Δ/D. Mais l’élément clinique décisif n’est pas ce chiffre isolé : c’est l’<b>écart loin-près</b>. Une déviation nulle de loin et de 18 Δ de près, effondrée par une addition, définit une <b>ésotropie accommodative à excès de convergence</b>. L’excès porte sur la composante non réfractive de l’accommodation : la correction optique totale ne suffira pas, puisque le patient est déjà corrigé de loin.',
    c: 'Ésotropie accommodative de près par excès de convergence. Correction optique totale sous cycloplégie, puis <b>double foyer</b> ou progressif enfant ; la chirurgie ne se discute que sur la part non accommodative résiduelle.' }
],

UE9: [
  { t: 'Un strabique qui ne voit jamais double',
    tag: 'oral',
    s: 'Un adulte porteur d’une ésotropie depuis l’âge de 2 ans dévie de 25 Δ. Il n’a jamais eu de diplopie. Au verre rouge, il ne perçoit qu’une seule lumière.',
    q: ['Quels mécanismes expliquent l’absence de diplopie ?',
        'Comment les distinguer au bilan ?',
        'Quelle conséquence pour un projet chirurgical ?'],
    r: 'Deux adaptations sensorielles protègent du chaos visuel d’un strabisme <b>précoce</b> : la <b>neutralisation</b>, suppression active de l’image de l’œil dévié dans un scotome de neutralisation, et la <b>correspondance rétinienne anormale</b> (CRA), où la fovéa de l’œil fixateur devient fonctionnellement correspondante d’un point rétinien excentré de l’œil dévié. Le verre rouge et le Bagolini explorent la première ; l’écart entre l’angle objectif (cover test au prisme) et l’angle subjectif (verre rouge, Lancaster) mesure la seconde : angle objectif ≠ angle subjectif = CRA, angle d’anomalie = différence des deux. Le Bagolini, très peu dissociant, met en évidence une CRA harmonieuse que le Lancaster, dissociant, tend à décomposer.',
    c: 'Neutralisation et probable CRA harmonieuse. Il faut prévenir le patient qu’une chirurgie change l’angle mais pas la correspondance : une <b>diplopie post-opératoire</b> est possible, à tester au préalable par des prismes de la valeur de la correction envisagée.' },

  { t: 'Une diplopie verticale qui s’aggrave en descendant l’escalier',
    tag: 'clinique',
    s: 'Une femme de 45 ans décrit depuis trois semaines une image dédoublée verticalement, gênante à la lecture et dans les escaliers. Elle incline la tête vers l’épaule gauche.',
    q: ['Quel muscle suspectez-vous ?',
        'Quelle manœuvre confirme le diagnostic ?',
        'Comment reconnaît-on une paralysie ancienne ?'],
    r: 'Diplopie verticale + gêne au regard en bas + <b>torticolis</b> orientent vers une paralysie de l’<b>oblique supérieur droit</b> (IV) : le muscle abaisse l’œil en adduction et l’intorque, sa paralysie donne une hypertropie qui augmente dans le regard en bas et en dedans. Les <b>trois pas de Parks-Bielschowsky</b> tranchent : 1) quel œil est le plus haut ? 2) l’hypertropie augmente-t-elle en regard droit ou gauche ? 3) augmente-t-elle en inclinaison de la tête à droite ou à gauche — le <b>signe de Bielschowsky</b> positif du côté atteint. Une paralysie <b>ancienne</b> se reconnaît à la comitance progressive de la déviation, à l’absence de diplopie subjective, à l’augmentation des amplitudes de fusion verticale (au-delà de 3 à 4 Δ, c’est une décompensation ancienne) et aux photographies anciennes montrant déjà le torticolis.',
    c: 'Paralysie du IV droit. Photographies anciennes et amplitudes verticales à rechercher : elles distinguent la décompensation d’un IV congénital, banale, d’une atteinte récente qui impose une imagerie.' }
],

UE12: [
  { t: 'Le père veut le compte rendu',
    tag: 'décision',
    s: 'Vous avez réalisé le bilan orthoptique d’un enfant de 8 ans, amené par sa mère. Le père, séparé, vous appelle et demande que le compte rendu lui soit envoyé.',
    q: ['Le secret professionnel s’oppose-t-il à cette demande ?',
        'Que vérifiez-vous avant de répondre ?',
        'Quelle attitude adoptez-vous au téléphone ?'],
    r: 'Le secret professionnel protège le patient, ici l’enfant, mais il n’est pas opposable aux <b>titulaires de l’autorité parentale</b>, qui l’exercent le plus souvent conjointement, y compris après séparation. Un père séparé reste donc en droit d’être informé de l’état de santé de son enfant, sauf décision de justice le lui retirant. Ce qu’on ne peut pas faire, c’est vérifier une identité au téléphone : on ne délivre aucune information par ce canal. On répond donc sur la règle, pas sur le contenu, et on invite à une demande écrite avec justificatif d’identité et de filiation, ou à une consultation. Enfin, un compte rendu s’adresse au prescripteur ; les parents en reçoivent copie, pas des commentaires sur l’autre parent.',
    c: 'Demande légitime, mais aucune information par téléphone. Envoi du compte rendu sur demande écrite justifiée, contenu strictement clinique, sans prendre part au conflit parental.' },

  { t: 'Une patiente qui veut « juste refaire ses lunettes »',
    tag: 'décision',
    s: 'Une femme de 40 ans, sans ordonnance, vous demande de renouveler la correction de ses lunettes. Sa dernière consultation ophtalmologique remonte à six ans.',
    q: ['L’orthoptiste peut-il réaliser cet acte ?',
        'À quelles conditions et dans quelles limites ?',
        'Que faites-vous concrètement ?'],
    r: 'L’orthoptiste exerce sur <b>prescription médicale</b>, sauf dans les cas expressément prévus par les textes régissant la profession — bilan visuel et adaptation de correction dans un cadre défini, protocoles organisés de coopération, exercice en structure avec ophtalmologiste. Le renouvellement de correction obéit à des conditions strictes : âge du patient, ancienneté de l’ordonnance, absence de pathologie connue, et traçabilité. Six ans sans examen médical chez une patiente de 40 ans, c’est précisément le cas où l’on ne se substitue pas : une baisse d’acuité peut révéler un glaucome débutant, une pathologie maculaire ou une pathologie générale, qu’une simple réfraction ne dépistera pas.',
    c: 'Réfraction possible dans le cadre prévu, mais dossier trop ancien : on réalise le bilan et on <b>oriente vers une consultation ophtalmologique</b>. Le champ de compétence protège le patient autant que le professionnel.' }
],

UE16: [
  { t: 'Un œil rouge à 22 heures',
    tag: 'urgence',
    s: 'Un homme de 65 ans consulte pour un œil droit rouge et très douloureux depuis trois heures, avec vision de halos colorés, nausées et acuité effondrée à 1/10. La pupille est en semi-mydriase aréactive.',
    q: ['Quel diagnostic domine ?',
        'Quels éléments l’opposent à une conjonctivite ?',
        'Quelle est la conduite à tenir ?'],
    r: 'Douleur intense, halos, baisse d’acuité, semi-mydriase aréactive, nausées : c’est une <b>crise aiguë de fermeture de l’angle</b> jusqu’à preuve du contraire. La pression intraoculaire dépasse souvent 50 mmHg, l’œil est dur à la palpation bidigitale, la cornée œdémateuse. Tout l’oppose à une conjonctivite : celle-ci ne donne <b>ni douleur profonde, ni baisse d’acuité, ni anomalie pupillaire</b> — elle démange, colle et reste blanche au niveau limbique, alors qu’ici la rougeur prédomine en <b>cercle périkératique</b>. Les autres causes d’œil rouge douloureux avec baisse d’acuité (kératite, uvéite antérieure) se distinguent par la fluorescéine et l’état pupillaire — myosis dans l’uvéite.',
    c: 'Crise aiguë de fermeture de l’angle : urgence absolue, adressage immédiat, sans jamais instiller de mydriatique. Tout retard se paie en champ visuel définitivement perdu.' },

  { t: 'Un diabétique qui voit encore 10/10',
    tag: 'décision',
    s: 'Un patient de 52 ans, diabétique de type 2 depuis 11 ans, HbA1c à 8,6 %, consulte pour des lunettes. Il vous dit ne pas avoir fait de fond d’œil depuis quatre ans « puisqu’il voit très bien ».',
    q: ['Une acuité normale exclut-elle une rétinopathie ?',
        'À quel rythme le dépistage doit-il être fait ?',
        'Quel message d’éducation délivrez-vous ?'],
    r: 'Non : la <b>rétinopathie diabétique</b> évolue longtemps sans aucun symptôme. L’acuité ne chute qu’en cas d’<b>œdème maculaire</b> ou d’une complication de la forme proliférante (hémorragie du vitré, décollement tractionnel) — c’est-à-dire tard, quand le traitement est plus lourd et le pronostic moins bon. Le dépistage repose sur des photographies du fond d’œil ou un examen ophtalmologique, <b>annuel</b> en règle générale, espacé à deux ans seulement chez un patient bien équilibré sans rétinopathie, et rapproché en cas de grossesse, d’équilibration rapide de la glycémie, de puberté ou d’HTA associée. Ici, l’HbA1c à 8,6 % et l’ancienneté du diabète classent le patient à risque.',
    c: 'Rétinopathie possible malgré 10/10 : rétinographies sans attendre. On explique que la vision n’est pas un indicateur de gravité, et que l’équilibre glycémique et tensionnel reste le premier traitement.' }
],

/* ============================ SEMESTRE 2 ============================ */

UE10: [
  { t: 'Une pression qui trompe',
    tag: 'calcul',
    s: 'Deux patients ont une pression intraoculaire mesurée à 22 mmHg par aplanation. Le premier a une pachymétrie centrale à 620 µm, le second à 490 µm.',
    q: ['Pourquoi l’épaisseur cornéenne change-t-elle la mesure ?',
        'Comment interprétez-vous chacune de ces deux pressions ?',
        'Que change ce raisonnement pour le suivi ?'],
    r: 'La tonométrie à aplanation de Goldmann est étalonnée pour une épaisseur cornéenne centrale d’environ <b>520 à 545 µm</b>. Une cornée <b>épaisse</b> résiste davantage à l’aplanation : la pression lue est <b>surestimée</b>. Une cornée <b>fine</b> s’aplanit trop facilement : la pression lue est <b>sous-estimée</b>. L’ordre de grandeur retenu est d’environ 0,5 à 1 mmHg pour 25 µm d’écart, mais aucune formule de correction n’est validée pour un usage individuel : on ne « corrige » pas la valeur, on l’<b>interprète</b>. Le premier patient, à 620 µm, a probablement une pression réelle plus basse que 22 : son hypertonie apparente peut n’être qu’un artefact. Le second, à 490 µm, a une pression réelle vraisemblablement plus haute — et surtout, la <b>cornée fine est un facteur de risque indépendant</b> de conversion en glaucome, démontré par l’étude OHTS.',
    c: 'Même chiffre, deux situations opposées : rassurante chez le premier, préoccupante chez le second. La pachymétrie s’intègre au risque global, elle ne sert pas à recalculer un chiffre.' },

  { t: 'Une baisse d’acuité inexpliquée',
    tag: 'décision',
    s: 'Une patiente de 34 ans a 5/10 à l’œil droit. Réfraction sans effet, fond d’œil décrit comme normal, pression intraoculaire normale.',
    q: ['Quels examens fonctionnels demandez-vous, et pour explorer quoi ?',
        'Qu’apporte l’OCT que le fond d’œil ne donne pas ?',
        'Quel signe clinique simple oriente vers le nerf optique ?'],
    r: 'On raisonne par étage. Pour la <b>macula</b>, l’<b>OCT</b> : il coupe la rétine en histologie virtuelle et révèle ce qu’un fond d’œil normal ne montre pas — membrane épirétinienne, trou lamellaire, œdème, atrophie des couches externes. Pour la <b>rétine dans son ensemble</b>, l’<b>ERG</b> ; pour la macula seule, l’ERG multifocal. Pour le <b>nerf optique et les voies</b>, les <b>PEV</b>, dont l’allongement de latence signe la démyélinisation. Le champ visuel complète en topographiant le déficit. Cliniquement, le signe le plus rentable est le <b>déficit pupillaire afférent relatif</b> (Marcus Gunn) au test de l’éclairement alterné : présent, il affirme une atteinte du nerf optique ou une atteinte rétinienne étendue, et disparaît dans les baisses d’acuité d’origine maculaire limitée.',
    c: 'OCT maculaire en première intention, PEV et champ visuel si le déficit pupillaire afférent relatif est présent. La séquence des examens se décide sur la clinique, jamais l’inverse.' }
],

UE11: [
  { t: 'Un enfant de 6 ans qui a mal à la tête en fin de journée',
    tag: 'méthode',
    s: 'Un garçon de 6 ans est adressé pour céphalées vespérales et gêne à la lecture. Il n’a jamais eu de correction optique.',
    q: ['Dans quel ordre menez-vous le bilan ?',
        'Pourquoi cet ordre ?',
        'Que ne faites-vous pas avant la cycloplégie ?'],
    r: 'L’ordre d’un bilan n’est pas décoratif : chaque examen ne vaut que si le précédent n’a pas modifié l’état sensoriel. On commence par l’<b>interrogatoire</b> (antécédents, plainte, contexte scolaire), puis l’<b>acuité de loin et de près</b> avec et sans correction, l’<b>examen de la motilité</b> et des <b>reflets</b>, puis les tests <b>les moins dissociants d’abord</b> : cover test, PPC, amplitudes de fusion, avant les tests franchement dissociants (verre rouge, Maddox, Lancaster) qui rompent la fusion et faussent ce qui suit. La <b>stéréoscopie</b> se mesure avant toute dissociation. La réfraction sous <b>cycloplégique</b> vient en dernier : elle supprime l’accommodation et donc toute mesure de convergence accommodative ou de PPC valable ensuite.',
    c: 'Interrogatoire, acuités, reflets et motilité, tests peu dissociants, tests dissociants, puis cycloplégie. Un bilan mené dans le désordre produit des chiffres qui ne veulent rien dire.' },

  { t: 'Rédiger le compte rendu',
    tag: 'méthode',
    s: 'Vous terminez le bilan précédent : hypermétropie +2,50 D découverte sous cycloplégie, PPC à 12 cm avec recouvrement à 16 cm, amplitudes de convergence réduites, stéréoscopie à 60 secondes d’arc.',
    q: ['À qui adressez-vous le compte rendu et que contient-il ?',
        'Quelle est la différence entre le bilan et le diagnostic orthoptique ?',
        'Que ne devez-vous pas y écrire ?'],
    r: 'Le compte rendu s’adresse au <b>prescripteur</b>, avec copie remise au patient ou à ses parents. Il contient l’identification, la date, le motif et le prescripteur, les <b>conditions de mesure</b> (avec ou sans correction, distances, tests utilisés), les résultats chiffrés, puis une <b>synthèse</b> et une proposition. Le <b>bilan</b> est l’ensemble des mesures ; le <b>diagnostic orthoptique</b> est le raisonnement qui les relie à la plainte et fonde le projet de soins : ici, une insuffisance de convergence associée à une hypermétropie non corrigée, cohérente avec des céphalées de fin de journée. On n’y écrit ni diagnostic médical, ni jugement sur le patient ou la famille, ni pronostic scolaire — et l’on reste dans son champ de compétence.',
    c: 'Compte rendu chiffré et daté, avec les conditions de mesure, une synthèse et une proposition de prise en charge. La correction optique est prescrite par le médecin ; la rééducation se conçoit après le port effectif de cette correction.' }
],

UE13: [
  { t: 'Nettoyer, désinfecter, stériliser',
    tag: 'méthode',
    s: 'Dans votre cabinet, la même paillasse reçoit la tête du tonomètre à aplanation, un verre à trois miroirs, la mentonnière du champ visuel et les occluseurs.',
    q: ['Comment classe-t-on ces matériels selon le risque ?',
        'Quel niveau de traitement pour chacun ?',
        'Quelle règle vaut pour tous ?'],
    r: 'La classification de <b>Spaulding</b> range les dispositifs selon le risque infectieux du contact. <b>Non critique</b> : contact avec la peau saine — mentonnière, appui-front, occluseur, monture d’essai ; un nettoyage-désinfection de bas niveau suffit, entre chaque patient. <b>Semi-critique</b> : contact avec une muqueuse ou une peau lésée — tête de tonomètre, verre de contact d’examen, verre de Goldmann ; ils exigent une désinfection de <b>niveau intermédiaire à haut</b>, par immersion dans un désinfectant adapté, temps de contact respecté, rinçage à l’eau stérile et séchage. <b>Critique</b> : effraction cutanée ou contact avec un site stérile ; stérilisation ou usage unique. La règle qui vaut pour tous est en amont : on <b>nettoie avant de désinfecter</b>, parce qu’un dépôt protéique protège les micro-organismes du désinfectant. Et le geste le plus efficace du cabinet reste la friction hydro-alcoolique entre chaque patient.',
    c: 'Trois niveaux, un principe : nettoyage préalable systématique. Le protocole du fabricant fait foi pour les produits et les temps de contact — et il se range à côté du matériel, pas dans un classeur.' },

  { t: 'Une aiguille et un doigt',
    tag: 'urgence',
    s: 'Lors d’un stage en bloc, une collègue se pique le doigt avec une aiguille souillée en rangeant un plateau.',
    q: ['Quels sont les tout premiers gestes ?',
        'Dans quel délai la conduite doit-elle être engagée ?',
        'Quelles démarches administratives suivent ?'],
    r: 'Un accident d’exposition au sang se traite en minutes. Immédiatement : <b>ne pas faire saigner</b>, laver à l’eau et au savon, rincer, puis <b>antiseptique à large spectre</b> — dérivé chloré ou polyvidone iodée — avec un temps de contact d’au moins 5 minutes. En cas de projection oculaire, rinçage abondant au sérum physiologique ou à l’eau pendant 5 minutes. Il faut ensuite joindre <b>sans délai</b> un médecin référent : l’évaluation du risque et l’éventuel traitement post-exposition VIH doivent être engagés <b>dans les 4 heures</b>, au mieux, et au plus tard 48 heures. Le statut sérologique du patient source est recherché avec son accord. Enfin, la déclaration d’accident du travail se fait dans les <b>48 heures</b>, avec certificat médical initial et suivi sérologique organisé.',
    c: 'Lavage, antiseptie 5 minutes, avis médical dans l’heure, déclaration sous 48 heures. Le réflexe qui coûte le plus cher est d’attendre la fin de la vacation.' }
],

UE14: [
  { t: 'Deux ésotropies qui ne se ressemblent pas',
    tag: 'clinique',
    s: 'Deux enfants sont vus le même jour. A : 5 mois, ésotropie constante de 45 Δ, réfraction +1,00, fixation alternante, nystagmus manifeste-latent. B : 3 ans, ésotropie apparue à 2 ans et demi, variable, 30 Δ, réfraction +4,50 sous cycloplégie.',
    q: ['Nommez les deux tableaux.',
        'Qu’attend-on de la correction optique dans chaque cas ?',
        'Quel élément de surveillance domine chez chacun ?'],
    r: 'A est une <b>ésotropie précoce</b> (ou congénitale, avant 6 mois) : angle grand et stable, réfraction peu significative, alternance, souvent associée à un nystagmus manifeste-latent, une DVD et une hyperaction des obliques inférieurs. La correction optique n’y change presque rien : le traitement est chirurgical, précédé du traitement d’une éventuelle amblyopie. B est une <b>ésotropie accommodative</b> : elle apparaît vers 2-3 ans, chez un hypermétrope, elle est variable et l’angle diminue, voire disparaît, sous <b>correction optique totale</b> portée en permanence. La surveillance porte, chez A, sur l’<b>amblyopie</b> et l’évolution vers la DVD ; chez B, sur la fonte de l’angle sous correction et l’apparition d’une composante non accommodative résiduelle.',
    c: 'A : ésotropie précoce, chirurgie après traitement de l’amblyopie. B : ésotropie accommodative, correction optique totale sous cycloplégie, portée en permanence, avant toute autre décision.' },

  { t: 'Un œil qui ne va pas en dehors, et une paupière qui se rétrécit',
    tag: 'clinique',
    s: 'Une adolescente présente une limitation de l’abduction de l’œil gauche. En adduction, la fente palpébrale se rétrécit et le globe se rétracte légèrement. Pas de diplopie, léger torticolis.',
    q: ['Paralysie du VI ou autre chose ?',
        'Quel est le mécanisme ?',
        'Quelle prise en charge ?'],
    r: 'Une paralysie du VI donne une limitation de l’abduction avec <b>diplopie</b> et ésotropie en position primaire, mais jamais de rétraction du globe. Ici, la <b>rétraction du globe et le rétrécissement de la fente</b> en adduction signent un <b>syndrome de Stilling-Duane</b> : une innervation aberrante, congénitale, dans laquelle le droit latéral est partiellement innervé par le III. En adduction, droit médial et droit latéral se contractent simultanément — la co-contraction tire le globe en arrière et referme la fente. C’est une <b>restriction</b>, non une paralysie : le test de duction forcée serait positif, l’absence de diplopie et le torticolis ancien confirment le caractère congénital.',
    c: 'Syndrome de Duane : on n’opère pas pour améliorer une motilité qui ne se rattrapera pas. La chirurgie ne se discute que sur un torticolis important ou une déviation en position primaire, et l’on rassure sur le caractère non évolutif.' }
],

UE15: [
  { t: 'Construire douze séances',
    tag: 'méthode',
    s: 'Insuffisance de convergence chez une étudiante de 20 ans : PPC à 15 cm, rupture-recouvrement 15/22 cm, convergence fusionnelle de près 12 Δ, exophorie de près 10 Δ. Prescription : 12 séances.',
    q: ['Quels objectifs fixez-vous, dans quel ordre ?',
        'Quels exercices pour chacun ?',
        'Comment jugez-vous du résultat ?'],
    r: 'On progresse du plus facile au plus exigeant, et de la conscience volontaire vers l’automatisme. 1) <b>Rapprocher le PPC</b> et faire prendre conscience de la convergence : cible rapprochée, diplopie physiologique, cordon de Brock. 2) <b>Augmenter les amplitudes fusionnelles</b> en convergence : barre de prismes, prismes progressifs, stéréogrammes (cartes de Bernell, schémas en divergence forcée puis convergence). 3) <b>Travailler la souplesse</b> : flippers de vergence et d’accommodation, alternance loin-près, tableau de Hart. 4) <b>Automatiser</b> par un travail quotidien à domicile de 10 à 15 minutes, condition sine qua non du résultat durable. Le succès se juge sur des critères mesurés : PPC ≤ 6-8 cm, convergence fusionnelle de près ≥ 20 Δ avec recouvrement, et surtout <b>disparition de la plainte</b> en lecture prolongée.',
    c: 'Douze séances hebdomadaires, exercices quotidiens à domicile, re-mesure toutes les quatre séances. L’insuffisance de convergence isolée guérit dans 80 à 90 % des cas — à condition que le travail à domicile soit fait.' },

  { t: 'Opérer, prismer ou rééduquer ?',
    tag: 'décision',
    s: 'Exotropie intermittente de 25 Δ chez un enfant de 8 ans, apparaissant en fatigue et en vision de loin, avec bonne stéréoscopie quand l’œil est droit et une fermeture d’un œil au soleil.',
    q: ['Quels arguments plaident pour la surveillance ?',
        'Quand une chirurgie devient-elle légitime ?',
        'Quelle est la place de la rééducation et des prismes ?'],
    r: 'Une exotropie <b>intermittente</b> avec bonne stéréoscopie en phase de contrôle est une situation où la binocularité est préservée : on ne l’opère pas pour un chiffre. On surveille le <b>pourcentage de temps dévié</b> (échelle de contrôle type Newcastle), la stéréoscopie, l’acuité, et l’angle de loin comme de près. La chirurgie devient légitime lorsque la déviation devient <b>majoritairement manifeste</b>, que la stéréoscopie se dégrade, qu’une neutralisation s’installe ou que le retentissement social est net. La rééducation orthoptique a une place réelle mais limitée : elle renforce le contrôle fusionnel et les amplitudes de convergence, très utile dans les formes à insuffisance de convergence associée. Les prismes base interne soulagent mais peuvent, à forte dose, aggraver la dépendance prismatique.',
    c: 'Surveillance rapprochée avec évaluation du contrôle, correction optique exacte, rééducation de la convergence. La chirurgie s’envisage sur la perte de contrôle, pas sur la seule valeur de l’angle.' }
],

UE17: [
  { t: 'Une cécité brutale et indolore',
    tag: 'urgence',
    s: 'Un homme de 71 ans, hypertendu, perd brutalement la vision de l’œil droit, sans douleur. Acuité : perception lumineuse. Déficit pupillaire afférent relatif majeur. Le fond d’œil montre une rétine pâle avec une macula rouge cerise.',
    q: ['Quel est le diagnostic ?',
        'Quel est le délai utile ?',
        'Quel bilan étiologique s’impose ?'],
    r: 'Rétine blanchâtre par œdème ischémique + <b>macula rouge cerise</b> (la choroïde reste visible par transparence à la fovéola, dépourvue de couches internes) : c’est une <b>occlusion de l’artère centrale de la rétine</b>. La rétine ne survit que quelques dizaines de minutes à une ischémie complète : le délai utile est très court, de l’ordre de 90 minutes à 4 heures, et le pronostic visuel reste sombre. L’enjeu est donc surtout <b>vital et controlatéral</b> : l’OACR est un accident vasculaire, il impose un bilan en urgence — échographie-doppler des troncs supra-aortiques, ECG et bilan cardiaque, et surtout, après 50 ans, la recherche d’une <b>maladie de Horton</b> (VS, CRP, signes temporaux, céphalées, claudication de la mâchoire) dont le traitement corticoïde immédiat protège l’œil restant.',
    c: 'OACR : filière neurovasculaire en urgence, VS-CRP en extrême urgence après 50 ans. On traite le patient, pas seulement l’œil perdu.' },

  { t: 'Trois examens pour un même glaucome',
    tag: 'méthode',
    s: 'Patient de 58 ans suivi pour glaucome chronique à angle ouvert : PIO 19 mmHg sous traitement, C/D 0,7, champ visuel avec ressaut nasal débutant, OCT montrant un amincissement du secteur inférieur des fibres.',
    q: ['Que mesure chacun de ces trois examens ?',
        'Lequel se dégrade en premier ?',
        'Quel est le rôle propre de l’orthoptiste ?'],
    r: 'Trois regards complémentaires : la <b>PIO</b> mesure le facteur de risque principal — modifiable, mais ni nécessaire ni suffisant au diagnostic (glaucomes à pression normale, hypertonies sans glaucome) ; l’<b>OCT</b> mesure la structure, épaisseur des fibres rétiniennes péripapillaires et complexe ganglionnaire maculaire ; le <b>champ visuel</b> mesure la fonction. La séquence habituelle est <b>structure avant fonction</b> : l’OCT détecte l’amincissement plusieurs années avant le déficit périmétrique, lequel n’apparaît qu’après une perte importante de fibres. La règle <b>ISNT</b> (bord neuro-rétinien plus épais en inférieur, puis supérieur, nasal, temporal) et sa rupture concordent ici avec le ressaut nasal. L’orthoptiste réalise le champ visuel, <b>contrôle sa fiabilité</b>, choisit la stratégie adaptée, installe correctement le patient avec sa correction de près, et assure la comparabilité d’un examen à l’autre — c’est cette rigueur qui rend le suivi longitudinal interprétable.',
    c: 'Concordance structure-fonction typique d’un glaucome évolutif. Le suivi repose sur des examens reproductibles : même stratégie, même correction, mêmes conditions.' }
],

UE18: [
  { t: 'Un enfant qui refuse de s’asseoir',
    tag: 'décision',
    s: 'Un garçon de 4 ans, adressé pour bilan, refuse l’occlusion, pleure et se réfugie contre sa mère dès que vous approchez un instrument.',
    q: ['Comment adaptez-vous le déroulement du bilan ?',
        'Que peut-on obtenir malgré tout ?',
        'Faut-il forcer pour finir l’examen ?'],
    r: 'Le développement d’un enfant de 4 ans explique la scène : l’examen est vécu comme une intrusion, et l’angoisse de séparation est encore vive. On adapte le cadre avant la technique — laisser l’enfant sur les genoux du parent, se mettre à sa hauteur, nommer chaque geste, montrer l’instrument sur le parent ou sur une peluche, transformer l’occlusion en jeu, et commencer par ce qui ne touche pas. Beaucoup d’informations s’obtiennent <b>sans coopération verbale</b> : reflets cornéens de Hirschberg, cover test à distance, poursuite d’une cible, réaction à l’occlusion alternée (défense à l’occlusion d’un œil = suspicion d’amblyopie de l’autre), regard préférentiel. Forcer produit une donnée fausse et compromet toutes les consultations suivantes.',
    c: 'Bilan partiel assumé, noté comme tel, complété lors d’une seconde séance courte. En pédiatrie, l’alliance vaut plus qu’un chiffre arraché.' },

  { t: 'Une baisse d’acuité qui ne colle pas',
    tag: 'clinique',
    s: 'Une adolescente de 15 ans déclare voir 1/10 des deux yeux. Elle se déplace sans hésitation dans le cabinet, évite les obstacles, et son examen ophtalmologique complet est strictement normal.',
    q: ['Quelle hypothèse évoquez-vous ?',
        'Comment l’explorer sans piéger la patiente ?',
        'Quelle attitude adoptez-vous ?'],
    r: 'La discordance entre une plainte visuelle sévère et un comportement visuel normal évoque un <b>trouble visuel fonctionnel</b> (autrefois « cécité hystérique »), fréquent à l’adolescence, sans simulation consciente le plus souvent. On l’explore par des tests dont le patient ne perçoit pas la logique : verres de puissance nulle annoncés comme correcteurs, échelle présentée à des distances variées sans le dire, acuité mesurée en ordre croissant puis décroissant, tests de vision binoculaire (stéréoscopie fine incompatible avec 1/10), et surtout <b>PEV et ERG normaux</b> qui objectivent l’intégrité des voies. Le piège serait de chercher à « démasquer » : la démarche n’est ni un interrogatoire ni un procès.',
    c: 'Trouble visuel fonctionnel probable, après élimination formelle d’une cause organique. On rassure sans nier la plainte, on évite les examens en cascade, et l’on propose un accompagnement psychologique en lien avec la famille et le médecin.' }
],

UE19: [
  { t: 'Choisir son cycloplégique',
    tag: 'décision',
    s: 'Trois enfants sont programmés : un nourrisson de 8 mois avec ésotropie, un enfant de 6 ans hypermétrope, un adolescent de 14 ans myope pour un simple contrôle.',
    q: ['Quel cycloplégique pour chacun ?',
        'Quels délais et quelles précautions ?',
        'Quelles contre-indications et quels effets à connaître ?'],
    r: 'L’<b>atropine</b> est le cycloplégique le plus puissant, réservée aux situations où la moindre hypermétropie latente compte : strabisme du nourrisson et du jeune enfant. Elle s’instille sur plusieurs jours (souvent 5 à 7 jours, en collyre à concentration adaptée à l’âge : 0,3 % avant 1 an), avec occlusion des points lacrymaux pour limiter le passage systémique. Le <b>cyclopentolate</b> est le standard de l’enfant plus grand : cycloplégie en 30 à 45 minutes, récupération en 12 à 24 heures. La <b>tropicamide</b> est surtout mydriatique, sa cycloplégie est faible et brève — suffisante pour un fond d’œil ou un contrôle chez l’adolescent, pas pour révéler une hypermétropie latente. Effets à connaître : photophobie et flou de près systématiques (prévenir : pas d’école, pas de conduite, protection solaire), risque de <b>toxicité systémique atropinique</b> chez le nourrisson (rougeur, fièvre, agitation, tachycardie), et prudence sur les angles étroits chez le sujet âgé.',
    c: 'Atropine pour le nourrisson strabique, cyclopentolate à 6 ans, tropicamide suffisante à 14 ans. Le choix se fait sur ce qu’on cherche à démasquer, pas sur l’habitude du cabinet.' },

  { t: 'Une goutte anesthésique de trop',
    tag: 'clinique',
    s: 'Un patient examiné pour un corps étranger cornéen demande une ordonnance de collyre anesthésique « pour tenir quelques jours, ça soulage tout de suite ».',
    q: ['Pourquoi cette demande doit-elle être refusée ?',
        'Quel est l’usage légitime de ces collyres ?',
        'Quelle information donnez-vous au patient ?'],
    r: 'Les anesthésiques topiques (oxybuprocaïne, tétracaïne) sont des outils d’<b>examen</b> : tonométrie à aplanation, retrait de corps étranger, gonioscopie, examen d’un œil très douloureux. Leur usage répété est <b>toxique pour l’épithélium cornéen</b> : ils inhibent la migration et la mitose des cellules épithéliales, retardent la cicatrisation et provoquent des kératites neurotrophiques sévères, parfois des ulcères en anneau et des perforations. S’y ajoute la suppression du réflexe de protection : l’œil anesthésié ne cligne plus, ne sent plus un nouveau corps étranger, et le patient se frotte sans percevoir la douleur d’alerte. C’est un accident classique et évitable, décrit chez des soignants comme chez des patients.',
    c: 'Refus argumenté, jamais de délivrance pour usage répété. L’antalgie repose sur un antalgique général, un cicatrisant et éventuellement un pansement occlusif, avec contrôle à 24-48 heures.' }
]

};
