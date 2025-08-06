// Accessibility
import { AccessibilityScanResult } from '../../../types';

export function generateAccessibilitySection(results: AccessibilityScanResult): string {
    const summary = `
    <div class="a11y-summary">
        <span>❌ Violations: ${results.violations.length}</span>
        <span>✅ Passes: ${results.passes.length}</span>
        <span>❓ Incomplete: ${results.incomplete.length}</span>
        <span>🚫 Inapplicable: ${results.inapplicable.length}</span>
    </div>`;

    const violations = results.violations.map((v, i) => `
        <details>
            <summary>${i + 1}. ${v.help} (${v.impact})</summary>
            <pre>${JSON.stringify(v, null, 2)}</pre>
        </details>
    `).join('');

    const screenshot = results.screenshotPath
        ? `<div><img src="${results.screenshotPath}" alt="Screenshot of page during accessibility scan" style="max-width: 100%;"></div>`
        : '';

    return `
    <section id="accessibility" class="report-card">
        <h2>♿ Accessibility</h2>
        ${summary}
        ${screenshot}
        <div class="a11y-violations">${violations}</div>
    </section>
    `;
}
