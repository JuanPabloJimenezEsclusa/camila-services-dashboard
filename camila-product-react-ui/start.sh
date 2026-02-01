#!/bin/bash

# Quick start script for Camila Product UI

set -o errexit # Exit on error. Append "|| true" if you expect an error.
set -o errtrace # Exit on error inside any functions or subshells.
set -o nounset # Do not allow use of undefined vars. Use ${VAR:-} to use an undefined VAR
if [[ "${debug:-}" == "true" ]]; then set -o xtrace; fi  # enable debug mode.

SEPARATOR="\n ################################################## \n"

cd "$(dirname "$0")"

echo -e "${SEPARATOR} 🚀 Starting Camila Product UI... ${SEPARATOR}"
echo ""

__check_os() {
  echo "${SEPARATOR} 🔍 Checking operating system... ${SEPARATOR}"
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Linux"
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "MacOS"
  else
    echo "Unsupported OS"
    exit 1
  fi
}

__check_node_modules() {
  if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
  fi
}

__check_backend() {
  echo -e "${SEPARATOR} 🔍 Checking if backend is running on http://localhost:8090... ${SEPARATOR}"
  if curl -s http://localhost:8090/product-dev/api/actuator/health > /dev/null 2>&1; then
    echo "✅ Backend is running!"
  else
    echo "⚠️  Warning: Backend doesn't seem to be running on http://localhost:8090"
    echo "   Make sure to start the Camila Product API service first."
    echo ""
    read -p "Press Enter to continue anyway..."
  fi

  echo ""
  echo "🎯 Starting development server..."
  echo "   The app will be available at http://localhost:3030"
  echo ""
}

__run_dev_server() {
  echo "${SEPARATOR} 🚀 Launching React development server... ${SEPARATOR}"
  npm run dev -DEBUG=*
}

main() {
  __check_os
  __check_node_modules
  __check_backend
  __run_dev_server
}

time main
