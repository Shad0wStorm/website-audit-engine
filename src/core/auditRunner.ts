// src/core/auditRunner.ts
import { chromium } from 'playwright';
import { runA11yScan } from './accessibilityScan';
import { runLighthouseAudit } from './lighthouseRunner';
import { crawlInternalLinks } from './crawler';
import { scrapeMetadata } from './metadataScraper';
import { buildFullReport } from '../report/reportBuilder';
import { defaultConfig } from '../config/default.config';
import { getErrorMessage } from '../utils/errorHandler';
import type { ReportData } from '../../types/index';
import path from 'path';
import fs from 'fs';

export async function runAudit(url: string, outputDir: string = defaultConfig.outputDir) {
    console.log(`\n[ 🔍 ] Starting audit for: ${url}\n`);

    let datetime = new Date().toLocaleString();

    try {
        console.log('[ 🧠 ] Scraping metadata...');
        const metadata = await scrapeMetadata(url);

        console.log('[ 🌐 ] Launching browser for link crawl...');
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });

        const pageTitle = await page.title();

        console.log('[ 🎦  ] Taking page screenshot...');
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
        let lighthouseResults: any = null;
        try {
            lighthouseResults = await runLighthouseAudit(url);
        } catch (err) {
            console.warn(`[  ⚠️  ] Lighthouse audit failed for ${url}: ${getErrorMessage(err)}`);
        }
        

        const reportData: ReportData = {
            url,
            timestamp: datetime,
            metadata,
            internalLinks,
            accessibilityReport,
            lighthouseResults,
        };

        console.log('[ 🛠️ ] Building report...');
        await buildFullReport(reportData);

        console.log(`\n✅ Audit complete! Report saved to '${outputDir}'\n`);
    } catch (err) {
        console.error(`[ ❌ ] Failed to audit ${url}: ${getErrorMessage(err)}`);
    }
}
