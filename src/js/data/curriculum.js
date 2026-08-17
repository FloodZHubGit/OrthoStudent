/* ============================================================
   Référentiel de formation — Certificat de capacité d'orthoptiste
   ------------------------------------------------------------
   Six semestres, 180 ECTS. Chaque UE porte ses volumes horaires
   (CM / TD / TP), ses crédits, et surtout ses `links` : les
   modules de l'application qui la travaillent, les chapitres de
   cours correspondants et les thèmes de QCM à réviser.
     mod   : identifiant de module (window.Modules)
     calc  : calculatrice de la page « Calculatrices »
     chap  : chapitre de « Cours & fiches »
     cats  : thèmes de la banque de QCM
   ============================================================ */
window.CURRICULUM = [
  {
    id: 'S1', year: 1, label: 'Semestre 1', ects: 30,
    ues: [
      { code: 'UE1', title: 'Biologie moléculaire et cellulaire, génétique, histologie', h: 50, cm: 40, td: 10, tp: 0, ects: 3,
        links: { chap: ['anatomie'], cats: ['Anatomie'] } },
      { code: 'UE2', title: 'Optique géométrique, optique physiologique', h: 50, cm: 30, td: 20, tp: 0, ects: 3,
        links: { formulas: ['vergence', 'prisme', 'prentice', 'transposition', 'equivalent', 'vertex'], mod: ['converters'], calc: ['vergence', 'transpose', 'vertex'], chap: ['refraction'], cats: ['Optique'] } },
      { code: 'UE3', title: 'Réfraction', h: 70, cm: 30, td: 40, tp: 0, ects: 4,
        links: { formulas: ['skiascopie', 'transposition', 'equivalent', 'addition', 'vertex'], mod: ['phoropter', 'skiascopy'], calc: ['transpose', 'accom', 'vertex'], chap: ['refraction'], cats: ['Réfraction', 'Optique'] } },
      { code: 'UE4', title: 'Physiologie du système visuel, physiologie neurosensorielle', h: 50, cm: 40, td: 10, tp: 0, ects: 3,
        links: { mod: ['colorvision', 'fields'], chap: ['anatomie'], cats: ['Anatomie'] } },
      { code: 'UE5', title: 'Vision monoculaire, acuités visuelles et anomalies', h: 50, cm: 25, td: 25, tp: 0, ects: 3,
        links: { formulas: ['logmar', 'mar', 'optotype'], mod: ['acuity'], calc: ['acuity'], chap: ['refraction'], cats: ['Mesures'] } },
      { code: 'UE6', title: 'Anglais', h: 10, cm: 0, td: 10, tp: 0, ects: 1, links: {} },
      { code: 'UE7', title: 'Anatomie et histologie de l’appareil oculomoteur et de l’œil', h: 40, cm: 30, td: 10, tp: 0, ects: 2,
        links: { mod: ['anatomy'], chap: ['anatomie', 'oculomotricite'], cats: ['Anatomie', 'Oculomotricité'] } },
      { code: 'UE8', title: 'Physiologie de l’appareil oculomoteur et vision binoculaire', h: 50, cm: 40, td: 10, tp: 0, ects: 3,
        links: { formulas: ['convergence', 'aca_gradient', 'stereo'], mod: ['motility', 'binocular'], chap: ['oculomotricite', 'binoculaire'], cats: ['Oculomotricité', 'Vision binoculaire'] } },
      { code: 'UE9', title: 'Physiopathologie de l’oculomotricité et de la vision binoculaire', h: 60, cm: 40, td: 20, tp: 0, ects: 4,
        links: { formulas: ['hirschberg', 'krimsky', 'aca_gradient', 'aca_hetero'], mod: ['covertest', 'lancaster', 'prism'], chap: ['strabismes', 'binoculaire'], cats: ['Strabologie', 'Vision binoculaire'] } },
      { code: 'UE12', title: 'Déontologie et éthique, histoire de la profession', h: 30, cm: 20, td: 10, tp: 0, ects: 1,
        links: { chap: ['metier'], cats: ['Métier'] } },
      { code: 'UE16', title: 'Pathologies ophtalmologiques et générales', h: 40, cm: 30, td: 10, tp: 0, ects: 2,
        links: { mod: ['fundus'], chap: ['pathologies'], cats: ['Pathologies'] } }
    ],
    stage: { ects: 1, label: 'Stage S1' }
  },

  {
    id: 'S2', year: 1, label: 'Semestre 2', ects: 30,
    ues: [
      { code: 'UE6', title: 'Anglais S2', h: 10, cm: 0, td: 10, tp: 0, ects: 1, links: {} },
      { code: 'UE10', title: 'Explorations fonctionnelles', h: 63, cm: 25, td: 38, tp: 0, ects: 4,
        links: { formulas: ['logmar'], mod: ['fields', 'colorvision', 'fundus'], chap: ['pathologies'], cats: ['Explorations', 'Pathologies', 'Mesures'] } },
      { code: 'UE11', title: 'Bilan orthoptique', h: 112, cm: 40, td: 72, tp: 0, ects: 6,
        links: { formulas: ['convergence', 'sheard', 'aca_gradient', 'aca_hetero', 'hofstetter', 'hirschberg'], mod: ['patient', 'covertest', 'prism', 'ppc', 'binocular'], calc: ['aca', 'converg'], chap: ['binoculaire'], cats: ['Mesures', 'Vision binoculaire'] } },
      { code: 'UE13', title: 'Hygiène et gestion des risques', h: 15, cm: 10, td: 5, tp: 0, ects: 1,
        links: { chap: ['metier'] } },
      { code: 'UE14', title: 'Pathologies sensorimotrices', h: 40, cm: 30, td: 10, tp: 0, ects: 2,
        links: { mod: ['motility', 'lancaster'], chap: ['strabismes'], cats: ['Métier'] } },
      { code: 'UE15', title: 'Prise en charge des pathologies sensorimotrices', h: 90, cm: 30, td: 60, tp: 0, ects: 6,
        links: { formulas: ['sheard', 'convergence'], mod: ['rehab', 'patient', 'ppc'], chap: ['strabismes', 'binoculaire'], cats: ['Rééducation', 'Strabologie'] } },
      { code: 'UE17', title: 'Explorations fonctionnelles et pathologies ophtalmologiques', h: 70, cm: 30, td: 40, tp: 0, ects: 4,
        links: { mod: ['fundus', 'fields'], chap: ['pathologies'], cats: ['Explorations', 'Pathologies'] } },
      { code: 'UE18', title: 'Psychologie, psychopathologie, neurophysiologie', h: 30, cm: 30, td: 0, tp: 0, ects: 2, links: {} },
      { code: 'UE19', title: 'Pharmacologie et thérapeutique', h: 15, cm: 15, td: 0, tp: 0, ects: 1,
        links: { chap: ['pathologies'], cats: ['Pharmacologie', 'Pathologies'] } }
    ],
    stage: { ects: 3, label: 'Stage S2' }
  },

  {
    id: 'S3', year: 2, label: 'Semestre 3', ects: 30,
    ues: [
      { code: 'UE24', title: 'Amblyopie fonctionnelle, privation visuelle', h: 45, cm: 30, td: 15, tp: 0, ects: 3,
        links: { formulas: ['logmar'], mod: ['acuity'], chap: ['strabismes'], cats: ['Amblyopie', 'Strabologie'] } },
      { code: 'UE25', title: 'Prise en charge de l’amblyopie fonctionnelle', h: 90, cm: 20, td: 70, tp: 0, ects: 6,
        links: { mod: ['rehab', 'patient'], chap: ['strabismes'], cats: ['Amblyopie', 'Rééducation'] } },
      { code: 'UE26', title: 'Basse vision', h: 90, cm: 60, td: 30, tp: 0, ects: 6,
        links: { formulas: ['kestenbaum', 'vergence'], mod: ['acuity', 'fields'], calc: ['vertex', 'acuity'], chap: ['pathologies'], cats: ['Basse vision', 'Pathologies'] } },
      { code: 'UE28', title: 'Méthodologie, documentation et bibliographie scientifique', h: 10, cm: 2, td: 8, tp: 0, ects: 1, links: {} },
      { code: 'UE32', title: 'Communication, éducation thérapeutique', h: 30, cm: 10, td: 20, tp: 0, ects: 2,
        links: { mod: ['patient'], chap: ['metier'] } },
      { code: 'UE37', title: 'Diagnostic orthoptique et projets de soins', h: 38, cm: 8, td: 30, tp: 0, ects: 3,
        links: { mod: ['patient', 'rehab'], cats: ['Strabologie', 'Mesures'] } },
      { code: 'UE6', title: 'Anglais S3', h: 12, cm: 0, td: 12, tp: 0, ects: 1, links: {} }
    ],
    stage: { ects: 8, label: 'Stage S3' }
  },

  {
    id: 'S4', year: 2, label: 'Semestre 4', ects: 30,
    ues: [
      { code: 'UE21', title: 'Statistiques, épidémiologie, santé publique, informatique', h: 60, cm: 30, td: 30, tp: 0, ects: 4, links: {} },
      { code: 'UE22', title: 'Pathologies neuro-ophtalmologiques', h: 40, cm: 30, td: 10, tp: 0, ects: 3,
        links: { mod: ['fields', 'motility', 'fundus'], chap: ['pathologies', 'oculomotricite'], cats: ['Neuro-ophtalmologie', 'Pathologies', 'Oculomotricité'] } },
      { code: 'UE23', title: 'Prise en charge orthoptique des pathologies neuro-ophtalmologiques', h: 90, cm: 30, td: 60, tp: 0, ects: 7,
        links: { mod: ['rehab', 'lancaster', 'motility', 'patient'], chap: ['oculomotricite'], cats: ['Neuro-ophtalmologie', 'Rééducation', 'Oculomotricité'] } },
      { code: 'UE27', title: 'Bilan et prise en charge orthoptique de la basse vision', h: 90, cm: 30, td: 60, tp: 0, ects: 7,
        links: { formulas: ['kestenbaum'], mod: ['acuity', 'fields', 'fundus'], calc: ['vertex', 'acuity'], chap: ['pathologies'], cats: ['Basse vision', 'Pathologies'] } },
      { code: 'UE6', title: 'Anglais S4', h: 10, cm: 0, td: 10, tp: 0, ects: 1, links: {} }
    ],
    stage: { ects: 8, label: 'Stage S4' }
  },

  {
    id: 'S5', year: 3, label: 'Semestre 5', ects: 30,
    ues: [
      { code: 'UE6', title: 'Anglais S5', h: 10, cm: 0, td: 10, tp: 0, ects: 1, links: {} },
      { code: 'UE29', title: 'Vision et troubles de l’apprentissage', h: 60, cm: 30, td: 30, tp: 0, ects: 5,
        links: { mod: ['rehab', 'ppc'], chap: ['binoculaire'], cats: ['Rééducation', 'Vision binoculaire'] } },
      { code: 'UE30', title: 'Troubles neurovisuels, vision et équilibre', h: 80, cm: 20, td: 60, tp: 0, ects: 6,
        links: { mod: ['rehab', 'fields', 'motility'], chap: ['oculomotricite'], cats: ['Neuro-ophtalmologie', 'Oculomotricité'] } },
      { code: 'UE31', title: 'Dépistage visuel et ergonomie visuelle', h: 40, cm: 20, td: 20, tp: 0, ects: 3,
        links: { mod: ['acuity', 'colorvision', 'patient'], cats: ['Mesures', 'Explorations'] } },
      { code: 'UE33', title: 'Imagerie et technologies de la communication', h: 30, cm: 10, td: 20, tp: 0, ects: 2,
        links: { mod: ['fundus', 'fields'] } },
      { code: 'UE41', title: 'Gestes et soins d’urgence', h: 0, cm: 0, td: 0, tp: 0, ects: 1, links: {} },
      { code: 'UE libre', title: 'Enseignement libre', h: 0, cm: 0, td: 0, tp: 0, ects: 2, links: {} }
    ],
    stage: { ects: 10, label: 'Stage S5' }
  },

  {
    id: 'S6', year: 3, label: 'Semestre 6', ects: 30,
    ues: [
      { code: 'UE6', title: 'Anglais S6', h: 10, cm: 0, td: 10, tp: 0, ects: 1, links: {} },
      { code: 'UE34', title: 'Exercice de la profession d’orthoptiste', h: 20, cm: 15, td: 5, tp: 0, ects: 1,
        links: { chap: ['metier'], cats: ['Métier'] } },
      { code: 'UE35', title: 'Dépistage, prévention et suivi des pathologies ophtalmologiques', h: 60, cm: 20, td: 40, tp: 0, ects: 4,
        links: { mod: ['fundus', 'fields', 'colorvision'], chap: ['pathologies'], cats: ['Explorations', 'Pathologies'] } },
      { code: 'UE36', title: 'Bilans orthoptiques, techniques chirurgicales', h: 40, cm: 10, td: 30, tp: 0, ects: 2,
        links: { formulas: ['hirschberg', 'krimsky'], mod: ['patient', 'prism', 'covertest'], chap: ['strabismes'], cats: ['Strabologie', 'Mesures'] } },
      { code: 'UE38', title: 'Travail de fin d’études', h: 132, cm: 2, td: 10, tp: 120, ects: 8, links: {} },
      { code: 'UE39', title: 'Coopération et coordination avec les différents acteurs', h: 20, cm: 10, td: 10, tp: 0, ects: 1,
        links: { chap: ['metier'] } },
      { code: 'UE40', title: 'Accompagnement des professionnels et futurs professionnels', h: 17, cm: 5, td: 12, tp: 0, ects: 1,
        links: { chap: ['metier'] } },
      { code: 'UE libre', title: 'Enseignement libre', h: 0, cm: 0, td: 0, tp: 0, ects: 2, links: {} }
    ],
    stage: { ects: 10, label: 'Stage S6' }
  }
];
