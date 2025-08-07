// CLI: accepts URL, flags, etc.

import { Command } from 'commander';
import { runAudit } from '../core/auditRunner';
import chalk from 'chalk';
import fs from 'fs';
import { generateHtmlReport } from '../report/reportBuilder';

const program = new Command();

program
    .command('test')
    .name('website-audit-engine')
    .description('Run an audit on a single website')
    .version('0.1.0')
    .requiredOption('-u, --url <url>', 'URL of the website to audit')
    .option('-o, --output <folder>', 'Output folder', 'reports')
    .action(async (options) => {
        console.log(chalk.blue(` Starting audit for: ${options.url}`));
        await runAudit(options.url, options.output);
    });

// Add subcommand for HTML regeneration
program
    .command('html')
    .description('Regenerate HTML report from a JSON report file')
    .action(async (options) => {
        const dateTime = new Date().toISOString().replace(/:/g, '-');
        const jsonPath = './.tmp/audit_report.json';
        const outputPath = `./reports/audit_report_${dateTime}.html`;
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        await generateHtmlReport(
            outputPath,
            data.url,
            data.metadata,
            data.accessibility,
            Array.isArray(data.internalLinks) ? data.internalLinks : []
        );
        console.log(`✅ HTML report generated: ${outputPath}`);
    });

program.parseAsync(process.argv);