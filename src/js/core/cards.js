/* ============================================================
   Cards — les fiches de l'étudiant, et ses cartes Anki
   ------------------------------------------------------------
   L'application ne livre plus de fiches : celles qu'elle avait
   écrites n'étaient adossées à aucune source, et le vrai cours
   est celui que l'étudiant prend lui-même.

   Restent deux choses, de statuts différents : ses fiches créées
   ici, qui suivent la révision espacée ; et ses cartes Anki, qui
   se consultent seulement — Anki les révise déjà, mieux.

   L'analyseur d'import — CSV, JSON, question/réponse, blocs, sept
   séparateurs — a été retiré avec l'onglet qui s'en servait. On ne
   crée donc plus de fiche ici : celles qui existent se lisent, se
   modifient et se suppriment, les nouvelles s'écrivent dans Anki.
   ============================================================ */
(function () {
  'use strict';

  var Cards = {
    custom: function () {
      return Store.state.customCards || [];
    },

    /* ------------------------------------------------------------
       Les cartes lues dans Anki.

       On garde le chemin complet du paquet — « Orthoptie::L1::S1::
       UE04_Physiologie_visuelle::CM01_Voir_ne_suffit_pas » — parce
       que c'est lui qui porte l'organisation de l'étudiant. Le nom
       affiché n'en reprend que les deux derniers niveaux : ce sont
       les seuls qui distinguent une carte d'une autre à l'écran, et
       un menu déroulant ne peut pas afficher cinq niveaux.

       Ces cartes n'entrent PAS dans la révision espacée de
       l'application, et c'est délibéré : Anki révise déjà, avec un
       planning meilleur que nos cinq boîtes. Les réviser ici serait
       faire le travail deux fois, avec deux calendriers qui ne se
       parlent pas — et le nôtre est le moins bon.

       Elles servent à ce qu'Anki ne fait pas : se relire par UE, se
       chercher au Ctrl+K, et bientôt s'écouter sans écran.
       ------------------------------------------------------------ */
    ankiCache: null,
    ankiCacheAt: null,

    anki: function () {
      var info = Store.ankiInfo();
      var jeton = info ? info.at + ':' + info.n : 'vide';
      if (Cards.ankiCache && Cards.ankiCacheAt === jeton) return Cards.ankiCache;
      Cards.ankiCache = (Store.anki() || []).map(function (c) {
        var seg = String(c.paquet || '').split('::').filter(Boolean);
        return {
          id: c.id,
          deck: 'Anki · ' + (seg.slice(-2).join(' · ') || 'sans paquet'),
          chemin: c.paquet || '',
          f: c.f, b: c.b,
          hint: seg.join(' › '),
          anki: true
        };
      });
      Cards.ankiCacheAt = jeton;
      return Cards.ankiCache;
    },

    /* L'application ne livre plus de fiches. Les 268 écrites à la main et
       les 251 dérivées des chiffres des UE ont été retirées : elles
       portaient un contenu non sourcé, et l'étudiant écrit les siennes
       dans Anki en comprenant son cours. Ne restent ici que celles qu'il a
       créées dans l'application — et Anki, qui se consulte à côté. */
    all: function () {
      return Cards.custom();
    },

    /* ------------------------------------------------------------
       À quelle UE appartient une carte ? Son paquet Anki le dit :
       « Orthoptie::L1::S1::UE04_Physiologie_visuelle::CM01_… ». On
       lit le premier segment qui commence par un code d'UE.

       Le référentiel écrit désormais « UE04 » lui aussi : les deux
       se rejoignent sans table de correspondance. On complète tout
       de même à deux chiffres, pour qu'un paquet nommé « UE4_… »
       tombe au bon endroit — l'étudiant range ses paquets à la
       main, il n'a pas à connaître notre convention.
       ------------------------------------------------------------ */
    /* Le code d'UE est calculé par le pont (anki.js) et posé sur la carte :
       une seule mise en œuvre, éprouvée par npm run anki. On sait encore le
       relire depuis le chemin, pour les cartes importées avant ce changement. */
    ueDeCarte: function (c) {
      if (c && c.ue) return c.ue;
      var seg = String((c && c.chemin) || '').split('::');
      for (var i = 0; i < seg.length; i++) {
        var m = /^UE\s?0*(\d{1,2})(?![0-9])/i.exec(seg[i].trim());
        if (m) return 'UE' + String(m[1]).padStart(2, '0');
      }
      return null;
    },

    /* les cartes d'une UE, sous-paquets compris */
    ankiDeUE: function (code) {
      if (!code) return [];
      return Cards.anki().filter(function (c) { return Cards.ueDeCarte(c) === code; });
    },

    isDue: function (card) {
      var s = Store.state.srs[card.id];
      return !s || s.due <= Date.now();
    },

    stats: function (cards) {
      var boxes = [0, 0, 0, 0, 0, 0], due = 0, started = 0;
      cards.forEach(function (c) {
        var s = Store.state.srs[c.id];
        boxes[s ? s.box : 1]++;
        if (s) started++;
        if (Cards.isDue(c)) due++;
      });
      var mastered = boxes[4] + boxes[5];
      return {
        n: cards.length, due: due, started: started, boxes: boxes,
        mastered: mastered,
        pct: cards.length ? Math.round((mastered / cards.length) * 100) : 0
      };
    },

    /* Paquets rangés par origine. Il n'en reste qu'une — les fiches que
       l'étudiant a créées ici — depuis que l'application ne livre plus de
       fiches et que l'import a été retiré. La forme du retour est
       conservée : c'est celle qu'attend le sélecteur de paquet. */
    groups: function () {
      var by = {};
      Cards.all().forEach(function (c) {
        var k = c.deck || 'Sans paquet';
        (by[k] = by[k] || []).push(c);
      });
      var decks = Object.keys(by).sort(function (a, b) { return a.localeCompare(b, 'fr'); })
        .map(function (k) {
          return { name: k, kind: 'custom', cards: by[k], stats: Cards.stats(by[k]) };
        });
      return decks.length
        ? [{ id: 'custom', label: 'Mes fiches', icon: '✏️',
             desc: 'Créées dans l’application', decks: decks }]
        : [];
    },

    update: function (id, f, b) {
      var c = Cards.custom().filter(function (x) { return x.id === id; })[0];
      if (!c) return false;
      c.f = f; c.b = b;
      Store.save();
      return true;
    },

    remove: function (id) {
      var list = Store.state.customCards || [];
      var i = list.findIndex(function (c) { return c.id === id; });
      if (i < 0) return false;
      list.splice(i, 1);
      delete Store.state.srs[id];
      Store.save();
      return true;
    },

    removeDeck: function (deck) {
      var list = Store.state.customCards || [];
      var kept = [];
      var removed = 0;
      list.forEach(function (c) {
        if (c.deck === deck) { delete Store.state.srs[c.id]; removed++; }
        else kept.push(c);
      });
      Store.state.customCards = kept;
      Store.save();
      return removed;
    },

    renameDeck: function (from, to) {
      (Store.state.customCards || []).forEach(function (c) { if (c.deck === from) c.deck = to; });
      Store.save();
    }
  };

  window.Cards = Cards;
})();
