/* ============================================================
   Txt — comparer et surligner du texte français
   ------------------------------------------------------------
   Trois écrans cherchent dans du texte : la recherche rapide
   (app.js), le glossaire et la récitation d'une UE. Ils en
   avaient chacun leur copie, et une correction faite à un
   endroit ne se propageait nulle part — les ligatures, par
   exemple, n'étaient traitées dans aucune des trois : « Œdème »
   se rangeait sous une lettre « Œ » à lui tout seul, invisible
   quand on filtrait sur O.

   `keepLength` mérite un mot : elle rend une chaîne normalisée
   de la MÊME longueur que l'originale, caractère pour caractère.
   C'est ce qui permet de chercher sans accents puis de reporter
   les positions trouvées sur le texte affiché, accents compris.
   ============================================================ */
(function () {
  'use strict';

  /* les ligatures ne sont pas des accents : NFD ne les décompose pas */
  var LIGATURES = /[œæ]/g;
  var LIGATURE_MAP = { 'œ': 'oe', 'æ': 'ae' };

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .replace(LIGATURES, function (c) { return LIGATURE_MAP[c]; })
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  /* un caractère d'entrée → un caractère de sortie */
  function keepLength(s) {
    s = String(s || '');
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = norm(s.charAt(i));
      out += c.length === 1 ? c : (c.charAt(0) || ' ');
    }
    return out;
  }

  function tokens(q) {
    return norm(String(q || '').trim()).split(/\s+/).filter(Boolean);
  }

  /* Initiale de classement : « Élévation » et « Œdème » se rangent
     sous E et O, là où on va les chercher. */
  function initial(s) {
    return (keepLength(s).charAt(0) || '?').toUpperCase();
  }

  /* Rend un fragment où les portions correspondant à la requête sont
     enveloppées dans un <mark>, accents et casse d'origine conservés. */
  function highlight(text, toks) {
    var frag = document.createDocumentFragment();
    text = String(text || '');
    if (!toks || !toks.length) { frag.appendChild(document.createTextNode(text)); return frag; }

    var n = keepLength(text);
    var marks = new Array(text.length);
    toks.forEach(function (t) {
      var from = 0, i;
      while ((i = n.indexOf(t, from)) >= 0) {
        for (var k = i; k < i + t.length; k++) marks[k] = true;
        from = i + t.length;
      }
    });

    var buf = '', on = false;
    function flush() {
      if (!buf) return;
      frag.appendChild(on ? UI.el('mark', { text: buf }) : document.createTextNode(buf));
      buf = '';
    }
    for (var j = 0; j < text.length; j++) {
      var m = !!marks[j];
      if (m !== on) { flush(); on = m; }
      buf += text.charAt(j);
    }
    flush();
    return frag;
  }

  window.Txt = {
    norm: norm,
    keepLength: keepLength,
    tokens: tokens,
    initial: initial,
    highlight: highlight
  };
})();
