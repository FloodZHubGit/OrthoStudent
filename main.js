'use strict';

const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

const isMac = process.platform === 'darwin';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: '#0d1218',
    title: 'OrthoStudent',
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function send(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

function buildMenu() {
  const template = [];

  if (isMac) {
    template.push({
      label: app.name,
      submenu: [
        { role: 'about', label: 'À propos d’OrthoStudent' },
        { type: 'separator' },
        { role: 'hide', label: 'Masquer OrthoStudent' },
        { role: 'hideOthers', label: 'Masquer les autres' },
        { role: 'unhide', label: 'Tout afficher' },
        { type: 'separator' },
        { role: 'quit', label: 'Quitter OrthoStudent' }
      ]
    });
  }

  template.push({
    label: 'Fichier',
    submenu: [
      {
        label: 'Exporter ma progression…',
        accelerator: 'CmdOrCtrl+E',
        click: () => send('menu:export')
      },
      {
        label: 'Importer une progression…',
        accelerator: 'CmdOrCtrl+I',
        click: () => send('menu:import')
      },
      { type: 'separator' },
      {
        label: 'Créer un exécutable…',
        enabled: !app.isPackaged,
        click: () => send('menu:goto', 'help:build')
      },
      { type: 'separator' },
      {
        label: 'Réinitialiser la progression',
        click: async () => {
          const res = await dialog.showMessageBox(mainWindow, {
            type: 'warning',
            buttons: ['Annuler', 'Réinitialiser'],
            defaultId: 0,
            cancelId: 0,
            message: 'Effacer toute la progression ?',
            detail: 'Scores, historique de révision et paramètres seront remis à zéro. Cette action est irréversible.'
          });
          if (res.response === 1) send('menu:reset');
        }
      },
      { type: 'separator' },
      isMac ? { role: 'close', label: 'Fermer' } : { role: 'quit', label: 'Quitter' }
    ]
  });

  template.push({
    label: 'Édition',
    submenu: [
      { role: 'undo', label: 'Annuler' },
      { role: 'redo', label: 'Rétablir' },
      { type: 'separator' },
      { role: 'cut', label: 'Couper' },
      { role: 'copy', label: 'Copier' },
      { role: 'paste', label: 'Coller' },
      { role: 'selectAll', label: 'Tout sélectionner' }
    ]
  });

  template.push({
    label: 'Affichage',
    submenu: [
      { role: 'reload', label: 'Recharger' },
      { role: 'toggleDevTools', label: 'Outils de développement' },
      { type: 'separator' },
      { role: 'resetZoom', label: 'Taille réelle' },
      { role: 'zoomIn', label: 'Agrandir' },
      { role: 'zoomOut', label: 'Réduire' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: 'Plein écran' },
      { type: 'separator' },
      {
        label: 'Thème clair / sombre',
        accelerator: 'CmdOrCtrl+D',
        click: () => send('menu:theme')
      }
    ]
  });

  /* Les cinq premières entrées doublent Ctrl+1..5 côté page : l'ordre doit
     rester identique à celui de src/js/app.js, sinon le menu et le clavier
     n'ouvrent plus la même chose. */
  template.push({
    label: 'Aller à',
    submenu: [
      { label: 'Accueil', accelerator: 'CmdOrCtrl+1', click: () => send('menu:goto', 'home') },
      { label: 'Lecture de bilan', accelerator: 'CmdOrCtrl+2', click: () => send('menu:goto', 'reading') },
      { label: 'Mode patient', accelerator: 'CmdOrCtrl+3', click: () => send('menu:goto', 'patient') },
      { label: 'Mes UE', accelerator: 'CmdOrCtrl+4', click: () => send('menu:goto', 'studies') },
      { label: 'Calculatrices', accelerator: 'CmdOrCtrl+5', click: () => send('menu:goto', 'converters') },
      { type: 'separator' },
      { label: 'Séance du jour', click: () => send('menu:goto', 'session') },
      { label: 'Emploi du temps', click: () => send('menu:goto', 'edt') },
      { label: 'Réviser', click: () => send('menu:goto', 'revise') },
      { label: 'Ma progression', click: () => send('menu:goto', 'progress') },
      { type: 'separator' },
      { label: 'Précédent', accelerator: 'Alt+Left', click: () => send('menu:back') },
      { label: 'Suivant', accelerator: 'Alt+Right', click: () => send('menu:forward') },
      { type: 'separator' },
      { label: 'Recherche rapide', accelerator: 'CmdOrCtrl+K', click: () => send('menu:search') }
    ]
  });

  template.push({
    label: 'Aide',
    submenu: [
      { label: 'Guide de démarrage', click: () => send('menu:goto', 'help') },
      { label: 'Avertissement pédagogique', click: () => send('menu:goto', 'disclaimer') },
      {
        label: 'À propos',
        click: () => {
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            message: 'OrthoStudent ' + app.getVersion(),
            detail:
              'Suite pédagogique pour étudiants en orthoptie.\n\n' +
              'Bilans à interpréter, calculatrices et fiches de révision.\n' +
              'Outil de formation : ne remplace ni un cours, ni un examen clinique réel.'
          });
        }
      }
    ]
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

/* -------------------------------------------------------------------
   Le pont vers Ollama
   -------------------------------------------------------------------
   Le répétiteur répond seul, hors ligne, sans rien inventer. Quand un
   modèle tourne en local, il peut en plus REFORMULER : reprendre les
   mêmes extraits de cours et les redire autrement, plus longuement,
   sur mesure pour la question posée.

   Pourquoi ce pont vit dans le processus principal et non dans la page :

     · la CSP de index.html est « default-src 'self' » — la page ne peut
       joindre aucun hôte, et l'ouvrir vers un port serait affaiblir la
       seule barrière qui protège une application qui charge du HTML ;
     · Ollama n'accepte que quelques origines, et une page « file:// »
       n'en fait pas partie : depuis la page, il faudrait demander à
       l'étudiant de régler OLLAMA_ORIGINS.

   Ici, ni l'un ni l'autre : c'est Node qui appelle 127.0.0.1, et la page
   ne voit que des messages.

   La réponse arrive en flux. À treize jetons par seconde sur un 4 B,
   attendre la fin, c'est vingt secondes d'écran figé ; mot à mot, la
   première ligne s'affiche en une seconde.
   ------------------------------------------------------------------- */

const IA_HOTE = '127.0.0.1';
const IA_PORT = 11434;
let iaEnCours = null;          // la requête en vol, pour pouvoir l'interrompre

function iaAppel(chemin, corps, timeoutMs) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const body = corps ? JSON.stringify(corps) : null;
    const req = http.request({
      host: IA_HOTE, port: IA_PORT, path: chemin,
      method: body ? 'POST' : 'GET', agent: false,
      headers: body
        ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
        : {}
    }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Réponse illisible d’Ollama')); }
      });
    });
    req.setTimeout(timeoutMs || 4000, () => req.destroy(new Error('délai dépassé')));
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

/* Ollama est-il là, et avec quoi ? On rend aussi les capacités déclarées
   par chaque modèle : « thinking » décide de l'existence même du réglage. */
ipcMain.handle('ia:etat', async () => {
  try {
    const [v, tags] = await Promise.all([
      iaAppel('/api/version', null, 2500),
      iaAppel('/api/tags', null, 4000)
    ]);
    return {
      dispo: true,
      version: v.version || '',
      modeles: (tags.models || []).map((m) => ({
        nom: m.name,
        taille: m.details ? m.details.parameter_size : '',
        quant: m.details ? m.details.quantization_level : '',
        pense: (m.capabilities || []).indexOf('thinking') >= 0
      }))
    };
  } catch (e) {
    return { dispo: false, erreur: String((e && e.message) || e) };
  }
});

/* Une demande, diffusée mot à mot vers la page.
   « pense » est passé tel quel à Ollama : sur un modèle qui raisonne, le
   couper divise le délai par trois — voir le README. */
ipcMain.handle('ia:demande', async (evt, d) => {
  if (iaEnCours) { try { iaEnCours.destroy(); } catch (e) { /* déjà finie */ } }

  return new Promise((resolve) => {
    const http = require('http');
    const corps = JSON.stringify({
      model: d.modele,
      messages: d.messages,
      stream: true,
      think: !!d.pense,
      options: {
        temperature: d.temperature === undefined ? 0.3 : d.temperature,
        num_predict: d.max || 480,
        num_ctx: 8192
      }
    });

    let texte = '', reflexion = '', reste = '', fini = false;
    function terminer(res) {
      if (fini) return;
      fini = true;
      if (iaEnCours === req) iaEnCours = null;
      resolve(res);
    }

    const req = http.request({
      host: IA_HOTE, port: IA_PORT, path: '/api/chat', method: 'POST', agent: false,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(corps) }
    }, (res) => {
      res.setEncoding('utf8');
      res.on('data', (paquet) => {
        /* Ollama émet un objet JSON par ligne, et une ligne peut arriver
           coupée en deux paquets : on garde le reste pour le suivant. */
        reste += paquet;
        const lignes = reste.split('\n');
        reste = lignes.pop();
        lignes.forEach((l) => {
          if (!l.trim()) return;
          let j;
          try { j = JSON.parse(l); } catch (e) { return; }
          const m = j.message || {};
          if (m.thinking) reflexion += m.thinking;
          if (m.content) {
            texte += m.content;
            if (!evt.sender.isDestroyed()) {
              evt.sender.send('ia:flux', { id: d.id, t: m.content });
            }
          }
          if (j.error) terminer({ ok: false, erreur: j.error });
        });
      });
      res.on('end', () => terminer({ ok: true, texte: texte, reflexion: reflexion }));
    });

    /* Le premier jeton peut tarder : le modèle doit d'abord être chargé en
       mémoire, ce qui prend plusieurs dizaines de secondes au premier appel. */
    req.setTimeout(d.timeout || 180000, () => {
      req.destroy();
      terminer({ ok: false, erreur: 'délai dépassé', texte: texte });
    });
    req.on('error', (e) => terminer({
      ok: false,
      erreur: /ECONNREFUSED/.test(String(e.message)) ? 'Ollama ne répond pas' : String(e.message),
      texte: texte
    }));

    iaEnCours = req;
    req.write(corps);
    req.end();
  });
});

ipcMain.handle('ia:stop', async () => {
  if (!iaEnCours) return false;
  try { iaEnCours.destroy(); } catch (e) { /* déjà finie */ }
  iaEnCours = null;
  return true;
});

ipcMain.handle('data:export', async (_evt, json) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Exporter la progression',
    defaultPath: 'orthostudent-progression.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (canceled || !filePath) return { ok: false };
  fs.writeFileSync(filePath, json, 'utf8');
  return { ok: true, path: filePath };
});

ipcMain.handle('data:import', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Importer une progression',
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (canceled || !filePaths.length) return { ok: false };
  const raw = fs.readFileSync(filePaths[0], 'utf8');
  return { ok: true, data: raw };
});

/* ---------------- Anki ---------------- */

// Export au format « notes en texte brut » lisible directement par Anki 2.1.55+
ipcMain.handle('anki:exportFile', async (_evt, payload) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Exporter les fiches pour Anki',
    defaultPath: (payload.fileName || 'orthostudent-fiches') + '.txt',
    filters: [{ name: 'Notes Anki (texte)', extensions: ['txt'] }]
  });
  if (canceled || !filePath) return { ok: false };
  fs.writeFileSync(filePath, payload.content, 'utf8');
  return { ok: true, path: filePath };
});

/* ------------------------------------------------------------------
   Dialogue local avec l'add-on AnkiConnect.

   Deux précautions indispensables, découvertes à l'usage :

   1. `agent: false` + `Connection: close`. Le serveur HTTP d'AnkiConnect
      ferme la socket après chaque réponse sans l'annoncer. Avec l'agent
      Node par défaut (keep-alive), la requête suivante réutilise une
      socket déjà fermée et échoue en ECONNRESET — environ une requête
      sur trois. Une socket neuve par requête supprime le problème.

   2. Une reprise automatique sur erreur réseau : les erreurs applicatives
      d'Anki (type de note absent, doublon…) ne sont jamais retentées.
------------------------------------------------------------------- */
let ANKI_PORT = 8765;

function ankiRequest(action, params, timeoutMs) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const body = JSON.stringify({ action, version: 6, params: params || {} });
    const req = http.request(
      {
        host: '127.0.0.1', port: ANKI_PORT, path: '/', method: 'POST',
        agent: false,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          Connection: 'close',
          Origin: 'http://localhost'
        }
      },
      (res) => {
        let data = '';
        res.on('data', (c) => { data += c; });
        res.on('end', () => {
          let parsed;
          try { parsed = JSON.parse(data); }
          catch (e) { reject(Object.assign(new Error('Réponse illisible d’AnkiConnect'), { net: true })); return; }
          if (parsed.error) reject(new Error(parsed.error));
          else resolve(parsed.result);
        });
      }
    );
    req.setTimeout(timeoutMs || 5000, () => { req.destroy(Object.assign(new Error('délai dépassé'), { net: true })); });
    req.on('error', (e) => { e.net = true; reject(e); });
    req.write(body);
    req.end();
  });
}

async function ankiConnect(action, params, timeoutMs) {
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await ankiRequest(action, params, timeoutMs);
    } catch (e) {
      last = e;
      const retryable = e.net || /ECONNRESET|socket hang up|EPIPE|ECONNABORTED|délai dépassé/i.test(e.message || '');
      if (!retryable) throw e;
      await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
    }
  }
  throw last;
}

// Inspection complète : version, paquets, types de notes et leurs champs.
// Rien n'est deviné côté application, tout vient de la collection de l'utilisateur.
ipcMain.handle('anki:inspect', async (_evt, opts) => {
  const steps = [];
  if (opts && opts.port) ANKI_PORT = opts.port;
  try {
    const version = await ankiConnect('version', {}, 4000);
    steps.push('version = ' + version);
    const decks = await ankiConnect('deckNames', {}, 4000);
    steps.push(decks.length + ' paquet(s)');
    const modelNames = await ankiConnect('modelNames', {}, 6000);
    steps.push(modelNames.length + ' type(s) de note');
    return { ok: true, version, decks, modelNames, port: ANKI_PORT, steps };
  } catch (e) {
    return { ok: false, error: String(e.message || e), port: ANKI_PORT, steps };
  }
});

// Les champs sont demandés uniquement pour le type de note choisi :
// une requête au lieu d'une par type, donc beaucoup moins d'occasions d'échouer.
ipcMain.handle('anki:fields', async (_evt, modelName) => {
  try {
    const fields = await ankiConnect('modelFieldNames', { modelName }, 5000);
    return { ok: true, fields };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  }
});

ipcMain.handle('anki:send', async (_evt, payload) => {
  const steps = [];
  try {
    const fallbackDeck = (payload.deck || 'OrthoStudent').trim();
    const model = payload.model;
    const fFront = payload.frontField;
    const fBack = payload.backField;
    if (!model || !fFront || !fBack) {
      return { ok: false, error: 'Type de note ou champs non renseignés.', steps };
    }

    // chaque note porte son propre paquet : « L1::UE1 Anatomie » crée
    // le sous-paquet et son parent, c'est la convention d'Anki
    const wanted = [];
    payload.notes.forEach((n) => {
      const d = (n.deck || fallbackDeck).trim();
      if (wanted.indexOf(d) < 0) wanted.push(d);
    });
    for (const d of wanted) await ankiConnect('createDeck', { deck: d }, 6000);
    steps.push(wanted.length + ' paquet(s) prêt(s) : ' + wanted.join(' · '));

    const notes = payload.notes.map((n) => {
      const fields = {};
      fields[fFront] = n.front;
      fields[fBack] = n.back;
      return {
        deckName: (n.deck || fallbackDeck).trim(),
        modelName: model,
        fields,
        tags: n.tags || ['OrthoStudent'],
        options: { allowDuplicate: false, duplicateScope: 'deck' }
      };
    });

    // canAddNotes signale les refus avant l'envoi (doublons, champ vide…)
    let canAdd = [];
    try {
      canAdd = await ankiConnect('canAddNotes', { notes }, 15000);
      steps.push(canAdd.filter(Boolean).length + '/' + notes.length + ' ajoutables');
    } catch (e) {
      steps.push('canAddNotes indisponible (' + e.message + ')');
    }

    const res = await ankiConnect('addNotes', { notes }, 30000);
    const added = res.filter((x) => x !== null).length;
    steps.push(added + ' note(s) créée(s)');

    // détail par paquet, pour le compte rendu
    const perDeck = {};
    notes.forEach((n, i) => {
      if (!perDeck[n.deckName]) perDeck[n.deckName] = { added: 0, skipped: 0 };
      if (res[i] !== null) perDeck[n.deckName].added++;
      else perDeck[n.deckName].skipped++;
    });

    return {
      ok: true, added, skipped: res.length - added, model,
      deck: wanted.length === 1 ? wanted[0] : wanted.length + ' paquets',
      decks: wanted, perDeck,
      duplicates: canAdd.length ? canAdd.filter((x) => !x).length : null, steps
    };
  } catch (e) {
    return { ok: false, error: String(e.message || e), steps };
  }
});

/* ==================================================================
   Import d'une arborescence de fiches
   ------------------------------------------------------------------
   Deux sources :
     · un dossier local — fonctionne aussi pour Google Drive quand
       « Drive pour ordinateur » synchronise le dossier sur la machine ;
     · l'API Google Drive, via OAuth 2.0 en boucle locale (PKCE).
================================================================== */

const IMPORTABLE = /\.(csv|tsv|txt|json|md)$/i;
const MAX_FILE = 2 * 1024 * 1024;
const MAX_FILES = 600;
const MAX_DEPTH = 5;

function walkFolder(dir, segments, out, depth) {
  if (depth > MAX_DEPTH || out.length >= MAX_FILES) return;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
  entries
    .filter((e) => !e.name.startsWith('.') && e.name !== 'node_modules')
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    .forEach((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walkFolder(full, segments.concat(e.name), out, depth + 1);
      else if (IMPORTABLE.test(e.name) && out.length < MAX_FILES) {
        let stat;
        try { stat = fs.statSync(full); } catch (err) { return; }
        if (stat.size > MAX_FILE) return;
        let content = '';
        try { content = fs.readFileSync(full, 'utf8'); } catch (err) { return; }
        out.push({
          path: segments,
          name: e.name.replace(/\.[^.]+$/, ''),
          file: e.name,
          size: stat.size,
          content
        });
      }
    });
}

ipcMain.handle('folder:pick', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Choisir le dossier racine (ex. Orthoptie)',
    properties: ['openDirectory']
  });
  if (canceled || !filePaths.length) return { ok: false };
  const root = filePaths[0];
  const files = [];
  walkFolder(root, [], files, 1);
  return { ok: true, root, rootName: path.basename(root), files };
});

/* ---------------- Google Drive ---------------- */

const OAUTH_BASE = process.env.ORTHO_OAUTH_BASE || 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = process.env.ORTHO_TOKEN_URL || 'https://oauth2.googleapis.com/token';
const DRIVE_API = process.env.ORTHO_DRIVE_API || 'https://www.googleapis.com/drive/v3';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';

function tokenFile() { return path.join(app.getPath('userData'), 'gdrive-token.json'); }
function readTokens() {
  try { return JSON.parse(fs.readFileSync(tokenFile(), 'utf8')); } catch (e) { return null; }
}
function writeTokens(t) {
  try { fs.writeFileSync(tokenFile(), JSON.stringify(t, null, 2), 'utf8'); } catch (e) { /* ignore */ }
}

function httpJSON(url, opts, body) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? require('https') : require('http');
    const req = lib.request(url, Object.assign({ agent: false }, opts), (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        // le statut doit être vérifié même pour un téléchargement brut,
        // sinon une page d'erreur finirait importée comme contenu de fiche
        if (res.statusCode >= 400) {
          let msg = 'HTTP ' + res.statusCode;
          try {
            const p = JSON.parse(data);
            if (p && p.error) msg = p.error.message || p.error;
          } catch (e) { /* corps non JSON */ }
          reject(new Error(msg));
          return;
        }
        if (opts && opts.raw) { resolve({ status: res.statusCode, text: data }); return; }
        let parsed = null;
        try { parsed = JSON.parse(data); } catch (e) { /* laissé à null */ }
        resolve(parsed);
      });
    });
    req.setTimeout(20000, () => req.destroy(new Error('délai dépassé')));
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function form(obj) {
  return Object.keys(obj).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');
}

async function exchangeCode(cfg, code, verifier, redirectUri) {
  const body = form({
    code, client_id: cfg.clientId, client_secret: cfg.clientSecret || '',
    redirect_uri: redirectUri, grant_type: 'authorization_code', code_verifier: verifier
  });
  const r = await httpJSON(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) }
  }, body);
  return r;
}

async function refreshToken(cfg, refresh) {
  const body = form({
    client_id: cfg.clientId, client_secret: cfg.clientSecret || '',
    refresh_token: refresh, grant_type: 'refresh_token'
  });
  return httpJSON(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) }
  }, body);
}

async function accessToken() {
  const t = readTokens();
  if (!t || !t.refresh_token) throw new Error('Non connecté à Google Drive.');
  if (t.access_token && t.expires_at && Date.now() < t.expires_at - 60000) return t.access_token;
  const r = await refreshToken(t.cfg || {}, t.refresh_token);
  const merged = Object.assign({}, t, {
    access_token: r.access_token,
    expires_at: Date.now() + (r.expires_in || 3600) * 1000
  });
  writeTokens(merged);
  return merged.access_token;
}

function driveGet(pathAndQuery, token, raw) {
  return httpJSON(DRIVE_API + pathAndQuery, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
    raw: !!raw
  });
}

ipcMain.handle('gdrive:status', async () => {
  const t = readTokens();
  return {
    connected: !!(t && t.refresh_token),
    account: t ? t.account || null : null,
    clientId: t && t.cfg ? t.cfg.clientId : null,
    tokenPath: tokenFile()
  };
});

ipcMain.handle('gdrive:disconnect', async () => {
  try { fs.unlinkSync(tokenFile()); } catch (e) { /* déjà absent */ }
  return { ok: true };
});

ipcMain.handle('gdrive:connect', async (_evt, cfg) => {
  if (!cfg || !cfg.clientId) return { ok: false, error: 'Identifiant client OAuth manquant.' };
  const crypto = require('crypto');
  const verifier = crypto.randomBytes(48).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  const state = crypto.randomBytes(16).toString('hex');

  return new Promise((resolve) => {
    const http = require('http');
    let settled = false;
    const finish = (r) => { if (!settled) { settled = true; try { server.close(); } catch (e) {} resolve(r); } };

    const server = http.createServer(async (req, res) => {
      const u = new URL(req.url, 'http://127.0.0.1');
      if (u.pathname !== '/') { res.writeHead(404); res.end(); return; }
      const err = u.searchParams.get('error');
      const code = u.searchParams.get('code');
      const gotState = u.searchParams.get('state');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<!doctype html><meta charset="utf-8"><body style="font-family:system-ui;padding:60px;text-align:center">' +
        (code ? '<h2>Connexion réussie</h2><p>Vous pouvez fermer cet onglet et revenir dans OrthoStudent.</p>'
              : '<h2>Connexion annulée</h2><p>Retournez dans OrthoStudent.</p>') + '</body>');
      if (err || !code) { finish({ ok: false, error: err || 'Autorisation refusée.' }); return; }
      if (gotState !== state) { finish({ ok: false, error: 'État OAuth invalide (state mismatch).' }); return; }
      try {
        const redirectUri = 'http://127.0.0.1:' + server.address().port;
        const tok = await exchangeCode(cfg, code, verifier, redirectUri);
        if (!tok.refresh_token) {
          finish({ ok: false, error: 'Google n’a pas renvoyé de jeton de rafraîchissement. Révoquez l’accès dans votre compte Google puis réessayez.' });
          return;
        }
        let account = null;
        try {
          const about = await httpJSON(DRIVE_API + '/about?fields=user(emailAddress,displayName)', {
            method: 'GET', headers: { Authorization: 'Bearer ' + tok.access_token }
          });
          account = about && about.user ? about.user.emailAddress : null;
        } catch (e) { /* facultatif */ }
        writeTokens({
          refresh_token: tok.refresh_token,
          access_token: tok.access_token,
          expires_at: Date.now() + (tok.expires_in || 3600) * 1000,
          account, cfg: { clientId: cfg.clientId, clientSecret: cfg.clientSecret || '' }
        });
        finish({ ok: true, account });
      } catch (e) {
        finish({ ok: false, error: String(e.message || e) });
      }
    });

    server.on('error', (e) => finish({ ok: false, error: String(e.message || e) }));
    server.listen(0, '127.0.0.1', () => {
      const redirectUri = 'http://127.0.0.1:' + server.address().port;
      const url = OAUTH_BASE + '?' + form({
        client_id: cfg.clientId, redirect_uri: redirectUri, response_type: 'code',
        scope: DRIVE_SCOPE, code_challenge: challenge, code_challenge_method: 'S256',
        access_type: 'offline', prompt: 'consent', state
      });
      shell.openExternal(url);
    });

    setTimeout(() => finish({ ok: false, error: 'Délai dépassé : aucune réponse de Google au bout de 3 minutes.' }), 180000);
  });
});

function q(s) { return String(s).replace(/'/g, "\\'"); }

ipcMain.handle('gdrive:children', async (_evt, folderId) => {
  try {
    const token = await accessToken();
    const id = folderId || 'root';
    const query = "'" + q(id) + "' in parents and trashed = false";
    const r = await driveGet('/files?' + form({
      q: query, fields: 'files(id,name,mimeType,size)', pageSize: 200,
      orderBy: 'folder,name', supportsAllDrives: 'true', includeItemsFromAllDrives: 'true'
    }), token);
    return { ok: true, files: r.files || [] };
  } catch (e) { return { ok: false, error: String(e.message || e) }; }
});

/* Parcours récursif d'un dossier Drive et téléchargement des fichiers importables */
ipcMain.handle('gdrive:tree', async (_evt, folderId) => {
  const out = [];
  const steps = [];
  try {
    const token = await accessToken();
    async function walk(id, segments, depth) {
      if (depth > MAX_DEPTH || out.length >= MAX_FILES) return;
      const r = await driveGet('/files?' + form({
        q: "'" + q(id) + "' in parents and trashed = false",
        fields: 'files(id,name,mimeType,size)', pageSize: 200, orderBy: 'folder,name',
        supportsAllDrives: 'true', includeItemsFromAllDrives: 'true'
      }), token);
      for (const f of (r.files || [])) {
        if (f.mimeType === 'application/vnd.google-apps.folder') {
          await walk(f.id, segments.concat(f.name), depth + 1);
          continue;
        }
        // Les documents natifs Google (Sheets, Docs) n'ont pas de contenu
        // téléchargeable directement : il faut passer par l'export.
        const isSheet = f.mimeType === 'application/vnd.google-apps.spreadsheet';
        const isDoc = f.mimeType === 'application/vnd.google-apps.document';
        const isPlain = IMPORTABLE.test(f.name) || f.mimeType === 'text/csv' || f.mimeType === 'text/plain';
        if (!isSheet && !isDoc && !isPlain) continue;
        if (f.size && Number(f.size) > MAX_FILE) continue;

        let text = '';
        try {
          if (isSheet || isDoc) {
            const res = await driveGet('/files/' + encodeURIComponent(f.id) + '/export?' +
              form({ mimeType: isSheet ? 'text/csv' : 'text/plain' }), token, true);
            text = res.text;
          } else {
            const dl = await driveGet('/files/' + encodeURIComponent(f.id) + '?alt=media', token, true);
            text = dl.text;
          }
        } catch (e) {
          steps.push('« ' + f.name + ' » ignoré : ' + e.message);
          continue;
        }

        out.push({
          path: segments,
          name: f.name.replace(/\.[^.]+$/, ''),
          file: f.name + (isSheet ? ' (Sheets)' : isDoc ? ' (Docs)' : ''),
          size: Number(f.size || text.length),
          content: text
        });
      }
    }
    await walk(folderId, [], 1);
    steps.push(out.length + ' fichier(s) récupéré(s)');
    return { ok: true, files: out, steps };
  } catch (e) {
    return { ok: false, error: String(e.message || e), files: out, steps };
  }
});

/* ============================================================
   Emploi du temps — CELCAT
   ------------------------------------------------------------
   La page ne peut pas interroger l'extranet elle-même : le serveur
   n'envoie aucun en-tête CORS, donc le navigateur refuse la
   réponse. Le processus principal, lui, n'est pas un navigateur
   et passe sans difficulté. C'est ce qui permet à quelqu'un qui a
   seulement l'installateur — ni dépôt, ni Node — de mettre son
   emploi du temps à jour depuis l'application.
   ============================================================ */
const celcat = require('./celcat');

ipcMain.handle('edt:promos', async () => {
  try {
    const promos = await celcat.decouvrirPromotions();
    if (!promos.length) {
      return { ok: false, error: 'Aucune promotion d’orthoptie trouvée dans l’emploi du temps de l’université.' };
    }
    return { ok: true, promos, anneeUniversitaire: celcat.anneeUniversitaire().label };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  }
});

/* Un seul groupe par appel : c'est une trentaine de requêtes et environ
   35 Ko de données, inutile de rapatrier les trois promotions quand on
   n'en suit qu'une. */
ipcMain.handle('edt:fetch', async (_evt, promo) => {
  try {
    if (!promo || !promo.id) return { ok: false, error: 'Promotion non précisée.' };
    const groupe = await celcat.recupererPromotion(promo);
    if (!groupe.events.length) {
      return {
        ok: false,
        error: 'L’université ne publie aucune séance pour ' + groupe.label +
               ' cette année. Réessayez à la rentrée, ou choisissez une autre promotion.'
      };
    }
    return { ok: true, groupe };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  }
});

/* ==================================================================
   Fabriquer un exécutable depuis l'application elle-même
   ------------------------------------------------------------------
   « npm run dist:win » fait déjà le travail, mais suppose un terminal
   et un dépôt cloné. Depuis l'application lancée en développement, on
   peut proposer le même geste d'un bouton : electron-builder est déjà
   installé, on l'exécute comme un script Node grâce à
   ELECTRON_RUN_AS_NODE — plutôt que de dépendre d'un `node` ou d'un
   `npx` présents dans le PATH, ce qui n'est vrai nulle part.

   Trois garde-fous :
   · une application déjà empaquetée ne peut pas se reconstruire —
     electron-builder n'y est pas. On le dit, on n'échoue pas ;
   · on ne propose que les cibles de la plateforme courante : un .dmg
     ne se fabrique que sur macOS, et un .exe depuis un Mac réclame
     Wine. Mieux vaut ne pas proposer que promettre et rater ;
   · une seule fabrication à la fois, annulable — c'est un processus
     de plusieurs minutes qui télécharge parfois 100 Mo.
================================================================== */

const RACINE = __dirname;
const DOSSIER_SORTIE = path.join(RACINE, 'dist');
let fabrication = null;      // le processus en cours, ou null

/* On ne lance pas le CLI d'electron-builder directement mais notre lanceur :
   il rétablit le drapeau que yargs attend quand le CLI tourne sous Electron
   en mode Node (voir scripts/build-cli.js). */
function builderCli() {
  const lanceur = path.join(RACINE, 'scripts', 'build-cli.js');
  const cli = path.join(RACINE, 'node_modules', 'electron-builder', 'cli.js');
  return (fs.existsSync(lanceur) && fs.existsSync(cli)) ? lanceur : null;
}

function ciblesPossibles() {
  if (process.platform === 'win32') {
    return [
      { id: 'portable', ext: '.exe', label: 'Application portable',
        quoi: 'Un seul fichier .exe. Rien à installer : on le pose sur le Bureau, on double-clique, ça marche. C’est ce qui se partage le plus simplement.' },
      { id: 'nsis', ext: '.exe', label: 'Installateur',
        quoi: 'Un programme d’installation classique : il installe l’application, crée un raccourci et une entrée de désinstallation.' }
    ];
  }
  if (isMac) {
    return [
      { id: 'dmg', ext: '.dmg', label: 'Image disque',
        quoi: 'Le format d’installation habituel sur macOS : on ouvre l’image et on glisse l’application dans Applications.' },
      { id: 'zip', ext: '.zip', label: 'Archive',
        quoi: 'L’application compressée, à décompresser où l’on veut. Le plus simple à envoyer.' }
    ];
  }
  return [
    { id: 'AppImage', ext: '.AppImage', label: 'AppImage',
      quoi: 'Un fichier exécutable unique, indépendant de la distribution. On le rend exécutable et on le lance.' }
  ];
}

/* Ce qui vient d'être produit : on ne liste pas tout `dist/`, seulement
   les fichiers écrits depuis le début de la fabrication — sinon un vieil
   installateur d'il y a trois mois se présenterait comme neuf. */
function fichiersProduits(depuis) {
  if (!fs.existsSync(DOSSIER_SORTIE)) return [];
  const exts = /\.(exe|dmg|zip|AppImage|deb|rpm)$/i;
  return fs.readdirSync(DOSSIER_SORTIE)
    .filter((f) => exts.test(f))
    .map((f) => {
      const complet = path.join(DOSSIER_SORTIE, f);
      const st = fs.statSync(complet);
      return { nom: f, chemin: complet, octets: st.size, at: st.mtimeMs };
    })
    .filter((f) => f.at >= depuis - 5000)
    .sort((a, b) => b.at - a.at);
}

/* Un chemin venu de la page ne sert que s'il désigne vraiment un fichier
   produit : on ne laisse pas la fenêtre demander l'ouverture de n'importe
   quel emplacement du disque. */
function dansLaSortie(chemin) {
  if (!chemin) return false;
  const resolu = path.resolve(chemin);
  return resolu.startsWith(path.resolve(DOSSIER_SORTIE) + path.sep);
}

ipcMain.handle('build:etat', async () => ({
  possible: !app.isPackaged && !!builderCli(),
  empaquetee: app.isPackaged,
  builder: !!builderCli(),
  plateforme: process.platform,
  cibles: ciblesPossibles(),
  dossier: DOSSIER_SORTIE,
  bureau: app.getPath('desktop'),
  enCours: !!fabrication,
  dejaProduits: fichiersProduits(0).slice(0, 6)
}));

ipcMain.handle('build:lancer', async (_evt, cible) => {
  if (fabrication) return { ok: false, error: 'Une fabrication est déjà en cours.' };
  const cli = builderCli();
  if (app.isPackaged) {
    return { ok: false, error: 'L’application installée ne peut pas se reconstruire elle-même : il faut le dépôt et « npm install ».' };
  }
  if (!cli) {
    return { ok: false, error: 'electron-builder est introuvable dans node_modules. Lancez « npm install ».' };
  }
  if (!ciblesPossibles().some((c) => c.id === cible)) {
    return { ok: false, error: 'Cible inconnue sur cette plateforme.' };
  }

  const drapeau = process.platform === 'win32' ? '--win' : isMac ? '--mac' : '--linux';
  const args = [cli, drapeau, cible];

  /* Sous Windows, la signature réclame le paquet « winCodeSign », dont
     l'archive contient des liens symboliques : sans droits administrateur
     ni mode développeur, son extraction échoue et la fabrication s'arrête.
     Comme l'application n'est de toute façon pas signée, on désactive la
     signature et la retouche de l'exécutable — au prix de l'icône par
     défaut d'Electron, ce que la page annonce. */
  if (process.platform === 'win32') args.push('-c.win.signAndEditExecutable=false');

  const debut = Date.now();

  return new Promise((resolve) => {
    const { spawn } = require('child_process');
    const enfant = spawn(process.execPath, args, {
      cwd: RACINE,
      env: Object.assign({}, process.env, {
        /* le binaire Electron devient un Node ordinaire : c'est ce qui
           permet de lancer le CLI sans supposer un `node` dans le PATH */
        ELECTRON_RUN_AS_NODE: '1',
        /* sans cela, le fs d'Electron intercepte les chemins « .asar » et
           refuse d'écrire l'archive que le CLI est justement en train de créer */
        ELECTRON_NO_ASAR: '1',
        FORCE_COLOR: '0'
      })
    });
    fabrication = enfant;
    send('build:log', '→ electron-builder ' + drapeau + ' ' + cible);

    function flux(buf) {
      String(buf).split(/\r?\n/).forEach((l) => {
        const ligne = l.replace(/\[[0-9;]*m/g, '').trimEnd();
        if (ligne.trim()) send('build:log', ligne);
      });
    }
    enfant.stdout.on('data', flux);
    enfant.stderr.on('data', flux);

    enfant.on('error', (e) => {
      fabrication = null;
      resolve({ ok: false, error: String(e.message || e) });
    });
    enfant.on('close', (code, signal) => {
      const annule = fabrication === null;   // annuler() a déjà relâché la place
      fabrication = null;
      if (annule || signal) return resolve({ ok: false, annule: true });
      if (code !== 0) {
        return resolve({ ok: false, code: code,
          error: 'electron-builder s’est arrêté avec le code ' + code + '. Le journal ci-dessous dit pourquoi.' });
      }
      resolve({
        ok: true,
        fichiers: fichiersProduits(debut),
        dossier: DOSSIER_SORTIE,
        secondes: Math.round((Date.now() - debut) / 1000)
      });
    });
  });
});

ipcMain.handle('build:annuler', async () => {
  if (!fabrication) return { ok: false };
  const proc = fabrication;
  fabrication = null;
  /* electron-builder lance des outils enfants (7z, NSIS) : sous Windows,
     tuer le seul processus parent les laisserait tourner. */
  if (process.platform === 'win32') {
    try { require('child_process').spawn('taskkill', ['/pid', String(proc.pid), '/T', '/F']); }
    catch (e) { proc.kill(); }
  } else {
    proc.kill();
  }
  send('build:log', '⨯ Fabrication interrompue.');
  return { ok: true };
});

ipcMain.handle('build:ouvrir', async (_evt, chemin) => {
  if (chemin && dansLaSortie(chemin)) { shell.showItemInFolder(chemin); return { ok: true }; }
  if (!fs.existsSync(DOSSIER_SORTIE)) return { ok: false, error: 'Le dossier dist n’existe pas encore.' };
  shell.openPath(DOSSIER_SORTIE);
  return { ok: true };
});

/* « Le mettre sur mon Bureau » : la demande la plus fréquente, et celle
   qu'on ne devrait pas avoir à faire à la main dans l'explorateur. */
ipcMain.handle('build:bureau', async (_evt, chemin) => {
  if (!dansLaSortie(chemin) || !fs.existsSync(chemin)) {
    return { ok: false, error: 'Fichier introuvable.' };
  }
  const cible = path.join(app.getPath('desktop'), path.basename(chemin));
  try {
    fs.copyFileSync(chemin, cible);
    shell.showItemInFolder(cible);
    return { ok: true, path: cible };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  }
});

app.whenReady().then(() => {
  createWindow();
  buildMenu();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});
