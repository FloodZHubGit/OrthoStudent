/* ============================================================
   Reading — lire un bilan orthoptique et l'interpréter
   ------------------------------------------------------------
   Les douze simulateurs demandaient à l'étudiant de refaire le
   GESTE : glisser un occulteur, approcher une cible, tourner une
   molette. Trois problèmes tenaces :

     · le geste à l'écran n'a rien à voir avec le geste réel, on
       apprenait donc à manipuler une souris ;
     · tout reposait sur un patient dessiné à la main, qui ne
       ressemblera jamais à un patient ;
     · et ce n'est pas ce qui est évalué. En clinique comme en
       examen, on vous met un bilan sous les yeux et on vous
       demande ce que vous en concluez.

   Ce module fait donc l'inverse : le compte rendu est donné,
   rédigé comme un examinateur l'écrit, et c'est l'INTERPRÉTATION
   qui est notée. Les questions ne sont pas écrites à la main :
   elles sont dérivées des valeurs cliniques structurées que
   chaque dossier porte déjà (`case.sim`), donc elles sont justes
   par construction et suivent le patient.

   Convention des signes, partagée avec Optics et casegen :
     h > 0 → exodéviation      h < 0 → ésodéviation
     v > 0 → hypertropie de l'OD
   ============================================================ */
(function () {
  'use strict';

  /* Les examens dont on sait tirer une lecture, dans l'ordre du bilan. */
  var TESTS = [
    { id: 'acuity',      name: 'Acuité visuelle',        ic: '🔠' },
    { id: 'phoropter',   name: 'Réfraction',             ic: '🔭' },
    { id: 'covertest',   name: 'Cover test',             ic: '👁' },
    { id: 'prism',       name: 'Mesure au prisme',       ic: '🔺' },
    { id: 'motility',    name: 'Motilité',               ic: '🔄' },
    { id: 'lancaster',   name: 'Lancaster',              ic: '🟥' },
    { id: 'ppc',         name: 'PPC & convergence',      ic: '🎯' },
    { id: 'binocular',   name: 'Bilan sensoriel',        ic: '🔗' },
    { id: 'fundus',      name: 'Fond d’œil',             ic: '🔴' },
    { id: 'colorvision', name: 'Vision des couleurs',    ic: '🎨' },
    { id: 'fields',      name: 'Champ visuel',           ic: '🗺' }
  ];

  function testById(id) {
    for (var i = 0; i < TESTS.length; i++) if (TESTS[i].id === id) return TESTS[i];
    return { id: id, name: id, ic: '•' };
  }

  /* ---------- fabriques d'items ---------- */

  function choice(id, test, label, options, answer, why) {
    return { id: id, test: test, type: 'choice', label: label, options: options, answer: answer, why: why };
  }
  function number(id, test, label, answer, tol, unit, why) {
    return { id: id, test: test, type: 'num', label: label, answer: answer, tol: tol, unit: unit, why: why };
  }

  var MUSCLES = ['Droit latéral', 'Droit médial', 'Droit supérieur', 'Droit inférieur', 'Oblique supérieur', 'Oblique inférieur'];
  var MUSCLE_IDS = ['DL', 'DM', 'DS', 'DI', 'OS', 'OI'];

  /* ---------- un examen → ses questions ---------- */

  var BUILDERS = {

    covertest: function (sim) {
      var c = sim.covertest;
      if (!c) return [];
      var out = [];
      var far = c.farH || 0, near = c.nearH || 0, v = c.farV || 0;

      out.push(choice('ct-nature', 'covertest',
        'Cette déviation est-elle latente ou manifeste ?',
        ['Phorie — déviation latente, compensée en vision binoculaire',
         'Tropie — déviation manifeste, présente les deux yeux ouverts'],
        c.manifest ? 1 : 0,
        'C’est le cover test <b>unilatéral</b> qui tranche : si l’œil découvert bouge pour prendre la fixation, ' +
        'la déviation était manifeste. L’écran alterné, lui, ne fait pas la différence.'));

      if (Math.abs(far) >= 2 || Math.abs(near) >= 2) {
        var ref = Math.abs(far) >= 2 ? far : near;
        var où = Math.abs(far) >= 2 ? 'de loin' : 'de près';
        out.push(choice('ct-sens', 'covertest',
          'Dans quel sens se fait la déviation horizontale ' + où + ' ?',
          ['Ésodéviation — l’œil part en dedans', 'Exodéviation — l’œil part en dehors', 'Pas de déviation horizontale'],
          ref < -1 ? 0 : ref > 1 ? 1 : 2,
          'Le sens se lit sur le mouvement de <b>reprise</b> : un œil qui revient de dehors en dedans était en exo, ' +
          'de dedans en dehors était en éso.'));
      }

      if (Math.abs(far) >= 2) {
        out.push(number('ct-far', 'covertest', 'Amplitude horizontale de loin', Math.abs(far), 2, 'Δ',
          'C’est la valeur qui neutralise le mouvement à la barre de prismes, pas celle qui « ressemble ».'));
      }
      if (Math.abs(near) >= 2) {
        out.push(number('ct-near', 'covertest', 'Amplitude horizontale de près', Math.abs(near), 2, 'Δ', null));
      }

      /* La comparaison loin / près est le cœur du raisonnement : c'est elle
         qui sépare une insuffisance de convergence d'un excès de divergence,
         et une ésotropie accommodative d'une paralysie du VI. */
      if (Math.abs(far) >= 2 || Math.abs(near) >= 2) {
        var d = near - far;
        out.push(choice('ct-comitance', 'covertest',
          'Comment l’angle se comporte-t-il entre loin et près ?',
          ['Nettement plus grand de près', 'Nettement plus grand de loin', 'Comparable de loin et de près'],
          d > 5 ? 0 : d < -5 ? 1 : 2,
          'Un angle qui se creuse <b>de près</b> oriente vers l’insuffisance de convergence ou l’excès de convergence ' +
          '(AC/A). Un angle plus grand <b>de loin</b> oriente vers l’excès de divergence ou une paralysie du VI.'));
      }

      if (Math.abs(v) >= 2) {
        out.push(choice('ct-vert', 'covertest',
          'Quel œil est le plus haut ?',
          ['L’œil droit (hypertropie OD)', 'L’œil gauche (hypertropie OG)'],
          v > 0 ? 0 : 1,
          'Nommer l’hypertropie du bon côté est le <b>premier</b> des trois pas de Parks-Bielschowsky : ' +
          'il élimine d’emblée quatre des huit muscles verticaux.'));
      }
      return out;
    },

    ppc: function (sim) {
      var p = sim.ppc;
      if (!p) return [];
      var b = p.breakCm;
      return [
        number('ppc-brk', 'ppc', 'Point de rupture', b, 1.5, 'cm', null),
        choice('ppc-interp', 'ppc',
          'Comment qualifiez-vous ce punctum proximum de convergence ?',
          ['Normal — rupture à moins de 6 cm', 'Limite — entre 6 et 10 cm', 'Pathologique — au-delà de 10 cm'],
          b < 6 ? 0 : b <= 10 ? 1 : 2,
          'On retient <b>6 cm</b> comme limite haute du normal et <b>10 cm</b> comme seuil franchement pathologique. ' +
          'Un recouvrement nettement plus éloigné que la rupture est un signe de fatigabilité, même si la rupture est correcte.')
      ];
    },

    motility: function (sim) {
      var m = sim.motility;
      var out = [choice('mot-normale', 'motility',
        'La motilité est-elle normale ?',
        ['Oui, ductions et versions libres et symétriques', 'Non, il existe un déficit'],
        m ? 1 : 0,
        'Une limitation présente en version mais absente en duction oriente vers un trouble supranucléaire, ' +
        'pas vers une atteinte musculaire.')];
      if (m && m.muscle) {
        out.push(choice('mot-muscle', 'motility',
          'Quel muscle est déficitaire ?', MUSCLES, MUSCLE_IDS.indexOf(m.muscle),
          'Le muscle se déduit des trois pas de Parks-Bielschowsky, il ne se devine pas : ' +
          'quel œil est le plus haut, dans quel regard latéral l’écart augmente, de quel côté l’inclinaison l’aggrave.'));
        out.push(choice('mot-eye', 'motility',
          'De quel œil ?', ['Œil droit', 'Œil gauche'], m.eye === 'od' ? 0 : 1,
          'Attention au piège de la loi de Hering : c’est le <b>synergiste controlatéral</b> qui paraît en hyperaction, ' +
          'et on lui attribue à tort le déficit.'));
      }
      return out;
    },

    binocular: function (sim) {
      var out = [];
      if (sim.worth) {
        var w = String(sim.worth);
        var idx = w.indexOf('dipl') === 0 ? 2 : (w === 'fusion' || w === 'crn') ? 0 : 1;
        out.push(choice('bin-worth', 'binocular',
          'Que conclut le test de Worth ?',
          ['Fusion — 4 points vus', 'Neutralisation — 2 ou 3 points, alternance possible', 'Diplopie — 5 points vus'],
          idx,
          'Deux points rouges : neutralisation de l’œil vert. Trois points verts : neutralisation de l’œil rouge. ' +
          'Cinq points : diplopie, donc pas de correspondance rétinienne normale utilisable.'));
      }
      if (sim.stereo !== undefined) {
        var s = sim.stereo;
        out.push(choice('bin-stereo', 'binocular',
          'Comment qualifiez-vous la vision stéréoscopique ?',
          ['Normale — 60″ ou mieux', 'Diminuée — entre 60 et 400″', 'Absente ou non mesurable'],
          s === null || s === undefined ? 2 : s <= 60 ? 0 : s <= 400 ? 1 : 2,
          'La stéréoscopie fine est le troisième degré de la vision binoculaire de Worth. ' +
          'Son absence chez un strabique ancien signe une neutralisation installée.'));
      }
      return out;
    },

    acuity: function (sim) {
      var a = sim.acuity;
      if (!a || a.odFar === undefined || a.osFar === undefined) return [];
      /* deux lignes d'écart sur l'échelle décimale : le seuil habituel
         au-delà duquel on parle d'amblyopie */
      var diff = a.odFar - a.osFar;
      var amb = Math.abs(diff) >= 0.25 ? (diff < 0 ? 1 : 2) : 0;
      return [choice('av-amb', 'acuity',
        'Y a-t-il une différence d’acuité significative entre les deux yeux ?',
        ['Non, acuités comparables', 'Oui, l’œil droit est le meilleur', 'Oui, l’œil gauche est le meilleur'],
        amb,
        'Un écart d’au moins deux lignes fait suspecter une amblyopie. Il faut alors la rattacher à sa cause : ' +
        'strabique, anisométropique, ou de privation.')];
    },

    fundus: function (sim) {
      var f = sim.fundus;
      if (!f) return [];
      var normal = (f.od === 'normal' || !f.od) && (f.os === 'normal' || !f.os);
      return [choice('fo-normal', 'fundus',
        'Le fond d’œil apporte-t-il un élément au dossier ?',
        ['Non, les deux fonds d’œil sont normaux', 'Oui, il existe une anomalie'],
        normal ? 0 : 1,
        'Un fond d’œil normal n’est pas un examen inutile dans un strabisme : il <b>élimine</b> ' +
        'un strabisme sensoriel, ce qui change entièrement la conduite à tenir.')];
    },

    colorvision: function (sim) {
      if (!sim.colorvision) return [];
      return [choice('cv-normal', 'colorvision',
        'Que conclut la vision des couleurs ?',
        ['Normale', 'Dyschromatopsie'],
        sim.colorvision === 'normal' ? 0 : 1,
        'Une dyschromatopsie d’axe rouge-vert est congénitale et stable ; une dyschromatopsie ' +
        'acquise d’axe bleu-jaune doit faire chercher une atteinte rétinienne ou du nerf optique.')];
    }
  };

  /* ---------- interface ---------- */

  /* Questions d'un examen pour un dossier donné. */
  function forTest(caseObj, testId) {
    var sim = (caseObj && caseObj.sim) || {};
    var build = BUILDERS[testId];
    return build ? build(sim) : [];
  }

  /* Tous les examens d'un dossier qui donnent lieu à une lecture. */
  function tests(caseObj) {
    return TESTS.filter(function (t) {
      return caseObj && caseObj.tests && caseObj.tests[t.id];
    });
  }

  /* Tout le bilan, question par question. */
  function all(caseObj) {
    var out = [];
    tests(caseObj).forEach(function (t) {
      out = out.concat(forTest(caseObj, t.id));
    });
    return out;
  }

  /* Correction d'un item. `given` : index pour un choix, nombre pour une valeur. */
  function check(item, given) {
    if (given === null || given === undefined || given === '') return { ok: false, empty: true };
    if (item.type === 'choice') {
      return { ok: Number(given) === item.answer, expected: item.options[item.answer] };
    }
    var v = parseFloat(given);
    if (isNaN(v)) return { ok: false, empty: true };
    var off = Math.abs(v - item.answer);
    return { ok: off <= item.tol, expected: item.answer + (item.unit ? ' ' + item.unit : ''), off: off };
  }

  function score(items, answers) {
    var n = 0, ok = 0;
    items.forEach(function (it) {
      n++;
      if (check(it, answers[it.id]).ok) ok++;
    });
    return { n: n, ok: ok, pct: n ? Math.round((ok / n) * 100) : 0 };
  }

  window.Reading = {
    testById: testById, forTest: forTest, tests: tests, all: all,
    check: check, score: score
  };
})();
