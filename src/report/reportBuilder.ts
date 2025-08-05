import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import type { ReportData } from '../../types';

// ─── Register Handlebars Helpers ──────────────────────────────────────────────
Handlebars.registerHelper('eq', (a, b) => a === b);
Handlebars.registerHelper('notEq', (a, b) => a !== b);
Handlebars.registerHelper('gt', (a, b) => a > b);
Handlebars.registerHelper('lt', (a, b) => a < b);
Handlebars.registerHelper('and', (a, b) => a && b);
Handlebars.registerHelper('or', (a, b) => a || b);
Handlebars.registerHelper('inc', (value) => parseInt(value) + 1);
Handlebars.registerHelper('json', (context) => JSON.stringify(context, null, 2));
Handlebars.registerHelper('eachLink', function (items, options) {
    if (!Array.isArray(items) || items.length === 0) {
        return new Handlebars.SafeString('<p>No internal links found.</p>');
    }
    const links = items.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('');
    return new Handlebars.SafeString(`<ul>${links}</ul>`);
});

// ─── Build HTML Report ────────────────────────────────────────────────────────
export async function buildReport(data: ReportData, outputDir: string) {
    const templatePath = path.join(__dirname, './templates/base.html');
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found: ${templatePath}`);
    }

    const rawTemplate = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(rawTemplate);

    // ─── Sanitize Inputs ───────────────────────────────────────────────────────
    const safeData: ReportData = {
    url: data.url || '',
    pageTitle: data.pageTitle || '',
    pageScreenshot: data.pageScreenshot || '',
    metadata: Array.isArray(data.metadata) ? data.metadata : [],
    internalLinks: Array.isArray(data.internalLinks) ? data.internalLinks : [],
    accessibilityReport: {
        ...data.accessibilityReport,
        violations: Array.isArray(data.accessibilityReport?.violations) ? data.accessibilityReport.violations : [],
        incomplete: Array.isArray(data.accessibilityReport?.incomplete) ? data.accessibilityReport.incomplete : [],
        passes: Array.isArray(data.accessibilityReport?.passes) ? data.accessibilityReport.passes : [],
        inapplicable: Array.isArray(data.accessibilityReport?.inapplicable) ? data.accessibilityReport.inapplicable : [],
    },
    lighthouseReport: {
        ...data.lighthouseReport,
        audits: Array.isArray(data.lighthouseReport?.audits) ? data.lighthouseReport.audits : [],
        scores: data.lighthouseReport?.scores || {}
    },
    a11yTotals: data.a11yTotals || { violations: 0, incomplete: 0, passes: 0, inapplicable: 0 },
    lighthouseTotals: data.lighthouseTotals || { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 }
};


    const finalHtml = compiledTemplate(safeData);
    const timestamp = Date.now();
    const outputPath = path.join(outputDir, `audit-report-${timestamp}.html`);

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, finalHtml, 'utf-8');

    console.log(`[  💾  ] Report written to ${outputPath}`);
}
