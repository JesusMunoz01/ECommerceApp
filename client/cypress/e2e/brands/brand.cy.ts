describe('Brand Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/brands');
    });
    
    it("should display brands page", () => {
        cy.contains('Brands').should('be.visible');
    });

    it("should see the grid of brands", () => {
        cy.get('.grid').should('be.visible');
        cy.contains('Forest Workshop').should('be.visible');
    });

    it("should click on the brand and see the brand page", () => {
        cy.contains('Forest Workshop').click();
        cy.get('h1').should('have.text', 'Forest Workshop');
    });

    it("should see the products of the brand", () => {
        cy.contains('Forest Workshop').click();
        cy.get('.grid').should('be.visible');
        cy.contains('Wooden Desk').should('be.visible');
    });

    it("should add 2 quantities of the product to the cart", () => {
        cy.contains('Forest Workshop').click();
        cy.contains('Wooden Desk').click();
        cy.get('.grid').contains("Wooden Desk").get('button').contains('+').click();
        cy.get('.grid').contains("Wooden Desk").get('button').contains('Add to cart').click();
        // Verify the cart
        cy.contains('Cart').click();
        // TODO: Check if the product is in the cart with the correct quantity
    });
});