/**
 * Note2PDF Standalone Electron Shell Launcher
 * Controls local background Express conversion stream servers and chromium display ports.
 */
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Run the Express backend directly in the main Electron thread to prevent orphaned processes or locks
process.env.NODE_ENV = 'production';
process.env.PORT = '3000';

try {
  require('./dist/server.cjs');
} catch (err) {
  console.error('Failed to initialize embedded Express conversion server:', err);
}

let mainWindow = null;

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
  // Graceful boot delay for clean Express binding
  setTimeout(spawnElectronWindow, 1000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    spawnElectronWindow();
  }
});
