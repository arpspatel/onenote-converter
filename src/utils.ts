/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import JSZip from 'jszip';

/**
 * Robust string templates as fallbacks for code files in case they are not fetchable in production.
 */
const FALLBACK_VITE_CONFIG = `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
  };
});
`;

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
  "name": "note2pdf-portable-workspace",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "clean": "rm -rf dist server.js"
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
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2"
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
echo [3/3] Opening your local converter interface dashboard web port...
start http://localhost:3000

echo.
echo 🚀 Sparking local NodeJS pipeline server! Maintain this command terminal open.
echo To terminate development container, press Ctrl+C inside this block.
echo =======================================================================
call npm run start
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
echo "[3/3] Opening your local converter interface dashboard web port..."
if command -v open &> /dev/null; then
  open "http://localhost:3000"
elif command -v xdg-open &> /dev/null; then
  xdg-open "http://localhost:3000"
else
  echo " 👉 Please open your browser and navigate to: http://localhost:3000"
fi

echo ""
echo "🚀 Sparking local NodeJS pipeline server! Maintain this command terminal open."
echo "To terminate development container, press Ctrl+C inside this block."
echo "======================================================================="
npm run start
`;

const PORTABLE_README = `# Note2PDF Desktop Portable Workspace (Standalone App)

Welcome to the standalone, self-contained desktop package of your **Note2PDF Watermark-Free Converter App**. You can run this application entirely on your local machine, offline or online, with zero limitations.

---

## 🛠️ Requirements

1. **Node.js (LTS Version 18, 20 or higher)**
   - Verify installation by opening a terminal/cmd and typing: \`node -v\`
   - If not installed, download the official LTS build from [https://nodejs.org/](https://nodejs.org/).

---

## 🚀 Quick Start (Single Click Launcher)

Inside this root folder, double-click the starter launcher corresponding to your operating system:

- **Windows**: Double-click \`start-portable-app.bat\`
- **macOS / Linux**: 
  1. Open a terminal prompt inside this extracted directory level.
  2. Grant runtime permission once: \`chmod +x start-portable-app.sh\`
  3. Execute directly: \`./start-portable-app.sh\`

The installer launcher automatically:
- Installs all local dependencies.
- Bundles fully-optimized static HTML web routes inside \`dist/\`.
- Packages the Express binary scanner pipelines.
- Spawns a local host port on **\`http://localhost:3000\`**.
- Auto-launches your local browser dashboard!

---

## 🧠 Optional: Activating Intelligent Gemini AI Engine Locally

By default, the offline standalone application uses the built-in **Native Binary Stream Parser Heuristics**, which perfectly translates pages, bulleted items, and checklist tasks and exports standard A4 vector PDFs inside your browser.

To activate the smart **Google Gemini AI Compiler** locally:

1. Obtain a free or pay-as-you-go Gemini API Key from Google AI Studio.
2. Locate the file named \`.env\` in this root folder (or duplicate \`.env.example\` and rename it to \`.env\`).
3. Set your credential:
   \`\`\`env
   GEMINI_API_KEY=your_actual_api_key_here
   \`\`\`
4. Restart your application. The local Node.js Express server will automatically detect the key, and convert with Gemini-guided structure layouts!

---

## 📂 Source Code & Modular Extension
This zip represents a highly-optimized fullstack React + Express boilerplate codebase. Feel free to modify, integrate more styles, or change features in:
- \`server.ts\` (Binary stream parser, express routing, Gemini proxy)
- \`src/App.tsx\` (Frontend drag-and-drop dashboard portal)
- \`src/pdfGenerator.ts\` (Custom page margins and PDF templates)
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
