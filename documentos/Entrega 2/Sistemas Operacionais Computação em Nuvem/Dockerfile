# syntax=docker/dockerfile:1.7
FROM node:22-bookworm-slim

ENV NODE_ENV=production \
    PORT=3001 \
    METRICS_PORT=9100

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates tini wget \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
# O Prisma CLI permanece na imagem porque o entrypoint aplica o schema de forma
# idempotente antes da API iniciar. npm é fixado para tornar o build previsível.
RUN npm install -g npm@11.6.2 --no-audit --no-fund \
 && npm ci --include=dev --no-audit --no-fund

COPY --chown=node:node . .
# O ambiente Docker usa PostgreSQL e o cliente Prisma nativo do Node.
RUN sed -e '/output *=/d' -e '/engineType *=/d' prisma/schema.postgresql.prisma > prisma/schema.prisma \
 && npx prisma generate \
 && chmod +x /app/docker-entrypoint.sh \
 && chown -R node:node /app

USER node
EXPOSE 3001 9100
HEALTHCHECK --interval=15s --timeout=3s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/livez || exit 1
ENTRYPOINT ["/usr/bin/tini", "--", "/app/docker-entrypoint.sh"]
CMD ["node", "--import", "tsx", "src/ops/server.ts"]
