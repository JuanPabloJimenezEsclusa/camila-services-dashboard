/**
 * Mock Server for E2E Tests
 * 
 * Starts an MSW server that intercepts HTTP requests during Playwright tests
 * This runs in Node.js (not in the browser) for better control
 */

import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// Create server instance
export const server = setupServer(...handlers);

// Start server before all tests
export function startMockServer() {
  console.log('🎭 Starting MSW Mock Server for E2E tests...');
  
  server.listen({
    onUnhandledRequest: 'warn', // Warn about unhandled requests
  });
  
  console.log('✅ Mock Server Started');
  console.log('   - REST API: http://localhost:8090/product-dev/api');
  console.log('   - GraphQL: http://localhost:8090/product-dev/api/graphql');
  console.log('   - Keycloak: http://localhost:9191/realms/camila-realm\n');
}

// Stop server after all tests
export function stopMockServer() {
  console.log('\n🛑 Stopping MSW Mock Server...');
  server.close();
  console.log('✅ Mock Server Stopped');
}

// Reset handlers between tests
export function resetMockServer() {
  server.resetHandlers();
}
