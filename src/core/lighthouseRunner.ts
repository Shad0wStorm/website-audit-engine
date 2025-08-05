import fs from 'fs/promises';
import path from 'path';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

/**
 * Run Lighthouse audit with a Chrome launcher.
 */
export async function runLighthouseAudit(url: string): Promise<any | null> {
  const reportPath = path.resolve(__dirname, '../../.tmp/lighthouse-report.json');
  const chrome = await launch({ chromeFlags: ['--headless'] });

  const flags: any = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port
  };

  try {
    const result = await lighthouse(url, flags);

    if (!result || !result.report) {
      console.warn('[Lighthouse] No result or report returned');
      await chrome.kill();
      return null;
    }

    const reportJson = result.report as string;
    await fs.writeFile(reportPath, reportJson, 'utf-8');
    await chrome.kill();

    return JSON.parse(reportJson);
  } catch (err) {
    console.error('[Lighthouse] Audit failed:', err);
    await chrome.kill();
    return null;
  }
}
