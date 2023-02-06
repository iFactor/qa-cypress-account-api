import { env as _env, PostCall, GetCall, PutCall, DeleteCall, namespacesEndpoint, invalidAccountEndpoint } from '../utils.js'
let externalid = 0;
let externalid1 = 0;
let externalid2 = 0;
let externalid3 = 0;
let namespaceid = 0;
let accountEndpoint = 0;

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
        cy.log(`account endpoint is ${accountEndpoint}`)
        expect(accountEndpoint).to.include('account');
    })

    after(() => {
        if (namespaceid != '') {
            DeleteCall(namespacesEndpoint + '/' + namespaceid)
                .then((response) => {
                    expect(response.status).to.eq(204) // Check response status                   
                })
        }
    })

    describe('CRUD operations', { tags: '@smoke' }, () => {

        it('Create account', { tags: '@api' }, () => {
            PostCall(accountEndpoint, accountBody)
                .then((response) => {
                    expect(response.status).to.eq(201) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                    expect(JSON.stringify(response.body.externalId)).to.deep.includes('0')
                    expect(JSON.stringify(response.body.billingAddress.streetAddress1))
                    externalid = response.body.externalId
                })
        })

        it('Create account with empty country in billingAddress', { tags: '@api' }, () => {
            //if country is not given it must take the default country = US
            PostCall(accountEndpoint, emptyCountryBody)
                .then((response) => {
                    expect(response.status).to.eq(201) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                    expect(JSON.stringify(response.body.billingAddress.country)).to.deep.includes("US")
                    externalid1 = response.body.externalId
                })
        })

        it('Create account with country as null in billingAddress', { tags: '@api' }, () => {
            //if country is not given it must take the default country = US
            PostCall(accountEndpoint, nullCountryBody)
                .then((response) => {
                    expect(response.status).to.eq(201) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                    expect(JSON.stringify(response.body.billingAddress.country)).to.deep.includes("US")
                    externalid2 = response.body.externalId
                })
        })

        it('Create account with externalID and billingAddress', { tags: '@api' }, () => {
            PostCall(accountEndpoint, externalidAndBillingBody)
                .then((response) => {
                    expect(response.status).to.eq(201) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                    expect(JSON.stringify(response.body.externalId)).to.deep.includes('0')
                    expect(JSON.stringify(response.body.billingAddress.country)).to.deep.includes("CA")
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
            PutCall(accountEndpoint + '/' + externalid,
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
            let ids = [externalid, externalid1, externalid2, externalid3]
            ids.forEach((item) => {
                DeleteCall(accountEndpoint + '/' + item)
                    .then((response) => {
                        expect(response.status).to.eq(200) // Check response status
                        cy.log(JSON.stringify(response.body)) // log response body data    
                    })
            })

        })
    })

    describe('negative test cases', () => {
        let negitiveAccountid = 0
        let invalidAccountid = accountEndpoint + '/123456789'
        before(() => {
            PostCall(accountEndpoint, {
                externalId: '0' + Math.floor((Math.random() * 999) + 1),
                billingAddress: {
                    streetAddress1: "123 Main St",
                    streetAddress2: "AAA",
                    locality: "City",
                    region: "State",
                    postalCode: "Zip",
                    country: "US"
                }
            })
                .then((response) => {
                    expect(response.status).to.eq(201) // Check response status               
                    negitiveAccountid = response.body.externalId
                })
        })

        after(() => {
            DeleteCall(accountEndpoint + '/' + negitiveAccountid)
                .then((response) => {
                    expect(response.status).to.eq(204) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data    
                })
        })

        it('Create account with invalid id', { tags: '@api' }, () => {
            PostCall(invalidAccountEndpoint, accountBody)
                .then((response) => {
                    expect(response.status).to.eq(404) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                })
        })

        it('Create account with empty body', { tags: '@api' }, () => {
            PostCall(accountEndpoint,
                {

                })
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                })
        })

        it('Create account with empty externalId', { tags: '@api' }, () => {
            PostCall(accountEndpoint, emptyExternalid)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                })
        })

        it('Create account with empty billingAddress', { tags: '@api' }, () => {
            PostCall(accountEndpoint, emptyBillingAddress)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                })
        })

        it('Create account with empty streetAddress1 in billingAddress', { tags: '@api' }, () => {
            PostCall(accountEndpoint, emptyStreetAddress)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                })
        })

        it('Create account with empty locality in billingAddress', { tags: '@api' }, () => {
            PostCall(accountEndpoint, emptyLocality)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                })

        })

        it('Create account with empty region in billingAddress', { tags: '@api' }, () => {
            PostCall(accountEndpoint, emptyregion)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                })
        })

        it('Create account with empty postalCode in billingAddress', { tags: '@api' }, () => {
            PostCall(accountEndpoint, emptyPostalcode)
                .then((response) => {
                    expect(response.status).to.eq(400) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                    cy.log(response.body.externalId)
                })
        })

        it('GET the specific data with invalid account id', { tags: '@api' }, () => {
            GetCall(invalidAccountid)
                .then((response) => {
                    expect(response.status).to.eq(404) // Check response status
                    cy.log(JSON.stringify(response.body)) // log response body data
                })
        })

    })

})

// This body's are used in testcases above
const accountBody = {
    externalId: '0' + Math.floor((Math.random() * 999) + 1),
    billingAddress: {
        streetAddress1: "123 Main St",
        streetAddress2: "AAA",
        locality: "City",
        region: "State",
        postalCode: "Zip",
        country: "US"
    },
    mailingAddress: {
        streetAddress1: "444 Main St",
        streetAddress2: "BBB",
        locality: "Locality",
        region: "Region",
        postalCode: "Postal Code",
        country: "CA"
    },
    tags: {
        ABC: "123",
        TestTag: "Test",
        Key: "Value"
    },
    isCommercial: false,
    status: "open",
    isPrePay: false
}

const externalidAndBillingBody = {
    externalId: '0' + Math.floor((Math.random() * 999) + 1),
    billingAddress: {
        streetAddress1: "123 Main St",
        streetAddress2: "AAA",
        locality: "city",
        region: "state",
        postalCode: "postal code",
        country: "CA"
    }
}

const emptyCountryBody = {
    externalId: '0' + Math.floor((Math.random() * 999) + 1),
    billingAddress: {
        streetAddress1: "123 Main St",
        streetAddress2: "AAA",
        locality: "city",
        region: "state",
        postalCode: "postal code",
        country: ""
    },
    mailingAddress: {
        streetAddress1: "444 Main St",
        streetAddress2: "BBB",
        locality: "Locality",
        region: "Region",
        postalCode: "Postal Code",
        country: "CA"
    },
    tags: {
        ABC: "123",
        TestTag: "Test",
        Key: "Value"
    },
    isCommercial: false,
    status: "open",
    isPrePay: false
}

const nullCountryBody = {
    externalId: '0' + Math.floor((Math.random() * 999) + 1),
    billingAddress: {
        streetAddress1: "123 Main St",
        streetAddress2: "AAA",
        locality: "city",
        region: "state",
        postalCode: "postal code",

    },
    mailingAddress: {
        streetAddress1: "444 Main St",
        streetAddress2: "BBB",
        locality: "Locality",
        region: "Region",
        postalCode: "Postal Code",
        country: "CA"
    },
    tags: {
        ABC: "123",
        TestTag: "Test",
        Key: "Value"
    },
    isCommercial: false,
    status: "open",
    isPrePay: false
}

const emptyExternalid = {
    externalId: '',
    billingAddress: {
        streetAddress1: "123 Main St",
        streetAddress2: "AAA",
        locality: "City",
        region: "State",
        postalCode: "Zip",
        country: "US"
    },
    mailingAddress: {
        streetAddress1: "444 Main St",
        streetAddress2: "BBB",
        locality: "Locality",
        region: "Region",
        postalCode: "Postal Code",
        country: "CA"
    },
    tags: {
        ABC: "123",
        TestTag: "Test",
        Key: "Value"
    },
    isCommercial: false,
    status: "open",
    isPrePay: false
}

const emptyBillingAddress = {
    externalId: '0' + Math.floor((Math.random() * 999) + 1),
    billingAddress: {

    },
    mailingAddress: {
        streetAddress1: "444 Main St",
        streetAddress2: "BBB",
        locality: "Locality",
        region: "Region",
        postalCode: "Postal Code",
        country: "CA"
    },
    tags: {
        ABC: "123",
        TestTag: "Test",
        Key: "Value"
    },
    isCommercial: false,
    status: "open",
    isPrePay: false
}

const emptyStreetAddress = {
    externalId: '0' + Math.floor((Math.random() * 999) + 1),
    billingAddress: {
        streetAddress1: "",
        streetAddress2: "AAA",
        locality: "City",
        region: "State",
        postalCode: "Zip",
        country: "US"
    },
    mailingAddress: {
        streetAddress1: "444 Main St",
        streetAddress2: "BBB",
        locality: "Locality",
        region: "Region",
        postalCode: "Postal Code",
        country: "CA"
    },
    tags: {
        ABC: "123",
        TestTag: "Test",
        Key: "Value"
    },
    isCommercial: false,
    status: "open",
    isPrePay: false
}

const emptyLocality = {
    externalId: '0' + Math.floor((Math.random() * 999) + 1),
    billingAddress: {
        streetAddress1: "123 Main St",
        streetAddress2: "AAA",
        locality: "",
        region: "State",
        postalCode: "Zip",
        country: "US"
    },
    mailingAddress: {
        streetAddress1: "444 Main St",
        streetAddress2: "BBB",
        locality: "Locality",
        region: "Region",
        postalCode: "Postal Code",
        country: "CA"
    },
    tags: {
        ABC: "123",
        TestTag: "Test",
        Key: "Value"
    },
    isCommercial: false,
    status: "open",
    isPrePay: false
}

const emptyregion = {
    externalId: '0' + Math.floor((Math.random() * 999) + 1),
    billingAddress: {
        streetAddress1: "123 Main St",
        streetAddress2: "AAA",
        locality: "city",
        region: "",
        postalCode: "Zip",
        country: "US"
    },
    mailingAddress: {
        streetAddress1: "444 Main St",
        streetAddress2: "BBB",
        locality: "Locality",
        region: "Region",
        postalCode: "Postal Code",
        country: "CA"
    },
    tags: {
        ABC: "123",
        TestTag: "Test",
        Key: "Value"
    },
    isCommercial: false,
    status: "open",
    isPrePay: false
}

const emptyPostalcode = {
    externalId: '0' + Math.floor((Math.random() * 999) + 1),
    billingAddress: {
        streetAddress1: "123 Main St",
        streetAddress2: "AAA",
        locality: "city",
        region: "state",
        postalCode: "",
        country: "US"
    },
    mailingAddress: {
        streetAddress1: "444 Main St",
        streetAddress2: "BBB",
        locality: "Locality",
        region: "Region",
        postalCode: "Postal Code",
        country: "CA"
    },
    tags: {
        ABC: "123",
        TestTag: "Test",
        Key: "Value"
    },
    isCommercial: false,
    status: "open",
    isPrePay: false
}