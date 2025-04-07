# Base image
FROM node:20-alpine AS base
WORKDIR /

# Install dependencies
FROM base AS deps
COPY package*.json ./
COPY postcss.config.mjs ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /
COPY --from=deps /node_modules ./node_modules
COPY . .

RUN fallocate -l 1G /swapfile && \
    chmod 600 /swapfile && \
    mkswap /swapfile && \
    swapon /swapfile
# Set memory limit for Node.js
ENV NODE_OPTIONS="--max-old-space-size=1048"
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy build output
COPY --from=builder /public ./public
COPY --from=builder /.next ./.next
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /package.json ./package.json
COPY --from=builder /postcss.config.mjs ./postcss.config.mjs
# Copy .env file if needed
COPY --from=builder /.env ./.env

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]