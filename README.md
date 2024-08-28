# ECommerceApp

An Ecommerce Project

## Features

This project contains both a backend and a frontend. The backend will be found in the server folder, while the frontend will be found in the client folder. The list of tools used and instructions on how to run the project will be listed in their respective section.
The application requires both the backend and frontend to be running to function properly and the respective packages to be installed.

## Initialization

To initialize the application you can run the following commands:

``` shell
npm install
npm run dev
```

This will initialize the initialize the backend and frontend, it is also possible to initialize the backend and frontend separately.
Instructions on how to do so have been provided in their respective section.

**_NOTE:_** You must create .env files for the client and server following the example.env format to successfully start the application.

### Backend

To initialize the backend, navigate to the backend folder

``` shell
cd server
npm i
npm run start:dev
```

- Nestjs
- Typescript
- MySQL
- Auth0
- Stripe

### Frontend

To initialize the frontend, navigate to the frontend folder

``` shell
cd client
npm i
npm run dev
```

- Reactjs + Vite
- Typescript
- TailwindCSS
- Auth0
- React Query
- Stripe

#### Testing

The frontend uses cypress testing, you can open the tests by using the following commands.

``` shell
cd client
npx cypress open
```

**_NOTE:_** You must create cypress.env.json file for the client and server example.cypress.env.json format to successfully run the tests. Some of these will require an auth0 account so that it can test logging in and performing actions.
