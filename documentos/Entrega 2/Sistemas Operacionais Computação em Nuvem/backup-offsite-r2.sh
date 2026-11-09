#!/bin/sh
# Copia o volume de backups para Cloudflare R2 usando credenciais fornecidas pelo ambiente.
# Uso: R2_ACCOUNT_ID=... R2_ACCESS_KEY_ID=... R2_SECRET_ACCESS_KEY=... R2_BUCKET=... ./scripts/backup-offsite-r2.sh
set -eu
: "${R2_ACCOUNT_ID:?Informe R2_ACCOUNT_ID}"
: "${R2_ACCESS_KEY_ID:?Informe R2_ACCESS_KEY_ID}"
: "${R2_SECRET_ACCESS_KEY:?Informe R2_SECRET_ACCESS_KEY}"
: "${R2_BUCKET:?Informe R2_BUCKET}"
PROJECT="${COMPOSE_PROJECT_NAME:-alvaro-ai}"
docker run --rm \
  -v "${PROJECT}_backups:/data:ro" \
  -e RCLONE_CONFIG_R2_TYPE=s3 \
  -e RCLONE_CONFIG_R2_PROVIDER=Cloudflare \
  -e "RCLONE_CONFIG_R2_ACCESS_KEY_ID=$R2_ACCESS_KEY_ID" \
  -e "RCLONE_CONFIG_R2_SECRET_ACCESS_KEY=$R2_SECRET_ACCESS_KEY" \
  -e "RCLONE_CONFIG_R2_ENDPOINT=https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com" \
  rclone/rclone:1.68.2 sync /data "r2:${R2_BUCKET}/postgres-backups" --checksum --immutable
printf '%s\n' 'Sincronização off-site concluída.'
