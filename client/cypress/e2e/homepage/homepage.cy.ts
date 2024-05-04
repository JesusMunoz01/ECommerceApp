describe('Homepage', () => {
  it('should display the homepage', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.text-green-500').should('have.text', 'Home');
  });
});