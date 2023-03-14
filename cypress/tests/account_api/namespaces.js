import { env as _env, _auth, PostCall, GetCall, PatchCall, DeleteCall, namespacesEndpoint, invalidNamespacesEndpoint, invalidKUBRAclientId, KubraDemoClientID, generateUUID} from '../utils.js';
let namespaceid1 = 0;
let namespaceid2 = 0;
let namespaceid3 = 0;
let datafeedId = generateUUID();

describe('CRUD operations', { tags: '@smoke' }, () => {
    it('Create namespace', { tags: '@api' }, () => {
        PostCall(namespacesEndpoint,namespaceBody)
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                cy.log(response.body.id)
                expect(JSON.stringify(response.body.name)).to.deep.includes('namespace0')
                namespaceid1 = response.body.id
            })
    })

    it('Get specific namespace', { tags: '@api' }, () => {
        GetCall(namespacesEndpoint + '/' + namespaceid1)
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
        PatchCall(namespacesEndpoint + '/' + namespaceid1,patchNamespaceBody)
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.name)).to.deep.includes('patchUpdatedNamespace0')
                expect(JSON.stringify(response.body.description)).to.deep.includes('patch description')
                expect(JSON.stringify(response.body.defaultCountry)).to.deep.includes('CA')
            })
    })

    it('Update namespace with only name field in the body', { tags: '@api' }, () => {
        PatchCall(namespacesEndpoint + '/' + namespaceid1,
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
        PatchCall(namespacesEndpoint + '/' + namespaceid1,
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
        PatchCall(namespacesEndpoint + '/' + namespaceid1,
            {
                defaultCountry: "CA"
            })
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.defaultCountry)).to.deep.includes('CA')
            })
    })

    it('Delete account', { tags: '@api' }, () => {
            DeleteCall(namespacesEndpoint + '/' + namespaceid1)
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

describe('Namespace CRUD with DatafeedID field in the body',() => {

    it('Create namespace with DatafeedID', { tags: '@api' }, () => {
        PostCall(namespacesEndpoint,namespaceBodywithDatafeedID)
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                cy.log(response.body.id)
                expect(JSON.stringify(response.body.name)).to.deep.includes('namespaceWithDatafeedID0')
                expect(JSON.stringify(response.body.datafeedId)).to.deep.includes(datafeedId)
                namespaceid2 = response.body.id
            })
    })

    it('Get specific namespace with DatafeedID', { tags: '@api' }, () => {
        GetCall(namespacesEndpoint + '/' + namespaceid2)
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                expect(JSON.stringify(response.body.datafeedId)).to.deep.includes(datafeedId)
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Create namespace with DatafeedID as null', { tags: '@api' }, () => {
        PostCall(namespacesEndpoint,{
            name: 'namespaceWithDatafeedID' + '0' + Math.floor((Math.random() * 999) + 1),
            description: "Description",
            defaultCountry: "US",
            datafeedId: null
        })
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.name)).to.deep.includes('namespaceWithDatafeedID0')
                expect(JSON.stringify(response.body.datafeedId)).to.deep.includes(null)
                cy.log(response.body.id)
                namespaceid3 = response.body.id
            })
    })
    
    it('Delete account', { tags: '@api' }, () => {
        let ids = [namespaceid2,namespaceid3]
            ids.forEach((namespaceItem) => {
                DeleteCall(namespacesEndpoint + '/' + namespaceItem)
                .then((response) => {
                    expect(response.status).to.eq(200) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data    
                })
            })    
    })

})

describe('Negetive tests', () => {
    let namespaceNtestId = 0
    let invalidNamespaceid = namespacesEndpoint + '/1a5f1e74-2646-4703-b2e0-557efbb12345'
    let negitiveTestNamespaceid =0

    before(() => {
        PostCall(namespacesEndpoint,namespaceBody)
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                namespaceNtestId = response.body.id
                negitiveTestNamespaceid = namespacesEndpoint + '/' + namespaceNtestId
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

    it('Create Namespaceid with datafeedID as invalid UUID format', { tags: '@api' }, () => {
        PostCall(namespacesEndpoint,{
            name: 'namespaceWithDatafeedID' + '0' + Math.floor((Math.random() * 999) + 1),
            description: "Description",
            defaultCountry: "US",
            datafeedId: "1a2b3c4d5e6f7g8h9"
        })
            .then((response) => {
                expect(response.status).to.eq(400) // Check response status
                cy.log(JSON.stringify(response.body))
                expect(JSON.stringify(response.body)).to.deep.includes("Datafeed ID '1a2b3c4d5e6f7g8h9' is invalid. A UUID is expected.")
        
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
        DeleteCall(invalidNamespacesEndpoint + '/' + namespaceNtestId)
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

const namespaceBodywithDatafeedID = {
    name: 'namespaceWithDatafeedID' + '0' + Math.floor((Math.random() * 999) + 1),
    description: "Description",
    defaultCountry: "US",
    datafeedId: datafeedId
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