// src/core/auditRunner.ts
import { chromium } from 'playwright';
import { runA11yScan } from './accessibilityScan';
import { runLighthouseAudit } from './lighthouseRunner';
import { crawlInternalLinks } from './crawler';
import { scrapeMetadata } from './metadataScraper';
import { buildReport } from '../report/reportBuilder';
import { defaultConfig } from '../config/default.config';

import type { ReportData } from '../../types/index';
import path from 'path';
import fs from 'fs';

export async function runAudit(url: string, outputDir: string = defaultConfig.outputDir) {
    console.log(`\n[ 🔍 ] Starting audit for: ${url}\n`);

    try {
        console.log('[ 🧠 ] Scraping metadata...');
        const metadata = await scrapeMetadata(url);

        console.log('[ 🌐 ] Launching browser for link crawl...');
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const pageTitle = await page.title();

        console.log('[    ] Taking page screenshot...');
        // Create output dir if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const safeFilename = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        //const screenshotPath = path.join(outputDir, `${safeFilename}_screenshot.png`);

        const pageScreenshot = await page.screenshot({ type: 'png', fullPage: false });
        const pageScreenshotBase64 = pageScreenshot.toString('base64');


        console.log('[ 🔗 ] Running link crawler scan...');
        const internalLinks = await crawlInternalLinks(page, url);
        await browser.close();

        console.log('[ ♿ ] Running accessibility scan...');
        const accessibilityReport = await runA11yScan(url);
        await new Promise(r => setTimeout(r, 500));

        console.log('[ 💡 ] Running Lighthouse audit...');
        const lighthouseReport = await runLighthouseAudit(url);

        const a11yTotals = {
            violations: accessibilityReport?.violations?.length || 0,
            passes: accessibilityReport?.passes?.length || 0,
            incomplete: accessibilityReport?.incomplete?.length || 0,
            inapplicable: accessibilityReport?.inapplicable?.length || 0,
        };

        const lighthouseTotals = {
            performance: lighthouseReport?.categories?.performance?.score || 0,
            accessibility: lighthouseReport?.categories?.accessibility?.score || 0,
            bestPractices: lighthouseReport?.categories?.['best-practices']?.score || 0,
            seo: lighthouseReport?.categories?.seo?.score || 0,
        };

        const reportData: ReportData = {
            url,
            pageTitle,
            pageScreenshot: `data:image/png;base64,${pageScreenshotBase64}`,
            metadata,
            internalLinks,
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
