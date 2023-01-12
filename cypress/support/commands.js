// ***********************************************
// For more info on custom commands:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@4tw/cypress-drag-drop'
import "cypress-localstorage-commands"
require('cy-verify-downloads').addCustomCommand()

Cypress.Commands.add('loginWithAuth0', (overrides = {}) => {
  Cypress.log({
    name: 'loginWithAuth0',
  });

  const options = {
    method: 'POST',
    url: Cypress.env('auth_url'),
    body: {
      grant_type: 'password',
      username: Cypress.env('auth_username'),
      password: Cypress.env('auth_password'),
      audience: Cypress.env('auth_audience'),
      client_id: Cypress.env('auth_client_id'),
      client_secret: Cypress.env('auth_client_secret'),
    },
  };

  // allow us to override defaults with passed in overrides
  Cypress._.extend(options, overrides);

  cy.request(options);
});

Cypress.Commands.add('loginSACC', (user, password) => {
  cy.visit('/login')
  cy.wait(6000)
  cy.get('body').then((body) => {
    if (body.find('#\\31 -email').length > 0) {
      cy.get('#\\31 -email').type(user)
      cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type(password)
      cy.get('.auth0-label-submit').click()
    } else {
      //assert.isOk('everything','everything is OK');
      cy.get('#module-selection-stormcenter-label').click()
      cy.get('#module-selection-submit').click()

    }
  })
})

Cypress.Commands.add('viewportPreset', (size = '') => {
  switch (size) {
    case 'samsung-s10-plus':
      cy.viewport(412, 869)
      break
    case 'iphone-se':
      cy.viewport(375, 667)
      break
    case 'ipad-pro':
      cy.viewport(1366, 1024)
      break
    case 'ms-surface':
      cy.viewport(1280, 720)
      break
    case 'full-hd':
      cy.viewport(1920, 1080)
      break
    case 'imac':
      cy.viewport(2560, 1440)
      break
    default:
      cy.viewport(Cypress.env('viewportWidth'), Cypress.env('viewportHeight'))
  }
});