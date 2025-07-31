// src/core/auditRunner.ts
import { runA11yScan } from './accessibilityScan';
import { runLighthouseAudit } from './lighthouseRunner';
import { scrapeMetadata } from './metadataScraper';
import { buildReport } from '../report/reportBuilder';
import { defaultConfig } from '../config/default.config';

import type { ReportData } from '../../types/index'; // Assuming you've got shared types here

export async function runAudit(url: string, outputDir: string = defaultConfig.outputDir) {
    console.log(`\n[ 🔍 ] Starting audit for: ${url}\n`);

    try {
        // 1. Scrape Metadata
        console.log('[ 🧠 ] Scraping metadata...');
        const metadata = await scrapeMetadata(url);

        // 2. Run Accessibility Audit (axe-core)
        console.log('[ ♿ ] Running accessibility scan...');
        const accessibilityReport = await runA11yScan(url);

        // 3. Run Lighthouse Audit
        console.log('[ 💡 ] Running Lighthouse audit...');
        const lighthouseReport = await runLighthouseAudit(url);

        // 4. Prepare data for report builder
        const reportData: ReportData = {
            url,
            metadata,
            accessibilityReport,
            lighthouseReport,
        };

        // 5. Build HTML Report
        console.log('[ 🛠️ ] Building report...');
        await buildReport(reportData, outputDir);

        console.log(`\n✅ Audit complete! Report saved to '${outputDir}'\n`);
    } catch (err) {
        console.error(`[ ❌ ] Failed to audit ${url}:`, err);
    }
}
