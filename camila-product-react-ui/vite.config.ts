import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: Number.parseInt(env.VITE_PORT || '3030', 10),
      proxy: {
        // REST API proxy
        '/product-dev/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8090',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/product-dev\/api/, '/product-dev/api'),
        },
        // gRPC-Web proxy (Envoy)
        // Matches paths like /product.ProductService/*
        '^/product\\.': {
          target: env.VITE_GRPC_ENDPOINT || 'http://localhost:8765',
          changeOrigin: true,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('[Vite Proxy] gRPC request:', req.method, req.url);
            });
          },
        },
      },
    },
  }
})
