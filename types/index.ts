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

export interface AxeScanResults {
    violations: AxeViolation[];
    incomplete?: AxeViolation[];
    passes?: AxeViolation[];
    url?: string;
}

export interface ReportData {
  url: string;
  pageTitle:string;
  pageScreenshot:string;
  metadata: Record<string, any>;
  internalLinks: string[];
  accessibilityReport: {
    violations: any[];
    incomplete: any[];
    passes: any[];
    inapplicable: any[];
  };
  lighthouseReport: {
    audits: any[];
    scores: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
    };
  };
  a11yTotals: {
    violations: number;
    passes: number;
    incomplete: number;
    inapplicable: number;
  };
  lighthouseTotals: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

