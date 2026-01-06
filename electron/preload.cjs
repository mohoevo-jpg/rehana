const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // General IPC
  send: (channel, data) => {
    let validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  
  // App Version & Updates
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getUpdateStatus: () => ipcRenderer.invoke('get-update-status'),
  checkForUpdate: (url) => ipcRenderer.invoke('check-for-update', url),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),
  
  // Update Listeners
  onUpdateStatus: (callback) => {
    const subscription = (event, ...args) => callback(...args);
    ipcRenderer.on('update_status', subscription);
    // Return a cleanup function if needed, but we also provide explicit remove
  },
  onDownloadProgress: (callback) => {
    const subscription = (event, ...args) => callback(...args);
    ipcRenderer.on('download_progress', subscription);
  },
  removeUpdateListeners: () => {
    ipcRenderer.removeAllListeners('update_status');
    ipcRenderer.removeAllListeners('download_progress');
  },

  // Server Control
  server: {
    getInfo: () => ipcRenderer.invoke('server-get-info'),
    start: () => ipcRenderer.invoke('server-start'),
    stop: () => ipcRenderer.invoke('server-stop'),
    openExternal: (url) => ipcRenderer.invoke('open-external', url),
    onLog: (callback) => {
        const subscription = (event, ...args) => callback(...args);
        ipcRenderer.on('server-log', subscription);
        return () => ipcRenderer.removeListener('server-log', subscription);
    },
    onStatusChanged: (callback) => {
        const subscription = (event, ...args) => callback(...args);
        ipcRenderer.on('server-status-changed', subscription);
        return () => ipcRenderer.removeListener('server-status-changed', subscription);
    }
  }
});
