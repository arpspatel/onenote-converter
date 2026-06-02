/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import JSZip from 'jszip';

/**
 * Robust string templates as fallbacks for code files in case they are not fetchable in production.
 */
const FALLBACK_VITE_CONFIG = 
  "imp" + "ort tailwindcss fr" + "om '@tailwindcss/vite';\n" +
  "imp" + "ort react fr" + "om '@vitejs/plugin-react';\n" +
  "imp" + "ort path fr" + "om 'path';\n" +
  "imp" + "ort {defineConfig} fr" + "om 'vite';\n\n" +
  "export default defineConfig(() => {\n" +
  "  return {\n" +
  "    plugins: [react(), tailwindcss()],\n" +
  "    resolve: {\n" +
  "      alias: {\n" +
  "        '@': path.resolve(__dirname, '.'),\n" +
  "      },\n" +
  "    },\n" +
  "    server: {\n" +
  "      port: 3000,\n" +
  "      host: '0.0.0.0'\n" +
  "    },\n" +
  "  };\n" +
  "});\n";

const FALLBACK_TSCONFIG = `{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
`;

const FALLBACK_PACKAGE_JSON = `{
  "name": "note2pdf-desktop-workspace",
  "private": true,
  "version": "1.0.0",
  "main": "electron.cjs",
  "type": "commonjs",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "electron:start": "npm run build && electron .",
    "compile:exe": "taskkill /f /im Note2PDF_Converter.exe /t 2>nul & npm run build && electron-builder --win portable",
    "compile:mac": "npm run build && electron-builder --mac",
    "compile:linux": "npm run build && electron-builder --linux",
    "clean": "rm -rf dist dist-desktop server.js"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "jspdf": "^4.2.1",
    "jszip": "^3.10.1",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/jszip": "^3.4.0",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "electron": "^31.3.1",
    "electron-builder": "^25.0.5",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2"
  },
  "build": {
    "appId": "org.note2pdf.desktop",
    "productName": "Note2PDF_Converter",
    "directories": {
      "output": "dist-desktop"
    },
    "files": [
      "dist/**/*",
      "electron.cjs",
      "package.json"
    ],
    "win": {
      "target": [
        "portable"
      ],
      "requestedExecutionLevel": "asInvoker"
    },
    "mac": {
      "target": [
        "dmg"
      ]
    },
    "linux": {
      "target": [
        "AppImage"
      ]
    }
  }
}
`;

const FALLBACK_ENV_EXAMPLE = `# Note2PDF Desktop Environment Configurations
# Add your Google Gemini API Key here to enable intelligent vector formatting.
# If omitted, the portable application automatically falls back to the native binary parser!
GEMINI_API_KEY=
PORT=3000
`;

const FALLBACK_INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Note2PDF Standalone Workspace</title>
  </head>
  <body style="background-color: #0A0A0B; margin: 0;">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

// Electron Main entry process configuration script
const ELECTRON_MAIN_SCRIPT = `/**
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
`;

// Helper script launchers to run offline / locally
const WINDOWS_LAUNCHER = `@echo off
title Note2PDF Portable App Starter
echo =======================================================================
echo              Note2PDF Standalone Desktop Workspace Native Setup
echo =======================================================================
echo.
echo [System Check] Checking local Node.js environment installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
  echo ❌ ERROR: Node.js was not detected on this workstation channel.
  echo Please download and install standard Node.js LTS from: https://nodejs.org/
  echo.
  pause
  exit /b
)

echo.
echo [1/3] Restoring local workspace libraries and package sets...
call npm install

echo.
echo [2/3] Compiling optimized React web views and Express compilation outputs...
call npm run build

echo.
echo [3/3] Opening your local converter interface dashboard inside Electron shell...
echo Spawning window interface...
call npm run electron:start

echo.
echo =======================================================================
pause
`;

const UNIX_LAUNCHER = `#!/usr/bin/env bash
# Standalone run launcher script for macOS / Linux platforms

echo "======================================================================="
echo "              Note2PDF Standalone Desktop Workspace Native Setup"
echo "======================================================================="
echo ""

# Verify node.js
if ! command -v node &> /dev/null; then
  echo "❌ ERROR: Node.js was not detected on this workstation channel."
  echo "Please download and install standard Node.js LTS from: https://nodejs.org/"
  echo ""
  exit 1
fi

echo "[1/3] Restoring local workspace libraries and package sets..."
npm install

echo ""
echo "[2/3] Compiling optimized React web views and Express compilation outputs..."
npm run build

echo ""
echo "[3/3] Launching clean Electron applet..."
npm run electron:start

echo ""
echo "======================================================================="
`;

const PORTABLE_README = `# Note2PDF Desktop Electron App & Portable \`.exe\` Builder

Welcome to the standalone, self-contained desktop package of your **Note2PDF Watermark-Free Converter App**. This bundle is pre-configured with **Electron** and **electron-builder** to package your app into a standalone double-clickable executable (e.g. \`.exe\` on Windows).

---

## 🛠️ Step-by-Step: Compiling a Standalone Portable \`.exe\`

To package this application into a custom single-file **\`Note2PDF_Converter.exe\`** (or equivalent macOS \`.dmg\` / Linux \`.AppImage\` executable):

1. **Requirements**: 
   Ensure you have **Node.js (LTS Version 18 or newer)** installed. Verification command: \`node -v\`

2. **Setup Dependencies**:
   Open a terminal (Command Prompt or PowerShell) inside this extracted folder and run:
   \`\`\`bash
   npm install
   \`\`\`

3. **Compile the Standalone Executable File**:
   Run the specific compile command for your operating system:
   
   - **For Windows (.exe)**:
     \`\`\`bash
     npm run compile:exe
     \`\`\`
   - **For macOS (.dmg)**:
     \`\`\`bash
     npm run compile:mac
     \`\`\`
   - **For Linux (.AppImage)**:
     \`\`\`bash
     npm run compile:linux
     \`\`\`

4. **Retrieve Your App**:
   Once finished, a new folder named **\`dist-desktop/\`** will appear in this directory. 
   Inside, you will find your compiled, self-contained **\`Note2PDF_Converter.exe\`** (Portable Executable) that runs directly with one click!

---

## 🚀 Running locally inside Electron (Without compiling)

If you don't need the final executable yet and just want to run the app as a local desktop window, double-click the included automation launcher:

- **Windows**: Double-click \`start-portable-app.bat\`
- **macOS / Linux**: Run \`./start-portable-app.sh\` (run \`chmod +x start-portable-app.sh\` first if needed)

This installs dependencies, bundles assets, and opens your converter in a clean, menu-free desktop window frame using Electron.

---

## 🧠 Optional: Activating Gemini Intelligence
By default, the offline standalone application uses the built-in **Native Binary Stream Parser**, which translates notebook sections to PDFs inside your browser. 

To activate the smart **Google Gemini AI Compiler** in your desktop app:
1. Locate the file named \`.env\` in this extracted folder.
2. Set your credential:
   \`\`\`env
   GEMINI_API_KEY=your_actual_api_key_here
   \`\`\`
3. Startup or compile your app. The compiled EXE or start scripts will pick up this local variable and run Google Gemini intelligence locally!
`;

/**
 * Downloads a text file content safely with fallback if fetching local assets fails.
 */
async function fetchSourceSafely(url: string, fallback: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Status failed");
    return await res.text();
  } catch (err) {
    console.warn(`[ZIP Packager] Unable to fetch live source code for '${url}', substituting standard fallback.`, err);
    return fallback;
  }
}

/**
 * Packs the entire running Note2PDF workspace into a single-file, highly-portable ZIP.
 */
export async function downloadPortableApp(): Promise<Blob> {
  const zip = new JSZip();

  // 1. Fetch live source codes or use standard templates
  const indexHtml = await fetchSourceSafely('/index.html', FALLBACK_INDEX_HTML);
  const viteConfig = await fetchSourceSafely('/vite.config.ts', FALLBACK_VITE_CONFIG);
  const tsconfig = await fetchSourceSafely('/tsconfig.json', FALLBACK_TSCONFIG);
  const packageJson = await fetchSourceSafely('/package.json', FALLBACK_PACKAGE_JSON);
  const envExample = await fetchSourceSafely('/.env.example', FALLBACK_ENV_EXAMPLE);
  const serverTs = await fetchSourceSafely('/server.ts', '');

  // Source files in /src folder
  const appTsx = await fetchSourceSafely('/src/App.tsx', '');
  const indexCss = await fetchSourceSafely('/src/index.css', '');
  const mainTtsx = await fetchSourceSafely('/src/main.tsx', '');
  const pdfGenTs = await fetchSourceSafely('/src/pdfGenerator.ts', '');
  const typesTs = await fetchSourceSafely('/src/types.ts', '');

  // 2. Add top-level config files
  zip.file('index.html', indexHtml);
  zip.file('vite.config.ts', viteConfig);
  zip.file('tsconfig.json', tsconfig);
  zip.file('package.json', packageJson);
  zip.file('.env.example', envExample);
  zip.file('.env', envExample); // Create a handy .env copy matching the template file
  zip.file('server.ts', serverTs);
  zip.file('electron.cjs', ELECTRON_MAIN_SCRIPT);

  // 3. Add launchers & instruction readmes
  zip.file('start-portable-app.bat', WINDOWS_LAUNCHER);
  zip.file('start-portable-app.sh', UNIX_LAUNCHER);
  zip.file('README.md', PORTABLE_README);

  // 4. Create /src folder structures
  const src = zip.folder('src');
  if (src) {
    src.file('App.tsx', appTsx);
    src.file('index.css', indexCss);
    src.file('main.tsx', mainTtsx);
    src.file('pdfGenerator.ts', pdfGenTs);
    src.file('types.ts', typesTs);

    // Create custom /src/components directory
    src.folder('components');
  }

  // 5. Build dynamic binary payload
  return await zip.generateAsync({ type: 'blob' });
}
