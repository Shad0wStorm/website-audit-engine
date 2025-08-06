// Lighthouse
import { LighthouseReport } from '../../../types';

export function generateLighthouseSection(report: LighthouseReport): string {
    return `
    <section id="lighthouse" class="report-card">
        <h2>🚦 Lighthouse Scores</h2>
        <div class="lighthouse-scores">
            <div><strong>Performance:</strong> ${report.performance}</div>
            <div><strong>Accessibility:</strong> ${report.accessibility}</div>
            <div><strong>Best Practices:</strong> ${report.bestPractices}</div>
            <div><strong>SEO:</strong> ${report.seo}</div>
            ${report.pwa !== undefined ? `<div><strong>PWA:</strong> ${report.pwa}</div>` : ''}
        </div>
        <div class="lighthouse-report">
            <details>
                <summary>Full Lighthouse Report</summary>
                <iframe srcdoc="${report.fullReportHtml}" style="width: 100%; height: 600px; border: none;"></iframe>
            </details>
        </div>
    </section>
    `;
}
