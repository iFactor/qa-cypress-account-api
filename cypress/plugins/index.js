/// <reference types="cypress" />

const fs = require('fs-extra');
const path = require('path');
const { isFileExist, findFiles } = require('cy-verify-downloads');
const { rmdir } = require('fs')
//require('@applitools/eyes-cypress')(module);

module.exports = (on, config) => {
  on('task', { isFileExist, findFiles })
  require('cypress-terminal-report/src/installLogsPrinter')(on);
  on('before:browser:launch', (browser = {}, launchOptions) => {
    console.log(config, browser, launchOptions);
    if (browser.name === 'chrome') {
      launchOptions.args.push("--disable-features=CrossSiteDocumentBlockingIfIsolating,CrossSiteDocumentBlockingAlways,IsolateOrigins,site-per-process");
      launchOptions.args.push("--disable-gpu");
      launchOptions.args.push("--disable-software-rasterizer");
      launchOptions.args.push("--load-extension=cypress/extensions/Ignore-X-Frame-headers_v1.1");
      launchOptions.args.push("--in-process-gpu");
      //launchOptions.args.push('--auto-open-devtools-for-tabs');
    }
    return launchOptions;
  });

  function getConfigurationByFile(env) {
    const pathToConfigFile = path.resolve("cypress/config", `${env}.config.json`);

    return fs.readJson(pathToConfigFile);
  }

  const _ = require('lodash')
  const del = require('del')

  on('after:spec', (spec, results) => {
    if (results && results.video) {
      // Do we have failures for any retry attempts?
      const failures = _.some(results.tests, (test) => {
        return _.some(test.attempts, { state: 'failed' })
      })
      if (!failures) {
        // delete the video if the spec passed and no tests retried
        return del(results.video)
      }
    }
  })

  on('task', {
    log(message) {
      console.log(message)
      return null
    },
    table(message) {
      console.table(message)
      return null
    },
    generateReport(file) {
      fs.writeFile(file.filename, file.fileBody, err => {
        if (err) {
          console.error(err);
          return
        }
      })
      return null
    }
  })

  on('task', {
    deleteFolder(folderName) {
      console.log('deleting folder %s', folderName)

      return new Promise((resolve, reject) => {
        rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
          if (err) {
            console.error(err)
            return reject(err)
          }
          resolve(null)
        })
      })
    },
  })
  
  //if no environment is provided, then qa env will be default
  const env = config.env.configFile || "qa";

  return getConfigurationByFile(env);

};