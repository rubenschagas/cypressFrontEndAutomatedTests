export function clickElementText(elText: string) {
    cy.contains(elText)
        .click();
}

export function assertAnElementText(elText: string) {
    cy.contains(elText)
        .should('contain.text', elText);
}
