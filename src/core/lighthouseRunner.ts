// Lighthouse Integration (optional)

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

/**
 * Runs Lighthouse CLI for a given URL and returns parsed JSON results.
 * @param url Website URL to audit
 * @returns Lighthouse audit result as JSON
 */

export async function runLighthouseAudit(url: string): Promise<any> {
    const outputPath = path.resolve(__dirname, '../../.tmp/lighthouse-report.json');

    const command =  `lighthouse "${url}" --output json --output-path="${outputPath}" --quiet --chrome-flags="--headless"`;

    try {
        await execAsync(command);
        const raw = await fs.promises.readFile(outputPath, 'utf-8');
        const report = JSON.parse(raw);

        return report;
    } catch (error) {
        console.error(`[Lighthouse] Failed to run audit:`, error);
        return null;
    }
}