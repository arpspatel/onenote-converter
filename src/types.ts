/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BuildTool = 'maven' | 'gradle' | 'standalone';

export interface ConverterConfig {
  buildTool: BuildTool;
  asposeVersion: string;
  jdkVersion: string;
  inputFileName: string;
  outputFileName: string;
  saveLayout: 'standard' | 'one-page-pdf' | 'custom-size';
  pageWidth: number; // in inches/points
  pageHeight: number; // in inches/points
  pdfCompliance: 'Pdf15' | 'PdfA1a' | 'PdfA1b' | 'None';
  jpegQuality: number;
  fontFolder: string;
  pageRange: string; // e.g. "0, 1, 3"
  isPasswordProtected: boolean;
  passwordValue: string;
}

export interface GeneratedCode {
  javaCode: string;
  buildFile: string; // pom.xml or build.gradle or shell command
  readme: string;
  runScript: string;
}

export interface OnePageSection {
  type: 'paragraph' | 'bullet_list' | 'checklist' | 'table';
  title?: string;
  content: any; // Can be string[] for paragraphs/bullets, checklist items {text, checked}[], or tables
}

export interface OnePage {
  title: string;
  date: string;
  sections: OnePageSection[];
}

export interface OneNotebook {
  name: string;
  summary: string;
  pages: OnePage[];
  engine: string;
}

export interface SimStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  logLines: string[];
}
