import yargs from 'yargs';

export interface CliOptions {
    script: string;
    site: string;
    element: string;
    text: string;
    output: 'full' | 'plain';
}

export function createOptions(): CliOptions {
    return yargs
        .usage(
            'Usage: ts-node e2e_cli.ts [--script command] [-s roadmap.sh] [-t cypress]'
        )
        .env('CYPRESSE2E')
        .option('script', {
            describe: 'NPM script to be executed. E.G.: command|cy',
            type: 'string',
            default: 'command',
            demandOption: false,
        })
        .option('site', {
            alias: 's',
            describe: 'A site to be opened. E.G.: roadmap.sh',
            type: 'string',
            default: 'https://roadmap.sh/',
            demandOption: false,
        })
        .option('element', {
            alias: 'e',
            describe: 'An element to br clicked. E.G.: QA',
            type: 'string',
            default: 'QA',
            demandOption: false,
        })
        .option('text', {
            alias: 't',
            describe: 'A text to be searched on page. E.G.: Cypress',
            type: 'string',
            default: 'Cypress',
            demandOption: false,
        })
        .option('output', {
            describe: 'Console output type.',
            choices: ['full', 'plain'],
            default: 'full' as CliOptions['output'],
            demandOption: false,
        }).argv;
}
