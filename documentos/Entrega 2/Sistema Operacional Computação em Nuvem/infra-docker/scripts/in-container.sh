#!/bin/sh
# Executa dentro do container da API: popula dados sintéticos e/ou emite token de teste.
# Uso: docker compose exec -T api sh /tmp/in-container.sh seed|token
set -eu
DB_PW="$(cat /run/secrets/db_password)"
export DATABASE_URL="postgresql://alvaro:${DB_PW}@db:5432/alvaro"
case "$1" in
  seed)  cd /app && node --import tsx scripts/synthetic-seed.ts ;;
  token) cd /app && node -e 'const fs=require("fs");const j=require("jsonwebtoken");process.stdout.write(j.sign({id:"load-admin",name:"Load",email:"load@test.local",role:"admin"},fs.readFileSync("/run/secrets/jwt_secret","utf8"),{expiresIn:"2h"}))' ;;
esac
