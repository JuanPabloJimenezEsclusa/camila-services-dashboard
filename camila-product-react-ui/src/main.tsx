import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import './i18n/config'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { initPerformanceMonitoring } from './utils/performance'

// Initialize Web Vitals monitoring
initPerformanceMonitoring();

// Start MSW worker for E2E testing (only when enabled)
async function enableMocking() {
  if (import.meta.env.VITE_MSW_ENABLED !== 'true') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <PrivateRoute>
            <App />
          </PrivateRoute>
        </ThemeProvider>
      </AuthProvider>
    </React.StrictMode>,
  );
});
