/* ============================================================
   L'IA locale — reformuler, jamais savoir
   ------------------------------------------------------------
   Le répétiteur (core/repet.js) répond seul : instantanément,
   hors ligne, sans jamais rien inventer. Quand un modèle tourne
   en local — Ollama, sur cette machine —, il peut faire une
   chose que le répétiteur ne sait pas faire : **redire
   autrement**. Reprendre les mêmes extraits, les développer,
   les adapter à la question exacte, filer une analogie.

   La règle qui gouverne tout ce fichier :

       le modèle n'apporte pas de connaissance,
       il apporte de la formulation.

   Elle n'est pas idéologique, elle est mesurée. Interrogé à
   froid, « pourquoi la cornée est-elle transparente », un 4 B
   répond « cellules kératinocytaires » et « trois plans
   perpendiculaires » : deux inventions, dites avec aplomb, dans
   une matière où l'étudiant n'a aucun moyen de les repérer.
   Nourri des extraits du cours, le même modèle, à la même
   température, répond juste et sans rien ajouter.

   D'où trois décisions :

   1. **On fournit toujours la matière.** `Repet.contexte()`
      assemble la réponse du répétiteur et ce que le corpus dit
      autour ; le modèle n'a plus qu'à rédiger.
   2. **On coupe la réflexion par défaut.** Sur qwen3.5:4b,
      raisonner d'abord fait passer une réponse de 15 s à 45 s —
      et le budget de jetons s'épuise dans la réflexion, en
      anglais, avant qu'une seule phrase de réponse ne sorte.
      Pour une tâche de reformulation où les faits sont donnés,
      elle ne rapporte rien. Le réglage existe, il est à l'arrêt.
   3. **On distingue les deux régimes à l'écran.** Développer un
      extrait, c'est sûr. Répondre sans extrait, c'est une autre
      affaire : ce cas existe, mais il s'affiche autrement.

   Le dialogue avec Ollama passe par le processus principal
   (voir main.js) : ni la CSP de la page ni les origines d'Ollama
   n'ont à être desserrées.
   ============================================================ */
(function () {
  'use strict';

  var pont = window.ortho || null;
  var etatCache = null;
  var compteur = 0;
  var flux = {};        // id → fonction appelée à chaque morceau reçu

  if (pont && pont.on) {
    pont.on('ia:flux', function (p) {
      var f = flux[p.id];
      if (f) f(p.t);
    });
  }

  /* ------------------------------------------------------------
     Réglages
     ------------------------------------------------------------ */

  var DEFAUT = { actif: false, modele: '', pense: false, auto: false };

  function reglages() {
    var r = Store.setting('ia') || {};
    return {
      actif: !!r.actif,
      modele: r.modele || DEFAUT.modele,
      pense: !!r.pense,
      auto: !!r.auto
    };
  }

  function regler(cle, val) {
    var r = reglages();
    r[cle] = val;
    Store.setting('ia', r);
    return r;
  }

  /* ------------------------------------------------------------
     L'état d'Ollama — demandé une fois par session
     ------------------------------------------------------------ */

  function etat(refaire) {
    if (!pont || !pont.iaEtat) return Promise.resolve({ dispo: false, absent: true });
    if (etatCache && !refaire) return etatCache;
    etatCache = pont.iaEtat().then(function (e) {
      /* Premier lancement : on adopte le modèle installé plutôt que d'obliger
         à le choisir dans un menu qui n'a qu'une ligne. */
      if (e.dispo && e.modeles.length && !reglages().modele) regler('modele', e.modeles[0].nom);
      return e;
    }).catch(function () { return { dispo: false }; });
    return etatCache;
  }

  function modeleCourant(e) {
    var m = reglages().modele;
    var liste = (e && e.modeles) || [];
    return liste.filter(function (x) { return x.nom === m; })[0] || liste[0] || null;
  }

  /* ------------------------------------------------------------
     Les consignes
     ------------------------------------------------------------
     Courtes, impératives, et surtout négatives : sur un petit modèle,
     « n'ajoute rien » tient mieux que « sois rigoureux ».
     ------------------------------------------------------------ */

  var SOCLE =
    'Tu es le répétiteur d’un étudiant français en orthoptie (certificat de capacité). ' +
    'Tu écris en français, à la deuxième personne du pluriel, sans titre, sans liste à puces, ' +
    'sans formule de politesse et sans jamais te présenter.';

  var CONSIGNES = {
    /* le cas normal : on développe ce que le répétiteur a déjà trouvé */
    developper: SOCLE + '\n' +
      'Tu disposes UNIQUEMENT des EXTRAITS fournis. N’ajoute aucun fait, aucun chiffre, ' +
      'aucun nom propre et aucune classification qui n’y figure pas — ' +
      'même si tu crois les connaître. ' +
      'Ne recopie pas les extraits : explique-les autrement, comme à quelqu’un qui vient de ' +
      'dire qu’il n’a pas compris. Va du mécanisme vers sa conséquence visible chez un patient. ' +
      'Si les extraits ne suffisent pas à répondre, dis-le en une phrase et arrête-toi. ' +
      'Cinq phrases au maximum, et termine toujours ta dernière phrase.',

    /* une reformulation encore plus imagée, à la demande */
    autrement: SOCLE + '\n' +
      'Tu disposes UNIQUEMENT des EXTRAITS fournis. N’ajoute aucun fait qui n’y figure pas. ' +
      'Propose une seule comparaison concrète, tirée de la vie courante, qui rende le mécanisme ' +
      'évident — puis dis en une phrase où la comparaison cesse d’être juste. ' +
      'Quatre phrases au maximum.',

    /* hors corpus : le régime à part, signalé comme tel à l'écran */
    libre: SOCLE + '\n' +
      'Aucun extrait du cours ne correspond à cette question. Réponds brièvement si tu es sûr, ' +
      'et commence par dire que cela ne vient pas des fiches de l’application. ' +
      'Si tu n’es pas sûr, dis-le franchement plutôt que de deviner. Quatre phrases au maximum.'
  };

  /* ------------------------------------------------------------
     Demander
     ------------------------------------------------------------ */

  /* opts : { question, ctx, mode, onMot }
     Rend { ok, texte, erreur }. `onMot` reçoit chaque morceau au fil de
     l'eau — sans quoi l'écran reste figé une vingtaine de secondes. */
  function demander(opts) {
    if (!pont || !pont.iaDemande) {
      return Promise.resolve({ ok: false, erreur: 'Pont indisponible' });
    }
    var r = reglages();
    /* Sans extrait, c'est le régime libre, quel que soit le mode demandé par
       l'écran : servir les consignes « n'ajoute rien aux EXTRAITS » alors
       qu'il n'y en a aucun ne produit qu'un refus poli et incompréhensible. */
    var mode = opts.ctx ? (opts.mode || 'developper') : 'libre';
    var id = 'ia' + (++compteur);

    var demande = opts.ctx
      ? 'EXTRAITS DU COURS :\n' + opts.ctx + '\n\nQUESTION DE L’ÉTUDIANT : ' + opts.question
      : 'QUESTION DE L’ÉTUDIANT : ' + opts.question;

    if (opts.onMot) flux[id] = opts.onMot;

    return pont.iaDemande({
      id: id,
      modele: r.modele,
      pense: !!r.pense,
      /* Large : une réponse tronquée en plein milieu d'une phrase coûte plus
         cher à la lecture que les deux ou trois secondes gagnées. La longueur
         est tenue par la consigne, pas par le couperet. */
      max: mode === 'autrement' ? 420 : 760,
      messages: [
        { role: 'system', content: CONSIGNES[mode] || CONSIGNES.developper },
        { role: 'user', content: demande }
      ]
    }).then(function (res) {
      delete flux[id];
      return res;
    }).catch(function (e) {
      delete flux[id];
      return { ok: false, erreur: String((e && e.message) || e) };
    });
  }

  function stop() {
    flux = {};
    return pont && pont.iaStop ? pont.iaStop() : Promise.resolve(false);
  }

  window.IA = {
    etat: etat,
    reglages: reglages,
    regler: regler,
    modeleCourant: modeleCourant,
    demander: demander,
    stop: stop,
    /* utilisable uniquement si le pont existe (application Electron) */
    possible: function () { return !!(pont && pont.iaDemande); }
  };
})();
