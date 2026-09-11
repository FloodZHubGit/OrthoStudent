/* ============================================================
   Les schémas du cours
   ------------------------------------------------------------
   Certaines notions d'orthoptie ne se disent pas : elles se
   dessinent. La conoïde de Sturm, la spirale de Tillaux, le
   trajet des voies visuelles — on peut les décrire en trois
   phrases justes sans que personne ne les voie.

   Une entrée de uecours.js peut donc porter `fig: 'sturm'` : la
   partie de cours affiche alors le schéma correspondant, sous sa
   matière et avant ses encarts.

   Règles de dessin, pour que l'ensemble reste d'une seule main :
     · viewBox de 640 de large, hauteur libre, mise à l'échelle
       par la feuille de style ;
     · aucune couleur en dur — uniquement les variables du thème,
       pour que le schéma vive en clair comme en sombre ;
     · le texte fait partie du dessin : un schéma sans étiquettes
       n'apprend rien, et aucune étiquette ne doit en croiser une
       autre ni passer sur un trait ;
     · pas d'animation, pas d'interaction : ces schémas se lisent,
       et s'impriment avec la fiche.
   ============================================================ */
(function () {
  'use strict';

  var s = null;   // UI.svg, résolu au premier appel

  function S(tag, attrs, kids) { return s(tag, attrs, kids); }

  function txt(x, y, t, o) {
    o = o || {};
    return S('text', {
      x: x, y: y, 'font-size': o.size || 11,
      'text-anchor': o.anchor || 'start',
      'font-weight': o.bold ? 700 : 400,
      fill: o.fill || 'var(--txt-2)',
      'font-style': o.italic ? 'italic' : null
    }, t);
  }

  function ligne(x1, y1, x2, y2, o) {
    o = o || {};
    return S('line', {
      x1: x1, y1: y1, x2: x2, y2: y2,
      stroke: o.c || 'var(--line-hard)',
      'stroke-width': o.w || 1.2,
      'stroke-dasharray': o.dash || null,
      'stroke-linecap': 'round',
      'marker-end': o.arrow ? 'url(#ueflx)' : null
    });
  }

  /* une pointe de flèche unique, référencée par les traits qui en veulent */
  function defsFleche() {
    return S('defs', {}, S('marker', {
      id: 'ueflx', viewBox: '0 0 10 10', refX: 8, refY: 5,
      markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse'
    }, S('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: 'var(--accent)' })));
  }

  /* Une dioptrie s'écrit toujours signée, à deux décimales, virgule
     française : « +0,75 », « −3,00 ». C'est la convention des ordonnances,
     et les schémas vivants en affichent à chaque mouvement de curseur. */
  function fmt(d) {
    var v = Math.round(d * 100) / 100;
    return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2).replace('.', ',');
  }

  /* Couper un texte en lignes d'au plus `max` caractères, dans l'ordre.
     Un repli qui reclasse les mots produit des phrases fausses — « Antisepsie :
     ou chloré alcool 70° » — et personne ne les relit dans un SVG. */
  function couper(t, max) {
    var lignes = [], courante = '';
    String(t).split(' ').forEach(function (m) {
      if (!courante) { courante = m; return; }
      if ((courante + ' ' + m).length <= max) courante += ' ' + m;
      else { lignes.push(courante); courante = m; }
    });
    if (courante) lignes.push(courante);
    return lignes;
  }

  function svg(w, h, label, kids) {
    return S('svg', {
      viewBox: '0 0 ' + w + ' ' + h, class: 'ue-fig-svg',
      role: 'img', 'aria-label': label
    }, [defsFleche()].concat(kids));
  }

  /* ============================================================
     1 · Les dix couches de la rétine
     ============================================================ */
  function retine() {
    /* épaisseurs relatives, mais jamais moins de place qu'il n'en faut
       pour poser une étiquette en face */
    var couches = [
      ['Limitante interne', 1],
      ['Fibres optiques', 1.2],
      ['Cellules ganglionnaires', 1.4],
      ['Plexiforme interne', 1.6],
      ['Nucléaire interne', 1.6],
      ['Plexiforme externe', 1.2],
      ['Nucléaire externe', 1.8],
      ['Limitante externe', 1],
      ['Photorécepteurs', 2.6],
      ['Épithélium pigmentaire', 1.2]
    ];
    var kids = [], y = 34, x = 224, w = 190, unite = 17;
    couches.forEach(function (c, i) {
      var h = Math.max(19, c[1] * unite);
      var pr = i === 8, ep = i === 9;
      kids.push(S('rect', {
        x: x, y: y, width: w, height: h,
        fill: pr ? 'color-mix(in srgb, var(--accent) 22%, transparent)'
            : ep ? 'color-mix(in srgb, var(--violet) 30%, transparent)'
            : 'var(--surface-3)',
        stroke: 'var(--line)', 'stroke-width': 0.8
      }));
      kids.push(txt(x + w + 14, y + h / 2 + 4, (10 - i) + ' · ' + c[0], {
        size: 11.5, bold: pr || ep,
        fill: pr ? 'var(--accent)' : ep ? 'var(--violet)' : 'var(--txt-2)'
      }));
      y += h;
    });
    var bas = y;

    kids.push(ligne(160, 40, 160, bas - 44, { arrow: true, c: 'var(--accent)', w: 1.8 }));
    kids.push(txt(148, 34, 'La lumière entre ici', { anchor: 'end', size: 11.5, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(148, 50, 'et traverse tout', { anchor: 'end', size: 10.5, fill: 'var(--txt-3)' }));
    kids.push(txt(148, bas - 46, 'avant d’atteindre', { anchor: 'end', size: 10.5, fill: 'var(--txt-3)' }));
    kids.push(txt(148, bas - 31, 'les photorécepteurs', { anchor: 'end', size: 10.5, fill: 'var(--txt-3)' }));

    kids.push(txt(x, 24, 'VITRÉ', { size: 9.5, bold: true, fill: 'var(--txt-3)' }));
    kids.push(ligne(x, bas + 5, x + w, bas + 5, { c: 'var(--violet)', w: 2.5 }));
    kids.push(txt(x, bas + 20, 'CHOROÏDE', { size: 9.5, bold: true, fill: 'var(--txt-3)' }));

    return svg(640, bas + 32, 'Les dix couches de la rétine', kids);
  }

  /* ============================================================
     2 · La conoïde de Sturm
     ============================================================ */
  function sturm(p) {
    var kids = [];
    var cy = 112, x0 = 112;
    var sph = p.sph, cyl = p.cyl;
    var es = sph + cyl / 2;             // équivalent sphérique
    var ecart = Math.abs(cyl);          // intervalle de Sturm, en dioptries

    /* Position des deux focales : l'écart à l'écran suit l'intervalle
       dioptrique, borné pour que le dessin reste lisible jusqu'à 5 D. */
    var xc = 384;
    var demi = Math.min(96, ecart * 26);
    var xf1 = xc - demi, xf2 = xc + demi;

    kids.push(S('ellipse', { cx: x0, cy: cy, rx: 9, ry: 50, fill: 'var(--surface-3)', stroke: 'var(--accent)', 'stroke-width': 1.4 }));
    kids.push(txt(x0, cy + 68, 'Verre astigmate', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(x0, cy - 62, fmt(sph) + ' (' + fmt(cyl) + ')', { anchor: 'middle', size: 11, bold: true, fill: 'var(--accent)' }));

    /* le faisceau : chaque méridien converge sur sa focale, puis diverge */
    [-44, 44].forEach(function (d) {
      kids.push(ligne(x0, cy + d, xf1, cy, { c: 'var(--accent)', w: 1.1 }));
      kids.push(ligne(xf1, cy, 560, cy + d * 0.9, { c: 'var(--accent)', w: 1.1 }));
    });
    [-24, 24].forEach(function (d) {
      kids.push(ligne(x0, cy + d, xf2, cy, { c: 'var(--blue)', w: 1.1 }));
      kids.push(ligne(xf2, cy, 560, cy + d * 1.3, { c: 'var(--blue)', w: 1.1 }));
    });

    if (ecart < 0.13) {
      /* pas d'astigmatisme : une focale unique, et plus de conoïde du tout */
      kids.push(S('circle', { cx: xc, cy: cy, r: 5, fill: 'var(--green)' }));
      kids.push(txt(xc, cy - 30, 'Foyer unique', { anchor: 'middle', size: 11.5, bold: true, fill: 'var(--green)' }));
      kids.push(txt(xc, cy + 40, 'Sans cylindre, pas de conoïde :', { anchor: 'middle', size: 10.5, fill: 'var(--txt-2)' }));
      kids.push(txt(xc, cy + 54, 'les deux méridiens focalisent au même endroit.', { anchor: 'middle', size: 10.5, fill: 'var(--txt-2)' }));
    } else {
      kids.push(ligne(xf1, cy - 22, xf1, cy + 22, { c: 'var(--accent)', w: 3.2 }));
      kids.push(txt(xf1, cy - 32, 'Focale 1', { anchor: 'middle', size: 11, bold: true, fill: 'var(--accent)' }));
      kids.push(txt(xf1, cy - 45, fmt(sph) + ' D', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));

      kids.push(S('circle', { cx: xc, cy: cy, r: Math.max(5, Math.min(16, ecart * 4.4)), fill: 'none', stroke: 'var(--green)', 'stroke-width': 2.6 }));
      kids.push(txt(xc, cy + 40, 'Cercle de moindre diffusion', { anchor: 'middle', size: 11, bold: true, fill: 'var(--green)' }));
      kids.push(txt(xc, cy + 53, 'équivalent sphérique ' + fmt(es) + ' D', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));

      kids.push(ligne(xf2 - 22, cy, xf2 + 22, cy, { c: 'var(--blue)', w: 3.2 }));
      kids.push(txt(xf2, cy - 32, 'Focale 2', { anchor: 'middle', size: 11, bold: true, fill: 'var(--blue)' }));
      kids.push(txt(xf2, cy - 45, fmt(sph + cyl) + ' D', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));

      kids.push(ligne(xf1, cy + 76, xf2, cy + 76, { c: 'var(--txt-3)', dash: '4 3' }));
      kids.push(ligne(xf1, cy + 71, xf1, cy + 81, { c: 'var(--txt-3)' }));
      kids.push(ligne(xf2, cy + 71, xf2, cy + 81, { c: 'var(--txt-3)' }));
      kids.push(txt(xc, cy + 94, 'Intervalle de Sturm — ' + ecart.toFixed(2).replace('.', ',') + ' D',
        { anchor: 'middle', size: 11, bold: true }));
    }

    return svg(640, 224, 'La conoïde de Sturm', kids);
  }

  /* ============================================================
     3 · Le prisme : base, arête, sens de la déviation
     ============================================================ */
  function prisme(p) {
    var kids = [];
    var ax = 300, ay = 34, bx1 = 258, bx2 = 342, by = 136;
    var deg = Math.atan(p.delta / 100) * 180 / Math.PI;
    /* 1 Δ dévie de 1 cm à 1 m : à l'écran, 190 px de trajet valent 1 m */
    var chute = Math.min(74, p.delta * 3.6);

    kids.push(S('path', {
      d: 'M ' + ax + ' ' + ay + ' L ' + bx2 + ' ' + by + ' L ' + bx1 + ' ' + by + ' Z',
      fill: 'color-mix(in srgb, var(--accent) 14%, transparent)',
      stroke: 'var(--accent)', 'stroke-width': 1.6
    }));
    kids.push(txt(ax, ay - 10, 'ARÊTE (apex)', { anchor: 'middle', size: 10, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(ax, by + 18, 'BASE', { anchor: 'middle', size: 10, bold: true, fill: 'var(--accent)' }));

    kids.push(ligne(64, 66, 272, 66, { c: 'var(--blue)', w: 1.6 }));
    kids.push(ligne(272, 66, 462, 66 + chute, { c: 'var(--blue)', w: 1.6, arrow: true }));
    kids.push(txt(64, 56, 'Le rayon…', { size: 10.5, fill: 'var(--blue)' }));
    kids.push(txt(360, Math.min(158, 82 + chute), '…dévie vers la base', { size: 11, bold: true, fill: 'var(--blue)' }));

    kids.push(ligne(272, 66, 462, 66 - chute * 0.72, { c: 'var(--violet)', dash: '5 4', w: 1.4, arrow: true }));
    kids.push(txt(360, Math.max(16, 54 - chute * 0.72), 'L’image se déplace vers l’arête',
      { size: 11, bold: true, fill: 'var(--violet)' }));

    kids.push(S('circle', { cx: 524, cy: 66 + chute, r: 21, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
    kids.push(S('circle', { cx: 512, cy: 60 + chute, r: 6.5, fill: 'var(--txt-2)' }));

    kids.push(S('rect', { x: 40, y: 158, width: 232, height: 42, rx: 8,
      fill: 'color-mix(in srgb, var(--accent) 12%, transparent)', stroke: 'var(--accent)', 'stroke-width': 1.2 }));
    kids.push(txt(156, 176, p.delta.toFixed(0) + ' Δ = ' + p.delta.toFixed(0) + ' cm à 1 m',
      { anchor: 'middle', size: 12.5, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(156, 191, 'soit ' + deg.toFixed(1).replace('.', ',') + '° de déviation',
      { anchor: 'middle', size: 10.5, fill: 'var(--txt-2)' }));

    return svg(640, 212, 'Un prisme dévie le rayon vers sa base et l’image vers son arête', kids);
  }

  /* ============================================================
     4 · La spirale de Tillaux
     ============================================================ */
  function tillaux() {
    var cx = 320, cy = 152, limbe = 44, mm = 7;
    var kids = [];
    var muscles = [
      { n: 'Droit médial', d: 5.5, a: 180, c: 'var(--accent)' },
      { n: 'Droit inférieur', d: 6.5, a: 90, c: 'var(--blue)' },
      { n: 'Droit latéral', d: 6.9, a: 0, c: 'var(--violet)' },
      { n: 'Droit supérieur', d: 7.7, a: 270, c: 'var(--green)' }
    ];

    kids.push(S('circle', { cx: cx, cy: cy, r: limbe + 7.7 * mm + 16, fill: 'var(--surface-2)', stroke: 'var(--line-soft)' }));
    kids.push(S('circle', { cx: cx, cy: cy, r: limbe, fill: 'var(--surface-3)', stroke: 'var(--accent)', 'stroke-width': 1.6 }));
    kids.push(txt(cx, cy + 1, 'Cornée', { anchor: 'middle', size: 11.5, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(cx, cy + 15, 'limbe', { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));

    muscles.forEach(function (m) {
      var r = limbe + m.d * mm;
      var a = m.a * Math.PI / 180;
      var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      var per = a + Math.PI / 2, l = 27;
      kids.push(ligne(cx + Math.cos(a) * limbe, cy + Math.sin(a) * limbe, x, y, { c: m.c, dash: '3 3', w: 1 }));
      kids.push(ligne(x - Math.cos(per) * l, y - Math.sin(per) * l,
                      x + Math.cos(per) * l, y + Math.sin(per) * l, { c: m.c, w: 4.5 }));
      var lx = cx + Math.cos(a) * (r + 30), ly = cy + Math.sin(a) * (r + 30);
      kids.push(txt(lx, ly + (m.a === 90 ? 12 : m.a === 270 ? -4 : 4),
        m.n + ' — ' + String(m.d).replace('.', ',') + ' mm',
        { anchor: m.a === 180 ? 'end' : m.a === 0 ? 'start' : 'middle', size: 11, bold: true, fill: m.c }));
    });

    kids.push(txt(cx, 302, '5,5 → 6,5 → 6,9 → 7,7 mm : médial, inférieur, latéral, supérieur',
      { anchor: 'middle', size: 11.5, bold: true }));

    return svg(640, 318, 'La spirale de Tillaux : distance des insertions au limbe', kids);
  }

  /* ============================================================
     5 · Voies visuelles et déficits campimétriques
     ============================================================ */
  function voies(p) {
    var kids = [];
    var yh = 58, yb = 128, chx = 236, cy = 93;

    function oeil(x, y, nom) {
      kids.push(S('circle', { cx: x, cy: y, r: 16, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
      kids.push(S('circle', { cx: x + 11, cy: y, r: 4.5, fill: 'var(--txt-3)' }));
      kids.push(txt(x - 22, y + 4, nom, { anchor: 'end', size: 10, bold: true, fill: 'var(--txt-3)' }));
    }
    oeil(66, yh, 'OG'); oeil(66, yb, 'OD');

    kids.push(ligne(83, yh, chx - 16, cy - 13, { c: 'var(--accent)', w: 2 }));
    kids.push(ligne(83, yb, chx - 16, cy + 13, { c: 'var(--accent)', w: 2 }));
    kids.push(S('path', {
      d: 'M ' + (chx - 16) + ' ' + (cy - 13) + ' L ' + (chx + 16) + ' ' + (cy + 13) +
         ' M ' + (chx - 16) + ' ' + (cy + 13) + ' L ' + (chx + 16) + ' ' + (cy - 13),
      stroke: 'var(--accent)', 'stroke-width': 2, fill: 'none'
    }));
    kids.push(txt(chx, cy + 40, 'Chiasma', { anchor: 'middle', size: 10, bold: true, fill: 'var(--accent)' }));
    kids.push(ligne(chx + 16, cy - 13, 330, cy - 24, { c: 'var(--accent)', w: 2 }));
    kids.push(ligne(chx + 16, cy + 13, 330, cy + 24, { c: 'var(--accent)', w: 2 }));
    kids.push(S('rect', { x: 330, y: cy - 38, width: 22, height: 26, rx: 5, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
    kids.push(S('rect', { x: 330, y: cy + 12, width: 22, height: 26, rx: 5, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
    kids.push(txt(341, cy - 44, 'CGL', { anchor: 'middle', size: 8.5, fill: 'var(--txt-3)' }));
    /* les radiations : la boucle de Meyer passe par le lobe temporal */
    kids.push(S('path', { d: 'M 352 ' + (cy - 24) + ' q 40 -6 62 12', fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2 }));
    kids.push(S('path', { d: 'M 352 ' + (cy + 24) + ' q 26 26 62 -2', fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2 }));
    kids.push(txt(384, cy + 52, 'radiations', { anchor: 'middle', size: 9, fill: 'var(--txt-3)' }));
    kids.push(S('path', { d: 'M 418 ' + (cy - 44) + ' q 30 44 0 88', fill: 'none', stroke: 'var(--violet)', 'stroke-width': 2.4 }));
    kids.push(txt(442, cy + 56, 'Cortex', { anchor: 'middle', size: 10, bold: true, fill: 'var(--violet)' }));

    var SITES = {
      nerf:        { x: 120, y: yh, t: 'Nerf optique gauche', d: 'Cécité monoculaire gauche', c: [3, 0] },
      chiasma:     { x: chx, y: cy, t: 'Chiasma', d: 'Hémianopsie bitemporale', c: [1, 2] },
      bandelette:  { x: 300, y: cy - 21, t: 'Bandelette droite', d: 'Hémianopsie homonyme gauche', c: [1, 1] },
      radiations:  { x: 384, y: cy + 30, t: 'Radiations temporales droites', d: 'Quadranopsie supérieure gauche', c: [4, 4] },
      cortex:      { x: 424, y: cy, t: 'Cortex occipital droit', d: 'Homonyme gauche, macula épargnée', c: [5, 5] }
    };
    var st = SITES[p.site] || SITES.chiasma;
    Object.keys(SITES).forEach(function (k) {
      var o = SITES[k], actif = k === p.site;
      kids.push(S('circle', { cx: o.x, cy: o.y, r: actif ? 10 : 6,
        fill: actif ? 'var(--red)' : 'var(--surface-4)', stroke: actif ? 'var(--red)' : 'var(--line-hard)', 'stroke-width': 1.2 }));
    });

    /* le champ visuel de chaque œil, en grand */
    function champ(x, y, mode) {
      var R = 40, perdu = 'color-mix(in srgb, var(--txt) 58%, var(--surface-4))';
      kids.push(S('circle', { cx: x, cy: y, r: R, fill: 'var(--surface-3)', stroke: 'var(--line-hard)', 'stroke-width': 1.1 }));
      if (mode === 3) kids.push(S('circle', { cx: x, cy: y, r: R, fill: perdu }));
      else if (mode === 1) kids.push(S('path', { d: 'M ' + x + ' ' + (y - R) + ' a ' + R + ' ' + R + ' 0 0 0 0 ' + (2 * R) + ' z', fill: perdu }));
      else if (mode === 2) kids.push(S('path', { d: 'M ' + x + ' ' + (y - R) + ' a ' + R + ' ' + R + ' 0 0 1 0 ' + (2 * R) + ' z', fill: perdu }));
      else if (mode === 4) kids.push(S('path', { d: 'M ' + x + ' ' + y + ' L ' + x + ' ' + (y - R) + ' A ' + R + ' ' + R + ' 0 0 0 ' + (x - R) + ' ' + y + ' Z', fill: perdu }));
      else if (mode === 5) {
        kids.push(S('path', { d: 'M ' + x + ' ' + (y - R) + ' a ' + R + ' ' + R + ' 0 0 0 0 ' + (2 * R) + ' z', fill: perdu }));
        kids.push(S('circle', { cx: x, cy: y, r: 11, fill: 'var(--surface-3)' }));
        kids.push(S('circle', { cx: x, cy: y, r: 11, fill: 'none', stroke: 'var(--green)', 'stroke-width': 1.4 }));
      }
      kids.push(S('circle', { cx: x, cy: y, r: R, fill: 'none', stroke: 'var(--line-hard)', 'stroke-width': 1.1 }));
    }
    var yl = 268;
    kids.push(txt(320, 176, st.t, { anchor: 'middle', size: 13, bold: true, fill: 'var(--red)' }));
    kids.push(txt(320, 194, st.d, { anchor: 'middle', size: 11.5, bold: true }));
    kids.push(txt(232, yl - 50, 'OG', { anchor: 'middle', size: 10, bold: true, fill: 'var(--txt-3)' }));
    kids.push(txt(408, yl - 50, 'OD', { anchor: 'middle', size: 10, bold: true, fill: 'var(--txt-3)' }));
    champ(232, yl, st.c[0]);
    champ(408, yl, st.c[1]);
    if (p.site === 'cortex') {
      kids.push(txt(320, yl + 62, 'Le cercle vert : la macula, épargnée par la double vascularisation du pôle occipital.',
        { anchor: 'middle', size: 9.5, fill: 'var(--green)' }));
    } else {
      kids.push(txt(320, yl + 62, 'En gris : la zone perdue du champ visuel de chaque œil.',
        { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    }

    return svg(640, 344, 'Voies visuelles et déficits campimétriques', kids);
  }

  /* ============================================================
     6 · L'adaptation à l'obscurité
     ============================================================ */
  function adaptation() {
    var kids = [];
    var x0 = 76, x1 = 556, y0 = 46, y1 = 176;

    kids.push(ligne(x0, y0 - 6, x0, y1, { c: 'var(--line-hard)' }));
    kids.push(ligne(x0, y1, x1 + 10, y1, { c: 'var(--line-hard)' }));
    kids.push(txt(x0 - 10, y0 + 2, 'Seuil élevé', { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(x0 - 10, y1 - 2, 'Seuil bas', { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));

    [[0, '0'], [7, '7 min'], [15, '15'], [30, '30 min']].forEach(function (t) {
      var x = x0 + (t[0] / 30) * (x1 - x0);
      kids.push(ligne(x, y1, x, y1 + 5, { c: 'var(--line-hard)' }));
      kids.push(txt(x, y1 + 17, t[1], { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    });
    kids.push(txt(x1 + 10, y1 + 32, 'temps passé dans le noir', { anchor: 'end', size: 10, fill: 'var(--txt-3)' }));

    var xc = x0 + (7 / 30) * (x1 - x0);
    kids.push(S('path', {
      d: 'M ' + x0 + ' ' + (y0 + 6) + ' Q ' + (x0 + 46) + ' ' + (y0 + 54) + ' ' + xc + ' ' + (y0 + 58),
      fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.6
    }));
    kids.push(S('path', {
      d: 'M ' + xc + ' ' + (y0 + 58) + ' Q ' + (xc + 96) + ' ' + (y0 + 106) + ' ' + (x1 - 60) + ' ' + (y1 - 14) +
         ' L ' + x1 + ' ' + (y1 - 14),
      fill: 'none', stroke: 'var(--blue)', 'stroke-width': 2.6
    }));

    kids.push(S('circle', { cx: xc, cy: y0 + 58, r: 5, fill: 'var(--amber)' }));
    kids.push(ligne(xc, y0 + 58, xc + 26, y0 + 30, { c: 'var(--amber)', w: 1 }));
    kids.push(txt(xc + 30, y0 + 26, 'La cassure', { size: 11, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(xc + 30, y0 + 39, 'les bâtonnets prennent le relais', { size: 9.5, fill: 'var(--txt-3)' }));

    kids.push(txt(x0 + 6, y0 - 14, 'Cônes — rapides, mais ils plafonnent',
      { size: 11, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(x1 + 10, y1 - 30, 'Bâtonnets — lents, mais ils descendent bien plus bas',
      { anchor: 'end', size: 11, bold: true, fill: 'var(--blue)' }));

    return svg(640, 218, 'La courbe d’adaptation à l’obscurité', kids);
  }

  /* ============================================================
     7 · Les champs d'action musculaires de l'œil droit
     ============================================================ */
  function positions() {
    var kids = [];
    var cx = 320, cy = 136, dx = 152, dy = 78;
    var cases = [
      { x: -1, y: -1, m: 'OI', n: 'Oblique inférieur', c: 'var(--violet)' },
      { x: 0, y: -1, m: 'DS + OI', n: 'Élévation', c: 'var(--txt-3)' },
      { x: 1, y: -1, m: 'DS', n: 'Droit supérieur', c: 'var(--green)' },
      { x: -1, y: 0, m: 'DM', n: 'Droit médial', c: 'var(--accent)' },
      { x: 0, y: 0, m: '', n: 'Position primaire', c: 'var(--txt-3)' },
      { x: 1, y: 0, m: 'DL', n: 'Droit latéral', c: 'var(--blue)' },
      { x: -1, y: 1, m: 'OS', n: 'Oblique supérieur', c: 'var(--amber)' },
      { x: 0, y: 1, m: 'DI + OS', n: 'Abaissement', c: 'var(--txt-3)' },
      { x: 1, y: 1, m: 'DI', n: 'Droit inférieur', c: 'var(--red)' }
    ];
    cases.forEach(function (c) {
      var x = cx + c.x * dx, y = cy + c.y * dy;
      var vide = !c.m;
      kids.push(S('circle', {
        cx: x, cy: y, r: 27,
        fill: vide ? 'var(--surface-2)' : 'color-mix(in srgb, ' + c.c + ' 16%, transparent)',
        stroke: vide ? 'var(--line)' : c.c, 'stroke-width': 1.4
      }));
      if (c.m) kids.push(txt(x, y + 4, c.m, { anchor: 'middle', size: 11, bold: true, fill: c.c }));
      else kids.push(S('circle', { cx: x, cy: y, r: 5, fill: 'var(--txt-3)' }));
      kids.push(txt(x, y + 43, c.n, { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    });
    kids.push(txt(cx, 22, 'Œil droit, vu du patient — à droite : abduction',
      { anchor: 'middle', size: 11.5, bold: true }));
    kids.push(txt(cx, 282, 'Les droits verticaux élèvent et abaissent en abduction ; les obliques, en adduction.',
      { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));

    return svg(640, 298, 'Champs d’action musculaires de l’œil droit', kids);
  }

  /* ============================================================
     8 · Les quatre modes de transmission
     ============================================================ */
  function transmission() {
    var kids = [];
    var modes = [
      { t: 'Autosomique dominante', c: 'var(--accent)', r: '50 %',
        d: 'Père → fils possible', p: [1, 0], e: [1, 0, 1, 0] },
      { t: 'Autosomique récessive', c: 'var(--blue)', r: '25 %',
        d: 'Parents sains, saut de génération', p: [0, 0], e: [0, 1, 0, 0] },
      { t: 'Liée à l’X', c: 'var(--violet)', r: '50 % des garçons',
        d: 'Jamais père → fils', p: [0, 2], e: [1, 0, 0, 0] },
      { t: 'Mitochondriale', c: 'var(--amber)', r: 'Tous les enfants',
        d: 'Jamais transmise par le père', p: [0, 1], e: [1, 1, 1, 1] }
    ];
    /* 0 = sain, 1 = atteint, 2 = conducteur */
    function individu(x, y, carre, etat, c) {
      var f = etat === 1 ? c : 'var(--surface-3)';
      var n = carre
        ? S('rect', { x: x - 9, y: y - 9, width: 18, height: 18, fill: f, stroke: 'var(--line-hard)' })
        : S('circle', { cx: x, cy: y, r: 9.5, fill: f, stroke: 'var(--line-hard)' });
      var out = [n];
      if (etat === 2) out.push(S('circle', { cx: x, cy: y, r: 3.5, fill: c }));
      return out;
    }

    modes.forEach(function (m, i) {
      var x = 90 + i * 150, y = 62;
      kids.push(txt(x, 26, m.t, { anchor: 'middle', size: 11, bold: true, fill: m.c }));
      /* les parents */
      individu(x - 24, y, true, m.p[0], m.c).forEach(function (n) { kids.push(n); });
      individu(x + 24, y, false, m.p[1], m.c).forEach(function (n) { kids.push(n); });
      kids.push(ligne(x - 14, y, x + 14, y, { c: 'var(--line-hard)' }));
      kids.push(ligne(x, y, x, y + 26, { c: 'var(--line-hard)' }));
      kids.push(ligne(x - 45, y + 26, x + 45, y + 26, { c: 'var(--line-hard)' }));
      /* la fratrie : garçon, fille, garçon, fille */
      m.e.forEach(function (e, k) {
        var ex = x - 45 + k * 30;
        kids.push(ligne(ex, y + 26, ex, y + 40, { c: 'var(--line-hard)' }));
        individu(ex, y + 50, k % 2 === 0, e, m.c).forEach(function (n) { kids.push(n); });
      });
      kids.push(txt(x, y + 78, m.r, { anchor: 'middle', size: 11, bold: true, fill: m.c }));
      kids.push(txt(x, y + 94, m.d, { anchor: 'middle', size: 9, fill: 'var(--txt-3)' }));
    });

    kids.push(S('rect', { x: 232, y: 178, width: 14, height: 14, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
    kids.push(txt(252, 189, 'homme', { size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(S('circle', { cx: 312, cy: 185, r: 7.5, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
    kids.push(txt(324, 189, 'femme', { size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(S('circle', { cx: 384, cy: 185, r: 7.5, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
    kids.push(S('circle', { cx: 384, cy: 185, r: 3, fill: 'var(--violet)' }));
    kids.push(txt(396, 189, 'conductrice · plein = atteint', { size: 9.5, fill: 'var(--txt-3)' }));

    return svg(640, 204, 'Les quatre modes de transmission', kids);
  }

  /* ============================================================
     9 · Les cinq couches de la cornée
     ============================================================ */
  function cornee() {
    var kids = [];
    var couches = [
      ['Épithélium', 'se régénère en 48 h', 34, 'var(--accent)'],
      ['Bowman', 'ne se régénère pas', 12, 'var(--txt-3)'],
      ['Stroma', '90 % de l’épaisseur — lamelles régulières', 108, 'var(--blue)'],
      ['Descemet', 'membrane basale de l’endothélium', 12, 'var(--txt-3)'],
      ['Endothélium', 'pompes — ne se divise plus', 22, 'var(--violet)']
    ];
    var y = 40, x = 190, w = 200;
    couches.forEach(function (c) {
      kids.push(S('rect', {
        x: x, y: y, width: w, height: c[2],
        fill: 'color-mix(in srgb, ' + c[3] + ' 18%, transparent)',
        stroke: 'var(--line)', 'stroke-width': 0.9
      }));
      kids.push(txt(x + w + 14, y + c[2] / 2 + 1, c[0], { size: 11.5, bold: true, fill: c[3] }));
      kids.push(txt(x + w + 14, y + c[2] / 2 + 14, c[1], { size: 9.5, fill: 'var(--txt-3)' }));
      y += c[2];
    });
    kids.push(txt(x - 14, 34, 'LARMES', { anchor: 'end', size: 9.5, bold: true, fill: 'var(--txt-3)' }));
    kids.push(txt(x - 14, y + 4, 'HUMEUR', { anchor: 'end', size: 9.5, bold: true, fill: 'var(--txt-3)' }));
    kids.push(txt(x - 14, y + 16, 'AQUEUSE', { anchor: 'end', size: 9.5, bold: true, fill: 'var(--txt-3)' }));
    kids.push(ligne(150, 40, 150, y, { c: 'var(--txt-3)', dash: '3 3' }));
    kids.push(txt(146, (40 + y) / 2, '≈ 540 µm', { anchor: 'end', size: 11, bold: true }));
    kids.push(txt(x, 28, 'Cinq couches, deux qui ne se réparent pas', { size: 11, bold: true }));
    return svg(640, y + 26, 'Les cinq couches de la cornée', kids);
  }

  /* ============================================================
     10 · L'œil comme système optique
     ============================================================ */
  function oeilOptique() {
    var kids = [];
    var cx = 250, cy = 120, r = 84;
    kids.push(S('circle', { cx: cx, cy: cy, r: r, fill: 'var(--surface-2)', stroke: 'var(--line-hard)', 'stroke-width': 1.4 }));
    /* cornée */
    kids.push(S('path', { d: 'M ' + (cx - r - 4) + ' ' + (cy - 30) + ' q -18 30 0 60',
      fill: 'color-mix(in srgb, var(--accent) 20%, transparent)', stroke: 'var(--accent)', 'stroke-width': 2.4 }));
    kids.push(txt(cx - r - 30, cy - 40, '+43 D', { anchor: 'end', size: 13, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(cx - r - 30, cy - 26, 'la cornée', { anchor: 'end', size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(cx - r - 30, cy - 13, 'les deux tiers', { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));
    /* cristallin */
    kids.push(S('ellipse', { cx: cx - 40, cy: cy, rx: 14, ry: 34,
      fill: 'color-mix(in srgb, var(--blue) 22%, transparent)', stroke: 'var(--blue)', 'stroke-width': 1.8 }));
    /* l'étiquette du cristallin sort du globe : à l'intérieur, elle se poserait
       sur le trait de la rétine */
    kids.push(ligne(cx - 54, cy + 20, cx - r - 26, cy + 34, { c: 'var(--blue)', w: 0.9 }));
    kids.push(txt(cx - r - 30, cy + 26, '+20 D', { anchor: 'end', size: 13, bold: true, fill: 'var(--blue)' }));
    kids.push(txt(cx - r - 30, cy + 40, 'le cristallin,', { anchor: 'end', size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(cx - r - 30, cy + 53, 'réglable', { anchor: 'end', size: 10, fill: 'var(--txt-3)' }));
    /* rétine et longueur axiale */
    kids.push(S('path', { d: 'M ' + (cx + 40) + ' ' + (cy - 74) + ' q 46 74 0 148',
      fill: 'none', stroke: 'var(--violet)', 'stroke-width': 2.4 }));
    kids.push(txt(cx + 96, cy - 44, 'rétine', { size: 10, fill: 'var(--violet)' }));
    kids.push(ligne(cx - r - 4, cy + r + 16, cx + r, cy + r + 16, { c: 'var(--txt-3)', dash: '4 3' }));
    kids.push(txt(cx, cy + r + 32, 'Longueur axiale ≈ 24 mm', { anchor: 'middle', size: 11, bold: true }));

    kids.push(txt(470, 74, '≈ +60 D au total', { size: 15, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(470, 98, 'Le gros du travail est fait', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(470, 112, 'avant même que la lumière', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(470, 126, 'entre dans l’œil.', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(470, 154, '1 mm de longueur', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(470, 168, '≈ 3 D d’amétropie', { size: 11.5, bold: true, fill: 'var(--violet)' }));

    return svg(640, 250, 'L’œil comme système optique', kids);
  }

  /* ============================================================
     11 · La transposition cylindrique
     ============================================================ */
  function transposition() {
    var kids = [];
    function croix(cx, cy, axe, p1, p2, c1, c2, titre) {
      var a = axe * Math.PI / 180, L = 46;
      kids.push(txt(cx, cy - 74, titre, { anchor: 'middle', size: 11, bold: true }));
      kids.push(ligne(cx - Math.cos(a) * L, cy + Math.sin(a) * L,
                      cx + Math.cos(a) * L, cy - Math.sin(a) * L, { c: c1, w: 3 }));
      var b = a + Math.PI / 2;
      kids.push(ligne(cx - Math.cos(b) * L, cy + Math.sin(b) * L,
                      cx + Math.cos(b) * L, cy - Math.sin(b) * L, { c: c2, w: 3 }));
      kids.push(txt(cx + Math.cos(a) * (L + 16), cy - Math.sin(a) * (L + 16) + 4, p1,
        { anchor: 'middle', size: 11.5, bold: true, fill: c1 }));
      kids.push(txt(cx + Math.cos(b) * (L + 16), cy - Math.sin(b) * (L + 16) + 4, p2,
        { anchor: 'middle', size: 11.5, bold: true, fill: c2 }));
    }
    croix(150, 108, 0, '−3,00', '−1,00', 'var(--accent)', 'var(--blue)', 'Les deux méridiens');
    kids.push(txt(150, 186, '−3,00 à l’horizontale, −1,00 à la verticale', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));

    kids.push(txt(320, 96, '−1,00 (−2,00 × 90°)', { anchor: 'middle', size: 12.5, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(320, 114, '↕', { anchor: 'middle', size: 16, fill: 'var(--txt-3)' }));
    kids.push(txt(320, 134, '−3,00 (+2,00 × 180°)', { anchor: 'middle', size: 12.5, bold: true, fill: 'var(--blue)' }));
    kids.push(txt(320, 158, 'Le même verre, écrit deux fois', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));

    kids.push(txt(470, 62, 'La recette', { size: 11.5, bold: true }));
    [['Nouvelle sphère', 'sphère + cylindre'],
     ['Nouveau cylindre', 'on change le signe'],
     ['Nouvel axe', 'on tourne de 90°']].forEach(function (l, i) {
      kids.push(txt(470, 86 + i * 30, l[0], { size: 10.5, bold: true, fill: 'var(--accent)' }));
      kids.push(txt(470, 100 + i * 30, l[1], { size: 10, fill: 'var(--txt-2)' }));
    });
    kids.push(txt(320, 196, 'La transposée décrit exactement le même verre : l’équivalent sphérique ne bouge pas.',
      { anchor: 'middle', size: 10.5, bold: true }));

    return svg(640, 216, 'La transposition cylindrique', kids);
  }

  /* ============================================================
     12 · La distance de sommet
     ============================================================ */
  function sommet(p) {
    var kids = [];
    var P = p.puissance, dm = p.distance / 1000;
    var Pp = P / (1 - dm * P);              // puissance efficace sur la cornée
    var ecart = Math.abs(Pp - P);

    function oeil(cx, cy) {
      kids.push(S('circle', { cx: cx, cy: cy, r: 32, fill: 'var(--surface-2)', stroke: 'var(--line-hard)' }));
      kids.push(S('path', { d: 'M ' + (cx - 34) + ' ' + (cy - 14) + ' q -10 14 0 28',
        fill: 'none', stroke: 'var(--txt-3)', 'stroke-width': 1.6 }));
    }
    oeil(230, 108); oeil(500, 108);

    /* le verre : son épaisseur suit sa puissance, et son sens son signe */
    var ep = Math.min(9, 2 + Math.abs(P) * 0.7);
    var xv = 196 - p.distance * 2.2;
    kids.push(S('ellipse', { cx: xv, cy: 108, rx: ep, ry: 34,
      fill: 'var(--surface-3)', stroke: 'var(--accent)', 'stroke-width': 2 }));
    kids.push(ligne(xv, 152, 196, 152, { c: 'var(--txt-3)', dash: '3 3' }));
    kids.push(ligne(xv, 147, xv, 157, { c: 'var(--txt-3)' }));
    kids.push(ligne(196, 147, 196, 157, { c: 'var(--txt-3)' }));
    kids.push(txt((xv + 196) / 2, 170, p.distance + ' mm', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(xv, 56, 'Verre', { anchor: 'middle', size: 11, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(xv, 40, fmt(P) + ' D', { anchor: 'middle', size: 14, bold: true, fill: 'var(--accent)' }));

    kids.push(S('path', { d: 'M 466 94 q -8 14 0 28', fill: 'none', stroke: 'var(--blue)', 'stroke-width': 2.6 }));
    kids.push(txt(470, 56, 'Lentille', { anchor: 'middle', size: 11, bold: true, fill: 'var(--blue)' }));
    kids.push(txt(470, 40, fmt(Pp) + ' D', { anchor: 'middle', size: 14, bold: true, fill: 'var(--blue)' }));
    kids.push(txt(470, 170, 'posée sur la cornée', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));

    kids.push(txt(320, 92, 'P′ = P / (1 − d × P)', { anchor: 'middle', size: 13, bold: true }));
    var c = ecart >= 0.25 ? 'var(--amber)' : 'var(--txt-3)';
    kids.push(S('rect', { x: 268, y: 106, width: 104, height: 30, rx: 15,
      fill: 'color-mix(in srgb, ' + c + ' 14%, transparent)', stroke: c, 'stroke-width': 1.1 }));
    kids.push(txt(320, 126, 'écart ' + ecart.toFixed(2).replace('.', ',') + ' D',
      { anchor: 'middle', size: 12, bold: true, fill: c }));

    kids.push(txt(320, 200, ecart >= 0.25
      ? 'Au-delà du quart de dioptrie, l’écart se voit : la conversion n’est plus facultative.'
      : 'Sous le quart de dioptrie, l’écart ne se voit pas : la conversion est inutile.',
      { anchor: 'middle', size: 10.5, bold: true }));
    kids.push(txt(320, 216, 'Rapprocher un verre négatif oblige à en mettre moins — un verre positif, davantage.',
      { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));

    return svg(640, 232, 'La distance de sommet : verre et lentille ne valent pas la même chose', kids);
  }

  /* ============================================================
     13 · La skiascopie : lire le sens de l'ombre
     ============================================================ */
  function skiascopie() {
    var kids = [];
    var cas = [
      { t: 'Ombre directe', s: 'elle va dans le sens de la main', a: 'Il manque du plus', c: 'var(--accent)', d: 1 },
      { t: 'Ombre inverse', s: 'elle va à contresens', a: 'Il y a trop de plus', c: 'var(--blue)', d: -1 },
      { t: 'Le neutre', s: 'toute la pupille s’allume d’un coup', a: 'On y est', c: 'var(--green)', d: 0 }
    ];
    cas.forEach(function (c, i) {
      var cx = 120 + i * 200, cy = 116;
      kids.push(txt(cx, 34, c.t, { anchor: 'middle', size: 12, bold: true, fill: c.c }));
      kids.push(txt(cx, 48, c.s, { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
      kids.push(S('circle', { cx: cx, cy: cy, r: 34, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
      if (c.d === 0) {
        kids.push(S('circle', { cx: cx, cy: cy, r: 33, fill: 'color-mix(in srgb, var(--green) 45%, transparent)' }));
      } else {
        kids.push(S('path', {
          d: 'M ' + cx + ' ' + (cy - 33) + ' a 33 33 0 0 ' + (c.d > 0 ? 1 : 0) + ' 0 66 z',
          fill: 'color-mix(in srgb, ' + c.c + ' 45%, transparent)'
        }));
      }
      /* le sens de la main */
      kids.push(ligne(cx - 40, cy + 54, cx + 40, cy + 54, { c: 'var(--txt-3)', arrow: true, w: 1.4 }));
      kids.push(txt(cx, cy + 70, 'la main', { anchor: 'middle', size: 9, fill: 'var(--txt-3)' }));
      if (c.d !== 0) {
        kids.push(ligne(cx + (c.d > 0 ? -22 : 22), cy - 46, cx + (c.d > 0 ? 22 : -22), cy - 46,
          { c: c.c, arrow: true, w: 1.6 }));
        kids.push(txt(cx, cy - 54, 'le reflet', { anchor: 'middle', size: 9, fill: c.c }));
      }
      kids.push(txt(cx, cy + 96, c.a, { anchor: 'middle', size: 11, bold: true, fill: c.c }));
    });
    kids.push(txt(320, 240, 'Et l’on retranche toujours la distance de travail : à 50 cm, on a mis 2 D de trop.',
      { anchor: 'middle', size: 10.5, bold: true }));
    return svg(640, 260, 'La skiascopie : ombre directe, ombre inverse, neutre', kids);
  }

  /* ============================================================
     14 · L'amplitude d'accommodation avec l'âge
     ============================================================ */
  function amplitude(p) {
    var kids = [];
    var x0 = 78, x1 = 552, y0 = 46, y1 = 190;
    var ages = [10, 20, 30, 40, 50, 60, 70];
    function X(a) { return x0 + ((a - 10) / 60) * (x1 - x0); }
    function Y(d) { return y1 - (d / 14) * (y1 - y0); }

    var ampli = Math.max(0.5, 18.5 - 0.3 * p.age);      // Hofstetter, valeur moyenne
    var demande = 100 / p.distance;                      // dioptries exigées par la distance
    var manque = demande - ampli / 2;                    // on garde la moitié en réserve
    var add = Math.max(0, Math.round(manque * 4) / 4);

    kids.push(ligne(x0, y0 - 4, x0, y1, { c: 'var(--line-hard)' }));
    kids.push(ligne(x0, y1, x1 + 8, y1, { c: 'var(--line-hard)' }));
    [0, 4, 8, 12].forEach(function (d2) {
      kids.push(ligne(x0 - 5, Y(d2), x1, Y(d2), { c: 'var(--line-soft)' }));
      kids.push(txt(x0 - 10, Y(d2) + 4, d2 + ' D', { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));
    });
    ages.forEach(function (a) {
      kids.push(ligne(X(a), y1, X(a), y1 + 5, { c: 'var(--line-hard)' }));
      kids.push(txt(X(a), y1 + 17, String(a), { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    });
    kids.push(txt(x1 + 8, y1 + 32, 'âge', { anchor: 'end', size: 10, fill: 'var(--txt-3)' }));

    var pts = ages.map(function (a) { return X(a) + ',' + Y(Math.max(0.5, 18.5 - 0.3 * a)); });
    kids.push(S('polyline', { points: pts.join(' '), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.6 }));

    /* la demande de la distance choisie, et la moitié qu'on garde en réserve */
    kids.push(ligne(x0, Y(demande), x1, Y(demande), { c: 'var(--blue)', dash: '5 4' }));
    kids.push(txt(x1, Y(demande) - 7, 'lire à ' + p.distance + ' cm demande ' + fmt(demande).replace('+', '') + ' D',
      { anchor: 'end', size: 10, fill: 'var(--blue)' }));
    kids.push(ligne(x0, Y(demande * 2), x1, Y(demande * 2), { c: 'var(--blue)', dash: '2 4' }));
    kids.push(txt(x1, Y(demande * 2) - 7, 'avec la réserve : il faudrait ' + fmt(demande * 2).replace('+', '') + ' D d’amplitude',
      { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));

    /* où en est le patient */
    kids.push(ligne(X(p.age), y0, X(p.age), y1, { c: 'var(--amber)', dash: '4 3' }));
    kids.push(S('circle', { cx: X(p.age), cy: Y(ampli), r: 6, fill: 'var(--amber)' }));
    kids.push(txt(X(p.age), y0 - 8, p.age + ' ans', { anchor: 'middle', size: 11, bold: true, fill: 'var(--amber)' }));

    kids.push(S('rect', { x: 300, y: 210, width: 240, height: 34, rx: 8,
      fill: add > 0 ? 'color-mix(in srgb, var(--amber) 14%, transparent)' : 'color-mix(in srgb, var(--green) 14%, transparent)',
      stroke: add > 0 ? 'var(--amber)' : 'var(--green)', 'stroke-width': 1.2 }));
    kids.push(txt(420, 232, add > 0 ? 'Addition nécessaire : ' + fmt(add) + ' D' : 'Aucune addition nécessaire',
      { anchor: 'middle', size: 12.5, bold: true, fill: add > 0 ? 'var(--amber)' : 'var(--green)' }));
    kids.push(txt(90, 224, 'Amplitude moyenne ≈ 18,5 − 0,3 × âge', { size: 10.5, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(90, 238, 'soit ' + fmt(ampli).replace('+', '') + ' D à cet âge', { size: 10, fill: 'var(--txt-3)' }));

    return svg(640, 254, 'L’amplitude d’accommodation décroît avec l’âge', kids);
  }

  /* ============================================================
     15 · L'optotype et la minute d'arc
     ============================================================ */
  function optotype() {
    var kids = [];
    var x = 120, y = 60, c = 22;   // une case de 5×5
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        var plein = (i === 0) || (i === 2) || (i === 4) || (j === 0);
        kids.push(S('rect', {
          x: x + j * c, y: y + i * c, width: c, height: c,
          fill: plein ? 'var(--txt)' : 'transparent',
          stroke: 'var(--line)', 'stroke-width': 0.6
        }));
      }
    }
    kids.push(ligne(x - 16, y, x - 16, y + 5 * c, { c: 'var(--accent)', w: 1.4 }));
    kids.push(ligne(x - 21, y, x - 11, y, { c: 'var(--accent)' }));
    kids.push(ligne(x - 21, y + 5 * c, x - 11, y + 5 * c, { c: 'var(--accent)' }));
    kids.push(txt(x - 26, y + 2.5 * c, '5′', { anchor: 'end', size: 13, bold: true, fill: 'var(--accent)' }));

    kids.push(ligne(x + 5 * c + 14, y, x + 5 * c + 14, y + c, { c: 'var(--blue)', w: 1.4 }));
    kids.push(ligne(x + 5 * c + 9, y, x + 5 * c + 19, y, { c: 'var(--blue)' }));
    kids.push(ligne(x + 5 * c + 9, y + c, x + 5 * c + 19, y + c, { c: 'var(--blue)' }));
    kids.push(txt(x + 5 * c + 26, y + c / 2 + 4, '1′ — le détail critique',
      { size: 11.5, bold: true, fill: 'var(--blue)' }));

    kids.push(txt(400, 118, '10/10 = résoudre 1 minute d’arc', { size: 12.5, bold: true }));
    kids.push(txt(400, 138, 'Toute la métrologie de l’acuité tient', { size: 10, fill: 'var(--txt-2)' }));
    kids.push(txt(400, 152, 'dans cette seule définition angulaire.', { size: 10, fill: 'var(--txt-2)' }));
    kids.push(txt(400, 176, 'La taille physique de l’optotype', { size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(400, 190, 'n’a de sens qu’avec sa distance.', { size: 10, fill: 'var(--txt-3)' }));

    kids.push(txt(x, 40, 'L’optotype tient dans un carré de 5 × 5', { size: 11, bold: true }));
    return svg(640, 216, 'L’optotype de 10/10 : 5 minutes d’arc, un détail d’une minute', kids);
  }

  /* ============================================================
     16 · Monoyer et logMAR : deux échelles, deux comportements
     ============================================================ */
  function echelles() {
    var kids = [];
    var y = 78, x0 = 90, w = 460;
    var mono = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    kids.push(txt(x0, 46, 'Monoyer — pas linéaire en dixièmes', { size: 11.5, bold: true, fill: 'var(--amber)' }));
    mono.forEach(function (d) {
      var px = x0 + (d / 10) * w;
      kids.push(ligne(px, y, px, y + 16, { c: 'var(--amber)', w: 2 }));
      kids.push(txt(px, y + 30, d + '/10', { anchor: 'middle', size: 8.5, fill: 'var(--txt-3)' }));
    });
    kids.push(ligne(x0, y + 8, x0 + w, y + 8, { c: 'var(--line-hard)' }));
    kids.push(txt(x0 + 6, y - 6, 'entre 1 et 2/10 : un monde', { size: 9, italic: true, fill: 'var(--txt-3)' }));
    kids.push(txt(x0 + w - 6, y - 6, 'entre 9 et 10/10 : presque rien',
      { anchor: 'end', size: 9, italic: true, fill: 'var(--txt-3)' }));

    var y2 = 168;
    kids.push(txt(x0, y2 - 32, 'logMAR — chaque ligne vaut le même pas (0,1)', { size: 11.5, bold: true, fill: 'var(--green)' }));
    for (var k = 0; k <= 10; k++) {
      var px2 = x0 + (k / 10) * w;
      kids.push(ligne(px2, y2, px2, y2 + 16, { c: 'var(--green)', w: 2 }));
      kids.push(txt(px2, y2 + 30, (1 - k * 0.1).toFixed(1), { anchor: 'middle', size: 8.5, fill: 'var(--txt-3)' }));
    }
    kids.push(ligne(x0, y2 + 8, x0 + w, y2 + 8, { c: 'var(--line-hard)' }));

    kids.push(txt(320, 232, 'Pour comparer deux mesures ou suivre une évolution, seule une échelle logarithmique est honnête.',
      { anchor: 'middle', size: 10.5, bold: true }));
    return svg(640, 252, 'Monoyer et logMAR', kids);
  }

  /* ============================================================
     17 · Le crowding
     ============================================================ */
  function crowding() {
    var kids = [];
    kids.push(txt(160, 44, 'Isolée : il la lit', { anchor: 'middle', size: 11.5, bold: true, fill: 'var(--green)' }));
    kids.push(S('text', { x: 160, y: 128, 'text-anchor': 'middle', 'font-size': 62,
      'font-weight': 700, fill: 'var(--txt)' }, 'E'));

    kids.push(txt(450, 44, 'En ligne : elle disparaît', { anchor: 'middle', size: 11.5, bold: true, fill: 'var(--amber)' }));
    ['H', 'K', 'E', 'D', 'N'].forEach(function (l, i) {
      kids.push(S('text', {
        x: 360 + i * 45, y: 128, 'text-anchor': 'middle', 'font-size': 62, 'font-weight': 700,
        fill: i === 2 ? 'var(--amber)' : 'var(--txt-3)'
      }, l));
    });
    kids.push(S('rect', { x: 428, y: 74, width: 46, height: 66, fill: 'none',
      stroke: 'var(--amber)', 'stroke-width': 1.6, 'stroke-dasharray': '4 3', rx: 4 }));

    kids.push(txt(320, 176, 'L’effet d’entassement est le signe le plus fidèle de l’amblyopie.',
      { anchor: 'middle', size: 11, bold: true }));
    kids.push(txt(320, 194, 'On mesure donc toujours en présentation groupée — sinon on manque le déficit.',
      { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    return svg(640, 214, 'Le crowding : la lettre étouffée par ses voisines', kids);
  }

  /* ============================================================
     18 · Sherrington, Hering et la déviation secondaire
     ============================================================ */
  function hering() {
    var kids = [];
    function paire(x, titre, gauche, droite, note, c) {
      kids.push(txt(x, 40, titre, { anchor: 'middle', size: 11.5, bold: true, fill: c }));
      [[-46, gauche], [46, droite]].forEach(function (o) {
        var cx = x + o[0];
        kids.push(S('circle', { cx: cx, cy: 92, r: 26, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
        kids.push(S('circle', { cx: cx + o[1] * 10, cy: 92, r: 8, fill: 'var(--txt-2)' }));
      });
      kids.push(txt(x, 142, note, { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    }
    paire(160, 'L’œil sain fixe', 0, 1.1, 'Déviation primaire — petite', 'var(--accent)');
    paire(470, 'L’œil parétique fixe', -1.1, 0, 'Déviation secondaire — plus grande', 'var(--amber)');
    kids.push(ligne(300, 92, 330, 92, { c: 'var(--txt-3)', dash: '3 3' }));

    kids.push(txt(320, 182, 'Hering : la commande part en double exemplaire, elle ne se partage pas.',
      { anchor: 'middle', size: 11, bold: true }));
    kids.push(txt(320, 200, 'Si l’œil parétique doit forcer pour fixer, l’œil sain reçoit la même commande majorée — et dévie davantage.',
      { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(320, 220, 'Sherrington, lui, ne regarde qu’un œil : un muscle se contracte, son antagoniste se relâche.',
      { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    return svg(640, 240, 'Déviation primaire et déviation secondaire', kids);
  }

  /* ============================================================
     19 · Horoptère et aire de Panum
     ============================================================ */
  function panum() {
    var kids = [];
    var cx = 320, oy = 232, e = 66;
    [-e, e].forEach(function (d) {
      kids.push(S('circle', { cx: cx + d, cy: oy, r: 20, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
      kids.push(S('circle', { cx: cx + d - d * 0.12, cy: oy - 8, r: 6, fill: 'var(--txt-2)' }));
    });

    /* l'horoptère : un arc passant par le point de fixation */
    kids.push(S('path', { d: 'M 90 128 Q ' + cx + ' 40 550 128', fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.4 }));
    /* l'aire de Panum : une bande autour */
    kids.push(S('path', { d: 'M 90 148 Q ' + cx + ' 60 550 148 L 550 108 Q ' + cx + ' 20 90 108 Z',
      fill: 'color-mix(in srgb, var(--green) 14%, transparent)', stroke: 'none' }));
    kids.push(txt(cx, 34, 'Aire de Panum — ici, deux images disparates fusionnent et donnent le relief',
      { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--green)' }));
    kids.push(ligne(120, 168, 132, 134, { c: 'var(--accent)', w: 0.9 }));
    kids.push(txt(96, 180, 'Horoptère', { size: 11, bold: true, fill: 'var(--accent)' }));

    /* le point de fixation et deux points hors zone */
    kids.push(S('circle', { cx: cx, cy: 66, r: 6, fill: 'var(--accent)' }));
    kids.push(ligne(cx - e, oy - 20, cx, 72, { c: 'var(--accent)', w: 1 }));
    kids.push(ligne(cx + e, oy - 20, cx, 72, { c: 'var(--accent)', w: 1 }));
    kids.push(txt(cx + 14, 62, 'point fixé', { size: 10, fill: 'var(--accent)' }));

    kids.push(S('circle', { cx: 180, cy: 190, r: 6, fill: 'var(--red)' }));
    kids.push(txt(150, 186, 'trop près :', { anchor: 'end', size: 10, bold: true, fill: 'var(--red)' }));
    kids.push(txt(150, 199, 'diplopie physiologique', { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));

    kids.push(txt(cx, 286, 'Trop peu de disparité, pas de relief ; trop de disparité, diplopie. La stéréoscopie vit entre les deux.',
      { anchor: 'middle', size: 10.5, bold: true }));
    return svg(640, 304, 'Horoptère et aire de Panum', kids);
  }

  /* ============================================================
     20 · Le cover test
     ============================================================ */
  function covertest() {
    var kids = [];
    function scene(x, y, titre, sous, gauche, droite, cache, c) {
      kids.push(txt(x, y - 32, titre, { anchor: 'middle', size: 11.5, bold: true, fill: c }));
      kids.push(txt(x, y - 18, sous, { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
      [[-40, gauche, cache === 'g'], [40, droite, cache === 'd']].forEach(function (o) {
        var cx = x + o[0];
        kids.push(S('circle', { cx: cx, cy: y + 22, r: 22, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
        if (o[2]) {
          kids.push(S('rect', { x: cx - 26, y: y - 4, width: 52, height: 52, rx: 5,
            fill: 'var(--surface-4)', stroke: 'var(--txt-3)' }));
          kids.push(txt(cx, y + 27, 'cache', { anchor: 'middle', size: 8.5, fill: 'var(--txt-3)' }));
        } else {
          kids.push(S('circle', { cx: cx + o[1] * 9, cy: y + 22, r: 7, fill: 'var(--txt-2)' }));
        }
      });
    }
    scene(150, 60, 'Cover unilatéral', 'on cache un œil, on regarde l’autre', 1, 0, 'd', 'var(--accent)');
    kids.push(txt(150, 126, 'L’œil découvert bouge → tropie', { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--accent)' }));

    scene(470, 60, 'Cover alterné', 'on passe d’un œil à l’autre', 0, 1, 'g', 'var(--blue)');
    kids.push(txt(470, 126, 'Ça ne bouge qu’à la dissociation → phorie', { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--blue)' }));

    kids.push(ligne(300, 82, 330, 82, { c: 'var(--line-soft)' }));
    kids.push(txt(320, 168, 'On note toujours : nature, sens, amplitude, distance, œil fixateur, comitance.',
      { anchor: 'middle', size: 10.5, bold: true }));
    kids.push(txt(320, 186, 'Une mesure sans sa distance et son œil fixateur ne veut rien dire.',
      { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    return svg(640, 206, 'Cover test unilatéral et cover test alterné', kids);
  }

  /* ============================================================
     21 · La phototransduction, en chaîne
     ============================================================ */
  function phototransduction() {
    var kids = [];
    var etapes = [
      ['Photon', 'il arrive', 'var(--amber)'],
      ['11-cis → tout-trans', 'le rétinal s’isomérise', 'var(--accent)'],
      ['Rhodopsine', 'activée', 'var(--accent)'],
      ['Transducine', 'protéine G', 'var(--blue)'],
      ['Phosphodiestérase', 'elle détruit le GMPc', 'var(--blue)'],
      ['GMPc ↓', 'les canaux se ferment', 'var(--violet)'],
      ['Hyperpolarisation', 'le neurone se tait', 'var(--violet)']
    ];
    var x = 46, y = 74;
    etapes.forEach(function (e, i) {
      var w = 74;
      kids.push(S('rect', { x: x, y: y, width: w, height: 46, rx: 6,
        fill: 'color-mix(in srgb, ' + e[2] + ' 14%, transparent)', stroke: e[2], 'stroke-width': 1.2 }));
      kids.push(txt(x + w / 2, y + 20, e[0], { anchor: 'middle', size: 9.5, bold: true, fill: e[2] }));
      kids.push(txt(x + w / 2, y + 34, e[1], { anchor: 'middle', size: 8, fill: 'var(--txt-3)' }));
      if (i < etapes.length - 1) {
        kids.push(ligne(x + w + 2, y + 23, x + w + 12, y + 23, { c: 'var(--txt-3)', arrow: true, w: 1.2 }));
      }
      x += w + 14;
    });
    kids.push(txt(320, 42, 'Dans le noir le photorécepteur est bavard ; la lumière le fait taire.',
      { anchor: 'middle', size: 12, bold: true }));
    kids.push(txt(320, 152, 'C’est le seul neurone qui répond à son stimulus en s’hyperpolarisant.',
      { anchor: 'middle', size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(320, 170, 'Le signal visuel, c’est un silence — et le cycle a besoin de vitamine A.',
      { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    return svg(640, 190, 'La cascade de phototransduction', kids);
  }

  /* ============================================================
     22 · Le champ récepteur en centre-pourtour
     ============================================================ */
  function champrecepteur() {
    var kids = [];
    function cellule(cx, titre, centreOn) {
      var c1 = centreOn ? 'var(--accent)' : 'var(--surface-4)';
      var c2 = centreOn ? 'var(--surface-4)' : 'var(--accent)';
      kids.push(txt(cx, 44, titre, { anchor: 'middle', size: 11.5, bold: true }));
      kids.push(S('circle', { cx: cx, cy: 104, r: 44, fill: c2, stroke: 'var(--line-hard)' }));
      kids.push(S('circle', { cx: cx, cy: 104, r: 22, fill: c1, stroke: 'var(--line-hard)' }));
      kids.push(txt(cx, 168, centreOn ? 'centre ON, pourtour OFF' : 'centre OFF, pourtour ON',
        { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    }
    cellule(150, 'Cellule à centre ON', true);
    cellule(340, 'Cellule à centre OFF', false);

    kids.push(txt(452, 74, 'La cellule ne demande pas', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(452, 88, '« y a-t-il de la lumière ? »', { size: 10.5, italic: true, fill: 'var(--txt-3)' }));
    kids.push(txt(452, 108, 'mais', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(452, 126, '« y a-t-il une différence ? »', { size: 11.5, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(452, 150, 'La rétine envoie des contrastes,', { size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(452, 163, 'pas une image.', { size: 10, fill: 'var(--txt-3)' }));

    kids.push(txt(320, 202, 'C’est pourquoi une plainte visuelle peut exister avec 10/10 : l’acuité mesure la résolution en fort contraste.',
      { anchor: 'middle', size: 10.5, bold: true }));
    return svg(640, 220, 'Les champs récepteurs en centre-pourtour', kids);
  }

  /* ============================================================
     23 · Les voies magnocellulaire et parvocellulaire
     ============================================================ */
  function magnoparvo() {
    var kids = [];
    function voie(y, nom, sous, items, c) {
      kids.push(S('rect', { x: 60, y: y, width: 150, height: 54, rx: 8,
        fill: 'color-mix(in srgb, ' + c + ' 14%, transparent)', stroke: c, 'stroke-width': 1.3 }));
      kids.push(txt(135, y + 23, nom, { anchor: 'middle', size: 12.5, bold: true, fill: c }));
      kids.push(txt(135, y + 39, sous, { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
      items.forEach(function (t, i) {
        kids.push(ligne(212, y + 27, 246, y + 27, { c: c, w: 1.2 }));
        kids.push(txt(256, y + 16 + i * 15, '· ' + t, { size: 10.5, fill: 'var(--txt-2)' }));
      });
    }
    voie(52, 'Magnocellulaire', 'l’éclaireur', ['Mouvement, basses fréquences', 'Achromatique, conduction rapide', 'Voie dorsale : « où ? »'], 'var(--blue)');
    voie(148, 'Parvocellulaire', 'l’expert', ['Détail, haute résolution', 'Couleur, conduction lente', 'Voie ventrale : « quoi ? »'], 'var(--violet)');

    kids.push(txt(320, 32, 'Deux voies, deux métiers', { anchor: 'middle', size: 12, bold: true }));
    kids.push(txt(320, 232, 'Les troubles neurovisuels de l’enfant se lisent souvent dans cette dichotomie : « où » et « quoi » ne tombent pas ensemble.',
      { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    return svg(640, 250, 'Les voies magnocellulaire et parvocellulaire', kids);
  }

  /* ============================================================
     24 · L'orbite et ses orifices
     ============================================================ */
  function orbite() {
    var kids = [];
    /* la pyramide, vue de face — bornée à gauche pour laisser la colonne
       des orifices respirer : deux blocs de texte côte à côte ne tiennent
       pas dans 640 s'ils se disputent le milieu */
    kids.push(txt(56, 30, 'Sept os, quatre parois, un sommet où tout se croise', { size: 11.5, bold: true }));
    kids.push(S('path', { d: 'M 60 60 L 300 78 L 292 198 L 72 210 Z',
      fill: 'var(--surface-2)', stroke: 'var(--line-hard)', 'stroke-width': 1.4 }));
    kids.push(S('circle', { cx: 186, cy: 136, r: 50, fill: 'var(--surface-3)', stroke: 'var(--line)', 'stroke-width': 1 }));
    kids.push(txt(186, 140, 'globe', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));

    kids.push(txt(60, 52, 'Frontal', { size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(306, 90, 'Grande aile', { size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(306, 102, 'zygomatique', { size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(60, 228, 'Plancher — maxillaire', { size: 9.5, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(60, 241, 'Paroi médiale — ethmoïde', { size: 9.5, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(60, 254, 'Les deux parois fragiles : fracture du plancher, cellulite ethmoïdale.',
      { size: 9.5, fill: 'var(--txt-3)' }));

    var y0 = 58;
    kids.push(txt(392, 42, 'Au sommet, trois passages', { size: 11.5, bold: true }));
    [['Canal optique', 'II + artère ophtalmique', 'var(--accent)'],
     ['Fente sphénoïdale', 'III, IV, VI, V1, veine ophtalmique', 'var(--blue)'],
     ['Fente sphéno-maxillaire', 'V2', 'var(--violet)']
    ].forEach(function (o, i) {
      var y = y0 + i * 46;
      kids.push(S('rect', { x: 392, y: y, width: 218, height: 36, rx: 6,
        fill: 'color-mix(in srgb, ' + o[2] + ' 12%, transparent)', stroke: o[2], 'stroke-width': 1.1 }));
      kids.push(txt(402, y + 15, o[0], { size: 10.5, bold: true, fill: o[2] }));
      kids.push(txt(402, y + 28, o[1], { size: 9, fill: 'var(--txt-3)' }));
    });
    kids.push(txt(392, 214, 'Ce qui est atteint ensemble', { size: 10, bold: true, fill: 'var(--txt-2)' }));
    kids.push(txt(392, 227, 'a voyagé ensemble.', { size: 10, bold: true, fill: 'var(--txt-2)' }));
    kids.push(txt(392, 245, 'Le nerf optique a son propre canal :', { size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(392, 257, 'c’est ce qui sépare un syndrome de', { size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(392, 269, 'l’apex d’un syndrome de la fente.', { size: 9.5, fill: 'var(--txt-3)' }));

    return svg(640, 286, 'L’orbite et ses orifices', kids);
  }

  /* ============================================================
     25 · L'innervation oculomotrice
     ============================================================ */
  function innervation() {
    var kids = [];
    var groupes = [
      { n: 'VI', t: 'Droit latéral', m: ['Droit latéral'], c: 'var(--blue)', x: 90 },
      { n: 'IV', t: 'Oblique supérieur', m: ['Oblique supérieur'], c: 'var(--amber)', x: 268 },
      { n: 'III', t: 'Tous les autres', m: ['Droit supérieur', 'Droit médial', 'Droit inférieur', 'Oblique inférieur', 'Releveur', 'Sphincter irien'], c: 'var(--accent)', x: 446 }
    ];
    groupes.forEach(function (g) {
      kids.push(S('circle', { cx: g.x + 50, cy: 74, r: 26,
        fill: 'color-mix(in srgb, ' + g.c + ' 18%, transparent)', stroke: g.c, 'stroke-width': 1.6 }));
      kids.push(txt(g.x + 50, 80, g.n, { anchor: 'middle', size: 16, bold: true, fill: g.c }));
      kids.push(txt(g.x + 50, 118, g.t, { anchor: 'middle', size: 10.5, bold: true }));
      g.m.forEach(function (m, i) {
        kids.push(txt(g.x + 50, 138 + i * 15, m, { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
      });
    });
    kids.push(txt(320, 34, '« LR6 SO4, tous les autres 3 »', { anchor: 'middle', size: 14, bold: true }));
    kids.push(txt(320, 244, 'Le III se divise : branche supérieure (droit supérieur, releveur) et branche inférieure',
      { anchor: 'middle', size: 10, fill: 'var(--txt-2)' }));
    kids.push(txt(320, 258, '(droits médial et inférieur, oblique inférieur, parasympathique pupillaire).',
      { anchor: 'middle', size: 10, fill: 'var(--txt-2)' }));
    kids.push(txt(320, 276, 'D’où un III qui peut épargner la pupille — la donnée qui décide de l’urgence.',
      { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--accent)' }));
    return svg(640, 294, 'L’innervation des muscles oculomoteurs', kids);
  }

  /* ============================================================
     26 · Le rapport AC/A : loin et près
     ============================================================ */
  function acA(p) {
    var kids = [];
    var demande = 100 / p.distance;
    var pres = p.loin + p.aca * demande;
    var normal = p.aca >= 3 && p.aca <= 5;
    var c = normal ? 'var(--green)' : p.aca > 5 ? 'var(--accent)' : 'var(--blue)';

    kids.push(txt(320, 28, 'Accommoder entraîne la convergence : l’AC/A mesure la longueur de la corde',
      { anchor: 'middle', size: 12, bold: true }));

    /* les deux angles, en barres proportionnelles */
    function barre(y, titre, val, couleur) {
      kids.push(txt(150, y + 5, titre, { anchor: 'end', size: 11, bold: true }));
      var w = Math.max(6, Math.min(196, Math.abs(val) * 5.2));
      kids.push(S('rect', { x: 162, y: y - 12, width: w, height: 26, rx: 5,
        fill: 'color-mix(in srgb, ' + couleur + ' 34%, transparent)', stroke: couleur, 'stroke-width': 1.2 }));
      kids.push(txt(162 + w + 12, y + 5, (val > 0 ? '+' : '') + val.toFixed(1).replace('.', ',') + ' Δ',
        { size: 12.5, bold: true, fill: couleur }));
    }
    barre(84, 'De loin', p.loin, 'var(--blue)');
    barre(140, 'De près', pres, c);

    kids.push(txt(150, 176, 'L’accommodation ajoute', { anchor: 'end', size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(162, 176, (p.aca * demande).toFixed(1).replace('.', ',') + ' Δ  ( ' + p.aca.toFixed(1).replace('.', ',') +
      ' Δ/D × ' + demande.toFixed(1).replace('.', ',') + ' D )', { size: 11, bold: true, fill: c }));

    kids.push(S('rect', { x: 380, y: 62, width: 224, height: 96, rx: 8,
      fill: 'color-mix(in srgb, ' + c + ' 12%, transparent)', stroke: c, 'stroke-width': 1.2 }));
    kids.push(txt(492, 88, 'AC/A ' + p.aca.toFixed(1).replace('.', ',') + ' Δ/D',
      { anchor: 'middle', size: 15, bold: true, fill: c }));
    kids.push(txt(492, 108, normal ? 'dans la norme (3 à 5)' : p.aca > 5 ? 'élevé' : 'bas',
      { anchor: 'middle', size: 11.5, bold: true, fill: c }));
    kids.push(txt(492, 130, normal ? 'L’angle bouge peu entre loin et près.'
      : p.aca > 5 ? 'Excès de convergence : l’angle explose de près.'
      : 'La convergence fusionnelle doit tout payer.',
      { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(492, 146, normal ? '' : p.aca > 5 ? '→ addition de près' : '→ rééducation',
      { anchor: 'middle', size: 10.5, bold: true, fill: c }));

    kids.push(txt(320, 210, 'La comparaison loin/près est l’examen le plus rentable d’un strabisme convergent.',
      { anchor: 'middle', size: 10.5, bold: true }));
    return svg(640, 228, 'Le rapport AC/A : ce qui change entre loin et près', kids);
  }

  /* ============================================================
     27 · L'œil rouge : le tri qui compte
     ============================================================ */
  function oeilrouge() {
    var kids = [];
    kids.push(S('rect', { x: 200, y: 30, width: 240, height: 40, rx: 8,
      fill: 'color-mix(in srgb, var(--red) 16%, transparent)', stroke: 'var(--red)', 'stroke-width': 1.4 }));
    kids.push(txt(320, 47, 'Un œil rouge', { anchor: 'middle', size: 12.5, bold: true, fill: 'var(--red)' }));
    kids.push(txt(320, 62, 'Douleur vraie ? Baisse d’acuité ?', { anchor: 'middle', size: 10, fill: 'var(--txt-2)' }));

    kids.push(ligne(320, 70, 320, 88, { c: 'var(--line-hard)' }));
    kids.push(ligne(160, 88, 480, 88, { c: 'var(--line-hard)' }));
    kids.push(ligne(160, 88, 160, 104, { c: 'var(--line-hard)' }));
    kids.push(ligne(480, 88, 480, 104, { c: 'var(--line-hard)' }));

    function branche(x, verdict, c, sous, liste) {
      kids.push(S('rect', { x: x - 130, y: 104, width: 260, height: 40, rx: 8,
        fill: 'color-mix(in srgb, ' + c + ' 14%, transparent)', stroke: c, 'stroke-width': 1.3 }));
      kids.push(txt(x, 122, verdict, { anchor: 'middle', size: 12, bold: true, fill: c }));
      kids.push(txt(x, 136, sous, { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
      liste.forEach(function (l, i) {
        kids.push(txt(x, 168 + i * 17, l, { anchor: 'middle', size: 10.5, fill: 'var(--txt-2)' }));
      });
    }
    branche(160, 'Ni l’un ni l’autre', 'var(--green)', 'bénin, on peut attendre',
      ['Conjonctivite', 'Hémorragie sous-conjonctivale', 'Épisclérite']);
    branche(480, 'L’un des deux suffit', 'var(--red)', 'à voir aujourd’hui',
      ['Kératite', 'Uvéite antérieure', 'Glaucome aigu par fermeture']);

    kids.push(txt(320, 244, 'Une « conjonctivite » avec photophobie et baisse d’acuité est le tableau qu’on ne rate pas deux fois.',
      { anchor: 'middle', size: 10.5, bold: true }));
    return svg(640, 262, 'L’œil rouge : le tri fondamental', kids);
  }

  /* ============================================================
     28 · L'excavation papillaire dans le glaucome
     ============================================================ */
  function glaucome(p) {
    var kids = [];
    var cd = p.cd, cx = 220, cy = 128, R = 66;
    var verdict = cd <= 0.3 ? ['Papille normale', 'var(--green)']
                : cd <= 0.5 ? ['À surveiller', 'var(--blue)']
                : cd <= 0.7 ? ['Suspecte', 'var(--amber)']
                : ['Fortement suspecte', 'var(--red)'];

    kids.push(S('circle', { cx: cx, cy: cy, r: R,
      fill: 'color-mix(in srgb, var(--amber) 22%, transparent)', stroke: 'var(--line-hard)', 'stroke-width': 1.2 }));
    kids.push(S('circle', { cx: cx, cy: cy, r: R * cd, fill: 'var(--surface)', stroke: verdict[1], 'stroke-width': 2 }));
    kids.push(txt(cx, cy + 4, 'excavation', { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(ligne(cx - R, cy + R + 16, cx + R, cy + R + 16, { c: 'var(--txt-3)', dash: '3 3' }));
    kids.push(txt(cx, cy + R + 32, 'diamètre papillaire', { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));

    kids.push(txt(360, 66, 'C/D = ' + cd.toFixed(1).replace('.', ','), { size: 22, bold: true, fill: verdict[1] }));
    kids.push(txt(360, 92, verdict[0], { size: 13, bold: true, fill: verdict[1] }));
    kids.push(txt(360, 118, 'L’anneau neuro-rétinien s’amincit à mesure', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(360, 132, 'que l’excavation gagne : c’est lui qui porte', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(360, 146, 'les fibres, et lui qu’on perd.', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(360, 172, 'Une asymétrie de plus de 0,2 entre les', { size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(360, 185, 'deux yeux est suspecte à elle seule.', { size: 10, fill: 'var(--txt-3)' }));

    kids.push(txt(320, 226, 'La pression peut être normale : ce sont la papille et le champ visuel qui font le diagnostic.',
      { anchor: 'middle', size: 10.5, bold: true }));
    kids.push(txt(320, 242, 'Et le patient garde 10/10 très longtemps — d’où le dépistage.',
      { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    return svg(640, 258, 'L’excavation papillaire dans le glaucome', kids);
  }

  /* ============================================================
     29 · DMLA sèche et exsudative
     ============================================================ */
  function dmla() {
    var kids = [];
    function macula(cx, titre, sous, c, dessin) {
      kids.push(S('circle', { cx: cx, cy: 116, r: 52, fill: 'color-mix(in srgb, var(--amber) 14%, transparent)',
        stroke: 'var(--line-hard)' }));
      kids.push(txt(cx, 48, titre, { anchor: 'middle', size: 12, bold: true, fill: c }));
      kids.push(txt(cx, 62, sous, { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
      dessin(cx);
      kids.push(txt(cx, 188, '', { anchor: 'middle' }));
    }
    macula(150, 'Forme sèche', 'lente, sur des années', 'var(--blue)', function (cx) {
      [[-18, -12], [10, -16], [-6, 8], [18, 10], [0, -2], [-22, 6]].forEach(function (d) {
        kids.push(S('circle', { cx: cx + d[0], cy: 116 + d[1], r: 5, fill: 'color-mix(in srgb, var(--amber) 60%, transparent)',
          stroke: 'var(--amber)', 'stroke-width': 0.8 }));
      });
      kids.push(txt(cx, 186, 'Drusen, puis atrophie', { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--blue)' }));
    });
    macula(360, 'Forme exsudative', 'brutale, en quelques jours', 'var(--red)', function (cx) {
      kids.push(S('path', { d: 'M ' + (cx - 26) + ' 128 q 14 -26 28 -4 t 26 -10',
        fill: 'none', stroke: 'var(--red)', 'stroke-width': 2.4 }));
      kids.push(S('circle', { cx: cx, cy: 112, r: 18, fill: 'color-mix(in srgb, var(--red) 22%, transparent)' }));
      kids.push(txt(cx, 186, 'Néovaisseaux, fluide', { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--red)' }));
    });

    /* la grille d'Amsler déformée */
    var gx = 520, gy = 116, g = 52;
    kids.push(txt(gx, 48, 'Ce que voit le patient', { anchor: 'middle', size: 11, bold: true }));
    kids.push(txt(gx, 62, 'grille d’Amsler', { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    for (var i = 0; i <= 6; i++) {
      var p = gx - g + (i * g * 2 / 6);
      var q = gy - g + (i * g * 2 / 6);
      kids.push(S('path', { d: 'M ' + p + ' ' + (gy - g) + ' Q ' + (p + (i === 3 ? 16 : 4)) + ' ' + gy + ' ' + p + ' ' + (gy + g),
        fill: 'none', stroke: 'var(--line-hard)', 'stroke-width': 0.9 }));
      kids.push(S('path', { d: 'M ' + (gx - g) + ' ' + q + ' Q ' + gx + ' ' + (q + (i === 3 ? 16 : 4)) + ' ' + (gx + g) + ' ' + q,
        fill: 'none', stroke: 'var(--line-hard)', 'stroke-width': 0.9 }));
    }
    kids.push(txt(gx, 186, 'Les lignes ondulent', { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--amber)' }));

    kids.push(txt(320, 216, 'Métamorphopsies récentes + baisse rapide + scotome central = suspicion de forme exsudative.',
      { anchor: 'middle', size: 10.5, bold: true }));
    kids.push(txt(320, 234, 'Les anti-VEGF ont une fenêtre : c’est une urgence relative, et la grille à domicile en date le début.',
      { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    return svg(640, 252, 'DMLA sèche et DMLA exsudative', kids);
  }

  /* ============================================================
     30 · Le champ visuel automatisé et ses indices
     ============================================================ */
  function champ24() {
    var kids = [];
    var cx = 180, cy = 118, pas = 17;
    /* une grille de points, avec un déficit arciforme supérieur */
    for (var i = -3; i <= 3; i++) {
      for (var j = -3; j <= 3; j++) {
        var x = cx + j * pas, y = cy + i * pas;
        var arc = (i <= -1 && j >= -1 && Math.abs(i + 1) + Math.abs(j - 1) <= 2);
        var tache = (i === 0 && j === 2);
        kids.push(S('circle', { cx: x, cy: y, r: 5.5,
          fill: tache ? 'var(--txt)' : arc ? 'var(--txt-3)' : 'var(--surface-4)',
          stroke: 'var(--line)', 'stroke-width': 0.6 }));
      }
    }
    kids.push(txt(cx, 42, 'Périmétrie statique 24-2', { anchor: 'middle', size: 11.5, bold: true }));
    kids.push(txt(cx, 232, 'Chaque point rend un seuil en décibels', { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(ligne(cx + 42, cy, cx + 66, cy - 4, { c: 'var(--txt-3)', w: 0.9 }));
    kids.push(txt(cx + 70, cy - 4, 'tache aveugle', { size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(ligne(cx - 20, cy - 46, cx - 44, cy - 62, { c: 'var(--txt-3)', w: 0.9 }));
    kids.push(txt(cx - 48, cy - 64, 'déficit arciforme', { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));

    kids.push(txt(330, 60, 'Les deux indices qui comptent', { size: 11.5, bold: true }));
    [['MD', 'déficit moyen — combien on a perdu en tout', 'var(--accent)'],
     ['PSD', 'déficit localisé — la perte est-elle en tache ?', 'var(--blue)']
    ].forEach(function (o, i) {
      var y = 84 + i * 46;
      kids.push(txt(330, y, o[0], { size: 14, bold: true, fill: o[2] }));
      kids.push(txt(372, y, o[1], { size: 10, fill: 'var(--txt-2)' }));
    });
    kids.push(txt(330, 178, 'MD effondré + PSD basse → cause diffuse', { size: 10.5, bold: true }));
    kids.push(txt(330, 192, '(cataracte, myosis), pas un scotome.', { size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(330, 216, 'Et l’on regarde toujours la fiabilité d’abord :', { size: 10, fill: 'var(--txt-2)' }));
    kids.push(txt(330, 230, 'au-delà de 20 % de pertes de fixation, on refait.', { size: 10, bold: true, fill: 'var(--amber)' }));

    return svg(640, 250, 'Le champ visuel automatisé et ses indices', kids);
  }

  /* ============================================================
     31 · Les explorations, étage par étage
     ============================================================ */
  function explorations() {
    var kids = [];
    var etages = [
      ['EOG', 'Épithélium pigmentaire', 'la cave', 'var(--violet)'],
      ['ERG global', 'Rétine entière — onde a puis onde b', 'le rez-de-chaussée', 'var(--accent)'],
      ['ERG multifocal', 'Macula, point par point', 'une pièce précise', 'var(--blue)'],
      ['PEV', 'Voie optique jusqu’au cortex', 'l’ascenseur', 'var(--amber)']
    ];
    etages.forEach(function (e, i) {
      var y = 52 + i * 46;
      kids.push(S('rect', { x: 60, y: y, width: 120, height: 36, rx: 6,
        fill: 'color-mix(in srgb, ' + e[3] + ' 16%, transparent)', stroke: e[3], 'stroke-width': 1.2 }));
      kids.push(txt(120, y + 22, e[0], { anchor: 'middle', size: 12, bold: true, fill: e[3] }));
      kids.push(txt(196, y + 16, e[1], { size: 10.5, fill: 'var(--txt-2)' }));
      kids.push(txt(196, y + 29, e[2], { size: 9.5, italic: true, fill: 'var(--txt-3)' }));
    });
    kids.push(txt(60, 34, 'Chaque examen interroge un étage de l’immeuble', { size: 11.5, bold: true }));

    kids.push(S('rect', { x: 400, y: 96, width: 200, height: 96, rx: 8,
      fill: 'var(--surface-2)', stroke: 'var(--line-soft)' }));
    kids.push(txt(412, 118, 'Devant une baisse d’acuité', { size: 10.5, bold: true }));
    kids.push(txt(412, 132, 'avec un fond d’œil normal :', { size: 10.5, bold: true }));
    kids.push(txt(412, 152, 'ERG effondré → rétine', { size: 10, fill: 'var(--accent)' }));
    kids.push(txt(412, 168, 'ERG normal, PEV retardé', { size: 10, fill: 'var(--amber)' }));
    kids.push(txt(412, 181, '→ nerf optique', { size: 10, fill: 'var(--amber)' }));

    kids.push(txt(320, 246, 'Un PEV dit qu’il y a un retard ou une perte d’amplitude — il ne dit pas où.',
      { anchor: 'middle', size: 10.5, bold: true }));
    return svg(640, 264, 'Les explorations électrophysiologiques, étage par étage', kids);
  }

  /* ============================================================
     32 · Le punctum proximum de convergence
     ============================================================ */
  function ppc() {
    var kids = [];
    var x0 = 90, x1 = 560, y = 108;
    kids.push(ligne(x0, y, x1, y, { c: 'var(--line-hard)', w: 1.4 }));
    kids.push(txt(x0, y + 24, 'le nez', { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(x1, y + 24, 'loin', { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));

    /* trois essais : le PPC s'éloigne, le recouvrement plus encore */
    var essais = [
      { n: '1er essai', r: 0.14, rec: 0.24, c: 'var(--green)' },
      { n: '2e essai', r: 0.26, rec: 0.40, c: 'var(--amber)' },
      { n: '3e essai', r: 0.40, rec: 0.60, c: 'var(--red)' }
    ];
    essais.forEach(function (e, i) {
      var yy = 52 + i * 108 / 3 - 12;
      var xr = x0 + e.r * (x1 - x0), xc = x0 + e.rec * (x1 - x0);
      kids.push(txt(x0 - 12, yy + 4, e.n, { anchor: 'end', size: 10, bold: true, fill: e.c }));
      kids.push(ligne(x0, yy, xr, yy, { c: e.c, w: 2.4 }));
      kids.push(ligne(xr, yy, xc, yy, { c: e.c, dash: '4 3', w: 1.6 }));
      kids.push(S('circle', { cx: xr, cy: yy, r: 4.5, fill: e.c }));
      kids.push(S('circle', { cx: xc, cy: yy, r: 4.5, fill: 'none', stroke: e.c, 'stroke-width': 1.6 }));
    });
    kids.push(txt(x0, 30, 'On répète trois fois : c’est la dégradation qui signe la fatigabilité',
      { size: 11.5, bold: true }));

    kids.push(S('circle', { cx: 110, cy: 172, r: 4.5, fill: 'var(--txt-3)' }));
    kids.push(txt(122, 176, 'rupture — le patient voit double', { size: 10, fill: 'var(--txt-2)' }));
    kids.push(S('circle', { cx: 330, cy: 172, r: 4.5, fill: 'none', stroke: 'var(--txt-3)', 'stroke-width': 1.6 }));
    kids.push(txt(342, 176, 'recouvrement — il refusionne', { size: 10, fill: 'var(--txt-2)' }));

    kids.push(txt(320, 210, 'Un PPC à 8 cm qui ne récupère qu’à 20 cm ne raconte pas la même chose qu’un 8/10.',
      { anchor: 'middle', size: 10.5, bold: true }));
    return svg(640, 228, 'Le punctum proximum de convergence, mesuré trois fois', kids);
  }

  /* ============================================================
     33 · L'ordre du bilan orthoptique
     ============================================================ */
  function bilanordre() {
    var kids = [];
    var etapes = [
      ['Acuités', 'VL et VP, œil par œil'],
      ['Réfraction', 'avant tout jugement'],
      ['Sensoriel', 'Worth, Bagolini, stéréo'],
      ['Cover test', 'unilatéral puis alterné'],
      ['Prismes', 'l’angle, chiffré'],
      ['Vergences', 'PPC, amplitudes'],
      ['Synthèse', 'le diagnostic orthoptique']
    ];
    var x = 34;
    etapes.forEach(function (e, i) {
      var w = 76;
      var dernier = i === etapes.length - 1;
      kids.push(S('rect', { x: x, y: 72, width: w, height: 52, rx: 7,
        fill: dernier ? 'color-mix(in srgb, var(--accent) 20%, transparent)' : 'var(--surface-3)',
        stroke: dernier ? 'var(--accent)' : 'var(--line-hard)', 'stroke-width': dernier ? 1.6 : 1 }));
      kids.push(txt(x + w / 2, 94, e[0], { anchor: 'middle', size: 10, bold: true,
        fill: dernier ? 'var(--accent)' : 'var(--txt)' }));
      kids.push(txt(x + w / 2, 110, e[1], { anchor: 'middle', size: 8, fill: 'var(--txt-3)' }));
      if (!dernier) kids.push(ligne(x + w + 2, 98, x + w + 10, 98, { c: 'var(--txt-3)', arrow: true, w: 1.2 }));
      x += w + 12;
    });
    kids.push(txt(320, 40, 'L’ordre n’est pas une habitude : aucun test ne doit perturber le suivant',
      { anchor: 'middle', size: 12, bold: true }));
    kids.push(S('path', { d: 'M 250 138 q 0 22 -60 22 l -30 0', fill: 'none', stroke: 'var(--red)',
      'stroke-width': 1.4, 'stroke-dasharray': '4 3' }));
    kids.push(txt(258, 152, 'Le sensoriel passe avant la dissociation : le cover test alterné casse',
      { size: 10, bold: true, fill: 'var(--red)' }));
    kids.push(txt(258, 166, 'la fusion, et l’on ne mesurerait plus l’état spontané du patient.',
      { size: 10, fill: 'var(--txt-3)' }));
    return svg(640, 190, 'L’ordre du bilan orthoptique', kids);
  }

  /* ============================================================
     34 · L'ordre thérapeutique
     ============================================================ */
  function ordretherapeutique() {
    var kids = [];
    var marches = [
      ['Correction optique totale', 'portée en permanence, plusieurs semaines', 'var(--accent)'],
      ['Traitement de l’amblyopie', 'occlusion ou pénalisation', 'var(--blue)'],
      ['Alignement', 'prismes, toxine, chirurgie', 'var(--violet)'],
      ['Travail sensoriel', 'fusion, stéréoscopie', 'var(--green)']
    ];
    marches.forEach(function (m, i) {
      var x = 52 + i * 28, y = 200 - i * 42, w = 226, h = 36;
      kids.push(S('rect', { x: x, y: y, width: w, height: h, rx: 6,
        fill: 'color-mix(in srgb, ' + m[2] + ' 16%, transparent)', stroke: m[2], 'stroke-width': 1.3 }));
      kids.push(txt(x + 12, y + 16, (i + 1) + ' · ' + m[0], { size: 11, bold: true, fill: m[2] }));
      kids.push(txt(x + 12, y + 29, m[1], { size: 9, fill: 'var(--txt-3)' }));
    });
    kids.push(txt(52, 34, 'Chaque marche conditionne la suivante', { size: 12, bold: true }));
    kids.push(txt(400, 76, 'On ne rééduque pas ce qu’une', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(400, 90, 'correction aurait suffi à régler,', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(400, 104, 'et l’on n’aligne pas un œil', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(400, 118, 'qui ne voit pas.', { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(400, 146, 'Débuter la rééducation avant', { size: 10, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(400, 159, 'd’avoir vérifié le port effectif', { size: 10, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(400, 172, 'des lunettes, c’est mesurer', { size: 10, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(400, 185, 'l’absence de lunettes.', { size: 10, bold: true, fill: 'var(--amber)' }));
    return svg(640, 254, 'L’ordre thérapeutique en strabologie', kids);
  }

  /* ============================================================
     35 · La période sensible
     ============================================================ */
  function plasticite() {
    var kids = [];
    var x0 = 76, x1 = 560, y0 = 46, y1 = 178;
    function X(a) { return x0 + (a / 12) * (x1 - x0); }

    kids.push(ligne(x0, y0 - 6, x0, y1, { c: 'var(--line-hard)' }));
    kids.push(ligne(x0, y1, x1 + 8, y1, { c: 'var(--line-hard)' }));
    kids.push(txt(x0 - 10, y0 + 4, 'Plasticité', { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(x0 - 10, y0 + 16, 'maximale', { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(x0 - 10, y1 - 2, 'nulle', { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));
    [0, 2, 4, 6, 8, 10, 12].forEach(function (a) {
      kids.push(ligne(X(a), y1, X(a), y1 + 5, { c: 'var(--line-hard)' }));
      kids.push(txt(X(a), y1 + 17, a + (a === 12 ? ' ans' : ''), { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    });

    kids.push(S('path', {
      d: 'M ' + x0 + ' ' + (y0 + 4) + ' Q ' + X(2) + ' ' + (y0 + 20) + ' ' + X(4) + ' ' + (y0 + 74) +
         ' Q ' + X(7) + ' ' + (y1 - 22) + ' ' + X(11) + ' ' + (y1 - 4) + ' L ' + X(12) + ' ' + (y1 - 3),
      fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.8
    }));

    /* les fenêtres de traitement */
    kids.push(S('rect', { x: x0, y: y0, width: X(2) - x0, height: y1 - y0,
      fill: 'color-mix(in srgb, var(--green) 12%, transparent)' }));
    kids.push(txt(X(1), y0 + 40, 'Traiter ici', { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--green)' }));
    kids.push(txt(X(1), y0 + 53, 'récupère presque', { anchor: 'middle', size: 9, fill: 'var(--txt-3)' }));
    kids.push(txt(X(1), y0 + 64, 'toujours', { anchor: 'middle', size: 9, fill: 'var(--txt-3)' }));

    kids.push(S('rect', { x: X(8), y: y0, width: X(12) - X(8), height: y1 - y0,
      fill: 'color-mix(in srgb, var(--red) 10%, transparent)' }));
    kids.push(txt(X(10), y0 + 40, 'Ici, rarement', { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--red)' }));
    kids.push(txt(X(10), y0 + 53, 'complètement', { anchor: 'middle', size: 9, fill: 'var(--txt-3)' }));

    kids.push(txt(x0, 30, 'La période sensible n’est pas une porte qui claque : c’est une pente',
      { size: 11.5, bold: true }));
    kids.push(txt(320, 222, 'D’où le calendrier de dépistage : maternité, 4 mois, 9 mois, 24 mois, puis 3–4 ans.',
      { anchor: 'middle', size: 10.5, bold: true }));
    return svg(640, 240, 'La période sensible du développement visuel', kids);
  }

  /* ============================================================
     36 · Les trois mécanismes de l'amblyopie
     ============================================================ */
  function amblyopie3() {
    var kids = [];
    var cas = [
      { t: 'Strabique', s: 'l’image est déplacée', d: 'neutralisée en permanence', c: 'var(--accent)' },
      { t: 'Anisométropique', s: 'l’image est floue', d: 'la plus sournoise : rien ne se voit', c: 'var(--amber)' },
      { t: 'De privation', s: 'l’image est supprimée', d: 'cataracte, ptosis, opacité', c: 'var(--red)' }
    ];
    cas.forEach(function (c, i) {
      var cx = 130 + i * 190;
      kids.push(txt(cx, 44, c.t, { anchor: 'middle', size: 12, bold: true, fill: c.c }));
      kids.push(txt(cx, 58, c.s, { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
      /* l'œil sain et l'œil abîmé */
      kids.push(S('circle', { cx: cx - 34, cy: 108, r: 26, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
      kids.push(S('circle', { cx: cx - 34, cy: 108, r: 8, fill: 'var(--txt-2)' }));
      kids.push(txt(cx - 34, 148, 'net', { anchor: 'middle', size: 9, fill: 'var(--txt-3)' }));

      kids.push(S('circle', { cx: cx + 34, cy: 108, r: 26,
        fill: 'color-mix(in srgb, ' + c.c + ' 12%, transparent)', stroke: c.c }));
      if (i === 0) kids.push(S('circle', { cx: cx + 46, cy: 108, r: 8, fill: c.c }));
      else if (i === 1) kids.push(S('circle', { cx: cx + 34, cy: 108, r: 11, fill: c.c, opacity: 0.35 }));
      else kids.push(S('rect', { x: cx + 14, y: 96, width: 40, height: 24, rx: 4, fill: c.c, opacity: 0.55 }));
      kids.push(txt(cx + 34, 148, i === 0 ? 'dévié' : i === 1 ? 'flou' : 'obstrué',
        { anchor: 'middle', size: 9, bold: true, fill: c.c }));
      kids.push(txt(cx, 172, c.d, { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    });
    kids.push(txt(320, 26, 'Trois façons d’abîmer une image, trois amblyopies', { anchor: 'middle', size: 12, bold: true }));
    kids.push(txt(320, 208, 'Le mécanisme est cortical : les colonnes de dominance oculaire se partagent le territoire.',
      { anchor: 'middle', size: 10.5, bold: true }));
    kids.push(txt(320, 224, 'L’œil amblyope est normal — c’est ce qui définit l’amblyopie fonctionnelle.',
      { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    return svg(640, 242, 'Les trois mécanismes de l’amblyopie', kids);
  }

  /* ============================================================
     37 · Trois profils de basse vision
     ============================================================ */
  function profils() {
    var kids = [];
    var profils = [
      { t: 'Atteinte centrale', s: 'DMLA, Stargardt', p: 'lecture et visages perdus,', q: 'déplacement conservé', mode: 'c', c: 'var(--accent)' },
      { t: 'Atteinte périphérique', s: 'glaucome, rétinopathie pigmentaire', p: 'lit encore, se cogne,', q: 'vision nocturne effondrée', mode: 'p', c: 'var(--blue)' },
      { t: 'Flou global', s: 'cataracte, œdème', p: 'tout est délavé,', q: 'contraste effondré', mode: 'f', c: 'var(--violet)' }
    ];
    profils.forEach(function (p, i) {
      var cx = 130 + i * 190, cy = 110, r = 46;
      kids.push(txt(cx, 44, p.t, { anchor: 'middle', size: 11.5, bold: true, fill: p.c }));
      kids.push(txt(cx, 58, p.s, { anchor: 'middle', size: 9, fill: 'var(--txt-3)' }));
      kids.push(S('circle', { cx: cx, cy: cy, r: r, fill: 'var(--surface-3)', stroke: 'var(--line-hard)' }));
      if (p.mode === 'c') {
        kids.push(S('circle', { cx: cx, cy: cy, r: 18, fill: 'var(--txt-3)' }));
      } else if (p.mode === 'p') {
        kids.push(S('path', {
          d: 'M ' + (cx - r) + ' ' + cy + ' a ' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0 a ' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0 Z' +
             ' M ' + (cx - 16) + ' ' + cy + ' a 16 16 0 1 1 32 0 a 16 16 0 1 1 -32 0 Z',
          fill: 'var(--txt-3)', 'fill-rule': 'evenodd'
        }));
      } else {
        kids.push(S('circle', { cx: cx, cy: cy, r: r - 2, fill: 'var(--txt-3)', opacity: 0.4 }));
      }
      kids.push(txt(cx, 176, p.p, { anchor: 'middle', size: 9.5, fill: 'var(--txt-2)' }));
      kids.push(txt(cx, 189, p.q, { anchor: 'middle', size: 9.5, fill: 'var(--txt-2)' }));
    });
    kids.push(txt(320, 26, 'Au même 2/10, trois patients qui n’ont pas les mêmes besoins',
      { anchor: 'middle', size: 12, bold: true }));
    kids.push(txt(320, 220, 'Deux paramètres, pas un : l’acuité et le champ. C’est leur combinaison qui décrit le handicap.',
      { anchor: 'middle', size: 10.5, bold: true }));
    return svg(640, 238, 'Trois profils fonctionnels en basse vision', kids);
  }

  /* ============================================================
     38 · Sensibilité, spécificité, valeurs prédictives
     ============================================================ */
  function sesp() {
    var kids = [];
    var x = 150, y = 74, w = 130, h = 52;
    var cases = [
      ['Vrais positifs', 'var(--green)', 0, 0], ['Faux positifs', 'var(--amber)', 1, 0],
      ['Faux négatifs', 'var(--red)', 0, 1], ['Vrais négatifs', 'var(--green)', 1, 1]
    ];
    cases.forEach(function (c) {
      var cx = x + c[2] * w, cy = y + c[3] * h;
      kids.push(S('rect', { x: cx, y: cy, width: w, height: h,
        fill: 'color-mix(in srgb, ' + c[1] + ' 14%, transparent)', stroke: 'var(--line-hard)', 'stroke-width': 1 }));
      kids.push(txt(cx + w / 2, cy + h / 2 + 4, c[0], { anchor: 'middle', size: 10.5, bold: true, fill: c[1] }));
    });
    kids.push(txt(x + w / 2, y - 24, 'Malade', { anchor: 'middle', size: 10.5, bold: true }));
    kids.push(txt(x + w + w / 2, y - 24, 'Sain', { anchor: 'middle', size: 10.5, bold: true }));
    kids.push(txt(x - 12, y + h / 2 + 4, 'Test +', { anchor: 'end', size: 10.5, bold: true }));
    kids.push(txt(x - 12, y + h + h / 2 + 4, 'Test −', { anchor: 'end', size: 10.5, bold: true }));

    kids.push(txt(430, 62, 'Sensibilité', { size: 11.5, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(430, 76, 'des malades détectés', { size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(430, 90, 'SnNout : sensible + négatif = éliminé', { size: 10, fill: 'var(--txt-2)' }));
    kids.push(txt(430, 118, 'Spécificité', { size: 11.5, bold: true, fill: 'var(--blue)' }));
    kids.push(txt(430, 132, 'des sains bien classés', { size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(430, 146, 'SpPin : spécifique + positif = confirmé', { size: 10, fill: 'var(--txt-2)' }));

    kids.push(txt(320, 190, 'Sensibilité et spécificité ne dépendent pas de la prévalence — les valeurs prédictives, si.',
      { anchor: 'middle', size: 10.5, bold: true }));
    kids.push(txt(320, 208, 'C’est pourquoi un test excellent en consultation spécialisée déçoit en dépistage de masse :',
      { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(320, 222, 'la population a changé, pas le test.', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    return svg(640, 240, 'Sensibilité, spécificité et valeurs prédictives', kids);
  }

  /* ============================================================
     39 · Les trois paralysies oculomotrices
     ============================================================ */
  function paralysies() {
    var kids = [];
    var cas = [
      { n: 'VI', t: 'Abduction limitée', d: ['Ésotropie majorée de loin', 'Diplopie horizontale', 'Tête tournée du côté atteint'],
        c: 'var(--blue)', oeil: 'in' },
      { n: 'IV', t: 'Hypertropie en adduction', d: ['Diplopie verticale et torsionnelle', 'Bielschowsky positif', 'Tête penchée côté opposé'],
        c: 'var(--amber)', oeil: 'up' },
      { n: 'III', t: 'Ptosis, œil en dehors', d: ['Adduction et verticalité limitées', 'Pupille : la donnée qui décide', 'Urgence si mydriase'],
        c: 'var(--red)', oeil: 'out' }
    ];
    cas.forEach(function (c, i) {
      var cx = 122 + i * 198, cy = 92;
      kids.push(S('circle', { cx: cx, cy: cy, r: 30,
        fill: 'color-mix(in srgb, ' + c.c + ' 10%, transparent)', stroke: c.c, 'stroke-width': 1.5 }));
      var dx = c.oeil === 'in' ? -12 : c.oeil === 'out' ? 12 : 0;
      var dy = c.oeil === 'up' ? -11 : 0;
      kids.push(S('circle', { cx: cx + dx, cy: cy + dy, r: 9, fill: c.c }));
      if (c.oeil === 'out') {
        kids.push(S('path', { d: 'M ' + (cx - 32) + ' ' + (cy - 22) + ' q 32 -14 64 0',
          fill: 'none', stroke: c.c, 'stroke-width': 3 }));
      }
      kids.push(txt(cx, 48, 'Paralysie du ' + c.n, { anchor: 'middle', size: 12.5, bold: true, fill: c.c }));
      kids.push(txt(cx, 142, c.t, { anchor: 'middle', size: 10.5, bold: true }));
      c.d.forEach(function (l, k) {
        kids.push(txt(cx, 160 + k * 14, l, { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
      });
    });
    kids.push(txt(320, 26, 'Trois nerfs, trois tableaux qu’on ne confond pas', { anchor: 'middle', size: 12, bold: true }));
    kids.push(txt(320, 226, 'Une diplopie récente chez l’adulte est un symptôme neurologique jusqu’à preuve du contraire.',
      { anchor: 'middle', size: 10.5, bold: true }));
    return svg(640, 244, 'Les paralysies du VI, du IV et du III', kids);
  }

  /* ============================================================
     40 · Comment on lit : saccades, fixations, régressions
     ============================================================ */
  function lecture() {
    var kids = [];
    var mots = ['La', 'lecture', 'est', 'une', 'succession', 'de', 'saccades', 'et', 'de', 'fixations'];
    var x = 56, y = 118, pos = [];
    mots.forEach(function (m) {
      var w = m.length * 8.2 + 10;
      kids.push(S('text', { x: x, y: y, 'font-size': 15, fill: 'var(--txt-2)' }, m));
      pos.push(x + w / 2);
      x += w + 6;
    });

    /* les fixations : des points au-dessus, reliés par des saccades */
    var fix = [0, 1, 3, 4, 6, 7, 9];
    fix.forEach(function (k, i) {
      var px = pos[k];
      kids.push(S('circle', { cx: px, cy: y - 34, r: 7, fill: 'color-mix(in srgb, var(--accent) 30%, transparent)',
        stroke: 'var(--accent)', 'stroke-width': 1.2 }));
      kids.push(txt(px, y - 31, String(i + 1), { anchor: 'middle', size: 8, bold: true, fill: 'var(--accent)' }));
      if (i) kids.push(ligne(pos[fix[i - 1]] + 8, y - 34, px - 8, y - 34, { c: 'var(--accent)', w: 1.2, arrow: true }));
    });
    /* une régression */
    kids.push(S('path', { d: 'M ' + pos[6] + ' ' + (y + 16) + ' q -60 26 -118 2',
      fill: 'none', stroke: 'var(--amber)', 'stroke-width': 1.6, 'marker-end': 'url(#ueflx)' }));
    kids.push(txt(pos[3], y + 58, 'régression — 10 à 15 % chez le lecteur expert',
      { anchor: 'middle', size: 10, bold: true, fill: 'var(--amber)' }));

    kids.push(txt(56, 40, 'On croit lire en balayant : on lit en sautant', { size: 12, bold: true }));
    kids.push(txt(56, 56, 'Saccades de 7 à 9 caractères · fixations de 200 à 250 ms · l’information n’entre que pendant les arrêts',
      { size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(320, 216, 'Une lecture lente peut venir de saccades trop courtes ou de régressions trop nombreuses :',
      { anchor: 'middle', size: 10.5, bold: true }));
    kids.push(txt(320, 232, 'c’est ce qui distingue un décodage laborieux d’une oculomotricité en cause.',
      { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    return svg(640, 250, 'Comment on lit : saccades, fixations, régressions', kids);
  }

  /* ============================================================
     41 · Vergence et distance — le schéma vivant de la dioptrie
     ============================================================
     « V = 1/d » se récite sans rien voir. Ce qu'on ne voit pas, en
     particulier, c'est que la relation est hyperbolique : passer de
     2 m à 1 m coûte une demi-dioptrie, passer de 25 à 20 cm en coûte
     une entière. D'où l'axe logarithmique et le curseur : on tire la
     cible vers soi et on regarde le chiffre s'emballer.
     ============================================================ */
  function vergence(p) {
    var d = p.dist;                      // centimètres
    var V = -100 / d;                    // dioptries — cible réelle, faisceau divergent
    var yAxe = 172, xOeil = 566;
    var A = Math.log(10), B = Math.log(600);

    function xDe(cm) { return 500 - 380 * (Math.log(cm) - A) / (B - A); }

    var xO = xDe(d);
    var kids = [];

    /* l'œil, à droite, réduit à ce qui compte : une pupille */
    kids.push(S('circle', { cx: xOeil, cy: yAxe, r: 30,
      fill: 'var(--surface-3)', stroke: 'var(--line-hard)', 'stroke-width': 1.2 }));
    kids.push(S('ellipse', { cx: xOeil - 22, cy: yAxe, rx: 7, ry: 15,
      fill: 'color-mix(in srgb, var(--accent) 26%, transparent)',
      stroke: 'var(--accent)', 'stroke-width': 1 }));
    kids.push(txt(xOeil, yAxe + 50, 'Œil', { anchor: 'middle', size: 11, fill: 'var(--txt-2)' }));

    /* l'axe des distances, gradué */
    kids.push(ligne(96, yAxe, 528, yAxe, { c: 'var(--line)', dash: '3 4' }));
    [[500, '5 m'], [100, '1 m'], [50, '50 cm'], [25, '25 cm']].forEach(function (g) {
      var x = xDe(g[0]);
      kids.push(ligne(x, yAxe - 6, x, yAxe + 6, { c: 'var(--line-hard)', w: 1 }));
      kids.push(txt(x, yAxe + 25, g[1], { anchor: 'middle', size: 10.5, fill: 'var(--txt-3)' }));
      kids.push(txt(x, yAxe + 40, fmt(-100 / g[0]), { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    });

    /* le pinceau de rayons capté par la pupille */
    [-15, 0, 15].forEach(function (dy) {
      kids.push(ligne(xO, yAxe, xOeil - 24, yAxe + dy,
        { c: 'var(--accent)', w: dy === 0 ? 1.4 : 1, dash: dy === 0 ? null : '2 3' }));
    });

    kids.push(S('circle', { cx: xO, cy: yAxe, r: 7, fill: 'var(--amber)' }));
    kids.push(txt(xO, yAxe - 22, 'Cible', { anchor: 'middle', size: 11, bold: true, fill: 'var(--amber)' }));

    /* la lecture, en grand */
    kids.push(txt(40, 52, 'Vergence à l’entrée de l’œil', { size: 11, fill: 'var(--txt-3)' }));
    kids.push(txt(40, 92, fmt(V) + ' D', { size: 30, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(40, 118, 'V = 1 / d,  d en mètres', { size: 11, italic: true, fill: 'var(--txt-3)' }));

    kids.push(txt(360, 52, 'Accommodation demandée', { size: 11, fill: 'var(--txt-3)' }));
    kids.push(txt(360, 92, Math.abs(V).toFixed(2).replace('.', ',') + ' D',
      { size: 30, bold: true, fill: 'var(--violet)' }));
    kids.push(txt(360, 118, 'pour voir net sans correction', { size: 11, italic: true, fill: 'var(--txt-3)' }));

    return svg(640, 244, 'Vergence d’une cible selon sa distance', kids);
  }

  /* ============================================================
     42 · Loi de Prentice — le prisme caché dans tout verre
     ============================================================
     La formule Δ = P × c tient en six caractères ; ce qu'elle cache,
     c'est qu'un verre n'est neutre qu'en un seul point.

     Le sens de la base n'est pas un détail décoratif : c'est ce qui
     se trompe le plus souvent. Un verre CONVERGENT est un couple de
     prismes accolés par leur base au centre optique — regarder
     au-dessous, c'est donc regarder à travers une base EN HAUT. Un
     verre divergent, accolé par ses arêtes, donne l'inverse.
     ============================================================ */
  function prentice(p) {
    var P = p.p, dec = p.dec;                 // dioptries, millimètres
    var delta = Math.abs(P) * (dec / 10);     // Δ = P (D) × décentrement (cm)
    var yC = 158, xL = 300;
    var kids = [];
    var conv = P > 0;
    /* base vers le centre optique si convergent, à l'opposé si divergent ;
       on regarde toujours SOUS le centre dans ce schéma */
    var baseEnHaut = conv;

    var e = Math.min(26, 6 + Math.abs(P) * 2.4);
    kids.push(S('path', {
      d: conv
        ? 'M ' + xL + ' ' + (yC - 82) + ' q ' + e + ' 82 0 164 q ' + (-2 * e) + ' -82 0 -164 z'
        : 'M ' + (xL - 13) + ' ' + (yC - 82) + ' h 26 q ' + (-e) + ' 82 0 164 h -26 q ' + e + ' -82 0 -164 z',
      fill: 'color-mix(in srgb, var(--blue) 16%, transparent)',
      stroke: 'var(--blue)', 'stroke-width': 1.3
    }));

    /* le centre optique : le seul point sans effet prismatique */
    kids.push(ligne(150, yC, 470, yC, { c: 'var(--line)', dash: '3 4' }));
    kids.push(S('circle', { cx: xL, cy: yC, r: 4.5, fill: 'var(--green)' }));
    kids.push(txt(xL, 52, 'Centre optique', { anchor: 'middle', size: 11, bold: true, fill: 'var(--green)' }));
    kids.push(txt(xL, 66, 'aucun effet prismatique', { anchor: 'middle', size: 10, italic: true, fill: 'var(--txt-3)' }));
    kids.push(ligne(xL, 74, xL, yC - 86, { c: 'var(--green)', w: 0.8, dash: '2 3' }));

    /* le point regardé, sous le centre — c'est la position de lecture */
    var yR = yC + dec * 6;
    kids.push(ligne(150, yR, xL, yR, { c: 'var(--amber)', w: 1.6 }));
    kids.push(S('circle', { cx: xL, cy: yR, r: 4.5, fill: 'var(--amber)' }));

    /* le rayon dévié : la lumière tourne TOUJOURS vers la base */
    var pente = (baseEnHaut ? -1 : 1) * delta * 3.2;
    kids.push(ligne(xL, yR, 470, yR + pente, { c: 'var(--amber)', w: 1.8, arrow: true }));
    kids.push(ligne(xL, yR, 470, yR, { c: 'var(--line-hard)', w: 0.9, dash: '2 3' }));

    if (dec > 0.2) {
      kids.push(ligne(196, yC, 196, yR, { c: 'var(--txt-3)', w: 1 }));
      kids.push(txt(188, (yC + yR) / 2 + 4, dec.toFixed(1).replace('.', ',') + ' mm',
        { anchor: 'end', size: 10.5, fill: 'var(--txt-3)' }));
    }

    kids.push(txt(40, 52, 'Effet prismatique induit', { size: 11, fill: 'var(--txt-3)' }));
    kids.push(txt(40, 90, delta.toFixed(2).replace('.', ',') + ' Δ',
      { size: 28, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(40, 114, 'Δ = P × décentrement (cm)', { size: 11, italic: true, fill: 'var(--txt-3)' }));

    if (delta > 0.05) {
      /* les deux lignes s'empilent du même côté du rayon : à zéro, la seconde
         se posait exactement sur la flèche */
      kids.push(txt(484, yR + pente + (pente < 0 ? -32 : 24),
        'base ' + (baseEnHaut ? 'en haut' : 'en bas'),
        { anchor: 'middle', size: 11, bold: true, fill: 'var(--amber)' }));
      kids.push(txt(484, yR + pente + (pente < 0 ? -18 : 38),
        'la lumière tourne vers la base',
        { anchor: 'middle', size: 9.5, italic: true, fill: 'var(--txt-3)' }));
    }

    return svg(640, 296, 'Effet prismatique induit par un décentrement', kids);
  }

  /* ============================================================
     43 · Comitance et incomitance — les neuf positions
     ============================================================
     C'est le seul signe qui décide de la suite : comitant, on reste
     orthoptiste ; incomitant, on demande un avis. Le dire ne suffit
     pas — il faut avoir vu l'angle rester fixe dans une grille, puis
     se déformer dans l'autre.
     ============================================================ */
  function comitance(p) {
    var base = p.angle, inc = p.inc / 100;
    var kids = [];
    var cols = [-1, 0, 1], lignes = [-1, 0, 1];
    var x0 = 106, y0 = 96, pas = 76;

    kids.push(txt(x0, 44, 'Les neuf positions du regard',
      { anchor: 'middle', size: 12.5, bold: true, fill: 'var(--txt-2)' }));
    kids.push(txt(x0, 62, 'angle mesuré, en Δ',
      { anchor: 'middle', size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    var mini = 999, maxi = -999;
    lignes.forEach(function (ly) {
      cols.forEach(function (cx) {
        /* l'incomitance grandit vers la droite : c'est le profil d'une
           parésie du droit latéral droit, la plus fréquente à connaître */
        var a = base + inc * base * 1.1 * (cx + 1) - inc * base * 0.25 * ly;
        a = Math.max(0, Math.round(a));
        mini = Math.min(mini, a); maxi = Math.max(maxi, a);
        var x = x0 + cx * pas, y = y0 + (ly + 1) * pas;
        var fort = inc > 0.05 && cx === 1;
        kids.push(S('rect', {
          x: x - 31, y: y - 25, width: 62, height: 50, rx: 6,
          fill: fort ? 'color-mix(in srgb, var(--red) 14%, transparent)' : 'var(--surface-3)',
          stroke: fort ? 'var(--red)' : 'var(--line)', 'stroke-width': fort ? 1.3 : 0.8
        }));
        kids.push(txt(x, y + 6, String(a), {
          anchor: 'middle', size: 15, bold: true,
          fill: fort ? 'var(--red)' : 'var(--txt)'
        }));
      });
    });

    kids.push(txt(x0 - pas, y0 + 2 * pas + 46, 'gauche', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(x0 + pas, y0 + 2 * pas + 46, 'droite', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));

    var comitant = (maxi - mini) <= 5;
    var X = 330;
    kids.push(S('rect', {
      x: X, y: 88, width: 262, height: 78, rx: 8,
      fill: comitant ? 'color-mix(in srgb, var(--green) 12%, transparent)'
                     : 'color-mix(in srgb, var(--red) 12%, transparent)',
      stroke: comitant ? 'var(--green)' : 'var(--red)', 'stroke-width': 1.2
    }));
    kids.push(txt(X + 18, 118, comitant ? 'Déviation comitante' : 'Déviation incomitante',
      { size: 14, bold: true, fill: comitant ? 'var(--green)' : 'var(--red)' }));
    kids.push(txt(X + 18, 142, 'écart max − min : ' + (maxi - mini) + ' Δ',
      { size: 11.5, fill: 'var(--txt-2)' }));

    var dit = comitant
      ? [['Même angle partout', 'var(--txt-2)'],
         ['Quel que soit l’œil fixateur', 'var(--txt-2)'],
         ['Origine innervationnelle, ancienne', 'var(--txt-2)'],
         ['Typiquement : strabisme de l’enfance', 'var(--green)']]
      : [['L’angle varie avec la direction', 'var(--txt-2)'],
         ['Paralysie, restriction, syndrome', 'var(--txt-2)'],
         ['Impose Lancaster et 9 positions', 'var(--txt-2)'],
         ['Souvent : avis neurologique', 'var(--red)']];
    dit.forEach(function (l, i) {
      kids.push(txt(X + 18, 198 + i * 26, '·  ' + l[0], { size: 11.5, fill: l[1] }));
    });

    return svg(640, 330, 'Comitance et incomitance dans les neuf positions', kids);
  }

  /* ============================================================
     44 · Les trois degrés de Worth
     ============================================================
     Le cours dit « on ne travaille jamais le III avant le II ».
     Un escalier le dit mieux qu'une phrase : on voit qu'il n'y a
     pas de rampe pour sauter une marche.
     ============================================================ */
  function worth() {
    var kids = [];
    var marches = [
      { n: 'I', t: 'Perception simultanée', c: 'var(--blue)',
        d: 'Les deux images sont perçues ensemble, même non fusionnées',
        te: 'Synoptophore · Worth' },
      { n: 'II', t: 'Fusion', c: 'var(--accent)',
        d: 'Sensorielle : une seule image — motrice : les amplitudes de vergence',
        te: 'Worth · Bagolini · amplitudes de fusion' },
      { n: 'III', t: 'Stéréoscopie', c: 'var(--violet)',
        d: 'Le relief, tiré de la disparité rétinienne',
        te: 'TNO · Titmus · Lang' }
    ];
    var sol = 262, larg = 150;

    kids.push(txt(96, 40, 'On monte les marches dans l’ordre',
      { size: 13, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(96, 58, 'Sans le I, pas de II ; sans le II, pas de III — et aucune rampe pour sauter.',
      { size: 11.5, italic: true, fill: 'var(--txt-3)' }));

    marches.forEach(function (m, i) {
      var h = 66 + i * 50, x = 96 + i * (larg + 10), y = sol - h;
      kids.push(S('rect', {
        x: x, y: y, width: larg, height: h, rx: 7,
        fill: 'color-mix(in srgb, ' + m.c + ' 13%, transparent)',
        stroke: m.c, 'stroke-width': 1.3
      }));
      kids.push(txt(x + larg / 2, y + 30, 'Degré ' + m.n,
        { anchor: 'middle', size: 17, bold: true, fill: m.c }));
      kids.push(txt(x + larg / 2, y + 50, m.t,
        { anchor: 'middle', size: 12, bold: true, fill: 'var(--txt)' }));
    });
    kids.push(ligne(88, sol, 574, sol, { c: 'var(--line-hard)', w: 1.2 }));

    /* le détail sous le sol : dans une marche de 150 de large, une phrase
       ne tient pas — et une phrase coupée n'apprend rien */
    marches.forEach(function (m, i) {
      var y = 296 + i * 36;
      kids.push(txt(96, y, m.n, { size: 12, bold: true, fill: m.c }));
      kids.push(txt(126, y, m.d, { size: 11.5, fill: 'var(--txt-2)' }));
      kids.push(txt(126, y + 15, m.te, { size: 10.5, italic: true, fill: 'var(--txt-3)' }));
    });

    return svg(640, 420, 'Les trois degrés de la vision binoculaire de Worth', kids);
  }

  /* ============================================================
     45 · Les types de mouvements oculaires
     ============================================================
     Trois chiffres à ne pas confondre, séparés par un facteur
     trente. Les barres le disent d'un coup d'œil, là où « 200 à
     700 °/s » et « environ 20 °/s » se rangent dans la même case
     de mémoire.
     ============================================================ */
  function mouvements() {
    var kids = [];
    var types = [
      { n: 'Saccades', v: 700, vmin: 200, c: 'var(--accent)',
        d: 'Colliculus supérieur, aire frontale' },
      { n: 'Réflexe vestibulo-oculaire', v: 300, vmin: 100, c: 'var(--blue)',
        d: 'Latence ≈ 10 ms : le plus rapide' },
      { n: 'Poursuite', v: 50, vmin: 30, c: 'var(--violet)',
        d: 'Sans cible mobile, elle se décompose' },
      { n: 'Nystagmus optocinétique', v: 40, vmin: 20, c: 'var(--amber)',
        d: 'Poursuite et retour rapide, alternés' },
      { n: 'Vergences', v: 20, vmin: 15, c: 'var(--red)',
        d: 'Les deux yeux en sens opposés' }
    ];
    var x0 = 252, larg = 320, y = 96;
    function xDe(v) { return x0 + larg * Math.log(v / 10) / Math.log(80); }

    [10, 30, 100, 300, 700].forEach(function (v) {
      var x = xDe(v);
      kids.push(ligne(x, 74, x, 74 + types.length * 46 + 6, { c: 'var(--line-soft)', w: 0.8 }));
      kids.push(txt(x, 66, String(v), { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    });
    kids.push(txt(x0 + larg / 2, 44, 'Vitesse maximale, en degrés par seconde',
      { anchor: 'middle', size: 11, fill: 'var(--txt-3)' }));

    types.forEach(function (t, i) {
      var yy = y + i * 46;
      kids.push(txt(234, yy + 2, t.n, { anchor: 'end', size: 12, bold: true, fill: t.c }));
      kids.push(txt(234, yy + 17, t.d, { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));
      var xa = xDe(t.vmin), xb = xDe(t.v);
      kids.push(S('rect', {
        x: xa, y: yy - 9, width: Math.max(4, xb - xa), height: 18, rx: 4,
        fill: 'color-mix(in srgb, ' + t.c + ' 30%, transparent)',
        stroke: t.c, 'stroke-width': 1.1
      }));
      kids.push(txt(xb + 10, yy + 5, t.vmin + '–' + t.v, { size: 10.5, fill: t.c }));
    });

    var yb = y + types.length * 46 + 22;
    kids.push(ligne(60, yb, 580, yb, { c: 'var(--line-soft)' }));
    [['Ductions', 'un œil'], ['Versions', 'les deux, même sens'], ['Vergences', 'les deux, sens opposés']]
      .forEach(function (t, i) {
        var x = 96 + i * 180;
        kids.push(txt(x, yb + 26, t[0], { size: 12, bold: true, fill: 'var(--txt)' }));
        kids.push(txt(x, yb + 42, t[1], { size: 10.5, fill: 'var(--txt-3)' }));
      });

    return svg(640, yb + 62, 'Types de mouvements oculaires et leurs vitesses', kids);
  }

  /* ============================================================
     46 · Les deux obliques
     ============================================================
     Orbite droite vue de dessus : cornée à droite, apex à gauche,
     nasal en haut, temporal en bas.

     C'est le seul schéma d'anatomie oculomotrice qu'aucune phrase
     ne remplace — la poulie, la réflexion du tendon et l'angle de
     51° ne se racontent pas. Les noms de muscles vivent dans une
     légende et non sur le dessin : posés le long de leur trajet,
     ils se font traverser par leur propre trait.
     ============================================================ */
  function obliques() {
    var kids = [];
    var cx = 430, cy = 176, r = 62;

    /* les repères du plan de coupe, avant tout le reste */
    kids.push(txt(58, 42, 'Orbite droite, vue de dessus', { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 60, 'cornée à droite · apex à gauche', { size: 10.5, italic: true, fill: 'var(--txt-3)' }));
    /* la rose des orientations, posée dans le vide en bas à gauche : quatre
       mots au bord du dessin se lisent mal, et l'un d'eux tombait juste à
       côté d'une étiquette de muscle */
    var rx = 148, ry = 246;
    kids.push(ligne(rx, ry - 26, rx, ry + 26, { c: 'var(--line-hard)', w: 0.9 }));
    kids.push(ligne(rx - 40, ry, rx + 40, ry, { c: 'var(--line-hard)', w: 0.9 }));
    kids.push(txt(rx, ry - 32, 'nasal', { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(rx, ry + 42, 'temporal', { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(rx - 46, ry + 4, 'arrière', { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(txt(rx + 46, ry + 4, 'avant', { size: 9.5, fill: 'var(--txt-3)' }));

    kids.push(S('circle', { cx: cx, cy: cy, r: r,
      fill: 'var(--surface-3)', stroke: 'var(--line-hard)', 'stroke-width': 1.6 }));
    /* la cornée, pour que le cercle se lise comme un œil et non comme un rond */
    kids.push(S('path', {
      d: 'M ' + (cx + 52) + ' ' + (cy - 34) + ' A 62 62 0 0 1 ' + (cx + 52) + ' ' + (cy + 34),
      fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.6
    }));
    kids.push(ligne(cx, cy, 606, cy, { c: 'var(--line)', dash: '4 4' }));
    kids.push(txt(602, cy - 10, 'Axe visuel', { anchor: 'end', size: 10.5, fill: 'var(--txt-3)' }));

    /* l'apex : origine de l'oblique supérieur, comme des quatre droits */
    kids.push(S('circle', { cx: 92, cy: cy, r: 6, fill: 'var(--txt-3)' }));
    kids.push(txt(92, cy + 24, 'Apex', { anchor: 'middle', size: 10.5, fill: 'var(--txt-3)' }));

    /* la trochlée, poulie antéro-nasale : étiquette au-dessus, jamais dessous */
    var tx = 300, ty = 102;
    kids.push(txt(tx, 74, 'Trochlée', { anchor: 'middle', size: 11, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(tx, 88, 'poulie antéro-nasale', { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    kids.push(S('circle', { cx: tx, cy: ty, r: 9,
      fill: 'color-mix(in srgb, var(--amber) 30%, transparent)',
      stroke: 'var(--amber)', 'stroke-width': 1.5 }));

    /* oblique supérieur : apex → trochlée, puis réflexion à 51° par-dessus
       le globe jusqu'au quadrant postéro-temporal */
    kids.push(ligne(98, cy - 4, tx - 8, ty + 5, { c: 'var(--violet)', w: 2.4 }));
    kids.push(ligne(tx + 8, ty + 2, 421, 241, { c: 'var(--violet)', w: 2.4, arrow: true }));
    kids.push(S('circle', { cx: 421, cy: 241, r: 4.5, fill: 'var(--violet)' }));

    /* l'angle de 51° du tendon réfléchi avec l'axe visuel */
    kids.push(ligne(tx + 8, ty + 2, 470, ty + 2, { c: 'var(--line-soft)', w: 0.9, dash: '3 3' }));
    kids.push(S('path', {
      d: 'M ' + (tx + 52) + ' ' + (ty + 2) + ' A 44 44 0 0 1 ' + (tx + 36) + ' ' + (ty + 36),
      fill: 'none', stroke: 'var(--violet)', 'stroke-width': 1, 'stroke-dasharray': '2 2'
    }));
    kids.push(txt(tx + 58, ty + 30, '51°', { size: 11.5, bold: true, fill: 'var(--violet)' }));

    /* oblique inférieur : la seule origine antérieure, passe sous le globe */
    var ix = 372, iy = 96;
    kids.push(S('circle', { cx: ix, cy: iy, r: 6, fill: 'var(--accent)' }));
    kids.push(ligne(ix + 4, iy + 6, 452, 234, { c: 'var(--accent)', w: 2.4, dash: '6 4', arrow: true }));
    kids.push(S('circle', { cx: 452, cy: 234, r: 4.5, fill: 'var(--accent)' }));
    kids.push(txt(ix + 16, iy - 6, 'Angle inféro-nasal', { size: 10.5, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(ix + 16, iy + 8, 'la seule origine antérieure', { size: 9.5, fill: 'var(--txt-3)' }));

    /* l'insertion commune, en arrière et en dehors */
    kids.push(txt(482, 262, 'Insertions postérieures', { size: 10.5, bold: true, fill: 'var(--txt-2)' }));
    kids.push(txt(482, 276, 'quadrant temporal, près de la macula', { size: 9.5, fill: 'var(--txt-3)' }));

    /* la légende : les noms ne se posent pas sur les traits */
    [['var(--violet)', 'Oblique supérieur — IV, tendon réfléchi par la trochlée', 'trait plein'],
     ['var(--accent)', 'Oblique inférieur — III, passe sous le globe', 'trait tireté']]
      .forEach(function (l, i) {
        var y = 336 + i * 24;
        kids.push(S('rect', { x: 58, y: y - 9, width: 22, height: 4, rx: 2, fill: l[0] }));
        kids.push(txt(90, y - 3, l[1], { size: 11, bold: true, fill: l[0] }));
        kids.push(txt(430, y - 3, l[2], { size: 9.5, italic: true, fill: 'var(--txt-3)' }));
      });

    return svg(640, 380, 'Trajet des muscles obliques, orbite droite vue de dessus', kids);
  }

  /* ============================================================
     47 · Syndromes alphabétiques
     ============================================================
     Le nom dit le dessin, et c'est le seul cas où la lettre EST le
     schéma : les deux axes visuels tracent eux-mêmes le A ou le V.
     Encore faut-il l'avoir vu une fois, sinon les deux s'échangent
     le jour de l'épreuve.
     ============================================================ */
  function alphabetiques() {
    var kids = [];
    var yH = 112, yB = 278;
    var cas = [
      { l: 'A', c: 'var(--blue)', gh: 12, gb: 52, eh: 34, eb: 8,
        d: 'L’ésotropie augmente vers le haut' },
      { l: 'V', c: 'var(--amber)', gh: 52, gb: 12, eh: 8, eb: 34,
        d: 'L’ésotropie augmente vers le bas' }
    ];

    cas.forEach(function (k, i) {
      var g = 168 + i * 304;

      kids.push(txt(g, 52, 'Syndrome ' + k.l, { anchor: 'middle', size: 18, bold: true, fill: k.c }));
      kids.push(txt(g, 72, k.d, { anchor: 'middle', size: 10.5, italic: true, fill: 'var(--txt-3)' }));

      /* les deux axes visuels : leur écart trace la lettre */
      kids.push(ligne(g - k.gh, yH, g - k.gb, yB, { c: k.c, w: 2.6 }));
      kids.push(ligne(g + k.gh, yH, g + k.gb, yB, { c: k.c, w: 2.6 }));
      /* la barre, qui achève le A et qu'un V n'a pas */
      if (k.l === 'A') {
        kids.push(ligne(g - 34, 226, g + 34, 226, { c: k.c, w: 2.2 }));
      }

      /* les deux positions de regard, annotées à distance des traits */
      kids.push(txt(g, yH - 20, 'Regard en haut', { anchor: 'middle', size: 10.5, fill: 'var(--txt-3)' }));
      kids.push(txt(g, yB + 26, 'Regard en bas', { anchor: 'middle', size: 10.5, fill: 'var(--txt-3)' }));
      kids.push(txt(g + 78, yH + 6, k.eh + ' Δ', { size: 13, bold: true, fill: k.c }));
      kids.push(txt(g + 78, yB + 4, k.eb + ' Δ', { size: 13, bold: true, fill: k.c }));
      kids.push(txt(g - 78, yH + 6, k.eh > k.eb ? 'plus ésotrope' : 'moins ésotrope',
        { anchor: 'end', size: 10, fill: 'var(--txt-3)' }));
      kids.push(txt(g - 78, yB + 4, k.eb > k.eh ? 'plus ésotrope' : 'moins ésotrope',
        { anchor: 'end', size: 10, fill: 'var(--txt-3)' }));
    });

    kids.push(ligne(320, 44, 320, 300, { c: 'var(--line-soft)' }));
    kids.push(txt(320, 336, 'Les deux axes visuels dessinent la lettre — souvent par anomalie des obliques',
      { anchor: 'middle', size: 11, italic: true, fill: 'var(--txt-3)' }));

    return svg(640, 360, 'Syndromes alphabétiques A et V', kids);
  }

  /* ============================================================
     48 · Vision des couleurs — la règle de Köllner
     ============================================================
     Deux axes de confusion, deux étages de la voie visuelle. Les
     couleurs sont posées aux quatre points cardinaux pour que
     chaque axe passe exactement par les deux teintes qu'il
     confond : autrement, le schéma dit le contraire du texte.
     ============================================================ */
  function couleurs() {
    var kids = [];
    var cx = 162, cy = 176, r = 78, d = 58;

    kids.push(S('circle', { cx: cx, cy: cy, r: r,
      fill: 'var(--surface-3)', stroke: 'var(--line)', 'stroke-width': 1 }));

    /* les axes, chacun par ses deux teintes */
    /* les axes s'arrêtent au bord du cercle : prolongés jusqu'aux libellés,
       ils leur passaient au travers */
    kids.push(ligne(cx - r - 6, cy, cx + r + 6, cy, { c: 'var(--txt)', w: 2.4 }));
    kids.push(ligne(cx, cy - r - 6, cx, cy + r + 6, { c: 'var(--blue)', w: 2.4, dash: '6 4' }));

    [['#4f9fe0', 'Bleu', cx, cy - d, 'middle', 0, -36],
     ['#d8d152', 'Jaune', cx, cy + d, 'middle', 0, 44],
     ['#e05252', 'Rouge', cx + d, cy, 'start', 32, 4],
     ['#5fbf6a', 'Vert', cx - d, cy, 'end', -32, 4]].forEach(function (p) {
      kids.push(S('circle', { cx: p[2], cy: p[3], r: 17, fill: p[0], opacity: 0.85 }));
      kids.push(txt(p[2] + p[5], p[3] + p[6], p[1], { anchor: p[4], size: 11.5, bold: true, fill: 'var(--txt)' }));
    });

    /* la légende des deux axes, sous le cercle : jamais posée sur un trait */
    kids.push(S('rect', { x: 58, y: 292, width: 26, height: 3, rx: 1.5, fill: 'var(--txt)' }));
    kids.push(txt(94, 297, 'axe rouge-vert', { size: 11, bold: true, fill: 'var(--txt)' }));
    kids.push(S('rect', { x: 58, y: 316, width: 26, height: 3, rx: 1.5, fill: 'var(--blue)' }));
    kids.push(txt(94, 321, 'axe bleu-jaune', { size: 11, bold: true, fill: 'var(--blue)' }));

    /* la règle */
    var X = 300;
    kids.push(txt(X, 54, 'Règle de Köllner', { size: 14, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(X, 72, 'L’axe atteint dit l’étage atteint', { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [{ t: 'Rétine externe', s: 'photorécepteurs, macula', a: 'bleu-jaune', c: 'var(--blue)',
       ex: 'DMLA, rétinopathie diabétique, toxique' },
     { t: 'Nerf optique', s: 'et voies optiques', a: 'rouge-vert', c: 'var(--red)',
       ex: 'NOIA, névrite, glaucome évolué' }
    ].forEach(function (b, i) {
      var y = 96 + i * 98;
      kids.push(S('rect', { x: X, y: y, width: 284, height: 72, rx: 7,
        fill: 'color-mix(in srgb, ' + b.c + ' 10%, transparent)',
        stroke: b.c, 'stroke-width': 1.1 }));
      kids.push(txt(X + 16, y + 24, b.t, { size: 12.5, bold: true, fill: b.c }));
      kids.push(txt(X + 16, y + 39, b.s, { size: 10, fill: 'var(--txt-3)' }));
      kids.push(txt(X + 16, y + 59, '→ dyschromatopsie ' + b.a, { size: 11, bold: true, fill: 'var(--txt)' }));
      kids.push(txt(X + 16, y + 86, b.ex, { size: 10, italic: true, fill: 'var(--txt-3)' }));
    });

    kids.push(txt(58, 356, 'Ishihara ne dépiste que le rouge-vert : il laisse passer le bleu-jaune.',
      { size: 11.5, bold: true, fill: 'var(--amber)' }));

    return svg(640, 380, 'Axes de confusion colorée et règle de Köllner', kids);
  }

  /* ============================================================
     49 · Torticolis — le traitement que le patient s'est donné
     ============================================================
     Trois postures, trois causes. Une rotation ne se dessine pas
     comme une inclinaison : la première décale le regard sans
     pencher la tête, la seconde penche la tête sans bouger le
     regard. Les confondre au dessin, c'est les confondre tout court.
     ============================================================ */
  function torticolis() {
    var kids = [];
    var cas = [
      { t: 'Tête tournée', a: 'rotation', d: 'Paralysie d’un droit horizontal',
        e: 'La tête tourne du côté du muscle déficient', c: 'var(--accent)' },
      { t: 'Tête inclinée', a: 'inclinaison', d: 'Paralysie du IV',
        e: 'Inclinaison du côté opposé à l’œil atteint', c: 'var(--violet)' },
      { t: 'Menton relevé ou abaissé', a: 'menton', d: 'Syndrome alphabétique, ou nystagmus',
        e: 'Cherche la zone neutre, ou la position de moindre déviation', c: 'var(--amber)' }
    ];

    kids.push(txt(58, 44, 'Un torticolis se lit comme un traitement que le patient s’est donné',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Il place les yeux là où la déviation est la plus faible, ou l’acuité la meilleure.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    cas.forEach(function (k, i) {
      var x = 132 + i * 190, y = 152;
      /* seule l'inclinaison fait pivoter la tête ; la rotation déplace le
         regard dans une tête droite, et le menton la fait basculer */
      var rot = k.a === 'inclinaison' ? 20 : 0;
      var dx = k.a === 'rotation' ? 11 : 0;
      var dy = k.a === 'menton' ? -7 : 0;

      kids.push(S('g', { transform: 'rotate(' + rot + ' ' + x + ' ' + y + ')' }, [
        S('ellipse', { cx: x, cy: y, rx: 34, ry: 42,
          fill: 'var(--surface-3)', stroke: k.c, 'stroke-width': 1.4 }),
        S('circle', { cx: x - 13 + dx, cy: y - 8 + dy, r: 5, fill: k.c }),
        S('circle', { cx: x + 13 + dx, cy: y - 8 + dy, r: 5, fill: k.c }),
        S('path', { d: 'M ' + (x - 12 + dx) + ' ' + (y + 20 + dy) + ' q 12 8 24 0',
          fill: 'none', stroke: 'var(--txt-3)', 'stroke-width': 1.4 }),
        S('circle', { cx: x - 34, cy: y + 4, r: 3, fill: 'var(--txt-3)' }),
        S('circle', { cx: x + 34, cy: y + 4, r: 3, fill: 'var(--txt-3)' })
      ]));

      /* la flèche du geste, toujours au-dessus de la tête, jamais dessus */
      if (k.a === 'rotation') {
        kids.push(S('path', { d: 'M ' + (x - 26) + ' 96 q 26 -16 52 0',
          fill: 'none', stroke: k.c, 'stroke-width': 1.6, 'marker-end': 'url(#ueflx)' }));
      } else if (k.a === 'inclinaison') {
        kids.push(S('path', { d: 'M ' + (x - 24) + ' 92 q 24 -12 46 8',
          fill: 'none', stroke: k.c, 'stroke-width': 1.6, 'marker-end': 'url(#ueflx)' }));
      } else {
        kids.push(ligne(x, 108, x, 88, { c: k.c, w: 1.6, arrow: true }));
        kids.push(ligne(x + 22, 88, x + 22, 108, { c: k.c, w: 1.6, arrow: true }));
      }

      kids.push(txt(x, 232, k.t, { anchor: 'middle', size: 12, bold: true, fill: k.c }));
      kids.push(txt(x, 254, k.d, { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--txt)' }));
    });

    cas.forEach(function (k, i) {
      kids.push(txt(58, 296 + i * 24, '·', { size: 12, bold: true, fill: k.c }));
      kids.push(txt(74, 296 + i * 24, k.t + ' — ' + k.e, { size: 11, fill: 'var(--txt-2)' }));
    });

    return svg(640, 380, 'Torticolis compensateurs et ce qu’ils signalent', kids);
  }

  /* ============================================================
     50 · Les trois cycloplégiques
     ============================================================
     Trois produits, trois échelles de temps sans commune mesure —
     et c'est le seul point qui décide de celui qu'on instille.
     L'axe est logarithmique : sinon l'atropine écrase tout.
     ============================================================ */
  function cycloplegiques() {
    var kids = [];
    var prods = [
      { n: 'Tropicamide', dose: '0,5 – 1 %', deb: 25, fin: 300, c: 'var(--accent)',
        u: 'Dépistage, fond d’œil', note: 'cycloplégie incomplète' },
      { n: 'Cyclopentolate', dose: '1 %', deb: 38, fin: 1440, c: 'var(--blue)',
        u: 'Référence chez l’enfant', note: '2 gouttes à 5 min d’intervalle' },
      { n: 'Atropine', dose: '0,3 – 1 %', deb: 60, fin: 10080, c: 'var(--violet)',
        u: 'Strabisme accommodatif, pénalisation', note: 'la plus puissante' }
    ];
    var x0 = 258, larg = 320, y0 = 112;
    function xDe(min) { return x0 + larg * Math.log(min / 20) / Math.log(600); }

    [[30, '30 min'], [120, '2 h'], [1440, '24 h'], [10080, '7 j']].forEach(function (g) {
      var x = xDe(g[0]);
      kids.push(ligne(x, 92, x, y0 + prods.length * 58 - 8, { c: 'var(--line-soft)', w: 0.8 }));
      kids.push(txt(x, 84, g[1], { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    });
    kids.push(txt(x0 + larg / 2, 56, 'Du début d’action à la fin de l’effet',
      { anchor: 'middle', size: 11.5, bold: true, fill: 'var(--txt-2)' }));
    kids.push(txt(x0 + larg / 2, 70, 'échelle logarithmique',
      { anchor: 'middle', size: 9.5, italic: true, fill: 'var(--txt-3)' }));

    prods.forEach(function (p, i) {
      var y = y0 + i * 58;
      kids.push(txt(240, y + 2, p.n, { anchor: 'end', size: 12.5, bold: true, fill: p.c }));
      kids.push(txt(240, y + 17, p.dose, { anchor: 'end', size: 10, fill: 'var(--txt-3)' }));
      kids.push(txt(240, y + 31, p.u, { anchor: 'end', size: 9.5, italic: true, fill: 'var(--txt-3)' }));

      var xa = xDe(p.deb), xb = xDe(p.fin);
      kids.push(S('rect', {
        x: xa, y: y - 10, width: Math.max(6, xb - xa), height: 20, rx: 5,
        fill: 'color-mix(in srgb, ' + p.c + ' 26%, transparent)',
        stroke: p.c, 'stroke-width': 1.1
      }));
      kids.push(S('circle', { cx: xa, cy: y, r: 4, fill: p.c }));
      kids.push(txt(xa, y + 26, p.note, { size: 9.5, fill: 'var(--txt-3)' }));
    });

    var yb = y0 + prods.length * 58 + 16;
    kids.push(ligne(58, yb, 580, yb, { c: 'var(--line-soft)' }));
    kids.push(txt(58, yb + 26, 'Le point commun : ils bloquent le muscle ciliaire — donc ils dilatent aussi.',
      { size: 11.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, yb + 44, 'Prévenir du flou de près, de la photophobie et de leur durée : c’est ce qui fait revenir le patient.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    return svg(640, yb + 62, 'Délai et durée des trois cycloplégiques', kids);
  }

  /* ============================================================
     51 · Le secret professionnel — qui peut savoir quoi
     ============================================================
     La règle se récite volontiers de travers : « on peut le dire
     à la famille », « c'est déjà connu ». Trois cercles et trois
     verdicts la remettent d'aplomb.
     ============================================================ */
  function secret() {
    var kids = [];
    kids.push(txt(58, 44, 'Ce qui est couvert, et par qui il peut être partagé',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Le secret couvre tout ce dont on a connaissance dans l’exercice — y compris ce qui est confié',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));
    kids.push(txt(58, 77, 'par l’entourage, et ce qui est simplement déduit.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    /* le patient au centre : c'est lui qui détient l'information */
    kids.push(S('circle', { cx: 132, cy: 208, r: 46,
      fill: 'color-mix(in srgb, var(--accent) 16%, transparent)',
      stroke: 'var(--accent)', 'stroke-width': 1.6 }));
    kids.push(txt(132, 204, 'Le patient', { anchor: 'middle', size: 12, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(132, 222, 'seul maître', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));

    [{ q: 'L’équipe de soins', v: 'Oui, mais', c: 'var(--amber)',
       d: 'et seulement ce qui est nécessaire à la prise en charge' },
     { q: 'Les proches, la famille', v: 'Non', c: 'var(--red)',
       d: 'sauf accord du patient — leur demande ne lève rien' },
     { q: 'Employeur, assurance, école', v: 'Jamais', c: 'var(--red)',
       d: 'même si l’information circule déjà par ailleurs' }
    ].forEach(function (b, i) {
      var y = 118 + i * 74;
      kids.push(ligne(180, 208, 232, y + 26, { c: 'var(--line)', w: 1, dash: '3 3' }));
      kids.push(S('rect', { x: 236, y: y, width: 350, height: 54, rx: 7,
        fill: 'color-mix(in srgb, ' + b.c + ' 10%, transparent)',
        stroke: b.c, 'stroke-width': 1.1 }));
      kids.push(txt(252, y + 23, b.q, { size: 12, bold: true, fill: 'var(--txt)' }));
      kids.push(txt(252, y + 41, b.d, { size: 10, fill: 'var(--txt-3)' }));
      kids.push(txt(572, y + 27, b.v, { anchor: 'end', size: 13, bold: true, fill: b.c }));
    });

    kids.push(txt(58, 352, 'Sa violation est un délit — pas une maladresse.',
      { size: 11.5, bold: true, fill: 'var(--red)' }));

    return svg(640, 378, 'Le secret professionnel : qui peut savoir quoi', kids);
  }

  /* ============================================================
     52 · Les quatre grands principes de l'éthique
     ============================================================
     Un dilemme n'est pas un doute : c'est deux principes qui
     s'opposent. Le quadrant sert à nommer lequel contre lequel —
     ce qui est déjà la moitié du raisonnement attendu.
     ============================================================ */
  function ethique() {
    var kids = [];
    var P = [
      { n: 'Autonomie', d: 'Respecter la décision du patient', c: 'var(--accent)' },
      { n: 'Bienfaisance', d: 'Agir pour son bien', c: 'var(--blue)' },
      { n: 'Non-malfaisance', d: 'D’abord, ne pas nuire', c: 'var(--violet)' },
      { n: 'Justice', d: 'Équité d’accès et de traitement', c: 'var(--amber)' }
    ];
    var x0 = 96, y0 = 84, w = 214, h = 92;

    P.forEach(function (p, i) {
      var x = x0 + (i % 2) * (w + 16), y = y0 + Math.floor(i / 2) * (h + 16);
      kids.push(S('rect', { x: x, y: y, width: w, height: h, rx: 8,
        fill: 'color-mix(in srgb, ' + p.c + ' 12%, transparent)',
        stroke: p.c, 'stroke-width': 1.3 }));
      kids.push(txt(x + w / 2, y + 38, p.n, { anchor: 'middle', size: 14, bold: true, fill: p.c }));
      kids.push(txt(x + w / 2, y + 60, p.d, { anchor: 'middle', size: 10.5, fill: 'var(--txt-2)' }));
    });

    kids.push(txt(320, 44, 'Quatre principes — et un dilemme naît quand deux s’opposent',
      { anchor: 'middle', size: 12.5, bold: true, fill: 'var(--txt)' }));

    /* l'exemple qui sert de patron à toutes les questions d'éthique */
    var y = y0 + 2 * (h + 16) + 14;
    kids.push(S('rect', { x: 96, y: y, width: 444, height: 92, rx: 8,
      fill: 'var(--surface)', stroke: 'var(--line)', 'stroke-width': 1 }));
    kids.push(txt(116, y + 26, 'L’enfant qui refuse l’occlusion', { size: 12, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(116, y + 46, 'Son autonomie naissante contre la bienfaisance du traitement.',
      { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(116, y + 68, 'La réponse n’est pas de choisir un camp : on explicite le conflit, on associe la famille, on trace le raisonnement.',
      { size: 10.5, italic: true, fill: 'var(--accent)' }));

    return svg(640, y + 118, 'Les quatre principes de l’éthique et le dilemme', kids);
  }

  /* ============================================================
     53 · Accident d'exposition au sang — minute par minute
     ============================================================
     Quatre gestes, quatre horloges. Ce qui se joue ici, c'est la
     fenêtre des quatre heures : passé ce délai, le traitement
     post-exposition perd l'essentiel de son intérêt.
     ============================================================ */
  function aes() {
    var kids = [];
    var etapes = [
      { t: 'Immédiat', c: 'var(--red)',
        peau: 'Laver à l’eau et au savon', oeil: 'Rincer au sérum physiologique',
        n: 'ne pas faire saigner' },
      { t: '≥ 5 min', c: 'var(--amber)',
        peau: 'Antisepsie : chloré ou alcool 70°', oeil: 'Poursuivre le rinçage',
        n: 'le temps de contact fait l’antisepsie' },
      { t: '< 4 heures', c: 'var(--accent)',
        peau: 'Avis médical', oeil: 'Avis médical',
        n: 'c’est la fenêtre du traitement post-exposition' },
      { t: '24 – 48 h', c: 'var(--blue)',
        peau: 'Déclaration d’accident du travail', oeil: 'Déclaration d’accident du travail',
        n: 'sans elle, aucune reconnaissance ultérieure' }
    ];
    /* la frise commence après la colonne des libellés de voie, sinon la
       première case les recouvre */
    var x0 = 100, pas = 132, y = 118;

    kids.push(txt(58, 44, 'Quatre gestes, quatre horloges', { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'L’ordre compte autant que le contenu : chaque étape a son délai propre.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    kids.push(ligne(x0, y, x0 + 3 * pas, y, { c: 'var(--line)', w: 1.4 }));
    etapes.forEach(function (e, i) {
      var x = x0 + i * pas;
      kids.push(S('circle', { cx: x, cy: y, r: 11,
        fill: 'color-mix(in srgb, ' + e.c + ' 28%, transparent)',
        stroke: e.c, 'stroke-width': 1.8 }));
      kids.push(txt(x, y + 5, String(i + 1), { anchor: 'middle', size: 12, bold: true, fill: e.c }));
      kids.push(txt(x, y - 24, e.t, { anchor: 'middle', size: 12, bold: true, fill: e.c }));
    });

    /* le libellé de voie se pose AU-DESSUS de sa rangée : placé à gauche, il
       passait sous la première case, quelle que soit la marge laissée */
    [['Peau, piqûre', 'peau', 196], ['Projection oculaire', 'oeil', 274]].forEach(function (v) {
      kids.push(txt(46, v[2] - 34, v[0].toUpperCase(), { size: 9.5, bold: true, fill: 'var(--txt-3)' }));
      etapes.forEach(function (e, i) {
        var x = x0 + i * pas;
        kids.push(S('rect', { x: x - 54, y: v[2] - 22, width: 108, height: 46, rx: 6,
          fill: 'var(--surface)', stroke: 'var(--line-soft)', 'stroke-width': 0.9 }));
        couper(e[v[1]], 18).slice(0, 3).forEach(function (l, k) {
          kids.push(txt(x, v[2] - 6 + k * 12, l, { anchor: 'middle', size: 9, fill: 'var(--txt-2)' }));
        });
      });
    });

    etapes.forEach(function (e, i) {
      kids.push(txt(46, 336 + i * 20, '·', { size: 12, bold: true, fill: e.c }));
      kids.push(txt(62, 336 + i * 20, e.t + ' — ' + e.n, { size: 10.5, fill: 'var(--txt-3)' }));
    });

    return svg(640, 430, 'Accident d’exposition au sang : la conduite à tenir', kids);
  }

  /* ============================================================
     54 · Adénovirus — la chaîne, et où on la coupe
     ============================================================
     Un virus qui survit sur les surfaces et résiste aux
     antiseptiques usuels ne s'arrête pas par la vigilance : il
     s'arrête parce qu'on a coupé un maillon précis.
     ============================================================ */
  function adenovirus() {
    var kids = [];
    var maillons = [
      { t: 'Patient contagieux', d: 'larmoiement, adénopathie' },
      { t: 'Mains, matériel', d: 'tonomètre, occluseur' },
      { t: 'Surfaces', d: 'il y survit longtemps' },
      { t: 'Patient suivant', d: 'et l’épidémie démarre' }
    ];
    var coupes = [
      'Fin de programme, éviction, information',
      'Matériel dédié, usage unique, lavage des mains',
      'Désinfection renforcée du poste'
    ];
    var x0 = 106, pas = 148, y = 128;

    kids.push(txt(58, 44, 'Une chaîne de transmission se coupe à un maillon, pas par la vigilance',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'L’adénovirus survit sur les surfaces et résiste à beaucoup d’antiseptiques usuels.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    maillons.forEach(function (m, i) {
      var x = x0 + i * pas;
      kids.push(S('rect', { x: x - 58, y: y - 26, width: 116, height: 52, rx: 7,
        fill: i === 3 ? 'color-mix(in srgb, var(--red) 12%, transparent)' : 'var(--surface-3)',
        stroke: i === 3 ? 'var(--red)' : 'var(--line)', 'stroke-width': i === 3 ? 1.3 : 0.9 }));
      kids.push(txt(x, y - 4, m.t, { anchor: 'middle', size: 11, bold: true,
        fill: i === 3 ? 'var(--red)' : 'var(--txt)' }));
      kids.push(txt(x, y + 13, m.d, { anchor: 'middle', size: 9, fill: 'var(--txt-3)' }));
      if (i < 3) kids.push(ligne(x + 60, y, x + pas - 62, y, { c: 'var(--line-hard)', w: 1.2, arrow: true }));
    });

    /* les ciseaux : trois endroits où la chaîne se rompt */
    coupes.forEach(function (c, i) {
      var x = x0 + i * pas + pas / 2;
      kids.push(txt(x, y - 44, '✂', { anchor: 'middle', size: 15, fill: 'var(--accent)' }));
      kids.push(ligne(x, y - 34, x, y - 14, { c: 'var(--accent)', w: 1.4, dash: '3 3' }));
      kids.push(txt(58, 230 + i * 24, '✂', { size: 12, fill: 'var(--accent)' }));
      kids.push(txt(78, 230 + i * 24, c, { size: 11, fill: 'var(--txt-2)' }));
    });

    kids.push(txt(58, 322, 'Le patient prévenu protège les siens : durée de contagiosité, lavage des mains, linge personnel.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    return svg(640, 348, 'La chaîne de transmission de l’adénovirus et ses trois coupures', kids);
  }

  /* ============================================================
     55 · Diabète — quel examen, devant quelle question
     ============================================================
     Trois questions cliniques, trois examens. Les confondre,
     c'est demander une angiographie pour un dépistage.
     ============================================================ */
  function diabete() {
    var kids = [];
    var lignes = [
      { q: 'Dépister, chez un patient sans plainte', e: 'Rétinophotographies grand champ',
        n: 'lecture différée possible — c’est ce qui rend la télémédecine praticable', c: 'var(--accent)' },
      { q: 'Une baisse d’acuité', e: 'OCT maculaire',
        n: 'l’œdème maculaire est la première cause de baisse d’acuité du diabétique', c: 'var(--blue)' },
      { q: 'Une suspicion de néovaisseaux', e: 'Angiographie',
        n: 'elle seule montre les territoires d’ischémie et les néovaisseaux', c: 'var(--violet)' }
    ];

    kids.push(txt(58, 44, 'Trois questions, trois examens', { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'C’est la question posée qui choisit l’examen — jamais l’inverse.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    lignes.forEach(function (l, i) {
      var y = 92 + i * 86;
      kids.push(S('rect', { x: 58, y: y, width: 216, height: 56, rx: 7,
        fill: 'var(--surface-3)', stroke: 'var(--line)', 'stroke-width': 0.9 }));
      kids.push(txt(74, y + 24, 'Question', { size: 9.5, fill: 'var(--txt-3)' }));
      kids.push(txt(74, y + 42, l.q, { size: 11, bold: true, fill: 'var(--txt)' }));
      kids.push(ligne(280, y + 28, 316, y + 28, { c: l.c, w: 1.6, arrow: true }));
      kids.push(S('rect', { x: 322, y: y, width: 260, height: 56, rx: 7,
        fill: 'color-mix(in srgb, ' + l.c + ' 12%, transparent)',
        stroke: l.c, 'stroke-width': 1.2 }));
      kids.push(txt(338, y + 26, l.e, { size: 12, bold: true, fill: l.c }));
      kids.push(txt(338, y + 44, 'examen de première intention', { size: 9, fill: 'var(--txt-3)' }));
      kids.push(txt(74, y + 74, l.n, { size: 10, italic: true, fill: 'var(--txt-3)' }));
    });

    var y = 92 + 3 * 86 + 8;
    kids.push(ligne(58, y, 582, y, { c: 'var(--line-soft)' }));
    kids.push(txt(58, y + 26, 'Deux situations aggravent transitoirement la rétinopathie :',
      { size: 11.5, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(58, y + 44, 'la grossesse, et une équilibration trop rapide de l’HbA1c. Elles resserrent le suivi, elles ne le suspendent pas.',
      { size: 10.5, fill: 'var(--txt-2)' }));

    return svg(640, y + 72, 'Diabète : quel examen pour quelle question', kids);
  }

  /* ============================================================
     56 · Pourquoi on resserre les examens au début
     ============================================================
     Le rythme de suivi paraît contre-intuitif tant qu'on n'a pas
     vu ceci : deux points laissent passer une infinité de pentes,
     trois n'en laissent qu'une.
     ============================================================ */
  function suivi() {
    var kids = [];
    var yBase = 250, hMax = 130;

    kids.push(txt(58, 44, 'Une pente ne se trace pas avec deux points',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Trois champs visuels la première année valent mieux qu’un par an pendant trois ans.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [{ t: 'Deux examens', x0: 78, pts: [[0, 0], [1, 0.34]], flou: true, c: 'var(--red)',
       v: 'La pente est indéterminée' },
     { t: 'Quatre examens rapprochés', x0: 356, pts: [[0, 0], [0.3, 0.12], [0.62, 0.2], [1, 0.34]],
       flou: false, c: 'var(--green)', v: 'La pente est fiable' }
    ].forEach(function (p) {
      var w = 206;
      kids.push(txt(p.x0 + w / 2, 100, p.t, { anchor: 'middle', size: 12, bold: true, fill: p.c }));
      kids.push(ligne(p.x0, yBase, p.x0 + w, yBase, { c: 'var(--line)', w: 1 }));
      kids.push(ligne(p.x0, yBase, p.x0, yBase - hMax, { c: 'var(--line)', w: 1 }));
      kids.push(txt(p.x0 - 6, yBase - hMax + 4, 'déficit', { anchor: 'end', size: 9, fill: 'var(--txt-3)' }));
      kids.push(txt(p.x0 + w, yBase + 18, 'temps', { anchor: 'end', size: 9, fill: 'var(--txt-3)' }));

      if (p.flou) {
        /* le faisceau reste dans le cadre : hors de lui, il traversait le
           sous-titre en haut et la légende en bas */
        [0.06, 0.30, 0.54, 0.78, 0.98].forEach(function (k) {
          kids.push(ligne(p.x0, yBase, p.x0 + w, yBase - hMax * k,
            { c: 'var(--red)', w: 1, dash: '4 4' }));
        });
      } else {
        kids.push(ligne(p.x0, yBase, p.x0 + w, yBase - hMax * 0.54, { c: 'var(--green)', w: 2.2 }));
      }

      p.pts.forEach(function (pt) {
        kids.push(S('circle', { cx: p.x0 + w * pt[0], cy: yBase - hMax * pt[1] * 1.6, r: 5,
          fill: p.c, stroke: 'var(--bg)', 'stroke-width': 1.4 }));
      });
      kids.push(txt(p.x0 + w / 2, yBase + 42, p.v, { anchor: 'middle', size: 11, bold: true, fill: p.c }));
    });

    kids.push(ligne(58, 312, 582, 312, { c: 'var(--line-soft)' }));
    kids.push(txt(58, 338, 'Le rythme se règle sur trois choses :', { size: 11.5, bold: true, fill: 'var(--txt)' }));
    ['la vitesse de progression observée',
     'l’espérance de vie visuelle — un glaucome à 45 ans a quarante ans devant lui',
     'la marge restante entre l’atteinte et la fonction utile'
    ].forEach(function (l, i) {
      kids.push(txt(58, 360 + i * 22, '·  ' + l, { size: 11, fill: 'var(--txt-2)' }));
    });

    return svg(640, 432, 'Pourquoi le suivi se resserre au début', kids);
  }

  /* ============================================================
     57 · Le développement visuel, de la naissance à six ans
     ============================================================
     La période sensible donne son urgence à toute la pédiatrie
     orthoptique : ce qui n'est pas installé avant la fermeture
     de la fenêtre ne s'installera plus.
     ============================================================ */
  function developpement() {
    var kids = [];
    /* Cinq colonnes de largeur égale, et non un axe de temps réel : les
       quatre premiers jalons tiennent dans les douze premiers mois, et
       aucune étiquette ne survit à un tel tassement. L'âge est écrit. */
    var x0 = 60, colonne = 110, ecart = 6, y = 176;
    var pts = [
      { t: 'Naissance', h: 'Réflexe photomoteur, fixation brève', b: 'Leucocorie, aucune réaction à la lumière' },
      { t: '4 mois', h: 'Poursuite, alignement stable', b: 'Strabisme constant après 4 mois' },
      { t: '1 an', h: 'Binocularité, préhension guidée', b: 'Nystagmus, torticolis' },
      { t: '3 ans', h: 'Acuité en images, stéréoscopie', b: 'Refus d’occlusion d’un œil' },
      { t: '6 – 8 ans', h: 'Acuité proche de l’adulte', b: 'La fenêtre se referme' }
    ];
    function cx(i) { return x0 + i * (colonne + ecart) + colonne / 2; }

    kids.push(txt(58, 44, 'Ce qui s’installe, et ce qui doit alerter',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'La maturation est très rapide les premiers mois, puis la fenêtre se referme lentement.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    kids.push(txt(320, 92, 'CE QUI S’INSTALLE', { anchor: 'middle', size: 9.5, bold: true, fill: 'var(--txt-3)' }));
    kids.push(txt(320, 232, 'CE QUI DOIT ALERTER', { anchor: 'middle', size: 9.5, bold: true, fill: 'var(--red)' }));

    kids.push(ligne(x0 + 12, y, x0 + 4 * (colonne + ecart) + colonne - 12, y,
      { c: 'var(--line-hard)', w: 1.2 }));

    pts.forEach(function (p, i) {
      var x = cx(i);
      couper(p.h, 22).slice(0, 2).forEach(function (l, k) {
        kids.push(txt(x, 116 + k * 13, l, { anchor: 'middle', size: 9.5, fill: 'var(--txt-2)' }));
      });
      kids.push(txt(x, 156, p.t, { anchor: 'middle', size: 12, bold: true, fill: 'var(--txt)' }));
      kids.push(S('circle', { cx: x, cy: y, r: 6, fill: 'var(--accent)' }));
      couper(p.b, 22).slice(0, 2).forEach(function (l, k) {
        kids.push(txt(x, 256 + k * 13, l, { anchor: 'middle', size: 9.5, fill: 'var(--red)' }));
      });
    });

    /* la période sensible : une barre à part, sous les alertes */
    kids.push(S('rect', { x: 58, y: 296, width: 524, height: 30, rx: 15,
      fill: 'color-mix(in srgb, var(--accent) 14%, transparent)',
      stroke: 'color-mix(in srgb, var(--accent) 34%, transparent)', 'stroke-width': 1 }));
    kids.push(txt(320, 316, 'Période sensible de l’amblyopie — jusqu’à 6 à 8 ans',
      { anchor: 'middle', size: 11, bold: true, fill: 'var(--accent)' }));

    kids.push(txt(58, 356, 'Le développement visuel conditionne la motricité, l’exploration et les apprentissages :',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));
    kids.push(txt(58, 371, 'c’est ce qui donne son urgence à toute prise en charge de l’enfant.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    return svg(640, 396, 'Le développement visuel de la naissance à six ans', kids);
  }

  /* ============================================================
     58 · Les ésotropies de l'enfant, par âge d'apparition
     ============================================================
     L'âge d'apparition est le premier tri, et il est presque
     toujours donné par les parents avant tout examen.
     ============================================================ */
  function esotropies() {
    var kids = [];
    var x0 = 116, larg = 400, y = 122;
    function xDe(mois) { return x0 + larg * Math.min(1, Math.sqrt(mois / 72)); }

    kids.push(txt(58, 44, 'L’âge d’apparition fait le premier tri',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Et il est presque toujours donné par les parents, avant tout examen.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [[0, 'naiss.'], [6, '6 mois'], [24, '2 ans'], [48, '4 ans'], [72, '6 ans']].forEach(function (g) {
      var x = xDe(g[0]);
      kids.push(ligne(x, y - 8, x, y + 8, { c: 'var(--line-hard)', w: 1 }));
      kids.push(txt(x, y - 16, g[1], { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    });
    kids.push(ligne(x0, y, x0 + larg, y, { c: 'var(--line)', w: 1.2 }));

    var formes = [
      { n: 'Ésotropie congénitale', a: 0, b: 6, c: 'var(--red)',
        s: ['Grand angle stable, souvent supérieur à 30 Δ',
            'Peu d’hypermétropie · fixation croisée · alternance fréquente',
            'DVD, nystagmus manifeste-latent, hyperaction des obliques inférieurs',
            'Pronostic sensoriel médiocre : viser un alignement précoce'] },
      { n: 'Ésotropie accommodative', a: 24, b: 48, c: 'var(--blue)',
        s: ['Début progressif, d’abord intermittent · hypermétropie souvent > +3,00 D',
            'La correction optique totale sous cycloplégie réduit ou annule l’angle',
            'Forme à AC/A élevé : angle de près nettement supérieur à celui de loin',
            'Forme partiellement accommodative : un angle résiduel persiste sous correction'] }
    ];
    formes.forEach(function (f, i) {
      var xa = xDe(f.a), xb = xDe(f.b), yy = y + 26 + i * 18;
      kids.push(S('rect', { x: xa, y: yy - 8, width: Math.max(10, xb - xa), height: 16, rx: 8,
        fill: 'color-mix(in srgb, ' + f.c + ' 30%, transparent)',
        stroke: f.c, 'stroke-width': 1.2 }));
      kids.push(txt(xb + 12, yy + 5, f.n, { size: 11, bold: true, fill: f.c }));
    });

    /* un point par ligne : sur deux colonnes, la première déborde sur la seconde */
    formes.forEach(function (f, i) {
      var yy = 212 + i * 122;
      kids.push(S('rect', { x: 58, y: yy, width: 524, height: 110, rx: 7,
        fill: 'color-mix(in srgb, ' + f.c + ' 8%, transparent)',
        stroke: f.c, 'stroke-width': 1.1 }));
      kids.push(txt(76, yy + 24, f.n, { size: 12.5, bold: true, fill: f.c }));
      f.s.forEach(function (l, k) {
        kids.push(txt(76, yy + 46 + k * 17, '· ' + l, { size: 9.5, fill: 'var(--txt-2)' }));
      });
    });

    return svg(640, 470, 'Les ésotropies de l’enfant selon l’âge d’apparition', kids);
  }

  /* ============================================================
     59 · L'épithélium pigmentaire — quatre fonctions, une couche
     ============================================================
     Une monocouche prise entre deux mondes : la choriocapillaire
     qui nourrit, les photorécepteurs qui consomment. Tout ce
     qu'elle fait découle de cette position.
     ============================================================ */
  function epithelium() {
    var kids = [];
    var xC = 320, w = 110;

    kids.push(txt(58, 44, 'Une monocouche prise entre deux mondes',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'La choriocapillaire nourrit, les photorécepteurs consomment — tout le reste en découle.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [['Photorécepteurs', 'var(--accent)', 90, 46],
     ['Épithélium pigmentaire', 'var(--violet)', 140, 36],
     ['Choriocapillaire', 'var(--red)', 180, 44]
    ].forEach(function (e) {
      kids.push(S('rect', { x: xC - w, y: e[2], width: 2 * w, height: e[3], rx: 5,
        fill: 'color-mix(in srgb, ' + e[1] + ' 16%, transparent)',
        stroke: e[1], 'stroke-width': 1.2 }));
      kids.push(txt(xC, e[2] + e[3] / 2 + 4, e[0], { anchor: 'middle', size: 11.5, bold: true, fill: e[1] }));
    });

    /* les quatre fonctions sous l'empilement, en grille : posées de part et
       d'autre, leurs légendes passaient sous les bandes */
    kids.push(txt(58, 258, 'QUATRE FONCTIONS, POUR UNE SEULE COUCHE',
      { size: 9.5, bold: true, fill: 'var(--txt-3)' }));
    [{ t: 'Phagocyter', d: 'les articles externes usés, chaque jour' },
     { t: 'Recycler', d: 'le rétinal — cycle des rétinoïdes' },
     { t: 'Absorber', d: 'la lumière parasite' },
     { t: 'Faire barrière', d: 'hémato-rétinienne externe' }
    ].forEach(function (f, i) {
      var x = 58 + (i % 2) * 268, y = 276 + Math.floor(i / 2) * 52;
      kids.push(S('rect', { x: x, y: y, width: 254, height: 42, rx: 6,
        fill: 'color-mix(in srgb, var(--violet) 9%, transparent)',
        stroke: 'color-mix(in srgb, var(--violet) 32%, transparent)', 'stroke-width': 1 }));
      kids.push(txt(x + 14, y + 18, f.t, { size: 11.5, bold: true, fill: 'var(--violet)' }));
      kids.push(txt(x + 14, y + 33, f.d, { size: 9.5, fill: 'var(--txt-3)' }));
    });

    kids.push(ligne(58, 394, 582, 394, { c: 'var(--line-soft)' }));
    kids.push(txt(58, 420, 'Quand le service d’entretien fatigue', { size: 11.5, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(58, 438, 'Les déchets s’accumulent : drusen et lipofuscine — le point de départ de la DMLA.',
      { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(58, 458, 'Et quand la couche est atteinte génétiquement : les dystrophies rétiniennes.',
      { size: 10.5, fill: 'var(--txt-2)' }));

    return svg(640, 484, 'L’épithélium pigmentaire et ses quatre fonctions', kids);
  }

  /* ============================================================
     60 · Le brouillage — pourquoi on part du flou
     ============================================================
     La règle d'or (« la sphère la plus convexe donnant la
     meilleure acuité ») ne se comprend qu'en voyant la courbe :
     du côté du plus, l'acuité chute franchement ; du côté du
     moins, elle ne chute pas — c'est l'accommodation qui paie,
     et le patient qui fatigue.
     ============================================================ */
  function brouillage(p) {
    var d = p.ecart;
    var kids = [];
    /* la gouttière de gauche accueille la lecture en grand : le graphe
       commence après elle, sinon le chiffre percute la graduation 10/10 */
    var x0 = 196, larg = 336, yBase = 268, haut = 150;

    function av(e) { return e > 0 ? 10 / (1 + 2.6 * e) : 10; }
    function xDe(e) { return x0 + larg * (1.5 - e) / 3; }
    function yDe(a) { return yBase - haut * a / 10; }

    kids.push(txt(58, 44, 'La sphère la plus convexe qui donne la meilleure acuité',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'On part du brouillard et on retire le plus par pas de 0,25 — jamais l’inverse.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    kids.push(S('rect', { x: xDe(0), y: yBase - haut - 6, width: xDe(-1.5) - xDe(0), height: haut + 6,
      fill: 'color-mix(in srgb, var(--red) 9%, transparent)' }));
    kids.push(txt((xDe(0) + xDe(-1.5)) / 2, yBase - haut + 40, 'le patient accommode',
      { anchor: 'middle', size: 10, bold: true, fill: 'var(--red)' }));
    kids.push(txt((xDe(0) + xDe(-1.5)) / 2, yBase - haut + 54, 'il voit 10/10 — et il fatigue',
      { anchor: 'middle', size: 9, italic: true, fill: 'var(--txt-3)' }));

    kids.push(ligne(x0, yBase, x0 + larg, yBase, { c: 'var(--line)', w: 1 }));
    kids.push(ligne(x0, yBase, x0, yBase - haut - 10, { c: 'var(--line)', w: 1 }));
    [10, 5, 2].forEach(function (a) {
      kids.push(txt(x0 - 8, yDe(a) + 4, a + '/10', { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));
      kids.push(ligne(x0 - 3, yDe(a), x0 + larg, yDe(a), { c: 'var(--line-soft)', w: 0.7 }));
    });
    [[1.5, '+1,50'], [0.75, '+0,75'], [0, 'juste'], [-0.75, '−0,75'], [-1.5, '−1,50']].forEach(function (g) {
      kids.push(txt(xDe(g[0]), yBase + 20, g[1], { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
    });

    var pts = [];
    for (var e = 1.5; e >= -1.5; e -= 0.05) pts.push(xDe(e) + ' ' + yDe(av(e)));
    kids.push(S('path', { d: 'M ' + pts.join(' L '), fill: 'none',
      stroke: 'var(--accent)', 'stroke-width': 2.2 }));

    kids.push(ligne(xDe(0), yBase, xDe(0), yDe(10), { c: 'var(--green)', w: 1.4, dash: '4 3' }));
    kids.push(S('circle', { cx: xDe(0), cy: yDe(10), r: 5, fill: 'var(--green)' }));
    kids.push(txt(xDe(0) - 10, yDe(10) - 12, 'règle d’or', { anchor: 'end', size: 10, bold: true, fill: 'var(--green)' }));

    kids.push(S('circle', { cx: xDe(d), cy: yDe(av(d)), r: 7,
      fill: 'var(--amber)', stroke: 'var(--bg)', 'stroke-width': 1.6 }));

    kids.push(txt(58, 140, 'Acuité obtenue', { size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(58, 172, av(d).toFixed(1).replace('.', ',') + '/10',
      { size: 22, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(58, 198, 'Écart à la sphère juste', { size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(58, 222, fmt(d) + ' D', { size: 16, bold: true, fill: 'var(--txt-2)' }));

    return svg(640, 310, 'Le brouillage et la règle de la sphère la plus convexe', kids);
  }

  /* ============================================================
     61 · La dose d'occlusion
     ============================================================
     Le chiffre qui se retient de travers : « plus j'occlus, mieux
     c'est ». Les études disent l'inverse au-delà de six heures —
     et que l'activité de près pendant l'occlusion pèse davantage
     que l'heure supplémentaire.
     ============================================================ */
  function occlusion() {
    var kids = [];
    var x0 = 210, larg = 300, y0 = 106;
    function xDe(h) { return x0 + larg * h / 8; }

    kids.push(txt(58, 44, 'La dose se règle sur la profondeur, pas sur l’impatience',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Pansement occlusif sur la peau — jamais sur le verre, qu’un enfant contourne en une seconde.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [0, 2, 4, 6, 8].forEach(function (h) {
      kids.push(ligne(xDe(h), y0 - 10, xDe(h), y0 + 92, { c: 'var(--line-soft)', w: 0.8 }));
      kids.push(txt(xDe(h), y0 - 18, h + ' h', { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    });

    [{ n: 'Amblyopie modérée', h: 2, c: 'var(--accent)' },
     { n: 'Amblyopie profonde', h: 6, c: 'var(--amber)' }
    ].forEach(function (b, i) {
      var y = y0 + 18 + i * 44;
      kids.push(txt(192, y + 4, b.n, { anchor: 'end', size: 11.5, bold: true, fill: b.c }));
      kids.push(S('rect', { x: x0, y: y - 12, width: xDe(b.h) - x0, height: 24, rx: 5,
        fill: 'color-mix(in srgb, ' + b.c + ' 30%, transparent)', stroke: b.c, 'stroke-width': 1.1 }));
      /* au-dessus de la barre quand elle finit près de la zone du plateau */
      if (b.h >= 5) kids.push(txt(xDe(b.h) - 8, y - 18, b.h + ' h par jour', { anchor: 'end', size: 11, bold: true, fill: b.c }));
      else kids.push(txt(xDe(b.h) + 10, y + 5, b.h + ' h par jour', { size: 11, bold: true, fill: b.c }));
    });

    /* le plateau : la zone où l'heure de plus ne rapporte presque rien */
    kids.push(S('rect', { x: xDe(6), y: y0 - 6, width: xDe(8) - xDe(6), height: 88,
      fill: 'color-mix(in srgb, var(--red) 10%, transparent)' }));
    kids.push(txt((xDe(6) + xDe(8)) / 2, y0 + 100, 'gain faible', { anchor: 'middle', size: 10, bold: true, fill: 'var(--red)' }));

    kids.push(ligne(58, 236, 582, 236, { c: 'var(--line-soft)' }));
    [['💡', 'Toujours avec une activité de près pendant l’occlusion — dessin, lecture, jeux fins : elle double l’efficacité.', 'var(--accent)'],
     ['⚠️', 'Surveiller l’œil occlus : chez le jeune enfant, une occlusion trop longue crée une amblyopie à bascule.', 'var(--amber)'],
     ['⛔', 'Ne jamais occlure sans avoir d’abord porté la correction optique totale : c’est l’étape 1, et elle suffit parfois.', 'var(--red)']
    ].forEach(function (l, i) {
      kids.push(txt(58, 264 + i * 26, l[0], { size: 12 }));
      kids.push(txt(84, 264 + i * 26, l[1], { size: 11, fill: l[2] }));
    });

    return svg(640, 362, 'La dose d’occlusion selon la profondeur de l’amblyopie', kids);
  }

  /* ============================================================
     62 · Hémianopsie latérale homonyme
     ============================================================
     Le déficit est irréversible : ce qui se rééduque, c'est le
     regard. Et le côté du déficit change la gêne à la lecture —
     c'est ce que le schéma doit rendre évident.
     ============================================================ */
  function hlh() {
    var kids = [];
    kids.push(txt(58, 44, 'Le même déficit des deux côtés — c’est ce qui le rend homonyme',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    /* Le dessin ombre la moitié DROITE des deux champs : le texte doit dire
       la lésion gauche, sinon la figure enseigne l'inverse de sa légende. */
    kids.push(txt(58, 62, 'Une lésion rétrochiasmatique gauche ampute l’hémichamp droit des deux yeux : c’est une HLH droite.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    /* les deux champs visuels, moitié droite amputée */
    [['Œil droit', 150], ['Œil gauche', 316]].forEach(function (o) {
      var cx = o[1], cy = 160, r = 58;
      kids.push(S('circle', { cx: cx, cy: cy, r: r,
        fill: 'var(--surface-3)', stroke: 'var(--line-hard)', 'stroke-width': 1.2 }));
      kids.push(S('path', {
        d: 'M ' + cx + ' ' + (cy - r) + ' A ' + r + ' ' + r + ' 0 0 1 ' + cx + ' ' + (cy + r) + ' Z',
        fill: 'color-mix(in srgb, var(--red) 30%, transparent)'
      }));
      kids.push(ligne(cx, cy - r, cx, cy + r, { c: 'var(--line-hard)', w: 1 }));
      kids.push(S('circle', { cx: cx, cy: cy, r: 3, fill: 'var(--txt-2)' }));
      kids.push(txt(cx, cy + r + 22, o[0], { anchor: 'middle', size: 11.5, bold: true, fill: 'var(--txt-2)' }));
    });
    kids.push(txt(233, 96, 'hémichamp aveugle', { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--red)' }));

    /* la conséquence sur la lecture, qui dépend du côté */
    var X = 400;
    kids.push(txt(X, 106, 'Ce que la lecture devient', { size: 12, bold: true, fill: 'var(--txt)' }));
    [{ t: 'HLH droite', d: 'gêne la progression : on ne voit pas la suite du mot', c: 'var(--amber)' },
     { t: 'HLH gauche', d: 'gêne le retour à la ligne : on perd le début', c: 'var(--blue)' }
    ].forEach(function (b, i) {
      var y = 124 + i * 68;
      kids.push(S('rect', { x: X, y: y, width: 182, height: 58, rx: 6,
        fill: 'color-mix(in srgb, ' + b.c + ' 11%, transparent)', stroke: b.c, 'stroke-width': 1.1 }));
      kids.push(txt(X + 14, y + 20, b.t, { size: 11.5, bold: true, fill: b.c }));
      couper(b.d, 32).forEach(function (l, k) {
        kids.push(txt(X + 14, y + 36 + k * 12, l, { size: 9.5, fill: 'var(--txt-2)' }));
      });
    });

    kids.push(ligne(58, 258, 582, 258, { c: 'var(--line-soft)' }));
    kids.push(txt(58, 284, 'Le déficit est irréversible : on rééduque la compensation, pas le champ.',
      { size: 11.5, bold: true, fill: 'var(--txt)' }));
    ['Balayage systématique vers l’hémichamp aveugle, avant tout le reste',
     'Agrandissement volontaire des saccades d’exploration',
     'Objectifs concrets : le trottoir, le supermarché, un texte — jamais « le champ visuel »'
    ].forEach(function (l, i) {
      kids.push(txt(58, 308 + i * 22, '·  ' + l, { size: 11, fill: 'var(--txt-2)' }));
    });

    return svg(640, 388, 'Hémianopsie latérale homonyme et compensation', kids);
  }

  /* ============================================================
     63 · Le scotome et la fixation excentrée
     ============================================================
     Le patient trouve seul un locus rétinien préférentiel ; notre
     travail est de le repérer, de le déplacer si sa position gêne
     la lecture, puis de l'automatiser.
     ============================================================ */
  function scotome() {
    var kids = [];
    var cx = 200, cy = 176, r = 96;

    kids.push(txt(58, 44, 'Le patient trouve son locus tout seul — on le place, on le stabilise',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'C’est le cœur de la rééducation maculaire : on ne récupère pas la macula, on en choisit une autre.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    kids.push(S('circle', { cx: cx, cy: cy, r: r,
      fill: 'var(--surface-3)', stroke: 'var(--line)', 'stroke-width': 1 }));
    /* le scotome central */
    kids.push(S('circle', { cx: cx, cy: cy, r: 40,
      fill: 'color-mix(in srgb, var(--red) 34%, transparent)',
      stroke: 'var(--red)', 'stroke-width': 1.4, 'stroke-dasharray': '4 3' }));
    kids.push(txt(cx, cy + 4, 'scotome', { anchor: 'middle', size: 11, bold: true, fill: 'var(--red)' }));

    /* le locus préférentiel, placé sous le scotome : en français on lit de
       gauche à droite, et un locus au-dessus masque la ligne en cours */
    kids.push(S('circle', { cx: cx - 22, cy: cy + 58, r: 13,
      fill: 'color-mix(in srgb, var(--accent) 40%, transparent)',
      stroke: 'var(--accent)', 'stroke-width': 1.6 }));
    kids.push(txt(cx - 22, cy + 92, 'locus préférentiel', { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--accent)' }));
    kids.push(ligne(cx - 14, cy + 46, cx - 6, cy + 22, { c: 'var(--accent)', w: 1.2, dash: '3 3' }));

    var X = 336;
    kids.push(txt(X, 106, 'Trois temps, dans cet ordre', { size: 12, bold: true, fill: 'var(--txt)' }));
    [['Repérer', 'grille d’Amsler, microperimétrie, observation de la fixation'],
     ['Placer', 'de préférence sous ou à gauche du scotome, pour lire en français'],
     ['Automatiser', 'le stabiliser, puis l’oublier — sinon il faut y penser à chaque mot']
    ].forEach(function (b, i) {
      var y = 128 + i * 64;
      kids.push(S('circle', { cx: X + 14, cy: y + 12, r: 12,
        fill: 'color-mix(in srgb, var(--accent) 22%, transparent)',
        stroke: 'var(--accent)', 'stroke-width': 1.3 }));
      kids.push(txt(X + 14, y + 16, String(i + 1), { anchor: 'middle', size: 11, bold: true, fill: 'var(--accent)' }));
      kids.push(txt(X + 36, y + 10, b[0], { size: 11.5, bold: true, fill: 'var(--txt)' }));
      couper(b[1], 38).forEach(function (l, k) {
        kids.push(txt(X + 36, y + 26 + k * 12, l, { size: 9.5, fill: 'var(--txt-3)' }));
      });
    });

    return svg(640, 340, 'Scotome central et locus rétinien préférentiel', kids);
  }

  /* ============================================================
     64 · Nystagmus congénital ou acquis
     ============================================================
     Une seule question décide de la suite : le patient a-t-il des
     oscillopsies ? Congénital, le cerveau a appris à compenser ;
     acquis, il n'a pas eu le temps — et cela impose un bilan.
     ============================================================ */
  function nystagmus() {
    var kids = [];

    kids.push(txt(58, 44, 'Une seule question fait le tri : y a-t-il des oscillopsies ?',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'C’est le sens de la phase rapide qui donne son nom au nystagmus.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    /* les deux tracés : pendulaire et à ressort */
    [['Pendulaire', 96, 'var(--blue)', true], ['À ressort', 330, 'var(--violet)', false]]
      .forEach(function (t) {
        var x0 = t[1], w = 190, y = 128;
        kids.push(txt(x0, 98, t[0], { size: 11.5, bold: true, fill: t[2] }));
        var d = 'M ' + x0 + ' ' + y;
        if (t[3]) {
          for (var i = 0; i <= 190; i += 2) {
            d += ' L ' + (x0 + i) + ' ' + (y + 18 * Math.sin(i / 15));
          }
        } else {
          for (var k = 0; k < 4; k++) {
            d += ' L ' + (x0 + k * 48 + 38) + ' ' + (y + 18) + ' L ' + (x0 + k * 48 + 48) + ' ' + (y - 18);
          }
        }
        kids.push(S('path', { d: d, fill: 'none', stroke: t[2], 'stroke-width': 2 }));
        kids.push(txt(x0, 168, t[3] ? 'oscillation symétrique' : 'dérive lente, retour rapide',
          { size: 9.5, italic: true, fill: 'var(--txt-3)' }));
      });

    [{ t: 'Congénital', c: 'var(--accent)',
       s: ['Pas d’oscillopsie : le cerveau a appris à compenser',
           'Zone neutre, souvent avec torticolis compensateur',
           'Fréquemment amélioré par la convergence',
           'Prise en charge orthoptique et optique'] },
     { t: 'Acquis', c: 'var(--red)',
       s: ['Oscillopsies : le monde bouge, et c’est invalidant',
           'Instabilité, souvent vestibulaire ou centrale',
           'Apparition datable — le patient sait quand',
           'Impose un bilan neurologique, sans délai'] }
    ].forEach(function (b, i) {
      var y = 202 + i * 104;
      kids.push(S('rect', { x: 58, y: y, width: 524, height: 92, rx: 7,
        fill: 'color-mix(in srgb, ' + b.c + ' 9%, transparent)', stroke: b.c, 'stroke-width': 1.1 }));
      kids.push(txt(76, y + 24, b.t, { size: 12.5, bold: true, fill: b.c }));
      b.s.forEach(function (l, k) {
        kids.push(txt(76 + (k % 2) * 268, y + 46 + Math.floor(k / 2) * 18, '· ' + l,
          { size: 9.5, fill: 'var(--txt-2)' }));
      });
    });

    return svg(640, 424, 'Nystagmus congénital et nystagmus acquis', kids);
  }

  /* ============================================================
     65 · Le poste de travail sur écran
     ============================================================
     Trois réglages qui ne coûtent rien règlent la moitié des
     plaintes de fatigue visuelle. Encore faut-il les avoir vus
     posés sur un dessin, cotés.
     ============================================================ */
  function ecran() {
    var kids = [];
    var sol = 300, xT = 300;

    kids.push(txt(58, 44, 'Trois réglages qui ne coûtent rien', { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'L’ergonomie visuelle et l’ergonomie posturale ne se séparent pas.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    /* le bureau */
    kids.push(ligne(150, 232, 470, 232, { c: 'var(--line-hard)', w: 2 }));
    /* l'écran, incliné, bord supérieur à hauteur des yeux */
    kids.push(S('rect', { x: xT + 60, y: 146, width: 14, height: 86, rx: 3,
      fill: 'color-mix(in srgb, var(--blue) 24%, transparent)', stroke: 'var(--blue)', 'stroke-width': 1.4 }));
    /* la tête et l'œil */
    kids.push(S('circle', { cx: 200, cy: 150, r: 26,
      fill: 'var(--surface-3)', stroke: 'var(--line-hard)', 'stroke-width': 1.3 }));
    kids.push(S('circle', { cx: 220, cy: 146, r: 4, fill: 'var(--accent)' }));
    kids.push(ligne(200, 176, 200, 232, { c: 'var(--line-hard)', w: 1.6 }));

    /* la ligne de regard, légèrement descendante */
    kids.push(ligne(224, 148, xT + 58, 168, { c: 'var(--accent)', w: 1.6, arrow: true }));
    kids.push(ligne(224, 146, xT + 58, 146, { c: 'var(--line-soft)', w: 0.9, dash: '3 3' }));
    kids.push(txt(300, 122, 'regard légèrement descendant', { anchor: 'middle', size: 10, italic: true, fill: 'var(--txt-3)' }));

    /* la cote de distance */
    kids.push(ligne(224, 252, xT + 60, 252, { c: 'var(--amber)', w: 1.2 }));
    kids.push(ligne(224, 246, 224, 258, { c: 'var(--amber)', w: 1.2 }));
    kids.push(ligne(xT + 60, 246, xT + 60, 258, { c: 'var(--amber)', w: 1.2 }));
    kids.push(txt(292, 272, '50 à 70 cm', { anchor: 'middle', size: 11, bold: true, fill: 'var(--amber)' }));

    kids.push(txt(xT + 84, 140, 'bord supérieur à hauteur', { size: 10, fill: 'var(--txt-3)' }));
    kids.push(txt(xT + 84, 154, 'des yeux, ou en dessous', { size: 10, fill: 'var(--txt-3)' }));

    kids.push(ligne(58, sol + 16, 582, sol + 16, { c: 'var(--line-soft)' }));
    [['Perpendiculaire aux fenêtres', 'ni face à la lumière, ni dos à elle : le reflet est la première cause de plainte'],
     ['Texte assez grand, contraste élevé', 'agrandir le texte coûte moins qu’un verre de plus'],
     ['Luminosité de l’écran ajustée à la pièce', 'un écran plus lumineux que la pièce fatigue en une heure']
    ].forEach(function (l, i) {
      kids.push(txt(58, sol + 44 + i * 30, '·  ' + l[0], { size: 11.5, bold: true, fill: 'var(--txt)' }));
      kids.push(txt(72, sol + 58 + i * 30, l[1], { size: 9.5, fill: 'var(--txt-3)' }));
    });

    return svg(640, 448, 'Le poste de travail sur écran, coté', kids);
  }

  /* ============================================================
     66 · Affaiblir ou renforcer un muscle
     ============================================================
     Deux gestes symétriques, et un troisième qui n'agit que dans
     le champ d'action du muscle. Le vocabulaire s'échange sans
     arrêt à l'oral : le dessin le fixe.
     ============================================================ */
  function chirurgie() {
    var kids = [];

    kids.push(txt(58, 44, 'Affaiblir, renforcer — deux gestes symétriques',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Ordre de grandeur : 2 à 3 Δ corrigés par millimètre sur un droit horizontal.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    /* Un droit s'insère EN AVANT, près du limbe, et court vers l'arrière
       jusqu'à l'apex. Un recul déplace donc l'insertion vers l'ARRIÈRE —
       loin de la cornée. Dessiner l'inverse, c'est enseigner l'inverse. */
    var cas = [
      { t: 'Normal', c: 'var(--violet)', ins: 24, debut: -100,
        d: 'insertion à sa place, près du limbe' },
      { t: 'Recul', c: 'var(--blue)', ins: -2, debut: -100,
        d: 'l’insertion recule loin du limbe : le muscle tire moins' },
      { t: 'Résection', c: 'var(--amber)', ins: 24, debut: -74,
        d: 'le muscle est raccourci, l’insertion ne bouge pas : il tire davantage' }
    ];

    cas.forEach(function (k, i) {
      var cx = 148 + i * 172, cy = 190, r = 42, ym = cy - 36;

      kids.push(txt(cx, 108, k.t, { anchor: 'middle', size: 12.5, bold: true, fill: k.c }));

      kids.push(S('circle', { cx: cx, cy: cy, r: r,
        fill: 'var(--surface-3)', stroke: 'var(--line-hard)', 'stroke-width': 1.2 }));
      /* la cornée à droite : c'est elle qui donne le sens « avant » */
      kids.push(S('path', { d: 'M ' + (cx + 34) + ' ' + (cy - 24) + ' A 42 42 0 0 1 ' + (cx + 34) + ' ' + (cy + 24),
        fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.4 }));
      kids.push(txt(cx + 46, cy + 4, 'avant', { size: 8.5, fill: 'var(--txt-3)' }));

      /* le muscle, posé au-dessus du globe, de l'apex à son insertion */
      kids.push(S('rect', { x: cx + k.debut, y: ym - 5, width: k.ins - k.debut, height: 10, rx: 3,
        fill: 'color-mix(in srgb, ' + k.c + ' 30%, transparent)', stroke: k.c, 'stroke-width': 1.2 }));
      kids.push(S('circle', { cx: cx + k.ins, cy: ym, r: 4.5, fill: k.c }));
      kids.push(ligne(cx + k.ins, ym + 5, cx + k.ins, cy - 26, { c: k.c, w: 1 }));

      /* la position d'origine, en repère, quand elle a bougé */
      if (k.ins !== 24) {
        kids.push(ligne(cx + 24, ym - 14, cx + 24, ym + 12, { c: 'var(--txt-3)', w: 1, dash: '2 3' }));
        kids.push(ligne(cx + k.ins, ym - 18, cx + 24, ym - 18, { c: k.c, w: 1.2 }));
        kids.push(txt(cx + 11, ym - 24, 'recul', { anchor: 'middle', size: 9, fill: k.c }));
      }
      if (k.debut !== -100) {
        kids.push(ligne(cx - 100, ym - 18, cx + k.debut, ym - 18, { c: k.c, w: 1.2 }));
        kids.push(txt(cx - 87, ym - 24, 'raccourci', { anchor: 'middle', size: 9, fill: k.c }));
      }
    });

    cas.forEach(function (k, i) {
      kids.push(txt(58, 268 + i * 24, '·', { size: 12, bold: true, fill: k.c }));
      kids.push(txt(74, 268 + i * 24, k.t + ' — ' + k.d, { size: 11, fill: 'var(--txt-2)' }));
    });

    kids.push(ligne(58, 350, 582, 350, { c: 'var(--line-soft)' }));
    kids.push(txt(58, 376, 'Les autres gestes du répertoire', { size: 11.5, bold: true, fill: 'var(--txt)' }));
    [['Myectomie', 'affaiblissement définitif'], ['Fil de Cüppers', 'n’agit que dans le champ d’action du muscle'],
     ['Plissement', 'renforcement réversible'], ['Transposition', 'Hummelsheim, Jensen — dans les paralysies']
    ].forEach(function (l, i) {
      kids.push(txt(58 + (i % 2) * 268, 398 + Math.floor(i / 2) * 20, '· ' + l[0] + ' : ' + l[1],
        { size: 10, fill: 'var(--txt-3)' }));
    });

    return svg(640, 446, 'Recul, résection et les autres gestes', kids);
  }

  /* ============================================================
     67 · Les niveaux de preuve
     ============================================================
     Une pyramide, parce que la forme dit déjà l'essentiel : plus
     on monte, plus c'est solide — et plus c'est rare.
     ============================================================ */
  function preuve() {
    var kids = [];
    var etages = [
      { t: 'Revue systématique, méta-analyse', c: 'var(--accent)', l: 150 },
      { t: 'Essai randomisé contrôlé', c: 'var(--blue)', l: 230 },
      { t: 'Étude de cohorte', c: 'var(--violet)', l: 310 },
      { t: 'Cas-témoins', c: 'var(--amber)', l: 390 },
      { t: 'Série de cas', c: 'var(--red)', l: 470 },
      { t: 'Avis d’expert', c: 'var(--txt-3)', l: 470 }
    ];
    var cx = 300, y0 = 96, h = 40;

    kids.push(txt(58, 44, 'Plus on monte, plus c’est solide — et plus c’est rare',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Ce n’est pas le sujet de l’article qui fait sa valeur, c’est son plan.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    etages.forEach(function (e, i) {
      var y = y0 + i * h;
      kids.push(S('rect', { x: cx - e.l / 2, y: y, width: e.l, height: h - 5, rx: 4,
        fill: 'color-mix(in srgb, ' + e.c + ' 16%, transparent)', stroke: e.c, 'stroke-width': 1.1 }));
      kids.push(txt(cx, y + 23, e.t, { anchor: 'middle', size: 11.5, bold: true, fill: e.c }));
    });

    kids.push(ligne(58, y0 + 6 * h + 14, 582, y0 + 6 * h + 14, { c: 'var(--line-soft)' }));
    kids.push(txt(58, y0 + 6 * h + 42, 'Un seul style de citation, tenu du début à la fin — Vancouver le plus souvent en santé.',
      { size: 11, fill: 'var(--txt-2)' }));
    kids.push(txt(58, y0 + 6 * h + 62, 'Et un gestionnaire de références alimenté dès la première lecture, jamais à la fin.',
      { size: 11, bold: true, fill: 'var(--amber)' }));

    return svg(640, y0 + 6 * h + 92, 'La pyramide des niveaux de preuve', kids);
  }

  /* ============================================================
     68 · Le décret d'actes
     ============================================================
     Toute question d'exercice se ramène à trois vérifications.
     Les poser dans l'ordre, c'est se protéger.
     ============================================================ */
  function decret() {
    var kids = [];

    kids.push(txt(58, 44, 'Trois questions, dans cet ordre', { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'C’est le décret d’actes qui dit ce qu’un orthoptiste peut faire, et à quelles conditions.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [{ q: 'L’acte figure-t-il au décret ?', r: 'Sinon, il n’existe pas pour vous — quelle que soit votre compétence.', c: 'var(--accent)' },
     { q: 'Sous quelle condition ?', r: 'Prescription médicale, protocole de coopération, ou autonomie encadrée.', c: 'var(--blue)' },
     { q: 'Suis-je compétent aujourd’hui ?', r: 'Le décret autorise ; il n’oblige pas. Un acte qu’on ne maîtrise plus se refuse.', c: 'var(--violet)' }
    ].forEach(function (b, i) {
      var y = 96 + i * 74;
      kids.push(S('circle', { cx: 78, cy: y + 26, r: 15,
        fill: 'color-mix(in srgb, ' + b.c + ' 22%, transparent)', stroke: b.c, 'stroke-width': 1.4 }));
      kids.push(txt(78, y + 31, String(i + 1), { anchor: 'middle', size: 13, bold: true, fill: b.c }));
      kids.push(txt(108, y + 20, b.q, { size: 12.5, bold: true, fill: 'var(--txt)' }));
      kids.push(txt(108, y + 40, b.r, { size: 10.5, fill: 'var(--txt-3)' }));
      if (i < 2) kids.push(ligne(78, y + 44, 78, y + 70, { c: 'var(--line)', w: 1, dash: '3 3' }));
    });

    var y = 330;
    kids.push(S('rect', { x: 58, y: y, width: 524, height: 62, rx: 7,
      fill: 'color-mix(in srgb, var(--red) 10%, transparent)', stroke: 'var(--red)', 'stroke-width': 1.2 }));
    kids.push(txt(78, y + 26, 'Sortir de ce cadre, c’est un exercice illégal', { size: 12.5, bold: true, fill: 'var(--red)' }));
    kids.push(txt(78, y + 46, 'Ce n’est pas une faute technique : c’est une faute de périmètre, et elle est pénale.',
      { size: 10.5, fill: 'var(--txt-2)' }));

    return svg(640, 418, 'Le décret d’actes et les trois vérifications', kids);
  }

  /* ============================================================
     69 · La chaîne de survie
     ============================================================
     Quatre maillons et une hiérarchie : le massage prime sur
     tout, et il ne s'interrompt presque jamais.
     ============================================================ */
  function survie() {
    var kids = [];
    var maillons = [
      { t: 'Reconnaître', d: 'inconscience, pas de respiration normale', c: 'var(--accent)' },
      { t: 'Alerter', d: '15 ou 112, sans quitter la victime', c: 'var(--blue)' },
      { t: 'Masser', d: '30 compressions / 2 insufflations', c: 'var(--red)' },
      { t: 'Défibriller', d: 'dès que le DAE arrive', c: 'var(--violet)' }
    ];
    var x0 = 128, pas = 132, y = 140;

    kids.push(txt(58, 44, 'Quatre maillons, et un seul qui prime', { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Le massage passe avant tout le reste, et ne s’interrompt presque jamais.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    maillons.forEach(function (m, i) {
      var x = x0 + i * pas;
      kids.push(S('circle', { cx: x, cy: y, r: 30,
        fill: 'color-mix(in srgb, ' + m.c + ' 18%, transparent)', stroke: m.c, 'stroke-width': 1.6 }));
      kids.push(txt(x, y + 6, String(i + 1), { anchor: 'middle', size: 18, bold: true, fill: m.c }));
      kids.push(txt(x, y + 52, m.t, { anchor: 'middle', size: 12, bold: true, fill: m.c }));
      couper(m.d, 22).forEach(function (l, k) {
        kids.push(txt(x, y + 70 + k * 13, l, { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));
      });
      if (i < 3) kids.push(ligne(x + 34, y, x + pas - 34, y, { c: 'var(--line-hard)', w: 1.4, arrow: true }));
    });

    kids.push(ligne(58, 268, 582, 268, { c: 'var(--line-soft)' }));
    kids.push(txt(58, 296, 'Les chiffres du massage', { size: 11.5, bold: true, fill: 'var(--txt)' }));
    [['100 à 120', 'compressions par minute'], ['5 à 6 cm', 'de profondeur'], ['30 / 2', 'compressions / insufflations']]
      .forEach(function (l, i) {
        var x = 58 + i * 180;
        kids.push(txt(x, 326, l[0], { size: 17, bold: true, fill: 'var(--red)' }));
        kids.push(txt(x, 344, l[1], { size: 10, fill: 'var(--txt-3)' }));
      });

    return svg(640, 372, 'La chaîne de survie et les chiffres du massage', kids);
  }

  /* ============================================================
     70 · Le raisonnement clinique
     ============================================================
     Un bilan n'est pas une liste qu'on déroule : chaque test
     répond à une question posée avant lui. C'est ce qui sépare
     un professionnel d'un exécutant.
     ============================================================ */
  function raisonnement() {
    var kids = [];
    var etapes = [
      { t: 'Plainte', d: 'et depuis quand' },
      { t: 'Hypothèses', d: 'deux ou trois' },
      { t: 'Tests choisis', d: 'un test, une hypothèse' },
      { t: 'Diagnostic', d: 'nommé et daté' }
    ];
    var x0 = 116, pas = 140, y = 124;

    kids.push(txt(58, 44, 'Chaque test répond à une question posée avant lui',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Un bilan qu’on déroule n’est pas un raisonnement : c’est une liste.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    etapes.forEach(function (e, i) {
      var x = x0 + i * pas;
      kids.push(S('rect', { x: x - 58, y: y - 24, width: 116, height: 48, rx: 7,
        fill: 'var(--surface-3)', stroke: 'var(--line)', 'stroke-width': 0.9 }));
      kids.push(txt(x, y - 4, e.t, { anchor: 'middle', size: 11.5, bold: true, fill: 'var(--txt)' }));
      kids.push(txt(x, y + 13, e.d, { anchor: 'middle', size: 8.5, fill: 'var(--txt-3)' }));
      if (i < 3) kids.push(ligne(x + 60, y, x + pas - 62, y, { c: 'var(--line-hard)', w: 1.2, arrow: true }));
    });

    kids.push(txt(320, 198, 'ET UNE SEULE SORTIE, PARMI QUATRE', { anchor: 'middle', size: 9.5, bold: true, fill: 'var(--txt-3)' }));
    [{ t: 'Rééduquer', d: 'fonctionnel, rééducable, gênant', c: 'var(--accent)' },
     { t: 'Corriger', d: 'une amétropie explique la plainte', c: 'var(--blue)' },
     { t: 'Surveiller', d: 'infraclinique, ou en constitution', c: 'var(--violet)' },
     { t: 'Adresser', d: 'tout signe d’alarme', c: 'var(--red)' }
    ].forEach(function (b, i) {
      var x = 58 + i * 132;
      kids.push(S('rect', { x: x, y: 216, width: 124, height: 62, rx: 7,
        fill: 'color-mix(in srgb, ' + b.c + ' 12%, transparent)', stroke: b.c, 'stroke-width': 1.2 }));
      kids.push(txt(x + 62, 240, b.t, { anchor: 'middle', size: 12, bold: true, fill: b.c }));
      couper(b.d, 20).forEach(function (l, k) {
        kids.push(txt(x + 62, 256 + k * 12, l, { anchor: 'middle', size: 8.5, fill: 'var(--txt-3)' }));
      });
    });

    kids.push(txt(58, 312, 'Le diagnostic ne s’arrête pas au constat : il désigne laquelle, et dit pourquoi les trois autres sont écartées.',
      { size: 11, italic: true, fill: 'var(--txt-3)' }));

    return svg(640, 340, 'Le raisonnement clinique et ses quatre issues', kids);
  }

  /* ============================================================
     71 · Les signaux d'alerte
     ============================================================
     Sept signaux, une seule conduite. Ce ne sont pas des
     symptômes à interpréter : ce sont des sonnettes.
     ============================================================ */
  function alertes() {
    var kids = [];
    var S7 = [
      ['Baisse d’acuité brutale ou inexpliquée', 'le jour même'],
      ['Déficit campimétrique nouveau', 'le jour même'],
      ['Diplopie récente', 'le jour même'],
      ['Mydriase avec ptôsis', 'le jour même'],
      ['Œil rouge douloureux', 'le jour même'],
      ['Métamorphopsies récentes', 'sans délai'],
      ['Œdème papillaire', 'sans délai']
    ];

    kids.push(txt(58, 44, 'Sept signaux, une seule conduite : l’avis médical',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Ce ne sont pas des symptômes à interpréter — ce sont des sonnettes.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    S7.forEach(function (s, i) {
      var y = 94 + i * 38;
      var urgent = s[1] === 'le jour même';
      kids.push(S('rect', { x: 58, y: y, width: 524, height: 32, rx: 6,
        fill: urgent ? 'color-mix(in srgb, var(--red) 10%, transparent)' : 'color-mix(in srgb, var(--amber) 10%, transparent)',
        stroke: urgent ? 'var(--red)' : 'var(--amber)', 'stroke-width': 1 }));
      kids.push(txt(78, y + 21, s[0], { size: 11.5, bold: true, fill: 'var(--txt)' }));
      kids.push(txt(562, y + 21, s[1], { anchor: 'end', size: 10.5, bold: true,
        fill: urgent ? 'var(--red)' : 'var(--amber)' }));
    });

    kids.push(txt(58, 386, 'Programmer « un contrôle dans trois semaines » devant l’un d’eux, c’est faire du délai un facteur de pronostic.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    return svg(640, 412, 'Les sept signaux qui imposent un avis médical', kids);
  }

  /* ============================================================
     72 · Reconnaître un examen ininterprétable
     ============================================================
     Quatre vérifications avant de lire quoi que ce soit. Un OCT
     mal segmenté raconte une histoire cohérente et fausse — et
     rien n'avertit le lecteur.
     ============================================================ */
  function artefacts() {
    var kids = [];

    kids.push(txt(58, 44, 'Quatre vérifications avant de lire quoi que ce soit',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Un examen mal acquis raconte une histoire cohérente et fausse : rien n’avertit le lecteur.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [{ t: 'Indice de qualité du signal', d: 'sous le seuil de l’appareil, on ne conclut pas — on refait', c: 'var(--accent)' },
     { t: 'Centrage', d: 'décentré, les cartes d’épaisseur deviennent ininterprétables', c: 'var(--blue)' },
     { t: 'Mouvements', d: 'les artefacts de mouvement simulent des ruptures de couches', c: 'var(--violet)' },
     { t: 'Segmentation automatique', d: 'souvent fausse sur œdème et forte myopie : on vérifie les lignes à l’œil', c: 'var(--amber)' }
    ].forEach(function (b, i) {
      var y = 96 + i * 62;
      kids.push(S('rect', { x: 58, y: y, width: 524, height: 52, rx: 7,
        fill: 'color-mix(in srgb, ' + b.c + ' 9%, transparent)', stroke: b.c, 'stroke-width': 1.1 }));
      kids.push(S('circle', { cx: 84, cy: y + 26, r: 12,
        fill: 'color-mix(in srgb, ' + b.c + ' 24%, transparent)', stroke: b.c, 'stroke-width': 1.2 }));
      kids.push(txt(84, y + 30, String(i + 1), { anchor: 'middle', size: 11, bold: true, fill: b.c }));
      kids.push(txt(110, y + 22, b.t, { size: 12, bold: true, fill: 'var(--txt)' }));
      kids.push(txt(110, y + 39, b.d, { size: 10, fill: 'var(--txt-3)' }));
    });

    var y = 96 + 4 * 62 + 8;
    kids.push(ligne(58, y, 582, y, { c: 'var(--line-soft)' }));
    kids.push(txt(58, y + 26, 'Et jamais comparer deux examens d’appareils différents.',
      { size: 11.5, bold: true, fill: 'var(--red)' }));
    kids.push(txt(58, y + 44, 'Les normes, la segmentation et les cartes ne sont pas les mêmes : l’évolution qu’on croit voir est celle de la machine.',
      { size: 10.5, fill: 'var(--txt-2)' }));

    return svg(640, y + 72, 'Reconnaître un examen ininterprétable', kids);
  }

  /* ============================================================
     73 · Annoncer une mauvaise nouvelle
     ============================================================
     Six temps, et un seul piège — celui qui consiste à combler
     le silence. Ce qui est retenu d'une annonce, c'est l'attitude
     bien plus que le contenu.
     ============================================================ */
  function annonce() {
    var kids = [];
    var pas = [
      { t: 'Préparer le cadre', d: 'calme, assis, sans interruption ni téléphone' },
      { t: 'Demander ce qu’il sait', d: 'et ce qu’il veut savoir — les deux se demandent' },
      { t: 'Annoncer', d: 'en mots simples, sans détour et sans jargon' },
      { t: 'Se taire', d: 'laisser la place au choc : le silence fait partie du soin' },
      { t: 'Reformuler', d: 'ce qui a été compris, pas ce qui a été dit' },
      { t: 'Donner une suite', d: 'quelque chose de concret, et un rendez-vous' }
    ];

    kids.push(txt(58, 44, 'Six temps, et un seul piège', { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Ce qui est retenu d’une annonce, c’est l’attitude bien plus que le contenu.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    pas.forEach(function (p, i) {
      var y = 92 + i * 46;
      var fort = i === 3;
      kids.push(S('circle', { cx: 78, cy: y + 18, r: 13,
        fill: fort ? 'color-mix(in srgb, var(--accent) 26%, transparent)' : 'var(--surface-3)',
        stroke: fort ? 'var(--accent)' : 'var(--line)', 'stroke-width': fort ? 1.6 : 1 }));
      kids.push(txt(78, y + 23, String(i + 1), { anchor: 'middle', size: 12, bold: true,
        fill: fort ? 'var(--accent)' : 'var(--txt-2)' }));
      if (i < 5) kids.push(ligne(78, y + 33, 78, y + 44, { c: 'var(--line)', w: 1, dash: '3 3' }));
      kids.push(txt(106, y + 15, p.t, { size: 12.5, bold: true, fill: fort ? 'var(--accent)' : 'var(--txt)' }));
      kids.push(txt(106, y + 32, p.d, { size: 10.5, fill: 'var(--txt-3)' }));
    });

    var y = 92 + 6 * 46 + 8;
    kids.push(S('rect', { x: 58, y: y, width: 524, height: 58, rx: 7,
      fill: 'color-mix(in srgb, var(--red) 10%, transparent)', stroke: 'var(--red)', 'stroke-width': 1.2 }));
    kids.push(txt(78, y + 24, 'L’erreur la plus fréquente', { size: 12, bold: true, fill: 'var(--red)' }));
    kids.push(txt(78, y + 43, 'Combler le silence par un flot d’informations que personne n’entendra.',
      { size: 10.5, fill: 'var(--txt-2)' }));

    return svg(640, y + 86, 'Les six temps d’une annonce', kids);
  }

  /* ============================================================
     74 · PICO — la question avant le sujet
     ============================================================
     Un sujet trop large est la cause première d'échec d'un
     mémoire. PICO ne sert pas à faire savant : il sert à savoir
     si la question tient en un an.
     ============================================================ */
  function pico() {
    var kids = [];
    var L = [
      { l: 'P', t: 'Population', d: 'chez qui ? âge, pathologie, lieu de recrutement', c: 'var(--accent)' },
      { l: 'I', t: 'Intervention', d: 'quoi ? le geste, le test, le protocole étudié', c: 'var(--blue)' },
      { l: 'C', t: 'Comparaison', d: 'contre quoi ? l’autre méthode, ou rien', c: 'var(--violet)' },
      { l: 'O', t: 'Outcome', d: 'mesuré comment ? un critère unique, défini d’avance', c: 'var(--amber)' }
    ];

    kids.push(txt(58, 44, 'Un sujet trop large est la cause première d’échec',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'PICO ne sert pas à faire savant : il sert à savoir si la question tient en un an.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    L.forEach(function (b, i) {
      var y = 92 + i * 56;
      kids.push(S('rect', { x: 58, y: y, width: 44, height: 44, rx: 7,
        fill: 'color-mix(in srgb, ' + b.c + ' 22%, transparent)', stroke: b.c, 'stroke-width': 1.4 }));
      kids.push(txt(80, y + 30, b.l, { anchor: 'middle', size: 22, bold: true, fill: b.c }));
      kids.push(txt(118, y + 20, b.t, { size: 12.5, bold: true, fill: 'var(--txt)' }));
      kids.push(txt(118, y + 37, b.d, { size: 10.5, fill: 'var(--txt-3)' }));
    });

    var y = 92 + 4 * 56 + 10;
    kids.push(ligne(58, y, 582, y, { c: 'var(--line-soft)' }));
    kids.push(txt(58, y + 26, 'Et trois questions de faisabilité, posées le premier jour',
      { size: 11.5, bold: true, fill: 'var(--txt)' }));
    [['Combien de patients ?', 'et en combien de temps les verrez-vous vraiment'],
     ['Où ?', 'un seul lieu accessible vaut mieux que trois espérés'],
     ['Avec quel accord ?', 'c’est le délai que tout le monde sous-estime']
    ].forEach(function (l, i) {
      kids.push(txt(58 + i * 176, y + 52, l[0], { size: 11, bold: true, fill: 'var(--accent)' }));
      couper(l[1], 26).forEach(function (s, k) {
        kids.push(txt(58 + i * 176, y + 68 + k * 13, s, { size: 9.5, fill: 'var(--txt-3)' }));
      });
    });

    return svg(640, y + 112, 'La question PICO et sa faisabilité', kids);
  }

  /* ============================================================
     75 · Les deux pannes d'un parcours
     ============================================================
     Toujours les mêmes deux, et le même remède : un compte rendu
     daté et adressé. Ce n'est pas de l'administration, c'est ce
     qui empêche le parcours de se casser.
     ============================================================ */
  function parcours() {
    var kids = [];

    kids.push(txt(58, 44, 'Deux pannes seulement, et toujours les mêmes',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Une prise en charge se pense comme un parcours, pas comme une succession d’actes.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    /* la rupture : la chaîne s'arrête */
    kids.push(txt(58, 104, 'RUPTURE', { size: 10, bold: true, fill: 'var(--red)' }));
    kids.push(txt(58, 118, 'personne ne reprend la main après l’examen', { size: 9.5, fill: 'var(--txt-3)' }));
    ['Ophtalmologiste', 'Orthoptiste', '?'].forEach(function (n, i) {
      var x = 220 + i * 130;
      var mort = i === 2;
      kids.push(S('rect', { x: x - 56, y: 96, width: 112, height: 36, rx: 6,
        fill: mort ? 'transparent' : 'var(--surface-3)',
        stroke: mort ? 'var(--red)' : 'var(--line)', 'stroke-width': 1,
        'stroke-dasharray': mort ? '4 4' : null }));
      kids.push(txt(x, 119, n, { anchor: 'middle', size: 11, bold: mort,
        fill: mort ? 'var(--red)' : 'var(--txt)' }));
      if (i < 2) kids.push(ligne(x + 58, 114, x + 68, 114,
        { c: i === 1 ? 'var(--red)' : 'var(--line-hard)', w: 1.2, arrow: i === 0 }));
    });
    kids.push(txt(414, 152, '✕', { anchor: 'middle', size: 16, bold: true, fill: 'var(--red)' }));

    /* la redondance : trois fois le même bilan */
    kids.push(txt(58, 200, 'REDONDANCE', { size: 10, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(58, 214, 'trois professionnels refont le même bilan', { size: 9.5, fill: 'var(--txt-3)' }));
    [0, 1, 2].forEach(function (i) {
      var x = 220 + i * 130;
      kids.push(S('rect', { x: x - 56, y: 192, width: 112, height: 36, rx: 6,
        fill: 'color-mix(in srgb, var(--amber) 12%, transparent)',
        stroke: 'var(--amber)', 'stroke-width': 1 }));
      kids.push(txt(x, 215, 'même bilan', { anchor: 'middle', size: 10.5, fill: 'var(--amber)' }));
    });

    var y = 268;
    kids.push(S('rect', { x: 58, y: y, width: 524, height: 76, rx: 7,
      fill: 'color-mix(in srgb, var(--accent) 11%, transparent)', stroke: 'var(--accent)', 'stroke-width': 1.2 }));
    kids.push(txt(78, y + 26, 'Un compte rendu daté et adressé règle les deux',
      { size: 12.5, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(78, y + 46, 'Il dit qui a fait quoi et quand — donc qui doit reprendre la main, et ce qu’il est inutile de refaire.',
      { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(78, y + 64, 'Le reste — référent identifié, rôles explicites, points de synchronisation — en découle.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    return svg(640, 372, 'Les deux pannes d’un parcours de soins', kids);
  }

  /* ============================================================
     76 · Évaluation formative ou sommative
     ============================================================
     Les confondre transforme chaque remarque en sanction, et un
     stagiaire qui se croit noté en permanence cesse d'essayer.
     ============================================================ */
  function evaluation() {
    var kids = [];

    kids.push(txt(58, 44, 'Les confondre transforme chaque remarque en sanction',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Un stagiaire qui se croit noté en permanence cesse d’essayer — donc cesse d’apprendre.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [{ t: 'Formative', c: 'var(--accent)', q: 'Pendant',
       s: ['Elle accompagne et corrige en cours de route', 'Elle se répète, souvent, brièvement',
           'Elle ne compte pas dans la validation', 'Son but : faire progresser'] },
     { t: 'Sommative', c: 'var(--violet)', q: 'À la fin',
       s: ['Elle valide, une fois, à un moment donné', 'Elle s’appuie sur des critères annoncés d’avance',
           'Elle compte, et le stagiaire le sait', 'Son but : attester d’un niveau'] }
    ].forEach(function (b, i) {
      var x = 58 + i * 268;
      kids.push(S('rect', { x: x, y: 92, width: 254, height: 136, rx: 8,
        fill: 'color-mix(in srgb, ' + b.c + ' 10%, transparent)', stroke: b.c, 'stroke-width': 1.2 }));
      kids.push(txt(x + 18, 120, b.t, { size: 15, bold: true, fill: b.c }));
      kids.push(txt(x + 236, 120, b.q, { anchor: 'end', size: 10.5, italic: true, fill: 'var(--txt-3)' }));
      b.s.forEach(function (l, k) {
        couper(l, 40).forEach(function (m, j) {
          kids.push(txt(x + 18, 146 + k * 21 + j * 11, (j ? '   ' : '· ') + m, { size: 9.5, fill: 'var(--txt-2)' }));
        });
      });
    });

    var y = 250;
    kids.push(ligne(58, y, 582, y, { c: 'var(--line-soft)' }));
    kids.push(txt(58, y + 26, 'Un retour utile tient en quatre mots', { size: 11.5, bold: true, fill: 'var(--txt)' }));
    [['Descriptif', 'ce que vous avez vu, pas ce que vous en pensez'],
     ['Précis', 'un geste, un moment — pas « globalement »'],
     ['Immédiat', 'plus tard, il ne reste que le jugement'],
     ['Suivi', 'd’une proposition, sinon ce n’est qu’un constat']
    ].forEach(function (l, i) {
      var x = 58 + (i % 2) * 268;
      var yy = y + 52 + Math.floor(i / 2) * 38;
      kids.push(txt(x, yy, l[0], { size: 11.5, bold: true, fill: 'var(--accent)' }));
      kids.push(txt(x, yy + 15, l[1], { size: 9.5, fill: 'var(--txt-3)' }));
    });

    return svg(640, 388, 'Évaluation formative et évaluation sommative', kids);
  }

  /* ============================================================
     77 · Le test de l'éclairement alterné
     ============================================================
     L'examen le plus rentable du bilan neuro : trente secondes,
     aucun appareil, et il reste positif quand le fond d'œil est
     normal.
     ============================================================ */
  function pupille() {
    var kids = [];
    var cy = 150;

    kids.push(txt(58, 44, 'Trente secondes, aucun appareil, et il parle quand le fond d’œil se tait',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'On balaie la lampe d’un œil à l’autre, sans marquer de pause au milieu.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [{ t: 'Lampe sur l’œil sain', g: 4, d: 4, n: 'les deux pupilles se resserrent' },
     { t: 'Lampe sur l’œil atteint', g: 10, d: 10, n: 'les deux se dilatent — c’est le DPAR' }
    ].forEach(function (b, i) {
      var x0 = 130 + i * 300;
      kids.push(txt(x0, 92, b.t, { anchor: 'middle', size: 11.5, bold: true,
        fill: i ? 'var(--red)' : 'var(--accent)' }));
      [-52, 52].forEach(function (dx, k) {
        var cx = x0 + dx;
        kids.push(S('circle', { cx: cx, cy: cy, r: 26,
          fill: 'var(--surface-3)', stroke: 'var(--line-hard)', 'stroke-width': 1.2 }));
        kids.push(S('circle', { cx: cx, cy: cy, r: b.g,
          fill: i ? 'var(--red)' : 'var(--accent)' }));
        kids.push(txt(cx, cy + 42, k ? 'gauche' : 'droit', { anchor: 'middle', size: 9, fill: 'var(--txt-3)' }));
      });
      /* le faisceau, posé sur l'œil éclairé */
      var xe = x0 + (i ? 52 : -52);
      kids.push(ligne(xe, cy - 46, xe, cy - 32, { c: 'var(--amber)', w: 2, arrow: true }));
      kids.push(txt(x0, cy + 62, b.n, { anchor: 'middle', size: 10, italic: true,
        fill: i ? 'var(--red)' : 'var(--txt-3)' }));
    });

    kids.push(txt(320, 92, 'puis', { anchor: 'middle', size: 10, italic: true, fill: 'var(--txt-3)' }));
    kids.push(ligne(292, 150, 348, 150, { c: 'var(--line-hard)', w: 1.4, arrow: true }));

    var y = 250;
    kids.push(S('rect', { x: 58, y: y, width: 254, height: 84, rx: 7,
      fill: 'color-mix(in srgb, var(--accent) 10%, transparent)', stroke: 'var(--accent)', 'stroke-width': 1.1 }));
    kids.push(txt(76, y + 24, 'DPAR — signe de Marcus Gunn', { size: 11.5, bold: true, fill: 'var(--accent)' }));
    couper('Atteinte asymétrique du nerf optique, ou d’une rétine étendue. Présent même quand le fond d’œil est normal.', 42)
      .forEach(function (l, k) { kids.push(txt(76, y + 44 + k * 13, l, { size: 9.5, fill: 'var(--txt-2)' })); });

    kids.push(S('rect', { x: 328, y: y, width: 254, height: 84, rx: 7,
      fill: 'color-mix(in srgb, var(--red) 11%, transparent)', stroke: 'var(--red)', 'stroke-width': 1.3 }));
    kids.push(txt(346, y + 24, 'Mydriase aréflexique + ptôsis + diplopie', { size: 11.5, bold: true, fill: 'var(--red)' }));
    couper('Compression du III : imagerie en urgence, anévrisme de la communicante postérieure jusqu’à preuve du contraire.', 44)
      .forEach(function (l, k) { kids.push(txt(346, y + 44 + k * 13, l, { size: 9.5, fill: 'var(--txt-2)' })); });

    return svg(640, 362, 'Le test de l’éclairement alterné et ce qu’il révèle', kids);
  }

  /* ============================================================
     78 · Les trois pas de Parks
     ============================================================
     Trois questions, huit réponses possibles, un seul muscle au
     bout. C'est l'algorithme le plus mécanique de la strabologie
     — et le plus oublié le jour de l'épreuve.
     ============================================================ */
  function parks() {
    var kids = [];

    kids.push(txt(58, 44, 'Trois questions, un seul muscle au bout',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Chaque réponse divise par deux le nombre de muscles encore possibles.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [{ n: '1', q: 'Quel œil est le plus haut ?', r: 'Il reste quatre muscles : deux élévateurs de l’œil bas, deux abaisseurs de l’œil haut.', c: 'var(--accent)' },
     { n: '2', q: 'La déviation augmente dans quel regard, droit ou gauche ?', r: 'Il en reste deux : le droit vertical d’un côté, l’oblique de l’autre.', c: 'var(--blue)' },
     { n: '3', q: 'Elle augmente à l’inclinaison de quel côté ?', r: 'Manœuvre de Bielschowsky — il n’en reste qu’un.', c: 'var(--violet)' }
    ].forEach(function (b, i) {
      var y = 92 + i * 72;
      kids.push(S('rect', { x: 58, y: y, width: 524, height: 60, rx: 7,
        fill: 'color-mix(in srgb, ' + b.c + ' 9%, transparent)', stroke: b.c, 'stroke-width': 1.1 }));
      kids.push(S('circle', { cx: 88, cy: y + 30, r: 15,
        fill: 'color-mix(in srgb, ' + b.c + ' 24%, transparent)', stroke: b.c, 'stroke-width': 1.3 }));
      kids.push(txt(88, y + 35, b.n, { anchor: 'middle', size: 14, bold: true, fill: b.c }));
      kids.push(txt(118, y + 25, b.q, { size: 12, bold: true, fill: 'var(--txt)' }));
      kids.push(txt(118, y + 44, b.r, { size: 10, fill: 'var(--txt-3)' }));
      if (i < 2) kids.push(ligne(88, y + 60, 88, y + 72, { c: 'var(--line)', w: 1, dash: '3 3' }));
    });

    var y = 316;
    kids.push(S('rect', { x: 58, y: y, width: 524, height: 76, rx: 7,
      fill: 'var(--surface-3)', stroke: 'var(--line)', 'stroke-width': 1 }));
    kids.push(txt(78, y + 24, 'Un exemple déroulé', { size: 11.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(78, y + 44, 'Œil droit plus haut · majorée en regard gauche · majorée à l’inclinaison droite',
      { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(78, y + 63, '→ oblique supérieur droit : paralysie du IV droit.',
      { size: 11.5, bold: true, fill: 'var(--accent)' }));

    return svg(640, 420, 'Le test des trois pas de Parks', kids);
  }

  /* ============================================================
     79 · Quel test statistique
     ============================================================
     Deux questions suffisent à choisir : quelle nature de
     variable, et les groupes sont-ils appariés ? Le reste n'est
     que du vocabulaire.
     ============================================================ */
  function stats() {
    var kids = [];

    kids.push(txt(58, 44, 'Deux questions suffisent à choisir', { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Et une règle avant tout : décrire avant de tester.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    var col = ['Situation', 'Distribution normale', 'Sinon'];
    var lignes = [
      ['Deux groupes indépendants', 't de Student', 'Mann-Whitney'],
      ['Avant / après, mêmes patients', 't apparié', 'Wilcoxon'],
      ['Deux variables qualitatives', 'Khi-deux', 'Fisher (petits effectifs)'],
      ['Corrélation entre deux mesures', 'Pearson', 'Spearman']
    ];
    var x = [58, 268, 430], w = [204, 156, 152];

    col.forEach(function (c, i) {
      kids.push(txt(x[i] + 12, 108, c.toUpperCase(), { size: 9.5, bold: true, fill: 'var(--txt-3)' }));
    });
    lignes.forEach(function (l, k) {
      var y = 120 + k * 46;
      l.forEach(function (cell, i) {
        kids.push(S('rect', { x: x[i], y: y, width: w[i], height: 38, rx: 5,
          fill: i === 0 ? 'var(--surface-3)' : 'color-mix(in srgb, ' + (i === 1 ? 'var(--accent)' : 'var(--violet)') + ' 9%, transparent)',
          stroke: i === 0 ? 'var(--line)' : (i === 1 ? 'var(--accent)' : 'var(--violet)'), 'stroke-width': 0.9 }));
        couper(cell, i === 0 ? 30 : 22).forEach(function (m, j) {
          kids.push(txt(x[i] + 12, y + (j ? 18 : 24) + j * 12, m,
            { size: i === 0 ? 10.5 : 11, bold: i > 0,
              fill: i === 0 ? 'var(--txt-2)' : (i === 1 ? 'var(--accent)' : 'var(--violet)') }));
        });
      });
    });

    var y = 120 + 4 * 46 + 12;
    kids.push(ligne(58, y, 582, y, { c: 'var(--line-soft)' }));
    kids.push(txt(58, y + 26, 'Décrire avant de tester', { size: 11.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, y + 44, 'Moyenne et écart-type si la distribution est normale ; médiane et interquartiles sinon.',
      { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(58, y + 62, 'Un avant / après de rééducation est apparié : le test qui l’ignore surestime la différence.',
      { size: 10.5, bold: true, fill: 'var(--amber)' }));

    return svg(640, y + 92, 'Quel test statistique pour quelle situation', kids);
  }

  /* ============================================================
     80 · Pourquoi l'adulte voit double
     ============================================================
     La même déviation, deux âges, deux issues. La période
     sensible n'explique pas seulement l'amblyopie : elle explique
     aussi pourquoi une diplopie récente n'est jamais banale.
     ============================================================ */
  function diplopie() {
    var kids = [];

    kids.push(txt(58, 44, 'La même déviation, deux âges, deux issues',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Ce que l’enfant neutralise, l’adulte le subit — et c’est ce qui rend la diplopie précieuse.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [{ t: 'Enfant, avant la période sensible', c: 'var(--accent)',
       s: ['Le cerveau supprime l’image gênante : neutralisation',
           'Il peut aussi réorganiser la correspondance rétinienne',
           'Conséquence : pas de diplopie — mais une amblyopie possible',
           'La déviation passe inaperçue de l’enfant lui-même'] },
     { t: 'Adulte, après la période sensible', c: 'var(--red)',
       s: ['Plus de neutralisation possible : toute déviation nouvelle est vue',
           'Conséquence : diplopie, immédiate et invalidante',
           'C’est un symptôme, donc une information — pas seulement une gêne',
           'Une diplopie récente n’est jamais banale'] }
    ].forEach(function (b, i) {
      var y = 92 + i * 116;
      kids.push(S('rect', { x: 58, y: y, width: 524, height: 100, rx: 7,
        fill: 'color-mix(in srgb, ' + b.c + ' 9%, transparent)', stroke: b.c, 'stroke-width': 1.1 }));
      kids.push(txt(78, y + 26, b.t, { size: 12.5, bold: true, fill: b.c }));
      b.s.forEach(function (l, k) {
        kids.push(txt(78, y + 48 + k * 17, '· ' + l, { size: 10, fill: 'var(--txt-2)' }));
      });
    });

    var y = 336;
    kids.push(txt(58, y, 'Devant une diplopie récente, quatre choses à chercher tout de suite',
      { size: 11.5, bold: true, fill: 'var(--txt)' }));
    ['Dater précisément l’apparition', 'Chercher une incomitance',
     'Examiner la pupille', 'Chercher un ptôsis, un signe neurologique'
    ].forEach(function (l, i) {
      kids.push(txt(58 + (i % 2) * 268, y + 24 + Math.floor(i / 2) * 20, '· ' + l,
        { size: 10.5, fill: 'var(--txt-2)' }));
    });

    return svg(640, 412, 'Pourquoi l’enfant ne voit pas double, et l’adulte si', kids);
  }

  /* ============================================================
     81 · Les quatre acuités
     ============================================================
     Quatre notions qu'on appelle toutes « acuité », et qui ne se
     mesurent pas dans les mêmes ordres de grandeur. Les
     confondre fait dire des absurdités sur les limites de l'œil.
     ============================================================ */
  function acuites() {
    var kids = [];
    var x0 = 250, larg = 300, y0 = 108;
    /* échelle logarithmique de l'angle, de la seconde à la dizaine de minutes */
    function xDe(sec) { return x0 + larg * Math.log(sec / 2) / Math.log(300); }

    kids.push(txt(58, 44, 'Quatre notions, quatre ordres de grandeur',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Les confondre fait dire des absurdités sur les limites physiologiques de l’œil.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [[2, '2″'], [10, '10″'], [60, '1′'], [300, '5′']].forEach(function (g) {
      var x = xDe(g[0]);
      kids.push(ligne(x, y0 - 12, x, y0 + 4 * 46, { c: 'var(--line-soft)', w: 0.8 }));
      kids.push(txt(x, y0 - 20, g[1], { anchor: 'middle', size: 10, fill: 'var(--txt-3)' }));
    });
    /* dans la gouttière de gauche : centrée sur l’axe, elle masquait la graduation 1′ */
    kids.push(txt(58, 92, 'ANGLE MINIMAL PERÇU', { size: 9.5, bold: true, fill: 'var(--txt-3)' }));

    [{ n: 'Hyperacuité', v: 5, d: 'alignement, vernier', c: 'var(--violet)' },
     { n: 'Minimum visible', v: 10, d: 'détecter un point, un fil', c: 'var(--blue)' },
     { n: 'Minimum séparable', v: 60, d: 'résolution — c’est ce qu’on mesure', c: 'var(--accent)' },
     { n: 'Minimum reconnaissable', v: 300, d: 'identifier un optotype entier', c: 'var(--amber)' }
    ].forEach(function (b, i) {
      var y = y0 + 22 + i * 46;
      kids.push(txt(232, y - 2, b.n, { anchor: 'end', size: 12, bold: true, fill: b.c }));
      kids.push(txt(232, y + 14, b.d, { anchor: 'end', size: 9.5, fill: 'var(--txt-3)' }));
      kids.push(S('circle', { cx: xDe(b.v), cy: y, r: 7, fill: b.c }));
      kids.push(ligne(x0, y, xDe(b.v) - 8, y, { c: b.c, w: 1.4, dash: '3 3' }));
    });

    var y = y0 + 4 * 46 + 24;
    kids.push(ligne(58, y, 582, y, { c: 'var(--line-soft)' }));
    kids.push(txt(58, y + 26, 'L’hyperacuité est meilleure que la résolution — et ce n’est pas une contradiction',
      { size: 11.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, y + 44, 'Aligner deux traits n’exige pas de les séparer : le système visuel compare des positions moyennes,',
      { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(58, y + 62, 'ce qui descend bien au-dessous de la taille d’un cône.',
      { size: 10.5, fill: 'var(--txt-2)' }));

    return svg(640, y + 92, 'Les quatre acuités et leurs ordres de grandeur', kids);
  }

  /* ============================================================
     82 · Ce que la rééducation fait, et ne fait pas
     ============================================================
     Savoir ce qu'elle ne fait pas est aussi important que savoir
     ce qu'elle fait : c'est ce qui évite les promesses qu'on ne
     tiendra pas.
     ============================================================ */
  function reeduc() {
    var kids = [];
    var x0 = 300, larg = 250;

    kids.push(txt(58, 44, 'Ce qu’elle fait, ce qu’elle ne fait pas',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Savoir ce qu’elle ne fait pas est aussi important — c’est ce qui évite les promesses intenables.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [{ n: 'Insuffisance de convergence', p: 85, c: 'var(--accent)', t: '80 à 90 %' },
     { n: 'Troubles accommodatifs', p: 65, c: 'var(--blue)', t: 'bons résultats' },
     { n: 'Insuffisance de fusion', p: 60, c: 'var(--blue)', t: 'bons résultats' }
    ].forEach(function (b, i) {
      var y = 106 + i * 42;
      kids.push(txt(282, y + 4, b.n, { anchor: 'end', size: 11, bold: true, fill: b.c }));
      kids.push(S('rect', { x: x0, y: y - 10, width: larg * b.p / 100, height: 20, rx: 4,
        fill: 'color-mix(in srgb, ' + b.c + ' 30%, transparent)', stroke: b.c, 'stroke-width': 1.1 }));
      kids.push(txt(x0 + larg * b.p / 100 + 10, y + 5, b.t, { size: 10.5, bold: true, fill: b.c }));
    });

    var y = 244;
    kids.push(S('rect', { x: 58, y: y, width: 524, height: 96, rx: 7,
      fill: 'color-mix(in srgb, var(--red) 9%, transparent)', stroke: 'var(--red)', 'stroke-width': 1.2 }));
    kids.push(txt(78, y + 26, 'Ce qu’elle ne fait pas', { size: 12.5, bold: true, fill: 'var(--red)' }));
    ['Elle n’aligne pas un strabisme congénital',
     'Elle ne recrée pas une vision binoculaire absente depuis l’enfance',
     'Elle n’a aucun intérêt sur une presbytie installée'
    ].forEach(function (l, i) {
      kids.push(txt(78, y + 48 + i * 18, '· ' + l, { size: 10.5, fill: 'var(--txt-2)' }));
    });

    kids.push(txt(58, 366, 'L’annoncer d’emblée est ce qui construit l’alliance — pas ce qui la fragilise.',
      { size: 11, italic: true, fill: 'var(--txt-3)' }));

    return svg(640, 392, 'Ce que la rééducation orthoptique sait faire', kids);
  }

  /* ============================================================
     83 · L'interrogatoire oriente tout le reste
     ============================================================
     Le bilan qui suit dépend de ce qu'on a demandé avant. Deux
     réponses opposées à la même question envoient dans deux
     directions qui n'ont rien à voir.
     ============================================================ */
  function interrogatoire() {
    var kids = [];

    kids.push(txt(58, 44, 'Ce qu’on demande, et vers quoi cela oriente',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Le bilan qui suit dépend entièrement de ce qui a été demandé avant.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [{ q: 'Quand la gêne apparaît-elle ?', a: 'En fin de journée, en lecture', b: 'Permanente, tout le temps',
       ra: 'binocularité, accommodation', rb: 'organique — on cherche ailleurs' },
     { q: 'Depuis quand ?', a: 'Depuis toujours, ou l’enfance', b: 'Récente, datable au jour près',
       ra: 'trouble ancien, souvent compensé', rb: 'signal d’alerte : avis médical' },
     { q: 'Un œil ou les deux ?', a: 'Disparaît en fermant un œil', b: 'Persiste œil fermé',
       ra: 'diplopie binoculaire : oculomotricité', rb: 'diplopie monoculaire : optique, cornée, cristallin' }
    ].forEach(function (b, i) {
      var y = 92 + i * 106;
      kids.push(txt(58, y + 14, b.q, { size: 12, bold: true, fill: 'var(--txt)' }));
      [[b.a, b.ra, 'var(--accent)', 58], [b.b, b.rb, 'var(--amber)', 328]].forEach(function (c) {
        kids.push(S('rect', { x: c[3], y: y + 24, width: 254, height: 60, rx: 6,
          fill: 'color-mix(in srgb, ' + c[2] + ' 9%, transparent)', stroke: c[2], 'stroke-width': 1 }));
        couper(c[0], 34).forEach(function (l, k) {
          kids.push(txt(c[3] + 14, y + 44 + k * 13, l, { size: 10.5, bold: true, fill: 'var(--txt)' }));
        });
        kids.push(txt(c[3] + 14, y + 74, '→ ' + c[1], { size: 9.5, fill: c[2] }));
      });
    });

    return svg(640, 424, 'Ce que l’interrogatoire oriente, question par question', kids);
  }

  /* ============================================================
     84 · Deux OCT, deux questions
     ============================================================
     Le même appareil, deux acquisitions, deux usages qui n'ont
     rien à voir. Et dans le glaucome, le RNFL bouge avant le
     champ visuel — c'est tout l'intérêt de l'examen.
     ============================================================ */
  function octcoupe() {
    var kids = [];

    kids.push(txt(58, 44, 'Le même appareil, deux acquisitions, deux questions',
      { size: 12.5, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(58, 62, 'Et toujours vérifier la qualité du signal et la segmentation avant d’interpréter.',
      { size: 10.5, italic: true, fill: 'var(--txt-3)' }));

    [{ t: 'OCT maculaire', c: 'var(--accent)', q: 'La macula est-elle épaissie, décollée, trouée ?',
       s: ['Épaisseur maculaire', 'Logettes intrarétiniennes', 'Fluide sous-rétinien',
           'Membrane épirétinienne', 'Trou maculaire'] },
     { t: 'OCT du nerf optique', c: 'var(--violet)', q: 'Les fibres ont-elles commencé à disparaître ?',
       s: ['RNFL — couche des fibres', 'Complexe cellulaire ganglionnaire', 'Comparaison à la base de normes',
           'Suivi dans le temps, même appareil', 'Altéré souvent avant le champ visuel'] }
    ].forEach(function (b, i) {
      var x = 58 + i * 268;
      kids.push(S('rect', { x: x, y: 92, width: 254, height: 168, rx: 8,
        fill: 'color-mix(in srgb, ' + b.c + ' 9%, transparent)', stroke: b.c, 'stroke-width': 1.2 }));
      kids.push(txt(x + 18, 120, b.t, { size: 13, bold: true, fill: b.c }));
      couper(b.q, 34).forEach(function (l, k) {
        kids.push(txt(x + 18, 140 + k * 13, l, { size: 9.5, italic: true, fill: 'var(--txt-3)' }));
      });
      b.s.forEach(function (l, k) {
        couper(l, 32).forEach(function (m, j) {
          kids.push(txt(x + 18, 174 + k * 17 + j * 11, (j ? '   ' : '· ') + m, { size: 9.5, fill: 'var(--txt-2)' }));
        });
      });
    });

    var y = 282;
    kids.push(S('rect', { x: 58, y: y, width: 524, height: 58, rx: 7,
      fill: 'color-mix(in srgb, var(--amber) 10%, transparent)', stroke: 'var(--amber)', 'stroke-width': 1.2 }));
    kids.push(txt(78, y + 24, 'Dans le glaucome, le RNFL s’altère souvent avant le champ visuel',
      { size: 12, bold: true, fill: 'var(--amber)' }));
    kids.push(txt(78, y + 43, 'C’est ce décalage qui fait tout l’intérêt de l’OCT : il voit venir ce que la périmétrie constate.',
      { size: 10.5, fill: 'var(--txt-2)' }));

    return svg(640, 368, 'OCT maculaire et OCT du nerf optique', kids);
  }

  /* ============================================================
     Optique géométrique — les cinq schémas du cours de M. Bouloy
     ------------------------------------------------------------
     Ces cinq-là ne racontent pas l'œil : ils racontent la LUMIÈRE,
     et c'est le programme du cours d'UE02. On y retrouve les
     quatre objets que l'optique géométrique manipule — un dioptre
     plan (Descartes), un prisme, un miroir, un dioptre sphérique,
     une lentille — et rien d'autre, puisque tout le reste s'en
     déduit.

     Ils sont VIVANTS parce que ces lois ne se retiennent pas en
     les lisant. Personne ne retient « sin λ = n₂/n₁ » ; tout le
     monde retient le moment où, en poussant l'angle, le rayon
     réfracté disparaît d'un coup.

     Conventions du cours, tenues partout ici : la lumière va de
     la GAUCHE vers la DROITE, l'origine est au sommet S (ou au
     centre optique O), et les mesures sont ALGÉBRIQUES — un objet
     réel est à gauche, donc son abscisse est négative. C'est la
     source d'erreur numéro un, et la seule façon de ne pas s'y
     perdre est de ne jamais changer de convention en route.
     ============================================================ */

  var RAD = Math.PI / 180;
  function dec1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ','); }
  function dec2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ','); }

  /* Un axe optique avec son sommet : le décor commun à trois figures. */
  function axeOptique(x1, x2, y, kids) {
    kids.push(ligne(x1, y, x2, y, { c: 'var(--line-hard)', dash: '4 4', w: 1 }));
  }

  /* ------------------------------------------------------------
     1 · Descartes, et le moment où le rayon disparaît
     ------------------------------------------------------------ */
  function descartes(p) {
    var kids = [];
    var W = 640, H = 300, xi = 300, yi = 150, R = 128;
    var n1 = p.n1, n2 = p.n2, i1 = p.i1;

    /* les deux milieux */
    kids.push(S('rect', { x: 0, y: 0, width: W, height: yi,
      fill: 'color-mix(in srgb, var(--blue) 7%, transparent)' }));
    kids.push(S('rect', { x: 0, y: yi, width: W, height: H - yi,
      fill: 'color-mix(in srgb, var(--violet) 12%, transparent)' }));
    kids.push(ligne(0, yi, W, yi, { c: 'var(--txt-2)', w: 1.6 }));
    kids.push(txt(14, 24, 'milieu 1 · n₁ = ' + dec2(n1), { size: 12, bold: true, fill: 'var(--blue)' }));
    kids.push(txt(14, H - 12, 'milieu 2 · n₂ = ' + dec2(n2), { size: 12, bold: true, fill: 'var(--violet)' }));

    /* la normale */
    kids.push(ligne(xi, 18, xi, H - 18, { c: 'var(--txt-3)', dash: '5 5', w: 1 }));
    kids.push(txt(xi + 6, 28, 'normale', { size: 10, fill: 'var(--txt-3)' }));

    /* le rayon incident, tracé depuis le point d'incidence vers la gauche */
    var a = i1 * RAD;
    kids.push(ligne(xi - R * Math.sin(a), yi - R * Math.cos(a), xi, yi,
      { c: 'var(--blue)', w: 2, arrow: true }));
    kids.push(txt(xi - R * Math.sin(a) - 6, yi - R * Math.cos(a) - 6, 'incident',
      { size: 11, bold: true, anchor: 'end', fill: 'var(--blue)' }));

    /* le réfléchi existe toujours */
    kids.push(ligne(xi, yi, xi + R * Math.sin(a), yi - R * Math.cos(a),
      { c: 'var(--txt-3)', w: 1.4, dash: '4 3', arrow: true }));
    kids.push(txt(xi + R * Math.sin(a) + 6, yi - R * Math.cos(a) - 6, 'réfléchi (i′ = i₁)',
      { size: 10, fill: 'var(--txt-3)' }));

    /* le réfracté, s'il existe */
    var s2 = n1 * Math.sin(a) / n2;
    var totale = Math.abs(s2) > 1;
    if (!totale) {
      var i2 = Math.asin(s2);
      kids.push(ligne(xi, yi, xi + R * Math.sin(i2), yi + R * Math.cos(i2),
        { c: 'var(--green)', w: 2, arrow: true }));
      kids.push(txt(xi + R * Math.sin(i2) + 6, yi + R * Math.cos(i2) + 4,
        'réfracté · i₂ = ' + dec1(i2 / RAD) + '°',
        { size: 11, bold: true, fill: 'var(--green)' }));
    } else {
      kids.push(S('rect', { x: xi - 118, y: yi + 26, width: 236, height: 34, rx: 8,
        fill: 'color-mix(in srgb, var(--red) 14%, transparent)',
        stroke: 'var(--red)', 'stroke-width': 1.2 }));
      kids.push(txt(xi, yi + 48, 'RÉFLEXION TOTALE — plus aucun rayon transmis',
        { anchor: 'middle', size: 11.5, bold: true, fill: 'var(--red)' }));
    }

    /* l'angle limite, quand il existe */
    if (n1 > n2) {
      var lim = Math.asin(n2 / n1) / RAD;
      kids.push(ligne(xi - R * Math.sin(lim * RAD), yi - R * Math.cos(lim * RAD), xi, yi,
        { c: 'var(--amber)', w: 1.2, dash: '3 3' }));
      kids.push(txt(20, yi - 14, 'angle limite λ = ' + dec1(lim) + '°',
        { size: 11, bold: true, fill: 'var(--amber)' }));
    }

    kids.push(txt(xi - 10, yi - 22, 'i₁ = ' + dec1(i1) + '°',
      { anchor: 'end', size: 12, bold: true, fill: 'var(--blue)' }));
    return svg(W, H, 'Réfraction selon Descartes, jusqu’à la réflexion totale', kids);
  }

  /* ------------------------------------------------------------
     2 · Le prisme, du calcul exact à la dioptrie prismatique
     ------------------------------------------------------------ */
  function prismeGeo(p) {
    var kids = [];
    var W = 640, H = 300;
    var A = p.A, n = p.n, i = p.i;

    /* le triangle, arête en haut */
    var ax = 300, ay = 44, demi = 96 * Math.tan(A / 2 * RAD), by = 214;
    demi = Math.max(18, Math.min(120, demi));
    kids.push(S('path', {
      d: 'M ' + ax + ' ' + ay + ' L ' + (ax + demi) + ' ' + by + ' L ' + (ax - demi) + ' ' + by + ' Z',
      fill: 'color-mix(in srgb, var(--accent) 12%, transparent)',
      stroke: 'var(--accent)', 'stroke-width': 1.6
    }));
    kids.push(txt(ax, ay - 10, 'A = ' + dec1(A) + '°',
      { anchor: 'middle', size: 12, bold: true, fill: 'var(--accent)' }));
    kids.push(txt(ax, by + 18, 'base', { anchor: 'middle', size: 10, fill: 'var(--accent)' }));

    /* le calcul du cours : sin i = n sin r · A = r + r′ · n sin r′ = sin i′ */
    var r = Math.asin(Math.min(1, Math.sin(i * RAD) / n)) / RAD;
    var rp = A - r;
    var sortie = n * Math.sin(rp * RAD);
    var emerge = Math.abs(sortie) <= 1;
    var ip = emerge ? Math.asin(sortie) / RAD : null;
    var D = emerge ? i + ip - A : null;

    /* le trajet, simplifié : entrée à gauche, sortie à droite */
    var xe = ax - demi * 0.45, ye = (ay + by) / 2;
    var xs = ax + demi * 0.45;
    kids.push(ligne(60, ye - 30, xe, ye, { c: 'var(--blue)', w: 2, arrow: true }));
    kids.push(ligne(xe, ye, xs, ye + (r - rp) * 0.9, { c: 'var(--blue)', w: 2 }));
    if (emerge) {
      var chute = D * 2.6;
      kids.push(ligne(xs, ye + (r - rp) * 0.9, 590, ye + (r - rp) * 0.9 + chute,
        { c: 'var(--green)', w: 2, arrow: true }));
      kids.push(txt(586, Math.min(H - 8, ye + (r - rp) * 0.9 + chute + 16),
        'D = ' + dec1(D) + '°', { anchor: 'end', size: 12, bold: true, fill: 'var(--green)' }));
    } else {
      kids.push(txt(ax + demi + 12, ye, 'réflexion totale sur la face de sortie',
        { size: 11, bold: true, fill: 'var(--red)' }));
    }

    /* le tableau des angles */
    var lignes = [
      ['i', dec1(i) + '°'], ['r', dec1(r) + '°'],
      ['r′ = A − r', dec1(rp) + '°'],
      ['i′', emerge ? dec1(ip) + '°' : '—'],
      ['D = i + i′ − A', emerge ? dec1(D) + '°' : '—']
    ];
    kids.push(S('rect', { x: 24, y: 210, width: 190, height: 78, rx: 8,
      fill: 'var(--surface-2)', stroke: 'var(--line)', 'stroke-width': 1 }));
    lignes.forEach(function (l, k) {
      var y = 226 + k * 14;
      kids.push(txt(34, y, l[0], { size: 10, fill: 'var(--txt-2)' }));
      kids.push(txt(204, y, l[1], { size: 10, bold: true, anchor: 'end', fill: 'var(--txt)' }));
    });

    /* le petit-angle, celui de l'orthoptiste */
    var Dp = (n - 1) * A;
    kids.push(S('rect', { x: 404, y: 216, width: 212, height: 62, rx: 8,
      fill: 'color-mix(in srgb, var(--violet) 12%, transparent)',
      stroke: 'var(--violet)', 'stroke-width': 1.2 }));
    kids.push(txt(510, 234, 'petits angles : D = (n−1)A',
      { anchor: 'middle', size: 11, bold: true, fill: 'var(--violet)' }));
    kids.push(txt(510, 250, '= ' + dec1(Dp) + '°, soit ' + dec1(100 * Math.tan(Dp * RAD)) + ' Δ',
      { anchor: 'middle', size: 11.5, bold: true, fill: 'var(--violet)' }));
    kids.push(txt(510, 266, 'c’est la formule des barres de prismes',
      { anchor: 'middle', size: 9.5, fill: 'var(--txt-3)' }));

    return svg(W, H, 'Le prisme : angles, déviation, et la formule des petits angles', kids);
  }

  /* ------------------------------------------------------------
     3 · Le miroir sphérique
     ------------------------------------------------------------ */
  function miroirSpherique(p) {
    var kids = [];
    var W = 640, H = 280, S0 = 470, y0 = 150, ech = 3.2;
    var concave = p.type === 'concave';
    var R = p.R;                       /* rayon, en cm, toujours positif */
    var SC = concave ? -R : R;         /* le centre est à gauche si concave */
    var f = SC / 2;
    var SA = -p.d;                     /* objet réel : à gauche, donc négatif */
    var inv = 2 / SC - 1 / SA;
    var SAp = Math.abs(inv) < 1e-6 ? null : 1 / inv;
    var g = SAp === null ? null : -SAp / SA;

    axeOptique(30, W - 20, y0, kids);
    /* le miroir, arc de cercle */
    var sens = concave ? 1 : -1;
    kids.push(S('path', {
      d: 'M ' + S0 + ' ' + (y0 - 78) + ' Q ' + (S0 - sens * 34) + ' ' + y0 + ' ' + S0 + ' ' + (y0 + 78),
      fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.6
    }));
    kids.push(txt(S0 + 8, y0 + 16, 'S', { size: 12, bold: true, fill: 'var(--accent)' }));

    function pose(x, lab, col) {
      kids.push(S('circle', { cx: x, cy: y0, r: 3, fill: col }));
      kids.push(txt(x, y0 + 18, lab, { anchor: 'middle', size: 11, bold: true, fill: col }));
    }
    pose(S0 + SC * ech, 'C', 'var(--txt-3)');
    pose(S0 + f * ech, 'F', 'var(--amber)');

    /* l'objet */
    var xa = S0 + SA * ech, hb = 40;
    kids.push(ligne(xa, y0, xa, y0 - hb, { c: 'var(--blue)', w: 2.4, arrow: true }));
    kids.push(txt(xa, y0 + 18, 'A', { anchor: 'middle', size: 11, bold: true, fill: 'var(--blue)' }));
    kids.push(txt(xa - 4, y0 - hb - 6, 'B', { anchor: 'end', size: 11, bold: true, fill: 'var(--blue)' }));

    /* les deux rayons de construction */
    kids.push(ligne(xa, y0 - hb, S0, y0 - hb, { c: 'var(--blue)', w: 1.3 }));
    if (SAp !== null && g !== null) {
      var xap = S0 + SAp * ech, hbp = -g * hb;
      var reel = SAp < 0;
      kids.push(ligne(S0, y0 - hb, xap, y0 - hbp,
        { c: 'var(--blue)', w: 1.3, dash: reel ? null : '4 3' }));
      kids.push(ligne(xa, y0 - hb, xap, y0 - hbp,
        { c: 'var(--txt-3)', w: 1, dash: '3 3' }));
      kids.push(ligne(xap, y0, xap, y0 - hbp,
        { c: reel ? 'var(--green)' : 'var(--violet)', w: 2.4, arrow: true }));
      kids.push(txt(xap, y0 + (hbp > 0 ? 18 : -8), 'A′',
        { anchor: 'middle', size: 11, bold: true, fill: reel ? 'var(--green)' : 'var(--violet)' }));
    }

    kids.push(S('rect', { x: 24, y: 210, width: 300, height: 56, rx: 8,
      fill: 'var(--surface-2)', stroke: 'var(--line)' }));
    kids.push(txt(36, 228, 'miroir ' + (concave ? 'concave' : 'convexe') +
      ' · R = ' + R + ' cm · f = SF = ' + dec1(f) + ' cm',
      { size: 11, fill: 'var(--txt-2)' }));
    kids.push(txt(36, 244, '2/SC = 1/SA + 1/SA′', { size: 11, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(36, 259, SAp === null ? 'image à l’infini'
      : 'SA′ = ' + dec1(SAp) + ' cm · γ = ' + dec2(g) +
        ' · image ' + (SAp < 0 ? 'réelle' : 'virtuelle') + ', ' +
        (g < 0 ? 'renversée' : 'droite'),
      { size: 11, fill: 'var(--txt-2)' }));

    return svg(W, H, 'Miroir sphérique : construction et relation de conjugaison', kids);
  }

  /* ------------------------------------------------------------
     4 · Le dioptre sphérique — ce dont l'œil est fait
     ------------------------------------------------------------ */
  function dioptreSpherique(p) {
    var kids = [];
    var W = 640, H = 280, S0 = 300, y0 = 148, ech = 1.7;
    var n = p.n, np = p.np;
    /* Un curseur ne peut pas sauter le zéro, et un rayon nul n’existe pas :
       on donne donc le sens à part, ce qui reprend le vocabulaire du cours. */
    var R = p.sens === 'concave' ? -p.Rm : p.Rm;
    var SA = -p.d;
    /* relation du cours : n′/SA′ − n/SA = (n′ − n)/SC */
    var inv = (np - n) / R + n / SA;
    var SAp = Math.abs(inv) < 1e-9 ? null : np / inv;
    var g = SAp === null ? null : (n * SAp) / (np * SA);
    /* Sans saut d’indice il n’y a pas de dioptre : les foyers partent à
       l’infini et la vergence est nulle. Afficher « f′ = Infinity » serait
       plus faux qu’utile — on dit simplement qu’il ne se passe rien. */
    var neutre = Math.abs(np - n) < 1e-9;
    var fp = neutre ? null : np * R / (np - n);
    var fo = neutre ? null : -n * R / (np - n);
    var V = neutre ? 0 : (np - n) / (R / 100);   /* R en cm → dioptries */

    kids.push(S('rect', { x: 0, y: 0, width: S0, height: H,
      fill: 'color-mix(in srgb, var(--blue) 6%, transparent)' }));
    kids.push(S('rect', { x: S0, y: 0, width: W - S0, height: H,
      fill: 'color-mix(in srgb, var(--violet) 8%, transparent)' }));
    axeOptique(20, W - 20, y0, kids);

    /* le dioptre : un arc dont la concavité suit le signe de R */
    var sens = R > 0 ? -1 : 1;
    kids.push(S('path', {
      d: 'M ' + S0 + ' ' + (y0 - 82) + ' Q ' + (S0 + sens * 30) + ' ' + y0 + ' ' + S0 + ' ' + (y0 + 82),
      fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.6
    }));
    kids.push(txt(S0 - 6, y0 + 100, 'n = ' + dec2(n), { anchor: 'end', size: 11.5, bold: true, fill: 'var(--blue)' }));
    kids.push(txt(S0 + 6, y0 + 100, 'n′ = ' + dec2(np), { size: 11.5, bold: true, fill: 'var(--violet)' }));
    kids.push(txt(S0 + 6, y0 + 16, 'S', { size: 12, bold: true, fill: 'var(--accent)' }));

    function pose(v, lab, col) {
      var x = S0 + v * ech;
      if (x < 16 || x > W - 16) return;
      kids.push(S('circle', { cx: x, cy: y0, r: 3, fill: col }));
      kids.push(txt(x, y0 - 10, lab, { anchor: 'middle', size: 10.5, bold: true, fill: col }));
    }
    pose(R, 'C', 'var(--txt-3)');
    if (!neutre) { pose(fp, 'F′', 'var(--amber)'); pose(fo, 'F', 'var(--amber)'); }

    var xa = S0 + SA * ech, hb = 34;
    if (xa > 16) {
      kids.push(ligne(xa, y0, xa, y0 - hb, { c: 'var(--blue)', w: 2.4, arrow: true }));
      kids.push(txt(xa, y0 + 18, 'A', { anchor: 'middle', size: 11, bold: true, fill: 'var(--blue)' }));
    }
    if (SAp !== null && g !== null) {
      var xap = S0 + SAp * ech;
      if (xap > 16 && xap < W - 16) {
        var reel = SAp > 0;
        kids.push(ligne(xap, y0, xap, y0 - g * hb,
          { c: reel ? 'var(--green)' : 'var(--violet)', w: 2.4, arrow: true }));
        kids.push(txt(xap, y0 + (g > 0 ? 18 : -8), 'A′',
          { anchor: 'middle', size: 11, bold: true, fill: reel ? 'var(--green)' : 'var(--violet)' }));
      }
    }

    kids.push(S('rect', { x: 24, y: 208, width: 328, height: 58, rx: 8,
      fill: 'var(--surface-2)', stroke: 'var(--line)' }));
    kids.push(txt(36, 226, 'n′/SA′ − n/SA = (n′−n)/SC',
      { size: 11, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(36, 242, neutre ? 'n = n′ : aucun dioptre, la lumière passe tout droit'
      : 'SC = ' + dec1(R) + ' cm · f′ = ' + dec1(fp) + ' cm · f = ' + dec1(fo) + ' cm',
      { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(36, 257, neutre ? 'V = 0 D' : 'V = ' + dec2(V) + ' D · dioptre ' +
      (V > 0 ? 'convergent' : 'divergent') +
      (SAp === null ? '' : ' · γ = ' + dec2(g)), { size: 10.5, fill: 'var(--txt-2)' }));

    return svg(W, H, 'Dioptre sphérique : foyers, vergence et conjugaison', kids);
  }

  /* ------------------------------------------------------------
     5 · La lentille mince
     ------------------------------------------------------------ */
  function lentilleMince(p) {
    var kids = [];
    var W = 640, H = 280, O = 320, y0 = 148, ech = 3.4;
    /* même raison : le signe vient du type, la valeur du curseur */
    var fp = p.type === 'divergente' ? -p.fm : p.fm;
    var OA = -p.d;
    var inv = 1 / fp + 1 / OA;
    var OAp = Math.abs(inv) < 1e-9 ? null : 1 / inv;
    var g = OAp === null ? null : OAp / OA;
    var conv = fp > 0;

    axeOptique(20, W - 20, y0, kids);
    /* la lentille : deux pointes vers l'extérieur si convergente */
    var h = 74;
    kids.push(ligne(O, y0 - h, O, y0 + h, { c: 'var(--accent)', w: 2.6 }));
    /* Les pointes s’ouvrent vers l’EXTÉRIEUR pour une convergente, vers
       l’intérieur pour une divergente : c’est la convention, et une lentille
       dessinée à l’envers apprend le contraire de ce qu’on veut. */
    [[-1, y0 - h], [1, y0 + h]].forEach(function (t) {
      var dy = (conv ? -1 : 1) * t[0] * 9;
      kids.push(S('path', {
        d: 'M ' + (O - 9) + ' ' + (t[1] + dy) + ' L ' + O + ' ' + t[1] +
           ' L ' + (O + 9) + ' ' + (t[1] + dy),
        fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.2
      }));
    });
    kids.push(txt(O + 8, y0 + 16, 'O', { size: 12, bold: true, fill: 'var(--accent)' }));

    function pose(v, lab) {
      var x = O + v * ech;
      if (x < 16 || x > W - 16) return;
      kids.push(S('circle', { cx: x, cy: y0, r: 3, fill: 'var(--amber)' }));
      kids.push(txt(x, y0 - 10, lab, { anchor: 'middle', size: 10.5, bold: true, fill: 'var(--amber)' }));
    }
    pose(fp, 'F′');
    pose(-fp, 'F');

    var xa = O + OA * ech, hb = 38;
    kids.push(ligne(xa, y0, xa, y0 - hb, { c: 'var(--blue)', w: 2.4, arrow: true }));
    kids.push(txt(xa, y0 + 18, 'A', { anchor: 'middle', size: 11, bold: true, fill: 'var(--blue)' }));
    kids.push(txt(xa - 4, y0 - hb - 6, 'B', { anchor: 'end', size: 11, bold: true, fill: 'var(--blue)' }));

    /* les trois rayons du cours */
    kids.push(ligne(xa, y0 - hb, O, y0 - hb, { c: 'var(--blue)', w: 1.3 }));
    if (OAp !== null && g !== null) {
      var xap = O + OAp * ech, hbp = g * hb;
      var reel = OAp > 0;
      kids.push(ligne(O, y0 - hb, xap, y0 - hbp,
        { c: 'var(--blue)', w: 1.3, dash: reel ? null : '4 3' }));
      /* le rayon par le centre optique, qui ne dévie pas */
      kids.push(ligne(xa, y0 - hb, xap, y0 - hbp, { c: 'var(--txt-3)', w: 1, dash: '3 3' }));
      if (xap > 16 && xap < W - 16) {
        kids.push(ligne(xap, y0, xap, y0 - hbp,
          { c: reel ? 'var(--green)' : 'var(--violet)', w: 2.4, arrow: true }));
        kids.push(txt(xap, y0 + (hbp > 0 ? -8 : 18), 'A′',
          { anchor: 'middle', size: 11, bold: true, fill: reel ? 'var(--green)' : 'var(--violet)' }));
      }
    }

    kids.push(S('rect', { x: 24, y: 208, width: 306, height: 58, rx: 8,
      fill: 'var(--surface-2)', stroke: 'var(--line)' }));
    kids.push(txt(36, 226, '1/OA′ − 1/OA = 1/f′   ·   γ = OA′/OA',
      { size: 11, bold: true, fill: 'var(--txt)' }));
    kids.push(txt(36, 242, 'f′ = ' + dec1(fp) + ' cm · C = ' + dec2(100 / fp) +
      ' D · lentille ' + (conv ? 'convergente' : 'divergente'),
      { size: 10.5, fill: 'var(--txt-2)' }));
    kids.push(txt(36, 257, OAp === null ? 'objet au foyer : image à l’infini'
      : 'OA′ = ' + dec1(OAp) + ' cm · γ = ' + dec2(g) + ' · image ' +
        (OAp > 0 ? 'réelle' : 'virtuelle') + ', ' + (g < 0 ? 'renversée' : 'droite'),
      { size: 10.5, fill: 'var(--txt-2)' }));

    return svg(W, H, 'Lentille mince : les trois rayons et la relation de Descartes', kids);
  }

  var FIGS = {
    descartes: {
      f: descartes, t: 'Poussez l’angle : le rayon réfracté finit par disparaître',
      reglages: [
        { id: 'i1', label: 'Angle d’incidence', min: 0, max: 88, pas: 1, val: 35, unite: '°' },
        { id: 'n1', label: 'Indice du milieu 1', min: 1, max: 1.8, pas: 0.05, val: 1.5 },
        { id: 'n2', label: 'Indice du milieu 2', min: 1, max: 1.9, pas: 0.05, val: 1 }
      ],
      lire: function (p) {
        var s2 = p.n1 * Math.sin(p.i1 * RAD) / p.n2;
        var sens = p.n1 < p.n2 ? 'se rapproche de' : p.n1 > p.n2 ? 's’éloigne de' : 'suit';
        if (Math.abs(s2) > 1) {
          return 'Au-delà de l’angle limite λ = ' + dec1(Math.asin(p.n2 / p.n1) / RAD) + '°, ' +
            'n₁ sin i₁ dépasse n₂ : il n’existe plus d’angle dont le sinus vaille cela, donc plus ' +
            'aucun rayon transmis. Toute l’énergie repart dans le milieu 1 — c’est la réflexion ' +
            'totale, celle qui fait marcher les fibres optiques, et celle qui empêche un prisme ' +
            'trop ouvert de laisser sortir la lumière.';
        }
        var i2 = Math.asin(s2) / RAD;
        return 'n₁ sin i₁ = n₂ sin i₂ : ' + dec2(p.n1) + ' × sin ' + dec1(p.i1) + '° = ' +
          dec2(p.n2) + ' × sin ' + dec1(i2) + '°. Le rayon réfracté ' + sens + ' la normale, ' +
          'parce qu’il ' + (p.n1 < p.n2 ? 'entre dans un milieu plus réfringent, où il va moins vite'
            : p.n1 > p.n2 ? 'sort vers un milieu moins réfringent, où il va plus vite'
            : 'ne change pas de milieu') + '.' +
          (p.n1 > p.n2 ? ' L’angle limite est ici à ' + dec1(Math.asin(p.n2 / p.n1) / RAD) +
            '° : au-delà, plus rien ne passe.' : '');
      }
    },
    prismeGeo: {
      f: prismeGeo, t: 'Les formules du prisme, et pourquoi l’orthoptiste n’en garde qu’une',
      reglages: [
        /* borne basse à 1° : c’est le régime des prismes de correction,
           où D = (n−1)A devient la seule formule utile */
        { id: 'A', label: 'Angle au sommet A', min: 1, max: 75, pas: 1, val: 30, unite: '°' },
        { id: 'n', label: 'Indice du prisme', min: 1.3, max: 1.9, pas: 0.05, val: 1.5 },
        { id: 'i', label: 'Incidence i', min: 0, max: 85, pas: 1, val: 45, unite: '°' }
      ],
      lire: function (p) {
        var r = Math.asin(Math.min(1, Math.sin(p.i * RAD) / p.n)) / RAD;
        var rp = p.A - r;
        var s = p.n * Math.sin(rp * RAD);
        var lim = Math.asin(1 / p.n) / RAD;
        var Dp = (p.n - 1) * p.A;
        if (Math.abs(s) > 1) {
          return 'Sur la face de sortie, r′ = A − r = ' + dec1(rp) + '° dépasse l’angle limite ' +
            dec1(lim) + '° : réflexion totale, rien ne sort. C’est la condition d’émergence du ' +
            'cours — il faut A < 2λ, soit ici A < ' + dec1(2 * lim) + '°. Un prisme attaqué sur ' +
            'son angle droit ne laisse jamais passer la lumière.';
        }
        var D = p.i + Math.asin(s) / RAD - p.A;
        return 'A = r + r′ et D = i + i′ − A : la déviation vaut ' + dec1(D) + '°. Aux petits ' +
          'angles, les sinus se confondent avec les angles et tout se simplifie en D = (n−1)A = ' +
          dec1(Dp) + '°, soit ' + dec1(100 * Math.tan(Dp * RAD)) + ' Δ. C’est cette formule-là, et ' +
          'elle seule, qui sert en orthoptie : un prisme de correction travaille à incidence quasi ' +
          'nulle, et une barre de prismes est graduée en dioptries prismatiques — 1, 2, 4, 6… 40 Δ. ' +
          'Le rayon part vers la base, l’image vers l’arête, l’œil tourne vers l’arête.';
      }
    },
    miroirSpherique: {
      f: miroirSpherique, t: 'Déplacez l’objet : l’image bascule de réelle à virtuelle',
      reglages: [
        { id: 'type', label: 'Miroir', val: 'concave', options: [
          { id: 'concave', label: 'Concave (C dans l’espace réel)' },
          { id: 'convexe', label: 'Convexe (C dans l’espace virtuel)' }
        ] },
        { id: 'R', label: 'Rayon R', min: 20, max: 110, pas: 5, val: 60, unite: ' cm' },
        { id: 'd', label: 'Objet à', min: 5, max: 140, pas: 5, val: 90, unite: ' cm' }
      ],
      lire: function (p) {
        var SC = p.type === 'concave' ? -p.R : p.R;
        var f = SC / 2, SA = -p.d;
        var inv = 2 / SC - 1 / SA;
        if (Math.abs(inv) < 1e-6) {
          return 'L’objet est au foyer : les rayons ressortent parallèles et l’image part à ' +
            'l’infini. C’est le principe du réflecteur de phare, pris à l’envers.';
        }
        var SAp = 1 / inv, g = -SAp / SA;
        if (p.type === 'convexe') {
          return 'Le foyer d’un miroir convexe est dans l’espace virtuel : SF = R/2 = ' + dec1(f) +
            ' cm. Quelle que soit la position de l’objet, l’image reste virtuelle, droite et ' +
            'rétrécie — ici γ = ' + dec2(g) + '. C’est le miroir des sorties de parking : on voit ' +
            'large, mais tout paraît loin.';
        }
        return '2/SC = 1/SA + 1/SA′ donne SA′ = ' + dec1(SAp) + ' cm : image ' +
          (SAp < 0 ? 'RÉELLE' : 'VIRTUELLE') + ' et ' + (g < 0 ? 'renversée' : 'droite') +
          ', de taille ' + dec2(Math.abs(g)) + ' fois l’objet. ' +
          (SAp < 0 ? 'Elle se forme devant le miroir : on peut la recueillir sur un écran.'
                   : 'Elle se forme derrière le miroir — objet plus près que le foyer, image ' +
                     'droite et agrandie : c’est exactement le miroir de dentiste.');
      }
    },
    dioptreSpherique: {
      f: dioptreSpherique, t: 'Un seul dioptre — et l’œil n’en est qu’une suite',
      reglages: [
        { id: 'n', label: 'Indice objet n', min: 1, max: 1.9, pas: 0.05, val: 1 },
        { id: 'np', label: 'Indice image n′', min: 1, max: 1.9, pas: 0.05, val: 1.5 },
        { id: 'sens', label: 'Courbure', val: 'convexe', options: [
          { id: 'convexe', label: 'Convexe (C après le sommet)' },
          { id: 'concave', label: 'Concave (C avant le sommet)' }
        ] },
        { id: 'Rm', label: 'Rayon', min: 5, max: 90, pas: 5, val: 30, unite: ' cm' },
        { id: 'd', label: 'Objet à', min: 5, max: 160, pas: 5, val: 60, unite: ' cm' }
      ],
      lire: function (p) {
        if (Math.abs(p.np - p.n) < 1e-9) {
          return 'Sans saut d’indice, il n’y a pas de dioptre : la lumière traverse sans être ' +
            'déviée, quelle que soit la courbure. C’est pourquoi une lentille plongée dans un ' +
            'liquide de même indice devient invisible.';
        }
        var R = p.sens === 'concave' ? -p.Rm : p.Rm;
        var V = (p.np - p.n) / (R / 100);
        var SA = -p.d;
        var inv = (p.np - p.n) / R + p.n / SA;
        var base = 'V = (n′−n)/SC = ' + dec2(V) + ' D : le dioptre est ' +
          (V > 0 ? 'CONVERGENT' : 'DIVERGENT') + '. Il faut deux choses pour converger — un saut ' +
          'd’indice et une courbure — et c’est leur signe combiné qui décide, jamais l’un des deux seul.';
        if (Math.abs(inv) < 1e-9) return base + ' L’objet est au foyer objet : l’image part à l’infini.';
        var SAp = p.np / inv, g = (p.n * SAp) / (p.np * SA);
        return base + ' La conjugaison n′/SA′ − n/SA = (n′−n)/SC donne SA′ = ' + dec1(SAp) +
          ' cm, image ' + (SAp > 0 ? 'réelle' : 'virtuelle') + ' et ' +
          (g < 0 ? 'renversée' : 'droite') + ' (γ = ' + dec2(g) + '). C’est le calcul qu’on refait ' +
          'sur la cornée : saut air/larmes de 1 à 1,376 sur un rayon de 7,8 mm, et l’on retrouve ' +
          'ses +48 D. L’œil entier n’est qu’une suite de quatre dioptres de ce genre.';
      }
    },
    lentilleMince: {
      f: lentilleMince, t: 'Les trois rayons, et le basculement réel → virtuel au foyer',
      reglages: [
        { id: 'type', label: 'Lentille', val: 'convergente', options: [
          { id: 'convergente', label: 'Convergente (f′ > 0)' },
          { id: 'divergente', label: 'Divergente (f′ < 0)' }
        ] },
        { id: 'fm', label: 'Distance focale', min: 5, max: 50, pas: 1, val: 20, unite: ' cm' },
        { id: 'd', label: 'Objet à', min: 3, max: 100, pas: 1, val: 60, unite: ' cm' }
      ],
      lire: function (p) {
        var fp = p.type === 'divergente' ? -p.fm : p.fm;
        var OA = -p.d, inv = 1 / fp + 1 / OA;
        var C = 100 / fp;
        if (p.type === 'divergente') {
          var OAp2 = 1 / inv;
          return 'Une lentille divergente (C = ' + dec2(C) + ' D) donne toujours, d’un objet réel, ' +
            'une image virtuelle, droite et rétrécie : ici OA′ = ' + dec1(OAp2) + ' cm et γ = ' +
            dec2(OAp2 / OA) + '. C’est ce qui fait qu’un myope fort a les yeux visiblement ' +
            'rapetissés derrière ses verres.';
        }
        if (Math.abs(inv) < 1e-9) {
          return 'L’objet est au foyer objet : les rayons ressortent parallèles, l’image part à ' +
            'l’infini. C’est le point de bascule entre les deux régimes — au-delà l’image est ' +
            'réelle et renversée, en deçà elle devient virtuelle et droite.';
        }
        var OAp = 1 / inv, g = OAp / OA;
        if (p.d > p.fm) {
          return '1/OA′ − 1/OA = 1/f′ donne OA′ = ' + dec1(OAp) + ' cm : objet au-delà du foyer, ' +
            'donc image RÉELLE et RENVERSÉE (γ = ' + dec2(g) + '). C’est le cas de l’œil — ' +
            'l’image se forme sur la rétine, à l’envers, et le cortex la remet à l’endroit.';
        }
        return 'Objet en deçà du foyer : l’image devient VIRTUELLE, droite et agrandie (OA′ = ' +
          dec1(OAp) + ' cm, γ = ' + dec2(g) + '). C’est le principe de la loupe, et celui du verre ' +
          'de lecture du presbyte.';
      }
    },
    annonce: { f: annonce, t: 'Ce qui est retenu d’une annonce, c’est l’attitude' },
    pico: { f: pico, t: 'Un sujet trop large est la cause première d’échec' },
    parcours: { f: parcours, t: 'Deux pannes seulement, et le même remède' },
    evaluation: { f: evaluation, t: 'Les confondre transforme chaque remarque en sanction' },
    pupille: { f: pupille, t: 'Il parle quand le fond d’œil se tait' },
    parks: { f: parks, t: 'Trois questions, un seul muscle au bout' },
    stats: { f: stats, t: 'Deux questions suffisent à choisir son test' },
    diplopie: { f: diplopie, t: 'Ce que l’enfant neutralise, l’adulte le subit' },
    acuites: { f: acuites, t: 'Quatre notions qu’on appelle toutes « acuité »' },
    reeduc: { f: reeduc, t: 'Ce qu’elle ne fait pas compte autant que ce qu’elle fait' },
    interrogatoire: { f: interrogatoire, t: 'Le bilan dépend de ce qu’on a demandé avant' },
    octcoupe: { f: octcoupe, t: 'Le RNFL bouge avant le champ visuel' },
    occlusion: { f: occlusion, t: 'La dose se règle sur la profondeur, pas sur l’impatience' },
    hlh: { f: hlh, t: 'Le même déficit des deux côtés — c’est ce qui le rend homonyme' },
    scotome: { f: scotome, t: 'On ne récupère pas la macula : on en choisit une autre' },
    nystagmus: { f: nystagmus, t: 'Une seule question fait le tri : y a-t-il des oscillopsies ?' },
    ecran: { f: ecran, t: 'Trois réglages qui ne coûtent rien' },
    chirurgie: { f: chirurgie, t: 'Affaiblir ou renforcer : deux gestes symétriques' },
    preuve: { f: preuve, t: 'Ce n’est pas le sujet qui fait la valeur d’un article, c’est son plan' },
    decret: { f: decret, t: 'Trois vérifications, et toujours dans cet ordre' },
    survie: { f: survie, t: 'Quatre maillons, et un seul qui prime : le massage' },
    raisonnement: { f: raisonnement, t: 'Chaque test répond à une question posée avant lui' },
    alertes: { f: alertes, t: 'Sept sonnettes — on ne discute pas une sonnette' },
    artefacts: { f: artefacts, t: 'Un examen mal acquis raconte une histoire cohérente et fausse' },
    secret: { f: secret, t: 'Le secret n’est pas levé par la demande d’un proche' },
    ethique: { f: ethique, t: 'Un dilemme, c’est deux principes qui s’opposent' },
    aes: { f: aes, t: 'Accident d’exposition : quatre gestes, quatre horloges' },
    adenovirus: { f: adenovirus, t: 'Une chaîne se coupe à un maillon, pas par la vigilance' },
    diabete: { f: diabete, t: 'C’est la question posée qui choisit l’examen' },
    suivi: { f: suivi, t: 'Deux points laissent passer une infinité de pentes' },
    developpement: { f: developpement, t: 'Ce qui s’installe, et ce qui doit alerter' },
    esotropies: { f: esotropies, t: 'L’âge d’apparition fait le premier tri' },
    epithelium: { f: epithelium, t: 'Quatre fonctions pour une seule monocouche' },
    brouillage: {
      f: brouillage, t: 'Du côté du plus l’acuité chute ; du côté du moins, c’est l’accommodation qui paie',
      reglages: [{ id: 'ecart', label: 'Écart à la sphère juste', min: -1.5, max: 1.5, pas: 0.25, val: 1.25, fmt: fmt, unite: ' D' }],
      lire: function (p) {
        var e = p.ecart;
        if (e > 0.6) {
          return 'Avec ' + fmt(e) + ' D de trop en plus, l’acuité tombe à 2–4/10 : c’est le brouillard de départ, ' +
                 'et il est là pour relâcher l’accommodation. On retire ensuite le plus par pas de 0,25.';
        }
        if (e > 0.12) {
          return 'On approche : l’acuité remonte à mesure qu’on retire le plus. La règle d’or dit de s’arrêter ' +
                 'à la sphère la plus convexe qui donne la meilleure acuité — pas une de moins.';
        }
        if (e > -0.12) {
          return 'C’est la sphère juste : meilleure acuité, accommodation au repos. Tout ce qu’on retirerait ' +
                 'de plus n’améliorerait plus rien — et se paierait ailleurs.';
        }
        return 'Avec ' + fmt(e) + ' D de trop en moins, l’acuité reste à 10/10 : voilà le piège. Ce n’est pas ' +
               'le verre qui voit, c’est l’accommodation qui compense — le patient « voit bien » en consultation ' +
               'et fatigue toute la journée. C’est pourquoi on descend depuis le plus, jamais on ne remonte depuis le moins.';
      }
    },
    vergence: {
      f: vergence, t: 'Plus la cible approche, plus la vergence s’emballe',
      reglages: [{ id: 'dist', label: 'Distance', min: 10, max: 600, pas: 1, val: 33, unite: ' cm' }],
      lire: function (p) {
        var V = 100 / p.dist;
        var m = (p.dist / 100).toFixed(2).replace('.', ',');
        if (p.dist >= 500) {
          return 'À ' + m + ' m, la vergence n’est plus que de ' + fmt(-V) + ' D : au-delà de 5 m, ' +
                 'on considère les rayons parallèles et l’accommodation au repos. C’est pourquoi la ' +
                 'vision de loin se mesure à 5 m.';
        }
        return 'À ' + p.dist + ' cm, la vergence vaut ' + fmt(-V) + ' D : l’œil doit fournir ' +
               V.toFixed(2).replace('.', ',') + ' D d’accommodation pour voir net. ' +
               'Tirez encore la cible vers vous : la relation est hyperbolique, chaque centimètre ' +
               'gagné coûte de plus en plus cher.';
      }
    },
    prentice: {
      f: prentice, t: 'Tout verre devient un prisme dès qu’on quitte son centre optique',
      reglages: [
        { id: 'p', label: 'Puissance', min: -8, max: 8, pas: 0.25, val: -6, fmt: fmt, unite: ' D' },
        { id: 'dec', label: 'Décentrement', min: 0, max: 10, pas: 0.5, val: 4, unite: ' mm' }
      ],
      lire: function (p) {
        var d = Math.abs(p.p) * (p.dec / 10);
        if (p.dec < 0.3) {
          return 'Au centre optique, aucun effet prismatique : c’est le seul point du verre qui ne ' +
                 'dévie pas. Éloignez le regard du centre pour voir apparaître le prisme.';
        }
        if (Math.abs(p.p) < 0.3) {
          return 'Un verre sans puissance ne prisme pas, où qu’on regarde : Δ = P × décentrement, ' +
                 'et P vaut zéro.';
        }
        return 'Un verre de ' + fmt(p.p) + ' D regardé à ' + p.dec.toFixed(1).replace('.', ',') +
               ' mm sous son centre optique induit ' + d.toFixed(2).replace('.', ',') + ' Δ, base ' +
               (p.p > 0 ? 'en haut' : 'en bas') + ' : un verre ' + (p.p > 0 ? 'convergent' : 'divergent') +
               ' est fait de deux prismes accolés par ' + (p.p > 0 ? 'leur base' : 'leur arête') +
               ' au centre optique, et la lumière tourne toujours vers la base. ' +
               'C’est ce qui se passe en lecture, regard abaissé — et pourquoi une anisométropie gêne ' +
               'de près bien avant de gêner de loin.';
      }
    },
    comitance: {
      f: comitance, t: 'Le même angle partout, ou un angle qui varie : tout se décide là',
      reglages: [
        { id: 'angle', label: 'Angle de base', min: 4, max: 40, pas: 2, val: 20, unite: ' Δ' },
        { id: 'inc', label: 'Incomitance', min: 0, max: 100, pas: 5, val: 0, unite: ' %' }
      ],
      lire: function (p) {
        if (p.inc < 6) {
          return 'Angle identique dans les neuf positions : déviation comitante. Elle est ' +
                 'typiquement ancienne, innervationnelle, et relève de la prise en charge orthoptique. ' +
                 'Montez l’incomitance pour voir le tableau basculer.';
        }
        return 'L’angle grandit dans le regard à droite : c’est le profil d’une atteinte du droit ' +
               'latéral droit. Une déviation qui varie avec la direction impose les neuf positions, ' +
               'le Lancaster, et le plus souvent un avis neurologique — surtout si elle est récente.';
      }
    },
    worth: { f: worth, t: 'Les trois degrés de Worth : on ne saute pas une marche' },
    mouvements: { f: mouvements, t: 'Trente fois plus rapide qu’une vergence : la saccade' },
    obliques: { f: obliques, t: 'Les deux obliques : une poulie devant, deux insertions derrière' },
    alphabetiques: { f: alphabetiques, t: 'Syndromes A et V : la lettre est le schéma' },
    couleurs: { f: couleurs, t: 'Règle de Köllner : l’axe atteint dit l’étage atteint' },
    torticolis: { f: torticolis, t: 'Trois postures, trois causes — le torticolis se décode' },
    cycloplegiques: { f: cycloplegiques, t: 'Vingt minutes ou sept jours : trois échelles de temps' },
    retine: { f: retine, t: 'Les dix couches, du vitré à la choroïde' },
    sturm: {
      f: sturm, t: 'La conoïde de Sturm : deux focales, un cercle de moindre diffusion entre elles',
      reglages: [
        { id: 'sph', label: 'Sphère', min: -6, max: 4, pas: 0.25, val: -2, fmt: fmt, unite: ' D' },
        { id: 'cyl', label: 'Cylindre', min: -5, max: 0, pas: 0.25, val: -3, fmt: fmt, unite: ' D' }
      ],
      lire: function (p) {
        var es = p.sph + p.cyl / 2, e = Math.abs(p.cyl);
        if (e < 0.13) {
          return 'Sans cylindre, il n’y a plus de conoïde : les deux méridiens focalisent au même point, ' +
                 'et l’équivalent sphérique se confond avec la sphère (' + fmt(p.sph) + ' D).';
        }
        return 'Les deux méridiens focalisent à ' + fmt(p.sph) + ' D et ' + fmt(p.sph + p.cyl) + ' D : ' +
               'l’intervalle de Sturm vaut exactement le cylindre, ' + e.toFixed(2).replace('.', ',') + ' D. ' +
               'Le cercle de moindre diffusion se place à mi-chemin dioptrique, soit l’équivalent sphérique ' +
               fmt(es) + ' D — et c’est lui qu’on corrige quand on ne met qu’une valeur.';
      }
    },
    prisme: {
      f: prisme, t: 'Le rayon vers la base, l’image vers l’arête, l’œil vers l’arête',
      reglages: [{ id: 'delta', label: 'Puissance', min: 1, max: 20, pas: 1, val: 8, unite: ' Δ' }],
      lire: function (p) {
        var deg = Math.atan(p.delta / 100) * 180 / Math.PI;
        return p.delta + ' Δ dévient le rayon de ' + p.delta + ' cm à un mètre, soit ' +
          deg.toFixed(1).replace('.', ',') + '°. La règle de conversion tient là-dedans : ' +
          'Δ = 100 × tan θ, donc 2 Δ valent à peu près 1°. Le rayon part vers la base, ' +
          'l’image se déplace vers l’arête — et l’œil tourne vers l’arête pour aller la chercher.';
      }
    },
    tillaux: { f: tillaux, t: 'La spirale de Tillaux : les insertions s’éloignent du limbe en tournant' },
    voies: {
      f: voies, t: 'Déplacez la lésion le long de la voie : le déficit suit',
      reglages: [{ id: 'site', label: 'Lésion', val: 'chiasma', options: [
        { id: 'nerf', label: 'Nerf optique gauche' },
        { id: 'chiasma', label: 'Chiasma' },
        { id: 'bandelette', label: 'Bandelette droite' },
        { id: 'radiations', label: 'Radiations temporales droites' },
        { id: 'cortex', label: 'Cortex occipital droit' }
      ] }],
      lire: function (p) {
        var T = {
          nerf: 'Avant le chiasma, l’atteinte ne concerne qu’un œil : la cécité est monoculaire, et c’est le seul étage où elle peut l’être.',
          chiasma: 'Au chiasma, la lésion frappe les fibres nasales qui croisent — celles qui portent les hémichamps temporaux. D’où une hémianopsie bitemporale, le patient perd les côtés : il se cogne aux montants de porte.',
          bandelette: 'Après le chiasma, chaque voie porte l’hémichamp opposé : une lésion droite ampute le champ gauche des DEUX yeux. C’est une hémianopsie homonyme, et elle est peu congruente à cet étage.',
          radiations: 'Les fibres du champ supérieur descendent dans le lobe temporal (boucle de Meyer) : une lésion temporale droite donne une quadranopsie supérieure gauche — le classique « pie in the sky ».',
          cortex: 'Au cortex occipital, le déficit est très congruent et la macula est souvent épargnée : le pôle occipital reçoit du sang de deux territoires. Le patient garde une acuité centrale normale malgré un demi-champ perdu.'
        };
        return T[p.site] || '';
      }
    },
    adaptation: { f: adaptation, t: 'Cônes puis bâtonnets : la cassure est le passage de relais' },
    positions: { f: positions, t: 'Les neuf positions du regard et le muscle qui y domine' },
    transmission: { f: transmission, t: 'Quatre modes, quatre arbres — et l’indice qui les départage' },
    cornee: { f: cornee, t: 'Cinq couches, dont deux qui ne se réparent jamais' },
    oeilOptique: { f: oeilOptique, t: 'Environ +60 D, dont les deux tiers pour la cornée' },
    transposition: { f: transposition, t: 'Le même verre, écrit de deux façons' },
    sommet: {
      f: sommet, t: 'À 12 mm de l’œil ou posé dessus : ce n’est pas la même vergence',
      reglages: [
        { id: 'puissance', label: 'Verre', min: -14, max: 10, pas: 0.25, val: -10, fmt: fmt, unite: ' D' },
        { id: 'distance', label: 'Distance', min: 6, max: 18, pas: 1, val: 12, unite: ' mm' }
      ],
      lire: function (p) {
        var dm = p.distance / 1000, Pp = p.puissance / (1 - dm * p.puissance);
        var e = Math.abs(Pp - p.puissance);
        return 'Un verre de ' + fmt(p.puissance) + ' D porté à ' + p.distance + ' mm vaut ' + fmt(Pp) +
          ' D une fois posé sur la cornée : ' + e.toFixed(2).replace('.', ',') + ' D d’écart. ' +
          (e < 0.25
            ? 'Sous le quart de dioptrie, personne ne le verra — c’est pourquoi la correction ne s’impose qu’au-delà de ± 4 D.'
            : (p.puissance < 0
                ? 'Rapprocher un verre négatif de l’œil oblige à en mettre moins.'
                : 'Rapprocher un verre positif de l’œil oblige à en mettre davantage.'));
      }
    },
    skiascopie: { f: skiascopie, t: 'Le sens de l’ombre dit de quel côté aller' },
    amplitude: {
      f: amplitude, t: 'L’amplitude s’épuise, la presbytie commence',
      reglages: [
        { id: 'age', label: 'Âge', min: 10, max: 70, pas: 1, val: 45, unite: ' ans' },
        { id: 'distance', label: 'Lecture à', min: 20, max: 80, pas: 1, val: 33, unite: ' cm' }
      ],
      lire: function (p) {
        var a = Math.max(0.5, 18.5 - 0.3 * p.age), d = 100 / p.distance;
        var add = Math.max(0, Math.round((d - a / 2) * 4) / 4);
        return 'À ' + p.age + ' ans, l’amplitude moyenne vaut ' + fmt(a).replace('+', '') + ' D. ' +
          'Lire à ' + p.distance + ' cm demande ' + fmt(d).replace('+', '') + ' D, et l’on n’en dépense que la moitié — ' +
          'le reste est la réserve qui permet de tenir plus de cinq minutes. ' +
          (add > 0
            ? 'Il manque donc ' + fmt(add) + ' D : c’est l’addition.'
            : 'L’amplitude suffit encore : aucune addition n’est nécessaire.');
      }
    },
    optotype: { f: optotype, t: '5 minutes d’arc pour la lettre, 1 pour son détail' },
    echelles: { f: echelles, t: 'Deux échelles, deux comportements aux extrêmes' },
    crowding: { f: crowding, t: 'La même lettre, isolée puis entourée' },
    hering: { f: hering, t: 'Changer d’œil fixateur change l’angle : c’est Hering' },
    panum: { f: panum, t: 'La bande étroite où la disparité devient du relief' },
    covertest: { f: covertest, t: 'Deux gestes, deux questions différentes' },
    phototransduction: { f: phototransduction, t: 'Du photon au silence du photorécepteur' },
    champrecepteur: { f: champrecepteur, t: 'La rétine n’envoie pas une image, elle envoie des différences' },
    magnoparvo: { f: magnoparvo, t: 'L’éclaireur et l’expert : deux voies, deux métiers' },
    orbite: { f: orbite, t: 'Quatre parois, et un sommet où tout se croise' },
    innervation: { f: innervation, t: 'LR6 SO4, tous les autres 3' },
    acA: {
      f: acA, t: 'Ce que l’accommodation ajoute entre loin et près',
      reglages: [
        { id: 'loin', label: 'Angle de loin', min: -10, max: 30, pas: 1, val: 10, unite: ' Δ' },
        { id: 'aca', label: 'AC/A', min: 0, max: 10, pas: 0.5, val: 6, unite: ' Δ/D' },
        { id: 'distance', label: 'Près à', min: 25, max: 50, pas: 1, val: 33, unite: ' cm' }
      ],
      lire: function (p) {
        var d = 100 / p.distance, pres = p.loin + p.aca * d;
        return 'À ' + p.distance + ' cm, l’œil doit accommoder de ' + d.toFixed(1).replace('.', ',') + ' D. ' +
          'Avec un AC/A de ' + p.aca.toFixed(1).replace('.', ',') + ' Δ/D, cela ajoute ' +
          (p.aca * d).toFixed(1).replace('.', ',') + ' Δ de convergence : l’angle passe de ' +
          p.loin + ' à ' + pres.toFixed(1).replace('.', ',') + ' Δ. ' +
          (p.aca > 5 ? 'Un AC/A élevé fait exploser l’angle de près — c’est l’excès de convergence, et l’addition de près est un vrai traitement.'
            : p.aca < 3 ? 'Un AC/A bas laisse l’angle presque inchangé : c’est la convergence fusionnelle qui doit tout payer, et c’est elle qu’on rééduque.'
            : 'Entre 3 et 5 Δ/D, on est dans la norme : l’angle bouge peu entre loin et près.');
      }
    },
    oeilrouge: { f: oeilrouge, t: 'Une seule question tranche : douleur ou baisse d’acuité' },
    glaucome: {
      f: glaucome, t: 'L’excavation grandit pendant que l’acuité reste bonne',
      reglages: [{ id: 'cd', label: 'Rapport C/D', min: 0.1, max: 0.9, pas: 0.1, val: 0.6 }],
      lire: function (p) {
        return 'Un C/D de ' + p.cd.toFixed(1).replace('.', ',') + ' : ' +
          (p.cd <= 0.3 ? 'l’anneau neuro-rétinien est plein, la papille est normale.'
           : p.cd <= 0.5 ? 'l’excavation reste dans la zone où l’on surveille sans conclure.'
           : p.cd <= 0.7 ? 'l’anneau s’amincit : la papille devient suspecte, il faut un champ visuel et un OCT.'
           : 'l’anneau n’est plus qu’un liseré — c’est un glaucome évolué, alors que l’acuité centrale peut rester à 10/10.') +
          ' Le champ visuel perd en arciforme, par la périphérie, et le patient ne s’en aperçoit pas.';
      }
    },
    dmla: { f: dmla, t: 'Deux formes, deux vitesses — et ce que le patient voit' },
    champ24: { f: champ24, t: 'Une grille de seuils, deux indices, une règle de fiabilité' },
    explorations: { f: explorations, t: 'Chaque examen interroge un étage : rétine, macula, nerf' },
    ppc: { f: ppc, t: 'Trois essais : c’est la dégradation qui compte' },
    bilanordre: { f: bilanordre, t: 'Sept temps, et aucun qui ne perturbe le suivant' },
    ordretherapeutique: { f: ordretherapeutique, t: 'Quatre marches, dans cet ordre et pas un autre' },
    plasticite: { f: plasticite, t: 'Une pente, pas une porte qui claque' },
    amblyopie3: { f: amblyopie3, t: 'Déplacer, flouter, supprimer : trois façons d’abîmer une image' },
    profils: { f: profils, t: 'Ce que chaque atteinte enlève, et ce qu’elle laisse' },
    sesp: { f: sesp, t: 'SnNout, SpPin — et pourquoi la prévalence change tout' },
    paralysies: { f: paralysies, t: 'VI, IV, III : trois tableaux qu’on ne confond pas' },
    lecture: { f: lecture, t: 'L’œil saute, s’arrête, prélève — et parfois revient en arrière' }
  };

  /* ============================================================
     Les schémas vivants
     ------------------------------------------------------------
     Un schéma juste s'oublie ; un schéma qu'on a tordu reste. Une
     figure peut donc déclarer des réglages : la fonction de dessin
     reçoit alors leurs valeurs et se redessine à chaque mouvement.

       reglages : la liste des paramètres manipulables. Deux formes —
                  un curseur { min, max, pas } ou un choix { options }.
       lire     : ce que l'état courant raconte, en une phrase. C'est
                  la partie qui enseigne : le dessin montre, la phrase
                  nomme ce qu'on vient de voir.

     Les figures sans réglages ne changent pas d'un iota : elles
     ignorent simplement le paramètre qu'on leur passe.
     ============================================================ */

  function defauts(key) {
    var d = FIGS[key];
    var out = {};
    if (!d || !d.reglages) return out;
    d.reglages.forEach(function (r) { out[r.id] = r.val; });
    return out;
  }

  /* Les valeurs venues de l'interface sont des chaînes, et peuvent manquer :
     on les ramène toujours dans les bornes déclarées. */
  function normaliser(key, p) {
    var d = FIGS[key], out = defauts(key);
    if (!d || !d.reglages) return out;
    p = p || {};
    d.reglages.forEach(function (r) {
      var v = p[r.id];
      if (v === undefined || v === null || v === '') return;
      if (r.options) {
        if (r.options.some(function (o) { return o.id === v; })) out[r.id] = v;
        return;
      }
      v = parseFloat(v);
      if (isNaN(v)) return;
      out[r.id] = Math.min(r.max, Math.max(r.min, v));
    });
    return out;
  }

  /* ------------------------------------------------------------
     Le schéma prêt à poser dans une page
     ------------------------------------------------------------
     Deux écrans montrent les mêmes figures : la fiche d’UE et le
     répétiteur. Or un schéma vivant n’est pas qu’un dessin — c’est
     le dessin, ses curseurs, la phrase qui dit ce qu’on vient de
     changer, et sa légende. Assembler tout cela à deux endroits,
     c’est se condamner à n’en corriger qu’un des deux.
     ------------------------------------------------------------ */
  function bloc(cle) {
    if (!FIGS[cle] || !window.UI) return null;
    var el = UI.el;
    var dessin = UEFigs.draw(cle);
    if (!dessin) return null;

    var fig = el('figure', { class: 'ue-fig' }, [dessin]);
    if (!FIGS[cle].reglages) {
      fig.appendChild(el('figcaption', { text: FIGS[cle].t }));
      return fig;
    }

    var val = defauts(cle);
    var phrase = el('p', { class: 'fig-lire', html: UEFigs.commentaire(cle, val) });
    var sorties = {};

    function redessiner() {
      var neuf = UEFigs.draw(cle, val);
      if (!neuf) return;
      fig.replaceChild(neuf, dessin);
      dessin = neuf;
      phrase.innerHTML = UEFigs.commentaire(cle, val);
    }

    function afficher(r) {
      return (r.fmt ? r.fmt(val[r.id]) : val[r.id]) + (r.unite || '');
    }

    var commandes = el('div', { class: 'fig-reglages' }, FIGS[cle].reglages.map(function (r) {
      if (r.options) {
        var sel = UI.select(r.options.map(function (o) { return { value: o.id, label: o.label }; }),
          val[r.id], function (v) { val[r.id] = v; redessiner(); });
        return el('div', { class: 'fig-reglage' }, [el('label', { text: r.label }), sel]);
      }
      var sortie = el('span', { class: 'fig-val mono', text: afficher(r) });
      sorties[r.id] = sortie;
      var curseur = el('input', {
        type: 'range', min: r.min, max: r.max, step: r.pas, value: val[r.id],
        'aria-label': r.label
      });
      curseur.addEventListener('input', function () {
        val[r.id] = parseFloat(curseur.value);
        sortie.textContent = afficher(r);
        redessiner();
      });
      return el('div', { class: 'fig-reglage' }, [el('label', { text: r.label }), curseur, sortie]);
    }).concat([
      UI.btn('↺', function () {
        val = defauts(cle);
        var curseurs = FIGS[cle].reglages.filter(function (x) { return !x.options; });
        commandes.querySelectorAll('input[type="range"]').forEach(function (i, k) {
          var r = curseurs[k];
          if (!r) return;
          i.value = val[r.id];
          if (sorties[r.id]) sorties[r.id].textContent = afficher(r);
        });
        redessiner();
      }, 'sm fig-reset')
    ]));

    fig.appendChild(commandes);
    fig.appendChild(phrase);
    fig.appendChild(el('figcaption', { text: FIGS[cle].t }));
    return fig;
  }

  window.UEFigs = {
    draw: function (key, p) {
      var d = FIGS[key];
      if (!d) return null;
      s = window.UI && UI.svg;
      return s ? d.f(normaliser(key, p)) : null;
    },
    legende: function (key) { return FIGS[key] ? FIGS[key].t : ''; },
    has: function (key) { return !!FIGS[key]; },
    keys: function () { return Object.keys(FIGS); },

    /* --- schémas vivants --- */
    vivant: function (key) { return !!(FIGS[key] && FIGS[key].reglages); },
    /* le schéma complet — dessin, curseurs, commentaire, légende */
    bloc: bloc,
    reglages: function (key) { return (FIGS[key] && FIGS[key].reglages) || []; },
    defauts: defauts,
    commentaire: function (key, p) {
      var d = FIGS[key];
      return (d && d.lire) ? d.lire(normaliser(key, p)) : '';
    }
  };
})();
