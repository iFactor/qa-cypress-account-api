import { env as _env, generateAccountData, PostCall, GetCall, PatchCall, DeleteCall, namespacesEndpoint, invalidAccountEndpoint, invalidKUBRAclientId, KubraDemoClientID } from '../utils.js'
let externalid = 0;
let externalid1 = 0;
let externalid2 = 0;
let externalid3 = 0;
let namespaceid = 0;
let namespacesid2 = 0;
let accountEndpoint = 0;
let accountEndpoint2 = 0;

describe('accounts api', { tags: '@smoke' }, () => {

    before(() => {
        PostCall(namespacesEndpoint,
            {
                name: 'namespaces' + '0' + Math.floor((Math.random() * 999) + 1),
                description: "Description",
                defaultCountry: "US"
            })
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                cy.log(response.body.id)
                expect(JSON.stringify(response.body.name)).to.deep.includes('namespaces0')
                namespaceid = response.body.id
                cy.log(namespaceid)
                accountEndpoint = namespacesEndpoint + '/' + namespaceid + '/accounts'
            })
    })

    before(() => {
        PostCall(namespacesEndpoint,
            {
                name: 'namespacesDemoclient' + '0' + Math.floor((Math.random() * 999) + 1),
                description: "Description",
                defaultCountry: "US"
            }, {bearer: `${Cypress.env("DefaultAuth0Token")}`},
            // ClientId which contains empty namespaces in it
            KubraDemoClientID )
            .then((response) => {
                expect(response.status).to.eq(201) // Check response status
                cy.log(JSON.stringify(response.body)) // log response body data
                namespacesid2 = response.body.id
                cy.log(namespacesid2)
                accountEndpoint2 = namespacesEndpoint + '/' + namespacesid2 + '/accounts'
            })
    })

    before(() => {
        cy.log(`account endpoint is ${accountEndpoint}`)
        expect(accountEndpoint).to.include('account');
    })

    after(() => {
        if (namespaceid != '') {
            DeleteCall(namespacesEndpoint + '/' + namespaceid)
                .then((response) => {
                    expect(response.status).to.eq(200) // Check response status                   
                })
        }
    })

    after(() => {
        if (namespacesid2 != '') {
            DeleteCall(namespacesEndpoint + '/' + namespacesid2, {bearer: `${Cypress.env("DefaultAuth0Token")}`},
            // ClientId which contains empty namespaces in it
            KubraDemoClientID)
                .then((response) => {
                    expect(response.status).to.eq(200) // Check response status                   
                })
        }
    })

    describe('CRUD operations', { tags: '@smoke' }, () => {

        it('Create account', { tags: '@api' }, () => {
            let data_by = JSON.parse(generateAccountData());
            PostCall(accountEndpoint, data_by)
                .then((response) => {
                    expect(response.status).to.eq(201) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                    expect(JSON.stringify(response.body.externalId))
                    expect(JSON.stringify(response.body.billingAddress.streetAddress1))
                    externalid = response.body.externalId
                })
        })

        it('Create account with empty country in billingAddress', { tags: '@api' }, () => {
            //if country is not given it must take the default country from namespace
            let data_by = JSON.parse(generateAccountData());
           data_by.billingAddress.country=""
           cy.log(JSON.stringify(data_by))
            PostCall(accountEndpoint, data_by)
                .then((response) => {
                    expect(response.status).to.eq(201) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                    expect(JSON.stringify(response.body.billingAddress.country)).to.deep.includes("US")
                    externalid1 = response.body.externalId
                })
        })

        it('Create account with externalID and billingAddress', { tags: '@api' }, () => {
            let data_by = JSON.parse(generateAccountData());
            delete data_by.mailingAddress
            delete data_by.tags
            delete data_by.isCommercial
            delete data_by.status
            delete data_by.isPrePay
           cy.log(JSON.stringify(data_by))
            PostCall(accountEndpoint, data_by)
                .then((response) => {
                    expect(response.status).to.eq(201) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                    expect(JSON.stringify(response.body.externalId))
                    expect(JSON.stringify(response.body.billingAddress.country))
                    externalid2 = response.body.externalId
                })
        })

        it('Create account with mailling address as null', { tags: '@api' }, () => {
            let data_by = JSON.parse(generateAccountData());
            data_by.mailingAddress = null
           cy.log(JSON.stringify(data_by))
            PostCall(accountEndpoint, data_by)
                .then((response) => {
                    expect(response.status).to.eq(201) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                    expect(JSON.stringify(response.body.externalId))
                    expect(JSON.stringify(response.body.billingAddress.country))
                    externalid3 = response.body.externalId
                })
        })

        it('Get specific account', { tags: '@api' }, () => {
            GetCall(accountEndpoint + '/' + externalid)
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
            //externalID is deleted as the generateAccountData generates a new externalID all the time which is not neccessary for this call
            let data_by = JSON.parse(generateAccountData());
            delete data_by.externalId
            cy.log(JSON.stringify(data_by))
            PatchCall(accountEndpoint + '/' + externalid,data_by)
                .then((response) => {
                    expect(response.status).to.eq(200) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    expect(JSON.stringify(response.body.billingAddress))
                })
        })

        it('Update account with only billing Address', { tags: '@api' }, () => {
            //externalID is deleted as the generateAccountData generates a new externalID all the time which is not neccessary for this call
            let data_by = JSON.parse(generateAccountData());
            delete data_by.externalId
            delete data_by.mailingAddress
            delete data_by.tags
            delete data_by.isCommercial
            delete data_by.status
            delete data_by.isPrePay
            cy.log(JSON.stringify(data_by))
            PatchCall(accountEndpoint + '/' + externalid,data_by)
                .then((response) => {
                    expect(response.status).to.eq(200) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    expect(JSON.stringify(response.body.mailingAddress))
                })
        })

        it('Update account with only mailing Address', { tags: '@api' }, () => {
            //externalID is deleted as the generateAccountData generates a new externalID all the time which is not neccessary for this call
            let data_by = JSON.parse(generateAccountData());
            delete data_by.externalId
            delete data_by.billingAddress
            delete data_by.tags
            delete data_by.isCommercial
            delete data_by.status
            delete data_by.isPrePay
            cy.log(JSON.stringify(data_by))
            PatchCall(accountEndpoint + '/' + externalid,data_by)
                .then((response) => {
                    expect(response.status).to.eq(200) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    expect(JSON.stringify(response.body.mailingAddress))
                })
        })

        it('Update account with only mailing Address', { tags: '@api' }, () => {
            //externalID is deleted as the generateAccountData generates a new externalID all the time which is not neccessary for this call
            let data_by = JSON.parse(generateAccountData());
            delete data_by.externalId
            cy.log(JSON.stringify(data_by))
            PatchCall(accountEndpoint + '/' + externalid3,data_by)
                .then((response) => {
                    expect(response.status).to.eq(200) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    expect(JSON.stringify(response.body.mailingAddress))
                })
        })

        it('Delete account', { tags: '@api' }, () => {
            let ids = [externalid, externalid1, externalid2, externalid3]
            ids.forEach((item) => {
                DeleteCall(accountEndpoint + '/' + item)
                    .then((response) => {
                        expect(response.status).to.eq(200) // Check response status
                        cy.log(JSON.stringify(response.body)) // log response body data    
                    })
            })
        })

        it('Get all account which has empty data in it', { tags: '@api' }, () => {
            GetCall(accountEndpoint2,
                {bearer: `${Cypress.env("DefaultAuth0Token")}`},
                // ClientId which contains empty namespaces in it
                KubraDemoClientID)
                .then((response) => {
                    expect(response.status).to.eq(204) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })
    })

    describe('negative test cases', () => {
        let negitiveAccountid = 0
        let invalidAccountid = accountEndpoint + '/2e791d92-26f4-4000-a5dd-34f5c8f655ed'
        let negitiveTestAccountid = 0
        before(() => {
            let data_by = JSON.parse(generateAccountData());
            PostCall(accountEndpoint,data_by)
                .then((response) => {
                    expect(response.status).to.eq(201) // Check response status               
                    negitiveAccountid = response.body.externalId
                    negitiveTestAccountid = accountEndpoint + '/' + negitiveAccountid
                    cy.log(negitiveTestAccountid)
                })
        })

        after(() => {
            cy.log(negitiveTestAccountid)
            DeleteCall(negitiveTestAccountid)
                .then((response) => {
                    expect(response.status).to.eq(200) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data    
                })
        })

        it('Create account with invalid id', { tags: '@api' }, () => {
            let data_by = JSON.parse(generateAccountData());
            PostCall(invalidAccountEndpoint, data_by)
                .then((response) => {
                    expect(response.status).to.eq(404) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Create account with country as null in billingAddress', { tags: '@api' }, () => {
            let data_by = JSON.parse(generateAccountData());
            data_by.billingAddress.country= null
            PostCall(accountEndpoint, data_by)
                .then((response) => {
                    expect(response.status).to.eq(500) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Create account with empty body', { tags: '@api' }, () => {
            PostCall(accountEndpoint,
                {

                })
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Create account with empty externalId', { tags: '@api' }, () => {
            let data_by = JSON.parse(generateAccountData());
           data_by.externalId=""
            PostCall(accountEndpoint,  data_by)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Create account with empty billingAddress', { tags: '@api' }, () => {
            let data_by = JSON.parse(generateAccountData());
            data_by.billingAddress=""
            PostCall(accountEndpoint, data_by)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Create account with empty streetAddress1 in billingAddress', { tags: '@api' }, () => {
            let data_by = JSON.parse(generateAccountData());
            data_by.billingAddress.streetAddress1=""
            PostCall(accountEndpoint, data_by)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Create account with empty locality in billingAddress', { tags: '@api' }, () => {
            let data_by = JSON.parse(generateAccountData());
            data_by.billingAddress.locality=""
            PostCall(accountEndpoint, data_by)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Create account with empty region in billingAddress', { tags: '@api' }, () => {
            let data_by = JSON.parse(generateAccountData());
            data_by.billingAddress.region=""
            PostCall(accountEndpoint, data_by)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Create account with empty postalCode in billingAddress', { tags: '@api' }, () => {
            let data_by = JSON.parse(generateAccountData());
            data_by.billingAddress.postalCode=""
            PostCall(accountEndpoint, data_by)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('GET all account when invalid endpoint', { tags: '@api' }, () => {
            GetCall(invalidAccountEndpoint)
                .then((response) => {
                    expect(response.status).to.eq(404) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })
        it('GET all account when invalid clientID', { tags: '@api' }, () => {
            GetCall(accountEndpoint, { bearer: `${Cypress.env("DefaultAuth0Token")}`}, invalidKUBRAclientId)
                .then((response) => {
                    expect(response.status).to.eq(404) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('GET account with invalid account id', { tags: '@api' }, () => {
            GetCall(invalidAccountid)
                .then((response) => {
                    expect(response.status).to.eq(404) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('GET account when invalid clientID', { tags: '@api' }, () => {
            GetCall(negitiveTestAccountid, { bearer: `${Cypress.env("DefaultAuth0Token")}`}, invalidKUBRAclientId)
                .then((response) => {
                    expect(response.status).to.eq(404) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Update account with unknown field in billingAddress is add', { tags: '@api' }, () => {
            //externalID is deleted as the generateAccountData generates a new externalID all the time which is not neccessary for this call
            let data_by = JSON.parse(generateAccountData());
            delete data_by.externalId
            data_by.billingAddress.newfield="ABC"
            PatchCall(negitiveTestAccountid,data_by)
                .then((response) => {
                    expect(response.status).to.eq(200) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    expect(JSON.stringify(response.body.externalId)).not.includes('newfield');
                })
        })

        it('Update account with empty body', { tags: '@api' }, () => {
            PatchCall(negitiveTestAccountid,
                {
                })
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Update account with null value', { tags: '@api' }, () => {
            //externalID is deleted as the generateAccountData generates a new externalID all the time which is not neccessary for this call
            let data_by = JSON.parse(generateAccountData());
            delete data_by.externalId
            data_by.billingAddress= null
            data_by.mailingAddress=null
            data_by.tags= null
            data_by.isCommercial= null
            data_by.status= null
            data_by.isPrePay= null
            PatchCall(negitiveTestAccountid,data_by)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Update account with invalid account id', { tags: '@api' }, () => {
            //externalID is deleted as the generateAccountData generates a new externalID all the time which is not neccessary for this call
            let data_by = JSON.parse(generateAccountData());
            invalidAccountid = accountEndpoint + '/789568a'
            delete data_by.externalId
            cy.log(invalidAccountid)
            PatchCall(invalidAccountid,data_by)
                .then((response) => {
                    expect(response.status).to.eq(404) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Update account with invalid clientID', { tags: '@api' }, () => {
        //externalID is deleted as the generateAccountData generates a new externalID all the time which is not neccessary for this call
        let data_by = JSON.parse(generateAccountData());
            delete data_by.externalId
            PatchCall(negitiveTestAccountid, data_by,{bearer: `${Cypress.env("DefaultAuth0Token")}`}, invalidKUBRAclientId)
                .then((response) => {
                    expect(response.status).to.eq(404) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Delete account with invalid endpoints', { tags: '@api' }, () => {
            DeleteCall(invalidAccountEndpoint+'/'+negitiveAccountid)
                .then((response) => {
                    expect(response.status).to.eq(404) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

        it('Delete account with invalid account ID', { tags: '@api' }, () => {
            DeleteCall(invalidAccountid)
                .then((response) => {
                    expect(response.status).to.eq(404) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })
        
        it('Delete account with invalid client ID', { tags: '@api' }, () => {
            DeleteCall(negitiveTestAccountid, { bearer: `${Cypress.env("DefaultAuth0Token")}`}, invalidKUBRAclientId)
                .then((response) => {
                    expect(response.status).to.eq(404) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })
    })
})