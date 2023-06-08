import * as fs from 'fs';
import * as os from 'os';
import boxen, {Options} from 'boxen';
import chalk from 'chalk';
import moment from 'moment';
import report from 'multiple-cucumber-html-reporter';
import {exec} from 'child_process';
import {createOptions} from './cli/createOptions';
import {PassThrough, Transform} from 'stream';

const options = createOptions();

const boxenOptions: Options = {
    borderStyle: 'classic',
    borderColor: 'green',
    margin: 1,
    padding: 1,
};

// noinspection JSCheckFunctionSignatures
const taGreeting = chalk.white.bold('E2E Automation Tests.'),
    atGreetingBox = boxen(taGreeting, boxenOptions),
    initial = moment(),
    data_initial = initial.format('DD/MM/YYYY HH:mm:ss'),
    text = options.text,
    url = options.site,
    element = options.element,
    npmScript = options.script;

/**
 * Define process environments variables
 */
process.stdout.write(atGreetingBox + '\n');

process.env.CYPRESS_E2E_PROJECT = 'E2E Automation Tests';
process.env.CYPRESS_E2E_REPORT_FOLDER =
    'E2E' + '_' + initial.format('DD-MM-YYYY_HH-mm-ss');
process.env.CYPRESS_E2E_FRONTEND_TEXT = text;
process.env.CYPRESS_E2E_FRONTEND_ELEMENT = element;
process.env.CYPRESS_E2E_FRONTEND_URL = url;

const dirPath = '.tmp/' + process.env.CYPRESS_E2E_REPORT_FOLDER;

try {
    process.stdout.write(
        'Project: ' + process.env.CYPRESS_E2E_PROJECT + '\n'
    );
    process.stdout.write(`NPM script: ${npmScript}` + '\n');
    process.stdout.write(`Site URL: ${url}` + '\n');
    process.stdout.write(`Element clicked: ${element}` + '\n');
    process.stdout.write(`Text searched: ${text}` + '\n');
    process.stdout.write(`Execution start: ${data_initial}` + '\n');

    if (!fs.existsSync(`${dirPath}` + '/report')) {
        fs.mkdirSync(`${dirPath}` + '/report', {recursive: true});
    }

    const command = `npm run ${npmScript}`,
        env = {...process.env};

    if (options.output === 'plain') env.NO_COLOR = '1';

    const bigCommand = exec(command, {env});

    bigCommand.stdout.pipe(removeSpecialChars()).pipe(process.stdout);
    bigCommand.stderr.pipe(removeSpecialChars()).pipe(process.stderr);

    bigCommand.on('exit', async (code, signal) => {
        process.stdout.write('\n' + `Exit code: ${code}`);

        if (code !== null) {
            const conclusion = moment();
            const duration = moment()
                .hours(0)
                .minutes(0)
                .seconds(0)
                .add(conclusion.diff(initial, 'seconds'), 'seconds');

            process.stdout.write('\n\n');
            process.stdout.write(
                'Execution conclusion: ' +
                conclusion.format('DD/MM/YYYY HH:mm:ss') +
                '\n'
            );
            process.stdout.write(
                'Duration: ' + duration.format('HH[h]mm[m]ss[s]')
            );

            const reportOptionsCucumber = {
                jsonDir: `${dirPath}`,
                reportPath: `${dirPath}` + '/report',
                reportName: 'E2E Automation Execution Report',
                pageTitle: 'E2E Automation Execution Report',
                automaticallyGenerateReport: true,
                openReportInBrowser: false,
                saveCollectedJSON: true,
                pageFooter: '<div><p>  </p></div>',
                disableLog: false,
                displayDuration: true,
                displayReportTime: true,
                durationInMS: false,
                browserName: 'chrome',
                metadata: {
                    browser: {
                        name: 'chrome',
                    },
                    device:
                        process.env.DESKTOP_SESSION +
                        '.' +
                        process.env.HOSTNAME +
                        '.' +
                        process.env.USERNAME,
                    platform: {
                        name: os.version().substring(0, 7),
                        version: os.release(),
                    },
                },
                customData: {
                    title: 'Run info',
                    data: [
                        {
                            label: 'Project',
                            value: process.env.CYPRESS_E2E_PROJECT,
                        },
                        {
                            label: 'NPM Script',
                            value: npmScript,
                        },
                        {
                            label: 'Site URL',
                            value: url,
                        },
                        {
                            label: 'Element clicked',
                            value: element,
                        },
                        {
                            label: 'Text searched',
                            value: text,
                        },
                        {
                            label: 'Execution start',
                            value: data_initial,
                        },
                        {
                            label: 'Execution end',
                            value: conclusion.format('DD/MM/YYYY HH:mm:ss'),
                        },
                        {
                            label: 'Duration',
                            value: duration.format('HH[h]mm[m]ss[s]'),
                        },
                    ],
                },
            };
            process.stdout.write('\n');
            report.generate(reportOptionsCucumber);

            process.exit(code);
        } else {
            process.stdout.write('\n' + `Signal: ${signal}`);
            process.exit(1);
        }
    });
} catch (err) {
    console.error('\nAutomation execution failed!\nCheck connectivity.\n');
    console.error(err);
    process.exit(1);
}

function removeSpecialChars() {
    if (options.output === 'plain') {
        return new Transform({
            transform(chunk, encoding, callback) {
                callback(null, strip(chunk));
            },
        });
    }
    return new PassThrough();

    function strip(chunk: Buffer) {
        return chunk
            .toString('utf8')
            .replace(/│/g, '|')
            .replace(/[┌┐└┘├┤]/g, '+')
            .replace(/─/g, '-')
            .replace(/[√✔]/g, 'v')
            .replace(/✖/g, 'x')
            .replace(/…/g, '...');
    }
}
