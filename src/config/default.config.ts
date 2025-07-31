// Configs (scan depth, toggles, themes)
import path from "path";

export interface ReportConfig {
    outputDir: string;
    reportName: string;
    includePasses: boolean;
    includeIncomplete: boolean;
    jsonOnly: boolean;
    openAfterReport: boolean;
}

export const defaultConfig: ReportConfig = {
    outputDir: path.resolve(__dirname, '../../reports'),
    reportName: 'accessibility-report',
    includePasses: true,
    includeIncomplete: true,
    jsonOnly: false,
    openAfterReport: false,
}