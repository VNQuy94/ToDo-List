# ==========================================
# Stage 1: Base image
# ==========================================
FROM node:20-alpine AS base

WORKDIR /app

# Cài đặt pnpm toàn cục
RUN npm install -g pnpm

# Sao chép các tệp cấu hình dependencies
COPY package.json pnpm-lock.yaml* ./

# ==========================================
# Stage 2: Development environment (Vite HMR)
# ==========================================
FROM base AS development

# Cài đặt toàn bộ dependencies
RUN pnpm install --no-frozen-lockfile

# Sao chép mã nguồn ứng dụng
COPY . .

# Phân quyền user node
RUN chown -R node:node /app
USER node

EXPOSE 5173

# Khởi chạy Vite Dev Server hỗ trợ Hot Module Replacement (HMR)
CMD ["pnpm", "dev", "--host"]

# ==========================================
# Stage 3: Assets builder for production
# ==========================================
FROM base AS builder

RUN pnpm install --no-frozen-lockfile

# Nhận biến môi trường tại thời điểm Build để truyền vào Vite Compiler
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .

# Thực hiện biên dịch mã nguồn
RUN pnpm build

# ==========================================
# Stage 4: Production runtime
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

# Cài đặt máy chủ tĩnh serve toàn cục
RUN npm install -g serve

# Sao chép thư mục dist từ Stage builder
COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app
USER node

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
