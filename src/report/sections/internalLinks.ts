// Internal Links
export function generateInternalLinksSection(internalLinks: string[]): string {
    return `
    <section id="internal-links" class="report-card">
        <h2>🔗 Internal Links (${internalLinks.length})</h2>
        <ul>
            ${internalLinks.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('')}
        </ul>
    </section>
    `;
}
