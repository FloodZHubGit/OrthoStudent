/* ============================================================
   Store — persistance locale de la progression et des reglages
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'orthostudent.v1';

  var DEFAULTS = {
    theme: 'dark',
    profile: { name: '', year: 'L1', semester: null, edtAnnee: null },
    /* semester : 'S1'..'S6' du referentiel
       edtAnnee : annee suivie dans l'emploi du temps (1, 2 ou 3), null = deduite du semestre */
    settings: {
      testDistance: 5,     // metres
      goal: { cards: 20, quiz: 10 },  // objectif quotidien de revision
      anki: {}             // paquet, type de note et champs choisis par l'utilisateur
    },
    scores: {},            // moduleId -> { attempts, best, last, sum }
    quiz: {},              // questionId -> { seen, ok, ko, lastAt }
    srs: {},               // cardId -> { box, due, seen, ok }
    cases: {},             // caseId -> { done, score, at }
    customCards: [],       // fiches importées ou créées par l'utilisateur
    log: [],               // historique d'activite
    days: {},              // 'AAAA-MM-JJ' -> { cards, quiz, sims, cases }
    studies: {             // suivi du referentiel de formation
      examDates: {},       // 'S3' -> 'AAAA-MM-JJ' (date des partiels)
      ueDone: {},          // 'S3:UE25' -> horodatage de la revision
      planDone: {},        // 'S3:w2:UE25:qcm' -> true
      recite: {},          // 'S3:UE25' -> { pct, n, at } derniere recitation
      reciteLog: {},       // 'S3:UE25' -> [{ pct, n, at }] historique borne
      notes: {}            // 'S3:UE25' -> { t: texte, at: horodatage } notes de l'etudiant
    },
    /* emploi du temps telecharge depuis l'application : identifiant de groupe
       CELCAT -> { annee, label, events, genere }. Il prime sur le fichier livre
       avec l'application (src/js/data/edt.js), qui reste le point de depart. */
    edt: {},
    daily: {}             // plan de la seance du jour : { date, at, steps, skipped }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function deepMerge(base, over) {
    var out = clone(base);
    Object.keys(over || {}).forEach(function (k) {
      /* fusionner deux objets, sinon prendre la valeur enregistree telle quelle :
         out[k] doit etre teste, sinon une valeur par defaut nulle fait echouer la
         fusion entiere et l'etat reparti de zero */
      if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) &&
          out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) {
        out[k] = deepMerge(out[k], over[k]);
      } else if (over[k] !== undefined) {
        out[k] = over[k];
      }
    });
    return out;
  }

  var state = clone(DEFAULTS);

  /* périmètre des exercices notés encore présents — posé par app.js */
  var scoreScope = null;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) state = deepMerge(DEFAULTS, JSON.parse(raw));
    } catch (e) {
      console.warn('Store illisible, reinitialisation.', e);
      state = clone(DEFAULTS);
    }
    return state;
  }

  var saveTimer = null;
  var dirty = false;

  function write() {
    clearTimeout(saveTimer);
    saveTimer = null;
    if (!dirty) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); dirty = false; }
    catch (e) { console.warn('Sauvegarde impossible', e); }
  }

  function save() {
    dirty = true;
    if (saveTimer) return;
    saveTimer = setTimeout(write, 120);
  }

  /* l'écriture est différée : sans ces filets, une fermeture rapide de la
     fenêtre perdrait la dernière révision ou le dernier score */
  window.addEventListener('pagehide', write);
  window.addEventListener('beforeunload', write);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') write();
  });

  var Store = {
    get state() { return state; },

    load: load,
    save: save,

    reset: function () {
      state = clone(DEFAULTS);
      save();
    },

    replace: function (obj) {
      state = deepMerge(DEFAULTS, obj || {});
      save();
    },

    serialize: function () {
      return JSON.stringify({ app: 'OrthoStudent', version: 1, exportedAt: new Date().toISOString(), data: state }, null, 2);
    },

    setting: function (k, v) {
      if (v === undefined) return state.settings[k];
      state.settings[k] = v;
      save();
      return v;
    },

    /* --- Notes d'exercice (0..100) ---
       Les notes d'un exercice retiré de l'application survivent dans le
       stockage local. Elles ne sont pas effacées — on ne jette pas le
       travail de quelqu'un — mais l'application déclare au démarrage les
       exercices qui existent encore, et seules ces notes-là entrent dans
       les moyennes. Sans périmètre déclaré, tout compte. */
    setScoreScope: function (ids) {
      scoreScope = ids && ids.length ? ids.slice() : null;
    },

    /* les identifiants notés qui comptent aujourd'hui */
    scoredIds: function () {
      return Object.keys(state.scores).filter(function (id) {
        return !scoreScope || scoreScope.indexOf(id) >= 0;
      });
    },

    recordScore: function (moduleId, score, meta) {
      var s = state.scores[moduleId] || { attempts: 0, best: 0, last: 0, sum: 0 };
      s.attempts += 1;
      s.last = score;
      s.sum += score;
      if (score > s.best) s.best = score;
      s.avg = Math.round(s.sum / s.attempts);
      s.at = Date.now();
      state.scores[moduleId] = s;
      Store.logActivity(moduleId, score, meta);
      Store.bump('sims');
      save();
      return s;
    },

    score: function (moduleId) {
      return state.scores[moduleId] || null;
    },

    logActivity: function (moduleId, score, meta) {
      state.log.unshift({ m: moduleId, s: score, t: Date.now(), meta: meta || null });
      if (state.log.length > 400) state.log.length = 400;
    },

    /* --- QCM --- */
    recordQuiz: function (qid, ok) {
      var q = state.quiz[qid] || { seen: 0, ok: 0, ko: 0 };
      q.seen += 1;
      if (ok) q.ok += 1; else q.ko += 1;
      q.lastAt = Date.now();
      state.quiz[qid] = q;
      Store.bump('quiz');
      save();
    },

    /* --- Repetition espacee (Leitner 5 boites) --- */
    boxIntervals: [0, 1, 2, 5, 10, 25],

    reviewCard: function (cardId, quality) {
      // quality: 0 = oublie, 1 = difficile, 2 = su
      var c = state.srs[cardId] || { box: 1, seen: 0, ok: 0, due: 0 };
      c.seen += 1;
      if (quality === 0) c.box = 1;
      else if (quality === 1) c.box = Math.max(1, c.box);
      else { c.box = Math.min(5, c.box + 1); c.ok += 1; }
      var days = Store.boxIntervals[c.box];
      c.due = Date.now() + days * 86400000;
      c.lastAt = Date.now();
      state.srs[cardId] = c;
      Store.bump('cards');
      save();
      return c;
    },

    reciteHistory: function (key) {
      return Store.studies().reciteLog[key] || [];
    },

    dueCards: function (allIds) {
      var now = Date.now();
      return allIds.filter(function (id) {
        var c = state.srs[id];
        return !c || c.due <= now;
      });
    },

    /* --- Cas cliniques --- */
    recordCase: function (caseId, score) {
      state.cases[caseId] = { done: true, score: score, at: Date.now() };
      Store.logActivity('patient:' + caseId, score, null);
      Store.bump('cases');
      save();
    },

    /* --- Régularité : compteurs par jour, objectif, série --------------
       Un jour de travail est une clé 'AAAA-MM-JJ' : c'est ce qui permet
       la série (jours consécutifs) et la carte de chaleur sans dépendre
       du journal, qui lui est tronqué à 400 entrées. ------------------ */

    dayKey: function (d) {
      d = d || new Date();
      var m = d.getMonth() + 1, j = d.getDate();
      return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (j < 10 ? '0' : '') + j;
    },

    bump: function (kind, n) {
      var k = Store.dayKey();
      if (!state.days) state.days = {};
      var d = state.days[k] || { cards: 0, quiz: 0, sims: 0, cases: 0, ecoute: 0 };
      d[kind] = (d[kind] || 0) + (n === undefined ? 1 : n);
      state.days[k] = d;
      // on garde deux ans d'historique, pas plus
      var keys = Object.keys(state.days).sort();
      while (keys.length > 730) delete state.days[keys.shift()];
      save();
      return d;
    },

    day: function (key) {
      return (state.days && state.days[key || Store.dayKey()]) || { cards: 0, quiz: 0, sims: 0, cases: 0, ecoute: 0 };
    },

    goal: function () {
      var g = (state.settings && state.settings.goal) || {};
      return { cards: g.cards === undefined ? 20 : g.cards, quiz: g.quiz === undefined ? 10 : g.quiz };
    },

    setGoal: function (cards, quiz) {
      state.settings.goal = { cards: Math.max(0, cards | 0), quiz: Math.max(0, quiz | 0) };
      save();
      return state.settings.goal;
    },

    dayTotal: function (key) {
      var d = Store.day(key);
      /* l'ecoute compte comme du travail : elle n'installe rien dans les
         boites, mais une journee passee a reviser en marchant n'est pas
         une journee vide */
      return d.cards + d.quiz + d.sims + d.cases + (d.ecoute || 0);
    },

    /* série de jours consécutifs travaillés ; la journée en cours ne casse
       pas la série tant qu'elle n'est pas terminée */
    streak: function () {
      var days = state.days || {};
      var keys = Object.keys(days).filter(function (k) { return Store.dayTotal(k) > 0; }).sort();
      if (!keys.length) return { current: 0, best: 0, activeDays: 0, todayDone: false };

      var DAY = 86400000;
      var set = {};
      keys.forEach(function (k) { set[k] = true; });

      var todayKey = Store.dayKey();
      var todayDone = !!set[todayKey];

      function count(fromDate) {
        var n = 0, t = fromDate.getTime();
        while (set[Store.dayKey(new Date(t))]) { n++; t -= DAY; }
        return n;
      }
      var now = new Date();
      var current = todayDone ? count(now) : count(new Date(now.getTime() - DAY));

      var best = 0, run = 0, prev = null;
      keys.forEach(function (k) {
        var t = new Date(k + 'T12:00:00').getTime();
        run = (prev !== null && Math.round((t - prev) / DAY) === 1) ? run + 1 : 1;
        if (run > best) best = run;
        prev = t;
      });

      return { current: current, best: Math.max(best, current), activeDays: keys.length, todayDone: todayDone };
    },

    /* n derniers jours, du plus ancien au plus récent (carte de chaleur) */
    activity: function (n) {
      var out = [], DAY = 86400000, now = Date.now();
      for (var i = n - 1; i >= 0; i--) {
        var d = new Date(now - i * DAY);
        var key = Store.dayKey(d);
        var day = Store.day(key);
        var total = day.cards + day.quiz + day.sims + day.cases + (day.ecoute || 0);
        out.push({
          key: key, date: d, total: total, cards: day.cards, quiz: day.quiz, sims: day.sims, cases: day.cases,
          level: total === 0 ? 0 : total < 5 ? 1 : total < 15 ? 2 : total < 30 ? 3 : 4
        });
      }
      return out;
    },

    /* --- Suivi du programme des etudes --- */

    studies: function () {
      if (!state.studies) state.studies = { examDates: {}, ueDone: {}, planDone: {}, recite: {} };
      var s = state.studies;
      if (!s.examDates) s.examDates = {};
      if (!s.ueDone) s.ueDone = {};
      if (!s.planDone) s.planDone = {};
      if (!s.recite) s.recite = {};
      if (!s.reciteLog) s.reciteLog = {};
      if (!s.notes) s.notes = {};
      if (!s.corrections) s.corrections = {};
      return s;
    },

    /* Notes de l'etudiant sur une UE : ce que le formateur a insiste,
       une formule dite en cours, un point a reprendre. C'est la seule
       partie d'une fiche que l'application n'ecrit pas — donc celle
       qu'il ne faut jamais perdre : elle est exportee et imprimee
       avec le reste. Renvoie '' quand il n'y a rien. */
    ueNote: function (key, value) {
      var s = Store.studies();
      if (value === undefined) return (s.notes[key] && s.notes[key].t) || '';
      var t = String(value == null ? '' : value);
      if (t.trim()) s.notes[key] = { t: t, at: Date.now() };
      else delete s.notes[key];
      save();
      return t;
    },

    /* --- Corrections de l'étudiant, partie de cours par partie de cours ---
       Le contenu des fiches n'est adossé à aucune source citée : il vient de
       ce que l'application sait, pas d'un référentiel qu'on pourrait aller
       vérifier. Quand le cours du formateur dit autre chose, c'est LUI qui a
       raison — et l'étudiant doit pouvoir l'écrire une fois pour toutes,
       plutôt que de se rappeler à chaque révision « attention, ici c'est
       faux ». Une correction prime ensuite partout : sur la fiche, dans le
       répétiteur, à l'impression. */
    correction: function (code, i, value) {
      var s = Store.studies(), k = code + ':' + i;
      if (value === undefined) return (s.corrections[k] && s.corrections[k].t) || '';
      var t = String(value == null ? '' : value);
      if (t.trim()) s.corrections[k] = { t: t, at: Date.now() };
      else delete s.corrections[k];
      save();
      return t;
    },

    correctionAt: function (code, i) {
      var c = Store.studies().corrections[code + ':' + i];
      return c ? c.at : null;
    },

    /* combien de parties d'une UE ont été corrigées */
    correctionsDe: function (code) {
      var s = Store.studies().corrections, n = 0;
      Object.keys(s).forEach(function (k) { if (k.indexOf(code + ':') === 0) n++; });
      return n;
    },

    ueNoteAt: function (key) {
      var n = Store.studies().notes[key];
      return n ? n.at : null;
    },

    /* Derniere recitation d'une UE : { pct, n, at }.
       C'est le signal de maitrise le plus fiable dont on dispose,
       parce qu'il vient d'un rappel actif et non d'une reconnaissance. */
    recite: function (key, value) {
      var s = Store.studies();
      if (value === undefined) return s.recite[key] || null;
      if (value === null) { delete s.recite[key]; delete s.reciteLog[key]; save(); return null; }
      var entry = { pct: value.pct, n: value.n, at: Date.now() };
      s.recite[key] = entry;
      // l'historique dit la progression ; un score isole ne dit rien
      var log = s.reciteLog[key] || [];
      log.push(entry);
      if (log.length > 24) log = log.slice(log.length - 24);
      s.reciteLog[key] = log;
      save();
      return entry;
    },

    ueDone: function (key, value) {
      var s = Store.studies();
      if (value === undefined) return !!s.ueDone[key];
      if (value) s.ueDone[key] = Date.now(); else delete s.ueDone[key];
      save();
      return !!s.ueDone[key];
    },

    planDone: function (key, value) {
      var s = Store.studies();
      if (value === undefined) return !!s.planDone[key];
      if (value) s.planDone[key] = true; else delete s.planDone[key];
      save();
      return !!s.planDone[key];
    },

    examDate: function (semId, value) {
      var s = Store.studies();
      if (value === undefined) return s.examDates[semId] || null;
      if (value) s.examDates[semId] = value; else delete s.examDates[semId];
      save();
      return s.examDates[semId] || null;
    },

    /* --- Statistiques globales --- */
    stats: function () {
      var qids = Object.keys(state.quiz);
      var seen = 0, ok = 0;
      qids.forEach(function (id) { seen += state.quiz[id].seen; ok += state.quiz[id].ok; });
      var simIds = Store.scoredIds();
      var simAvg = 0;
      if (simIds.length) {
        simAvg = Math.round(simIds.reduce(function (a, id) { return a + (state.scores[id].avg || 0); }, 0) / simIds.length);
      }
      var mastered = Object.keys(state.srs).filter(function (id) { return state.srs[id].box >= 4; }).length;
      var caseKeys = Object.keys(state.cases);
      var written = caseKeys.filter(function (k) { return k.indexOf('gen:') !== 0; }).length;
      var generated = caseKeys.length - written;
      return {
        quizSeen: seen,
        quizOk: ok,
        quizRate: seen ? Math.round((ok / seen) * 100) : 0,
        simModules: simIds.length,
        simAvg: simAvg,
        cardsMastered: mastered,
        casesDone: written,
        casesGenerated: generated,
        sessions: state.log.length
      };
    }
  };

  window.Store = Store;
})();
