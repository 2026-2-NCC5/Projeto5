#!/bin/sh
# Gera segredos locais, credenciais do painel e certificado de desenvolvimento.
# Em produção, substitua os arquivos por valores vindos do cofre do provedor e use TLS válido.
set -eu
ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
SECRETS="$ROOT/secrets"
CERTS="$ROOT/infra/nginx/certs"
mkdir -p "$SECRETS" "$CERTS"

random_secret() { openssl rand -base64 "$1" | tr -d '/+=' | cut -c1-"$2"; }
write_once() { [ -s "$1" ] || { umask 077; printf '%s' "$2" > "$1"; }; }

write_once "$SECRETS/db_password.txt" "$(random_secret 32 32)"
write_once "$SECRETS/jwt_secret.txt" "$(random_secret 48 48)"
write_once "$SECRETS/document_signing_secret.txt" "$(random_secret 48 48)"
write_once "$SECRETS/grafana_admin_password.txt" "$(random_secret 24 24)"
write_once "$SECRETS/gemini_api_key.txt" "${GEMINI_API_KEY:-NAO_CONFIGURADA}"

if [ ! -s "$ROOT/infra/nginx/htpasswd" ]; then
  monitor_password="$(random_secret 24 24)"
  printf 'monitor:%s\n' "$(openssl passwd -apr1 "$monitor_password")" > "$ROOT/infra/nginx/htpasswd"
  write_once "$SECRETS/monitor_basic_auth.txt" "usuario=monitor
senha=$monitor_password"
fi

if [ ! -s "$CERTS/server.crt" ] || [ ! -s "$CERTS/server.key" ]; then
  openssl req -x509 -nodes -newkey rsa:2048 -days 30 -subj '/CN=localhost' \
    -addext 'subjectAltName=DNS:localhost,IP:127.0.0.1' \
    -keyout "$CERTS/server.key" -out "$CERTS/server.crt" >/dev/null 2>&1
fi
chmod 600 "$SECRETS"/*.txt "$CERTS/server.key" "$ROOT/infra/nginx/htpasswd"
printf '%s\n' 'Segredos locais gerados. Não inclua secrets/, .env, htpasswd ou server.key na entrega.'
