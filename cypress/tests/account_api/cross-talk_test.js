import { env as _env, generateAccountData, PostCall, GetCall, PatchCall, DeleteCall, namespacesEndpoint } from '../utils.js'

let namespace1 = 0;
let namespace2 = 0;
let account1 = 0;
let account2 = 0;
let accountEndpointN1 = 0;
let accountEndpointN2 = 0;


describe('Namespace Cross-talk testing',()=>{

    before(() => {
        PostCall(namespacesEndpoint,
            {
                name: 'namespacesN1' + '0' + Math.floor((Math.random() * 999) + 1),
                description: "Description",
                defaultCountry: "US"
            })
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                cy.log(response.body.id)
                expect(JSON.stringify(response.body.name)).to.deep.includes('namespacesN1')
                namespace1 = response.body.id
                cy.log(namespace1)
                accountEndpointN1 = namespacesEndpoint + '/' + namespace1 + '/accounts/'
            })
    })

    before(() => {
        PostCall(namespacesEndpoint,
            {
                name: 'namespacesN2' + '0' + Math.floor((Math.random() * 999) + 1),
                description: "Description",
                defaultCountry: "CA"
            })
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                cy.log(response.body.id)
                expect(JSON.stringify(response.body.name)).to.deep.includes('namespacesN2')
                namespace2 = response.body.id
                cy.log(namespace2)
                accountEndpointN2 = namespacesEndpoint + '/' + namespace2 + '/accounts/'
            })
    })

    before(() => {
        let data_by = JSON.parse(generateAccountData());
        data_by.externalId = '1234565'
        PostCall(accountEndpointN1, data_by)
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                cy.log(response.body.externalId)
                expect(JSON.stringify(response.body.externalId))
                expect(JSON.stringify(response.body.billingAddress.streetAddress1))
                account1 = response.body.externalId
            })
    })

    before(() => {
        let data_by = JSON.parse(generateAccountData());
        data_by.externalId = '1234567'
        PostCall(accountEndpointN2, data_by)
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                cy.log(response.body.externalId)
                expect(JSON.stringify(response.body.externalId))
                expect(JSON.stringify(response.body.billingAddress.streetAddress1))
                account2 = response.body.externalId
            })
    })

    after(() => {

        let accounts = [account1,account2]
        let namespaceEndpoints = [accountEndpointN1, accountEndpointN2]
        for(let i=0; i<accounts.length; i++) {
            DeleteCall(namespaceEndpoints[i] + accounts[i])
                .then((response) => {
                    expect(response.status).to.eq(200) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data    
            })
        }
    })

    after(() => {
        let id1s = [namespace1,namespace2]
        id1s.forEach((item) => {
            DeleteCall(namespacesEndpoint + '/' + item)
                .then((response) => {
                    expect(response.status).to.eq(200) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data    
                })
        })
    })

    it('Display created Accounts and Namespaces',()=>{
        cy.log('*************************')
        cy.log(account1)
        cy.log(account2)
        cy.log(namespace1)
        cy.log(namespace2)
    })

    it('Get specific account1 with namespace2', { tags: '@api' }, () => {
        GetCall(accountEndpointN2 + account1)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Update account2 with namespace1', { tags: '@api' }, () => {
        //externalID is deleted as the generateAccountData generates a new externalID all the time which is not neccessary for this call
        let data_by = JSON.parse(generateAccountData());
        delete data_by.externalId
        cy.log(JSON.stringify(data_by))
        PatchCall(accountEndpointN1 + account2,data_by)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Delete account2 with namespace1', { tags: '@api' }, () => {
        DeleteCall(accountEndpointN1 + account2)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })
})