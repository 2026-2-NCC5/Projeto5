# Runbook operacional — Backup, restauração, segredos e recuperação

## 1. Objetivos

| Indicador | Meta | Controle |
|---|---:|---|
| RPO | ≤ 6 horas | `pg_dump` periódico; reduzir `BACKUP_INTERVAL_SECONDS` para políticas mais rígidas |
| RTO | ≤ 30 minutos | imagem validada, Compose, restore automatizado e checklist |
| Retenção local | 14 dias | `BACKUP_RETENTION_DAYS` |
| Recuperação regional | cópia off-site | sincronização opcional com Cloudflare R2 |

O RTO deve ser cronometrado e registrado nos exercícios mensais.

## 2. Inicialização segura

Linux/macOS:

```bash
cp .env.example .env
./scripts/gen-secrets.sh
docker compose up -d --build
docker compose ps
```

Windows:

```powershell
Copy-Item .env.example .env
powershell -ExecutionPolicy Bypass -File scripts/gen-secrets.ps1 -GeminiKey "SUA_CHAVE"
docker compose up -d --build
```

Nunca envie `secrets/`, `.env`, `infra/nginx/htpasswd` ou `infra/nginx/certs/server.key` para repositórios ou entregas.

## 3. Backup

O serviço `backup` executa `pg_dump -Fc`, cria `*.sha256` e remove arquivos acima da retenção.

```bash
docker compose logs backup
docker compose exec backup sh -c 'export PGPASSWORD="$(cat "$PGPASSWORD_FILE")"; pg_dump -Fc -f /backups/manual_$(date +%s).dump'
```

### Cópia off-site para R2

Forneça as credenciais pelo cofre ou ambiente do operador:

```bash
R2_ACCOUNT_ID=... \
R2_ACCESS_KEY_ID=... \
R2_SECRET_ACCESS_KEY=... \
R2_BUCKET=... \
./scripts/backup-offsite-r2.sh
```

A rotina usa checksum e `--immutable`. A chave deve ter somente acesso ao prefixo de backup.

## 4. Restauração

Teste isolado do backup mais recente:

```bash
./scripts/restore.sh
```

Restauração de produção, com confirmação explícita:

```bash
TARGET=production ./scripts/restore.sh /backups/alvaro_YYYYMMDDTHHMMSSZ.dump
```

Checklist:

1. registrar início do incidente;
2. confirmar checksum;
3. parar gravações/API;
4. restaurar;
5. validar `/api/health`;
6. validar contagens e login por perfil;
7. registrar término e RTO observado;
8. preservar logs e causa raiz.

## 5. Segredos e rotação

- Local/VM: arquivos com modo 600 montados em `/run/secrets`.
- Produção: GitHub Environments, Cloudflare Secrets e Supabase.
- JWT: trocar valor e encerrar sessões.
- Banco: `ALTER USER`, atualizar cofre/Hyperdrive e reiniciar gradualmente.
- R2/Gemini: revogar a chave anterior após validar a nova.
- Grafana: trocar segredo e recriar somente o serviço.

## 6. Controle de acesso

- liberar somente 80/443; SSH restrito por IP;
- banco, Prometheus e Loki sem portas públicas;
- Grafana com Basic Auth + login próprio;
- API com autenticação e RBAC no backend;
- revisar auditoria e logs após qualquer incidente.

## 7. Cenários de recuperação

| Cenário | Detecção | Resposta |
|---|---|---|
| API indisponível | `ApiDown`/healthcheck | reinício automático; rollback se persistir |
| Banco indisponível | `DatabaseDown` | bloquear gravações, investigar e restaurar último backup válido |
| Deploy ruim | erro 5xx/latência | ativar versão anterior no Cloudflare ou imagem anterior na VM |
| Perda da VM | monitor externo | nova VM, DNS/TLS, Compose, segredos do cofre e backup off-site |
| Segredo exposto | auditoria/alerta | revogar, rotacionar e revisar logs |
| Região indisponível | status do provedor | ativar plano do provedor e restaurar cópia off-site |
