/* ============================================================
   L'atelier de calcul — l'écran
   ------------------------------------------------------------
   Une série de calculs tirés au sort, corrigés un par un.

   Deux partis pris.

   La solution n'est jamais accessible avant d'avoir répondu :
   il n'y a pas de bouton « voir la méthode » tant qu'on n'a pas
   validé. Un calcul qu'on relit n'est pas un calcul qu'on sait
   faire, et l'application n'a aucun moyen de distinguer les
   deux si elle laisse regarder d'abord.

   La correction ne dit pas « faux ». Elle nomme la faute quand
   elle la reconnaît — les millimètres gardés, le signe du
   logMAR, l'axe non tourné — puis redonne la méthode, la
   formule et le lien vers la calculatrice et vers l'UE d'où le
   calcul vient. Le compte rendu final compte les fautes par
   type : c'est là qu'on découvre qu'on a perdu six points sur
   une seule habitude.
   ============================================================ */
(function () {
  'use strict';
  var el = UI.el;
  var M = window.Modules;

  /* `tout` vaut mieux qu'une liste pleine : tant que l'étudiant n'a rien
     décoché, une série couvre les postes ajoutés plus tard sans qu'il ait
     à revenir dans les réglages. */
  /* Le compte rendu est partagé avec la lecture de bilan : sans ces mots-là,
     l'atelier annonçait « Aucun bilan lu pour l'instant ». */
  var MOTS = {
    title: 'Vos séries précédentes',
    vide: 'Aucune série pour l’instant.<br>La note compte un point par champ juste.',
    compte: 'Séries faites', recents: 'dernières séries'
  };

  var st = { tout: true, postes: [], niveau: 'initie', n: 10, chrono: 0 };
  var jeu = null;      /* { serie, i, res, saisies, t0, minuteur, restant, corrige } */
  var hote = null;     /* le conteneur qu'on redessine */

  /* ---------------- Chronomètre ---------------- */

  function arreter() {
    if (jeu && jeu.minuteur) { clearInterval(jeu.minuteur); jeu.minuteur = null; }
  }

  function lancerChrono(afficher) {
    arreter();
    if (!st.chrono) return;
    jeu.restant = st.chrono;
    afficher(jeu.restant);
    jeu.minuteur = setInterval(function () {
      jeu.restant--;
      afficher(jeu.restant);
      if (jeu.restant <= 0) { arreter(); valider(true); }
    }, 1000);
  }

  /* ---------------- Où trouver l'UE d'un poste ---------------- */

  function semestreDe(code) {
    var out = null;
    (window.CURRICULUM || []).forEach(function (s) {
      s.ues.forEach(function (u) { if (u.code === code && !out) out = s.id; });
    });
    return out;
  }

  /* ---------------- Réglages ---------------- */

  function actifs() {
    return st.tout ? Atelier.postes.map(function (p) { return p.id; }) : st.postes;
  }

  function ecranReglages() {
    var grille = el('div', { class: 'btn-row', style: { marginTop: '4px' } });
    var compte = el('div', { class: 'hint' });
    var partir = UI.btn('Commencer la série', commencer, 'primary');

    function majCompte() {
      var n = actifs().length;
      compte.innerHTML = n
        ? n + ' calcul(s) sur ' + Atelier.postes.length + ' — décochez ce que vous maîtrisez ' +
          'pour ne travailler que le reste.'
        : '<b>Aucun calcul sélectionné.</b> Il en faut au moins un.';
      partir.disabled = !n;
    }

    /* On bascule la puce sur place : redessiner toute la page à chaque clic
       ferait sauter le défilement au milieu d'une sélection de quatorze cases. */
    Atelier.postes.forEach(function (p) {
      var b = el('button', {
        class: 'chip' + (actifs().indexOf(p.id) >= 0 ? ' on' : ''),
        title: p.nom,
        onClick: function () {
          if (st.tout) { st.tout = false; st.postes = Atelier.postes.map(function (x) { return x.id; }); }
          var i = st.postes.indexOf(p.id);
          if (i >= 0) st.postes.splice(i, 1); else st.postes.push(p.id);
          b.classList.toggle('on', st.postes.indexOf(p.id) >= 0);
          majCompte();
        }
      }, [el('span', { text: p.ic + ' ' + p.nom })]);
      grille.appendChild(b);
    });
    majCompte();

    return UI.page({
      crumb: 'Pratiquer',
      title: 'L’atelier de calcul',
      subtitle: 'Les calculs qu’on vous demandera de poser en TP et à l’examen, tirés au sort à valeurs neuves. ' +
        'L’application ne se contente pas de corriger : quand elle reconnaît votre erreur, elle la <b>nomme</b>.'
    }, [
      Drill.brief({
        icon: '🧮',
        task: 'Une série de calculs. Vous répondez, puis vous voyez la méthode — jamais l’inverse.',
        scoring: 'Un point par champ juste, dans la tolérance de l’instrument. La note part dans votre progression.'
      }),

      UI.card('Régler la série', [
        el('div', { class: 'grid g3' }, [
          UI.field('Longueur', UI.select([
            { value: 5, label: '5 calculs — dégourdir' },
            { value: 10, label: '10 calculs — la série courante' },
            { value: 20, label: '20 calculs — série longue' }
          ], st.n, function (v) { st.n = +v; })),
          UI.field('Valeurs', UI.select([
            { value: 'initie', label: 'Rondes — on apprend la formule' },
            { value: 'rode', label: 'Quelconques — comme en clinique' }
          ], st.niveau, function (v) { st.niveau = v; }),
            'Les valeurs rondes se calculent de tête ; les autres obligent à poser le calcul.'),
          UI.field('Chronomètre', UI.select([
            { value: 0, label: 'À mon rythme' },
            { value: 60, label: '60 secondes par calcul' },
            { value: 30, label: '30 secondes — conditions d’examen' }
          ], st.chrono, function (v) { st.chrono = +v; }),
            'Le temps ne rapporte aucun point : en clinique on doit être juste, puis rapide.')
        ]),
        el('div', { class: 'field', style: { marginTop: '10px' } }, [
          el('label', { text: 'Quels calculs (tout est sélectionné par défaut)' }),
          grille,
          compte
        ]),
        el('div', { class: 'btn-row', style: { marginTop: '12px' } }, [
          partir,
          UI.btn('Tout resélectionner', function () { st.tout = true; st.postes = []; dessiner(); })
        ])
      ]),

      Drill.history('atelier', MOTS)
    ]);
  }

  /* ---------------- Déroulé ---------------- */

  function commencer() {
    var ids = st.tout ? null : st.postes.slice();
    if (ids && !ids.length) { UI.toast('Sélectionnez au moins un calcul.'); return; }
    var serie = Atelier.serie({ n: st.n, niveau: st.niveau, postes: ids });
    if (!serie.length) { UI.toast('Sélectionnez au moins un calcul.'); return; }
    Drill.begin('atelier');
    jeu = { serie: serie, i: 0, res: [], saisies: {}, corrige: null, t0: Date.now(), tq: Date.now() };
    dessiner();
  }

  function sujet() { return jeu.serie[jeu.i]; }

  function valider(parLeTemps) {
    if (!jeu || jeu.corrige) return;
    arreter();
    var s = sujet();
    var r = Atelier.corriger(s, jeu.saisies);
    r.temps = Math.round((Date.now() - jeu.tq) / 1000);
    r.parLeTemps = !!parLeTemps;
    jeu.corrige = r;
    jeu.res.push({ poste: s.poste, sujet: s, r: r });
    dessiner();
  }

  function suivant() {
    jeu.i++;
    jeu.saisies = {};
    jeu.corrige = null;
    jeu.tq = Date.now();
    dessiner();
  }

  /* ---------------- L'écran d'un calcul ---------------- */

  function ecranQuestion() {
    var s = sujet();
    var p = Atelier.poste(s.poste);
    var chronoTexte = el('span', { class: 'muted small' });

    var entrees = el('div', { class: 'grid g' + Math.min(3, s.champs.length) });
    var premier = null;
    s.champs.forEach(function (c) {
      var inp = UI.num('', function (v) { jeu.saisies[c.k] = v; }, {
        step: c.pas, disabled: !!jeu.corrige,
        placeholder: jeu.corrige ? '' : '?'
      });
      if (jeu.corrige && jeu.saisies[c.k] !== undefined && jeu.saisies[c.k] !== null) inp.value = jeu.saisies[c.k];
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); jeu.corrige ? suivant() : valider(); }
      });
      if (!premier) premier = inp;
      entrees.appendChild(UI.field(c.label + (c.unite ? ' (' + c.unite + ')' : ''), inp));
    });

    var tete = el('div', { class: 'btn-row', style: { justifyContent: 'space-between' } }, [
      el('span', { class: 'muted small', text: 'Calcul ' + (jeu.i + 1) + ' sur ' + jeu.serie.length + ' · ' + p.nom }),
      chronoTexte
    ]);

    var carte = UI.card(p.ic + ' ' + p.nom, [
      tete,
      el('p', { class: 'q-text', html: s.enonce, style: { fontSize: '1.05rem', margin: '10px 0 14px' } }),
      entrees,
      el('div', { class: 'btn-row', style: { marginTop: '12px' } }, jeu.corrige ? [
        jeu.i + 1 < jeu.serie.length
          ? UI.btn('Calcul suivant  ⏎', suivant, 'primary')
          : UI.btn('Voir le compte rendu', suivant, 'primary'),
        UI.btn('Ouvrir la calculatrice', function () { App.go('converters', { calc: p.calc }); }),
        p.ue && semestreDe(p.ue)
          ? UI.btn('Revoir ' + p.ue, function () { App.go('studies', { sem: semestreDe(p.ue), ue: p.ue }); })
          : null
      ].filter(Boolean) : [
        UI.btn('Valider  ⏎', function () { valider(); }, 'primary'),
        UI.btn('Je passe', function () { jeu.saisies = {}; valider(); })
      ])
    ]);

    var vue = el('div', {}, [carte, jeu.corrige ? correction(s, p, jeu.corrige) : null].filter(Boolean));

    if (!jeu.corrige) {
      setTimeout(function () { if (premier) premier.focus(); }, 30);
      lancerChrono(function (n) {
        chronoTexte.textContent = n > 0 ? n + ' s' : 'temps écoulé';
        chronoTexte.style.color = n <= 10 ? 'var(--red)' : n <= 20 ? 'var(--amber)' : '';
      });
    }
    return vue;
  }

  /* ---------------- La correction d'un calcul ---------------- */

  function correction(s, p, r) {
    var F = (window.FORMULAS || {})[p.formule] || {};
    var lignes = r.champs.map(function (c) {
      return [c.label, c.saisi === null ? '—' : Atelier.nb(c.saisi) + (c.unite ? ' ' + c.unite : ''),
        Atelier.nb(c.attendu) + (c.unite ? ' ' + c.unite : ''), c.ok];
    });

    var nommes = r.champs.filter(function (c) { return c.piege; });

    return UI.card(r.ok ? '✔ Juste' : '✘ À reprendre', [
      r.parLeTemps ? UI.note('<b>Temps écoulé.</b> Le calcul a été validé en l’état.', 'warn') : null,

      Drill.compare(lignes),

      /* le cœur : nommer la faute plutôt que la constater */
      nommes.length
        ? el('div', {}, nommes.map(function (c) {
            return UI.note('<b>Ce que vous avez fait.</b> ' + c.piege.dit, 'warn');
          }))
        : (r.ok ? null : UI.note('Votre écart ne correspond à aucune erreur classique — reprenez la méthode ligne à ligne.')),

      s.rappel ? UI.note('<b>La méthode.</b> ' + s.rappel) : null,
      F.f ? el('p', { class: 'mono small', text: F.f }) : null,
      (!r.ok && F.r) ? UI.note('<b>Le repère.</b> ' + F.r) : null,
      el('div', { class: 'btn-row' }, [UI.chip(r.temps + ' s', r.temps <= 30 ? 'green' : '')])
    ].filter(Boolean), { class: r.ok ? '' : 'warn' });
  }

  /* ---------------- Compte rendu ---------------- */

  function ecranFin() {
    var total = jeu.res.reduce(function (a, x) { return a + x.r.part; }, 0);
    var pct = jeu.res.length ? total * 100 / jeu.res.length : 0;
    var secondes = Math.round((Date.now() - jeu.t0) / 1000);
    var res = Drill.grade('atelier', pct, { n: jeu.res.length, niveau: st.niveau, s: secondes });

    /* les fautes regroupées : c'est ici qu'on voit l'habitude */
    var parFaute = {};
    jeu.res.forEach(function (x) {
      x.r.champs.forEach(function (c) {
        if (!c.piege) return;
        var k = c.piege.dit;
        parFaute[k] = (parFaute[k] || 0) + 1;
      });
    });
    var fautes = Object.keys(parFaute).sort(function (a, b) { return parFaute[b] - parFaute[a]; });

    /* et les postes à retravailler */
    var parPoste = {};
    jeu.res.forEach(function (x) {
      var e = parPoste[x.poste] || (parPoste[x.poste] = { n: 0, ok: 0 });
      e.n++; if (x.r.ok) e.ok++;
    });
    var faibles = Object.keys(parPoste).filter(function (k) { return parPoste[k].ok < parPoste[k].n; });

    var lignes = jeu.res.map(function (x) {
      var p = Atelier.poste(x.poste);
      var mien = x.r.champs.map(function (c) { return c.saisi === null ? '—' : Atelier.nb(c.saisi); }).join(' · ');
      var vrai = x.r.champs.map(function (c) { return Atelier.nb(c.attendu); }).join(' · ');
      return [p.ic + ' ' + p.nom, mien, vrai, x.r.ok];
    });

    return UI.page({
      crumb: 'Pratiquer',
      title: 'Compte rendu de la série',
      subtitle: jeu.res.length + ' calculs en ' + secondes + ' s, soit ' +
        Math.round(secondes / Math.max(1, jeu.res.length)) + ' s par calcul.'
    }, [
      Drill.debrief({
        score: pct, recorded: res.recorded, why: res.why, rows: lignes,
        explain: fautes.length
          ? 'Vos erreurs ne sont pas dispersées : elles se rangent en ' + fautes.length +
            ' habitude(s), listée(s) ci-dessous. Une habitude se corrige d’un coup, une erreur au hasard non.'
          : (pct >= 99 ? 'Série parfaite : passez aux valeurs quelconques, ou au chronomètre.' : null),
        actions: [
          UI.btn('Une nouvelle série', commencer, 'primary'),
          faibles.length ? UI.btn('Refaire seulement ce qui a coincé', function () {
            st.tout = false; st.postes = faibles.slice(); commencer();
          }) : null,
          UI.btn('Changer les réglages', function () { jeu = null; dessiner(); })
        ].filter(Boolean)
      }),

      fautes.length ? UI.card('Vos erreurs, regroupées', fautes.map(function (f) {
        return el('div', { class: 'sc-row ko', style: { alignItems: 'flex-start' } }, [
          el('span', { class: 'chip red', style: { flex: '0 0 auto' },
            text: parFaute[f] + '×' }),
          el('div', { class: 'sc-k', html: f, style: { textAlign: 'left' } })
        ]);
      })) : null,

      UI.card('Par calcul', UI.table(['Calcul', 'Juste'], Object.keys(parPoste).map(function (k) {
        var e = parPoste[k], p = Atelier.poste(k);
        return [p.ic + ' ' + p.nom, e.ok + ' / ' + e.n];
      }))),

      Drill.history('atelier', MOTS)
    ].filter(Boolean));
  }

  /* ---------------- Rendu ---------------- */

  function dessiner() {
    if (!hote) return;
    UI.clear(hote);
    if (!jeu) { hote.appendChild(ecranReglages()); return; }
    if (jeu.i >= jeu.serie.length) { hote.appendChild(ecranFin()); return; }
    hote.appendChild(UI.page({
      crumb: 'Pratiquer',
      title: 'L’atelier de calcul',
      subtitle: 'Série de ' + jeu.serie.length + ' calculs' +
        (st.chrono ? ' · ' + st.chrono + ' s par calcul' : '') +
        ' · valeurs ' + (st.niveau === 'rode' ? 'quelconques' : 'rondes') + '.'
    }, [ecranQuestion()]));
  }

  M.atelier = {
    id: 'atelier', title: 'Atelier de calcul', icon: '✏️', group: 'Pratiquer',
    desc: 'Poser les calculs soi-même : Prentice, logMAR, transposition, AC/A, distance de sommet…',
    keywords: 'atelier calcul exercice entrainement prentice logmar transposition aca hofstetter vertex kestenbaum convergence chronometre',
    leave: function () { arreter(); },
    render: function () {
      hote = el('div');
      dessiner();
      return hote;
    }
  };
})();
