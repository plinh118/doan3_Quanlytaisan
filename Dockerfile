FROM node:18-alpine AS base

# Giai đoạn 1: Cài dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm i -g pnpm
RUN pnpm i --no-frozen-lockfile  # Tắt --frozen-lockfile để tránh lỗi CI

# Giai đoạn 2: Build ứng dụng
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm i -g pnpm
RUN pnpm run build

# Giai đoạn 3: Image chạy production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 80
ENV PORT=80
CMD ["node", "server.js"]