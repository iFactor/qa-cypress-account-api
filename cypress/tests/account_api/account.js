import { env as _env, PostCall, GetCall, PutCall, DeleteCall, namespacesEndpoint} from '../utils.js';
let externalid = 0;
let namespaceid = 0;
let accountEndpoint=0;

describe('CRUD operations', { tags: '@smoke' }, () => {

    before(()=> {
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
                cy.log(namespaceid)
                accountEndpoint = namespacesEndpoint +'/'+ namespaceid +'/accounts'
            })
    })

    before(()=> {
        cy.log(`account endpoint is ${accountEndpoint}`)
        expect(accountEndpoint).to.include('account');
    })

    after(()=> {
        if(namespaceid != ''){
            DeleteCall(namespacesEndpoint + '/'+ namespaceid)
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status                   
            })
        }
    })
    it('Create account', { tags: '@api' }, () => {
        PostCall(accountEndpoint,
            {
                name: 'account' + '0' + Math.floor((Math.random() * 999) + 1),
            })
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                cy.log(response.body.id)
                expect(JSON.stringify(response.body.name)).to.deep.includes('account0')
                externalid = response.body.id
            })
    })

    it('Get specific account', { tags: '@api' }, () => {
        GetCall( accountEndpoint + '/'+ externalid )
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Get all account', { tags: '@api' }, () => {
        GetCall(accountEndpoint)
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
            })
    })

    it('Update account', { tags: '@api' }, () => {
        PutCall(accountEndpoint + '/'+ externalid,
            { 
                name: 'updatedAccount' + '1' + Math.floor((Math.random() * 999) + 1),
            })
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                expect(JSON.stringify(response.body.name)).to.deep.includes('updatedAccount1')
            })
    })

    it('Delete account', { tags: '@api' }, () => {
        DeleteCall(accountEndpoint + '/'+ externalid)
            .then((response) => {
                expect(response.status).to.eq(200) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data    
            })
    })
})