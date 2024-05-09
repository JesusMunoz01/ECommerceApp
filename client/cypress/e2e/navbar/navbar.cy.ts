describe('Navbar', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });

  it('navigates to home when home link is clicked', () => {
    cy.get('a').contains('Home').click();
    cy.url().should('include', '/');
  });

  
  it("should display the logo, search bar, and Login button", () => {
    cy.get('.border-2').contains('Logo');
    cy.get('input[type="text"]').should('exist');
    cy.get('select').should('exist');
    cy.get('button').contains('Search').should('exist');
    cy.get('button').contains('Log In').should('exist');
  });

  it('navigates to brands when brands link is clicked', () => {
    cy.get('a').contains('Brands').click();
    cy.url().should('include', '/test');
  });

  it('navigates to cart when cart link is clicked', () => {
    cy.get('a').contains('Cart').click();
    cy.url().should('include', '/cart');
  });

  it("clicks on the login button and logs in with test account", () => {
    cy.login();
  })

  it("checks for the new upgrade button and navigates when clicked", () => {
    cy.login()
    cy.get('button').contains('Upgrade').should('exist');
    cy.get('button').contains('Upgrade').click();
    cy.url().should('include', '/upgrade');
  });

});