import * as preprocessorConfig from './cypress-cucumber-preprocessor.config';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { defineConfig } from 'cypress';
import { Formatter } from 'cucumber-json-report-formatter';
import { typecheckPlugin } from '@jgoz/esbuild-plugin-typecheck';

export default defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768,
  defaultCommandTimeout: 10000,
  videoCompression: 40,
  videoUploadOnPasses: true,
  screenshotOnRunFailure: true,

  e2e: {
    specPattern: 'cypress/e2e/**/*.{feature,ts}',
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        'file:preprocessor',
        createBundler({
          plugins: [typecheckPlugin(), createEsbuildPlugin(config)],
        })
      );

      on('after:run', async () => {
        if (!preprocessorConfig.cucumberJson.generate) return;
        const formater = new Formatter();
        await formater.parseCucumberJson(
          preprocessorConfig.messages.output,
          preprocessorConfig.cucumberJson.outputFolder +
            '/' +
            preprocessorConfig.cucumberJson.outputFile
        );
      });

      return config;
    },
  },
});
