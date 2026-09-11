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
      { code: 'UE01', title: 'Biologie moléculaire et cellulaire, génétique, histologie', h: 50, cm: 40, td: 10, tp: 0, ects: 3,
        links: { chap: ['anatomie'] } },
      { code: 'UE02', title: 'Optique géométrique, optique physiologique', h: 50, cm: 30, td: 20, tp: 0, ects: 3,
        links: { formulas: ['descartes', 'reflexion_totale', 'prisme_exact', 'dioptre_spherique', 'miroir_spherique', 'lentille_mince', 'vergence', 'prisme', 'prentice', 'transposition', 'equivalent', 'vertex'], mod: ['converters'], calc: ['vergence', 'transpose', 'vertex'], chap: ['refraction'] } },
      { code: 'UE03', title: 'Réfraction', h: 70, cm: 30, td: 40, tp: 0, ects: 4,
        links: { formulas: ['skiascopie', 'transposition', 'equivalent', 'addition', 'vertex'], mod: ['reading'], calc: ['transpose', 'accom', 'vertex'], chap: ['refraction'] } },
      { code: 'UE04', title: 'Physiologie du système visuel, physiologie neurosensorielle', h: 50, cm: 40, td: 10, tp: 0, ects: 3,
        links: { mod: ['reading'], chap: ['anatomie'] } },
      { code: 'UE05', title: 'Vision monoculaire, acuités visuelles et anomalies', h: 50, cm: 25, td: 25, tp: 0, ects: 3,
        links: { formulas: ['logmar', 'mar', 'optotype'], mod: ['reading'], calc: ['acuity'], chap: ['refraction'] } },
      { code: 'UE06', title: 'Anglais', h: 10, cm: 0, td: 10, tp: 0, ects: 1 },
      { code: 'UE07', title: 'Anatomie et histologie de l’appareil oculomoteur et de l’œil', h: 40, cm: 30, td: 10, tp: 0, ects: 2,
        links: { mod: ['anatomy'], chap: ['anatomie', 'oculomotricite'] } },
      { code: 'UE08', title: 'Physiologie de l’appareil oculomoteur et vision binoculaire', h: 50, cm: 40, td: 10, tp: 0, ects: 3,
        links: { formulas: ['convergence', 'aca_gradient', 'stereo'], mod: ['reading'], chap: ['oculomotricite', 'binoculaire'] } },
      { code: 'UE09', title: 'Physiopathologie de l’oculomotricité et de la vision binoculaire', h: 60, cm: 40, td: 20, tp: 0, ects: 4,
        links: { formulas: ['hirschberg', 'krimsky', 'aca_gradient', 'aca_hetero'], mod: ['reading'], chap: ['strabismes', 'binoculaire'] } },
      { code: 'UE12', title: 'Déontologie et éthique, histoire de la profession', h: 30, cm: 20, td: 10, tp: 0, ects: 1,
        links: { chap: ['metier'] } },
      { code: 'UE16', title: 'Pathologies ophtalmologiques et générales', h: 40, cm: 30, td: 10, tp: 0, ects: 2,
        links: { mod: ['reading'], chap: ['pathologies'] } }
    ],
    stage: { ects: 1, label: 'Stage S1' }
  },

  {
    id: 'S2', year: 1, label: 'Semestre 2', ects: 30,
    ues: [
      { code: 'UE06', title: 'Anglais S2', h: 10, cm: 0, td: 10, tp: 0, ects: 1 },
      { code: 'UE10', title: 'Explorations fonctionnelles', h: 63, cm: 25, td: 38, tp: 0, ects: 4,
        links: { formulas: ['logmar'], mod: ['reading'], chap: ['pathologies'] } },
      { code: 'UE11', title: 'Bilan orthoptique', h: 112, cm: 40, td: 72, tp: 0, ects: 6,
        links: { formulas: ['convergence', 'sheard', 'aca_gradient', 'aca_hetero', 'hofstetter', 'hirschberg'], mod: ['patient', 'reading'], calc: ['aca', 'converg'], chap: ['binoculaire'] } },
      { code: 'UE13', title: 'Hygiène et gestion des risques', h: 15, cm: 10, td: 5, tp: 0, ects: 1,
        links: { chap: ['metier'] } },
      { code: 'UE14', title: 'Pathologies sensorimotrices', h: 40, cm: 30, td: 10, tp: 0, ects: 2,
        links: { mod: ['reading'], chap: ['strabismes'] } },
      { code: 'UE15', title: 'Prise en charge des pathologies sensorimotrices', h: 90, cm: 30, td: 60, tp: 0, ects: 6,
        links: { formulas: ['sheard', 'convergence'], mod: ['rehab', 'patient', 'reading'], chap: ['strabismes', 'binoculaire'] } },
      { code: 'UE17', title: 'Explorations fonctionnelles et pathologies ophtalmologiques', h: 70, cm: 30, td: 40, tp: 0, ects: 4,
        links: { mod: ['reading'], chap: ['pathologies'] } },
      { code: 'UE18', title: 'Psychologie, psychopathologie, neurophysiologie', h: 30, cm: 30, td: 0, tp: 0, ects: 2 },
      { code: 'UE19', title: 'Pharmacologie et thérapeutique', h: 15, cm: 15, td: 0, tp: 0, ects: 1,
        links: { chap: ['pathologies'] } }
    ],
    stage: { ects: 3, label: 'Stage S2' }
  },

  {
    id: 'S3', year: 2, label: 'Semestre 3', ects: 30,
    ues: [
      { code: 'UE24', title: 'Amblyopie fonctionnelle, privation visuelle', h: 45, cm: 30, td: 15, tp: 0, ects: 3,
        links: { formulas: ['logmar'], mod: ['reading'], chap: ['strabismes'] } },
      { code: 'UE25', title: 'Prise en charge de l’amblyopie fonctionnelle', h: 90, cm: 20, td: 70, tp: 0, ects: 6,
        links: { mod: ['rehab', 'patient'], chap: ['strabismes'] } },
      { code: 'UE26', title: 'Basse vision', h: 90, cm: 60, td: 30, tp: 0, ects: 6,
        links: { formulas: ['kestenbaum', 'vergence'], mod: ['reading'], calc: ['vertex', 'acuity'], chap: ['pathologies'] } },
      { code: 'UE28', title: 'Méthodologie, documentation et bibliographie scientifique', h: 10, cm: 2, td: 8, tp: 0, ects: 1 },
      { code: 'UE32', title: 'Communication, éducation thérapeutique', h: 30, cm: 10, td: 20, tp: 0, ects: 2,
        links: { mod: ['patient'], chap: ['metier'] } },
      { code: 'UE37', title: 'Diagnostic orthoptique et projets de soins', h: 38, cm: 8, td: 30, tp: 0, ects: 3,
        links: { mod: ['patient', 'rehab'] } },
      { code: 'UE06', title: 'Anglais S3', h: 12, cm: 0, td: 12, tp: 0, ects: 1 }
    ],
    stage: { ects: 8, label: 'Stage S3' }
  },

  {
    id: 'S4', year: 2, label: 'Semestre 4', ects: 30,
    ues: [
      { code: 'UE21', title: 'Statistiques, épidémiologie, santé publique, informatique', h: 60, cm: 30, td: 30, tp: 0, ects: 4 },
      { code: 'UE22', title: 'Pathologies neuro-ophtalmologiques', h: 40, cm: 30, td: 10, tp: 0, ects: 3,
        links: { mod: ['reading'], chap: ['pathologies', 'oculomotricite'] } },
      { code: 'UE23', title: 'Prise en charge orthoptique des pathologies neuro-ophtalmologiques', h: 90, cm: 30, td: 60, tp: 0, ects: 7,
        links: { mod: ['rehab', 'reading', 'patient'], chap: ['oculomotricite'] } },
      { code: 'UE27', title: 'Bilan et prise en charge orthoptique de la basse vision', h: 90, cm: 30, td: 60, tp: 0, ects: 7,
        links: { formulas: ['kestenbaum'], mod: ['reading'], calc: ['vertex', 'acuity'], chap: ['pathologies'] } },
      { code: 'UE06', title: 'Anglais S4', h: 10, cm: 0, td: 10, tp: 0, ects: 1 }
    ],
    stage: { ects: 8, label: 'Stage S4' }
  },

  {
    id: 'S5', year: 3, label: 'Semestre 5', ects: 30,
    ues: [
      { code: 'UE06', title: 'Anglais S5', h: 10, cm: 0, td: 10, tp: 0, ects: 1 },
      { code: 'UE29', title: 'Vision et troubles de l’apprentissage', h: 60, cm: 30, td: 30, tp: 0, ects: 5,
        links: { mod: ['rehab', 'reading'], chap: ['binoculaire'] } },
      { code: 'UE30', title: 'Troubles neurovisuels, vision et équilibre', h: 80, cm: 20, td: 60, tp: 0, ects: 6,
        links: { mod: ['rehab', 'reading'], chap: ['oculomotricite'] } },
      { code: 'UE31', title: 'Dépistage visuel et ergonomie visuelle', h: 40, cm: 20, td: 20, tp: 0, ects: 3,
        links: { mod: ['reading', 'patient'] } },
      { code: 'UE33', title: 'Imagerie et technologies de la communication', h: 30, cm: 10, td: 20, tp: 0, ects: 2,
        links: { mod: ['reading'] } },
      { code: 'UE41', title: 'Gestes et soins d’urgence', h: 0, cm: 0, td: 0, tp: 0, ects: 1 },
      { code: 'UE libre', title: 'Enseignement libre', h: 0, cm: 0, td: 0, tp: 0, ects: 2 }
    ],
    stage: { ects: 10, label: 'Stage S5' }
  },

  {
    id: 'S6', year: 3, label: 'Semestre 6', ects: 30,
    ues: [
      { code: 'UE06', title: 'Anglais S6', h: 10, cm: 0, td: 10, tp: 0, ects: 1 },
      { code: 'UE34', title: 'Exercice de la profession d’orthoptiste', h: 20, cm: 15, td: 5, tp: 0, ects: 1,
        links: { chap: ['metier'] } },
      { code: 'UE35', title: 'Dépistage, prévention et suivi des pathologies ophtalmologiques', h: 60, cm: 20, td: 40, tp: 0, ects: 4,
        links: { mod: ['reading'], chap: ['pathologies'] } },
      { code: 'UE36', title: 'Bilans orthoptiques, techniques chirurgicales', h: 40, cm: 10, td: 30, tp: 0, ects: 2,
        links: { formulas: ['hirschberg', 'krimsky'], mod: ['patient', 'reading'], chap: ['strabismes'] } },
      { code: 'UE38', title: 'Travail de fin d’études', h: 132, cm: 2, td: 10, tp: 120, ects: 8 },
      { code: 'UE39', title: 'Coopération et coordination avec les différents acteurs', h: 20, cm: 10, td: 10, tp: 0, ects: 1,
        links: { chap: ['metier'] } },
      { code: 'UE40', title: 'Accompagnement des professionnels et futurs professionnels', h: 17, cm: 5, td: 12, tp: 0, ects: 1,
        links: { chap: ['metier'] } },
      { code: 'UE libre', title: 'Enseignement libre', h: 0, cm: 0, td: 0, tp: 0, ects: 2 }
    ],
    stage: { ects: 10, label: 'Stage S6' }
  }
];
