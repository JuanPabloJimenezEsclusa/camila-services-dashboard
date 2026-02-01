#!/bin/bash

###############################################################################
# Test Execution Script
#
# This script runs all tests (unit, integration, E2E) and reports results.
#
# Usage:
#   ./run-all-tests.sh              # Run all tests
#   ./run-all-tests.sh --coverage   # Run with coverage report
#   ./run-all-tests.sh --skip-e2e   # Skip E2E tests
#   ./run-all-tests.sh --verbose  # Verbose output
#
# Exit Codes:
#   0 - All tests passed
#   1 - Unit/Integration tests failed
#   2 - E2E tests failed
#   3 - Both test suites failed
###############################################################################

set -e  # Exit on error (disabled for individual test runs)
if [[ "${debug:-}" == "true" ]]; then set -o xtrace; fi  # enable debug mode.

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
COVERAGE=false
SKIP_E2E=false
VERBOSE=false
UNIT_EXIT_CODE=0
E2E_EXIT_CODE=0

###############################################################################
# Helper Functions
###############################################################################

print_header() {
  echo -e "\n${CYAN}${BOLD}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}${BOLD}  $1${NC}"
  echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

print_separator() {
  echo -e "${CYAN}───────────────────────────────────────────────────────────────${NC}"
}

###############################################################################
# Parse Arguments
###############################################################################

parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case $1 in
      --coverage)
        COVERAGE=true
        shift
        ;;
      --skip-e2e)
        SKIP_E2E=true
        shift
        ;;
      --verbose)
        VERBOSE=true
        shift
        ;;
      --help|-h)
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --coverage  Generate coverage report"
        echo "  --skip-e2e  Skip E2E tests"
        echo "  --verbose     Show detailed output"
        echo "  --help, -h  Show this help message"
        exit 0
        ;;
      *)
        print_error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
    esac
  done
}

###############################################################################
# Pre-flight Checks
###############################################################################

check_dependencies() {
  print_header "🔍 Pre-flight Checks"

  # Check if node_modules exists
  if [ ! -d "node_modules" ]; then
    print_error "node_modules not found. Running npm install..."
    if ! npm install
    then
      print_error "npm install failed!"
      exit 1
    fi
  else
    print_success "Dependencies found"
  fi

  # Check if we're in the right directory
  if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
  fi

  # Check if test scripts exist
  if ! grep -q '"test":' package.json; then
    print_error "No test script found in package.json"
    exit 1
  fi

  print_success "All pre-flight checks passed"
  echo ""
}

###############################################################################
# Run Unit & Integration Tests
###############################################################################

run_unit_tests() {
  print_header "🧪 Running Unit & Integration Tests"

  local TEST_CMD="npm run test:run"

  if [ "$COVERAGE" = true ]; then
    TEST_CMD="npm run test:coverage"
    print_info "Coverage reporting enabled"
  fi

  if [ "$VERBOSE" = true ]; then
    print_info "Running: $TEST_CMD"
  fi

  print_separator

  # Run tests and capture output
  if [ "$VERBOSE" = true ]; then
    $TEST_CMD
    UNIT_EXIT_CODE=$?
  else
    # Capture output and show summary
    TEST_OUTPUT=$($TEST_CMD 2>&1)
    UNIT_EXIT_CODE=$?

    # Extract and show summary
    echo "$TEST_OUTPUT" | tail -20
  fi

  print_separator

  if [ $UNIT_EXIT_CODE -eq 0 ]; then
    print_success "Unit & Integration tests passed!"

    # Show coverage summary if generated
    if [ "$COVERAGE" = true ] && [ -f "coverage/coverage-summary.json" ]; then
      echo ""
      print_info "Coverage report generated in ./coverage/"
      print_info "Open coverage/index.html in your browser to view details"
    fi
  else
    print_error "Unit & Integration tests FAILED!"
    if [ "$VERBOSE" = false ]; then
      echo ""
      print_info "Run with --verbose flag for detailed output"
    fi
  fi

  echo ""
  return $UNIT_EXIT_CODE
}

###############################################################################
# Run E2E Tests
###############################################################################

run_e2e_tests() {
  npx playwright install
  if [ "$SKIP_E2E" = true ]; then
    print_warning "E2E tests skipped (--skip-e2e flag)"
    return 0
  fi

  print_header "🌐 Running E2E Tests"

  # Check if Playwright is installed
  if ! npm list @playwright/test > /dev/null 2>&1; then
    print_warning "Playwright not found. Installing browsers..."
    if ! npx playwright install
    then
      print_error "Failed to install Playwright browsers"
      return 2
    fi
  fi

  # Check if dev server is required
  print_info "E2E tests will start dev server automatically"

  if [ "$VERBOSE" = true ]; then
    print_info "Running: npm run test:e2e"
  fi

  print_separator

  # Run E2E tests
  if [ "$VERBOSE" = true ]; then
    npm run test:e2e
    E2E_EXIT_CODE=$?
  else
    # Capture output and show summary
    E2E_OUTPUT=$(npm run test:e2e 2>&1)
    E2E_EXIT_CODE=$?

    # Show last lines (summary)
    echo "$E2E_OUTPUT" | tail -15
  fi

  print_separator

  if [ $E2E_EXIT_CODE -eq 0 ]; then
    print_success "E2E tests passed!"
  else
    print_error "E2E tests FAILED!"
    if [ "$VERBOSE" = false ]; then
      echo ""
      print_info "Run with --verbose flag for detailed output"
      print_info "Or use: npm run test:e2e:ui for interactive debugging"
    fi
  fi

  echo ""
  return $E2E_EXIT_CODE
}

###############################################################################
# Generate Final Report
###############################################################################

generate_report() {
  print_header "📊 Test Results Summary"

  local TOTAL_FAILED=0

  # Unit tests result
  if [ $UNIT_EXIT_CODE -eq 0 ]; then
    print_success "Unit & Integration Tests: PASSED"
  else
    print_error "Unit & Integration Tests: FAILED"
    TOTAL_FAILED=$((TOTAL_FAILED + 1))
  fi

  # E2E tests result
  if [ "$SKIP_E2E" = false ]; then
    if [ $E2E_EXIT_CODE -eq 0 ]; then
      print_success "E2E Tests: PASSED"
    else
      print_error "E2E Tests: FAILED"
      TOTAL_FAILED=$((TOTAL_FAILED + 2))
    fi
  else
    print_warning "E2E Tests: SKIPPED"
  fi

  echo ""
  print_separator

  # Final verdict
  if [ $TOTAL_FAILED -eq 0 ]; then
    echo -e "${GREEN}${BOLD}"
    echo "╔════════════════════════════════════════╗"
    echo "║   ✅ ALL TESTS PASSED! ✅              ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"

    if [ "$COVERAGE" = true ]; then
      echo ""
      print_info "Coverage report available at: coverage/index.html"
    fi

    return 0
  else
    echo -e "${RED}${BOLD}"
    echo "╔════════════════════════════════════════╗"
    echo "║   ❌ TESTS FAILED! ❌                  ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"

    echo ""
    print_info "Failed test suites: $TOTAL_FAILED"

    # Helpful hints
    echo ""
    print_info "Debugging tips:"
    echo "  • Run with --verbose for detailed output"
    echo "  • Use 'npm run test:ui' for interactive test debugging"
    echo "  • Use 'npm run test:e2e:debug' for E2E debugging"
    echo "  • Check test files for specific failures"

    return $TOTAL_FAILED
  fi
}

###############################################################################
# Main Execution
###############################################################################

main() {
  START_TIME="$(date +%s)"

  # Parse command line arguments
  parse_arguments "$@"

  # Banner
  echo -e "${CYAN}${BOLD}"
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║              🧪 Test Suite Runner 🧪                         ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo -e "${NC}"

  # Show configuration
  print_info "Configuration:"
  echo "  Coverage: $COVERAGE"
  echo "  Skip E2E: $SKIP_E2E"
  echo "  Verbose: $VERBOSE"
  echo ""

  # Run checks
  check_dependencies

  # Run unit & integration tests
  run_unit_tests
  UNIT_EXIT_CODE=$?

  # Run E2E tests (if not skipped)
  if [ "$SKIP_E2E" = false ]; then
    run_e2e_tests
    E2E_EXIT_CODE=$?
  fi

  # Calculate duration
  END_TIME="$(date +%s)"
  local DURATION="$((END_TIME - START_TIME))"

  # Generate report
  generate_report
  local FINAL_EXIT_CODE=$?

  # Show duration
  echo ""
  print_info "Total execution time: ${DURATION}s"
  echo ""

  # Exit with appropriate code
  exit $FINAL_EXIT_CODE
}

# Run main function with all arguments
main "$@"
