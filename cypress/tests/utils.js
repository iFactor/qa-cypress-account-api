import * as fs from 'fs';
export const host = 'https://api.dev.kubra.io'
export const username = Cypress.env('auth_username')
export const password = atob(Cypress.env('auth_password'))
export const env = Cypress.config("envName")
export const contenttype = "application/json"
export const KUBRAtenantId = 'a8c2b204-1563-4a9a-9581-72f0cf71e5ef'
export const InvalidKUBRAtenantId = 'a8c2b204-1563-4a9a-9581-72f0cf71234'
export const namespacesEndpoint = host + '/account/v1/namespaces' 
export const invalidNamespacesEndpoint = host + '/account/v1/namespaces-s'

export const deleteDownloadsFolder = () => {
    const downloadsFolder = Cypress.config('downloadsFolder')
    cy.task('deleteFolder', downloadsFolder)
}

export const generateUUID = () => {
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export const PostCall = (endpoint, _body, _auth =  { bearer: `${Cypress.env("DefaultAuth0Token")}` }) => {
    
    return cy.request({
        method: 'POST',
        failOnStatusCode: false,
        url: endpoint,
        auth: _auth,
        body: _body,
    })
}

export const GetCall = (endpoint, _auth = { bearer: `${Cypress.env("DefaultAuth0Token")}` }) => {
    return cy.request({
        method: 'GET',
        failOnStatusCode: false,
        url: endpoint,
        auth: _auth,
    })
}

export const PutCall = (endpoint, _body,  _auth = { bearer: `${Cypress.env("DefaultAuth0Token")}` }) => {
    return cy.request({
        method: 'PUT',
        failOnStatusCode: false,
        url: endpoint,
        auth: _auth,
        body: _body,
        headers: {
            'Content-Type': contenttype,
            'KUBRA-tenantId': KUBRAtenantId,
        },
    })
}

export const DeleteCall = (endpoint, _auth = { bearer: `${Cypress.env("DefaultAuth0Token")}` }) => {
    return cy.request({
        method: 'DELETE',
        failOnStatusCode: false,
        url: endpoint,
        auth: _auth,
        headers: {
            'Content-Type': contenttype,
            'KUBRA-tenantId': KUBRAtenantId,
        },
    })
}