# Base image
FROM node:20-alpine AS base
WORKDIR /

# Dependencies layer
FROM base AS deps
COPY package*.json ./
COPY postcss.config.mjs ./
RUN npm ci --prefer-offline --no-audit

# Build layer
FROM base AS builder
COPY --from=deps /node_modules ./node_modules
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# Final production image
FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

WORKDIR /

COPY --from=builder /public ./public
COPY --from=builder /.next ./.next
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /package.json ./package.json
COPY --from=builder /postcss.config.mjs ./postcss.config.mjs
COPY --from=builder /.env ./.env

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
