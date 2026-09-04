/* ============================================================
   Le pont Anki : lecture seule, et lecture juste
   ------------------------------------------------------------
   Deux choses à garantir.

   1. LA LECTURE SEULE. AnkiConnect expose `deleteDecks` aussi
      volontiers que `deckNames` : rien dans le protocole ne
      distingue lire de détruire. La garantie tient à une liste
      fermée, et une liste fermée ne vaut que si on l'éprouve —
      on tente donc vraiment les actions destructrices, et on
      vérifie qu'elles sont refusées AVANT tout appel réseau.

   2. LA MISE EN TEXTE. Un champ Anki contient du HTML : gras,
      listes, entités, sons, images. L'application ne rend jamais
      de HTML venu d'ailleurs — il faut donc le ramener à du
      texte sans perdre la structure d'une réponse.

   Aucun accès au réseau, aucune collection réelle : le test ne
   doit dépendre ni du serveur d'Anki ni des cartes de personne.
   ============================================================ */
'use strict';
const anki = require('../anki');

const dur = [];

/* ---------- 1 · la liste fermée ---------- */

const INTERDITES = [
  'deleteDecks', 'addNotes', 'updateNoteFields', 'createDeck', 'removeTags',
  'sync', 'guiDeckBrowser', 'storeMediaFile', 'deleteMediaFile', 'reloadCollection'
];

console.log('ACTIONS AUTORISÉES : ' + anki.ANKI_LECTURE.join(', ') + '\n');

(async () => {
  for (const action of INTERDITES) {
    let refus = null;
    try {
      await anki.appel(action, {}, 200);
      refus = 'AUCUN REFUS';
    } catch (e) {
      refus = e.message;
    }
    /* Le refus doit venir de la liste, pas d'un hasard réseau : si Anki
       n'écoute pas, une action interdite « échouerait » quand même, et le
       test ne prouverait rien. On exige le message de la liste. */
    const bon = /n’est pas une lecture/.test(refus);
    console.log('  ' + (bon ? '✔' : '✘') + ' ' + action.padEnd(20) + refus.slice(0, 60));
    if (!bon) dur.push(action + ' : refusée pour la mauvaise raison — « ' + refus + ' »');
  }

  /* et les quatre autorisées doivent, elles, atteindre le réseau */
  let joint = null;
  try { await anki.appel('version', null, 300); joint = 'répond'; }
  catch (e) { joint = e.message; }
  const passe = !/n’est pas une lecture/.test(joint);
  console.log('\n  ' + (passe ? '✔' : '✘') + ' version              ' + joint.slice(0, 60));
  if (!passe) dur.push('« version » est refusée alors qu’elle figure dans la liste');

  /* ---------- 2 · la mise en texte ---------- */

  console.log('\nMISE EN TEXTE');
  const CAS = [
    ['<b>Gras</b> et <i>italique</i>', 'Gras et italique', 'les balises tombent'],
    ['Un<br>deux<br />trois', 'Un\ndeux\ntrois', 'les sauts de ligne restent'],
    ['<div>Premier</div><div>Second</div>', 'Premier\nSecond', 'un div est une ligne'],
    ['<ul><li>alpha</li><li>bêta</li></ul>', '• alpha\n• bêta', 'les puces survivent'],
    ['Acuit&eacute; &agrave; 10/10', 'Acuité à 10/10', 'les entités nommées'],
    ['5&#160;&#215;&#160;5', '5 × 5', 'les entités numériques'],
    ['Question [sound:abc.mp3] ?', 'Question ?', 'le son est retiré'],
    ['<img src="oeil.png"> Le fond', 'Le fond', 'une image ne laisse pas de trace'],
    ['a\n\n\n\n\nb', 'a\n\nb', 'pas plus d’une ligne vide'],
    ['   ', '', 'un champ vide reste vide']
  ];
  CAS.forEach(function (c) {
    const r = anki.texte(c[0]);
    const bon = r === c[1];
    console.log('  ' + (bon ? '✔' : '✘') + ' ' + c[2]);
    if (!bon) dur.push(c[2] + ' → « ' + r.replace(/\n/g, '⏎') +' » au lieu de « ' + c[1].replace(/\n/g, '⏎') + ' »');
  });

  /* ---------- 3 · une carte AnkiConnect vers une carte d'ici ---------- */

  console.log('\nCONVERSION D’UNE CARTE');
  const brute = {
    cardId: 1723456789, deckName: 'Orthoptie::L1::S1::UE04_Physiologie_visuelle::CM01_Voir_ne_suffit_pas',
    modelName: 'Basique',
    fields: {
      Verso: { value: 'Parce que la <b>transmission</b> compte aussi.', order: 1 },
      Recto: { value: 'Pourquoi 10/10 ne suffit-il pas&nbsp;?', order: 0 }
    }
  };
  const k = anki.carte(brute);
  const attendu = {
    id: 'anki-1723456789',
    f: 'Pourquoi 10/10 ne suffit-il pas ?',
    b: 'Parce que la transmission compte aussi.',
    paquet: brute.deckName
  };
  Object.keys(attendu).forEach(function (key) {
    const bon = k[key] === attendu[key];
    console.log('  ' + (bon ? '✔' : '✘') + ' ' + key + ' : ' + JSON.stringify(k[key]).slice(0, 70));
    if (!bon) dur.push('carte.' + key + ' = ' + JSON.stringify(k[key]) + ' au lieu de ' + JSON.stringify(attendu[key]));
  });
  /* l'ordre des champs fait le recto, pas l'ordre des clés de l'objet */
  if (k.f.indexOf('Pourquoi') !== 0) dur.push('le recto ne suit pas l’ordre déclaré des champs');

  const vide = anki.carte({ cardId: 1, deckName: 'X', fields: { A: { value: '  ', order: 0 } } });
  console.log('  ' + (vide === null ? '✔' : '✘') + ' une carte sans contenu est écartée');
  if (vide !== null) dur.push('une carte à champs vides devrait être écartée');

  /* ---------- 4 · à quelle UE appartient un paquet ---------- */

  /* Ce bout de code a été écrit deux fois de suite avec la même faute : un
     \\b après les chiffres. Dans « UE04_Physiologie », le chiffre est suivi
     d'un souligné — un caractère de mot — donc il n'y a aucune frontière, et
     la reconnaissance échouait sur TOUS les paquets. Rien ne le voyait : le
     rattachement rendait simplement une liste vide, ce qui ressemble à « cet
     étudiant n'a pas encore de cartes ». D'où ce test. */
  console.log('\nÀ QUELLE UE APPARTIENT UN PAQUET');
  const PAQUETS = [
    ['Orthoptie::L1::S1::UE04_Physiologie_visuelle::CM01_Voir_ne_suffit_pas', 'UE04', 'le cas réel, souligné après le chiffre'],
    ['Orthoptie::L1::S1::UE01_Biologie', 'UE01', 'zéro déjà présent'],
    ['Orthoptie::L1::S1::UE12_Deontologie', 'UE12', 'deux chiffres'],
    ['Orthoptie::L1::S2::UE4 Réfraction', 'UE04', 'sans zéro : on complète'],
    ['UE 7 Anatomie', 'UE07', 'une espace après UE'],
    ['Orthoptie::L1::S1::Stage', null, 'un paquet sans UE'],
    ['Orthoptie::L1', null, 'un niveau intermédiaire'],
    ['Divers::UEFA', null, 'un mot qui commence par UE mais n’est pas une UE'],
    ['', null, 'un chemin vide']
  ];
  PAQUETS.forEach(function (c) {
    const r = anki.codeUE(c[0]);
    const bon = r === c[1];
    console.log('  ' + (bon ? '✔' : '✘') + ' ' + c[2].padEnd(42) + (r === null ? '—' : r));
    if (!bon) dur.push(c[2] + ' → ' + r + ' au lieu de ' + c[1]);
  });

  /* et la carte porte bien ce code */
  const kUE = anki.carte({ cardId: 9, deckName: 'Orthoptie::L1::S1::UE04_Physio::CM01',
    fields: { R: { value: 'x', order: 0 } } });
  console.log('  ' + (kUE.ue === 'UE04' ? '✔' : '✘') + ' la carte porte son code d’UE : ' + kUE.ue);
  if (kUE.ue !== 'UE04') dur.push('la carte ne porte pas son code d’UE');

  /* ---------- 4 · la reprise sur erreur de transport ---------- */

  /* Le symptôme rapporté : « Mes cartes Anki » annonçait toujours qu'Anki ne
     répondait pas, et il fallait cliquer « Réessayer ». AnkiConnect tourne
     dans le fil principal d'Anki : la première requête après un moment
     d'inactivité peut être coupée ou dépasser le délai. Un faux Anki qui
     coupe la première connexion reproduit exactement ce cas. */
  console.log('\nREPRISE SUR ERREUR DE TRANSPORT');
  const http = require('http');
  let recues = 0;
  const serveur = http.createServer((req, res) => {
    recues++;
    if (recues === 1) { req.socket.destroy(); return; }   /* première : coupée */
    res.end(JSON.stringify({ result: 6, error: null }));
  });
  await new Promise((r) => serveur.listen(8791, '127.0.0.1', r));

  process.env.ORTHO_ANKI_PORT = '8791';
  delete require.cache[require.resolve('../anki')];
  const ankiPort = require('../anki');

  let r1 = null;
  try { r1 = await ankiPort.appelSur('version', null, 1500); }
  catch (e) { r1 = 'ÉCHEC : ' + e.message; }
  const repris = r1 === 6;
  console.log('  ' + (repris ? '✔' : '✘') + ' première connexion coupée, seconde réussie (' +
    recues + ' requêtes, résultat ' + r1 + ')');
  if (!repris) dur.push('la reprise sur erreur de transport ne fonctionne pas : ' + r1);

  /* et sans reprise, la même situation échoue — sinon le test ne prouve rien */
  recues = 0;
  let r2 = null;
  try { r2 = await ankiPort.appel('version', null, 1500); }
  catch (e) { r2 = e.message; }
  const echoue = r2 !== 6;
  console.log('  ' + (echoue ? '✔' : '✘') + ' sans reprise, la même coupure échoue bien (' + r2 + ')');
  if (!echoue) dur.push('le faux Anki ne coupe pas la première connexion : le test ne prouve rien');

  /* une erreur applicative n'est JAMAIS retentée */
  recues = 0;
  const serveur2 = http.createServer((req, res) => {
    recues++;
    res.end(JSON.stringify({ result: null, error: 'deck was not found' }));
  });
  await new Promise((r) => serveur2.listen(8792, '127.0.0.1', r));
  process.env.ORTHO_ANKI_PORT = '8792';
  delete require.cache[require.resolve('../anki')];
  const ankiApp = require('../anki');
  try { await ankiApp.appelSur('deckNames', null, 1500); } catch (e) { /* attendu */ }
  const uneSeule = recues === 1;
  console.log('  ' + (uneSeule ? '✔' : '✘') + ' une erreur d’Anki n’est pas retentée (' + recues + ' requête)');
  if (!uneSeule) dur.push('une erreur applicative est retentée ' + recues + ' fois');

  serveur.close(); serveur2.close();

  console.log('');
  if (dur.length) {
    console.log(dur.length + ' problème(s) :');
    dur.forEach(function (d) { console.log('  · ' + d); });
    process.exit(1);
  }
  console.log('Le pont ne sait que lire, et il lit juste.');
})();
