# syntax=docker/dockerfile:1.7

# Static CDN image: nginx serving gallery assets from public/gallery.
# Built and published separately from the main Nuxt server image.

FROM nginx:1.27-alpine

# Custom config (no default site, brotli not needed since nginx-alpine doesn't ship it).
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/cdn.conf

# Copy the assets snapshot. Build context must be the repo root so this path
# resolves; see `.github/workflows/cdn.yml`.
COPY --chown=nginx:nginx public/gallery /usr/share/nginx/html/gallery

# Note: base nginx:1.27-alpine already declares EXPOSE 80. Actual publishing
# is done via `ports:` in docker-compose.cdn.yml (loopback bind on host).

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/_healthz >/dev/null 2>&1 || exit 1
