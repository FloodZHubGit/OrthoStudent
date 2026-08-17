/* ============================================================
   Calculatrices & conversions cliniques
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;
  var A = Optics.Acuity, P = Optics.Prism, R = Optics.Refraction, B = Optics.Binocular;

  function out(node) { return el('div', { class: 'result-box' }, node); }
  function big(v) { return el('div', { class: 'result-big', text: v }); }

  /* ============================================================
     « Comment on le calcule » — la démonstration sous le résultat
     ------------------------------------------------------------
     Chaque étape porte la formule, son application aux valeurs
     saisies, et la raison d'être du calcul. L'explication vient
     du registre partagé window.FORMULAS : la même partout.
     ============================================================ */
  var F = window.FORMULAS || {};

  function step(id, numeric, extra) {
    var f = F[id] || {};
    return el('div', { class: 'calc-step' }, [
      el('div', { class: 'cs-title' }, [
        el('span', { class: 'cs-badge', text: 'formule' }),
        el('span', { text: f.t || id })
      ]),
      f.f ? el('div', { class: 'cs-formula mono selectable', html: f.f }) : null,
      numeric ? el('div', { class: 'cs-numeric mono selectable', html: numeric }) : null,
      f.w ? el('div', { class: 'cs-why', html: '<b>Pourquoi ?</b> ' + f.w }) : null,
      f.r ? el('div', { class: 'cs-mark', html: '<b>Repère.</b> ' + f.r }) : null,
      extra ? el('div', { class: 'cs-why', html: extra }) : null
    ].filter(Boolean));
  }

  function howto(steps) {
    return el('details', { class: 'calc-how', open: true }, [
      el('summary', { text: 'Comment ce résultat est obtenu' }),
      el('div', { class: 'calc-how-body' }, steps.filter(Boolean))
    ]);
  }

  function nb(v, d) { return Optics.r2(v, d === undefined ? 2 : d); }

  /* ---------------- 1. Acuité visuelle ---------------- */
  function calcAcuity() {
    var res = el('div');
    var state = { dec: 1.0 };

    function refresh(src) {
      var d = state.dec;
      if (!d || d <= 0) return;
      UI.clear(res);
      res.appendChild(el('div', { class: 'grid g4' }, [
        UI.stat(Optics.r2(d * 10, 2) + '/10', 'Monoyer (10e)'),
        UI.stat(Optics.r2(d, 3), 'Décimal'),
        UI.stat(A.decToLogMAR(d).toFixed(2), 'logMAR'),
        UI.stat('P' + A.parinaudFor(d), 'Parinaud (près)')
      ]));
      res.appendChild(el('div', { class: 'grid g4', style: { marginTop: '12px' } }, [
        UI.stat('20/' + Math.round(A.decToSnellen20(d)), 'Snellen (pieds)'),
        UI.stat('6/' + Optics.r2(A.decToSnellen6(d), 1), 'Snellen (mètres)'),
        UI.stat(Optics.r2(A.decToMAR(d), 2) + '′', 'MAR (min d’arc)'),
        UI.stat(Optics.r2(A.decToCpd(d), 1), 'cycles/degré')
      ]));
      var dist = Store.setting('testDistance');
      res.appendChild(UI.note('Optotype standard (5′ d’arc) pour cette acuité à <b>' + dist + ' m</b> : hauteur de <b>' +
        Optics.r2(A.optotypeHeightMm(d, dist), 2) + ' mm</b>, détail (largeur de trait) de <b>' +
        Optics.r2(A.optotypeHeightMm(d, dist) / 5, 2) + ' mm</b>.'));
      if (src !== 'letters') {
        res.appendChild(el('p', { class: 'small muted', html: 'Échelle ETDRS : 1 lettre = 0,02 logMAR, 1 ligne = 0,1 logMAR = 5 lettres. Perte de <b>' +
          A.logMARToLetters(A.decToLogMAR(d)) + ' lettres</b> par rapport à 10/10.' }));
      }

      res.appendChild(howto([
        step('logmar', 'logMAR = −log₁₀(' + nb(d, 3) + ') = <b>' + A.decToLogMAR(d).toFixed(2) + '</b>'),
        step('mar', 'MAR = 1 / ' + nb(d, 3) + ' = <b>' + nb(A.decToMAR(d)) + '′</b> (minutes d’arc)'),
        step('optotype', 'angle = 5′ / ' + nb(d, 3) + ' = ' + nb(5 / d) + '′ → hauteur à ' + dist + ' m = <b>' +
          nb(A.optotypeHeightMm(d, dist)) + ' mm</b>',
          'Snellen se lit comme une fraction : 20/' + Math.round(A.decToSnellen20(d)) +
          ' signifie « ce patient voit à 20 pieds ce qu’un œil normal voit à ' + Math.round(A.decToSnellen20(d)) + ' ».')
      ]));
    }

    var inputs = el('div', { class: 'grid g4' }, [
      UI.field('Acuité décimale', UI.num(1.0, function (v) { state.dec = v; refresh(); }, { step: 0.05, min: 0.01, max: 3 })),
      UI.field('Dixièmes (Monoyer)', UI.num(10, function (v) { state.dec = v / 10; refresh(); }, { step: 0.5, min: 0.1 })),
      UI.field('logMAR', UI.num(0, function (v) { state.dec = A.logMARToDec(v); refresh(); }, { step: 0.1, min: -0.3, max: 2 })),
      UI.field('Snellen 20/x', UI.num(20, function (v) { state.dec = 20 / v; refresh(); }, { step: 5, min: 5 }))
    ]);

    refresh();

    var scale = UI.table(['Monoyer', 'Décimal', 'logMAR', 'Snellen 20/x', 'MAR'],
      A.monoyerScale.slice().reverse().map(function (m) {
        return [m.tenth, m.dec.toFixed(2), A.decToLogMAR(m.dec).toFixed(2),
                '20/' + Math.round(A.decToSnellen20(m.dec)), Optics.r2(A.decToMAR(m.dec), 2) + '′'];
      }), { numeric: [1, 2, 3, 4] });

    return el('div', {}, [
      UI.card('Conversion d’acuité visuelle', [inputs, res]),
      UI.card('Table de correspondance complète', scale),
      UI.card('Acuités basses (hors échelle)', [
        el('p', { class: 'muted', html: 'Sous 1/20, on utilise la notation fonctionnelle : ' }),
        el('div', { class: 'flex wrap' }, A.lowVisionScale.map(function (l) { return UI.chip(l); })),
        UI.note('CLD = compte les doigts (préciser la distance) · MDM = mouvements de la main · PL+ = perception lumineuse conservée, avec ou sans projection · PL− = cécité complète.')
      ])
    ]);
  }

  /* ---------------- 2. Prismes ---------------- */
  function calcPrism() {
    var r1 = el('div');
    function up(d) {
      UI.clear(r1);
      r1.appendChild(el('div', { class: 'grid g3' }, [
        UI.stat(Optics.r2(d, 1) + ' Δ', 'Dioptries prismatiques'),
        UI.stat(Optics.r2(P.dptToDeg(d), 2) + '°', 'Degrés'),
        UI.stat(Optics.r2(d, 1) + ' cm', 'Déviation à 1 m')
      ]));
      r1.appendChild(UI.note('Rotation oculaire équivalente : <b>' + Optics.r2(P.dptToDeg(d), 2) + '°</b>. ' +
        'Attention : la relation n’est pas linéaire (Δ = 100·tan θ) — l’approximation « 1 Δ = 0,57° » n’est valable que pour les petits angles (jusqu’à ~20 Δ).'));
      r1.appendChild(howto([
        step('prisme', 'θ = arctan(' + nb(d, 1) + ' / 100) = arctan(' + nb(d / 100, 3) + ') = <b>' + nb(P.dptToDeg(d)) + '°</b>',
          'Vérification par le repère linéaire : ' + nb(d, 1) + ' × 0,57 = ' + nb(d * 0.57) + '°, soit un écart de ' +
          nb(Math.abs(d * 0.57 - P.dptToDeg(d)), 2) + '° avec le calcul exact — l’approximation se dégrade quand l’angle grandit.')
      ]));
    }
    up(10);

    var comb = el('div');
    var cH = 6, cV = 4;
    function upComb() {
      var c = P.combine(cH, cV);
      UI.clear(comb);
      comb.appendChild(el('div', { class: 'grid g2' }, [
        UI.stat(c.magnitude + ' Δ', 'Prisme résultant'),
        UI.stat(c.axis + '°', 'Orientation de la base')
      ]));
      comb.appendChild(UI.note('Un prisme unique de <b>' + c.magnitude + ' Δ</b> à <b>' + c.axis + '°</b> remplace les deux prismes. ' +
        'Réparti sur les deux yeux : ' + P.split(c.magnitude) + ' Δ par œil.'));
    }
    upComb();

    return el('div', {}, [
      UI.card('Dioptrie prismatique ↔ degrés', [
        el('div', { class: 'grid g2' }, [
          UI.field('Dioptries prismatiques (Δ)', UI.num(10, function (v) { up(v); }, { step: 1, min: 0, max: 100 })),
          UI.field('Degrés (°)', UI.num(5.71, function (v) { up(P.degToDpt(v)); }, { step: 0.5, min: 0, max: 60 }))
        ]),
        r1
      ]),
      UI.card('Combinaison de deux prismes', [
        el('div', { class: 'grid g2' }, [
          UI.field('Composante horizontale (Δ)', UI.num(6, function (v) { cH = v; upComb(); }, { step: 1 })),
          UI.field('Composante verticale (Δ)', UI.num(4, function (v) { cV = v; upComb(); }, { step: 1 }))
        ]),
        comb
      ]),
      UI.card('Repères de conversion',
        UI.table(['Δ', 'Degrés', 'Repère clinique'], [
          ['2 Δ', '1,1°', 'Limite de l’orthophorie de loin'],
          ['4 Δ', '2,3°', 'Test des 4 Δ (dépistage de la microtropie)'],
          ['10 Δ', '5,7°', 'Petit angle'],
          ['15 Δ', '8,5°', 'Hirschberg : 1 mm de décentrement du reflet'],
          ['30 Δ', '16,7°', 'Reflet au bord pupillaire'],
          ['58 Δ', '30°', 'Reflet au milieu de l’iris'],
          ['100 Δ', '45°', 'Reflet au limbe']
        ], { numeric: [1] }))
    ]);
  }

  /* ---------------- 3. Prentice ---------------- */
  function calcPrentice() {
    var res = el('div');
    var pw = 4, dec = 5, mode = 'prism';
    function up() {
      UI.clear(res);
      if (mode === 'prism') {
        var d = P.prentice(pw, dec);
        res.appendChild(big(Optics.r2(Math.abs(d), 2) + ' Δ'));
        res.appendChild(el('p', { class: 'small muted', html: 'Base ' + (pw * dec > 0 ? '<b>dirigée vers le décentrement</b> (verre convexe)' : '<b>opposée au décentrement</b> (verre concave)') + '.' }));
        res.appendChild(howto([
          step('prentice', 'Δ = ' + nb(pw) + ' D × ' + nb(dec, 1) + ' mm = ' + nb(pw) + ' × ' + nb(dec / 10, 2) +
            ' cm = <b>' + nb(Math.abs(d)) + ' Δ</b>',
            'On convertit d’abord le décentrement en centimètres : ' + nb(dec, 1) + ' mm = ' + nb(dec / 10, 2) + ' cm.')
        ]));
      } else {
        var mm = P.decentrationForPrism(pw, dec);
        res.appendChild(big(mm === null ? '—' : Optics.r2(Math.abs(mm), 2) + ' mm'));
        if (mm !== null) res.appendChild(howto([
          step('prentice', 'décentrement = ' + nb(dec, 1) + ' Δ / ' + nb(pw) + ' D = ' + nb(Math.abs(dec / pw), 3) +
            ' cm = <b>' + nb(Math.abs(mm)) + ' mm</b>',
            'On inverse la loi de Prentice : le décentrement cherché est le prisme voulu divisé par la puissance du verre.')
        ]));
      }
    }
    up();

    return el('div', {}, [
      UI.card('Loi de Prentice — effet prismatique d’un décentrement', [
        el('p', { class: 'mono', text: 'Δ = puissance (D) × décentrement (cm)' }),
        el('div', { class: 'grid g3' }, [
          UI.field('Puissance du verre (D)', UI.num(4, function (v) { pw = v; up(); }, { step: 0.25 })),
          UI.field('Décentrement (mm) ou prisme voulu (Δ)', UI.num(5, function (v) { dec = v; up(); }, { step: 0.5 })),
          UI.field('Calculer', UI.select([{ value: 'prism', label: 'Le prisme induit (mm → Δ)' }, { value: 'dec', label: 'Le décentrement nécessaire (Δ → mm)' }], 'prism', function (v) { mode = v; up(); }))
        ]),
        res,
        UI.note('Applications : <b>anisométropie</b> (l’effet prismatique différentiel en vision de près peut créer une diplopie verticale — au-delà de 1,5 Δ, penser au slab-off ou aux lentilles) ; <b>prismation par décentrement</b> pour les petites déviations ; <b>vérification de l’écart pupillaire</b> d’un équipement.')
      ]),
      UI.card('Effet prismatique différentiel en vision de près', [
        el('p', { class: 'muted', html: 'En lecture, le regard s’abaisse d’environ <b>8 à 10 mm</b> sous le centre optique. Pour une anisométropie de N dioptries, le prisme différentiel vaut environ <b>0,9 × N Δ</b>.' }),
        UI.table(['Anisométropie', 'Prisme vertical différentiel à 9 mm', 'Tolérance'], [
          ['1,00 D', '0,9 Δ', 'Habituellement bien tolérée'],
          ['2,00 D', '1,8 Δ', 'Limite — surveiller la gêne'],
          ['3,00 D', '2,7 Δ', 'Souvent symptomatique'],
          ['4,00 D', '3,6 Δ', 'Slab-off ou lentilles recommandés']
        ])
      ])
    ]);
  }

  /* ---------------- 4. Hirschberg / Krimsky ---------------- */
  function calcHirschberg() {
    var res = el('div');
    function up(mm) {
      UI.clear(res);
      res.appendChild(el('div', { class: 'grid g3' }, [
        UI.stat(Optics.r2(P.hirschbergMmToDeg(mm), 1) + '°', 'Angle de déviation'),
        UI.stat(Optics.r2(P.hirschbergMmToDpt(mm), 0) + ' Δ', 'Équivalent prismatique'),
        UI.stat(Optics.r2(P.krimsky(mm), 0) + ' Δ', 'Prisme de Krimsky')
      ]));
      res.appendChild(howto([
        step('hirschberg', 'angle = ' + nb(mm, 1) + ' mm × 7 = <b>' + nb(P.hirschbergMmToDeg(mm), 1) + '°</b>, ' +
          'puis Δ = 100 × tan(' + nb(P.hirschbergMmToDeg(mm), 1) + '°) = <b>' + nb(P.hirschbergMmToDpt(mm), 0) + ' Δ</b>'),
        step('krimsky', 'prisme = ' + nb(mm, 1) + ' mm × 15 = <b>' + nb(P.krimsky(mm), 0) + ' Δ</b>',
          'Le facteur 15 est le raccourci clinique de la conversion ci-dessus : 1 mm ≈ 7° ≈ 15 Δ. ' +
          'Il diverge du calcul exact pour les grands angles, où la tangente n’est plus linéaire.')
      ]));
    }
    up(1);
    return el('div', {}, [
      UI.card('Test de Hirschberg — reflets cornéens', [
        el('p', { class: 'muted', html: 'Source lumineuse à 33–40 cm, on observe la position du reflet cornéen sur l’œil dévié. Règle : <b>1 mm de décentrement ≈ 7° ≈ 15 Δ</b>.' }),
        UI.field('Décentrement du reflet (mm)', UI.num(1, function (v) { up(v); }, { step: 0.5, min: 0, max: 6 })),
        res,
        UI.table(['Position du reflet', 'Angle', 'Équivalent'],
          P.hirschbergLandmarks.map(function (h) { return [h.pos, h.deg + '°', h.dpt ? h.dpt + ' Δ' : '0']; }))
      ]),
      UI.card('Angle kappa — le piège classique', [
        el('p', { html: 'L’angle kappa est l’angle entre l’axe visuel et l’axe pupillaire.' }),
        el('ul', { html:
          '<li><b>Kappa positif</b> (reflet décalé en <i>nasal</i>) : simule une exotropie. Fréquent chez l’hypermétrope.</li>' +
          '<li><b>Kappa négatif</b> (reflet décalé en <i>temporal</i>) : simule une ésotropie. Fréquent chez le myope, ou en cas d’ectopie maculaire (rétinopathie du prématuré).</li>' }),
        UI.note('Toujours confirmer une déviation suspectée à Hirschberg par un <b>cover test</b> : c’est lui qui fait le diagnostic de tropie, pas les reflets.', 'warn')
      ])
    ]);
  }

  /* ---------------- 5. Transposition ---------------- */
  function calcTranspose() {
    var res = el('div');
    var sph = 2, cyl = -1.5, ax = 180;
    function up() {
      var t = R.transpose(sph, cyl, ax);
      var st = R.sturm(sph, cyl);
      UI.clear(res);
      res.appendChild(el('div', { class: 'grid g2' }, [
        el('div', { class: 'result-box' }, [
          el('div', { class: 'l muted small', text: 'Formule saisie' }),
          big(Optics.formatRx(sph, cyl, ax))
        ]),
        el('div', { class: 'result-box' }, [
          el('div', { class: 'l muted small', text: 'Formule transposée' }),
          big(Optics.formatRx(t.sph, t.cyl, t.axis))
        ])
      ]));
      res.appendChild(el('div', { class: 'grid g4', style: { marginTop: '12px' } }, [
        UI.stat(Optics.formatDpt(R.sphericalEquivalent(sph, cyl)), 'Équivalent sphérique'),
        UI.stat(Optics.formatDpt(st.focale1), 'Focale méridien ' + ax + '°'),
        UI.stat(Optics.formatDpt(st.focale2), 'Focale méridien ' + ((ax + 90) % 180) + '°'),
        UI.stat(st.intervalle.toFixed(2) + ' D', 'Intervalle de Sturm')
      ]));
      var type = Math.abs(cyl) < 0.25 ? 'Sphérique (pas d’astigmatisme significatif)'
        : (ax >= 160 || ax <= 20) ? (cyl < 0 ? 'Astigmatisme conforme (à la règle)' : 'Astigmatisme inverse')
        : (ax >= 70 && ax <= 110) ? (cyl < 0 ? 'Astigmatisme inverse' : 'Astigmatisme conforme')
        : 'Astigmatisme oblique';
      res.appendChild(UI.note('<b>Type :</b> ' + type + '. Le cercle de moindre diffusion se situe à l’équivalent sphérique (' +
        Optics.formatDpt(st.cercleMoindreDiffusion) + ').'));
      res.appendChild(howto([
        step('transposition',
          'sphère : ' + Optics.formatDpt(sph) + ' + (' + Optics.formatDpt(cyl) + ') = <b>' + Optics.formatDpt(t.sph) + '</b><br>' +
          'cylindre : −(' + Optics.formatDpt(cyl) + ') = <b>' + Optics.formatDpt(t.cyl) + '</b><br>' +
          'axe : ' + ax + '° ' + (ax > 90 ? '− 90' : '+ 90') + ' = <b>' + t.axis + '°</b>'),
        step('equivalent', 'ES = ' + Optics.formatDpt(sph) + ' + (' + Optics.formatDpt(cyl) + ') / 2 = <b>' +
          Optics.formatDpt(R.sphericalEquivalent(sph, cyl)) + '</b>',
          'Les deux focales sont à ' + Optics.formatDpt(st.focale1) + ' et ' + Optics.formatDpt(st.focale2) +
          ' : l’intervalle de Sturm vaut ' + st.intervalle.toFixed(2) + ' D, et le cercle de moindre diffusion tombe en son milieu.')
      ]));
    }
    up();
    return el('div', {}, [
      UI.card('Transposition cylindrique', [
        el('div', { class: 'grid g3' }, [
          UI.field('Sphère (D)', UI.num(2, function (v) { sph = v; up(); }, { step: 0.25 })),
          UI.field('Cylindre (D)', UI.num(-1.5, function (v) { cyl = v; up(); }, { step: 0.25 })),
          UI.field('Axe (°)', UI.num(180, function (v) { ax = Math.max(1, Math.min(180, v)); up(); }, { step: 5, min: 1, max: 180 }))
        ]),
        res,
        el('div', { class: 'note' }, el('span', { html:
          '<b>Les 3 étapes :</b> 1) nouvelle sphère = sphère + cylindre — 2) cylindre changé de signe — 3) axe ± 90°.' }))
      ]),
      UI.card('Puissance selon le méridien', [
        el('p', { class: 'muted', html: 'Formule : P(θ) = sphère + cylindre × sin²(θ − axe).' }),
        (function () {
          var t = UI.table(['Méridien', 'Puissance'], [0, 30, 45, 60, 90, 120, 135, 150, 180].map(function (m) {
            return [m + '°', Optics.formatDpt(R.meridianPower(sph, cyl, ax, m))];
          }));
          return t;
        })()
      ])
    ]);
  }

  /* ---------------- 6. Vergence ---------------- */
  function calcVergence() {
    var res = el('div');
    function up(cm) {
      var d = cm !== 0 ? 100 / cm : Infinity;
      UI.clear(res);
      res.appendChild(el('div', { class: 'grid g3' }, [
        UI.stat(isFinite(d) ? Optics.r2(d, 2) + ' D' : '∞', 'Vergence'),
        UI.stat(Optics.r2(cm, 1) + ' cm', 'Distance'),
        UI.stat(Optics.r2(cm / 100, 3) + ' m', 'Distance (m)')
      ]));
      res.appendChild(UI.note('Un objet à <b>' + cm + ' cm</b> impose une accommodation de <b>' + Optics.r2(d, 2) + ' D</b> à un emmétrope. ' +
        'Réciproquement, un myope de −' + Optics.r2(d, 2) + ' D voit net sans correction jusqu’à ' + cm + ' cm (punctum remotum).'));
      if (isFinite(d)) res.appendChild(howto([
        step('vergence', 'V = 1 / ' + nb(cm / 100, 3) + ' m = <b>' + nb(d) + ' D</b>',
          'On convertit d’abord la distance en mètres : ' + nb(cm, 1) + ' cm = ' + nb(cm / 100, 3) + ' m. ' +
          'Le signe est négatif pour la vergence incidente d’un objet réel ; en clinique on ne retient que la valeur absolue, ' +
          'qui est la demande d’accommodation.')
      ]));
    }
    up(40);
    return el('div', {}, [
      UI.card('Vergence ↔ distance', [
        el('div', { class: 'grid g2' }, [
          UI.field('Distance (cm)', UI.num(40, function (v) { up(v); }, { step: 5, min: 1 })),
          UI.field('Puissance (D)', UI.num(2.5, function (v) { up(v !== 0 ? 100 / v : 1000); }, { step: 0.25 }))
        ]),
        res
      ]),
      UI.card('Distances usuelles',
        UI.table(['Distance', 'Vergence', 'Contexte'], [
          ['∞ (au-delà de 5 m)', '0 D', 'Vision de loin, réfraction'],
          ['5 m', '−0,20 D', 'Distance standard des échelles françaises'],
          ['1 m', '−1,00 D', 'Skiascopie (verre de travail +1,00)'],
          ['67 cm', '−1,50 D', 'Skiascopie à 2/3 de mètre (verre +1,50)'],
          ['50 cm', '−2,00 D', 'Écran d’ordinateur'],
          ['40 cm', '−2,50 D', 'Distance de lecture standard, Parinaud'],
          ['33 cm', '−3,00 D', 'Vision de près rapprochée, Hirschberg'],
          ['25 cm', '−4,00 D', 'Distance de référence du grossissement commercial']
        ]))
    ]);
  }

  /* ---------------- 7. Accommodation ---------------- */
  function calcAccom() {
    var res = el('div');
    var age = 45, dist = 40;
    function up() {
      var h = R.hofstetter(age);
      var add = R.addition(age, dist);
      UI.clear(res);
      res.appendChild(el('div', { class: 'grid g3' }, [
        UI.stat(h.max + ' D', 'Amplitude maximale'),
        UI.stat(h.moy + ' D', 'Amplitude moyenne'),
        UI.stat(Math.max(0, h.min) + ' D', 'Amplitude minimale')
      ]));
      res.appendChild(el('div', { class: 'result-box', style: { marginTop: '12px' } }, [
        el('div', { class: 'small muted', text: 'Addition estimée pour ' + dist + ' cm' }),
        big(Optics.formatDpt(add)),
        el('div', { class: 'small muted', text: 'Besoin ' + Optics.r2(100 / dist, 2) + ' D − moitié de l’amplitude minimale (' + Optics.r2(Math.max(0, h.min) / 2, 2) + ' D)' })
      ]));
      res.appendChild(UI.note('Règle de confort : on ne laisse le sujet utiliser que <b>la moitié</b> de son amplitude d’accommodation en usage soutenu. ' +
        (age < 40 ? 'À ' + age + ' ans, aucune addition n’est en principe nécessaire.' : 'Vérifier toujours l’addition trouvée sur une échelle de Parinaud à la distance réelle de travail.')));
      res.appendChild(howto([
        step('hofstetter', 'moyenne = 18,5 − 0,3 × ' + age + ' = <b>' + h.moy + ' D</b><br>' +
          'minimale = 15 − 0,25 × ' + age + ' = <b>' + Math.max(0, h.min) + ' D</b>'),
        step('addition', 'demande = 1 / ' + nb(dist / 100, 2) + ' m = ' + nb(100 / dist) + ' D<br>' +
          'réserve gardée = ' + Math.max(0, h.min) + ' / 2 = ' + nb(Math.max(0, h.min) / 2) + ' D<br>' +
          'addition = ' + nb(100 / dist) + ' − ' + nb(Math.max(0, h.min) / 2) + ' = <b>' + Optics.formatDpt(add) + '</b>',
          'Le résultat est arrondi au quart de dioptrie, puisque c’est le pas des verres disponibles.')
      ]));
    }
    up();
    var table = UI.table(['Âge', 'Amplitude moyenne', 'Addition usuelle (40 cm)'],
      [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70].map(function (a) {
        return [a + ' ans', R.hofstetter(a).moy + ' D', Optics.formatDpt(R.addition(a, 40))];
      }), { numeric: [1, 2] });

    return el('div', {}, [
      UI.card('Amplitude d’accommodation & addition (Hofstetter)', [
        el('div', { class: 'grid g2' }, [
          UI.field('Âge (ans)', UI.num(45, function (v) { age = v; up(); }, { step: 1, min: 5, max: 90 })),
          UI.field('Distance de travail (cm)', UI.num(40, function (v) { dist = v; up(); }, { step: 5, min: 15, max: 100 }))
        ]),
        res
      ]),
      UI.card('Table de référence', table),
      UI.card('Anomalies accommodatives', [
        UI.table(['Anomalie', 'Signes', 'Mesure'], [
          ['Insuffisance d’accommodation', 'Flou de près, asthénopie, difficulté à soutenir la lecture', 'Amplitude < norme de Hofstetter − 2 D (méthode de Donders ou verres négatifs)'],
          ['Excès d’accommodation (spasme)', 'Flou de loin après le près, pseudo-myopie, céphalées', 'Réfraction sous cycloplégie ; MEM/retinoscopie dynamique'],
          ['Inertie accommodative', 'Difficulté à changer de distance', 'Flippers ±2,00 : norme 11 cycles/min en mono, 8 en bino'],
          ['Paralysie d’accommodation', 'Flou de près brutal, souvent unilatéral', 'Rechercher une cause : III, toxique, Adie']
        ])
      ])
    ]);
  }

  /* ---------------- 8. AC/A ---------------- */
  function calcACA() {
    var g = el('div'), h = el('div');
    var pw = -6, po = -2, lens = -1;
    function upG() {
      var v = B.acaGradient(pw, po, lens);
      UI.clear(g);
      g.appendChild(big(Optics.r2(Math.abs(v), 2) + ' Δ/D'));
      g.appendChild(el('p', { class: 'small', text: B.acaInterpret(Math.abs(v)) }));
      g.appendChild(howto([
        step('aca_gradient', 'AC/A = (' + nb(pw, 1) + ' − ' + nb(po, 1) + ') / ' + nb(Math.abs(lens), 2) +
          ' = ' + nb(pw - po, 1) + ' / ' + nb(Math.abs(lens), 2) + ' = <b>' + nb(Math.abs(v)) + ' Δ/D</b>',
          'Le verre de ' + nb(lens, 2) + ' D a fait varier la phorie de ' + nb(Math.abs(pw - po), 1) +
          ' Δ : c’est cette variation, rapportée à la dioptrie, qui définit le rapport.')
      ]));
    }
    var dip = 6, wd = 0.4, pn = -8, pf = -2;
    function upH() {
      var v = B.acaHeterophoria(dip, wd, pn, pf);
      UI.clear(h);
      h.appendChild(big(Optics.r2(v, 2) + ' Δ/D'));
      h.appendChild(el('p', { class: 'small', text: B.acaInterpret(v) }));
      h.appendChild(howto([
        step('aca_hetero', 'AC/A = ' + nb(dip, 1) + ' + ' + nb(wd, 2) + ' × (' + nb(pn, 1) + ' − ' + nb(pf, 1) + ')' +
          ' = ' + nb(dip, 1) + ' + ' + nb(wd, 2) + ' × ' + nb(pn - pf, 1) + ' = <b>' + nb(v) + ' Δ/D</b>',
          'La DIP est exprimée en centimètres et la distance de travail en mètres : ' +
          'ce sont ces unités qui rendent le résultat directement en Δ par dioptrie.')
      ]));
    }
    upG(); upH();

    return el('div', {}, [
      UI.card('Méthode du gradient', [
        el('p', { class: 'mono', text: 'AC/A = (phorie avec verre − phorie sans verre) / puissance du verre' }),
        el('div', { class: 'grid g3' }, [
          UI.field('Phorie sans verre (Δ)', UI.num(-2, function (v) { po = v; upG(); }, { step: 1 }), 'Éso = positif, exo = négatif'),
          UI.field('Phorie avec verre (Δ)', UI.num(-6, function (v) { pw = v; upG(); }, { step: 1 })),
          UI.field('Puissance du verre (D)', UI.num(-1, function (v) { lens = v || 1; upG(); }, { step: 0.5 }))
        ]),
        g
      ]),
      UI.card('Méthode de l’hétérophorie', [
        el('p', { class: 'mono', text: 'AC/A = DIP(cm) + distance(m) × (phorie VP − phorie VL)' }),
        el('div', { class: 'grid g4' }, [
          UI.field('DIP (cm)', UI.num(6, function (v) { dip = v; upH(); }, { step: 0.1 })),
          UI.field('Distance de travail (m)', UI.num(0.4, function (v) { wd = v; upH(); }, { step: 0.05 })),
          UI.field('Phorie de près (Δ)', UI.num(-8, function (v) { pn = v; upH(); }, { step: 1 })),
          UI.field('Phorie de loin (Δ)', UI.num(-2, function (v) { pf = v; upH(); }, { step: 1 }))
        ]),
        h
      ]),
      UI.card('Lecture clinique du AC/A',
        UI.table(['Profil', 'AC/A', 'Tableau', 'Orientation'], [
          ['Excès de convergence', 'Élevé (> 5)', 'Ésophorie/tropie de près >> de loin', 'Addition de près, double foyer'],
          ['Insuffisance de convergence', 'Bas (< 3)', 'Exophorie de près >> de loin, PPC éloigné', 'Rééducation orthoptique'],
          ['Excès de divergence', 'Élevé', 'Exotropie de loin >> de près', 'Surveillance, chirurgie si mal contrôlée'],
          ['Insuffisance de divergence', 'Bas', 'Ésophorie de loin >> de près', 'Éliminer une paralysie du VI débutante !'],
          ['Dysfonction basique', 'Normal', 'Déviation identique loin et près', 'Selon le contrôle et la symptomatologie']
        ]))
    ]);
  }

  /* ---------------- 9. Convergence ---------------- */
  function calcConvergence() {
    var res = el('div');
    var dip = 62, d = 40;
    function up() {
      var demand = B.convergenceDemand(dip, d);
      var ma = B.metreAngle(d);
      UI.clear(res);
      res.appendChild(el('div', { class: 'grid g3' }, [
        UI.stat(demand + ' Δ', 'Demande de convergence'),
        UI.stat(ma + ' AM', 'Angles métriques'),
        UI.stat(Optics.r2(demand / 2, 1) + ' Δ', 'Par œil')
      ]));
      res.appendChild(UI.note('À ' + d + ' cm avec une DIP de ' + dip + ' mm, chaque œil tourne de <b>' +
        B.dptToOcularDeg(demand / 2) + '°</b> en dedans. L’accommodation demandée est de <b>' + Optics.r2(100 / d, 2) + ' D</b>.'));
      res.appendChild(howto([
        step('convergence', 'Δ = ' + nb(dip / 10, 1) + ' cm × 100 / ' + nb(d, 1) + ' cm = ' +
          nb(dip / 10, 1) + ' × ' + nb(100 / d) + ' = <b>' + demand + ' Δ</b>',
          'La DIP passe en centimètres (' + dip + ' mm = ' + nb(dip / 10, 1) + ' cm) et 100/distance n’est autre que ' +
          'la vergence en dioptries : la demande de convergence est donc le produit de la DIP par la demande d’accommodation.'),
        step('vergence', 'accommodation = 1 / ' + nb(d / 100, 2) + ' m = <b>' + nb(100 / d) + ' D</b>',
          'Convergence et accommodation sont demandées <b>simultanément</b> à cette distance : c’est tout l’enjeu du rapport AC/A.')
      ]));
    }
    up();
    return el('div', {}, [
      UI.card('Demande de convergence', [
        el('div', { class: 'grid g2' }, [
          UI.field('Distance interpupillaire (mm)', UI.num(62, function (v) { dip = v; up(); }, { step: 1, min: 40, max: 80 })),
          UI.field('Distance de fixation (cm)', UI.num(40, function (v) { d = v; up(); }, { step: 5, min: 5 }))
        ]),
        res
      ]),
      UI.card('Vergences fusionnelles — normes de Morgan', [
        UI.table(['Mesure', 'Loin (6 m)', 'Près (40 cm)'], [
          ['Convergence — base externe (flou/rupture/recouvrement)', '9 / 19 / 10 Δ', '17 / 21 / 11 Δ'],
          ['Divergence — base interne', '— / 7 / 4 Δ', '13 / 21 / 13 Δ'],
          ['Vergence verticale', '3–4 Δ', '3–4 Δ'],
          ['Phorie', 'ortho à 2 Δ exo', '0 à 6 Δ exo'],
          ['PPC', '—', 'rupture ≤ 6–8 cm']
        ]),
        UI.note('On note toujours <b>flou / rupture / recouvrement</b>. L’absence de flou en base interne est normale (la divergence ne met pas en jeu l’accommodation).')
      ]),
      (function () {
        var sres = el('div');
        var ph = -10, rs = 14;
        function ups() {
          var sh = B.sheard(ph, rs);
          UI.clear(sres);
          sres.appendChild(el('div', { class: 'grid g3' }, [
            UI.stat(sh.need + ' Δ', 'Réserve exigée'),
            UI.stat(sh.ok ? 'Satisfait' : 'Non satisfait', 'Critère de Sheard', sh.ok ? 'var(--green)' : 'var(--red)'),
            UI.stat(sh.prism + ' Δ', 'Prisme théorique')
          ]));
          sres.appendChild(howto([
            step('sheard', 'réserve exigée = 2 × ' + nb(Math.abs(ph), 1) + ' = <b>' + sh.need + ' Δ</b>, ' +
              'réserve mesurée = ' + nb(rs, 1) + ' Δ → critère <b>' + (sh.ok ? 'satisfait' : 'non satisfait') + '</b><br>' +
              'prisme = (2 × ' + nb(Math.abs(ph), 1) + ' − ' + nb(rs, 1) + ') / 3 = <b>' + sh.prism + ' Δ</b>',
              sh.ok ? 'La réserve dépasse le double de la phorie : le patient dispose de la marge nécessaire, aucun prisme n’est justifié.'
                    : 'La réserve est insuffisante : le patient consomme plus du tiers de sa capacité, ce qui explique l’asthénopie.')
          ]));
        }
        ups();
        return UI.card('Critère de Sheard', [
          el('div', { class: 'grid g2' }, [
            UI.field('Phorie (Δ, valeur absolue)', UI.num(10, function (v) { ph = v; ups(); }, { step: 1 })),
            UI.field('Réserve fusionnelle opposée (rupture, Δ)', UI.num(14, function (v) { rs = v; ups(); }, { step: 1 }))
          ]),
          sres,
          UI.note('Sheard : la réserve opposée à la phorie doit valoir au moins <b>2 fois</b> la phorie. Le prisme théorique n’est prescrit qu’en dernier recours, après échec de la rééducation.')
        ]);
      })()
    ]);
  }

  /* ---------------- 10. Distance de sommet & basse vision ---------------- */
  function calcVertex() {
    var res = el('div');
    var p = -8, f = 12, t = 0;
    function up() {
      var np = R.vertexPower(p, f, t);
      UI.clear(res);
      res.appendChild(big(Optics.formatDpt(np) + ' D'));
      res.appendChild(el('p', { class: 'small muted', html: 'Écart : <b>' + Optics.formatDpt(np - p) + ' D</b>. ' +
        'Le calcul devient significatif au-delà de ±4,00 D.' }));
      res.appendChild(howto([
        step('vertex', 'd = (' + f + ' − ' + t + ') mm = ' + nb((f - t) / 1000, 3) + ' m<br>' +
          'P′ = ' + Optics.formatDpt(p) + ' / (1 − ' + nb((f - t) / 1000, 3) + ' × ' + Optics.formatDpt(p) + ') = <b>' +
          Optics.formatDpt(np) + '</b>',
          Math.abs(np - p) < 0.12
            ? 'À cette puissance, l’écart est inférieur au quart de dioptrie : la correction est négligeable en pratique.'
            : 'L’écart de ' + Optics.formatDpt(np - p) + ' dépasse le quart de dioptrie : il doit être appliqué.')
      ]));
    }
    up();

    var lv = el('div');
    var acu = 0.1, need = 0.4;
    function upLV() {
      UI.clear(lv);
      var gross = need / acu;
      lv.appendChild(el('div', { class: 'grid g3' }, [
        UI.stat('×' + Optics.r2(gross, 1), 'Grossissement requis'),
        UI.stat(Optics.r2(gross * 4, 1) + ' D', 'Puissance de loupe'),
        UI.stat(Optics.r2(100 / (gross * 4), 1) + ' cm', 'Distance de travail')
      ]));
      lv.appendChild(UI.note('Règle de Kestenbaum : la puissance d’addition nécessaire pour lire un texte standard est l’<b>inverse de l’acuité décimale</b> — ici ' +
        Optics.r2(R.kestenbaum(acu), 1) + ' D. Grossissement commercial d’une loupe : G = P / 4.'));
      lv.appendChild(howto([
        step('kestenbaum', 'addition = 1 / ' + nb(acu, 2) + ' = <b>' + nb(R.kestenbaum(acu), 1) + ' D</b>, ' +
          'soit une distance de lecture de <b>' + nb(100 / R.kestenbaum(acu), 1) + ' cm</b>',
          'Le grossissement commercial d’une loupe se lit G = P / 4 : ici ' + nb(R.kestenbaum(acu), 1) +
          ' D correspond à un grossissement d’environ ×' + nb(R.kestenbaum(acu) / 4, 1) + '. ' +
          'C’est un point de départ à ajuster à l’essai, avec l’éclairage définitif.')
      ]));
    }
    upLV();

    return el('div', {}, [
      UI.card('Changement de distance de sommet', [
        el('p', { class: 'mono', text: 'P′ = P / (1 − d × P)   —   d en mètres, positif si on rapproche de l’œil' }),
        el('div', { class: 'grid g3' }, [
          UI.field('Puissance du verre (D)', UI.num(-8, function (v) { p = v; up(); }, { step: 0.25 })),
          UI.field('Distance de sommet initiale (mm)', UI.num(12, function (v) { f = v; up(); }, { step: 1 })),
          UI.field('Nouvelle distance (mm)', UI.num(0, function (v) { t = v; up(); }, { step: 1 }), '0 mm = lentille de contact')
        ]),
        res,
        UI.note('En passant des lunettes aux lentilles : les <b>myopes forts</b> ont besoin de moins de puissance (le verre se rapproche de l’œil), les <b>hypermétropes forts</b> de plus.')
      ]),
      UI.card('Basse vision — grossissement nécessaire', [
        el('div', { class: 'grid g2' }, [
          UI.field('Acuité actuelle (décimale)', UI.num(0.1, function (v) { acu = v || 0.05; upLV(); }, { step: 0.05, min: 0.01 })),
          UI.field('Acuité cible (décimale)', UI.num(0.4, function (v) { need = v; upLV(); }, { step: 0.05 }))
        ]),
        lv
      ])
    ]);
  }

  /* ---------------- 11. Stéréoscopie ---------------- */
  function calcStereo() {
    var res = el('div');
    var dip = 62, dist = 40, depth = 1;
    function up() {
      var sec = B.stereoDisparity(dip, dist, depth);
      UI.clear(res);
      res.appendChild(el('div', { class: 'grid g2' }, [
        UI.stat(sec + '″', 'Disparité rétinienne'),
        UI.stat(sec <= 60 ? 'Perçu' : 'Non perçu', 'Sujet normal (seuil 60″)', sec <= 60 ? 'var(--red)' : 'var(--green)')
      ]));
      res.appendChild(UI.note('Un relief de <b>' + depth + ' cm</b> à <b>' + dist + ' cm</b> crée une disparité de <b>' + sec +
        ' secondes d’arc</b>. Un sujet dont le seuil stéréoscopique est de 60″ perçoit tout ce qui dépasse cette valeur.'));
      res.appendChild(howto([
        step('stereo', 'η = ' + nb(dip / 10, 1) + ' cm × (1/' + nb(dist, 1) + ' − 1/' + nb(dist + depth, 1) + ') rad<br>' +
          'converti en secondes d’arc (× 180/π × 3600) = <b>' + sec + '″</b>',
          'La disparité s’effondre quand la distance augmente : à ' + nb(dist * 2, 0) + ' cm, le même relief de ' +
          depth + ' cm ne donnerait plus que ' + B.stereoDisparity(dip, dist * 2, depth) + '″. ' +
          'C’est pourquoi la stéréoscopie ne sert quasiment plus au-delà de quelques dizaines de mètres.')
      ]));
    }
    up();
    return el('div', {}, [
      UI.card('Disparité et stéréo-acuité', [
        el('div', { class: 'grid g3' }, [
          UI.field('DIP (mm)', UI.num(62, function (v) { dip = v; up(); }, { step: 1 })),
          UI.field('Distance d’observation (cm)', UI.num(40, function (v) { dist = v; up(); }, { step: 5 })),
          UI.field('Différence de profondeur (cm)', UI.num(1, function (v) { depth = v; up(); }, { step: 0.5 }))
        ]),
        res
      ]),
      UI.card('Tests stéréoscopiques usuels',
        UI.table(['Test', 'Plage', 'Particularité'], [
          ['TNO', '480″ → 15″', 'Points aléatoires : aucun indice monoculaire, le plus rigoureux'],
          ['Titmus / Wirt', 'Mouche 3000″, cercles 800 → 40″', 'Indices monoculaires possibles sur la mouche'],
          ['Lang I / II', '1200 → 550″', 'Sans lunettes : idéal chez le tout-petit'],
          ['Frisby', '600 → 15″', 'Plaques d’épaisseurs variables, réel (pas de lunettes)'],
          ['Randot', '400 → 20″', 'Mixte points aléatoires + contours']
        ]))
    ]);
  }

  /* ---------------- Registre des calculatrices ---------------- */
  var CALCS = [
    { id: 'acuity', name: 'Acuité visuelle', ic: '🔠', d: 'Monoyer, décimal, logMAR, Snellen, Parinaud, MAR, cpd', fn: calcAcuity },
    { id: 'prism', name: 'Prismes & degrés', ic: '🔺', d: 'Δ ↔ degrés, combinaison de prismes, repères', fn: calcPrism },
    { id: 'prentice', name: 'Loi de Prentice', ic: '📐', d: 'Décentrement, prismation, anisométropie', fn: calcPrentice },
    { id: 'hirschberg', name: 'Hirschberg & Krimsky', ic: '💡', d: 'Reflets cornéens, angle kappa', fn: calcHirschberg },
    { id: 'transpose', name: 'Transposition & astigmatisme', ic: '🔄', d: 'Cyl+ / cyl−, équivalent sphérique, Sturm', fn: calcTranspose },
    { id: 'vergence', name: 'Vergence & distances', ic: '📏', d: 'Dioptries ↔ centimètres, punctum remotum', fn: calcVergence },
    { id: 'accom', name: 'Accommodation & addition', ic: '🔍', d: 'Hofstetter, presbytie, anomalies accommodatives', fn: calcAccom },
    { id: 'aca', name: 'Rapport AC/A', ic: '⚖️', d: 'Gradient, hétérophorie, interprétation', fn: calcACA },
    { id: 'converg', name: 'Convergence & vergences', ic: '🎯', d: 'Demande, normes de Morgan, Sheard', fn: calcConvergence },
    { id: 'vertex', name: 'Distance de sommet & basse vision', ic: '👓', d: 'Lunettes ↔ lentilles, grossissement', fn: calcVertex },
    { id: 'stereo', name: 'Stéréoscopie', ic: '🧊', d: 'Disparité, secondes d’arc, tests', fn: calcStereo }
  ];

  /* ============================================================
     Calcul instantané depuis la recherche rapide (Ctrl+K)
     ------------------------------------------------------------
     « 5/10 », « logmar 0,3 », « 12 delta », « 45 ans », « 33 cm »,
     « prentice 4 3 », « -2,50 -1,00 90 »… Chaque motif renvoie un
     petit tableau de conversions et le nom de la calculatrice
     complète correspondante.
     ============================================================ */
  function n(x) { return parseFloat(String(x).replace(',', '.')); }
  function f(x, d) { return x === null || x === undefined || isNaN(x) ? '—' : x.toFixed(d === undefined ? 2 : d); }

  // 12,0 → « 12 » : on ne garde la décimale que si elle sert
  function trim(x, d) { return String(parseFloat(f(x, d === undefined ? 1 : d))); }

  function acuityRows(dec) {
    if (!(dec > 0)) return null;
    return {
      title: 'Acuité ' + trim(dec * 10) + '/10',
      calc: 'acuity',
      steps: [
        ['logmar', 'logMAR = −log₁₀(' + f(dec, 2) + ') = ' + f(A.decToLogMAR(dec), 2)],
        ['mar', 'MAR = 1 / ' + f(dec, 2) + ' = ' + f(A.decToMAR(dec)) + '′']
      ],
      rows: [
        ['Décimal', f(dec, 2)],
        ['Monoyer (dixièmes)', trim(dec * 10) + '/10'],
        ['logMAR', f(A.decToLogMAR(dec), 2)],
        ['Snellen', '20/' + trim(A.decToSnellen20(dec), 0) + '  ·  6/' + trim(A.decToSnellen6(dec))],
        ['MAR', f(A.decToMAR(dec), 2) + '′'],
        ['Parinaud (≈)', 'P' + A.parinaudFor(dec)],
        ['Fréquence spatiale', f(A.decToCpd(dec), 0) + ' cycles/degré'],
        ['Optotype à 5 m', f(A.optotypeHeightMm(dec, 5), 1) + ' mm de haut']
      ]
    };
  }

  var QUICK = [
    // 12 Δ → degrés
    { re: /^(-?\d+(?:[.,]\d+)?)\s*(?:δ|delta|dp|dioptries? prismatiques?)$/i, run: function (m) {
      var d = n(m[1]);
      return { title: trim(Math.abs(d)) + ' Δ', calc: 'prism',
        steps: [['prisme', 'θ = arctan(' + trim(Math.abs(d)) + ' / 100) = ' + f(P.dptToDeg(Math.abs(d))) + '°']], rows: [
        ['En degrés', f(P.dptToDeg(Math.abs(d)), 2) + '°'],
        ['Déviation à 1 m', trim(Math.abs(d)) + ' cm'],
        ['Déviation à 33 cm', f(Math.abs(d) / 3, 2) + ' cm'],
        ['Rotation oculaire', f(P.dptToDeg(Math.abs(d)), 2) + '° (1 Δ ≈ 0,57°)'],
        ['Hirschberg (≈)', f(P.dptToDeg(Math.abs(d)) / 7, 2) + ' mm de décentrement du reflet']
      ] };
    } },
    // 3,5 ° → Δ
    { re: /^(-?\d+(?:[.,]\d+)?)\s*(?:°|deg|degr[ée]s?)$/i, run: function (m) {
      var g = Math.abs(n(m[1]));
      return { title: trim(g) + '°', calc: 'prism',
        steps: [['prisme', 'Δ = 100 × tan(' + trim(g) + '°) = ' + f(P.degToDpt(g)) + ' Δ']], rows: [
        ['En dioptries prismatiques', f(P.degToDpt(g), 2) + ' Δ'],
        ['Décentrement du reflet (Hirschberg)', f(g / 7, 2) + ' mm'],
        ['Repère', g < 15 ? 'Reflet encore dans la pupille' : g < 30 ? 'Reflet au bord pupillaire (~15°)' : g < 45 ? 'Reflet au milieu de l’iris (~30°)' : 'Reflet au limbe (~45°)']
      ] };
    } },
    // fraction : 5/10, 20/40, 6/12
    { re: /^(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)$/, run: function (m) {
      var a = n(m[1]), b = n(m[2]);
      if (!(b > 0)) return null;
      return acuityRows(b === 10 ? a / 10 : a / b);
    } },
    // logMAR
    { re: /^(?:logmar\s*(-?\d+(?:[.,]\d+)?)|(-?\d+(?:[.,]\d+)?)\s*logmar)$/i, run: function (m) {
      return acuityRows(A.logMARToDec(n(m[1] !== undefined ? m[1] : m[2])));
    } },
    // Parinaud
    { re: /^(?:p|parinaud)\s*(\d+(?:[.,]\d+)?)$/i, run: function (m) {
      var p = n(m[1]);
      var found = A.parinaudScale.filter(function (x) { return x.p === p; })[0];
      return found ? acuityRows(found.dec) : null;
    } },
    // acuité décimale seule
    { re: /^(\d(?:[.,]\d+)?)$/, run: function (m) {
      var d = n(m[1]);
      return d > 0 && d <= 2 ? acuityRows(d) : null;
    } },
    // âge → accommodation
    { re: /^(\d{1,2})\s*ans$/i, run: function (m) {
      var age = n(m[1]), h = R.hofstetter(age);
      return { title: 'Accommodation à ' + age + ' ans', calc: 'accom',
        steps: [
          ['hofstetter', 'moyenne = 18,5 − 0,3 × ' + age + ' = ' + f(h.moy) + ' D'],
          ['addition', 'add(40 cm) = 2,50 − ' + f(Math.max(0, h.min) / 2) + ' = +' + f(R.addition(age, 40)) + ' D']
        ], rows: [
        ['Amplitude maximale (Hofstetter)', f(h.max, 2) + ' D'],
        ['Amplitude moyenne attendue', f(h.moy, 2) + ' D'],
        ['Amplitude minimale', f(h.min, 2) + ' D'],
        ['Punctum proximum (moyenne)', h.moy > 0 ? f(100 / h.moy, 1) + ' cm' : '—'],
        ['Addition estimée à 40 cm', '+' + f(R.addition(age, 40), 2) + ' D'],
        ['Addition estimée à 33 cm', '+' + f(R.addition(age, 33), 2) + ' D']
      ] };
    } },
    // distance ↔ vergence
    { re: /^(\d+(?:[.,]\d+)?)\s*(cm|mm|m)$/i, run: function (m) {
      var v = n(m[1]), unit = m[2].toLowerCase();
      var metres = unit === 'cm' ? v / 100 : unit === 'mm' ? v / 1000 : v;
      if (!(metres > 0)) return null;
      return { title: trim(v) + ' ' + unit, calc: 'vergence',
        steps: [
          ['vergence', 'V = 1 / ' + f(metres, 2) + ' m = ' + f(1 / metres) + ' D'],
          ['convergence', 'Δ = 6,2 cm × 100 / ' + trim(metres * 100) + ' cm = ' + f(B.convergenceDemand(62, metres * 100), 1) + ' Δ']
        ], rows: [
        ['Vergence', f(1 / metres, 2) + ' D'],
        ['En centimètres', trim(metres * 100) + ' cm'],
        ['Accommodation demandée', f(1 / metres, 2) + ' D'],
        ['Convergence demandée (DIP 62 mm)', f(B.convergenceDemand(62, metres * 100), 1) + ' Δ'],
        ['Angle métrique', f(B.metreAngle(metres * 100), 2) + ' AM']
      ] };
    } },
    // loi de Prentice
    { re: /^prentice\s+(-?\d+(?:[.,]\d+)?)\s+(-?\d+(?:[.,]\d+)?)$/i, run: function (m) {
      var d = n(m[1]), mm = n(m[2]);
      return { title: 'Prentice — ' + f(d, 2) + ' D décentré de ' + trim(mm) + ' mm', calc: 'prentice',
        steps: [['prentice', 'Δ = ' + f(d, 2) + ' × ' + f(mm / 10, 2) + ' cm = ' + f(Math.abs(P.prentice(d, mm))) + ' Δ']], rows: [
        ['Effet prismatique', f(Math.abs(P.prentice(d, mm)), 2) + ' Δ'],
        ['Base', d > 0 ? 'Vers le décentrement (verre convexe)' : 'Opposée au décentrement (verre concave)'],
        ['Décentrement pour 1 Δ', d !== 0 ? f(Math.abs(P.decentrationForPrism(d, 1)), 2) + ' mm' : '—'],
        ['Formule', 'Δ = puissance (D) × décentrement (cm)']
      ] };
    } },
    // Hirschberg
    { re: /^hirschberg\s*(\d+(?:[.,]\d+)?)$/i, run: function (m) {
      var mm = n(m[1]);
      return { title: 'Hirschberg — reflet décentré de ' + trim(mm) + ' mm', calc: 'hirschberg',
        steps: [
          ['hirschberg', 'angle = ' + trim(mm) + ' × 7 = ' + trim(P.hirschbergMmToDeg(mm)) + '°'],
          ['krimsky', 'prisme = ' + trim(mm) + ' × 15 = ' + trim(P.krimsky(mm), 0) + ' Δ']
        ], rows: [
        ['Angle', trim(P.hirschbergMmToDeg(mm)) + '°'],
        ['En dioptries prismatiques', trim(P.hirschbergMmToDpt(mm), 0) + ' Δ'],
        ['Krimsky', trim(P.krimsky(mm), 0) + ' Δ de prisme pour recentrer'],
        ['Repère', '1 mm ≈ 7° ≈ 15 Δ']
      ] };
    } },
    // transposition : sph cyl axe
    { re: /^(-?\d+(?:[.,]\d+)?)\s+(-?\d+(?:[.,]\d+)?)\s+(\d{1,3})$/, run: function (m) {
      var sph = n(m[1]), cyl = n(m[2]), axis = n(m[3]);
      if (cyl === 0 || axis > 180) return null;
      var t = R.transpose(sph, cyl, axis), st = R.sturm(sph, cyl);
      return { title: 'Réfraction ' + Optics.formatRx(sph, cyl, axis), calc: 'transpose',
        steps: [
          ['transposition', Optics.formatDpt(sph) + ' + (' + Optics.formatDpt(cyl) + ') = ' + Optics.formatDpt(t.sph) +
            ' · cyl ' + Optics.formatDpt(t.cyl) + ' · axe ' + t.axis + '°'],
          ['equivalent', 'ES = ' + Optics.formatDpt(sph) + ' + (' + Optics.formatDpt(cyl) + ')/2 = ' +
            Optics.formatDpt(R.sphericalEquivalent(sph, cyl))]
        ], rows: [
        ['Transposée', Optics.formatRx(t.sph, t.cyl, t.axis)],
        ['Équivalent sphérique', Optics.formatDpt(R.sphericalEquivalent(sph, cyl))],
        ['Méridien de l’axe (' + axis + '°)', Optics.formatDpt(sph)],
        ['Méridien à ' + ((axis + 90) % 180 || 180) + '°', Optics.formatDpt(sph + cyl)],
        ['Intervalle de Sturm', f(st.intervalle, 2) + ' D'],
        ['Cercle de moindre diffusion', Optics.formatDpt(st.cercleMoindreDiffusion)]
      ] };
    } }
  ];

  function quickCalc(query) {
    var q = String(query || '').trim().replace(/\s+/g, ' ');
    if (!q || q.length > 40) return null;
    for (var i = 0; i < QUICK.length; i++) {
      var m = QUICK[i].re.exec(q);
      if (!m) continue;
      var r = null;
      try { r = QUICK[i].run(m); } catch (e) { r = null; }
      if (r) return r;
    }
    return null;
  }

  M.converters = {
    id: 'converters', title: 'Calculatrices', icon: '🧮', group: 'Outils',
    quickCalc: quickCalc,
    desc: 'Conversions et calculs cliniques : acuité, prismes, réfraction, AC/A…',
    keywords: 'calcul conversion acuite logmar prisme prentice transposition hofstetter aca vergence sommet stereo kestenbaum',
    render: function (ctx) {
      var current = (ctx && ctx.params && ctx.params.calc) || 'acuity';
      var body = el('div');
      var list = el('div', { class: 'card' });

      function draw(id) {
        current = id;
        UI.clear(body);
        var c = CALCS.filter(function (x) { return x.id === id; })[0];
        body.appendChild(c.fn());
        list.querySelectorAll('.nav-item').forEach(function (n) {
          n.classList.toggle('active', n.dataset.id === id);
        });
      }

      CALCS.forEach(function (c) {
        list.appendChild(el('div', {
          class: 'nav-item', dataset: { id: c.id },
          onClick: function () { draw(c.id); }
        }, [el('span', { class: 'ic', text: c.ic }), el('span', { text: c.name })]));
      });

      draw(current);

      return UI.page({
        crumb: 'Outils',
        title: 'Calculatrices & conversions',
        subtitle: 'Onze outils couvrant l’essentiel des conversions rencontrées en TD, en TP et en clinique. ' +
          'Sous chaque résultat, <b>« Comment ce résultat est obtenu »</b> donne la formule, son application à vos chiffres, ' +
          'et le raisonnement qui explique qu’elle s’écrive ainsi.'
      }, [el('div', { class: 'split-l' }, [list, body])]);
    }
  };
})();
