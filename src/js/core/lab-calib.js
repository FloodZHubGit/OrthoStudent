/* ============================================================
   Vision Lab — calibration de l'écran
   ------------------------------------------------------------
   Une expérience de psychophysique ne mesure rien si l'on ignore
   la taille réelle de ce qu'on affiche. « 40 pixels » ne veut
   rien dire : c'est 0,6° sur un portable à 50 cm et 0,3° sur un
   écran 27 pouces à un mètre. Tout ce qui suit sert à convertir
   des pixels en degrés d'angle visuel, la seule unité qui ait un
   sens pour l'œil.

   Trois inconnues, trois façons de les obtenir :

     · la taille physique d'un pixel — mesurée en faisant ajuster
       une carte bancaire à l'écran. Le format ID-1 (ISO 7810) est
       normalisé au dixième de millimètre : 85,60 × 53,98 mm. Une
       carte de fidélité, un permis, une carte vitale font la même
       taille. C'est l'objet calibré que tout le monde a sur soi ;

     · la distance œil-écran — saisie à la main. On pourrait
       l'estimer par la webcam, mais mal, et une mauvaise mesure
       automatique vaut moins qu'une bonne mesure déclarée ;

     · la fréquence de rafraîchissement — comptée sur des images
       réelles. Elle borne la précision des temps affichés : à
       60 Hz, un stimulus ne peut pas durer 25 ms.

   La calibration est rangée PAR ÉCRAN : un portable branché sur
   un moniteur externe n'a ni la même densité ni la même distance,
   et reprendre la calibration de l'autre écran donnerait des
   degrés faux sans que rien ne le signale.

   Rien de tout cela n'est clinique. On mesure un temps de
   réaction sur un écran grand public, pas une acuité.
   ============================================================ */
(function () {
  'use strict';

  /* ISO/IEC 7810 ID-1 — la carte bancaire, au dixième de millimètre. */
  var CARTE_MM = { l: 85.60, h: 53.98 };

  /* En deçà, l'expérience ne tient pas : les stimuli périphériques
     sortiraient de l'écran ou se chevaucheraient. */
  var MIN_PX = { l: 900, h: 600 };

  function ecranId() {
    var s = window.screen || {};
    return [s.width || 0, s.height || 0, Math.round((window.devicePixelRatio || 1) * 100)].join('x');
  }

  function tous() {
    var c = Store.state.labCalib;
    if (!c || typeof c !== 'object') { c = {}; Store.state.labCalib = c; }
    return c;
  }

  /* ------------------------------------------------------------
     Les conversions. Un seul endroit : une expérience qui
     recalculerait ses degrés dans son coin finirait par diverger
     de celle d'à côté, et les deux seraient invérifiables.
     ------------------------------------------------------------ */

  function mmParPx(c) { return c && c.mmParPx > 0 ? c.mmParPx : null; }

  /* Angle réellement sous-tendu, sans approximation des petits angles :
     θ = 2·atan(taille / 2·distance). L'approximation θ ≈ taille/distance
     se tient sous 5°, mais une cible périphérique à 10° y perdrait déjà
     un demi-degré — et c'est exactement là qu'on ira ensuite. */
  function degDepuisMm(mm, distanceMm) {
    if (!(distanceMm > 0)) return null;
    return 2 * Math.atan(mm / (2 * distanceMm)) * 180 / Math.PI;
  }

  function mmDepuisDeg(deg, distanceMm) {
    if (!(distanceMm > 0)) return null;
    return 2 * distanceMm * Math.tan(deg * Math.PI / 360);
  }

  var Calib = {
    CARTE_MM: CARTE_MM,
    MIN_PX: MIN_PX,
    ecranId: ecranId,

    /* la calibration de CET écran, ou null */
    etat: function () {
      var c = tous()[ecranId()];
      return c && c.mmParPx > 0 && c.distanceCm > 0 ? c : null;
    },

    prete: function () { return !!Calib.etat(); },

    /* largeurPx : la largeur, en pixels CSS, à laquelle l'utilisateur a
       ajusté sa carte. On en déduit la taille d'un pixel. */
    reglerCarte: function (largeurPx) {
      if (!(largeurPx > 0)) return null;
      var c = tous()[ecranId()] || {};
      c.mmParPx = CARTE_MM.l / largeurPx;
      c.carteLargeurPx = largeurPx;
      c.at = Date.now();
      c.ecran = ecranId();
      tous()[ecranId()] = c;
      Store.save();
      return c;
    },

    reglerDistance: function (cm) {
      var c = tous()[ecranId()] || {};
      c.distanceCm = Math.max(10, Math.min(200, Number(cm) || 0));
      c.at = Date.now();
      c.ecran = ecranId();
      tous()[ecranId()] = c;
      Store.save();
      return c;
    },

    reglerHz: function (hz) {
      var c = tous()[ecranId()] || {};
      c.hz = hz;
      c.at = Date.now();
      tous()[ecranId()] = c;
      Store.save();
      return c;
    },

    oublier: function () {
      delete tous()[ecranId()];
      Store.save();
    },

    /* ---------------- conversions ---------------- */

    mmParPx: function () { return mmParPx(Calib.etat()); },

    distanceMm: function () {
      var c = Calib.etat();
      return c ? c.distanceCm * 10 : null;
    },

    pxVersMm: function (px) {
      var m = Calib.mmParPx();
      return m === null ? null : px * m;
    },

    mmVersPx: function (mm) {
      var m = Calib.mmParPx();
      return m === null ? null : mm / m;
    },

    pxVersDeg: function (px) {
      var mm = Calib.pxVersMm(px), d = Calib.distanceMm();
      return mm === null || d === null ? null : degDepuisMm(mm, d);
    },

    degVersPx: function (deg) {
      var d = Calib.distanceMm();
      if (d === null) return null;
      var mm = mmDepuisDeg(deg, d);
      return Calib.mmVersPx(mm);
    },

    /* combien de pixels pour un degré, au centre de l'écran */
    pxParDegre: function () { return Calib.degVersPx(1); },

    /* les mêmes, sans passer par l'état enregistré — pour les tests
       et pour prévisualiser une calibration avant de l'accepter */
    degDepuisMm: degDepuisMm,
    mmDepuisDeg: mmDepuisDeg,

    /* ---------------- l'écran est-il en état ? ---------------- */

    /* On mesure la fréquence sur des images réelles plutôt que de croire
       screen.refreshRate, absent d'une partie des navigateurs. Deux cents
       millisecondes suffisent à distinguer 60 de 120 ; on arrondit aux
       valeurs usuelles, parce qu'un « 59,7 Hz » ne renseigne personne. */
    mesurerHz: function (ms, fini) {
      var t0 = performance.now(), n = 0;
      function tic(t) {
        n++;
        if (t - t0 < (ms || 400)) { requestAnimationFrame(tic); return; }
        var brut = n / ((t - t0) / 1000);
        var usuelles = [30, 50, 60, 75, 90, 100, 120, 144, 165, 240];
        var proche = usuelles.reduce(function (a, b) {
          return Math.abs(b - brut) < Math.abs(a - brut) ? b : a;
        }, usuelles[0]);
        /* si l'on est loin de toute valeur usuelle, on garde la mesure brute :
           mentir sur un chiffre rond serait pire que d'afficher un chiffre sale */
        var hz = Math.abs(proche - brut) / proche < 0.08 ? proche : Math.round(brut);
        fini({ hz: hz, brut: Math.round(brut * 10) / 10, images: n });
      }
      requestAnimationFrame(tic);
    },

    /* Ce qui empêcherait une mesure d'être valable, ici et maintenant. */
    obstacles: function () {
      var out = [];
      if (!Calib.prete()) out.push('L’écran n’est pas calibré.');
      var w = window.innerWidth, h = window.innerHeight;
      if (w < MIN_PX.l || h < MIN_PX.h) {
        out.push('Fenêtre trop petite : ' + w + ' × ' + h + ' px, il en faut ' +
          MIN_PX.l + ' × ' + MIN_PX.h + '.');
      }
      var c = Calib.etat();
      if (c && c.hz && c.hz < 50) out.push('Rafraîchissement mesuré à ' + c.hz + ' Hz : les durées seront imprécises.');
      return out;
    },

    /* le plein écran est-il actif ? */
    pleinEcran: function () {
      return !!(document.fullscreenElement || document.webkitFullscreenElement);
    },

    /* La demande rend une PROMESSE, et un refus la rejette au lieu de lever :
       sans ce .catch, le rejet remonte en erreur non gérée dans la console au
       moment même où l'expérience démarre. Un refus n'est pas une anomalie —
       il arrive sans geste utilisateur, sous politique d'entreprise, en
       kiosque. La mesure continue en fenêtre, et le rapport le note. */
    demanderPleinEcran: function (n) {
      var e = n || document.documentElement;
      var f = e.requestFullscreen || e.webkitRequestFullscreen;
      if (!f) return null;
      try {
        var p = f.call(e);
        if (p && typeof p.catch === 'function') p.catch(function () { /* refusé */ });
        return p;
      } catch (err) { return null; }
    },

    quitterPleinEcran: function () {
      var f = document.exitFullscreen || document.webkitExitFullscreen;
      if (!f || !Calib.pleinEcran()) return;
      try {
        var p = f.call(document);
        if (p && typeof p.catch === 'function') p.catch(function () { /* déjà sorti */ });
      } catch (err) { /* déjà sorti */ }
    },

    /* Un résumé lisible, pour l'écran de calibration et pour le rapport :
       une mesure sans ses conditions n'est pas une mesure. */
    resume: function () {
      var c = Calib.etat();
      if (!c) return null;
      return {
        ecran: c.ecran,
        mmParPx: Math.round(c.mmParPx * 1000) / 1000,
        pouces: Math.round(Math.sqrt(
          Math.pow(window.screen.width * c.mmParPx, 2) +
          Math.pow(window.screen.height * c.mmParPx, 2)) / 25.4 * 10) / 10,
        distanceCm: c.distanceCm,
        hz: c.hz || null,
        pxParDegre: Math.round(Calib.pxParDegre() * 10) / 10,
        at: c.at
      };
    }
  };

  window.LabCalib = Calib;
})();
