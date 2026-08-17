/* ============================================================
   Générateur de cas cliniques inédits
   ------------------------------------------------------------
   Dix archétypes paramétrés : chaque tirage produit un patient
   différent (âge, latéralité, angles, réfraction, acuités,
   résultats d'examen) avec la même structure que les cas écrits.
   ============================================================ */
(function () {
  'use strict';

  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function q25(x) { return Math.round(x * 4) / 4; }
  function even(a, b) { return ri(a, b) * 2; }
  function shuffle(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function d(v) { return (v > 0 ? '+' : '') + v.toFixed(2); }
  function rx(s, c, ax) { return c ? d(s) + ' (' + d(c) + ' à ' + ax + '°)' : d(s) + ' sph'; }
  function tenth(v) { return (Math.round(v * 100) / 10).toString().replace('.', ',') + '/10'; }

  var FEM = ['Léa', 'Emma', 'Chloé', 'Manon', 'Sarah', 'Inès', 'Camille', 'Julie', 'Nadia', 'Hélène', 'Amina', 'Claire', 'Sophie', 'Lucie', 'Fatou', 'Jeanne', 'Louise', 'Yasmine'];
  var MASC = ['Tom', 'Lucas', 'Hugo', 'Nathan', 'Karim', 'Marc', 'Julien', 'Robert', 'Antoine', 'Yanis', 'Paul', 'Mehdi', 'Théo', 'Samir', 'Pierre', 'Adam', 'Louis', 'Malik'];
  var INIT = 'ABCDFGHJKLMNPRSTVZ'.split('');

  function jobFor(age) {
    if (age < 6) return pick(['Maternelle', 'Petite section', 'Grande section', 'Crèche puis maternelle']);
    if (age < 11) return pick(['CP', 'CE1', 'CE2', 'CM1', 'CM2']);
    if (age < 15) return pick(['Collégien(ne) en 6e', 'Collégien(ne) en 4e', 'Collégien(ne) en 3e']);
    if (age < 19) return pick(['Lycéen(ne) en seconde', 'Lycéen(ne) en première', 'Lycéen(ne) en terminale']);
    if (age < 26) return pick(['Étudiant(e) en droit', 'Étudiant(e) en STAPS', 'Étudiant(e) infirmier(ère)', 'Apprenti(e) pâtissier(ère)', 'Étudiant(e) en informatique', 'Étudiant(e) en histoire']);
    if (age < 63) return pick(['Développeur(se) web', 'Comptable', 'Infirmier(ère)', 'Chauffeur(se) de bus', 'Coiffeur(se)', 'Enseignant(e)', 'Menuisier(ère)', 'Aide-soignant(e)', 'Cadre commercial(e)', 'Agriculteur(rice)', 'Graphiste', 'Conducteur(rice) de travaux']);
    return pick(['Retraité(e), ancien(ne) enseignant(e)', 'Retraité(e), ancien(ne) artisan(e)', 'Retraité(e), ancien(ne) infirmier(ère)', 'Retraité(e), ancien(ne) agriculteur(rice)']);
  }

  var ALL_TESTS = ['acuity', 'phoropter', 'covertest', 'prism', 'motility', 'lancaster', 'binocular', 'ppc', 'fundus', 'colorvision', 'fields'];

  function mkTests(map) {
    var out = {};
    ALL_TESTS.forEach(function (t) {
      out[t] = map[t] || { relevant: false, result: 'Examen réalisé : sans particularité, sans apport diagnostique dans ce contexte.' };
    });
    return out;
  }

  var MUSCLE_NAME = { DL: 'droit latéral', DM: 'droit médial', DS: 'droit supérieur', DI: 'droit inférieur', OS: 'oblique supérieur', OI: 'oblique inférieur' };

  /* ============================================================
     Archétypes
     ============================================================ */
  var ARCHETYPES = [

  /* ---- 1. Insuffisance de convergence ---- */
  {
    id: 'ic', tags: ['Vision binoculaire', 'Rééducation'], difficulty: 1,
    ageRange: [14, 45],
    build: function (p) {
      var exoVP = even(5, 11);                     // 10 à 22
      var exoVL = ri(0, 3);
      var brk = ri(12, 26), rec = brk + ri(3, 9);
      var sph = pick([0, 0, 0.25, -0.25, 0.5]);
      var tno = pick([40, 60, 80]);
      var fb = ri(6, 10), fk = ri(11, 15), fr = ri(2, 6);
      return {
        motif: pick([
          'J’ai mal à la tête et je vois double en fin de journée quand je lis.',
          'Les lignes se dédoublent quand je révise trop longtemps.',
          'Je n’arrive plus à lire plus de vingt minutes, ça tire dans les yeux.'
        ]),
        anamnese: [
          { q: 'Depuis quand ressentez-vous ces troubles ?', a: 'Depuis ' + pick(['trois mois', 'six mois', 'presque un an']) + ', ça a commencé pendant une période de révisions.' },
          { q: 'À quel moment surviennent-ils ?', a: 'Toujours en lecture, après vingt ou trente minutes. De loin je n’ai jamais de gêne.' },
          { q: 'Voyez-vous double ?', a: 'Parfois les lignes se dédoublent côte à côte, et si je ferme un œil ça disparaît.' },
          { q: 'Portez-vous une correction ?', a: sph === 0 ? 'Non, je n’ai jamais eu de lunettes.' : 'Une petite correction, mais je ne la mets presque jamais.' },
          { q: 'Antécédents ou traitements ?', a: 'Rien de particulier, pas de traumatisme, pas de traitement.' }
        ],
        sim: {
          acuity: { odFar: 1.0, osFar: 1.0 },
          refraction: { od: { sph: sph, cyl: 0, axis: 0 }, os: { sph: sph, cyl: 0, axis: 0 } },
          covertest: { farH: exoVL, farV: 0, nearH: exoVP, nearV: 0, manifest: false, dominant: 'od' },
          ppc: { breakCm: brk, recoveryCm: rec },
          motility: null, worth: 'fusion', bagolini: 'crn', stereo: tno,
          fusion: { BE: { blur: fb, brk: fk, rec: fr } },
          colorvision: 'normal', fundus: { od: 'normal', os: 'normal' }
        },
        tests: mkTests({
          acuity: { relevant: true, result: 'AV de loin 10/10 ODG, de près P2 ODG. Aucune baisse d’acuité.' },
          phoropter: { relevant: true, result: 'Réfraction subjective : ' + rx(sph, 0, 0) + ' aux deux yeux. Pas d’amétropie significative.' },
          covertest: { relevant: true, result: 'CT VL : ' + (exoVL < 2 ? 'orthophorie' : 'exophorie de ' + exoVL + ' Δ') + '. CT VP : exophorie de ' + exoVP + ' Δ, recouvrement lent et incomplet.' },
          prism: { relevant: true, result: 'Neutralisation : ' + exoVL + ' Δ base interne de loin, ' + exoVP + ' Δ base interne de près.' },
          ppc: { relevant: true, result: 'PPC : rupture à ' + brk + ' cm, recouvrement à ' + rec + ' cm. Nettement pathologique.' },
          binocular: { relevant: true, result: 'Worth 4 points de loin et de près. TNO ' + tno + '″. Convergence fusionnelle VP effondrée : ' + fb + '/' + fk + '/' + fr + ' Δ.' },
          motility: { relevant: true, result: 'Ductions et versions libres et symétriques, pas d’incomitance.' }
        }),
        diagnosis: { label: 'Insuffisance de convergence', exp: 'Exophorie de près (' + exoVP + ' Δ) nettement supérieure à celle de loin, PPC à ' + brk + ' cm, réserves de convergence effondrées, symptômes strictement en vision de près : c’est le tableau typique. Le rapport AC/A est bas.' },
        management: {
          good: ['Rééducation orthoptique de la convergence, avec exercices quotidiens à domicile', 'Conseils d’hygiène visuelle : pauses régulières, distance et éclairage de lecture'],
          bad: ['Chirurgie des droits médiaux d’emblée', 'Prescription de prismes base externe en première intention', 'Correction optique forte en + pour la lecture'],
          exp: 'Le traitement de référence est la rééducation orthoptique, très efficace dans l’insuffisance de convergence isolée, associée aux conseils d’hygiène visuelle. Les prismes ne viennent qu’en cas d’échec et la chirurgie reste exceptionnelle.'
        }
      };
    }
  },

  /* ---- 2. Ésotropie accommodative ---- */
  {
    id: 'esoaccom', tags: ['Strabisme', 'Pédiatrie'], difficulty: 2,
    ageRange: [3, 7],
    build: function (p) {
      var hyp = q25(3 + Math.random() * 3);          // +3.00 à +6.00
      var esoVL = even(4, 9), esoVP = esoVL + even(4, 9);
      var av = pick([0.7, 0.8, 0.8, 1.0]);
      return {
        motif: pick([
          'Sa maîtresse a remarqué qu’il louche, surtout quand il regarde ses livres.',
          'On trouve qu’un œil part en dedans quand il est fatigué.',
          'Depuis quelques mois il louche par moments, on s’inquiète.'
        ]),
        anamnese: [
          { q: 'Depuis quand voit-on cette déviation ?', a: 'Le parent : « Depuis ses ' + pick(['2 ans', '2 ans et demi', '3 ans']) + ' environ, ça va et vient. C’est pire quand il est fatigué. »' },
          { q: 'Est-ce toujours le même œil qui dévie ?', a: 'Le parent : « Non, tantôt l’un tantôt l’autre. »' },
          { q: 'Antécédents familiaux ?', a: 'Le parent : « Son père est très hypermétrope et a été opéré d’un strabisme enfant. »' },
          { q: 'Grossesse et développement ?', a: 'Le parent : « Terme normal, tout va bien par ailleurs. »' },
          { q: 'Se plaint-il de voir double ?', a: 'Le parent : « Non, jamais. »' }
        ],
        sim: {
          acuity: { odFar: av, osFar: av },
          refraction: { od: { sph: hyp, cyl: 0, axis: 0 }, os: { sph: q25(hyp - 0.25), cyl: -0.5, axis: 180 } },
          covertest: { farH: -esoVL, farV: 0, nearH: -esoVP, nearV: 0, manifest: true, alternating: true, dominant: 'od' },
          ppc: { breakCm: ri(5, 8), recoveryCm: ri(9, 12) },
          motility: null, worth: 'alt', bagolini: 'alt', stereo: null, colorvision: 'normal', fundus: { od: 'normal', os: 'normal' }
        },
        tests: mkTests({
          acuity: { relevant: true, result: 'AV avec images adaptées à l’âge : ' + tenth(av) + ' aux deux yeux, alternance spontanée. Pas d’amblyopie franche.' },
          phoropter: { relevant: true, result: 'Réfraction sous cycloplégie : OD ' + rx(hyp, 0, 0) + ' ; OG ' + rx(q25(hyp - 0.25), -0.5, 180) + '. Hypermétropie forte.' },
          covertest: { relevant: true, result: 'CT VL : ésotropie alternante de ' + esoVL + ' Δ. CT VP : ' + esoVP + ' Δ. Angle de près nettement supérieur.' },
          prism: { relevant: true, result: 'Neutralisation : ' + esoVL + ' Δ base externe de loin, ' + esoVP + ' Δ base externe de près.' },
          motility: { relevant: true, result: 'Ductions et versions normales, pas de limitation de l’abduction. Déviation comitante.' },
          fundus: { relevant: true, result: 'Fond d’œil normal aux deux yeux — élimine un strabisme sensoriel.' },
          binocular: { relevant: true, result: 'Worth VP : alternance 2 points rouges / 3 points verts. TNO non mesurable.' }
        }),
        diagnosis: { label: 'Ésotropie accommodative avec excès de convergence', exp: 'Début vers 2–3 ans, hypermétropie de ' + d(hyp) + ', angle de près (' + esoVP + ' Δ) très supérieur à l’angle de loin (' + esoVL + ' Δ) donc AC/A élevé, déviation comitante sans limitation : ésotropie accommodative. L’ésotropie congénitale, elle, débute avant 6 mois avec un grand angle stable.' },
        management: {
          good: ['Correction optique totale de l’hypermétropie, portée en permanence', 'Réévaluation de l’angle 4 à 6 semaines après le port de la correction', 'Envisager un double foyer ou des progressifs si l’angle de près reste supérieur'],
          bad: ['Chirurgie immédiate des droits médiaux', 'Occlusion 6 h/j en urgence'],
          exp: 'La correction optique totale sous cycloplégie est la première étape et suffit souvent à neutraliser l’angle. Un excès de convergence résiduel relève d’une addition de près. Sans amblyopie (alternance libre), pas d’occlusion ; la chirurgie ne se discute qu’après échec de la correction.'
        }
      };
    }
  },

  /* ---- 3. Paralysie du VI ---- */
  {
    id: 'vi', tags: ['Paralysie', 'Urgence relative'], difficulty: 2,
    ageRange: [42, 78],
    build: function (p) {
      var eye = pick(['od', 'os']);
      var E = eye === 'od' ? 'droit' : 'gauche', EU = eye.toUpperCase();
      var vl = even(7, 16), vp = Math.round(vl * (0.4 + Math.random() * 0.2));
      var gazeSame = vl + even(4, 8), gazeOpp = Math.max(2, vl - even(5, 8));
      var cause = pick(['un diabète de type 2 mal équilibré et une hypertension', 'une hypertension artérielle ancienne', 'un diabète de type 2 découvert récemment']);
      return {
        motif: 'Je vois double depuis ' + pick(['une dizaine de jours', 'deux semaines', 'trois semaines']) + ', surtout quand je regarde au loin.',
        anamnese: [
          { q: 'Comment est apparue la diplopie ?', a: 'Du jour au lendemain, un matin en me levant.' },
          { q: 'Les images sont-elles côte à côte ou l’une au-dessus de l’autre ?', a: 'Côte à côte, horizontalement.' },
          { q: 'Dans quelle direction est-ce le pire ?', a: 'Quand je regarde vers la ' + E + ' et au loin. De près ça va presque.' },
          { q: 'Avez-vous des antécédents ?', a: 'J’ai ' + cause + '.' },
          { q: 'Avez-vous mal à la tête ?', a: pick(['Un peu autour de l’œil les premiers jours, plus maintenant.', 'Non, aucune douleur.']) }
        ],
        sim: {
          acuity: { odFar: 1.0, osFar: 1.0 },
          refraction: { od: { sph: 0.5, cyl: -0.25, axis: 90 }, os: { sph: 0.75, cyl: -0.5, axis: 85 } },
          covertest: { farH: -vl, farV: 0, nearH: -vp, nearV: 0, manifest: true, dominant: eye === 'od' ? 'os' : 'od' },
          ppc: { breakCm: 8, recoveryCm: 12 },
          motility: { eye: eye, muscle: 'DL', severity: 0.55 },
          worth: 'dipl-eso', bagolini: 'cross', stereo: null, colorvision: 'normal',
          fundus: { od: 'normal', os: 'normal' }
        },
        tests: mkTests({
          acuity: { relevant: true, result: 'AV 10/10 ODG avec correction. Pas de baisse d’acuité.' },
          covertest: { relevant: true, result: 'CT VL : ésotropie ' + EU + ' de ' + vl + ' Δ. CT VP : ' + vp + ' Δ. Déviation nettement plus grande de loin.' },
          prism: { relevant: true, result: 'Neutralisation : ' + vl + ' Δ base externe VL, ' + vp + ' Δ VP ; ' + gazeSame + ' Δ en regard vers la ' + E + ', ' + gazeOpp + ' Δ du côté opposé.' },
          motility: { relevant: true, result: 'Limitation franche de l’abduction de l’œil ' + E + ' (−3). Toutes les autres ductions sont libres.' },
          lancaster: { relevant: true, result: 'Schéma rétréci en horizontal du côté ' + E + ', écartement maximal dans le regard homolatéral. Déviation secondaire > primaire.' },
          binocular: { relevant: true, result: 'Diplopie homonyme horizontale, maximale en regard vers la ' + E + '. Pas de neutralisation.' },
          phoropter: { relevant: true, result: 'Réfraction sans particularité, presbytie à corriger.' },
          fundus: { relevant: true, result: 'Fond d’œil : recherche d’un œdème papillaire (négatif ici) et de signes vasculaires du terrain.' }
        }),
        diagnosis: { label: 'Paralysie du VI ' + E, exp: 'Diplopie horizontale brutale, ésotropie majorée de loin et en regard du côté atteint, limitation isolée de l’abduction : paralysie du VI ' + E + '. Le terrain vasculaire oriente vers une origine microvasculaire.' },
        management: {
          good: ['Adresser à l’ophtalmologiste et rechercher/traiter la cause (bilan vasculaire, imagerie si atypique)', 'Occlusion alternée ou prisme de Fresnel pour supprimer la diplopie en attendant', 'Surveillance de la récupération sur 3 à 6 mois avant toute chirurgie'],
          bad: ['Chirurgie de recul du droit médial dans la semaine', 'Rééducation intensive de la convergence'],
          exp: 'Une paralysie du VI microvasculaire régresse le plus souvent en 3 à 6 mois. On soulage la diplopie, on traite la cause, et on ne discute la chirurgie ou la toxine botulique qu’après stabilisation. Penser aussi à l’aptitude à la conduite.'
        }
      };
    }
  },

  /* ---- 4. Paralysie du IV ---- */
  {
    id: 'iv', tags: ['Paralysie', 'Verticale'], difficulty: 3,
    ageRange: [18, 60],
    build: function (p) {
      var eye = pick(['od', 'os']);
      var E = eye === 'od' ? 'droit' : 'gauche', EU = eye.toUpperCase();
      var opp = eye === 'od' ? 'gauche' : 'droite';
      var vl = ri(4, 9), tilt = vl + ri(4, 9), gaze = vl + ri(4, 8);
      var context = pick(['une chute à vélo il y a trois semaines', 'un traumatisme crânien léger il y a un mois', 'un choc à la tête il y a six semaines']);
      return {
        motif: 'Depuis ' + context + ', je vois double en descendant les escaliers.',
        anamnese: [
          { q: 'Comment sont disposées les deux images ?', a: 'L’une au-dessus de l’autre, et un peu penchée l’une par rapport à l’autre.' },
          { q: 'Quand est-ce le plus gênant ?', a: 'Quand je regarde en bas : les escaliers, la lecture. Et quand je penche la tête à ' + (eye === 'od' ? 'droite' : 'gauche') + '.' },
          { q: 'Avez-vous une position de tête particulière ?', a: 'On me dit que je penche la tête vers la ' + opp + ' sans m’en rendre compte.' },
          { q: 'Que s’est-il passé exactement ?', a: 'J’ai eu ' + context + ', avec quelques secondes de perte de connaissance. L’imagerie était normale.' },
          { q: 'La gêne évolue-t-elle ?', a: 'C’était pire au début, ça s’améliore un peu.' }
        ],
        sim: {
          acuity: { odFar: 1.0, osFar: 1.0 },
          refraction: { od: { sph: -1.0, cyl: 0, axis: 0 }, os: { sph: -1.25, cyl: -0.25, axis: 175 } },
          covertest: { farH: 0, farV: eye === 'od' ? vl : -vl, nearH: -3, nearV: eye === 'od' ? vl + 2 : -(vl + 2), manifest: true, dominant: eye === 'od' ? 'os' : 'od' },
          ppc: { breakCm: 7, recoveryCm: 10 },
          motility: { eye: eye, muscle: 'OS', severity: 0.5 },
          worth: 'dipl-vert', bagolini: 'cross', stereo: null, colorvision: 'normal',
          fundus: { od: 'normal', os: 'normal' }
        },
        tests: mkTests({
          acuity: { relevant: true, result: 'AV 10/10 ODG avec correction. Acuité conservée.' },
          covertest: { relevant: true, result: 'CT VL : hypertropie ' + EU + ' de ' + vl + ' Δ. CT VP : ' + (vl + 2) + ' Δ avec une petite exodéviation associée.' },
          prism: { relevant: true, result: 'Neutralisation : ' + vl + ' Δ base inférieure devant l’œil ' + E + ' de loin ; ' + gaze + ' Δ en regard opposé, ' + Math.max(1, vl - 4) + ' Δ du côté homolatéral.' },
          motility: { relevant: true, result: 'Hypo-action de l’oblique supérieur ' + E + ' (−2) en adduction, hyperaction de l’oblique inférieur homolatéral (+2).' },
          lancaster: { relevant: true, result: 'Schéma de l’œil ' + E + ' décalé vers le haut, écart maximal en bas et du côté opposé.' },
          binocular: { relevant: true, result: 'Diplopie verticale et torsionnelle. Manœuvre de Bielschowsky : hypertropie majorée à ' + tilt + ' Δ en inclinaison du côté ' + E + '.' },
          phoropter: { relevant: true, result: 'Myopie légère bilatérale, sans incidence sur le tableau moteur.' }
        }),
        diagnosis: { label: 'Paralysie de l’oblique supérieur ' + E + ' (IV ' + E + ')', exp: 'Les 3 pas de Parks : hypertropie ' + EU + ', majorée dans le regard opposé, majorée en inclinaison homolatérale → oblique supérieur ' + E + '. Torticolis tête inclinée du côté opposé et diplopie torsionnelle complètent le tableau.' },
        management: {
          good: ['Attendre la stabilisation (environ 6 mois) avant d’envisager une chirurgie', 'Prisme base inférieure devant l’œil hypertropique pour compenser la diplopie en position primaire', 'Rechercher un torticolis ancien sur des photos d’enfance'],
          bad: ['Occlusion définitive de l’œil atteint', 'Rééducation de la convergence en première intention'],
          exp: 'Les paralysies du IV post-traumatiques récupèrent souvent partiellement en quelques mois. En attendant : prismes. Toujours chercher des photos anciennes : beaucoup de « paralysies traumatiques du IV » sont des formes congénitales décompensées (grandes amplitudes de fusion verticale en faveur du congénital).'
        }
      };
    }
  },

  /* ---- 5. Exotropie intermittente ---- */
  {
    id: 'xt', tags: ['Strabisme', 'Adolescent'], difficulty: 2,
    ageRange: [8, 28],
    build: function (p) {
      var eye = pick(['od', 'os']);
      var vl = even(9, 18), vp = Math.max(4, vl - even(4, 10));
      var stereoXT = pick([60, 80, 100]);
      return {
        motif: 'Mon œil part dehors quand je suis fatigué ou au soleil.',
        anamnese: [
          { q: 'Depuis quand ?', a: 'Depuis tout petit, mais ça s’aggrave depuis ' + pick(['un an', 'deux ans', 'quelques mois']) + '.' },
          { q: 'Est-ce permanent ?', a: 'Non, par moments. Surtout quand je regarde loin, dans le vide, ou quand je suis fatigué.' },
          { q: 'Fermez-vous un œil au soleil ?', a: 'Oui, tout le temps ! Je pensais que c’était normal.' },
          { q: 'Voyez-vous double ?', a: 'Jamais.' },
          { q: 'Est-ce gênant socialement ?', a: 'Oui, on me fait des remarques, ça me complexe.' }
        ],
        sim: {
          acuity: { odFar: 1.0, osFar: 1.0 },
          refraction: { od: { sph: -0.5, cyl: 0, axis: 0 }, os: { sph: -0.75, cyl: 0, axis: 0 } },
          covertest: { farH: vl, farV: 0, nearH: vp, nearV: 0, manifest: true, intermittent: true, alternating: true, dominant: eye },
          ppc: { breakCm: ri(4, 7), recoveryCm: ri(6, 10) },
          motility: null, worth: 'fusion', bagolini: 'crn', stereo: stereoXT, colorvision: 'normal', fundus: { od: 'normal', os: 'normal' }
        },
        tests: mkTests({
          acuity: { relevant: true, result: 'AV 10/10 ODG. Alternance libre, pas d’amblyopie.' },
          covertest: { relevant: true, result: 'CT VL : exotropie intermittente de ' + vl + ' Δ, contrôlée par moments. CT VP : exophorie-tropie de ' + vp + ' Δ, bien contrôlée.' },
          prism: { relevant: true, result: 'Neutralisation : ' + vl + ' Δ base interne de loin, ' + vp + ' Δ de près. Après occlusion prolongée de 45 min, l’angle de près monte à ' + (vl + ri(0, 4)) + ' Δ.' },
          binocular: { relevant: true, result: 'En phase de contrôle : Worth 4 points, TNO ' + stereoXT + '″. En phase de déviation : neutralisation complète de l’œil dévié.' },
          ppc: { relevant: true, result: 'PPC excellent, ce qui écarte une insuffisance de convergence.' },
          motility: { relevant: true, result: 'Ductions et versions normales, pas de syndrome A ou V significatif.' },
          phoropter: { relevant: true, result: 'Myopie très faible bilatérale.' }
        }),
        diagnosis: { label: 'Exotropie intermittente à prédominance de loin', exp: 'Déviation intermittente de loin (' + vl + ' Δ) supérieure à celle de près (' + vp + ' Δ), photophobie caractéristique avec fermeture d’un œil au soleil, PPC normal, pas d’amblyopie. Le test d’occlusion prolongée démasque souvent une forme « basique ».' },
        management: {
          good: ['Évaluer le contrôle de la déviation et la fréquence des phases de décompensation', 'Discuter la chirurgie si le contrôle se dégrade ou si la gêne sociale est importante', 'Exercices anti-suppression et surcorrection myopique dans les formes bien contrôlées', 'Occlusion à temps partiel de l’œil dominant comme traitement d’attente'],
          bad: ['Prescription de prismes base externe permanents', 'Rééducation de l’accommodation'],
          exp: 'La décision chirurgicale repose sur le contrôle, pas seulement sur la valeur de l’angle. Le traitement conservateur peut être proposé avant, surtout chez l’enfant.'
        }
      };
    }
  },

  /* ---- 6. Amblyopie anisométropique ---- */
  {
    id: 'amblyopie', tags: ['Amblyopie', 'Pédiatrie'], difficulty: 2,
    ageRange: [5, 9],
    build: function (p) {
      var eye = pick(['od', 'os']);
      var E = eye === 'od' ? 'droit' : 'gauche', EU = eye.toUpperCase(), OU = eye === 'od' ? 'OG' : 'OD';
      var hyp = q25(3.5 + Math.random() * 2.5);
      var av = pick([0.16, 0.2, 0.25, 0.32]);
      var micro = ri(3, 6);
      var stereoAmb = pick([240, 480]);
      return {
        motif: 'Elle a raté le dépistage scolaire : un œil voit beaucoup moins bien.',
        anamnese: [
          { q: 'Se plaint-elle de quelque chose ?', a: 'Le parent : « Non, jamais. Elle ne s’est aperçue de rien. »' },
          { q: 'Louche-t-elle ?', a: 'Le parent : « Pas du tout, on n’a jamais rien remarqué. »' },
          { q: 'A-t-elle déjà été vue par un ophtalmologiste ?', a: 'Le parent : « Non, c’est la première fois. »' },
          { q: 'Comment se passe l’école ?', a: 'Le parent : « Très bien, elle lit bien. »' },
          { q: 'Antécédents familiaux ?', a: 'Le parent : « Son frère porte des lunettes depuis 4 ans. »' }
        ],
        sim: {
          acuity: eye === 'od' ? { odFar: av, osFar: 1.0 } : { odFar: 1.0, osFar: av },
          refraction: eye === 'od'
            ? { od: { sph: hyp, cyl: -1.5, axis: 10 }, os: { sph: 0.5, cyl: -0.25, axis: 180 } }
            : { od: { sph: 0.5, cyl: -0.25, axis: 180 }, os: { sph: hyp, cyl: -1.5, axis: 10 } },
          covertest: { farH: eye === 'od' ? -micro : -micro, farV: 0, nearH: -micro, nearV: 0, manifest: true, microtropia: true, dominant: eye === 'od' ? 'os' : 'od' },
          ppc: { breakCm: 7, recoveryCm: 10 },
          motility: null, worth: 'fusion', bagolini: 'gap', stereo: stereoAmb, colorvision: 'normal', fundus: { od: 'normal', os: 'normal' }
        },
        tests: mkTests({
          acuity: { relevant: true, result: 'AV sans correction : ' + EU + ' ' + tenth(av) + ', ' + OU + ' 10/10. Écart majeur, sans plainte fonctionnelle.' },
          phoropter: { relevant: true, result: 'Sous cycloplégie : ' + EU + ' ' + rx(hyp, -1.5, 10) + ' ; ' + OU + ' ' + rx(0.5, -0.25, 180) + '. Anisométropie de ' + d(hyp - 0.5).replace('+', '') + ' D.' },
          covertest: { relevant: true, result: 'CT unilatéral : micro-mouvement de refixation de l’œil ' + E + '. Microtropie de ' + micro + ' Δ avec dominance de l’autre œil.' },
          binocular: { relevant: true, result: 'Worth 4 points. TNO ' + stereoAmb + '″ seulement : stéréoscopie fruste, compatible avec une microtropie.' },
          fundus: { relevant: true, result: 'Fond d’œil normal aux deux yeux — élimine une cause organique à l’amblyopie.' },
          motility: { relevant: true, result: 'Ductions et versions normales.' }
        }),
        diagnosis: { label: 'Amblyopie anisométropique de l’œil ' + E, exp: 'Anisométropie hypermétropique importante, absence de strabisme visible, microtropie retrouvée au cover test unilatéral, fond d’œil normal : amblyopie fonctionnelle anisométropique. Le pronostic reste bon à cet âge mais la fenêtre thérapeutique se referme.' },
        management: {
          good: ['Correction optique totale portée en permanence, réévaluation à 6 semaines', 'Occlusion de l’œil dominant (2 à 6 h/j selon la profondeur) après la phase de correction seule', 'Surveillance rapprochée du risque d’amblyopie à bascule'],
          bad: ['Chirurgie de la microtropie', 'Rééducation de la convergence en priorité'],
          exp: 'Correction totale d’abord — elle apporte à elle seule plusieurs lignes — puis occlusion si l’acuité reste basse, avec contrôle du risque d’amblyopie à bascule. La microtropie ne s’opère pas.'
        }
      };
    }
  },

  /* ---- 7. Presbytie ---- */
  {
    id: 'presbytie', tags: ['Presbytie', 'Réfraction'], difficulty: 1,
    ageRange: [44, 58],
    build: function (p) {
      var hyp = pick([0.5, 0.75, 1.0, 1.25]);
      var add = q25(Math.max(1, (p.age - 40) * 0.13 + 0.75));
      return {
        motif: 'Je n’arrive plus à lire de près et mes bras ne sont plus assez longs.',
        anamnese: [
          { q: 'Depuis quand ?', a: pick(['Un an environ', 'Six mois', 'Deux ans']) + ', ça empire nettement le soir.' },
          { q: 'Voyez-vous bien de loin ?', a: 'Parfaitement, je n’ai jamais eu de lunettes.' },
          { q: 'À quelle distance lisez-vous ?', a: 'Environ 40 cm normalement, mais là je suis à ' + ri(50, 60) + ' cm.' },
          { q: 'Travaillez-vous sur écran ?', a: 'Oui, ' + pick(['deux écrans à 70 cm', 'un écran à 60 cm']) + ' toute la journée.' },
          { q: 'Des maux de tête ?', a: 'Oui, en fin de journée, autour des yeux.' }
        ],
        sim: {
          acuity: { odFar: 1.0, osFar: 1.0 },
          refraction: { od: { sph: hyp, cyl: -0.25, axis: 90 }, os: { sph: hyp, cyl: 0, axis: 0 } },
          covertest: { farH: 1, farV: 0, nearH: 3, nearV: 0, manifest: false, dominant: 'od' },
          ppc: { breakCm: 8, recoveryCm: 11 },
          motility: null, worth: 'fusion', bagolini: 'crn', stereo: 40, colorvision: 'normal', fundus: { od: 'normal', os: 'normal' }
        },
        tests: mkTests({
          acuity: { relevant: true, result: 'AV de loin 10/10 ODG sans correction. De près P6 à 40 cm, améliorée à P2 avec ' + d(add) + '.' },
          phoropter: { relevant: true, result: 'Réfraction : ' + rx(hyp, -0.25, 90) + ' / ' + rx(hyp, 0, 0) + '. Addition ' + d(add) + ' pour 40 cm, ' + d(q25(add - 0.5)) + ' suffisante pour l’écran.' },
          covertest: { relevant: true, result: 'Orthophorie de loin, exophorie physiologique de 3 Δ de près.' }
        }),
        diagnosis: { label: 'Presbytie sur légère hypermétropie latente', exp: 'À ' + p.age + ' ans, l’amplitude d’accommodation (Hofstetter minimum : 15 − 0,25 × ' + p.age + ' ≈ ' + (15 - 0.25 * p.age).toFixed(2) + ' D) ne permet plus de soutenir la lecture à 40 cm. La petite hypermétropie de ' + d(hyp) + ', jusque-là compensée, se démasque et majore les symptômes.' },
        management: {
          good: ['Prescription d’une addition de près tenant compte de l’hypermétropie', 'Proposer une correction intermédiaire dédiée à l’écran ou des verres de proximité', 'Expliquer l’évolution normale de la presbytie et le renouvellement tous les 2 à 3 ans'],
          bad: ['Rééducation orthoptique de l’accommodation', 'Adresser en urgence pour suspicion de pathologie'],
          exp: 'Presbytie physiologique : correction adaptée à chaque distance de travail et explication. La rééducation accommodative n’a pas d’intérêt sur une presbytie installée.'
        }
      };
    }
  },

  /* ---- 8. DMLA exsudative ---- */
  {
    id: 'dmla', tags: ['Rétine', 'Basse vision'], difficulty: 2,
    ageRange: [68, 88],
    build: function (p) {
      var eye = pick(['od', 'os']);
      var E = eye === 'od' ? 'droit' : 'gauche', EU = eye.toUpperCase(), OU = eye === 'od' ? 'OG' : 'OD';
      var av = pick([0.05, 0.1, 0.16]);
      var other = pick([0.5, 0.63, 0.8]);
      return {
        motif: 'Les lignes droites sont déformées avec mon œil ' + E + ', et j’ai une tache au milieu.',
        anamnese: [
          { q: 'Depuis quand ?', a: pick(['Trois semaines', 'Quinze jours', 'Un mois']) + ' environ, et ça s’aggrave vite.' },
          { q: 'Un ou deux yeux ?', a: 'Surtout le ' + E + '. Je m’en suis rendu compte en fermant l’autre.' },
          { q: 'Les lignes sont-elles ondulées ?', a: 'Oui, les carreaux de ma cuisine sont tordus.' },
          { q: 'Antécédents ?', a: pick(['Je fume depuis 50 ans. Ma mère avait la DMLA.', 'Ma sœur est suivie pour une DMLA.', 'Je fumais beaucoup avant.']) },
          { q: 'Votre vision de loin est-elle touchée ?', a: 'Je ne reconnais plus les visages de loin avec cet œil.' }
        ],
        sim: {
          acuity: eye === 'od' ? { odFar: av, osFar: other } : { odFar: other, osFar: av },
          refraction: { od: { sph: 2.0, cyl: -0.75, axis: 95 }, os: { sph: 2.25, cyl: -1.0, axis: 85 } },
          covertest: { farH: 0, farV: 0, nearH: 2, nearV: 0, manifest: false, dominant: eye === 'od' ? 'os' : 'od' },
          ppc: { breakCm: 9, recoveryCm: 12 },
          fundus: eye === 'od' ? { od: 'dmla', os: 'drusen' } : { od: 'drusen', os: 'dmla' },
          fields: { od: eye === 'od' ? 'central' : 'normal', os: eye === 'os' ? 'central' : 'normal' },
          amsler: 'meta', motility: null, worth: 'fusion', bagolini: 'crn', stereo: null, colorvision: 'by'
        },
        tests: mkTests({
          acuity: { relevant: true, result: 'AV corrigée : ' + EU + ' ' + tenth(av) + ', ' + OU + ' ' + tenth(other) + '. Baisse majeure et récente d’un côté.' },
          phoropter: { relevant: true, result: 'Réfraction hypermétropique modérée, mais la correction n’améliore pas l’œil atteint : la baisse n’est pas réfractive.' },
          fields: { relevant: true, result: 'Grille d’Amsler ' + EU + ' : métamorphopsies centrales et scotome relatif paracentral. Autre œil : quelques ondulations discrètes.' },
          fundus: { relevant: true, result: EU + ' : soulèvement maculaire, hémorragie sous-rétinienne et exsudats — néovascularisation choroïdienne. ' + OU + ' : drusen séreux confluents.' },
          colorvision: { relevant: true, result: 'Dyschromatopsie d’axe bleu-jaune du côté atteint, comme attendu dans une maculopathie.' }
        }),
        diagnosis: { label: 'DMLA exsudative sur DMLA sèche bilatérale', exp: 'Métamorphopsies d’installation rapide, scotome central, baisse d’acuité majeure unilatérale, drusen controlatéraux et terrain (âge, tabac, hérédité) : DMLA exsudative. L’OCT et l’angiographie confirmeront la néovascularisation.' },
        management: {
          good: ['Adresser en urgence (moins de 8 jours) pour OCT et traitement anti-VEGF', 'Remettre une grille d’Amsler pour l’autosurveillance de l’œil controlatéral', 'Conseils : arrêt du tabac, supplémentation discutée avec l’ophtalmologiste', 'Bilan et prise en charge basse vision (aides optiques, éclairage, fixation excentrée)'],
          bad: ['Prescrire des prismes de compensation', 'Programmer un simple contrôle dans six mois'],
          exp: 'La DMLA exsudative est une urgence thérapeutique : chaque semaine de retard coûte des lettres définitivement perdues. L’orthoptiste a un rôle majeur dans l’autosurveillance, l’éducation et la rééducation basse vision.'
        }
      };
    }
  },

  /* ---- 9. Glaucome chronique ---- */
  {
    id: 'glaucome', tags: ['Glaucome', 'Exploration'], difficulty: 3,
    ageRange: [55, 80],
    build: function (p) {
      var myop = pick([-6, -5, -4.5, -7]);
      var cd1 = pick([0.6, 0.65]), cd2 = pick([0.8, 0.85, 0.9]);
      return {
        motif: 'Mon ophtalmologiste a trouvé une tension oculaire élevée et veut un champ visuel.',
        anamnese: [
          { q: 'Avez-vous des symptômes ?', a: 'Aucun, je vois très bien. C’est ça qui m’étonne.' },
          { q: 'Antécédents familiaux ?', a: 'Mon père a été opéré d’un glaucome et a beaucoup perdu la vue.' },
          { q: 'Traitements ?', a: 'On vient de me mettre un collyre le soir depuis un mois.' },
          { q: 'Êtes-vous myope ?', a: 'Oui, ' + myop + ' dioptries depuis l’adolescence.' },
          { q: 'Avez-vous des accrochages, des chutes ?', a: 'Je bute parfois sur des objets sur le côté, oui, maintenant que vous le dites.' }
        ],
        sim: {
          acuity: { odFar: 1.0, osFar: 0.8 },
          refraction: { od: { sph: myop, cyl: -0.5, axis: 175 }, os: { sph: myop - 0.5, cyl: -0.75, axis: 5 } },
          covertest: { farH: 4, farV: 0, nearH: 6, nearV: 0, manifest: false, dominant: 'od' },
          ppc: { breakCm: 9, recoveryCm: 12 },
          fundus: { od: 'glaucome', os: 'glaucome_avance' },
          fields: { od: 'bjerrum', os: 'altitudinal' },
          motility: null, worth: 'fusion', bagolini: 'crn', stereo: 60, colorvision: 'normal'
        },
        tests: mkTests({
          acuity: { relevant: true, result: 'AV corrigée : OD 10/10, OG 8/10. L’acuité centrale reste longtemps conservée dans le glaucome.' },
          fields: { relevant: true, result: 'Périmétrie automatisée : OD scotome arciforme de Bjerrum supérieur ; OG ressaut nasal marqué et déficit altitudinal étendu.' },
          fundus: { relevant: true, result: 'Excavation papillaire : C/D ' + cd1 + ' OD et ' + cd2 + ' OG, encoche du bord neuro-rétinien inférieur à gauche, asymétrie nette.' },
          phoropter: { relevant: true, result: 'Myopie forte bilatérale — facteur de risque reconnu de glaucome.' }
        }),
        diagnosis: { label: 'Glaucome primitif à angle ouvert', exp: 'Déficits arciformes respectant le méridien horizontal, ressaut nasal, excavation papillaire asymétrique avec encoche, terrain (hérédité, myopie forte, âge) : glaucome chronique à angle ouvert. L’acuité centrale conservée est typique.' },
        management: {
          good: ['Champs visuels de suivi réguliers pour évaluer la vitesse de progression', 'Insister sur l’observance du collyre — principal facteur d’échec', 'Rappeler la nécessité de dépister la fratrie et les enfants'],
          bad: ['Rééducation orthoptique de la convergence', 'Occlusion de l’œil le plus atteint'],
          exp: 'Le rôle de l’orthoptiste est central : réalisation et fiabilité des champs visuels, suivi de la progression, éducation thérapeutique sur l’observance, rappel du dépistage familial (risque multiplié par 3 à 5 chez les apparentés).'
        }
      };
    }
  },

  /* ---- 10. Amétropie non corrigée + asthénopie écran ---- */
  {
    id: 'ecran', tags: ['Réfraction', 'Écran'], difficulty: 1,
    ageRange: [20, 42],
    build: function (p) {
      var sph = q25(-(1 + Math.random() * 2.5));
      var cyl = pick([0, -0.5, -0.75, -1.0]);
      var ax = pick([180, 175, 10, 5, 90]);
      var av = pick([0.1, 0.16, 0.2, 0.25]);
      return {
        motif: 'Je vois flou de loin depuis quelques mois et j’ai mal aux yeux devant l’écran.',
        anamnese: [
          { q: 'Le flou est-il constant ?', a: 'De loin oui, surtout le soir. De près je vois très bien.' },
          { q: 'Portez-vous une correction ?', a: pick(['Des lunettes achetées il y a 5 ans, je ne les mets presque plus.', 'Non, jamais eu de lunettes.']) },
          { q: 'Combien d’heures d’écran par jour ?', a: ri(7, 11) + ' heures, plus le téléphone.' },
          { q: 'Avez-vous les yeux qui piquent ?', a: 'Oui, secs et rouges en fin de journée.' },
          { q: 'Des maux de tête ?', a: 'Frontaux, en fin de journée.' }
        ],
        sim: {
          acuity: { odFar: av, osFar: q25(av - 0.04) },
          refraction: { od: { sph: sph, cyl: cyl, axis: ax }, os: { sph: q25(sph - 0.5), cyl: cyl, axis: (ax + 5) % 180 || 180 } },
          covertest: { farH: 1, farV: 0, nearH: 7, nearV: 0, manifest: false, dominant: 'od' },
          ppc: { breakCm: ri(8, 11), recoveryCm: ri(11, 14) },
          motility: null, worth: 'fusion', bagolini: 'crn', stereo: 30, colorvision: 'normal', fundus: { od: 'normal', os: 'normal' }
        },
        tests: mkTests({
          acuity: { relevant: true, result: 'AV sans correction : OD ' + tenth(av) + ', OG ' + tenth(q25(av - 0.04)) + '. De près P2 sans correction.' },
          phoropter: { relevant: true, result: 'Réfraction subjective : OD ' + rx(sph, cyl, ax) + ' = 10/10 ; OG ' + rx(q25(sph - 0.5), cyl, (ax + 5) % 180 || 180) + ' = 10/10.' },
          covertest: { relevant: true, result: 'CT VL : orthophorie. CT VP : exophorie de 7 Δ bien compensée.' },
          ppc: { relevant: true, result: 'PPC à la limite supérieure de la norme, sans caractère franchement pathologique.' },
          binocular: { relevant: true, result: 'Worth 4 points, TNO 30″. Réserves de convergence un peu justes mais dans les normes.' },
          fundus: { relevant: true, result: 'Fond d’œil normal — contrôle de la périphérie utile chez un myope.' }
        }),
        diagnosis: { label: 'Amétropie non corrigée avec fatigue visuelle numérique', exp: 'Myopie avec astigmatisme jamais corrigée correctement, associée à une exposition écran majeure : le tableau est celui de l’asthénopie liée au travail sur écran. La convergence est limite mais pas franchement pathologique.' },
        management: {
          good: ['Prescription de la correction optique adaptée, portée pour la vision de loin et l’écran', 'Règle 20-20-20, réglage de la distance et de la hauteur d’écran, éclairage et clignements', 'Larmes artificielles si la sécheresse persiste'],
          bad: ['Rééducation orthoptique intensive de 20 séances', 'Prescription de prismes'],
          exp: 'La correction optique et l’ergonomie visuelle règlent l’essentiel. La rééducation ne serait justifiée que si le bilan binoculaire restait franchement pathologique après correction.'
        }
      };
    }
  }
  ];

  /* Distracteurs diagnostiques */
  var DECOYS = [
    'Insuffisance de convergence', 'Ésotropie congénitale', 'Ésotropie accommodative avec excès de convergence',
    'Paralysie du VI droit', 'Paralysie du VI gauche', 'Paralysie de l’oblique supérieur droit (IV droit)',
    'Paralysie de l’oblique supérieur gauche (IV gauche)', 'Paralysie du III', 'Syndrome de Duane type I',
    'Exotropie intermittente à prédominance de loin', 'Amblyopie de privation', 'Amblyopie anisométropique de l’œil droit',
    'Microtropie isolée sans amblyopie', 'Presbytie sur légère hypermétropie latente', 'Spasme accommodatif',
    'DMLA exsudative sur DMLA sèche bilatérale', 'Cataracte nucléaire', 'Glaucome primitif à angle ouvert',
    'Neuropathie optique ischémique antérieure', 'Occlusion de l’artère centrale de la rétine',
    'Amétropie non corrigée avec fatigue visuelle numérique', 'Rétinopathie diabétique œdémateuse',
    'Hémianopsie latérale homonyme', 'Insuffisance d’accommodation'
  ];

  var counter = 0;

  function generate(archetypeId) {
    var arch = archetypeId
      ? ARCHETYPES.filter(function (a) { return a.id === archetypeId; })[0]
      : pick(ARCHETYPES);
    var age = ri(arch.ageRange[0], arch.ageRange[1]);
    var fem = Math.random() < 0.5;
    var name = pick(fem ? FEM : MASC) + ' ' + pick(INIT) + '.';
    var p = { age: age, name: name, fem: fem };
    var b = arch.build(p);

    /* options de diagnostic */
    var wrong = shuffle(DECOYS.filter(function (x) { return x !== b.diagnosis.label; })).slice(0, 3);
    var dxOpts = shuffle([b.diagnosis.label].concat(wrong));

    /* options de conduite à tenir */
    var mgOpts = shuffle(b.management.good.concat(b.management.bad));
    var correctIdx = b.management.good.map(function (g) { return mgOpts.indexOf(g); }).sort(function (a, c) { return a - c; });

    counter++;
    return {
      id: 'gen:' + arch.id,
      generated: true,
      archetype: arch.id,
      name: name,
      age: age,
      job: jobFor(age),
      motif: b.motif,
      difficulty: arch.difficulty,
      tags: arch.tags.concat(['Cas généré']),
      anamnese: b.anamnese,
      sim: b.sim,
      tests: b.tests,
      diagnosis: { options: dxOpts, correct: dxOpts.indexOf(b.diagnosis.label), exp: b.diagnosis.exp },
      management: { options: mgOpts, correct: correctIdx, exp: b.management.exp }
    };
  }

  window.CaseGen = {
    generate: generate,
    archetypes: ARCHETYPES.map(function (a) { return { id: a.id, tags: a.tags, difficulty: a.difficulty }; })
  };
})();
