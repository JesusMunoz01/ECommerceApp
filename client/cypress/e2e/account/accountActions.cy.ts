describe('Account Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/account');
    });

    it("should go to the sell page and create a product", () => {
        cy.login();
        cy.wait(1000);
        cy.visit('http://localhost:5173/sell');
        cy.get('input[name="name"]').type('Test Product');
        cy.get('textarea[name="description"]').type('Test Description');
        cy.get('input[name="price"]').clear().type('100');
        cy.get('input[name="stock"]').clear().type('10');
        cy.get('input[name="discountNumber"]').clear().type('0');
        cy.get('button').contains('Create Product').click();
        
        // Check profile to see if the product is created
        cy.visit('http://localhost:5173/account');
        cy.wait(1000);
        cy.contains('Test Product').should('be.visible');
    });

    it("should be able to edit the product", () => {
        cy.login();
        cy.wait(1000);
        cy.visit('http://localhost:5173/account');
        // Get the div that contains the div with the product name and the div with the edit button, click the edit button
        cy.contains('Test Product').parent().parent().get('button').contains('Edit').click();
        cy.contains('Edit Product').should('be.visible');
        // input should have a previous value, check it, clear it and type a new value
        cy.get('input[name="name"]').should('have.value', 'Test Product')
        cy.get('input[name="name"]').clear().type('Test Product Updated');

        cy.get("textarea[name='description']").should('have.value', 'Test Description')
        cy.get("textarea[name='description']").clear().type('Test Description Updated');

        cy.get('input[name="price"]').should('have.value', '100')
        cy.get('input[name="price"]').clear().type('200');

        cy.get('input[name="stock"]').should('have.value', '10')
        cy.get('input[name="stock"]').clear().type('20');

        cy.get('input[name="discountNumber"]').clear().type('0');

        cy.get('button').contains('Update Product').click();
    });

    it("should be able to delete the product", () => {
        cy.login();
        cy.wait(1000);
        cy.visit('http://localhost:5173/account');
        cy.contains('Test Product Updated').parent().parent().get('button').contains('Delete').click();
        cy.wait(1000);
        cy.contains('Test Product Updated').should('not.exist');
    });

    it("should be able to edit the user", () => {
        cy.login();
        cy.wait(1000);
        cy.visit('http://localhost:5173/settings');
        cy.contains('Edit User').click();
        cy.get("form").should('be.visible').and('contain', 'Edit User');
        cy.get('input[name="name"]').clear().type('Test User Updated');
        cy.contains('Update').click();
    });

    it("should be able to bring out the delete user popup and click cancel", () => {
        cy.login();
        cy.wait(1000);
        cy.visit('http://localhost:5173/settings');
        cy.contains('Delete User').click();
        cy.contains('Are you sure you want to delete your account?').should('be.visible');
        cy.get('button').contains('Cancel').should('be.visible');
        cy.get('button').contains('Confirm').should('be.visible');
        cy.get('button').contains('Cancel').click();
        cy.contains('Are you sure you want to delete your account?').should('not.exist');
    });

});