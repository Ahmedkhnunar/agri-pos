const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Menu actions
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', callback);
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },

  // Platform info
  platform: process.platform,
  
  // App info
  appVersion: process.env.npm_package_version || '1.0.0',
  
  // Window controls (if needed)
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  
  // File operations (if needed for future features)
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  loadData: () => ipcRenderer.invoke('load-data'),
  
  // Print functionality (for receipts)
  print: (data) => ipcRenderer.invoke('print-receipt', data),
  
  // Notification
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', { title, body })
});

// Log that preload script has loaded
console.log('Electron preload script loaded successfully');
