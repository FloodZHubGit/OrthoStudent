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

  /* ---- Couleur propre à chaque muscle, partagée par tous les schémas ---- */
  var MCOL = {
    DS: 'var(--blue)', DI: 'var(--green)', DM: 'var(--red)',
    DL: 'var(--accent)', OS: 'var(--violet)', OI: 'var(--amber)'
  };
  function mix(color, pct, over) {
    return 'color-mix(in srgb, ' + color + ' ' + pct + '%, ' + (over || 'transparent') + ')';
  }

  /* ============================================================
     Rose des actions — œil DROIT vu de face, vue de l’examinateur :
     le nez est à droite de l’image, la tempe à gauche.
     Les quatre actions rectilignes suivent les axes de Fick ; les
     deux torsions sont figurées par un arc qui part du méridien de
     12 h et indique le sens du roulement du globe.
     ============================================================ */

  var ROSE = {
    big:  { w: 600, h: 478, cx: 300, cy: 240, R: 86, gap: 16, len: 66, rt: 142, sw: [2.5, 11, 7.5, 4.5], fs: 13.5, fs2: 11, text: true },
    mini: { w: 170, h: 170, cx: 85,  cy: 85,  R: 36, gap: 7,  len: 30, rt: 60,  sw: [1.6, 7, 5, 3],      fs: 0,    fs2: 0,  text: false }
  };

  // ray : direction de la flèche (0° = droite, 90° = bas). a1→a2 : sens de l’arc de torsion.
  var ACT_GEO = {
    ELE: { ray: 270, lat: 'tip', ly: -30 },
    ABA: { ray: 90,  lat: 'tip', ly: 28 },
    ADD: { ray: 0,   lat: 'mid', ly: 34 },
    ABD: { ray: 180, lat: 'mid', ly: 34 },
    INT: { a1: 288, a2: 338, tilt: 22 },
    EXT: { a1: 252, a2: 202, tilt: -22 }
  };
  var ACT_HINT = {
    ELE: 'vers le haut', ABA: 'vers le bas', ADD: 'vers le nez',
    ABD: 'vers la tempe', INT: '12 h → nez', EXT: '12 h → tempe'
  };
  var RANK_HINT = ['', 'action principale', 'action secondaire', 'action tertiaire'];
  var RANK_ORD = ['', '1re', '2e', '3e'];

  /* opts : { ranks:{ELE:1,…}, color, size:'big'|'mini', focus, onPick } */
  function actionRose(opts) {
    var cfg = ROSE[opts.size || 'big'];
    var col = opts.color || 'var(--accent)';
    var ranks = opts.ranks || {};
    var focus = !!opts.focus;
    var g = s('svg', {
      viewBox: '0 0 ' + cfg.w + ' ' + cfg.h, style: 'width:100%;height:auto',
      role: 'img', 'aria-label': opts.label || 'Actions sur l’œil droit'
    });

    function pt(ang, r) {
      var a = ang * Math.PI / 180;
      return [cfg.cx + r * Math.cos(a), cfg.cy + r * Math.sin(a)];
    }
    function fx(p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
    function arrowHead(p, ang, size, color, op) {
      return s('polygon', {
        points: '0,0 ' + (-size * 1.8) + ',' + (-size * .72) + ' ' + (-size * 1.8) + ',' + (size * .72),
        fill: color, opacity: op,
        transform: 'translate(' + fx(p) + ') rotate(' + ang.toFixed(1) + ')'
      });
    }

    /* --- globe : sclère, iris, pupille, méridien repère de 12 h --- */
    g.appendChild(s('circle', { cx: cfg.cx, cy: cfg.cy, r: cfg.R, fill: 'var(--surface-2)', stroke: 'var(--line-hard)', 'stroke-width': 2 }));
    g.appendChild(s('circle', { cx: cfg.cx, cy: cfg.cy, r: cfg.R * .42, fill: mix('var(--blue)', 32, 'var(--surface-3)'), stroke: mix('var(--blue)', 55), 'stroke-width': 1.5 }));
    g.appendChild(s('circle', { cx: cfg.cx, cy: cfg.cy, r: cfg.R * .17, fill: 'var(--bg)' }));
    g.appendChild(s('line', {
      x1: cfg.cx, y1: cfg.cy - cfg.R * .42, x2: cfg.cx, y2: cfg.cy - cfg.R,
      stroke: 'var(--txt-3)', 'stroke-width': 1.6, 'stroke-dasharray': '3 3'
    }));
    g.appendChild(s('circle', { cx: cfg.cx, cy: cfg.cy - cfg.R, r: cfg.R * .04 + 2, fill: 'var(--txt-3)' }));

    /* méridien fantôme : où bascule le 12 h quand le muscle tord le globe */
    ['INT', 'EXT'].forEach(function (t) {
      if (!focus || !ranks[t]) return;
      g.appendChild(s('line', {
        x1: cfg.cx, y1: cfg.cy - cfg.R * .30, x2: cfg.cx, y2: cfg.cy - cfg.R,
        stroke: col, 'stroke-width': 2.4, opacity: .6, 'stroke-linecap': 'round',
        transform: 'rotate(' + ACT_GEO[t].tilt + ' ' + cfg.cx + ' ' + cfg.cy + ')'
      }));
    });

    /* --- une flèche par action --- */
    Object.keys(ACT_GEO).forEach(function (id) {
      var geo = ACT_GEO[id];
      var act = Optics.Motility.action(id);
      var rank = ranks[id] || 0;
      var on = rank > 0;
      var color = on ? col : 'var(--txt-3)';
      var op = on ? [0, 1, .88, .68][rank] : (focus ? .17 : .34);
      var w = on ? cfg.sw[rank] : cfg.sw[0];
      var hs = Math.max(w * 1.5, cfg.sw[1] * .5);
      var grp = s('g', {});

      if (geo.ray !== undefined) {
        var r1 = cfg.R + cfg.gap, r2 = r1 + cfg.len;
        var a = pt(geo.ray, r1), b = pt(geo.ray, r2), c = pt(geo.ray, r2 - hs * 1.8);
        grp.appendChild(s('line', { x1: a[0], y1: a[1], x2: c[0], y2: c[1], stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', opacity: op }));
        grp.appendChild(arrowHead(b, geo.ray, hs, color, op));
        grp.appendChild(s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: 'transparent', 'stroke-width': 30 }));
      } else {
        var sweep = geo.a2 > geo.a1 ? 1 : 0;
        var stop = geo.a2 - (sweep ? 8 : -8);
        var head = 'M ' + fx(pt(geo.a1, cfg.rt)) + ' A ' + cfg.rt + ' ' + cfg.rt + ' 0 0 ' + sweep + ' ';
        grp.appendChild(s('path', { d: head + fx(pt(stop, cfg.rt)), fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', opacity: op }));
        grp.appendChild(arrowHead(pt(geo.a2, cfg.rt), geo.a2 + (sweep ? 90 : -90), hs, color, op));
        grp.appendChild(s('path', { d: head + fx(pt(geo.a2, cfg.rt)), fill: 'none', stroke: 'transparent', 'stroke-width': 26 }));
      }

      if (cfg.text) {
        var lp = geo.ray !== undefined
          ? pt(geo.ray, cfg.R + cfg.gap + (geo.lat === 'tip' ? cfg.len : cfg.len / 2))
          : pt((geo.a1 + geo.a2) / 2, cfg.rt + 54);
        var ly = geo.ly || 0;
        grp.appendChild(s('text', {
          x: lp[0], y: lp[1] + ly, 'text-anchor': 'middle', 'font-size': cfg.fs,
          'font-weight': on ? '680' : '520', fill: color, opacity: on ? 1 : .8
        }, act.name));
        grp.appendChild(s('text', {
          x: lp[0], y: lp[1] + ly + 15, 'text-anchor': 'middle', 'font-size': cfg.fs2,
          fill: color, opacity: on ? .85 : .55
        }, focus && on ? RANK_HINT[rank] : ACT_HINT[id]));
      }

      grp.appendChild(s('title', {}, act.name + (on ? ' — ' + RANK_HINT[rank] : ' — non réalisée par ce muscle')));
      if (opts.onPick) {
        grp.setAttribute('class', 'anat-hot');
        grp.addEventListener('click', function () { opts.onPick(id); });
        pickable(grp, act.name, function () { opts.onPick(id); });
      }
      g.appendChild(grp);
    });

    if (cfg.text) {
      g.appendChild(s('text', { x: 12, y: cfg.cy + 4, 'font-size': 11, fill: 'var(--txt-3)', 'letter-spacing': '.09em' }, 'TEMPORAL'));
      g.appendChild(s('text', { x: cfg.w - 12, y: cfg.cy + 4, 'font-size': 11, fill: 'var(--txt-3)', 'text-anchor': 'end', 'letter-spacing': '.09em' }, 'NASAL'));
      g.appendChild(s('text', { x: 12, y: cfg.h - 10, 'font-size': 11, fill: 'var(--txt-3)' },
        'Œil droit vu de face — vue de l’examinateur, le nez à droite'));
    }
    return g;
  }

  // { ELE:1, INT:2, ADD:3 } à partir de la liste ordonnée des actions du muscle
  function ranksOf(m) {
    var r = {};
    m.act.forEach(function (a, i) { r[a] = i + 1; });
    return r;
  }

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
    // anneau de Zinn — repère osseux, en rose pour ne pas être pris pour un muscle
    g.appendChild(s('circle', { cx: 600, cy: 210, r: 22, fill: 'none', stroke: 'var(--pink)', 'stroke-width': 3 }));
    g.appendChild(s('text', { x: 600, y: 258, fill: 'var(--pink)', 'font-size': '11', 'text-anchor': 'middle' }, 'Anneau de Zinn'));

    function muscle(d, color, id, label, lx, ly) {
      var p = s('path', { d: d, fill: 'none', stroke: color, 'stroke-width': 12, 'stroke-linecap': 'round', class: 'anat-hot' });
      p.addEventListener('click', function () { onPick(id); });
      pickable(p, label || id, function () { onPick(id); });
      p.appendChild(s('title', {}, label));
      g.appendChild(p);
      g.appendChild(s('text', { x: lx, y: ly, fill: color, 'font-size': '12.5', 'font-weight': '600' }, label));
    }

    muscle('M 232 132 Q 400 96 588 192', MCOL.DS, 'DS', 'Droit supérieur', 380, 84);
    muscle('M 232 288 Q 400 324 588 228', MCOL.DI, 'DI', 'Droit inférieur', 380, 350);
    // les deux droits horizontaux, de part et d'autre de l'axe antéro-postérieur
    muscle('M 300 196 L 578 200', MCOL.DM, 'DM', 'Droit médial (nasal)', 348, 186);
    muscle('M 300 226 L 578 222', MCOL.DL, 'DL', 'Droit latéral (temporal)', 348, 252);
    // oblique supérieur avec trochlée
    g.appendChild(s('circle', { cx: 190, cy: 112, r: 9, fill: 'var(--pink)' }));
    g.appendChild(s('text', { x: 176, y: 96, fill: 'var(--pink)', 'font-size': '11' }, 'Trochlée'));
    muscle('M 190 112 L 578 178', MCOL.OS, 'OS', 'Oblique supérieur', 380, 140);
    muscle('M 190 112 Q 250 130 288 172', MCOL.OS, 'OS', '', 0, 0);
    muscle('M 170 300 Q 250 300 292 254', MCOL.OI, 'OI', 'Oblique inférieur', 176, 330);

    g.appendChild(s('text', { x: 20, y: 400, fill: '#5f7688', 'font-size': '11' }, 'Schéma de principe — cliquez un muscle pour sa fiche complète'));
    return g;
  }

  function yokeOf(id) {
    var y = Optics.Motility.yokePairs.filter(function (p) { return p.od === id; })[0];
    return y ? y.os : null;
  }
  function muscleTag(m, rank) {
    var c = MCOL[m.id];
    return '<span class="mus-tag" style="color:' + c + ';background:' + mix(c, 13) + ';border-color:' + mix(c, 38) + '">' +
           m.short + (rank ? ' <b>' + RANK_ORD[rank] + '</b>' : '') + '</span>';
  }

  /* ---- Onglet « Actions » : quel muscle fait quoi ---- */
  function actionsView() {
    var Mot = Optics.Motility;
    var ORDER = ['ELE', 'ABA', 'ADD', 'ABD', 'INT', 'EXT'];
    var st = { kind: 'muscle', id: 'DS' };

    var chipsM = el('div', { class: 'btn-row', style: { gap: '7px', marginBottom: '8px' } });
    var chipsA = el('div', { class: 'btn-row', style: { gap: '7px' } });
    var roseBox = el('div');
    var detail = el('div');
    var gridBox = el('div', { class: 'mus-grid' });

    function pick(kind, id) { st.kind = kind; st.id = id; draw(); }

    function drawChips() {
      UI.clear(chipsM);
      chipsM.appendChild(el('span', { class: 'row-lbl', text: 'Muscle' }));
      Mot.muscles.forEach(function (m) {
        var on = st.kind === 'muscle' && st.id === m.id;
        var c = MCOL[m.id];
        chipsM.appendChild(el('span', {
          class: 'chip' + (on ? ' on' : ''),
          style: on ? { color: c, background: mix(c, 14), borderColor: mix(c, 48), fontWeight: '660' } : {},
          onClick: function () { pick('muscle', m.id); }
        }, [el('i', { class: 'mus-dot', style: { background: c } }), m.short]));
      });

      UI.clear(chipsA);
      chipsA.appendChild(el('span', { class: 'row-lbl', text: 'Fonction' }));
      Mot.actions.forEach(function (a) {
        chipsA.appendChild(el('span', {
          class: 'chip' + (st.kind === 'action' && st.id === a.id ? ' on' : ''),
          onClick: function () { pick('action', a.id); }
        }, a.name));
      });
    }

    function drawRose() {
      var ranks = {}, col = 'var(--accent)';
      if (st.kind === 'muscle') {
        var m = Mot.muscle(st.id);
        ranks = ranksOf(m);
        col = MCOL[m.id];
      } else {
        ranks[st.id] = 1;
      }
      UI.clear(roseBox);
      roseBox.appendChild(actionRose({
        ranks: ranks, color: col, size: 'big', focus: true,
        onPick: function (aid) { pick('action', aid); },
        label: st.kind === 'muscle'
          ? 'Actions du ' + Mot.muscle(st.id).name + ' sur l’œil droit'
          : Mot.action(st.id).name + ' de l’œil droit'
      }));
    }

    function drawDetail() {
      UI.clear(detail);
      if (st.kind === 'muscle') {
        var m = Mot.muscle(st.id);
        detail.appendChild(el('h2', { text: m.name, style: { color: MCOL[m.id] } }));
        detail.appendChild(el('div', { class: 'btn-row', style: { gap: '6px', marginBottom: '12px' } },
          m.act.map(function (a, i) {
            return el('span', { class: 'act-pill r' + (i + 1), text: RANK_ORD[i + 1] + ' · ' + Mot.action(a).name });
          })));
        detail.appendChild(UI.kv('Innervation', m.nerve));
        detail.appendChild(UI.kv('Position diagnostique', m.gaze));
        detail.appendChild(UI.kv('Plan du muscle', m.plane));
        detail.appendChild(UI.kv('Origine', m.origin));
        detail.appendChild(UI.kv('Insertion', m.insertion));
        detail.appendChild(UI.kv('Antagoniste homolatéral', Mot.muscle(Mot.antagonist[m.id]).short));
        detail.appendChild(UI.kv('Synergiste controlatéral', Mot.muscle(yokeOf(m.id)).short + ' de l’œil gauche'));
        detail.appendChild(UI.note(m.why));
      } else {
        var a2 = Mot.action(st.id);
        detail.appendChild(el('h2', { text: a2.name }));
        detail.appendChild(el('p', { class: 'selectable', text: a2.txt }));
        detail.appendChild(UI.kv('Axe de rotation', a2.axis));
        detail.appendChild(UI.kv('Plan du mouvement', a2.plane));
        detail.appendChild(UI.kv('Mouvement opposé', Mot.action(a2.opposite).name));
        detail.appendChild(el('h3', { text: 'Muscles concernés' }));
        detail.appendChild(UI.table(['Muscle', 'Rang', 'Nerf'],
          Mot.musclesFor(st.id).map(function (m2) {
            var r = Mot.rank(m2.id, st.id);
            return [muscleTag(m2), Mot.rankLabel(r), m2.nerve];
          })));
      }
    }

    function drawGrid() {
      UI.clear(gridBox);
      Mot.muscles.forEach(function (m) {
        var on = st.kind === 'muscle' && st.id === m.id;
        gridBox.appendChild(el('div', {
          class: 'mus-card' + (on ? ' on' : ''),
          style: on ? { borderColor: mix(MCOL[m.id], 60) } : {},
          onClick: function () { pick('muscle', m.id); }
        }, [
          el('div', { class: 'mn' }, [el('i', { class: 'mus-dot', style: { background: MCOL[m.id] } }), m.short]),
          actionRose({ ranks: ranksOf(m), color: MCOL[m.id], size: 'mini', focus: true, label: 'Actions du ' + m.name }),
          el('div', { class: 'ma' }, m.act.map(function (a, i) {
            return el('div', {}, [
              el('b', { style: { color: MCOL[m.id] }, text: RANK_ORD[i + 1] + ' ' }),
              Mot.action(a).name
            ]);
          })),
          el('div', { class: 'mnv', text: m.nerve })
        ]));
      });
    }

    function draw() { drawChips(); drawRose(); drawDetail(); drawGrid(); }
    draw();

    return el('div', {}, [
      UI.card('Schéma des actions', [
        el('div', { class: 'muted small mb8', html: 'Choisissez un <b>muscle</b> pour voir ses trois actions, ou une <b>fonction</b> pour voir les muscles qui la produisent. Les flèches du schéma sont cliquables ; l’épaisseur du trait donne le rang de l’action.' }),
        chipsM, chipsA
      ]),
      el('div', { class: 'split' }, [
        el('div', { class: 'card' }, roseBox),
        el('div', { class: 'card' }, detail)
      ]),
      UI.card('Les six muscles en un coup d’œil', gridBox),
      UI.card('Matrice muscle × fonction', [
        /* sept colonnes : la table défile horizontalement sur écran étroit */
        el('div', { style: { overflowX: 'auto' } },
          UI.table(['Muscle'].concat(ORDER.map(function (a) { return Mot.action(a).name; })),
            Mot.muscles.map(function (m) {
              return ['<i class="mus-dot" style="background:' + MCOL[m.id] + '"></i>' + m.short]
                .concat(ORDER.map(function (a) {
                  var r = Mot.rank(m.id, a);
                  return r ? '<span class="act-pill r' + r + '">' + RANK_ORD[r] + '</span>'
                           : '<span class="act-none">·</span>';
                }));
            }))),
        UI.note('<b>1<sup>re</sup></b> action principale · <b>2<sup>e</sup></b> secondaire · <b>3<sup>e</sup></b> tertiaire. Les deux droits horizontaux n’ont qu’une seule action : leur plan est confondu avec l’axe visuel.')
      ]),
      UI.card('Lecture par fonction',
        el('div', { style: { overflowX: 'auto' } },
          UI.table(['Fonction', 'Muscles agonistes', 'Fonction opposée'],
            Mot.actions.map(function (a) {
              return [a.name,
                Mot.musclesFor(a.id).map(function (m) { return muscleTag(m, Mot.rank(m.id, a.id)); }).join(' '),
                Mot.action(a.opposite).name];
            })))),
      UI.card('Retenir la table en quatre règles', [
        UI.note('<b>1. Les actions principales.</b> Droit latéral → abduction, droit médial → adduction, droit supérieur → élévation, droit inférieur → abaissement, oblique supérieur → intorsion, oblique inférieur → extorsion.'),
        UI.note('<b>2. Tout ce qui est « supérieur » tourne le globe en dedans.</b> Droit <i>supérieur</i> et oblique <i>supérieur</i> sont les deux <b>intorteurs</b> ; droit <i>inférieur</i> et oblique <i>inférieur</i> sont les deux <b>extorteurs</b>.'),
        UI.note('<b>3. Les droits verticaux sont adducteurs, les obliques sont abducteurs.</b> C’est la conséquence de leur trajet : les droits abordent le globe par l’arrière-dedans, les obliques par l’avant-dedans.'),
        UI.note('<b>4. Les obliques font l’inverse de leur nom sur la verticale.</b> L’oblique <i>supérieur</i> ab<b>aisse</b>, l’oblique <i>inférieur</i> <b>élève</b>.', 'warn'),
        el('p', { html: 'Ces quatre règles suffisent à reconstruire la matrice entière, sans l’apprendre par cœur : l’action principale donne la première colonne, les règles 2 et 3 donnent les deux autres.' })
      ]),
      UI.card('Pourquoi les actions changent avec la position du regard', [
        el('p', { html: 'Un muscle n’a d’action « pure » que lorsque son <b>plan d’action</b> est confondu avec l’axe visuel. Or, en position primaire, le plan des droits verticaux fait <b>23°</b> avec l’axe visuel et celui des obliques <b>51°</b>. Chaque muscle vertical répartit donc sa force entre une composante verticale, une composante torsionnelle et une composante horizontale — et cette répartition change quand le globe tourne.' }),
        UI.table(['Muscle', 'Position où l’action verticale est maximale', 'Position où la torsion domine'], [
          ['Droit supérieur', 'Abduction de 23° — élévateur pur', 'Adduction — devient intorteur'],
          ['Droit inférieur', 'Abduction de 23° — abaisseur pur', 'Adduction — devient extorteur'],
          ['Oblique supérieur', 'Adduction de 51° — abaisseur pur', 'Abduction — devient intorteur'],
          ['Oblique inférieur', 'Adduction de 51° — élévateur pur', 'Abduction — devient extorteur']
        ]),
        UI.note('C’est exactement pour cela qu’on explore les <b>neuf positions du regard</b> : chaque position diagnostique isole un muscle vertical en le plaçant dans la direction où son action est la plus pure.')
      ])
    ]);
  }

  M.anatomy = {
    id: 'anatomy', title: 'Anatomie interactive', icon: '🫀', group: 'Références',
    desc: 'Coupe du globe, muscles oculomoteurs et leurs actions, innervation',
    keywords: 'anatomie coupe globe muscle zinn tillaux innervation nerf action fonction ' +
              'adduction abduction intorsion extorsion elevation abaissement torsion oculomoteur rose schema',
    render: function (ctx) {
      var initialTab = ((ctx && ctx.params) || {}).tab || 'globe';
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
        var Mot = Optics.Motility;
        var m = Mot.muscle(id);
        if (!m) return;
        UI.clear(info);
        info.appendChild(el('h2', { text: m.name, style: { color: MCOL[m.id] } }));
        /* le petit schéma répond tout de suite à « ce muscle fait quoi ? » */
        info.appendChild(actionRose({
          ranks: ranksOf(m), color: MCOL[m.id], size: 'mini', focus: true,
          label: 'Actions du ' + m.name
        }));
        info.appendChild(el('div', { class: 'btn-row', style: { gap: '6px', margin: '4px 0 12px' } },
          m.act.map(function (a, i) {
            return el('span', { class: 'act-pill r' + (i + 1), text: RANK_ORD[i + 1] + ' · ' + Mot.action(a).name });
          })));
        info.appendChild(UI.kv('Innervation', m.nerve));
        info.appendChild(UI.kv('Position diagnostique', m.gaze));
        info.appendChild(UI.kv('Origine', m.origin));
        info.appendChild(UI.kv('Insertion', m.insertion));
        info.appendChild(UI.kv('Antagoniste homolatéral', Mot.muscle(Mot.antagonist[m.id]).short));
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
        { id: 'actions', label: '🧭 Actions des muscles' },
        { id: 'nerfs', label: '⚡ Innervation' },
        { id: 'train', label: '🎯 Entraînement' }
      ], function (id) {
        if (id === 'actions') return actionsView();
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
              UI.table(['Muscle', 'Nerf', 'Principale', 'Secondaire', 'Tertiaire', 'Position diagnostique'],
                Optics.Motility.muscles.map(function (m) {
                  return [m.name, m.nerve, m.primary, m.secondary, m.tertiary, m.gaze];
                })), { right: UI.btn('Voir le schéma des actions', function () { tabsNode.setTab('actions'); }, 'sm') }),
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
      }, initialTab);

      return UI.page({
        crumb: 'Références',
        title: 'Anatomie interactive',
        subtitle: 'Explorez le globe et l’appareil moteur en cliquant sur les structures, puis testez-vous en mode entraînement.'
      }, [tabsNode]);
    }
  };
})();
