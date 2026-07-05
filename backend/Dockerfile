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
# Stage 2: Development environment
# ==========================================
FROM base AS development

# Cài đặt toàn bộ dependencies (bao gồm cả devDependencies)
RUN pnpm install --no-frozen-lockfile

# Sao chép mã nguồn ứng dụng
COPY src ./src

# Đổi quyền sở hữu sang user node
RUN chown -R node:node /app
USER node

EXPOSE 5000

# Khởi chạy bằng chế độ watch có sẵn của Node v20 để tự reload khi sửa file nguồn
CMD ["node", "--watch", "src/server.js"]

# ==========================================
# Stage 3: Production dependencies installer
# ==========================================
FROM base AS dependencies

# Chỉ cài đặt dependencies dùng cho chạy thực tế
RUN pnpm install --prod --no-frozen-lockfile

# ==========================================
# Stage 4: Production runtime
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Sao chép các thành phần tối giản từ các Stage trước
COPY --from=dependencies /app/node_modules ./node_modules
COPY src ./src

RUN chown -R node:node /app
USER node

EXPOSE 5000
CMD ["node", "src/server.js"]
