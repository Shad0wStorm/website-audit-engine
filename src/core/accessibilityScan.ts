// Axe-core integration
import { chromium } from 'playwright';
import axe from 'axe-core';
import fs from 'fs-extra';
import path from 'path'

export async function runA11yScan(url: string) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(url);
        console.log(`[  DEBUG ♿  ] Axe-core injected`);

        // Inject and run axe-core    
        await page.addScriptTag({ path: require.resolve('axe-core') });

        const accessibilityScanResults  = await page.evaluate(() => {
            return (window as any).axe.run({
                runOnly: [ 'wcag2a', 'wcag2aa' ],
                resultTypes: [ 'violations', 'incomplete', 'passes', 'inapplicable']
            });
        });

        console.log(`[DEBUG] Axe results collected`);
        await browser.close();

        // Write results to file
        const outDir = path.resolve('.tmp');
        const outPath = path.join(outDir, 'accessibility.json');

        await fs.ensureDir(outDir);
        await fs.writeJson(outPath, accessibilityScanResults , { spaces: 2 });

        return accessibilityScanResults;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('[A11Y SCAN FAILED]', error.message);
        } else {
            console.error('[A11Y SCAN FAILED] Unknown error:', error);
        }
        return null
    } finally {
        await browser.close();
    }
}