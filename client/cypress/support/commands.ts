/// <reference types="cypress" />

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

Cypress.Commands.add('login2', () => {
  cy.intercept('GET', '**/u/login*', (req) => {
      console.log('Intercepting Auth0 login redirection...');
      // Handle the redirection if needed
    }).as('authRedirect');

  cy.get('button').contains('Log In').click();
  cy.wait('@authRedirect');
  cy.origin('https://dev-4rk7o1cuxvewyedu.us.auth0.com', () => {
      cy.get('input[name="username"]').type(Cypress.env('auth_username2'));
      cy.get('input[name="password"]').type(Cypress.env('auth_password2'));
      cy.get('button[name="action"]').eq(0).contains('Continue').click();
  });
  cy.url().should('include', '/');
});

Cypress.Commands.add('login2Updated', () => {
  cy.intercept('GET', '**/u/login*', (req) => {
      console.log('Intercepting Auth0 login redirection...');
      // Handle the redirection if needed
    }).as('authRedirect');

  cy.get('button').contains('Log In').click();
  cy.wait('@authRedirect');
  cy.origin('https://dev-4rk7o1cuxvewyedu.us.auth0.com', () => {
      cy.get('input[name="username"]').type(Cypress.env('auth_username2'));
      cy.get('input[name="password"]').type(Cypress.env('auth_passwordUpdate'));
      cy.get('button[name="action"]').eq(0).contains('Continue').click();
  });
  cy.url().should('include', '/');
});

Cypress.Commands.add('createAccount', () => {
  cy.intercept('GET', '**/u/login*', (req) => {
    console.log('Intercepting Auth0 login redirection...');
    // Handle the redirection if needed
  }).as('authLoginRedirect');
  cy.intercept('GET', '**/u/signup*', (req) => {
      console.log('Intercepting Auth0 signup redirection...');
      // Handle the redirection if needed
    }).as('authSignupRedirect');

  cy.get('button').contains('Log In').click();
  cy.wait('@authLoginRedirect');
  cy.origin('https://dev-4rk7o1cuxvewyedu.us.auth0.com', () => {
      cy.get('a[href*="/u/signup"]').click();
      cy.wait('@authSignupRedirect');
      // cy.get('input[name="username"]').type(Cypress.env('auth_createdUsername'));
      cy.get('input[name="email"]').type(Cypress.env('auth_createdUsername'));
      cy.get('input[name="password"]').type(Cypress.env('auth_createdPassword'));
      cy.get('button[name="action"]').eq(0).contains('Continue').click();
      cy.get('button[name="action"]').contains('Accept').click();
  });
  cy.url().should('include', '/');
});

Cypress.Commands.add('loginAccount', () => {
  cy.intercept('GET', '**/u/login*', (req) => {
      console.log('Intercepting Auth0 login redirection...');
      // Handle the redirection if needed
    }).as('authRedirect');

  cy.get('button').contains('Log In').click();
  cy.wait('@authRedirect');
  cy.origin('https://dev-4rk7o1cuxvewyedu.us.auth0.com', () => {
      cy.get('input[name="username"]').type(Cypress.env('auth_createdUsername'));
      cy.get('input[name="password"]').type(Cypress.env('auth_createdPassword'));
      cy.get('button[name="action"]').eq(0).contains('Continue').click();
  });
  cy.url().should('include', '/');
});

Cypress.Commands.add('subscribePremium', () => {
  // Stripe Interception
  cy.intercept('GET', 'checkout.stripe.com/*', (req) => {
    console.log('Intercepting Stripe checkout...');
    // Handle the redirection if needed
  }).as('stripeCheckout');

  cy.origin('checkout.stripe.com', () => {
    cy.get('button').contains('Upgrade').click();
    cy.url().should('include', '/upgrade');
    cy.get('div').contains("Premium").find('button').contains('Subscribe').click();
    cy.wait('@stripeCheckout');
    cy.get('input[name="email"]').type(Cypress.env('auth_createdUsername'));
    cy.get('input[name="cardnumber"]').type('4242424242424242');
    cy.get('input[name="exp-date"]').type('12/29');
    cy.get('input[name="cvc"]').type('424');
    cy.get('input[name="billingName"]').type('Test User');
    cy.get('input[name="billingPostalCode"]').type('42424');
    cy.get('input[name="enableStripePass"]').uncheck();
    cy.get('button').contains('Subscribe').click();
  });
  cy.url().should('include', '/account');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>
      login2(): Chainable<void>
      login2Updated(): Chainable<void>
      createAccount(): Chainable<void>
      loginAccount(): Chainable<void>
      subscribePremium(): Chainable<void>
      //drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

export {}