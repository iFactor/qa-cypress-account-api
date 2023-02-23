import * as fs from 'fs';
export const host = Cypress.config('baseUrl');
export const username = Cypress.env('auth_username')
export const password = atob(Cypress.env('auth_password'))
export const env = Cypress.config("envName")
export const contenttype = "application/json"
export const patchContentType ="application/merge-patch+json"
export const KUBRAclientId = 'a8c2b204-1563-4a9a-9581-72f0cf71e5ef'
export const invalidKUBRAclientId = 'a8c2b204-1563-4a9a-9581-72f0cf71234'
export const KubraDemoClientID = '14f2ddd8-b942-4e01-9a1a-c1dcdc261573'
export const namespacesEndpoint = host + '/account/v1/namespaces'
export const invalidNamespaceid = host + '/account/v1/namespaces/bc9ec323-153b-4872-98d7-233f57ba1234'
export const invalidNamespacesEndpoint = host + '/account/v1/namespaces-s'
export const invalidAccountEndpoint = invalidNamespaceid + '/accountss'

export const deleteDownloadsFolder = () => {
    const downloadsFolder = Cypress.config('downloadsFolder')
    cy.task('deleteFolder', downloadsFolder)
}

export const generateUUID = () => {
    var d = new Date().getTime(); //Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) { //Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else { //Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export const generateAccountData = () => {
    const chance = require('chance').Chance()
    var arr = function () {
        return {
            externalId: chance.natural(),
            billingAddress: {
                streetAddress1: chance.address(),
                streetAddress2: chance.street(),
                locality: chance.city(),
                region: chance.state(),
                postalCode: chance.postcode(),
                country: chance.country(),
            },
            mailingAddress: {
                streetAddress1: chance.address(),
                streetAddress2: chance.street(),
                locality: chance.city(),
                region: chance.state(),
                postalCode: chance.postcode(),
                country: chance.country()
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
    };
    var json = JSON.stringify(arr(), null, 2); // as you asked for json
    //cy.log(json)
    return json
}

export const PostCall = (endpoint, _body, _auth = {bearer: `${Cypress.env("DefaultAuth0Token")}`}, _KUBRAclientId = KUBRAclientId) => {
    return cy.request({
        method: 'POST',
        failOnStatusCode: false,
        url: endpoint,
        auth: _auth,
        body: _body,
        headers: {
            'Content-Type': contenttype,
            'KUBRA-tenantId': _KUBRAclientId,
        }
    })
}

export const GetCall = (endpoint, _auth = {bearer: `${Cypress.env("DefaultAuth0Token")}`}, _KUBRAclientId = KUBRAclientId) => {
    return cy.request({
        method: 'GET',
        failOnStatusCode: false,
        url: endpoint,
        auth: _auth,
        headers: {
            'Content-Type': contenttype,
            'KUBRA-tenantId': _KUBRAclientId,
        },
    })
}

export const PatchCall = (endpoint, _body, _auth = { bearer: `${Cypress.env("DefaultAuth0Token")}`}, _KUBRAclientId = KUBRAclientId) => {
    return cy.request({
        method: 'PATCH',
        failOnStatusCode: false,
        url: endpoint,
        auth: _auth,
        body: _body,
        headers: {
            'Content-Type': patchContentType,
            'KUBRA-tenantId': _KUBRAclientId,
        },
    })
}

export const DeleteCall = (endpoint, _auth = {bearer: `${Cypress.env("DefaultAuth0Token")}`}, _KUBRAclientId = KUBRAclientId) => {
    return cy.request({
        method: 'DELETE',
        failOnStatusCode: false,
        url: endpoint,
        auth: _auth,
        headers: {
            'Content-Type': contenttype,
            'KUBRA-tenantId': _KUBRAclientId,
        },
    })
}