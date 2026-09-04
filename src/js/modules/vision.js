/* ============================================================
   Vision Lab — l'écran
   ------------------------------------------------------------
   Ce fichier ne connaît aucune expérience en particulier. Il
   tient le déroulé commun :

     choisir → comprendre → calibrer → (choisir l'œil) →
     s'entraîner → mesurer → lire.

   Tout ce qui est propre à une expérience — le dessin des
   stimuli, les blocs de consigne, les blocs du rapport — est
   déclaré par l'expérience elle-même. C'est ce qui permet d'en
   ajouter une sans rouvrir ce fichier, et surtout ce qui évite
   qu'une recherche visuelle et un encombrement se partagent un
   rapport qui ne dirait bien ni l'un ni l'autre.

   Trois choses gouvernent la mise en écran.

   D'abord, la passation est un écran à part. Pas la barre
   latérale, pas les couleurs du thème, pas une animation : un
   fond neutre, un point de fixation, les stimuli. Tout ce qui
   bouge autour d'une mesure de temps de réaction en fait partie,
   qu'on le veuille ou non.

   Ensuite, l'entraînement est obligatoire et non mesuré. Les
   premiers essais d'une tâche nouvelle mesurent surtout la
   compréhension de la consigne.

   Enfin, le rapport dit ses réserves avant ses conclusions. Une
   mesure affichée sans ce qui la soutient est une décoration.
   ============================================================ */
(function () {
  'use strict';
  var el = UI.el;
  var M = window.Modules;

  var AVIS = 'Outil pédagogique et expérimental — ne constitue pas un examen ' +
    'clinique ou un dispositif médical.';

  var MODES = {
    demo: { nom: 'Démonstration', icone: '👁',
      quoi: 'Une version courte, pour sentir le phénomène. Pas de quoi le mesurer.' },
    mesure: { nom: 'Mesure', icone: '📐',
      quoi: 'Le protocole complet. C’est celui dont le résultat vaut quelque chose.' },
    perso: { nom: 'Personnalisé', icone: '⚙️',
      quoi: 'Vos réglages, au risque d’un protocole trop court.' }
  };

  var YEUX = [
    { id: 'od', nom: 'Œil droit', aide: 'Œil gauche occlus.' },
    { id: 'og', nom: 'Œil gauche', aide: 'Œil droit occlus.' },
    { id: 'ou', nom: 'Les deux yeux', aide: 'Sans occlusion — à ne comparer qu’à d’autres mesures binoculaires.' }
  ];

  /* ------------------------------------------------------------
     L'état de l'écran
     ------------------------------------------------------------ */
  var st = {
    vue: 'labo',
    exp: null,
    mode: 'mesure',
    oeil: 'od',
    perso: {},
    sessionId: null,
    compareId: null,
    brut: false
  };
  var hote = null;
  var run = null;

  function def() { return st.exp ? Lab.def(st.exp) : null; }

  /* Ce qui empêche de mesurer : les obstacles communs — écran non calibré,
     fenêtre trop petite — et ceux que l’expérience seule connaît. Une
     excentricité de 10° ne tient pas sur tous les écrans, et un stimulus
     à moitié affiché produit un seuil net et faux. */
  function obstacles(mode) {
    var d = def();
    if (!d) return LabCalib.obstacles();
    var m = mode || st.mode;
    var p = Object.assign({}, d.defauts || {},
      m === 'perso' ? st.perso : ((d.modes || {})[m] || {}));
    return LabCalib.obstacles().concat(d.obstacles ? d.obstacles(p) : []);
  }
  function libelleOeil(o) {
    var y = YEUX.filter(function (x) { return x.id === o; })[0];
    return y ? y.nom.toLowerCase() : '—';
  }

  /* Virgule décimale : le reste de l'application écrit en français. */
  function fr(x) { return String(x).replace('.', ','); }
  function dec(x, n) { var f = Math.pow(10, n); return fr(Math.round(x * f) / f); }
  function ms(x) { return x === null || x === undefined ? '—' : Math.round(x) + ' ms'; }

  /* La trousse remise aux expériences pour qu'elles rendent leurs propres
     blocs sans redéclarer ces commodités chacune de leur côté. */
  var U = { el: el, svg: UI.svg, UI: UI, fr: fr, dec: dec, ms: ms };

  function redessiner() {
    if (!hote) return;
    UI.clear(hote);
    hote.appendChild(vue());
  }
  function aller(v) { st.vue = v; redessiner(); }

  function ouvrir(id) {
    st.exp = id;
    st.perso = Object.assign({}, (Lab.def(id) || {}).defauts || {});
    aller('accueil');
  }

  /* ============================================================
     1 · Le laboratoire — la liste des expériences
     ============================================================ */

  function vueLabo() {
    var blocs = [UI.note(AVIS, 'warn')];

    blocs.push(UI.card('Mesurer sur soi', el('div', {}, [
      el('p', { html:
        'Le reste de l’application enseigne ce que d’autres ont mesuré. Ici, vous le mesurez — ' +
        'sur vous, avec un protocole qui tient, et vous obtenez des chiffres qui sont les vôtres. ' +
        'Chaque expérience se termine par un rapport qui commente <b>vos</b> résultats, y compris ' +
        'quand ils vont à l’envers de ce qui était attendu.' }),
      el('p', { class: 'hint', html:
        'Tout se passe sur cet ordinateur. Rien n’est envoyé nulle part, et rien n’est comparé ' +
        'à une norme : ces mesures ne sont pas des examens.' })
    ])));

    blocs.push(carteCalibration());

    var empeche = obstacles();
    blocs.push(UI.card('Les expériences', el('div', { class: 'grid g2' },
      Lab.toutes().map(function (d) {
        var t = el('div', { class: 'mod-tile', style: { alignItems: 'flex-start' } }, [
          el('div', { class: 'mi', text: d.icone || '🔬' }),
          el('div', { style: { minWidth: 0 } }, [
            el('div', { class: 'mt' }, [
              el('span', { text: d.nom }),
              d.monoculaire ? el('span', { class: 'chip static', style: { marginLeft: '8px' },
                text: 'un œil à la fois' }) : null
            ]),
            el('div', { class: 'md', text: d.court || '' }),
            el('div', { class: 'hint', style: { marginTop: '6px' }, text: (d.ue || []).join(' · ') })
          ]),
          el('span', { class: 'arrow', text: '›' })
        ]);
        t.addEventListener('click', function () { ouvrir(d.id); });
        return t;
      }))));

    if (empeche.length) {
      blocs.push(UI.note('<b>Aucune mesure n’est possible pour l’instant.</b><br>' +
        empeche.map(function (o) { return '• ' + o; }).join('<br>'), 'warn'));
    }

    blocs.push(carteHistorique(null));

    return UI.page({
      crumb: 'Vision Lab',
      title: 'Vision Lab',
      subtitle: 'Un laboratoire de psychophysique visuelle, sur votre écran'
    }, blocs);
  }

  /* ============================================================
     2 · L'accueil d'une expérience
     ============================================================ */

  function vueAccueil() {
    var d = def();
    var blocs = [UI.note(AVIS, 'warn')];

    if (d.presentation) blocs.push(UI.card('Ce que l’expérience montre', d.presentation(U)));

    blocs.push(carteCalibration());

    /* Chaque mode est jugé séparément : à 10° d’excentricité un protocole
       peut ne pas tenir à l’écran alors que la démonstration, à 5°, passe.
       Condamner les trois d’un coup ferait croire l’expérience impossible. */
    var empeche = LabCalib.obstacles();
    var parMode = {};
    Object.keys(d.modes || {}).forEach(function (id) { parMode[id] = obstacles(id); });
    blocs.push(UI.card('Lancer une passation', el('div', { class: 'grid g3' },
      Object.keys(d.modes || {}).map(function (id) {
        var m = MODES[id] || { nom: id, quoi: '', icone: '•' };
        var duree = d.duree ? d.duree(id) : null;
        var bloque = parMode[id];
        var b = el('div', { class: 'mod-tile', style: { alignItems: 'flex-start' } }, [
          el('div', { class: 'mi', text: m.icone }),
          el('div', { style: { minWidth: 0 } }, [
            el('div', { class: 'mt' }, [
              el('span', { text: m.nom }),
              duree ? el('span', { class: 'chip static', style: { marginLeft: '8px' }, text: duree }) : null
            ]),
            el('div', { class: 'md', text: m.quoi })
          ])
        ]);
        if (bloque.length) {
          b.style.opacity = '0.5';
          b.style.cursor = 'not-allowed';
          b.title = bloque.join(' ');
        } else {
          b.addEventListener('click', function () {
            st.mode = id;
            aller(id === 'perso' ? 'perso' : (d.monoculaire ? 'oeil' : 'consigne'));
          });
        }
        return b;
      }))));

    /* On réunit les raisons, sans les répéter, en disant lesquelles ne
       valent que pour certains modes. */
    var raisons = [];
    Object.keys(parMode).forEach(function (id) {
      parMode[id].forEach(function (o) {
        if (raisons.indexOf(o) < 0) raisons.push(o);
      });
    });
    if (raisons.length) {
      var tout = Object.keys(parMode).every(function (id) { return parMode[id].length; });
      blocs.push(UI.note('<b>' + (tout ? 'Impossible de mesurer pour l’instant.'
        : 'Certains modes ne sont pas praticables sur cet écran.') + '</b><br>' +
        raisons.map(function (o) { return '• ' + o; }).join('<br>'), 'warn'));
    }

    blocs.push(carteHistorique(d.id));
    blocs.push(el('div', { class: 'btn-row' },
      UI.btn('← Toutes les expériences', function () { st.exp = null; aller('labo'); })));

    return UI.page({ crumb: 'Vision Lab', title: d.nom, subtitle: d.court }, blocs);
  }

  /* ============================================================
     3 · La calibration
     ------------------------------------------------------------
     Sans elle, « 40 pixels » ne veut rien dire. On la range par
     écran : rebrancher un moniteur externe doit redemander une
     mesure, pas réutiliser silencieusement celle du portable.
     ============================================================ */

  function carteCalibration() {
    var r = LabCalib.resume();
    if (r) {
      return UI.card('Écran calibré', el('div', {}, [
        el('div', { class: 'grid g3', style: { marginBottom: '10px' } }, [
          UI.stat(fr(r.pouces) + '"', 'diagonale déduite'),
          UI.stat(r.distanceCm + ' cm', 'distance des yeux'),
          UI.stat(fr(r.pxParDegre) + ' px', 'pour 1° d’angle')
        ]),
        el('div', { class: 'hint', text:
          'Écran ' + r.ecran + (r.hz ? ' · ' + r.hz + ' Hz mesurés' : ' · fréquence non mesurée') +
          ' · réglé le ' + new Date(r.at).toLocaleDateString('fr-FR') }),
        el('div', { class: 'btn-row', style: { marginTop: '10px' } }, [
          UI.btn('Refaire la calibration', function () { aller('calib'); }),
          UI.btn('Oublier', function () { LabCalib.oublier(); UI.toast('Calibration effacée'); redessiner(); })
        ])
      ]));
    }
    return UI.card('Écran non calibré', el('div', {}, [
      el('p', { html:
        'Les stimuli sont définis en <b>degrés d’angle visuel</b>, la seule unité qui ait un sens pour ' +
        'l’œil. Pour les afficher à la bonne taille, l’application doit connaître la taille physique ' +
        'd’un pixel et votre distance à l’écran. Deux minutes, une fois par écran.' }),
      el('div', { class: 'btn-row' }, UI.btn('Calibrer l’écran', function () { aller('calib'); }, 'primary'))
    ]));
  }

  function vueCalib() {
    var etat = LabCalib.etat() || {};
    var largeur = etat.carteLargeurPx || 320;
    var distance = etat.distanceCm || 60;
    var hz = etat.hz || null;

    var carte = el('div', {
      style: {
        width: largeur + 'px',
        height: Math.round(largeur * LabCalib.CARTE_MM.h / LabCalib.CARTE_MM.l) + 'px',
        borderRadius: Math.round(largeur * 0.037) + 'px',
        background: 'linear-gradient(135deg,#2b3550,#48507a)',
        border: '1px solid rgba(255,255,255,.35)',
        boxShadow: '0 6px 20px rgba(0,0,0,.35)',
        maxWidth: '100%'
      }
    });
    var mesure = el('div', { class: 'hint' });

    function majCarte(px) {
      largeur = px;
      carte.style.width = px + 'px';
      carte.style.height = Math.round(px * LabCalib.CARTE_MM.h / LabCalib.CARTE_MM.l) + 'px';
      carte.style.borderRadius = Math.round(px * 0.037) + 'px';
      var mm = LabCalib.CARTE_MM.l / px;
      mesure.textContent = 'Un pixel mesure ' + dec(mm, 3) + ' mm — ' +
        'soit ' + Math.round(25.4 / mm) + ' pixels par pouce.';
    }

    var curseur = el('input', { type: 'range', min: 150, max: 900, step: 1, value: largeur });
    curseur.addEventListener('input', function () { majCarte(parseInt(curseur.value, 10)); });
    majCarte(largeur);

    var champDist = UI.num(distance, function (v) { distance = v || 0; }, { min: 20, max: 150, step: 1 });

    var sortieHz = el('div', { class: 'hint', text: hz ? hz + ' Hz enregistrés.' : 'Non mesurée.' });
    var boutonHz = UI.btn('Mesurer la fréquence', function () {
      boutonHz.disabled = true;
      sortieHz.textContent = 'Mesure en cours…';
      LabCalib.mesurerHz(600, function (m) {
        hz = m.hz;
        sortieHz.textContent = m.hz + ' Hz (' + fr(m.brut) + ' Hz bruts sur ' + m.images + ' images). ' +
          (m.hz < 50 ? 'C’est bas : les durées d’affichage seront imprécises.'
                     : 'Une image dure ' + Math.round(1000 / m.hz) + ' ms — c’est la précision maximale des durées.');
        boutonHz.disabled = false;
      });
    });

    var valider = UI.btn('Enregistrer la calibration', function () {
      if (!(distance >= 20 && distance <= 150)) { UI.toast('Distance attendue entre 20 et 150 cm'); return; }
      LabCalib.reglerCarte(largeur);
      LabCalib.reglerDistance(distance);
      if (hz) LabCalib.reglerHz(hz);
      UI.toast('Écran calibré');
      aller(st.exp ? 'accueil' : 'labo');
    }, 'primary');

    return UI.page({
      crumb: 'Vision Lab',
      title: 'Calibrer l’écran',
      subtitle: 'Une fois par écran. La calibration est retenue séparément pour chaque configuration d’affichage.'
    }, [
      UI.card('1 · La taille d’un pixel', el('div', {}, [
        el('p', { html:
          'Posez une <b>carte bancaire</b> — ou une carte vitale, un permis, une carte de fidélité : elles ' +
          'ont toutes le format ISO 7810, normalisé à <b>85,60 × 53,98 mm</b> — à plat contre l’écran, et ' +
          'ajustez le rectangle jusqu’à ce qu’il ait exactement la même taille.' }),
        el('div', { style: { padding: '12px 0' } }, carte),
        curseur,
        mesure
      ])),
      UI.card('2 · Votre distance à l’écran', el('div', {}, [
        el('p', { html:
          'Mesurez la distance entre vos yeux et l’écran, dans la position où vous ferez l’expérience. ' +
          'C’est elle qui convertit les millimètres en degrés : à 40 cm, un même stimulus sous-tend une ' +
          'fois et demie l’angle qu’il fait à 60 cm.' }),
        UI.field('Distance (cm)', champDist, 'Une estimation à cinq centimètres près suffit ; une erreur ' +
          'de vingt centimètres change les degrés d’un tiers.'),
        el('p', { class: 'hint', html:
          'Aucune webcam n’est utilisée. Une distance mal estimée automatiquement vaudrait moins qu’une ' +
          'distance déclarée honnêtement.' })
      ])),
      UI.card('3 · La fréquence de l’écran (facultatif)', el('div', {}, [
        el('p', { html:
          'Elle borne la précision des durées : à 60 Hz, une image dure 16,7 ms et un stimulus ne peut pas ' +
          'être affiché 25 ms. La mesure compte des images réelles pendant six dixièmes de seconde.' }),
        el('div', { class: 'btn-row' }, boutonHz),
        sortieHz
      ])),
      el('div', { class: 'btn-row' }, [
        valider,
        UI.btn('Retour', function () { aller(st.exp ? 'accueil' : 'labo'); })
      ])
    ]);
  }

  /* ============================================================
     4 · Quel œil
     ------------------------------------------------------------
     L'orthoptie porte sur deux yeux. Une mesure monoculaire qui
     ne dirait pas lequel ne se comparerait à rien — et c'est
     justement la comparaison des deux qui a de la valeur.
     ============================================================ */

  function vueOeil() {
    var d = def();
    return UI.page({
      crumb: 'Vision Lab › ' + d.nom,
      title: 'Quel œil mesurez-vous ?',
      subtitle: 'Occlusez l’autre avant de commencer — la main ne suffit pas, elle laisse passer la lumière.'
    }, [
      UI.card('', el('div', { class: 'grid g3' }, YEUX.map(function (y) {
        var t = el('div', { class: 'mod-tile', style: { alignItems: 'flex-start' } }, [
          el('div', { class: 'mi', text: y.id === 'ou' ? '👀' : '👁' }),
          el('div', { style: { minWidth: 0 } }, [
            el('div', { class: 'mt', text: y.nom }),
            el('div', { class: 'md', text: y.aide })
          ])
        ]);
        t.addEventListener('click', function () { st.oeil = y.id; aller('consigne'); });
        return t;
      }))),
      UI.note('L’intérêt de cette expérience est la <b>comparaison entre les deux yeux</b>. ' +
        'Mesurez-en un, puis l’autre dans les mêmes conditions, et comparez les deux rapports : ' +
        'un écart franc entre les deux yeux d’une même personne en dit plus qu’une valeur isolée.', ''),
      el('div', { class: 'btn-row' }, UI.btn('Retour', function () { aller('accueil'); }))
    ]);
  }

  /* ============================================================
     5 · Le mode personnalisé
     ============================================================ */

  function vuePerso() {
    var d = def();
    var apercu = el('div', { class: 'hint' });
    function maj() { apercu.innerHTML = d.apercu ? d.apercu(st.perso, U) : ''; }
    var corps = d.reglages ? d.reglages(st.perso, maj, U)
      : UI.empty('⚙️', 'Cette expérience n’a pas de réglage personnalisable.');
    maj();

    return UI.page({
      crumb: 'Vision Lab › ' + d.nom,
      title: 'Protocole personnalisé',
      subtitle: 'Ce que vous changez ici change ce que la mesure vaut. Le rapport le dira.'
    }, [
      UI.card('Réglages', el('div', {}, [corps, apercu])),
      el('div', { class: 'btn-row' }, [
        UI.btn('Continuer', function () { aller(d.monoculaire ? 'oeil' : 'consigne'); }, 'primary'),
        UI.btn('Retour', function () { aller('accueil'); })
      ])
    ]);
  }

  /* ============================================================
     6 · La consigne
     ============================================================ */

  function vueConsigne() {
    var d = def();
    var p = Object.assign({}, d.defauts || {},
      st.mode === 'perso' ? st.perso : (d.modes[st.mode] || {}));

    var blocs = [];
    (d.consigne ? d.consigne(p, U) : []).forEach(function (b) { blocs.push(b); });

    blocs.push(UI.card('Les touches', el('div', {}, [
      el('div', { class: 'keyhint' }, d.reponses.map(function (r) {
        return el('span', {}, [
          el('kbd', { text: nomTouche(r.touche) }),
          el('span', { text: ' ' + r.label })
        ]);
      })),
      el('p', { class: 'hint', style: { marginTop: '8px' }, html:
        'Gardez les doigts posés sur ces touches pendant toute la passation : chercher une touche ' +
        'des yeux ajoute son propre temps à la mesure.' })
    ])));

    blocs.push(UI.card('Le déroulement', el('div', {}, [
      el('ol', { style: { margin: '0', paddingLeft: '20px', lineHeight: '1.9' } }, [
        el('li', { html: '<b>' + (p.entrainement || 0) + ' essais d’entraînement</b>, corrigés sur-le-champ. Non mesurés.' }),
        el('li', { html: 'Puis la mesure, <b>sans correction</b> et sans pause.' }),
        el('li', { html: 'Une croix de fixation précède chaque stimulus : regardez-la.' +
          (p.stimulusMs ? ' L’affichage ne dure que <b>' + p.stimulusMs + ' ms</b> — moins qu’une saccade. ' +
            'Inutile de chercher à regarder ailleurs que la croix : ce serait mesurer autre chose.' : '') }),
        el('li', { html: 'L’application passe en <b>plein écran</b>. <kbd>Échap</kbd> met en pause ; rien n’est perdu.' }),
        d.monoculaire ? el('li', { html: 'Mesure <b>' + libelleOeil(st.oeil) + '</b> : l’occlusion est-elle en place ?' }) : null
      ].filter(Boolean))
    ])));

    blocs.push(UI.note(AVIS, 'warn'));
    blocs.push(el('div', { class: 'btn-row' }, [
      UI.btn('Commencer', demarrer, 'primary'),
      UI.btn('Retour', function () { aller(d.monoculaire ? 'oeil' : 'accueil'); })
    ]));

    return UI.page({
      crumb: 'Vision Lab › ' + d.nom,
      title: 'Consigne',
      subtitle: 'Lisez-la en entier. La tâche dure moins longtemps que son explication.'
    }, blocs);
  }

  function nomTouche(t) {
    var n = { arrowup: '↑', arrowdown: '↓', arrowleft: '←', arrowright: '→' };
    return n[t] || String(t).toUpperCase();
  }

  /* ============================================================
     7 · La passation
     ------------------------------------------------------------
     Un calque plein écran, hors de la mise en page. Le canvas est
     dimensionné en pixels physiques : un bord flou se cherche plus
     lentement qu'un bord net, et cela entrerait dans la mesure.
     ============================================================ */

  function demarrer() {
    var d = def();
    var params = st.mode === 'perso' ? st.perso : {};
    var s = Lab.creer(d.id, st.mode, params);
    if (d.monoculaire) s.oeil = st.oeil;

    var calque = el('div', { class: 'lab-scene', tabindex: '-1' });
    var toile = el('canvas', { class: 'lab-toile' });
    var compteur = el('div', { class: 'lab-compteur' });
    var pause = el('div', { class: 'lab-pause', hidden: true });
    calque.appendChild(toile);
    calque.appendChild(compteur);
    calque.appendChild(pause);
    document.body.appendChild(calque);

    run = {
      s: s, d: d, i: 0, phase: 'depart', attend: false,
      t0: 0, minuteurs: [], calque: calque, toile: toile,
      compteur: compteur, pause: pause, couleurs: d.couleurs,
      geo: null, suspendu: false, fini: false
    };

    dimensionner();
    document.addEventListener('keydown', touche, true);
    document.addEventListener('fullscreenchange', changementPleinEcran);
    window.addEventListener('resize', dimensionner);

    LabCalib.demanderPleinEcran(calque);
    calque.focus();

    /* Un temps mort avant le premier essai : le passage en plein écran
       redimensionne l'écran sous les yeux, et mesurer pendant ce
       remaniement n'aurait pas de sens. */
    montrerMessage('L’entraînement commence dans un instant.',
      d.reponses.map(function (r) {
        return '<kbd>' + nomTouche(r.touche) + '</kbd> ' + r.label;
      }).join(' &nbsp; '));
    programmer(function () { essaiSuivant(); }, 1600);
  }

  function programmer(fn, delai) {
    var t = setTimeout(function () {
      if (!run) return;
      run.minuteurs = run.minuteurs.filter(function (x) { return x !== t; });
      if (!run.fini && !run.suspendu) fn();
    }, delai);
    run.minuteurs.push(t);
    return t;
  }

  function viderMinuteurs() {
    if (!run) return;
    run.minuteurs.forEach(clearTimeout);
    run.minuteurs = [];
  }

  function dimensionner() {
    if (!run) return;
    var dpr = window.devicePixelRatio || 1;
    var l = run.calque.clientWidth || window.innerWidth;
    var h = run.calque.clientHeight || window.innerHeight;
    run.toile.width = Math.round(l * dpr);
    run.toile.height = Math.round(h * dpr);
    run.toile.style.width = l + 'px';
    run.toile.style.height = h + 'px';
    run.toile.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);

    run.geo = { l: l, h: h, dpr: dpr, pxParDegre: LabCalib.pxParDegre() || 36 };
    /* Ce qui a RÉELLEMENT été affiché, décrit par l'expérience elle-même :
       un rapport qui tairait sa géométrie ne se comparerait à rien. */
    run.s.rendu = Object.assign(
      { ecran: l + '×' + h, dpr: dpr, pxParDegre: Math.round(run.geo.pxParDegre * 10) / 10 },
      run.d.rendu ? run.d.rendu(run.geo, run.s.params) : {});
  }

  function montrerMessage(titre, sous) {
    run.pause.hidden = false;
    UI.clear(run.pause);
    run.pause.appendChild(el('div', { class: 'lab-msg' }, [
      el('h2', { text: titre }),
      sous ? el('p', { html: sous }) : null
    ]));
    run.compteur.textContent = '';
  }
  function cacherMessage() { run.pause.hidden = true; UI.clear(run.pause); }

  function fond(ctx) {
    ctx.fillStyle = run.couleurs.fond;
    ctx.fillRect(0, 0, run.geo.l, run.geo.h);
  }

  function dessinerFixation(ctx) {
    fond(ctx);
    var b = Math.max(6, run.geo.pxParDegre * 0.25);
    ctx.strokeStyle = run.couleurs.fixation;
    ctx.lineWidth = Math.max(2, run.geo.pxParDegre * 0.05);
    ctx.beginPath();
    ctx.moveTo(run.geo.l / 2 - b, run.geo.h / 2); ctx.lineTo(run.geo.l / 2 + b, run.geo.h / 2);
    ctx.moveTo(run.geo.l / 2, run.geo.h / 2 - b); ctx.lineTo(run.geo.l / 2, run.geo.h / 2 + b);
    ctx.stroke();
  }

  function essaiSuivant() {
    if (!run) return;
    var s = run.s;
    if (run.i >= s.essais.length) return terminer();

    var e = s.essais[run.i];
    var ctx = run.toile.getContext('2d');
    cacherMessage();

    /* Le compteur ne s'affiche qu'entre les essais. Un chiffre qui change
       dans le coin de l'œil pendant la mesure est un stimulus de plus. */
    run.compteur.textContent = e.entrainement
      ? 'Entraînement ' + (run.i + 1) + ' / ' +
        s.essais.filter(function (x) { return x.entrainement; }).length
      : compteurMesure();

    run.phase = 'fixation';
    run.attend = false;
    dessinerFixation(ctx);

    programmer(function () {
      run.compteur.textContent = '';
      /* Un intervalle vide très court : sans lui, la disparition de la croix
         serait elle-même un signal de position. */
      programmer(function () {
        run.d.dessiner(ctx, e, run.geo, {
          couleurs: run.couleurs,
          degVersPx: function (deg) { return deg * run.geo.pxParDegre; },
          fixation: dessinerFixation
        });
        run.phase = 'stimulus';
        /* On date l'apparition APRÈS la peinture, pas à l'appel de dessin :
           entre les deux il peut s'écouler une image entière. */
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            if (!run || run.phase !== 'stimulus') return;
            run.t0 = performance.now();
            run.attend = true;
            /* Présentation brève : on efface, mais on continue d'attendre la
               réponse. Ce qui est borné, c'est le temps de REGARDER — pas
               celui de décider. */
            if (run.s.params.stimulusMs) {
              programmer(function () {
                if (run && run.phase === 'stimulus') dessinerFixation(run.toile.getContext('2d'));
              }, run.s.params.stimulusMs);
            }
          });
        });
      }, 80);
    }, s.params.fixationMs || 500);
  }

  function compteurMesure() {
    var s = run.s;
    var faits = s.reponses.filter(function (r) { return !s.essais[r.i].entrainement; }).length;
    /* Une expérience adaptative ne sait pas d'avance combien d'essais elle
       fera : afficher « 12 / 48 » serait un mensonge. On montre la part
       parcourue quand l'expérience sait l'estimer, le compte sinon. */
    var part = run.d.avancement ? run.d.avancement(s) : null;
    if (part !== null && part !== undefined) return Math.round(part * 100) + ' %';
    return (faits + 1) + ' / ' + s.essais.filter(function (x) { return !x.entrainement; }).length;
  }

  function touche(ev) {
    if (!run) return;
    var k = (ev.key || '').toLowerCase();

    if (k === 'escape') { ev.preventDefault(); suspendre(); return; }
    if (run.suspendu) {
      if (k === 'enter' || k === ' ') { ev.preventDefault(); reprendre(); }
      return;
    }
    if (!run.attend) return;

    var rep = null;
    run.d.reponses.forEach(function (r) { if (r.touche === k) rep = r; });
    if (rep === null) return;

    ev.preventDefault();
    /* `timeStamp` date l'événement à sa réception, avant la mise en file du
       gestionnaire — quelques millisecondes de moins que performance.now()
       appelé ici. On s'en sert quand il est cohérent. */
    var t = ev.timeStamp;
    var maintenant = performance.now();
    if (!(t > 0) || t > maintenant + 1 || maintenant - t > 400) t = maintenant;
    var msRep = t - run.t0;

    run.attend = false;
    var e = run.s.essais[run.i];
    var juste = run.d.juste(e, rep.val);
    if (e.entrainement) {
      /* Un essai d'entraînement ne s'enregistre pas — il ne mesure rien —
         mais il doit tout de même demander la suite : sans cela, une
         expérience adaptative ne fabriquerait jamais son premier essai
         mesuré et se terminerait à vide juste après l’entraînement. */
      Lab.prolonger(run.s, run.i, juste);
    } else {
      Lab.repondre(run.s, run.i, rep.val, msRep);
    }

    fond(run.toile.getContext('2d'));

    if (e.entrainement) {
      /* Correction immédiate pendant l'entraînement seulement : la donner
         pendant la mesure ferait ajuster la stratégie en cours de route, et
         la première moitié de la série ne mesurerait plus la même chose que
         la seconde. */
      var attendu = run.d.reponses.filter(function (r) { return r.val === e.cible; })[0];
      montrerMessage(juste ? 'Juste' : 'Faux',
        juste ? Math.round(msRep) + ' ms'
              : 'La bonne réponse était <b>' + (attendu ? attendu.label : '—') + '</b>.');
      run.i++;
      programmer(function () { bascule(); }, juste ? 700 : 1600);
    } else {
      run.i++;
      programmer(function () { essaiSuivant(); }, run.s.params.pauseMs || 300);
    }
  }

  /* La bascule entraînement → mesure mérite un arrêt : c'est là que la
     correction disparaît, et le dire évite de croire à une panne. */
  function bascule() {
    var s = run.s;
    var e = s.essais[run.i];
    var prec = s.essais[run.i - 1];
    if (e && prec && prec.entrainement && !e.entrainement) {
      montrerMessage('Entraînement terminé',
        'La mesure commence : plus de correction, plus de pause.<br>' +
        'Appuyez sur <kbd>Entrée</kbd> quand vous êtes prêt.');
      run.suspendu = true;
      /* Un bouton en plus de la touche : le pointeur est masqué pendant la
         passation mais réapparaît sur ce panneau, et rester bloqué faute
         d'avoir vu la consigne clavier serait une sortie sans issue. */
      run.pause.firstChild.appendChild(
        el('div', { class: 'btn-row', style: { marginTop: '18px' } },
          UI.btn('Commencer la mesure', reprendre, 'primary')));
      return;
    }
    essaiSuivant();
  }

  function suspendre() {
    if (!run || run.suspendu || run.fini) return;
    run.suspendu = true;
    run.attend = false;
    viderMinuteurs();
    fond(run.toile.getContext('2d'));
    montrerMessage('En pause',
      run.s.reponses.length + ' essai(s) déjà mesuré(s) — rien n’est perdu.<br>' +
      '<kbd>Entrée</kbd> pour reprendre.');
    run.pause.firstChild.appendChild(
      el('div', { class: 'btn-row', style: { justifyContent: 'center', marginTop: '18px' } }, [
        UI.btn('Reprendre', reprendre, 'primary'),
        UI.btn('Arrêter et voir les résultats', function () { terminer(true); }),
        UI.btn('Abandonner', abandonner)
      ]));
  }

  function reprendre() {
    if (!run || !run.suspendu) return;
    run.suspendu = false;
    cacherMessage();
    if (!LabCalib.pleinEcran()) LabCalib.demanderPleinEcran(run.calque);
    run.calque.focus();
    dimensionner();
    montrerMessage('Reprise…', '');
    setTimeout(function () { if (run && !run.suspendu) essaiSuivant(); }, 900);
  }

  function changementPleinEcran() {
    if (!run || run.fini) return;
    /* Sortir du plein écran change la taille apparente des stimuli : on
       n'essaie pas de continuer comme si de rien n'était. */
    if (!LabCalib.pleinEcran() && !run.suspendu) suspendre();
  }

  function nettoyerRun() {
    if (!run) return;
    run.fini = true;
    viderMinuteurs();
    document.removeEventListener('keydown', touche, true);
    document.removeEventListener('fullscreenchange', changementPleinEcran);
    window.removeEventListener('resize', dimensionner);
    LabCalib.quitterPleinEcran();
    if (run.calque && run.calque.parentNode) run.calque.parentNode.removeChild(run.calque);
    var s = run.s;
    run = null;
    return s;
  }

  function abandonner() {
    nettoyerRun();
    UI.toast('Passation abandonnée — rien n’a été enregistré');
    aller('accueil');
  }

  function terminer(interrompu) {
    var s = run.s;
    s.fin = Date.now();
    s.interrompu = !!interrompu;
    /* Relevé AVANT le démontage, qui quitte le plein écran. Une passation
       faite en fenêtre n'est pas fausse, mais elle n'a pas eu le même champ
       ni le même isolement : c'est une condition de la mesure. */
    if (s.rendu) s.rendu.pleinEcran = LabCalib.pleinEcran();
    nettoyerRun();

    if (!s.reponses.length) { UI.toast('Aucun essai mesuré'); aller('accueil'); return; }
    Lab.enregistrer(s);
    st.sessionId = s.sid;
    st.compareId = null;
    st.brut = false;
    aller('rapport');
  }

  /* ============================================================
     8 · Le rapport
     ============================================================ */

  function vueRapport() {
    var s = Lab.session(st.sessionId);
    if (!s) { aller(st.exp ? 'accueil' : 'labo'); return el('div'); }
    st.exp = s.exp;
    var d = Lab.def(s.exp);
    var a = Lab.analyser(s);
    var blocs = [];

    if (s.interrompu) {
      blocs.push(UI.note('Passation <b>interrompue</b> avant la fin : ' + s.reponses.length +
        ' essais mesurés. Les résultats reposent sur moins de matière que prévu.', 'warn'));
    }

    /* Les réserves AVANT les chiffres : lues après, elles ne servent plus. */
    if (a && a.avertissements && a.avertissements.length) {
      blocs.push(UI.note('<b>À lire avant les résultats.</b><br>' +
        a.avertissements.map(function (w) { return '• ' + w; }).join('<br>'), 'warn'));
    }

    /* Ce qui est propre à l'expérience. */
    (d.rapport ? d.rapport(a, s, U) : []).forEach(function (b) { blocs.push(b); });

    var exp = d.expliquer ? d.expliquer(a) : [];
    if (exp.length) {
      blocs.push(UI.card('Ce que vos résultats disent', el('div', {}, exp.map(function (b) {
        return el('div', { style: { marginBottom: '14px' } }, [
          el('div', { style: { fontWeight: '600', marginBottom: '4px' }, text: b.t }),
          el('p', { html: b.p, style: { margin: '0' } })
        ]);
      }))));
    }

    blocs.push(carteComparaison(s, a, d));
    blocs.push(carteBrut(s, d));
    blocs.push(carteConditions(s));

    blocs.push(el('div', { class: 'btn-row' }, [
      UI.btn('Refaire une passation', function () { aller('accueil'); }, 'primary'),
      UI.btn('Exporter en CSV', function () {
        UI.download(nomFichier(s) + '.csv', Lab.csv(s), 'text/csv');
      }),
      UI.btn('Exporter en JSON', function () {
        UI.download(nomFichier(s) + '.json', Lab.json(s), 'application/json');
      }),
      UI.btn('Supprimer cette session', function () {
        Lab.supprimer(s.sid);
        st.sessionId = null;
        UI.toast('Session supprimée');
        aller('accueil');
      })
    ]));
    blocs.push(UI.note(AVIS, 'warn'));

    return UI.page({
      crumb: 'Vision Lab › ' + d.nom,
      title: 'Rapport',
      subtitle: new Date(s.debut).toLocaleString('fr-FR') + ' · mode ' +
        ((MODES[s.mode] || {}).nom || s.mode) +
        (s.oeil ? ' · ' + libelleOeil(s.oeil) : '')
    }, blocs);
  }

  function nomFichier(s) {
    var d = new Date(s.debut);
    return 'visionlab-' + s.exp + (s.oeil ? '-' + s.oeil : '') + '-' +
      d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') +
      '-' + String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0');
  }

  /* --- comparaison avec une autre passation --- */
  function carteComparaison(s, a, d) {
    var autres = Lab.historique(s.exp).filter(function (h) { return h.sid !== s.sid; });
    if (!autres.length) {
      return UI.card('Comparer', UI.empty('📈',
        'Une seule passation de cette expérience.<br>' +
        (d.monoculaire
          ? 'Refaites-en une sur l’autre œil : c’est la comparaison qui a de la valeur.'
          : 'Refaites-en une pour comparer.')));
    }

    var corps = el('div', {});
    corps.appendChild(UI.field('Passation de référence', UI.select(
      [{ value: '', label: '— choisir une passation —' }].concat(autres.map(function (h) {
        return {
          value: h.sid,
          label: new Date(h.debut).toLocaleString('fr-FR') + ' · ' + h.mode +
            (h.oeil ? ' · ' + libelleOeil(h.oeil) : '') + ' · ' + h.reponses.length + ' essais'
        };
      })),
      st.compareId || '',
      function (v) { st.compareId = v || null; redessiner(); })));

    if (st.compareId) {
      var b = Lab.session(st.compareId);
      if (b && d.comparer) corps.appendChild(d.comparer(a, Lab.analyser(b), s, b, U));
    }
    return UI.card('Comparer à une autre passation', corps);
  }

  /* --- les essais bruts --- */
  function carteBrut(s, d) {
    var corps = el('div', {}, [
      el('p', { class: 'hint', html:
        'Tous les essais sont conservés, <b>y compris les faux</b> et ceux écartés des calculs. ' +
        'Un jeu de données amputé de ses erreurs ne se vérifie plus.' }),
      el('div', { class: 'btn-row' },
        UI.btn(st.brut ? 'Masquer les essais' : 'Voir les ' + s.reponses.length + ' essais bruts',
          function () { st.brut = !st.brut; redessiner(); }))
    ]);
    if (st.brut) {
      var sup = d.colonnes || [];
      corps.appendChild(el('div', { style: { maxHeight: '420px', overflowY: 'auto', marginTop: '10px' } },
        UI.table(['#'].concat(sup.map(function (c) { return c.nom.replace(/_/g, ' '); }))
          .concat(['réponse', 'juste', 'temps']),
          s.reponses.map(function (r, i) {
            var e = s.essais[r.i];
            var rep = d.reponses.filter(function (x) { return x.val === r.reponse; })[0];
            return [String(i + 1)]
              .concat(sup.map(function (c) { return String(c.val(e, r, s)); }))
              .concat([rep ? rep.label : String(r.reponse), r.juste ? '✓' : '✗', Math.round(r.ms) + ' ms']);
          }))));
    }
    return UI.card('Données brutes', corps);
  }

  /* --- les conditions de la mesure --- */
  function carteConditions(s) {
    var c = s.calib || {};
    var r = s.rendu || {};
    var lignes = [
      ['Écran', (c.ecran || '—') + (c.pouces ? ' · ' + fr(c.pouces) + '"' : '')],
      ['Distance déclarée', c.distanceCm ? c.distanceCm + ' cm' : '—'],
      ['Rafraîchissement', c.hz ? c.hz + ' Hz' : 'non mesuré'],
      ['Résolution angulaire', c.pxParDegre ? fr(c.pxParDegre) + ' px par degré' : '—']
    ];
    Object.keys(r).forEach(function (k) {
      if (k === 'ecran' || k === 'dpr' || k === 'pxParDegre' || k === 'pleinEcran') return;
      lignes.push([etiquette(k), fr(r[k])]);
    });
    lignes.push(['Plein écran', r.pleinEcran === undefined ? '—'
      : r.pleinEcran ? 'oui' : 'non — mesure prise en fenêtre, le champ était plus étroit']);
    if (s.oeil) lignes.push(['Œil mesuré', libelleOeil(s.oeil)]);
    lignes.push(['Graine du tirage', String(s.graine)]);
    lignes.push(['Version de l’expérience', s.exp + ' v' + s.version]);

    return UI.card('Conditions de la mesure', el('div', {}, [
      el('p', { class: 'hint', html:
        'Une mesure sans ses conditions ne se compare à rien. Ces valeurs partent avec les exports.' }),
      el('div', {}, lignes.map(function (l) { return UI.kv(l[0], l[1]); })),
      el('div', { class: 'hint', style: { marginTop: '8px' }, html:
        'La <b>graine</b> permet de régénérer exactement les mêmes essais. Pour une expérience ' +
        'adaptative, il y faut aussi vos réponses — elles sont dans l’export JSON.' })
    ]));
  }

  function etiquette(k) {
    var t = {
      elementDeg: 'Taille d’un élément', elementPx: 'Taille d’un élément (px)',
      champDeg: 'Champ de recherche', champPx: 'Champ (px)',
      champNominalDeg: 'Champ nominal', excentricitesDeg: 'Excentricités',
      tailleAnneauxDeg: 'Taille des anneaux', stimulusMs: 'Durée d’affichage (ms)'
    };
    return t[k] || k;
  }

  /* ============================================================
     9 · L'historique
     ============================================================ */

  function carteHistorique(expId) {
    var h = Lab.historique(expId);
    if (!h.length) {
      return UI.card('Vos passations', UI.empty('🔬',
        'Aucune passation pour l’instant.<br>La démonstration prend une ou deux minutes.'));
    }
    var lignes = h.map(function (s) {
      var d = Lab.def(s.exp) || {};
      var a = Lab.analyser(s);
      return [
        new Date(s.debut).toLocaleString('fr-FR'),
        expId ? ((MODES[s.mode] || {}).nom || s.mode) : (d.nom || s.exp),
        s.oeil ? libelleOeil(s.oeil) : '—',
        s.reponses.length + (s.interrompu ? ' (interrompue)' : ''),
        d.resume ? d.resume(a, U) : '—',
        el('button', { class: 'btn', text: 'Ouvrir', onClick: function () {
          st.exp = s.exp; st.sessionId = s.sid; st.compareId = null; st.brut = false;
          aller('rapport');
        } })
      ];
    });
    return UI.card('Vos passations', el('div', {}, [
      UI.table(['Date', expId ? 'Mode' : 'Expérience', 'Œil', 'Essais', 'Résultat', ''], lignes),
      el('div', { class: 'hint', style: { marginTop: '8px' }, html:
        'Tout reste sur cet ordinateur. Rien n’est envoyé nulle part.' })
    ]));
  }

  /* ============================================================
     Le module
     ============================================================ */

  function vue() {
    if (st.vue !== 'labo' && st.vue !== 'calib' && !def()) st.vue = 'labo';
    switch (st.vue) {
      case 'calib': return vueCalib();
      case 'accueil': return vueAccueil();
      case 'oeil': return vueOeil();
      case 'perso': return vuePerso();
      case 'consigne': return vueConsigne();
      case 'rapport': return vueRapport();
      default: return vueLabo();
    }
  }

  M.vision = {
    id: 'vision', title: 'Vision Lab', icon: '🔬', group: 'Pratiquer',
    desc: 'Mesurer sur soi un phénomène de la vision : recherche visuelle, encombrement, seuils.',
    keywords: 'vision lab laboratoire experience psychophysique recherche visuelle encombrement crowding bouma ' +
      'entassement amblyopie attention temps de reaction pente seuil escalier landolt excentricite ' +
      'calibration angle visuel degre stimulus optotype',

    /* Quitter le module pendant une passation doit tout démonter : un calque
       plein écran orphelin resterait au-dessus de l'application. */
    leave: function () { if (run) nettoyerRun(); },

    render: function (ctxt) {
      var p = (ctxt && ctxt.params) || {};
      /* Entrer par la navigation rouvre le laboratoire, jamais le dernier
         rapport consulté : cliquer « Vision Lab » et retomber sur des
         résultats d'hier laisse croire qu'il n'y a pas d'autre écran. Le
         redessin interne ne passe pas par ici et garde sa vue. */
      st.vue = 'labo';
      st.exp = null;
      if (p.exp && Lab.def(p.exp)) {
        var d = Lab.def(p.exp);
        st.exp = p.exp;
        st.perso = Object.assign({}, d.defauts || {});
        st.vue = 'accueil';
        if (p.mode) { st.mode = p.mode; st.vue = d.monoculaire ? 'oeil' : 'consigne'; }
        if (p.params) {
          Object.assign(st.perso, p.params);
          st.mode = 'perso';
          st.vue = d.monoculaire ? 'oeil' : 'consigne';
        }
      }
      if (p.vue) st.vue = p.vue;
      hote = el('div');
      hote.appendChild(vue());
      return hote;
    }
  };
})();
