# Arquitetura efetivamente publicada

A produção do iÁlvaro é uma arquitetura gerenciada em nuvem:

1. **Cloudflare Workers:** frontend React e API Express adaptada para Worker na mesma origem.
2. **Cloudflare Hyperdrive:** pool e transporte TLS até o PostgreSQL.
3. **Supabase:** PostgreSQL persistente e Supabase Auth.
4. **Google Gemini:** geração das respostas do agente e apoio às rotinas de IA/RAG.
5. **Cloudflare R2:** anexos, banners e documentos.
6. **Worker PDF privado:** extração de PDFs por service binding, sem endpoint público.
7. **GitHub Actions:** build, testes, publicação e regressão autenticada por perfil.

O Compose incluído é a referência portável para execução em VM e para observabilidade detalhada de sistema operacional. Ele reproduz API, banco e telemetria sem substituir a implantação gerenciada em produção.

## Fluxo de publicação

`push main → build/test → migrações versionadas Supabase → wrangler deploy → regressão por perfis`

As credenciais ficam em GitHub Environments e Cloudflare Secrets. Nenhum valor sensível faz parte desta entrega.
