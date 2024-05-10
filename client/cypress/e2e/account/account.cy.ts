describe('Account Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/account');
    });
    
    it("shouldnt display account page if not logged in", () => {
        cy.contains('Not Found').should('be.visible');
    });
});