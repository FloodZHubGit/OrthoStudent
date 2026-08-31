/* ============================================================
   Voix — la synthèse vocale, et surtout ce qu'on lui donne à dire
   ------------------------------------------------------------
   Faire lire du texte par la machine est facile. Lui faire lire de
   l'orthoptie ne l'est pas : nos items sont pleins de symboles qui
   ne se prononcent pas — « 8 Δ », « ≈ 540 µm », « 10/10 », « le IV »,
   « AC/A ». Lus tels quels, on entend « huit delta », « dix barre
   oblique dix », « le i-v ». D'où `prononcable`, qui fait la moitié
   du travail de ce fichier.

   Deux précautions de plateforme :

   · getVoices() renvoie souvent une liste vide au premier appel :
     les voix arrivent de façon asynchrone, d'où `pret()`.
   · Chromium interrompt une lecture qui dure plus d'une quinzaine
     de secondes. Le remède connu est de la relancer périodiquement
     par pause()/resume() ; sans lui, les réponses longues sont
     coupées en plein milieu.
   ============================================================ */
(function () {
  'use strict';

  var API = window.speechSynthesis;
  var courant = null;      // l'énoncé en cours
  var battement = null;    // le minuteur qui empêche Chromium de couper

  /* ------------------------------------------------------------
     De l'HTML d'un item à quelque chose de dicible
     ------------------------------------------------------------ */
  function prononcable(html) {
    var t = String(html == null ? '' : html);

    /* le libellé de contexte d'un item de tableau devient une phrase
       d'introduction : « Les ésotropies de l'enfant. Début donne… » */
    t = t.replace(/<span class="rc-tab">(.*?)<\/span>/g, '$1. ');
    t = t.replace(/<[^>]+>/g, ' ');
    t = t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, ' et ')
         .replace(/&lt;/g, ' inférieur à ').replace(/&gt;/g, ' supérieur à ');

    /* les symboles du métier, dans l'ordre : les plus longs d'abord */
    t = t.replace(/AC\s*\/\s*A/g, 'A C sur A')
         .replace(/C\s*\/\s*D/g, 'C sur D')
         .replace(/→/g, ' donne ')
         .replace(/↔/g, ' contre ')
         .replace(/[≈~]/g, ' environ ')
         .replace(/±/g, ' plus ou moins ')
         .replace(/≤/g, ' inférieur ou égal à ').replace(/≥/g, ' supérieur ou égal à ')
         .replace(/</g, ' inférieur à ').replace(/>/g, ' supérieur à ')
         .replace(/Δ/g, ' dioptries prismatiques ')
         .replace(/°/g, ' degrés ')
         .replace(/%/g, ' pour cent ')
         .replace(/µm/g, ' micromètres ')
         .replace(/\bmm\b/g, ' millimètres ')
         .replace(/\bcm\b/g, ' centimètres ')
         .replace(/\bdB\b/g, ' décibels ');

    /* « 10/10 », « 5,5/10 » : une acuité se dit « sur » */
    t = t.replace(/(\d)\s*\/\s*(\d)/g, '$1 sur $2');

    /* les nerfs crâniens : les chiffres romains se lisent lettre à lettre.
       VII avant VI, VI avant V — sinon on tronque. */
    t = t.replace(/\bVIII\b/g, 'huit').replace(/\bVII\b/g, 'sept')
         .replace(/\bVI\b/g, 'six').replace(/\bIV\b/g, 'quatre')
         .replace(/\bIII\b/g, 'trois').replace(/\bII\b/g, 'deux')
         .replace(/\bV1\b/g, 'V un').replace(/\bV2\b/g, 'V deux');

    /* « +2,50 D » : le D isolé après un nombre, c'est une dioptrie */
    t = t.replace(/(\d)\s*D\b/g, '$1 dioptries');

    /* les formules : « Δ = 100 × tan θ » ne se lit pas tout seul */
    t = t.replace(/\s=\s/g, ' égale ')
         .replace(/\s×\s/g, ' fois ')
         .replace(/θ/g, ' thêta ').replace(/γ/g, ' gamma ').replace(/λ/g, ' lambda ');

    /* les guillemets et tirets cadratins hachent la prosodie pour rien */
    t = t.replace(/[«»"]/g, ' ').replace(/—/g, ', ');

    /* le point médian sépare bien à l'œil, mais ne se dit pas */
    t = t.replace(/\s·\s/g, ', ');

    /* « 1 degrés » : la conversion écrit toujours au pluriel, et l'oreille
       entend la faute */
    t = t.replace(/(^|[^\d,])1\s+(degré|dioptrie|millimètre|centimètre|micromètre|décibel)s\b/g,
      function (_, avant, unite) { return avant + '1 ' + unite; });

    /* la ponctuation orpheline laissée par les remplacements */
    t = t.replace(/\s+([.,;:?!])/g, '$1');

    return t.replace(/\s+/g, ' ').trim();
  }

  /* ------------------------------------------------------------
     Les voix disponibles
     ------------------------------------------------------------ */
  function toutes() { return API ? API.getVoices() : []; }

  function francaises() {
    return toutes().filter(function (v) { return /^fr/i.test(v.lang); });
  }

  /* Les voix arrivent après coup : on attend qu'elles soient là plutôt
     que de rendre une liste vide au premier affichage. */
  function pret() {
    return new Promise(function (res) {
      if (!API) return res(false);
      if (toutes().length) return res(true);
      var fini = false;
      function vu() { if (!fini && toutes().length) { fini = true; res(true); } }
      API.onvoiceschanged = vu;
      setTimeout(function () { if (!fini) { fini = true; res(toutes().length > 0); } }, 2500);
    });
  }

  function voixParNom(nom) {
    var v = toutes().filter(function (x) { return x.name === nom; })[0];
    return v || francaises()[0] || toutes()[0] || null;
  }

  /* ------------------------------------------------------------
     Dire une phrase — la promesse se résout à la fin, ou à l'arrêt
     ------------------------------------------------------------ */
  /* La promesse doit se résoudre dans tous les cas — fin normale, erreur,
     ou interruption par stop(). Sans cela, une file d'écoute qu'on met en
     pause reste bloquée sur un « await » qui n'arrivera jamais. */
  function parler(texte, opts) {
    opts = opts || {};
    var mots = prononcable(texte);
    return new Promise(function (res) {
      if (!API || !mots) return res('vide');
      stop();

      var moi = { fini: false, res: res };
      function termine(cause) {
        if (moi.fini) return;
        moi.fini = true;
        if (courant === moi) {
          courant = null;
          clearInterval(battement);
          battement = null;
        }
        res(cause);
      }

      var u = new SpeechSynthesisUtterance(mots);
      var v = voixParNom(opts.voix);
      if (v) u.voice = v;
      u.lang = (v && v.lang) || 'fr-FR';
      u.rate = opts.vitesse || 1;
      u.pitch = 1;
      u.onend = function () { termine('fin'); };
      u.onerror = function () { termine('erreur'); };

      courant = moi;
      API.speak(u);

      /* le remède au bug de Chromium : une lecture de plus d'une quinzaine
         de secondes s'interrompt seule si personne ne la relance */
      clearInterval(battement);
      battement = setInterval(function () {
        if (!API.speaking) return;
        API.pause(); API.resume();
      }, 9000);
    });
  }

  function stop() {
    clearInterval(battement);
    battement = null;
    var c = courant;
    courant = null;
    if (API) { try { API.cancel(); } catch (e) { /* rien à faire */ } }
    if (c && !c.fini) { c.fini = true; c.res('arret'); }
  }

  window.Voix = {
    dispo: function () { return !!API; },
    pret: pret,
    voix: francaises,
    toutes: toutes,
    parler: parler,
    stop: stop,
    prononcable: prononcable
  };
})();
