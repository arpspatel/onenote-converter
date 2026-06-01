/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, AlertTriangle, CheckCircle2, Terminal } from 'lucide-react';
import { ConverterConfig } from '../types';

interface TerminalSimulatorProps {
  config: ConverterConfig;
}

export function TerminalSimulator({ config }: TerminalSimulatorProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [demoPdfUrl, setDemoPdfUrl] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const triggerSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    setDemoPdfUrl(null);
    setLogs([]);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setProgress(0);
    setLogs([]);
    setDemoPdfUrl(null);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (!isRunning) return;

    const buildToolLabel = config.buildTool.toUpperCase();
    const javaVersion = config.jdkVersion;
    const asposeVer = config.asposeVersion;

    const steps = [
      {
        delay: 400,
        log: `[INFO] Initializing environment checklist...`,
      },
      {
        delay: 800,
        log: `[INFO] Found Java Development Kit (JDK) compliant with target standard: compiler target v${javaVersion}.`,
      },
      {
        delay: 1200,
        log: config.buildTool === 'maven'
          ? `[INFO] Executing Maven goal: "mvn compile exec:java" ...\n[INFO] Parsing pom.xml manifest metadata...`
          : config.buildTool === 'gradle'
            ? `[INFO] Bootstrapping Gradle Daemon process...\n[INFO] Loading build.gradle script...`
            : `[INFO] Running standalone java launch utility...`,
      },
      {
        delay: 1800,
        log: `[INFO] Scanning for registered external repositories...
[INFO] Resolving artifacts for groupId: com.aspose, artifactId: aspose-note, version: ${asposeVer} ...`,
      },
      {
        delay: 2400,
        log: `[INFO] Downloading dependency metadata: com.aspose:aspose-note:${asposeVer}:jdk17
📡 Connected to: https://releases.aspose.com/java/repo/
⏬ Loaded (24.8 MB of 24.8 MB) - 100% complete
[INFO] Dependency resolved successfully and mapped into classpath!`,
      },
      {
        delay: 3100,
        log: `[compiler] Compiling 1 source files to target classes...\n[compiler] OneNoteToPdfConverter.class generated!`,
      },
      {
        delay: 3800,
        log: `====================================================================
  Aspose.Note for Java -- OneNote to PDF Conversion Script Engine  
====================================================================
🔧 Target Input:  ${config.inputFileName}
Target Output: ${config.outputFileName}
====================================================================`,
      },
      {
        delay: 4400,
        log: `⚡ [1/3] Loading input Microsoft OneNote repository...`,
      },
      {
        delay: 4800,
        log: config.isPasswordProtected
          ? `🔑 Password metadata detected. Invoking decryption load options...\n🔓 Decryption successful!`
          : `ℹ️ Note loading: Direct unencrypted stream reading initialized.`,
      },
      {
        delay: 5300,
        log: `🚀 Success: File parsed into memory structure! Total elements: 4 active outline nodes, 1 handwriting stroke canvas.`,
      },
      {
        delay: 5900,
        log: `⚙️ [2/3] Injecting high-fidelity PDF export parameters...
📌 PDF Compliance Standard: ${config.pdfCompliance === 'None' ? 'Standard 1.5' : config.pdfCompliance}
Quality compression factor: ${config.jpegQuality}% JPEG compression`,
      },
      {
        delay: 6400,
        log: config.fontFolder.trim()
          ? `📁 Registered custom user font directory: ${config.fontFolder.trim()}`
          : `🔍 Map system fonts: Standard sans-serif mapped to Helvetica/Arial, monospace mapped to Courier.`,
      },
      {
        delay: 6800,
        log: config.pageRange.trim()
          ? `✂️ Sub-sheet filter: Custom page extraction range applied: [${config.pageRange}]`
          : `📋 Multi-sheet layout: Auto-binding all page blocks sequentially.`,
      },
      {
        delay: 7400,
        log: `💾 [3/3] Commencing layout grid render to binary PDF stream...
Rasterizing internal layout boxes... Done.
Preserving anchor images and paragraph vectors... Done.`,
      },
      {
        delay: 8200,
        log: `\n✨ SUCCESS: Conversion Process Completed!
📂 Binary Destination: /usr/workspace/${config.outputFileName}`,
      },
    ];

    let currentStep = 0;
    let timer: NodeJS.Timeout;

    const runStep = () => {
      if (currentStep >= steps.length) {
        setIsRunning(false);
        setProgress(100);
        // Create simple mock preview canvas representation
        setDemoPdfUrl('success');
        return;
      }

      const step = steps[currentStep];
      setLogs((prev) => [...prev, step.log]);
      setProgress(Math.round(((currentStep + 1) / steps.length) * 100));
      currentStep++;

      const nextDelay = currentStep < steps.length ? steps[currentStep].delay - steps[currentStep - 1].delay : 600;
      timer = setTimeout(runStep, Math.max(nextDelay, 200));
    };

    timer = setTimeout(runStep, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [isRunning]);

  return (
    <div className="bg-[#0E0E10] text-neutral-350 rounded-xl border border-neutral-800 shadow-2xl p-6 font-mono text-xs overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-neutral-850 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="font-bold text-xs uppercase tracking-widest text-[#E1E1E6]">Converter Simulation CLI Sandbox</span>
        </div>
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
        </div>
      </div>

      <div className="mb-4 text-neutral-500 leading-relaxed text-[11.5px] font-sans">
        Test your script configuration inside our secure emulation sandbox. This simulates how the compiled Java code runs, loads files, resolves the external Aspose repository coordinates, and renders the layout.
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mb-5 font-sans">
        <button
          id="btn-trigger-simulator"
          onClick={triggerSimulation}
          disabled={isRunning}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer ${
            isRunning
              ? 'bg-[#16161A] text-emerald-400 cursor-not-allowed border border-emerald-500/10'
              : 'bg-emerald-600 hover:bg-emerald-500 text-black shadow-lg shadow-emerald-500/5 active:scale-95'
          }`}
        >
          {isRunning ? (
            <>
              <div className="animate-spin border-2 border-emerald-400 border-t-transparent rounded-full h-3.5 w-3.5"></div>
              <span>Executing Script ({progress}%)</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Simulate Run on Your PC</span>
            </>
          )}
        </button>

        {(logs.length > 0 || demoPdfUrl) && (
          <button
            id="btn-reset-simulator"
            onClick={resetSimulation}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#16161A] lg:hover:bg-[#1E1E24] text-neutral-450 hover:text-white text-xs border border-neutral-850 cursor-pointer transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Logs</span>
          </button>
        )}
      </div>

      {/* Progress Line */}
      {isRunning && (
        <div className="w-full bg-neutral-850 h-1.5 rounded-full mb-4 overflow-hidden">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Terminal logs container */}
      <div
        ref={logContainerRef}
        className="bg-black/60 backdrop-blur-md rounded-lg p-4 h-[240px] overflow-y-auto border border-neutral-850 font-mono text-[11px] leading-relaxed text-neutral-300 space-y-2 select-text shadow-inner"
      >
        {logs.length === 0 ? (
          <div className="text-neutral-600 h-full flex flex-col items-center justify-center text-center px-4 font-sans space-y-2">
            <Terminal className="h-8 w-8 text-neutral-700 stroke-[1.5]" />
            <p>Terminal idle. Click "Simulate Run" above to start the layout compiler compilation.</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap animate-fade-in border-l-2 border-neutral-800 pl-2.5 py-0.5">
              {log}
            </div>
          ))
        )}
      </div>

      {/* Success Simulation Container */}
      {demoPdfUrl && (
        <div className="mt-5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 animate-fade-in text-neutral-300">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-heading font-bold uppercase tracking-wider text-[#A1E4C0] text-xs">
                Simulation Completed Safely!
              </h4>
              <p className="font-sans text-[11px] text-neutral-450 leading-normal">
                PDF successfully constructed with high-fidelity margins. Ready to convert your actual OneNote notebooks on your server. Click the <strong className="text-neutral-300">"Download Project .ZIP"</strong> tool on the sidebar to get your final configured Java codebase!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
