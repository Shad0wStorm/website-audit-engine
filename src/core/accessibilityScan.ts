// Axe-core integration
import { chromium } from 'playwright';
import axe from 'axe-core';

export async function runA11yScan(url: string) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url);

    // Inject and run axe-core    
    await page.addScriptTag({ path: require.resolve('axe-core') });

    const accessibilityScanResults = await page.evaluate(() => (window as any).axe.run());
    
    await browser.close();
    return accessibilityScanResults;
}