// Title, headings, meta, images
import { chromium, Browser, Page } from "playwright";

export type Metadata = {
    title: string | null;
    description: string | null;
    canonical: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    ogUrl: string | null;
};

/**
 * 
 * @param url 
 * @returns 
 */
export async function scrapeMetadata(url: string): Promise<Metadata> {
    let browser: Browser | null = null;

    try {
        browser = await chromium.launch({ headless: true });
        const page: Page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const metadata: Metadata = await page.evaluate(() => {
            const getMeta = (name: string, attr = 'name') =>
                document.querySelector(`meta[${attr}="${name}"]`)?.getAttribute('content') || null;

            return {
                title: document.title || null,
                description: getMeta('description'),
                canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
                ogTitle: getMeta('og:title', 'property'),
                ogDescription: getMeta('og:description', 'property'),
                ogImage: getMeta('og:image', 'property'),
                ogUrl: getMeta('og:url', 'property'),
            };
        });
        return metadata;
    } catch (err) {
        console.error(`[MetadataScraper] Failed to scrape ${url}:`, err);
        return {
            title: null,
            description: null,
            canonical: null,
            ogTitle: null,
            ogDescription: null,
            ogImage: null,
            ogUrl: null,
        };
    } finally {
        if (browser) await browser.close();
    }
}
