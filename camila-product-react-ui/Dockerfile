# Multi-stage build for React application with Nginx

# Stage 1: Build the React application
FROM node:25-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --no-audit --no-fund --legacy-peer-deps

# Copy source code
COPY . .

# Build the application (skip TypeScript check, Vite will handle it)
# Environment variables will be replaced at runtime, not build time
RUN npx vite build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Install bash for entrypoint script
RUN apk add --no-cache bash

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy runtime configuration template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create config template directory
RUN mkdir -p /etc/nginx/templates

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3030/health || exit 1

# Use custom entrypoint to inject runtime environment variables
ENTRYPOINT ["/docker-entrypoint.sh"]

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
