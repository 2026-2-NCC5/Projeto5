#!/bin/sh
# Lê segredos de arquivos (Docker secrets) e os exporta como variáveis de ambiente.
# Convenção: VAR_FILE=/run/secrets/x  ->  VAR=<conteúdo de x>
set -eu
for v in JWT_SECRET GEMINI_API_KEY DOCUMENT_SIGNING_SECRET DB_PASSWORD SUPABASE_SERVICE_ROLE_KEY SUPABASE_ANON_KEY; do
  f=$(printenv "${v}_FILE" 2>/dev/null || true)
  if [ -n "$f" ] && [ -r "$f" ]; then export "$v=$(cat "$f")"; fi
done
# Monta DATABASE_URL a partir de partes, sem deixar a senha no compose.
if [ -z "${DATABASE_URL:-}" ] && [ -n "${DB_HOST:-}" ]; then
  export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT:-5432}/${DB_NAME}?connection_limit=${DB_POOL:-10}"
fi
# Aplica o schema (idempotente) antes de subir; falha derruba o container.
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo '{"level":"info","msg":"prisma_db_push_start"}'
  node node_modules/prisma/build/index.js db push --skip-generate
fi
exec "$@"
