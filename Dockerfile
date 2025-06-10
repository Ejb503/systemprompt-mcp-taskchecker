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

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["node", "build/index.js"]