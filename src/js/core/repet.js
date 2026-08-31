/* ============================================================
   Le répétiteur — comprendre une question posée en français,
   et y répondre avec le contenu de l'application
   ------------------------------------------------------------
   Ce fichier ne parle jamais à l'écran : il reçoit une phrase,
   il rend une réponse structurée. `modules/chat.js` la dessine.

   Le principe tient en une règle, et elle n'est pas négociable :
   **le répétiteur n'invente rien.** Chaque phrase qu'il rend est
   tirée du corpus de l'application — les 39 fiches d'UE, leurs
   parties de cours, les tableaux d'examen, le glossaire, les
   chiffres, les schémas. Quand il ne trouve pas, il le dit. Sur
   un contenu paramédical révisé avant un partiel, une réponse
   plausible mais fausse coûte plus cher que pas de réponse.

   Il fait donc deux choses, dans cet ordre :

     1. reconnaître l'INTENTION — « je n'ai pas compris X »,
        « quelle différence entre X et Y », « interroge-moi »,
        « c'est où dans mon programme » n'appellent pas la même
        réponse, même quand elles portent sur le même mot ;
     2. retrouver le MORCEAU DE CORPUS qui y répond, et le
        présenter sous la forme que l'intention demande.

   La différence avec la recherche rapide (Ctrl+K) est là :
   la recherche rend une liste de liens, le répétiteur rend une
   réponse — l'analogie, la phrase-clé, le schéma, l'erreur
   classique, et de quoi enchaîner.

   Le format de sortie est décrit en bas de fichier, au-dessus
   de `repondre`.
   ============================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     Petits outils de texte
     ------------------------------------------------------------ */

  function plain(html) {
    return String(html == null ? '' : html)
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ').trim();
  }

  /* Normalisation d'une question. `Txt.norm` retire accents et casse ;
     il reste les apostrophes typographiques et la ponctuation, qui
     collent les mots entre eux (« l’accommodation » ≠ « accommodation »). */
  function nq(s) {
    return Txt.norm(String(s || ''))
      .replace(/[’'`´-]/g, ' ')
      .replace(/[^a-z0-9°/,.+× ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Les mots qui ne portent aucun sens dans une question. Sans ce filtre,
     « je ne comprends pas la vergence » cherche « je », « ne », « pas ». */
  var STOP = (
    'je j me moi mon ma mes tu te toi ton ta tes il elle on nous vous ils elles ' +
    'le la les l un une des du de d au aux a et ou ni mais donc or car que qu qui quoi dont ' +
    'ce cet cette ces c ca cela ceci celui celle ceux se s y en ' +
    'ne pas plus rien jamais tres trop bien mal peu ' +
    'est sont etre suis es sommes etes etait etaient sera seront ' +
    'ai as avons avez ont avoir eu ' +
    'fait faire fais font ' +
    'sur sous dans par pour avec sans vers chez entre depuis pendant ' +
    'comment pourquoi quand ou combien quel quelle quels quelles ' +
    'expliquer explique explication comprends comprendre compris comprend ' +
    'dis dire savoir sais sait ' +
    'svp stp merci bonjour salut ' +
    'alors vraiment encore aussi meme deja ' +
    'truc chose'
  ).split(' ');
  var ESTSTOP = {};
  STOP.forEach(function (m) { ESTSTOP[m] = 1; });

  /* Une racine grossière : « muscles » et « muscle » doivent se rejoindre.
     On ne cherche pas la finesse d'un vrai lemmatiseur — juste à ne pas
     rater un pluriel, qui est de loin le cas le plus fréquent. */
  function racine(m) {
    if (m.length > 4 && /s$/.test(m)) return m.slice(0, -1);
    return m;
  }

  /* Les mots utiles d'une question, dédoublonnés, racines comprises. */
  function motsCles(q) {
    var vus = {}, out = [];
    nq(q).split(' ').forEach(function (m) {
      if (!m || m.length < 2 || ESTSTOP[m]) return;
      var r = racine(m);
      if (vus[r]) return;
      vus[r] = 1;
      out.push(r);
    });
    return out;
  }

  /* ------------------------------------------------------------
     Le corpus
     ------------------------------------------------------------
     Une entrée par morceau de savoir adressable. `t` est le titre
     (ce sur quoi on tombe en cherchant), `ns` tout le texte, `nb`
     les mots-clés secondaires (abréviations, valeurs).
     ------------------------------------------------------------ */

  var IDX = null;

  /* Le titre reduit a ses mots porteurs, tries : « Sturm (conoide de) » et
     « la conoide de Sturm » doivent se reconnaitre comme le meme appel, et
     un appel par son nom exact doit passer devant tout le reste. */
  function titreNu(t) {
    return Txt.norm(t || '').replace(/[’'`´-]/g, ' ')
      .split(/[^a-z0-9°]+/)
      .filter(function (m) { return m && !ESTSTOP[m]; })
      .map(racine).sort().join(' ');
  }

  function entree(o) {
    o.nt = Txt.norm(o.t || '');
    o.tn = titreNu(o.t);
    o.nb = Txt.norm(o.blob || '');
    o.ns = Txt.norm((o.t || '') + ' ' + (o.blob || '') + ' ' + (o.txt || ''));
    return o;
  }

  /* Dans quelles UE ce mot du glossaire est-il au programme ? uexpand.js le
     déclare explicitement, UE par UE, par titres exacts — une donnée tenue à
     la main, donc juste. C'est infiniment plus sûr que de rechercher le mot
     dans le texte des cours : « que veut dire DVD » contient « veut », qui
     se trouve dans la moitié des fiches, et ramenait le cours sur les
     prismes sous la définition d'une déviation verticale dissociée. */
  function ueDuMot(titre) {
    var X = window.UE_EXTRA || {}, out = [];
    Object.keys(X).forEach(function (code) {
      if ((X[code].mots || []).indexOf(titre) >= 0) out.push(code);
    });
    return out;
  }

  function localiser(code) {
    var l = window.UEBank ? UEBank.locate(code) : null;
    return l ? { sem: l.sem.id, titre: l.ue.title, ue: l.ue } : null;
  }

  function batir() {
    var idx = [];
    var G = window.UE_GUIDE || {}, X = window.UE_EXTRA || {},
        D = window.UE_DEEP || {}, CO = window.UE_COURS || {};

    Object.keys(G).forEach(function (code) {
      var f = G[code], loc = localiser(code);
      if (!loc) return;
      var sem = loc.sem;

      idx.push(entree({
        k: 'ue', code: code, sem: sem, t: code + ' — ' + loc.titre,
        blob: code + ' ' + sem + ' ' + loc.titre,
        txt: f.resume + ' ' + (f.objectifs || []).join(' '),
        fiche: f
      }));

      /* Les parties du plan, augmentées de la couche « cours vivant » :
         c'est l'entrée principale du répétiteur, celle qui porte à la fois
         l'explication, l'analogie, l'exemple clinique et le schéma. */
      (f.plan || []).forEach(function (p, i) {
        var u = (CO[code] || [])[i] || {};
        idx.push(entree({
          k: 'notion', code: code, sem: sem, i: i, corrigeable: true,
          t: String(p.t).replace(/^\s*\d+\s*[·.]\s*/, ''),
          txt: plain(p.p),
          blob: [u.cle, u.img, u.ex, u.err].filter(Boolean).join(' '),
          html: p.p, img: u.img, ex: u.ex, cle: u.cle, err: u.err, fig: u.fig
        }));
      });

      (f.chiffres || []).forEach(function (c) {
        idx.push(entree({
          k: 'chiffre', code: code, sem: sem, t: c[0], txt: c[1],
          blob: c[1], val: c[1]
        }));
      });

      (f.notions || []).forEach(function (n) {
        idx.push(entree({ k: 'retenir', code: code, sem: sem, t: plain(n), txt: plain(n), html: n }));
      });

      (f.pieges || []).forEach(function (p) {
        idx.push(entree({ k: 'piege', code: code, sem: sem, t: plain(p), txt: plain(p), html: p }));
      });
    });

    /* Les questions d'auto-interrogation sont déjà des questions : quand la
       demande leur ressemble, la réponse est écrite, en une phrase. */
    Object.keys(X).forEach(function (code) {
      var loc = localiser(code);
      (X[code].qr || []).forEach(function (qr) {
        idx.push(entree({
          k: 'qr', code: code, sem: loc ? loc.sem : '', t: qr[0],
          txt: qr[1], blob: qr[1], rep: qr[1]
        }));
      });
    });

    Object.keys(D).forEach(function (code) {
      var d = D[code], loc = localiser(code);
      var sem = loc ? loc.sem : '';

      (d.tableaux || []).forEach(function (tb, i) {
        idx.push(entree({
          k: 'tableau', code: code, sem: sem, i: i, t: tb.t,
          txt: (tb.c || []).join(' ') + ' ' + (tb.r || []).map(function (r) { return r.join(' '); }).join(' '),
          blob: (tb.r || []).map(function (r) { return r[0]; }).join(' '),
          tab: tb
        }));
      });

      if (d.cas) {
        idx.push(entree({
          k: 'cas', code: code, sem: sem, t: d.cas.t,
          txt: d.cas.s + ' ' + (d.cas.q || []).join(' ') + ' ' + plain(d.cas.r || ''),
          cas: d.cas
        }));
      }

      if (d.reponse) {
        idx.push(entree({
          k: 'plan', code: code, sem: sem, t: d.reponse.q,
          txt: (d.reponse.p || []).join(' '), rep: d.reponse
        }));
      }

      (d.mnemo || []).forEach(function (m) {
        idx.push(entree({ k: 'mnemo', code: code, sem: sem, t: plain(m[0]), txt: plain(m[1]), rep: m[1] }));
      });
    });

    (window.GLOSSARY || []).forEach(function (g) {
      idx.push(entree({
        k: 'terme', t: g.t, cat: g.c, txt: g.d, def: g.d, norme: g.n, voir: g.v, abr: g.a,
        blob: (g.a || '') + ' ' + (g.n || '')
      }));
    });

    (window.THEORY || []).forEach(function (ch) {
      (ch.sections || []).forEach(function (s) {
        idx.push(entree({
          k: 'theorie', t: s.title, chap: ch.id, chapT: ch.title,
          txt: plain(s.html), html: s.html, blob: ch.title
        }));
      });
    });

    if (window.UEFigs) {
      UEFigs.keys().forEach(function (key) {
        idx.push(entree({ k: 'schema', t: UEFigs.legende(key), fig: key, txt: UEFigs.legende(key) }));
      });
    }

    return idx;
  }

  function corpus() {
    if (!IDX) IDX = batir();
    return IDX;
  }

  /* ------------------------------------------------------------
     Chercher
     ------------------------------------------------------------ */

  /* Poids par nature. Une partie de cours répond mieux qu'une ligne de
     tableau à une question ouverte ; l'intention peut renverser cet ordre. */
  var POIDS = {
    qr: 55, notion: 45, terme: 40, tableau: 22, chiffre: 20, ue: 18,
    retenir: 16, piege: 14, theorie: 12, cas: 10, plan: 10, mnemo: 6, schema: 4
  };

  function noter(it, mots, boost, ctx) {
    var total = 0, touches = 0;
    for (var i = 0; i < mots.length; i++) {
      var m = mots[i], s = 0, p = it.nt.indexOf(m);
      if (p === 0) s = 140;
      else if (p > 0) s = it.nt.charAt(p - 1) === ' ' ? 95 : 45;
      else if (it.nb && it.nb.indexOf(m) >= 0) s = 40;
      else if (it.ns.indexOf(m) >= 0) s = 16;
      if (s) { total += s; touches++; }
    }
    if (!touches) return -1;
    /* Trouver tous les mots vaut beaucoup mieux que d'en trouver un seul :
       « vision binoculaire » ne doit pas ramener tout ce qui parle de vision. */
    total += touches === mots.length ? 70 : -45 * (mots.length - touches);
    /* On a nomme l'entree, pas seulement effleure ses mots : c'est la
       meilleure reponse possible, quelle que soit sa nature. */
    if (ctx && it.tn && it.tn === ctx.nom) total += 260;
    /* Une UE citee dans la question ferme le perimetre : « qu'est-ce qui
       tombe en UE3 » ne doit pas repondre avec l'UE 9. */
    if (ctx && ctx.code) total += it.code === ctx.code ? 130 : -60;
    return total + (POIDS[it.k] || 0) + ((boost && boost[it.k]) || 0)
      - Math.min(18, (it.t || '').length / 10);
  }

  function chercher(mots, opts) {
    opts = opts || {};
    if (!mots.length) return [];
    var seul = opts.k ? {} : null;
    if (opts.k) opts.k.forEach(function (k) { seul[k] = 1; });
    var ctx = { nom: mots.slice().sort().join(' '), code: opts.code || null };
    /* `dans` ferme le périmètre pour de bon, là où `code` se contente de
       favoriser : on s'en sert quand on SAIT dans quelles UE chercher. */
    var dans = null;
    if (opts.dans && opts.dans.length) {
      dans = {};
      opts.dans.forEach(function (c) { dans[c] = 1; });
    }

    return corpus()
      .filter(function (it) { return !seul || seul[it.k]; })
      .filter(function (it) { return !dans || dans[it.code]; })
      .map(function (it) { return { it: it, sc: noter(it, mots, opts.boost, ctx) }; })
      .filter(function (x) { return x.sc > (opts.min === undefined ? 0 : opts.min); })
      .sort(function (a, b) { return b.sc - a.sc; })
      .slice(0, opts.n || 6)
      .map(function (x) { return x.it; });
  }

  /* Le meilleur résultat, en préférant certaines natures sans les imposer :
     si aucune entrée de la nature voulue ne sort, on prend la meilleure
     tout court plutôt que de rendre « je ne sais pas » à tort. */
  /* Une entrée n'est un complément pertinent que si la question la nomme :
     partager quelques mots noyés dans un paragraphe ne suffit pas. Sans ce
     filtre, « que veut dire DVD » collait à la définition juste une partie
     de cours d'optique sans rapport — et lui empruntait sa provenance, ce
     qui est pire que de ne rien montrer. */
  function pertinent(it, mots) {
    if (!it) return false;
    return mots.some(function (m) {
      return it.nt.indexOf(m) >= 0 || (it.nb && it.nb.indexOf(m) >= 0);
    });
  }

  function meilleur(mots, prefere, opts) {
    var boost = {};
    (prefere || []).forEach(function (k, i) { boost[k] = 90 - i * 25; });
    return chercher(mots, Object.assign({ boost: boost, n: 1 }, opts || {}))[0] || null;
  }

  /* ------------------------------------------------------------
     Reconnaître l'intention
     ------------------------------------------------------------
     L'ordre compte : « quelle est la différence entre X et Y » contient
     « quelle », qui appartient aussi à une demande de définition. On teste
     donc du plus spécifique au plus général.
     ------------------------------------------------------------ */

  /* Les noms sous lesquels on demande un calcul avant d'en donner les
     chiffres. La liste suit celle des calculatrices. */
  var NOM_CALCUL = /^(transposition|transpose|prentice|hirschberg|krimsky|vergence|distance de sommet|sommet|vertex|hofstetter|addition|equivalent spherique|equivalent|acuite|logmar|parinaud|stereo|kestenbaum|skiascopie|conversion|convertis?|calcule?|combien fait)\s+/i;

  var INTENTS = [
    { k: 'aide', re: /^(aide|au secours|que sais tu faire|qui es tu|tu sais faire quoi|comment ca marche|comment tu marches)/ },
    { k: 'bonjour', re: /^(bonjour|bonsoir|salut|coucou|hello|hey|yo)\b/ },
    { k: 'merci', re: /^(merci|super|parfait|nickel|top|genial|ok merci)\b/ },
    { k: 'interro', re: /(interroge|interroger|interroges|teste? moi|questionne|fais moi reviser|pose moi|quiz moi|entraine moi)/ },
    { k: 'diff', re: /(difference|differencier|distinguer|confondre|confusion|comparer|comparaison|pas confondre|versus|\bvs\b)/ },
    { k: 'faire', re: /(je fais quoi|que dois je|quoi reviser|que reviser|par ou commencer|je suis perdu|je sais pas quoi|quoi travailler|organise|je commence par quoi)/ },
    { k: 'ou', re: /(dans quelle ue|quelle ue|quel semestre|au programme|c est ou|ou est ce|ou ca se trouve|ou se trouve|quand ai je|prochain cours|quand est ce que|ou en suis je|ou j en suis|mon niveau|ma maitrise|j en suis ou)/ },
    { k: 'plan', re: /(comment repondre|plan de reponse|comment rediger|question type|qui tombe|ca tombe|tombe en |tombe au |a l examen|au partiel|type de question)/ },
    { k: 'piege', re: /(piege|erreur|faute|se tromper|a eviter|attention a)/ },
    { k: 'schema', re: /(schema|schemas|dessin|figure|montre moi|illustre|dessine)/ },
    { k: 'chiffre', re: /(valeur normale|chiffre|combien vaut|combien mesure|norme|quelle valeur)/ },
    { k: 'cas', re: /(cas clinique|cas pratique|exemple de cas|un cas|mise en situation)/ },
    { k: 'defi', re: /(qu est ce que|qu est ce qu|c est quoi|definition|definis|que veut dire|que signifie|signification)/ },
    { k: 'expl', re: /(comprends|compris|comprendre|explique|expliquer|explication|je bloque|je capte|je rame|pourquoi|comment ca marche|comment fonctionne|approfondir|aller plus loin|en savoir plus|detaille|developpe)/ }
  ];

  function intention(q) {
    var n = nq(q);
    for (var i = 0; i < INTENTS.length; i++) {
      if (INTENTS[i].re.test(n)) return INTENTS[i].k;
    }
    return 'cherche';
  }

  /* Le code d'UE cité dans la question, s'il y en a un. */
  function ueCitee(q) {
    var m = /\bue\s*(\d{1,2})\b/.exec(nq(q));
    if (!m) return null;
    var code = 'UE' + m[1];
    return (window.UE_GUIDE || {})[code] ? code : null;
  }

  /* Les deux termes d'une comparaison. « différence entre A et B », « A ou B »,
     « ne pas confondre A et B » : on coupe sur le premier séparateur trouvé. */
  function deuxTermes(q) {
    var n = nq(q)
      .replace(/^.*?(difference|differencier|distinguer|confondre|confusion|comparer|comparaison)\s*(entre|:)?\s*/, '')
      .replace(/^(la|le|les|l|d|de|du)\s+/, '');
    var m = /^(.+?)\s+(?:et|ou|vs|versus|avec|contre)\s+(.+)$/.exec(n);
    if (!m) return null;
    var a = motsCles(m[1]), b = motsCles(m[2]);
    if (!a.length || !b.length) return null;
    return { a: a, b: b, ta: m[1].trim(), tb: m[2].trim() };
  }

  /* ------------------------------------------------------------
     Construire une réponse
     ------------------------------------------------------------ */

  /* D'ou vient une reponse. Tout ce que rend le repetiteur est source, y
     compris ce qui ne vient pas d'une UE : une definition de glossaire ou une
     section de « Cours & fiches » a droit a sa ligne, sans quoi ces reponses-la
     paraissent sorties de nulle part — exactement ce qu'on veut eviter. */
  function source(it) {
    if (!it) return null;
    if (!it.code) {
      if (it.k === 'terme') return { libelle: 'le glossaire' + (it.cat ? ' · ' + it.cat : ''), go: { id: 'glossary', params: { term: it.t } } };
      if (it.k === 'theorie') return { libelle: 'Cours & fiches · ' + it.chapT, go: { id: 'theory', params: { chapter: it.chap, section: it.t } } };
      return null;
    }
    var loc = localiser(it.code);
    return {
      code: it.code, sem: it.sem || (loc ? loc.sem : ''),
      titre: loc ? loc.titre : it.code,
      partie: it.k === 'notion' ? it.t : null
    };
  }

  function actionsUE(code, extra) {
    var loc = localiser(code);
    if (!loc) return extra || [];
    var out = [
      { ic: '🎓', label: 'Ouvrir la fiche ' + code, go: { id: 'studies', params: { sem: loc.sem, ue: code } } },
      { ic: '🎤', label: 'M’interroger sur ' + code, quiz: code }
    ];
    return out.concat(extra || []);
  }

  /* La partie de cours d'où vient une notion, montée en blocs affichables.
     `court` sert quand la notion n'est qu'un complément à une autre réponse. */
  function blocsNotion(it, court) {
    var b = [];
    /* La correction de l'étudiant passe AVANT tout le reste : sur ce point
       précis, son cours fait autorité et le nôtre non. */
    var corr = (it.code && it.i !== undefined && window.Store)
      ? Store.correction(it.code, it.i) : '';
    if (corr) b.push({ k: 'corr', html: corr, code: it.code, i: it.i });
    if (it.cle) b.push({ k: 'cle', html: it.cle });
    if (it.img) b.push({ k: 'img', html: it.img });
    if (!court && it.html) b.push({ k: 'p', html: it.html });
    if (it.fig) b.push({ k: 'fig', fig: it.fig });
    if (!court && it.ex) b.push({ k: 'ex', html: it.ex });
    if (it.err) b.push({ k: 'err', html: it.err });
    return b;
  }

  function blocsTerme(it) {
    var b = [{ k: 'p', html: it.def }];
    if (it.norme) b.push({ k: 'kv', rows: [['À retenir', it.norme]] });
    return b;
  }

  /* Ce qu'on propose d'enchaîner après une réponse. Des questions, pas des
     liens : le fil doit rester une conversation. */
  function suitesPour(it) {
    if (!it) return [];
    var s = [];
    if (it.k === 'notion' || it.k === 'qr') {
      s.push('Le piège classique sur ' + (it.code || 'ce point') + ' ?');
      s.push('Interroge-moi sur ' + (it.code || 'ça'));
    }
    if (it.k === 'terme') {
      (it.voir || []).slice(0, 2).forEach(function (v) { s.push('C’est quoi ' + v + ' ?'); });
      s.push('Où est-ce au programme ?');
    }
    if (it.code && s.length < 3) s.push('Qu’est-ce qui tombe en ' + it.code + ' ?');
    return s.slice(0, 3);
  }

  function vide(q, mots) {
    /* Des entrees qui ne partagent aucun mot avec la question ne sont pas
       « ce qui s'en rapproche » : c'est du remplissage, et ca decredibilise
       l'aveu qu'on vient de faire. On ne propose que de vraies touches. */
    var proches = chercher(mots, { n: 4 });
    return {
      q: q, intent: 'vide', vide: true,
      titre: 'Je n’ai pas ça',
      chapo: 'Rien dans le contenu de l’application ne répond à cette question — et je préfère vous le dire ' +
             'plutôt que de vous fabriquer une réponse. Je ne sais que restituer ce qui est écrit dans vos fiches.',
      blocs: proches.length ? [{
        k: 'liste', titre: 'Ce qui s’en rapproche le plus',
        items: proches.map(function (p) { return etiquette(p) + ' — ' + p.t; })
      }] : [],
      actions: [
        { ic: '🔎', label: 'Chercher dans tout le contenu', recherche: q },
        { ic: '❓', label: 'Ce que je sais faire', demande: 'Que sais-tu faire ?' }
      ],
      suites: proches.slice(0, 3).map(function (p) { return p.t; }),
      source: null
    };
  }

  var ETIQ = {
    notion: 'Cours', qr: 'Question', terme: 'Glossaire', tableau: 'Tableau',
    chiffre: 'Chiffre', ue: 'UE', retenir: 'À retenir', piege: 'Piège',
    theorie: 'Cours & fiches', cas: 'Cas', plan: 'Plan type', mnemo: 'Mnémo', schema: 'Schéma'
  };
  function etiquette(it) {
    return (ETIQ[it.k] || '') + (it.code ? ' · ' + it.code : '');
  }

  /* ------------------------------------------------------------
     Les réponses, une par intention
     ------------------------------------------------------------ */

  function repAide(q) {
    return {
      q: q, intent: 'aide', titre: 'Ce que je sais faire',
      chapo: 'Je suis un répétiteur, pas une intelligence artificielle : je ne rédige rien, je retrouve. ' +
             'Tout ce que je réponds sort de vos 39 fiches d’UE, de leurs parties de cours, des tableaux ' +
             'd’examen, du glossaire et des schémas — et je vous dis toujours d’où ça vient.',
      blocs: [{
        k: 'liste', titre: 'Écrivez comme vous parlez',
        items: [
          '<b>« je comprends pas l’accommodation »</b> — l’analogie, la phrase-clé, le schéma, l’erreur classique',
          '<b>« c’est quoi le rapport AC/A ? »</b> — la définition du glossaire et sa valeur normale',
          '<b>« différence entre ésotropie et exotropie »</b> — le tableau de comparaison',
          '<b>« interroge-moi sur l’UE 9 »</b> — cinq questions, ici même, comptées dans vos révisions',
          '<b>« montre-moi le schéma de la rétine »</b> — la figure, réglable quand elle l’est',
          '<b>« prentice 4 dioptries 3 mm »</b> — le calcul posé, avec le raisonnement',
          '<b>« l’astigmatisme, c’est où au programme ? »</b> — l’UE, le semestre, votre prochain cours dessus',
          '<b>« je fais quoi aujourd’hui ? »</b> — ce qui est dû, et l’UE la plus en retard'
        ]
      }, {
        k: 'note',
        html: 'Ce que je ne fais <b>pas</b> : inventer une explication qui n’est écrite nulle part, ' +
              'ni remplacer le cours de votre formateur. Quand je ne trouve pas, je le dis.'
      }],
      actions: [], suites: ['Je fais quoi aujourd’hui ?', 'C’est quoi l’amblyopie ?'], source: null
    };
  }

  function repBonjour(q) {
    var due = duJour();
    return {
      q: q, intent: 'bonjour', titre: 'Bonjour',
      chapo: due.total
        ? 'Vous avez <b>' + due.total + ' item' + (due.total > 1 ? 's' : '') + '</b> à revoir aujourd’hui. ' +
          'Sinon, posez-moi une question : une notion qui coince, un mot, une différence à tenir.'
        : 'Rien de dû aujourd’hui. Posez-moi une question : une notion qui coince, un mot, une différence à tenir.',
      blocs: [], actions: [],
      suites: ['Je fais quoi aujourd’hui ?', 'Que sais-tu faire ?'], source: null
    };
  }

  function repMerci(q) {
    return {
      q: q, intent: 'merci', titre: 'Avec plaisir',
      chapo: 'Une autre question ? Le plus utile, c’est de me donner le point exact qui coince — pas le chapitre entier.',
      blocs: [], actions: [], suites: [], source: null
    };
  }

  /* « je fais quoi » : la seule réponse qui ne vient pas du corpus mais de
     l'état de l'étudiant. Elle ne dit pas « révisez » — elle dit quoi, combien,
     et ouvre l'écran. */
  function duJour() {
    var out = { total: 0, parUE: [] };
    if (!window.UEBank || !window.UE_GUIDE) return out;
    var semId = Store.state.profile.semester;
    var sem = (window.CURRICULUM || []).filter(function (x) { return x.id === semId; })[0];
    if (!sem) return out;
    sem.ues.forEach(function (u) {
      if (!(window.UE_GUIDE || {})[u.code]) return;
      var m = UEBank.memory(u.code);
      if (m.due) out.parUE.push({ code: u.code, titre: u.title, due: m.due, pct: m.pct });
      out.total += m.due;
    });
    out.parUE.sort(function (a, b) { return b.due - a.due; });
    out.sem = sem;
    return out;
  }

  function repFaire(q) {
    var semId = Store.state.profile.semester;
    if (!semId) {
      return {
        q: q, intent: 'faire', titre: 'Dites-moi d’abord où vous en êtes',
        chapo: 'Je ne sais pas quel semestre vous suivez : sans ça, je ne peux pas trier vos priorités.',
        blocs: [], actions: [{ ic: '🎓', label: 'Choisir mon semestre', go: { id: 'studies', params: {} } }],
        suites: [], source: null
      };
    }
    var d = duJour();
    var prio = (window.Modules.studies && Modules.studies.priorities) ? Modules.studies.priorities(semId, 3) : [];
    var next = (window.Modules.edt && Modules.edt.next) ? Modules.edt.next() : null;

    var blocs = [];
    if (d.total) {
      blocs.push({
        k: 'kv', titre: 'À revoir aujourd’hui',
        rows: d.parUE.slice(0, 5).map(function (u) {
          return [u.code + ' — ' + u.titre, u.due + ' item' + (u.due > 1 ? 's' : '')];
        })
      });
    } else {
      blocs.push({ k: 'note', html: 'Rien de dû aujourd’hui — l’espacement fait son travail. C’est le bon jour pour <b>découvrir</b> une partie de cours, ou pour composer un cas.' });
    }

    if (prio.length) {
      blocs.push({
        k: 'liste', titre: 'Les UE les plus en retard, à poids d’ECTS égal',
        items: prio.map(function (p) {
          return '<b>' + p.ue.code + '</b> — ' + p.ue.title + ' · maîtrise ' + Math.round(p.pct) + ' %';
        })
      });
    }

    if (next && next.ue) {
      blocs.push({
        k: 'note',
        html: 'Votre prochain cours : <b>' + next.ue.code + ' — ' + next.titre + '</b>, ' +
              next.jour.nom.toLowerCase() + ' (' + next.jour.quand + '). ' +
              'Quatre minutes de fiche la veille changent tout ce qu’on en retire.'
      });
    }

    var actions = [];
    if (d.total && d.parUE[0]) actions = actionsUE(d.parUE[0].code);
    else if (prio[0]) actions = actionsUE(prio[0].ue.code);
    actions.push({ ic: '🗺', label: 'Ouvrir ma routine', go: { id: 'help', params: { tab: 'routine' } } });

    return {
      q: q, intent: 'faire',
      titre: d.total ? 'Aujourd’hui : ' + d.total + ' item' + (d.total > 1 ? 's' : '') + ' à revoir' : 'Rien de dû aujourd’hui',
      chapo: 'La bonne question n’est pas « qu’est-ce que je révise » mais « combien de temps ai-je devant moi ». ' +
             'Voici ce que vos données disent, dans l’ordre.',
      blocs: blocs, actions: actions,
      suites: d.parUE[0] ? ['Interroge-moi sur ' + d.parUE[0].code] : ['Que sais-tu faire ?'],
      source: null
    };
  }

  function repInterro(q) {
    var code = ueCitee(q);
    if (!code) {
      /* pas de code d'UE : on cherche le sujet, et l'UE qui le porte */
      var it = meilleur(motsCles(q.replace(/interroge|interroger|teste|questionne|moi|sur/gi, ' ')),
        ['notion', 'qr', 'ue']);
      code = it && it.code ? it.code : null;
    }
    if (!code) {
      var d = duJour();
      code = d.parUE[0] ? d.parUE[0].code : null;
    }
    if (!code) {
      return {
        q: q, intent: 'interro', titre: 'Sur quoi ?',
        chapo: 'Dites-moi l’UE ou le sujet — « interroge-moi sur l’UE 9 », « interroge-moi sur les prismes ».',
        blocs: [], actions: [], suites: ['Interroge-moi sur l’UE 1'], source: null
      };
    }
    var loc = localiser(code);
    var m = UEBank.memory(code);
    return {
      q: q, intent: 'interro', quiz: code,
      titre: 'Cinq questions sur ' + code,
      chapo: loc ? loc.titre + ' — ' + (m.due ? m.due + ' item' + (m.due > 1 ? 's dus' : ' dû') + ' aujourd’hui.'
                                             : 'rien de dû, on reprend le plus fragile.') : '',
      /* La réponse contient déjà l’interrogation : reproposer de la lancer
         ferait démarrer une seconde série dans la même bulle. */
      blocs: [], suites: [],
      actions: actionsUE(code).filter(function (a) { return !a.quiz; }),
      source: { code: code, sem: loc ? loc.sem : '', titre: loc ? loc.titre : code }
    };
  }

  function repDiff(q) {
    var t = deuxTermes(q);
    var mots = motsCles(q);

    /* Le meilleur cas : un tableau de la couche « examen » couvre déjà la
       comparaison. C'est exactement la forme sous laquelle la question tombe. */
    var tab = chercher(t ? t.a.concat(t.b) : mots, { k: ['tableau'], n: 1 })[0];
    if (tab && t) {
      /* Un tableau ne répond à « différence entre A et B » que s'il parle des
         deux. Compter les mots trouvés ne suffit pas : ils peuvent tous venir
         du même côté, et l'on présente alors une comparaison qui ne compare
         pas ce qui a été demandé. */
      var texte = Txt.norm(tab.txt + ' ' + tab.t);
      var couvre = function (mots) {
        return mots.some(function (m) { return texte.indexOf(m) >= 0; });
      };
      if (!couvre(t.a) || !couvre(t.b)) tab = null;
    }
    if (tab) {
      return {
        q: q, intent: 'diff', titre: tab.t,
        chapo: 'La comparaison est déjà faite dans la couche « examen » de ' + tab.code + ' — c’est sous cette forme qu’elle tombe.',
        blocs: [{ k: 'tab', tab: tab.tab }],
        actions: actionsUE(tab.code), suites: suitesPour(tab), source: source(tab)
      };
    }

    /* Sinon on met les deux définitions côte à côte : deux entrées du
       glossaire, ou deux parties de cours. Rien n'est inventé — c'est le
       rapprochement qui fait la réponse. */
    if (t) {
      var a = meilleur(t.a, ['terme', 'notion', 'qr']);
      var b = meilleur(t.b, ['terme', 'notion', 'qr']);
      if (a && b && a !== b) {
        return {
          q: q, intent: 'diff', titre: a.t + ' / ' + b.t,
          chapo: 'Aucun tableau tout fait sur ce couple : voici les deux, l’une en face de l’autre.',
          blocs: [{
            k: 'face', gauche: { t: a.t, html: a.def || a.cle || a.rep || plain(a.html) || a.txt, meta: etiquette(a) },
            droite: { t: b.t, html: b.def || b.cle || b.rep || plain(b.html) || b.txt, meta: etiquette(b) }
          }],
          actions: (a.code ? actionsUE(a.code) : []).concat(b.code && b.code !== a.code
            ? [{ ic: '🎓', label: 'Ouvrir la fiche ' + b.code, go: { id: 'studies', params: { sem: b.sem, ue: b.code } } }] : []),
          suites: ['C’est quoi ' + a.t + ' ?', 'C’est quoi ' + b.t + ' ?'],
          source: source(a) || source(b)
        };
      }
    }
    return null;   // on laissera la recherche générale répondre
  }

  function repSchema(q) {
    var mots = motsCles(q);
    var s = chercher(mots, { k: ['schema'], n: 1 })[0];
    if (!s) {
      /* le schéma n'est pas trouvé par sa légende : peut-être par la partie
         de cours qui le porte */
      var n = chercher(mots, { k: ['notion'], n: 4 }).filter(function (x) { return x.fig; })[0];
      if (n) {
        return {
          q: q, intent: 'schema', titre: UEFigs.legende(n.fig),
          chapo: 'Le schéma de « ' + n.t +' », en ' + n.code + '.',
          blocs: [{ k: 'fig', fig: n.fig }].concat(n.cle ? [{ k: 'cle', html: n.cle }] : []),
          actions: actionsUE(n.code), suites: suitesPour(n), source: source(n)
        };
      }
      return null;
    }
    /* de quelle partie de cours ce schéma vient-il ? */
    var porteur = corpus().filter(function (x) { return x.k === 'notion' && x.fig === s.fig; })[0];
    return {
      q: q, intent: 'schema', titre: s.t,
      chapo: porteur ? 'Il illustre « ' + porteur.t + ' », en ' + porteur.code + '.' : '',
      blocs: [{ k: 'fig', fig: s.fig }].concat(porteur && porteur.cle ? [{ k: 'cle', html: porteur.cle }] : []),
      actions: porteur ? actionsUE(porteur.code) : [],
      suites: porteur ? suitesPour(porteur) : [],
      source: porteur ? source(porteur) : null
    };
  }

  function repOu(q) {
    var code = ueCitee(q);
    var it = null;
    if (!code) {
      /* La question porte sur le programme : seule une entree rattachee a une
         UE peut y repondre. Une definition de glossaire, elle, ne sait pas ou
         elle se travaille. */
      it = meilleur(motsCles(q), ['notion', 'qr', 'ue'],
        { k: ['notion', 'qr', 'ue', 'tableau', 'chiffre', 'retenir'] });
      code = it && it.code ? it.code : null;
    }
    /* Rien de rattaché à une UE : peut-être un mot du glossaire, qui sait
       malgré tout où il est au programme. */
    if (!code) {
      var mot = meilleur(motsCles(q), ['terme'], { k: ['terme'] });
      var chez2 = mot ? ueDuMot(mot.t) : [];
      if (chez2.length) { code = chez2[0]; it = mot; }
    }
    if (!code) return null;

    var loc = localiser(code);
    var m = UEBank.memory(code);
    var u = loc.ue;
    /* pas de ligne « Unité » : le titre de la réponse la porte déjà */
    var rows = [
      ['Semestre', loc.sem],
      ['Volume', u.h + ' h (' + u.cm + ' CM / ' + u.td + ' TD' + (u.tp ? ' / ' + u.tp + ' TP' : '') + ')'],
      ['Crédits', u.ects + ' ECTS'],
      ['Votre maîtrise', m.pct + ' %' + (m.due ? ' · ' + m.due + ' item' + (m.due > 1 ? 's' : '') + ' à revoir' : '')]
    ];

    var blocs = [{ k: 'kv', rows: rows }];

    /* Le prochain cours qui traite cette UE : c'est ce qui rend la réponse
       actionnable — réviser la veille coûte quatre minutes. */
    var seance = null;
    if (window.Modules.edt && Modules.edt.coursAVenir) {
      var ev = (Modules.edt.coursAVenir(240) || []).filter(function (e) { return e.ue === code; })[0];
      if (ev) seance = Modules.edt.seance(ev);
    }
    if (seance) {
      blocs.push({
        k: 'note',
        html: 'Prochain cours dessus : <b>' + seance.jour.nom.toLowerCase() + '</b> (' + seance.jour.quand + '), ' +
              seance.event.s + ' – ' + seance.event.e +
              (seance.event.salle ? ' · ' + seance.event.salle : '') + '.'
      });
    }
    if (it && it.k === 'notion') {
      blocs.push({ k: 'note', html: 'Précisément : partie « <b>' + it.t + '</b> » du plan de ' + code + '.' });
    } else if (it && it.k === 'terme') {
      var toutes = ueDuMot(it.t);
      blocs.push({ k: 'note',
        html: '« <b>' + it.t + '</b> » est au vocabulaire de ' +
          (toutes.length > 1 ? toutes.join(', ') : code) + '.' });
    }

    return {
      q: q, intent: 'ou', titre: code + ' — ' + loc.titre,
      chapo: it && it.t !== (code + ' — ' + loc.titre) ? '« ' + it.t + ' » se travaille en ' + code + ', au ' + loc.sem + '.' : '',
      blocs: blocs, actions: actionsUE(code),
      suites: ['Qu’est-ce qui tombe en ' + code + ' ?', 'Interroge-moi sur ' + code],
      source: { code: code, sem: loc.sem, titre: loc.titre }
    };
  }

  function repPlan(q) {
    var code = ueCitee(q);
    var mots = motsCles(q);
    var pl = code
      ? corpus().filter(function (x) { return x.k === 'plan' && x.code === code; })[0]
      : chercher(mots, { k: ['plan'], n: 1 })[0];
    if (!pl && code) {
      /* pas de plan type pour cette UE : on répond avec « ce qui tombe » */
      var f = (window.UE_GUIDE || {})[code];
      if (f && f.tombe) {
        var l = localiser(code);
        return {
          q: q, intent: 'plan', titre: 'Ce qui tombe en ' + code,
          chapo: l ? l.titre : '',
          blocs: [{ k: 'liste', items: f.tombe }],
          actions: actionsUE(code), suites: ['Interroge-moi sur ' + code],
          source: { code: code, sem: l ? l.sem : '', titre: l ? l.titre : code }
        };
      }
    }
    if (!pl) return null;
    var f2 = (window.UE_GUIDE || {})[pl.code] || {};
    return {
      q: q, intent: 'plan', titre: pl.t,
      chapo: 'La question classique de ' + pl.code + '. Savoir quoi dire ne suffit pas : voici dans quel ordre le dire.',
      blocs: [{ k: 'liste', ord: true, items: pl.rep.p }]
        .concat(f2.tombe ? [{ k: 'liste', titre: 'Les autres formes fréquentes', items: f2.tombe }] : []),
      actions: actionsUE(pl.code), suites: ['Interroge-moi sur ' + pl.code], source: source(pl)
    };
  }

  function repPiege(q) {
    var code = ueCitee(q);
    var mots = motsCles(q);
    var liste = code
      ? corpus().filter(function (x) { return x.k === 'piege' && x.code === code; })
      : chercher(mots, { k: ['piege'], n: 3 });

    /* Les erreurs attachées à une partie de cours précise sont plus fines que
       les pièges généraux de l'UE : on les cherche aussi. */
    var fines = chercher(mots, { k: ['notion'], n: 3 }).filter(function (x) { return x.err; });
    if (!liste.length && !fines.length) return null;

    var c = code || (liste[0] && liste[0].code) || (fines[0] && fines[0].code);
    var l = c ? localiser(c) : null;
    var blocs = [];
    if (liste.length) blocs.push({ k: 'liste', titre: c ? 'Les pièges de ' + c : 'Les pièges', items: liste.map(function (x) { return x.html || x.t; }) });
    fines.forEach(function (x) {
      blocs.push({ k: 'err', titre: 'Sur « ' + x.t + ' »', html: x.err });
    });

    return {
      q: q, intent: 'piege', titre: c ? 'Ce qui coûte des points en ' + c : 'Les erreurs classiques',
      chapo: l ? l.titre : '',
      blocs: blocs, actions: c ? actionsUE(c) : [],
      suites: c ? ['Interroge-moi sur ' + c, 'Qu’est-ce qui tombe en ' + c + ' ?'] : [],
      source: c ? { code: c, sem: l ? l.sem : '', titre: l ? l.titre : c } : null
    };
  }

  function repChiffre(q) {
    var mots = motsCles(q);
    var ch = chercher(mots, { k: ['chiffre'], n: 5 });
    var terme = chercher(mots, { k: ['terme'], n: 2 }).filter(function (t) { return t.norme; })[0];
    if (!ch.length && !terme) return null;
    var blocs = [];
    if (ch.length) blocs.push({ k: 'kv', rows: ch.map(function (x) { return [x.t, x.val]; }) });
    if (terme) blocs.push({ k: 'kv', titre: terme.t, rows: [['Valeur de référence', terme.norme]] });
    var c = ch.length ? ch[0].code : null;
    return {
      q: q, intent: 'chiffre', titre: 'Les valeurs à connaître',
      chapo: c ? 'Tirées de la fiche ' + c + '.' : 'Tirées du glossaire.',
      blocs: blocs, actions: c ? actionsUE(c) : [],
      suites: c ? ['Interroge-moi sur ' + c] : [], source: c ? source(ch[0]) : null
    };
  }

  function repCas(q) {
    var code = ueCitee(q);
    var cas = code
      ? corpus().filter(function (x) { return x.k === 'cas' && x.code === code; })[0]
      : chercher(motsCles(q), { k: ['cas'], n: 1 })[0];
    if (!cas) return null;
    var l = localiser(cas.code);
    return {
      q: q, intent: 'cas', titre: cas.cas.t,
      chapo: 'Un cas d’application de ' + cas.code + '. Lisez l’énoncé et répondez avant de dérouler.',
      blocs: [
        { k: 'p', html: cas.cas.s },
        { k: 'liste', titre: 'Questions posées', ord: true, items: cas.cas.q },
        { k: 'repli', titre: 'Le raisonnement attendu', html: cas.cas.r + (cas.cas.c ? '<p>' + cas.cas.c + '</p>' : '') }
      ],
      actions: actionsUE(cas.code),
      suites: ['Qu’est-ce qui tombe en ' + cas.code + ' ?'],
      source: { code: cas.code, sem: l ? l.sem : '', titre: l ? l.titre : cas.code }
    };
  }

  /* Définition et explication partagent la même mécanique et ne diffèrent que
     par l'ordre de préférence : une définition va au glossaire, une explication
     va au cours — parce que c'est là que vivent l'analogie et l'exemple. */
  function repNotion(q, intent) {
    var mots = motsCles(q);
    if (!mots.length) return null;
    var ordre = intent === 'defi' ? ['terme', 'qr', 'notion'] : ['qr', 'notion', 'terme'];
    var dans = ueCitee(q);
    var it = meilleur(mots, ordre, dans ? { code: dans } : null);
    if (!it) return null;

    var blocs = [], chapo = '', titre = it.t;

    if (it.k === 'qr') {
      /* la question était déjà écrite quelque part : la réponse tient en une
         phrase, et le cours vient derrière pour l'étayer */
      chapo = it.rep;
      /* Une question d'auto-interrogation appartient à une UE : le cours qui
         l'étaye est dans la même, jamais ailleurs. */
      var fond = chercher(mots, { k: ['notion'], dans: [it.code], n: 1 })[0];
      if (!pertinent(fond, mots)) fond = null;
      if (fond) blocs = blocsNotion(fond, true);
      titre = it.t.replace(/\s*\?\s*$/, '');
      return {
        q: q, intent: intent, titre: titre, chapo: chapo, blocs: blocs,
        actions: actionsUE(it.code), suites: suitesPour(it), source: source(fond || it)
      };
    }

    if (it.k === 'terme') {
      blocs = blocsTerme(it);
      /* on complète par le cours quand une partie parle du même sujet : la
         définition dit ce que c'est, le cours dit pourquoi ça marche */
      /* Le cours qui traite ce mot — cherché dans les UE qui le déclarent, et
         sur le nom du terme, jamais sur les mots de la question. Sans UE
         déclarée, on s'en tient à la définition : mieux vaut une réponse
         courte et juste qu'un paragraphe de cours pris au hasard. */
      var chez = ueDuMot(it.t);
      var n = chez.length
        ? chercher(titreNu(it.t).split(' '), { k: ['notion'], dans: chez, n: 1 })[0]
        : null;
      if (n) blocs = blocs.concat([{ k: 'sep', titre: 'Dans le cours' }], blocsNotion(n, true));
      if (it.voir && it.voir.length) blocs.push({ k: 'voir', items: it.voir.slice(0, 5) });
      return {
        q: q, intent: intent, titre: it.t,
        chapo: it.cat ? it.cat : '',
        blocs: blocs,
        actions: n ? actionsUE(n.code) : (chez.length ? actionsUE(chez[0]) : []),
        suites: suitesPour(it), source: n ? source(n) : source(it)
      };
    }

    /* une partie de cours : la forme complète, celle qui débloque */
    blocs = blocsNotion(it, false);
    var t2 = chercher(mots, { k: ['terme'], n: 1 })[0];
    if (t2 && Txt.norm(t2.t).length > 3 && mots.indexOf(racine(Txt.norm(t2.t).split(' ')[0])) >= 0) {
      blocs.push({ k: 'sep', titre: 'Le mot, au glossaire' });
      blocs.push({ k: 'p', html: '<b>' + t2.t + '</b> — ' + t2.def });
    }
    return {
      q: q, intent: intent, titre: it.t,
      chapo: it.code ? 'Partie du cours de ' + it.code + '.' : '',
      blocs: blocs, actions: actionsUE(it.code), suites: suitesPour(it), source: source(it)
    };
  }

  function repCherche(q) {
    var mots = motsCles(q);
    if (!mots.length) return null;
    /* d'abord la réponse la plus directe possible */
    var direct = repNotion(q, 'cherche');
    if (direct) return direct;
    var hits = chercher(mots, { n: 5, code: ueCitee(q) || null });
    if (!hits.length) return null;
    return {
      q: q, intent: 'cherche', titre: 'Ce que j’ai trouvé',
      chapo: 'Rien qui réponde franchement, mais ces passages parlent de ça.',
      blocs: [{ k: 'liste', items: hits.map(function (h) { return '<b>' + etiquette(h) + '</b> — ' + h.t; }) }],
      actions: [{ ic: '🔎', label: 'Chercher dans tout le contenu', recherche: q }],
      suites: hits.slice(0, 3).map(function (h) { return h.t; }),
      source: source(hits[0])
    };
  }

  /* ------------------------------------------------------------
     repondre — le point d'entrée
     ------------------------------------------------------------
     Rend toujours un objet, jamais null :

       q       la question telle qu'elle a été posée
       intent  l'intention reconnue
       titre   le titre de la réponse
       chapo   la réponse directe, en une ou deux phrases (HTML)
       blocs   le développement — voir les `k` ci-dessous
       actions boutons : {go}, {quiz}, {recherche}
       suites  questions proposées pour enchaîner
       source  d'où vient la réponse : {code, sem, titre}
       quiz    code d'UE quand la réponse EST une interrogation
       vide    true quand rien n'a été trouvé

     Blocs : p (paragraphe) · cle (la phrase à retenir) · img (l'image
     qui reste) · ex (devant un patient) · err (l'erreur classique) ·
     fig (un schéma) · tab (un tableau) · kv (des couples) · liste ·
     face (deux colonnes) · note · sep (séparateur titré) · voir
     (renvois du glossaire) · repli (contenu masqué) · calc.
     ------------------------------------------------------------ */
  function repondre(q) {
    q = String(q || '').trim();
    if (!q) return null;

    /* Un calcul se reconnaît à sa forme, pas à une intention : « 5/10 »,
       « 12 delta », « prentice 4 3 » n'ont pas de verbe. On teste d'abord. */
    var calc = null;
    try {
      var M = window.Modules;
      var qc = M.converters && M.converters.quickCalc;
      var brut = q.replace(/\s*\?\s*$/, '').trim();
      /* Un code d'UE se termine par un chiffre : sans ce garde-fou, « un cas
         clinique sur UE1 » devient une conversion d'acuité. */
      if (qc && !/\bue\s*\d/i.test(brut)) {
        calc = qc(brut);
        /* On écrit à un répétiteur ce qu'on ne tape pas dans un champ de
           recherche : on nomme le calcul demandé avant d'en donner les
           chiffres. Seuls les noms de calculs connus sont retirés — retirer
           « tout ce qui précède le premier chiffre » ferait d'une phrase
           entière un calcul. */
        if (!calc) {
          var sansNom = brut.replace(NOM_CALCUL, '').trim();
          if (sansNom && sansNom !== brut) calc = qc(sansNom);
        }
      }
    } catch (e) { calc = null; }
    if (calc) {
      return {
        q: q, intent: 'calcul', titre: calc.title,
        chapo: 'Calculé par la même machinerie que les calculatrices — la formule est sous le résultat.',
        blocs: [{ k: 'calc', calc: calc }],
        actions: [{ ic: '🧮', label: 'Ouvrir la calculatrice', go: { id: 'converters', params: { calc: calc.calc } } }],
        suites: [], source: null
      };
    }

    var intent = intention(q);
    var r = null;

    if (intent === 'aide') r = repAide(q);
    else if (intent === 'bonjour') r = repBonjour(q);
    else if (intent === 'merci') r = repMerci(q);
    else if (intent === 'faire') r = repFaire(q);
    else if (intent === 'interro') r = repInterro(q);
    else if (intent === 'diff') r = repDiff(q);
    else if (intent === 'schema') r = repSchema(q);
    else if (intent === 'ou') r = repOu(q);
    else if (intent === 'plan') r = repPlan(q);
    else if (intent === 'piege') r = repPiege(q);
    else if (intent === 'chiffre') r = repChiffre(q);
    else if (intent === 'cas') r = repCas(q);
    else if (intent === 'defi' || intent === 'expl') r = repNotion(q, intent);

    /* Une intention reconnue mais sans matière : plutôt que d'échouer, on
       retombe sur la recherche générale — la question portait peut-être sur
       un sujet que l'application traite ailleurs. */
    if (!r) r = repCherche(q);
    if (!r) r = vide(q, motsCles(q));

    /* Un code d'UE cité, une réponse qui n'en parle pas : on ajoute le lien. */
    var code = ueCitee(q);
    if (code && !r.vide && (!r.source || r.source.code !== code)) {
      var deja = (r.actions || []).some(function (a) { return a.quiz === code; });
      if (!deja) r.actions = (r.actions || []).concat(actionsUE(code));
    }
    return r;
  }

  /* ------------------------------------------------------------
     Ce qu'on donne à lire à un modèle local
     ------------------------------------------------------------
     Un petit modèle laissé libre invente : interrogé à froid sur la
     transparence cornéenne, qwen3.5:4b répond « cellules
     kératinocytaires » et « trois plans perpendiculaires » — deux
     choses fausses, dites avec aplomb. Nourri des extraits ci-dessous,
     le même modèle répond juste, et sans rien ajouter.

     C'est toute la différence entre demander à une machine ce qu'elle
     sait et lui demander de redire autrement ce qu'on lui montre. Le
     répétiteur ne délègue donc jamais la connaissance : il délègue la
     reformulation, et fournit lui-même la matière.

     On plafonne la longueur : au-delà, le temps de lecture du contexte
     s'ajoute à celui de la rédaction, pour un gain nul.
     ------------------------------------------------------------ */
  var CTX_MAX = 4200;

  function contexte(q, r) {
    var out = [], vus = {}, taille = 0;

    function pousser(titre, texte) {
      texte = plain(texte);
      if (!texte || vus[texte] || taille > CTX_MAX) return;
      vus[texte] = 1;
      var bloc = (titre ? '[' + titre + ']\n' : '') + texte;
      taille += bloc.length;
      out.push(bloc);
    }

    if (r) {
      var s = r.source;
      var ou = s ? (s.code ? s.code + ' · ' + s.titre : s.libelle) : '';
      pousser(r.titre + (ou ? ' — ' + ou : ''), r.chapo);

      (r.blocs || []).forEach(function (b) {
        if (b.k === 'corr') pousser('CORRECTION DE L’ÉTUDIANT — elle prime sur le reste', b.html);
        else if (b.k === 'cle') pousser('La phrase à retenir', b.html);
        else if (b.k === 'img') pousser('L’image du cours', b.html);
        else if (b.k === 'ex') pousser('En consultation', b.html);
        else if (b.k === 'err') pousser('L’erreur classique', b.html);
        else if (b.k === 'p' || b.k === 'note') pousser(null, b.html);
        else if (b.k === 'kv') {
          pousser(b.titre || null, b.rows.map(function (x) { return x[0] + ' : ' + x[1]; }).join(' · '));
        } else if (b.k === 'liste') {
          pousser(b.titre || null, b.items.map(plain).join(' · '));
        } else if (b.k === 'tab') {
          pousser(b.tab.t, b.tab.c.join(' | ') + '\n' +
            b.tab.r.map(function (l) { return l.join(' | '); }).join('\n'));
        } else if (b.k === 'face') {
          pousser(b.gauche.t, b.gauche.html);
          pousser(b.droite.t, b.droite.html);
        } else if (b.k === 'fig') {
          pousser(null, 'Un schéma accompagne ce point : ' + (window.UEFigs ? UEFigs.legende(b.fig) : b.fig));
        }
      });
    }

    /* De la matière autour : les meilleures autres entrées du corpus sur les
       mêmes mots. C'est ce qui permet au modèle de relier, plutôt que de
       paraphraser un seul paragraphe. */
    chercher(motsCles(q), { n: 5 }).forEach(function (it) {
      pousser(etiquette(it) + ' · ' + it.t,
        [it.cle, it.rep, it.def, it.img, it.err].filter(Boolean).join(' ') || it.txt);
    });

    return out.join('\n\n');
  }

  window.Repet = {
    repondre: repondre,
    contexte: contexte,
    intention: intention,
    motsCles: motsCles,
    chercher: function (q, opts) { return chercher(motsCles(q), opts); },
    corpus: corpus,
    etiquette: etiquette,
    /* le corpus est bâti une fois ; les données ne bougent pas en cours de
       session, mais les tests ont besoin de le reconstruire */
    oublier: function () { IDX = null; }
  };
})();
