import fs from 'fs';
import path from 'path'
import { URL } from 'url';

interface AccessibilityResult {
    violations: any[];
    passes: any[];
    incomplete: any[];
    inapplicable: any[];
}



export async function generateHtmlReport(
    outputPath: string,
    url: string,
    metadata: any,
    accessibility: AccessibilityResult,
    internalLinks: string[]
) {
    const templatePath = path.resolve(__dirname, './templates/base.html');
    const template = fs.readFileSync(templatePath, 'utf-8');

    const domain = new URL(url);

    const html = template
        .replace('{{URL}}', domain.hostname)
        .replace('{{METADATA}}', buildMetadataSection(metadata))
        .replace('{{ACCESSIBILITY}}', buildAccessibilitySection(accessibility))
        .replace('{{INTERNAL_LINKS}}', buildInternalLinksSection(internalLinks));
    
    fs.writeFileSync(outputPath, html, 'utf-8');
}

// Internal HTML Builders here
function buildMetadataSection(metadata: any): string {
    return `<section>
        <h2>Page Metadata</h2>
        <pre>${JSON.stringify(metadata, null, 2)}</pre>
        </section>
    `;
}

function buildInternalLinksSection(links: string[]): string {
    return `
        <section>
            <h2>Internal Links</h2>
            <ul>
                ${links.map(link => `<li>${link}</li>`).join('')}
            </ul>
        </section>
    `;
}

function buildAccessibilitySection(results: AccessibilityResult): string {
    return `
        <section>
            <h2>Accessibility Audit</h2>
            ${renderCategory('Violations', results.violations)}
            ${renderCategory('Passes', results.passes)}
            ${renderCategory('Incomplete', results.incomplete)}
            ${renderCategory('Inapplicable', results.inapplicable)}
        </section>
    `;
}

function renderCategory(title: string, items:any[]): string {
    return `
        <details open>
            <summary>${title} (${items.length})</summary>
            <ul>
                ${items.map(item => `<li><strong>${item.id}</strong>: ${item.description}</li>`).join('')}
            </ul>
        </details>
    `;
}