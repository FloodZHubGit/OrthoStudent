'use strict';

const { contextBridge, ipcRenderer } = require('electron');

/* Liste blanche des messages que le menu peut adresser à la page. Un canal
   oublié ici n'échoue pas : il est simplement ignoré, et l'entrée de menu
   correspondante ne fait rien — c'était le cas de « Précédent » / « Suivant ». */
const channels = ['menu:export', 'menu:import', 'menu:reset', 'menu:theme',
  'menu:goto', 'menu:search', 'menu:back', 'menu:forward',
  /* le journal de fabrication arrive ligne par ligne, plusieurs minutes durant */
  'build:log',
  /* la réponse du modèle local arrive mot à mot */
  'ia:flux',
  /* l'import Anki avance paquet par paquet */
  'anki:progres'];

contextBridge.exposeInMainWorld('ortho', {
  exportData: (json) => ipcRenderer.invoke('data:export', json),
  importData: () => ipcRenderer.invoke('data:import'),
  ankiExportFile: (payload) => ipcRenderer.invoke('anki:exportFile', payload),
  /* Anki, en LECTURE SEULE : l'état de l'extension, et les cartes.
     Les appels d'écriture — anki:send, anki:fields — ont été retirés :
     l'application ne crée plus de paquet et n'écrit plus de note. */
  ankiEtat: () => ipcRenderer.invoke('anki:etat'),
  ankiCartes: (d) => ipcRenderer.invoke('anki:cartes', d),
  /* fabrication d'un exécutable depuis l'application en développement */
  buildEtat: () => ipcRenderer.invoke('build:etat'),
  buildLancer: (cible) => ipcRenderer.invoke('build:lancer', cible),
  buildAnnuler: () => ipcRenderer.invoke('build:annuler'),
  buildOuvrir: (chemin) => ipcRenderer.invoke('build:ouvrir', chemin),
  buildBureau: (chemin) => ipcRenderer.invoke('build:bureau', chemin),
  /* modèle de langue local (Ollama), appelé depuis le processus principal
     pour n'ouvrir ni la CSP de la page ni les origines d'Ollama */
  iaEtat: () => ipcRenderer.invoke('ia:etat'),
  iaDemande: (d) => ipcRenderer.invoke('ia:demande', d),
  iaStop: () => ipcRenderer.invoke('ia:stop'),
  edtPromos: () => ipcRenderer.invoke('edt:promos'),
  edtFetch: (promo) => ipcRenderer.invoke('edt:fetch', promo),
  pickFolder: () => ipcRenderer.invoke('folder:pick'),
  driveStatus: () => ipcRenderer.invoke('gdrive:status'),
  driveConnect: (cfg) => ipcRenderer.invoke('gdrive:connect', cfg),
  driveDisconnect: () => ipcRenderer.invoke('gdrive:disconnect'),
  driveChildren: (id) => ipcRenderer.invoke('gdrive:children', id),
  driveTree: (id) => ipcRenderer.invoke('gdrive:tree', id),
  on: (channel, handler) => {
    if (!channels.includes(channel)) return;
    ipcRenderer.on(channel, (_evt, payload) => handler(payload));
  }
});
