import { env as _env, PostCall, GetCall, PatchCall, DeleteCall, namespacesEndpoint, invalidNamespacesEndpoint, invalidNamespaceid, invalidAccountEndpoint } from '../utils.js';
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
})

describe('Negetive tests', () => {
    let negitiveNamespaceid = 0
    before(() => {
        PostCall(namespacesEndpoint,namespaceBody)
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status               
                negitiveNamespaceid = response.body.id
                cy.log(negitiveNamespaceid)
            })
    })

    after(() => {
        DeleteCall(namespacesEndpoint + '/' + negitiveNamespaceid)
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

    it('GET all balancefeed when invalid endpoint', { tags: '@api' }, () => {
        GetCall(invalidNamespacesEndpoint)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('GET the specific data with invalid namespace id', { tags: '@api' }, () => {
        GetCall(invalidNamespaceid)
            .then((response) => {
                expect(response.status).to.eq(404) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Update namespace with unknown field is add', { tags: '@api' }, () => {
        PatchCall(namespacesEndpoint + '/' + negitiveNamespaceid,unknownfieldNamespace)
            .then((response) => {
                expect(response.status).to.eq(400) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.name)).to.deep.includes('patchUpdatedNamespace0')
                expect(JSON.stringify(response.body.description)).to.deep.includes('patch description')
                expect(JSON.stringify(response.body.defaultCountry)).to.deep.includes('CA')
            })
    })

    it('Update namespace with empty body', { tags: '@api' }, () => {
        PatchCall(namespacesEndpoint + '/' + negitiveNamespaceid,
            {

            })
            .then((response) => {
                expect(response.status).to.eq(400) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.name)).to.deep.includes('patchUpdatedNamespace0')
                expect(JSON.stringify(response.body.description)).to.deep.includes('patch description')
                expect(JSON.stringify(response.body.defaultCountry)).to.deep.includes('CA')
            })
    })

    it('Update namespace with null value', { tags: '@api' }, () => {
        PatchCall(namespacesEndpoint + '/' + negitiveNamespaceid,nullFieldNamespace)
            .then((response) => {
                expect(response.status).to.eq(400) // Check response status
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

    it('Delete namespace with invalid endpoints', { tags: '@api' }, () => {
        DeleteCall(invalidNamespacesEndpoint + '/' + negitiveNamespaceid)
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