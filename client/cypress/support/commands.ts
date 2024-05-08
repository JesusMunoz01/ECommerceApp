/// <reference types="cypress" />
import 'cypress-real-events/support';
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>
      //drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

Cypress.Commands.add('login', () => {
    cy.intercept('GET', '**/u/login*', (req) => {
        console.log('Intercepting Auth0 login redirection...');
        // Handle the redirection if needed
      }).as('authRedirect');

    cy.get('button').contains('Log In').click();
    cy.wait('@authRedirect');
    cy.origin('https://dev-4rk7o1cuxvewyedu.us.auth0.com', () => {
        cy.get('input[name="username"]').type(Cypress.env('auth_username'));
        cy.get('input[name="password"]').type(Cypress.env('auth_password'));
        cy.get('button[name="action"]').eq(0).contains('Continue').click();
    });
    cy.url().should('include', '/');
  });