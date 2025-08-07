import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { chromium } from 'playwright';
import { scrapeMetadata } from '../core/metadataScraper';
import { crawlInternalLinks } from '../core/crawler';
import { runA11yScan } from '../core/accessibilityScan';
import { ensureDir, writeJSON } from '../utils/fileUtils';
import { getErrorMessage } from '../utils/errorHandler';
import { generateHtmlReport } from '../report/reportBuilder';

type AuditResults = {
  url: string;
  metadata: Record<string, any> | string;
  internalLinks: string[] | string;
  accessibility: any | string;
};

export async function runAudit(url: string, outputDir?: string): Promise<void> {
  console.log(`\n🔍 Auditing: ${url}`);
  
  const results: AuditResults = {
    url,
    metadata: '',
    internalLinks: [],
    accessibility: '',
  };

  // --- Metadata Scan ---
  try {
    results.metadata = await scrapeMetadata(url);
    console.log(`✅ Metadata scan complete.`);
  } catch (err) {
    console.error(`❌ Metadata scan failed:`, err);
    results.metadata = getErrorMessage(err);
  }

  // --- Internal Links Scan ---
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    results.internalLinks = await crawlInternalLinks(page, url);
    console.log(`✅ Internal links scan complete.`);

    await browser.close();
  } catch (err) {
    console.error(`❌ Internal link scan failed:`, err);
    results.internalLinks = getErrorMessage(err);
  }

  // --- Accessibility Scan ---
  try {
    results.accessibility = await runA11yScan(url);
    console.log(`✅ Accessibility scan complete.`);
  } catch (err) {
    console.error(`❌ Accessibility scan failed:`, err);
    results.accessibility = getErrorMessage(err);
  }

  // --- Report Output ---
  const domain = new URL(url).hostname.replace(/\./g, '_');
  const dateTime = new Date().toISOString().replace(/:/g, '-');
  const jsontemp = path.resolve('./.tmp/')
  const resolvedOutputDir = outputDir 
    ? path.resolve(process.cwd(), outputDir)
    : path.resolve(__dirname, './reports');
  ensureDir(resolvedOutputDir);

  // JSON Report
  const jsonPath = path.join(jsontemp, `audit_report.json`);
  writeJSON(jsonPath, results)
  console.log(`📄 JSON report saved: ${jsonPath}`);

  // HTML Report
  const htmlPath = path.join(resolvedOutputDir, `audit_report_${dateTime}.html`);
  generateHtmlReport(
  htmlPath,
  results.url,
  results.metadata,
  results.accessibility,
  Array.isArray(results.internalLinks) ? results.internalLinks : []
);

  console.log(`📄 HTML report saved: ${htmlPath}`);
}
