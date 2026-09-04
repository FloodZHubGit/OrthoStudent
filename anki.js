/* ============================================================
   Client Anki — LECTURE SEULE, et pas seulement par politesse
   ------------------------------------------------------------
   L'extension AnkiConnect ouvre une API locale sur le port 8765.
   Elle expose aussi bien `deckNames` que `deleteDecks` : rien,
   dans le protocole, ne distingue lire de détruire.

   La garantie est donc posée ici : toute action hors de la liste
   ANKI_LECTURE est refusée AVANT d'atteindre Anki. Ce fichier
   tourne dans Node — processus principal d'Electron ou ligne de
   commande —, jamais dans la page. La page ne parle jamais au
   port 8765 ; elle ne parle qu'à ce fichier, par IPC. Même
   modifiée, même trompée, elle ne peut pas faire supprimer un
   paquet.

   Le pont vit hors de la page pour la même raison que celui
   d'Ollama : la CSP `default-src 'self'` reste intacte, et
   AnkiConnect n'a aucune origine à autoriser.

   Il est à la racine, à côté de celcat.js, pour que le banc
   d'essai puisse charger exactement le même code que
   l'application — c'est la seule façon qu'un test veuille dire
   quelque chose.
   ============================================================ */

'use strict';

const http = require('http');

const HOTE = '127.0.0.1';

/* 8765 est le port d'usine d'AnkiConnect. Il se règle dans l'extension, et
   le banc d'essai s'en sert pour lancer un faux Anki sans toucher au vrai. */
const PORT = Number(process.env.ORTHO_ANKI_PORT) || 8765;

/* Quatre actions. Toutes lisent. Aucune n'écrit, ne déplace, ne
   supprime, ne synchronise. */
const ANKI_LECTURE = ['version', 'deckNames', 'findCards', 'cardsInfo'];

function appel(action, params, timeoutMs) {
  return new Promise((resolve, reject) => {
    if (ANKI_LECTURE.indexOf(action) < 0) {
      reject(new Error('Action refusée : « ' + action + ' » n’est pas une lecture.'));
      return;
    }
    const body = JSON.stringify({ action: action, version: 6, params: params || {} });
    const req = http.request({
      host: HOTE, port: PORT, path: '/', method: 'POST', agent: false,
      /* « Connection: close » et agent: false : AnkiConnect ferme la socket
         après chaque réponse sans l'annoncer. Avec le keep-alive de Node, une
         requête sur trois tombait en ECONNRESET. La leçon vient du code
         d'envoi retiré depuis ; elle reste vraie en lecture. */
      headers: {
        'Content-Type': 'application/json', Connection: 'close',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        let j;
        try { j = JSON.parse(data); }
        catch (e) { reject(new Error('Réponse illisible d’AnkiConnect.')); return; }
        if (j && j.error) reject(new Error(String(j.error)));
        else resolve(j ? j.result : null);
      });
    });
    req.setTimeout(timeoutMs || 8000, () => req.destroy(new Error('Anki ne répond pas.')));
    req.on('error', (e) => reject(new Error(e.code === 'ECONNREFUSED'
      ? 'AnkiConnect ne répond pas sur le port ' + PORT + '.' : e.message)));
    req.write(body);
    req.end();
  });
}

/* Le contenu d'un champ Anki est du HTML. On le ramène à du texte :
   l'application n'injecte jamais de HTML venu d'ailleurs, et les images
   pointent vers un dossier média qu'elle n'a pas. Les sauts de ligne sont
   conservés, eux : ils portent souvent la structure d'une réponse. */
/* Les entités nommées qui apparaissent réellement dans des fiches
   françaises. Node n'a pas de DOM pour les décoder, et se limiter aux cinq
   entités de base laissait « Acuit&eacute; &agrave; 10/10 » tel quel à
   l'écran — c'est-à-dire illisible. */
const ENTITES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  agrave: 'à', acirc: 'â', auml: 'ä', ccedil: 'ç', egrave: 'è', eacute: 'é',
  ecirc: 'ê', euml: 'ë', igrave: 'ì', icirc: 'î', iuml: 'ï', ocirc: 'ô',
  ouml: 'ö', ugrave: 'ù', ucirc: 'û', uuml: 'ü', yuml: 'ÿ', oelig: 'œ',
  Agrave: 'À', Acirc: 'Â', Ccedil: 'Ç', Egrave: 'È', Eacute: 'É',
  Ecirc: 'Ê', Euml: 'Ë', Icirc: 'Î', Iuml: 'Ï', Ocirc: 'Ô', Ugrave: 'Ù',
  Ucirc: 'Û', OElig: 'Œ',
  laquo: '«', raquo: '»', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  hellip: '…', mdash: '—', ndash: '–', deg: '°', middot: '·', bull: '•',
  times: '×', divide: '÷', plusmn: '±', micro: 'µ', sup2: '²', sup3: '³',
  frac12: '½', frac14: '¼', euro: '€', permil: '‰', prime: '′', Prime: '″',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', Delta: 'Δ', lambda: 'λ',
  mu: 'μ', pi: 'π', sigma: 'σ', theta: 'θ', omega: 'ω', infin: '∞',
  le: '≤', ge: '≥', ne: '≠', asymp: '≈', rarr: '→', larr: '←', harr: '↔'
};

function texte(html) {
  return String(html == null ? '' : html)
    .replace(/\[sound:[^\]]*\]/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(div|p|li|tr|h[1-6])>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&([A-Za-z][A-Za-z0-9]{1,9});/g, (m, n) =>
      Object.prototype.hasOwnProperty.call(ENTITES, n) ? ENTITES[n] : m)
    /* Espaces insécables, fines, et autres blancs Unicode : à l'écran ils ne
       se distinguent pas d'une espace, mais ils échappent aux comparaisons et
       aux retours à la ligne. On les ramène tous à une espace ordinaire —
       après le décodage, sinon &#160; passe au travers. */
    .replace(/[  -​  　]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n').map((l) => l.trim()).join('\n')
    .trim();
}

/* Reprise sur erreur de TRANSPORT, jamais sur une erreur applicative.
   La leçon vient du code d'envoi retiré, et elle avait été perdue en le
   réécrivant : AnkiConnect tourne dans le fil principal d'Anki, qui est
   parfois occupé — la toute première requête après un moment d'inactivité
   dépasse le délai, et l'application concluait qu'Anki n'était pas là.
   Une erreur d'Anki lui-même (paquet inconnu, requête invalide) se
   répéterait à l'identique : on ne la retente pas.

   ECONNREFUSED non plus : rien n'écoute, insister ne changerait rien et
   ferait attendre l'étudiant pour un message qu'on connaît déjà. */
const TRANSPORT = /ECONNRESET|socket hang up|EPIPE|ECONNABORTED|ETIMEDOUT|ne répond pas/i;

function pause(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function appelSur(action, params, timeoutMs, essais) {
  let reste = essais === undefined ? 2 : essais;
  for (;;) {
    try { return await appel(action, params, timeoutMs); }
    catch (e) {
      if (reste-- <= 0 || !TRANSPORT.test(e.message || '')) throw e;
      await pause(250);
    }
  }
}

async function etat() {
  try {
    /* Six secondes, pas deux et demie : au premier appel Anki peut être en
       train de charger sa collection ou d'afficher une boîte de dialogue. */
    const version = await appelSur('version', null, 6000);
    const paquets = await appelSur('deckNames', null, 8000);
    return { dispo: true, version: version, paquets: paquets || [] };
  } catch (e) {
    return { dispo: false, erreur: e.message };
  }
}

/* Une carte d'AnkiConnect, ramenée à ce dont l'application a besoin.
   Le premier champ fait le recto, les suivants le verso : c'est vrai des
   types « Basique » comme des types maison à deux ou trois champs. */
/* À quelle UE appartient un paquet ? Son nom le dit :
   « Orthoptie::L1::S1::UE04_Physiologie_visuelle::CM01_… ».

   Pas de  après les chiffres : dans « UE04_Physiologie », le chiffre est
   suivi d une souligné, qui est un caractère de mot — il n y a donc aucune
   frontière, et une première version échouait sur TOUS les paquets sans
   qu aucun test ne le voie. On exige seulement qu aucun autre chiffre ne
   suive, et l on complète à deux chiffres : l étudiant range ses paquets à
   la main, il n a pas à connaître notre convention d écriture. */
function codeUE(chemin) {
  const seg = String(chemin || '').split('::');
  for (let i = 0; i < seg.length; i++) {
    const m = /^UE\s?0*(\d{1,2})(?![0-9])/i.exec(seg[i].trim());
    if (m) return 'UE' + String(m[1]).padStart(2, '0');
  }
  return null;
}

function carte(c) {
  if (!c || !c.cardId) return null;
  const champs = Object.keys(c.fields || {})
    .map((nom) => ({ nom: nom, ordre: c.fields[nom].order, val: texte(c.fields[nom].value) }))
    .sort((a, b) => a.ordre - b.ordre)
    .filter((x) => x.val);
  if (!champs.length) return null;
  return {
    id: 'anki-' + c.cardId,
    paquet: c.deckName || '',
    ue: codeUE(c.deckName),
    modele: c.modelName || '',
    f: champs[0].val,
    b: champs.slice(1).map((x) => x.val).join('\n\n'),
    champs: champs.map((x) => x.nom)
  };
}

/* Récupération. On demande les identifiants, puis les cartes par lots :
   une collection de plusieurs milliers de cartes tient mal en une réponse,
   et le découpage permet d'afficher une progression honnête. */
async function cartes(requete, onProgres) {
  try {
    const ids = await appelSur('findCards', { query: requete || 'deck:*' }, 30000);
    const total = (ids || []).length;
    const out = [];
    const LOT = 150;
    for (let i = 0; i < total; i += LOT) {
      const infos = await appelSur('cardsInfo', { cards: ids.slice(i, i + LOT) }, 30000);
      (infos || []).forEach((c) => {
        const k = carte(c);
        if (k) out.push(k);
      });
      if (onProgres) onProgres({ fait: Math.min(i + LOT, total), total: total });
    }
    return { ok: true, cartes: out, total: total };
  } catch (e) {
    return { ok: false, erreur: e.message };
  }
}

module.exports = { etat, cartes, texte, carte, codeUE, ANKI_LECTURE, PORT, appel, appelSur };
