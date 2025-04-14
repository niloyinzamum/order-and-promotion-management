# Base image
FROM node:20-alpine AS base
WORKDIR /app  # Change from / to /app

# Dependencies layer
FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY postcss.config.mjs ./
RUN npm ci --prefer-offline --no-audit

# Build layer - using non-Alpine image for more memory
FROM node:20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=8192"  
# Increased memory limit
RUN npm run build

# Final production image
FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=builder /app/.env ./.env

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV UV_THREADPOOL_SIZE=6

CMD ["npm", "start"]