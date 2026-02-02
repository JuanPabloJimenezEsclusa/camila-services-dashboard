#!/bin/bash

# Start Envoy proxy for gRPC-web support
# This translates browser gRPC-web requests to backend gRPC

echo "Starting Envoy proxy for gRPC-web..."
echo "Browser: localhost:3030 → Envoy: localhost:8765 → Backend: localhost:6565"

docker run -d \
  --name envoy-grpc-proxy \
  --network host \
  -v "$(pwd)/envoy.yaml:/etc/envoy/envoy.yaml:ro" \
  envoyproxy/envoy:v1.29-latest

echo ""
echo "✅ Envoy proxy started on http://localhost:8765"
echo ""
echo "To stop: docker stop envoy-grpc-proxy && docker rm envoy-grpc-proxy"
echo "To view logs: docker logs -f envoy-grpc-proxy"
