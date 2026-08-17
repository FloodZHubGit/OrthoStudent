/* ============================================================
   Cas cliniques — mode patient
   ------------------------------------------------------------
   Chaque cas décrit :
     - l'anamnèse (dialogue),
     - les paramètres de simulation transmis aux simulateurs
       interactifs (phoroptère, cover test, fond d'œil…),
     - le résultat de chaque examen,
     - la pertinence de chaque examen (scoring),
     - le diagnostic et la conduite à tenir attendus.
   ============================================================ */

window.CASES = [

{
  id: 'c01',
  name: 'Léa M.',
  age: 21,
  job: 'Étudiante en droit',
  motif: 'Maux de tête et vision double en fin de journée quand je révise.',
  difficulty: 1,
  tags: ['Vision binoculaire', 'Rééducation'],
  anamnese: [
    { q: 'Depuis quand ressentez-vous ces troubles ?', a: 'Depuis environ six mois, ça a commencé pendant les partiels.' },
    { q: 'À quel moment surviennent-ils ?', a: 'Toujours en lecture, après vingt ou trente minutes. De loin je n’ai jamais de problème.' },
    { q: 'Voyez-vous double ?', a: 'Parfois les lignes se dédoublent côte à côte, et si je ferme un œil ça disparaît.' },
    { q: 'Portez-vous une correction ?', a: 'Non, je n’ai jamais eu de lunettes.' },
    { q: 'Antécédents particuliers ?', a: 'Rien du tout. Pas de traumatisme, pas de traitement.' }
  ],
  sim: {
    acuity: { odFar: 1.0, osFar: 1.0, odNear: 1.0, osNear: 1.0 },
    refraction: { od: { sph: 0, cyl: 0, axis: 0 }, os: { sph: 0.25, cyl: 0, axis: 0 } },
    covertest: { farH: -2, farV: 0, nearH: -14, nearV: 0, manifest: false, dominant: 'od' },
    ppc: { breakCm: 18, recoveryCm: 24 },
    fundus: { od: 'normal', os: 'normal' },
    motility: null, worth: 'fusion', bagolini: 'crn', stereo: 60,
    fusion: { BE: { blur: 8, brk: 12, rec: 4 }, BI: { blur: 0, brk: 20, rec: 12 } },
    colorvision: 'normal'
  },
  tests: {
    acuity:    { relevant: true,  result: 'AV de loin 10/10 ODG sans correction. De près P2 ODG.' },
    phoropter: { relevant: true,  result: 'Réfraction subjective : plan OD, +0,25 OG. Pas d’amétropie significative.' },
    covertest: { relevant: true,  result: 'CT VL : orthophorie à 2 Δ d’exophorie. CT VP : exophorie de 14 Δ, recouvrement lent et incomplet.' },
    prism:     { relevant: true,  result: 'Mesure prismatique : 2 Δ exo VL, 14 Δ exo VP.' },
    ppc:       { relevant: true,  result: 'PPC : rupture à 18 cm, recouvrement à 24 cm. Nettement pathologique.' },
    binocular: { relevant: true,  result: 'Worth : 4 points de loin et de près. Stéréo TNO 60". Convergence fusionnelle VP : 8/12/4 Δ (effondrée).' },
    motility:  { relevant: true,  result: 'Ductions et versions libres et symétriques, pas d’incomitance.' },
    lancaster: { relevant: false, result: 'Superposable dans les 9 positions — examen non nécessaire ici.' },
    fundus:    { relevant: false, result: 'Papilles et maculas normales — sans apport diagnostique ici.' },
    colorvision:{ relevant: false, result: 'Vision des couleurs normale — hors sujet.' },
    fields:    { relevant: false, result: 'Champ visuel normal — hors sujet.' }
  },
  diagnosis: {
    options: [
      'Insuffisance de convergence',
      'Paralysie du VI débutante',
      'Exotropie intermittente à excès de divergence',
      'Spasme accommodatif'
    ],
    correct: 0,
    exp: 'Exophorie de près nettement supérieure à celle de loin, PPC très éloigné, réserves de convergence effondrées, symptômes en lecture : c’est le tableau typique de l’insuffisance de convergence. L’AC/A est bas.'
  },
  management: {
    options: [
      'Rééducation orthoptique de la convergence (séries de séances + exercices à domicile)',
      'Chirurgie des droits médiaux d’emblée',
      'Prescription de prismes base externe en première intention',
      'Contrôle de l’hygiène visuelle et des pauses en lecture',
      'Prescription d’une correction optique forte en + de près'
    ],
    correct: [0, 3],
    exp: 'Le traitement de référence est la rééducation orthoptique (excellents résultats dans l’insuffisance de convergence isolée), associée aux conseils d’hygiène visuelle. Les prismes ne viennent qu’en cas d’échec, la chirurgie exceptionnellement.'
  }
},

{
  id: 'c02',
  name: 'Tom D.',
  age: 4,
  job: 'Moyenne section de maternelle',
  motif: 'Sa maîtresse a remarqué qu’il louche, surtout quand il regarde ses livres.',
  difficulty: 2,
  tags: ['Strabisme', 'Pédiatrie'],
  anamnese: [
    { q: 'Depuis quand voit-on cette déviation ?', a: 'Maman : « Depuis ses 2 ans et demi environ, ça va et vient. C’est pire quand il est fatigué. »' },
    { q: 'Un œil est-il toujours le même à dévier ?', a: 'Maman : « Non, tantôt l’un tantôt l’autre. »' },
    { q: 'Antécédents familiaux ?', a: 'Maman : « Son père est très hypermétrope, il a été opéré d’un strabisme enfant. »' },
    { q: 'Grossesse et développement ?', a: 'Maman : « Terme normal, tout va bien par ailleurs. »' },
    { q: 'Se plaint-il de voir double ?', a: 'Maman : « Non, jamais. »' }
  ],
  sim: {
    acuity: { odFar: 0.8, osFar: 0.8, odNear: 0.8, osNear: 0.8 },
    refraction: { od: { sph: 4.5, cyl: 0, axis: 0 }, os: { sph: 4.25, cyl: -0.5, axis: 180 } },
    covertest: { farH: -14, farV: 0, nearH: -30, nearV: 0, manifest: true, alternating: true, dominant: 'od' },
    ppc: { breakCm: 6, recoveryCm: 8 },
    fundus: { od: 'normal', os: 'normal' },
    motility: null, worth: 'alt', bagolini: 'alt', stereo: null, colorvision: 'normal'
  },
  tests: {
    acuity:    { relevant: true,  result: 'AV avec images de Pigassou : 8/10 OD, 8/10 OG. Pas d’amblyopie franche, alternance spontanée.' },
    phoropter: { relevant: true,  result: 'Réfraction sous cycloplégie : OD +4,50 sph ; OG +4,25 (−0,50 à 180°). Hypermétropie forte.' },
    covertest: { relevant: true,  result: 'CT VL : ésotropie alternante de 14 Δ. CT VP : ésotropie de 30 Δ. Alternance libre, pas de préférence de fixation.' },
    prism:     { relevant: true,  result: 'Neutralisation : 14 Δ base externe de loin, 30 Δ base externe de près.' },
    motility:  { relevant: true,  result: 'Ductions et versions normales, pas de limitation de l’abduction. Déviation comitante.' },
    fundus:    { relevant: true,  result: 'Fond d’œil normal aux deux yeux — élimine un strabisme sensoriel.' },
    binocular: { relevant: true,  result: 'Worth VP : 5 points par moments, 2 points rouges le reste du temps. TNO : non mesurable.' },
    ppc:       { relevant: false, result: 'PPC à 6 cm — normal, peu informatif ici.' },
    lancaster: { relevant: false, result: 'Difficilement réalisable à cet âge et inutile devant une déviation comitante.' },
    fields:    { relevant: false, result: 'Non réalisable et non indiqué à cet âge.' },
    colorvision:{ relevant: false, result: 'Non contributif.' }
  },
  diagnosis: {
    options: [
      'Ésotropie congénitale',
      'Ésotropie accommodative avec excès de convergence',
      'Paralysie bilatérale du VI',
      'Pseudo-strabisme par épicanthus'
    ],
    correct: 1,
    exp: 'Début vers 2–3 ans, hypermétropie forte, angle de près nettement supérieur à l’angle de loin (AC/A élevé), déviation comitante, absence de limitation : ésotropie accommodative avec excès de convergence. L’ésotropie congénitale débute avant 6 mois avec un grand angle stable.'
  },
  management: {
    options: [
      'Correction optique totale de l’hypermétropie portée en permanence',
      'Réévaluation de l’angle 4 à 6 semaines après le port de la correction',
      'Envisager un double foyer ou des progressifs si l’angle de près reste supérieur',
      'Chirurgie immédiate des droits médiaux',
      'Occlusion 6 h/j en urgence'
    ],
    correct: [0, 1, 2],
    exp: 'La correction optique totale sous cycloplégie est la première étape et suffit souvent à neutraliser l’angle. Un excès de convergence résiduel relève d’une addition de près. Il n’y a pas d’amblyopie ici (alternance libre) donc pas d’occlusion, et la chirurgie ne se discute qu’après échec de la correction.'
  }
},

{
  id: 'c03',
  name: 'Marc B.',
  age: 58,
  job: 'Chauffeur poids lourd',
  motif: 'Je vois double depuis dix jours, surtout quand je regarde au loin sur la route.',
  difficulty: 2,
  tags: ['Paralysie', 'Urgence relative'],
  anamnese: [
    { q: 'Comment est apparue la diplopie ?', a: 'Du jour au lendemain, un matin en me levant.' },
    { q: 'Les images sont-elles côte à côte ou l’une au-dessus de l’autre ?', a: 'Côte à côte, horizontalement.' },
    { q: 'Dans quelle direction est-ce le pire ?', a: 'Quand je regarde vers la droite et au loin. De près ça va presque.' },
    { q: 'Avez-vous des antécédents ?', a: 'Diabète de type 2 depuis 12 ans et hypertension. Je suis mal équilibré en ce moment.' },
    { q: 'Avez-vous mal à la tête ?', a: 'Un peu autour de l’œil droit les premiers jours, plus maintenant.' }
  ],
  sim: {
    acuity: { odFar: 1.0, osFar: 1.0, odNear: 0.63, osNear: 0.63 },
    refraction: { od: { sph: 0.75, cyl: -0.5, axis: 90 }, os: { sph: 0.5, cyl: -0.25, axis: 85 } },
    covertest: { farH: -25, farV: 0, nearH: -12, nearV: 0, manifest: true, dominant: 'os',
                 incomitance: { axis: 'h', dextro: -40, levo: -8 } },
    ppc: { breakCm: 8, recoveryCm: 12 },
    fundus: { od: 'diabetique', os: 'diabetique' },
    motility: { eye: 'od', muscle: 'DL', severity: 0.6 },
    worth: 'dipl-eso', bagolini: 'cross', stereo: null, colorvision: 'normal'
  },
  tests: {
    acuity:    { relevant: true,  result: 'AV 10/10 ODG avec correction. Vision de près P3 (presbytie non corrigée).' },
    covertest: { relevant: true,  result: 'CT VL : ésotropie OD de 25 Δ. CT VP : 12 Δ. Déviation nettement plus grande de loin.' },
    prism:     { relevant: true,  result: 'Neutralisation : 25 Δ base externe VL, 12 Δ VP ; 40 Δ en dextroversion, 8 Δ en lévoversion.' },
    motility:  { relevant: true,  result: 'Limitation franche de l’abduction de l’OD (−3). Toutes les autres ductions sont libres.' },
    lancaster: { relevant: true,  result: 'Schéma rétréci en horizontal de l’OD, écartement maximal en dextroversion. Déviation secondaire > primaire.' },
    binocular: { relevant: true,  result: 'Diplopie homonyme horizontale, maximale en regard à droite. Pas de neutralisation (patient adulte).' },
    fundus:    { relevant: true,  result: 'Rétinopathie diabétique non proliférante bilatérale : microanévrismes, hémorragies punctiformes, quelques exsudats secs.' },
    phoropter: { relevant: true,  result: 'Réfraction : OD +0,75 (−0,50 à 90°) ; OG +0,50 (−0,25 à 85°). Addition +2,00 nécessaire.' },
    ppc:       { relevant: false, result: 'PPC 8 cm — non contributif ici.' },
    colorvision:{ relevant: false, result: 'Normale.' },
    fields:    { relevant: false, result: 'Non indiqué en première intention devant ce tableau.' }
  },
  diagnosis: {
    options: [
      'Paralysie du VI droit',
      'Paralysie du III droit',
      'Ésotropie accommodative de l’adulte',
      'Syndrome de Duane type I droit'
    ],
    correct: 0,
    exp: 'Diplopie horizontale d’apparition brutale, ésotropie majorée de loin et en regard du côté atteint, limitation isolée de l’abduction : paralysie du VI droit. Le terrain diabétique et hypertendu oriente vers une origine microvasculaire.'
  },
  management: {
    options: [
      'Adresser à l’ophtalmologiste et rechercher/traiter la cause (équilibre du diabète, bilan tensionnel, imagerie si atypique)',
      'Occlusion alternée ou prisme de Fresnel pour supprimer la diplopie en attendant',
      'Surveillance de la récupération sur 3 à 6 mois avant toute chirurgie',
      'Chirurgie de recul du droit médial droit dans la semaine',
      'Rééducation intensive de la convergence'
    ],
    correct: [0, 1, 2],
    exp: 'Une paralysie du VI microvasculaire régresse le plus souvent en 3 à 6 mois. On soulage la diplopie (Fresnel, occlusion), on traite la cause et on ne discute la chirurgie ou la toxine qu’après stabilisation. Attention : ce patient est chauffeur professionnel, l’aptitude à la conduite doit être évoquée.'
  }
},

{
  id: 'c04',
  name: 'Sophie R.',
  age: 34,
  job: 'Graphiste',
  motif: 'Depuis ma chute à vélo il y a trois semaines, je vois double en descendant les escaliers.',
  difficulty: 3,
  tags: ['Paralysie', 'Verticale'],
  anamnese: [
    { q: 'Comment sont disposées les deux images ?', a: 'L’une au-dessus de l’autre, et un peu penchée l’une par rapport à l’autre.' },
    { q: 'Quand est-ce le plus gênant ?', a: 'Quand je regarde en bas : les escaliers, la lecture. Et quand je penche la tête à droite.' },
    { q: 'Avez-vous une position de tête particulière ?', a: 'Mon compagnon me dit que je penche la tête vers la gauche sans m’en rendre compte.' },
    { q: 'Avez-vous perdu connaissance lors de la chute ?', a: 'Quelques secondes, j’ai été vue aux urgences, le scanner était normal.' },
    { q: 'La gêne évolue-t-elle ?', a: 'C’était pire au début, ça s’améliore un peu.' }
  ],
  sim: {
    acuity: { odFar: 1.0, osFar: 1.0, odNear: 1.0, osNear: 1.0 },
    refraction: { od: { sph: -1.25, cyl: 0, axis: 0 }, os: { sph: -1.5, cyl: -0.25, axis: 175 } },
    covertest: { farH: 0, farV: 6, nearH: -4, nearV: 8, manifest: true, dominant: 'os',
                 incomitance: { axis: 'v', levo: 12, dextro: 2, tiltRight: 14, tiltLeft: 2 } },
    ppc: { breakCm: 7, recoveryCm: 10 },
    fundus: { od: 'normal', os: 'normal' },
    motility: { eye: 'od', muscle: 'OS', severity: 0.5 },
    worth: 'dipl-vert', bagolini: 'cross', stereo: null, colorvision: 'normal'
  },
  tests: {
    acuity:    { relevant: true,  result: 'AV 10/10 ODG avec correction myopique légère.' },
    covertest: { relevant: true,  result: 'CT VL : hypertropie OD de 6 Δ. CT VP : 8 Δ avec 4 Δ d’exo associés.' },
    prism:     { relevant: true,  result: 'Neutralisation : 6 Δ base inférieure OD de loin, 12 Δ en lévoversion, 2 Δ en dextroversion.' },
    motility:  { relevant: true,  result: 'Hypo-action de l’oblique supérieur droit (−2) en adduction, hyperaction de l’oblique inférieur droit (+2).' },
    lancaster: { relevant: true,  result: 'Schéma OD décalé vers le haut, écart maximal en bas et à gauche. Confirme l’atteinte de l’OS droit.' },
    binocular: { relevant: true,  result: 'Diplopie verticale et torsionnelle. Manœuvre de Bielschowsky : hypertropie OD majorée à 14 Δ en inclinaison droite.' },
    fundus:    { relevant: false, result: 'Fond d’œil normal — l’excyclotorsion peut cependant être objectivée au fond d’œil.' },
    phoropter: { relevant: true,  result: 'OD −1,25 sph ; OG −1,50 (−0,25 à 175°).' },
    ppc:       { relevant: false, result: 'PPC 7 cm — non contributif.' },
    fields:    { relevant: false, result: 'Non indiqué.' },
    colorvision:{ relevant: false, result: 'Normale.' }
  },
  diagnosis: {
    options: [
      'Paralysie de l’oblique supérieur droit (IV droit)',
      'Paralysie de l’oblique supérieur gauche (IV gauche)',
      'Paralysie du droit supérieur gauche',
      'Déviation verticale dissociée'
    ],
    correct: 0,
    exp: 'Les 3 pas de Parks : 1) hypertropie OD → 4 muscles ; 2) majorée en lévoversion → OS droit ou DI gauche ; 3) majorée en inclinaison droite → oblique supérieur droit. Torticolis tête inclinée à gauche, diplopie torsionnelle : tableau complet du IV droit post-traumatique.'
  },
  management: {
    options: [
      'Attendre la stabilisation (6 mois) avant d’envisager une chirurgie',
      'Prisme base inférieure OD (ou réparti) pour compenser la diplopie en position primaire',
      'Rechercher un torticolis ancien sur photos (décompensation d’une paralysie congénitale)',
      'Occlusion définitive de l’œil droit',
      'Rééducation de la convergence'
    ],
    correct: [0, 1, 2],
    exp: 'Les paralysies du IV post-traumatiques récupèrent souvent partiellement en quelques mois. En attendant : prismes. Il faut toujours chercher des photos anciennes : beaucoup de « paralysies traumatiques du IV » sont en réalité des formes congénitales décompensées (grandes amplitudes de fusion verticale > 4 Δ en faveur du congénital).'
  }
},

{
  id: 'c05',
  name: 'Robert P.',
  age: 74,
  job: 'Retraité, ancien menuisier',
  motif: 'Les lignes droites sont déformées quand je lis avec mon œil gauche, et j’ai une tache au milieu.',
  difficulty: 2,
  tags: ['Rétine', 'Basse vision'],
  anamnese: [
    { q: 'Depuis quand ?', a: 'Trois semaines environ, et ça s’aggrave vite.' },
    { q: 'Un ou deux yeux ?', a: 'Surtout le gauche. Je m’en suis rendu compte en fermant le droit.' },
    { q: 'Les lignes sont-elles ondulées ?', a: 'Oui, les carreaux de ma cuisine sont tordus.' },
    { q: 'Antécédents ?', a: 'Je fume depuis 50 ans. Ma mère avait la DMLA.' },
    { q: 'Votre vision de loin est-elle touchée ?', a: 'Je ne reconnais plus les visages de loin avec cet œil.' }
  ],
  sim: {
    acuity: { odFar: 0.63, osFar: 0.1, odNear: 0.5, osNear: 0.06 },
    refraction: { od: { sph: 2.0, cyl: -0.75, axis: 95 }, os: { sph: 2.25, cyl: -1.0, axis: 85 } },
    covertest: { farH: 0, farV: 0, nearH: -2, nearV: 0, manifest: false, dominant: 'od' },
    fundus: { od: 'drusen', os: 'dmla' },
    fields: { od: 'normal', os: 'central' },
    amsler: 'meta', ppc: { breakCm: 10, recoveryCm: 14 },
    motility: null, worth: 'fusion', bagolini: 'crn', stereo: null, colorvision: 'by'
  },
  tests: {
    acuity:    { relevant: true,  result: 'AV corrigée : OD 6,3/10 P4 ; OG 1/10 P14. Baisse majeure et récente à gauche.' },
    phoropter: { relevant: true,  result: 'OD +2,00 (−0,75 à 95°) add +3,00 ; OG +2,25 (−1,00 à 85°). La correction n’améliore pas l’OG.' },
    fields:    { relevant: true,  result: 'Grille d’Amsler OG : métamorphopsies centrales et scotome relatif paracentral. OD : quelques ondulations discrètes.' },
    fundus:    { relevant: true,  result: 'OG : soulèvement maculaire, hémorragie sous-rétinienne, exsudats — néovascularisation choroïdienne. OD : drusen séreux confluents.' },
    colorvision:{ relevant: true,  result: 'Dyschromatopsie d’axe bleu-jaune à gauche (atteinte maculaire).' },
    covertest: { relevant: false, result: 'Orthophorie — non contributif.' },
    motility:  { relevant: false, result: 'Motilité normale.' },
    prism:     { relevant: false, result: 'Sans objet.' },
    ppc:       { relevant: false, result: 'PPC 10/14 cm — normal pour l’âge, sans rapport avec la plainte.' },
    binocular: { relevant: false, result: 'Difficilement interprétable du fait de l’asymétrie d’acuité.' },
    lancaster: { relevant: false, result: 'Sans objet.' }
  },
  diagnosis: {
    options: [
      'DMLA exsudative de l’œil gauche sur DMLA sèche bilatérale',
      'Cataracte nucléaire de l’œil gauche',
      'Glaucome chronique',
      'Occlusion de l’artère centrale de la rétine gauche'
    ],
    correct: 0,
    exp: 'Métamorphopsies d’installation rapide, scotome central, baisse d’acuité majeure unilatérale, drusen controlatéraux et terrain (âge, tabac, hérédité) : DMLA exsudative. L’OCT et l’angiographie confirmeront la néovascularisation.'
  },
  management: {
    options: [
      'Adresser en urgence (moins de 8 jours) pour OCT et anti-VEGF',
      'Remettre une grille d’Amsler pour l’autosurveillance de l’œil droit',
      'Conseils : arrêt du tabac, supplémentation type AREDS discutée avec l’ophtalmologiste',
      'Bilan et prise en charge basse vision (aides optiques, éclairage, fixation excentrée)',
      'Prescrire des prismes de compensation'
    ],
    correct: [0, 1, 2, 3],
    exp: 'La DMLA exsudative est une urgence thérapeutique : chaque semaine de retard coûte des lettres définitivement perdues. L’orthoptiste a un rôle majeur dans l’autosurveillance (Amsler), l’éducation et la rééducation basse vision.'
  }
},

{
  id: 'c06',
  name: 'Inès K.',
  age: 7,
  job: 'CE1',
  motif: 'Elle a raté le dépistage scolaire : un œil voit beaucoup moins bien.',
  difficulty: 2,
  tags: ['Amblyopie', 'Pédiatrie'],
  anamnese: [
    { q: 'Se plaint-elle de quelque chose ?', a: 'Maman : « Non, jamais. Elle ne s’est aperçue de rien. »' },
    { q: 'Louche-t-elle ?', a: 'Maman : « Pas du tout, on n’a jamais rien remarqué. »' },
    { q: 'A-t-elle déjà été vue par un ophtalmologiste ?', a: 'Maman : « Non, c’est la première fois. »' },
    { q: 'Comment se passe l’école ?', a: 'Maman : « Très bien, elle lit bien. »' },
    { q: 'Antécédents familiaux ?', a: 'Maman : « Son grand frère porte des lunettes depuis 4 ans. »' }
  ],
  sim: {
    acuity: { odFar: 1.0, osFar: 0.25, odNear: 1.0, osNear: 0.3 },
    refraction: { od: { sph: 0.5, cyl: -0.25, axis: 180 }, os: { sph: 4.75, cyl: -1.5, axis: 10 } },
    covertest: { farH: -3, farV: 0, nearH: -4, nearV: 0, manifest: true, microtropia: true, dominant: 'od' },
    fundus: { od: 'normal', os: 'normal' },
    motility: null, worth: 'fusion', bagolini: 'gap', stereo: 480, colorvision: 'normal', ppc: { breakCm: 6, recoveryCm: 9 }
  },
  tests: {
    acuity:    { relevant: true,  result: 'AV sans correction : OD 10/10, OG 2,5/10. Écart majeur, sans plainte fonctionnelle.' },
    phoropter: { relevant: true,  result: 'Sous cycloplégie : OD +0,50 (−0,25 à 180°) ; OG +4,75 (−1,50 à 10°). Anisométropie de 4,25 D.' },
    covertest: { relevant: true,  result: 'CT unilatéral : micro-mouvement de refixation de l’OG. Microtropie de 3–4 Δ avec dominance de l’OD.' },
    binocular: { relevant: true,  result: 'Worth : 4 points. TNO : 480" seulement. Stéréoscopie fruste, compatible avec une microtropie.' },
    fundus:    { relevant: true,  result: 'Fond d’œil normal aux deux yeux — élimine une cause organique à l’amblyopie.' },
    motility:  { relevant: true,  result: 'Ductions et versions normales.' },
    prism:     { relevant: false, result: 'Mesure de 3–4 Δ, peu contributive au traitement.' },
    ppc:       { relevant: false, result: 'PPC 6/9 cm — normal.' },
    lancaster: { relevant: false, result: 'Sans objet.' },
    fields:    { relevant: false, result: 'Sans objet.' },
    colorvision:{ relevant: false, result: 'Normale.' }
  },
  diagnosis: {
    options: [
      'Amblyopie anisométropique de l’œil gauche avec microtropie',
      'Amblyopie de privation',
      'Amblyopie strabique par ésotropie de grand angle',
      'Baisse d’acuité organique de l’œil gauche'
    ],
    correct: 0,
    exp: 'Anisométropie hypermétropique de 4,25 D, absence de strabisme visible, microtropie retrouvée au cover test unilatéral, fond d’œil normal : amblyopie fonctionnelle anisométropique. Le pronostic reste bon à 7 ans mais la fenêtre thérapeutique se referme.'
  },
  management: {
    options: [
      'Correction optique totale portée en permanence, réévaluation à 6 semaines',
      'Occlusion de l’œil droit (2 à 6 h/j selon la profondeur) après la phase de correction seule',
      'Surveillance rapprochée du risque d’amblyopie à bascule',
      'Chirurgie de la microtropie',
      'Rééducation de la convergence en priorité'
    ],
    correct: [0, 1, 2],
    exp: 'Correction totale d’abord (elle apporte à elle seule plusieurs lignes), puis occlusion si l’acuité reste basse, avec contrôle du risque d’amblyopie à bascule. La microtropie ne s’opère pas.'
  }
},

{
  id: 'c07',
  name: 'Julien F.',
  age: 29,
  job: 'Développeur informatique',
  motif: 'Je vois flou de loin depuis quelques mois et j’ai mal aux yeux devant l’écran.',
  difficulty: 1,
  tags: ['Réfraction', 'Écran'],
  anamnese: [
    { q: 'Le flou est-il constant ?', a: 'De loin oui, surtout le soir. De près je vois très bien.' },
    { q: 'Portez-vous une correction ?', a: 'Des lunettes achetées il y a 5 ans, je ne les mets presque plus.' },
    { q: 'Combien d’heures d’écran par jour ?', a: 'Neuf à dix heures, plus le téléphone.' },
    { q: 'Avez-vous les yeux qui piquent ?', a: 'Oui, secs et rouges en fin de journée.' },
    { q: 'Des maux de tête ?', a: 'Frontaux, en fin de journée.' }
  ],
  sim: {
    acuity: { odFar: 0.2, osFar: 0.16, odNear: 1.0, osNear: 1.0 },
    refraction: { od: { sph: -2.25, cyl: -0.75, axis: 170 }, os: { sph: -2.75, cyl: -1.0, axis: 15 } },
    covertest: { farH: -1, farV: 0, nearH: -8, nearV: 0, manifest: false, dominant: 'od' },
    ppc: { breakCm: 9, recoveryCm: 12 },
    fundus: { od: 'normal', os: 'normal' },
    motility: null, worth: 'fusion', bagolini: 'crn', stereo: 30,
    fusion: { BE: { blur: 14, brk: 18, rec: 10 }, BI: { blur: 0, brk: 20, rec: 12 } },
    colorvision: 'normal'
  },
  tests: {
    acuity:    { relevant: true,  result: 'AV sans correction : OD 2/10, OG 1,6/10. De près P2 sans correction.' },
    phoropter: { relevant: true,  result: 'Réfraction subjective : OD −2,25 (−0,75 à 170°) = 10/10 ; OG −2,75 (−1,00 à 15°) = 10/10.' },
    covertest: { relevant: true,  result: 'CT VL : orthophorie. CT VP : exophorie de 8 Δ bien compensée.' },
    ppc:       { relevant: true,  result: 'PPC : 9/12 cm, à la limite supérieure de la norme.' },
    binocular: { relevant: true,  result: 'Worth 4 points, TNO 30". Réserves de convergence VP : 14/18/10 Δ, un peu justes.' },
    motility:  { relevant: false, result: 'Motilité normale.' },
    fundus:    { relevant: true,  result: 'Fond d’œil normal — vérification de la périphérie utile chez un myope.' },
    prism:     { relevant: false, result: 'Sans objet.' },
    lancaster: { relevant: false, result: 'Sans objet.' },
    fields:    { relevant: false, result: 'Sans objet.' },
    colorvision:{ relevant: false, result: 'Normale.' }
  },
  diagnosis: {
    options: [
      'Myopie avec astigmatisme non corrigée + syndrome de fatigue visuelle numérique',
      'Insuffisance de convergence sévère',
      'Presbytie débutante',
      'Kératocône bilatéral'
    ],
    correct: 0,
    exp: 'Myopie faible avec astigmatisme jamais corrigée correctement, associée à une exposition écran majeure : le tableau est celui de l’asthénopie liée au travail sur écran. La convergence est limite mais pas franchement pathologique.'
  },
  management: {
    options: [
      'Prescription de la correction optique adaptée, portée pour la vision de loin et l’écran',
      'Règle 20-20-20, réglage de la distance et de la hauteur d’écran, lumière et clignements',
      'Larmes artificielles si sécheresse persistante',
      'Rééducation orthoptique intensive de 20 séances',
      'Prescription de prismes'
    ],
    correct: [0, 1, 2],
    exp: 'La correction optique et l’ergonomie visuelle règlent l’essentiel. La rééducation ne serait justifiée que si le bilan binoculaire était franchement pathologique après correction.'
  }
},

{
  id: 'c08',
  name: 'Nadia S.',
  age: 62,
  job: 'Enseignante retraitée',
  motif: 'Mon ophtalmologiste a trouvé une tension oculaire élevée et veut un champ visuel.',
  difficulty: 3,
  tags: ['Glaucome', 'Exploration'],
  anamnese: [
    { q: 'Avez-vous des symptômes ?', a: 'Aucun, je vois très bien. C’est ça qui m’étonne.' },
    { q: 'Antécédents familiaux ?', a: 'Mon père a été opéré d’un glaucome et a beaucoup perdu la vue.' },
    { q: 'Traitements ?', a: 'On vient de me mettre un collyre le soir depuis un mois.' },
    { q: 'Êtes-vous myope ?', a: 'Oui, −6 dioptries depuis l’adolescence.' },
    { q: 'Avez-vous des accrochages, des chutes ?', a: 'Je bute parfois sur des objets à ma gauche, oui, maintenant que vous le dites.' }
  ],
  sim: {
    acuity: { odFar: 1.0, osFar: 0.8, odNear: 1.0, osNear: 0.8 },
    refraction: { od: { sph: -6.0, cyl: -0.5, axis: 175 }, os: { sph: -6.5, cyl: -0.75, axis: 5 } },
    covertest: { farH: -4, farV: 0, nearH: -6, nearV: 0, manifest: false, dominant: 'od' },
    fundus: { od: 'glaucome', os: 'glaucome_avance' },
    fields: { od: 'bjerrum', os: 'altitudinal' }, ppc: { breakCm: 9, recoveryCm: 12 },
    motility: null, worth: 'fusion', bagolini: 'crn', stereo: 60, colorvision: 'normal'
  },
  tests: {
    acuity:    { relevant: true,  result: 'AV corrigée : OD 10/10, OG 8/10. L’acuité centrale reste longtemps conservée dans le glaucome.' },
    fields:    { relevant: true,  result: 'Périmétrie automatisée : OD scotome de Bjerrum supérieur ; OG ressaut nasal marqué et déficit arciforme inférieur étendu.' },
    fundus:    { relevant: true,  result: 'Excavation papillaire : C/D 0,6 OD et 0,85 OG, encoche du bord neuro-rétinien inférieur à gauche, asymétrie nette.' },
    phoropter: { relevant: true,  result: 'OD −6,00 (−0,50 à 175°) ; OG −6,50 (−0,75 à 5°). Myopie forte : facteur de risque de glaucome.' },
    colorvision:{ relevant: false, result: 'Normale — la dyschromatopsie n’est pas au premier plan.' },
    covertest: { relevant: false, result: 'Exophorie légère non significative.' },
    motility:  { relevant: false, result: 'Normale.' },
    prism:     { relevant: false, result: 'Sans objet.' },
    ppc:       { relevant: false, result: 'PPC 9/12 cm — normal, sans rapport avec le motif de consultation.' },
    binocular: { relevant: false, result: 'Sans objet.' },
    lancaster: { relevant: false, result: 'Sans objet.' }
  },
  diagnosis: {
    options: [
      'Glaucome primitif à angle ouvert, plus évolué à gauche',
      'Neuropathie optique ischémique antérieure',
      'Hémianopsie latérale homonyme',
      'Rétinopathie pigmentaire'
    ],
    correct: 0,
    exp: 'Déficits arciformes respectant le méridien horizontal, ressaut nasal, excavation papillaire asymétrique avec encoche, terrain (hérédité, myopie forte, âge) : glaucome chronique à angle ouvert. L’acuité centrale conservée est typique.'
  },
  management: {
    options: [
      'Champs visuels de suivi réguliers pour évaluer la vitesse de progression',
      'Insister sur l’observance du collyre — c’est le principal facteur d’échec',
      'Dépistage de la fratrie et des enfants',
      'Rééducation orthoptique de la convergence',
      'Occlusion de l’œil gauche'
    ],
    correct: [0, 1, 2],
    exp: 'Le rôle de l’orthoptiste est central : réalisation et fiabilité des champs visuels, suivi de la progression, éducation thérapeutique sur l’observance, et rappel du dépistage familial (risque multiplié par 3 à 5 chez les apparentés).'
  }
},

{
  id: 'c09',
  name: 'Karim T.',
  age: 16,
  job: 'Lycéen',
  motif: 'Mon œil part dehors quand je suis fatigué ou au soleil.',
  difficulty: 2,
  tags: ['Strabisme', 'Adolescent'],
  anamnese: [
    { q: 'Depuis quand ?', a: 'Depuis tout petit, mais ça s’aggrave depuis deux ans.' },
    { q: 'Est-ce permanent ?', a: 'Non, par moments. Surtout quand je regarde loin, dans le vide, ou quand je suis crevé.' },
    { q: 'Fermez-vous un œil au soleil ?', a: 'Oui, tout le temps ! Je pensais que c’était normal.' },
    { q: 'Voyez-vous double ?', a: 'Jamais.' },
    { q: 'Est-ce gênant socialement ?', a: 'Oui, on me fait des remarques, ça me complexe.' }
  ],
  sim: {
    acuity: { odFar: 1.0, osFar: 1.0, odNear: 1.0, osNear: 1.0 },
    refraction: { od: { sph: -0.5, cyl: 0, axis: 0 }, os: { sph: -0.75, cyl: 0, axis: 0 } },
    covertest: { farH: 30, farV: 0, nearH: 12, nearV: 0, manifest: true, intermittent: true, alternating: true, dominant: 'od' },
    ppc: { breakCm: 5, recoveryCm: 7 },
    fundus: { od: 'normal', os: 'normal' },
    motility: null, worth: 'fusion', bagolini: 'crn', stereo: 60, colorvision: 'normal'
  },
  tests: {
    acuity:    { relevant: true,  result: 'AV 10/10 ODG. Pas d’amblyopie (alternance libre).' },
    covertest: { relevant: true,  result: 'CT VL : exotropie intermittente de 30 Δ, contrôlée par moments. CT VP : exophorie-tropie de 12 Δ, bien contrôlée.' },
    prism:     { relevant: true,  result: 'Neutralisation : 30 Δ base interne de loin, 12 Δ de près. Après occlusion prolongée de 45 min : 32 Δ de près (démasque une exotropie basique).' },
    binocular: { relevant: true,  result: 'En phase de contrôle : Worth 4 points, TNO 60". En phase de déviation : neutralisation complète de l’œil dévié.' },
    ppc:       { relevant: true,  result: 'PPC : 5/7 cm — excellent, ce qui écarte une insuffisance de convergence.' },
    motility:  { relevant: true,  result: 'Ductions et versions normales, pas de syndrome A ou V significatif.' },
    phoropter: { relevant: true,  result: 'Myopie très faible : OD −0,50 ; OG −0,75.' },
    fundus:    { relevant: false, result: 'Normal.' },
    lancaster: { relevant: false, result: 'Peu contributif dans une déviation comitante.' },
    fields:    { relevant: false, result: 'Sans objet.' },
    colorvision:{ relevant: false, result: 'Normale.' }
  },
  diagnosis: {
    options: [
      'Exotropie intermittente, type excès de divergence',
      'Insuffisance de convergence',
      'Exotropie constante avec amblyopie',
      'Paralysie du III'
    ],
    correct: 0,
    exp: 'Déviation intermittente de loin très supérieure à celle de près, photophobie caractéristique (fermeture d’un œil au soleil), PPC normal, pas d’amblyopie : exotropie intermittente à prédominance de loin. Le test d’occlusion prolongée démasque souvent une forme « basique ».'
  },
  management: {
    options: [
      'Évaluer le contrôle (score de Newcastle) et la fréquence des phases de déviation',
      'Discuter une chirurgie si le contrôle se dégrade ou la gêne sociale est importante',
      'Surcorrection myopique / rééducation anti-suppression dans les formes bien contrôlées',
      'Occlusion à temps partiel de l’œil dominant comme traitement d’attente',
      'Prescription de prismes base externe permanents'
    ],
    correct: [0, 1, 2, 3],
    exp: 'La décision chirurgicale repose sur le contrôle de la déviation, pas seulement sur l’angle. Chez l’adolescent avec retentissement psychosocial et contrôle qui se dégrade, la chirurgie est légitime. Le traitement conservateur (surcorrection en −, occlusion à temps partiel, exercices anti-suppression) peut être proposé avant.'
  }
},

{
  id: 'c10',
  name: 'Hélène V.',
  age: 47,
  job: 'Cadre bancaire',
  motif: 'Je n’arrive plus à lire de près et mes bras ne sont plus assez longs.',
  difficulty: 1,
  tags: ['Presbytie', 'Réfraction'],
  anamnese: [
    { q: 'Depuis quand ?', a: 'Un an environ, ça empire nettement le soir.' },
    { q: 'Voyez-vous bien de loin ?', a: 'Parfaitement, je n’ai jamais eu de lunettes.' },
    { q: 'À quelle distance lisez-vous ?', a: 'Environ 40 cm normalement, mais là je suis à 55 cm.' },
    { q: 'Travaillez-vous sur écran ?', a: 'Oui, deux écrans à 70 cm toute la journée.' },
    { q: 'Des maux de tête ?', a: 'Oui, en fin de journée, autour des yeux.' }
  ],
  sim: {
    acuity: { odFar: 1.0, osFar: 1.0, odNear: 0.32, osNear: 0.32 },
    refraction: { od: { sph: 0.75, cyl: -0.25, axis: 90 }, os: { sph: 0.75, cyl: 0, axis: 0 } },
    covertest: { farH: -1, farV: 0, nearH: -3, nearV: 0, manifest: false, dominant: 'od' },
    ppc: { breakCm: 8, recoveryCm: 11 },
    fundus: { od: 'normal', os: 'normal' },
    motility: null, worth: 'fusion', bagolini: 'crn', stereo: 40, colorvision: 'normal'
  },
  tests: {
    acuity:    { relevant: true,  result: 'AV de loin 10/10 ODG sans correction. De près : P6 à 40 cm, améliorée à P2 avec +1,50.' },
    phoropter: { relevant: true,  result: 'Réfraction : OD +0,75 (−0,25 à 90°) ; OG +0,75 sph. Addition +1,50 pour 40 cm, +1,00 suffisant pour l’écran à 70 cm.' },
    covertest: { relevant: true,  result: 'Orthophorie de loin, exophorie physiologique de 3 Δ de près.' },
    ppc:       { relevant: false, result: 'PPC 8/11 cm — normal pour l’âge.' },
    binocular: { relevant: false, result: 'Worth 4 points, TNO 40". Vision binoculaire normale.' },
    motility:  { relevant: false, result: 'Normale.' },
    fundus:    { relevant: false, result: 'Normal.' },
    prism:     { relevant: false, result: 'Sans objet.' },
    lancaster: { relevant: false, result: 'Sans objet.' },
    fields:    { relevant: false, result: 'Sans objet.' },
    colorvision:{ relevant: false, result: 'Normale.' }
  },
  diagnosis: {
    options: [
      'Presbytie sur légère hypermétropie latente',
      'Insuffisance d’accommodation pathologique',
      'Myopie débutante',
      'Cataracte nucléaire'
    ],
    correct: 0,
    exp: 'À 47 ans, l’amplitude d’accommodation (Hofstetter minimum : 15 − 0,25 × 47 ≈ 3,25 D) ne permet plus de soutenir la lecture à 40 cm. La petite hypermétropie de +0,75 D, jusque-là compensée, se démasque et majore les symptômes.'
  },
  management: {
    options: [
      'Prescription d’une addition de près (+1,50) tenant compte de l’hypermétropie',
      'Proposer une correction intermédiaire dédiée à l’écran (+1,00) ou des verres de proximité',
      'Expliquer l’évolution normale de la presbytie et le renouvellement tous les 2 à 3 ans',
      'Rééducation orthoptique de l’accommodation',
      'Adresser en urgence pour suspicion de pathologie'
    ],
    correct: [0, 1, 2],
    exp: 'Presbytie physiologique : correction adaptée à chaque distance de travail et explication. La rééducation accommodative n’a pas d’intérêt sur une presbytie installée.'
  }
}

];
