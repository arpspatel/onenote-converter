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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans select-none antialiased">
      {/* Upper Navigation / Title Hub */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-sm font-semibold text-slate-900 tracking-tight leading-none">
                  OneNote to PDF Java Script Generator
                </h1>
                <p className="text-[10px] text-slate-500 font-medium mt-1">
                  Automate Microsoft .one layouts to PDF files with zero dependencies locally
                </p>
              </div>
            </div>

            {/* Main ZIP Download */}
            <button
              id="btn-download-project-zip"
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-sans text-xs font-semibold text-white transition-all shadow-sm ${
                isDownloading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 cursor-pointer hover:shadow active:scale-95'
              }`}
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin border-2 border-white border-t-transparent rounded-full h-3 w-3"></div>
                  <span>Generating ZIP...</span>
                </>
              ) : (
                <>
                  <Download className="h-4.5 w-4.5" />
                  <span>Download Project .ZIP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner with helpful hints */}
        {downloadSuccessMessage && (
          <div className="mb-6 bg-indigo-50 border border-indigo-150 rounded-xl p-4 flex items-center space-x-3 text-indigo-700 animate-slide-down">
            <FileCheck className="h-5 w-5 text-indigo-500 shrink-0" />
            <div className="text-xs font-medium">
              {downloadSuccessMessage} <span className="text-indigo-500 font-normal">Extract the file, open your terminal, and run standard commands.</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE - Inputs & Configurations and FAQs */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-indigo-50/40 p-4 border border-indigo-100 rounded-xl flex items-start space-x-3 text-slate-600">
              <Archive className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-indigo-850">Quickstart Instruction Boilerplate</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Customize your script options in the form below. The generator automatically produces the correct Java source, Maven <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">pom.xml</code>, Gradle buildfiles, and simple bash scripts to execute locally.
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
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 text-center space-y-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Ready to deploy?</span>
              <p className="text-xs text-slate-500 leading-normal px-2">
                This bundler exports a complete ready-to-import boilerplate package. You don't need to configure repositories, lookup complex dependency jars, or write setup paths from scratch.
              </p>
              <button
                id="btn-footer-download-zip"
                onClick={handleDownloadZip}
                className="w-full inline-flex justify-center items-center space-x-2 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-all"
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
            <div className="bg-amber-50/40 rounded-xl p-4 border border-amber-100 flex items-start space-x-3 text-amber-900">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-850">Evaluation Mode Limits</h4>
                <p className="text-[11px] text-slate-600 leading-normal">
                  The binary packages default to using the public trial bundle. Output pages contain evaluation warning bars at the top. For production deployments, purchase or acquire a standard license key from Aspose and register it via the API on boot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Humble page footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-center text-slate-400 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 select-text">
          <p>© 2026 OneNote-to-PDF Automation Engine. Built for quick-compilations with Java 11/17 and Aspose.Note wrappers.</p>
        </div>
      </footer>
    </div>
  );
}
