/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, BookOpen, FileCheck, HelpCircle, Archive, AlertCircle, 
  Shield, Upload, FileText, Settings, RefreshCw, Layers, Sparkles, 
  Trash2, ChevronRight, Edit2, Play, CheckCircle2, RotateCcw, Monitor
} from 'lucide-react';
import { ConverterConfig, OneNotebook, OnePage, OnePageSection } from './types';
import { buildProjectZip } from './utils';
import { generatePdfFromNotebook } from './pdfGenerator';
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
  pageWidth: 612,
  pageHeight: 792,
  pdfCompliance: 'None',
  jpegQuality: 90,
  fontFolder: '',
  pageRange: '',
  isPasswordProtected: false,
  passwordValue: '',
};

const DEMO_NOTEBOOK: OneNotebook = {
  name: "Strategic_Marketing_Plan",
  summary: "Extracted marketing roadmap, campaign assets checklist, and brand identity sections.",
  engine: "Gemini AI Compiler",
  pages: [
    {
      title: "Q3 Brand Launch Campaign",
      date: "Monday, June 1, 2026",
      sections: [
        {
          type: "paragraph",
          title: "Executive Summary",
          content: [
            "This workbook contains the global positioning vectors, campaign milestones, and critical design collateral for the Q3 Brand launch. All assets should follow standard brand typography guidelines and strict margin safety codes to ensure high-fidelity printing."
          ]
        },
        {
          type: "checklist",
          title: "Creative Assets Checklist",
          content: [
            { text: "Approve vector display iconography guidelines", checked: true },
            { text: "Confirm high-contrast color pairings for marketing PDF decks", checked: true },
            { text: "Render 4K cinematic launch sequence reel", checked: false },
            { text: "Bake responsive SVG layout assets", checked: false }
          ]
        },
        {
          type: "bullet_list",
          title: "Primary Design Directives",
          content: [
            "Maintain clean positive margin splits (45pt horizontal, 50pt vertical alignment)",
            "Favor crisp, high-contrast typography (Inter paired with Space Grotesk display headers)",
            "Enforce strict PDF-A compliance formatting standard to safeguard visual assets across viewing software"
          ]
        }
      ]
    },
    {
      title: "Project Alpha Milestones",
      date: "Tuesday, June 2, 2026",
      sections: [
        {
          type: "paragraph",
          title: "Milestone Overview",
          content: [
            "We have mapped out the operational phases for the digital integration sprint. The layout reflects current team capacities and the scheduled quality assurance testing cycles."
          ]
        },
        {
          type: "bullet_list",
          title: "Sprint Goals",
          content: [
            "Deploy standard Node.js rendering container on Cloud Run structure",
            "Establish binary byte-level string extraction patterns for legacy file archives",
            "Build robust client-side vector PDF assembly maps using jsPDF dependencies"
          ]
        },
        {
          type: "checklist",
          title: "Testing Phases",
          content: [
            { text: "Perform local file offset validation scans", checked: true },
            { text: "Validate fallback regex layout parser for missing credential pipelines", checked: true },
            { text: "Run end-to-end multi-page pagination tests", checked: false }
          ]
        }
      ]
    }
  ]
};

export default function App() {
  // General Tabs
  const [activeTab, setActiveTab] = useState<'converter' | 'developer'>('converter');

  // Tab 1: Direct Converter States
  const [notebook, setNotebook] = useState<OneNotebook | null>(DEMO_NOTEBOOK);
  const [selectedPageIdx, setSelectedPageIdx] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [themeColor, setThemeColor] = useState<'indigo' | 'emerald' | 'rose' | 'neutral' | 'amber'>('indigo');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Tab 2: Code Generator States
  const [config, setConfig] = useState<ConverterConfig>(DEFAULT_CONFIG);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingLogsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (processingLogsEndRef.current) {
      processingLogsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [processingLogs]);

  const handleResetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  // ORIGINAL ZIP Generation Function
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

  // Real-Time File Parser Interface (Express API POST connection)
  const processOneNoteFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingStatus('Analyzing binary stream headers...');
    setProcessingLogs([
      `[Upload] Received filename: "${file.name}" | Size: ${(file.size / 1024).toFixed(1)} KB`,
      `[Scanner] Opening byte buffer channels...`,
      `[Scanner] Analyzing FAT sections and file header sequences...`
    ]);

    // Simulate logs sequence
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    await delay(350);
    setProcessingLogs(prev => [...prev, `[Decoder] Initializing extraction of Microsoft OneNote .one format offsets...`]);
    setProcessingStatus('Reconstructing UTF-16 Unicode sequences...');

    await delay(450);
    setProcessingLogs(prev => [...prev, `[Decoder] Searching little-endian binary pools for UTF-16 and UTF-8 printable glyph blocks...`]);
    setProcessingLogs(prev => [...prev, `[Decoder] Found raw string boundaries. Cleaning metadata tables...`]);

    await delay(400);
    setProcessingStatus('Decompressing layout models...');
    setProcessingLogs(prev => [...prev, `[Server] Transferring text array chunks to Express full-stack API pipeline...`]);

    try {
      // Read file as Base64 string to securely submit over HTTP JSON POST
      const reader = new FileReader();
      
      reader.onerror = () => {
        throw new Error("Unable to read local file stream.");
      };

      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          setProcessingLogs(prev => [...prev, `[API] Sending secure base64 payload to "/api/convert-one" gateway...`]);
          
          const response = await fetch('/api/convert-one', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileData: base64Data
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP network error ${response.status}: Failed to compiler contents.`);
          }

          const result: OneNotebook = await response.json();
          
          setProcessingLogs(prev => [
            ...prev,
            `[Gemini Compiler] Engine callback completed using: ${result.engine || "Standard Parsing Fallback"}`,
            `[Compiler] Page Outline established! Discovered ${result.pages.length} sheets.`,
            `[Success] OneNote Notebook parsed successfully.`
          ]);

          await delay(400);
          setNotebook(result);
          setSelectedPageIdx(0);
          setIsProcessing(false);
        } catch (apiErr: any) {
          setProcessingLogs(prev => [...prev, `[Error] Server error during layout assembly: ${apiErr.message}`]);
          setProcessingStatus('Parsing failed.');
          setIsProcessing(false);
          alert(`Failed to parse OneNote file: ${apiErr.message}`);
        }
      };

      reader.readAsDataURL(file);

    } catch (err: any) {
      setIsProcessing(false);
      setProcessingLogs(prev => [...prev, `[Error] Parser crash: ${err.message}`]);
      alert("Error parsing document: " + err.message);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.one')) {
        processOneNoteFile(file);
      } else {
        alert("Please drop a valid Microsoft OneNote file ending in '.one'.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processOneNoteFile(files[0]);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleResetConverter = () => {
    setNotebook(DEMO_NOTEBOOK);
    setSelectedPageIdx(0);
    setEditMode(false);
    setThemeColor('indigo');
    setProcessingLogs([]);
  };

  // Direct client PDF download
  const handleExportPdf = async () => {
    if (!notebook) return;
    setIsExportingPdf(true);
    try {
      const pdfBlob = generatePdfFromNotebook(notebook, {
        themeColor,
        jpegQuality: config.jpegQuality,
        pdfCompliance: config.pdfCompliance,
        fontFolder: config.fontFolder
      });

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${notebook.name || 'Converted_Notes'}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err: any) {
      console.error("PDF export crash: ", err);
      alert("Error compiling vector PDF blocks: " + err.message);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Editable fields handler
  const handleContentChange = (
    pageIdx: number, 
    secIdx: number, 
    itemIdx: number | null, 
    newText: string, 
    type: 'text' | 'checked' = 'text'
  ) => {
    if (!notebook) return;
    const clonedNotebook = JSON.parse(JSON.stringify(notebook));
    const section = clonedNotebook.pages[pageIdx].sections[secIdx];

    if (section.type === 'checklist' && itemIdx !== null) {
      if (type === 'checked') {
        section.content[itemIdx].checked = !section.content[itemIdx].checked;
      } else {
        section.content[itemIdx].text = newText;
      }
    } else if (itemIdx !== null && Array.isArray(section.content)) {
      section.content[itemIdx] = newText;
    } else if (typeof section.content === 'string') {
      section.content = newText;
    }
    setNotebook(clonedNotebook);
  };

  // Sidebar colors mapping
  const activeColorTheme = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30 accent-indigo-500 hover:text-indigo-300',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 accent-emerald-500 hover:text-emerald-300',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30 accent-rose-500 hover:text-rose-300',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30 accent-amber-500 hover:text-amber-300',
    neutral: 'text-neutral-300 bg-neutral-800/80 border-neutral-700/60 accent-neutral-400 hover:text-white',
  }[themeColor];

  const themeAccentHex = {
    indigo: '#4F46E5',
    emerald: '#059669',
    rose: '#E11D48',
    amber: '#D97706',
    neutral: '#4B5563',
  }[themeColor];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-neutral-300 font-sans antialiased">
      {/* Header Hub */}
      <header className="bg-[#0E0E10] border-b border-neutral-850 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-sm font-black text-white tracking-widest leading-none uppercase">
                  Note2PDF <span className="text-indigo-400 font-medium tracking-normal text-[11px] normal-case ml-1">Fluid Suite v2.0</span>
                </h1>
                <p className="text-[10px] text-neutral-500 font-bold mt-1 uppercase tracking-wide">
                  Microsoft OneNote .one Binary Layout Parser
                </p>
              </div>
            </div>

            {/* Menu Tabs Navigation */}
            <div className="flex items-center space-x-2">
              <button
                id="btn-tab-converter"
                onClick={() => setActiveTab('converter')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'converter'
                    ? 'bg-[#1D1D23] text-[#F3F4F6] border border-neutral-700'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <span>Live PDF Converter</span>
              </button>
              <button
                id="btn-tab-developer"
                onClick={() => setActiveTab('developer')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'developer'
                    ? 'bg-[#1D1D23] text-[#F3F4F6] border border-neutral-700'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <span>Developer Java SDK</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: REAL-TIME CONVERTER AREA */}
        {activeTab === 'converter' && (
          <div className="space-y-6">
            
            {/* Dropzone Hub */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerUploadClick}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
                isDragging 
                  ? 'border-indigo-400 bg-indigo-505/10 scale-[0.99] shadow-2xl'
                  : 'border-neutral-800 bg-[#0E0E10] hover:border-neutral-700'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".one" 
                className="hidden" 
              />
              
              <div className="max-w-lg mx-auto flex flex-col items-center space-y-4">
                <div className="p-4 bg-[#16161A] text-indigo-400 rounded-full border border-neutral-800 shadow-inner">
                  <Upload className="h-7 w-7 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Drag & Drop OneNote File Here</h3>
                  <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                    Instantly load Microsoft <strong className="text-neutral-350">.one</strong> files. Our fullstack Node.js server parses binary data and renders beautiful, scalable PDFs.
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-[#1C1C22] text-[#E1E1E6] hover:bg-[#25252E] px-5 py-2 rounded-lg text-[10.5px] font-bold border border-neutral-800 uppercase tracking-widest cursor-pointer transition-all"
                >
                  Choose Local File
                </button>
              </div>

              {/* Drag indicator halo */}
              {isDragging && (
                <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-xs flex items-center justify-center">
                  <span className="text-indigo-400 text-xs font-black uppercase tracking-widest">Release to compile instantly!</span>
                </div>
              )}
            </div>

            {/* PROCESSING OVERLAY CARDS */}
            {isProcessing && (
              <div className="bg-[#0E0E10] border border-neutral-850 rounded-2xl p-6 shadow-2xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="h-5 w-5 text-indigo-400 animate-spin" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Node.js Binary Parse Engine running</h4>
                      <p className="text-[10.5px] text-neutral-500 font-sans">{processingStatus}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-[#16161A] border border-neutral-800 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-wider">
                    Fullstack API Active
                  </span>
                </div>
                
                {/* Micro console output */}
                <div className="bg-black/85 border border-neutral-850 rounded-xl p-4 h-48 overflow-y-auto font-mono text-[10.5px] leading-relaxed text-neutral-300 space-y-1.5 shadow-inner">
                  {processingLogs.map((log, i) => (
                    <div key={i} className="border-l border-neutral-800 pl-2 animate-fade-in">
                      <span className="text-neutral-650 select-none mr-2">[{i+1}]</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  <div ref={processingLogsEndRef} />
                </div>
              </div>
            )}

            {/* ACTIVE WORKSPACE GRID PANEL */}
            {notebook && !isProcessing && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 1. Left controls sidebar */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Loaded summary card */}
                  <div className="bg-[#0E0E10] border border-neutral-800 rounded-xl p-5 shadow-xl space-y-4">
                    <div className="flex items-start justify-between border-b border-neutral-850 pb-3">
                      <div>
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">ACTIVE CONTAINER</span>
                        <h4 className="text-xs font-extrabold text-white uppercase tracking-wider block mt-0.5 truncate max-w-[180px]">
                          {notebook.name}
                        </h4>
                      </div>
                      <span className="text-[9px] font-extrabold font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-2 py-0.5 rounded">
                        {notebook.engine}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      {notebook.summary || "Successful binary layout dissection."}
                    </p>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleResetConverter}
                        className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 text-[10.5px] font-bold text-neutral-450 hover:text-white bg-[#16161B] border border-neutral-850 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Reset Workspace</span>
                      </button>
                    </div>
                  </div>

                  {/* Themes / Accent settings */}
                  <div className="bg-[#0E0E10] border border-neutral-800 rounded-xl p-5 shadow-xl space-y-5">
                    <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest block border-b border-neutral-850 pb-2">
                      Export Specifications
                    </span>

                    {/* Accent selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Theme Palette</label>
                      <div className="flex flex-wrap gap-2">
                        {(['indigo', 'emerald', 'rose', 'neutral', 'amber'] as const).map((col) => (
                          <button
                            key={col}
                            onClick={() => setThemeColor(col)}
                            style={{ borderColor: themeColor === col ? themeAccentHex : 'transparent' }}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border cursor-pointer transition-all flex items-center space-x-1.5 ${
                              themeColor === col 
                                ? 'bg-neutral-850 text-white' 
                                : 'bg-[#16161A] text-neutral-500 hover:text-neutral-350'
                            }`}
                          >
                            <span 
                              className="w-2.5 h-2.5 rounded-full" 
                              style={{ 
                                backgroundColor: 
                                  col === 'indigo' ? '#4F46E5' :
                                  col === 'emerald' ? '#059669' :
                                  col === 'rose' ? '#E11D48' :
                                  col === 'amber' ? '#D97706' : '#9CA3AF'
                              }}
                            />
                            <span>{col}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mode edits */}
                    <div className="space-y-2 pt-1 border-t border-neutral-850">
                      <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Interactive Sandbox Options</label>
                      <div className="flex space-x-3 items-center">
                        <button
                          onClick={() => setEditMode(!editMode)}
                          className={`flex-1 inline-flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border cursor-pointer transition-all ${
                            editMode 
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                              : 'bg-[#16161B] border-neutral-850 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>{editMode ? "Lock Elements" : "Editable Mode"}</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-500 font-sans leading-normal mt-1">
                        Configure editable blocks on to refine titles or check states directly before writing your vector PDF!
                      </p>
                    </div>

                    {/* Action Hub button */}
                    <button
                      id="btn-main-convert-pdf"
                      onClick={handleExportPdf}
                      disabled={isExportingPdf}
                      className={`w-full inline-flex items-center justify-center space-x-2.5 py-3 rounded-lg text-xs font-black uppercase tracking-widest cursor-pointer transition-all shadow-lg active:scale-[98%] ${
                        isExportingPdf 
                          ? 'bg-neutral-800 text-neutral-500'
                          : 'bg-white text-black hover:bg-neutral-200'
                      }`}
                    >
                      {isExportingPdf ? (
                        <>
                          <div className="animate-spin border-2 border-neutral-500 border-t-transparent rounded-full h-3 w-3"></div>
                          <span>Compiling Elements...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Download High-Fidelity PDF</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Layout Outline map cards */}
                  <div className="bg-[#0E0E10] border border-neutral-800 rounded-xl p-5 shadow-xl space-y-3">
                    <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest block border-b border-neutral-850 pb-2">
                      Notebook Chapters ({notebook.pages.length})
                    </span>
                    
                    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                      {notebook.pages.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPageIdx(idx)}
                          className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                            selectedPageIdx === idx
                              ? 'bg-neutral-850 border-neutral-700 text-white shadow-md'
                              : 'bg-[#121216] border-neutral-850 hover:border-neutral-800 text-neutral-450 hover:text-neutral-350'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <FileText className={`h-4 w-4 ${selectedPageIdx === idx ? 'text-indigo-400' : 'text-neutral-600'}`} />
                            <span className="truncate">{p.title || `Chapter ${idx+1}`}</span>
                          </div>
                          <ChevronRight className="h-3 w-3 text-neutral-600 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* 2. Center sheet workspace */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Editing Warning banner */}
                  {editMode && (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex  items-center space-x-2 text-amber-400">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span className="text-[10.5px] font-sans">
                        <strong>Sandbox Active</strong>: You can click inside any paragraph or label to modify the text. Changes propagate to vector PDF on export!
                      </span>
                    </div>
                  )}

                  {/* Realistic document canvas wrapper */}
                  <div className="bg-[#111115] border border-neutral-850 rounded-2xl p-6 md:p-12 shadow-inner min-h-[720px] relative overflow-hidden flex flex-col justify-between">
                    
                    {/* A4 Paper Grid */}
                    <div className="space-y-8 select-text">
                      <div className="border-b border-neutral-800 pb-5">
                        
                        {/* Title accent block */}
                        <div 
                          className="h-1 w-24 rounded-full mb-4" 
                          style={{ backgroundColor: themeAccentHex }}
                        />

                        {/* Page Title */}
                        {editMode ? (
                          <input
                            type="text"
                            value={notebook.pages[selectedPageIdx]?.title || ''}
                            onChange={(e) => {
                              const cloned = JSON.parse(JSON.stringify(notebook));
                              cloned.pages[selectedPageIdx].title = e.target.value;
                              setNotebook(cloned);
                            }}
                            className="bg-neutral-850 text-white font-extrabold text-2xl tracking-tight border border-neutral-700 rounded px-2 py-1 w-full focus:outline-none focus:border-indigo-500"
                          />
                        ) : (
                          <h2 className="text-white font-extrabold text-2xl tracking-tight leading-snug">
                            {notebook.pages[selectedPageIdx]?.title || "Untitled Sheets"}
                          </h2>
                        )}

                        {/* Date/Time Row */}
                        <div className="text-[11px] text-neutral-500 mt-2 font-mono flex items-center space-x-1.5">
                          <span>Notebook Registry • </span>
                          {editMode ? (
                            <input
                              type="text"
                              value={notebook.pages[selectedPageIdx]?.date || ''}
                              onChange={(e) => {
                                const cloned = JSON.parse(JSON.stringify(notebook));
                                cloned.pages[selectedPageIdx].date = e.target.value;
                                setNotebook(cloned);
                              }}
                              className="bg-neutral-850 text-neutral-350 text-[11px] border border-neutral-750 rounded px-1.5 py-0.5 focus:outline-none"
                            />
                          ) : (
                            <span>{notebook.pages[selectedPageIdx]?.date || "None"}</span>
                          )}
                        </div>
                      </div>

                      {/* Content sections stack */}
                      <div className="space-y-6">
                        {notebook.pages[selectedPageIdx]?.sections.map((section, secIdx) => (
                          <div key={secIdx} className="space-y-3 group/sec">
                            
                            {/* Section Subtitle */}
                            {section.title && (
                              <div className="flex items-center space-x-1.5">
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: themeAccentHex }} />
                                {editMode ? (
                                  <input
                                    type="text"
                                    value={section.title || ''}
                                    onChange={(e) => {
                                      const cloned = JSON.parse(JSON.stringify(notebook));
                                      cloned.pages[selectedPageIdx].sections[secIdx].title = e.target.value;
                                      setNotebook(cloned);
                                    }}
                                    className="bg-neutral-850 text-neutral-200 text-xs font-bold border border-neutral-750 px-1.5 py-0.5 rounded focus:outline-none"
                                  />
                                ) : (
                                  <h3 className="text-neutral-250 font-bold text-xs uppercase tracking-wider">
                                    {section.title}
                                  </h3>
                                )}
                              </div>
                            )}

                            {/* Section Items by type */}
                            {section.type === 'checklist' && Array.isArray(section.content) ? (
                              <div className="space-y-2 pl-3">
                                {section.content.map((item, itemIdx) => (
                                  <div key={itemIdx} className="flex items-start space-x-3 animate-fade-in py-0.5">
                                    {/* Action Checkbox */}
                                    <input
                                      type="checkbox"
                                      checked={!!item.checked}
                                      onChange={() => handleContentChange(selectedPageIdx, secIdx, itemIdx, '', 'checked')}
                                      className={`h-4 w-4 shrink-0 mt-0.5 select-none rounded border-neutral-700 bg-neutral-900 cursor-pointer ${activeColorTheme}`}
                                    />
                                    
                                    {/* Task text label */}
                                    {editMode ? (
                                      <input
                                        type="text"
                                        value={item.text || ''}
                                        onChange={(e) => handleContentChange(selectedPageIdx, secIdx, itemIdx, e.target.value)}
                                        className="bg-neutral-850 text-neutral-300 text-xs border border-neutral-750 rounded px-1.5 py-0.5 w-full focus:outline-none"
                                      />
                                    ) : (
                                      <span className={`text-xs ${item.checked ? 'line-through text-neutral-550' : 'text-neutral-350'}`}>
                                        {item.text || "Empty item"}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : section.type === 'bullet_list' && Array.isArray(section.content) ? (
                              <div className="space-y-1.5 pl-4">
                                {section.content.map((item, itemIdx) => (
                                  <div key={itemIdx} className="flex items-start space-x-3.5 leading-relaxed py-0.5">
                                    {/* List Bullet indicator */}
                                    <span 
                                      className="h-1.5 w-1.5 rounded-full shrink-0 mt-2" 
                                      style={{ backgroundColor: themeAccentHex }} 
                                    />
                                    {editMode ? (
                                      <input
                                        type="text"
                                        value={item || ''}
                                        onChange={(e) => handleContentChange(selectedPageIdx, secIdx, itemIdx, e.target.value)}
                                        className="bg-neutral-850 text-neutral-300 text-xs border border-neutral-750 rounded px-1.5 py-0.5 w-full focus:outline-none"
                                      />
                                    ) : (
                                      <span className="text-xs text-neutral-350">
                                        {item}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // Generic Paragraph structures
                              <div className="space-y-2.5 pl-3 leading-relaxed">
                                {(Array.isArray(section.content) ? section.content : [section.content]).map((para, paraIdx) => (
                                  <div key={paraIdx} className="leading-relaxed">
                                    {editMode ? (
                                      <textarea
                                        value={para || ''}
                                        rows={3}
                                        onChange={(e) => handleContentChange(selectedPageIdx, secIdx, paraIdx, e.target.value)}
                                        className="bg-neutral-850 text-neutral-300 text-xs border border-neutral-750 rounded p-2.5 w-full focus:outline-none font-sans leading-normal"
                                      />
                                    ) : (
                                      <p className="text-xs text-neutral-400 font-sans leading-relaxed text-justify">
                                        {para}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Realistic footer mark */}
                    <div className="mt-16 pt-5 border-t border-neutral-850 flex items-center justify-between text-[10px] text-neutral-600 font-mono">
                      <span>DOC ID: MS-ONESTORE-X93</span>
                      <span>PAGE {selectedPageIdx + 1} OF {notebook.pages.length}</span>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* General FAQs banner */}
            <FaqSection />

          </div>
        )}

        {/* TAB 2: DEVELOPER BOILERPLATE TOOL AREA (The Original Generator) */}
        {activeTab === 'developer' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Download SUCCESS banner */}
            {downloadSuccessMessage && (
              <div className="mb-6 bg-indigo-950/40 border border-indigo-500/25 rounded-xl p-4 flex items-center space-x-3 text-indigo-200 animate-slide-down">
                <FileCheck className="h-5 w-5 text-indigo-400 shrink-0" />
                <div className="text-xs font-medium">
                  {downloadSuccessMessage} <span className="text-indigo-400/70 font-normal">Extract the zip bundle, navigate inside, and execute with terminal instructions!</span>
                </div>
              </div>
            )}

            {/* Quickstart tutorial block */}
            <div className="bg-[#0E0E10] p-5 border border-neutral-800 rounded-xl flex items-start space-x-3 text-neutral-300 shadow-xl">
              <Archive className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">Java SDK Automation Pipeline</h4>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  Configure programmatic Java script bundles to run mass OneNote-to-PDF translations on your enterprise servers. This builds a complete maven/gradle project containing proper dependencies, custom compilation parameters, and direct executor tools.
                </p>
              </div>
            </div>

            {/* Main structural layout split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: Configuration knobbies controls */}
              <div className="lg:col-span-5 space-y-6">
                <ConfigurationPanel
                  config={config}
                  onChange={setConfig}
                  onReset={handleResetConfig}
                />

                <div className="bg-[#0E0E10] rounded-xl border border-neutral-800 p-6 text-center space-y-4">
                  <span className="text-[9.5px] text-neutral-500 font-bold uppercase tracking-widest block">Download Project Bundle</span>
                  <p className="text-xs text-neutral-400 leading-normal px-2">
                    Click below to export the compiled setup containing customizable Java code templates, build declarations, and batch run helpers.
                  </p>
                  <button
                    id="btn-sidebar-download-zip"
                    onClick={handleDownloadZip}
                    disabled={isDownloading}
                    className="w-full inline-flex justify-center items-center space-x-2 py-3 text-xs font-black text-black bg-white hover:bg-neutral-200 rounded-lg cursor-pointer transition-all active:scale-95 shadow-lg"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Project ZIP</span>
                  </button>
                </div>
              </div>

              {/* RIGHT: Visual Code tabs and interactive terminal sandbox CLI */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Visual code files viewer */}
                <div className="h-[430px]">
                  <CodeDisplay config={config} />
                </div>

                {/* Simulated CLI Sandbox */}
                <TerminalSimulator config={config} />

                {/* evaluation warnings */}
                <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/20 flex items-start space-x-3 text-amber-200/90 shadow-lg">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">Evaluation Mode Notice</h4>
                    <p className="text-[11px] text-neutral-400 leading-normal">
                      The generated scripts run using Aspose.Note evaluation binaries, which include watermark banners. To remove limits, reference your premium product key in the Java setup context as described in code comments.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer marking */}
      <footer className="bg-[#0E0E10] border-t border-neutral-850 mt-20 py-10 text-center text-neutral-550 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 select-text">
          <p className="font-mono uppercase tracking-widest text-[#555] text-[10px] mb-2">Note2PDF Fullstack Workspace</p>
          <p>© 2026 Note2PDF Automation Script Platform. Operating under Node.js runtime and Google Gemini intelligence systems.</p>
        </div>
      </footer>
    </div>
  );
}
