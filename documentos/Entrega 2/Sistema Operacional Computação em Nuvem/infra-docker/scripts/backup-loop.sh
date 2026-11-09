#!/bin/sh
# Backup lógico periódico do PostgreSQL (pg_dump formato custom) com checksum e retenção.
set -eu
export PGPASSWORD="$(cat "$PGPASSWORD_FILE")"
INTERVAL="${BACKUP_INTERVAL_SECONDS:-21600}"
RETENTION="${BACKUP_RETENTION_DAYS:-14}"
mkdir -p /backups
while true; do
  TS="$(date -u +%Y%m%dT%H%M%SZ)"
  OUT="/backups/${PGDATABASE}_${TS}.dump"
  if pg_dump --format=custom --compress=6 --no-owner --file="$OUT.tmp"; then
    mv "$OUT.tmp" "$OUT"
    (cd /backups && sha256sum "$(basename "$OUT")" > "$(basename "$OUT").sha256")
    echo "{\"level\":\"info\",\"service\":\"backup\",\"msg\":\"backup_ok\",\"file\":\"$OUT\",\"bytes\":$(wc -c < "$OUT")}"
  else
    rm -f "$OUT.tmp"
    echo "{\"level\":\"error\",\"service\":\"backup\",\"msg\":\"backup_failed\"}"
  fi
  find /backups -name '*.dump' -mtime +"$RETENTION" -delete
  find /backups -name '*.sha256' -mtime +"$RETENTION" -delete
  sleep "$INTERVAL"
done
