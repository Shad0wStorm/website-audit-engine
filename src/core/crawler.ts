import { Page } from 'playwright';
import { URL } from 'url';

/**
 * Crawls a given page for internal links (same origin).
 * @param page Playwright Page instance
 * @param baseUrl URL to compare hostnames against
 */
export async function crawlInternalLinks(page: Page, baseUrl: string): Promise<string[]> {
	const internalLinks = new Set<string>();
	const base = new URL(baseUrl);

	const anchors = await page.$$eval('a[href]', (els) =>
		els.map((el) => (el as HTMLAnchorElement).href)
	);

	for (const href of anchors) {
		try {
			const url = new URL(href);
			if (url.hostname === base.hostname) {
				internalLinks.add(url.href);
			}
		} catch {
			// Skip malformed URLs or relative paths that failed
			continue;
		}
	}

	return Array.from(internalLinks);
}
