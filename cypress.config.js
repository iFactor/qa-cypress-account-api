const { defineConfig } = require('cypress')

module.exports = defineConfig({
  theme: 'dark',
  watchForFileChanges: false,
  videoUploadOnPasses: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  followRedirect: true,
  pageLoadTimeout: 20000,
  defaultCommandTimeout: 10000,
  retries: {
    openMode: 0,
    runMode: 2,
  },
  projectId: 'yg1k74',
  chromeWebSecurity: false,
  reporter: 'mochawesome',
  reporterOptions: {
    reportFilename: 'test-report',
    reportPageTitle: 'Automation Report',
    overwrite: false,
    html: true,
    json: true,
    timestamp: 'mm-dd-yyyy_HH:MM:ss',
  },
  screenshotsFolder: 'screenshots',
  env: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    browserPermissions: {
      notifications: 'allow',
      geolocation: 'allow',
      camera: 'block',
      microphone: 'block',
      images: 'allow',
      javascript: 'allow',
      popups: 'ask',
      plugins: 'ask',
      cookies: 'allow',
    },
  },
  experimentalStudio: true,
  envName: 'qa',
  classicUrl:
    'api.qa.kubra.io/account/v1/',
  flexUrl:
    '',
  internalUrl:
    '',
  cnameUrl: '',
  secoUrl: '',
  Url1: '',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    experimentalStudio: true,
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      on('task', {
        createEmptyFileOfSize(fileName){
           const fs = require('fs');
           return new Promise((resolve, reject) => {
            fh = fs.openSync(fileName, 'w');
            fs.writeSync(fh, 'ok', Math.max(0,526870912));
            fs.closeSync(fh);
            resolve(true);
           })   
          
        }
      })
      return require('./cypress/plugins/index.js')(on, config)
    },
    specPattern: 'cypress/tests/**/*.{js,jsx,ts,tsx}',
    baseUrl: 'https://api.qa.kubra.io',
    excludeSpecPattern: ['utils.js'],
  },
})
