/* ============================================================
   L'atelier de calcul — tirage, correction, diagnostic
   ------------------------------------------------------------
   L'application savait calculer ; elle ne faisait jamais
   calculer. Onze calculatrices donnaient le résultat et le
   raisonnement, mais l'étudiant restait spectateur — or en TP
   comme à l'examen, c'est lui qui tient le crayon.

   Ce fichier ne connaît pas le DOM. Il tire des énoncés à
   valeurs aléatoires, il corrige, et surtout il NOMME L'ERREUR.

   Le diagnostic est la seule partie qui vaille : « faux » n'a
   jamais rien appris à personne. Chaque poste déclare ses
   pièges — les fautes réelles, celles qu'on fait vraiment :
   garder les millimètres là où la formule veut des centimètres,
   oublier que le logMAR est un opposé, ne pas tourner l'axe,
   prendre l'amplitude maximale pour la moyenne. Si la réponse
   tombe sur un piège connu, on le nomme ; sinon on donne la
   méthode.

   Rien n'est recalculé ici : tous les résultats sortent des
   mêmes fonctions d'Optics que les calculatrices. L'atelier ne
   peut donc pas contredire la calculatrice — et `npm run
   atelier` le vérifie sur des milliers de tirages, en même
   temps qu'il s'assure qu'aucun piège ne tombe sur la bonne
   réponse.
   ============================================================ */
(function () {
  'use strict';

  var O = window.Optics;
  var A = O.Acuity, P = O.Prism, R = O.Refraction, B = O.Binocular, r2 = O.r2;

  /* ---------------- Petits outils ---------------- */

  function pick(rnd, list) { return list[Math.floor(rnd() * list.length)]; }

  /* nombre à la française, sans zéros inutiles */
  function nb(v, d) {
    if (v === null || v === undefined || !isFinite(v)) return '—';
    var s = Number(v).toFixed(d === undefined ? 2 : d);
    s = s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    /* moins typographique, comme dpt() : les mesures algebriques de
       l’optique sont les premieres valeurs negatives de l’atelier. */
    return s.replace('.', ',').replace(/^-/, '−');
  }
  function dpt(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + nb(Math.abs(v), 2); }
  /* Optics.formatRx écrit « +1.00 (-1.00 à 180°) » : point décimal et trait
     d'union. Le reste de l'atelier écrit à la française. Deux écritures du
     même nombre dans un seul énoncé, c'est une hésitation de plus à lire. */
  function rx(sph, cyl, axis) {
    if (!cyl) return dpt(sph) + ' D sph';
    return dpt(sph) + ' (' + dpt(cyl) + ' à ' + axis + '°)';
  }

  /* ---------------- Les postes ---------------- */
  /* tirer(rnd, niveau) rend :
       enonce : l'énoncé, en HTML
       champs : [{ k, label, unite, attendu, tol, pas }]
       pieges : [{ k, v, dit }] — v = la valeur qu'on obtient en se trompant
       rappel : la ligne de méthode, montrée après coup            */

  var POSTES = [

    { id: 'logmar', nom: 'Acuité décimale → logMAR', ic: '🔠',
      calc: 'acuity', formule: 'logmar', ue: 'UE05',
      tirer: function (rnd, niv) {
        var dec = pick(rnd, niv === 'rode' ? [0.05, 0.08, 0.16, 0.25, 0.32, 0.4, 0.63, 0.8] : [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
        var att = r2(A.decToLogMAR(dec), 2);
        var mar = r2(A.decToMAR(dec), 2);
        return {
          enonce: 'Un patient voit <b>' + nb(dec * 10, 1) + '/10</b>. Exprimez cette acuité en <b>logMAR</b>.',
          champs: [{ k: 'v', label: 'logMAR', unite: '', attendu: att, tol: 0.02, pas: 0.01 }],
          pieges: [
            { k: 'v', v: r2(-att, 2), dit: 'Le signe. Le logMAR est l’<b>opposé</b> du logarithme : toute acuité inférieure à 10/10 donne un logMAR <b>positif</b>.' },
            { k: 'v', v: mar, dit: 'C’est le <b>MAR</b> (' + nb(mar, 2) + ' minute d’arc), pas le logMAR — il manque le logarithme.' },
            { k: 'v', v: r2(Math.log10(dec * 10), 2), dit: 'Vous avez pris l’acuité en <b>dixièmes</b> (' + nb(dec * 10, 1) + ') au lieu de la décimale (' + nb(dec, 2) + ').' }
          ],
          rappel: 'logMAR = −log₁₀(' + nb(dec, 2) + ') = <b>' + nb(att, 2) + '</b>'
        };
      } },

    { id: 'decimal', nom: 'logMAR → acuité décimale', ic: '🔡',
      calc: 'acuity', formule: 'logmar', ue: 'UE05',
      tirer: function (rnd, niv) {
        var lm = pick(rnd, niv === 'rode' ? [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.95, 1.1] : [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1]);
        var att = r2(A.logMARToDec(lm), 2);
        return {
          enonce: 'Un compte rendu annonce une acuité de <b>' + nb(lm, 2) + ' logMAR</b>. Quelle acuité <b>décimale</b> cela représente-t-il ?',
          champs: [{ k: 'v', label: 'acuité décimale', unite: '', attendu: att, tol: 0.02, pas: 0.01 }],
          pieges: [
            { k: 'v', v: r2(Math.pow(10, lm), 2), dit: 'Le signe de l’exposant : l’acuité vaut 10<sup>−logMAR</sup>. Un logMAR positif est toujours une acuité <b>inférieure</b> à 10/10.' },
            { k: 'v', v: r2(1 - lm, 2), dit: 'Vous avez soustrait. L’échelle est logarithmique, pas linéaire : 0,3 logMAR ne vaut pas 7/10 mais 5/10.' },
            { k: 'v', v: r2(att * 10, 2), dit: 'Vous répondez en <b>dixièmes</b> : la question demande la décimale (' + nb(att, 2) + ', soit ' + nb(att * 10, 1) + '/10).' }
          ],
          rappel: 'acuité = 10<sup>−' + nb(lm, 2) + '</sup> = <b>' + nb(att, 2) + '</b>, soit ' + nb(att * 10, 1) + '/10'
        };
      } },

    { id: 'prentice', nom: 'Loi de Prentice — le prisme induit', ic: '📐',
      calc: 'prentice', formule: 'prentice', ue: 'UE03',
      tirer: function (rnd, niv) {
        var d = pick(rnd, niv === 'rode' ? [1.75, 2.25, 3.5, 4.75, 6.25] : [2, 3, 4, 5, 6, 8]);
        var mm = pick(rnd, niv === 'rode' ? [3, 4, 6, 7, 9] : [2, 4, 5, 6, 8]);
        var att = r2(P.prentice(d, mm), 2);
        return {
          enonce: 'Un verre de <b>' + dpt(d) + ' D</b> est décentré de <b>' + nb(mm, 1) + ' mm</b>. Quel prisme cela induit-il ?',
          champs: [{ k: 'v', label: 'prisme induit', unite: 'Δ', attendu: att, tol: 0.15, pas: 0.1 }],
          pieges: [
            { k: 'v', v: r2(d * mm, 2), dit: 'Vous avez gardé les <b>millimètres</b>. La loi de Prentice veut le décentrement en <b>centimètres</b> : ' + nb(mm, 1) + ' mm = ' + nb(mm / 10, 2) + ' cm. Votre résultat est dix fois trop grand.' },
            { k: 'v', v: r2(mm / d, 2), dit: 'Vous avez divisé. Prentice <b>multiplie</b> : Δ = puissance × décentrement.' },
            { k: 'v', v: r2(d / (mm / 10), 2), dit: 'Rapport inversé : c’est la puissance multipliée par le décentrement, pas divisée par lui.' }
          ],
          rappel: 'Δ = ' + nb(d, 2) + ' × ' + nb(mm / 10, 2) + ' cm = <b>' + nb(att, 2) + ' Δ</b>'
        };
      } },

    { id: 'prentice_inv', nom: 'Prentice à l’envers — le décentrement', ic: '📏',
      calc: 'prentice', formule: 'prentice', ue: 'UE03',
      tirer: function (rnd, niv) {
        var d = pick(rnd, niv === 'rode' ? [2.5, 3.5, 4.5, 6.5] : [2, 4, 5, 8]);
        var delta = pick(rnd, niv === 'rode' ? [1.5, 2.5, 3.5] : [1, 2, 3, 4]);
        var att = r2(P.decentrationForPrism(d, delta), 2);
        return {
          enonce: 'Vous voulez obtenir <b>' + nb(delta, 1) + ' Δ</b> avec un verre de <b>' + dpt(d) + ' D</b>. De combien faut-il le décentrer ?',
          champs: [{ k: 'v', label: 'décentrement', unite: 'mm', attendu: att, tol: 0.3, pas: 0.5 }],
          pieges: [
            { k: 'v', v: r2(delta / d, 2), dit: 'Il manque la conversion : ' + nb(delta / d, 2) + ' <b>cm</b>, soit ' + nb(att, 1) + ' mm. La réponse est attendue en millimètres.' },
            { k: 'v', v: r2(delta * d, 2), dit: 'Vous avez multiplié. Ici on cherche le décentrement : il faut <b>diviser</b> le prisme voulu par la puissance.' },
            { k: 'v', v: r2(d / delta * 10, 2), dit: 'Rapport inversé : c’est le prisme divisé par la puissance, pas l’inverse.' }
          ],
          rappel: 'décentrement = ' + nb(delta, 1) + ' / ' + nb(d, 2) + ' = ' + nb(delta / d, 2) + ' cm = <b>' + nb(att, 1) + ' mm</b>'
        };
      } },

    { id: 'delta_deg', nom: 'Dioptries prismatiques → degrés', ic: '🔺',
      calc: 'prism', formule: 'prisme', ue: 'UE02',
      tirer: function (rnd, niv) {
        var d = pick(rnd, niv === 'rode' ? [13, 14, 18, 22, 25, 30, 35, 40, 45] : [4, 5, 6, 8, 10, 12, 15, 16, 18, 20]);
        var att = r2(P.dptToDeg(d), 2);
        return {
          enonce: 'Une déviation est mesurée à <b>' + nb(d, 0) + ' Δ</b>. Combien cela fait-il en <b>degrés</b> ?',
          champs: [{ k: 'v', label: 'angle', unite: '°', attendu: att, tol: 0.2, pas: 0.1 }],
          pieges: [
            { k: 'v', v: r2(d / 2, 2), dit: 'C’est l’<b>approximation</b> (2 Δ ≈ 1°), pas le calcul. Elle dépanne sous 20 Δ mais s’écarte vite : ici la valeur exacte est ' + nb(att, 2) + '°, l’approximation donne ' + nb(d / 2, 1) + '°.' },
            { k: 'v', v: r2(P.degToDpt(d), 2), dit: 'Conversion prise à l’envers : vous avez traité les ' + nb(d, 0) + ' comme des degrés à convertir en Δ.' },
            { k: 'v', v: r2(Math.atan(d) * 180 / Math.PI, 2), dit: 'Il manque la division par 100 : la dioptrie prismatique est un déplacement en <b>centimètres par mètre</b>, donc θ = arctan(Δ/100).' }
          ],
          rappel: 'θ = arctan(' + nb(d, 0) + '/100) = <b>' + nb(att, 2) + '°</b>'
        };
      } },

    { id: 'hirschberg', nom: 'Hirschberg — du reflet à l’angle', ic: '💡',
      calc: 'hirschberg', formule: 'hirschberg', ue: 'UE07',
      tirer: function (rnd, niv) {
        var mm = pick(rnd, niv === 'rode' ? [0.5, 1.5, 2.5, 3.5, 4.5] : [0.75, 1, 1.25, 2, 2.5, 3, 4]);
        var att = r2(P.hirschbergMmToDpt(mm), 2);
        return {
          enonce: 'Au test de Hirschberg, le reflet cornéen est décentré de <b>' + nb(mm, 1) + ' mm</b>. Estimez l’angle en <b>dioptries prismatiques</b>.',
          champs: [{ k: 'v', label: 'angle', unite: 'Δ', attendu: att, tol: 0.8, pas: 1 }],
          pieges: [
            { k: 'v', v: r2(P.hirschbergMmToDeg(mm), 2), dit: 'C’est l’angle en <b>degrés</b> (' + nb(mm * 7, 0) + '°), pas en dioptries prismatiques. Le repère complet est : 1 mm ≈ 7° ≈ 15 Δ.' },
            { k: 'v', v: r2(mm * 15, 2), dit: 'Vous avez appliqué le repère mémoire (15 Δ/mm) : bonne intuition, mais la conversion exacte passe par les degrés et donne ' + nb(att, 1) + ' Δ.' }
          ],
          rappel: nb(mm, 1) + ' mm × 7° = ' + nb(mm * 7, 0) + '°, converti en Δ = <b>' + nb(att, 1) + ' Δ</b>'
        };
      } },

    { id: 'equivalent', nom: 'Équivalent sphérique', ic: '🔄',
      calc: 'transpose', formule: 'equivalent', ue: 'UE03',
      tirer: function (rnd, niv) {
        var sph = pick(rnd, niv === 'rode' ? [-4.25, -2.75, -0.75, 1.25, 3.75] : [-4, -2, -1, 1, 2, 3]);
        var cyl = pick(rnd, niv === 'rode' ? [-3.25, -2.75, -1.75, -0.75] : [-3, -2, -1.5, -1]);
        var att = r2(R.sphericalEquivalent(sph, cyl), 2);
        return {
          enonce: 'Réfraction : <b>' + rx(sph, cyl, 180) + '</b>. Quel est l’<b>équivalent sphérique</b> ?',
          champs: [{ k: 'v', label: 'équivalent sphérique', unite: 'D', attendu: att, tol: 0.12, pas: 0.25 }],
          pieges: [
            { k: 'v', v: r2(sph + cyl, 2), dit: 'Vous avez ajouté le cylindre <b>entier</b>. L’équivalent sphérique n’en prend que la <b>moitié</b> : c’est la puissance moyenne des deux méridiens, donc le cercle de moindre diffusion.' },
            { k: 'v', v: r2(sph - cyl / 2, 2), dit: 'Signe du cylindre : il est négatif et on l’<b>ajoute</b> tel quel (divisé par deux), on ne le retranche pas.' },
            { k: 'v', v: r2(cyl / 2, 2), dit: 'Vous avez oublié la sphère : l’équivalent part de la sphère et lui ajoute la moitié du cylindre.' }
          ],
          rappel: 'ES = ' + dpt(sph) + ' + (' + dpt(cyl) + ')/2 = <b>' + dpt(att) + ' D</b>'
        };
      } },

    { id: 'transposition', nom: 'Transposition cylindrique', ic: '🔁',
      calc: 'transpose', formule: 'transposition', ue: 'UE03',
      tirer: function (rnd, niv) {
        var sph = pick(rnd, niv === 'rode' ? [-3.25, -1.75, 0.75, 2.25] : [-3, -1, 1, 2]);
        var cyl = pick(rnd, niv === 'rode' ? [-2.75, -1.75, -1.25] : [-2, -1.5, -1]);
        var ax = pick(rnd, niv === 'rode' ? [15, 35, 65, 115, 155] : [10, 45, 90, 135, 180]);
        var t = R.transpose(sph, cyl, ax);
        return {
          enonce: 'Transposez cette réfraction en <b>cylindre positif</b> : ' + rx(sph, cyl, ax) + '.',
          champs: [
            { k: 'sph', label: 'nouvelle sphère', unite: 'D', attendu: t.sph, tol: 0.12, pas: 0.25 },
            { k: 'cyl', label: 'nouveau cylindre', unite: 'D', attendu: t.cyl, tol: 0.12, pas: 0.25 },
            { k: 'axe', label: 'nouvel axe', unite: '°', attendu: t.axis, tol: 0.5, pas: 5 }
          ],
          pieges: [
            { k: 'sph', v: r2(sph - cyl, 2), dit: 'La nouvelle sphère s’obtient en <b>ajoutant</b> le cylindre algébriquement (' + dpt(sph) + ' + ' + dpt(cyl) + '), pas en le retranchant.' },
            { k: 'sph', v: sph, dit: 'La sphère ne peut pas rester la même : transposer, c’est changer de méridien de référence.' },
            { k: 'cyl', v: cyl, dit: 'Le cylindre doit <b>changer de signe</b> : c’est tout l’objet de la transposition.' },
            { k: 'axe', v: ax, dit: 'L’axe doit tourner de <b>90°</b> : le cylindre décrit maintenant l’autre méridien.' },
            { k: 'axe', v: ax + 90 > 180 ? ax + 90 : ax - 90, dit: 'Le sens est bon, mais l’axe sort de l’intervalle : il se ramène toujours entre 1° et 180°.' }
          ],
          rappel: 'sphère ' + dpt(sph) + ' + (' + dpt(cyl) + ') = ' + dpt(t.sph) +
            ' · cylindre inversé = ' + dpt(t.cyl) + ' · axe ' + ax + '° ± 90° = <b>' + t.axis + '°</b>'
        };
      } },

    { id: 'hofstetter', nom: 'Amplitude d’accommodation (Hofstetter)', ic: '🔍',
      calc: 'accom', formule: 'hofstetter', ue: 'UE09',
      tirer: function (rnd, niv) {
        var age = pick(rnd, niv === 'rode' ? [13, 17, 23, 27, 33, 38, 43, 47, 52, 56] : [8, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
        var h = R.hofstetter(age);
        return {
          enonce: 'Quelle amplitude d’accommodation <b>moyenne</b> attend-on à <b>' + age + ' ans</b> ?',
          champs: [{ k: 'v', label: 'amplitude moyenne', unite: 'D', attendu: h.moy, tol: 0.2, pas: 0.25 }],
          pieges: [
            { k: 'v', v: h.max, dit: 'C’est l’amplitude <b>maximale</b> (25 − 0,4 × âge). La moyenne s’écrit 18,5 − 0,3 × âge.' },
            { k: 'v', v: h.min, dit: 'C’est l’amplitude <b>minimale</b> (15 − 0,25 × âge) — celle qui sert à calculer une addition, pas celle qu’on attend en moyenne.' },
            { k: 'v', v: r2(0.3 * age - 18.5, 2), dit: 'Signe inversé : l’amplitude <b>diminue</b> avec l’âge, on part de 18,5 D et on retranche.' }
          ],
          rappel: 'moyenne = 18,5 − 0,3 × ' + age + ' = <b>' + nb(h.moy, 2) + ' D</b> (max ' + nb(h.max, 2) + ' · min ' + nb(h.min, 2) + ')'
        };
      } },

    { id: 'aca', nom: 'AC/A par l’hétérophorie', ic: '⚖️',
      calc: 'aca', formule: 'aca_hetero', ue: 'UE08',
      tirer: function (rnd, niv) {
        var dip = pick(rnd, niv === 'rode' ? [5.8, 6.2, 6.5, 7.1] : [6, 6.5, 7]);
        var wd = pick(rnd, [0.33, 0.4]);
        var pf = pick(rnd, [-2, 0, 2, 4]);
        var pn = pick(rnd, [-12, -8, -6, 6, 10]);
        var att = r2(B.acaHeterophoria(dip, wd, pn, pf), 2);
        return {
          enonce: 'DIP <b>' + nb(dip, 1) + ' cm</b>, distance de travail <b>' + nb(wd * 100, 0) + ' cm</b>. ' +
            'Phorie de loin <b>' + (pf > 0 ? '+' : '') + nb(pf, 0) + ' Δ</b>, phorie de près <b>' + (pn > 0 ? '+' : '') + nb(pn, 0) + ' Δ</b>. ' +
            'Calculez l’<b>AC/A</b> par la méthode de l’hétérophorie. <span class="muted">(éso positif, exo négatif)</span>',
          champs: [{ k: 'v', label: 'AC/A', unite: 'Δ/D', attendu: att, tol: 0.2, pas: 0.1 }],
          pieges: [
            { k: 'v', v: r2(dip + wd * 100 * (pn - pf), 2), dit: 'La distance de travail se met en <b>mètres</b> (' + nb(wd, 2) + '), pas en centimètres — sinon le terme écrase la DIP.' },
            { k: 'v', v: r2(dip * 10 + wd * (pn - pf), 2), dit: 'La DIP se met en <b>centimètres</b> (' + nb(dip, 1) + '), pas en millimètres.' },
            { k: 'v', v: r2(wd * (pn - pf), 2), dit: 'Vous avez oublié la <b>DIP</b> : c’est elle qui donne la base du rapport, la phorie n’apporte que la correction.' },
            { k: 'v', v: r2(dip + wd * (pf - pn), 2), dit: 'Différence inversée : c’est la phorie de <b>près moins</b> celle de loin.' }
          ],
          rappel: 'AC/A = ' + nb(dip, 1) + ' + ' + nb(wd, 2) + ' × (' + nb(pn, 0) + ' − ' + nb(pf, 0) + ') = <b>' + nb(att, 2) + ' Δ/D</b>'
        };
      } },

    { id: 'convergence', nom: 'Demande de convergence', ic: '🎯',
      calc: 'converg', formule: 'convergence', ue: 'UE08',
      tirer: function (rnd, niv) {
        var dip = pick(rnd, niv === 'rode' ? [58, 62, 65, 71] : [60, 64, 70]);
        var d = pick(rnd, niv === 'rode' ? [25, 33, 45] : [25, 40, 50]);
        var att = r2(B.convergenceDemand(dip, d), 2);
        return {
          enonce: 'Un patient de <b>' + nb(dip, 0) + ' mm</b> de DIP fixe à <b>' + nb(d, 0) + ' cm</b>. Quelle est la <b>demande de convergence</b> ?',
          champs: [{ k: 'v', label: 'convergence', unite: 'Δ', attendu: att, tol: 0.3, pas: 0.5 }],
          pieges: [
            { k: 'v', v: r2(dip * (100 / d), 2), dit: 'La DIP se convertit en <b>centimètres</b> : ' + nb(dip, 0) + ' mm = ' + nb(dip / 10, 1) + ' cm. Votre résultat est dix fois trop grand.' },
            { k: 'v', v: r2((dip / 10) * d, 2), dit: 'La distance passe au <b>dénominateur</b> : plus on fixe près, plus la convergence demandée est grande.' },
            { k: 'v', v: r2(100 / d, 2), dit: 'C’est l’angle métrique (la vergence seule) : il reste à le multiplier par la DIP en centimètres.' }
          ],
          rappel: 'Δ = ' + nb(dip / 10, 1) + ' × 100/' + nb(d, 0) + ' = <b>' + nb(att, 2) + ' Δ</b>'
        };
      } },

    { id: 'vergence', nom: 'Punctum remotum → réfraction', ic: '📍',
      calc: 'vergence', formule: 'vergence', ue: 'UE02',
      tirer: function (rnd, niv) {
        var cm = pick(rnd, niv === 'rode' ? [12, 14, 16, 18, 22, 28, 35, 40, 50, 65] : [10, 15, 20, 25, 30, 33, 40, 50, 66, 100]);
        var att = r2(-R.distToPower(cm / 100), 2);
        return {
          enonce: 'Le punctum remotum d’un œil myope est à <b>' + nb(cm, 0) + ' cm</b>. Quelle est sa réfraction ?',
          champs: [{ k: 'v', label: 'réfraction', unite: 'D', attendu: att, tol: 0.12, pas: 0.25 }],
          pieges: [
            { k: 'v', v: r2(-1 / cm, 2), dit: 'La distance se met en <b>mètres</b> : ' + nb(cm, 0) + ' cm = ' + nb(cm / 100, 2) + ' m. Vous avez divisé par les centimètres.' },
            { k: 'v', v: r2(-att, 2), dit: 'Le signe. Un œil <b>myope</b> a un punctum remotum à distance finie et une réfraction <b>négative</b>.' },
            { k: 'v', v: r2(-cm / 100, 2), dit: 'Vous avez donné la distance, pas son inverse : la vergence vaut 1/distance.' }
          ],
          rappel: 'V = −1 / ' + nb(cm / 100, 2) + ' m = <b>' + dpt(att) + ' D</b>'
        };
      } },

    { id: 'vertex', nom: 'Distance de sommet — lunettes → lentille', ic: '👓',
      calc: 'vertex', formule: 'vertex', ue: 'UE03',
      tirer: function (rnd, niv) {
        var p = pick(rnd, niv === 'rode' ? [-9.5, -7.25, 6.75, 8.5, -11.25] : [-6, -8, -10, 6, 8, 10]);
        var mm = pick(rnd, [10, 12, 14]);
        var att = R.vertexPower(p, mm, 0);
        return {
          enonce: 'Un verre de <b>' + dpt(p) + ' D</b> est porté à <b>' + nb(mm, 0) + ' mm</b> du sommet cornéen. ' +
            'Quelle puissance faut-il en <b>lentille de contact</b> ?',
          champs: [{ k: 'v', label: 'puissance en lentille', unite: 'D', attendu: att, tol: 0.15, pas: 0.25 }],
          pieges: [
            { k: 'v', v: r2(p / (1 + (mm / 1000) * p), 2), dit: 'Signe au dénominateur. Retenez le sens plutôt que la formule : un <b>myope</b> a besoin de <b>moins</b> de puissance en lentille, un <b>hypermétrope</b> de <b>plus</b>.' },
            { k: 'v', v: p, dit: 'La puissance change forcément : rapprocher le verre de l’œil modifie sa puissance effective. C’est pour cela qu’au-delà de ±4 D on ne transpose jamais de tête.' },
            { k: 'v', v: r2(p * (1 - (mm / 1000) * p), 2), dit: 'La distance de sommet <b>divise</b>, elle ne multiplie pas : P′ = P / (1 − d × P).' }
          ],
          rappel: 'P′ = ' + dpt(p) + ' / (1 − ' + nb(mm / 1000, 3) + ' × ' + dpt(p) + ') = <b>' + dpt(att) + ' D</b>'
        };
      } },

    { id: 'kestenbaum', nom: 'Règle de Kestenbaum', ic: '🔎',
      calc: 'vertex', formule: 'kestenbaum', ue: 'UE26',
      tirer: function (rnd, niv) {
        var dec = pick(rnd, niv === 'rode' ? [0.06, 0.08, 0.12, 0.16, 0.03, 0.15] : [0.04, 0.05, 0.1, 0.125, 0.2, 0.25]);
        var att = R.kestenbaum(dec);
        return {
          enonce: 'Un patient malvoyant a une acuité de <b>' + nb(dec * 10, 1) + '/10</b>. ' +
            'Quelle addition la règle de Kestenbaum propose-t-elle pour lire du texte courant ?',
          champs: [{ k: 'v', label: 'addition', unite: 'D', attendu: att, tol: 0.5, pas: 0.5 }],
          pieges: [
            { k: 'v', v: r2(1 / (dec * 10), 2), dit: 'Acuité en <b>décimale</b> (' + nb(dec, 2) + '), pas en dixièmes : sinon l’addition sort dix fois trop faible.' },
            { k: 'v', v: r2(dec, 2), dit: 'Kestenbaum prend l’<b>inverse</b> de l’acuité décimale.' }
          ],
          rappel: 'addition ≈ 1 / ' + nb(dec, 2) + ' = <b>' + nb(att, 1) + ' D</b>'
        };
      } },

    /* ============================================================
       Optique géométrique — les exercices du cours d'UE02
       ------------------------------------------------------------
       Sept postes tirés des problèmes du poly : Descartes, l'angle
       limite, le prisme exact et le prisme de l'orthoptiste, la
       vergence d'un dioptre, la conjugaison d'un miroir et d'une
       lentille, et le poisson-pêcheur du dioptre plan.

       Les pièges ne sont pas inventés : ce sont les erreurs que la
       convention algébrique fabrique — un signe pris à l'envers,
       des centimètres laissés en centimètres, la formule des petits
       angles appliquée à un prisme de soixante degrés.
       ============================================================ */

    { id: 'descartes', nom: 'Descartes — l’angle réfracté', ic: '🔦',
      formule: 'descartes', ue: 'UE02',
      tirer: function (rnd, niv) {
        var n1 = pick(rnd, niv === 'rode' ? [1.33, 1.5, 1.6] : [1, 1.33, 1.5]);
        var n2 = pick(rnd, niv === 'rode' ? [1, 1.33, 1.5, 1.6] : [1.33, 1.5]);
        if (n1 === n2) n2 = n1 === 1.5 ? 1 : 1.5;
        var i1 = pick(rnd, niv === 'rode' ? [38, 44, 51, 58, 65] : [40, 45, 50, 60]);
        var sin = function (a) { return Math.sin(a * Math.PI / 180); };
        var s = n1 * sin(i1) / n2;
        if (Math.abs(s) > 1) { n2 = n1 + 0.3; s = n1 * sin(i1) / n2; }
        /* Tant que « i₁ × n₁/n₂ » reste a moins d’un degre de la vraie
           reponse, ce piege serait accepte comme juste : on ouvre
           l’incidence jusqu’a ce que les deux se separent. */
        while (Math.abs(i1 * n1 / n2 - Math.asin(s) * 180 / Math.PI) < 1 && i1 < 78) {
          i1 += 6;
          s = n1 * sin(i1) / n2;
          if (Math.abs(s) > 1) { n2 = r2(n1 * sin(i1) / 0.97, 2); s = n1 * sin(i1) / n2; }
        }
        var att = r2(Math.asin(s) * 180 / Math.PI, 2);
        var inverse = n2 * sin(i1) / n1;
        return {
          enonce: 'Un rayon passe d’un milieu d’indice <b>n₁ = ' + nb(n1, 2) + '</b> vers un milieu ' +
            'd’indice <b>n₂ = ' + nb(n2, 2) + '</b> avec un angle d’incidence de <b>' + nb(i1, 0) +
            '°</b>. Quel est l’angle de réfraction ?',
          champs: [{ k: 'v', label: 'angle réfracté i₂', unite: '°', attendu: att, tol: 0.4, pas: 0.5 }],
          pieges: [
            { k: 'v', v: r2(Math.abs(inverse) <= 1 ? Math.asin(inverse) * 180 / Math.PI : 0, 2),
              dit: 'Rapport inversé. La loi s’écrit n₁ sin i₁ = n₂ sin i₂, donc sin i₂ = ' +
                '<b>n₁/n₂</b> × sin i₁ — l’indice du milieu d’<b>arrivée</b> est au dénominateur.' },
            { k: 'v', v: r2(i1 * n1 / n2, 2),
              dit: 'Vous avez appliqué le rapport aux <b>angles</b> et non à leurs sinus. ' +
                'Descartes porte sur les sinus ; l’assimilation angle ≈ sinus n’est valable que ' +
                'sous quelques degrés.' },
            { k: 'v', v: r2(i1, 0),
              dit: 'C’est l’angle d’<b>incidence</b>, pas le réfracté. Seul le rayon réfléchi ' +
                'garde le même angle (i′ = i₁).' }
          ],
          rappel: 'sin i₂ = (n₁/n₂) sin i₁ = (' + nb(n1, 2) + '/' + nb(n2, 2) + ') × sin ' +
            nb(i1, 0) + '° → i₂ = <b>' + nb(att, 1) + '°</b>' +
            (n1 > n2 ? ' — on s’éloigne de la normale, puisqu’on va vers un milieu moins réfringent.'
                     : ' — on se rapproche de la normale.')
        };
      } },

    { id: 'angle_limite', nom: 'Angle limite et réflexion totale', ic: '🪞',
      formule: 'reflexion_totale', ue: 'UE02',
      tirer: function (rnd, niv) {
        var n1 = pick(rnd, niv === 'rode' ? [1.33, 1.45, 1.52, 1.62, 1.7] : [1.33, 1.5, 1.6]);
        var n2 = pick(rnd, niv === 'rode' ? [1, 1.33] : [1]);
        if (n2 >= n1) n2 = 1;
        var att = r2(Math.asin(n2 / n1) * 180 / Math.PI, 2);
        return {
          enonce: 'Un rayon va d’un milieu d’indice <b>' + nb(n1, 2) + '</b> vers un milieu ' +
            'd’indice <b>' + nb(n2, 2) + '</b>. À partir de quel angle d’incidence n’y a-t-il ' +
            '<b>plus aucun rayon transmis</b> ?',
          champs: [{ k: 'v', label: 'angle limite λ', unite: '°', attendu: att, tol: 0.4, pas: 0.5 }],
          pieges: [
            { k: 'v', v: r2(Math.acos(n2 / n1) * 180 / Math.PI, 2),
              dit: 'Vous avez pris l’<b>arc cosinus</b>. L’angle limite est celui dont le sinus ' +
                'vaut n₂/n₁ : c’est là que le rayon réfracté rase la surface (i₂ = 90°).' },
            { k: 'v', v: 90,
              dit: 'C’est l’angle du rayon RÉFRACTÉ à la limite, pas celui de l’incident. ' +
                'On cherche l’incidence à partir de laquelle il n’y a plus de solution.' },
            { k: 'v', v: r2(Math.asin(n1 - n2) * 180 / Math.PI, 2),
              dit: 'Vous avez pris la <b>différence</b> des indices. C’est la formule du ' +
                'dioptre sphérique, où (n′−n) mesure le saut ; l’angle limite, lui, porte ' +
                'sur leur <b>rapport</b> : sin λ = n₂/n₁.' }
          ],
          rappel: 'sin λ = n₂/n₁ = ' + nb(n2, 2) + '/' + nb(n1, 2) + ' → λ = <b>' + nb(att, 1) +
            '°</b>. C’est ce qui fait marcher les fibres optiques, et ce qui empêche un prisme ' +
            'trop ouvert de laisser sortir la lumière.'
        };
      } },

    { id: 'prisme_exact', nom: 'Prisme — la déviation exacte', ic: '🔺',
      formule: 'prisme_exact', ue: 'UE02',
      tirer: function (rnd, niv) {
        var A = pick(rnd, niv === 'rode' ? [35, 45, 55, 60] : [30, 40, 50, 60]);
        var n = pick(rnd, niv === 'rode' ? [1.45, 1.52, 1.62] : [1.5]);
        var i = pick(rnd, niv === 'rode' ? [42, 48, 55, 62] : [45, 50, 60]);
        var r = Math.asin(Math.sin(i * Math.PI / 180) / n) * 180 / Math.PI;
        var rp = A - r;
        var s = n * Math.sin(rp * Math.PI / 180);
        if (Math.abs(s) > 1) { A = 40; r = Math.asin(Math.sin(i * Math.PI / 180) / n) * 180 / Math.PI;
          rp = A - r; s = n * Math.sin(rp * Math.PI / 180); }
        var ip = Math.asin(s) * 180 / Math.PI;
        var att = r2(i + ip - A, 2);
        return {
          enonce: 'Un prisme d’angle au sommet <b>A = ' + nb(A, 0) + '°</b> et d’indice <b>' +
            nb(n, 2) + '</b> reçoit un rayon sous une incidence de <b>' + nb(i, 0) + '°</b>. ' +
            'Quelle est la <b>déviation D</b> ?',
          champs: [{ k: 'v', label: 'déviation D', unite: '°', attendu: att, tol: 0.5, pas: 0.5 }],
          pieges: [
            { k: 'v', v: r2((n - 1) * A, 2),
              dit: 'Vous avez utilisé D = (n−1)A. Cette formule vient de l’approximation des ' +
                'petits angles : elle ne vaut que pour un prisme de quelques degrés attaqué ' +
                'presque de face — le prisme de l’orthoptiste, pas celui-ci.' },
            { k: 'v', v: r2(i + ip, 2),
              dit: 'Il manque le <b>−A</b>. La déviation vaut D = i + i′ − A : on retranche ' +
                'l’angle du prisme, sinon on compte deux fois la géométrie du triangle.' },
            { k: 'v', v: r2(r + rp, 2),
              dit: 'C’est A que vous avez recalculé : A = r + r′. La déviation se lit sur les ' +
                'angles <b>extérieurs</b> i et i′.' }
          ],
          rappel: 'r = ' + nb(r, 1) + '° · r′ = A − r = ' + nb(rp, 1) + '° · i′ = ' + nb(ip, 1) +
            '° → D = i + i′ − A = <b>' + nb(att, 1) + '°</b>'
        };
      } },

    { id: 'prisme_ortho', nom: 'Prisme mince — du degré à la dioptrie', ic: '📐',
      calc: 'prism', formule: 'prisme', ue: 'UE02',
      tirer: function (rnd, niv) {
        /* en deca de 4°, la puissance en Δ et l’angle du prisme se
           rejoignent : le premier piege deviendrait invisible. */
        var A = pick(rnd, niv === 'rode' ? [5, 7, 9, 12, 15] : [4, 6, 8, 10, 12]);
        var n = pick(rnd, niv === 'rode' ? [1.49, 1.52, 1.6] : [1.5]);
        var D = (n - 1) * A;
        var att = r2(100 * Math.tan(D * Math.PI / 180), 2);
        return {
          enonce: 'Un prisme mince d’angle <b>' + nb(A, 0) + '°</b> et d’indice <b>' + nb(n, 2) +
            '</b> est posé devant un œil. Quelle est sa puissance en <b>dioptries prismatiques</b> ?',
          champs: [{ k: 'v', label: 'puissance', unite: 'Δ', attendu: att, tol: 0.25, pas: 0.5 }],
          pieges: [
            { k: 'v', v: r2(A, 0),
              dit: 'Vous avez rendu l’angle du prisme. Un prisme de ' + nb(A, 0) + '° ne dévie ' +
                'que de (n−1)A = ' + nb(D, 1) + '° : c’est la déviation, pas la taille du verre, ' +
                'qui fait la puissance.' },
            { k: 'v', v: r2(100 * Math.tan(A * Math.PI / 180), 2),
              dit: 'Vous avez converti l’angle du prisme au lieu de la <b>déviation</b>. ' +
                'Il faut d’abord D = (n−1)A = ' + nb(D, 1) + '°, puis Δ = 100 tan D.' },
            { k: 'v', v: r2(D, 2),
              dit: 'C’est la déviation en <b>degrés</b>. Une dioptrie prismatique est un ' +
                'déplacement de 1 cm à 1 m : Δ = 100 × tan D, et 1 Δ ≈ 0,57°.' }
          ],
          rappel: 'D = (n−1)A = ' + nb(n - 1, 2) + ' × ' + nb(A, 0) + '° = ' + nb(D, 1) +
            '° → Δ = 100 tan D = <b>' + nb(att, 1) + ' Δ</b>'
        };
      } },

    { id: 'dioptre_vergence', nom: 'Dioptre sphérique — la vergence', ic: '🔵',
      formule: 'dioptre_spherique', ue: 'UE02',
      tirer: function (rnd, niv) {
        var n = pick(rnd, niv === 'rode' ? [1, 1.33, 1.5] : [1, 1.33]);
        var np = pick(rnd, niv === 'rode' ? [1.33, 1.5, 1.6] : [1.5]);
        if (np === n) np = n + 0.5;
        var Rcm = pick(rnd, niv === 'rode' ? [-40, -25, 15, 30, 50] : [20, 40, -30]);
        var att = r2((np - n) / (Rcm / 100), 2);
        return {
          enonce: 'Un dioptre sphérique de rayon <b>SC = ' + nb(Rcm, 0) + ' cm</b> sépare un ' +
            'milieu d’indice <b>n = ' + nb(n, 2) + '</b> d’un milieu d’indice <b>n′ = ' +
            nb(np, 2) + '</b>. Quelle est sa <b>vergence</b> ?',
          champs: [{ k: 'v', label: 'vergence', unite: 'D', attendu: att, tol: 0.15, pas: 0.25 }],
          pieges: [
            { k: 'v', v: r2((np - n) / Rcm, 2),
              dit: 'Le rayon est resté en <b>centimètres</b>. Une vergence s’exprime en m⁻¹ : ' +
                nb(Rcm, 0) + ' cm = ' + nb(Rcm / 100, 2) + ' m. Votre résultat est cent fois ' +
                'trop petit.' },
            { k: 'v', v: r2((n - np) / (Rcm / 100), 2),
              dit: 'Signe inversé : c’est <b>n′ − n</b> au numérateur, l’indice d’arrivée moins ' +
                'l’indice de départ. Le sens de propagation décide, pas l’ordre d’écriture.' },
            { k: 'v', v: r2(np / (Rcm / 100), 2),
              dit: 'Vous avez oublié de retrancher n. Sans <b>saut</b> d’indice il n’y a pas de ' +
                'dioptre : une lentille dans un liquide de même indice est invisible.' }
          ],
          rappel: 'V = (n′ − n)/SC = (' + nb(np, 2) + ' − ' + nb(n, 2) + ')/' + nb(Rcm / 100, 2) +
            ' m = <b>' + nb(att, 2) + ' D</b> — dioptre ' + (att > 0 ? 'convergent' : 'divergent')
        };
      } },

    { id: 'miroir_conjug', nom: 'Miroir sphérique — où se forme l’image', ic: '🔮',
      formule: 'miroir_spherique', ue: 'UE02',
      tirer: function (rnd, niv) {
        var R = pick(rnd, niv === 'rode' ? [24, 36, 50, 64] : [20, 40, 60]);
        var d = pick(rnd, niv === 'rode' ? [15, 22, 35, 48, 75] : [10, 30, 60, 90]);
        /* ni au foyer (image a l’infini) ni au centre : la, le piege du
           facteur 2 oublie diviserait par zero. */
        if (Math.abs(d - R / 2) < 3) d = d + 10;
        if (Math.abs(d - R) < 3) d = d + 12;
        var SC = -R, SA = -d;
        var att = r2(1 / (2 / SC - 1 / SA), 2);
        return {
          enonce: 'Un miroir <b>concave</b> de rayon <b>' + nb(R, 0) + ' cm</b> reçoit un objet ' +
            'réel placé à <b>' + nb(d, 0) + ' cm</b> devant lui. Où se forme l’image ? ' +
            '<i style="opacity:.68">(mesure algébrique SA′, négative devant le miroir)</i>',
          champs: [{ k: 'v', label: 'SA′', unite: 'cm', attendu: att, tol: 1.2, pas: 1 }],
          pieges: [
            { k: 'v', v: r2(1 / (1 / SC - 1 / SA), 2),
              dit: 'Il manque le <b>facteur 2</b>. La relation est 2/SC = 1/SA + 1/SA′ : le foyer ' +
                'est au MILIEU du rayon, pas au centre.' },
            { k: 'v', v: r2(-1 / (2 / SC - 1 / SA), 2),
              dit: 'Bonne valeur, mauvais signe. L’objet est à gauche donc SA < 0 ; une image ' +
                'réelle se forme <b>devant</b> le miroir, donc SA′ < 0 elle aussi.' },
            { k: 'v', v: r2(1 / (2 / R - 1 / SA), 2),
              dit: 'Vous avez pris SC positif. Pour un miroir <b>concave</b>, le centre est dans ' +
                'l’espace réel, donc en amont du sommet : SC = −' + nb(R, 0) + ' cm.' }
          ],
          rappel: '2/SC = 1/SA + 1/SA′ avec SC = ' + nb(SC, 0) + ' et SA = ' + nb(SA, 0) +
            ' → SA′ = <b>' + nb(att, 1) + ' cm</b>, image ' +
            (att < 0 ? 'réelle (devant le miroir)' : 'virtuelle (derrière)')
        };
      } },

    { id: 'lentille_conjug', nom: 'Lentille mince — position de l’image', ic: '🔍',
      calc: 'vergence', formule: 'lentille_mince', ue: 'UE02',
      tirer: function (rnd, niv) {
        var f = pick(rnd, niv === 'rode' ? [-25, -12, 8, 16, 33] : [10, 20, 25, -20]);
        var d = pick(rnd, niv === 'rode' ? [14, 27, 42, 65] : [15, 30, 50, 60]);
        if (Math.abs(d - f) < 3) d = d + 8;
        var OA = -d;
        var att = r2(1 / (1 / f + 1 / OA), 2);
        return {
          enonce: 'Une lentille mince de distance focale <b>f′ = ' + nb(f, 0) + ' cm</b> reçoit ' +
            'un objet réel à <b>' + nb(d, 0) + ' cm</b> devant elle. Où se forme l’image ? ' +
            '<i style="opacity:.68">(mesure algébrique OA′, positive après la lentille)</i>',
          champs: [{ k: 'v', label: 'OA′', unite: 'cm', attendu: att, tol: 1.2, pas: 1 }],
          pieges: [
            { k: 'v', v: r2(1 / (1 / f - 1 / OA), 2),
              dit: 'Signe de OA. L’objet est <b>avant</b> la lentille, donc OA = −' + nb(d, 0) +
                ' cm. La relation 1/OA′ − 1/OA = 1/f′ devient 1/OA′ = 1/f′ + 1/OA, avec un OA ' +
                'négatif.' },
            { k: 'v', v: r2(f + d, 2),
              dit: 'Les distances ne s’ajoutent pas : ce sont leurs <b>inverses</b> qui se ' +
                'combinent. C’est toute la raison d’être de la dioptrie.' },
            { k: 'v', v: r2(-1 / (1 / f + 1 / OA), 2),
              dit: 'Bonne valeur, signe inversé. Une image réelle se forme <b>après</b> la ' +
                'lentille : OA′ > 0. Une image virtuelle est en amont, donc négative.' }
          ],
          rappel: '1/OA′ = 1/f′ + 1/OA = 1/' + nb(f, 0) + ' + 1/(' + nb(OA, 0) + ') → OA′ = <b>' +
            nb(att, 1) + ' cm</b>, image ' + (att > 0 ? 'réelle et renversée' : 'virtuelle et droite')
        };
      } },

  ];

  /* ---------------- Tirage ---------------- */

  function poste(id) {
    for (var i = 0; i < POSTES.length; i++) if (POSTES[i].id === id) return POSTES[i];
    return null;
  }

  function tirer(id, niveau, rnd) {
    var p = poste(id);
    if (!p) return null;
    var s = p.tirer(rnd || Math.random, niveau || 'initie');
    s.poste = p.id;
    return s;
  }

  /* Une série. On tire dans un sac qu'on vide avant de le remplir :
     le hasard pur oublie des postes et en répète d'autres trois fois,
     ce qui, sur dix questions, fait manquer la moitié du programme. */
  function serie(opts) {
    opts = opts || {};
    var rnd = opts.rnd || Math.random;
    var ids = (opts.postes && opts.postes.length) ? opts.postes : POSTES.map(function (p) { return p.id; });
    var n = opts.n || 10, out = [], sac = [], garde = 0;
    while (out.length < n && garde++ < n * 40) {
      if (!sac.length) {
        sac = ids.slice();
        for (var i = sac.length - 1; i > 0; i--) {
          var j = Math.floor(rnd() * (i + 1)), t = sac[i]; sac[i] = sac[j]; sac[j] = t;
        }
      }
      var s = tirer(sac.pop(), opts.niveau, rnd);
      var dernier = out[out.length - 1];
      if (dernier && dernier.enonce === s.enonce) continue;   /* jamais deux fois de suite */
      out.push(s);
    }
    return out;
  }

  /* ---------------- Correction ---------------- */

  /* Pour chaque champ : juste ou faux, et si faux, le piège reconnu.
     Un piège n'est retenu que s'il est DISTINCT de la bonne réponse —
     sinon on accuserait l'étudiant d'une faute qu'il n'a pas commise. */
  function corriger(sujet, reponses) {
    reponses = reponses || {};
    var champs = sujet.champs.map(function (c) {
      var saisi = reponses[c.k];
      var vide = saisi === undefined || saisi === null || saisi === '' || isNaN(Number(saisi));
      var v = vide ? null : Number(saisi);
      var ok = !vide && Math.abs(v - c.attendu) <= c.tol;
      var piege = null;
      if (!ok && !vide) {
        (sujet.pieges || []).forEach(function (p) {
          if (piege || p.k !== c.k) return;
          if (Math.abs(p.v - c.attendu) <= c.tol) return;      /* piège confondu avec la réponse */
          if (Math.abs(v - p.v) <= c.tol) piege = p;
        });
      }
      return {
        k: c.k, label: c.label, unite: c.unite, attendu: c.attendu,
        saisi: vide ? null : v, ok: ok, piege: piege
      };
    });
    var justes = champs.filter(function (c) { return c.ok; }).length;
    return {
      champs: champs,
      ok: justes === champs.length,
      part: champs.length ? justes / champs.length : 0,
      piege: (champs.filter(function (c) { return c.piege; })[0] || {}).piege || null
    };
  }

  window.Atelier = {
    postes: POSTES, poste: poste, tirer: tirer, serie: serie,
    corriger: corriger, nb: nb, dpt: dpt
  };
})();
