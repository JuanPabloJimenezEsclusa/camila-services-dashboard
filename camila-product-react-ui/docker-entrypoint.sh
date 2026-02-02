#!/bin/bash
set -e

echo "🚀 Starting Camila Product UI..."

# Define the config file path
CONFIG_FILE="/usr/share/nginx/html/config.js"

# Create runtime configuration file with environment variables
echo "📝 Generating runtime configuration..."

cat > "$CONFIG_FILE" << EOF
// Runtime configuration injected by Docker
// This file is generated at container startup and can be modified with environment variables
window._env_ = {
  VITE_AUTH_ENABLED: "${VITE_AUTH_ENABLED:-true}",
  VITE_AUTH_AUTHORITY: "${VITE_AUTH_AUTHORITY:-http://keycloak:9191/realms/camila-realm}",
  VITE_AUTH_CLIENT_ID: "${VITE_AUTH_CLIENT_ID:-camila-client}",
  VITE_AUTH_CLIENT_SECRET: "${VITE_AUTH_CLIENT_SECRET:-Fuvf8XyBDXxU57NAOOFZVvdUIPmGgiyE}",
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-/product-dev/api}",
  VITE_GRAPHQL_ENDPOINT: "${VITE_GRAPHQL_ENDPOINT:-/product-dev/api/graphql}",
  VITE_GRPC_ENDPOINT: "${VITE_GRPC_ENDPOINT:-http://envoy:8765}",
  VITE_RSOCKET_URL: "${VITE_RSOCKET_URL:-ws://gateway:7000/product-dev/api/rsocket}",
  VITE_API_VERSION: "${VITE_API_VERSION:-1.0.0}",
  VITE_DEFAULT_LANGUAGE: "${VITE_DEFAULT_LANGUAGE:-en-US}"
};

console.log('🔧 Runtime configuration loaded:', {
  auth: {
    enabled: window._env_.VITE_AUTH_ENABLED,
    authority: window._env_.VITE_AUTH_AUTHORITY,
  },
  api: {
    baseUrl: window._env_.VITE_API_BASE_URL,
    graphql: window._env_.VITE_GRAPHQL_ENDPOINT,
    grpc: window._env_.VITE_GRPC_ENDPOINT,
    rsocket: window._env_.VITE_RSOCKET_URL
  }
});
EOF

echo "✅ Runtime configuration generated"
echo "🔧 Configuration:"
echo "   AUTH_ENABLED: ${VITE_AUTH_ENABLED:-true}"
echo "   AUTH_AUTHORITY: ${VITE_AUTH_AUTHORITY:-http://keycloak:9191/realms/camila-realm}"
echo "   API_BASE_URL: ${VITE_API_BASE_URL:-/product-dev/api}"
echo "   GRAPHQL_ENDPOINT: ${VITE_GRAPHQL_ENDPOINT:-/product-dev/api/graphql}"
echo "   GRPC_ENDPOINT: ${VITE_GRPC_ENDPOINT:-http://envoy:8765}"
echo "   RSOCKET_URL: ${VITE_RSOCKET_URL:-ws://gateway:7000/product-dev/api/rsocket}"

# Ensure config.js is included in index.html
# This script ensures the config is loaded before the app
INDEX_FILE="/usr/share/nginx/html/index.html"
if [ -f "$INDEX_FILE" ]; then
  # Check if config.js is already included
  if ! grep -q "config.js" "$INDEX_FILE"; then
    echo "📄 Injecting config.js into index.html..."
    sed -i 's|<head>|<head>\n    <script src="/config.js"></script>|' "$INDEX_FILE"
  fi
fi

echo "🎉 Camila Product React UI is ready!"
echo "🌐 Starting Nginx..."

# Execute the CMD (nginx)
exec "$@"
