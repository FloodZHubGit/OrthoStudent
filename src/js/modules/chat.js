/* ============================================================
   Le répétiteur — l'écran
   ------------------------------------------------------------
   `core/repet.js` sait répondre ; ce module dessine la
   conversation. Trois partis pris, qui expliquent la forme :

   1. Ce n'est pas une recherche. La recherche rapide rend une
      liste de liens et laisse l'étudiant faire le tri ; ici on
      rend une réponse — l'analogie, la phrase-clé, le schéma,
      l'erreur classique — et de quoi enchaîner.

   2. Tout est sourcé. Sous chaque réponse, l'UE et la partie
      d'où elle sort, cliquables. Une réponse sans provenance,
      sur du contenu qu'on révise pour un partiel, ne vaut rien.

   3. Le fil n'est pas stocké, les questions le sont. Rejouer
      une question donne la même réponse — les données ne
      bougent pas. On garde donc seulement ce qui a été demandé,
      ce qui tient en quelques centaines d'octets au lieu de
      plusieurs mégaoctets d'HTML figé.

   L'interrogation lancée depuis le fil (« interroge-moi sur
   l'UE 9 ») compte pour de vrai : mêmes identifiants, mêmes
   boîtes, même journal que la récitation de la fiche. Un outil
   qui ferait réviser sans que ça compte apprendrait à
   l'étudiant que ses efforts ne sont pas suivis.
   ============================================================ */
(function () {
  'use strict';
  var M = (window.Modules = window.Modules || {});
  var el = UI.el;

  var MAX_FIL = 40;          // au-delà, on oublie les plus vieilles questions

  /* ------------------------------------------------------------
     Le fil : la liste des questions posées, rien de plus
     ------------------------------------------------------------ */

  function fil() {
    var f = Store.setting('chat');
    return (f && Array.isArray(f.q)) ? f.q : [];
  }

  function poser(q) {
    var f = fil().concat([q]);
    if (f.length > MAX_FIL) f = f.slice(f.length - MAX_FIL);
    Store.setting('chat', { q: f });
  }

  function effacer() { Store.setting('chat', { q: [] }); }

  /* ------------------------------------------------------------
     Rendre un bloc de réponse
     ------------------------------------------------------------
     Le vocabulaire est fixé par repet.js ; chaque `k` a ici sa
     traduction visuelle et une seule.
     ------------------------------------------------------------ */

  var ENCARTS = {
    corr: { ic: '✏️', t: 'Votre correction — elle prime sur la fiche' },
    cle: { ic: '🔑', t: 'La phrase à retenir' },
    img: { ic: '💡', t: 'L’image qui reste' },
    ex: { ic: '🩺', t: 'En consultation' },
    err: { ic: '⚠️', t: 'L’erreur classique' }
  };

  function bloc(b, poserQ) {
    if (ENCARTS[b.k]) {
      var e = ENCARTS[b.k];
      return el('div', { class: 'ch-encart ' + b.k }, [
        el('div', { class: 'ch-encart-t' }, [
          el('span', { class: 'ic', text: e.ic }),
          el('span', { text: b.titre || e.t })
        ]),
        el('div', { html: b.html })
      ]);
    }

    switch (b.k) {
      case 'p':
        return el('div', { class: 'ch-p', html: b.html });

      case 'note':
        return UI.note(b.html);

      case 'sep':
        return el('div', { class: 'ch-sep' }, [el('span', { text: b.titre })]);

      case 'fig':
        return window.UEFigs ? UEFigs.bloc(b.fig) : null;

      case 'tab':
        return el('div', {}, [
          b.tab.t ? el('div', { class: 'ch-sous', text: b.tab.t }) : null,
          UI.table(b.tab.c, b.tab.r)
        ].filter(Boolean));

      case 'kv':
        return el('div', {}, [
          b.titre ? el('div', { class: 'ch-sous', text: b.titre }) : null,
          el('div', {}, b.rows.map(function (r) { return UI.kv(r[0], r[1]); }))
        ].filter(Boolean));

      case 'liste':
        return el('div', {}, [
          b.titre ? el('div', { class: 'ch-sous', text: b.titre }) : null,
          el(b.ord ? 'ol' : 'ul', { class: 'ch-liste' },
            b.items.map(function (i) { return el('li', { html: i }); }))
        ].filter(Boolean));

      case 'face':
        return el('div', { class: 'ch-face' }, [b.gauche, b.droite].map(function (c) {
          return el('div', { class: 'ch-face-col' }, [
            el('div', { class: 'ch-face-m', text: c.meta || '' }),
            el('div', { class: 'ch-face-t', text: c.t }),
            el('div', { html: c.html })
          ]);
        }));

      case 'voir':
        return el('div', { class: 'ch-voir' }, [
          el('span', { class: 'ch-voir-l', text: 'Voir aussi' })
        ].concat(b.items.map(function (v) {
          return el('button', {
            class: 'ch-puce', text: v,
            onClick: function () { poserQ('C’est quoi ' + v + ' ?'); }
          });
        })));

      case 'repli':
        var corps = el('div', { class: 'ch-repli-c', html: b.html, style: { display: 'none' } });
        var bt = UI.btn('▸  ' + b.titre, function () {
          var ouvert = corps.style.display !== 'none';
          corps.style.display = ouvert ? 'none' : '';
          bt.textContent = (ouvert ? '▸  ' : '▾  ') + b.titre;
        }, 'sm');
        return el('div', { class: 'ch-repli' }, [bt, corps]);

      case 'calc':
        return calcul(b.calc);
    }
    return null;
  }

  /* Le résultat d'un calcul, dans le même esprit que les calculatrices :
     la valeur d'abord, la formule ensuite — jamais l'inverse. */
  function calcul(c) {
    return el('div', {}, [
      el('div', {}, c.rows.map(function (r) { return UI.kv(r[0], r[1]); })),
      c.steps && c.steps.length
        ? el('div', { class: 'ch-formule' }, c.steps.map(function (s) {
            return el('div', {}, [
              el('span', { class: 'ch-formule-l', text: s[0] }),
              el('span', { class: 'mono', text: s[1] })
            ]);
          }))
        : null
    ].filter(Boolean));
  }

  /* ------------------------------------------------------------
     L'interrogation dans le fil
     ------------------------------------------------------------
     Cinq questions, tirées de la même banque et notées dans les
     mêmes boîtes que la récitation d'une fiche. On ne recopie pas
     le mode « réciter » : ici on veut trois clics, pas un écran.
     ------------------------------------------------------------ */

  function interro(code, hote) {
    /* La zone est créée une fois et réutilisée : « Cinq de plus » redémarre
       dedans. La retirer pour en rajouter une aurait replacé la série après
       la ligne de provenance, tout en bas de la bulle. */
    var zone = el('div', { class: 'ch-quiz' });
    hote.appendChild(zone);
    serie();

    function serie() {
      var file = UEBank.queue(code, { limit: 5 });
      var i = 0, bons = 0;

      if (!file.length) {
        UI.clear(zone);
        zone.appendChild(el('div', { class: 'ch-quiz-fin', text: 'Aucun item interrogeable sur ' + code + '.' }));
        return;
      }

      function noter(q) {
        Store.reviewCard(file[i].id, q);
        if (q === 2) bons++;
        i++;
        etape();
      }

      function etape() {
        UI.clear(zone);

        if (i >= file.length) {
          Store.logActivity('chat:interro', null, { code: code, n: file.length, ok: bons });
          zone.appendChild(el('div', { class: 'ch-quiz-fin' }, [
            el('b', { text: bons + ' / ' + file.length + ' su' }),
            el('span', { class: 'muted', text: ' — compté dans vos boîtes, comme une récitation.' })
          ]));
          zone.appendChild(el('div', { class: 'btn-row' }, [
            UI.btn('Cinq de plus', serie, 'sm'),
            UI.btn('Ouvrir la fiche ' + code, function () {
              var l = UEBank.locate(code);
              if (l) App.go('studies', { sem: l.sem.id, ue: code });
            }, 'sm')
          ]));
          return;
        }

        var it = file[i];
        var rep = el('div', { class: 'ch-quiz-r', html: it.a, style: { display: 'none' } });
        var boutons = el('div', { class: 'btn-row' });

        zone.appendChild(el('div', { class: 'ch-quiz-n', text: (i + 1) + ' / ' + file.length }));
        zone.appendChild(el('div', { class: 'ch-quiz-q', html: it.q }));
        zone.appendChild(rep);
        zone.appendChild(boutons);

        /* On répond d'abord dans sa tête, on note ensuite : les trois notes
           n'apparaissent qu'une fois la réponse découverte. */
        boutons.appendChild(UI.btn('Voir la réponse', function () {
          rep.style.display = '';
          UI.clear(boutons);
          [['Oublié', 0], ['Presque', 1], ['Su', 2]].forEach(function (n) {
            boutons.appendChild(UI.btn(n[0], function () { noter(n[1]); }, n[1] === 2 ? 'sm primary' : 'sm'));
          });
        }, 'sm primary'));
      }

      etape();
    }
  }

  /* ------------------------------------------------------------
     L'IA locale, en option
     ------------------------------------------------------------
     Le répétiteur répond d'abord, toujours, instantanément. Le
     modèle local vient ensuite, sur demande, et ne fait qu'une
     chose : redire autrement ce que le répétiteur a trouvé.

     L'ordre n'est pas cosmétique. La réponse sûre est celle qui
     s'affiche en premier et sans attendre ; celle du modèle
     arrive après, dans un cadre à elle, signalée comme telle.
     Inverser les deux ferait de l'approximation la réponse
     principale et de la certitude une note de bas de page.
     ------------------------------------------------------------ */

  var IA_ETAT = null;      /* l'état d'Ollama, résolu une fois par session */
  var defiler = function () {};   /* relais vers le défilement du fil, posé par render() */


  /* Le texte du modèle n'est JAMAIS injecté comme HTML : c'est du texte
     produit par une machine, il va dans un nœud texte. */
  function couler(dans, texte) {
    dans.textContent = texte;
  }

  function lancerIA(r, zone, mode) {
    UI.clear(zone);
    var ctx = r.vide ? '' : Repet.contexte(r.q, r);
    var horsCorpus = !ctx;

    var corpsIA = el('div', { class: 'ch-ia-c', text: '' });
    var etat = el('span', { class: 'ch-ia-etat', text: 'le modèle démarre…' });
    var reg = IA.reglages();

    var bloc = el('div', { class: 'ch-ia' + (horsCorpus ? ' libre' : '') }, [
      el('div', { class: 'ch-ia-t' }, [
        el('span', { class: 'ic', text: '✨' }),
        el('span', { text: horsCorpus
          ? 'Hors des fiches — réponse du modèle seul'
          : 'Développé par le modèle local, à partir des extraits ci-dessus' }),
        el('span', { class: 'spacer' }),
        etat
      ]),
      corpsIA
    ]);
    zone.appendChild(bloc);

    if (horsCorpus) {
      bloc.insertBefore(UI.note('Rien dans vos fiches ne couvre cette question : ce qui suit ne ' +
        'vient <b>pas</b> du contenu vérifié de l’application. À recouper avant de le réviser.', 'warn'),
        corpsIA);
    }

    var pied = el('div', { class: 'btn-row ch-ia-p' });
    bloc.appendChild(pied);
    var stopper = UI.btn('Arrêter', function () { IA.stop(); }, 'sm');
    pied.appendChild(stopper);

    var brut = '', debut = Date.now();

    /* Le premier mot peut mettre une minute à venir : au premier appel, le
       modèle doit d'abord être chargé en mémoire. Un écran qui ne bouge pas
       pendant ce temps-là se lit comme un plantage — d'où le compteur. */
    var tic = setInterval(function () {
      var s = Math.round((Date.now() - debut) / 1000);
      etat.textContent = (brut ? 'écrit… ' : 'le modèle démarre… ') + s + ' s';
    }, 1000);

    IA.demander({
      question: r.q, ctx: ctx, mode: mode,
      onMot: function (m) {
        brut += m;
        couler(corpsIA, brut);
        defiler();
      }
    }).then(function (res) {
      clearInterval(tic);
      var s = Math.round((Date.now() - debut) / 1000);
      UI.clear(pied);

      if (!res.ok && !brut) {
        etat.textContent = '';
        couler(corpsIA, '');
        bloc.appendChild(UI.note('Le modèle n’a pas répondu : ' + (res.erreur || 'erreur inconnue') +
          '. La réponse du répétiteur, elle, reste valable.', 'warn'));
      } else {
        etat.textContent = reg.modele + ' · ' + s + ' s';
        couler(corpsIA, (brut || res.texte || '').trim());
      }

      /* Une reformulation ratée se rejoue ; une réussie mérite qu'on puisse
         demander une image plutôt qu'une explication. */
      pied.appendChild(UI.btn('↻  Refaire', function () { lancerIA(r, zone, mode); }, 'sm'));
      if (mode !== 'autrement' && !horsCorpus) {
        pied.appendChild(UI.btn('💡  Une comparaison', function () { lancerIA(r, zone, 'autrement'); }, 'sm'));
      }
      defiler();
    });
  }

  /* Les réponses qu'il y a un sens à faire développer. Une interrogation, un
     calcul, « je fais quoi aujourd'hui » ne sont pas des explications : ce sont
     des actions ou un état. Y proposer trente secondes de reformulation, c'est
     proposer trente secondes perdues. */
  var IA_UTILE = { expl: 1, defi: 1, diff: 1, schema: 1, piege: 1, plan: 1,
                   chiffre: 1, cas: 1, cherche: 1, vide: 1 };

  /* Le bouton posé sous chaque réponse quand l'option est active. */
  function offreIA(r, corps) {
    if (!IA.possible() || !IA.reglages().actif) return null;
    if (!IA_UTILE[r.intent] && !r.vide) return null;
    var zone = el('div', { class: 'ch-ia-zone' });
    var lancer = el('div', { class: 'btn-row' }, [
      UI.btn(r.vide ? '✨  Demander quand même au modèle' : '✨  Développer avec l’IA', function () {
        lancerIA(r, zone, 'developper');
      }, 'sm')
    ]);
    zone.appendChild(lancer);
    if (IA.reglages().auto) setTimeout(function () { lancerIA(r, zone, 'developper'); }, 0);
    return zone;
  }

  /* ------------------------------------------------------------
     La barre de réglages, en tête du fil
     ------------------------------------------------------------
     Elle ne s'affiche que dans l'application installée : hors Electron,
     il n'y a pas de pont vers Ollama, et une option qu'on ne peut pas
     activer vaut mieux ne pas être montrée.
     ------------------------------------------------------------ */

  function barreIA(redessiner) {
    var ligne = el('div', { class: 'ch-ia-barre' });
    if (!IA.possible()) return ligne;

    function peindre(e) {
      UI.clear(ligne);
      var reg = IA.reglages();

      if (!e.dispo) {
        ligne.appendChild(el('span', { class: 'ch-ia-off', html:
          '✨ <b>IA locale</b> — non détectée. Le répétiteur fonctionne sans elle.' }));
        ligne.appendChild(el('span', { class: 'spacer' }));
        ligne.appendChild(UI.btn('Réessayer', function () {
          IA_ETAT = null;
          IA.etat(true).then(peindre);
        }, 'sm'));
        return;
      }

      var m = IA.modeleCourant(e);
      var bouton = UI.btn((reg.actif ? '✨  IA locale activée' : '✨  Activer l’IA locale'),
        function () { IA.regler('actif', !reg.actif); peindre(e); redessiner(); },
        reg.actif ? 'sm primary' : 'sm');
      ligne.appendChild(bouton);

      if (!reg.actif) {
        ligne.appendChild(el('span', { class: 'ch-ia-off', html:
          'Le modèle <b>' + (m ? m.nom : '?') + '</b> tourne sur cette machine. Il ne remplace pas le ' +
          'répétiteur : il redit ses réponses autrement, plus longuement.' }));
        return;
      }

      /* le choix du modèle n'a de sens qu'à partir de deux */
      if (e.modeles.length > 1) {
        ligne.appendChild(UI.select(e.modeles.map(function (x) {
          return { value: x.nom, label: x.nom + (x.taille ? ' · ' + x.taille : '') };
        }), reg.modele, function (v) { IA.regler('modele', v); peindre(e); }));
      } else if (m) {
        ligne.appendChild(UI.chip(m.nom + (m.taille ? ' · ' + m.taille : '')));
      }

      ligne.appendChild(bascule('Développer sans attendre qu’on le demande', reg.auto, function (v) {
        IA.regler('auto', v); peindre(e);
      }, 'Auto'));

      /* Le réglage n'existe que si le modèle sait réfléchir — et il reste à
         l'arrêt : sur un 4 B, réfléchir triple le délai sans rien apporter à
         une reformulation dont les faits sont déjà fournis. */
      if (m && m.pense) {
        ligne.appendChild(bascule(
          'Laisser le modèle réfléchir avant de répondre — trois fois plus lent, sans gain ici',
          reg.pense, function (v) { IA.regler('pense', v); peindre(e); }, 'Réflexion'));
      }
    }

    function bascule(titre, on, quand, nom) {
      var b = UI.btn((on ? '☑  ' : '☐  ') + nom, function () { quand(!on); }, 'sm');
      b.title = titre;
      return b;
    }

    if (IA_ETAT) peindre(IA_ETAT);
    else {
      ligne.appendChild(el('span', { class: 'ch-ia-off', text: '✨ recherche d’un modèle local…' }));
      IA.etat().then(function (e) { IA_ETAT = e; peindre(e); });
    }
    return ligne;
  }

  /* ------------------------------------------------------------
     Un échange : la question, puis la réponse
     ------------------------------------------------------------ */

  function messageMoi(q) {
    return el('div', { class: 'ch-msg moi' }, [el('div', { class: 'ch-bulle', text: q })]);
  }

  function messageRep(r, poserQ) {
    var corps = el('div', { class: 'ch-bulle' });

    corps.appendChild(el('div', { class: 'ch-titre', text: r.titre }));
    if (r.chapo) corps.appendChild(el('div', { class: 'ch-chapo', html: r.chapo }));

    (r.blocs || []).forEach(function (b) {
      var n = bloc(b, poserQ);
      if (n) corps.appendChild(n);
    });

    /* l'interrogation demandée se déroule dans la bulle elle-même */
    if (r.quiz) interro(r.quiz, corps);

    if (r.actions && r.actions.length) {
      corps.appendChild(el('div', { class: 'btn-row ch-actions' }, r.actions.map(function (a) {
        return UI.btn(a.ic ? a.ic + '  ' + a.label : a.label, function () {
          if (a.go) return App.go(a.go.id, a.go.params);
          if (a.demande) return poserQ(a.demande);
          if (a.recherche) return App.openSearch(a.recherche);
          if (a.quiz) {
            var h = el('div');
            corps.insertBefore(h, corps.querySelector('.ch-actions'));
            interro(a.quiz, h);
          }
        }, 'sm');
      })));
    }

    /* Le modèle local, s'il est activé : après la réponse sûre, jamais avant. */
    var ia = offreIA(r, corps);
    if (ia) corps.appendChild(ia);

    /* La provenance, toujours. Une UE mène à sa fiche ; une définition de
       glossaire ou une section de « Cours & fiches » mènent chez elles. */
    if (r.source) {
      var src = r.source;
      var cible = src.code
        ? { id: 'studies', params: { sem: src.sem, ue: src.code } }
        : src.go;
      corps.appendChild(el('div', { class: 'ch-source' }, [
        el('span', { text: 'D’après ' }),
        el('button', {
          class: 'ch-lien',
          text: src.code
            ? src.code + ' — ' + src.titre + (src.sem ? ' · ' + src.sem : '')
            : src.libelle,
          onClick: function () { if (cible) App.go(cible.id, cible.params); }
        }),
        src.partie ? el('span', { text: ' · ' + src.partie }) : null
      ].filter(Boolean)));
    }

    var msg = el('div', { class: 'ch-msg rep' }, [corps]);

    if (r.suites && r.suites.length) {
      msg.appendChild(el('div', { class: 'ch-suites' }, r.suites.map(function (s) {
        return el('button', { class: 'ch-puce', text: s, onClick: function () { poserQ(s); } });
      })));
    }
    return msg;
  }

  /* ------------------------------------------------------------
     Les premières questions proposées
     ------------------------------------------------------------
     Pas de liste figée : on les tire de l'état réel de l'étudiant,
     sans quoi la page d'accueil du répétiteur propose éternellement
     les mêmes exemples de démonstration.
     ------------------------------------------------------------ */

  function amorces() {
    var out = [];
    var semId = Store.state.profile.semester;
    var sem = (window.CURRICULUM || []).filter(function (x) { return x.id === semId; })[0];

    if (window.Modules.edt && Modules.edt.next) {
      var n = Modules.edt.next();
      if (n && n.ue) out.push('Où en suis-je sur ' + n.ue.code + ' ?');
    }
    if (sem && window.Modules.studies && Modules.studies.priorities) {
      var p = Modules.studies.priorities(semId, 1)[0];
      if (p) out.push('Interroge-moi sur ' + p.ue.code);
    }
    out.push('Je fais quoi aujourd’hui ?');

    /* une notion tirée au sort parmi celles qui portent un schéma : c'est la
       démonstration la plus parlante de ce que sait faire le répétiteur */
    var avecFig = Repet.corpus().filter(function (x) {
      return x.k === 'notion' && x.fig && (!sem || x.sem === semId);
    });
    if (!avecFig.length) avecFig = Repet.corpus().filter(function (x) { return x.k === 'notion' && x.fig; });
    if (avecFig.length) {
      var tire = avecFig[Math.floor(Math.random() * avecFig.length)];
      out.push('Je n’ai pas compris ' + tire.t.charAt(0).toLowerCase() + tire.t.slice(1));
    }
    out.push('Que sais-tu faire ?');
    return out;
  }

  /* ------------------------------------------------------------
     Le module
     ------------------------------------------------------------ */

  M.chat = {
    id: 'chat', title: 'Répétiteur', icon: '💬', group: 'Mon travail',
    desc: 'Une question en français : la notion expliquée, son schéma, son piège — tiré de vos fiches',
    keywords: 'chat repetiteur question aide comprendre explication assistant demander pourquoi definition difference tuteur bloque incompris',

    /* ouvrir le répétiteur sur une question précise — utilisé par les fiches
       d'UE (« je n'ai pas compris cette partie ») et par le raccourci clavier */
    ask: function (q) { App.go('chat', { q: q }); },

    /* Quitter la page pendant que le modèle écrit doit couper la génération :
       elle occupe le processeur pour un texte que plus personne ne lira. */
    leave: function () { if (window.IA && IA.possible()) IA.stop(); },

    render: function (ctx) {
      var params = (ctx && ctx.params) || {};
      var flux = el('div', { class: 'ch-flux' });
      var champ = el('input', {
        type: 'text', class: 'ch-champ', autocomplete: 'off',
        placeholder: 'Une question, comme vous la poseriez à voix haute…',
        'aria-label': 'Poser une question au répétiteur'
      });

      var amorce = el('div', { class: 'ch-amorces' });

      function bas() {
        /* On amène la DERNIÈRE QUESTION en haut de la zone, pas le bas du fil.
           Une réponse longue — définition, schéma, encarts — dépasse la
           hauteur visible : coller au bas ferait arriver le lecteur à la fin
           d'un texte qu'il n'a pas commencé. */
        var zone = flux.parentNode;
        if (!zone) return;
        var questions = flux.querySelectorAll('.ch-msg.moi');
        var derniere = questions[questions.length - 1];
        zone.scrollTop = derniere ? derniere.offsetTop - 12 : zone.scrollHeight;
      }

      /* Le texte du modèle arrive mot à mot, longtemps après le rendu :
         `lancerIA` doit pouvoir suivre le fil sans connaître cette portée. */
      defiler = function () {
        var z = flux.parentNode;
        if (z) z.scrollTop = z.scrollHeight;
      };

      function repondre(q, rejeu) {
        var r = Repet.repondre(q);
        if (!r) return;
        flux.appendChild(messageMoi(q));
        flux.appendChild(messageRep(r, demander));
        if (!rejeu) {
          poser(q);
          Store.logActivity('chat', null, { q: q, intent: r.intent });
        }
        UI.clear(amorce);
        /* après le rendu, sinon les hauteurs ne sont pas encore connues */
        setTimeout(bas, 0);
      }

      function demander(q) {
        q = String(q || '').trim();
        if (!q) return;
        champ.value = '';
        repondre(q, false);
        champ.focus();
      }

      /* on rejoue les questions déjà posées : mêmes données, mêmes réponses */
      var passees = fil();
      passees.forEach(function (q) { repondre(q, true); });

      if (!passees.length) {
        amorce.appendChild(el('div', { class: 'ch-amorce-t', text: 'Par exemple :' }));
        amorces().forEach(function (a) {
          amorce.appendChild(el('button', { class: 'ch-puce', text: a, onClick: function () { demander(a); } }));
        });
        flux.appendChild(amorce);
      }

      champ.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); demander(champ.value); }
      });

      var saisie = el('div', { class: 'ch-barre' }, [
        champ,
        UI.btn('Demander', function () { demander(champ.value); }, 'primary')
      ]);

      var zone = el('div', { class: 'ch-zone' }, [flux]);

      /* Changer l'état de l'IA change ce qui s'affiche sous chaque réponse
         déjà rendue : on redessine la page plutôt que de la rafistoler. */
      var barre = barreIA(function () { App.go('chat'); });

      var page = UI.page({
        crumb: 'Mon travail',
        title: 'Répétiteur',
        subtitle: 'Posez la question comme elle vous vient. Je réponds avec <b>vos</b> fiches — le cours, ' +
          'son analogie, son schéma, son erreur classique — et je vous dis toujours d’où ça sort. ' +
          'Je ne rédige rien de mon cru : quand je n’ai pas, je le dis.'
      }, [
        barre,
        el('div', { class: 'card ch-card' }, [zone, saisie]),
        el('div', { class: 'ch-pied' }, [
          el('span', { class: 'muted', text: 'Le répétiteur ne remplace pas le cours de votre formateur : il en restitue le condensé écrit dans l’application.' }),
          el('span', { class: 'spacer' }),
          passees.length
            ? UI.btn('Effacer le fil', function () { effacer(); App.go('chat'); }, 'sm')
            : null
        ].filter(Boolean))
      ]);

      /* Une question passée en paramètre — « je n'ai pas compris cette partie »
         depuis une fiche d'UE, ou un lien. Elle est traitée maintenant, pas au
         tour suivant : la page doit arriver avec sa réponse déjà dedans. */
      if (params.q) demander(params.q);

      /* le focus et le défilement, eux, attendent que la page soit posée */
      setTimeout(function () { champ.focus(); bas(); }, 0);

      return page;
    }
  };
})();
