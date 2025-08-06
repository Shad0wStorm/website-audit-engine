// --- Accessibility Types ---

export interface AxeNode {
  id: string;
  impact?: string;
  html: string;
  target: string[];
}

export interface AxeViolation {
  id: string;
  impact?: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: AxeNode[];
}

export interface AccessibilityScanResult {
  violations: AxeViolation[];
  passes: AxeViolation[];
  incomplete: AxeViolation[];
  inapplicable: AxeViolation[];
  screenshotPath?: string;
}

// --- Lighthouse Report ---

export interface LighthouseReport {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa?: number;
  fullReportHtml: string;
}

// --- Metadata ---

export interface Metadata {
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogUrl: string | null;
}

// --- Core Report Structure ---

export interface ReportData {
  url: string;
  timestamp: string;
  metadata: Metadata;
  internalLinks: string[];
  accessibilityReport: AccessibilityScanResult;
  lighthouseResults: LighthouseReport;
}

// --- Misc Types ---

export type ReportSection = string;
