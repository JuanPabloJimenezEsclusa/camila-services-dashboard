#!/bin/bash
# Run E2E tests with mocked backend
# This script sets environment variables and runs Playwright tests
#
# Note: Dev server will be automatically started by Playwright
# No need to run 'npm run dev' separately

# Set environment for E2E testing
export VITE_AUTH_ENABLED=false
export VITE_MSW_ENABLED=true

echo "🎭 Running E2E tests with mocked backend..."
echo "   Auth: Disabled"
echo "   MSW: Enabled"
echo "   Dev Server: Will auto-start on port 3030"
echo ""

# Run Playwright tests (will auto-start dev server)
npx playwright test e2e/product-list-mocked.spec.ts "$@"
