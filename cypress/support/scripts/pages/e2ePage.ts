import * as general from '../utils/general';

export default class e2ePage {
    static navigateToSite() {
        const url = Cypress.env('E2E_FRONTEND_URL');
        cy.visit(url);
    }

    static clickOnALink() {
        const elText = Cypress.env('E2E_FRONTEND_ELEMENT');
        general.clickElementText(elText);
    }

    static assertAText() {
        const elText = Cypress.env('E2E_FRONTEND_TEXT');
        general.assertAnElementText(elText);
    }

}
