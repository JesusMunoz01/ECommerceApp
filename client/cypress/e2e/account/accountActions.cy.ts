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
    //     cy.contains("Subscription Name: Premium").should('be.visible');
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

    // it("should be able to create a new account", () => {
    //     cy.createAccount();
    //     cy.wait(1000);
    //     cy.get('button[name="accountButton"]').click();
    //     cy.get('p').eq(0).contains(Cypress.env('auth_createdUsername'));
    //     cy.get('p').eq(1).contains(Cypress.env('auth_createdUsername'))
    // });

    // it("should not be able to see brand options in account page without a subscription", () => {
    //     cy.loginAccount();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/account');
    //     cy.contains('New Brand').should('not.exist');
    // });

    // it("should be able to delete the account", () => {
    //     cy.loginAccount();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/settings');
    //     cy.contains('Delete User').click();
    //     cy.contains('Are you sure you want to delete your account?').should('be.visible');
    //     cy.get('button').contains('Cancel').should('be.visible');
    //     cy.get('button').contains('Confirm').should('be.visible');
    //     cy.get('button').contains('Confirm').click();
    //     cy.contains('Are you sure you want to delete your account?').should('not.exist');
    //     cy.url().should('include', '/');
    //     cy.get('button').contains('Log In').should('be.visible');
    // });

    // it("should be able to upgrade to a paid plan", () => {
    //     cy.loginAccount();
    //     cy.wait(1000);
    //     cy.subscribePremium();
    //     cy.visit('http://localhost:5173/account');
    //     cy.contains('Plan: Premium').should('be.visible');
    //     cy.contains('New Brand').should('be.visible');
    // });
    // Issue with stripe redirect

    // it("should be able to see brand options in account page with an active subscription", () => {
    //     cy.login2();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/account');
    //     cy.contains('New Brand').should('be.visible');
    // });

    // it("should be able to create a brand page without products", () => {
    //     cy.login2();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/brands');
    //     cy.contains('Test Brand').should('not.exist');
    //     cy.visit('http://localhost:5173/account');
    //     cy.contains('New Brand').click();
    //     cy.get('input[name="brandName"]').type('Test Brand');
    //     cy.get('textarea[name="brandDescription"]').type('Test Description');
    //     cy.get('button').contains('Submit').click();
    //     cy.visit('http://localhost:5173/account');
    //     cy.contains('Test Brand').should('be.visible');
    //     cy.visit('http://localhost:5173/brands');
    //     cy.contains('Test Brand').should('be.visible');
    //     cy.contains('Test Brand').click();
    //     cy.contains("No Products Found").should('be.visible');
    // });

    // it("should be able to modify the brand page", () => {
    //     cy.login2();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/account');
    //     cy.contains('Test Brand').parent().parent().get('button').contains('Edit').click();
    //     cy.get('input[name="brandName"]').clear().type('Test Brand Updated');
    //     cy.get("textarea[name='brandDescription']").clear().type('Test Description Updated');
    //     cy.get('button').contains('Save Changes').click();
    //     cy.visit('http://localhost:5173/account');
    //     cy.contains('Test Brand Updated').should('be.visible');
    //     cy.visit('http://localhost:5173/brands');
    //     cy.contains('Test Brand Updated').should('be.visible');
    // });

    // // TODO: Attempt to open the add product popup when editing a brand page

    it("should be able to open the add products popup and have no items", () => {
        cy.login2();
        cy.wait(1000);
        cy.visit('http://localhost:5173/account');
        cy.contains('Test Brand').parent().parent().get('button').contains('Edit').click();
        //cy.contains("No Products Found").should('be.visible');
        cy.get("button[name='addProduct']").click()
        cy.contains("Your Products:").should('be.visible')
        cy.get("input[name='productCheckbox']").should("not.exist");
    })

    // // TODO: Create a product and add it to the brand page

    // it("should be able to create a product and add it to brand page", () => {
    //     cy.login2();
    //     cy.wait(1000);
    //     cy.visit('http://localhost:5173/sell');
    //     cy.get('input[name="name"]').type('Test Chair');
    //     cy.get('textarea[name="description"]').type('Test Chair for creating products');
    //     cy.get('input[name="price"]').clear().type('300');
    //     cy.get('input[name="stock"]').clear().type('10');
    //     cy.get('input[name="discountNumber"]').clear().type('0');
    //     cy.get('button').contains('Create Product').click();
        
    //     // Check profile to see if the product is created
    //     cy.visit('http://localhost:5173/account');
    //     cy.wait(1000);
    //     cy.contains('Test Product').should('be.visible');

    //     cy.visit('http://localhost:5173/account');
    //     cy.contains('Test Brand').parent().parent().get('button').contains('Edit').click();
    //     cy.get("button[name='addProduct']").click()
    //     cy.contains("Your Products:").should('be.visible')
    //     cy.get("input[name='productCheckbox']").should("be.visible");
    //     cy.get("input[name='productCheckbox']").first().check();
    //     cy.get("button[name='productSelectionBtn']").click()
    //     cy.contains("Test Chair").should('be.visible');
    // })

    // TODO: Delete a product from the brand page

    // TODO: Create a brand page with a starting product

    // TODO: Delete brand page

    // TODO: Cancel subscription

    // TODO: Order Items

    // TODO: View Order History

});