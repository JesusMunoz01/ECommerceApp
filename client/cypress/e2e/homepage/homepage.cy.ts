describe('Homepage', () => {
    // beforeEach(() => {
    //     cy.visit('http://localhost:5173/');
    // });
    
    it('should display the homepage and related elements', () => {
        cy.visit('http://localhost:5173/');
        cy.get('.text-green-500').should('have.text', 'Home');
        cy.get('h1').should('have.text', 'Products');
        cy.get('h2').should('have.text', 'Featured Products');
        cy.get('button').contains('Add to cart').should('exist');
      });
});