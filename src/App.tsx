/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, BookOpen, FileCheck, HelpCircle, Archive, AlertCircle, Shield } from 'lucide-react';
import { ConverterConfig } from './types';
import { buildProjectZip } from './utils';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { CodeDisplay } from './components/CodeDisplay';
import { TerminalSimulator } from './components/TerminalSimulator';
import { FaqSection } from './components/FaqSection';

const DEFAULT_CONFIG: ConverterConfig = {
  buildTool: 'maven',
  asposeVersion: '24.12',
  jdkVersion: '17',
  inputFileName: 'AcademicNotes.one',
  outputFileName: 'ConvertedNotes.pdf',
  saveLayout: 'standard',
  pageWidth: 612,  // 8.5" A4/Letter size
  pageHeight: 792, // 11"
  pdfCompliance: 'None',
  jpegQuality: 90,
  fontFolder: '',
  pageRange: '',
  isPasswordProtected: false,
  passwordValue: '',
};

export default function App() {
  const [config, setConfig] = useState<ConverterConfig>(DEFAULT_CONFIG);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const handleResetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    setDownloadSuccessMessage(null);
    try {
      const zipBlob = await buildProjectZip(config);
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `onenote-to-pdf-java-${config.buildTool}-project.zip`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setDownloadSuccessMessage(`Successfully compiled "${config.buildTool}" bundle! Check your downloads.`);
      setTimeout(() => setDownloadSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Failed compiling downloadable ZIP files:', err);
      alert('Error bundling files: ' + err?.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-neutral-300 font-sans select-none antialiased">
      {/* Upper Navigation / Title Hub */}
      <header className="bg-[#0E0E10] border-b border-neutral-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-sm font-semibold text-white tracking-tight leading-none uppercase">
                  Note2PDF Generator <span className="text-neutral-500 font-normal normal-case">v1.2.0</span>
                </h1>
                <p className="text-[10px] text-neutral-500 font-medium mt-1">
                  Automate Microsoft .one layouts to PDF files with zero dependencies locally
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <span className="hidden sm:flex items-center text-[11px] font-semibold text-emerald-500 tracking-wider uppercase bg-emerald-500/5 px-2.5 py-1 rounded border border-emerald-500/15">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                Aspose.Note Engine Active
              </span>

              {/* Main ZIP Download */}
              <button
                id="btn-download-project-zip"
                onClick={handleDownloadZip}
                disabled={isDownloading}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-sans text-xs font-bold transition-all ${
                  isDownloading
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50'
                    : 'bg-white text-black hover:bg-neutral-200 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95'
                }`}
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin border-2 border-neutral-500 border-t-transparent rounded-full h-3 w-3"></div>
                    <span>Bundling...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download Project .ZIP</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner with helpful hints */}
        {downloadSuccessMessage && (
          <div className="mb-6 bg-indigo-950/40 border border-indigo-500/25 rounded-xl p-4 flex items-center space-x-3 text-indigo-200 animate-slide-down">
            <FileCheck className="h-5 w-5 text-indigo-400 shrink-0" />
            <div className="text-xs font-medium">
              {downloadSuccessMessage} <span className="text-indigo-400/70 font-normal">Extract the zip bundle, navigate inside, and execute with terminal instructions!</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE - Inputs & Configurations and FAQs */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#0E0E10] p-5 border border-neutral-800 rounded-xl flex items-start space-x-3 text-neutral-300 shadow-xl">
              <Archive className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Quickstart Instruction Boilerplate</h4>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  Customize your script options inside the configuration matrix. The generator automatically outcomes a compiled setup containing Java sources, Maven/Gradle manifests, and fast executor tools.
                </p>
              </div>
            </div>

            {/* Input Knobs Controls Panel */}
            <ConfigurationPanel
              config={config}
              onChange={setConfig}
              onReset={handleResetConfig}
            />

            {/* Quick action helper bottom panel */}
            <div className="bg-[#0E0E10] rounded-xl border border-neutral-800 shadow-xl p-6 text-center space-y-3.5">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest block">Ready to deploy?</span>
              <p className="text-xs text-neutral-400 leading-normal px-2">
                This utility aggregates a boilerplate Java project. You don't need manual repository lookups or complex classpath configurations.
              </p>
              <button
                id="btn-footer-download-zip"
                onClick={handleDownloadZip}
                className="w-full inline-flex justify-center items-center space-x-2 py-2.5 text-xs font-bold text-neutral-200 hover:text-white bg-[#16161A] hover:bg-[#1C1C22] border border-neutral-850 hover:border-neutral-700 rounded-lg cursor-pointer transition-all active:scale-95 shadow-inner"
              >
                <Download className="h-4 w-4" />
                <span>Download configured {config.buildTool.toUpperCase()} build</span>
              </button>
            </div>

            {/* Document Conversion FAQ collapse blocks */}
            <FaqSection />
          </div>

          {/* RIGHT SIDE - Source Code Files Viewer and Interactive execution Simulator */}
          <div className="lg:col-span-7 space-y-8 sticky top-24">
            {/* Visual Code Tabs section */}
            <div className="h-[430px]">
              <CodeDisplay config={config} />
            </div>

            {/* Live sandbox logs simulator */}
            <TerminalSimulator config={config} />

            {/* Extra Developer Quick Hints */}
            <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/20 flex items-start space-x-3 text-amber-200/90 shadow-lg">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">Evaluation Mode Limits</h4>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  Our script uses default trial bundles. Output PDFs include an active Aspose valuation banner. To unlock full features, supply a licensed resource inside the Java classpath.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Humble page footer */}
      <footer className="bg-[#0E0E10] border-t border-neutral-800 mt-16 py-8 text-center text-neutral-550 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 select-text">
          <p>© 2026 Note2PDF Automation Script Platform. Built with Java Target Runtime 17 and Aspose APIs.</p>
        </div>
      </footer>
    </div>
  );
}
