describe('Account Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/account');
    });
    
    it("shouldnt display account page if not logged in", () => {
        cy.contains('Not Found').should('be.visible');
    });

    it("should display account page if logged in", () => {
        cy.login();
        cy.wait(1000);
        cy.visit('http://localhost:5173/account');
        cy.contains('Username: testuseraccount@ecproject.com')
        cy.contains('Account Details').should('be.visible');
        cy.contains('Your Products').should('be.visible');
        cy.contains('Your Brand').should('be.visible');
    });

    it("should check the sidebar items", () => {
        cy.login();
        cy.wait(1000);
        cy.visit('http://localhost:5173/account');
        cy.get('a').contains('Profile').should('be.visible');
        cy.get('a').contains('Settings').should('be.visible');
        cy.get('a').contains('Sell').should('be.visible');
    });

    it("should click on the settings link and navigate to settings page", () => {
        cy.login();
        cy.wait(1000);
        cy.visit('http://localhost:5173/account');
        cy.get('a').contains('Settings').click();
        cy.url().should('include', '/settings');
    });

    it("should click on the sell link and navigate to sell page", () => {
        cy.login();
        cy.wait(1000);
        cy.visit('http://localhost:5173/account');
        cy.get('a').contains('Sell').click();
        cy.url().should('include', '/sell');
    });

    it("should display order history", () => {
        cy.login();
        cy.wait(1000);
        cy.visit('http://localhost:5173/account');
        cy.get('a').contains('Settings').click();
        cy.get('button').contains('Order History').click();
        cy.contains('Your Orders').should('be.visible');
    });
});