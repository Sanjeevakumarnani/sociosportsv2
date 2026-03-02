import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { API_URL } from './services/api'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId="839298249817-9c09fntl7jvcg72igo7snv33fp1rfhar.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
