#!/bin/sh
# Restauração. Uso:
#   ./scripts/restore.sh [arquivo.dump]        (padrão: backup mais recente)  -> restaura em banco de TESTE "alvaro_restore_test"
#   TARGET=production ./scripts/restore.sh X   -> restaura sobre o banco real (DESTRUTIVO; pede confirmação)
set -eu
cd "$(dirname "$0")/.."
FILE="${1:-}"
if [ -z "$FILE" ]; then
  FILE="$(docker compose exec -T backup sh -c 'ls -1t /backups/*.dump | head -1' | tr -d '\r')"
fi
echo ">> Arquivo: $FILE"
docker compose exec -T backup sh -c "export PGPASSWORD=\$(cat \"\$PGPASSWORD_FILE\"); cd /backups && sha256sum -c $(basename "$FILE").sha256"

DB="${DB_NAME:-alvaro}"; USER_="${DB_USER:-alvaro}"
if [ "${TARGET:-test}" = "production" ]; then
  printf "ISSO SOBRESCREVE o banco '%s'. Digite RESTAURAR para continuar: " "$DB"; read -r a; [ "$a" = "RESTAURAR" ] || exit 1
  docker compose stop api
  docker compose exec -T backup sh -c "export PGPASSWORD=\$(cat \"\$PGPASSWORD_FILE\"); pg_restore --clean --if-exists --no-owner -d $DB $FILE"
  docker compose start api
else
  T="${DB}_restore_test"
  docker compose exec -T backup sh -c "export PGPASSWORD=\$(cat \"\$PGPASSWORD_FILE\"); dropdb --if-exists $T; createdb $T; pg_restore --no-owner -d $T $FILE"
  echo ">> Verificação (contagem de tabelas e linhas por tabela no banco restaurado):"
  docker compose exec -T backup sh -c "export PGPASSWORD=\$(cat \"\$PGPASSWORD_FILE\"); psql -d $T -Atc \"select count(*) || ' tabelas' from information_schema.tables where table_schema='public'\""
  docker compose exec -T backup sh -c "export PGPASSWORD=\$(cat \"\$PGPASSWORD_FILE\"); psql -d $T -c \"select relname as tabela, n_live_tup as linhas from pg_stat_user_tables order by 1\""
  docker compose exec -T backup sh -c "export PGPASSWORD=\$(cat \"\$PGPASSWORD_FILE\"); dropdb $T"
fi
echo ">> Restauração concluída."
