/* ============================================================
   Optics — coeur de calcul optique et clinique
   Toutes les formules utilisees par les calculatrices et
   les simulateurs sont centralisees ici.
   ============================================================ */
(function () {
  'use strict';

  var DEG = 180 / Math.PI;

  function r2(x, n) { var p = Math.pow(10, n === undefined ? 2 : n); return Math.round(x * p) / p; }

  /* ---------- Acuite visuelle ---------- */

  // Monoyer francais : ligne notee en 10e = acuite decimale x 10
  var MONOYER = [
    { dec: 0.05, tenth: '0,5/10' }, { dec: 0.1, tenth: '1/10' }, { dec: 0.15, tenth: '1,5/10' },
    { dec: 0.2, tenth: '2/10' }, { dec: 0.3, tenth: '3/10' }, { dec: 0.4, tenth: '4/10' },
    { dec: 0.5, tenth: '5/10' }, { dec: 0.6, tenth: '6/10' }, { dec: 0.7, tenth: '7/10' },
    { dec: 0.8, tenth: '8/10' }, { dec: 0.9, tenth: '9/10' }, { dec: 1.0, tenth: '10/10' },
    { dec: 1.25, tenth: '12,5/10' }, { dec: 1.6, tenth: '16/10' }, { dec: 2.0, tenth: '20/10' }
  ];

  // Parinaud : correspondance usuelle de vision de pres (33-40 cm)
  var PARINAUD = [
    { p: 1.5, dec: 1.25 }, { p: 2, dec: 1.0 }, { p: 3, dec: 0.63 }, { p: 4, dec: 0.5 },
    { p: 6, dec: 0.32 }, { p: 8, dec: 0.25 }, { p: 10, dec: 0.2 }, { p: 14, dec: 0.14 },
    { p: 20, dec: 0.1 }, { p: 28, dec: 0.07 }
  ];

  var Acuity = {
    decToLogMAR: function (dec) { return dec > 0 ? -Math.log10(dec) : null; },
    logMARToDec: function (lm) { return Math.pow(10, -lm); },
    decToTenths: function (dec) { return dec * 10; },
    tenthsToDec: function (t) { return t / 10; },
    decToSnellen20: function (dec) { return dec > 0 ? 20 / dec : null; },
    decToSnellen6: function (dec) { return dec > 0 ? 6 / dec : null; },
    decToMAR: function (dec) { return dec > 0 ? 1 / dec : null; },   // en minutes d'arc
    // Taille du logMAR -> lettres perdues : 0.02 logMAR = 1 lettre (ETDRS)
    logMARToLetters: function (lm) { return r2(lm / 0.02, 1); },

    parinaudFor: function (dec) {
      var best = PARINAUD[PARINAUD.length - 1];
      for (var i = 0; i < PARINAUD.length; i++) {
        if (dec >= PARINAUD[i].dec) { best = PARINAUD[i]; break; }
      }
      return best.p;
    },

    // Hauteur (mm) d'un optotype standard (5 min d'arc) pour une acuite donnee a distance d (m)
    optotypeHeightMm: function (dec, distM) {
      var arcmin = 5 / dec;                      // taille angulaire totale
      var rad = (arcmin / 60) / DEG;
      return 2 * distM * 1000 * Math.tan(rad / 2);
    },

    // Acuite lisible pour une hauteur d'optotype donnee
    acuityForHeightMm: function (hMm, distM) {
      var rad = 2 * Math.atan((hMm / 2) / (distM * 1000));
      var arcmin = rad * DEG * 60;
      return 5 / arcmin;
    },

    // Frequence spatiale equivalente (cycles/degre) — 1.0 decimal ~ 30 cpd
    decToCpd: function (dec) { return 30 * dec; },

    monoyerScale: MONOYER,
    parinaudScale: PARINAUD,

    // Notation echelle de comptage des doigts / mouvements de main
    lowVisionScale: ['CLD 3 m', 'CLD 1 m', 'CLD 50 cm', 'CLD 30 cm', 'MDM', 'PL+', 'PL-']
  };

  /* ---------- Prismes et angles de deviation ---------- */

  var Prism = {
    // 1 dioptrie prismatique = deviation de 1 cm a 1 m
    dptToDeg: function (d) { return Math.atan(d / 100) * DEG; },
    degToDpt: function (deg) { return 100 * Math.tan(deg / DEG); },

    // Loi de Prentice : effet prismatique d'un decentrement
    prentice: function (powerD, decentrationMm) { return powerD * (decentrationMm / 10); },
    decentrationForPrism: function (powerD, prismD) { return powerD !== 0 ? (prismD / powerD) * 10 : null; },

    // Hirschberg : 1 mm de decentrement du reflet ~ 7 degres ~ 15 dioptries prismatiques
    hirschbergMmToDeg: function (mm) { return mm * 7; },
    hirschbergMmToDpt: function (mm) { return Prism.degToDpt(mm * 7); },
    // Reperes classiques du reflet corneen
    hirschbergLandmarks: [
      { pos: 'Centre pupillaire', deg: 0, dpt: 0, txt: 'Orthotropie' },
      { pos: 'Bord pupillaire', deg: 15, dpt: 27, txt: '~15° (pupille de 4 mm)' },
      { pos: 'Milieu iris', deg: 30, dpt: 58, txt: '~30°' },
      { pos: 'Limbe', deg: 45, dpt: 100, txt: '~45°' }
    ],

    // Krimsky : prisme necessaire pour recentrer le reflet
    krimsky: function (mmDecentration) { return mmDecentration * 15; },

    // Combinaison de deux prismes (horizontal + vertical) -> resultante
    combine: function (h, v) {
      var mag = Math.sqrt(h * h + v * v);
      var ang = Math.atan2(v, h) * DEG;
      return { magnitude: r2(mag, 2), axis: r2((ang + 360) % 360, 1) };
    },

    // Repartition d'un prisme sur les deux yeux
    split: function (total) { return r2(total / 2, 2); },

    // Nomenclature base
    baseLabel: function (dir) {
      return { BE: 'Base externe (temporale)', BI: 'Base interne (nasale)', BS: 'Base supérieure', BInf: 'Base inférieure' }[dir] || dir;
    }
  };

  /* ---------- Refraction ---------- */

  var Refraction = {
    sphericalEquivalent: function (sph, cyl) { return sph + (cyl || 0) / 2; },

    // Transposition cylindrique (cyl- <-> cyl+)
    transpose: function (sph, cyl, axis) {
      var ns = sph + cyl;
      var nc = -cyl;
      var na = (axis + 90) % 180;
      if (na === 0) na = 180;
      return { sph: r2(ns, 2), cyl: r2(nc, 2), axis: na };
    },

    // Vergence : distance (m) <-> puissance (D)
    distToPower: function (m) { return m !== 0 ? 1 / m : Infinity; },
    powerToDist: function (d) { return d !== 0 ? 1 / d : Infinity; },

    // Amplitude d'accommodation (Hofstetter)
    hofstetter: function (age) {
      return {
        max: r2(25 - 0.4 * age, 2),
        moy: r2(18.5 - 0.3 * age, 2),
        min: r2(15 - 0.25 * age, 2)
      };
    },

    // Addition de presbytie estimee (garde la moitie de l'amplitude en reserve)
    addition: function (age, workingDistCm) {
      var need = 100 / (workingDistCm || 40);
      var amp = Refraction.hofstetter(age).min;
      var add = need - amp / 2;
      return r2(Math.max(0, Math.round(add * 4) / 4), 2);
    },

    // Verre de skiascopie / distance de travail
    workingLens: function (distCm) { return r2(100 / distCm, 2); },

    // Puissance effective a une distance de sommet differente
    vertexPower: function (power, fromMm, toMm) {
      var d = (fromMm - toMm) / 1000;
      return r2(power / (1 - d * power), 2);
    },

    // Conversion cylindre croise / puissances principales
    meridianPower: function (sph, cyl, axis, meridian) {
      var theta = (meridian - axis) / DEG;
      return r2(sph + cyl * Math.pow(Math.sin(theta), 2), 2);
    },

    // Formule de la lentille mince : grossissement d'une loupe
    magnifier: function (powerD) { return r2(powerD / 4, 2); },

    // Puissance necessaire en basse vision (Kestenbaum)
    kestenbaum: function (decAcuity) { return r2(1 / decAcuity, 2); },

    // Simule le flou retinien induit par un defaut de sphere (angle en minutes d'arc)
    // theta(rad) ~ pupille(mm) * D / 1000
    blurArcmin: function (defocusD, pupilMm) {
      return Math.abs(defocusD) * (pupilMm || 4) * 3.4377;
    },

    // Estimation de l'acuite atteinte avec un flou donne (modele simplifie)
    acuityFromDefocus: function (defocusD, pupilMm) {
      var b = Refraction.blurArcmin(defocusD, pupilMm);   // minutes d'arc
      var mar = Math.max(1, Math.sqrt(1 + b * b * 0.55)); // MAR effectif
      return r2(1 / mar, 2);
    },

    // Cercle de moindre diffusion / intervalle de Sturm
    sturm: function (sph, cyl) {
      var a = sph, b = sph + cyl;
      return { focale1: r2(a, 2), focale2: r2(b, 2), cercleMoindreDiffusion: r2((a + b) / 2, 2), intervalle: r2(Math.abs(cyl), 2) };
    }
  };

  /* ---------- Vision binoculaire ---------- */

  var Binocular = {
    // AC/A par la methode du gradient : (phorie avec verre - phorie sans) / puissance
    acaGradient: function (phoriaWith, phoriaWithout, lensD) {
      return r2((phoriaWith - phoriaWithout) / Math.abs(lensD), 2);
    },
    // AC/A par la methode de l'heterophorie : DIP(cm) + distance travail(m) x (phorieVP - phorieVL)
    acaHeterophoria: function (dipCm, workDistM, phoriaNear, phoriaFar) {
      return r2(dipCm + workDistM * (phoriaNear - phoriaFar), 2);
    },
    acaInterpret: function (aca) {
      if (aca < 3) return 'AC/A bas — typique d’une insuffisance de convergence ou d’une ésotropie plus marquée de loin';
      if (aca > 5) return 'AC/A élevé — typique d’une ésotropie accommodative avec excès de convergence';
      return 'AC/A normal (3 à 5 Δ/D)';
    },

    // Demande de convergence en dioptries prismatiques pour une distance donnee
    convergenceDemand: function (dipMm, distCm) { return r2((dipMm / 10) * (100 / distCm), 2); },

    // Angle metrique / convergence
    metreAngle: function (distCm) { return r2(100 / distCm, 2); },

    // Critere de Sheard : reserve >= 2 x phorie
    sheard: function (phoria, reserveOpposite) {
      var need = 2 * Math.abs(phoria);
      return { need: r2(need, 1), ok: reserveOpposite >= need, prism: r2(Math.max(0, (2 * Math.abs(phoria) - reserveOpposite) / 3), 2) };
    },
    // Critere de Percival : reserve mineure >= 1/2 reserve majeure
    percival: function (minR, maxR) {
      return { ok: minR >= maxR / 2, prism: r2(Math.max(0, (maxR - 2 * minR) / 3), 2) };
    },

    // Delta 1 = 0.57 degre de rotation oculaire
    dptToOcularDeg: function (d) { return r2(Math.atan(d / 100) * DEG, 2); },

    // Stereo-acuite : disparite (secondes d'arc) pour une profondeur donnee
    stereoDisparity: function (dipMm, distCm, depthCm) {
      var d1 = distCm, d2 = distCm + depthCm;
      var eta = (dipMm / 10) * (1 / d1 - 1 / d2); // rad
      return r2(eta * DEG * 3600, 1);
    },

    worthGrades: [
      { g: 'I', label: 'Perception simultanée', tests: 'Synoptophore mires dissemblables, Worth' },
      { g: 'II', label: 'Fusion (motrice et sensorielle)', tests: 'Amplitudes de fusion, mires à contrôle' },
      { g: 'III', label: 'Vision stéréoscopique', tests: 'TNO, Titmus, Lang, Wirt' }
    ]
  };

  /* ---------- Motricite ---------- */

  var Motility = {
    muscles: [
      { id: 'DL', name: 'Droit latéral', nerve: 'VI (abducens)', primary: 'Abduction', secondary: '—', tertiary: '—', origin: 'Anneau de Zinn', insertion: '6,9 mm du limbe', arc: 'Spirale de Tillaux' },
      { id: 'DM', name: 'Droit médial', nerve: 'III (inférieure)', primary: 'Adduction', secondary: '—', tertiary: '—', origin: 'Anneau de Zinn', insertion: '5,5 mm du limbe', arc: 'Insertion la plus antérieure' },
      { id: 'DS', name: 'Droit supérieur', nerve: 'III (supérieure)', primary: 'Élévation', secondary: 'Intorsion', tertiary: 'Adduction', origin: 'Anneau de Zinn', insertion: '7,7 mm du limbe', arc: 'Action max en abduction 23°' },
      { id: 'DI', name: 'Droit inférieur', nerve: 'III (inférieure)', primary: 'Abaissement', secondary: 'Extorsion', tertiary: 'Adduction', origin: 'Anneau de Zinn', insertion: '6,5 mm du limbe', arc: 'Action max en abduction 23°' },
      { id: 'OS', name: 'Oblique supérieur (grand oblique)', nerve: 'IV (trochléaire)', primary: 'Intorsion', secondary: 'Abaissement', tertiary: 'Abduction', origin: 'Apex orbitaire → trochlée', insertion: 'Quadrant supéro-temporal postérieur', arc: 'Action abaissante max en adduction 51°' },
      { id: 'OI', name: 'Oblique inférieur (petit oblique)', nerve: 'III (inférieure)', primary: 'Extorsion', secondary: 'Élévation', tertiary: 'Abduction', origin: 'Os maxillaire, angle inféro-nasal', insertion: 'Quadrant inféro-temporal postérieur', arc: 'Action élévatrice max en adduction 51°' }
    ],

    // Couples agonistes / antagonistes (loi de Sherrington) et synergistes controlateraux (loi de Hering)
    yokePairs: [
      { gaze: 'Droite', od: 'DL', os: 'DM' },
      { gaze: 'Gauche', od: 'DM', os: 'DL' },
      { gaze: 'Haut-droite', od: 'DS', os: 'OI' },
      { gaze: 'Haut-gauche', od: 'OI', os: 'DS' },
      { gaze: 'Bas-droite', od: 'DI', os: 'OS' },
      { gaze: 'Bas-gauche', od: 'OS', os: 'DI' }
    ],

    antagonist: { DL: 'DM', DM: 'DL', DS: 'DI', DI: 'DS', OS: 'OI', OI: 'OS' },

    // Test de Bielschowsky pour paralysie du IV
    parksSteps: [
      '1. Quel œil est le plus haut ? (hypertropie) → élimine 4 des 8 muscles verticaux',
      '2. La déviation augmente-t-elle en regard droit ou gauche ? → élimine 2 muscles',
      '3. La déviation augmente-t-elle en inclinaison de tête à droite ou à gauche ? → identifie le muscle'
    ]
  };

  /* ---------- Utilitaires cliniques ---------- */

  function formatDpt(v) {
    if (v === null || v === undefined || isNaN(v)) return '—';
    return (v > 0 ? '+' : '') + v.toFixed(2);
  }
  function formatDelta(v) {
    if (v === null || v === undefined || isNaN(v)) return '—';
    return Math.abs(v).toFixed(0) + 'Δ';
  }
  function formatRx(sph, cyl, axis) {
    if (cyl === 0 || cyl === null || cyl === undefined) return formatDpt(sph) + ' sph';
    return formatDpt(sph) + ' (' + formatDpt(cyl) + ' à ' + axis + '°)';
  }

  window.Optics = {
    Acuity: Acuity,
    Prism: Prism,
    Refraction: Refraction,
    Binocular: Binocular,
    Motility: Motility,
    formatDpt: formatDpt,
    formatDelta: formatDelta,
    formatRx: formatRx,
    r2: r2,
    DEG: DEG
  };
})();
