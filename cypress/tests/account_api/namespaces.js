import { env as _env, _auth, PostCall, GetCall, PatchCall, DeleteCall, namespacesEndpoint, invalidNamespacesEndpoint, invalidKUBRAclientId, KubraDemoClientID} from '../utils.js';
let namespaceid = 0;

describe('CRUD operations', { tags: '@smoke' }, () => {

    it('Create namespace', { tags: '@api' }, () => {
        PostCall(namespacesEndpoint,namespaceBody)
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                cy.log(response.body.id)
                expect(JSON.stringify(response.body.name)).to.deep.includes('namespace0')
                namespaceid = response.body.id
            })
    })

    it('Get specific namespace', { tags: '@api' }, () => {
        GetCall(namespacesEndpoint + '/' + namespaceid)
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
        PatchCall(namespacesEndpoint + '/' + namespaceid,patchNamespaceBody)
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.name)).to.deep.includes('patchUpdatedNamespace0')
                expect(JSON.stringify(response.body.description)).to.deep.includes('patch description')
                expect(JSON.stringify(response.body.defaultCountry)).to.deep.includes('CA')
            })
    })

    it('Update namespace with only name field in the body', { tags: '@api' }, () => {
        PatchCall(namespacesEndpoint + '/' + namespaceid,
            {
                name: 'patchUpdatedNamespace' + '0' + Math.floor((Math.random() * 999) + 1)
            })
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.name)).to.deep.includes('patchUpdatedNamespace0')
            })
    })

    it('Update namespace with only description field in the body', { tags: '@api' }, () => {
        PatchCall(namespacesEndpoint + '/' + namespaceid,
            {
                description: "test description"
            })
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.description)).to.deep.includes('test description')
            })
    })

    it('Update namespace with only default country field in the body', { tags: '@api' }, () => {
        PatchCall(namespacesEndpoint + '/' + namespaceid,
            {
                defaultCountry: "CA"
            })
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.defaultCountry)).to.deep.includes('CA')
            })
    })

    it('Delete namespace', { tags: '@api' }, () => {
        DeleteCall(namespacesEndpoint + '/' + namespaceid)
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Get all namespace which has empty data in it', { tags: '@api' }, () => {
        GetCall(namespacesEndpoint,
            {bearer: `${Cypress.env("DefaultAuth0Token")}`},
            // ClientId which contains empty namespaces in it
            KubraDemoClientID)
            .then((response) => {
                expect(response.status).to.eq(204) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })
})

describe('Negetive tests', () => {
    let namespaceid1 = 0
    let invalidNamespaceid = namespacesEndpoint + '/1a5f1e74-2646-4703-b2e0-557efbb12345'
    let negitiveTestNamespaceid =0

    before(() => {
        PostCall(namespacesEndpoint,namespaceBody)
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                namespaceid1 = response.body.id
                negitiveTestNamespaceid = namespacesEndpoint + '/' + namespaceid1
                cy.log(negitiveTestNamespaceid)
            })
        GetCall(namespacesEndpoint)
        .then((response) => {
            expect(response.status).to.eq(200) // Check response status
            cy.log(JSON.stringify(response.body)) // log response body data
        })
    })

    after(() => {
        DeleteCall(negitiveTestNamespaceid)
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Create Namespaceid with invalid endpoint', { tags: '@api' }, () => {
        PostCall(invalidNamespacesEndpoint,namespaceBody)
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

    it('GET all namespaces when invalid endpoint', { tags: '@api' }, () => {
        GetCall(invalidNamespacesEndpoint)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('GET all namespaces when invalid clientID', { tags: '@api' }, () => {
        GetCall(namespacesEndpoint, { bearer: `${Cypress.env("DefaultAuth0Token")}`} , invalidKUBRAclientId)
            .then((response) => {
                expect(response.status).to.eq(204) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('GET namespace with invalid namespace id', { tags: '@api' }, () => {
        GetCall(invalidNamespaceid)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('GET namespace when invalid clientID', { tags: '@api' }, () => {
        //Single-tenant/client User is used, thats the reason for 401 unauthorized
        //if the credentials have Multi-tenant/client User, Then the status code is 404 not found
        GetCall(negitiveTestNamespaceid, { bearer: `${Cypress.env("DefaultAuth0Token")}`}, invalidKUBRAclientId)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Update namespace with unknown field is add', { tags: '@api' }, () => {
        //This status code might change in future 200 to 400
        PatchCall(negitiveTestNamespaceid,unknownfieldNamespace)
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.name)).to.deep.includes('patchUpdatedNamespace0')
                expect(JSON.stringify(response.body.description)).to.deep.includes('patch description')
                expect(JSON.stringify(response.body.defaultCountry)).to.deep.includes('CA')
            })
    })

    it('Update namespace with empty body', { tags: '@api' }, () => {
        //This status code might change in future 200 to 400
        PatchCall(negitiveTestNamespaceid,
            {
            })
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.name)).to.deep.includes('patchUpdatedNamespace0')
                expect(JSON.stringify(response.body.description)).to.deep.includes('patch description')
                expect(JSON.stringify(response.body.defaultCountry)).to.deep.includes('CA')
            })
    })

    it('Update namespace with null value', { tags: '@api' }, () => {
        //This status code might change in future 200 to 400
        PatchCall(negitiveTestNamespaceid,nullFieldNamespace)
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.name)).to.deep.includes('patchUpdatedNamespace0')
                expect(JSON.stringify(response.body.description)).to.deep.includes('patch description')
                expect(JSON.stringify(response.body.defaultCountry)).to.deep.includes('CA')
            })
    })

    it('Update namespace with invalid namespace id', { tags: '@api' }, () => {
        PatchCall(invalidNamespaceid,patchNamespaceBody)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Update namespace with invalid clientID', { tags: '@api' }, () => {
        //Single-tenant/client User is used, thats the reason for 401 unauthorized
        //if the credentials have Multi-tenant/client User, Then the status code is 404 not found
        PatchCall(negitiveTestNamespaceid, patchNamespaceBody,{ bearer: `${Cypress.env("DefaultAuth0Token")}`}, invalidKUBRAclientId)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Delete namespace with invalid endpoints', { tags: '@api' }, () => {
        DeleteCall(invalidNamespacesEndpoint + '/' + namespaceid1)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Delete namespace with invalid namespace ID', { tags: '@api' }, () => {
        DeleteCall(invalidNamespaceid)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })
    
    it('Delete namespace with invalid client ID', { tags: '@api' }, () => {
        //Single-tenant/client User is used, thats the reason for 401 unauthorized
        //if the credentials have Multi-tenant/client User, Then the status code is 404 not found
        cy.log(invalidKUBRAclientId)
        DeleteCall(negitiveTestNamespaceid,{ bearer: `${Cypress.env("DefaultAuth0Token")}`}, invalidKUBRAclientId)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })
})

// This body's are used in testcases above
const namespaceBody = {
    name: 'namespace' + '0' + Math.floor((Math.random() * 999) + 1),
    description: "Description",
    defaultCountry: "US"
}
const patchNamespaceBody = {
    name: 'patchUpdatedNamespace' + '0' + Math.floor((Math.random() * 999) + 1),
    description: "patch description",
    defaultCountry: "CA"
}
const unknownfieldNamespace = {
    name: 'patchUpdatedNamespace' + '0' + Math.floor((Math.random() * 999) + 1),
    description: "patch description",
    defaultCountry: "CA",
    newField:"unknown"
}
const nullFieldNamespace ={
    name: null,
    description: null,
    defaultCountry: null
}