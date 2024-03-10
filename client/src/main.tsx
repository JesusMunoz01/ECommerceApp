import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN as string}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID as string}
      authorizationParams={{
        redirectUri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE as string,
        scope: "openid profile email"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
