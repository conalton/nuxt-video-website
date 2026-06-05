# syntax=docker/dockerfile:1.7

# ---------- 1) deps: install only what we need to build ----------
FROM node:24-alpine AS deps
WORKDIR /app

# Install full deps (including dev) for build. Skip postinstall scripts so
# `nuxt prepare` doesn't run before sources are copied.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ---------- 2) build: produce .output ----------
FROM node:24-alpine AS build
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Nuxt types, then build the Nitro server bundle.
RUN npx nuxt prepare && npx nuxt build

# ---------- 3) runtime: minimal image, only .output ----------
FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# Nitro bundles everything it needs inside .output, so no node_modules required.
COPY --from=build /app/.output ./.output

# Drop privileges — `node` user/group ship with the official image.
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/_healthz >/dev/null 2>&1 || exit 1

CMD ["node", ".output/server/index.mjs"]
