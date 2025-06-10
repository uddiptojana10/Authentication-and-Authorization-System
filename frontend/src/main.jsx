import { StrictMode } from 'react';
   import { createRoot } from 'react-dom/client';
   import { Auth0Provider } from '@auth0/auth0-react';
   import App from './App.jsx';
   import './index.css';

   const root = createRoot(document.getElementById('root'));
   root.render(
     <StrictMode>
       <Auth0Provider
         domain={import.meta.env.VITE_AUTH0_DOMAIN}
         clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
         authorizationParams={{
           redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
           audience: import.meta.env.VITE_AUTH0_AUDIENCE
         }}
       >
         <App />
       </Auth0Provider>
     </StrictMode>
   );