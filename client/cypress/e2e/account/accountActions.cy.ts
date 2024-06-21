describe('Account Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/account');
    });

    it("should go to the sell page and create a product", () => {
        cy.login();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/sell');
    //     cy.get('input[name="name"]').type('Test Product');
    //     cy.get('textarea[name="description"]').type('Test Description');
    //     cy.get('input[name="price"]').type('100');
    //     cy.get('input[name="stock"]').type('10');
    //     cy.get('input[name="discountNumber"]').type('0');
    //     cy.get('button').contains('Create Product').click();
        
    //     // Check profile to see if the product is created
    //     cy.get('a').contains('Profile').click();
    //     cy.contains('Test Product').should('be.visible');
    });
});