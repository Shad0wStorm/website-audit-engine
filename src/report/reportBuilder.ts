// src/report/reportBuilder.ts
// src/report/reportBuilder.ts
import fs from 'fs';
import path from 'path';
import { defaultConfig } from '../../src/config/default.config';
import type { ReportData } from '../../types/index';

export async function buildReport(data: ReportData, outputDir: string) {
    const {
        url,
        metadata,
        accessibilityReport,
        lighthouseReport
    } = data;

    // 🧮 Count issues
    const a11yTotals = {
        violations: accessibilityReport.violations.length,
        passes: accessibilityReport.passes?.length || 0,
        incomplete: accessibilityReport.incomplete?.length || 0,
        inapplicable: accessibilityReport.inapplicable?.length || 0,
    };

    const lighthouseTotals = {
        numErrors: (lighthouseReport.categories?.accessibility?.score ?? 1) < 1 ? 1 : 0,
        performance: lighthouseReport.categories?.performance?.score ?? 0,
        accessibility: lighthouseReport.categories?.accessibility?.score ?? 0,
        bestPractices: lighthouseReport.categories?.['best-practices']?.score ?? 0,
        seo: lighthouseReport.categories?.seo?.score ?? 0,
    };

    const finalHtml = generateHTMLReport({
        url,
        metadata,
        accessibilityReport,
        lighthouseReport,
        a11yTotals,
        lighthouseTotals
    });

    const filePath = path.join(outputDir, 'audit-report.html');
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(filePath, finalHtml, 'utf-8');

    console.log(`[ 💾 ] Report written to ${filePath}`);
}


function generateHTMLReport(data: ReportData): string {
  const templatePath = path.resolve(__dirname, '../report/templates/base.html');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  let template = fs.readFileSync(templatePath, 'utf-8');

  console.log('🎯 Inside report builder, got accessibility:', 
    data.accessibilityReport
  );

  // Inject the dynamic values
  template = template
    .replace('{{url}}', data.url)
    .replace('{{metadata}}', `<pre>${JSON.stringify(data.metadata || { note: 'no metadata'}, null, 2)}</pre>`)
    .replace('{{accessibilityReport}}', `<pre>${JSON.stringify(data.accessibilityReport || { note: 'no accessibility data' }, null, 2)}</pre>`)
    .replace('{{lighthouseReport}}', `<pre>${JSON.stringify(data.lighthouseReport || { note: 'no lighthouse data'}, null, 2)}</pre>`);

  return template;
}
