/* ============================================================
   Anatomie interactive — coupe du globe, muscles, innervation
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el, s = UI.svg;

  /* Une zone SVG cliquable doit aussi être atteignable au clavier :
     tabindex + rôle + activation par Entrée / Espace. */
  function pickable(node, label, onPick) {
    node.setAttribute('tabindex', '0');
    node.setAttribute('role', 'button');
    if (label) node.setAttribute('aria-label', label);
    node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(); }
    });
    return node;
  }

  /* ---- Structures de la coupe sagittale ---- */
  var PARTS = {
    cornee: { name: 'Cornée', txt: 'Lentille transparente avasculaire de +43 D. 5 couches : épithélium, Bowman, stroma (90 %), Descemet, endothélium. Épaisseur centrale ~540 µm. Nourrie par le film lacrymal, l’humeur aqueuse et les vaisseaux limbiques. Innervation très dense (V1) : la structure la plus sensible du corps.' },
    sclere: { name: 'Sclère', txt: 'Coque fibreuse blanche des 5/6 postérieurs. Épaisseur 0,3 mm derrière les insertions musculaires (zone la plus fine), 1 mm au pôle postérieur. Insertion des 6 muscles oculomoteurs. Perforée en arrière par la lame criblée.' },
    iris: { name: 'Iris', txt: 'Diaphragme contractile. Muscle sphincter (parasympathique, III) → myosis ; muscle dilatateur (sympathique) → mydriase. Sa racine délimite l’angle irido-cornéen, lieu d’évacuation de l’humeur aqueuse (trabéculum, canal de Schlemm).' },
    cristallin: { name: 'Cristallin', txt: 'Lentille biconvexe de +20 D au repos, jusqu’à +33 D en accommodation maximale chez l’enfant. Capsule, épithélium, cortex, noyau. Avasculaire, transparent, croissance continue toute la vie (d’où la presbytie puis la cataracte).' },
    corpsciliaire: { name: 'Corps ciliaire', txt: 'Muscle ciliaire (accommodation, innervation parasympathique du III) + procès ciliaires qui sécrètent l’humeur aqueuse (2 à 3 µL/min). Cible des collyres hypotonisants (bêtabloquants, alpha-agonistes).' },
    choroide: { name: 'Choroïde', txt: 'Tunique vasculaire nourrissant le tiers externe de la rétine (photorécepteurs). Débit sanguin le plus élevé de l’organisme rapporté au poids. Choriocapillaire au contact de la membrane de Bruch et de l’épithélium pigmentaire.' },
    retine: { name: 'Rétine', txt: 'Tunique nerveuse de 10 couches, du feuillet interne du cupule optique. S’étend de la papille à l’ora serrata. Photorécepteurs → bipolaires → ganglionnaires. Épaisseur 0,25 mm au pôle postérieur, 0,1 mm à l’ora.' },
    macula: { name: 'Macula / fovéa', txt: 'Zone centrale de 5,5 mm. Fovéa (1,5 mm) puis fovéola (0,35 mm), exclusivement composée de cônes, avasculaire (zone avasculaire centrale de 0,5 mm). Responsable de l’acuité visuelle fine et de la vision des couleurs.' },
    papille: { name: 'Papille / nerf optique', txt: 'Émergence des ~1,2 million d’axones ganglionnaires. Diamètre 1,5 mm, tache aveugle physiologique située à 15° en temporal du point de fixation. Excavation physiologique C/D ≤ 0,3–0,4. Le nerf optique est un tractus du SNC, myélinisé par des oligodendrocytes.' },
    vitre: { name: 'Corps vitré', txt: '4 mL de gel (99 % d’eau, acide hyaluronique, collagène II). Adhérences fortes à la base du vitré, autour de la papille et de la macula. Son décollement postérieur donne myodésopsies et phosphènes, et peut déchirer la rétine.' },
    chambreant: { name: 'Chambre antérieure', txt: 'Espace entre cornée et iris, rempli d’humeur aqueuse. Profondeur centrale ~3 mm. Une chambre étroite est un facteur de risque de glaucome par fermeture de l’angle.' },
    musclerect: { name: 'Muscle droit', txt: 'Les 4 muscles droits naissent de l’anneau de Zinn et s’insèrent sur la sclère à distance croissante du limbe (spirale de Tillaux : 5,5 / 6,5 / 6,9 / 7,7 mm).' }
  };

  function eyeSVG(onPick, highlight) {
    var g = s('svg', { viewBox: '0 0 760 470', style: 'width:100%;height:auto;max-height:470px' });

    function hot(node, id) {
      var label = PARTS[id] ? PARTS[id].name : id;
      node.setAttribute('class', 'anat-hot');
      node.addEventListener('click', function () { onPick(id); });
      // zone cliquable atteignable au clavier et annoncée par son nom
      pickable(node, label, function () { onPick(id); });
      node.appendChild(s('title', {}, label));
      if (highlight === id) node.setAttribute('stroke-width', '5');
      return node;
    }

    // muscles droits (dessinés en arrière-plan, insérés près du limbe)
    g.appendChild(hot(s('path', { d: 'M 250 168 Q 430 132 650 146', fill: 'none', stroke: '#b8505c', 'stroke-width': 11, 'stroke-linecap': 'round' }), 'musclerect'));
    g.appendChild(hot(s('path', { d: 'M 250 302 Q 430 338 650 324', fill: 'none', stroke: '#b8505c', 'stroke-width': 11, 'stroke-linecap': 'round' }), 'musclerect'));

    // vitré / intérieur
    g.appendChild(s('circle', { cx: 380, cy: 235, r: 158, fill: '#0f1b26' }));
    g.appendChild(hot(s('circle', { cx: 400, cy: 235, r: 130, fill: 'rgba(120,190,230,.10)', stroke: 'none' }), 'vitre'));

    // sclère (arc)
    g.appendChild(hot(s('path', {
      d: 'M 232 175 A 160 160 0 1 1 232 295',
      fill: 'none', stroke: '#e7ecf1', 'stroke-width': 13, 'stroke-linecap': 'round'
    }), 'sclere'));

    // choroïde
    g.appendChild(hot(s('path', {
      d: 'M 240 182 A 148 148 0 1 1 240 288',
      fill: 'none', stroke: '#8a4b3f', 'stroke-width': 7
    }), 'choroide'));

    // rétine
    g.appendChild(hot(s('path', {
      d: 'M 246 189 A 140 140 0 1 1 246 281',
      fill: 'none', stroke: '#e0a86a', 'stroke-width': 6
    }), 'retine'));

    // cornée
    g.appendChild(hot(s('path', {
      d: 'M 232 175 Q 186 235 232 295',
      fill: 'rgba(160,220,255,.14)', stroke: '#9fd8f5', 'stroke-width': 8, 'stroke-linecap': 'round'
    }), 'cornee'));

    // chambre antérieure
    g.appendChild(hot(s('path', {
      d: 'M 234 178 Q 190 235 234 292 L 246 286 Q 268 235 246 184 Z',
      fill: 'rgba(150,215,255,.15)', stroke: 'none'
    }), 'chambreant'));

    // iris (2 volets, du corps ciliaire au bord pupillaire)
    g.appendChild(hot(s('path', { d: 'M 244 184 L 300 208', stroke: '#4fa3d8', 'stroke-width': 10, 'stroke-linecap': 'butt' }), 'iris'));
    g.appendChild(hot(s('path', { d: 'M 244 286 L 300 262', stroke: '#4fa3d8', 'stroke-width': 10, 'stroke-linecap': 'butt' }), 'iris'));

    // corps ciliaire
    g.appendChild(hot(s('path', { d: 'M 238 176 L 262 188 L 258 200 L 238 198 Z', fill: '#c98b4b' }), 'corpsciliaire'));
    g.appendChild(hot(s('path', { d: 'M 238 294 L 262 282 L 258 270 L 238 272 Z', fill: '#c98b4b' }), 'corpsciliaire'));
    // zonule
    g.appendChild(s('path', { d: 'M 262 190 L 300 208 M 262 280 L 300 262', stroke: '#7e8fa0', 'stroke-width': 1.6, 'stroke-dasharray': '3 3' }));

    // cristallin
    g.appendChild(hot(s('ellipse', { cx: 316, cy: 235, rx: 26, ry: 48, fill: 'rgba(200,230,255,.35)', stroke: '#bfe0f5', 'stroke-width': 2.5 }), 'cristallin'));

    // nerf optique
    g.appendChild(hot(s('path', { d: 'M 528 205 L 660 178', stroke: '#f2e2b8', 'stroke-width': 26, 'stroke-linecap': 'round' }), 'papille'));
    g.appendChild(hot(s('path', { d: 'M 528 205 L 660 178', stroke: '#d8c489', 'stroke-width': 4, 'stroke-dasharray': '5 7' }), 'papille'));
    g.appendChild(hot(s('circle', { cx: 524, cy: 208, r: 9, fill: '#f6d97a' }), 'papille'));

    // macula
    g.appendChild(hot(s('ellipse', { cx: 527, cy: 262, rx: 15, ry: 11, fill: '#8c4b2a' }), 'macula'));
    g.appendChild(hot(s('circle', { cx: 527, cy: 262, r: 4, fill: '#5e2a13' }), 'macula'));

    // légendes avec traits de rappel
    var labels = [
      [150, 118, 210, 200, 'Cornée', 'end'],
      [332, 116, 276, 194, 'Iris', 'middle'],
      [352, 360, 320, 288, 'Cristallin', 'middle'],
      [430, 428, 392, 390, 'Sclère', 'middle'],
      [636, 92, 596, 188, 'Nerf optique', 'middle'],
      [604, 306, 545, 268, 'Macula', 'start'],
      [724, 122, 648, 144, 'Muscles droits', 'end'],
      [430, 250, null, null, 'Vitré', 'middle'],
      [214, 350, 246, 300, 'Corps ciliaire', 'middle']
    ];
    labels.forEach(function (l) {
      if (l[2] !== null) {
        g.appendChild(s('line', { x1: l[0], y1: l[1] + 4, x2: l[2], y2: l[3], stroke: '#3d5266', 'stroke-width': 1, 'stroke-dasharray': '3 3' }));
      }
      g.appendChild(s('text', { x: l[0], y: l[1], fill: '#93aabd', 'font-size': '12.5', 'text-anchor': l[5] }, l[4]));
    });
    g.appendChild(s('text', { x: 20, y: 452, fill: '#5f7688', 'font-size': '11' }, 'Coupe horizontale — antérieur à gauche · cliquez une structure'));

    return g;
  }

  /* ---- Vue des muscles (vue supérieure de l’orbite droite) ---- */
  function musclesSVG(onPick) {
    var g = s('svg', { viewBox: '0 0 720 420', style: 'width:100%;height:auto' });
    // orbite
    g.appendChild(s('path', { d: 'M 620 60 L 620 360 L 150 260 L 150 160 Z', fill: 'rgba(120,150,175,.07)', stroke: '#3b4a58', 'stroke-dasharray': '5 5' }));
    // globe
    g.appendChild(s('circle', { cx: 220, cy: 210, r: 80, fill: '#132029', stroke: '#dfe6ec', 'stroke-width': 4 }));
    g.appendChild(s('path', { d: 'M 148 178 Q 118 210 148 242', fill: 'rgba(160,220,255,.16)', stroke: '#9fd8f5', 'stroke-width': 5 }));
    // anneau de Zinn
    g.appendChild(s('circle', { cx: 600, cy: 210, r: 22, fill: 'none', stroke: '#f0b23c', 'stroke-width': 3 }));
    g.appendChild(s('text', { x: 600, y: 258, fill: '#f0b23c', 'font-size': '11', 'text-anchor': 'middle' }, 'Anneau de Zinn'));

    function muscle(d, color, id, label, lx, ly) {
      var p = s('path', { d: d, fill: 'none', stroke: color, 'stroke-width': 12, 'stroke-linecap': 'round', class: 'anat-hot' });
      p.addEventListener('click', function () { onPick(id); });
      pickable(p, label || id, function () { onPick(id); });
      p.appendChild(s('title', {}, label));
      g.appendChild(p);
      g.appendChild(s('text', { x: lx, y: ly, fill: color, 'font-size': '12.5', 'font-weight': '600' }, label));
    }

    muscle('M 232 132 Q 400 96 588 192', '#4f9dfd', 'DS', 'Droit supérieur', 380, 84);
    muscle('M 232 288 Q 400 324 588 228', '#45cd7a', 'DI', 'Droit inférieur', 380, 350);
    muscle('M 300 210 L 578 210', '#ef5f6b', 'DM', 'Droit médial (vue de dessus : nasal)', 330, 200);
    // oblique supérieur avec trochlée
    g.appendChild(s('circle', { cx: 190, cy: 112, r: 9, fill: '#f0b23c' }));
    g.appendChild(s('text', { x: 176, y: 96, fill: '#f0b23c', 'font-size': '11' }, 'Trochlée'));
    muscle('M 190 112 L 578 178', '#a179f2', 'OS', 'Oblique supérieur', 380, 140);
    muscle('M 190 112 Q 250 130 288 172', '#a179f2', 'OS', '', 0, 0);
    muscle('M 170 300 Q 250 300 292 254', '#f0b23c', 'OI', 'Oblique inférieur', 176, 330);

    g.appendChild(s('text', { x: 20, y: 400, fill: '#5f7688', 'font-size': '11' }, 'Schéma de principe — cliquez un muscle pour sa fiche complète'));
    return g;
  }

  M.anatomy = {
    id: 'anatomy', title: 'Anatomie interactive', icon: '🫀', group: 'Savoir',
    desc: 'Coupe du globe cliquable, muscles oculomoteurs, innervation',
    keywords: 'anatomie coupe globe muscle zinn tillaux innervation nerf',
    render: function () {
      var info = el('div', { class: 'card', style: { minHeight: '190px' } });
      var quizBox = el('div');

      function showPart(id) {
        var p = PARTS[id];
        if (!p) return;
        UI.clear(info);
        info.appendChild(el('h2', { text: p.name }));
        info.appendChild(el('p', { class: 'selectable', text: p.txt }));
      }

      function showMuscle(id) {
        var m = Optics.Motility.muscles.filter(function (x) { return x.id === id; })[0];
        if (!m) return;
        UI.clear(info);
        info.appendChild(el('h2', { text: m.name }));
        info.appendChild(UI.kv('Innervation', m.nerve));
        info.appendChild(UI.kv('Action principale', m.primary));
        info.appendChild(UI.kv('Action secondaire', m.secondary));
        info.appendChild(UI.kv('Action tertiaire', m.tertiary));
        info.appendChild(UI.kv('Origine', m.origin));
        info.appendChild(UI.kv('Insertion', m.insertion));
        info.appendChild(UI.kv('Antagoniste homolatéral', Optics.Motility.muscles.filter(function (x) { return x.id === Optics.Motility.antagonist[m.id]; })[0].name));
        info.appendChild(el('div', { class: 'note', text: m.arc }));
      }

      /* --- Entraînement : trouver la structure --- */
      function buildQuiz() {
        UI.clear(quizBox);
        var keys = Object.keys(PARTS).filter(function (k, i, a) { return a.indexOf(k) === i; });
        var order = keys.slice().sort(function () { return Math.random() - 0.5; });
        var idx = 0, right = 0, total = 0;
        var prompt = el('div', { class: 'result-big' });
        var fb = el('div', { class: 'muted small', text: 'Cliquez la structure demandée sur le schéma.' });

        function next() {
          if (idx >= order.length) {
            var pct = Math.round((right / total) * 100);
            prompt.textContent = 'Terminé : ' + right + '/' + total;
            fb.textContent = 'Score ' + pct + ' %';
            Store.recordScore('anatomy', pct);
            return;
          }
          prompt.textContent = 'Trouvez : ' + PARTS[order[idx]].name;
        }

        var svgHolder = el('div', { class: 'card pad0', style: { padding: '10px' } });
        svgHolder.appendChild(eyeSVG(function (id) {
          if (idx >= order.length) return;
          total++;
          if (id === order[idx]) { right++; fb.innerHTML = '<span style="color:var(--green)">✔ Exact</span>'; }
          else fb.innerHTML = '<span style="color:var(--red)">✘ C’était ' + PARTS[id].name + '</span>';
          idx++;
          next();
        }));
        next();

        quizBox.appendChild(el('div', { class: 'card' }, [prompt, fb]));
        quizBox.appendChild(svgHolder);
      }

      var tabsNode = UI.tabs([
        { id: 'globe', label: '👁 Coupe du globe' },
        { id: 'muscles', label: '💪 Muscles oculomoteurs' },
        { id: 'nerfs', label: '⚡ Innervation' },
        { id: 'train', label: '🎯 Entraînement' }
      ], function (id) {
        if (id === 'globe') {
          showPart('cornee');
          return el('div', { class: 'split' }, [
            el('div', { class: 'card' }, eyeSVG(showPart)),
            info
          ]);
        }
        if (id === 'muscles') {
          showMuscle('DL');
          return el('div', {}, [
            el('div', { class: 'split' }, [
              el('div', { class: 'card' }, musclesSVG(showMuscle)),
              info
            ]),
            UI.card('Tableau récapitulatif',
              UI.table(['Muscle', 'Nerf', 'Principale', 'Secondaire', 'Tertiaire', 'Insertion'],
                Optics.Motility.muscles.map(function (m) {
                  return [m.name, m.nerve, m.primary, m.secondary, m.tertiary, m.insertion];
                }))),
            UI.card('Couples de Hering (synergistes controlatéraux)',
              UI.table(['Direction du regard', 'Œil droit', 'Œil gauche'],
                Optics.Motility.yokePairs.map(function (y) {
                  function nm(id) { return Optics.Motility.muscles.filter(function (m) { return m.id === id; })[0].name; }
                  return [y.gaze, nm(y.od), nm(y.os)];
                })))
          ]);
        }
        if (id === 'nerfs') {
          return el('div', {}, [
            UI.card('Les trois nerfs oculomoteurs', [
              UI.table(['Nerf', 'Noyau', 'Muscles', 'Sémiologie de la paralysie'], [
                ['III — oculomoteur', 'Mésencéphale (colliculus supérieur)',
                 'DS, DM, DI, OI, releveur de la paupière, sphincter irien + muscle ciliaire (contingent parasympathique)',
                 'Ptôsis, œil en abduction et abaissement, mydriase aréactive si atteinte intrinsèque. Mydriase = urgence (anévrisme).'],
                ['IV — trochléaire', 'Mésencéphale (colliculus inférieur) — seul nerf crânien à émergence dorsale et croisée',
                 'Oblique supérieur',
                 'Hypertropie majorée en adduction et en regard en bas, torticolis tête inclinée du côté opposé, Bielschowsky positif.'],
                ['VI — abducens', 'Pont (plancher du 4e ventricule)',
                 'Droit latéral',
                 'Ésotropie majorée de loin et du côté atteint, limitation de l’abduction. Long trajet intracrânien : peu localisateur.']
              ]),
              UI.note('Moyen mnémotechnique : <b>LR6 SO4</b> — le droit latéral par le VI, l’oblique supérieur par le IV, <b>tout le reste par le III</b>.')
            ]),
            UI.card('Trajets et repères', [
              el('div', { class: 'grid g2' }, [
                el('div', {}, [
                  el('h3', { text: 'Fente sphénoïdale' }),
                  el('p', { html: 'Laisse passer le <b>III</b>, le <b>IV</b>, le <b>VI</b>, le <b>V1</b> (nerf ophtalmique) et la veine ophtalmique supérieure. Un syndrome de la fente sphénoïdale associe ophtalmoplégie complète et anesthésie cornéenne.' })
                ]),
                el('div', {}, [
                  el('h3', { text: 'Sinus caverneux' }),
                  el('p', { html: 'Contient le III, le IV, le V1, le V2 et le VI (seul à cheminer <i>dans</i> la lumière, au contact de la carotide interne — d’où son atteinte fréquente et isolée).' })
                ])
              ]),
              UI.note('Le <b>réflexe photomoteur</b> : rétine → nerf optique → chiasma → bandelette → noyau prétectal → noyaux d’Edinger-Westphal <i>des deux côtés</i> → III → ganglion ciliaire → sphincter irien. C’est la double décussation qui explique la réponse consensuelle.', 'warn')
            ]),
            UI.card('Voies visuelles et corrélations lésionnelles',
              UI.table(['Localisation', 'Déficit du champ visuel'], [
                ['Nerf optique', 'Cécité monoculaire homolatérale + DPAR'],
                ['Chiasma (partie centrale)', 'Hémianopsie bitemporale'],
                ['Bandelette optique', 'Hémianopsie latérale homonyme incongruente'],
                ['Radiations temporales (boucle de Meyer)', 'Quadranopsie supérieure homonyme'],
                ['Radiations pariétales', 'Quadranopsie inférieure homonyme'],
                ['Cortex occipital', 'Hémianopsie homonyme congruente avec épargne maculaire']
              ]))
          ]);
        }
        buildQuiz();
        return quizBox;
      });

      return UI.page({
        crumb: 'Savoir',
        title: 'Anatomie interactive',
        subtitle: 'Explorez le globe et l’appareil moteur en cliquant sur les structures, puis testez-vous en mode entraînement.'
      }, [tabsNode]);
    }
  };
})();
