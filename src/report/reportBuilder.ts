import fs from 'fs';
import path from 'path';
import { ReportData } from '../../types';
import { generateInternalLinksSection } from './sections/internalLinks';
import { generateAccessibilitySection } from './sections/accessibility';
import { generateMetadataSection } from './sections/metadata';
import { generateLighthouseSection } from './sections/lighthouse';

function loadBaseTemplate(): string {
  const htmlTemplatePath = path.resolve(__dirname, '../report/templates/base.html');
  return fs.readFileSync(htmlTemplatePath, 'utf-8');
}

function injectIntoTemplate(
  html: string,
  {
    tabButtons = '',
    tabContents = '',
    url,
    timestamp,
  }: {
    tabButtons: string;
    tabContents: string;
    url: string;
    timestamp: string | number;
  }
): string {
  return html
    .replace('{{TAB_BUTTONS}}', tabButtons)
    .replace('{{TAB_CONTENTS}}', tabContents)
    .replace('{{PAGE_URL}}', url)
    .replace('{{TIMESTAMP}}', new Date(timestamp).toLocaleString());
}

export function buildFullReport(reportData: ReportData): string {
  const { url, timestamp, metadata, internalLinks, accessibilityReport, lighthouseResults } = reportData;
  const html = loadBaseTemplate();

  const tabs = [
    { id: 'metadata', label: 'Metadata', count: Object.keys(metadata).length || 0 },
    { id: 'links', label: 'Internal Links', count: internalLinks.length || 0 },
    { id: 'accessibility', label: 'Accessibility', count: accessibilityReport?.violations?.length || 0 },
    { id: 'lighthouse', label: 'Lighthouse', count: lighthouseResults ? Object.keys(lighthouseResults).length : 0 },
  ];

  const tabButtons = tabs
    .map(({ id, label, count }) =>
      `<button class="tablinks" onclick="openTab(event, '${id}')">${label} <span class="count">${count}</span></button>`
    )
    .join('');


  const tabContents = [
    generateMetadataSection(metadata),
    generateInternalLinksSection(internalLinks),
    generateAccessibilitySection(accessibilityReport),
    generateLighthouseSection(lighthouseResults),
  ].join('\n');

  return injectIntoTemplate(html, { tabButtons, tabContents, url, timestamp });
}

export function buildIndividualReports(reportData: ReportData): Record<string, string> {
  const { url, timestamp, metadata, internalLinks, accessibilityReport, lighthouseResults } = reportData;
  const baseHtml = loadBaseTemplate();

  

  return {
    'metadata-report.html': injectIntoTemplate(baseHtml, {
      tabButtons: `<button class="tablinks active">Metadata</button>`,
      tabContents: generateMetadataSection(metadata),
      url,
      timestamp,
    }),
    'links-report.html': injectIntoTemplate(baseHtml, {
      tabButtons: `<button class="tablinks active">Internal Links</button>`,
      tabContents: generateInternalLinksSection(internalLinks),
      url,
      timestamp,
    }),
    'accessibility-report.html': injectIntoTemplate(baseHtml, {
      tabButtons: `<button class="tablinks active">Accessibility</button>`,
      tabContents: generateAccessibilitySection(accessibilityReport),
      url,
      timestamp,
    }),
    'lighthouse-report.html': injectIntoTemplate(baseHtml, {
      tabButtons: `<button class="tablinks active">Lighthouse</button>`,
      tabContents: generateLighthouseSection(lighthouseResults),
      url,
      timestamp,
    }),
  };
}
