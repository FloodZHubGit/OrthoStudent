'use strict';

const { contextBridge, ipcRenderer } = require('electron');

const channels = ['menu:export', 'menu:import', 'menu:reset', 'menu:theme', 'menu:goto', 'menu:search'];

contextBridge.exposeInMainWorld('ortho', {
  exportData: (json) => ipcRenderer.invoke('data:export', json),
  importData: () => ipcRenderer.invoke('data:import'),
  appInfo: () => ipcRenderer.invoke('app:info'),
  ankiExportFile: (payload) => ipcRenderer.invoke('anki:exportFile', payload),
  ankiInspect: (opts) => ipcRenderer.invoke('anki:inspect', opts),
  ankiFields: (modelName) => ipcRenderer.invoke('anki:fields', modelName),
  ankiSend: (payload) => ipcRenderer.invoke('anki:send', payload),
  pickFolder: () => ipcRenderer.invoke('folder:pick'),
  driveStatus: () => ipcRenderer.invoke('gdrive:status'),
  driveConnect: (cfg) => ipcRenderer.invoke('gdrive:connect', cfg),
  driveDisconnect: () => ipcRenderer.invoke('gdrive:disconnect'),
  driveChildren: (id) => ipcRenderer.invoke('gdrive:children', id),
  driveFindFolder: (name) => ipcRenderer.invoke('gdrive:findFolder', name),
  driveTree: (id) => ipcRenderer.invoke('gdrive:tree', id),
  on: (channel, handler) => {
    if (!channels.includes(channel)) return;
    ipcRenderer.on(channel, (_evt, payload) => handler(payload));
  }
});
