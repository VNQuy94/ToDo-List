# ==========================================
# Stage 1: Base image
# ==========================================
FROM node:20-alpine AS base

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependency configuration files
COPY package.json pnpm-lock.yaml* ./

# ==========================================
# Stage 2: Development environment
# ==========================================
FROM base AS development

# Install all dependencies including devDependencies
RUN pnpm install --no-frozen-lockfile

# Copy application source code
COPY src ./src

# Change ownership to non-root node user
RUN chown -R node:node /app
USER node

EXPOSE 5000

# Start with native Node.js v20 file watcher
CMD ["node", "--watch", "src/server.js"]

# ==========================================
# Stage 3: Production dependencies installer
# ==========================================
FROM base AS dependencies

# Install production dependencies only
RUN pnpm install --prod --no-frozen-lockfile

# ==========================================
# Stage 4: Production runtime
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy built node_modules and source code
COPY --from=dependencies /app/node_modules ./node_modules
COPY src ./src

# Use non-root node user
RUN chown -R node:node /app
USER node

EXPOSE 5000
CMD ["node", "src/server.js"]
