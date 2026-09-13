import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const originalFetch = window.fetch;
window.fetch = async (input, init = {}) => {
  const token = localStorage.getItem('token');
  // Garante que headers seja um objeto Headers, não só um literal
  const headers = init.headers instanceof Headers
    ? init.headers
    : new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return originalFetch(input, { ...init, headers });
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <App />

  </StrictMode>,
)