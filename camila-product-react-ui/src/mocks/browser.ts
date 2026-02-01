/**
 * MSW Browser Worker Setup
 * 
 * Sets up MSW to intercept browser requests for E2E testing
 * Only enabled when VITE_MSW_ENABLED=true
 */

import { setupWorker } from 'msw/browser';
import { handlers } from '../../e2e/mocks/handlers';

export const worker = setupWorker(...handlers);
