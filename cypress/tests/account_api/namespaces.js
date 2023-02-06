import { env as _env, PostCall, GetCall, PutCall, DeleteCall, namespacesEndpoint, invalidNamespacesEndpoint } from '../utils.js';
let namespaceid = 0;

describe('CRUD operations', { tags: '@smoke' }, () => {  

    it('Create namespace', { tags: '@api' }, () => {

        PostCall(namespacesEndpoint,
            {
                name: 'namespace' + '0' + Math.floor((Math.random() * 999) + 1),
                description: "Description",
                country: "US"
            })
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                cy.log(response.body.id)
                expect(JSON.stringify(response.body.name)).to.deep.includes('namespace0')
                namespaceid = response.body.id
            })
    })

    it('Get specific namespace', { tags: '@api' }, () => {
        GetCall( namespacesEndpoint + '/'+ namespaceid )
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Get all namespace', { tags: '@api' }, () => {
        GetCall(namespacesEndpoint)
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Update namespace', { tags: '@api' }, () => {
        PutCall(namespacesEndpoint + '/'+ namespaceid,
            { 
                name: 'updatednamespace' + '1' + Math.floor((Math.random() * 999) + 1),
            })
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.name)).to.deep.includes('namespace1')
            })
    })

    it('Delete namespace', { tags: '@api' }, () => {
        DeleteCall(namespacesEndpoint + '/'+ namespaceid)
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data    
            })
    })
})

describe('Negetive tests', () => {
    let negitiveNamespaceid = 0
    before(() => {
        PostCall(namespacesEndpoint,
            {
                name: 'names' + '0' + Math.floor((Math.random() * 999) + 1),
                description: "Description",
                country: "US"
            })
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status               
                negitiveNamespaceid = response.body.id
            })
    })

    after(() => {
        DeleteCall(namespacesEndpoint + '/' + namespaceid)
            .then((response) => {
                expect(response.status).to.eq(204) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data    
            })
    })

    it('Create Namespaceid with invalid endpoint', { tags: '@api' }, () => {
        PostCall(invalidNamespacesEndpoint,
            {
                name: 'namespace' + '0' + Math.floor((Math.random() * 999) + 1),
                description: "Description",
                country: "US"
            })
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data  
            })
    })

    it('Create Namespaceid with invalid data', { tags: '@api' }, () => {
        PostCall(namespacesEndpoint,
            {
                name: "XYZ",
                description: null,
            })
            .then((response) => {
                expect(response.status).to.eq(400) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data  
            })
    })

    it('GET all balancefeed when invalid endpoint', { tags: '@api' }, () => {
        GetCall(invalidNamespacesEndpoint)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })
})
