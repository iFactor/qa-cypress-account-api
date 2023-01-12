// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands'
import 'cypress-axe'
import 'fs'
import "cypress-real-events/support"
import "cypress-localstorage-commands"
//require('cypress-dark')
require('cypress-xpath')
require('@cypress/skip-test/support')
require('cypress-grep')()
require('cypress-terminal-report/src/installLogsCollector')();
const moment = require('moment');
const addContext = require('mochawesome/addContext');


before(() => {
  window.logCalls = 1;
  });


Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false
})

// Overwrite log function to include additional info by default
Cypress.Commands.overwrite('log', (originalFn, message) => {
  Cypress.log({
    displayName: `--- ${window.logCalls}. ${message} ---`,
    name: `--- ${window.logCalls}. ${message} ---`,
    message: ''
  });
  window.logCalls++;
});

//Runs after a test completes
Cypress.on('test:after:run', (test, runnable) => {
  cy.log('Test run ended on : ' + new moment().format('MM-DD-YYYY HH:mm:ss'));
  const spec_title = runnable.parent.title;

  console.log("spec_title :", spec_title);
  console.log("test.state  :", test.state);
  console.log("Cypress.spec.name  :", Cypress.spec.name);
  console.log("test.title  :", test.title);

  if (test.state === 'failed') {
    addContext({ test }, {
      title: 'Failing Screenshot: ' + '>> screenshots/' + Cypress.spec.name + '/' + spec_title + ' -- ' + test.title + ' (failed)' + '.png <<',
      value: 'screenshots/' + Cypress.spec.name + '/' + spec_title + ' -- ' + test.title + ' (failed)' + '.png',
    })
  }
  if (test.state === 'failed') {
    addContext({ test }, {
      title: 'Test Run Video: ' + '>> videos\\' + Cypress.spec.name + '.mp4 <<',
      value: 'videos/' + Cypress.spec.name + '.mp4'
    })
  }

})