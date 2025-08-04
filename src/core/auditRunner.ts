// src/core/auditRunner.ts
import { runA11yScan } from './accessibilityScan';
import { runLighthouseAudit } from './lighthouseRunner';
import { scrapeMetadata } from './metadataScraper';
import { buildReport } from '../report/reportBuilder';
import { defaultConfig } from '../config/default.config';

import type { ReportData } from '../../types/index';

export async function runAudit(url: string, outputDir: string = defaultConfig.outputDir) {
    console.log(`\n[ 🔍 ] Starting audit for: ${url}\n`);

    try {
        console.log('[ 🧠 ] Scraping metadata...');
        const metadata = await scrapeMetadata(url);

        console.log('[ ♿ ] Running accessibility scan...');
        const accessibilityReport = await runA11yScan(url);

        await new Promise(r => setTimeout(r, 500));

        console.log('[ 💡 ] Running Lighthouse audit...');
        const lighthouseReport = await runLighthouseAudit(url);

        const reportData: ReportData = {
            url,
            metadata,
            accessibilityReport,
            lighthouseReport,
            a11yTotals,
            lighthouseTotals
        };

        console.log('[ 🛠️ ] Building report...');
        await buildReport(reportData, outputDir);

        console.log(`\n✅ Audit complete! Report saved to '${outputDir}'\n`);
    } catch (err) {
        console.error(`[ ❌ ] Failed to audit ${url}:`, err);
    }
}
