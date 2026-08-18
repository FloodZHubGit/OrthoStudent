/* ============================================================
   UEBank — la banque d'items interrogeables du référentiel
   ------------------------------------------------------------
   Construite à partir des trois sources de données d'UE :
     UE_GUIDE.chiffres   → items « chiffre »
     UE_EXTRA.qr         → items « question »
     UE_DEEP.tableaux    → items « tableau » (une colonne masquée)
     UE_DEEP.mnemo       → items « mnémotechnique »

   Elle est partagée par « Mes UE » (mode Réciter) et par l'examen
   blanc (postes oraux) : sans cela, les deux modules dériveraient
   chacun leur propre version des mêmes questions.
   ============================================================ */
(function () {
  'use strict';

  var cache = null;

  function guide() { return window.UE_GUIDE || {}; }
  function extra() { return window.UE_EXTRA || {}; }
  function deep() { return window.UE_DEEP || {}; }

  /* Un tableau se récite en masquant une colonne : la première sert
     d'entrée, chacune des suivantes fait une question. */
  function tableItems(tb) {
    var out = [];
    tb.r.forEach(function (row) {
      for (var i = 1; i < tb.c.length; i++) {
        var v = String(row[i] == null ? '' : row[i]).trim();
        if (!v || v === '—') continue;
        out.push({
          kind: 'tableau',
          q: '<span class="rc-tab">' + tb.t + '</span>' +
             '<b>' + row[0] + '</b><span class="rc-arrow">→</span>' + tb.c[i] + ' ?',
          a: v
        });
      }
    });
    return out;
  }

  var UEBank = {
    /* tous les items interrogeables d'une UE, dans un ordre stable */
    items: function (code) {
      var g = guide()[code], e = extra()[code], d = deep()[code];
      var out = [];
      if (g && g.chiffres) {
        g.chiffres.forEach(function (c) {
          out.push({ kind: 'chiffre', q: c[0], a: c[1] });
        });
      }
      if (e && e.qr) {
        e.qr.forEach(function (p) {
          out.push({ kind: 'question', q: p[0], a: p[1] });
        });
      }
      if (d && d.tableaux) {
        d.tableaux.forEach(function (tb) {
          out = out.concat(tableItems(tb));
        });
      }
      if (d && d.mnemo) {
        d.mnemo.forEach(function (m) {
          out.push({
            kind: 'mnemo',
            q: 'Que code le moyen « ' + m[0] + ' » ?',
            a: m[1]
          });
        });
      }
      return out;
    },

    count: function (code, kind) {
      return UEBank.items(code).filter(function (x) { return !kind || x.kind === kind; }).length;
    },

    /* toute la banque, chaque item portant son UE d'origine */
    all: function () {
      if (cache) return cache;
      var out = [];
      Object.keys(guide()).forEach(function (code) {
        UEBank.items(code).forEach(function (it) {
          out.push({ kind: it.kind, q: it.q, a: it.a, code: code });
        });
      });
      cache = out;
      return out;
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
