import { PostCall, namespacesEndpoint } from "../utils"

describe('Authentication testing',()=>{

    describe('Token generation testing',()=>{
        it('invalid user', () => {
            generateOAuthToken(Cypress.env('auth_url'),
                'user1@gmail.com',
                Cypress.env('auth_password'),
                Cypress.env('auth_audience'),
                Cypress.env('auth_client_id'),
                Cypress.env('auth_client_secret'),
                403,
                'Wrong email or password.')
        })

        it('empty user',()=>{
            generateOAuthToken(Cypress.env('auth_url'),
                '',
                Cypress.env('auth_password'),
                Cypress.env('auth_audience'),
                Cypress.env('auth_client_id'),
                Cypress.env('auth_client_secret'),
                400,
                'Wrong email or password.')
        })

        it('invalid password',()=>{
            generateOAuthToken(Cypress.env('auth_url'),
                Cypress.env('auth_username'),
                'xyz1234',
                Cypress.env('auth_audience'),
                Cypress.env('auth_client_id'),
                Cypress.env('auth_client_secret'),
                403,
                'Wrong email or password.')
        })

        it('empty password',()=>{
            generateOAuthToken(Cypress.env('auth_url'),
                Cypress.env('auth_username'),
                '',
                Cypress.env('auth_audience'),
                Cypress.env('auth_client_id'),
                Cypress.env('auth_client_secret'),
                400,
                'Wrong email or password.')
        })

        it('invalid audience',()=>{
            generateOAuthToken(Cypress.env('auth_url'),
                Cypress.env('auth_username'),
                Cypress.env('auth_password'),
                'https://google.com',
                Cypress.env('auth_client_id'),
                Cypress.env('auth_client_secret'),
                403,
                'Wrong audience.')
        })

        it('empty audience',()=>{
            generateOAuthToken(Cypress.env('auth_url'),
                Cypress.env('auth_username'),
                Cypress.env('auth_password'),
                Cypress.env('auth_audience'),
                '',
                Cypress.env('auth_client_secret'),
                401,
                'Wrong audience.')
        })

        it('invalid client-id',()=>{
            generateOAuthToken(Cypress.env('auth_url'),
                Cypress.env('auth_username'),
                Cypress.env('auth_password'),
                Cypress.env('auth_audience'),
                'abcxyz12345',
                Cypress.env('auth_client_secret'),
                401,
                'Wrong client-id.')
        })

        it('empty client-id',()=>{
            generateOAuthToken(Cypress.env('auth_url'),
                Cypress.env('auth_username'),
                Cypress.env('auth_password'),
                Cypress.env('auth_audience'),
                '',
                Cypress.env('auth_client_secret'),
                401,
                'Wrong client-id.')
        })

        it('invalid client-secret',()=>{
            generateOAuthToken(Cypress.env('auth_url'),
                Cypress.env('auth_username'),
                Cypress.env('auth_password'),
                Cypress.env('auth_audience'),
                Cypress.env('auth_client_id'),
                'abcxyz12345',
                401,
                'Wrong client-secret.')
        })

        it('empty client-secret',()=>{
            generateOAuthToken(Cypress.env('auth_url'),
                Cypress.env('auth_username'),
                Cypress.env('auth_password'),
                Cypress.env('auth_audience'),
                Cypress.env('auth_client_id'),
                '',
                401,
                'Wrong client-secret.')
        })
    })

    describe('API call authentication with token', ()=> {
        it('Authentication for invalid auth token',()=> {
            PostCall(namespacesEndpoint,
                {
                    name: 'namespace' + '0' + Math.floor((Math.random() * 999) + 1),
                    description: "Description",
                    defaultcountry: "US"
                },   { bearer: `kjswefsdfsdvmdvskdvkgnghyumyh`})
                .then((response) => {
                    expect(response.status).to.eq(401) // Check response status               
                })
        })
    
        it('Authentication for empty auth token',()=> {
            PostCall(namespacesEndpoint,
                {
                    name: 'namespace' + '0' + Math.floor((Math.random() * 999) + 1),
                    description: "Description",
                    defaultcountry: "US"
                },   { bearer:''})
                .then((response) => {
                    expect(response.status).to.eq(401) // Check response status               
                })
        })
    })
})

function generateOAuthToken(_url, _username, _password, _audiance, _client_id, _client_secret, expectedstatus, expectedErrormsg) {
    const options = {
        method: 'POST',
        failOnStatusCode: false,
        url: _url,
        body: {
          grant_type: 'password',
          username: _username,
          password: _password,
          audience: _audiance,
          client_id: _client_id,
          client_secret: _client_secret,
        },
      };
    
      return cy.request(options).then((response) =>{
        cy.log(JSON.stringify(response.body));
      })
}

