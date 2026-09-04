/* ============================================================
   Emploi du temps — les séances de l'année, reliées aux UE
   ------------------------------------------------------------
   Les séances viennent de CELCAT (window.EDT, régénéré par
   `npm run edt`) et portent leur code d'UE. C'est tout l'intérêt
   de les faire entrer ici plutôt que de les laisser dans le
   navigateur : un créneau n'est plus une case horaire, c'est
   « UE24, que vous maîtrisez à 20 %, mercredi matin ». La fiche
   d'UE est à un clic de chaque cours, et la question « qu'est-ce
   que je révise ce soir ? » se règle en regardant demain.

   Rien n'est réglable ici sinon le groupe, et il se déduit tout
   seul du semestre déclaré dans « Mes UE ».
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
              'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  /* Le type de séance colore la barre de gauche : on doit pouvoir lire une
     semaine sans lire les mots — les cours d'un côté, le stage et les
     vacances de l'autre. */
  var COULEURS = [
    [/examen|partiel/i, 'var(--red)'],
    [/stage/i, 'var(--green)'],
    [/vacances|férié|ferie/i, 'var(--txt-3)'],
    [/rentrée|rentree/i, 'var(--amber)'],
    [/TP/, 'var(--violet)'],
    [/TD/, 'var(--blue)'],
    [/CM/, 'var(--accent)']
  ];

  function couleur(type) {
    for (var i = 0; i < COULEURS.length; i++) if (COULEURS[i][0].test(type || '')) return COULEURS[i][1];
    return 'var(--txt-3)';
  }

  /* Un créneau de stage ou de vacances n'est pas un cours : il ne compte pas
     dans les heures, et il n'y a rien à préparer la veille. */
  function estCours(ev) { return /CM|TD|TP|examen/i.test(ev.t || ''); }

  /* ---------------- Les sources ---------------- */

  /* Une même promotion peut venir de deux endroits : le fichier livré avec
     l'application (src/js/data/edt.js, figé au moment de la compilation) et
     ce que l'utilisateur a téléchargé par « Actualiser », rangé dans le
     stockage local. Il faut donc les départager, et le faire dans cet ordre :

       1. le millésime de l'identifiant — C2OPTI/271 est l'année 2027-2028,
          il périme C2OPTI/261 quelle que soit la date des relevés ;
       2. à millésime égal, la date du relevé la plus récente.

     C'est ce qui permet à une application installée il y a deux ans de
     basculer toute seule sur la bonne année universitaire dès qu'on
     actualise, sans mise à jour de l'application elle-même. */

  function millesime(id) {
    var m = String(id).match(/\/(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function sources() {
    var out = [];
    var livre = (window.EDT && window.EDT.groupes) || {};
    Object.keys(livre).forEach(function (id) {
      out.push({
        id: id, annee: livre[id].annee, label: livre[id].label, events: livre[id].events,
        genere: (window.EDT || {}).genere, telecharge: false
      });
    });
    var local = Store.state.edt || {};
    Object.keys(local).forEach(function (id) {
      var g = local[id];
      if (!g || !g.events) return;
      out.push({
        id: id, annee: g.annee, label: g.label, events: g.events,
        genere: g.genere, telecharge: true
      });
    });
    return out;
  }

  /* une seule entrée par année, la plus à jour */
  function promos() {
    var par = {};
    sources().forEach(function (g) {
      var p = par[g.annee];
      if (!p) { par[g.annee] = g; return; }
      var mg = millesime(g.id), mp = millesime(p.id);
      if (mg !== mp) { if (mg > mp) par[g.annee] = g; return; }
      if ((g.genere || '') > (p.genere || '')) par[g.annee] = g;
    });
    return Object.keys(par).map(function (k) { return par[k]; })
      .sort(function (a, b) { return a.annee - b.annee; });
  }

  function semestre(id) {
    return (window.CURRICULUM || []).filter(function (x) { return x.id === id; })[0] || null;
  }

  /* L'année suivie se déduit du semestre déclaré — S1/S2 en 1ère année, et
     ainsi de suite. On ne la redemande donc pas, mais on laisse la forcer :
     on peut redoubler, ou suivre les cours d'une autre promotion. */
  function anneeCourante() {
    var dispo = promos();
    if (!dispo.length) return null;
    function existe(n) { return dispo.filter(function (g) { return g.annee === n; }).length > 0; }
    var force = Store.state.profile.edtAnnee;
    if (force && existe(force)) return force;
    var sem = semestre(Store.state.profile.semester);
    if (sem && existe(sem.year)) return sem.year;
    return dispo[0].annee;
  }

  function promoCourante() {
    var a = anneeCourante();
    return promos().filter(function (g) { return g.annee === a; })[0] || null;
  }

  function disponible() { return promos().length > 0; }
  function seances() { var p = promoCourante(); return p ? p.events : []; }
  function anneeGroupe() { var p = promoCourante(); return p ? p.annee : null; }

  /* ---------------- Dates ---------------- */

  function moment(ev) {
    var p = ev.d.split('-'), h = (ev.s || '00:00').split(':');
    return new Date(+p[0], +p[1] - 1, +p[2], +h[0], +h[1]);
  }

  function minuit(dt) { var d = new Date(dt); d.setHours(0, 0, 0, 0); return d; }
  function aujourdhui() { return minuit(new Date()); }

  function cle(dt) {
    return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0')
      + '-' + String(dt.getDate()).padStart(2, '0');
  }

  function libelleJour(iso) {
    var p = iso.split('-'), dt = new Date(+p[0], +p[1] - 1, +p[2]);
    var ecart = Math.round((minuit(dt) - aujourdhui()) / 86400000);
    var nom = JOURS[dt.getDay()] + ' ' + dt.getDate() + ' ' + MOIS[dt.getMonth()];
    if (ecart === 0) return { nom: nom, quand: 'aujourd’hui' };
    if (ecart === 1) return { nom: nom, quand: 'demain' };
    if (ecart === -1) return { nom: nom, quand: 'hier' };
    return { nom: nom, quand: ecart > 0 ? 'dans ' + ecart + ' jours' : 'il y a ' + (-ecart) + ' jours' };
  }

  /* Le lundi de la semaine qui contient `dt` — les semaines de cours se lisent
     du lundi au dimanche, pas du dimanche au samedi. */
  function lundi(dt) {
    var d = minuit(dt);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
  }

  function duree(ev) {
    if (!ev.s || !ev.e) return 0;
    var a = ev.s.split(':'), b = ev.e.split(':');
    return ((+b[0] * 60 + +b[1]) - (+a[0] * 60 + +a[1])) / 60;
  }

  function heuresLisibles(h) {
    var t = Math.round(h * 60);
    return (t % 60 === 0) ? (t / 60) + ' h' : Math.floor(t / 60) + ' h ' + String(t % 60).padStart(2, '0');
  }

  /* ---------------- Le lien avec le référentiel ---------------- */

  /* Un même code peut vivre dans plusieurs semestres — UE06, l'anglais, court
     sur les six. On tranche par l'année du groupe, puis par la période : de
     septembre à janvier c'est le semestre impair de l'année, ensuite l'autre. */
  function ueDuCours(ev) {
    if (!ev.ue) return null;
    var annee = anneeGroupe();
    var sems = (window.CURRICULUM || []).filter(function (s) { return s.year === annee; });
    if (!sems.length) return null;
    var mois = +ev.d.slice(5, 7);
    var ordre = (mois >= 8 || mois <= 1) ? sems : sems.slice().reverse();
    for (var i = 0; i < ordre.length; i++) {
      var u = ordre[i].ues.filter(function (x) { return x.code === ev.ue; })[0];
      if (u) return { semId: ordre[i].id, sem: ordre[i], ue: u };
    }
    return null;
  }

  function maitrise(lien) {
    if (!lien || !M.studies || !M.studies.ueMastery) return null;
    try { return M.studies.ueMastery(lien.semId, lien.ue.code); } catch (e) { return null; }
  }

  function ouvrirUE(lien) {
    App.go('studies', { sem: lien.semId, ue: lien.ue.code });
  }

  /* ---------------- Sélections ---------------- */

  function aPartirDe(dt, jours) {
    var debut = cle(minuit(dt));
    var fin = new Date(minuit(dt));
    fin.setDate(fin.getDate() + (jours || 14));
    var borne = cle(fin);
    return seances().filter(function (ev) { return ev.d >= debut && ev.d < borne; });
  }

  /* La prochaine séance à préparer : on saute le stage, les vacances et les
     fériés, qui ne demandent aucune révision la veille. */
  function prochainCours() {
    var maintenant = new Date();
    var liste = seances().filter(estCours);
    for (var i = 0; i < liste.length; i++) {
      if (moment(liste[i]) >= maintenant) return liste[i];
    }
    return null;
  }

  function parJour(liste) {
    var jours = [], index = {};
    liste.forEach(function (ev) {
      if (!index[ev.d]) { index[ev.d] = { d: ev.d, events: [] }; jours.push(index[ev.d]); }
      index[ev.d].events.push(ev);
    });
    jours.sort(function (a, b) { return a.d.localeCompare(b.d); });
    return jours;
  }

  /* ---------------- Rendu d'une séance ---------------- */

  function ligne(ev, opts) {
    opts = opts || {};
    var lien = ueDuCours(ev);
    var m = lien ? maitrise(lien) : null;
    var titre = lien ? lien.ue.title : (ev.titre || ev.t);

    var meta = [];
    if (ev.salle) meta.push(ev.salle);
    if (ev.site) meta.push(ev.site);

    return el('div', { class: 'edt-row' }, [
      el('span', { class: 'edt-bar', style: { background: couleur(ev.t) } }),
      el('div', { class: 'edt-when' }, [
        el('div', { class: 'edt-h', text: ev.s || '' }),
        el('div', { class: 'edt-e', text: ev.e || '' })
      ]),
      el('div', { class: 'edt-what' }, [
        el('div', { class: 'edt-t' }, [
          el('span', { class: 'edt-type', style: { color: couleur(ev.t) }, text: ev.t }),
          ev.ue ? el('b', { text: ' · ' + ev.ue }) : null,
          /* trois séances de l'année portent deux UE : la seconde était
             jusqu'ici présentée comme une salle */
          ev.aussi && ev.aussi.length
            ? el('span', { class: 'muted small', text: ' + ' + ev.aussi.join(' + ') }) : null,
          duree(ev) ? el('span', { class: 'muted small', text: ' · ' + heuresLisibles(duree(ev)) }) : null
        ].filter(Boolean)),
        titre && titre !== ev.t ? el('div', { class: 'edt-ti', text: titre }) : null,
        /* La remarque de l'enseignant dit ce que la séance contient vraiment
           — « Méthodologie de travail, 1ère partie ». Elle n'a rien à faire
           dans la ligne des lieux : on la met sous l'intitulé, où on la lit. */
        ev.note ? el('div', { class: 'edt-note', text: ev.note }) : null,
        meta.length ? el('div', { class: 'edt-m', text: meta.join(' · ') }) : null
      ].filter(Boolean)),
      el('div', { class: 'edt-act' }, [
        m && m.pct !== null ? el('span', {
          class: 'chip static', style: { color: m.color, borderColor: m.color }, text: m.pct + ' %',
          title: 'Votre maîtrise de ' + lien.ue.code + ' — ' + m.label
        }) : null,
        lien ? UI.btn(opts.court ? 'Fiche' : 'Fiche d’UE', function () { ouvrirUE(lien); }, 'sm') : null
      ].filter(Boolean))
    ]);
  }

  function blocJour(jour, opts) {
    var l = libelleJour(jour.d);
    var heures = jour.events.filter(estCours).reduce(function (a, e) { return a + duree(e); }, 0);
    return el('div', { class: 'edt-day' + (l.quand === 'aujourd’hui' ? ' today' : '') }, [
      el('div', { class: 'edt-dh' }, [
        el('span', { class: 'edt-dn', text: l.nom }),
        el('span', { class: 'edt-dq', text: l.quand }),
        el('span', { class: 'spacer' }),
        heures ? el('span', { class: 'muted small', text: heuresLisibles(heures) + ' de cours' }) : null
      ].filter(Boolean)),
      el('div', {}, jour.events.map(function (ev) { return ligne(ev, opts); }))
    ]);
  }

  /* ---------------- Onglet « Prochains cours » ---------------- */

  function tabProchains() {
    var suivant = prochainCours();
    var lien = suivant ? ueDuCours(suivant) : null;
    var m = lien ? maitrise(lien) : null;

    var tete;
    if (!suivant) {
      var bt = actualisable()
        ? UI.btn('↻  Actualiser maintenant', function () { actualiser(bt, function () { App.go('edt'); }); }, 'primary')
        : null;
      tete = UI.card('Plus rien de programmé', [
        el('p', { class: 'mt0', html:
          'L’emploi du temps chargé ne contient plus de cours à venir. ' +
          'Il court jusqu’au <b>' + (function () {
            var s = seances(); var d = s.length ? s[s.length - 1].d.split('-') : null;
            return d ? d[2] + ' ' + MOIS[+d[1] - 1] + ' ' + d[0] : '—';
          })() + '</b>' + (actualisable()
            ? ' : allez chercher les séances publiées depuis.'
            : ' : relancez <code>npm run edt</code> quand la scolarité aura publié la suite.') }),
        bt ? el('div', { class: 'btn-row' }, [bt]) : null
      ].filter(Boolean));
    } else {
      var l = libelleJour(suivant.d);
      tete = UI.card('Votre prochain cours', [
        el('div', { class: 'edt-next' }, [
          el('div', { class: 'edt-next-when' }, [
            el('div', { class: 'edt-next-q', text: l.quand }),
            el('div', { class: 'edt-next-d', text: l.nom }),
            el('div', { class: 'edt-next-h', text: suivant.s + ' – ' + suivant.e })
          ]),
          el('div', { class: 'edt-next-what' }, [
            el('div', { class: 'edt-next-ue', text: (suivant.ue ? suivant.ue + ' · ' : '') + (lien ? lien.ue.title : (suivant.titre || suivant.t)) }),
            el('div', { class: 'muted', text: suivant.t + (suivant.salle ? ' · ' + suivant.salle : '') + (suivant.site ? ' · ' + suivant.site : '') }),
            m && m.pct !== null ? el('p', { class: 'small', style: { margin: '8px 0 0' }, html:
                'Vous maîtrisez cette UE à <b style="color:' + m.color + '">' + m.pct + ' %</b> — ' + m.label.toLowerCase() +
                '. ' + (m.pct < 55 ? 'La fiche avant le cours vous fera gagner l’heure où l’on décroche.' : 'De quoi suivre sans effort.') })
              : lien ? el('p', { class: 'small muted', style: { margin: '8px 0 0' }, text:
                  'Vous n’avez jamais travaillé cette UE : la fiche donne le plan du cours en trois minutes.' })
              : null,
            el('div', { class: 'btn-row mt16' }, [
              lien ? UI.btn('🎓  Ouvrir la fiche de ' + lien.ue.code, function () { ouvrirUE(lien); }, 'primary') : null,
              UI.btn('⚡  Séance du jour', function () { App.go('session'); })
            ].filter(Boolean))
          ].filter(Boolean))
        ])
      ]);
    }

    var jours = parJour(aPartirDe(new Date(), 15));
    var liste = jours.length
      ? jours.map(function (j) { return blocJour(j); })
      : [UI.empty('📅', 'Aucune séance dans les quinze prochains jours.')];

    return el('div', {}, [
      tete,
      UI.card('Les quinze prochains jours', liste),
      encartSource()
    ]);
  }

  /* ---------------- Onglet « Semaine » ---------------- */

  function tabSemaine() {
    var hote = el('div');
    var offset = 0;

    /* On ouvre sur la semaine courante, sauf pendant les vacances d'été où
       elle est vide : mieux vaut alors montrer la première semaine de cours. */
    var premiere = seances()[0];
    if (premiere) {
      var debut = lundi(moment(premiere));
      if (debut > lundi(new Date())) {
        offset = Math.round((debut - lundi(new Date())) / (7 * 86400000));
      }
    }

    function dessiner() {
      UI.clear(hote);
      var base = lundi(new Date());
      base.setDate(base.getDate() + offset * 7);
      var fin = new Date(base); fin.setDate(fin.getDate() + 7);

      var dedans = seances().filter(function (ev) { return ev.d >= cle(base) && ev.d < cle(fin); });
      var jours = parJour(dedans);
      var heures = dedans.filter(estCours).reduce(function (a, e) { return a + duree(e); }, 0);

      var dernier = new Date(fin); dernier.setDate(dernier.getDate() - 1);
      var titre = base.getDate() + (base.getMonth() === dernier.getMonth() ? '' : ' ' + MOIS[base.getMonth()])
        + ' – ' + dernier.getDate() + ' ' + MOIS[dernier.getMonth()]
        + (dernier.getFullYear() !== new Date().getFullYear() ? ' ' + dernier.getFullYear() : '');

      hote.appendChild(UI.card(null, [
        el('div', { class: 'edt-nav' }, [
          UI.btn('‹', function () { offset--; dessiner(); }, 'sm'),
          el('div', { class: 'edt-nav-t' }, [
            el('div', { class: 'edt-nav-titre', text: titre }),
            el('div', { class: 'muted small', text: offset === 0 ? 'semaine en cours'
              : heures ? heuresLisibles(heures) + ' de cours · ' + dedans.filter(estCours).length + ' séances'
              : 'aucun cours' })
          ]),
          UI.btn('›', function () { offset++; dessiner(); }, 'sm'),
          el('span', { class: 'spacer' }),
          offset === 0 ? null : UI.btn('Cette semaine', function () { offset = 0; dessiner(); }, 'sm')
        ].filter(Boolean)),
        jours.length
          ? el('div', {}, jours.map(function (j) { return blocJour(j, { court: true }); }))
          : UI.empty('🌤', 'Rien de programmé cette semaine-là.')
      ]));
    }

    dessiner();
    return el('div', {}, [hote, encartSource()]);
  }

  /* ---------------- Onglet « Par UE » ---------------- */

  /* La même information prise par l'autre bout : non plus « quand ai-je
     cours », mais « combien d'heures cette UE pèse-t-elle dans mon année,
     et où j'en suis ». C'est la vue qui sert à décider quoi réviser. */
  function tabParUE() {
    var index = {}, ordre = [];
    var maintenant = new Date();

    seances().forEach(function (ev) {
      if (!ev.ue || !estCours(ev)) return;
      var e = index[ev.ue];
      if (!e) {
        e = index[ev.ue] = { code: ev.ue, titre: ev.titre, n: 0, h: 0, prochaine: null, passees: 0, lien: ueDuCours(ev) };
        ordre.push(e);
      }
      e.n++;
      e.h += duree(ev);
      if (moment(ev) >= maintenant) { if (!e.prochaine) e.prochaine = ev; }
      else e.passees++;
    });

    if (!ordre.length) {
      return el('div', {}, [UI.card(null, UI.empty('📚', 'Aucun cours identifié par UE dans cet emploi du temps.')), encartSource()]);
    }

    ordre.sort(function (a, b) {
      if (!a.prochaine) return 1;
      if (!b.prochaine) return -1;
      return a.prochaine.d.localeCompare(b.prochaine.d);
    });

    var rows = ordre.map(function (e) {
      var m = e.lien ? maitrise(e.lien) : null;
      var quand = e.prochaine ? libelleJour(e.prochaine.d) : null;

      return [
        el('span', {}, [
          el('b', { text: e.code }),
          el('div', { class: 'muted small', text: e.lien ? e.lien.ue.title : (e.titre || '') })
        ]),
        heuresLisibles(e.h) + '<br><span class="muted small">' + e.n + ' séance' + (e.n > 1 ? 's' : '')
          + (e.passees ? ' · ' + e.passees + ' passée' + (e.passees > 1 ? 's' : '') : '') + '</span>',
        quand ? (quand.nom + '<br><span class="muted small">' + quand.quand + ' · ' + e.prochaine.s + '</span>') : '<span class="muted">terminée</span>',
        m && m.pct !== null
          ? '<b style="color:' + m.color + '">' + m.pct + ' %</b><br><span class="muted small">' + m.label + '</span>'
          : '<span class="muted small">' + (e.lien ? 'jamais travaillée' : 'hors référentiel') + '</span>',
        e.lien ? UI.btn('Fiche', (function (l) { return function () { ouvrirUE(l); }; })(e.lien), 'sm') : ''
      ];
    });

    var totalH = ordre.reduce(function (a, e) { return a + e.h; }, 0);
    var aVenir = ordre.filter(function (e) { return e.prochaine; }).length;

    return el('div', {}, [
      UI.card('Vos UE, telles que l’emploi du temps les programme', [
        el('p', { class: 'mt0', html:
          '<b>' + ordre.length + ' UE</b> apparaissent dans l’année, pour <b>' + heuresLisibles(totalH) + '</b> de cours, ' +
          'dont <b>' + aVenir + '</b> ont encore des séances devant elles. Le classement suit le prochain cours : ' +
          'ce qui arrive en premier est en haut.' }),
        UI.table(['UE', 'Volume', 'Prochain cours', 'Votre maîtrise', ''], rows)
      ]),
      UI.note('Les heures comptées ici sont celles de l’emploi du temps réel, pas celles du référentiel : ' +
        'elles diffèrent quand des séances sont déplacées, mutualisées ou pas encore publiées. ' +
        'Le volume officiel de chaque UE reste dans « Mes UE ».'),
      encartSource()
    ]);
  }

  /* ---------------- Actualisation depuis l'application ---------------- */

  /* Le pont Electron n'existe que dans l'application installée : ouverte
     autrement (navigateur, page servie à la main), il n'y a rien à proposer,
     et le bouton disparaît plutôt que d'échouer au clic. */
  function actualisable() {
    return !!(window.ortho && window.ortho.edtPromos && window.ortho.edtFetch);
  }

  var enCours = false;

  /* Une promotion à la fois : c'est une trentaine de requêtes et 35 Ko, et
     personne ne suit trois années en même temps. */
  function actualiser(bouton, apres) {
    if (enCours) return;
    enCours = true;
    var libelle = bouton ? bouton.textContent : null;
    if (bouton) { bouton.disabled = true; bouton.textContent = 'Actualisation…'; }

    function fini(msg, erreur) {
      enCours = false;
      if (bouton) { bouton.disabled = false; bouton.textContent = libelle; }
      UI.toast(msg);
      if (!erreur && apres) apres();
    }

    window.ortho.edtPromos().then(function (r) {
      if (!r.ok) { fini(r.error, true); return; }

      var voulue = anneeCourante();
      var promo = r.promos.filter(function (p) { return p.annee === voulue; })[0] || r.promos[0];
      if (!promo) { fini('Aucune promotion d’orthoptie trouvée.', true); return; }

      return window.ortho.edtFetch(promo).then(function (g) {
        if (!g.ok) { fini(g.error, true); return; }

        var groupe = g.groupe;
        var st = Store.state;
        if (!st.edt) st.edt = {};

        /* les millésimes précédents de la même année n'ont plus d'objet :
           les garder ferait grossir le stockage à chaque rentrée */
        Object.keys(st.edt).forEach(function (id) {
          if (st.edt[id] && st.edt[id].annee === groupe.annee && id !== groupe.id) delete st.edt[id];
        });

        st.edt[groupe.id] = {
          annee: groupe.annee, label: groupe.label, events: groupe.events,
          genere: groupe.genere, anneeUniversitaire: groupe.anneeUniversitaire
        };
        /* la promotion retenue devient celle qu'on suit, sans quoi le
           téléchargement resterait invisible */
        st.profile.edtAnnee = groupe.annee;
        Store.save();

        fini(groupe.events.length + ' séances récupérées — ' + groupe.label + '.');
      });
    }).catch(function (e) {
      fini('Échec de l’actualisation : ' + (e && e.message ? e.message : e), true);
    });
  }

  /* ---------------- Bandeau de provenance ---------------- */

  function encartSource() {
    var p = promoCourante();
    if (!p) return null;
    var releve = p.genere ? new Date(p.genere) : null;
    var jours = releve ? Math.round((Date.now() - releve.getTime()) / 86400000) : null;

    var texte = 'Source : emploi du temps CELCAT de l’université, promotion <b>' + p.id + '</b>, '
      + (p.telecharge ? 'actualisé depuis l’application' : 'fourni avec l’application')
      + (releve ? ' le ' + releve.getDate() + ' ' + MOIS[releve.getMonth()] + ' ' + releve.getFullYear() : '')
      + (jours !== null && jours > 21 ? ' — soit il y a ' + jours + ' jours' : '') + '. '
      + (actualisable()
        ? 'Le bouton <b>Actualiser</b> va rechercher les dernières séances publiées.'
        : 'Hors de l’application installée, seule la commande <code>npm run edt</code> les met à jour.')
      + ' <b>En cas de doute, l’emploi du temps de l’université fait foi</b> — une salle change parfois la veille.';

    return UI.note(texte, jours !== null && jours > 45 ? 'warn' : null);
  }

  /* ---------------- Choix de la promotion ---------------- */

  /* On choisit une année, pas un identifiant CELCAT : l'identifiant change à
     chaque rentrée, l'année non. */
  function selecteurPromo(onChange) {
    var liste = promos();
    if (liste.length < 2) return null;
    var sem = semestre(Store.state.profile.semester);
    var auto = sem ? sem.year : null;

    return el('div', { class: 'flex', style: { gap: '10px', alignItems: 'center' } }, [
      el('span', { class: 'muted small', text: 'Promotion' }),
      UI.select(liste.map(function (g) {
        return { value: String(g.annee), label: g.label + (g.annee === auto ? ' — la vôtre' : '') };
      }), String(anneeCourante()), function (v) {
        var n = parseInt(v, 10);
        Store.state.profile.edtAnnee = (n === auto) ? null : n;
        Store.save();
        onChange();
      })
    ]);
  }

  /* ---------------- Module ---------------- */

  var TABS = [
    { id: 'next', label: '📌 Prochains cours' },
    { id: 'week', label: '🗓 Semaine' },
    { id: 'ue', label: '🎓 Par UE' }
  ];

  M.edt = {
    id: 'edt', title: 'Emploi du temps', icon: '📅', group: 'Mon travail',
    desc: 'Vos cours de l’année, chacun relié à la fiche de son UE',
    keywords: 'emploi du temps edt planning agenda calendrier cours semaine celcat horaire salle amphi seance stage vacances promo',

    /* --- API utilisée par l'accueil et la séance du jour --- */

    /* Une séance enrichie de tout ce qu'un autre module peut vouloir en dire :
       l'UE du référentiel qu'elle traite, sa maîtrise, et la date en clair. */
    seance: function (ev) {
      if (!ev) return null;
      var lien = ueDuCours(ev);
      return {
        event: ev, at: moment(ev), jour: libelleJour(ev.d),
        titre: lien ? lien.ue.title : (ev.titre || ev.t),
        semId: lien ? lien.semId : null,
        ue: lien ? lien.ue : null,
        maitrise: lien ? maitrise(lien) : null,
        ouvrir: lien ? function () { ouvrirUE(lien); } : null
      };
    },

    next: function () { return M.edt.seance(prochainCours()); },

    /* Ce qui tombe aujourd'hui et demain — le stage, les vacances et les
       fériés ne sont pas des cours et n'ont rien à faire dans un rappel. */
    apercu: function () {
      if (!disponible()) return null;
      var maintenant = new Date();
      var demain = new Date(maintenant); demain.setDate(demain.getDate() + 1);
      var tous = seances().filter(estCours);
      function duJour(k) {
        return tous.filter(function (ev) { return ev.d === k; }).map(M.edt.seance);
      }
      var auj = duJour(cle(maintenant));
      return {
        aujourdhui: auj,
        restant: auj.filter(function (s) { return s.at >= maintenant; }),
        demain: duJour(cle(demain)),
        next: M.edt.seance(prochainCours())
      };
    },

    /* les cours des `n` prochains jours, stage et vacances exclus */
    coursAVenir: function (n) { return aPartirDe(new Date(), n || 7).filter(estCours); },

    render: function (ctx) {
      var params = (ctx && ctx.params) || {};

      var entete = {
        crumb: 'Mon travail',
        title: 'Emploi du temps',
        subtitle: 'Vos séances de l’année, telles que la scolarité les publie — et, en face de chaque cours, ' +
          'la fiche de l’UE qu’il traite. Préparer une heure de cours coûte trois minutes ; la rattraper en coûte deux.'
      };

      /* Rien en magasin : soit l'application a été livrée sans emploi du temps,
         soit le fichier a été vidé. Dans l'application installée, un clic suffit
         à repartir de zéro — ailleurs, il faut passer par le script. */
      if (!disponible()) {
        var btVide = actualisable()
          ? UI.btn('↻  Récupérer mon emploi du temps', function () {
              actualiser(btVide, function () { App.go('edt'); });
            }, 'primary')
          : null;
        return UI.page(entete, [
          UI.card(null, [
            UI.empty('📅', actualisable()
              ? 'Aucun emploi du temps chargé.<br>Allez le chercher sur l’extranet de l’université — ' +
                'c’est public, aucun identifiant n’est demandé.'
              : 'Aucun emploi du temps chargé.<br>Lancez <code>npm run edt</code> à la racine du projet : ' +
                'le script interroge l’extranet de l’université et écrit <code>src/js/data/edt.js</code>.'),
            btVide ? el('div', { class: 'btn-row', style: { justifyContent: 'center' } }, [btVide]) : null
          ].filter(Boolean))
        ]);
      }

      var start = TABS.filter(function (t) { return t.id === params.tab; }).length ? params.tab : 'next';
      var p = promoCourante();

      var corps = el('div');
      corps.appendChild(UI.tabs(TABS, function (id) {
        return id === 'week' ? tabSemaine() : id === 'ue' ? tabParUE() : tabProchains();
      }, start));

      var btMaj = actualisable()
        ? UI.btn('↻  Actualiser', function () {
            actualiser(btMaj, function () { App.go('edt', { tab: start }); });
          }, 'sm')
        : null;

      return UI.page(entete, [
        el('div', { class: 'flex', style: { marginBottom: '14px', gap: '12px', flexWrap: 'wrap' } }, [
          UI.chip(p.label + (p.telecharge ? ' · à jour' : '')),
          el('span', { class: 'spacer' }),
          selecteurPromo(function () { App.go('edt', { tab: start }); }),
          btMaj
        ].filter(Boolean)),
        corps
      ]);
    }
  };

})();
