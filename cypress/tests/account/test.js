var utils = require('../utils.js')
var username = utils.username
var password = utils.password
var env = utils.env
var ofEndpoint = Cypress.config('baseUrl') + "/datafeed/api/v1/outageFeeds"
var contenttype = utils.contenttype
var KUBRAtenantId = utils.KUBRAtenantId
var InvalidKUBRAtenantId = utils.InvalidKUBRAtenantId
var callbackQueue = ["outages-qa"]
var nonExistCallbackQueue = ["outages"]

let outagefeedid = 0;
let dependencyid = utils.generateUUID();

describe('Create outagefeed api', { tags: '@smoke' }, () => {
  it('POST current outagefeed', { tags: '@api' }, () => {
    cy.request({
      method: 'POST',
      failOnStatusCode: false,
      url: ofEndpoint,
      auth: {
        username: username,
        password: password,
      },
      body: {
        name: 'outage-feed' + '0' + Math.floor((Math.random() * 999) + 1),
      },
      headers: {
       // 'Content-Type': contenttype,
        'KUBRA-tenantId': KUBRAtenantId,
      },
    }).should((response) => {
      expect(response.status).to.eq(201) // Check response status
      cy.log(JSON.stringify(response.body)) // log response body data
      cy.log(response.body._links.self.href)
      outagefeedid = response.body._links.self.href
    })

  })
})