/* ============================================================
   UEBank — la banque d'items interrogeables du référentiel
   ------------------------------------------------------------
   Construite à partir des sources de données d'UE :
     UE_GUIDE.chiffres   → items « chiffre »
     UE_EXTRA.qr         → items « question »
     UE_DEEP.tableaux    → items « tableau » (une colonne masquée)
     UE_DEEP.mnemo       → items « mnémotechnique »
     UE_COURS[].cle      → items « phrase clé » (l'essentiel d'une
                           partie de cours, tel qu'on le demande à l'oral)

   Elle est partagée par « Mes UE » (mode Réciter) et par l'examen
   blanc (postes oraux) : sans cela, les deux modules dériveraient
   chacun leur propre version des mêmes questions.

   Chaque item porte un identifiant stable, ce qui lui donne une
   mémoire propre dans la répétition espacée (Store.state.srs) :
   réciter une UE ne produit plus un score de séance jetable, mais
   fait avancer item par item. Les chiffres reprennent volontairement
   l'identifiant des fiches mémo générées (core/cards.js) — un même
   fait n'a qu'une mémoire, qu'on le révise ici ou là.
   ============================================================ */
(function () {
  'use strict';

  var cache = null;

  function guide() { return window.UE_GUIDE || {}; }
  function extra() { return window.UE_EXTRA || {}; }
  function deep() { return window.UE_DEEP || {}; }
  function cours() { return window.UE_COURS || {}; }

  /* Ce que vaut un item dans l'estimation de maîtrise, selon sa boîte
     Leitner. Un item jamais interrogé vaut 0 ; un item rappelé une fois
     ne vaut pas encore un item tenu depuis trois semaines. */
  var BOX_VALUE = [0, 0.15, 0.45, 0.65, 0.85, 1];

  function slug(code) { return String(code).replace(/\s+/g, ''); }

  /* Le préfixe d'identifiant d'une UE dépend de son semestre : c'est la
     convention posée par Cards.generated(), qu'on ne change pas sous
     peine de perdre l'historique de répétition espacée. */
  function prefix(code) {
    var l = UEBank.locate(code);
    return 'ue-' + (l ? l.sem.id : 'S0') + '-' + slug(code) + '-';
  }

  /* Un tableau se récite en masquant une colonne : la première sert
     d'entrée, chacune des suivantes fait une question. */
  function tableItems(tb, p, from) {
    var out = [];
    tb.r.forEach(function (row) {
      for (var i = 1; i < tb.c.length; i++) {
        var v = String(row[i] == null ? '' : row[i]).trim();
        if (!v || v === '—') continue;
        out.push({
          kind: 'tableau',
          id: p + 't' + (from + out.length),
          q: '<span class="rc-tab">' + tb.t + '</span>' +
             '<b>' + row[0] + '</b><span class="rc-arrow">→</span>' + tb.c[i] + ' ?',
          a: v
        });
      }
    });
    return out;
  }

  /* Les items d'une UE sont reconstruits à l'identique à chaque appel, et
     `items` est appelé pour chaque carte d'UE, chaque tri, chaque filtre :
     on les garde. Les données d'UE ne changent pas en cours d'exécution. */
  var byCode = {};

  var UEBank = {
    /* tous les items interrogeables d'une UE, dans un ordre stable */
    items: function (code) {
      if (byCode[code]) return byCode[code];
      var g = guide()[code], e = extra()[code], d = deep()[code];
      var p = prefix(code);
      var out = [];
      if (g && g.chiffres) {
        g.chiffres.forEach(function (c, i) {
          /* même identifiant que la fiche mémo tirée de ce chiffre */
          out.push({ kind: 'chiffre', id: p + i, q: c[0], a: c[1] });
        });
      }
      if (e && e.qr) {
        e.qr.forEach(function (q, i) {
          out.push({ kind: 'question', id: p + 'q' + i, q: q[0], a: q[1] });
        });
      }
      if (d && d.tableaux) {
        /* les lignes de tableau sont numérotées à la suite, tous tableaux
           confondus : l'identifiant reste stable tant que l'ordre des
           tableaux et de leurs lignes ne change pas */
        var nt = 0;
        d.tableaux.forEach(function (tb) {
          var rows = tableItems(tb, p, nt);
          nt += rows.length;
          out = out.concat(rows);
        });
      }
      if (d && d.mnemo) {
        d.mnemo.forEach(function (m, i) {
          out.push({
            kind: 'mnemo',
            id: p + 'm' + i,
            q: 'Que code le moyen « ' + m[0] + ' » ?',
            a: m[1]
          });
        });
      }
      /* Les phrases à retenir du cours sont la meilleure question d'oral qui
         soit — « dites-moi l'essentiel sur ce point ». Elles vivent dans
         uecours.js, une par partie de plan, et se récitent comme le reste. */
      var c = cours()[code];
      if (c && g && g.plan) {
        c.forEach(function (x, i) {
          if (!x || !x.cle || !g.plan[i]) return;
          out.push({
            kind: 'cle',
            id: p + 'c' + i,
            q: '<span class="rc-tab">Le cours · ' +
               String(g.plan[i].t).replace(/^\s*\d+\s*·\s*/, '') + '</span>' +
               'Que faut-il retenir de cette partie ?',
            a: x.cle
          });
        });
      }
      byCode[code] = out;
      return out;
    },

    /* toute la banque, chaque item portant son UE d'origine */
    all: function () {
      if (cache) return cache;
      var out = [];
      Object.keys(guide()).forEach(function (code) {
        UEBank.items(code).forEach(function (it) {
          out.push({ kind: it.kind, id: it.id, q: it.q, a: it.a, code: code });
        });
      });
      cache = out;
      return out;
    },

    /* ------------------------------------------------------------
       Ce que l'étudiant a réellement en mémoire sur une UE
       ------------------------------------------------------------
       total   : items interrogeables
       seen    : items déjà passés au moins une fois
       known   : items installés (boîte 4 ou 5)
       due     : items à revoir aujourd'hui — jamais vus compris
       value   : 0..1, la valeur de mémoire moyenne (cf. BOX_VALUE)
       ------------------------------------------------------------ */
    memory: function (code) {
      var items = UEBank.items(code);
      var srs = (window.Store && Store.state && Store.state.srs) || {};
      var now = Date.now();
      var seen = 0, known = 0, due = 0, val = 0;
      var boxes = [0, 0, 0, 0, 0, 0];
      items.forEach(function (it) {
        var c = srs[it.id];
        var box = c ? c.box : 1;
        boxes[box]++;
        if (c) {
          seen++;
          if (box >= 4) known++;
          val += BOX_VALUE[box];
        }
        if (!c || c.due <= now) due++;
      });
      return {
        total: items.length, seen: seen, known: known, due: due, boxes: boxes,
        value: items.length ? val / items.length : 0,
        pct: items.length ? Math.round((val / items.length) * 100) : 0
      };
    },

    boxOf: function (id) {
      var c = (window.Store && Store.state && Store.state.srs) || {};
      return c[id] ? c[id].box : 1;
    },

    isDue: function (id) {
      var c = ((window.Store && Store.state && Store.state.srs) || {})[id];
      return !c || c.due <= Date.now();
    },

    /* ------------------------------------------------------------
       La file d'interrogation d'une UE
       ------------------------------------------------------------
       On ne tire plus au hasard : ce qui est dû passe devant, et parmi
       ce qui est dû, ce qui tient le moins bien. À boîte égale, l'ordre
       est brassé — sans quoi la même série reviendrait dans le même
       ordre à chaque séance, et l'on finirait par retenir la place de
       la réponse plutôt que la réponse.
         only    : ne garder qu'une nature d'item
         dueOnly : ne garder que ce qui est à revoir aujourd'hui
         limit   : longueur de la séance
       ------------------------------------------------------------ */
    queue: function (code, opts) {
      opts = opts || {};
      var srs = (window.Store && Store.state && Store.state.srs) || {};
      var now = Date.now();
      /* la file porte l'état du jour (boîte, échéance) : on travaille sur des
         copies, les items eux-mêmes sont partagés et doivent rester intacts */
      var list = UEBank.items(code).filter(function (it) {
        if (opts.only && it.kind !== opts.only) return false;
        if (opts.dueOnly && !(!srs[it.id] || srs[it.id].due <= now)) return false;
        return true;
      }).map(function (it) {
        var c = srs[it.id];
        return {
          kind: it.kind, id: it.id, q: it.q, a: it.a,
          box: c ? c.box : 1, due: !c || c.due <= now, fresh: !c, _r: Math.random()
        };
      });
      list.sort(function (a, b) {
        if (a.due !== b.due) return a.due ? -1 : 1;      // le dû d'abord
        if (a.box !== b.box) return a.box - b.box;        // le plus fragile d'abord
        return a._r - b._r;                               // puis au hasard
      });
      if (opts.limit && list.length > opts.limit) list = list.slice(0, opts.limit);
      return list;
    },

    /* les cas d'application, avec leur UE */
    cases: function () {
      var D = deep(), out = [];
      Object.keys(D).forEach(function (code) {
        if (D[code].cas) out.push({ code: code, cas: D[code].cas });
      });
      return out;
    },

    /* où se trouve une UE dans le référentiel */
    locate: function (code) {
      var C = window.CURRICULUM || [];
      for (var i = 0; i < C.length; i++) {
        var u = C[i].ues.filter(function (x) { return x.code === code; })[0];
        if (u) return { sem: C[i], ue: u };
      }
      return null;
    },

    label: function (code) {
      var l = UEBank.locate(code);
      return l ? l.ue.code + ' — ' + l.ue.title : code;
    }
  };

  window.UEBank = UEBank;
})();
