import { Metadata } from '../../../types';

export function generateMetadataSection(metadata: Metadata): string {
    return `
    <section id="metadata" class="report-card">
        <h2>🧠 Metadata</h2>
        <ul>
            <li><strong>Title:</strong> ${metadata.title || 'N/A'}</li>
            <li><strong>Description:</strong> ${metadata.description || 'N/A'}</li>
            <li><strong>Canonical:</strong> ${metadata.canonical || 'N/A'}</li>
            <li><strong>OG Title:</strong> ${metadata.ogTitle || 'N/A'}</li>
            <li><strong>OG Description:</strong> ${metadata.ogDescription || 'N/A'}</li>
            <li><strong>OG Image:</strong> ${metadata.ogImage || 'N/A'}</li>
            <li><strong>OG URL:</strong> ${metadata.ogUrl || 'N/A'}</li>
        </ul>
    </section>
    `;
}
