import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Log that main.jsx is loading
console.log('main.jsx is loading...');

try {
  const rootElement = document.getElementById('root');
  console.log('Root element found:', rootElement);
  
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Failed to render React app:', error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #ff4444; color: white; padding: 20px; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; background: white; color: #333; padding: 30px; border-radius: 10px;">
        <h1 style="color: #ff4444;">⚠️ Critical Error</h1>
        <p>Failed to initialize the application.</p>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto;">${error.message}\n\n${error.stack}</pre>
      </div>
    </div>
  `;
}
