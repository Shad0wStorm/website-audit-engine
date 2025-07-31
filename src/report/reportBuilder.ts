// src/report/reportBuilder.ts
import fs from 'fs';
import path from 'path';

interface ReportData {
  url: string;
  metadata: Record<string, any>;
  lighthouseReport: Record<string, any>;
  accessibilityReport: Record<string, any>;
}

export function buildReport(reportData: ReportData, outputPath: string): void {
  const html = generateHTMLReport(reportData);
  const fileName = `audit-report-${Date.now()}.html`;
  const filePath = path.join(outputPath, fileName);

  fs.writeFileSync(filePath, html);
  console.log(`✅ Report saved to ${filePath}`);
}

function generateHTMLReport(data: ReportData): string {
  const templatePath = path.resolve(__dirname, '../report/templates/base.html');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  let template = fs.readFileSync(templatePath, 'utf-8');

  // Inject the dynamic values
  template = template
    .replace('{{url}}', data.url)
    .replace('{{metadata}}', `<pre>${JSON.stringify(data.metadata, null, 2)}</pre>`)
    .replace('{{lighthouseReport}}', `<pre>${JSON.stringify(data.lighthouseReport, null, 2)}</pre>`)
    .replace('{{accessibilityReport}}', `<pre>${JSON.stringify(data.accessibilityReport, null, 2)}</pre>`);

  return template;
}
