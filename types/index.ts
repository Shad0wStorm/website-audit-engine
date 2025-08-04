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
    metadata: any;
    lighthouseReport: any;
    accessibilityReport: any;
    a11yTotals: any;
    lighthouseTotals: any;
}