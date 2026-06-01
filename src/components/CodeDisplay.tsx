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
    <div className="bg-[#0E0E10] border border-neutral-800 rounded-xl shadow-2xl flex flex-col h-full overflow-hidden">
      {/* File Select Tab Bar */}
      <div className="flex items-center justify-between bg-[#0A0A0B] border-b border-neutral-800 px-4 py-2 flex-wrap gap-2">
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
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
                  IsActive
                    ? 'bg-[#16161A] text-indigo-400 font-bold shadow-inner border border-neutral-800'
                    : 'text-neutral-450 hover:text-white hover:bg-[#16161A]/40'
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
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#16161A] hover:bg-[#1E1E24] text-neutral-300 hover:text-white font-semibold text-xs border border-neutral-800 shadow-xl cursor-pointer transition-all active:scale-95"
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
      <div className="bg-black/20 text-neutral-500 font-mono text-[10px] px-5 py-2 border-b border-neutral-850 flex justify-between items-center select-all">
        <span>Project Path: <strong className="text-neutral-450 font-normal">{activeFileData.path}</strong></span>
        <span className="uppercase text-[9px] text-indigo-450 bg-indigo-550/5 px-2 py-0.5 rounded font-bold border border-indigo-500/10">
          {activeFileData.lang}
        </span>
      </div>

      {/* Code Body */}
      <div className="flex-1 overflow-auto bg-black p-4 font-mono text-xs text-neutral-300 leading-relaxed flex select-text">
        {/* Line numbers column */}
        <div className="text-neutral-600 text-right pr-4 select-none border-r border-neutral-850 font-light tracking-tight leading-relaxed">
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
            let colorClass = 'text-neutral-300';
            if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
              colorClass = 'text-neutral-550 italic';
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
