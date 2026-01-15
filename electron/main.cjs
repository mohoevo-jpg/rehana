const { app, BrowserWindow, ipcMain, shell } = require('electron');
const os = require('os');
const child_process = require('child_process');
const path = require('path');
const { autoUpdater } = require('electron-updater');

// Disable security warnings
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let backendProcess = null;
let mainWindow = null;

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (i.e. 127.0.0.1) and non-ipv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

function stopBackendServer() {
  if (backendProcess) {
    try {
        if (process.platform === 'win32') {
            child_process.exec(`taskkill /pid ${backendProcess.pid} /T /F`);
        } else {
            backendProcess.kill();
        }
    } catch (e) {
        console.error('Error killing process:', e);
    }
    backendProcess = null;
    if (mainWindow) mainWindow.webContents.send('server-status-changed', 'stopped');
    return { success: true, message: 'Backend stopped' };
  }
  
  // Force cleanup port 3001 even if backendProcess is null (Zombie process handling)
  if (process.platform === 'win32') {
      try {
          child_process.exec('netstat -ano | findstr :3001', (err, stdout) => {
              if (stdout) {
                  const lines = stdout.split('\n');
                  lines.forEach(line => {
                      const parts = line.trim().split(/\s+/);
                      const pid = parts[parts.length - 1];
                      if (pid && !isNaN(pid) && pid !== '0') {
                          child_process.exec(`taskkill /pid ${pid} /F`);
                      }
                  });
              }
          });
      } catch (e) {
          console.error('Error cleaning up port 3001:', e);
      }
  }

  return { success: false, message: 'Backend not running (Cleaned up port)' };
}

async function startBackendServer() {
  // 1. Check if backend is already tracked
  if (backendProcess) {
    console.log('Backend already running');
    return { success: false, message: 'Backend already running' };
  }

  // 2. Pre-cleanup: Ensure port 3001 is free (Kill zombies)
  if (process.platform === 'win32') {
      await new Promise((resolve) => {
          child_process.exec('netstat -ano | findstr :3001', (err, stdout) => {
              if (stdout) {
                  const lines = stdout.trim().split('\n');
                  const pidsToKill = [];
                  lines.forEach(line => {
                      const parts = line.trim().split(/\s+/);
                      if (parts.length >= 5 && parts[1].includes(':3001')) {
                           const pid = parts[parts.length - 1];
                           if (pid && !isNaN(pid) && pid !== '0') pidsToKill.push(pid);
                      }
                  });
                  
                  if (pidsToKill.length > 0) {
                      console.log('Killing zombie processes on port 3001:', pidsToKill);
                      const killCmd = `taskkill /F ${pidsToKill.map(pid => `/PID ${pid}`).join(' ')}`;
                      child_process.exec(killCmd, () => setTimeout(resolve, 1000)); // Wait 1s for cleanup
                  } else {
                      resolve();
                  }
              } else {
                  resolve();
              }
          });
      });
  }

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  let serverScript;
  let cwd;

  if (isDev) {
    serverScript = path.join(__dirname, '../backend/server.js');
    cwd = path.join(__dirname, '../backend');
  } else {
    serverScript = path.join(process.resourcesPath, 'backend/server.js');
    cwd = path.join(process.resourcesPath, 'backend');
  }

  console.log('Starting backend from:', serverScript);

  try {
    backendProcess = child_process.fork(serverScript, [], {
      cwd: cwd,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      env: { 
        ...process.env,
        NODE_ENV: isDev ? 'development' : 'production'
      } 
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`[Backend]: ${data}`);
      if (mainWindow) mainWindow.webContents.send('server-log', data.toString());
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`[Backend Error]: ${data}`);
      if (mainWindow) mainWindow.webContents.send('server-log', `ERROR: ${data.toString()}`);
    });

    backendProcess.on('close', (code) => {
      console.log(`Backend process exited with code ${code}`);
      backendProcess = null;
      if (mainWindow) mainWindow.webContents.send('server-status-changed', 'stopped');
    });

    if (mainWindow) mainWindow.webContents.send('server-status-changed', 'running');
    return { success: true, message: 'Backend started' };

  } catch (error) {
    console.error('Failed to start backend:', error);
    return { success: false, message: error.message };
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    icon: path.join(__dirname, '../public/favicon.ico')
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  mainWindow.loadURL(startUrl);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  startBackendServer();
  
  // Update Handling
  autoUpdater.logger = console;
  autoUpdater.autoDownload = false; 
  
  // Set default feed URL if not set in package.json or to override
  // This ensures a valid URL is always present
  try {
      autoUpdater.setFeedURL({
        provider: 'generic',
        url: 'https://rehanaflowers.com/updates'
      });
  } catch (e) {
      console.log('Error setting default feed URL:', e);
  }

  // autoUpdater listeners are defined globally

  try {
      if (app.isPackaged) {
        autoUpdater.checkForUpdatesAndNotify();
      }
  } catch (e) {
      console.error('Failed to check for updates:', e);
  }
});

app.on('window-all-closed', function () {
  stopBackendServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
let updateStatus = 'pending';
let updateInfo = null;

ipcMain.handle('server-start', async () => {
  return await startBackendServer();
});

ipcMain.handle('server-stop', async () => {
  return stopBackendServer();
});

ipcMain.handle('server-get-info', () => {
    const ip = getLocalIp();
    return {
        ip: ip,
        backendUrl: `http://${ip}:3001`,
        cashierUrl: `http://${ip}:3001`,
        mobileUrl: `http://${ip}:3001/mobile`,
        status: backendProcess ? 'running' : 'stopped'
    };
});

ipcMain.handle('open-external', async (event, url) => {
    if (url && (url.startsWith('http') || url.startsWith('https'))) {
        try {
            await shell.openExternal(url);
        } catch (e) {
            console.error('Failed to open external url:', url, e);
        }
    }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-update-status', () => {
    return { status: updateStatus, info: updateInfo };
});

ipcMain.handle('check-for-update', async (event, url) => {
    if (url) autoUpdater.setFeedURL(url);
    return await autoUpdater.checkForUpdates();
});

ipcMain.handle('download-update', async () => {
    return await autoUpdater.downloadUpdate();
});

ipcMain.handle('quit-and-install', () => {
    autoUpdater.quitAndInstall();
});

// --- AutoUpdater Events ---
autoUpdater.on('checking-for-update', () => {
    updateStatus = 'checking';
    if (mainWindow) mainWindow.webContents.send('update_status', 'checking');
});

autoUpdater.on('update-available', (info) => {
    updateStatus = 'available';
    updateInfo = info;
    if (mainWindow) mainWindow.webContents.send('update_status', 'available', info);
});

autoUpdater.on('update-not-available', (info) => {
    updateStatus = 'not-available';
    if (mainWindow) mainWindow.webContents.send('update_status', 'not-available', info);
});

autoUpdater.on('error', (err) => {
    updateStatus = 'error';
    console.error('AutoUpdater Error:', err);
    if (mainWindow) mainWindow.webContents.send('update_status', 'error', err.message);
});

autoUpdater.on('download-progress', (progressObj) => {
    updateStatus = 'downloading';
    if (mainWindow) mainWindow.webContents.send('download_progress', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
    updateStatus = 'downloaded';
    updateInfo = info;
    if (mainWindow) mainWindow.webContents.send('update_status', 'downloaded', info);
});
