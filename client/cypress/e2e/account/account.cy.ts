describe('Account Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/account');
    });
    
    it("shouldnt display account page if not logged in", () => {
        cy.contains('Not Found').should('be.visible');
    });

    it("should display account page if logged in", () => {
        cy.login();
        cy.visit('http://localhost:5173/account');
        cy.contains('Account Details').should('be.visible');
        cy.contains('Your Products').should('be.visible');
        cy.contains('Your Brand').should('be.visible');
    });

    it("should check the sidebar items", () => {
        cy.login();
        cy.visit('http://localhost:5173/account');
        cy.get('button').contains('Profile').should('be.visible');
        cy.get('button').contains('Products').should('be.visible');
        cy.get('button').contains('Brands').should('be.visible');
    });
});