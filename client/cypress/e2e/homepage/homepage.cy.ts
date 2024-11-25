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

    it('should click on a product and add it to cart', () => {
        cy.visit('http://localhost:5173/');
        cy.get('button').contains('Add to cart').click();
        cy.get('a').contains('Cart').click();
        cy.url().should('include', '/cart');
        cy.get('h1').eq(0).should('have.text', 'Your Cart');
        cy.get('button').contains('Remove').should('exist');
    });

    it("should select multiple products with multiple quantities and add them to cart", () => {
        cy.visit('http://localhost:5173/');
        cy.get('button').contains('Add to cart').click();
        cy.get('button').contains('Add to cart').click();
        cy.get('a').contains('Cart').click();
        cy.url().should('include', '/cart');
        cy.get('h1').eq(0).should('have.text', 'Your Cart');
        cy.get('button').contains('Remove').should('exist');
    });

    it('should go to the product page', () => {
        cy.visit('http://localhost:5173/');
        cy.get('h3').eq(0).click();
        cy.url().should('include', '/product/1');

        // Check for Reviews and review form
    });

    it('should go to the product page of a reviewed product', () => {
        cy.visit('http://localhost:5173/');
        cy.get('h3').eq(0).click();
        cy.url().should('include', '/product/1');

        // Check for Reviews
    });
});