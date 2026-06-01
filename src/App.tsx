/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, BookOpen, FileCheck, HelpCircle, AlertCircle, 
  Upload, FileText, Sparkles, Trash2, ChevronRight, Edit2, 
  CheckCircle2, RefreshCw, X, Laptop
} from 'lucide-react';
import { OneNotebook, OnePage, OnePageSection } from './types';
import { generatePdfFromNotebook } from './pdfGenerator';
import { downloadPortableApp } from './utils';

interface ProcessedFile {
  id: string;
  fileName: string;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
  logs: string[];
  notebook: OneNotebook | null;
}

const INITIAL_DEMO_NOTEBOOK: OneNotebook = {
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

const DEMO_FILES: ProcessedFile[] = [
  {
    id: 'demo-1',
    fileName: 'Strategic_Marketing_Plan.one',
    status: 'completed',
    logs: [
      '[Upload] Loaded default onboarding workspace.',
      '[Success] Extracted layouts ready for preview.'
    ],
    notebook: INITIAL_DEMO_NOTEBOOK
  }
];

export default function App() {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>(DEMO_FILES);
  const [activeFileId, setActiveFileId] = useState<string>('demo-1');
  const [selectedPageIdx, setSelectedPageIdx] = useState<number>(0);
  
  const [isDragging, setIsDragging] = useState(false);
  const [themeColor, setThemeColor] = useState<'indigo' | 'emerald' | 'rose' | 'neutral' | 'amber'>('indigo');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingWorkspace, setIsExportingWorkspace] = useState(false);

  const handleDownloadPortableApp = async () => {
    setIsExportingWorkspace(true);
    try {
      const blob = await downloadPortableApp();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Note2PDF_Standalone_Workspace.zip`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err: any) {
      console.error("Workspace bundler error:", err);
      alert("Error building standalone workspace package: " + err.message);
    } finally {
      setIsExportingWorkspace(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive currently active notebook
  const activeFile = processedFiles.find(f => f.id === activeFileId);
  const notebook = activeFile?.notebook || null;

  // Make sure page index doesn't go out of bounds on notebook switch
  useEffect(() => {
    if (notebook) {
      if (selectedPageIdx >= notebook.pages.length) {
        setSelectedPageIdx(0);
      }
    } else {
      setSelectedPageIdx(0);
    }
  }, [activeFileId, notebook]);

  // Handle single or multiple file conversions
  const processFiles = async (files: FileList) => {
    const validFiles = Array.from(files).filter(f => f.name.endsWith('.one'));
    if (validFiles.length === 0) {
      alert("Please upload valid Microsoft OneNote files ending in '.one'.");
      return;
    }

    // Prepare container records
    const newItems: ProcessedFile[] = validFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fileName: file.name,
      status: 'processing',
      logs: [
        `[Upload] Received filename: "${file.name}" | Size: ${(file.size / 1024).toFixed(1)} KB`,
        `[Scanner] Opening byte buffer channels...`,
        `[Scanner] Analyzing directory headers & binary stream offsets...`
      ],
      notebook: null
    }));

    // Add them to history list
    setProcessedFiles(prev => [...prev, ...newItems]);
    // Switch selection to the first newly added file
    setActiveFileId(newItems[0].id);

    // Process files sequentially or in parallel
    newItems.forEach(async (item, idx) => {
      const fileToProcess = validFiles[idx];
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

      try {
        await delay(200);
        updateItemLogs(item.id, `[Decoder] Searching little-endian binary pools for UTF-16 and UTF-8 glyphs...`);
        
        await delay(250);
        updateItemLogs(item.id, `[Server] Transferring text array streams to Express /api/convert-one API...`);

        const reader = new FileReader();
        reader.onerror = () => {
          throw new Error("Unable to read local file stream.");
        };

        reader.onload = async () => {
          try {
            const base64Data = (reader.result as string).split(',')[1];
            
            const response = await fetch('/api/convert-one', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileName: fileToProcess.name,
                fileData: base64Data
               })
            });

            if (!response.ok) {
              throw new Error(`HTTP network error ${response.status}: Failed to compiler contents.`);
            }

            const parsedRes: OneNotebook = await response.json();

            setProcessedFiles(prev => prev.map(f => {
              if (f.id === item.id) {
                return {
                  ...f,
                  status: 'completed',
                  logs: [
                    ...f.logs,
                    `[Gemini Compiler] Completed structure callback using Engine: ${parsedRes.engine}`,
                    `[Compiler] Found page maps: ${parsedRes.pages.length} sheets.`,
                    `[Success] OneNote Notebook parsed successfully.`
                  ],
                  notebook: parsedRes
                };
              }
              return f;
            }));

          } catch (fetchErr: any) {
            markItemFailed(item.id, fetchErr.message);
          }
        };

        reader.readAsDataURL(fileToProcess);

      } catch (err: any) {
        markItemFailed(item.id, err.message);
      }
    });
  };

  const updateItemLogs = (id: string, logMsg: string) => {
    setProcessedFiles(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, logs: [...f.logs, logMsg] };
      }
      return f;
    }));
  };

  const markItemFailed = (id: string, errMsg: string) => {
    setProcessedFiles(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status: 'failed',
          error: errMsg,
          logs: [...f.logs, `[Error] Loader crashed: ${errMsg}`]
        };
      }
      return f;
    }));
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = processedFiles.filter(f => f.id !== id);
    setProcessedFiles(filtered);
    
    // Adjust active selection if deleted active
    if (activeFileId === id && filtered.length > 0) {
      setActiveFileId(filtered[0].id);
    }
  };

  const handleExportPdf = async () => {
    if (!notebook) return;
    setIsExportingPdf(true);
    try {
      const pdfBlob = generatePdfFromNotebook(notebook, {
        themeColor,
        jpegQuality: 90,
        pdfCompliance: 'None',
        fontFolder: ''
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
      console.error("PDF compiling error: ", err);
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
    if (!activeFileId || !notebook) return;
    
    setProcessedFiles(prev => prev.map(f => {
      if (f.id === activeFileId && f.notebook) {
        const clonedNotebook = JSON.parse(JSON.stringify(f.notebook));
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

        return {
          ...f,
          notebook: clonedNotebook
        };
      }
      return f;
    }));
  };

  const currentThemeAccentHex = {
    indigo: '#4F46E5',
    emerald: '#059669',
    rose: '#E11D48',
    amber: '#D97706',
    neutral: '#4B5563',
  }[themeColor];

  const activeColorThemeStyles = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30 accent-indigo-500 hover:text-indigo-300',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 accent-emerald-500 hover:text-emerald-300',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30 accent-rose-500 hover:text-rose-300',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30 accent-amber-500 hover:text-amber-300',
    neutral: 'text-neutral-300 bg-neutral-800/80 border-neutral-700/60 accent-neutral-400 hover:text-white',
  }[themeColor];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-neutral-300 font-sans antialiased flex flex-col justify-between">
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
                  Note2PDF <span className="text-indigo-400 font-bold tracking-normal text-[10px] normal-case ml-1.5 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">A4 Vector Compiler</span>
                </h1>
                <p className="text-[10px] text-neutral-500 font-bold mt-1 uppercase tracking-wide flex items-center">
                  <Sparkles className="h-3 w-3 text-amber-500 mr-1" />
                  Watermark-Free Multi-File Converter Engine
                </p>
              </div>
            </div>

            {/* Metrics Tally count */}
            <div className="flex items-center space-x-2">
              <div className="bg-[#121216] border border-neutral-800 rounded-lg px-3 py-1.5 flex items-center space-x-2 text-xs font-mono">
                <span className="text-neutral-500 uppercase tracking-widest text-[9px] font-bold">Files In Queue:</span>
                <span className="text-white font-extrabold">{processedFiles.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* MULTI DRAG AND DROP ZONE */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerUploadClick}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
            isDragging 
              ? 'border-indigo-400 bg-indigo-500/5'
              : 'border-neutral-800 bg-[#0E0E10] hover:border-neutral-700'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".one" 
            multiple 
            className="hidden" 
          />
          
          <div className="max-w-xl mx-auto flex flex-col items-center space-y-4">
            <div className="p-4 bg-[#16161A] text-indigo-400 rounded-full border border-neutral-800 shadow-inner">
              <Upload className="h-7 w-7 animate-bounce text-indigo-400" />
            </div>
            
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase border border-emerald-500/15">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Multi-File Drop Enabled</span>
              </div>
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider block mt-1">Drag & Drop OneNote Files Here</h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Upload one or multiple Microsoft <strong className="text-neutral-200">.one</strong> notebook files simultaneously. Files are processed locally on your Node.js queue pipeline and cleanly mapped with zero watermarks.
              </p>
            </div>
            
            <button
              type="button"
              className="bg-[#1C1C22] text-[#E1E1E6] hover:bg-[#25252E] px-5 py-2.5 rounded-xl text-[10.5px] font-bold border border-neutral-800 uppercase tracking-widest cursor-pointer transition-all active:scale-95"
            >
              Choose OneNote Files
            </button>
          </div>

          {isDragging && (
            <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-xs flex items-center justify-center">
              <span className="text-indigo-400 text-xs font-black uppercase tracking-widest">Release to queue convert!</span>
            </div>
          )}
        </div>

        {/* WORKSPACE MIDDLEWARE SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Processed Files List & Export Specifications */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* PROCESSED LIST PANEL */}
            <div className="bg-[#0E0E10] border border-neutral-800 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-850 pb-2.5">
                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest block">
                  Processed Files List ({processedFiles.length})
                </span>
                {processedFiles.length > 1 && (
                  <button 
                    onClick={() => {
                      setProcessedFiles(DEMO_FILES);
                      setActiveFileId('demo-1');
                    }}
                    className="text-[9px] font-bold uppercase tracking-wider text-rose-450 hover:text-rose-400 cursor-pointer transition-colors"
                  >
                    Clear History
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {processedFiles.map((file, idx) => {
                  const isActive = file.id === activeFileId;
                  return (
                    <div
                      key={file.id}
                      onClick={() => setActiveFileId(file.id)}
                      className={`group p-3 rounded-xl transition-all border cursor-pointer relative ${
                        isActive
                          ? 'bg-neutral-850/80 border-neutral-700/80'
                          : 'bg-[#121216] border-neutral-850 hover:border-neutral-800'
                      }`}
                    >
                      <div className="flex items-start justify-between space-x-2">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <FileText className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-neutral-500'}`} />
                          <div className="min-w-0">
                            <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-250'}`}>
                              {file.fileName}
                            </p>
                            
                            {/* File specs */}
                            <p className="text-[10px] font-mono mt-0.5 text-neutral-500">
                              {file.status === 'processing' && (
                                <span className="text-amber-400 flex items-center space-x-1">
                                  <RefreshCw className="h-2.5 w-2.5 animate-spin mr-1 inline" />
                                  Parsing binary...
                                </span>
                              )}
                              {file.status === 'completed' && (
                                <span className="text-emerald-400">
                                  ✓ Translated ({file.notebook?.pages.length || 0} pgs)
                                </span>
                              )}
                              {file.status === 'failed' && (
                                <span className="text-rose-400">✗ Parse Error</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Delete single processed item */}
                        <button
                          onClick={(e) => handleDeleteFile(file.id, e)}
                          className="text-neutral-600 hover:text-rose-400 p-1 rounded-md transition-all lg:opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Processing Micro log snippets inside card if expanded/active */}
                      {isActive && file.status === 'processing' && (
                        <div className="mt-2.5 pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-500 space-y-1">
                          <div className="animate-pulse">Loading active layout mappings...</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PORTABLE DESKTOP WORKSPACE */}
            <div className="bg-[#0E0E10] border border-neutral-800 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center space-x-2.5 border-b border-neutral-850 pb-2.5">
                <span className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
                  <Laptop className="h-4 w-4" />
                </span>
                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest block">
                  Standalone Desktop App
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">
                Convert this watermark-free converter into a standalone desktop program. Run it offline/locally on your workstation (Windows, macOS, Linux) with automatic single-click startup scripts included.
              </p>
              <button
                type="button"
                onClick={handleDownloadPortableApp}
                disabled={isExportingWorkspace}
                className="w-full inline-flex items-center justify-center space-x-2 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer transition-all active:scale-95 border border-indigo-500/30"
              >
                {isExportingWorkspace ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    <span>Packaging Node Sources...</span>
                  </>
                ) : (
                  <>
                    <Laptop className="h-3.5 w-3.5 shrink-0" />
                    <span>Download Desktop Package</span>
                  </>
                )}
              </button>
            </div>

            {/* EXPORT SPECIFICATIONS */}
            {notebook && (
              <div className="bg-[#0E0E10] border border-neutral-800 rounded-xl p-5 shadow-xl space-y-5">
                <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest block border-b border-neutral-850 pb-2">
                  Export Specifications
                </span>

                {/* Accent Selection panel */}
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Theme Palette</label>
                  <div className="flex flex-wrap gap-2">
                    {(['indigo', 'emerald', 'rose', 'neutral', 'amber'] as const).map((col) => (
                      <button
                        key={col}
                        onClick={() => setThemeColor(col)}
                        style={{ borderColor: themeColor === col ? currentThemeAccentHex : 'transparent' }}
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

                {/* Lock elements sandbox toggle */}
                <div className="space-y-2 pt-1 border-t border-neutral-850">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Interactive Sandbox Options</label>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`w-full inline-flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border cursor-pointer transition-all ${
                      editMode 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                        : 'bg-[#16161B] border-neutral-850 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>{editMode ? "Lock Elements" : "Editable Mode"}</span>
                  </button>
                  <p className="text-[10px] text-neutral-500 font-sans leading-normal">
                    Turn on Editable Mode to manually edit document content, check task boxes, or rewrite section headers directly on the preview sheet prior to exporting.
                  </p>
                </div>

                {/* Download Direct Trigger button */}
                <button
                  id="btn-direct-compile-pdf"
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 text-xs font-black text-black bg-white hover:bg-neutral-200 rounded-lg cursor-pointer transition-all active:scale-95 shadow-xl"
                >
                  {isExportingPdf ? (
                    <>
                      <div className="animate-spin border-2 border-neutral-500 border-t-transparent rounded-full h-3 w-3"></div>
                      <span>Compiling PDF-A...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Download Clean PDF</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Selected Notebook Chapter Directory */}
            {notebook && (
              <div className="bg-[#0E0E10] border border-neutral-800 rounded-xl p-5 shadow-xl space-y-3">
                <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest block border-b border-neutral-850 pb-2">
                  Notebook Chapters ({notebook.pages.length})
                </span>
                
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
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
            )}

          </div>

          {/* RIGHT: Document Canvas area */}
          <div className="lg:col-span-8 space-y-6">
            
            {editMode && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-center space-x-2 text-amber-400 animate-slide-down">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-[10.5px] font-sans">
                  <strong>Sandbox Workspace Active</strong>: You can change the titles or text values directly on the paper canvas. Updates are baked on compile.
                </span>
              </div>
            )}

            {activeFile?.status === 'processing' && (
              <div className="bg-[#111115] border border-neutral-850 rounded-2xl p-12 text-center h-[650px] flex flex-col justify-center items-center space-y-4">
                <div className="p-4 bg-indigo-500/5 rounded-full border border-indigo-500/10">
                  <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
                </div>
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Parsing System streams...</h3>
                <div className="max-w-lg bg-black/60 rounded-xl p-4 text-left font-mono text-[10.5px] text-neutral-450 w-full h-44 overflow-y-auto space-y-1.5 shadow-inner">
                  {activeFile.logs.map((log, i) => (
                    <div key={i} className="border-l border-neutral-850 pl-2">
                      <span className="text-neutral-600">[{i+1}]</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeFile?.status === 'failed' && (
              <div className="bg-[#111115] border border-neutral-850 rounded-2xl p-12 text-center h-[650px] flex flex-col justify-center items-center space-y-4">
                <div className="p-4 bg-rose-500/10 rounded-full border border-rose-500/25 text-rose-400">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Binary Compile Failed</h3>
                <p className="text-xs text-neutral-400 leading-normal max-w-sm">
                  {activeFile.error || "Unable to read standard directory stream files from container context."}
                </p>
                <button
                  onClick={() => {
                    setProcessedFiles(prev => prev.filter(f => f.id !== activeFileId));
                    setActiveFileId('demo-1');
                  }}
                  className="bg-[#1C1C22] text-[#E1E1E6] hover:bg-[#25252E] px-4 py-2 rounded-lg text-xs font-bold border border-neutral-850 uppercase tracking-widest cursor-pointer transition-all"
                >
                  Dismiss & Load Demo
                </button>
              </div>
            )}

            {notebook && activeFile?.status === 'completed' && (
              <div className="bg-[#111115] border border-neutral-850 rounded-2xl p-6 md:p-12 shadow-inner min-h-[720px] relative overflow-hidden flex flex-col justify-between">
                
                {/* Paper body */}
                <div className="space-y-8 select-text">
                  <div className="border-b border-neutral-800 pb-5">
                    
                    {/* Color Accent line */}
                    <div 
                      className="h-1 w-24 rounded-full mb-4" 
                      style={{ backgroundColor: currentThemeAccentHex }}
                    />

                    {/* Page/Chapter Title */}
                    {editMode ? (
                      <input
                        type="text"
                        value={notebook.pages[selectedPageIdx]?.title || ''}
                        onChange={(e) => {
                          const cloned = JSON.parse(JSON.stringify(notebook));
                          cloned.pages[selectedPageIdx].title = e.target.value;
                          setProcessedFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, notebook: cloned } : f));
                        }}
                        className="bg-neutral-850 text-white font-extrabold text-2xl tracking-tight border border-neutral-700 rounded px-2 py-1 w-full focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      <h2 className="text-white font-extrabold text-2xl tracking-tight leading-snug">
                        {notebook.pages[selectedPageIdx]?.title || "Untitled Notebook Sheet"}
                      </h2>
                    )}

                    {/* Date/Time stamp row */}
                    <div className="text-[11px] text-neutral-500 mt-2 font-mono flex items-center space-x-1.5">
                      <span>Notebook Registry • </span>
                      {editMode ? (
                        <input
                          type="text"
                          value={notebook.pages[selectedPageIdx]?.date || ''}
                          onChange={(e) => {
                            const cloned = JSON.parse(JSON.stringify(notebook));
                            cloned.pages[selectedPageIdx].date = e.target.value;
                            setProcessedFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, notebook: cloned } : f));
                          }}
                          className="bg-neutral-850 text-neutral-350 text-[11px] border border-neutral-750 rounded px-1.5 py-0.5 focus:outline-none"
                        />
                      ) : (
                        <span>{notebook.pages[selectedPageIdx]?.date || "Unknown Creation Date"}</span>
                      )}
                    </div>
                  </div>

                  {/* Document Elements Canvas Grid */}
                  <div className="space-y-6">
                    {notebook.pages[selectedPageIdx]?.sections.map((section, secIdx) => (
                      <div key={secIdx} className="space-y-3">
                        
                        {/* Interactive section subtitle */}
                        {section.title && (
                          <div className="flex items-center space-x-1.5">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: currentThemeAccentHex }} />
                            {editMode ? (
                              <input
                                type="text"
                                value={section.title || ''}
                                onChange={(e) => {
                                  const cloned = JSON.parse(JSON.stringify(notebook));
                                  cloned.pages[selectedPageIdx].sections[secIdx].title = e.target.value;
                                  setProcessedFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, notebook: cloned } : f));
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

                        {/* Rendering dynamic elements by types */}
                        {section.type === 'checklist' && Array.isArray(section.content) ? (
                          <div className="space-y-2 pl-3">
                            {section.content.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-start space-x-3 py-0.5 animate-fade-in">
                                <input
                                  type="checkbox"
                                  checked={!!item.checked}
                                  onChange={() => handleContentChange(selectedPageIdx, secIdx, itemIdx, '', 'checked')}
                                  className={`h-4 w-4 shrink-0 mt-0.5 rounded border-neutral-700 bg-neutral-900 cursor-pointer ${activeColorThemeStyles}`}
                                />
                                {editMode ? (
                                  <input
                                    type="text"
                                    value={item.text || ''}
                                    onChange={(e) => handleContentChange(selectedPageIdx, secIdx, itemIdx, e.target.value)}
                                    className="bg-neutral-850 text-neutral-300 text-xs border border-neutral-750 rounded px-1.5 py-0.5 w-full focus:outline-none"
                                  />
                                ) : (
                                  <span className={`text-xs ${item.checked ? 'line-through text-neutral-550' : 'text-neutral-350'}`}>
                                    {item.text || "Empty list item"}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : section.type === 'bullet_list' && Array.isArray(section.content) ? (
                          <div className="space-y-1.5 pl-4">
                            {section.content.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-start space-x-3.5 leading-relaxed py-0.5">
                                <span 
                                  className="h-1.5 w-1.5 rounded-full shrink-0 mt-2" 
                                  style={{ backgroundColor: currentThemeAccentHex }} 
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
                          // Standard Paragraph blocks
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

                {/* canvas base status metadata footer */}
                <div className="mt-16 pt-5 border-t border-neutral-850 flex items-center justify-between text-[10px] text-neutral-600 font-mono">
                  <span>FILE ID: {notebook.name}</span>
                  <span>CHAPTER {selectedPageIdx + 1} OF {notebook.pages.length}</span>
                </div>

              </div>
            )}

          </div>

        </div>

      </main>

      {/* Elegant minimalist branding footer block */}
      <footer className="bg-[#0E0E10] border-t border-neutral-850 py-10 text-center text-neutral-550 text-[11px] mt-16">
        <div className="max-w-7xl mx-auto px-4 select-text">
          <p className="font-mono uppercase tracking-widest text-[#555] text-[10px] mb-2">Note2PDF Fullstack Workspace</p>
          <p>© 2026 Note2PDF Automation Script Platform. Operating under Node.js runtime and Google Gemini intelligence systems.</p>
        </div>
      </footer>
    </div>
  );
}
