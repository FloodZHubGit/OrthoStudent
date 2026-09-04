/* ============================================================
   Vision Lab — le moteur d'expériences
   ------------------------------------------------------------
   Ce fichier ne connaît aucune expérience en particulier. Il sait
   fabriquer une session à partir d'une DÉFINITION, la dérouler,
   l'analyser, la ranger et la ressortir. La recherche visuelle est
   la première ; le crowding, la sensibilité au contraste, le
   clignement attentionnel viendront s'y brancher sans le toucher.

   Trois décisions structurent tout le reste.

   1. UNE GRAINE, ENREGISTRÉE. Toute la variabilité — l'ordre des
      essais, la place des stimuli, le choix de la cible — sort
      d'un générateur pseudo-aléatoire semé par un entier rangé
      avec la session. Rejouer la graine redonne exactement la même
      expérience. Sans cela, on ne peut ni reproduire un résultat
      surprenant, ni vérifier qu'un tirage était équilibré.

   2. LES POSITIONS SONT TIRÉES À LA GÉNÉRATION, PAS À L'AFFICHAGE,
      et en coordonnées normalisées dans un carré unité. Deux
      raisons : elles rentrent alors dans le flux de la graine
      (donc reproductibles), et la même session se rejoue sur un
      autre écran sans changer la géométrie relative.

   3. L'ÉQUILIBRAGE PRÉCÈDE LE MÉLANGE. On construit la liste
      complète des cellules — condition × taille d'ensemble ×
      présence — répétée autant de fois que demandé, PUIS on
      mélange. Tirer au hasard à chaque essai donnerait, sur
      quarante-huit essais, des cellules à cinq et d'autres à un.

   Rien ici n'est un dispositif médical : on mesure des temps de
   réaction sur un écran grand public.
   ============================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     Hasard reproductible
     ------------------------------------------------------------
     mulberry32 : court, rapide, et surtout entièrement déterminé
     par son entier de départ. Math.random() ne peut pas être semé,
     donc ne peut pas être rejoué.
     ------------------------------------------------------------ */
  function generateur(graine) {
    var a = graine >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function graineNeuve() {
    return (Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0;
  }

  /* Fisher-Yates, alimenté par la graine. */
  function melanger(liste, rnd) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ------------------------------------------------------------
     Statistiques
     ------------------------------------------------------------
     La médiane plutôt que la moyenne pour les temps de réaction :
     leur distribution traîne à droite — une hésitation à 3 s pèse
     sur une moyenne ce que dix essais normaux ne compensent pas.
     ------------------------------------------------------------ */
  function mediane(v) {
    if (!v.length) return null;
    var a = v.slice().sort(function (x, y) { return x - y; });
    var m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }

  function moyenne(v) {
    if (!v.length) return null;
    return v.reduce(function (a, b) { return a + b; }, 0) / v.length;
  }

  function ecartType(v) {
    if (v.length < 2) return null;
    var m = moyenne(v);
    return Math.sqrt(v.reduce(function (a, x) { return a + (x - m) * (x - m); }, 0) / (v.length - 1));
  }

  /* Droite des moindres carrés. La pente est le résultat qui compte
     dans une recherche visuelle : combien de millisecondes coûte un
     élément de plus. */
  function pente(points) {
    var n = points.length;
    if (n < 2) return null;
    var sx = 0, sy = 0, sxy = 0, sxx = 0, syy = 0;
    points.forEach(function (p) {
      sx += p.x; sy += p.y; sxy += p.x * p.y; sxx += p.x * p.x; syy += p.y * p.y;
    });
    var den = n * sxx - sx * sx;
    if (!den) return null;
    var a = (n * sxy - sx * sy) / den;
    var b = (sy - a * sx) / n;
    var denR = Math.sqrt(den * (n * syy - sy * sy));
    var r = denR ? (n * sxy - sx * sy) / denR : 0;
    return { pente: a, origine: b, r2: r * r, n: n };
  }

  /* Écarte les temps aberrants avant de résumer : une réponse à 80 ms
     est une anticipation, une réponse à 12 s est une interruption.
     On garde les bornes larges et on DIT combien on a écarté — un
     nettoyage silencieux est une falsification. */
  function nettoyer(temps, min, max) {
    min = min || 150; max = max || 8000;
    var gardes = temps.filter(function (t) { return t >= min && t <= max; });
    return { gardes: gardes, ecartes: temps.length - gardes.length, min: min, max: max };
  }

  /* ------------------------------------------------------------
     Positions sans chevauchement, dans un carré unité
     ------------------------------------------------------------
     Tirage par rejet, puis repli sur une grille secouée. Le rejet
     seul peut ne jamais aboutir quand la densité monte ; sans repli,
     seize éléments feraient tourner la boucle indéfiniment.
     ------------------------------------------------------------ */
  function positions(n, distanceMin, rnd) {
    var out = [], essais = 0;
    var marge = distanceMin / 2;
    while (out.length < n && essais < n * 400) {
      essais++;
      var p = {
        x: marge + rnd() * (1 - 2 * marge),
        y: marge + rnd() * (1 - 2 * marge)
      };
      var libre = out.every(function (q) {
        return Math.hypot(p.x - q.x, p.y - q.y) >= distanceMin;
      });
      if (libre) out.push(p);
    }
    if (out.length === n) return out;

    /* Repli : une grille assez large pour n cases, chaque élément secoué
       dans sa case. La contrainte de distance est alors garantie par la
       géométrie, et le tirage reste reproductible. */
    var c = Math.ceil(Math.sqrt(n));
    var pas = 1 / c;
    var cases = [];
    for (var i = 0; i < c; i++) for (var j = 0; j < c; j++) cases.push([i, j]);
    return melanger(cases, rnd).slice(0, n).map(function (k) {
      var jitter = Math.max(0, pas - distanceMin) / 2;
      return {
        x: (k[0] + 0.5) * pas + (rnd() - 0.5) * 2 * jitter,
        y: (k[1] + 0.5) * pas + (rnd() - 0.5) * 2 * jitter
      };
    });
  }

  /* ------------------------------------------------------------
     Les sous-graines
     ------------------------------------------------------------
     Une expérience adaptative ne peut pas tirer ses essais d'avance : le
     suivant dépend de la réponse au précédent. On ne peut donc pas garder
     un générateur unique qu'on ferait avancer, puisqu'il faudrait le
     sérialiser pour rejouer la session.

     À la place, chaque essai reçoit sa propre graine, dérivée de celle de
     la session et de son rang. Rien à retenir, et le millième essai se
     regénère sans rejouer les neuf cent quatre-vingt-dix-neuf premiers.
     La constante est celle de Knuth pour le hachage multiplicatif.
     ------------------------------------------------------------ */
  function sousGraine(graine, i) {
    return (((graine >>> 0) ^ Math.imul(i + 1, 2654435761)) >>> 0);
  }

  /* ------------------------------------------------------------
     L'escalier adaptatif
     ------------------------------------------------------------
     Mesurer un seuil sur une grille de valeurs fixes gaspille presque
     tous les essais : ceux qui sont trop faciles et ceux qui sont trop
     difficiles n'apprennent rien. Un escalier passe son temps près du
     seuil, là où la réponse est incertaine — donc informative.

     Règle « deux bonnes, on durcit ; une fausse, on relâche » : elle
     converge vers le point où l’on réussit 70,7 % du temps. Ce n’est pas
     50 % — un seuil à 50 % n’a aucun sens dans une tâche à quatre choix,
     où l’on obtient déjà 25 % en répondant au hasard.

     Le niveau est tenu en LOGARITHME de la grandeur physique. Un pas
     multiplicatif traite de la même façon un doublement près du seuil et
     un doublement loin de lui — c’est ainsi que l’œil traite les
     intensités, et cela évite qu’un pas fixe soit énorme en bas d’échelle
     et négligeable en haut.

     Le champ « dur » dit dans quel sens la tâche devient difficile : −1
     quand c’est en diminuant la grandeur (un espacement, une taille, un
     contraste), +1 dans le cas contraire.
     ------------------------------------------------------------ */
  function escalier(o) {
    return {
      id: o.id || 'e',
      niveau: o.depart,              /* log10 de la grandeur */
      min: o.min, max: o.max,
      dur: o.dur === undefined ? -1 : o.dur,
      pas: o.pas,                    /* pas courant, en log10 */
      pasFin: o.pasFin === undefined ? o.pas / 2 : o.pasFin,
      reduireApres: o.reduireApres === undefined ? 2 : o.reduireApres,
      descend: o.descend === undefined ? 2 : o.descend,   /* justes avant de durcir */
      monte: o.monte === undefined ? 1 : o.monte,         /* fausses avant de relâcher */
      justes: 0, faux: 0,
      sens: 0,                       /* dernier mouvement : −1 durci, +1 relâché */
      inversions: [],                /* les niveaux où le sens a changé */
      niveaux: [],                   /* la trace complète, pour le rapport */
      n: 0,
      stop: o.stop === undefined ? 8 : o.stop,
      maxEssais: o.maxEssais === undefined ? 60 : o.maxEssais,
      fini: false
    };
  }

  /* La grandeur physique correspondant au niveau courant. */
  function valeur(e) { return Math.pow(10, e.niveau); }

  /* Enregistre une réponse et déplace l'escalier. */
  function avancer(e, juste) {
    if (e.fini) return e;
    e.n++;
    e.niveaux.push({ n: e.n, niveau: e.niveau, juste: !!juste });
    if (juste) { e.justes++; e.faux = 0; } else { e.faux++; e.justes = 0; }

    var bouge = 0;
    if (juste && e.justes >= e.descend) { bouge = e.dur; e.justes = 0; }
    else if (!juste && e.faux >= e.monte) { bouge = -e.dur; e.faux = 0; }

    if (bouge !== 0) {
      var sens = bouge > 0 ? 1 : -1;
      /* Une inversion : le sens du mouvement change. C’est autour de ces
         points que le seuil se lit — l’escalier vient d’y traverser. */
      if (e.sens !== 0 && sens !== e.sens) {
        e.inversions.push(e.niveau);
        if (e.inversions.length >= e.reduireApres) e.pas = e.pasFin;
      }
      e.sens = sens;
      e.niveau = Math.max(e.min, Math.min(e.max, e.niveau + bouge * e.pas));
    }

    if (e.inversions.length >= e.stop || e.n >= e.maxEssais) e.fini = true;
    return e;
  }

  /* Le seuil : moyenne des dernières inversions, en logarithme.
     On écarte les deux premières, qui datent d’avant la réduction du pas et
     tirent la moyenne loin du seuil ; et on en moyenne un nombre PAIR, pour
     ne pas privilégier le côté par lequel on est arrivé. */
  function seuil(e) {
    var inv = (e && e.inversions ? e.inversions : []).slice(2);
    if (inv.length < 2) return { valeur: null, log: null, n: inv.length, ecartType: null };
    if (inv.length % 2) inv = inv.slice(1);
    var m = moyenne(inv);
    return {
      valeur: Math.pow(10, m), log: m, n: inv.length,
      ecartType: inv.length > 1 ? ecartType(inv) : null
    };
  }

  /* ------------------------------------------------------------
     Les définitions
     ------------------------------------------------------------ */
  var DEFS = {};

  function definir(def) {
    if (!def || !def.id) throw new Error('Une expérience doit avoir un identifiant.');
    DEFS[def.id] = def;
    return def;
  }

  function def(id) { return DEFS[id] || null; }
  function toutes() { return Object.keys(DEFS).map(function (k) { return DEFS[k]; }); }

  /* ------------------------------------------------------------
     Une session
     ------------------------------------------------------------ */

  /* `params` est déjà résolu (mode appliqué, valeurs par défaut comprises). */
  function creer(id, mode, params, graine) {
    var d = def(id);
    if (!d) throw new Error('Expérience inconnue : ' + id);
    var p = Object.assign({}, d.defauts || {}, (d.modes && d.modes[mode]) || {}, params || {});
    var g = graine === undefined || graine === null ? graineNeuve() : (graine >>> 0);
    var rnd = generateur(g);
    var essais = d.essais(p, rnd, { positions: positions, melanger: melanger });
    return {
      exp: d.id, version: d.version || 1, nom: d.nom || d.id,
      mode: mode, params: p, graine: g,
      /* Les escaliers d'une expérience adaptative font partie de la session :
         ils portent la trace des niveaux, qui EST la mesure. */
      escaliers: d.escaliers ? d.escaliers(p, escalier) : null,
      essais: essais,          /* les sujets, dans l'ordre où ils passeront */
      reponses: [],            /* une entrée par essai répondu */
      debut: Date.now(), fin: null,
      calib: window.LabCalib ? LabCalib.resume() : null
    };
  }

  /* Rejouer une session : mêmes essais, mêmes positions, même ordre.
     C'est la vérification qui donne son sens à la graine. */
  function rejouer(s) {
    var d = def(s.exp);
    if (!d || !d.prolonger) return creer(s.exp, s.mode, s.params, s.graine).essais;
    /* Adaptative : la suite des essais ne découle pas de la seule graine, mais
       de la graine ET des réponses. On rejoue donc les réponses telles qu’elles
       ont été données. Retomber sur les mêmes essais prouve que rien d’autre
       que la graine et le sujet n’est intervenu. */
    var t = creer(s.exp, s.mode, s.params, s.graine);
    /* Les essais d'entraînement n'ont pas de réponse enregistrée : c'est
       leur passage, et non leur réponse, qui déclenche la fabrication du
       premier essai mesuré. On les rejoue donc explicitement. */
    t.essais.forEach(function (e, i) {
      if (e.entrainement) prolonger(t, i, true);
    });
    s.reponses.forEach(function (r) { repondre(t, r.i, r.reponse, r.ms); });
    return t.essais;
  }

  function repondre(s, i, reponse, ms) {
    var e = s.essais[i];
    var d = def(s.exp);
    var juste = d.juste ? d.juste(e, reponse) : (e.attendu === reponse);
    var r = {
      i: i, reponse: reponse, ms: Math.round(ms), juste: juste,
      condition: e.condition, taille: e.taille, cible: e.cible, at: Date.now()
    };
    s.reponses.push(r);

    prolonger(s, i, juste);
    return r;
  }

  /* ------------------------------------------------------------
     Fabriquer l'essai suivant d'une expérience adaptative
     ------------------------------------------------------------
     À appeler après CHAQUE essai passé — y compris ceux d'entraînement,
     qui ne sont pas enregistrés comme réponses. C'est la leçon d'un
     défaut : tant que cet appel vivait dans `repondre`, la mesure ne
     démarrait jamais, puisque le dernier essai d'entraînement ne
     produisait aucune réponse et donc ne demandait aucune suite.

     On ne fabrique que si l'essai passé était le dernier connu : les
     essais d'entraînement, eux, sont tirés d'avance.
     ------------------------------------------------------------ */
  function prolonger(s, i, juste) {
    var d = def(s.exp);
    if (!d || !d.prolonger) return null;
    if (i !== s.essais.length - 1) return null;
    var suite = d.prolonger(s, generateur(sousGraine(s.graine, s.essais.length)), {
      positions: positions, melanger: melanger,
      avancer: avancer, valeur: valeur, seuil: seuil
    }, { i: i, essai: s.essais[i], juste: !!juste });
    if (suite) s.essais.push(suite);
    return suite;
  }

  function analyser(s) {
    var d = def(s.exp);
    if (!d || !d.analyser) return null;
    return d.analyser(s, {
      mediane: mediane, moyenne: moyenne, ecartType: ecartType,
      pente: pente, nettoyer: nettoyer, seuil: seuil, valeur: valeur
    });
  }

  /* ------------------------------------------------------------
     Rangement local
     ------------------------------------------------------------
     Tout reste sur cet ordinateur. Les essais bruts sont conservés
     en entier : une analyse se refait, des données perdues non.
     ------------------------------------------------------------ */
  function boite() {
    if (!Array.isArray(Store.state.labSessions)) Store.state.labSessions = [];
    return Store.state.labSessions;
  }

  function enregistrer(s) {
    s.fin = s.fin || Date.now();
    s.sid = s.sid || ('s' + s.debut.toString(36) + '-' + (s.graine % 4096).toString(36));
    var b = boite();
    var i = b.findIndex(function (x) { return x.sid === s.sid; });
    if (i >= 0) b[i] = s; else b.unshift(s);
    /* on borne l'historique : cent sessions de quarante-huit essais tiennent
       largement dans le stockage local, mille finiraient par le saturer */
    if (b.length > 100) b.length = 100;
    Store.save();
    return s.sid;
  }

  function historique(expId) {
    return boite().filter(function (s) { return !expId || s.exp === expId; });
  }

  function session(sid) {
    return boite().filter(function (s) { return s.sid === sid; })[0] || null;
  }

  function supprimer(sid) {
    var b = boite();
    var i = b.findIndex(function (x) { return x.sid === sid; });
    if (i < 0) return false;
    b.splice(i, 1);
    Store.save();
    return true;
  }

  /* ------------------------------------------------------------
     Exports
     ------------------------------------------------------------
     Un CSV par essai : c'est le format qu'on ouvre dans un tableur
     ou qu'on charge dans R sans rien réécrire. Tous les essais y
     figurent, y compris les faux — les écarter du calcul des temps
     est une décision d'analyse, pas une raison de les perdre.
     ------------------------------------------------------------ */
  /* Une valeur de cellule : on protège ce qui contiendrait une virgule,
     sinon le fichier se décale d’une colonne sans prévenir. */
  function cell(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'boolean') return v ? 1 : 0;
    var t = String(v);
    return /[",\n]/.test(t) ? '"' + t.split('"').join('""') + '"' : t;
  }

  /* Les colonnes communes, puis celles que l’expérience déclare : une
     recherche visuelle exporte une taille d’ensemble, un encombrement un
     espacement. Un seul jeu de colonnes pour les deux ne dirait ni l’un
     ni l’autre. */
  function csv(s) {
    var d = def(s.exp);
    var sup = (d && d.colonnes) || [];
    var cols = ['session', 'experience', 'version', 'mode', 'oeil', 'graine',
      'essai', 'entrainement']
      .concat(sup.map(function (c) { return c.nom; }))
      .concat(['reponse', 'juste', 'temps_ms', 'horodatage']);
    var lignes = [cols.join(',')];
    s.reponses.forEach(function (r) {
      var e = s.essais[r.i] || {};
      lignes.push([
        s.sid || '', s.exp, s.version, s.mode, s.oeil || '', s.graine,
        r.i + 1, e.entrainement ? 1 : 0
      ].concat(sup.map(function (c) { return c.val(e, r, s); }))
        .concat([r.reponse, r.juste, r.ms, new Date(r.at).toISOString()])
        .map(cell).join(','));
    });
    return lignes.join('\n') + '\n';
  }

  function json(s) {
    return JSON.stringify({
      format: 'orthostudent-visionlab-1',
      session: s,
      analyse: analyser(s)
    }, null, 1);
  }

  window.Lab = {
    /* hasard */
    generateur: generateur, graineNeuve: graineNeuve, melanger: melanger, positions: positions,
    /* statistiques */
    mediane: mediane, moyenne: moyenne, ecartType: ecartType, pente: pente, nettoyer: nettoyer,
    /* escaliers adaptatifs */
    escalier: escalier, avancer: avancer, valeur: valeur, seuil: seuil, sousGraine: sousGraine,
    prolonger: prolonger,
    /* définitions */
    definir: definir, def: def, toutes: toutes,
    /* sessions */
    creer: creer, rejouer: rejouer, repondre: repondre, analyser: analyser,
    enregistrer: enregistrer, historique: historique, session: session, supprimer: supprimer,
    /* sorties */
    csv: csv, json: json
  };
})();
