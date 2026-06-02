/**
 * Note2PDF Standalone Electron Shell Launcher
 * Controls local background Express conversion stream servers and chromium display ports.
 */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let backendProcess = null;
let mainWindow = null;

function runBackendProcess() {
  const binaryServerPath = path.join(__dirname, 'dist', 'server.cjs');
  
  // Bind to PORT 3000
  backendProcess = fork(binaryServerPath, [], {
    env: { ...process.env, NODE_ENV: 'production', PORT: '3000' }
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to spin background Express stream server:', err);
  });

  // Delay browser container mapping until local endpoints are bound
  setTimeout(spawnElectronWindow, 2000);
}

function spawnElectronWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: "Note2PDF Watermark-Free Converter",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    backgroundColor: '#0A0A0B',
    autoHideMenuBar: true
  });

  // Map local Express workspace pipeline port
  mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  runBackendProcess();
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    spawnElectronWindow();
  }
});
