describe('Account Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/account');
    });

    // it("should go to the sell page and create a product", () => {
    //     cy.login();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/sell');
    //     cy.get('input[name="name"]').type('Test Product');
    //     cy.get('textarea[name="description"]').type('Test Description');
    //     cy.get('input[name="price"]').clear().type('100');
    //     cy.get('input[name="stock"]').clear().type('10');
    //     cy.get('input[name="discountNumber"]').clear().type('0');
    //     cy.get('button').contains('Create Product').click();
        
    //     // Check profile to see if the product is created
    //     cy.visit('http://localhost:5173/account');
    //     cy.wait(1000);
    //     cy.contains('Test Product').should('be.visible');
    // });

    // it("should be able to edit the product", () => {
    //     cy.login();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/account');
    //     // Get the div that contains the div with the product name and the div with the edit button, click the edit button
    //     cy.contains('Test Product').parent().parent().get('button').contains('Edit').click();
    //     cy.contains('Edit Product').should('be.visible');
    //     // input should have a previous value, check it, clear it and type a new value
    //     cy.get('input[name="name"]').should('have.value', 'Test Product')
    //     cy.get('input[name="name"]').clear().type('Test Product Updated');

    //     cy.get("textarea[name='description']").should('have.value', 'Test Description')
    //     cy.get("textarea[name='description']").clear().type('Test Description Updated');

    //     cy.get('input[name="price"]').should('have.value', '100')
    //     cy.get('input[name="price"]').clear().type('200');

    //     cy.get('input[name="stock"]').should('have.value', '10')
    //     cy.get('input[name="stock"]').clear().type('20');

    //     cy.get('input[name="discountNumber"]').clear().type('0');

    //     cy.get('button').contains('Update Product').click();
    // });

    // it("should be able to delete the product", () => {
    //     cy.login();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/account');
    //     cy.contains('Test Product Updated').parent().parent().get('button').contains('Delete').click();
    //     cy.wait(1000);
    //     cy.contains('Test Product Updated').should('not.exist');
    // });

    // it("should be able to see current personal information", () => {
    //     cy.login2();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/settings');
    //     cy.contains('Personal Information').click();
    //     cy.contains(`Username: ${Cypress.env('auth_username2')}`).should('be.visible');
    //     cy.contains(`Email: ${Cypress.env('auth_username2')}`).should('be.visible');
    //     cy.contains("Plan: Free").should('be.visible');
    // });

    // it("should be able to edit the user", () => {
    //     cy.login2();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/settings');
    //     cy.contains('Personal Information').click();
    //     cy.contains('Edit Profile').click();
    //     cy.get("form").should('be.visible').and('contain', 'Edit User');
    //     cy.get('input[name="name"]').clear().type(Cypress.env('auth_usernameUpdate'));
    //     cy.get('input[name="email"]').clear().type(Cypress.env('auth_emailUpdate'));
    //     cy.get('input[name="confirmEmail"]').clear().type(Cypress.env('auth_emailUpdate'));
    //     cy.contains('Update').click();
    //     cy.contains('Account Details').should('be.visible');
    //     // Note: Update is in the database not Auth0
    // });

    // it("should be able to see current security information", () => {
    //     cy.login2();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/settings');
    //     cy.contains('Account Security').click();
    //     cy.contains("Verification Status: Not Verified").should('be.visible');
    //     cy.contains("Subscription Name: Free").should('be.visible');
    //     cy.contains("Subscription Status: N/A").should('be.visible');
    // });

    // it("should be able to edit the security", () => {
    //     cy.login2();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/settings');
    //     cy.contains('Account Security').click();
    //     cy.contains('Edit Password').click();
    //     cy.get("form").should('be.visible').and('contain', 'Edit Password');
    //     cy.get('input[name="password"]').clear().type(Cypress.env('auth_passwordUpdate'));
    //     cy.get('input[name="confirmPassword"]').clear().type(Cypress.env('auth_passwordUpdate'));
    //     cy.contains('Update').click();
    //     cy.contains('Account Details').should('be.visible');
    // });

    // it("should attempt to login with the updated password and update to old information", () => {
    //     cy.login2Updated();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/account');
    //     cy.contains(Cypress.env('auth_username2')).should('be.visible');
    //     cy.visit('http://localhost:5173/settings');
    //     cy.contains('Account Security').click();
    //     cy.contains('Edit Password').click();
    //     cy.get("form").should('be.visible').and('contain', 'Edit Password');
    //     cy.get('input[name="password"]').clear().type(Cypress.env('auth_password2'));
    //     cy.get('input[name="confirmPassword"]').clear().type(Cypress.env('auth_password2'));
    //     cy.contains('Update').click();
    //     cy.contains('Account Details').should('be.visible');
    // });

    // it("should be able to bring out the delete user popup and click cancel", () => {
    //     cy.login();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/settings');
    //     cy.contains('Delete User').click();
    //     cy.contains('Are you sure you want to delete your account?').should('be.visible');
    //     cy.get('button').contains('Cancel').should('be.visible');
    //     cy.get('button').contains('Confirm').should('be.visible');
    //     cy.get('button').contains('Cancel').click();
    //     cy.contains('Are you sure you want to delete your account?').should('not.exist');
    // });

    it("should be able to create a new account", () => {
        cy.createAccount();
        cy.wait(1000);
        cy.get('button[name="accountButton"]').click();
        cy.get('p').eq(0).contains(Cypress.env('auth_createdUsername'));
        cy.get('p').eq(1).contains(Cypress.env('auth_createdPassword'))
    });

    // TODO: Upgrading to a paid plan
    // TODO: Deleting the account

    it("should be able to delete the account", () => {
        cy.loginAccount();
        cy.wait(1000);
        cy.visit('http://localhost:5173/settings');
        cy.contains('Delete User').click();
        cy.contains('Are you sure you want to delete your account?').should('be.visible');
        cy.get('button').contains('Cancel').should('be.visible');
        cy.get('button').contains('Confirm').should('be.visible');
        cy.get('button').contains('Confirm').click();
    });

});