/* ============================================================
   Rééducation orthoptique — prise en charge au long cours
   ------------------------------------------------------------
   L'application savait diagnostiquer, pas traiter. Ce module
   simule le suivi d'un patient sur plusieurs séances :
     · on choisit les exercices et la fréquence à domicile,
     · le patient évolue séance après séance selon un modèle
       (pertinence de l'exercice, observance, rendements
       décroissants à l'approche des normes),
     · on re-mesure quand on veut, dans les vrais simulateurs,
       réglés sur l'état courant du patient,
     · le bilan final note le protocole, le résultat et le
       nombre de séances qu'il a fallu.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  /* ---------------- Métriques suivies ---------------- */
  /* dir : -1 = « plus bas c'est mieux », +1 = « plus haut c'est mieux » */
  var METRICS = {
    ppcB:   { label: 'PPC — rupture',            unit: 'cm',   norm: 8,   dir: -1, floor: 4,  ceil: 40 },
    ppcR:   { label: 'PPC — recouvrement',       unit: 'cm',   norm: 12,  dir: -1, floor: 6,  ceil: 45 },
    be:     { label: 'Convergence fusionnelle VP', unit: 'Δ',  norm: 30,  dir: 1,  floor: 4,  ceil: 45 },
    bi:     { label: 'Divergence fusionnelle VP',  unit: 'Δ',  norm: 21,  dir: 1,  floor: 4,  ceil: 30 },
    accFac: { label: 'Souplesse accommodative',  unit: 'c/min', norm: 8,  dir: 1,  floor: 0,  ceil: 14 },
    av:     { label: 'Acuité de l’œil amblyope', unit: '',     norm: 0.8, dir: 1,  floor: 0.05, ceil: 1.2 },
    supp:   { label: 'Suppression',              unit: '%',    norm: 15,  dir: -1, floor: 0,  ceil: 100 },
    sympt:  { label: 'Gêne ressentie',           unit: '/100', norm: 20,  dir: -1, floor: 5,  ceil: 100 }
  };

  /* ---------------- Bibliothèque d'exercices ---------------- */
  var EXERCISES = [
    { id: 'pushup', name: 'Push-up de convergence', ic: '✏️',
      aim: 'Convergence volontaire et fusionnelle',
      dose: '3 × 10 rapprochements, 2 fois par jour',
      how: 'Une cible fine (crayon, lettre) approchée lentement de la racine du nez, en gardant l’image unique. On s’arrête au dédoublement, on recule de 2 cm, on recommence.',
      gains: { ppcB: -2.6, ppcR: -2.6, be: 1.8 }, forProfiles: ['ic'], contra: ['exces'] },

    { id: 'brock', name: 'Cordon de Brock', ic: '🧶',
      aim: 'Convergence + contrôle de la suppression',
      dose: '5 minutes, 2 fois par jour, perles à 15 / 40 / 80 cm',
      how: 'Un cordon tendu du nez à un point fixe, trois perles. En fixant une perle on doit voir <b>deux cordons qui se croisent exactement dessus</b> : c’est la diplopie physiologique, preuve que les deux yeux travaillent. Un seul cordon = un œil neutralise.',
      gains: { ppcB: -2.0, be: 1.8, supp: -9 }, forProfiles: ['ic', 'amblyopie'], contra: ['exces'], demo: 'brock' },

    { id: 'stereoConv', name: 'Stéréogrammes en convergence', ic: '🃏',
      aim: 'Amplitude de convergence fusionnelle',
      dose: '10 minutes par jour, écarts croissants',
      how: 'Deux mires identiques côte à côte. En convergeant, on fusionne les images centrales : on en perçoit trois, celle du milieu en relief. On écarte progressivement les mires.',
      gains: { be: 4.2, ppcB: -1.4 }, forProfiles: ['ic'], contra: ['exces'], demo: 'stereo' },

    { id: 'stereoDiv', name: 'Stéréogrammes en divergence', ic: '🎴',
      aim: 'Amplitude de divergence fusionnelle',
      dose: '10 minutes par jour',
      how: 'Même principe, mais en regardant « au loin à travers » la feuille. C’est l’exercice de l’ésophorie de près et de l’excès de convergence.',
      gains: { bi: 4.2, sympt: -2 }, forProfiles: ['exces'], contra: [], demo: 'stereo' },

    { id: 'jump', name: 'Prismes en saut', ic: '🔺',
      aim: 'Vergences en saut (réponse rapide)',
      dose: '2 × 20 sauts, prismes croissants',
      how: 'On interpose brutalement un prisme devant un œil : le patient doit refusionner immédiatement. On augmente la puissance quand la refusion devient instantanée.',
      gains: { be: 2.0, bi: 2.0, sympt: -4 }, forProfiles: ['ic', 'exces'], contra: [] },

    { id: 'flipVerg', name: 'Flippers prismatiques', ic: '🔄',
      aim: 'Souplesse de vergence',
      dose: '3Δ BI / 12Δ BE, 2 minutes, compter les cycles',
      how: 'On alterne base interne et base externe : ce n’est plus l’amplitude qu’on entraîne mais la <b>vitesse</b> de réponse. Norme : 15 cycles/minute en vision de près.',
      gains: { be: 1.6, bi: 1.6, sympt: -5 }, forProfiles: ['ic', 'exces'], contra: [] },

    { id: 'flipAcc', name: 'Flippers accommodatifs ±2,00 D', ic: '👓',
      aim: 'Souplesse accommodative',
      dose: '2 minutes par œil puis en binoculaire',
      how: 'Lecture alternée à travers +2,00 puis −2,00 D. Norme binoculaire : 8 cycles/minute chez l’adulte, 5 chez l’enfant.',
      gains: { accFac: 2.2, sympt: -4 }, forProfiles: ['accInsuff', 'exces'], contra: [] },

    { id: 'hart', name: 'Cartes de Hart', ic: '🔡',
      aim: 'Souplesse accommodative et saccades',
      dose: 'Une carte de loin, une de près, lecture alternée',
      how: 'Deux grilles de lettres, l’une à 3 m, l’autre à 40 cm. On lit une lettre de loin, une de près, en alternance : accommodation et saccades sont sollicitées ensemble.',
      gains: { accFac: 1.6, sympt: -2 }, forProfiles: ['accInsuff', 'amblyopie'], contra: [], demo: 'hart' },

    { id: 'antiSupp', name: 'Filtres rouge / vert, barre de lecture', ic: '🟥',
      aim: 'Anti-suppression, vision binoculaire simultanée',
      dose: '10 minutes de lecture par jour',
      how: 'Lunettes rouge-vert sur un texte, ou barre de lecture : chaque œil ne voit qu’une partie du texte, la lecture n’est possible que si les deux yeux participent.',
      gains: { supp: -13, sympt: -2 }, forProfiles: ['amblyopie', 'ic'], contra: [] },

    { id: 'occl', name: 'Occlusion / pénalisation', ic: '🩹',
      aim: 'Traitement de l’amblyopie',
      dose: '2 à 6 h/jour selon l’âge et la profondeur, avec activités de près',
      how: 'On occlut l’œil dominant pour forcer l’usage de l’œil amblyope, avec des activités fines. Toujours <b>après</b> correction optique totale portée plusieurs semaines, et sous surveillance de l’œil occlus.',
      gains: { av: 0.13, supp: -7 }, forProfiles: ['amblyopie'], contra: ['ic', 'exces', 'accInsuff'] },

    { id: 'saccades', name: 'Poursuites et saccades', ic: '👀',
      aim: 'Motricité oculaire, lecture',
      dose: '5 minutes, cibles alternées',
      how: 'Poursuite lente d’une cible, puis saccades entre deux cibles écartées. Utile dans les troubles neurovisuels et les difficultés de lecture.',
      gains: { sympt: -3, accFac: 0.5 }, forProfiles: ['accInsuff', 'amblyopie', 'ic', 'exces'], contra: [] },

    { id: 'synopto', name: 'Synoptophore', ic: '🔬',
      aim: 'Fusion, amplitudes, stéréoscopie',
      dose: 'Séance au cabinet, mires de plus en plus fines',
      how: 'Perception simultanée, puis fusion avec mires à contrôle, puis amplitudes en convergence et divergence, puis stéréoscopie. C’est l’outil du cabinet, à compléter par le travail à domicile.',
      gains: { be: 2.2, bi: 2.2, supp: -7 }, forProfiles: ['ic', 'exces', 'amblyopie'], contra: [] }
  ];

  function exById(id) { return EXERCISES.filter(function (e) { return e.id === id; })[0]; }

  /* ---------------- Profils de patients ---------------- */
  var PROFILES = [
    { id: 'ic', name: 'Camille R.', age: 21, job: 'Étudiante en droit',
      dx: 'Insuffisance de convergence',
      motif: 'Maux de tête et vision double en fin de journée quand je révise.',
      start: { ppcB: 19, ppcR: 25, be: 11, bi: 18, accFac: 6, supp: 25, sympt: 78 },
      watch: ['ppcB', 'be', 'sympt'],
      key: 'Rapprocher le PPC et remonter la convergence fusionnelle, puis entretenir.' },

    { id: 'exces', name: 'Théo B.', age: 15, job: 'Lycéen',
      dx: 'Excès de convergence (ésophorie de près, AC/A élevé)',
      motif: 'Ça tire derrière les yeux dès que je lis, et les lettres se brouillent.',
      start: { ppcB: 5, ppcR: 7, be: 36, bi: 7, accFac: 4, supp: 10, sympt: 72 },
      watch: ['bi', 'accFac', 'sympt'],
      key: 'Divergence et souplesse accommodative. Les exercices de convergence aggravent ce patient.' },

    { id: 'accInsuff', name: 'Nina P.', age: 13, job: 'Collégienne',
      dx: 'Insuffisance accommodative',
      motif: 'Je n’arrive plus à lire longtemps, ça devient flou et j’ai mal à la tête.',
      start: { ppcB: 12, ppcR: 16, be: 19, bi: 14, accFac: 2.5, supp: 12, sympt: 68 },
      watch: ['accFac', 'sympt'],
      key: 'Souplesse et amplitude accommodatives, en monoculaire puis en binoculaire.' },

    { id: 'amblyopie', name: 'Lucas M.', age: 6, job: 'CP',
      dx: 'Amblyopie fonctionnelle anisométropique de l’œil gauche',
      motif: 'Correction portée depuis six semaines, l’œil gauche reste à 3/10.',
      start: { av: 0.3, supp: 72, be: 20, bi: 14, ppcB: 9, ppcR: 12, accFac: 7, sympt: 30 },
      watch: ['av', 'supp'],
      key: 'Occlusion et activités de près, anti-suppression ensuite. La correction optique totale est déjà portée.' }
  ];

  function profileById(id) { return PROFILES.filter(function (p) { return p.id === id; })[0]; }

  /* ---------------- Modèle d'évolution ---------------- */

  /* observance : ni trop peu, ni trop — l'optimum est autour de 5 séances/semaine */
  function adherence(freq) {
    // sans travail à domicile, la séance hebdomadaire seule ne fait presque rien :
    // c'est la répétition quotidienne qui rééduque
    if (freq === 0) return 0.12;
    var a = 1 - Math.pow((freq - 5) / 9, 2) * 0.75;
    return Math.max(0.3, Math.min(1, a));
  }

  function clampMetric(k, v) {
    var m = METRICS[k];
    return Math.max(m.floor, Math.min(m.ceil, v));
  }

  /* Marge de progression restante. Les gains s'amenuisent nettement à
     l'approche de la norme, et deviennent négligeables au-delà : on ne
     transforme pas un patient rééduqué en athlète de la vergence. */
  function headroom(k, value, start) {
    var m = METRICS[k];
    var total = Math.abs(start - m.norm);
    if (total < 0.001) return 0.05;
    var left = m.dir > 0 ? m.norm - value : value - m.norm;
    if (left <= 0) return 0.05;                       // déjà dans la norme
    return Math.max(0.08, Math.pow(Math.min(1, left / total), 1.4));
  }

  /* une métrique est-elle dans la norme ? */
  function reached(k, v) {
    var m = METRICS[k];
    return m.dir > 0 ? v >= m.norm : v <= m.norm;
  }

  /* progression 0..1 d'une métrique entre son point de départ et la norme */
  function progressOf(k, v, start) {
    var m = METRICS[k];
    var total = m.dir > 0 ? m.norm - start : start - m.norm;
    if (total <= 0) return 1;
    var made = m.dir > 0 ? v - start : start - v;
    return Math.max(0, Math.min(1, made / total));
  }

  function runSession(sess) {
    var p = profileById(sess.profile);
    var adh = adherence(sess.freq);
    var progList = sess.program.slice();
    var dilution = progList.length > 4 ? Math.pow(0.85, progList.length - 4) : 1;
    var before = JSON.parse(JSON.stringify(sess.state));
    var misfit = 0;

    progList.forEach(function (id) {
      var ex = exById(id);
      if (!ex) return;
      var relevant = ex.forProfiles.indexOf(p.id) >= 0;
      var contra = ex.contra.indexOf(p.id) >= 0;
      if (contra) {
        // un exercice contre-indiqué ne fait pas progresser et fatigue le patient
        sess.state.sympt = clampMetric('sympt', sess.state.sympt + 5);
        misfit += 1;
        return;
      }
      if (!relevant) misfit += 0.5;
      var relFactor = relevant ? 1 : 0.2;

      Object.keys(ex.gains).forEach(function (k) {
        if (sess.state[k] === undefined) return;
        // 0,55 : un exercice bien conduit fait gagner peu par semaine —
        // une rééducation aboutie demande une douzaine de séances
        var g = ex.gains[k] * 0.55 * adh * dilution * relFactor;
        g *= headroom(k, sess.state[k], sess.startState[k]);
        g *= 0.8 + Math.random() * 0.4;                  // variabilité individuelle
        sess.state[k] = clampMetric(k, sess.state[k] + g);
      });
    });

    // la gêne suit la progression MOYENNE des paramètres surveillés :
    // le patient ne va mieux que si l'ensemble du tableau s'améliore
    var keys = p.watch.filter(function (k) { return k !== 'sympt'; });
    var gained = keys.reduce(function (a, k) {
      return a + (progressOf(k, sess.state[k], sess.startState[k]) - progressOf(k, before[k], sess.startState[k]));
    }, 0) / Math.max(1, keys.length);
    sess.state.sympt = clampMetric('sympt', sess.state.sympt - gained * 52 - (progList.length ? 0.8 : -3));

    sess.week++;
    sess.misfit += misfit;
    sess.exCount += progList.length;
    sess.history.push({
      week: sess.week,
      state: JSON.parse(JSON.stringify(sess.state)),
      program: progList.slice(),
      freq: sess.freq,
      adh: adh
    });
    return { adh: adh, misfit: misfit };
  }

  /* mot du patient à chaque séance */
  function patientSays(sess) {
    var p = profileById(sess.profile);
    var adh = adherence(sess.freq);
    var prog = p.watch.filter(function (k) { return k !== 'sympt'; }).reduce(function (a, k) {
      return a + progressOf(k, sess.state[k], sess.startState[k]);
    }, 0) / Math.max(1, p.watch.filter(function (k) { return k !== 'sympt'; }).length);

    if (sess.week === 0) return '« On m’a dit que ça se rééduquait. Je fais quoi, exactement ? »';
    if (sess.freq === 0) return '« Vous ne m’avez rien donné à faire à la maison, alors je n’ai rien fait. »';
    if (adh < 0.55 && sess.freq > 8) return '« Franchement, autant d’exercices par semaine, je n’y arrive pas. J’en ai sauté la moitié. »';
    if (adh < 0.55) return '« Je n’ai fait les exercices qu’une ou deux fois, je n’ai pas vu de différence. »';
    if (sess.state.sympt > 60) return '« C’est toujours pareil, ça tire dès que je lis vingt minutes. »';
    if (prog > 0.75) return '« Là, franchement, je ne me rends plus compte que je force. Je peux lire une soirée entière. »';
    if (prog > 0.4) return '« Ça va mieux, j’ai encore des moments difficiles le soir mais c’est net. »';
    return '« Je sens un petit mieux, mais c’est encore fatigant. »';
  }

  /* ---------------- Démonstrations d'exercices ---------------- */

  function demoBrock() {
    var st = { bead: 1 };                       // 0 = proche, 1 = milieu, 2 = loin
    var holder = el('div', { class: 'stage', style: { minHeight: '210px' } });
    var BEADS = [{ d: 15, c: '#f87171' }, { d: 40, c: '#4ade80' }, { d: 80, c: '#fbbf24' }];

    function draw() {
      UI.clear(holder);
      var W = 620, H = 200, noseX = 40, farX = 560, cy = 100;
      var g = s('svg', { viewBox: '0 0 ' + W + ' ' + H, style: 'width:100%;height:auto' });
      var fx = noseX + (farX - noseX) * (BEADS[st.bead].d / 90);

      // les deux yeux
      [-26, 26].forEach(function (dy) {
        g.appendChild(s('ellipse', { cx: noseX, cy: cy + dy, rx: 16, ry: 11, fill: '#eef3f7' }));
        g.appendChild(s('circle', { cx: noseX + 5, cy: cy + dy, r: 5, fill: '#2b4a63' }));
      });

      // cordon vu par chaque œil : les deux images se croisent sur la perle fixée
      [-26, 26].forEach(function (dy, i) {
        var col = i === 0 ? '#58a6ff' : '#f472b6';
        g.appendChild(s('path', {
          d: 'M ' + noseX + ' ' + (cy + dy) + ' L ' + fx + ' ' + cy + ' L ' + farX + ' ' + (cy - dy * 0.55),
          fill: 'none', stroke: col, 'stroke-width': 2.4, opacity: 0.85
        }));
      });

      BEADS.forEach(function (b, i) {
        var x = noseX + (farX - noseX) * (b.d / 90);
        g.appendChild(s('circle', { cx: x, cy: cy, r: i === st.bead ? 11 : 8, fill: b.c,
          stroke: i === st.bead ? '#fff' : 'none', 'stroke-width': 2 }));
        g.appendChild(s('text', { x: x, y: cy + 34, 'text-anchor': 'middle', 'font-size': 11, fill: '#9dadbf' }, b.d + ' cm'));
      });
      g.appendChild(s('text', { x: farX, y: cy - 44, 'text-anchor': 'end', 'font-size': 11, fill: '#64748b' }, 'point d’attache'));
      holder.appendChild(el('div', { class: 'stage-label', text: 'Ce que voit le patient — diplopie physiologique' }));
      holder.appendChild(g);
      holder.appendChild(el('div', { class: 'stage-hud' }, [
        el('span', { class: 'hud-tag', text: 'Fixation sur la perle à ' + BEADS[st.bead].d + ' cm' }),
        el('span', { class: 'hud-tag', style: { color: '#8ef0c9' }, text: 'Les deux cordons se croisent exactement sur la perle fixée : les deux yeux travaillent' })
      ]));
    }

    draw();
    return el('div', {}, [
      holder,
      el('div', { class: 'btn-row', style: { marginTop: '10px' } }, BEADS.map(function (b, i) {
        return UI.btn('Fixer la perle à ' + b.d + ' cm', function () { st.bead = i; draw(); }, i === st.bead ? 'primary' : '');
      })),
      UI.note('Le croisement en <b>X</b> doit tomber <b>sur</b> la perle fixée. Devant la perle : sur-convergence. ' +
        'Derrière : sous-convergence. <b>Un seul cordon visible</b> = l’œil correspondant neutralise — c’est ce que l’exercice cherche à révéler puis à corriger.')
    ]);
  }

  function demoStereo() {
    var st = { sep: 60, mode: 'conv' };
    var holder = el('div', { class: 'stage', style: { minHeight: '200px' } });

    function draw() {
      UI.clear(holder);
      var W = 620, H = 190, cy = 80;
      var g = s('svg', { viewBox: '0 0 ' + W + ' ' + H, style: 'width:100%;height:auto' });
      var cx = W / 2;

      function mire(x, tag) {
        var gg = s('g', {});
        gg.appendChild(s('circle', { cx: x, cy: cy, r: 26, fill: 'none', stroke: '#e9eff6', 'stroke-width': 2.5 }));
        gg.appendChild(s('circle', { cx: x, cy: cy, r: 9, fill: '#2dd4bf' }));
        gg.appendChild(s('text', { x: x, y: cy + 46, 'text-anchor': 'middle', 'font-size': 10, fill: '#64748b' }, tag));
        return gg;
      }
      g.appendChild(mire(cx - st.sep, 'mire gauche'));
      g.appendChild(mire(cx + st.sep, 'mire droite'));

      // ce qui est perçu après fusion : trois images, celle du milieu en relief
      var py = 150;
      [-st.sep, 0, st.sep].forEach(function (dx, i) {
        var mid = i === 1;
        g.appendChild(s('circle', { cx: cx + dx * 0.6, cy: py, r: mid ? 17 : 12, fill: 'none',
          stroke: mid ? '#2dd4bf' : 'rgba(233,239,246,.35)', 'stroke-width': mid ? 2.5 : 1.5 }));
        if (mid) g.appendChild(s('circle', { cx: cx, cy: py, r: 6, fill: '#2dd4bf' }));
      });
      g.appendChild(s('text', { x: 14, y: py + 4, 'font-size': 11, fill: '#9dadbf' }, 'perçu :'));

      holder.appendChild(el('div', { class: 'stage-label', text: st.mode === 'conv' ? 'Fusion en convergence' : 'Fusion en divergence' }));
      holder.appendChild(g);
      holder.appendChild(el('div', { class: 'stage-hud' }, [
        el('span', { class: 'hud-tag', text: 'Écart des mires : ' + Math.round(st.sep / 3) + ' cm' }),
        el('span', { class: 'hud-tag', text: 'Demande ≈ ' + Math.round(st.sep / 3 * 1.6) + ' Δ en ' + (st.mode === 'conv' ? 'convergence' : 'divergence') })
      ]));
    }

    draw();
    var slider = UI.range(20, 130, 5, 60, function (v) { st.sep = v; draw(); }, function (v) { return Math.round(v / 3) + ' cm'; });
    return el('div', {}, [
      holder,
      el('div', { class: 'mt16' }, UI.field('Écartement des mires', slider)),
      el('div', { class: 'btn-row' }, [
        UI.btn('Convergence', function () { st.mode = 'conv'; draw(); }),
        UI.btn('Divergence', function () { st.mode = 'div'; draw(); })
      ]),
      UI.note('Le patient doit percevoir <b>trois images</b>, celle du centre en relief et nette. ' +
        'On écarte les mires au fur et à mesure : l’écart maximal fusionné, c’est l’amplitude. ' +
        'En convergence on croise les axes ; en divergence on regarde « à travers » la feuille.')
    ]);
  }

  function demoHart() {
    var L = 'ZUAHNOSCKRVDFLPTEXMGB';
    function grid(size, cls) {
      var rows = [];
      for (var r = 0; r < 6; r++) {
        var line = '';
        for (var c = 0; c < 6; c++) line += L[(r * 7 + c * 3) % L.length] + ' ';
        rows.push(el('div', { text: line.trim() }));
      }
      return el('div', {
        class: 'optotype-screen ' + cls,
        style: { minHeight: 'auto', padding: '14px', fontSize: size, lineHeight: '1.5', letterSpacing: '.25em' }
      }, rows);
    }
    return el('div', {}, [
      el('div', { class: 'grid g2' }, [
        el('div', {}, [el('div', { class: 'muted small mb8', text: 'Carte de loin — 3 m' }), grid('19px', '')]),
        el('div', {}, [el('div', { class: 'muted small mb8', text: 'Carte de près — 40 cm' }), grid('13px', '')])
      ]),
      UI.note('On lit <b>une lettre de loin, une lettre de près</b>, en alternance, ligne par ligne. ' +
        'L’accommodation doit se relâcher et se reprendre à chaque saccade : c’est l’exercice de référence de la souplesse accommodative, ' +
        'et il travaille aussi les saccades de lecture.')
    ]);
  }

  var DEMOS = { brock: demoBrock, stereo: demoStereo, hart: demoHart };

  /* ---------------- Session (persiste entre deux écrans) ---------------- */
  var sess = null;

  function newSession(profileId) {
    var p = profileById(profileId);
    var state = JSON.parse(JSON.stringify(p.start));
    return {
      profile: profileId,
      state: state,
      startState: JSON.parse(JSON.stringify(state)),
      program: [],
      freq: 5,
      week: 0,
      misfit: 0,
      exCount: 0,
      finished: false,
      score: null,
      history: [{ week: 0, state: JSON.parse(JSON.stringify(state)), program: [], freq: 0, adh: 0 }]
    };
  }

  /* ---------------- Courbe d'évolution ---------------- */
  function chart(keys) {
    var W = 640, H = 190, padL = 34, padB = 24, padT = 12;
    var g = s('svg', { viewBox: '0 0 ' + W + ' ' + H, style: 'width:100%;height:auto' });
    var n = sess.history.length;
    var COLORS = { ppcB: '#58a6ff', ppcR: '#a78bfa', be: '#2dd4bf', bi: '#fbbf24', accFac: '#f472b6', av: '#4ade80', supp: '#f87171', sympt: '#f59e0b' };

    g.appendChild(s('line', { x1: padL, y1: H - padB, x2: W - 8, y2: H - padB, stroke: 'var(--line)' }));

    keys.forEach(function (k) {
      var m = METRICS[k];
      var lo = Math.min(m.norm, sess.startState[k], sess.state[k]) * 0.85;
      var hi = Math.max(m.norm, sess.startState[k], sess.state[k]) * 1.1;
      var y = function (v) { return padT + (H - padB - padT) * (1 - (v - lo) / Math.max(0.001, hi - lo)); };
      var x = function (i) { return padL + (W - padL - 10) * (n > 1 ? i / (n - 1) : 0); };

      // ligne de norme
      g.appendChild(s('line', { x1: padL, y1: y(m.norm), x2: W - 8, y2: y(m.norm),
        stroke: COLORS[k], 'stroke-dasharray': '4 5', opacity: 0.35 }));
      var d = sess.history.map(function (h, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(h.state[k]).toFixed(1); }).join(' ');
      g.appendChild(s('path', { d: d, fill: 'none', stroke: COLORS[k], 'stroke-width': 2.4 }));
      sess.history.forEach(function (h, i) {
        g.appendChild(s('circle', { cx: x(i), cy: y(h.state[k]), r: 3, fill: COLORS[k] }));
      });
      g.appendChild(s('text', { x: W - 10, y: y(sess.state[k]) - 6, 'text-anchor': 'end', 'font-size': 10, fill: COLORS[k] },
        m.label + ' ' + fmtVal(k, sess.state[k])));
    });

    sess.history.forEach(function (h, i) {
      if (i % Math.ceil(n / 8 || 1)) return;
      g.appendChild(s('text', { x: padL + (W - padL - 10) * (n > 1 ? i / (n - 1) : 0), y: H - 8,
        'text-anchor': 'middle', 'font-size': 10, fill: 'var(--txt-3)' }, 'S' + h.week));
    });
    return g;
  }

  function fmtVal(k, v) {
    var m = METRICS[k];
    var t = k === 'av' ? v.toFixed(2) : Math.abs(v) >= 10 ? Math.round(v) : (Math.round(v * 10) / 10);
    return t + (m.unit ? ' ' + m.unit : '');
  }

  /* ============================================================
     Module
     ============================================================ */
  M.rehab = {
    id: 'rehab', title: 'Rééducation', icon: '🧑‍🏫', group: 'Mise en situation',
    desc: 'Programme de rééducation orthoptique suivi séance après séance',
    keywords: 'reeducation orthoptique exercices convergence divergence accommodation amblyopie brock stereogramme flipper hart occlusion seance suivi programme',

    render: function () {
      var root = el('div');

      /* ---------- choix du patient ---------- */
      function chooser() {
        return el('div', {}, [
          UI.card('Qui prenez-vous en rééducation ?', el('div', { class: 'grid g2' }, PROFILES.map(function (p) {
            return el('div', { class: 'tool-card', onClick: function () { sess = newSession(p.id); App.go('rehab'); } }, [
              el('div', { class: 'flex', style: { marginBottom: '6px' } }, [
                el('h4', { style: { margin: 0 }, text: p.name + ', ' + p.age + ' ans' }),
                el('span', { class: 'spacer' }),
                UI.chip(p.job)
              ]),
              el('p', { style: { marginBottom: '8px' }, text: '« ' + p.motif + ' »' }),
              UI.chip(p.dx, 'blue')
            ]);
          }))),
          UI.card('Comment ça se passe', [
            el('div', { class: 'timeline' }, [
              el('span', { class: 'tl-step cur', text: '1 · Bilan de départ' }),
              el('span', { class: 'tl-step', text: '2 · Programme de séance' }),
              el('span', { class: 'tl-step', text: '3 · Semaines de travail' }),
              el('span', { class: 'tl-step', text: '4 · Re-mesures' }),
              el('span', { class: 'tl-step', text: '5 · Bilan de fin' })
            ]),
            UI.note('Chaque séance représente <b>une semaine</b>. Vous choisissez les exercices et la fréquence du travail à domicile ; ' +
              'le patient évolue en fonction de la <b>pertinence</b> du programme et de son <b>observance</b>. ' +
              'À tout moment vous pouvez re-mesurer dans les vrais simulateurs — ils sont réglés sur l’état actuel du patient.'),
            UI.note('Deux pièges reproduits ici : un exercice <b>contre-indiqué</b> (convergence chez un excès de convergence) ' +
              'n’améliore rien et aggrave la gêne ; un programme <b>trop chargé</b> fait chuter l’observance.', 'warn')
          ]),
          UI.card('Bibliothèque d’exercices', library())
        ]);
      }

      /* ---------- bibliothèque ---------- */
      function library() {
        return UI.accordion(EXERCISES.map(function (e) {
          var body = el('div', {}, [
            el('p', { html: '<b>Objectif :</b> ' + e.aim }),
            el('p', { html: '<b>Dosage :</b> ' + e.dose }),
            el('p', { html: e.how }),
            el('p', { class: 'small muted', html: '<b>Indiqué :</b> ' + e.forProfiles.map(function (id) { return profileById(id).dx; }).join(' · ') +
              (e.contra.length ? '<br><b style="color:var(--red)">Contre-indiqué :</b> ' + e.contra.map(function (id) { return profileById(id).dx; }).join(' · ') : '') }),
            e.demo ? DEMOS[e.demo]() : null
          ].filter(Boolean));
          return { title: e.ic + '  ' + e.name, tag: e.demo ? 'démonstration' : null, body: body };
        }));
      }

      /* ---------- suivi ---------- */
      function follow() {
        var p = profileById(sess.profile);
        var wrap = el('div');
        var metricsBox = el('div');
        var chartBox = el('div');
        var speech = el('div', { class: 'speech' });
        var journal = el('div', { class: 'log', style: { maxHeight: '420px' } });

        var watched = p.watch.concat(['sympt']).filter(function (k, i, a) { return a.indexOf(k) === i; });

        function drawState() {
          UI.clear(metricsBox);
          metricsBox.appendChild(el('div', { class: 'grid g4' }, watched.map(function (k) {
            var v = sess.state[k], m = METRICS[k];
            var pr = Math.round(progressOf(k, v, sess.startState[k]) * 100);
            return UI.metric(fmtVal(k, v), m.label + ' · norme ' + fmtVal(k, m.norm), pr,
              reached(k, v) ? 'var(--green)' : pr > 40 ? 'var(--amber)' : 'var(--red)');
          })));
          UI.clear(chartBox);
          chartBox.appendChild(chart(p.watch.filter(function (k) { return k !== 'sympt'; }).slice(0, 2)));
          UI.clear(speech);
          speech.appendChild(el('span', { class: 'who', text: p.name + ' — semaine ' + sess.week }));
          speech.appendChild(el('span', { text: patientSays(sess) }));
          drawJournal();
        }

        function drawJournal() {
          UI.clear(journal);
          sess.history.slice().reverse().forEach(function (h) {
            if (!h.week) { journal.appendChild(el('div', { class: 'log-line' }, el('b', { text: 'Bilan initial' }))); return; }
            journal.appendChild(el('div', { class: 'log-line' }, [
              el('span', { class: 't', text: 'S' + h.week }),
              el('b', { text: h.program.map(function (id) { return exById(id).ic; }).join(' ') || '— aucun exercice —' }),
              el('span', { text: ' ' + h.program.length + ' exercice' + (h.program.length > 1 ? 's' : '') +
                ', ' + h.freq + '/sem, observance ' + Math.round(h.adh * 100) + ' %' })
            ]));
          });
        }

        /* --- programme de la séance --- */
        var progBox = el('div', { class: 'grid g2' });
        function drawProgram() {
          UI.clear(progBox);
          EXERCISES.forEach(function (e) {
            var on = sess.program.indexOf(e.id) >= 0;
            progBox.appendChild(el('div', {
              class: 'tool-card', style: Object.assign({ padding: '10px 12px' }, on ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)' } : {}),
              onClick: function () {
                var i = sess.program.indexOf(e.id);
                if (i >= 0) sess.program.splice(i, 1); else sess.program.push(e.id);
                drawProgram();
              }
            }, [
              el('div', { class: 'flex' }, [
                el('span', { style: { fontSize: '17px' }, text: e.ic }),
                el('b', { text: e.name }),
                el('span', { class: 'spacer' }),
                on ? UI.chip('au programme', 'green') : null
              ].filter(Boolean)),
              el('p', { class: 'small', style: { margin: '4px 0 0' }, text: e.aim })
            ]));
          });
        }
        drawProgram();

        var freqNode = el('span', { class: 'mono', style: { color: 'var(--accent)' } });
        var adhNode = el('div', { class: 'small muted' });
        function drawFreq() {
          freqNode.textContent = sess.freq + ' séance' + (sess.freq > 1 ? 's' : '') + ' / semaine';
          var a = Math.round(adherence(sess.freq) * 100);
          adhNode.innerHTML = 'Observance prévisible : <b>' + a + ' %</b>' +
            (sess.freq === 0 ? ' — sans travail à domicile, la rééducation n’avance pas.'
             : sess.freq > 9 ? ' — trop lourd : le patient décroche.'
             : a >= 90 ? ' — rythme optimal.' : ' — acceptable.');
        }
        var freqRange = UI.range(0, 14, 1, 5, function (v) { sess.freq = v; drawFreq(); }, function (v) { return v + '/sem'; });
        drawFreq();

        /* --- re-mesures dans les simulateurs --- */
        function measureBtns() {
          var btns = [];
          if (sess.state.ppcB !== undefined) {
            btns.push(UI.btn('🎯 Re-mesurer le PPC', function () {
              App.openModule('ppc', { sim: { ppc: { breakCm: Math.round(sess.state.ppcB), recoveryCm: Math.round(sess.state.ppcR) } } }, {
                subtitle: p.name + ' — semaine ' + sess.week,
                banner: '🧑‍🏫 <b>Contrôle de rééducation</b> — le simulateur est réglé sur l’état <b>actuel</b> de ' + p.name + ' Mesurez la rupture et le recouvrement.'
              });
            }));
          }
          if (sess.state.be !== undefined) {
            btns.push(UI.btn('🔗 Re-mesurer les amplitudes de fusion', function () {
              App.openModule('binocular', { sim: {
                fusion: {
                  BE: { blur: Math.max(4, Math.round(sess.state.be * 0.6)), brk: Math.round(sess.state.be), rec: Math.round(sess.state.be * 0.5) },
                  BI: { blur: 0, brk: Math.round(sess.state.bi), rec: Math.round(sess.state.bi * 0.6) }
                },
                worth: sess.state.supp > 45 ? 'sup-os' : 'fusion',
                stereo: sess.state.supp > 45 ? 200 : 60
              } }, {
                subtitle: p.name + ' — semaine ' + sess.week,
                banner: '🧑‍🏫 <b>Contrôle de rééducation</b> — amplitudes de fusion actuelles de ' + p.name + ' Mesurez le flou, la rupture et le recouvrement.'
              });
            }));
          }
          if (sess.state.av !== undefined) {
            btns.push(UI.btn('🔠 Re-mesurer l’acuité', function () {
              App.openModule('acuity', { sim: { acuity: { odFar: 1.0, osFar: sess.state.av, odNear: 1.0, osNear: sess.state.av } } }, {
                subtitle: p.name + ' — semaine ' + sess.week,
                banner: '🧑‍🏫 <b>Contrôle de rééducation</b> — acuité actuelle de l’œil amblyope de ' + p.name + ' Mesurez l’œil gauche.'
              });
            }));
          }
          return btns;
        }

        function nextSession() {
          if (!sess.program.length && sess.freq > 0) {
            UI.toast('Choisissez au moins un exercice pour cette séance.');
            return;
          }
          var r = runSession(sess);
          drawState();
          UI.toast('Semaine ' + sess.week + ' — observance ' + Math.round(r.adh * 100) + ' %' +
            (r.misfit ? ' · programme partiellement inadapté' : ''));
        }

        drawState();

        wrap.appendChild(UI.card(null, [
          el('div', { class: 'flex' }, [
            el('div', { style: { fontSize: '34px' } }, '🧑‍🏫'),
            el('div', {}, [
              el('h2', { style: { margin: 0 }, text: p.name + ', ' + p.age + ' ans' }),
              el('div', { class: 'muted small', text: p.dx })
            ]),
            el('span', { class: 'spacer' }),
            UI.chip('Semaine ' + sess.week, 'blue'),
            UI.btn('Changer de patient', function () { sess = null; App.go('rehab'); })
          ]),
          speech
        ]));

        wrap.appendChild(UI.card('Où en est le patient', [
          metricsBox,
          el('div', { class: 'mt16' }, chartBox),
          el('div', { class: 'btn-row mt16' }, measureBtns().concat([
            el('span', { class: 'muted small', text: 'Les simulateurs sont réglés sur les valeurs actuelles — comme un vrai contrôle.' })
          ]))
        ]));

        wrap.appendChild(el('div', { class: 'split' }, [
          UI.card('Programme de la séance', [
            progBox,
            el('div', { class: 'mt16' }, UI.field('Travail à domicile', el('div', {}, [freqRange, freqNode, adhNode]))),
            el('div', { class: 'btn-row mt16' }, [
              UI.btn('▶ Séance suivante (une semaine)', nextSession, 'primary'),
              UI.btn('Vider le programme', function () { sess.program = []; drawProgram(); }),
              UI.btn('Terminer la prise en charge', function () {
                sess.finished = true;
                App.go('rehab');
              })
            ])
          ]),
          UI.card('Journal des séances', journal)
        ]));

        wrap.appendChild(UI.card('Bibliothèque d’exercices', library()));
        return wrap;
      }

      /* ---------- bilan final ---------- */
      function report() {
        var p = profileById(sess.profile);
        var keys = p.watch;

        var outcome = keys.reduce(function (a, k) { return a + progressOf(k, sess.state[k], sess.startState[k]); }, 0) / keys.length;
        var pertinence = sess.exCount ? Math.max(0, 1 - (sess.misfit / sess.exCount) * 1.6) : 0;
        // 12 à 15 séances, c'est la durée attendue d'une rééducation aboutie
        var ideal = 15;
        var efficiency = sess.week === 0 ? 0 : sess.week <= ideal ? 1 : Math.max(0.2, 1 - (sess.week - ideal) * 0.06);

        var score = Math.round(outcome * 60 + pertinence * 25 + efficiency * 15);
        if (sess.score === null) {
          sess.score = score;
          Store.recordScore('rehab', score, { weeks: sess.week, profile: p.id });
        }

        var rows = keys.concat(['sympt']).filter(function (k, i, a) { return a.indexOf(k) === i; }).map(function (k) {
          var m = METRICS[k];
          return [
            m.label,
            fmtVal(k, sess.startState[k]),
            fmtVal(k, sess.state[k]),
            fmtVal(k, m.norm),
            el('span', { style: { color: reached(k, sess.state[k]) ? 'var(--green)' : 'var(--amber)', fontWeight: '700' },
              text: reached(k, sess.state[k]) ? 'dans la norme' : Math.round(progressOf(k, sess.state[k], sess.startState[k]) * 100) + ' % du chemin' })
          ];
        });

        var used = {};
        sess.history.forEach(function (h) { h.program.forEach(function (id) { used[id] = (used[id] || 0) + 1; }); });
        var badOnes = Object.keys(used).filter(function (id) { return exById(id).contra.indexOf(p.id) >= 0; });
        var missed = EXERCISES.filter(function (e) { return e.forProfiles.indexOf(p.id) >= 0 && !used[e.id]; });

        return el('div', {}, [
          UI.card('Bilan de la prise en charge', [
            el('div', { class: 'grid g4' }, [
              UI.stat(score + ' %', 'Note globale', score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)'),
              UI.stat(Math.round(outcome * 100) + ' %', 'Résultat clinique'),
              UI.stat(Math.round(pertinence * 100) + ' %', 'Pertinence du protocole'),
              UI.stat(sess.week + ' sem.', 'Durée', sess.week <= 12 ? 'var(--green)' : 'var(--amber)')
            ]),
            UI.table(['Paramètre', 'Départ', 'Fin', 'Norme', 'Résultat'], rows)
          ]),

          UI.card('Ce que dit ce bilan', [
            UI.note(score >= 75
              ? '<b>Prise en charge réussie.</b> ' + p.key + ' Les paramètres cibles sont normalisés ou tout proches, dans un nombre de séances réaliste.'
              : score >= 50
                ? '<b>Résultat partiel.</b> Regardez la colonne « résultat » : ce qui n’a pas bougé indique un exercice manquant ou une observance trop faible.'
                : '<b>Échec de la prise en charge.</b> ' + p.key,
              score >= 50 ? '' : 'warn'),
            badOnes.length ? UI.note('⚠️ Vous avez utilisé <b>' + badOnes.map(function (id) { return exById(id).name; }).join(', ') +
              '</b> chez un patient où cet exercice est <b>contre-indiqué</b> : il n’a rien apporté et a majoré la gêne.', 'red') : null,
            missed.length ? UI.note('Exercices indiqués jamais utilisés : <b>' + missed.map(function (e) { return e.name; }).join(', ') + '</b>.') : null,
            UI.note('Rappel clinique : une rééducation d’insuffisance de convergence donne d’excellents résultats en <b>10 à 15 séances</b>, ' +
              'à condition d’un travail à domicile régulier. On termine toujours par une phase d’<b>entretien</b> et un contrôle à distance, ' +
              'car les récidives existent, surtout en période d’examens.')
          ].filter(Boolean)),

          UI.card('Évolution', chart(p.watch.filter(function (k) { return k !== 'sympt'; }).slice(0, 2))),

          el('div', { class: 'btn-row' }, [
            UI.btn('🧑‍🏫 Un autre patient', function () { sess = null; App.go('rehab'); }, 'primary'),
            UI.btn('Refaire ce patient', function () { sess = newSession(p.id); App.go('rehab'); }),
            UI.btn('Voir ma progression', function () { App.go('progress'); })
          ])
        ]);
      }

      root.appendChild(!sess ? chooser() : sess.finished ? report() : follow());

      return UI.page({
        crumb: 'Mise en situation',
        title: sess && !sess.finished ? 'Rééducation en cours' : 'Rééducation orthoptique',
        subtitle: sess && !sess.finished
          ? 'Une séance = une semaine. Choisissez les exercices, dosez le travail à domicile, re-mesurez, adaptez.'
          : 'Le diagnostic ne suffit pas : il faut traiter. Prenez un patient en rééducation, construisez son programme ' +
            'et suivez-le semaine après semaine jusqu’à la normalisation — ou l’échec.'
      }, [root]);
    }
  };
})();
