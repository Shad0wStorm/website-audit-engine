// CLI: accepts URL, flags, etc.

import { Command } from 'commander';
import { runAudit } from '../core/auditRunner';
import chalk from 'chalk';

const program = new Command();

program
    .name('website-audit-engine')
    .description('Run an audit on a single website')
    .version('0.1.0')
    .requiredOption('-u, --url <url>', 'URL of the website to audit')
    .option('-o, --output <folder>', 'Output folder', 'reports')
    .action(async (options) => {
        console.log(chalk.blue(` Starting audit for: ${options.url}`));
        await runAudit(options.url, options.output);
    });

program.parseAsync(process.argv);