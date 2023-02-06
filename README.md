# qa-cypress-account api
Cypress framework for account api

# Cypress - Test Framework

![](cypress.png)

Test Automation Framework using Cypress.io.

# Supports
* Run tests against different environments (dev, qa, prod)
* Developer interactive runs
* Headless runs via cli command
* Mochawesome reports
* Video of failed runs captured
* Failed Screenshots captured 
* Data driven tests
* Retries of failed tests
* API tests

## Pre-requisites

- A recent version of [Node.js](https://nodejs.org/en/), installed via the official installer or the package manager of your choice.
- [Git](https://git-scm.com/), if you're a Windows user and haven't already installed it.
- A local copy of your project's Git repository.
- A code editor that supports [Intellisense code completion](https://docs.cypress.io/guides/tooling/IDE-integration.html#Intelligent-Code-Completion), such as [VS Code](https://code.visualstudio.com/).


# Setup
* Open this project in any IDE (Visual Studio Code)
* Open Terminal in Visual Studio Code & type in: `npm install cypress --save-dev`
* To verify if Cypress has been installed correctly, on the terminal type in: `npx cypress verify`

# Running Tests
## To Run the tests in the Test Runner in Interactive mode and with optional browser to run

####dev environment:
```
npx cypress open --env configFile=dev
```

####qa environment:
```
npx cypress open --env configFile=qa
```

####prod environment:
```
npx cypress open --env configFile=prod
```

## To Run the tests in Headless Mode and with optional browser to run

####dev environment:
```
node runner.js cypress run --env configFile=dev --browser chrome
```

####qa environment:
```
node runner.js cypress run --env configFile=qa
```

#### To Run the tests in Headless Mode and with optional browser and optional test to run
```
node runner.js cypress run --env configFile=qa --browser chrome --spec "cypress/tests/UI/instance_manager_tests.spec.js"
```

####prod environment:
```
node runner.js cypress run --env configFile=prod
```

## Other ways to run tests (defined in package.json):

```
npm run qa:open // same as cypress open --env configFile=qa

npm run dev:open // same as cypress open --env configFile=dev

npm run prod:open // same as cypress open --env configFile=prod

npx cypress open --config testFiles="C:\_Automation\_Cypress\cypress\tests\UI\map_tests.spec.js" //run a single test spec
```

## Run and Record to Cypress Dashboard:
```
node runner.js cypress run --env configFile=prod --record --key bde7e404-2f2e-4876-97f9-c2848e89158e //for running all the tests set for prod in this example.

node runner.js cypress run --env configFile=prod --record --key bde7e404-2f2e-4876-97f9-c2848e89158e --spec "testFile.spec.js //for running specific spec file.
```

# Writing Tests

For full description on how to use the Cypress API, refer to this [documentation](https://docs.cypress.io/api/api/table-of-contents.html)

# Tips & Tricks

### Updating Cypress
> * When a new version of Cypress becomes available, you can update it using `npm install --save-dev cypress@x.y.z`, where `x.y.z` is the version of Cypress (e.g. `8.4.10`) you want to install.

### Credentials using environment variables
When working with credentials, even on a non-production site, you should avoid committing them to Git/GitHub.

Authentication credentials can be set up using environment variables.
For getting started on that, see https://docs.cypress.io/guides/guides/environment-variables

When working locally, you can create a local environment variables file to contain sensitive information that you don't want to commit to GitHub.
A template file named `cypress.env.dist` has been provided containing all the sensitive fields that must be populated to run the tests locally.
This file should be renamed to `cypress.env.json` and populated with values from LastPass. This file is already in the GitIgnore file, so it will not show in your list of modified files.

#### Example cypress.env.json - these values are examples. Please retrieve actual values from Lastpass.
```json
{
	"auth_audience": "https://test.kubra.com/", // The audience for retrieving oauth token
	"auth_url": "https://some.auth0.endpoint.com/oauth/token",  // The oauth/token endpoint
	"auth_client_id": "xxxxxxxxxxxxxxxxxx", // The Client ID for retrieving oauth token
	"auth_username": "test@kubra.com", // The username for retrieving oauth token
	"auth_password": "testabc123!" // The password for retrieving oauth token
}
```
### How to use the common Auth Token or retrieve a new token using custom options

A Cypress command has been added that can retrieve tokens from an Auth0 token endpoint. This command can be used to retrieve a good token from
default values set in the environment variables or it can be used with custom options to retrieve a token from any endpoint you want.
#### Retrieving a new token

The options for the Request can be overriden with your own definition. Anything supported by Cypress's Request should be acceptable.
See the [official Cypress docs](https://docs.cypress.io/api/commands/request#Syntax) for other options.

Below is an example where a token is retrieved using client_credentials using values from the Cypress environment variables.

```javascript
const options = {
    method: 'POST',
    url: Cypress.env('auth_url'),
    body: {
      grant_type: 'client_credentials',
      audience: Cypress.env('auth_audience'),
      client_id: Cypress.env('auth_client_id'),
      client_secret: Cypress.env('auth_client_secret')
    },
  };


### Location of swift user credentials

> * KUBRA.IO Basic Auth Auth0 Application Credentials under the Shared-SwiftServiceAccounts folder in LastPass

### How to run a test multiple times to prove it is stable

> * Can add the testing block inside a loop. Cypress is bundled with a few libraries, lodash can do this using: Cypress._.times method. Below example will run 10 times:

```javascript
> * Cypress._.times(10, () => {
  describe('Description', () => {
    it('runs multiple times', () => {
      //the rest of the test
    });
  });
});
```
### How to skip a test based on platform, browser or a url)

> *https://github.com/cypress-io/cypress-skip-test

```javascript
describe('Prod Map Smoke Test 01', () => {
  it('MapSmoke01', function () {
    cy.skipOn('windows') // will not run on Windows
    // the rest of the test
```

### Continues the test only when running on Mac, skips when running on any other platform
```javascript
it('runs on Mac only', () => {
  cy.onlyOn('mac')
  // the rest of the test
})
```

### Database Query execution

A task is being created in plugins/index.js - "queryMySqlDb" which can execute a query against a mysql database.
```javascript
  on('task', {
    queryMySqlDb: query => {
      return queryMySqlDb(query, config)
    }
  });
```
The usage of this task is:

```javascript
cy.task('queryMySqlDb', query)
```

### Database Initialization before and after tests

Setting up the database with necessary values at the very beginning before executing any test is attained at support/index.js by using the above Database query execution
It runs script from a sql script file before and after tests are executed.
```javascript
before(() => { // Executes before any tests are executed - can be used for setting up environment for the tests
  ......
  ExecuteMySqlScriptFromFile('relative/path/to/file');
  ......
}

after(() => { // Executes after all tests are executed - can be used for cleaning up reside after tests
  ......
  ExecuteMySqlScriptFromFile('relative/path/to/file');
  ......
}
```

## Helpful Tip List:
1. Use cy.contains('selector', 'element text') to make element selection more specific.
cy.contains can accept the selector and text of the element you want to interact with or run an assertion, making your locator more specific.
2. Use cy.get('input[type="text"]').type('some text{enter}') to type and automatically press enter after typing. I use this a lot when testing search functionalities to test apps as real users use it.
3. Use cy.get('selector').should('be.visible').click() to be sure you are interacting with an element only when it’s surely visible.
The @Cypress_io team recommends mixing assertions and commands to make your tests more robust, so I do that every time I need it.
4. Use cy.intercept('VERB' 'url').as('someAlias') to alias a request that should happen in the future
// Some code that triggers the previously aliased intercept.
Then, use cy.wait('@someAlias') to continue with the test only after the aliased request has been made.
5. Use cy.request('POST', 'apiUrl', payloadObject) to create the app state in an optimized way.
This way, your test is more focused, and it doesn't lose time creating the state via the graphical user interface, which is time-consuming.

## Plug-Ins Used:
See links for install and usage information.

- cypress-drag-drop (https://www.npmjs.com/package/@4tw/cypress-drag-drop)
- cypress-axe (https://www.npmjs.com/package/cypress-axe)
- cypress-skip-test (https://www.npmjs.com/package/@cypress/skip-test)
- cypress-xpath (https://www.npmjs.com/package/cypress-xpath)
- cypress-dark (https://www.npmjs.com/package/cypress-dark)
- cypress-grep (https://github.com/bahmutov/cypress-grep)
- find-cypress-specs (https://www.npmjs.com/package/find-cypress-specs)
- cypress-terminal-report (https://www.npmjs.com/package/cypress-terminal-report)
- cypress-real-events (https://github.com/dmtrKovalenko/cypress-real-events)