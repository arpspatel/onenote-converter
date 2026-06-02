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
    "noEmit": true
  }
}
`;

const FALLBACK_PACKAGE_JSON = `{
  "name": "note2pdf-desktop-workspace",
  "private": true,
  "version": "1.0.0",
  "author": "Arpit Patel, Neebu LLC",
  "description": "Note2PDF Converter - Standalone high-fidelity Note to PDF Watermark-Free Converter",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && ncc build server.ts -o dist --minify -e vite",
    "start": "node dist/index.js",
    "clean": "node -e \\\"const fs = require('fs'); ['dist', 'dist-desktop', 'server.js'].forEach(p => fs.rmSync(p, { recursive: true, force: true }))\\\"",
    "lint": "tsc --noEmit"
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
    "@vercel/ncc": "^0.38.1",
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
echo [2/3] Opening your default browser...
start http://localhost:3000

echo.
echo [3/3] Starting localized Note2PDF compilation server...
call npm run dev

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

echo "[1/3] Restoring local workspace libraries..."
npm install

echo ""
echo "[2/3] Opening your default web browser..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  open "http://localhost:3000"
else
  xdg-open "http://localhost:3000" 2>/dev/null || echo "Please open http://localhost:3000 manually in your browser."
fi

echo ""
echo "[3/3] Starting localized Note2PDF compilation server..."
npm run dev

echo ""
echo "======================================================================="
`;

const PORTABLE_README = `# Note2PDF Localhost Server Workspace

Welcome to the standalone, offline-capable package of your **Note2PDF Watermark-Free Converter App**. This bundle is configured to run server-side locally on your own computer with full Gemini intelligence!

---

## 🚀 Speed-Start: Running Offline Locally on localhost

No installation or cloud container mapping is required! To run the app as a local desktop service, double-click the included automation launcher:

- **Windows**: Double-click \`start-local-app.bat\`
- **macOS / Linux**: Run \`./start-local-app.sh\` (execute \`chmod +x start-local-app.sh\` in terminal first, if needed)

This automatically installs local workspace packages, starts the lightweight Express streaming connection, and loads the application dashboard inside your default web browser frame at **\`http://localhost:3000\`**.

---

## 🛠️ Manual CLI Launch

If you prefer to load it manually from your own shell:
1. Ensure Node.js (LTS Version 18+) is installed.
2. Run \`npm install\` to restore modules.
3. Run \`npm run dev\` to boot up the environment.
4. Navigate to \`http://localhost:3000\` inside any modern browser.

---

## 🧠 Optional: Activating Gemini Intelligence
By default, the offline standalone application uses the built-in **Native Binary Stream Parser**, which translates notebook sections to PDFs inside your browser. 

To activate the smart **Google Gemini AI Compiler** in your desktop workspace:
1. Locate the file named \`.env\` in this extracted folder.
2. Set your credential:
   \`\`\`env
   GEMINI_API_KEY=your_actual_api_key_here
   \`\`\`
3. Startup or refresh your local app. The server will pick up this local variable and run Google Gemini intelligence locally!
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
  zip.file('start-local-app.bat', WINDOWS_LAUNCHER);
  zip.file('start-local-app.sh', UNIX_LAUNCHER);
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
