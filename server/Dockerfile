# Pinned to the Bun the server is tested with.
FROM oven/bun:1.4.3-alpine

WORKDIR /app
# No runtime dependencies, so there is nothing to install.
COPY package.json ./
COPY src ./src
# Reads the free credit ledger: `docker exec rhema-server bun scripts/free-usage.ts`.
COPY scripts/free-usage.ts ./scripts/

RUN mkdir -p /data && chown bun:bun /data
USER bun

ENV DATABASE_PATH=/data/rhema-server.db
VOLUME /data
EXPOSE 8787
CMD ["bun", "src/main.ts"]
