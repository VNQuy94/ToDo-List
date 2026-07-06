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
# Stage 2: Development environment (Vite HMR)
# ==========================================
FROM base AS development

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

# Copy application source code
COPY . .

# Use non-root node user
RUN chown -R node:node /app
USER node

EXPOSE 5173

# Start Vite Dev Server with HMR enabled
CMD ["pnpm", "dev", "--host"]

# ==========================================
# Stage 3: Assets builder for production
# ==========================================
FROM base AS builder

RUN pnpm install --no-frozen-lockfile

# Pass build arguments to Vite environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .

# Compile static assets
RUN pnpm build

# ==========================================
# Stage 4: Production runtime
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

# Install static file server package globally
RUN npm install -g serve

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist ./dist

# Use non-root node user
RUN chown -R node:node /app
USER node

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
