/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ConverterConfig, BuildTool } from '../types';
import { Settings, Shield, FileCode, Sliders, Layers, RefreshCw } from 'lucide-react';

interface ConfigurationPanelProps {
  config: ConverterConfig;
  onChange: (config: ConverterConfig) => void;
  onReset: () => void;
}

export function ConfigurationPanel({ config, onChange, onReset }: ConfigurationPanelProps) {
  const handleBuildToolChange = (buildTool: BuildTool) => {
    onChange({ ...config, buildTool });
  };

  const handleTextChange = (field: keyof ConverterConfig, value: string | number | boolean) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-indigo-500" />
          <h3 className="font-heading font-semibold text-slate-800 text-sm">Configure Script Parameters</h3>
        </div>
        <button
          id="btn-restore-config-defaults"
          onClick={onReset}
          className="flex items-center space-x-1.5 px-2 py-1 text-[11px] text-slate-500 hover:text-indigo-600 rounded-md hover:bg-indigo-50/50 transition-colors font-medium border border-transparent hover:border-indigo-100"
          title="Restore standard script configuration metrics"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Build Tool Select */}
      <div className="space-y-2">
        <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
          Target Integration Build Tool
        </label>
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
          {(['maven', 'gradle', 'standalone'] as BuildTool[]).map((tool) => (
            <button
              id={`btn-select-tool-${tool}`}
              key={tool}
              type="button"
              onClick={() => handleBuildToolChange(tool)}
              className={`py-2 text-[11px] font-semibold rounded-md transition-all uppercase tracking-wide cursor-pointer ${
                config.buildTool === tool
                  ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              {tool}
            </button>
          ))}
        </div>
      </div>

      {/* File settings section */}
      <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-100 space-y-4">
        <div className="flex items-center space-x-1.5 text-slate-700">
          <FileCode className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">File & Assets Setup</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-600">Input OneNote Filename</label>
            <input
              id="input-filename-one"
              type="text"
              value={config.inputFileName}
              onChange={(e) => handleTextChange('inputFileName', e.target.value)}
              placeholder="e.g. Notebook.one"
              className="w-full text-xs bg-white text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg px-3 py-2 outline-none transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-600">Output PDF Filename</label>
            <input
              id="input-filename-pdf"
              type="text"
              value={config.outputFileName}
              onChange={(e) => handleTextChange('outputFileName', e.target.value)}
              placeholder="e.g. ExportedNotes.pdf"
              className="w-full text-xs bg-white text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg px-3 py-2 outline-none transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* Page conversion specs */}
      <div className="space-y-4">
        <div className="flex items-center space-x-1.5 text-slate-700">
          <Sliders className="h-4 w-4 text-slate-500" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Conversion & Compress Options</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-600">
              PDF Compliance Level
            </label>
            <select
              id="select-pdf-compliance"
              value={config.pdfCompliance}
              onChange={(e) => handleTextChange('pdfCompliance', e.target.value as any)}
              className="w-full text-xs bg-white text-slate-800 border border-slate-200 focus:border-indigo-500 rounded-lg px-3 py-2 cursor-pointer outline-none font-sans"
            >
              <option value="None">Standard PDF 1.5</option>
              <option value="Pdf15">Acrobat 1.5 Compliance</option>
              <option value="PdfA1a">PDF/A-1a standard (Archival)</option>
              <option value="PdfA1b">PDF/A-1b standard (Archival)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-600">
              Page Range Subset <span className="text-[10px] text-slate-400 font-normal">(optional indices: e.g. "0, 1")</span>
            </label>
            <input
              id="input-page-range"
              type="text"
              value={config.pageRange}
              onChange={(e) => handleTextChange('pageRange', e.target.value)}
              placeholder="Leave empty for all pages"
              className="w-full text-xs bg-white text-slate-800 border border-slate-200 focus:border-indigo-500 rounded-lg px-3 py-2 outline-none font-mono"
            />
          </div>
        </div>

        {/* JPEG quality slider */}
        <div className="space-y-1.5 bg-slate-50/40 p-4 border border-slate-100 rounded-lg">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-medium text-slate-600">JPEG Compression Quality</label>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {config.jpegQuality}%
            </span>
          </div>
          <input
            id="slider-jpeg-quality"
            type="range"
            min="20"
            max="100"
            step="5"
            value={config.jpegQuality}
            onChange={(e) => handleTextChange('jpegQuality', parseInt(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>High Compression (Draft)</span>
            <span>Balanced</span>
            <span>Lossless Quality</span>
          </div>
        </div>
      </div>

      {/* Advanced Security & Decoding */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-slate-700">
            <Shield className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Decryption (Encrypted Files)</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              id="checkbox-password-enable"
              type="checkbox"
              checked={config.isPasswordProtected}
              onChange={(e) => handleTextChange('isPasswordProtected', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {config.isPasswordProtected && (
          <div className="space-y-1 bg-rose-50/30 p-2.5 rounded-lg border border-rose-100 animate-slide-down">
            <label className="block text-[10px] font-medium text-slate-500">Decryption Key Password</label>
            <input
              id="input-password-value"
              type="text"
              value={config.passwordValue}
              onChange={(e) => handleTextChange('passwordValue', e.target.value)}
              placeholder="Enter OneNote Encryption password"
              className="w-full text-xs bg-white text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 rounded-lg px-2.5 py-1.5 outline-none font-mono"
            />
          </div>
        )}
      </div>

      {/* Advanced environment settings */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center space-x-1.5 text-slate-700">
          <Layers className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Library & OS SDK Versions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] font-medium text-slate-500">Aspose.Note v(Java)</label>
            <select
              id="select-aspose-version"
              value={config.asposeVersion}
              onChange={(e) => handleTextChange('asposeVersion', e.target.value)}
              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-1.5 outline-none"
            >
              <option value="24.12">24.12 (Latest stable)</option>
              <option value="24.6">24.6 (Balanced)</option>
              <option value="23.12">23.12 (Long Term)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-medium text-slate-500">Target JDK standard</label>
            <select
              id="select-jdk-version"
              value={config.jdkVersion}
              onChange={(e) => handleTextChange('jdkVersion', e.target.value)}
              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-1.5 outline-none"
            >
              <option value="17">Java 17 (Recommended)</option>
              <option value="21">Java 21 LTS</option>
              <option value="11">Java 11 (Legacy)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-medium text-slate-500">
            Custom Font Paths <span className="text-slate-400 font-normal">(Recommended if running inside quiet Linux boxes)</span>
          </label>
          <input
            id="input-font-folder"
            type="text"
            value={config.fontFolder}
            onChange={(e) => handleTextChange('fontFolder', e.target.value)}
            placeholder="e.g. /usr/share/fonts/truetype"
            className="w-full text-xs text-slate-700 bg-white border border-slate-200 focus:border-indigo-500 rounded-lg p-2 outline-none font-mono"
          />
        </div>
      </div>
    </div>
  );
}
