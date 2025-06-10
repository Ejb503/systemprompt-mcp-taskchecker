# Use Node.js 18 Alpine for a smaller image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install all dependencies (skip prepare script initially)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the TypeScript application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --omit=dev

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the server
CMD ["node", "build/index.js"]