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
});