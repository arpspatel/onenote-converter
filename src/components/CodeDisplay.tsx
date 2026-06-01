/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, FileCode, Notebook as FileText, Terminal, Info } from 'lucide-react';
import { ConverterConfig } from '../types';
import { generateJavaCode, generateBuildFile, generateReadme, generateRunScript } from '../utils';

interface CodeDisplayProps {
  config: ConverterConfig;
}

export function CodeDisplay({ config }: CodeDisplayProps) {
  const [activeTab, setActiveTab] = useState<'java' | 'build' | 'readme' | 'run'>('java');
  const [copied, setCopied] = useState(false);

  const javaCode = generateJavaCode(config);
  const buildFile = generateBuildFile(config);
  const readme = generateReadme(config);
  const runFile = generateRunScript(config, 'sh');

  const filesConfig = {
    java: {
      name: 'OneNoteToPdfConverter.java',
      icon: FileCode,
      lang: 'java',
      content: javaCode,
      path: 'src/main/java/com/example/OneNoteToPdfConverter.java',
    },
    build: {
      name: config.buildTool === 'maven' ? 'pom.xml' : config.buildTool === 'gradle' ? 'build.gradle' : 'standalone.sh',
      icon: FileText,
      lang: config.buildTool === 'maven' ? 'xml' : 'groovy',
      content: buildFile,
      path: config.buildTool === 'maven' ? 'pom.xml' : config.buildTool === 'gradle' ? 'build.gradle' : 'standalone_download.sh',
    },
    readme: {
      name: 'README.md',
      icon: Info,
      lang: 'markdown',
      content: readme,
      path: 'README.md',
    },
    run: {
      name: 'run.sh',
      icon: Terminal,
      lang: 'bash',
      content: runFile,
      path: 'run.sh',
    },
  };

  const handleCopy = () => {
    const activeContent = filesConfig[activeTab].content;
    navigator.clipboard.writeText(activeContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const activeFileData = filesConfig[activeTab];
  const IconComponent = activeFileData.icon;

  // Generate line numbers for the display
  const lines = activeFileData.content.split('\n');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col h-full overflow-hidden">
      {/* File Select Tab Bar */}
      <div className="flex items-center justify-between bg-slate-950/60 border-b border-slate-800/80 px-4 py-2 flex-wrap gap-2">
        <div className="flex space-x-1 overflow-x-auto">
          {(['java', 'build', 'readme', 'run'] as const).map((tab) => {
            const data = filesConfig[tab];
            const IsActive = activeTab === tab;
            const TabIcon = data.icon;
            return (
              <button
                id={`btn-code-tab-${tab}`}
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${
                  IsActive
                    ? 'bg-slate-800 text-indigo-400 font-semibold shadow-inner border border-slate-700/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <TabIcon className="h-3.5 w-3.5" />
                <span>{data.name}</span>
              </button>
            );
          })}
        </div>

        {/* Copy trigger button */}
        <button
          id="btn-copy-code-content"
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800 lg:hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700/80 shadow-sm cursor-pointer transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Path Breadcrumb bar */}
      <div className="bg-slate-950/20 text-slate-500 font-mono text-[10px] px-5 py-2 border-b border-slate-800/50 flex justify-between items-center select-all">
        <span>Project Path: <strong className="text-slate-400 font-normal">{activeFileData.path}</strong></span>
        <span className="uppercase text-[9px] text-slate-600 bg-slate-950/40 px-1.5 py-0.5 rounded font-bold border border-slate-800/30">
          {activeFileData.lang}
        </span>
      </div>

      {/* Code Body */}
      <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed flex select-text">
        {/* Line numbers column */}
        <div className="text-slate-600 text-right pr-4 select-none border-r border-slate-800/30 font-light select-none tracking-tight leading-relaxed">
          {lines.map((_, idx) => (
            <div key={idx} className="h-[21px] text-[10px]">
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Code Content column */}
        <pre className="pl-4 flex-1 overflow-x-auto whitespace-pre scrolling-touch leading-relaxed">
          {lines.map((line, idx) => {
            // Apply a very rudimentary styling colorizer to highlight notes, imports, etc to make it look premium
            let colorClass = 'text-slate-300';
            if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
              colorClass = 'text-slate-500 italic';
            } else if (line.trim().startsWith('import ') || line.trim().startsWith('package ')) {
              colorClass = 'text-indigo-400';
            } else if (line.includes('public class ') || line.includes('public static void ')) {
              colorClass = 'text-amber-400';
            } else if (line.includes('new ') || line.includes('try ') || line.includes('catch ')) {
              colorClass = 'text-cyan-400';
            }

            return (
              <div key={idx} className={`h-[21px] ${colorClass}`}>
                {line || ' '}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
